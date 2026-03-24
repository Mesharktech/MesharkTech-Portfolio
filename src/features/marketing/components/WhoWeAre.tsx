"use client";

import { motion } from "framer-motion";
import { Lightbulb, ShieldCheck, Globe, Handshake } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Pushing boundaries with cutting-edge technology and creative problem-solving at every layer of the stack.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    desc: "Consistent delivery of high-quality, production-grade solutions with enterprise-level security built in.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Africa-rooted, globally connected. Engineering digital infrastructure that competes on the world stage.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    desc: "Building lasting client relationships through radical transparency, collaboration, and shared ownership of results.",
  },
];

export function WhoWeAre() {
  return (
    <section className="relative w-full py-24 bg-meshark-slateDark border-y border-meshark-cyan/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-heading">
            Who <span className="text-meshark-cyan">We Are</span>
          </h2>
          <div className="h-1 w-16 bg-meshark-cyan rounded-full mx-auto my-6" />
          <p className="text-meshark-silver text-lg leading-relaxed">
            Mesharktech is a trusted digital engineering firm building future-ready technology for ambitious organizations. We design, engineer, and scale solutions that unlock growth and drive global competitiveness.
          </p>
        </motion.div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/50 hover:shadow-[0_0_30px_rgba(0,230,164,0.15)] transition-all duration-300 flex flex-col items-center text-center cursor-default"
            >
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-full bg-meshark-slateDark border border-meshark-cyan/30 flex items-center justify-center mb-6 group-hover:bg-meshark-cyan/10 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-meshark-cyan" />
              </div>

              <h3 className="text-meshark-cyan font-display font-semibold text-xl mb-4">
                {item.title}
              </h3>
              <p className="text-meshark-silver text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
