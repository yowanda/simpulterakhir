/* ============================================================
   SIMPUL TERAKHIR — ENDINGS
   25 endings total — dapat trigger di chapter manapun.
   Rating: S (terbaik), A, B, C, D, F (terburuk)
   ============================================================ */

const STORY_ENDINGS = {

// ============================================================
// S-RANK ENDINGS (Best outcomes — justice + survival)
// ============================================================

'ending_masterpiece': {
  chapter: 7,
  isEnding: true,
  endingNumber: 1,
  title: 'Sang Penenun Terakhir',
  rating: 'S',
  endingText: (s) => {
    let text = `<p class="narration ending-s">ENDING #1: Sang Penenun Terakhir</p>`;
    text += `<p>Bukti tersebar ke seluruh dunia. Ragil Pramudya ditangkap — pria tua di kursi roda yang mengakui puluhan tahun kejahatan. "Dewan Penenun" teridentifikasi satu per satu: enam individu berkuasa yang dulu merasa tak tersentuh.</p>`;
    text += `<p>Investigasi berlangsung dua tahun. Tujuh negara terlibat. Interpol. FBI. Jaksa Agung.</p>`;
    text += `<p>Hasilnya: 47 kasus kematian terungkap. 23 terpidana. Dan siklus yang telah beroperasi selama setengah abad — berakhir.</p>`;
    text += `<p>Arin Prasetya tidak membuat podcast tentang malam itu. Dia menulis buku. Non-fiksi. 600 halaman. Best-seller internasional.</p>`;
    text += `<p>Judul: <em>Simpul Terakhir</em>.</p>`;

    text += `<p>Di acara peluncuran buku, Arin berdiri di podium. Sera duduk di barisan depan, mata tidak meninggalkan wajahnya. Mereka tidak pernah mengucapkan "aku cinta kamu" di mansion itu — situasi selalu terlalu genting untuk kata-kata. Tapi ketika Arin membaca bagian tentang Sera dalam buku — gambaran seorang wanita yang bisa membaca jiwa dalam kegelapan — Sera tersenyum. Dan Arin tahu. Mereka sudah mengikat simpul lain. Simpul yang tidak perlu kata-kata.</p>`;

    if (s.alive.niko && s.alive.vira) {
      text += `<p>Niko dan Vira tidak kembali bersama — terlalu banyak luka, terlalu banyak toxic history. Tapi di pengadilan, saat Niko memberikan kesaksian tentang keluarganya, Vira ada di galeri. Dan saat Vira memberikan kesaksian tentang penculikannya, Niko ada di sana. Mereka tidak berbicara. Tapi mereka hadir. Kadang, itu sudah cukup.</p>`;
    }
    if (s.alive.juno && s.alive.reza) {
      text += `<p>Juno memaksa Reza ke rehabilitasi. Reza memaksa Juno ke terapi. Dua orang yang saling menyelamatkan dari diri mereka sendiri. Setahun kemudian, Juno membuat mural di dinding studio Reza: sepuluh wajah di cahaya fajar. Dan di bawahnya, tulisan: "Mereka yang selamat bukan yang terkuat — tapi yang menemukan seseorang."</p>`;
    }

    let survivors = [];
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) survivors.push(Engine.CHAR_DISPLAY[c]); });

    text += `<p><strong>Yang Selamat:</strong> ${survivors.join(', ')}</p>`;
    text += `<p><em>"Simpul terakhir bukan kematian. Simpul terakhir adalah kebenaran yang mengikat segalanya — dan cinta yang membuat kau berani menatap kebenaran itu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Jurnalis. Penulis. Kekasih yang akhirnya menggenggam tangan Sera di bawah sinar matahari.',
    vira: 'Saksi kunci dalam pengadilan. Adiknya selamat. Perlahan belajar memaafkan — dirinya, dan Niko.',
    niko: 'Menjual mansion, mendanai yayasan korban. Dalang yang memilih menjadi manusia. Masih berusaha menebus.',
    sera: 'Menulis paper psikologi, tapi yang terpenting — belajar bahwa mencintai bukan berarti kehilangan objektivitas.',
    juno: 'Membuat instalasi seni tentang malam itu — pameran di seluruh dunia. Akhirnya berhenti lari dari masa lalu.',
    lana: 'Memberikan kesaksian. Novel terakhirnya: non-fiksi. Untuk pertama kalinya, menulis tentang rasa bersalah yang nyata.',
    reza: 'Kembali ke kepolisian sebagai konsultan cold case. Berhenti minum. Menghubungi putrinya lagi.',
    dimas: 'Dokter forensik yang membantu identifikasi korban. Merasakan empati untuk pertama kalinya — dan itu menyakitkan, tapi manusiawi.',
    kira: 'Membangun platform keamanan untuk melindungi whistleblower. Masih paranoid. Masih eksentrik. Masih brilliant.',
    farah: 'Menggunakan warisan keluarga untuk kompensasi korban. Ego pewaris akhirnya dikalahkan oleh nurani.'
  }
},

'ending_true_detective': {
  chapter: 7,
  isEnding: true,
  endingNumber: 2,
  title: 'Detektif Sejati',
  rating: 'S',
  endingText: (s) => {
    let text = `<p class="narration ending-s">ENDING #2: Detektif Sejati</p>`;
    text += `<p>Kau menemukan semua clue. Mengungkap semua operator. Melacak Dewan Penenun. Dan membawa Ragil hidup-hidup ke tangan hukum.</p>`;
    text += `<p>Proses pengadilan memakan waktu tiga tahun. Tapi hasilnya: keadilan. Bukan keadilan sempurna — karena yang mati tidak bisa kembali — tapi keadilan yang cukup untuk memberikan closure.</p>`;
    text += `<p>Arin menerima penghargaan jurnalisme investigasi tertinggi. Bukan untuk podcast — tapi untuk keberanian yang melampaui job description.</p>`;
    text += `<p>Di malam penghargaan, Sera ada di sampingnya. Bukan sebagai kolega. Bukan sebagai narasumber. Sebagai orang yang membuatnya pulang. "Kau tahu," bisik Sera saat tepuk tangan mereda, "aku sudah menganalisis hubungan kita dari setiap sudut psikologis." "Dan?" "Dan kesimpulannya: aku menyerah menganalisis. Aku hanya ingin di sini." Arin mencium keningnya — gesture kecil yang mengatakan lebih banyak dari 600 halaman buku.</p>`;
    text += `<p><em>"Simpul terakhir adalah simpul yang kau ikat sendiri — dengan keberanian yang tidak kau tahu kau punya, dan cinta yang tidak kau izinkan sampai terlambat."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Pemenang Pulitzer untuk jurnalisme investigasi. Belajar bahwa keberanian terbesar adalah membiarkan diri dicintai.'
  }
},

// ============================================================
// A-RANK ENDINGS (Good outcomes — mostly justice)
// ============================================================

'ending_good': {
  chapter: 7,
  isEnding: true,
  endingNumber: 3,
  title: 'Fajar yang Cukup',
  rating: 'A',
  endingText: (s) => {
    let text = `<p class="narration ending-a">ENDING #3: Fajar yang Cukup</p>`;
    text += `<p>Mansion di belakang. Fajar di depan. Bukti cukup untuk memulai investigasi — tapi tidak cukup untuk menghancurkan seluruh jaringan.</p>`;
    text += `<p>Ragil meninggal dua bulan kemudian — kanker yang sudah terlalu lama ditunda. Dewan Penenun teridentifikasi sebagian. Tiga dari enam diadili. Sisanya — menghilang. Memindahkan operasi ke tempat lain. Negara lain. Mansion lain.</p>`;
    text += `<p>Tapi siklus ini — siklus Wardhana — berakhir. Dan itu sudah cukup. Harus cukup.</p>`;
    text += `<p>Arin melanjutkan podcast-nya. Episode tentang malam itu menjadi yang paling banyak didengarkan. Tapi kali ini — orang percaya.</p>`;
    text += `<p>Sera mendengarkan episode itu dari apartemennya. Menangis. Menelepon Arin pukul tiga pagi. Tidak bicara apa-apa selama dua menit pertama. Lalu: "Kopi besok pagi?" "Ya." "Dan setelah itu?" "Aku tidak tahu. Tapi aku ingin mencari tahu." Cukup. Untuk sekarang, cukup.</p>`;
    text += `<p><em>"Tidak semua simpul bisa diurai. Tapi kau bisa memilih siapa yang menggenggam ujung benang bersamamu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Jurnalis yang dihormati. Masih menggali kebenaran. Belajar bahwa "cukup" juga bentuk keberanian.'
  }
},

'ending_sacrifice_hero': {
  chapter: 7,
  isEnding: true,
  endingNumber: 4,
  title: 'Pengorbanan',
  rating: 'A',
  endingText: (s) => {
    let text = `<p class="narration ending-a">ENDING #4: Pengorbanan</p>`;
    text += `<p>Kau turun ke B-3 terakhir kali untuk memastikan bukti terkirim. Api sudah di B-1. Asap di mana-mana.</p>`;
    text += `<p>Upload selesai. 100%. Ke dunia.</p>`;
    text += `<p>Tapi tangga kembali sudah tertutup puing. Ventilasi menyemburkan asap. Kau terjebak.</p>`;
    text += `<p>Di monitor terakhir yang masih menyala, kau melihat teman-temanmu di luar. Selamat. Berlari menjauh dari api.</p>`;
    text += `<p>Sera berhenti. Berbalik. Berteriak namamu — suara yang tidak pernah kau dengar darinya: bukan analitis, bukan profesional, tapi mentah, hancur, dan penuh cinta yang tidak pernah sempat diucapkan. Juno menahan Sera. Sera melawan. Juno tidak melepaskan.</p>`;
    text += `<p>Kau duduk di kursi roda Ragil. Ironi akhir. Jurnalis yang selalu mencari kebenaran — akhirnya menjadi bagian dari cerita.</p>`;
    text += `<p>Podcast terakhirmu merekam sendiri: suara napas yang semakin tipis, asap yang semakin pekat, dan kata-kata terakhir:</p>`;
    text += `<p><em>"Sera... maaf aku tidak sempat bilang. Tapi kau sudah tahu, kan? Kau selalu bisa membaca orang. Baca aku sekarang. Baca bahwa aku—"</em></p>`;
    text += `<p>Rekaman berhenti.</p>`;
    text += `<p>Tiga bulan kemudian, Sera menerbitkan buku. Bukan paper psikologi. Buku tentang kehilangan. Tentang cinta yang datang di malam yang salah. Tentang jari-jari yang bertemu di bawah meja tapi tidak pernah sempat menggenggam di bawah matahari. Dedikasi: <em>"Untuk A. Yang simpulnya menjadi milikku selamanya."</em></p>`;
    text += `<p><em>"Simpul terakhir... adalah aku. Dan simpul yang paling menyakitkan... adalah yang tidak pernah diikat."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Meninggal sebagai pahlawan. Bukti terkirim. Cinta tidak terucapkan. Tapi Sera tahu.'
  }
},

'ending_survivor_testimony': {
  chapter: 6,
  isEnding: true,
  endingNumber: 5,
  title: 'Kesaksian Terakhir',
  rating: 'A',
  endingText: (s) => {
    return `<p class="narration ending-a">ENDING #5: Kesaksian Terakhir</p>
<p>Vira membawa kalian ke pintu darurat yang hanya dia ketahui — warisan dari malam pertamanya di mansion enam bulan lalu.</p>
<p>Kalian keluar. Ke hutan. Ke fajar. Ke dunia yang belum tahu apa yang terjadi di dalam.</p>
<p>Bersama-sama, kalian memberikan kesaksian kepada media, polisi, dan komisi HAM. Bukan satu suara yang bisa diabaikan — tapi paduan suara yang tidak bisa dibungkam.</p>
<p><em>"Simpul yang paling kuat adalah simpul yang diikat oleh banyak tangan."</em></p>`;
  },
  fates: {
    arin: 'Saksi utama. Suaranya menggema.'
  }
},

// ============================================================
// B-RANK ENDINGS (Bittersweet — survival with cost)
// ============================================================

'ending_bittersweet': {
  chapter: 7,
  isEnding: true,
  endingNumber: 6,
  title: 'Abu dan Fajar',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="narration ending-b">ENDING #6: Abu dan Fajar</p>`;
    text += `<p>Mansion terbakar. Bukti terbakar. Ragil terbakar. Dan bersamanya — kemungkinan keadilan yang sempurna.</p>`;
    text += `<p>Kalian selamat. Tapi tanpa bukti fisik, kasus ini menjadi "cerita" — bukan fakta.</p>`;
    text += `<p>Arin mempublikasikan podcast tentang malam itu. Viral. Kontroversial. Separuh dunia percaya, separuh menganggapnya fiksi.</p>`;
    text += `<p>Tapi cukup banyak yang percaya untuk memulai investigasi independen. Cukup banyak mata yang terbuka. Cukup banyak simpul yang terurai — pelan, tapi pasti.</p>`;
    text += `<p><em>"Kadang kebenaran tidak datang sebagai kilat — tapi sebagai fajar. Pelan. Sabar. Tak terbendung."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Podcaster kontroversial. Dihormati dan dibenci sekaligus.'
  }
},

'ending_broken_victory': {
  chapter: 7,
  isEnding: true,
  endingNumber: 7,
  title: 'Kemenangan yang Pecah',
  rating: 'B',
  endingText: (s) => {
    return `<p class="narration ending-b">ENDING #7: Kemenangan yang Pecah</p>
<p>Kau menang. Ragil diadili. Bukti tersebar. Siklus berakhir.</p>
<p>Tapi kemenangan ini berasa seperti kaca pecah di mulut. Setiap fragmen mengiris.</p>
<p>PTSD. Insomnia. Hubungan yang hancur. Teman-teman yang mati masih muncul di mimpi — bukan sebagai hantu, tapi sebagai pengingat bahwa kau selamat dan mereka tidak.</p>
<p>Terapi membantu. Pelan. Tahun demi tahun.</p>
<p>Sepuluh tahun kemudian, Arin berdiri di depan reruntuhan mansion Wardhana yang sudah ditumbuhi tanaman liar. Monumen kecil untuk korban berdiri di antara puing.</p>
<p>Dia tidak menangis. Sudah tidak bisa. Tapi dia menaruh bunga — dan pergi.</p>
<p><em>"Kemenangan terbesar bukan mengalahkan monster. Tapi tetap manusia setelahnya."</em></p>`;
  },
  fates: {
    arin: 'Survivor. Masih berjuang. Masih manusia.'
  }
},

'ending_lana_redemption': {
  chapter: 6,
  isEnding: true,
  endingNumber: 8,
  title: 'Penebusan Penulis',
  rating: 'B',
  endingText: (s) => {
    return `<p class="narration ending-b">ENDING #8: Penebusan Penulis</p>
<p>Lana Kusuma — operator, penulis skenario, anti-heroine — memilih redemption arc yang tidak pernah dia tulis untuk dirinya sendiri.</p>
<p>Dia menghadapi Ragil sendirian. Mengalihkan perhatiannya sementara yang lain kabur. Dan saat mansion terbakar — Lana tidak keluar.</p>
<p>Novel terakhirnya ditemukan di tas yang ditinggalkan di luar. Bukan tentang pembunuhan. Tentang kakaknya. Tentang trauma. Tentang sistem yang menghancurkan manusia biasa.</p>
<p>Best-seller posthumous. Proceeds ke yayasan kesehatan mental.</p>
<p><em>"Ending terbaik untuk seorang penulis adalah menulis ending yang lebih baik dari kenyataan."</em></p>`;
  },
  fates: {
    lana: 'Meninggal dengan purpose. Novelnya hidup.'
  }
},

'ending_vira_closure': {
  chapter: 5,
  isEnding: true,
  endingNumber: 9,
  title: 'Lingkaran Vira',
  rating: 'B',
  endingText: (s) => {
    return `<p class="narration ending-b">ENDING #9: Lingkaran Vira</p>
<p>Vira membawamu ke pintu yang hanya dia tahu. Keluar dari mansion. Ke tempat aman.</p>
<p>Tapi sebelum keluar, dia berhenti. "Aku harus kembali."</p>
<p>"Kenapa?"</p>
<p>"Karena terakhir kali aku keluar dan meninggalkan orang di dalam. Dan aku tidak bisa hidup dengan itu lagi."</p>
<p>Vira kembali. Membawa keluar tiga orang lagi sebelum pintu terkunci permanen.</p>
<p>Lingkaran tertutup. Saksi Selamat yang kembali — bukan sebagai korban, tapi sebagai penyelamat.</p>
<p><em>"Simpul yang paling kuat adalah yang diikat oleh orang yang pernah terputus."</em></p>`;
  },
  fates: {
    vira: 'Tidak lagi Saksi Selamat — tapi Penyelamat.'
  }
},

// ============================================================
// C-RANK ENDINGS (Mixed — survival but system continues)
// ============================================================

'ending_pyrrhic': {
  chapter: 7,
  isEnding: true,
  endingNumber: 10,
  title: 'Kemenangan Pyrrhic',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #10: Kemenangan Pyrrhic</p>
<p>Kau selamat. Beberapa temanmu selamat. Ragil mati — kanker atau api, tidak jelas mana yang lebih dulu.</p>
<p>Tapi Dewan Penenun tidak pernah teridentifikasi. Bukti tidak cukup. Dan setahun kemudian — undangan hitam muncul lagi. Di kota berbeda. Mansion berbeda.</p>
<p>Siklus berlanjut. Dengan nama baru. Dengan wajah baru. Tapi mesin yang sama.</p>
<p>Arin tahu. Dan tidak bisa berbuat apa-apa.</p>
<p><em>"Kadang simpul terakhir bukan ending — tapi koma. Jeda sebelum kalimat berikutnya."</em></p>`;
  },
  fates: {
    arin: 'Hidup. Tapi siklus berlanjut tanpa dia.'
  }
},

'ending_deal_with_devil': {
  chapter: 6,
  isEnding: true,
  endingNumber: 11,
  title: 'Perjanjian dengan Iblis',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #11: Perjanjian dengan Iblis</p>
<p>Ragil menawarkan deal: lepaskan dia, dan dia membuka semua pintu. Semua orang selamat. Tidak ada kematian lagi.</p>
<p>Kau menerima.</p>
<p>Semua keluar. Semua hidup. Ragil menghilang — bersama systemnya, bersama buktinya, bersama segalanya.</p>
<p>Sebulan kemudian, Ragil mati karena kanker. Tapi sebelum mati — dia mewariskan sistem kepada... seseorang. Dan siklus berlanjut.</p>
<p>Kau menyelamatkan nyawa malam itu. Tapi mengorbankan keadilan untuk tahun-tahun mendatang.</p>
<p><em>"Simpul yang kau ikat dengan iblis tidak pernah benar-benar terurai."</em></p>`;
  },
  fates: {
    arin: 'Hidup. Semua hidup. Tapi dengan harga yang tidak terlihat.'
  }
},

'ending_split_group': {
  chapter: 4,
  isEnding: true,
  endingNumber: 12,
  title: 'Perpecahan Fatal',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #12: Perpecahan Fatal</p>
<p>Kelompok terpecah dan tidak pernah bersatu kembali. Sebagian berhasil keluar melalui jendela. Sebagian terjebak sampai fajar.</p>
<p>Yang keluar lebih dulu menghubungi polisi — tapi saat polisi tiba, mansion sudah bersih. Sistem self-destruct yang disiapkan Ragil menghapus semua bukti.</p>
<p>Tidak ada yang diadili. Tidak ada yang dipercaya. Tapi setidaknya — kebanyakan selamat.</p>
<p><em>"Kadang perpecahan bukan kekalahan — tapi survival strategy yang jujur."</em></p>`;
  },
  fates: {
    arin: 'Selamat. Frustrasi. Melanjutkan.'
  }
},

'ending_niko_truth': {
  chapter: 5,
  isEnding: true,
  endingNumber: 13,
  title: 'Warisan Wardhana',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #13: Warisan Wardhana</p>
<p>Niko membawamu ke exit yang hanya pewaris Wardhana yang tahu. Lorong rahasia di balik perpustakaan — dibangun 50 tahun lalu sebagai escape route.</p>
<p>"Kakekku membangun jalan keluar," bisik Niko. "Mungkin — mungkin di akhir, dia juga ingin lari."</p>
<p>Kalian keluar. Niko menyerahkan diri ke polisi sebagai saksi dan tersangka sekaligus — pewaris yang memberikan akses, tapi juga yang mencoba menghentikan.</p>
<p>Pengadilan membebaskannya — insufficient evidence. Tapi Niko hidup dengan beban itu selamanya.</p>
<p><em>"Warisan bukan hanya harta. Warisan adalah beban yang kau pilih untuk menanggung."</em></p>`;
  },
  fates: {
    niko: 'Bebas oleh hukum. Terpenjara oleh nurani.'
  }
},

// ============================================================
// D-RANK ENDINGS (Bad — mostly failure)
// ============================================================

'ending_everyone_suspects': {
  chapter: 3,
  isEnding: true,
  endingNumber: 14,
  title: 'Paranoia Menang',
  rating: 'D',
  endingText: (s) => {
    return `<p class="narration ending-d">ENDING #14: Paranoia Menang</p>
<p>Kepercayaan hancur total. Semua orang mencurigai semua orang. Kelompok pecah menjadi individu-individu yang mengunci diri di kamar masing-masing.</p>
<p>Egoisme menang. Farah mengunci diri di wine cellar dengan persediaan makanan. Niko menutup diri di ruang kerjanya, dalang yang akhirnya terjebak dalam permainannya sendiri. Kira menghancurkan laptopnya sendiri — paranoia mengalahkan logika.</p>
<p>Sang Penenun tidak perlu membunuh siapapun — paranoia melakukannya. Satu per satu, mereka jatuh: kecelakaan di kegelapan, kepanikan, keputusan buruk saat sendirian.</p>
<p>Sera mengetuk pintumu pukul empat pagi. "Arin, buka pintunya. Please." Kau berdiri di balik pintu. Tanganmu di handle. Tapi kau tidak membuka. Karena bagaimana kalau yang di luar bukan Sera? Bagaimana kalau ini jebakan?</p>
<p>Suara Sera pecah. "Arin... aku tidak mau sendirian." Dan kau mendengar langkahnya menjauh. Dan kau tahu — dengan kepastian yang menghancurkan — bahwa kau baru saja kehilangan sesuatu yang lebih penting dari keselamatan.</p>
<p>Fajar datang. Tiga orang selamat. Semua trauma. Tidak ada yang bicara satu sama lain lagi. Kau dan Sera berpapasan di luar mansion. Mata bertemu mata. Tapi jarak yang ada sekarang — jarak yang kau ciptakan saat tidak membuka pintu — tidak akan pernah bisa ditutup.</p>
<p><em>"Simpul terakhir adalah kepercayaan. Dan begitu terputus — cinta pun tidak cukup kuat untuk mengikatnya kembali."</em></p>`;
  },
  fates: {
    arin: 'Selamat secara fisik. Rusak secara psikologis.'
  }
},

'ending_wrong_accusation': {
  chapter: 4,
  isEnding: true,
  endingNumber: 15,
  title: 'Tuduhan Salah',
  rating: 'D',
  endingText: (s) => {
    return `<p class="narration ending-d">ENDING #15: Tuduhan Salah</p>
<p>Kau menuduh orang yang salah. Kelompok mengunci Sera — psikolog yang sebenarnya adalah sekutu terbesarmu — dan membiarkan operator sebenarnya bergerak bebas.</p>
<p>Hasilnya: dua kematian lagi sebelum fajar. Dan saat kebenaran terungkap — sudah terlalu terlambat.</p>
<p>Sera dibebaskan. Tapi dia tidak bisa menatapmu. Psikolog yang mencintaimu dalam diam — dikunci oleh orang yang dia percaya paling memahaminya.</p>
<p>"Kau yang seharusnya paling pintar di ruangan ini," bisiknya. Air matanya jatuh — pertama kalinya malam ini. "Dan kau memilih mudah daripada benar. Kau memilih ketakutan daripada kepercayaan. Kau memilih—" Suaranya pecah. "—kau memilih ego daripada aku."</p>
<p>Tangan Sera yang dulu mencari tanganmu di bawah meja — sekarang dikepalkan di sisi tubuhnya. Genggaman yang tidak akan pernah terulang.</p>
<p><em>"Simpul yang diikat dengan terburu-buru selalu mengikat orang yang salah. Dan mematahkan hati yang tepat."</em></p>`;
  },
  fates: {
    arin: 'Hidup. Tapi dengan beban tuduhan yang tidak bisa ditarik kembali — dan cinta yang dia hancurkan sendiri.'
  }
},

'ending_penenun_wins': {
  chapter: 6,
  isEnding: true,
  endingNumber: 16,
  title: 'Sang Penenun Menang',
  rating: 'D',
  endingText: (s) => {
    return `<p class="narration ending-d">ENDING #16: Sang Penenun Menang</p>
<p>Tiga simpul terputus. Tepat seperti yang dijanjikan. Mansion kembali normal saat fajar — pintu terbuka, lampu menyala, seolah tidak pernah terjadi apa-apa.</p>
<p>Yang tersisa keluar seperti zombie. Trauma yang terlalu segar untuk ditangisi.</p>
<p>Polisi datang. Tidak menemukan apa-apa. "Kecelakaan selama acara privat." Kasus ditutup.</p>
<p>Sang Penenun mengirim email terakhir: <em>"Terima kasih atas partisipasinya. Sampai siklus berikutnya."</em></p>
<p><em>"Kadang monster menang. Dan satu-satunya hal yang bisa kau lakukan adalah mengingat — dan menolak untuk melupakan."</em></p>`;
  },
  fates: {
    arin: 'Saksi Selamat. Tepat seperti yang direncanakan Penenun.'
  }
},

// Already defined in ch4: ending_coward_escape (D-rank, #20)
// Already defined in ch5: ending_incomplete_escape (C-rank, #19)

'ending_dimas_betrayal': {
  chapter: 4,
  isEnding: true,
  endingNumber: 17,
  title: 'Pengkhianatan Dokter',
  rating: 'D',
  endingText: (s) => {
    return `<p class="narration ending-d">ENDING #17: Pengkhianatan Dokter</p>
<p>Kau mempercayai Dimas. Membiarkannya merawat yang terluka. Memberinya akses ke supplies medis.</p>
<p>Kesalahan fatal.</p>
<p>Dimas menggunakan akses itu untuk memastikan "treatment" yang diberikan... tidak bekerja. Obat tidur sebagai pengganti obat nyeri. Dosage yang sedikit terlalu tinggi. Profesional sampai akhir.</p>
<p>Kau menyadari terlalu terlambat. Dimas sudah pergi — menghilang ke malam, tugas selesai.</p>
<p><em>"Simpul yang paling berbahaya adalah yang diikat oleh tangan yang kau percaya."</em></p>`;
  },
  fates: {
    arin: 'Hidup — tapi tidak percaya pada siapapun lagi.'
  }
},

// ============================================================
// F-RANK ENDINGS (Worst outcomes)
// ============================================================

'ending_total_failure': {
  chapter: 7,
  isEnding: true,
  endingNumber: 18,
  title: 'Simpul Terputus Total',
  rating: 'F',
  endingText: (s) => {
    return `<p class="narration ending-f">ENDING #18: Simpul Terputus Total</p>
<p>Semua simpul terputus. Setiap orang yang seharusnya kau lindungi — hilang. Satu per satu. Seperti lilin yang ditiup oleh angin yang sama.</p>
<p>Arin selamat. Sendirian. Seperti yang direncanakan.</p>
<p>Saksi Selamat yang sempurna: cukup pintar untuk menggali, cukup naif untuk gagal, cukup rusak untuk tidak dipercaya.</p>
<p>Sera ada di antara yang hilang. Tangan yang pernah mencari tanganmu di bawah meja — tangan yang kau genggam terlalu sedikit, terlalu terlambat. Sekarang tidak ada lagi yang menggenggam. Tidak ada lagi "aku di sini." Hanya kekosongan di tempat yang seharusnya ada kehangatan.</p>
<p>Podcast episode #47: "Malam di Mansion Wardhana." Download tertinggi. Rating tertinggi. Dan di menit ke-42, kau menangis. On air. Untuk pertama kalinya. Bukan untuk korban — tapi untuk satu nama yang kau sebut tanpa sadar: "Sera."</p>
<p>Tidak ada satu pun yang mengarah pada keadilan. Siklus berlanjut. Dan Arin — Saksi Selamat — menjadi bagian dari cerita yang dia gagal hentikan. Egoismenya, kecerobohannya, obsesinya pada kebenaran yang membuatnya buta terhadap orang-orang yang mencintainya — semua itu memiliki harga. Dan harganya adalah sepi.</p>
<p><em>"Simpul terakhir bukan kematian — tapi hidup sendirian dengan ingatan semua orang yang pernah mengulurkan tangan, dan kau terlalu sibuk mengejar kebenaran untuk menggenggamnya."</em></p>`;
  },
  fates: {
    arin: 'Saksi Selamat. Monster jenis baru: yang tahu dan tidak bertindak cukup.'
  }
},

'ending_arin_death_hero': {
  chapter: 5,
  isEnding: true,
  endingNumber: 21,
  title: 'Pahlawan yang Jatuh',
  rating: 'B',
  endingText: (s) => {
    return `<p class="narration ending-b">ENDING #21: Pahlawan yang Jatuh</p>
<p>Arin turun ke B-3 sendirian. Menemukan Ragil. Memaksanya membuka semua kunci.</p>
<p>Tapi Ragil punya satu trik terakhir — dead man's switch. Kalau jantungnya berhenti, gas dari ventilasi mengisi seluruh basement.</p>
<p>Ragil mati — usianya yang memang sudah habis. Dan gas mengisi B-3.</p>
<p>Arin tidak sempat naik. Tapi semua pintu sudah terbuka. Yang lain — selamat.</p>
<p>Di atas, Sera menjerit. Jerit yang merobek malam — bukan analitis, bukan terkontrol, tapi kehilangan yang mentah dan total. Juno memeluknya. Reza berdiri di belakang mereka, rahangnya bergetar tapi matanya kering — negosiator yang tahu bahwa beberapa hal tidak bisa dinegosiasikan dengan kematian.</p>
<p>Podcast Arin ditemukan oleh Kira di cloud. Episode terakhir — direkam di ponselnya saat gas mengisi ruangan. Enam menit monolog yang menjadi viral. Di menit terakhir, suaranya berbisik: "Sera, kalau kau dengar ini... aku mau bilang sesuatu yang harusnya aku bilang di sofa itu, saat tanganmu menyentuh tanganku dan aku... aku terlalu pengecut untuk menggenggam."</p>
<p>Sera mendengarkan rekaman itu sekali. Lalu dia tidak pernah mendengarkannya lagi. Tapi dia menggenggam ponselnya setiap malam selama setahun — menggantikan tangan yang tidak pernah sempat dia genggam.</p>
<p><em>"Ini Arin Prasetya. Dan ini... cerita terakhirku. Cerita tentang orang yang selalu mencari kebenaran di luar sana — dan tidak pernah cukup berani mengakui kebenaran yang ada di sebelahnya."</em></p>`;
  },
  fates: {
    arin: 'Meninggal. Tapi ceritanya hidup selamanya.'
  }
},

'ending_cycle_continues': {
  chapter: 3,
  isEnding: true,
  endingNumber: 22,
  title: 'Siklus Berlanjut',
  rating: 'D',
  endingText: (s) => {
    return `<p class="narration ending-d">ENDING #22: Siklus Berlanjut</p>
<p>Kau memilih kabur di chapter awal. Berlari ke hutan. Menemukan jalan keluar melalui pagar yang belum sepenuhnya terpasang.</p>
<p>Polisi datang. Mansion sudah bersih saat mereka sampai.</p>
<p>Satu tahun kemudian, kau menerima amplop hitam. Lagi. Undangan yang sama. Mansion yang berbeda.</p>
<p>Dan kali ini — ada nama baru di undangan: nama seseorang yang kau cintai.</p>
<p><em>"Simpul yang tidak diputuskan... mengikat generasi berikutnya."</em></p>`;
  },
  fates: {
    arin: 'Selamat. Tapi terjebak dalam siklus yang tidak pernah dia hentikan.'
  }
},

'ending_lana_double': {
  chapter: 5,
  isEnding: true,
  endingNumber: 23,
  title: 'Plot Twist Penulis',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #23: Plot Twist Penulis</p>
<p>Lana — yang mengaku bermain ganda — ternyata bermain triple. Dia bukan hanya operator yang bermain ganda, tapi calon PEWARIS Sang Penenun yang bermain jadi double agent.</p>
<p>Cerita tentang kakaknya? Nyata. Tapi motivasinya bukan balas dendam — tapi mengambil alih. Menjadi Penenun baru. Yang lebih muda, lebih pintar, lebih tak tersentuh.</p>
<p>Kau menyadari ini saat sudah di luar mansion. Saat Lana menghilang bersama semua bukti digital. Dan siklus — bukannya berakhir — justru ter-upgrade.</p>
<p><em>"Plot twist terbaik adalah yang membuat pembaca memeriksa ulang setiap halaman — dan menyadari petunjuknya selalu ada."</em></p>`;
  },
  fates: {
    lana: 'Sang Penenun baru. Chapter berikutnya dimulai.'
  }
},

'ending_sera_profile': {
  chapter: 4,
  isEnding: true,
  endingNumber: 24,
  title: 'Profiler dan Subjek',
  rating: 'C',
  endingText: (s) => {
    return `<p class="narration ending-c">ENDING #24: Profiler dan Subjek</p>
<p>Sera berhasil memprofilkan Sang Penenun dengan akurasi yang menakutkan. Tapi profil itu sendiri menjadi senjata — Ragil menggunakan prediksi Sera untuk selalu selangkah di depan.</p>
<p>"Kau terlalu transparan, psikolog," kata Ragil melalui speaker. "Kau memberitahu satu sama lain kelemahanku — dan kelemahan kalian sendiri."</p>
<p>Kelompok keluar dengan selamat — tapi Ragil sudah menghapus semua bukti berdasarkan prediksi Sera tentang langkah mereka berikutnya.</p>
<p><em>"Memahami monster bukan berarti bisa mengalahkannya. Kadang, pemahaman itu sendiri yang menjadi senjatanya."</em></p>`;
  },
  fates: {
    sera: 'Berhenti dari psikologi. Menulis novel fiksi.'
  }
},

'ending_silent_majority': {
  chapter: 7,
  isEnding: true,
  endingNumber: 25,
  title: 'Mayoritas yang Diam',
  rating: 'F',
  endingText: (s) => {
    return `<p class="narration ending-f">ENDING #25: Mayoritas yang Diam</p>
<p>Semua selamat. Secara fisik.</p>
<p>Tapi tidak ada yang bicara. Tidak ada yang melapor. Tidak ada yang bersaksi. Egoisme menang atas keberanian. Ketakutan menang atas keadilan.</p>
<p>Masing-masing pulang. Masing-masing diam. Masing-masing memilih untuk melupakan — atau berpura-pura lupa.</p>
<p>Arin dan Sera tidak pernah bicara lagi. Bukan karena marah. Tapi karena setiap kali mereka melihat satu sama lain, mereka teringat malam itu — tangan yang bersentuhan di bawah meja, bisikan "aku di sini," dan pilihan untuk diam yang membuat semua itu tidak berarti.</p>
<p>Niko dan Vira — toxic love yang seharusnya berakhir malam itu — justru kembali bersama. Dua orang yang terikat oleh rahasia dan rasa bersalah, bukan cinta. Hubungan mereka lebih beracun dari sebelumnya.</p>
<p>Juno dan Reza kehilangan kontak. Koneksi yang baru tumbuh di malam itu — layu karena diam. Reza kembali minum. Juno kembali marah pada dunia.</p>
<p>Sang Penenun menang — bukan dengan kekerasan, tapi dengan keheningan. Dan keheningan itu meracuni setiap hubungan, setiap koneksi, setiap kemungkinan cinta yang tumbuh malam itu.</p>
<p>Tahun depan, sepuluh amplop hitam dikirim ke sepuluh alamat baru.</p>
<p><em>"Simpul terakhir tidak pernah terputus. Karena tidak ada yang mencoba. Dan cinta yang lahir di malam yang salah — mati dalam keheningan yang dipilih."</em></p>`;
  },
  fates: {
    arin: 'Diam. Seperti semua Saksi Selamat sebelumnya.'
  }
}

};
