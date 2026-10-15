import type { NextConfig } from "next";

const backendBaseUrl = (
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },{
        protocol: "https",
        hostname:"placehold.co",
      },{
        protocol: "http",
        hostname:"localhost",
      },{
        protocol: "https",
        hostname:"*.onrender.com",
      }
    ],
  },
};

export default nextConfig;
