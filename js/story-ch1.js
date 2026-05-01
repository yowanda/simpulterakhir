/* ============================================================
   SIMPUL TERAKHIR — BAB 1: Kabut Pertama
   Tiba di cabin. Eksplorasi. Malam pertama.
   ============================================================ */

const STORY_CH1 = {

'ch1_arrival': {
  chapter: 1,
  text: `<div class="scene-art scene-cabin"></div>
<p>Cabin itu lebih besar dari yang kau bayangkan. Dua lantai, dinding kayu gelap, atap berlumut. Tangga depan berderit saat Niko menaikinya.</p>
<p><span class="speaker niko">Niko</span> membuka pintu dengan kunci tua yang berkarat.</p>
<p>"Selamat datang di Casa de Niko."</p>
<p>Di dalam: ruang tamu dengan perapian batu, dapur kecil, dan tangga ke lantai dua. Perabotan tertutup kain putih berdebu. Bau kayu tua dan kelembaban.</p>
<p>Tapi ada sesuatu yang salah. Debu di lantai — seharusnya tebal setelah bertahun-tahun ditinggalkan. Tapi di beberapa tempat, debu itu sudah terganggu. Jejak kaki. Seseorang sudah ada di sini sebelum kalian.</p>
<p><span class="speaker sera">Sera</span> memeluk dirinya sendiri.</p>
<p>"Ada yang tidak beres. Aku bisa merasakannya."</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Ya, yang tidak beres adalah Wi-Fi-nya. Sinyal nol."</p>
<p><span class="speaker vira">Vira</span> sudah berjalan ke ujung ruangan, menyentuh dinding dengan jari-jarinya yang pucat. Jarinya berhenti di satu titik — seolah menemukan sesuatu yang tidak bisa kalian lihat.</p>`,
  choices: [
    {
      text: "Periksa jejak kaki di lantai",
      hint: "Siapa yang sudah ke sini sebelum kalian?",
      next: 'ch1_footprints',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.checkedFootprints = true;
      }
    },
    {
      text: "Bantu Niko menyiapkan kamar di lantai dua",
      next: 'ch1_rooms',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 5);
      }
    },
    {
      text: "Ikuti Vira — apa yang dia temukan di dinding?",
      danger: true,
      next: 'ch1_vira_wall',
      effect: (s) => {
        Engine.modEntity(5);
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Cek dapur — pastikan ada persediaan",
      next: 'ch1_kitchen',
      effect: (s) => {
        s.flags.checkedKitchen = true;
      }
    }
  ]
},

'ch1_footprints': {
  text: `<p>Kau berlutut dan memeriksa lantai. Debu tebal di mana-mana, kecuali jalur yang menuju ke tiga tempat: tangga ke lantai dua, pintu belakang, dan — yang paling mengganggumu — <em>dinding di mana Vira sekarang berdiri</em>.</p>
<p>Jejak kakinya kecil. Kaki telanjang. Tanpa sepatu.</p>
<p><span class="speaker niko">Niko</span> muncul di belakangmu.</p>
<p>"Mungkin gelandangan atau pendaki yang berteduh."</p>
<p>Tapi kau tahu itu bukan penjelasan yang benar. Jejak-jejak itu terlalu teratur. Terlalu purposeful. Dan mereka mengarah ke dinding yang tidak memiliki pintu atau jendela.</p>
<p>Kau juga menemukan sesuatu yang tertinggal di dekat perapian — sebuah <em>gelang manik-manik</em>. Warnanya pudar, tapi kau mengenalinya. Vira memakainya sebelum dia menghilang di Halimun.</p>
<p>Vira yang sekarang tidak memakai gelang itu.</p>`,
  choices: [
    {
      text: "Ambil gelang itu diam-diam",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.items.push('vira_bracelet');
        s.secretsFound++;
        s.flags.hasBracelet = true;
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Tunjukkan gelang itu ke Sera",
      next: 'ch1_show_bracelet',
      effect: (s) => {
        s.items.push('vira_bracelet');
        s.secretsFound++;
        s.flags.hasBracelet = true;
        Engine.modTrust('arin', 'sera', 8);
      }
    },
    {
      text: "Tanya Vira langsung tentang gelangnya",
      danger: true,
      next: 'ch1_ask_vira_bracelet',
      effect: (s) => {
        s.items.push('vira_bracelet');
        Engine.modEntity(8);
      }
    }
  ]
},

'ch1_show_bracelet': {
  text: `<p>Kau menunggu sampai Vira pergi ke lantai atas, lalu menunjukkan gelang itu pada Sera.</p>
<p><span class="speaker sera">Sera</span> membekap mulutnya.</p>
<p>"Ini... ini gelang Vira. Aku yang buatkan untuknya, tahun kedua SMA. Dia tidak pernah melepasnya." Air matanya mengalir. "Kalau gelang ini ada di sini... tapi Vira tidak memakainya..."</p>
<p>Sera menatapmu dengan mata yang penuh ketakutan dan kesedihan.</p>
<p>"Arin, Vira yang asli pernah ke sini. Mungkin sebelum hilang. Mungkin... mungkin dia masih di sini. Di suatu tempat."</p>
<p>Di lantai atas, terdengar langkah kaki — terlalu ringan untuk manusia — berjalan bolak-balik.</p>`,
  choices: [
    {
      text: '"Kita cari tahu malam ini. Setelah yang lain tidur."',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.nightPlan = true;
        s.flags.seraPartner = true;
        Engine.modTrust('arin', 'sera', 10);
        s.keyChoices.push('night_investigation');
      }
    },
    {
      text: '"Jangan bilang siapa-siapa dulu. Kita belum tahu apa yang kita hadapi."',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.keptSecret = true;
        Engine.modTrust('arin', 'sera', 5);
      }
    }
  ]
},

'ch1_ask_vira_bracelet': {
  text: `<p>"Vira."</p>
<p>Dia berbalik dari dinding. Senyumnya ada di tempatnya.</p>
<p>"Ya, Arin?"</p>
<p>Kau mengangkat gelang itu. "Ini punyamu, kan?"</p>
<p>Untuk sepersekian detik — hanya sepersekian detik — senyumnya membeku. Bukan menghilang. <em>Membeku</em>. Seperti gambar yang berhenti di satu frame.</p>
<p>Lalu bergerak lagi.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Oh! Gelang lamaku! Aku pikir sudah hilang. Pasti jatuh waktu aku..." dia berhenti. "...waktu dulu."</p>
<p>Dia mengambil gelang itu dari tanganmu. Jari-jarinya yang dingin menyentuh kulitmu — dan kau merasakan <em>sengatan</em>. Seperti listrik statis, tapi lebih dalam. Sampai ke tulang.</p>
<p>"Terima kasih, Arin." Suaranya terlalu lembut. "Kamu selalu perhatian."</p>
<p>Dia memasukkan gelang itu ke saku, bukan memakainya. Seolah benda itu milik orang lain.</p>`,
  shake: true,
  choices: [
    {
      text: "Pergi. Cukup untuk sekarang.",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.gaveBackBracelet = true;
        Engine.modAwareness('arin', 10);
        Engine.modEntity(5);
      }
    }
  ]
},

'ch1_vira_wall': {
  text: `<p>Kau berjalan ke tempat Vira berdiri. Dia menyentuh dinding dengan mata setengah terpejam.</p>
<p>"Vira? Apa yang kau—"</p>
<p>"Sshh." Jarinya bergerak di permukaan kayu. "Dengarkan."</p>
<p>Kau mendekatkan telingamu ke dinding. Dan kau mendengarnya — denyut. Lemah, tapi pasti. Seperti detak jantung yang datang dari dalam dinding. Dari dalam tanah di bawah cabin.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Dia di bawah sini. Sudah lama. Menunggu."</p>
<p>"Siapa?"</p>
<p>Vira menatapmu. Dan untuk sekejap, kau melihat wajahnya berubah — bukan wajah Vira lagi, tapi wajah yang lebih tua, lebih pucat, dengan mata yang terlalu besar dan mulut yang terlalu lebar.</p>
<p>Lalu kembali normal.</p>
<p>"Hmm? Aku bilang apa tadi? Maaf, aku suka ngelantur."</p>
<p>Sera berdiri di belakangmu. Wajahnya seputih kertas. Dia juga melihatnya.</p>`,
  glitch: true,
  shake: true,
  choices: [
    {
      text: "Tatap Sera dan angguk pelan — konfirmasi tanpa kata",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        Engine.modAwareness('arin', 15);
        Engine.modAwareness('sera', 10);
        s.flags.seraWitnessed = true;
        s.keyChoices.push('sera_witnessed');
      }
    },
    {
      text: "Pura-pura tidak terjadi apa-apa",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.ignoredWallEvent = true;
      }
    }
  ]
},

'ch1_rooms': {
  text: `<p>Kau naik ke lantai dua bersama Niko. Tiga kamar tidur dan satu kamar mandi kecil. Kasur-kasur tua tapi masih bisa dipakai.</p>
<p><span class="speaker niko">Niko</span> mengatur pembagian kamar sambil menata seprai.</p>
<p>"Aku dan Juno di kamar depan. Sera dan Vira di kamar tengah. Kamu di kamar belakang. Oke?"</p>
<p>Dia berhenti sebentar.</p>
<p>"Arin, ada sesuatu yang harus kutunjukkan padamu."</p>
<p>Niko membuka lemari di kamar belakang — kamarmu. Di dalamnya ada kotak kayu berukir. Ukirannya sama dengan yang ada di pohon tua — lima lingkaran terhubung.</p>
<p>"Ini milik kakekku. Ini yang harus dikembalikan ke hutan."</p>
<p>Dia membuka kotak itu. Di dalamnya ada sebuah <em>batu</em> — hitam mengkilap, sebesar kepalan tangan, dengan simbol-simbol yang bercahaya redup kehijauan.</p>
<p>Batu itu berdenyut. Seperti jantung.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kakek mengambilnya dari kuil di dalam hutan. Lima puluh tahun lalu. Dan sejak itu..." dia menelan ludah, "...hutan ini tidak pernah berhenti <em>mengambil</em>."</p>`,
  choices: [
    {
      text: '"Biarkan aku yang simpan batu ini."',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.items.push('ancient_stone');
        s.flags.arinHasStone = true;
        Engine.modTrust('arin', 'niko', 8);
        s.keyChoices.push('took_stone');
      }
    },
    {
      text: '"Jangan buka itu lagi. Simpan di tempat aman."',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.nikoHasStone = true;
        Engine.modTrust('arin', 'niko', 5);
      }
    },
    {
      text: '"Yang lain harus tahu tentang ini, Niko."',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.stoneRevealed = true;
        s.moralScore += 10;
        Engine.modTrust('arin', 'niko', -8);
        s.keyChoices.push('revealed_stone');
      }
    }
  ]
},

'ch1_kitchen': {
  text: `<p>Dapur kecil tapi lengkap. Kalian membawa persediaan makanan sendiri, tapi kau menemukan beberapa kaleng lama di lemari.</p>
<p>Di balik lemari, ada sesuatu yang menarik perhatianmu — sebuah <em>foto lama</em> yang ditempel di dinding. Hitam putih, sudutnya menguning.</p>
<p>Foto itu menunjukkan lima orang berdiri di depan cabin ini. Tiga pria, dua wanita. Mereka tersenyum, tapi senyum mereka kaku. Dipaksakan. Dan di belakang mereka, di tepian hutan — ada <em>sosok keenam</em>. Kabur, seperti bergerak saat foto diambil. Tapi kau bisa melihat senyumnya. Terlalu lebar.</p>
<p>Di bagian bawah foto, tulisan tangan yang pudar:</p>
<p class="journal"><em>"Lima tamu terakhir. 1973. Tidak ada yang kembali."</em></p>`,
  choices: [
    {
      text: "Simpan foto itu",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.items.push('old_photo');
        s.secretsFound++;
        s.flags.hasOldPhoto = true;
        Engine.modAwareness('arin', 12);
      }
    },
    {
      text: "Tunjukkan foto itu pada semua orang",
      next: 'ch1_photo_reveal',
      effect: (s) => {
        s.items.push('old_photo');
        s.secretsFound++;
        s.flags.hasOldPhoto = true;
        s.flags.photoShared = true;
      }
    }
  ]
},

'ch1_photo_reveal': {
  text: `<p>Kau membawa foto itu ke ruang tamu. Semua berkumpul.</p>
<p><span class="speaker sera">Sera</span> membekap mulutnya. <span class="speaker juno">Juno</span> mengambil foto itu dan membaliknya, mencari tulisan lain.</p>
<p><span class="speaker niko">Niko</span> memucat, tapi berusaha tetap tenang.</p>
<p>"1973... itu tahun kakekku pertama kali datang ke sini. Dia membangun cabin ini."</p>
<p><span class="speaker juno">Juno</span></p>
<p>"'Tidak ada yang kembali'? Niko, kakekmu kembali. Dia hidup sampai tua."</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Ya. Tapi empat orang lainnya? Aku... aku tidak pernah tahu siapa mereka. Kakek tidak pernah cerita."</p>
<p><span class="speaker vira">Vira</span> tidak melihat foto itu. Dia melihat ke luar jendela, ke arah hutan.</p>
<p>"Mereka tidak hilang. Mereka <em>diterima</em>."</p>
<p>Keheningan. Tidak ada yang tahu harus merespons apa.</p>`,
  choices: [
    {
      text: '"Vira, apa maksudmu diterima?"',
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        Engine.modEntity(5);
        Engine.modAwareness('arin', 8);
        s.flags.questionedViraAccepted = true;
      }
    },
    {
      text: "Alihkan pembicaraan. Situasi sudah terlalu tegang.",
      next: 'ch1_bonfire_prep',
      effect: (s) => {
        s.flags.deflectedTension = true;
      }
    }
  ]
},

// ---- MALAM PERTAMA ----

'ch1_bonfire_prep': {
  text: (s) => {
    let tension = '';
    if (s.flags.seraWitnessed || s.flags.believedSera) {
      tension = `<p>Sera duduk di sebelahmu. Jari-jarinya dingin saat menyentuh tanganmu di bawah selimut — pesan tanpa kata: <em>aku di sini.</em></p>`;
    }
    if (s.flags.confrontedNiko || s.flags.blamedNiko) {
      tension += `<p>Niko menghindari tatapanmu. Rahangnya kaku. Ada tembok baru di antara kalian.</p>`;
    }

    return `<p>Malam turun cepat di hutan. Terlalu cepat. Seolah matahari memilih untuk lari daripada bertahan.</p>
<p>Niko menyalakan api di perapian. Cahayanya melempar bayangan yang menari-nari di dinding. Kalian duduk melingkar — lima sahabat, selimut di bahu, secangkir kopi atau teh di tangan masing-masing.</p>
${tension}
<p>Untuk beberapa menit, semuanya terasa <em>normal</em>. Seperti dulu. Seperti saat kalian masih SMA, bermimpi besar dan tidak takut pada apapun.</p>
<p><span class="speaker juno">Juno</span> memecah keheningan.</p>
<p>"Kalian tahu apa yang aku rindukan? Saat kita masih bodoh dan bahagia. Sebelum kita tahu bahwa dunia ini..." dia berhenti, menatap api, "...lebih rumit dari yang kita kira."</p>
<p><span class="speaker niko">Niko</span> mengangkat cangkirnya.</p>
<p>"Toast. Untuk Vira yang sudah kembali. Untuk persahabatan yang tidak bisa dipatahkan."</p>
<p>Vira tersenyum. Api menerangi wajahnya, dan untuk sekejap, bayangannya di dinding tidak cocok dengan gerakannya.</p>`;
  },
  choices: [
    {
      text: "Ikut toast dan nikmati momen ini",
      hint: "Kadang, kebahagiaan kecil perlu dijaga.",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 5);
        Engine.modTrust('arin', 'juno', 5);
        s.moralScore += 5;
      }
    },
    {
      text: "Amati bayangan Vira yang tidak sinkron",
      next: 'ch1_shadow',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.sawShadow = true;
      }
    },
    {
      text: "Ini saatnya bicara jujur. Ceritakan apa yang kau tahu.",
      hint: "Berisiko, tapi kelompok perlu tahu.",
      next: 'ch1_truth_time',
      effect: (s) => {
        s.flags.earlyTruth = true;
        s.moralScore += 15;
        s.keyChoices.push('early_truth');
      }
    },
    {
      text: "Ajak Juno bicara berdua di beranda",
      hint: "Juno menyembunyikan sesuatu. Kamu bisa merasakannya.",
      next: 'ch1_juno_porch',
      condition: (s) => !s.flags.junoConfessed,
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 8);
        s.flags.porchTalkJuno = true;
      }
    },
    {
      text: "Periksa kamar yang disiapkan Niko — ada yang janggal",
      next: 'ch1_check_rooms',
      condition: (s) => !s.flags.checkedFootprints,
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.checkedRooms = true;
      }
    }
  ]
},

'ch1_bonfire_stories': {
  text: `<p>Kalian bertukar cerita. Tertawa. Untuk beberapa jam, hutan di luar menghilang dari pikiran kalian.</p>
<p>Juno menceritakan kisah kencan bencana terbarunya. Sera menunjukkan sketsa-sketsa terbaru di buku gambarnya — potret kalian berlima, digambar dari ingatan. Niko berbicara tentang rencana bisnisnya dengan semangat yang familiar.</p>
<p>Vira mendengarkan segalanya dengan senyum yang tidak pernah berubah. Seperti topeng yang dilukis permanen.</p>
<p>Menjelang tengah malam, kantuk mulai mengambil alih.</p>
<p><span class="speaker sera">Sera</span> menguap. "Aku naik duluan."</p>
<p><span class="speaker niko">Niko</span> meregangkan badan. "Ya, kita semua butuh istirahat. Besok..." dia berhenti sejenak, "...besok kita jelajahi hutan."</p>
<p>Saat yang lain naik ke lantai dua, kau tetap di ruang tamu sebentar. Bara api berpendar merah. Rumah berderit.</p>
<p>Dan dari lantai bawah — dari bawah lantai — kau mendengar denyut itu lagi. Pelan. Ritmis. Seperti jantung.</p>`,
  choices: [
    {
      text: "Tidur. Besok akan panjang.",
      next: 'ch1_night_event',
      effect: (s) => { s.flags.sleptNormally = true; }
    },
    {
      text: "Cari sumber denyut itu — dari bawah lantai",
      danger: true,
      next: 'ch1_basement',
      effect: (s) => {
        s.flags.foundBasement = true;
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Jaga. Awasi Vira malam ini.",
      next: 'ch1_watch_vira_night',
      effect: (s) => {
        s.flags.watchedViraNight = true;
        s.courage.arin += 10;
      }
    }
  ]
},

'ch1_shadow': {
  text: `<p>Kau fokus pada bayangan Vira di dinding.</p>
<p>Bayangan yang lain bergerak sesuai dengan pemiliknya — ketika Juno mengangkat tangan, bayangannya ikut mengangkat tangan. Ketika Sera menunduk, bayangannya menunduk.</p>
<p>Tapi bayangan Vira... <em>terlambat</em>. Selalu setengah detik di belakang. Dan kadang — kadang bayangannya melakukan gerakan yang Vira sendiri tidak lakukan. Memiringkan kepala saat Vira diam. Mengangkat tangan saat Vira duduk tenang.</p>
<p>Dan yang paling mengerikan: ketika Vira tersenyum, bayangannya <em>tidak</em> tersenyum. Mulut bayangannya terbuka — lebih lebar dari yang mungkin — dalam apa yang terlihat seperti teriakan tanpa suara.</p>
<p>Kau mengerjap. Bayangan kembali normal.</p>
<p>Sera menyentuh tanganmu di bawah selimut. Dia juga melihatnya.</p>`,
  glitch: true,
  choices: [
    {
      text: "Bisikkan pada Sera: 'Itu bukan Vira.'",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        Engine.modAwareness('arin', 10);
        Engine.modAwareness('sera', 10);
        s.flags.confirmedToSera = true;
        s.keyChoices.push('confirmed_shadow');
      }
    },
    {
      text: "Simpan untuk dirimu. Jangan buat Sera lebih takut.",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.keptShadowSecret = true;
      }
    }
  ]
},

'ch1_truth_time': {
  text: (s) => {
    let reveals = '<p>Kau menarik napas dalam.</p><p>"Sebelum kita tidur, aku perlu bicara. Jujur. Tentang semua yang aku tahu."</p>';

    if (s.flags.believedSera || s.flags.seraAlliance) {
      reveals += `<p>"Sera sudah memperingatkanku tentang Vira. Dan aku percaya padanya."</p>`;
    }
    if (s.flags.junoConfessed) {
      reveals += `<p>"Juno — dia ada di Halimun bersama Vira. Dia melihat sesuatu terjadi padanya."</p>`;
    }
    if (s.flags.askedNikoSecret || s.flags.nikoVulnerable) {
      reveals += `<p>"Niko tidak mengajak kita untuk liburan. Kakeknya meninggalkan sesuatu di sini yang harus dikembalikan ke hutan."</p>`;
    }

    reveals += `<p>Keheningan yang mengikuti terasa seperti batu yang jatuh ke dasar sumur.</p>
<p><span class="speaker niko">Niko</span> berdiri. "Arin, ini bukan—"</p>
<p><span class="speaker juno">Juno</span> menunduk, air mata mengalir. "Maaf. Maaf aku tidak bilang dari awal."</p>
<p><span class="speaker sera">Sera</span> memeluk lututnya. "Aku sudah bilang. Aku sudah bilang dari awal."</p>
<p><span class="speaker vira">Vira</span> — hanya tersenyum. Tenang. Terlalu tenang.</p>
<p>"Wah," katanya pelan. "Kalian semua sudah tahu, ya?"</p>`;

    return reveals;
  },
  shake: true,
  choices: [
    {
      text: '"Vira — atau apapun namamu — siapa kau sebenarnya?"',
      next: 'ch1_early_confrontation',
      danger: true,
      minDifficulty: 2,
      effect: (s) => {
        Engine.modEntity(15);
        s.flags.earlyConfront = true;
        s.keyChoices.push('early_confrontation');
      }
    },
    {
      text: '"Kita tidak tahu siapa musuh kita. Jangan terburu-buru."',
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.cautious = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch1_early_confrontation': {
  text: `<div class="scene-art scene-entity"></div>
<p>Vira berdiri perlahan. Senyumnya tidak berubah, tapi suhu ruangan turun beberapa derajat. Api di perapian berkedip.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Arin, Arin..." Suaranya berlapis — suara Vira, dan sesuatu yang lain di bawahnya. Lebih tua. Lebih dalam.</p>
<p>"Kalian pikir ini tentang aku? Ini tentang <em>kalian</em>. Lima benang yang terikat. Lima simpul yang hutan butuhkan."</p>
<p>"Aku bukan musuh kalian. Aku... <em>jembatan</em>."</p>
<p>Jarinya terangkat, menunjuk ke lantai.</p>
<p>"Yang asli — Vira-mu yang asli — masih ada. Di bawah sana. Di tempat simpul bermula. Aku menjaganya. Aku menjaga <em>kalian semua</em>."</p>
<p><span class="speaker sera">Sera</span> terisak. <span class="speaker juno">Juno</span> mundur sampai punggungnya menabrak dinding.</p>
<p><span class="speaker niko">Niko</span> — mengejutkan semua orang — melangkah maju.</p>
<p>"Batu kakekku. Itu yang kau mau, kan? Aku bisa memberikannya."</p>
<p>Vira memiringkan kepalanya. "Bukan memberi. <em>Mengembalikan</em>."</p>`,
  blood: true,
  choices: [
    {
      text: '"Kalau kami kembalikan batu itu, apa yang terjadi?"',
      next: 'ch2_negotiation',
      effect: (s) => {
        s.chapter = 2;
        s.flags.negotiating = true;
        s.keyChoices.push('negotiated');
      }
    },
    {
      text: '"Tunjukkan Vira yang asli dulu. Buktikan dia masih hidup."',
      next: 'ch2_demand_proof',
      effect: (s) => {
        s.chapter = 2;
        s.flags.demandedProof = true;
        s.moralScore += 10;
        s.keyChoices.push('demanded_proof');
      }
    },
    {
      text: '"Niko, JANGAN. Kita tidak tahu apa yang akan terjadi."',
      next: 'ch2_resist',
      effect: (s) => {
        s.chapter = 2;
        Engine.modTrust('arin', 'niko', -10);
        s.flags.resistedDeal = true;
        s.keyChoices.push('resisted');
      }
    }
  ]
},

'ch1_juno_porch': {
  text: `<p>Beranda cabin menghadap ke hutan. Bulan menerangi pucuk-pucuk pinus dengan cahaya pucat. Juno duduk di anak tangga, menggosok-gosok gelang di pergelangan tangannya — kebiasaan nervousnya.</p>
<p>"Hei." Kau duduk di sampingnya.</p>
<p><span class="speaker juno">Juno</span> tidak langsung merespons. Matanya terpaku pada hutan.</p>
<p>"Arin... kamu percaya pada hantu?"</p>
<p>"Tergantung konteksnya."</p>
<p>"Konteksnya..." Juno menelan ludah. "Konteksnya aku pernah melihat sahabatku berubah menjadi sesuatu yang bukan manusia. Di hutan yang persis seperti ini."</p>
<p>Dia menoleh padamu. Air mata mengalir tanpa suara.</p>
<p>"Aku ada di Halimun bersama Vira. Malam itu... malam Vira menghilang... aku ada di sana, Arin. Dan aku <em>lari</em>."</p>
<p>Suaranya pecah. Candaan, tawa, sarkasme — semua topeng itu jatuh. Yang tersisa hanya seorang gadis yang sudah menyimpan rasa bersalah selama enam bulan.</p>
<p>"Aku melihat sesuatu menelannya. Dari bawah tanah. Dan aku lari seperti pengecut."</p>`,
  choices: [
    {
      text: "Peluk Juno. Dia butuh ini lebih dari kata-kata.",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 15);
        s.flags.junoConfessed = true;
        s.flags.comfortedJunoDeeply = true;
        s.moralScore += 15;
        s.keyChoices.push('comforted_juno_deep');
      }
    },
    {
      text: '"Kau harus ceritakan ini pada semua orang. Malam ini."',
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        s.flags.junoConfessed = true;
        s.flags.junoWillConfess = true;
        s.moralScore += 10;
        s.keyChoices.push('juno_will_confess');
      }
    },
    {
      text: '"Kenapa kau tetap datang ke sini kalau kau tahu bahayanya?"',
      next: 'ch1_juno_guilt',
      effect: (s) => {
        s.flags.junoConfessed = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch1_juno_guilt': {
  text: `<p><span class="speaker juno">Juno</span> tertawa — tawa pahit yang lebih menyakitkan dari tangisan.</p>
<p>"Karena aku tidak bisa tidur lagi, Arin. Setiap malam, aku bermimpi tentang Vira. Berdiri di lubang itu. Menatapku. Berkata, 'Kenapa kau meninggalkanku?'"</p>
<p>"Dan ketika Niko bilang dia mau ke hutan yang terhubung dengan Halimun — aku tahu. Ini kesempatanku. Bukan untuk menyelamatkan Vira. Tapi untuk <em>menebus</em>."</p>
<p>"Kalau aku harus mati di hutan ini untuk membebaskan Vira — aku bersedia."</p>
<p>Kau menatap Juno — orang yang selalu bersembunyi di balik lelucon — dan untuk pertama kalinya kau melihat kedalaman yang tidak pernah kau duga ada di sana.</p>
<p>Dari dalam cabin, suara tertawa yang lain terdengar samar. Normal. Hangat. Tapi di beranda ini, dunia sudah berubah.</p>`,
  choices: [
    {
      text: '"Tidak ada yang akan mati. Kita cari jalan lain."',
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 12);
        s.flags.promisedNoDeaths = true;
        s.moralScore += 10;
      }
    },
    {
      text: '"Kita lawan ini bersama. Aku bersamamu, Juno."',
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 15);
        s.flags.junoAlliance = true;
        s.keyChoices.push('juno_alliance');
      }
    }
  ]
},

'ch1_check_rooms': {
  text: `<p>Kau naik ke lantai dua sementara yang lain masih di perapian. Lorong sempit dengan tiga pintu kamar.</p>
<p>Kamar pertama — milik Niko dan Juno. Biasa.</p>
<p>Kamar kedua — milik Sera dan Vira. Kau membuka pintunya. Di dalamnya, dua tempat tidur berhadapan. Tapi ada sesuatu di bawah tempat tidur Vira — kau menunduk dan melihatnya.</p>
<p>Tanah. Gundukan kecil tanah hitam lembab. <em>Di bawah tempat tidur</em>. Dan dari tanah itu, akar kecil — akar yang hidup — menjulur ke atas, melilit kaki tempat tidur.</p>
<p>Hutan sudah masuk ke dalam cabin.</p>
<p>Kau juga melihat sesuatu di dinding — goresan samar, nyaris tidak terlihat. Kau menyalakan senter ponsel dan mendekatkan. Goresan itu membentuk kata-kata dalam bahasa yang tidak kau kenal, tapi satu kata bisa kau baca:</p>
<p class="journal"><em>"TOLONG"</em></p>
<p>Ditulis dengan kuku. Di permukaan bagian dalam dinding. Dari sisi yang seharusnya tidak bisa dijangkau.</p>`,
  shake: true,
  choices: [
    {
      text: "Cabut akar-akar itu",
      next: 'ch1_bonfire_stories',
      danger: true,
      effect: (s) => {
        Engine.modEntity(8);
        s.flags.pulledRoots = true;
        s.secretsFound++;
        Engine.modAwareness('arin', 12);
      }
    },
    {
      text: "Foto semuanya dengan ponsel lalu turun",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        s.flags.documentedRoom = true;
        s.secretsFound++;
        Engine.modAwareness('arin', 10);
        s.keyChoices.push('documented_evidence');
      }
    },
    {
      text: "Ceritakan pada Sera — dia tidur di kamar ini",
      next: 'ch1_warn_sera',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        s.flags.warnedSeraRoom = true;
      }
    }
  ]
},

'ch1_warn_sera': {
  text: `<p>Kau menarik Sera ke samping dan membawanya ke lantai dua.</p>
<p><span class="speaker sera">Sera</span> melihat akar-akar itu dan mundur ke dinding.</p>
<p>"Aku tidak tidur di kamar ini. Tidak. Tidak mungkin."</p>
<p>"Sera—"</p>
<p>"Arin, <em>lihat</em>." Dia menunjuk ke akar-akar itu. "Mereka bergerak."</p>
<p>Benar. Akar-akar itu — pelan, hampir tidak terlihat — bergerak. Menjalar. Seperti jari yang meraba dalam gelap.</p>
<p>"Ini bukan normal. Ini bukan jamur atau apapun. Hutan ini <em>hidup</em> dan sedang masuk ke dalam cabin."</p>
<p>Sera menatapmu dengan ketakutan dan tekad yang bersamaan.</p>
<p>"Aku tidur di kamarmu malam ini. Dan besok pagi, kita paksa Niko menjelaskan <em>semuanya</em>."</p>`,
  choices: [
    {
      text: "Setuju. Kalian perlu saling jaga.",
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 12);
        s.flags.seraRoomSwitch = true;
        s.flags.seraPartner = true;
        s.keyChoices.push('sera_room_switch');
      }
    },
    {
      text: '"Jangan tunjukkan ketakutanmu pada Vira. Dia mungkin bisa merasakannya."',
      next: 'ch1_bonfire_stories',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 8);
        Engine.modAwareness('arin', 5);
        s.flags.warnedAboutVira = true;
      }
    }
  ]
},

'ch1_basement': {
  text: `<div class="scene-art scene-ritual"></div>
<p>Kau menemukan pintu jebakan di bawah karpet ruang tamu. Engselnya baru diminyaki — seseorang sudah membukanya belum lama ini.</p>
<p>Di bawahnya, tangga kayu menuju kegelapan. Bau tanah naik seperti napas makhluk yang tertidur.</p>
<p>Kau menyalakan senter ponselmu dan turun.</p>
<p>Ruang bawah tanah kecil — dinding batu lembab, lantai tanah. Di tengahnya, ada <em>lingkaran</em> yang digambar di lantai dengan sesuatu yang berwarna merah gelap. Di dalam lingkaran itu ada lima titik — persis seperti simbol di kotak Niko, di pohon tua, di kertas yang Sera temukan.</p>
<p>Dan di salah satu dinding, ada <em>ukiran tangan</em>. Lima cetakan tangan yang ditekan ke batu basah. Empat sudah mengering dan memudar. Tapi yang kelima — yang kelima masih <em>segar</em>. Basah.</p>
<p>Sentermu berkedip. Dan dalam kegelapan antara kedipan, kau melihat sesuatu bergerak di sudut ruangan.</p>
<p>Sentermu menyala kembali. Tidak ada apa-apa.</p>
<p>Tapi di tanah dekat kakimu, ada jejak kaki baru. Kaki telanjang. Mengarah ke dinding yang solid — dan menghilang di sana.</p>`,
  shake: true,
  choices: [
    {
      text: "Naik kembali. Sekarang.",
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.sawBasement = true;
        s.secretsFound++;
        Engine.modAwareness('arin', 15);
        s.keyChoices.push('saw_basement');
      }
    },
    {
      text: "Sentuh cetakan tangan yang masih basah",
      danger: true,
      next: 'ch1_basement_touch',
      effect: (s) => {
        Engine.modEntity(20);
        s.flags.touchedHandprint = true;
        s.keyChoices.push('touched_handprint');
      }
    }
  ]
},

'ch1_basement_touch': {
  text: `<p>Kau meletakkan tanganmu di cetakan yang basah.</p>
<p>Pas. Ukurannya <em>persis</em> tanganmu.</p>
<p class="sound">— sesuatu bernapas di telingamu —</p>
<p>Bisikan. Langsung di dalam kepalamu.</p>
<p class="journal"><em>"Satu dari lima sudah menyentuh. Empat lagi. Simpul hampir lengkap. Terima kasih, Arin."</em></p>
<p>Tanganmu terbakar. Kau menariknya, tapi sesuatu telah berubah — di telapak tanganmu, sebuah simbol muncul. Lingkaran kecil dengan garis melintang. Samar, seperti bekas luka lama, tapi kau tahu itu tidak ada sebelumnya.</p>
<p>Dari atas, kau mendengar langkah kaki. Seseorang turun.</p>
<p>Vira muncul di tangga. Matanya bercahaya dalam gelap — hijau redup seperti kunang-kunang.</p>
<p>"Kamu tidak seharusnya di sini, Arin." Suaranya penuh sayang yang salah. "Belum waktunya."</p>
<p>Lampu sentermu mati total.</p>`,
  blood: true,
  shake: true,
  glitch: true,
  choices: [
    {
      text: "Dorong melewati Vira dan naik ke atas",
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.basementMarked = true;
        s.courage.arin += 10;
        Engine.modAwareness('arin', 20);
        s.secretsFound++;
      }
    }
  ]
},

'ch1_watch_vira_night': {
  text: `<p>Kau berpura-pura naik ke kamarmu, tapi kembali turun setelah setengah jam. Kau duduk di sudut gelap ruang tamu, menunggu.</p>
<p>Jam satu malam. Cabin sunyi. Bara perapian hampir padam.</p>
<p>Lalu kau mendengarnya. Langkah kaki di tangga. Pelan. Tanpa suara. Seperti sesuatu yang belajar berjalan tanpa terdengar.</p>
<p>Vira turun. Matanya terbuka tapi... kosong. Seperti boneka yang digerakkan dari jauh. Dia berjalan lurus ke pintu depan, membukanya tanpa suara, dan keluar.</p>
<p>Kau mengikutinya.</p>
<p>Di luar, bulan purnama menerangi clearing. Vira berjalan ke tepi hutan — dan <em>pohon-pohon bergerak</em>. Bukan karena angin. Cabang-cabang membuka jalan untuknya, seperti tirai yang disibakkan.</p>
<p>Dia berhenti di tepi bayangan dan menoleh ke belakang. Langsung menatap tempat kau bersembunyi.</p>
<p>"Kamu bisa ikut, Arin." Suaranya lembut seperti madu. "Atau kamu bisa kembali tidur dan berpura-pura ini semua mimpi. Pilih yang membuatmu nyaman."</p>`,
  choices: [
    {
      text: "Ikuti Vira ke dalam hutan",
      danger: true,
      next: 'ch1_follow_vira_forest',
      effect: (s) => {
        s.courage.arin += 15;
        s.flags.followedViraForest = true;
        Engine.modEntity(10);
        s.keyChoices.push('followed_entity_night');
      }
    },
    {
      text: "Kembali ke cabin. Bangunkan yang lain.",
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.retreatedFromVira = true;
        s.flags.warnedOthers = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch1_follow_vira_forest': {
  text: `<div class="scene-art scene-forest"></div>
<p>Kau mengikutinya. Hutan terbuka untukmu juga — cabang-cabang menyingkir, akar-akar merata.</p>
<p>Vira membawamu ke sebuah clearing kecil. Di tengahnya, pohon tua yang sama — yang kau temukan (atau hampir temukan) sebelumnya. Akar-akarnya memeluk tanah seperti jari-jari raksasa.</p>
<p>Vira berbalik menghadapmu. Di bawah cahaya bulan, wajahnya berubah. Bukan Vira lagi — sesuatu yang lebih tua, lebih transparan, dengan fitur-fitur yang terlalu simetris untuk menjadi manusia.</p>
<p>"Arin." Suaranya berlapis — puluhan suara dalam satu. "Aku ingin kamu mengerti. Aku bukan monster."</p>
<p>"Lima ratus tahun lalu, lima jiwa membuat perjanjian denganku. Mereka memberikan ikatan persahabatan mereka sebagai ganti perlindungan untuk desa mereka. Tapi satu — yang paling egois — mengkhianatiku. Mengambil inti kekuatanku dan meninggalkanku terikat di sini."</p>
<p>"Kakek Niko menemukan inti itu dan membawanya pergi. Sejak itu, aku perlahan mati. Dan hutan ini — hutan yang melindungi ribuan jiwa selama berabad-abad — ikut mati."</p>
<p>"Aku mengambil wujud Vira karena aku membutuhkan jembatan. Seseorang yang terhubung dengan kalian berlima. Vira-mu... dia masih ada di sini. Tertidur. Aman. Aku berjanji."</p>
<p>Tangan transparannya menunjuk ke akar pohon, di mana cahaya hijau lembut berdenyut.</p>
<p>"Yang aku butuhkan: kembalikan batu itu. Dan ikatkan simpul baru. Lima ikatan yang tulus."</p>
<p>Apakah kau percaya?</p>`,
  choices: [
    {
      text: '"Aku ingin percaya. Tapi tunjukkan Vira."',
      next: 'ch1_see_real_vira',
      effect: (s) => {
        s.flags.askedToSeeVira = true;
        s.moralScore += 10;
        s.keyChoices.push('asked_see_vira');
      }
    },
    {
      text: '"Kau mengambil wujud orang yang kami cintai. Itu bukan tindakan sesuatu yang baik."',
      next: 'ch1_challenge_entity',
      effect: (s) => {
        s.flags.challengedEntity = true;
        s.moralScore += 15;
        Engine.modEntity(-5);
        s.keyChoices.push('challenged_entity');
      }
    },
    {
      text: '"Apa yang terjadi kalau kami menolak?"',
      next: 'ch1_refuse_question',
      effect: (s) => {
        s.flags.askedRefusal = true;
        s.keyChoices.push('asked_refusal');
      }
    }
  ]
},

'ch1_see_real_vira': {
  text: `<p>Entitas memiringkan kepalanya. Lalu mengangguk.</p>
<p>Akar pohon bergerak — membuka celah kecil di tanah. Cahaya hijau mengalir keluar.</p>
<p>Dan di sana, tertidur di antara akar-akar yang memeluknya seperti selimut, ada <em>Vira</em>. Vira yang asli. Wajahnya damai. Napasnya teratur. Gelang manik-manik yang sama — yang kau temukan di cabin — ada duplikatnya di pergelangan tangannya.</p>
<p>Dia hidup. Benar-benar hidup.</p>
<p>Air mata mengalir di pipimu tanpa kau sadari. Karena melihat wajahnya — wajah sahabatmu yang <em>nyata</em> — membuatmu menyadari betapa dalamnya ketakutan yang kau tekan selama berbulan-bulan.</p>
<p>Entitas menutup celah itu kembali.</p>
<p>"Dia aman. Selama simpul belum terputus, dia akan terus tertidur dalam damai. Tapi kalau aku mati..." suaranya retak, "...dia juga mati. Kami terikat sekarang."</p>
<p>"Bawa aku ke teman-temanmu, Arin. Ceritakan apa yang kau lihat. Dan biarkan mereka memilih."</p>`,
  choices: [
    {
      text: "Kembali ke cabin dengan jawaban",
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.sawRealVira = true;
        s.flags.entityTrustBuilt = true;
        s.secretsFound += 2;
        Engine.modAwareness('arin', 20);
        s.keyChoices.push('saw_real_vira');
      }
    }
  ]
},

'ch1_challenge_entity': {
  text: `<p>Entitas terdiam. Untuk pertama kalinya, senyumnya menghilang. Yang tersisa adalah kesedihan yang kuno — kesedihan yang telah mengendap selama berabad-abad.</p>
<p>"Kau benar." Suaranya pelan. "Mengambil wujud orang yang kalian cintai... itu tindakan sesuatu yang putus asa. Bukan sesuatu yang baik."</p>
<p>"Aku telah sendirian selama sangat lama, Arin. Simpul yang mengikatku ke dunia kalian semakin tipis. Aku bisa merasakan diriku menghilang — sedikit demi sedikit — dan bersama aku, hutan ini, dan semua yang bergantung padanya."</p>
<p>"Aku memilih Vira karena dia datang ke hutan ini sendirian. Dia <em>tersesat</em>. Aku menemukannya saat hujan, kedinginan, putus asa. Aku menyelamatkan nyawanya."</p>
<p>"Dan sebagai gantinya... aku meminjam wujudnya. Agar aku bisa mendekati empat teman lainnya. Agar aku bisa membawa kalian ke sini."</p>
<p>"Apakah itu benar? Tidak. Tapi apakah itu <em>perlu</em>? Aku tidak tahu lagi."</p>
<p>Cahaya bulan bergetar. Angin berhenti.</p>
<p>"Arin — kalau kau punya cara yang lebih baik... aku mendengarkan."</p>`,
  choices: [
    {
      text: '"Kembalikan Vira dulu. Lalu kita bicara."',
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.demandedViraReturn = true;
        s.moralScore += 20;
        s.keyChoices.push('demanded_vira_return');
      }
    },
    {
      text: '"Kita temukan jalan bersama. Aku janji."',
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.promisedEntity = true;
        s.moralScore += 10;
        Engine.modEntity(-10);
        s.keyChoices.push('promised_entity');
      }
    }
  ]
},

'ch1_refuse_question': {
  text: `<p>Entitas menatapmu lama.</p>
<p>"Kalau kalian menolak?"</p>
<p>Suhu udara turun. Pohon-pohon di sekeliling clearing bergetar — bukan karena angin, tapi karena sesuatu di bawah tanah bergerak.</p>
<p>"Aku akan mati. Perlahan. Menyakitkan. Dan dalam kematianku, hutan ini akan menjadi <em>salah</em>. Bukan mati — <em>salah</em>. Tempat di mana aturan-aturan dunia tidak berlaku lagi."</p>
<p>"Vira-mu akan tetap tertidur. Selamanya. Tidak mati, tapi tidak pernah bangun. Terkurung dalam mimpi yang semakin gelap."</p>
<p>"Dan kalian? Kalian bisa pergi. Tapi kalian tidak akan pernah bisa kembali. Dan bagian dari diri kalian — bagian yang terikat satu sama lain — akan perlahan <em>layu</em>. Persahabatan kalian akan membusuk dari dalam. Tidak ada yang akan ingat mengapa mereka pernah peduli satu sama lain."</p>
<p>"Itu bukan ancaman, Arin. Itu <em>konsekuensi</em>."</p>`,
  choices: [
    {
      text: "Kembali ke cabin. Kau perlu berpikir.",
      next: 'ch1_night_event',
      effect: (s) => {
        s.flags.heardConsequences = true;
        Engine.modAwareness('arin', 15);
        s.keyChoices.push('heard_consequences');
      }
    }
  ]
},

// ---- NIGHT EVENT (leads to Chapter 2) ----

'ch1_night_event': {
  text: (s) => {
    let context = '';
    if (s.flags.sawRealVira) {
      context = `<p>Kau berbaring di tempat tidur tapi pikiranmu tidak bisa diam. Wajah Vira — Vira yang asli, tertidur di antara akar-akar — terbakar di balik kelopak matamu.</p>`;
    } else if (s.flags.basementMarked) {
      context = `<p>Kau menatap telapak tanganmu dalam gelap. Simbol itu berdenyut samar — hijau redup, seperti detak jantung yang bukan milikmu.</p>`;
    } else {
      context = `<p>Kau berbaring gelisah. Setiap suara — setiap derit kayu, setiap desir angin — terasa seperti peringatan.</p>`;
    }

    return `${context}
<p>Jam tiga pagi. Kau terbangun oleh suara.</p>
<p>Bukan suara hutan. Bukan suara angin atau binatang. Ini suara yang lebih dekat — dari dalam cabin.</p>
<p><em>Teriakan.</em></p>
<p>Sera.</p>
<p>Kau melompat dari tempat tidur dan berlari ke lorong. Niko sudah di sana, mata lebar. Juno di belakangnya.</p>
<p>Pintu kamar Sera dan Vira terbuka. Sera berdiri di sudut kamar, menggigil hebat, menatap tempat tidur Vira.</p>
<p>Tempat tidur itu <em>kosong</em>. Tapi bantal dan seprainya basah — bukan air, bukan keringat. <em>Tanah.</em> Tanah hitam lembab yang berbau hutan.</p>
<p>Dan di dinding di atas tempat tidur, ditulis dengan tanah yang sama:</p>
<p class="journal"><em>"EMPAT LAGI."</em></p>`;
  },
  shake: true,
  choices: [
    {
      text: '"Kita cari Vira. Sekarang."',
      next: 'ch2_search',
      effect: (s) => {
        s.chapter = 2;
        s.flags.searchedForVira = true;
        s.courage.arin += 10;
      }
    },
    {
      text: '"Jangan keluar cabin. Tunggu sampai pagi."',
      next: 'ch2_wait_morning',
      effect: (s) => {
        s.chapter = 2;
        s.flags.waitedTillMorning = true;
      }
    },
    {
      text: '"Niko — ceritakan SEMUA yang kau tahu. Sekarang."',
      next: 'ch2_force_niko',
      effect: (s) => {
        s.chapter = 2;
        s.flags.forcedNikoTruth = true;
        s.keyChoices.push('forced_niko');
      }
    },
    {
      text: '"Sera, kau tahu sesuatu. Ceritakan."',
      next: 'ch2_sera_reveals',
      condition: (s) => s.flags.seraPartner || s.flags.warnedSeraRoom || s.flags.confirmedToSera,
      effect: (s) => {
        s.chapter = 2;
        s.flags.seraRevealed = true;
        s.keyChoices.push('sera_revealed');
      }
    }
  ]
}

};
