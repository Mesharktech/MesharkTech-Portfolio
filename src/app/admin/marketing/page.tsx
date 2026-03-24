"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, Send, Copy, Twitter, Loader2, Check } from "lucide-react";

const PILLARS = [
  { id: "cybersecurity", label: "Zero-Trust & Cyber", desc: "Aggressive security teardowns" },
  { id: "performance", label: "Next.js Perf", desc: "Highly technical server component tips" },
  { id: "agency", label: "Agency Owner", desc: "Why cheap dev costs companies 5x more" },
  { id: "seo-blog", label: "SEO Tech Blog", desc: "Long-form technical article outlines" }
];

export default function MarketingDashboard() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [activePillar, setActivePillar] = useState(PILLARS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret) {
      setIsAuthenticated(true);
    }
  };

  const generateDraft = async () => {
    if (!secret) return;
    setIsGenerating(true);
    setDraft("");
    
    try {
      const res = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`
        },
        body: JSON.stringify({ pillar: activePillar })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      
      setDraft(data.content);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert("Error: " + errorMessage);
      if (errorMessage === "Unauthorized") {
        setIsAuthenticated(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const postToTwitter = () => {
    const encodedText = encodeURIComponent(draft);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-meshark-slateDark flex items-center justify-center p-4">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAuth}
          className="glass-card p-8 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-meshark-slate border border-meshark-cyan/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-meshark-cyan" />
          </div>
          <h1 className="text-xl font-display font-semibold text-white mb-2">Marketing Engine</h1>
          <p className="text-meshark-silver text-sm mb-6">Enter your API secret to unlock the AI dashboard.</p>
          
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="meshark-dev-secret..."
            className="w-full bg-meshark-slateDark border border-meshark-slate focus:border-meshark-cyan rounded-xl px-4 py-3 text-white mb-4 outline-none transition-colors text-center font-mono"
            required
          />
          <button type="submit" className="btn-primary w-full justify-center">
            Unlock Dashboard
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-meshark-slateDark p-6 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              Marketing Engine <span className="bg-meshark-cyan/20 text-meshark-cyan text-xs px-3 py-1 rounded-full border border-meshark-cyan/30">Human-In-The-Loop</span>
            </h1>
            <p className="text-meshark-silver mt-2">Generate, review, edit, and post high-ticket content directly from your portfolio.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm font-mono text-meshark-silver hover:text-white">
            [ Lock Session ]
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-sm font-mono text-meshark-cyan uppercase tracking-widest mb-4">1. Select Pillar</h2>
              <div className="space-y-3">
                {PILLARS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePillar(p.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${activePillar === p.id ? 'bg-meshark-cyan/10 border-meshark-cyan glow-cyan' : 'bg-meshark-slate border-meshark-slateMid hover:border-meshark-cyan/50'}`}
                  >
                    <p className="text-white font-medium mb-1">{p.label}</p>
                    <p className="text-xs text-meshark-silver">{p.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={generateDraft}
                disabled={isGenerating}
                className="btn-primary w-full justify-center mt-6 py-4 shadow-[0_0_20px_rgba(0,230,164,0.3)]"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? "Generating Draft..." : "Generate Content"}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-8">
            <div className="glass-card p-6 h-full flex flex-col">
              <h2 className="text-sm font-mono text-meshark-cyan uppercase tracking-widest mb-4">2. Review & Edit Draft</h2>
              
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="AI draft will appear here..."
                className="flex-1 w-full min-h-[400px] bg-[#080b0f] border border-meshark-slate focus:border-meshark-cyan/50 rounded-xl p-6 text-meshark-silverLight font-sans resize-none outline-none leading-relaxed"
              />

              <div className="mt-6 pt-6 border-t border-meshark-slate flex flex-col sm:flex-row items-center gap-4">
                <p className="text-xs font-mono text-meshark-silver/70 mr-auto">
                  {draft.length} characters | {draft.split(" ").filter(Boolean).length} words
                </p>

                <button 
                  onClick={copyToClipboard}
                  disabled={!draft}
                  className="btn-ghost flex-1 sm:flex-none justify-center"
                >
                  {copied ? <Check className="w-4 h-4 text-meshark-green" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
                
                <button 
                  onClick={postToTwitter}
                  disabled={!draft}
                  className="btn-primary flex-1 sm:flex-none justify-center bg-[#1DA1F2] hover:bg-[#1a8cd8] shadow-[0_0_20px_rgba(29,161,242,0.3)] hover:shadow-[0_0_30px_rgba(29,161,242,0.5)] border-none"
                >
                  <Twitter className="w-4 h-4" />
                  Post to X / Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
