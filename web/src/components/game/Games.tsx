"use client";

import { useSearchParams } from "next/navigation";
import { buildCompareRound, buildMatchBoards, buildMixedRound, buildRound, type MixedItem } from "@/lib/quiz";
import { getGroup, groups, groupStyle, PAIR_GROUP, pairs, sounds } from "@/lib/data";
import RoundRunner from "./RoundRunner";
import ChooseQuestion from "./ChooseQuestion";
import MatchQuestion from "./MatchQuestion";
import CompareQuestion from "./CompareQuestion";

const audioOf = (id: string) => sounds.find((s) => s.id === id)?.audio ?? "";
const pairSrcs = (pairId: string) => {
  const p = pairs.find((x) => x.pairId === pairId);
  return p ? [p.audioA, p.audioB] : [];
};
const GENERIC_FOLLOW_UP = "Cả lớp đứng dậy, bắt chước lại một âm thanh vừa nghe bằng cơ thể hoặc đồ vật an toàn trong lớp.";

function useGroupParam() {
  const nhom = useSearchParams().get("nhom");
  return nhom && nhom !== PAIR_GROUP ? getGroup(nhom) : undefined;
}

export function ListenChooseGame() {
  const group = useGroupParam();
  const hinh = Number(useSearchParams().get("hinh"));
  const choices = [2, 3, 4].includes(hinh) ? hinh : 3; // ?hinh= from "Tạo hoạt động" (by age)
  return (
    <RoundRunner
      title="Nghe – chọn hình"
      art="/images/games/nghe-chon-hinh.webp"
      description={`${group ? `Chủ đề: ${group.name}. ` : ""}Nghe thật kỹ, rồi chạm vào hình đúng nhé! (6 câu)`}
      style={groupStyle(group ?? groups[3])}
      build={() => buildRound(sounds, { count: 6, choices, group: group?.slug ?? null, rng: Math.random })}
      srcsOf={(q) => [audioOf(q.answerId)]}
      render={(q, onDone) => <ChooseQuestion question={q} onDone={onDone} />}
      followUp={group?.followUp.activity ?? GENERIC_FOLLOW_UP}
    />
  );
}

// Same listening task, but the number of pictures follows the children's age.
const LEVELS = [
  { choices: 2, label: "Bé 3–4 tuổi", hint: "2 hình" },
  { choices: 3, label: "Bé 4–5 tuổi", hint: "3 hình" },
  { choices: 4, label: "Bé 5–6 tuổi", hint: "4 hình" },
];

export function GuessGame() {
  return (
    <RoundRunner
      title="Đoán âm thanh"
      art="/images/games/doan-am-thanh.webp"
      description="Cô chọn độ tuổi của lớp: bé càng lớn, càng nhiều hình để đoán."
      style={groupStyle(groups[2])}
      build={(choices = 3) => buildRound(sounds, { count: 6, choices, rng: Math.random })}
      srcsOf={(q) => [audioOf(q.answerId)]}
      render={(q, onDone) => <ChooseQuestion question={q} onDone={onDone} />}
      followUp={GENERIC_FOLLOW_UP}
      renderStart={(start) => (
        // Level buttons pop in one after another (tighter stagger so the last one is ready by ~0.7 s).
        <div className="flex flex-wrap justify-center gap-3 [--stagger:50ms]" role="group" aria-label="Chọn độ tuổi">
          {LEVELS.map((l, i) => (
            <button
              key={l.choices}
              type="button"
              data-kid-target
              onClick={() => start(l.choices)}
              className="flex min-h-20 min-w-40 animate-pop-in flex-col items-center justify-center rounded-3xl bg-[var(--g-ink)] px-6 py-2 font-display text-white shadow-lg transition-transform duration-300 ease-bounce hover:-translate-y-1 active:scale-95"
              style={{ "--i": i + 3 } as React.CSSProperties}
            >
              <span className="text-2xl font-bold">{l.label}</span>
              <span className="text-base opacity-90">{l.hint}</span>
            </button>
          ))}
        </div>
      )}
    />
  );
}

export function MatchGame() {
  return (
    <RoundRunner
      title="Nối âm thanh – hình ảnh"
      art="/images/games/noi-am-thanh-hinh-anh.webp"
      description="Chạm vào chiếc loa để nghe, rồi chạm vào hình phát ra âm thanh đó. (3 lượt nối)"
      style={groupStyle(groups[1])}
      build={() => buildMatchBoards(sounds, { boards: 3, size: 3, rng: Math.random })}
      srcsOf={(b) => b.soundIds.map(audioOf)}
      render={(b, onDone) => <MatchQuestion board={b} onDone={onDone} />}
      followUp={GENERIC_FOLLOW_UP}
    />
  );
}

export function CompareGame() {
  const g = getGroup(PAIR_GROUP)!;
  return (
    <RoundRunner
      title="Phân biệt âm thanh"
      art="/images/games/phan-biet-am-thanh.webp"
      description="Nghe hai tiếng liên tiếp, rồi chọn: tiếng nào to hơn, nhanh hơn, cao hơn — hay hai tiếng giống nhau?"
      style={groupStyle(g)}
      build={() => buildCompareRound(pairs, { count: 5, rng: Math.random })}
      srcsOf={(q) => pairSrcs(q.pairId)}
      render={(q, onDone) => <CompareQuestion question={q} onDone={onDone} />}
      followUp={g.followUp.activity}
      resultText={(c, t) => `Con đã phân biệt đúng ${c}/${t} lần!`}
    />
  );
}

export function QuickReviewGame() {
  return (
    <RoundRunner<MixedItem>
      title="Ôn tập nhanh"
      art="/images/games/on-tap-nhanh.webp"
      description="Một bài ngắn trộn nhiều dạng: nghe – chọn hình, nối âm thanh và phân biệt hai tiếng."
      style={groupStyle(groups[0])}
      build={() => buildMixedRound(sounds, pairs, Math.random)}
      srcsOf={(it) => (it.kind === "choose" ? [audioOf(it.question.answerId)] : it.kind === "match" ? it.board.soundIds.map(audioOf) : pairSrcs(it.question.pairId))}
      render={(it, onDone) =>
        it.kind === "choose" ? (
          <ChooseQuestion question={it.question} onDone={onDone} />
        ) : it.kind === "match" ? (
          <MatchQuestion board={it.board} onDone={onDone} />
        ) : (
          <CompareQuestion question={it.question} onDone={onDone} />
        )
      }
      followUp={GENERIC_FOLLOW_UP}
    />
  );
}

