import type { MetadataRoute } from "next";
import { getAllSeoTemplates } from "@/data/seo-templates";
import { getSiteBaseUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const templateRoutes: MetadataRoute.Sitemap = getAllSeoTemplates().map(
    (template) => ({
      url: `${baseUrl}/templates/${template.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...templateRoutes];
}
