import type { Metadata } from "next";
import { Suspense } from "react";
import TopicCard from "@/components/TopicCard";
import SearchResults from "@/components/SearchResults";
import { SearchForm } from "@/components/NavHeader";
import { groups } from "@/lib/data";

export const metadata: Metadata = { title: "Các chủ đề" };

export default function TopicsPage() {
  return (
    <div className="kid-zone mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy md:text-4xl">Các chủ đề âm thanh</h1>
      <p className="mb-6 mt-1 text-muted">Chọn một chủ đề để nghe và khám phá.</p>

      {/* Header search sends ?q= here; results render client-side. */}
      <div id="tim-kiem" className="scroll-mt-24">
        <Suspense fallback={<SearchForm className="sounds-search mb-6 max-w-md" />}>
          <SearchResults />
        </Suspense>
      </div>

      {/* Cards spring up one by one (transform only, so they paint at once). */}
      <ul className="grid grid-cols-2 gap-4 [--stagger:50ms] md:grid-cols-3 lg:grid-cols-5">
        {groups.map((g, i) => (
          <li key={g.slug} className="animate-sounds-rise" style={{ "--i": i } as React.CSSProperties}>
            <TopicCard group={g} />
          </li>
        ))}
      </ul>
    </div>
  );
}
