import type { Metadata } from "next";
import { music, sounds } from "@/lib/data";
import Icon from "@/components/Icon";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = { title: "Giới thiệu" };

// References: exactly the list in the MVP proposal (PDF §15) — nothing added.
const REFERENCES = [
  "Alotaibi, M. S. (2024). Game-based learning in early childhood education: a systematic review and meta-analysis. Frontiers in Psychology, 15.",
  "Mohammed, A. H., Nigussie, B., Schellens, T., & Rotsaert, T. (2026). Play-Based Learning in Early Childhood Education: A Scoping Review. Early Childhood Education Journal, 54, 3929–3975.",
  "Skene, K. et al. (2022). Can guidance during play enhance children’s learning and development in educational contexts? Child Development, 93(4), 1162–1180.",
  "Putkinen, V. et al. (2013). Do informal musical activities shape auditory skill development in preschool-age children? Frontiers in Psychology.",
  "Lima, C. F. et al. (2022). Does music training enhance auditory and linguistic processing? A systematic review and meta-analysis.",
  "Vilela, N., Sanches, S. G. G., & Carvallo, R. M. M. (2020). Development of auditory perception in preschool children. International Journal of Pediatric Otorhinolaryngology, 129.",
  "UNICEF. Pathways Framework – Using technology for early and foundational learning.",
  "WHO. (2019). Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age.",
  "WHO. (2021). Standards for healthy eating, physical activity, sedentary behaviour and sleep in early childhood education and care settings.",
  "Phạm Quang Thuận & Nguyễn Văn Hảo. (2023). Xây dựng website hỗ trợ dạy học thực hành âm nhạc cho sinh viên ngành Giáo dục mầm non. Tạp chí Giáo dục, 23(số đặc biệt 10), 95–101.",
  "Viện Âm nhạc Quốc gia Việt Nam & EDUDU. Thế Giới Thanh Âm Muôn Màu – chương trình trải nghiệm âm nhạc tương tác cho trẻ 2–11 tuổi.",
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="reveal-left scroll-mt-24 text-2xl font-bold text-navy">
      {children}
    </h2>
  );
}

const LICENSE_URL: Record<string, string> = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/deed.vi",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/deed.vi",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/deed.vi",
};

export default function AboutPage() {
  const all = [...sounds.map((s) => ({ ...s, label: s.name })), ...music.map((m) => ({ ...m, label: m.title }))];
  const credits = all.filter((x) => !x.placeholder && x.license);
  const pending = all.filter((x) => x.placeholder).length;

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-navy md:text-4xl">Giới thiệu dự án</h1>
        <blockquote className="relative mt-4 animate-rise-in rounded-card border-l-4 border-pink bg-pink-soft p-5 text-lg text-ink [--i:1]">
          <span aria-hidden className="pointer-events-none absolute -top-5 right-4 animate-float select-none font-display text-6xl font-extrabold leading-none text-pink/30 [--float-y:-6px] [animation-duration:5s]">
            “
          </span>
          “Một môi trường học tập tương tác giúp trẻ khám phá thế giới thông qua âm thanh; đồng thời cung cấp học liệu để giáo viên và sinh viên GDMN sử dụng
          trong hoạt động giáo dục.”
        </blockquote>
        <p className="mt-4 text-ink">
          Dự án không đặt mục tiêu tạo thêm một thư viện âm thanh. Sản phẩm tổ chức âm thanh đời sống thành học liệu tương tác có mục tiêu giáo dục cho trẻ
          mầm non: trẻ nghe, nhận biết, phân loại, lựa chọn, nhận phản hồi và sau đó chuyển sang hoạt động trực tiếp. Website là công cụ hỗ trợ, dùng theo phiên
          ngắn và có người lớn dẫn dắt — không thay thế tương tác trực tiếp của cô với trẻ.
        </p>
      </header>

      {/* Who made it + how to reach her: two bright cards side by side on wide screens. */}
      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="nguoi-thuc-hien" className="flex flex-col gap-3">
          <H2 id="nguoi-thuc-hien">Người thực hiện</H2>
          <div className="reveal relative flex flex-1 flex-col justify-center overflow-hidden rounded-card border-4 border-white bg-gradient-to-br from-[#dff1fe] via-[#fbfcfe] to-[#fde7f0] p-5 shadow-md">
            <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-pink/10" />
            <Icon name="music" className="pointer-events-none absolute right-5 top-4 size-6 animate-twinkle text-pink" />
            <Icon name="star" className="pointer-events-none absolute bottom-4 right-6 hidden size-5 animate-twinkle text-[#f59e0b] [--i:2] sm:block" />
            <div className="relative flex items-center gap-4">
              <span className="grid size-20 shrink-0 place-items-center rounded-full bg-white shadow-md ring-4 ring-[#bfe0fa]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/stickers/student.webp" alt="" className="size-16 animate-float [--float-y:-4px]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-dark">Thực hiện dự án</p>
                <p className="font-display text-2xl font-extrabold leading-tight text-navy md:text-3xl">Lò Hà Uyên Trân</p>
                <p className="mt-1 text-sm text-muted">“Thế giới Âm thanh” — học liệu âm thanh cho trẻ mầm non</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="lien-he" className="flex flex-col gap-3">
          <H2 id="lien-he">Liên hệ</H2>
          <div className="reveal relative flex-1 overflow-hidden rounded-card border-4 border-white bg-gradient-to-br from-[#fde7f0] via-[#fbfcfe] to-[#e3f5ee] p-5 shadow-md">
            <span aria-hidden className="pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full bg-blue/10" />
            <div className="relative flex items-center gap-4">
              <span className="grid size-14 shrink-0 -rotate-6 place-items-center rounded-2xl bg-pink text-white shadow-md">
                <Icon name="mail" className="size-8" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue">Email</p>
                <a
                  href="mailto:tranlhu.k66gdmn-d@utb.edu.vn"
                  className="font-display text-lg font-bold text-navy underline decoration-pink/40 decoration-2 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-pink md:text-xl"
                >
                  tranlhu.k66gdmn-d@
                  <wbr />
                  utb.edu.vn
                </a>
              </div>
            </div>
            <p className="relative mt-3 text-sm text-muted">Góp ý nội dung, báo lỗi hoặc xin xoá tài khoản đều gửi về địa chỉ này.</p>
            <div className="relative mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:tranlhu.k66gdmn-d@utb.edu.vn"
                className="shine inline-flex min-h-11 items-center gap-2 rounded-full bg-pink px-5 font-bold text-white shadow transition-transform duration-300 ease-bounce hover:-translate-y-0.5 active:scale-95"
              >
                <Icon name="mail" className="size-5" /> Gửi email
              </a>
              <CopyButton
                text="tranlhu.k66gdmn-d@utb.edu.vn"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-blue bg-white px-5 font-bold text-blue transition-transform duration-300 ease-bounce hover:-translate-y-0.5 active:scale-95"
              />
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="chinh-sach" className="space-y-2">
        <H2 id="chinh-sach">Chính sách bảo mật</H2>
        <ul className="list-disc space-y-1 pl-6 text-ink">
          <li className="reveal">
            Tài khoản chỉ dành cho người lớn: giáo viên và phụ huynh. Khi đăng ký, website thu họ và tên, email và vai trò (Giáo viên hoặc Phụ huynh).
          </li>
          <li className="reveal">
            Các thông tin này được lưu ở Supabase (máy chủ khu vực Singapore) và chỉ dùng để đăng nhập và bảo vệ tài khoản. Mật khẩu được mã hoá, không ai xem được.
          </li>
          <li className="reveal">Để bảo vệ tài khoản, Supabase tự ghi thời điểm, địa chỉ IP và loại trình duyệt của mỗi lần đăng nhập.</li>
          <li className="reveal">Trình duyệt ghi nhớ phiên đăng nhập trên máy đang dùng cho tới khi bấm “Đăng xuất”.</li>
          <li className="reveal">Trẻ không có tài khoản. Website không thu tên, tuổi hay bất kỳ thông tin nào của trẻ và không lưu điểm số của trẻ.</li>
          <li className="reveal">Tên bé gõ trên “Phiếu bé ngoan” chỉ dùng để in, không được lưu lại hay gửi đi đâu.</li>
          <li className="reveal">Không dùng quảng cáo, không dùng công cụ theo dõi người dùng.</li>
          <li className="reveal">Không có liên kết tới trang bên ngoài trong các khu vực dành cho trẻ.</li>
          <li className="reveal">
            Muốn xoá tài khoản: gửi email từ địa chỉ đã đăng ký tới{" "}
            <a href="mailto:tranlhu.k66gdmn-d@utb.edu.vn" className="break-all text-blue underline">
              tranlhu.k66gdmn-d@utb.edu.vn
            </a>{" "}
            (mục{" "}
            <a href="#lien-he" className="text-blue underline">
              Liên hệ
            </a>
            ). Tài khoản sẽ được xoá cùng họ tên, email và vai trò đi kèm.
          </li>
        </ul>
      </section>

      <section aria-labelledby="ho-tro" className="space-y-2">
        <H2 id="ho-tro">Hỗ trợ sử dụng</H2>
        <ul className="list-disc space-y-1 pl-6 text-ink">
          <li className="reveal">Không nghe thấy tiếng? Kiểm tra âm lượng máy; trên iPhone, gạt công tắc im lặng về chế độ có chuông.</li>
          <li className="reveal">Trong trò chơi, cô bấm “Bắt đầu” để máy cho phép phát âm thanh; các câu sau sẽ tự phát.</li>
          <li className="reveal">Hiệu ứng chuyển động luôn chạy, kể cả khi máy bật “Giảm chuyển động”. Nếu trẻ hay người lớn dễ chóng mặt vì chuyển động, bấm nút “Tắt hiệu ứng” ở cuối các trang (trong trò chơi: ở màn bắt đầu và màn kết quả): hiệu ứng được thay bằng khung màu tĩnh, trình duyệt sẽ nhớ lựa chọn này.</li>
          <li className="reveal">Khi dùng chung một máy tính bảng cho cả lớp, nên bật Truy cập được hướng dẫn (Guided Access) trên iPad hoặc Ghim màn hình trên Android để trẻ không thoát nhầm.</li>
          <li className="reveal">
            Đăng nhập trên máy dùng chung của lớp? Dùng xong, mở menu tài khoản ở góc trên (trên điện thoại: mở menu) rồi bấm “Đăng xuất”, để người khác không
            dùng tiếp tài khoản của mình.
          </li>
        </ul>
      </section>

      <section aria-labelledby="nguon" className="space-y-2">
        <H2 id="nguon">Nguồn âm thanh</H2>
        <p className="reveal text-muted">
          Âm thanh dùng giấy phép mở (CC0, phạm vi công cộng hoặc CC BY) hoặc do nhóm tự tạo. Các bản ghi đã được nhóm cắt đoạn, lọc tạp âm và chuẩn hoá âm
          lượng để dùng trên lớp.
          {pending > 0 && ` Còn ${pending} mục đang chờ nhóm bổ sung file.`}
        </p>
        {credits.length > 0 && (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-page text-ink">
                <tr>
                  <th className="p-2">Âm thanh</th>
                  <th className="p-2">Tác giả</th>
                  <th className="p-2">Giấy phép</th>
                </tr>
              </thead>
              <tbody>
                {credits.map((c) => (
                  <tr key={c.id} className="border-t border-line">
                    <td className="p-2">
                      {c.source ? (
                        <a href={c.source} className="text-blue underline" target="_blank" rel="noopener noreferrer">
                          {c.label}
                        </a>
                      ) : (
                        c.label
                      )}
                    </td>
                    <td className="p-2">{c.author}</td>
                    <td className="p-2">
                      {LICENSE_URL[c.license] ? (
                        <a href={LICENSE_URL[c.license]} className="text-blue underline" target="_blank" rel="noopener noreferrer">
                          {c.license}
                        </a>
                      ) : (
                        c.license
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <td className="p-2">Các cặp “Đặc tính âm thanh” và tiếng phản hồi trong trò chơi</td>
                  <td className="p-2">Nhóm Thế giới Âm thanh (tổng hợp bằng ffmpeg)</td>
                  <td className="p-2">CC0</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="tai-lieu" className="space-y-2">
        <H2 id="tai-lieu">Tài liệu tham khảo</H2>
        <ul className="list-disc space-y-1 pl-6 text-sm text-ink">
          {REFERENCES.map((r) => (
            <li key={r} className="reveal">
              {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
