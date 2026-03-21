"use client";

import { motion } from "framer-motion";
import { Check, Shield, Rocket, Target, Code, Award, Zap, Briefcase } from "lucide-react";
import Link from "next/link";

export function PricingPackages() {
  const tiers = [
    {
      name: "Starter Package",
      price: "KSh. 17,999",
      description: "Perfect for personal brands and startup landing pages.",
      isPopular: false,
      features: [
        "Custom Website (Up to 5 Pages)",
        "Responsive Mobile-First Design",
        "Basic SEO Optimization",
        "Free Domain & Hosting (1 Year)",
        "Source Code Provided",
        "Social Media Integration",
        "24/7 Priority Support",
      ],
    },
    {
      name: "Standard Package",
      price: "KSh. 31,499",
      description: "The sweet spot for growing businesses and agencies.",
      isPopular: true,
      features: [
        "Custom Website (Up to 10 Pages)",
        "Responsive Mobile-First Design",
        "Full SEO & Analytics Optimization",
        "Admin Dashboard (Headless CMS)",
        "Free Domain & Hosting (1 Year)",
        "Search Engine Indexing",
        "Free SSL Certificate",
        "Free Logo Identity Design",
        "Enterprise Security Updates",
        "24/7 Priority Support",
      ],
    },
    {
      name: "Premium Package",
      price: "KSh. 53,999+",
      description: "Mission-critical architectures and full web applications.",
      isPopular: false,
      features: [
        "Custom Web Application / SaaS",
        "Responsive Mobile-First Design",
        "Advanced SEO & Performance Config",
        "High-Availability Architecture",
        "Admin Dashboard & User Auth",
        "Payment Gateway Integration",
        "Free SSL Certificate",
        "Custom Graphic Assets",
        "Business Email Configuration",
        "Dedicated VIP Support SLA",
      ],
    },
  ];

  return (
    <section className="relative w-full py-24 bg-meshark-slateDark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="section-label">Web / App Packages</span>
          <h2 className="section-heading mt-6 mb-6">
            Transparent <span className="text-meshark-cyan">Pricing</span>
          </h2>
          <p className="text-meshark-silver text-lg">
            Engineered for global scale, priced 10% below the local market ceiling to guarantee extreme ROI for your digital headquarters.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-8 relative flex flex-col ${
                tier.isPopular ? "border-meshark-cyan border-2 scale-105 glow-purple-lg shadow-black" : "border-meshark-slateMid"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3">
                  <span className="bg-meshark-cyan text-meshark-slateDark text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)] uppercase">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-display font-semibold text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-meshark-cyan">{tier.price}</span>
              </div>
              <p className="text-meshark-silver text-sm mb-8">{tier.description}</p>
              
              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-meshark-green shrink-0 mr-3 mt-0.5" />
                    <span className="text-meshark-silver text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/contact" className={`w-full py-3 rounded-lg font-semibold text-center block transition-all ${
                tier.isPopular 
                  ? "bg-meshark-cyan text-meshark-slateDark hover:bg-white shadow-[0_0_20px_rgba(0,229,255,0.4)]" 
                  : "bg-meshark-slateMid text-white hover:bg-meshark-slate border border-meshark-cyan/30"
              }`}>
                Initialize Project
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Mesharktech */}
        <div className="mt-32 pt-20 border-t border-meshark-blue/20">
          <div className="text-center mb-16">
            <h2 className="section-heading">Why Choose <span className="text-meshark-cyan">Mesharktech</span></h2>
            <p className="text-meshark-silver mt-4">We do not just write code taking up space online. We engineer digital assets.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Code, title: "Professional Elite Team", desc: "Top 1% engineering talent operating at peak capability." },
              { icon: Rocket, title: "Innovative Solutions", desc: "Zero legacy overhead. We deploy the very bleeding edge." },
              { icon: Shield, title: "Quality Delivery", desc: "Military-grade testing before any production release." },
              { icon: Zap, title: "Affordable Pricing", desc: "Enterprise value engineered into highly efficient tier models." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 glass-card border-none bg-meshark-slateMid/50"
              >
                <div className="w-16 h-16 rounded-full bg-meshark-slate border border-meshark-cyan/50 flex items-center justify-center mb-6 glow-purple">
                  <item.icon className="w-8 h-8 text-meshark-cyan" />
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-meshark-silver text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
