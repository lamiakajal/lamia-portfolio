// ==========================================
// Component: Navbar
// Description: Glassmorphic sticky navbar with scroll progress, scroll-spy active link,
//              shrink-on-scroll, animated logo ring & smooth mobile drawer
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Code2, Sparkles } from "lucide-react";
import { Outfit } from "next/font/google";
import ThemeToggle from "@/components/ui/ThemeToggle";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [spyActive, setSpyActive] = useState("home");
  const pathname = usePathname();

  // Multi-page site: on any page except the landing page, links go to "/#section"
  // On project pages the "Projects" link stays highlighted.
  const active = pathname.startsWith("/projects") ? "projects" : spyActive;

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  /* Shrink on scroll + reading progress bar */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 24);
        setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy: highlight the section currently in view */
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSpyActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // Re-run when the page changes (sections only exist on the landing page)
  }, [pathname]);

  /* Close mobile menu on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? "bg-nav-scrolled border-pink-500/20 shadow-[0_10px_40px_-15px_rgba(236,72,153,0.35)]"
          : "bg-nav border-line"
      }`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes navShine {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(300%) skewX(-20deg); }
        }
        .nav-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: navShine 3.5s ease-in-out infinite;
        }
        @keyframes navDrop {
          from { opacity: 0; transform: translate3d(0, -12px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .nav-drop { animation: navDrop 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .nav-drop { animation: none; }
        }
      `,
        }}
      />

      {/* Reading progress bar */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-pink-500 via-fuchsia-400 to-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.8)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Shared container: max-w-6xl mx-auto px-6 (Hero & Footer use the same) */}
      <div
        className={`nav-drop max-w-6xl mx-auto px-6 flex items-center justify-between transition-[height] duration-500 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Logo / Brand */}
        <Link
          href="/#home"
          className={`text-xl font-bold tracking-tight flex items-center gap-3 group ${outfit.className}`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
            <div
              className="absolute inset-0 rounded-xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-pink-400 opacity-70 blur-xs animate-spin"
              style={{ animationDuration: "6s" }}
            ></div>
            <div className="absolute inset-0.5 rounded-[10px] bg-page"></div>
            <div className="relative z-10 w-9 h-9 rounded-xl bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:border-pink-500 transition shadow-lg shadow-pink-500/20">
              <Code2 size={18} className="animate-pulse" />
            </div>
          </div>

          <span className="bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
            Lamia Kajal
          </span>
        </Link>

        {/* Desktop Navigation Links with active underline */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center space-x-8 text-sm font-medium"
        >
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <Link
                key={l.id}
                href={`/#${l.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 transition-colors duration-300 ${
                  isActive
                    ? "text-pink-300"
                    : "text-slate-400 hover:text-pink-400"
                }`}
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 w-full origin-left rounded-full bg-linear-to-r from-pink-500 to-fuchsia-400 transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: theme toggle, desktop CTA and mobile menu button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/#contact"
              className="nav-cta group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-500/20 via-fuchsia-500/20 to-pink-500/20 border border-pink-500/50 px-5 py-2.5 text-xs font-semibold text-strong transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95"
            >
              <Sparkles
                size={14}
                className="text-pink-400 animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <span>Let&apos;s Talk</span>
              <ArrowRight
                size={14}
                className="text-pink-400 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-slate-300 hover:text-pink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded p-1 transition-transform duration-300 active:scale-90"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer: smooth height + staggered links */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-drawer border-t border-pink-500/20 px-6 py-6 space-y-1 text-sm backdrop-blur-2xl shadow-2xl">
            {links.map((l, i) => (
              <Link
                key={l.id}
                href={`/#${l.id}`}
                onClick={closeMenu}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${i * 55}ms` : "0ms" }}
                className={`block py-2.5 border-l-2 pl-4 transition-all duration-500 ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                } ${
                  active === l.id
                    ? "border-pink-500 text-pink-300"
                    : "border-transparent text-slate-300 hover:text-pink-400 hover:border-pink-500/50"
                }`}
              >
                {l.id === "education" ? "Education & Experience" : l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
