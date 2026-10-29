// ==========================================
// Component: Education Section
// Description: Animated education section with four parts (in this order):
//              1) Professional learning (Programming Hero course, self-learning)
//              2) Certificates (click one to open it full size)
//              3) Academic timeline (BBA, HSC, SSC, Primary, Pre-school)
//              4) Co-curricular & cultural education (Music & Fine Arts)
//              The centre line draws itself, cards slide in from alternating sides
//              and every animation replays when you scroll back (up & down).
// Theme: dark (default) and light via the CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  Award,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
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

// 2) Certificates
// HOW TO ADD A NEW CERTIFICATE (for example a programming course):
//   1. Put the picture in /public/certificates/ (a .webp or .jpg file, about 1600px wide).
//   2. Copy one block below, paste it at the TOP of the list and change the text.
//   `featured: true` adds a "Core skill" badge (used for the full-stack course).
interface Certificate {
  title: string;
  issuer: string;
  date: string;
  /** Full size picture (shown when the card is opened) */
  image: string;
  /** Small picture used on the card */
  imageSmall: string;
  featured?: boolean;
}

const certificates: Certificate[] = [
  {
    title: "Full Stack & Web Development (Course 309)",
    issuer: "Codemanbd",
    date: "2025",
    image: "/certificates/codemanbd-full-stack-web-development.webp",
    imageSmall: "/certificates/codemanbd-full-stack-web-development-sm.webp",
    featured: true,
  },
  {
    title: "WordPress & eCommerce (Course 318)",
    issuer: "Codemanbd",
    date: "2025",
    image: "/certificates/codemanbd-wordpress-ecommerce.webp",
    imageSmall: "/certificates/codemanbd-wordpress-ecommerce-sm.webp",
  },
  {
    title: "UI/UX Design (Batch SSB_599)",
    issuer: "Shikhbe Shobai",
    date: "May 2024",
    image: "/certificates/shikhbe-shobai-ui-ux-design.webp",
    imageSmall: "/certificates/shikhbe-shobai-ui-ux-design-sm.webp",
  },
  {
    title: "Graphic and UI Design (Batch SSB_551)",
    issuer: "Shikhbe Shobai",
    date: "Aug 2023",
    image: "/certificates/shikhbe-shobai-graphic-ui-design.webp",
    imageSmall: "/certificates/shikhbe-shobai-graphic-ui-design-sm.webp",
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
  // Which certificate is open in the full-size viewer (null = closed)
  const [openCert, setOpenCert] = useState<number | null>(null);

  useEffect(() => {
    if (openCert === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCert(null);
      if (e.key === "ArrowRight")
        setOpenCert((i) => (i === null ? i : (i + 1) % certificates.length));
      if (e.key === "ArrowLeft")
        setOpenCert((i) =>
          i === null ? i : (i - 1 + certificates.length) % certificates.length,
        );
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openCert]);

  const current = openCert === null ? null : certificates[openCert];

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
            1. PROFESSIONAL LEARNING
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
            2. CERTIFICATES
        ------------------------------------------------------------------ */}
        <div>
          <Reveal direction="left">
            <GroupHeading icon={Award} title="Certificates" />
          </Reveal>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {certificates.map((cert, i) => (
              <Reveal key={cert.title} direction="up" delay={i * 110}>
                <button
                  type="button"
                  onClick={() => setOpenCert(i)}
                  aria-label={`Open certificate: ${cert.title}`}
                  className="glow-card loop-bob group relative w-full h-full flex flex-col text-left rounded-2xl bg-card border border-line overflow-hidden"
                  style={
                    {
                      "--bob-delay": `${i * 0.5}s`,
                      "--bob-dur": "7s",
                    } as React.CSSProperties
                  }
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-white">
                    <Image
                      src={cert.imageSmall}
                      alt={`${cert.title} certificate`}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 22vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/35 transition-colors duration-300">
                      <ZoomIn
                        size={30}
                        className="text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                      />
                    </span>
                    {cert.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-linear-to-r from-pink-600 to-fuchsia-500 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                        Core skill
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <h4
                      className={`text-sm sm:text-base font-bold text-strong leading-snug mb-2 ${outfit.className}`}
                    >
                      {cert.title}
                    </h4>
                    <p className="mt-auto flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium text-pink-300">
                        <Building2 size={13} className="shrink-0" />
                        {cert.issuer}
                      </span>
                      <span>{cert.date}</span>
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------
            3. ACADEMIC TIMELINE
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
            4. CO-CURRICULAR & CULTURAL EDUCATION
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

      {/* Full-size certificate viewer */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="animate-fadeIn fixed inset-0 z-90 flex items-center justify-center bg-black/85 p-3 sm:p-8"
          onClick={() => setOpenCert(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.image}
              alt={`${current.title} certificate`}
              width={1600}
              height={1200}
              sizes="(max-width: 1024px) 96vw, 1024px"
              unoptimized
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl bg-white shadow-2xl"
            />
            <p className="mt-3 text-center text-sm text-white">
              <span className="font-semibold">{current.title}</span> •{" "}
              {current.issuer} • {current.date}
            </p>
            <button
              type="button"
              onClick={() => setOpenCert(null)}
              aria-label="Close"
              className="absolute -top-3 -right-1 sm:-right-3 w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
            <button
              type="button"
              onClick={() =>
                setOpenCert((i) =>
                  i === null
                    ? i
                    : (i - 1 + certificates.length) % certificates.length,
                )
              }
              aria-label="Previous certificate"
              className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() =>
                setOpenCert((i) =>
                  i === null ? i : (i + 1) % certificates.length,
                )
              }
              aria-label="Next certificate"
              className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
