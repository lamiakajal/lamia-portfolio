// ==========================================
// Component: ToastProvider
// Description: Animated toast notifications for the whole site (success, error, info, warning).
//   - slide-in with a soft bounce, drawn check / cross / info icons, countdown bar
//   - hover pauses the timer, click X to close, max 4 at once, works on mobile
// Usage in any client component:
//     const toast = useToast();
//     toast.success("Post published!", { title: "Done" });
//     toast.error("Something went wrong");
// ==========================================

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  /** How long it stays, in milliseconds (default 4500) */
  duration?: number;
}

interface ToastItemData {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  duration: number;
}

interface ToastApi {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const MAX_TOASTS = 4;

const look: Record<ToastType, { color: string; title: string }> = {
  success: { color: "#10B981", title: "Success" },
  error: { color: "#EF4444", title: "Something went wrong" },
  info: { color: "#EC4899", title: "Notice" },
  warning: { color: "#F59E0B", title: "Heads up" },
};

// Icons that draw themselves (see .toast-draw in globals.css)
function ToastIcon({ type }: { type: ToastType }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "success")
    return (
      <svg {...common}>
        <path className="toast-draw" d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    );
  if (type === "error")
    return (
      <svg {...common}>
        <path className="toast-draw" d="M6 6l12 12" />
        <path className="toast-draw toast-draw-2" d="M18 6L6 18" />
      </svg>
    );
  if (type === "warning")
    return (
      <svg {...common}>
        <path className="toast-draw" d="M12 7v6" />
        <path className="toast-draw toast-draw-2" d="M12 17h.01" />
      </svg>
    );
  return (
    <svg {...common}>
      <path className="toast-draw" d="M12 11v6" />
      <path className="toast-draw toast-draw-2" d="M12 7h.01" />
    </svg>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastItemData;
  onClose: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);
  const { color } = look[toast.type];

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onClose(toast.id), 380);
  }, [onClose, toast.id]);

  // Auto close timer. Pausing keeps the time that is left.
  useEffect(() => {
    if (paused || leaving) return;
    startedAt.current = Date.now();
    const timer = setTimeout(close, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, leaving, close]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`${leaving ? "toast-out" : "toast-in"} pointer-events-auto relative overflow-hidden rounded-2xl border bg-drawer backdrop-blur-xl shadow-2xl`}
      style={{
        borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
        boxShadow: `0 18px 45px -18px color-mix(in srgb, ${color} 60%, transparent)`,
      }}
    >
      {/* soft coloured glow in the corner */}
      <span
        aria-hidden
        className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: color }}
      />
      <div className="relative flex items-start gap-3 p-4 pr-10">
        <span
          className="ring-pulse relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 16%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
          }}
        >
          <ToastIcon type={toast.type} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-strong leading-tight">{toast.title}</p>
          <p className="mt-0.5 text-sm text-slate-300 leading-snug wrap-break-word">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close notification"
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-strong hover:bg-pink-500/10 transition-colors"
        >
          <X size={15} />
        </button>
      </div>
      {/* countdown bar */}
      <span
        aria-hidden
        className="toast-bar absolute left-0 bottom-0 h-1 w-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 40%, #d946ef))`,
          animationDuration: `${toast.duration}ms`,
          animationPlayState: paused || leaving ? "paused" : "running",
        }}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const api = useMemo<ToastApi>(() => {
    const push = (type: ToastType, message: string, options?: ToastOptions) => {
      const item: ToastItemData = {
        id: nextId.current++,
        type,
        title: options?.title ?? look[type].title,
        message,
        duration: options?.duration ?? (type === "error" ? 6000 : 4500),
      };
      setToasts((list) => [...list, item].slice(-MAX_TOASTS));
    };
    return {
      success: (m, o) => push("success", m, o),
      error: (m, o) => push("error", m, o),
      info: (m, o) => push("info", m, o),
      warning: (m, o) => push("warning", m, o),
      dismiss,
    };
  }, [dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed z-9990 top-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 flex flex-col gap-3"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
