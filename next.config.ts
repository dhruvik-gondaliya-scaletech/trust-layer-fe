import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trustlayer-uploads.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.111'],
};

export default nextConfig;
