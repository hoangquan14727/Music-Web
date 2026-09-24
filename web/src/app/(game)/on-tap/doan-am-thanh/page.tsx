import type { Metadata } from "next";
import { GuessGame } from "@/components/game/Games";

export const metadata: Metadata = { title: "Đoán âm thanh" };

export default function Page() {
  return (
    <GuessGame />
  );
}
