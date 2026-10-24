export interface Project {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  techStack: string[];
  shortDescription: string;
  fullDescription: string;
  liveLink: string;
  githubLink: string;
  challenges: string[];
  futurePlans: string[];
}

export const projectsData: Project[] = [
  {
    id: "1",
    slug: "axit-modern-app",
    title: "AXIT Modern Enterprise App",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    category: "Web Apps",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    shortDescription:
      "High-performance landing page featuring sticky headers, responsive grid systems, and smooth animations.",
    fullDescription:
      "AXIT is a cutting-edge corporate enterprise web application engineered with Next.js App Router and Tailwind CSS. It focuses on lightning-fast load times, flawless responsive layouts, and interactive UI components.",
    liveLink: "https://vercel.com",
    githubLink: "https://github.com",
    challenges: [
      "Optimizing client-side bundle size while integrating complex scroll-spy observers.",
      "Maintaining 60fps smooth animations across mobile and tablet viewports.",
      "Configuring strict TypeScript interfaces for component props and layout structures.",
    ],
    futurePlans: [
      "Implement automated unit and integration testing with Jest and React Testing Library.",
      "Migrate global state management to Zustand for enhanced scalability.",
    ],
  },
  {
    id: "2",
    slug: "devstack-developer-hub",
    title: "DevStack Developer Hub",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "Web Apps",
    techStack: ["React", "JavaScript", "Netlify CI/CD", "Tailwind CSS"],
    shortDescription:
      "Modular component hub built with React, robust navigation controls, and Netlify CI/CD deployment.",
    fullDescription:
      "DevStack Hub is a centralized developer platform designed to showcase reusable UI components, technical snippets, and automated deployment pipelines.",
    liveLink: "https://netlify.com",
    githubLink: "https://github.com",
    challenges: [
      "Managing complex state across deeply nested component hierarchies.",
      "Configuring strict CORS policies and Netlify SPA redirect rules for smooth client routing.",
    ],
    futurePlans: [
      "Incorporate live GitHub REST API integration to fetch real-time repository statistics.",
      "Add interactive code snippet playgrounds.",
    ],
  },
  {
    id: "3",
    slug: "lucid-product-showcase",
    title: "Lucid Product Showcase",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Landing Pages",
    techStack: ["Next.js App Router", "Tailwind CSS", "TypeScript"],
    shortDescription:
      "Next.js product landing page optimized for high conversion rates and lightning-fast bundle performance.",
    fullDescription:
      "Lucid Showcase is an elite product marketing landing page engineered for high user engagement, pristine typography, and maximum SEO performance.",
    liveLink: "https://vercel.com",
    githubLink: "https://github.com",
    challenges: [
      "Achieving 100 Lighthouse performance scores by optimizing image assets and lazy-loading heavy components.",
      "Ensuring strict keyboard accessibility and ARIA compliance.",
    ],
    futurePlans: [
      "Add multi-language internationalization (i18n) support.",
      "Integrate interactive customer feedback testimonials and dynamic pricing calculators.",
    ],
  },
];

// ==========================================
// Shared site data (single source of truth)
// Used by Hero, About, Contact, Footer, etc.
// ==========================================

export interface SocialLink {
  key: string;
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/lamiakajal" },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lamiakajal",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/lamiakajal",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/lamiakajal",
  },
  { key: "x", label: "X (Twitter)", href: "https://x.com/lamiakajal" },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@lamiakajal",
  },
  {
    key: "behance",
    label: "Behance",
    href: "https://www.behance.net/lamiakajal",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    href: "https://www.pinterest.com/lamiakajal",
  },
  { key: "medium", label: "Medium", href: "https://medium.com/@lamiakajal" },
  { key: "blog", label: "Blog", href: "https://lamiakajal.blogspot.com" },
  { key: "whatsapp", label: "WhatsApp", href: "https://whatsapp.com/lamiakajal" },
];

/** Quick lookup helper: getSocial("github") -> "https://github.com/lamiakajal" */
export const getSocial = (key: string): string =>
  socialLinks.find((s) => s.key === key)?.href ?? "#";

export const contactInfo = {
  email: "lamiakajal@gmail.com",
  website: "https://lamiakajal.com",
};

/** Technologies shown in the About marquee (and reused by the Skills section later) */
export const techStack: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "MongoDB",
  "Mongoose",
  "BetterAuth",
  "Git & GitHub",
  "AI-Assisted Coding",
];
