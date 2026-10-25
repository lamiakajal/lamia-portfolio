// ==========================================
// Page: Project Details  (/projects/[slug])
// Description: Detail page for one project: main tech stack, description,
//              live link, GitHub repository link, challenges faced and future plans.
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Puzzle,
  Rocket,
  Layers,
  FolderKanban,
  Lightbulb,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import Reveal from "@/components/ui/Reveal";
import ProjectCover from "@/components/ui/ProjectCover";
import { projectsData } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Build one static page for every project in the data file
export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} | Lamia Kajal`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projectsData.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projectsData[index];
  const prev =
    projectsData[(index - 1 + projectsData.length) % projectsData.length];
  const next = projectsData[(index + 1) % projectsData.length];

  return (
    <article className="relative w-full pt-6 pb-20 sm:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-40 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* Back link */}
        <Reveal direction="right">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors mb-8"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Projects
          </Link>
        </Reveal>

        {/* Title block */}
        <Reveal direction="down">
          <header className="mb-10 sm:mb-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300">
              <FolderKanban size={15} />
              {project.category}
            </span>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight mb-4 ${outfit.className}`}
            >
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                {project.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-7">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="relative z-10">Live Project</span>
                <ExternalLink size={16} className="relative z-10" />
              </a>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-strong font-semibold text-sm hover:bg-pink-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <SiGithub size={16} className="text-pink-400" />
                GitHub Repository
              </a>
            </div>
          </header>
        </Reveal>

        {/* Cover */}
        <Reveal direction="zoom" delay={100}>
          <div className="group spin-border rounded-3xl overflow-hidden border border-line shadow-2xl shadow-pink-500/15 mb-12 sm:mb-16">
            <ProjectCover
              project={project}
              priority
              className="aspect-video w-full"
            />
          </div>
        </Reveal>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: overview, challenges, future plans */}
          <div className="lg:col-span-8 space-y-12 min-w-0">
            <Reveal direction="left">
              <section>
                <h2
                  className={`flex items-center gap-3 text-xl sm:text-2xl font-bold text-strong mb-4 ${outfit.className}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Lightbulb size={20} />
                  </span>
                  Project Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {project.fullDescription}
                </p>
              </section>
            </Reveal>

            <section>
              <Reveal direction="left">
                <h2
                  className={`flex items-center gap-3 text-xl sm:text-2xl font-bold text-strong mb-5 ${outfit.className}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Puzzle size={20} />
                  </span>
                  Challenges Faced
                </h2>
              </Reveal>
              <div className="space-y-4">
                {project.challenges.map((text, i) => (
                  <Reveal key={text} direction="left" delay={i * 110}>
                    <div
                      className="glow-card loop-bob flex gap-4 p-5 rounded-2xl bg-card border border-line"
                      style={
                        { "--bob-delay": `${i * 0.5}s` } as React.CSSProperties
                      }
                    >
                      <span className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-pink-500/30">
                        {i + 1}
                      </span>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section>
              <Reveal direction="left">
                <h2
                  className={`flex items-center gap-3 text-xl sm:text-2xl font-bold text-strong mb-5 ${outfit.className}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Rocket size={20} />
                  </span>
                  Future Plans &amp; Improvements
                </h2>
              </Reveal>
              <div className="space-y-4">
                {project.futurePlans.map((text, i) => (
                  <Reveal key={text} direction="left" delay={i * 110}>
                    <div
                      className="glow-card loop-bob flex gap-4 p-5 rounded-2xl bg-card border border-line"
                      style={
                        {
                          "--bob-delay": `${i * 0.5 + 0.3}s`,
                        } as React.CSSProperties
                      }
                    >
                      <span className="shrink-0 w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/40 text-pink-400 flex items-center justify-center">
                        <Rocket size={15} />
                      </span>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>

          {/* Right: tech stack */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 min-w-0">
            <Reveal direction="right" delay={100}>
              <div className="p-6 rounded-2xl bg-card border border-line">
                <h2
                  className={`flex items-center gap-3 text-lg font-bold text-strong mb-5 ${outfit.className}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Layers size={20} />
                  </span>
                  Main Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={tech}
                      className="loop-bob px-3.5 py-1.5 rounded-full text-sm font-medium bg-pink-500/10 border border-pink-500/30 text-slate-200 hover:text-pink-400 hover:border-pink-500/60 transition-colors duration-300"
                      style={
                        {
                          "--bob-delay": `${i * 0.35}s`,
                          "--bob-dur": "4.5s",
                        } as React.CSSProperties
                      }
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>

        {/* Previous / next project */}
        {projectsData.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-16 sm:mt-20">
            <Reveal direction="left">
              <Link
                href={`/projects/${prev.slug}`}
                className="glow-card group block p-5 rounded-2xl bg-card border border-line"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-pink-400 mb-1">
                  <ArrowLeft
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  Previous Project
                </p>
                <p
                  className={`text-base font-bold text-strong ${outfit.className}`}
                >
                  {prev.title}
                </p>
              </Link>
            </Reveal>
            <Reveal direction="right">
              <Link
                href={`/projects/${next.slug}`}
                className="glow-card group block p-5 rounded-2xl bg-card border border-line sm:text-right"
              >
                <p className="flex items-center sm:justify-end gap-2 text-xs font-semibold uppercase tracking-widest text-pink-400 mb-1">
                  Next Project
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </p>
                <p
                  className={`text-base font-bold text-strong ${outfit.className}`}
                >
                  {next.title}
                </p>
              </Link>
            </Reveal>
          </div>
        )}
      </div>
    </article>
  );
}
