"use client";

import Icon from "./Icon";
import { setMotion, useMotionOff } from "@/lib/motion";

// Switch for every effect on the site (saved in this browser, so every page follows
// it). Pressed = effects off. Renders "on" until hydrated. light: on pale pages
// (game intro/result, 404) instead of the dark footer.
export default function MotionToggle({ light = false }: { light?: boolean }) {
  const off = useMotionOff();
  const look = light
    ? off
      ? "border-transparent bg-ink text-white"
      : "border-transparent bg-white/80 text-muted hover:bg-white hover:text-ink"
    : off
      ? "border-white/80 bg-white text-footer"
      : "border-white/80 text-white hover:bg-white/10"; // /10 keeps white text ≥ 4.5:1 on hover
  return (
    <button
      type="button"
      aria-pressed={off}
      onClick={() => setMotion(off)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors ${look}`}
    >
      <Icon name={off ? "check" : "star"} className="size-5" />
      Tắt hiệu ứng
    </button>
  );
}
