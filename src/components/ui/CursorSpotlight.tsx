// ==========================================
// Component: CursorSpotlight
// Description: Site-wide pink spotlight that follows the pointer, plus a small
//              ripple on every click / tap.
//              - Desktop & laptop: follows the mouse smoothly.
//              - Mobile & tablet: appears where you touch and fades out after you lift your finger.
//              Sits behind the page content (pointer-events: none).
// ==========================================

"use client";

import React, { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Target position (where the pointer is) and rendered position (smoothed)
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const render = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const show = () => {
      el.style.opacity = "1";
    };
    const hide = () => {
      el.style.opacity = "0";
    };

    // Small expanding ring at the click / tap position
    const ripple = (cx: number, cy: number) => {
      if (reduce) return;
      const r = document.createElement("span");
      r.className = "tap-ripple";
      r.style.left = `${cx}px`;
      r.style.top = `${cy}px`;
      r.addEventListener("animationend", () => r.remove());
      document.body.appendChild(r);
    };

    // Touch screens have no hover, so the light also shows while the page scrolls
    const touchScreen = window.matchMedia("(hover: none)").matches;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight * 0.45;

    const onScroll = () => {
      if (!touchScreen) return;
      tx = lastX;
      ty = lastY;
      if (el.style.opacity !== "1") {
        x = tx;
        y = ty;
      }
      show();
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 900);
      kick();
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      lastX = tx;
      lastY = ty;
      if (reduce) {
        x = tx;
        y = ty;
      }
      // First touch: jump straight to the finger instead of sliding from far away
      if (el.style.opacity !== "1") {
        x = tx;
        y = ty;
      }
      show();
      clearTimeout(hideTimer);
      kick();
    };

    const onDown = (e: PointerEvent) => {
      onMove(e);
      ripple(e.clientX, e.clientY);
    };

    // On touch screens there is no hover, so fade the glow out after the finger lifts
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 700);
    };

    const onLeaveWindow = () => hide();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="cursor-spotlight pointer-events-none fixed left-0 top-0 z-0"
    />
  );
}
