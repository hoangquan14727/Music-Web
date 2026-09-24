import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Ôn tập" };

const GAMES = [
  { slug: "nghe-chon-hinh", title: "Nghe – chọn hình", text: "Nghe một âm thanh, chạm vào hình đúng.", bg: "#ffecf2", ink: "#b8285a" },
  { slug: "noi-am-thanh-hinh-anh", title: "Nối âm thanh – hình ảnh", text: "Chạm chiếc loa để nghe, rồi chạm hình để ghép đôi.", bg: "#e6f4ff", ink: "#2f6fb0" },
  { slug: "doan-am-thanh", title: "Đoán âm thanh", text: "2, 3 hoặc 4 hình — tuỳ độ tuổi của lớp.", bg: "#f4edfd", ink: "#7a4fc4" },
  { slug: "phan-biet-am-thanh", title: "Phân biệt âm thanh", text: "Nghe hai tiếng: to hay nhỏ, nhanh hay chậm, cao hay thấp?", bg: "#fbf7d2", ink: "#9a5b12" },
  { slug: "on-tap-nhanh", title: "Ôn tập nhanh", text: "Một bài ngắn trộn nhiều dạng câu.", bg: "#e5f8f2", ink: "#23685a" },
];

export default function ReviewPage() {
  return (
    <div className="kid-zone mx-auto max-w-7xl px-4 py-8">
      <h1 className="animate-rise-in text-3xl font-bold text-navy md:text-4xl">Trò chơi &amp; Ôn tập</h1>
      <p className="mb-6 mt-1 max-w-2xl text-muted">
        Mỗi lượt chơi ngắn (khoảng 3–7 phút). Cô bấm “Bắt đầu”, trẻ nghe trước rồi mới chọn. Sau lượt chơi, chuyển sang hoạt động thật với lớp.
      </p>
      <ul className="grid gap-4 [--stagger:40ms] sm:grid-cols-2 lg:grid-cols-3">
        {/* Cards rise in one by one; hover tilts the art, press squishes the card. */}
        {GAMES.map((g, i) => (
          <li key={g.slug} className="animate-rise-in" style={{ "--i": i } as React.CSSProperties}>
            <Link
              href={`/on-tap/${g.slug}/`}
              data-kid-target
              className="group flex h-full min-h-36 items-center gap-4 rounded-card border-4 border-white p-4 shadow-sm transition-transform duration-300 ease-bounce hover:-translate-y-1 active:scale-x-[1.02] active:scale-y-[0.95] active:duration-100"
              style={{ background: g.bg }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/games/${g.slug}.webp`} alt="" loading="lazy" suppressHydrationWarning draggable={false} className="size-28 shrink-0 transition-transform duration-500 ease-bounce group-hover:-rotate-6 group-hover:scale-110" />
              <span className="flex flex-col gap-1">
                <span className="font-display text-2xl font-bold leading-tight" style={{ color: g.ink }}>
                  {g.title}
                </span>
                <span className="text-ink">{g.text}</span>
                <span className="mt-1 inline-flex items-center gap-1 font-bold" style={{ color: g.ink }}>
                  Chơi ngay <Icon name="arrow-right" className="size-4 transition-transform duration-300 ease-bounce group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
