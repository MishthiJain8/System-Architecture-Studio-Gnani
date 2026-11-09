"use client";

import { useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

async function toWav(blob: Blob): Promise<Blob> {
  const audioContext = new AudioContext();

  try {
    const decoded = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const sampleRate = 16000;

    const offline = new OfflineAudioContext(
      1,
      Math.ceil(decoded.duration * sampleRate),
      sampleRate
    );

    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();

    const samples = (await offline.startRendering()).getChannelData(0);
    const wav = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(wav);

    const write = (at: number, value: string) => {
      for (let i = 0; i < value.length; i++) {
        view.setUint8(at + i, value.charCodeAt(i));
      }
    };

    write(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    write(8, "WAVE");
    write(12, "fmt ");
    view.setUint32(16, 16, true);

    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    write(36, "data");
    view.setUint32(40, samples.length * 2, true);

    samples.forEach((sample, i) => {
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(
        44 + i * 2,
        clamped < 0 ? clamped * 32768 : clamped * 32767,
        true
      );
    });

    return new Blob([wav], { type: "audio/wav" });
  } finally {
    await audioContext.close();
  }
}

export function GnaniVoiceRecorder({
  onTranscript,
  disabled = false,
}: Props) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }

    setError("");

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Microphone recording is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setBusy(true);

        try {
          const wav = await toWav(
            new Blob(chunks, { type: recorder.mimeType })
          );

          const form = new FormData();
          form.append("audio", wav, "recording.wav");

          const response = await fetch("/api/ai/gnani-transcribe", {
            method: "POST",
            body: form,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Transcription failed");
          }

          if (!data.transcript?.trim()) {
            throw new Error("No speech detected. Try again.");
          }

          onTranscript(data.transcript.trim());
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Voice request failed"
          );
        } finally {
          setBusy(false);
        }
      };

      recorder.start();
      setRecording(true);

      timerRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 28_000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Microphone access denied"
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled || busy}
        className="self-start border-[2px] border-black bg-[#9cf57a] px-4 py-2 text-sm font-black disabled:opacity-50"
      >
        {busy
          ? "Gnani is transcribing..."
          : recording
            ? "⏹ Stop recording"
            : "🎙 Speak with Gnani Prisma"}
      </button>

      <p className="text-xs font-semibold text-gray-600">
        {recording
          ? "Speak now (maximum 28 seconds)."
          : "Try English, Hindi or Hinglish. Transcript fills the prompt above."}
      </p>

      {error && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
