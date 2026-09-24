import type { NextConfig } from "next";

// Static site (no backend): `next build` writes plain HTML/CSS/JS to /out.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
