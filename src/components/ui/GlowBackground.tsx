// ==========================================
// Component: GlowBackground
// Description: Background grid & animated ambient glowing orbs
// Author: Lamia Kajal (Senior Frontend Engineer)
// ==========================================

import React from "react";

export default function GlowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dot Matrix Grid Layer */}
      <div className="absolute inset-0 bg-pro-grid" />

      {/* Primary Fuchsia Glowing Orb */}
      <div className="absolute top-[-10%] left-[10%] w-125 h-125 rounded-full bg-fuchsia-600/15 blur-[140px] animate-orb-1" />

      {/* Secondary Pink Glowing Orb */}
      <div className="absolute top-[45%] right-[-5%] w-112.5 h-112.5 rounded-full bg-pink-600/15 blur-[140px] animate-orb-2" />
    </div>
  );
}
