import Link from "next/link";
import MotionToggle from "@/components/MotionToggle";
import { HOME } from "@/lib/auth-paths";

// "?" bubbles around the puzzled mascot: [position, colour, float phase].
const QUESTIONS: [string, string, number][] = [
  ["-left-4 top-8 text-3xl", "#2f6fb0", 0],
  ["-right-2 -top-2 text-4xl", "#d6336c", 2],
  ["-right-8 top-20 text-2xl", "#7a4fc4", 4],
];

const BUTTON = "inline-flex min-h-16 items-center rounded-full px-8 font-display text-xl font-bold text-white shadow-lg transition-[translate,scale] duration-300 ease-bounce hover:-translate-y-1 active:scale-95";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-page px-4 text-center">
      <div className="relative animate-bounce-in">
        {/* Slow head tilt. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot/confused.webp" alt="" loading="lazy" suppressHydrationWarning className="size-52 origin-bottom animate-sway [--sway:5deg] [animation-duration:4.5s]" />
        {QUESTIONS.map(([pos, color, i]) => (
          <span
            key={pos}
            aria-hidden
            className={`pointer-events-none absolute grid size-12 animate-float place-items-center rounded-full bg-white font-display font-extrabold shadow-sm ring-2 ring-pink-soft [--float-y:-8px] [animation-duration:3.6s] ${pos}`}
            style={{ color, "--i": i } as React.CSSProperties}
          >
            ?
          </span>
        ))}
      </div>
      <h1 className="animate-rise-in text-4xl font-bold text-navy [--i:1]">Ôi, không tìm thấy trang này!</h1>
      <p className="animate-fade-up text-lg text-muted [--i:2]">Mình cùng quay lại nghe âm thanh nhé.</p>
      <div className="flex animate-fade-up flex-wrap justify-center gap-3 [--i:2]">
        <Link href={HOME} className={`shine bg-pink ${BUTTON}`}>
          Về trang chủ
        </Link>
        <Link href="/chu-de/" className={`bg-blue ${BUTTON}`}>
          Các chủ đề
        </Link>
      </div>
      <MotionToggle light />
    </main>
  );
}
