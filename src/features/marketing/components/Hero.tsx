"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Variants } from "framer-motion";

// --- Typing animation hook ---
function useTypingEffect(phrases: string[], speed = 80, pauseMs = 1800) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) setTimeout(() => setIsDeleting(true), pauseMs);
          else setCharIdx((c) => c + 1);
        } else {
          setText(current.slice(0, charIdx - 1));
          if (charIdx === 0) { setIsDeleting(false); setPhraseIdx((i) => (i + 1) % phrases.length); }
          else setCharIdx((c) => c - 1);
        }
      },
      isDeleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, phrases, speed, pauseMs]);

  return text;
}

const roles = [
  "Full-Stack Developer",
  "Cybersecurity Specialist",
  "Founder of Mesharktech",
  "Systems Architect",
  "Open Source Builder",
];

const stats = [
  { value: "5+", label: "Industries Served" },
  { value: "5+", label: "Live Client Sites" },
  { value: "4.9★", label: "Avg Client Rating" },
  { value: "24/7", label: "Global Support" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Use string-based cubic-bezier to avoid TS strict type error
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Hero() {
  const typedText = useTypingEffect(roles);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

      {/* Animated purple blob */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-meshark-cyan rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        className="z-10 text-center max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-meshark-slate/60 border border-meshark-blue/70 text-meshark-cyanLight text-sm font-medium backdrop-blur-sm glow-cyan">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-meshark-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-meshark-green" />
            </span>
            <Shield className="w-3.5 h-3.5" />
            Available for high-impact projects
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          <span className="block text-white">Secure Architecture.</span>
          <span className="block gradient-text">Flawless Execution.</span>
        </motion.h1>

        {/* Typing subtitle */}
        <motion.div
          variants={itemVariants}
          className="font-mono text-lg md:text-xl text-meshark-silver mb-6 h-8"
        >
          <span className="text-meshark-cyanLight">&gt; </span>
          <span>{typedText}</span>
          <span className="terminal-cursor" />
        </motion.div>


        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/projects" className="btn-primary group text-base">
            View Featured Deploys
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/Mesharktech"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-base flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub Profile
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-4 flex flex-col items-center text-center">
              <span className="font-display text-2xl font-bold gradient-text">{stat.value}</span>
              <span className="text-xs text-meshark-silver mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-meshark-silver/50 tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-meshark-cyan/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
