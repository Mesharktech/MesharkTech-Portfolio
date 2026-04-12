import { z } from "zod";

// Only allow client-facing roles. "system" and "tool" are server-controlled
// positions and must never be accepted from an external caller — doing so
// enables direct system-prompt injection attacks.
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]).refine((v) => v === "user" || v === "assistant", {
    message: "Invalid role. Only 'user' and 'assistant' are permitted.",
  }),
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(4000, "Message content is too long."),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required.")
    .max(50, "Too many messages in conversation history"),
});

export type ChatRequestValues = z.infer<typeof chatRequestSchema>;
