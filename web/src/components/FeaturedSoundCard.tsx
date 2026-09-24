"use client";

import { playSequence } from "@/lib/audio";
import { groupStyle, type Featured } from "@/lib/data";
import { usePlaying } from "./usePlaying";
import SoundArt from "./SoundArt";
import SoundBars from "./SoundBars";
import Icon from "./Icon";

// Plays right here on the homepage (no navigation). Whole card is the button.
export default function FeaturedSoundCard({ item }: { item: Featured }) {
  const current = usePlaying();
  const playing = current !== null && item.srcs.includes(current);
  return (
    <button
      type="button"
      data-kid-target
      onClick={() => playSequence(item.srcs)}
      style={groupStyle(item.group)}
      className={`w-full rounded-2xl text-left ${playing ? "is-playing" : ""}`}
    >
      <span
        className={`relative block aspect-[2/1] overflow-hidden rounded-2xl bg-[var(--g-bg)] shadow-sm ring-4 ${
          playing ? "ring-[var(--g-accent)]" : "ring-transparent"
        }`}
      >
        <SoundArt image={item.image} className="p-2" />
        <span className="absolute bottom-2 right-2 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow">
          {playing ? <SoundBars className="h-5 text-[var(--g-ink)]" /> : <Icon name="play" className="size-5 translate-x-px" />}
        </span>
      </span>
      <span className="mt-2 block font-bold text-navy">
        <span className="sr-only">Nghe: </span>
        {item.name}
      </span>
      <span className="block text-sm text-muted">{item.group.caption}</span>
    </button>
  );
}
