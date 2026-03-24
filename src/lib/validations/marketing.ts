import { z } from "zod";

export const generateContentSchema = z.object({
  pillar: z.enum(["cybersecurity", "performance", "agency", "seo-blog"]).optional(),
  autoPost: z.boolean().optional(),
});

export type GenerateContentValues = z.infer<typeof generateContentSchema>;
