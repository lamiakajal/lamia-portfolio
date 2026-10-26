// ==========================================
// PROJECTS DATA  (single place to manage all projects)
//
// HOW TO ADD A NEW PROJECT
//   1. Copy the TEMPLATE block below, paste it at the TOP of `projectsData`
//      and fill in the fields.
//   2. Put its screenshot in /public/projects/ and set  image: "/projects/my-project.png"
//      (a tall full-page screenshot is fine: it is shown inside a browser mock-up that
//      scrolls automatically). Leave  image: ""  to show generated cover art.
//   3. Set  featured: true  to show it on the home page.
//
// HOW TO REPLACE A FEATURED PROJECT WITH A BETTER ONE
//   Set  featured: false  on the old project and  featured: true  on the new one.
//   The old project is NOT deleted: it moves to the "View All Projects" page (/projects).
//   Home page shows the featured projects in the order they appear in this list.
//
// TEMPLATE (copy this):
// {
//   id: "6",                           // any unique text
//   slug: "my-project",                // used in the URL: /projects/my-project (lowercase, no spaces)
//   title: "My Project",
//   image: "/projects/my-project.png", // or "" for generated cover art
//   category: "Web Apps",              // groups the filter buttons (e.g. "Landing Pages")
//   featured: true,
//   techStack: ["Next.js", "TypeScript"],
//   shortDescription: "One or two sentences shown on the card.",
//   fullDescription: "A longer description shown on the project page.",
//   liveLink: "https://...",
//   githubLink: "https://github.com/lamiakajal/...",
//   challenges: ["Problem 1 you solved.", "Problem 2 you solved."],
//   futurePlans: ["Improvement 1.", "Improvement 2."],
// },
//
// NOTE: "challenges" and "futurePlans" below are DRAFTS written from each README's
// feature list. Please edit them so they describe what really happened.
// ==========================================
export interface Project {
  id: string;
  slug: string;
  title: string;
  /** Screenshot path inside /public (e.g. "/projects/axit.png"), or "" for generated cover art */
  image: string;
  category: string;
  /** true = shown on the home page, false = only on the /projects page */
  featured: boolean;
  techStack: string[];
  shortDescription: string;
  fullDescription: string;
  liveLink: string;
  githubLink: string;
  challenges: string[];
  futurePlans: string[];
}

export const projectsData: Project[] = [
  // ---------------------------------------------------------------- FEATURED
  {
    id: "1",
    slug: "bazar-dor",
    title: "BazarDor (বাজার দর)",
    image: "/projects/bazar-dor.webp",
    category: "Full-Stack Apps",
    featured: true,
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "BetterAuth",
      "MongoDB Atlas",
    ],
    shortDescription:
      "A localized commodity price tracker that brings daily grocery rates from Dhaka's key markets into one clear, Bengali-first interface.",
    fullDescription:
      "BazarDor makes daily grocery shopping easier by showing transparent market prices. It collects commodity rates from wholesale and retail markets such as Karwan Bazar, Sadar Bazar and Mirpur Green Market, and presents prices, price changes and trends using Bengali numerals and a Bengali calendar date. Visitors can browse categories like rice, lentils, oil, vegetables, fish and meat, sort by price, and see today's biggest risers and fallers in a live ticker. Product detail pages with a cross-market price breakdown are protected, so signing in (email/password, Google or GitHub through BetterAuth) is required, and users can update their profile.",
    liveLink: "https://bazar-dor-lamiakajal.vercel.app",
    githubLink: "https://github.com/lamiakajal/bazar-dor",
    challenges: [
      "Showing prices, units and dates in Bengali numerals everywhere in the interface.",
      "Sorting prices by their parsed numeric value instead of raw text, so the order is always correct.",
      "Protecting product pages with middleware and redirecting guests to the sign-in page.",
      "Combining email/password and Google/GitHub sign-in with BetterAuth and MongoDB.",
    ],
    futurePlans: [
      "Add price history charts for each commodity.",
      "Send price-drop alerts for favourite items.",
      "Cover more markets and cities beyond Dhaka.",
    ],
  },
  {
    id: "2",
    slug: "fit-log",
    title: "FitLog: Workout Library & Daily Lift Tracker",
    image: "/projects/fit-log.webp",
    category: "Web Apps",
    featured: true,
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React Context API",
      "LocalStorage",
    ],
    shortDescription:
      "A dark-neon fitness app to discover workouts, plan a daily lifting split and track completion without any friction.",
    fullDescription:
      "FitLog is a fitness tracking and workout management app with a bold dark neon look. Users browse a library of strength and hypertrophy exercises, filter by muscle group (chest, back, legs, shoulders, arms, core), and search instantly. They build a daily plan with a smart limit of five workouts per day to avoid overtraining, bookmark exercises for later, and see live totals for selected exercises, estimated duration and projected calories. A mark-as-completed checklist shows progress, and everything is saved in the browser with React Context and localStorage so plans survive refreshes.",
    liveLink: "https://fit-log-lamiakajal.vercel.app",
    githubLink: "https://github.com/lamiakajal/fit-log",
    challenges: [
      "Enforcing the five-workout daily limit with clear, friendly feedback.",
      "Keeping the plan and bookmarks in sync across refreshes using Context and localStorage.",
      "Calculating live totals for duration and calories as the plan changes.",
      "Building smooth scroll-entrance and glow animations with IntersectionObserver.",
    ],
    futurePlans: [
      "Add user accounts and a database so plans sync across devices.",
      "Add progress charts and personal records over time.",
      "Let users create their own custom workouts.",
    ],
  },
  {
    id: "3",
    slug: "axit-landing-page",
    title: "AXIT: Modern Responsive SaaS Landing Page",
    image: "/projects/axit-landing-page.webp",
    category: "Landing Pages",
    featured: true,
    techStack: ["Next.js", "React", "Tailwind CSS v4", "React Icons", "Vercel"],
    shortDescription:
      "A production-ready SaaS landing page with scroll animations in both directions and smooth micro-interactions, built without animation libraries.",
    fullDescription:
      "AXIT is a modern SaaS landing page built with the Next.js App Router and Tailwind CSS v4. Every entrance animation is powered by the native IntersectionObserver, so sections animate in on scroll and reset when they leave the screen, ready to play again. It uses hardware-accelerated CSS for shimmer sweeps, floating buttons and hover effects, with no third-party animation library. The page includes a sticky navbar with a mobile drawer, hero with a lead form, tabs, feature grids, pricing tiers, testimonials, a contact form, footer and a floating scroll-to-top button, and it is fully responsive from phones to ultra-wide screens.",
    liveLink: "https://axit-lamiakajal.vercel.app/",
    githubLink: "https://github.com/lamiakajal/axit-landing-page",
    challenges: [
      "Making animations replay on scroll in both directions using only native browser APIs.",
      "Keeping the layout pixel-perfect on mobile, tablet, laptop and ultra-wide screens.",
      "Keeping animations smooth without adding any animation library.",
    ],
    futurePlans: [
      "Connect the contact and lead forms to a real backend.",
      "Add dark/light theme switching.",
      "Add multi-language support.",
    ],
  },
  // ------------------------------------------------------ MORE (View All Projects)
  {
    id: "4",
    slug: "lucid-landing-page",
    title: "Lucid: High-Performance SaaS Landing Page",
    image: "/projects/lucid-landing-page.webp",
    category: "Landing Pages",
    featured: false,
    techStack: ["Next.js", "React", "Tailwind CSS", "React Icons", "Vercel"],
    shortDescription:
      "A conversion-focused SaaS landing page with a dark blue identity, GPU-accelerated floating components and touch-friendly hover effects.",
    fullDescription:
      "Lucid is a responsive SaaS landing page crafted with the Next.js App Router and Tailwind CSS. It pairs a dark base with electric-blue accents and uses GPU-accelerated animations. Its signature feature is a floating dark contact card above an embedded satellite map that pauses while the visitor types. Buttons, navigation and pricing cards share a center-outward expand effect that works for both mouse hover and mobile touch. The page is split into reusable sections (Navbar, Hero, Features, DeviceShowcase, Customization, Testimonials, CallToAction, Pricing, Contact and Footer).",
    liveLink: "https://lucid-lamiakajal.vercel.app",
    githubLink: "https://github.com/lamiakajal/lucid-landing-page",
    challenges: [
      "Animating a floating contact form smoothly with GPU transforms while pausing it during input.",
      "Making the same expand effect work for both mouse hover and mobile touch.",
    ],
    futurePlans: [
      "Connect the contact form to an email or database service.",
      "Add more pricing and feature variations.",
    ],
  },
  {
    id: "5",
    slug: "devstack",
    title: "DevStack: Build Your Ideal Dev Stack",
    image: "/projects/devstack.webp",
    category: "Web Apps",
    featured: false,
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Toastify",
      "React Icons",
    ],
    shortDescription:
      "An interactive web app to explore, compare and build your ideal development stack for modern software projects.",
    fullDescription:
      'DevStack is a curated platform where developers explore frontend, backend, database and tooling technologies side by side and assemble their own development stack. Visitors browse technology cards such as React, Vue.js, Svelte, Next.js, Node.js, PostgreSQL, Redis, TypeScript, Tailwind CSS and Docker, each with a category, difficulty level and rating, and add their favourites to a live "Your Stack" sidebar. The app blocks duplicate choices with friendly toast warnings, lets users remove a single technology or clear the whole stack, loads its technology data from a JSON file with a smooth loading state, and stays fully responsive on mobile, tablet and desktop.',
    liveLink: "https://dev-stack-peach-chi.vercel.app",
    githubLink: "https://github.com/lamiakajal/DevStack",
    challenges: [
      "Loading the technology data from a JSON file with useEffect and showing a smooth loading state.",
      "Preventing the same technology from being added twice and warning the user with toast alerts.",
      "Keeping the live stack sidebar in sync, including single-item and bulk removal.",
      "Keeping the card grid and sidebar clean and usable on mobile, tablet and desktop.",
    ],
    futurePlans: [
      "Let users save and share their stacks with an account.",
      "Add a side-by-side comparison view for selected technologies.",
      "Move the data to a database or API and add more categories.",
    ],
  },
];

/** Projects shown on the home page */
export const featuredProjects = projectsData.filter((p) => p.featured);

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
  {
    key: "facebook-page",
    label: "Facebook Page",
    href: "https://www.facebook.com/lamiakajalofficial",
  },
  // WhatsApp username link (username: lamiakajal)
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/lamiakajal" },
];

/** Quick lookup helper: getSocial("github") -> "https://github.com/lamiakajal" */
export const getSocial = (key: string): string =>
  socialLinks.find((s) => s.key === key)?.href ?? "#";

export const contactInfo = {
  email: "lamiakajal@gmail.com",
  website: "https://lamiakajal.com",
  // TODO: MOCK phone number - replace with the real one
  phone: "+880 1700-000000",
  // Used for the tel: link (digits and + only) - keep in sync with `phone`
  phoneHref: "+8801700000000",
  whatsappUsername: "lamiakajal",
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

// ==========================================
// SITE PHOTOS - to change a picture: put the new file in /public/assets/
// and change the `src` below. `position` decides which part is kept when the
// photo is cropped ("50% 30%" = centre horizontally, 30% from the top).
// ==========================================
export const siteImages = {
  hero: {
    src: "/assets/lamiakajal-hero.webp",
    alt: "Lamia Kajal",
    position: "50% 30%",
    zoom: 1.35,
  },
  about: {
    src: "/assets/lamiakajal-about.webp",
    alt: "Lamia Kajal - Full Stack Developer",
    position: "50% 68%",
  },
};
