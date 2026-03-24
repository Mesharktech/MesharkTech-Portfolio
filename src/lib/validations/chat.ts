import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string().min(1, "Message content cannot be empty"),
  tool_call_id: z.string().optional(),
  name: z.string().optional(),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).max(50, "Too many messages in conversation history"),
});

export type ChatRequestValues = z.infer<typeof chatRequestSchema>;
