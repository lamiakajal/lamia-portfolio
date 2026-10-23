// ==========================================
// Root Layout with Professional SEO Metadata
// ==========================================

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import GlowBackground from "@/components/ui/GlowBackground";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Professional SEO Metadata for Search Engines & Social Sharing
export const metadata: Metadata = {
  title: "Lamia Kajal — Senior Frontend Software Engineer",
  description:
    "Portfolio of Lamia Kajal, a Senior Frontend Software Engineer specializing in React, Next.js, Tailwind CSS, and scalable web applications.",
  keywords: [
    "Frontend Engineer",
    "React Developer",
    "Next.js Expert",
    "Lamia Kajal",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Lamia Kajal" }],
  openGraph: {
    title: "Lamia Kajal — Senior Frontend Software Engineer",
    description:
      "Explore enterprise-grade web applications, interactive UI components, and case studies.",
    url: "https://yourdomain.com", // Replace with your actual purchased domain
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
      >
        {/* Background Ambient Glows & Grid */}
        <GlowBackground />

        {/* Main Application Content */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
