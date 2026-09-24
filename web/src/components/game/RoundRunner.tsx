"use client";

import Link from "next/link";
import { startTransition, useEffect, useState, ViewTransition } from "react";
import { preload, stop, unlock } from "@/lib/audio";
import { tally, type ItemResult } from "@/lib/quiz";
import Icon from "@/components/Icon";
import GameShell from "./GameShell";
import { ConfettiRain, ResultStars, ScoreBadge } from "./Fx";

export type RenderItem<T> = (item: T, onDone: (r: ItemResult) => void) => React.ReactNode;

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
// Notes drifting up around the intro art: [left, top, glyph, colour, --rise-x].
const NOTES: [string, string, string, string, string][] = [
  ["-8%", "30%", "♪", "#d6336c", "-14px"],
  ["96%", "18%", "♫", "#2f6fb0", "12px"],
  ["88%", "62%", "♪", "#7a4fc4", "16px"],
];

// Runs one round: intro → items one by one → results.
// Items report { correct, total } (first-try answers); the teacher moves on
// with "Câu tiếp theo" so there is time to ask "Vì sao con chọn hình này?".
export default function RoundRunner<T>({
  title,
  art,
  description,
  style,
  build,
  srcsOf,
  render,
  followUp,
  resultText = (c, t) => `Con đã nhận biết ${c}/${t} âm thanh!`,
  renderStart,
}: {
  title: string;
  art: string;
  description: React.ReactNode;
  style: React.CSSProperties;
  build: (option?: number) => T[];
  srcsOf: (item: T) => string[];
  render: RenderItem<T>;
  followUp: string;
  resultText?: (correct: number, total: number) => string;
  renderStart?: (start: (option?: number) => void) => React.ReactNode;
}) {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [items, setItems] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const [option, setOption] = useState<number | undefined>(undefined);

  useEffect(() => () => stop(), []);

  // Must be called from a tap: unlock() lets later questions autoplay on iOS.
  function start(opt?: number) {
    unlock();
    const o = opt ?? option;
    const round = build(o);
    preload(round.flatMap(srcsOf).concat(["/audio/fx/dung.mp3", "/audio/fx/thu-lai.mp3"]));
    // Transition: the intro fades out, the first question slides in.
    startTransition(() => {
      setOption(o);
      setItems(round);
      setResults([]);
      setIndex(0);
      setDone(false);
      setRunId((n) => n + 1);
      setPhase("play");
    });
  }

  function onDone(r: ItemResult) {
    setResults((rs) => {
      const next = rs.slice();
      next[index] = r;
      return next;
    });
    setDone(true);
  }

  // Transitions: the old question slides out left, the next one slides in.
  function next() {
    if (index + 1 >= items.length) {
      stop();
      startTransition(() => setPhase("result"));
      return;
    }
    startTransition(() => {
      setIndex(index + 1);
      setDone(false);
    });
  }

  if (phase === "intro") {
    return (
      <GameShell style={style}>
        <ViewTransition exit="vt-fade-out" default="none">
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <span className="game-drop relative block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art} alt="" className="pointer-events-none size-44 animate-float [--float-y:-8px] [animation-delay:700ms] md:size-52" draggable={false} />
              {NOTES.map(([left, top, glyph, color, dx], i) => (
                <span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute animate-rise-fade font-display text-3xl font-bold"
                  style={{ left, top, color, "--i": i * 2, "--rise-x": dx, "--rise-y": "-56px" } as Vars}
                >
                  {glyph}
                </span>
              ))}
            </span>
            <h1 className="animate-rise-in text-4xl font-bold text-[var(--g-ink)] [--i:1] md:text-5xl">{title}</h1>
            <div className="max-w-lg animate-fade-up text-lg text-ink [--i:2]">{description}</div>
            {renderStart ? (
              renderStart(start)
            ) : (
              <button
                type="button"
                data-kid-target
                onClick={() => start()}
                className="halo inline-flex min-h-20 animate-pop-in items-center gap-3 rounded-full bg-pink px-10 font-display text-3xl font-bold text-white shadow-lg transition-transform duration-300 ease-bounce [--i:3] hover:scale-105 active:scale-95"
              >
                <Icon name="volume" className="size-9" /> Bắt đầu
              </button>
            )}
            <p className="animate-fade-in text-sm text-muted [--i:5]">Gợi ý cho cô: bật loa đủ lớn, cả lớp cùng im lặng lắng nghe.</p>
          </div>
        </ViewTransition>
      </GameShell>
    );
  }

  if (phase === "result") {
    const { correct, total } = tally(results);
    return (
      <GameShell style={style}>
        <ConfettiRain />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center" role="status">
          <span className="relative block animate-bounce-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mascot/happy.webp"
              alt=""
              className="pointer-events-none size-44 animate-float [--float-y:-10px] [animation-delay:700ms] [animation-duration:3s] md:size-52"
              draggable={false}
            />
            {correct > 0 && <ScoreBadge correct={correct} total={total} className="absolute -right-4 bottom-4" />}
          </span>
          <ResultStars />
          <h1 className="animate-fade-up text-4xl font-bold text-[var(--g-ink)] [--i:1] md:text-5xl">{resultText(correct, total)}</h1>
          <p className="animate-fade-up text-xl text-ink [--i:2]">
            {correct === total ? "Tuyệt vời! Đôi tai của con thật tinh!" : "Con đã lắng nghe rất chăm chú. Mình cùng chơi thêm nhé!"}
          </p>
          <p className="max-w-lg animate-fade-up rounded-2xl bg-white p-3 text-muted [--i:3]">
            <strong className="text-ink">Hoạt động tiếp theo:</strong> {followUp}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              data-kid-target
              onClick={() => start()}
              className="halo inline-flex min-h-16 animate-pop-in items-center gap-2 rounded-full bg-pink px-7 font-display text-2xl font-bold text-white shadow-lg transition-transform duration-300 ease-bounce [--i:2] hover:scale-105 active:scale-95"
            >
              <Icon name="replay" className="size-7" /> Chơi lại
            </button>
            <Link
              href="/chu-de/"
              data-kid-target
              className="group inline-flex min-h-16 animate-pop-in items-center gap-2 rounded-full bg-blue px-7 font-display text-2xl font-bold text-white shadow-lg transition-transform duration-300 ease-bounce [--i:3] hover:scale-105 active:scale-95"
            >
              Khám phá thêm <Icon name="arrow-right" className="size-7 transition-transform duration-300 ease-bounce group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell style={style} progress={{ index, total: items.length }}>
      <div className="flex flex-1 flex-col items-center gap-4">
        <ViewTransition key={`${runId}-${index}`} enter="vt-slide-in" exit="vt-slide-out" default="none">
          <div className="flex w-full flex-1 flex-col items-center gap-4">{render(items[index], onDone)}</div>
        </ViewTransition>
        {done && (
          <button
            type="button"
            onClick={next}
            className="mt-auto inline-flex min-h-14 animate-pop-in items-center gap-2 rounded-full bg-blue px-8 font-display text-xl font-bold text-white shadow transition-transform duration-300 ease-bounce [--i:3] hover:scale-105 active:scale-95"
          >
            {index + 1 >= items.length ? "Xem kết quả" : "Câu tiếp theo"} <Icon name="arrow-right" className="size-6" />
          </button>
        )}
      </div>
    </GameShell>
  );
}
