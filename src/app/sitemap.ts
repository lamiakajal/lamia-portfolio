// sitemap.xml: list of every public page (home, projects, blog posts) for Google.
import type { MetadataRoute } from "next";
import { contactInfo, projectsData } from "@/data/portfolioData";
import { isDbConfigured } from "@/lib/mongodb";
import { listPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = contactInfo.website;
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...projectsData.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Blog posts (skipped quietly if the database is not reachable)
  if (isDbConfigured) {
    try {
      const posts = await listPublishedPosts();
      pages.push(
        ...posts.map((post) => ({
          url: `${base}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      );
    } catch {
      /* the rest of the sitemap still works */
    }
  }

  return pages;
}
