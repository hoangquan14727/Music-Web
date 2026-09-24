import type { Metadata } from "next";
import MusicList from "@/components/MusicList";
import { music } from "@/lib/data";

export const metadata: Metadata = { title: "Thư viện nhạc" };

const SECTIONS = [
  { key: "ke-chuyen", title: "Nhạc kể chuyện", note: "Dùng khi kể chuyện, đóng kịch, chuyển cảnh trong câu chuyện." },
  { key: "thieu-nhi", title: "Nhạc thiếu nhi", note: "Vận động theo nhạc, hát cùng cô. Bài hát thiếu nhi Việt Nam cần được phép của tác giả trước khi đưa lên." },
  { key: "nen-thu-gian", title: "Nhạc nền / thư giãn", note: "Giờ ngủ trưa, góc thiên nhiên, chuyển tiếp giữa các hoạt động." },
];

// Intro level for phase 1 (PDF §10: "ở mức giới thiệu"); every track carries
// a teaching use, so this stays a learning resource, not a generic music site.
export default function MusicPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy md:text-4xl">Thư viện nhạc</h1>
      <p className="mb-8 mt-2 max-w-3xl text-lg text-ink">
        Âm nhạc và âm thanh nền để cô sử dụng trong các hoạt động trên lớp. Mỗi bản nhạc ghi rõ hoạt động phù hợp và nguồn, giấy phép sử dụng.
      </p>
      <div className="space-y-10">
        {SECTIONS.map((s) => {
          const tracks = music.filter((t) => t.category === s.key);
          return (
            <section key={s.key} aria-labelledby={s.key}>
              <h2 id={s.key} className="text-2xl font-bold text-blue">
                {s.title}
              </h2>
              <p className="mb-3 text-muted">{s.note}</p>
              {tracks.length ? (
                <MusicList tracks={tracks} />
              ) : (
                <p className="rounded-2xl border-2 border-dashed border-line bg-white p-4 text-muted">Chưa có bản nhạc — nhóm nội dung sẽ bổ sung.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
