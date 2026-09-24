import Logo from "./Logo";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

// Logo in a white disc with slow sound-wave rings (styles: app/motion/loading.css).
function Badge() {
  return (
    <span className="load-badge">
      {[0, 1, 2].map((i) => (
        <span key={i} className="load-ring" style={{ "--i": i } as Vars} />
      ))}
      <Logo className="load-logo" />
    </span>
  );
}

// Full-screen loading state (game routes): badge, caption, running slim bar.
export default function Loader({ caption = "Đang tải…", className = "" }: { caption?: string; className?: string }) {
  return (
    <div className={`load ${className}`}>
      <Badge />
      <p role="status" className="font-display text-xl font-bold text-navy">
        {caption}
      </p>
      <span aria-hidden className="load-bar">
        <span className="load-fill load-run" />
      </span>
    </div>
  );
}

// First-visit brand intro (root layout). The <head> script in app/layout.tsx
// drives the bar (--p) and the exit; without JS, CSS lifts it at ~2.6 s.
export function Intro() {
  return (
    <div className="intro" aria-hidden suppressHydrationWarning>
      <div className="intro-body">
        <Badge />
        <p className="intro-word">
          <span className="intro-mask">
            <span className="intro-rise text-blue">Thế giới</span>
          </span>{" "}
          <span className="intro-mask">
            <span className="intro-rise text-pink" style={{ "--i": 1 } as Vars}>
              Âm thanh
            </span>
          </span>
        </p>
        <p className="intro-tag">Lắng nghe · Khám phá · Phát triển</p>
        <span className="load-bar">
          <span className="load-fill" />
        </span>
      </div>
    </div>
  );
}
