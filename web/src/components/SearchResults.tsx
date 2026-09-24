"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SoundCard from "./SoundCard";
import { SearchForm } from "./NavHeader";
import { getGroup, groupStyle, music, pairs, sounds } from "@/lib/data";
import { matches } from "@/lib/text";

export default function SearchResults() {
  const raw = useSearchParams().get("q")?.trim() ?? "";
  const form = <SearchForm key={raw} defaultValue={raw} className="mb-6 max-w-md" />;
  if (!raw) return form;

  const hits = sounds.filter((s) => matches(raw, s.name, getGroup(s.group)?.name ?? "", s.keywords ?? ""));
  const pairHits = pairs.filter((p) => matches(raw, p.title, "đặc tính"));
  const musicHits = music.filter((m) => matches(raw, `${m.title} ${m.use}`, "nhạc"));
  const total = hits.length + pairHits.length + musicHits.length;

  return (
    <>
      {form}
      <section aria-live="polite" className="mb-10 rounded-card bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-bold text-navy">
          Kết quả cho “{raw}”: {total} kết quả
        </h2>
        {total === 0 ? (
          <p className="text-muted">Chưa tìm thấy. Thử gõ tên khác, ví dụ “mưa”, “xe”, “vỗ tay”, “động vật”, “ru ngủ”.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {hits.map((s) => (
              <li key={s.id} style={groupStyle(getGroup(s.group)!)}>
                <SoundCard sound={s} showName />
              </li>
            ))}
            {pairHits.map((p) => (
              <li key={p.pairId}>
                <Link href="/chu-de/dac-tinh-am-thanh/" className="flex min-h-16 items-center justify-center rounded-card bg-[#fbf7d2] p-4 text-center font-bold text-[#9a5b12]">
                  {p.title}
                </Link>
              </li>
            ))}
            {musicHits.map((m) => (
              <li key={m.id}>
                <Link href={`/thu-vien-nhac/#${m.id}`} className="flex h-full flex-col items-center gap-2 rounded-card bg-[#e6f4ff] p-3 text-center font-bold text-navy">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.cover} alt="" loading="lazy" className="size-20 object-contain" />
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
