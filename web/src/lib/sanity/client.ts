import { createClient } from "next-sanity";

const token = process.env.SANITY_API_READ_TOKEN;
const isDev = process.env.NODE_ENV !== "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: !isDev,
  // In dev, use the token to read draft content instantly
  ...(isDev && token ? { token, perspective: "drafts" as const } : {}),
});
