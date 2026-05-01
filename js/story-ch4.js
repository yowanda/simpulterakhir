/* ============================================================
   SIMPUL TERAKHIR — BAB 4: Perburuan
   Pemburu dan mangsa. Kelompok yang tersisa memburu kebenaran
   sementara diburu oleh Sang Penenun. Kematian kedua bisa terjadi.
   ============================================================ */

const STORY_CH4 = {

'ch4_start': {
  chapter: 4,
  text: (s) => {
    let text = `<p class="narration">Mansion berubah. Bukan hanya metafora — secara literal, koridor-koridor yang tadi terbuka sekarang tertutup. Pintu-pintu baru muncul di tempat yang sebelumnya dinding solid. Seperti mansion ini hidup, bernapas, dan menyusun ulang dirinya sendiri.</p>`;

    if (s.flags.allDoorsOpen) {
      text += `<p>Generator cadangan menyala — lampu darurat berkedip merah. Sistem kunci reboot. Pintu-pintu kembali terkunci. Kebebasan singkatmu — ilusi.</p>`;
    }

    text += `<p>Countdown: <strong>02:00:00</strong>. Dua jam sebelum fajar.</p>`;

    // Player perspective
    const pc = s.playerCharacter || 'arin';
    if (pc === 'sera') text += `<p class="journal"><em>Fight-or-flight response aktif di setiap orang. Amygdala override prefrontal cortex. Mereka tidak lagi berpikir — mereka bereaksi. Dan kau harus menjadi otak yang dingin di tengah kepanikan.</em></p>`;
    else if (pc === 'juno') text += `<p class="journal"><em>Perburuan? Oke. Lo bisa diburu, atau lo bisa jadi pemburu. Lo milih yang kedua.</em></p>`;
    else if (pc === 'lana') text += `<p class="journal"><em>Fase berikutnya sudah dimulai. Kau harus menyelesaikan tugasmu — tapi pertanyaan yang mengganggumu: apakah kau masih mau?</em></p>`;
    else if (pc === 'reza') text += `<p class="journal"><em>Perburuan. Kau tahu taktiknya — kau pernah ada di kedua sisi. Pemburu dan mangsa. Malam ini, kau menolak menjadi mangsa.</em></p>`;
    else if (pc === 'vira') text += `<p class="journal"><em>Koridor-koridor ini... kau mengenalnya. Terakhir kali kau lari di sini, kau sendirian. Kali ini tidak. Dan itu membuatmu lebih takut — karena sekarang kau punya orang-orang yang bisa kau kehilangan.</em></p>`;
    else if (pc === 'kira') text += `<p class="journal"><em>Mansion ini punya sistem otomasi. Lo bisa hack-nya — kalau lo bisa menemukan hub controller-nya. Pintu-pintu, kunci, bahkan lampu — semua terhubung ke satu sistem.</em></p>`;
    else if (pc === 'dimas') text += `<p class="journal"><em>Lana memberimu instruksi terakhir: "Simpul kedua malam ini." Tapi tanganmu gemetar untuk pertama kalinya. Sera menatapmu tadi — dan sesuatu di tatapan itu... merusak programmu.</em></p>`;

    text += `<p>Sang Penenun sudah mendapat simpul pertamanya. Dua lagi yang dijanjikan. Dan sekarang, permainan berubah — bukan lagi tentang manipulasi psikologis. Ini <em>perburuan</em>.</p>`;

    if (s.flags.presentedEvidence) {
      text += `<p>Kau sudah mempresentasikan semua bukti. Kelompok tahu tentang protokol, tentang operator, tentang sejarah mansion. Tapi pengetahuan tidak sama dengan keselamatan.</p>`;
    }
    if (s.flags.heldVoting) {
      text += `<p>Voting dilakukan. Mayoritas menunjuk Dimas sebagai tersangka utama. `;
      if (s.flags.dimasLocked) {
        text += `Dia sudah terkunci. Tapi apakah mengunci tersangka yang salah lebih berbahaya dari membiarkannya bebas?</p>`;
      } else {
        text += `Dimas menerima hasil voting dengan tenang yang mengerikan. "Demokrasi yang indah," komentarnya. "Tapi pembunuh tidak tunduk pada suara mayoritas."</p>`;
      }
    }

    text += `<p>Di sisi ruangan, drama kecil bermain tanpa kata:</p>`;
    text += `<p><span class="speaker sera">Sera</span> berdiri di dekatmu — lebih dekat dari biasanya. Bahunya menyentuh bahumu. Di situasi normal, seorang psikolog profesional akan menjaga jarak. Tapi malam ini bukan malam normal, dan Sera sudah berhenti berpura-pura bahwa perasaannya pada Arin hanya "kolega". Setiap kali lampu berkedip, tangannya mencari tanganmu.</p>`;
    text += `<p><span class="speaker niko">Niko</span> berdiri terpisah dari kelompok — dalang yang terisolasi oleh egonya sendiri. Tapi matanya tidak bisa berhenti kembali ke <span class="speaker vira">Vira</span>. Cinta lama yang toxic tidak pernah benar-benar mati — hanya bermutasi menjadi sesuatu yang lebih berbahaya. "Vira," bisiknya saat tidak ada yang mendengar, "aku mengundangmu karena—" "Karena rasa bersalah?" potong Vira. "Atau karena kau masih tidak bisa melepaskanku?" Keheningan yang menyakitkan.</p>`;
    text += `<p><span class="speaker juno">Juno</span> berjalan mondar-mandir, energinya ceroboh dan berbahaya. Reza mengikutinya dengan mata — negosiator yang tahu bahwa bom waktu emosional di depannya bisa meledak kapan saja. "Duduk, Juno." "Nggak bisa." "Duduk." Juno duduk. Dan ketika lutut mereka bersentuhan, keduanya pura-pura tidak menyadarinya.</p>`;
    text += `<p><span class="speaker lana">Lana</span> berbisik pada <span class="speaker dimas">Dimas</span> — dalang menarik benang bonekanya. "Sebentar lagi waktunya. Kau tahu apa yang harus dilakukan." Dimas mengangguk tanpa ekspresi. Tapi ada sesuatu yang baru di matanya — keraguan? Perasaan? Matanya bergerak ke Sera, dan untuk pertama kalinya, Dimas merasakan sesuatu yang Lana tidak bisa kontrol: emosi manusia.</p>`;
    text += `<p><span class="speaker farah">Farah</span> menarik <span class="speaker kira">Kira</span> ke sudut. "Aku bisa membayarmu. Nama hargamu." Kira tertawa — tawa eksentrik yang terlalu keras untuk situasi ini. "Uang? Serius? Kita bisa mati dan lo nawarin gue uang?" Farah mengepalkan tangan — negosiator yang kehabisan mata uang.</p>`;

    text += `<p>Speaker — sekarang dengan suara yang lebih manusiawi, lebih personal, seolah Sang Penenun melepas filter elektroniknya:</p>`;
    text += `<p class="journal"><em>"Dua jam tersisa. Dua simpul lagi. Tapi kali ini, aku beri kalian kesempatan. Di suatu tempat di mansion ini, ada kunci master yang membuka semua pintu — termasuk pintu keluar. Temukan, dan kalian bebas. Tapi kunci itu dijaga."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Cari kunci master — ini bisa jadi jalan keluar nyata",
      next: 'ch4_hunt_key',
      effect: (s) => {
        s.flags.huntingKey = true;
      }
    },
    {
      text: "Ini jebakan lain. Fokus pada menemukan Sang Penenun.",
      next: 'ch4_hunt_penenun',
      effect: (s) => {
        s.flags.huntingPenenun = true;
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Gabungkan kedua misi — cari kunci sambil mengikuti jejak Penenun",
      next: 'ch4_dual_mission',
      effect: (s) => {
        s.flags.dualMission = true;
      }
    },
    {
      text: "Abaikan kedua opsi — bangun pertahanan dan tunggu fajar",
      next: 'ch4_defend',
      effect: (s) => {
        s.flags.defendMode = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch4_hunt_key': {
  text: (s) => {
    let text = `<p>Kau memimpin kelompok kecil untuk mencari kunci master.</p>`;

    if (s.flags.hasMansionMap) {
      text += `<p>Diagram mansion yang kau temukan menunjukkan satu ruangan yang tidak ada di blueprint resmi — ruangan antara dinding di sayap timur lantai dua. Hidden room.</p>`;
      text += `<p>"Di sini," kau menunjuk peta. "Ruangan ini tidak ada di denah. Kalau aku Sang Penenun, di situlah aku simpan kunci."</p>`;
    } else {
      text += `<p>Tanpa peta, kau harus mencari secara manual. Setiap ruangan, setiap laci, setiap panel yang bisa dipindahkan.</p>`;
    }

    text += `<p><span class="speaker sera">Sera</span>: "Sang Penenun bilang kunci itu 'dijaga'. Itu berarti ada rintangan — atau jebakan."</p>`;

    return text;
  },
  choices: [
    {
      text: "Ke hidden room di sayap timur",
      condition: (s) => s.flags.hasMansionMap,
      next: 'ch4_hidden_room',
      effect: (s) => {
        Engine.modDanger(8);
      }
    },
    {
      text: "Cari secara sistematis — mulai dari area yang belum dijelajahi",
      next: 'ch4_systematic_search',
      effect: (s) => {
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'ch4_hidden_room': {
  text: (s) => {
    let text = `<p>Sayap timur lantai dua. Dinding yang menurut peta menyembunyikan ruangan.</p>`;
    text += `<p>Kau mengetuk. Hollow. Ada ruang di baliknya.</p>`;
    text += `<p><span class="speaker juno">Juno</span> menemukan mekanismenya — panel geser yang tersembunyi di balik lukisan.</p>`;
    text += `<p>Panel bergeser. Lorong sempit membawa kalian ke ruangan kecil, tidak lebih besar dari walk-in closet.</p>`;
    text += `<p>Di dalamnya:</p>`;
    text += `<p>• Monitor kecil yang menampilkan feed CCTV dari hall utama</p>`;
    text += `<p>• Walkie-talkie — frekuensi yang sama yang disebutkan di notes: 462.5625 MHz</p>`;
    text += `<p>• Sebuah kotak logam terkunci</p>`;
    text += `<p>• Dan di dinding: foto-foto. Foto-foto Arin. Dicetak dari internet — dari social media, dari podcast, dari acara-acara publik. Timeline. Sang Penenun sudah mengikutimu jauh sebelum malam ini.</p>`;
    text += `<p>Kotak logam itu butuh kode. Empat digit.</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: 'Coba "1971" — tahun mansion dibangun',
      next: 'ch4_open_box',
      effect: (s) => {
        s.flags.triedCode = '1971';
      }
    },
    {
      text: "Ambil walkie-talkie — kita bisa mendengarkan komunikasi mereka",
      next: 'ch4_walkie',
      effect: (s) => {
        s.items.push('walkie_talkie');
        s.flags.hasWalkie = true;
        s.cluesFound++;
      }
    },
    {
      text: "Foto-foto Arin di dinding... ini personal. Periksa semuanya.",
      next: 'ch4_arin_photos',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.foundStalkerPhotos = true;
      }
    }
  ]
},

'ch4_walkie': {
  text: `<p>Kau menyalakan walkie-talkie. Static. Lalu — suara.</p>
<p>Dua suara. Berbisik. Terputus-putus.</p>
<p>"...target kedua bergerak ke... timur... ikuti tapi jangan..."</p>
<p>"...Arin di hidden room... kita punya... menit sebelum..."</p>
<p>Mereka tahu kau di sini. Sekarang.</p>
<p>Suara langkah di lorong. Mendekat.</p>`,
  shake: true,
  choices: [
    {
      text: "Keluar dari hidden room — SEKARANG!",
      next: 'ch4_ambush',
      effect: (s) => {
        Engine.modDanger(15);
        s.flags.ambushed = true;
      }
    },
    {
      text: "Tutup panel dari dalam. Sembunyi. Dengarkan.",
      next: 'ch4_hide_listen',
      effect: (s) => {
        s.flags.hidInHiddenRoom = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch4_hide_listen': {
  text: (s) => {
    let text = `<p>Kau menutup panel. Gelap total kecuali cahaya monitor kecil.</p>`;
    text += `<p>Langkah kaki melewati dinding. Berhenti. Lalu berlalu.</p>`;
    text += `<p>Walkie-talkie: "...dia hilang dari visual... cek ruangan-ruangan di sayap timur..."</p>`;
    text += `<p>Lalu suara yang membuatmu membeku. Suara yang kau kenali:</p>`;

    if (s.difficulty === 3) {
      text += `<p>"Kalian berdua, fokus. Arin punya bukti yang cukup untuk menghancurkan kita. Temukan dia sebelum fajar." Suara itu — <span class="speaker niko">Niko</span>.</p>`;
      text += `<p>Niko. Pewaris Wardhana. Terlibat. Bukan hanya memberikan akses — dia aktif berpartisipasi.</p>`;
    } else if (s.difficulty === 2) {
      text += `<p>"Aku akan urus Arin. Kau selesaikan target kedua." Suara wanita — <span class="speaker lana">Lana</span>.</p>`;
      text += `<p>"Metode?" Suara pria — <span class="speaker dimas">Dimas</span>.</p>`;
      text += `<p>"Skenario kecelakaan. Tangga gelap, lantai licin. Natural."</p>`;
    } else {
      text += `<p>"Target utama prioritas. Yang lain secondary." Suara tunggal — terdistorsi, tapi ada nada yang familiar. Kau belum bisa mengidentifikasi.</p>`;
    }

    text += `<p>Kau merekam percakapan ini di ponselmu. Bukti.</p>`;

    return text;
  },
  choices: [
    {
      text: "Keluar saat aman dan kembali ke kelompok dengan bukti baru",
      next: 'ch4_return_evidence',
      effect: (s) => {
        s.items.push('walkie_recording');
        s.cluesFound += 2;
        s.flags.hasWalkieRecording = true;
        s.keyChoices.push('walkie_recording');
      }
    }
  ]
},

'ch4_arin_photos': {
  text: `<p>Kau memeriksa foto-foto di dinding. Timeline lengkap kehidupanmu selama dua tahun terakhir. Setiap episode podcast yang kau rekam. Setiap acara publik. Bahkan foto dari kafe tempat kau biasa bekerja.</p>
<p>Dan di antara foto-foto itu — notes. Analisis tentangmu. Kebiasaan, kelemahan, pola perilaku.</p>
<p class="journal"><em>"Arin Prasetya — profil ideal untuk Saksi Selamat. Insting investigasi kuat. Kecenderungan heroik. Survivor's guilt moderat. Akan menjadi narasi sempurna untuk menutup siklus tahun ini."</em></p>
<p>"Saksi Selamat." Kau direncanakan untuk selamat. Bukan karena keberuntungan — tapi karena kau akan menjadi saksi yang tidak dipercaya siapapun. Podcaster konspirasi yang bercerita tentang mansion pembunuh. Siapa yang akan percaya?</p>
<p>Sang Penenun tidak ingin membunuhmu. Dia ingin <em>menggunakanmu</em>.</p>`,
  shake: true,
  choices: [
    {
      text: "Ini mengubah segalanya. Aku BUKAN korban — aku alat mereka. Waktunya mengubah narasi.",
      next: 'ch4_return_evidence',
      effect: (s) => {
        s.flags.knowsArinIsPlanned = true;
        s.flags.rewriteNarrative = true;
        s.keyChoices.push('rewrite_narrative');
        Engine.modAwareness('arin', 20);
      }
    }
  ]
},

'ch4_open_box': {
  text: `<p>1971. Klik. Kotak terbuka.</p>
<p>Di dalam: kunci master mansion — besar, kuningan tua, dengan symbol simpul terukir. Dan sesuatu lagi — USB drive dan sepucuk surat.</p>
<p>Surat itu: <em>"Bagi yang menemukan ini — selamat. Kau sudah cukup dekat dengan kebenaran untuk menjadi ancaman. Kunci ini membuka pintu keluar utama. Tapi hanya bisa digunakan sekali — setelah diputar, mekanisme rusak permanen. Gunakan dengan bijak. Atau simpan sebagai asuransi."</em></p>
<p>Satu kunci. Satu kesempatan keluar. Untuk semua orang? Atau hanya untuk yang paling cepat?</p>`,
  choices: [
    {
      text: "Simpan kunci. Kita keluar BERSAMA atau tidak sama sekali.",
      next: 'ch4_return_evidence',
      effect: (s) => {
        s.items.push('master_key');
        s.flags.hasMasterKey = true;
        s.moralScore += 15;
        s.keyChoices.push('has_master_key');
      }
    },
    {
      text: "Langsung ke pintu keluar. Sekarang. Sebelum diambil orang lain.",
      danger: true,
      next: 'ch4_use_key_early',
      effect: (s) => {
        s.items.push('master_key');
        s.flags.usedKeyEarly = true;
        s.moralScore -= 20;
      }
    }
  ]
},

'ch4_use_key_early': {
  text: `<p>Kau berlari ke pintu keluar utama. Kunci masuk. Memutar. Mekanisme berderak — klik berat, puas, final.</p>
<p>Pintu terbuka. Udara malam. Kebebasan.</p>
<p>Tapi di belakangmu — suara langkah. <span class="speaker sera">Sera</span>. Matanya lebar.</p>
<p>"Arin? Kau mau... pergi? Sendirian?"</p>
<p>Di belakang Sera, bayangan-bayangan yang lain. Mendekat.</p>
<p><span class="speaker juno">Juno</span>: "Arin, lo serius?"</p>
<p>Kunci sudah diputar. Mekanisme sudah rusak. Pintu terbuka.</p>
<p>Pilihan: keluar dan selamatkan dirimu. Atau tetap dan gunakan pintu terbuka untuk menyelamatkan semua.</p>`,
  choices: [
    {
      text: '"Semua keluar. SEKARANG. Pintu terbuka!"',
      next: 'ch4_mass_escape',
      effect: (s) => {
        s.moralScore += 20;
        s.flags.massEscape = true;
      }
    },
    {
      text: "Keluar sendirian. Kau sudah cukup menderita.",
      next: 'ending_coward_escape',
      effect: (s) => {
        s.moralScore -= 30;
        s.flags.abandonedGroup = true;
      }
    }
  ]
},

'ch4_mass_escape': {
  text: `<p>Semua bergerak ke pintu. Tapi sebelum orang terakhir keluar—</p>
<p>BLAM. Pintu menutup kembali dari luar. Mekanisme — yang seharusnya rusak — ternyata punya backup. Hanya enam orang yang berhasil keluar.</p>
<p>Yang terjebak di dalam: kau, dan beberapa orang lain.</p>
<p>Speaker: <em>"Evakuasi parsial. Menarik. Tapi permainan belum selesai untuk yang tersisa."</em></p>
<p>Yang berhasil keluar berlari ke hutan. Yang tersisa menatap pintu tertutup.</p>`,
  shake: true,
  choices: [
    {
      text: "Lanjut bertahan — sekarang dengan kelompok yang lebih kecil",
      next: 'ch5_start',
      effect: (s) => {
        s.flags.partialEscape = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch4_hunt_penenun': {
  text: (s) => {
    let text = `<p>"Kunci master bisa jebakan. Yang kita butuhkan bukan jalan keluar — tapi menghentikan orang yang mengontrol keluar-masuk."</p>`;
    text += `<p>Kau menyusun profil Sang Penenun dari semua clue:</p>`;
    text += `<p>• Mengenal sejarah mansion selama 50+ tahun</p>`;
    text += `<p>• Punya akses ke file polisi, data medis, dan informasi pribadi semua tamu</p>`;
    text += `<p>• Menggunakan operator — "Penulis" dan "Pemotong"</p>`;
    text += `<p>• Bisa berada di mansion tanpa terdeteksi — atau SUDAH di antara tamu</p>`;

    if (s.flags.hasJournal) {
      text += `<p>• Kakek Niko menyebut dia sebagai partner yang mem-blackmail selama 48 tahun</p>`;
    }

    text += `<p><span class="speaker sera">Sera</span> menambahkan: "Profil psikologis: narcissistic, methodical, enjoys control. Tipe yang tidak bisa berhenti — ini bukan tentang uang atau kekuasaan. Ini tentang <em>permainan</em>. Dia ketagihan."</p>`;

    if (s.difficulty === 1) {
      text += `<p>"Satu pembunuh," katamu. "Satu orang yang menarik semua benang. Siapa?"</p>`;
    } else if (s.difficulty === 2) {
      text += `<p>"Dua operator setidaknya. Plus dalang di atas mereka — atau di antara mereka."</p>`;
    } else {
      text += `<p>"Konspirasi tiga orang. Masing-masing punya peran. Dan mungkin — mungkin mereka sendiri tidak sepenuhnya saling percaya."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Pasang jebakan untuk Sang Penenun — biarkan dia datang kepada kita",
      next: 'ch4_set_trap',
      effect: (s) => {
        s.flags.settingTrap = true;
        s.keyChoices.push('set_trap');
      }
    },
    {
      text: "Konfrontasi langsung — kumpulkan semua orang dan paksa Penenun membuka diri",
      next: 'ch4_force_reveal',
      effect: (s) => {
        s.flags.forcedReveal = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch4_set_trap': {
  text: (s) => {
    let text = `<p>"Kita buat situasi di mana Sang Penenun HARUS bertindak secara langsung. Dan saat dia bertindak — kita tangkap."</p>`;
    text += `<p><span class="speaker sera">Sera</span>: "Bait. Kita butuh bait."</p>`;
    text += `<p>"Aku yang jadi bait." Kau mengangkat tangan sebelum ada yang protes. "Arin Prasetya, podcaster. Aku yang punya bukti paling banyak. Aku ancaman terbesar bagi Sang Penenun."</p>`;

    if (s.flags.knowsArinIsPlanned) {
      text += `<p>"Dan aku tahu sesuatu yang dia tidak tahu aku tahu: dia MERENCANAKANKU untuk jadi 'saksi selamat'. Jadi dia tidak akan membunuhku — dia akan mencoba mengendalikanku. Dan saat dia mencoba..."</p>`;
    }

    text += `<p>Rencana sederhana: Arin berjalan sendirian ke Galeri Timur. Kamera CCTV dihancurkan sebelumnya sehingga Sang Penenun harus mengirim operatornya — atau datang sendiri — untuk mengawasi. Tim lain bersembunyi di posisi strategis.</p>`;

    return text;
  },
  choices: [
    {
      text: "Eksekusi rencana — aku berjalan ke Galeri sebagai bait",
      next: 'ch4_trap_execution',
      effect: (s) => {
        s.flags.baitPlan = true;
        Engine.modDanger(10);
        s.courage.arin += 20;
      }
    },
    {
      text: '"Terlalu berisiko. Ada cara lain."',
      next: 'ch4_dual_mission',
      effect: (s) => {
        s.flags.rejectedBaitPlan = true;
      }
    }
  ]
},

'ch4_trap_execution': {
  text: (s) => {
    let text = `<p>Galeri Timur. Kau berjalan masuk sendirian. Layar-layar masih menampilkan foto-foto kalian — wajah-wajah dengan data personal di bawahnya.</p>`;
    text += `<p>Kau berdiri di tengah galeri. Menunggu. Jantung berdentam keras cukup untuk menggetarkan tulang rusuk.</p>`;
    text += `<p>Lima menit. Sepuluh. Lima belas.</p>`;
    text += `<p>Langkah kaki. Dari kedua ujung galeri sekaligus. Terperangkap dari dua arah.</p>`;

    if (s.difficulty >= 2) {
      text += `<p>Dari kiri: <span class="speaker dimas">Dimas</span>. Senyum sopannya sudah hilang — yang tersisa hanya tatapan klinis yang kau lihat di orang-orang yang memandang tubuh manusia sebagai objek.</p>`;
      text += `<p>Dari kanan: <span class="speaker lana">Lana</span>. "Skenario yang bagus, Arin. Kau tahu itu? Protagonis yang rela menjadi bait. Chapter climax yang klasik."</p>`;
    } else {
      text += `<p>Dari kiri: seseorang. Sosok gelap yang kau lihat di CCTV tadi. Bergerak pelan, methodis.</p>`;
    }

    text += `<p>Tapi kau tidak sendirian.</p>`;

    if (s.flags.seraAlliance) {
      text += `<p><span class="speaker sera">Sera</span> muncul dari balik layar di kanan. <span class="speaker juno">Juno</span> dari kiri.</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> muncul dari balik rak. `;
      if (s.alive.reza) text += `<span class="speaker reza">Reza</span> dari pintu belakang.</p>`;
      else text += `<span class="speaker sera">Sera</span> dari pintu belakang.</p>`;
    }

    text += `<p>"Gotcha," bisikmu.</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: '"Permainan selesai. Siapa Sang Penenun?"',
      next: 'ch5_start',
      effect: (s) => {
        s.flags.trapSucceeded = true;
        s.keyChoices.push('trap_success');
      }
    }
  ]
},

'ch4_force_reveal': {
  text: `<p>"SEMUA ORANG KE HALL! SEKARANG!"</p>
<p>Suaramu menggelegar di koridor. Satu per satu, mereka datang. Yang tersisa.</p>
<p>Kau berdiri di tengah lingkaran kursi — di mana semua ini dimulai — dan menatap setiap wajah.</p>
<p>"Cukup. Tidak ada lagi permainan. Tidak ada lagi simpul." Kau mengangkat bukti-bukti yang kau kumpulkan. "Aku tahu siapa Sang Penenun. Aku tahu siapa operatornya. Dan aku punya bukti."</p>
<p>"Jadi sekarang, Sang Penenun — siapapun kau — kau punya dua pilihan. Tunjukkan dirimu. Atau biarkan aku membuka semuanya — dan kau kehilangan kendali atas narasinya."</p>
<p>Hening. Napas tertahan.</p>
<p>Detik-detik paling panjang dalam hidupmu.</p>`,
  shake: true,
  choices: [
    {
      text: "Tunggu reaksi. Siapa yang bergerak lebih dulu?",
      next: 'ch5_start',
      effect: (s) => {
        s.flags.forcedConfrontation = true;
        s.keyChoices.push('forced_confrontation');
        Engine.modDanger(15);
      }
    }
  ]
},

'ch4_dual_mission': {
  text: (s) => {
    let text = `<p>Kau membagi tugas: cari kunci DAN kumpulkan bukti terhadap Sang Penenun secara paralel.</p>`;
    text += `<p>Tim A (kau, Sera) — investigasi identitas Penenun melalui bukti-bukti yang sudah dikumpulkan.</p>`;
    text += `<p>Tim B (Juno + yang lain) — cari kunci master atau jalan keluar alternatif.</p>`;
    text += `<p>Tiga puluh menit koordinasi. Lalu kalian berpencar.</p>`;

    text += `<p>Kau dan <span class="speaker sera">Sera</span> duduk di perpustakaan, menyusun timeline:</p>`;
    text += `<p>• 50 tahun lalu — mansion dibangun, artefak ditemukan, siklus simpul dimulai</p>`;
    text += `<p>• 7 tahun terakhir — acara tahunan dengan pola konsisten</p>`;
    text += `<p>• 1 tahun lalu — Hendarto Wardhana (kakek Niko) meninggal</p>`;
    text += `<p>• 6 bulan lalu — Vira diundang dan "selamat"</p>`;
    text += `<p>• 3 bulan lalu — Niko merenovasi mansion, menyewa "PT Benang Digital"</p>`;
    text += `<p>• Malam ini — siklus ke-8, tapi seseorang MEMBAJAK acara Niko</p>`;

    text += `<p>Sera: "Pola-nya berubah tahun ini. Sebelumnya, Hendarto yang menjalankan — di bawah kendali Penenun. Tapi Hendarto mati. Dan Niko tidak mau melanjutkan — dia ingin mengungkap."</p>`;
    text += `<p>"Jadi Sang Penenun merekrut operator baru — Lana dan Dimas — dan membajak acara Niko."</p>`;
    text += `<p>"Tapi siapa Sang Penenunnya?" tanya Sera. "Kalau dia mem-blackmail Hendarto selama 48 tahun, dia harus berusia minimal 70an. Dan satu-satunya orang di mansion ini yang cocok dengan profil itu..."</p>`;
    text += `<p>Kalian menatap satu sama lain.</p>`;
    text += `<p>"Tidak ada," kata Sera. "Kecuali Penenun bukan satu orang — tapi posisi yang diwariskan."</p>`;

    return text;
  },
  choices: [
    {
      text: '"Posisi yang diwariskan... seperti mansion ini. Siapa pewaris Sang Penenun?"',
      next: 'ch5_start',
      effect: (s) => {
        s.flags.inheritedPenenun = true;
        s.cluesFound += 2;
        Engine.modAwareness('arin', 15);
        s.keyChoices.push('inherited_theory');
      }
    }
  ]
},

'ch4_defend': {
  text: `<p>"Kita tidak berlari dan kita tidak berburu. Kita bertahan. Dua jam sampai fajar — kita bisa."</p>
<p>Kau memimpin barricade hall utama. Kursi ditumpuk di pintu. Jendela dikunci tambahan dengan furniture. Satu pintu masuk dijaga bergantian.</p>
<p>Tapi defense punya kelemahan: kau tidak bisa mengontrol apa yang terjadi di LUAR barricade.</p>
<p>Speaker: <em>"Menarik. Tikus yang membangun sarang di dalam perangkap. Tapi apakah semua tikus di dalam sarang itu... tikus?"</em></p>
<p>Pertanyaan yang menghantam. Di dalam barricade kalian — apakah ada pembunuh yang terkurung bersama?</p>`,
  shake: true,
  choices: [
    {
      text: "Tetap bertahan — tapi mulai interogasi semua orang di dalam",
      next: 'ch4_interrogation',
      effect: (s) => {
        s.flags.interrogating = true;
        Engine.modDanger(5);
      }
    },
    {
      text: "Strategi berubah — keluar dari barricade dan cari jawaban",
      next: 'ch4_dual_mission',
      effect: (s) => {
        s.flags.abandonedDefense = true;
      }
    }
  ]
},

'ch4_interrogation': {
  text: (s) => {
    let text = `<p>Interogasi di bawah cahaya darurat. Wajah-wajah yang kelelahan, ketakutan, dan — di beberapa — bersalah.</p>`;

    if (s.alive.dimas && !s.flags.dimasLocked) {
      text += `<p><span class="speaker dimas">Dimas</span>: "Aku mahasiswa kedokteran. Aku diundang oleh Lana. Aku tidak tahu soal Penenun atau siklus apapun."</p>`;
      text += `<p><span class="speaker sera">Sera</span> menganalisis: "Detak jantung stabil. Kontak mata konsisten. Tapi itu bukan bukti tidak bersalah — sociopath bisa memanipulasi semua indikator itu."</p>`;
    }

    if (s.alive.vira) {
      text += `<p><span class="speaker vira">Vira</span> akhirnya bicara: "Kalian mau interogasi? Fine. Aku pernah ada di posisi korban. Aku TAHU bagaimana rasanya. Dan aku tahu bahwa Sang Penenun SELALU ada di antara tamu. Selalu."</p>`;
    }

    text += `<p>Waktu terus berjalan. Interogasi tidak menghasilkan konfesi — hanya lebih banyak kecurigaan.</p>`;
    text += `<p>Dan kemudian — lampu mati lagi. Kegelapan selama sepuluh detik.</p>`;
    text += `<p>Lampu menyala.</p>`;
    text += `<p>Semua masih ada. Tapi di lantai, di tengah barricade, ada sesuatu yang tadi tidak ada: boneka kayu. Boneka yang menyerupaimu. Dengan pita merah di lehernya.</p>`;
    text += `<p>Sang Penenun masuk ke dalam barricade — dan keluar — tanpa terdeteksi.</p>`;

    return text;
  },
  shake: true,
  glitch: true,
  choices: [
    {
      text: "CUKUP. Waktunya memburu balik.",
      next: 'ch5_start',
      effect: (s) => {
        s.flags.huntMode = true;
        Engine.modDanger(10);
        s.courage.arin += 15;
        s.keyChoices.push('hunter_mode');
      }
    }
  ]
},

'ch4_systematic_search': {
  text: `<p>Pencarian sistematis — kamar per kamar, lorong per lorong. Tapi mansion ini luas dan waktu menipis.</p>
<p>Di kamar tamu lantai dua, kau menemukan sesuatu: tas <span class="speaker lana">Lana</span>. Di dalamnya: laptop, notes, dan manuscript — novel terbarunya yang belum terbit.</p>
<p>Judul: "Simpul Terakhir".</p>
<p>Kau membaca halaman pertama: <em>"Sepuluh orang diundang ke sebuah mansion terpencil. Sebelum fajar, tiga di antaranya akan mati. Yang tersisa akan bertanya-tanya apakah mereka selamat karena keberuntungan — atau karena memang direncanakan."</em></p>
<p>Ini bukan novel. Ini SKENARIO. Blueprint malam ini. Dan Lana menulisnya SEBELUM datang ke mansion.</p>
<p>Kau membalik ke halaman terakhir. Ending yang direncanakan: <em>"Protagonis selamat. Membawa cerita ke dunia luar. Tapi tidak ada yang percaya. Trauma menjadi material podcast baru — dan siklus dimulai lagi saat listener berikutnya menerima undangan."</em></p>`,
  shake: true,
  choices: [
    {
      text: "Bawa manuscript ini ke kelompok. Bukti paling kuat.",
      next: 'ch4_return_evidence',
      effect: (s) => {
        s.items.push('lana_manuscript');
        s.flags.hasManuscript = true;
        s.cluesFound += 3;
        s.keyChoices.push('found_manuscript');
      }
    }
  ]
},

'ch4_return_evidence': {
  text: (s) => {
    let text = `<p>Kau kembali ke kelompok dengan bukti baru. Wajah-wajah tegang mengarah padamu.</p>`;
    text += `<p>"Aku tahu siapa operatornya," katamu. "Dan aku punya bukti."</p>`;

    if (s.flags.hasManuscript) {
      text += `<p>Kau menunjukkan manuscript Lana. "Novel ini bukan fiksi — ini blueprint malam ini. Lana menulis SKENARIO, bukan novel."</p>`;
    }
    if (s.flags.hasWalkieRecording) {
      text += `<p>Kau memainkan rekaman walkie-talkie. Suara-suara yang teridentifikasi memenuhi ruangan.</p>`;
    }

    text += `<p>Reaksi bervariasi — tapi satu hal jelas: kebenaran sudah tidak bisa ditutup lagi.</p>`;

    return text;
  },
  choices: [
    {
      text: "Konfrontasi langsung — sekarang kita tahu siapa musuh kita",
      next: 'ch5_start',
      effect: (s) => {
        s.flags.evidencePresented = true;
        s.keyChoices.push('evidence_confrontation');
      }
    }
  ]
},

'ch4_ambush': {
  text: `<p>Kau keluar dari hidden room — dan langsung menghadapi masalah.</p>
<p>Sosok gelap. Di koridor. Menunggu.</p>
<p>Bukan salah satu tamu — atau setidaknya, tidak terlihat seperti tamu. Berpakaian gelap, wajah tertutup balaclava.</p>
<p>Dia bergerak cepat. Kau bergerak lebih cepat.</p>
<p>Tapi koridor sempit. Tidak ada tempat lari kecuali maju atau mundur.</p>
<p><span class="speaker juno">Juno</span> muncul dari belokan — dan tanpa ragu, menerjang sosok gelap itu dari samping. Street fighter instinct.</p>
<p>Pergulatan singkat. Brutal. Juno memukul. Sosok itu memukul balik — lebih keras, lebih terlatih. Juno terjengkang ke dinding.</p>
<p>Kau mengambil vas terdekat dan menghantamkannya ke kepala sosok itu. Vas pecah. Sosok itu terhuyung — lalu berlari, menghilang ke koridor gelap.</p>
<p>Juno bangun, memegangi tulang rusuknya. "Orang itu bukan amatir. Terlatih. Militer atau sejenisnya."</p>`,
  shake: true,
  choices: [
    {
      text: "Periksa Juno dan kembali ke kelompok",
      next: 'ch5_start',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 10);
        s.flags.foughtAttacker = true;
        s.keyChoices.push('fought_back');
      }
    }
  ]
},

'ending_coward_escape': {
  chapter: 4,
  isEnding: true,
  endingNumber: 20,
  title: 'Pengecut yang Hidup',
  rating: 'D',
  endingText: (s) => {
    return `<p>Kau berlari ke malam. Sendirian. Meninggalkan semua orang di dalam.</p>
<p>Kau menemukan jalan. Kau menghubungi polisi. Mereka datang — tapi sudah terlambat. Dua orang lagi meninggal sebelum fajar.</p>
<p>Polisi tidak menemukan bukti kejahatan — mansion sudah dibersihkan. Kasus ditutup sebagai "kecelakaan selama acara privat".</p>
<p>Kau hidup. Tapi podcast-mu mati. Tidak ada yang mau mendengarkan cerita dari orang yang meninggalkan teman-temannya untuk mati.</p>
<p>Setiap malam, kau mendengar suara-suara mereka. Meminta tolong. Bertanya kenapa kau lari.</p>
<p>Kau hidup — tapi itu bukan sama dengan selamat.</p>`;
  },
  fates: {
    arin: 'Hidup — menanggung beban yang tidak pernah ringan'
  }
}

};
