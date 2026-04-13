"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Terminal, Mail, Github, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("sending");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to send");
      
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        reset();
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="section-label">Get In Touch</p>
        <h2 className="section-heading">Initiate Connection</h2>
        <p className="text-meshark-silver mt-4 max-w-xl mx-auto">
          Have a high-impact project? Want to build something that doesn&apos;t compromise?{" "}
          Let&apos;s talk.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Terminal Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card overflow-hidden"
        >
          {/* Terminal Topbar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-meshark-slateDark/60 border-b border-meshark-slate">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-xs font-mono text-meshark-silver">meshark@terminal: ~/contact</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-mono text-meshark-cyan">$ name</label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Your name"
                className={`w-full bg-meshark-slateDark/50 border ${errors.name ? 'border-red-500' : 'border-meshark-slate focus:border-meshark-cyan'} rounded-xl px-4 py-3 text-sm text-white placeholder:text-meshark-silver/40 outline-none transition-colors font-mono`}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-mono text-meshark-cyan">$ email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className={`w-full bg-meshark-slateDark/50 border ${errors.email ? 'border-red-500' : 'border-meshark-slate focus:border-meshark-cyan'} rounded-xl px-4 py-3 text-sm text-white placeholder:text-meshark-silver/40 outline-none transition-colors font-mono`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-mono text-meshark-cyan">$ message</label>
              <textarea
                id="message"
                {...register("message")}
                rows={5}
                placeholder="Describe the mission..."
                className={`w-full bg-meshark-slateDark/50 border ${errors.message ? 'border-red-500' : 'border-meshark-slate focus:border-meshark-cyan'} rounded-xl px-4 py-3 text-sm text-white placeholder:text-meshark-silver/40 outline-none transition-colors font-mono resize-none`}
              />
              {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "idle" && (
                <>
                  <Send className="w-4 h-4" /> Execute Send
                </>
              )}
              {status === "sending" && (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Transmitting...
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Message Delivered
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" /> Transmission Failed
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Side info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-meshark-cyan/20 border border-meshark-cyan/40 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-meshark-cyanLight" />
            </div>
            <div>
              <p className="text-xs text-meshark-silver mb-1">Direct Line</p>
              <a
                href="mailto:contact@mesharktech.co.ke"
                className="text-white font-medium hover:text-meshark-cyanLight transition-colors"
              >
                contact@mesharktech.co.ke
              </a>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-meshark-cyan/20 border border-meshark-cyan/40 flex items-center justify-center shrink-0">
              <Github className="w-5 h-5 text-meshark-cyanLight" />
            </div>
            <div>
              <p className="text-xs text-meshark-silver mb-1">Source Control</p>
              <a
                href="https://github.com/Mesharktech"
                target="_blank"
                rel="noreferrer"
                className="text-white font-medium hover:text-meshark-cyanLight transition-colors"
              >
                github.com/Mesharktech
              </a>
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-xs font-mono text-meshark-cyan mb-3">$ availability_status</p>
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-white font-display font-bold">Open to Opportunities</span>
            </div>
            <p className="text-xs text-meshark-silver mt-3 leading-relaxed">
              Available for freelance projects, product collabs, and founding-team roles. Response time: &lt; 24h.
            </p>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <Terminal className="w-5 h-5 text-meshark-cyan shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-meshark-silver mb-1">Prefer a faster route?</p>
              <p className="text-sm text-white">
                Chat with{" "}
                <span className="gradient-text font-semibold">Meshark AI</span> — my personal AI agent, live in the bottom-right corner.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
