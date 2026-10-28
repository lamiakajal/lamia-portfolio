// ==========================================
// Page: Error (shown when something crashes while a page is loading)
// ==========================================

"use client";

import React from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { RefreshCw, Home, TriangleAlert } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center text-center max-w-md">
        <span className="ring-pulse relative w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6">
          <TriangleAlert size={30} />
        </span>
        <h1 className={`text-2xl sm:text-3xl font-bold text-strong ${outfit.className}`}>
          Something went wrong
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          An unexpected error happened. You can try again, or go back to the home page.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-slate-500">Error code: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw size={16} className="relative z-10" />
            <span className="relative z-10">Try again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line bg-card text-sm font-semibold text-slate-200 hover:text-pink-400 hover:border-pink-500/50 active:scale-95 transition-all"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </section>
  );
}
