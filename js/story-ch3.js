/* ============================================================
   SIMPUL TERAKHIR — BAB 3: Pecah Belah
   Kelompok terpecah. Aliansi bergeser. Kematian pertama terjadi.
   Lantai 3 terungkap. Siapa Sang Penenun mulai terkuak.
   ============================================================ */

const STORY_CH3 = {

'ch3_start': {
  chapter: 3,
  text: (s) => {
    let text = `<p class="sound">— Mansion Wardhana terasa semakin kecil setiap menitnya. Dinding-dinding mendekat. Bayangan-bayangan memanjang. Dan di antara sepuluh orang — atau berapa pun yang masih utuh — garis-garis kepercayaan mulai retak seperti kaca. —</p>`;
    text += `<p class="sound">— Countdown: ${s.flags.kiraTracking ? '02:30:00' : '03:30:00'} —</p>`;

    if (s.flags.dimasLocked) {
      text += `<p><span class="speaker dimas">Dimas</span> terkunci di kamar mandi lantai satu. Reza memasang kursi di depan pintu — improvisasi, tapi efektif. Dari dalam, tidak ada suara. Entah Dimas sedang merencanakan sesuatu, atau menunggu.</p>`;
    }

    // Player perspective
    const pc = s.playerCharacter || 'arin';
    if (pc === 'sera') text += `<p class="journal"><em>Kelompok ini sedang mengalami deindividuasi — mereka berhenti berpikir sebagai individu dan mulai bergerak berdasarkan ketakutan kolektif. Kau harus menjadi jangkar sebelum semua orang tenggelam.</em></p>`;
    else if (pc === 'juno') text += `<p class="journal"><em>Cukup. Lo udah cukup duduk dan dengerin. Saatnya bertindak — dobrak, pecahkan, lari. Apapun selain duduk dan menunggu mati.</em></p>`;
    else if (pc === 'lana') text += `<p class="journal"><em>Perpecahan. Persis sesuai rencana. Kelompok yang terpecah lebih mudah dikendalikan. Sekarang tinggal memilih: siapa yang menjadi simpul berikutnya?</em></p>`;
    else if (pc === 'reza') text += `<p class="journal"><em>Perpecahan kelompok adalah awal dari spiral. Kau sudah melihat ini di lapangan — hostage situation yang memburuk karena sandera mulai saling curiga. Kau harus bernegosiasi.</em></p>`;
    else if (pc === 'niko') text += `<p class="journal"><em>Mansionmu. Tamu-tamumu. Tanggung jawabmu. Dan sekarang kelompok terpecah — dan kau mulai kehilangan kontrol yang selama ini kau genggam erat.</em></p>`;
    else if (pc === 'vira') text += `<p class="journal"><em>Terakhir kali kelompok terpecah di mansion ini, tiga orang tidak pernah ditemukan. Kau tahu apa yang terjadi pada mereka. Kau tidak bisa membiarkan itu terulang.</em></p>`;
    else if (pc === 'kira') text += `<p class="journal"><em>Lo menemukan sesuatu di jaringan mansion — pattern komunikasi antara dua device yang nggak seharusnya ada. Seseorang di sini mengirim pesan ke luar.</em></p>`;
    else if (pc === 'farah') text += `<p class="journal"><em>Perpecahan berarti negosiasi. Dan negosiasi berarti leverage. Kau punya keduanya — pertanyaannya: seberapa banyak yang bersedia kau korbankan untuk bertahan?</em></p>`;

    text += `<p class="sound">— Kelompok secara alami terpecah menjadi faksi: —</p>`;

    let factions = '';
    factions += `<p><span class="speaker arin">Arin</span> <strong>Faksi Investigasi:</strong> `;
    let investigators = ['Arin'];
    if (s.flags.seraAlliance) investigators.push('Sera');
    if (s.flags.rezaAlliance || s.flags.rezaWarning) investigators.push('Reza');
    if (s.flags.kiraAlliance) investigators.push('Kira');
    factions += investigators.join(', ') + ` — mencari kebenaran dan jalan keluar.</p>`;

    factions += `<p><span class="speaker sera">Sera</span> <strong>Faksi Survival:</strong> Juno, Farah`;
    if (!s.flags.seraAlliance) factions += ', Sera';
    factions += ` — prioritas: keluar hidup-hidup, tidak peduli misteri.</p>`;

    factions += `<p><span class="speaker niko">Niko</span> <strong>Tidak Terbaca:</strong> Vira, Niko`;
    if (!s.flags.dimasLocked) factions += ', Lana, Dimas';
    factions += ` — agenda mereka sendiri.</p>`;

    text += factions;

    text += `<p><span class="speaker juno">Juno</span> berdiri. Kursinya terjungkal ke belakang. Api yang selama ini dia tahan — kecerobohan impulsif yang mendefinisikan dirinya — akhirnya meledak.</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Gue udah cukup. Gue nggak mau main detective lagi. Gue mau KELUAR."</p>`;
    text += `<p><span class="speaker sera">Sera</span>: "Juno—"</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Nggak." Mata Juno basah tapi suaranya keras. Pemantik konflik yang tidak bisa menahan diri. "Lo semua boleh stay dan solve mystery kayak ini film Netflix. Gue mau pecahin jendela, dobrak pintu, apapun. Siapa yang ikut?"</p>`;
    text += `<p><span class="speaker reza">Reza</span> berdiri pelan. Tenang. Negosiator veteran yang tahu bahwa membentak orang yang panik hanya memperburuk situasi.</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Juno." Suaranya rendah, steady — suara yang terbiasa bicara dengan orang yang memegang pisau di leher sandera. "Aku ikut kamu. Tapi kita lakukan dengan strategi, bukan dengan emosi."</p>`;
    text += `<p><span class="speaker juno">Juno</span> Juno menatap Reza. Dan sesuatu yang kau lihat di sana bukan sekedar rasa terima kasih — tapi koneksi yang lebih dalam. Dua orang yang sama-sama gagal menyelamatkan seseorang di masa lalu, menemukan satu sama lain di malam yang paling berbahaya.</p>`;
    text += `<p><span class="speaker niko">Niko</span> bersandar di dinding, tangan di saku. Dalang yang kehilangan kontrol tapi terlalu egois untuk mengakuinya. "Perpecahan adalah strategi terburuk," katanya — tapi matanya bergerak ke Vira, dan kau tahu yang dia maksud bukan tentang strategi. Dia tidak mau Vira pergi.</p>`;
    text += `<p><span class="speaker lana">Lana</span> mengamati semuanya dari sudut, jari menelusuri pinggiran gelas wine-nya. Dalang mengobservasi. Setiap konflik, setiap emosi, setiap keretakan — material untuk skenario berikutnya. "Ini menarik," bisiknya pada Dimas. "Persis seperti Bab 7 dari naskahku." Dimas mengangguk — patuh, selalu patuh.</p>`;
    text += `<p>Di tengah kekacauan itu, <span class="speaker farah">Farah</span> menghitung. Bukan orang — tapi opsi. Negosiator egois menghitung cost dan benefit. Siapa yang bisa dia manfaatkan. Siapa yang expendable. Survival of the richest.</p>`;

    return text;
  },
  choices: [
    {
      text: '"Juno, tunggu. Kalau kita pecah, kita lebih mudah ditarget."',
      next: 'ch3_convince_juno',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', -3);
      }
    },
    {
      text: '"Juno benar. Kita perlu exit strategy paralel. Juno cari jalan keluar, aku investigasi."',
      next: 'ch3_split_plan',
      effect: (s) => {
        s.flags.splitPlan = true;
        Engine.modTrust('arin', 'juno', 8);
      }
    },
    {
      text: "Ikut Juno — dobrak jalan keluar adalah prioritas",
      next: 'ch3_escape_attempt',
      effect: (s) => {
        s.flags.joinedJuno = true;
        Engine.modTrust('arin', 'juno', 10);
      }
    },
    {
      text: "Abaikan debat — langsung naik ke lantai 3 selagi semua sibuk",
      danger: true,
      next: 'ch3_floor3',
      effect: (s) => {
        s.flags.wentToFloor3Alone = true;
        Engine.modDanger(10);
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch3_convince_juno': {
  text: `<p><span class="speaker juno">Juno</span> menggeram frustrasi.</p>
<p><span class="speaker arin">Arin</span> "Arin, lo denger gue nggak? Orang udah kena racun. Laptop Kira hancur. Dan kita masih di sini ngobrol soal 'clue' dan 'simpul'? Ini bukan game — ini HIDUP KITA."</p>
<p><span class="speaker sera">Sera</span> menyentuh bahu Juno. "Dia benar soal satu hal, Arin. Kita perlu exit strategy."</p>
<p><span class="speaker reza">Reza</span>: "Kompromi. Kita bagi dua tim. Satu cari jalan keluar fisik. Satu investigasi Sang Penenun. Komunikasi setiap lima belas menit."</p>
<p><span class="speaker juno">Juno</span> Proposal yang masuk akal. Juno masih tegang tapi mengangguk.</p>`,
  choices: [
    {
      text: "Setuju — bagi tim. Aku pimpin investigasi.",
      next: 'ch3_split_plan',
      effect: (s) => {
        s.flags.splitPlan = true;
        Engine.modTrust('arin', 'juno', 5);
      }
    }
  ]
},

'ch3_split_plan': {
  text: (s) => {
    let text = `<p class="sound">— Tim terbentuk: —</p>`;
    text += `<p><span class="speaker juno">Juno</span> <strong>Tim Keluar (Juno pimpin):</strong> Juno, `;

    let escapeTeam = ['Juno'];
    if (!s.flags.dimasLocked) {
      text += `Farah, dan siapapun yang mau ikut.</p>`;
    } else {
      text += `Farah.</p>`;
    }

    text += `<p><span class="speaker arin">Arin</span> <strong>Tim Investigasi (Arin pimpin):</strong> Arin, `;
    let investigateTeam = ['Arin'];
    if (s.flags.seraAlliance) { text += 'Sera, '; investigateTeam.push('Sera'); }
    if (s.flags.rezaAlliance) { text += 'Reza, '; investigateTeam.push('Reza'); }
    text += `dan Niko (dia tahu layout mansion).</p>`;

    text += `<p><span class="speaker juno">Juno</span>: "Lima belas menit. Kalau nggak ada kabar, kita cari lo."</p>`;
    text += `<p class="sound">— Kelompok berpencar. Mansion menelan mereka. —</p>`;

    return text;
  },
  choices: [
    {
      text: "Naik ke lantai 3 — ruang kerja kakek Niko",
      next: 'ch3_floor3',
      effect: (s) => {
        s.flags.headingToFloor3 = true;
      }
    },
    {
      text: "Basement dulu — server di B-2 mengontrol semua kunci",
      condition: (s) => s.flags.hasMansionMap || s.flags.wentToBasement,
      next: 'ch3_basement_b2',
      effect: (s) => {
        s.flags.headingToB2 = true;
      }
    }
  ]
},

'ch3_escape_attempt': {
  text: `<p><span class="speaker juno">Juno</span> Kau, Juno, dan beberapa orang bergerak ke sayap timur — jendela terbesar mansion ada di sana.</p>
<p><span class="speaker juno">Juno</span> mengambil kursi kayu dan menghantamkannya ke jendela.</p>
<p><span class="speaker juno">Juno</span> Kaca retak tapi tidak pecah. Jendela berlapis — kaca tempered di luar, film keamanan di dalam.</p>
<p><span class="speaker juno">Juno</span> Juno menghantam lagi. Lagi. Lagi. Berkeringat, frustasi. Kursi patah sebelum kaca menyerah.</p>
<p><span class="speaker juno">Juno</span> "SIAL!"</p>
<p><span class="speaker reza">Reza</span>: "Kaca keamanan grade tinggi. Butuh alat potong khusus — atau banyak waktu."</p>
<p><span class="speaker reza">Reza</span> Speaker berderak: <em>"Merusak properti akan mempercepat countdown tiga puluh menit."</em></p>
<p class="sound">— Timer berubah. Tiga puluh menit hilang. —</p>
<p><span class="speaker juno">Juno</span> Juno menendang dinding.</p>
<p>Dari arah lain, <span class="speaker niko">Niko</span> berlari menghampiri. "Ada jalan lain. Wine cellar di basement — ada pintu darurat ke luar. Tapi..."</p>
<p><span class="speaker niko">Niko</span> "Tapi apa?"</p>
<p><span class="speaker niko">Niko</span> "Tapi harus melalui ruang server di B-2. Dan aku tidak punya aksesnya lagi."</p>`,
  choices: [
    {
      text: "Ke basement — dobrak pintu server kalau perlu",
      next: 'ch3_basement_b2',
      effect: (s) => {
        s.flags.forcingServerRoom = true;
        Engine.modDanger(8);
      }
    },
    {
      text: "Bagi tim — Juno terus coba jendela, aku ke lantai 3",
      next: 'ch3_floor3',
      effect: (s) => {
        s.flags.splitFromJuno = true;
      }
    }
  ]
},

'ch3_floor3': {
  chapter: 3,
  text: (s) => {
    let text = `<p class="sound">— Lantai tiga Mansion Wardhana. —</p>`;

    if (s.flags.followedViraUpstairs && s.flags.caughtVira) {
      text += `<p><span class="speaker vira">Vira</span> Kau sudah pernah di sini — saat mengikuti Vira. Tapi sekarang, tanpa kegelapan dan urgensi, kau bisa melihat lebih banyak.</p>`;
    } else {
      text += `<p><span class="speaker vira">Vira</span> Tangga menuju lantai tiga berderit di bawah kakimu. Udara di sini berbeda — lebih tua, lebih berat, seperti bernapas melalui sejarah. Wallpaper Victorian yang terkelupas. Foto-foto keluarga Wardhana-Aldridge dari generasi ke generasi.</p>`;
    }

    text += `<p><span class="speaker vira">Vira</span> Tiga ruangan: <em>Ruang Kerja</em>, <em>Kamar Tidur Tua</em>, dan ruangan yang hanya bertuliskan <em>"Privat"</em>.</p>`;

    if (s.flags.hasHardDrive) {
      text += `<p><span class="speaker vira">Vira</span> Hard drive dari ruang kerja sudah ada padamu — tapi kau belum sempat membuka isinya.</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Masuk Ruang Kerja — pusat operasi kakek Niko",
      next: 'ch3_study',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
      }
    },
    {
      text: "Kamar Tidur Tua — siapa yang tidur di sini?",
      next: 'ch3_bedroom',
      effect: (s) => {
        s.cluesFound++;
      }
    },
    {
      text: 'Ruangan "Privat" — yang paling misterius',
      danger: true,
      next: 'ch3_private_room',
      effect: (s) => {
        Engine.modDanger(10);
        Engine.modAwareness('arin', 12);
      }
    }
  ]
},

'ch3_study': {
  text: (s) => {
    let text = `<p class="sound">— Ruang kerja Hendarto Wardhana — atau apa yang tersisa darinya. —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Meja besar mahogani. Rak buku floor-to-ceiling. Lukisan minyak di dinding — kakek Niko, muda, dengan mata yang sama tajamnya tapi lebih dingin. Di sampingnya, di foto yang sama — pria lain. Kakek Farah. Mereka berdiri di depan mansion yang baru setengah jadi.</p>`;

    if (!s.flags.caughtVira) {
      text += `<p><span class="speaker niko">Niko</span> Di meja: laptop tua terbuka, hard drive external, dan tumpukan notes. Seseorang sudah di sini sebelumnya — laptop masih hangat.</p>`;
    }

    text += `<p class="sound">— Di laci meja: folder bertuliskan "SIMPUL — PROTOKOL". Di dalamnya: —</p>`;
    text += `<p class="journal"><em>"Protokol Simpul Tahunan:<br>1. Undang 10 target — profil yang sudah ditentukan.<br>2. Fase 1: Observasi — biarkan mereka berinteraksi alami.<br>3. Fase 2: Provokasi — sebarkan informasi yang memecah kelompok.<br>4. Fase 3: Seleksi — tentukan simpul yang harus terputus.<br>5. Fase 4: Eksekusi — laksanakan dengan metode yang tidak menimbulkan kecurigaan luar.<br>6. Cleanup — satu korban selamat sebagai 'saksi' yang tidak dipercaya siapapun."</em></p>`;
    text += `<p><span class="speaker niko">Niko</span> Kau merasakan mual. Ini bukan sekadar horor — ini <em>operasi</em>. Terstruktur. Dipraktekkan. Diulang selama bertahun-tahun.</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker niko">Niko</span> Di bawah protokol, notes tambahan dengan tulisan tangan berbeda — lebih muda, lebih rapi:</p>`;
      text += `<p class="journal"><em>"Update tahun ini: Operator internal ditanam di antara tamu. Dua operator — Penulis dan Pemotong. Komando melalui walkie-talkie encrypted di frequency 462.5625 MHz."</em></p>`;
      text += `<p><span class="speaker lana">Lana</span> Penulis — Lana? Pemotong — Dimas?</p>`;
    }

    if (s.difficulty === 3) {
      text += `<p><span class="speaker lana">Lana</span> Dan satu notes lagi, paling bawah. Tulisan tangan ketiga — formal, seperti surat bisnis:</p>`;
      text += `<p class="journal"><em>"Konfirmasi dari Pewaris Wardhana: akses penuh diberikan. Sistem keamanan dimutakhirkan per spesifikasi. Semua perlu berjalan lancar malam ini. Ini yang terakhir — setelah ini, utang lunas."</em></p>`;
      text += `<p><span class="speaker niko">Niko</span> Pewaris Wardhana — Niko? Niko memberikan akses?</p>`;
    }

    return text;
  },
  shake: true,
  choices: [
    {
      text: "Ambil semua dokumen. Ini bukti yang cukup untuk menghancurkan siklus.",
      next: 'ch3_study_aftermath',
      effect: (s) => {
        s.items.push('protocol_docs');
        s.cluesFound += 3;
        s.flags.hasProtocol = true;
        s.keyChoices.push('found_protocol');
      }
    },
    {
      text: "Foto dokumen dan cek ruangan lain",
      next: 'ch3_study_aftermath',
      effect: (s) => {
        s.items.push('protocol_photos');
        s.cluesFound += 2;
        s.flags.hasProtocolPhotos = true;
      }
    }
  ]
},

'ch3_study_aftermath': {
  text: (s) => {
    let text = '';

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker lana">Lana</span> "Penulis dan Pemotong," kau bergumam. Lana menulis skenario. Dimas menyediakan metode. Mereka berdua operator Sang Penenun yang tertanam di antara tamu.</p>`;
    }
    if (s.difficulty === 3) {
      text += `<p><span class="speaker niko">Niko</span> Dan notes terakhir itu — "Pewaris Wardhana memberikan akses penuh". Apakah Niko... apakah Niko terlibat? Atau notes itu merujuk pada kakeknya?</p>`;
      text += `<p><span class="speaker niko">Niko</span> Kau perlu konfrontasi Niko. Tapi hati-hati.</p>`;
    }

    text += `<p class="sound">— Suara langkah di tangga. Seseorang naik ke lantai tiga. —</p>`;

    return text;
  },
  choices: [
    {
      text: "Sembunyi dan lihat siapa yang datang",
      next: 'ch3_floor3_visitor',
      effect: (s) => {
        s.flags.hidInStudy = true;
      }
    },
    {
      text: "Keluar dan hadapi — cukup bersembunyi",
      next: 'ch3_floor3_visitor',
      effect: (s) => {
        s.flags.facedVisitor = true;
      }
    }
  ]
},

'ch3_floor3_visitor': {
  text: (s) => {
    let text = '';

    if (s.difficulty >= 3 && !s.flags.dimasLocked) {
      text += `<p><span class="speaker niko">Niko</span> muncul di pintu. Di belakangnya: <span class="speaker lana">Lana</span>.</p>`;
      text += `<p><span class="speaker niko">Niko</span> Mereka berdua. Bersama. Niko dan salah satu "operator".</p>`;

      if (s.flags.facedVisitor) {
        text += `<p><span class="speaker niko">Niko</span> Kau berdiri di tengah ruangan. "Niko. Lana. Menarik — kalian berdua datang bersama."</p>`;
        text += `<p><span class="speaker arin">Arin</span> Niko: "Arin, aku bisa jelaskan—"</p>`;
        text += `<p><span class="speaker niko">Niko</span> "Jelaskan apa? Bahwa kau memberikan akses penuh ke mansion ini kepada Sang Penenun? Aku menemukan notes-nya, Niko."</p>`;
        text += `<p><span class="speaker niko">Niko</span> Niko memucat. Lana diam — terlalu diam.</p>`;
      } else {
        text += `<p class="sound">— Dari balik lemari, kau mendengar: —</p>`;
        text += `<p><span class="speaker niko">Niko</span> Niko: "Lana, ini sudah di luar kendali. Aku tidak sign up untuk ini. Kau bilang tidak akan ada yang terluka."</p>`;
        text += `<p><span class="speaker niko">Niko</span> Lana: "Plans berubah, Niko. Kau tahu risikonya saat kau setuju."</p>`;
        text += `<p><span class="speaker niko">Niko</span> "Aku setuju untuk mengungkap dosa kakekku! Bukan untuk... ini!"</p>`;
        text += `<p><span class="speaker niko">Niko</span> "Mengungkap dosa memerlukan korban. Kau pikir kebenaran itu gratis?"</p>`;
      }
    } else {
      text += `<p><span class="speaker niko">Niko</span> muncul sendirian.</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Arin. Aku tahu kau akan ke sini." Dia terlihat hancur — bukan fisik, tapi sesuatu di dalamnya pecah.</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Kau sudah baca protokolnya."</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Ya."</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Maka kau tahu. Keluargaku... kakekku... melakukan ini selama puluhan tahun. Setiap tahun, dia mengundang orang — dan beberapa dari mereka tidak pernah kembali."</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Dan kau merencanakan malam ini untuk mengungkapnya?"</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Aku merencanakan pameran dokumenter. Mengekspos dosa keluargaku. Tapi seseorang membajak rencana itu — seseorang yang INGIN siklus itu berlanjut, bukan berhenti."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: '"Niko, aku butuh jawaban jujur. Apakah kau salah satu dari mereka?"',
      next: 'ch3_niko_truth',
      effect: (s) => {
        s.flags.askedNikoDirectly = true;
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Kita harus kembali ke bawah. SEKARANG. Sebelum event berikutnya.",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.rushDownstairs = true;
      }
    },
    {
      text: "Periksa ruangan 'Privat' sebelum turun",
      condition: (s) => !s.flags.checkedPrivateRoom,
      next: 'ch3_private_room',
      effect: (s) => {
        Engine.modDanger(8);
      }
    }
  ]
},

'ch3_niko_truth': {
  text: (s) => {
    let text = '';

    if (s.difficulty === 3) {
      text += `<p><span class="speaker niko">Niko</span> menunduk.</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Aku... ya. Sebagian. Aku memberikan akses. Aku mengundang orang-orang yang Lana minta. Aku pikir — aku pikir ini tentang menebus dosa kakekku. Lana bilang dia butuh bukti, saksi, orang-orang yang terhubung dengan kasus lama."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Tapi kau TAHU tentang kematian yang terjadi di acara-acara sebelumnya."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Aku tahu ada yang hilang! Tapi Lana bilang mereka pergi sendiri — relokasi, perlindungan saksi. Aku tidak tahu—" suaranya pecah, "—aku tidak tahu sampai malam ini."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Kau pembohong,"  dingin, "atau kau naif. Pilih yang kau mau."</p>`;
    } else {
      text += `<p><span class="speaker niko">Niko</span> menatapmu. Matanya merah.</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Bukan. Aku bersumpah. Aku merencanakan ini sebagai cara untuk mengakhiri siklus — bukan melanjutkannya. Tapi seseorang lebih pintar dariku. Seseorang yang sudah ada di dalam sistem ini jauh lebih lama."</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Siapa?"</p>`;
      text += `<p><span class="speaker farah">Farah</span> "Aku tidak tahu pasti. Tapi kakekku punya partner. Bukan kakek Farah — orang lain. Seseorang yang dia sebut 'Sang Penenun' dalam jurnalnya. Dan orang itu... mungkin masih hidup."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Turun ke bawah. Sekarang. Sebelum terlambat.",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.nikoTruthRevealed = true;
        if (s.difficulty === 3) {
          Engine.modSuspicion('niko', 30);
          s.keyChoices.push('niko_complicit');
        }
      }
    }
  ]
},

'ch3_bedroom': {
  text: `<p><span class="speaker farah">Farah</span> Kamar tidur tua — tempat tidur empat tiang dengan kelambu berdebu, lemari pakaian besar, dan meja rias dengan cermin yang mengoksidasi sehingga refleksinya terdistorsi.</p>
<p><span class="speaker farah">Farah</span> Di atas tempat tidur: jurnal. Diary lama dengan kulit yang mulai hancur. Tulisan tangan — Hendarto Wardhana.</p>
<p class="sound">— Entri terakhir, bertanggal seminggu sebelum kematiannya: —</p>
<p class="journal"><em>"Sudah 48 tahun. 48 simpul. Aku tidak bisa lagi. Tubuhku menolak. Jiwaku — kalau masih ada — menolak. Tapi Penenun tidak mengizinkan berhenti. 'Satu simpul lagi,' katanya. Selalu satu lagi. Dan aku selalu menurut karena... karena dia tahu apa yang aku lakukan pada tahun pertama. Bukti itu ada padanya. Selamanya."</em></p>
<p class="journal"><em>"Aku akan menyerahkan semuanya pada Niko. Bukan sebagai warisan — tapi sebagai pengakuan. Biarkan dia yang memutuskan: melanjutkan atau menghancurkan. Aku tidak cukup kuat untuk keduanya."</em></p>
<p><span class="speaker farah">Farah</span> Kau menutup jurnal. Hendarto Wardhana bukan mastermind — dia korban juga. Di-blackmail oleh Sang Penenun selama hampir setengah abad.</p>`,
  choices: [
    {
      text: "Simpan jurnal. Kembali untuk cek ruangan lain.",
      next: 'ch3_floor3',
      effect: (s) => {
        s.items.push('grandfather_journal');
        s.cluesFound += 2;
        s.flags.hasJournal = true;
        s.keyChoices.push('found_journal');
      }
    }
  ]
},

'ch3_private_room': {
  text: (s) => {
    let text = `<p class="sound">— Ruangan "Privat". —</p>`;
    text += `<p class="sound">— Pintu terkunci — tapi bukan elektronik. Gembok kombinasi lama. Empat digit. —</p>`;

    if (s.flags.hasJournal) {
      text += `<p><span class="speaker niko">Niko</span> Dalam jurnal kakek Niko, kau ingat satu detail: "48 tahun. 48 simpul." 1971 — tahun mansion dibangun.</p>`;
      text += `<p class="sound">— Kau memasukkan: 1-9-7-1. —</p>`;
      text += `<p class="sound">— Klik. —</p>`;
    } else {
      text += `<p><span class="speaker lana">Lana</span> Kau mencoba beberapa kombinasi — tahun pembangunan mansion yang kau ingat dari cerita Lana: 1971.</p>`;
      text += `<p class="sound">— Klik. —</p>`;
    }

    text += `<p class="sound">— Ruangan di balik pintu bukan ruangan. Ini shrine. —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Dinding dipenuhi foto — puluhan, ratusan — semua orang yang pernah diundang ke mansion ini. Setiap foto punya label: nama, tanggal, dan satu kata: "SELAMAT" atau "TERPUTUS".</p>`;
    text += `<p class="sound">— Yang "TERPUTUS" jauh lebih banyak dari yang "SELAMAT". —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Di tengah ruangan: patung kecil dari kayu — figur tanpa wajah dengan tangan yang memegang benang-benang merah. Benang-benang itu terhubung ke setiap foto di dinding, membentuk web raksasa.</p>`;
    text += `<p class="sound">— Sang Penenun. Literal. Menenun jaringan korban selama setengah abad. —</p>`;

    text += `<p><span class="speaker farah">Farah</span> Dan di dinding terakhir — yang paling baru — sepuluh foto. Foto kalian semua. Diambil minggu ini. Sembilan masih belum dilabeli. Satu sudah: foto Farah, dengan tulisan "TERPUTUS" dicoret dan diganti "TERTUNDA".</p>`;
    text += `<p><span class="speaker farah">Farah</span> Sang Penenun sudah merencanakan siapa yang mati malam ini. Tapi rencana itu berubah — karena kalian melawan.</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: "Foto semuanya. Hancurkan patung. Akhiri ini.",
      next: 'ch3_destroy_shrine',
      effect: (s) => {
        s.flags.destroyedShrine = true;
        s.items.push('shrine_photos');
        s.cluesFound += 3;
        s.moralScore += 10;
        Engine.modDanger(15);
        s.keyChoices.push('destroyed_shrine');
      }
    },
    {
      text: "Foto tapi jangan sentuh. Ini bukti untuk polisi.",
      next: 'ch3_first_death',
      effect: (s) => {
        s.items.push('shrine_photos');
        s.cluesFound += 3;
        s.flags.preservedShrine = true;
      }
    }
  ]
},

'ch3_destroy_shrine': {
  text: `<p><span class="speaker farah">Farah</span> Kau menghancurkan patung. Kayu tua pecah seperti tulang kering. Benang-benang merah jatuh seperti darah beku.</p>
<p><span class="speaker farah">Farah</span> Dan di dalam patung — sesuatu jatuh. Flash drive kecil. Tersembunyi di rongga kayu.</p>
<p class="sound">— Kau mengambilnya. Label kecil: "POLIS ASURANSI". —</p>
<p class="sound">— Speaker berderak. Kali ini suaranya berbeda — bukan mekanis. Marah. —</p>
<p class="journal"><em>"Kau menghancurkan karya seni tujuh dekade. Apakah kau merasa jadi pahlawan, Arin? Setiap penghancuran memiliki harga. Cek lantai satu."</em></p>
<p class="sound">— Jantungmu berhenti sedetik. —</p>
<p class="sound">— Kau berlari ke tangga. —</p>`,
  shake: true,
  choices: [
    {
      text: "LARI ke lantai satu!",
      next: 'ch3_first_death',
      effect: (s) => {
        s.items.push('insurance_flash_drive');
        s.flags.hasInsuranceDrive = true;
        s.flags.triggeredPenenunAnger = true;
        Engine.modDanger(20);
      }
    }
  ]
},

'ch3_basement_b2': {
  text: (s) => {
    let text = `<p><span class="speaker farah">Farah</span> Basement B-1 — wine cellar. Kau melewati rak-rak botol berdebu menuju pintu baja B-2.</p>`;

    if (s.flags.kiraAlliance && !s.flags.savedFarahDrink) {
      text += `<p><span class="speaker kira">Kira</span> ada bersamamu, laptop di tangan. "Aku bisa coba brute force password dari sini."</p>`;
      text += `<p class="sound">— Tiga menit mengetik. Lima menit. Tujuh menit. —</p>`;
      text += `<p class="sound">— "Got it." Suara klik magnetik. Pintu baja terbuka. —</p>`;
    } else {
      text += `<p class="sound">— Pintu baja. Kunci elektronik. Panel keypad di samping. —</p>`;
      if (s.flags.hasMansionMap) {
        text += `<p><span class="speaker kira">Kira</span> Dari diagram mansion yang kau temukan di dapur, ada catatan: kode backup B-2 adalah "71-SIMPUL".</p>`;
        text += `<p class="sound">— Kau memasukkan kode. Pintu terbuka. —</p>`;
      } else {
        text += `<p class="sound">— Kau mencoba beberapa kombinasi. Tidak berhasil. Panel menolak. —</p>`;
        text += `<p><span class="speaker niko">Niko</span>: "Coba 1971."</p>`;
        text += `<p class="sound">— Tidak berhasil. —</p>`;
        text += `<p><span class="speaker reza">Reza</span> menendang panel. Tidak bergerak. "Kita butuh Kira."</p>`;
        text += `<p class="sound">— Kau terjebak di depan pintu yang tidak bisa kau buka. —</p>`;
      }
    }

    text += `<p class="sound">— Di balik pintu B-2: —</p>`;
    text += `<p><span class="speaker reza">Reza</span> Ruangan server. Dingin, biru, dengan rak-rak server yang berkedip. Monitor-monitor menampilkan feed CCTV dari seluruh mansion. Countdown timer: angka merah besar. Dan — sebuah workstation dengan keyboard dan layar yang menampilkan interface kontrol.</p>`;
    text += `<p><span class="speaker reza">Reza</span> Dari sini, seseorang mengendalikan SEMUANYA. Lampu, kunci, speaker, kamera. Ini pusat komando Sang Penenun.</p>`;

    return text;
  },
  choices: [
    {
      text: "Ambil alih sistem — buka semua kunci!",
      next: 'ch3_takeover_system',
      effect: (s) => {
        s.flags.tookOverSystem = true;
        s.keyChoices.push('system_takeover');
      }
    },
    {
      text: "Jangan sentuh — bisa jadi booby-trapped. Observasi dulu.",
      next: 'ch3_observe_system',
      effect: (s) => {
        s.flags.observedSystem = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch3_takeover_system': {
  text: `<p><span class="speaker reza">Reza</span> Kau duduk di workstation. Interface-nya sederhana — terlalu sederhana. Seperti sengaja dirancang agar mudah digunakan.</p>
<p class="sound">— Opsi di layar: —</p>
<p class="sound">— • UNLOCK ALL DOORS ✦ LOCKDOWN ALL DOORS ✦ ACTIVATE EVENT ✦ BROADCAST ✦ SHUTDOWN —</p>
<p class="sound">— Kau menekan UNLOCK ALL DOORS. —</p>
<p class="sound">— Layar berkedip: "Konfirmasi diperlukan. Masukkan passphrase Penenun." —</p>
<p class="sound">— Password. Tentu saja. —</p>
<p class="sound">— Kau mencoba "simpul". Salah. "penenun". Salah. "1971". Salah. —</p>
<p class="sound">— Tiga kali salah. Layar berubah merah: —</p>
<p class="journal"><em>"Akses ditolak. Failsafe aktif. Event darurat dimulai dalam 60 detik."</em></p>
<p class="sound">— Alarm berbunyi di seluruh mansion. Merah berkedip. —</p>`,
  shake: true,
  glitch: true,
  choices: [
    {
      text: "SHUTDOWN! Matikan semuanya!",
      next: 'ch3_shutdown',
      effect: (s) => {
        s.flags.attemptedShutdown = true;
        Engine.modDanger(15);
      }
    },
    {
      text: "LARI dari basement — event darurat bisa apa saja",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.fledBasement = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch3_shutdown': {
  text: `<p class="sound">— Kau menekan SHUTDOWN. Layar berkedip. —</p>
<p><span class="speaker reza">Reza</span> <em>"Shutdown memerlukan passphrase level 2."</em></p>
<p class="sound">— Tidak bisa. —</p>
<p><span class="speaker reza">Reza</span> Kau mencabut kabel power dari server utama. Layar mati. Feed CCTV mati. Lampu di seluruh mansion berkedip — lalu mati total.</p>
<p><span class="speaker reza">Reza</span> Gelap. Absolut. Generator di suatu tempat menyala — lampu darurat hijau berkedip lemah.</p>
<p><span class="speaker reza">Reza</span> Kau baru saja mematikan mata dan telinga Sang Penenun. Tapi juga mematikan semua kunci elektronik.</p>
<p><span class="speaker reza">Reza</span> Pintu-pintu di seluruh mansion berderak terbuka — kunci elektromagnetik memerlukan daya untuk tetap terkunci. Tanpa daya, semua pintu default ke posisi terbuka.</p>
<p class="sound">— Termasuk pintu keluar. —</p>
<p><span class="speaker dimas">Dimas</span> Termasuk... pintu di mana Dimas dikunci.</p>
<p><span class="speaker dimas">Dimas</span> Dan termasuk pintu-pintu yang seharusnya menahan apapun yang ada di ruangan-ruangan yang belum kau jelajahi.</p>`,
  shake: true,
  glitch: true,
  choices: [
    {
      text: "LARI ke atas — pintu keluar terbuka! Kumpulkan semua orang!",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.allDoorsOpen = true;
        s.flags.dimasFreed = true;
        Engine.modDanger(20);
        s.keyChoices.push('killed_power');
      }
    }
  ]
},

'ch3_observe_system': {
  text: `<p class="sound">— Kau tidak menyentuh apa-apa. Tapi kau mengamati. —</p>
<p><span class="speaker dimas">Dimas</span> Di monitor CCTV, kau bisa melihat semua ruangan. Dan kau melihat sesuatu yang membuatmu gemetar:</p>
<p><span class="speaker dimas">Dimas</span> Feed dari lorong lantai satu — seseorang bergerak. Berpakaian gelap, wajah tertutup. Bukan salah satu dari sepuluh tamu. Orang ke-11.</p>
<p><span class="speaker dimas">Dimas</span> Orang itu bergerak dari arah dapur, membawa sesuatu — benda panjang, logam, berkilat.</p>
<p><span class="speaker dimas">Dimas</span> "Ada orang lain di mansion ini," bisikmu.</p>
<p>Di monitor lain: <span class="speaker juno">Juno</span> berjalan sendirian di koridor lantai satu. Menuju arah yang sama dengan sosok gelap itu.</p>
<p><span class="speaker juno">Juno</span> Juno tidak tahu. Dia berjalan langsung menuju bahaya.</p>`,
  shake: true,
  choices: [
    {
      text: "BROADCAST melalui speaker: 'JUNO, LARI!'",
      next: 'ch3_warn_juno',
      effect: (s) => {
        s.flags.warnedJunoFromBasement = true;
        Engine.modTrust('arin', 'juno', 10);
      }
    },
    {
      text: "Lari ke atas secepat mungkin untuk menolong Juno!",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.racedToSaveJuno = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch3_warn_juno': {
  text: `<p class="sound">— Kau menekan tombol BROADCAST. —</p>
<p><span class="speaker juno">Juno</span> Suaramu mengisi seluruh mansion: "JUNO! LORONG LANTAI SATU! LARI!"</p>
<p><span class="speaker juno">Juno</span> Di monitor, Juno bereaksi — berhenti, menoleh, lalu berlari. Sosok gelap di belakangnya berhenti juga. Menoleh ke kamera terdekat — seolah TAHU kau menontonnya.</p>
<p class="sound">— Lalu sosok itu mundur. Menghilang ke bayangan. —</p>
<p><span class="speaker juno">Juno</span> Kau menyelamatkan Juno — untuk sekarang. Tapi Sang Penenun tahu kau di ruang server. Dan dia tidak akan membiarkan kau tetap di sana.</p>
<p class="sound">— Lampu di ruang server berkedip. Monitor menampilkan pesan: —</p>
<p class="journal"><em>"Bukan giliranmu bermain sutradara, Arin. Keluar dari ruangan ini dalam 30 detik — atau gas dari ventilasi akan memastikan kau tidak keluar sama sekali."</em></p>`,
  choices: [
    {
      text: "KELUAR! Sekarang!",
      next: 'ch3_first_death',
      effect: (s) => {
        s.flags.escapedServerRoom = true;
        s.flags.penenunKnowsArin = true;
        Engine.modDanger(15);
      }
    }
  ]
},

'ch3_first_death': {
  chapter: 3,
  text: (s) => {
    let text = `<p class="sound">— Dan kemudian — kematian pertama. —</p>`;

    if (s.flags.triggeredPenenunAnger || s.flags.allDoorsOpen) {
      text += `<p class="sound">— Kau mendengar teriakan dari lantai satu saat berlari turun. Tapi kau terlambat. —</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> Semua orang berkumpul saat speaker mengumumkan event ketiga. Tapi sebelum instruksi selesai — suara. Bukan dari speaker. Dari ruangan di sebelah.</p>`;
    }

    // Determine first death based on choices
    let victim = 'reza';
    if (s.flags.savedFarahDrink && !s.flags.guardingVictim) {
      victim = 'kira';
    } else if (s.flags.stoppedDimasTea && s.flags.dimasLocked) {
      victim = 'farah';
    } else if (s.flags.rezaAlliance && s.flags.guardingVictim) {
      victim = 'lana';
      if (Engine.isKiller('lana')) victim = 'farah';
    }

    if (victim === 'reza') {
      text += `<p><span class="speaker reza">Reza</span> ditemukan di koridor sayap timur. Tergeletak. Tidak bergerak.</p>`;
      text += `<p><span class="speaker reza">Reza</span> Luka di kepalanya — trauma tumpul, dari belakang. Dia tidak melihat datang. Orang yang paling waspada di antara kalian... ditangkap dari titik buta.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> — kalau dia tidak dikunci — berlari memeriksa. "Tidak ada nadi. Dia sudah—"</p>`;
      text += `<p>"Jangan bilang." Suara <span class="speaker sera">Sera</span> pecah.</p>`;
      text += `<p><span class="speaker reza">Reza</span> Reza. Mantan detektif. Orang yang berjuang untuk kebenaran bahkan setelah sistem menolaknya. Mati di lorong gelap mansion terkutuk ini.</p>`;
    } else if (victim === 'kira') {
      text += `<p><span class="speaker kira">Kira</span> — yang sebelumnya terluka — ditemukan di kamar tempat dia diistirahatkan. Mesinnya mati total. Luka di kepalanya... diperburuk. Seseorang memastikan dia tidak bangun lagi.</p>`;
      text += `<p>"Dia masih hidup setengah jam lalu," bisik <span class="speaker sera">Sera</span>. "Siapa yang berjaga?"</p>`;
      text += `<p class="sound">— Tidak ada yang menjawab. Semua saling melirik. —</p>`;
    } else if (victim === 'farah') {
      text += `<p><span class="speaker farah">Farah</span>. Ditemukan di ruang makan — masih di kursinya, kepala bersandar ke meja. Seolah tertidur. Tapi tidur yang tidak pernah berakhir.</p>`;
      text += `<p>"Racun," kata <span class="speaker dimas">Dimas</span> — kalau dia ada. "Dalam wine. Substansi yang memperlambat jantung sampai berhenti. Tanpa rasa, tanpa bau."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> Pewaris keluarga Aldridge. Mati oleh racun di rumah yang dibangun uang keluarganya.</p>`;
    } else {
      text += `<p>Yang ditemukan bukan yang kau duga. <span class="speaker lana">Lana</span> — penulis horor — tergeletak di perpustakaan. Ironi yang terlalu sempurna untuk tidak disengaja.</p>`;
      text += `<p><span class="speaker lana">Lana</span> Di tangannya: notes terakhir. Tulisan tangan yang makin tidak terbaca. Kata terakhir yang bisa kau baca: "...dia mengkhianati aku juga..."</p>`;
      text += `<p class="sound">— Bahkan operator Sang Penenun tidak aman dari tuannya sendiri. —</p>`;
    }

    text += `<p class="sound">— Speaker: "Simpul pertama... terputus." —</p>`;
    text += `<p class="sound">— Suara itu terdengar puas. —</p>`;

    return text;
  },
  blood: true,
  shake: true,
  glitch: true,
  onEnter: (s) => {
    let victim = 'reza';
    if (s.flags.savedFarahDrink && !s.flags.guardingVictim) victim = 'kira';
    else if (s.flags.stoppedDimasTea && s.flags.dimasLocked) victim = 'farah';
    else if (s.flags.rezaAlliance && s.flags.guardingVictim) {
      victim = 'lana';
      if (s.killers && s.killers.includes('lana')) victim = 'farah';
    }
    Engine.killChar(victim);
  },
  choices: [
    {
      text: "Panik mulai menyebar. Kau harus mengambil kendali.",
      next: 'ch3_aftermath',
      effect: (s) => {
        s.flags.tookControl = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Diam. Biarkan kengerian meresap. Lalu bergerak.",
      next: 'ch3_aftermath',
      effect: (s) => {
        s.flags.processedGrief = true;
      }
    }
  ]
},

'ch3_aftermath': {
  text: (s) => {
    let text = `<p><span class="speaker lana">Lana</span> Semua berkumpul di hall. Korban dipindahkan ke ruangan terpisah dan ditutup selimut.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Yang tersisa: `;

    let aliveNames = [];
    Engine.CHARACTERS.forEach(c => {
      if (s.alive[c]) aliveNames.push(Engine.CHAR_DISPLAY[c]);
    });
    text += aliveNames.join(', ') + '.</p>';

    text += `<p class="sound">— ${Engine.aliveCount()} orang. Dan setidaknya satu dari mereka adalah pembunuh. —</p>`;

    if (s.flags.allDoorsOpen) {
      text += `<p><span class="speaker lana">Lana</span> Pintu-pintu terbuka — tapi tanpa listrik, hutan di luar gelap total. Tidak ada jalan, tidak ada sinyal, tidak ada kendaraan yang bisa menyala (kunci elektronik mobil juga terpengaruh jammer).</p>`;
      text += `<p><span class="speaker juno">Juno</span> "Bebas tapi terjebak," . "Ironi yang indah."</p>`;
    }

    text += `<p><span class="speaker sera">Sera</span>: "Kita perlu memutuskan. Sekarang. Tidak ada waktu untuk berduka."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Dia benar. Countdown masih berjalan. Dan Sang Penenun sudah menjanjikan tiga kematian.</p>`;

    return text;
  },
  choices: [
    {
      text: "Presentasikan semua bukti yang kau kumpulkan — saatnya transparan",
      condition: (s) => s.cluesFound >= 5,
      next: 'ch4_start',
      effect: (s) => {
        s.flags.presentedEvidence = true;
        s.keyChoices.push('evidence_presentation');
      }
    },
    {
      text: "Voting — siapa yang paling dicurigai? Demokrasi dalam kegelapan.",
      next: 'ch4_start',
      effect: (s) => {
        s.flags.heldVoting = true;
        s.keyChoices.push('democratic_vote');
      }
    },
    {
      text: "Kabur ke hutan. Lebih baik kedinginan di luar daripada mati di dalam.",
      condition: (s) => s.flags.allDoorsOpen,
      next: 'ch3_forest_escape',
      effect: (s) => {
        s.flags.escapedToForest = true;
        Engine.modDanger(10);
      }
    },
    {
      text: "Tidak ada lagi rencana. Temukan Sang Penenun dan akhiri ini.",
      danger: true,
      next: 'ch4_start',
      effect: (s) => {
        s.flags.huntMode = true;
        Engine.modDanger(5);
        s.keyChoices.push('hunter_mode');
      }
    }
  ]
},

'ch3_forest_escape': {
  chapter: 3,
  text: (s) => {
    let text = `<p><span class="speaker sera">Sera</span> Kau berlari keluar. Udara malam menghantam — dingin, tajam, penuh bau pinus dan tanah basah.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Gelap. Gelap seperti dasar lautan. Ponselmu — satu persen baterai — memberikan cahaya selemah lilin.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Hutan pinus mengelilingi mansion seperti pagar hidup. Jalan masuk — jalan berbatu yang tadi kau lewati — ada di suatu tempat di kegelapan ini.</p>`;
    text += `<p><span class="speaker juno">Juno</span> ada bersamamu. "Kita jalan ke arah jalan utama. Pasti ada."</p>`;
    text += `<p class="sound">— Kalian berjalan. Lima menit. Sepuluh. Dua puluh. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> Pohon-pohon semua terlihat sama. Tanah di bawah kaki berubah — dari keras ke berlumpur. Kau kehilangan arah.</p>`;
    text += `<p class="sound">— Dan kemudian — suara. Di belakang kalian. Langkah kaki. Mengikuti. —</p>`;
    text += `<p class="sound">— Kau menoleh. Di antara pohon-pohon — siluet. Berdiri. Menunggu. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Kembali atau lanjut?" .</p>`;

    return text;
  },
  choices: [
    {
      text: "Lanjut ke hutan — pasti ada jalan keluar",
      next: 'ch3_forest_deeper',
      effect: (s) => {
        Engine.modDanger(15);
      }
    },
    {
      text: "Kembali ke mansion. Lebih baik devil you know.",
      next: 'ch4_start',
      effect: (s) => {
        s.flags.returnedFromForest = true;
        s.flags.forestFailed = true;
      }
    }
  ]
},

'ch3_forest_deeper': {
  text: `<p><span class="speaker juno">Juno</span> Kalian terus berjalan. Tapi hutan menjadi lebih tebal, lebih gelap. Dan langkah kaki di belakang — semakin dekat.</p>
<p><span class="speaker juno">Juno</span> Lalu kau melihatnya: pagar kawat setinggi tiga meter. Baru. Dipasang baru-baru ini. Melingkari seluruh area mansion seperti kandang.</p>
<p><span class="speaker juno">Juno</span> "Mereka memagar seluruh properti," . "Kita nggak bisa keluar bahkan kalau keluar dari mansion."</p>
<p><span class="speaker juno">Juno</span> Siluet di belakang kalian berhenti. Lalu berbalik. Tugas selesai — menggiring kalian ke pagar, membuktikan bahwa tidak ada jalan keluar.</p>
<p><span class="speaker juno">Juno</span> Juno menendang pagar. Kawat berdering.</p>
<p><span class="speaker juno">Juno</span> "Kembali," katamu. "Kita selesaikan ini di dalam."</p>`,
  shake: true,
  choices: [
    {
      text: "Kembali ke mansion dengan tekad baru",
      next: 'ch4_start',
      effect: (s) => {
        s.flags.returnedFromForest = true;
        s.flags.forestFailed = true;
        s.flags.sawFence = true;
        s.courage.arin += 10;
        Engine.modDanger(5);
        s.keyChoices.push('saw_fence');
      }
    }
  ]
}

};
