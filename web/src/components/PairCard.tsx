"use client";

import { play, playSequence } from "@/lib/audio";
import type { Pair } from "@/lib/data";
import { usePlaying } from "./usePlaying";
import SoundBars from "./SoundBars";
import Icon from "./Icon";

// "Đặc tính âm thanh": two sounds to compare, played one by one with a clear pause.
export default function PairCard({ pair }: { pair: Pair }) {
  const current = usePlaying();

  const side = (src: string, icon: string, label: string) => {
    const on = current === src;
    return (
      <button
        type="button"
        data-kid-target
        onClick={() => play(src)}
        aria-label={`Nghe âm ${label.toLowerCase()}`}
        className={`flex min-h-32 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-4 bg-white p-2 text-[var(--g-ink)] shadow-sm active:scale-[0.98] ${
          on ? "is-playing border-[var(--g-accent)]" : "border-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" loading="lazy" draggable={false} className="size-20" />
        {on ? <SoundBars className="h-7" /> : <span className="font-display text-lg font-bold">{label}</span>}
      </button>
    );
  };

  const sameDiff = pair.dimension === "giong-khac";
  return (
    <article className="flex flex-col gap-3 rounded-card border-4 border-white bg-[var(--g-bg)] p-4 shadow-sm">
      <h3 className="text-center text-xl font-bold text-[var(--g-ink)]">{pair.title}</h3>
      <div className="flex gap-3">
        {side(pair.audioA, pair.iconA, sameDiff ? "Tiếng 1" : pair.labelA)}
        {side(pair.audioB, pair.iconB, sameDiff ? "Tiếng 2" : pair.labelB)}
      </div>
      <button
        type="button"
        data-kid-target
        onClick={() => playSequence([pair.audioA, pair.audioB])}
        className="flex min-h-16 items-center justify-center gap-2 rounded-full bg-[var(--g-ink)] px-4 font-bold text-white active:scale-[0.98]"
      >
        <Icon name="headphones" className="size-6" />
        Nghe lần lượt cả hai
      </button>
      <p className="text-center text-sm text-muted">Cô hỏi: “{pair.question}”</p>
    </article>
  );
}
