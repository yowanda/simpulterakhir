/* ============================================================
   SIMPUL TERAKHIR — BAB 2: Darah Pertama
   Kematian pertama terjadi. Kelompok terpecah lebih jauh.
   Aliansi terbentuk dan hancur. Misteri lantai 3 terungkap.
   ============================================================ */

const STORY_CH2 = {

'ch2_start': {
  chapter: 2,
  text: (s) => {
    let text = `<p class="sound">— Satu jam berlalu. Satu jam yang terasa seperti satu tahun. —</p>`;
    text += `<p class="sound">— Speaker berderak: —</p>`;
    text += `<p class="journal"><em>"Event kedua dimulai. Tema: Kepercayaan. Lokasi: Sayap Barat — Ruang Makan. Semua tamu diharapkan hadir. Ketidakhadiran akan... diperhitungkan."</em></p>`;
    // Player perspective
    const pc = s.playerCharacter || 'arin';
    if (pc === 'sera') text += `<p class="journal"><em>Kepercayaan. Tema yang tepat — karena kau bisa melihat bahwa setidaknya empat orang di ruangan ini tidak mempercayai siapapun. Termasuk dirimu sendiri.</em></p>`;
    else if (pc === 'lana') text += `<p class="journal"><em>Bab 2: Kepercayaan. Kau menulisnya sendiri. Amplop-amplop itu berisi informasi yang kau kumpulkan selama berbulan-bulan. Sekarang, tonton mereka saling menghancurkan.</em></p>`;
    else if (pc === 'niko') text += `<p class="journal"><em>Ruang makan keluargamu. Meja tempat kakekmu makan malam dengan orang-orang yang kemudian menghilang. Dan sekarang kau duduk di sini — mewarisi dosa itu.</em></p>`;
    else if (pc === 'juno') text += `<p class="journal"><em>"Permainan kepercayaan." Lo mau muntah. Lo bukan tipe orang yang main game — lo tipe orang yang balik meja.</em></p>`;
    else if (pc === 'reza') text += `<p class="journal"><em>Interogasi terselubung. Kau mengenali formatnya — berbeda kemasan, tapi tekniknya sama: pisahkan tersangka, beri informasi parsial, tonton siapa yang bohong.</em></p>`;
    else if (pc === 'kira') text += `<p class="journal"><em>Hologram itu pakai tech projection mapping. Lo bisa trace hardware-nya kalau lo bisa akses panel kontrol di balik dinding.</em></p>`;
    else if (pc === 'farah') text += `<p class="journal"><em>Rahasia. Di meja ini ada rahasiamu — dan rahasiamu bisa menghancurkan segalanya. Kau harus mengendalikan narasi. Kau harus bernegosiasi.</em></p>`;
    else if (pc === 'vira') text += `<p class="journal"><em>Permainan ini... kau sudah pernah memainkannya. Enam bulan lalu. Dan hasilnya — seseorang mati.</em></p>`;

    text += `<p><span class="speaker arin">Arin</span> Kau menatap kelompokmu. Raut wajah mereka campuran antara takut dan determinasi. Semua orang bergerak ke Sayap Barat — bahkan yang paling ketakutan. Ancaman "diperhitungkan" cukup efektif.</p>`;
    text += `<p><span class="speaker arin">Arin</span> Ruang Makan Wardhana adalah mimpi buruk aristokrat. Meja panjang kayu gelap, sepuluh kursi, chandelier yang lebih kecil dari yang di hall tapi entah kenapa lebih menakutkan. Di tengah meja: sepuluh gelas kristal terisi cairan gelap — wine? — dan sepuluh piring tertutup cloche perak.</p>`;

    if (s.flags.stoppedDimasTea || s.flags.tekoContaminated) {
      text += `<p><span class="speaker dimas">Dimas</span> Matamu langsung ke gelas-gelas. Dimas sudah pernah mencampurkan sesuatu ke minuman. Apakah ini juga...?</p>`;
    }

    text += `<p><span class="speaker sera">Sera</span> Di kepala meja — kursi ke-11 yang Sera sebutkan tadi. Masih kosong. Tapi sekarang ada proyektor kecil yang menembakkan hologram wajah pria tua — Sang Penenun — ke dinding di belakang kursi.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Speaker: <em>"Duduklah. Masing-masing di kursinya. Aturan Simpul Kedua sederhana: di bawah cloche kalian ada amplop. Di dalam amplop ada dua informasi — rahasia seseorang di meja ini, dan satu tuduhan palsu tentang orang lain. Tugas kalian: tentukan mana yang benar dan mana yang palsu. Kalian punya tiga puluh menit."</em></p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Tapi ada bonus: siapa yang berhasil mengidentifikasi semua kebenaran dan kebohongan dengan benar — mendapat akses ke lantai tiga."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Duduk dan mainkan. Informasi lebih berharga dari protes.",
      next: 'ch2_play_dinner',
      effect: (s) => {
        s.flags.playedDinner = true;
      }
    },
    {
      text: '"Sebelum siapapun minum — periksa gelas-gelas itu."',
      next: 'ch2_check_drinks',
      effect: (s) => {
        s.flags.checkedDrinks = true;
        Engine.modAwareness('arin', 5);
      }
    },
    {
      text: "Tolak duduk. Periksa ruangan untuk jebakan terlebih dahulu.",
      next: 'ch2_check_room',
      effect: (s) => {
        s.flags.checkedDiningRoom = true;
        Engine.modAwareness('arin', 8);
      }
    }
  ]
},

'ch2_check_drinks': {
  text: (s) => {
    let text = `<p><span class="speaker sera">Sera</span> "Jangan minum apapun!" Kau mengangkat gelasmu dan menciumnya. Wine. Tapi kau bukan sommelier.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> menghampiri. "Aku bisa tes sederhana — reaksi kimia dasar." Dia mengeluarkan strip pH dari tasnya dan mencelupkannya.</p>`;

    if (s.flags.stoppedDimasTea || s.flags.sawDimasBottle) {
      text += `<p class="sound">— Kau menahan tangannya. "Kau. Menjauh dari minuman." —</p>`;
      text += `<p><span class="speaker arin">Arin</span> Dimas menatapmu. Senyum sopannya tidak berubah. "Aku mencoba membantu, Arin."</p>`;
      text += `<p><span class="speaker sera">Sera</span>: "Biar aku yang tes." Dia mengambil strip pH dari tangan Dimas.</p>`;
    }

    text += `<p><span class="speaker sera">Sera</span> Hasilnya: semua gelas berisi wine normal. Tidak ada anomali yang bisa dideteksi dengan tes sederhana.</p>`;
    text += `<p><span class="speaker reza">Reza</span>: "Tidak berarti aman. Beberapa substansi tidak terdeteksi dengan pH."</p>`;
    text += `<p><span class="speaker reza">Reza</span> "Jadi kita tidak minum," katamu.</p>`;
    text += `<p><span class="speaker reza">Reza</span> Speaker: <em>"Minum atau tidak minum — itu pilihan kalian. Tapi permainan tetap berjalan."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Buka cloche dan baca amplop tanpa minum",
      next: 'ch2_read_envelopes',
      effect: (s) => {
        s.flags.didntDrink = true;
      }
    }
  ]
},

'ch2_check_room': {
  text: `<p><span class="speaker reza">Reza</span> Kau memeriksa ruang makan. Pintu masuk dan keluar — hanya satu. Jendela — teralis. Dinding — solid.</p>
<p><span class="speaker kira">Kira</span> melakukan scan cepat di laptopnya. "Dua kamera tersembunyi — di chandelier dan di belakang lukisan di dinding utara. Dan... speaker di bawah meja."</p>
<p><span class="speaker kira">Kira</span> "Yang menarik," tambah Kira, "kunci pintu ruangan ini juga terhubung ke server. Bisa dikunci dari luar kapan saja."</p>
<p class="sound">— Kau menatap satu-satunya pintu. Kalau masuk dan pintu terkunci — terjebak lagi. —</p>
<p><span class="speaker reza">Reza</span>: "Aku jaga pintu. Dari luar. Kalau ada masalah, aku dobrak."</p>`,
  choices: [
    {
      text: "Setuju — Reza jaga pintu, yang lain masuk dan mainkan",
      next: 'ch2_read_envelopes',
      effect: (s) => {
        s.flags.rezaGuarding = true;
        Engine.modTrust('arin', 'reza', 5);
      }
    },
    {
      text: "Aku yang jaga pintu. Reza lebih berguna di dalam.",
      next: 'ch2_guard_outside',
      effect: (s) => {
        s.flags.arinGuarding = true;
      }
    }
  ]
},

'ch2_guard_outside': {
  text: (s) => {
    let text = `<p><span class="speaker reza">Reza</span> Kau berdiri di luar ruang makan. Yang lain masuk — kau bisa mendengar suara percakapan, perdebatan, melalui pintu.</p>`;
    text += `<p><span class="speaker reza">Reza</span> Lima menit berlalu. Lalu kau mendengar langkah kaki di koridor. Pelan. Dari arah sayap timur.</p>`;
    text += `<p>Kau bersembunyi di balik pilar dan melihat — <span class="speaker vira">Vira</span> berjalan melewatimu, menuju tangga ke lantai dua. Dia tidak menuju ruang makan. Dia pergi ke tempat lain.</p>`;
    text += `<p class="sound">— Dan dia membawa sesuatu — kunci. Kunci tua dari kuningan. —</p>`;

    return text;
  },
  choices: [
    {
      text: "Ikuti Vira",
      danger: true,
      next: 'ch2_follow_vira',
      effect: (s) => {
        s.flags.followedViraUpstairs = true;
        Engine.modDanger(8);
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: "Biarkan dia — tetap jaga pintu",
      next: 'ch2_dinner_aftermath',
      effect: (s) => {
        s.flags.letViraGo = true;
      }
    }
  ]
},

'ch2_follow_vira': {
  text: `<p>Kau mengikuti <span class="speaker vira">Vira</span> ke lantai dua, lalu ke tangga sempit yang menuju lantai tiga — area yang seharusnya off-limits.</p>
<p><span class="speaker vira">Vira</span> Vira membuka pintu lantai tiga dengan kunci kuningan. Masuk. Kau menyelip sebelum pintu menutup.</p>
<p><span class="speaker niko">Niko</span> Lantai tiga mansion berbeda dari yang di bawah — lebih tua, lebih gelap, wallpaper yang terkelupas. Tiga ruangan: ruang kerja kakek Niko, kamar tidur tua, dan ruangan tanpa plakat.</p>
<p><span class="speaker vira">Vira</span> Vira masuk ke ruang kerja. Kau mengintip dari celah pintu.</p>
<p><span class="speaker vira">Vira</span> Ruang kerja penuh dengan buku, dokumen, dan di tengah — meja besar dengan peta mansion yang sama seperti yang kau temukan di dapur, tapi lebih detail. Garis-garis merah menghubungkan ruangan-ruangan tertentu. Notes bertebaran.</p>
<p><span class="speaker vira">Vira</span> Vira membuka laci bawah meja. Mengeluarkan sesuatu — hard drive eksternal. Menyimpannya di tasnya.</p>
<p class="sound">— Lalu dia berdiri dan berbicara — ke kamera kecil di sudut atas ruangan. —</p>
<p><span class="speaker vira">Vira</span> "Aku melakukan apa yang kau minta. Hard drive-nya ada padaku." Jeda. "Sekarang lepaskan mereka."</p>
<p class="sound">— Tidak ada jawaban dari kamera. —</p>
<p><span class="speaker vira">Vira</span> "Kau dengar aku? AKU SUDAH AMBIL HARD DRIVE-NYA!" Vira memukul meja. Suaranya pecah. "Lepaskan mereka. Kau janji—"</p>
<p class="sound">— Kamera berkedip merah. Lalu speaker kecil di meja berbunyi: —</p>
<p class="journal"><em>"Simpul belum lengkap, Vira. Kau tahu aturannya. Tiga harus terputus sebelum fajar. Hard drive hanyalah satu bagian."</em></p>
<p><span class="speaker vira">Vira</span> Vira merosot ke kursi. Menangis.</p>`,
  shake: true,
  choices: [
    {
      text: "Masuk dan konfrontasi Vira",
      next: 'ch2_vira_floor3_confront',
      effect: (s) => {
        s.flags.caughtVira = true;
        Engine.modAwareness('arin', 15);
        s.keyChoices.push('caught_vira_floor3');
      }
    },
    {
      text: "Mundur. Simpan informasi ini. Vira sedang dipaksa seseorang.",
      next: 'ch2_dinner_aftermath',
      effect: (s) => {
        s.flags.knowsViraBlackmailed = true;
        Engine.modAwareness('arin', 12);
        s.cluesFound += 2;
      }
    }
  ]
},

'ch2_vira_floor3_confront': {
  text: `<p><span class="speaker vira">Vira</span> Kau membuka pintu. Vira melompat berdiri, matanya lebar — ketakutan murni.</p>
<p><span class="speaker arin">Arin</span> "Arin—"</p>
<p><span class="speaker arin">Arin</span> "Siapa yang memaksamu? Lepaskan siapa?"</p>
<p><span class="speaker vira">Vira</span> Vira menelan air matanya. Butuh waktu — tapi dia bicara.</p>
<p><span class="speaker vira">Vira</span> "Adikku. Sana. Dia hilang tiga bulan lalu. Aku menerima pesan — dari nomor anonim — yang bilang dia aman, tapi aku harus melakukan apa yang diminta. Datang ke mansion. Ambil hard drive. Jangan bicara pada siapapun."</p>
<p><span class="speaker vira">Vira</span> "Dan tiga yang harus mati?"</p>
<p><span class="speaker vira">Vira</span> "Bukan aku yang memilih!" Suaranya rusak. "Sang Penenun yang memilih. Aku hanya — aku hanya alat. Dan aku benci diriku karena itu."</p>
<p class="sound">— Kau menatap hard drive di tasnya. —</p>
<p><span class="speaker vira">Vira</span> "Apa yang ada di hard drive itu?"</p>
<p><span class="speaker vira">Vira</span> "Bukti. Tujuh tahun acara di mansion ini. Nama-nama korban. Nama-nama yang terlibat. Siapapun yang punya hard drive ini bisa menghancurkan — atau melanjutkan — siklus ini."</p>`,
  choices: [
    {
      text: '"Berikan hard drive-nya padaku. Kita gunakan ini sebagai leverage."',
      next: 'ch2_dinner_aftermath',
      effect: (s) => {
        s.items.push('hard_drive');
        s.flags.hasHardDrive = true;
        Engine.modTrust('arin', 'vira', 10);
        s.cluesFound += 3;
        s.keyChoices.push('has_hard_drive');
      }
    },
    {
      text: '"Kita bawa ke kelompok. Bersama kita lebih kuat."',
      next: 'ch2_dinner_aftermath',
      effect: (s) => {
        s.flags.viraJoinedGroup = true;
        s.items.push('hard_drive');
        s.flags.hasHardDrive = true;
        Engine.modTrust('arin', 'vira', 15);
        s.moralScore += 10;
      }
    }
  ]
},

'ch2_play_dinner': {
  text: `<p class="sound">— Kalian duduk. Sepuluh orang. Sepuluh kursi. Sepuluh cloche. —</p>
<p><span class="speaker vira">Vira</span> Kau membuka cloche-mu. Di bawahnya: amplop, dan — sebuah boneka kayu kecil yang menyerupaimu. Ukiran detail, miniatur sempurna. Menyeramkan.</p>
<p><span class="speaker vira">Vira</span> Semua orang membuka cloche mereka. Semua mendapat boneka masing-masing. Dan amplop.</p>`,
  choices: [
    {
      text: "Baca amplopmu",
      next: 'ch2_read_envelopes'
    }
  ]
},

'ch2_read_envelopes': {
  text: (s) => {
    let text = `<p class="sound">— Kau membuka amplop. Dua kartu: —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Kartu 1 — <em>"KEBENARAN atau KEBOHONGAN: Niko Wardhana secara sadar merencanakan event malam ini sebagai perangkap untuk mengumpulkan semua orang yang terhubung dengan dosa keluarganya."</em></p>`;
    text += `<p><span class="speaker reza">Reza</span> Kartu 2 — <em>"KEBENARAN atau KEBOHONGAN: Reza Hartono dipecat dari kepolisian karena membunuh tersangka yang ternyata tidak bersalah."</em></p>`;
    text += `<p class="sound">— Satu benar, satu palsu. Tapi mana? —</p>`;
    text += `<p><span class="speaker reza">Reza</span> Di sekeliling meja, semua orang membaca kartu masing-masing. Ekspresi-ekspresi berubah — dan setiap ekspresi adalah cerita:</p>`;
    text += `<p><span class="speaker farah">Farah</span> menaruh kartunya di atas meja dengan tangan gemetar. "Ini... ini tidak adil." Suaranya pecah — armor pewaris retak. Di balik kemarahan, ada ketakutan seseorang yang tahu rahasianya hampir terbongkar. Matanya bergerak ke Niko — mencari sekutu, atau seseorang yang bisa dia beli kesetiaannya.</p>`;
    text += `<p><span class="speaker lana">Lana</span> membaca kartunya dan tersenyum — senyum yang membuat bulu kudukmu berdiri. Dalang menikmati permainan. Jarinya menelusuri tepi kartu seperti membelai naskah novel barunya. Di balik meja, kakinya menyentuh kaki Niko — dan kau melihat Niko tidak bergeser.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> membaca kartunya tanpa ekspresi. Tapi matanya — lagi-lagi — bergerak ke Sera. Saat Sera tidak melihat, Dimas menatapnya dengan intensitas yang melebihi ketertarikan normal. Kau mengenali tatapan itu dari kasus-kasus yang pernah kau liput: obsesi.</p>`;
    text += `<p><span class="speaker juno">Juno</span> meremas kartunya jadi bola. "Ini bullshit manipulatif." Suaranya keras, impulsif — Juno si pemantik konflik, yang selalu bereaksi dengan api. Reza di sebelahnya menyentuh lengannya pelan — gesture yang tenang, menenangkan. Juno berhenti. Mereka saling pandang selama satu detik. Lalu Juno menghembuskan napas.</p>`;
    text += `<p><span class="speaker vira">Vira</span> membaca kartunya dan tertawa kecil — tawa yang terlalu pelan, terlalu gelap. Eksentrik sampai di ujung. "Menarik," bisiknya. Matanya bertemu mata Niko dari ujung meja — dan di antara mereka, seluruh sejarah toxic love mereka mengalir: rindu, marah, sakit, dan sesuatu yang lebih berbahaya dari semua itu.</p>`;
    text += `<p><span class="speaker kira">Kira</span> sudah memfoto kartunya dan menjalankan sesuatu di laptopnya. "Font di kartu ini dicetak dengan printer laser. Kertas acid-free, 120 gram. Bukan barang murah." Eksentrik dan brilliant — Kira hidup di dunia detail yang tidak dilihat orang lain.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Di bawah meja, kau merasakan tangan Sera menyentuh tanganmu. Bukan genggaman — hanya ujung jari yang bertemu. Komunikasi tanpa kata. <em>Aku di sini.</em></p>`;
    text += `<p class="sound">— Speaker: "Diskusikanlah. Tiga puluh menit dimulai." —</p>`;

    return text;
  },
  choices: [
    {
      text: "Tanya Niko langsung — apakah dia merencanakan ini?",
      next: 'ch2_question_niko',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -5);
      }
    },
    {
      text: "Tanya Reza soal pemecatan — bukan untuk menyerang, tapi untuk klarifikasi",
      next: 'ch2_question_reza',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', -3);
      }
    },
    {
      text: "Bagikan kartumu terbuka dan minta semua orang melakukan hal yang sama",
      next: 'ch2_share_cards',
      effect: (s) => {
        s.flags.sharedCards = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Diam dan observasi reaksi semua orang",
      next: 'ch2_observe_dinner',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.observedDinner = true;
      }
    }
  ]
},

'ch2_question_niko': {
  text: `<p><span class="speaker niko">Niko</span> "Niko." Kau menaruh kartumu di meja. "Apakah kau merencanakan ini?"</p>
<p><span class="speaker niko">Niko</span> menghela napas. Panjang. Berat.</p>
<p><span class="speaker niko">Niko</span> "Ya dan tidak." Dia menatap semua orang. "Aku merencanakan pameran seni. Aku merencanakan mengungkap dosa keluargaku. Tapi BUKAN seperti ini." Dia menunjuk boneka-boneka kayu. "Bukan dengan ancaman kematian dan kunci elektromagnetik."</p>
<p><span class="speaker niko">Niko</span> "Seseorang... membajak acaraku. Mengambil infrastruktur yang aku bangun — smart home, kamera, speaker — dan menggunakannya untuk ini. Aku host, tapi aku bukan dalang."</p>
<p><span class="speaker reza">Reza</span>: "Jadi kartumu tentang Niko... semi-benar. Dia merencanakan mengumpulkan orang, tapi bukan sebagai perangkap."</p>
<p>"Atau itu yang dia ingin kita percaya," kata <span class="speaker lana">Lana</span> dari ujung meja.</p>`,
  choices: [
    {
      text: '"Niko, siapa yang bisa membajak sistemmu? Siapa yang tahu passwordnya?"',
      next: 'ch2_niko_passwords',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
      }
    },
    {
      text: "Lanjutkan diskusi — dengarkan reaksi yang lain",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        s.flags.heardDiscussion = true;
      }
    }
  ]
},

'ch2_niko_passwords': {
  text: `<p><span class="speaker niko">Niko</span>: "Aku pakai sistem smart home profesional. Password kuat. Tapi..."</p>
<p><span class="speaker niko">Niko</span> "Tapi?"</p>
<p><span class="speaker niko">Niko</span> "Aku menyewa kontraktor IT untuk instalasinya. Tiga bulan lalu. Perusahaan kecil — referensi bagus. Tapi sekarang aku berpikir..." dia mengusap wajahnya, "...mereka punya akses ke semuanya selama instalasi."</p>
<p><span class="speaker kira">Kira</span> mengangkat tangan. "Nama perusahaan?"</p>
<p><span class="speaker kira">Kira</span> "PT Benang Digital."</p>
<p><span class="speaker kira">Kira</span> Kira mengetik di laptopnya. "Registrasi perusahaan... tidak ada. PT Benang Digital tidak terdaftar di database manapun."</p>
<p>"Benang," bisik <span class="speaker sera">Sera</span>. "Penenun. Benang. Ini semua tentang benang dan simpul."</p>
<p class="sound">— Keheningan. —</p>`,
  choices: [
    {
      text: "Lanjut ke diskusi utama",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        s.cluesFound++;
        s.flags.knowsFakeCompany = true;
        s.keyChoices.push('fake_company');
      }
    }
  ]
},

'ch2_question_reza': {
  text: `<p><span class="speaker reza">Reza</span> "Reza. Kartuku menyebut kau dipecat dari kepolisian."</p>
<p><span class="speaker reza">Reza</span> menatapmu. Tidak marah — tapi ada luka lama di matanya.</p>
<p><span class="speaker reza">Reza</span> "Sebagian benar." Dia menarik napas. "Aku tidak dipecat karena membunuh. Aku dipecat karena menolak menutup kasus. Kasus serial killer yang melibatkan orang-orang berpengaruh. Aku disingkirkan karena terlalu dekat dengan kebenaran."</p>
<p><span class="speaker reza">Reza</span> "Dan tersangka yang tidak bersalah?"</p>
<p><span class="speaker reza">Reza</span> "Ada orang yang dipenjara untuk kasus itu. Orang yang aku yakin tidak bersalah. Dan orang itu..." suaranya turun, "...meninggal di penjara. Setahun lalu."</p>
<p><span class="speaker reza">Reza</span> Reza menatap gelasnya. "Kartumu setengah benar, setengah twist. Itulah cara manipulasi terbaik — campurkan kebenaran dengan kebohongan supaya kau tidak bisa membedakannya."</p>`,
  choices: [
    {
      text: "Lanjut ke diskusi utama — semua orang perlu bicara",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        Engine.modTrust('arin', 'reza', 5);
        s.flags.rezaOpenedUp = true;
      }
    }
  ]
},

'ch2_share_cards': {
  text: `<p><span class="speaker reza">Reza</span> "Ayo kita buka semua kartu. Transparan. Kalau kita saling curiga, Sang Penenun menang."</p>
<p class="sound">— Satu per satu, kartu dibuka. Kekacauan informasi: —</p>
<p><span class="speaker sera">Sera</span> • Sera mendapat: "Juno pernah terlibat penyelundupan obat" (PALSU — Juno bersih, tapi pernah mural di area itu) dan "Vira dikurung selama menghilang, bukan pergi sukarela" (BENAR).</p>
<p><span class="speaker sera">Sera</span> • Juno mendapat: "Sera pernah gagal mencegah bunuh diri pasien" (BENAR — trauma terbesarnya) dan "Farah meracuni kakeknya untuk warisan" (PALSU — tapi Farah gemetar saat mendengarnya).</p>
<p><span class="speaker niko">Niko</span> • Lana mendapat: "Niko tahu tentang Sang Penenun sejak awal" (PALSU — setengah) dan "Kira pernah meretas bank dan mencuri data" (BENAR — tapi sebagai whistleblower).</p>
<p><span class="speaker niko">Niko</span> Pola muncul. Setiap kartu dirancang untuk memecah dua orang yang dekat. Sera vs Juno. Niko vs kelompok. Farah vs kepercayaan.</p>
<p><span class="speaker sera">Sera</span>: "Ini bukan permainan informasi. Ini psyops. Serangan psikologis untuk menghancurkan kelompok dari dalam."</p>`,
  choices: [
    {
      text: '"Sera benar. Kita harus solid — itu satu-satunya pertahanan kita."',
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        s.moralScore += 10;
        s.flags.unitedGroup = true;
        s.keyChoices.push('united_group');
      }
    },
    {
      text: "Tapi beberapa informasi ini berguna. Catat semuanya.",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        s.cluesFound += 2;
        Engine.modAwareness('arin', 12);
        s.flags.cataloguedInfo = true;
      }
    }
  ]
},

'ch2_observe_dinner': {
  text: `<p><span class="speaker sera">Sera</span> Kau diam. Mengamati. Sementara yang lain bicara, berdebat, menuduh — kau membaca ruangan.</p>
<p><span class="speaker lana">Lana</span>: tenang, menulis di notes. Terlalu tenang. Dia menganggap ini sebagai material, bukan ancaman.</p>
<p><span class="speaker dimas">Dimas</span>: senyum yang sama, postur yang sama. Tapi tangannya — di bawah meja, di saku jas, memegang sesuatu.</p>
<p><span class="speaker farah">Farah</span>: makin panik. Minum wine meski kau memperingatkan — dua gelas sudah. Tangannya gemetar.</p>
<p><span class="speaker niko">Niko</span>: berkeringat. Berusaha mengendalikan situasi tapi kehilangan grip. Dia bukan dalang — dia overwhelmed.</p>
<p><span class="speaker vira">Vira</span>: absen. Kau baru sadar — Vira tidak ada di meja.</p>
<p><span class="speaker kira">Kira</span>: di laptop, separuh perhatian di diskusi. Jarinya bergerak nonstop. Mencari sesuatu.</p>
<p>Dan detail kecil: gelas <span class="speaker farah">Farah</span> terisi lebih banyak dari yang lain. Seolah seseorang menambahkan isi saat tidak ada yang memperhatikan.</p>`,
  shake: true,
  choices: [
    {
      text: '"Farah, jangan minum lagi!" — ambil gelasnya',
      next: 'ch2_save_farah_drink',
      effect: (s) => {
        s.flags.savedFarahDrink = true;
        s.moralScore += 10;
        Engine.modTrust('arin', 'farah', 10);
      }
    },
    {
      text: "Vira tidak ada di meja. Di mana dia?",
      next: 'ch2_vira_missing',
      effect: (s) => {
        s.flags.noticedViraMissing = true;
      }
    }
  ]
},

'ch2_save_farah_drink': {
  text: (s) => {
    let text = `<p><span class="speaker farah">Farah</span> Kau meraih gelas Farah. "Jangan minum lagi."</p>`;
    text += `<p><span class="speaker farah">Farah</span>: "Apa—"</p>`;
    text += `<p><span class="speaker farah">Farah</span> "Gelasmu terisi lebih banyak dari yang lain. Seseorang menambahkan sesuatu."</p>`;
    text += `<p class="sound">— Hening di meja. —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> berdiri. "Biar aku tes." Dia meraih gelasnya.</p>`;

    if (s.flags.stoppedDimasTea || s.flags.sawDimasBottle) {
      text += `<p><span class="speaker dimas">Dimas</span> "JANGAN SENTUH!" teriakmu. "Kau yang terakhir terlihat memegang botol tanpa label di basement."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> Semua mata ke Dimas. Dia membeku.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> "Itu... obat herbal. Valerian."</p>`;
      text += `<p><span class="speaker reza">Reza</span> mengambil gelas dari tanganmu dan menciumnya. "Ini bukan valerian." Wajahnya mengeras. "Ini midazolam. Sedatif kuat. Dosis yang ada di gelas ini cukup untuk membuat orang tidak sadar selama berjam-jam."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> mundur. "Itu bukan aku—"</p>`;
    } else {
      text += `<p><span class="speaker reza">Reza</span> mengambil gelas dari tanganmu, menciumnya. Alisnya terangkat. "Ada sesuatu selain wine di sini."</p>`;
      text += `<p><span class="speaker farah">Farah</span> "Tapi siapa...?" Farah menatap ke sekeliling meja.</p>`;
      text += `<p class="sound">— Tidak ada yang menjawab. —</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Lanjutkan diskusi — tapi dengan kewaspadaan ekstra",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        Engine.modSuspicion('dimas', 15);
        s.flags.drugsInDrink = true;
        s.cluesFound++;
      }
    }
  ]
},

'ch2_vira_missing': {
  text: `<p><span class="speaker vira">Vira</span> "Di mana Vira?"</p>
<p><span class="speaker vira">Vira</span> Semua menoleh ke kursi Vira — kosong.</p>
<p><span class="speaker niko">Niko</span>: "Dia di sini tadi. Waktu kita masuk."</p>
<p><span class="speaker niko">Niko</span> "Tapi sekarang tidak." Kau berdiri. "Siapa yang melihatnya terakhir?"</p>
<p><span class="speaker juno">Juno</span>: "Gue liat dia keluar ke koridor. Sebelum speaker mulai."</p>
<p><span class="speaker juno">Juno</span> Speaker berderak: <em>"Ah. Salah satu pemain memilih untuk bermain di luar board. Menarik. Apakah kalian akan mencarinya — atau fokus pada permainan di depan kalian?"</em></p>`,
  choices: [
    {
      text: "Cari Vira — keselamatan lebih penting dari permainan",
      next: 'ch2_search_vira',
      effect: (s) => {
        s.flags.searchedForVira = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Vira bisa jaga diri. Fokus di sini.",
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        s.flags.leftViraAlone = true;
      }
    }
  ]
},

'ch2_search_vira': {
  text: (s) => {
    let text = `<p><span class="speaker juno">Juno</span> "Aku cari Vira. Juno, ikut. Yang lain tetap di sini."</p>`;
    text += `<p>Kau dan <span class="speaker juno">Juno</span> keluar ke koridor. Gelap — lampu berkedip dengan interval tidak teratur.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Kalian menyusuri sayap barat, naik tangga ke lantai dua. Di ujung koridor — pintu kamar tamu terbuka. Cahaya dari dalam.</p>`;
    text += `<p><span class="speaker vira">Vira</span> ada di dalam. Duduk di lantai. Di depannya: laptop yang terbuka, menampilkan feed CCTV dari seluruh mansion.</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Vira."</p>`;
    text += `<p class="sound">— Dia tidak terkejut. "Aku tahu kalian akan datang." Dia menunjuk layar. "Lihat." —</p>`;
    text += `<p><span class="speaker farah">Farah</span> Di salah satu feed — ruang makan, dari sudut yang kalian tidak tahu ada kameranya — terlihat jelas: seseorang memasukkan sesuatu ke gelas Farah. Rekamannya grainy tapi gesture-nya jelas.</p>`;

    if (s.difficulty >= 2) {
      text += `<p>Orang yang memasukkan sesuatu ke gelas itu: <span class="speaker dimas">Dimas</span>. Gerakan halus, tangan di bawah meja, botol kecil.</p>`;
      text += `<p><span class="speaker juno">Juno</span> "Dimas,"  pelan.</p>`;
      text += `<p><span class="speaker vira">Vira</span> "Ya," . "Dan dia bukan satu-satunya. Lihat feed lain."</p>`;
      text += `<p>Feed dari perpustakaan: <span class="speaker lana">Lana</span> membuka panel tersembunyi di belakang rak buku. Di dalamnya — walkie-talkie dan serangkaian notes. Dia berbicara ke walkie-talkie, tapi tanpa audio, kau tidak bisa tahu apa yang dia katakan.</p>`;
    } else {
      text += `<p class="sound">— Tapi wajah orang itu tidak terlihat jelas — angle kamera menutupi identitasnya. —</p>`;
      text += `<p><span class="speaker vira">Vira</span> "Aku mencoba enhance," , "tapi kualitas CCTV ini sengaja direndahkan."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: '"Kita perlu kembali dan peringatkan yang lain."',
      next: 'ch2_dinner_discussion',
      effect: (s) => {
        if (s.difficulty >= 2) {
          s.flags.cctvProofDimas = true;
          s.flags.cctvProofLana = true;
          s.cluesFound += 2;
        }
        Engine.modAwareness('arin', 10);
        s.keyChoices.push('found_cctv_proof');
      }
    }
  ]
},

'ch2_dinner_discussion': {
  text: (s) => {
    let text = `<p><span class="speaker vira">Vira</span> Kelompok kembali bersama — atau apa yang tersisa dari kebersamaan. Diskusi menjadi debat. Debat menjadi pertengkaran.</p>`;

    if (s.flags.unitedGroup) {
      text += `<p><span class="speaker vira">Vira</span> Upayamu untuk menjaga kesatuan berhasil — sampai sekarang. Tapi retakan mulai terlihat.</p>`;
    }

    text += `<p><span class="speaker juno">Juno</span> menunjuk <span class="speaker lana">Lana</span>. "Semua jari menunjuk ke lu dan Dimas. Jelaskan."</p>`;
    text += `<p><span class="speaker lana">Lana</span>: "Aku penulis. Dimas konsultan medis-ku. Kami berdua diundang secara terpisah oleh Niko. Dan aku muak dituduh tanpa bukti."</p>`;

    if (s.flags.cctvProofDimas) {
      text += `<p><span class="speaker vira">Vira</span> "Tanpa bukti?" Kau mengangkat laptop Vira yang menampilkan rekaman. "CCTV menunjukkan Dimas memasukkan sesuatu ke gelas Farah."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> Dimas menatap layar. Untuk pertama kali, senyumnya lenyap.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> "Itu... itu bukan aku—"</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Itu JELAS kau," . "Gesture, posisi duduk, timing. Itu kau."</p>`;
    }

    text += `<p class="sound">— Lalu — speaker berbunyi lagi: —</p>`;
    text += `<p class="journal"><em>"Waktu habis. Simpul Kedua: Kepercayaan — terikat. Satu hal lagi sebelum event ketiga: hadiah kecil. Periksa koridor lantai satu."</em></p>`;
    text += `<p class="sound">— Semua bergerak ke koridor. Dan di sana— —</p>`;
    text += `<p><span class="speaker reza">Reza</span> Sebuah proyektor menampilkan video di dinding. Durasi: 30 detik. Menunjukkan rekaman lama — hitam putih, grainy — dari ruangan di basement mansion ini.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Dalam video: dua orang pria tua duduk berhadapan. Salah satu — Hendarto Wardhana, kakek Niko. Yang lain — kakek Farah. Di antara mereka, di meja: batu dengan ukiran kuno.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Kakek Niko berbicara. Tidak ada audio, tapi subtitle muncul:</p>`;
    text += `<p class="journal"><em>"Kita sudah terlalu jauh untuk berhenti. Setiap tahun, simpul harus terputus. Itu harga yang kita bayar."</em></p>`;
    text += `<p class="sound">— Lalu — suara. Teriakan. Video berhenti. —</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: "Sebelum event ketiga dimulai — kita harus naik ke lantai 3 SEKARANG",
      next: 'ch2_death_scene',
      effect: (s) => {
        s.flags.headingToFloor3 = true;
        Engine.modDanger(5);
      }
    },
    {
      text: "Tetap bersama. Jangan terpecah. Apapun yang terjadi.",
      next: 'ch2_death_scene',
      effect: (s) => {
        s.flags.stayTogether = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch2_death_scene': {
  chapter: 2,
  text: (s) => {
    let text = `<p class="sound">— Dan kemudian — jeritan. —</p>`;
    text += `<p class="sound">— Bukan dari speaker. Bukan rekaman. Jeritan nyata, mentah, dari arah dapur. —</p>`;
    text += `<p class="sound">— Semua berlari. Koridor. Belokan. Dapur. —</p>`;

    if (s.difficulty === 1 && !s.flags.stoppedDimasTea && !s.flags.savedFarahDrink) {
      text += `<p><span class="speaker farah">Farah</span> tergeletak di lantai dapur. Tidak sadarkan diri. Foam di mulutnya. Botol valerian extract — yang Dimas sentuh tadi — tergeletak terbuka di sampingnya.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> sudah di sampingnya, memeriksa nadi. "Dia hidup tapi tidak sadar. Overdosis sedatif. Aku butuh—"</p>`;
      text += `<p><span class="speaker reza">Reza</span> menarik Dimas menjauh. "Kau JANGAN sentuh dia."</p>`;
      text += `<p><span class="speaker farah">Farah</span> Farah hidup — tapi unconscious. Satu korban, tanpa kematian. Untuk sekarang.</p>`;
    } else if (s.flags.savedFarahDrink || s.flags.stoppedDimasTea) {
      text += `<p><span class="speaker kira">Kira</span> tergeletak di lantai dapur. Laptopnya pecah di sampingnya — seseorang menghantamkan sesuatu ke kepalanya.</p>`;
      text += `<p class="sound">— Darah. Nyata. Di lantai, di dinding, di counter. —</p>`;
      text += `<p><span class="speaker reza">Reza</span> memeriksa nadinya. "Hidup. Tapi cedera kepala parah. Dia butuh rumah sakit — SEKARANG."</p>`;
      text += `<p><span class="speaker kira">Kira</span> Laptopnya hancur. Kira — satu-satunya yang bisa hack sistem — lumpuh.</p>`;
    } else {
      text += `<p><span class="speaker farah">Farah</span> tergeletak di lantai dapur. <span class="speaker dimas">Dimas</span> memeriksa nadinya.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> "Tidak sadar. Reaksi terhadap substansi — bukan alami." Dimas bekerja dengan efisiensi klinis. "Perlu posisi recovery."</p>`;
      text += `<p><span class="speaker farah">Farah</span> Farah hidup tapi unconscious.</p>`;
    }

    text += `<p><span class="speaker farah">Farah</span> Speaker: <em>"Simpul pertama nyaris terputus. Tapi belum sepenuhnya. Sang Penenun memberikan kesempatan kedua — kali ini."</em></p>`;
    text += `<p class="sound">— Pesan jelas: ini baru peringatan. Kali berikutnya tidak akan ada "nyaris". —</p>`;
    text += `<p class="sound">— Countdown di layar: ${s.flags.kiraTracking ? '03:00:00' : '04:00:00'} —</p>`;

    return text;
  },
  blood: true,
  shake: true,
  choices: [
    {
      text: "Kunci Dimas — dia tersangka utama untuk keracunan",
      condition: (s) => s.flags.stoppedDimasTea || s.flags.drugsInDrink || s.flags.cctvProofDimas,
      danger: true,
      next: 'ch3_start',
      effect: (s) => {
        s.flags.dimasLocked = true;
        Engine.modSuspicion('dimas', 20);
        s.keyChoices.push('locked_dimas');
      }
    },
    {
      text: "Jaga korban. Tempatkan orang-orang terpercaya untuk berjaga giliran.",
      next: 'ch3_start',
      effect: (s) => {
        s.flags.guardingVictim = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Cukup menunggu. Naik ke lantai 3 — tempat jawaban berada.",
      next: 'ch3_start',
      effect: (s) => {
        s.flags.headingToFloor3 = true;
        Engine.modDanger(5);
      }
    },
    {
      text: "Kira yang diserang. Sang Penenun mengincar hacker kita. Kita butuh plan B.",
      condition: (s) => s.flags.savedFarahDrink || s.flags.stoppedDimasTea,
      next: 'ch3_start',
      effect: (s) => {
        s.flags.needPlanB = true;
        s.keyChoices.push('lost_hacker');
      }
    }
  ]
}

};
