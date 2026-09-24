import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

// Both fonts ship a Vietnamese subset (Comic Neue does not). next/font
// self-hosts them at build time, so no request goes to Google at runtime.
const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], variable: "--font-baloo", display: "swap" });
const nunito = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Thế giới Âm thanh", template: "%s | Thế giới Âm thanh" },
  description:
    "Một không gian học tập và trải nghiệm âm thanh đầy màu sắc dành cho trẻ mầm non và giáo viên: nghe, nhận biết, phân biệt và chơi cùng âm thanh.",
};

export const viewport: Viewport = {
  themeColor: "#fcf8f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
