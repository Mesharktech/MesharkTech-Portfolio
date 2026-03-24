"use client";

import { motion } from "framer-motion";
import { Monitor, Server, ShieldCheck, Database, PenTool, Braces, CheckCircle2 } from "lucide-react";

export function ServicesGrid() {
  const services = [
    {
      title: "Custom Web Applications",
      icon: Monitor,
      desc: "High-performance, scalable web platforms built with Next.js and TypeScript. We engineer for speed and global availability.",
      points: ["React / Next.js Ecosystem", "Progressive Web Apps (PWA)", "E-Commerce Platforms", "SaaS Architectures"]
    },
    {
      title: "Cloud Infrastructure",
      icon: Server,
      desc: "Deploying resilient, auto-scaling cloud topologies across AWS, GCP, and Vercel. We guarantee supreme uptime.",
      points: ["AWS / Serverless Deployments", "Docker Containerization", "CI/CD Pipeline Automation", "Load Balancing"]
    },
    {
      title: "Enterprise Cybersecurity",
      icon: ShieldCheck,
      desc: "Military-grade penetration testing and zero-trust security hardening to protect mission-critical digital assets.",
      points: ["Vulnerability Assessments", "OWASP Compliance Audits", "Data Encryption Protocols", "Zero-Trust Architecture"]
    },
    {
      title: "Data & AI Pipelines",
      icon: Database,
      desc: "Harnessing Large Language Models and custom data pipelines to unlock massive operational efficiency for your business.",
      points: ["LLM & Agent Integration", "RAG Pipeline Development", "Automated Workflows", "Business Intelligence"]
    },
    {
      title: "UI/UX Strategy & Design",
      icon: PenTool,
      desc: "Pixel-perfect, high-conversion user interfaces. We design digital experiences that feel intuitive and elite.",
      points: ["Figma Wireframing", "Interactive Prototyping", "Design System Creation", "Conversion Optimization"]
    },
    {
      title: "API & Systems Integration",
      icon: Braces,
      desc: "Connecting disparate software ecosystems seamlessly via custom RESTful and GraphQL APIs.",
      points: ["Custom REST API Development", "Third-Party API Integration", "Webhook Architecture", "Microservices Design"]
    }
  ];

  return (
    <section className="relative w-full py-24 bg-meshark-slateDark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="section-label tracking-[0.4em]">WHAT WE OFFER</span>
          <h2 className="section-heading mt-4 mb-6">
            Agency <span className="text-meshark-cyan">Capabilities</span>
          </h2>
          <p className="text-meshark-silver text-lg">
            Delivering end-to-end digital solutions out of Nairobi to organizations worldwide. Built on modern, uncompromised technology.
          </p>
        </div>

        {/* 6-Card Grid mimicking Sahara */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-[#151821] border border-meshark-cyan/10 hover:border-meshark-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle mesh background on hover */}
              <div className="absolute inset-0 bg-mesh-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-meshark-slateDark border border-meshark-cyan/30 flex items-center justify-center mb-6 text-meshark-cyan shrink-0 transition-transform group-hover:-translate-y-1">
                  <service.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-display font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-meshark-silver text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
                
                <ul className="space-y-3">
                  {service.points.map((point, i) => (
                    <li key={i} className="flex items-center text-sm text-meshark-silver">
                      <CheckCircle2 className="w-4 h-4 text-meshark-green shrink-0 mr-3" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
