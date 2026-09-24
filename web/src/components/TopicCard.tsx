import Link from "next/link";
import Icon from "./Icon";
import { countLabel, groupStyle, type Group } from "@/lib/data";

// Whole card is the link (the small arrow is only a visual cue).
export default function TopicCard({ group }: { group: Group }) {
  return (
    <Link
      href={`/chu-de/${group.slug}/`}
      data-kid-target
      style={groupStyle(group)}
      className="group flex h-full flex-col items-center rounded-card border-4 border-white bg-[var(--g-bg)] px-3 pb-4 pt-3 text-center shadow-sm transition-transform hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={group.image} alt="" loading="lazy" draggable={false} className="aspect-[2/1] w-full object-contain" />
      <h3 className="mt-2 text-lg font-bold leading-snug text-[var(--g-ink)]">{group.name}</h3>
      <p className="mb-3 text-sm text-[var(--g-ink)]">({countLabel(group.slug)})</p>
      <span className="mt-auto grid size-10 place-items-center rounded-full bg-[var(--g-accent)] text-white shadow transition-transform group-hover:scale-110" aria-hidden>
        <Icon name="chevron-right" className="size-6" />
      </span>
    </Link>
  );
}
