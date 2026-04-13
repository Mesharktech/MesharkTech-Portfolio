import { NextResponse } from "next/server";
import { Resend } from "resend";
import { feedbackSchema } from "@/lib/validations/feedback";

export const dynamic = "force-dynamic";

/** Escape user-supplied text before embedding it in an HTML email body. */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  // ------------------------------------------------------------------
  // Guard: verify the API key exists before doing anything else.
  // Returning 503 (rather than letting the Resend constructor throw)
  // prevents a 500 with an empty body — closes Finding #3.
  // ------------------------------------------------------------------
  if (!process.env.RESEND_API_KEY) {
    console.error("Feedback API: RESEND_API_KEY is not set.");
    return NextResponse.json(
      { success: false, message: "Feedback service is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    // Instantiate inside the try-catch so any constructor errors are caught.
    const resend = new Resend(process.env.RESEND_API_KEY);

    const json = await req.json();
    const result = feedbackSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback payload." },
        { status: 400 }
      );
    }

    const { rating, feedback } = result.data;

    const ratingDisplay = "⭐".repeat(rating) + "☆".repeat(5 - rating);

    // Sanitize user-supplied content before embedding in HTML (XSS prevention)
    const safeComment = feedback ? escapeHtml(feedback) : null;

    await resend.emails.send({
      from: "Meshark AI Feedback <onboarding@resend.dev>",
      to: "contact@mesharktech.co.ke",
      subject: `[Meshark AI] Feedback: ${rating}/5 stars`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f14; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #00e6a4; margin-top: 0;">Meshark AI — User Feedback</h2>
          <hr style="border: 1px solid #181d28; margin: 16px 0;" />
          <p><strong style="color: #00e6a4;">Rating:</strong> ${ratingDisplay} (${rating}/5)</p>
          ${
            safeComment
              ? `<p><strong style="color: #00e6a4;">Comment:</strong></p><div style="background: #181d28; padding: 16px; border-radius: 8px; border: 1px solid #00e6a4;"><p style="white-space: pre-wrap; margin: 0;">${safeComment}</p></div>`
              : "<p><em>No additional comment provided.</em></p>"
          }
          <hr style="border: 1px solid #181d28; margin: 16px 0;" />
          <p style="font-size: 12px; color: #4a5568;">Submitted via Meshark AI chat widget</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
