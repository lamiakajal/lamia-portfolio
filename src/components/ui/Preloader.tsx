// ==========================================
// Component: Preloader
// Description: Full-screen animated loading page shown when the website opens.
//              Logo with orbiting dots, letter-by-letter name, progress bar with percentage,
//              then a two-part curtain slides away to reveal the site.
//              The Hero animations are paused (html[data-preloading]) until the curtain opens,
//              so visitors always see the Hero entrance animation.
// ==========================================

"use client";

import React, { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const NAME = "Lamia Kajal";
const LOAD_MS = 2400; // how long the progress bar takes (normal motion)
const LOAD_MS_REDUCED = 600; // shorter for prefers-reduced-motion
const HOLD_MS = 350; // pause at 100% before the curtain opens
const EXIT_MS = 1100; // curtain animation length

type Phase = "loading" | "exiting" | "done";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    document.documentElement.dataset.preloading = "true";
    document.body.style.overflow = "hidden"; // lock scroll while loading

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduce ? LOAD_MS_REDUCED : LOAD_MS;

    // Wait for the real page load too (images, fonts) - but never longer than 8 seconds
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);
    const forceLoaded = setTimeout(() => (loaded = true), 8000);

    let raf = 0;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.push(
        setTimeout(() => {
          setPhase("exiting");
          // Un-pause Hero / Navbar entrance animations as the curtain opens
          document.documentElement.removeAttribute("data-preloading");
          document.body.style.overflow = "";
          timers.push(setTimeout(() => setPhase("done"), EXIT_MS));
        }, HOLD_MS),
      );
    };

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeInOutCubic: slow start, fast middle, slow finish
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      let p = Math.round(eased * 100);
      if (!loaded && p > 99) p = 99;
      setProgress(p);
      if (p >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(forceLoaded);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      className={`preloader fixed inset-0 z-100 ${exiting ? "pointer-events-none" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Curtain halves (slide away when loading is complete) */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-page transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          exiting ? "-translate-y-full" : "translate-y-0"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-page transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          exiting ? "translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Background grid + glows (same look as the website) */}
      <div
        className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-pro-grid" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-fuchsia-600/20 blur-[120px] animate-orb-1" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-600/20 blur-[120px] animate-orb-2" />
      </div>

      {/* Center content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 transition-all duration-500 ${
          exiting ? "opacity-0 scale-90 blur-sm" : "opacity-100 scale-100"
        }`}
      >
        {/* Logo with orbiting dots */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="pl-orbit absolute inset-0">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_14px_rgba(244,114,182,0.9)]" />
          </div>
          <div className="pl-orbit-reverse absolute inset-2">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.9)]" />
          </div>
          <div
            className="absolute inset-4 rounded-2xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-pink-400 opacity-80 blur-xs animate-spin"
            style={{ animationDuration: "4s" }}
          />
          <div className="absolute inset-4.5 rounded-[14px] bg-page" />
          <div className="pl-logo-pop relative z-10 w-12 h-12 rounded-xl bg-linear-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-500/30">
            <Code2 size={24} />
          </div>
        </div>

        {/* Name, letter by letter */}
        <div className="text-center">
          <h1
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${outfit.className}`}
            aria-label={NAME}
          >
            {NAME.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden
                className="pl-letter animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent"
                style={{ "--i": i } as React.CSSProperties}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>
          <p className="pl-fade mt-2 text-xs sm:text-sm tracking-[0.35em] uppercase text-slate-400">
            Full Stack Developer
          </p>
        </div>

        {/* Progress bar + percentage */}
        <div className="pl-fade w-56 sm:w-72">
          <div className="relative h-1.5 w-full rounded-full bg-pink-500/15 overflow-hidden">
            <div
              className="relative h-full rounded-full bg-linear-to-r from-pink-500 via-fuchsia-400 to-pink-300 shadow-[0_0_14px_rgba(236,72,153,0.8)]"
              style={{ width: `${progress}%` }}
            >
              <span className="pl-bar-shine absolute inset-y-0 w-1/3" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium tracking-widest text-slate-400">
            <span>LOADING</span>
            <span className="text-pink-400 tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
