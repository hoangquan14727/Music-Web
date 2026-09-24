// One shared <audio> element for every sound effect on the site.
// - A new sound stops the previous one (no overlapping sounds) and pauses music.
// - unlock() (or play()) must run synchronously inside a tap handler once;
//   after that iOS/Chrome allow this same element to play again (game autoplay).
// - HTMLAudioElement, not Web Audio: the iPhone silent switch mutes Web Audio.
type Result = "ended" | "error" | "stopped";
type Listener = (src: string | null) => void;

let el: HTMLAudioElement | null = null;
let current: string | null = null;
let settle: ((r: Result) => void) | null = null;
let playCount = 0;
const listeners = new Set<Listener>();

function audio(): HTMLAudioElement {
  if (!el) {
    el = new Audio();
    el.preload = "auto";
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
    });
  }
  return el;
}

function setCurrent(src: string | null) {
  current = src;
  if (src) document.documentElement.dataset.playing = src;
  else delete document.documentElement.dataset.playing;
  listeners.forEach((l) => l(src));
}

export const EFFECT_EVENT = "tgat:effect";

// Call from the "Bắt đầu" tap: plays a tiny silent file so later plays started
// from effects/timers (next question) are allowed on iOS Safari too.
export function unlock() {
  if (current) return;
  const a = audio();
  a.src = "/audio/fx/silence.mp3";
  a.play().catch(() => {});
}

export function play(src: string): Promise<Result> {
  const a = audio();
  settle?.("stopped");
  playCount++;
  window.dispatchEvent(new Event(EFFECT_EVENT));
  return new Promise((resolve) => {
    const done = (r: Result) => {
      if (settle !== done) return;
      settle = null;
      a.onended = a.onerror = null;
      setCurrent(null);
      resolve(r);
    };
    settle = done;
    a.onended = () => done("ended");
    a.onerror = () => done("error");
    a.src = src;
    setCurrent(src);
    a.play().catch(() => done("error"));
  });
}

export function stop() {
  playCount++; // also cancels a playSequence waiting in its pause
  el?.pause();
  settle?.("stopped");
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Two sounds with a clear pause, so children don't hear one long sound.
export async function playSequence(srcs: string[], gapMs = 900): Promise<Result> {
  let r: Result = "ended";
  for (let i = 0; i < srcs.length && r === "ended"; i++) {
    if (i) {
      const before = playCount;
      await wait(gapMs);
      if (playCount !== before) return "stopped"; // another sound started during the pause
    }
    r = await play(srcs[i]);
  }
  return r;
}

// Warm the HTTP cache for a game round so prompts start without network lag.
export function preload(srcs: string[]) {
  srcs.forEach((s) => fetch(s).catch(() => {}));
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getCurrent(): string | null {
  return current;
}
