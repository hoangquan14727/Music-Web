"use client";

import { useSyncExternalStore } from "react";
import Icon from "./Icon";
import type { Track } from "@/lib/data";
import { getMusic, getMusicServer, playTrack, subscribeMusic, toggleMusic } from "@/lib/music";
import { ripple } from "@/lib/motion";

// Notes that float up from the playing cover: [glyph, x offset, drift].
const NOTES = [
  ["♪", "right-1", "8px"],
  ["♫", "right-6", "-6px"],
  ["♪", "right-11", "4px"],
] as const;

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
          <li
            key={t.id}
            id={t.id}
            className={`reveal flex scroll-mt-24 gap-3 rounded-2xl bg-white p-3 shadow-sm ${isCurrent ? "ring-4 ring-[#9cc4ea]" : ""} ${
              playing ? "halo [--halo-color:rgb(47_111_176/0.16)] [--halo-size:8px]" : ""
            }`}
          >
            <span className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.cover}
                alt=""
                loading="lazy" suppressHydrationWarning
                className={`block size-24 rounded-xl bg-[#e6f4ff] object-contain p-1 ${playing ? "animate-sounds-bob [animation-duration:2.4s]" : ""}`}
              />
              {playing && (
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 font-display text-xl font-bold text-blue">
                  {NOTES.map(([n, x, drift], i) => (
                    <span
                      key={i}
                      className={`absolute top-0 animate-rise-fade ${x}`}
                      style={{ "--i": i, "--rise-x": drift, "--rise-y": "-44px" } as React.CSSProperties}
                    >
                      {n}
                    </span>
                  ))}
                </span>
              )}
            </span>
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
                    onPointerDown={ripple}
                    onClick={() => (isCurrent ? toggleMusic() : playTrack(ready, ready.indexOf(t)))}
                    className="ripple-host inline-flex min-h-11 items-center gap-2 rounded-full bg-blue px-4 font-bold text-white shadow transition-transform duration-200 ease-bounce hover:-translate-y-0.5 active:scale-95"
                    aria-label={`${playing ? "Tạm dừng" : "Phát"} ${t.title}`}
                  >
                    <Icon key={playing ? "pause" : "play"} name={playing ? "pause" : "play"} className="size-5 animate-pop-in" />
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
