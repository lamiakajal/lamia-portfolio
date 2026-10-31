// ==========================================
// Component: AuthButton (Navbar)
// Shows "Login" when signed out, or an avatar menu when signed in
// (Write a post / Manage posts for the admin, and Sign out).
// ==========================================

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  PenSquare,
  LayoutList,
  Loader2,
  Bookmark,
  Inbox,
  UserRound,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/ToastProvider";

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const userName = session?.user?.name;
  const userId = session?.user?.id;

  // Verify whether the authenticated user has administrative privileges
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean; unread?: number }) => {
        if (!cancelled) {
          setIsAdmin(Boolean(d.isAdmin));
          setUnread(d.unread ?? 0);
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

  // "Welcome" toast right after logging in, "Signed out" toast right after logging out
  useEffect(() => {
    if (isPending) return;
    try {
      if (userId && sessionStorage.getItem("auth-welcome")) {
        sessionStorage.removeItem("auth-welcome");
        toast.success(
          `Welcome${userName ? `, ${userName}` : ""}! You are now signed in.`,
          {
            title: "Signed in",
          },
        );
      } else if (!userId && sessionStorage.getItem("auth-bye")) {
        sessionStorage.removeItem("auth-bye");
        toast.info("You have been signed out. See you soon!", {
          title: "Signed out",
        });
      }
    } catch {
      /* storage can be blocked */
    }
  }, [isPending, userId, userName, toast]);

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
    setUnread(0);

    try {
      // The server ends the session and deletes the (httpOnly) login cookies
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
    // Best effort: also tell the auth client (ignored if it fails)
    await Promise.race([
      authClient.signOut().catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);

    try {
      sessionStorage.setItem("auth-bye", "1");
    } catch {
      /* storage can be blocked */
    }
    // Full reload so no old session stays in memory
    window.location.replace("/");
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
        className="relative w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shadow-[0_0_18px_rgba(236,72,153,0.4)] hover:scale-110 active:scale-90 transition-all"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          initial
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-(--bg)">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
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
          <Link href="/profile" onClick={() => setOpen(false)} className={item}>
            <UserRound size={16} /> My profile
          </Link>
          {!isAdmin && (
            <Link href="/inbox" onClick={() => setOpen(false)} className={item}>
              <MessageSquare size={16} /> My inbox
              {unread > 0 ? ` (${unread})` : ""}
            </Link>
          )}
          <Link href="/saved" onClick={() => setOpen(false)} className={item}>
            <Bookmark size={16} /> Saved posts
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={item}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
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
              <Link
                href="/admin/inbox"
                onClick={() => setOpen(false)}
                className={item}
              >
                <Inbox size={16} /> Inbox{unread > 0 ? ` (${unread})` : ""}
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
