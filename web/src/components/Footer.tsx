import Link from "next/link";
import Logo from "./Logo";

// No social-network icons: there are no official accounts yet, and the site
// keeps third-party links out of pages children use.
const LINKS = [
  { href: "/gioi-thieu/", label: "Giới thiệu" },
  { href: "/gioi-thieu/#lien-he", label: "Liên hệ" },
  { href: "/gioi-thieu/#chinh-sach", label: "Chính sách bảo mật" },
  { href: "/gioi-thieu/#ho-tro", label: "Hỗ trợ" },
];

export default function Footer() {
  return (
    <footer className="bg-footer text-white no-print">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 lg:flex-row lg:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-10 w-auto rounded-full bg-white/90 p-1" />
          <span className="font-display text-lg font-bold leading-tight">
            Thế giới
            <br />
            Âm thanh
          </span>
        </Link>
        <nav aria-label="Liên kết cuối trang">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-2 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-white/85">Học liệu thử nghiệm cho giáo dục mầm non</p>
      </div>
    </footer>
  );
}
