/* =====================================================================
   CURSED DESTINY — ARC 4: CỬU TƯỚNG CHÚ THAI · ARC 5: KÝ ỨC HOÀI NGỌC · ARC 6: SỰ BIẾN SHIBUYA
   Can thiệp của Shen có thể thay đổi số phận NPC (xem tab Thế giới › Số phận).
   Nạp sau story2.js.
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {}), D = CD.DATA;
  const st = (STR, AGI, VIT, INT, WIS, LUK) => ({ STR, AGI, VIT, INT, WIS, LUK });
  const mk = (name, rank, lv, w, extra) => {
    const total = Math.round((30 + 5 * (lv - 1)) * (extra && extra.f || 1)), sum = w.reduce((a, b) => a + b, 0), keys = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"], stats = {};
    keys.forEach((k, i) => (stats[k] = Math.max(1, Math.round((total * w[i]) / sum))));
    const o = Object.assign({ name, rank, lv, stats }, extra || {}); delete o.f; return o;
  };

  /* ---------- KẺ ĐỊCH MỚI (đã cân bằng) ---------- */
  Object.assign(D.NPCS, {
    c_a4_a: mk("Chú linh cống thoát nước", "C", 23, [20, 18, 22, 12, 12, 4], { f: 1.3, exp: 6000, devour: "VIT", skills: [{ name: "Lũ bùn", mult: 1.6, src: "cpow", cd: 2 }, { name: "Siết", mult: 1.3, src: "patk" }], desc: "Chú linh cấp 2 dưới cống thoát nước của khu dân cư." }),
    c_a4_b: mk("Chú linh ký túc xá", "C", 24, [18, 20, 18, 14, 14, 4], { f: 1.3, exp: 6500, devour: "AGI", skills: [{ name: "Gõ cửa", mult: 1.7, src: "patk", cd: 3 }, { name: "Thì thầm qua tường", mult: 1.5, src: "cpow", cd: 2 }, { name: "Cào", mult: 1.2, src: "patk" }], desc: "Ký túc xá đại học, mười hai phòng có người mất ngủ triền miên." }),
    c_bridge: mk("Chú linh gầm cầu Yasohachi", "C", 25, [22, 18, 26, 14, 14, 4], { f: 1.3, hpMult: 1.3, exp: 8000, devour: "WIS", skills: [{ name: "Nước đen kéo xuống", mult: 1.8, src: "cpow", cd: 3 }, { name: "Bàn tay trẻ con", mult: 1.4, src: "patk", cd: 1 }, { name: "Quất", mult: 1.2, src: "patk" }], desc: "Chú linh cấp 2 ẩn trong lãnh địa dưới gầm cầu, nơi ba học sinh mất tích." }),
    kechizu: mk("Kechizu", "C", 26, [18, 14, 22, 18, 16, 3], { f: 1.25, hpMult: 1.4, exp: 10000, faction: "chulinh", skills: [{ name: "Máu ăn mòn", mult: 1.7, src: "cpow", cd: 2 }, { name: "Phun máu", mult: 1.4, src: "cpow", cd: 1 }, { name: "Cắn", mult: 1.2, src: "patk" }], desc: "Em út của anh em Cửu tướng Chú thai. Máu của hắn ăn mòn mọi thứ chạm vào." }),
    eso: mk("Eso", "B", 30, [16, 16, 18, 22, 20, 3], { f: 1.25, hpMult: 1.5, exp: 14000, faction: "chulinh", skills: [{ name: "Cánh máu", mult: 1.9, src: "cpow", cd: 3 }, { name: "Mưa máu", mult: 1.5, src: "cpow", cd: 2 }, { name: "Quật", mult: 1.2, src: "patk" }], desc: "Anh thứ của Cửu tướng Chú thai. Lưng mọc đôi cánh máu, mỗi giọt đều là độc." }),
    u_sim: mk("Sát thủ Q (mô phỏng)", "C", 27, [20, 22, 18, 12, 12, 6], { f: 1.2, hpMult: 1.3, exp: 9000, skills: [{ name: "Dao găm chú cụ", mult: 1.7, src: "patk", cd: 2 }, { name: "Súng chú lực", mult: 1.5, src: "cpow", cd: 2 }, { name: "Đâm", mult: 1.2, src: "patk" }], desc: "Hình ảnh tái hiện một sát thủ của nhóm chú nguyền sư Q, năm 2006." }),
    sim_toji: mk("Ảo ảnh Fushiguro Toji (giới hạn)", "B", 33, [30, 32, 26, 4, 4, 6], { f: 1.25, hpMult: 2.5, exp: 12000, skills: [{ name: "Chú cụ Thiên Nghịch Mâu", mult: 2.0, src: "patk", cd: 2 }, { name: "Xích vạn lý", mult: 1.6, src: "patk", cd: 1 }, { name: "Đòn tay không", mult: 1.3, src: "patk" }], desc: "Hệ thống chỉ tái hiện được một phần nhỏ sức mạnh của người đàn ông này. Như vậy đã quá đủ." }),
    c_a6_a: mk("Chú linh hầm gửi xe", "C", 29, [22, 20, 22, 14, 14, 4], { f: 1.3, exp: 9000, devour: "STR", skills: [{ name: "Đèn pha mù", mult: 1.6, src: "cpow", cd: 2 }, { name: "Húc", mult: 1.4, src: "patk" }], desc: "Hầm gửi xe ngầm ở Ikebukuro, nơi tiếng còi xe kêu lúc không có ai." }),
    c_a6_b: mk("Chú linh nhà ma Halloween", "C", 30, [18, 20, 20, 16, 16, 6], { f: 1.3, exp: 9500, devour: "LUK", skills: [{ name: "Tiếng cười giả", mult: 1.6, src: "cpow", cd: 2 }, { name: "Bàn tay sau rèm", mult: 1.4, src: "patk" }], desc: "Ngôi nhà ma dựng tạm cho lễ hội. Thứ thật đã dọn vào ở trước." }),
    c_kaihen_s: mk("Người cải biến Shibuya", "C", 30, [24, 18, 24, 8, 8, 3], { f: 1.3, hpMult: 1.1, exp: 9000, devour: "VIT", skills: [{ name: "Thân thể méo mó", mult: 1.7, src: "patk", cd: 2 }, { name: "Gào", mult: 1.3, src: "cpow", cd: 3 }, { name: "Vồ", mult: 1.3, src: "patk" }], desc: "Hành khách bị Mahito nhào nặn ngay trên sân ga." }),
    c_train: mk("Chú linh toa tàu", "C", 32, [24, 22, 24, 14, 14, 4], { f: 1.3, hpMult: 1.2, exp: 12000, devour: "AGI", skills: [{ name: "Cửa toa đóng sập", mult: 1.8, src: "patk", cd: 3 }, { name: "Giọng thông báo", mult: 1.5, src: "cpow", cd: 2 }, { name: "Lao", mult: 1.3, src: "patk" }], desc: "Đoàn tàu không người lái chạy vòng quanh tuyến Fukutoshin." }),
    u_fox: mk("Chú nguyền sư mặt nạ cáo", "B", 36, [20, 24, 20, 22, 20, 6], { f: 1.25, hpMult: 1.7, exp: 25000, skills: [{ name: "Hồ hỏa", mult: 2.0, src: "cpow", cd: 3 }, { name: "Ảo ảnh cáo", mult: 1.6, src: "cpow", cd: 2 }, { name: "Vuốt", mult: 1.3, src: "patk" }], desc: "Chú nguyền sư theo phe Kenjaku, dùng lửa và ảo ảnh. Kẻ đã sát hại hàng chục người không có chú lực." }),
  });
  D.NPCS.choso.desc = "Anh cả Cửu tướng Chú thai, Xích Huyết Thao Thuật. Thứ duy nhất hắn quan tâm là các em.";

  /* ---------- SỐ PHẬN THEO NGUYÊN TÁC (để so sánh) ---------- */
  D.FATE_CANON = { junpei: "dead", nagi: "dead", eso: "dead", kechizu: "dead", riko: "dead", nanami: "dead", kugisaki: "injured", gojo: "sealed" };
  D.FATE_WATCH = ["junpei", "nagi", "eso", "kechizu", "nanami", "kugisaki", "gojo"];

  /* ---------- QUAN HỆ ---------- */
  D.SOCIAL.junpei.hideIf = "junpei_dead"; // ẩn khỏi khu tự do nếu Junpei đã chết
  D.SOCIAL.junpei.train = { stats: ["WIS", "INT"], minRel: 20, text: "Junpei tập cảm nhận chú lực cùng Shen. Cậu ta học nhanh tới mức đáng sợ." };
  D.SOCIAL.junpei.talk.push({ minRel: 25, req: { flag: "junpei_alive" }, text: ["> Học viện cho tớ làm học viên dự bị. Mẹ tớ khóc cả tối, vừa khóc vừa cười.", "> Nếu một ngày cậu cần người giúp, tớ sẽ có mặt."], eff: { flag: "junpei_ally" } });
  D.SOCIAL.nanami.talk.push({ minRel: 35, text: ["> Ngày 31 tháng 10, nghe nói Shibuya sẽ đông lắm. Tôi ghét đám đông.", "Anh ta ngừng một chút.", "> Nếu có chuyện gì, cậu nhớ chạy trước. Đó là việc của trẻ con."], eff: { flag: "nanami_trust" } });
  D.SOCIAL.kugisaki.talk.push({ minRel: 30, text: ["Kugisaki kể về một người bạn ở quê, người đã bỏ lên Tokyo trước cô và không bao giờ viết thư về.", "> Tôi sẽ tìm được cô ấy. Tôi không chết dễ vậy đâu."], eff: { flag: "nobara_trust" } });

  /* ---------- KHU TỰ DO ---------- */
  D.HUBS.a4_hub = { name: "Những ngày cuối hè", days: 4, trainCap: 5, start: "san",
    intro: "Ba chú vật bị đánh cắp vẫn chưa có tung tích. Trong lúc chờ, học viện giao nhiệm vụ như thường lệ.",
    locations: {
      san: { name: "Sân học viện", env: "temple", npcs: [["itadori", "fushiguro", "kugisaki"], ["maki", "panda", "inumaki", "junpei"], ["itadori", "kugisaki"]], idle: "Lá phong bắt đầu đổi màu.", events: [] },
      vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["gojo", "ijichi"], ["ieiri", "nanami"], ["ieiri"]], idle: "Báo cáo về ba chú vật mất tích chất cao trên bàn Gojo.", events: [
        { id: "a4_report", text: ["Shen đọc trộm báo cáo trên bàn Gojo: chín thai nhi chú vật được tạo ra từ thời Minh Trị bởi một kẻ tên Kamo Noritoshi, nhà chú thuật sư tà ác nhất lịch sử.", "Ba thai nhi đầu tiên đã có thể thành hình người."], eff: { exp: 2500, known: "cuu_tuong_chu_thai" } }] },
      voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yaga"], []], idle: "Tiếng gậy gỗ của Maki vang suốt buổi chiều.", events: [] },
      cong: { name: "Nhiệm vụ: Cống thoát nước", env: "sewer", npcs: [], idle: "Nước đen chảy chậm như dầu.", events: [
        { id: "a4_drain", title: "Cống thoát nước", text: ["Mặt nước sủi bọt. Một khối bùn có hình người đứng dậy."], combat: ["c_a4_a"], eff: { yen: 70000, rep: { tokyo: 3 } } }] },
      kytucxa: { name: "Nhiệm vụ: Ký túc xá", env: "school", npcs: [], idle: "Hành lang dài, đèn chập chờn.", events: [
        { id: "a4_dorm", slot: [2], title: "Ký túc xá lúc nửa đêm", text: ["Ba tiếng gõ ở cánh cửa cuối hành lang. Phòng đó đã bỏ trống từ năm ngoái."], combat: ["c_a4_b"], eff: { yen: 75000, rep: { danthuong: 4 } } }] },
      pho: { name: "Phố gần ga", env: "city", npcs: [[], ["kugisaki", "junpei"], []], idle: "Quán cà phê mới mở có bánh kem dâu.", events: [] },
    } };
  D.HUBS.a6_hub = { name: "Tháng Mười", days: 5, trainCap: 6, start: "san",
    intro: "Tháng Mười yên bình đến lạ. Ai cũng biết Kenjaku và Mahito vẫn đang ở đâu đó, nhưng không ai biết chúng định làm gì.",
    locations: {
      san: { name: "Sân học viện", env: "temple", npcs: [["itadori", "fushiguro", "kugisaki"], ["maki", "panda", "inumaki", "junpei"], ["itadori", "kugisaki"]], idle: "Lá phong đỏ rực cả sân trường.", events: [] },
      vanphong: { name: "Văn phòng & phòng y tế", env: "morgue", npcs: [["gojo", "ijichi"], ["nanami", "ieiri"], ["nanami"]], idle: "Nanami đang điền báo cáo, mặt khó chịu.", events: [] },
      voduong: { name: "Võ đường", env: "dojo", npcs: [[], ["yaga", "maki"], []], idle: "Võ đường mới được thay chiếu.", events: [] },
      ikebukuro: { name: "Nhiệm vụ: Hầm gửi xe Ikebukuro", env: "sewer", npcs: [], idle: "Hàng ô tô phủ bụi.", events: [
        { id: "a6_parking", title: "Hầm gửi xe", text: ["Tất cả đèn pha trong hầm cùng bật sáng một lúc, rồi lao về phía Shen."], combat: ["c_a6_a"], eff: { yen: 90000, rep: { tokyo: 3 } } }] },
      nhama: { name: "Nhiệm vụ: Nhà ma lễ hội", env: "city", npcs: [], idle: "Những quả bí ngô cười toe toét.", events: [
        { id: "a6_haunted", slot: [2], title: "Nhà ma lễ hội", text: ["Nhân viên nhà ma đã về hết. Vậy mà vẫn có tiếng cười trong bóng tối."], combat: ["c_a6_b"], eff: { yen: 95000, rep: { danthuong: 5 } } }] },
      pho: { name: "Phố Shibuya", env: "city", npcs: [[], ["kugisaki", "junpei"], ["nanami"]], idle: "Người ta đang dựng sân khấu cho lễ hội Halloween.", events: [
        { id: "a6_omen", slot: [2], text: ["Đứng giữa ngã tư Shibuya, Shen cảm thấy một luồng chú lực khổng lồ đang ngủ say dưới lòng đất, như một con thú đợi ngày thức dậy.", "[Hệ thống: Phát hiện nhiều điểm tập trung chú lực bất thường quanh ga Shibuya. Không xác định được nguồn.]"], eff: { exp: 3000, known: "shibuya_dieu_bat_thuong", flag: "shibuya_omen" } }] },
    } };

  Object.assign(D.QUESTS, {
    q_bridge: { name: "Cây cầu Yasohachi", desc: "Điều tra những vụ mất tích quanh cây cầu ở Saitama." },
    q_memory: { name: "Ký ức năm 2006", desc: "Bước vào mô phỏng ký ức trong chiếc kính râm cũ của Gojo." },
    q_shibuya: { name: "Sự biến Shibuya", desc: "Sống sót qua đêm 31 tháng 10." },
  });
  Object.assign(D.ACHIEVEMENTS, {
    a_brothers: "Lòng nhân với kẻ thù", a_sim: "Người quan sát quá khứ", a_fate_nanami: "Người lớn được sống",
    a_fate_nobara: "Cây đinh vẫn còn sắc", a_shibuya: "Sống sót qua Shibuya",
  });
  D.ARCS.forEach((a) => { if (["arc4", "arc5", "arc6"].includes(a.id)) a.playable = true; });

  /* ======================= CỐT TRUYỆN ======================= */
  Object.assign(CD.SCENES, {
    /* ---------- ARC 4: CỬU TƯỚNG CHÚ THAI ---------- */
    a4_start: { chapter: "Arc 4 · Cửu tướng Chú thai", title: "Chín thai nhi", env: "day/temple", cast: ["shen", "gojo", "itadori"],
      onEnter: { arc: "arc4", time: { days: 4, label: "Tháng 9, 2018" }, heal: "full" },
      conds: [{ req: { flag: "junpei_alive" }, eff: { rel: { junpei: 5 } } }],
      text: [
        "Gojo trải ba tấm ảnh lên bàn: ba lọ thủy tinh vỡ, bên trong từng chứa thứ gì đó giống bào thai người.",
        "> Cửu tướng Chú thai. Chín đứa con sinh ra từ máu của chú linh và một người phụ nữ, hơn một trăm năm trước. Ba đứa đầu đủ sức thành hình người nếu được cho một thân xác.",
        "> Kẻ lấy chúng đi sẽ không để chúng nằm yên trong lọ.",
        "Itadori nhìn ba tấm ảnh rất lâu, như đang nhìn vào chính mình.",
        "> Nhìn tôi làm gì? Tôi cũng là một thứ \"được tạo ra\" đấy thôi, cậu ta cười gượng.",
      ],
      choices: [{ t: "\"Cậu là Itadori. Thế thôi.\"", go: "a4_hub", eff: { rel: { itadori: 6 }, moral: 1 } }, { t: "Im lặng, vỗ vai cậu ta", go: "a4_hub", eff: { rel: { itadori: 4 } } }] },

    a4_hub: { chapter: "Arc 4 · Thời gian tự do", title: "Những ngày cuối hè", env: "day/temple", cast: ["shen"],
      text: ["Học viện chưa có manh mối nào. Shen có bốn ngày trước nhiệm vụ tiếp theo."], hub: "a4_hub", go: "a4_bridge" },

    a4_bridge: { chapter: "Arc 4", title: "Cây cầu Yasohachi", env: "dusk/river", cast: ["shen", "itadori", "kugisaki", "fushiguro"],
      onEnter: { quest: { id: "q_bridge", status: "active" }, heal: "full" },
      text: [
        "Saitama. Ba học sinh trung học mất tích sau khi chơi trò thử thách can đảm dưới cây cầu Yasohachi. Trên tay cả ba đều có cùng một dấu vết: một vết bỏng hình bàn tay trẻ con.",
        "Fushiguro đặt tay lên trụ cầu.",
        "> Có lãnh địa ở dưới này. Chỉ một người vào được mà không làm vỡ nó. Tôi đi.",
        "Itadori nhăn mặt. Kugisaki tặc lưỡi. Cả hai đều nhìn Shen.",
      ],
      choices: [
        { t: "Theo Fushiguro vào lãnh địa", go: "a4_megumi", eff: { rel: { fushiguro: 6 }, trace: { quansat: 1 }, flag: "a4_with_megumi" } },
        { t: "Ở lại cùng Itadori và Kugisaki canh bên ngoài", go: "a4_brothers", eff: { rel: { itadori: 3, kugisaki: 3 }, trace: { baove: 1 } } },
      ] },

    a4_megumi: { chapter: "Arc 4", title: "Dưới gầm cầu", env: "night/sewer", cast: ["shen", "fushiguro", "c_bridge"],
      text: ["Bên trong lãnh địa là một con sông đen chảy ngược. Những bàn tay nhỏ xíu vươn lên khỏi mặt nước.", "> Đừng để nó chạm vào cậu, Fushiguro nói. Nó đánh dấu con mồi giống như đánh dấu ba đứa kia."],
      choices: [{ t: "Chiến đấu", go: "a4_megumi_fight" }] },
    a4_megumi_fight: { chapter: "Arc 4", title: "Chú linh gầm cầu", env: "night/sewer",
      text: ["Chú linh trồi lên từ lòng sông, thân hình phình to như xác chết ngâm nước."],
      combat: { enemies: ["c_bridge"], win: "a4_megumi_out", lose: "a4_megumi_out", canFlee: false } },
    a4_megumi_out: { chapter: "Arc 4", title: "Hai anh em", env: "dusk/river", cast: ["shen", "fushiguro", "itadori", "kugisaki"],
      onEnter: { exp: 3000, fate: { eso: "dead", kechizu: "dead" }, ledger: { action: "Eso và Kechizu bị Itadori và Kugisaki tiêu diệt", witnesses: "Fushiguro, Shen (đến muộn)", consequence: "Choso cảm nhận được cái chết của hai em", trigger: "Choso sẽ tìm Itadori để trả thù" } },
      text: [
        "Khi lãnh địa vỡ và hai người trở ra, bờ sông đã thành bãi chiến trường. Đất đá cháy xém, cỏ cây chết khô vì máu độc.",
        "Itadori đứng thở dốc, tay áo rách bươm. Kugisaki ngồi bệt dưới đất, mặt tái nhợt nhưng vẫn cười được.",
        "> Hai tên chú thai, Itadori nói. Chúng tự gọi nhau là anh em. Tên anh... tới phút cuối vẫn che cho tên em.",
        "Cậu ta không nói thêm gì nữa.",
      ],
      choices: [{ t: "Tiếp tục", go: "a4_choso" }] },

    a4_brothers: { chapter: "Arc 4", title: "Hai anh em", env: "dusk/river", cast: ["shen", "eso", "kechizu"],
      text: [
        "Fushiguro vừa biến mất xuống gầm cầu thì hai bóng người bước ra từ hàng cây. Một gã lưng mọc đôi cánh bằng máu. Một gã nhỏ thó, mặt như được nặn vội từ đất sét, miệng không ngừng chảy dãi.",
        "> Em ơi, chúng ta tới muộn rồi, gã có cánh nói. Thôi thì giết ba đứa này trước.",
        "> Vâng, anh Eso!",
        "Itadori bẻ khớp tay. Kugisaki rút búa.",
        "> Shen, cậu giúp tôi với thằng xấu xí kia. Itadori lo con dơi.",
      ],
      observe: ["eso", "kechizu"],
      choices: [{ t: "Đánh Kechizu cùng Kugisaki", go: "a4_kechizu", eff: { flag: "nobara_team", rel: { kugisaki: 4 } } }] },
    a4_kechizu: { chapter: "Arc 4", title: "Kechizu", env: "dusk/river",
      text: ["Kechizu phun ra một vệt máu đặc như hắc ín. Nơi nó rơi xuống, cỏ chết khô ngay lập tức. Kugisaki ném đinh từ phía bên kia, ép hắn quay lưng về phía Shen."],
      combat: { enemies: ["kechizu"], win: "a4_eso", lose: "a4_kechizu_lose", canFlee: false, weakenFlag: "nobara_team" } },
    a4_kechizu_lose: { chapter: "Arc 4", title: "Cộng Minh", env: "dusk/river", cast: ["shen", "kugisaki", "kechizu"],
      onEnter: { heal: 200 },
      text: ["Máu độc ngấm vào vết thương. Shen gục xuống.", "Kugisaki nghiến răng, đóng một cây đinh vào hình nhân rơm.", "> Sô Linh Chú Pháp: Cộng Minh!", "Kechizu hét lên. Mọi vết thương của hắn bùng phát cùng lúc."],
      choices: [{ t: "Đứng dậy", go: "a4_eso" }] },
    a4_eso: { chapter: "Arc 4", title: "Hắc Thiểm và Cộng Minh", env: "night/river", cast: ["shen", "itadori", "kugisaki", "eso"],
      text: [
        "Phía bên kia, Itadori và Eso đang đánh nhau đến cạn sức. Máu của Eso chảy vào người Itadori, nhưng cậu ta không ngã. Cơ thể chứa Sukuna miễn nhiễm với chất độc.",
        "Kugisaki cắm cây đinh cuối cùng. Itadori tung một cú đấm đen kịt như tia chớp.",
        "Hai anh em chú thai đổ gục. Kechizu bò về phía Eso, gọi anh trai bằng giọng của một đứa trẻ.",
        "> Anh... ơi...",
        "Itadori đứng lặng, nắm tay vẫn giơ lên, chưa ra đòn kết liễu.",
        "[Hệ thống: Hai cá thể chú thai đang hấp hối. Quyết định của Ký chủ sẽ được ghi vào chuỗi nhân quả.]",
      ],
      choices: [
        { t: "\"Kết thúc đi, Itadori. Chúng đã giết người.\"", go: "a4_kill", eff: { anti: 1 } },
        { t: "Phong ấn hai anh em, giữ mạng chúng để học viện xử lý", go: "a4_spare", req: { technique: true }, eff: { moral: 4, trace: { phongan: 2 } } },
        { t: "Nói với Itadori: \"Tên anh đang che cho em nó. Cậu thấy không?\"", go: "a4_spare", req: { rel: { itadori: 30 } }, eff: { moral: 3, rel: { itadori: 5 }, trace: { lienket: 2 } } },
      ] },
    a4_kill: { chapter: "Arc 4", title: "Lời cuối", env: "night/river", cast: ["shen", "itadori", "kugisaki"],
      onEnter: { exp: 5000, fate: { eso: "dead", kechizu: "dead" }, ledger: { action: "Eso và Kechizu bị tiêu diệt ở cầu Yasohachi", witnesses: "Shen, Itadori, Kugisaki", consequence: "Choso cảm nhận được cái chết của hai em", trigger: "Choso sẽ tìm Itadori để trả thù" } },
      text: ["Itadori hạ nắm đấm. Hai anh em tan thành tro.", "Trên đường về, Itadori không nói câu nào. Gần tới học viện, cậu ta mới lên tiếng:", "> Tớ đã giết người, đúng không? Dù chúng là chú thai... chúng vẫn gọi nhau là anh em.", "Kugisaki đấm vào vai cậu ta, rất nhẹ."],
      choices: [{ t: "Tiếp tục", go: "a4_choso" }] },
    a4_spare: { chapter: "Arc 4", title: "Kẻ thù còn sống", env: "night/river", cast: ["shen", "itadori", "eso", "kechizu"],
      onEnter: { exp: 6500, flag: "brothers_captured", achievement: "a_brothers", fate: { eso: "captured", kechizu: "captured" },
        ledger: { action: "Shen giữ mạng Eso và Kechizu, giao cho học viện phong ấn", witnesses: "Itadori, Kugisaki", consequence: "Choso cảm nhận được hai em vẫn còn sống", trigger: "Choso sẽ đối xử khác với Itadori ở Shibuya" } },
      text: [
        "Itadori hạ nắm đấm, thở ra một hơi dài.",
        "Shen trói hai anh em bằng chú lực và bùa của học viện. Eso không chống cự. Hắn chỉ nhìn em mình được kéo đi bên cạnh, và lần đầu tiên, gương mặt hắn trông giống người.",
        "> Tại sao? hắn hỏi.",
        "Shen không biết trả lời thế nào. Hệ thống cũng im lặng.",
        "Kugisaki khoanh tay: \"Thượng tầng sẽ nổi điên cho xem.\" Nhưng cô không phản đối.",
      ],
      choices: [{ t: "Tiếp tục", go: "a4_choso" }] },

    a4_choso: { chapter: "Arc 4", title: "Người anh cả", env: "night/city", cast: ["choso"],
      text: [
        "Cùng lúc đó, ở một nơi rất xa, một người đàn ông có vệt máu vẽ ngang sống mũi đột ngột đứng dậy.",
        "Choso. Anh cả của Cửu tướng Chú thai. Giữa anh em chú thai có một sợi dây mà không ai khác cảm nhận được.",
      ],
      observe: ["choso"],
      choices: [
        { t: "Tiếp tục", go: "a4_choso_dead", req: { notFlag: "brothers_captured" }, hide: true },
        { t: "Tiếp tục", go: "a4_choso_alive", req: { flag: "brothers_captured" }, hide: true },
      ] },
    a4_choso_dead: { chapter: "Arc 4", title: "Lời thề", env: "night/city", cast: ["choso"],
      text: ["Sợi dây đứt. Hai lần liên tiếp.", "Choso đứng im rất lâu. Rồi hắn bước ra khỏi căn phòng tối, mắt đỏ ngầu.", "> Itadori Yuji. Ta sẽ giết ngươi bằng chính đôi tay này."],
      choices: [{ t: "Tiếp tục", go: "a4_end" }] },
    a4_choso_alive: { chapter: "Arc 4", title: "Sợi dây chưa đứt", env: "night/city", cast: ["choso"],
      text: ["Sợi dây căng ra, đau nhói, nhưng không đứt. Hai đứa em vẫn còn sống, ở đâu đó, trong tay những kẻ khác.", "Choso siết chặt nắm tay.", "> Kẻ đã tha cho các em ta... ta sẽ hỏi hắn vì sao. Rồi ta sẽ đưa các em về."],
      choices: [{ t: "Tiếp tục", go: "a4_end" }] },
    a4_end: { chapter: "Hết Arc 4", title: "Mùa thu", env: "dusk/temple", cast: ["shen", "itadori", "kugisaki", "fushiguro"],
      onEnter: { quest: { id: "q_bridge", status: "done" }, exp: 4000, sp: 80, rep: { tokyo: 5 } },
      text: ["Fushiguro băng bó cho Itadori. Kugisaki than đói. Mọi thứ trông như một buổi chiều bình thường.", "Nhưng Shen biết, chuỗi nhân quả vừa nối thêm một mắt xích mới.", "Tối hôm đó, Gojo gọi Shen lên văn phòng. Trên bàn là một chiếc kính râm tròn, cũ kỹ, một mắt kính nứt."],
      choices: [{ t: "Bắt đầu Arc 5: Ký ức Hoài Ngọc", go: "a5_start" }] },

    /* ---------- ARC 5: KÝ ỨC HOÀI NGỌC (nhánh phụ) ---------- */
    a5_start: { chapter: "Arc 5 · Ký ức Hoài Ngọc", title: "Chiếc kính cũ", env: "night/temple", cast: ["shen", "gojo"],
      onEnter: { arc: "arc5", time: { days: 2, label: "Tháng 9, 2018" } },
      text: [
        "> Hồi học năm hai, tôi đeo cái này, Gojo nói, xoay chiếc kính trong tay. Nó ở cạnh tôi trong một nhiệm vụ đã thay đổi mọi thứ.",
        "Shen chạm vào gọng kính. Khung chữ xanh hiện lên.",
        "[Hệ thống: Phát hiện ký ức lưu trữ trong chú vật. Có thể mô phỏng.]",
        "[Mô phỏng không thay đổi quá khứ. Nó chỉ thay đổi người quan sát.]",
        "> Nhóc thấy được gì đó à? Gojo hỏi. Đi đi. Có những chuyện tôi không kể nổi bằng lời.",
      ],
      choices: [
        { t: "Bước vào mô phỏng", go: "a5_sim1", eff: { quest: { id: "q_memory", status: "active" } } },
        { t: "Từ chối. Đây là quá khứ của thầy ấy.", go: "a5_skip", eff: { rel: { gojo: 4 }, moral: 1 } },
      ] },
    a5_skip: { chapter: "Arc 5", title: "Không phải chuyện của mình", env: "night/temple", cast: ["shen", "gojo"],
      onEnter: { exp: 8000 },
      text: ["Shen đặt chiếc kính xuống. Gojo nhìn cậu một lúc, rồi bật cười.", "> Nhóc tôn trọng người khác hơn tôi tưởng. Được thôi. Khi nào muốn biết, cứ tới hỏi."],
      choices: [{ t: "Bắt đầu Arc 6: Sự biến Shibuya", go: "a6_start" }] },

    a5_sim1: { chapter: "Arc 5 · Mô phỏng", title: "Năm 2006", env: "day/temple", cast: ["shen", "gojo", "geto_young"],
      text: [
        "Thế giới lóe trắng. Khi Shen mở mắt, học viện vẫn ở đó, nhưng cây cối thấp hơn, tòa nhà còn mới.",
        "[Mô phỏng: Ký chủ được gán vai một phụ tá vô danh. Không ai nhận ra sự hiện diện bất thường.]",
        "Hai học sinh năm hai đang cãi nhau ở sân. Một người tóc trắng, đeo đúng chiếc kính tròn kia, cười ngạo nghễ. Một người tóc đen búi cao, giọng điềm tĩnh. Gojo Satoru và Geto Suguru, năm mười bảy tuổi.",
        "> Nhiệm vụ mới: bảo vệ Tinh tương thể, Gojo đọc tờ giấy. Một cô bé sẽ hợp nhất với Tengen-sama trong hai ngày nữa. Có người muốn giết cô bé trước khi kịp làm vậy.",
        "> Mạnh nhất như chúng ta thì có gì phải lo, Geto mỉm cười.",
      ],
      observe: ["geto_young"],
      choices: [{ t: "Đi theo hai người", go: "a5_riko" }] },
    a5_riko: { chapter: "Arc 5 · Mô phỏng", title: "Tinh tương thể", env: "day/city", cast: ["shen", "riko", "geto_young"],
      text: [
        "Amanai Riko là một cô bé mười bốn tuổi, nói năng như bà cụ, ghét bị đối xử như đồ vật. Người hầu của cô, Kuroi Misato, đi theo như hình với bóng.",
        "Riko kéo Shen lại hỏi nhỏ, như thể biết cậu không thuộc về nơi này:",
        "> Này, anh phụ tá. Anh không giống người ở đây chút nào. Sau này... người ta có còn nhớ tôi không?",
        "[Hệ thống: Nhân vật mô phỏng không thể nhận thức được Ký chủ. Ghi nhận bất thường.]",
      ],
      choices: [
        { t: "\"Có. Có người vẫn nhớ.\"", go: "a5_okinawa", eff: { moral: 2, trace: { lienket: 1 } } },
        { t: "Im lặng, không trả lời", go: "a5_okinawa", eff: { trace: { thoikhac: 1, quansat: 1 } } },
      ] },
    a5_okinawa: { chapter: "Arc 5 · Mô phỏng", title: "Biển Okinawa", env: "day/river", cast: ["gojo", "geto_young", "riko"],
      text: [
        "Gojo kéo cả nhóm tới Okinawa chơi một ngày, vì Riko chưa từng thấy biển. Anh ta không ngủ suốt hai ngày để giữ thuật thức Vô Hạn luôn mở.",
        "Riko chạy dọc bờ cát, chân trần, cười lớn. Geto nhìn theo, khẽ nói với Gojo:",
        "> Nếu cô bé không muốn hợp nhất, chúng ta sẽ đưa cô bé đi. Được chứ?",
        "> Đương nhiên. Chúng ta là mạnh nhất mà.",
        "Shen đứng ở xa, biết rằng mình đang xem một kết thúc đã được viết sẵn.",
      ],
      choices: [{ t: "Tiếp tục", go: "a5_assassin" }] },
    a5_assassin: { chapter: "Arc 5 · Mô phỏng", title: "Kẻ săn tiền thưởng", env: "night/city", cast: ["shen", "u_sim"],
      text: ["Trên đường về, một sát thủ thuộc nhóm chú nguyền sư Q chặn đường. Gojo và Geto bận đối phó với ba tên khác. Một tên lách qua, nhắm thẳng vào Riko.", "Shen đứng chắn trước cô bé."],
      choices: [{ t: "Chiến đấu", go: "a5_assassin_fight" }] },
    a5_assassin_fight: { chapter: "Arc 5 · Mô phỏng", title: "Sát thủ Q", env: "night/city",
      text: ["Tên sát thủ rút ra một con dao găm khắc đầy bùa."],
      combat: { enemies: ["u_sim"], win: "a5_toji", lose: "a5_toji", canFlee: false } },
    a5_toji: { chapter: "Arc 5 · Mô phỏng", title: "Kẻ không có chú lực", env: "dusk/temple", cast: ["shen", "gojo", "sim_toji"],
      text: [
        "Trước cổng điện thờ Tengen, khi mọi người đã thả lỏng, một người đàn ông bước ra từ hư không. Không ai cảm nhận được hắn, vì trên người hắn không có một chút chú lực nào.",
        "Fushiguro Toji. Kẻ được gọi là Sát thủ Thuật sư.",
        "Lưỡi kiếm của hắn xuyên qua người Gojo từ phía sau.",
        "[Mô phỏng: Ký chủ có thể can thiệp trong giới hạn. Mục tiêu: trụ vững 4 lượt.]",
      ],
      observe: ["sim_toji"],
      choices: [{ t: "Chắn trước Toji", go: "a5_toji_fight" }] },
    a5_toji_fight: { chapter: "Arc 5 · Mô phỏng", title: "Ảo ảnh Toji", env: "dusk/temple",
      text: ["Toji nhìn Shen như nhìn một con côn trùng. Rồi hắn nhếch mép."],
      combat: { enemies: ["sim_toji"], win: "a5_riko_end", lose: "a5_riko_end", canFlee: false, surviveTurns: 4 } },
    a5_riko_end: { chapter: "Arc 5 · Mô phỏng", title: "Phát súng", env: "dusk/temple", cast: ["shen", "geto_young", "riko"],
      text: [
        "Bên trong điện thờ, Geto đưa tay về phía Riko.",
        "> Nếu em không muốn, chúng ta về nhà.",
        "Riko quay lại, mỉm cười, nước mắt chảy dài. Cô bé đưa tay ra.",
        "Một tiếng súng vang lên.",
      ],
      choices: [
        { t: "Lao tới chắn viên đạn", go: "a5_fixed", eff: { trace: { baove: 2 }, moral: 2 } },
        { t: "Cố dừng thời gian lại, dù chỉ một khoảnh khắc", go: "a5_fixed", eff: { trace: { thoikhac: 3 } } },
        { t: "Nhắm mắt lại", go: "a5_fixed", eff: { trace: { quansat: 1 } } },
      ] },
    a5_fixed: { chapter: "Arc 5 · Mô phỏng", title: "Quá khứ không đổi", env: "dusk/temple", cast: ["shen", "geto_young"],
      onEnter: { flag: "knows_past_fixed", known: "qua_khu_bat_bien" },
      text: [
        "Viên đạn xuyên qua bàn tay Shen như xuyên qua không khí.",
        "[Mô phỏng không thể thay đổi kết cục đã xảy ra.]",
        "Riko ngã xuống. Geto đứng đó, bàn tay vẫn đưa ra giữa khoảng không.",
        "Lần đầu tiên, Shen hiểu chính xác Hệ thống muốn dạy mình điều gì: quá khứ là thứ duy nhất không thể cứu. Thứ có thể cứu chỉ nằm ở phía trước.",
      ],
      choices: [{ t: "Tiếp tục", go: "a5_awaken" }] },
    a5_awaken: { chapter: "Arc 5 · Mô phỏng", title: "Thiên thượng thiên hạ", env: "night/temple", cast: ["gojo", "sim_toji"],
      text: [
        "Gojo đứng dậy giữa vũng máu của chính mình. Cận kề cái chết, anh ta đã nắm được Phản chuyển thuật thức.",
        "Anh ta cười. Một nụ cười không còn giống người mười bảy tuổi.",
        "Một luồng sáng tím nuốt trọn Toji. Từ ngày đó, Gojo Satoru trở thành kẻ mạnh nhất. Và cũng từ ngày đó, anh ta bắt đầu đứng một mình.",
        "[Hệ thống: Ký chủ đã chứng kiến một lần thức tỉnh ở ranh giới sống chết. Ghi nhận cho điều kiện nhánh ẩn.]",
      ],
      choices: [{ t: "Thoát khỏi mô phỏng", go: "a5_end" }] },
    a5_end: { chapter: "Hết Arc 5", title: "Học trò và người thầy", env: "night/temple", cast: ["shen", "gojo"],
      onEnter: { exp: 9000, sp: 100, base: { WIS: 2 }, flag: "hidden_seed", achievement: "a_sim", quest: { id: "q_memory", status: "done" } },
      text: ["Shen mở mắt. Gojo vẫn ngồi đó, chiếc kính cũ trên bàn.", "> Nhóc thấy hết rồi à?"],
      choices: [
        { t: "\"Thầy không còn đứng một mình nữa.\"", go: "a6_start", eff: { rel: { gojo: 12 }, moral: 2 } },
        { t: "Gật đầu, không nói gì thêm", go: "a6_start", eff: { rel: { gojo: 6 } } },
      ] },

    /* ---------- ARC 6: SỰ BIẾN SHIBUYA ---------- */
    a6_start: { chapter: "Arc 6 · Sự biến Shibuya", title: "Tháng Mười", env: "day/temple", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      onEnter: { arc: "arc6", time: { days: 20, label: "Tháng 10, 2018" }, heal: "full" },
      text: [
        "Tháng Mười trôi qua bình yên. Itadori học được cách nấu cơm cà ri. Kugisaki mua một đôi bốt mới. Fushiguro đọc xong ba cuốn tiểu thuyết.",
        "[Hệ thống: Chuỗi nhân quả đang hội tụ về một điểm. Thời gian còn lại: 5 ngày.]",
        "Shen không biết điểm đó là gì. Hệ thống không nói thêm.",
      ],
      choices: [{ t: "Tận dụng 5 ngày", go: "a6_hub" }] },
    a6_hub: { chapter: "Arc 6 · Thời gian tự do", title: "Năm ngày cuối", env: "day/temple", cast: ["shen"],
      text: ["Năm ngày. Nếu có điều gì cần nói với ai, có lẽ đây là lúc."], hub: "a6_hub", go: "a6_halloween" },

    a6_halloween: { chapter: "Arc 6", title: "Đêm 31 tháng 10", env: "night/city", cast: ["shen", "ijichi", "nanami", "kugisaki", "itadori"],
      onEnter: { quest: { id: "q_shibuya", status: "active" }, heal: "full", time: { days: 1, label: "31 tháng 10, 2018" } },
      text: [
        "19 giờ. Một tấm màn khổng lồ sập xuống, trùm kín khu vực bán kính bốn trăm mét quanh ga Shibuya. Hàng nghìn người bị nhốt bên trong. Họ chỉ được thả ra khi Gojo Satoru bước vào.",
        "Gojo bước vào một mình.",
        "Bên ngoài, các chú thuật sư chia nhóm. Nanami cùng Maki và gia chủ nhà Zenin vào từ cửa Đông. Kugisaki cùng phụ tá Nitta vào từ phía Tây. Itadori đi thẳng xuống tầng hầm ga.",
        "> Shen, Ijichi gọi. Cậu được tự chọn đội.",
        "[Hệ thống: Đây là một điểm rẽ của chuỗi nhân quả. Ký chủ chỉ có thể có mặt ở một nơi.]",
      ],
      choices: [
        { t: "Đi cùng Nanami", go: "a6_n1", eff: { flag: "path_nanami", rel: { nanami: 3 } } },
        { t: "Đi cùng Kugisaki", go: "a6_k1", eff: { flag: "path_nobara", rel: { kugisaki: 3 } } },
        { t: "Đi cùng Itadori", go: "a6_y1", eff: { flag: "path_yuji", rel: { itadori: 3 } } },
      ] },

    /* — Tuyến Nanami — */
    a6_n1: { chapter: "Arc 6 · Tuyến Nanami", title: "Cửa Đông", env: "night/station", cast: ["shen", "nanami", "maki"],
      text: ["Đường hầm phía Đông đầy những hành khách đã bị nhào nặn. Nanami nới cà vạt, xem giờ.", "> 19 giờ 40. Tôi đã làm thêm giờ được 2 tiếng 40 phút. Shen, giữ bên trái."],
      choices: [{ t: "Chiến đấu", go: "a6_n_fight" }] },
    a6_n_fight: { chapter: "Arc 6 · Tuyến Nanami", title: "Người cải biến", env: "night/station",
      text: ["Ba hành khách bị biến dạng lao tới, hai cái đã gục dưới lưỡi dao của Nanami. Cái thứ ba lao về phía Shen."],
      combat: { enemies: ["c_kaihen_s"], win: "a6_sealed_n", lose: "a6_sealed_n", canFlee: false } },
    a6_sealed_n: { chapter: "Arc 6 · Tuyến Nanami", title: "Tín hiệu biến mất", env: "night/station", cast: ["shen", "nanami"],
      onEnter: { fate: { gojo: "sealed" }, ledger: { action: "Gojo Satoru bị phong ấn trong Ngục Môn Cương ở tầng B5 ga Shibuya", witnesses: "Không ai trong đội Shen", consequence: "Thế giới chú thuật mất đi trụ cột", trigger: "Mọi thế lực bắt đầu hành động" } },
      text: ["Đột nhiên, luồng chú lực khổng lồ ở tầng sâu nhất của nhà ga biến mất. Không phải yếu đi. Biến mất hoàn toàn.", "[Hệ thống: Tín hiệu chú lực của Gojo Satoru: không còn phát hiện được.]", "Nanami đứng im một giây. Rồi anh ta chỉnh lại kính.", "> Tiếp tục. Không ai đến cứu chúng ta nữa đâu."],
      choices: [{ t: "Tiếp tục", go: "a6_jogo" }] },
    a6_jogo: { chapter: "Arc 6 · Tuyến Nanami", title: "Núi lửa", env: "night/city", cast: ["shen", "nanami", "maki", "jogo"],
      text: [
        "Ở tầng trên, một chú linh đầu hình núi lửa, chỉ có một con mắt, đứng chắn đường. Jogo. Hắn không nói gì. Hắn chỉ giơ tay lên.",
        "[CẢNH BÁO: Nhiệt độ vượt ngưỡng chịu đựng của cơ thể người.]",
        "Lửa tràn ra như sóng thần.",
      ],
      observe: ["jogo"],
      choices: [
        { t: "Dồn toàn bộ chú lực dựng tường chắn trước Nanami", go: "a6_burn", req: { technique: true }, eff: { flag: "nanami_shielded", hpSet: 25, rel: { nanami: 8 }, trace: { baove: 2 }, moral: 3 } },
        { t: "Kéo Nanami và Maki nhảy xuống cầu thang", go: "a6_burn", req: { AGI: 30 }, eff: { flag: "nanami_shielded", hpSet: 40, rel: { nanami: 6, maki: 6 }, trace: { lienket: 1 } } },
        { t: "Lao xuống cầu thang thoát thân", go: "a6_burn", eff: { hpSet: 60, moral: -2 } },
      ] },
    a6_burn: { chapter: "Arc 6 · Tuyến Nanami", title: "Tro tàn", env: "night/city", cast: ["shen", "nanami"],
      text: [
        "Khi lửa tắt, hành lang chỉ còn là một ống khói đen kịt. Maki và gia chủ Zenin bị bỏng nặng. Nanami đứng dậy, nửa người cháy xém, một mắt không còn nhìn thấy.",
        "Anh ta bước tiếp. Từng bước một. Về phía có tiếng đánh nhau.",
        "> Shen. Đi theo tôi, hoặc quay về. Cậu chọn đi.",
      ],
      choices: [{ t: "Đi theo Nanami", go: "a6_n_mahito" }] },
    a6_n_mahito: { chapter: "Arc 6 · Tuyến Nanami", title: "Bãi biển ở Malaysia", env: "night/station", cast: ["shen", "nanami", "mahito"],
      text: [
        "Nanami gục xuống cột đá ở sân ga. Trước mặt anh ta, Mahito ngồi xổm, mỉm cười như gặp lại bạn cũ.",
        "> Ồ, ông chú này. Lần trước dang dở nhỉ.",
        "Nanami nhìn lên, mắt mờ đục. Anh ta không nhìn Mahito. Anh ta nhìn về phía xa, như thấy một bãi biển nào đó.",
        "Bàn tay Mahito vươn ra.",
        "[Hệ thống: Đây là một nút thắt của chuỗi nhân quả. Cửa sổ can thiệp: 1 giây.]",
      ],
      choices: [
        { t: "Dùng thuật thức chặn bàn tay Mahito", go: "a6_n_saved", req: { flag: "nanami_shielded", rel: { nanami: 30 }, level: 30 }, eff: { trace: { baove: 2 }, anti: 0 } },
        { t: "Lao tới", go: "a6_n_dead" },
      ] },
    a6_n_saved: { chapter: "Arc 6 · Tuyến Nanami", title: "Người lớn được sống", env: "night/station", cast: ["shen", "nanami", "mahito", "itadori"],
      onEnter: { fate: { nanami: "retired" }, achievement: "a_fate_nanami", exp: 12000, rel: { nanami: 15 },
        ledger: { action: "Shen chặn đòn chạm của Mahito, cứu Nanami Kento", witnesses: "Mahito, Itadori", consequence: "Nanami sống sót, mất một mắt và phải rút khỏi tuyến đầu", trigger: "Mahito căm hận Shen" } },
      text: [
        "Chú lực của Shen va vào bàn tay Mahito đúng một phần mười giây trước khi nó chạm tới Nanami. Mahito bị hất lùi lại, mắt mở to vì bất ngờ.",
        "> Ngươi... cái linh hồn nhiều nếp gấp đó... lại là ngươi!",
        "Cùng lúc đó, Itadori lao vào từ cầu thang, gầm lên như thú dữ. Mahito chửi thề, tan vào đám đông người cải biến rồi biến mất.",
        "Nanami nằm tựa vào cột, thở yếu ớt. Anh ta nhìn Shen bằng con mắt còn lại.",
        "> Tôi đã nói... đó là việc của người lớn.",
        "> Thì thầy cứ sống mà làm tiếp đi, Shen đáp.",
        "Nanami bật cười. Lần đầu tiên Shen nghe anh ta cười thành tiếng.",
      ],
      choices: [{ t: "Tiếp tục", go: "a6_climax" }] },
    a6_n_dead: { chapter: "Arc 6 · Tuyến Nanami", title: "Phần còn lại", env: "night/station", cast: ["shen", "nanami", "itadori"],
      onEnter: { fate: { nanami: "dead" }, exp: 9000, ledger: { action: "Nanami Kento tử vong dưới tay Mahito ở ga Shibuya", witnesses: "Shen, Itadori", consequence: "Itadori mất đi người thầy" } },
      text: [
        "Shen chậm một nhịp. Chỉ một nhịp.",
        "Itadori lao vào từ cầu thang đúng lúc Nanami quay sang cậu ta.",
        "> Itadori... phần còn lại, nhờ cậu.",
        "Bàn tay Mahito khép lại.",
        "[Hệ thống: Kết quả trùng với dòng chảy ban đầu.]",
      ],
      choices: [{ t: "Tiếp tục", go: "a6_climax" }] },

    /* — Tuyến Kugisaki — */
    a6_k1: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Cửa Tây", env: "night/city", cast: ["shen", "kugisaki"],
      text: ["Phía Tây đầy những chú nguyền sư theo phe Kenjaku. Một gã đeo mặt nạ cáo đang đứng trên nóc xe buýt, đốt cháy từng người dân chạy ngang qua như đốt rác.", "Kugisaki rút búa, mặt đỏ bừng vì giận.", "> Shen. Tên này của tôi. Không, của cả hai ta."],
      observe: ["u_fox"],
      choices: [{ t: "Chiến đấu", go: "a6_fox_k" }] },
    a6_fox_k: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Chú nguyền sư mặt nạ cáo", env: "night/city",
      text: ["Lửa xanh bùng lên quanh mặt nạ cáo. Kugisaki ném đinh từ bên hông, ép hắn quay về phía Shen."],
      combat: { enemies: ["u_fox"], win: "a6_fox_k_win", lose: "a6_fox_k_lose", canFlee: false } },
    a6_fox_k_win: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Mặt nạ vỡ", env: "night/city", cast: ["shen", "kugisaki"],
      onEnter: { flag: "trial_B", exp: 3000, ledger: { action: "Shen hạ chú nguyền sư mặt nạ cáo ở cửa Tây Shibuya", witnesses: "Kugisaki, phụ tá Nitta", consequence: "Học viện đề cử Shen lên Bán cấp 1" } },
      text: ["Chiếc mặt nạ vỡ đôi. Bên dưới là gương mặt của một gã đàn ông bình thường, tầm thường đến mức đáng sợ.", "> Đi thôi, Kugisaki nói, lau máu trên má. Còn nhiều đứa nữa."],
      choices: [{ t: "Tiếp tục", go: "a6_sealed_k" }] },
    a6_fox_k_lose: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Cộng Minh", env: "night/city", cast: ["shen", "kugisaki"],
      onEnter: { heal: 300 },
      text: ["Lửa liếm lên vai Shen. Cậu ngã xuống. Một cây đinh rít qua, cắm thẳng vào hình nhân rơm.", "> Cộng Minh!", "Gã mặt nạ cáo hét lên rồi bỏ chạy vào đám khói."],
      choices: [{ t: "Tiếp tục", go: "a6_sealed_k" }] },
    a6_sealed_k: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Tín hiệu biến mất", env: "night/city", cast: ["shen", "kugisaki"],
      onEnter: { fate: { gojo: "sealed" }, ledger: { action: "Gojo Satoru bị phong ấn trong Ngục Môn Cương ở tầng B5 ga Shibuya", consequence: "Thế giới chú thuật mất đi trụ cột", trigger: "Mọi thế lực bắt đầu hành động" } },
      text: ["[Hệ thống: Tín hiệu chú lực của Gojo Satoru: không còn phát hiện được.]", "Kugisaki nhìn về phía nhà ga, rồi quay đi.", "> Thầy ấy sẽ ổn thôi. Thầy ấy là mạnh nhất cơ mà."],
      choices: [{ t: "Tiếp tục", go: "a6_k_mahito" }] },
    a6_k_mahito: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Phân thân", env: "night/station", cast: ["shen", "kugisaki", "mahito"],
      text: [
        "Trong một hành lang trống của nhà ga, Kugisaki đâm đinh vào một phân thân của Mahito, rồi một phân thân khác. Cô đang thắng.",
        "Rồi bản thể thật của Mahito xuất hiện ngay sau lưng cô, bàn tay đã giơ lên ngang mặt cô.",
        "> Bắt được rồi.",
        "[Hệ thống: Đây là một nút thắt của chuỗi nhân quả. Cửa sổ can thiệp: 1 giây.]",
      ],
      choices: [
        { t: "Kéo Kugisaki ra và chặn bàn tay bằng thuật thức", go: "a6_k_saved", req: { technique: true, rel: { kugisaki: 30 }, level: 30 }, eff: { trace: { baove: 2, lienket: 1 } } },
        { t: "Lao tới", go: "a6_k_hurt" },
      ] },
    a6_k_saved: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Cây đinh vẫn còn sắc", env: "night/station", cast: ["shen", "kugisaki", "mahito", "itadori"],
      onEnter: { fate: { kugisaki: "alive" }, achievement: "a_fate_nobara", exp: 12000, rel: { kugisaki: 15 },
        ledger: { action: "Shen kéo Kugisaki khỏi đòn chạm của Mahito", witnesses: "Mahito, Itadori", consequence: "Kugisaki vẫn chiến đấu được", trigger: "Mahito căm hận Shen" } },
      text: [
        "Shen túm cổ áo Kugisaki giật ngược ra sau, đồng thời đẩy chú lực vào khoảng trống giữa hai người. Bàn tay Mahito chạm vào bức tường chú lực, lệch đi một tấc.",
        "Kugisaki ngã vào ngực Shen. Cô chớp mắt, rồi nghiến răng.",
        "> Đồ khốn. Mày định chạm vào mặt tao à?",
        "Cô đóng thẳng cây đinh vào tay Mahito. Hắn rú lên, đúng lúc Itadori lao tới từ phía cầu thang.",
        "Ba người đứng cạnh nhau. Lần đầu tiên, Mahito trông như sợ hãi.",
      ],
      choices: [{ t: "Tiếp tục", go: "a6_climax" }] },
    a6_k_hurt: { chapter: "Arc 6 · Tuyến Kugisaki", title: "Một nửa khuôn mặt", env: "night/station", cast: ["shen", "kugisaki", "itadori"],
      onEnter: { fate: { kugisaki: "injured" }, exp: 9000, ledger: { action: "Kugisaki trúng đòn Vô Vi Chuyển Biến của Mahito", witnesses: "Shen, Itadori", consequence: "Kugisaki hôn mê, sống chết chưa rõ" } },
      text: [
        "Shen chậm một nhịp.",
        "Kugisaki quay sang Itadori vừa chạy tới, mỉm cười như mọi ngày.",
        "> Itadori. Bảo mọi người... không tệ lắm đâu.",
        "Bàn tay Mahito đã chạm vào mặt cô.",
        "[Hệ thống: Kết quả trùng với dòng chảy ban đầu.]",
      ],
      choices: [{ t: "Tiếp tục", go: "a6_climax" }] },

    /* — Tuyến Itadori — */
    a6_y1: { chapter: "Arc 6 · Tuyến Itadori", title: "Tầng hầm", env: "night/station", cast: ["shen", "itadori", "choso"],
      text: ["Trên đường xuống tầng B5, một người đàn ông đứng chắn giữa sân ga. Vệt máu ngang sống mũi, ánh mắt như dao.", "Choso."],
      choices: [
        { t: "Tiếp tục", go: "a6_choso_war", req: { notFlag: "brothers_captured" }, hide: true },
        { t: "Tiếp tục", go: "a6_choso_peace", req: { flag: "brothers_captured" }, hide: true },
      ] },
    a6_choso_war: { chapter: "Arc 6 · Tuyến Itadori", title: "Xích Huyết", env: "night/station", cast: ["shen", "itadori", "choso"],
      text: ["> Itadori Yuji. Ngươi đã giết các em ta.", "Choso không chờ câu trả lời. Máu của hắn bắn ra như đạn. Itadori lao vào. Đám người cải biến ùa ra từ đường ray, nhắm vào Shen."],
      choices: [{ t: "Giữ đám cải biến cho Itadori", go: "a6_y_fight" }] },
    a6_choso_peace: { chapter: "Arc 6 · Tuyến Itadori", title: "Câu hỏi của người anh", env: "night/station", cast: ["shen", "itadori", "choso"],
      onEnter: { flag: "choso_peace", exp: 6000, ledger: { action: "Choso nói chuyện với Shen thay vì giao chiến", witnesses: "Itadori", consequence: "Itadori không bị thương nặng trước khi Sukuna thức tỉnh", trigger: "Choso nợ Shen một ân tình" } },
      text: [
        "Choso nhìn Shen, không nhìn Itadori.",
        "> Ngươi là kẻ đã tha cho các em ta.",
        "> Tại sao?",
        "Lần này Shen trả lời được: \"Vì tên anh đã che cho em nó tới phút cuối.\"",
        "Choso im lặng rất lâu. Rồi hắn thu máu về.",
        "> Hôm nay ta không đánh. Đi đi, trước khi ta đổi ý.",
        "Hắn bỏ đi. Nhưng đám người cải biến thì không.",
      ],
      choices: [{ t: "Chiến đấu", go: "a6_y_fight" }] },
    a6_y_fight: { chapter: "Arc 6 · Tuyến Itadori", title: "Đường ray", env: "night/station",
      text: ["Một đoàn tàu không người lái lao ra từ đường hầm, cửa toa mở toang, bên trong không có hành khách, chỉ có một chú linh."],
      combat: { enemies: ["c_train"], win: "a6_sealed_y", lose: "a6_sealed_y", canFlee: false } },
    a6_sealed_y: { chapter: "Arc 6 · Tuyến Itadori", title: "Vua Nguyền thức giấc", env: "night/city", cast: ["shen", "itadori", "sukuna_a1", "jogo"],
      onEnter: { fate: { gojo: "sealed" }, ledger: { action: "Gojo Satoru bị phong ấn trong Ngục Môn Cương ở tầng B5 ga Shibuya", consequence: "Thế giới chú thuật mất đi trụ cột", trigger: "Mọi thế lực bắt đầu hành động" } },
      text: [
        "[Hệ thống: Tín hiệu chú lực của Gojo Satoru: không còn phát hiện được.]",
        "Một đám trẻ con bị điều khiển nhét thẳng mười ngón tay của Sukuna vào miệng Itadori.",
        "Khi Itadori đứng dậy, đó không còn là Itadori nữa.",
        "Sukuna bước qua Shen như bước qua một tảng đá. Hắn dừng lại nửa bước.",
        "> Ồ. Lại là cái mùi chú lực lạ đó. Ngươi chín hơn rồi đấy, nhóc con. Nhưng vẫn chưa đủ.",
        "Rồi hắn đi gặp Jogo. Trận chiến của hai đặc cấp thiêu rụi ba khu phố.",
      ],
      observe: ["sukuna_a1", "jogo"],
      choices: [{ t: "Tiếp tục", go: "a6_climax", eff: { known: "sukuna_nho_shen" } }] },

    /* — Hội tụ — */
    a6_climax: { chapter: "Arc 6", title: "Shibuya bốc cháy", env: "night/city", cast: ["shen"],
      onEnter: { heal: 400, exp: 12000 },
      text: [
        "Nửa đêm. Một nửa Shibuya đã thành tro. Sukuna triển khai lãnh địa giữa phố, xóa sổ mọi thứ trong bán kính hai trăm mét.",
        "Shen sống sót vì đứng đúng chỗ, hoặc vì Hệ thống đẩy cậu ra khỏi vùng ảnh hưởng nửa giây trước đó. Cậu không chắc điều nào đúng.",
        "Giữa đống đổ nát, một nhóm người dân đang mắc kẹt dưới cầu vượt. Và một kẻ đeo mặt nạ cáo đang đi về phía họ, tay cầm lửa xanh.",
      ],
      choices: [
        { t: "Chắn trước người dân", go: "a6_fox", req: { notFlag: "trial_B" }, hide: true, eff: { moral: 3 } },
        { t: "Đưa người dân ra khỏi cầu vượt", go: "a6_kenjaku", req: { flag: "trial_B" }, hide: true, eff: { moral: 2, rep: { danthuong: 5 } } },
      ] },
    a6_fox: { chapter: "Arc 6", title: "Chú nguyền sư mặt nạ cáo", env: "night/city", cast: ["shen", "u_fox"],
      text: ["> Một đứa học sinh? Ta tưởng tụi chú thuật sư chết hết rồi chứ.", "Lửa xanh bùng lên quanh mặt nạ cáo."],
      observe: ["u_fox"],
      choices: [{ t: "Chiến đấu", go: "a6_fox_fight" }] },
    a6_fox_fight: { chapter: "Arc 6", title: "Mặt nạ cáo", env: "night/city",
      text: ["Phía sau Shen là mười hai người dân. Không còn đường lùi."],
      combat: { enemies: ["u_fox"], win: "a6_fox_win", lose: "a6_fox_lose", canFlee: false } },
    a6_fox_lose: { chapter: "Arc 6", title: "Viện binh", env: "night/city", cast: ["shen", "meimei"],
      onEnter: { heal: 400 },
      text: ["Shen gục xuống. Một đàn quạ đen lao xuống từ bầu trời, bủa vây gã mặt nạ cáo.", "> Cậu bé, tôi sẽ tính phí cứu mạng sau, một giọng phụ nữ uể oải vang lên.", "Mei Mei. Chú thuật sư Cấp 1, nổi tiếng vì yêu tiền hơn yêu đời."],
      choices: [{ t: "Đứng dậy, đánh tiếp", go: "a6_fox_fight" }] },
    a6_fox_win: { chapter: "Arc 6", title: "Mười hai người", env: "night/city", cast: ["shen"],
      onEnter: { flag: "trial_B", rep: { danthuong: 8 }, ledger: { action: "Shen hạ chú nguyền sư mặt nạ cáo, bảo vệ 12 người dân ở Shibuya", witnesses: "12 người dân, Mei Mei", consequence: "Học viện đề cử Shen lên Bán cấp 1" } },
      text: ["Chiếc mặt nạ vỡ đôi. Mười hai người dân run rẩy bước ra khỏi gầm cầu vượt. Một bà cụ nắm tay Shen, không nói được lời nào.", "[Hệ thống: Hoàn thành điều kiện sát hạch Rank B: đánh bại chú nguyền sư Bán cấp 1 trong thực chiến.]"],
      choices: [{ t: "Tiếp tục", go: "a6_kenjaku" }] },

    a6_kenjaku: { chapter: "Arc 6", title: "Kẻ đứng sau tất cả", env: "night/city", cast: ["shen", "kenjaku", "itadori"],
      text: [
        "Rạng sáng. Itadori, được Todo hỗ trợ, dồn Mahito vào đường cùng. Đúng lúc cậu ta định ra đòn cuối, một người đàn ông mặc áo cà sa bước ra, nuốt chửng Mahito.",
        "Geto Suguru. Người đã chết từ năm năm trước. Đường khâu chạy ngang trán hắn.",
        "> Không phải Geto đâu, Shen nghe chính mình thì thầm. Hệ thống không lên tiếng, nhưng cậu biết.",
        "Kẻ đội lốt Geto mỉm cười, nhìn thẳng về phía Shen.",
        "> Chú lực của nhóc không khớp với bất kỳ dòng máu nào tôi từng ghi chép suốt một nghìn năm. Tôi không đoán trước được nhóc. Thú vị.",
        "Hắn giơ tay lên. Trên khắp Nhật Bản, những người từng bị hắn gieo mầm thức tỉnh cùng lúc.",
        "> Trò chơi bắt đầu.",
      ],
      observe: ["kenjaku"],
      choices: [{ t: "Tiếp tục", go: "a6_after", eff: { known: "kenjaku_de_y_shen", ledger: { action: "Kenjaku chú ý tới chú lực không rõ nguồn gốc của Shen", witnesses: "Itadori, Todo", consequence: "Kenjaku bắt đầu tò mò về Shen", trigger: "Tử Diệt Hồi Du" } } }] },

    a6_after: { chapter: "Hết Arc 6", title: "Sau Shibuya", env: "rain/temple", cast: ["shen", "itadori", "fushiguro"],
      onEnter: { quest: { id: "q_shibuya", status: "done" }, achievement: "a_shibuya", exp: 30000, sp: 200, time: { days: 3, label: "Tháng 11, 2018" } },
      conds: [
        { req: { flag: "path_nanami" }, eff: { rel: { nanami: 5 } } },
        { req: { flag: "path_nobara" }, eff: { rel: { kugisaki: 5 } } },
        { req: { flag: "path_yuji" }, eff: { rel: { itadori: 5 } } },
      ],
      text: [
        "Ba ngày sau. Gojo Satoru bị phong ấn. Thượng tầng tuyên bố Gojo là đồng phạm, trục xuất anh ta khỏi giới chú thuật. Lệnh xử tử Itadori được khôi phục.",
        "Học viện như một ngôi nhà mất mái. Mưa suốt ba ngày.",
        "Shen mở bảng Hệ thống, đọc lại từng dòng trong sổ nhân quả. Có những tên người vẫn còn ở đó, vì cậu. Có những tên đã không còn, dù cậu đã cố.",
        "[Hệ thống: Đánh giá thực chiến tại Shibuya đã được gửi về Học viện.]",
      ],
      special: "rankup", go: "a6_end" },
    a6_end: { chapter: "Hết Arc 6", title: "Còn tiếp: Tử Diệt Hồi Du", env: "night/temple", cast: ["shen"],
      text: ["Đêm đó, một tin nhắn lạ hiện lên trong bảng Hệ thống, không theo định dạng thường lệ:", "[...Ký chủ đã đi lệch khỏi dòng chảy ban đầu. Tiếp tục quan sát.]", "Người gửi: không xác định.", "[Arc 7 — Tử Diệt Hồi Du: đang được phát triển.]"],
      choices: [] },
  });
})(typeof window !== "undefined" ? window : globalThis);
