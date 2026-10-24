// ==========================================
// Component: Typewriter
// Description: Reusable typewriter text with a blinking cursor.
// Usage: <Typewriter words={["First line", "Second line"]} />
// ==========================================

"use client";

import React from "react";
import { useTypewriter } from "@/hooks/useTypewriter";

interface TypewriterProps {
  words: string[];
  className?: string;
}

export default function Typewriter({ words, className = "" }: TypewriterProps) {
  const text = useTypewriter(words);
  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="type-cursor" aria-hidden />
    </span>
  );
}
