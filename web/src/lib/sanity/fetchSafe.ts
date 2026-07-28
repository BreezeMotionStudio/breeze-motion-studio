import { client } from "./client"

/**
 * Wraps client.fetch with one immediate retry before falling back.
 * A single transient Sanity CDN blip must not swap a page's rendered
 * DOM shape (real content -> empty-state fallback) mid-ISR-revalidation,
 * since that's what produces hydration-mismatch errors for other visitors.
 */
export async function fetchSafe(
  query: string,
  params: Record<string, unknown>,
  fallback: any
): Promise<any> {
  try {
    return await client.fetch(query, params)
  } catch {
    try {
      return await client.fetch(query, params)
    } catch (err) {
      console.error("Sanity fetch failed after retry:", query, err)
      return fallback
    }
  }
}
