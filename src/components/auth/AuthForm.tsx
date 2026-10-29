// ==========================================
// Component: AuthForm - sign in / sign up with email + password, GitHub or Google
// ==========================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import { Loader2, AlertCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/components/ui/ToastProvider";
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

interface AuthFormProps {
  next: string;
  /** Which social logins are set up on the server */
  providers: { github: boolean; google: boolean };
}

export default function AuthForm({ next, providers }: AuthFormProps) {
  const toast = useToast();
  const router = useRouter();
  const target = safeNext(next);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Remember that the person just logged in, so the Navbar can say "Welcome"
  const markWelcome = () => {
    try {
      sessionStorage.setItem("auth-welcome", "1");
    } catch {
      /* storage can be blocked: the login still works */
    }
  };

  const social = async (provider: "github" | "google") => {
    setError("");
    setBusy(true);
    markWelcome(); // the "Welcome" toast is shown after the page comes back from GitHub / Google
    const { error: err } = await authClient.signIn.social({ provider, callbackURL: target });
    if (err) {
      const message = err.message ?? "This login method is not set up yet.";
      setError(message);
      toast.error(message, { title: "Login failed" });
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    markWelcome();

    const result =
      mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: target })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: target });

    if (result.error) {
      const message = result.error.message ?? "Something went wrong. Please try again.";
      setError(message);
      toast.error(message, { title: mode === "signup" ? "Sign up failed" : "Sign in failed" });
      try {
        sessionStorage.removeItem("auth-welcome");
      } catch {
        /* ignore */
      }
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

      {(providers.github || providers.google) && (
        <>
          <div
            className={`grid gap-3 mb-5 ${
              providers.github && providers.google ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {providers.github && (
              <button
                type="button"
                onClick={() => social("github")}
                disabled={busy}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold text-strong hover:border-pink-500/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 transition-all"
              >
                {/* GitHub's real logo is black / white, so it follows the theme text colour */}
                <FaGithub size={19} /> GitHub
              </button>
            )}
            {providers.google && (
              <button
                type="button"
                onClick={() => social("google")}
                disabled={busy}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold text-strong hover:border-pink-500/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 transition-all"
              >
                {/* Google's original four-colour logo */}
                <FcGoogle size={20} /> Google
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-5 text-xs text-slate-500">
            <span className="h-px flex-1 bg-(--line)" /> or use email <span className="h-px flex-1 bg-(--line)" />
          </div>
        </>
      )}

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
