// ==========================================
// Component: Projects Section (home page)
// Description: Shows the FEATURED projects (see `featured` in src/data/portfolioData.ts)
//              as animated cards, plus a "View All Projects" button that opens
//              the full /projects page. Every card links to /projects/[slug].
// Theme: dark (default) and light via the CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { FolderKanban, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/ui/ProjectCard";
import { featuredProjects, projectsData } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export default function Projects() {
  const hasMore = projectsData.length > featuredProjects.length;

  return (
    <section
      id="projects"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* Header */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <FolderKanban size={16} />
              <span>Featured Work</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              My{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              A selection of things I have designed and built. Open any project
              to see its tech stack, challenges and future plans.
            </p>
          </div>
        </Reveal>

        {/* Featured cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.id} direction="up" delay={i * 130}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>

        {/* View all */}
        {hasMore && (
          <Reveal direction="up" delay={150}>
            <div className="flex justify-center mt-12 sm:mt-14">
              <Link
                href="/projects"
                className="btn-shine group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-strong font-semibold text-sm hover:bg-pink-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="relative z-10">
                  View All Projects ({projectsData.length})
                </span>
                <ArrowRight
                  size={16}
                  className="relative z-10 text-pink-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
