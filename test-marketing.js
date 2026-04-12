import { loadEnvConfig } from "@next/env";
import fetch from "node-fetch"; // need to use global fetch or node-fetch
import Groq from "groq-sdk";

loadEnvConfig("./");

async function testGroq() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a test." },
      { role: "user", content: "Say hello world" }
    ],
    model: "llama-3.3-70b-versatile",
  });
  console.log("Groq Response:", chatCompletion.choices[0]?.message?.content);
}

testGroq().catch(console.error);
