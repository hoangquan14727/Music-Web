"use client";

import { useEffect, useRef } from "react";
import { motionOff } from "@/lib/motion";

// The hero <section>, plus a soft mouse parallax: sets --px/--py (-1..1) that
// .home-par layers turn into a few px of `translate`. Mouse only (fine pointer
// + hover), rAF-throttled, off (layers at rest) with effects off.
export default function HeroParallax(props: React.ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (motionOff()) return leave();
      const r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      queue();
    };
    const leave = () => {
      x = y = 0;
      queue();
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <section {...props} ref={ref} />;
}
