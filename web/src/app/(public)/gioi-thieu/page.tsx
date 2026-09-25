import type { Metadata } from "next";
import { music, sounds } from "@/lib/data";

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

      <section aria-labelledby="nhom" className="space-y-2">
        <H2 id="nhom">Nhóm thực hiện</H2>
        <p className="reveal rounded-2xl border-2 border-dashed border-line bg-white p-4 text-muted">[Tên nhóm, thành viên và đơn vị — nhóm bổ sung]</p>
      </section>

      <section aria-labelledby="lien-he" className="space-y-2">
        <H2 id="lien-he">Liên hệ</H2>
        <p className="reveal rounded-2xl border-2 border-dashed border-line bg-white p-4 text-muted">[Email / số điện thoại liên hệ — nhóm bổ sung]</p>
      </section>

      <section aria-labelledby="chinh-sach" className="space-y-2">
        <H2 id="chinh-sach">Chính sách bảo mật</H2>
        <ul className="list-disc space-y-1 pl-6 text-ink">
          <li className="reveal">
            Tài khoản chỉ dành cho người lớn: giáo viên và phụ huynh. Khi đăng ký, website thu họ và tên, email và vai trò (Giáo viên hoặc Phụ huynh).
          </li>
          <li className="reveal">
            Các thông tin này được lưu ở Supabase (máy chủ khu vực Singapore) và chỉ dùng để đăng nhập và bảo vệ tài khoản. Mật khẩu được mã hoá, nhóm không xem được.
          </li>
          <li className="reveal">Để bảo vệ tài khoản, Supabase tự ghi thời điểm, địa chỉ IP và loại trình duyệt của mỗi lần đăng nhập.</li>
          <li className="reveal">Trình duyệt ghi nhớ phiên đăng nhập trên máy đang dùng cho tới khi bấm “Đăng xuất”.</li>
          <li className="reveal">Trẻ không có tài khoản. Website không thu tên, tuổi hay bất kỳ thông tin nào của trẻ và không lưu điểm số của trẻ.</li>
          <li className="reveal">Tên bé gõ trên “Phiếu bé ngoan” chỉ dùng để in, không được lưu lại hay gửi đi đâu.</li>
          <li className="reveal">Không dùng quảng cáo, không dùng công cụ theo dõi người dùng.</li>
          <li className="reveal">Không có liên kết tới trang bên ngoài trong các khu vực dành cho trẻ.</li>
          <li className="reveal">
            Muốn xoá tài khoản: gửi yêu cầu tới nhóm qua mục{" "}
            <a href="#lien-he" className="text-blue underline">
              Liên hệ
            </a>{" "}
            bằng email đã đăng ký. Nhóm sẽ xoá tài khoản cùng họ tên, email và vai trò đi kèm.
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
