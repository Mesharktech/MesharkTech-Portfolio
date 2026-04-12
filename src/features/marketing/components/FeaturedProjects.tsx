"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featured = [
  {
    title: "BQ Contractors Ltd",
    category: "Construction & Engineering",
    screenshot: "/clients/bqcontractors.png",
    live: "https://www.bqcontractors.co.tz/",
  },
  {
    title: "Zanzibar Marine & Diving",
    category: "Tourism & Recreation",
    screenshot: "/clients/zanzibarmarine.png",
    live: "https://zanzibarmarineanddivingservices.co.tz/",
  },
  {
    title: "MAC Chambers",
    category: "Legal & Arbitration",
    screenshot: "/clients/macchambers.png",
    live: "https://mediation-arbitration-chambers.com/",
  },
];

/**
 * 3D tilt card — tracks mouse position within the card and applies
 * rotateX/rotateY CSS transforms for a perspective depth effect.
 * Resets to flat on mouse leave.
 */
function TiltCard({ project, index }: { project: typeof featured[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max rotation of 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <motion.a
      ref={cardRef}
      href={project.live}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group rounded-2xl overflow-hidden bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/40 flex flex-col will-change-transform"
      style={{
        transition: "transform 0.15s ease-out, border-color 0.5s, box-shadow 0.5s",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Holographic shimmer overlay — visible on hover */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, rgba(0,230,164,0.08) 0deg, rgba(122,34,225,0.06) 120deg, rgba(59,130,246,0.06) 240deg, rgba(0,230,164,0.08) 360deg)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative h-48 overflow-hidden bg-meshark-slateDark">
        <Image
          src={project.screenshot}
          alt={`${project.title} preview`}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
          {...(index === 0 ? { priority: true } : {})}
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-meshark-slate to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-meshark-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-meshark-silver font-mono mt-1">
          {project.category}
        </p>
      </div>

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: "0 0 40px rgba(0,230,164,0.12), inset 0 0 40px rgba(0,230,164,0.03)",
        }}
      />
    </motion.a>
  );
}

export function FeaturedProjects() {
  return (
    <section className="w-full py-24 bg-meshark-slateDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label tracking-[0.4em]">PORTFOLIO</span>
          <h2 className="section-heading mt-4">
            Featured <span className="text-meshark-cyan">Deployments</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((project, i) => (
            <TiltCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 btn-ghost text-sm group"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
