"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import Logo from "./Logo";
import { useSession } from "@/lib/auth";
import { HOME, norm } from "@/lib/auth-paths";

const BTN = "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border-2 px-3 text-sm font-bold transition-[translate,scale,background-color] duration-300 ease-bounce hover:-translate-y-0.5 active:scale-95 sm:px-5";
const PINK = `border-pink bg-pink text-white shadow hover:bg-pink-dark ${BTN}`;

// Header of the public pages (cover, about, account pages). Same view-transition
// name as NavHeader, so the two swap in place. Shows the guest buttons until the
// session is known. Below 640 px the brand text and "Giới thiệu" become icon-only
// (the latter hidden under 360 px; the footer links it too).
export default function PublicHeader() {
  const session = useSession();
  const path = usePathname();
  const current = (href: string) => (norm(path) === href ? "page" : undefined);

  return (
    <header className="chrome-header sticky top-0 z-40 border-b border-line/60 bg-header/95 backdrop-blur no-print" style={{ viewTransitionName: "site-header" }}>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-4">
        <Link href={session ? HOME : "/"} className="chrome-logo flex shrink-0 items-center gap-2">
          <Logo className="h-12 w-auto" />
          <span className="sr-only leading-none sm:not-sr-only">
            <span className="block font-display text-xl font-extrabold text-blue">Thế giới</span>
            <span className="block font-display text-xl font-extrabold text-pink">Âm thanh</span>
            <span className="mt-0.5 block text-[0.7rem] text-muted">Lắng nghe - Khám phá - Phát triển</span>
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/gioi-thieu/"
            aria-current={current("/gioi-thieu/")}
            title="Giới thiệu"
            className="chrome-hop grid size-11 shrink-0 place-items-center rounded-full border-2 border-white bg-pink-soft text-pink-dark shadow sm:flex sm:w-auto sm:gap-1.5 sm:border-transparent sm:bg-transparent sm:px-3 sm:font-semibold sm:text-muted sm:shadow-none sm:hover:text-ink sm:aria-[current=page]:text-pink-dark max-[359px]:hidden"
          >
            <Icon name="info" className="size-5" />
            <span className="sr-only sm:not-sr-only">Giới thiệu</span>
          </Link>
          {session ? (
            <Link href={HOME} className={PINK}>
              Vào học
            </Link>
          ) : (
            <>
              <Link href="/dang-nhap/" aria-current={current("/dang-nhap/")} className={`border-pink bg-white text-pink-dark hover:bg-pink-soft ${BTN}`}>
                Đăng nhập
              </Link>
              <Link href="/dang-ky/" aria-current={current("/dang-ky/")} className={PINK}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
