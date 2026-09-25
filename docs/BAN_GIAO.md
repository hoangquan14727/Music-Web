# Bàn giao — Website “Thế giới Âm thanh” (đợt 1 + đợt 2 + rà soát cuối + đăng nhập)

Ngày: 23/09/2026, cập nhật 24/09/2026 và 25/09/2026 (đăng nhập, trang bìa, phiếu bé ngoan) · Hướng dẫn nhanh (kể cả cách cài Supabase): `README.md` ở thư mục gốc · Mã nguồn: thư mục `web/` · Ảnh chụp: `docs/screenshots/` (375 / 768 / 1440 px, màn trò chơi ở 1024 px)

## 1. Chạy thử

```bash
cd web
npm install
npm run dev          # xem khi đang sửa: http://localhost:3000
npm test             # logic trò chơi, tìm kiếm và danh sách trang cần đăng nhập (12 bài test)
npm run build        # xuất site tĩnh ra web/out/ (tự kiểm tra dữ liệu trước khi build)
npx serve out        # xem bản build; sau lần đăng nhập đầu, demo được cả khi không có mạng
```

Cần 2 biến Supabase trong `web/.env.local` (README, mục “Cài Supabase”). Thiếu thì build trên máy chỉ cảnh báo và mọi người đều là khách.

Có thể đưa `web/out/` lên bất kỳ host tĩnh nào (Vercel, Netlify, GitHub Pages ở tên miền gốc).

## 2. Đã làm

Trang ghi **công khai** thì ai cũng xem được; mọi trang khác (kể cả đường dẫn lạ) cần đăng nhập (mục 2b).

| Trang | Nội dung |
|---|---|
| `/` Trang bìa (**công khai**) | Giới thiệu ngắn cho người chưa đăng nhập: bên trong có gì, dành cho ai (giáo viên, phụ huynh), 3 bước bắt đầu, an toàn cho bé, nút “Đăng ký miễn phí”. Đã đăng nhập thì tự sang `/trang-chu` |
| `/dang-nhap`, `/dang-ky` (**công khai**) | Đăng nhập bằng email + mật khẩu (có nút gửi lại email xác nhận khi tài khoản chưa xác nhận). Đăng ký: họ tên, vai trò Giáo viên / Phụ huynh, email, mật khẩu ≥ 8 ký tự, ô xác nhận là người lớn và đồng ý Chính sách bảo mật |
| `/quen-mat-khau`, `/dat-lai-mat-khau` (**công khai**) | Gửi link đặt lại mật khẩu qua email (luôn hiện cùng một thông báo, không lộ email nào có tài khoản); đặt mật khẩu mới từ link đó hoặc từ “Đổi mật khẩu” trong menu tài khoản |
| `/trang-chu` Trang chủ ứng dụng | Banner, 5 chủ đề, 5 âm thanh nổi bật (phát ngay tại chỗ), 4 khu mở rộng, băng khẩu hiệu, footer (trước đây nằm ở `/`) |
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
| `/gioi-thieu` (**công khai**) | Định vị dự án, liên hệ, chính sách bảo mật (tài khoản người lớn, không có dữ liệu của trẻ, cách xin xoá tài khoản), hỗ trợ, nguồn âm thanh, tài liệu tham khảo (đúng danh sách PDF §15) |
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
- **Phiếu bé ngoan** (cả 5 trò chơi): dưới màn kết quả, cô gõ tên bé rồi bấm “In phiếu / Lưu PDF”.
  - Bản in chỉ có phiếu, 1 trang A4 ngang, giữ màu; để trống tên thì in dòng chấm để ghi tay.
  - Tên chỉ dùng để in, không lưu vào máy hay gửi đi đâu.
  - Code: `web/src/components/game/GoodKidCertificate.tsx`.
- Màn chơi không có menu, chỉ có nút “Thoát” nhỏ, để trẻ không bấm lạc ra ngoài. Bấm Thoát hoặc khoá máy giữa 2 tiếng thì tiếng thứ hai không phát nữa.
- Ô trả lời của trò Phân biệt chỉ có màu và số chấm, không có hình loa, để trẻ không nhầm với nút nghe lại.

## 2b. Đăng nhập

- **Supabase Auth** (gói `@supabase/auth-js`, chỉ tải khi cần). Web vẫn là site tĩnh. Cách cài: README, mục “Cài Supabase”.
- **Tài khoản chỉ cho người lớn:** Giáo viên hoặc Phụ huynh. Lưu họ tên, email, vai trò. Trẻ không có tài khoản.
- **Trang công khai:** `/`, `/gioi-thieu`, 4 trang tài khoản. Danh sách duy nhất nằm ở `web/src/lib/auth-paths.ts`. Trang mới đặt trong `web/src/app/(public)/` thì phải thêm vào danh sách; `npm test` tự quét và báo lỗi nếu lệch.
- **Cách chặn (ở trình duyệt, 2 lớp):**
  - script đầu trang chạy trước khi vẽ: khách vào trang cần đăng nhập thì sang `/dang-nhap/?next=…` ngay, không thấy chớp trang; đã đăng nhập mà mở `/` thì sang `/trang-chu`;
  - `AuthGuard` kiểm tra lại mỗi lần chuyển trang bên trong web;
  - đăng nhập xong quay về đúng trang định vào; `next` chỉ nhận trang trong web (link lạ hay độc hại thì về `/trang-chu`).
- **Giới hạn:** chỉ phần giao diện đòi đăng nhập. Trang, ảnh và âm thanh vẫn tải được nếu ai biết đường dẫn trực tiếp (quyết định 10).
- **Phiên đăng nhập** lưu trong trình duyệt (`localStorage`, khoá `tgat-auth`):
  - sau lần đăng nhập đầu vẫn dùng được khi mất mạng; mất mạng không bị đăng xuất;
  - đăng xuất ở tab này thì tab khác cũng đăng xuất.
- **Link “Quên mật khẩu”:**
  - link trong email trỏ về web (`/dat-lai-mat-khau/?token_hash=…`), không qua `supabase.co` (ít vào Spam hơn);
  - mở link chưa tạo phiên đăng nhập nào: mã trong link rời thanh địa chỉ ngay, chỉ nằm trong trang đang mở; header vẫn là “Đăng nhập” / “Đăng ký”;
  - link chỉ được kiểm tra lúc bấm “Lưu mật khẩu mới”. Phiên của link chỉ nằm trong bộ nhớ trang, không bao giờ lưu vào trình duyệt, và bị huỷ ngay sau khi đổi mật khẩu; web đăng nhập bằng mật khẩu mới rồi vào `/trang-chu`;
  - rời trang, tải lại, Back/Forward, đóng tab: không còn gì để dùng lại (máy dùng chung an toàn), trang báo link không còn dùng được;
  - link kiểu cũ (`#access_token=…`, email gửi trước khi đổi mẫu) bị từ chối ở mọi trang: chuyển sang `/dat-lai-mat-khau/?link=cu` với lời nhắn gửi lại link mới.
- **Menu tài khoản** (vòng tròn chữ cái đầu tên ở header; trên điện thoại nằm trong menu): tên, vai trò, email, “Đổi mật khẩu”, “Đăng xuất”. Đăng xuất thì về trang bìa, bấm Back cũng không vào lại được.
- **Thiếu 2 biến Supabase:** build trên máy chỉ cảnh báo, form báo “Đăng nhập chưa được cấu hình”; build trên Vercel báo lỗi và web đang chạy giữ bản cũ.
- Code: `web/src/lib/auth.ts`, `web/src/lib/auth-paths.ts`, `web/src/components/AuthGuard.tsx`, script đầu trang trong `web/src/app/layout.tsx`, các trang trong `web/src/app/(public)/`.

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

## 3b. Hiệu ứng chuyển động

Toàn bộ hiệu ứng làm bằng CSS và một ít React, không thêm thư viện. Dùng chung trong `web/src/app/globals.css`, riêng từng khu trong `web/src/app/motion/*.css`.
- **Màn chào khi mở web:** logo trong huy hiệu tròn với các vòng sóng âm lan ra, chữ “Thế giới Âm thanh” trồi lên, thanh tiến trình chạy theo tiến độ tải thật (trang, phông chữ, ảnh banner). Hiện ít nhất khoảng 1 giây, lâu nhất khoảng 2,4 giây, rồi kéo lên như tấm rèm; hiệu ứng của trang (banner…) bắt đầu đúng lúc rèm kéo lên.
  - Chỉ hiện ở lần đầu mở web trong mỗi tab. Muốn xem lại: mở tab mới rồi gõ địa chỉ web (tab mở từ link bên trong web, tab mở ở chế độ nền, hay trình duyệt chặn bộ nhớ thì không hiện).
  - Chạm, bấm phím hoặc cuộn chuột để bỏ qua; cú chạm đó không bấm nhầm vào nút bên dưới.
  - Trình duyệt tắt JavaScript: không có màn chào.
  - Code: `Intro` trong `web/src/components/Loader.tsx`, script đầu trang trong `web/src/app/layout.tsx`, `web/src/app/motion/loading.css`.
- **Thanh tải trang:** bấm sang trang khác thì một thanh mảnh xanh–hồng chạy ở mép trên màn hình, đầy rồi mờ đi khi trang mới hiện; chuyển trang nhanh thì không hiện. Màn chờ vào trò chơi (khi mạng chậm) dùng cùng kiểu logo và thanh mảnh.
- **Ảnh đang tải:** ảnh nội dung phía dưới trang (thẻ chủ đề, thẻ âm thanh…) hiện khung màu nhạt nhấp nháy nhẹ trong lúc tải, tải xong thì hiện dần. Ảnh banner và hình trang trí không đổi.
- **Chuyển trang:** trang cũ mờ đi, trang mới trồi lên (React `<ViewTransition>`); header và trình phát nhạc đứng yên.
- **Xuất hiện:** banner (bóng thoại, tiêu đề, các lớp hình), thẻ chủ đề và thẻ âm thanh lần lượt hiện; các khối hiện dần khi cuộn tới.
- **Biến mất:** menu điện thoại, trình phát nhạc khi bấm ✕, câu hỏi cũ trượt ra khi sang câu mới, các lựa chọn sai thu nhỏ khi trẻ chọn đúng.
- **Lặp lại (chỉ trên hình trang trí):** mặt trời có tia sáng quay chậm, tai nghe bay lơ lửng, nốt nhạc bay lên, mây trôi, sóng âm quanh thẻ đang phát, mascot nhún nhảy.
- **Phản hồi trong trò chơi:** đúng → thẻ nảy, dấu tích, sao bung ra; sai → chỉ lắc nhẹ như cũ; màn kết quả có 3 ngôi sao và pháo giấy.
- **Bật/tắt:** hiệu ứng chạy cả khi máy bật “Giảm chuyển động” (nhiều máy Windows tắt sẵn “Animation effects”). Nút **“Tắt hiệu ứng”** ở footer các trang, ở màn bắt đầu/kết quả của trò chơi và ở trang 404 tắt hết hiệu ứng (không đặt giữa lượt chơi để trẻ khỏi bấm nhầm); lựa chọn lưu trên trình duyệt đó (`localStorage`, khoá `tgat-motion`), áp dụng cả trong trò chơi. Code: `web/src/lib/motion.ts`, `web/src/components/MotionToggle.tsx`.
- **Nguyên tắc đã kiểm tra:**
  - không nhấp nháy quá 3 lần/giây, vòng lặp chậm (≥ 1,5 giây);
  - nút bấm không tự chạy lung tung;
  - bấm “Tắt hiệu ứng” thì tắt hết hiệu ứng (kể cả màn chào và thanh tải trang), mọi nội dung vẫn hiện đủ;
  - bản in không có hiệu ứng;
  - dùng bàn phím: Esc đóng menu điện thoại.

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

- **`npm test`: 12/12 đạt** (8 bài trò chơi và tìm kiếm trong `tests/quiz.test.ts`, 4 bài đăng nhập trong `tests/auth-paths.test.ts`).
  - Không có 2 âm dễ nhầm trong cùng 1 câu hay cùng 1 bảng nối.
  - Lọc theo nhóm đúng.
  - Đáp án phân biệt đi đúng theo thứ tự phát.
  - Bài trộn không lặp âm.
  - Tìm kiếm: không dấu, bỏ từ đệm, mọi từ phải khớp trong cùng một trường (“động vật” không ra “đồng hồ”), gõ có dấu thì phân biệt “chó” với “chợ”; bỏ dấu kiểu cũ hay kiểu mới (“khoá”/“khóa”) đều được.
  - Đăng nhập: `next` trỏ ra ngoài web hay độc hại (`//evil.com`, `/\evil.com`, `javascript:`…) hoặc trỏ tới trang công khai thì về `/trang-chu`; trang trong web thì giữ nguyên cả `?` và `#`.
  - Quét `web/src/app`: mọi trang trong `(public)` đều công khai, mọi trang khác đều cần đăng nhập.
- **Dữ liệu (`npm run check-data`, chạy tự động trước build):** file tồn tại, id không trùng, nguồn/giấy phép đủ, `dimension`/`answer` của cặp so sánh hợp lệ, cặp to–nhỏ chênh ≥ 8 dB.
- **Trình duyệt thật (Playwright): chơi hết cả 5 trò chơi.** Kịch bản: `web/tests/e2e-games.mcp.js` (chạy bằng công cụ Playwright MCP, hướng dẫn ở đầu file). Kết quả lần chạy cuối (sau khi thêm hiệu ứng): Nghe – chọn hình 5/6, Đoán 6/6 (4 hình), Nối 8/9. Câu hỏi đổi trong hiệu ứng chuyển cảnh, nên kịch bản chờ câu cũ rời khỏi trang rồi mới đọc câu mới.
  - Chọn sai không tính điểm; bấm nhiều lần không tính 2 lần.
  - Đoán ở mức 5–6 tuổi hiện đúng 4 hình.
  - Nối: chạm hình trước khi chạm loa thì có nhắc.
  - Từ khi có đăng nhập, kịch bản tạo sẵn một phiên giả trong `tgat-auth` nên chạy không cần mạng hay tài khoản thật.
- **Kịch bản đăng nhập:** `web/tests/e2e-auth.mcp.js` (khách bị chuyển sang trang đăng nhập, `/` là trang bìa, `next` độc hại bị chặn, đăng xuất rồi bấm Back không vào lại được, link đặt lại mật khẩu không bao giờ lưu phiên của link — có bước đổi mật khẩu thành công với Supabase giả lập, link cũ bị từ chối).
- **Trình phát nhạc:** vẫn phát khi chuyển trang và khi tìm kiếm từ header, dừng khi có hiệu ứng âm thanh. Trên điện thoại, nút điều khiển xuống hàng riêng.
- **Bộ lọc Góc giáo viên:** 8 → 6 → 2 gợi ý. “Tạo hoạt động” đổi được bộ âm thanh.
- **Bố cục:** mọi vùng chạm của trẻ ≥ 64 px; không tràn ngang ở 375 px; Tab/Enter dùng được ở khu người lớn; banner đủ nút ở 1024 px (iPad ngang); ở 1024–1279 px header có nút kính lúp dẫn tới ô tìm kiếm.
- **Lighthouse (mobile):** xem mục 7.
- **Cần người thật kiểm tra:**
  - iPad và máy tính bảng Android thật: âm thanh, cảm ứng, công tắc im lặng iPhone;
  - nếu có iPad chạy iPadOS dưới 16.4 thì phải hạ Tailwind xuống v3.4;
  - thử với 3–5 người dùng theo PDF §13;
  - với project Supabase thật: đăng ký, đăng nhập, sai mật khẩu báo lỗi tiếng Việt, đăng xuất ở tab này thì tab kia cũng đăng xuất; khi đã có SMTP thì thử “Quên mật khẩu” và mở link xác nhận trên máy khác.

## 6. Giả định đã tự quyết — cần nhóm xác nhận

1. Màu đậm hơn mockup để đạt tương phản AA:
   - nút hồng #D6336C;
   - chữ trong bóng thoại màu hồng đậm;
   - footer #3A6A9A.
2. Bỏ icon Facebook/YouTube ở footer. Icon avatar ở header nay là **menu tài khoản** (vòng tròn chữ cái đầu tên: tên, vai trò, email, “Đổi mật khẩu”, “Đăng xuất”).
3. Chữ thẻ Góc sinh viên: “Giáo án mẫu, tài liệu thực hành / Xem tài liệu”, thay cho “Tham gia ngay”.
4. Không lưu điểm “Lần trước con được…”, vì cả lớp dùng chung máy. Tên bé gõ trên Phiếu bé ngoan cũng không lưu: in xong là mất.
5. Sau khi trẻ chọn đúng, **chờ cô bấm** “Câu tiếp theo”, không tự chuyển.
6. Số câu mỗi lượt:
   - Nghe – chọn hình / Đoán: 6 câu;
   - Nối: 3 bảng × 3 cặp;
   - Phân biệt: 5 câu;
   - Ôn tập nhanh: 6 câu.
   Mỗi lượt khoảng 3–7 phút, theo PDF §3.
7. Mọi nội dung sư phạm do AI viết (gợi ý hoạt động, giáo án, câu hỏi) đều gắn nhãn “Nội dung mẫu – cần nhóm GDMN duyệt”.
8. Tagline dự phòng: “Bé cùng khám phá thế giới qua âm thanh!” (PDF) và “Lắng nghe – Khám phá – Học mà chơi” (brief).
9. Hiệu ứng **không theo** cài đặt “Giảm chuyển động” của máy (nhóm yêu cầu: máy trường thường tắt sẵn nên không thấy hiệu ứng nào). Thay bằng nút “Tắt hiệu ứng” (footer, màn bắt đầu/kết quả trò chơi, trang 404), nên vẫn đạt WCAG 2.2.2 (dừng/tạm dừng nội dung chuyển động).
10. **Chặn đăng nhập ở trình duyệt** (nhóm đã chọn): web vẫn là site tĩnh, host miễn phí trên Vercel, không cần máy chủ riêng. Đổi lại, trang, ảnh và âm thanh vẫn tải được nếu biết đường dẫn trực tiếp; nội dung không có gì bí mật nên nhóm chấp nhận. Muốn chặn cả file thì phải có máy chủ kiểm tra đăng nhập ở từng lần tải.

## 7. Lighthouse và công cụ

**Lighthouse (mobile), đo lại 24/09/2026 sau khi thêm hiệu ứng** (bản build tĩnh; trang chủ và Thư viện nhạc lấy trung vị của 3 lần đo; số trong ngoặc là trước khi thêm hiệu ứng).

| Trang | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (nay là `/trang-chu`) | 87 (88) | 100 | 100 | 100 |
| `/chu-de/tu-nhien` | 88 (88) | 100 | 100 | 100 |
| `/on-tap` | 90 (90) | 100 | 100 | 100 |
| `/on-tap/noi-am-thanh-hinh-anh` | 92 (92) | 100 | 100 | 100 |
| `/thu-vien-nhac` | 89 (92) | 100 | 100 | 100 |
| `/goc-giao-vien` | 93 (93) | 100 | 100 | 100 |

**Đo từ khi có đăng nhập:**
- Lighthouse CLI chỉ vào được trang công khai: đo `/` (trang bìa) và `/dang-nhap`. Mục tiêu không thấp hơn 87 / 100 / 100 / 100.
- Trang cần đăng nhập: CLI sẽ bị chuyển sang trang đăng nhập. Đo bằng tab Lighthouse trong DevTools của Chrome, ở tab đã đăng nhập (chế độ Mobile).

- Lần đo đầu sau khi có ảnh AI: trang chủ chỉ đạt 76 (LCP mô phỏng 7,4 giây, tải 1,5 MB). Đã sửa:
  - xuất lại ảnh chủ đề, CTA và ảnh nổi bật đúng cỡ hiển thị;
  - thêm bản nhỏ cho banner trên điện thoại;
  - favicon từ 189 KB xuống 11 KB;
  - tải chậm (lazy) các lớp trang trí của banner và hình dán;
  - bỏ việc tải trước ảnh của trang 404.
  Sau khi sửa, trang chủ tải 962 KB.
- Hiệu ứng làm file CSS chặn hiển thị tăng từ khoảng 10 KB lên 16 KB, nên điểm giảm 0–3. CLS vẫn bằng 0 và phần tử LCP không có hiệu ứng mờ dần.
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

- **Tên nhóm, thành viên, đơn vị và thông tin liên hệ:** trang `/gioi-thieu` đang để ô trống. Điền vào mục “Nhóm thực hiện” và “Liên hệ” trong `web/src/app/(public)/gioi-thieu/page.tsx`. Mục Liên hệ cần có **email nhận yêu cầu xoá tài khoản** (Chính sách bảo mật hướng người dùng tới đó).
- **Project Supabase** (README, mục “Cài Supabase”): tạo project, đặt 2 biến `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` trên Vercel (Production + Preview) **trước khi push**, và vào “Restore” khi project bị tạm dừng.
- **SMTP miễn phí** (Gmail hoặc Brevo) để giáo viên, phụ huynh nhận được email xác nhận và email “Quên mật khẩu”; có SMTP rồi mới bật “Confirm email”.
- Duyệt các âm thanh ghi ở mục 4 (nên thay bằng bản ghi ở Việt Nam nếu có) và bổ sung nhạc kể chuyện, nhạc thiếu nhi khi đã xin phép.
- Duyệt các nội dung có nhãn “Nội dung mẫu – cần nhóm GDMN duyệt”.
- Thử trên thiết bị thật và với người dùng thật (mục 5).
