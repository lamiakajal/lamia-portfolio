// ==========================================
// Component: Hero Section
// Description: Hero aligned with Navbar bounds, typewriter roles (ESLint fixed),
//              cursor spotlight, 3D tilt profile, staggered entrance and orbiting skills
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Download, ChevronDown } from "lucide-react";
import { Outfit } from "next/font/google";
import { getSocial } from "@/data/portfolioData";
import { useTypewriter } from "@/hooks/useTypewriter";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ------------------------------------------------------------------
   Skill icons (inline SVG, no extra package needed)
------------------------------------------------------------------ */
const NodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinejoin="round"
  >
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
    <text
      x="12"
      y="15.2"
      textAnchor="middle"
      fontSize="7.5"
      fontWeight="800"
      fill="currentColor"
      stroke="none"
    >
      JS
    </text>
  </svg>
);

const Html5Icon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M3.5 2h17l-1.55 17.4L12 22l-6.95-2.6L3.5 2z" />
    <text
      x="12"
      y="15"
      textAnchor="middle"
      fontSize="9"
      fontWeight="900"
      fill="#05010a"
    >
      5
    </text>
  </svg>
);

const ReactIcon = () => (
  <svg
    viewBox="-12 -12 24 24"
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
  >
    <circle r="1.8" fill="currentColor" stroke="none" />
    <ellipse rx="10" ry="4" />
    <ellipse rx="10" ry="4" transform="rotate(60)" />
    <ellipse rx="10" ry="4" transform="rotate(120)" />
  </svg>
);

/* ------------------------------------------------------------------
   Orbit config — To add a new skill, simply add an object here
------------------------------------------------------------------ */
const skills = [
  {
    name: "Node.js",
    icon: <NodeIcon />,
    startAngle: 225,
    duration: 20,
    reverse: false,
    color:
      "text-emerald-400 border-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.7)]",
    shape: "rounded-full",
  },
  {
    name: "HTML5",
    icon: <Html5Icon />,
    startAngle: 340,
    duration: 20,
    reverse: false,
    color:
      "text-amber-400 border-amber-500 shadow-[0_0_22px_rgba(245,158,11,0.7)]",
    shape: "rounded-full",
  },
  {
    name: "React",
    icon: <ReactIcon />,
    startAngle: 110,
    duration: 20,
    reverse: false,
    color:
      "text-cyan-400 border-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.7)]",
    shape: "rounded-full",
  },
];

/* Roles for the typewriter line */
const roles = [
  "scalable Next.js applications",
  "secure full-stack web apps",
  "pixel-perfect responsive interfaces",
  "smooth, animated user experiences",
  "type-safe APIs with Node.js & MongoDB",
  "AI-powered, future-ready products",
];

const socials = [
  {
    href: getSocial("github"),
    label: "GitHub",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    href: getSocial("linkedin"),
    label: "LinkedIn",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    href: getSocial("facebook"),
    label: "Facebook",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.615V8z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const typed = useTypewriter(roles);

  /* 3D tilt for the profile circle */
  const handleTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  };
  const resetTilt = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg)";
    }
  };
  // Touch / pen: reset when the finger lifts. Mouse: keep tilting while hovering.
  const releaseTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") resetTilt();
  };

  return (
    <section
      id="home"
      /* overflow-x-clip stops any child (glows, orbit, blur) from pushing the page sideways.
         The square grid + mouse spotlight now live in the global background (layout.tsx). */
      className="relative w-full min-h-screen flex items-center overflow-x-clip"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .orbit-wrap { --orbit-r: 135px; }
        @media (min-width: 640px)  { .orbit-wrap { --orbit-r: 155px; } }
        @media (min-width: 1024px) { .orbit-wrap { --orbit-r: 180px; } }

        @keyframes orbit {
          from { transform: rotate(0deg)   translateX(var(--orbit-r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }
        @keyframes orbitReverse {
          from { transform: rotate(0deg)    translateX(var(--orbit-r)) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(var(--orbit-r)) rotate(360deg); }
        }
        .orbit-item {
          animation-name: orbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .orbit-item.reverse { animation-name: orbitReverse; }

        /* Staggered entrance */
        @keyframes heroReveal {
          from { opacity: 0; transform: translate3d(0, 28px, 0); filter: blur(6px); }
          to   { opacity: 1; transform: translate3d(0, 0, 0);    filter: blur(0); }
        }
        @keyframes heroPop {
          from { opacity: 0; transform: scale(0.85); filter: blur(8px); }
          to   { opacity: 1; transform: scale(1);    filter: blur(0); }
        }
        .hero-reveal {
          opacity: 0;
          animation: heroReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--d, 0ms);
        }
        .hero-pop {
          opacity: 0;
          animation: heroPop 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--d, 0ms);
        }

        /* Animated gradient on name */
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .name-gradient {
          background-size: 200% auto;
          animation: gradientShift 6s linear infinite;
        }

        /* CTA shine sweep */
        @keyframes shine {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(260%) skewX(-20deg); }
        }
        .cta-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: shine 3.2s ease-in-out infinite;
        }

        /* Blinking cursor */
        @keyframes blink { 50% { opacity: 0; } }
        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          margin-left: 3px;
          vertical-align: -0.15em;
          background: #f9a8d4;
          animation: blink 0.9s steps(1) infinite;
        }

        /* Scroll hint */
        @keyframes nudge {
          0%, 100% { transform: translateY(0);   opacity: 0.5; }
          50%      { transform: translateY(6px); opacity: 1; }
        }
        .scroll-nudge { animation: nudge 1.8s ease-in-out infinite; }

        /* Floating profile */
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .float-slow { animation: floaty 7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          /* Only the entrance animation is simplified; loops keep running on purpose */
          .hero-reveal, .hero-pop { animation: none; opacity: 1; filter: none; transform: none; }
        }
      `,
        }}
      />

      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 sm:w-137.5 h-87.5 sm:h-137.5 bg-pink-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      {/* Same container as Navbar & Footer: max-w-6xl mx-auto px-6 */}
      <div className="w-full max-w-6xl mx-auto px-6 relative z-10 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="min-w-0 lg:col-span-7 space-y-6 text-center lg:text-left">
            <div
              className="hero-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/10 backdrop-blur-md"
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span>Full Stack Developer</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1
                className={`hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
                style={{ "--d": "250ms" } as React.CSSProperties}
              >
                Hi, I&apos;m{" "}
                <span className="name-gradient bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                  Lamia Kajal
                </span>
              </h1>
              <p
                className="hero-reveal text-lg sm:text-2xl font-semibold text-pink-300/90 tracking-wide"
                style={{ "--d": "400ms" } as React.CSSProperties}
              >
                Building Scalable Web Architectures & Immersive Interfaces
              </p>
            </div>

            {/* Typewriter line */}
            <p
              className="hero-reveal text-sm sm:text-base text-slate-400 font-medium min-h-6"
              style={{ "--d": "550ms" } as React.CSSProperties}
              aria-live="polite"
            >
              I craft <span className="text-strong">{typed}</span>
              <span className="type-cursor" aria-hidden />
            </p>

            <p
              className="hero-reveal text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              style={{ "--d": "700ms" } as React.CSSProperties}
            >
              I design and build modern full-stack web applications, from pixel-perfect, responsive interfaces to secure back-end APIs, using Next.js, TypeScript, React, Node.js, MongoDB and Tailwind CSS.
            </p>

            <div
              className="hero-reveal flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              style={{ "--d": "850ms" } as React.CSSProperties}
            >
              <a
                href="/resume.pdf"
                download="Lamia-Kajal-Resume.pdf"
                className="cta-shine group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-300"
              >
                <span className="relative z-10">Download Resume</span>
                <Download
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>

              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/60 hover:bg-pink-500/10 hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Circle + Orbiting Icons */}
          <div
            className="hero-pop min-w-0 lg:col-span-5 flex items-center justify-center relative py-12 lg:py-16"
            style={{ "--d": "400ms" } as React.CSSProperties}
          >
            <div className="float-slow">
              <div
                ref={tiltRef}
                onPointerDown={handleTiltMove}
                onPointerMove={handleTiltMove}
                onPointerLeave={resetTilt}
                onPointerUp={releaseTilt}
                onPointerCancel={resetTilt}
                className="touch-pan-y orbit-wrap relative w-68 sm:w-80 lg:w-88 h-68 sm:h-80 lg:h-88 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
              >
                {/* Outer Rotating Glow Ring */}
                <div
                  className="absolute inset-0 rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-pink-500 opacity-70 blur-md animate-spin"
                  style={{ animationDuration: "12s" }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-page"></div>

                {/* Inner Pulse Ring */}
                <div
                  className="absolute inset-4 rounded-full border-2 border-pink-500/40 animate-pulse"
                  style={{ animationDuration: "4s" }}
                ></div>

                {/* Profile Image */}
                <div className="relative z-10 w-56 sm:w-68 lg:w-76 h-56 sm:h-68 lg:h-76 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-2xl shadow-pink-500/30 bg-slate-900">
                  <Image
                    src="/assets/profile.jpg"
                    alt="Lamia Kajal"
                    fill
                    sizes="(max-width: 640px) 224px, (max-width: 1024px) 272px, 304px"
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Orbiting Skill Icons */}
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <div
                      className={`orbit-item ${skill.reverse ? "reverse" : ""}`}
                      style={
                        {
                          animationDuration: `${skill.duration}s`,
                          animationDelay: `-${(skill.startAngle / 360) * skill.duration}s`,
                          "--start": `${skill.startAngle}deg`,
                        } as React.CSSProperties
                      }
                    >
                      <div
                        title={skill.name}
                        className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 ${skill.shape} bg-chip border-2 flex items-center justify-center backdrop-blur-md ${skill.color}`}
                      >
                        {skill.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to About section"
        className="hero-reveal absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-slate-500 hover:text-pink-400 transition-colors"
        style={{ "--d": "1200ms" } as React.CSSProperties}
      >
        <span className="text-[11px] tracking-wide">Scroll</span>
        <ChevronDown size={18} className="scroll-nudge" />
      </a>
    </section>
  );
}
