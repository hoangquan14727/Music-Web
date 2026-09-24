"use client";

import { useState } from "react";
import { play } from "@/lib/audio";
import type { Sound } from "@/lib/data";
import { ripple } from "@/lib/motion";
import { usePlaying } from "./usePlaying";
import SoundArt from "./SoundArt";
import SoundBars from "./SoundBars";
import Burst from "./Burst";
import Icon from "./Icon";

// Whole card is one big button. "Nghe trước – gọi tên sau": the name appears
// only once the sound has finished (time for the teacher to ask
// "Con nghe thấy âm thanh gì?"); tapping again replays.
export default function SoundCard({ sound, showName = false }: { sound: Sound; showName?: boolean }) {
  const [heard, setHeard] = useState(showName);
  const playing = usePlaying() === sound.audio;

  return (
    <button
      type="button"
      data-kid-target
      data-sound={sound.id}
      onPointerDown={ripple}
      onClick={() => {
        play(sound.audio).then((r) => r !== "stopped" && setHeard(true));
      }}
      className={`ripple-host group flex w-full flex-col overflow-hidden rounded-card border-4 bg-[var(--g-bg)] text-left shadow-sm transition-transform duration-300 ease-bounce [--ripple-color:var(--g-accent)] hover:-translate-y-1 active:scale-x-[1.02] active:scale-y-[0.95] active:duration-100 ${
        playing ? "is-playing border-[var(--g-accent)] ring-4 ring-[var(--g-accent)]/40" : "border-white"
      }`}
    >
      <span className="relative block aspect-square w-full">
        <SoundArt image={sound.image} className={`p-3 ${playing ? "animate-sounds-bob" : ""}`} />
        <span className="sound-rings absolute bottom-2 left-2 grid size-14 place-items-center rounded-full bg-white/95 text-[var(--g-ink)] shadow-md transition-transform duration-300 ease-bounce [--ring-color:var(--g-accent)] [--ring-scale:1.3] group-hover:scale-110">
          {playing ? <SoundBars /> : <Icon name="volume" className="size-7 animate-pop-in" />}
        </span>
      </span>
      <span className="relative flex min-h-16 items-center justify-center px-2 py-2 text-center font-display text-lg font-bold leading-tight text-[var(--g-ink)]">
        {heard ? (
          <span className={showName ? undefined : "animate-bounce-in"}>
            {sound.name}
            <span className="sr-only">, chạm để nghe lại</span>
          </span>
        ) : (
          <>
            {/* The question marks hop in a wave while the child listens. */}
            <span className="inline-flex gap-2 text-2xl" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={playing ? "animate-hop [--hop-y:-5px]" : undefined} style={{ "--i": i } as React.CSSProperties}>
                  ?
                </span>
              ))}
            </span>
            <span className="sr-only">Chạm để nghe âm thanh</span>
          </>
        )}
        {/* Name revealed after listening: a tiny sparkle, once. */}
        <Burst trigger={heard && !showName} variant="sparkles" count={10} spread={70} />
      </span>
    </button>
  );
}
