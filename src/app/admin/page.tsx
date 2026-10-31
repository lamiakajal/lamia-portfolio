// ==========================================
// Page: Admin dashboard (/admin) - who joined, what is read, what needs an answer
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import {
  Eye,
  FileText,
  Heart,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  Bookmark,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import NotAdmin from "@/components/blog/NotAdmin";
import { getSession, isAdminEmail, isAdminUser } from "@/lib/session";
import { getDashboardStats } from "@/lib/stats";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard | Lamia Kajal", robots: { index: false } };

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (!isAdminUser(session.user)) {
    return (
      <NotAdmin
        email={session.user.email}
        verified={Boolean(session.user.emailVerified)}
        listed={isAdminEmail(session.user.email)}
      />
    );
  }

  let stats: Awaited<ReturnType<typeof getDashboardStats>> | null = null;
  try {
    stats = await getDashboardStats();
  } catch {
    stats = null;
  }

  const cards: { icon: LucideIcon; label: string; value: number }[] = stats
    ? [
        { icon: Users, label: "Registered people", value: stats.totalUsers },
        { icon: UserPlus, label: "New this week", value: stats.newUsers },
        { icon: Eye, label: "Blog views", value: stats.blog.views },
        { icon: FileText, label: "Published posts", value: stats.blog.published },
        { icon: Heart, label: "Reactions", value: stats.reactions },
        { icon: MessageCircle, label: "Comments", value: stats.comments },
        { icon: Bookmark, label: "Saves", value: stats.saves },
        { icon: Inbox, label: "Unread messages", value: stats.unread },
      ]
    : [];

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-5xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className={`flex items-center gap-3 text-3xl font-extrabold text-strong ${outfit.className}`}>
            <LayoutDashboard className="text-pink-400" /> Dashboard
          </h1>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/admin/blog" className="px-4 py-2 rounded-full border border-line bg-card text-slate-200 hover:text-pink-400 hover:border-pink-500/50">Manage posts</Link>
            <Link href="/admin/inbox" className="px-4 py-2 rounded-full border border-pink-500/50 bg-pink-500/10 text-strong hover:bg-pink-500/20">Inbox</Link>
          </div>
        </div>

        {!stats ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
            Could not load the numbers. Is MONGODB_URI set correctly?
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="glow-card loop-bob p-5 rounded-2xl bg-card border border-line" style={{ "--bob-delay": `${i * 0.4}s` } as React.CSSProperties}>
                    <span className="w-10 h-10 mb-3 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                      <Icon size={20} />
                    </span>
                    <p className={`text-3xl font-extrabold text-strong ${outfit.className}`}>
                      <AnimatedCounter to={c.value} />
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{c.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-card border border-line p-6">
                <h2 className={`text-lg font-bold text-strong mb-4 ${outfit.className}`}>Newest members</h2>
                {stats.recentUsers.length === 0 ? (
                  <p className="text-sm text-slate-500">Nobody has registered yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {stats.recentUsers.map((u) => (
                      <li key={u.email} className="flex items-center gap-3">
                        {u.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-strong truncate">{u.name}</span>
                          <span className="block text-xs text-slate-400 truncate">{u.email}</span>
                        </span>
                        <span className="text-xs text-slate-500">{formatDate(u.joined)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-3xl bg-card border border-line p-6">
                <h2 className={`text-lg font-bold text-strong mb-4 ${outfit.className}`}>Most read posts</h2>
                {stats.blog.top.length === 0 ? (
                  <p className="text-sm text-slate-500">No published posts yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {stats.blog.top.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <Link href={`/blog/${p.slug}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-strong hover:text-pink-400">
                          {p.title}
                        </Link>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Eye size={13} /> {p.views}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              These numbers cover registered members and blog readers. To see ALL website visitors (countries,
              devices, pages), open your Vercel dashboard and click Analytics.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
