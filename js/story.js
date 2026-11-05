/* =====================================================================
   CURSED DESTINY — CỐT TRUYỆN: MỞ ĐẦU & ARC 1
   Dòng bắt đầu bằng ">" là lời thoại, "[" là thông báo Hệ thống.
   trace = dấu vết ẩn quyết định thuật thức (người chơi không thấy).
   ===================================================================== */
(function (G) {
  const CD = (G.CD = G.CD || {});
  CD.SCENES = {
    /* ======================= MỞ ĐẦU ======================= */
    p_intro: { chapter: "Mở đầu · Tủ đồ số 44", title: "Một buổi tối bình thường",
      text: [
        "Shen mười lăm tuổi, học năm nhất trường trung học Kōsen ở ngoại ô Tokyo. Cậu không giỏi nhất lớp, cũng chẳng kém nhất. Kiểu người mà thầy cô phải nhìn danh sách mới nhớ ra tên.",
        "Tối nay đến lượt cậu trực nhật. Gần bảy giờ, cả dãy hành lang chỉ còn tiếng quạt trần quay lạch cạch và ánh đèn huỳnh quang chập chờn.",
        "Cậu vừa cúi xuống nhặt cây chổi thì một cơn đau nhói xuyên qua thái dương, như có ai cắm một sợi dây điện thẳng vào não.",
        "Trước mắt Shen, không khí khẽ gợn lên. Rồi một khung chữ màu xanh lam hiện ra giữa phòng học trống.",
      ],
      choices: [{ t: "Nhìn kỹ khung chữ", go: "p_system" }] },

    p_system: { chapter: "Mở đầu", title: "Hệ thống",
      onEnter: { flag: "system", achievement: "a_system", skill: "sk_cefist" },
      text: [
        "[HỆ THỐNG CHÚ VẬN — KÍCH HOẠT THÀNH CÔNG]",
        "[Ký chủ: Shen · 15 tuổi · Phát hiện chú lực tiềm ẩn chưa khai mở.]",
        "[Cảnh báo: thế giới này tồn tại Chú linh. Ký chủ hiện đã có thể nhìn thấy chúng.]",
        "Shen dụi mắt. Khung chữ vẫn ở đó, lơ lửng, không phản chiếu trên mặt bàn hay cửa kính. Cậu thử giơ tay xuyên qua nó. Không có cảm giác gì.",
        "[Hệ thống sẽ ghi nhận mọi hành động của Ký chủ. Sức mạnh không được trao, sức mạnh được hình thành.]",
        "[Kỹ năng khởi đầu: Quyền gia cố chú lực.]",
        "[Vui lòng chọn 2 Đặc tính cá nhân. Lựa chọn không thể thay đổi.]",
      ],
      special: "traits", go: "p_locker" },

    p_locker: { chapter: "Mở đầu", title: "Tiếng gõ trong tủ đồ",
      text: [
        "Khung chữ vừa tắt thì có tiếng gõ.",
        "Đều đặn, chậm rãi, phát ra từ chiếc tủ đồ số 44 cuối lớp, cái tủ mà cả trường đồn là không ai dám mở từ ba năm trước.",
        "Từ khe cửa rỉ ra một vệt khói đen đặc như mực. Nó không lan ra ngẫu nhiên mà đang bò thẳng về phía chân cậu.",
        "[Phát hiện Chú linh. Mức nguy hiểm: thấp. Ký chủ có thể Quan sát trong chiến đấu.]",
      ],
      choices: [
        { t: "Mở toang cửa tủ", go: "p_open", eff: { trace: { xungkich: 1, haptu: 1 } } },
        { t: "Lùi lại, quan sát thật kỹ", go: "p_observe", eff: { trace: { quansat: 2 } } },
        { t: "Chạy xuống phòng bảo vệ, bác Sato vẫn còn ở đó", go: "p_guard", eff: { trace: { baove: 2 } } },
      ] },

    p_open: { chapter: "Mở đầu", title: "Thứ bên trong",
      text: [
        "Cánh tủ bật tung. Bên trong trống trơn, chỉ có một con mắt to bằng nắm tay, đỏ ngầu, dán chặt vào vách tôn.",
        "Con mắt chớp một lần. Cả căn phòng lạnh đi như giữa mùa đông.",
        "Lòng bàn tay Shen nóng rực. Cậu cảm thấy một thứ gì đó đang chảy trong người mình, đặc và nặng như chì nóng chảy.",
      ],
      choices: [
        { t: "Đấm thẳng vào con mắt", go: "p_fight", eff: { trace: { xungkich: 2 } } },
        { t: "Chạm vào làn khói, thử cảm nhận nó", go: "p_touch", eff: { trace: { haptu: 2 } } },
        { t: "Đóng sầm cửa tủ lại", go: "p_observe", eff: { trace: { phongan: 1 } } },
      ] },

    p_touch: { chapter: "Mở đầu", title: "Vị của nỗi sợ",
      text: [
        "Đầu ngón tay Shen chạm vào làn khói. Nó lạnh, dính, và mang theo một cảm giác rất quen: nỗi sợ của hàng trăm học sinh từng đi ngang chiếc tủ này.",
        "Một luồng nhỏ của làn khói trôi vào da cậu rồi biến mất.",
        "[Phát hiện: chú lực ngoại lai bị hấp thu ở mức vi lượng. Hiện tượng chưa có trong cơ sở dữ liệu.]",
        "Con mắt trong tủ rít lên. Nó không thích bị nếm.",
      ],
      choices: [{ t: "Chiến đấu", go: "p_fight" }] },

    p_observe: { chapter: "Mở đầu", title: "Nhìn thấy điều không nên thấy",
      text: [
        "Shen nheo mắt. Làn khói không lan ra lung tung mà đi men theo bóng tối dưới gầm bàn ghế, tránh hẳn những chỗ có ánh đèn.",
        "Cậu còn để ý một thứ khác: dưới đáy tủ có dán một mảnh giấy cũ, chữ viết tay đã nhòe. Một lá bùa.",
        "Lá bùa đang bong ra từng góc một.",
      ],
      choices: [
        { t: "Bật toàn bộ đèn trong lớp", go: "p_light", eff: { trace: { anhsang: 2 }, flag: "biet_anh_sang" } },
        { t: "Ấn lá bùa dán trở lại", go: "p_talisman", req: { WIS: 7 }, eff: { trace: { phongan: 2 } } },
        { t: "Đứng chắn trước cửa lớp, không để nó ra hành lang", go: "p_fight", eff: { trace: { baove: 1 } } },
      ] },

    p_light: { chapter: "Mở đầu", title: "Ánh sáng",
      text: [
        "Shen gạt cả dãy công tắc. Đèn huỳnh quang bật lên từng hàng một.",
        "Làn khói co rúm lại, rít lên như nước đổ vào chảo dầu nóng. Nó teo đi gần một phần ba.",
        "Nó yếu đi rõ rệt. Nhưng nó vẫn còn đó, và giờ thì nó đã nổi giận.",
      ],
      choices: [{ t: "Chiến đấu", go: "p_fight" }] },

    p_talisman: { chapter: "Mở đầu", title: "Lá bùa",
      onEnter: { item: "bua_chay" },
      text: [
        "Ngón tay Shen ấn lá bùa xuống. Một luồng điện chạy dọc cánh tay, nóng như kim loại nung.",
        "Lá bùa sáng lên. Không phải vì nó mạnh, mà vì cậu vừa truyền vào nó một thứ gì đó từ chính mình.",
        "> Mày... thấy được tao à?",
        "Giọng nói vang lên từ trong tủ. Lá bùa cháy mất một nửa. Shen theo phản xạ nhét nửa còn lại vào túi áo.",
      ],
      choices: [{ t: "Chiến đấu", go: "p_fight" }] },

    p_guard: { chapter: "Mở đầu", title: "Phòng bảo vệ",
      text: [
        "Shen lao xuống cầu thang. Bác Sato đang ngủ gục trên bàn, chiếc radio vẫn rè rè phát bản tin thời tiết.",
        "Sau lưng cậu, tiếng gõ biến thành tiếng cào. Làn khói đã tràn xuống cầu thang và đang ngưng lại thành một hình người không có mặt.",
        "Nó không nhìn Shen. Nó đang nhìn ông già đang ngủ.",
      ],
      choices: [{ t: "Đứng chắn giữa nó và bác Sato", go: "p_fight", eff: { trace: { baove: 2 }, moral: 3, flag: "bao_ve_sato" } }] },

    p_fight: { chapter: "Trận đầu", title: "Chú linh tủ đồ số 44",
      text: ["Khói đen tụ lại thành một cái miệng đầy răng. Không còn đường lùi nữa."],
      combat: { enemies: ["c_tu44"], win: "p_win", lose: "p_lose", canFlee: false, weakenFlag: "biet_anh_sang" } },

    p_win: { chapter: "Trận đầu", title: "Khói tan",
      onEnter: { exp: 200, achievement: "a_firstkill", quest: { id: "q_tu44", status: "done" }, ledger: { action: "Shen tiêu diệt chú linh tủ đồ số 44", witnesses: "Không rõ", consequence: "Chú lực của Shen bị một người lạ cảm nhận được" } },
      text: [
        "Cú đấm cuối cùng xuyên qua lớp khói. Con mắt vỡ ra như một quả bóng nước, bắn tung những giọt mực đen lên trần nhà rồi bốc hơi.",
        "Căn phòng ấm trở lại. Tiếng quạt trần lại quay lạch cạch như chưa có chuyện gì xảy ra.",
        "[Nhiệm vụ hoàn thành: Đêm ở trường Kōsen.]",
        "Shen ngồi bệt xuống sàn, hai tay run lẩy bẩy. Rồi cậu nghe thấy tiếng vỗ tay.",
      ],
      choices: [{ t: "Ngẩng đầu lên", go: "p_gojo" }] },

    p_lose: { chapter: "Trận đầu", title: "Bóng tối",
      onEnter: { exp: 200, quest: { id: "q_tu44", status: "done" }, heal: 60 },
      text: [
        "Shen ngã xuống. Thế giới mờ dần.",
        "Trước khi mất ý thức, cậu thấy một vệt sáng xanh xé đôi chú linh, như thể nó chưa từng tồn tại.",
        "> Ồ. Vẫn còn sống à. Nhóc này có chút thú vị đấy.",
      ],
      choices: [{ t: "Tỉnh dậy", go: "p_gojo" }] },

    p_gojo: { chapter: "Kết mở đầu", title: "Người đàn ông bịt mắt",
      text: [
        "Đứng ở cửa lớp là một người đàn ông rất cao, tóc trắng, mắt bịt băng đen, hai tay đút túi như vừa đi dạo ngang qua.",
        "> Chú linh cấp bốn thôi. Nhưng nhóc nhìn thấy nó, chạm được vào nó, và còn đánh nó bằng chú lực. Người thường không làm được vậy đâu.",
        "[Cảnh báo: phát hiện cá thể có chú lực vượt ngưỡng phân tích.]",
      ],
      observe: ["gojo"],
      choices: [
        { t: "Hỏi: \"Anh là ai?\"", go: "p_offer", eff: { trace: { quansat: 1 }, rel: { gojo: 3 } } },
        { t: "Thủ thế, không rời mắt khỏi anh ta", go: "p_offer", eff: { trace: { baove: 1 }, rel: { gojo: 1 } } },
      ] },

    p_offer: { chapter: "Kết mở đầu", title: "Lời mời",
      text: [
        "> Gojo Satoru. Giáo viên. Đẹp trai. Mạnh nhất. Thứ tự tùy nhóc chọn.",
        "> Có hai lựa chọn. Một là quên hết chuyện tối nay, sống tiếp như một học sinh bình thường cho tới ngày một con chú linh khác tìm tới nhóc. Hai là theo tôi tới Cao đẳng Chú thuật Tokyo.",
        "Anh ta nghiêng đầu, như thể nhìn xuyên qua lớp băng bịt mắt.",
        "> Còn cái thứ đang lơ lửng trong đầu nhóc thì... tôi chưa thấy bao giờ. Thú vị thật.",
        "Shen cứng người. Anh ta thấy được Hệ thống?",
        "[Hệ thống: Không xác định được cá thể này có quan sát được Hệ thống hay không.]",
      ],
      choices: [
        { t: "Đi theo anh ta", go: "p_enroll", eff: { rel: { gojo: 5 } } },
        { t: "Hỏi: \"Tại sao lại là tôi?\"", go: "p_why", eff: { trace: { quansat: 1 } } },
      ] },

    p_why: { chapter: "Kết mở đầu", title: "Câu hỏi đúng",
      text: [
        "> Câu hỏi hay. Vì chú lực của nhóc không giống ai cả, và tôi muốn biết nó là gì.",
        "> Với lại, nếu không ai dạy nhóc dùng nó, sớm muộn gì nó cũng sẽ dùng nhóc.",
      ],
      choices: [{ t: "Đồng ý", go: "p_enroll", eff: { rel: { gojo: 5 } } }] },

    p_enroll: { chapter: "Hết phần mở đầu", title: "Cổng trường lần cuối",
      onEnter: { exp: 0, arc: "arc1", time: { days: 2, label: "Tháng 6, 2018" }, ledger: { action: "Shen nhận lời nhập học Cao đẳng Chú thuật Tokyo", consequence: "Gojo bắt đầu để mắt tới Hệ thống" } },
      text: [
        "Shen bước ra khỏi cổng trường Kōsen lần cuối với tư cách một học sinh bình thường.",
        "[Arc mới mở khóa: Thai nhi Chú vật.]",
      ],
      choices: [{ t: "Bắt đầu Arc 1", go: "a1_school" }] },

    /* ======================= ARC 1: THAI NHI CHÚ VẬT ======================= */
    a1_school: { chapter: "Arc 1 · Thai nhi Chú vật", title: "Ngôi trường trên núi",
      text: [
        "Cao đẳng Chú thuật Tokyo nằm giữa rừng, trông giống một ngôi chùa cổ hơn là một ngôi trường. Hai ngày sau buổi tối ở Kōsen, Shen đứng trước văn phòng hiệu trưởng.",
        "Hiệu trưởng Yaga Masamichi là một người đàn ông vạm vỡ, đeo kính râm, đang ngồi khâu một con thú bông hình gấu.",
        "> Trước khi nhập học, ta có một câu hỏi. Vì sao cậu muốn trở thành chú thuật sư?",
        "Con gấu bông trong tay ông ta khẽ cựa quậy.",
      ],
      choices: [
        { t: "\"Để không ai phải gặp chuyện như tối hôm đó.\"", go: "a1_school2", eff: { moral: 4, trace: { baove: 1 }, rel: { yaga: 5 } } },
        { t: "\"Vì tôi muốn biết thứ đang xảy ra với mình là gì.\"", go: "a1_school2", eff: { trace: { quansat: 1 }, rel: { yaga: 3 } } },
        { t: "\"Vì tôi muốn mạnh hơn. Chỉ vậy thôi.\"", go: "a1_school2", eff: { anti: 3, trace: { haptu: 1 }, rel: { yaga: 1 } } },
      ] },

    a1_school2: { chapter: "Arc 1", title: "Chú hài",
      onEnter: { exp: 300, item: "dongphuc" },
      text: [
        "Con gấu bông nhảy khỏi tay Yaga, lao thẳng vào mặt Shen. Cậu kịp đỡ, cú đấm bé xíu nhưng nặng như búa tạ.",
        "> Câu trả lời thật lòng. Thế là đủ.",
        "Yaga đặt lên bàn một bộ đồng phục đen, cổ cao.",
        "> Chào mừng tới Cao đẳng Chú thuật. Đừng chết sớm.",
      ],
      choices: [{ t: "Ra sân gặp các bạn cùng khóa", go: "a1_meet" }] },

    a1_meet: { chapter: "Arc 1", title: "Năm nhất",
      onEnter: { rel: { itadori: 5, fushiguro: 2 } },
      text: [
        "Trên bậc thềm có hai người đang ngồi. Một cậu tóc hồng, cười toe toét, đang cố cân một quả bóng chuyền trên ngón tay. Một cậu tóc đen dựng đứng, nhìn Shen như nhìn một chiếc xe buýt đến trễ.",
        "> Ê, học sinh mới hả? Tớ là Itadori Yuji! Còn cái người mặt khó đăm đăm kia là Fushiguro.",
        "> ...Fushiguro Megumi.",
        "[Hệ thống: có thể Quan sát cá thể trong tầm mắt.]",
      ],
      observe: ["itadori", "fushiguro"],
      choices: [{ t: "Giới thiệu bản thân", go: "a1_hub1" }] },

    a1_hub1: { chapter: "Arc 1 · Thời gian tự do", title: "Tuần đầu ở học viện", env: "day/temple", cast: ["shen"],
      text: ["Itadori kéo Shen đi tham quan khắp trường trong khi Fushiguro đi phía sau, thở dài liên tục.", "[Hệ thống: Mở khóa Thời gian tự do. Mỗi ngày có ba buổi: Sáng, Chiều, Tối. Mỗi hoạt động tốn một buổi.]"],
      hub: "a1_hub1", go: "a1_nobara" },

    a1_nobara: { chapter: "Arc 1", title: "Người thứ tư",
      onEnter: { item: { id: "keo_gojo", qty: 2 }, rel: { kugisaki: 3 } },
      text: [
        "Gojo dẫn cả nhóm ra ga Harajuku đón thành viên năm nhất cuối cùng. Cô gái tên Kugisaki Nobara, từ quê lên, vừa xuống tàu đã đòi đi Roppongi.",
        "> Bốn người năm nhất à? Năm nay đông nhỉ. Mà cậu kia, sao trông như vừa thấy ma vậy?",
        "> Cậu ấy thấy thật mà! Itadori nói vô tư.",
        "Gojo phát cho mỗi người một viên kẹo, rồi tuyên bố buổi tham quan Tokyo sẽ bắt đầu bằng một tòa nhà bỏ hoang.",
      ],
      observe: ["kugisaki"],
      choices: [{ t: "Tới Roppongi", go: "a1_roppongi", eff: { quest: { id: "q_roppongi", status: "active" } } }] },

    a1_roppongi: { chapter: "Arc 1", title: "Tòa nhà bỏ hoang",
      text: [
        "Ijichi Kiyotaka, người phụ tá gầy gò của học viện, dựng một tấm \"màn\" đen phủ kín tòa nhà. Gojo chia nhóm: Itadori và Kugisaki đi tầng dưới, còn Shen phụ trách cầu thang thoát hiểm phía sau.",
        "> Coi như bài kiểm tra nhỏ. Nguy hiểm quá thì hét lên nhé, Gojo cười.",
        "Cầu thang tối om, ẩm mốc. Đến tầng ba, có tiếng sột soạt phát ra cùng lúc từ trên đầu và từ ống thông gió bên cạnh.",
      ],
      choices: [{ t: "Chiến đấu", go: "a1_rpg_fight" }] },

    a1_rpg_fight: { chapter: "Arc 1", title: "Hai chú linh cấp 4",
      text: ["Hai con chú linh lao ra cùng lúc, một từ trên cao, một từ ống thông gió."],
      combat: { enemies: ["c_cap4a", "c_cap4b"], win: "a1_child", lose: "a1_rpg_lose", canFlee: false } },

    a1_rpg_lose: { chapter: "Arc 1", title: "Cú đá xuyên tường",
      onEnter: { exp: 100, heal: 80, rel: { itadori: 6 } },
      text: [
        "Shen bị hất văng vào tường. Đúng lúc đó, bức tường phía đối diện nổ tung: Itadori lao qua, đá văng cả hai con chú linh như đá quả bóng.",
        "> Có sao không? Cầu thang này nguy hiểm thật đấy!",
        "Shen lau máu ở khóe miệng. Khoảng cách giữa cậu và Itadori lớn hơn cậu tưởng nhiều.",
      ],
      choices: [{ t: "Lên tầng bốn", go: "a1_child" }] },

    a1_child: { chapter: "Arc 1", title: "Đứa trẻ trên tầng bốn",
      onEnter: { quest: { id: "q_child", status: "active" } },
      text: [
        "Tầng bốn. Một con chú linh hình bù nhìn, tay làm bằng gỗ mục, đang giữ một cậu bé chừng tám tuổi trước ngực như giữ một tấm khiên.",
        "Cậu bé không khóc, chỉ run. Đôi mắt nhìn thẳng vào Shen như cầu cứu.",
        "Ở cuối hành lang, Kugisaki vừa chạy tới, tay cầm búa.",
      ],
      observe: ["c_cap3_rpg"],
      choices: [
        { t: "Tấn công ngay, không để nó kịp làm gì", go: "a1_child_fight", eff: { trace: { xungkich: 2 }, flag: "child_hurt", moral: -3 } },
        { t: "Lao vòng qua, giật đứa bé ra trước", go: "a1_child_fight", req: { AGI: 7 }, eff: { trace: { baove: 2 }, flag: "child_safe", moral: 4, rep: { danthuong: 5 } } },
        { t: "Ra hiệu cho Kugisaki: cô ghim nó, tôi kéo đứa bé", go: "a1_child_fight", eff: { trace: { lienket: 2 }, flag: ["child_safe", "nobara_help"], moral: 3, rel: { kugisaki: 8 } } },
      ] },

    a1_child_fight: { chapter: "Arc 1", title: "Chú linh bù nhìn",
      text: ["Chú linh bù nhìn ném đứa bé sang một bên rồi quay mũi giáo gỗ về phía Shen."],
      combat: { enemies: ["c_cap3_rpg"], win: "a1_child_win", lose: "a1_child_lose", canFlee: false, weakenFlag: "nobara_help" } },

    a1_child_win: { chapter: "Arc 1", title: "Bàn tay không buông",
      onEnter: { item: "bang_tay", quest: [{ id: "q_roppongi", status: "done" }] },
      conds: [
        { req: { flag: "child_safe" }, eff: { exp: 600, quest: { id: "q_child", status: "done" }, achievement: "a_child", ledger: { action: "Shen cứu đứa trẻ ở Roppongi", witnesses: "Kugisaki, đứa trẻ", consequence: "Đứa trẻ nhớ mặt Shen" } } },
        { req: { flag: "child_hurt" }, eff: { exp: 200, quest: { id: "q_child", status: "failed" }, ledger: { action: "Đứa trẻ ở Roppongi bị thương khi Shen tấn công vội", witnesses: "Kugisaki", consequence: "Kugisaki nhìn Shen khác đi" }, rel: { kugisaki: -5 } } },
      ],
      text: [
        "Chú linh bù nhìn đổ sụp thành một đống gỗ mục rồi tan vào không khí.",
        "Kugisaki bế cậu bé lên, kiểm tra từng vết xước trên tay.",
        "> Không sao rồi. Chị đưa em về.",
        "Ngoài cửa sổ, Gojo vẫy tay từ tầng thượng tòa nhà đối diện như đang xem một trận bóng đá.",
      ],
      choices: [{ t: "Trở về trường", go: "a1_debrief" }] },

    a1_child_lose: { chapter: "Arc 1", title: "Cây đinh",
      onEnter: { exp: 150, heal: 80, quest: [{ id: "q_roppongi", status: "done" }, { id: "q_child", status: "failed" }], rel: { kugisaki: 4 } },
      text: [
        "Shen gục xuống. Một cây đinh rít qua tai cậu, cắm thẳng vào đầu chú linh.",
        "> Sô Linh Chú Pháp... Trâm!",
        "Chú linh nổ tung. Kugisaki đứng đó, thở hổn hển, cây búa vẫn giơ lên.",
        "> Lần sau đợi tôi tới rồi hẵng liều, nghe chưa?",
      ],
      choices: [{ t: "Trở về trường", go: "a1_debrief" }] },

    a1_debrief: { chapter: "Arc 1", title: "Buổi rút kinh nghiệm", env: "dusk/temple", cast: ["shen", "gojo", "itadori", "kugisaki"],
      onEnter: { sp: 30, exp: 200 },
      text: [
        "Gojo mua kem cho cả nhóm, rồi ngồi giữa sân trường chấm điểm từng người như chấm bài kiểm tra.",
        "> Itadori: mười điểm sức mạnh, hai điểm suy nghĩ. Kugisaki: tám điểm, trừ hai vì mắng tôi. Shen...",
        "Anh ta nghiêng đầu.",
        "> Nhóc học nhanh hơn tôi nghĩ. Nhưng nhóc nhìn mọi thứ như đang đọc chỉ số. Đôi khi phải nhìn bằng mắt thôi.",
        "[Hệ thống: Hoàn thành nhiệm vụ đầu tiên. Thưởng 30 Điểm Hệ thống. Cửa hàng Hệ thống đã mở.]",
      ],
      choices: [{ t: "Bắt đầu tuần nghỉ", go: "a1_hub2" }] },

    a1_hub2: { chapter: "Arc 1 · Thời gian tự do", title: "Một tuần ở học viện", env: "day/temple", cast: ["shen", "ijichi"],
      onEnter: { quest: { id: "q_patrol", status: "active" } },
      text: ["Ijichi đưa cho Shen hai tập hồ sơ mỏng: một nhà ga bỏ hoang ở Saitama, một bệnh viện bỏ hoang ở Chiba.", "> Không bắt buộc đâu. Nhưng làm xong thì có thù lao."],
      hub: "a1_hub2", go: "a1_eishu" },

    a1_eishu: { chapter: "Arc 1", title: "Trại giam Eishū",
      onEnter: { time: { days: 5, label: "Tháng 7, 2018" }, heal: "full", quest: { id: "q_eishu", status: "active" } },
      text: [
        "Tháng Bảy. Trời mưa. Một chú thai xuất hiện trong trại giam thanh thiếu niên Eishū, năm phạm nhân còn mắc kẹt bên trong.",
        "Ijichi đọc báo cáo với giọng run run:",
        "> Dự đoán chú thai sẽ nở thành chú linh đặc cấp. Thầy Gojo đang đi công tác. Các cậu chỉ cần xác nhận người sống sót, tuyệt đối không giao chiến.",
        "Bên trong, hành lang trại giam bị bóp méo thành một mê cung. Chỉ trong vài phút, Kugisaki biến mất, và con chó thức thần của Fushiguro bị xé làm đôi.",
        "Rồi nó xuất hiện ở cuối hành lang.",
      ],
      observe: ["c_womb"],
      choices: [
        { t: "Đứng lại cùng Itadori cầm chân nó", go: "a1_stay", eff: { trace: { baove: 2 }, moral: 3, flag: "stayed" } },
        { t: "Theo Fushiguro đi tìm Kugisaki", go: "a1_find", eff: { trace: { lienket: 2 }, moral: 2, flag: "found_nobara" } },
        { t: "Đấm nó", go: "a1_punch_womb", eff: { trace: { xungkich: 2, haptu: 1 } } },
        { t: "Chạy ra ngoài, gọi viện trợ", go: "a1_flee", eff: { moral: -3, flag: "fled_eishu" } },
      ] },

    a1_punch_womb: { chapter: "Arc 1", title: "Khoảng cách",
      onEnter: { hpSet: 1, flag: "stayed" },
      text: [
        "Shen dồn hết chú lực vào nắm đấm và lao tới.",
        "Cậu không nhìn thấy nó di chuyển. Chỉ biết một giây sau mình đã nằm trong bức tường, xương sườn kêu răng rắc.",
        "[CẢNH BÁO: CHÊNH LỆCH SỨC MẠNH VƯỢT NGƯỠNG. Xác suất sống sót nếu tiếp tục: 0%.]",
        "Itadori kéo cậu ra khỏi đống gạch.",
        "> Đừng làm chuyện ngốc nữa! Cậu ở sau tớ!",
      ],
      choices: [{ t: "Tiếp tục", go: "a1_stay" }] },

    a1_stay: { chapter: "Arc 1", title: "Vua Nguyền",
      onEnter: { achievement: "a_witness", rel: { itadori: 10 } },
      text: [
        "Itadori bảo Fushiguro đi tìm Kugisaki, rồi đứng chắn trước Shen. Cậu ta cầm cự được vài phút, rồi đến lúc không còn cầm cự nổi nữa.",
        "> Sukuna. Nếu tớ cho ông ra, ông phải trả lại cơ thể ngay khi tớ bảo.",
        "Những đường vân đen chạy dọc mặt Itadori. Không khí trong trại giam đông cứng lại.",
        "Kẻ vừa mở mắt không còn là Itadori nữa. Hắn liếc qua chú linh đặc cấp như liếc một con muỗi, và một giây sau, nó bị chặt thành từng mảnh.",
        "Rồi đôi mắt đỏ ấy quay sang Shen.",
        "> Hửm. Trong đầu ngươi có thứ gì đang kêu tích tắc. Thú vị đấy, nhóc con. Ta không ăn đồ chưa chín.",
        "[CẢNH BÁO: cá thể có khả năng cảm nhận Hệ thống. Khuyến nghị: không thu hút sự chú ý của cá thể này.]",
      ],
      observe: ["sukuna_a1"],
      choices: [{ t: "Đứng yên, không thở", go: "a1_heart", eff: { known: "sukuna_biet_he_thong", ledger: { action: "Sukuna nhận ra Hệ thống trong người Shen", witnesses: "Không ai khác", consequence: "Sukuna ghi nhớ Shen", trigger: "Có thể kích hoạt lại khi Sukuna lấy lại thêm ngón tay" } } }] },

    a1_find: { chapter: "Arc 1", title: "Tìm Kugisaki",
      onEnter: { rel: { kugisaki: 10, fushiguro: 6 } },
      text: [
        "Shen và Fushiguro lần theo vệt máu, tìm thấy Kugisaki đang bất tỉnh dưới một đống bê tông. Hai người khiêng cô ra ngoài trong khi mặt đất rung lên từng đợt.",
        "Rồi mọi rung chấn đột ngột dừng lại. Chú lực của chú linh đặc cấp biến mất trong tích tắc, như ngọn nến bị thổi tắt.",
        "Thứ chú lực thay thế nó khiến Shen buồn nôn.",
      ],
      choices: [{ t: "Quay lại", go: "a1_heart" }] },

    a1_flee: { chapter: "Arc 1", title: "Bên ngoài màn",
      onEnter: { rep: { tokyo: -4 }, ledger: { action: "Shen bỏ chạy khỏi trại giam Eishū", witnesses: "Ijichi", consequence: "Ijichi báo cáo lại cho học viện" } },
      text: [
        "Shen lao ra khỏi màn, thở dốc. Ijichi nhìn cậu, rồi nhìn vào bên trong.",
        "> Những người khác đâu?",
        "Cậu không trả lời được. Vài phút sau, một luồng chú lực khủng khiếp bùng lên bên trong, mạnh tới mức cả tấm màn rung lên như mặt nước.",
      ],
      choices: [{ t: "Quay lại", go: "a1_heart" }] },

    a1_heart: { chapter: "Arc 1", title: "Trái tim",
      onEnter: { exp: 1500, quest: { id: "q_eishu", status: "done" }, item: "manh_thai" },
      conds: [{ req: { flag: "stayed" }, eff: { exp: 500 } }],
      text: [
        "Ngoài sân trại giam, Sukuna đang đứng trước Fushiguro. Hắn móc trái tim của chính Itadori ra khỏi lồng ngực, cầm trên tay như một món đồ chơi, để Itadori không thể giành lại cơ thể.",
        "Fushiguro chiến đấu đến kiệt sức. Rồi, đột ngột, Sukuna bị đẩy lùi vào trong. Itadori đã quay lại.",
        "Nhưng không còn trái tim.",
        "> Fushiguro... Shen... sống lâu vào nhé.",
        "Itadori Yuji gục xuống trên nền xi măng ướt mưa.",
        "Trong đống đổ nát, Shen nhặt được một mảnh vỏ của chú thai vẫn còn ấm.",
      ],
      choices: [{ t: "...", go: "a1_morgue", eff: { known: "itadori_chet", ledger: { action: "Itadori Yuji tử vong tại Eishū", witnesses: "Shen, Fushiguro", consequence: "Năm nhất còn ba người" } } }] },

    a1_morgue: { chapter: "Arc 1", title: "Nhà xác",
      onEnter: { time: { days: 1 } },
      text: [
        "Gojo về tới học viện vào lúc nửa đêm. Anh ta không cười. Lần đầu tiên Shen thấy anh ta không cười.",
        "Ieiri Shoko kéo tấm vải trắng lên, châm một điếu thuốc ngay trong nhà xác.",
        "Ra tới hành lang, Gojo dừng lại, quay sang Shen.",
        "> Nhóc. Đi với tôi một lát. Có vài câu hỏi.",
      ],
      observe: ["ieiri"],
      choices: [{ t: "Đi theo", go: "a1_interview", eff: { quest: { id: "q_interview", status: "active" } } }] },

    a1_interview: { chapter: "Arc 1", title: "Câu hỏi của Gojo",
      text: [
        "Hai người ngồi trên bậc thềm ngôi chùa cũ phía sau trường. Gojo tháo băng bịt mắt. Đôi mắt xanh như soi thấu cả bầu trời.",
        "> Chú lực của nhóc như một bản vẽ chưa ký tên. Tôi đoán cái Hệ thống kia đang đợi nhóc tự quyết định nó là gì. Trả lời thật lòng nhé.",
      ],
      special: "interview", go: "a1_tech" },

    a1_tech: { chapter: "Arc 1", title: "Thuật thức",
      onEnter: { exp: 400, quest: { id: "q_interview", status: "done" } },
      text: [
        "Gojo đeo băng bịt mắt trở lại.",
        "> Được rồi. Phần còn lại là chuyện giữa nhóc và nó.",
        "[Hệ thống: Đã phân tích toàn bộ hành vi và câu trả lời của Ký chủ.]",
        "[Phát hiện 3 hình dạng thuật thức tương thích. Vui lòng chọn 1. Lựa chọn khắc vào cơ thể Ký chủ và không thể đảo ngược.]",
      ],
      special: "technique", go: "a1_restrict" },

    a1_restrict: { chapter: "Arc 1", title: "Khế ước Thiên dữ",
      text: [
        "Chú lực của Shen chuyển động theo một hình dạng mới, như dòng nước vừa tìm thấy lòng sông.",
        "Nhưng Hệ thống chưa dừng lại.",
        "[Đặc quyền Hệ thống: Ký chủ có thể ký một Khế ước Thiên dữ chú phược mà vẫn giữ nguyên thuật thức.]",
        "[Thiên dữ chú phược là sự đánh đổi khắc vào cơ thể: được một thứ, mất một thứ. Khế ước không thể hủy.]",
      ],
      special: "restriction", go: "a1_trial_brief" },

    a1_trial_brief: { chapter: "Arc 1", title: "Sát hạch Cấp 3",
      onEnter: { time: { days: 3 }, heal: "full", item: { id: "thuoc_ieiri", qty: 2 }, quest: { id: "q_trial", status: "active" } },
      text: [
        "Ba ngày sau. Hiệu trưởng Yaga triệu Shen tới võ đường dưới tầng hầm.",
        "> Học viện cần thêm chú thuật sư. Cậu sẽ được sát hạch để lên Cấp 3. Một mình, với thuật thức của chính cậu.",
        "Trong lồng phong ấn ở giữa phòng, một chú linh cấp 3 đang quẫy đạp. Ieiri ném cho Shen hai lọ thuốc.",
        "> Uống khi sắp chết nhé. Đừng uống sớm, phí.",
        "[Hệ thống: Đột phá Rank D cần Lv 8 và hoàn thành sát hạch. Hãy phân bổ điểm chỉ số trước khi vào trận.]",
      ],
      observe: ["c_trial"],
      choices: [{ t: "Bước vào lồng", go: "a1_trial", req: { technique: true } }] },

    a1_trial: { chapter: "Arc 1", title: "Chú linh sát hạch",
      text: ["Lồng phong ấn mở ra. Chú linh lao tới."],
      combat: { enemies: ["c_trial"], win: "a1_trial_win", lose: "a1_trial_lose", canFlee: false } },

    a1_trial_lose: { chapter: "Arc 1", title: "Chưa đủ",
      onEveryEnter: { heal: "full" },
      text: [
        "Yaga phong ấn chú linh lại ngay trước khi nó kịp xé cổ Shen.",
        "> Chưa đủ. Nghỉ ngơi, phân bổ lại sức lực, rồi quay lại.",
      ],
      choices: [{ t: "Thử lại", go: "a1_trial" }] },

    a1_trial_win: { chapter: "Arc 1", title: "Cấp 3",
      onEnter: { exp: 300, flag: "trial_D", quest: { id: "q_trial", status: "done" } },
      text: [
        "Chú linh sát hạch tan biến. Yaga gật đầu một lần, rất chậm.",
        "> Đạt.",
        "[Hệ thống: Đã hoàn thành sát hạch Rank D.]",
      ],
      special: "rankup", go: "a1_end" },

    a1_end: { chapter: "Hết Arc 1", env: "dusk/temple", cast: ["shen", "fushiguro"], title: "Tưởng niệm",
      text: [
        "Học viện tổ chức một buổi tưởng niệm nhỏ cho Itadori Yuji. Gojo không tới. Fushiguro đứng ở hàng cuối, im lặng suốt buổi.",
        "Tối hôm đó, Shen mở bảng Hệ thống và nhìn rất lâu vào dòng chữ cuối cùng trong nhật ký nhân quả.",
        "Nhưng ở một nơi khác của Tokyo, có một người lẽ ra đã chết đang ngồi xem phim kinh dị dưới tầng hầm.",
      ],
      choices: [{ t: "Bắt đầu Arc 2: Đối đầu Mahito", go: "a2_start" }] },
  };
})(typeof window !== "undefined" ? window : globalThis);
