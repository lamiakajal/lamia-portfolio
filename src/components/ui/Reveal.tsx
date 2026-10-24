// ==========================================
// Component: Reveal
// Description: Reusable scroll-animation wrapper. Animates its children in when they
//              enter the viewport and plays again every time the user scrolls back
//              (both scroll-down and scroll-up). Use it in every section.
// Usage: <Reveal direction="left" delay={150}>...</Reveal>
// ==========================================

"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "zoom";

interface RevealProps {
  children: React.ReactNode;
  /** Direction the element travels from while appearing */
  direction?: RevealDirection;
  /** Stagger delay in milliseconds */
  delay?: number;
  /** If true, the animation plays only once (does not replay on scroll back) */
  once?: boolean;
  className?: string;
  /** Intersection threshold (0 - 1) */
  threshold?: number;
}

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  once = false,
  className = "",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          // Hide again so the animation replays when the user returns
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      data-dir={direction}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
