"use client";

import { useRef, useState } from "react";
import { play } from "@/lib/audio";
import type { ItemResult, MatchBoard } from "@/lib/quiz";
import { sounds, type Sound } from "@/lib/data";
import SoundArt from "@/components/SoundArt";
import { usePlaying } from "@/components/usePlaying";
import SoundToken, { Dots, TOKENS } from "./SoundToken";

const byId = (id: string) => sounds.find((s) => s.id === id) as Sound;
// Tap-to-match (more reliable than drag & drop on classroom tablets):
// tap a sound token (it plays), then tap its picture. Right → locked pair;
// wrong → "Thử lại nhé!" and the pair is released.
export default function MatchQuestion({ board, onDone }: { board: MatchBoard; onDone: (r: ItemResult) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, true>>({});
  const [message, setMessage] = useState("Chạm vào một chiếc loa để nghe!");
  const [wrongImage, setWrongImage] = useState<string | null>(null);
  const missed = useRef(new Set<string>());
  const locked = useRef(false);
  const current = usePlaying();

  function pickSound(id: string) {
    if (matched[id] || locked.current) return;
    setSelected(id);
    setWrongImage(null);
    setMessage("Hình nào phát ra âm thanh này?");
    play(byId(id).audio);
  }

  function pickImage(id: string) {
    if (locked.current || matched[id]) return;
    if (!selected) {
      setMessage("Chạm vào chiếc loa trước nhé!");
      return;
    }
    if (id === selected) {
      const next = { ...matched, [id]: true as const };
      setMatched(next);
      setSelected(null);
      play("/audio/fx/dung.mp3");
      const n = board.soundIds.length;
      if (Object.keys(next).length === n) {
        setMessage("Giỏi quá! Con đã nối đúng hết!");
        locked.current = true;
        onDone({ correct: n - missed.current.size, total: n });
      } else setMessage("Đúng rồi! Chạm chiếc loa tiếp theo nhé!");
      return;
    }
    missed.current.add(selected);
    setWrongImage(id);
    setMessage("Thử lại nhé!");
    locked.current = true;
    // "Thử lại nhé!" then hear the chosen sound again (the token stays selected).
    const replay = byId(selected).audio;
    play("/audio/fx/thu-lai.mp3").then((r) => {
      locked.current = false;
      if (r === "ended") play(replay);
    });
  }

  const tokenOf = (id: string) => TOKENS[board.soundIds.indexOf(id)];

  return (
    <>
      <p className="font-display text-2xl font-bold text-[var(--g-ink)]" aria-live="polite">
        {message}
      </p>
      <div className="grid w-full max-w-4xl grid-cols-[auto_1fr] gap-4 sm:gap-8">
        <ul className="flex flex-col justify-around gap-4" aria-label="Các âm thanh">
          {board.soundIds.map((id, i) => {
            const on = current === byId(id).audio;
            return (
              <li key={id}>
                <button
                  type="button"
                  data-kid-target
                  data-token={id}
                  onClick={() => pickSound(id)}
                  aria-label={`Âm thanh ${i + 1}${matched[id] ? ", đã nối" : ""}`}
                  className={`block rounded-full transition-transform active:scale-95 ${selected === id ? "scale-110 ring-8" : ""} ${matched[id] ? "opacity-60" : ""}`}
                  style={{ ["--tw-ring-color" as string]: `${TOKENS[i].color}55` }}
                >
                  <SoundToken index={i} playing={on} done={!!matched[id]} className="size-24 sm:size-28" />
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5" aria-label="Các hình">
          {board.imageIds.map((id, i) => {
            const s = byId(id);
            const t = matched[id] ? tokenOf(id) : null;
            return (
              <li key={id}>
                <button
                  type="button"
                  data-kid-target
                  data-image={id}
                  onClick={() => pickImage(id)}
                  aria-label={t ? `${s.name}, đã nối` : `Hình ${i + 1}`}
                  className={`relative flex w-full flex-col overflow-hidden rounded-card border-4 bg-white shadow-md transition active:scale-95 ${
                    selected ? "" : "opacity-80"
                  } ${wrongImage === id ? "animate-wiggle" : ""}`}
                  style={{ borderColor: t ? t.color : "#fff" }}
                >
                  <span className="block aspect-square w-full p-2">
                    <SoundArt image={s.image} />
                  </span>
                  {t && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-1" style={{ background: t.soft }}>
                      <Dots n={t.dots} color={t.color} />
                    </span>
                  )}
                  <span className="flex min-h-10 items-center justify-center px-1 text-center font-display font-bold text-[var(--g-ink)]">{t ? s.name : ""}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
