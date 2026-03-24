"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Braces, FlaskConical, Rocket } from "lucide-react";

export function OurProcess() {
  const steps = [
    {
      num: "1",
      icon: Search,
      title: "Discovery",
      desc: "Deep-dive analysis of your enterprise requirements, goals, and target demographic."
    },
    {
      num: "2",
      icon: PenTool,
      title: "Design",
      desc: "Creating high-fidelity UI/UX wireframes demonstrating the intended architectural flows."
    },
    {
      num: "3",
      icon: Braces,
      title: "Development",
      desc: "Writing clean, scalable, zero-trust infrastructure code to bring the design to reality."
    },
    {
      num: "4",
      icon: FlaskConical,
      title: "Testing",
      desc: "Rigorous QA testing to absolutely guarantee zero bugs and perfect SLA uptimes."
    },
    {
      num: "5",
      icon: Rocket,
      title: "Deploy",
      desc: "Deploying the digital asset to production and handing over the administrative keys."
    }
  ];

  return (
    <section className="relative w-full py-24 bg-meshark-slateDark overflow-hidden border-t border-meshark-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="section-heading">Our <span className="text-meshark-cyan">Process</span></h2>
          <p className="text-meshark-silver text-lg mt-4">
            A flawless, military-grade pipeline from initial conceptualization to final deployment.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-meshark-cyan/20 -translate-y-[80%]" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Numbered Ring */}
                <div className="w-20 h-20 rounded-full bg-meshark-slate border-2 border-meshark-cyan flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 group-hover:bg-meshark-cyan group-hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] duration-300">
                  <span className="text-2xl font-display font-bold text-meshark-cyan group-hover:text-meshark-slateDark">
                    {step.num}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">{step.title}</h3>
                <p className="text-meshark-silver text-sm px-2 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
