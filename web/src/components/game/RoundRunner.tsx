"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { preload, stop, unlock } from "@/lib/audio";
import { tally, type ItemResult } from "@/lib/quiz";
import Icon from "@/components/Icon";
import GameShell from "./GameShell";

export type RenderItem<T> = (item: T, onDone: (r: ItemResult) => void) => React.ReactNode;

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
    setOption(o);
    const round = build(o);
    preload(round.flatMap(srcsOf).concat(["/audio/fx/dung.mp3", "/audio/fx/thu-lai.mp3"]));
    setItems(round);
    setResults([]);
    setIndex(0);
    setDone(false);
    setRunId((n) => n + 1);
    setPhase("play");
  }

  function onDone(r: ItemResult) {
    setResults((rs) => {
      const next = rs.slice();
      next[index] = r;
      return next;
    });
    setDone(true);
  }

  function next() {
    if (index + 1 >= items.length) {
      stop();
      setPhase("result");
      return;
    }
    setIndex(index + 1);
    setDone(false);
  }

  if (phase === "intro") {
    return (
      <GameShell style={style}>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art} alt="" className="size-44 md:size-52" draggable={false} />
          <h1 className="text-4xl font-bold text-[var(--g-ink)] md:text-5xl">{title}</h1>
          <div className="max-w-lg text-lg text-ink">{description}</div>
          {renderStart ? (
            renderStart(start)
          ) : (
            <button
              type="button"
              data-kid-target
              onClick={() => start()}
              className="inline-flex min-h-20 items-center gap-3 rounded-full bg-pink px-10 font-display text-3xl font-bold text-white shadow-lg active:scale-95"
            >
              <Icon name="volume" className="size-9" /> Bắt đầu
            </button>
          )}
          <p className="text-sm text-muted">Gợi ý cho cô: bật loa đủ lớn, cả lớp cùng im lặng lắng nghe.</p>
        </div>
      </GameShell>
    );
  }

  if (phase === "result") {
    const { correct, total } = tally(results);
    return (
      <GameShell style={style}>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center" role="status">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot/happy.webp" alt="" className="size-44 md:size-52" draggable={false} />
          <h1 className="text-4xl font-bold text-[var(--g-ink)] md:text-5xl">{resultText(correct, total)}</h1>
          <p className="text-xl text-ink">
            {correct === total ? "Tuyệt vời! Đôi tai của con thật tinh!" : "Con đã lắng nghe rất chăm chú. Mình cùng chơi thêm nhé!"}
          </p>
          <p className="max-w-lg rounded-2xl bg-white p-3 text-muted">
            <strong className="text-ink">Hoạt động tiếp theo:</strong> {followUp}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              data-kid-target
              onClick={() => start()}
              className="inline-flex min-h-16 items-center gap-2 rounded-full bg-pink px-7 font-display text-2xl font-bold text-white shadow-lg active:scale-95"
            >
              <Icon name="replay" className="size-7" /> Chơi lại
            </button>
            <Link
              href="/chu-de/"
              data-kid-target
              className="inline-flex min-h-16 items-center gap-2 rounded-full bg-blue px-7 font-display text-2xl font-bold text-white shadow-lg active:scale-95"
            >
              Khám phá thêm <Icon name="arrow-right" className="size-7" />
            </Link>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell style={style} progress={{ index, total: items.length }}>
      <div className="flex flex-1 flex-col items-center gap-4">
        <div key={`${runId}-${index}`} className="flex w-full flex-1 flex-col items-center gap-4">
          {render(items[index], onDone)}
        </div>
        {done && (
          <button
            type="button"
            onClick={next}
            className="mt-auto inline-flex min-h-14 items-center gap-2 rounded-full bg-blue px-8 font-display text-xl font-bold text-white shadow active:scale-95"
          >
            {index + 1 >= items.length ? "Xem kết quả" : "Câu tiếp theo"} <Icon name="arrow-right" className="size-6" />
          </button>
        )}
      </div>
    </GameShell>
  );
}
