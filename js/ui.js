/* =====================================================================
   CURSED DESTINY — GIAO DIỆN
   ===================================================================== */
(function () {
  const CD = window.CD, D = CD.DATA, SC = CD.SCENES;
  const $ = (q) => document.querySelector(q);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  };

  let S = null, tab = "story", combat = null, msgs = [], pick = [], ivIndex = 0, saveNote = "";

  /* ---------- lưu ---------- */
  const autosave = () => S && store.set("cd2_auto", CD.exportSave(S));
  function loadText(txt) { const r = CD.importSave(txt); if (r.ok) { S = r.s; combat = null; msgs = []; pick = []; ivIndex = 0; } return r; }

  /* ---------- điều hướng ---------- */
  function go(id) {
    combat = null; pick = []; ivIndex = 0;
    msgs = CD.enterScene(S, id);
    const sc = SC[id];
    if (sc.combat) combat = CD.combat.start(S, sc.combat.enemies, sc.combat);
    autosave(); tab = "story"; render(); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function newGame() { S = CD.newCampaign(); go("p_intro"); }

  /* ---------- tiện ích hiển thị ---------- */
  const bar = (cur, max, cls) => `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, (cur / max) * 100))}%"></i><span>${{ hp: "HP ", ce: "CL ", sta: "TL ", anti: "" }[cls] || ""}${Math.max(0, Math.floor(cur))}/${Math.floor(max)}</span></div>`;
  const rankChip = (r) => `<b class="rank r${CD.rankIndex(r)}">${r}</b>`;
  const statLine = (o) => Object.entries(o || {}).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(", ");
  function line(t) {
    if (t.startsWith("[")) return `<p class="sys">${esc(t.slice(1, -1))}</p>`;
    if (t.startsWith(">")) return `<p class="say">${esc(t.slice(1).trim())}</p>`;
    return `<p>${esc(t)}</p>`;
  }
  function npcCard(id, compact) {
    const n = D.NPCS[id]; if (!n) return "";
    const gap = CD.powerGap(S, n);
    const hidden = n.hide;
    return `<div class="npc ${gap.cls}">
      <div class="npc-h"><strong>${esc(n.name)}</strong>${rankChip(hidden ? "???" : n.rank)}</div>
      <div class="npc-m">${hidden ? "Lv ???" : "Lv " + n.lv + " · " + (CD.RANK_INFO[n.rank] || {}).grade}</div>
      <div class="gap">${gap.label}</div>
      ${compact ? "" : `<div class="npc-d">${esc(n.desc || "")}</div>`}
    </div>`;
  }
  function skillDesc(id, extra) {
    const k = D.SKILLS[id]; if (!k) return "";
    const cost = [k.cost && k.cost.ce ? k.cost.ce + " Chú lực" : "", k.cost && k.cost.sta ? k.cost.sta + " Thể lực" : ""].filter(Boolean).join(" · ") || "Không tốn";
    return `<div class="skill"><div class="skill-h"><strong>${esc(k.name)}</strong><span>${cost} · Hồi chiêu ${k.cd || 0}</span></div><div class="muted">${esc(k.desc)}</div>${extra || ""}</div>`;
  }

  /* ---------- HEADER ---------- */
  function header() {
    if (!S || !S.flags.includes("system")) return `<div class="hud"><h1>Cursed <span>Destiny</span></h1></div>`;
    const d = CD.derived(S), need = CD.expRequired(S.level);
    return `<div class="hud">
      <div class="hud-top"><h1>Cursed <span>Destiny</span></h1><div class="lvl">${rankChip(S.rank)} <b>Lv ${S.level}</b>${S.unallocated ? `<button class="pts" data-tab="char">+${S.unallocated} điểm</button>` : ""}</div></div>
      <div class="hud-bars">${bar(S.cur.hp, d.maxHP, "hp")}${bar(S.cur.ce, d.maxCE, "ce")}${bar(S.cur.sta, d.maxSTA, "sta")}</div>
      <div class="exp"><i style="width:${(S.exp / need) * 100}%"></i></div>
      <div class="hud-meta"><span>EXP ${S.exp}/${need}</span><span>${esc(S.time.label)} · Ngày ${S.time.day}</span></div>
    </div>`;
  }

  /* ---------- TAB: TRUYỆN ---------- */
  function storyView() {
    const sc = SC[S.scene];
    let h = `<article class="scene"><p class="chap">${esc(sc.chapter)}</p><h2>${esc(sc.title)}</h2><div class="text">${sc.text.map(line).join("")}</div></article>`;
    if (msgs.length) h += `<div class="msgs">${msgs.map((m) => `<div>${esc(m)}</div>`).join("")}</div>`;
    if (sc.observe && !combat) h += `<div class="obs"><p class="label">Quan sát</p><div class="npcs">${sc.observe.map((n) => npcCard(n)).join("")}</div></div>`;
    if (combat) h += combatView(sc);
    else if (sc.special) h += specialView(sc);
    else if (sc.choices) h += `<div class="choices">${sc.choices.map((c, i) => {
      const okk = CD.meets(S, c.req), rt = CD.reqText(c.req);
      return `<button class="choice" data-choice="${i}" ${okk ? "" : "disabled"}><span>${esc(c.t)}</span>${rt ? `<small>${esc(rt)}</small>` : ""}</button>`;
    }).join("")}</div>`;
    return h;
  }

  function specialView(sc) {
    if (sc.special === "traits") {
      if (S.traits.length) return contBtn(sc.go);
      return `<div class="panel"><p class="label">Chọn 2 đặc tính (${pick.length}/2)</p><div class="cards">${Object.entries(D.TRAITS).map(([id, t]) =>
        `<button class="card ${pick.includes(id) ? "on" : ""}" data-trait="${id}"><strong>${esc(t.name)}</strong><span>${esc(t.desc)}</span></button>`).join("")}</div>
        <button class="primary" data-confirm-traits ${pick.length === 2 ? "" : "disabled"}>Xác nhận đặc tính</button></div>`;
    }
    if (sc.special === "interview") {
      if (ivIndex >= D.INTERVIEW.length) return contBtn(sc.go);
      const q = D.INTERVIEW[ivIndex];
      return `<div class="panel"><p class="label">Câu ${ivIndex + 1}/${D.INTERVIEW.length}</p><p class="say big">${esc(q.q)}</p><div class="choices">${q.a.map((a, i) => `<button class="choice" data-answer="${i}"><span>${esc(a.t)}</span></button>`).join("")}</div></div>`;
    }
    if (sc.special === "technique") {
      if (S.technique) return contBtn(sc.go);
      const opts = CD.suggestTechniques(S, 3);
      return `<div class="cards one">${opts.map((id) => {
        const t = D.TECHNIQUES[id];
        return `<div class="card big"><strong class="tname">${esc(t.name)}</strong><span>${esc(t.desc)}</span>
          <p class="label">Kỹ năng Bậc 1</p>${t.tier1.skills.map((k) => skillDesc(k)).join("")}
          <p class="muted">Nội tại: ${esc(t.tier1.passive)}</p>
          <p class="label">Cây tiến hóa</p><ol class="tree">${t.tree.map((x) => `<li>${esc(x)}</li>`).join("")}<li class="hid">Nhánh ẩn: ???</li></ol>
          <button class="primary" data-tech="${id}">Chọn ${esc(t.name)}</button></div>`;
      }).join("")}</div>`;
    }
    if (sc.special === "restriction") {
      if (S.flags.includes("restriction_decided")) return contBtn(sc.go);
      return `<div class="cards one">${Object.entries(D.RESTRICTIONS).map(([id, r]) =>
        `<div class="card big"><strong class="tname">${esc(r.name)}</strong><span>${esc(r.desc)}</span><button class="primary" data-restr="${id}">Ký khế ước</button></div>`).join("")}
        <button class="ghost" data-restr="">Từ chối, không ký khế ước nào</button></div>`;
    }
    if (sc.special === "rankup") {
      return `<div class="choices"><button class="primary" data-rankup="${sc.go}">Kiểm tra đột phá</button></div>`;
    }
    return "";
  }
  const contBtn = (to) => `<div class="choices"><button class="primary" data-go="${to}">Tiếp tục</button></div>`;

  /* ---------- CHIẾN ĐẤU ---------- */
  function combatView(sc) {
    const c = combat, d = CD.derived(S);
    let h = `<div class="combat"><div class="round">Lượt ${c.round}</div>`;
    h += c.enemies.map((e, i) => {
      const ob = c.observed.includes(e.id) ? CD.combat.observe(S, c, e) : null;
      return `<div class="foe ${e.hp <= 0 ? "dead" : ""}">
        <div class="foe-h"><strong>${esc(e.name)}</strong>${rankChip(e.rank)}<span class="muted">Lv ${e.lv}</span></div>
        ${bar(e.hp, e.d.maxHP, "hp")}
        ${e.marks ? `<div class="muted">Ấn: ${e.marks}/3</div>` : ""}
        ${ob ? `<div class="gap ${ob.gap.cls}">${ob.gap.label}</div>` + (ob.full ? `<div class="mini">${CD.STATS.map((k) => k + " " + e.stats[k]).join(" · ")}<br>Tấn công ${CD.fmt(e.d.patk)} · Uy lực ${CD.fmt(e.d.cpow)} · Giáp ${CD.fmt(e.d.pdef)} · Kháng chú ${CD.fmt(e.d.cdef)}<br>Chiêu: ${e.skills.map((x) => esc(x.name) + " ×" + x.mult + (x.cd ? " (hồi " + x.cd + ")" : "")).join(", ")}</div>` : `<div class="mini">Chênh lệch quá lớn để đọc chỉ số.</div>`)
          : e.hp > 0 ? `<button class="ghost sm" data-observe="${i}">Quan sát (miễn phí)</button>` : ""}
      </div>`;
    }).join("");
    h += `<div class="me"><strong>Shen</strong>${bar(S.cur.hp, d.maxHP, "hp")}${bar(S.cur.ce, d.maxCE, "ce")}${bar(S.cur.sta, d.maxSTA, "sta")}</div>`;
    if (c.log.length) h += `<div class="clog">${c.log.map((l) => `<div>${esc(l)}</div>`).join("")}</div>`;
    if (c.over) {
      const label = { win: "Chiến thắng", lose: "Thất bại", flee: "Đã thoát", survive: "Sống sót" }[c.over];
      const to = c.over === "win" || c.over === "survive" ? sc.combat.win : c.over === "flee" ? sc.combat.flee : sc.combat.lose;
      h += `<div class="result ${c.over}"><strong>${label}</strong>${(c.finishMsgs || []).map((m) => `<div>${esc(m)}</div>`).join("")}<button class="primary" data-go="${to}">Tiếp tục</button></div></div>`;
      return h;
    }
    const list = CD.combat.ready(S, c);
    const readyNames = list.filter((x) => !x.cd && CD.combat.affordable(S, x.sk)).map((x) => x.sk.name);
    const cdNames = list.filter((x) => x.cd).map((x) => x.sk.name + " (" + x.cd + ")");
    h += `<div class="ready"><span>Sẵn sàng: ${readyNames.map(esc).join(", ") || "—"}</span>${cdNames.length ? `<span>Hồi chiêu: ${cdNames.map(esc).join(", ")}</span>` : ""}</div>`;
    h += `<div class="acts">${list.map((x) => {
      const can = !x.cd && CD.combat.affordable(S, x.sk);
      const cost = [x.sk.cost && x.sk.cost.ce ? x.sk.cost.ce + " CL" : "", x.sk.cost && x.sk.cost.sta ? x.sk.cost.sta + " TL" : ""].filter(Boolean).join(" ");
      return `<button class="act ${x.sk.tech ? "tech" : ""}" data-skill="${x.id}" ${can ? "" : "disabled"} title="${esc(x.sk.desc)}"><span>${esc(x.sk.name)}</span><small>${x.cd ? "Hồi " + x.cd : cost || "0"}</small></button>`;
    }).join("")}
      ${S.inventory.filter((x) => D.ITEMS[x.id].use).map((x) => `<button class="act item" data-use="${x.id}"><span>${esc(D.ITEMS[x.id].name)}</span><small>×${x.qty}</small></button>`).join("")}
      ${sc.combat.canFlee ? `<button class="act flee" data-flee>Bỏ chạy</button>` : ""}
    </div></div>`;
    return h;
  }

  /* ---------- TAB: NHÂN VẬT ---------- */
  function charView() {
    const e = CD.effective(S), d = CD.derived(S), m = CD.mods(S), rc = CD.rankCheck(S);
    let h = `<section class="panel"><p class="label">Hồ sơ</p>
      <div class="kv"><span>Tên</span><b>Shen · 15 tuổi</b><span>Rank</span><b>${S.rank} — ${CD.RANK_INFO[S.rank].grade}</b><span>Level</span><b>${S.level} · EXP ${S.exp}/${CD.expRequired(S.level)}</b>
      <span>Thuật thức</span><b>${S.technique ? esc(D.TECHNIQUES[S.technique].name) + " (Bậc 1)" : "Chưa thức tỉnh"}</b>
      <span>Thiên dữ</span><b>${S.restriction ? esc(D.RESTRICTIONS[S.restriction].name) : "Không"}</b></div>
      ${rc.next ? `<p class="muted">Đột phá Rank ${rc.next}: Lv ${rc.minLv} ${rc.lvOk ? "✓" : "✗"} · Sát hạch ${rc.trialOk ? "✓" : "✗"}</p>${rc.can ? `<button class="primary" data-rankup-now>Đột phá Rank ${rc.next}</button>` : ""}` : ""}
    </section>`;
    h += `<section class="panel"><p class="label">Chỉ số ${S.unallocated ? `· còn <b class="hot">${S.unallocated}</b> điểm` : ""}</p><table class="stats"><tbody>${CD.STATS.map((k) =>
      `<tr><th>${k}<small>${CD.STAT_NAME[k]}</small></th><td class="num">${S.base[k]}</td><td class="num eff">${e.stats[k]}</td><td class="bd">${e.breakdown[k].slice(1).map((b) => esc(b.src) + " " + (b.v > 0 ? "+" : "") + b.v).join("<br>")}</td><td>${S.unallocated ? `<button class="plus" data-alloc="${k}">+1</button>` : ""}</td></tr>`).join("")}</tbody></table>
      <p class="muted">Cột 1: cơ bản · Cột 2: hiệu dụng</p></section>`;
    h += `<section class="panel"><p class="label">Chỉ số phái sinh</p><div class="kv">
      <span>HP tối đa</span><b>${d.maxHP}</b><span>Chú lực tối đa</span><b>${d.maxCE}</b><span>Thể lực tối đa</span><b>${d.maxSTA}</b>
      <span>Tấn công vật lý</span><b>${CD.fmt(d.patk)}</b><span>Uy lực chú lực</span><b>${CD.fmt(d.cpow)}</b><span>Giáp</span><b>${CD.fmt(d.pdef)}</b>
      <span>Kháng chú</span><b>${CD.fmt(d.cdef)}</b><span>Né tránh</span><b>${(d.evasion * 100).toFixed(1)}%</b><span>Chí mạng</span><b>${(d.crit * 100).toFixed(1)}%</b>
      <span>Tốc độ</span><b>×${d.speed.toFixed(3)}</b><span>Hồi chú lực/lượt</span><b>${m.ceRegen}</b><span>Hệ số EXP</span><b>×${m.expMult}</b></div></section>`;
    h += `<section class="panel"><p class="label">Đặc tính</p>${S.traits.map((t) => `<div class="skill"><strong>${esc(D.TRAITS[t].name)}</strong><div class="muted">${esc(D.TRAITS[t].desc)}</div></div>`).join("") || `<p class="muted">Chưa chọn.</p>`}
      ${S.restriction ? `<p class="label">Thiên dữ chú phược</p><div class="skill"><strong>${esc(D.RESTRICTIONS[S.restriction].name)}</strong><div class="muted">${esc(D.RESTRICTIONS[S.restriction].desc)}</div></div>` : ""}</section>`;
    if (S.technique) { const t = D.TECHNIQUES[S.technique];
      h += `<section class="panel"><p class="label">Thuật thức · ${esc(t.name)}</p><p class="muted">${esc(t.desc)}</p><ol class="tree">${t.tree.map((x, i) => `<li class="${i === 0 ? "cur" : ""}">${esc(x)}</li>`).join("")}<li class="hid">Nhánh ẩn: ???</li></ol></section>`; }
    h += `<section class="panel"><p class="label">Kỹ năng</p>${S.skills.map((k) => skillDesc(k)).join("")}</section>`;
    h += `<section class="panel"><p class="label">Thành tựu</p>${S.achievements.map((a) => `<div>★ ${esc(D.ACHIEVEMENTS[a])}</div>`).join("") || `<p class="muted">Chưa có.</p>`}</section>`;
    return h;
  }

  /* ---------- TAB: TÚI ĐỒ ---------- */
  function invView() {
    let h = `<section class="panel"><p class="label">Đang trang bị</p>${["Găng tay", "Giáp", "Giày", "Phụ kiện"].map((slot) => {
      const id = S.equipment[slot], it = id && D.ITEMS[id];
      return `<div class="slot"><span>${slot}</span>${it ? `<div><strong>${esc(it.name)}</strong> <em class="q">${it.quality}</em><div class="muted">${statLine(it.stats)}</div></div>` : `<span class="muted">Trống</span>`}</div>`;
    }).join("")}</section>`;
    h += `<section class="panel"><p class="label">Hành trang · ${S.currency.yen.toLocaleString("vi-VN")} yên · ${S.currency.sp} Điểm Hệ thống</p>${S.inventory.map((x) => {
      const it = D.ITEMS[x.id];
      return `<div class="slot"><div><strong>${esc(it.name)}</strong>${x.qty > 1 ? " ×" + x.qty : ""} <em class="q">${it.quality}</em><div class="muted">${it.stats ? statLine(it.stats) + " · " : ""}${esc(it.lore || "")}${it.req && it.req.rank ? " · Cần Rank " + it.req.rank : ""}</div></div>
        ${it.slot ? `<button class="ghost sm" data-equip="${x.id}" ${CD.canEquip(S, it) ? "" : "disabled"}>Trang bị</button>` : it.use ? `<button class="ghost sm" data-use-out="${x.id}">Dùng</button>` : ""}</div>`;
    }).join("") || `<p class="muted">Trống.</p>`}</section>`;
    return h;
  }

  /* ---------- TAB: NHIỆM VỤ ---------- */
  function questView() {
    const st = { active: "Đang làm", done: "Hoàn thành", failed: "Thất bại" };
    return `<section class="panel"><p class="label">Nhiệm vụ</p>${Object.entries(S.quests).map(([id, s]) =>
      `<div class="quest ${s}"><div><strong>${esc(D.QUESTS[id].name)}</strong><div class="muted">${esc(D.QUESTS[id].desc)}</div></div><em>${st[s]}</em></div>`).reverse().join("") || `<p class="muted">Chưa có nhiệm vụ.</p>`}</section>`;
  }

  /* ---------- TAB: THẾ GIỚI ---------- */
  function worldView() {
    const tier = CD.moralTier(S.moral);
    let h = `<section class="panel"><p class="label">Thiện–Ác · ${esc(tier.name)}</p>
      <div class="moral">${CD.MORAL_TIERS.map((t) => `<span class="${t.id === tier.id ? "on" : ""}">${esc(t.name)}</span>`).join("")}</div>
      <p class="muted">${esc(tier.perk)}${Object.keys(tier.bonus).length ? " · Thưởng: " + statLine(tier.bonus) : ""}</p>
      <p class="label">Con đường Anti-hero</p>${bar(S.anti, 100, "anti")}<p class="muted">Mở khóa ở 30 điểm, dựa trên lịch sử hành động.</p></section>`;
    h += `<section class="panel"><p class="label">Danh vọng</p><div class="kv">${Object.entries(CD.FACTIONS).map(([k, n]) => `<span>${esc(n)}</span><b>${S.rep[k] > 0 ? "+" : ""}${S.rep[k]}</b>`).join("")}</div></section>`;
    const rels = Object.entries(S.rel);
    h += `<section class="panel"><p class="label">Quan hệ</p>${rels.length ? `<div class="kv">${rels.map(([k, v]) => `<span>${esc(D.NPCS[k] ? D.NPCS[k].name : k)}</span><b>${v > 0 ? "+" : ""}${v}</b>`).join("")}</div>` : `<p class="muted">Chưa có.</p>`}</section>`;
    h += `<section class="panel"><p class="label">Sổ nhân quả</p>${S.ledger.slice().reverse().map((l) => `<div class="ledger"><code>${l.id} · Ngày ${l.day}</code><strong>${esc(l.action)}</strong>${l.witnesses ? `<div class="muted">Chứng kiến: ${esc(l.witnesses)}</div>` : ""}${l.consequence ? `<div class="muted">Hệ quả: ${esc(l.consequence)}</div>` : ""}${l.trigger ? `<div class="muted">Tiềm ẩn: ${esc(l.trigger)}</div>` : ""}</div>`).join("") || `<p class="muted">Trống.</p>`}</section>`;
    h += `<section class="panel"><p class="label">Hành trình</p>${D.ARCS.map((a) => `<details class="arc ${a.playable ? "open" : ""}" ${a.id === S.world.arc ? "open" : ""}>
      <summary><span>${esc(a.name)}</span><em>${esc(a.rank)} · Lv ${esc(a.lv)}${a.playable ? "" : " · khóa"}</em></summary>
      <p class="muted">${esc(a.sum)}</p>${a.npcs.length ? `<div class="npcs">${a.npcs.map((n) => npcCard(n, true)).join("")}</div>` : ""}</details>`).join("")}</section>`;
    h += `<section class="panel"><p class="label">Luật thế giới</p><ul class="rules">${D.WORLD_RULES.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></section>`;
    return h;
  }

  /* ---------- TAB: LƯU ---------- */
  function saveView() {
    const slot = (n) => { const t = store.get("cd2_slot" + n); let info = "Trống";
      if (t) { const r = CD.importSave(t); info = r.ok ? `Lv ${r.s.level} · Rank ${r.s.rank} · ${esc(SC[r.s.scene] ? SC[r.s.scene].title : "")}` : "Hỏng"; }
      return `<div class="slot"><div><strong>Ô ${n}</strong><div class="muted">${info}</div></div><div class="row"><button class="ghost sm" data-save="${n}">Lưu</button><button class="ghost sm" data-load="${n}" ${t ? "" : "disabled"}>Tải</button></div></div>`; };
    return `<section class="panel"><p class="label">Ô lưu</p>${[1, 2, 3].map(slot).join("")}<p class="muted">Game tự lưu sau mỗi cảnh. Dữ liệu nằm trên trình duyệt này.</p></section>
      <section class="panel"><p class="label">Xuất / nhập</p><textarea id="io" rows="4" placeholder="Bấm Xuất để lấy mã lưu, hoặc dán mã lưu vào đây rồi bấm Nhập."></textarea>
      <div class="row"><button class="ghost sm" data-export>Xuất</button><button class="ghost sm" data-copy>Sao chép</button><button class="ghost sm" data-import>Nhập</button><button class="ghost sm" data-check>Kiểm tra toàn vẹn</button></div></section>
      ${saveNote ? `<div class="msgs"><div>${esc(saveNote)}</div></div>` : ""}
      <section class="panel"><p class="label">Chiến dịch</p><p class="muted">Mã: ${esc(S.campaignId)}</p><button class="ghost" data-newgame>Chơi lại từ đầu</button>
      <div id="confirmNew" hidden><p class="hot">Toàn bộ tiến trình tự lưu sẽ bị thay thế.</p><button class="primary" data-newgame-yes>Xác nhận chơi lại</button></div></section>`;
  }

  /* ---------- RENDER ---------- */
  const TABS = [["story", "Truyện"], ["char", "Nhân vật"], ["inv", "Túi đồ"], ["quest", "Nhiệm vụ"], ["world", "Thế giới"], ["save", "Lưu"]];
  function render() {
    $("#hud").innerHTML = header();
    const sysOn = S.flags.includes("system");
    $("#main").innerHTML = tab === "story" || !sysOn ? storyView() : tab === "char" ? charView() : tab === "inv" ? invView() : tab === "quest" ? questView() : tab === "world" ? worldView() : saveView();
    $("#tabs").innerHTML = sysOn ? TABS.map(([k, n]) => `<button data-tab="${k}" class="${tab === k ? "on" : ""}">${n}${k === "char" && S.unallocated ? "<i></i>" : ""}</button>`).join("") : "";
    $("#tabs").hidden = !sysOn;
  }

  /* ---------- SỰ KIỆN ---------- */
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b || b.disabled) return;
    const ds = b.dataset;
    if (ds.tab) { tab = ds.tab; saveNote = ""; render(); window.scrollTo({ top: 0 }); return; }
    if (ds.choice !== undefined) { const r = CD.choose(S, S.scene, +ds.choice); if (r) { const m = r.msgs; go(r.go); msgs = m.concat(msgs); render(); } return; }
    if (ds.go) { go(ds.go); return; }
    if (ds.trait) { const i = pick.indexOf(ds.trait); if (i >= 0) pick.splice(i, 1); else if (pick.length < 2) pick.push(ds.trait); render(); return; }
    if (ds.confirmTraits !== undefined) { if (CD.pickTraits(S, pick)) { msgs = ["Đặc tính: " + pick.map((p) => D.TRAITS[p].name).join(" + ")]; autosave(); } render(); return; }
    if (ds.answer !== undefined) { CD.answerInterview(S, ivIndex, +ds.answer); ivIndex++; autosave(); render(); return; }
    if (ds.tech) { CD.setTechnique(S, ds.tech); msgs = ["Thức tỉnh thuật thức: " + D.TECHNIQUES[ds.tech].name]; autosave(); render(); return; }
    if (ds.restr !== undefined) { CD.setRestriction(S, ds.restr || null); msgs = [ds.restr ? "Ký khế ước: " + D.RESTRICTIONS[ds.restr].name : "Không ký khế ước."]; autosave(); render(); return; }
    if (ds.rankup) { const to = ds.rankup; const m = CD.tryRankScene(S); go(to); msgs = m.concat(msgs); render(); return; }
    if (ds.rankupNow !== undefined) { saveNote = ""; CD.tryRankScene(S); autosave(); render(); return; }
    if (ds.alloc) { CD.allocate(S, ds.alloc, 1); autosave(); render(); return; }
    if (ds.equip) { const m = CD.equip(S, ds.equip); msgs = m; autosave(); tab = "inv"; render(); return; }
    if (ds.useOut) { CD.useItem(S, ds.useOut); autosave(); render(); return; }
    if (combat && !combat.over) {
      const sc = SC[S.scene];
      if (ds.observe !== undefined) { CD.combat.observe(S, combat, combat.enemies[+ds.observe]); render(); return; }
      let act = null;
      if (ds.skill) act = { type: "skill", id: ds.skill };
      if (ds.use) act = { type: "item", id: ds.use };
      if (ds.flee !== undefined) act = { type: "flee" };
      if (act) { CD.combat.playerAct(S, combat, act); if (combat.over) { combat.finishMsgs = CD.combat.finish(S, combat, S.scene); autosave(); } render(); return; }
    }
    if (ds.save) { saveNote = store.set("cd2_slot" + ds.save, CD.exportSave(S)) ? "Đã lưu vào ô " + ds.save + "." : "Trình duyệt chặn lưu dữ liệu."; render(); return; }
    if (ds.load) { const r = loadText(store.get("cd2_slot" + ds.load)); if (r.ok) { go(S.scene); } else { saveNote = r.err; render(); } return; }
    if (ds.export !== undefined) { $("#io").value = CD.exportSave(S); saveNote = "Đã xuất mã lưu. Hãy sao chép và cất ở nơi an toàn."; const v = $("#io").value; render(); $("#io").value = v; return; }
    if (ds.copy !== undefined) { const t = $("#io"); const v = t.value; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { saveNote = "Đã sao chép."; render(); $("#io").value = v; }).catch(() => { t.select(); }); return; }
    if (ds.import !== undefined) { const v = $("#io").value.trim(); const r = loadText(v); if (r.ok) { saveNote = ""; go(S.scene); } else { saveNote = r.err; render(); $("#io").value = v; } return; }
    if (ds.check !== undefined) { const e = CD.validate(S); saveNote = e.length ? "Phát hiện lỗi: " + e.join("; ") : "Dữ liệu toàn vẹn: không phát hiện lỗi."; render(); return; }
    if (ds.newgame !== undefined) { $("#confirmNew").hidden = false; return; }
    if (ds.newgameYes !== undefined) { saveNote = ""; newGame(); return; }
  });

  /* ---------- KHỞI ĐỘNG ---------- */
  function start(data) {
    const t = (data && data.save) || store.get("cd2_auto");
    if (t && loadText(t).ok) { msgs = []; const sc = SC[S.scene]; if (sc && sc.combat) combat = CD.combat.start(S, sc.combat.enemies, sc.combat); render(); }
    else newGame();
  }
  window.claude?.hot?.snapshot?.(() => ({ save: S && CD.exportSave(S) }));
  window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
})();
