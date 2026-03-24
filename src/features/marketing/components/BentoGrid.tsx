"use client";

import { motion } from "framer-motion";
import { 
  Terminal, 
  Code2, 
  Server, 
  Globe, 
  Github, 
  Mail, 
  Database, 
  ShieldCheck, 
  BookOpen,
  Layout,
  Briefcase
} from "lucide-react";

export function BentoGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        
        {/* The Arsenal (Tech Stack) - Spans 2 cols */}
        <motion.div 
          whileHover={{ scale: 0.98 }}
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-meshark-slate/40 border border-meshark-purpleDark/50 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm subtle-glow overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-meshark-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-meshark-purple" />
            <h2 className="text-xl font-bold text-white">The Arsenal</h2>
          </div>
          <p className="text-meshark-silver text-sm mb-6 relative z-10">
            Next.js (App Router), React, TypeScript, JavaScript, Python, Linux, Tailwind CSS.
          </p>
          <div className="flex gap-4 relative z-10 flex-wrap">
             <span className="px-3 py-1 bg-black/50 border border-meshark-slate rounded-md text-xs font-mono text-meshark-purpleLight">React</span>
             <span className="px-3 py-1 bg-black/50 border border-meshark-slate rounded-md text-xs font-mono text-meshark-purpleLight">TypeScript</span>
             <span className="px-3 py-1 bg-black/50 border border-meshark-slate rounded-md text-xs font-mono text-meshark-purpleLight">Python</span>
             <span className="px-3 py-1 bg-black/50 border border-meshark-slate rounded-md text-xs font-mono text-meshark-purpleLight">Linux</span>
          </div>
        </motion.div>

        {/* Featured Deploy 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-meshark-slate/40 border border-meshark-purpleDark/50 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm group"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-meshark-purple" />
            <h3 className="text-lg font-bold text-white leading-tight">CyberAcademyLMS</h3>
          </div>
          <p className="text-meshark-silver text-sm mt-4">
            Full-stack TS/Python Learning Management System for cybersecurity training.
          </p>
          <div className="w-full h-1 bg-meshark-slate mt-auto rounded-full overflow-hidden">
            <div className="h-full bg-meshark-purple w-3/4" />
          </div>
        </motion.div>

        {/* Beyond the Code */}
        <motion.div 
          whileHover={{ scale: 0.98 }}
          className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 bg-meshark-slateDark border border-meshark-purpleDark rounded-3xl p-8 flex flex-col backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-meshark-purple/20 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex flex-col h-full relative z-10">
            <h2 className="text-xl font-bold text-white mb-6">Beyond The Code</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meshark-slate flex items-center justify-center shrink-0 border border-meshark-purpleDark">
                  <span className="text-meshark-purple font-bold">🥋</span>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Taekwondo Captain</h4>
                  <p className="text-meshark-silver text-xs mt-1">Disciplined, strategic, & calm under pressure.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meshark-slate flex items-center justify-center shrink-0 border border-meshark-purpleDark">
                  <Database className="w-4 h-4 text-meshark-purpleLight" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Analytical Edge</h4>
                  <p className="text-meshark-silver text-xs mt-1">Agribusiness Management at Univ. of Nairobi.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-meshark-slate flex items-center justify-center shrink-0 border border-meshark-purpleDark">
                  <Globe className="w-4 h-4 text-meshark-purpleLight" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Relentless Ethic</h4>
                  <p className="text-meshark-silver text-xs mt-1">Self-supported, balancing dev, translation, & cyber training.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Deploy 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-meshark-purple/10 border border-meshark-purple/30 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm group"
        >
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-meshark-purpleLight" />
            <h3 className="text-lg font-bold text-white leading-tight">AI-CV-Builder</h3>
          </div>
          <p className="text-meshark-silver text-sm mt-4">
            Automated JS/Python resume engine.
          </p>
          <button className="mt-4 text-left text-xs font-mono text-meshark-purpleLight group-hover:text-white transition-colors flex items-center gap-1">
            View Source <Github className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Featured Deploy 3 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-meshark-slate/40 border border-meshark-purpleDark/50 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm group"
        >
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-meshark-purple" />
            <h3 className="text-lg font-bold text-white leading-tight">Prowritter</h3>
          </div>
          <p className="text-meshark-silver text-sm mt-4">
            MDX/TypeScript modern writing platform.
          </p>
          <div className="w-full h-1 bg-meshark-slate mt-auto rounded-full overflow-hidden">
            <div className="h-full bg-meshark-purple w-1/2" />
          </div>
        </motion.div>

        {/* Production Client Sites */}
        <motion.div 
          whileHover={{ scale: 0.98 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-meshark-slate/40 border border-meshark-purpleDark/50 rounded-3xl p-8 flex flex-col justify-center backdrop-blur-sm group items-center text-center"
        >
          <Server className="w-8 h-8 text-meshark-purple mb-4" />
          <h3 className="text-lg font-bold text-white">Production Shipped</h3>
          <p className="text-meshark-silver text-xs mt-2">
            Proven ability to ship & deploy client sites via Netlify.
          </p>
        </motion.div>

        {/* Contact Terminal */}
        <motion.div 
          whileHover={{ scale: 0.99 }}
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-black border border-meshark-slate rounded-3xl p-8 flex flex-col font-mono relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-8 bg-meshark-slate/30 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-[10px] text-meshark-silver">meshark@terminal: ~</span>
          </div>
          
          <div className="mt-8 flex-1 flex flex-col justify-center">
            <p className="text-green-400 text-sm mb-2">{">"} status: ready_for_deployment</p>
            <p className="text-meshark-silver text-sm mb-6">{">"} initiate_connection()</p>
            
            <div className="flex gap-4">
              <a href="mailto:contact@mesharktech.com" className="px-4 py-2 bg-meshark-slate/50 hover:bg-meshark-slate border border-meshark-slateDark hover:border-meshark-purple transition-colors rounded text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4" /> root@meshark.tech
              </a>
              <a href="https://github.com/Mesharktech" target="_blank" rel="noreferrer" className="px-4 py-2 bg-meshark-slate/50 hover:bg-meshark-slate border border-meshark-slateDark hover:border-meshark-purple transition-colors rounded text-sm text-white flex items-center gap-2">
                <Github className="w-4 h-4" /> /Mesharktech
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
