import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const key = process.env.GNANI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GNANI_API_KEY is missing." },
      { status: 500 }
    );
  }

  try {
    const form = await request.formData();
    const audio = form.get("audio");

    if (!(audio instanceof File) || audio.size === 0 || audio.size > 5_000_000) {
      return NextResponse.json(
        { error: "Upload a WAV recording under 5 MB." },
        { status: 400 }
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("audio_file", audio, "recording.wav");
    upstreamForm.append("model", "prisma-v3.0");
    upstreamForm.append("language_code", "indic-auto");
    upstreamForm.append("format", "transliterate");

    const response = await fetch("https://api.vachana.ai/stt/v3", {
      method: "POST",
      headers: { "X-API-Key-ID": key },
      body: upstreamForm,
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || typeof result?.transcript !== "string") {
      return NextResponse.json(
        { error: `Gnani transcription failed (HTTP ${response.status}).` },
        { status: 502 }
      );
    }

    return NextResponse.json({ transcript: result.transcript });
  } catch (error) {
    console.error("Gnani STT request failed:", error);
    return NextResponse.json(
      { error: "Could not transcribe the recording." },
      { status: 500 }
    );
  }
}
