/* =====================================================================
   CURSED DESTINY — CORE ENGINE
   Theo "MASTER PROMPT: UNIVERSAL MULTIVERSE RPG ENGINE" (Mode B: Web RPG)
   File này không phụ thuộc DOM: chạy được cả trên trình duyệt lẫn Node (unit test).
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {});
  const D = () => CD.DATA; // dữ liệu nạp từ data.js

  /* ---------- PHẦN IV: LEVEL & EXP ---------- */
  CD.STATS = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"];
  CD.STAT_NAME = { STR: "Sức mạnh", AGI: "Nhanh nhẹn", VIT: "Thể chất", INT: "Trí tuệ", WIS: "Minh triết", LUK: "May mắn" };
  CD.POINTS_PER_LEVEL = 5;
  CD.expRequired = (L) => Math.floor(100 * Math.pow(L, 1.5));

  /* ---------- PHẦN V: RANK (ánh xạ sang cấp chú thuật sư — World Rule) ---------- */
  CD.RANKS = ["E", "D", "C", "B", "A", "S", "SS", "SSS"];
  CD.RANK_INFO = {
    E: { grade: "Cấp 4", minLv: 1 },
    D: { grade: "Cấp 3", minLv: 8 },
    C: { grade: "Cấp 2", minLv: 20 },
    B: { grade: "Bán cấp 1", minLv: 35 },
    A: { grade: "Cấp 1", minLv: 50 },
    S: { grade: "Đặc cấp", minLv: 75 },
    SS: { grade: "Đặc cấp · Siêu việt", minLv: 105 },
    SSS: { grade: "Thiên thượng", minLv: 125 },
  };
  CD.rankIndex = (r) => CD.RANKS.indexOf(r);

  /* ---------- PHẦN X: THIỆN–ÁC 7 BẬC ---------- */
  CD.MORAL_TIERS = [
    { id: "ma", name: "Ma Đạo", min: -100, max: -60, bonus: { STR: 3, AGI: 2 }, perk: "Mạng lưới chú nguyền sư mở cửa; bị Thượng tầng truy nã." },
    { id: "hac", name: "Hắc Ám", min: -59, max: -30, bonus: { STR: 2, AGI: 1 }, perk: "Chú nguyền sư chịu đàm phán; đồng đội dè chừng." },
    { id: "lac", name: "Lạc Lối", min: -29, max: -10, bonus: { STR: 1 }, perk: "Một số NPC bắt đầu nghi ngờ động cơ của Shen." },
    { id: "trung", name: "Trung Lập", min: -9, max: 9, bonus: {}, perk: "Không thưởng, không phạt." },
    { id: "chinh", name: "Chính Trực", min: 10, max: 29, bonus: { WIS: 1 }, perk: "Dân thường dễ tin tưởng hơn." },
    { id: "hiep", name: "Hiệp Nghĩa", min: 30, max: 59, bonus: { WIS: 2, VIT: 1 }, perk: "Học viện Tokyo sẵn lòng giao nhiệm vụ quan trọng." },
    { id: "thanh", name: "Thánh Tâm", min: 60, max: 100, bonus: { WIS: 3, VIT: 2 }, perk: "Mở khóa nhánh thuật thức hướng bảo hộ." },
  ];
  CD.moralTier = (score) => CD.MORAL_TIERS.find((t) => score >= t.min && score <= t.max) || CD.MORAL_TIERS[3];

  CD.FACTIONS = {
    tokyo: "Cao đẳng Chú thuật Tokyo",
    kyoto: "Cao đẳng Chú thuật Kyoto",
    thuongtang: "Thượng tầng giới Chú thuật",
    ngutamgia: "Ngự tam gia",
    chulinh: "Chú linh & Chú nguyền sư",
    danthuong: "Dân thường",
  };

  /* ---------- PHẦN III: TRẠNG THÁI CHIẾN DỊCH ---------- */
  CD.SAVE_VERSION = 2;
  CD.newCampaign = function () {
    const s = {
      version: CD.SAVE_VERSION,
      campaignId: "cd-" + Date.now().toString(36),
      world: { name: "Chú Thuật Hồi Chiến", arc: "arc0" },
      time: { day: 1, label: "Tháng 6, 2018" },
      scene: "p_intro",
      player: { name: "Shen", age: 15 },
      level: 1, exp: 0, rank: "E", unallocated: 0, autoAllocate: false,
      base: { STR: 5, AGI: 5, VIT: 5, INT: 5, WIS: 5, LUK: 5 },
      bonusSources: [], // {src, stats:{}} — ghi riêng từng nguồn (mục 4.2)
      cur: { hp: 0, ce: 0, sta: 0 },
      traits: [], technique: null, restriction: null, systemOnline: false,
      skills: ["sk_punch", "sk_guard"],
      inventory: [], equipment: {},
      currency: { yen: 3000, sp: 0 }, // sp = Điểm Hệ thống
      moral: 0, anti: 0,
      rep: Object.fromEntries(Object.keys(CD.FACTIONS).map((k) => [k, 0])),
      rel: {},
      quests: {}, achievements: [],
      flags: [], traces: {},
      milestonesHit: [],
      ledger: [], txDone: [], log: [],
      known: [],
    };
    CD.recalc(s, true);
    return s;
  };

  /* ---------- PHẦN VI: CHỈ SỐ HIỆU DỤNG ---------- */
  CD.effective = function (s, extraBuffs) {
    const out = { ...s.base };
    const breakdown = {};
    CD.STATS.forEach((k) => (breakdown[k] = [{ src: "Cơ bản", v: s.base[k] }]));
    const add = (src, stats) => {
      for (const k in stats) if (k in out) { out[k] += stats[k]; breakdown[k].push({ src, v: stats[k] }); }
    };
    s.bonusSources.forEach((b) => add(b.src, b.stats));
    (s.traits || []).forEach((id) => { const t = D().TRAITS[id]; if (t && t.stats) add("Đặc tính: " + t.name, t.stats); });
    if (s.restriction) { const r = D().RESTRICTIONS[s.restriction]; if (r && r.stats) add("Thiên dữ: " + r.name, r.stats); }
    for (const slot in s.equipment) { const it = D().ITEMS[s.equipment[slot]]; if (it && it.stats) add("Trang bị: " + it.name, it.stats); }
    const tier = CD.moralTier(s.moral); if (tier.bonus) add("Thiện–Ác: " + tier.name, tier.bonus);
    // Đặc tính cá nhân: nhân hệ số SAU khi cộng thẳng, làm tròn xuống (World Rule)
    const mult = CD.traitMults(s);
    CD.STATS.forEach((k) => {
      if (mult[k] !== 1) {
        const before = out[k]; out[k] = Math.floor(before * mult[k]);
        breakdown[k].push({ src: "Hệ số đặc tính ×" + +mult[k].toFixed(3), v: out[k] - before, mult: mult[k] });
      }
    });
    if (extraBuffs) add("Hiệu ứng tạm thời", extraBuffs);
    CD.STATS.forEach((k) => (out[k] = Math.max(0, out[k])));
    return { stats: out, breakdown };
  };

  /* Hệ số chỉ số từ đặc tính (nhân với nhau nếu nhiều đặc tính cùng tăng một chỉ số) */
  CD.traitMults = function (s) {
    const m = { STR: 1, AGI: 1, VIT: 1, INT: 1, WIS: 1, LUK: 1 };
    (s.traits || []).forEach((id) => { const t = D().TRAITS[id]; if (t && t.mult) for (const k in t.mult) m[k] *= t.mult[k]; });
    return m;
  };

  /* hệ số từ đặc tính / Thiên dữ (ghi trong World Rules) */
  CD.mods = function (s) {
    const m = { hpMult: 1, ceMult: 1, ceRegen: 2, staRegen: 5, expMult: 1, critBonus: 0, evaBonus: 0, dmgPhys: 1, dmgCurse: 1, techHpCost: 0 };
    const apply = (o) => o && o.mods && Object.entries(o.mods).forEach(([k, v]) => {
      if (k.endsWith("Mult") || k.startsWith("dmg")) m[k] *= v; else m[k] += v;
    });
    (s.traits || []).forEach((id) => apply(D().TRAITS[id]));
    if (s.restriction) apply(D().RESTRICTIONS[s.restriction]);
    return m;
  };

  /* Công thức phái sinh mặc định — mục 6.5 (MP → Chú lực) */
  CD.derive = function (stats, L, m) {
    m = m || { hpMult: 1, ceMult: 1, critBonus: 0, evaBonus: 0 };
    const { STR, AGI, VIT, INT, WIS } = stats;
    return {
      maxHP: Math.floor((100 + 20 * VIT + 5 * L) * m.hpMult),
      maxCE: Math.floor((20 + 10 * INT + 10 * WIS) * m.ceMult),
      maxSTA: 50 + 10 * VIT + 5 * AGI,
      patk: 2 * STR + 0.5 * AGI,
      cpow: 2 * INT + WIS,
      pdef: 0.5 * VIT + 0.25 * STR,
      cdef: 0.5 * WIS + 0.25 * INT, // World Rule: phòng thủ chú lực
      evasion: Math.min(0.4, (0.4 * AGI) / (AGI + 100)) + (m.evaBonus || 0),
      crit: 0.05 + Math.min(0.2, AGI / 500) + (m.critBonus || 0),
      speed: 1 + AGI / 200,
    };
  };
  CD.derived = (s) => CD.derive(CD.effective(s).stats, s.level, CD.mods(s));

  CD.recalc = function (s, fill) {
    const d = CD.derived(s);
    if (fill) { s.cur.hp = d.maxHP; s.cur.ce = d.maxCE; s.cur.sta = d.maxSTA; }
    s.cur.hp = Math.min(s.cur.hp, d.maxHP);
    s.cur.ce = Math.min(s.cur.ce, d.maxCE);
    s.cur.sta = Math.min(s.cur.sta, d.maxSTA);
    return d;
  };

  /* Mốc chỉ số ẩn — mục 6.3 */
  CD.MILESTONES = [10, 20, 50, 100, 200, 500];
  CD.checkMilestones = function (s) {
    const msgs = [], eff = CD.effective(s).stats;
    CD.STATS.forEach((k) => CD.MILESTONES.forEach((n) => {
      const key = k + "@" + n;
      if (eff[k] >= n && !s.milestonesHit.includes(key)) {
        s.milestonesHit.push(key);
        const r = D().MILESTONE_REWARDS[key];
        if (r) { msgs.push("Mốc ẩn " + k + " " + n + ": " + r.text); if (r.skill && !s.skills.includes(r.skill)) s.skills.push(r.skill); }
        else msgs.push("Đạt mốc " + k + " " + n + ".");
      }
    }));
    return msgs;
  };

  /* Tăng cấp tự động — mục 4.3 / 4.4 */
  CD.gainExp = function (s, amount) {
    const m = CD.mods(s);
    const gained = Math.floor(amount * m.expMult);
    s.exp += gained;
    const msgs = ["+" + gained + " EXP" + (m.expMult !== 1 ? " (" + amount + " × " + m.expMult + ")" : "")];
    while (s.exp >= CD.expRequired(s.level)) {
      const need = CD.expRequired(s.level);
      s.exp -= need;
      s.level++;
      s.unallocated += CD.POINTS_PER_LEVEL;
      msgs.push("LÊN CẤP " + s.level + "! (−" + need + " EXP, +" + CD.POINTS_PER_LEVEL + " điểm chỉ số)");
    }
    const d = CD.recalc(s);
    if (msgs.length > 1) { s.cur.hp = d.maxHP; s.cur.ce = d.maxCE; s.cur.sta = d.maxSTA; }
    msgs.push(...CD.checkMilestones(s));
    return msgs;
  };

  CD.allocate = function (s, stat, n) {
    n = n || 1;
    if (!CD.STATS.includes(stat) || s.unallocated < n) return false;
    s.base[stat] += n; s.unallocated -= n;
    CD.recalc(s);
    return true;
  };

  /* Đột phá Rank — mục 5.2: cần Level + thử thách, không tự động */
  CD.rankCheck = function (s) {
    const i = CD.rankIndex(s.rank);
    if (i >= CD.RANKS.length - 1) return { can: false, next: null };
    const next = CD.RANKS[i + 1], info = CD.RANK_INFO[next];
    const lvOk = s.level >= info.minLv, trialOk = s.flags.includes("trial_" + next);
    return { can: lvOk && trialOk, next, lvOk, trialOk, minLv: info.minLv };
  };
  CD.rankUp = function (s) {
    const c = CD.rankCheck(s);
    if (!c.can) return null;
    s.rank = c.next;
    CD.addLedger(s, { action: "Đột phá lên Rank " + c.next, consequence: "Được công nhận " + CD.RANK_INFO[c.next].grade });
    return c.next;
  };

  /* ---------- PHẦN XI: NHÂN QUẢ ---------- */
  CD.addLedger = function (s, e) {
    s.ledger.push({ id: "EV" + String(s.ledger.length + 1).padStart(4, "0"), day: s.time.day, arc: s.world.arc, ...e });
  };

  /* ---------- VẬT PHẨM & TRANG BỊ ---------- */
  CD.itemScore = (it) => Object.values(it.stats || {}).reduce((a, b) => a + b, 0);
  CD.canEquip = function (s, it) {
    if (!it.slot) return false;
    if (it.req) {
      if (it.req.level && s.level < it.req.level) return false;
      if (it.req.rank && CD.rankIndex(s.rank) < CD.rankIndex(it.req.rank)) return false;
    }
    return true;
  };
  CD.addItem = function (s, id, qty) {
    const it = D().ITEMS[id]; if (!it) return ["Vật phẩm không tồn tại: " + id];
    if (it.unique && (s.inventory.some((x) => x.id === id) || Object.values(s.equipment).includes(id))) return [it.name + " là độc nhất, không nhận lặp."];
    const ex = s.inventory.find((x) => x.id === id);
    if (ex && it.stack) ex.qty += qty || 1; else s.inventory.push({ id, qty: qty || 1 });
    const msgs = ["Nhận: " + it.name + (qty > 1 ? " ×" + qty : "")];
    // Tự động mặc trang bị tốt hơn (tùy chọn người chơi)
    if (it.slot && CD.canEquip(s, it)) {
      const curId = s.equipment[it.slot], cur = curId && D().ITEMS[curId];
      if (!cur || CD.itemScore(it) > CD.itemScore(cur)) msgs.push(...CD.equip(s, id));
    }
    return msgs;
  };
  CD.equip = function (s, id) {
    const it = D().ITEMS[id];
    if (!it || !CD.canEquip(s, it)) return ["Chưa đủ điều kiện trang bị."];
    const before = CD.derived(s), beforeStats = CD.effective(s).stats;
    const old = s.equipment[it.slot];
    const idx = s.inventory.findIndex((x) => x.id === id);
    if (idx < 0) return ["Không có vật phẩm này."];
    s.inventory[idx].qty--; if (s.inventory[idx].qty <= 0) s.inventory.splice(idx, 1);
    if (old) CD.addItemRaw(s, old);
    s.equipment[it.slot] = id;
    const after = CD.recalc(s), afterStats = CD.effective(s).stats;
    const diff = [];
    CD.STATS.forEach((k) => beforeStats[k] !== afterStats[k] && diff.push(k + " " + beforeStats[k] + "→" + afterStats[k]));
    [["maxHP", "HP tối đa"], ["maxCE", "Chú lực tối đa"], ["maxSTA", "Thể lực tối đa"], ["patk", "Tấn công"], ["cpow", "Uy lực chú lực"], ["pdef", "Giáp"], ["cdef", "Kháng chú"]]
      .forEach(([k, n]) => before[k] !== after[k] && diff.push(n + " " + fmt(before[k]) + "→" + fmt(after[k])));
    return ["Trang bị " + it.name + (diff.length ? " · " + diff.join(", ") : "")];
  };
  CD.addItemRaw = function (s, id) {
    const ex = s.inventory.find((x) => x.id === id);
    if (ex && D().ITEMS[id].stack) ex.qty++; else s.inventory.push({ id, qty: 1 });
  };
  CD.useItem = function (s, id) {
    const it = D().ITEMS[id], slot = s.inventory.find((x) => x.id === id);
    if (!it || !slot || !it.use) return null;
    const d = CD.derived(s), msgs = [];
    if (it.use.hp) { const b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + it.use.hp); msgs.push("HP " + b + "→" + s.cur.hp); }
    if (it.use.ce) { const b = s.cur.ce; s.cur.ce = Math.min(d.maxCE, s.cur.ce + it.use.ce); msgs.push("Chú lực " + b + "→" + s.cur.ce); }
    slot.qty--; if (slot.qty <= 0) s.inventory.splice(s.inventory.indexOf(slot), 1);
    return "Dùng " + it.name + ": " + msgs.join(", ");
  };
  const fmt = (n) => (Math.round(n * 100) / 100).toString();
  CD.fmt = fmt;

  /* ---------- HIỆU ỨNG CỐT TRUYỆN (có mã giao dịch chống nhận lặp — mục 3.1) ---------- */
  CD.applyEff = function (s, eff, tx) {
    if (!eff) return [];
    if (tx) { if (s.txDone.includes(tx)) return []; s.txDone.push(tx); }
    const msgs = [];
    if (eff.trace) for (const k in eff.trace) s.traces[k] = (s.traces[k] || 0) + eff.trace[k]; // ẩn với người chơi
    if (eff.base) for (const k in eff.base) { s.base[k] += eff.base[k]; msgs.push(k + " +" + eff.base[k]); }
    if (eff.moral) { const b = CD.moralTier(s.moral).name; s.moral = Math.max(-100, Math.min(100, s.moral + eff.moral)); const a = CD.moralTier(s.moral).name; if (a !== b) msgs.push("Thiện–Ác chuyển sang: " + a); }
    if (eff.anti) s.anti = Math.max(0, Math.min(100, s.anti + eff.anti));
    if (eff.rep) for (const k in eff.rep) { s.rep[k] = (s.rep[k] || 0) + eff.rep[k]; msgs.push("Danh vọng " + CD.FACTIONS[k] + " " + (eff.rep[k] > 0 ? "+" : "") + eff.rep[k]); }
    if (eff.rel) for (const k in eff.rel) { s.rel[k] = Math.max(-100, Math.min(100, (s.rel[k] || 0) + eff.rel[k])); const n = D().NPCS[k]; msgs.push("Quan hệ " + (n ? n.name : k) + " " + (eff.rel[k] > 0 ? "+" : "") + eff.rel[k]); }
    if (eff.flag) [].concat(eff.flag).forEach((f) => !s.flags.includes(f) && s.flags.push(f));
    if (eff.known) [].concat(eff.known).forEach((f) => !s.known.includes(f) && s.known.push(f));
    if (eff.quest) [].concat(eff.quest).forEach((q) => {
      const def = D().QUESTS[q.id]; s.quests[q.id] = q.status;
      msgs.push((q.status === "done" ? "Hoàn thành nhiệm vụ: " : "Nhiệm vụ mới: ") + (def ? def.name : q.id));
    });
    if (eff.item) [].concat(eff.item).forEach((i) => msgs.push(...CD.addItem(s, i.id || i, i.qty || 1)));
    if (eff.skill) [].concat(eff.skill).forEach((k) => { if (!s.skills.includes(k)) { s.skills.push(k); msgs.push("Học kỹ năng: " + D().SKILLS[k].name); } });
    if (eff.yen) { s.currency.yen += eff.yen; msgs.push("Yên " + (eff.yen > 0 ? "+" : "") + eff.yen + " = " + s.currency.yen); }
    if (eff.sp) { const b = s.currency.sp; s.currency.sp += eff.sp; msgs.push("Điểm Hệ thống " + b + " + " + eff.sp + " = " + s.currency.sp); }
    if (eff.heal) { const d = CD.derived(s); if (eff.heal === "full") { s.cur.hp = d.maxHP; s.cur.ce = d.maxCE; s.cur.sta = d.maxSTA; } else s.cur.hp = Math.min(d.maxHP, s.cur.hp + eff.heal); }
    if (eff.time) { s.time.day += eff.time.days || 0; if (eff.time.label) s.time.label = eff.time.label; }
    if (eff.arc) s.world.arc = eff.arc;
    if (eff.ledger) CD.addLedger(s, eff.ledger);
    if (eff.achievement && !s.achievements.includes(eff.achievement)) { s.achievements.push(eff.achievement); msgs.push("Thành tựu: " + D().ACHIEVEMENTS[eff.achievement]); }
    if (eff.exp) msgs.push(...CD.gainExp(s, eff.exp));
    CD.recalc(s);
    if (eff.hpSet) s.cur.hp = Math.min(s.cur.hp, eff.hpSet);
    return msgs;
  };

  /* ---------- ĐIỀU HƯỚNG CẢNH (dùng chung cho UI và kiểm thử) ---------- */
  CD.enterScene = function (s, id) {
    const sc = CD.SCENES[id]; if (!sc) return ["Không tìm thấy cảnh " + id];
    s.scene = id;
    const msgs = CD.applyEff(s, sc.onEnter, "enter_" + id);
    (sc.conds || []).forEach((c, i) => { if (CD.meets(s, c.req)) msgs.push(...CD.applyEff(s, c.eff, "cond_" + id + "_" + i)); });
    return msgs;
  };
  CD.choose = function (s, id, idx) {
    const ch = CD.SCENES[id].choices[idx];
    if (!ch || !CD.meets(s, ch.req)) return null;
    return { msgs: CD.applyEff(s, ch.eff, "choice_" + id + "_" + idx), go: ch.go };
  };
  CD.pickTraits = function (s, ids) {
    if (s.traits.length || ids.length !== 2 || ids[0] === ids[1]) return false;
    s.traits = ids.slice(); CD.recalc(s, true); return true;
  };
  CD.answerInterview = function (s, qi, ai) {
    const a = D().INTERVIEW[qi].a[ai];
    return CD.applyEff(s, { trace: a.trace, moral: a.moral, anti: a.anti }, "iv_" + qi);
  };
  CD.setRestriction = function (s, id) {
    if (s.restriction || s.flags.includes("restriction_decided")) return false;
    s.flags.push("restriction_decided");
    if (id) { s.restriction = id; CD.addLedger(s, { action: "Ký Khế ước Thiên dữ: " + D().RESTRICTIONS[id].name, consequence: "Khế ước khắc vào cơ thể, không thể hủy" }); }
    CD.recalc(s, true); return true;
  };
  CD.tryRankScene = function (s) {
    const c = CD.rankCheck(s);
    if (!c.can) return ["[Hệ thống: Chưa đủ điều kiện đột phá Rank " + c.next + ". " + (c.lvOk ? "" : "Cần Lv " + c.minLv + " (hiện tại Lv " + s.level + "). ") + (c.trialOk ? "" : "Chưa hoàn thành sát hạch.") + "]"];
    const r = CD.rankUp(s), msgs = ["ĐỘT PHÁ: Rank " + r + " — " + CD.RANK_INFO[r].grade];
    if (r === "D") msgs.push(...CD.applyEff(s, { item: "huy_hieu3", achievement: "a_rankD", rep: { tokyo: 5 } }, "rank_D"));
    return msgs;
  };

  CD.meets = function (s, req) {
    if (!req) return true;
    const eff = CD.effective(s).stats;
    for (const k in req) {
      if (CD.STATS.includes(k) && eff[k] < req[k]) return false;
      if (k === "level" && s.level < req.level) return false;
      if (k === "flag" && !s.flags.includes(req.flag)) return false;
      if (k === "notFlag" && s.flags.includes(req.notFlag)) return false;
      if (k === "technique" && !s.technique) return false;
      if (k === "moralMin" && s.moral < req.moralMin) return false;
    }
    return true;
  };
  CD.reqText = function (req) {
    if (!req) return "";
    return Object.entries(req).map(([k, v]) =>
      CD.STATS.includes(k) ? k + " ≥ " + v : k === "level" ? "Lv ≥ " + v : k === "technique" ? "Cần thuật thức" : k === "moralMin" ? "Thiện–Ác ≥ " + v : "").filter(Boolean).join(", ");
  };

  /* ---------- PHẦN VII: GỢI Ý THUẬT THỨC TỪ DẤU VẾT ---------- */
  CD.suggestTechniques = function (s, n) {
    const T = D().TECHNIQUES;
    return Object.keys(T).map((id) => ({
      id, score: Object.entries(T[id].weights).reduce((a, [k, w]) => a + w * (s.traces[k] || 0), 0),
    })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, n || 3).map((x) => x.id);
  };
  CD.setTechnique = function (s, id) {
    const t = D().TECHNIQUES[id];
    s.technique = id;
    t.tier1.skills.forEach((k) => !s.skills.includes(k) && s.skills.push(k));
    CD.addLedger(s, { action: "Thức tỉnh thuật thức: " + t.name, consequence: "Mở cây tiến hóa 4 bậc" });
    CD.recalc(s, true);
  };

  /* ---------- PHẦN VI.6: CHIẾN ĐẤU ---------- */
  CD.CURSE_HP_MULT = 1.5;
  CD.makeFighter = function (npcId) {
    const n = D().NPCS[npcId];
    const d = CD.derive(n.stats, n.lv);
    if (npcId.startsWith("c_")) d.maxHP = Math.floor(d.maxHP * CD.CURSE_HP_MULT); // World Rule: chú linh bền hơn
    return { id: npcId, name: n.name, rank: n.rank, lv: n.lv, stats: n.stats, d, hp: d.maxHP, ce: d.maxCE, skills: n.skills || [], exp: n.exp || 0, cds: {}, debuff: [], marks: 0, stun: 0 };
  };

  /* Thứ tự tính sát thương (cố định cả chiến dịch):
     Raw = Atk × Mult → trừ Def (tối thiểu 1) → chí mạng ×1.5 → hệ số yếu/kháng → làm tròn xuống */
  CD.calcDamage = function (atk, mult, def, opts) {
    opts = opts || {};
    const raw = atk * mult * (opts.mod || 1);
    let dmg = Math.max(1, raw - def);
    if (opts.crit) dmg *= 1.5;
    if (opts.weak) dmg *= opts.weak;
    return Math.floor(dmg);
  };

  CD.combat = {
    start(s, enemyIds, opts) {
      CD.recalc(s);
      const enemies = enemyIds.map(CD.makeFighter);
      if (opts && opts.weakenFlag && s.flags.includes(opts.weakenFlag)) enemies.forEach((e) => (e.hp = Math.floor(e.hp * 0.7)));
      return {
        enemies, round: 1, log: [], cds: {}, buffs: [],
        guard: false, stored: 0, reflectArmed: false, ychiUsed: false, opts: opts || {}, over: null, observed: [],
      };
    },
    target(c) { return c.enemies.find((e) => e.hp > 0); },
    ready(s, c) {
      return s.skills.map((k) => ({ id: k, sk: D().SKILLS[k], cd: c.cds[k] || 0 }))
        .filter((x) => x.sk && x.sk.combat !== false);
    },
    affordable(s, sk) {
      if (sk.cost && sk.cost.ce && s.cur.ce < sk.cost.ce) return false;
      if (sk.cost && sk.cost.sta && s.cur.sta < sk.cost.sta) return false;
      return true;
    },
    observe(s, c, e) {
      const me = CD.rankIndex(s.rank), it = CD.rankIndex(e.rank);
      const full = it <= me + 1 || s.traits.includes("tamnhan") && it <= me + 2;
      if (!c.observed.includes(e.id)) c.observed.push(e.id);
      return { full, gap: CD.powerGap(s, e) };
    },
    playerAct(s, c, action, rng) {
      rng = rng || Math.random;
      if (c.over) return;
      const m = CD.mods(s), eff = CD.effective(s).stats, d = CD.derive(eff, s.level, m);
      const t = this.target(c);
      const L = c.log; L.length = 0;
      c.guard = false;
      if (action.type === "flee") {
        const p = Math.min(0.9, 0.3 + (eff.AGI - t.stats.AGI) * 0.03);
        if (!c.opts.canFlee) { L.push("Không có đường thoát."); }
        else if (rng() < p) { L.push("Shen thoát khỏi trận chiến."); c.over = "flee"; return; }
        else L.push("Bỏ chạy thất bại (" + Math.round(p * 100) + "%).");
      } else if (action.type === "item") {
        L.push(CD.useItem(s, action.id) || "Không dùng được.");
      } else if (action.type === "skill") {
        const sk = D().SKILLS[action.id];
        if ((c.cds[action.id] || 0) > 0 || !this.affordable(s, sk)) { L.push("Kỹ năng chưa sẵn sàng."); return; }
        if (sk.cost) {
          if (sk.cost.ce) s.cur.ce -= sk.cost.ce;
          if (sk.cost.sta) s.cur.sta -= sk.cost.sta;
        }
        if (sk.tech && m.techHpCost) { const loss = Math.floor(s.cur.hp * m.techHpCost); s.cur.hp = Math.max(1, s.cur.hp - loss); L.push("Khế ước Mệnh Đổi Mệnh: −" + loss + " HP."); }
        if (sk.cd) c.cds[action.id] = sk.cd + 1;
        this.resolveSkill(s, c, sk, t, d, m, rng);
      }
      this.after(s, c, rng);
    },
    resolveSkill(s, c, sk, t, d, m, rng) {
      const L = c.log, e = sk.effect || {};
      if (e.guard) { c.guard = true; L.push("Shen thủ thế, giảm 50% sát thương lượt này."); }
      if (e.store) { c.reflectArmed = true; L.push("Mặt gương chú lực dựng lên, sẵn sàng hứng đòn."); }
      if (e.dmg) {
        const teva = Math.min(0.4, (0.4 * t.stats.AGI) / (t.stats.AGI + 100));
        if (!e.sure && rng() < teva) { L.push(t.name + " né được " + sk.name + "."); }
        else {
          let atk = e.dmg.src === "cpow" ? d.cpow : e.dmg.src === "hybrid" ? d.patk + 0.5 * d.cpow : d.patk;
          let mult = e.dmg.mult;
          if (e.detonate) { mult *= 1 + t.marks; L.push("Kích nổ " + t.marks + " ấn."); t.marks = 0; }
          if (e.release) { atk += c.stored; L.push("Trả lại " + c.stored + " sát thương đã hứng."); c.stored = 0; }
          const def = e.dmg.src === "patk" ? t.d.pdef : t.d.cdef;
          const crit = rng() < d.crit;
          const mod = (e.dmg.src === "patk" ? m.dmgPhys : m.dmgCurse) * (s.traits.includes("ychi") && s.cur.hp < CD.derived(s).maxHP * 0.25 ? 1.2 : 1);
          const dmg = CD.calcDamage(atk, mult, def, { crit, mod });
          t.hp -= dmg;
          L.push(sk.name + " gây " + dmg + " sát thương" + (crit ? " (CHÍ MẠNG)" : "") + " lên " + t.name + ".");
          if (e.mark) { t.marks = Math.min(3, t.marks + 1); L.push("Ấn khắc trên " + t.name + ": " + t.marks + "/3."); }
          if (e.drain) { const g = Math.floor(dmg * e.drain); s.cur.ce = Math.min(CD.derived(s).maxCE, s.cur.ce + g); L.push("Nuốt " + g + " chú lực."); }
          if (e.debuff) { t.debuff.push({ ...e.debuff }); L.push(t.name + " bị " + e.debuff.label + " trong " + e.debuff.turns + " lượt."); }
        }
      }
      if (e.stun) { if (rng() < e.stun) { t.stun = 1; L.push(t.name + " bị trói, mất lượt kế tiếp."); } else L.push(t.name + " giật đứt sợi chỉ."); }
      if (e.blind) { t.debuff.push({ stat: "hit", pct: e.blind, turns: 2, label: "lóa mắt" }); L.push(t.name + " bị lóa mắt 2 lượt."); }
    },
    after(s, c, rng) {
      const L = c.log;
      c.enemies.forEach((e) => {
        if (e.hp <= 0 && !e.dead) { e.dead = true; L.push(e.name + " bị tiêu diệt."); }
      });
      if (!this.target(c)) { c.over = "win"; return; }
      // Lượt kẻ địch
      c.enemies.filter((e) => e.hp > 0).forEach((e) => {
        if (e.stun) { e.stun = 0; L.push(e.name + " không thể hành động."); return; }
        const sk = (e.skills.find((x) => !e.cds[x.name]) || { name: "Tấn công", mult: 1.2, src: "patk" });
        if (sk.cd) e.cds[sk.name] = sk.cd + 1;
        const pm = CD.mods(s), peff = CD.effective(s).stats, pd = CD.derive(peff, s.level, pm);
        let hitMod = 1; e.debuff.forEach((b) => b.stat === "hit" && (hitMod -= b.pct));
        const miss = rng() > hitMod || rng() < pd.evasion;
        if (miss) { L.push(e.name + " dùng " + sk.name + " nhưng trượt."); return; }
        let atkMod = 1; e.debuff.forEach((b) => b.stat === "atk" && (atkMod -= b.pct));
        const atk = (sk.src === "cpow" ? e.d.cpow : e.d.patk) * atkMod;
        const def = sk.src === "cpow" ? pd.cdef : pd.pdef;
        let dmg = CD.calcDamage(atk, sk.mult, def, { crit: rng() < e.d.crit });
        if (c.reflectArmed) { const st = Math.floor(dmg * 0.6); c.stored += st; dmg -= st; c.reflectArmed = false; L.push("Gương chú lực hứng " + st + " sát thương."); }
        if (c.guard) dmg = Math.floor(dmg / 2);
        s.cur.hp -= dmg;
        L.push(e.name + " dùng " + sk.name + ": −" + dmg + " HP.");
        if (s.cur.hp <= 0 && s.traits.includes("ychi") && !c.ychiUsed) { s.cur.hp = 1; c.ychiUsed = true; L.push("Ý Chí Bất Khuất: Shen trụ lại với 1 HP!"); }
      });
      // cập nhật thời hạn
      c.enemies.forEach((e) => { e.debuff = e.debuff.filter((b) => --b.turns > 0); for (const k in e.cds) if (e.cds[k] > 0) e.cds[k]--; });
      for (const k in c.cds) if (c.cds[k] > 0) c.cds[k]--;
      const d = CD.derived(s), m = CD.mods(s);
      s.cur.ce = Math.min(d.maxCE, s.cur.ce + m.ceRegen);
      s.cur.sta = Math.min(d.maxSTA, s.cur.sta + m.staRegen);
      if (s.cur.hp <= 0) { s.cur.hp = 0; c.over = "lose"; return; }
      if (c.opts.surviveTurns && c.round >= c.opts.surviveTurns) { c.over = "survive"; return; }
      c.round++;
    },
    /* Kết thúc trận: EXP theo từng kẻ địch, hiệu ứng Thực Chú liệt kê rõ từng con */
    finish(s, c, sceneId) {
      const msgs = [];
      if (c.over === "win" || c.over === "survive") {
        c.enemies.filter((e) => e.dead).forEach((e) => {
          msgs.push(e.name + " (Lv " + e.lv + "): " + e.exp + " EXP");
          if (s.technique === "thucchu") {
            const tx = "devour_" + e.id;
            if (!s.txDone.includes(tx) && CD.rankIndex(e.rank) >= CD.rankIndex(s.rank)) {
              s.txDone.push(tx);
              const st = D().NPCS[e.id].devour || "VIT";
              s.bonusSources.push({ src: "Thực Chú: " + e.name, stats: { [st]: 1 } });
              msgs.push("Thực Chú hấp thụ " + e.name + ": " + st + " +1 (vĩnh viễn)");
            } else msgs.push("Thực Chú: " + e.name + " không còn gì để hấp thụ.");
          }
        });
        const total = c.enemies.filter((e) => e.dead).reduce((a, e) => a + e.exp, 0);
        if (total) msgs.push(...CD.applyEff(s, { exp: total }, "combat_" + sceneId));
      }
      if (c.over === "lose") s.cur.hp = 1;
      CD.recalc(s);
      return msgs;
    },
  };

  /* So sánh tương quan sức mạnh */
  CD.powerScore = (stats, lv, rank) => Object.values(stats).reduce((a, b) => a + b, 0) * 2 + lv * 3 + CD.rankIndex(rank) * 25;
  CD.powerGap = function (s, npc) {
    const me = CD.powerScore(CD.effective(s).stats, s.level, s.rank);
    const it = CD.powerScore(npc.stats, npc.lv, npc.rank);
    const r = it / me;
    if (r >= 4) return { label: "Hủy diệt — không thể đối đầu", cls: "dead", r };
    if (r >= 2) return { label: "Áp đảo — nên tránh giao chiến", cls: "danger", r };
    if (r >= 1.25) return { label: "Vượt trội — cần chiến thuật", cls: "hard", r };
    if (r >= 0.8) return { label: "Ngang sức", cls: "even", r };
    if (r >= 0.4) return { label: "Yếu hơn", cls: "easy", r };
    return { label: "Không đáng kể", cls: "trivial", r };
  };

  /* ---------- LƯU / XUẤT / NHẬP + KIỂM TRA TOÀN VẸN ---------- */
  CD.hash = function (str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); };
  CD.exportSave = function (s) { const body = JSON.stringify(s); return JSON.stringify({ game: "cursed-destiny", v: CD.SAVE_VERSION, sum: CD.hash(body), body }); };
  CD.importSave = function (txt) {
    let o; try { o = JSON.parse(txt); } catch (e) { return { ok: false, err: "Không đọc được dữ liệu. Hãy dán đúng chuỗi đã xuất." }; }
    if (o.game !== "cursed-destiny") return { ok: false, err: "Đây không phải file lưu của Cursed Destiny." };
    if (CD.hash(o.body) !== o.sum) return { ok: false, err: "Dữ liệu đã bị chỉnh sửa hoặc hỏng (sai mã kiểm tra)." };
    const s = JSON.parse(o.body); const errs = CD.validate(s);
    return errs.length ? { ok: false, err: "Dữ liệu lỗi: " + errs.join("; ") } : { ok: true, s };
  };
  CD.validate = function (s) {
    const e = [];
    if (!s || s.version !== CD.SAVE_VERSION) e.push("sai phiên bản lưu");
    if (!s || !s.base) return e.concat("thiếu chỉ số");
    if (s.exp < 0 || s.exp >= CD.expRequired(s.level)) e.push("EXP vượt ngưỡng cấp hiện tại");
    if (s.unallocated < 0) e.push("điểm chưa phân bổ âm");
    if (!CD.RANKS.includes(s.rank)) e.push("Rank không hợp lệ");
    CD.STATS.forEach((k) => (typeof s.base[k] !== "number" || s.base[k] < 0) && e.push("chỉ số " + k + " không hợp lệ"));
    const d = CD.derived(s);
    if (s.cur.hp > d.maxHP) e.push("HP vượt tối đa");
    const uniq = {};
    s.inventory.concat(Object.values(s.equipment).map((id) => ({ id }))).forEach((x) => {
      const it = D().ITEMS[x.id]; if (!it) e.push("vật phẩm lạ " + x.id);
      else if (it.unique) { uniq[x.id] = (uniq[x.id] || 0) + 1; if (uniq[x.id] > 1) e.push("trùng vật phẩm độc nhất " + it.name); }
    });
    if (new Set(s.txDone).size !== s.txDone.length) e.push("trùng mã giao dịch thưởng");
    return e;
  };
})(typeof window !== "undefined" ? window : globalThis);
