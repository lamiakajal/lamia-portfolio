// ==========================================
// Component: ProjectCard
// Description: One project card (cover, category, title, short text, tech chips,
//              "View Details" button + live / GitHub icons). Used on the home page
//              and on the /projects page.
// ==========================================

import React from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import ProjectCover from "@/components/ui/ProjectCover";
import type { Project } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article
      className="glow-card loop-bob group relative h-full flex flex-col rounded-2xl bg-card border border-line overflow-hidden"
      style={
        {
          "--bob-delay": `${index * 0.6}s`,
          "--bob-dur": "7s",
        } as React.CSSProperties
      }
    >
      {/* Project image / cover */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View details of ${project.title}`}
        className="block"
      >
        <ProjectCover
          project={project}
          size="card"
          priority={index < 3}
          className="aspect-16/10 w-full"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <span className="self-start mb-3 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 text-pink-400">
          {project.category}
        </span>

        <h3
          className={`text-lg sm:text-xl font-bold text-strong mb-2 leading-snug ${outfit.className}`}
        >
          {project.title}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-card border border-line text-slate-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-pink-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="btn-shine group/btn relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:shadow-[0_0_30px_rgba(236,72,153,0.75)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="relative z-10">View Details</span>
            <ArrowRight
              size={15}
              className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="w-10 h-10 rounded-full border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 hover:scale-110 transition-all duration-300"
            >
              <ExternalLink size={16} />
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              className="w-10 h-10 rounded-full border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 hover:scale-110 transition-all duration-300"
            >
              <SiGithub size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
