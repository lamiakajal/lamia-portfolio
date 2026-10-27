// Message shown when someone who is logged in but is not the admin opens an admin page.
import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotAdmin({ email }: { email: string }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <span className="inline-flex w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 items-center justify-center text-red-500 mb-5">
        <ShieldAlert size={26} />
      </span>
      <h1 className="text-2xl font-extrabold text-strong mb-3">Admins only</h1>
      <p className="text-sm text-slate-300 leading-relaxed mb-6">
        You are signed in as <strong className="text-strong">{email}</strong>, but this page is only for the site owner.
        If this is your account, log in with GitHub or Google so your email is verified.
      </p>
      <Link href="/blog" className="text-sm font-semibold text-pink-400 hover:text-pink-300">
        Go to the blog
      </Link>
    </div>
  );
}
