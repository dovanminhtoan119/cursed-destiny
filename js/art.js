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
      case "sewer": return `<rect x="0" y="0" width="600" height="220" fill="#0b0f0e"/>${[0, 1, 2].map((i) => `<path d="M${60 + i * 170} 220 L${60 + i * 170} 90 Q${145 + i * 170} 10 ${230 + i * 170} 90 L${230 + i * 170} 220" fill="none" stroke="#2a3330" stroke-width="14"/>`).join("")}
        <rect x="0" y="180" width="600" height="40" fill="#14211e"/><path d="M0 196 Q150 188 300 196 T600 196" stroke="#3f6b5e" stroke-width="2" fill="none" opacity=".6"/>
        <rect x="0" y="40" width="600" height="8" fill="#1d2523"/><circle cx="300" cy="60" r="5" fill="#cfe9a8" opacity=".5"/><path d="M300 65 L250 180 L350 180 Z" fill="#cfe9a8" opacity=".05"/>`;
      case "forest": { const r = rng(17); let s = ""; for (let i = 0; i < 22; i++) { const x = r() * 620 - 10, h = 90 + r() * 110, w = 26 + r() * 30; s += `<path d="M${x} 200 L${x + w / 2} ${200 - h} L${x + w} 200 Z" fill="${c}" opacity="${0.75 + r() * 0.25}"/><rect x="${x + w / 2 - 2}" y="196" width="4" height="8" fill="${c}"/>`; } return s + ground; }
      case "river": return `<rect x="0" y="150" width="600" height="50" fill="${t === "day" ? "#6e9fc4" : t === "dusk" ? "#b0684f" : "#18223a"}" opacity=".85"/>
        <path d="M0 165 Q150 160 300 166 T600 164 M0 180 Q150 176 300 182 T600 178" stroke="#fff" stroke-width="1" opacity=".3" fill="none"/>
        <path d="M0 150 L600 150 L600 140 Q300 128 0 140 Z" fill="${c}"/><path d="M380 150 L380 112 L600 112 L600 150" fill="none" stroke="${c}" stroke-width="5"/>${[400, 440, 480, 520, 560].map((x) => `<rect x="${x}" y="112" width="3" height="38" fill="${c}"/>`).join("")}
        <rect x="0" y="198" width="600" height="22" fill="${c}"/>`;
      case "morgue": return `<rect x="0" y="0" width="600" height="220" fill="#0e1418"/>${Array.from({ length: 4 }, (_, j) => Array.from({ length: 6 }, (_, i) => `<rect x="${330 + i * 42}" y="${40 + j * 36}" width="38" height="32" fill="#28323a" stroke="#3b4752"/><rect x="${343 + i * 42}" y="${54 + j * 36}" width="12" height="3" fill="#7a8894"/>`).join("")).join("")}
        <rect x="60" y="150" width="200" height="12" fill="#3b4752"/><rect x="70" y="162" width="6" height="40" fill="#3b4752"/><rect x="244" y="162" width="6" height="40" fill="#3b4752"/><path d="M70 150 Q160 128 250 150 Z" fill="#dfe6ea"/>
        <path d="M160 0 L160 30" stroke="#3b4752" stroke-width="2"/><path d="M140 30 L180 30 L172 40 L148 40 Z" fill="#3b4752"/><path d="M148 40 L80 150 L240 150 L172 40 Z" fill="#d9f0ff" opacity=".08"/>`;
    }
    return ground;
  }

  CD.ART = {
    TIME_LABEL,
    env(id) { const sc = CD.SCENES && CD.SCENES[id]; if (sc && sc.env) { const [t, p] = sc.env.split("/"); return { t, p }; } return ENV[id] || { t: "night", p: "school" }; },
    cast(id) { const sc = CD.SCENES && CD.SCENES[id]; return (sc && sc.cast) || CAST[id] || []; },
    envOf(t, p) { return { t, p }; },
    backdrop(id, override) {
      const { t, p } = override || this.env(id), k = "sky" + ++uid, r = rng(5);
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
  /* Chú linh nguyên bản bổ sung (Arc 1–3) */
  const twisted = (skin, extra) => `<path d="M30 96 C26 76 34 60 44 52 C40 40 46 28 56 28 C68 28 72 42 64 52 C76 60 80 78 72 96 Z" fill="${skin}"/>
      <path d="M44 56 C30 54 20 62 14 74 M64 58 C78 50 86 40 90 28" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="53" cy="38" rx="3" ry="5" fill="#120812" transform="rotate(-20 53 38)"/><ellipse cx="61" cy="41" rx="2" ry="3.5" fill="#120812"/><path d="M50 47 Q56 52 62 46" stroke="#120812" stroke-width="2" fill="none"/>
      <path d="M40 66 Q50 72 60 64 M36 80 Q50 86 66 78" stroke="#00000055" stroke-width="2" fill="none"/>${extra || ""}`;
  Object.assign(CURSE_ART, {
    c_doll: `<rect x="42" y="16" width="16" height="16" rx="3" fill="#a07a4c"/><circle cx="47" cy="23" r="1.6" fill="#1a110a"/><circle cx="53" cy="23" r="1.6" fill="#1a110a"/>
      <rect x="36" y="34" width="28" height="30" rx="4" fill="#8b6a40"/><path d="M36 38 L20 54 M64 38 L80 30" stroke="#8b6a40" stroke-width="7" stroke-linecap="round"/>
      <circle cx="80" cy="28" r="6" fill="#a07a4c"/><path d="M42 64 L38 92 M58 64 L62 92" stroke="#8b6a40" stroke-width="8" stroke-linecap="round"/>
      <rect x="44" y="40" width="12" height="16" fill="#e9e2cf"/><path d="M47 44 L53 44 M47 48 L53 48" stroke="#cc3640" stroke-width="1.5"/>`,
    c_alley: `<rect x="0" y="0" width="100" height="100" fill="#000" opacity=".35"/><path d="M14 92 C14 60 30 34 50 34 C70 34 86 60 86 92 Z" fill="#1a1222"/>
      <circle cx="40" cy="56" r="5" fill="#e8d36a"/><circle cx="60" cy="56" r="5" fill="#e8d36a"/><ellipse cx="40" cy="56" rx="1.2" ry="4" fill="#000"/><ellipse cx="60" cy="56" rx="1.2" ry="4" fill="#000"/>
      <path d="M36 70 L42 76 L48 70 L54 76 L60 70 L64 74" stroke="#f1ead8" stroke-width="2" fill="none"/><path d="M20 40 L14 26 M80 40 L88 26" stroke="#1a1222" stroke-width="5" stroke-linecap="round"/>`,
    c_school: `<rect x="18" y="64" width="64" height="6" fill="#7a5a36"/><rect x="22" y="70" width="5" height="24" fill="#7a5a36"/><rect x="73" y="70" width="5" height="24" fill="#7a5a36"/>
      <path d="M30 64 C26 40 36 20 50 20 C64 20 74 40 70 64 Z" fill="#3c2c4a"/>${[34, 42, 50, 58, 66].map((x, i) => `<path d="M${x} ${30 + (i % 2) * 6} L${x + 4} ${34 + (i % 2) * 6}" stroke="#e9e2cf" stroke-width="1.2"/>`).join("")}
      <circle cx="44" cy="40" r="4" fill="#cc3640"/><circle cx="56" cy="40" r="4" fill="#cc3640"/><path d="M42 52 Q50 58 58 52" stroke="#e9e2cf" stroke-width="2" fill="none"/>
      <text x="50" y="62" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" fill="#e9e2cf" opacity=".7">CHẾT ĐI</text>`,
    c_kaihen: twisted("#b49a9a"),
    c_kaihen2: twisted("#a78d9a", `<ellipse cx="38" cy="44" rx="9" ry="10" fill="#a78d9a"/><circle cx="35" cy="42" r="2" fill="#120812"/><circle cx="41" cy="43" r="2" fill="#120812"/><path d="M34 49 Q38 52 42 49" stroke="#120812" stroke-width="1.5" fill="none"/>`),
    c_kaihen_big: `<rect x="0" y="0" width="100" height="100" fill="#000" opacity=".2"/><path d="M8 100 C6 64 22 40 50 40 C78 40 94 64 92 100 Z" fill="#9c8484"/>
      <ellipse cx="50" cy="30" rx="13" ry="12" fill="#9c8484"/><circle cx="45" cy="29" r="2.2" fill="#120812"/><circle cx="56" cy="31" r="1.6" fill="#120812"/><path d="M44 37 L56 37" stroke="#120812" stroke-width="1.5"/>
      <path d="M14 64 C2 76 4 92 10 100 M86 64 C98 76 96 92 90 100" stroke="#9c8484" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M30 60 Q50 70 70 60 M24 78 Q50 90 76 78" stroke="#00000044" stroke-width="3" fill="none"/><rect x="40" y="46" width="20" height="8" fill="#2c3045" opacity=".7"/>`,
    c_pool: `<rect x="0" y="62" width="100" height="38" fill="#2c6b6a"/><path d="M0 66 Q25 60 50 66 T100 66" stroke="#9fd6cf" stroke-width="1.5" fill="none" opacity=".6"/>
      <path d="M36 66 C34 44 40 26 50 26 C60 26 66 44 64 66 Z" fill="#e6eef0"/><path d="M40 28 C36 40 34 56 30 66 M60 28 C64 40 66 56 70 66" stroke="#1d2a33" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="40" rx="3" ry="4" fill="#0a0a10"/><ellipse cx="55" cy="40" rx="3" ry="4" fill="#0a0a10"/><path d="M46 52 Q50 50 54 52" stroke="#0a0a10" stroke-width="1.5" fill="none"/>
      <path d="M64 58 C76 50 84 40 86 30" stroke="#e6eef0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M83 30 L80 22 M86 30 L87 21 M89 31 L93 24" stroke="#e6eef0" stroke-width="2"/>`,
    c_tunnel: `<rect x="0" y="0" width="100" height="100" fill="#000" opacity=".35"/><path d="M10 100 L10 46 Q50 6 90 46 L90 100" fill="none" stroke="#2a3330" stroke-width="6"/>
      <path d="M22 100 L22 58 Q50 30 78 58 L78 100 Z" fill="#20151c"/><circle cx="38" cy="62" r="9" fill="#fff6c8"/><circle cx="62" cy="62" r="9" fill="#fff6c8"/><circle cx="38" cy="62" r="4" fill="#cc3640"/><circle cx="62" cy="62" r="4" fill="#cc3640"/>
      <path d="M32 80 L68 80 L64 90 L36 90 Z" fill="#0a0a10"/>${[38, 44, 50, 56, 62].map((x) => `<path d="M${x} 80 L${x + 2} 86 L${x + 4} 80" fill="#e9e2cf"/>`).join("")}<path d="M0 96 L100 96" stroke="#5a6170" stroke-width="3"/>`,
    c_hoa: `<path d="M50 96 C48 80 52 70 50 58" stroke="#3f6b3a" stroke-width="6" fill="none"/><path d="M50 80 C36 74 26 80 20 90 M50 74 C64 66 76 70 82 80" stroke="#3f6b3a" stroke-width="4" fill="none"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="50" cy="28" rx="10" ry="20" fill="#c25a7c" transform="rotate(${a} 50 44)"/>`).join("")}<circle cx="50" cy="44" r="12" fill="#2a1424"/>
      <circle cx="46" cy="42" r="2.4" fill="#e8d36a"/><circle cx="54" cy="42" r="2.4" fill="#e8d36a"/><path d="M44 50 L47 47 L50 50 L53 47 L56 50" stroke="#f1ead8" stroke-width="1.5" fill="none"/>
      <path d="M14 96 C20 86 22 78 30 76 M86 96 C82 86 78 80 70 78" stroke="#5b3e22" stroke-width="3" fill="none"/>`,
    c_cap2_trial: `${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, x = 50 + Math.cos(a) * 44, y = 52 + Math.sin(a) * 40; return `<path d="M50 52 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#d9d0c4" stroke-width="2.5"/><path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a + 0.6) * 5).toFixed(1)} ${(Math.sin(a + 0.6) * 5).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a - 0.6) * 5).toFixed(1)} ${(Math.sin(a - 0.6) * 5).toFixed(1)}" stroke="#d9d0c4" stroke-width="1.5"/>`; }).join("")}
      <circle cx="50" cy="52" r="18" fill="#3a1f2c"/><ellipse cx="50" cy="48" rx="9" ry="6" fill="#efd6d6"/><circle cx="50" cy="48" r="4" fill="#b3121e"/><circle cx="50" cy="48" r="1.6" fill="#000"/>
      <path d="M40 60 Q50 66 60 60" stroke="#efd6d6" stroke-width="2" fill="none"/><path d="M6 20 L94 84 M6 84 L94 20" stroke="#8b8f9c" stroke-width="2" stroke-dasharray="4 3" opacity=".6"/>`,
  });
})(typeof window !== "undefined" ? window : globalThis);
