"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";

const clientProjects = [
  {
    id: "bqcontractors",
    title: "BQ Contractors Ltd",
    category: "Construction & Engineering",
    description:
      "A premium corporate web presence for a civil engineering and construction firm operating across Tanzania for over three decades. Features their services, project portfolio, and ISO 9001:2015 certification highlights.",
    tags: ["Corporate Website", "Next.js", "Responsive Design"],
    metric1: { label: "Years in Operation", value: "30+" },
    metric2: { label: "Project Scale", value: "Enterprise" },
    screenshot: "/clients/bqcontractors.png",
    live: "https://www.bqcontractors.co.tz/",
    categoryColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  },
  {
    id: "nelviocollege",
    title: "Nelvio Driving College",
    category: "Education",
    description:
      "A full-featured portal for a licensed driving training institution, complete with course listings, dynamic fleet display, AI-generated vehicle photography, and an integrated online inquiry system.",
    tags: ["Next.js", "Framer Motion", "AI Media"],
    metric1: { label: "Active Students", value: "500+" },
    metric2: { label: "Course Types", value: "8" },
    screenshot: "/clients/nelviocollege.png",
    live: "https://nelviocollege.netlify.app/",
    categoryColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  {
    id: "zanzibarmarine",
    title: "Zanzibar Marine & Diving",
    category: "Tourism & Recreation",
    description:
      "A visually immersive tourism platform for a professional marine and diving services company in Zanzibar. Built for high-conversion bookings featuring course listings and Zanzibar destination photography.",
    tags: ["React", "Vite", "Tourism Platform"],
    metric1: { label: "Services Listed", value: "12+" },
    metric2: { label: "Client Rating", value: "4.9★" },
    screenshot: "/clients/zanzibarmarine.png",
    live: "https://zanzibarmarineanddivingservices.co.tz/",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  },
  {
    id: "bqprocessautomation",
    title: "BQ Process Automation",
    category: "Energy & Automotive",
    description:
      "Tanzania's leading CNG (Compressed Natural Gas) authority platform. Showcases their vehicle conversion services, NGV inspection, CNG refueling infrastructure, and sustainable automotive future positioning.",
    tags: ["Corporate Website", "Energy Sector", "Responsive"],
    metric1: { label: "Vehicles Converted", value: "200+" },
    metric2: { label: "Fuel Savings", value: "40%↓" },
    screenshot: "/clients/bqprocessautomation.png",
    live: "https://bqprocessautomation.co.tz/",
    categoryColor: "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  {
    id: "macchambers",
    title: "MAC Chambers",
    category: "Legal & Arbitration",
    description:
      "A bilingual (English/Swahili) institutional website for a professional Mediation & Arbitration practice. Features their legal team profiles, service tiers, training programs, and dispute resolution capabilities.",
    tags: ["Legal Platform", "Bilingual", "Institutional"],
    metric1: { label: "Cases Mediated", value: "100+" },
    metric2: { label: "Languages", value: "2" },
    screenshot: "/clients/macchambers.png",
    live: "https://mediation-arbitration-chambers.com/",
    categoryColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  },
];

function ClientCard({ project, index }: { project: (typeof clientProjects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/40 hover:shadow-[0_0_35px_rgba(0,230,164,0.12)] transition-all duration-500 flex flex-col"
    >
      {/* Screenshot Preview */}
      <div className="relative h-52 overflow-hidden bg-meshark-slateDark flex-shrink-0">
        <Image
          src={project.screenshot}
          alt={`${project.title} website preview`}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md ${project.categoryColor}`}>
            {project.category}
          </span>
        </div>
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-meshark-slate to-transparent" />
      </div>

      {/* Card Body */}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-meshark-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-meshark-silver leading-relaxed flex-1 mb-5">
          {project.description}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center gap-8 pt-4 pb-5 border-t border-meshark-cyan/10">
          <div>
            <span className="block font-display font-bold text-xl text-meshark-cyan">
              {project.metric1.value}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-meshark-silver/60">
              {project.metric1.label}
            </span>
          </div>
          <div>
            <span className="block font-display font-bold text-xl text-meshark-cyan">
              {project.metric2.value}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-meshark-silver/60">
              {project.metric2.label}
            </span>
          </div>
        </div>

        {/* Tags + CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-meshark-cyan/10">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-meshark-slateDark text-xs font-mono text-meshark-silver border border-meshark-cyan/10"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-meshark-cyan hover:text-white whitespace-nowrap transition-colors shrink-0 ml-2"
          >
            Visit Site <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isHeaderInView = useInView(ref, { once: true });

  return (
    <section id="projects" ref={ref} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="section-label tracking-[0.4em]">PORTFOLIO</span>
        <h2 className="section-heading mt-4">
          Deployed Client <span className="text-meshark-cyan">Projects</span>
        </h2>
        <p className="text-meshark-silver mt-4 max-w-2xl mx-auto text-lg">
          Live, production-grade digital assets we have engineered and deployed for enterprise, SME, and institutional clients across East Africa and beyond.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clientProjects.map((project, i) => (
          <ClientCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* Personal Projects CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-meshark-silver text-sm mb-4">
          Beyond client work — explore open-source projects & tools on GitHub
        </p>
        <a
          href="https://github.com/Mesharktech"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 btn-primary text-sm"
        >
          View GitHub Profile <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
