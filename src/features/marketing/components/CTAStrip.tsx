"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

export function CTAStrip() {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-meshark-cyan/10 via-meshark-blue/10 to-meshark-cyan/10" />
      <div className="absolute inset-0 dot-grid opacity-40" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-meshark-cyan/10 border border-meshark-cyan/30 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-meshark-cyan" />
            </div>
          </div>

          <h2 className="section-heading text-3xl sm:text-4xl mb-4">
            Ready to Build Something{" "}
            <span className="gradient-text">World-Class</span>?
          </h2>
          <p className="text-meshark-silver text-lg max-w-2xl mx-auto mb-10">
            Whether it&apos;s a high-conversion landing page, a custom SaaS platform, or a
            full enterprise security audit — we deliver at international standards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base group">
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="btn-ghost text-base">
              Explore Capabilities
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
