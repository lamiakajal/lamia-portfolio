// Counts one view per visitor session for a blog post (invisible component).
"use client";

import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: count anyway */
    }
    fetch(`/api/posts/${postId}/view`, { method: "POST", keepalive: true }).catch(() => {});
  }, [postId]);

  return null;
}
