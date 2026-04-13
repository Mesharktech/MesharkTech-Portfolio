import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { generateContentSchema } from "@/lib/validations/marketing";

export const runtime = "edge";

/**
 * Handles automated and manual content generation requests.
 * Enforces authorization via the CRON_SECRET environment variable.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The JSON response containing generated content or error.
 */
export async function POST(req: Request) {
  try {
    // Basic internal security check
    // We expect a secret key in headers to trigger the job
    const authHeader = req.headers.get("authorization");
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

    // Dynamic randomization pools to ensure varied content every generation
    const cyberTopics = [
      "JWT token vulnerabilities in client-side storage",
      "SSRF attacks via misconfigured webhooks",
      "IDOR issues in multitenant databases",
      "Bypassing MFA schemas using legacy fallback routes",
      "Why basic rate limiting isn't enough against modern botnets"
    ];
    const perfTopics = [
      "Optimizing React Server Components for sub-100ms TTFB",
      "Abusing Vercel Edge caching to avoid database roundtrips",
      "Reducing Next.js bundle sizes by lazy-loading heavy charting libraries",
      "How blocking main thread operations destroy conversion rates",
      "The exact architecture I use to scale to 10k concurrent users"
    ];
    const agencyTopics = [
      "Why the lowest bidder always ends up costing 5x more in technical debt",
      "The difference between 'getting it to work' and engineering true scale",
      "How legacy codebases slowly kill startup velocity",
      "Why speed of execution dictates market dominance",
      "Investing heavily in premium engineering to sleep peacefully during high-traffic events"
    ];
    const seoTopics = [
      "Securing API Routes in Next.js 15 App Router",
      "Building Zero-Trust Authentication with NextAuth and Supabase",
      "Strategies for Edge Deployment latency reduction",
      "Migrating from SPAs to deeply cached ISR pages",
      "Handling global error boundaries gracefully in modern Next.js"
    ];
    const hooks = [
      "Be aggressive and contrarian.", 
      "Share a real war story from production.", 
      "Be highly technical and analytical.", 
      "Focus intensely on the financial impact.", 
      "Keep sentences extremely short and punchy."
    ];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const hook = pick(hooks);

    let promptText = "";
    if (contentPillar === "cybersecurity") {
      promptText = `You are Meshark, an elite 21-year-old Cybersecurity specialist and Next.js developer from Nairobi. Write a short, punchy Twitter thread (max 3 tweets) specifically about: "${pick(cyberTopics)}". ${hook} Use severe, confident, professional language. End the thread telling them to hire your agency MesharkTech for a security audit. DO NOT USE ANY HASHTAGS.`;
    } else if (contentPillar === "performance") {
      promptText = `You are Meshark, an elite 21-year-old Full-Stack Developer from Nairobi. Write a specific, highly technical tweet (280 chars max) exactly regarding: "${pick(perfTopics)}". ${hook} Sound like a senior engineer who builds enterprise systems. Do not use hashtags.`;
    } else if (contentPillar === "agency") {
      promptText = `You are Meshark, founder of MesharkTech. Write a short, highly-engaging LinkedIn/Twitter post discussing: "${pick(agencyTopics)}". ${hook} Be confident, direct, and slightly provocative. End with a subtle call to action for MesharkTech. Avoid overused buzzwords.`;
    } else if (contentPillar === "seo-blog") {
      promptText = `You are Meshark, founder of MesharkTech. Write a short, 250-word SEO-optimized blog post introduction and outline focused directly on: "${pick(seoTopics)}". ${hook} The tone should be authoritative and deeply technical. Include a call to action to hire your team.`;
    } else {
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
