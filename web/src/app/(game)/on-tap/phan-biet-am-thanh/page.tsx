import type { Metadata } from "next";
import { CompareGame } from "@/components/game/Games";

export const metadata: Metadata = { title: "Phân biệt âm thanh" };

export default function Page() {
  return (
    <CompareGame />
  );
}
