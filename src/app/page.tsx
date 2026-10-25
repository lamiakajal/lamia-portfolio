// ==========================================
// Page: Home
// Description: Main landing page assembling Hero and upcoming portfolio sections
// Author: Lamia Kajal (Full Stack Developer)
// ==========================================

import React from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Qualification";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <Hero />
      <About />

      {/* Skills Section */}
      <Skills />

      {/* Education Section */}
      <Education />

      {/* Future sections (Projects, Contact) will be added here */}
    </div>
  );
}
