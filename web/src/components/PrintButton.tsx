"use client";

import Icon from "./Icon";

// "Tải/in": the browser's print dialog also offers "Save as PDF".
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2e7d6b] px-5 font-bold text-white shadow active:scale-95"
    >
      <Icon name="printer" className="size-5" /> In / lưu PDF
    </button>
  );
}
