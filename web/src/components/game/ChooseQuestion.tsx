"use client";

import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/audio";
import type { ItemResult, Question } from "@/lib/quiz";
import { sounds, type Sound } from "@/lib/data";
import SoundArt from "@/components/SoundArt";
import SoundBars from "@/components/SoundBars";
import Icon from "@/components/Icon";

const REVEAL_AFTER_MS = 6500; // pictures appear when the sound ends, or after 6.5 s at most (clips run ~5 s)
const byId = (id: string) => sounds.find((s) => s.id === id) as Sound;
const COLS: Record<number, string> = { 2: "grid-cols-2 max-w-2xl", 3: "grid-cols-3 max-w-4xl", 4: "grid-cols-2 max-w-2xl lg:grid-cols-4 lg:max-w-5xl" };

// "Nghe trước, chọn sau": the prompt sound plays first, pictures come after.
// Wrong → "Thử lại nhé!" + hear it again; only the first tap counts for the score.
export default function ChooseQuestion({ question, onDone }: { question: Question; onDone: (r: ItemResult) => void }) {
  const [revealed, setRevealed] = useState(false);
  const [listening, setListening] = useState(true); // the prompt starts on mount
  const [audioFailed, setAudioFailed] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const locked = useRef(false); // one answer per burst of little fingers
  const firstPick = useRef<string | null>(null);
  const run = useRef(0);
  const answer = byId(question.answerId);

  // Starts the prompt; state changes happen only in async callbacks.
  function startPrompt() {
    const id = ++run.current;
    const timer = setTimeout(() => id === run.current && setRevealed(true), REVEAL_AFTER_MS);
    play(answer.audio).then((r) => {
      if (id !== run.current) return;
      if (r === "stopped") return setListening(false); // stopped from outside (screen locked…); timer still reveals
      clearTimeout(timer);
      setListening(false);
      setRevealed(true);
      if (r === "error") setAudioFailed(true);
    });
  }

  function playPrompt() {
    setListening(true);
    setAudioFailed(false);
    startPrompt();
  }

  useEffect(() => {
    startPrompt();
    const r = run;
    return () => {
      r.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(id: string) {
    if (locked.current || !revealed || solved) return;
    locked.current = true;
    firstPick.current ??= id;
    if (id === question.answerId) {
      run.current++;
      setSolved(true);
      setWrong(null);
      setListening(false);
      play("/audio/fx/dung.mp3");
      onDone({ correct: firstPick.current === question.answerId ? 1 : 0, total: 1 });
      return; // stays locked: the teacher moves on
    }
    setWrong(id);
    play("/audio/fx/thu-lai.mp3").then((r) => {
      if (r !== "stopped") playPrompt();
      locked.current = false;
    });
  }

  return (
    <>
      <div className="flex min-h-24 items-center gap-4">
        <button
          type="button"
          data-kid-target
          data-testid="replay"
          onClick={() => playPrompt()}
          aria-label="Nghe lại"
          className={`grid size-24 place-items-center rounded-full bg-white text-[var(--g-ink)] shadow-lg ring-4 ring-[var(--g-accent)] active:scale-95 ${listening ? "is-playing" : ""}`}
        >
          {listening ? <SoundBars className="h-10 [&>span]:h-10 [&>span]:w-2" /> : <Icon name="volume" className="size-12" />}
        </button>
        <p className="font-display text-2xl font-bold text-[var(--g-ink)]" aria-live="polite">
          {solved ? "Giỏi quá!" : wrong ? "Thử lại nhé!" : listening ? "Lắng nghe nào…" : "Chạm vào hình đúng!"}
        </p>
      </div>

      {audioFailed && <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-900">Chưa phát được âm thanh. Cô chạm nút loa để nghe lại nhé.</p>}

      {revealed ? (
        <ul className={`grid w-full gap-3 sm:gap-6 ${COLS[question.optionIds.length] ?? COLS[3]}`} aria-label="Chọn hình">
          {question.optionIds.map((id, i) => {
            const s = byId(id);
            const isAnswer = solved && id === question.answerId;
            return (
              <li key={id} className="animate-pop">
                <button
                  type="button"
                  data-kid-target
                  data-option={id}
                  onClick={() => choose(id)}
                  aria-label={isAnswer ? s.name : `Hình ${i + 1}`}
                  className={`flex w-full flex-col overflow-hidden rounded-card border-4 bg-white shadow-md transition-transform active:scale-95 ${
                    isAnswer ? "border-emerald-500 ring-8 ring-emerald-300" : "border-white"
                  } ${wrong === id ? "animate-wiggle opacity-70" : ""} ${solved && !isAnswer ? "opacity-50" : ""}`}
                >
                  <span className="block aspect-square w-full p-2">
                    <SoundArt image={s.image} />
                  </span>
                  <span className="flex min-h-12 items-center justify-center px-1 text-center font-display text-lg font-bold text-[var(--g-ink)]">
                    {isAnswer ? s.name : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/mascot/listening.webp" alt="" className="my-auto size-56 animate-pulse" draggable={false} />
      )}
    </>
  );
}
