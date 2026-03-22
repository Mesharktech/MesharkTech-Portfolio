"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RotateCcw, ChevronDown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Yo, what's good. I'm Meshark — developer, security specialist, founder of Mesharktech. Ask me anything about my work, my stack, or what I'm building. Let's talk.",
};

function AgentAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden shrink-0 border border-meshark-purpleLight/30 bg-meshark-purpleDark flex items-center justify-center", className)}>
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
              className="w-1.5 h-1.5 bg-meshark-purpleLight rounded-full"
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
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("Let's build something.");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Periodic Attention Bubble
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      return;
    }

    const phrases = [
      "Yo", 
      "Sup", 
      "Hey", 
      "Let's talk"
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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
        { role: "assistant", content: data.reply ?? "Connection dropped. Try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My server dropped the packet. Refresh and try again." },
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

  const resetChat = () => setMessages([WELCOME_MESSAGE]);

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
            <p className="font-display font-extrabold text-2xl tracking-wide flaming-text-cyan whitespace-nowrap">
              {bubbleText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-meshark-purple flex items-center justify-center shadow-lg glow-purple-lg transition-all duration-300",
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
            {/* Glassmorphism card */}
            <div
              role="dialog"
              aria-label="Meshark AI Chat"
              aria-modal="true"
              className="flex flex-col rounded-3xl overflow-hidden border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.92) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow:
                  "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(122,34,225,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                maxHeight: isMinimized ? "auto" : "calc(100vh - 6rem)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 shrink-0 bg-white/[0.03]">
                <div className="relative">
                  <AgentAvatar className="w-9 h-9 rounded-xl glow-purple" />
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
                    onClick={() => setIsOpen(false)}
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
                    className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4"
                    style={{ maxHeight: "360px" }}
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
                        {/* Avatar */}
                        {msg.role === "assistant" && (
                          <AgentAvatar className="w-7 h-7 rounded-full" />
                        )}
                        {/* Bubble */}
                        <div
                          className={cn(
                            "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-meshark-purple text-white rounded-br-sm"
                              : "bg-white/5 border border-white/10 text-meshark-silverLight rounded-bl-sm backdrop-blur-md"
                          )}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={bottomRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              {!isMinimized && (
                <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/8 bg-white/[0.02]">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-meshark-purple/60 transition-colors">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-meshark-silver/50 outline-none font-mono"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                        input.trim() && !isLoading
                          ? "bg-meshark-purple text-white hover:bg-meshark-purpleLight"
                          : "bg-meshark-slate text-meshark-silver/40 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-meshark-silver/30 text-center mt-2 font-mono">
                    Powered by Groq · LLaMA 3.3 70B
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
