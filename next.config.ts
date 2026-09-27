import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.IP_ADDRESS ? [process.env.IP_ADDRESS] : [],
};

export default nextConfig;
