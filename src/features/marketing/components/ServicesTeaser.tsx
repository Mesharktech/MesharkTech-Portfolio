"use client";

import { motion } from "framer-motion";
import { Monitor, ShieldCheck, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

const highlights = [
  {
    icon: Monitor,
    title: "Web & SaaS Engineering",
    desc: "High-performance, scalable applications built on Next.js and TypeScript.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Cybersecurity",
    desc: "Zero-trust audits, penetration testing, and security hardening.",
  },
  {
    icon: Database,
    title: "AI & Data Pipelines",
    desc: "LLM integration, RAG pipelines, and intelligent automation workflows.",
  },
];

export function ServicesTeaser() {
  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label tracking-[0.4em]">CAPABILITIES</span>
          <h2 className="section-heading mt-4">
            What We <span className="text-meshark-cyan">Build</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/40 transition-all duration-500 overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Animated holographic shimmer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "conic-gradient(from var(--shimmer-angle, 0deg) at 50% 50%, rgba(0,230,164,0.06) 0deg, transparent 60deg, rgba(122,34,225,0.05) 120deg, transparent 180deg, rgba(59,130,246,0.05) 240deg, transparent 300deg, rgba(0,230,164,0.06) 360deg)",
                  animation: "shimmer-rotate 4s linear infinite",
                }}
              />

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: "0 0 35px rgba(0,230,164,0.12), inset 0 1px 0 rgba(0,230,164,0.1)",
                }}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-meshark-slateDark border border-meshark-cyan/30 flex items-center justify-center mb-6 text-meshark-cyan group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(0,230,164,0.15)] transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-meshark-silver leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 btn-ghost text-sm group"
          >
            View All Capabilities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
