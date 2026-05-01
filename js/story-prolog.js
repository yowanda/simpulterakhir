/* ============================================================
   SIMPUL TERAKHIR — PROLOG: Undangan
   Dialog-focused rewrite. Cerita dibangun lewat percakapan.
   ============================================================ */

const STORY_PROLOG = {

'prologue_start': {
  chapter: 0,
  text: (s) => {
    const pc = s.playerCharacter || 'arin';
    const pcName = Engine.CHAR_DISPLAY[pc] || 'Arya';
    let text = '';
    text += `<p class="journal"><em>"Kau diundang untuk menyaksikan kebenaran. Mansion Wardhana, Sabtu, 21:00. Datang sendirian. Jangan beritahu siapapun."</em></p>`;

    // Character-specific arrival — as inner monolog / self-chat
    const perspective = Engine.getPlayerPerspective();
    if (pc === 'arin') {
      text += `<p><span class="speaker arin">Arya</span> "Jalan ini... gelap banget. Sinyal udah hilang dari tadi."</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker niko">Niko</span> "Semua sudah siap. Tamu-tamu mulai datang. Malam ini... kotak Pandora terbuka."</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker sera">Sera</span> "Undangan ini aneh. Siapa yang mengundang sepuluh orang asing ke mansion terpencil? Dan kenapa aku termasuk?"</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker juno">Juno</span> "Gue hampir nggak datang. Tapi undangan itu... ada sesuatu yang bikin gue nggak bisa tidur."</p>`;
    } else if (pc === 'vira') {
      text += `<p><span class="speaker vira">Vira</span> "Aku kembali. Bukan karena mau — tapi karena dia mengancam adikku."</p>`;
    } else if (pc === 'reza') {
      text += `<p><span class="speaker reza">Reza</span> "Dua puluh tahun jadi detektif. Kasus ini yang tidak pernah selesai. Sekarang undangan ini menarikku kembali."</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker lana">Lana</span> "Skenario berjalan sempurna. Sepuluh karakter, satu mansion, satu malam. Dan peranku bukan sebagai tamu."</p>`;
      text += `<p class="journal"><em>[Kau tahu kebenaran: kau bekerja untuk Sang Penenun.]</em></p>`;
    } else if (pc === 'dimas') {
      text += `<p><span class="speaker dimas">Dimas</span> "Lana yang memimpin. Selalu. Malam ini ada pekerjaan. Dia menyebutnya 'seni'."</p>`;
      if (s.difficulty >= 2) {
        text += `<p class="journal"><em>[Kau adalah operator Sang Penenun. "Pemotong."]</em></p>`;
      }
    } else if (pc === 'kira') {
      text += `<p><span class="speaker kira">Kai</span> "QR code tersembunyi di watermark amplop. Server di Estonia, di-route melalui tiga proxy. Pengirim ini bukan amatir."</p>`;
    } else if (pc === 'farah') {
      text += `<p><span class="speaker farah">Farah</span> "Mansion yang dibangun dengan uang keluarga Aldridge. Uang kakekku. Dan rahasia di bawah fondasinya..."</p>`;
    }

    if (pc === 'niko') {
      text += `<p><span class="speaker niko">Niko</span> "Arya! Kau datang. Aku tahu kau tidak bisa menolak misteri."</p>`;
    } else {
      text += `<p><span class="speaker niko">Niko</span> berdiri di tangga depan mansion, senyumnya cerah seperti iklan — terlalu cerah untuk tempat segelap ini.</p>`;
      if (pc === 'arin') {
        text += `<p><span class="speaker niko">Niko</span> "Arya! Kau datang. Aku tahu kau tidak bisa menolak misteri."</p>`;
      } else {
        text += `<p><span class="speaker niko">Niko</span> "${pcName}! Senang kau datang. Masuk, yang lain sudah menunggu."</p>`;
      }
    }

    // Player-specific inner thought
    text += `<p class="journal"><em>${perspective.openingThought}</em></p>`;

    return text;
  },
  choices: [
    {
      text: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'arin') return '"Niko, kau yang kirim amplop hitam itu?"';
        if (pc === 'sera') return '"Menarik — micro-expression Niko menunjukkan dia menyembunyikan sesuatu."';
        if (pc === 'juno') return '"Gue nggak suka basa-basi. Siapa yang ngundang kita?"';
        if (pc === 'reza') return '"Dua puluh tahun pengalaman bilang ini jebakan. Tapi justru itu yang membuatmu masuk."';
        if (pc === 'lana') return '"Persis seperti skenario. Waktunya masuk ke karakter."';
        if (pc === 'kira') return '"WiFi mansion ini... ada yang aneh. Lo perlu scan lebih dalam."';
        return '"Siapa yang mengirim undangan ini sebenarnya?"';
      },
      hint: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'sera') return "Gunakan keahlian profiling-mu.";
        if (pc === 'reza') return "Insting detektifmu berderak.";
        if (pc === 'lana') return "Kau tahu jawabannya. Tapi mereka tidak perlu tahu itu.";
        return "Langsung ke inti.";
      },
      next: 'prologue_confront_niko',
      effect: (s) => {
        const pc = s.playerCharacter || 'arin';
        Engine.modTrust(pc, 'niko', -5);
        Engine.modAwareness('arin', 10);
        s.flags.confrontedNikoEarly = true;
      }
    },
    {
      text: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'juno') return "Masuk dan cari exit — lo selalu punya plan B";
        if (pc === 'kira') return "Masuk dan scan jaringan WiFi mansion";
        if (pc === 'farah') return "Masuk dengan otoritas — ini properti yang dibangun keluargamu";
        return "Masuk dan observasi siapa saja yang hadir";
      },
      hint: "Kumpulkan intel dulu. Reaksi bisa menunggu.",
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modAwareness('arin', 5);
        s.flags.observedFirst = true;
      }
    },
    {
      text: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'reza') return "Periksa perimeter — kebiasaan lama dari kepolisian";
        if (pc === 'kira') return "Scan plat nomor dan trace database online";
        return "Periksa mobil-mobil yang terparkir — siapa saja yang datang?";
      },
      hint: "Plat nomor dan model mobil bisa bercerita banyak.",
      next: 'prologue_check_cars',
      effect: (s) => {
        const pc = s.playerCharacter || 'arin';
        Engine.modAwareness('arin', 8);
        s.cluesFound++;
        s.flags.checkedCars = true;
        if (pc === 'reza') { s.cluesFound++; s.flags.rezaPerimeter = true; }
        if (pc === 'kira') { s.cluesFound++; s.flags.kiraScanned = true; }
      }
    },
    {
      text: "Telepon Juno dulu — dia harusnya datang juga",
      next: 'prologue_call_juno',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 5);
        s.flags.calledJuno = true;
      }
    }
  ]
},

'prologue_confront_niko': {
  text: `<p><span class="speaker niko">Niko</span> "Amplop hitam? Dramatik sekali. Tidak, aku mengirim undangan biasa lewat email. Desainnya minimalis — hitam dan emas. Kau tahu aku suka branding."</p>
<p><span class="speaker niko">Niko</span> "Ini proyek terbaruku. Kakekku meninggalkan properti ini, dan aku mengubahnya jadi ruang pameran seni imersif. Malam ini soft launch."</p>
<p><span class="speaker niko">Niko</span> "Oh — satu hal. Sinyal telepon agak buruk di sini. Tapi mansion punya Wi-Fi sendiri."</p>
<p><span class="speaker niko">Niko</span> "Arya? Aku senang kau di sini. Serius. Malam ini... aku butuh seseorang yang bisa kupercaya."</p>`,
  choices: [
    {
      text: "Ikuti Niko ke dalam hall utama",
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 3);
      }
    },
    {
      text: "Cek ponsel — simpan nomor darurat sebelum sinyal hilang total",
      next: 'prologue_phone_check',
      effect: (s) => {
        s.flags.savedEmergencyNumber = true;
        s.items.push('emergency_contact');
      }
    }
  ]
},

'prologue_check_cars': {
  text: `<p><span class="speaker arin">Arya</span> "SUV hitam mengkilap, plat Jakarta. Sedan tua hijau army dengan stiker 'Ex Serviam'. Hatchback putih — 'My other car is a hearse'. Dan motor Juno."</p>
<p><span class="speaker arin">Arya</span> "Tunggu... sedan silver di ujung, hampir tersembunyi. Di dalamnya — folder manila tebal. Header polisi."</p>`,
  choices: [
    {
      text: "Ambil foto folder polisi itu dengan ponsel",
      hint: "Bukti. Selalu dokumentasikan bukti.",
      danger: true,
      next: 'prologue_photo_evidence',
      effect: (s) => {
        s.items.push('police_folder_photo');
        s.cluesFound++;
        Engine.modAwareness('arin', 12);
        s.flags.hasPolicePhoto = true;
      }
    },
    {
      text: "Catat detail dan masuk ke mansion",
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modAwareness('arin', 5);
        s.flags.notedCars = true;
      }
    }
  ]
},

'prologue_photo_evidence': {
  text: `<p><span class="speaker arin">Arya</span> "Dari foto ini... 'kasus tidak aktif... korban ke-7... profil serupa... mansion Wardhana...' Seseorang membawa file kasus pembunuhan ke pameran seni."</p>
<p><span class="speaker reza">Reza</span> "Mencari sesuatu?"</p>
<p><span class="speaker reza">Reza</span> "Itu mobilku. Dan itu <em>file</em>-ku."</p>`,
  choices: [
    {
      text: '"File kasus pembunuhan di pameran seni? Cerita menarik."',
      hint: "Jadilah jurnalis. Jangan mundur.",
      next: 'prologue_reza_intro',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', 10);
        Engine.modAwareness('arin', 8);
        s.flags.confrontedReza = true;
      }
    },
    {
      text: '"Maaf. Mobilku parkir di sebelah. Salah lihat."',
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', -5);
        s.flags.liedToReza = true;
      }
    }
  ]
},

'prologue_reza_intro': {
  text: `<p><span class="speaker reza">Reza</span> "Arya Prasetya. Podcast 'Jejak Mati'. Episode 47 — kasus Pembunuh Jembatan. Kau hampir benar soal pelakunya."</p>
<p><span class="speaker arin">Arya</span> "Kau mendengarkan podcast-ku?"</p>
<p><span class="speaker reza">Reza</span> "Aku mendengarkan semua orang yang bicara tentang kasus-kasusku. Reza Hartono. Dulu detektif homisida. Sekarang konsultan keamanan. Niko menyewa jasaku untuk malam ini."</p>
<p><span class="speaker arin">Arya</span> "Tapi kau membawa file kasus lama."</p>
<p><span class="speaker reza">Reza</span> "Pernah dengar perasaan di perut yang bilang sesuatu tidak beres? Daftar tamu malam ini... cocok dengan profil korban dari kasus yang tidak pernah kututup."</p>
<p><span class="speaker arin">Arya</span> "Kasus apa?"</p>
<p><span class="speaker reza">Reza</span> "Tujuh orang. Tujuh tahun. Semuanya diundang ke acara eksklusif. Semuanya menghilang. Dan semuanya punya koneksi dengan keluarga pemilik properti."</p>
<p><span class="speaker reza">Reza</span> "Aku bisa salah. Semoga aku salah."</p>`,
  choices: [
    {
      text: '"Kita harus kerja sama. Aku punya kontak dan recording skills."',
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', 15);
        Engine.addAlliance(['arin', 'reza']);
        s.flags.rezaAlliance = true;
        s.keyChoices.push('reza_alliance');
      }
    },
    {
      text: '"Kalau kau curiga, kenapa tetap datang?"',
      next: 'prologue_reza_motive',
      effect: (s) => {
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'prologue_reza_motive': {
  text: `<p><span class="speaker reza">Reza</span> "Karena terakhir kali aku mengabaikan perasaan ini, orang yang salah masuk penjara. Dan yang benar terus membunuh."</p>
<p><span class="speaker reza">Reza</span> "Kita masuk. Amati. Jangan tunjukkan bahwa kau tahu apapun. Dan Arya — jangan percaya siapapun malam ini. Termasuk aku."</p>`,
  choices: [
    {
      text: "Masuk ke hall utama",
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', 8);
        s.flags.rezaWarning = true;
      }
    }
  ]
},

'prologue_call_juno': {
  text: `<p><span class="speaker juno">Juno</span> "Arya! Lo udah di sana? Gue baru parkir. Tempat ini gila — kayak haunted mansion di film B."</p>
<p><span class="speaker arin">Arya</span> "Kau juga dapat amplop hitam?"</p>
<p><span class="speaker juno">Juno</span> "Amplop hitam? Nggak. Gue diajak Niko lewat DM. Dia bilang ada pameran seni yang 'harus gue lihat'. Emang kenapa?"</p>
<p><span class="speaker arin">Arya</span> "Tidak. Lupakan. Kita ketemu di dalam?"</p>
<p><span class="speaker juno">Juno</span> "Bentar. Arya... lo kenal semua yang diundang?"</p>
<p><span class="speaker arin">Arya</span> "Belum. Kenapa?"</p>
<p><span class="speaker juno">Juno</span> "Gue baru papasan sama satu cewek. Berambut hitam, gaun gelap. Dia senyum dan bilang, 'Selamat datang kembali.' Gue belum pernah ke sini."</p>
<p><span class="speaker juno">Juno</span> "Dan Arya — gue kenal wajahnya. Itu Vira. Vira yang hilang enam bulan."</p>`,
  choices: [
    {
      text: '"Vira ada di sini?! Tunggu aku di lobby."',
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 8);
        s.flags.knowsViraHere = true;
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: '"Juno, jangan dekati Vira sendirian. Aku serius."',
      next: 'prologue_enter_hall',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 5);
        s.flags.warnedJunoAboutVira = true;
      }
    }
  ]
},

'prologue_phone_check': {
  text: `<p><span class="speaker arin">Arya</span> "Nomor darurat disimpan. Pin lokasi terkirim ke editor podcast. Screenshot peta area — done."</p>
<p><span class="speaker arin">Arya</span> "Sial. Status 'Sending...' tanpa centang. Sinyal udah nol."</p>
<p><span class="speaker arin">Arya</span> "Wi-Fi mansion: 'WARDHANA_GUEST'. Kuat. Tapi semua request di-redirect ke splash screen: 'THE LAST KNOT' dengan countdown timer."</p>
<p><span class="speaker arin">Arya</span> "Timer: 06:00:00. Enam jam. Sampai apa?"</p>`,
  choices: [
    {
      text: "Masuk ke mansion. Waktu berjalan.",
      next: 'prologue_enter_hall',
      effect: (s) => {
        s.flags.sawCountdown = true;
        Engine.modDanger(5);
      }
    }
  ]
},

'prologue_enter_hall': {
  text: (s) => {
    let text = '';
    text += `<p class="sound">— musik biola solo mengalun, melodi yang familiar tapi off-key, seperti lullaby yang dimainkan mundur —</p>`;
    text += `<p><span class="speaker sera">Sera</span> duduk di sofa sudut. Dia mengangguk — "kita perlu bicara."</p>`;
    text += `<p><span class="speaker lana">Lana</span> berdiri di dekat foto kriminal di dinding, kepalanya dimiringkan. Jarinya mengetuk-ngetuk di udara.</p>`;
    text += `<p><span class="speaker farah">Farah</span> di bar dengan segelas wine, bicara pada <span class="speaker dimas">Dimas</span> yang mendengarkan dengan senyum sopan.</p>`;

    if (s.flags.knowsViraHere || s.flags.warnedJunoAboutVira) {
      text += `<p><span class="speaker vira">Vira</span> di pojok terjauh. Matanya menangkapmu. Bibirnya bergerak tanpa suara.</p>`;
    } else {
      text += `<p><span class="speaker vira">Vira</span> — Vira Deviani. Enam bulan menghilang, dan sekarang berdiri di sini. Senyum tipis. Bukan senyum yang kau ingat.</p>`;
    }

    if (s.flags.calledJuno) {
      text += `<p><span class="speaker juno">Juno</span> "Gue nggak suka tempat ini, Arya. Terlalu... disetting."</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> muncul dari lorong samping, mengangguk — anggukan jalanan, cepat.</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> "Semuanya sudah hadir! Sempurna. Sebelum kita mulai — perkenalan singkat. Malam ini akan lebih intim kalau kita semua tahu siapa yang ada di ruangan ini."</p>`;

    return text;
  },
  choices: [
    {
      text: "Hampiri Sera — dia ingin bicara",
      hint: "Sera tidak pernah memberi sinyal tanpa alasan.",
      next: 'prologue_sera_talk',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 8);
        s.flags.firstTalk = 'sera';
      }
    },
    {
      text: "Dekati Vira — kau perlu penjelasan",
      hint: "Enam bulan menghilang. Dan sekarang dia di sini.",
      danger: true,
      next: 'prologue_vira_talk',
      effect: (s) => {
        Engine.modDanger(5);
        s.flags.firstTalk = 'vira';
      }
    },
    {
      text: "Periksa instalasi kursi dan amplop hitam di tengah hall",
      hint: "Sepuluh kursi. Sepuluh amplop. Sepuluh tamu.",
      next: 'prologue_examine_chairs',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.firstTalk = 'none';
      }
    },
    {
      text: "Observasi Lana dan foto-foto kriminal — ada yang familiar",
      next: 'prologue_lana_intro',
      effect: (s) => {
        Engine.modAwareness('arin', 5);
        s.flags.firstTalk = 'lana';
      }
    },
    {
      text: "Bergabung dengan Farah dan Dimas di bar",
      next: 'prologue_bar_talk',
      effect: (s) => {
        s.flags.firstTalk = 'farah';
      }
    }
  ]
},

'prologue_sera_talk': {
  text: `<p><span class="speaker sera">Sera</span> "Tiga hal, Arya."</p>
<p><span class="speaker sera">Sera</span> "Satu — aku menghitung sepuluh undangan tapi sebelas tempat duduk di meja makan. Untuk siapa kursi kosong itu?"</p>
<p><span class="speaker sera">Sera</span> "Dua — pria di dekat bar. Microexpression-nya tidak sinkron. Dia tersenyum tapi pupilnya tidak melebar. Itu masking. Tipe yang aku pelajari di bab psychopathology."</p>
<p><span class="speaker sera">Sera</span> "Dan tiga — Vira. Body language-nya salah. Vira yang aku kenal itu orang yang <em>tidak bisa diam</em>. Vira yang ini posturnya terlalu terkontrol. Seperti sedang mengevaluasi ruangan. Bukan sebagai tamu — sebagai <em>predator</em>."</p>
<p><span class="speaker sera">Sera</span> "Arya, aku takut. Tapi aku lebih takut kalau aku diam dan ternyata aku benar."</p>`,
  choices: [
    {
      text: '"Catatan yang bagus. Kita jaga mata terbuka — bersama."',
      next: 'prologue_kira_interrupts',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        Engine.addAlliance(['arin', 'sera']);
        s.flags.seraAlliance = true;
        s.keyChoices.push('sera_alliance');
      }
    },
    {
      text: '"Sera, kau yakin ini bukan overthinking? Ini pameran seni, bukan crime scene."',
      next: 'prologue_kira_interrupts',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', -5);
        s.flags.dismissedSera = true;
      }
    },
    {
      text: '"Kursi kesebelas — itu detail penting. Ayo cek sebelum Niko mulai acaranya."',
      next: 'prologue_eleventh_chair',
      effect: (s) => {
        Engine.modAwareness('arin', 12);
        Engine.modTrust('arin', 'sera', 8);
        s.cluesFound++;
        s.flags.found11thChair = true;
      }
    }
  ]
},

'prologue_eleventh_chair': {
  text: `<p><span class="speaker arin">Arya</span> "Meja panjang kayu gelap, sepuluh tempat duduk dengan name card — dan satu lagi di ujung kepala meja. Tanpa nama."</p>
<p><span class="speaker sera">Sera</span> "Arya, lihat — di piring kursi kosong itu. Amplop hitam yang sudah terbuka. Ada foto polaroid di dalamnya."</p>
<p><span class="speaker arin">Arya</span> "Foto kita semua — diambil malam ini. Pakaian sama, posisi sama. Tapi ada tanda silang merah di atas wajah tiga orang."</p>
<p><span class="speaker sera">Sera</span> "Arya... itu tanda target."</p>
<p class="journal"><em>"Sebelum fajar, tiga simpul akan terputus. Pertanyaannya bukan siapa — tapi apakah kau cukup berani untuk mengikat ulang?"</em></p>`,
  shake: true,
  choices: [
    {
      text: "Simpan foto itu. Ini bukti.",
      next: 'prologue_kira_interrupts',
      effect: (s) => {
        s.items.push('target_photo');
        s.cluesFound++;
        Engine.modAwareness('arin', 15);
        Engine.modDanger(10);
        s.flags.hasTargetPhoto = true;
        s.keyChoices.push('found_target_photo');
      }
    },
    {
      text: "Tunjukkan ke semua orang. Mereka harus tahu.",
      next: 'prologue_reveal_photo',
      effect: (s) => {
        s.items.push('target_photo');
        s.flags.revealedPhotoToAll = true;
        s.moralScore += 10;
        Engine.modDanger(15);
      }
    },
    {
      text: "Taruh kembali. Jangan biarkan siapapun tahu kau menemukan ini.",
      next: 'prologue_kira_interrupts',
      effect: (s) => {
        s.flags.ignoredTargetPhoto = true;
        Engine.modTrust('arin', 'sera', -3);
      }
    }
  ]
},

'prologue_reveal_photo': {
  text: `<p><span class="speaker arin">Arya</span> "Perhatian, semuanya. Aku menemukan ini di ruang makan. Foto kita semua — diambil malam ini. Dengan tanda target di tiga wajah."</p>
<p><span class="speaker reza">Reza</span> "Tunjukkan." </p>
<p><span class="speaker kira">Kai</span> "Kamera tersembunyi di chandelier. Aku bisa tracing feed-nya kalau aku dapat akses ke router lokal."</p>
<p><span class="speaker juno">Juno</span> "Siapa tiga yang di-target?"</p>
<p><span class="speaker arin">Arya</span> "Tiga tanda silang: Reza, Farah, dan... Vira."</p>
<p><span class="speaker vira">Vira</span> "Menarik. Seseorang suka bermain."</p>
<p><span class="speaker niko">Niko</span> "Oke. Ini jelas bukan bagian dari pameran. Aku akan—"</p>
<p class="sound">— lampu mati. Gelap total. Tiga detik. —</p>
<p class="sound">— lampu menyala kembali. Foto di tangan sudah hilang. —</p>`,
  shake: true,
  glitch: true,
  choices: [
    {
      text: '"Siapa yang mengambil foto itu?!"',
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modDanger(8);
        s.flags.photoStolen = true;
      }
    },
    {
      text: "Diam. Observasi siapa yang bergerak saat lampu mati.",
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.observedDarkness = true;
      }
    }
  ]
},

'prologue_vira_talk': {
  text: `<p><span class="speaker vira">Vira</span> "Arya. Aku tahu kau akan datang. Kau selalu datang."</p>
<p><span class="speaker arin">Arya</span> "Vira. Enam bulan."</p>
<p><span class="speaker vira">Vira</span> "Enam bulan, dua minggu, empat hari. Tapi siapa yang menghitung?"</p>
<p><span class="speaker arin">Arya</span> "Di mana kau—"</p>
<p><span class="speaker vira">Vira</span> "Pertanyaan yang salah. Pertanyaan yang benar adalah: kenapa aku kembali <em>sekarang</em>? Kenapa di <em>tempat ini</em>?"</p>
<p><span class="speaker vira">Vira</span> "Aku kembali karena ini belum selesai, Arya. Yang dimulai di mansion ini lima puluh tahun lalu — siklus itu masih berjalan. Dan malam ini, kita semua bagian darinya."</p>
<p><span class="speaker arin">Arya</span> "Kau bicara seperti orang yang tahu apa yang akan terjadi."</p>
<p><span class="speaker vira">Vira</span> "Mungkin aku tahu. Mungkin aku <em>sudah melihatnya</em>. Atau mungkin aku gila. Pilih yang membuat kau bisa tidur malam ini."</p>`,
  choices: [
    {
      text: '"Vira, aku di sini sebagai temanmu. Kalau kau tahu sesuatu, beritahu aku."',
      next: 'prologue_vira_hint',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 10);
        s.flags.appealedToVira = true;
      }
    },
    {
      text: '"Kalau kau tahu ada bahaya dan tidak bicara, kau sama bersalahnya."',
      next: 'prologue_vira_cold',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', -8);
        s.moralScore += 5;
        s.flags.accusedVira = true;
      }
    },
    {
      text: "Mundur perlahan. Instingmu berteriak.",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.retreatedFromVira = true;
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'prologue_vira_hint': {
  text: `<p><span class="speaker vira">Vira</span> "Arya." Suaranya berbisik, bergetar. "Jangan percaya yang di atas."</p>
<p><span class="speaker arin">Arya</span> "Apa maksud—"</p>
<p><span class="speaker vira">Vira</span> "Oh, aku hanya bercanda. Kau tahu aku suka dramatis."</p>
<p><span class="speaker niko">Niko</span> menepuk tangannya di tengah ruangan.</p>`,
  choices: [
    {
      text: "Catat pesan Vira: 'jangan percaya yang di atas'. Apa yang ada di lantai atas?",
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modAwareness('arin', 12);
        s.flags.viraWarning = true;
        s.cluesFound++;
        s.keyChoices.push('vira_warning');
      }
    },
    {
      text: "Abaikan — dia memang selalu dramatis",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.ignoredViraWarning = true;
      }
    }
  ]
},

'prologue_vira_cold': {
  text: `<p><span class="speaker vira">Vira</span> "Bersalah. Kata yang menarik dari seseorang yang membangun karir dari mayat orang lain. Podcast-mu, Arya — setiap episode adalah cerita kematian. Kau <em>menikmati</em> ini."</p>
<p><span class="speaker vira">Vira</span> "Tapi kau benar. Satu petunjuk gratis: malam ini, perhatikan tangan. Bukan mulut. Mulut berbohong. Tangan menunjukkan kebenaran."</p>`,
  choices: [
    {
      text: "Ikuti acara Niko yang dimulai",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.viraClue = 'watch_hands';
        s.cluesFound++;
      }
    }
  ]
},

'prologue_examine_chairs': {
  text: `<p><span class="speaker arin">Arya</span> "Sepuluh kursi kayu, disusun melingkar. Di depan setiap kursi, amplop hitam dengan nama."</p>
<p class="journal"><em>"ARIN PRASETYA — Sang Pencari. Kau mencari kebenaran di tempat gelap. Tapi apakah kau siap menemukan kebenaran tentang dirimu sendiri?"</em></p>
<p><span class="speaker kira">Kai</span> "Hei, lihat kartuku — 'KIRA CHEN — Sang Pengawas. Kau melihat semua yang digital. Tapi apakah kau bisa melihat apa yang nyata?'"</p>
<p><span class="speaker kira">Kai</span> "Ini bukan pameran seni. Ini profiling. Seseorang sudah meneliti kita semua."</p>`,
  choices: [
    {
      text: '"Kai, bisa kau cek siapa yang hosting server Wi-Fi di sini?"',
      next: 'prologue_kira_hack',
      effect: (s) => {
        Engine.modTrust('arin', 'kira', 10);
        s.flags.askedKiraToHack = true;
      }
    },
    {
      text: "Baca amplop orang lain — mulai dari Niko",
      danger: true,
      next: 'prologue_read_others',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.readOtherEnvelopes = true;
      }
    },
    {
      text: "Simpan kartu dan ikuti acara",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.items.push('personal_card');
      }
    }
  ]
},

'prologue_kira_hack': {
  text: `<p><span class="speaker kira">Kai</span> "Udah. Aku scan jaringan ini sebelum masuk. Kebiasaan."</p>
<p><span class="speaker kira">Kai</span> "Router mansion terhubung ke NAS server lokal. Tapi ada satu device lain — server stream. Aktif. Streaming video ke IP eksternal."</p>
<p><span class="speaker arin">Arya</span> "Seseorang menyiarkan apa yang terjadi di sini? Live?"</p>
<p><span class="speaker kira">Kai</span> "Dan satu hal lagi. Di NAS ada folder bertanggal mundur tujuh tahun. Setiap folder berisi video. Aku baru buka satu."</p>
<p><span class="speaker kira">Kai</span> "Setiap tahun. Selama tujuh tahun. Ada 'acara' di mansion ini. Dan setiap kali... ada yang tidak keluar hidup-hidup."</p>`,
  shake: true,
  choices: [
    {
      text: '"Download semua video itu. Kita butuh bukti."',
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modTrust('arin', 'kira', 12);
        Engine.addAlliance(['arin', 'kira']);
        s.flags.kiraAlliance = true;
        s.flags.downloadingVideos = true;
        s.cluesFound += 2;
        s.keyChoices.push('kira_alliance');
      }
    },
    {
      text: '"Kita harus pergi dari sini. Sekarang."',
      next: 'prologue_try_escape',
      effect: (s) => {
        s.flags.triedEarlyEscape = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'prologue_try_escape': {
  text: `<p><span class="speaker arin">Arya</span> "Pintu depan — terkunci."</p>
<p><span class="speaker kira">Kai</span> "Kunci elektromagnetik. Dikontrol dari server. Semua pintu keluar terkunci tiga menit lalu. Tepat saat tamu terakhir masuk."</p>
<p><span class="speaker arin">Arya</span> "Niko! Pintu terkunci!"</p>
<p><span class="speaker niko">Niko</span> "Aku tahu. Itu bagian dari pengalaman imersif. Santai — kunci akan terbuka otomatis saat pameran selesai. Escape room versi premium."</p>`,
  choices: [
    {
      text: "Kembali ke hall. Ikuti permainan — untuk sekarang.",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.knowsLocked = true;
        Engine.modDanger(5);
      }
    }
  ]
},

'prologue_read_others': {
  text: `<p class="journal"><em>"NIKO WARDHANA — Sang Pewaris. Kakekmu membangun takhta dari tulang. Apakah kau akan duduk di atasnya — atau menghancurkannya?"</em></p>
<p class="journal"><em>"LANA MAHARANI — Sang Narator. Kau menulis tentang pembunuhan. Tapi apakah kau hanya menulis — atau juga menginspirasi?"</em></p>
<p class="journal"><em>"DIMAS SURYA — Sang Pemotong. Kau memotong tubuh mati untuk ilmu. Tapi apakah kau pernah bertanya apa rasanya memotong yang masih hidup?"</em></p>
<p><span class="speaker lana">Lana</span> "Membaca surat orang lain? Itu tidak sopan. Tapi bisa dimengerti — dari seorang jurnalis."</p>`,
  choices: [
    {
      text: '"Kau sudah baca punyamu? Soal menulis dan menginspirasi pembunuhan?"',
      next: 'prologue_lana_envelope',
      effect: (s) => {
        Engine.modSuspicion('lana', 10);
        Engine.modAwareness('arin', 8);
        s.flags.confrontedLanaEnvelope = true;
      }
    },
    {
      text: '"Maaf. Aku hanya penasaran."',
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modTrust('arin', 'lana', -5);
      }
    }
  ]
},

'prologue_lana_envelope': {
  text: `<p><span class="speaker lana">Lana</span> "Menginspirasi. Kata yang kuat. Aku penulis fiksi, Arya. Kalau setiap penulis thriller dituduh menginspirasi pembunuhan, Stephen King sudah di penjara sejak 1980."</p>
<p><span class="speaker arin">Arya</span> "Tapi kasus di buku ketigamu — 'Anatomi Malam' — detail-detailnya cocok dengan kasus nyata yang polisi tidak publikasikan."</p>
<p><span class="speaker lana">Lana</span> "Kau sudah riset tentang aku. Bagus. Aku juga sudah riset tentang kau."</p>
<p><span class="speaker lana">Lana</span> "Sumber podcast episode 32-mu. Yang bunuh diri. Aku kenal dia. Dan dia tidak bunuh diri, Arya."</p>
<p><span class="speaker lana">Lana</span> "Kita punya banyak yang bisa dibicarakan malam ini. Tapi nanti. Tuan rumah ingin mulai."</p>`,
  choices: [
    {
      text: "Ikuti acara Niko. Simpan informasi dari Lana untuk nanti.",
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.lanaKnowsSource = true;
        s.cluesFound++;
        s.keyChoices.push('lana_source_reveal');
      }
    }
  ]
},

'prologue_lana_intro': {
  text: `<p><span class="speaker lana">Lana</span> "Indah, bukan? Dalam cara yang membuatmu malu mengakuinya."</p>
<p><span class="speaker arin">Arya</span> "Lana Maharani. 'Anatomi Malam'. 'Tujuh Belati'. 'Sang Penenun'."</p>
<p><span class="speaker lana">Lana</span> "Fan?"</p>
<p><span class="speaker arin">Arya</span> "Reviewer. Episode 51 podcast-ku. Aku bilang novel-novelmu 'terlalu akurat untuk nyaman'."</p>
<p><span class="speaker lana">Lana</span> "Ah. Kau yang bilang aku mungkin psychopath. Aku suka review itu. Paling jujur yang pernah kuterima."</p>
<p><span class="speaker lana">Lana</span> "Kau tahu apa yang menarik? Foto-foto ini semua dari lokasi yang sama. Mansion ini. Berbeda tahun, berbeda ruangan, tapi tempat yang sama."</p>
<p><span class="speaker arin">Arya</span> "Bagaimana kau tahu?"</p>
<p><span class="speaker lana">Lana</span> "Karena aku meneliti mansion Wardhana untuk novel terakhirku. Novel tentang sepuluh orang yang diundang ke sebuah mansion. Dan satu per satu..."</p>
<p><span class="speaker lana">Lana</span> "Kau tahu, Arya... aku suka jurnalis. Kalian dan novelis — dua sisi mata uang. Bedanya, aku menciptakan monster. Kau mencari mereka. Pertanyaannya: siapa yang lebih bahaya?"</p>`,
  choices: [
    {
      text: '"Novel yang belum terbit tentang skenario yang mirip malam ini. Kebetulan?"',
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modSuspicion('lana', 15);
        Engine.modAwareness('arin', 10);
        s.flags.lanaSuspicious = true;
        s.cluesFound++;
      }
    },
    {
      text: '"Kalau kau sudah riset mansion ini, apa yang kau temukan?"',
      next: 'prologue_lana_history',
      effect: (s) => {
        Engine.modTrust('arin', 'lana', 5);
        s.flags.askedLanaHistory = true;
      }
    }
  ]
},

'prologue_lana_history': {
  text: `<p><span class="speaker lana">Lana</span> "Mansion Wardhana dibangun 1971 oleh dua keluarga — Wardhana dan Aldridge. Selama konstruksi, tujuh pekerja tewas. Semuanya jatuh dari ketinggian. Semuanya di sayap timur."</p>
<p><span class="speaker lana">Lana</span> "Setelah dibangun, mansion jadi tempat pertemuan eksklusif. Dan setiap tahun, pada tanggal yang sama, satu orang yang hadir... menghilang."</p>
<p><span class="speaker lana">Lana</span> "Resmi: meninggalkan pesta karena darurat keluarga. Tidak pernah dilaporkan hilang. Keluarga menerima uang tutup mulut."</p>
<p><span class="speaker arin">Arya</span> "Tidak ada yang keluar."</p>
<p><span class="speaker lana">Lana</span> "Satu yang keluar. Selalu satu. Yang lain... menjadi bagian dari koleksi."</p>`,
  choices: [
    {
      text: "Ikuti acara Niko — tapi dengan informasi baru ini",
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.knowsMansionHistory = true;
        s.cluesFound += 2;
        s.keyChoices.push('knows_history');
      }
    }
  ]
},

'prologue_bar_talk': {
  text: `<p><span class="speaker farah">Farah</span> "Oh, kau pasti Arya. Niko cerita tentang kau — podcaster, kan? Sangat... berani."</p>
<p><span class="speaker arin">Arya</span> "Dan kau Farah Aldridge. Keluarga yang co-founded mansion ini bersama keluarga Wardhana."</p>
<p><span class="speaker farah">Farah</span> "Keluargaku <em>mendanai</em> pembangunan. Yang membangun adalah Wardhana. Aku di sini karena Niko bilang akan ada pengumuman tentang properti ini. Sebagai co-owner, aku harus hadir."</p>
<p><span class="speaker dimas">Dimas</span> "Dimas Surya. Mahasiswa kedokteran forensik. Aku di sini karena Lana mengundangku sebagai konsultan untuk novel barunya."</p>
<p><span class="speaker dimas">Dimas</span> "Ironis ya — forensik di pameran seni."</p>
<p><span class="speaker farah">Farah</span> "Atau sangat pas."</p>`,
  choices: [
    {
      text: '"Farah, kau tahu sejarah lengkap mansion ini? Ada rumor soal orang hilang."',
      next: 'prologue_farah_nervous',
      effect: (s) => {
        Engine.modTrust('arin', 'farah', -5);
        Engine.modAwareness('arin', 8);
        s.flags.pressedFarah = true;
      }
    },
    {
      text: '"Dimas, forensik — kau bisa membedakan kecelakaan dari pembunuhan?"',
      next: 'prologue_dimas_cold',
      effect: (s) => {
        Engine.modSuspicion('dimas', 5);
        s.flags.testedDimas = true;
      }
    },
    {
      text: "Dengarkan saja percakapan mereka tanpa banyak bertanya",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.observedBarTalk = true;
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'prologue_farah_nervous': {
  text: `<p><span class="speaker farah">Farah</span> "Rumor. Itu namanya rumor. Setiap bangunan tua punya cerita horor."</p>
<p><span class="speaker farah">Farah</span> "Maaf. Aku hanya... tidak suka tempat ini. Kakekku meninggal di sini. Serangan jantung, 2019. Di ruang kerja di lantai tiga."</p>
<p><span class="speaker farah">Farah</span> "Niko menjanjikan lantai tiga tidak akan digunakan malam ini."</p>
<p><span class="speaker dimas">Dimas</span> "Serangan jantung bisa dipicu banyak hal. Stres. Ketakutan. Atau substansi tertentu yang tidak terdeteksi dalam autopsi standar."</p>
<p><span class="speaker farah">Farah</span> "Kenapa kau bilang itu?"</p>
<p><span class="speaker dimas">Dimas</span> "Fakta medis. Bukan akusasi."</p>`,
  choices: [
    {
      text: "Catat: lantai 3 off-limits. Menarik.",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.knowsThirdFloor = true;
        s.cluesFound++;
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'prologue_dimas_cold': {
  text: `<p><span class="speaker dimas">Dimas</span> "Membedakan kecelakaan dari pembunuhan? Tentu. Itu pekerjaan sehari-hariku."</p>
<p><span class="speaker dimas">Dimas</span> "Tapi pertanyaan yang lebih menarik: bisakah kau membuat pembunuhan terlihat seperti kecelakaan?"</p>
<p><span class="speaker dimas">Dimas</span> "Jawaban akademisnya: ya. Dengan pengetahuan anatomi yang cukup, alat yang tepat, dan waktu — hampir semua pembunuhan bisa disamarkan."</p>
<p><span class="speaker dimas">Dimas</span> "Tapi tentu saja, aku hanya bicara teori."</p>
<p><span class="speaker arin">Arya</span> "Tentu saja."</p>`,
  choices: [
    {
      text: "Ikuti acara Niko",
      next: 'prologue_niko_speech',
      effect: (s) => {
        Engine.modSuspicion('dimas', 10);
        s.flags.dimasCold = true;
      }
    }
  ]
},

'prologue_kira_interrupts': {
  text: (s) => {
    let text = '';
    if (s.flags.seraAlliance) {
      text += `<p><span class="speaker kira">Kai</span> menghampiri kalian berdua.</p>`;
    } else {
      text += `<p><span class="speaker kira">Kai</span> menghampirimu.</p>`;
    }
    text += `<p><span class="speaker kira">Kai</span> "Arya Prasetya, kan? Aku Kai. Dengerin — gue hack jaringan Wi-Fi mansion ini. Ada server yang streaming live feed ke IP luar. Kita sedang ditonton."</p>`;
    text += `<p><span class="speaker kira">Kai</span> "Dan semua pintu keluar dikunci elektromagnetik tiga menit yang lalu."</p>`;
    if (s.flags.seraAlliance) {
      text += `<p><span class="speaker sera">Sera</span> "Kita terjebak?"</p>`;
      text += `<p><span class="speaker kira">Kai</span> "Kita terkunci di dalam dengan seseorang yang sudah merencanakan ini bertahun-tahun. Nggak sama."</p>`;
    }
    return text;
  },
  choices: [
    {
      text: "Ikuti acara Niko — sekarang dengan kewaspadaan maksimum",
      next: 'prologue_niko_speech',
      effect: (s) => {
        s.flags.knowsLocked = true;
        s.flags.knowsBeingWatched = true;
        Engine.modDanger(8);
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'prologue_niko_speech': {
  text: (s) => {
    let text = '';
    text += `<p><span class="speaker niko">Niko</span> "Terima kasih sudah datang. Aku tahu beberapa dari kalian bertanya-tanya kenapa kalian di sini."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Jawaban singkatnya: malam ini kalian akan menyaksikan — dan menjadi bagian dari — sebuah karya seni yang belum pernah ada sebelumnya."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Mansion ini punya sejarah. Keluargaku membangun tempat ini lima puluh tahun lalu — dan selama itu, tempat ini menyimpan rahasia yang ingin dikubur banyak orang."</p>`;

    if (s.flags.revealedPhotoToAll) {
      text += `<p><span class="speaker niko">Niko</span> "Dan ya — aku tahu tentang foto yang Arya temukan. Itu bukan ancaman. Itu bagian dari pameran. Performance art."</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Performance art dengan tanda target di wajah orang? Itu bukan seni. Itu intimidasi."</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> "Malam ini, kita akan membuka rahasia itu bersama. Di amplop kalian ada peran masing-masing. Anggap ini seperti escape room — tapi lebih personal."</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Dan kalau ada yang nggak mau main?"</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Pintu akan terbuka saat pameran selesai. Enam jam. Sampai saat itu — kita semua pemain."</p>`;
    text += `<p><span class="speaker reza">Reza</span> "Niko, aku disewa untuk keamanan. Bukan untuk dikurung. Buka pintunya."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Reza, santai. Ini—"</p>`;
    text += `<p class="sound">— lampu mati. Kegelapan total. Jeritan pendek, terpotong. —</p>`;
    text += `<p class="sound">— lampu menyala. —</p>`;
    text += `<p class="sound">— di dinding, tulisan baru — merah dan basah —</p>`;
    text += `<p class="journal" style="font-size:1.3em"><em>"PERMAINAN DIMULAI. SEBELUM FAJAR, TIGA SIMPUL AKAN TERPUTUS."</em></p>`;
    text += `<p><span class="speaker reza">Reza</span> "Cat. Bukan darah. Tapi pesannya jelas."</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Bab satu."</p>`;

    return text;
  },
  shake: true,
  glitch: true,
  choices: [
    {
      text: '"Niko, aku serius — apa ini bagian dari pameranmu?"',
      next: 'prologue_niko_denies',
      effect: (s) => {
        s.flags.questionedNiko = true;
      }
    },
    {
      text: "Periksa semua jalan keluar bersama Reza",
      hint: "Prioritas: escape routes.",
      next: 'prologue_check_exits',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', 8);
        s.flags.checkedExits = true;
      }
    },
    {
      text: "Minta Kai trace siapa yang mengontrol lampu dan kunci",
      next: 'prologue_kira_trace',
      effect: (s) => {
        Engine.modTrust('arin', 'kira', 8);
        s.flags.kiraTracing = true;
      }
    },
    {
      text: "Perhatikan reaksi semua orang — siapa yang TIDAK terkejut?",
      hint: "Siapa yang tidak kaget... mungkin sudah tahu.",
      next: 'prologue_observe_reactions',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.observedReactions = true;
      }
    }
  ]
},

'prologue_observe_reactions': {
  text: (s) => {
    let text = '';
    text += `<p><span class="speaker arin">Arya</span> "Niko — terkejut, tapi matanya mengkalkulasi. Ini mungkin bukan rencananya, tapi dia tidak sepenuhnya tidak siap."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Sera — takut, tapi juga mengamati. Satu tipe denganku."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Juno — marah. Reaksi fight. Tangannya terkepal."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Reza — profesional. Sudah mode detektif. Tangan di pinggul — kebiasaan lama."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Farah — ketakutan murni. Tapi matanya bergerak ke lantai tiga."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Kai — sudah di laptop. Fokus, bukan panik."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Vira — <em>tidak bereaksi sama sekali</em>. Seperti cuaca yang sudah dia ramalkan."</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker arin">Arya</span> "Lana — bibirnya bergerak. Berbisik: 'Tepat waktu.' Siapa yang tepat waktu?"</p>`;
      text += `<p><span class="speaker arin">Arya</span> "Dimas — tenang. Memeriksa tas medisnya. Dia sudah siap untuk malam ini. Kenapa?"</p>`;
    } else {
      text += `<p><span class="speaker arin">Arya</span> "Lana — menulis catatan. Novelis — selalu mencatat."</p>`;
      text += `<p><span class="speaker arin">Arya</span> "Dimas — tenang. Terlalu tenang untuk mahasiswa."</p>`;
    }

    text += `<p><span class="speaker arin">Arya</span> "Dua orang tidak terkejut: Vira dan `;
    text += s.difficulty >= 2 ? `Lana."` : `Dimas."`;

    return text;
  },
  choices: [
    {
      text: "Bentuk rencana: kumpulkan orang-orang yang bisa dipercaya",
      next: 'prologue_form_plan',
      effect: (s) => {
        s.flags.strategist = true;
        s.keyChoices.push('observer_strategist');
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Konfrontasi Vira — dia tahu lebih dari yang dia tunjukkan",
      danger: true,
      next: 'prologue_confront_vira_public',
      effect: (s) => {
        s.flags.confrontedViraPublic = true;
        Engine.modDanger(5);
      }
    }
  ]
},

'prologue_form_plan': {
  text: (s) => {
    let allies = ['sera'];
    if (s.flags.rezaAlliance) allies.push('reza');
    if (s.flags.kiraAlliance) allies.push('kira');
    if (!allies.includes('juno')) allies.push('juno');

    let text = `<p><span class="speaker arin">Arya</span> "Kita perlu rencana. Sekarang."</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Simpel. Kita cari jalan keluar, hubungi polisi, dan—"</p>`;
    text += `<p><span class="speaker sera">Sera</span> "Sinyal telepon nol. Wi-Fi dikontrol. Semua pintu keluar terkunci elektromagnetik."</p>`;
    text += `<p><span class="speaker juno">Juno</span> "Jendela?"</p>`;

    if (allies.includes('reza')) {
      text += `<p><span class="speaker reza">Reza</span> "Sudah cek. Lantai satu — jendela dipasangi teralis besi dekoratif. Tidak bisa dipotong tanpa alat berat."</p>`;
    }

    if (allies.includes('kira')) {
      text += `<p><span class="speaker kira">Kai</span> "Aku bisa coba override sistem kunci dari server lokal. Tapi butuh akses fisik ke ruang server — kemungkinan di basement."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Prioritas: cari akses ke basement dan ruang server",
      hint: "Kontrol sistem = kontrol jalan keluar.",
      next: 'ch1_start',
      effect: (s) => {
        s.flags.plan = 'server';
        s.keyChoices.push('plan_server');
      }
    },
    {
      text: "Prioritas: investigasi identitas 'Sang Penenun' — dalang di balik ini",
      hint: "Hentikan sumbernya, bukan gejalanya.",
      next: 'ch1_start',
      effect: (s) => {
        s.flags.plan = 'investigate';
        s.keyChoices.push('plan_investigate');
      }
    },
    {
      text: "Prioritas: lindungi semua orang — tetap bersama, jangan berpencar",
      next: 'ch1_start',
      effect: (s) => {
        s.flags.plan = 'protect';
        s.moralScore += 10;
        s.keyChoices.push('plan_protect');
      }
    },
    {
      text: "Ikuti permainan 'Sang Penenun'. Mainkan dari dalam.",
      danger: true,
      hint: "Masuk ke permainannya. Temukan aturannya. Hancurkan dari dalam.",
      next: 'ch1_start',
      effect: (s) => {
        s.flags.plan = 'play_along';
        Engine.modDanger(5);
        s.keyChoices.push('plan_play_along');
      }
    }
  ]
},

'prologue_niko_denies': {
  text: `<p><span class="speaker niko">Niko</span> "Tulisan itu — bukan bagian dari pameran. Aku merancang semuanya. Instalasi, pencahayaan, foto-foto. Tapi tulisan itu... bukan aku."</p>
<p><span class="speaker arin">Arya</span> "Lalu siapa?"</p>
<p><span class="speaker niko">Niko</span> "Aku tidak tahu. Tapi ada kemungkinan seseorang lain punya akses ke mansion ini. Seseorang yang tahu tentang sistem kelistrikan dan kunci."</p>
<p><span class="speaker reza">Reza</span> "Niko. Daftar. Siapa lagi yang punya kunci atau akses?"</p>
<p><span class="speaker niko">Niko</span> "Secara legal? Aku dan Farah. Tapi kunci digital — sistem baru yang kupasang bulan lalu — hanya aku yang seharusnya punya passwordnya."</p>
<p><span class="speaker reza">Reza</span> "'Seharusnya'?"</p>`,
  choices: [
    {
      text: "Kumpulkan semua orang dan buat rencana",
      next: 'prologue_form_plan',
      effect: (s) => {
        s.flags.nikoUncertain = true;
      }
    },
    {
      text: "Langsung cari jalan keluar alternatif",
      next: 'prologue_check_exits',
      effect: (s) => {
        s.flags.nikoUncertain = true;
      }
    }
  ]
},

'prologue_check_exits': {
  text: `<p><span class="speaker arin">Arya</span> "Pintu depan — terkunci elektromagnetik."</p>
<p><span class="speaker reza">Reza</span> "Pintu belakang dapur — terkunci. Pintu samping taman — terkunci. Jendela — teralis besi."</p>
<p><span class="speaker reza">Reza</span> "Tunggu. Pintu ini berbeda — lebih tua, tidak ada kunci elektronik. Gembok klasik. Menuju basement."</p>
<p><span class="speaker reza">Reza</span> "Aku dengar sesuatu dari bawah. Dengungan mesin. Dan... musik yang sama yang di hall. Tapi dari sini, kedengarannya terbalik."</p>`,
  choices: [
    {
      text: "Buka gembok dan turun ke basement",
      danger: true,
      next: 'ch1_start',
      effect: (s) => {
        s.flags.openedBasement = true;
        s.flags.plan = 'server';
        Engine.modDanger(10);
        s.keyChoices.push('early_basement');
      }
    },
    {
      text: "Kembali ke hall dulu — jangan pergi sendirian ke basement",
      next: 'prologue_form_plan',
      effect: (s) => {
        s.flags.foundBasementDoor = true;
      }
    }
  ]
},

'prologue_kira_trace': {
  text: `<p><span class="speaker kira">Kai</span> "Sistem kunci dijalankan dari server di basement — terhubung ke semua pintu dan jendela. Lampu juga. Smart home terintegrasi."</p>
<p><span class="speaker arin">Arya</span> "Bisa kau override?"</p>
<p><span class="speaker kira">Kai</span> "Dari sini? Tidak. Firewallnya enterprise-grade. Setup profesional."</p>
<p><span class="speaker kira">Kai</span> "Tapi aku menemukan countdown timer di server. Enam jam mundur. Dan setiap jam, ada event terjadwal yang terpicu otomatis."</p>
<p><span class="speaker arin">Arya</span> "Event apa?"</p>
<p><span class="speaker kira">Kai</span> "Tidak bisa baca detailnya. Tapi timestamp event pertama... lima belas menit dari sekarang."</p>`,
  choices: [
    {
      text: "Siapkan semua orang untuk event pertama",
      next: 'prologue_form_plan',
      effect: (s) => {
        s.flags.knowsTimer = true;
        s.flags.knowsEvents = true;
        Engine.modDanger(10);
        s.cluesFound++;
      }
    }
  ]
},

'prologue_confront_vira_public': {
  text: `<p><span class="speaker arin">Arya</span> "Vira. Kau tidak terkejut. Lampu mati. Tulisan ancaman. Pintu terkunci. Dan kau berdiri seperti menonton film yang sudah kau hapal endingnya."</p>
<p><span class="speaker vira">Vira</span> "Arya si jurnalis. Selalu mencari cerita."</p>
<p><span class="speaker vira">Vira</span> "Kau mau tahu kenapa aku tidak terkejut? Karena aku sudah pernah ada di sini. Enam bulan lalu. Sebelum aku 'menghilang'."</p>
<p><span class="speaker vira">Vira</span> "Aku diundang. Sama seperti kalian. Dan aku melihat apa yang terjadi pada orang-orang sebelumnya. Aku selamat. Yang lain tidak."</p>
<p><span class="speaker vira">Vira</span> "Malam ini, siklus itu berulang. Satu-satunya cara menghentikannya — temukan siapa yang menjalankannya. Sebelum mereka menyelesaikan apa yang mereka mulai."</p>
<p><span class="speaker niko">Niko</span> "Vira, apa yang—"</p>
<p><span class="speaker vira">Vira</span> "Tiga orang akan mati malam ini, Niko. Kecuali kita lebih pintar dari yang menyetel permainan ini."</p>`,
  shake: true,
  choices: [
    {
      text: "Ambil alih situasi — buat rencana sebelum panik menguasai",
      next: 'prologue_form_plan',
      effect: (s) => {
        s.flags.viraRevealed = true;
        Engine.modAwareness('arin', 15);
        Engine.modDanger(10);
        s.keyChoices.push('vira_public_reveal');
      }
    },
    {
      text: '"Vira, siapa? Siapa yang menjalankan ini?"',
      next: 'prologue_vira_doesnt_know',
      effect: (s) => {
        s.flags.viraRevealed = true;
        Engine.modDanger(8);
      }
    }
  ]
},

'prologue_vira_doesnt_know': {
  text: `<p><span class="speaker vira">Vira</span> "Kalau aku tahu, aku tidak akan di sini. Aku akan di kantor polisi."</p>
<p><span class="speaker vira">Vira</span> "Yang aku tahu: ada seseorang yang menyebut dirinya 'Sang Penenun'. Dia merancang ini semua seperti skenario. Setiap orang di ruangan ini dipilih karena alasan tertentu."</p>
<p><span class="speaker arin">Arya</span> "Siapa Sang Penenun?"</p>
<p><span class="speaker vira">Vira</span> "Bisa siapa saja. Bisa salah satu dari kita."</p>`,
  choices: [
    {
      text: "Bentuk rencana. Sekarang.",
      next: 'prologue_form_plan',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.keyChoices.push('knows_penenun');
      }
    }
  ]
}

};
