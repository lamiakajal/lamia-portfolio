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
  Server,
  Brain,
  Bot,
  Monitor,
  type LucideIcon,
} from "lucide-react";
// Original brand logos (Simple Icons + Font Awesome via react-icons)
import {
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiMongoose,
  SiBetterauth,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
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

// Any icon component that accepts a size (works for lucide-react and react-icons)
type IconComponent = React.ComponentType<{ size?: number | string }>;

interface Skill {
  name: string;
  icon: IconComponent;
  /** Original brand colour. Logos that are black/white use the theme text colour. */
  color: string;
  category: CategoryId;
  text: string;
}

// Used for logos that are black (dark mode needs white, light mode needs dark)
const ADAPTIVE = "var(--fg-strong)";

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
    icon: SiHtml5,
    color: "#E34F26",
    category: "frontend",
    text: "Semantic, accessible page structure.",
  },
  {
    name: "CSS",
    icon: FaCss3Alt,
    color: "#1572B6",
    category: "frontend",
    text: "Responsive layouts, animations and theming.",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
    category: "frontend",
    text: "Modern ES6+ for interactive interfaces.",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
    category: "frontend",
    text: "Type-safe code that scales with the project.",
  },
  {
    name: "React",
    icon: SiReact,
    color: "#61DAFB",
    category: "frontend",
    text: "Component-driven, reusable user interfaces.",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: ADAPTIVE,
    category: "frontend",
    text: "App Router, server rendering and fast full-stack apps.",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
    category: "frontend",
    text: "Rapid, consistent and responsive styling.",
  },
  // Backend & data
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#5FA04E",
    category: "backend",
    text: "Fast, scalable server-side JavaScript.",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    category: "backend",
    text: "Flexible document database design.",
  },
  {
    name: "Mongoose",
    icon: SiMongoose,
    color: "#E5484D",
    category: "backend",
    text: "Schemas, models and validation for MongoDB.",
  },
  {
    name: "BetterAuth",
    icon: SiBetterauth,
    color: ADAPTIVE,
    category: "backend",
    text: "Secure authentication and user sessions.",
  },
  // Tools & AI
  {
    name: "Git",
    icon: SiGit,
    color: "#F05032",
    category: "tools",
    text: "Version control, branches and clean history.",
  },
  {
    name: "GitHub",
    icon: SiGithub,
    color: ADAPTIVE,
    category: "tools",
    text: "Collaboration, pull requests and code hosting.",
  },
  {
    name: "AI Mindset & Engineering",
    icon: Brain,
    color: "#F472B6",
    category: "tools",
    text: "Planning and building with AI as a partner.",
  },
  {
    name: "AI-Assisted Coding",
    icon: Bot,
    color: "#D946EF",
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
                      ? "spin-border loop-glow bg-pink-500/15 border-pink-500/60"
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
              // Tinted tile + glow use the technology's own brand colour
              const tileStyle: React.CSSProperties = {
                color: skill.color,
                background: `color-mix(in srgb, ${skill.color} 14%, transparent)`,
                borderColor: `color-mix(in srgb, ${skill.color} 40%, transparent)`,
              };
              return (
                <div
                  key={skill.name}
                  className="skill-pop"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div
                    className="glow-card loop-bob group relative h-full p-5 rounded-2xl bg-card border border-line overflow-hidden"
                    style={
                      {
                        "--bob-delay": `${(i % 6) * 0.45}s`,
                        "--bob-dur": `${5.5 + (i % 4) * 0.6}s`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Soft glow in the brand colour that appears on hover */}
                    <span
                      className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `color-mix(in srgb, ${skill.color} 35%, transparent)`,
                      }}
                    />

                    <div className="relative flex items-start justify-between mb-4">
                      <span
                        className="w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                        style={tileStyle}
                      >
                        <span
                          className="icon-breathe flex"
                          style={
                            {
                              "--bob-delay": `${(i % 5) * 0.3}s`,
                            } as React.CSSProperties
                          }
                        >
                          <Icon size={28} />
                        </span>
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
