"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Top progress bar for internal link navigations (.nav-bar in motion/loading.css).
// Not a loading.tsx on purpose: its Suspense boundary makes the static HTML paint
// a fallback before the (large) page. Starts on the click, trickles towards 90 %,
// completes and fades when the path changes (gives up after 10 s).
export default function NavPending() {
  const path = usePathname();
  const [from, setFrom] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0); // new element per run: never shrinks back from a finished bar
  if (from !== null && from !== path) {
    setFrom(null);
    setDone(true);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]");
      if (a instanceof HTMLAnchorElement && !a.target && !a.hasAttribute("download") && a.origin === location.origin && a.pathname !== location.pathname) {
        setFrom(path);
        setDone(false);
        setRun((r) => r + 1);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [path]);

  useEffect(() => {
    if (from === null) return;
    const giveUp = setTimeout(() => {
      setFrom(null);
      setDone(true);
    }, 10000);
    return () => clearTimeout(giveUp);
  }, [from]);

  useEffect(() => {
    if (!done) return;
    const idle = setTimeout(() => setDone(false), 700); // after the fade-out
    return () => clearTimeout(idle);
  }, [done]);

  return <div key={run} aria-hidden className="nav-bar no-print" data-state={from !== null ? "loading" : done ? "done" : "idle"} />;
}
