"use client";

import { useRef, useState } from "react";

export function GnaniSpeechPlayer({ text }: { text: string }) {
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  async function play() {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    setError("");
    setBusy(true);

    try {
      audioRef.current?.pause();

      if (urlRef.current) URL.revokeObjectURL(urlRef.current);

      const summary = text
        .replace(/[#*_`>|\[\]()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 750);

      const response = await fetch("/api/ai/gnani-speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Voice generation failed");
      }

      const objectUrl = URL.createObjectURL(await response.blob());
      urlRef.current = objectUrl;

      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);

      await audio.play();
      setPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio playback failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={play}
        disabled={busy}
        className="border-[2px] border-black bg-[#5de2e7] px-3 py-2 text-xs font-black disabled:opacity-50"
      >
        {busy
          ? "Generating Gnani voice..."
          : playing
            ? "⏸ Pause voice"
            : "🔊 Speak summary with Gnani Timbre"}
      </button>

      <span className="text-xs text-gray-600">
        Reads the first part of the explanation.
      </span>

      {error && (
        <span role="alert" className="text-xs font-bold text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
