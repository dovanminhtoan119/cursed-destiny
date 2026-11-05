/* =====================================================================
   CURSED DESTINY — HÌNH ẢNH
   Phông cảnh ngày/đêm theo địa điểm, chân dung Shen và chú linh nguyên bản.
   Nhân vật của nguyên tác hiển thị bằng ấn bùa mang tên, không vẽ chân dung.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {});
  let uid = 0;
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ---------- Thời điểm & địa điểm của từng cảnh ---------- */
  const E = (t, p) => ({ t, p });
  const ENV = {
    p_intro: E("night", "school"), p_system: E("night", "school"), p_locker: E("night", "school"), p_open: E("night", "school"),
    p_touch: E("night", "school"), p_observe: E("night", "school"), p_light: E("night", "school"), p_talisman: E("night", "school"),
    p_guard: E("night", "school"), p_fight: E("night", "school"), p_win: E("night", "school"), p_lose: E("night", "school"),
    p_gojo: E("night", "school"), p_offer: E("night", "school"), p_why: E("night", "school"), p_enroll: E("night", "street"),
    a1_school: E("day", "temple"), a1_school2: E("day", "temple"), a1_meet: E("day", "temple"), a1_nobara: E("day", "city"),
    a1_roppongi: E("dusk", "building"), a1_rpg_fight: E("dusk", "building"), a1_rpg_lose: E("dusk", "building"),
    a1_child: E("dusk", "building"), a1_child_fight: E("dusk", "building"), a1_child_win: E("dusk", "building"), a1_child_lose: E("dusk", "building"),
    a1_training: E("day", "temple"), a1_train_yuji: E("day", "city"), a1_train_megumi: E("day", "temple"), a1_train_solo: E("indoor", "dojo"),
    a1_patrol: E("night", "station"), a1_patrol_fight: E("night", "station"), a1_patrol_win: E("night", "station"), a1_patrol_lose: E("night", "station"),
    a1_eishu: E("rain", "prison"), a1_punch_womb: E("rain", "prison"), a1_stay: E("rain", "prison"), a1_find: E("rain", "prison"),
    a1_flee: E("rain", "prison"), a1_heart: E("rain", "prison"), a1_morgue: E("indoor", "morgue"),
    a1_interview: E("night", "temple"), a1_tech: E("night", "temple"), a1_restrict: E("night", "temple"),
    a1_trial_brief: E("indoor", "dojo"), a1_trial: E("indoor", "dojo"), a1_trial_lose: E("indoor", "dojo"), a1_trial_win: E("indoor", "dojo"),
    a1_extra: E("night", "hospital"), a1_extra_fight: E("night", "hospital"), a1_extra_win: E("night", "hospital"), a1_end: E("dusk", "temple"),
  };
  const CAST = {
    p_intro: ["shen"], p_system: ["shen"], p_locker: ["shen", "c_tu44"], p_open: ["shen", "c_tu44"], p_touch: ["shen", "c_tu44"],
    p_observe: ["shen", "c_tu44"], p_light: ["shen", "c_tu44"], p_talisman: ["shen", "c_tu44"], p_guard: ["shen", "c_tu44"],
    p_win: ["shen"], p_lose: ["shen", "gojo"], p_gojo: ["shen", "gojo"], p_offer: ["shen", "gojo"], p_why: ["shen", "gojo"], p_enroll: ["shen"],
    a1_school: ["shen", "yaga"], a1_school2: ["shen", "yaga"], a1_meet: ["shen", "itadori", "fushiguro"], a1_nobara: ["shen", "kugisaki", "gojo"],
    a1_roppongi: ["shen", "ijichi", "gojo"], a1_rpg_lose: ["shen", "itadori"], a1_child: ["shen", "c_cap3_rpg", "kugisaki"],
    a1_child_win: ["shen", "kugisaki"], a1_child_lose: ["shen", "kugisaki"], a1_training: ["shen"], a1_train_yuji: ["shen", "itadori"],
    a1_train_megumi: ["shen", "fushiguro"], a1_train_solo: ["shen"], a1_patrol: ["shen", "ijichi"], a1_patrol_win: ["shen", "ijichi"],
    a1_patrol_lose: ["shen", "ijichi"], a1_eishu: ["shen", "ijichi", "c_womb"], a1_punch_womb: ["shen", "c_womb", "itadori"],
    a1_stay: ["shen", "itadori", "sukuna_a1"], a1_find: ["shen", "fushiguro", "kugisaki"], a1_flee: ["shen", "ijichi"],
    a1_heart: ["shen", "itadori", "fushiguro"], a1_morgue: ["shen", "gojo", "ieiri"], a1_interview: ["shen", "gojo"], a1_tech: ["shen"],
    a1_restrict: ["shen"], a1_trial_brief: ["shen", "yaga", "ieiri", "c_trial"], a1_trial_lose: ["shen", "yaga"], a1_trial_win: ["shen", "yaga"],
    a1_extra: ["shen", "ijichi", "c_hosp"], a1_extra_win: ["shen"], a1_end: ["shen"],
  };
  const TIME_LABEL = { day: "Ban ngày", dusk: "Hoàng hôn", night: "Ban đêm", rain: "Đêm mưa", indoor: "Trong nhà" };

  /* ---------- PHÔNG CẢNH ---------- */
  const SKY = {
    day: [["0", "#5d9bd5"], ["1", "#cfe7f6"]],
    dusk: [["0", "#2b1a4a"], [".55", "#d9724a"], ["1", "#f5c27a"]],
    night: [["0", "#05081a"], ["1", "#1b2552"]],
    rain: [["0", "#20252f"], ["1", "#4a5263"]],
    indoor: [["0", "#22170f"], ["1", "#3b2919"]],
  };
  const SIL = { day: "#3a4a5e", dusk: "#25172f", night: "#0a0c17", rain: "#191d27", indoor: "#120c08" };
  const WIN = { day: "#9fc3dd", dusk: "#f1a35f", night: "#ffd27a", rain: "#e9c171", indoor: "#ffd27a" };

  function windows(x0, y0, cols, rows, w, h, gx, gy, t, seed, litRate) {
    const r = rng(seed), lit = t === "night" || t === "rain" || t === "dusk";
    let s = "";
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const on = lit ? r() < (litRate || 0.35) : true;
      s += `<rect x="${x0 + i * gx}" y="${y0 + j * gy}" width="${w}" height="${h}" fill="${on ? WIN[t] : "#00000055"}" opacity="${t === "day" ? 0.55 : on ? 0.9 : 0.6}"/>`;
    }
    return s;
  }

  function place(p, t) {
    const c = SIL[t];
    const ground = `<rect x="0" y="196" width="600" height="24" fill="${c}"/>`;
    switch (p) {
      case "school": return `<rect x="70" y="92" width="460" height="108" fill="${c}"/><rect x="270" y="52" width="60" height="50" fill="${c}"/>
        <circle cx="300" cy="74" r="13" fill="${t === "day" ? "#e9eef2" : "#d8d2b8"}" opacity=".9"/><path d="M300 74 L300 65 M300 74 L307 77" stroke="${c}" stroke-width="2"/>
        ${windows(86, 104, 18, 3, 14, 16, 24.5, 30, t, 7, 0.12)}${ground}`;
      case "temple": return `<path d="M0 196 L0 150 L18 120 L36 150 L36 196 Z M40 196 L40 140 L62 100 L84 140 L84 196 Z M520 196 L520 135 L545 95 L570 135 L570 196 Z M560 196 L560 150 L580 118 L600 150 L600 196 Z" fill="${c}"/>
        <path d="M200 120 Q300 92 400 120 L388 126 Q300 106 212 126 Z" fill="${c}"/><rect x="226" y="124" width="148" height="34" fill="${c}"/>
        <path d="M180 162 Q300 130 420 162 L404 170 Q300 146 196 170 Z" fill="${c}"/><rect x="206" y="168" width="188" height="30" fill="${c}"/>
        ${windows(236, 132, 6, 1, 14, 18, 22, 0, t, 3, 0.7)}${windows(220, 176, 8, 1, 14, 16, 21, 0, t, 5, 0.6)}
        <rect x="120" y="150" width="8" height="48" fill="${c}"/><rect x="152" y="150" width="8" height="48" fill="${c}"/><rect x="110" y="146" width="60" height="7" fill="${c}"/><rect x="114" y="158" width="52" height="4" fill="${c}"/>${ground}`;
      case "city": {
        const r = rng(11); let s = "", x = 0;
        while (x < 600) { const w = 30 + r() * 50, h = 60 + r() * 120; s += `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" fill="${c}"/>` + windows(x + 6, 206 - h, Math.floor((w - 8) / 10), Math.floor((h - 14) / 14), 5, 7, 10, 14, t, Math.floor(x) + 3, 0.3); x += w + 4; }
        return s + ground;
      }
      case "building": return `<rect x="220" y="40" width="160" height="160" fill="${c}"/>${windows(232, 52, 7, 9, 12, 10, 21, 16, t, 21, 0.08)}
        <path d="M300 40 L292 80 L306 110 L296 150" stroke="${t === "day" ? "#22303d" : "#000"}" stroke-width="3" fill="none"/>
        <rect x="40" y="120" width="120" height="80" fill="${c}"/><rect x="440" y="100" width="130" height="100" fill="${c}"/>
        <path d="M150 200 Q300 0 450 200 Z" fill="#000" opacity=".38"/><path d="M150 200 Q300 0 450 200" stroke="#000" stroke-width="2" fill="none" opacity=".6"/>${ground}`;
      case "prison": return `<rect x="0" y="130" width="600" height="70" fill="${c}"/><rect x="420" y="60" width="44" height="140" fill="${c}"/><rect x="410" y="52" width="64" height="14" fill="${c}"/>
        <path d="M0 128 ${Array.from({ length: 40 }, (_, i) => `L${i * 15 + 7} ${i % 2 ? 122 : 128}`).join(" ")}" stroke="${c}" stroke-width="2" fill="none"/>
        <path d="M442 66 L340 200 L250 200 Z" fill="#fff6c8" opacity="${t === "rain" || t === "night" ? 0.12 : 0}"/>${windows(20, 150, 20, 1, 8, 12, 30, 0, t, 9, 0.15)}${ground}`;
      case "station": return `<rect x="0" y="160" width="600" height="14" fill="${c}"/><path d="M0 186 L600 186 M0 194 L600 194" stroke="${c}" stroke-width="3"/>
        <path d="M60 110 L540 110 L540 118 L60 118 Z" fill="${c}"/>${[100, 220, 340, 460].map((x) => `<rect x="${x}" y="118" width="6" height="42" fill="${c}"/>`).join("")}
        ${[160, 400].map((x) => `<rect x="${x}" y="70" width="4" height="90" fill="${c}"/><circle cx="${x + 2}" cy="70" r="6" fill="${WIN[t]}" opacity="${t === "night" ? 0.9 : 0.3}"/>`).join("")}${ground}`;
      case "hospital": return `<rect x="150" y="70" width="300" height="130" fill="${c}"/>${windows(166, 86, 9, 4, 14, 16, 31, 28, t, 13, 0.06)}
        <rect x="286" y="40" width="28" height="34" fill="${c}"/><path d="M300 46 L300 68 M289 57 L311 57" stroke="#b33" stroke-width="5" opacity=".75"/>${ground}`;
      case "street": return `${[0, 110, 230, 360, 480].map((x, i) => `<path d="M${x} 200 L${x} ${140 + (i % 2) * 10} L${x + 50} ${115 + (i % 2) * 10} L${x + 100} ${140 + (i % 2) * 10} L${x + 100} 200 Z" fill="${c}"/>` + windows(x + 30, 160 + (i % 2) * 6, 2, 1, 14, 14, 26, 0, t, i + 2, 0.6)).join("")}
        <rect x="95" y="60" width="5" height="140" fill="${c}"/><rect x="345" y="60" width="5" height="140" fill="${c}"/><path d="M0 72 Q97 86 97 66 Q220 92 347 66 Q470 92 600 72" stroke="${c}" stroke-width="1.5" fill="none"/>${ground}`;
      case "dojo": return `<rect x="0" y="0" width="600" height="220" fill="#00000033"/>${[40, 200, 380, 540].map((x) => `<rect x="${x}" y="0" width="22" height="220" fill="#1a110a"/>`).join("")}
        <rect x="0" y="22" width="600" height="14" fill="#1a110a"/><rect x="0" y="180" width="600" height="40" fill="#2a1c10"/>
        ${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 52} 180 L${i * 52 - 30} 220" stroke="#1a110a" stroke-width="2"/>`).join("")}
        ${[110, 140, 450, 480].map((x) => `<rect x="${x}" y="60" width="12" height="44" fill="#e9e2cf"/><rect x="${x + 2}" y="66" width="8" height="2" fill="#c33"/><rect x="${x + 2}" y="72" width="8" height="18" fill="#c33" opacity=".35"/>`).join("")}
        <path d="M300 36 L300 70" stroke="#1a110a" stroke-width="2"/><ellipse cx="300" cy="86" rx="16" ry="20" fill="#e9a443"/><ellipse cx="300" cy="86" rx="40" ry="40" fill="#ffcf70" opacity=".12"/>`;
      case "morgue": return `<rect x="0" y="0" width="600" height="220" fill="#0e1418"/>${Array.from({ length: 4 }, (_, j) => Array.from({ length: 6 }, (_, i) => `<rect x="${330 + i * 42}" y="${40 + j * 36}" width="38" height="32" fill="#28323a" stroke="#3b4752"/><rect x="${343 + i * 42}" y="${54 + j * 36}" width="12" height="3" fill="#7a8894"/>`).join("")).join("")}
        <rect x="60" y="150" width="200" height="12" fill="#3b4752"/><rect x="70" y="162" width="6" height="40" fill="#3b4752"/><rect x="244" y="162" width="6" height="40" fill="#3b4752"/><path d="M70 150 Q160 128 250 150 Z" fill="#dfe6ea"/>
        <path d="M160 0 L160 30" stroke="#3b4752" stroke-width="2"/><path d="M140 30 L180 30 L172 40 L148 40 Z" fill="#3b4752"/><path d="M148 40 L80 150 L240 150 L172 40 Z" fill="#d9f0ff" opacity=".08"/>`;
    }
    return ground;
  }

  CD.ART = {
    TIME_LABEL,
    env(id) { return ENV[id] || { t: "night", p: "school" }; },
    cast(id) { return CAST[id] || []; },
    backdrop(id) {
      const { t, p } = this.env(id), k = "sky" + ++uid, r = rng(5);
      let s = `<svg class="bg" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${TIME_LABEL[t]}">
        <defs><linearGradient id="${k}" x1="0" y1="0" x2="0" y2="1">${SKY[t].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>
        <radialGradient id="${k}g"><stop offset="0" stop-color="#fff3c4" stop-opacity=".8"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient></defs>
        <rect width="600" height="220" fill="url(#${k})"/>`;
      if (t === "night") {
        for (let i = 0; i < 70; i++) s += `<circle cx="${(r() * 600).toFixed(1)}" cy="${(r() * 130).toFixed(1)}" r="${(r() * 1.2 + 0.3).toFixed(2)}" fill="#fff" opacity="${(r() * 0.7 + 0.3).toFixed(2)}"/>`;
        s += `<circle cx="480" cy="48" r="34" fill="url(#${k}g)" opacity=".5"/><circle cx="480" cy="48" r="17" fill="#f3edd0"/><circle cx="488" cy="43" r="15" fill="#0b1030"/>`;
      }
      if (t === "day") s += `<circle cx="480" cy="46" r="60" fill="url(#${k}g)"/><circle cx="480" cy="46" r="20" fill="#fff1b0"/>
        <ellipse cx="140" cy="50" rx="46" ry="12" fill="#fff" opacity=".7"/><ellipse cx="170" cy="42" rx="30" ry="12" fill="#fff" opacity=".7"/><ellipse cx="360" cy="70" rx="40" ry="9" fill="#fff" opacity=".55"/>`;
      if (t === "dusk") s += `<circle cx="470" cy="150" r="70" fill="url(#${k}g)"/><circle cx="470" cy="150" r="26" fill="#ffcf7a"/>`;
      s += place(p, t);
      if (t === "rain") { for (let i = 0; i < 90; i++) { const x = r() * 640, y = r() * 220; s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-6 16" stroke="#b9c6d6" stroke-width="1" opacity=".45"/>`; } }
      if (t === "night" || t === "rain") s += `<rect width="600" height="220" fill="#000818" opacity=".15"/>`;
      return s + `</svg>`;
    },

    /* ---------- CHÂN DUNG ---------- */
    portrait(id) {
      const n = CD.DATA && CD.DATA.NPCS[id];
      const k = "pt" + ++uid;
      const frame = (inner, bg) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${id === "shen" ? "Shen" : n ? n.name : id}">
        <defs><radialGradient id="${k}" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient></defs>
        <rect width="100" height="100" fill="url(#${k})"/>${inner}</svg>`;
      if (id === "shen") return frame(SHEN, ["#2a2f4a", "#10121c"]);
      if (CURSE_ART[id]) return frame(CURSE_ART[id], ["#3a1840", "#0e0812"]);
      // Nhân vật nguyên tác: ấn bùa mang tên
      const name = n ? n.name : id, initial = name.trim().charAt(0).toUpperCase();
      const curse = n && n.faction === "chulinh" || id.startsWith("c_");
      return frame(`<rect x="24" y="8" width="52" height="84" fill="#ece5d1"/><rect x="28" y="12" width="44" height="76" fill="none" stroke="${curse ? "#3a0f14" : "#cc3640"}" stroke-width="2"/>
        <text x="50" y="58" text-anchor="middle" font-family="'Times New Roman', Times, serif" font-size="34" font-weight="700" fill="${curse ? "#3a0f14" : "#cc3640"}">${initial}</text>
        <circle cx="50" cy="76" r="6" fill="none" stroke="${curse ? "#3a0f14" : "#cc3640"}" stroke-width="1.5"/><path d="M47 76 L53 76 M50 73 L50 79" stroke="${curse ? "#3a0f14" : "#cc3640"}" stroke-width="1.5"/>
        <path d="M34 22 L66 22" stroke="#1c1a22" stroke-width="1.2" opacity=".5"/>`, curse ? ["#3b0f18", "#0d0508"] : ["#24283e", "#0d0f18"]);
    },
  };

  /* Shen — thiết kế nguyên bản: tóc xanh đen rối, một lọn bạc, cổ áo cao gắn thẻ bùa đỏ */
  const SHEN = `<path d="M8 100 C12 78 30 70 50 70 C70 70 88 78 92 100 Z" fill="#0c0d14"/>
    <path d="M37 63 L63 63 L66 80 L50 86 L34 80 Z" fill="#14151f" stroke="#2c3045" stroke-width="1"/><circle cx="50" cy="90" r="2.2" fill="#d9b45f"/>
    <rect x="59" y="68" width="5" height="9" fill="#cc3640"/><path d="M61.5 77 L61.5 83" stroke="#cc3640" stroke-width="1"/>
    <rect x="44" y="54" width="12" height="12" fill="#d9b796"/>
    <ellipse cx="50" cy="42" rx="16" ry="19" fill="#ebc8a5"/>
    <path d="M44 51 Q50 53 56 51" stroke="#a5735a" stroke-width="1" fill="none"/>
    <ellipse cx="43" cy="43" rx="3.4" ry="2.2" fill="#f4f1ea"/><ellipse cx="57" cy="43" rx="3.4" ry="2.2" fill="#f4f1ea"/>
    <circle cx="43.4" cy="43" r="1.7" fill="#5b6a8c"/><circle cx="56.6" cy="43" r="1.7" fill="#5b6a8c"/><circle cx="43.4" cy="43" r=".7" fill="#0c0d14"/><circle cx="56.6" cy="43" r=".7" fill="#0c0d14"/>
    <path d="M38.5 38.5 L47 37.5 M53 37.5 L61.5 38.5" stroke="#1a1f36" stroke-width="1.6"/>
    <path d="M31 44 C28 22 39 12 51 13 C64 13 73 23 69 44 L66 33 L62 39 L59 27 L54 35 L49 25 L45 34 L40 27 L37 37 L34 31 Z" fill="#1a1f36"/>
    <path d="M57 15 C60 22 61 28 59 34" stroke="#c9ccd8" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  /* Chú linh nguyên bản của game */
  const swarm = (() => { const r = rng(42); let s = ""; for (let i = 0; i < 22; i++) { const x = 18 + r() * 64, y = 22 + r() * 62, rr = 5 + r() * 7; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#2b1636" stroke="#5b2d6e"/><circle cx="${x.toFixed(1)}" cy="${(y - 1).toFixed(1)}" r="${(rr * 0.35).toFixed(1)}" fill="#e8d36a"/><circle cx="${x.toFixed(1)}" cy="${(y - 1).toFixed(1)}" r="${(rr * 0.15).toFixed(1)}" fill="#120812"/>`; } return s; })();
  const CURSE_ART = {
    c_tu44: `<rect x="26" y="10" width="44" height="82" fill="#5a6170" stroke="#2f343e" stroke-width="2"/><rect x="30" y="14" width="36" height="74" fill="#07070b"/>
      <path d="M70 10 L86 16 L86 86 L70 92 Z" fill="#454b57"/>${[22, 26, 30].map((y) => `<path d="M74 ${y} L83 ${y + 1}" stroke="#2f343e" stroke-width="1.5"/>`).join("")}
      <ellipse cx="48" cy="48" rx="15" ry="11" fill="#efd6d6"/><path d="M34 46 L40 47 M60 52 L55 50 M38 54 L43 52" stroke="#b3121e" stroke-width=".8"/>
      <circle cx="48" cy="48" r="7.5" fill="#b3121e"/><circle cx="48" cy="48" r="3.2" fill="#000"/><circle cx="45.5" cy="45.5" r="1.4" fill="#fff" opacity=".8"/>
      <path d="M34 88 Q36 96 38 88 M46 88 Q48 99 50 88 M57 88 Q59 95 61 88" fill="#000"/><path d="M30 70 Q40 62 50 70 Q60 78 66 68" stroke="#000" stroke-width="5" fill="none" opacity=".7"/>`,
    c_cap4a: `<path d="M50 22 C74 22 82 44 78 62 C74 80 62 88 50 88 C38 88 26 80 22 62 C18 44 26 22 50 22 Z" fill="#4b2a5e"/>
      <path d="M22 56 C10 62 8 78 4 90 M78 56 C90 62 92 78 96 90" stroke="#4b2a5e" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M32 58 Q50 78 68 58 Q50 66 32 58 Z" fill="#12070f"/>${[36, 42, 48, 54, 60].map((x) => `<path d="M${x} 59 L${x + 3} 66 L${x + 6} 60 Z" fill="#f1ead8"/>`).join("")}
      <circle cx="40" cy="42" r="3.5" fill="#e8d36a"/><circle cx="60" cy="42" r="3.5" fill="#e8d36a"/><circle cx="50" cy="35" r="2.5" fill="#e8d36a"/>`,
    c_cap4b: `<rect x="14" y="8" width="72" height="20" fill="#5a6170" stroke="#2f343e"/>${[20, 30, 40, 50, 60, 70].map((x) => `<path d="M${x} 10 L${x} 26" stroke="#2f343e" stroke-width="2"/>`).join("")}
      <path d="M44 26 C30 44 70 50 52 66 C38 78 64 86 56 96" stroke="#8a8478" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M44 26 C30 44 70 50 52 66 C38 78 64 86 56 96" stroke="#5d564d" stroke-width="15" fill="none" stroke-linecap="round" stroke-dasharray="2 6"/>
      <ellipse cx="44" cy="34" rx="11" ry="9" fill="#8a8478"/><circle cx="40" cy="33" r="2.4" fill="#f4f1ea"/><circle cx="48" cy="33" r="2.4" fill="#f4f1ea"/><path d="M40 39 Q44 42 48 39" stroke="#12070f" stroke-width="1.5" fill="none"/>`,
    c_cap3_rpg: `<rect x="47" y="30" width="6" height="70" fill="#5b3e22"/><rect x="12" y="44" width="76" height="6" fill="#5b3e22"/>
      <path d="M12 47 L4 40 M12 47 L3 50 M12 47 L6 57 M88 47 L96 40 M88 47 L97 50 M88 47 L94 57" stroke="#5b3e22" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 48 L36 80 L64 80 L70 48 Z" fill="#6e4f2c"/><path d="M36 80 L32 90 M44 80 L42 92 M56 80 L58 92 M64 80 L68 90" stroke="#c9a85e" stroke-width="2"/>
      <circle cx="50" cy="28" r="17" fill="#b89a6a"/><path d="M41 22 L47 28 M47 22 L41 28 M53 22 L59 28 M59 22 L53 28" stroke="#12070f" stroke-width="2"/>
      <path d="M40 36 L60 36" stroke="#12070f" stroke-width="1.5"/>${[42, 46, 50, 54, 58].map((x) => `<path d="M${x} 33 L${x} 39" stroke="#12070f" stroke-width="1"/>`).join("")}
      <path d="M33 16 L30 8 M40 12 L39 4 M60 12 L62 5 M67 17 L71 10" stroke="#c9a85e" stroke-width="2"/>`,
    c_cap4c: swarm,
    c_trial: `${[[20, 70, 4, 96], [30, 76, 18, 98], [70, 76, 82, 98], [80, 70, 96, 94], [26, 50, 4, 40], [74, 50, 96, 38]].map(([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2 + 8} ${(b + d) / 2} ${c} ${d}" stroke="#2e1f3d" stroke-width="7" fill="none" stroke-linecap="round"/>`).join("")}
      <ellipse cx="50" cy="54" rx="30" ry="28" fill="#2e1f3d"/><path d="M30 58 Q50 84 70 58 Q50 70 30 58 Z" fill="#cc3640"/>${[34, 40, 46, 52, 58, 64].map((x) => `<path d="M${x} 59 L${x + 2} 66 L${x + 4} 60 Z" fill="#f1ead8"/>`).join("")}
      <circle cx="50" cy="40" r="7" fill="#e8d36a"/><ellipse cx="50" cy="40" rx="2" ry="6" fill="#000"/>
      <path d="M8 30 L92 76 M8 78 L92 30" stroke="#8b8f9c" stroke-width="2.5" stroke-dasharray="5 3"/>`,
    c_hosp: `<rect x="80" y="10" width="3" height="88" fill="#5a6170"/><rect x="74" y="12" width="14" height="18" rx="3" fill="#c9d6dc" opacity=".7"/><path d="M81 30 Q70 50 58 56" stroke="#c9d6dc" stroke-width="1" fill="none"/>
      <path d="M20 92 L30 70 L40 80 M74 92 L64 70 L56 80" stroke="#cfcfd6" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M26 70 Q48 50 68 70 Q48 80 26 70 Z" fill="#b8b8c4"/><path d="M14 64 L28 66 M82 60 L66 66" stroke="#cfcfd6" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="46" cy="46" rx="14" ry="17" fill="#d9d9e0"/><ellipse cx="41" cy="44" rx="3.5" ry="5" fill="#0a0a10"/><ellipse cx="51" cy="44" rx="3.5" ry="5" fill="#0a0a10"/><ellipse cx="46" cy="56" rx="4" ry="5" fill="#0a0a10"/>
      <path d="M32 34 Q30 20 44 26 Q52 18 60 30" stroke="#1a1a22" stroke-width="3" fill="none"/>`,
  };
})(typeof window !== "undefined" ? window : globalThis);
