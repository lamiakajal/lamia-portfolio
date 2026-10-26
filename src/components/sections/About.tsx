// ==========================================
// Component: About Section
// Description: Full "About Me" section with bio, 3D tilt photo, animated stats,
//              journey timeline, developer code card, what I love building,
//              hobbies & interests, personality chips and a tech marquee.
//              Every block animates on scroll (up & down) using <Reveal />.
// Theme: works in both dark (default) and light mode via CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Outfit } from "next/font/google";
import {
  User,
  Layers,
  Sparkles,
  ShieldCheck,
  Music,
  PenLine,
  Video,
  Rocket,
  Terminal,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Lightbulb,
  GraduationCap,
  Code2,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Typewriter from "@/components/ui/Typewriter";
import { getSocial, techStack, siteImages } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ==========================================================================
   CONTENT - edit the text here (no need to touch the JSX below)
   ========================================================================== */

// Animated counters under the bio
const stats = [
  { value: 12, suffix: "+", label: "Technologies in my stack" },
  { value: 3, suffix: "+", label: "Featured projects" },
  { value: 1, suffix: "", label: "Full-stack course completed" },
];

// Lines typed under the "About Me" heading
const taglines = [
  "Developer by craft, learner by nature.",
  "I turn ideas into full-stack web apps.",
  "Clean code. Smooth UX. Zero shortcuts.",
  "AI-first, human-led, always learning.",
];

// Small personality tags
const traits = [
  "Curious",
  "Detail-oriented",
  "Self-driven",
  "Creative thinker",
  "Calm problem-solver",
  "Clear communicator",
];

// Learning journey timeline
const journey: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Compass,
    title: "The Spark",
    text: "One question started everything: how does a web page come alive? HTML, CSS and JavaScript gave me the first answers, and I fell in love with building things for the browser.",
  },
  {
    icon: Layers,
    title: "Modern Front-End",
    text: "I moved on to React, TypeScript, Tailwind CSS and Next.js, learning component thinking, type safety and how to make interfaces feel great on every screen size.",
  },
  {
    icon: ShieldCheck,
    title: "Going Full Stack",
    text: "With Node.js, MongoDB, Mongoose and BetterAuth I learned to design APIs, model data and protect users with secure authentication.",
  },
  {
    icon: GraduationCap,
    title: "AI-Driven Engineering",
    text: "I completed the AI-Driven Full Stack Web Engineering course and learned to plan, build and ship faster with AI-assisted coding, while keeping quality firmly in human hands. And I am still learning.",
  },
];

// The kind of work I enjoy
const loveBuilding: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Layers,
    title: "Full-Stack Web Apps",
    text: "End-to-end products: a clean UI, a solid API and a database that scales, all working together smoothly.",
  },
  {
    icon: Sparkles,
    title: "Interfaces with Motion",
    text: "Responsive layouts and thoughtful micro-interactions that make a website feel alive and polished.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable Backends",
    text: "Well-structured Node.js services, sensible data models and authentication you can trust.",
  },
];

// Hobbies and interests outside of coding (each links to the real profile)
const beyondCode: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}[] = [
  {
    icon: PenLine,
    title: "Writing & Blogging",
    text: "I like turning what I learn into articles that help other developers.",
    href: getSocial("medium"),
  },
  {
    icon: Music,
    title: "Music & Fine Arts",
    text: "I studied music and fine arts at Bulbul Academy of Fine Arts, and that creative side shapes my design taste.",
    href: getSocial("behance"),
  },
  {
    icon: Video,
    title: "Sharing on Video",
    text: "Explaining tech and sharing my learning journey through YouTube.",
    href: getSocial("youtube"),
  },
  {
    icon: Lightbulb,
    title: "Exploring New Tech",
    text: "Trying new tools, frameworks and AI workflows just to see what is possible.",
    href: getSocial("github"),
  },
];

/* ==========================================================================
   SMALL HELPERS
   ========================================================================== */

// Section sub-heading with an icon and a fading line
function SubHeading({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-500/10">
        <Icon size={20} />
      </span>
      <h3
        className={`text-xl sm:text-2xl font-bold text-strong ${outfit.className}`}
      >
        {title}
      </h3>
      <span className="hidden sm:block h-px flex-1 bg-linear-to-r from-pink-500/40 to-transparent" />
    </div>
  );
}

// Highlighted words inside paragraphs
const Hl = ({ children }: { children: React.ReactNode }) => (
  <span className="text-strong font-semibold">{children}</span>
);

// Lines of the developer code card (always rendered on a dark editor background)
const codeLines: React.ReactNode[] = [
  <>
    <span className="text-[#f0abfc]">const</span>{" "}
    <span className="text-[#f9a8d4]">lamia</span> = {"{"}
  </>,
  <>
    {"  "}role:{" "}
    <span className="text-[#86efac]">&quot;Full Stack Developer&quot;</span>,
  </>,
  <>
    {"  "}stack: [<span className="text-[#86efac]">&quot;Next.js&quot;</span>,{" "}
    <span className="text-[#86efac]">&quot;Node.js&quot;</span>,
  </>,
  <>
    {"    "}
    <span className="text-[#86efac]">&quot;MongoDB&quot;</span>],
  </>,
  <>
    {"  "}mindset:{" "}
    <span className="text-[#86efac]">&quot;AI-first, human-led&quot;</span>,
  </>,
  <>
    {"  "}learning: <span className="text-[#fcd34d]">true</span>,
  </>,
  <>
    {"  "}openToWork: <span className="text-[#fcd34d]">true</span>,
  </>,
  <>
    {"  "}build(): <span className="text-[#93c5fd]">void</span> {"{"}
  </>,
  <>
    {"    "}
    <span className="text-[#f0abfc]">return</span>{" "}
    <span className="text-[#86efac]">&quot;something great&quot;</span>;
  </>,
  <>
    {"  "}
    {"}"}
  </>,
  <>
    {"}"};
    <span className="caret-blink inline-block w-2 h-4 ml-1 -mb-0.5 bg-[#f472b6]" />
  </>,
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function About() {
  const tiltRef = useRef<HTMLDivElement>(null);

  // 3D tilt + moving glare for the profile card
  const handleTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(1000px) rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const resetTilt = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    }
  };
  // Touch / pen: reset when the finger lifts. Mouse: keep tilting while hovering.
  const releaseTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") resetTilt();
  };

  return (
    <section
      id="about"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      {/* Shared container (same width as Navbar, Hero and Footer) */}
      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 space-y-20 sm:space-y-28">
        {/* ------------------------------------------------------------------
            1. HEADER + BIO + PHOTO
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="down">
            <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
                <User size={16} />
                <span>Discover More</span>
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
              >
                About{" "}
                <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                  Me
                </span>
              </h2>
              <p className="max-w-xl min-h-6 text-sm sm:text-base text-slate-400">
                <Typewriter words={taglines} />
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            {/* Left: text, traits, stats, buttons */}
            <div className="lg:col-span-7 min-w-0 order-2 lg:order-1">
              <div className="space-y-5 text-slate-300 text-sm sm:text-base leading-relaxed">
                <Reveal direction="left" delay={0}>
                  <p>
                    Hello! I&apos;m <Hl>Lamia Kajal</Hl>, a{" "}
                    <Hl>Full Stack Developer</Hl> who loves turning ideas into
                    fast, beautiful and genuinely useful web experiences. I
                    enjoy owning a product from end to end: the interface people
                    touch, the API behind it and the database that keeps
                    everything remembered.
                  </p>
                </Reveal>
                <Reveal direction="left" delay={100}>
                  <p>
                    My story began with a simple question: how does a web page
                    actually come alive? Chasing that answer took me through{" "}
                    <Hl>HTML, CSS and JavaScript</Hl>, into{" "}
                    <Hl>React, TypeScript and Next.js</Hl>, and then deep into
                    the backend with <Hl>Node.js, MongoDB and BetterAuth</Hl>.
                    After completing the AI-Driven Full Stack Web Engineering
                    course I kept going, because the web never stands still and
                    neither do I.
                  </p>
                </Reveal>
                <Reveal direction="left" delay={200}>
                  <p>
                    I&apos;m happiest where design meets engineering: smooth
                    animations, responsive layouts, clean APIs and code that the
                    next developer (often future me) can read without a
                    headache. I also work <Hl>AI-first</Hl>: AI-assisted coding
                    handles the repetitive parts so I can spend my energy on
                    architecture, details and quality.
                  </p>
                </Reveal>
                <Reveal direction="up" delay={250}>
                  <blockquote className="relative pl-5 py-1 border-l-2 border-pink-500/70 text-strong font-medium italic">
                    My goal: build software that feels effortless to use and
                    solid under the hood.
                  </blockquote>
                </Reveal>
              </div>
            </div>

            {/* Right: 3D tilt photo card with floating badges */}
            <div className="lg:col-span-5 order-1 lg:order-2 min-w-0">
              <Reveal direction="right" delay={100} className="h-full">
                <div className="w-full h-full flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-xs sm:max-w-sm aspect-4/5 lg:aspect-auto lg:max-w-none lg:h-full lg:min-h-112">
                    {/* Decorative layers */}
                    <div className="absolute inset-0 bg-linear-to-tr from-pink-500/25 to-fuchsia-500/25 rounded-3xl rotate-6 scale-105 blur-xl opacity-70" />
                    <div className="absolute inset-0 border-2 border-pink-500/30 rounded-3xl -rotate-3 transition-transform duration-700 hover:rotate-0" />

                    <div
                      ref={tiltRef}
                      onPointerDown={handleTiltMove}
                      onPointerMove={handleTiltMove}
                      onPointerLeave={resetTilt}
                      onPointerUp={releaseTilt}
                      onPointerCancel={resetTilt}
                      className="touch-pan-y tilt-card relative w-full h-full rounded-3xl overflow-hidden border border-line shadow-2xl shadow-pink-500/20 transition-transform duration-200 ease-out will-change-transform"
                    >
                      <Image
                        src={siteImages.about.src}
                        alt={siteImages.about.alt}
                        unoptimized
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 384px, 33vw"
                        className="object-cover"
                        style={{ objectPosition: siteImages.about.position }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <div className="tilt-glare absolute inset-0 pointer-events-none" />
                    </div>

                    {/* Floating badges */}
                    <div
                      className="float-y absolute -left-2 sm:-left-8 top-8 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-chip border border-pink-500/40 backdrop-blur-md shadow-lg shadow-pink-500/20 text-xs font-semibold text-strong"
                      style={{ "--float-delay": "0s" } as React.CSSProperties}
                    >
                      <Code2 size={14} className="text-pink-400" />
                      Full Stack Developer
                    </div>
                    <div
                      className="float-y absolute -right-2 sm:-right-6 bottom-24 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-chip border border-pink-500/40 backdrop-blur-md shadow-lg shadow-pink-500/20 text-xs font-semibold text-strong"
                      style={{ "--float-delay": "1.2s" } as React.CSSProperties}
                    >
                      <Layers size={14} className="text-pink-400" />
                      Next.js &amp; TypeScript
                    </div>
                    <div
                      className="float-y absolute left-4 sm:left-2 -bottom-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-chip border border-pink-500/40 backdrop-blur-md shadow-lg shadow-pink-500/20 text-xs font-semibold text-strong"
                      style={{ "--float-delay": "2.4s" } as React.CSSProperties}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      Always learning
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
          {/* Personality chips, counters and buttons: full-width row under the bio + photo */}
          <div className="mt-12 sm:mt-14 space-y-8">
            {/* Personality chips */}
            <Reveal direction="up" delay={100}>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {traits.map((t) => (
                  <span
                    key={t}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-card border border-line text-slate-300 hover:text-pink-400 hover:border-pink-500/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Animated counters */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <Reveal key={s.label} direction="zoom" delay={i * 120}>
                  <div
                    className="glow-card loop-bob h-full p-4 sm:p-5 rounded-2xl bg-card border border-line text-center sm:text-left group"
                    style={
                      { "--bob-delay": `${i * 0.5}s` } as React.CSSProperties
                    }
                  >
                    <h4
                      className={`text-2xl sm:text-3xl font-extrabold text-strong mb-1 transition-colors group-hover:text-pink-400 ${outfit.className}`}
                    >
                      <AnimatedCounter to={s.value} suffix={s.suffix} />
                    </h4>
                    <p className="text-[11px] sm:text-sm text-pink-300/80 font-medium leading-snug">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Call to action buttons */}
            <Reveal direction="up" delay={150}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="btn-shine group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span className="relative z-10">
                    Let&apos;s Work Together
                  </span>
                  <ArrowRight
                    size={16}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-strong font-semibold text-sm hover:bg-pink-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  View My Projects
                  <ArrowUpRight
                    size={16}
                    className="text-pink-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            2. JOURNEY TIMELINE + DEVELOPER CODE CARD
        ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-7 min-w-0">
            <Reveal direction="left">
              <SubHeading icon={Rocket} title="My Programming Journey" />
            </Reveal>

            <Reveal direction="up" threshold={0.05}>
              <div className="relative pl-12">
                {/* Line that draws itself from top to bottom */}
                <span className="tl-line absolute left-4.25 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-pink-500 via-fuchsia-500 to-transparent" />
                {/* Glowing light that keeps travelling down the line (loop) */}
                <span
                  aria-hidden
                  className="absolute left-4.25 top-2 bottom-2 w-0.5"
                >
                  <span className="tl-pulse" />
                </span>

                <div className="space-y-8">
                  {journey.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <Reveal key={step.title} direction="left" delay={i * 140}>
                        <div className="relative group">
                          {/* Timeline dot */}
                          <span className="ring-pulse absolute -left-12 top-0 w-9 h-9 rounded-full bg-chip border-2 border-pink-500/60 flex items-center justify-center text-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.35)] transition-transform duration-300 group-hover:scale-110">
                            <Icon size={16} />
                          </span>
                          <div
                            className="glow-card loop-bob p-5 rounded-2xl bg-card border border-line"
                            style={
                              {
                                "--bob-delay": `${i * 0.6}s`,
                                "--bob-dur": "7s",
                              } as React.CSSProperties
                            }
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-pink-400 mb-1">
                              Step {i + 1}
                            </p>
                            <h4
                              className={`text-lg font-bold text-strong mb-1.5 ${outfit.className}`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Developer code card (always dark, like a real editor) */}
          <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-28">
            <Reveal direction="right" delay={100}>
              <div className="spin-border rounded-2xl overflow-hidden border border-pink-500/30 bg-[#0d0618] shadow-2xl shadow-pink-500/15">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/3">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 flex items-center gap-1.5 text-[11px] text-[#a99bc2]">
                    <Terminal size={12} />
                    lamia.ts
                  </span>
                </div>

                {/* Code lines reveal one by one */}
                <pre className="p-4 sm:p-5 text-[12px] xs:text-[13px] leading-relaxed font-mono overflow-x-auto text-[#e9d5ff]">
                  <code className="block space-y-0.5">
                    {codeLines.map((line, i) => (
                      <Reveal key={i} direction="left" delay={200 + i * 90}>
                        <span className="block whitespace-pre">{line}</span>
                      </Reveal>
                    ))}
                  </code>
                </pre>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            3. WHAT I LOVE BUILDING
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <SubHeading icon={Sparkles} title="The Work I Love" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loveBuilding.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} direction="up" delay={i * 130}>
                  <div
                    className="glow-card loop-bob group h-full p-6 rounded-2xl bg-card border border-line"
                    style={
                      { "--bob-delay": `${i * 0.7}s` } as React.CSSProperties
                    }
                  >
                    <div className="w-12 h-12 mb-4 rounded-xl bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <span
                        className="icon-breathe flex"
                        style={
                          {
                            "--bob-delay": `${i * 0.4}s`,
                          } as React.CSSProperties
                        }
                      >
                        <Icon size={22} />
                      </span>
                    </div>
                    <h4
                      className={`text-lg font-bold text-strong mb-2 ${outfit.className}`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------
            4. BEYOND THE CODE (hobbies & interests)
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <SubHeading icon={Lightbulb} title="Beyond the Code" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {beyondCode.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} direction="zoom" delay={i * 110}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-card loop-bob group relative block h-full p-6 rounded-2xl bg-card border border-line overflow-hidden"
                    style={
                      {
                        "--bob-delay": `${i * 0.55}s`,
                        "--bob-dur": "6.5s",
                      } as React.CSSProperties
                    }
                  >
                    <ArrowUpRight
                      size={16}
                      className="absolute top-4 right-4 text-slate-500 transition-all duration-300 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    <div className="w-11 h-11 mb-4 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon size={20} />
                    </div>
                    <h4
                      className={`text-base font-bold text-strong mb-1.5 ${outfit.className}`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------
            5. TECH MARQUEE
        ------------------------------------------------------------------ */}
        <Reveal direction="up">
          <p className="text-center text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-slate-400 mb-6">
            My everyday toolkit
          </p>
          <div className="marquee-wrap overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track py-2">
              {/* The list is rendered twice so the loop is seamless */}
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  aria-hidden={i >= techStack.length}
                  className="mr-3 shrink-0 px-5 py-2.5 rounded-full bg-card border border-line text-sm font-medium text-slate-300 hover:text-pink-400 hover:border-pink-500/50 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
