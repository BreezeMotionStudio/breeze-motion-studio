import { client } from "./client"

const RETRY_DELAYS_MS = [200, 500]

/**
 * Wraps client.fetch with retries (with backoff) before falling back.
 * A transient Sanity CDN blip must not swap a page's rendered
 * DOM shape (real content -> empty-state fallback) mid-ISR-revalidation,
 * since that's what produces hydration-mismatch errors for other visitors.
 */
export async function fetchSafe(
  query: string,
  params: Record<string, unknown>,
  fallback: any
): Promise<any> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await client.fetch(query, params)
    } catch (err) {
      lastErr = err
      const delay = RETRY_DELAYS_MS[attempt]
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  console.error("Sanity fetch failed after retries:", query, lastErr)
  return fallback
}
