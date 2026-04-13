"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Send, Copy, Twitter, Loader2, Check, BookOpen, LayoutDashboard } from "lucide-react";

const PILLARS = [
  { id: "cybersecurity", label: "Zero-Trust & Cyber", desc: "Aggressive security teardowns" },
  { id: "performance", label: "Next.js Perf", desc: "Highly technical server component tips" },
  { id: "agency", label: "Agency Owner", desc: "Why cheap dev costs companies 5x more" },
];

export default function MasterAdminDashboard() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"marketing" | "blog">("blog");
  
  // Marketing State
  const [activePillar, setActivePillar] = useState(PILLARS[0].id);
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false);
  const [marketingDraft, setMarketingDraft] = useState("");
  const [copiedMarketing, setCopiedMarketing] = useState(false);

  // Blog State
  const [blogTopic, setBlogTopic] = useState("");
  const [blogContext, setBlogContext] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [blogPublishStatus, setBlogPublishStatus] = useState<"idle" | "success" | "error" | "local-only">("idle");
  const [blogDraft, setBlogDraft] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret) setIsAuthenticated(true);
  };

  const generateMarketingDraft = async () => {
    if (!secret) return;
    setIsGeneratingMarketing(true);
    setMarketingDraft("");
    try {
      const res = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ pillar: activePillar })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setMarketingDraft(data.content);
    } catch (error: any) {
      alert("Error: " + error.message);
      if (error.message === "Unauthorized") setIsAuthenticated(false);
    } finally {
      setIsGeneratingMarketing(false);
    }
  };

  const generateAndPublishBlog = async () => {
    if (!secret || !blogTopic) return;
    setIsGeneratingBlog(true);
    setBlogPublishStatus("idle");
    setBlogDraft("");
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ topic: blogTopic, context: blogContext })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      
      setBlogDraft(data.draft);
      if (data.success) {
        setBlogPublishStatus("success");
        setPublishedUrl(data.url);
      } else {
        setBlogPublishStatus("local-only");
      }
    } catch (error: any) {
      setBlogPublishStatus("error");
      alert("Error: " + error.message);
      if (error.message === "Unauthorized") setIsAuthenticated(false);
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-meshark-slateDark flex items-center justify-center p-4">
        <motion.form 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAuth}
          className="glass-card p-8 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-meshark-slate border border-meshark-cyan/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-meshark-cyan" />
          </div>
          <h1 className="text-xl font-display font-semibold text-white mb-2">Master Override</h1>
          <p className="text-meshark-silver text-sm mb-6">Enter your API secret to authenticate terminal operations.</p>
          <input
            type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
            placeholder="CRON_SECRET..."
            className="w-full bg-meshark-slateDark border border-meshark-slate focus:border-meshark-cyan rounded-xl px-4 py-3 text-white mb-4 outline-none transition-colors text-center font-mono"
            required
          />
          <button type="submit" className="btn-primary w-full justify-center">Authenticate</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-meshark-slateDark pt-24 pb-12 px-6 sm:px-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <div className="mb-4">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Command Hub</h1>
          <p className="text-xs font-mono text-meshark-green flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-meshark-green animate-pulse"></span> ONLINE
          </p>
        </div>
        
        <button 
          onClick={() => setActiveTab("blog")}
          className={`flex items-center gap-3 w-full p-4 rounded-xl border text-sm font-medium transition-all ${activeTab === "blog" ? "bg-meshark-cyan/10 border-meshark-cyan text-meshark-cyanLight glow-cyan" : "bg-meshark-slate/50 border-white/5 text-meshark-silver hover:bg-meshark-slate hover:text-white"}`}
        >
          <BookOpen className="w-4 h-4" /> Insights Publisher
        </button>

        <button 
          onClick={() => setActiveTab("marketing")}
          className={`flex items-center gap-3 w-full p-4 rounded-xl border text-sm font-medium transition-all ${activeTab === "marketing" ? "bg-meshark-cyan/10 border-meshark-cyan text-meshark-cyanLight glow-cyan" : "bg-meshark-slate/50 border-white/5 text-meshark-silver hover:bg-meshark-slate hover:text-white"}`}
        >
          <Twitter className="w-4 h-4" /> Marketing Engine
        </button>

        <div className="mt-auto pt-8">
          <button onClick={() => setIsAuthenticated(false)} className="text-xs font-mono text-meshark-silver hover:text-red-400 transition-colors">
            [ Terminate Session ]
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-5xl">
        <AnimatePresence mode="wait">
          
          {/* TAB: Insights Publisher */}
          {activeTab === "blog" && (
            <motion.div key="blog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="glass-card p-6 border-meshark-cyan/40 shadow-[0_0_40px_rgba(0,230,164,0.1)]">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-meshark-cyan" /> Autonomous Git-Publisher
                </h2>
                <p className="text-sm text-meshark-silver leading-relaxed mb-6">
                  Input a topic. The AI will write an elite, highly technical article in markdown format. If GITHUB_TOKEN is configured in Netlify, it will instantly commit the code and trigger a global site rebuild.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-meshark-cyan uppercase tracking-wider mb-2 block">1. Article Topic Request</label>
                    <input
                      type="text"
                      value={blogTopic}
                      onChange={(e) => setBlogTopic(e.target.value)}
                      placeholder="e.g. 'How to engineer zero-trust API middleware'"
                      className="w-full bg-[#080b0f] border border-meshark-slate focus:border-meshark-cyan focus:ring-1 focus:ring-meshark-cyan/50 rounded-xl px-4 py-3 text-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-meshark-cyan uppercase tracking-wider mb-2 block">2. Custom Context / Directives (Optional)</label>
                    <textarea
                      value={blogContext}
                      onChange={(e) => setBlogContext(e.target.value)}
                      placeholder="e.g. 'Mention our Quick Dynasty holding company and keep it extremely aggressive against typical web agencies.'"
                      className="w-full bg-[#080b0f] border border-meshark-slate focus:border-meshark-cyan focus:ring-1 focus:ring-meshark-cyan/50 rounded-xl px-4 py-3 text-white outline-none transition-all resize-none h-24"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                  <button
                    onClick={generateAndPublishBlog}
                    disabled={isGeneratingBlog || !blogTopic}
                    className="btn-primary shadow-[0_0_20px_rgba(0,230,164,0.3)] min-w-[200px] justify-center"
                  >
                    {isGeneratingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isGeneratingBlog ? "Architecting & Publishing..." : "Execute Publishing Protocol"}
                  </button>

                  {blogPublishStatus === "success" && (
                    <span className="font-mono text-xs px-3 py-2 bg-meshark-green/10 text-meshark-green border border-meshark-green/30 rounded flex items-center gap-2">
                      <Check className="w-3 h-3" /> COMMITTED TO GITHUB. NETLIFY IS REBUILDING. URL: {publishedUrl}
                    </span>
                  )}
                  {blogPublishStatus === "local-only" && (
                    <span className="font-mono text-xs px-3 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded">
                      WARNING: Generated but not pushed. Configure GITHUB_TOKEN. Check preview below.
                    </span>
                  )}
                </div>
              </div>

              {blogDraft && (
                <div className="glass-card p-6">
                  <h3 className="text-xs font-mono text-meshark-silver uppercase mb-4">Generated Markdown Payload</h3>
                  <textarea
                    readOnly
                    value={blogDraft}
                    className="w-full bg-[#080b0f] border border-white/5 rounded-xl block p-4 text-meshark-silverLight font-mono text-sm leading-relaxed min-h-[500px] outline-none"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: Marketing Engine (Legacy) */}
          {activeTab === "marketing" && (
            <motion.div key="marketing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-sm font-mono text-[#1DA1F2] uppercase tracking-widest mb-4">1. Select Pillar</h2>
                  <div className="space-y-3">
                    {PILLARS.map((p) => (
                      <button
                        key={p.id} onClick={() => setActivePillar(p.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${activePillar === p.id ? 'bg-[#1DA1F2]/10 border-[#1DA1F2] drop-shadow-[0_0_15px_rgba(29,161,242,0.3)]' : 'bg-meshark-slate border-meshark-slateMid hover:border-[#1DA1F2]/50'}`}
                      >
                        <p className="text-white font-medium mb-1">{p.label}</p>
                        <p className="text-xs text-meshark-silver">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={generateMarketingDraft} disabled={isGeneratingMarketing} className="w-full mt-6 py-4 rounded-xl font-bold border border-[#1DA1F2] bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition flex items-center justify-center gap-2">
                    {isGeneratingMarketing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isGeneratingMarketing ? "Generating..." : "Draft Content"}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="glass-card p-6 h-full flex flex-col">
                  <h2 className="text-sm font-mono text-[#1DA1F2] uppercase tracking-widest mb-4">2. Review & Edit Draft</h2>
                  <textarea
                    value={marketingDraft} onChange={(e) => setMarketingDraft(e.target.value)} placeholder="AI draft will appear here..."
                    className="flex-1 w-full min-h-[400px] bg-[#080b0f] border border-meshark-slate focus:border-[#1DA1F2]/50 rounded-xl p-6 text-meshark-silverLight font-sans resize-none outline-none leading-relaxed"
                  />
                  <div className="mt-6 pt-6 border-t border-meshark-slate flex flex-col sm:flex-row items-center justify-end gap-4">
                    <button 
                      onClick={() => { navigator.clipboard.writeText(marketingDraft); setCopiedMarketing(true); setTimeout(() => setCopiedMarketing(false), 2000); }}
                      disabled={!marketingDraft} className="btn-ghost"
                    >
                      {copiedMarketing ? <Check className="w-4 h-4 text-meshark-green" /> : <Copy className="w-4 h-4" />} Copy
                    </button>
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(marketingDraft)}`, "_blank")}
                      disabled={!marketingDraft} className="btn-primary flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] border-none"
                    >
                      <Twitter className="w-4 h-4" /> Post to X
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
