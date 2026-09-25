"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { ROLE, displayName, initials, signOut, useSession } from "@/lib/auth";

const ITEM = "flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 text-center text-sm font-semibold transition-[scale,background-color] duration-200 ease-bounce active:scale-95";

// Name, role, email and the two account actions. Shared by the desktop menu and the mobile menu.
export function AccountPanel({ onNavigate }: { onNavigate?: () => void }) {
  const session = useSession();
  const [leaving, setLeaving] = useState(false);
  const name = session ? displayName(session) : "";
  const email = session?.user.email;
  const r = session?.user.user_metadata?.role;
  const role = Object.hasOwn(ROLE, r) ? ROLE[r as keyof typeof ROLE] : ""; // metadata is user-editable
  return (
    <div className="grid gap-3">
      {session && (
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-blue font-display text-xl font-bold text-white">
            {initials(name)}
          </span>
          <div className="min-w-0 leading-snug">
            <p className="truncate font-bold text-ink">{name}</p>
            {role && <p className="text-sm font-semibold text-pink-dark">{role}</p>}
            {email && email !== name && <p className="truncate text-sm text-muted">{email}</p>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Link href="/dat-lai-mat-khau/?doi=1" onClick={onNavigate} className={`bg-page text-ink hover:bg-sky/50 ${ITEM}`}>
          Đổi mật khẩu
        </Link>
        <button
          type="button"
          disabled={leaving}
          aria-busy={leaving}
          onClick={() => {
            setLeaving(true);
            signOut(); // leaves the page (≤ 3 s)
          }}
          className={`chrome-hop bg-pink-soft text-pink-dark hover:bg-[#fde0ea] disabled:opacity-60 ${ITEM}`}
        >
          <Icon name="logout" className="size-5 shrink-0" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

// Desktop account button: initials avatar that opens the panel. Closes on Escape,
// on a click outside and when focus leaves it.
export default function AccountMenu() {
  const session = useSession();
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      const d = ref.current;
      if (d?.open && !d.contains(e.target as Node)) d.open = false;
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  return (
    <details
      ref={ref}
      className="group relative hidden shrink-0 no-print lg:block"
      onKeyDown={(e) => {
        if (e.key === "Escape" && e.currentTarget.open) {
          close();
          e.currentTarget.querySelector("summary")?.focus();
        }
      }}
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <summary
        aria-label="Tài khoản"
        title="Tài khoản"
        className={`grid size-11 cursor-pointer list-none place-items-center rounded-full border-2 border-white font-display text-lg font-bold text-white shadow transition-[translate,scale,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 active:scale-90 group-open:ring-4 group-open:ring-pink-soft [&::-webkit-details-marker]:hidden ${
          session ? "bg-blue" : "bg-line"
        }`}
      >
        <span aria-hidden>{session ? initials(displayName(session)) : ""}</span>
      </summary>
      <div className="absolute right-0 top-full mt-3 w-80 animate-fade-down rounded-3xl bg-white p-4 shadow-lg ring-1 ring-line [animation-duration:.3s]">
        <AccountPanel onNavigate={close} />
      </div>
    </details>
  );
}
