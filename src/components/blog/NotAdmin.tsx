// ==========================================
// Component: NotAdmin
// Shown when someone who is logged in opens an admin page but is not the admin.
// It explains WHY and lets the person sign out to try another account.
// ==========================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";

interface NotAdminProps {
  email: string;
  /** Is this account's email verified? */
  verified: boolean;
  /** Is this email in the ADMIN_EMAILS list? */
  listed: boolean;
}

export default function NotAdmin({ email, verified, listed }: NotAdminProps) {
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
      sessionStorage.setItem("auth-bye", "1");
    } catch {
      /* continue to the login page anyway */
    }
    window.location.replace("/login?next=/admin/blog");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <span className="inline-flex w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 items-center justify-center text-red-500 mb-5">
        <ShieldAlert size={26} />
      </span>
      <h1 className="text-2xl font-extrabold text-strong mb-3">Admins only</h1>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        You are signed in as <strong className="text-strong">{email}</strong>, but this page is only for the site owner.
      </p>

      <ul className="text-left text-sm text-slate-300 rounded-2xl bg-card border border-line p-4 space-y-2 mb-6">
        <li>
          {listed ? "OK" : "No"}: this email {listed ? "is" : "is NOT"} in the admin list (<code>ADMIN_EMAILS</code>).
        </li>
        <li>
          {verified ? "OK" : "No"}: this email {verified ? "is" : "is NOT"} verified.
        </li>
        {listed && !verified && (
          <li className="text-pink-400">
            Fix: sign out, then log in with <strong>GitHub or Google</strong> (not email + password). If you created an
            email + password account with this address earlier, delete that user in the database first.
          </li>
        )}
        {!listed && (
          <li className="text-pink-400">Fix: log in with the admin email, or add this email to ADMIN_EMAILS.</li>
        )}
      </ul>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={signOut}
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 disabled:opacity-60 transition-all"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
          Sign out and try another account
        </button>
        <Link href="/blog" className="text-sm font-semibold text-pink-400 hover:text-pink-300">
          Go to the blog
        </Link>
      </div>
    </div>
  );
}
