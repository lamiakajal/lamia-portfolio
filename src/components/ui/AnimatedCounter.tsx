// ==========================================
// Component: AnimatedCounter
// Description: Counts from 0 to a target number when it scrolls into view
//              (replays each time it re-enters the viewport).
// ==========================================

"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  to: number;
  suffix?: string;
  duration?: number; // milliseconds
  className?: string;
}

export default function AnimatedCounter({
  to,
  suffix = "",
  duration = 1600,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const run = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setValue(Math.round(eased * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
        else {
          cancelAnimationFrame(raf);
          setValue(0);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
