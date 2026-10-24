// ==========================================
// Component: ThemeToggle
// Description: Dark / Light mode switch. Dark is the default theme.
//              The choice is saved in localStorage and applied before first paint
//              by the inline script in layout.tsx (no flash of wrong theme).
// ==========================================

"use client";

import React, { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

const THEME_EVENT = "theme-change";

// Subscribe to theme changes (this tab via custom event, other tabs via storage)
function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

// Server always renders the default (dark) theme
const getServerSnapshot = (): Theme => "dark";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  const toggle = () => {
    const next: Theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage may be blocked (private mode) - the theme still changes */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
      className="group relative w-10 h-10 rounded-full flex items-center justify-center border border-pink-500/40 bg-pink-500/10 text-pink-400 hover:text-pink-300 hover:border-pink-500/70 hover:bg-pink-500/20 hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_0_18px_rgba(236,72,153,0.25)] overflow-hidden"
    >
      {/* Sun and Moon cross-fade with rotation */}
      <Sun
        size={18}
        className={`absolute transition-all duration-500 ${
          isLight
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-500 ${
          isLight
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
