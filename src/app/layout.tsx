// ==========================================
// Root Layout with Global Navbar, Footer & SEO
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import GlowBackground from "@/components/ui/GlowBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import { contactInfo, socialLinks } from "@/data/portfolioData";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#05010a" },
  ],
};

// Helps Google understand who this website belongs to
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lamia Kajal",
  jobTitle: "Full Stack Developer",
  url: contactInfo.website,
  email: `mailto:${contactInfo.email}`,
  sameAs: socialLinks
    .map((s) => s.href)
    .filter((href) => href.startsWith("https://") && !href.includes("wa.me")),
};

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL("https://lamiakajal.com"),
  title: "Lamia Kajal — Full Stack Developer",
  description:
    "Portfolio of Lamia Kajal, a Full Stack Developer building modern web applications with React, Next.js, Node.js, TypeScript and MongoDB.",
  keywords: [
    "Full Stack Engineer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js",
    "Lamia Kajal",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Lamia Kajal" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Lamia Kajal — Full Stack Developer",
    description:
      "Explore full-stack web applications, interactive UI work and project case studies by Lamia Kajal.",
    url: "https://lamiakajal.com",
    siteName: "Lamia Kajal Portfolio",
    type: "website",
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}try{if(sessionStorage.getItem("pl-seen")){document.documentElement.setAttribute("data-skip-preloader","1");document.documentElement.removeAttribute("data-preloading");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-preloading="true"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".preloader{display:none!important}html[data-preloading] *{animation-play-state:running!important}.reveal{opacity:1!important;filter:none!important;transform:none!important}",
            }}
          />
        </noscript>
      </head>
      <body
        className={`${plusJakarta.className} relative min-h-screen bg-page text-slate-100 selection:bg-pink-500 selection:text-white`}
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-pink-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ToastProvider>
          <Preloader />
          <GlowBackground />
          <CursorSpotlight />
          <ScrollToTop />
          <Navbar />

          <main id="main" className="relative z-10 pt-20 min-h-[80vh]">
            {children}
          </main>

          <div className="relative z-0">
            <Footer />
          </div>
        </ToastProvider>
        {/* Visitor statistics (Vercel Analytics) */}
        <Analytics />
      </body>
    </html>
  );
}
