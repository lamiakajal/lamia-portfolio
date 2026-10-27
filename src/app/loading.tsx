// ==========================================
// Component: Global Route Loading
// Description: Fullscreen glassmorphic loader with dual-ring neon spinner
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-page/90 backdrop-blur-xl transition-all duration-300"
    >
      <div className="relative flex flex-col items-center gap-5">
        {/* Ambient Glowing Backdrop */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full bg-linear-to-r from-pink-500/30 via-fuchsia-500/20 to-pink-400/30 blur-2xl animate-pulse"
        />

        {/* Dual-Ring Cyberpunk Spinner */}
        <div className="relative h-14 w-14">
          {/* Base Track Ring */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-pink-500/10" />

          {/* Reverse Outer Halo */}
          <div
            className="absolute -inset-1 rounded-full border border-fuchsia-500/30 animate-spin opacity-50"
            style={{ animationDuration: "3s", animationDirection: "reverse" }}
          />

          {/* Active Accent Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-transparent border-t-pink-500 border-r-fuchsia-400 animate-spin shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

          {/* Center Glowing Dot */}
          <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-pink-400 animate-ping opacity-75" />
        </div>

        {/* Text Status with Tracking */}
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.25em] uppercase text-pink-300/80">
          <span>Loading</span>
          <span className="inline-flex animate-bounce">.</span>
          <span className="inline-flex animate-bounce [animation-delay:0.15s]">
            .
          </span>
          <span className="inline-flex animate-bounce [animation-delay:0.3s]">
            .
          </span>
        </div>
      </div>
    </div>
  );
}
