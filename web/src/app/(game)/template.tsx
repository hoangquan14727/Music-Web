"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

// Page enter/exit animation (vt-page-* in globals.css). Keyed by path so
// deeper navigations (/chu-de/ -> /chu-de/x/) animate too; ?q= changes don't.
export default function Template({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <ViewTransition key={path} enter="vt-page-in" exit="vt-page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
