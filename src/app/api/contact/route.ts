import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // In a real environment, you'd hook this to Resend, SendGrid, or similar.
    // For now we simulate the processing and log the incoming transmission.
    console.log(`[CONTACT FORM] New message received:
      From: ${name} <${email}>
      Message: ${message}
    `);

    // Simulate backend processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ success: true, message: "Transmission received." });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ success: false, message: "System error: Failed to process form." }, { status: 500 });
  }
}
