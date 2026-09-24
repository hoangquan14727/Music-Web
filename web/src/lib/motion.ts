import { useEffect, useState, useSyncExternalStore } from "react";

// Site setting (footer toggle), not the OS reduced-motion flag: many school PCs
// report it, and effects must run there. The <head> script in app/layout.tsx
// sets data-motion="off" on <html> before first paint; globals.css keys on it.
const KEY = "tgat-motion";

// SSR-safe: false (effects on) on the server.
export function motionOff(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "off";
}

function subscribe(onChange: () => void) {
  const o = new MutationObserver(onChange);
  o.observe(document.documentElement, { attributeFilter: ["data-motion"] });
  return () => o.disconnect();
}

// For JS effects (count-ups…). False (effects on) on the server and during hydration.
export function useMotionOff(): boolean {
  return useSyncExternalStore(subscribe, motionOff, () => false);
}

// Saved per browser; storage write before the attribute (the <head> script re-adds it from storage).
export function setMotion(on: boolean) {
  try {
    if (on) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, "off");
  } catch {}
  if (on) delete document.documentElement.dataset.motion;
  else document.documentElement.dataset.motion = "off";
}

// onPointerDown={ripple}: one-shot ripple at the pointer inside currentTarget,
// which needs the .ripple-host class (relative + overflow-hidden).
export function ripple(e: { currentTarget: Element; clientX: number; clientY: number }) {
  if (motionOff()) return;
  const host = e.currentTarget;
  const r = host.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const s = document.createElement("span");
  s.className = "ripple";
  s.setAttribute("aria-hidden", "true");
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  s.addEventListener("animationend", () => s.remove(), { once: true });
  host.appendChild(s);
}

// Exit animations for conditionally rendered UI: keeps it mounted `ms` after
// `open` turns false, with leaving = true meanwhile (put an animate-*-out class on it).
export function usePresence(open: boolean, ms = 240): { mounted: boolean; leaving: boolean } {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), motionOff() ? 0 : ms);
    return () => clearTimeout(t);
  }, [open, mounted, ms]);
  return { mounted: open || mounted, leaving: mounted && !open };
}
