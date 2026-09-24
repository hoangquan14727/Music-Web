# Bàn giao — Website “Thế giới Âm thanh” (đợt 1 + đợt 2 + rà soát cuối)

Ngày: 23/09/2026, cập nhật 24/09/2026 · Hướng dẫn nhanh: `README.md` ở thư mục gốc · Mã nguồn: thư mục `web/` · Ảnh chụp: `docs/screenshots/` (375 / 768 / 1440 px, màn trò chơi ở 1024 px)

## 1. Chạy thử

```bash
cd web
npm install
npm run dev          # xem khi đang sửa: http://localhost:3000
npm test             # kiểm tra logic trò chơi và tìm kiếm (8 bài test)
npm run build        # xuất site tĩnh ra web/out/ (tự kiểm tra dữ liệu trước khi build)
npx serve out        # xem bản build; demo được cả khi không có mạng
```

Có thể đưa `web/out/` lên bất kỳ host tĩnh nào (Vercel, Netlify, GitHub Pages ở tên miền gốc).

## 2. Đã làm

| Trang | Nội dung |
|---|---|
| `/` Trang chủ | Banner, 5 chủ đề, 5 âm thanh nổi bật (phát ngay tại chỗ), 4 khu mở rộng, băng khẩu hiệu, footer |
| `/chu-de` | 5 chủ đề + ô tìm kiếm luôn hiện (`?q=`): gõ có dấu hay không dấu đều được, bỏ qua từ đệm (“tiếng”, “con”, “cái”, “âm thanh”), tìm theo từ khoá (“động vật”, “phương tiện”, “nhạc cụ”…) và tìm cả bản nhạc trong Thư viện nhạc |
| `/chu-de/[nhóm]` | Chạm cả thẻ để nghe; tên hiện **sau khi** nghe xong; gợi ý cho cô; nút “Chơi với nhóm này” (nhóm Đặc tính dẫn tới Phân biệt âm thanh) |
| `/chu-de/dac-tinh-am-thanh` | 5 cặp so sánh: to–nhỏ, nhanh–chậm, cao–thấp, giống, khác |
| `/on-tap` | 5 trò chơi, tất cả đều chơi được |
| `/on-tap/nghe-chon-hinh` | 6 câu; hình chỉ hiện sau khi nghe (hoặc sau tối đa 6,5 giây); lọc theo chủ đề bằng `?nhom=`; số hình mỗi câu bằng `?hinh=2`, `3` hoặc `4` (mặc định 3) |
| `/on-tap/doan-am-thanh` | Cô chọn độ tuổi: 3–4 tuổi → 2 hình, 4–5 tuổi → 3 hình, 5–6 tuổi → 4 hình |
| `/on-tap/noi-am-thanh-hinh-anh` | 3 lượt nối, mỗi lượt 3 cặp. Chạm loa (phân biệt bằng màu và số chấm) rồi chạm hình. Không dùng kéo-thả vì hay lỗi trên tablet |
| `/on-tap/phan-biet-am-thanh` | Nghe 2 tiếng có khoảng nghỉ rõ; chọn tiếng thứ nhất/thứ hai, hoặc giống/khác. Thứ tự phát ngẫu nhiên |
| `/on-tap/on-tap-nhanh` | Trộn 3 câu chọn hình + 1 bảng nối + 2 câu phân biệt |
| `/thu-vien-nhac` | 3 nhóm nhạc. Trình phát dính đáy màn hình: bài trước/sau, tua, lặp lại. Nhạc vẫn phát khi chuyển trang, tự dừng khi có âm thanh khác hoặc khi vào trò chơi |
| `/goc-giao-vien` | Bộ lọc theo độ tuổi, chủ đề, loại hoạt động (8 gợi ý mẫu), đường dẫn tới Thư viện nhạc và công cụ **Tạo hoạt động** (xem ghi chú dưới bảng) |
| `/goc-sinh-vien` | Giáo án mẫu “Bé khám phá âm thanh quanh mình”, in được / lưu PDF |
| `/gioi-thieu` | Định vị dự án, liên hệ, chính sách bảo mật, hỗ trợ, nguồn âm thanh, tài liệu tham khảo (đúng danh sách PDF §15) |
| 404 | Có |

**Tạo hoạt động:** cô chọn nhóm âm thanh và độ tuổi, website ghép sẵn một kịch bản 5 bước theo PDF §6 và in được. Kết quả sinh theo quy tắc cố định từ dữ liệu, không dùng AI.
- Bước “Nghe” có sẵn thẻ âm thanh để cô bấm phát ngay; bản in chỉ giữ tên.
- Đường dẫn trò chơi gắn sẵn số hình theo tuổi: 3–4 tuổi → 2 hình, 4–5 tuổi → 3 hình, 5–6 tuổi → 4 hình.
- Chọn nhóm Đặc tính thì câu hỏi kiểm chứng là “Vì sao con biết tiếng này to hơn (nhanh hơn, cao hơn)?”.

**Luật chung của mọi trò chơi:**
- Nghe trước, chọn sau.
- Sai → “Thử lại nhé!”, tiếng báo nhẹ, cho nghe lại (trò Nối tự phát lại âm đang chọn).
- Điểm chỉ tính lần chạm **đầu tiên**; chạm nhiều ngón cùng lúc chỉ tính 1 lần.
- Cô bấm “Câu tiếp theo” để chuyển câu.
- Màn kết quả luôn động viên, kèm một gợi ý hoạt động thật.
- Màn chơi không có menu, chỉ có nút “Thoát” nhỏ, để trẻ không bấm lạc ra ngoài. Bấm Thoát hoặc khoá máy giữa 2 tiếng thì tiếng thứ hai không phát nữa.
- Ô trả lời của trò Phân biệt chỉ có màu và số chấm, không có hình loa, để trẻ không nhầm với nút nghe lại.

## 3. Hình ảnh và icon

- **Ảnh minh hoạ tạo bằng AI** (Pollinations, model `gpt-image-1-mini`, dùng mockup làm ảnh tham chiếu). Danh sách prompt: `web/assets-src/image-prompts.mjs`.
- **Toàn bộ 74 ảnh đã là ảnh AI:**
  - banner ghép lớp (nền phong cảnh, bé gái & thỏ, tai nghe, mặt trời);
  - 33 ảnh âm thanh;
  - 5 cảnh chủ đề;
  - 4 nhân vật thẻ CTA;
  - 5 hình trò chơi;
  - 4 mascot và logo (favicon tạo từ logo);
  - 11 hình trò chơi so sánh;
  - 7 hình dán trang trí.
- Chi phí 0 đồng: dùng tín dụng từ các quest của Pollinations (dùng model văn bản, âm thanh, agent; tạo agent “Gợi ý câu hỏi âm thanh”).
- Đã soi từng nhóm ảnh và tạo lại 5 ảnh:
  - vịt: ao nước tràn ra mép ảnh;
  - chuông xe đạp: bị cắt ở mép ảnh;
  - hình dán sóng âm: trông giống cử chỉ tay;
  - thẻ Góc giáo viên và hình dán giáo viên: có chữ trên bảng đen.
- **Tạo lại 1 ảnh chưa ưng:** sửa prompt rồi chạy `node --env-file=.env.local scripts/gen-images.mjs --only <id> --force && node scripts/process-images.mjs --only <id>`, sau đó `npm run build`. Chạy `npm run images` để tạo mọi ảnh còn thiếu (ví dụ khi thêm âm thanh mới).
- Ảnh gốc: `web/assets-src/images-raw/`. Ảnh tổng hợp để soi theo nhóm: `web/assets-src/sheets/`.
- Thẻ Góc giáo viên và hình dán giáo viên đã được tạo lại cho bảng đen không còn chữ hay số (chỉ hình bông hoa, ngôi sao, nốt nhạc).
- **Dung lượng:** ảnh xuất ra khoảng gấp đôi cỡ hiển thị. Tai nghe và bé gái ở banner có thêm bản nhỏ cho điện thoại (`variants` trong `image-prompts.mjs`). Favicon `web/src/app/icon.png` (192 px) được tạo lại từ logo mỗi lần chạy `process-images.mjs`.
- **Icon nhỏ ở menu và nút bấm:** bộ icon vector riêng (`web/src/components/Icon.tsx`), không dùng thư viện icon có sẵn. Đã gỡ Lucide và bỏ hết emoji.

## 4. Âm thanh

- 33/33 âm thanh + 3 bản nhạc là file thật, lấy từ Wikimedia Commons và BigSoundBank.
- Giấy phép: CC0, phạm vi công cộng hoặc CC BY. Từng file đã được kiểm tra lại giấy phép; nguồn ghi ở `/gioi-thieu`.
- Một bản chim hót bị loại vì giấy phép gốc cấm dùng thương mại.
- 5 cặp “Đặc tính” và tiếng phản hồi do nhóm tự tạo bằng ffmpeg (CC0).
- Âm lượng đã chuẩn hoá. Riêng cặp to–nhỏ giữ đúng chênh lệch khoảng 14 dB; bước build tự kiểm tra điều này.
- **Cần người nghe duyệt, nên thay bằng bản ghi ở Việt Nam nếu có:**
  - chợ: chợ đêm Philippines;
  - trẻ chơi đùa: có tiếng Pháp;
  - xe cứu thương: còi kiểu Pháp;
  - phách tre: bản ghi là claves;
  - thìa chạm bát: bản ghi là thìa trong cốc.
- “Trống lắc” đã đổi tên thành **“Xắc xô”** cho khớp bản ghi (tambourine) và tên gọi ở trường mầm non; mã `trong-lac` giữ nguyên.
- Trang Giới thiệu ghi rõ các bản ghi đã được cắt, lọc tạp âm, chuẩn hoá âm lượng, và gắn link tới giấy phép CC (yêu cầu của CC BY).
- Chưa có nhạc kể chuyện và nhạc thiếu nhi Việt Nam (cần xin phép tác giả).

**Thêm/sửa âm thanh:**
1. Sửa `web/src/data/*.json`.
2. Đặt file gốc vào `web/assets-src/audio-raw/` và khai báo nguồn/giấy phép trong `web/assets-src/audio-sources.*.json`.
3. Chạy `npm run audio`, rồi `npm run build`.

## 5. Kiểm thử đã chạy

- **`npm test`: 8/8 đạt.**
  - Không có 2 âm dễ nhầm trong cùng 1 câu hay cùng 1 bảng nối.
  - Lọc theo nhóm đúng.
  - Đáp án phân biệt đi đúng theo thứ tự phát.
  - Bài trộn không lặp âm.
  - Tìm kiếm: không dấu, bỏ từ đệm, mọi từ phải khớp trong cùng một trường (“động vật” không ra “đồng hồ”), gõ có dấu thì phân biệt “chó” với “chợ”; bỏ dấu kiểu cũ hay kiểu mới (“khoá”/“khóa”) đều được.
- **Dữ liệu (`npm run check-data`, chạy tự động trước build):** file tồn tại, id không trùng, nguồn/giấy phép đủ, `dimension`/`answer` của cặp so sánh hợp lệ, cặp to–nhỏ chênh ≥ 8 dB.
- **Trình duyệt thật (Playwright): chơi hết cả 5 trò chơi.** Kịch bản: `web/tests/e2e-games.mcp.js` (chạy bằng công cụ Playwright MCP, hướng dẫn ở đầu file). Kết quả lần chạy cuối: Nghe – chọn hình 5/6, Đoán 6/6 (4 hình), Nối 8/9.
  - Chọn sai không tính điểm; bấm nhiều lần không tính 2 lần.
  - Đoán ở mức 5–6 tuổi hiện đúng 4 hình.
  - Nối: chạm hình trước khi chạm loa thì có nhắc.
- **Trình phát nhạc:** vẫn phát khi chuyển trang và khi tìm kiếm từ header, dừng khi có hiệu ứng âm thanh. Trên điện thoại, nút điều khiển xuống hàng riêng.
- **Bộ lọc Góc giáo viên:** 8 → 6 → 2 gợi ý. “Tạo hoạt động” đổi được bộ âm thanh.
- **Bố cục:** mọi vùng chạm của trẻ ≥ 64 px; không tràn ngang ở 375 px; Tab/Enter dùng được ở khu người lớn; banner đủ nút ở 1024 px (iPad ngang); ở 1024–1279 px header có nút kính lúp dẫn tới ô tìm kiếm.
- **Lighthouse (mobile):** xem mục 7.
- **Cần người thật kiểm tra:**
  - iPad và máy tính bảng Android thật: âm thanh, cảm ứng, công tắc im lặng iPhone;
  - nếu có iPad chạy iPadOS dưới 16.4 thì phải hạ Tailwind xuống v3.4;
  - thử với 3–5 người dùng theo PDF §13.

## 6. Giả định đã tự quyết — cần nhóm xác nhận

1. Màu đậm hơn mockup để đạt tương phản AA:
   - nút hồng #D6336C;
   - chữ trong bóng thoại màu hồng đậm;
   - footer #3A6A9A.
2. Bỏ icon Facebook/YouTube ở footer. Icon avatar thành nút “Giới thiệu”, vì không có đăng nhập.
3. Chữ thẻ Góc sinh viên: “Giáo án mẫu, tài liệu thực hành / Xem tài liệu”, thay cho “Tham gia ngay”.
4. Không lưu điểm “Lần trước con được…”, vì cả lớp dùng chung máy.
5. Sau khi trẻ chọn đúng, **chờ cô bấm** “Câu tiếp theo”, không tự chuyển.
6. Số câu mỗi lượt:
   - Nghe – chọn hình / Đoán: 6 câu;
   - Nối: 3 bảng × 3 cặp;
   - Phân biệt: 5 câu;
   - Ôn tập nhanh: 6 câu.
   Mỗi lượt khoảng 3–7 phút, theo PDF §3.
7. Mọi nội dung sư phạm do AI viết (gợi ý hoạt động, giáo án, câu hỏi) đều gắn nhãn “Nội dung mẫu – cần nhóm GDMN duyệt”.
8. Tagline dự phòng: “Bé cùng khám phá thế giới qua âm thanh!” (PDF) và “Lắng nghe – Khám phá – Học mà chơi” (brief).

## 7. Lighthouse và công cụ

**Lighthouse (mobile), đo lại 24/09/2026 sau khi đổi sang ảnh AI** (bản build tĩnh; trang chủ và trang chủ đề lấy trung vị của 3 lần đo).

| Trang | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 88 | 100 | 100 | 100 |
| `/chu-de/tu-nhien` | 88 | 100 | 100 | 100 |
| `/on-tap` | 90 | 100 | 100 | 100 |
| `/on-tap/noi-am-thanh-hinh-anh` | 92 | 100 | 100 | 100 |
| `/thu-vien-nhac` | 92 | 100 | 100 | 100 |
| `/goc-giao-vien` | 93 | 100 | 100 | 100 |

- Lần đo đầu sau khi có ảnh AI: trang chủ chỉ đạt 76 (LCP mô phỏng 7,4 giây, tải 1,5 MB). Đã sửa:
  - xuất lại ảnh chủ đề, CTA và ảnh nổi bật đúng cỡ hiển thị;
  - thêm bản nhỏ cho banner trên điện thoại;
  - favicon từ 189 KB xuống 11 KB;
  - tải chậm (lazy) các lớp trang trí của banner và hình dán;
  - bỏ việc tải trước ảnh của trang 404.
  Sau khi sửa, trang chủ tải 962 KB.
- Performance vẫn thấp hơn bản SVG cũ (92–94) vì nay là ảnh vẽ thật. Phần còn lại chủ yếu là 2 font có chữ tiếng Việt (khoảng 150 KB). LCP đo thực trên máy chỉ khoảng 0,2 giây.

- **Công cụ đã dùng:**
  - Playwright MCP;
  - tài liệu Next.js 16 đi kèm gói cài;
  - Lighthouse CLI;
  - ffmpeg (gói `ffmpeg-static`);
  - Wikimedia Commons API;
  - sharp (tách nền, xuất WebP);
  - Pollinations API (tạo ảnh minh hoạ).
- **Lỗi của Next.js 16 khi build trên Windows:** file prefetch bị ghi sai tên. `scripts/fix-export-windows.mjs` tự sửa sau mỗi lần build; build trên Linux thì không bị lỗi này.

## 8. Nhóm cần bổ sung

- **Tên nhóm, thành viên, đơn vị và thông tin liên hệ:** trang `/gioi-thieu` đang để ô trống. Điền vào mục “Nhóm thực hiện” và “Liên hệ” trong `web/src/app/(site)/gioi-thieu/page.tsx`.
- Duyệt các âm thanh ghi ở mục 4 (nên thay bằng bản ghi ở Việt Nam nếu có) và bổ sung nhạc kể chuyện, nhạc thiếu nhi khi đã xin phép.
- Duyệt các nội dung có nhãn “Nội dung mẫu – cần nhóm GDMN duyệt”.
- Thử trên thiết bị thật và với người dùng thật (mục 5).
