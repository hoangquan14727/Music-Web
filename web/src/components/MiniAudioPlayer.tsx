"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Icon from "./Icon";
import SoundBars from "./SoundBars";
import { mmss } from "./MusicList";
import { closeMusic, getMusic, getMusicServer, next, pauseMusic, prev, seek, setLoop, subscribeMusic, toggleMusic } from "@/lib/music";
import { motionOff, ripple } from "@/lib/motion";

// Sticky bottom bar for the music library. Lives in the site layout, so music
// keeps playing while the teacher browses; game screens pause it.
export default function MiniAudioPlayer() {
  const m = useSyncExternalStore(subscribeMusic, getMusic, getMusicServer);
  // Close = pause now, slide out, then clear the queue (unless play was pressed again meanwhile).
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => {
      setClosing(false);
      if (!getMusic().playing) closeMusic();
    }, 260);
    // Also finish the close if we leave mid-slide (e.g. straight into a game).
    return () => {
      clearTimeout(t);
      if (!getMusic().playing) closeMusic();
    };
  }, [closing]);
  const track = m.queue[m.index];
  if (!track) return null;

  const close = () => {
    pauseMusic();
    if (motionOff()) closeMusic();
    else setClosing(true);
  };
  const btn = "grid size-12 place-items-center rounded-full text-ink transition duration-200 ease-bounce hover:bg-page active:scale-90 disabled:opacity-40";
  return (
    <>
      <div className="h-44 sm:h-28 no-print" aria-hidden />
      <section
        aria-label="Trình phát nhạc"
        style={{ viewTransitionName: "mini-player" }}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(43,63,92,0.08)] backdrop-blur no-print ${
          closing ? "pointer-events-none animate-sounds-player-out" : "animate-sounds-player-in"
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.cover ?? ""}
            alt=""
            className={`hidden size-14 animate-spin-slow rounded-full bg-[#e6f4ff] object-contain p-1.5 ring-2 ring-[#dceffe] sm:block ${m.playing ? "" : "[animation-play-state:paused]"}`}
          />
          <div className="min-w-0 flex-1 basis-full sm:basis-0">
            <p className="flex items-center gap-2 font-bold text-navy">
              <span className={m.playing ? "is-playing text-blue" : "text-blue"}>
                <SoundBars className="sounds-mini-bars" />
              </span>
              <span className="truncate">{track.title}</span>
            </p>
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
            <button
              type="button"
              className="ripple-host grid size-14 place-items-center rounded-full bg-blue text-white shadow transition-transform duration-200 ease-bounce active:scale-90"
              onPointerDown={ripple}
              onClick={toggleMusic}
              aria-label={m.playing ? "Tạm dừng" : "Phát"}
            >
              <Icon key={m.playing ? "pause" : "play"} name={m.playing ? "pause" : "play"} className="size-7 animate-pop-in" />
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
              <Icon key={String(m.loop)} name="repeat" className="size-6 animate-pop-in" />
            </button>
            <button type="button" className={btn} onClick={close} aria-label="Tắt trình phát">
              <Icon name="close" className="size-6" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
