// ==========================================
// Component: AuthButton (Navbar)
// Shows "Login" when signed out, or an avatar menu when signed in
// (Write a post / Manage posts for the admin, and Sign out).
// ==========================================

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, PenSquare, LayoutList, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const userId = session?.user?.id;

  // Verify whether the authenticated user has administrative privileges
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => {
        if (!cancelled) {
          setIsAdmin(Boolean(d.isAdmin));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Handle dropdown dismiss on outside click or Escape key press
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isPending) {
    return (
      <span
        className="w-10 h-10 rounded-full bg-card border border-line animate-pulse"
        aria-hidden
      />
    );
  }

  if (!session) {
    return (
      <Link
        href="/login"
        aria-label="Login"
        className="h-10 px-3 sm:px-4 rounded-full border border-line bg-card flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-pink-400 hover:border-pink-500/50 active:scale-95 transition-all"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">Login</span>
      </Link>
    );
  }

  const initial = (session.user.name || session.user.email || "?")
    .charAt(0)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    setOpen(false);
    setIsAdmin(false);

    try {
      // Send signout request to Better Auth backend with a 1.5s timeout barrier
      await Promise.race([
        authClient.signOut(),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      // Clear all Better Auth session cookies explicitly across root and current domain
      const cookiesToClear = [
        "better-auth.session_token",
        "__Secure-better-auth.session_token",
        "better-auth.session_data",
        "__Secure-better-auth.session_data",
      ];

      cookiesToClear.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      });

      // Force a full browser navigation reload to flush all in-memory React session state
      window.location.replace("/");
    }
  };

  const item =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-pink-500/10 hover:text-pink-400 transition-colors disabled:opacity-50";

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shadow-[0_0_18px_rgba(236,72,153,0.4)] hover:scale-110 active:scale-90 transition-all"
      >
        {initial}
      </button>

      {open && (
        <div className="animate-fadeIn absolute right-0 mt-3 w-60 rounded-2xl bg-drawer border border-pink-500/30 shadow-2xl shadow-pink-500/20 overflow-hidden backdrop-blur-xl z-50">
          <div className="px-4 py-3 border-b border-line">
            <p className="text-sm font-bold text-strong truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {session.user.email}
            </p>
          </div>
          {isAdmin && (
            <>
              <Link
                href="/admin/blog/new"
                onClick={() => setOpen(false)}
                className={item}
              >
                <PenSquare size={16} /> Write a post
              </Link>
              <Link
                href="/admin/blog"
                onClick={() => setOpen(false)}
                className={item}
              >
                <LayoutList size={16} /> Manage posts
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={item}
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={16} className="animate-spin text-pink-400" />{" "}
                Signing out...
              </>
            ) : (
              <>
                <LogOut size={16} /> Sign out
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
