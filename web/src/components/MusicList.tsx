"use client";

import { useSyncExternalStore } from "react";
import Icon from "./Icon";
import type { Track } from "@/lib/data";
import { getMusic, getMusicServer, playTrack, subscribeMusic, toggleMusic } from "@/lib/music";

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// Track list; playing hands the whole section to the sticky mini player so the
// teacher can move between tracks without reopening anything.
export default function MusicList({ tracks }: { tracks: Track[] }) {
  const m = useSyncExternalStore(subscribeMusic, getMusic, getMusicServer);
  const ready = tracks.filter((t) => !t.placeholder);

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {tracks.map((t) => {
        const isCurrent = m.queue[m.index]?.id === t.id;
        const playing = isCurrent && m.playing;
        return (
          <li key={t.id} id={t.id} className={`flex scroll-mt-24 gap-3 rounded-2xl bg-white p-3 shadow-sm ${isCurrent ? "ring-4 ring-[#9cc4ea]" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.cover} alt="" loading="lazy" className="size-24 shrink-0 rounded-xl bg-[#e6f4ff] object-contain p-1" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="font-sans text-lg font-bold leading-snug text-navy">{t.title}</h3>
              <p className="text-sm text-muted">
                Phù hợp: <span className="font-semibold text-ink">{t.use}</span>
                {t.duration ? ` · ${mmss(t.duration)}` : ""}
              </p>
              {t.placeholder ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">Đang chờ nhóm bổ sung file (cần kiểm tra bản quyền).</p>
              ) : (
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => (isCurrent ? toggleMusic() : playTrack(ready, ready.indexOf(t)))}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue px-4 font-bold text-white shadow active:scale-95"
                    aria-label={`${playing ? "Tạm dừng" : "Phát"} ${t.title}`}
                  >
                    <Icon name={playing ? "pause" : "play"} className="size-5" />
                    {playing ? "Tạm dừng" : "Phát"}
                  </button>
                  <span className="text-xs text-muted">
                    {t.author} · {t.license}
                    {t.source && (
                      <>
                        {" · "}
                        <a href={t.source} className="underline" target="_blank" rel="noopener noreferrer">
                          nguồn
                        </a>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
