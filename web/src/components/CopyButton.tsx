"use client";

import { useState } from "react";
import Icon from "./Icon";

// "Sao chép" for long addresses (school emails); says "Đã chép!" for 2 s.
export default function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {} // no clipboard (old browser, http): the address stays selectable
  };
  return (
    <button type="button" onClick={copy} className={className}>
      <Icon name={done ? "check" : "copy"} className="size-5" />
      <span aria-live="polite">{done ? "Đã chép!" : "Sao chép"}</span>
    </button>
  );
}
