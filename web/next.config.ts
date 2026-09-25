import type { NextConfig } from "next";

// Login (lib/auth) needs both public Supabase values, inlined at build time.
// Missing on Vercel = failed build (the live site stays on the last good deploy).
const missing = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"].filter((k) => !process.env[k]);
if (missing.length) {
  const msg = `Thiếu biến môi trường ${missing.join(", ")}: đăng nhập sẽ không hoạt động.`;
  if (process.env.VERCEL) throw new Error(msg);
  console.warn(`⚠ ${msg}`);
}

// Static site (no backend): `next build` writes plain HTML/CSS/JS to /out.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
