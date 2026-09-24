export default function SoundBars({ className = "" }: { className?: string }) {
  return (
    <span className={`sound-bars inline-flex items-end gap-1 ${className}`} aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
