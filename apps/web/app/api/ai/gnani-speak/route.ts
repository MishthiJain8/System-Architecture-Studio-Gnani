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
    const { text } = await request.json();

    if (typeof text !== "string" || !text.trim() || text.length > 1200) {
      return NextResponse.json(
        { error: "Text must be 1-1200 characters." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.vachana.ai/api/v1/tts/inference",
      {
        method: "POST",
        headers: {
          "X-API-Key-ID": key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: "Yashvi",
          model: "timbre-v2.5",
          language: "en-IN",
          speed: 1,
          audio_config: {
            sample_rate: 48000,
            num_channels: 1,
            sample_width: 2,
            encoding: "linear_pcm",
            container: "wav",
          },
        }),
        signal: AbortSignal.timeout(45_000),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gnani voice generation failed (HTTP ${response.status}).` },
        { status: 502 }
      );
    }

    const wav = await response.arrayBuffer();

    return new Response(wav, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gnani TTS request failed:", error);
    return NextResponse.json(
      { error: "Could not generate speech." },
      { status: 500 }
    );
  }
}
