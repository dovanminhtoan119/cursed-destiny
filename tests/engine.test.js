/* Chạy: node tests/engine.test.js  — unit test công thức + chơi thử tự động toàn bộ Arc 1 */
require("../js/data.js"); require("../js/world.js"); require("../js/gear.js"); require("../js/domain.js"); require("../js/story.js"); require("../js/story2.js"); require("../js/engine.js");
const CD = globalThis.CD;
let pass = 0, fail = 0, D2;
const eq = (name, a, b) => { if (JSON.stringify(a) === JSON.stringify(b)) pass++; else { fail++; console.log("FAIL", name, "→", a, "≠", b); } };
const ok = (name, c) => eq(name, !!c, true);

/* ---- Phần IV: EXP ---- */
[[1, 100], [2, 282], [3, 519], [4, 800], [5, 1118], [10, 3162], [20, 8944], [50, 35355], [100, 100000]].forEach(([l, v]) => eq("EXP Lv" + l, CD.expRequired(l), v));
{ const s = CD.newCampaign(); s.level = 5; s.exp = 0; CD.gainExp(s, 2500);
  // 5→6 cần 1118, dư 1382; 6→7 cần 1469 → dừng ở Lv6 với 1382
  eq("tăng cấp liên tiếp giữ EXP dư", [s.level, s.exp, s.unallocated], [6, 1382, 5]); }
{ const s = CD.newCampaign(); CD.gainExp(s, 100 + 282 + 519); eq("lên Lv4 chính xác", [s.level, s.exp, s.unallocated], [4, 0, 15]); }

/* ---- Phần VI: chỉ số phái sinh ---- */
{ const d = CD.derive({ STR: 10, AGI: 20, VIT: 10, INT: 5, WIS: 5, LUK: 5 }, 3);
  eq("HP", d.maxHP, 100 + 200 + 15); eq("Chú lực", d.maxCE, 20 + 50 + 50); eq("STA", d.maxSTA, 50 + 100 + 100);
  eq("Tấn công", d.patk, 30); eq("Uy lực", d.cpow, 15); eq("Giáp", d.pdef, 7.5);
  eq("Né", +d.evasion.toFixed(4), +(0.4 * 20 / 120).toFixed(4)); eq("Chí mạng", +d.crit.toFixed(4), 0.09); }
eq("né tối đa 40%", CD.derive({ STR: 1, AGI: 100000, VIT: 1, INT: 1, WIS: 1, LUK: 1 }, 1).evasion < 0.4001, true);
eq("sát thương tối thiểu 1", CD.calcDamage(5, 1, 100), 1);
eq("sát thương chí mạng", CD.calcDamage(20, 2, 10, { crit: true }), 45);

/* ---- Đặc tính, Thiên dữ, trang bị ---- */
{ const s = CD.newCampaign(); ok("chọn 2 đặc tính", CD.pickTraits(s, ["thephach", "chuluc"]));
  eq("không chọn lại", CD.pickTraits(s, ["saomay", "ychi"]), false);
  eq("STR sau đặc tính (5 × 1.25)", CD.effective(s).stats.STR, 6);
  s.base.STR = 20; eq("hệ số tăng theo cấp (20 × 1.25)", CD.effective(s).stats.STR, 25); s.base.STR = 5;
  eq("Chú lực ×1.2", CD.derived(s).maxCE, Math.floor(120 * 1.2));
  CD.setRestriction(s, "xacthit"); eq("Thiên dữ giảm chú lực", CD.derived(s).maxCE, Math.floor(120 * 1.2 * 0.7));
  eq("không ký khế ước 2 lần", CD.setRestriction(s, "tamthan"), false);
  CD.applyEff(s, { item: "bang_tay" }); eq("tự mặc trang bị", s.equipment["Găng tay"], "bang_tay");
  CD.applyEff(s, { item: "dongphuc" }); CD.applyEff(s, { item: "dongphuc" });
  eq("vật phẩm độc nhất không nhân bản", s.inventory.filter((x) => x.id === "dongphuc").length + (s.equipment["Giáp"] === "dongphuc" ? 1 : 0), 1); }
{ const s = CD.newCampaign(); CD.pickTraits(s, ["thephach", "vosu"]); eq("hai hệ số nhân nhau (5 × 1.25 × 1.15)", CD.effective(s).stats.STR, Math.floor(5 * 1.25 * 1.15)); }
eq("đủ 20 đặc tính", Object.keys(CD.DATA.TRAITS).length, 20);
{ const s = CD.newCampaign(); CD.applyEff(s, { exp: 500 }, "tx1"); CD.applyEff(s, { exp: 500 }, "tx1"); eq("chống nhận thưởng lặp", s.level, 3); }

/* ---- Rank không tự động ---- */
{ const s = CD.newCampaign(); s.level = 9; eq("không tự lên Rank", CD.rankCheck(s).can, false); s.flags.push("trial_D"); eq("đủ điều kiện", CD.rankCheck(s).can, true); }

/* ---- Lưu/xuất/nhập ---- */
{ const s = CD.newCampaign(); const txt = CD.exportSave(s); ok("nhập lại được", CD.importSave(txt).ok);
  const bad = JSON.parse(txt); bad.body = bad.body.replace('"level":1', '"level":99'); eq("phát hiện sửa save", CD.importSave(JSON.stringify(bad)).ok, false); }

/* ---- Tương quan sức mạnh ---- */
{ const s = CD.newCampaign(); CD.pickTraits(s, ["thephach", "ychi"]);
  eq("Chú thai = hủy diệt với Lv1", CD.powerGap(s, CD.DATA.NPCS.c_womb).cls, "dead");
  eq("Gojo = hủy diệt", CD.powerGap(s, CD.DATA.NPCS.gojo).cls, "dead");
  ok("Itadori vượt xa Shen Lv1", ["danger", "dead"].includes(CD.powerGap(s, CD.DATA.NPCS.itadori).cls)); }

/* ---- Toàn vẹn cốt truyện: mọi liên kết tồn tại ---- */
const S = CD.SCENES;
Object.entries(S).forEach(([id, sc]) => {
  (sc.choices || []).forEach((c) => ok(id + " → " + c.go, S[c.go]));
  if (sc.combat) { ok(id + " win", S[sc.combat.win]); ok(id + " lose", S[sc.combat.lose]); sc.combat.enemies.forEach((e) => ok("NPC " + e, CD.DATA.NPCS[e])); }
  if (sc.go) ok(id + " go", S[sc.go]);
  (sc.observe || []).forEach((n) => ok("observe " + n, CD.DATA.NPCS[n]));
});

/* ---- Khu tự do, cửa hàng, NPC ---- */
{ const s = CD.newCampaign(); s.flags.push("system"); CD.enterScene(s, "a1_hub1");
  ok("vào khu tự do", s.hub && s.hub.id === "a1_hub1");
  eq("bắt đầu 07:00", CD.clock(s.hub.time), "07:00");
  CD.hubAct(s, "talk", "itadori"); ok("trò chuyện tăng quan hệ", (s.rel.itadori || 0) >= 4); eq("trò chuyện 15 phút", CD.clock(s.hub.time), "07:15");
  CD.hubAct(s, "move", "pho"); eq("di chuyển 15 phút", CD.clock(s.hub.time), "07:30");
  for (let i = 0; i < 5; i++) CD.hubAct(s, "train", "STR");
  eq("giới hạn luyện tập 4 lần", s.base.STR, 9); eq("4 giờ luyện", CD.clock(s.hub.time), "11:30");
  CD.hubAct(s, "spar", "itadori"); eq("chưa đủ thân thì không tốn giờ", CD.clock(s.hub.time), "11:30");
  s.hub.time = CD.DAY_END - 30; const o = CD.hubAct(s, "explore"); ok("không đủ giờ thì từ chối", /Không đủ thời gian/.test(o.msgs[0]));
  CD.hubAdvance(s, 30); eq("quá 23:00 sang ngày mới", [s.hub.daysLeft, CD.clock(s.hub.time)], [2, "07:00"]);
  CD.hubAct(s, "sleep"); eq("đi ngủ sang ngày", s.hub.daysLeft, 1);
  s.currency.sp = 100; const b = CD.buy(s, "system", "tinh_STR"); ok("mua được", b.ok); eq("trừ điểm chính xác", s.currency.sp, 40);
  CD.buy(s, "system", "tinh_STR"); eq("hết hàng sau 2 lần", CD.buy(s, "system", "tinh_STR").ok, false);
  CD.useItem(s, "tinh_STR"); eq("tinh hoa cộng STR", s.base.STR, 10);
  s.currency.yen = 100; eq("không đủ yên", CD.buy(s, "academy", "dao_chu4").ok, false);
  s.rel.itadori = 29; CD.applyEff(s, { rel: { itadori: 1 } }); ok("mốc quan hệ 30", s.txDone.includes("bond_itadori_0"));
  s.currency.yen = 50000; s.currency.sp = 500; s.base.STR = 10;
  ok("học kỹ năng Học viện", CD.learnSkill(s, "sk_kick").ok); eq("trừ yên", s.currency.yen, 42000);
  eq("không học lại", CD.learnSkill(s, "sk_kick").ok, false);
  eq("chưa đủ Lv để nâng cấp", CD.upgradeSkill(s, "sk_kick").ok, false);
  s.level = 4; ok("nâng cấp lên 2", CD.upgradeSkill(s, "sk_kick").ok); eq("giá nâng cấp = 60% × cấp", s.currency.yen, 42000 - 4800); eq("hệ số cấp 2", CD.skillMult(s, "sk_kick"), 1.1);
  eq("Rank chặn kỹ năng", CD.learnSkill(s, "sk_simple").ok, false);
  ok("nâng cấp kỹ năng khởi đầu bằng ĐHT", CD.upgradeSkill(s, "sk_punch").ok); eq("trừ 40 ĐHT", s.currency.sp, 460);
  while (!CD.hubOver(s)) CD.hubAct(s, "sleep"); eq("hết ngày", s.hub.daysLeft, 0);
  eq("hết thời gian tự do thì không học kỹ năng Học viện", CD.learnSkill(s, "sk_bandage").ok, false); }
{ // hiệu ứng mới trong trận
  const s = CD.newCampaign(); s.skills.push("sk_combo", "sk_focus", "sk_bandage"); s.base.AGI = 12; CD.recalc(s, true);
  const c = CD.combat.start(s, ["c_doll"]); const r0 = () => 0.99;
  CD.combat.playerAct(s, c, { type: "skill", id: "sk_combo" }, r0); ok("Liên quyền đánh 2 lần", c.log.filter((l) => /đòn \d\) gây/.test(l)).length === 2);
  s.cur.hp = 50; c.cds = {}; CD.combat.playerAct(s, c, { type: "skill", id: "sk_bandage" }, r0); ok("Băng bó hồi HP", c.log.some((l) => /hồi \d+ HP/.test(l)));
}
{ const s = CD.newCampaign(); s.level = 8; s.flags.push("trial_D"); CD.tryRankScene(s); eq("chờ chọn thưởng", s.pendingRank, "D");
  eq("4 lựa chọn", CD.rankChoices(s).length, 4); const before = s.base.INT; CD.claimRank(s, 1); eq("thưởng Tâm pháp", s.base.INT, before + 2); eq("hết chờ", s.pendingRank, null); }

/* ---- Trang bị Bậc × Phẩm ---- */
{ const g = CD.makeGear({ name: "x", slot: "Vũ khí", rank: "C", quality: "Sử thi", affixes: [0] });
  eq("ngân sách C × Sử thi = round(8 × 1.75)", Object.values(g.stats).reduce((a, b) => a + b, 0), 14);
  eq("thuộc tính phụ chí mạng", g.mods.critBonus, 0.03); eq("cần Rank C", g.req.rank, "C");
  const s = CD.newCampaign(); D2 = CD.DATA; D2.ITEMS.__t = g; s.inventory.push({ id: "__t", qty: 1 });
  eq("không mặc vượt Bậc", CD.canEquip(s, g), false); s.rank = "C"; CD.equip(s, "__t");
  eq("thuộc tính phụ cộng vào hệ số", CD.mods(s).critBonus, 0.03);
  let drops = 0; for (let i = 0; i < 200; i++) if (CD.rollLoot(s, "D", Math.random, true)) drops++; eq("trùm luôn rơi đồ", drops, 200);
  const id = Object.keys(s.genItems)[0]; s.inventory.push({ id, qty: 1 }); const y = s.currency.yen; CD.sellItem(s, id); ok("phân giải ra yên", s.currency.yen > y);
  ok("lưu/nhập giữ đồ sinh ngẫu nhiên", CD.importSave(CD.exportSave(s)).ok);
  s.rank = "D"; s.level = 50; s.currency.sp = 5000; eq("kỹ năng Bậc B bị chặn ở Rank D", CD.learnSkill(s, "sk_rct").ok, false); }
{ const s = CD.newCampaign(); CD.answerInterview(s, 0, 1); CD.answerInterview(s, 1, 2); const t1 = JSON.stringify(s.traces), a1 = s.anti;
  ok("làm lại khảo sát", CD.redoSurvey(s)); eq("dấu vết trở về 0", Object.values(s.traces).every((v) => v === 0), true); eq("anti trả lại", s.anti, 0);
  eq("chỉ làm lại 1 lần", CD.redoSurvey(s), false); eq("khảo sát 10 câu", CD.DATA.INTERVIEW.length, 10);
  ok("mỗi câu 4 lựa chọn", CD.DATA.INTERVIEW.every((q) => q.a.length === 4)); eq("đề xuất 4 thuật thức", CD.suggestTechniques(s, 4).length, 4);
  ok("thuật thức nào cũng có nhánh ẩn", Object.values(CD.DATA.TECHNIQUES).every((t) => t.hidden && t.hiddenHint)); }
ok("mọi Rank D→SSS có thưởng", ["D", "C", "B", "A", "S", "SS", "SSS"].every((r) => CD.DATA.RANK_REWARDS[r]));
ok("mọi kỹ năng có Bậc", Object.values(CD.DATA.SKILLS).every((k) => CD.RANKS.includes(k.rank)));

/* ---- Bành trướng lãnh địa ---- */
{ const s = CD.newCampaign(); CD.setTechnique(s, "trongap");
  eq("chưa đủ điều kiện", CD.domainNext(s).ready, false); eq("không mở được", CD.unlockDomain(s).ok, false);
  s.rank = "B"; s.level = 35; s.base.INT = 40; s.base.WIS = 50; s.currency.sp = 500; CD.recalc(s, true);
  ok("đủ điều kiện cấp 1", CD.domainNext(s).ready); ok("lĩnh ngộ", CD.unlockDomain(s).ok); eq("trừ ĐHT", s.currency.sp, 200); eq("cấp 1", s.domainStage, 1);
  eq("cấp 2 cần Rank A", CD.domainNext(s).checks.find((c) => c.label === "Rank").ok, false);
  const c = CD.combat.start(s, ["c_tunnel"]); const ce0 = s.cur.ce; const r = () => 0.5;
  CD.combat.playerAct(s, c, { type: "domain" }, r); ok("triển khai lãnh địa", c.domainUsed && s.cur.ce < ce0);
  ok("lãnh địa gây sát thương mỗi lượt", c.log.some((l) => /Lãnh địa gây/.test(l)));
  eq("không dùng lần 2", CD.canDomain(s, c), false);
  for (let i = 0; i < 3 && !c.over; i++) CD.combat.playerAct(s, c, { type: "skill", id: "sk_guard" }, r);
  if (!c.over) { ok("thuật thức bị cháy sau lãnh địa", c.burn > 0); CD.combat.playerAct(s, c, { type: "skill", id: "tk_de" }, r); ok("chặn kỹ năng thuật thức", c.log.some((l) => /bị cháy/.test(l))); } }
ok("8 lãnh địa cho 8 thuật thức", Object.keys(CD.DATA.TECHNIQUES).every((k) => CD.DATA.DOMAINS[k]));

/* ---- Chơi thử tự động qua 3 arc ---- */
function rngFrom(seed) { let x = seed >>> 0 || 1; return () => ((x ^= x << 13), (x ^= x >>> 17), (x ^= x << 5), (x >>> 0) / 4294967296); }
function bot(s, c) {
  const ready = CD.combat.ready(s, c).filter((x) => !x.cd && CD.combat.affordable(s, x.sk) && x.sk.effect && (x.sk.effect.dmg || x.sk.effect.stun || x.sk.effect.mark));
  const d = CD.derived(s);
  const pot = ["dan_he", "thuoc_ieiri", "bang_gac"].find((id) => s.inventory.find((x) => x.id === id));
  if (s.cur.hp < d.maxHP * 0.3 && pot) return { type: "item", id: pot };
  ready.sort((a, b) => (b.sk.effect.dmg ? b.sk.effect.dmg.mult : 0) - (a.sk.effect.dmg ? a.sk.effect.dmg.mult : 0));
  return ready.length ? { type: "skill", id: ready[0].id } : { type: "skill", id: "sk_guard" };
}
function fight(s, enemies, opts, rng, txKey, log, label) {
  while (s.unallocated > 0) CD.allocate(s, ["STR", "VIT", "INT", "WIS", "AGI"][s.unallocated % 5], 1);
  const c = CD.combat.start(s, enemies, opts);
  let r = 0; while (!c.over && r++ < 80) CD.combat.playerAct(s, c, bot(s, c), rng);
  log.fights.push(label + ":" + c.over + "@" + c.round);
  return c;
}
function shopping(s) {
  CD.DATA.SKILL_SHOP.forEach((e) => { if (CD.canLearn(s, e.id).ok) CD.learnSkill(s, e.id); });
  s.skills.forEach((k) => { const c = CD.upgradeCost(s, k); if (c && c.cur === "yen" && s.currency.yen > c.price + 20000) CD.upgradeSkill(s, k); });
  ["tinh_STR", "tinh_VIT", "tinh_INT", "tinh_WIS", "dan_he", "manh_tiem"].forEach((id) => { const r = CD.buy(s, "system", id); if (r.ok && CD.DATA.ITEMS[id].use && !CD.DATA.ITEMS[id].use.hp) CD.useItem(s, id); });
  if (s.hub) ["thuoc_ieiri", "dao_chu4", "giay_chu"].forEach((id) => CD.buy(s, "academy", id));
}
function playthrough(seed, prefer) {
  const rng = rngFrom(seed), s = CD.newCampaign(), log = { fights: [], hubSlots: 0 };
  let id = "p_intro", steps = 0; CD.enterScene(s, id);
  while (steps++ < 600) {
    const sc = S[id];
    if (s.pendingRank) CD.claimRank(s, seed % 3);
    if (sc.special === "traits") { const keys = Object.keys(CD.DATA.TRAITS); const a = keys[seed % 20], b = keys[(seed * 7 + 3) % 20 === seed % 20 ? (seed + 1) % 20 : (seed * 7 + 3) % 20]; CD.pickTraits(s, [a, b]); id = sc.go; }
    else if (sc.special === "interview") { CD.DATA.INTERVIEW.forEach((q, i) => CD.answerInterview(s, i, Math.floor(rng() * q.a.length))); id = sc.go; }
    else if (sc.special === "technique") { const opts = CD.suggestTechniques(s, 4); if (seed % 5 === 0 && CD.redoSurvey(s)) { CD.DATA.INTERVIEW.forEach((q, i) => CD.answerInterview(s, i, (i + seed) % 4)); } CD.setTechnique(s, CD.suggestTechniques(s, 4)[seed % 4]); id = sc.go; }
    else if (sc.special === "restriction") { const keys = [null, "xacthit", "tamthan", "menhdoi"]; CD.setRestriction(s, keys[seed % 4]); id = sc.go; }
    else if (sc.special === "rankup") { CD.tryRankScene(s); if (s.pendingRank) CD.claimRank(s, seed % 3); id = sc.go; }
    else if (sc.hub) {
      const H = CD.DATA.HUBS[sc.hub];
      let guard = 0;
      while (!CD.hubOver(s) && guard++ < 400) {
        log.hubSlots++; shopping(s);
        if (s.cur.hp < CD.derived(s).maxHP * 0.6) { if (CD.canSpend(s, "nap")) CD.hubAct(s, "nap"); else CD.hubAct(s, "sleep"); continue; }
        const locs = Object.keys(H.locations);
        const withEv = CD.canSpend(s, "explore") && locs.find((l) => CD.exploreEvents(s, l).length);
        if (withEv) { if (s.hub.loc !== withEv) { CD.hubAct(s, "move", withEv); if (s.hub.loc !== withEv) continue; }
          if (!CD.canSpend(s, "explore")) { CD.hubAct(s, "sleep"); continue; }
          const o = CD.hubAct(s, "explore", null, null, rng);
          if (o.combat) { s.hubFight = { ...o.combat, loc: withEv }; const c = fight(s, o.combat.enemies, { canFlee: true }, rng, null, log, "hub:" + o.combat.evId); CD.hubFightEnd(s, c); }
          continue; }
        if (s.hub.trains < H.trainCap && CD.canSpend(s, "train")) { const k = ["STR", "VIT", "INT", "WIS"][s.hub.trains % 4]; CD.hubAct(s, "train", k); continue; }
        let done = false;
        for (const l of locs) { for (const n of CD.hubNpcs(s, l)) {
          const SO = CD.DATA.SOCIAL[n]; if (!SO) continue;
          const sparOk = SO.train && (s.rel[n] || 0) >= (SO.train.minRel || 0) && !s.hub.daily["spar_" + n] && CD.timeLeft(s) >= 135;
          const talkOk = !s.hub.daily["talk_" + n] && CD.timeLeft(s) >= 30;
          if (!sparOk && !talkOk) continue;
          if (s.hub.loc !== l) CD.hubAct(s, "move", l);
          if (s.hub.loc !== l) break;
          const before = s.hub.time;
          if (sparOk) CD.hubAct(s, "spar", n); else CD.hubAct(s, "talk", n);
          if (s.hub.time !== before || s.hub.daily["talk_" + n]) { done = true; break; } }
          if (done) break; }
        if (!done) CD.hubAct(s, "sleep");
      }
      id = sc.go;
    }
    else if (sc.combat) {
      shopping(s);
      const c = fight(s, sc.combat.enemies, sc.combat, rng, null, log, id);
      CD.combat.finish(s, c, id);
      id = c.over === "win" || c.over === "survive" ? sc.combat.win : c.over === "flee" ? sc.combat.flee : sc.combat.lose;
    } else if (sc.choices && sc.choices.length) {
      const avail = sc.choices.map((ch, i) => i).filter((i) => CD.meets(s, sc.choices[i].req));
      if (!avail.length) { console.log("KẸT", seed, id); fail++; break; }
      const pick = prefer === "first" ? avail[0] : avail[Math.floor(rng() * avail.length)];
      id = CD.choose(s, id, pick).go;
    } else break;
    CD.enterScene(s, id);
    const errs = CD.validate(s); if (errs.length) { fail++; console.log("VALIDATE", seed, id, errs); break; }
    if (id === "a3_end") break;
    if (id === "a1_end") log.lvA1 = s.level, log.rankA1 = s.rank;
    if (id === "a3_start") log.lvA2 = s.level;
  }
  return { s, log, id };
}
const results = [];
for (let seed = 1; seed <= 120; seed++) results.push(playthrough(seed, seed % 2 ? "first" : "rand"));
eq("120 lượt chơi đều tới cuối Arc 3", results.filter((r) => r.id === "a3_end").length, 120);
const stat = (f) => { const v = results.map(f); return Math.min(...v) + "–" + Math.max(...v); };
console.log("Lv cuối Arc 1:", stat((r) => r.log.lvA1), "· cuối Arc 2:", stat((r) => r.log.lvA2), "· cuối Arc 3:", stat((r) => r.s.level));
console.log("Rank D cuối Arc 1:", results.filter((r) => r.log.rankA1 === "D").length + "/120 · Rank C cuối Arc 3:", results.filter((r) => r.s.rank === "C").length + "/120");
const losses = {}; results.forEach((r) => r.log.fights.filter((f) => f.includes(":lose")).forEach((f) => { const k = f.split(":lose")[0]; losses[k] = (losses[k] || 0) + 1; }));
console.log("Số trận thua theo cảnh:", losses);
console.log("Mẫu trận seed 2:", results[1].log.fights.join(" ").slice(0, 600)); const techs = {}; results.forEach((r) => (techs[r.s.technique] = (techs[r.s.technique] || 0) + 1)); console.log("Thuật thức:", techs);
console.log("Đồ rơi TB:", Math.round(results.reduce((a, r) => a + Object.keys(r.s.genItems).length, 0) / 120));
console.log("Junpei sống:", results.filter((r) => r.s.flags.includes("junpei_alive")).length + "/120 · SP còn TB:", Math.round(results.reduce((a, r) => a + r.s.currency.sp, 0) / 120));
console.log(fail ? "❌ " + fail + " lỗi, " + pass + " đạt" : "✅ Tất cả " + pass + " kiểm tra đạt");
process.exit(fail ? 1 : 0);
