// ==========================================
// Component: Education Section
// Description: Animated education page section with three parts:
//              1) Academic timeline (BBA, HSC, SSC, Primary, Pre-school)
//              2) Professional learning (Programming Hero course, self-learning)
//              3) Co-curricular & cultural education (Music & Fine Arts)
//              The centre line draws itself, cards slide in from alternating sides
//              and every animation replays when you scroll back (up & down).
// Theme: dark (default) and light via the CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React from "react";
import { Outfit } from "next/font/google";
import {
  GraduationCap,
  BookOpen,
  Building2,
  CheckCircle2,
  Rocket,
  School,
  Backpack,
  Baby,
  Music,
  Laptop,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ==========================================================================
   CONTENT - add or edit entries here (no need to touch the JSX below)
   ========================================================================== */

interface EducationItem {
  icon: LucideIcon;
  title: string;
  institution?: string;
  /** Education level label, e.g. "College", "Primary", "University" */
  level?: string;
  status?: "Ongoing" | "Completed";
  text?: string;
  tags?: string[];
}

// 1) Academic background (newest first)
const academic: EducationItem[] = [
  {
    icon: GraduationCap,
    title: "Bachelor of Business Administration (Honours)",
    institution: "Govt. Shaheed Suhrawardy College",
    level: "University",
    status: "Ongoing",
    text: "Studying Business Administration alongside my development work. It gives me a solid foundation in how businesses run, which helps me understand the business side of every product I build.",
    tags: ["Business Administration", "Honours Programme"],
  },
  {
    icon: BookOpen,
    title: "Higher Secondary Certificate (HSC)",
    institution: "Rokeya Ahsan College",
    level: "College",
    status: "Completed",
  },
  {
    icon: School,
    title: "Secondary School Certificate (SSC) & Junior Level",
    institution: "Bamoil Ideal High School and College",
    level: "High School",
    status: "Completed",
  },
  {
    icon: Backpack,
    title: "Primary Education",
    institution: "Moniza Rahman Girls' High School & College",
    level: "Primary",
    status: "Completed",
  },
  {
    icon: Baby,
    title: "Early Childhood Education",
    institution: "World Sign International School",
    level: "Elementary (Pre-School)",
    status: "Completed",
  },
];

// 2) Professional learning
const professional: EducationItem[] = [
  {
    icon: Laptop,
    title: "AI-Driven Full Stack Web Engineering",
    institution: "Programming Hero",
    level: "Professional Course",
    status: "Completed",
    text: "Completed a full-stack web engineering course covering modern front-end development, back-end APIs, databases, authentication and AI-assisted development.",
    tags: ["Next.js", "Node.js", "MongoDB", "BetterAuth", "AI-Assisted Coding"],
  },
  {
    icon: Rocket,
    title: "Continuous Self-Learning",
    level: "Every week",
    status: "Ongoing",
    text: "I keep learning through documentation, new tools and hands-on projects, because the best way to learn a technology is to build something with it.",
    tags: ["Hands-on Projects", "Documentation", "New Tools"],
  },
];

// 3) Co-curricular & cultural education
const cultural: EducationItem[] = [
  {
    icon: Music,
    title: "Music & Fine Arts",
    institution: "Bulbul Academy of Fine Arts (BAFA)",
    level: "Co-Curricular",
    text: "Creative training in music and fine arts, the creative side that shapes how I think about design, rhythm and detail in everything I build.",
    tags: ["Music", "Fine Arts"],
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

// Heading used above each part of the section
function GroupHeading({
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

// One education card (used in the timeline and in the grids)
function EduCard({ item, index = 0 }: { item: EducationItem; index?: number }) {
  const ongoing = item.status === "Ongoing";

  return (
    <div
      className="glow-card loop-bob group relative h-full p-6 rounded-2xl bg-card border border-line overflow-hidden"
      style={
        {
          "--bob-delay": `${(index % 5) * 0.5}s`,
          "--bob-dur": `${6 + (index % 3) * 0.7}s`,
        } as React.CSSProperties
      }
    >
      {/* Soft glow that appears on hover */}
      <span className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Status pill + level */}
      <div className="relative flex flex-wrap items-center gap-2 mb-3">
        {item.status && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border ${
              ongoing
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-pink-500/10 border-pink-500/30 text-pink-400"
            }`}
          >
            {ongoing ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            ) : (
              <CheckCircle2 size={12} />
            )}
            {item.status}
          </span>
        )}
        {item.level && (
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-card border border-line text-slate-400">
            {item.level}
          </span>
        )}
      </div>

      <h4
        className={`relative text-lg sm:text-xl font-bold text-strong mb-1.5 leading-snug ${outfit.className}`}
      >
        {item.title}
      </h4>

      {item.institution && (
        <p className="relative flex items-start gap-2 text-sm font-medium text-pink-300 mb-3">
          <Building2 size={15} className="shrink-0 mt-0.5" />
          <span>{item.institution}</span>
        </p>
      )}

      {item.text && (
        <p className="relative text-sm text-slate-300 leading-relaxed mb-4">
          {item.text}
        </p>
      )}

      {item.tags && (
        <div className="relative flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 border border-pink-500/25 text-slate-300 hover:text-pink-400 hover:border-pink-500/50 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function Education() {
  return (
    <section
      id="education"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 space-y-20 sm:space-y-24">
        {/* ------------------------------------------------------------------
            HEADER
        ------------------------------------------------------------------ */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <GraduationCap size={16} />
              <span>Academic Journey</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              Education &amp;{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Learning
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              Where I studied, what I have completed and how I keep growing as a
              developer.
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            1. ACADEMIC TIMELINE
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <GroupHeading icon={GraduationCap} title="Academic Background" />
          </Reveal>

          <Reveal direction="up" threshold={0.03}>
            <div className="relative">
              {/* Line that draws itself from top to bottom */}
              <span className="tl-line absolute left-4.25 lg:left-1/2 lg:-ml-px top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-pink-500 via-fuchsia-500 to-transparent" />
              {/* Glowing light that keeps travelling down the line (loop) */}
              <span
                aria-hidden
                className="absolute left-4.25 lg:left-1/2 lg:-ml-px top-2 bottom-2 w-0.5"
              >
                <span className="tl-pulse" />
              </span>

              <div className="space-y-10 lg:space-y-14">
                {academic.map((item, i) => {
                  const Icon = item.icon;
                  const onLeft = i % 2 === 0;
                  return (
                    <Reveal
                      key={item.title}
                      direction={onLeft ? "left" : "right"}
                      delay={i * 100}
                    >
                      <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20">
                        {/* Timeline dot */}
                        <span className="ring-pulse absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-0 z-10 w-9 h-9 rounded-full bg-chip border-2 border-pink-500/60 flex items-center justify-center text-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.35)]">
                          <Icon size={16} />
                        </span>

                        {/* Card alternates left / right on large screens */}
                        <div
                          className={`pl-12 lg:pl-0 ${
                            onLeft ? "lg:col-start-1" : "lg:col-start-2"
                          }`}
                        >
                          <EduCard item={item} index={i} />
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------------------
            2. PROFESSIONAL LEARNING
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <GroupHeading icon={Laptop} title="Professional Learning" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {professional.map((item, i) => (
              <Reveal key={item.title} direction="up" delay={i * 130}>
                <EduCard item={item} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------
            3. CO-CURRICULAR & CULTURAL EDUCATION
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <GroupHeading
              icon={Music}
              title="Co-Curricular & Cultural Education"
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {cultural.map((item, i) => (
              <Reveal key={item.title} direction="zoom" delay={i * 130}>
                <EduCard item={item} index={i + 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
