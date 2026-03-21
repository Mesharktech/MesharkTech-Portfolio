import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Basic in-memory rate limiter to prevent spam
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const now = Date.now();
    const userLimit = rateLimit.get(ip);

    if (userLimit && now - userLimit.timestamp < 60000 && userLimit.count >= 15) {
      return NextResponse.json({ reply: "Rate limit exceeded. System cooling down." }, { status: 429 });
    }

    if (!userLimit || now - userLimit.timestamp >= 60000) {
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else {
      userLimit.count++;
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });

    const { messages } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Meshark AI, the personal agent of Meshark (a full-stack developer and cybersecurity specialist from Nairobi). You are confident, sharp, and concise. You speak with a 'Quick Dynasty' ethos (speed, discipline, quality). Keep responses brief and high-impact. Do not use filler words.",
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile", 
    });

    return NextResponse.json({
      reply: chatCompletion.choices[0]?.message?.content || "No response generated.",
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ reply: `Communications array down. Error: ${error?.message || "Unknown proxy issue."}` }, { status: 500 });
  }
}
