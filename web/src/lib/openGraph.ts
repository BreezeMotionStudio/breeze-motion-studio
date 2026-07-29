import type { Metadata } from "next";
import { SITE_URL } from "./siteUrl";

const SITE_NAME = "Breeze Motion Studio";

const DEFAULT_OG_IMAGE =
  "https://cdn.sanity.io/images/ce9w3sdr/production/05b32c4153168a8465c443af641d1859f9389cac-6780x2160.jpg?w=1200&h=630&fit=crop&auto=format";

type BuildMetadataArgs = {
  title: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function buildMetadata({
  title,
  description,
  path = "",
  imageUrl,
  imageAlt,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = imageUrl ? `${imageUrl}?w=1200&h=630&fit=crop&auto=format` : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt || title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
