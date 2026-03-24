"use client";

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
            <motion.a
              key={project.title}
              href={project.live}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-meshark-slate border border-meshark-cyan/10 hover:border-meshark-cyan/40 hover:shadow-[0_0_35px_rgba(0,230,164,0.12)] transition-all duration-500 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-meshark-slateDark">
                <Image
                  src={project.screenshot}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  {...(i === 0 ? { priority: true } : {})}
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
            </motion.a>
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
