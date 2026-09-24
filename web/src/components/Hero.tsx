import Link from "next/link";
import Icon from "./Icon";

// Hero = AI-painted scenery + cut-out AI layers (girl & rabbit, headphones,
// sun) placed like the mockup. Speech bubble, word column and all text are
// HTML/CSS so they stay sharp and editable. On small screens the text stacks
// above a compact version of the scene.
const WORDS = [
  { t: "Nghe", c: "#d6336c" },
  { t: "Thấy", c: "#2f6fb0" },
  { t: "Hiểu", c: "#7a4fc4" },
  { t: "Thêm yêu", c: "#2e7d6b" },
  { t: "thế giới!", c: "#b8285a" },
];

const outline = { paintOrder: "stroke fill", WebkitTextStroke: "0.35rem #fff" } as React.CSSProperties;

function Layer({ src, srcSet, sizes, className }: { src: string; srcSet?: string; sizes?: string; className: string }) {
  // lazy: decorative layers must not compete with the scene (the LCP image) for bandwidth.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} srcSet={srcSet} sizes={sizes} alt="" loading="lazy" draggable={false} className={`pointer-events-none absolute select-none ${className}`} />;
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-[#bfe9fb] to-[#e6f8ff]">
      <div className="relative mx-auto flex max-w-[1600px] flex-col lg:block lg:h-[clamp(400px,27.5vw,440px)]">
        {/* Scene */}
        <div className="relative order-2 aspect-[16/9] w-full sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/banner/scene.webp"
            srcSet="/images/banner/scene-768.webp 768w, /images/banner/scene.webp 1536w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="pointer-events-none size-full object-cover object-[50%_75%]"
          />
          <Layer src="/images/banner/sun.webp" className="right-[4%] top-[4%] w-[16%] lg:right-[21%] lg:top-[2%] lg:w-[6%]" />
          <Layer
            src="/images/banner/headphones.webp"
            srcSet="/images/banner/headphones-360.webp 360w, /images/banner/headphones.webp 600w"
            sizes="(min-width: 1024px) 18vw, 40vw"
            className="right-[4%] top-[14%] w-[40%] lg:left-[57%] lg:right-auto lg:top-[4%] lg:w-[18%]" />
          <Layer
            src="/images/banner/girl.webp"
            srcSet="/images/banner/girl-480.webp 480w, /images/banner/girl.webp 900w"
            sizes="(min-width: 1024px) 27vw, 58vw"
            className="bottom-[2%] left-[1%] w-[58%] lg:bottom-[1%] lg:left-[0.5%] lg:w-[27%]" />
        </div>

        {/* Speech bubble (CSS) */}
        <p className="absolute left-[6.5%] top-[7%] hidden w-[15%] -rotate-[7deg] rounded-[2rem] border-4 border-white bg-[#f9a8bf] px-4 py-3 text-center font-display text-[clamp(0.8rem,1.1vw,1.05rem)] font-bold leading-tight text-[#7a1239] shadow-md after:absolute after:-bottom-3 after:right-8 after:size-6 after:rotate-45 after:border-b-4 after:border-r-4 after:border-white after:bg-[#f9a8bf] lg:block">
          Cùng bé khám phá thế giới âm thanh xung quanh nhé!
        </p>

        {/* Title block */}
        <div className="relative z-10 order-1 flex flex-col items-center gap-3 px-4 pb-6 pt-8 text-center lg:absolute lg:left-[25%] lg:top-[7%] lg:w-[33%] lg:p-0">
          <h1 id="hero-title" className="font-display font-extrabold leading-[0.95]">
            <span className="block text-[clamp(2.6rem,5.2vw,5rem)] text-blue" style={outline}>
              Thế giới
            </span>
            <span className="block text-[clamp(3rem,6.2vw,6rem)] text-pink" style={outline}>
              Âm thanh
            </span>
          </h1>
          <p className="max-w-md rounded-2xl bg-white/60 px-3 py-1 text-[clamp(0.95rem,1.25vw,1.15rem)] font-semibold text-ink backdrop-blur-[2px]">
            Một không gian học tập và trải nghiệm âm thanh đầy màu sắc dành cho trẻ mầm non và giáo viên.
          </p>
          <Link
            href="/chu-de/"
            data-kid-target
            className="inline-flex min-h-16 items-center gap-2 rounded-full bg-pink px-8 font-display text-xl font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-pink-dark active:scale-95"
          >
            Bắt đầu khám phá <Icon name="arrow-right" className="size-6" />
          </Link>
        </div>

        {/* Word column on a soft pink cloud (CSS) */}
        <p className="absolute right-[1.5%] top-[14%] hidden w-[12%] rotate-[-6deg] flex-col items-center rounded-[45%] bg-[#fbdcea]/90 px-3 py-5 font-display text-[clamp(1.2rem,1.5vw,1.5rem)] font-bold leading-tight shadow-sm lg:flex">
          {WORDS.map((w) => (
            <span key={w.t} style={{ color: w.c }}>
              {w.t}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
