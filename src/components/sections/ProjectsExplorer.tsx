// ==========================================
// Component: ProjectsExplorer
// Description: All projects with category filter buttons. The grid replays its
//              staggered pop-in animation whenever the filter changes.
// ==========================================

"use client";

import React, { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/ui/ProjectCard";
import { projectsData } from "@/data/portfolioData";

const categories = [
  "All",
  ...Array.from(new Set(projectsData.map((p) => p.category))),
];

export default function ProjectsExplorer() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === active);

  return (
    <>
      {categories.length > 2 && (
        <Reveal direction="up">
          <div
            role="tablist"
            aria-label="Project categories"
            className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12"
          >
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 active:scale-95 ${
                    isActive
                      ? "spin-border bg-pink-500/15 border-pink-500/60 text-strong"
                      : "bg-card border-line text-slate-300 hover:border-pink-500/40 hover:text-pink-400"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>
      )}

      <Reveal direction="up" delay={100} threshold={0.05}>
        <div
          key={active}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {visible.map((project, i) => (
            <div
              key={project.id}
              className="skill-pop"
              style={{ "--i": i } as React.CSSProperties}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
