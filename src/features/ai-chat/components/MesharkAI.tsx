"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, RotateCcw, ChevronDown, Mic } from "lucide-react";
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

const renderMessageContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-meshark-cyan font-bold underline decoration-meshark-cyan/40 hover:text-white drop-shadow-[0_0_8px_rgba(0,230,164,0.8)] transition-all break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const SILENT_AUDIO = "data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

/**
 * Plays TTS audio on mobile safely.
 * Mobile browsers block audio.play() unless called close to a user gesture.
 * We pre-fetch the blob, then assign it to the ALREADY UNLOCKED Audio element.
 */
async function playTTSAudio(spokenText: string, audioRef: React.MutableRefObject<HTMLAudioElement | null>) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spokenText }),
    });

    if (!res.ok) {
      console.warn("TTS fetch failed:", res.status);
      return;
    }

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    await audioRef.current.play();
  } catch (err) {
    console.warn("J.A.R.V.I.S Audio:", err);
  }
}

export function MesharkAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("Let's build something.");
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Attention bubble
  useEffect(() => {
    if (isOpen) { setShowBubble(false); return; }
    const phrases = ["Need a quote?", "Let's build.", "I'm online.", "Talk strategy."];
    let phraseIndex = 0;
    let interval: NodeJS.Timeout;
    let popupTimeout: NodeJS.Timeout;

    const triggerBubble = () => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setBubbleText(phrases[phraseIndex]);
      setShowBubble(true);
      popupTimeout = setTimeout(() => setShowBubble(false), 5000);
    };

    const initialTimeout = setTimeout(() => {
      setShowBubble(true);
      popupTimeout = setTimeout(() => setShowBubble(false), 5000);
      interval = setInterval(triggerBubble, 12000);
    }, 4000);

    return () => { clearTimeout(initialTimeout); clearTimeout(popupTimeout); clearInterval(interval); };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && !showFeedback && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, showFeedback, isMobile]);

  const sendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // Silent Unlock for Mobile Web Audio restrictions
    if (isMobile) {
      if (!audioRef.current) {
        audioRef.current = new Audio(SILENT_AUDIO);
      }
      audioRef.current.src = SILENT_AUDIO;
      audioRef.current.play().catch(() => {});
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();

      // Agentic Navigation
      if (data.action?.type === "NAVIGATE") {
        // On mobile: minimize the chat smoothly before navigating
        if (isMobile) {
          setIsMinimized(true);
          await new Promise((r) => setTimeout(r, 350)); // wait for animation
        }
        router.push(data.action.path);
        setTimeout(() => window.scrollBy({ top: 400, behavior: "smooth" }), 800);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Connection dropped. Try again.", timestamp: new Date() },
      ]);

      // J.A.R.V.I.S Voice — called here while still in the user gesture async chain
      if (data.spokenText) {
        await playTTSAudio(data.spokenText, audioRef);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My server dropped the packet. Refresh and try again.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, router, isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    if (isListening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice Input requires Chrome or Safari.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + (prev ? " " : "") + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const resetChat = () => {
    if (audioRef.current) audioRef.current.pause();
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackText("");
    setShowFeedback(false);
    setIsMinimized(false);
  };

  const handleCloseAttempt = () => setShowFeedback(true);

  const forceClose = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsOpen(false);
    setIsMinimized(false);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackText("");
  };

  const submitFeedback = async () => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: feedbackRating, feedback: feedbackText }),
      });
    } catch { /* non-critical */ }
    setFeedbackSubmitted(true);
  };

  // ─── Chat window positioning ────────────────────────────────────────────────
  // Desktop: bottom-right floating panel
  // Mobile:  full-screen overlay (fixed inset-0, but below the navbar)
  const windowClass = isMobile
    ? "fixed inset-x-2 bottom-2 top-[20vh] z-[100] max-h-[80vh]"
    : "fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)]";

  const cardStyle = isMobile
    ? {
        background: "linear-gradient(135deg, rgba(15,23,42,0.90) 0%, rgba(2,6,23,0.95) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 -10px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(122,34,225,0.15)",
        height: "100%",
        maxHeight: "100%",
        borderRadius: "1.5rem",
        display: "flex",
        flexDirection: "column" as const,
      }
    : {
        background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.92) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(122,34,225,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        maxHeight: isMinimized ? "auto" : "calc(100vh - 6rem)",
        display: "flex",
        flexDirection: "column" as const,
      };

  const messagesMaxHeight = isMobile
    ? "calc(100dvh - 16rem)"
    : "min(360px, calc(100dvh - 14rem))";

  return (
    <>
      {/* Attention Bubble */}
      <AnimatePresence>
        {!isOpen && showBubble && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-[36px] right-[90px] z-40 cursor-pointer hidden sm:block"
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
        <svg viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.498.655 4.843 1.8 6.875L2 30l7.338-1.775A13.956 13.956 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.447 11.447 0 01-5.823-1.589l-.418-.248-4.357 1.054 1.095-4.243-.273-.437A11.469 11.469 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.293-8.668c-.345-.172-2.04-1.005-2.355-1.12-.316-.117-.546-.172-.776.172-.229.345-.887 1.12-1.087 1.349-.2.23-.4.258-.745.086-.345-.172-1.456-.537-2.772-1.71-1.024-.913-1.715-2.04-1.916-2.385-.2-.345-.021-.531.15-.703.155-.155.345-.4.517-.6.172-.2.229-.345.345-.575.115-.229.058-.43-.029-.603-.087-.172-.776-1.87-1.063-2.562-.28-.673-.565-.582-.776-.592l-.66-.013a1.27 1.27 0 00-.918.43c-.315.345-1.204 1.177-1.204 2.87 0 1.693 1.233 3.328 1.405 3.558.172.229 2.426 3.705 5.878 5.196.822.355 1.463.567 1.963.726.824.263 1.574.226 2.167.137.661-.099 2.04-.834 2.327-1.638.287-.805.287-1.495.201-1.638-.085-.143-.315-.229-.66-.401z"/>
        </svg>
      </motion.a>

      {/* AI Chat FAB */}
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
            initial={{ opacity: 0, y: isMobile ? "100%" : 30, scale: isMobile ? 1 : 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? "100%" : 30, scale: isMobile ? 1 : 0.92 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={windowClass}
          >
            <div
              role="dialog"
              aria-label="Meshark AI Chat"
              aria-modal="true"
              className={cn(
                "flex flex-col overflow-hidden border border-white/10",
                isMobile ? "rounded-t-3xl" : "rounded-3xl"
              )}
              style={cardStyle}
            >
              {showFeedback ? (
                <div className="flex-col flex h-full p-6 text-meshark-silver relative z-10" style={{ height: isMobile ? "100%" : "450px" }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Feedback</h3>
                    <button onClick={forceClose} className="p-2 -mr-2 text-meshark-silver hover:text-white transition-colors rounded-full hover:bg-white/5">
                      <X size={20} />
                    </button>
                  </div>
                  {!feedbackSubmitted ? (
                    <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
                      <p className="text-center font-medium text-white mb-6 leading-relaxed">
                        How would you rate your experience with Meshark AI?
                      </p>
                      <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => setFeedbackRating(num)}
                            className={`w-12 h-12 rounded-lg text-lg font-bold transition-all duration-200 ${feedbackRating === num ? "bg-meshark-green text-meshark-slateDark scale-110 shadow-[0_0_15px_rgba(0,230,164,0.4)]" : "bg-white/5 text-meshark-silver hover:bg-white/10 hover:text-white"}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      {feedbackRating && (
                        <div className="animate-fade-in-up mt-2">
                          <p className="text-sm font-medium text-meshark-silver mb-2">Additional feedback</p>
                          <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-meshark-green transition-colors font-mono"
                            rows={3}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What went well? How could we improve?"
                          />
                          <div className="mt-4 flex flex-col gap-2">
                            <button onClick={submitFeedback} className="w-full py-2.5 bg-[#0066ff] text-white font-bold rounded-lg hover:bg-[#0052cc] transition-colors">
                              Submit
                            </button>
                            <button onClick={forceClose} className="w-full py-2.5 text-meshark-silver hover:text-white transition-colors font-medium text-sm">
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
                      <p className="text-meshark-silver mb-8 text-sm">Your feedback helps improve the agent.</p>
                      <button onClick={forceClose} className="px-6 py-2 border border-white/10 text-white font-medium hover:bg-white/5 rounded-lg transition-colors">
                        Close Chat
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 shrink-0 bg-white/[0.03] relative z-10">
                    <div className="relative">
                      <AgentAvatar className="w-9 h-9 rounded-xl glow-cyan" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-meshark-green rounded-full border-2 border-meshark-slateDark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold text-white">Meshark AI</p>
                      <p className="text-[10px] text-meshark-silver font-mono truncate">mesharktech · online</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={resetChat} title="Reset" className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      {/* Only show minimize on desktop */}
                      {!isMobile && (
                        <button onClick={() => setIsMinimized((v) => !v)} title="Minimize" className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all">
                          <ChevronDown className={cn("w-4 h-4 transition-transform", isMinimized && "rotate-180")} />
                        </button>
                      )}
                      <button onClick={handleCloseAttempt} title="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-meshark-silver hover:text-white hover:bg-white/10 transition-all">
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
                        style={{ maxHeight: messagesMaxHeight, minHeight: isMobile ? "unset" : "280px" }}
                      >
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className={cn("flex items-end gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                          >
                            {msg.role === "assistant" && <AgentAvatar className="w-7 h-7 rounded-full" />}
                            <div
                              className={cn(
                                "max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed break-words [overflow-wrap:anywhere]",
                                msg.role === "user"
                                  ? "bg-meshark-cyan text-white rounded-br-sm"
                                  : "bg-white/5 border border-white/10 text-meshark-silverLight rounded-bl-sm backdrop-blur-md"
                              )}
                            >
                              {renderMessageContent(msg.content)}
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input */}
                  {!isMinimized && (
                    <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/8 bg-white/[0.02]">
                      <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-meshark-cyan/60 transition-colors">
                        <button
                          type="button"
                          onClick={toggleVoice}
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                            isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-transparent text-meshark-silver/60 hover:text-white"
                          )}
                          title="Voice Input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={isListening ? "Listening..." : "Ask me anything..."}
                          disabled={isLoading}
                          className="flex-1 bg-transparent text-sm text-white placeholder:text-meshark-silver/50 outline-none font-mono disabled:opacity-50"
                          // Prevent zoom on iOS Safari (font-size >= 16px)
                          style={{ fontSize: "16px" }}
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
