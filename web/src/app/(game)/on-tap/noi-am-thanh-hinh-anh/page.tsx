import type { Metadata } from "next";
import { MatchGame } from "@/components/game/Games";

export const metadata: Metadata = { title: "Nối âm thanh – hình ảnh" };

export default function Page() {
  return (
    <MatchGame />
  );
}
