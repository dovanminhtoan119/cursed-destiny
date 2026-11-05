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

  let S = null, tab = "story", combat = null, msgs = [], pick = [], ivIndex = 0, saveNote = "", shopNote = "";
  let dock = "skill", hubOut = null, giftFor = null, trainOpen = false, confirmEnd = false;

  /* ---------- lưu ---------- */
  const autosave = () => S && store.set("cd2_auto", CD.exportSave(S));
  function loadText(txt) { const r = CD.importSave(txt); if (r.ok) { S = r.s; reset(); } return r; }
  function reset() { combat = null; msgs = []; pick = []; ivIndex = 0; hubOut = null; giftFor = null; trainOpen = false; confirmEnd = false; dock = "skill"; }

  /* ---------- điều hướng ---------- */
  function go(id) {
    reset();
    if (!SC[id]) id = "a1_hub2";
    msgs = CD.enterScene(S, id);
    const sc = SC[id];
    if (sc.combat) combat = CD.combat.start(S, sc.combat.enemies, sc.combat);
    autosave(); tab = "story"; render(); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function newGame() { S = CD.newCampaign(); go("p_intro"); }

  /* ---------- tiện ích hiển thị ---------- */
  const bar = (cur, max, cls) => `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, (cur / max) * 100))}%"></i><span>${{ hp: "HP ", ce: "CL ", sta: "TL ", anti: "", rel: "" }[cls] || ""}${Math.max(0, Math.floor(cur))}/${Math.floor(max)}</span></div>`;
  const rankChip = (r) => `<b class="rank r${CD.rankIndex(r)}">${r}</b>`;
  const statLine = (o) => Object.entries(o || {}).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(", ");
  const nameOf = (id) => (id === "shen" ? "Shen" : (D.NPCS[id] || {}).name || id);
  function line(t) {
    if (t.startsWith("[")) return `<p class="sys">${esc(t.slice(1, -1))}</p>`;
    if (t.startsWith(">")) return `<p class="say">${esc(t.slice(1).trim())}</p>`;
    return `<p>${esc(t)}</p>`;
  }
  const msgBox = (list) => (list && list.length ? `<div class="msgs">${list.map((m) => `<div>${esc(m)}</div>`).join("")}</div>` : "");
  function npcCard(id, compact) {
    const n = D.NPCS[id]; if (!n) return "";
    const gap = CD.powerGap(S, n), hidden = n.hide;
    return `<div class="npc ${gap.cls}"><div class="fwrap"><div class="cpt sm">${CD.ART.portrait(id)}</div><div class="fbody">
      <div class="npc-h"><strong>${esc(n.name)}</strong>${rankChip(hidden ? "???" : n.rank)}</div>
      <div class="npc-m">${hidden ? "Lv ???" : "Lv " + n.lv + " · " + (CD.RANK_INFO[n.rank] || {}).grade}</div>
      <div class="gap">${gap.label}</div>${compact ? "" : `<div class="npc-d">${esc(n.desc || "")}</div>`}
    </div></div></div>`;
  }
  const costText = (k) => [k.cost && k.cost.ce ? k.cost.ce + " Chú lực" : "", k.cost && k.cost.sta ? k.cost.sta + " Thể lực" : ""].filter(Boolean).join(" · ") || "Không tốn";
  function skillDesc(id) {
    const k = D.SKILLS[id]; if (!k) return "";
    return `<div class="skill"><div class="skill-h"><strong>${esc(k.name)}</strong><span>${costText(k)} · Hồi chiêu ${k.cd || 0}</span></div><div class="muted">${esc(k.desc)}</div></div>`;
  }
  const SRC = { patk: "Vật lý", cpow: "Chú lực", hybrid: "Lai" };
  function shortFx(sk) {
    const e = sk.effect || {}, p = [];
    if (e.dmg) p.push(SRC[e.dmg.src] + " ×" + e.dmg.mult);
    if (e.mark) p.push("+1 ấn"); if (e.detonate) p.push("kích ấn"); if (e.release) p.push("trả đòn");
    if (e.store) p.push("hứng 60%"); if (e.guard) p.push("−50% sát thương");
    if (e.stun) p.push("trói " + Math.round(e.stun * 100) + "%"); if (e.blind) p.push("lóa −" + Math.round(e.blind * 100) + "%");
    if (e.debuff) p.push("−" + Math.round(e.debuff.pct * 100) + "% công"); if (e.drain) p.push("hút " + Math.round(e.drain * 100) + "%");
    if (e.sure) p.push("không né được");
    return p.join(" · ");
  }

  /* ---------- HEADER ---------- */
  function header() {
    if (!S || !S.flags.includes("system")) return `<div class="hud"><h1>Cursed <span>Destiny</span></h1></div>`;
    const d = CD.derived(S), need = CD.expRequired(S.level);
    return `<div class="hud">
      <div class="hud-top"><h1>Cursed <span>Destiny</span></h1><div class="lvl">${rankChip(S.rank)} <b>Lv ${S.level}</b>${S.unallocated ? `<button class="pts" data-tab="char">+${S.unallocated} điểm</button>` : ""}</div></div>
      <div class="hud-bars">${bar(S.cur.hp, d.maxHP, "hp")}${bar(S.cur.ce, d.maxCE, "ce")}${bar(S.cur.sta, d.maxSTA, "sta")}</div>
      <div class="exp"><i style="width:${(S.exp / need) * 100}%"></i></div>
      <div class="hud-meta"><span>EXP ${S.exp}/${need}</span><span>${S.currency.sp} ĐHT · ${S.currency.yen.toLocaleString("vi-VN")} ¥</span><span>${esc(S.time.label)} · Ngày ${S.time.day}</span></div>
    </div>`;
  }

  /* ---------- PHÔNG CẢNH ---------- */
  function hubEnv() { const L = CD.hubDef(S).locations[S.hub.loc]; const indoor = L.env === "dojo" || L.env === "morgue"; return { t: indoor ? "indoor" : CD.SLOT_TIME[S.hub.slot], p: L.env }; }
  function stage(cast, envOverride) {
    const env = envOverride || CD.ART.env(S.scene);
    return `<div class="stage t-${env.t}">${CD.ART.backdrop(S.scene, envOverride)}<span class="tchip">${CD.ART.TIME_LABEL[env.t]} · ${esc(S.time.label)}</span>
      ${cast && cast.length ? `<div class="cast">${cast.map((id) => `<figure class="pt ${id.startsWith("c_") ? "curse" : ""}">${CD.ART.portrait(id)}<figcaption>${esc(nameOf(id))}</figcaption></figure>`).join("")}</div>` : ""}</div>`;
  }

  /* ---------- TAB: TRUYỆN ---------- */
  function storyView() {
    if (S.pendingRank) return rankRewardView();
    if (combat) return combatView();
    const sc = SC[S.scene];
    if (sc.hub) return hubView(sc);
    let h = stage(CD.ART.cast(S.scene));
    h += `<article class="scene"><p class="chap">${esc(sc.chapter)}</p><h2>${esc(sc.title)}</h2><div class="text">${sc.text.map(line).join("")}</div></article>`;
    h += msgBox(msgs);
    if (sc.observe) h += `<div class="obs"><p class="label">Quan sát</p><div class="npcs">${sc.observe.map((n) => npcCard(n)).join("")}</div></div>`;
    if (sc.special) h += specialView(sc);
    else if (sc.choices) h += `<div class="choices">${sc.choices.map((c, i) => {
      const okk = CD.meets(S, c.req), rt = CD.reqText(c.req);
      if (c.hide && !okk) return "";
      return `<button class="choice" data-choice="${i}" ${okk ? "" : "disabled"}><span>${esc(c.t)}</span>${rt && !c.hide ? `<small>${esc(rt)}</small>` : ""}</button>`;
    }).join("")}</div>`;
    return h;
  }

  function specialView(sc) {
    if (sc.special === "traits") {
      if (S.traits.length) return contBtn(sc.go);
      return `<div class="panel"><p class="label">Chọn 2 đặc tính (${pick.length}/2)</p><p class="muted">Đặc tính nhân hệ số lên chỉ số, nên càng lên cấp càng mạnh. Ví dụ STR 40 với ×1.25 thành 50.</p><div class="cards">${Object.entries(D.TRAITS).map(([id, t]) =>
        `<button class="card ${pick.includes(id) ? "on" : ""}" data-trait="${id}"><em class="grp">${esc(t.group)}</em><strong>${esc(t.name)}</strong><span>${esc(t.desc)}</span></button>`).join("")}</div>
        <button class="primary" data-confirm-traits ${pick.length === 2 ? "" : "disabled"}>Xác nhận đặc tính</button></div>`;
    }
    if (sc.special === "interview") {
      if (ivIndex >= D.INTERVIEW.length) return contBtn(sc.go);
      const q = D.INTERVIEW[ivIndex];
      return `<div class="panel"><p class="label">Câu ${ivIndex + 1}/${D.INTERVIEW.length}</p><p class="say big">${esc(q.q)}</p><div class="choices">${q.a.map((a, i) => `<button class="choice" data-answer="${i}"><span>${esc(a.t)}</span></button>`).join("")}</div></div>`;
    }
    if (sc.special === "technique") {
      if (S.technique) return contBtn(sc.go);
      return `<div class="cards one">${CD.suggestTechniques(S, 3).map((id) => {
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
    if (sc.special === "rankup") return `<div class="choices"><button class="primary" data-rankup="${sc.go}">Kiểm tra đột phá</button></div>`;
    return "";
  }
  const contBtn = (to) => `<div class="choices"><button class="primary" data-go="${to}">Tiếp tục</button></div>`;

  /* ---------- PHẦN THƯỞNG ĐỘT PHÁ ---------- */
  function rankRewardView() {
    const r = S.pendingRank, R = D.RANK_REWARDS[r], f = R.fixed;
    const fixed = [f.sp ? f.sp + " Điểm Hệ thống" : "", f.yen ? f.yen.toLocaleString("vi-VN") + " yên" : "", f.item ? D.ITEMS[f.item].name + " (" + statLine(D.ITEMS[f.item].stats) + ")" : "", f.achievement ? "Thành tựu: " + D.ACHIEVEMENTS[f.achievement] : ""].filter(Boolean);
    return `<div class="rankup"><p class="chap">Đột phá</p><h2>Rank ${r} · ${esc(CD.RANK_INFO[r].grade)}</h2>
      <p class="label">Đã nhận</p><ul class="rules">${fixed.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${msgBox(msgs)}
      <p class="label">Chọn 1 phần thưởng</p><div class="cards one">${CD.rankChoices(S).map((c, i) => `<button class="card big pickable" data-claim="${i}"><strong class="tname">${esc(c.name)}</strong><span>${esc(c.desc)}</span></button>`).join("")}</div></div>`;
  }

  /* ---------- KHU TỰ DO ---------- */
  function hubView(sc) {
    const H = CD.hubDef(S), h = S.hub, L = H.locations[h.loc], over = CD.hubOver(S);
    const npcs = over ? [] : CD.hubNpcs(S);
    let out = stage(["shen"].concat(npcs), hubEnv());
    out += `<div class="hubbar"><div><strong>${esc(H.name)}</strong><span>${over ? "Đã hết thời gian tự do" : `Ngày ${H.days - h.daysLeft + 1}/${H.days} · ${CD.SLOTS[h.slot]}`}</span></div><div class="slots">${CD.SLOTS.map((n, i) => `<i class="${over || i < h.slot ? "used" : i === h.slot ? "now" : ""}">${n}</i>`).join("")}</div></div>`;
    if (h.daysLeft === H.days && h.slot === 0 && !hubOut) out += `<article class="scene compact"><p class="chap">${esc(sc.chapter)}</p><div class="text">${sc.text.map(line).join("")}<p>${esc(H.intro)}</p></div></article>`;
    out += msgBox(msgs);
    if (hubOut) out += `<div class="event">${hubOut.text.map(line).join("")}${msgBox(hubOut.msgs)}</div>`;
    if (over) return out + `<div class="choices"><button class="primary" data-go="${sc.go}">Tiếp tục cốt truyện</button></div>`;
    // Địa điểm
    out += `<p class="label">Địa điểm (di chuyển không tốn thời gian)</p><div class="locs">${Object.entries(H.locations).map(([id, l]) => {
      const here = id === h.loc, ev = CD.exploreEvents(S, id).length, people = CD.hubNpcs(S, id).length;
      return `<button class="loc ${here ? "on" : ""}" data-move="${id}"><span>${esc(l.name)}</span><small>${people ? people + " người" : ""}${ev ? (people ? " · " : "") + "có gì đó" : ""}</small></button>`;
    }).join("")}</div>`;
    // Hoạt động tại chỗ
    const evs = CD.exploreEvents(S).length;
    out += `<p class="label">Tại ${esc(L.name)}</p><div class="acts">
      <button class="act" data-hub="explore"><span>Khám phá</span><small>${evs ? "Có điều gì đó ở đây" : "Không còn gì đặc biệt"}</small></button>
      <button class="act" data-train-open><span>Luyện tập một mình</span><small>${h.trains}/${H.trainCap} buổi</small></button>
      <button class="act" data-hub="rest"><span>Nghỉ ngơi</span><small>Hồi đầy HP, CL, TL</small></button>
      <button class="act item" data-tab="shop"><span>Cửa hàng</span><small>Không tốn thời gian</small></button></div>`;
    if (trainOpen) out += `<div class="panel"><p class="label">Luyện chỉ số nào? (+1 cơ bản, +${30 * S.level} EXP)</p><div class="row">${CD.STATS.map((k) => `<button class="ghost sm" data-train="${k}" ${h.trains >= H.trainCap ? "disabled" : ""}>${k}</button>`).join("")}</div></div>`;
    // NPC
    if (npcs.length) out += `<p class="label">Người ở đây</p>` + npcs.map(npcPanel).join("");
    out += `<div class="endhub">${confirmEnd ? `<p class="muted">Bỏ qua ${h.daysLeft} ngày còn lại?</p><button class="primary" data-hub-end-yes>Xác nhận tiếp tục cốt truyện</button>` : `<button class="ghost sm" data-hub-end>Kết thúc sớm thời gian tự do</button>`}</div>`;
    return out;
  }
  function npcPanel(id) {
    const SO = D.SOCIAL[id] || {}, rel = S.rel[id] || 0, h = S.hub;
    const talked = h.daily["talk_" + id], gifted = h.daily["gift_" + id], spar = h.daily["spar_" + id];
    const canSpar = SO.train && rel >= (SO.train.minRel || 0);
    const next = (SO.bonds || []).find((b) => !S.txDone.includes("bond_" + id + "_" + SO.bonds.indexOf(b)));
    const gifts = S.inventory.filter((x) => D.ITEMS[x.id].gift);
    return `<div class="npcbox"><div class="fwrap"><div class="cpt">${CD.ART.portrait(id)}</div><div class="fbody">
      <div class="npc-h"><strong>${esc(nameOf(id))}</strong><em class="tier">${CD.relTier(rel)} · ${rel}</em></div>
      ${bar(Math.max(0, rel), 100, "rel")}
      ${next ? `<div class="mini">Mốc tiếp theo: ${next.rel} — ${esc(next.text)}</div>` : ""}
      <div class="row">
        <button class="ghost sm" data-talk="${id}" ${talked ? "disabled" : ""}>Trò chuyện</button>
        <button class="ghost sm" data-gift-open="${id}" ${gifted || !gifts.length ? "disabled" : ""}>Tặng quà${gifts.length ? "" : " (chưa có)"}</button>
        ${SO.train ? `<button class="ghost sm" data-spar="${id}" ${!canSpar || spar ? "disabled" : ""}>Luyện cùng (${SO.train.stats.join("/")})${canSpar ? "" : " · cần " + SO.train.minRel}</button>` : ""}
      </div>
      ${giftFor === id ? `<div class="row gifts">${gifts.map((g) => `<button class="ghost sm ${(SO.likes || []).includes(g.id) ? "liked" : ""}" data-gift="${g.id}">${esc(D.ITEMS[g.id].name)} ×${g.qty}</button>`).join("")}</div>` : ""}
    </div></div></div>`;
  }

  /* ---------- CHIẾN ĐẤU ---------- */
  function combatView() {
    const c = combat, d = CD.derived(S), hubF = S.hubFight;
    const sc = SC[S.scene], title = hubF ? hubF.title : sc.title;
    const env = hubF ? hubEnv() : CD.ART.env(S.scene);
    const tIdx = c.enemies.indexOf(CD.combat.target(c));
    let h = `<div class="arena t-${env.t}">${CD.ART.backdrop(S.scene, env)}<span class="tchip">Lượt ${c.round} · ${esc(title)}</span>
      <div class="foes">${c.enemies.map((e, i) => `<button class="fpt ${e.hp <= 0 ? "dead" : ""} ${i === tIdx && c.enemies.length > 1 ? "target" : ""}" data-target="${i}" ${e.hp <= 0 ? "disabled" : ""}>
        ${CD.ART.portrait(e.id)}${c.hits && c.hits.foe[i] ? `<b class="dmg">−${c.hits.foe[i]}</b>` : ""}</button>`).join("")}</div>
      <div class="mept">${CD.ART.portrait("shen")}${c.hits && c.hits.me ? `<b class="dmg me">−${c.hits.me}</b>` : ""}</div></div>`;
    h += `<div class="combat">`;
    h += c.enemies.map((e, i) => {
      const ob = c.observed.includes(e.id) ? CD.combat.observe(S, c, e) : null;
      const chips = [e.marks ? "Ấn " + e.marks + "/3" : "", e.stun ? "Bị trói" : ""].concat(e.debuff.map((b) => b.label + " (" + b.turns + ")")).filter(Boolean);
      return `<div class="foe ${e.hp <= 0 ? "dead" : ""} ${i === tIdx ? "tg" : ""}">
        <div class="foe-h"><strong>${esc(e.name)}</strong>${rankChip(e.rank)}<span class="muted">Lv ${e.lv}</span>${c.enemies.length > 1 && i === tIdx ? `<em class="tgl">Mục tiêu</em>` : ""}</div>
        ${bar(e.hp, e.d.maxHP, "hp")}${chips.length ? `<div class="chips">${chips.map((x) => `<i>${esc(x)}</i>`).join("")}</div>` : ""}
        ${ob ? `<details><summary class="gap ${ob.gap.cls}">${ob.gap.label}</summary>${ob.full ? `<div class="mini">${CD.STATS.map((k) => k + " " + e.stats[k]).join(" · ")}<br>Tấn công ${CD.fmt(e.d.patk)} · Uy lực ${CD.fmt(e.d.cpow)} · Giáp ${CD.fmt(e.d.pdef)} · Kháng chú ${CD.fmt(e.d.cdef)}<br>Chiêu: ${e.skills.map((x) => esc(x.name) + " ×" + x.mult + (x.cd ? " (hồi " + x.cd + ")" : "")).join(", ") || "Tấn công thường"}</div>` : `<div class="mini">Chênh lệch quá lớn để đọc chỉ số.</div>`}</details>`
          : e.hp > 0 ? `<button class="link" data-observe="${i}">Quan sát (miễn phí)</button>` : ""}
      </div>`;
    }).join("");
    const mine = [c.reflectArmed ? "Gương đang dựng" : "", c.stored ? "Đã tích " + c.stored + " sát thương" : ""].filter(Boolean);
    h += `<div class="me"><div class="foe-h"><strong>Shen</strong>${rankChip(S.rank)}<span class="muted">Lv ${S.level}</span></div>${bar(S.cur.hp, d.maxHP, "hp")}<div class="two">${bar(S.cur.ce, d.maxCE, "ce")}${bar(S.cur.sta, d.maxSTA, "sta")}</div>${mine.length ? `<div class="chips">${mine.map((x) => `<i class="good">${esc(x)}</i>`).join("")}</div>` : ""}</div>`;
    if (c.log.length) h += `<div class="clog">${c.log.map((l) => `<div class="${/gây|Kích|Trả lại|Nuốt/.test(l) ? "out" : / −\d+ HP|Khế ước/.test(l) ? "in" : ""}">${esc(l)}</div>`).join("")}</div>`;
    if ((c.history || []).length > 1) h += `<details class="hist"><summary>Nhật ký trận (${c.history.length} lượt)</summary>${c.history.slice().reverse().map((r) => `<div class="hr"><b>Lượt ${r.round}</b>${r.lines.map((l) => `<div>${esc(l)}</div>`).join("")}</div>`).join("")}</details>`;
    if (c.over) {
      const label = { win: "Chiến thắng", lose: "Thất bại", flee: "Đã thoát", survive: "Sống sót" }[c.over];
      const btn = hubF || c.hubDone ? `<button class="primary" data-hub-back>Quay lại khu tự do</button>` : `<button class="primary" data-go="${c.over === "win" || c.over === "survive" ? sc.combat.win : c.over === "flee" ? sc.combat.flee : sc.combat.lose}">Tiếp tục</button>`;
      return h + `<div class="result ${c.over}"><strong>${label}</strong>${(c.finishMsgs || []).map((m) => `<div>${esc(m)}</div>`).join("")}${btn}</div></div>`;
    }
    h += `</div>`;
    // Thanh hành động cố định
    const list = CD.combat.ready(S, c);
    const ready = list.filter((x) => !x.cd && CD.combat.affordable(S, x.sk)).map((x) => x.sk.name);
    const cds = list.filter((x) => x.cd).map((x) => x.sk.name + " " + x.cd);
    const items = S.inventory.filter((x) => D.ITEMS[x.id].use && (D.ITEMS[x.id].use.hp || D.ITEMS[x.id].use.ce));
    const canFlee = hubF ? hubF.canFlee : sc.combat.canFlee;
    h += `<div class="dock"><div class="ready"><span><b>Sẵn sàng:</b> ${ready.map(esc).join(", ") || "—"}</span>${cds.length ? `<span><b>Hồi chiêu:</b> ${cds.map(esc).join(", ")}</span>` : ""}</div>
      <div class="seg">${[["skill", "Kỹ năng"], ["item", "Vật phẩm" + (items.length ? " (" + items.reduce((a, x) => a + x.qty, 0) + ")" : "")], ["other", "Khác"]].map(([k, n]) => `<button data-dock="${k}" class="${dock === k ? "on" : ""}">${n}</button>`).join("")}</div>
      <div class="acts">${dock === "skill" ? list.map((x) => {
        const can = !x.cd && CD.combat.affordable(S, x.sk);
        return `<button class="act ${x.sk.tech ? "tech" : ""}" data-skill="${x.id}" ${can ? "" : "disabled"}><span>${esc(x.sk.name)}</span><small class="fx">${esc(shortFx(x.sk))}</small><small>${x.cd ? "Hồi chiêu " + x.cd + " lượt" : costText(x.sk)}</small></button>`;
      }).join("") : dock === "item" ? (items.map((x) => `<button class="act item" data-use="${x.id}"><span>${esc(D.ITEMS[x.id].name)} ×${x.qty}</span><small>${esc(D.ITEMS[x.id].lore)}</small></button>`).join("") || `<p class="muted">Không có vật phẩm dùng được trong trận.</p>`)
        : c.enemies.map((e, i) => e.hp > 0 && !c.observed.includes(e.id) ? `<button class="act" data-observe="${i}"><span>Quan sát ${esc(e.name)}</span><small>Miễn phí, không tốn lượt</small></button>` : "").join("") + (canFlee ? `<button class="act flee" data-flee><span>Bỏ chạy</span><small>Dựa trên chênh lệch AGI</small></button>` : `<p class="muted">Trận này không thể bỏ chạy.</p>`)}</div></div>`;
    return h;
  }

  /* ---------- TAB: CỬA HÀNG ---------- */
  function shopView() {
    let h = msgBox(shopNote ? [shopNote] : []);
    h += `<div class="wallet"><span><b>${S.currency.sp}</b> Điểm Hệ thống</span><span><b>${S.currency.yen.toLocaleString("vi-VN")}</b> yên</span></div>`;
    Object.entries(D.SHOPS).forEach(([sid, sh]) => {
      const open = CD.shopOpen(S, sid);
      h += `<section class="panel"><p class="label">${esc(sh.name)}${open ? "" : " · đóng cửa"}</p><p class="muted">${esc(sh.desc)}</p>${sh.items.map((x) => {
        const it = D.ITEMS[x.id], left = CD.shopStock(S, sid, x), cur = sh.currency === "sp" ? "ĐHT" : "¥";
        const afford = S.currency[sh.currency] >= x.price, reqOk = !x.req || CD.meets(S, x.req);
        const info = it.stats ? statLine(it.stats) : it.use ? (it.use.hp ? "Hồi " + it.use.hp + " HP" : "") + (it.use.ce ? (it.use.hp ? ", " : "") + "Hồi " + it.use.ce + " CL" : "") + (it.use.base ? statLine(it.use.base) + " vĩnh viễn" : "") + (it.use.points ? "+" + it.use.points + " điểm" : "") + (it.use.learn ? "Dạy: " + D.SKILLS[it.use.learn].name : "") : "";
        const likers = it.gift ? Object.entries(D.SOCIAL).filter(([, so]) => (so.likes || []).includes(x.id)).map(([n]) => nameOf(n)) : [];
        return `<div class="slot"><div><strong>${esc(it.name)}</strong> <em class="q">${esc(it.quality)}${it.slot ? " · " + it.slot : ""}</em>
          <div class="muted">${esc(info)}${it.req && it.req.rank ? " · Cần Rank " + it.req.rank : ""}${x.req ? " · " + esc(CD.reqText(x.req)) : ""}${likers.length ? " · Ai thích: " + esc(likers.join(", ")) : ""}${left !== Infinity ? " · Còn " + left : ""}</div></div>
          <button class="ghost sm buy" data-buy="${sid}:${x.id}" ${open && afford && left > 0 && reqOk ? "" : "disabled"}>${x.price.toLocaleString("vi-VN")} ${cur}</button></div>`;
      }).join("")}</section>`;
    });
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
      ${S.rankHistory.length ? `<p class="muted">Thưởng đột phá đã chọn: ${S.rankHistory.map((x) => x.rank + " · " + esc(x.pick)).join("; ")}</p>` : ""}
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
    let h = msgBox(msgs.length && tab === "inv" ? msgs : []);
    h += `<section class="panel"><p class="label">Đang trang bị</p>${["Vũ khí", "Găng tay", "Giáp", "Giày", "Phụ kiện"].map((slot) => {
      const id = S.equipment[slot], it = id && D.ITEMS[id];
      return `<div class="slot"><span>${slot}</span>${it ? `<div><strong>${esc(it.name)}</strong> <em class="q">${it.quality}</em><div class="muted">${statLine(it.stats)}</div></div>` : `<span class="muted">Trống</span>`}</div>`;
    }).join("")}</section>`;
    h += `<section class="panel"><p class="label">Hành trang</p>${S.inventory.map((x) => {
      const it = D.ITEMS[x.id];
      return `<div class="slot"><div><strong>${esc(it.name)}</strong>${x.qty > 1 ? " ×" + x.qty : ""} <em class="q">${it.quality}${it.slot ? " · " + it.slot : ""}</em><div class="muted">${it.stats ? statLine(it.stats) + " · " : ""}${esc(it.lore || "")}${it.req && it.req.rank ? " · Cần Rank " + it.req.rank : ""}</div></div>
        ${it.slot ? `<button class="ghost sm" data-equip="${x.id}" ${CD.canEquip(S, it) ? "" : "disabled"}>Trang bị</button>` : it.use ? `<button class="ghost sm" data-use-out="${x.id}">Dùng</button>` : ""}</div>`;
    }).join("") || `<p class="muted">Trống.</p>`}</section>`;
    return h;
  }

  /* ---------- TAB: THẾ GIỚI ---------- */
  function worldView() {
    const tier = CD.moralTier(S.moral), st = { active: "Đang làm", done: "Hoàn thành", failed: "Thất bại" };
    let h = `<section class="panel"><p class="label">Nhiệm vụ</p>${Object.entries(S.quests).map(([id, s]) =>
      `<div class="quest ${s}"><div><strong>${esc(D.QUESTS[id].name)}</strong><div class="muted">${esc(D.QUESTS[id].desc)}</div></div><em>${st[s]}</em></div>`).reverse().join("") || `<p class="muted">Chưa có nhiệm vụ.</p>`}</section>`;
    h += `<section class="panel"><p class="label">Thiện–Ác · ${esc(tier.name)}</p>
      <div class="moral">${CD.MORAL_TIERS.map((t) => `<span class="${t.id === tier.id ? "on" : ""}">${esc(t.name)}</span>`).join("")}</div>
      <p class="muted">Điểm: ${S.moral} · ${esc(tier.perk)}${Object.keys(tier.bonus).length ? " · Thưởng: " + statLine(tier.bonus) : ""}</p>
      <p class="label">Con đường Anti-hero</p>${bar(S.anti, 100, "anti")}<p class="muted">Mở khóa ở 30 điểm, dựa trên lịch sử hành động.</p></section>`;
    h += `<section class="panel"><p class="label">Quan hệ</p>${Object.keys(S.rel).length ? Object.entries(S.rel).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="relrow"><div class="cpt sm">${CD.ART.portrait(k)}</div><div class="fbody"><div class="npc-h"><strong>${esc(nameOf(k))}</strong><em class="tier">${CD.relTier(v)} · ${v}</em></div>${bar(Math.max(0, v), 100, "rel")}</div></div>`).join("") : `<p class="muted">Chưa có.</p>`}</section>`;
    h += `<section class="panel"><p class="label">Danh vọng</p><div class="kv">${Object.entries(CD.FACTIONS).map(([k, n]) => `<span>${esc(n)}</span><b>${S.rep[k] > 0 ? "+" : ""}${S.rep[k]}</b>`).join("")}</div></section>`;
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
    return `<section class="panel"><p class="label">Ô lưu</p>${[1, 2, 3].map(slot).join("")}<p class="muted">Game tự lưu sau mỗi hành động. Dữ liệu nằm trên trình duyệt này.</p></section>
      <section class="panel"><p class="label">Xuất / nhập</p><textarea id="io" rows="4" placeholder="Bấm Xuất để lấy mã lưu, hoặc dán mã lưu vào đây rồi bấm Nhập."></textarea>
      <div class="row"><button class="ghost sm" data-export>Xuất</button><button class="ghost sm" data-copy>Sao chép</button><button class="ghost sm" data-import>Nhập</button><button class="ghost sm" data-check>Kiểm tra toàn vẹn</button></div></section>
      ${msgBox(saveNote ? [saveNote] : [])}
      <section class="panel"><p class="label">Chiến dịch</p><p class="muted">Mã: ${esc(S.campaignId)}</p><button class="ghost" data-newgame>Chơi lại từ đầu</button>
      <div id="confirmNew" hidden><p class="hot">Toàn bộ tiến trình tự lưu sẽ bị thay thế.</p><button class="primary" data-newgame-yes>Xác nhận chơi lại</button></div></section>`;
  }

  /* ---------- RENDER ---------- */
  const TABS = [["story", "Truyện"], ["char", "Nhân vật"], ["inv", "Túi đồ"], ["shop", "Cửa hàng"], ["world", "Thế giới"], ["save", "Lưu"]];
  function render() {
    $("#hud").innerHTML = header();
    const sysOn = S.flags.includes("system"), inFight = combat && !combat.over && tab === "story";
    $("#main").innerHTML = tab === "story" || !sysOn ? storyView() : tab === "char" ? charView() : tab === "inv" ? invView() : tab === "shop" ? shopView() : tab === "world" ? worldView() : saveView();
    $("#tabs").innerHTML = sysOn && !inFight ? TABS.map(([k, n]) => `<button data-tab="${k}" class="${tab === k ? "on" : ""}">${n}${k === "char" && S.unallocated ? "<i></i>" : ""}${k === "story" && S.pendingRank ? "<i></i>" : ""}</button>`).join("") : "";
    $("#tabs").hidden = !sysOn || inFight;
    document.body.classList.toggle("fighting", !!inFight);
  }
  const keepScroll = (fn) => { const y = window.scrollY; fn(); render(); window.scrollTo({ top: y }); };

  /* ---------- SỰ KIỆN ---------- */
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b || b.disabled) return;
    const ds = b.dataset;
    if (ds.tab) { tab = ds.tab; saveNote = ""; shopNote = ""; render(); window.scrollTo({ top: 0 }); return; }
    if (ds.choice !== undefined) { const r = CD.choose(S, S.scene, +ds.choice); if (r) { const m = r.msgs; go(r.go); msgs = m.concat(msgs); render(); } return; }
    if (ds.go) { go(ds.go); return; }
    if (ds.trait) { keepScroll(() => { const i = pick.indexOf(ds.trait); if (i >= 0) pick.splice(i, 1); else if (pick.length < 2) pick.push(ds.trait); }); return; }
    if (ds.confirmTraits !== undefined) { if (CD.pickTraits(S, pick)) { msgs = ["Đặc tính: " + pick.map((p) => D.TRAITS[p].name).join(" + ")]; autosave(); } render(); return; }
    if (ds.answer !== undefined) { CD.answerInterview(S, ivIndex, +ds.answer); ivIndex++; autosave(); render(); return; }
    if (ds.tech) { CD.setTechnique(S, ds.tech); msgs = ["Thức tỉnh thuật thức: " + D.TECHNIQUES[ds.tech].name]; autosave(); render(); return; }
    if (ds.restr !== undefined) { CD.setRestriction(S, ds.restr || null); msgs = [ds.restr ? "Ký khế ước: " + D.RESTRICTIONS[ds.restr].name : "Không ký khế ước."]; autosave(); render(); return; }
    if (ds.rankup) { const m = CD.tryRankScene(S); go(ds.rankup); msgs = m.concat(msgs); render(); return; }
    if (ds.rankupNow !== undefined) { msgs = CD.tryRankScene(S); autosave(); tab = "story"; render(); return; }
    if (ds.claim !== undefined) { msgs = CD.claimRank(S, +ds.claim) || []; autosave(); render(); window.scrollTo({ top: 0 }); return; }
    if (ds.alloc) { keepScroll(() => { CD.allocate(S, ds.alloc, 1); autosave(); }); return; }
    if (ds.equip) { msgs = CD.equip(S, ds.equip); autosave(); render(); return; }
    if (ds.useOut) { keepScroll(() => { msgs = [CD.useItem(S, ds.useOut, false)]; autosave(); }); return; }
    if (ds.buy) { keepScroll(() => { const [sid, id] = ds.buy.split(":"); const r = CD.buy(S, sid, id); shopNote = r.ok ? r.msgs.join(" · ") : r.msg; autosave(); }); return; }
    // Khu tự do
    if (ds.move) { keepScroll(() => { CD.hubAct(S, "move", ds.move); hubOut = null; giftFor = null; trainOpen = false; msgs = []; autosave(); }); return; }
    if (ds.trainOpen !== undefined) { keepScroll(() => (trainOpen = !trainOpen)); return; }
    if (ds.giftOpen) { keepScroll(() => (giftFor = giftFor === ds.giftOpen ? null : ds.giftOpen)); return; }
    const hubDo = (kind, a, b2) => {
      msgs = []; giftFor = null; trainOpen = false; confirmEnd = false;
      hubOut = CD.hubAct(S, kind, a, b2);
      if (hubOut.combat) { S.hubFight = Object.assign({}, hubOut.combat, { loc: S.hub.loc }); combat = CD.combat.start(S, hubOut.combat.enemies, hubOut.combat); }
      autosave(); render();
    };
    if (ds.hub) { hubDo(ds.hub); return; }
    if (ds.train) { hubDo("train", ds.train); return; }
    if (ds.talk) { hubDo("talk", ds.talk); return; }
    if (ds.spar) { hubDo("spar", ds.spar); return; }
    if (ds.gift) { hubDo("gift", giftFor, ds.gift); return; }
    if (ds.hubEnd !== undefined) { keepScroll(() => (confirmEnd = true)); return; }
    if (ds.hubEndYes !== undefined) { S.hub.daysLeft = 0; S.hub.slot = 0; autosave(); render(); return; }
    if (ds.hubBack !== undefined) { combat = null; render(); window.scrollTo({ top: 0 }); return; }
    // Chiến đấu
    if (combat && !combat.over) {
      if (ds.dock) { keepScroll(() => (dock = ds.dock)); return; }
      if (ds.target !== undefined) { keepScroll(() => CD.combat.setTarget(combat, +ds.target)); return; }
      if (ds.observe !== undefined) { keepScroll(() => CD.combat.observe(S, combat, combat.enemies[+ds.observe])); return; }
      let act = null;
      if (ds.skill) act = { type: "skill", id: ds.skill };
      if (ds.use) act = { type: "item", id: ds.use };
      if (ds.flee !== undefined) act = { type: "flee" };
      if (act) {
        CD.combat.playerAct(S, combat, act);
        if (combat.over) {
          if (S.hubFight) { combat.finishMsgs = CD.hubFightEnd(S, combat); combat.hubDone = true; hubOut = null; }
          else combat.finishMsgs = CD.combat.finish(S, combat, S.scene);
          autosave();
        }
        render(); return;
      }
    }
    // Lưu
    if (ds.save) { saveNote = store.set("cd2_slot" + ds.save, CD.exportSave(S)) ? "Đã lưu vào ô " + ds.save + "." : "Trình duyệt chặn lưu dữ liệu."; render(); return; }
    if (ds.load) { const r = loadText(store.get("cd2_slot" + ds.load)); if (r.ok) resume(); else { saveNote = r.err; render(); } return; }
    if (ds.export !== undefined) { const v = CD.exportSave(S); saveNote = "Đã xuất mã lưu. Hãy sao chép và cất ở nơi an toàn."; render(); $("#io").value = v; return; }
    if (ds.copy !== undefined) { const t = $("#io"), v = t.value; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { saveNote = "Đã sao chép."; render(); $("#io").value = v; }).catch(() => t.select()); return; }
    if (ds.import !== undefined) { const v = $("#io").value.trim(); const r = loadText(v); if (r.ok) { saveNote = ""; resume(); } else { saveNote = r.err; render(); $("#io").value = v; } return; }
    if (ds.check !== undefined) { const e = CD.validate(S); saveNote = e.length ? "Phát hiện lỗi: " + e.join("; ") : "Dữ liệu toàn vẹn: không phát hiện lỗi."; render(); return; }
    if (ds.newgame !== undefined) { $("#confirmNew").hidden = false; return; }
    if (ds.newgameYes !== undefined) { saveNote = ""; newGame(); return; }
  });

  /* ---------- KHỞI ĐỘNG ---------- */
  function resume() {
    reset(); tab = "story";
    if (!SC[S.scene]) { go(S.world.arc === "arc1" ? "a1_hub2" : "a2_start"); return; }
    const sc = SC[S.scene];
    if (S.hubFight && S.hub) combat = CD.combat.start(S, S.hubFight.enemies, S.hubFight);
    else if (sc.combat) combat = CD.combat.start(S, sc.combat.enemies, sc.combat);
    if (sc.hub && !S.hub) CD.enterHub(S, sc.hub);
    render();
  }
  function start(data) {
    const t = (data && data.save) || store.get("cd2_auto");
    if (t && loadText(t).ok) resume(); else newGame();
  }
  window.claude?.hot?.snapshot?.(() => ({ save: S && CD.exportSave(S) }));
  window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
})();
