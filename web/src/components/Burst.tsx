"use client";

import { useEffect, useState } from "react";

export type BurstVariant = "confetti" | "stars" | "sparkles" | "notes";
type Props = {
  /** Fires on mount when truthy; a new value replays it (e.g. a counter). */
  trigger?: string | number | boolean | null;
  variant?: BurstVariant;
  count?: number;
  /** Flight distance in px. */
  spread?: number;
  className?: string;
};

const COLORS = ["#d6336c", "#2f6fb0", "#f59e0b", "#2e7d6b", "#7a4fc4", "#f9a8bf"];
const GLYPHS: Record<BurstVariant, string[]> = { confetti: [""], stars: ["★"], sparkles: ["✦", "✧"], notes: ["♪", "♫", "♩"] };

// Seeded by the trigger, so server and client render the same particles.
function seeded(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function particles(seed: string, variant: BurstVariant, count: number, spread: number) {
  const rnd = seeded(`${variant}:${seed}`);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
  return Array.from({ length: count }, () => {
    // Notes rise in an upward cone; the rest fly all around.
    const angle = variant === "notes" ? -Math.PI / 2 + (rnd() - 0.5) * 2.2 : rnd() * Math.PI * 2;
    const d = spread * (0.45 + rnd() * 0.55);
    const spin = variant === "confetti" ? 540 : variant === "notes" ? 50 : 160;
    return {
      glyph: pick(GLYPHS[variant]),
      style: {
        "--tx": `${Math.round(Math.cos(angle) * d)}px`,
        "--ty": `${Math.round(Math.sin(angle) * d * (variant === "confetti" ? 0.8 : 1) - (variant === "confetti" ? spread * 0.25 : 0))}px`,
        "--r": `${Math.round((rnd() - 0.5) * spin)}deg`,
        "--s": (0.8 + rnd() * 0.5).toFixed(2),
        "--c": pick(COLORS),
        "--size": `${Math.round(14 + rnd() * 12)}px`,
        "--delay": `${Math.round(rnd() * 120)}ms`,
        "--fall": variant === "confetti" ? "48px" : variant === "notes" ? "-24px" : "8px",
      } as React.CSSProperties,
    };
  });
}

function Particles({ seed, variant = "confetti", count = 18, spread = 140, className = "" }: Omit<Props, "trigger"> & { seed: string }) {
  const [done, setDone] = useState(false);
  // Timer, not animationend: with effects off no animation ends, and a hidden burst
  // would otherwise wait and fire when effects are switched back on.
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1200);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <span aria-hidden className={`burst burst-${variant} ${className}`}>
      {particles(seed, variant, count, spread).map((p, i) => (
        <span key={i} style={p.style}>
          {p.glyph}
        </span>
      ))}
    </span>
  );
}

// One-shot celebratory particles. Put it inside a `relative` parent; it covers
// that parent (pointer-events none), flies from its centre, then unmounts.
// Hidden with effects off and in print (CSS).
export default function Burst({ trigger, ...rest }: Props) {
  if (!trigger) return null; // 0 / false / null: nothing yet
  const seed = String(trigger);
  return <Particles key={seed} seed={seed} {...rest} />;
}
