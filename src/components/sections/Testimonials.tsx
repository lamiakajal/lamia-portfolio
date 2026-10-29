// ==========================================
// Component: Testimonials / Client Reviews
// Shows real client reviews (add them in src/data/portfolioData.ts -> `testimonials`)
// plus buttons to the places where clients left their reviews (Google, Facebook, LinkedIn).
// Nothing is invented: with no reviews added yet, only the review-page buttons appear.
// ==========================================

"use client";

import React from "react";
import { Outfit } from "next/font/google";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Reveal from "@/components/ui/Reveal";
import {
  reviewPlatforms,
  testimonials,
  type ReviewSource,
} from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

type IconComponent = React.ComponentType<{ size?: number | string }>;

// Original brand icon + colour for each review platform
const brand: Record<ReviewSource, { icon: IconComponent; color: string; name: string }> = {
  google: { icon: FcGoogle, color: "#4285F4", name: "Google" },
  facebook: { icon: FaFacebook, color: "#1877F2", name: "Facebook" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2", name: "LinkedIn" },
};

export default function Testimonials() {
  const hasReviews = testimonials.length > 0;

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* Header */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <Star size={16} />
              <span>Client Reviews</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              What Clients{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              Real feedback from the people I have worked with, shared on the
              platforms where they left it.
            </p>
          </div>
        </Reveal>

        {/* Review cards (only when real reviews were added to the data file) */}
        {hasReviews && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {testimonials.map((t, i) => {
              const b = brand[t.source];
              const Icon = b.icon;
              const href =
                t.url ?? reviewPlatforms.find((p) => p.source === t.source)?.href;
              return (
                <Reveal key={`${t.name}-${i}`} direction="up" delay={(i % 3) * 120}>
                  <figure
                    className="glow-card loop-bob group relative h-full flex flex-col p-6 rounded-2xl bg-card border border-line"
                    style={
                      {
                        "--bob-delay": `${i * 0.5}s`,
                        "--bob-dur": "7s",
                      } as React.CSSProperties
                    }
                  >
                    <Quote
                      size={34}
                      className="text-pink-500/40 mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    />
                    {t.rating && (
                      <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, n) => (
                          <Star
                            key={n}
                            size={16}
                            className={n < (t.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-500/50"}
                          />
                        ))}
                      </div>
                    )}
                    <blockquote className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                      {t.text}
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3">
                      <span className="shrink-0 w-11 h-11 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white font-bold flex items-center justify-center">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-bold text-strong truncate ${outfit.className}`}>
                          {t.name}
                        </span>
                        {t.role && <span className="block text-xs text-slate-400 truncate">{t.role}</span>}
                      </span>
                      {href && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View on ${b.name}`}
                          title={`View on ${b.name}`}
                          className="shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-transform hover:scale-110"
                          style={{
                            color: b.color,
                            background: `color-mix(in srgb, ${b.color} 12%, transparent)`,
                            borderColor: `color-mix(in srgb, ${b.color} 38%, transparent)`,
                          }}
                        >
                          <Icon size={17} />
                        </a>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Where the reviews live */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {reviewPlatforms.map((p, i) => {
            const b = brand[p.source];
            const Icon = b.icon;
            return (
              <Reveal key={p.source} direction="up" delay={i * 120}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-card loop-bob group flex items-center gap-4 p-5 rounded-2xl bg-card border border-line"
                  style={
                    {
                      "--bob-delay": `${i * 0.6}s`,
                      "--bob-dur": "7s",
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      color: b.color,
                      background: `color-mix(in srgb, ${b.color} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${b.color} 38%, transparent)`,
                    }}
                  >
                    <Icon size={28} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-base font-bold text-strong ${outfit.className}`}>
                      {p.label}
                    </span>
                    <span className="block text-xs text-slate-400 leading-snug">{p.hint}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-slate-500 transition-all duration-300 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
