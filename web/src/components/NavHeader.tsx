"use client";

import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Logo from "./Logo";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Trang chủ", icon: "home" },
  { href: "/chu-de/", label: "Các chủ đề", icon: "topics" },
  { href: "/on-tap/", label: "Ôn tập", icon: "review" },
  { href: "/thu-vien-nhac/", label: "Thư viện nhạc", icon: "music" },
  { href: "/goc-giao-vien/", label: "Góc giáo viên", icon: "teacher" },
  { href: "/goc-sinh-vien/", label: "Góc sinh viên", icon: "student" },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

// next/form: goes to /chu-de/?q=… without a page reload (music keeps playing);
// still a plain GET form when JS is off.
export function SearchForm({ className = "", defaultValue, onSearch }: { className?: string; defaultValue?: string; onSearch?: () => void }) {
  const id = useId();
  return (
    <Form action="/chu-de/" role="search" onSubmit={onSearch} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Tìm kiếm âm thanh
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Tìm kiếm âm thanh..."
        className="h-11 w-full rounded-full border border-line bg-white pl-4 pr-11 text-sm text-ink placeholder:text-muted"
      />
      <button type="submit" aria-label="Tìm" className="absolute right-1 top-1 grid size-9 place-items-center rounded-full text-muted hover:text-ink">
        <Icon name="search" className="size-5" />
      </button>
    </Form>
  );
}

export default function NavHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-header/95 backdrop-blur no-print">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo className="h-12 w-auto" />
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold text-blue">Thế giới</span>
            <span className="block font-display text-xl font-extrabold text-pink">Âm thanh</span>
            <span className="mt-0.5 hidden text-[0.7rem] text-muted sm:block">Lắng nghe - Khám phá - Phát triển</span>
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
                    className={`flex h-16 flex-col items-center justify-center gap-1 border-b-[3px] px-3 text-sm font-semibold transition-colors ${
                      active ? "border-pink text-pink-dark" : "border-transparent text-muted hover:text-ink"
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
        <Link
          href="/chu-de/#tim-kiem"
          className="hidden size-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-sm lg:grid xl:hidden"
          aria-label="Tìm kiếm âm thanh"
          title="Tìm kiếm âm thanh"
        >
          <Icon name="search" className="size-5" />
        </Link>

        <Link
          href="/gioi-thieu/"
          className="hidden size-11 shrink-0 place-items-center rounded-full border-2 border-white bg-pink-soft text-pink-dark shadow lg:grid"
          aria-label="Giới thiệu dự án"
          title="Giới thiệu dự án"
        >
          <Icon name="info" className="size-5" />
        </Link>

        <button
          type="button"
          className="ml-auto grid size-12 place-items-center rounded-full bg-white text-ink shadow-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Icon name="close" className="size-6" /> : <Icon name="menu" className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          <SearchForm className="my-3" onSearch={() => setOpen(false)} />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[...NAV, { href: "/gioi-thieu/", label: "Giới thiệu", icon: "info" as IconName }].map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(path, href) ? "page" : undefined}
                  className={`flex min-h-14 items-center gap-2 rounded-2xl px-3 font-semibold ${
                    isActive(path, href) ? "bg-pink-soft text-pink-dark" : "bg-page text-ink"
                  }`}
                >
                  <Icon name={icon} className="size-5 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
