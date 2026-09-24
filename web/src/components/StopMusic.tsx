"use client";

import { useEffect } from "react";
import { pauseMusic } from "@/lib/music";

export default function StopMusic() {
  useEffect(() => pauseMusic(), []);
  return null;
}
