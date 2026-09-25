# Thế giới Âm thanh

Website học liệu tương tác giúp trẻ mầm non (3–6 tuổi) khám phá âm thanh quanh mình. Trẻ nghe, nhận biết, phân loại, chọn và được phản hồi ngay. Giáo viên và sinh viên GDMN có gợi ý hoạt động, công cụ tạo hoạt động và giáo án mẫu.

Web là site tĩnh (Next.js 16, xuất ra HTML). Giáo viên và phụ huynh đăng ký, đăng nhập (Supabase Auth) mới dùng được các chức năng; người chưa đăng nhập chỉ xem được trang bìa và trang Giới thiệu. Trẻ không có tài khoản, web không thu thập dữ liệu của trẻ. Sau lần đăng nhập đầu, web chạy được cả khi không có mạng.

Web cần một project Supabase (miễn phí) để đăng nhập: xem mục [Cài Supabase](#cài-supabase).

Báo cáo bàn giao đầy đủ ở [docs/BAN_GIAO.md](docs/BAN_GIAO.md): những gì đã làm, giả định cần nhóm xác nhận, kết quả kiểm thử và việc nhóm cần bổ sung.

## Chạy thử

Cần Node.js 22.18 trở lên (test chạy thẳng file TypeScript bằng Node) và file `web/.env.local` có 2 biến Supabase (mục [Cài Supabase](#cài-supabase), bước 6). Thiếu 2 biến thì build trên máy vẫn chạy, chỉ cảnh báo, nhưng không ai đăng nhập được.

```bash
cd web
npm install
npm run dev      # xem khi đang sửa: http://localhost:3000
npm test         # kiểm tra logic trò chơi, tìm kiếm và danh sách trang cần đăng nhập
npm run build    # kiểm tra dữ liệu rồi xuất site tĩnh ra web/out/
npx serve out    # xem bản build
```

Đưa thư mục `web/out/` lên bất kỳ host tĩnh nào (Vercel, Netlify, GitHub Pages ở tên miền gốc).

**Vercel:** Add New → Project → chọn repo này → ở mục **Root Directory** chọn `web` (Framework Preset: Next.js, các lệnh build để mặc định) → ở mục **Environment Variables** thêm 2 biến Supabase (mục [Cài Supabase](#cài-supabase), bước 6) → Deploy. Sau đó mỗi lần push lên nhánh `main`, Vercel tự build và cập nhật web. Thiếu 2 biến thì build trên Vercel báo lỗi và web đang chạy giữ nguyên bản cũ.

## Cài Supabase

Supabase lo phần tài khoản (đăng ký, đăng nhập, quên mật khẩu). Chỉ cần làm một lần:

1. **Tạo project:** vào [supabase.com](https://supabase.com) → New project, vùng **Southeast Asia (Singapore)**.
2. **Authentication → Sign In / Providers → Email:**
   - để **“Confirm email” tắt** lúc đầu (lý do ở bước 4);
   - đặt độ dài mật khẩu tối thiểu (Minimum password length) là **8**.
3. **Authentication → URL Configuration:**
   - Site URL: `https://music-web-theta-ashy.vercel.app/`;
   - Redirect URLs, thêm 3 dòng: `https://music-web-theta-ashy.vercel.app/**`, `http://localhost:3000/**`, `http://127.0.0.1:4321/**`.
4. **Email:** email mặc định của Supabase **chỉ gửi tới thành viên trong nhóm Supabase của bạn** và tối đa 2 email mỗi giờ. Muốn giáo viên, phụ huynh nhận được email xác nhận hay email “Quên mật khẩu” thì:
   - cài SMTP miễn phí ở **Authentication → Emails → SMTP Settings**:
     - Gmail: bật xác minh 2 bước rồi tạo **mật khẩu ứng dụng**; host `smtp.gmail.com`, cổng `465`, username là địa chỉ Gmail, password là mật khẩu ứng dụng;
     - hoặc Brevo: host `smtp-relay.brevo.com`, cổng `587`, username và SMTP key lấy ở trang SMTP & API của Brevo; email người gửi phải được xác minh trong Brevo;
   - xem lại số email được gửi mỗi giờ ở **Authentication → Rate Limits**;
   - thử “Quên mật khẩu” với một email ngoài nhóm, nhận được rồi mới **bật “Confirm email”**.
5. **Mẫu email tiếng Việt** (Authentication → Emails → Templates). Giữ nguyên `{{ .ConfirmationURL }}`, Supabase tự thay bằng link.
   - **Confirm signup:** Subject `Xác nhận tài khoản Thế giới Âm thanh`, Body:
     ```html
     <h2>Chào mừng đến với Thế giới Âm thanh!</h2>
     <p>Bấm vào link dưới đây để xác nhận email và bắt đầu dùng website:</p>
     <p><a href="{{ .ConfirmationURL }}">Xác nhận tài khoản</a></p>
     <p>Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
     ```
   - **Reset password:** Subject `Đặt lại mật khẩu Thế giới Âm thanh`, Body:
     ```html
     <h2>Đặt lại mật khẩu</h2>
     <p>Bấm vào link dưới đây để đặt mật khẩu mới. Link chỉ dùng được một lần.</p>
     <p><a href="{{ .ConfirmationURL }}">Đặt mật khẩu mới</a></p>
     <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này; mật khẩu cũ vẫn dùng được.</p>
     ```
6. **Lấy khoá:** lấy **Project URL** (dạng `https://<mã>.supabase.co`, ở nút Connect của project) và **Publishable key** (Project Settings → API Keys, bắt đầu bằng `sb_publishable_`). Hai giá trị này công khai, an toàn khi gửi. **Tuyệt đối không dùng hay gửi secret key** (`sb_secret_…` hoặc `service_role`).
   - Vercel: Settings → Environment Variables, chọn **Production** và **Preview**, rồi Redeploy (biến được gắn vào web lúc build):
     - `NEXT_PUBLIC_SUPABASE_URL` = Project URL;
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = Publishable key.
   - Trên máy: thêm 2 dòng cùng tên vào `web/.env.local` (file này không đưa lên git):
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://<mã>.supabase.co
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
     ```
7. **Lưu ý:**
   - project miễn phí **tự tạm dừng sau 7 ngày** không ai dùng; khi đó không đăng ký hay đăng nhập mới được. Vào Supabase, mở project, bấm **Restore**;
   - có người xin xoá tài khoản (theo Chính sách bảo mật ở `/gioi-thieu/`): Authentication → Users → chọn người đó → Delete user.

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `document/` | Tài liệu gốc: brief, đề xuất MVP (PDF), mockup, tài liệu tham khảo |
| `docs/` | Báo cáo bàn giao và ảnh chụp màn hình |
| `web/src/data/` | **Nội dung**: âm thanh, nhóm, cặp so sánh, nhạc, gợi ý hoạt động (JSON) |
| `web/src/app/` | Các trang. `(public)` là trang ai cũng xem được (trang bìa, giới thiệu, đăng nhập, đăng ký, quên/đặt lại mật khẩu); `(site)` là trang thường và `(game)` là màn chơi toàn màn hình, cả hai cần đăng nhập |
| `web/src/components/` | Thành phần giao diện; `game/` là các trò chơi |
| `web/src/lib/` | Phát âm thanh, nhạc, logic trò chơi, tìm kiếm, đăng nhập (`auth.ts`; danh sách trang công khai ở `auth-paths.ts`) |
| `web/public/` | File âm thanh (MP3) và ảnh (WebP) đã xử lý |
| `web/scripts/` | Kiểm tra dữ liệu, xử lý âm thanh, tạo và xử lý ảnh |
| `web/assets-src/` | Nguồn của âm thanh và ảnh: danh sách nguồn/giấy phép, prompt ảnh, ảnh AI gốc, mockup tham chiếu |
| `web/tests/` | Test logic (`npm test`) và kịch bản Playwright MCP: chơi thử 5 trò chơi, thử đăng nhập |

## Sửa nội dung

Phần lớn nội dung nằm trong các file JSON ở `web/src/data/`. Sửa xong chạy `npm run build`: bước kiểm tra dữ liệu sẽ báo lỗi rõ ràng nếu thiếu file, trùng id hay thiếu nguồn/giấy phép.

- **Thêm hoặc đổi âm thanh:** đặt file gốc vào `web/assets-src/audio-raw/`, khai báo nguồn và giấy phép trong `web/assets-src/audio-sources.*.json`, chạy `npm run audio`. Chỉ dùng âm thanh CC0, phạm vi công cộng hoặc CC BY.
- **Tạo ảnh minh hoạ:** thêm prompt vào `web/assets-src/image-prompts.mjs`, đặt `POLLINATIONS_API_KEY` trong `web/.env.local` (file này không đưa lên git), rồi chạy `npm run images`.
- **Bản ghi gốc** (`web/assets-src/audio-raw/`, 106 MB) không đưa lên git. Tải lại theo `pageUrl` trong `audio-sources.*.json` khi cần xử lý lại.
