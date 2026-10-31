// ==========================================
// Component: Testimonials / Client Reviews
// Two looping designs (switch with the tabs):
//   1) "Carousel": a 3D cover-flow. The middle review is big, the others tilt away on both sides.
//      It turns by itself, endlessly, and also by arrows, dots, swipe, keyboard or by clicking a side card.
//   2) "Wall": vertical columns of reviews that scroll up and down forever (opposite directions).
// Long reviews are shortened with a "Read more" button that opens the full text.
// Reviews live in src/data/portfolioData.ts -> `testimonials` (newest at the top).
// All the CSS for this section is inside this file (see the <style> block at the bottom).
// ==========================================

"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Outfit } from "next/font/google";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Columns3,
  GalleryHorizontal,
  Pause,
  Play,
  Quote,
  Star,
  X,
} from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Reveal from "@/components/ui/Reveal";
import {
  reviewPlatforms,
  testimonials,
  type ReviewSource,
  type Testimonial,
} from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

type IconComponent = React.ComponentType<{ size?: number | string }>;

// Original brand icon + colour for each review platform
const brand: Record<
  ReviewSource,
  { icon: IconComponent; color: string; name: string; kind: string }
> = {
  google: {
    icon: FcGoogle,
    color: "#4285F4",
    name: "Google",
    kind: "Google review",
  },
  facebook: {
    icon: FaFacebook,
    color: "#1877F2",
    name: "Facebook",
    kind: "Facebook review",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    name: "LinkedIn",
    kind: "LinkedIn recommendation",
  },
};

// Reviews longer than this get a "Read more" button
const LONG_REVIEW = 210;

/* ================================ small pieces ================================ */

// Round picture of the person (or a pink circle with the first letter)
function Avatar({ t, size = 48 }: { t: Testimonial; size?: number }) {
  return t.image ? (
    <span
      className="relative shrink-0 rounded-full p-0.5 bg-linear-to-br from-pink-500 to-fuchsia-500"
      style={{ width: size, height: size }}
    >
      <Image
        src={t.image}
        alt={t.name}
        width={size}
        height={size}
        className="w-full h-full rounded-full object-cover bg-card"
      />
    </span>
  ) : (
    <span
      className="shrink-0 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white font-bold flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {t.name.charAt(0).toUpperCase()}
    </span>
  );
}

function SourceBadge({ source }: { source: ReviewSource }) {
  const b = brand[source];
  const Icon = b.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
      style={{
        color: b.color,
        background: `color-mix(in srgb, ${b.color} 10%, transparent)`,
        borderColor: `color-mix(in srgb, ${b.color} 35%, transparent)`,
      }}
    >
      <Icon size={12} />
      {b.kind}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, n) => (
        <Star
          key={n}
          size={16}
          className={
            n < rating ? "fill-amber-400 text-amber-400" : "text-slate-500/50"
          }
        />
      ))}
    </div>
  );
}

// One review card. `clamp` = how many lines of text are shown before "Read more"
function ReviewCard({
  t,
  onOpen,
  clamp = "line-clamp-6",
  className = "",
}: {
  t: Testimonial;
  onOpen: (t: Testimonial) => void;
  clamp?: string;
  className?: string;
}) {
  const href =
    t.url ?? reviewPlatforms.find((p) => p.source === t.source)?.href;
  const b = brand[t.source];
  const Icon = b.icon;
  const long = t.text.length > LONG_REVIEW;

  return (
    <figure
      className={`group relative flex flex-col p-6 rounded-3xl bg-card border border-line overflow-hidden ${className}`}
    >
      <span className="absolute -top-14 -right-14 w-40 h-40 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />

      <div className="relative flex items-start justify-between gap-3 mb-3">
        <Quote
          size={34}
          className="text-pink-500/45 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
        />
        <SourceBadge source={t.source} />
      </div>

      {t.rating && (
        <div className="relative mb-3">
          <Stars rating={t.rating} />
        </div>
      )}

      <blockquote
        className={`relative text-sm leading-relaxed text-slate-300 whitespace-pre-line ${clamp}`}
      >
        {t.text}
      </blockquote>

      {long && (
        <button
          type="button"
          onClick={() => onOpen(t)}
          className="relative mt-2 self-start text-sm font-semibold text-pink-400 hover:text-pink-300 underline-offset-4 hover:underline"
        >
          Read more
        </button>
      )}

      <figcaption className="relative mt-auto pt-5 flex items-center gap-3">
        <Avatar t={t} />
        <span className="min-w-0 flex-1">
          <span
            className={`block text-sm font-bold text-strong truncate ${outfit.className}`}
          >
            {t.name}
          </span>
          {(t.role || t.date) && (
            <span className="block text-xs text-slate-400 truncate">
              {[t.role, t.date].filter(Boolean).join(" • ")}
            </span>
          )}
        </span>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View on ${b.name}`}
            title={`View on ${b.name}`}
            className="shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-transform hover:scale-110"
            style={{
              color: b.color,
              background: `color-mix(in srgb, ${b.color} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${b.color} 38%, transparent)`,
            }}
          >
            <Icon size={17} />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

// Full review in a pop-up
function ReviewModal({ t, onClose }: { t: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Review by ${t.name}`}
      className="animate-fadeIn fixed inset-0 z-90 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-drawer border border-pink-500/30 p-6 sm:p-8 shadow-2xl shadow-pink-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:scale-110 active:scale-90 transition-all"
        >
          <X size={18} />
        </button>
        <div className="mb-4 pr-10">
          <SourceBadge source={t.source} />
        </div>
        {t.rating && (
          <div className="mb-4">
            <Stars rating={t.rating} />
          </div>
        )}
        <p className="text-base leading-relaxed text-slate-200 whitespace-pre-line">
          {t.text}
        </p>
        <div className="mt-6 pt-5 border-t border-line flex items-center gap-3">
          <Avatar t={t} size={52} />
          <div className="min-w-0">
            <p className={`font-bold text-strong ${outfit.className}`}>
              {t.name}
            </p>
            {(t.role || t.date) && (
              <p className="text-xs text-slate-400">
                {[t.role, t.date].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== 1) 3D CAROUSEL ============================== */
function Coverflow({
  items,
  onOpen,
  holdAutoplay,
}: {
  items: Testimonial[];
  onOpen: (t: Testimonial) => void;
  holdAutoplay: boolean;
}) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false); // finger or mouse button is down (or was just used on touch)
  const startX = useRef<number | null>(null);
  const heldTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const go = (step: number) => setActive((a) => (a + step + n) % n);

  // Turns by itself every few seconds, unless the visitor is interacting
  useEffect(() => {
    if (paused || hover || held || holdAutoplay || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4800);
    return () => clearInterval(id);
  }, [paused, hover, held, holdAutoplay, n]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    clearTimeout(heldTimer.current);
    setHeld(true);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null) {
      const dx = e.clientX - startX.current;
      if (dx > 55) go(-1);
      else if (dx < -55) go(1);
    }
    startX.current = null;
    // touch: keep it still for 6 seconds, mouse: hover already pauses it
    heldTimer.current = setTimeout(
      () => setHeld(false),
      e.pointerType === "mouse" ? 0 : 6000,
    );
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Client reviews"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* the stage */}
      <div
        className="cflow relative mx-auto h-107.5 overflow-hidden touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
          setHeld(false);
        }}
      >
        {items.map((t, i) => {
          // distance from the middle card, wrapped so the carousel is endless
          let o = i - active;
          if (o > n / 2) o -= n;
          if (o < -n / 2) o += n;
          const abs = Math.abs(o);
          const shown = abs <= 2;
          const place = shown ? o : Math.sign(o) * 3; // far cards wait quietly off-stage
          return (
            <div
              key={`${t.name}-${i}`}
              className="cflow-item"
              aria-hidden={abs !== 0}
              onClick={() => abs !== 0 && shown && setActive(i)}
              style={
                {
                  "--o": place,
                  "--abs": Math.abs(place),
                  zIndex: 10 - Math.abs(place),
                  opacity: !shown ? 0 : abs === 0 ? 1 : abs === 1 ? 0.78 : 0.4,
                  pointerEvents: shown ? "auto" : "none",
                  cursor: abs !== 0 && shown ? "pointer" : "default",
                } as React.CSSProperties
              }
            >
              <ReviewCard
                t={t}
                onOpen={onOpen}
                clamp="line-clamp-6 sm:line-clamp-7"
                className={`h-full ${
                  abs === 0
                    ? "shadow-[0_25px_70px_-20px_rgba(236,72,153,0.55)] border-pink-500/50"
                    : "shadow-xl shadow-black/10"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous review"
        className="absolute left-1 sm:left-4 top-[42%] z-20 w-11 h-11 rounded-full border border-line bg-drawer/90 backdrop-blur-md flex items-center justify-center text-slate-200 hover:text-pink-400 hover:border-pink-500/50 hover:scale-110 active:scale-90 transition-all"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next review"
        className="absolute right-1 sm:right-4 top-[42%] z-20 w-11 h-11 rounded-full border border-line bg-drawer/90 backdrop-blur-md flex items-center justify-center text-slate-200 hover:text-pink-400 hover:border-pink-500/50 hover:scale-110 active:scale-90 transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* dots + play / pause */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Choose a review"
        >
          {items.map((t, i) => (
            <button
              key={`${t.name}-dot-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show review ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-8 bg-linear-to-r from-pink-500 to-fuchsia-500"
                  : "w-2.5 bg-pink-500/25 hover:bg-pink-500/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play carousel" : "Pause carousel"}
          className="w-9 h-9 rounded-full border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 active:scale-90 transition-all"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  );
}

/* =========================== 2) VERTICAL WALL (marquee) =========================== */

// How many columns fit: 1 (phone), 2 (tablet), 3 (laptop and up)
function subscribeColumns(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}
const getColumns = () =>
  window.matchMedia("(min-width: 1024px)").matches
    ? 3
    : window.matchMedia("(min-width: 768px)").matches
      ? 2
      : 1;

function Wall({
  items,
  onOpen,
}: {
  items: Testimonial[];
  onOpen: (t: Testimonial) => void;
}) {
  const count = useSyncExternalStore(subscribeColumns, getColumns, () => 3);
  const columns = Array.from({ length: count }, (_, c) =>
    items.filter((_, i) => i % count === c),
  );

  return (
    <div
      className="twall grid gap-5 sm:gap-6 h-640px overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {columns.map((col, c) => (
        <div key={c} className="twall-col min-w-0">
          <div
            className="twall-track"
            data-reverse={c % 2 === 1}
            style={
              {
                "--tdur": `${Math.max(45, col.length * 20)}s`,
              } as React.CSSProperties
            }
          >
            {/* the list is shown twice so the loop has no gap */}
            {[0, 1].map((copy) =>
              col.map((t, i) => (
                <div
                  key={`${copy}-${t.name}-${i}`}
                  aria-hidden={copy === 1}
                  className="mb-5 sm:mb-6"
                >
                  <ReviewCard
                    t={t}
                    onOpen={onOpen}
                    clamp="line-clamp-5"
                    className="w-full"
                  />
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==================================== section ==================================== */
export default function Testimonials() {
  const [view, setView] = useState<"flow" | "wall">("flow");
  const [open, setOpen] = useState<Testimonial | null>(null);

  const total = testimonials.length;
  const small = total > 0 && total <= 3;
  const sources = Array.from(
    new Set(testimonials.map((t) => brand[t.source].name)),
  );

  const tab = (active: boolean) =>
    `inline-flex items-center gap-2 px-5 h-10 rounded-full text-sm font-semibold border transition-all duration-300 active:scale-95 ${
      active
        ? "spin-border bg-pink-500/15 border-pink-500/60 text-strong"
        : "bg-card border-line text-slate-300 hover:text-pink-400 hover:border-pink-500/40"
    }`;

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* Header */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <Star size={16} />
              <span>Client Reviews</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              What Clients{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              {total > 0
                ? `${total} real reviews and recommendations from ${sources.join(", ").replace(/, ([^,]*)$/, " and $1")}, shown exactly as the people wrote them.`
                : "Real feedback from the people I have worked with, shared on the platforms where they left it."}
            </p>
          </div>
        </Reveal>

        {/* View switch (only when there are enough reviews for a carousel) */}
        {total > 3 && (
          <Reveal direction="up">
            <div
              className="flex justify-center gap-3 mb-8"
              role="tablist"
              aria-label="Choose how to view reviews"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === "flow"}
                onClick={() => setView("flow")}
                className={tab(view === "flow")}
              >
                <GalleryHorizontal size={16} /> Carousel
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "wall"}
                onClick={() => setView("wall")}
                className={tab(view === "wall")}
              >
                <Columns3 size={16} /> Wall
              </button>
            </div>
          </Reveal>
        )}
      </div>

      {/* Reviews */}
      {small && (
        <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} direction="up" delay={i * 120}>
              <ReviewCard t={t} onOpen={setOpen} className="h-full" />
            </Reveal>
          ))}
        </div>
      )}

      {total > 3 && view === "flow" && (
        <Reveal direction="up">
          <div className="relative z-10 mb-14">
            <Coverflow
              items={testimonials}
              onOpen={setOpen}
              holdAutoplay={open !== null}
            />
          </div>
        </Reveal>
      )}

      {total > 3 && view === "wall" && (
        <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 mb-14">
          <Wall items={testimonials} onOpen={setOpen} />
        </div>
      )}

      {/* Where the reviews live */}
      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {reviewPlatforms.map((p, i) => {
          const b = brand[p.source];
          const Icon = b.icon;
          return (
            <Reveal key={p.source} direction="up" delay={i * 120}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-card loop-bob group flex items-center gap-4 p-5 rounded-2xl bg-card border border-line"
                style={
                  {
                    "--bob-delay": `${i * 0.6}s`,
                    "--bob-dur": "7s",
                  } as React.CSSProperties
                }
              >
                <span
                  className="shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                  style={{
                    color: b.color,
                    background: `color-mix(in srgb, ${b.color} 12%, transparent)`,
                    borderColor: `color-mix(in srgb, ${b.color} 38%, transparent)`,
                  }}
                >
                  <Icon size={28} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-base font-bold text-strong ${outfit.className}`}
                  >
                    {p.label}
                  </span>
                  <span className="block text-xs text-slate-400 leading-snug">
                    {p.hint}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-slate-500 transition-all duration-300 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Reveal>
          );
        })}
      </div>

      {open && <ReviewModal t={open} onClose={() => setOpen(null)} />}

      {/* CSS for this section (kept here so the section works on its own) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ---- 3D carousel ---- */
        .cflow {
          --card-w: min(86vw, 380px);
          --shift: 0.66;
          --rot: 28deg;
          --depth: 120px;
          perspective: 1500px;
        }
        @media (max-width: 640px) {
          .cflow { --shift: 0.97; --rot: 20deg; --depth: 90px; }
        }
        .cflow-item {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--card-w);
          height: 395px;
          transform-style: preserve-3d;
          transform:
            translate(-50%, -50%)
            translateX(calc(var(--card-w) * var(--shift) * var(--o)))
            translateZ(calc(var(--depth) * var(--abs) * -1))
            rotateY(calc(var(--rot) * var(--o) * -1))
            scale(calc(1 - 0.09 * var(--abs)));
          transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease;
          will-change: transform, opacity;
        }

        /* ---- vertical wall ---- */
        .twall {
          mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
        }
        .twall-track {
          animation: twallScroll var(--tdur, 60s) linear infinite;
          will-change: transform;
        }
        .twall-track[data-reverse="true"] { animation-direction: reverse; }
        .twall-col:hover .twall-track { animation-play-state: paused; }
        /* the list is in the track twice: moving by exactly half = seamless loop */
        @keyframes twallScroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `,
        }}
      />
    </section>
  );
}
