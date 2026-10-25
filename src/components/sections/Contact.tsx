// ==========================================
// Component: Contact Section
// Description: Easy ways to reach Lamia:
//              - contact cards (email, phone, WhatsApp) with one-click copy
//              - all social profiles with their original brand icons and colours
//              - a contact form that emails Lamia through /api/contact
//                (falls back to opening the visitor's email app if the email service is
//                 not configured yet)
//              Includes scroll animations, loop animations and a typewriter line.
// Theme: dark (default) and light via the CSS tokens in globals.css
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

"use client";

import React, { useState } from "react";
import { Outfit } from "next/font/google";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaBehance,
  FaPinterestP,
  FaMedium,
  FaBlogger,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Reveal from "@/components/ui/Reveal";
import Typewriter from "@/components/ui/Typewriter";
import { contactInfo, socialLinks } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ==========================================================================
   CONTENT
   ========================================================================== */

const taglines = [
  "Have a project in mind? Let's talk.",
  "I reply to every message.",
  "Let's build something great together.",
];

// Black / white logos use the theme text colour so they work in dark and light mode
const ADAPTIVE = "var(--fg-strong)";

type IconComponent = React.ComponentType<{ size?: number | string }>;

// Original brand icon + colour for each social profile (key = key in portfolioData.ts)
const socialBrand: Record<string, { icon: IconComponent; color: string }> = {
  github: { icon: FaGithub, color: ADAPTIVE },
  linkedin: { icon: FaLinkedinIn, color: "#0A66C2" },
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  "facebook-page": { icon: FaFacebookF, color: "#1877F2" },
  instagram: { icon: FaInstagram, color: "#E4405F" },
  x: { icon: FaXTwitter, color: ADAPTIVE },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  behance: { icon: FaBehance, color: "#1769FF" },
  pinterest: { icon: FaPinterestP, color: "#E60023" },
  medium: { icon: FaMedium, color: ADAPTIVE },
  blog: { icon: FaBlogger, color: "#FF5722" },
  whatsapp: { icon: FaWhatsapp, color: "#25D366" },
};

interface ContactCard {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  /** Text copied by the copy button (omit for no copy button) */
  copy?: string;
  external?: boolean;
  color: string;
}

const contactCards: ContactCard[] = [
  {
    key: "email",
    icon: Mail,
    label: "Email",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    copy: contactInfo.email,
    color: "#F472B6",
  },
  {
    key: "phone",
    icon: Phone,
    label: "Phone",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phoneHref}`,
    copy: contactInfo.phone,
    color: "#D946EF",
  },
  {
    key: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    value: `@${contactInfo.whatsappUsername}`,
    href: `https://wa.me/${contactInfo.whatsappUsername}`,
    copy: `@${contactInfo.whatsappUsername}`,
    external: true,
    color: "#25D366",
  },
];

type Status = "idle" | "sending" | "success" | "error" | "fallback";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const inputClass =
  "w-full rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15";

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const update =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // Copy text to the clipboard and show a check mark for 1.8 seconds
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      /* clipboard can be blocked; the link next to it still works */
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorText("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        setForm(emptyForm);
        return;
      }

      // Email service not configured yet: open the visitor's email app instead
      if (data.fallback) {
        const body = `${form.message}\n\n- ${form.name} (${form.email})`;
        window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
          form.subject,
        )}&body=${encodeURIComponent(body)}`;
        setStatus("fallback");
        return;
      }

      setErrorText(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setErrorText(
        "Network error. Please check your connection and try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        {/* ------------------------------------------------------------------
            HEADER
        ------------------------------------------------------------------ */}
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 shadow-lg shadow-pink-500/5 backdrop-blur-md">
              <Mail size={16} />
              <span>Get In Touch</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}
            >
              Contact{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <p className="max-w-xl min-h-6 text-sm sm:text-base text-slate-400">
              <Typewriter words={taglines} />
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Open to work &amp; collaboration
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ----------------------------------------------------------------
              LEFT: contact cards + social profiles
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-8 min-w-0">
            <div className="space-y-4">
              {contactCards.map((card, i) => {
                const Icon = card.icon;
                const copied = copiedKey === card.key;
                return (
                  <Reveal key={card.key} direction="left" delay={i * 110}>
                    <div
                      className="glow-card loop-bob group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-line"
                      style={
                        {
                          "--bob-delay": `${i * 0.6}s`,
                          "--bob-dur": "7s",
                        } as React.CSSProperties
                      }
                    >
                      <a
                        href={card.href}
                        target={card.external ? "_blank" : undefined}
                        rel={card.external ? "noopener noreferrer" : undefined}
                        className="flex flex-1 min-w-0 items-center gap-4"
                      >
                        <span
                          className="ring-pulse relative shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                          style={{
                            color: card.color,
                            background: `color-mix(in srgb, ${card.color} 14%, transparent)`,
                            borderColor: `color-mix(in srgb, ${card.color} 40%, transparent)`,
                          }}
                        >
                          <Icon size={22} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            {card.label}
                          </span>
                          <span
                            className={`block truncate text-sm sm:text-base font-bold text-strong group-hover:text-pink-400 transition-colors ${outfit.className}`}
                          >
                            {card.value}
                          </span>
                        </span>
                      </a>

                      {card.copy && (
                        <button
                          type="button"
                          onClick={() => copy(card.key, card.copy as string)}
                          aria-label={`Copy ${card.label}`}
                          className="shrink-0 w-10 h-10 rounded-full border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 active:scale-90 transition-all duration-300"
                        >
                          {copied ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Social profiles with original brand icons */}
            <Reveal direction="up" delay={100}>
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-line">
                <h3
                  className={`text-lg font-bold text-strong mb-4 ${outfit.className}`}
                >
                  Find me online
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((s, i) => {
                    const brand = socialBrand[s.key];
                    if (!brand) return null;
                    const Icon = brand.icon;
                    return (
                      <a
                        key={s.key}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="loop-bob w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-lg active:scale-90"
                        style={
                          {
                            color: brand.color,
                            background: `color-mix(in srgb, ${brand.color} 12%, transparent)`,
                            borderColor: `color-mix(in srgb, ${brand.color} 38%, transparent)`,
                            "--bob-delay": `${(i % 6) * 0.35}s`,
                            "--bob-dur": "4.8s",
                          } as React.CSSProperties
                        }
                      >
                        <Icon size={19} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ----------------------------------------------------------------
              RIGHT: contact form
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-7 min-w-0">
            <Reveal direction="right" delay={100}>
              <div className="spin-border relative p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-2xl shadow-pink-500/10">
                <h3
                  className={`text-xl sm:text-2xl font-bold text-strong mb-1 ${outfit.className}`}
                >
                  Send me a message
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Fill in the form and I will get back to you by email.
                </p>

                {status === "success" ? (
                  <div className="skill-pop flex flex-col items-center text-center py-10">
                    <span className="ring-pulse relative w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500 mb-4">
                      <CheckCircle2 size={32} />
                    </span>
                    <h4
                      className={`text-xl font-bold text-strong mb-2 ${outfit.className}`}
                    >
                      Message sent!
                    </h4>
                    <p className="text-sm text-slate-300 max-w-sm mb-6">
                      Thank you for reaching out. I will reply to your email as
                      soon as I can.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="px-5 py-2.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 transition-all"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Your name
                        </span>
                        <input
                          type="text"
                          required
                          minLength={2}
                          maxLength={100}
                          autoComplete="name"
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={update("name")}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Your email
                        </span>
                        <input
                          type="email"
                          required
                          maxLength={200}
                          autoComplete="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={update("email")}
                          className={inputClass}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subject
                      </span>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={150}
                        placeholder="What is this about?"
                        value={form.subject}
                        onChange={update("subject")}
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Message
                      </span>
                      <textarea
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={6}
                        placeholder="Tell me about your project or idea..."
                        value={form.message}
                        onChange={update("message")}
                        className={`${inputClass} resize-y min-h-32`}
                      />
                    </label>

                    {/* Honeypot: hidden from people, bots fill it in and get ignored */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      value={form.website}
                      onChange={update("website")}
                      className="absolute -left-[9999px] w-px h-px opacity-0"
                    />

                    {status === "error" && (
                      <p
                        role="alert"
                        className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500"
                      >
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        {errorText}
                      </p>
                    )}
                    {status === "fallback" && (
                      <p
                        role="status"
                        className="flex items-start gap-2 rounded-xl bg-pink-500/10 border border-pink-500/30 px-4 py-3 text-sm text-slate-300"
                      >
                        <Mail
                          size={16}
                          className="shrink-0 mt-0.5 text-pink-400"
                        />
                        Opening your email app so you can send the message. If
                        nothing opens, write to {contactInfo.email}.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-shine group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 transition-all duration-300"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2
                            size={17}
                            className="relative z-10 animate-spin"
                          />
                          <span className="relative z-10">Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Send Message</span>
                          <Send
                            size={16}
                            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                          />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
