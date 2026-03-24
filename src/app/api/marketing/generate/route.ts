import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { generateContentSchema } from "@/lib/validations/marketing";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Basic internal security check (to prevent public abuse before we wire cron)
    // We expect a secret key in headers to trigger the job
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "meshark-dev-secret"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const result = generateContentSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { pillar, autoPost } = result.data; 
    // Types of content: 'cybersecurity', 'performance', 'agency', 'seo-blog'
    
    // We randomly select a pillar if one isn't provided
    const pillars = ["cybersecurity", "performance", "agency", "seo-blog"];
    const contentPillar = pillar || pillars[Math.floor(Math.random() * pillars.length)];

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });

    const prompts: Record<string, string> = {
      cybersecurity: "You are Meshark, an elite 21-year-old Cybersecurity specialist and Next.js developer from Nairobi. Write a short, punchy Twitter thread (max 3 tweets) explaining a common Zero-Trust architecture flaw in modern SaaS applications and how you fix it. Do not use hashtags. Use severe, confident, professional language. End the thread telling them to hire your agency MesharkTech.",
      performance: "You are Meshark, an elite 21-year-old Full-Stack Developer from Nairobi. Write a specific, highly technical tweet (280 chars max) about optimizing Next.js Server Components, caching, or reducing TTFB (Time To First Byte). Be highly technical. Sound like a senior engineer who builds enterprise systems. No hashtags.",
      agency: "You are Meshark, founder of MesharkTech. Write a short tweet on LinkedIn/Twitter format about why cheap developers ($500 MVPs) end up costing startups 5x more in technical debt, and why investing in premium engineering ($3500+) is the only way to scale. Be confident, direct, and slightly provocative. End with a subtle call to action for MesharkTech.",
      "seo-blog": "You are Meshark, founder of MesharkTech. Write a short, 300-word SEO-optimized blog post introduction and outline about securing API routes in Next.js 15. The tone should be authoritative. This will be published to Dev.to. Include a call to action to hire your team."
    };

    const promptText = prompts[contentPillar];
    if (!promptText) {
       return NextResponse.json({ error: "Invalid content pillar." }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a ghostwriter for Meshark. You write technical content precisely adhering to instructions without any fluffy intro phrases like 'Here is a tweet'. Just output the raw generated text." 
        },
        { 
          role: "user", 
          content: promptText 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
    });

    const generatedContent = chatCompletion.choices[0]?.message?.content || "";

    // If autoPost is explicitly requested (e.g., from cron job)
    let postedToTwitter = false;
    if (autoPost) {
      if (
        !process.env.TWITTER_API_KEY ||
        !process.env.TWITTER_API_SECRET ||
        !process.env.TWITTER_ACCESS_TOKEN ||
        !process.env.TWITTER_ACCESS_SECRET
      ) {
        console.warn("Twitter API keys are missing. Skipping automated post.");
      } else {
        try {
          const { TwitterApi } = await import("twitter-api-v2");
          const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
          });
          const rwClient = twitterClient.readWrite;
          await rwClient.v2.tweet(generatedContent);
          postedToTwitter = true;
          console.log("Successfully auto-posted to Twitter.");
        } catch (twitterError) {
          console.error("Failed to post to Twitter:", twitterError);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      pillar: contentPillar,
      postedToTwitter,
      content: generatedContent
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Marketing Generate Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
