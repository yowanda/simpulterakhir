/* ============================================================
   SIMPUL TERAKHIR — PROLOG: Pertemuan Kembali
   Lima sahabat berkumpul kembali setelah Vira "kembali"
   dari hilang 6 bulan. Perjalanan ke cabin keluarga Niko.
   ============================================================ */

const STORY_PROLOG = {

'prologue_start': {
  chapter: 0,
  text: `<p class="narration">Enam bulan lalu, Vira pergi camping sendirian ke Gunung Halimun. Dia menghilang selama tiga minggu. Ketika dia kembali, dia tersenyum seperti tidak terjadi apa-apa. Tidak ada yang berani bertanya mengapa.</p>
<p>Mobil Niko berhenti di ujung jalan setapak. Hutan pinus menjulang di depan kalian seperti dinding hidup — gelap, dalam, dan bernapas.</p>
<p><span class="speaker niko">Niko</span> mematikan mesin dan tersenyum lebar.</p>
<p>"Cabin keluargaku cuma dua jam jalan kaki dari sini. Kita butuh ini — kalian semua butuh ini. Kapan terakhir kali kita berlima berkumpul?"</p>
<p class="sound">— angin mendesir melalui pucuk pinus, membawa bau tanah basah dan sesuatu yang lebih tua —</p>
<p><span class="speaker sera">Sera</span> merapatkan jaketnya, matanya menyapu tepian hutan.</p>
<p>"Aku... tidak ingat hutannya segelap ini di foto."</p>
<p><span class="speaker juno">Juno</span> melompat keluar mobil sambil meregangkan badan.</p>
<p>"Sera, kau pikir foto Instagram Niko itu tidak pakai filter? Semua terlihat lebih cantik di internet."</p>
<p><span class="speaker vira">Vira</span> sudah berdiri di luar, wajahnya terangkat ke arah pepohonan. Matanya setengah terpejam. Senyumnya tipis — terlalu tipis.</p>
<p>"Hutannya... rindu."</p>
<p>Sera melirikmu. Kau menangkap tatapannya — ada sesuatu di sana. Keresahan yang sudah mengendap selama berbulan-bulan.</p>
<p>Niko sudah mulai membagikan tugas siapa membawa apa. Tas-tas ransel menunggu di bagasi.</p>`,
  choices: [
    {
      text: "Bantu Sera dengan tasnya — dia terlihat tidak nyaman",
      hint: "Sera selalu jujur padamu. Mungkin dia tahu sesuatu.",
      next: 'prologue_sera',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 8);
        s.flags.firstTalk = 'sera';
      }
    },
    {
      text: "Tanya Niko kenapa dia tiba-tiba ingin ke cabin sekarang",
      hint: "Niko selalu punya agenda. Selalu.",
      next: 'prologue_niko',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 5);
        s.flags.firstTalk = 'niko';
      }
    },
    {
      text: "Hampiri Juno — biasanya dia lebih berisik dari ini",
      hint: "Di balik candanya, Juno menyimpan sesuatu.",
      next: 'prologue_juno',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 8);
        s.flags.firstTalk = 'juno';
      }
    },
    {
      text: "Dekati Vira — tanyakan apa maksud 'hutannya rindu'",
      hint: "Sejak kembali, Vira... berbeda.",
      danger: true,
      next: 'prologue_vira',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 5);
        Engine.modEntity(5);
        s.flags.firstTalk = 'vira';
      }
    }
  ]
},

'prologue_sera': {
  text: `<p>Kau mengambil tas Sera sebelum dia sempat mengangkatnya.</p>
<p><span class="speaker sera">Sera</span> tersenyum lemah.</p>
<p>"Makasih, Arin."</p>
<p>Kalian berjalan sedikit di belakang yang lain. Sera menunduk, jari-jarinya meremas tali ranselnya.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Arin... kamu perhatikan tidak? Vira?"</p>
<p>Dia menggigit bibir.</p>
<p>"Aku tahu kedengarannya gila. Tapi sejak dia kembali dari Halimun... dia bukan Vira. Maksudku — dia <em>terlihat</em> seperti Vira. Dia <em>berbicara</em> seperti Vira. Tapi ada sesuatu di balik matanya yang..." Sera berhenti. "...yang <em>bukan dia</em>."</p>
<p>Di depan, Vira menoleh ke belakang. Senyumnya. Matanya bertemu matamu — dan untuk sepersekian detik, kau melihat sesuatu bergerak di balik pupilnya. Seperti kabut hitam yang berputar.</p>
<p>Lalu hilang.</p>
<p><span class="speaker sera">Sera</span> mencengkeram lenganmu.</p>
<p>"Kamu lihat itu?"</p>`,
  choices: [
    {
      text: '"Ya. Aku melihatnya."',
      hint: "Jujur pada Sera. Percaya instingmu.",
      next: 'prologue_sera_believe',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        Engine.modAwareness('arin', 15);
        s.flags.believedSera = true;
        s.moralScore += 5;
      }
    },
    {
      text: '"Mungkin kau hanya kelelahan, Sera."',
      hint: "Tidak ingin membuat Sera lebih cemas.",
      next: 'prologue_sera_deny',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', -5);
        s.flags.deniedSera = true;
      }
    },
    {
      text: '"Ceritakan lebih lanjut. Apa lagi yang kau perhatikan?"',
      hint: "Kumpulkan informasi sebelum menyimpulkan.",
      next: 'prologue_sera_investigate',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 5);
        Engine.modAwareness('arin', 10);
        s.flags.investigatedVira = true;
      }
    }
  ]
},

'prologue_sera_believe': {
  text: `<p>Sera menghela napas — bukan lega, tapi penuh rasa takut yang terkonfirmasi.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Aku tidak gila. Terima kasih, Arin. Aku... aku sudah menahannya sendirian selama berbulan-bulan."</p>
<p>Dia berbisik lebih pelan.</p>
<p>"Tiga minggu setelah dia kembali, aku menginap di rumahnya. Tengah malam, aku terbangun. Vira berdiri di sudut kamar — <em>menghadap dinding</em>. Tidak bergerak. Selama berjam-jam. Dan saat aku memanggilnya..." Sera menelan ludah. "...dia berbalik dengan gerakan yang terlalu cepat. Seperti boneka yang diputar."</p>
<p>"Lalu dia tersenyum dan berkata, 'Maaf, aku bermimpi sambil berjalan.' Tapi matanya... matanya tidak tersenyum, Arin."</p>
<p>Di depan, Niko melambaikan tangan.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Hei, kalian berdua! Jangan pacaran di belakang. Ayo cepat, matahari tidak menunggu!"</p>`,
  choices: [
    {
      text: "Bisikkan pada Sera: 'Kita awasi Vira bersama'",
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 8);
        s.flags.seraAlliance = true;
        s.keyChoices.push('sera_alliance');
      }
    },
    {
      text: "Angguk diam-diam dan susul yang lain",
      next: 'prologue_hike',
      effect: (s) => {
        s.flags.silentAcknowledge = true;
      }
    }
  ]
},

'prologue_sera_deny': {
  text: `<p>Sera menatapmu — dan kau melihat harapannya runtuh.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Ya. Mungkin. Kamu benar."</p>
<p>Dia melepaskan lenganmu dan berjalan lebih cepat, menjauh. Punggungnya kaku. Kau bisa merasakan dinding yang baru saja dia bangun di antara kalian.</p>
<p>Vira muncul di sampingmu, entah dari mana.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Sera kenapa? Dia terlihat sedih."</p>
<p>Suaranya hangat. Persis seperti Vira yang kau kenal. Tapi tangannya — tangannya terlalu dingin saat menyentuh bahumu.</p>
<p>"Jangan khawatir. Aku akan bicara padanya nanti. Aku pandai menenangkan orang, kan?"</p>
<p>Senyumnya. Ada terlalu banyak gigi.</p>`,
  choices: [
    {
      text: '"Ya, kau memang selalu begitu."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 8);
        Engine.modEntity(5);
        s.flags.viraCloser = true;
      }
    },
    {
      text: "Tersenyum canggung dan jalan lebih cepat",
      next: 'prologue_hike',
      effect: (s) => {
        s.flags.avoidedVira = true;
      }
    }
  ]
},

'prologue_sera_investigate': {
  text: `<p>Sera mengangguk pelan, matanya masih was-was.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Pertama, baunya. Kamu pernah cium bau Vira setelah dia kembali? Bukan parfumnya — tapi di bawah itu. Seperti... tanah setelah hujan. Tapi bukan tanah biasa. Tanah yang <em>sangat tua</em>. Tanah kuburan."</p>
<p>"Kedua, dia tidak pernah tidur. Aku pernah menginap tiga malam. Tidak sekali pun aku mendapatinya tidur. Dia selalu... <em>terjaga</em>."</p>
<p>"Ketiga..." Sera berhenti berjalan. "...aku menemukan ini di kamarnya."</p>
<p>Sera mengeluarkan secarik kertas kusut dari saku jaketnya. Di atasnya ada simbol — lingkaran dengan lima titik yang dihubungkan garis. Tulisan di bawahnya dalam bahasa yang tidak kau kenal.</p>
<p>"Aku tidak tahu apa artinya. Tapi itu bukan tulisan tangan Vira."</p>`,
  choices: [
    {
      text: "Simpan kertas itu — ini bisa jadi petunjuk penting",
      next: 'prologue_hike',
      effect: (s) => {
        s.items.push('symbol_paper');
        Engine.modAwareness('arin', 10);
        s.secretsFound++;
        s.flags.hasSymbolPaper = true;
        Engine.modTrust('arin', 'sera', 5);
      }
    },
    {
      text: "Kembalikan — terlalu berbahaya menyimpan ini",
      next: 'prologue_hike',
      effect: (s) => {
        s.flags.returnedPaper = true;
        Engine.modTrust('arin', 'sera', -3);
      }
    }
  ]
},

'prologue_niko': {
  text: `<p>Kau berjalan ke samping Niko yang sedang mengecek peta di ponselnya.</p>
<p>"Niko. Kenapa tiba-tiba? Cabin keluargamu — kau bilang sendiri tahun lalu tempat itu sudah ditinggalkan."</p>
<p><span class="speaker niko">Niko</span> tidak langsung menjawab. Jarinya berhenti menggeser layar.</p>
<p>"Kakekku meninggal bulan lalu."</p>
<p>Kau terdiam. Niko tidak pernah cerita soal kakeknya.</p>
<p>"Dia meninggalkan surat wasiat. Isinya aneh — dia bilang ada sesuatu di cabin yang harus 'dikembalikan'. Sesuatu yang dia ambil dari hutan puluhan tahun lalu." Niko memasukkan ponselnya. "Aku butuh saksi. Aku butuh teman. Dan aku butuh kalian <em>percaya</em> padaku kalau nanti ada hal-hal yang... tidak masuk akal."</p>
<p>Matanya tajam — bukan mata orang yang berduka. Mata orang yang <em>berburu</em>.</p>
<p>"Arin, aku mengandalkanmu. Kau satu-satunya yang tidak pernah menghakimiku."</p>`,
  choices: [
    {
      text: '"Apa yang kakekmu ambil dari hutan?"',
      hint: "Langsung ke inti.",
      next: 'prologue_niko_secret',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.askedNikoSecret = true;
      }
    },
    {
      text: '"Kenapa tidak cerita dari awal? Kita bisa bantu."',
      hint: "Tunjukkan dukungan tapi minta kejujuran.",
      next: 'prologue_niko_trust',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 10);
        s.flags.supportedNiko = true;
      }
    },
    {
      text: '"Yang lain tahu soal ini?"',
      hint: "Apakah Niko merahasiakan ini dari semua orang?",
      next: 'prologue_niko_others',
      effect: (s) => {
        s.flags.askedNikoOthers = true;
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'prologue_niko_secret': {
  text: `<p>Niko menghela napas panjang. Untuk pertama kalinya, kau melihat ketidakpastian di matanya.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Dalam suratnya, kakek bilang dia menemukan 'simpul' di dalam hutan. Bukan simpul biasa — simpul antara dunia kita dan... sesuatu yang lain. Dia mengambil artefak dari sana. Semacam batu dengan ukiran."</p>
<p>Niko menurunkan suaranya.</p>
<p>"Dan sejak dia mengambilnya, hal-hal mulai terjadi. Orang-orang di desanya menghilang. Hewan-hewan mati tanpa sebab. Hutan... berubah."</p>
<p>"Dia bilang batu itu harus dikembalikan. Dan itu harus dilakukan oleh lima orang. <em>Lima</em>."</p>
<p>Kau menghitung. Lima. Persis jumlah kalian.</p>
<p>"Arin, aku tahu ini kedengarannya gila. Tapi setelah Vira menghilang di Halimun tiga minggu dan kembali dengan... apapun itu... aku yakin ini semua terhubung."</p>`,
  choices: [
    {
      text: '"Kau mengajak kami sebagai alat, bukan sebagai teman."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -15);
        s.flags.confrontedNiko = true;
        s.moralScore += 10;
        Engine.modAwareness('arin', 10);
        s.keyChoices.push('confronted_niko');
      }
    },
    {
      text: '"Aku mengerti. Tapi kita harus jujur pada yang lain."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -5);
        s.flags.demandedHonesty = true;
        s.moralScore += 15;
        s.keyChoices.push('demanded_honesty');
      }
    },
    {
      text: '"Oke. Aku percaya padamu. Tapi kalau ada yang berbahaya, kita mundur."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 10);
        s.flags.trustedNiko = true;
        s.keyChoices.push('trusted_niko');
      }
    }
  ]
},

'prologue_niko_trust': {
  text: `<p>Niko menatapmu lama. Lalu, untuk sepersekian detik, topeng kepercayaan dirinya retak.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Karena..." dia menelan ludah. "...karena aku takut, Arin. Untuk pertama kalinya dalam hidupku, aku benar-benar takut."</p>
<p>"Kakekku — orang paling tangguh yang pernah aku kenal — menulis surat wasiatnya dengan tangan gemetar. Tulisannya hampir tidak bisa dibaca. Dan kalimat terakhirnya..."</p>
<p>Niko mengeluarkan amplop kusut dari saku dalam jaketnya. Kau bisa melihat tulisan tangan yang goyah:</p>
<p class="journal"><em>"Jangan biarkan hutan tahu namamu. Jangan biarkan simpul terbuka. Kembalikan apa yang aku curi, atau dia akan mengambil lima yang baru."</em></p>
<p>Lima yang baru. Kalian berlima.</p>
<p>"Aku tidak bisa lakukan ini sendirian, Arin."</p>`,
  choices: [
    {
      text: '"Kita lakukan bersama. Tapi tidak ada lagi rahasia."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 12);
        s.flags.nikoVulnerable = true;
        s.items.push('grandpa_letter');
        s.keyChoices.push('niko_bonded');
      }
    },
    {
      text: '"Kau sudah membahayakan kami semua, Niko."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -10);
        s.flags.blamedNiko = true;
        s.moralScore += 5;
        s.keyChoices.push('blamed_niko');
      }
    }
  ]
},

'prologue_niko_others': {
  text: `<p><span class="speaker niko">Niko</span> menggeleng pelan.</p>
<p>"Tidak. Sera terlalu sensitif — dia akan panik. Juno... Juno punya masalahnya sendiri yang belum dia ceritakan pada siapa pun. Dan Vira..."</p>
<p>Niko berhenti. Matanya menyipit ke arah Vira yang berdiri di tepi hutan, jari-jarinya menyentuh kulit pohon pinus.</p>
<p>"Vira adalah alasan lain aku mengajak kalian kemari."</p>
<p>"Arin, aku punya teori. Aku tahu kedengarannya gila, tapi — tempat Vira camping enam bulan lalu? Gunung Halimun? Itu bagian dari sistem hutan yang sama dengan hutan ini. Terhubung secara geografis <em>dan</em>..." dia merendahkan suara, "...secara lain."</p>
<p>"Aku pikir apapun yang kakekku ganggu puluhan tahun lalu... itulah yang membawa Vira kembali."</p>`,
  choices: [
    {
      text: '"Maksudmu... Vira yang kembali bukan Vira?"',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.nikoSuspicion = true;
        s.keyChoices.push('early_suspicion');
      }
    },
    {
      text: '"Niko, ini terlalu jauh. Vira baik-baik saja."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -5);
        Engine.modTrust('arin', 'vira', 5);
        s.flags.defendedVira = true;
      }
    }
  ]
},

'prologue_juno': {
  text: `<p>Juno sedang memasukkan botol air ke ranselnya ketika kau menghampiri. Candanya tadi — biasanya tajam dan nonstop — sudah berhenti begitu dia melihat hutan.</p>
<p>"Hei, Juno."</p>
<p><span class="speaker juno">Juno</span> melompat kecil, lalu tertawa.</p>
<p>"Sial, Arin! Jangan mengendap-endap begitu." Tawanya terlalu keras. Terlalu cepat.</p>
<p>"Kamu oke?"</p>
<p>Jeda panjang. Juno menatap hutan di depan mereka. Senyumnya perlahan menghilang seperti matahari tenggelam.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Arin... aku harus bilang sesuatu. Tentang Vira. Tentang Halimun."</p>
<p>Dia melirik ke arah Vira yang berdiri membelakangi mereka.</p>
<p>"Waktu Vira bilang dia pergi camping sendirian? Itu bohong." Juno menelan ludah. "Aku ikut. Aku ada di sana."</p>`,
  choices: [
    {
      text: '"Apa yang terjadi di Halimun, Juno?"',
      hint: "Kebenaran Juno bisa mengubah segalanya.",
      next: 'prologue_juno_truth',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 10);
        Engine.modAwareness('arin', 12);
        s.flags.junoConfessed = true;
      }
    },
    {
      text: '"Kenapa kau baru bilang sekarang?"',
      next: 'prologue_juno_why',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 5);
        s.flags.questionedJuno = true;
      }
    }
  ]
},

'prologue_juno_truth': {
  text: `<p>Juno duduk di bumper mobil. Tangannya gemetar.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Malam kedua di Halimun, kita dengar suara dari hutan. Bukan binatang — seperti... <em>nyanyian</em>. Tapi kata-katanya tidak masuk akal. Vira bilang dia mau cari sumbernya."</p>
<p>"Aku bilang jangan. Dia tetap pergi. Aku... aku mengikutinya."</p>
<p>Matanya berkaca-kaca.</p>
<p>"Dia berjalan ke sebuah pohon besar — pohon yang paling tua yang pernah aku lihat. Akarnya mencengkeram tanah seperti jari-jari. Dan di bawah akarnya... ada lubang. Lubang yang masuk ke dalam tanah."</p>
<p>"Vira berhenti di depan lubang itu. Lalu dia <em>menoleh padaku</em>. Dan Arin — aku bersumpah — matanya sudah bukan matanya lagi. Hitam total. Dari ujung ke ujung."</p>
<p>"Dia tersenyum. Dan dia bilang, 'Juno, jangan lari.' Tapi aku..."</p>
<p>Juno menunduk.</p>
<p>"Aku lari. Aku lari dan tidak pernah menoleh ke belakang. Dan tiga minggu kemudian, Vira kembali. Dengan senyum yang <em>sama persis</em>."</p>
<p>"Arin, yang kembali dari hutan itu... aku tidak yakin itu Vira."</p>`,
  choices: [
    {
      text: '"Kita harus bilang pada yang lain."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 8);
        s.moralScore += 10;
        s.flags.wantToTellOthers = true;
        s.keyChoices.push('juno_truth_shared');
      }
    },
    {
      text: '"Kau meninggalkan sahabatmu sendirian di hutan. Dan kau diam selama enam bulan."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', -10);
        s.flags.blamedJuno = true;
        s.moralScore -= 5;
        s.keyChoices.push('blamed_juno');
      }
    },
    {
      text: '"Aku mengerti kenapa kau lari. Sekarang kita hadapi ini bersama."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 15);
        s.flags.forgaveJuno = true;
        s.moralScore += 15;
        s.keyChoices.push('forgave_juno');
      }
    }
  ]
},

'prologue_juno_why': {
  text: `<p><span class="speaker juno">Juno</span> mengusap wajahnya kasar.</p>
<p>"Karena aku pengecut, Arin. Aku menyaksikan sesuatu terjadi pada Vira dan aku <em>lari</em>. Siapa yang mau mengakui itu?"</p>
<p>"Dan ketika dia kembali — terlihat normal, tersenyum normal — aku meyakinkan diriku sendiri bahwa aku hanya halusinasi. Bahwa aku panik dan membesar-besarkan segalanya."</p>
<p>"Tapi aku bermimpi setiap malam, Arin. Mimpi tentang pohon itu. Tentang lubang di bawah akarnya. Dan dalam mimpi itu..." suaranya serak, "...Vira selalu berdiri di lubang itu, menatapku, berkata: 'Kenapa kau meninggalkanku?'"</p>
<p>"Aku ikut ke hutan ini karena aku harus tahu. Aku harus tahu apakah yang kembali itu benar-benar Vira, atau..."</p>
<p>Dia tidak menyelesaikan kalimatnya. Tidak perlu.</p>`,
  choices: [
    {
      text: '"Apa yang kau lihat sebelum lari?"',
      next: 'prologue_juno_truth',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 5);
        s.flags.pressedJuno = true;
      }
    },
    {
      text: '"Tidak apa-apa, Juno. Kita cari tahu bersama."',
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 10);
        s.flags.comfortedJuno = true;
        s.moralScore += 5;
      }
    }
  ]
},

'prologue_vira': {
  text: `<p>Kau berjalan ke arah Vira. Dia masih berdiri di tepian hutan, jari-jarinya menyentuh kulit pohon pinus terdekat. Dari dekat, kau bisa melihat jari-jarinya bergerak — bukan mengelus, tapi <em>menelusuri</em>. Seolah membaca sesuatu yang terukir di kulit kayu.</p>
<p>"Vira?"</p>
<p><span class="speaker vira">Vira</span> menoleh. Senyumnya hangat. Terlalu hangat untuk seseorang yang berdiri di tepi hutan gelap.</p>
<p>"Arin! Kamu pernah perhatikan tidak — pohon pinus ini sudah berusia ratusan tahun. Mereka sudah di sini jauh sebelum kita. Jauh sebelum siapa pun."</p>
<p>Tangannya meraih tanganmu. Dingin. Seperti memegang batu yang sudah lama terendam air sungai.</p>
<p>"Aku senang kita semua ke sini. <em>Sangat</em> senang."</p>
<p>Ada tekanan aneh di kata 'sangat'. Seperti seseorang yang belajar menggunakan kata itu dari buku, bukan dari perasaan.</p>
<p>"Hutannya sudah lama menunggu. Menunggu <em>kita</em>."</p>`,
  shake: true,
  choices: [
    {
      text: '"Menunggu kita? Apa maksudmu?"',
      next: 'prologue_vira_deep',
      danger: true,
      effect: (s) => {
        Engine.modEntity(8);
        Engine.modAwareness('arin', 15);
        s.flags.questionedVira = true;
      }
    },
    {
      text: "Tarik tanganmu pelan-pelan dan tersenyum",
      next: 'prologue_hike',
      effect: (s) => {
        s.flags.retreatedFromVira = true;
        Engine.modAwareness('arin', 5);
      }
    },
    {
      text: '"Vira, kamu baik-baik saja? Sejak Halimun, kamu..."',
      next: 'prologue_vira_halimun',
      effect: (s) => {
        Engine.modEntity(5);
        s.flags.mentionedHalimun = true;
      }
    }
  ]
},

'prologue_vira_deep': {
  text: `<p>Vira memiringkan kepalanya. Gerakannya terlalu presisi — seperti burung yang mengamati mangsa.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Arin..." suaranya berubah. Lebih dalam. Lebih <em>tua</em>. "Kamu pernah merasakan kerinduan yang begitu dalam sampai tulangmu terasa nyeri? Itulah yang hutan ini rasakan."</p>
<p>"Lima ratus tahun lalu, lima orang datang ke hutan ini dan membuat janji. Mereka mengikat diri mereka satu sama lain dengan simpul yang lebih kuat dari darah. Tapi salah satu dari mereka mengkhianati yang lain. Mengambil sesuatu yang bukan miliknya."</p>
<p>"Sejak itu, hutan menunggu. Menunggu lima yang baru. Lima yang terikat."</p>
<p>Matanya — untuk sepersekian detik — berubah. Irisnya yang cokelat seolah ditelan kegelapan yang datang dari dalam.</p>
<p>Lalu kembali normal. Vira tertawa kecil.</p>
<p>"Maaf, aku kebanyakan baca legenda lokal! Jangan anggap serius."</p>
<p>Tapi kau sudah melihatnya. Dan kau tahu itu bukan lelucon.</p>`,
  glitch: true,
  choices: [
    {
      text: "Mundur perlahan. Jangan tunjukkan ketakutanmu.",
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.sawViraTrue = true;
        s.keyChoices.push('saw_entity_early');
      }
    },
    {
      text: '"Vira, aku tahu kamu bukan Vira."',
      next: 'prologue_vira_confront',
      danger: true,
      minDifficulty: 2,
      effect: (s) => {
        Engine.modEntity(15);
        Engine.modAwareness('arin', 25);
        s.flags.confrontedEntity = true;
        s.keyChoices.push('confronted_entity_early');
      }
    }
  ]
},

'prologue_vira_confront': {
  text: `<p>Kata-kata itu keluar sebelum kau bisa menahannya.</p>
<p>Keheningan. Hutan di sekelilingmu mendadak sunyi. Tidak ada angin. Tidak ada burung. Bahkan pinus berhenti bergoyang.</p>
<p><span class="speaker vira">Vira</span> menatapmu.</p>
<p>Senyumnya perlahan menghilang. Dan yang tersisa bukan kesedihan, bukan kemarahan — tapi <em>keingintahuan</em>. Keingintahuan yang dingin dan kuno.</p>
<p>"Menarik."</p>
<p>Suaranya bukan suara Vira lagi. Ini suara yang datang dari tempat yang lebih dalam dari tenggorokan — dari tanah, dari akar, dari inti hutan itu sendiri.</p>
<p>"Kau lebih tajam dari yang kukira, Arin."</p>
<p>Lalu — seperti saklar dibalik — Vira berkedip dan senyumnya kembali. Hangat. Polos. Sempurna.</p>
<p>"Ha? Kamu bilang apa tadi? Aku melamun! Ayo, yang lain sudah mulai jalan!"</p>
<p>Dia berjalan pergi, meninggalkanmu berdiri dengan jantung yang berdegup kencang dan kepastian yang mengerikan:</p>
<p class="narration">Kau baru saja memberi tahu sesuatu yang bukan manusia bahwa kau tahu rahasianya.</p>`,
  shake: true,
  blood: true,
  choices: [
    {
      text: "Susul yang lain. Jangan sendirian.",
      next: 'prologue_hike',
      effect: (s) => {
        s.courage.arin += 10;
        s.flags.entityKnowsYouKnow = true;
      }
    }
  ]
},

'prologue_vira_halimun': {
  text: `<p>Vira memiringkan kepalanya sedikit.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Halimun?" Dia tersenyum lembut. "Aku sudah cerita, kan? Aku tersesat tiga minggu. Makan buah-buahan liar. Minum air sungai. Cukup menakutkan, tapi aku baik-baik saja."</p>
<p>Jawaban yang sama. Kata per kata. Persis seperti yang dia ceritakan enam bulan lalu. Seperti rekaman yang diputar ulang.</p>
<p>"Kenapa tanya lagi, Arin? Kamu khawatir?"</p>
<p>Jarinya yang dingin menyentuh pipimu. Sentuhan yang terlalu familiar, terlalu intim untuk Vira yang kau kenal — Vira yang dulu tidak pernah suka kontak fisik.</p>
<p>"Jangan khawatir. Aku di sini. Aku <em>nyata</em>."</p>
<p>Kata terakhir itu terasa seperti kebohongan yang dibungkus kebenaran.</p>`,
  choices: [
    {
      text: "Tersenyum dan ikut berjalan. Simpan kecurigaanmu.",
      next: 'prologue_hike',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.viraScripted = true;
      }
    },
    {
      text: '"Yang asli tidak pernah menyentuh wajah orang."',
      next: 'prologue_vira_deep',
      danger: true,
      minDifficulty: 2,
      effect: (s) => {
        Engine.modEntity(10);
        Engine.modAwareness('arin', 15);
        s.flags.caughtViraSlip = true;
      }
    }
  ]
},

// ---- HIKING SECTION ----

'prologue_hike': {
  text: (s) => {
    let extra = '';
    if (s.flags.seraAlliance) extra = `<p>Sera berjalan di sampingmu. Kalian bertukar pandangan sesekali — bahasa rahasia baru yang hanya kalian pahami.</p>`;
    else if (s.flags.entityKnowsYouKnow) extra = `<p>Vira berjalan di belakangmu. Kau bisa merasakan tatapannya di tengkukmu seperti ujung pisau yang dingin.</p>`;
    else if (s.flags.junoConfessed) extra = `<p>Juno berjalan di sebelahmu, diam untuk pertama kalinya sejak kau mengenalnya. Beban di bahunya terlihat nyata.</p>`;

    return `<p>Kalian berlima memasuki hutan.</p>
<p>Jalan setapak menyempit setelah tiga puluh menit pertama. Pohon-pohon pinus semakin rapat, cabang-cabangnya saling mengait di atas kepala kalian seperti jari-jari yang bertaut. Cahaya matahari tersaring menjadi serpihan emas yang makin tipis.</p>
${extra}
<p><span class="speaker niko">Niko</span> memimpin di depan, langkahnya pasti. Dia hafal jalan ini.</p>
<p>Setengah jam kemudian, Sera berhenti.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Dengar itu?"</p>
<p>Kalian semua berhenti. Dan kau mendengarnya — samar, hampir tertutup desir angin. <em>Nyanyian.</em> Nada-nada yang naik dan turun tanpa melodi yang bisa kau kenali. Datang dari kedalaman hutan, dari arah yang tidak ada di peta manapun.</p>
<p><span class="speaker juno">Juno</span> memucat.</p>
<p><span class="speaker vira">Vira</span> tersenyum.</p>`;
  },
  choices: [
    {
      text: '"Kita terus jalan. Jangan berhenti."',
      hint: "Abaikan nyanyian. Fokus ke tujuan.",
      next: 'prologue_ignore_song',
      effect: (s) => {
        s.courage.arin += 5;
        s.flags.ignoredSong = true;
      }
    },
    {
      text: '"Dari mana suara itu?"',
      hint: "Investigasi. Bisa berbahaya.",
      next: 'prologue_follow_song',
      danger: true,
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.followedSong = true;
      }
    },
    {
      text: "Lihat reaksi Vira — dia tersenyum. Kenapa?",
      next: 'prologue_watch_vira',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.watchedViraReaction = true;
      }
    }
  ]
},

'prologue_ignore_song': {
  text: `<p>"Terus jalan," katamu tegas. "Apapun itu, kita tidak perlu mencari tahu."</p>
<p>Niko mengangguk. "Setuju. Cabin tinggal satu jam lagi."</p>
<p>Kalian melanjutkan perjalanan. Nyanyian itu perlahan memudar — atau mungkin memilih untuk berhenti. Hutan kembali normal. Burung berkicau. Angin bertiup.</p>
<p>Tapi Sera masih mencengkeram tali ranselnya terlalu erat. Dan Juno belum bicara satu kata pun sejak suara itu.</p>
<p>Satu jam kemudian, pepohonan menipis dan kalian melihatnya — cabin kayu dua lantai yang berdiri di tepi clearing. Cat coklatnya mengelupas, jendelanya berkabut, tapi strukturnya masih kokoh.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kita sampai."</p>
<p>Rumput di sekitar cabin terlalu hijau. Terlalu subur. Seolah sesuatu di bawah tanah memberi makan akarnya.</p>`,
  choices: [
    {
      text: "Masuk ke cabin",
      next: 'ch1_arrival',
      effect: (s) => { s.chapter = 1; }
    }
  ]
},

'prologue_follow_song': {
  text: `<p>Kau melangkah keluar jalan setapak, ke arah suara. Sera meraih tanganmu.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Arin, jangan—"</p>
<p>Tapi suara itu menarikmu. Bukan secara fisik — tapi ada sesuatu di nadanya yang berbicara langsung ke bagian otakmu yang paling tua, paling primitif.</p>
<p>Kau hanya berjalan dua puluh langkah dari jalan setapak ketika kau menemukannya.</p>
<p>Sebuah pohon. Tapi bukan pohon biasa. Batangnya terlalu lebar untuk dipeluk empat orang. Kulitnya berwarna hitam keabu-abuan, dan ukirannya — ya, ada <em>ukiran</em> di kulitnya. Simbol-simbol yang kau tidak kenal. Lima lingkaran yang saling terhubung.</p>
<p>Di bawah akarnya, tanah terlihat cekung. Seperti sesuatu di bawah sana bernapas, dan tanah naik-turun mengikutinya.</p>
<p><span class="speaker vira">Vira</span> sudah berdiri di sampingmu. Kapan dia sampai di sini?</p>
<p>"Cantik, kan?" bisiknya. "Ini jantungnya."</p>`,
  shake: true,
  choices: [
    {
      text: "Mundur ke jalan setapak. Sekarang.",
      next: 'prologue_ignore_song',
      effect: (s) => {
        s.courage.arin -= 5;
        Engine.modAwareness('arin', 10);
        s.flags.sawTheTree = true;
      }
    },
    {
      text: "Sentuh ukiran di pohon",
      next: 'prologue_touch_tree',
      danger: true,
      effect: (s) => {
        Engine.modEntity(15);
        Engine.modAwareness('arin', 20);
        s.flags.touchedTree = true;
        s.keyChoices.push('touched_tree');
      }
    }
  ]
},

'prologue_touch_tree': {
  text: `<p>Jarimu menyentuh kulit pohon.</p>
<p class="sound">— dunia berhenti —</p>
<p>Gelap. Kau tidak bisa melihat apa pun. Tidak ada hutan. Tidak ada teman-temanmu. Hanya kegelapan dan suara napas yang bukan milikmu.</p>
<p>Lalu kau melihatnya. Di kejauhan yang tidak mungkin — lima titik cahaya yang berdenyut seperti detak jantung. Lima warna berbeda. Lima kehidupan yang terhubung oleh benang-benang tipis yang berpendar.</p>
<p>Dan di tengahnya, sesuatu yang besar. Sesuatu yang tua. Sesuatu yang <em>lapar</em>.</p>
<p>Suara bisikan memenuhi kepalamu — ribuan suara yang berbicara bersamaan dalam bahasa yang bukan bahasa:</p>
<p class="journal"><em>"Lima datang. Lima terikat. Simpul baru. Simpul segar. Biarkan aku masuk. Biarkan aku merasakan."</em></p>
<p>Kau menarik tanganmu. Kembali ke hutan. Kembali ke cahaya.</p>
<p>Teman-temanmu menatapmu. Sera menangis. Juno pucat. Niko memegang bahumu.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Arin! Kamu tidak bergerak selama lima menit! Matamu — matamu <em>putih total</em>!"</p>
<p>Vira berdiri di belakang mereka semua. Tersenyum puas.</p>`,
  blood: true,
  shake: true,
  choices: [
    {
      text: '"Kita harus pergi dari sini. Sekarang."',
      next: 'prologue_escape_attempt',
      effect: (s) => {
        s.flags.wantedToLeave = true;
        s.moralScore += 5;
      }
    },
    {
      text: '"Aku melihat sesuatu. Lima cahaya. Dan sesuatu di tengahnya."',
      next: 'prologue_ignore_song',
      effect: (s) => {
        s.flags.sharedVision = true;
        Engine.modTrust('arin', 'sera', 5);
        Engine.modTrust('arin', 'niko', 5);
        Engine.modAwareness('arin', 5);
        s.keyChoices.push('shared_vision');
      }
    }
  ]
},

'prologue_escape_attempt': {
  text: `<p>"Kita harus pergi. Sekarang. Kembali ke mobil."</p>
<p><span class="speaker niko">Niko</span> menggeleng.</p>
<p>"Tidak bisa. Kunci mobil ada padaku, dan aku tidak akan kembali sebelum—"</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Niko! Arin baru saja pingsan dengan mata putih! Ini bukan waktu untuk—"</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Justru ini <em>persis</em> waktunya! Apa yang Arin lihat — lima cahaya? Itu kita! Lima simpul! Ini yang kakekku tulis di suratnya!"</p>
<p>Juno menarik lenganmu.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Arin, dengarkan aku. Kita sudah terlalu jauh masuk ke hutan untuk kembali sebelum gelap. Mau tidak mau, kita harus bermalam di cabin."</p>
<p>Dia benar. Matahari sudah condong ke barat. Bayangan pohon memanjang seperti jari-jari yang meraih.</p>
<p>Vira sudah berjalan duluan ke arah cabin. Seperti dia tahu persis di mana tempatnya.</p>`,
  choices: [
    {
      text: "Ikut ke cabin. Tidak ada pilihan lain.",
      next: 'ch1_arrival',
      effect: (s) => { s.chapter = 1; s.flags.forcedToCabin = true; }
    }
  ]
},

'prologue_watch_vira': {
  text: `<p>Kau tidak bergerak. Kau hanya mengamati Vira.</p>
<p>Saat nyanyian terdengar, wajah yang lain menunjukkan ketakutan atau kebingungan. Tapi Vira — Vira menutup matanya dan memiringkan kepala, seperti mendengarkan musik favoritnya.</p>
<p>Bibirnya bergerak. Tanpa suara. Tapi kau bisa membacanya — dia <em>ikut bernyanyi</em>.</p>
<p>Nyanyian itu berhenti. Vira membuka mata dan mendapatimu menatapnya.</p>
<p>Untuk sepersekian detik, ada sesuatu di matanya — bukan keterkejutan, bukan malu. Tapi <em>pengakuan diam</em>. Seolah berkata: <em>ya, kau melihatnya. Dan apa yang akan kau lakukan?</em></p>
<p>Lalu senyumnya kembali. Polos. Sempurna.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Kenapa lihat-lihat? Ada sesuatu di wajahku?"</p>
<p>Niko memutuskan untuk melanjutkan perjalanan. Satu jam kemudian, cabin muncul di balik pepohonan.</p>`,
  choices: [
    {
      text: '"Tidak ada." Lanjutkan ke cabin.',
      next: 'ch1_arrival',
      effect: (s) => {
        s.chapter = 1;
        Engine.modAwareness('arin', 15);
        s.flags.viraKnowsYouWatched = true;
        s.keyChoices.push('watched_vira_sing');
      }
    }
  ]
}

};
