import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = contactFormSchema.safeParse(json);

    // Validate inputs with Zod
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input data." },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Dispatch both notification and confirmation emails in parallel to reduce API latency
    await Promise.all([
      resend.emails.send({
        from: "Mesharktech Contact Form <onboarding@resend.dev>",
        to: "contact@mesharktech.com",
        replyTo: email,
        subject: `[Mesharktech] New inquiry from ${name}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f14; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #00e6a4; margin-top: 0;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #181d28; margin: 16px 0;" />
            <p><strong style="color: #00e6a4;">Name:</strong> ${name}</p>
            <p><strong style="color: #00e6a4;">Email:</strong> <a href="mailto:${email}" style="color: #0077ff;">${email}</a></p>
            <p><strong style="color: #00e6a4;">Message:</strong></p>
            <div style="background: #181d28; padding: 16px; border-radius: 8px; border: 1px solid #00e6a4; margin-top: 8px;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            <hr style="border: 1px solid #181d28; margin: 16px 0;" />
            <p style="font-size: 12px; color: #4a5568;">Sent from mesharktech.com contact form</p>
          </div>
        `,
      }),
      
      resend.emails.send({
        from: "Mesharktech <onboarding@resend.dev>",
        to: email,
        subject: "We received your message — Mesharktech",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f14; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #00e6a4; margin-top: 0;">Hey ${name},</h2>
            <p>Thanks for reaching out. I received your message and will get back to you within 24 hours.</p>
            <p>In the meantime, you can also chat with my AI agent on the website for instant answers about my services and pricing.</p>
            <hr style="border: 1px solid #181d28; margin: 16px 0;" />
            <p style="color: #a0aabf; font-size: 13px;">— Meshark<br/>Founder, Mesharktech<br/>Secure Architecture. Flawless Execution.</p>
          </div>
        `,
      })
    ]);

    return NextResponse.json({ success: true, message: "Transmission received." });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { success: false, message: "System error: Failed to process form." },
      { status: 500 }
    );
  }
}
