import type { NextConfig } from "next";

const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.NEXT_PUBLIC_API_BASE_LOCAL ??
    "http://13.114.84.210:18000";

let remotePatterns: NextConfig["images"] extends { remotePatterns: infer R }
    ? R
    : never = [];

try {
  const url = new URL(apiBase);
  remotePatterns = [
    {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/**",
    },
  ];
} catch {
  remotePatterns = [];
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
