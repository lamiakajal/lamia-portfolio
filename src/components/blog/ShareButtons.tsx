// ==========================================
// Component: ShareButtons
// Description: Share a blog post on Facebook, X, LinkedIn, WhatsApp, copy the link,
//              or use the phone's own share sheet (when the device supports it).
// ==========================================

"use client";

import React, { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useToast } from "@/components/ui/ToastProvider";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const targets = [
    { name: "Facebook", color: "#1877F2", icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", color: "var(--fg-strong)", icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: "LinkedIn", color: "#0A66C2", icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "WhatsApp", color: "#25D366", icon: FaWhatsapp, href: `https://wa.me/?text=${t}%20${u}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied. Paste it anywhere to share.", { title: "Copied" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked: the other buttons still work */
    }
  };

  // Opens the phone's own share menu (Instagram, Messenger, Telegram ...) where available
  const nativeShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        /* the person closed the share menu */
      }
    } else {
      await copyLink();
    }
  };

  const base =
    "w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-90";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-300 mr-1">
        <Share2 size={16} className="text-pink-400" />
        Share
      </span>

      {targets.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${s.name}`}
            title={`Share on ${s.name}`}
            className={base}
            style={{
              color: s.color,
              background: `color-mix(in srgb, ${s.color} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${s.color} 38%, transparent)`,
            }}
          >
            <Icon size={18} />
          </a>
        );
      })}

      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        title="Copy link"
        className={`${base} bg-card border-line text-slate-300 hover:text-pink-400 hover:border-pink-500/50`}
      >
        {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} />}
      </button>

      <button
        type="button"
        onClick={nativeShare}
        className="px-4 h-11 rounded-xl border border-pink-500/40 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 transition-all"
      >
        More...
      </button>
    </div>
  );
}
