// ==========================================
// Component: ProjectCover
// Description: Cover image for a project. Shows the real screenshot when `image`
//              is set; otherwise renders animated generated cover art (browser mock-up
//              on a gradient) so the card never looks empty.
// ==========================================

import React from "react";
import type { Project } from "@/data/portfolioData";

// Gradient presets - one is picked from the project slug so each card looks different
const gradients = [
  "from-pink-600/40 via-fuchsia-600/30 to-purple-700/40",
  "from-fuchsia-600/40 via-purple-600/30 to-indigo-700/40",
  "from-rose-500/40 via-pink-600/30 to-fuchsia-700/40",
];

const pick = (slug: string) =>
  slug.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
  gradients.length;

interface ProjectCoverProps {
  project: Pick<Project, "title" | "slug" | "image" | "techStack">;
  className?: string;
  priority?: boolean;
}

export default function ProjectCover({
  project,
  className = "",
  priority = false,
}: ProjectCoverProps) {
  // Real screenshot: shown inside a browser mock-up. A tall full-page screenshot
  // scrolls from top to bottom automatically (loop), so visitors see the whole website.
  if (project.image) {
    return (
      <div
        className={`relative overflow-hidden bg-linear-to-br ${gradients[pick(project.slug)]} ${className}`}
        role="img"
        aria-label={`${project.title} preview`}
      >
        <div className="absolute inset-0 bg-pro-grid opacity-70" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-pink-500/30 blur-3xl animate-orb-1" />
        <div className="absolute -bottom-12 -right-8 w-52 h-52 rounded-full bg-fuchsia-500/30 blur-3xl animate-orb-2" />

        <div className="absolute inset-x-[7%] top-[9%] bottom-[-4%] flex flex-col rounded-xl bg-[#0d0618] border border-white/15 shadow-2xl shadow-black/40 overflow-hidden transition-transform duration-700 group-hover:-translate-y-1.5">
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 truncate rounded-md bg-white/8 px-2 py-0.5 text-[9px] text-[#a99bc2]">
              {project.slug}.vercel.app
            </span>
          </div>
          {/* Screen area (the screenshot scrolls inside it) */}
          <div className="shot-frame relative flex-1 overflow-hidden">
            {/* Plain <img> on purpose: screenshots have unknown, often very tall, sizes */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading={priority ? "eager" : "lazy"}
              className="shot-scroll block w-full h-auto"
            />
          </div>
        </div>
      </div>
    );
  }

  // Generated cover art
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br ${gradients[pick(project.slug)]} ${className}`}
      role="img"
      aria-label={`${project.title} preview`}
    >
      {/* Grid + floating glows */}
      <div className="absolute inset-0 bg-pro-grid opacity-70" />
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-pink-500/30 blur-3xl animate-orb-1" />
      <div className="absolute -bottom-12 -right-8 w-52 h-52 rounded-full bg-fuchsia-500/30 blur-3xl animate-orb-2" />

      {/* Browser mock-up */}
      <div className="absolute inset-x-[10%] top-[14%] bottom-[-8%] rounded-xl bg-[#0d0618]/90 border border-white/15 shadow-2xl shadow-black/40 transition-transform duration-700 group-hover:-translate-y-2">
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex-1 truncate rounded-md bg-white/8 px-2 py-0.5 text-[9px] text-[#a99bc2]">
            lamiakajal.com/{project.slug}
          </span>
        </div>
        <div className="p-3 space-y-2">
          <div className="h-3 w-2/5 rounded bg-linear-to-r from-pink-400 to-fuchsia-400 animate-gradient-flow" />
          <div className="h-2 w-4/5 rounded bg-white/15" />
          <div className="h-2 w-3/5 rounded bg-white/10" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="loop-bob h-10 rounded-md bg-white/8 border border-white/10"
                style={{ "--bob-delay": `${i * 0.4}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating tech chips */}
      {project.techStack.slice(0, 2).map((tech, i) => (
        <span
          key={tech}
          className="float-y absolute z-10 px-2.5 py-1 rounded-full bg-[#0d0618]/90 border border-pink-500/40 text-[10px] font-semibold text-white shadow-lg shadow-pink-500/20"
          style={
            {
              "--float-delay": `${i * 1.3}s`,
              top: i === 0 ? "8%" : "auto",
              bottom: i === 1 ? "10%" : "auto",
              right: i === 0 ? "8%" : "auto",
              left: i === 1 ? "6%" : "auto",
            } as React.CSSProperties
          }
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
