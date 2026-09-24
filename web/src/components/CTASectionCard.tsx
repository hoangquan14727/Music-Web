import Link from "next/link";
import Icon from "./Icon";

export type CTA = { href: string; title: string; text: string; button: string; image: string; sticker: string; bg: string; accent: string };

// Whole card is the link; the pill is a visual cue.
export default function CTASectionCard({ cta }: { cta: CTA }) {
  const { href, title, text, button, image, sticker, bg, accent } = cta;
  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-44 overflow-hidden rounded-card border-4 border-white p-4 shadow-sm transition-transform duration-300 ease-bounce hover:-translate-y-1.5 active:scale-[0.98]"
      style={{ background: bg }}
    >
      <span className="relative z-10 flex w-full flex-col gap-2">
        <span className="flex items-center gap-2 font-display text-xl font-bold leading-tight" style={{ color: accent }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/stickers/${sticker}.webp`} alt="" loading="lazy" suppressHydrationWarning className="size-9 shrink-0 transition-transform duration-500 ease-bounce group-hover:-rotate-12 group-hover:scale-110" />
          {title}
        </span>
        <span className="max-w-[58%] text-sm text-ink">{text}</span>
        <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-white shadow transition-transform duration-300 ease-bounce group-hover:scale-105" style={{ background: accent }}>
          {button} <Icon name="arrow-right" className="size-4 group-hover:animate-home-nudge" />
        </span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" loading="lazy" suppressHydrationWarning draggable={false} className="absolute bottom-0 right-0 h-[85%] max-w-[46%] origin-bottom object-contain object-bottom transition-transform duration-500 ease-bounce group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-105" />
    </Link>
  );
}
