"use client";

import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import Icon from "./Icon";
import { getGroup, groups, sounds, suggestions } from "@/lib/data";

export const AGES = ["3-4", "4-5", "5-6"];
export const ACTIVITY: Record<string, string> = {
  "kham-pha": "Khám phá",
  "ngon-ngu": "Ngôn ngữ",
  "am-nhac": "Âm nhạc – vận động",
  "chuyen-tiep": "Chuyển tiếp – thư giãn",
};

// Native radio buttons styled as chips: keyboard- and screen-reader-friendly.
// Pressing squishes a chip; the newly checked one pops.
export function ChipGroup({ legend, name, value, options, onChange }: { legend: string; name: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-1 w-full text-sm font-bold text-ink">{legend}</legend>
      {options.map(([v, label]) => (
        <label key={v} className="cursor-pointer">
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="peer sr-only" />
          <span className="inline-flex min-h-11 items-center rounded-full border-2 border-line bg-white px-4 text-sm font-semibold text-ink transition-[scale,translate] duration-200 ease-bounce hover:-translate-y-0.5 active:scale-90 peer-checked:animate-chrome-pop peer-checked:border-[#7a4fc4] peer-checked:bg-[#f4edfd] peer-checked:text-[#5e3a9e] peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2f6fb0]">
            {label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default function TeacherSuggestions() {
  const [age, setAge] = useState("all");
  const [group, setGroup] = useState("all");
  const [activity, setActivity] = useState("all");
  // Chips update at once; the list follows in a transition so its cards can
  // fade/move (<ViewTransition>). A transition on the radios themselves would lag.
  const [shown, setShown] = useState({ age, group, activity });
  const filter = (set: (v: string) => void, key: keyof typeof shown) => (v: string) => {
    set(v);
    startTransition(() => setShown((f) => ({ ...f, [key]: v })));
  };

  const list = suggestions.filter(
    (s) =>
      (shown.age === "all" || s.ages.includes(shown.age)) &&
      (shown.group === "all" || s.groups.includes(shown.group)) &&
      (shown.activity === "all" || s.activity === shown.activity),
  );

  return (
    <>
      <div className="reveal grid gap-4 rounded-card bg-white p-4 shadow-sm md:grid-cols-3">
        <ChipGroup legend="Độ tuổi" name="tuoi" value={age} onChange={filter(setAge, "age")} options={[["all", "Tất cả"], ...AGES.map((a) => [a, `${a} tuổi`] as [string, string])]} />
        <ChipGroup legend="Chủ đề" name="chu-de" value={group} onChange={filter(setGroup, "group")} options={[["all", "Tất cả"], ...groups.map((g) => [g.slug, g.caption] as [string, string])]} />
        <ChipGroup legend="Loại hoạt động" name="loai" value={activity} onChange={filter(setActivity, "activity")} options={[["all", "Tất cả"], ...Object.entries(ACTIVITY)]} />
      </div>

      <p className="my-3 text-sm text-muted" aria-live="polite">
        {list.length} gợi ý phù hợp
      </p>

      {list.length === 0 ? (
        <ViewTransition enter="vt-fade-in" exit="vt-fade-out" default="none">
          <p className="rounded-card border-2 border-dashed border-line bg-white p-5 text-muted">Chưa có gợi ý cho lựa chọn này — thử bỏ bớt một bộ lọc, hoặc dùng “Tạo hoạt động” bên dưới.</p>
        </ViewTransition>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((s) => (
            <ViewTransition key={s.id} enter="chrome-card-in" exit="vt-fade-out" update="vt-morph" default="none">
              <li className="reveal flex flex-col gap-2 rounded-card border-2 border-[#f4edfd] bg-white p-5 shadow-sm">
                <h3 className="font-sans text-xl font-bold text-navy">{s.title}</h3>
                <p className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f4edfd] px-3 py-1 text-[#5e3a9e]">
                    <Icon name="users" className="size-4" /> {s.ages.map((a) => `${a} tuổi`).join(", ")}
                  </span>
                  <span className="rounded-full bg-[#e6f4ff] px-3 py-1 text-[#245a91]">{ACTIVITY[s.activity]}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-page px-3 py-1 text-muted">
                    <Icon name="clock" className="size-4" /> {s.minutes} phút
                  </span>
                </p>
                <ol className="list-decimal space-y-1 pl-5 text-ink">
                  {s.steps.map((st) => (
                    <li key={st}>{st}</li>
                  ))}
                </ol>
                <p className="mt-auto text-sm text-muted">
                  Âm thanh dùng:{" "}
                  {s.groups.map((g, i) => (
                    <span key={g}>
                      {i > 0 && ", "}
                      <Link href={`/chu-de/${g}/`} className="font-semibold text-blue underline">
                        {getGroup(g)?.caption}
                      </Link>
                    </span>
                  ))}
                  {s.soundIds.length > 0 && ` (${s.soundIds.map((id) => sounds.find((x) => x.id === id)?.name).join(", ")})`}
                </p>
              </li>
            </ViewTransition>
          ))}
        </ul>
      )}
    </>
  );
}
