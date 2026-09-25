import Link from "next/link";
import Icon from "@/components/Icon";

function Sticker({ name, className }: { name: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/stickers/${name}.webp`} alt="" aria-hidden loading="lazy" className={`pointer-events-none shrink-0 object-contain ${className}`} />;
}
import TopicCard from "@/components/TopicCard";
import FeaturedSoundCard from "@/components/FeaturedSoundCard";
import CTASectionCard, { type CTA } from "@/components/CTASectionCard";
import Hero from "@/components/Hero";
import { featured, groups } from "@/lib/data";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
const idx = (i: number) => ({ "--i": i }) as Vars;

// Twinkling stars and rising notes around the mascot in the slogan band.
const BAND_BITS: [string, string, string, string][] = [
  ["✦", "right-36 top-2", "#f59e0b", "animate-twinkle"],
  ["✦", "right-3 top-2", "#d6336c", "animate-twinkle [--i:2]"],
  ["✦", "bottom-3 right-32", "#7a4fc4", "animate-twinkle [--i:4]"],
  ["♪", "right-24 top-8", "#2f6fb0", "animate-rise-fade [--rise-y:-40px]"],
  ["♫", "right-6 top-12", "#d6336c", "animate-rise-fade [--i:2] [--rise-x:8px] [--rise-y:-40px]"],
];

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
    <div className="reveal mb-4 flex flex-wrap items-end justify-between gap-2">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 id={id} className="text-2xl font-bold text-navy md:text-3xl">{title}</h2>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
      </div>
      <Link href={href} className="group inline-flex min-h-11 items-center gap-1 font-bold text-blue hover:underline">
        {more} <Icon name="arrow-right" className="size-4 group-hover:animate-home-nudge" />
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
            icon={<Sticker name="soundwave" className="size-12 animate-sway [--sway:6deg]" />}
            title="Khám phá các loại âm thanh"
            subtitle="Chọn một chủ đề để bắt đầu hành trình khám phá âm thanh nhé!"
            href="/chu-de/"
            more="Xem tất cả"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {groups.map((g, i) => (
              <li key={g.slug} className="home-stagger" style={idx(i)}>
                <TopicCard group={g} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="noi-bat">
          <SectionHead
            id="noi-bat"
            icon={<Sticker name="star" className="size-11 animate-sway [--sway:10deg]" />}
            title="Âm thanh nổi bật"
            href="/chu-de/"
            more="Xem thêm"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {featured().map((f, i) => (
              <li key={f.key} className="home-stagger" style={idx(i)}>
                <FeaturedSoundCard item={f} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="Các khu vực khác" className="mx-auto max-w-7xl px-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CTAS.map((c, i) => (
            <li key={c.href} className="home-stagger home-stagger-zoom h-full" style={idx(i)}>
              <CTASectionCard cta={c} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="reveal relative flex items-center gap-4 overflow-hidden rounded-card bg-pink-soft px-5 py-4 sm:pr-40">
          <Sticker name="heart" className="size-11 animate-breathe [--breathe:1.12]" />
          <p className="font-display text-lg leading-snug text-pink-ink md:text-xl">
            Âm thanh không chỉ là tiếng động, mà còn là cầu nối giúp trẻ cảm nhận, khám phá và yêu thế giới xung quanh!
          </p>
          <Sticker name="soundwave" className="hidden size-11 animate-sway md:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot/strip.webp" alt="" aria-hidden loading="lazy" className="pointer-events-none absolute bottom-0 right-2 hidden h-full max-h-28 w-auto animate-float object-contain [--float-y:-6px] sm:block" />
          {BAND_BITS.map(([glyph, pos, color, anim]) => (
            <span key={pos} aria-hidden className={`pointer-events-none absolute hidden font-display text-lg leading-none sm:block ${pos} ${anim}`} style={{ color }}>
              {glyph}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
