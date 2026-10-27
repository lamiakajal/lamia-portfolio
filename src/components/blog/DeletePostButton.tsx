// ==========================================
// Component: DeletePostButton - asks "Are you sure?" and deletes a post (admin list)
// ==========================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      window.alert("Could not delete the post. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label={`Delete ${title}`}
      className="w-9 h-9 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 active:scale-90 disabled:opacity-60 transition-all"
    >
      {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
