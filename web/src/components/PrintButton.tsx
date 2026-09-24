"use client";

import Icon from "./Icon";
import { ripple } from "@/lib/motion";

// "Tải/in": the browser's print dialog also offers "Save as PDF".
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      onPointerDown={ripple}
      className="chrome-hop ripple-host no-print inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2e7d6b] px-5 font-bold text-white shadow transition-[translate,scale,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <Icon name="printer" className="size-5" /> In / lưu PDF
    </button>
  );
}
