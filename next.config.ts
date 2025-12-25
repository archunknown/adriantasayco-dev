import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qmdobfdsuytakfvvarcz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // TODO: Remove after loading production data
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
