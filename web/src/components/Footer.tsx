import Link from "next/link";
import Logo from "./Logo";
import MotionToggle from "./MotionToggle";

// No social-network icons: there are no official accounts yet, and the site
// keeps third-party links out of pages children use.
const LINKS = [
  { href: "/gioi-thieu/", label: "Giới thiệu" },
  { href: "/gioi-thieu/#lien-he", label: "Liên hệ" },
  { href: "/gioi-thieu/#chinh-sach", label: "Chính sách bảo mật" },
  { href: "/gioi-thieu/#ho-tro", label: "Hỗ trợ" },
];

// Soft wave, 8 humps over 1200 units: the two halves match, so sliding it by
// half its width loops seamlessly.
const WAVE = `M0 12Q37.5 2 75 12${Array.from({ length: 15 }, (_, i) => `T${150 + i * 75} 12`).join("")}V24H0Z`;

// Bubbles rising through the footer: [left %, size class, --rise-x, duration s].
const BUBBLES: [number, string, string, number][] = [
  [6, "size-3", "6px", 7],
  [24, "size-2", "-8px", 9],
  [47, "size-4", "10px", 8],
  [68, "size-2", "-6px", 10],
  [88, "size-3", "8px", 7.5],
];

function Wave({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className={`absolute bottom-0 left-0 w-[200%] ${className}`}>
      <path d={WAVE} />
    </svg>
  );
}

// home: where the logo leads ("/" on public pages, the app home inside the app).
export default function Footer({ home = "/" }: { home?: string }) {
  return (
    <footer className="relative bg-footer text-white no-print">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-5 overflow-hidden">
        <Wave className="chrome-wave chrome-wave-back h-full fill-footer/35" />
        <Wave className="chrome-wave h-4 fill-footer" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {BUBBLES.map(([left, size, dx, dur], i) => (
          <span
            key={left}
            className={`absolute bottom-2 rounded-full bg-white/15 ring-1 ring-white/25 animate-rise-fade ${size}`}
            style={{ left: `${left}%`, animationDuration: `${dur}s`, animationDelay: `${-i * 1.7}s`, "--rise-x": dx, "--rise-y": "-72px" } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 lg:flex-row lg:justify-between">
        <Link href={home} className="chrome-logo flex items-center gap-2">
          <Logo className="h-10 w-auto rounded-full bg-white/90 p-1" />
          <span className="font-display text-lg font-bold leading-tight">
            Thế giới
            <br />
            Âm thanh
          </span>
        </Link>
        <nav aria-label="Liên kết cuối trang">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="chrome-uline inline-block py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-2 lg:items-end">
          <MotionToggle />
          <p className="text-xs text-white/85">Học liệu thử nghiệm cho giáo dục mầm non</p>
        </div>
      </div>
    </footer>
  );
}
