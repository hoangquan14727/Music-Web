"use client";

import { useEffect, useRef, useState } from "react";
import { play, playSequence } from "@/lib/audio";
import type { CompareAnswer, CompareQuestion as Q, ItemResult } from "@/lib/quiz";
import { pairs, type Pair } from "@/lib/data";
import SoundBars from "@/components/SoundBars";
import Icon from "@/components/Icon";
import Burst from "@/components/Burst";
import { usePlaying } from "@/components/usePlaying";
import SoundToken from "./SoundToken";
import { Say } from "./Fx";

// Concept picture shown with the teacher's question (children cannot read).
const CONCEPT: Record<string, string> = {
  "to-nho": "/images/pairs/to.webp",
  "nhanh-cham": "/images/pairs/nhanh.webp",
  "cao-thap": "/images/pairs/cao.webp",
};

// Two sounds with a clear pause, then choose: which one is louder/faster/higher
// (tap sound 1 or sound 2), or are they the same/different.
export default function CompareQuestion({ question, onDone }: { question: Q; onDone: (r: ItemResult) => void }) {
  const pair = pairs.find((p) => p.pairId === question.pairId) as Pair;
  const srcs = question.order.map((k) => (k === "A" ? pair.audioA : pair.audioB));
  const [revealed, setRevealed] = useState(false);
  const [wrong, setWrong] = useState<CompareAnswer | null>(null);
  const [solved, setSolved] = useState(false);
  const locked = useRef(false);
  const firstPick = useRef<CompareAnswer | null>(null);
  const run = useRef(0);
  const current = usePlaying();
  const sameDiff = pair.dimension === "giong-khac";

  function playBoth() {
    const id = ++run.current;
    const timer = setTimeout(() => id === run.current && setRevealed(true), 9000);
    playSequence(srcs).then((r) => {
      if (id !== run.current || r === "stopped") return;
      clearTimeout(timer);
      setRevealed(true);
    });
  }

  useEffect(() => {
    playBoth();
    const r = run;
    return () => {
      r.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(a: CompareAnswer) {
    if (locked.current || !revealed || solved) return;
    locked.current = true;
    firstPick.current ??= a;
    if (a === question.answer) {
      run.current++;
      setSolved(true);
      setWrong(null);
      play("/audio/fx/dung.mp3");
      onDone({ correct: firstPick.current === question.answer ? 1 : 0, total: 1 });
      return;
    }
    setWrong(a);
    play("/audio/fx/thu-lai.mp3").then((r) => {
      if (r !== "stopped") playBoth();
      locked.current = false;
    });
  }

  const options: { key: CompareAnswer; img?: string; token?: number; label: string; src?: string }[] = sameDiff
    ? [
        { key: "same", img: "/images/pairs/giong.webp", label: "Giống nhau" },
        { key: "different", img: "/images/pairs/khac.webp", label: "Khác nhau" },
      ]
    : [
        { key: "first", token: 0, label: "Tiếng thứ nhất", src: srcs[0] },
        { key: "second", token: 1, label: "Tiếng thứ hai", src: srcs[1] },
      ];

  return (
    <>
      <div className="flex items-center gap-4">
        {CONCEPT[pair.dimension] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={CONCEPT[pair.dimension]} alt="" className="size-20 animate-bounce-in sm:size-24" draggable={false} />
        )}
        <p className="font-display text-2xl font-bold text-[var(--g-ink)] sm:text-3xl" aria-live="polite">
          <Say text={solved ? "Giỏi quá!" : wrong ? "Thử lại nhé!" : revealed ? pair.question : "Lắng nghe hai tiếng nhé…"} />
        </p>
      </div>

      {/* Rings (pseudo-elements) while either sound plays; the button itself stays put. */}
      <button
        type="button"
        data-kid-target
        data-testid="replay"
        onClick={playBoth}
        className={`sound-rings inline-flex min-h-16 items-center gap-2 rounded-full bg-white px-6 font-bold text-[var(--g-ink)] shadow-md ring-4 ring-[var(--g-accent)] transition-transform duration-300 ease-bounce [--ring-scale:1.1] hover:scale-105 active:scale-95 ${
          current && srcs.includes(current) ? "is-playing" : ""
        }`}
      >
        <Icon name="headphones" className="size-7" /> Nghe lại cả hai
      </button>

      <ul className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:gap-8" aria-label="Chọn câu trả lời">
        {options.map((o, i) => {
          const playingThis = !!o.src && current === o.src;
          const isAnswer = solved && o.key === question.answer;
          return (
            // Each token lights up with rings in turn while it plays; the right answer
            // wobbles, gets a check and a star burst, the other one shrinks back.
            <li key={o.key} className={`relative animate-pop-in ${isAnswer ? "z-10" : ""}`} style={{ "--i": i + 1 } as React.CSSProperties}>
              <button
                type="button"
                data-kid-target
                data-answer={o.key}
                onClick={() => choose(o.key)}
                className={`relative flex w-full flex-col items-center gap-2 rounded-card border-4 bg-white p-4 shadow-md transition duration-300 ease-bounce active:scale-95 ${
                  playingThis ? "is-playing scale-105 border-[var(--g-accent)]" : isAnswer ? "animate-jelly border-emerald-500 ring-8 ring-emerald-300" : "border-white"
                } ${wrong === o.key ? "animate-wiggle opacity-70" : ""} ${solved && !isAnswer ? "scale-95 opacity-50" : ""} ${revealed ? "hover:-translate-y-1" : "pointer-events-none"}`}
              >
                {o.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.img} alt="" className="aspect-square w-full max-w-48 object-contain" draggable={false} />
                ) : (
                  <SoundToken index={o.token ?? 0} playing={playingThis} icon={false} className="aspect-square w-full max-w-44 [--ring-scale:1.2]" />
                )}
                {playingThis ? (
                  <SoundBars className="h-7 text-[var(--g-ink)]" />
                ) : (
                  <span className="font-display text-xl font-bold text-[var(--g-ink)]">{o.label}</span>
                )}
                {isAnswer && (
                  <span aria-hidden className="game-stamp absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                    <Icon name="check" className="size-6" />
                  </span>
                )}
              </button>
              <Burst trigger={isAnswer} variant="stars" count={16} spread={160} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
