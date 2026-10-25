// ==========================================
// Page: All Projects  (/projects)
// Description: Every project from src/data/portfolioData.ts with category filters.
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ArrowLeft, FolderKanban } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ProjectsExplorer from "@/components/sections/ProjectsExplorer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "All Projects | Lamia Kajal",
  description:
    "Every web project built by Lamia Kajal: full-stack apps, landing pages and more.",
};

export default function ProjectsPage() {
  return (
    <section className="relative w-full pt-6 pb-20 sm:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-40 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <Reveal direction="right">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors mb-8"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Home
          </Link>
        </Reveal>

        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 backdrop-blur-md">
              <FolderKanban size={16} />
              <span>Project Archive</span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              All{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              Everything I have built so far, from full-stack apps to polished
              landing pages.
            </p>
          </div>
        </Reveal>

        <ProjectsExplorer />
      </div>
    </section>
  );
}
