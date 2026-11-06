# Jujutsu Kaisen: Cursed Destiny

Fan game nhập vai chạy trên trình duyệt, dựng theo bộ luật **Universal Multiverse RPG Engine** (Mode B: Web RPG).
Nhân vật chính: **Shen**, người bất ngờ nhận được Hệ thống.

Chơi tại: https://dovanminhtoan119.github.io/cursed-destiny/

## Cấu trúc
- `js/engine.js` — lõi: Level/EXP `floor(100 × L^1.5)`, 6 chỉ số, chỉ số phái sinh, Rank E–SSS, Thiện–Ác 7 bậc, danh vọng, sổ nhân quả, chiến đấu, lưu/xuất/nhập có mã kiểm tra.
- `js/data.js` — 20 đặc tính (cộng theo hệ số), thuật thức, Thiên dữ chú phược, kỹ năng, vật phẩm, bảng sức mạnh NPC/chú linh, lộ trình 13 arc, luật thế giới.
- `js/gear.js` — trang bị Bậc E–SSS × 7 Phẩm, thuộc tính phụ, rơi đồ, kỹ năng có Bậc, thưởng thăng bậc D→SSS.
- `js/domain.js` — Bành trướng lãnh địa: 3 cấp độ, 8 lãnh địa theo thuật thức, mở khóa theo Rank/Level/INT/WIS/Chú lực.
- `js/world.js` — quan hệ NPC, khu tự do (ngày/buổi), cửa hàng, thưởng đột phá, kẻ địch Arc 2–3.
- `js/story.js`, `js/story2.js` — cốt truyện Mở đầu, Arc 1, Arc 2 (Đối đầu Mahito), Arc 3 (Giao lưu Kyoto).
- `js/art.js` — phông cảnh ngày/đêm theo địa điểm, chân dung Shen và chú linh nguyên bản (nhân vật nguyên tác hiển thị bằng ấn bùa).
- `js/ui.js`, `css/style.css` — giao diện (Times New Roman).
- `tests/engine.test.js` — unit test công thức + 120 lượt chơi thử tự động qua 3 arc: `node tests/engine.test.js`.

Sau khi sửa `app.part.html`, chạy `sh build.sh` để tạo lại `index.html`.
