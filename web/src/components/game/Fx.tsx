"use client";

import { useEffect, useState } from "react";
import { useMotionOff } from "@/lib/motion";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
const COLORS = ["#d6336c", "#2f6fb0", "#f59e0b", "#2e7d6b", "#7a4fc4", "#f9a8bf"];

// Feedback text, re-mounted per message so its entrance replays:
// cheers pop, "try again"/hints shake softly, the rest fade up.
export function Say({ text }: { text: string }) {
  const fx = /^(Giỏi quá|Đúng rồi)/.test(text) ? "animate-pop-in" : /^(Thử lại|Chạm vào chiếc loa trước)/.test(text) ? "game-retry" : "animate-fade-up";
  return (
    <span key={text} className={`inline-block ${fx}`}>
      {text}
    </span>
  );
}

// One-shot confetti rain (~2 s), deterministic; hidden with effects off and in print (games.css).
export function ConfettiRain({ count = 28 }: { count?: number }) {
  return (
    <div aria-hidden className="game-rain">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={
            {
              left: `${(i * 37 + 3) % 100}%`,
              "--c": COLORS[i % COLORS.length],
              "--delay": `${(i * 73) % 550}ms`,
              "--dur": `${1400 + ((i * 131) % 700)}ms`,
              "--fx": `${((i * 29) % 60) - 30}px`,
              "--fr": `${(i % 2 ? 1 : -1) * (160 + ((i * 47) % 200))}deg`,
            } as Vars
          }
        />
      ))}
    </div>
  );
}

const STAR = "M12 2.6 14.9 8.4 21.2 9.3 16.6 13.8 17.7 20.1 12 17.1 6.3 20.1 7.4 13.8 2.8 9.3 9.1 8.4Z";

// Three gold stars, always all three: the result celebrates effort, never failure.
export function ResultStars() {
  return (
    <span aria-hidden className="pointer-events-none flex items-end gap-2">
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={`game-star drop-shadow-sm ${i === 1 ? "size-16 -translate-y-2" : "size-12"}`} style={{ "--i": i } as Vars}>
          <path d={STAR} fill="#f59e0b" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

// Decorative score sticker that counts up (final value at once with effects off).
// The h1 carries the real, final text.
export function ScoreBadge({ correct, total, className = "" }: { correct: number; total: number; className?: string }) {
  const still = useMotionOff();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (still) return;
    const t0 = performance.now() + 450;
    let raf = requestAnimationFrame(function tick(t) {
      const k = Math.min(1, Math.max(0, (t - t0) / 1000));
      setN(Math.round(k * correct));
      if (k < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [still, correct]);
  return (
    <span
      aria-hidden
      className={`pointer-events-none animate-bounce-in rounded-full bg-white px-3 py-1 font-display text-2xl font-bold text-pink shadow-md ring-4 ring-pink-soft [--i:4] ${className}`}
    >
      {still ? correct : n}/{total}
    </span>
  );
}
