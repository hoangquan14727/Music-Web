"use client";

import { useState } from "react";
import { play } from "@/lib/audio";
import type { Sound } from "@/lib/data";
import { usePlaying } from "./usePlaying";
import SoundArt from "./SoundArt";
import SoundBars from "./SoundBars";
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
      onClick={() => {
        play(sound.audio).then((r) => r !== "stopped" && setHeard(true));
      }}
      className={`flex w-full flex-col overflow-hidden rounded-card border-4 bg-[var(--g-bg)] text-left shadow-sm transition-transform active:scale-[0.98] ${
        playing ? "is-playing border-[var(--g-accent)] ring-4 ring-[var(--g-accent)]/40" : "border-white"
      }`}
    >
      <span className="relative block aspect-square w-full">
        <SoundArt image={sound.image} className="p-3" />
        <span className="absolute bottom-2 left-2 grid size-14 place-items-center rounded-full bg-white/95 text-[var(--g-ink)] shadow-md">
          {playing ? <SoundBars /> : <Icon name="volume" className="size-7" />}
        </span>
      </span>
      <span className="flex min-h-16 items-center justify-center px-2 py-2 text-center font-display text-lg font-bold leading-tight text-[var(--g-ink)]">
        {heard ? (
          <>
            {sound.name}
            <span className="sr-only">, chạm để nghe lại</span>
          </>
        ) : (
          <>
            <span className="text-2xl tracking-widest" aria-hidden>
              ? ? ?
            </span>
            <span className="sr-only">Chạm để nghe âm thanh</span>
          </>
        )}
      </span>
    </button>
  );
}
