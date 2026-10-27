// ==========================================
// Root Layout with Global Navbar, Footer & SEO
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import GlowBackground from "@/components/ui/GlowBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import ScrollToTop from "@/components/ui/ScrollToTop";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Professional SEO Metadata for Search Engines & Social Sharing
export const metadata: Metadata = {
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
  openGraph: {
    title: "Lamia Kajal — Full Stack Developer",
    description:
      "Explore full-stack web applications, interactive UI work and project case studies by Lamia Kajal.",
    url: "https://lamiakajal.com",
    siteName: "Lamia Kajal Portfolio",
    type: "website",
  },
};

// Runs before first paint: applies the saved theme (default = light) to avoid a flash
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

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
        {/* If JavaScript is disabled, never block the site behind the preloader */}
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
        {/* Loading page (shown once per full page load) */}
        <Preloader />

        {/* Background Ambient Glows & Square Grid (whole website) */}
        <GlowBackground />

        {/* Site-wide mouse / touch spotlight */}
        <CursorSpotlight />

        {/* Bottom-right scroll progress / back-to-top button */}
        <ScrollToTop />

        {/* Global Sticky Navbar */}
        <Navbar />

        {/* Main Application Content with top padding for fixed navbar */}
        <main className="relative z-10 pt-20 min-h-[80vh]">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
