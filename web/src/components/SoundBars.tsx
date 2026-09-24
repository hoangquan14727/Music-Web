// Pops in when it replaces an icon; the bars move only under .is-playing.
export default function SoundBars({ className = "" }: { className?: string }) {
  return (
    <span className={`sound-bars inline-flex animate-pop-in items-end gap-1 ${className}`} aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
