import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/sanity/imageLoader.ts",
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/case-studies/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
