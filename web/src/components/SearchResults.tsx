"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SoundCard from "./SoundCard";
import { SearchForm } from "./NavHeader";
import { getGroup, groupStyle, music, pairs, sounds } from "@/lib/data";
import { matches } from "@/lib/text";

// Stagger index for the result pop-in (capped so long lists don't lag).
const at = (i: number) => ({ "--i": Math.min(i, 6) }) as React.CSSProperties;

export default function SearchResults() {
  const raw = useSearchParams().get("q")?.trim() ?? "";
  const form = <SearchForm key={raw} defaultValue={raw} className="sounds-search mb-6 max-w-md" />;
  if (!raw) return form;

  const hits = sounds.filter((s) => matches(raw, s.name, getGroup(s.group)?.name ?? "", s.keywords ?? ""));
  const pairHits = pairs.filter((p) => matches(raw, p.title, "đặc tính"));
  const musicHits = music.filter((m) => matches(raw, `${m.title} ${m.use}`, "nhạc"));
  const total = hits.length + pairHits.length + musicHits.length;

  // Keyed by the query, so every new search replays the entrance.
  return (
    <>
      {form}
      <section aria-live="polite" className="mb-10 rounded-card bg-white p-4 shadow-sm">
        <h2 key={`h:${raw}`} className="mb-3 animate-fade-down text-xl font-bold text-navy">
          Kết quả cho “{raw}”: {total} kết quả
        </h2>
        {total === 0 ? (
          <div key={raw} className="flex items-center gap-4">
            <span className="shrink-0 animate-pop-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mascot/confused.webp" alt="" draggable={false} className="sounds-shrug size-20 object-contain" />
            </span>
            <p className="animate-fade-up text-muted [--i:3]">Chưa tìm thấy. Thử gõ tên khác, ví dụ “mưa”, “xe”, “vỗ tay”, “động vật”, “ru ngủ”.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {hits.map((s, i) => (
              <li key={s.id} className="animate-pop-in" style={{ ...groupStyle(getGroup(s.group)!), ...at(i) }}>
                <SoundCard sound={s} showName />
              </li>
            ))}
            {pairHits.map((p, i) => (
              <li key={p.pairId} className="animate-pop-in" style={at(hits.length + i)}>
                <Link
                  href="/chu-de/dac-tinh-am-thanh/"
                  className="flex min-h-16 items-center justify-center rounded-card bg-[#fbf7d2] p-4 text-center font-bold text-[#9a5b12] transition-transform duration-300 ease-bounce hover:-translate-y-1 active:scale-95"
                >
                  {p.title}
                </Link>
              </li>
            ))}
            {musicHits.map((m, i) => (
              <li key={m.id} className="animate-pop-in" style={at(hits.length + pairHits.length + i)}>
                <Link
                  href={`/thu-vien-nhac/#${m.id}`}
                  className="group flex h-full flex-col items-center gap-2 rounded-card bg-[#e6f4ff] p-3 text-center font-bold text-navy transition-transform duration-300 ease-bounce hover:-translate-y-1 active:scale-95"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.cover} alt="" loading="lazy" className="size-20 object-contain transition-transform duration-300 ease-bounce group-hover:-rotate-6 group-hover:scale-110" />
                  {m.title}
                  <span className="text-sm font-normal text-muted">Thư viện nhạc</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
