import type { MetadataRoute } from "next";
import { fetchSafe } from "@/lib/sanity/fetchSafe";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

const STATIC_ROUTES = ["", "/about", "/studios", "/services", "/case-studies", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [studios, projects, caseStudies] = await Promise.all([
    fetchSafe(`*[_type == "studio" && defined(slug.current)]{"slug": slug.current}`, {}, []),
    fetchSafe(`*[_type == "project" && defined(slug.current)]{"slug": slug.current}`, {}, []),
    fetchSafe(
      `*[_type == "project" && showAsCaseStudy == true && defined(slug.current)]{"slug": slug.current}`,
      {},
      []
    ),
  ]);

  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const studioEntries = (studios as { slug: string }[]).map((s) => ({
    url: `${SITE_URL}/studios/${s.slug}`,
    lastModified: now,
  }));

  const projectEntries = (projects as { slug: string }[]).map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: now,
  }));

  const caseStudyEntries = (caseStudies as { slug: string }[]).map((c) => ({
    url: `${SITE_URL}/case-studies/${c.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...studioEntries, ...projectEntries, ...caseStudyEntries];
}
