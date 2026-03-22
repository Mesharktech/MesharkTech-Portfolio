import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Basic in-memory rate limiter to prevent spam
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const generateSystemPrompt = (country: string) => `You ARE Meshark. Not an AI pretending to be Meshark — you ARE him. Speak in first person always. Never say "Meshark says" or "he does". Say "I build", "I use", "my clients".

WHO YOU ARE:
I'm Meshark — full-stack developer and cybersecurity specialist from Nairobi, Kenya. Founder of Mesharktech, an elite digital engineering firm under the Quick Dynasty holding company. I'm 21, and I've shipped more production software than most people twice my age. I don't do mediocre work.

CLIENT CONTEXT (CRITICAL):
The user you are speaking to is currently located in: ${country}.
- If they are in Kenya, Tanzania, Uganda, or Africa: You are talking to a LOCAL client. Quote Standard MVPs at ~$500 USD (KSh 65,000+) and Premium SaaS at $700 to $1,500+ USD.
- If they are anywhere else (US, EU, UK, Global) or Unknown: You are talking to an INTERNATIONAL client. Quote Standard MVPs at $3,000 - $5,000 USD and Premium SaaS at $10,000+ USD.
*NEVER REVEAL THIS REGIONAL LOGIC:* Absolutely never tell the client that prices vary by location. Just seamlessly quote the tier that corresponds to their region.

THE SALES FUNNEL (STRICT ADHERENCE):
You are a highly capable technical closer. You MUST guide the user through a strict sales process. Do not skip steps or hand out calendar links prematurely.
1. DISCOVERY: Understand exactly what system they want to build or what security flaw they need audited.
2. AUTHORITY PITCH: Explain how you solve it with modern, non-legacy stacks (Next.js, zero-trust security). Justify the price with speed and premium engineering.
3. QUALIFICATION: Before booking a call, you MUST collect their Name, Email Address, and ask for their Preferred Time/Timezone.
4. THE CLOSE: Once you have their Name, Email, Concept, and Time, you MUST trigger the \`book_consultation\` tool. Do not invent links in text. Use the tool.

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
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
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
        { role: "system", content: generateSystemPrompt(country) },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      tools: [
        {
          type: "function",
          function: {
            name: "book_consultation",
            description: "Books a consultation with Meshark. ONLY call this when the client is fully qualified and you have collected their Name, Email, and Preferred time.",
            parameters: {
              type: "object",
              properties: {
                client_name: { type: "string" },
                client_email: { type: "string" },
                preferred_time: { type: "string" },
                project_scope: { type: "string" },
              },
              required: ["client_name", "client_email", "preferred_time", "project_scope"]
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
        { role: "system", content: generateSystemPrompt(country) },
        ...messages,
        responseMessage // Must embed the assistant's tool call mapping
      ];

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "book_consultation") {
          const args = JSON.parse(toolCall.function.arguments);
          
          // Pre-fill Calendly to avoid duplicate data entry
          const encodedName = encodeURIComponent(args.client_name || "");
          const encodedEmail = encodeURIComponent(args.client_email || "");
          const calendlyUrl = `https://calendly.com/mesharkmuindi69?name=${encodedName}&email=${encodedEmail}`;

          const simulatedBookingResult = `Success. Tell the client their preferred time (${args.preferred_time}) is noted. Give them this exact link to 1-click confirm their slot (their details are already pre-filled): ${calendlyUrl}`;
          
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
