// ==========================================
// Page: 404 (shown for any address that does not exist)
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Home, FolderKanban, BookOpen } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found | Lamia Kajal",
  robots: { index: false },
};

export default function NotFound() {
  const pill =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line bg-card text-sm font-semibold text-slate-200 hover:text-pink-400 hover:border-pink-500/50 hover:-translate-y-0.5 active:scale-95 transition-all";

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-600/15 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <p
          className={`loop-bob text-8xl sm:text-9xl font-extrabold leading-none animate-gradient-flow bg-linear-to-r from-pink-500 via-fuchsia-400 to-pink-300 bg-clip-text text-transparent ${outfit.className}`}
        >
          404
        </p>
        <h1 className={`mt-6 text-2xl sm:text-3xl font-bold text-strong ${outfit.className}`}>
          This page took a wrong turn
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          The page you are looking for does not exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Home size={16} className="relative z-10" />
            <span className="relative z-10">Back to Home</span>
          </Link>
          <Link href="/projects" className={pill}>
            <FolderKanban size={16} /> Projects
          </Link>
          <Link href="/blog" className={pill}>
            <BookOpen size={16} /> Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
