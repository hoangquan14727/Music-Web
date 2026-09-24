"use client";

import { useState } from "react";
import { playSequence } from "@/lib/audio";
import { groupStyle, type Featured } from "@/lib/data";
import { usePlaying } from "./usePlaying";
import SoundArt from "./SoundArt";
import SoundBars from "./SoundBars";
import Icon from "./Icon";
import Burst from "./Burst";

// Plays right here on the homepage (no navigation). Whole card is the button.
export default function FeaturedSoundCard({ item }: { item: Featured }) {
  const current = usePlaying();
  const playing = current !== null && item.srcs.includes(current);
  const [taps, setTaps] = useState(0); // replays the notes burst
  return (
    <button
      type="button"
      data-kid-target
      onClick={() => {
        setTaps((t) => t + 1);
        playSequence(item.srcs);
      }}
      style={groupStyle(item.group)}
      className={`group w-full rounded-2xl text-left transition-transform duration-300 ease-bounce hover:-translate-y-1 active:scale-[0.97] ${playing ? "is-playing" : ""}`}
    >
      {/* Rings go on this wrapper: the picture box below clips its overflow. */}
      <span className="sound-rings block rounded-2xl [--ring-color:var(--g-accent)] [--ring-scale:1.1]">
        <span
          className={`relative block aspect-[2/1] overflow-hidden rounded-2xl bg-[var(--g-bg)] shadow-sm ring-4 ${
            playing ? "ring-[var(--g-accent)]" : "ring-transparent"
          }`}
        >
          <span className="home-art block size-full transition-transform duration-500 ease-bounce group-hover:scale-105">
            <SoundArt image={item.image} className="p-2" />
          </span>
          <span className="absolute bottom-2 right-2 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow transition-transform duration-300 ease-bounce group-hover:scale-110">
            {playing ? <SoundBars className="h-5 animate-pop-in text-[var(--g-ink)]" /> : <Icon name="play" className="size-5 translate-x-px animate-pop-in" />}
          </span>
        </span>
        <Burst trigger={taps} variant="notes" count={8} spread={90} />
      </span>
      <span className="mt-2 block font-bold text-navy">
        <span className="sr-only">Nghe: </span>
        {item.name}
      </span>
      <span className="block text-sm text-muted">{item.group.caption}</span>
    </button>
  );
}
