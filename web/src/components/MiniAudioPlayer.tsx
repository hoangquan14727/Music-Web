"use client";

import { useSyncExternalStore } from "react";
import Icon from "./Icon";
import { mmss } from "./MusicList";
import { closeMusic, getMusic, getMusicServer, next, prev, seek, setLoop, subscribeMusic, toggleMusic } from "@/lib/music";

// Sticky bottom bar for the music library. Lives in the site layout, so music
// keeps playing while the teacher browses; game screens pause it.
export default function MiniAudioPlayer() {
  const m = useSyncExternalStore(subscribeMusic, getMusic, getMusicServer);
  const track = m.queue[m.index];
  if (!track) return null;

  const btn = "grid size-12 place-items-center rounded-full text-ink hover:bg-page active:scale-95 disabled:opacity-40";
  return (
    <>
      <div className="h-44 sm:h-28 no-print" aria-hidden />
      <section
        aria-label="Trình phát nhạc"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(43,63,92,0.08)] backdrop-blur no-print"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={track.cover ?? ""} alt="" className="hidden size-14 rounded-xl bg-[#e6f4ff] object-contain p-1 sm:block" />
          <div className="min-w-0 flex-1 basis-full sm:basis-0">
            <p className="truncate font-bold text-navy">{track.title}</p>
            <p className="truncate text-xs text-muted">{track.use}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
              <span className="w-9 text-right tabular-nums">{mmss(m.time)}</span>
              <input
                type="range"
                min={0}
                max={m.duration || 0}
                step={1}
                value={Math.min(m.time, m.duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Vị trí bài nhạc"
                className="h-2 flex-1 accent-[#2f6fb0]"
              />
              <span className="w-9 tabular-nums">{mmss(m.duration)}</span>
            </div>
          </div>
          {/* Phones: controls get their own row. */}
          <div className="mx-auto flex items-center gap-1 sm:mx-0">
            <button type="button" className={btn} onClick={prev} aria-label="Bài trước">
              <Icon name="prev" className="size-6" />
            </button>
            <button type="button" className="grid size-14 place-items-center rounded-full bg-blue text-white shadow active:scale-95" onClick={toggleMusic} aria-label={m.playing ? "Tạm dừng" : "Phát"}>
              <Icon name={m.playing ? "pause" : "play"} className="size-7" />
            </button>
            <button type="button" className={btn} onClick={next} disabled={m.index + 1 >= m.queue.length} aria-label="Bài tiếp theo">
              <Icon name="next" className="size-6" />
            </button>
            <button
              type="button"
              className={`${btn} ${m.loop ? "bg-[#dceffe] text-blue" : ""}`}
              onClick={() => setLoop(!m.loop)}
              aria-pressed={m.loop}
              aria-label="Lặp lại bài này"
            >
              <Icon name="repeat" className="size-6" />
            </button>
            <button type="button" className={btn} onClick={closeMusic} aria-label="Tắt trình phát">
              <Icon name="close" className="size-6" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
