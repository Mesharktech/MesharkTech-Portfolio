"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/services", label: "Capabilities" },
  { href: "/projects", label: "Portfolio" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    router.push(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-meshark-slateDark/90 backdrop-blur-xl border-b border-meshark-slate shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <Image 
              src="/logo-icon.svg" 
              alt="Mesharktech Icon" 
              width={40}
              height={40}
              priority
              className="w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            />
            <span className="font-display font-bold text-2xl tracking-tight text-white mt-1 hidden sm:block">
              Meshark<span className="text-meshark-cyanLight">tech</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium transition-colors duration-200 relative group ${isActive ? "text-white" : "text-meshark-silver hover:text-white"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-meshark-cyan transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
              );
            })}
            <Link
              href="/contact"
              className="btn-primary text-sm py-2 px-5"
            >
              <Terminal className="w-4 h-4" />
              Hire Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-lg bg-meshark-slate/50 border border-meshark-blue/50 flex items-center justify-center text-meshark-silver hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-meshark-slateDark border-l border-meshark-slate flex flex-col p-8 pt-20">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left py-3 px-4 rounded-xl text-meshark-silver hover:text-white hover:bg-meshark-slate/50 transition-all font-medium text-lg"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleNavClick("/contact")}
                  className="btn-primary w-full justify-center text-base"
                >
                  <Terminal className="w-4 h-4" /> Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
