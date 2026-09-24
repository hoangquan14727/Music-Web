// Music-library player: its own <audio> element ("music channel"), separate from
// sound effects. Keeps playing while the teacher browses the site; pauses when
// any sound effect or game sound starts, and when a game screen opens.
import { EFFECT_EVENT } from "./audio";

export type MusicTrack = { id: string; title: string; audio: string; use: string; cover?: string | null };
export type MusicState = { queue: MusicTrack[]; index: number; playing: boolean; loop: boolean; time: number; duration: number };

let el: HTMLAudioElement | null = null;
let state: MusicState = { queue: [], index: 0, playing: false, loop: false, time: 0, duration: 0 };
const listeners = new Set<() => void>();

function set(patch: Partial<MusicState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function audio(): HTMLAudioElement {
  if (!el) {
    el = new Audio();
    el.preload = "metadata";
    el.addEventListener("play", () => set({ playing: true }));
    el.addEventListener("pause", () => set({ playing: false }));
    el.addEventListener("timeupdate", () => set({ time: el!.currentTime }));
    el.addEventListener("loadedmetadata", () => set({ duration: el!.duration || 0 }));
    el.addEventListener("ended", () => {
      if (state.loop) {
        el!.currentTime = 0;
        el!.play().catch(() => {});
      } else if (state.index + 1 < state.queue.length) next();
      else set({ playing: false, time: 0 });
    });
    window.addEventListener(EFFECT_EVENT, pauseMusic);
  }
  return el;
}

function load(index: number) {
  const a = audio();
  a.src = state.queue[index].audio;
  set({ index, time: 0, duration: 0 });
  a.play().catch(() => set({ playing: false }));
}

export function playTrack(queue: MusicTrack[], index: number) {
  set({ queue });
  load(index);
}
export function toggleMusic() {
  const a = audio();
  if (a.paused) a.play().catch(() => {});
  else a.pause();
}
export function next() {
  if (state.index + 1 < state.queue.length) load(state.index + 1);
}
export function prev() {
  if (el && el.currentTime > 3) el.currentTime = 0;
  else if (state.index > 0) load(state.index - 1);
}
export function seek(t: number) {
  if (el) el.currentTime = t;
}
export function setLoop(loop: boolean) {
  set({ loop });
}
export function pauseMusic() {
  el?.pause();
}
export function closeMusic() {
  el?.pause();
  set({ queue: [], index: 0, playing: false, time: 0, duration: 0 });
}

export function subscribeMusic(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export const getMusic = () => state;
const EMPTY = state;
export const getMusicServer = () => EMPTY;
