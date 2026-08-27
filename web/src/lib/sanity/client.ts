import { createClient } from "next-sanity";

const token = process.env.SANITY_API_READ_TOKEN;
const isDev = process.env.NODE_ENV !== "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  // CDN reads add an extra caching layer on top of this site's own revalidate=60
  // window, which made recent content edits unpredictably slow to appear live.
  // This site's traffic doesn't need Sanity's CDN for performance, so read
  // straight from the API and let Next's own revalidation be the only cache.
  useCdn: false,
  // In dev, use the token to read draft content instantly
  ...(isDev && token ? { token, perspective: "drafts" as const } : {}),
});
