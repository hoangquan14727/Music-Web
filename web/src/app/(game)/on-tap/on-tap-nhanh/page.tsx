import type { Metadata } from "next";
import { QuickReviewGame } from "@/components/game/Games";

export const metadata: Metadata = { title: "Ôn tập nhanh" };

export default function Page() {
  return (
    <QuickReviewGame />
  );
}
