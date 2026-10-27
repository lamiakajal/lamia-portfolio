export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-page/70 backdrop-blur-md">
      <div className="relative flex flex-col items-center gap-4">
        {/* Glowing Ambient Backdrop for Spinner */}
        <div className="absolute -inset-2 rounded-full bg-pink-500/20 blur-xl animate-pulse" />

        {/* Circular Dual-Ring Spinner */}
        <div className="relative h-14 w-14">
          {/* Base Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/30" />
          {/* Active Spinning Accent Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-pink-400 animate-spin" />
        </div>

        {/* Loading Indicator Text */}
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
