// ==========================================
// Page: Home
// Description: Main landing page assembling Hero and upcoming portfolio sections
// Author: Lamia Kajal (Senior Full Stack Software Engineer)
// ==========================================

import React from "react";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05010a] text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Future sections (About, Projects, Skills, Contact) will be added here */}
    </main>
  );
}
