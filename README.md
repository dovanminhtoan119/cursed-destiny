# Jujutsu Kaisen: Cursed Destiny

Fan game nhập vai chạy trên trình duyệt, dựng theo bộ luật **Universal Multiverse RPG Engine** (Mode B: Web RPG).
Nhân vật chính: **Shen**, người bất ngờ nhận được Hệ thống.

Chơi tại: https://dovanminhtoan119.github.io/cursed-destiny/

## Cấu trúc
- `js/engine.js` — lõi: Level/EXP `floor(100 × L^1.5)`, 6 chỉ số, chỉ số phái sinh, Rank E–SSS, Thiện–Ác 7 bậc, danh vọng, sổ nhân quả, chiến đấu, lưu/xuất/nhập có mã kiểm tra.
- `js/data.js` — đặc tính, thuật thức, Thiên dữ chú phược, kỹ năng, vật phẩm, bảng sức mạnh NPC/chú linh, lộ trình 13 arc, luật thế giới.
- `js/story.js` — cốt truyện (Mở đầu + Arc 1).
- `js/ui.js`, `css/style.css` — giao diện.
- `tests/engine.test.js` — unit test công thức + 200 lượt chơi thử tự động: `node tests/engine.test.js`.

Sau khi sửa `app.part.html`, chạy `sh build.sh` để tạo lại `index.html`.
