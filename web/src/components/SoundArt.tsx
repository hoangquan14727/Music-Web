// Picture for a sound (hand-drawn SVG). If a sound has no picture yet, the
// listening mascot stands in, clearly tagged as temporary.
export default function SoundArt({ image, alt = "", className = "" }: { image: string | null; alt?: string; className?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} loading="lazy" draggable={false} className={`size-full object-contain ${className}`} />;
  }
  return (
    <span className={`relative grid size-full place-items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/mascot/listening.webp" alt={alt} loading="lazy" draggable={false} className="size-3/4 object-contain opacity-80" />
      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-muted">ảnh tạm</span>
    </span>
  );
}
