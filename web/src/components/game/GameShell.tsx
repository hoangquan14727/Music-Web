"use client";

import Link from "next/link";
import { stop } from "@/lib/audio";
import Icon from "@/components/Icon";

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
    <main style={style} className="kid-zone flex min-h-dvh flex-col gap-4 overscroll-none bg-[var(--g-bg)] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <Link href="/on-tap/" onClick={() => stop()} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-white/80 px-4 text-sm font-semibold text-muted">
          <Icon name="close" className="size-4" /> Thoát
        </Link>
        {progress && (
          <ol className="flex gap-2" aria-label={`Câu ${progress.index + 1} trên ${progress.total}`}>
            {Array.from({ length: progress.total }, (_, i) => (
              <li
                key={i}
                className={`size-4 rounded-full ${i < progress.index ? "bg-[var(--g-accent)]" : i === progress.index ? "bg-[var(--g-ink)]" : "bg-white"}`}
              />
            ))}
          </ol>
        )}
        <span className="w-20" />
      </div>
      {children}
    </main>
  );
}
