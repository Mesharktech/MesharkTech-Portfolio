"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "BQ Contractors Ltd",
    role: "Civil Engineering & Construction — Tanzania",
    quote:
      "Mesharktech delivered a world-class digital presence that matches our 30+ years of engineering excellence. The site positions us exactly where we need to be — on the global stage.",
    rating: 5,
  },
  {
    name: "MAC Chambers",
    role: "Mediation & Arbitration Practice",
    quote:
      "We needed a bilingual institutional platform that conveyed legal authority. Mesharktech understood the brief immediately and shipped a polished, professional site ahead of schedule.",
    rating: 5,
  },
  {
    name: "Zanzibar Marine & Diving",
    role: "Tourism & Recreation — Zanzibar",
    quote:
      "Our booking conversions jumped significantly after launching the new platform. The design captures the beauty of Zanzibar and makes it effortless for tourists to find and book our services.",
    rating: 5,
  },
  {
    name: "BQ Process Automation",
    role: "CNG & Sustainable Energy — Tanzania",
    quote:
      "From concept to deployment, the Mesharktech team demonstrated deep technical understanding of our industry. The result is a platform that educates and converts — exactly what we needed.",
    rating: 5,
  },
];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative w-full py-24 bg-meshark-slateDark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label tracking-[0.4em]">TESTIMONIALS</span>
          <h2 className="section-heading mt-4">
            What Our <span className="text-meshark-cyan">Clients</span> Say
          </h2>
          <p className="text-meshark-silver mt-4 max-w-2xl mx-auto text-lg">
            Real feedback from organizations we&apos;ve engineered production systems for.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="glass-card p-8 flex flex-col gap-4 relative group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-meshark-cyan/20 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-meshark-cyan fill-meshark-cyan"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-meshark-silverLight text-sm leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Client info */}
              <div className="pt-4 border-t border-meshark-cyan/10">
                <p className="text-white font-display font-semibold text-sm">
                  {t.name}
                </p>
                <p className="text-xs text-meshark-silver font-mono mt-1">
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
