// ==========================================
// Page: My Profile  (/profile) - every logged-in person can edit their own details
// ==========================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import { UserRound } from "lucide-react";
import ProfileForm from "@/components/auth/ProfileForm";
import { getSession } from "@/lib/session";
import { getProfile } from "@/lib/profile";
import { emptyProfile } from "@/lib/chat-types";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My profile | Lamia Kajal", robots: { index: false } };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/profile");

  const profile = await getProfile(session.user.id).catch(() => emptyProfile);

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-3xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1 className={`flex items-center gap-3 text-3xl font-extrabold text-strong mb-8 ${outfit.className}`}>
          <UserRound className="text-pink-400" /> My profile
        </h1>
        <ProfileForm
          user={{
            name: session.user.name || "",
            email: session.user.email,
            image: session.user.image ?? null,
            verified: Boolean(session.user.emailVerified),
          }}
          profile={profile}
        />
      </div>
    </section>
  );
}
