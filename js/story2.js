/* =====================================================================
   CURSED DESTINY — ARC 2: ĐỐI ĐẦU MAHITO · ARC 3: GIAO LƯU KYOTO
   env: "thời điểm/địa điểm" cho phông cảnh · cast: chân dung trong cảnh
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {});
  Object.assign(CD.SCENES, {
    /* ======================= ARC 2: ĐỐI ĐẦU MAHITO ======================= */
    a2_start: { chapter: "Arc 2 · Đối đầu Mahito", title: "Nhiệm vụ ở Kawasaki", env: "day/temple", cast: ["shen", "gojo", "fushiguro"],
      onEnter: { arc: "arc2", time: { days: 6, label: "Tháng 7, 2018" }, heal: "full", quest: { id: "q_kawasaki", status: "active" } },
      text: [
        "Một tuần sau lễ tưởng niệm, Gojo gọi Shen lên văn phòng. Anh ta đang ăn bánh mochi, vừa nhai vừa chia việc.",
        "> Megumi và Nobara đi cùng đàn anh năm hai. Còn nhóc sẽ phụ một người quen cũ của tôi ở Kawasaki. Ba người chết trong rạp chiếu phim, xác bị vặn méo như đất sét.",
        "> À, ở đó có một bất ngờ dành cho nhóc. Đừng khóc nhé.",
        "Fushiguro nhìn Shen, rồi nhìn Gojo, như muốn hỏi gì đó nhưng lại thôi.",
      ],
      choices: [{ t: "Lên tàu tới Kawasaki", go: "a2_nanami" }] },

    a2_nanami: { chapter: "Arc 2", title: "Người đàn ông ghét làm thêm giờ", env: "day/city", cast: ["shen", "nanami"],
      text: [
        "Người đợi Shen ở quán cà phê đối diện ga là một người đàn ông tóc vàng chải gọn, mặc vest be, đeo kính râm có gọng hình răng cưa. Anh ta nhìn đồng hồ ngay khi Shen bước vào.",
        "> Nanami Kento. Chú thuật sư Cấp 1. Tôi làm việc từ chín giờ sáng đến năm giờ chiều. Ngoài khung giờ đó, đừng tìm tôi.",
        "> Cậu sẽ làm cùng tôi và một người nữa. Cậu ta tới rồi.",
        "Cửa quán mở. Một cậu thiếu niên tóc hồng thò đầu vào, cười toe toét.",
        "> Yo, Shen!",
        "Đó là Itadori Yuji. Người mà Shen đã tận mắt thấy chết trên nền xi măng ướt mưa.",
      ],
      observe: ["nanami"],
      choices: [
        { t: "Lao tới đấm cậu ta một cú", go: "a2_reveal", eff: { rel: { itadori: 6 }, trace: { xungkich: 1 } } },
        { t: "Đứng chết lặng", go: "a2_reveal", eff: { rel: { itadori: 4 } } },
        { t: "\"Thầy Gojo biết chuyện này từ đầu à?\"", go: "a2_reveal", eff: { rel: { gojo: -2 }, trace: { quansat: 1 } } },
      ] },

    a2_reveal: { chapter: "Arc 2", title: "Bí mật", env: "day/city", cast: ["shen", "itadori", "nanami"],
      onEnter: { flag: "itadori_alive_known", known: "itadori_con_song" },
      text: [
        "Itadori gãi đầu, kể lại mọi chuyện. Sau khi tim ngừng đập, Sukuna đã chữa lành cơ thể cậu ta để đổi lấy một giao ước mà chính Itadori cũng không nhớ rõ nội dung.",
        "> Thầy Gojo bảo nếu Thượng tầng biết tớ còn sống, họ sẽ tìm cách xử tử tớ lần nữa. Nên tớ phải trốn tới Giao lưu Kyoto.",
        "> Xin lỗi vì không nói sớm hơn. Cậu giữ bí mật giúp tớ nhé?",
        "Nanami nhấp một ngụm cà phê, như thể chuyện người chết sống lại là việc thường ngày.",
        "[Hệ thống: Cập nhật thông tin. Itadori Yuji — trạng thái: Sống. Giao ước với Sukuna: không rõ.]",
      ],
      choices: [
        { t: "\"Tôi hứa. Mừng là cậu còn sống.\"", go: "a2_cinema", eff: { rel: { itadori: 6 }, moral: 2 } },
        { t: "\"Tôi giữ. Nhưng cậu nợ tôi một bữa ramen.\"", go: "a2_cinema", eff: { rel: { itadori: 8 } } },
      ] },

    a2_cinema: { chapter: "Arc 2", title: "Rạp chiếu phim", env: "night/city", cast: ["shen", "nanami", "itadori"],
      text: [
        "Rạp chiếu phim đã bị phong tỏa. Trên tấm ảnh hiện trường, ba thi thể bị vặn xoắn như đất sét, khuôn mặt kéo dài ra theo những hình thù không thuộc về con người.",
        "> Không phải độc, không phải bệnh. Ai đó đã thay đổi hình dạng linh hồn của họ, và cơ thể chỉ đi theo, Nanami nói.",
        "Shen nhắm mắt. Trong rạp vẫn còn sót lại một vệt chú lực kỳ lạ, như vết bút chì bị tẩy dở.",
        "[Hệ thống: Phát hiện tàn dư chú lực. Nguồn: chú linh có trí tuệ. Mức nguy hiểm: không xác định.]",
      ],
      choices: [
        { t: "Lần theo vệt tàn dư", go: "a2_junpei", eff: { exp: 500, trace: { quansat: 1 } } },
        { t: "Hỏi nhân viên rạp về những người có mặt hôm đó", go: "a2_junpei", eff: { exp: 500, known: "junpei_o_rap" } },
      ] },

    a2_junpei: { chapter: "Arc 2", title: "Cậu bé ở hàng ghế cuối", env: "dusk/river", cast: ["shen", "itadori", "junpei"],
      text: [
        "Manh mối dẫn tới một cậu học sinh tên Yoshino Junpei, người có mặt trong rạp đúng tối hôm đó. Ba nạn nhân đều là những kẻ từng bắt nạt cậu ta.",
        "Itadori và Shen tìm thấy Junpei ngồi một mình bên bờ sông, mái tóc dài che nửa khuôn mặt. Trên trán cậu ta có một vết sẹo bỏng hình tròn.",
        "> Các cậu là cảnh sát à? Không giống lắm.",
        "Itadori hỏi cậu ta thích phim gì. Junpei ngạc nhiên. Rồi hai người nói về phim kinh dị suốt nửa tiếng, quên luôn Shen.",
        "Lúc trời sẩm tối, một người phụ nữ đi chợ về ngang qua, tay xách túi rau. Đó là mẹ của Junpei.",
        "> Bạn của Junpei à? Vào nhà ăn cơm đi! Cô nấu cà ri!",
      ],
      observe: ["junpei"],
      choices: [
        { t: "Nhận lời ăn tối", go: "a2_hub1", eff: { rel: { junpei: 6, nagi: 8 }, moral: 1 } },
        { t: "Từ chối khéo, nhưng hẹn gặp lại Junpei", go: "a2_hub1", eff: { rel: { junpei: 3 } } },
      ] },

    a2_hub1: { chapter: "Arc 2 · Thời gian tự do", title: "Điều tra ở Kawasaki", env: "day/city", cast: ["shen", "nanami"],
      onEnter: { quest: { id: "q_junpei", status: "active" } },
      text: ["Bữa tối nhà Junpei ấm cúng tới mức Shen quên mất mình đang điều tra một vụ giết người.", "Nhưng khi ra về, Shen để ý thấy một luồng chú lực rất mờ quanh căn nhà nhỏ đó.", "[Hệ thống: Gợi ý — gắn bó với một người đủ lâu sẽ giúp Ký chủ thấy những thứ người ngoài không thấy.]"],
      hub: "a2_hub1", go: "a2_sewer" },

    a2_sewer: { chapter: "Arc 2", title: "Đường cống ngầm", env: "night/sewer", cast: ["shen", "nanami"],
      text: [
        "Nanami lần ra nơi ẩn náu của kẻ đứng sau: một đường cống ngầm bỏ hoang dưới lòng thành phố. Itadori được giao canh chừng Junpei.",
        "> Năm giờ hai phút. Tôi đang làm thêm giờ, Nanami lẩm bẩm, nới lỏng cà vạt.",
        "Trong bóng tối, những thân hình méo mó bò ra. Chúng từng là người: đầu nghiêng sai góc, tay mọc ở chỗ không nên có tay.",
        "> Tôi lo phía trước. Cậu giữ phía sau. Đừng nhìn mặt chúng quá lâu.",
      ],
      choices: [{ t: "Chiến đấu", go: "a2_sewer_fight" }] },

    a2_sewer_fight: { chapter: "Arc 2", title: "Người cải biến", env: "night/sewer",
      text: ["Một thân hình hai đầu lao về phía Shen, cả hai cái miệng cùng gào lên một âm thanh không ra tiếng người."],
      combat: { enemies: ["c_kaihen2"], win: "a2_sewer_mahito", lose: "a2_sewer_lose", canFlee: false } },

    a2_sewer_lose: { chapter: "Arc 2", title: "Bảy trên ba", env: "night/sewer", cast: ["shen", "nanami"],
      onEnter: { heal: 120, rel: { nanami: 3 } },
      text: ["Shen ngã xuống nền cống ẩm ướt. Một lưỡi dao bọc vải lướt qua đầu cậu, cắt đôi sinh vật ở đúng điểm chia tỷ lệ bảy trên ba.", "> Đứng dậy được không? Tốt. Chưa xong đâu."],
      choices: [{ t: "Tiếp tục", go: "a2_sewer_mahito" }] },

    a2_sewer_mahito: { chapter: "Arc 2", title: "Kẻ có vết khâu", env: "night/sewer", cast: ["shen", "nanami", "mahito"],
      text: [
        "Ở cuối đường cống, một người ngồi vắt vẻo trên ống nước như đang xem kịch. Tóc dài màu xám xanh, khuôn mặt chằng chịt những đường khâu.",
        "> Chú thuật sư à? Lại còn mang theo một đứa trẻ thú vị nữa.",
        "Hắn nhìn thẳng vào Shen. Lần đầu tiên, Shen có cảm giác ai đó đang nhìn xuyên qua da thịt, chạm vào thứ nằm sâu bên dưới.",
        "> Linh hồn của nhóc có hai lớp. Một lớp là nhóc. Lớp còn lại thì... đang đếm.",
        "[CẢNH BÁO: Cá thể có khả năng tác động trực tiếp lên linh hồn. Hệ thống không thể bảo vệ Ký chủ khỏi đòn chạm.]",
        "Nanami lao lên. Lưỡi dao của anh ta chém trúng, nhưng vết thương trên người Mahito lành lại như đất sét được nặn lại.",
      ],
      observe: ["mahito"],
      choices: [
        { t: "Chắn trước Nanami khi Mahito vươn tay", go: "a2_sewer_end", eff: { moral: 3, rel: { nanami: 8 }, hpSet: 30, trace: { baove: 2 }, ledger: { action: "Shen chắn đòn chạm của Mahito cho Nanami", witnesses: "Nanami, Mahito", consequence: "Mahito ghi nhớ linh hồn hai lớp của Shen", trigger: "Mahito sẽ tìm Shen lần nữa" } } },
        { t: "Dùng thuật thức tấn công Mahito", go: "a2_sewer_end", req: { technique: true }, eff: { exp: 800, known: "mahito_quan_tam", trace: { xungkich: 1 } } },
        { t: "Kéo Nanami rút lui", go: "a2_sewer_end", eff: { rel: { nanami: 4 }, trace: { lienket: 1 } } },
      ] },

    a2_sewer_end: { chapter: "Arc 2", title: "Người lớn", env: "night/street", cast: ["shen", "nanami"],
      onEnter: { exp: 2500, sp: 40 },
      text: [
        "Mahito biến mất vào dòng nước đen. Nanami ngồi tựa vào tường, sườn trái bị biến dạng một mảng nhỏ. Nếu chậm thêm một giây, cả cơ thể anh ta đã thành đất sét.",
        "> Cậu là trẻ con, Nanami nói, giọng không giận. Việc của người lớn là gánh những thứ như thế này. Lần sau, đừng tranh phần việc của tôi.",
        "Anh ta đứng dậy, chỉnh lại kính.",
        "> Hai ngày. Tôi cần hai ngày để hồi phục. Trong lúc đó, để mắt tới cậu bé Yoshino.",
      ],
      choices: [{ t: "Tiếp tục", go: "a2_hub2" }] },

    a2_hub2: { chapter: "Arc 2 · Thời gian tự do", title: "Hai ngày trước cơn bão", env: "day/city", cast: ["shen", "itadori"],
      text: ["Itadori bảo Junpei dạo này hay nói về \"một người thầy mới\". Cậu ta không nói người đó là ai."],
      hub: "a2_hub2", go: "a2_turn" },

    a2_turn: { chapter: "Arc 2", title: "Đêm trước buổi chào cờ", env: "night/street", cast: ["shen"],
      text: ["Đêm cuối cùng. Shen đứng trước ngõ nhà Junpei. Đèn bếp vẫn sáng.", "[Hệ thống: Chuỗi nhân quả đã khép lại. Kết quả phụ thuộc vào những gì Ký chủ đã làm trong những ngày qua.]"],
      choices: [
        { t: "Gõ cửa", go: "a2_safe", req: { flag: "finger_found" }, hide: true },
        { t: "Gõ cửa", go: "a2_tragedy", req: { notFlag: "finger_found" }, hide: true },
      ] },

    a2_tragedy: { chapter: "Arc 2", title: "Căn nhà tắt đèn", env: "rain/street", cast: ["shen", "itadori"],
      onEnter: { moral: -1, ledger: { action: "Bà Yoshino Nagi qua đời vì chú linh bị chú vật đặc cấp thu hút", witnesses: "Không ai", consequence: "Junpei biến mất, tìm tới Mahito", trigger: "Buổi chào cờ ở Satozakura" } },
      text: [
        "Không ai trả lời. Cánh cửa khép hờ. Mùi cà ri nguội lẫn với mùi chú lực tanh nồng.",
        "Trong bếp, bà Nagi nằm bất động. Chú linh đã giết bà bị một thứ gì đó thu hút tới: trên kệ giày ở cửa ra vào, một ngón tay khô quấn bùa vẫn đang tỏa chú lực.",
        "Ai đó đã cố tình đặt nó ở đây.",
        "Junpei không có ở nhà.",
        "Itadori đứng sau lưng Shen, nắm tay siết tới trắng bệch.",
      ],
      choices: [{ t: "Chạy tới trường Satozakura", go: "a2_school_dark" }] },

    a2_safe: { chapter: "Arc 2", title: "Bữa tối bình thường", env: "night/street", cast: ["shen", "junpei", "nagi"],
      onEnter: { moral: 3, ledger: { action: "Bà Yoshino Nagi an toàn nhờ Shen tìm ra chú vật kịp thời", witnesses: "Shen", consequence: "Kế hoạch của Mahito bị lệch" } },
      text: [
        "Bà Nagi mở cửa, cười to như mọi tối. Không có chú linh nào tới căn nhà này nữa kể từ khi Shen mang ngón tay kia đi.",
        "Sau bữa tối, Junpei kéo Shen ra hiên.",
        "> Người thầy mà tớ kể... anh ta có vết khâu trên mặt. Anh ta bảo ngày mai, ở buổi chào cờ, tớ nên cho cả trường thấy những kẻ đã làm gì tớ.",
        "> Anh ta nói con người chỉ là những hình dạng có thể nhào nặn. Tớ từng thấy câu đó... đúng. Nhưng giờ thì tớ không chắc nữa.",
      ],
      choices: [
        { t: "Nói thật với Junpei: kẻ đó là chú linh đã giết ba người ở rạp phim", go: "a2_school_light", req: { anyFlag: ["junpei_tin_shen"] }, eff: { flag: "junpei_refuse", rel: { junpei: 8 }, moral: 2 } },
        { t: "Không nói gì, ngày mai bám theo cậu ấy", go: "a2_school_light", eff: { trace: { quansat: 1 } } },
      ] },

    a2_school_dark: { chapter: "Arc 2", title: "Buổi chào cờ", env: "day/school", cast: ["shen", "itadori", "junpei"],
      text: [
        "Hội trường trường Satozakura. Học sinh và giáo viên nằm la liệt, mê man vì chất độc của thức thần mà Junpei mới có được. Junpei đứng trên bục, mắt đỏ hoe.",
        "> Đừng cản tớ, Itadori! Mẹ tớ chết rồi! Bọn chúng đáng bị như vậy!",
        "Itadori lao lên bục. Shen chưa kịp theo thì phía sau hội trường, cửa kho vỡ tung. Một sinh vật khổng lồ chui ra, nó từng là bảo vệ của trường.",
        "> Shen! Lo cái đó giúp tớ! Junpei để tớ!",
      ],
      choices: [{ t: "Chiến đấu", go: "a2_school_fight_d" }] },

    a2_school_fight_d: { chapter: "Arc 2", title: "Người cải biến khổng lồ", env: "day/school",
      text: ["Thân hình phình to chạm tới trần hội trường. Mỗi bước chân của nó làm sàn gỗ nứt toác."],
      combat: { enemies: ["c_kaihen_big"], win: "a2_mahito_dark", lose: "a2_mahito_dark", canFlee: false } },

    a2_mahito_dark: { chapter: "Arc 2", title: "Hình dạng của linh hồn", env: "day/school", cast: ["shen", "itadori", "junpei", "mahito"],
      onEnter: { flag: "junpei_dead" },
      text: [
        "Khi Shen quay lại, Itadori đã thuyết phục được Junpei. Cậu ta khóc, buông thõng hai tay.",
        "Rồi một bàn tay đặt lên đầu Junpei từ phía sau.",
        "> Cậu làm tốt lắm, Junpei. Giờ thì đến lượt tôi.",
        "Mahito mỉm cười. Cơ thể Junpei vặn xoắn, phình ra, biến dạng. Tiếng hét của cậu ta tắt lịm giữa chừng.",
        "Shen lao tới. Quá muộn. Thứ còn lại trên sàn không còn là Junpei nữa.",
        "Itadori đứng im. Rồi một tiếng gầm bật ra từ cổ họng cậu ta, không giống tiếng người.",
      ],
      choices: [{ t: "Đứng cạnh Itadori", go: "a2_final_fight", eff: { rel: { itadori: 6 }, trace: { lienket: 1 } } }, { t: "Lao vào Mahito", go: "a2_final_fight", eff: { hpSet: 60, trace: { xungkich: 2 }, anti: 2 } }] },

    a2_school_light: { chapter: "Arc 2", title: "Buổi chào cờ", env: "day/school", cast: ["shen", "junpei", "itadori"],
      text: [
        "Buổi chào cờ diễn ra bình thường. Junpei đứng ở hàng cuối, cạnh Shen, tay giấu trong túi áo.",
        "Rồi đèn hội trường vụt tắt. Từ cửa kho phía sau, một sinh vật khổng lồ chui ra, nó từng là bảo vệ của trường. Học sinh la hét bỏ chạy.",
        "Trên ban công tầng hai, Mahito ngồi vắt vẻo, vẫy tay với Junpei như vẫy một người bạn cũ.",
        "> Thôi nào, Junpei. Đây là sân khấu của cậu cơ mà.",
      ],
      choices: [{ t: "Đẩy Junpei ra sau lưng, chiến đấu", go: "a2_school_fight_l", eff: { moral: 2 } }] },

    a2_school_fight_l: { chapter: "Arc 2", title: "Người cải biến khổng lồ", env: "day/school",
      text: ["Sinh vật khổng lồ gầm lên, lao thẳng về phía hai người."],
      combat: { enemies: ["c_kaihen_big"], win: "a2_mahito_light", lose: "a2_mahito_light", canFlee: false } },

    a2_mahito_light: { chapter: "Arc 2", title: "Linh hồn không bị nhào nặn", env: "day/school", cast: ["shen", "junpei", "itadori", "mahito"],
      onEnter: { flag: "junpei_alive" },
      conds: [{ req: { flag: "junpei_refuse" }, eff: { rel: { junpei: 10 }, anti: 0 } }],
      text: [
        "Mahito nhảy xuống, vươn tay về phía Junpei. Junpei lùi lại, đứng sát vào Shen.",
        "> Tôi không đi với anh. Mẹ tôi vẫn đang đợi tôi về ăn tối.",
        "Nụ cười của Mahito méo đi một chút. Bàn tay hắn đổi hướng, chộp lấy Itadori vừa lao tới.",
        "Rồi hắn khựng lại. Bên trong Itadori, một thứ gì đó mở mắt. Shen không nghe được Sukuna nói gì, chỉ thấy Mahito rụt tay về như chạm phải lửa.",
        "> ...Được thôi. Hôm nay không vui chút nào.",
        "Những thân người méo mó khác bò ra từ cửa kho, chặn đường giữa họ và Mahito.",
      ],
      choices: [{ t: "Chiến đấu", go: "a2_final_fight" }] },

    a2_final_fight: { chapter: "Arc 2", title: "Đám cải biến cuối cùng", env: "day/school", onEnter: { heal: 150 },
      text: ["Nanami vừa tới, lao thẳng về phía Mahito cùng Itadori. Hai sinh vật méo mó chặn đường Shen."],
      combat: { enemies: ["c_kaihen", "c_kaihen2"], win: "a2_escape", lose: "a2_escape", canFlee: false } },

    a2_escape: { chapter: "Arc 2", title: "Dòng nước đen", env: "dusk/river", cast: ["shen", "itadori", "nanami"],
      text: [
        "Itadori và Nanami dồn Mahito tới tận cửa xả nước của thành phố. Bị đánh trúng một đòn khiến linh hồn chấn động, Mahito tự xé mình làm đôi, nửa thân trôi theo dòng nước đen rồi biến mất.",
        "Hắn đã chạy thoát.",
      ],
      choices: [
        { t: "Tiếp tục", go: "a2_end_alive", req: { flag: "junpei_alive" }, hide: true },
        { t: "Tiếp tục", go: "a2_end_dead", req: { notFlag: "junpei_alive" }, hide: true },
      ] },

    a2_end_alive: { chapter: "Hết Arc 2", title: "Bữa cà ri", env: "night/street", cast: ["shen", "junpei", "nagi", "itadori"],
      onEnter: { exp: 3500, sp: 60, achievement: "a_junpei", fate: { junpei: "alive", nagi: "alive" }, quest: [{ id: "q_kawasaki", status: "done" }, { id: "q_junpei", status: "done" }], rep: { danthuong: 5, tokyo: 5 },
        ledger: { action: "Yoshino Junpei sống sót và từ chối Mahito", witnesses: "Itadori, Nanami, Mahito", consequence: "Mahito không có được con tốt mình muốn", trigger: "Junpei có tiềm năng chú lực. Học viện có thể để mắt tới cậu ta" } },
      text: [
        "Tối hôm đó, bà Nagi nấu một nồi cà ri to nhất từ trước tới nay. Itadori ăn ba bát. Nanami từ chối lời mời, nhưng nhận một hộp mang về.",
        "Junpei ngồi cạnh Shen ở bậc thềm.",
        "> Nếu không có cậu, có lẽ tớ đã làm điều không thể quay lại được.",
        "[Hệ thống: Chuỗi nhân quả đã thay đổi so với dòng chảy ban đầu. Ghi nhận.]",
        "Shen không biết \"dòng chảy ban đầu\" mà Hệ thống nhắc tới là gì. Cậu ghi nhớ câu đó.",
      ],
      choices: [{ t: "Bắt đầu Arc 3: Giao lưu Kyoto", go: "a3_start", eff: { known: "dong_chay_ban_dau" } }] },

    a2_end_dead: { chapter: "Hết Arc 2", title: "Những hình dạng", env: "rain/street", cast: ["shen", "itadori", "nanami"],
      onEnter: { exp: 3500, sp: 40, fate: { junpei: "dead", nagi: "dead" }, quest: [{ id: "q_kawasaki", status: "done" }, { id: "q_junpei", status: "failed" }], rep: { tokyo: 5 },
        ledger: { action: "Yoshino Junpei bị Mahito biến đổi và tử vong", witnesses: "Shen, Itadori", consequence: "Itadori thề sẽ giết Mahito" } },
      text: [
        "Trời mưa suốt đêm. Itadori ngồi dưới mái hiên, không nói gì.",
        "> Lần sau gặp nó, tớ sẽ giết nó. Không phải vì chính nghĩa. Chỉ là tớ sẽ giết nó.",
        "Nanami đặt tay lên vai cả hai.",
        "> Các cậu đã làm tất cả những gì có thể. Phần còn lại không phải lỗi của các cậu.",
        "[Hệ thống: Kết quả trùng với dòng chảy ban đầu. Ghi nhận.]",
        "Shen không biết \"dòng chảy ban đầu\" mà Hệ thống nhắc tới là gì. Cậu ghi nhớ câu đó.",
      ],
      choices: [{ t: "Bắt đầu Arc 3: Giao lưu Kyoto", go: "a3_start", eff: { known: "dong_chay_ban_dau" } }] },

    /* ======================= ARC 3: GIAO LƯU KYOTO ======================= */
    a3_start: { chapter: "Arc 3 · Giao lưu Kyoto", title: "Đàn anh năm hai", env: "day/temple", cast: ["shen", "maki", "panda", "inumaki"],
      onEnter: { arc: "arc3", time: { days: 10, label: "Tháng 8, 2018" }, heal: "full", quest: { id: "q_kyoto", status: "active" } },
      text: [
        "Tháng Tám. Fushiguro, Kugisaki và Shen được gọi ra sân. Đứng đợi họ là ba người năm hai.",
        "Một cô gái đeo kính, tóc buộc đuôi ngựa, vác cây thương dài hơn người: Zenin Maki. Một cậu trai cổ áo kéo cao che kín miệng: Inumaki Toge. Và một con gấu trúc biết nói: Panda.",
        "> Năm sau Giao lưu Kyoto sẽ diễn ra vào tháng Chín, Maki nói. Năm nay năm ba bị đình chỉ, nên năm nhất phải ra sân. Một tháng. Chúng tôi sẽ luyện cho các cậu.",
        "> Cá hồi, Inumaki nói.",
        "> Cậu ấy bảo rất vui được gặp, Panda dịch.",
      ],
      observe: ["maki", "panda", "inumaki"],
      choices: [{ t: "Chào đàn anh đàn chị", go: "a3_todo", eff: { rel: { maki: 2, panda: 2, inumaki: 2 } } }] },

    a3_todo: { chapter: "Arc 3", title: "Câu hỏi của Todo", env: "day/temple", cast: ["shen", "todo", "mai"],
      text: [
        "Chiều hôm đó, hai học sinh Kyoto tới trường để \"thăm dò\". Một cô gái tóc ngắn có nụ cười khó chịu, Zenin Mai. Và một gã khổng lồ cơ bắp, áo sơ mi phanh ngực, vết sẹo dọc mặt: Todo Aoi.",
        "Todo đi thẳng tới trước mặt Shen, cúi người xuống.",
        "> Nhóc. Trả lời ta một câu. Kiểu người mà nhóc ngưỡng mộ là kiểu người như thế nào?",
        "Phía sau, Maki khẽ lắc đầu, như muốn nói: trả lời sai là ăn đòn.",
      ],
      observe: ["todo", "mai"],
      choices: [
        { t: "\"Người dám đứng thẳng lưng trước kẻ mạnh hơn mình.\"", go: "a3_todo_ok", eff: { rel: { todo: 15 }, flag: "todo_bro" } },
        { t: "\"Người hiền lành, biết nấu ăn.\"", go: "a3_todo_hit", eff: { rel: { todo: -3 } } },
        { t: "\"Không liên quan tới anh.\"", go: "a3_todo_hit", eff: { rel: { todo: -5 }, anti: 1 } },
      ] },

    a3_todo_ok: { chapter: "Arc 3", title: "Nước mắt của Todo", env: "day/temple", cast: ["shen", "todo", "maki"],
      onEnter: { exp: 800 },
      text: [
        "Todo đứng im ba giây. Rồi nước mắt chảy dài trên khuôn mặt đầy sẹo.",
        "> Câu trả lời của một nam nhi. Ta suýt nữa thì gọi nhóc là bạn thân.",
        "Mai kéo tay áo Todo lôi đi. Trước khi rời khỏi, cậu ta quay lại:",
        "> Ở Giao lưu, nếu nhóc gặp ta, ta sẽ đánh nhóc nhẹ tay. Một chút.",
        "> Đó là lời khen đấy, Maki thở dài.",
      ],
      choices: [{ t: "Bắt đầu tháng luyện tập", go: "a3_hub1" }] },

    a3_todo_hit: { chapter: "Arc 3", title: "Nhàm chán", env: "day/temple", cast: ["shen", "todo", "maki"],
      onEnter: { hpSet: 40, exp: 600 },
      text: [
        "> Nhàm chán.",
        "Shen không thấy nắm đấm. Chỉ thấy mình đang bay ngang qua sân, đâm vào thân cây cổ thụ.",
        "Khi cậu ngóc đầu dậy được, Maki đã đứng chắn trước Todo, mũi thương chĩa vào cổ họng gã.",
        "> Về Kyoto đi, đồ khỉ đột.",
        "Todo nhìn Shen đang lồm cồm bò dậy, nhướn mày.",
        "> Ít nhất nhóc đứng dậy được. Ta nhớ mặt nhóc rồi.",
      ],
      choices: [{ t: "Bắt đầu tháng luyện tập", go: "a3_hub1", eff: { rel: { todo: 6, maki: 4 } } }] },

    a3_hub1: { chapter: "Arc 3 · Thời gian tự do", title: "Một tháng trước Giao lưu", env: "day/temple", cast: ["shen", "maki", "panda"],
      onEnter: { heal: "full" },
      text: ["Một tháng luyện tập, tóm gọn trong bảy ngày quan trọng nhất.", "[Hệ thống: Học viện mở thêm hai nhiệm vụ thực chiến. Đàn anh đàn chị sẵn lòng luyện cùng nếu được nhờ.]"],
      hub: "a3_hub1", go: "a3_event" },

    a3_event: { chapter: "Arc 3", title: "Ngày Giao lưu", env: "day/forest", cast: ["shen", "gojo", "itadori", "kugisaki"],
      onEnter: { time: { days: 22, label: "Tháng 9, 2018" }, heal: "full" },
      text: [
        "Sáng ngày Giao lưu. Hai đội đứng đối diện nhau trước khu rừng của học viện. Gojo kéo theo một chiếc thùng gỗ to tướng.",
        "> Quà từ Tokyo cho mọi người đây!",
        "Nắp thùng bật mở. Itadori nhảy ra, hai tay giơ cao: \"Bất ngờ chưa!\"",
        "Không ai vỗ tay. Kugisaki trừng mắt, giọng run lên vì giận và vì một thứ khác giận rất nhiều. Fushiguro quay mặt đi.",
        "Ở phía Kyoto, Hiệu trưởng Gakuganji nhìn Itadori bằng ánh mắt của người nhìn một món đồ cần vứt bỏ.",
      ],
      choices: [
        { t: "Kể cho Itadori về âm mưu của phe Kyoto", go: "a3_plan", req: { flag: "knows_plot" }, eff: { rel: { itadori: 8 }, flag: "warned_yuji", ledger: { action: "Shen cảnh báo Itadori về lệnh ám sát của Kyoto", consequence: "Itadori có chuẩn bị" } } },
        { t: "Đến chỗ đội Tokyo bàn chiến thuật", go: "a3_plan" },
      ] },

    a3_plan: { chapter: "Arc 3", title: "Chiến thuật", env: "day/forest", cast: ["shen", "maki", "panda", "fushiguro"],
      text: [
        "Luật chơi: mỗi đội săn những chú linh cấp 2 được thả trong rừng. Đội nào trừ được con chú linh lớn nhất trước là thắng. Đánh nhau giữa học sinh không bị cấm, chỉ cần không giết người.",
        "> Kyoto sẽ không đi săn chú linh. Chúng sẽ đi săn Itadori, Maki nói. Itadori đi một mình làm mồi. Còn lại chia cặp.",
        "> Shen, cậu chọn đi.",
      ],
      choices: [
        { t: "Đi gần Itadori để yểm trợ", go: "a3_miwa", eff: { rel: { itadori: 4 }, flag: "near_yuji" } },
        { t: "Đi cùng Fushiguro và Inumaki", go: "a3_miwa", eff: { rel: { fushiguro: 4, inumaki: 4 } } },
        { t: "Đi săn chú linh một mình để ghi điểm", go: "a3_miwa", eff: { rep: { tokyo: 2 }, trace: { xungkich: 1 } } },
      ] },

    a3_miwa: { chapter: "Arc 3", title: "Kiếm sĩ Tân Âm Lưu", env: "day/forest", cast: ["shen", "miwa"],
      text: [
        "Giữa rừng, một cô gái tóc xanh nhạt chặn đường Shen, tay đặt lên chuôi kiếm. Miwa Kasumi, năm hai Kyoto.",
        "> Xin lỗi nhé! Tôi được lệnh cầm chân tất cả mọi người của Tokyo. Tôi không ghét cậu đâu, thật đấy!",
        "Cô cúi đầu chào thật lễ phép. Rồi rút kiếm nhanh tới mức Shen chỉ kịp thấy ánh thép lóe lên.",
      ],
      observe: ["miwa"],
      choices: [{ t: "Đấu", go: "a3_miwa_fight" }] },

    a3_miwa_fight: { chapter: "Arc 3", title: "Miwa Kasumi", env: "day/forest",
      text: ["Miwa thu kiếm vào vỏ, hạ thấp người. Trong phạm vi lưỡi kiếm của cô, mọi thứ bước vào đều bị chém."],
      combat: { enemies: ["miwa"], win: "a3_miwa_win", lose: "a3_miwa_lose", canFlee: false } },

    a3_miwa_win: { chapter: "Arc 3", title: "Lời chào", env: "day/forest", cast: ["shen", "miwa"],
      onEnter: { rep: { kyoto: 3, tokyo: 3 } },
      text: ["Miwa ngồi phịch xuống đất, thanh kiếm văng ra xa.", "> Á, thua rồi... Cậu mạnh thật đấy. Lần sau gặp ở chỗ khác, mình đi ăn kem nhé?", "Cô cúi chào lần nữa, rất nghiêm túc."],
      choices: [{ t: "Tiếp tục", go: "a3_veil" }] },

    a3_miwa_lose: { chapter: "Arc 3", title: "Phạm vi", env: "day/forest", cast: ["shen", "miwa"],
      onEnter: { heal: 120 },
      text: ["Lưỡi kiếm sống đập vào gáy Shen. Thế giới tối sầm vài giây.", "> Xin lỗi! Xin lỗi! Tôi đã dùng sống kiếm rồi đó!", "Khi Shen tỉnh lại, Miwa đã chạy đi. Cô để lại một miếng băng dán cá nhân trên trán cậu."],
      choices: [{ t: "Tiếp tục", go: "a3_veil" }] },

    a3_veil: { chapter: "Arc 3", title: "Tấm màn đen", env: "dusk/forest", cast: ["shen", "fushiguro", "inumaki", "hanami"],
      text: [
        "Bầu trời tối sầm giữa buổi chiều. Một tấm màn đen sập xuống, trùm kín cả khu rừng. Không phải màn của học viện.",
        "Từ giữa những gốc cây, một sinh vật bước ra. Thân hình người cao lớn, đầu không có miệng, hai hốc mắt mọc ra những cành cây non. Tiếng nói của nó vang lên thẳng trong đầu, nghe như lời người nói ngược.",
        "[CẢNH BÁO: Chú linh đặc cấp. Chênh lệch sức mạnh vượt ngưỡng. Khuyến nghị: không giao chiến trực diện.]",
        "Dưới chân nó, những nụ hoa nhú lên khỏi mặt đất rồi nở ra thành những chú linh nhỏ.",
        "> Inumaki, Shen! Lo đám nhỏ, Fushiguro hét. Đừng lại gần cái thứ kia!",
      ],
      observe: ["hanami"],
      choices: [
        { t: "Cầm chân lũ chú linh nụ hoa", go: "a3_hoa_fight", eff: { trace: { baove: 1 } } },
        { t: "Đưa học sinh Kyoto bị thương ra khỏi vùng nguy hiểm trước", go: "a3_hoa_fight", eff: { moral: 3, rep: { kyoto: 6 }, trace: { baove: 2 } } },
      ] },

    a3_hoa_fight: { chapter: "Arc 3", title: "Chú linh nụ hoa", env: "dusk/forest",
      text: ["Một chú linh nụ hoa vươn rễ lên khỏi mặt đất, cuộn về phía Shen."],
      combat: { enemies: ["c_hoa"], win: "a3_blackflash", lose: "a3_hoa_lose", canFlee: false } },

    a3_hoa_lose: { chapter: "Arc 3", title: "Panda", env: "dusk/forest", cast: ["shen", "panda"],
      onEnter: { heal: 150 },
      text: ["Rễ cây siết lấy cổ chân Shen. Một bàn tay lông lá túm cổ áo cậu kéo ngược ra.", "> Lần sau gọi tôi sớm hơn nhé, Panda nói, rồi đấm chú linh nụ hoa văng xa."],
      choices: [{ t: "Tiếp tục", go: "a3_blackflash" }] },

    a3_blackflash: { chapter: "Arc 3", title: "Hắc Thiểm", env: "dusk/forest", cast: ["shen", "itadori", "todo", "hanami"],
      onEnter: { achievement: "a_blackflash", exp: 2000 },
      text: [
        "Ở bãi đất trống phía trước, Itadori và Todo đứng sát vai nhau, đối mặt với chú linh đặc cấp.",
        "Todo vỗ tay. Vị trí của cậu ta và Itadori đổi chỗ cho nhau trong chớp mắt. Chú linh vung tay đánh vào khoảng không.",
        "Rồi Itadori đấm.",
        "Không gian quanh nắm đấm của cậu ta méo đi. Một tia chớp đen lóe lên, và chú linh đặc cấp lùi lại ba bước, cành cây trên mắt nó gãy rụng.",
        "[Hệ thống: Ghi nhận hiện tượng Hắc Thiểm. Chú lực chạm mục tiêu trong vòng 0,000001 giây sau đòn đánh, uy lực tăng theo cấp số. Không thể cố ý tạo ra. Ký chủ đã được quan sát tận mắt.]",
      ],
      choices: [
        { t: "Dồn toàn bộ chú lực vào một đòn yểm trợ", go: "a3_gojo_end", req: { technique: true }, eff: { exp: 1500, rel: { itadori: 5, todo: 8 }, trace: { xungkich: 1 } } },
        { t: "Quan sát thật kỹ dòng chú lực của hai người", go: "a3_gojo_end", eff: { base: { WIS: 1 }, flag: "saw_bf", trace: { quansat: 2 }, known: "hac_thiem" } },
      ] },

    a3_gojo_end: { chapter: "Arc 3", title: "Kẻ mạnh nhất tới nơi", env: "night/forest", cast: ["shen", "gojo"],
      onEnter: { exp: 3000, sp: 60, ledger: { action: "Chú linh đặc cấp đột kích Giao lưu Kyoto", witnesses: "Toàn bộ học sinh hai trường", consequence: "Kho chú vật của học viện bị đột nhập trong lúc hỗn loạn", trigger: "Các chú vật bị đánh cắp sẽ xuất hiện trở lại" } },
      text: [
        "Tấm màn đen vỡ tan như kính. Gojo bước vào, tay vẫn đút túi quần.",
        "Anh ta nhìn chú linh đặc cấp đang bỏ chạy, giơ một ngón tay lên. Nửa khu rừng biến mất trong một luồng sáng tím. Chú linh thoát được, nhưng chỉ còn nửa thân.",
        "Sau đó người ta mới phát hiện: trong lúc cả học viện tập trung vào khu rừng, kho chú vật đã bị đột nhập. Vài món đồ cổ biến mất.",
        "Gojo nhìn về phía kho, lần đầu tiên trong ngày không cười.",
      ],
      choices: [{ t: "Tiếp tục", go: "a3_baseball" }] },

    a3_baseball: { chapter: "Arc 3", title: "Ngày thứ hai: bóng chày", env: "day/temple", cast: ["shen", "itadori", "todo", "maki"],
      onEnter: { heal: "full" },
      text: [
        "Ngày thứ hai của Giao lưu lẽ ra là đấu cá nhân. Gojo tuyên bố đổi thành bóng chày. Không ai hiểu vì sao. Không ai dám cãi.",
        "Tới lượt Shen lên đánh. Người ném bóng là Todo. Cậu ta nhìn Shen, nhếch mép.",
      ],
      choices: [
        { t: "Vung gậy hết sức", go: "a3_after", req: { STR: 20 }, eff: { exp: 1200, achievement: "a_mvp", rel: { todo: 6, itadori: 4 } } },
        { t: "Bunt nhẹ rồi chạy hết tốc lực", go: "a3_after", req: { AGI: 18 }, eff: { exp: 1200, rel: { maki: 6 } } },
        { t: "Đánh an toàn", go: "a3_after", eff: { exp: 600 } },
      ] },

    a3_after: { chapter: "Arc 3", title: "Kết thúc Giao lưu", env: "dusk/temple", cast: ["shen", "itadori", "todo"],
      onEnter: { quest: { id: "q_kyoto", status: "done" }, exp: 2000, rep: { kyoto: 3 } },
      text: [
        "Tokyo thắng trận bóng chày. Không ai nhớ ai thắng phần săn chú linh.",
        "Lúc chia tay, Todo ôm chầm lấy Itadori, gọi cậu ta là \"bạn thân\" trước mặt hai trường. Itadori không hiểu chuyện gì nhưng vẫn ôm lại.",
        "Itadori trở lại trường như một học sinh bình thường. Lần này không phải trốn nữa.",
      ],
      choices: [{ t: "Tiếp tục", go: "a3_hub2" }] },

    a3_hub2: { chapter: "Arc 3 · Thời gian tự do", title: "Sau Giao lưu", env: "day/temple", cast: ["shen", "itadori", "fushiguro", "kugisaki"],
      text: ["Năm nhất lại đủ bốn người. Kugisaki vẫn chưa tha cho Itadori vụ giả chết."],
      hub: "a3_hub2", go: "a3_trial_brief" },

    a3_trial_brief: { chapter: "Arc 3", title: "Sát hạch Cấp 2", env: "indoor/dojo", cast: ["shen", "nanami", "yaga", "c_cap2_trial"],
      onEnter: { quest: { id: "q_trialC", status: "active" }, heal: "full" },
      text: [
        "Hiệu trưởng Yaga đề cử Shen sát hạch lên Cấp 2. Người giám sát là Nanami.",
        "> Tôi đã đọc báo cáo, Nanami nói. Chú linh này giết hai chú thuật sư Cấp 3 trước khi bị phong ấn. Nếu cậu thấy không ổn, rút lui là quyết định của người lớn.",
        "[Hệ thống: Đột phá Rank C cần Lv 20 và hoàn thành sát hạch.]",
      ],
      observe: ["c_cap2_trial"],
      choices: [{ t: "Bước vào", go: "a3_trial" }] },

    a3_trial: { chapter: "Arc 3", title: "Chú linh sát hạch Cấp 2", env: "indoor/dojo",
      text: ["Phong ấn mở. Hàng trăm cánh tay gầy guộc tràn ra từ lồng giam."],
      combat: { enemies: ["c_cap2_trial"], win: "a3_trial_win", lose: "a3_trial_lose", canFlee: false } },

    a3_trial_lose: { chapter: "Arc 3", title: "Rút lui", env: "indoor/dojo", cast: ["shen", "nanami"],
      onEveryEnter: { heal: "full" },
      text: ["Nanami chém đứt những cánh tay đang siết lấy Shen, rồi phong ấn chú linh trở lại.", "> Rút lui đúng lúc cũng là một kỹ năng. Nghỉ đi, rồi thử lại."],
      choices: [{ t: "Thử lại", go: "a3_trial" }] },

    a3_trial_win: { chapter: "Arc 3", title: "Cấp 2", env: "indoor/dojo", cast: ["shen", "nanami"],
      onEnter: { flag: "trial_C", quest: { id: "q_trialC", status: "done" }, exp: 1000, rel: { nanami: 6 } },
      text: ["Cánh tay cuối cùng tan biến. Nanami nhìn đồng hồ.", "> Bốn giờ năm mươi tám phút. Kịp giờ tan làm. Làm tốt lắm.", "[Hệ thống: Đã hoàn thành sát hạch Rank C.]"],
      special: "rankup", go: "a3_end" },

    a3_end: { chapter: "Hết Arc 3", title: "Những món đồ bị đánh cắp", env: "night/temple", cast: ["shen", "gojo"],
      text: [
        "Đêm đó, Gojo gọi riêng Shen ra mái chùa.",
        "> Thứ bị đánh cắp khỏi kho là ba chú vật rất cũ. Chúng được gọi là Cửu tướng Chú thai. Chúng không chết. Chúng chỉ đang ngủ.",
        "> Và kẻ đánh cắp biết chính xác chúng nằm ở đâu.",
      ],
      choices: [{ t: "Bắt đầu Arc 4: Cửu tướng Chú thai", go: "a4_start" }] },
  });
})(typeof window !== "undefined" ? window : globalThis);
