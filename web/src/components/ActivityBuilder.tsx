"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "./Icon";
import PairCard from "./PairCard";
import PrintButton from "./PrintButton";
import SoundCard from "./SoundCard";
import { AGES, ChipGroup } from "./TeacherSuggestions";
import { getGroup, groups, groupStyle, PAIR_GROUP, pairs, soundsIn } from "@/lib/data";
import { ripple } from "@/lib/motion";

// Pictures per question in "Nghe – chọn hình": fewer for younger children.
const PICTURES: Record<string, number> = { "3-4": 2, "4-5": 3, "5-6": 4 };

// Rule-based (no AI): fills the 5-step 10–15 minute plan from PDF §6 with the
// chosen group's own sounds, follow-up question and real-world activity.
export default function ActivityBuilder() {
  const [slug, setSlug] = useState(groups[0].slug);
  const [age, setAge] = useState("4-5");
  const [offset, setOffset] = useState(0);

  const g = getGroup(slug)!;
  const isPairs = slug === PAIR_GROUP;
  const n = age === "3-4" ? 3 : 4;
  const pick = <T,>(pool: T[]) => Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(offset + i) % pool.length]);
  const pickedPairs = isPairs ? pick(pairs) : [];
  const pickedSounds = isPairs ? [] : pick(soundsIn(slug));
  const names = isPairs ? pickedPairs.map((p) => p.title) : pickedSounds.map((s) => s.name);
  const hinh = PICTURES[age];
  // New key → the plan's title / steps remount and play their entrance again.
  const game = isPairs ? "/on-tap/phan-biet-am-thanh/" : `/on-tap/nghe-chon-hinh/?nhom=${slug}&hinh=${hinh}`;

  const steps: [string, React.ReactNode][] = [
    ["Gây hứng thú (2 phút)", `Cô hỏi: “${g.followUp.question}”`],
    [
      "Nghe (3 phút)",
      <>
        Cô mở {names.length} {isPairs ? "cặp âm" : "âm thanh"} ở{" "}
        <Link href={`/chu-de/${slug}/`} className="font-semibold text-blue underline">
          {g.name}
        </Link>
        : {names.join(", ")}.
        {/* Playable right here; the printout keeps just the names. aria-live off:
            card labels change while playing and must not be re-announced. */}
        <ul aria-live="off" style={groupStyle(g)} className={`kid-zone mt-3 grid gap-3 no-print ${isPairs ? "sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
          {pickedPairs.map((p) => (
            <li key={p.pairId}>
              <PairCard pair={p} />
            </li>
          ))}
          {pickedSounds.map((s) => (
            <li key={s.id}>
              <SoundCard sound={s} showName />
            </li>
          ))}
        </ul>
      </>,
    ],
    [
      "Dự đoán (3 phút)",
      <>
        Trẻ chơi{" "}
        <Link href={game} className="font-semibold text-blue underline">
          {isPairs ? "Phân biệt âm thanh" : "Nghe – chọn hình"}
        </Link>{" "}
        theo nhóm nhỏ hoặc cả lớp{isPairs ? "" : ` (${hinh} hình mỗi câu)`}.
      </>,
    ],
    [
      "Kiểm chứng (3 phút)",
      isPairs ? "Website phản hồi; cô hỏi: “Vì sao con biết tiếng này to hơn (nhanh hơn, cao hơn)?”" : "Website phản hồi; cô hỏi: “Vì sao con chọn hình này?”",
    ],
    ["Chuyển sang hoạt động thật", g.followUp.activity],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="reveal flex flex-col gap-4 rounded-card bg-white p-4 shadow-sm no-print">
        <ChipGroup legend="Nhóm âm thanh" name="tao-nhom" value={slug} onChange={(v) => (setSlug(v), setOffset(0))} options={groups.map((x) => [x.slug, x.caption] as [string, string])} />
        <ChipGroup legend="Độ tuổi" name="tao-tuoi" value={age} onChange={setAge} options={AGES.map((a) => [a, `${a} tuổi`] as [string, string])} />
        <button
          type="button"
          onClick={() => setOffset((o) => o + n)}
          onPointerDown={ripple}
          className="ripple-host inline-flex min-h-11 w-fit items-center gap-2 rounded-full border-2 border-[#7a4fc4] px-4 font-bold text-[#5e3a9e] transition-[scale,background-color] duration-200 ease-bounce hover:bg-[#faf7ff] active:scale-95"
        >
          {/* Spins once per click (remounts on each new offset). */}
          <span key={offset} className={`inline-flex ${offset ? "animate-chrome-spin" : ""}`}>
            <Icon name="replay" className="size-5" />
          </span>
          Đổi âm thanh khác
        </button>
      </div>

      <article className="rounded-card border-2 border-[#f4edfd] bg-white p-5 shadow-sm" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="animate-slide-in-left [animation-duration:.45s]">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7a4fc4]">Hoạt động 10–15 phút · {age} tuổi</p>
            <h3 className="font-sans text-2xl font-bold text-navy">Bé khám phá: {g.caption.toLowerCase()}</h3>
          </div>
          <PrintButton />
        </div>
        <ol className="mt-4 space-y-3" style={{ "--stagger": "50ms" } as React.CSSProperties}>
          {steps.map(([t, d], i) => (
            <li key={t} className="animate-fade-up rounded-2xl border-l-4 border-[#7a4fc4] bg-[#faf7ff] p-3 [animation-duration:.45s]" style={{ "--i": i } as React.CSSProperties}>
              <p className="font-bold text-ink">{t}</p>
              <div className="text-ink">{d}</div>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
