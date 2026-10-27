// ==========================================
// Component: AuthForm - sign in / sign up with email + password, GitHub or Google
// ==========================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import { Loader2, AlertCircle } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inputClass =
  "w-full rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15";

// Only allow redirecting to pages of this website
const safeNext = (next: string) => (next.startsWith("/") && !next.startsWith("//") ? next : "/blog");

export default function AuthForm({ next }: { next: string }) {
  const router = useRouter();
  const target = safeNext(next);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const social = async (provider: "github" | "google") => {
    setError("");
    setBusy(true);
    const { error: err } = await authClient.signIn.social({ provider, callbackURL: target });
    if (err) {
      setError(err.message ?? "This login method is not set up yet.");
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const result =
      mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: target })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: target });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    router.push(target);
    router.refresh();
  };

  return (
    <div className="spin-border relative p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-2xl shadow-pink-500/10">
      <h1 className={`text-2xl font-extrabold text-strong mb-1 ${outfit.className}`}>
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        {mode === "signin" ? "Sign in to continue." : "Join to react, comment and save posts."}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => social("github")}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold text-strong hover:border-pink-500/50 active:scale-95 disabled:opacity-60 transition-all"
        >
          <FaGithub size={17} /> GitHub
        </button>
        <button
          type="button"
          onClick={() => social("google")}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold text-strong hover:border-pink-500/50 active:scale-95 disabled:opacity-60 transition-all"
        >
          <FaGoogle size={16} className="text-[#EA4335]" /> Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 text-xs text-slate-500">
        <span className="h-px flex-1 bg-(--line)" /> or use email <span className="h-px flex-1 bg-(--line)" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <input
            type="text"
            required
            minLength={2}
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (at least 8 characters)"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-shine relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all"
        >
          {busy && <Loader2 size={16} className="relative z-10 animate-spin" />}
          <span className="relative z-10">{mode === "signin" ? "Sign in" : "Create account"}</span>
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
          className="font-semibold text-pink-400 hover:text-pink-300"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
