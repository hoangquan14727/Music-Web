import Link from "next/link";
import Icon from "./Icon";
import HeroParallax from "./home/HeroParallax";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

// Hero = AI-painted scenery + cut-out AI layers (girl & rabbit, headphones,
// sun) placed like the mockup. Speech bubble, word column and all text are
// HTML/CSS so they stay sharp and editable. On small screens the text stacks
// above a compact version of the scene. Motion lives in app/motion/home.css;
// the scene image (LCP) is never animated.
const WORDS = [
  { t: "Nghe", c: "#d6336c" },
  { t: "Thấy", c: "#2f6fb0" },
  { t: "Hiểu", c: "#7a4fc4" },
  { t: "Thêm yêu", c: "#2e7d6b" },
  { t: "thế giới!", c: "#b8285a" },
];

// Notes rising around the headphones: [left %, top %, glyph, colour, --rise-x].
const NOTES: [number, number, string, string, string][] = [
  [2, 36, "♪", "#d6336c", "-10px"],
  [80, 14, "♫", "#2f6fb0", "12px"],
  [90, 48, "♪", "#7a4fc4", "8px"],
  [16, 6, "♫", "#2e7d6b", "-8px"],
];

// Clouds drifting over the sky band: [position/size, animation delay, --drift-x].
const CLOUDS: [string, string, string][] = [
  ["left-[28%] top-[5%] w-[13%] lg:left-[20%] lg:top-[3%] lg:w-[6%]", "-12s", "9vw"],
  ["left-[44%] top-[18%] w-[9%] opacity-75 lg:left-[81%] lg:top-[2%] lg:w-[5%]", "-30s", "-6vw"],
  ["hidden lg:left-[50%] lg:top-[1%] lg:block lg:w-[4%] opacity-80", "-4s", "7vw"],
];

const outline = { paintOrder: "stroke fill", WebkitTextStroke: "0.35rem #fff" } as React.CSSProperties;

function Img({ src, srcSet, sizes, className = "" }: { src: string; srcSet?: string; sizes?: string; className?: string }) {
  // lazy: decorative layers must not compete with the scene (the LCP image) for bandwidth.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} srcSet={srcSet} sizes={sizes} alt="" loading="lazy" draggable={false} className={`relative block w-full select-none ${className}`} />;
}

type Action = { href: string; label: string };

// cta = the big pink button; secondary = an optional quieter link beside it (landing: "Đăng nhập").
export default function Hero({ cta = { href: "/chu-de/", label: "Bắt đầu khám phá" }, secondary }: { cta?: Action; secondary?: Action }) {
  return (
    <HeroParallax aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-[#bfe9fb] to-[#e6f8ff]">
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

          {/* Decorative layers: each wrapper enters once and follows the mouse (--depth px); the picture inside loops. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {CLOUDS.map(([pos, delay, dx]) => (
              <span key={pos} className={`home-par absolute block [--depth:3] ${pos}`}>
                <svg viewBox="0 0 120 60" className="block w-full animate-drift fill-white/85 [animation-duration:48s]" style={{ animationDelay: delay, "--drift-x": dx } as Vars}>
                  <path d="M24 58a20 20 0 0 1-2-40 26 26 0 0 1 48-8 20 20 0 0 1 32 14 17 17 0 0 1-2 34z" />
                </svg>
              </span>
            ))}

            <span className="home-par absolute right-[4%] top-[4%] block aspect-square w-[16%] animate-pop-in [--depth:4] [animation-delay:300ms] lg:right-[21%] lg:top-[2%] lg:w-[6%]">
              <span className="home-sun-rays absolute -inset-[55%] animate-spin-slow [animation-duration:30s]" />
              <span className="home-sun-glow absolute -inset-[18%] animate-breathe [--breathe:1.15] [animation-duration:4s]" />
              <Img src="/images/banner/sun.webp" className="animate-sway [--sway:5deg] [animation-duration:7s]" />
            </span>

            <span className="home-par absolute right-[4%] top-[14%] block aspect-square w-[40%] animate-bounce-in [--depth:10] [animation-delay:150ms] lg:left-[57%] lg:right-auto lg:top-[4%] lg:w-[18%]">
              <Img
                src="/images/banner/headphones.webp"
                srcSet="/images/banner/headphones-360.webp 360w, /images/banner/headphones.webp 600w"
                sizes="(min-width: 1024px) 18vw, 40vw"
                className="animate-float [--float-y:-12px]"
              />
              {NOTES.map(([left, top, glyph, color, dx], i) => (
                <span
                  key={i}
                  className="absolute animate-rise-fade font-display text-[clamp(1.1rem,2vw,1.9rem)] font-bold leading-none"
                  style={{ left: `${left}%`, top: `${top}%`, color, "--i": i, "--rise-x": dx, "--rise-y": "-56px" } as Vars}
                >
                  {glyph}
                </span>
              ))}
            </span>

            <span className="home-par absolute bottom-[2%] left-[1%] block w-[58%] animate-slide-in-left [--depth:7] [animation-delay:100ms] lg:bottom-[1%] lg:left-[0.5%] lg:w-[27%]">
              <Img
                src="/images/banner/girl.webp"
                srcSet="/images/banner/girl-480.webp 480w, /images/banner/girl.webp 900w"
                sizes="(min-width: 1024px) 27vw, 58vw"
                className="origin-bottom animate-home-bob [--bob-s:1.01] [--bob-y:-5px]"
              />
            </span>
          </div>
        </div>

        {/* Speech bubble (CSS) */}
        <p className="home-par home-bubble absolute left-[6.5%] top-[7%] hidden w-[15%] -rotate-[7deg] rounded-[2rem] border-4 border-white bg-[#f9a8bf] px-4 py-3 text-center font-display text-[clamp(0.8rem,1.1vw,1.05rem)] font-bold leading-tight text-[#7a1239] shadow-md [--depth:3] after:absolute after:-bottom-3 after:right-8 after:size-6 after:rotate-45 after:border-b-4 after:border-r-4 after:border-white after:bg-[#f9a8bf] lg:block">
          Cùng bé khám phá thế giới âm thanh xung quanh nhé!
          <span aria-hidden className="pointer-events-none absolute -top-6 right-2 animate-rise-fade text-2xl text-pink [--rise-x:10px] [--rise-y:-36px]">♪</span>
          <span aria-hidden className="pointer-events-none absolute -top-4 left-3 animate-rise-fade text-xl text-blue [--i:2] [--rise-x:-8px] [--rise-y:-32px]">♫</span>
        </p>

        {/* Title block */}
        <div className="relative z-10 order-1 flex flex-col items-center gap-3 px-4 pb-6 pt-8 text-center lg:absolute lg:left-[25%] lg:top-[7%] lg:w-[33%] lg:p-0">
          <h1 id="hero-title" className="font-display font-extrabold leading-[0.95]">
            <span className="home-drop block text-[clamp(2.6rem,5.2vw,5rem)] text-blue" style={outline}>
              Thế giới
            </span>
            <span className="home-drop block text-[clamp(3rem,6.2vw,6rem)] text-pink" style={{ ...outline, "--i": 1 } as Vars}>
              Âm thanh
            </span>
          </h1>
          <p className="max-w-md animate-rise-in rounded-2xl bg-white/60 px-3 py-1 text-[clamp(0.95rem,1.25vw,1.15rem)] font-semibold text-ink backdrop-blur-[2px] [animation-delay:200ms]">
            Một không gian học tập và trải nghiệm âm thanh đầy màu sắc dành cho trẻ mầm non và giáo viên.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Halo breathes around the wrapper; the button itself never loops. */}
            <span className="halo inline-flex animate-rise-in rounded-full [animation-delay:250ms]">
              <Link
                href={cta.href}
                data-kid-target
                className="shine group inline-flex min-h-16 items-center gap-2 rounded-full bg-pink px-8 font-display text-xl font-bold text-white shadow-lg transition-[translate,scale,background-color] duration-300 ease-bounce hover:-translate-y-0.5 hover:scale-105 hover:bg-pink-dark active:scale-95"
              >
                {cta.label} <Icon name="arrow-right" className="size-6 group-hover:animate-home-nudge" />
              </Link>
            </span>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex min-h-12 animate-rise-in items-center rounded-full border-2 border-blue bg-white/90 px-6 font-display text-lg font-bold text-blue shadow-sm transition-[translate,background-color] duration-300 ease-bounce [animation-delay:320ms] hover:-translate-y-0.5 hover:bg-white"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>

        {/* Word column on a soft pink cloud (CSS) */}
        <p className="home-par absolute right-[1.5%] top-[14%] hidden w-[12%] rotate-[-6deg] flex-col items-center rounded-[45%] bg-[#fbdcea]/90 px-3 py-5 font-display text-[clamp(1.2rem,1.5vw,1.5rem)] font-bold leading-tight shadow-sm [--depth:5] lg:flex">
          {WORDS.map((w, i) => (
            <span key={w.t} className="home-word" style={{ color: w.c, "--i": i } as Vars}>
              {/* --i doesn't inherit (registered), so the wave span gets its own. */}
              <span className="home-wave" style={{ "--i": i } as Vars}>
                {w.t}
              </span>
            </span>
          ))}
        </p>
      </div>
    </HeroParallax>
  );
}
