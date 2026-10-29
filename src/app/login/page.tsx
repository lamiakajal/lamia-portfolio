// ==========================================
// Page: Login / Sign up  (/login)
// Optional: /login?next=/admin/blog sends the person there after logging in.
// ==========================================

import React from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login | Lamia Kajal",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <section className="relative w-full pt-10 pb-24 overflow-hidden">
      <div className="absolute top-10 left-0 -translate-x-1/2 w-80 h-80 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="w-full max-w-md mx-auto px-4 xs:px-5 relative z-10">
        <AuthForm
          next={next ?? "/blog"}
          providers={{
            github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
            google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
          }}
        />
      </div>
    </section>
  );
}
