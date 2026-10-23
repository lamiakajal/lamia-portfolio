// ==========================================
// Root Layout with Global Navbar, Footer & SEO
// Author: Lamia Kajal (Senior Full Stack Software Engineer)
// ==========================================

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import GlowBackground from "@/components/ui/GlowBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Professional SEO Metadata for Search Engines & Social Sharing
export const metadata: Metadata = {
  title: "Lamia Kajal — Senior Full Stack Software Engineer",
  description:
    "Portfolio of Lamia Kajal, a Senior Full Stack Software Engineer specializing in React, Next.js, Node.js, TypeScript, and scalable web applications.",
  keywords: [
    "Full Stack Engineer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Expert",
    "Node.js",
    "Lamia Kajal",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Lamia Kajal" }],
  openGraph: {
    title: "Lamia Kajal — Senior Full Stack Software Engineer",
    description:
      "Explore enterprise-grade full-stack web applications, interactive UI components, and case studies.",
    url: "https://yourdomain.com",
    siteName: "Lamia Kajal Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.className} relative min-h-screen bg-[#05010a] text-slate-100 selection:bg-pink-500 selection:text-white`}
        suppressHydrationWarning
      >
        {/* Background Ambient Glows & Grid */}
        <GlowBackground />

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
