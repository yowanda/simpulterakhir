/* ============================================================
   SIMPUL TERAKHIR — PROLOG: Undangan
   Sepuluh orang diundang ke mansion terpencil untuk pameran seni
   eksklusif. Tidak ada yang tahu apa yang menanti mereka.
   ============================================================ */

const STORY_PROLOG = {

'prologue_start': {
  chapter: 0,
  text: (s) => {
    const pc = s.playerCharacter || 'arin';
    const pcName = Engine.CHAR_DISPLAY[pc] || 'Arin';
    let text = `<div class="scene-art scene-forest"></div>`;
    text += `<p class="narration">Undangan itu datang dalam amplop hitam, tanpa perangko, tanpa alamat pengirim. Hanya nama dan satu kalimat:</p>`;
    text += `<p class="journal"><em>"Kau diundang untuk menyaksikan kebenaran. Mansion Wardhana, Sabtu, 21:00. Datang sendirian. Jangan beritahu siapapun."</em></p>`;
    text += `<p class="narration">Sepuluh orang menerima amplop yang sama. Sepuluh orang dengan rahasia yang saling terhubung oleh benang-benang yang belum mereka sadari. Dan malam ini, benang-benang itu akan ditarik.</p>`;

    // Character-specific arrival perspective
    const perspective = Engine.getPlayerPerspective();
    if (pc === 'arin') {
      text += `<p>Mobilmu memasuki jalan berbatu yang membelah hutan pinus. Lampu kota sudah lama menghilang di kaca spion. Yang tersisa hanya gelap, pohon-pohon yang terlalu rapat, dan suara kerikil di bawah ban.</p>`;
    } else if (pc === 'niko') {
      text += `<p>Kau sudah di sini sejak siang — mempersiapkan semuanya. Mansion kakekmu. Dosa keluargamu. Dan malam ini, kau akan membuka kotak Pandora yang sudah tertutup selama setengah abad. Tamu-tamu mulai berdatangan. Setiap mobil yang melewati gerbang membawa seseorang dengan potongan puzzle yang kau butuhkan.</p>`;
    } else if (pc === 'sera') {
      text += `<p>Mobilmu memasuki jalan berbatu. Sebagai psikolog, kau terbiasa membaca manusia — tapi undangan ini tidak bisa kau baca. Siapa yang mengundang sepuluh orang asing ke mansion terpencil? Lebih penting lagi: mengapa kau, seorang psikolog klinis, termasuk di antaranya?</p>`;
    } else if (pc === 'juno') {
      text += `<p>Lo naik motor — bukan mobil. Motor tua yang suaranya kayak macan batuk. Lo hampir nggak datang. Tapi undangan itu... ada sesuatu di dalamnya yang bikin lo nggak bisa tidur. Lo bukan tipe orang yang suka misteri. Lo tipe orang yang suka memecahkan sesuatu — secara literal.</p>`;
    } else if (pc === 'vira') {
      text += `<p>Kau mengenal jalan ini. Kau pernah melewatinya — enam bulan lalu, di malam yang hampir membunuhmu. Mansion Wardhana muncul di ujung jalan, dan perutmu melilit. Kau kembali. Bukan karena mau — tapi karena dia mengancam adikmu. Dan untuk adikmu, kau bersedia masuk ke neraka untuk kedua kalinya.</p>`;
    } else if (pc === 'reza') {
      text += `<p>Mobilmu — sedan tua yang sudah melihat terlalu banyak malam — memasuki jalan berbatu. Dua puluh tahun sebagai detektif, dan kasus ini yang tidak pernah bisa kau selesaikan. Keluarga Wardhana. Mansion ini. Orang-orang yang menghilang. Kau dipecat karena terlalu dekat dengan kebenaran. Sekarang undangan ini menarikmu kembali.</p>`;
    } else if (pc === 'lana') {
      text += `<p>Mobilmu memasuki jalan berbatu. Kau tersenyum. Skenarionya berjalan sempurna — persis seperti Bab 1 dari naskah yang kau tulis untuk Sang Penenun. Sepuluh karakter, satu mansion, satu malam. Bedanya: ini bukan fiksi. Dan peranmu di sini bukan sebagai tamu. Kau adalah operator. Dalang di balik tirai.</p>`;
      text += `<p class="journal"><em>[Kau tahu kebenaran: kau bekerja untuk Sang Penenun. Malam ini, kau punya agenda tersembunyi. Bagaimana kau memainkan peranmu — itu keputusanmu.]</em></p>`;
    } else if (pc === 'dimas') {
      text += `<p>Kau duduk di kursi penumpang — Lana yang menyetir. Selalu Lana yang memimpin. Kau mengamati pohon-pohon pinus melewati jendela dengan detachment klinis. Malam ini ada pekerjaan yang harus diselesaikan. Lana menyebutnya "seni". Kau menyebutnya... kau tidak menyebutnya apa-apa. Kau hanya melakukan.</p>`;
      if (s.difficulty >= 2) {
        text += `<p class="journal"><em>[Kau adalah operator Sang Penenun. "Pemotong." Tapi di bawah topeng kepatuhan, ada sesuatu yang mulai bergeser.]</em></p>`;
      }
    } else if (pc === 'kira') {
      text += `<p>Lo di belakang taxi — laptop terbuka di pangkuan, masih nge-trace anomali digital dari undangan itu. QR code tersembunyi di watermark amplop mengarah ke server di Estonia yang di-route melalui tiga proxy. Siapapun yang mengirim undangan ini — dia bukan amatir. Lo mungkin hacker terbaik di ruangan nanti, tapi lo bukan satu-satunya yang paham teknologi di permainan ini.</p>`;
    } else if (pc === 'farah') {
      text += `<p>Limousine-mu berhenti di depan mansion. Driver membukakan pintu, tapi kau tidak segera keluar. Kau menatap bangunan itu — mansion yang dibangun dengan uang keluarga Aldridge. Uang kakekmu. Dan rahasia di bawah fondasinya... rahasia yang sekarang mengancam seluruh warisan keluargamu.</p>`;
    }

    text += `<p>Mansion Wardhana muncul di ujung jalan seperti makhluk yang menunggu — tiga lantai batu granit yang menghitam oleh usia, jendela-jendela tinggi yang memantulkan cahaya bulan, dan menara observasi di sayap timur yang menjulang seperti jari telunjuk menuduh langit.</p>`;

    if (pc === 'niko') {
      text += `<p>Kau berdiri di tangga depan mansion, memasang senyum — senyum CEO muda yang kau latih di depan cermin. <span class="speaker arin">Arin</span> tiba. Jurnalis itu. Kau mengundangnya karena kau butuh seseorang yang bisa menggali kebenaran. Tapi kau juga takut dengan apa yang akan dia temukan.</p>`;
      text += `<p>"Arin! Kau datang. Aku tahu kau tidak bisa menolak misteri."</p>`;
    } else {
      text += `<p>Di halaman depan, beberapa mobil sudah terparkir. Kau bukan yang pertama. Juga bukan yang terakhir.</p>`;
      text += `<p><span class="speaker niko">Niko</span> berdiri di tangga depan mansion, senyumnya cerah seperti iklan — terlalu cerah untuk tempat segelap ini.</p>`;
      if (pc === 'arin') {
        text += `<p>"Arin! Kau datang. Aku tahu kau tidak bisa menolak misteri."</p>`;
      } else {
        text += `<p>"${pcName}! Senang kau datang. Masuk, yang lain sudah menunggu."</p>`;
      }
    }
    text += `<p>Di belakangnya, melalui pintu terbuka, kau bisa melihat hall besar dengan chandelier kristal yang bergoyang pelan meski tidak ada angin. Suara-suara samar — percakapan, musik klasik, gemerincing gelas — mengalir keluar seperti undangan kedua.</p>`;

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
  text: `<p><span class="speaker niko">Niko</span> mengangkat alis.</p>
<p>"Amplop hitam?" Tawa kecil. "Dramatik sekali. Tidak, aku mengirim undangan biasa lewat email. Desainnya minimalis — hitam dan emas. Kau tahu aku suka branding."</p>
<p>Dia merentangkan tangan ke arah mansion.</p>
<p>"Ini proyek terbaruku. Kakekku meninggalkan properti ini, dan aku mengubahnya jadi ruang pameran seni imersif. Malam ini soft launch — teman-teman dekat dan beberapa orang... menarik."</p>
<p>"Orang menarik?"</p>
<p>Niko tersenyum. Senyum yang kau kenal — senyum yang berarti dia menyembunyikan kartu.</p>
<p>"Kau akan lihat sendiri. Oh — satu hal." Suaranya turun. "Sinyal telepon agak buruk di sini. Bukan masalah besar. Mansion punya Wi-Fi sendiri."</p>
<p>Kau mencoba ponselmu. Satu bar. Berkedip-kedip antara ada dan tidak ada.</p>
<p>Niko sudah berjalan masuk. Di ambang pintu, dia berhenti.</p>
<p>"Arin? Aku senang kau di sini. Serius. Malam ini... aku butuh seseorang yang bisa kupercaya."</p>
<p>Sebelum kau sempat bertanya apa maksudnya, dia sudah menghilang ke dalam.</p>`,
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
  text: `<p>Kau berjalan melewati deretan mobil. Kebiasaan lama dari masa jurnalis — detail kecil bisa jadi cerita besar.</p>
<p>SUV hitam mengkilap. Plat Jakarta. Mahal. Mungkin Niko atau salah satu tamu kelas atasnya.</p>
<p>Sedan tua warna hijau army. Ada stiker "Ex Serviam" di bumper belakang dan bungkus rokok di dashboard. Mobil orang yang pernah berseragam.</p>
<p>Hatchback putih dengan bumper sticker "My other car is a hearse" — lucu tapi creepy. Laptop bag di kursi belakang.</p>
<p>Dan yang terakhir — motor sport hitam, parkir agak jauh dari yang lain. Helm masih di stang. Stiker band-band underground di body-nya. Kau tersenyum kecil. Itu motor Juno.</p>
<p>Tapi ada satu mobil lagi yang menarik perhatianmu. Sedan silver, parkir paling ujung, hampir tersembunyi di balik semak. Jendelanya sedikit terbuka, dan di dalam — kau bisa melihat folder manila tebal yang terbuka. Salah satu kertas yang terlihat punya header polisi.</p>`,
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
  text: `<p>Kau mengeluarkan ponsel dan memotret folder itu melalui celah jendela. Tanganmu sedikit gemetar — bukan dari dingin.</p>
<p>Dari hasil foto, kau bisa membaca beberapa kata: "...kasus tidak aktif... korban ke-7... profil serupa... mansion Wardhana..."</p>
<p>Jantungmu berdebar. Seseorang membawa file kasus pembunuhan ke pameran seni. Kasus yang melibatkan mansion ini.</p>
<p>Langkah kaki di kerikil di belakangmu.</p>
<p><span class="speaker reza">Reza</span> berdiri di sana. Pria besar dengan jas lusuh dan mata yang terlalu tajam untuk seorang tamu biasa.</p>
<p>"Mencari sesuatu?"</p>
<p>Suaranya datar. Bukan mengancam — tapi juga bukan ramah. Kau mengenali nada itu. Nada interogasi kasual.</p>
<p>"Itu mobilku," tambahnya, menunjuk sedan silver dengan dagunya. "Dan itu <em>file</em>-ku."</p>`,
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
  text: `<p><span class="speaker reza">Reza</span> menatapmu lama. Lalu tersenyum — senyum lelah orang yang sudah terlalu sering melihat kebohongan untuk tersinggung oleh keberanian.</p>
<p>"Arin Prasetya. Podcast 'Jejak Mati'. Episode 47 — kasus Pembunuh Jembatan. Kau hampir benar soal pelakunya."</p>
<p>Kau mengerjap. "Kau mendengarkan podcast-ku?"</p>
<p>"Aku mendengarkan semua orang yang bicara tentang kasus-kasusku." Dia mengeluarkan rokok dan menyalakannya. "Reza Hartono. Dulu detektif homisida. Sekarang..." hembusan asap, "...konsultan keamanan. Niko menyewa jasaku untuk malam ini."</p>
<p>"Tapi kau membawa file kasus lama."</p>
<p>Reza menatap ujung rokoknya. "Pernah dengar perasaan di perut yang bilang sesuatu tidak beres? Aku punya itu sejak menerima job ini. Daftar tamu malam ini..." dia menghisap dalam-dalam, "...cocok dengan profil korban dari kasus yang tidak pernah kututup."</p>
<p>"Kasus apa?"</p>
<p>"Tujuh orang. Tujuh tahun. Semuanya diundang ke acara eksklusif. Semuanya menghilang setelahnya. Dan semuanya..." dia menatapmu, "...punya koneksi dengan keluarga yang memiliki properti tempat acara itu diadakan."</p>
<p>Hening. Mansion berdiri di belakang kalian seperti rahang yang terbuka.</p>
<p>"Aku bisa salah," kata Reza pelan. "Semoga aku salah."</p>`,
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
  text: `<p><span class="speaker reza">Reza</span> membuang rokoknya dan menginjaknya.</p>
<p>"Karena terakhir kali aku mengabaikan perasaan ini, orang yang salah masuk penjara. Dan yang benar terus membunuh."</p>
<p>Dia menepuk bahumu — berat, seperti orang yang terbiasa menenangkan keluarga korban.</p>
<p>"Kita masuk. Amati. Jangan tunjukkan bahwa kau tahu apapun. Dan Arin — jangan percaya siapapun malam ini. Termasuk aku."</p>
<p>Kalian berjalan menuju pintu mansion bersama.</p>`,
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
  text: `<p>Kau menelepon Juno. Butuh empat kali dering sebelum dia mengangkat.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Arin! Lo udah di sana? Gue baru parkir. Tempat ini gila — kayak haunted mansion di film B."</p>
<p>"Kau juga dapat amplop hitam?"</p>
<p>Hening sebentar.</p>
<p>"Amplop hitam? Nggak. Gue diajak Niko lewat DM. Dia bilang ada pameran seni yang 'harus gue lihat'. Emang kenapa?"</p>
<p>"Tidak. Lupakan. Kita ketemu di dalam?"</p>
<p>"Bentar. Arin..." suara Juno berubah — lebih pelan, lebih serius. "Lo kenal semua yang diundang?"</p>
<p>"Belum. Kenapa?"</p>
<p>"Gue baru papasan sama satu cewek di lorong parkir. Cewek berambut hitam, gaun gelap. Dia senyum sama gue dan bilang, 'Selamat datang kembali.' Kembali? Gue belum pernah ke sini."</p>
<p>Juno terdiam.</p>
<p>"Dan Arin — gue kenal wajahnya. Itu Vira. Vira yang hilang enam bulan."</p>`,
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
  text: `<p>Kau cepat-cepat menyimpan nomor darurat lokal, mengirim pin lokasi ke kontak trusted — editor podcastmu — dan screenshot peta area.</p>
<p>Pesan terkirim. Tapi saat kau cek kembali, status berubah: "Sending..." tanpa centang. Sinyal sudah turun ke nol.</p>
<p>Wi-Fi mansion: "WARDHANA_GUEST". Kau connect. Kuat. Tapi saat kau coba browsing, semua request di-redirect ke satu halaman: splash screen pameran bertuliskan "THE LAST KNOT — Sebuah Pengalaman Imersif" dengan countdown timer.</p>
<p>Timer menunjukkan: <strong>06:00:00</strong>.</p>
<p>Enam jam. Sampai apa?</p>`,
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
    let text = `<div class="scene-art scene-cabin"></div>`;
    text += `<p>Hall utama Mansion Wardhana menghantammu dengan kontras yang sengaja — kemewahan yang berteriak di tengah kegelapan. Chandelier kristal raksasa menggantung dari langit-langit setinggi enam meter. Dinding batu granit dihiasi lukisan-lukisan besar — bukan pemandangan atau potret biasa, tapi foto-foto hitam putih lokasi kriminal yang dicetak pada kanvas raksasa.</p>`;
    text += `<p>Di tengah hall, instalasi seni utama: sepuluh kursi kayu yang disusun melingkar, masing-masing dengan spotlight individual. Di depan setiap kursi, sebuah amplop hitam tertutup.</p>`;
    text += `<p class="sound">— musik biola solo mengalun dari speaker tersembunyi, melodi yang familiar tapi sedikit off-key, seperti lullaby yang dimainkan mundur —</p>`;
    text += `<p>Kau memindai ruangan. Beberapa orang sudah hadir:</p>`;
    text += `<p><span class="speaker sera">Sera</span> duduk di sofa sudut, kacamatanya di ujung hidung, matanya memindai setiap orang yang masuk dengan intensitas yang hampir fisik. Dia mengangguk padamu — anggukan kecil yang berarti "kita perlu bicara".</p>`;
    text += `<p><span class="speaker lana">Lana</span> berdiri di dekat salah satu foto kriminal, kepalanya dimiringkan seperti mengapresiasi karya seni. Gaun hitamnya menyatu dengan bayangan. Jarinya mengetuk-ngetuk di udara — menulis catatan imajiner.</p>`;
    text += `<p><span class="speaker farah">Farah</span> berdiri di dekat bar dengan segelas wine, berbicara pada <span class="speaker dimas">Dimas</span> yang mendengarkan dengan senyum sopan dan mata yang tidak berkedip.</p>`;

    if (s.flags.knowsViraHere || s.flags.warnedJunoAboutVira) {
      text += `<p><span class="speaker vira">Vira</span> ada di pojok terjauh ruangan, berdiri sendiri. Siluetnya seperti lukisan — terlalu sempurna, terlalu diam. Matanya menangkapmu dan bibirnya bergerak tanpa suara. Kau tidak bisa membaca apa yang dia katakan.</p>`;
    } else {
      text += `<p>Dan di pojok terjauh — seseorang yang membuatmu berhenti melangkah. <span class="speaker vira">Vira</span>. Vira Deviani. Enam bulan menghilang tanpa jejak, dan sekarang dia berdiri di sini, secantik dan semisterius poster film noir. Matanya bertemu matamu. Senyum tipis. Bukan senyum yang kau ingat.</p>`;
    }

    if (s.flags.calledJuno) {
      text += `<p><span class="speaker juno">Juno</span> sudah menunggumu di dekat pintu masuk, tangannya disilangkan, matanya waspada.</p>`;
      text += `<p>"Gue nggak suka tempat ini, Arin. Terlalu... disetting."</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> muncul dari lorong samping, boots-nya berdetak di lantai marmer. Dia mengangguk padamu — anggukan jalanan, cepat dan penuh kode.</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> menepuk tangannya dari tengah ruangan.</p>`;
    text += `<p>"Semuanya sudah hadir! Sempurna. Sebelum kita mulai — perkenalan singkat. Sebagian dari kalian sudah saling kenal, sebagian belum. Malam ini akan lebih... intim kalau kita semua tahu siapa yang ada di ruangan ini."</p>`;

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
  text: `<p>Kau duduk di samping Sera. Tanganmu menyentuh tangannya — tidak sengaja, atau mungkin sengaja. Sera tidak menarik tangannya. Selama satu detik yang terlalu panjang, kalian hanya duduk seperti itu, jari-jari yang hampir bertautan di sofa velvet mansion orang asing.</p>
<p>Lalu Sera berdeham dan masuk ke "mode analisis" — batas profesional yang kalian berdua gunakan sebagai tameng dari perasaan yang terlalu rumit untuk malam seperti ini.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Tiga hal." Jarinya menghitung — jari yang tadi hampir menggenggam milikmu. "Satu — aku menghitung sepuluh undangan tapi sebelas tempat duduk di meja makan. Untuk siapa kursi kosong itu?"</p>
<p>"Dua — pria di dekat bar." Matanya bergerak ke arah Dimas. "Microexpression-nya tidak sinkron. Dia tersenyum tapi pupilnya tidak melebar. Itu bukan senyum sosial — itu masking. Tipe yang aku pelajari di bab psychopathology."</p>
<p>"Dan tiga..." Sera melepas kacamatanya. Tangannya gemetar sangat sedikit. "Vira. Aku sudah mengobservasi Vira selama dua puluh menit sejak datang. Body language-nya... Arin, Vira yang aku kenal itu orang yang <em>tidak bisa diam</em>. Dia selalu bergerak, selalu ekspresif. Vira yang ini — posturnya terlalu terkontrol. Gerakan matanya terlalu sistematis. Seperti sedang mengevaluasi ruangan. Bukan sebagai tamu — sebagai <em>predator</em>."</p>
<p>Sera menatapmu.</p>
<p>"Arin, aku takut. Tapi aku lebih takut kalau aku diam dan ternyata aku benar."</p>`,
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
  text: `<p>Kalian berdua berjalan ke ruang makan di sayap barat. Meja panjang dari kayu gelap, tertata sempurna. Sepuluh tempat duduk dengan name card — dan satu lagi di ujung kepala meja. Tanpa nama.</p>
<p>Tapi yang membuatmu merinding bukan kursi kosong itu. Yang membuatmu merinding adalah apa yang ada di piring di depan kursi itu: sebuah amplop hitam yang sudah terbuka, dan di dalamnya — foto polaroid.</p>
<p>Foto itu menunjukkan sepuluh orang yang ada di hall malam ini. Diambil dari atas — dari sudut yang tidak mungkin dijangkau kecuali ada kamera tersembunyi di chandelier.</p>
<p>Foto itu diambil <em>malam ini</em>. Pakaian yang sama. Posisi yang sama. Tapi di foto itu, ada tanda silang merah di atas wajah tiga orang.</p>
<p><span class="speaker sera">Sera</span> membekap mulutnya. "Arin... itu tanda target."</p>
<p>Kau membalik foto. Di belakangnya, tulisan tangan rapi:</p>
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
  text: `<p>Kau membawa foto itu ke hall utama dan mengangkatnya tinggi-tinggi.</p>
<p>"Perhatian, semuanya."</p>
<p>Percakapan berhenti. Sepuluh pasang mata mengarah padamu.</p>
<p>"Aku menemukan ini di ruang makan. Foto kita semua — diambil malam ini. Dengan tanda target di tiga wajah."</p>
<p>Reaksi berantai:</p>
<p><span class="speaker reza">Reza</span> langsung menghampiri, matanya tajam. "Tunjukkan." Dia memeriksa foto seperti profesional — sudut, pencahayaan, detail.</p>
<p><span class="speaker farah">Farah</span> memucat. Gelasnya bergetar.</p>
<p><span class="speaker lana">Lana</span> mendekat dengan ekspresi yang sulit dibaca — takut atau <em>tertarik</em>?</p>
<p><span class="speaker kira">Kira</span> — gadis kecil dengan hoodie dan headphone — langsung mengeluarkan laptop dari entah mana. "Kamera tersembunyi di chandelier. Aku bisa tracing feed-nya kalau aku dapat akses ke router lokal."</p>
<p><span class="speaker juno">Juno</span> menghampirimu. "Siapa tiga yang di-target?"</p>
<p>Kau membalik foto. Tiga tanda silang: satu di atas wajah <span class="speaker reza">Reza</span>, satu di atas <span class="speaker farah">Farah</span>, dan satu di atas... <span class="speaker vira">Vira</span>.</p>
<p><span class="speaker vira">Vira</span> menatap foto itu. Ekspresinya tidak berubah. Sama sekali. Seolah melihat cuaca di TV.</p>
<p>"Menarik," kata Vira pelan. "Seseorang suka bermain."</p>
<p><span class="speaker niko">Niko</span> mengambil alih. "Oke. Ini jelas bukan bagian dari pameran. Aku akan—"</p>
<p>Lampu mati.</p>
<p>Gelap total. Tiga detik yang terasa tiga jam.</p>
<p>Lampu menyala kembali.</p>
<p>Foto di tanganmu sudah hilang.</p>`,
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
  text: `<p>Kau berjalan ke pojok di mana Vira berdiri sendirian. Setiap langkah terasa lebih berat dari yang seharusnya — seolah gravitasi di sekitar Vira sedikit berbeda.</p>
<p>Dari sudut matamu, kau melihat Niko mengamati kalian berdua. Rahangnya mengeras — ekspresi yang kau kenal dari masa kuliah: posesif, cemburu, dan berusaha menyembunyikan keduanya.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Arin." Suaranya seperti sutra yang disobek — indah tapi dengan tepi yang tajam. "Aku tahu kau akan datang. Kau selalu datang."</p>
<p>Ada sesuatu di cara dia mengucapkan namamu — sesuatu yang mengingatkanmu pada malam-malam di atap kampus, saat batas antara teman dan sesuatu yang lebih kabur seperti asap rokok di antara kalian.</p>
<p>"Vira. Enam bulan."</p>
<p>"Enam bulan, dua minggu, empat hari." Senyum. "Tapi siapa yang menghitung?"</p>
<p>Matanya bergerak sekilas ke arah Niko. Kilatan sesuatu — sakit, marah, rindu? — melintas di wajahnya sebelum topeng kembali terpasang.</p>
<p>"Di mana kau—"</p>
<p>"Pertanyaan yang salah." Dia mengangkat jari — kuku panjang, cat hitam sempurna. "Pertanyaan yang benar adalah: kenapa aku kembali <em>sekarang</em>? Kenapa di <em>tempat ini</em>?"</p>
<p>Dia mendekat. Kau bisa mencium parfumnya — vanilla dan sesuatu yang lebih gelap, metalik, seperti darah kering. Di belakangmu, kau merasakan tatapan Sera — tajam, analitis, dan mungkin sedikit cemburu.</p>
<p>"Aku kembali karena ini belum selesai, Arin. Yang dimulai di mansion ini lima puluh tahun lalu — siklus itu masih berjalan. Dan malam ini..." matanya berkilat dalam cahaya chandelier, "...malam ini kita semua bagian darinya. Mau tidak mau."</p>
<p>"Kau bicara seperti orang yang tahu apa yang akan terjadi."</p>
<p>"Mungkin aku tahu." Vira memiringkan kepala. "Mungkin aku <em>sudah melihatnya</em>. Atau mungkin aku gila. Pilih yang membuat kau bisa tidur malam ini."</p>`,
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
  text: `<p><span class="speaker vira">Vira</span> menatapmu. Dan untuk sekejap — sekejap yang begitu cepat kau hampir meragukan penglihatanmu — matanya berubah. Bukan dingin atau misterius. Tapi <em>takut</em>. Takut seperti anak kecil yang terbangun dari mimpi buruk.</p>
<p>"Arin." Suaranya berbisik, bergetar. "Jangan percaya yang di atas."</p>
<p>"Apa maksud—"</p>
<p>Dan secepat itu datang, ekspresi itu pergi. Kembali ke topeng dingin dan senyum enigmatik.</p>
<p>"Oh, aku hanya bercanda. Kau tahu aku suka dramatis." Tawa kecil yang terlalu terlambat untuk terdengar natural.</p>
<p>Niko menepuk tangannya di tengah ruangan.</p>`,
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
  text: `<p><span class="speaker vira">Vira</span> mundur setengah langkah. Untuk pertama kalinya, senyumnya tergelincir.</p>
<p>"Bersalah." Dia menguji kata itu. "Kata yang menarik dari seseorang yang membangun karir dari mayat orang lain. Podcast-mu, Arin — setiap episode adalah cerita kematian seseorang. Kau <em>menikmati</em> ini. Kita tidak berbeda."</p>
<p>Pukulan yang tepat sasaran. Kau menelan ludah.</p>
<p>"Tapi kau benar. Aku tahu sesuatu." Vira merapikan rambutnya. "Satu petunjuk gratis: malam ini, perhatikan tangan. Bukan mulut. Mulut berbohong. Tangan menunjukkan kebenaran."</p>
<p>Dia berjalan pergi tanpa menoleh.</p>`,
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
  text: `<p>Kau mendekati instalasi sepuluh kursi di tengah hall. Kayu mahogani gelap, diukir dengan pola-pola yang kau kenali — simpul Celtic, tapi dimodifikasi. Setiap simpul berbeda.</p>
<p>Di depan setiap kursi, amplop hitam dengan nama: Arin, Niko, Sera, Juno, Vira, Reza, Lana, Dimas, Kira, Farah.</p>
<p>Kau mengambil amplopmu. Di dalamnya, selembar kartu hitam dengan tulisan emas:</p>
<p class="journal"><em>"ARIN PRASETYA — Sang Pencari. Kau mencari kebenaran di tempat gelap. Tapi apakah kau siap menemukan kebenaran tentang dirimu sendiri? Malam ini, setiap pilihan adalah simpul. Setiap simpul bisa mengikat — atau mencekik."</em></p>
<p>Kau melihat ke sekeliling. <span class="speaker kira">Kira</span> — gadis muda dengan hoodie — sedang membuka amplopnya juga. Matanya melebar. Dia menangkap tatapanmu dan mengangkat kartunya supaya kau bisa membaca dari jauh:</p>
<p class="journal"><em>"KIRA CHEN — Sang Pengawas. Kau melihat semua yang digital. Tapi apakah kau bisa melihat apa yang nyata?"</em></p>
<p>Kira mendekat dan berbisik: "Ini bukan pameran seni. Ini profiling. Seseorang sudah meneliti kita semua."</p>`,
  choices: [
    {
      text: '"Kira, bisa kau cek siapa yang hosting server Wi-Fi di sini?"',
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
  text: `<p><span class="speaker kira">Kira</span> sudah membuka laptop sebelum kau selesai bertanya. Jarinya menari di keyboard dengan kecepatan yang tidak wajar.</p>
<p>"Sudah. Aku scan jaringan ini sebelum masuk. Kebiasaan." Dia membalik layar ke arahmu. "Lihat. Router mansion terhubung ke NAS server lokal — penyimpanan internal. Tapi ada satu device lagi di jaringan yang tidak masuk akal."</p>
<p>"Apa?"</p>
<p>"Server stream. Aktif. Streaming video ke IP eksternal." Kira menelan ludah. "Seseorang sedang <em>menyiarkan</em> apa yang terjadi di mansion ini. Live."</p>
<p>Kalian berdua diam.</p>
<p>"Dan Arin — aku menemukan satu hal lagi di NAS server." Kira memiringkan layarnya. "Folder bertanggal mundur tujuh tahun. Setiap folder berisi video. Aku baru buka satu."</p>
<p>Dia memutar video di laptop. Gambar grainy, gelap — tapi jelas. Sebuah ruangan di mansion ini. Seseorang berlari. Seseorang berteriak. Dan kemudian...</p>
<p>Kira menutup laptop.</p>
<p>"Setiap tahun. Selama tujuh tahun. Ada 'acara' di mansion ini. Dan setiap kali..." suaranya bergetar, "...ada yang tidak keluar hidup-hidup."</p>`,
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
  text: `<p>Kau bergerak menuju pintu depan. Tangan di gagang — menarik.</p>
<p>Terkunci.</p>
<p>Kau menarik lebih kuat. Tidak bergerak. Pintu yang terbuka lebar saat kau masuk tadi sekarang terkunci mati.</p>
<p><span class="speaker kira">Kira</span> memeriksa laptopnya. "Kunci elektromagnetik. Dikontrol dari server. Semua pintu keluar..." jarinya bergerak cepat, "...terkunci tiga menit lalu. Tepat saat tamu terakhir masuk."</p>
<p>Kau menoleh ke <span class="speaker niko">Niko</span> yang berdiri di tengah hall, masih tersenyum.</p>
<p>"Niko! Pintu terkunci!"</p>
<p>Niko mengangguk tenang. Terlalu tenang.</p>
<p>"Aku tahu. Itu bagian dari pengalaman imersif. Santai, Arin — kunci akan terbuka otomatis saat pameran selesai. Ini escape room versi premium."</p>
<p>Kau menatap Kira. Kira menatapmu balik. Kalian berdua tahu: ini bukan escape room.</p>`,
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
  text: `<p>Kau mengambil amplop Niko dan membacanya:</p>
<p class="journal"><em>"NIKO WARDHANA — Sang Pewaris. Kakekmu membangun takhta dari tulang. Apakah kau akan duduk di atasnya — atau menghancurkannya?"</em></p>
<p>Dingin. Spesifik. Siapapun yang menulis ini tahu tentang keluarga Niko.</p>
<p>Kau membuka amplop Lana:</p>
<p class="journal"><em>"LANA MAHARANI — Sang Narator. Kau menulis tentang pembunuhan. Tapi apakah kau hanya menulis — atau juga menginspirasi?"</em></p>
<p>Dan satu lagi — amplop Dimas:</p>
<p class="journal"><em>"DIMAS SURYA — Sang Pemotong. Kau memotong tubuh mati untuk ilmu. Tapi apakah kau pernah bertanya apa rasanya memotong yang masih hidup?"</em></p>
<p>Kau meletakkan amplop terakhir dengan tangan yang sedikit gemetar. Seseorang tahu segalanya tentang mereka semua. Rahasia, kelemahan, ketakutan.</p>
<p>"Membaca surat orang lain?" <span class="speaker lana">Lana</span> berdiri di belakangmu. Suaranya tenang, seperti narator audiobook. "Itu tidak sopan. Tapi bisa dimengerti — dari seorang jurnalis."</p>`,
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
  text: `<p><span class="speaker lana">Lana</span> mengambil kartunya dari saku dan membacanya ulang seperti mengapresiasi puisi.</p>
<p>"Menginspirasi. Kata yang kuat." Dia melipat kartu kembali. "Aku penulis fiksi, Arin. Fiksi. Kalau setiap penulis thriller dituduh menginspirasi pembunuhan, Stephen King sudah di penjara sejak 1980."</p>
<p>"Tapi kasus di buku ketigamu — 'Anatomi Malam' — detail-detailnya cocok dengan kasus nyata yang bahkan polisi tidak publikasikan."</p>
<p>Lana menatapmu. Tatapan yang kau rasakan sampai ke tulang belakang.</p>
<p>"Kau sudah riset tentang aku." Bukan pertanyaan. "Bagus. Aku juga sudah riset tentang kau." Dia mendekat. "Sumber podcast episode 32-mu. Yang bunuh diri. Aku kenal dia. Dan dia tidak bunuh diri, Arin."</p>
<p>Dunia sedikit berputar.</p>
<p>"Kita punya banyak yang bisa dibicarakan malam ini." Lana tersenyum — senyum yang bisa berarti seribu hal. "Tapi nanti. Tuan rumah ingin mulai."</p>`,
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
  text: `<p>Kau berjalan ke deretan foto kriminal di dinding. Dari dekat, detail-detailnya lebih disturbing — bukan foto dokumentasi polisi biasa, tapi artistik. Pencahayaan diatur. Komposisi disengaja. Seseorang mengubah lokasi kejahatan menjadi karya seni.</p>
<p><span class="speaker lana">Lana</span> berdiri di depan foto terbesar — sebuah ruangan dengan lantai yang dihiasi pola darah kering membentuk lingkaran sempurna.</p>
<p>"Indah, bukan? Dalam cara yang membuatmu malu mengakuinya."</p>
<p>Kau menoleh. Lana Maharani. Kau mengenali wajahnya dari sampul belakang novelnya.</p>
<p>"Lana Maharani. 'Anatomi Malam'. 'Tujuh Belati'. 'Sang Penenun'."</p>
<p>"Fan?" Dia tidak menatapmu — masih memandang foto.</p>
<p>"Reviewer. Episode 51 podcast-ku. Aku bilang novel-novelmu 'terlalu akurat untuk nyaman'."</p>
<p>"Ah. Kau yang bilang aku mungkin psychopath." Sekarang dia menoleh. "Aku suka review itu. Paling jujur yang pernah kuterima."</p>
<p>Dia menunjuk foto di dinding. "Kau tahu apa yang menarik dari foto-foto ini? Mereka semua dari lokasi yang sama. Mansion ini. Berbeda tahun, berbeda ruangan, tapi tempat yang sama."</p>
<p>"Bagaimana kau tahu?"</p>
<p>"Karena aku pernah meneliti mansion Wardhana untuk novel terakhirku yang belum terbit." Mata Lana berkilat. "Novel tentang sepuluh orang yang diundang ke sebuah mansion. Dan satu per satu..."</p>
<p>Dia tidak menyelesaikan kalimatnya. Tidak perlu.</p>
<p>Lana mendekat. Parfumnya mahal — tapi ada sesuatu di bawahnya. Kalkulasi. Setiap kata, setiap gesture, setiap kontak mata adalah manipulasi yang sudah diperhitungkan. Dalang yang melihat orang sebagai karakter dalam novelnya.</p>
<p>"Kau tahu, Arin..." Jarinya menyentuh bahumu — ringan, intim, disengaja. "Aku suka jurnalis. Kalian dan novelis — dua sisi mata uang yang sama. Bedanya, aku menciptakan monster. Kau mencari mereka." Senyum. "Pertanyaannya: siapa yang lebih bahaya?"</p>
<p>Di belakang Lana, kau melihat <span class="speaker dimas">Dimas</span> mengamati interaksi ini. Ada kilatan sesuatu di matanya — cemburu? Possessiveness? Lana adalah pusat gravitasinya, dan setiap orang yang mendekati Lana adalah ancaman.</p>`,
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
  text: `<p><span class="speaker lana">Lana</span> mulai berjalan pelan di sepanjang deretan foto, seperti kurator di galeri pribadinya.</p>
<p>"Mansion Wardhana dibangun tahun 1971 oleh dua keluarga — Wardhana dan Aldridge. Selama konstruksi, tujuh pekerja tewas dalam kecelakaan yang... anehnya konsisten. Semuanya jatuh dari ketinggian. Semuanya di sayap timur. Semuanya pada hari yang sama setiap bulan."</p>
<p>"Setelah selesai dibangun, mansion ini menjadi tempat pertemuan eksklusif. Pejabat, pengusaha, militer. Dan setiap tahun, pada tanggal yang sama, satu orang yang hadir di pertemuan itu... menghilang."</p>
<p>"Resmi: meninggalkan pesta karena darurat keluarga. Tidak pernah dilaporkan hilang. Karena keluarga mereka menerima uang tutup mulut."</p>
<p>Lana berhenti di foto terakhir.</p>
<p>"Tujuh tahun terakhir, polanya berulang. Tapi sekarang bukan pejabat — orang biasa. Diundang ke acara di mansion ini. Dan..."</p>
<p>"Tidak ada yang keluar," potongmu.</p>
<p>"Satu yang keluar. Selalu satu. Yang lain..." Lana mengedikkan bahu dengan elegansi yang dingin. "...menjadi bagian dari koleksi."</p>`,
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
  text: `<p>Kau bergabung dengan <span class="speaker farah">Farah</span> dan <span class="speaker dimas">Dimas</span> di bar. Farah menuangkan wine dengan tangan yang sedikit gemetar — tangan seorang heiress yang terbiasa pegang gelas kristal tapi malam ini gelasnya terasa terlalu berat. Dimas berdiri di sampingnya — posturnya sempurna, rileks tapi waspada, seperti kucing yang sedang berpura-pura tidur.</p>
<p>Kau menangkap sesuatu: mata Dimas tidak menatap Farah saat bicara dengannya. Matanya terus bergerak ke arah sofa sudut — ke arah Sera. Ada intensitas di sana yang bukan sekedar ketertarikan kasual. Itu obsesi.</p>
<p><span class="speaker farah">Farah</span></p>
<p>"Oh, kau pasti Arin. Niko cerita tentang kau — podcaster, kan? Sangat... berani." Nada yang susah diterjemahkan. Pujian atau hinaan halus. Farah adalah tipe yang bisa membunuhmu dengan sopan santun dan membuatmu berterima kasih.</p>
<p>"Dan kau Farah Aldridge. Keluarga yang co-founded mansion ini bersama keluarga Wardhana."</p>
<p>Farah menenggak wine-nya terlalu cepat. Di balik armor old money-nya, ada sesuatu yang retak — ego seorang pewaris yang terbiasa membeli jalan keluar tapi malam ini merasakan bahwa uangnya tidak akan cukup.</p>
<p>"Keluargaku <em>mendanai</em> pembangunan mansion ini. Yang membangun adalah keluarga Wardhana." Koreksi yang terasa penting baginya — negosiator sejati selalu mulai dengan menetapkan posisi. "Aku di sini karena Niko bilang akan ada pengumuman tentang properti ini. Sebagai co-owner, aku harus hadir."</p>
<p>Di ujung bar, <span class="speaker lana">Lana</span> mendekati Niko. Kau melihat tangannya menyentuh lengan Niko — gesture yang terlalu intim untuk orang yang baru kenal. Niko tidak menolak. Mereka berbisik, dan Lana tertawa — tawa rendah, seduktif, penuh kalkulasi. Manipulator mengenali manipulator.</p>
<p><span class="speaker dimas">Dimas</span> mengulurkan tangan. Jabat tangannya dingin dan kering — tangan orang yang terlalu sering dicuci.</p>
<p>"Dimas Surya. Mahasiswa kedokteran forensik. Aku di sini karena Lana mengundangku sebagai konsultan untuk novel barunya." Saat menyebut nama Lana, ada perubahan di matanya — kepatuhan, ketergantungan. Seperti anjing yang terlatih menyebut nama tuannya. Senyum tipis. "Ironis ya — forensik di pameran seni."</p>
<p>"Atau sangat pas," gumam Farah, memandang foto-foto kriminal di dinding. Tangannya gemetar lagi — tapi kali ini dia menyembunyikannya di balik gelas.</p>`,
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
  text: `<p><span class="speaker farah">Farah</span> meletakkan gelasnya terlalu keras. Wine tumpah sedikit — merah di atas marmer putih.</p>
<p>"Rumor. Itu namanya rumor." Suaranya meninggi sedikit. "Setiap bangunan tua punya cerita horor. Itu bukan berarti—"</p>
<p>Dia berhenti. Menarik napas. Kembali ke composure socialite-nya.</p>
<p>"Maaf. Aku hanya... tidak suka tempat ini. Kakekku meninggal di sini. Serangan jantung, 2019. Di ruang kerja di lantai tiga." Dia menunjuk ke atas. "Niko menjanjikan bahwa lantai tiga tidak akan digunakan malam ini. Ruang pribadi keluarga."</p>
<p><span class="speaker dimas">Dimas</span> menambahkan dengan nada klinis: "Serangan jantung bisa dipicu oleh banyak hal. Stres. Ketakutan. Atau substansi tertentu yang tidak terdeteksi dalam autopsi standar."</p>
<p>Farah menatap Dimas seperti baru pertama kali benar-benar melihatnya.</p>
<p>"Kenapa kau bilang itu?"</p>
<p>Dimas mengangkat bahu. "Fakta medis. Bukan akusasi."</p>
<p>Ketegangannya bisa kau potong dengan pisau.</p>`,
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
  text: `<p><span class="speaker dimas">Dimas</span> memiringkan kepalanya. Gerakan yang terlalu mirip burung pemangsa.</p>
<p>"Membedakan kecelakaan dari pembunuhan? Tentu. Itu pekerjaan sehari-hariku." Jeda yang diperhitungkan. "Tapi pertanyaan yang lebih menarik adalah: bisakah kau membuat pembunuhan terlihat seperti kecelakaan?"</p>
<p>Farah tersedak wine-nya.</p>
<p>"Jawaban akademisnya: ya. Dengan pengetahuan anatomi yang cukup, alat yang tepat, dan waktu yang cukup — hampir semua pembunuhan bisa disamarkan." Senyum sopannya tidak berubah. "Tapi tentu saja, aku hanya bicara teori."</p>
<p>"Tentu saja," katamu. Tenggorokanmu kering.</p>
<p>Niko menepuk tangannya di tengah hall.</p>`,
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
      text += `<p><span class="speaker kira">Kira</span> menghampiri kalian berdua, laptop setengah terbuka di tangannya.</p>`;
    } else {
      text += `<p><span class="speaker kira">Kira</span> — gadis kecil yang sejak tadi duduk di sudut dengan laptop — tiba-tiba menghampirimu.</p>`;
    }
    text += `<p>"Arin Prasetya, kan? Aku Kira. Aku dengerin podcast lu." Bicaranya cepat, efisien, tanpa basa-basi. "Dengerin — gue hack jaringan Wi-Fi mansion ini. Ada server yang streaming live feed ke IP luar. Kita sedang ditonton."</p>`;
    text += `<p>"Dan semua pintu keluar dikunci elektromagnetik tiga menit yang lalu."</p>`;
    if (s.flags.seraAlliance) {
      text += `<p><span class="speaker sera">Sera</span> memucat. "Kita terjebak?"</p>`;
      text += `<p>"Kita terkunci di dalam dengan seseorang yang sudah merencanakan ini bertahun-tahun," koreksi Kira. "Nggak sama."</p>`;
    }
    text += `<p>Niko menepuk tangannya di tengah ruangan.</p>`;
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
    let text = `<p>Semua orang berkumpul. Niko berdiri di tengah lingkaran kursi, chandelier di atasnya memancarkan cahaya yang membuat bayangannya terpecah ke sepuluh arah.</p>`;
    text += `<p><span class="speaker niko">Niko</span></p>`;
    text += `<p>"Terima kasih sudah datang. Semua. Aku tahu beberapa dari kalian bertanya-tanya kenapa kalian di sini."</p>`;
    text += `<p>"Jawaban singkatnya: malam ini kalian akan menyaksikan — dan menjadi bagian dari — sebuah karya seni yang belum pernah ada sebelumnya."</p>`;
    text += `<p>"Mansion ini punya sejarah. Sebagian dari kalian sudah tahu. Keluargaku membangun tempat ini lima puluh tahun lalu — dan selama lima puluh tahun, tempat ini menyimpan rahasia yang ingin dikubur banyak orang."</p>`;

    if (s.flags.revealedPhotoToAll) {
      text += `<p>"Dan ya — aku tahu tentang foto yang Arin temukan." Niko menatapmu. "Itu bukan ancaman. Itu bagian dari pameran. Performance art. Provocative, memang sengaja."</p>`;
      text += `<p><span class="speaker reza">Reza</span> mendengus. "Performance art dengan tanda target di wajah orang? Itu bukan seni. Itu intimidasi."</p>`;
    }

    text += `<p>"Malam ini, kita akan membuka rahasia itu bersama. Setiap dari kalian punya koneksi dengan mansion ini — meskipun kalian belum menyadarinya. Dan pameran ini dirancang untuk mengungkap koneksi itu."</p>`;
    text += `<p>Dia menunjuk amplop hitam di setiap kursi.</p>`;
    text += `<p>"Di amplop kalian ada peran masing-masing dalam pengalaman malam ini. Anggap ini seperti escape room — tapi lebih personal."</p>`;
    text += `<p><span class="speaker juno">Juno</span> mengangkat tangan. "Dan kalau ada yang nggak mau main?"</p>`;
    text += `<p>Niko tersenyum. "Pintu akan terbuka saat pameran selesai. Enam jam dari sekarang. Sampai saat itu — kita semua pemain."</p>`;
    text += `<p><span class="speaker reza">Reza</span> berdiri. "Niko, aku disewa untuk keamanan. Bukan untuk dikurung. Buka pintunya."</p>`;
    text += `<p>"Reza, santai. Ini—"</p>`;
    text += `<p>Lampu mati.</p>`;
    text += `<p>Kegelapan total. Lima detik. Seseorang menjerit — jeritan pendek, terpotong.</p>`;
    text += `<p>Lampu menyala.</p>`;
    text += `<p><span class="speaker farah">Farah</span> menutup mulutnya dengan kedua tangan. <span class="speaker sera">Sera</span> mundur ke dinding. <span class="speaker juno">Juno</span> sudah dalam posisi siap berkelahi.</p>`;
    text += `<p>Di dinding, tepat di atas pintu keluar utama, ada tulisan baru — ditulis dengan sesuatu yang merah dan basah:</p>`;
    text += `<p class="journal" style="font-size:1.3em"><em>"PERMAINAN DIMULAI. SEBELUM FAJAR, TIGA SIMPUL AKAN TERPUTUS."</em></p>`;
    text += `<p><span class="speaker reza">Reza</span> menyentuh tulisan itu. Mencium jarinya. "Cat," katanya. "Bukan darah. Tapi pesannya jelas."</p>`;
    text += `<p><span class="speaker lana">Lana</span> berbisik pada dirinya sendiri, cukup keras untuk kau dengar: "Bab satu."</p>`;

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
      text: "Minta Kira trace siapa yang mengontrol lampu dan kunci",
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
    let text = `<p>Kau memundurkan diri ke sudut dan mengamati. Kebiasaan jurnalis: saat semua orang panik, kau observasi.</p>`;
    text += `<p><strong>Niko</strong> — terkejut, tapi ada lapisan di bawahnya. Matanya bergerak terlalu cepat, mengkalkulasi. Ini mungkin bukan rencananya, tapi dia tidak sepenuhnya tidak siap.</p>`;
    text += `<p><strong>Sera</strong> — takut, tapi juga mengamati. Kalian memang satu tipe.</p>`;
    text += `<p><strong>Juno</strong> — marah. Reaksi fight, bukan flight. Tangannya terkepal, tubuh condong ke depan.</p>`;
    text += `<p><strong>Reza</strong> — profesional. Sudah dalam mode detektif. Tangan di pinggul — kebiasaan lama, mencari pistol yang tidak ada.</p>`;
    text += `<p><strong>Farah</strong> — ketakutan murni. Gemetar, pucat. Tapi matanya... matanya bergerak ke lantai tiga. Dia tahu sesuatu tentang tempat itu.</p>`;
    text += `<p><strong>Kira</strong> — sudah di laptop. Jari mengetik. Wajah diterangi layar biru. Fokus, bukan panik.</p>`;
    text += `<p><strong>Vira</strong> — <em>tidak bereaksi sama sekali</em>. Berdiri dengan postur yang sama, senyum yang sama, seperti semua yang terjadi adalah cuaca yang sudah dia ramalkan.</p>`;

    if (s.difficulty >= 2) {
      text += `<p><strong>Lana</strong> — bibirnya bergerak. Berbisik. Kau bisa membaca gerak bibirnya: "Tepat waktu." Siapa yang tepat waktu?</p>`;
      text += `<p><strong>Dimas</strong> — tenang. Memeriksa sesuatu di tasnya. Tas medis. Dia sudah menyiapkan peralatan medis untuk malam ini. Kenapa?</p>`;
    } else {
      text += `<p><strong>Lana</strong> — menulis sesuatu di notes kecil. Novelis — selalu mencatat.</p>`;
      text += `<p><strong>Dimas</strong> — tenang. Terlalu tenang untuk mahasiswa di situasi ini.</p>`;
    }

    text += `<p>Dua orang tidak terkejut: Vira dan `;
    text += s.difficulty >= 2 ? `Lana. ` : `Dimas. `;
    text += `Itu bukan bukti — tapi itu catatan penting.</p>`;

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
    let text = `<p>Kau menarik beberapa orang ke sudut ruangan — jauh dari telinga yang tidak diinginkan.</p>`;
    let allies = ['sera'];
    if (s.flags.rezaAlliance) allies.push('reza');
    if (s.flags.kiraAlliance) allies.push('kira');
    if (!allies.includes('juno')) allies.push('juno');

    text += `<p>Di kelompokmu: `;
    text += allies.map(a => `<span class="speaker ${a}">${Engine.CHAR_DISPLAY[a]}</span>`).join(', ');
    text += `.</p>`;

    text += `<p><span class="speaker juno">Juno</span>: "Oke. Simpel. Kita cari jalan keluar lain, hubungi polisi, dan—"</p>`;
    text += `<p><span class="speaker sera">Sera</span>: "Sinyal telepon nol. Wi-Fi dikontrol. Dan semua pintu keluar terkunci elektromagnetik."</p>`;
    text += `<p>"Jendela?" tanya Juno.</p>`;

    if (allies.includes('reza')) {
      text += `<p><span class="speaker reza">Reza</span>: "Aku sudah cek. Lantai satu — jendela dipasangi teralis dekoratif. Keliatan hiasan, tapi itu besi tempa. Tidak bisa dipotong tanpa alat berat."</p>`;
    }

    if (allies.includes('kira')) {
      text += `<p><span class="speaker kira">Kira</span>: "Aku bisa coba override sistem kunci dari server lokal. Tapi butuh akses fisik ke ruang server — yang kemungkinan di basement."</p>`;
    }

    text += `<p>Opsi terbentuk di kepalamu.</p>`;
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
  text: `<p><span class="speaker niko">Niko</span> menggeleng. Untuk pertama kalinya, kau melihat ketidakpastian di matanya.</p>
<p>"Tulisan itu — itu bukan bagian dari pameran. Aku merancang semuanya. Instalasi, pencahayaan, foto-foto. Tapi tulisan itu..." dia menatap dinding, "...itu bukan aku."</p>
<p>"Lalu siapa?"</p>
<p>Niko menelan ludah. "Aku... tidak tahu. Tapi ada kemungkinan—" dia menunduk, "—bahwa seseorang lain punya akses ke mansion ini. Seseorang yang tahu tentang sistem kelistrikan dan kunci."</p>
<p><span class="speaker reza">Reza</span> muncul di sampingnya. "Niko. Daftar. Siapa lagi yang punya kunci atau akses ke properti ini?"</p>
<p>"Secara legal? Aku dan Farah. Tapi kunci digital — sistem baru yang kupasang bulan lalu — hanya aku yang seharusnya punya passwordnya."</p>
<p>"'Seharusnya'?"</p>
<p>Niko tidak menjawab.</p>`,
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
  text: `<p>Kau dan <span class="speaker reza">Reza</span> bergerak cepat, memeriksa setiap pintu dan jendela di lantai satu.</p>
<p>Pintu depan: terkunci elektromagnetik.</p>
<p>Pintu belakang dapur: terkunci.</p>
<p>Pintu samping ke taman: terkunci.</p>
<p>Jendela: teralis besi dekoratif — kokoh.</p>
<p><span class="speaker reza">Reza</span> berhenti di depan satu pintu di ujung lorong barat. Pintu ini berbeda — lebih tua, kayunya lebih gelap, dan tidak ada kunci elektronik. Hanya gembok klasik.</p>
<p>"Ini menuju basement," kata Reza. "Gembok tua. Bisa dipotong."</p>
<p>Dia mengeluarkan multitool dari saku jasnya — kebiasaan lama yang tidak bisa ditinggalkan.</p>
<p>"Tapi aku dengar sesuatu dari bawah." Reza menempelkan telinganya ke pintu. "Dengungan. Mesin atau generator. Dan..." dia mengernyit, "...musik. Musik yang sama yang diputar di hall. Tapi dari bawah sini, kedengarannya... terbalik."</p>`,
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
  text: `<p><span class="speaker kira">Kira</span> sudah duduk di lantai dengan laptop terbuka, kabel-kabel terhubung ke outlet terdekat.</p>
<p>"Oke. Sistem kunci dijalankan dari server di basement — terhubung ke semua pintu dan jendela. Lampu juga. Semuanya smart home terintegrasi."</p>
<p>"Bisa kau override?"</p>
<p>"Dari sini? Tidak. Firewallnya enterprise-grade — lebih kuat dari yang seharusnya ada di mansion. Ini setup profesional." Kira mendongak. "Tapi aku menemukan sesuatu. Ada countdown timer di server. Enam jam mundur. Dan setiap jam, ada event terjadwal yang akan terpicu otomatis."</p>
<p>"Event apa?"</p>
<p>"Tidak bisa baca detailnya. Tapi timestamp event pertama..." Kira melirik jam, "...lima belas menit dari sekarang."</p>
<p>Lima belas menit.</p>`,
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
  text: `<p>Kau berjalan ke tengah ruangan, tepat ke arah Vira. Semua mata mengikuti.</p>
<p>"Vira."</p>
<p>Dia menoleh dengan gerakan yang terlalu mulus.</p>
<p>"Kau tidak terkejut. Lampu mati. Tulisan ancaman. Pintu terkunci. Dan kau berdiri di sana seperti menonton film yang sudah kau hapal endingnya."</p>
<p>Ruangan hening.</p>
<p><span class="speaker vira">Vira</span> menatapmu. Lama. Lalu mulai bertepuk tangan — pelan, ironis.</p>
<p>"Arin si jurnalis. Selalu mencari cerita." Dia berjalan melingkarimu. "Kau mau tahu kenapa aku tidak terkejut? Karena aku sudah pernah ada di sini. Enam bulan lalu. Sebelum aku 'menghilang'."</p>
<p>Bisik-bisik mengisi ruangan.</p>
<p>"Aku diundang. Sama seperti kalian. Dan aku melihat apa yang terjadi pada orang-orang yang diundang sebelumnya." Suaranya turun. "Aku selamat. Yang lain tidak."</p>
<p>"Malam ini, siklus itu berulang. Dan satu-satunya cara untuk menghentikannya adalah menemukan siapa yang menjalankannya — sebelum mereka menyelesaikan apa yang mereka mulai."</p>
<p><span class="speaker niko">Niko</span>: "Vira, apa yang—"</p>
<p>"Tiga orang akan mati malam ini, Niko." Vira menatap semua orang di ruangan. "Kecuali kita lebih pintar dari yang menyetel permainan ini."</p>
<p>Hening. Lalu kekacauan.</p>`,
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
  text: `<p><span class="speaker vira">Vira</span> menggeleng.</p>
<p>"Kalau aku tahu, aku tidak akan di sini. Aku akan di kantor polisi." Nadanya pahit. "Yang aku tahu: ada seseorang yang menyebut dirinya 'Sang Penenun'. Dan dia merancang ini semua seperti... seperti skenario. Setiap orang di ruangan ini dipilih karena alasan tertentu."</p>
<p>"Siapa Sang Penenun?"</p>
<p>"Bisa siapa saja." Vira memandang berkeliling. "Bisa salah satu dari kita."</p>
<p>Keheningan yang jatuh setelah kata-kata itu terasa seperti lantai yang runtuh.</p>`,
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
