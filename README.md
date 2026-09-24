# Thế giới Âm thanh

Website học liệu tương tác giúp trẻ mầm non (3–6 tuổi) khám phá âm thanh quanh mình. Trẻ nghe, nhận biết, phân loại, chọn và được phản hồi ngay. Giáo viên và sinh viên GDMN có gợi ý hoạt động, công cụ tạo hoạt động và giáo án mẫu.

Web là site tĩnh (Next.js 16, xuất ra HTML). Không có đăng nhập, không thu thập dữ liệu của trẻ, chạy được cả khi không có mạng.

Báo cáo bàn giao đầy đủ ở [docs/BAN_GIAO.md](docs/BAN_GIAO.md): những gì đã làm, giả định cần nhóm xác nhận, kết quả kiểm thử và việc nhóm cần bổ sung.

## Chạy thử

Cần Node.js 22.18 trở lên (test chạy thẳng file TypeScript bằng Node).

```bash
cd web
npm install
npm run dev      # xem khi đang sửa: http://localhost:3000
npm test         # kiểm tra logic trò chơi và tìm kiếm
npm run build    # kiểm tra dữ liệu rồi xuất site tĩnh ra web/out/
npx serve out    # xem bản build
```

Đưa thư mục `web/out/` lên bất kỳ host tĩnh nào (Vercel, Netlify, GitHub Pages ở tên miền gốc).

**Vercel:** Add New → Project → chọn repo này → ở mục **Root Directory** chọn `web` (Framework Preset: Next.js, các lệnh build để mặc định) → Deploy. Sau đó mỗi lần push lên nhánh `main`, Vercel tự build và cập nhật web.

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `document/` | Tài liệu gốc: brief, đề xuất MVP (PDF), mockup, tài liệu tham khảo |
| `docs/` | Báo cáo bàn giao và ảnh chụp màn hình |
| `web/src/data/` | **Nội dung**: âm thanh, nhóm, cặp so sánh, nhạc, gợi ý hoạt động (JSON) |
| `web/src/app/` | Các trang. `(site)` là trang thường; `(game)` là màn chơi toàn màn hình |
| `web/src/components/` | Thành phần giao diện; `game/` là các trò chơi |
| `web/src/lib/` | Phát âm thanh, nhạc, logic trò chơi, tìm kiếm |
| `web/public/` | File âm thanh (MP3) và ảnh (WebP) đã xử lý |
| `web/scripts/` | Kiểm tra dữ liệu, xử lý âm thanh, tạo và xử lý ảnh |
| `web/assets-src/` | Nguồn của âm thanh và ảnh: danh sách nguồn/giấy phép, prompt ảnh, ảnh AI gốc, mockup tham chiếu |
| `web/tests/` | Test logic (`npm test`) và kịch bản chơi thử 5 trò chơi bằng Playwright MCP |

## Sửa nội dung

Phần lớn nội dung nằm trong các file JSON ở `web/src/data/`. Sửa xong chạy `npm run build`: bước kiểm tra dữ liệu sẽ báo lỗi rõ ràng nếu thiếu file, trùng id hay thiếu nguồn/giấy phép.

- **Thêm hoặc đổi âm thanh:** đặt file gốc vào `web/assets-src/audio-raw/`, khai báo nguồn và giấy phép trong `web/assets-src/audio-sources.*.json`, chạy `npm run audio`. Chỉ dùng âm thanh CC0, phạm vi công cộng hoặc CC BY.
- **Tạo ảnh minh hoạ:** thêm prompt vào `web/assets-src/image-prompts.mjs`, đặt `POLLINATIONS_API_KEY` trong `web/.env.local` (file này không đưa lên git), rồi chạy `npm run images`.
- **Bản ghi gốc** (`web/assets-src/audio-raw/`, 106 MB) không đưa lên git. Tải lại theo `pageUrl` trong `audio-sources.*.json` khi cần xử lý lại.
