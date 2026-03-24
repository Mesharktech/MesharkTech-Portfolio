"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RotateCcw, ChevronDown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Yo, what's good. I'm Meshark — developer, security specialist, founder of Mesharktech. Ask me anything about my work, my stack, or what I'm building. Let's talk.",
};

function AgentAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden shrink-0 border border-meshark-cyanLight/30 bg-meshark-blue flex items-center justify-center", className)}>
      <img src="/meshark-mugshot.jpg" alt="Meshark AI" className="w-full h-full object-cover z-10 scale-[1.7] origin-[50%_25%]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-white/50 text-xs">M</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <AgentAvatar className="w-7 h-7 rounded-full" />
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-1.5 h-4">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              className="w-1.5 h-1.5 bg-meshark-cyanLight rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MesharkAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      ...WELCOME_MESSAGE, // Spread WELCOME_MESSAGE to include role and content
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState(""); // Changed from input to inputValue
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Kept from original
  const [hasScrolled, setHasScrolled] = useState(false); // Added from diff
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("Let's build something."); // Initialized from original

  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Changed from bottomRef
  const inputRef = useRef<HTMLInputElement>(null);

  // Periodic Attention Bubble
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      return;
    }

    const phrases = [
      "Need a quote?",
      "Let's build.",
      "I'm online.",
      "Talk strategy."
    ];
    let phraseIndex = 0;
    let interval: NodeJS.Timeout;
    let popupTimeout: NodeJS.Timeout;

    const triggerBubble = () => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setBubbleText(phrases[phraseIndex]);
      setShowBubble(true);

      popupTimeout = setTimeout(() => {
        setShowBubble(false);
      }, 5000);
    };

    // First bubble after 4 seconds
    const initialTimeout = setTimeout(() => {
      setShowBubble(true);
      popupTimeout = setTimeout(() => setShowBubble(false), 5000);

      // Then every 12 seconds
      interval = setInterval(triggerBubble, 12000);
    }, 4000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(popupTimeout);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Changed ref
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && !showFeedback) { // Added !showFeedback
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, showFeedback]); // Added showFeedback to dependencies

  const sendMessage = async (e?: React.FormEvent) => { // Added optional event parameter
    e?.preventDefault(); // Prevent default form submission
    const trimmed = inputValue.trim(); // Changed from input
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date() }; // Added timestamp
    setMessages((prev) => [...prev, userMsg]);
    setInputValue(""); // Changed from setInput
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
        { role: "assistant", content: data.reply ?? "Connection dropped. Try again.", timestamp: new Date() }, // Added timestamp
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My server dropped the packet. Refresh and try again.", timestamp: new Date() }, // Added timestamp
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]); // Updated to include timestamp
    setFeedbackSubmitted(false); // Reset feedback state
    setFeedbackRating(null);
    setFeedbackText("");
    setShowFeedback(false);
  };

  const handleCloseAttempt = () => {
    setShowFeedback(true);
  };

  const forceClose = () => {
    setIsOpen(false);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackText("");
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
      // Still show success to user — feedback is non-critical
      setFeedbackSubmitted(true);
    }
  };

  return (
    <>
      {/* Attention Bubble */}
      <AnimatePresence>
        {!isOpen && showBubble && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-[36px] right-[90px] z-40 cursor-pointer"
            onClick={() => { setIsOpen(true); setIsMinimized(false); setShowBubble(false); }}
          >
            <p className="font-display font-black text-3xl tracking-wider flame-font-cyan whitespace-nowrap drop-shadow-[0_4px_15px_rgba(0,230,164,0.3)]">
              {bubbleText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp FAB */}
      <motion.a
        href="https://wa.me/254758956494"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
        style={{ background: "#25D366" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        {/* Official WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.498.655 4.843 1.8 6.875L2 30l7.338-1.775A13.956 13.956 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.447 11.447 0 01-5.823-1.589l-.418-.248-4.357 1.054 1.095-4.243-.273-.437A11.469 11.469 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.293-8.668c-.345-.172-2.04-1.005-2.355-1.12-.316-.117-.546-.172-.776.172-.229.345-.887 1.12-1.087 1.349-.2.23-.4.258-.745.086-.345-.172-1.456-.537-2.772-1.71-1.024-.913-1.715-2.04-1.916-2.385-.2-.345-.021-.531.15-.703.155-.155.345-.4.517-.6.172-.2.229-.345.345-.575.115-.229.058-.43-.029-.603-.087-.172-.776-1.87-1.063-2.562-.28-.673-.565-.582-.776-.592l-.66-.013a1.27 1.27 0 00-.918.43c-.315.345-1.204 1.177-1.204 2.87 0 1.693 1.233 3.328 1.405 3.558.172.229 2.426 3.705 5.878 5.196.822.355 1.463.567 1.963.726.824.263 1.574.226 2.167.137.661-.099 2.04-.834 2.327-1.638.287-.805.287-1.495.201-1.638-.085-.143-.315-.229-.66-.401z"/>
        </svg>
      </motion.a>

      {/* AI Chat FAB Button */}
      <motion.button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-meshark-cyan flex items-center justify-center shadow-lg glow-cyan-lg transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none scale-75"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Meshark AI Chat"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-meshark-green rounded-full border-2 border-meshark-slateDark" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={isMinimized ? { opacity: 1, y: 0, scale: 1, height: "auto" } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)]"
            style={{ maxHeight: "calc(100vh - 5rem)" }}
          >
            {/* Glassmorphism card container */}
            <div
              role="dialog"
              aria-label="Meshark AI Chat"
              aria-modal="true"
              className="flex flex-col rounded-3xl overflow-hidden border border-white/10"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.92) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(122,34,225,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                maxHeight: isMinimized ? "auto" : "calc(100vh - 6rem)",
              }}
            >
              {showFeedback ? (
                // Feedback UI Panel
                <div className="flex-col flex h-full p-6 text-meshark-silver relative z-10" style={{ height: "450px" }}>
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-display font-bold text-white">Feedback</h3>
                     <button onClick={forceClose} className="p-2 -mr-2 text-meshark-silver hover:text-white transition-colors rounded-full hover:bg-white/5">
                       <X size={20} />
                     </button>
                  </div>
                  
                  {!feedbackSubmitted ? (
                    <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
                      <p className="text-center font-medium text-white mb-6 leading-relaxed">Overall, how would you rate your experience with Meshark AI?</p>
                      
                      <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button 
                            key={num} 
                            onClick={() => setFeedbackRating(num)}
                            className={`w-12 h-12 rounded-lg text-lg font-bold transition-all duration-200 ${feedbackRating === num ? 'bg-meshark-green text-meshark-slateDark scale-110 shadow-[0_0_15px_rgba(0,230,164,0.4)]' : 'bg-white/5 text-meshark-silver hover:bg-white/10 hover:text-white'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {feedbackRating && (
                        <div className="animate-fade-in-up mt-2">
                          <p className="text-sm font-medium text-meshark-silver mb-2">Add Additional feedback</p>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-meshark-green transition-colors font-mono"
                            rows={3}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What went well? How could we improve?"
                          />
                          <div className="mt-4 flex flex-col gap-2">
                            <button 
                              onClick={submitFeedback}
                              className="w-full py-2.5 bg-[#0066ff] text-white font-bold rounded-lg hover:bg-[#0052cc] transition-colors"
                            >
                              Submit
                            </button>
                            <button 
                              onClick={forceClose}
                              className="w-full py-2.5 text-meshark-silver hover:text-white transition-colors font-medium text-sm"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up">
                      <div className="w-16 h-16 bg-meshark-green/20 text-meshark-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,230,164,0.2)]">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                      <p className="text-meshark-silver mb-8 text-sm">Your feedback helps me improve this agent.</p>
                      <button 
                        onClick={forceClose}
                        className="px-6 py-2 border border-white/10 text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Close Chat
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Normal Chat UI
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 shrink-0 bg-white/[0.03] relative z-10">
                    <div className="relative">
                      <AgentAvatar className="w-9 h-9 rounded-xl glow-cyan" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-meshark-green rounded-full border-2 border-meshark-slateDark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold text-white">Meshark AI</p>
                      <p className="text-[10px] text-meshark-silver font-mono truncate">
                        mesharktech · online
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={resetChat}
                        title="Reset conversation"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsMinimized((v) => !v)}
                        title="Minimize"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all"
                      >
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isMinimized && "rotate-180")} />
                      </button>
                      <button
                        onClick={handleCloseAttempt}
                        title="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <AnimatePresence initial={false}>
                    {!isMinimized && (
                      <motion.div
                        key="messages"
                        role="log"
                        aria-live="polite"
                        aria-atomic="false"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 relative z-10"
                        style={{ maxHeight: "min(360px, calc(100dvh - 14rem))", minHeight: "280px" }}
                      >
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className={cn(
                              "flex items-end gap-2",
                              msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                          >
                            {msg.role === "assistant" && (
                              <AgentAvatar className="w-7 h-7 rounded-full" />
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed break-words [overflow-wrap:anywhere]",
                                msg.role === "user"
                                  ? "bg-meshark-cyan text-white rounded-br-sm"
                                  : "bg-white/5 border border-white/10 text-meshark-silverLight rounded-bl-sm backdrop-blur-md"
                              )}
                            >
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input Form */}
                  {!isMinimized && (
                    <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/8 bg-white/[0.02]">
                      <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-meshark-cyan/60 transition-colors">
                        <input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask me anything..."
                          disabled={isLoading}
                          className="flex-1 bg-transparent text-sm text-white placeholder:text-meshark-silver/50 outline-none font-mono disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isLoading}
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                            inputValue.trim() && !isLoading
                              ? "bg-meshark-cyan text-white hover:bg-meshark-cyanLight"
                              : "bg-meshark-slate text-meshark-silver/40 cursor-not-allowed"
                          )}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                      <p className="text-[10px] text-meshark-silver/40 text-center mt-3 font-mono">
                        Powered by Groq · LLaMA 3.3 70B
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
