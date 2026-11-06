/* =====================================================================
   CURSED DESTINY — THẾ GIỚI MỞ RỘNG
   Vật phẩm, kẻ địch mới, quan hệ NPC, khu tự do, cửa hàng, thưởng đột phá.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {}), D = CD.DATA;
  const mk = (name, rank, lv, w, extra) => {
    const total = 30 + 5 * (lv - 1), sum = w.reduce((a, b) => a + b, 0), keys = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"], stats = {};
    keys.forEach((k, i) => (stats[k] = Math.max(1, Math.round((total * w[i]) / sum))));
    return Object.assign({ name, rank, lv, stats }, extra || {});
  };
  const st = (STR, AGI, VIT, INT, WIS, LUK) => ({ STR, AGI, VIT, INT, WIS, LUK });

  /* ---------- KỸ NĂNG MỚI ---------- */
  Object.assign(D.SKILLS, {
    sk_step: { name: "Bộ pháp chú lực", cost: { sta: 15 }, cd: 3, effect: { blind: 0.25 }, desc: "Di chuyển lắt léo, giảm 25% khả năng đánh trúng của mục tiêu trong 2 lượt. Tốn 15 Thể lực, hồi chiêu 3 lượt." },
    sk_block: { name: "Đòn chặn chú lực", cost: { ce: 20 }, cd: 3, effect: { dmg: { src: "hybrid", mult: 1.2 }, debuff: { stat: "atk", pct: 0.25, turns: 2, label: "giảm 25% tấn công" } }, desc: "(Tấn công + 0.5×Uy lực) ×1.2 và giảm 25% tấn công mục tiêu 2 lượt. Tốn 20 Chú lực, hồi chiêu 3 lượt." },
    sk_sweep: { name: "Quét chân", cost: { sta: 18 }, cd: 3, effect: { dmg: { src: "patk", mult: 1.3 }, stun: 0.35 }, desc: "Tấn công vật lý ×1.3, 35% khiến mục tiêu mất lượt. Tốn 18 Thể lực, hồi chiêu 3 lượt. (Maki truyền dạy)" },
    // Thông thạo thuật thức Bậc 1 (thưởng đột phá Rank C)
    tk_anlien: { tech: true, name: "Ấn Liên Hoàn", cost: { ce: 22 }, cd: 2, effect: { dmg: { src: "cpow", mult: 1.6 }, mark: true }, desc: "Uy lực ×1.6 và khắc thêm 1 ấn. Tốn 22 Chú lực, hồi chiêu 2 lượt." },
    tk_kinhtran: { tech: true, name: "Kính Trận", cost: { ce: 25 }, cd: 3, effect: { store: true, guard: true }, desc: "Vừa thủ thế (giảm 50% sát thương) vừa hứng 60% đòn kế tiếp. Tốn 25 Chú lực, hồi chiêu 3 lượt." },
    tk_truongluc: { tech: true, name: "Trường Lực", cost: { ce: 28 }, cd: 3, effect: { dmg: { src: "cpow", mult: 1.8 }, debuff: { stat: "atk", pct: 0.3, turns: 2, label: "giảm 30% tấn công" } }, desc: "Uy lực ×1.8, giảm 30% tấn công mục tiêu 2 lượt. Tốn 28 Chú lực, hồi chiêu 3 lượt." },
    tk_luoi: { tech: true, name: "Lưới Nhện", cost: { ce: 25 }, cd: 4, effect: { dmg: { src: "cpow", mult: 1.0 }, stun: 0.8 }, desc: "Uy lực ×1.0, 80% trói mục tiêu mất lượt kế tiếp. Tốn 25 Chú lực, hồi chiêu 4 lượt." },
    tk_dongHoa: { tech: true, name: "Chú Thể Đồng Hóa", cost: { ce: 25 }, cd: 3, effect: { dmg: { src: "cpow", mult: 1.5 }, drain: 1.0 }, desc: "Uy lực ×1.5, hút lại 100% sát thương thành Chú lực. Tốn 25 Chú lực, hồi chiêu 3 lượt." },
    tk_lienphat: { tech: true, name: "Quang Tiễn Liên Phát", cost: { ce: 32 }, cd: 2, effect: { dmg: { src: "cpow", mult: 2.4 } }, desc: "Uy lực ×2.4. Tốn 32 Chú lực, hồi chiêu 2 lượt." },
  });
  Object.assign(D.SKILLS, {
    sk_kick: { name: "Cú đá xoay", cost: { sta: 15 }, cd: 1, effect: { dmg: { src: "patk", mult: 2.0 } }, desc: "Tấn công vật lý ×2.0. Tốn 15 Thể lực, hồi chiêu 1 lượt." },
    sk_combo: { name: "Liên quyền", cost: { sta: 18 }, cd: 2, effect: { dmg: { src: "patk", mult: 1.1 }, hits: 2 }, desc: "Hai đòn liên tiếp, mỗi đòn Tấn công vật lý ×1.1 (né riêng từng đòn). Tốn 18 Thể lực, hồi chiêu 2 lượt." },
    sk_bandage: { name: "Băng bó chú lực", cost: { ce: 20 }, cd: 3, effect: { heal: 0.15 }, desc: "Hồi 15% HP tối đa. Tốn 20 Chú lực, hồi chiêu 3 lượt." },
    sk_shot: { name: "Phóng chú lực", cost: { ce: 15 }, cd: 1, effect: { dmg: { src: "cpow", mult: 1.5 } }, desc: "Bắn chú lực từ xa: Uy lực ×1.5. Tốn 15 Chú lực, hồi chiêu 1 lượt." },
    sk_focus: { name: "Tập trung", cost: { ce: 10 }, cd: 3, effect: { focus: { mult: 1.5 } }, desc: "Đòn tấn công kế tiếp mạnh ×1.5. Tốn 10 Chú lực, hồi chiêu 3 lượt." },
    sk_simple: { name: "Giản dị lãnh địa", cost: { ce: 30 }, cd: 4, effect: { guardPct: 0.7 }, desc: "Dựng một vòng lãnh địa nhỏ quanh người: giảm 70% sát thương nhận vào trong lượt này. Tốn 30 Chú lực, hồi chiêu 4 lượt." },
    sk_pierce: { name: "Đòn xuyên giáp", cost: { sta: 20 }, cd: 2, effect: { dmg: { src: "patk", mult: 1.8 }, pierce: 0.5 }, desc: "Tấn công vật lý ×1.8, bỏ qua 50% Giáp của mục tiêu. Tốn 20 Thể lực, hồi chiêu 2 lượt." },
    sk_burst: { name: "Bùng nổ chú lực", cost: { ce: 45 }, cd: 4, effect: { dmg: { src: "hybrid", mult: 3.6 } }, desc: "(Tấn công + 0.5×Uy lực) ×3.6. Tốn 45 Chú lực, hồi chiêu 4 lượt." },
    sk_eye: { name: "Nhãn lực Hệ thống", cost: { ce: 15 }, cd: 4, effect: { focus: { mult: 1, crit: true, sure: true } }, desc: "Hệ thống tính trước chuyển động của mục tiêu: đòn tấn công kế tiếp chắc chắn chí mạng và không thể né. Tốn 15 Chú lực, hồi chiêu 4 lượt." },
    sk_regen: { name: "Tái tạo Hệ thống", cost: {}, cd: 5, effect: { heal: 0.25, restore: 30 }, desc: "Hồi 25% HP tối đa và 30 Chú lực. Không tốn tài nguyên, hồi chiêu 5 lượt." },
  });
  Object.assign(D.SKILLS, {
    tk_vanloi: { tech: true, name: "Vạn Lôi Hồi Âm", cost: { ce: 30 }, cd: 3, effect: { dmg: { src: "cpow", mult: 2.2 }, stun: 0.4 }, desc: "Uy lực ×2.2, 40% làm mục tiêu choáng. Tốn 30 Chú lực, hồi chiêu 3 lượt." },
    tk_ngung: { tech: true, name: "Ngưng Đọng", cost: { ce: 28 }, cd: 4, effect: { dmg: { src: "cpow", mult: 0.8 }, stun: 0.9 }, desc: "Uy lực ×0.8, 90% đóng băng mục tiêu mất lượt kế tiếp. Tốn 28 Chú lực, hồi chiêu 4 lượt." },
  });
  const TECH3 = { khacan: "tk_anlien", phananh: "tk_kinhtran", trongap: "tk_truongluc", lientuyen: "tk_luoi", thucchu: "tk_dongHoa", tichquang: "tk_lienphat", amchan: "tk_vanloi", thoikhac: "tk_ngung" };

  /* ---------- VẬT PHẨM MỚI ---------- */
  Object.assign(D.ITEMS, {
    bang_gac: { name: "Băng gạc học viện", stack: true, quality: "Phổ thông", use: { hp: 60 }, lore: "Hồi 60 HP." },
    nuoc_chu: { name: "Nước tăng lực chú lực", stack: true, quality: "Phổ thông", use: { ce: 60 }, lore: "Hồi 60 Chú lực. Vị như nước ngọt hết ga." },
    dan_he: { name: "Đan hồi phục Hệ thống", stack: true, quality: "Hiếm", use: { hp: 250, ce: 80 }, lore: "Hồi 250 HP và 80 Chú lực." },
    tinh_STR: { name: "Tinh hoa Sức mạnh", stack: true, quality: "Sử thi", use: { base: { STR: 1 } }, lore: "STR cơ bản +1 vĩnh viễn. Không dùng trong trận." },
    tinh_AGI: { name: "Tinh hoa Nhanh nhẹn", stack: true, quality: "Sử thi", use: { base: { AGI: 1 } }, lore: "AGI cơ bản +1 vĩnh viễn. Không dùng trong trận." },
    tinh_VIT: { name: "Tinh hoa Thể chất", stack: true, quality: "Sử thi", use: { base: { VIT: 1 } }, lore: "VIT cơ bản +1 vĩnh viễn. Không dùng trong trận." },
    tinh_INT: { name: "Tinh hoa Trí tuệ", stack: true, quality: "Sử thi", use: { base: { INT: 1 } }, lore: "INT cơ bản +1 vĩnh viễn. Không dùng trong trận." },
    tinh_WIS: { name: "Tinh hoa Minh triết", stack: true, quality: "Sử thi", use: { base: { WIS: 1 } }, lore: "WIS cơ bản +1 vĩnh viễn. Không dùng trong trận." },
    manh_tiem: { name: "Mảnh Tiềm năng", stack: true, quality: "Huyền thoại", use: { points: 3 }, lore: "+3 điểm chỉ số tự do. Không dùng trong trận." },
    sach_step: { name: "Bí kíp: Bộ pháp chú lực", quality: "Hiếm", use: { learn: "sk_step" }, lore: "Dạy kỹ năng Bộ pháp chú lực." },
    sach_block: { name: "Bí kíp: Đòn chặn chú lực", quality: "Hiếm", use: { learn: "sk_block" }, lore: "Dạy kỹ năng Đòn chặn chú lực." },
    dao_chu4: { name: "Dao chú cụ cấp 4", slot: "Vũ khí", quality: "Tốt", stats: { STR: 2, AGI: 1 }, lore: "Lưỡi dao ngắn tẩm chú lực, hàng phát cho học viên." },
    con_go: { name: "Côn gỗ trừ tà", slot: "Vũ khí", quality: "Hiếm", stats: { STR: 3, VIT: 2 }, req: { rank: "D" }, lore: "Gỗ đào ngâm nước giếng chùa suốt một trăm ngày." },
    kiem_chu3: { name: "Đoản kiếm chú cụ cấp 3", slot: "Vũ khí", quality: "Hiếm", stats: { STR: 4, AGI: 3 }, req: { rank: "D" }, lore: "Chú cụ cấp 3 chính quy." },
    kiem_chu2: { name: "Trường kiếm chú cụ cấp 2", slot: "Vũ khí", quality: "Sử thi", stats: { STR: 6, AGI: 4, WIS: 2 }, unique: true, req: { rank: "C" }, lore: "Thanh kiếm từng thuộc về một chú thuật sư đã nghỉ hưu." },
    giay_chu: { name: "Giày chạy gia cố", slot: "Giày", quality: "Tốt", stats: { AGI: 3 }, lore: "Đế khâu bùa chống trượt." },
    gang_khac: { name: "Găng tay khắc ấn", slot: "Găng tay", quality: "Hiếm", stats: { STR: 3, INT: 2 }, req: { rank: "D" }, lore: "Lòng găng khắc ký hiệu dẫn chú lực." },
    ao_bua: { name: "Áo lót dán bùa", slot: "Giáp", quality: "Hiếm", stats: { VIT: 3, WIS: 2 }, req: { rank: "D" }, lore: "Mặc bên trong đồng phục. Hơi ngứa." },
    vong_bua: { name: "Vòng tay bùa hộ mệnh", slot: "Phụ kiện", quality: "Hiếm", stats: { WIS: 2, LUK: 2, VIT: 1 }, lore: "Mua ở một ngôi đền nhỏ gần ga." },
    huy_hieu2: { name: "Huy hiệu Chú thuật sư Cấp 2", slot: "Phụ kiện", quality: "Sử thi", stats: { INT: 2, WIS: 2, VIT: 2 }, unique: true, req: { rank: "C" }, lore: "Chứng nhận Cấp 2 của Học viện." },
    // Quà tặng
    banh_ngot: { name: "Bánh kem dâu Harajuku", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng. Ngọt lịm." },
    tap_chi: { name: "Tạp chí thời trang tháng này", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    sach_cu: { name: "Tiểu thuyết bìa cứng cũ", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    dia_phim: { name: "Đĩa phim kinh dị kinh điển", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    ca_phe: { name: "Cà phê đen và bánh mì sandwich", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    com_nam: { name: "Cơm nắm cá ngừ mayo", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    keo_deo: { name: "Túi kẹo dẻo trái cây", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    day_quan: { name: "Dây quấn cán vũ khí", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    anh_idol: { name: "Ảnh idol có chữ ký", stack: true, quality: "Tốt", gift: true, lore: "Quà tặng. Bản giới hạn." },
    thuoc_da_day: { name: "Thuốc đau dạ dày", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    ca_phe_lon: { name: "Cà phê lon", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    hoa_qua: { name: "Giỏ hoa quả", stack: true, quality: "Phổ thông", gift: true, lore: "Quà tặng." },
    ngon_tay: { name: "Ngón tay khô quấn bùa", quality: "Đặc cấp", unique: true, lore: "Một chú vật đặc cấp. Không được giữ lâu." },
  });

  /* ---------- KẺ ĐỊCH & NHÂN VẬT MỚI ---------- */
  Object.assign(D.NPCS, {
    c_doll: { name: "Chú hài luyện tập", rank: "E", lv: 3, stats: st(6, 6, 6, 2, 2, 2), exp: 250, devour: "VIT", skills: [{ name: "Cú đấm gỗ", mult: 1.3, src: "patk", cd: 1 }, { name: "Húc", mult: 1.0, src: "patk" }], desc: "Hình nhân gỗ do Hiệu trưởng Yaga làm để học sinh tập đánh." },
    c_alley: { name: "Chú linh hẻm tối", rank: "E", lv: 4, stats: st(8, 8, 6, 3, 3, 2), exp: 400, devour: "AGI", skills: [{ name: "Vồ từ bóng tối", mult: 1.4, src: "patk", cd: 2 }, { name: "Cắn", mult: 1.1, src: "patk" }], desc: "Chú linh cấp 4 sống trong con hẻm sau ga." },
    c_school: { name: "Chú linh phòng học", rank: "D", lv: 9, stats: st(14, 12, 13, 7, 8, 3), exp: 1400, devour: "INT", skills: [{ name: "Ném bàn ghế", mult: 1.5, src: "patk", cd: 2 }, { name: "Lời thì thầm", mult: 1.3, src: "cpow", cd: 3 }, { name: "Quất", mult: 1.1, src: "patk" }], desc: "Sinh ra từ nỗi sợ bị bắt nạt ở trường Satozakura." },
    c_kaihen: { name: "Người cải biến", rank: "D", lv: 10, stats: st(16, 13, 14, 4, 4, 3), exp: 1600, devour: "STR", skills: [{ name: "Vung tay méo mó", mult: 1.5, src: "patk", cd: 2 }, { name: "Cắn xé", mult: 1.2, src: "patk" }], desc: "Một con người bị Mahito nhào nặn lại linh hồn. Không thể cứu được nữa." },
    c_kaihen2: { name: "Người cải biến hai đầu", rank: "D", lv: 11, stats: st(17, 14, 15, 5, 5, 3), exp: 1800, devour: "VIT", skills: [{ name: "Hai miệng cùng cắn", mult: 1.6, src: "patk", cd: 2 }, { name: "Gào", mult: 1.2, src: "cpow", cd: 3 }, { name: "Đập", mult: 1.1, src: "patk" }], desc: "Hai con người bị ép thành một." },
    c_kaihen_big: { name: "Người cải biến khổng lồ", rank: "D", lv: 13, stats: st(22, 12, 22, 6, 6, 3), exp: 3200, devour: "STR", skills: [{ name: "Giẫm nát", mult: 1.7, src: "patk", cd: 3 }, { name: "Quét tay", mult: 1.3, src: "patk" }], desc: "Thân hình phình to tới mức chạm trần nhà thể chất." },
    c_pool: { name: "Chú linh hồ bơi", rank: "D", lv: 14, stats: st(18, 18, 17, 9, 9, 4), exp: 3000, devour: "AGI", skills: [{ name: "Kéo xuống nước", mult: 1.6, src: "patk", cd: 2 }, { name: "Sóng lạnh", mult: 1.4, src: "cpow", cd: 3 }, { name: "Quấn", mult: 1.1, src: "patk" }], desc: "Hồ bơi bỏ hoang của một trường tiểu học. Ba vụ đuối nước trong một năm." },
    c_tunnel: { name: "Chú linh đường hầm", rank: "C", lv: 17, stats: st(22, 20, 22, 11, 11, 4), exp: 4500, devour: "VIT", skills: [{ name: "Đèn pha ảo", mult: 1.5, src: "cpow", cd: 3 }, { name: "Lao như tàu", mult: 1.8, src: "patk", cd: 3 }, { name: "Va", mult: 1.2, src: "patk" }], desc: "Chú linh cấp 2 trong đường hầm đường sắt bị phong tỏa." },
    c_hoa: { name: "Chú linh nụ hoa", rank: "C", lv: 18, stats: st(20, 18, 24, 14, 14, 4), exp: 5000, devour: "WIS", skills: [{ name: "Rễ đâm", mult: 1.6, src: "patk", cd: 2 }, { name: "Phấn độc", mult: 1.5, src: "cpow", cd: 3 }, { name: "Quất cành", mult: 1.2, src: "patk" }], desc: "Chú linh nhỏ nảy ra từ rễ cây của một kẻ đặc cấp." },
    c_cap2_trial: { name: "Chú linh cấp 2 — Sát hạch", rank: "C", lv: 21, stats: st(26, 24, 26, 15, 15, 5), exp: 7000, devour: "INT", skills: [{ name: "Trăm cánh tay", mult: 1.7, src: "patk", cd: 3 }, { name: "Tiếng than", mult: 1.6, src: "cpow", cd: 3 }, { name: "Bóp", mult: 1.2, src: "patk" }], desc: "Chú linh cấp 2 thu giữ ở kho phong ấn của học viện." },
    nagi: mk("Yoshino Nagi", "E", 2, [3, 3, 3, 3, 3, 3], { desc: "Mẹ của Junpei. Hút thuốc, cười to, nấu cà ri rất ngon." }),
  });
  /* Cân bằng: kẻ địch Arc 2–3 có tổng chỉ số ≈ 1.25–1.35 × mức chuẩn theo Level (người chơi có đặc tính, trang bị, luyện tập) */
  const scale = (id, factor, hpMult) => {
    const n = D.NPCS[id], target = Math.round((30 + 5 * (n.lv - 1)) * factor), sum = Object.values(n.stats).reduce((a, b) => a + b, 0);
    for (const k in n.stats) n.stats[k] = Math.max(1, Math.round((n.stats[k] * target) / sum));
    if (hpMult) n.hpMult = hpMult;
  };
  [["c_school", 1.25], ["c_kaihen", 1.25], ["c_kaihen2", 1.25, 1.1], ["c_kaihen_big", 1.3, 1.3], ["c_pool", 1.3, 1.1], ["c_tunnel", 1.3, 1.2], ["c_hoa", 1.3, 1.2], ["c_cap2_trial", 1.35, 1.35], ["miwa", 1.2, 1.5]]
    .forEach(([id, f, h]) => scale(id, f, h));
  Object.assign(D.NPCS.miwa, { exp: 3500, skills: [{ name: "Tân Âm Lưu: Rút kiếm", mult: 1.9, src: "patk", cd: 3 }, { name: "Chém", mult: 1.2, src: "patk" }] });
  // Học sinh năm hai (Arc 3) dùng cùng mức sức mạnh đã khai báo trong data.js

  /* ---------- QUAN HỆ & TƯƠNG TÁC NPC ---------- */
  const SOCIAL = {
    itadori: { likes: ["dia_phim", "keo_deo"], likeText: "Itadori reo lên như trẻ con được quà.", idle: "Itadori kể một câu chuyện cười chẳng đầu chẳng cuối. Shen vẫn bật cười.",
      train: { stats: ["STR", "AGI"], minRel: 10, text: "Đấu tay đôi với Itadori đến khi cả hai nằm vật ra sân. Cậu ta không biết mệt." },
      hideIf: "itadori_hidden",
      talk: [
        { text: ["> Ông tớ trước khi mất dặn: hãy giúp đỡ người khác. Và chết giữa vòng tay mọi người.", "Itadori nói điều đó như nói chuyện thời tiết, nhưng mắt cậu ta nhìn rất xa."], eff: { moral: 2 } },
        { minRel: 15, text: ["> Cậu có cái gì đó kỳ lạ trong chú lực, tớ có Sukuna. Hai đứa mình đều mang thứ người khác không hiểu nổi nhỉ.", "> Nếu một ngày nó làm cậu khác đi, tớ sẽ đấm cậu tỉnh lại. Hứa đấy."], eff: { known: "itadori_hua" } },
        { minRel: 30, req: { flag: "itadori_alive_known" }, text: ["> Lúc ở trại giam... xin lỗi vì để cậu thấy cảnh đó.", "> Thầy Gojo bắt tớ trốn. Tớ ghét nói dối mọi người. Nhưng cảm ơn vì cậu đã giữ bí mật."], eff: { anti: 1 } },
      ],
      bonds: [{ rel: 30, text: "Itadori chỉ cho Shen cách dồn lực từ hông vào nắm đấm.", eff: { base: { STR: 1 } } }, { rel: 60, text: "Itadori gọi Shen là bạn thân. Khi đứng cạnh nhau, cả hai đánh hăng hơn.", eff: { base: { STR: 1, VIT: 1 }, achievement: "a_bond_yuji" } }] },
    fushiguro: { likes: ["sach_cu"], likeText: "Fushiguro lật vài trang, khẽ gật đầu. Với cậu ta, thế là rất vui rồi.", idle: "Fushiguro đọc sách. Shen ngồi cạnh. Không ai nói gì, nhưng không khí không khó chịu.",
      train: { stats: ["INT", "WIS"], minRel: 10, text: "Fushiguro bắt Shen phân tích từng đòn của thức thần. Đau đầu hơn đau người." },
      talk: [
        { text: ["> Tôi không cứu người vì chính nghĩa. Tôi cứu người tôi thấy đáng được cứu. Bất công thật, nhưng tôi chọn vậy."], eff: { trace: { quansat: 1 } } },
        { minRel: 15, text: ["> Chú lực của cậu kỳ lạ. Lúc cậu dùng nó, tôi thấy... như có hai người cùng điều khiển.", "Shen không trả lời."], eff: { known: "megumi_nghi_ngo" } },
        { minRel: 30, text: ["Fushiguro kể về người chị gái đang hôn mê vì một lời nguyền không rõ nguồn gốc.", "> Đừng nói với ai."], eff: { known: "tsumiki" } },
      ],
      bonds: [{ rel: 30, text: "Fushiguro chép cho Shen bản ghi chú về cấu trúc chú lực.", eff: { base: { INT: 1 } } }, { rel: 60, text: "Fushiguro tin tưởng Shen tuyệt đối trong chiến đấu.", eff: { base: { WIS: 1, INT: 1 }, achievement: "a_bond_megumi" } }] },
    kugisaki: { likes: ["tap_chi", "banh_ngot"], likeText: "Kugisaki giật lấy món quà: \"Cuối cùng cũng có đứa biết điều!\"", idle: "Kugisaki kéo Shen đi xem đồ ở phố. Shen xách túi.",
      train: { stats: ["WIS", "AGI"], minRel: 10, text: "Kugisaki dạy Shen cách ném chính xác. Shen trúng mục tiêu ba lần trên mười. Cô lắc đầu." },
      talk: [
        { text: ["> Tôi lên Tokyo vì ở quê chán chết. Với lại có hai người tôi muốn gặp lại.", "Cô không nói hai người đó là ai."] },
        { minRel: 15, text: ["> Tôi là tôi. Tôi không định trở thành bất cứ ai khác chỉ để người ta thấy dễ chịu.", "Cô nói câu đó rất thẳng. Shen thấy nhẹ lòng một cách khó hiểu."], eff: { moral: 1 } },
      ],
      bonds: [{ rel: 30, text: "Kugisaki tặng lại Shen một cây đinh: \"Cầm lấy, lỡ gặp chuyện thì chọc vào mắt nó.\"", eff: { base: { AGI: 1 } } }, { rel: 60, text: "Kugisaki công nhận Shen là đồng đội.", eff: { base: { WIS: 1, LUK: 1 }, achievement: "a_bond_nobara" } }] },
    gojo: { likes: ["banh_ngot", "keo_deo"], likeText: "Gojo ăn hết trong ba miếng: \"Nhóc biết cách hối lộ giáo viên đấy.\"", idle: "Gojo kể về một quán bánh mới mở. Rất chi tiết. Rất lâu.",
      talk: [
        { text: ["> Giới chú thuật bây giờ thối nát lắm. Thượng tầng chỉ muốn giữ ghế. Tôi muốn nuôi lứa học trò mạnh tới mức chúng không thể bỏ qua."], eff: { known: "gojo_muc_tieu" } },
        { minRel: 20, text: ["Gojo hiếm khi nghiêm túc. Lần này anh ta tháo băng mắt.", "> Chú lực của nhóc không giống thuật thức bẩm sinh. Như thể ai đó viết nó vào nhóc sau khi sinh ra. Cẩn thận với kẻ muốn biết vì sao."], eff: { known: "gojo_nghi_ngo" } },
      ],
      bonds: [{ rel: 40, text: "Gojo cho Shen xem một buổi \"dạy riêng\". Ba mươi giây. Shen hiểu ra khoảng cách thật sự giữa hai người.", eff: { base: { WIS: 2 }, achievement: "a_bond_gojo" } }] },
    ijichi: { likes: ["thuoc_da_day", "ca_phe_lon"], likeText: "Ijichi cảm động tới mức đẩy kính lên ba lần.", idle: "Ijichi than vãn về số giờ làm thêm. Shen gật gù.",
      talk: [{ text: ["> Tôi không có tài làm chú thuật sư, nên tôi chọn đứng phía sau. Ai cũng có cách góp sức riêng."] }, { minRel: 15, text: ["Ijichi lén đưa cho Shen danh sách những nhiệm vụ trả thù lao cao."], eff: { yen: 15000 } }],
      bonds: [{ rel: 30, text: "Ijichi ưu tiên Shen khi chia nhiệm vụ.", eff: { yen: 30000, sp: 20 } }] },
    ieiri: { likes: ["ca_phe_lon"], likeText: "Ieiri mở lon cà phê ngay: \"Đúng loại tôi uống.\"", idle: "Ieiri khám vết bầm trên tay Shen, rồi bảo nó chẳng sao.",
      talk: [{ text: ["> Phản chuyển thuật thức à? Cảm giác nó giống như... hyun, rồi pyon. Hiểu không? Không hiểu thì thôi."] }, { minRel: 15, text: ["Ieiri đưa cho Shen hai lọ thuốc dư."], eff: { item: { id: "thuoc_ieiri", qty: 2 } } }],
      bonds: [{ rel: 30, text: "Ieiri dạy Shen cách tự sơ cứu bằng chú lực.", eff: { base: { VIT: 1 }, item: { id: "thuoc_ieiri", qty: 2 } } }] },
    yaga: { likes: ["hoa_qua"], likeText: "Yaga gật đầu. Một con thú bông trên bàn ông vẫy tay thay lời cảm ơn.", idle: "Yaga khâu thú bông. Shen ngồi xem. Rất thư giãn.",
      train: { stats: ["VIT", "WIS"], minRel: 5, text: "Yaga thả ba con chú hài vào phòng. Shen phải giữ chú lực ổn định suốt hai giờ." },
      talk: [{ text: ["> Chú hài cần chú lực ổn định để cử động. Người cũng vậy. Cảm xúc dao động thì chú lực dao động."], eff: { trace: { phongan: 1 } } }],
      bonds: [{ rel: 30, text: "Yaga làm cho Shen một con chú hài nhỏ để luyện tập ở nhà.", eff: { base: { VIT: 1, WIS: 1 } } }] },
    nanami: { likes: ["ca_phe"], likeText: "Nanami chỉnh lại kính: \"Bánh mì ở tiệm đó là ngon nhất khu này. Cậu có mắt nhìn.\"", idle: "Nanami nhìn đồng hồ. Còn bốn phút đến giờ tan làm.",
      train: { stats: ["STR", "INT"], minRel: 10, text: "Nanami chỉ cho Shen cách chia đối thủ thành mười phần và đánh vào điểm yếu nhất. Thực dụng đến lạnh lùng." },
      talk: [
        { text: ["> Lao động là thứ vớ vẩn. Nhưng tôi chọn quay lại làm chú thuật sư, nên tôi sẽ làm cho tử tế."] },
        { minRel: 15, text: ["> Cậu là trẻ con. Việc của người lớn là bảo vệ trẻ con. Đừng tranh phần việc của tôi."], eff: { moral: 2 } },
        { minRel: 30, text: ["Nanami kể về giấc mơ được về hưu ở một bãi biển nước ngoài, đọc sách cả ngày.", "Hiếm khi thấy anh ta mỉm cười như vậy."], eff: { known: "nanami_mo_uoc" } },
      ],
      bonds: [{ rel: 30, text: "Nanami tặng Shen một chiếc cà vạt cũ: \"Mặc vào khi cần trông như người lớn.\"", eff: { base: { INT: 1, STR: 1 } } }, { rel: 60, text: "Nanami tin Shen đủ để giao lưng cho cậu trong trận.", eff: { base: { STR: 1, VIT: 1 }, achievement: "a_bond_nanami" } }] },
    junpei: { likes: ["dia_phim"], likeText: "Junpei nhìn đĩa phim, rồi nhìn Shen: \"Cậu cũng thích phim này à?\" Lần đầu cậu ta cười.", idle: "Junpei kể về bộ phim vừa xem. Cậu ta nói về phim nhiều hơn về bản thân.",
      talk: [
        { text: ["> Người ta nói con người có linh hồn. Nếu linh hồn chỉ là thứ có thể nhào nặn, thì sống có ý nghĩa gì?", "Câu hỏi nghe giống ai đó đã dạy cậu ta."], eff: { known: "junpei_gap_mahito" } },
        { minRel: 15, text: ["Junpei kể về những vết thương do bị bắt nạt ở trường. Cậu ta kể rất bình thản, như kể chuyện của người khác."], eff: { moral: 1 } },
        { minRel: 30, text: ["> Mẹ tớ bảo, nếu một ngày tớ muốn làm điều gì quá đáng, hãy nghĩ tới bà trước.", "> ...Cảm ơn vì đã ở đây, Shen."], eff: { flag: "junpei_tin_shen" } },
      ],
      bonds: [{ rel: 30, text: "Junpei tin tưởng Shen.", eff: { flag: "junpei_tin_shen" } }] },
    nagi: { likes: ["hoa_qua", "banh_ngot"], likeText: "Bà Nagi cười to: \"Ôi, con nhà ai mà dễ thương thế!\"", idle: "Bà Nagi giữ Shen lại ăn cơm. Cà ri rất ngon.",
      talk: [{ text: ["> Junpei ít bạn lắm. Cảm ơn cháu nhé. Cứ tới chơi thường xuyên."], eff: { rel: { junpei: 4 } } }] },
    maki: { likes: ["day_quan"], likeText: "Maki thử quấn dây lên cán thương: \"Được. Đúng độ nhám.\"", idle: "Maki tập thương một mình. Shen nhặt hộ những chiếc cọc gỗ bị đánh gãy.",
      train: { stats: ["STR", "AGI"], minRel: 0, text: "Maki đánh Shen tơi tả bằng gậy gỗ. \"Đứng lên. Chú linh không chờ cậu thở đâu.\"" },
      talk: [{ text: ["> Nhà Zenin coi người không có chú lực như rác. Tôi sẽ trở thành gia chủ, rồi đá đổ cái nhà đó."], eff: { known: "maki_muc_tieu" } }, { minRel: 20, text: ["Maki chỉ cho Shen một đòn quét chân bằng cán thương."], eff: { skill: "sk_sweep" } }],
      bonds: [{ rel: 30, text: "Maki gật đầu công nhận. Với cô, đó là lời khen lớn.", eff: { base: { AGI: 1, STR: 1 } } }] },
    panda: { likes: ["keo_deo"], likeText: "Panda ôm túi kẹo như ôm con: \"Cậu là người tốt.\"", idle: "Panda kể chuyện phiếm về các giáo viên. Phần lớn là bịa.",
      train: { stats: ["VIT", "STR"], minRel: 0, text: "Panda vật Shen xuống đất mười hai lần. Lần thứ mười ba Shen đứng vững được ba giây." },
      talk: [{ text: ["> Tớ là chú hài đột biến. Đừng hỏi tớ có phải gấu trúc không. Tớ là Panda."] }, { minRel: 15, text: ["> Inumaki nói ít vì lời nói của cậu ấy có thể giết người. Cậu ấy dịu dàng hơn bất kỳ ai, nên mới im lặng."], eff: { known: "inumaki_hieu" } }],
      bonds: [{ rel: 30, text: "Panda dạy Shen cách ngã mà không đau.", eff: { base: { VIT: 2 } } }] },
    inumaki: { likes: ["com_nam"], likeText: "\"Cá ngừ mayo!\" Inumaki giơ ngón cái. Mắt cậu ấy cười.", idle: "Inumaki nói toàn tên nhân cơm nắm. Shen dần hiểu được một nửa.",
      train: { stats: ["WIS", "INT"], minRel: 10, text: "Inumaki dùng chú ngôn yếu nhất để Shen tập kháng cự. Đầu Shen ong ong cả tối." },
      talk: [{ text: ["> Cá hồi. Cá ngừ. Tảo bẹ.", "Panda dịch: Cậu ấy bảo chào mừng, và đừng có chết."] }],
      bonds: [{ rel: 30, text: "Inumaki chia cho Shen nửa nắm cơm. Đó là tình bạn.", eff: { base: { WIS: 2 } } }] },
    todo: { likes: ["anh_idol"], likeText: "Todo nhìn bức ảnh rất lâu. Rồi ôm chầm lấy Shen: \"BẠN THÂN!\"", idle: "Todo kể về idol yêu thích suốt hai tiếng. Shen không được nói chen.",
      train: { stats: ["STR", "VIT"], minRel: 20, text: "Todo đấm Shen bay qua ba gốc cây, rồi đứng giảng giải về \"nhịp điệu chiến đấu\" với vẻ rất thỏa mãn." },
      talk: [{ text: ["> Chú lực không phải con số. Nó là sự hiểu bản thân. Ai không hiểu mình thì không bao giờ mạnh."] }],
      bonds: [{ rel: 40, text: "Todo coi Shen là bạn chiến đấu. Mỗi lần gặp, cậu ta đánh Shen mạnh hơn một chút.", eff: { base: { STR: 2 } } }] },
  };

  /* ---------- KHU TỰ DO ---------- */
  const academy = (npcs, events, extra) => Object.assign({ name: "Sân học viện", env: "temple", npcs, events: events || [], idle: "Gió thổi qua những mái chùa cũ. Học viện yên tĩnh lạ thường." }, extra);
  const HUBS = {
    a1_hub1: { name: "Tuần đầu ở học viện", days: 3, trainCap: 4, start: "san",
      intro: "Gojo đi công tác, bảo cả nhóm \"tự làm quen với trường\". Ba ngày tự do trước khi người thứ tư tới.",
      locations: {
        san: academy([["itadori", "fushiguro"], ["itadori"], ["itadori"]], [
          { id: "a1_crow", text: ["Một con quạ đậu trên mái chùa nhìn Shen chằm chằm. Nó không có bóng.", "[Hệ thống: Chú linh vô hại cấp thấp. Không cần xử lý.]"], eff: { exp: 120, trace: { quansat: 1 } } },
          { id: "a1_medbox", text: ["Trong kho cũ sau võ đường, Shen tìm thấy một thùng thuốc chưa bóc."], eff: { item: { id: "bang_gac", qty: 3 } } },
        ]),
        voduong: { name: "Võ đường", env: "dojo", npcs: [], idle: "Võ đường trống trơn. Chỉ có tiếng sàn gỗ kẽo kẹt.", events: [
          { id: "a1_doll", title: "Chú hài luyện tập", text: ["Một hình nhân gỗ trong góc đột nhiên đứng dậy, giơ hai nắm đấm lên."], combat: ["c_doll"] },
        ] },
        vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["yaga", "ijichi"], ["ieiri", "ijichi"], ["ieiri"]], idle: "Hành lang văn phòng sực mùi thuốc khử trùng và giấy tờ.", events: [] },
        pho: { name: "Phố gần ga", env: "city", npcs: [], idle: "Phố xá đông đúc. Không ai biết thế giới mình đang sống có những thứ gì.", events: [
          { id: "a1_alley", slot: [2], title: "Con hẻm sau ga", text: ["Trời tối. Trong con hẻm sau ga có thứ gì đó đang ăn dở một con mèo."], combat: ["c_alley"] },
          { id: "a1_shrine", text: ["Shen ghé một ngôi đền nhỏ, bỏ năm yên vào hòm công đức.", "Ông từ già nhìn cậu rồi bảo: \"Cậu mang nhiều thứ trên vai quá.\""], eff: { exp: 150, trace: { phongan: 1 } } },
        ] },
      } },
    a1_hub2: { name: "Sau nhiệm vụ Roppongi", days: 5, trainCap: 6, start: "san",
      intro: "Nhiệm vụ đầu tiên đã xong. Học viện cho năm nhất một tuần để hồi phục, luyện tập và nhận việc vặt.",
      locations: {
        san: academy([["itadori", "fushiguro", "kugisaki"], ["itadori", "kugisaki"], ["itadori"]], [
          { id: "a1_note", text: ["Ai đó dán một mẩu giấy lên cửa phòng Shen: \"Cậu có thấy lạ không? — F.\"", "Nét chữ của Fushiguro."], eff: { exp: 150, rel: { fushiguro: 3 } } },
        ]),
        voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yaga"], []], idle: "Sàn gỗ còn vết bầm của buổi tập hôm qua.", events: [] },
        vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["ijichi"], ["ieiri", "ijichi"], ["ieiri"]], idle: "Ijichi đang gõ báo cáo, mắt thâm quầng.", events: [] },
        pho: { name: "Phố Harajuku", env: "city", npcs: [[], ["kugisaki"], []], idle: "Kugisaki từng nói Harajuku là thánh địa. Shen vẫn chưa hiểu vì sao.", events: [] },
        nhaga: { name: "Nhà ga bỏ hoang (Saitama)", env: "station", npcs: [], idle: "Sân ga trống trải. Gió lùa qua đường ray gỉ sét.", events: [
          { id: "a1_patrol", title: "Nhiệm vụ tuần tra", text: ["Ijichi dựng màn. Trong bóng tối của sân ga, hàng chục chú linh nhỏ quấn vào nhau thành một khối nhầy nhụa."], combat: ["c_cap4c"], eff: { quest: { id: "q_patrol", status: "done" }, yen: 20000, rep: { tokyo: 3 } } },
        ] },
        benhvien: { name: "Bệnh viện bỏ hoang (Chiba)", env: "hospital", npcs: [], idle: "Tiếng nước nhỏ giọt vọng ra từ tầng hầm.", events: [
          { id: "a1_hosp", slot: [2], title: "Hành lang bệnh viện", text: ["Nửa đêm. Tiếng trẻ con khóc vọng ra từ cuối hành lang, rồi một bóng người bò bằng bốn chi lao về phía Shen."], combat: ["c_hosp"], eff: { yen: 30000, rep: { danthuong: 3 } } },
        ] },
      } },
    a2_hub1: { name: "Điều tra ở Kawasaki", days: 4, trainCap: 5, start: "kawasaki",
      intro: "Nanami chia việc: ban ngày mỗi người tự điều tra, tối tập trung báo cáo. \"Tôi không làm thêm giờ. Các cậu cũng vậy.\"",
      locations: {
        kawasaki: { name: "Trung tâm Kawasaki", env: "city", npcs: [["nanami"], ["junpei", "itadori"], ["nanami"]], idle: "Rạp chiếu phim đã dán băng niêm phong. Người qua đường vẫn xếp hàng mua bỏng ngô ở rạp bên cạnh.", events: [
          { id: "a2_alley", slot: [2], title: "Hẻm sau rạp phim", text: ["Có thứ gì đó bò ra từ ống cống sau rạp phim. Nó từng là một con người."], combat: ["c_kaihen"] },
          { id: "a2_witness", text: ["Một nhân viên rạp kể rằng hôm xảy ra vụ án, có một cậu học sinh ngồi xem phim một mình ở hàng ghế cuối.", "Cậu ta không hề sợ hãi."], eff: { exp: 400, known: "junpei_o_rap" } },
        ] },
        nha_junpei: { name: "Nhà Junpei", env: "street", npcs: [[], [], ["junpei", "nagi"]], idle: "Căn nhà nhỏ cuối ngõ, đèn bếp vàng ấm.", events: [
          { id: "a2_finger", slot: [2], req: { rel: { junpei: 15 } }, text: ["Bà Nagi kéo Shen lại ăn tối. Trong lúc dọn bàn, Shen cảm thấy một luồng chú lực lạnh buốt từ chiếc tủ giày.", "Bên trong là một ngón tay khô quấn bùa. Chú lực của nó đặc tới mức Shen buồn nôn.", "[Hệ thống: Phát hiện chú vật đặc cấp. Nó đang thu hút chú linh tới căn nhà này.]", "Ai đó đã cố ý đặt nó ở đây."], eff: { flag: "finger_found", item: "ngon_tay", exp: 1200, moral: 4, ledger: { action: "Shen tìm thấy chú vật đặc cấp trong nhà Junpei", witnesses: "Không ai", consequence: "Nguồn thu hút chú linh bị loại bỏ trước khi kịp gây chuyện", trigger: "Kẻ đặt nó sẽ nhận ra kế hoạch thất bại" } } },
        ] },
        satozakura: { name: "Trường cấp ba Satozakura", env: "school", npcs: [], idle: "Học sinh ra về từng nhóm. Không ai nhắc tới Yoshino Junpei.", events: [
          { id: "a2_classroom", title: "Phòng học tầng ba", text: ["Phòng học cũ của Junpei. Trên bàn khắc đầy chữ chửi bới. Từ gầm bàn, một chú linh trườn ra."], combat: ["c_school"] },
          { id: "a2_bully", text: ["Shen nghe lỏm đám học sinh từng bắt nạt Junpei. Ba đứa trong nhóm đã chết ở rạp phim.", "Đứa còn lại đang run rẩy kể rằng nó thấy \"một người đàn ông có vết khâu trên mặt\"."], eff: { exp: 500, known: "mahito_mat_khau" } },
        ] },
        hocvien: { name: "Học viện (về báo cáo)", env: "temple", npcs: [["fushiguro", "kugisaki"], ["ieiri"], []], idle: "Học viện vắng vẻ khi thiếu Itadori.", events: [] },
      } },
    a2_hub2: { name: "Hai ngày trước cơn bão", days: 2, trainCap: 3, start: "kawasaki",
      intro: "Nanami cần hai ngày để hồi phục. Mahito đang ở đâu đó trong thành phố.",
      locations: {
        kawasaki: { name: "Trung tâm Kawasaki", env: "city", npcs: [["nanami"], ["junpei"], ["itadori"]], idle: "Trời âm u cả ngày.", events: [] },
        nha_junpei: { name: "Nhà Junpei", env: "street", npcs: [[], ["nagi"], ["junpei", "nagi"]], idle: "Mùi cà ri bay ra tận ngõ.", events: [
          { id: "a2_finger2", slot: [2], req: { rel: { junpei: 15 }, notFlag: "finger_found" }, text: ["Tối nay Shen mới để ý: chú lực lạnh buốt bốc ra từ tủ giày nhà Junpei.", "Bên trong là một ngón tay khô quấn bùa.", "[Hệ thống: Phát hiện chú vật đặc cấp. Nó đang thu hút chú linh tới căn nhà này.]"], eff: { flag: "finger_found", item: "ngon_tay", exp: 1200, moral: 4, ledger: { action: "Shen tìm thấy chú vật đặc cấp trong nhà Junpei", consequence: "Nguồn thu hút chú linh bị loại bỏ" } } },
        ] },
        satozakura: { name: "Trường cấp ba Satozakura", env: "school", npcs: [], idle: "Ngày mai trường tổ chức lễ chào cờ toàn trường.", events: [] },
      } },
    a3_hub1: { name: "Một tháng trước Giao lưu", days: 7, trainCap: 9, start: "san",
      intro: "Còn một tháng nữa là Giao lưu Kyoto. Đàn anh đàn chị năm hai nhận lời luyện cho năm nhất. Học viện cũng phát thêm nhiệm vụ để kiếm kinh nghiệm thực chiến.",
      locations: {
        san: academy([["maki", "panda", "fushiguro"], ["maki", "panda", "inumaki", "kugisaki"], ["inumaki", "panda"]], [
          { id: "a3_spar", text: ["Maki tổ chức một trận đấu đồng đội: năm nhất đấu năm hai. Năm nhất thua thảm.", "> Thua là bình thường. Thua mà không học được gì mới là vấn đề."], eff: { exp: 1500, rel: { maki: 4, panda: 3 } } },
        ]),
        voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yaga"], []], idle: "Có thêm hai hình nhân gỗ mới. Chúng nhìn Shen bằng ánh mắt rất ác.", events: [] },
        vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["gojo", "ijichi"], ["ieiri"], ["ieiri"]], idle: "Có tiếng ai đó ngân nga dưới tầng hầm. Nghe như giọng Itadori.", events: [
          { id: "a3_basement", slot: [2], req: { flag: "itadori_alive_known" }, text: ["Shen lẻn xuống tầng hầm. Itadori đang ngồi xem phim, ôm một con chú hài đang ngủ. Nếu cậu ta mất bình tĩnh, nó sẽ tỉnh dậy và đấm.", "> Ê! Shen! Cậu tới thăm à? Ngồi đi, phim này hay lắm!"], eff: { exp: 600, rel: { itadori: 8 } } },
          { id: "a3_overhear", slot: [2], text: ["Đi ngang phòng họp, Shen nghe giọng một ông già khàn đặc đang gọi điện: \"...vật chứa của Sukuna không được sống sót qua Giao lưu.\"", "Giọng của Hiệu trưởng Kyoto."], eff: { flag: "knows_plot", exp: 800, known: "kyoto_am_muu" } },
        ] },
        pho: { name: "Phố gần ga", env: "city", npcs: [[], ["kugisaki"], []], idle: "Một quán ăn mới mở. Panda bảo cá nướng ở đó rất ngon.", events: [] },
        nhiemvu1: { name: "Nhiệm vụ: Hồ bơi bỏ hoang", env: "school", npcs: [], idle: "Mặt nước xanh rêu, phẳng lặng.", events: [
          { id: "a3_pool", title: "Hồ bơi bỏ hoang", text: ["Mặt nước gợn lên dù không có gió. Một bàn tay trắng bệch vươn lên khỏi mặt hồ."], combat: ["c_pool"], eff: { yen: 40000, rep: { tokyo: 3 } } },
        ] },
        nhiemvu2: { name: "Nhiệm vụ: Đường hầm phong tỏa", env: "sewer", npcs: [], idle: "Đường ray dẫn vào bóng tối.", events: [
          { id: "a3_tunnel", req: { level: 15 }, title: "Đường hầm phong tỏa", text: ["Hai luồng đèn pha lao tới từ cuối đường hầm. Không có đoàn tàu nào chạy tuyến này từ mười năm trước."], combat: ["c_tunnel"], eff: { yen: 60000, rep: { tokyo: 4 } } },
        ] },
      } },
    a3_hub2: { name: "Sau Giao lưu", days: 3, trainCap: 4, start: "san",
      intro: "Giao lưu kết thúc trong hỗn loạn. Trước khi tham gia sát hạch Cấp 2, Shen có ba ngày.",
      locations: {
        san: academy([["itadori", "fushiguro", "kugisaki"], ["maki", "panda", "inumaki"], ["itadori"]]),
        voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yaga"], []], idle: "Võ đường thoảng mùi gỗ mới thay.", events: [] },
        vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["gojo", "ijichi"], ["ieiri", "nanami"], ["ieiri"]], idle: "Báo cáo về vụ đột kích chất cao trên bàn.", events: [] },
        pho: { name: "Phố gần ga", env: "city", npcs: [[], ["kugisaki", "todo"], []], idle: "Todo đứng ở góc phố như đang chờ ai đó. Người qua đường tránh xa.", events: [] },
      } },
  };

  /* ---------- CỬA HÀNG ---------- */
  const SHOPS = {
    system: { name: "Cửa hàng Hệ thống", currency: "sp", desc: "Mở mọi lúc ngoài trận đấu. Thanh toán bằng Điểm Hệ thống. Hàng có giới hạn theo mỗi arc.",
      items: [
        { id: "dan_he", price: 30, stock: 5 }, { id: "tinh_STR", price: 60, stock: 2 }, { id: "tinh_AGI", price: 60, stock: 2 }, { id: "tinh_VIT", price: 60, stock: 2 },
        { id: "tinh_INT", price: 60, stock: 2 }, { id: "tinh_WIS", price: 60, stock: 2 }, { id: "manh_tiem", price: 150, stock: 1 },
        { id: "kiem_chu3", price: 150, stock: 1 }, { id: "gang_khac", price: 110, stock: 1 }, { id: "ao_bua", price: 120, stock: 1 },
      ] },
    academy: { name: "Kho hậu cần Học viện", currency: "yen", hubOnly: true, desc: "Chỉ mở trong thời gian tự do. Thanh toán bằng yên.",
      items: [
        { id: "bang_gac", price: 1500 }, { id: "nuoc_chu", price: 2000 }, { id: "thuoc_ieiri", price: 6000, stock: 4 },
        { id: "dao_chu4", price: 15000, stock: 1 }, { id: "giay_chu", price: 12000, stock: 1 }, { id: "con_go", price: 25000, stock: 1 }, { id: "vong_bua", price: 30000, stock: 1 },
      ] },
    gifts: { name: "Tiệm quà ở phố", currency: "yen", hubOnly: true, desc: "Chỉ mở trong thời gian tự do. Quà để tặng NPC.",
      items: [
        { id: "banh_ngot", price: 800 }, { id: "keo_deo", price: 400 }, { id: "dia_phim", price: 1000 }, { id: "sach_cu", price: 1200 }, { id: "tap_chi", price: 900 },
        { id: "ca_phe", price: 700 }, { id: "com_nam", price: 300 }, { id: "day_quan", price: 1500 }, { id: "anh_idol", price: 2000 },
        { id: "thuoc_da_day", price: 600 }, { id: "ca_phe_lon", price: 200 }, { id: "hoa_qua", price: 1500 },
      ] },
  };

  /* ---------- PHẦN THƯỞNG ĐỘT PHÁ (cố định + chọn 1) ---------- */
  const RANK_REWARDS = {
    D: { fixed: { item: "huy_hieu3", achievement: "a_rankD", rep: { tokyo: 5 }, sp: 100, yen: 50000 },
      choices: [
        { name: "Thân thể Cấp 3", desc: "STR +2, VIT +2, AGI +1 (cơ bản, vĩnh viễn).", eff: { base: { STR: 2, VIT: 2, AGI: 1 } } },
        { name: "Tâm pháp Cấp 3", desc: "INT +2, WIS +3 (cơ bản, vĩnh viễn).", eff: { base: { INT: 2, WIS: 3 } } },
        { name: "Bí truyền Học viện", desc: "Học kỹ năng Bộ pháp chú lực và nhận 2 Thuốc hồi phục của Ieiri.", eff: { skill: "sk_step", item: { id: "thuoc_ieiri", qty: 2 } } },
      ] },
    C: { fixed: { item: "huy_hieu2", achievement: "a_rankC", rep: { tokyo: 8 }, sp: 300, yen: 150000 },
      choices: (s) => [
        { name: "Thông thạo thuật thức", desc: s.technique ? "Học kỹ năng thuật thức thứ ba: " + D.SKILLS[TECH3[s.technique]].name + ". " + D.SKILLS[TECH3[s.technique]].desc : "Cần có thuật thức.", eff: s.technique ? { skill: TECH3[s.technique] } : {} },
        { name: "Chú cụ cấp 2", desc: "Nhận Trường kiếm chú cụ cấp 2: STR +6, AGI +4, WIS +2.", eff: { item: "kiem_chu2" } },
        { name: "Tiềm năng khai mở", desc: "+8 điểm chỉ số tự do.", eff: { sp: 0, base: {} , points: 8 } },
      ] },
  };

  Object.assign(D.ACHIEVEMENTS, {
    a_rankC: "Chú thuật sư Cấp 2", a_bond_yuji: "Bạn thân của Itadori", a_bond_megumi: "Lòng tin của Fushiguro", a_bond_nobara: "Đồng đội của Kugisaki",
    a_bond_gojo: "Học trò của kẻ mạnh nhất", a_bond_nanami: "Lưng của người lớn", a_junpei: "Linh hồn không bị nhào nặn", a_blackflash: "Chứng kiến Hắc Thiểm", a_mvp: "Ngôi sao bóng chày",
  });
  Object.assign(D.QUESTS, {
    q_kawasaki: { name: "Vụ án rạp chiếu phim", desc: "Điều tra ba cái chết bất thường ở Kawasaki cùng Nanami." },
    q_junpei: { name: "Người bạn ở Kawasaki", desc: "Giúp Junpei thoát khỏi bàn tay của Mahito." },
    q_kyoto: { name: "Giao lưu Kyoto", desc: "Tham gia sự kiện giao lưu giữa hai trường." },
    q_trialC: { name: "Sát hạch Cấp 2", desc: "Một mình trừ khử chú linh cấp 2." },
  });

  /* ---------- DANH MỤC KỸ NĂNG (học trực tiếp) ----------
     cur: "yen" = Học viện dạy, chỉ học trong thời gian tự do · "sp" = Hệ thống truyền thẳng, học mọi lúc ngoài trận */
  const SKILL_SHOP = [
    { id: "sk_kick", cur: "yen", price: 8000, req: { STR: 8 }, by: "Hiệu trưởng Yaga" },
    { id: "sk_step", cur: "yen", price: 15000, req: { AGI: 9 }, by: "Maki (bài tập bộ pháp)" },
    { id: "sk_bandage", cur: "yen", price: 10000, req: { WIS: 8 }, by: "Bác sĩ Ieiri" },
    { id: "sk_shot", cur: "yen", price: 15000, req: { INT: 10 }, by: "Giáo trình Học viện" },
    { id: "sk_combo", cur: "yen", price: 12000, req: { AGI: 10 }, by: "Giáo trình Học viện" },
    { id: "sk_block", cur: "yen", price: 20000, req: { level: 6 }, by: "Giáo trình Học viện" },
    { id: "sk_focus", cur: "yen", price: 18000, req: { WIS: 12 }, by: "Nanami Kento" },
    { id: "sk_simple", cur: "yen", price: 60000, req: { rank: "C", level: 18 }, by: "Bí truyền Học viện" },
    { id: "sk_heavy", cur: "sp", price: 60, req: { STR: 15 }, by: "Hệ thống" },
    { id: "sk_pierce", cur: "sp", price: 80, req: { level: 8 }, by: "Hệ thống" },
    { id: "sk_eye", cur: "sp", price: 100, req: { WIS: 15 }, by: "Hệ thống" },
    { id: "sk_burst", cur: "sp", price: 150, req: { level: 12, rank: "D" }, by: "Hệ thống" },
    { id: "sk_regen", cur: "sp", price: 200, req: { level: 15 }, by: "Hệ thống" },
  ];

  Object.assign(D, { SOCIAL, HUBS, SHOPS, RANK_REWARDS, TECH3, SKILL_SHOP });
})(typeof window !== "undefined" ? window : globalThis);
