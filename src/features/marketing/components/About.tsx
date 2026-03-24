"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    icon: "🚀",
    title: "Agile & Lean Execution",
    body: "We skip the bureaucratic bloat. Our engineering pods operate with military-grade precision, delivering complex enterprise features in weeks, not quarters.",
  },
  {
    icon: "🌐",
    title: "Global Scale Architecture",
    body: "Every system is designed to handle global-tier traffic from Day 1. Edge-deployed networks, scalable microservices, and localized CDNs.",
  },
  {
    icon: "🔐",
    title: "Zero-Trust Security",
    body: "Security isn't an afterthought; it's the foundation. We enforce zero-trust paradigms, end-to-end encryption, and rigorous penetration testing on all deployments.",
  },
  {
    icon: "⚡",
    title: "Next-Gen Performance",
    body: "We bypass standard legacy stacks to build exclusively on top-tier modern frameworks. Blistering fast load times, automated SEO, and fluid generative UI elements.",
  },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Narrative */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">The Meshark Story</p>
          <h2 className="section-heading mb-6">Beyond The Code</h2>

          <div className="space-y-5 text-meshark-silver leading-relaxed">
            <p>
              Mesharktech is an elite digital engineering headquarters based in Nairobi, Kenya. Led by Principal Architect <span className="text-white font-semibold">Meshark</span>, we deploy highly secure, scalable enterprise web infrastructure with an uncompromising international standard.
            </p>
            <p>
              Operating under the <span className="gradient-text font-bold">Quick Dynasty</span> banner, we marshal over a decade of combined technical expertise to build massive systems—ranging from cybersecurity LMS platforms to AI-driven automation workflows for a global clientele.
            </p>
            <p>
              We don&apos;t just write code. We architect strategic technical advantages that allow our international partners to dominate their respective markets. Speed, discipline, and architectural flawlessness are the core of our ethos.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-meshark-purple/20 border border-meshark-purple/40 flex items-center justify-center text-2xl">
              🇰🇪
            </div>
            <div>
              <p className="text-white font-semibold font-display">Nairobi, Kenya</p>
              <p className="text-xs text-meshark-silver">East Africa → The World</p>
            </div>
          </div>
        </motion.div>

        {/* Right — Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-5 flex flex-col gap-3"
            >
              <span className="text-2xl">{pillar.icon}</span>
              <h4 className="font-display font-bold text-white text-sm">{pillar.title}</h4>
              <p className="text-xs text-meshark-silver leading-relaxed">{pillar.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
