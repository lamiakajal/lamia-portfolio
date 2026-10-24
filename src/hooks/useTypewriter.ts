// ==========================================
// Hook: useTypewriter
// Description: Types a word, pauses, deletes it, then moves to the next word.
//              Respects prefers-reduced-motion (shows the first word instantly).
// ==========================================

"use client";

import { useEffect, useState } from "react";

export function useTypewriter(
  words: string[],
  typeMs = 55,
  deleteMs = 30,
  pauseMs = 1700,
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      // Wrapped inside a setTimeout to avoid the ESLint "set-state-in-effect" error
      const t = setTimeout(() => setText(words[0]), 0);
      return () => clearTimeout(t);
    }

    const full = words[index];
    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === full) delay = pauseMs;

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(
          deleting
            ? full.slice(0, text.length - 1)
            : full.slice(0, text.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeMs, deleteMs, pauseMs]);

  return text;
}
