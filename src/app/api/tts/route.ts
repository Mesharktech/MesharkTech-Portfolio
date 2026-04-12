import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Sanitizes text before sending to ElevenLabs TTS:
 * - Replaces URLs with "the link in the chat"
 * - Strips markdown symbols (asterisks, underscores, backticks, hashes)
 * - Normalizes whitespace
 * - Hard limit of 500 characters
 */
function sanitizeForSpeech(raw: string): string {
  return raw
    .replace(/https?:\/\/\S+/gi, "the link in the chat")
    .replace(/\*\*?|__?|`+|#{1,6}\s?/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "TTS key missing" }, { status: 500 });
    }

    const safeText = sanitizeForSpeech(text);
    if (!safeText) {
      return NextResponse.json({ error: "Empty text after sanitization" }, { status: 400 });
    }

    // Voice: George (JBFqnCBsd6RMkjVDRZzb) — deep, professional male voice
    // To use your cloned voice, swap this VOICE_ID with your ElevenLabs Voice Lab ID
    const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: safeText,
          model_id: "eleven_turbo_v2_5", // Low latency, available on free tier
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ElevenLabs API error:", errorBody);
      return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS endpoint error:", error);
    return NextResponse.json({ error: "TTS endpoint failed" }, { status: 500 });
  }
}
