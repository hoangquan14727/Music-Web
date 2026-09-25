"use client";

import Link from "next/link";
import { stop } from "@/lib/audio";
import Icon from "@/components/Icon";
import MotionToggle from "@/components/MotionToggle";

// Focus layout for games: no site header, one small quiet "Thoát" for the
// teacher, progress dots, and the round below.
export default function GameShell({
  children,
  style,
  progress,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  progress?: { index: number; total: number };
}) {
  return (
    <main style={style} className="kid-zone flex min-h-dvh flex-col gap-4 overflow-x-clip overscroll-none bg-[var(--g-bg)] px-4 py-3 print:min-h-0 print:bg-white print:p-0">
      <div className="no-print flex items-center justify-between gap-4">
        <Link
          href="/on-tap/"
          onClick={() => stop()}
          className="group inline-flex min-h-11 items-center gap-1 rounded-full bg-white/80 px-4 text-sm font-semibold text-muted hover:bg-white hover:text-ink"
        >
          <Icon name="close" className="size-4 transition-transform duration-300 ease-bounce group-hover:rotate-90" /> Thoát
        </Link>
        {progress && (
          <ol className="flex animate-fade-down gap-2" aria-label={`Câu ${progress.index + 1} trên ${progress.total}`}>
            {/* Current dot grows with a bounce; a finished dot fills with a pop. */}
            {Array.from({ length: progress.total }, (_, i) => (
              <li
                key={i}
                className={`size-4 rounded-full transition-[scale] duration-300 ease-bounce ${
                  i < progress.index ? "animate-pop-in bg-[var(--g-accent)]" : i === progress.index ? "scale-150 bg-[var(--g-ink)]" : "bg-white"
                }`}
              />
            ))}
          </ol>
        )}
        {/* Effects switch on the teacher's screens (intro, result) only — not mid-game under small fingers. */}
        {progress ? <span className="w-20" /> : <MotionToggle light />}
      </div>
      {children}
    </main>
  );
}
