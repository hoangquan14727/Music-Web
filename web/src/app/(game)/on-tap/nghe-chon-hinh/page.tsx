import type { Metadata } from "next";
import { Suspense } from "react";
import { ListenChooseGame } from "@/components/game/Games";

export const metadata: Metadata = { title: "Nghe – chọn hình" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ListenChooseGame />
    </Suspense>
  );
}
