/* =====================================================================
   CURSED DESTINY — BÀNH TRƯỚNG LÃNH ĐỊA
   3 cấp độ, mở khóa theo Rank + Level + chỉ số hiệu dụng (INT, WIS) + Chú lực tối đa.
   Mỗi thuật thức có một lãnh địa riêng. Nạp sau gear.js.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {}), D = CD.DATA;

  /* ---------- CẤP ĐỘ LÃNH ĐỊA ---------- */
  CD.DOMAIN_STAGES = [
    { n: 1, name: "Lãnh địa chưa hoàn thiện", req: { rank: "B", level: 35, INT: 40, WIS: 40, maxCE: 900 }, sp: 300,
      turns: 3, mult: 1.3, sure: false, tick: 0.6, cost: 0.5, burn: 2,
      desc: "Lãnh địa chưa có kết giới khép kín. Kỹ năng thuật thức ×1.3, hiệu ứng lãnh địa ở mức 60%. Duy trì 3 lượt. Tốn 50% Chú lực tối đa. Sau đó thuật thức bị cháy 2 lượt." },
    { n: 2, name: "Lãnh địa hoàn chỉnh", req: { rank: "A", level: 50, INT: 60, WIS: 70, maxCE: 1400 }, sp: 800,
      turns: 4, mult: 1.6, sure: true, tick: 1.0, cost: 0.45, burn: 2,
      desc: "Kết giới khép kín, thuật thức chắc chắn trúng đích. Kỹ năng thuật thức ×1.6 và không thể né. Duy trì 4 lượt. Tốn 45% Chú lực tối đa. Sau đó thuật thức bị cháy 2 lượt." },
    { n: 3, name: "Lãnh địa hoàn mỹ", req: { rank: "S", level: 75, INT: 100, WIS: 110, maxCE: 2200 }, sp: 2000,
      turns: 5, mult: 2.0, sure: true, tick: 1.4, cost: 0.4, burn: 1,
      desc: "Lãnh địa vẽ thẳng lên thực tại. Kỹ năng thuật thức ×2.0, không thể né, hiệu ứng lãnh địa ×1.4. Duy trì 5 lượt. Tốn 40% Chú lực tối đa. Thuật thức chỉ cháy 1 lượt." },
  ];

  /* ---------- LÃNH ĐỊA THEO THUẬT THỨC ----------
     tick: mỗi lượt (trước khi kẻ địch hành động) · enemy: suy giảm kẻ địch trong lãnh địa */
  D.DOMAINS = {
    khacan: { name: "Thiên La Ấn Giới", text: "Hàng nghìn ấn chú phủ kín bầu trời như một tấm lưới.", onCast: { marks: 3 }, tick: { marks: 1, dmg: 0.5 }, effect: "Khắc đầy 3 ấn lên mọi kẻ địch; mỗi lượt khắc thêm 1 ấn và gây Uy lực ×0.5." },
    phananh: { name: "Vô Tận Kính Cung", text: "Bốn phía là gương, mỗi tấm gương chứa một Shen khác.", enemy: { reflect: 0.5 }, tick: { dmg: 0.3 }, effect: "Phản lại 50% sát thương kẻ địch gây ra; mỗi lượt gây Uy lực ×0.3." },
    trongap: { name: "Tinh Hạch Sụp Đổ", text: "Bầu trời đổ sập xuống như một hành tinh chết.", enemy: { atk: 0.4 }, tick: { dmg: 0.8 }, effect: "Kẻ địch giảm 40% tấn công; mỗi lượt gây Uy lực ×0.8." },
    lientuyen: { name: "Vạn Tuyến Thiên Võng", text: "Mọi thứ trong lãnh địa bị xâu lại bằng những sợi chỉ phát sáng.", tick: { stun: 0.5, dmg: 0.4 }, effect: "Mỗi lượt 50% trói từng kẻ địch và gây Uy lực ×0.4." },
    thucchu: { name: "Thao Thiết Chú Vương", text: "Một cái miệng khổng lồ mở ra trên nền trời.", tick: { dmg: 0.6, drain: 1.0 }, effect: "Mỗi lượt gây Uy lực ×0.6 và hút toàn bộ thành Chú lực." },
    tichquang: { name: "Bạch Dạ", text: "Đêm trắng không có bóng. Không gì có thể ẩn nấp.", enemy: { hit: 0.5 }, tick: { dmg: 0.5 }, effect: "Kẻ địch giảm 50% khả năng đánh trúng; mỗi lượt gây Uy lực ×0.5." },
    amchan: { name: "Thiên Cổ Lôi Điện", text: "Một chiếc trống khổng lồ vang lên ở trung tâm thế giới.", tick: { dmg: 0.7, stun: 0.3 }, effect: "Mỗi lượt gây Uy lực ×0.7 và 30% làm choáng từng kẻ địch." },
    thoikhac: { name: "Đồng Hồ Ngưng Đọng", text: "Mọi chiếc kim đồng hồ đều dừng, trừ chiếc trong tay Shen.", tick: { freezeEvery: 2, dmg: 0.4 }, effect: "Cứ 2 lượt, toàn bộ kẻ địch bị đóng băng 1 lượt; mỗi lượt gây Uy lực ×0.4." },
  };

  /* ---------- KIỂM TRA & MỞ KHÓA ---------- */
  CD.domainNext = function (s) {
    const cur = s.domainStage || 0, st = CD.DOMAIN_STAGES[cur]; if (!st) return null;
    const e = CD.effective(s).stats, d = CD.derived(s), r = st.req;
    const checks = [
      { label: "Có thuật thức", ok: !!s.technique, have: s.technique ? "Có" : "Chưa", need: "Có" },
      { label: "Rank", ok: CD.rankIndex(s.rank) >= CD.rankIndex(r.rank), have: s.rank, need: r.rank },
      { label: "Level", ok: s.level >= r.level, have: s.level, need: r.level },
      { label: "INT hiệu dụng", ok: e.INT >= r.INT, have: e.INT, need: r.INT },
      { label: "WIS hiệu dụng", ok: e.WIS >= r.WIS, have: e.WIS, need: r.WIS },
      { label: "Chú lực tối đa", ok: d.maxCE >= r.maxCE, have: d.maxCE, need: r.maxCE },
      { label: "Điểm Hệ thống", ok: s.currency.sp >= st.sp, have: s.currency.sp, need: st.sp },
    ];
    return { stage: st, checks, ready: checks.every((c) => c.ok) };
  };
  CD.unlockDomain = function (s) {
    const n = CD.domainNext(s); if (!n || !n.ready) return { ok: false, msg: "Chưa đủ điều kiện lĩnh ngộ lãnh địa." };
    const b = s.currency.sp; s.currency.sp -= n.stage.sp; s.domainStage = n.stage.n;
    const dm = D.DOMAINS[s.technique];
    CD.addLedger(s, { action: "Lĩnh ngộ Bành trướng lãnh địa: " + dm.name + " (" + n.stage.name + ")", consequence: "Shen có thể triển khai lãnh địa trong chiến đấu" });
    return { ok: true, msgs: ["Điểm Hệ thống " + b + " − " + n.stage.sp + " = " + s.currency.sp, "LĨNH NGỘ: Bành trướng lãnh địa · " + dm.name + " — " + n.stage.name] };
  };
  CD.domainInfo = (s) => (s.domainStage && s.technique ? { dm: D.DOMAINS[s.technique], st: CD.DOMAIN_STAGES[s.domainStage - 1] } : null);

  /* ---------- TRONG TRẬN ---------- */
  CD.domainCost = (s) => { const i = CD.domainInfo(s); return i ? Math.ceil(CD.derived(s).maxCE * i.st.cost) : 0; };
  CD.canDomain = (s, c) => { const i = CD.domainInfo(s); return !!i && !c.domainUsed && !c.domain && s.cur.ce >= CD.domainCost(s); };
  CD.castDomain = function (s, c) {
    const i = CD.domainInfo(s), L = c.log; if (!CD.canDomain(s, c)) return false;
    const cost = CD.domainCost(s); s.cur.ce -= cost;
    c.domainUsed = true; c.domain = { turns: i.st.turns, st: i.st, dm: i.dm, round: 0 };
    L.push("BÀNH TRƯỚNG LÃNH ĐỊA: " + i.dm.name + "! (−" + cost + " Chú lực)", i.dm.text);
    if (i.dm.onCast && i.dm.onCast.marks) c.enemies.forEach((e) => e.hp > 0 && (e.marks = Math.min(3, e.marks + i.dm.onCast.marks)));
    return true;
  };
  /* Hiệu ứng mỗi lượt, gọi trước khi kẻ địch hành động */
  CD.domainTick = function (s, c, rng) {
    const dmn = c.domain; if (!dmn) return;
    const L = c.log, t = dmn.dm.tick || {}, k = dmn.st.tick, d = CD.derived(s);
    dmn.round++;
    c.enemies.filter((e) => e.hp > 0).forEach((e) => {
      if (t.dmg) { const dmg = CD.calcDamage(d.cpow, t.dmg * k * dmn.st.mult, e.d.cdef); e.hp -= dmg; c.hits.foe[c.enemies.indexOf(e)] = (c.hits.foe[c.enemies.indexOf(e)] || 0) + dmg; L.push("Lãnh địa gây " + dmg + " sát thương lên " + e.name + ".");
        if (t.drain) { const g = Math.floor(dmg * t.drain); s.cur.ce = Math.min(d.maxCE, s.cur.ce + g); L.push("Lãnh địa nuốt " + g + " chú lực."); } }
      if (t.marks) e.marks = Math.min(3, e.marks + t.marks);
      if (t.stun && rng() < Math.min(0.95, t.stun * k)) { e.stun = 1; L.push(e.name + " bị lãnh địa khống chế, mất lượt."); }
      if (t.freezeEvery && dmn.round % t.freezeEvery === 1) { e.stun = 1; L.push(e.name + " bị đóng băng trong khoảnh khắc."); }
    });
  };
  CD.domainEndRound = function (c) {
    if (c.domain && --c.domain.turns <= 0) { c.burn = c.domain.st.burn; c.log.push("Lãnh địa sụp đổ. Thuật thức bị cháy " + c.domain.st.burn + " lượt."); c.domain = null; }
    else if (c.burn > 0) c.burn--;
  };
})(typeof window !== "undefined" ? window : globalThis);
