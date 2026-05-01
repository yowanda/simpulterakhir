/* ============================================================
   SIMPUL TERAKHIR — BAB 5: Wahyu
   Kebenaran terungkap. Identitas Sang Penenun terkuak.
   Motivasi di balik siklus simpul terbuka. Kematian kedua.
   ============================================================ */

const STORY_CH5 = {

'ch5_start': {
  chapter: 5,
  text: (s) => {
    let text = `<p class="sound">— Countdown: <strong>01:00:00</strong>. Satu jam sebelum fajar. Dan kebenaran — seperti fajar itu sendiri — mulai menyingsing melalui kegelapan. —</p>`;

    text += `<p><span class="speaker arin">Arin</span> Yang tersisa berkumpul di perpustakaan — ruangan paling aman yang bisa dibarricade dari dalam. Kau berdiri di tengah, bukti-bukti tersebar di meja panjang seperti peta operasi perang.</p>`;

    // Player-specific ch5 perspective
    const pc = s.playerCharacter || 'arin';
    if (pc === 'arin') {
      text += `<p><span class="speaker sera">Sera</span> Sera duduk di sebelahmu. Tidak ada lagi pretense profesional — tangannya menggenggam tanganmu di bawah meja, dan kau menggenggam balik. Kalau ini malam terakhir, setidaknya kalian tidak harus melewatinya sendiri.</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Arin." Suara Sera berbisik, hanya untukmu. "Apapun yang terjadi setelah ini — aku ingin kau tahu bahwa aku..." Dia berhenti. Psikolog yang bisa membaca jiwa semua orang tapi tidak bisa mengucapkan tiga kata kepada satu orang. "...aku akan ada di sini."</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker arin">Arin</span> Arin berdiri di tengah ruangan, menyusun bukti. Kau duduk di sebelahnya — dan tanganmu menggenggam tangannya di bawah meja. Bukan sebagai kolega. Bukan sebagai psikolog. Sebagai seseorang yang akhirnya berhenti menganalisis perasaannya dan hanya membiarkannya ada.</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Arin," bisikmu. "Apapun yang terjadi setelah ini—" Kau berhenti. Kau yang selalu bisa membaca jiwa orang — tidak bisa mengucapkan tiga kata kepada satu orang. "...aku akan ada di sini."</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker vira">Vira</span> Kau duduk di sudut. Kepala di tangan. Dalang yang topengnya hancur. Semua ini — mansion, undangan, permainan — tanggung jawabmu. Dan Vira berjalan ke arahmu.</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Niko." Suaranya lembut. Kau mendongak. "Aku minta maaf," bisikmu. "Atas semuanya." Dia tidak menjawab. Tapi dia duduk di sampingmu. Dan itu — momen kecil itu — lebih berarti dari semua rencana besar yang pernah kau buat.</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker reza">Reza</span> Reza mengeluarkan flask-nya. Tangannya gemetar. Lo ambil flask itu — pelan, tegas. "Nggak sekarang." Dia menatapmu. Dan lo menatap balik. Dua orang rusak yang entah gimana menemukan sesuatu yang utuh di satu sama lain.</p>`;
    } else if (pc === 'reza') {
      text += `<p><span class="speaker juno">Juno</span> Tanganmu gemetar. Flask di saku terasa seperti magnet. Juno mengambilnya dari tanganmu — pelan tapi tidak bisa dilawan. "Nggak sekarang." Dan kau membiarkannya. Karena suara Juno adalah satu-satunya hal yang lebih kuat dari panggilan alkohol malam ini.</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker juno">Juno</span> Kau duduk di sudut, mengamati. Operator yang mulai meragukan operasinya. Mereka berkumpul di sini, menggenggam tangan satu sama lain, mencari kenyamanan di kegelapan. Dan kau — kau seharusnya menjadi bagian dari kegelapan itu. Tapi entah kenapa, malam ini, kau ingin menjadi cahaya.</p>`;
    } else if (pc === 'vira') {
      text += `<p><span class="speaker niko">Niko</span> Kau berjalan ke arah Niko. Pelan. Seperti mendekati binatang yang terluka — karena memang itu yang dia sekarang. "Niko." Dia mendongak. Dan di matanya, kau melihat sesuatu yang belum pernah kau lihat: kejujuran. "Aku minta maaf," bisiknya. Kau tidak menjawab. Tapi kau duduk di sampingnya.</p>`;
    } else {
      text += `<p><span class="speaker arin">Arin</span> Di sekeliling ruangan, drama-drama kecil bermain: Sera dan Arin duduk berdekatan, tangan bertemu di bawah meja. Niko dan Vira dalam percakapan bisik yang penuh sejarah. Juno mengambil flask dari tangan Reza yang gemetar.</p>`;
    }
    if (pc !== 'niko' && pc !== 'vira') {
      text += `<p>Di sudut ruangan: <span class="speaker niko">Niko</span> duduk sendirian, kepala di tangan. <span class="speaker vira">Vira</span> berjalan ke arahnya — pelan, lembut. "Aku minta maaf," bisik Niko. Vira tidak menjawab. Tapi dia duduk di sampingnya.</p>`;
    }
    if (pc !== 'reza' && pc !== 'juno') {
      text += `<p><span class="speaker reza">Reza</span> mengeluarkan flask-nya. <span class="speaker juno">Juno</span> mengambilnya — pelan, tegas. "Nggak sekarang." Dua orang rusak yang mulai menyembuhkan satu sama lain.</p>`;
    }

    let evidenceList = [];
    if (s.flags.hasProtocol || s.flags.hasProtocolPhotos) evidenceList.push('Protokol Simpul');
    if (s.flags.hasJournal) evidenceList.push('Jurnal Hendarto Wardhana');
    if (s.flags.hasManuscript) evidenceList.push('Manuscript Lana');
    if (s.flags.hasWalkieRecording) evidenceList.push('Rekaman walkie-talkie');
    if (s.flags.hasInsuranceDrive) evidenceList.push('Flash drive Polis Asuransi');
    if (s.flags.foundStalkerPhotos) evidenceList.push('Foto-foto stalker Arin');
    if (s.items.includes('shrine_photos')) evidenceList.push('Foto shrine korban');

    if (evidenceList.length > 0) {
      text += `<p class="sound">— Bukti yang terkumpul: —</p><ul>`;
      evidenceList.forEach(e => text += `<li>${e}</li>`);
      text += `</ul>`;
    }

    text += `<p><span class="speaker reza">Reza</span> "Saatnya membuka semuanya," katamu.</p>`;

    return text;
  },
  choices: [
    {
      text: "Presentasikan bukti secara sistematis — bangun kasus",
      next: 'ch5_build_case',
      effect: (s) => {
        s.flags.builtCase = true;
      }
    },
    {
      text: "Langsung konfrontasi — tunjuk tersangka dan paksa reaksi",
      next: 'ch5_direct_accusation',
      effect: (s) => {
        s.flags.directAccusation = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch5_build_case': {
  text: (s) => {
    let text = `<p><span class="speaker reza">Reza</span> "Fifty tahun lalu, Hendarto Wardhana dan seorang partner membangun mansion ini. Bukan sebagai rumah — sebagai <em>arena</em>."</p>`;
    text += `<p><span class="speaker reza">Reza</span> "Setiap tahun, mereka mengundang target. Memecah mereka. Dan memastikan beberapa dari mereka tidak pernah kembali. Satu orang selalu dibiarkan selamat — 'Saksi Selamat' — yang ceritanya tidak dipercaya siapapun."</p>`;
    text += `<p><span class="speaker reza">Reza</span> "Hendarto mati setahun lalu. Tapi Sang Penenun — partner-nya — terus beroperasi. Malam ini, dia merekrut operator baru."</p>`;

    if (s.difficulty === 1) {
      text += `<p><span class="speaker reza">Reza</span> "Satu operator. Satu orang di antara kita yang bekerja untuk Sang Penenun."</p>`;
      text += `<p class="sound">— Kau menatap ruangan. Setiap wajah. —</p>`;
      text += `<p>"<span class="speaker lana">Lana Kusuma</span>."</p>`;
      text += `<p><span class="speaker lana">Lana</span> Lana tidak bergerak. Matanya — gelap, sabar — menatapmu balik.</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Novelis horor yang menulis skenario malam ini SEBELUM datang. Yang tahu setiap sudut mansion. Yang 'penelitian' untuk novelnya membawanya ke sini — tapi penelitian itu adalah BRIEFING."</p>`;
    } else if (s.difficulty === 2) {
      text += `<p><span class="speaker lana">Lana</span> "Dua operator. 'Penulis' dan 'Pemotong'. Orang yang menulis skenario dan orang yang menjalankannya."</p>`;
      text += `<p>"<span class="speaker lana">Lana</span> — Penulis. <span class="speaker dimas">Dimas</span> — Pemotong."</p>`;
      text += `<p><span class="speaker lana">Lana</span> Lana tersenyum tipis. Dimas — kalau dia ada di ruangan — tidak bereaksi.</p>`;
    } else {
      text += `<p><span class="speaker lana">Lana</span> "Tiga orang. Konspirasi lengkap. Penulis, Pemotong, dan..."</p>`;
      text += `<p>Kau menatap <span class="speaker niko">Niko</span>.</p>`;
      text += `<p><span class="speaker niko">Niko</span> "...dan Pewaris."</p>`;
      text += `<p><span class="speaker arin">Arin</span> Niko pucat. "Arin, aku bisa—"</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Kau memberikan akses. Kau mengundang target yang Lana minta. Kau TAHU."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Tunggu reaksi mereka — biarkan kebenaran bekerja",
      next: 'ch5_revelation',
      effect: (s) => {
        s.flags.waitedForReaction = true;
      }
    },
    {
      text: '"Tapi ada satu pertanyaan yang belum terjawab: SIAPA Sang Penenun yang sebenarnya?"',
      next: 'ch5_penenun_identity',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
      }
    }
  ]
},

'ch5_direct_accusation': {
  text: (s) => {
    let text = '';

    if (s.difficulty === 1) {
      text += `<p><span class="speaker lana">Lana</span> "Lana." Satu kata. Seperti peluru.</p>`;
      text += `<p><span class="speaker lana">Lana</span> berdiri dari kursinya. Pelan. Dengan keanggunan yang tidak seharusnya dimiliki orang yang baru saja dituduh.</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Akhirnya," katanya. "Aku mulai bosan menunggu."</p>`;
    } else if (s.difficulty === 2) {
      text += `<p><span class="speaker lana">Lana</span> "Lana dan Dimas. Kalian berdua."</p>`;
      text += `<p><span class="speaker lana">Lana</span> bertepuk tangan — tiga kali, pelan, sarkastis.</p>`;
      text += `<p><span class="speaker arin">Arin</span> "Briliant, Arin. Tapi incomplete. Kau tahu siapa kami. Kau tidak tahu KENAPA."</p>`;
      if (s.alive.dimas) {
        text += `<p><span class="speaker dimas">Dimas</span>: "Dan kau tidak tahu apa yang terjadi kalau kau salah."</p>`;
      }
    } else {
      text += `<p><span class="speaker niko">Niko</span> "Lana. Dimas. Dan..." kau menoleh ke Niko, "...Niko."</p>`;
      text += `<p><span class="speaker niko">Niko</span> Gasps. Bisikan. Juno mundur selangkah dari Niko.</p>`;
      text += `<p><span class="speaker niko">Niko</span>: "Itu tidak fair—"</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Fair? Kau mengundang kami ke rumah pembunuhan. FAIR?"</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Tuntut penjelasan — kenapa?",
      next: 'ch5_revelation',
      effect: (s) => {
        s.flags.demandedExplanation = true;
      }
    }
  ]
},

'ch5_revelation': {
  chapter: 5,
  text: (s) => {
    let text = `<p class="sound">— Dan kemudian — Wahyu. Kebenaran yang lebih gelap dari yang kau bayangkan. —</p>`;

    text += `<p><span class="speaker lana">Lana</span> bicara. Bukan dengan suara penjahat — tapi dengan suara seseorang yang sudah menanggung terlalu lama.</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Kau mau tahu siapa Sang Penenun, Arin? Sang Penenun bukan orang. Sang Penenun adalah <em>sistem</em>."</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Selama 50 tahun, keluarga-keluarga kaya membiayai 'simpul' ini. Bukan hobi — bisnis. Setiap tamu yang 'terputus' adalah loose end dari transaksi gelap mereka. Whistle-blower potensial. Saksi. Aktivis. Jurnalis."</p>`;
    text += `<p class="sound">— Kau merasakan darah mengalir dingin. —</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Aku — ya, aku operator. Tapi bukan karena pilihan. Kakak laki-lakiku adalah 'Saksi Selamat' tujuh tahun lalu. Dia bercerita. Tidak ada yang percaya. Dia bunuh diri setahun kemudian."</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Aku masuk ke dalam sistem untuk menghancurkannya dari dalam. Aku menulis 'skenario' malam ini — tapi skenario yang SENGAJA cacat. Agar tamu selamat. Agar ada cukup bukti untuk membawa ini ke publik."</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker dimas">Dimas</span>: "Dan aku dokter forensik yang ditugaskan untuk cleanup. Tapi Lana merekrut aku — untuk mengubah operasi ini menjadi dokumentasi. Bukan pembunuh — ` + (s.difficulty >= 2 ? 'pengumpul bukti.' : '') + `"</p>`;
      if (s.difficulty === 2) text += `<p class="sound">— Tapi sebelum kau bisa memproses ini, ada suara. Dari luar perpustakaan. —</p>`;
    }

    if (s.difficulty === 3) {
      text += `<p><span class="speaker niko">Niko</span>: "Dan aku pewaris mansion. Aku memberi akses karena Lana menjanjikan ini akan jadi yang TERAKHIR. Mengungkap segalanya. Menghancurkan siklus."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Tapi ada yang membajak malam ini," . "Seseorang yang INGIN siklus berlanjut. Seseorang yang diuntungkan oleh kelangsungan sistem."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Siapa?"</p>`;
      text += `<p><span class="speaker lana">Lana</span> Lana: "Itu pertanyaan yang sedang aku cari jawabannya saat kau menuduhku."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: '"Kalau Lana dan Dimas bukan musuh... siapa yang sebenarnya membunuh malam ini?"',
      next: 'ch5_penenun_identity',
      effect: (s) => {
        s.flags.questionedKillerIdentity = true;
      }
    },
    {
      text: '"Aku tidak percaya. Ini bisa jadi lapisan manipulasi lain."',
      next: 'ch5_doubt',
      effect: (s) => {
        s.flags.doubtedRevelation = true;
        Engine.modDanger(5);
      }
    }
  ]
},

'ch5_doubt': {
  text: (s) => {
    let text = `<p><span class="speaker sera">Sera</span> mendukungmu: "Profil narcissistic manipulator — mereka bisa membuat diri mereka terlihat sebagai korban. Classic DARVO: Deny, Attack, Reverse Victim and Offender."</p>`;
    text += `<p><span class="speaker lana">Lana</span>: "Sera, aku mengerti skeptisisme-mu. Tapi tanyakan ini: kalau aku pembunuh, kenapa aku belum membunuh Arin? Dia ancaman terbesarku. Aku punya kesempatan sepanjang malam."</p>`;
    text += `<p class="sound">— Poin yang valid. —</p>`;

    if (s.flags.knowsArinIsPlanned) {
      text += `<p class="sound">— Tapi kau tahu jawabannya — "Karena aku direncanakan jadi Saksi Selamat." —</p>`;
      text += `<p><span class="speaker lana">Lana</span> "TEPAT," . "Oleh SISTEM. Bukan olehku. Aku yang menulis skenario di mana kau selamat — tapi bukan untuk menggunakanmu. Untuk melindungimu."</p>`;
    }

    text += `<p class="sound">— Sebelum debat berlanjut — lampu berkedip. Speaker menyala. —</p>`;
    text += `<p class="journal"><em>"Pembongkaran demi pembongkaran. Menarik. Tapi kebenaran yang paling menyakitkan belum terungkap. Periksa ponsel masing-masing. Sekarang."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Cek ponsel — apa yang Sang Penenun kirim?",
      next: 'ch5_penenun_identity',
      effect: (s) => {
        s.flags.checkedPhones = true;
      }
    }
  ]
},

'ch5_penenun_identity': {
  chapter: 5,
  text: (s) => {
    let text = `<p class="sound">— Identitas Sang Penenun. —</p>`;

    if (s.flags.checkedPhones) {
      text += `<p><span class="speaker lana">Lana</span> Setiap ponsel menyala — meskipun seharusnya tidak ada sinyal. Pesan yang sama di setiap layar:</p>`;
      text += `<p class="journal"><em>"Sang Penenun bukan satu orang. Sang Penenun adalah setiap orang yang pernah memilih diam. Termasuk di antara kalian — seseorang yang TAHU tentang siklus ini dan tidak pernah bicara."</em></p>`;
    }

    text += `<p><span class="speaker vira">Vira</span> berdiri. Untuk pertama kalinya malam ini, dia terlihat — bukan ketakutan, bukan misterius — tapi <em>marah</em>.</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Aku tahu siapa Sang Penenun."</p>`;
    text += `<p class="sound">— Semua menoleh. —</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Aku pernah ada di sini. Enam bulan lalu. Aku 'Saksi Selamat' tahun lalu. Dan aku KEMBALI — bukan karena undangan Niko. Tapi karena Sang Penenun mengancam akan membunuh adikku kalau aku tidak datang."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Sang Penenun menghubungiku. Telepon. Email. Surat. Selalu dari identitas berbeda. Tapi aku melacak satu hal yang konsisten: setiap pesan dikirim dari jaringan yang sama. Jaringan ini. Mansion ini."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Sang Penenun tidak pernah meninggalkan mansion. Dia TINGGAL di sini."</p>`;

    text += `<p class="sound">— Hening yang mematikan. —</p>`;

    text += `<p><span class="speaker niko">Niko</span> "Dan malam ini, aku datang untuk menemukan ruangan tempat dia hidup. Ruangan yang tidak ada di blueprint manapun. Di bawah B-2."</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: '"Bawa aku ke sana. Sekarang."',
      next: 'ch5_penenun_lair',
      effect: (s) => {
        s.flags.goingToLair = true;
        Engine.modDanger(15);
        s.courage.arin += 20;
      }
    },
    {
      text: '"Vira, kenapa kau tidak bilang dari awal?"',
      next: 'ch5_vira_explanation',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', -5);
      }
    }
  ]
},

'ch5_vira_explanation': {
  text: `<p><span class="speaker vira">Vira</span>: "Karena adikku. Sang Penenun punya orang di luar. Kalau aku bicara, adikku mati. Simple."</p>
<p><span class="speaker vira">Vira</span> "Tapi sekarang — setelah melihat apa yang terjadi malam ini — aku sadar bahwa diam bukan melindungi. Diam adalah berpartisipasi."</p>
<p><span class="speaker lana">Lana</span> "Dan karena..." matanya berkaca-kaca, "...karena orang terakhir yang diam — kakak Lana — berakhir menggantung dirinya. Aku tidak mau menjadi cerita yang sama."</p>
<p><span class="speaker sera">Sera</span> Sera mendekat. "Vira, kapan terakhir kali adikmu menghubungimu?"</p>
<p><span class="speaker sera">Sera</span> "Dua jam lalu. Sebelum sinyal dipotong. Dia aman — untuk sekarang."</p>
<p><span class="speaker arin">Arin</span> "Maka kita punya waktu." Sera menatapmu. "Arin?"</p>`,
  choices: [
    {
      text: '"Ayo ke sarang Sang Penenun. Akhiri ini."',
      next: 'ch5_penenun_lair',
      effect: (s) => {
        s.flags.goingToLair = true;
        Engine.modTrust('arin', 'vira', 10);
        Engine.modDanger(15);
      }
    }
  ]
},

'ch5_penenun_lair': {
  text: (s) => {
    let text = `<p><span class="speaker vira">Vira</span> B-2 — ruang server. Tapi Vira menunjukkan sesuatu yang kau lewatkan: panel di lantai, di bawah rak server terakhir. Trap door.</p>`;
    text += `<p class="sound">— Tangga menurun ke B-3 — level yang tidak ada di blueprint manapun. —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Udara berubah. Lebih lembap. Lebih tua. Bau tanah dan sesuatu yang manis — terlalu manis.</p>`;
    text += `<p class="sound">— Dan kemudian: ruangan. —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Bukan bunker. Bukan penjara bawah tanah. Ini <em>apartemen</em>. Lengkap. Tempat tidur, dapur kecil, rak buku, workstation dengan enam monitor.</p>`;
    text += `<p class="sound">— Seseorang telah TINGGAL di sini. Bertahun-tahun. —</p>`;

    text += `<p><span class="speaker vira">Vira</span> Di monitor: feed dari seluruh mansion. Dari LUAR mansion. Kamera-kamera yang memonitor jalan masuk, hutan, bahkan kota terdekat. Sistem pengawasan yang membuat NSA terlihat amatir.</p>`;

    text += `<p><span class="speaker vira">Vira</span> Dan di dinding — foto besar. Dua pria muda. Hendarto Wardhana dan pria lain. Di bawah foto: "HW & RP — 1971. Simpul Pertama."</p>`;
    text += `<p class="sound">— RP. —</p>`;

    if (s.flags.hasJournal) {
      text += `<p><span class="speaker vira">Vira</span> Jurnal Hendarto menyebutkan partner-nya. Tapi tidak pernah menyebut nama. Hanya "Sang Penenun".</p>`;
    }

    text += `<p><span class="speaker vira">Vira</span>: "RP. Ragil Pramudya. Dia seharusnya sudah mati dua puluh tahun lalu. Kecelakaan mobil. Tapi..."</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Tapi dia memalsukan kematiannya dan tinggal di bawah mansion," kau menyelesaikan.</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Pria tua yang hidup di bawah tanah, menenun simpul-simpul kematian selama lima dekade."</p>`;

    text += `<p><span class="speaker vira">Vira</span> Dan kemudian — suara dari balik pintu di ujung ruangan. Pelan. Langkah kaki yang diseret. Seseorang yang sudah sangat tua.</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: "Hadapi dia. Akhiri ini malam ini.",
      next: 'ch5_meet_penenun',
      effect: (s) => {
        s.flags.facedPenenun = true;
        s.keyChoices.push('faced_penenun');
      }
    },
    {
      text: "Ambil semua bukti digital dari monitor dan LARI ke atas",
      next: 'ch5_grab_evidence_run',
      effect: (s) => {
        s.flags.grabbedDigitalEvidence = true;
        s.items.push('digital_evidence');
        s.cluesFound += 5;
      }
    }
  ]
},

'ch5_meet_penenun': {
  text: (s) => {
    let text = `<p class="sound">— Pintu terbuka. —</p>`;
    text += `<p class="sound">— Dan di sana — bukan monster. Bukan iblis. Hanya seorang pria tua. —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Ragil Pramudya. Atau apa yang tersisa darinya. Tujuh puluhan, kurus, membungkuk, dengan mata yang masih tajam di balik kerutan. Kursi roda. Selang oksigen.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Dia tersenyum. "Akhirnya," katanya. Suaranya — suara yang tadi ada di speaker, tanpa filter elektronik — serak dan tipis seperti kertas tua.</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Kau tahu berapa lama aku menunggu seseorang yang cukup pintar untuk sampai ke sini? 48 tahun. 48 siklus. Dan akhirnya — Arin Prasetya. Podcaster yang tidak bisa berhenti menggali."</p>`;

    text += `<p><span class="speaker arin">Arin</span> "Kenapa?" tanyamu. Pertanyaan paling sederhana dan paling penting.</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Kenapa? Karena dunia ini penuh benang-benang yang kusut. Orang-orang yang seharusnya tidak ada. Kekacauan yang tidak ada solusinya. Dan seseorang harus merapikan. Seseorang harus menenun."</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Kau membunuh orang."</p>`;
    text += `<p><span class="speaker arin">Arin</span> "Aku MERAPIKAN. Setiap simpul yang terputus membuat dunia sedikit lebih rapi. Sedikit lebih mudah dikendalikan. Dan sekarang..."</p>`;
    text += `<p class="sound">— Dia menatapmu. —</p>`;
    text += `<p><span class="speaker arin">Arin</span> "...simpul terakhir."</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: '"Tidak. Ini simpul terakhir BAGIMU. Aku yang akan mengakhiri ini."',
      next: 'ch5_second_death',
      effect: (s) => {
        s.flags.confrontedPenenun = true;
        s.courage.arin += 20;
        s.keyChoices.push('confronted_penenun');
      }
    },
    {
      text: "Dengarkan dia. Mungkin ada informasi yang bisa menyelamatkan nyawa.",
      next: 'ch5_listen_penenun',
      effect: (s) => {
        s.flags.listenedToPenenun = true;
        Engine.modAwareness('arin', 15);
      }
    }
  ]
},

'ch5_listen_penenun': {
  text: `<p><span class="speaker arin">Arin</span> "Kau mau dengarkan?" Ragil terlihat genuinely terkejut. "Tidak ada yang pernah mau mendengarkan."</p>
<p><span class="speaker arin">Arin</span> "Hendarto — dia partner-ku. Tapi dia lemah. Selalu lemah. Aku yang merancang semuanya. Mansion. Sistem. Simpul. Dan setiap tahun, aku menyaksikan dari bawah sini."</p>
<p><span class="speaker lana">Lana</span> "Tapi tahun ini berbeda. Lana — gadis itu — dia datang dengan agenda sendiri. Skenario yang SENGAJA cacat. Dia pikir bisa menghancurkan sistem dari dalam."</p>
<p class="sound">— Dia tertawa — suara yang mengerikan. —</p>
<p><span class="speaker lana">Lana</span> "Jadi aku improvisasi. Membajak skenarionya. Menambahkan... variabel. Dan hasilnya — kau. Di sini. Di depanku."</p>
<p><span class="speaker arin">Arin</span> "Tapi ada satu hal yang kau perlu tahu, Arin: aku sudah sekarat. Kanker. Enam bulan, kata dokter — tapi itu sudah delapan bulan lalu. Malam ini memang simpul yang terakhir. Bagiku, setidaknya."</p>
<p><span class="speaker arin">Arin</span> "Tapi sistem... sistem akan bertahan. Karena ada pewaris. Ada selalu pewaris."</p>`,
  choices: [
    {
      text: '"Siapa pewarismu?"',
      next: 'ch5_second_death',
      effect: (s) => {
        s.flags.askedAboutHeir = true;
        Engine.modAwareness('arin', 20);
      }
    }
  ]
},

'ch5_grab_evidence_run': {
  text: `<p><span class="speaker arin">Arin</span> Kau mengambil hard drive dari workstation. Menarik kabel. Monitor mati satu per satu.</p>
<p><span class="speaker arin">Arin</span> Di belakangmu, suara langkah dari ruangan sebelah. Sang Penenun tahu ada yang masuk.</p>
<p><span class="speaker vira">Vira</span> "LARI!" .</p>
<p><span class="speaker vira">Vira</span> Kalian berlari ke tangga — naik ke B-2, ke B-1, ke lantai satu. Napas memburu, kaki berdentam di batu.</p>
<p><span class="speaker vira">Vira</span> Di belakang, suara alarm. Berbeda dari sebelumnya — lebih intens, lebih mendesak.</p>
<p class="sound">— Speaker: "Protokol darurat aktif. Lockdown total dalam 60 detik." —</p>`,
  shake: true,
  choices: [
    {
      text: "Sampai ke lantai satu tepat waktu!",
      next: 'ch5_second_death',
      effect: (s) => {
        s.flags.escapedLair = true;
        s.keyChoices.push('escaped_lair');
      }
    }
  ]
},

'ch5_second_death': {
  chapter: 5,
  text: (s) => {
    let text = `<p class="sound">— Kematian kedua datang tanpa peringatan — tapi bukan tanpa alasan. —</p>`;

    // Determine second death
    let victim2 = 'sera';
    if (s.flags.seraAlliance && s.alive.juno && !s.flags.warnedJunoFromBasement) {
      victim2 = 'juno';
    } else if (s.alive.farah && !s.flags.savedFarahDrink) {
      victim2 = 'farah';
    } else if (s.alive.niko && s.difficulty === 3 && s.flags.nikoTruthRevealed) {
      victim2 = 'niko'; // Niko silenced by real Penenun
    }

    if (victim2 === 'sera') {
      text += `<p><span class="speaker sera">Sera</span>.</p>`;
      text += `<p><span class="speaker sera">Sera</span> Ditemukan di tangga antara lantai dua dan tiga. Jatuh — atau didorong. Lehernya pada sudut yang tidak alami.</p>`;
      text += `<p><span class="speaker vira">Vira</span> "Sera selalu terlalu dekat dengan kebenaran," . "Profil psikologis yang dia bangun — terlalu akurat. Sang Penenun merasa terancam."</p>`;
      text += `<p><span class="speaker vira">Vira</span> Psikolog yang memahami pembunuh terlalu baik — dibunuh sebelum pemahaman itu bisa menyelamatkan siapapun.</p>`;
    } else if (victim2 === 'juno') {
      text += `<p><span class="speaker juno">Juno</span>.</p>`;
      text += `<p><span class="speaker juno">Juno</span> Ditemukan di koridor timur — tempat dia mencoba membuka jendela tadi. Kali ini, dia berhasil meretakkan kaca. Tapi kaca yang retak itu menjadi senjata — pecahan yang tajam, tepat di tempat yang salah.</p>`;
      text += `<p class="sound">— Kecelakaan? Atau dirancang agar terlihat seperti kecelakaan? —</p>`;
      text += `<p><span class="speaker juno">Juno</span> Street artist yang tidak pernah menyerah — berhenti di depan kebebasan yang tidak pernah sampai.</p>`;
    } else if (victim2 === 'farah') {
      text += `<p><span class="speaker farah">Farah</span> — yang sebelumnya dalam kondisi kritis — akhirnya menyerah. Racun yang terlalu lama di tubuhnya tanpa penanganan medis yang memadai.</p>`;
      text += `<p><span class="speaker farah">Farah</span> Pewaris keluarga Aldridge. Orang terkaya di ruangan ini. Tapi uang tidak bisa membeli antidotum yang tidak ada.</p>`;
    } else {
      text += `<p><span class="speaker niko">Niko</span>.</p>`;
      text += `<p><span class="speaker niko">Niko</span> Ditemukan di ruang kerjanya sendiri — ruang kerja kakeknya — dengan ekspresi terkejut yang membeku. Dia mencari sesuatu di laci meja saat diserang dari belakang.</p>`;
      text += `<p><span class="speaker niko">Niko</span> Pewaris Wardhana. Dibunuh di rumah warisannya sendiri. Oleh sistem yang berusaha dia hancurkan.</p>`;
    }

    text += `<p class="sound">— Speaker: "Simpul kedua... terputus." —</p>`;
    text += `<p class="sound">— ${Engine.aliveCount() - 1} orang tersisa. Dan malam belum berakhir. —</p>`;

    return text;
  },
  blood: true,
  shake: true,
  glitch: true,
  onEnter: (s) => {
    let victim2 = 'sera';
    if (s.flags.seraAlliance && s.alive.juno && !s.flags.warnedJunoFromBasement) victim2 = 'juno';
    else if (s.alive.farah && !s.flags.savedFarahDrink) victim2 = 'farah';
    else if (s.alive.niko && s.difficulty === 3 && s.flags.nikoTruthRevealed) victim2 = 'niko';
    Engine.killChar(victim2);
  },
  choices: [
    {
      text: "Cukup melihat orang mati. Waktunya mengakhiri ini.",
      next: 'ch6_start',
      effect: (s) => {
        s.flags.readyForConfrontation = true;
        s.courage.arin += 15;
      }
    },
    {
      text: "Semua keluar dari mansion — sekarang, apapun risikonya",
      next: 'ch5_mass_exit',
      effect: (s) => {
        s.flags.massExitAttempt = true;
      }
    }
  ]
},

'ch5_mass_exit': {
  text: (s) => {
    let text = `<p class="sound">— Semua bergerak ke pintu — tapi pintu mana? —</p>`;

    if (s.flags.hasMasterKey) {
      text += `<p class="sound">— Kau punya kunci master. Satu kesempatan. —</p>`;
      text += `<p><span class="speaker niko">Niko</span> Tapi kau teringat: kunci ini hanya bisa digunakan SEKALI. Dan di luar sana — pagar kawat. Kau sudah melihatnya.</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> Sang Penenun — Ragil — sudah tua dan sekarat. Tapi sistemnya masih aktif. Dan operator-operatornya...</p>`;
    text += `<p>"Keluar sekarang berarti Sang Penenun menang," kata <span class="speaker lana">Lana</span>. "Bukti-bukti tetap di mansion. Sistem tetap berjalan. Dan tahun depan, ada siklus baru."</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Siapa peduli tahun depan? Aku mau HIDUP malam ini!"</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Kalau kita tidak menghancurkan sistem malam ini,"  pelan, "maka semua yang mati malam ini — mati sia-sia."</p>`;

    return text;
  },
  choices: [
    {
      text: "Lana benar. Kita selesaikan ini malam ini.",
      next: 'ch6_start',
      effect: (s) => {
        s.flags.stayedToFight = true;
        s.moralScore += 10;
        s.courage.arin += 10;
      }
    },
    {
      text: "Nyawa lebih penting dari prinsip. KELUAR.",
      next: 'ending_incomplete_escape',
      effect: (s) => {
        s.flags.leftBeforeFinishing = true;
        s.moralScore -= 10;
      }
    }
  ]
},

'ending_incomplete_escape': {
  chapter: 5,
  isEnding: true,
  endingNumber: 19,
  title: 'Pelarian Tanpa Akhir',
  rating: 'C',
  endingText: (s) => {
    return `<p><span class="speaker lana">Lana</span> Kalian berhasil keluar — melalui jendela yang pecah, melalui hutan, melalui pagar kawat yang kalian panjat dengan tangan berdarah.</p>
<p><span class="speaker lana">Lana</span> Fajar menyingsing saat kalian sampai di jalan utama. Mobil truk pengangkut kayu berhenti. Kalian dibawa ke kota terdekat.</p>
<p><span class="speaker lana">Lana</span> Polisi datang ke mansion. Tapi saat mereka masuk — kosong. Bersih. Tidak ada bukti kematian. Tidak ada B-3. Tidak ada shrine. Seolah segalanya tidak pernah terjadi.</p>
<p><span class="speaker arin">Arin</span> Arin mempublikasikan podcast tentang malam itu. Viral. Tapi — seperti yang Lana prediksi — tidak ada yang percaya. "Creepypasta terbaik tahun ini," tulis reviewer.</p>
<p><span class="speaker arin">Arin</span> Siklus berlanjut. Tapi sekarang kau tahu. Dan mengetahui tanpa bisa bertindak — itu hukuman yang lebih buruk dari kematian.</p>`;
  },
  fates: {
    arin: 'Hidup — tapi dihantui kebenaran yang tidak dipercaya siapapun'
  }
}

};
