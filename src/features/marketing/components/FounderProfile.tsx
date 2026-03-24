"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react";

const skills = [
  "Full-Stack Engineering",
  "Cybersecurity & Pen Testing",
  "Cloud Architecture",
  "AI & LLM Integration",
  "UI/UX Strategy",
  "DevOps & CI/CD",
];

export function FounderProfile() {
  return (
    <section className="relative w-full py-24 bg-meshark-slateDark border-t border-meshark-cyan/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="section-label tracking-[0.4em]">LEADERSHIP</span>
          <h2 className="section-heading mt-4">
            Meet the <span className="text-meshark-cyan">Founder</span>
          </h2>
        </motion.div>

        {/* Founder card — two-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
        >
          {/* LEFT: Portrait */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <div className="relative w-64 h-72 lg:w-full lg:h-96 rounded-2xl overflow-hidden border-2 border-meshark-cyan/30 shadow-[0_0_40px_rgba(0,230,164,0.2)]">
              <Image
                src="/meshark-mugshot.jpg"
                alt="Meshark — Founder of Mesharktech"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-meshark-slateDark/80 to-transparent" />
              {/* Name tag overlay */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display font-bold text-white text-xl">Meshark</p>
                <p className="text-meshark-cyan text-sm font-mono">Founder & Lead Engineer</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: Github, href: "https://github.com/Mesharktech", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-meshark-slate border border-meshark-cyan/20 flex items-center justify-center text-meshark-silver hover:text-meshark-cyan hover:border-meshark-cyan/60 hover:shadow-[0_0_15px_rgba(0,230,164,0.3)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: Bio & Details */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="font-display text-3xl font-bold text-white mb-2">Meshark</h3>
              <p className="text-meshark-cyan font-mono text-sm tracking-wide mb-6">Full-Stack Developer · Cybersecurity Specialist · Founder, Mesharktech</p>

              <div className="space-y-4 text-meshark-silver leading-relaxed">
                <p>
                  I'm a 21-year-old software engineer and cybersecurity specialist from Nairobi, Kenya. I founded Mesharktech to solve a specific problem I kept seeing in East Africa — businesses that wanted digital sophistication but were stuck with generic solutions that didn't respect their ambitions.
                </p>
                <p>
                  My approach is simple: I build like every line of code has to earn its place. Whether it's a high-conversion landing page, a cloud-native SaaS platform, or a zero-trust security architecture, I bring the same obsession with quality to every deployment.
                </p>
                <p>
                  Mesharktech operates under <span className="text-meshark-cyan font-medium">Quick Dynasty</span> — my holding entity for technology and media ventures — built on three non-negotiables: speed, discipline, and zero compromise on quality.
                </p>
              </div>
            </div>

            {/* Skill badges */}
            <div>
              <p className="text-xs font-mono text-meshark-silver/60 uppercase tracking-widest mb-4">Core Disciplines</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-xl bg-meshark-slate text-sm text-meshark-cyan font-medium border border-meshark-cyan/20 hover:border-meshark-cyan/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <a
                href="https://github.com/Mesharktech"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 btn-primary text-sm"
              >
                View GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Co-Founder card */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7, delay: 0.2 }}
           className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center mt-32"
        >
          {/* LEFT: Portrait */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start lg:order-2">
            <div className="relative w-64 h-72 lg:w-full lg:h-96 rounded-2xl overflow-hidden border-2 border-meshark-cyan/30 shadow-[0_0_40px_rgba(0,230,164,0.2)]">
              <Image
                src="/paul-kibu.png"
                alt="Paul Kibu — Co-Founder of Mesharktech"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-meshark-slateDark/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display font-bold text-white text-xl">Paul Kibu</p>
                <p className="text-meshark-cyan text-sm font-mono">Co-Founder & Chief Operations</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Bio & Details */}
          <div className="lg:col-span-3 space-y-8 lg:order-1">
            <div>
              <h3 className="font-display text-3xl font-bold text-white mb-2">Paul Kibu</h3>
              <p className="text-meshark-cyan font-mono text-sm tracking-wide leading-relaxed mb-6">Co-Founder · Chief Operations, QA & QC Expert <br/> Branding & Marketing Guru</p>

              <div className="space-y-4 text-meshark-silver leading-relaxed">
                <p>
                  Bringing a world of experience in achieving the end result, Paul bridges the gap between deep technical execution and raw business reality. He ensures every Mesharktech deployment not only works flawlessly but commands dominance in the market.
                </p>
                <p>
                  With an expansive background in branding, marketing strategy, and rigorous Quality Assurance, Paul acts as the operational backbone of the agency, guaranteeing that our engineering translates directly into revenue and scale for our clients.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
