import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Smaller JavaScript: only the icons that are used are bundled
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react"],
  },
  // Browsers keep project / profile pictures for a day (instead of re-checking every visit)
  async headers() {
    const cache = [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, stale-while-revalidate=604800",
      },
    ];
    return [
      { source: "/projects/:path*", headers: cache },
      { source: "/assets/:path*", headers: cache },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // 75 = normal pictures, 90 = profile photos (sharper)
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ভবিষ্যতে Google Login-এর প্রোফাইল ছবির জন্য
      },
    ],
  },
};

export default nextConfig;
