import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/gare",
        destination: "/tenders",
        permanent: false
      },
      {
        source: "/gare/:path*",
        destination: "/tenders/:path*",
        permanent: false
      }
    ];
  },
  turbopack: {
    root
  }
};

export default nextConfig;
