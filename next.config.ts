import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  allowedDevOrigins: [process.env.IP_ADDRESS],
}
export default nextConfig;
