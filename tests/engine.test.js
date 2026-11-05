/* Chạy: node tests/engine.test.js  — unit test công thức + chơi thử tự động toàn bộ Arc 1 */
require("../js/data.js"); require("../js/story.js"); require("../js/engine.js");
const CD = globalThis.CD;
let pass = 0, fail = 0;
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

/* ---- Chơi thử tự động ---- */
function rngFrom(seed) { let x = seed >>> 0 || 1; return () => ((x ^= x << 13), (x ^= x >>> 17), (x ^= x << 5), (x >>> 0) / 4294967296); }
function bot(s, c, rng) {
  const ready = CD.combat.ready(s, c).filter((x) => !x.cd && CD.combat.affordable(s, x.sk) && x.sk.effect && (x.sk.effect.dmg || x.sk.effect.stun || x.sk.effect.mark));
  const d = CD.derived(s);
  if (s.cur.hp < d.maxHP * 0.3 && s.inventory.find((x) => x.id === "thuoc_ieiri")) return { type: "item", id: "thuoc_ieiri" };
  ready.sort((a, b) => (b.sk.effect.dmg ? b.sk.effect.dmg.mult : 0) - (a.sk.effect.dmg ? a.sk.effect.dmg.mult : 0));
  return ready.length ? { type: "skill", id: ready[0].id } : { type: "skill", id: "sk_guard" };
}
function playthrough(seed, prefer) {
  const rng = rngFrom(seed), s = CD.newCampaign(), log = { fights: [] };
  let id = "p_intro", steps = 0; CD.enterScene(s, id);
  while (steps++ < 300) {
    const sc = S[id];
    if (sc.special === "traits") { const keys = Object.keys(CD.DATA.TRAITS); const a = keys[seed % 20], b = keys[(seed * 7 + 3) % 20 === seed % 20 ? (seed + 1) % 20 : (seed * 7 + 3) % 20]; CD.pickTraits(s, [a, b]); id = sc.go; }
    else if (sc.special === "interview") { CD.DATA.INTERVIEW.forEach((q, i) => CD.answerInterview(s, i, Math.floor(rng() * q.a.length))); id = sc.go; }
    else if (sc.special === "technique") { const opts = CD.suggestTechniques(s, 3); eq("3 gợi ý", opts.length, 3); CD.setTechnique(s, opts[0]); log.tech = opts; id = sc.go; }
    else if (sc.special === "restriction") { const keys = [null, "xacthit", "tamthan", "menhdoi"]; CD.setRestriction(s, keys[seed % 4]); id = sc.go; }
    else if (sc.special === "rankup") { CD.tryRankScene(s); id = sc.go; }
    else if (sc.combat) {
      while (s.unallocated > 0) CD.allocate(s, ["STR", "VIT", "INT", "WIS", "AGI"][s.unallocated % 5], 1);
      const c = CD.combat.start(s, sc.combat.enemies, sc.combat);
      let r = 0; while (!c.over && r++ < 60) CD.combat.playerAct(s, c, bot(s, c, rng), rng);
      log.fights.push(id + ":" + c.over + "@" + c.round);
      CD.combat.finish(s, c, id);
      id = c.over === "win" || c.over === "survive" ? sc.combat.win : c.over === "flee" ? sc.combat.flee : sc.combat.lose;
    } else if (sc.choices && sc.choices.length) {
      const avail = sc.choices.map((ch, i) => i).filter((i) => CD.meets(s, sc.choices[i].req));
      if (!avail.length) break;
      const pick = prefer === "first" ? avail[0] : avail[Math.floor(rng() * avail.length)];
      id = CD.choose(s, id, pick).go;
    } else break;
    CD.enterScene(s, id);
    const errs = CD.validate(s); if (errs.length) { fail++; console.log("VALIDATE", seed, id, errs); break; }
    if (id === "a1_end" && s.flags.includes("extra_done")) break;
  }
  return { s, log, id };
}
const results = [];
for (let seed = 1; seed <= 200; seed++) results.push(playthrough(seed, seed % 2 ? "first" : "rand"));
const reached = results.filter((r) => r.id === "a1_end").length;
eq("200 lượt chơi đều tới cuối Arc 1", reached, 200);
const lv = results.map((r) => r.s.level), rankD = results.filter((r) => r.s.rank === "D").length;
const tech = {}; results.forEach((r) => (tech[r.s.technique] = (tech[r.s.technique] || 0) + 1));
const trialLosses = results.reduce((a, r) => a + r.log.fights.filter((f) => f.startsWith("a1_trial:lose")).length, 0);
console.log("Lv cuối Arc 1: min", Math.min(...lv), "max", Math.max(...lv), "· Đạt Rank D:", rankD + "/200 · thua sát hạch:", trialLosses);
console.log("Phân bố thuật thức:", tech);
console.log("Mẫu trận (seed 1):", results[0].log.fights.join(" | "));
console.log(fail ? "❌ " + fail + " lỗi, " + pass + " đạt" : "✅ Tất cả " + pass + " kiểm tra đạt");
process.exit(fail ? 1 : 0);
