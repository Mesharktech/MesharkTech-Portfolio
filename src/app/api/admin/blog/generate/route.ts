import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access detected." }, { status: 401 });
    }

    // 2. Parse Body Data
    const { topic, context } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "No topic provided." }, { status: 400 });
    }

    // 3. Initiate Elite AI Generation
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
    const today = new Date().toISOString().split("T")[0];

    const generateResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Meshark — an elite Full-Stack Developer and Cybersecurity specialist based in Nairobi.
You are writing a deeply technical, engaging engineering article for your portfolio blog.
Do NOT use AI-speak (e.g. "In today's digital landscape", "Conclusion"). Be blunt, practical, and highly technical.
Write in standard Markdown format.

CRITICAL:
Your response MUST begin exactly with YAML frontmatter containing the following fields:
title: The Title String
slug: lowercase-hyphenated-slug
date: ${today}
description: A punchy SEO paragraph.
tags: [Tech, Engineering]

Make the slug URL-safe. After the frontmatter '---', write the article.`
        },
        {
          role: "user",
          content: `Topic: ${topic}\nAdditional Context: ${context || "None"}\n\nWrite a 500-1000 word technical playbook.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
    });

    const markdownText = generateResponse.choices[0]?.message?.content;
    if (!markdownText) {
      throw new Error("AI failed to generate content.");
    }

    // 4. Extract Slug from Frontmatter
    const slugMatch = markdownText.match(/slug:\s*([a-zA-Z0-9-]+)/i);
    const generatedSlug = slugMatch ? slugMatch[1].trim() : `article-${Date.now()}`;

    // 5. GitHub DevOps Integration
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      // If no token exists, just return the raw markdown so the user can copy/paste it manually
      return NextResponse.json({ 
        draft: markdownText, 
        message: "Article generated locally. Please set GITHUB_TOKEN to enable auto-publish." 
      });
    }

    // Prepare Git payload
    // use btoa safely for unicode characters
    const encoder = new TextEncoder();
    const encodedData = Array.from(encoder.encode(markdownText))
      .map((b) => String.fromCharCode(b))
      .join("");
    const base64Content = btoa(encodedData);

    const repoDetails = "Mesharktech/MesharkTech-Portfolio";
    const path = `content/blog/${generatedSlug}.md`;

    const gitRes = await fetch(`https://api.github.com/repos/${repoDetails}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `content(blog): auto-publish insights - ${generatedSlug}`,
        content: base64Content,
        branch: "master"
      })
    });

    const gitData = await gitRes.json();
    if (!gitRes.ok) {
      throw new Error(gitData.message || "Failed to push to GitHub.");
    }

    return NextResponse.json({
      success: true,
      draft: markdownText,
      slug: generatedSlug,
      url: `/blog/${generatedSlug}`
    });

  } catch (error: unknown) {
    console.error("Publishing Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publisher fault." }, 
      { status: 500 }
    );
  }
}
