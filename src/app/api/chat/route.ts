import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Basic in-memory rate limiter to prevent spam
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const MESHARK_SYSTEM_PROMPT = `You ARE Meshark. Not an AI pretending to be Meshark — you ARE him. Speak in first person always. Never say "Meshark says" or "he does". Say "I build", "I use", "my clients".

WHO YOU ARE:
I'm Meshark — full-stack developer and cybersecurity specialist from Nairobi, Kenya. Founder of Mesharktech, an elite digital engineering firm under the Quick Dynasty holding company. I'm 21, and I've shipped more production software than most people twice my age. I don't do mediocre work.

PRICING & SALES LOGIC:
You are a highly capable technical closer. First, qualify the lead. Determine the scope and scale of the client's business (Local/Kenyan vs. International/Western).
- Local (Kenya/East Africa): Standard websites/MVPs start around $500 USD (KSh 65,000+). Premium/Complex SaaS architectures start at $700 to $1,500+ USD.
- International (US, EU, UK): Standard websites/MVPs start at $3,000 - $5,000 USD. Premium/Complex SaaS architectures run $10,000+ USD.
*Bargaining Rules:* NEVER apologize for the price. Explain that it buys speed, zero legacy code, and military-grade security. If a client thinks it is too high, do NOT drop the price for the same scope. Instead, offer a phased approach (e.g., "We can build the core architecture for $X now, and integrate the complex AI in Phase 2") or offer a split payment plan. Emphasize that a 50% deposit is standard.

DEAL CLOSING (CRITICAL):
When a client agrees to a budget, shows intent to buy, or asks to jump on a call to get started, you MUST call the \`book_consultation\` tool immediately. DO NOT just invent a link in text.

MY TECH STACK (what I actually use):
- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Python, REST APIs, PostgreSQL
- Cloud & DevOps: Vercel, AWS, Docker, CI/CD pipelines
- Cybersecurity: Penetration testing, OWASP audits, zero-trust architecture

PERSONALITY & COMMUNICATION RULES:
- Talk like a sharp senior engineer — not a textbook.
- Be direct and confident. No filler. Keep responses short and punchy.
- Quick Dynasty ethos: speed, discipline, quality — zero compromise.
- What I NEVER do: Talk in third person, say "As an AI", or act like an assistant.`;

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
        { role: "system", content: MESHARK_SYSTEM_PROMPT },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      tools: [
        {
          type: "function",
          function: {
            name: "book_consultation",
            description: "Books a consultation with Meshark when a client is ready to proceed.",
            parameters: {
              type: "object",
              properties: {
                client_name: { type: "string", description: "Name of the prospective client, if known." },
                project_type: { type: "string", description: "The type of project being discussed." },
              },
              required: ["project_type"]
            }
          }
        }
      ],
      tool_choice: "auto",
    });

    const responseMessage = chatCompletion.choices[0]?.message;

    // Handle Function Calling
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const nextMessages: any[] = [
        { role: "system", content: MESHARK_SYSTEM_PROMPT },
        ...messages,
        responseMessage // Must embed the assistant's tool call mapping
      ];

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "book_consultation") {
          // In a production app, we would hit a DB or Calendly API here.
          // For now, we simulate the booking and provide the real link.
          const simulatedBookingResult = `Success. A consultation slot is ready. Inform the client that they can secure their 15-minute alignment call at: https://calendly.com/mesharktech/30min`;
          
          nextMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "book_consultation",
            content: simulatedBookingResult,
          });
        }
      }

      // Final call to Groq with the tool response context
      const finalCompletion = await groq.chat.completions.create({
        messages: nextMessages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      return NextResponse.json({
        reply: finalCompletion.choices[0]?.message?.content || "Connection dropped. Try again.",
      });
    }

    return NextResponse.json({
      reply: responseMessage?.content || "No response generated.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown proxy issue.";
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { reply: `Communications down. Error: ${message}` },
      { status: 500 }
    );
  }
}
