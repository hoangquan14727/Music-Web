import type { Metadata } from "next";
import Link from "next/link";
import SampleBadge from "@/components/SampleBadge";
import TeacherSuggestions from "@/components/TeacherSuggestions";
import ActivityBuilder from "@/components/ActivityBuilder";

export const metadata: Metadata = { title: "Góc giáo viên" };

// PDF §3: the site supports the teacher-led activity; it never replaces it.
const PRINCIPLES = [
  ["Ngắn – rõ – trực quan", "Mỗi nhiệm vụ chỉ có 1 yêu cầu chính; hình lớn, nút lớn, ít chữ."],
  ["Nghe trước – gọi tên sau", "Cho trẻ nghe âm thanh trước, sau đó mới chọn hình/tên."],
  ["Phản hồi ngay", "Đúng → khích lệ; sai → cho nghe lại/thử lại, không tạo cảm giác thất bại."],
  ["Có giáo viên dẫn dắt", "Cô đặt câu hỏi, mở rộng từ vựng và nối hoạt động số với hoạt động thật."],
  ["Thời lượng ngắn", "Mỗi lượt khoảng 3–7 phút, sau đó chuyển sang vận động, thảo luận hoặc thao tác vật thật."],
];

export default function TeacherPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy md:text-4xl no-print">Góc giáo viên</h1>
      <p className="mt-2 max-w-3xl text-lg text-ink no-print">
        Gợi ý cách dùng âm thanh trong hoạt động mầm non. Website là học liệu hỗ trợ — cô vẫn là người dẫn dắt.
      </p>
      <p className="mt-2 text-ink no-print">
        Cần nhạc nền, nhạc giờ ngủ hay nhạc chuyển tiếp hoạt động? Xem{" "}
        <Link href="/thu-vien-nhac/" className="font-semibold text-blue underline">
          Thư viện nhạc
        </Link>
        .
      </p>

      <section aria-labelledby="nguyen-tac" className="mt-8 no-print">
        <h2 id="nguyen-tac" className="text-2xl font-bold text-[#7a4fc4]">
          Nguyên tắc khi dùng trên lớp
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(([t, d], i) => (
            <div key={t} className="animate-rise-in rounded-2xl bg-white p-4 shadow-sm" style={{ "--i": i + 1 } as React.CSSProperties}>
              <dt className="font-bold text-ink">{t}</dt>
              <dd className="text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="goi-y" className="mt-10 no-print">
        <div className="reveal-left mb-3 flex flex-wrap items-center gap-3">
          <h2 id="goi-y" className="text-2xl font-bold text-[#7a4fc4]">
            Gợi ý hoạt động
          </h2>
          <SampleBadge />
        </div>
        <TeacherSuggestions />
      </section>

      <section aria-labelledby="tao-hoat-dong" className="mt-12">
        <div className="reveal-left mb-1 flex flex-wrap items-center gap-3">
          <h2 id="tao-hoat-dong" className="text-2xl font-bold text-[#7a4fc4]">
            Tạo hoạt động
          </h2>
          <SampleBadge />
        </div>
        <p className="mb-4 text-muted no-print">Chọn nhóm âm thanh và độ tuổi — website ghép sẵn một hoạt động 5 bước theo kịch bản mẫu (không dùng AI).</p>
        <ActivityBuilder />
      </section>
    </div>
  );
}
