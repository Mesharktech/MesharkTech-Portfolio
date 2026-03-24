import { useState, useRef, useEffect } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Yo, what's good. I'm Meshark — developer, security specialist, founder of Mesharktech. Ask me anything about my work, my stack, or what I'm building. Let's talk.",
};

export function useMesharkChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { ...WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // UI states
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("Let's build something.");
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Connection dropped. Try again.", timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My server dropped the packet. Refresh and try again.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackText("");
    setShowFeedback(false);
  };

  const submitFeedback = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: feedbackRating, feedback: feedbackText }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
      setFeedbackSubmitted(true); // Still show success
    }
  };

  const forceClose = () => {
    setIsOpen(false);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackText("");
  };

  return {
    isOpen, setIsOpen,
    isMinimized, setIsMinimized,
    messages,
    inputValue, setInputValue,
    isLoading,
    showBubble, setShowBubble,
    bubbleText, setBubbleText,
    showFeedback, setShowFeedback,
    feedbackRating, setFeedbackRating,
    feedbackText, setFeedbackText,
    feedbackSubmitted,
    sendMessage,
    resetChat,
    submitFeedback,
    forceClose
  };
}
