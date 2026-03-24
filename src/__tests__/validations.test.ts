import { describe, it, expect } from "vitest";
import { chatRequestSchema } from "@/lib/validations/chat";
import { feedbackSchema } from "@/lib/validations/feedback";
import { generateContentSchema } from "@/lib/validations/marketing";

describe("Zod Schema Validations", () => {
  describe("Chat Schema", () => {
    it("should accept valid chat messages", () => {
      const validPayload = {
        messages: [{ role: "user", content: "Hello Meshark" }],
      };
      expect(chatRequestSchema.safeParse(validPayload).success).toBe(true);
    });

    it("should reject empty message content", () => {
      const invalidPayload = {
        messages: [{ role: "user", content: "" }],
      };
      expect(chatRequestSchema.safeParse(invalidPayload).success).toBe(false);
    });
  });

  describe("Feedback Schema", () => {
    it("should accept valid ratings (1-5)", () => {
      expect(feedbackSchema.safeParse({ rating: 5 }).success).toBe(true);
      expect(feedbackSchema.safeParse({ rating: 1 }).success).toBe(true);
      expect(feedbackSchema.safeParse({ rating: 3, feedback: "Great bot" }).success).toBe(true);
    });

    it("should reject out-of-bounds ratings", () => {
      expect(feedbackSchema.safeParse({ rating: 0 }).success).toBe(false);
      expect(feedbackSchema.safeParse({ rating: 6 }).success).toBe(false);
    });
  });

  describe("Marketing Generation Schema", () => {
    it("should accept valid pillars", () => {
      expect(generateContentSchema.safeParse({ pillar: "cybersecurity" }).success).toBe(true);
      expect(generateContentSchema.safeParse({ pillar: "performance", autoPost: true }).success).toBe(true);
    });

    it("should reject unknown pillars", () => {
      expect(generateContentSchema.safeParse({ pillar: "unknown_pillar" }).success).toBe(false);
    });
  });
});
