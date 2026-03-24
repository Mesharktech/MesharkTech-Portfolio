import { z } from "zod";

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().optional(),
});

export type FeedbackValues = z.infer<typeof feedbackSchema>;
