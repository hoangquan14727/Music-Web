import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import SoundCard from "@/components/SoundCard";
import PairCard from "@/components/PairCard";
import SampleBadge from "@/components/SampleBadge";
import { getGroup, groups, groupStyle, pairs, PAIR_GROUP, soundsIn } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return groups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/chu-de/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: getGroup(slug)?.name };
}

export default async function TopicPage(props: PageProps<"/chu-de/[slug]">) {
  const { slug } = await props.params;
  const group = getGroup(slug);
  if (!group) notFound();
  const isPairs = slug === PAIR_GROUP;

  return (
    <div style={groupStyle(group)} className="kid-zone mx-auto max-w-7xl px-4 py-6">
      <Link href="/chu-de/" className="inline-flex min-h-11 items-center gap-1 font-semibold text-blue hover:underline">
        <Icon name="arrow-left" className="size-4" /> Tất cả chủ đề
      </Link>

      {/* Rise is transform-only: the header may hold the LCP and must paint at once. */}
      <header className="relative mt-2 flex animate-rise-in flex-col items-center gap-4 overflow-hidden rounded-card bg-[var(--g-bg)] p-4 text-center sm:flex-row sm:pr-20 sm:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={group.image} alt="" className="h-28 w-auto max-w-[60%] animate-float object-contain [--float-y:-8px] sm:h-32" />
        <div>
          <h1 className="text-3xl font-bold text-[var(--g-ink)] md:text-4xl">{group.name}</h1>
          <p className="mt-1 text-lg text-ink">{group.description}</p>
        </div>
        <span aria-hidden className="pointer-events-none absolute right-4 top-2 flex gap-2 font-display text-2xl font-bold text-[var(--g-accent)] opacity-60">
          <span className="animate-float [--float-y:-6px]">♪</span>
          <span className="mt-3 animate-float [--float-y:-6px] [--i:3]">♫</span>
        </span>
      </header>

      <p className="my-5 flex animate-sounds-nudge items-start gap-2 rounded-2xl bg-white p-3 text-sm text-muted shadow-sm">
        <Icon name="lightbulb" className="mt-0.5 size-6 shrink-0 animate-sounds-glow text-amber-600" />
        {isPairs
          ? "Gợi ý cho cô: bấm “Nghe lần lượt cả hai”, để trẻ nghe xong rồi mới hỏi. Có thể bấm từng bên để nghe lại."
          : "Gợi ý cho cô: chạm vào thẻ để nghe. Trong lúc âm thanh phát, hỏi trẻ “Con nghe thấy âm thanh gì?” — tên sẽ hiện khi âm thanh kết thúc. Chạm lại để nghe lại."}
      </p>

      {isPairs ? (
        <ul className="grid gap-4 [--stagger:60ms] sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((p, i) => (
            <li key={p.pairId} className="animate-sounds-rise" style={{ "--i": i } as React.CSSProperties}>
              <PairCard pair={p} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-4 [--stagger:45ms] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {soundsIn(slug).map((s, i) => (
            <li key={s.id} className="animate-sounds-rise" style={{ "--i": i } as React.CSSProperties}>
              <SoundCard sound={s} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <aside className="reveal rounded-card border-2 border-dashed border-[var(--g-accent)] bg-white p-4">
          <SampleBadge />
          <h2 className="mt-2 text-xl font-bold text-[var(--g-ink)]">Sau khi nghe — chuyển sang hoạt động thật</h2>
          <p className="mt-1">
            <strong>Cô hỏi:</strong> {group.followUp.question}
          </p>
          <p>
            <strong>Hoạt động:</strong> {group.followUp.activity}
          </p>
        </aside>
        <Link
          href={isPairs ? "/on-tap/phan-biet-am-thanh/" : `/on-tap/nghe-chon-hinh/?nhom=${slug}`}
          data-kid-target
          className="halo reveal-zoom group inline-flex min-h-16 items-center justify-center gap-2 rounded-full bg-[var(--g-ink)] px-6 font-display text-xl font-bold text-white shadow-lg transition-transform duration-300 ease-bounce [--halo-color:color-mix(in_srgb,var(--g-accent)_30%,transparent)] active:scale-95"
        >
          <Icon name="gamepad" className="size-7 group-hover:animate-jelly" /> Chơi với nhóm này
        </Link>
      </div>
    </div>
  );
}
