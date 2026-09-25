import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Icon from "@/components/Icon";
import CTASectionCard, { type CTA } from "@/components/CTASectionCard";
import { groups, pairs, sounds } from "@/lib/data";
import { loginUrl } from "@/lib/auth-paths";

export const metadata: Metadata = { title: "Học liệu âm thanh cho trẻ mầm non" };

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
const idx = (i: number) => ({ "--i": i }) as Vars;

// Public cover page for guests (logged-in visitors are sent to HOME before paint).
// Nothing gated is linked directly: every app link goes through the login page.
const FEATURES: CTA[] = [
  {
    href: loginUrl("/chu-de/"),
    title: `${groups.length} nhóm âm thanh`,
    text: `${sounds.length} âm thanh và ${pairs.length} cặp âm thanh đời thường, đều có tranh minh hoạ.`,
    button: "Nghe thử",
    image: "/images/banner/headphones-360.webp",
    sticker: "soundwave",
    bg: "#e6f4ff",
    accent: "#2f6fb0",
  },
  {
    href: loginUrl("/on-tap/"),
    title: "5 trò chơi",
    text: "Nghe – chọn hình, nối, đoán, phân biệt âm thanh và ôn tập nhanh.",
    button: "Vào chơi",
    image: "/images/cta/tro-choi.webp",
    sticker: "gamepad",
    bg: "#ffecf2",
    accent: "#d6336c",
  },
  {
    href: loginUrl("/thu-vien-nhac/"),
    title: "Thư viện nhạc",
    text: "Nhạc thư giãn, nhạc kể chuyện, nhạc thiếu nhi cho giờ sinh hoạt.",
    button: "Nghe nhạc",
    image: "/images/cta/thu-vien-nhac.webp",
    sticker: "music",
    bg: "#e5f8f2",
    accent: "#2e7d6b",
  },
  {
    href: loginUrl("/goc-giao-vien/"),
    title: "Góc giáo viên",
    text: "Gợi ý dạy học, giáo án mẫu và công cụ Tạo hoạt động cho lớp.",
    button: "Tạo hoạt động",
    image: "/images/cta/goc-giao-vien.webp",
    sticker: "teacher",
    bg: "#f4edfd",
    accent: "#7a4fc4",
  },
  {
    href: loginUrl("/on-tap/"),
    title: "Phiếu bé ngoan",
    text: "Xong mỗi trò chơi, cô gõ tên bé và in phiếu khen tặng bé.",
    button: "Nhận phiếu",
    image: "/images/games/on-tap-nhanh.webp",
    sticker: "star",
    bg: "#fbf7d2",
    accent: "#9a5b12",
  },
];
// Bento on large screens: 3 cards on the first row, 2 wider ones below.
const SPAN = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "sm:col-span-2 lg:col-span-3"];

const AUDIENCE = [
  {
    title: "Giáo viên mầm non",
    sticker: "teacher",
    image: "/images/cta/goc-giao-vien.webp",
    bg: "#f4edfd",
    accent: "#7a4fc4",
    reveal: "reveal-left",
    points: [
      "Học liệu âm thanh theo chủ đề, mở ngay trên ti vi hay máy chiếu của lớp",
      "Trò chơi ngắn 3–7 phút, cô dẫn dắt cả lớp cùng nghe",
      "Gợi ý hoạt động, giáo án mẫu và công cụ tạo hoạt động",
      "In phiếu bé ngoan để khen bé sau giờ học",
    ],
  },
  {
    title: "Phụ huynh",
    sticker: "heart",
    image: "/images/cta/goc-sinh-vien.webp",
    bg: "#ffecf2",
    accent: "#b8285a",
    reveal: "reveal-right",
    points: [
      "Cùng con nghe và gọi tên những âm thanh quanh nhà",
      "Vài phút chơi mỗi ngày, luôn có ba mẹ ngồi cạnh",
      "Nhạc thư giãn, nhạc kể chuyện cho giờ nghỉ của con",
      "Khen con bằng phiếu bé ngoan in tại nhà",
    ],
  },
];

const STEPS = [
  { title: "Đăng ký", text: "Tạo tài khoản miễn phí cho giáo viên hoặc phụ huynh bằng email.", image: "/images/mascot/happy.webp" },
  { title: "Chọn chủ đề hoặc trò chơi", text: `${groups.length} nhóm âm thanh và 5 trò chơi, hợp với trẻ 3–6 tuổi.`, image: "/images/games/nghe-chon-hinh.webp" },
  { title: "Chơi cùng bé và in phiếu bé ngoan", text: "Bé nghe rồi chọn; xong lượt chơi, cô gõ tên bé và in phiếu khen.", image: "/images/stickers/star.webp" },
];

const SAFETY = [
  ["Trẻ không có tài khoản.", "Chỉ giáo viên hoặc phụ huynh đăng ký và dẫn bé vào học."],
  ["Không thu thập dữ liệu của trẻ.", "Tên bé gõ trên phiếu bé ngoan chỉ để in, không được lưu."],
  ["Không quảng cáo, không theo dõi.", "Không có công cụ theo dõi người dùng hay liên kết lạ trong khu vực của bé."],
  ["Phiên ngắn, có người lớn dẫn dắt.", "Mỗi lượt chơi vài phút, rồi chuyển sang hoạt động thật với lớp."],
];

// Twinkles and notes around the mascot in the final band.
const BAND_BITS: [string, string, string, string][] = [
  ["✦", "left-[12%] top-4", "#f59e0b", "animate-twinkle"],
  ["✦", "right-[10%] top-6", "#d6336c", "animate-twinkle [--i:2]"],
  ["✦", "bottom-6 left-[6%]", "#7a4fc4", "animate-twinkle [--i:4]"],
  ["♪", "right-[20%] top-10", "#2f6fb0", "animate-rise-fade [--rise-y:-40px]"],
  ["♫", "left-[22%] top-12", "#d6336c", "animate-rise-fade [--i:2] [--rise-x:8px] [--rise-y:-40px]"],
];

function Art({ src, className }: { src: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden loading="lazy" draggable={false} className={`pointer-events-none shrink-0 select-none object-contain ${className}`} />;
}

function Head({ id, sticker, title, subtitle }: { id: string; sticker: string; title: string; subtitle: string }) {
  return (
    <div className="reveal mb-5 flex items-center gap-3">
      <Art src={`/images/stickers/${sticker}.webp`} className="size-12 animate-sway [--sway:6deg]" />
      <div>
        <h2 id={id} className="text-2xl font-bold text-navy md:text-3xl">
          {title}
        </h2>
        <p className="text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero cta={{ href: "/dang-ky/", label: "Đăng ký miễn phí" }} secondary={{ href: "/dang-nhap/", label: "Đăng nhập" }} />

      <div className="mx-auto max-w-7xl space-y-16 overflow-x-clip px-4 py-12">
        {/* Right under the fold: a one-shot, transform-only entrance, not a scroll fade
            (a half-faded card at the fold fails contrast checks). */}
        <section aria-labelledby="ben-trong">
          <Head id="ben-trong" sticker="soundwave" title="Bên trong có gì?" subtitle="Đăng ký miễn phí là dùng được tất cả các khu vực." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {FEATURES.map((c, i) => (
              <li key={c.title} className={`animate-rise-in h-full ${SPAN[i]}`} style={idx(i)}>
                <CTASectionCard cta={c} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="danh-cho-ai">
          <Head id="danh-cho-ai" sticker="music" title="Dành cho ai?" subtitle="Tài khoản dành cho người lớn; bé chơi khi có cô hoặc ba mẹ bên cạnh." />
          <div className="grid gap-5 md:grid-cols-2">
            {AUDIENCE.map((a) => (
              <article key={a.title} className={`${a.reveal} flow-root rounded-card border-4 border-white p-5 shadow-sm`} style={{ background: a.bg }}>
                {/* Floated so the text wraps around it at any width. */}
                <Art src={a.image} className="float-right -mr-1 ml-2 h-28 w-28 sm:h-36 sm:w-36" />
                <h3 className="flex items-center gap-2 text-2xl font-bold leading-tight" style={{ color: a.accent }}>
                  <Art src={`/images/stickers/${a.sticker}.webp`} className="size-10 animate-breathe [--breathe:1.1]" />
                  {a.title}
                </h3>
                <ul className="mt-3 space-y-2 text-ink">
                  {a.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Icon name="check" className="mt-0.5 size-5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="cach-dung">
          <Head id="cach-dung" sticker="star" title="Bắt đầu trong 3 bước" subtitle="Không cần cài đặt, mở trình duyệt là dùng được." />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="home-stagger home-stagger-zoom relative flex flex-col items-center rounded-card border-4 border-white bg-white px-5 pb-6 pt-8 text-center shadow-sm" style={idx(i)}>
                <span aria-hidden className="absolute -top-4 left-5 grid size-11 place-items-center rounded-full bg-pink font-display text-2xl font-extrabold text-white shadow">
                  {i + 1}
                </span>
                <Art src={s.image} className="size-28 animate-float [--float-y:-6px]" />
                <h3 className="mt-3 text-xl font-bold leading-snug text-navy">{s.title}</h3>
                <p className="mt-1 text-ink">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="an-toan" className="reveal-zoom relative overflow-hidden rounded-card border-4 border-white bg-[#e5f8f2] p-5 shadow-sm md:p-8 lg:pr-64">
          <h2 id="an-toan" className="flex items-center gap-3 text-2xl font-bold text-[#23685a] md:text-3xl">
            <Art src="/images/stickers/heart.webp" className="size-11 animate-breathe [--breathe:1.12]" />
            An toàn cho bé
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SAFETY.map(([title, text]) => (
              <li key={title} className="flex gap-3 rounded-2xl bg-white/70 p-3">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-[#2e7d6b] text-white">
                  <Icon name="check" className="size-5" />
                </span>
                <span>
                  <strong className="block text-[#23685a]">{title}</strong>
                  <span className="text-ink">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/gioi-thieu/#chinh-sach" className="group mt-4 inline-flex min-h-11 items-center gap-1 font-bold text-[#23685a] hover:underline">
            Đọc chính sách bảo mật <Icon name="arrow-right" className="size-4 group-hover:animate-home-nudge" />
          </Link>
          <Art src="/images/mascot/listening.webp" className="absolute bottom-2 right-4 hidden size-52 animate-float [--float-y:-6px] lg:block" />
        </section>

        <section aria-labelledby="dang-ky-ngay" className="reveal relative overflow-hidden rounded-card bg-pink-soft px-5 py-8 text-center md:px-48 md:py-10">
          <Art src="/images/mascot/strip.webp" className="mx-auto size-32 animate-float [--float-y:-6px] md:absolute md:bottom-0 md:left-4 md:size-40" />
          {BAND_BITS.map(([glyph, pos, color, anim]) => (
            <span key={pos} aria-hidden className={`pointer-events-none absolute hidden font-display text-xl leading-none sm:block ${pos} ${anim}`} style={{ color }}>
              {glyph}
            </span>
          ))}
          <h2 id="dang-ky-ngay" className="text-2xl font-bold text-pink-ink md:text-3xl">
            Cùng bé lắng nghe thế giới quanh mình
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-ink">Miễn phí cho giáo viên mầm non và phụ huynh. Đăng ký chỉ mất một phút.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="halo inline-flex rounded-full">
              <Link
                href="/dang-ky/"
                className="shine group inline-flex min-h-14 items-center gap-2 rounded-full bg-pink px-8 font-display text-xl font-bold text-white shadow-lg transition-[translate,scale,background-color] duration-300 ease-bounce hover:-translate-y-0.5 hover:scale-105 hover:bg-pink-dark active:scale-95"
              >
                Đăng ký miễn phí <Icon name="arrow-right" className="size-6 group-hover:animate-home-nudge" />
              </Link>
            </span>
            <Link href="/dang-nhap/" className="inline-flex min-h-11 items-center px-3 font-bold text-pink-ink hover:underline">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
