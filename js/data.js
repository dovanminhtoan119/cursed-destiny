/* =====================================================================
   CURSED DESTINY — DỮ LIỆU THẾ GIỚI (World Adapter: Chú Thuật Hồi Chiến)
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {});

  /* ---------- WORLD RULES (ghi nhận theo mục 2.2) ---------- */
  const WORLD_RULES = [
    "MP được thay bằng Chú lực: Chú lực tối đa = 20 + 10×INT + 10×WIS.",
    "Kháng chú (phòng thủ trước đòn chú lực) = 0.5×WIS + 0.25×INT.",
    "Rank E–SSS ánh xạ sang cấp chú thuật sư: E Cấp 4 · D Cấp 3 · C Cấp 2 · B Bán cấp 1 · A Cấp 1 · S Đặc cấp · SS Đặc cấp siêu việt · SSS Thiên thượng.",
    "Class = Thuật thức. Mỗi thuật thức có 4 bậc tiến hóa và ít nhất một nhánh ẩn.",
    "Đặc tính cá nhân nhân hệ số lên chỉ số sau khi cộng thẳng (cơ bản + trang bị + khế ước), rồi làm tròn xuống. Hai đặc tính cùng tăng một chỉ số thì nhân với nhau.",
    "Hệ thống cho phép Shen vừa mang Thiên dữ chú phược vừa dùng thuật thức — điều mà người thường không thể có. Mỗi khế ước có cái giá cố định.",
    "Đòn đánh tay không dùng Tấn công vật lý, trừ Giáp. Đòn chú lực dùng Uy lực chú lực, trừ Kháng chú.",
    "Thứ tự sát thương: Tấn công × Hệ số → trừ phòng thủ (tối thiểu 1) → chí mạng ×1.5 → yếu/kháng → làm tròn xuống.",
    "Chú linh có HP tối đa ×1.5 so với công thức chung (chúng không biết đau).",
    "Chú lực hồi 2 điểm, Thể lực hồi 5 điểm mỗi lượt chiến đấu (có thể đổi bởi đặc tính).",
  ];

  /* ---------- ĐẶC TÍNH CÁ NHÂN (chọn 2 trong 20) ----------
     mult: hệ số nhân lên chỉ số hiệu dụng — càng lên cấp, đặc tính càng mạnh.
     note: hiệu ứng đặc biệt ngoài chỉ số (đã được engine xử lý qua mods hoặc id). */
  const T = (name, group, mult, mods, note) => ({ name, group, mult, mods: mods || {}, note: note || "" });
  const TRAITS = {
    thephach:   T("Thể Phách Cuồng Bạo", "Cận chiến", { STR: 1.25, VIT: 1.1 }, { dmgPhys: 1.1 }, "Sát thương vật lý ×1.10."),
    vosu:       T("Thiên Phú Võ Học", "Cận chiến", { STR: 1.15, AGI: 1.15 }),
    satthu:     T("Bản Năng Sát Thủ", "Cận chiến", { STR: 1.1, AGI: 1.1 }, { critBonus: 0.05 }, "Chí mạng +5%."),
    phanxa:     T("Phản Xạ Thú Hoang", "Cận chiến", { AGI: 1.15, STR: 1.1 }, { critBonus: 0.02 }, "Chí mạng +2%."),
    thanphap:   T("Thân Pháp Ảnh", "Nhanh nhẹn", { AGI: 1.25, LUK: 1.1 }, { evaBonus: 0.05 }, "Né tránh +5%."),
    bongma:     T("Bước Chân Bóng Ma", "Nhanh nhẹn", { AGI: 1.2, WIS: 1.1 }, { evaBonus: 0.04 }, "Né tránh +4%."),
    dadong:     T("Da Đồng Xương Sắt", "Bền bỉ", { VIT: 1.3, STR: 1.05 }),
    ychi:       T("Ý Chí Bất Khuất", "Bền bỉ", { VIT: 1.2 }, {}, "HP dưới 25%: sát thương ×1.20. Mỗi trận một lần trụ lại với 1 HP."),
    hoiphuc:    T("Thể Chất Hồi Phục", "Bền bỉ", { VIT: 1.15 }, { hpMult: 1.1, staRegen: 5 }, "HP tối đa ×1.10, hồi thêm 5 Thể lực mỗi lượt."),
    songsot:    T("Kẻ Sống Sót", "Bền bỉ", { VIT: 1.1, LUK: 1.2 }, { evaBonus: 0.03 }, "Né tránh +3%."),
    tamnhan:    T("Tâm Nhãn", "Chú lực", { WIS: 1.25, INT: 1.1 }, {}, "Quan sát được đầy đủ chỉ số kẻ địch cao hơn tới 2 Rank (mặc định 1)."),
    chienthuat: T("Bộ Óc Chiến Thuật", "Chú lực", { INT: 1.25, WIS: 1.1 }, { dmgCurse: 1.1 }, "Sát thương chú lực ×1.10."),
    chuluc:     T("Dòng Chú Lực Dồi Dào", "Chú lực", { WIS: 1.05 }, { ceMult: 1.2, ceRegen: 2 }, "Chú lực tối đa ×1.20, hồi thêm 2 Chú lực mỗi lượt."),
    dacquanh:   T("Chú Lực Đặc Quánh", "Chú lực", { WIS: 1.1 }, { dmgCurse: 1.15 }, "Sát thương chú lực ×1.15."),
    huyetmach:  T("Huyết Mạch Chú Thuật Sư", "Chú lực", { INT: 1.15, WIS: 1.15 }),
    tritue:     T("Tâm Trí Sắc Bén", "Chú lực", { INT: 1.2, LUK: 1.1 }),
    timthep:    T("Trái Tim Thép", "Tinh thần", { WIS: 1.15, VIT: 1.1 }),
    hocnhanh:   T("Kẻ Học Nhanh", "Tinh thần", { INT: 1.1 }, { expMult: 1.15 }, "EXP nhận được ×1.15."),
    saomay:     T("Sao May Mắn", "Vận mệnh", { LUK: 1.4 }, { critBonus: 0.03 }, "Chí mạng +3%."),
    conghuong:  T("Cộng Hưởng Hệ Thống", "Vận mệnh", { STR: 1.05, AGI: 1.05, VIT: 1.05, INT: 1.05, WIS: 1.05, LUK: 1.05 }, { expMult: 1.05 }, "EXP nhận được ×1.05."),
  };
  Object.values(TRAITS).forEach((t) => {
    t.desc = Object.entries(t.mult).map(([k, v]) => k + " ×" + v).join(", ") + "." + (t.note ? " " + t.note : "");
  });

  /* ---------- THIÊN DỮ CHÚ PHƯỢC (khế ước Hệ thống) ---------- */
  const RESTRICTIONS = {
    xacthit: { name: "Xác Thịt Tối Thượng", stats: { STR: 4, AGI: 4, VIT: 4 }, mods: { ceMult: 0.7 }, desc: "STR +4, AGI +4, VIT +4. Đổi lại: Chú lực tối đa ×0.70." },
    tamthan: { name: "Tâm Thần Thiên Bẩm", stats: { INT: 4, WIS: 6 }, mods: { ceRegen: 3, hpMult: 0.8 }, desc: "INT +4, WIS +6, hồi thêm 3 chú lực mỗi lượt. Đổi lại: HP tối đa ×0.80." },
    menhdoi: { name: "Mệnh Đổi Mệnh", stats: { LUK: 5 }, mods: { critBonus: 0.1, techHpCost: 0.05 }, desc: "LUK +5, chí mạng +10%. Đổi lại: mỗi lần dùng kỹ năng thuật thức mất 5% HP hiện tại." },
  };

  /* ---------- KỸ NĂNG ---------- */
  const SKILLS = {
    sk_punch: { name: "Đấm thường", cost: { sta: 5 }, cd: 0, effect: { dmg: { src: "patk", mult: 1.5 } }, desc: "Tấn công vật lý ×1.5. Tốn 5 Thể lực." },
    sk_guard: { name: "Phòng thủ", cost: {}, cd: 0, effect: { guard: true }, desc: "Giảm 50% sát thương nhận vào trong lượt này." },
    sk_cefist: { name: "Quyền gia cố chú lực", cost: { ce: 15 }, cd: 1, effect: { dmg: { src: "hybrid", mult: 2.2 } }, desc: "(Tấn công + 0.5×Uy lực chú lực) ×2.2. Tốn 15 Chú lực, hồi chiêu 1 lượt." },
    sk_delay: { name: "Quyền chú lực trễ nhịp", cost: { ce: 25, sta: 10 }, cd: 3, effect: { dmg: { src: "hybrid", mult: 3.0 }, sure: true }, desc: "Chú lực đến sau cú đấm nửa nhịp, không thể né. (Tấn công + 0.5×Uy lực) ×3.0. Tốn 25 Chú lực, 10 Thể lực, hồi chiêu 3 lượt." },
    sk_heavy: { name: "Cú đấm trọng kích", cost: { sta: 20 }, cd: 2, effect: { dmg: { src: "patk", mult: 2.4 } }, desc: "Tấn công vật lý ×2.4. Tốn 20 Thể lực, hồi chiêu 2 lượt. (Mốc ẩn STR 20)" },
    // Thuật thức — bậc 1
    tk_khac: { tech: true, name: "Khắc Ấn", cost: { ce: 12 }, cd: 0, effect: { dmg: { src: "cpow", mult: 1.0 }, mark: true }, desc: "Uy lực chú lực ×1.0, khắc 1 ấn lên mục tiêu (tối đa 3). Tốn 12 Chú lực." },
    tk_kich: { tech: true, name: "Kích Ấn", cost: { ce: 25 }, cd: 2, effect: { dmg: { src: "cpow", mult: 1.2 }, detonate: true, sure: true }, desc: "Uy lực ×1.2 × (1 + số ấn), không thể né, xóa ấn. Tốn 25 Chú lực, hồi chiêu 2 lượt." },
    tk_guong: { tech: true, name: "Gương Hứng", cost: { ce: 15 }, cd: 1, effect: { store: true }, desc: "Hứng 60% sát thương của đòn kế tiếp và tích lại. Tốn 15 Chú lực, hồi chiêu 1 lượt." },
    tk_tra: { tech: true, name: "Trả Ảnh", cost: { ce: 20 }, cd: 2, effect: { dmg: { src: "cpow", mult: 1.2 }, release: true }, desc: "(Uy lực + sát thương đã tích) ×1.2. Tốn 20 Chú lực, hồi chiêu 2 lượt." },
    tk_de: { tech: true, name: "Đè Ép", cost: { ce: 18 }, cd: 1, effect: { dmg: { src: "cpow", mult: 1.4 }, debuff: { stat: "atk", pct: 0.2, turns: 2, label: "giảm 20% tấn công" } }, desc: "Uy lực ×1.4, giảm 20% tấn công mục tiêu trong 2 lượt. Tốn 18 Chú lực, hồi chiêu 1 lượt." },
    tk_trongquyen: { tech: true, name: "Trọng Quyền", cost: { ce: 22, sta: 10 }, cd: 2, effect: { dmg: { src: "hybrid", mult: 2.6 } }, desc: "(Tấn công + 0.5×Uy lực) ×2.6. Tốn 22 Chú lực, 10 Thể lực, hồi chiêu 2 lượt." },
    tk_buoc: { tech: true, name: "Buộc Chỉ", cost: { ce: 15 }, cd: 3, effect: { stun: 0.6 }, desc: "60% trói mục tiêu, khiến nó mất lượt kế tiếp. Tốn 15 Chú lực, hồi chiêu 3 lượt." },
    tk_keo: { tech: true, name: "Kéo Chỉ", cost: { ce: 18 }, cd: 1, effect: { dmg: { src: "cpow", mult: 1.6 } }, desc: "Uy lực ×1.6. Tốn 18 Chú lực, hồi chiêu 1 lượt." },
    tk_can: { tech: true, name: "Cắn Chú", cost: { ce: 15 }, cd: 1, effect: { dmg: { src: "cpow", mult: 1.3 }, drain: 0.5 }, desc: "Uy lực ×1.3, hút lại 50% sát thương thành Chú lực. Tốn 15 Chú lực, hồi chiêu 1 lượt." },
    tk_ham: { tech: true, name: "Hàm Chú", cost: { ce: 30 }, cd: 3, effect: { dmg: { src: "cpow", mult: 2.0 } }, desc: "Uy lực ×2.0. Tốn 30 Chú lực, hồi chiêu 3 lượt." },
    tk_loa: { tech: true, name: "Lóa Sáng", cost: { ce: 12 }, cd: 3, effect: { blind: 0.3 }, desc: "Giảm 30% khả năng đánh trúng của mục tiêu trong 2 lượt. Tốn 12 Chú lực, hồi chiêu 3 lượt." },
    tk_tien: { tech: true, name: "Quang Tiễn", cost: { ce: 18 }, cd: 1, effect: { dmg: { src: "cpow", mult: 1.6 } }, desc: "Uy lực ×1.6. Tốn 18 Chú lực, hồi chiêu 1 lượt." },
  };

  /* ---------- THUẬT THỨC (Class) — weights: dấu vết ẩn quyết định gợi ý ---------- */
  const TECHNIQUES = {
    khacan: { name: "Khắc Ấn Thuật", weights: { phongan: 3, quansat: 2 },
      desc: "Khắc ấn chú lực lên mục tiêu, tích tụ rồi kích nổ cùng lúc. Mạnh khi có thời gian chuẩn bị, yếu khi bị áp sát liên tục.",
      tier1: { skills: ["tk_khac", "tk_kich"], passive: "Ấn tồn tại tới hết trận." },
      tree: ["B1 Khắc Ấn", "B2 Ấn Liên Hoàn | Ấn Phong Cấm", "B3 Vạn Ấn Trận | Phong Thiên Ấn", "B4 Thiên La Ấn Giới"], hidden: "Huyết Ấn Nghịch Mệnh" },
    phananh: { name: "Phản Ảnh Thuật", weights: { baove: 3, quansat: 2 },
      desc: "Dựng gương chú lực hứng đòn, tích lại rồi trả về kẻ địch. Mạnh khi phòng thủ, phụ thuộc vào việc bị đánh.",
      tier1: { skills: ["tk_guong", "tk_tra"], passive: "Sát thương đã tích giữ tới hết trận." },
      tree: ["B1 Phản Ảnh", "B2 Kính Trận | Ảnh Đoạt", "B3 Vô Tận Kính Cung", "B4 Thế Giới Trong Gương"], hidden: "Kính Hư Thực" },
    trongap: { name: "Trọng Áp Thuật", weights: { xungkich: 3, baove: 1 },
      desc: "Làm chú lực có khối lượng: đè nặng kẻ địch và gia trọng nắm đấm. Cận chiến mạnh, tầm xa yếu.",
      tier1: { skills: ["tk_de", "tk_trongquyen"], passive: "Đòn gia trọng dùng cả Thể lực lẫn Chú lực." },
      tree: ["B1 Trọng Áp", "B2 Trọng Quyền | Trường Lực", "B3 Tinh Hạch Sụp Đổ", "B4 Thiên Thể Giáng Lâm"], hidden: "Phản Trọng Lực" },
    lientuyen: { name: "Liên Tuyến Thuật", weights: { lienket: 3, baove: 2 },
      desc: "Sợi chỉ chú lực nối người với người, vật với vật: trói, kéo, truyền chú lực cho đồng đội. Mạnh khi có đồng đội.",
      tier1: { skills: ["tk_buoc", "tk_keo"], passive: "Về sau có thể nối chú lực với đồng minh." },
      tree: ["B1 Liên Tuyến", "B2 Lưới Nhện | Mệnh Tuyến", "B3 Vạn Tuyến Thiên Võng", "B4 Sợi Chỉ Định Mệnh"], hidden: "Tuyến Hồn Đồng Sinh" },
    thucchu: { name: "Thực Chú Thuật", weights: { haptu: 3, xungkich: 2 },
      desc: "Nuốt chú lực của chú linh. Mỗi chú linh cùng hoặc cao Rank bị tiêu diệt cho +1 chỉ số vĩnh viễn (mỗi loại một lần). Rủi ro: chú lực ô nhiễm ở bậc cao.",
      tier1: { skills: ["tk_can", "tk_ham"], passive: "Hấp thụ: +1 chỉ số vĩnh viễn từ chú linh cùng hoặc cao Rank, liệt kê theo từng con." },
      tree: ["B1 Thực Chú", "B2 Hàm Chú | Chú Thể Đồng Hóa", "B3 Thao Thiết Chú Vương", "B4 Nuốt Trời"], hidden: "Bách Quỷ Nhập Thân" },
    tichquang: { name: "Tịch Quang Thuật", weights: { anhsang: 3, quansat: 2 },
      desc: "Biến chú lực thành ánh sáng lạnh: làm lóa mắt và bắn xuyên. Mạnh trước chú linh ưa bóng tối, tốn chú lực nhanh.",
      tier1: { skills: ["tk_loa", "tk_tien"], passive: "Chú linh cấp thấp né kém hơn trước ánh sáng." },
      tree: ["B1 Tịch Quang", "B2 Quang Tiễn Liên Phát | Quang Thuẫn", "B3 Bạch Dạ", "B4 Nhật Thực Giới"], hidden: "Hắc Quang" },
  };

  /* ---------- VẬT PHẨM (phẩm chất ≠ Rank — mục 9.2) ---------- */
  const ITEMS = {
    bua_chay: { name: "Lá bùa cháy dở", slot: "Phụ kiện", quality: "Phổ thông", stats: { WIS: 1 }, unique: true, lore: "Mảnh bùa phong ấn tủ số 44, cháy mất một nửa." },
    bang_tay: { name: "Băng quấn tay chú lực", slot: "Găng tay", quality: "Tốt", stats: { STR: 2, VIT: 1 }, lore: "Băng vải tẩm chú lực, phát cho học sinh năm nhất." },
    dongphuc: { name: "Đồng phục Cao đẳng Chú thuật", slot: "Giáp", quality: "Tốt", stats: { VIT: 2, WIS: 1 }, unique: true, lore: "May riêng theo yêu cầu. Shen chọn kiểu cổ cao." },
    giay_tap: { name: "Giày tập cũ", slot: "Giày", quality: "Phổ thông", stats: { AGI: 1 }, lore: "Đôi giày đã theo Shen suốt ba năm cấp hai." },
    huy_hieu3: { name: "Huy hiệu Chú thuật sư Cấp 3", slot: "Phụ kiện", quality: "Hiếm", stats: { INT: 1, WIS: 1, VIT: 1 }, unique: true, req: { rank: "D" }, lore: "Chứng nhận chính thức của Học viện." },
    thuoc_ieiri: { name: "Thuốc hồi phục của Ieiri", stack: true, quality: "Tốt", use: { hp: 120 }, lore: "Hồi 120 HP. Vị đắng kinh khủng." },
    keo_gojo: { name: "Kẹo của Gojo", stack: true, quality: "Phổ thông", use: { ce: 40 }, lore: "Hồi 40 Chú lực. Ngọt tới mức đau răng." },
    manh_thai: { name: "Mảnh vỏ Chú thai đặc cấp", quality: "Hiếm", unique: true, lore: "Vẫn còn ấm. Hệ thống đánh dấu: [Có thể dùng về sau]." },
  };

  /* ---------- NPC & CHÚ LINH: tương quan sức mạnh ---------- */
  // Tổng chỉ số ≈ 30 + 5×(Lv−1), giống người chơi. w = tỷ trọng STR,AGI,VIT,INT,WIS,LUK
  function mk(name, rank, lv, w, extra) {
    const total = 30 + 5 * (lv - 1), sum = w.reduce((a, b) => a + b, 0);
    const keys = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"], stats = {};
    keys.forEach((k, i) => (stats[k] = Math.max(1, Math.round((total * w[i]) / sum))));
    return Object.assign({ name, rank, lv, stats }, extra || {});
  }
  const NPCS = {
    // — Kẻ địch có thể chiến đấu (đã cân chỉnh) —
    c_tu44: { name: "Chú linh tủ đồ số 44", rank: "E", lv: 2, stats: { STR: 6, AGI: 5, VIT: 3, INT: 2, WIS: 3, LUK: 2 }, exp: 300, devour: "STR",
      skills: [{ name: "Hàm răng mực", mult: 1.4, src: "patk", cd: 2 }, { name: "Cào", mult: 1.1, src: "patk" }], desc: "Chú linh cấp 4 sinh ra từ nỗi sợ của học sinh với chiếc tủ bị đồn ma." },
    c_cap4a: { name: "Chú linh cầu thang", rank: "E", lv: 3, stats: { STR: 6, AGI: 6, VIT: 4, INT: 2, WIS: 2, LUK: 2 }, exp: 300, devour: "AGI",
      skills: [{ name: "Lao xuống", mult: 1.3, src: "patk", cd: 1 }, { name: "Cắn", mult: 1.0, src: "patk" }], desc: "Chú linh cấp 4 bám ở cầu thang thoát hiểm." },
    c_cap4b: { name: "Chú linh ống thông gió", rank: "E", lv: 3, stats: { STR: 5, AGI: 7, VIT: 4, INT: 3, WIS: 2, LUK: 2 }, exp: 300, devour: "AGI",
      skills: [{ name: "Phun bụi chú", mult: 1.2, src: "cpow", cd: 2 }, { name: "Quất", mult: 1.0, src: "patk" }], desc: "Chú linh cấp 4 sống trong đường ống." },
    c_cap3_rpg: { name: "Chú linh bù nhìn Roppongi", rank: "D", lv: 6, stats: { STR: 10, AGI: 9, VIT: 8, INT: 4, WIS: 5, LUK: 3 }, exp: 900, devour: "VIT",
      skills: [{ name: "Vồ bằng tay gỗ", mult: 1.4, src: "patk", cd: 2 }, { name: "Đập", mult: 1.1, src: "patk" }], desc: "Chú linh cấp 3 giữ một đứa trẻ làm con tin." },
    c_cap4c: { name: "Bầy chú linh nhà ga bỏ hoang", rank: "E", lv: 4, stats: { STR: 10, AGI: 9, VIT: 9, INT: 4, WIS: 5, LUK: 3 }, exp: 600, devour: "LUK",
      skills: [{ name: "Ùa tới", mult: 1.4, src: "patk", cd: 2 }, { name: "Cào cấu", mult: 1.1, src: "patk" }], desc: "Hàng chục chú linh cấp 4 kết thành một khối." },
    c_trial: { name: "Chú linh cấp 3 — Thử thách", rank: "D", lv: 8, stats: { STR: 15, AGI: 13, VIT: 16, INT: 9, WIS: 9, LUK: 3 }, exp: 1200, devour: "WIS",
      skills: [{ name: "Xúc tu xuyên", mult: 1.4, src: "patk", cd: 2 }, { name: "Sóng oán khí", mult: 1.3, src: "cpow", cd: 3 }, { name: "Quật", mult: 1.1, src: "patk" }], desc: "Chú linh do Học viện bắt giữ, dùng làm bài sát hạch Cấp 3." },
    c_hosp: { name: "Chú linh hành lang bệnh viện", rank: "D", lv: 7, stats: { STR: 15, AGI: 15, VIT: 14, INT: 8, WIS: 8, LUK: 3 }, exp: 1000, devour: "INT",
      skills: [{ name: "Tiếng khóc xé tai", mult: 1.3, src: "cpow", cd: 2 }, { name: "Bò tới", mult: 1.2, src: "patk" }], desc: "Chú linh cấp 3 ở khu bệnh viện bỏ hoang." },
    c_womb: mk("Chú thai đặc cấp (Trại giam Eishū)", "S", 76, [25, 22, 25, 10, 13, 5], { desc: "Chú linh đặc cấp vừa nở. Một đòn đủ giết Shen nhiều lần." }),

    // — Arc 0–1 —
    gojo: mk("Gojo Satoru", "SSS", 180, [14, 17, 14, 18, 20, 9], { faction: "tokyo", hide: true, desc: "Chú thuật sư mạnh nhất. Hệ thống không thể phân tích." }),
    itadori: mk("Itadori Yuji", "D", 14, [30, 27, 28, 5, 5, 5], { faction: "tokyo", desc: "Thể chất phi thường, vật chứa của Sukuna." }),
    fushiguro: mk("Fushiguro Megumi", "C", 22, [15, 19, 15, 22, 24, 5], { faction: "tokyo", desc: "Thuật thức Thập Chủng Ảnh Pháp. Cấp 2." }),
    kugisaki: mk("Kugisaki Nobara", "D", 15, [14, 14, 13, 17, 17, 9], { faction: "tokyo", desc: "Thuật thức Sô Linh Chú Pháp (búa và đinh)." }),
    ijichi: mk("Ijichi Kiyotaka", "E", 6, [3, 4, 4, 9, 8, 2], { faction: "tokyo", desc: "Phụ tá, phụ trách đưa đón và dựng màn." }),
    yaga: mk("Yaga Masamichi", "A", 58, [20, 15, 20, 20, 22, 3], { faction: "tokyo", desc: "Hiệu trưởng, điều khiển chú hài." }),
    ieiri: mk("Ieiri Shoko", "B", 40, [5, 8, 10, 35, 40, 2], { faction: "tokyo", desc: "Bác sĩ, dùng được Phản chuyển thuật thức cho người khác." }),
    sukuna_a1: mk("Ryomen Sukuna (vài ngón tay)", "S", 95, [24, 22, 18, 16, 15, 5], { faction: "chulinh", hide: true, desc: "Vua Nguyền. Dù mới có vài ngón tay vẫn vượt xa mọi thứ Shen từng thấy." }),

    // — Arc 2–4 —
    nanami: mk("Nanami Kento", "A", 62, [25, 18, 22, 15, 15, 5], { faction: "tokyo", desc: "Thuật thức Tỷ Lệ Thất Tam." }),
    junpei: mk("Yoshino Junpei", "E", 4, [3, 4, 3, 6, 6, 2], { desc: "Học sinh cấp ba, bị Mahito lợi dụng." }),
    mahito: mk("Mahito", "S", 80, [18, 20, 15, 22, 20, 5], { faction: "chulinh", desc: "Đặc cấp, Vô Vi Chuyển Biến — chạm vào linh hồn." }),
    jogo: mk("Jogo", "S", 92, [12, 15, 14, 28, 26, 5], { faction: "chulinh", desc: "Đặc cấp, chú linh của núi lửa." }),
    hanami: mk("Hanami", "S", 88, [18, 14, 28, 16, 20, 4], { faction: "chulinh", desc: "Đặc cấp, chú linh của rừng." }),
    todo: mk("Todo Aoi", "A", 55, [28, 20, 22, 10, 12, 8], { faction: "kyoto", desc: "Bất Nghĩa Du Hí — đổi vị trí bằng tiếng vỗ tay." }),
    kamo: mk("Kamo Noritoshi", "B", 40, [12, 16, 12, 20, 20, 5], { faction: "kyoto", desc: "Xích Huyết Thao Thuật." }),
    mai: mk("Zenin Mai", "C", 26, [12, 15, 10, 15, 14, 6], { faction: "kyoto", desc: "Thuật thức Cấu Trúc." }),
    momo: mk("Nishimiya Momo", "C", 24, [8, 18, 9, 16, 16, 5], { faction: "kyoto", desc: "Điều khiển chổi bay." }),
    miwa: mk("Miwa Kasumi", "D", 18, [14, 16, 12, 10, 10, 4], { faction: "kyoto", desc: "Kiếm sĩ Tân Âm Lưu." }),
    mechamaru: mk("Mechamaru", "B", 38, [15, 12, 15, 22, 16, 3], { faction: "kyoto", desc: "Điều khiển hình nhân từ xa." }),
    maki: mk("Zenin Maki", "C", 30, [26, 26, 22, 6, 6, 5], { faction: "tokyo", desc: "Thiên dữ chú phược, dùng chú cụ." }),
    inumaki: mk("Inumaki Toge", "B", 36, [10, 14, 10, 18, 22, 4], { faction: "tokyo", desc: "Chú ngôn." }),
    panda: mk("Panda", "B", 37, [24, 16, 26, 8, 10, 4], { faction: "tokyo", desc: "Chú hài đột biến." }),
    utahime: mk("Utahime Iori", "A", 50, [10, 12, 14, 20, 26, 4], { faction: "kyoto", desc: "Giáo viên Kyoto." }),
    gakuganji: mk("Gakuganji Yoshinobu", "A", 60, [15, 12, 18, 20, 24, 3], { faction: "kyoto", desc: "Hiệu trưởng Kyoto." }),
    eso: mk("Eso", "B", 36, [14, 14, 16, 16, 14, 3], { faction: "chulinh", desc: "Cửu tướng Chú thai, máu ăn mòn." }),
    kechizu: mk("Kechizu", "C", 30, [14, 12, 16, 12, 12, 3], { faction: "chulinh", desc: "Cửu tướng Chú thai." }),
    choso: mk("Choso", "A", 70, [16, 16, 18, 20, 20, 4], { faction: "chulinh", desc: "Anh cả Cửu tướng Chú thai, Xích Huyết Thao Thuật." }),

    // — Arc 5–8 —
    geto_young: mk("Geto Suguru (thời trẻ)", "S", 95, [15, 15, 15, 20, 25, 5], { desc: "Chú linh Thao Thuật." }),
    toji: mk("Fushiguro Toji", "SS", 110, [30, 32, 26, 6, 6, 6], { desc: "Thiên dữ chú phược hoàn toàn, không chú lực." }),
    riko: mk("Amanai Riko", "E", 3, [2, 3, 3, 4, 5, 3], { desc: "Tinh tương thể." }),
    kenjaku: mk("Kenjaku", "SS", 135, [12, 14, 14, 30, 30, 5], { faction: "chulinh", hide: true, desc: "Kẻ đứng sau tất cả." }),
    uraume: mk("Uraume", "S", 98, [12, 16, 14, 24, 24, 4], { faction: "chulinh", desc: "Băng thuật, tùy tùng của Sukuna." }),
    dagon: mk("Dagon", "S", 85, [16, 12, 20, 22, 22, 4], { faction: "chulinh", desc: "Đặc cấp, chú linh của biển." }),
    meimei: mk("Mei Mei", "A", 60, [18, 16, 16, 18, 20, 8], { desc: "Thuật thức Quạ Đen." }),
    kusakabe: mk("Kusakabe Atsuya", "A", 55, [22, 20, 20, 12, 18, 4], { faction: "tokyo", desc: "Kiếm thuật Tân Âm Lưu." }),
    naobito: mk("Zenin Naobito", "A", 70, [14, 30, 14, 18, 18, 4], { faction: "ngutamgia", desc: "Gia chủ nhà Zenin, Đầu Xạ Pháp." }),
    yuta: mk("Okkotsu Yuta", "SS", 125, [18, 18, 18, 22, 26, 6], { faction: "tokyo", desc: "Đặc cấp, chú lực khổng lồ, Sao Chép." }),
    naoya: mk("Zenin Naoya", "A", 68, [14, 30, 14, 16, 16, 4], { faction: "ngutamgia", desc: "Đầu Xạ Pháp." }),
    maki2: mk("Zenin Maki (thức tỉnh)", "SS", 112, [30, 32, 28, 4, 4, 4], { faction: "tokyo", desc: "Thiên dữ chú phược hoàn chỉnh." }),
    hakari: mk("Hakari Kinji", "S", 100, [20, 18, 22, 16, 16, 12], { faction: "tokyo", desc: "Lãnh địa may rủi, bất tử khi trúng thưởng." }),
    kirara: mk("Hoshi Kirara", "B", 42, [10, 14, 12, 18, 18, 6], { faction: "tokyo", desc: "Thuật thức chòm sao." }),
    higuruma: mk("Higuruma Hiromi", "S", 95, [12, 12, 14, 26, 28, 4], { desc: "Lãnh địa phiên tòa." }),
    kashimo: mk("Kashimo Hajime", "S", 102, [20, 22, 16, 20, 18, 4], { desc: "Chú thuật sư thời Edo, điện năng." }),
    ishigori: mk("Ishigori Ryu", "A", 74, [16, 12, 18, 22, 22, 4], { desc: "Chú lực đầu ra khổng lồ." }),
    uro: mk("Uro Takako", "A", 72, [12, 18, 14, 20, 22, 4], { desc: "Thao túng bầu trời." }),
    takaba: mk("Takaba Fumihiko", "S", 90, [10, 10, 30, 12, 12, 20], { desc: "Biến điều buồn cười thành hiện thực." }),
    hana: mk("Kurusu Hana (Thiên Sứ)", "S", 92, [10, 12, 14, 24, 30, 4], { desc: "Ánh sáng hóa giải thuật thức." }),
    reggie: mk("Reggie Star", "B", 45, [12, 12, 14, 18, 18, 6], { desc: "Tái hiện từ hóa đơn." }),
    yorozu: mk("Yorozu", "S", 100, [16, 16, 16, 24, 24, 4], { faction: "chulinh", desc: "Cấu trúc thuật, kết giới chân thực." }),
    tengen: mk("Tengen", "SS", 120, [4, 4, 10, 40, 40, 2], { desc: "Bất tử, duy trì kết giới cả nước." }),
    tsukumo: mk("Tsukumo Yuki", "SS", 118, [26, 18, 22, 16, 16, 4], { desc: "Đặc cấp, Tinh Chi Nộ — gia khối lượng." }),
    sukuna: mk("Ryomen Sukuna (hoàn chỉnh)", "SSS", 175, [20, 20, 18, 20, 18, 4], { faction: "chulinh", hide: true, desc: "Vua Nguyền ở trạng thái mạnh nhất." }),
    mahoraga: mk("Bát Ác Kiếm Dị Giới Thần Tướng Ma Hư La", "SS", 130, [26, 18, 28, 10, 14, 4], { desc: "Thức thần thích nghi với mọi thứ." }),
    itadori8: mk("Itadori Yuji (Shinjuku)", "SS", 115, [28, 26, 26, 12, 14, 6], { faction: "tokyo", desc: "Đã thức tỉnh, chạm tới linh hồn." }),
  };

  /* ---------- PHỎNG VẤN (Gojo) — mỗi đáp án ghi dấu vết ẩn ---------- */
  const INTERVIEW = [
    { q: "Lúc con mắt trong tủ nhìn nhóc, nhóc nghĩ gì đầu tiên?", a: [
      { t: "\"Phải nhìn rõ nó là thứ gì đã.\"", trace: { quansat: 2 } },
      { t: "\"Đấm nó trước khi nó kịp làm gì.\"", trace: { xungkich: 2 } },
      { t: "\"Còn ai khác trong trường không?\"", trace: { baove: 2 } }] },
    { q: "Nếu có một thứ nhóc muốn giữ mãi không mất, đó là gì?", a: [
      { t: "Những người ở cạnh mình.", trace: { lienket: 2, baove: 1 }, moral: 3 },
      { t: "Lời hứa mình đã nói ra.", trace: { phongan: 2 }, moral: 2 },
      { t: "Sức mạnh để không ai đè đầu mình nữa.", trace: { haptu: 2, xungkich: 1 }, anti: 3 }] },
    { q: "Chỗ tối nhất nhóc từng ở là đâu?", a: [
      { t: "Căn phòng mất điện hồi nhỏ. Mình ghét bóng tối từ đó.", trace: { anhsang: 2 } },
      { t: "Bên trong đầu mình, lúc mọi thứ rối tung.", trace: { quansat: 1, phongan: 1 } },
      { t: "Không nhớ. Mình không để ý mấy chuyện đó.", trace: { xungkich: 1, haptu: 1 } }] },
    { q: "Bị dồn vào góc tường, nhóc làm gì?", a: [
      { t: "Chịu đòn, đợi nó lộ sơ hở rồi trả lại gấp đôi.", trace: { baove: 2, quansat: 1 } },
      { t: "Lao thẳng vào. Góc tường thì cũng là chỗ đứng vững nhất.", trace: { xungkich: 2 } },
      { t: "Tìm thứ gì quanh đó để dùng: dây, ánh đèn, bất cứ gì.", trace: { lienket: 1, anhsang: 1 } }] },
    { q: "Chú linh sinh ra từ cảm xúc tiêu cực của con người. Nhóc nghĩ sao về chúng?", a: [
      { t: "Chúng là thứ phải bị trừ tận gốc.", trace: { xungkich: 1 }, moral: 2 },
      { t: "Chúng là năng lượng. Năng lượng thì dùng được.", trace: { haptu: 3 }, anti: 4 },
      { t: "Chúng là thứ cần bị niêm phong lại, như cái tủ đó.", trace: { phongan: 3 } }] },
    { q: "Câu cuối. Nếu một ngày nhóc mạnh nhất thế giới, nhóc sẽ làm gì?", a: [
      { t: "Bảo vệ để không ai phải chết vô ích.", trace: { baove: 2, lienket: 1 }, moral: 4 },
      { t: "Thay đổi cái thế giới chú thuật mục nát này, bằng mọi giá.", trace: { xungkich: 1, haptu: 1 }, anti: 6 },
      { t: "Chưa biết. Có lẽ là tìm hiểu tại sao mình lại có Hệ thống.", trace: { quansat: 2, anhsang: 1 } }] },
  ];

  const QUESTS = {
    q_tu44: { name: "Đêm ở trường Kōsen", desc: "Sống sót qua cuộc chạm trán với chú linh tủ số 44." },
    q_roppongi: { name: "Tòa nhà bỏ hoang Roppongi", desc: "Trừ tà tòa nhà cùng Itadori và Kugisaki." },
    q_child: { name: "Đứa trẻ trên tầng bốn", desc: "Cứu đứa trẻ bị chú linh bắt giữ." },
    q_patrol: { name: "Nhà ga bỏ hoang", desc: "Tuần tra một mình theo lệnh Học viện." },
    q_eishu: { name: "Trại giam Eishū", desc: "Xác nhận người sống sót trong trại giam bị Chú thai chiếm." },
    q_interview: { name: "Câu hỏi của Gojo", desc: "Trả lời phỏng vấn để định hình thuật thức." },
    q_trial: { name: "Sát hạch Cấp 3", desc: "Một mình đánh bại chú linh cấp 3 bằng thuật thức của mình." },
  };
  const ACHIEVEMENTS = {
    a_system: "Kẻ được Hệ thống chọn",
    a_firstkill: "Lần trừ tà đầu tiên",
    a_child: "Bàn tay không buông",
    a_witness: "Chứng nhân của Vua Nguyền",
    a_rankD: "Chú thuật sư Cấp 3",
  };
  const MILESTONE_REWARDS = {
    "STR@10": { text: "Cơ thể quen với chú lực, cú đấm nặng hơn hẳn." },
    "STR@20": { text: "Mở kỹ năng ẩn Cú đấm trọng kích.", skill: "sk_heavy" },
    "AGI@10": { text: "Phản xạ đủ nhanh để thấy đòn của chú linh cấp 4 trước khi nó tới." },
    "VIT@10": { text: "Cơ thể chịu được chú lực của chính mình mà không đau." },
    "INT@10": { text: "Bắt đầu hiểu cấu trúc thuật thức như đọc một bản vẽ." },
    "WIS@10": { text: "Cảm nhận chú lực: thấy dòng chú lực mờ quanh mọi sinh vật." },
    "LUK@10": { text: "Hệ thống ghi nhận: vận may bất thường." },
  };

  /* ---------- LỘ TRÌNH ARC ---------- */
  const ARCS = [
    { id: "arc0", name: "Mở đầu: Tủ đồ số 44", rank: "E", lv: "1–3", playable: true, npcs: ["gojo", "c_tu44"], sum: "Hệ thống thức tỉnh, Shen chọn hai đặc tính và lần đầu chạm vào chú lực." },
    { id: "arc1", name: "Thai nhi Chú vật", rank: "E → D", lv: "3–8", playable: true, npcs: ["itadori", "fushiguro", "kugisaki", "gojo", "ijichi", "ieiri", "yaga", "c_womb", "sukuna_a1"], sum: "Nhiệm vụ đầu tiên, Chú thai đặc cấp, phỏng vấn và thức tỉnh thuật thức, sát hạch Cấp 3." },
    { id: "arc2", name: "Đối đầu Mahito", rank: "D", lv: "8–14", npcs: ["nanami", "junpei", "itadori", "mahito", "jogo", "hanami", "kenjaku"], sum: "Vụ án thị trấn Satozakura và chú linh chạm vào linh hồn." },
    { id: "arc3", name: "Giao lưu Kyoto", rank: "D → C", lv: "14–20", npcs: ["maki", "inumaki", "panda", "todo", "kamo", "mai", "momo", "miwa", "mechamaru", "utahime", "gakuganji", "hanami"], sum: "Giải đấu hai trường và cuộc đột kích của chú linh." },
    { id: "arc4", name: "Cửu tướng Chú thai", rank: "C", lv: "20–25", npcs: ["itadori", "kugisaki", "fushiguro", "eso", "kechizu", "choso"], sum: "Anh em Chú thai và cây cầu Yasohachi." },
    { id: "arc5", name: "Ký ức Hoài Ngọc (nhánh phụ)", rank: "giữ nguyên", lv: "—", npcs: ["gojo", "geto_young", "riko", "toji", "ieiri"], sum: "Ký ức qua chú vật. Mở điều kiện Class ẩn." },
    { id: "arc6", name: "Sự biến Shibuya", rank: "C → B", lv: "25–40", npcs: ["gojo", "nanami", "meimei", "kusakabe", "naobito", "maki", "choso", "kenjaku", "uraume", "mahito", "jogo", "hanami", "dagon", "toji", "sukuna_a1"], sum: "Đêm Halloween. Sổ nhân quả ghi ai sống, ai chết." },
    { id: "arc7", name: "Chuẩn bị & Tử Diệt Hồi Du", rank: "B → A", lv: "40–60", npcs: ["yuta", "naoya", "maki2", "hakari", "kirara", "higuruma", "kashimo", "ishigori", "uro", "takaba", "hana", "reggie", "yorozu", "tengen", "tsukumo", "kenjaku"], sum: "Trò chơi sinh tử trong các kết giới khắp Nhật Bản." },
    { id: "arc8", name: "Quyết chiến Shinjuku", rank: "A → S", lv: "60–80", npcs: ["gojo", "yuta", "itadori8", "higuruma", "kashimo", "hakari", "maki2", "todo", "sukuna", "uraume", "mahoraga"], sum: "Trận cuối với Sukuna. Kết thúc nguyên tác." },
    { id: "arc9", name: "Thế giới không có Gojo (nguyên bản)", rank: "S", lv: "80–95", npcs: ["itadori8", "yuta", "maki2", "fushiguro", "kugisaki"], sum: "Giới chú thuật tái thiết, tàn dư phe Sukuna nổi dậy." },
    { id: "arc10", name: "Di vật Heian (nguyên bản)", rank: "S → SS", lv: "95–110", npcs: [], sum: "Chú vật thời Heian thức tỉnh. Hoàn thiện Bành trướng lãnh địa." },
    { id: "arc11", name: "Cội nguồn thuật thức (nguyên bản)", rank: "SS", lv: "110–125", npcs: [], sum: "Vì sao thuật thức của Shen không giống ai — và Hệ thống đến từ đâu." },
    { id: "arc12", name: "Đỉnh Thiên thượng (nguyên bản)", rank: "SS → SSS", lv: "125+", npcs: [], sum: "Vượt giới hạn mà chỉ Gojo và Sukuna từng chạm tới." },
  ];

  CD.DATA = { WORLD_RULES, TRAITS, RESTRICTIONS, SKILLS, TECHNIQUES, ITEMS, NPCS, INTERVIEW, QUESTS, ACHIEVEMENTS, MILESTONE_REWARDS, ARCS };
})(typeof window !== "undefined" ? window : globalThis);
