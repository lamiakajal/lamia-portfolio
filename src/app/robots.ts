// robots.txt: tells search engines what they may visit.
import type { MetadataRoute } from "next";
import { contactInfo } from "@/data/portfolioData";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/login"] }],
    sitemap: `${contactInfo.website}/sitemap.xml`,
    host: contactInfo.website,
  };
}
