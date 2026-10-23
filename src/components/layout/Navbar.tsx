// ==========================================
// Component: Navbar
// Description: Glassmorphic sticky navbar with animated logo ring & glowing CTA button loop
// Author: Lamia Kajal (Senior Full Stack Software Engineer)
// ==========================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Code2, Sparkles } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#05010a]/80 backdrop-blur-xl border-b border-white/6">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Brand Name with Rotating Glow Ring & Pro Icon */}
        <Link
          href="#home"
          className={`text-xl font-bold tracking-tight flex items-center gap-3 group ${outfit.className}`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Rotating Orbiting Glow Loop */}
            <div
              className="absolute inset-0 rounded-xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-pink-400 opacity-70 blur-xs animate-spin"
              style={{ animationDuration: "6s" }}
            ></div>
            <div className="absolute inset-0.5 rounded-[10px] bg-[#05010a]"></div>

            {/* Icon */}
            <div className="relative z-10 w-9 h-9 rounded-xl bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:border-pink-500 transition shadow-lg shadow-pink-500/20">
              <Code2 size={18} className="animate-pulse" />
            </div>
          </div>

          <span className="bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
            Lamia Kajal
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <Link href="#home" className="hover:text-pink-400 transition">
            Home
          </Link>
          <Link href="#about" className="hover:text-pink-400 transition">
            About
          </Link>
          <Link href="#skills" className="hover:text-pink-400 transition">
            Skills
          </Link>
          <Link href="#education" className="hover:text-pink-400 transition">
            Education
          </Link>
          <Link href="#projects" className="hover:text-pink-400 transition">
            Projects
          </Link>
          <Link href="#contact" className="hover:text-pink-400 transition">
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Button with Glowing Animation Loop */}
        <div className="hidden sm:flex items-center">
          <Link
            href="#contact"
            className="relative inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-500/20 via-fuchsia-500/20 to-pink-500/20 border border-pink-500/50 px-5 py-2.5 text-xs font-semibold text-white transition shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] animate-pulse"
          >
            <Sparkles
              size={14}
              className="text-pink-400 animate-spin"
              style={{ animationDuration: "4s" }}
            />
            <span>Let&apos;s Talk</span>
            <ArrowRight
              size={14}
              className="text-pink-400 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-300 hover:text-pink-400 text-xl focus:outline-none p-1"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0214]/95 border-b border-pink-500/20 px-6 py-6 space-y-4 text-sm backdrop-blur-2xl shadow-2xl animate-fadeIn">
          <Link
            href="#home"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            Home
          </Link>
          <Link
            href="#about"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            About
          </Link>
          <Link
            href="#skills"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            Skills
          </Link>
          <Link
            href="#education"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            Education & Experience
          </Link>
          <Link
            href="#projects"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            Projects
          </Link>
          <Link
            href="#contact"
            onClick={toggleMenu}
            className="block text-slate-300 hover:text-pink-400 transition py-1"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
