/* =====================================================================
   CURSED DESTINY — TIẾN HÓA THUẬT THỨC · PHẢN ỨNG NPC · ARC 7 → 12 · KẾT THÚC
   Nguyên tắc: KHÔNG NPC nào biết Shen có Hệ thống. Họ chỉ thấy những gì nhìn được:
   chú lực lạ, và việc Shen vừa mang Thiên dữ chú phược vừa dùng được thuật thức.
   Nạp sau arc456.js.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {}), D = CD.DATA, SC = CD.SCENES;
  const mk = (name, rank, lv, w, extra) => {
    const total = Math.round((30 + 5 * (lv - 1)) * ((extra && extra.f) || 1)), sum = w.reduce((a, b) => a + b, 0), keys = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"], stats = {};
    keys.forEach((k, i) => (stats[k] = Math.max(1, Math.round((total * w[i]) / sum))));
    const o = Object.assign({ name, rank, lv, stats }, extra || {}); delete o.f; return o;
  };
  const sk = (name, mult, src, cd) => ({ name, mult, src: src || "patk", cd: cd || 0 });

  /* ======================= TIẾN HÓA THUẬT THỨC (Class 4 bậc + nhánh ẩn) ======================= */
  CD.EVO = [
    null,
    { tier: 2, rank: "B", sp: 400, desc: "Chuyên môn hóa: chọn 1 trong 2 nhánh. Kỹ năng thuật thức ×1.25." },
    { tier: 3, rank: "S", sp: 1500, desc: "Tiến hóa cao cấp. Kỹ năng thuật thức ×1.5. Có thể rẽ sang nhánh ẩn nếu đủ điều kiện." },
    { tier: 4, rank: "SS", sp: 4000, desc: "Hình thái hoàn thiện. Kỹ năng thuật thức ×1.75." },
  ];
  // Điều kiện nhánh ẩn: luôn cần "hạt giống" từ Arc 5 + một điều kiện riêng của từng thuật thức
  const HID = {
    khacan: { text: "Đã tha mạng cho kẻ thù ở cầu Yasohachi", ok: (s) => s.flags.includes("brothers_captured") },
    phananh: { text: "Đã ký Thiên dữ chú phược", ok: (s) => !!s.restriction },
    trongap: { text: "Con đường Anti-hero ≥ 30", ok: (s) => s.anti >= 30 },
    lientuyen: { text: "Có một mối quan hệ Tri kỷ (≥ 90)", ok: (s) => Object.values(s.rel).some((v) => v >= 90) },
    thucchu: { text: "Đã hấp thụ ít nhất 15 loại chú linh", ok: (s) => s.txDone.filter((t) => t.startsWith("devour_")).length >= 15 },
    tichquang: { text: "Thiện–Ác ≥ 60", ok: (s) => s.moral >= 60 },
    amchan: { text: "Đã cứu được Choso hoặc Gojo", ok: (s) => ["alive", "retired"].includes(s.fates.choso) || ["alive", "retired"].includes(s.fates.gojo) },
    thoikhac: { text: "Đã hiểu rằng quá khứ không thể thay đổi", ok: (s) => s.flags.includes("knows_past_fixed") },
  };
  CD.techMult = (s) => 1 + 0.25 * ((s.techTier || 1) - 1) + (s.techHidden ? 0.2 : 0);
  CD.techName = function (s) {
    const t = D.TECHNIQUES[s.technique]; if (!t) return "";
    if (s.techHidden) return t.hidden;
    const label = t.tree[(s.techTier || 1) - 1] || ""; const parts = label.replace(/^B\d\s*/, "").split("|").map((x) => x.trim());
    return parts[s.techBranch != null && parts[s.techBranch] ? s.techBranch : 0];
  };
  CD.evoNext = function (s) {
    if (!s.technique) return null;
    const ev = CD.EVO[s.techTier || 1]; if (!ev) return null;
    const t = D.TECHNIQUES[s.technique], label = t.tree[ev.tier - 1].replace(/^B\d\s*/, "");
    const branches = label.split("|").map((x) => x.trim());
    const h = HID[s.technique], seed = s.flags.includes("hidden_seed");
    const hiddenOk = ev.tier >= 3 && !s.techHidden && seed && h && h.ok(s);
    return { ev, branches, hidden: ev.tier >= 3 && !s.techHidden ? { name: t.hidden, ok: hiddenOk, need: ["Hạt giống từ Ký ức Hoài Ngọc (Arc 5)" + (seed ? " ✓" : " ✗"), h.text + (h.ok(s) ? " ✓" : " ✗")] } : null,
      rankOk: CD.rankIndex(s.rank) >= CD.rankIndex(ev.rank), spOk: s.currency.sp >= ev.sp };
  };
  CD.evolve = function (s, pick) {
    const n = CD.evoNext(s); if (!n || !n.rankOk || !n.spOk) return { ok: false, msg: "Chưa đủ điều kiện tiến hóa." };
    if (pick === "hidden" && !(n.hidden && n.hidden.ok)) return { ok: false, msg: "Chưa đủ điều kiện nhánh ẩn." };
    const b = s.currency.sp; s.currency.sp -= n.ev.sp; s.techTier = n.ev.tier;
    if (pick === "hidden") s.techHidden = true; else if (n.branches.length > 1) s.techBranch = pick || 0;
    const msgs = ["Điểm Hệ thống " + b + " − " + n.ev.sp + " = " + s.currency.sp, "TIẾN HÓA THUẬT THỨC → Bậc " + n.ev.tier + ": " + CD.techName(s) + " (kỹ năng thuật thức ×" + CD.techMult(s).toFixed(2) + ")"];
    const gain = n.ev.tier === 2 ? D.TECH3[s.technique] : n.ev.tier === 3 ? "tx3_" + s.technique : "tx4_" + s.technique;
    if (gain && !s.skills.includes(gain)) { s.skills.push(gain); msgs.push("Học kỹ năng: " + D.SKILLS[gain].name); }
    CD.addLedger(s, { action: "Thuật thức tiến hóa lên Bậc " + n.ev.tier + ": " + CD.techName(s) });
    return { ok: true, msgs };
  };
  // Kỹ năng bậc 3 & 4 cho từng thuật thức
  Object.keys(D.TECHNIQUES).forEach((id) => {
    const t = D.TECHNIQUES[id];
    D.SKILLS["tx3_" + id] = { tech: true, rank: "S", name: t.name.replace(" Thuật", "") + " · Cực Ý", cost: { ce: 80 }, cd: 4, effect: { dmg: { src: "cpow", mult: 4.0 }, sure: true }, desc: "Tinh hoa của thuật thức ở bậc cao cấp: Uy lực ×4.0, không thể né. Tốn 80 Chú lực, hồi chiêu 4 lượt." };
    D.SKILLS["tx4_" + id] = { tech: true, rank: "SS", name: t.name.replace(" Thuật", "") + " · Chung Yên", cost: { ce: 160 }, cd: 6, effect: { dmg: { src: "cpow", mult: 6.5 }, sure: true, debuff: { stat: "atk", pct: 0.3, turns: 3, label: "giảm 30% tấn công" } }, desc: "Hình thái cuối cùng: Uy lực ×6.5, không thể né, giảm 30% tấn công mục tiêu 3 lượt. Tốn 160 Chú lực, hồi chiêu 6 lượt." };
  });

  /* ======================= PHẢN ỨNG KHI NPC THẤY SHEN CÓ CẢ HAI ======================= */

  const react = (id, lines, who) => {
    if (!SC[id]) return;
    SC[id].ifRestriction = lines;
    SC[id].conds = (SC[id].conds || []).concat([{ req: { restriction: true }, eff: { known: "lo_ca_hai_" + who, ledger: { action: who + " phát hiện Shen vừa mang Thiên dữ chú phược vừa dùng thuật thức", consequence: "Không ai giải thích được. Không ai biết về Hệ thống" } } }]);
  };
  react("a1_trial_brief", [
    "Gojo đứng ở góc võ đường. Anh ta tháo băng mắt, nhìn Shen rất lâu.",
    "> Khoan đã. Trên người nhóc có dấu ấn của Thiên dữ chú phược. Thứ trời ban lúc sinh ra, đổi lại thường phải mất chú lực hoặc mất thuật thức.",
    "> Vậy mà thuật thức của nhóc vẫn nguyên vẹn. Không. Chuyện này không thể xảy ra.",
    "Shen im lặng. Gojo không hỏi thêm, nhưng cũng không đeo băng mắt lại suốt buổi sát hạch.",
    "> Đừng kể cho ai nghe. Thượng tầng mà biết, họ sẽ mổ xẻ nhóc như mổ ếch.",
  ], "Gojo Satoru");
  react("a3_start", [
    "Maki đang giới thiệu dở thì đột ngột dừng lại, nheo mắt nhìn Shen.",
    "> Cậu... có Thiên dữ chú phược. Tôi nhận ra được. Tôi cũng là một kẻ bị trời trói.",
    "> Nhưng cậu vẫn dùng được thuật thức? Cái quái gì vậy?",
    "Panda và Inumaki quay sang nhìn. Shen chỉ nhún vai. Maki nhìn cậu với ánh mắt nửa ghen tị, nửa tò mò.",
  ], "Zenin Maki");
  react("a3_miwa", ["Miwa lùi lại nửa bước sau đòn thử đầu tiên.", "> Khoan đã, cơ thể cậu cứng như của người không có chú lực, nhưng chú lực lại đang chảy... Cậu là cái gì vậy?!"], "Miwa Kasumi");
  react("a4_start", ["Itadori bỗng chọc tay vào vai Shen.", "> Mà này, chị Maki bảo cậu vừa có Thiên dữ vừa có thuật thức. Thế là gian lận đấy biết không!", "Cậu ta cười, nhưng ánh mắt thì nghiêm túc hơn thường lệ."], "Itadori Yuji");
  react("a6_n_mahito", ["Trước khi vươn tay, Mahito liếc qua Shen.", "> Linh hồn bị trời trói chặt, vậy mà vẫn mọc ra thuật thức. Ngươi là một món đồ chơi thú vị nhất ta từng thấy."], "Mahito");

  /* ======================= KẺ ĐỊCH & NHÂN VẬT MỚI ======================= */
  Object.assign(D.NPCS, {
    u_chain: mk("Người chơi Hồi Du: Gã cầm xích", "B", 40, [24, 22, 22, 14, 14, 4], { f: 1.3, hpMult: 1.2, skills: [sk("Xích quấn cổ", 1.8, "patk", 2), sk("Quất xích", 1.4)], desc: "Một người thường được Kenjaku gieo mầm, giết người để lấy điểm." }),
    reggie_b: mk("Reggie Star", "B", 44, [14, 16, 18, 24, 22, 6], { f: 1.25, hpMult: 1.4, expMul: 0.6, skills: [sk("Tái hiện hóa đơn: xe tải", 2.0, "cpow", 3), sk("Tái hiện: dao", 1.5, "cpow", 1), sk("Đấm", 1.2)], desc: "Người chơi Hồi Du, tái hiện mọi thứ từ hóa đơn đã mua." }),
    c_sendai: mk("Chú linh vùng Sendai", "A", 48, [24, 22, 26, 18, 18, 4], { f: 1.3, hpMult: 1.3, expMul: 0.6, skills: [sk("Lở đất", 1.9, "patk", 3), sk("Sương độc", 1.6, "cpow", 2), sk("Quật", 1.3)], desc: "Chú linh cấp 1 được thả ra từ kho của Kenjaku." }),
    u_edo: mk("Chú thuật sư thời Edo tái sinh", "A", 50, [20, 24, 20, 22, 20, 6], { f: 1.3, hpMult: 1.3, expMul: 0.6, skills: [sk("Kiếm thuật Edo", 2.0, "patk", 2), sk("Chú phù", 1.6, "cpow", 2), sk("Chém", 1.3)], desc: "Một chú thuật sư từ thế kỷ 17 tái sinh trong thân xác người thời nay." }),
    u_heian: mk("Kurogane, chú thuật sư Heian tái sinh", "A", 53, [22, 22, 22, 24, 24, 6], { f: 1.35, hpMult: 1.8, expMul: 1.2, skills: [sk("Thiết Tỏa Thuật", 2.1, "cpow", 3), sk("Giáp sắt", 1.6, "patk", 2), sk("Đập", 1.3)], desc: "Người chơi Hồi Du mạnh nhất kết giới Sakurajima. Sát hạch Rank A." }),
    kenjaku_lim: mk("Kenjaku", "S", 66, [14, 16, 16, 30, 30, 4], { f: 1.3, hpMult: 3, exp: 0, skills: [sk("Trọng lực", 2.0, "cpow", 2), sk("Chú linh thao thuật", 1.7, "cpow", 1), sk("Đánh", 1.3)], desc: "Kẻ đứng sau tất cả. Không thể đánh bại ở đây, chỉ có thể cầm chân." }),
    mahoraga_lim: mk("Ma Hư La (đang thích nghi)", "SS", 82, [28, 18, 30, 10, 14, 4], { f: 1.3, hpMult: 3, exp: 0, skills: [sk("Kiếm Diệt Ác", 2.2, "patk", 2), sk("Bánh xe thích nghi", 1.6, "patk", 1), sk("Đấm", 1.3)], desc: "Mỗi lần bánh xe trên đầu nó quay, nó lại thích nghi với một thứ." }),
    uraume_b: mk("Uraume", "S", 74, [12, 18, 16, 26, 26, 4], { f: 1.3, hpMult: 1.9, expMul: 1.5, skills: [sk("Băng Sương Thuật", 2.1, "cpow", 2), sk("Mũi băng", 1.6, "cpow", 1), sk("Đánh", 1.2)], desc: "Tùy tùng trung thành của Sukuna, điều khiển băng giá." }),
    u_hl1: mk("Hắc Liên: Kẻ tụng kinh", "S", 82, [16, 18, 20, 26, 26, 6], { f: 1.3, hpMult: 1.3, expMul: 0.5, skills: [sk("Kinh chú đảo ngược", 2.0, "cpow", 2), sk("Ấn hắc liên", 1.6, "cpow", 1), sk("Đánh", 1.3)], desc: "Thành viên Hội Hắc Liên, giáo phái thờ phụng Vua Nguyền." }),
    u_hl2: mk("Hắc Liên: Song đao", "S", 86, [26, 28, 20, 14, 14, 6], { f: 1.3, hpMult: 1.3, expMul: 0.5, skills: [sk("Song đao liên trảm", 2.1, "patk", 2), sk("Đâm xuyên", 1.6, "patk", 1), sk("Chém", 1.3)], desc: "Sát thủ của Hội Hắc Liên." }),
    c_s1: mk("Chú linh đặc cấp: Mẫu Thai", "S", 84, [24, 18, 30, 20, 20, 4], { f: 1.3, hpMult: 1.4, expMul: 0.6, skills: [sk("Sinh nở chú linh", 1.9, "cpow", 3), sk("Nuốt", 1.6, "patk", 1), sk("Quật", 1.3)], desc: "Chú linh đặc cấp sinh ra từ nỗi sợ hãi sau Shibuya." }),
    rensei: mk("Kagami Rensei, giáo chủ Hắc Liên", "S", 92, [18, 20, 22, 30, 30, 6], { f: 1.35, hpMult: 2, expMul: 1.5, skills: [sk("Kính Liên Thuật", 2.2, "cpow", 2), sk("Ảnh phản chiếu", 1.8, "cpow", 1), sk("Đánh", 1.3)], desc: "Giáo chủ Hội Hắc Liên. Nói rằng có một giọng nói đã dẫn đường cho hắn trong giấc mơ." }),
    enka: mk("Enka, Hỏa Chú Sư Heian", "S", 98, [20, 18, 20, 30, 28, 4], { f: 1.35, hpMult: 1.8, expMul: 1.2, skills: [sk("Thiêu Thiên", 2.3, "cpow", 3), sk("Hỏa long", 1.8, "cpow", 1), sk("Đánh", 1.3)], desc: "Một trong Tứ Đại Pháp Sư Heian. Lửa của hắn đốt cả chú lực." }),
    mizuchi: mk("Mizuchi, Thủy Chú Sư Heian", "S", 101, [18, 22, 22, 28, 28, 4], { f: 1.35, hpMult: 1.8, expMul: 1.2, skills: [sk("Hồng thủy", 2.2, "cpow", 3), sk("Rồng nước", 1.8, "cpow", 1), sk("Đánh", 1.3)], desc: "Một trong Tứ Đại Pháp Sư Heian. Nước của hắn chảy ngược lên trời." }),
    kazahaya: mk("Kazahaya, Phong Chú Sư Heian", "S", 103, [24, 32, 18, 22, 20, 6], { f: 1.35, hpMult: 1.8, expMul: 1.2, skills: [sk("Vạn phong trảm", 2.3, "patk", 2), sk("Lốc xoáy", 1.8, "patk", 1), sk("Chém", 1.3)], desc: "Một trong Tứ Đại Pháp Sư Heian. Nhanh hơn cả âm thanh." }),
    iwakura: mk("Iwakura, Thổ Chú Sư Heian", "SS", 107, [30, 14, 34, 22, 22, 4], { f: 1.4, hpMult: 2.4, expMul: 2, skills: [sk("Sơn băng", 2.5, "patk", 3), sk("Giáp núi", 1.8, "patk", 1), sk("Nện", 1.4)], desc: "Mạnh nhất trong Tứ Đại Pháp Sư Heian. Sát hạch Rank SS." }),
    observer_shadow: mk("Bóng của Kẻ Quan Sát", "SS", 118, [22, 22, 22, 30, 30, 8], { f: 1.4, hpMult: 2.2, expMul: 2, skills: [sk("Trang sách đã viết", 2.4, "cpow", 2), sk("Dòng chảy ban đầu", 2.0, "cpow", 1), sk("Đánh", 1.4)], desc: "Một mảnh của thứ đã gửi Hệ thống tới Shen." }),
    observer: mk("Kẻ Quan Sát", "SSS", 130, [24, 24, 26, 34, 34, 10], { f: 1.4, hpMult: 3, expMul: 3, skills: [sk("Thiên Mệnh Thư: Xóa dòng", 2.8, "cpow", 3), sk("Lãnh địa: Thư viện số phận", 2.3, "cpow", 2), sk("Đánh", 1.5)], desc: "Một Shen khác, từ dòng chảy ban đầu, nơi mọi người đều đã chết." }),
  });
  /* Cân bằng: kẻ địch Arc 7–12 đặt ở Level tương ứng nhịp lên cấp của Shen (Level ≠ Rank) */
  const LV = { u_chain: 50, reggie_b: 54, c_sendai: 60, u_edo: 62, u_heian: 66, kenjaku_lim: 82, mahoraga_lim: 98, uraume_b: 90, u_hl1: 96, u_hl2: 100, c_s1: 98, rensei: 106, enka: 112, mizuchi: 116, kazahaya: 120, iwakura: 124, observer_shadow: 134, observer: 146 };
  for (const id in LV) {
    const n = D.NPCS[id], oldT = Object.values(n.stats).reduce((a, b) => a + b, 0), newT = Math.round((30 + 5 * (LV[id] - 1)) * 1.3);
    for (const k in n.stats) n.stats[k] = Math.max(1, Math.round((n.stats[k] * newT) / oldT));
    n.lv = LV[id];
  }
  /* Từ Arc 4, Shen có thêm đặc tính nhân hệ số, khế ước, trang bị, tinh hoa, kỹ năng cấp cao...
     nên kẻ địch cần một hệ số tăng cường riêng để trận đánh vẫn có sức nặng. */
  const BOOST = [
    [["c_a4_a", "c_a4_b", "c_bridge", "kechizu", "eso", "u_sim", "c_a6_a", "c_a6_b", "c_kaihen_s", "c_train", "u_fox"], 1.8],
    [["u_chain", "reggie_b", "c_sendai", "u_edo", "u_heian", "uraume_b"], 1.6],
    [["u_hl1", "u_hl2", "c_s1", "rensei", "enka", "mizuchi", "kazahaya", "iwakura", "observer_shadow", "observer"], 2.1],
  ];
  BOOST.forEach(([ids, f]) => ids.forEach((id) => { const n = D.NPCS[id]; for (const k in n.stats) n.stats[k] = Math.round(n.stats[k] * f); }));
  Object.assign(D.NPCS, {
    yuta2: D.NPCS.yuta, tsukumo2: D.NPCS.tsukumo,
  });

  D.FATE_CANON = Object.assign(D.FATE_CANON, { kugisaki: "alive", tsukumo: "dead", mai: "dead", gojo: "dead", choso: "dead", kashimo: "dead", fushiguro: "alive", sukuna: "dead", kenjaku: "dead" });
  D.FATE_WATCH = D.FATE_WATCH.concat(["mai", "tsukumo", "fushiguro", "kashimo", "choso", "sukuna", "kenjaku"]);

  /* ---------- Quan hệ mới ---------- */
  Object.assign(D.SOCIAL, {
    yuta: { likes: ["banh_ngot", "sach_cu"], likeText: "Yuta cười hiền: \"Cảm ơn nhé. Rika cũng thích món này.\"", idle: "Yuta kể về chuyến đi châu Phi. Anh ấy nói rất nhỏ, như sợ làm phiền ai.",
      train: { stats: ["WIS", "INT"], minRel: 10, text: "Yuta dạy Shen cách kiểm soát lượng chú lực khổng lồ mà không để nó tràn ra ngoài." },
      talk: [{ text: ["> Thầy Gojo nói anh là người mạnh thứ hai. Anh không thấy vậy. Anh chỉ có rất nhiều thứ muốn bảo vệ."] }, { minRel: 25, text: ["Yuta kể về Rika, người bạn thuở nhỏ từng biến thành chú linh vì yêu anh.", "> Đôi khi, tình yêu cũng là một lời nguyền."], eff: { moral: 2 } }],
      bonds: [{ rel: 40, text: "Yuta tin tưởng Shen như đồng đội lâu năm.", eff: { base: { WIS: 3, INT: 2 } } }] },
    hakari: { likes: ["anh_idol"], likeText: "Hakari nhìn tấm ảnh: \"Không phải gu của tôi. Nhưng tấm lòng thì tôi nhận.\"", idle: "Hakari nói về cảm giác hồi hộp lúc cược tất cả. Mắt anh ta sáng rực.",
      train: { stats: ["VIT", "LUK"], minRel: 10, text: "Hakari bắt Shen đỡ đòn suốt hai tiếng: \"Muốn thắng lớn thì phải chịu đòn được đã.\"" },
      talk: [{ text: ["> Đời là một ván cược. Ai sợ thua thì đừng ngồi vào bàn."], eff: { anti: 2 } }],
      bonds: [{ rel: 40, text: "Hakari chia cho Shen bí quyết giữ bình tĩnh khi thua.", eff: { base: { VIT: 3, LUK: 3 } } }] },
    choso: { likes: ["keo_deo"], likeText: "Choso nhìn túi kẹo rất lâu: \"Ngày xưa ta không có ai để mua kẹo cho.\"", idle: "Choso hỏi Shen về Itadori: cậu ấy thích ăn gì, ngủ có đủ không.",
      train: { stats: ["VIT", "WIS"], minRel: 15, text: "Choso dạy Shen cách điều khiển dòng chảy trong cơ thể, như điều khiển máu." },
      talk: [{ text: ["> Ta là anh trai. Anh trai thì phải đi trước các em. Đó là tất cả lý do ta tồn tại."] }],
      bonds: [{ rel: 40, text: "Choso gọi Shen là \"người nhà\".", eff: { base: { VIT: 3, WIS: 2 } } }] },
  });

  /* ---------- Khu tự do mới ---------- */
  const H = (name, days, cap, intro, locations) => ({ name, days, trainCap: cap, start: Object.keys(locations)[0], intro, locations });
  Object.assign(D.HUBS, {
    a7_hub: H("Tử Diệt Hồi Du", 5, 7, "Mười kết giới phủ khắp Nhật Bản. Người chơi phải giết nhau để lấy điểm. Shen vào kết giới với một mục tiêu: tìm cách chấm dứt trò chơi.", {
      camp: { name: "Trại ngoài kết giới", env: "forest", npcs: [["itadori", "fushiguro", "yuta"], ["maki", "panda", "hakari", "choso"], ["itadori", "choso", "junpei"]], idle: "Lửa trại nhỏ. Không ai ngủ ngon.", events: [] },
      tokyo1: { name: "Kết giới Tokyo số 1", env: "city", npcs: [], idle: "Những tòa nhà bỏ trống, tiếng la hét vọng từ xa.", events: [
        { id: "a7_chain", title: "Gã cầm xích", text: ["Một người đàn ông kéo lê sợi xích dính máu. Trên vai hắn là bảng điểm: 45 điểm. Nghĩa là chín người."], combat: ["u_chain"], eff: { rep: { danthuong: 4 } } }] },
      tokyo2: { name: "Kết giới Tokyo số 2", env: "station", npcs: [[], ["fushiguro"], []], idle: "Sân ga bỏ hoang, đầy hóa đơn rơi vãi.", events: [
        { id: "a7_reggie", title: "Reggie Star", text: ["Một gã đeo kính râm rải hóa đơn khắp sân ga. Mỗi tờ giấy bung ra thành một món đồ: xe tải, dao, cửa sắt.", "Fushiguro đứng cạnh Shen, thở dốc: \"Cậu giữ hắn. Tôi tìm sơ hở.\""], combat: ["reggie_b"], eff: { rel: { fushiguro: 8 }, rep: { tokyo: 4 } } }] },
      sendai: { name: "Kết giới Sendai", env: "forest", npcs: [], idle: "Rừng bị san phẳng một nửa.", events: [
        { id: "a7_sendai", req: { level: 42 }, title: "Chú linh vùng Sendai", text: ["Một ngọn đồi đứng dậy. Không, đó là một chú linh."], combat: ["c_sendai"], eff: { yen: 300000 } }] },
      sakura: { name: "Kết giới Sakurajima", env: "river", npcs: [], idle: "Tro núi lửa phủ trắng mặt đất.", events: [
        { id: "a7_edo", req: { level: 45 }, title: "Chú thuật sư thời Edo", text: ["Một gã mặc áo kimono rách, cầm kiếm, chặn đường Shen. \"Ba trăm năm rồi ta chưa được đánh một trận ra trò.\""], combat: ["u_edo"], eff: { yen: 350000 } }] },
    }),
    a8_hub: H("Đêm trước Shinjuku", 3, 5, "Ngày 24 tháng 12, Gojo Satoru được giải phong ấn. Ba ngày nữa, anh ta sẽ đối đầu Sukuna ở Shinjuku.", {
      san: { name: "Sân học viện", env: "temple", npcs: [["gojo", "itadori"], ["maki", "yuta", "hakari"], ["gojo", "choso", "junpei"]], idle: "Tuyết rơi lất phất.", events: [] },
      vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["ieiri"], ["ieiri", "kugisaki"], ["ieiri"]], idle: "Ieiri đang chuẩn bị đủ thuốc cho một cuộc chiến.", events: [] },
      voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["gojo"], []], idle: "Gojo vẽ một vòng tròn trên sàn: \"Ai bước ra là thua.\"", events: [] },
    }),
    a9_hub: H("Mùa xuân 2019", 5, 7, "Thế giới sau Vua Nguyền. Học viện được xây lại. Nhưng những mảnh vụn của Sukuna, và những kẻ thờ phụng hắn, vẫn còn đó.", {
      san: { name: "Học viện mới", env: "temple", npcs: [["itadori", "fushiguro", "kugisaki"], ["maki", "yuta", "panda"], ["gojo", "nanami", "junpei", "choso"]], idle: "Hoa anh đào nở sớm.", events: [] },
      nhiemvu1: { name: "Nhiệm vụ: Đền Hắc Liên", env: "temple", npcs: [], idle: "Một ngôi đền bỏ hoang, bàn thờ phủ vải đen.", events: [
        { id: "a9_hl1", slot: [2], title: "Kẻ tụng kinh", text: ["Tiếng tụng kinh đảo ngược vang lên giữa đêm."], combat: ["u_hl1"], eff: { yen: 800000 } }] },
      nhiemvu2: { name: "Nhiệm vụ: Cảng Yokohama", env: "river", npcs: [], idle: "Gió biển mặn chát.", events: [
        { id: "a9_hl2", title: "Song đao", text: ["Hai lưỡi đao lóe sáng giữa những container."], combat: ["u_hl2"], eff: { yen: 900000 } }] },
      nhiemvu3: { name: "Nhiệm vụ: Bệnh viện sản Shibuya", env: "hospital", npcs: [], idle: "Khu nhà đã đóng cửa từ sau Sự biến.", events: [
        { id: "a9_s1", title: "Mẫu Thai", text: ["Tiếng trẻ con khóc khắp các hành lang, cùng lúc, từ mọi phía."], combat: ["c_s1"], eff: { yen: 1000000 } }] },
    }),
    a10_hub: H("Trước cơn bão Heian", 4, 6, "Bốn chú vật cổ thời Heian đã thức giấc. Cả giới chú thuật chuẩn bị cho một cuộc chiến mà không ai từng trải qua.", {
      san: { name: "Học viện", env: "temple", npcs: [["itadori", "yuta", "maki"], ["gojo", "nanami", "kugisaki"], ["fushiguro", "choso", "junpei"]], idle: "Ai cũng tập luyện tới khuya.", events: [] },
      voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yuta", "maki"], []], idle: "Sàn gỗ nứt vì đòn của Maki.", events: [] },
    }),
    a11_hub: H("Những giấc mơ", 4, 6, "Hệ thống bắt đầu chập chờn. Những dòng chữ lạ xuất hiện ngày càng nhiều. Shen không thể kể với ai.", {
      san: { name: "Học viện", env: "temple", npcs: [["itadori", "fushiguro"], ["kugisaki", "yuta", "maki"], ["gojo", "nanami", "choso", "junpei"]], idle: "Mọi người vẫn sống. Vì Shen. Hoặc vì thứ đang ở trong đầu Shen.", events: [] },
      thuvien: { name: "Thư viện phong ấn", env: "dojo", npcs: [], idle: "Mùi giấy cũ và mực Tàu.", events: [
        { id: "a11_notes", text: ["Trong đống ghi chép của Kenjaku được thu hồi sau Shinjuku, Shen tìm thấy một trang viết tay:", "\"Dòng chảy ban đầu. Ai đó đang viết lại nó. Không phải ta.\"", "Nét chữ dừng lại ở đó."], eff: { expLv: 0.5, known: "kenjaku_ghi_chep" } }] },
    }),
  });

  Object.assign(D.QUESTS, {
    q_culling: { name: "Tử Diệt Hồi Du", desc: "Sống sót và tìm cách chấm dứt trò chơi sinh tử." },
    q_shinjuku: { name: "Quyết chiến Shinjuku", desc: "Đối đầu Ryomen Sukuna." },
    q_hacklien: { name: "Hội Hắc Liên", desc: "Truy quét giáo phái thờ phụng Vua Nguyền." },
    q_heian: { name: "Tứ Đại Pháp Sư Heian", desc: "Ngăn bốn chú thuật sư cổ đại tái lập thời đại của chúng." },
    q_origin: { name: "Cội nguồn", desc: "Tìm ra ai đã gửi Hệ thống." },
    q_final: { name: "Đỉnh Thiên thượng", desc: "Đối mặt Kẻ Quan Sát." },
  });
  Object.assign(D.ACHIEVEMENTS, {
    a_fate_tsukumo: "Ngôi sao không tắt", a_fate_gojo: "Kẻ mạnh nhất không còn một mình", a_fate_choso: "Người anh cả được sống",
    a_end_light: "Kết thúc: Trang sách trắng", a_end_anti: "Kết thúc: Người giữ sách", a_end_mid: "Kết thúc: Lời nguyền được niêm phong",
  });
  D.ARCS.forEach((a) => (a.playable = true));

  /* ======================= CỐT TRUYỆN ======================= */
  SC.a6_end.text[SC.a6_end.text.length - 1] = "[Arc 7 — Tử Diệt Hồi Du: đã mở khóa.]";
  SC.a6_end.choices = [{ t: "Bắt đầu Arc 7: Tử Diệt Hồi Du", go: "a7_start" }];

  Object.assign(SC, {
    /* ---------- ARC 7: TỬ DIỆT HỒI DU ---------- */
    a7_start: { chapter: "Arc 7 · Tử Diệt Hồi Du", title: "Kẻ hành quyết", env: "rain/temple", cast: ["shen", "yuta"],
      onEnter: { arc: "arc7", time: { days: 10, label: "Tháng 11, 2018" }, heal: "full", quest: { id: "q_culling", status: "active" } },
      text: [
        "Itadori đã rời học viện cùng Choso. Thượng tầng cử một người đi xử tử cậu ta: Okkotsu Yuta, chú thuật sư đặc cấp vừa trở về từ nước ngoài.",
        "Yuta tìm tới Shen trước. Anh ta trông hiền lành, lễ phép, và mang theo một thanh kiếm Nhật bọc vải.",
        "> Đừng lo. Anh sẽ không giết Itadori. Thầy Gojo đã nhờ anh trước khi bị phong ấn: nếu có chuyện gì, hãy bảo vệ học trò của thầy.",
        "Anh ta mỉm cười, nhưng mắt không cười.",
      ],
      ifRestriction: ["Yuta khẽ nghiêng đầu khi nhìn Shen.", "> Rika bảo em có mùi giống Maki, nhưng lại giống cả anh nữa. Vừa bị trời lấy đi, vừa được trời cho. Chuyện đó... có thể sao?", "Shen chỉ cười trừ. Yuta không hỏi thêm, nhưng anh ta ghi nhớ."],
      observe: ["yuta"],
      choices: [{ t: "Tin Okkotsu", go: "a7_zenin", eff: { rel: { yuta: 6 } } }, { t: "Giữ khoảng cách, nhưng đi cùng", go: "a7_zenin", eff: { rel: { yuta: 2 }, trace: { quansat: 1 } } }] },
    a7_zenin: { chapter: "Arc 7", title: "Nhà Zenin", env: "night/temple", cast: ["shen", "maki"],
      onEnter: { fate: { mai: "dead" }, ledger: { action: "Gia tộc Zenin bị Maki xóa sổ sau cái chết của Zenin Mai", witnesses: "Không ai sống sót", consequence: "Maki thức tỉnh Thiên dữ chú phược hoàn toàn" } },
      text: [
        "Một tuần sau, Maki trở về học viện. Một mình. Người đầy máu, không phải máu của cô.",
        "Gia tộc Zenin đã không còn nữa. Em gái song sinh của cô, Mai, đã chết để Maki trở thành một người không còn chút chú lực nào, và vì thế không còn giới hạn nào.",
        "Maki đặt thanh kiếm Mai để lại lên bàn, giọng bình thản đến đáng sợ.",
        "> Đi thôi. Còn nhiều việc phải làm.",
      ],
      choices: [{ t: "Đặt tay lên vai Maki", go: "a7_tengen", eff: { rel: { maki: 6 }, moral: 1 } }, { t: "Không nói gì, đi theo", go: "a7_tengen", eff: { rel: { maki: 3 } } }] },
    a7_tengen: { chapter: "Arc 7", title: "Tengen", env: "indoor/dojo", cast: ["shen", "tengen", "tsukumo"],
      text: [
        "Sâu dưới lòng học viện, Tengen, kẻ bất tử đã duy trì kết giới khắp Nhật Bản suốt một nghìn năm, giải thích luật chơi của Tử Diệt Hồi Du.",
        "Mười kết giới. Người chơi giết nhau để lấy điểm. Ai có đủ điểm được thêm luật mới. Ai không tham gia trong mười chín ngày sẽ bị tước thuật thức, đồng nghĩa với cái chết.",
        "Bên cạnh Tengen là Tsukumo Yuki, chú thuật sư đặc cấp, người phụ nữ tóc vàng luôn cười như đang đi dã ngoại.",
        "> Nhóc kia, Yuki chỉ vào Shen. Kiểu phụ nữ cậu thích là gì?",
        "Tengen nhìn Shen rất lâu, rồi chỉ nói một câu: \"Chú lực của cậu có hình dạng của một trang sách.\"",
      ],
      ifRestriction: ["Yuki ngừng cười. Cô bước tới, ấn ngón tay vào ngực Shen.", "> Thiên dữ chú phược và thuật thức cùng tồn tại trong một cơ thể... Tôi nghiên cứu về chú lực ba mươi năm, chưa từng thấy. Sau vụ này, cho tôi mượn cậu làm đề tài nhé?"],
      choices: [{ t: "\"Người dám đứng lên khi không ai đứng.\"", go: "a7_hub", eff: { rel: { tsukumo: 6 } } }, { t: "\"Bây giờ không phải lúc đâu.\"", go: "a7_hub", eff: { rel: { tsukumo: 2 } } }] },
    a7_hub: { chapter: "Arc 7 · Thời gian tự do", title: "Mười kết giới", env: "day/forest", cast: ["shen"],
      text: ["Shen có năm ngày trước khi Kenjaku có động tĩnh mới."], hub: "a7_hub", go: "a7_kenjaku" },
    a7_kenjaku: { chapter: "Arc 7", title: "Hố đen", env: "night/temple", cast: ["shen", "tsukumo", "choso", "kenjaku"],
      onEnter: { heal: "full", expLv: 1 },
      text: [
        "Kenjaku tấn công thẳng vào nơi ở của Tengen. Tsukumo Yuki và Choso chặn hắn lại.",
        "Yuki biến khối lượng của chính mình thành vũ khí. Cô đang thắng, nhưng Shen thấy rõ: để thắng hoàn toàn, cô sẽ phải biến chính cơ thể mình thành một hố đen.",
        "[Hệ thống: Nút thắt của chuỗi nhân quả. Ký chủ có thể cầm chân Kenjaku để Tsukumo không phải hy sinh.]",
      ],
      ifRestriction: ["Kenjaku liếc Shen giữa trận đánh.", "> Thiên dữ và thuật thức. Một nghìn năm, ta đã thử tạo ra thứ đó bằng đủ mọi cách và đều thất bại. Ngươi là ai?"],
      observe: ["kenjaku"],
      choices: [
        { t: "Triển khai lãnh địa, cầm chân Kenjaku", go: "a7_kj_fight", req: { domain: 1, level: 44 }, eff: { trace: { baove: 2 } } },
        { t: "Lao vào yểm trợ", go: "a7_tsukumo_dead" },
      ] },
    a7_kj_fight: { chapter: "Arc 7", title: "Cầm chân Kenjaku", env: "night/temple",
      text: ["Mục tiêu: trụ vững 4 lượt. Không thể thắng. Chỉ cần đủ lâu."],
      combat: { enemies: ["kenjaku_lim"], win: "a7_tsukumo_saved", lose: "a7_tsukumo_dead", canFlee: false, surviveTurns: 4 } },
    a7_tsukumo_saved: { chapter: "Arc 7", title: "Ngôi sao không tắt", env: "night/temple", cast: ["shen", "tsukumo", "choso"],
      onEnter: { fate: { tsukumo: "alive" }, achievement: "a_fate_tsukumo", expLv: 1.5, rel: { tsukumo: 15, choso: 10 },
        ledger: { action: "Shen cầm chân Kenjaku, Tsukumo Yuki không phải tự hủy", witnesses: "Choso, Tengen", consequence: "Tsukumo sống sót. Kenjaku vẫn hấp thụ được Tengen rồi rút lui" } },
      text: ["Bốn lượt. Đủ để Choso và Yuki dồn Kenjaku vào thế phải rút lui. Hắn vẫn kịp hấp thụ Tengen, nhưng không kịp kết liễu ai.", "Yuki ngồi phịch xuống, thở hổn hển, rồi bật cười:", "> Tôi tưởng hôm nay mình sẽ thành một ngôi sao rồi chứ. Cảm ơn nhé, nhóc."],
      choices: [{ t: "Tiếp tục", go: "a7_megumi" }] },
    a7_tsukumo_dead: { chapter: "Arc 7", title: "Hố đen", env: "night/temple", cast: ["shen", "choso"],
      onEnter: { fate: { tsukumo: "dead" }, expLv: 1, ledger: { action: "Tsukumo Yuki tự biến mình thành hố đen để đánh Kenjaku", consequence: "Kenjaku sống sót, hấp thụ Tengen" } },
      text: ["Shen không đủ nhanh, hoặc không đủ mạnh.", "Tsukumo Yuki mỉm cười lần cuối, rồi biến mất vào trung tâm của một vì sao sụp đổ. Kenjaku vẫn sống. Tengen bị hấp thụ.", "[Hệ thống: Kết quả trùng với dòng chảy ban đầu.]"],
      choices: [{ t: "Tiếp tục", go: "a7_megumi" }] },
    a7_megumi: { chapter: "Arc 7", title: "Thân xác mới", env: "night/city", cast: ["shen", "fushiguro", "sukuna_a1"],
      onEnter: { fate: { fushiguro: "possessed" }, ledger: { action: "Sukuna chiếm thân xác Fushiguro Megumi", witnesses: "Itadori, Shen", consequence: "Sukuna có lại sức mạnh trọn vẹn" } },
      text: [
        "Trong lúc Itadori đang chiến đấu, Sukuna dùng một giao ước cũ để chuyển sang thân xác Fushiguro Megumi.",
        "Shen chỉ kịp thấy Fushiguro quay lại nhìn mình, đôi mắt đã không còn là của cậu ta.",
        "> Ngươi đây rồi. Cái mùi lạ đó. Đợi ta nhé.",
      ],
      choices: [{ t: "Tiếp tục", go: "a7_trial" }] },
    a7_trial: { chapter: "Arc 7", title: "Sát hạch Rank A", env: "day/river", cast: ["shen", "u_heian"],
      onEnter: { heal: "full", expLv: 1 },
      text: ["Kết giới Sakurajima. Người chơi mạnh nhất ở đây là một chú thuật sư thời Heian tái sinh, kẻ đã giết hơn ba mươi người chơi khác.", "Học viện đồng ý: hạ được hắn, Shen sẽ được công nhận Cấp 1."],
      observe: ["u_heian"],
      choices: [{ t: "Chiến đấu", go: "a7_trial_fight" }] },
    a7_trial_fight: { chapter: "Arc 7", title: "Kurogane", env: "day/river", text: ["Hắn khoác lên người một bộ giáp sắt mọc ra từ chính da thịt."],
      combat: { enemies: ["u_heian"], win: "a7_trial_win", lose: "a7_trial_lose", canFlee: false } },
    a7_trial_lose: { chapter: "Arc 7", title: "Lui một bước", env: "day/river", cast: ["shen", "maki"], onEveryEnter: { heal: "full" },
      text: ["Maki kéo Shen ra khỏi đống đổ nát. \"Nghỉ một chút. Rồi vào lại.\""], choices: [{ t: "Thử lại", go: "a7_trial_fight" }] },
    a7_trial_win: { chapter: "Arc 7", title: "Cấp 1", env: "day/river", cast: ["shen"],
      onEnter: { flag: "trial_A", expLv: 1, sp: 400 },
      text: ["Bộ giáp sắt vỡ vụn. [Hệ thống: Hoàn thành sát hạch Rank A.]"], special: "rankup", go: "a7_end" },
    a7_end: { chapter: "Hết Arc 7", title: "Ngày 24 tháng 12", env: "night/temple", cast: ["shen", "itadori", "yuta"],
      onEnter: { quest: { id: "q_culling", status: "done" } },
      text: ["Tử Diệt Hồi Du chưa kết thúc, nhưng một tin mới làm cả học viện sôi lên: ngục phong ấn Gojo Satoru sẽ được mở vào đêm Giáng sinh.", "Và Sukuna, trong thân xác Fushiguro, đã hẹn gặp anh ta ở Shinjuku."],
      choices: [{ t: "Bắt đầu Arc 8: Quyết chiến Shinjuku", go: "a8_start" }] },

    /* ---------- ARC 8: QUYẾT CHIẾN SHINJUKU ---------- */
    a8_start: { chapter: "Arc 8 · Quyết chiến Shinjuku", title: "Kẻ mạnh nhất trở về", env: "night/temple", cast: ["shen", "gojo"],
      onEnter: { arc: "arc8", fate: { gojo: "alive" }, time: { days: 20, label: "24 tháng 12, 2018" }, heal: "full", quest: { id: "q_shinjuku", status: "active" } },
      text: [
        "Ngục phong ấn mở ra. Gojo Satoru bước ra, vươn vai như vừa ngủ trưa dậy.",
        "> Xin lỗi để mọi người đợi lâu. Tôi về rồi đây.",
        "Anh ta nhìn quanh, đếm từng gương mặt. Có những gương mặt không còn ở đó. Anh ta không nói gì về điều đó.",
      ],
      ifRestriction: ["Gojo dừng lại trước Shen, kéo băng mắt xuống.", "> Lần trước tôi chỉ nhìn sơ qua. Giờ thì thấy rõ rồi. Nhóc vừa bị trời trói, vừa được trời cho, và cả hai đều lớn lên theo nhóc.", "> Hai mươi tám năm, tôi chưa thấy ai như vậy. Kể cả tôi."],
      choices: [{ t: "\"Mừng thầy về.\"", go: "a8_hub", eff: { rel: { gojo: 6 } } }],
      conds: [{ req: { fate: { nanami: "retired" } }, eff: { rel: { gojo: 8 } } }] },
    a8_hub: { chapter: "Arc 8 · Thời gian tự do", title: "Đêm trước Shinjuku", env: "night/temple", cast: ["shen"],
      text: ["Ba ngày. Nếu muốn nói điều gì với Gojo, đây là lúc."], hub: "a8_hub", go: "a8_gojo" },
    a8_gojo: { chapter: "Arc 8", title: "Hai kẻ mạnh nhất", env: "day/city", cast: ["gojo", "sukuna"],
      onEnter: { heal: "full", expLv: 1 },
      text: [
        "Shinjuku, ngày 24 tháng 12. Gojo và Sukuna triển khai lãnh địa cùng lúc. Bầu trời vỡ ra thành từng mảnh.",
        "Trận đánh kéo dài hàng giờ. Sukuna triệu hồi Ma Hư La, thức thần có thể thích nghi với mọi thứ, kể cả Vô Hạn của Gojo.",
        "Shen thấy bánh xe trên đầu Ma Hư La quay một nấc. Rồi một nấc nữa. Khi nó quay đủ, nhát chém của Sukuna sẽ chém cả không gian.",
        "[Hệ thống: Nút thắt của chuỗi nhân quả. Nếu Ma Hư La không kịp thích nghi, nhát chém đó sẽ không tồn tại.]",
      ],
      observe: ["sukuna", "mahoraga"],
      choices: [
        { t: "Lao vào cầm chân Ma Hư La", go: "a8_mahoraga", req: { domain: 1, level: 62, rel: { gojo: 45 } }, eff: { trace: { baove: 2 } } },
        { t: "Đứng nhìn, chờ lệnh", go: "a8_gojo_dead" },
      ] },
    a8_mahoraga: { chapter: "Arc 8", title: "Bánh xe thích nghi", env: "day/city", text: ["Mục tiêu: trụ vững 4 lượt để bánh xe không quay đủ vòng."],
      combat: { enemies: ["mahoraga_lim"], win: "a8_gojo_saved", lose: "a8_gojo_dead", canFlee: false, surviveTurns: 4 } },
    a8_gojo_saved: { chapter: "Arc 8", title: "Không còn một mình", env: "day/city", cast: ["shen", "gojo"],
      onEnter: { fate: { gojo: "retired" }, achievement: "a_fate_gojo", expLv: 2, rel: { gojo: 20 },
        ledger: { action: "Shen cầm chân Ma Hư La, nhát chém thế giới không thành hình", witnesses: "Gojo, Sukuna", consequence: "Gojo sống sót nhưng kiệt sức, không thể tiếp tục chiến đấu", trigger: "Gojo còn sống sau Shinjuku" } },
      text: [
        "Bánh xe dừng ở nấc thứ ba. Nhát chém của Sukuna xé toạc mặt đất, nhưng không xé được không gian.",
        "Gojo ngã xuống, máu chảy từ khóe miệng, nhưng còn thở. Anh ta nhìn Shen bằng đôi mắt xanh, lần đầu không có chút giễu cợt.",
        "> Nhóc... học trò mà cứu thầy thì còn ra thể thống gì nữa.",
        "> Thì thầy đừng đứng một mình nữa.",
        "Gojo bật cười, rồi ho ra máu, rồi vẫn cười.",
      ],
      choices: [{ t: "Tiếp tục", go: "a8_relay" }] },
    a8_gojo_dead: { chapter: "Arc 8", title: "Phía bên kia", env: "day/city", cast: ["shen", "gojo"],
      onEnter: { fate: { gojo: "dead" }, expLv: 1.5, ledger: { action: "Gojo Satoru tử trận tại Shinjuku", consequence: "Những người còn lại tiếp tục chiến đấu" } },
      text: ["Bánh xe quay đủ vòng. Một nhát chém lặng lẽ cắt đôi không gian, và cắt đôi Gojo Satoru.", "Anh ta vẫn đang mỉm cười khi ngã xuống.", "[Hệ thống: Kết quả trùng với dòng chảy ban đầu.]"],
      choices: [{ t: "Tiếp tục", go: "a8_relay" }] },
    a8_relay: { chapter: "Arc 8", title: "Tiếp sức", env: "day/city", cast: ["shen", "hakari", "uraume_b"],
      onEnter: { fate: { kashimo: "dead" }, heal: "full" },
      text: [
        "Từng người một lao vào Sukuna. Kashimo Hajime, chú thuật sư thời Edo, đánh một trận để đời rồi ngã xuống. Higuruma triển khai lãnh địa phiên tòa. Yuta, Maki, Itadori thay nhau.",
        "Ở rìa chiến trường, Uraume chặn đường viện binh. Hakari kéo tay Shen.",
        "> Này nhóc! Cược một ván không? Tôi giữ nó, cậu ra đòn.",
      ],
      observe: ["uraume_b"],
      choices: [{ t: "Cược", go: "a8_uraume", eff: { rel: { hakari: 8 }, flag: "hakari_team", anti: 1 } }] },
    a8_uraume: { chapter: "Arc 8", title: "Uraume", env: "day/city", text: ["Băng giá phủ kín ba dãy phố. Hakari lao vào giữa, cười lớn."],
      combat: { enemies: ["uraume_b"], win: "a8_uraume_win", lose: "a8_uraume_lose", canFlee: false, weakenFlag: "hakari_team" } },
    a8_uraume_lose: { chapter: "Arc 8", title: "Trúng thưởng", env: "day/city", cast: ["shen", "hakari"], onEveryEnter: { heal: "full" },
      text: ["Shen đông cứng nửa người. Hakari lôi cậu ra, mồ hôi nhễ nhại: \"Ván này thua. Ván sau thắng.\""], choices: [{ t: "Vào lại", go: "a8_uraume" }] },
    a8_uraume_win: { chapter: "Arc 8", title: "Băng tan", env: "day/city", cast: ["shen", "hakari"],
      onEnter: { flag: "trial_S", expLv: 1.5, sp: 800 },
      text: ["Lớp băng vỡ tan. Uraume bị thương nặng, rút lui khỏi chiến trường.", "[Hệ thống: Đánh bại cá thể Đặc cấp trong thực chiến. Hoàn thành điều kiện sát hạch Rank S.]"],
      choices: [{ t: "Tiếp tục", go: "a8_choso" }] },
    a8_choso: { chapter: "Arc 8", title: "Người anh cả", env: "day/city", cast: ["shen", "choso", "itadori", "sukuna"],
      text: [
        "Sukuna nhắm một đòn vào Itadori đang kiệt sức. Choso lao ra chắn trước em trai mình, không chút do dự.",
        "[Hệ thống: Nút thắt của chuỗi nhân quả.]",
      ],
      ifRestriction: ["Sukuna liếc Shen trong khoảnh khắc đó.", "> Hóa ra là vậy. Bị trời trói mà vẫn có thuật thức. Đó là cái mùi ta ngửi thấy từ trại giam. Ngươi sẽ là món tráng miệng."],
      choices: [
        { t: "Chắn cùng Choso", go: "a8_choso_saved", req: { anyFlag: ["choso_peace", "brothers_captured"], level: 70, notFate: { choso: "dead" } }, eff: { trace: { baove: 2, lienket: 1 } } },
        { t: "Kéo Itadori lùi lại", go: "a8_choso_dead" },
      ] },
    a8_choso_saved: { chapter: "Arc 8", title: "Người anh cả được sống", env: "day/city", cast: ["shen", "choso", "itadori"],
      onEnter: { fate: { choso: "alive" }, achievement: "a_fate_choso", expLv: 1, rel: { choso: 15, itadori: 8 }, ledger: { action: "Shen chắn đòn của Sukuna cùng Choso", witnesses: "Itadori", consequence: "Choso sống sót" } },
      text: ["Đòn đánh đập vào hai người cùng lúc thay vì một. Cả hai văng xa, nhưng cả hai đều đứng dậy.", "Choso nhìn Shen, máu chảy ròng ròng.", "> Ngươi tha cho các em ta. Giờ lại cứu ta. Ta nợ ngươi hai lần rồi."],
      choices: [{ t: "Tiếp tục", go: "a8_final" }] },
    a8_choso_dead: { chapter: "Arc 8", title: "Anh trai", env: "day/city", cast: ["shen", "choso", "itadori"],
      onEnter: { fate: { choso: "dead" }, expLv: 0.5, ledger: { action: "Choso tử trận khi che chắn cho Itadori", witnesses: "Shen, Itadori" } },
      text: ["Choso ngã xuống, mỉm cười.", "> Làm anh trai... tốt lắm.", "[Hệ thống: Kết quả trùng với dòng chảy ban đầu.]"],
      choices: [{ t: "Tiếp tục", go: "a8_final" }] },
    a8_final: { chapter: "Arc 8", title: "Linh hồn", env: "dusk/city", cast: ["shen", "itadori", "kugisaki", "fushiguro"],
      onEnter: { fate: { sukuna: "dead", fushiguro: "alive", kenjaku: "dead" }, expLv: 2,
        ledger: { action: "Ryomen Sukuna bị đánh bại tại Shinjuku", witnesses: "Tất cả", consequence: "Fushiguro được giải thoát. Kenjaku đã bị Yuta tiêu diệt trước đó" } },
      conds: [{ req: { fate: { kugisaki: "injured" } }, eff: { fate: { kugisaki: "alive" } } }],
      text: [
        "Đòn quyết định thuộc về Itadori. Cậu ta chạm thẳng vào linh hồn Sukuna, tách nó khỏi Fushiguro.",
        "Kugisaki xuất hiện từ phía sau, một cây đinh cắm vào mảnh cuối cùng của ngón tay Vua Nguyền. Cô đã trở về.",
        "Itadori đưa tay về phía Sukuna, đề nghị hắn sống tiếp trong mình. Sukuna từ chối, rồi tan biến.",
        "Fushiguro mở mắt. Là cậu ta. Thật sự là cậu ta.",
      ],
      choices: [{ t: "Tiếp tục", go: "a8_after" }] },
    a8_after: { chapter: "Hết Arc 8", title: "Hết nguyên tác", env: "night/temple", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      onEnter: { quest: { id: "q_shinjuku", status: "done" }, sp: 1000, time: { days: 5, label: "Cuối tháng 12, 2018" } },
      text: ["Đêm đó, năm nhất ngồi trên mái chùa, ăn mì ly, không ai nói gì về những người đã mất.", "Shen mở bảng Hệ thống. Ở dòng cuối cùng có một câu cậu chưa từng thấy:", "[Dòng chảy ban đầu đã kết thúc tại đây. Từ giờ trở đi, không còn bản đồ nào nữa.]"],
      special: "rankup", go: "a8_end" },
    a8_end: { chapter: "Hết Arc 8", title: "Trang trắng", env: "night/temple", cast: ["shen"],
      text: ["Phía trước là những ngày chưa ai viết."], choices: [{ t: "Bắt đầu Arc 9: Thế giới sau Vua Nguyền", go: "a9_start" }] },

    /* ---------- ARC 9: THẾ GIỚI SAU VUA NGUYỀN ---------- */
    a9_start: { chapter: "Arc 9 · Thế giới sau Vua Nguyền", title: "Mùa xuân", env: "day/temple", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      onEnter: { arc: "arc9", time: { days: 80, label: "Tháng 3, 2019" }, heal: "full", quest: { id: "q_hacklien", status: "active" } },
      conds: [{ req: { fate: { gojo: "retired" } }, eff: { rel: { gojo: 4 } } }],
      text: [
        "Mùa xuân 2019. Học viện được xây lại. Shen được đề cử Đặc cấp, chú thuật sư đặc cấp trẻ nhất kể từ Gojo Satoru.",
        "Nhưng sau cái chết của Sukuna, một giáo phái mới nổi lên: Hội Hắc Liên. Chúng thu gom những mảnh vụn còn sót của Vua Nguyền, và những ghi chép Kenjaku để lại.",
        "> Chúng gọi Sukuna là \"vị thần bị phản bội\", Itadori kể, mặt khó chịu. Nghe phát ớn.",
      ],
      choices: [{ t: "Nhận nhiệm vụ truy quét", go: "a9_hub" }] },
    a9_hub: { chapter: "Arc 9 · Thời gian tự do", title: "Mùa xuân 2019", env: "day/temple", cast: ["shen"], text: ["Năm ngày để chuẩn bị và lần theo dấu vết Hắc Liên."], hub: "a9_hub", go: "a9_raid" },
    a9_raid: { chapter: "Arc 9", title: "Đại bản doanh Hắc Liên", env: "night/temple", cast: ["shen", "rensei"],
      onEnter: { heal: "full", expLv: 1.5 },
      text: ["Ngôi chùa cổ trên núi Hiei. Ở chính điện, một người đàn ông mặc áo cà sa đen ngồi thiền giữa hàng trăm ngọn nến.", "> Chào mừng. Người dẫn đường của ta nói rằng một ngày nào đó, có kẻ \"đi lệch khỏi dòng chảy\" sẽ tới đây. Là cậu sao?", "Shen lạnh gáy. Hắn không biết gì về Hệ thống. Nhưng ai đó đã nói với hắn về Shen."],
      observe: ["rensei"],
      choices: [{ t: "Chiến đấu", go: "a9_raid_fight" }] },
    a9_raid_fight: { chapter: "Arc 9", title: "Kagami Rensei", env: "night/temple", text: ["Hàng trăm tấm gương mọc lên quanh chính điện. Trong mỗi tấm là một Rensei."],
      combat: { enemies: ["rensei"], win: "a9_rensei_win", lose: "a9_rensei_lose", canFlee: false } },
    a9_rensei_lose: { chapter: "Arc 9", title: "Gương vỡ", env: "night/temple", cast: ["shen", "yuta"], onEveryEnter: { heal: "full" },
      text: ["Yuta xuất hiện, chém vỡ mười tấm gương một lúc. \"Thở đi. Rồi vào lại.\""], choices: [{ t: "Vào lại", go: "a9_raid_fight" }] },
    a9_rensei_win: { chapter: "Arc 9", title: "Người dẫn đường", env: "night/temple", cast: ["shen", "rensei"],
      text: ["Rensei quỳ giữa đống gương vỡ, máu chảy từ miệng nhưng vẫn cười.", "> Người dẫn đường trong giấc mơ của ta... có giọng nói giống hệt cậu. Chỉ già hơn, mệt mỏi hơn.", "> Hắn nói: hãy kéo dài thời gian. Hắn sắp tới rồi."],
      choices: [
        { t: "Giao Rensei cho học viện xét xử", go: "a9_end", eff: { moral: 4, rep: { tokyo: 5 }, known: "giong_noi_giong_shen" } },
        { t: "Kết liễu hắn", go: "a9_end", eff: { anti: 4, known: "giong_noi_giong_shen" } },
      ] },
    a9_end: { chapter: "Hết Arc 9", title: "Giọng nói", env: "night/temple", cast: ["shen"],
      onEnter: { quest: { id: "q_hacklien", status: "done" }, expLv: 2, sp: 1500 },
      text: ["Trong đống đồ tịch thu từ chùa Hiei có bốn chiếc hộp gỗ niêm phong. Ba chiếc đã trống.", "Trên nắp ghi: \"Tứ Đại Pháp Sư Heian.\""],
      choices: [{ t: "Bắt đầu Arc 10: Di vật Heian", go: "a10_start" }] },

    /* ---------- ARC 10: DI VẬT HEIAN ---------- */
    a10_start: { chapter: "Arc 10 · Di vật Heian", title: "Bốn chiếc hộp", env: "dusk/city", cast: ["shen", "gojo", "yuta"],
      onEnter: { arc: "arc10", time: { days: 60, label: "Tháng 5, 2019" }, heal: "full", quest: { id: "q_heian", status: "active" } },
      text: [
        "Hỏa, Thủy, Phong, Thổ. Bốn pháp sư mạnh nhất thời Heian, ngang hàng với Sukuna lúc sinh thời, đã tự phong ấn vào chú vật để chờ một thời đại không còn kẻ mạnh nhất.",
        "Thời đại đó là bây giờ.",
        "> Họ chọn đúng lúc thật, Yuta thở dài.",
      ],
      choices: [{ t: "Chuẩn bị", go: "a10_hub" }] },
    a10_hub: { chapter: "Arc 10 · Thời gian tự do", title: "Trước cơn bão Heian", env: "day/temple", cast: ["shen"], text: ["Bốn ngày. Rồi bốn trận chiến."], hub: "a10_hub", go: "a10_enka" },
    a10_enka: { chapter: "Arc 10", title: "Hỏa", env: "night/city", cast: ["shen", "enka"], onEnter: { heal: "full", expLv: 0.5 },
      text: ["Osaka bốc cháy. Enka đứng giữa biển lửa, ngáp dài: \"Một nghìn năm, con người vẫn yếu như vậy.\""],
      choices: [{ t: "Chiến đấu", go: "a10_enka_f" }] },
    a10_enka_f: { chapter: "Arc 10", title: "Enka", env: "night/city", text: ["Lửa của hắn đốt cả chú lực trong không khí."], combat: { enemies: ["enka"], win: "a10_mizuchi", lose: "a10_retry1", canFlee: false } },
    a10_retry1: { chapter: "Arc 10", title: "Lui lại", env: "night/city", cast: ["shen", "maki"], onEveryEnter: { heal: "full" }, text: ["Maki chém đôi một cột lửa để kéo Shen ra. \"Lần nữa.\""], choices: [{ t: "Lần nữa", go: "a10_enka_f" }] },
    a10_mizuchi: { chapter: "Arc 10", title: "Thủy", env: "rain/river", cast: ["shen", "mizuchi"], onEnter: { heal: "full", expLv: 0.5 },
      text: ["Sông Kamo chảy ngược lên trời. Mizuchi đứng trên đỉnh cột nước, im lặng như một bức tượng."],
      choices: [{ t: "Chiến đấu", go: "a10_mizuchi_f" }] },
    a10_mizuchi_f: { chapter: "Arc 10", title: "Mizuchi", env: "rain/river", text: ["Một con rồng nước lao xuống."], combat: { enemies: ["mizuchi"], win: "a10_kazahaya", lose: "a10_retry2", canFlee: false } },
    a10_retry2: { chapter: "Arc 10", title: "Lui lại", env: "rain/river", cast: ["shen", "itadori"], onEveryEnter: { heal: "full" }, text: ["Itadori lôi Shen lên bờ. \"Cậu nặng thế!\""], choices: [{ t: "Lần nữa", go: "a10_mizuchi_f" }] },
    a10_kazahaya: { chapter: "Arc 10", title: "Phong", env: "day/forest", cast: ["shen", "kazahaya", "junpei"], onEnter: { heal: "full", expLv: 0.5 },
      text: ["Rừng Aokigahara bị gió cắt thành từng lát. Kazahaya nhanh tới mức Shen chỉ thấy vệt sáng.", "Junpei, giờ đã là chú thuật sư Cấp 2, đứng cạnh Shen nếu cậu ta còn sống. Nếu không, Shen đứng một mình."],
      choices: [{ t: "Chiến đấu", go: "a10_kazahaya_f" }] },
    a10_kazahaya_f: { chapter: "Arc 10", title: "Kazahaya", env: "day/forest", text: ["Gió rít lên như tiếng thét."], combat: { enemies: ["kazahaya"], win: "a10_iwakura", lose: "a10_retry3", canFlee: false } },
    a10_retry3: { chapter: "Arc 10", title: "Lui lại", env: "day/forest", cast: ["shen", "yuta"], onEveryEnter: { heal: "full" }, text: ["Yuta chắn một nhát gió cho Shen. \"Anh ở đây. Thử lại đi.\""], choices: [{ t: "Lần nữa", go: "a10_kazahaya_f" }] },
    a10_iwakura: { chapter: "Arc 10", title: "Thổ · Sát hạch Rank SS", env: "dusk/city", cast: ["shen", "iwakura"], onEnter: { heal: "full", expLv: 1 },
      text: ["Núi Phú Sĩ nứt ra. Iwakura bước khỏi lòng núi, cao bằng một tòa nhà mười tầng.", "> Ba kẻ kia yếu. Ta thì không.", "[Hệ thống: Đánh bại cá thể này sẽ hoàn thành sát hạch Rank SS.]"],
      observe: ["iwakura"], choices: [{ t: "Chiến đấu", go: "a10_iwakura_f" }] },
    a10_iwakura_f: { chapter: "Arc 10", title: "Iwakura", env: "dusk/city", text: ["Mặt đất dưới chân Shen biến thành một bàn tay khổng lồ."], combat: { enemies: ["iwakura"], win: "a10_win", lose: "a10_retry4", canFlee: false } },
    a10_retry4: { chapter: "Arc 10", title: "Lui lại", env: "dusk/city", cast: ["shen", "gojo"], onEveryEnter: { heal: "full" }, text: ["Một bàn tay đặt lên vai Shen. \"Nhóc vẫn còn non lắm.\" Gojo, hoặc là ký ức của Gojo, Shen không chắc nữa."], choices: [{ t: "Lần nữa", go: "a10_iwakura_f" }] },
    a10_win: { chapter: "Hết Arc 10", title: "Siêu việt", env: "night/city", cast: ["shen"],
      onEnter: { flag: "trial_SS", quest: { id: "q_heian", status: "done" }, expLv: 1.5, sp: 3000 },
      text: ["Iwakura sụp đổ thành một ngọn đồi đá. [Hệ thống: Hoàn thành sát hạch Rank SS.]", "Đêm đó, Hệ thống chớp tắt ba lần. Rồi một dòng chữ không theo định dạng hiện lên:", "[Ta sắp tới.]"],
      special: "rankup", go: "a10_end" },
    a10_end: { chapter: "Hết Arc 10", title: "Ta sắp tới", env: "night/temple", cast: ["shen"], text: ["Shen không ngủ được."], choices: [{ t: "Bắt đầu Arc 11: Cội nguồn thuật thức", go: "a11_start" }] },

    /* ---------- ARC 11: CỘI NGUỒN THUẬT THỨC ---------- */
    a11_start: { chapter: "Arc 11 · Cội nguồn thuật thức", title: "Những dòng chữ lạ", env: "night/temple", cast: ["shen"],
      onEnter: { arc: "arc11", time: { days: 30, label: "Tháng 6, 2019" }, heal: "full", quest: { id: "q_origin", status: "active" } },
      text: ["Hệ thống bắt đầu nói những điều nó chưa từng nói.", "[...Ký chủ đã cứu được những người ta không cứu được...]", "[...Ta muốn biết cảm giác đó...]", "Shen không thể kể với ai. Không ai biết Hệ thống tồn tại. Và nếu cậu kể, cậu không chắc mình còn được tin."],
      choices: [{ t: "Tự đi tìm câu trả lời", go: "a11_hub" }] },
    a11_hub: { chapter: "Arc 11 · Thời gian tự do", title: "Những giấc mơ", env: "day/temple", cast: ["shen"], text: ["Bốn ngày. Shen quyết định đọc lại mọi thứ Kenjaku để lại."], hub: "a11_hub", go: "a11_dream" },
    a11_dream: { chapter: "Arc 11", title: "Thư viện số phận", env: "indoor/dojo", cast: ["shen", "observer"],
      onEnter: { expLv: 1, known: "nguon_goc_he_thong" },
      text: [
        "Đêm đó, Shen nhắm mắt và mở mắt ở một nơi khác: một thư viện vô tận, mỗi cuốn sách là một cuộc đời.",
        "Ở trung tâm, một người đàn ông ngồi đọc. Tóc trắng xóa, nhưng gương mặt là của Shen. Già hơn hai mươi năm.",
        "> Chào mừng. Ta là ngươi, ở dòng chảy ban đầu. Nơi Junpei chết, Nanami chết, Gojo chết, và ta đứng nhìn tất cả.",
        "> Ta sống tiếp, mạnh lên, tới mức không còn ai đủ mạnh để giết ta. Rồi ta biến chính mình thành một lời nguyền: Thiên Mệnh Thư. Thứ ngươi gọi là Hệ thống.",
        "> Ta gửi nó về cho ngươi để viết lại câu chuyện. Và ngươi đã viết hay hơn ta tưởng.",
        "Hắn đóng sách lại.",
        "> Giờ thì đưa thân xác đó cho ta. Ta cũng muốn được sống trong câu chuyện có kết thúc đẹp.",
      ],
      observe: ["observer"],
      choices: [{ t: "\"Không.\"", go: "a11_fight", eff: { moral: 2 } }, { t: "\"Ông đã cho tôi cơ hội. Nhưng đây là cuộc đời của tôi.\"", go: "a11_fight", eff: { moral: 1, anti: 1 } }] },
    a11_fight: { chapter: "Arc 11", title: "Bóng của Kẻ Quan Sát", env: "indoor/dojo", text: ["Những trang sách bay lên, kết thành một hình bóng."],
      combat: { enemies: ["observer_shadow"], win: "a11_end", lose: "a11_retry", canFlee: false } },
    a11_retry: { chapter: "Arc 11", title: "Trang sách", env: "indoor/dojo", cast: ["shen"], onEveryEnter: { heal: "full" },
      text: ["Shen tỉnh dậy trong phòng ngủ, mồ hôi ướt đẫm. Rồi nhắm mắt lần nữa."], choices: [{ t: "Quay lại thư viện", go: "a11_fight" }] },
    a11_end: { chapter: "Hết Arc 11", title: "Cội nguồn", env: "night/temple", cast: ["shen"],
      onEnter: { quest: { id: "q_origin", status: "done" }, expLv: 3, sp: 5000 },
      text: ["Cái bóng tan biến. Nhưng Shen biết, bản thể thật của hắn đang tới gần.", "[Thiên Mệnh Thư: Ký chủ đã biết sự thật. Chức năng giới hạn đã được gỡ bỏ.]", "Lần đầu tiên, Hệ thống không còn là một thứ bí ẩn. Nó là một lời nguyền, viết bởi chính mình, cho chính mình."],
      choices: [{ t: "Bắt đầu Arc 12: Đỉnh Thiên thượng", go: "a12_start" }] },

    /* ---------- ARC 12: ĐỈNH THIÊN THƯỢNG ---------- */
    a12_start: { chapter: "Arc 12 · Đỉnh Thiên thượng", title: "Bầu trời mở ra", env: "night/city", cast: ["shen"],
      onEnter: { arc: "arc12", time: { days: 15, label: "Tháng 7, 2019" }, heal: "full", quest: { id: "q_final", status: "active" } },
      text: [
        "Bầu trời Tokyo nứt ra như một trang giấy bị xé. Từ vết nứt, một bàn tay khổng lồ bằng chữ viết vươn xuống.",
        "Với mọi người, đó là một chú linh chưa từng thấy, lớn hơn mọi thứ từng tồn tại. Không ai biết nó từ đâu tới.",
        "Chỉ Shen biết.",
      ],
      choices: [{ t: "Gọi mọi người", go: "a12_allies" }] },
    a12_allies: { chapter: "Arc 12", title: "Những người còn sống", env: "night/city", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      conds: [
        { req: { anyFlag: ["junpei_alive"] }, eff: { flag: "ally_junpei" } },
        { req: { fate: { nanami: "retired" } }, eff: { flag: "ally_nanami" } },
        { req: { fate: { gojo: "retired" } }, eff: { flag: "ally_gojo" } },
        { req: { fate: { tsukumo: "alive" } }, eff: { flag: "ally_tsukumo" } },
        { req: { fate: { choso: "alive" } }, eff: { flag: "ally_choso" } },
      ],
      text: [
        "Shen không thể nói cho họ biết sự thật. Cậu chỉ nói: \"Tôi cần mọi người.\" Thế là đủ.",
        "Itadori, Fushiguro, Kugisaki, Maki, Yuta, Panda, Inumaki. Và những người mà ở dòng chảy ban đầu đã không còn ở đây: mỗi người Shen từng cứu đều có mặt.",
        "Họ không biết vì sao Shen biết điểm yếu của thứ trên bầu trời. Họ chỉ tin cậu.",
      ],
      choices: [{ t: "Lên đỉnh tòa nhà cao nhất", go: "a12_rally" }] },
    a12_rally: { chapter: "Arc 12", title: "Chỗ dựa", env: "night/city", cast: ["shen"],
      text: ["Những người Shen đã cứu lần lượt mở đường: mỗi người cầm chân một phần của lời nguyền khổng lồ.", "[Thiên Mệnh Thư: Số phận đã thay đổi càng nhiều, Kẻ Quan Sát càng yếu đi. Hắn được tạo nên từ những cái chết của dòng chảy ban đầu.]"],
      choices: [
        { t: "Tiến lên với tất cả đồng đội", go: "a12_final", req: { anyFlag: ["ally_gojo", "ally_nanami", "ally_tsukumo", "ally_choso", "ally_junpei"] }, eff: { flag: "allies_many" } },
        { t: "Tiến lên", go: "a12_final" },
      ] },
    a12_final: { chapter: "Arc 12", title: "Kẻ Quan Sát", env: "night/city", cast: ["shen", "observer"], onEnter: { heal: "full" },
      text: ["Trên đỉnh tòa nhà, giữa bầu trời vỡ vụn, hai Shen đứng đối diện nhau.", "> Ta đã viết ra ngươi. Ngươi nghĩ có thể thắng tác giả sao?", "> Ông viết phần mở đầu. Phần còn lại là tôi viết."],
      observe: ["observer"], choices: [{ t: "Trận chiến cuối cùng", go: "a12_fight" }] },
    a12_fight: { chapter: "Arc 12", title: "Thiên Mệnh Thư", env: "night/city", text: ["Kẻ Quan Sát triển khai lãnh địa: một thư viện nuốt chửng cả Tokyo."],
      combat: { enemies: ["observer"], win: "a12_win", lose: "a12_retry", canFlee: false, weakenFlag: "allies_many" } },
    a12_retry: { chapter: "Arc 12", title: "Chưa phải trang cuối", env: "night/city", cast: ["shen", "itadori"], onEveryEnter: { heal: "full" },
      text: ["Itadori đỡ Shen dậy. Cậu ta không hiểu chuyện gì đang xảy ra, nhưng vẫn cười.", "> Này, cậu nói cần bọn tớ mà. Thì dựa vào đi."], choices: [{ t: "Đứng dậy", go: "a12_fight" }] },
    a12_win: { chapter: "Arc 12", title: "Trang cuối", env: "dawn/city".replace("dawn", "dusk"), cast: ["shen", "observer"],
      onEnter: { flag: "trial_SSS", expLv: 3 },
      text: ["Kẻ Quan Sát quỳ xuống. Những trang sách rơi khỏi cơ thể hắn như lá mùa thu.", "> Ngươi... đã viết một câu chuyện mà ta không dám viết.", "[Thiên Mệnh Thư: Hoàn thành sát hạch Rank SSS.]"],
      special: "rankup", go: "a12_choice" },
    a12_choice: { chapter: "Arc 12", title: "Lựa chọn cuối cùng", env: "dusk/city", cast: ["shen", "observer"],
      text: ["Kẻ Quan Sát đang tan biến. Thiên Mệnh Thư, thứ đã đi cùng Shen từ buổi tối ở tủ đồ số 44, chờ một quyết định."],
      choices: [
        { t: "Xé bỏ Thiên Mệnh Thư. Sống tiếp như một người bình thường mạnh nhất.", go: "a12_end_light", req: { moralMin: 20 } },
        { t: "Hấp thụ Kẻ Quan Sát. Trở thành người giữ cuốn sách.", go: "a12_end_anti" },
        { t: "Niêm phong hắn bên trong mình, cùng Thiên Mệnh Thư.", go: "a12_end_mid" },
      ] },
    a12_end_light: { chapter: "Kết thúc", title: "Trang sách trắng", env: "day/temple", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      onEnter: { achievement: "a_end_light", quest: { id: "q_final", status: "done" } },
      text: [
        "Shen xé cuốn sách. Lần cuối cùng, khung chữ xanh hiện lên:",
        "[Cảm ơn. Ta đã luôn muốn biết câu chuyện kết thúc thế nào.]",
        "Rồi không còn gì nữa. Không chỉ số, không thông báo. Chỉ có Shen, và những người cậu đã cứu.",
        "Một năm sau, Itadori hỏi: \"Này, hồi đó sao cậu biết điểm yếu của cái thứ trên trời vậy?\"",
        "Shen cười: \"Đoán thôi.\"",
        "HẾT.",
      ], choices: [{ t: "Xem lại hành trình (tab Thế giới)", go: "a12_epilogue" }] },
    a12_end_anti: { chapter: "Kết thúc", title: "Người giữ sách", env: "night/temple", cast: ["shen"],
      onEnter: { achievement: "a_end_anti", quest: { id: "q_final", status: "done" } },
      text: [
        "Shen hấp thụ Kẻ Quan Sát. Hai mươi năm ký ức tràn vào đầu cậu: những cái chết, những đêm dài, những lần ngồi một mình.",
        "Cậu trở thành người giữ Thiên Mệnh Thư. Mạnh nhất. Biết trước mọi thứ. Và, giống như một người từng đứng ở đỉnh trời trước cậu, đứng một mình.",
        "Đôi khi, Gojo hay Itadori nhìn cậu và thấy một ánh mắt quá già so với tuổi. Họ không hỏi. Họ không biết phải hỏi gì.",
        "HẾT.",
      ], choices: [{ t: "Xem lại hành trình (tab Thế giới)", go: "a12_epilogue" }] },
    a12_end_mid: { chapter: "Kết thúc", title: "Lời nguyền được niêm phong", env: "dusk/temple", cast: ["shen", "itadori"],
      onEnter: { achievement: "a_end_mid", quest: { id: "q_final", status: "done" } },
      text: [
        "Shen niêm phong Kẻ Quan Sát vào chính mình, như Itadori từng mang Sukuna.",
        "Thiên Mệnh Thư im lặng, nhưng không biến mất. Mỗi đêm, Shen nghe thấy tiếng lật trang rất khẽ.",
        "> Này, Itadori, một tối Shen hỏi. Mang một thứ gì đó trong người... có nặng không?",
        "> Có, Itadori đáp. Nhưng có bạn bè thì đỡ hơn nhiều.",
        "HẾT.",
      ], choices: [{ t: "Xem lại hành trình (tab Thế giới)", go: "a12_epilogue" }] },
    a12_epilogue: { chapter: "Hậu ký", title: "Hành trình của Shen", env: "night/temple", cast: ["shen"],
      text: ["Toàn bộ chuỗi nhân quả, số phận của từng người và mọi lựa chọn đều được lưu trong tab Thế giới.", "Bạn có thể chơi lại từ đầu với những lựa chọn khác để thấy những kết cục khác."],
      choices: [] },
  });
  SC.a12_win.env = "dusk/city";
  /* Nhịp lên cấp: Arc 7–8 dồn dập (chiến tranh toàn diện), Arc 9–12 đều tay */
  Object.keys(SC).forEach((id) => {
    const m = /^a(7|8)_/.test(id) ? 3.6 : /^a(9|10|11|12)_/.test(id) ? 2.4 : 1;
    ["onEnter", "onEveryEnter"].forEach((k) => { if (SC[id][k] && SC[id][k].expLv && m !== 1) SC[id][k].expLv = Math.round(SC[id][k].expLv * m * 10) / 10; });
    (SC[id].choices || []).forEach((c) => { if (c.eff && c.eff.expLv && m !== 1) c.eff.expLv = Math.round(c.eff.expLv * m * 10) / 10; });
  });
})(typeof window !== "undefined" ? window : globalThis);
