import { Github, ExternalLink, Terminal, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CurrentYear } from "./CurrentYear";

const links = [
  { label: "GitHub", href: "https://github.com/Mesharktech", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/meshark", icon: Linkedin },
  { label: "Twitter / X", href: "https://x.com/mesharktech", icon: Twitter },
  { label: "Portfolio", href: "/projects", icon: ExternalLink, internal: true },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-meshark-slate mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4 group">
              <Image 
                src="/logo-icon.svg" 
                alt="Mesharktech Icon" 
                width={36}
                height={36}
                className="w-9 h-9 transition-transform duration-300 group-hover:-translate-y-1"
              />
              <span className="font-display font-bold text-xl tracking-tight text-white mt-1">
                Meshark<span className="text-meshark-cyanLight">tech</span>
              </span>
            </div>
            <p className="text-xs text-meshark-silver leading-relaxed max-w-xs">
              Secure Architecture. Flawless Execution. Built from Nairobi with international vision.
            </p>
            <a 
              href="https://github.com/Mesharktech" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block text-xs font-mono text-meshark-cyan/70 mt-4 hover:text-white transition-colors cursor-pointer"
            >
              // Quick Dynasty ethos
            </a>
          </div>
          <div>
            <p className="text-xs font-mono text-meshark-cyan tracking-widest uppercase mb-4">Navigation</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Capabilities", path: "/services" },
                { label: "Portfolio", path: "/projects" },
                { label: "About", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-sm text-meshark-silver hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* External */}
          <div>
            <p className="text-xs font-mono text-meshark-cyan tracking-widest uppercase mb-4">Find Me</p>
            <div className="flex flex-col gap-3">
              {links.map(({ label, href, icon: Icon, internal }) => (
                internal ? (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-2 text-sm text-meshark-silver hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-meshark-silver hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-meshark-slate flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-meshark-silver/50 font-mono">
            &copy; <CurrentYear /> Mesharktech. Engineered in Nairobi 🇰🇪
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-meshark-silver/50">
            <Terminal className="w-3 h-3" />
            <span>Built with Next.js · TypeScript · Tailwind · Groq AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
