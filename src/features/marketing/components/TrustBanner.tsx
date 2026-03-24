"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "AWS Certified Architect", level: "Cloud Security Solutions" },
  { name: "Vercel Enterprise", level: "Edge Network Deployment" },
  { name: "OWASP Compliant", level: "Zero-Trust Architecture" },
  { name: "PostgreSQL Partner", level: "High-Availability DBs" },
];

export function TrustBanner() {
  return (
    <section className="w-full border-y border-meshark-slate bg-[#050b1a] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-meshark-cyan tracking-widest uppercase">
            Certifications & Architectural Standards
          </p>
          <h2 className="text-white font-display text-2xl font-bold mt-3">
            Trusted Frameworks & Deployments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-[#080d1e] border border-meshark-slate flex flex-col items-center justify-center text-center group hover:border-meshark-cyan/30 transition-colors"
            >
              <h4 className="text-meshark-cyanLight font-display font-semibold mb-2 text-sm sm:text-base">
                {partner.name}
              </h4>
              <p className="text-xs text-meshark-silver font-mono">
                {partner.level}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
