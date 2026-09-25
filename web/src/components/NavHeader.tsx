"use client";

import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Logo from "./Logo";
import AccountMenu, { AccountPanel } from "./AccountMenu";
import { motionOff } from "@/lib/motion";
import { HOME } from "@/lib/auth-paths";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: HOME, label: "Trang chủ", icon: "home" },
  { href: "/chu-de/", label: "Các chủ đề", icon: "topics" },
  { href: "/on-tap/", label: "Ôn tập", icon: "review" },
  { href: "/thu-vien-nhac/", label: "Thư viện nhạc", icon: "music" },
  { href: "/goc-giao-vien/", label: "Góc giáo viên", icon: "teacher" },
  { href: "/goc-sinh-vien/", label: "Góc sinh viên", icon: "student" },
];

const isActive = (path: string, href: string) => path.startsWith(href);

// next/form: goes to /chu-de/?q=… without a page reload (music keeps playing);
// still a plain GET form when JS is off.
export function SearchForm({ className = "", defaultValue, onSearch }: { className?: string; defaultValue?: string; onSearch?: () => void }) {
  const id = useId();
  return (
    <Form action="/chu-de/" role="search" onSubmit={onSearch} className={`group relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Tìm kiếm âm thanh
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Tìm kiếm âm thanh..."
        className="h-11 w-full rounded-full border border-line bg-white pl-4 pr-11 text-sm text-ink transition-[border-color,box-shadow] duration-300 ease-soft placeholder:text-muted focus:border-blue/40 focus:shadow-[0_0_0_6px_rgb(47_111_176/0.14)]"
      />
      <button
        type="submit"
        aria-label="Tìm"
        className="absolute right-1 top-1 grid size-9 place-items-center rounded-full text-muted transition-[scale,color] duration-300 ease-bounce hover:text-ink active:scale-90 group-focus-within:text-blue"
      >
        <Icon name="search" className="size-5 transition-[rotate,scale] duration-300 ease-bounce group-focus-within:-rotate-12 group-focus-within:scale-115" />
      </button>
    </Form>
  );
}

const ROUND = "hidden size-11 shrink-0 place-items-center rounded-full transition-[translate,scale] duration-300 ease-bounce hover:-translate-y-0.5 active:scale-90 lg:grid";

export default function NavHeader() {
  const path = usePathname();
  // "closing" = sliding away after the toggle. Links and search close at once,
  // so the page transition never snapshots a half-closed menu.
  const [menu, setMenu] = useState<"closed" | "open" | "closing">("closed");
  const open = menu === "open";
  const close = () => setMenu("closed");
  const burger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (menu !== "closing") return;
    const t = setTimeout(() => setMenu("closed"), 200);
    return () => clearTimeout(t);
  }, [menu]);

  return (
    <header
      className="chrome-header sticky top-0 z-40 border-b border-line/60 bg-header/95 backdrop-blur no-print"
      style={{ viewTransitionName: "site-header" }}
      // The menu overlays the page: Escape closes it (focus back on the burger), and tabbing
      // out of it closes it so focus never lands on controls hidden underneath.
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          close();
          burger.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
        <Link href={HOME} className="chrome-logo flex shrink-0 items-center gap-2">
          <Logo className="h-12 w-auto" />
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold text-blue">Thế giới</span>
            <span className="block font-display text-xl font-extrabold text-pink">Âm thanh</span>
            <span className="mt-0.5 hidden text-[0.7rem] text-muted sm:block lg:hidden xl:block">Lắng nghe - Khám phá - Phát triển</span>
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="ml-auto hidden lg:block">
          <ul className="flex items-stretch gap-1">
            {NAV.map(({ href, label, icon }) => {
              const active = isActive(path, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`chrome-navlink chrome-hop flex h-16 flex-col items-center justify-center gap-1 border-b-[3px] border-transparent px-3 text-sm font-semibold transition-colors ${
                      active ? "text-pink-dark" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon name={icon} className="size-6" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <SearchForm className="ml-2 hidden w-56 xl:block" />
        {/* 1024–1279 px (iPad landscape): no room for the box, link to the one on /chu-de. */}
        <Link href="/chu-de/#tim-kiem" className={`chrome-hop bg-white text-ink shadow-sm xl:hidden ${ROUND}`} aria-label="Tìm kiếm âm thanh" title="Tìm kiếm âm thanh">
          <Icon name="search" className="size-5" />
        </Link>

        <Link href="/gioi-thieu/" className={`chrome-hop border-2 border-white bg-pink-soft text-pink-dark shadow ${ROUND}`} aria-label="Giới thiệu dự án" title="Giới thiệu dự án">
          <Icon name="info" className="size-5" />
        </Link>

        <AccountMenu />

        <button
          ref={burger}
          type="button"
          className="chrome-burger ml-auto grid size-12 place-items-center rounded-full bg-white text-ink shadow-sm transition-[scale,background-color,color] duration-300 ease-bounce active:scale-90 aria-expanded:bg-pink-soft aria-expanded:text-pink-dark lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenu((m) => (m !== "open" ? "open" : motionOff() ? "closed" : "closing"))}
        >
          {/* Three bars that fold into an ×. */}
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true" focusable="false" className="size-6">
            <path d="M4.5 6.5h15" />
            <path d="M4.5 12h15" />
            <path d="M4.5 17.5h15" />
          </svg>
        </button>
      </div>

      {/* Drops over the page instead of pushing it down. */}
      {menu !== "closed" && (
        <div
          id="mobile-menu"
          inert={menu === "closing"}
          className={`absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-3xl bg-white px-4 pb-4 shadow-lg lg:hidden ${
            menu === "closing" ? "chrome-menu-out" : "chrome-menu-in"
          }`}
        >
          <SearchForm className="my-3 animate-fade-down [animation-duration:.4s]" onSearch={close} />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" style={{ "--stagger": "40ms" } as React.CSSProperties}>
            {[...NAV, { href: "/gioi-thieu/", label: "Giới thiệu", icon: "info" as IconName }].map(({ href, label, icon }, i) => (
              <li key={href} className="animate-fade-down [animation-duration:.4s]" style={{ "--i": i + 1 } as React.CSSProperties}>
                <Link
                  href={href}
                  onClick={close}
                  aria-current={isActive(path, href) ? "page" : undefined}
                  className={`chrome-hop flex min-h-14 items-center gap-2 rounded-2xl px-3 font-semibold transition-[scale,background-color] duration-200 ease-bounce active:scale-95 ${
                    isActive(path, href) ? "bg-pink-soft text-pink-dark" : "bg-page text-ink hover:bg-sky/50"
                  }`}
                >
                  <Icon name={icon} className="size-5 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 animate-fade-down border-t border-line pt-3 [animation-duration:.4s]" style={{ "--i": NAV.length + 2, "--stagger": "40ms" } as React.CSSProperties}>
            <AccountPanel onNavigate={close} />
          </div>
        </div>
      )}
    </header>
  );
}
