"use client";

import { useRef, useState } from "react";
import { play, playSequence } from "@/lib/audio";
import type { Pair } from "@/lib/data";
import { ripple, usePresence } from "@/lib/motion";
import { usePlaying } from "./usePlaying";
import SoundBars from "./SoundBars";
import Icon from "./Icon";

// "Đặc tính âm thanh": two sounds to compare, played one by one with a clear pause.
export default function PairCard({ pair }: { pair: Pair }) {
  const current = usePlaying();
  // "Nghe lần lượt cả hai" in progress; the run id ignores an older, stopped run.
  const [seq, setSeq] = useState(false);
  const run = useRef(0);
  const arrow = usePresence(seq);
  const handoff = seq && current === null; // the pause between A and B

  const side = (src: string, icon: string, label: string) => {
    const on = current === src;
    return (
      <button
        type="button"
        data-kid-target
        onClick={() => play(src)}
        aria-label={`Nghe âm ${label.toLowerCase()}`}
        className={`sound-rings flex min-h-32 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-4 bg-white p-2 text-[var(--g-ink)] shadow-sm transition-transform duration-200 ease-bounce [--ring-color:var(--g-accent)] [--ring-scale:1.08] hover:-translate-y-0.5 active:scale-[0.97] ${
          on ? "is-playing border-[var(--g-accent)]" : "border-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon}
          alt=""
          loading="lazy" suppressHydrationWarning
          draggable={false}
          className={`size-20 ${on ? "animate-sway [--sway:7deg] [animation-duration:1.6s]" : ""}`}
        />
        {on ? <SoundBars className="h-7" /> : <span className="animate-pop-in font-display text-lg font-bold">{label}</span>}
      </button>
    );
  };

  const sameDiff = pair.dimension === "giong-khac";
  return (
    <article className="flex flex-col gap-3 rounded-card border-4 border-white bg-[var(--g-bg)] p-4 shadow-sm">
      <h3 className="text-center text-xl font-bold text-[var(--g-ink)]">{pair.title}</h3>
      <div className="relative flex gap-3">
        {side(pair.audioA, pair.iconA, sameDiff ? "Tiếng 1" : pair.labelA)}
        {side(pair.audioB, pair.iconB, sameDiff ? "Tiếng 2" : pair.labelB)}
        {/* Hand-off cue A → B while the sequence runs; nudges during the pause. */}
        {arrow.mounted && (
          <span
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-1/2 z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[var(--g-accent)] text-white shadow-md ${
              arrow.leaving ? "animate-pop-out" : "animate-pop-in"
            }`}
          >
            <Icon name="arrow-right" className={`size-5 ${handoff ? "animate-sounds-handoff" : ""}`} />
          </span>
        )}
      </div>
      <button
        type="button"
        data-kid-target
        onPointerDown={ripple}
        onClick={() => {
          const id = ++run.current;
          setSeq(true);
          playSequence([pair.audioA, pair.audioB]).then(() => run.current === id && setSeq(false));
        }}
        className="ripple-host flex min-h-16 items-center justify-center gap-2 rounded-full bg-[var(--g-ink)] px-4 font-bold text-white transition-transform duration-200 ease-bounce [--ripple-color:#fff] active:scale-[0.97]"
      >
        <Icon name="headphones" className={`size-6 ${seq ? "animate-hop [--hop-y:-3px]" : ""}`} />
        Nghe lần lượt cả hai
      </button>
      <p className="text-center text-sm text-muted">Cô hỏi: “{pair.question}”</p>
    </article>
  );
}
