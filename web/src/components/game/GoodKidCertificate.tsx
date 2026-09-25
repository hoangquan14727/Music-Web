"use client";

import { useState } from "react";
import PrintButton from "@/components/PrintButton";
import { ResultStars } from "./Fx";
import "@/app/motion/certificate.css";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
// Corner flowers on the dashed frame: [position, petal colour].
const FLOWERS: [string, string][] = [
  ["-left-5 -top-5", "#f59bb9"],
  ["-right-5 -top-5", "#8fc3ee"],
  ["-bottom-5 -left-5", "#f8c94c"],
  ["-bottom-5 -right-5", "#8fd3ae"],
];

// "Phiếu bé ngoan" after a round: the teacher types the child's name and prints.
// The name lives only in the uncontrolled input (no name attribute, no form, no storage).
export default function GoodKidCertificate({ game, correct, total, praise }: { game: string; correct: number; total: number; praise: string }) {
  const [today] = useState(() => new Date());
  return (
    <section id="phieu-be-ngoan" aria-label="Phiếu bé ngoan" className="cert flex scroll-mt-4 w-full max-w-2xl flex-col items-center gap-4 self-center pb-4 print:max-w-none print:p-0">
      {/* Only while the card is shown, so lesson-plan printouts stay portrait. */}
      <style>{"@page{size:landscape;margin:10mm}"}</style>
      <div className="cert-card reveal-zoom flex w-full print:min-h-[180mm]">
        <div className="cert-inner relative m-3 flex min-w-0 flex-1 flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:px-8">
          {FLOWERS.map(([pos, color], i) => (
            <svg key={pos} aria-hidden viewBox="0 0 40 40" className={`absolute size-11 animate-sway [--sway:8deg] ${pos}`} style={{ "--i": i } as Vars}>
              {[0, 72, 144, 216, 288].map((r) => (
                <ellipse key={r} cx="20" cy="10" rx="7" ry="9" fill={color} stroke="#fff" strokeWidth="1.5" transform={`rotate(${r} 20 20)`} />
              ))}
              <circle cx="20" cy="20" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
            </svg>
          ))}
          <div className="flex items-center gap-3 font-display text-3xl font-bold">
            <span aria-hidden className="text-blue">♫</span>
            <p className="text-4xl tracking-wide text-pink sm:text-5xl">PHIẾU BÉ NGOAN</p>
            <span aria-hidden className="text-blue">♪</span>
          </div>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mascot/happy.webp" alt="" className="pointer-events-none size-28 shrink-0 sm:size-40" draggable={false} />
            <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-3 sm:items-start sm:text-left">
              <ResultStars />
              <label className="flex w-full items-end gap-2 font-display text-2xl font-bold text-ink">
                Bé:
                <input
                  type="text"
                  aria-label="Tên của bé"
                  placeholder="Tên của bé"
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  className="min-h-11 min-w-0 flex-1 select-text border-b-2 border-dotted border-ink/70 bg-transparent px-1 font-display text-3xl font-bold text-pink-ink placeholder:font-semibold placeholder:text-muted print:placeholder:text-transparent"
                />
              </label>
              <p className="text-xl text-ink">
                Đã hoàn thành “<span className="font-bold">{game}</span>” · {correct}/{total}
              </p>
              <p className="text-lg text-muted">{praise}</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-3 text-lg text-ink">
            <p>
              Ngày {today.getDate()} tháng {today.getMonth() + 1} năm {today.getFullYear()}
            </p>
            <p className="flex items-end gap-2">
              Cô giáo / Ba mẹ khen:
              <span aria-hidden className="inline-block h-6 w-36 border-b-2 border-dotted border-ink/70" />
            </p>
          </div>
        </div>
      </div>
      <PrintButton label="In phiếu / Lưu PDF" />
    </section>
  );
}
