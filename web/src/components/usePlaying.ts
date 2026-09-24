"use client";

import { useSyncExternalStore } from "react";
import { getCurrent, subscribe } from "@/lib/audio";

// The src of the sound playing right now (null when silent).
export function usePlaying(): string | null {
  return useSyncExternalStore(subscribe, getCurrent, () => null);
}
