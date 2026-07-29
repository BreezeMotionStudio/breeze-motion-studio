import type { ImageLoaderProps } from "next/image";

export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Local /public assets (e.g. fallback logos) aren't full URLs and have no
  // Sanity CDN resizing available — serve them as-is, unoptimized.
  if (src.startsWith("/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", width.toString());
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", (quality ?? 80).toString());
  return url.toString();
}
