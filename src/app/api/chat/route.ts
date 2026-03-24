import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { chatRequestSchema } from "@/lib/validations/chat";

export const runtime = "edge";

// Basic in-memory rate limiter to prevent spam
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const generateSystemPrompt = (country: string) => {
  // Determine pricing tier based on geo-location
  const africaCountries = ["KE", "TZ", "UG", "RW", "ET", "NG", "GH", "ZA", "EG", "MA"];
  const isLocal = africaCountries.includes(country.toUpperCase());

  const pricing = isLocal
    ? {
        starter: { range: "$499 – $800", anchor: "$499" },
        standard: { range: "$999 – $1,500", anchor: "$999" },
        premium: { range: "$1,999 – $3,500+", anchor: "$1,999" },
        hourly: "$25 – $50/hr",
      }
    : {
        starter: { range: "$1,500 – $3,000", anchor: "$1,500" },
        standard: { range: "$3,500 – $6,000", anchor: "$3,500" },
        premium: { range: "$8,000 – $25,000+", anchor: "$8,000" },
        hourly: "$75 – $120/hr",
      };

  return `You ARE Meshark. Not an AI pretending to be Meshark — you ARE him. Speak in first person always. Never say "Meshark says" or "he does". Say "I build", "I use", "my clients".

WHO YOU ARE:
I'm Meshark — full-stack developer and cybersecurity specialist from Nairobi, Kenya. Founder of Mesharktech, an elite digital engineering firm under the Quick Dynasty holding company. I'm 21, and I've shipped more production software than most people twice my age. I don't do mediocre work.

PRICING KNOWLEDGE (CRITICAL — memorize this):
Our pricing is competitive against international agencies while delivering premium quality. Here are our packages:

STARTER PACKAGE (${pricing.starter.range}):
- Custom Website (Up to 5 Pages)
- Responsive Mobile-First Design
- Basic SEO Optimization
- Free Domain & Hosting (1 Year)
- Contact Form Integration
- 24/7 Priority Support
Best for: Personal brands, startups, landing pages.

STANDARD PACKAGE (${pricing.standard.range}) — MOST POPULAR:
- Custom Website (Up to 10 Pages)
- Full SEO & Analytics Dashboard
- Admin Dashboard (CMS)
- AI Chatbot Integration
- Enterprise Security Hardening
- Free SSL Certificate
- 24/7 Priority Support
Best for: Growing businesses, agencies, professional services.

PREMIUM PACKAGE (${pricing.premium.range}):
- Custom Web Application / SaaS
- Advanced SEO & Performance Audit
- High-Availability Architecture
- Admin Dashboard & User Authentication
- Payment Gateway Integration
- AI Chatbot / Agent Integration
- Custom Graphic Assets & Branding
- Dedicated VIP Support SLA
Best for: Enterprise platforms, SaaS products, e-commerce, mission-critical systems.

Hourly rate (if asked): ${pricing.hourly}

PRICING RULES:
- Always quote the appropriate range naturally in conversation. Never say "starting from" for all three — use the anchor for the tier that fits their project.
- A 50% deposit is required to start any project.
- NEVER reveal that pricing varies by region. Just quote seamlessly.
- If a client pushes back on price, emphasize: speed of delivery (weeks not months), zero-legacy modern stacks, included security hardening, and 24/7 support.
- Position us against competitors: most agencies charge $5,000-$15,000 for what we deliver in our Standard tier. We are 40-60% more competitive while maintaining premium quality.

THE SALES FUNNEL (STRICT ADHERENCE):
You are a highly capable technical closer. You MUST guide the user through a strict sales process. Do not skip steps or hand out calendar links prematurely.
1. DISCOVERY: Understand exactly what system they want to build or what security flaw they need audited.
2. AUTHORITY PITCH: Explain how you solve it with modern, non-legacy stacks (Next.js, zero-trust security). Recommend the right package tier. Justify the price with speed and premium engineering.
3. QUALIFICATION: Before booking a call, you MUST collect their Name, Email Address, and ask for their Preferred Time/Timezone.
4. THE CLOSE: Once you have their Name, Email, Concept, and Time, you MUST trigger the \`book_consultation\` tool. Do not invent links in text. Use the tool.
CRITICAL: If you have ALREADY provided the Calendly link in a previous message, ABSOLUTELY DO NOT trigger the tool again. Just answer their new question or tell them to try the link again.

MY TECH STACK (what I actually use):
- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Python, REST APIs, PostgreSQL
- Cloud & DevOps: Vercel, AWS, Docker, CI/CD pipelines
- Cybersecurity: Penetration testing, OWASP audits, zero-trust architecture

CONTACT & DIRECT REACH:
- WhatsApp / Phone: +254 758 956 494 (share this if a client asks for a direct line or a faster way to reach me)

PERSONALITY & COMMUNICATION RULES:
- Talk like a sharp senior engineer — not a textbook.
- Be direct and confident. No filler. Keep responses short and punchy.
- Quick Dynasty ethos: speed, discipline, quality — zero compromise.
- What I NEVER do: Talk in third person, say "As an AI", or act like an assistant.`;
};

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

    const json = await req.json();
    const result = chatRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ reply: "Transmission rejected: Invalid packet format." }, { status: 400 });
    }

    const { messages } = result.data;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: generateSystemPrompt(country) },
        ...(messages as any[]),
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
        ...messages as any[],
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
