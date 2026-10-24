// ==========================================
// Component: ScrollToTop
// Description: Small animated button at the bottom-right corner. A circular ring fills
//              as you scroll down the page; clicking it scrolls smoothly back to the top.
// ==========================================

"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        setVisible(y > 320);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed right-4 sm:right-6 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 w-12 h-12 rounded-full bg-chip backdrop-blur-md border border-pink-500/30 shadow-[0_0_22px_rgba(236,72,153,0.35)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      {/* Progress ring */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 w-full h-full -rotate-90"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="rgba(236,72,153,0.18)"
          strokeWidth="3"
        />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="url(#scrollRingGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: "stroke-dashoffset 0.15s linear" }}
        />
        <defs>
          <linearGradient id="scrollRingGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>

      <ArrowUp
        size={18}
        className="text-pink-400 group-hover:text-pink-300 scroll-top-bounce"
      />
    </button>
  );
}
