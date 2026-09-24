import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-page px-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/mascot/confused.webp" alt="" loading="lazy" className="size-52" />
      <h1 className="text-4xl font-bold text-navy">Ôi, không tìm thấy trang này!</h1>
      <p className="text-lg text-muted">Mình cùng quay lại nghe âm thanh nhé.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex min-h-16 items-center rounded-full bg-pink px-8 font-display text-xl font-bold text-white shadow-lg">
          Về trang chủ
        </Link>
        <Link href="/chu-de/" className="inline-flex min-h-16 items-center rounded-full bg-blue px-8 font-display text-xl font-bold text-white shadow-lg">
          Các chủ đề
        </Link>
      </div>
    </main>
  );
}
