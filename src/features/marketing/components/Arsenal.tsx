"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Services capabilities grid now relocated exclusively to ServicesGrid.tsx

const techStacks = [
  { category: "Frontend Development", tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend Development", tools: ["Node.js", "Python", "Linux", "PostgreSQL", "REST APIs"] },
  { category: "Cloud & DevOps", tools: ["Vercel", "AWS", "Netlify", "Docker", "Git Actions"] },
  { category: "Data & AI", tools: ["Groq Llama", "OpenAI", "TensorFlow Concepts", "LangChain"] },
];

export function Arsenal() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="arsenal" ref={ref} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Tech Stack Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-12"
      >
        <p className="section-label tracking-[0.3em]">THE ARSENAL</p>
        <h2 className="section-heading mt-4 text-3xl">Our Technology Stack</h2>
        <p className="text-meshark-silver mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          We specialize in a wide array of bleeding-edge technologies to deploy zero-latency, globally available solutions.
        </p>
      </motion.div>

      {/* Tech Stack Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {techStacks.map((stack, idx) => (
          <motion.div
            key={stack.category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
            className="p-6 rounded-2xl bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/30 transition-all hover:-translate-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <h4 className="flex items-center gap-3 font-display text-meshark-cyan font-semibold text-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-meshark-cyanLight shadow-[0_0_10px_rgba(2,247,177,0.8)]" />
              {stack.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {stack.tools.map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-lg bg-meshark-slateDark text-xs font-mono text-meshark-silver border border-meshark-cyan/10">
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
