import Icon from "@/components/Icon";
import SoundBars from "@/components/SoundBars";

// A sound "token": told apart by colour AND number of dots (children can't read).
// Used by the matching game and as "tiếng thứ nhất / thứ hai" in the compare game.
export const TOKENS = [
  { color: "#2f6fb0", soft: "#dceffe", dots: 1 },
  { color: "#c2552a", soft: "#fde6d6", dots: 2 },
  { color: "#7a4fc4", soft: "#eee4fc", dots: 3 },
  { color: "#2e7d6b", soft: "#e5f8f2", dots: 4 },
];

export function Dots({ n, color }: { n: number; color: string }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="size-2.5 rounded-full" style={{ background: color }} />
      ))}
    </span>
  );
}

// icon={false}: answer tiles (compare game) must not look like a "tap to listen" speaker.
export default function SoundToken({
  index,
  playing = false,
  done = false,
  icon = true,
  className = "",
}: {
  index: number;
  playing?: boolean;
  done?: boolean;
  icon?: boolean;
  className?: string;
}) {
  const t = TOKENS[index];
  return (
    <span
      className={`flex flex-col items-center justify-center gap-1 rounded-full border-4 shadow-md ${playing ? "is-playing" : ""} ${className}`}
      style={{ background: t.soft, borderColor: t.color, color: t.color }}
      aria-hidden
    >
      {done ? <Icon name="check" className="size-[38%]" /> : playing ? <SoundBars className="h-[30%]" /> : icon && <Icon name="volume" className="size-[40%]" />}
      <Dots n={t.dots} color={t.color} />
    </span>
  );
}
