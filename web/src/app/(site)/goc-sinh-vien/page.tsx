import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import SampleBadge from "@/components/SampleBadge";

export const metadata: Metadata = { title: "Góc sinh viên" };

// Uses from PDF §7 (Sinh viên GDMN).
const USES = ["Thiết kế giáo án", "Thực hành nghiệp vụ", "Micro-teaching", "Chuẩn bị hoạt động", "Trình diễn sản phẩm công nghệ"];

// The 5 steps are quoted from PDF §6; everything else on this page is an example.
const STEPS = [
  ["Bước 1 – Gây hứng thú (2 phút)", "Giáo viên hỏi: “Hôm nay con nghe thấy những âm thanh gì trên đường đến trường?”"],
  ["Bước 2 – Nghe (3 phút)", "Giáo viên mở 3–4 âm thanh trên website."],
  ["Bước 3 – Dự đoán (3 phút)", "Trẻ chọn hình tương ứng theo nhóm nhỏ hoặc cả lớp."],
  ["Bước 4 – Kiểm chứng (3 phút)", "Website phản hồi; giáo viên hỏi: “Vì sao con chọn hình này?”"],
  ["Bước 5 – Chuyển sang hoạt động thật", "Trẻ tìm/giả lập âm thanh bằng cơ thể, đồ vật an toàn hoặc vận động theo âm thanh."],
];

export default function StudentPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy md:text-4xl no-print">Góc sinh viên</h1>
      <p className="mt-2 text-lg text-ink no-print">Giáo án mẫu và tài liệu thực hành cho sinh viên ngành Giáo dục Mầm non.</p>
      <ul className="mt-4 flex flex-wrap gap-2 no-print">
        {USES.map((u) => (
          <li key={u} className="rounded-full bg-[#e5f8f2] px-3 py-1 text-sm font-semibold text-[#1f5e50]">
            {u}
          </li>
        ))}
      </ul>

      <article className="mt-8 rounded-card bg-white p-6 shadow-sm print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2e7d6b]">Giáo án mẫu · 10–15 phút</p>
            <h2 className="text-3xl font-bold text-navy">Bé khám phá âm thanh quanh mình</h2>
          </div>
          <PrintButton />
        </div>

        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-xl font-bold text-ink">Mục tiêu</h3>
            <SampleBadge />
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Trẻ nhận biết và gọi tên được 3–4 âm thanh quen thuộc trên đường đến trường.</li>
            <li>Trẻ chú ý lắng nghe, chọn hình phù hợp và giải thích lựa chọn bằng lời nói đơn giản.</li>
            <li>Trẻ hứng thú bắt chước, tạo ra âm thanh bằng cơ thể và đồ vật an toàn.</li>
          </ul>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-xl font-bold text-ink">Chuẩn bị</h3>
            <SampleBadge />
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Máy tính bảng hoặc máy tính có loa, mở sẵn chủ đề{" "}
              <Link href="/chu-de/moi-truong-xung-quanh/" className="font-semibold text-blue underline">
                Âm thanh môi trường xung quanh
              </Link>{" "}
              và trò chơi{" "}
              <Link href="/on-tap/nghe-chon-hinh/?nhom=moi-truong-xung-quanh" className="font-semibold text-blue underline">
                Nghe – chọn hình
              </Link>
              .
            </li>
            <li>Một số đồ vật an toàn tạo ra âm thanh (phách tre, xúc xắc, hộp nhựa, thìa).</li>
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="font-sans text-xl font-bold text-ink">Tiến hành</h3>
          <p className="text-sm text-muted">Theo kịch bản trong Đề xuất MVP (mục 6).</p>
          <ol className="mt-3 space-y-3">
            {STEPS.map(([t, d]) => (
              <li key={t} className="rounded-2xl border-l-4 border-[#2e7d6b] bg-[#f4fbf8] p-3">
                <p className="font-bold text-ink">{t}</p>
                <p className="text-ink">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-xl font-bold text-ink">Quan sát – đánh giá</h3>
            <SampleBadge />
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Số âm thanh trẻ nhận biết đúng, số lần trẻ cần cô gợi ý.</li>
            <li>Mức độ hứng thú, khả năng diễn đạt khi trả lời “Vì sao con chọn hình này?”.</li>
            <li>Lưu ý: điểm số trên website không phải là đánh giá phát triển hay chẩn đoán.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
