// ==========================================
// Component: Skills Section
// Description: Categorized skills shown as an animated, filterable card grid.
//              Category tabs act as an overview (with animated counters); changing
//              the tab replays a staggered pop-in animation on the cards.
// Theme: dark (default) and light via the CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useState } from "react";
import { Outfit } from "next/font/google";
import {
  Wrench,
  LayoutGrid,
  Layout,
  Palette,
  Braces,
  FileCode2,
  Atom,
  Globe,
  Wind,
  Server,
  Database,
  Blocks,
  KeyRound,
  GitBranch,
  Brain,
  Bot,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Typewriter from "@/components/ui/Typewriter";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ==========================================================================
   CONTENT - edit skills here (no need to touch the JSX below)
   ========================================================================== */

type CategoryId = "frontend" | "backend" | "tools";

interface Skill {
  name: string;
  icon: LucideIcon;
  category: CategoryId;
  text: string;
}

const categories: {
  id: CategoryId | "all";
  label: string;
  icon: LucideIcon;
  text: string;
}[] = [
  {
    id: "all",
    label: "All Skills",
    icon: LayoutGrid,
    text: "Everything I use",
  },
  {
    id: "frontend",
    label: "Frontend",
    icon: Monitor,
    text: "Interfaces & motion",
  },
  {
    id: "backend",
    label: "Backend & Data",
    icon: Server,
    text: "APIs, data & auth",
  },
  {
    id: "tools",
    label: "Tools & AI",
    icon: Wrench,
    text: "Workflow & mindset",
  },
];

const skills: Skill[] = [
  // Frontend
  {
    name: "HTML",
    icon: Layout,
    category: "frontend",
    text: "Semantic, accessible page structure.",
  },
  {
    name: "CSS",
    icon: Palette,
    category: "frontend",
    text: "Responsive layouts, animations and theming.",
  },
  {
    name: "JavaScript",
    icon: Braces,
    category: "frontend",
    text: "Modern ES6+ for interactive interfaces.",
  },
  {
    name: "TypeScript",
    icon: FileCode2,
    category: "frontend",
    text: "Type-safe code that scales with the project.",
  },
  {
    name: "React",
    icon: Atom,
    category: "frontend",
    text: "Component-driven, reusable user interfaces.",
  },
  {
    name: "Next.js",
    icon: Globe,
    category: "frontend",
    text: "App Router, server rendering and fast full-stack apps.",
  },
  {
    name: "Tailwind CSS",
    icon: Wind,
    category: "frontend",
    text: "Rapid, consistent and responsive styling.",
  },
  // Backend & data
  {
    name: "Node.js",
    icon: Server,
    category: "backend",
    text: "Fast, scalable server-side JavaScript.",
  },
  {
    name: "MongoDB",
    icon: Database,
    category: "backend",
    text: "Flexible document database design.",
  },
  {
    name: "Mongoose",
    icon: Blocks,
    category: "backend",
    text: "Schemas, models and validation for MongoDB.",
  },
  {
    name: "BetterAuth",
    icon: KeyRound,
    category: "backend",
    text: "Secure authentication and user sessions.",
  },
  // Tools & AI
  {
    name: "Git & GitHub",
    icon: GitBranch,
    category: "tools",
    text: "Version control, branches and collaboration.",
  },
  {
    name: "AI Mindset & Engineering",
    icon: Brain,
    category: "tools",
    text: "Planning and building with AI as a partner.",
  },
  {
    name: "AI-Assisted Coding",
    icon: Bot,
    category: "tools",
    text: "Shipping faster while owning the quality.",
  },
];

const learningLines = [
  "Learning something new every week.",
  "Exploring better ways to build.",
  "Turning knowledge into real projects.",
];

const categoryLabel: Record<CategoryId, string> = {
  frontend: "Frontend",
  backend: "Backend & Data",
  tools: "Tools & AI",
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function Skills() {
  const [active, setActive] = useState<CategoryId | "all">("all");

  const visible =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  const countFor = (id: CategoryId | "all") =>
    id === "all"
      ? skills.length
      : skills.filter((s) => s.category === id).length;

  return (
    <section
      id="skills"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* ------------------------------------------------------------------
            HEADER
        ------------------------------------------------------------------ */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <Wrench size={16} />
              <span>My Toolkit</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              Skills &amp;{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              The tools I use to design, build and ship complete web products,
              from the first pixel to the database.
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            CATEGORY TABS (overview cards with animated counters)
        ------------------------------------------------------------------ */}
        <div
          role="tablist"
          aria-label="Skill categories"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;
            return (
              <Reveal key={cat.id} direction="up" delay={i * 100}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat.id)}
                  className={`group relative w-full h-full text-left p-4 sm:p-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
                    isActive
                      ? "bg-pink-500/15 border-pink-500/60 shadow-[0_10px_35px_-12px_rgba(236,72,153,0.6)]"
                      : "bg-card border-line hover:border-pink-500/40"
                  }`}
                >
                  {/* Glow bar that grows on the active tab */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-linear-to-r from-pink-500 to-fuchsia-500 transition-all duration-500 ${
                      isActive ? "w-full" : "w-0 group-hover:w-1/3"
                    }`}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-linear-to-br from-pink-500 to-fuchsia-500 border-transparent text-white shadow-lg shadow-pink-500/40"
                          : "bg-pink-500/10 border-pink-500/30 text-pink-400"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${outfit.className} ${
                        isActive ? "text-strong" : "text-slate-400"
                      }`}
                    >
                      <AnimatedCounter to={countFor(cat.id)} />
                    </span>
                  </div>
                  <p
                    className={`text-sm sm:text-base font-bold text-strong leading-tight ${outfit.className}`}
                  >
                    {cat.label}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    {cat.text}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------
            SKILL CARDS (grid replays its pop-in animation when the tab changes)
        ------------------------------------------------------------------ */}
        <Reveal direction="up" delay={100} threshold={0.05}>
          <div
            key={active}
            className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {visible.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="skill-pop"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="glow-card group relative h-full p-5 rounded-2xl bg-card border border-line overflow-hidden">
                    {/* Soft glow that appears on hover */}
                    <span className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-pink-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative flex items-start justify-between mb-4">
                      <span className="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Icon size={22} />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-pink-400 transition-colors">
                        {categoryLabel[skill.category]}
                      </span>
                    </div>

                    <h3
                      className={`relative text-base sm:text-lg font-bold text-strong mb-1.5 ${outfit.className}`}
                    >
                      {skill.name}
                    </h3>
                    <p className="relative text-sm text-slate-300 leading-relaxed">
                      {skill.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            ALWAYS LEARNING (typewriter)
        ------------------------------------------------------------------ */}
        <Reveal direction="zoom" delay={100}>
          <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-5 py-4 rounded-2xl bg-card border border-line text-center sm:text-left">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <p className="text-sm sm:text-base font-medium text-slate-300 min-h-6">
              <Typewriter words={learningLines} />
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
