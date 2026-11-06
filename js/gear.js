/* =====================================================================
   CURSED DESTINY — TRANG BỊ: BẬC (E–SSS) × PHẨM (7 bậc) · KỸ NĂNG CÓ BẬC · THƯỞNG THĂNG BẬC
   Nạp sau world.js, trước story.js.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {}), D = CD.DATA;
  const RANKS = ["E", "D", "C", "B", "A", "S", "SS", "SSS"];

  /* ---------- PHẨM CHẤT (mục 9.1) ---------- */
  const QUALITIES = ["Phổ thông", "Tốt", "Hiếm", "Sử thi", "Huyền thoại", "Thần thoại", "Độc nhất"];
  const QUALITY_MULT = [1.0, 1.2, 1.45, 1.75, 2.1, 2.5, 3.0];
  const AFFIX_COUNT = [0, 0, 1, 1, 2, 2, 3];
  /* Ngân sách chỉ số theo Bậc (Quality ≠ Rank — mục 9.2) */
  const RANK_BUDGET = { E: 3, D: 5, C: 8, B: 12, A: 17, S: 24, SS: 33, SSS: 45 };
  const SLOT_STATS = {
    "Vũ khí": [["STR", 3], ["AGI", 2], ["INT", 1]],
    "Găng tay": [["STR", 2], ["INT", 2], ["AGI", 1]],
    "Giáp": [["VIT", 3], ["WIS", 2]],
    "Giày": [["AGI", 3], ["VIT", 1]],
    "Phụ kiện": [["WIS", 2], ["LUK", 2], ["INT", 1]],
  };
  const SLOT_NAMES = {
    "Vũ khí": ["Đoản kiếm chú cụ", "Côn trừ tà", "Thương chú cụ", "Xích phong ấn", "Dao găm khắc ấn"],
    "Găng tay": ["Găng dẫn chú", "Băng quấn tẩm bùa", "Hộ thủ sắt"],
    "Giáp": ["Áo lót dán bùa", "Áo khoác chú thuật sư", "Giáp lụa phong ấn"],
    "Giày": ["Giày chạy gia cố", "Ủng đế bùa", "Giày vải nhẹ"],
    "Phụ kiện": ["Vòng tay hộ mệnh", "Mặt dây chú ngọc", "Nhẫn khắc ấn", "Chuỗi hạt trừ tà"],
  };
  /* Thuộc tính phụ (phẩm Hiếm trở lên) — giá trị tăng theo Phẩm */
  const AFFIXES = [
    { key: "critBonus", name: "Chí mạng", unit: "%", base: 0.02 },
    { key: "evaBonus", name: "Né tránh", unit: "%", base: 0.015 },
    { key: "ceRegen", name: "Hồi Chú lực/lượt", unit: "", base: 1 },
    { key: "staRegen", name: "Hồi Thể lực/lượt", unit: "", base: 2 },
    { key: "hpMult", name: "HP tối đa", unit: "%", base: 0.04, mult: true },
    { key: "dmgPhys", name: "Sát thương vật lý", unit: "%", base: 0.04, mult: true },
    { key: "dmgCurse", name: "Sát thương chú lực", unit: "%", base: 0.04, mult: true },
  ];
  const affixValue = (a, q) => { const v = a.base * (1 + (q - 2) * 0.5); return a.unit === "" ? Math.max(1, Math.round(v)) : Math.round(v * 1000) / 1000; };
  const affixMods = (list, q) => { const m = {}; list.forEach((i) => { const a = AFFIXES[i], v = affixValue(a, q); m[a.key] = a.mult ? 1 + v : v; }); return m; };
  CD.affixText = function (mods) {
    return Object.entries(mods || {}).map(([k, v]) => {
      const a = AFFIXES.find((x) => x.key === k); if (!a) return "";
      const val = a.mult ? v - 1 : v;
      return a.name + " +" + (a.unit === "%" ? Math.round(val * 1000) / 10 + "%" : val);
    }).filter(Boolean).join(", ");
  };

  /* Tạo trang bị: chỉ số = Ngân sách Bậc × Hệ số Phẩm, chia theo tỉ trọng của ô trang bị */
  CD.makeGear = function (o) {
    const q = QUALITIES.indexOf(o.quality), budget = Math.round(RANK_BUDGET[o.rank] * QUALITY_MULT[q]);
    const w = o.stats || SLOT_STATS[o.slot], tw = w.reduce((a, x) => a + x[1], 0), stats = {};
    let left = budget;
    w.forEach(([k, x], i) => { const v = i === w.length - 1 ? left : Math.max(1, Math.round((budget * x) / tw)); stats[k] = (stats[k] || 0) + v; left -= v; });
    const it = { name: o.name, slot: o.slot, rank: o.rank, quality: o.quality, stats, lore: o.lore || "", gen: !!o.gen };
    if (o.affixes && o.affixes.length) it.mods = affixMods(o.affixes, q);
    if (o.rank !== "E") it.req = { rank: o.rank };
    if (o.unique) it.unique = true;
    return it;
  };
  CD.itemValue = (it) => (it.rank ? Math.round(RANK_BUDGET[it.rank] * QUALITY_MULT[Math.max(0, QUALITIES.indexOf(it.quality))] * 600) : 300);

  /* Rơi đồ ngẫu nhiên: Bậc = Bậc kẻ địch, Phẩm tung xúc xắc (LUK cộng thêm) */
  CD.rollLoot = function (s, rank, rng, boss) {
    rng = rng || Math.random;
    const luk = CD.effective(s).stats.LUK;
    const chance = boss ? 1 : Math.min(0.75, 0.3 + luk * 0.006);
    if (rng() > chance) return null;
    const roll = rng() * 100 - luk * 0.25 - (boss ? 12 : 0);
    const q = roll < 2 ? 4 : roll < 9 ? 3 : roll < 28 ? 2 : roll < 60 ? 1 : 0;
    const slots = Object.keys(SLOT_STATS), slot = slots[Math.floor(rng() * slots.length)];
    const names = SLOT_NAMES[slot], name = names[Math.floor(rng() * names.length)];
    const affixes = []; while (affixes.length < AFFIX_COUNT[q]) { const a = Math.floor(rng() * AFFIXES.length); if (!affixes.includes(a)) affixes.push(a); }
    const id = "gen_" + Date.now().toString(36) + Math.floor(rng() * 1e6).toString(36);
    const it = CD.makeGear({ name: name + " · " + QUALITIES[q], slot, rank, quality: QUALITIES[q], affixes, gen: true, lore: "Thu được sau trận đánh." });
    s.genItems = s.genItems || {}; s.genItems[id] = it; D.ITEMS[id] = it;
    return id;
  };
  CD.registerGen = function (s) { for (const id in s.genItems || {}) D.ITEMS[id] = s.genItems[id]; };
  CD.QUALITIES = QUALITIES;

  /* ---------- GÁN BẬC & PHẨM CHO TRANG BỊ CÓ SẴN ---------- */
  const setRQ = (id, rank, quality) => { const it = D.ITEMS[id]; it.rank = rank; it.quality = quality; if (rank !== "E") it.req = { rank }; else delete it.req; };
  [["bua_chay", "E", "Phổ thông"], ["bang_tay", "E", "Tốt"], ["dongphuc", "E", "Tốt"], ["giay_tap", "E", "Phổ thông"], ["huy_hieu3", "D", "Hiếm"],
   ["dao_chu4", "E", "Tốt"], ["con_go", "D", "Tốt"], ["kiem_chu3", "D", "Hiếm"], ["kiem_chu2", "C", "Sử thi"], ["giay_chu", "E", "Hiếm"],
   ["gang_khac", "D", "Hiếm"], ["ao_bua", "D", "Hiếm"], ["vong_bua", "E", "Hiếm"], ["huy_hieu2", "C", "Sử thi"]].forEach((x) => setRQ(...x));
  D.ITEMS.ngon_tay.quality = "Độc nhất";
  Object.values(D.ITEMS).forEach((it) => { if (!it.slot && QUALITIES.indexOf(it.quality) < 0) it.quality = "Phổ thông"; });

  /* ---------- TRANG BỊ BÁN TRONG CỬA HÀNG (cố định) ---------- */
  const SHOP_GEAR = [];
  const add = (id, o, shop, price, stock) => { D.ITEMS[id] = CD.makeGear(o); SHOP_GEAR.push({ shop, id, price, stock }); };
  // Học viện (yên): Bậc E–C, phẩm Tốt
  [["E", 6000], ["D", 18000], ["C", 45000]].forEach(([r, p]) => Object.keys(SLOT_STATS).forEach((slot, i) =>
    add("hv_" + r + "_" + i, { name: SLOT_NAMES[slot][0] + " Học viện (" + r + ")", slot, rank: r, quality: "Tốt", lore: "Hàng tiêu chuẩn của kho hậu cần." }, "academy", p, 1)));
  // Hệ thống (ĐHT): Bậc D–C, phẩm Hiếm/Sử thi kèm thuộc tính phụ
  add("ht_D_w", { name: "Kiếm dẫn chú Hệ thống", slot: "Vũ khí", rank: "D", quality: "Hiếm", affixes: [0] }, "system", 90, 1);
  add("ht_D_a", { name: "Áo giáp lưới Hệ thống", slot: "Giáp", rank: "D", quality: "Hiếm", affixes: [4] }, "system", 90, 1);
  add("ht_C_g", { name: "Găng xung chú Hệ thống", slot: "Găng tay", rank: "C", quality: "Sử thi", affixes: [6] }, "system", 220, 1);
  add("ht_C_b", { name: "Giày lướt bóng Hệ thống", slot: "Giày", rank: "C", quality: "Sử thi", affixes: [1] }, "system", 220, 1);
  add("ht_C_r", { name: "Nhẫn tụ chú Hệ thống", slot: "Phụ kiện", rank: "C", quality: "Sử thi", affixes: [2] }, "system", 240, 1);
  ["academy", "system"].forEach((sid) => D.SHOPS[sid].items = D.SHOPS[sid].items.filter((x) => !["dao_chu4", "giay_chu", "con_go", "vong_bua", "kiem_chu3", "gang_khac", "ao_bua"].includes(x.id)));
  SHOP_GEAR.forEach((g) => D.SHOPS[g.shop].items.push({ id: g.id, price: g.price, stock: g.stock }));
  D.SHOPS.academy.items.push({ id: "dao_chu4", price: 15000, stock: 1 }, { id: "giay_chu", price: 12000, stock: 1 }, { id: "vong_bua", price: 30000, stock: 1 }, { id: "con_go", price: 25000, stock: 1 });
  D.SHOPS.system.items.push({ id: "kiem_chu3", price: 150, stock: 1 }, { id: "gang_khac", price: 110, stock: 1 }, { id: "ao_bua", price: 120, stock: 1 });

  /* ---------- KỸ NĂNG CÓ BẬC ---------- */
  const SK_RANK = {
    sk_punch: "E", sk_guard: "E", sk_cefist: "E", sk_kick: "E", sk_step: "E", sk_bandage: "E",
    sk_delay: "D", sk_heavy: "D", sk_shot: "D", sk_combo: "D", sk_block: "D", sk_pierce: "D", sk_sweep: "D",
    sk_focus: "C", sk_eye: "C", sk_burst: "C", sk_regen: "C", sk_simple: "C",
  };
  Object.assign(D.SKILLS, {
    sk_rct: { name: "Phản chuyển nhập môn", cost: { ce: 60 }, cd: 4, effect: { heal: 0.4 }, desc: "Nhân hai lần chú lực âm để tạo ra năng lượng dương, chữa lành cơ thể: hồi 40% HP. Tốn 60 Chú lực, hồi chiêu 4 lượt." },
    sk_flash: { name: "Thiểm kích", cost: { ce: 40, sta: 20 }, cd: 3, effect: { dmg: { src: "hybrid", mult: 2.6 }, hits: 2 }, desc: "Hai đòn chú lực siêu tốc, mỗi đòn (Tấn công + 0.5×Uy lực) ×2.6. Tốn 40 Chú lực, 20 Thể lực, hồi chiêu 3 lượt." },
    sk_domainhint: { name: "Lãnh địa sơ khởi", cost: { ce: 90 }, cd: 6, effect: { dmg: { src: "cpow", mult: 4.5 }, sure: true, debuff: { stat: "atk", pct: 0.35, turns: 3, label: "giảm 35% tấn công" } }, desc: "Phác họa lãnh địa chưa hoàn chỉnh: Uy lực ×4.5, không thể né, giảm 35% tấn công mục tiêu 3 lượt. Tốn 90 Chú lực, hồi chiêu 6 lượt." },
  });
  Object.assign(SK_RANK, { sk_rct: "B", sk_flash: "A", sk_domainhint: "S" });
  D.SKILL_SHOP.push(
    { id: "sk_rct", cur: "sp", price: 400, req: { rank: "B", level: 35, WIS: 30 }, by: "Hệ thống" },
    { id: "sk_flash", cur: "sp", price: 800, req: { rank: "A", level: 50 }, by: "Hệ thống" },
    { id: "sk_domainhint", cur: "sp", price: 1600, req: { rank: "S", level: 75 }, by: "Hệ thống" },
  );
  for (const id in D.SKILLS) D.SKILLS[id].rank = SK_RANK[id] || (D.SKILLS[id].tech ? (["tk_anlien", "tk_kinhtran", "tk_truongluc", "tk_luoi", "tk_dongHoa", "tk_lienphat", "tk_vanloi", "tk_ngung"].includes(id) ? "C" : "D") : "E");

  /* ---------- THƯỞNG THĂNG BẬC: cố định + chọn 1 (D → SSS) ---------- */
  const rw = (r, slot, q, aff) => { const id = "rw_" + r + "_" + slot.replace(/\s/g, ""); D.ITEMS[id] = CD.makeGear({ name: SLOT_NAMES[slot][1] + " · Đột phá " + r, slot, rank: r, quality: q, affixes: aff, unique: true, lore: "Phần thưởng đột phá Rank " + r + "." }); return id; };
  const R = D.RANK_REWARDS;
  R.D.choices.push({ name: "Trang bị Đột phá D", desc: "Nhận " + D.ITEMS[rw("D", "Vũ khí", "Sử thi", [0])].name + ".", eff: { item: "rw_D_Vũkhí" } });
  const baseC = R.C.choices;
  R.C.choices = (s) => baseC(s).concat([{ name: "Trang bị Đột phá C", desc: "Nhận " + D.ITEMS["rw_C_Giáp"].name + ".", eff: { item: "rw_C_Giáp" } }]);
  rw("C", "Giáp", "Sử thi", [4]);
  const tech3 = (s) => s.technique && D.TECH3[s.technique];
  const tier = (r, sp, yen, stats, points, gearSlot, q, aff, skill) => {
    const gid = rw(r, gearSlot, q, aff);
    R[r] = { fixed: { sp, yen, achievement: "a_rank" + r, rep: { tokyo: 10 } },
      choices: (s) => [
        { name: "Thể phách Bậc " + r, desc: Object.entries(stats).map(([k, v]) => k + " +" + v).join(", ") + " (cơ bản, vĩnh viễn).", eff: { base: stats } },
        { name: "Tiềm năng Bậc " + r, desc: "+" + points + " điểm chỉ số tự do.", eff: { points } },
        { name: "Trang bị Đột phá " + r, desc: "Nhận " + D.ITEMS[gid].name + ": " + Object.entries(D.ITEMS[gid].stats).map(([k, v]) => k + " +" + v).join(", ") + (D.ITEMS[gid].mods ? " · " + CD.affixText(D.ITEMS[gid].mods) : "") + ".", eff: { item: gid } },
        { name: "Bí truyền Bậc " + r, desc: "Học ngay " + D.SKILLS[skill].name + " (Bậc " + D.SKILLS[skill].rank + ") miễn phí.", eff: { skill } },
      ] };
  };
  tier("B", 600, 300000, { STR: 3, AGI: 3, VIT: 3, INT: 3, WIS: 3 }, 15, "Phụ kiện", "Huyền thoại", [0, 2], "sk_rct");
  tier("A", 1200, 600000, { STR: 5, AGI: 5, VIT: 5, INT: 5, WIS: 5 }, 25, "Vũ khí", "Huyền thoại", [5, 0], "sk_flash");
  tier("S", 2500, 1500000, { STR: 8, AGI: 8, VIT: 8, INT: 8, WIS: 8, LUK: 4 }, 40, "Giáp", "Thần thoại", [4, 1], "sk_domainhint");
  tier("SS", 5000, 4000000, { STR: 12, AGI: 12, VIT: 12, INT: 12, WIS: 12, LUK: 6 }, 60, "Găng tay", "Thần thoại", [6, 5, 0], "sk_domainhint");
  tier("SSS", 10000, 10000000, { STR: 18, AGI: 18, VIT: 18, INT: 18, WIS: 18, LUK: 10 }, 90, "Phụ kiện", "Độc nhất", [0, 2, 6], "sk_domainhint");
  Object.assign(D.ACHIEVEMENTS, { a_rankB: "Chú thuật sư Bán cấp 1", a_rankA: "Chú thuật sư Cấp 1", a_rankS: "Đặc cấp", a_rankSS: "Siêu việt", a_rankSSS: "Thiên thượng" });
  // Thưởng cố định D, C có thêm Điểm Hệ thống & yên rõ ràng (đã khai báo trong world.js)

  CD.RANK_BUDGET = RANK_BUDGET;
})(typeof window !== "undefined" ? window : globalThis);
