// ==========================================
// Component: Footer
// Description: Professional fully responsive footer with buttery-smooth hardware-accelerated animations
// Author: Lamia Kajal (Senior Full Stack Software Engineer)
// ==========================================

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Code2, ArrowUpRight, Mail } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export default function Footer() {
  const textRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  // Left Column Intersection Observer (Slides from Left)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTextVisible(true);
        } else {
          setIsTextVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" },
    );
    if (textRef.current) observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  // Right Column Intersection Observer (Slides from Right)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRightVisible(true);
        } else {
          setIsRightVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" },
    );
    if (rightRef.current) observer.observe(rightRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05010a]/95 backdrop-blur-2xl text-slate-300 pt-16 pb-12 overflow-hidden select-none">
      {/* Custom CSS for Buttery Smooth Hardware-Accelerated Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes brandWaveFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -6px, 0);
          }
        }
        @keyframes floatWaveIconOnly {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            color: rgba(255, 255, 255, 0.7);
          }
          50% {
            transform: translate3d(0, -5px, 0) scale(1.08);
            color: #f472b6;
          }
        }
        .animate-brand-wave {
          animation: brandWaveFloat 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .animate-axit-wave-icon {
          animation: floatWaveIconOnly 4.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
      `,
        }}
      />

      {/* Animated Pulsing Ambient Glow Background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-75 sm:w-112.5 h-32 sm:h-40 bg-pink-500/15 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12 relative z-10">
        {/* Top Section: Brand & Responsive Meaningful Bio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-10 sm:pb-12 border-b border-white/10">
          {/* Left Column (Slides from Left) */}
          <div
            ref={textRef}
            className={`md:col-span-6 space-y-3 w-full overflow-visible transition-all duration-1000 ease-out text-center md:text-left ${
              isTextVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="py-2 inline-block">
              <Link
                href="#home"
                className={`text-xl font-bold tracking-tight inline-flex items-center justify-center md:justify-start gap-3 group animate-brand-wave ${outfit.className}`}
              >
                {/* Brand Logo Icon Box */}
                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  {/* Rotating Glow Ring */}
                  <div
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-pink-500 to-fuchsia-500 opacity-70 blur-xs animate-spin"
                    style={{ animationDuration: "8s" }}
                  ></div>
                  <div className="absolute inset-0.5 rounded-[10px] bg-[#05010a]"></div>

                  <div className="relative z-10 w-8 h-8 rounded-lg bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:text-pink-300 transition-colors">
                    <Code2 size={16} />
                  </div>
                </div>
                {/* Brand Name */}
                <span className="bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent truncate group-hover:opacity-95 transition">
                  Lamia Kajal
                </span>
              </Link>
            </div>
            <p className="text-sm text-slate-300 max-w-md mx-auto md:mx-0 leading-relaxed font-normal wrap-break-word">
              Engineering robust, scalable full-stack web architectures from
              immersive front-end interfaces to high-performance back-end
              services. Focused on clean code, responsiveness, and premium
              digital experiences.
            </p>
          </div>

          {/* Right Column (Slides from Right) */}
          <div
            ref={rightRef}
            className={`md:col-span-6 flex flex-col items-center md:items-end space-y-4 w-full transition-all duration-1000 delay-100 ease-out ${
              isRightVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            {/* Live Availability Status with Pulse Animation */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-medium text-pink-300 shadow-md shadow-pink-500/10 animate-pulse text-center">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              Available for Select Full-Stack Projects & Roles
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-end flex-wrap gap-4 sm:gap-5 pt-2">
              {[
                {
                  href: "https://github.com",
                  label: "GitHub",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
                {
                  href: "https://facebook.com",
                  label: "Facebook",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.615V8z" />
                    </svg>
                  ),
                },
                {
                  href: "https://instagram.com",
                  label: "Instagram",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  href: "https://whatsapp.com",
                  label: "WhatsApp",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  ),
                },
                {
                  href: "mailto:contact@lamiakajal.com",
                  label: "Email",
                  icon: <Mail size={20} />,
                },
              ].map((social, index) => (
                <div
                  key={index}
                  style={{
                    transitionDelay: `${index * 75}ms`,
                  }}
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={{
                      animationDelay: `${index * 0.25}s`,
                    }}
                    className="flex items-center justify-center p-2 transition-all duration-300 hover:scale-125 hover:-translate-y-1.5 hover:text-pink-400 active:scale-95 cursor-pointer focus:outline-none animate-axit-wave-icon hover:[animation-play-state:paused]"
                  >
                    {social.icon}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright, Navigation Links & License */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center sm:text-left">
          <p className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            © {currentYear}{" "}
            <span className="text-slate-200 font-medium">Lamia Kajal</span>. All
            rights reserved. Built with Next.js & TypeScript.
          </p>

          <div className="flex items-center space-x-6 flex-wrap justify-center">
            <Link href="#home" className="hover:text-pink-400 transition">
              Privacy Policy
            </Link>
            <Link href="#home" className="hover:text-pink-400 transition">
              Terms of Service
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-pink-400 transition"
            >
              MIT License <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
