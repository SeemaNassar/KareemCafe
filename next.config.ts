import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    qualities: [50, 75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
