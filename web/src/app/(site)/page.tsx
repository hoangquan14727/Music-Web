import Link from "next/link";
import Icon from "@/components/Icon";

function Sticker({ name, className }: { name: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/stickers/${name}.webp`} alt="" loading="lazy" className={`shrink-0 object-contain ${className}`} />;
}
import TopicCard from "@/components/TopicCard";
import FeaturedSoundCard from "@/components/FeaturedSoundCard";
import CTASectionCard, { type CTA } from "@/components/CTASectionCard";
import Hero from "@/components/Hero";
import { featured, groups } from "@/lib/data";

const CTAS: CTA[] = [
  {
    href: "/on-tap/",
    title: "Trò chơi & Ôn tập",
    text: "Nghe âm thanh – Chọn hình đúng – Rèn luyện kỹ năng!",
    button: "Vào chơi ngay",
    image: "/images/cta/tro-choi.webp",
    sticker: "gamepad",
    bg: "#ffecf2",
    accent: "#d6336c",
  },
  {
    href: "/thu-vien-nhac/",
    title: "Thư viện nhạc",
    text: "Nhạc thư giãn, nhạc kể chuyện, nhạc thiếu nhi,...",
    button: "Khám phá ngay",
    image: "/images/cta/thu-vien-nhac.webp",
    sticker: "music",
    bg: "#e6f4ff",
    accent: "#2f6fb0",
  },
  {
    href: "/goc-giao-vien/",
    title: "Góc giáo viên",
    text: "Tài liệu, hướng dẫn, gợi ý phương pháp giảng dạy",
    button: "Tìm hiểu thêm",
    image: "/images/cta/goc-giao-vien.webp",
    sticker: "teacher",
    bg: "#f4edfd",
    accent: "#7a4fc4",
  },
  {
    href: "/goc-sinh-vien/",
    title: "Góc sinh viên",
    text: "Giáo án mẫu, tài liệu thực hành",
    button: "Xem tài liệu",
    image: "/images/cta/goc-sinh-vien.webp",
    sticker: "student",
    bg: "#e5f8f2",
    accent: "#2e7d6b",
  },
];

function SectionHead({ id, icon, title, subtitle, href, more }: { id: string; icon: React.ReactNode; title: string; subtitle?: string; href: string; more: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 id={id} className="text-2xl font-bold text-navy md:text-3xl">{title}</h2>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
      </div>
      <Link href={href} className="inline-flex min-h-11 items-center gap-1 font-bold text-blue hover:underline">
        {more} <Icon name="arrow-right" className="size-4" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="kid-zone mx-auto max-w-7xl space-y-12 px-4 py-10">
        <section aria-labelledby="kham-pha">
          <SectionHead
            id="kham-pha"
            icon={<Sticker name="soundwave" className="size-12" />}
            title="Khám phá các loại âm thanh"
            subtitle="Chọn một chủ đề để bắt đầu hành trình khám phá âm thanh nhé!"
            href="/chu-de/"
            more="Xem tất cả"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {groups.map((g) => (
              <li key={g.slug}>
                <TopicCard group={g} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="noi-bat">
          <SectionHead
            id="noi-bat"
            icon={<Sticker name="star" className="size-11" />}
            title="Âm thanh nổi bật"
            href="/chu-de/"
            more="Xem thêm"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {featured().map((f) => (
              <li key={f.key}>
                <FeaturedSoundCard item={f} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="Các khu vực khác" className="mx-auto max-w-7xl px-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CTAS.map((c) => (
            <li key={c.href} className="h-full">
              <CTASectionCard cta={c} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative flex items-center gap-4 overflow-hidden rounded-card bg-pink-soft px-5 py-4 sm:pr-40">
          <Sticker name="heart" className="size-11" />
          <p className="font-display text-lg leading-snug text-pink-ink md:text-xl">
            Âm thanh không chỉ là tiếng động, mà còn là cầu nối giúp trẻ cảm nhận, khám phá và yêu thế giới xung quanh!
          </p>
          <Sticker name="soundwave" className="hidden size-11 md:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot/strip.webp" alt="" loading="lazy" className="absolute bottom-0 right-2 hidden h-full max-h-28 w-auto object-contain sm:block" />
        </div>
      </section>
    </>
  );
}
