/* ============================================================
   SIMPUL TERAKHIR — BAB 1: Pameran Maut
   Event pertama terjadi. Kelompok mulai terpecah.
   Side characters menciptakan konflik. Clue-clue pertama.
   ============================================================ */

const STORY_CH1 = {

'ch1_start': {
  chapter: 1,
  text: (s) => {
    let text = `<div class="scene-art scene-cabin"></div>`;
    text += `<p class="narration">Menit-menit berlalu seperti detak jantung yang semakin cepat. Sepuluh orang. Satu mansion. Dan pesan di dinding yang menjanjikan tiga kematian sebelum fajar.</p>`;

    if (s.flags.openedBasement) {
      text += `<p>Pintu basement terbuka — gelap menganga seperti mulut. Dengungan generator terdengar dari bawah, berirama dengan musik yang mengalun terbalik.</p>`;
      text += `<p><span class="speaker reza">Reza</span> menyalakan senter kecilnya. "Aku turun duluan. Kalau aku tidak kembali dalam lima menit—"</p>`;
      text += `<p>"Aku ikut," potongmu.</p>`;
    } else {
      text += `<p>Speaker tersembunyi di mansion berderak hidup. Suara — diproses, dimekanisasi, tanpa gender — mengisi setiap ruangan:</p>`;
      text += `<p class="journal"><em>"Selamat malam, para tamu. Selamat datang di Pameran Simpul Terakhir. Dalam enam jam, pintu akan terbuka. Tapi sebelum itu — setiap jam, sebuah 'karya seni' baru akan terungkap. Karya pertama dimulai dalam tiga menit. Silakan menuju Galeri Timur."</em></p>`;
    }

    // Player-specific perspective insert
    const pc = s.playerCharacter || 'arin';
    if (pc === 'sera') {
      text += `<p class="journal"><em>Kau membaca ruangan. Sembilan wajah, sembilan set micro-expression. Dan setidaknya tiga orang di sini sedang berbohong.</em></p>`;
    } else if (pc === 'lana') {
      text += `<p class="journal"><em>Sempurna. Semuanya berjalan sesuai naskah. Sekarang, bab selanjutnya: ketakutan.</em></p>`;
    } else if (pc === 'reza') {
      text += `<p class="journal"><em>Dua puluh tahun pengalaman bilang: ini bukan acara seni. Ini crime scene yang belum terjadi.</em></p>`;
    } else if (pc === 'kira') {
      text += `<p class="journal"><em>Speaker itu pakai protokol encrypted. Siapapun dalangnya, dia punya akses ke tech yang serius.</em></p>`;
    } else if (pc === 'vira') {
      text += `<p class="journal"><em>Suara itu. Kau mengenalnya. Diproses, ya — tapi intonasinya... sama seperti enam bulan lalu. Dia masih di sini.</em></p>`;
    } else if (pc === 'niko') {
      text += `<p class="journal"><em>Ini bukan bagian dari rencanamu. Seseorang membajak acaramu. Dan kau harus mencari tahu siapa sebelum terlambat.</em></p>`;
    } else if (pc === 'dimas' && s.difficulty >= 2) {
      text += `<p class="journal"><em>Lana mengangguk pelan padamu dari seberang ruangan. Kode: semuanya berjalan lancar. Tapi perasaan aneh di perutmu — itu baru.</em></p>`;
    }

    text += `<p>Reaksi berantai di ruangan — dan setiap reaksi menceritakan lebih banyak dari yang dimaksudkan:</p>`;
    if (!Engine.isPlayer('farah')) text += `<p><span class="speaker farah">Farah</span> mencengkeram lengan sofa. "Aku tidak mau ke mana-mana." Egoisme survival — instingnya sebagai pewaris yang terbiasa mengirim orang lain ke zona bahaya sementara dia menunggu di tempat aman.</p>`;
    else text += `<p>Kau mencengkeram lengan sofa. Tidak. Kau tidak akan menjadi yang pertama masuk ke perangkap.</p>`;

    if (!Engine.isPlayer('lana')) text += `<p><span class="speaker lana">Lana</span> sudah berjalan ke arah Galeri Timur, tumit stiletto-nya berdetak seperti metronom. "Aku ingin lihat." Matanya berkilat — bukan ketakutan, tapi ketertarikan. Dalang yang menikmati pertunjukan bahkan saat pertunjukan itu miliknya sendiri.</p>`;
    else text += `<p>Kau berjalan ke arah Galeri Timur. Tumit stiletto-mu berdetak seperti metronom. "Aku ingin lihat," katamu — dan kau memang ingin. Ini karyamu, setelah semua.</p>`;

    if (!Engine.isPlayer('dimas')) text += `<p><span class="speaker dimas">Dimas</span> mengikuti Lana tanpa kata — patuh, otomatis. Seperti anjing yang sudah terlatih oleh satu tuan. Tapi matanya sempat bergeser ke Sera selama satu detik penuh — dan ada sesuatu di sana yang membuat perutmu melilit.</p>`;
    else text += `<p>Kau mengikuti Lana. Seperti biasa. Tapi malam ini, matamu bergeser ke Sera — dan sesuatu yang bukan bagian dari instruksi Lana bergerak di dadamu.</p>`;

    if (!Engine.isPlayer('juno')) text += `<p><span class="speaker juno">Juno</span> menatap kelompok. "${Engine.isPlayer('arin') ? 'Arin' : Engine.playerName()}, ini trap yang obvious banget. Kita nggak harus ikut." Di belakangnya, Reza berdiri diam — dan kau menangkap momen kecil: Juno menyentuh siku Reza tanpa sadar, dan Reza... tidak menolak. Dua orang yang rusak, menemukan sesuatu yang stabil di satu sama lain tanpa menyadarinya.</p>`;
    else text += `<p>"Ini trap yang obvious banget," katamu keras. Lo nggak peduli siapa yang setuju. Di belakangmu, Reza berdiri — dan entah kenapa, kehadirannya bikin lo sedikit lebih tenang. Sedikit.</p>`;

    if (!Engine.isPlayer('niko')) text += `<p><span class="speaker niko">Niko</span>: "Atau justru di situlah jawabannya." Niko melirik Vira saat mengatakannya — pesan ganda yang hanya bisa ditangkap oleh seseorang yang pernah berbagi bantal dengannya. Vira membalas tatapannya. Dan di antara mereka, listrik lama yang seharusnya sudah mati — berderak hidup lagi.</p>`;
    else text += `<p>"Atau justru di situlah jawabannya," katamu. Matamu bergeser ke Vira tanpa izin otakmu. Dia menatap balik. Dan di dadamu, sesuatu yang seharusnya sudah mati — berderak hidup.</p>`;

    if (!Engine.isPlayer('kira')) text += `<p><span class="speaker kira">Kira</span> sudah mengeluarkan laptopnya. "Gue nge-trace frekuensi audio dari speaker itu. Kalau ini dikendalikan remote, gue bisa..." Jarinya menari di keyboard dengan kecepatan eksentrik. "...trace IP-nya. Atau setidaknya tahu apakah si suara ini di dalam mansion atau di luar."</p>`;
    else text += `<p>Lo buka laptop. Jari-jari lo sudah nge-trace frekuensi audio dari speaker sebelum otak lo selesai panik. "Gue bisa trace IP-nya," gumammu. Data nggak bohong. Data nggak manipulasi. Data adalah satu-satunya hal yang lo percaya malam ini.</p>`;

    return text;
  },
  choices: [
    {
      text: "Pergi ke Galeri Timur — hadapi apapun yang menunggu",
      hint: "Informasi adalah senjata. Bahkan informasi yang menakutkan.",
      next: 'ch1_gallery_east',
      effect: (s) => {
        s.flags.wentToGallery = true;
        Engine.modDanger(5);
      }
    },
    {
      text: "Tetap di hall — siapkan barricade dan pertahanan",
      next: 'ch1_stay_hall',
      effect: (s) => {
        s.flags.stayedInHall = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Gunakan kesempatan saat semua terdistraksi untuk jelajahi lantai 2",
      danger: true,
      hint: "Semua orang fokus ke galeri. Ini saat yang tepat untuk investigasi.",
      next: 'ch1_explore_floor2',
      effect: (s) => {
        s.flags.exploredFloor2 = true;
        Engine.modAwareness('arin', 10);
        Engine.modDanger(8);
      }
    },
    {
      text: "Turun ke basement bersama Reza — cari ruang server",
      condition: (s) => s.flags.openedBasement || s.flags.foundBasementDoor,
      next: 'ch1_basement',
      effect: (s) => {
        s.flags.wentToBasement = true;
        Engine.modTrust('arin', 'reza', 5);
        Engine.modDanger(10);
      }
    },
    {
      text: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'sera') return '"Semua orang menunjukkan micro-expression ketakutan kecuali dua orang..." — Profile mereka';
        if (pc === 'kira') return 'Hack speaker system — trace sumber audio ke controller';
        if (pc === 'lana') return 'Pergi ke Galeri Timur duluan — kau sudah tahu apa yang ada di sana';
        if (pc === 'niko') return 'Buka panel rahasia di belakang lukisan kakek — ada sesuatu di sana';
        if (pc === 'vira') return '"Aku pernah ke sini. Ikuti aku — ada rute yang tidak mereka tahu"';
        if (pc === 'reza') return 'Periksa semua exit point — kebiasaan assessment dari kepolisian';
        if (pc === 'farah') return '"Mansion ini dibangun keluargaku. Aku tahu di mana safe room-nya"';
        return null;
      },
      condition: (s) => {
        const pc = s.playerCharacter || 'arin';
        return ['sera', 'kira', 'lana', 'niko', 'vira', 'reza', 'farah'].includes(pc);
      },
      hint: (s) => {
        const pc = s.playerCharacter || 'arin';
        if (pc === 'sera') return 'Keahlian profiling-mu membuka perspektif baru.';
        if (pc === 'kira') return 'Skill hacking-mu bisa mengungkap infrastruktur mansion.';
        if (pc === 'lana') return 'Kau tahu skenarionya. Gunakan itu.';
        if (pc === 'niko') return 'Pengetahuan mansion membuka area tersembunyi.';
        if (pc === 'vira') return 'Pengalaman sebelumnya membuka jalan rahasia.';
        return 'Keahlian unikmu memberi pilihan tambahan.';
      },
      next: 'ch1_character_special',
      type: 'special',
      effect: (s) => {
        const pc = s.playerCharacter || 'arin';
        s.flags.usedCharacterAbility = true;
        s.flags.characterSpecialCh1 = pc;
        Engine.modAwareness('arin', 12);
        s.cluesFound += 2;
        if (pc === 'kira') { s.flags.kiraHackedSpeakers = true; }
        if (pc === 'niko') { s.flags.nikoSecretPanel = true; }
        if (pc === 'vira') { s.flags.viraSecretRoute = true; }
        if (pc === 'reza') { s.flags.rezaExitAssessment = true; }
        if (pc === 'farah') { s.flags.farahSafeRoom = true; }
      }
    }
  ]
},

'ch1_character_special': {
  chapter: 1,
  text: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = '';
    if (pc === 'sera') {
      text = `<p>Kau berdiri di tengah ruangan dan membaca setiap wajah. Sembilan set micro-expression — dan dua orang yang tidak menunjukkan ketakutan yang wajar.</p>`;
      text += `<p><span class="speaker lana">Lana</span>: pupil tidak melebar. Bibir sedikit terangkat di sudut kanan — contempt microexpression. Dia tidak takut. Dia <em>menikmati</em>.</p>`;
      text += `<p><span class="speaker dimas">Dimas</span>: detak jantung terlihat di leher — normal. Tidak ada fight-or-flight response. Dia tenang. Terlalu tenang untuk mahasiswa yang harusnya panik.</p>`;
      text += `<p class="journal"><em>Dua orang yang tidak takut di situasi yang seharusnya menakutkan. Ini bukan data biasa. Ini profil predator.</em></p>`;
    } else if (pc === 'kira') {
      text = `<p>Lo buka terminal di laptop. Speaker system mansion pakai protokol ZigBee — IoT standard. Lo nge-trace signal-nya dalam 30 detik.</p>`;
      text += `<p>Source: device di sublevel B-2. Bukan lantai 1, bukan lantai 2. <em>Bawah</em>.</p>`;
      text += `<p>Dan lo menemukan sesuatu lain — ada 4 device lain yang aktif di jaringan yang seharusnya cuma punya 1 router. Empat camera tersembunyi. Seseorang menonton.</p>`;
      text += `<p class="journal"><em>Network map lengkap. Empat kamera. Satu controller di basement. Dan sebuah encrypted channel yang masih lo coba crack.</em></p>`;
    } else if (pc === 'lana') {
      text = `<p>Kau berjalan ke Galeri Timur duluan. Kau sudah tahu apa yang akan muncul di layar — karena kau yang menulis skenarionya.</p>`;
      text += `<p>Tapi ada sesuatu yang berbeda. Layar ketiga dari kiri — itu bukan bagian dari naskahmu. Seseorang menambahkan konten tanpa sepengetahuanmu.</p>`;
      text += `<p class="journal"><em>Sang Penenun mengubah naskahmu tanpa izin. Kau bukan satu-satunya dalang di permainan ini.</em></p>`;
    } else if (pc === 'niko') {
      text = `<p>Kau menarik lukisan kakekmu — potret Hendarto Wardhana — dan di baliknya ada panel rahasia. Kau sudah tahu ada sesuatu di sini sejak kecil.</p>`;
      text += `<p>Di balik panel: jurnal kakekmu. Tulisan tangan, pudar oleh waktu. Dan satu halaman yang membuatmu berhenti bernapas — daftar nama. Sepuluh nama. Dan namamu ada di sana.</p>`;
      text += `<p class="journal"><em>Kakekmu sudah merencanakan ini. Bahkan kau — cucunya sendiri — adalah bagian dari permainan.</em></p>`;
    } else if (pc === 'vira') {
      text = `<p>Kau tahu rute ini. Lorong servis di balik dinding timur — tersembunyi di balik panel kayu. Kau menemukannya enam bulan lalu, saat lari dari hal yang sama.</p>`;
      text += `<p>Lorong membawamu ke observasi — jendela satu arah yang menghadap ke Galeri Timur. Dari sini, kau bisa melihat tanpa terlihat.</p>`;
      text += `<p>Dan kau melihat sesuatu: <span class="speaker dimas">Dimas</span> mengambil sesuatu dari kantong — syringe kecil. Dia menyembunyikannya di balik jas. Tidak ada yang melihat. Kecuali kau.</p>`;
      text += `<p class="journal"><em>Dimas membawa syringe. Dan kau tahu — dari pengalaman — bahwa syringe itu bukan untuk pertolongan pertama.</em></p>`;
    } else if (pc === 'reza') {
      text = `<p>Assessment perimeter. Kebiasaan lama. Kau memeriksa setiap pintu, setiap jendela, setiap exit point.</p>`;
      text += `<p>Hasilnya menakutkan: semua jendela lantai 1 dikunci dari luar dengan baut — bukan kunci standar. Pintu utama: deadbolt elektronik, butuh kode. Pintu belakang dapur: dilas. Dilas.</p>`;
      text += `<p>Ini bukan mansion. Ini penjara.</p>`;
      text += `<p class="journal"><em>Zero exit points kecuali pintu utama yang controlled electronically. Siapapun yang mendesain ini — dia tidak ingin ada yang keluar sebelum waktunya.</em></p>`;
    } else if (pc === 'farah') {
      text = `<p>Safe room. Kakekmu — Aldridge yang mendanai pembangunan mansion ini — meminta safe room dibangun di lantai 2, sayap utara. Kau tahu kodenya.</p>`;
      text += `<p>Kau berjalan ke sana. Dan menemukan safe room — utuh, terkunci, dengan supply untuk 48 jam. Tapi di dalam... sudah ada tanda-tanda penggunaan baru. Selimut, botol air, dan sebuah monitor yang menampilkan feed dari empat kamera tersembunyi di seluruh mansion.</p>`;
      text += `<p class="journal"><em>Seseorang sudah menggunakan safe room keluargamu sebagai pusat kontrol. Kau tahu siapa yang punya akses — dan itu mempersempit tersangka.</em></p>`;
    } else {
      text = `<p>Kau menggunakan keahlianmu untuk mencari tahu lebih banyak tentang mansion ini. Hasilnya: clue baru yang membuka jalan investigasi baru.</p>`;
    }
    return text;
  },
  choices: [
    {
      text: "Kembali ke kelompok dan bagikan apa yang kau temukan",
      next: 'ch1_gallery_east',
      effect: (s) => {
        s.flags.sharedCharacterIntel = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Simpan informasi ini untuk dirimu sendiri — belum waktunya",
      next: 'ch1_gallery_east',
      effect: (s) => {
        s.flags.keptCharacterSecret = true;
        Engine.modAwareness('arin', 5);
      }
    }
  ]
},

'ch1_gallery_east': {
  chapter: 1,
  text: (s) => {
    let text = `<p>Galeri Timur adalah lorong panjang dengan langit-langit kaca yang memperlihatkan langit malam. Di sepanjang dinding, layar LCD besar menampilkan visual — belum aktif, masih hitam.</p>`;
    text += `<p>Kau masuk bersama beberapa orang. <span class="speaker lana">Lana</span> dan <span class="speaker dimas">Dimas</span> sudah di depan. <span class="speaker niko">Niko</span> menyusul. <span class="speaker sera">Sera</span> berjalan di sampingmu, tangannya mencengkeram notes-nya.</p>`;

    if (s.flags.calledJuno || s.flags.warnedJunoAboutVira) {
      text += `<p><span class="speaker juno">Juno</span> ada di belakangmu, matanya menyapu setiap sudut.</p>`;
    }

    text += `<p>Tepat pukul 22:00 — layar-layar menyala serentak.</p>`;
    text += `<p>Setiap layar menampilkan wajah salah satu dari kalian. Foto close-up, resolusi tinggi, diambil tanpa sepengetahuan kalian. Di bawah setiap foto: nama, usia, dan satu kalimat.</p>`;
    text += `<p>Kalimat di bawah fotomu: <em>"Arin Prasetya. 24. Mencari kebenaran tentang kematian sumbernya — dan menemukan lebih dari yang dia minta."</em></p>`;
    text += `<p>Kalimat di bawah foto Niko: <em>"Niko Wardhana. 26. Mewarisi mansion ini dan rahasia yang tertanam di fondasinya."</em></p>`;
    text += `<p><span class="speaker farah">Farah</span> menjerit. Layarnya bertuliskan: <em>"Farah Aldridge. 28. Melindungi rahasia keluarga — tapi tidak bisa melindungi dirinya sendiri."</em></p>`;
    text += `<p>Dan di layar terakhir — layar yang lebih besar dari lainnya — bukan wajah tamu. Wajah yang tidak dikenali siapapun. Pria tua dengan mata tajam dan senyum dingin.</p>`;
    text += `<p>Di bawahnya: <em>"Sang Penenun. Arsitektur malam ini adalah mahakaryanya. Setiap simpul yang terputus adalah seni. Dan malam ini, dia menyelesaikan koleksinya."</em></p>`;
    text += `<p>Layar-layar berkedip. Lalu visual berubah — menjadi rekaman CCTV. Live. Dari setiap ruangan di mansion ini. Ruang makan, dapur, koridor, kamar-kamar di lantai dua...</p>`;
    text += `<p>Dan satu feed — dari ruangan gelap yang belum pernah kau lihat — menunjukkan sebuah meja dengan sepuluh boneka kayu kecil. Masing-masing mewakili kalian.</p>`;
    text += `<p>Tangan bersarung tangan hitam masuk ke frame. Mengangkat satu boneka. Mematahkannya.</p>`;
    text += `<p>Speaker: <em>"Karya pertama dimulai. Simpul pertama: Keberanian atau Kesetiaan? Pilihlah."</em></p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: '"Kita harus tetap bersama. Siapapun yang berpencar jadi target."',
      next: 'ch1_first_event',
      effect: (s) => {
        s.flags.stayTogether = true;
        s.moralScore += 5;
      }
    },
    {
      text: '"Sera, analisis — siapa wajah di layar terakhir? Sang Penenun?"',
      next: 'ch1_sera_analysis',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 5);
      }
    },
    {
      text: '"Niko — ruangan dengan boneka itu. Kau tahu di mana itu?"',
      next: 'ch1_niko_room',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 3);
      }
    }
  ]
},

'ch1_sera_analysis': {
  text: `<p><span class="speaker sera">Sera</span> memperhatikan layar dengan mata yang bergerak cepat.</p>
<p>"Pria di foto itu... usianya sekitar 60-70 tahun. Ekspresi yang dikontrol — bukan senyum natural, itu contempt microexpression. Seseorang yang merasa superior. Dan matanya..." dia melepas kacamata, "...aku pernah lihat mata itu."</p>
<p>"Di mana?"</p>
<p>"Foto di ruang kerja lantai dua. Foto keluarga Wardhana. Pria itu... mungkin generasi sebelum Niko."</p>
<p><span class="speaker niko">Niko</span> memucat. "Itu... itu kakekku. Kakek yang meninggal tahun lalu."</p>
<p>"Tapi dia menyebut diri 'Sang Penenun'," kata Sera pelan. "Niko — apakah kakekmu benar-benar meninggal?"</p>
<p>Pertanyaan itu menggantung di udara seperti pisau.</p>`,
  choices: [
    {
      text: '"Niko, ceritakan semuanya tentang kakekmu. Sekarang."',
      next: 'ch1_niko_grandfather',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -5);
        Engine.modAwareness('arin', 10);
        s.flags.demandedNikoTruth = true;
      }
    },
    {
      text: "Tinggalkan pertanyaan itu — fokus ke event yang dimulai",
      next: 'ch1_first_event',
      effect: (s) => {
        s.flags.postponedNikoQuestion = true;
      }
    }
  ]
},

'ch1_niko_grandfather': {
  text: `<p><span class="speaker niko">Niko</span> menelan ludah. Untuk pertama kalinya, topeng karismatiknya retak.</p>
<p>"Kakekku — Hendarto Wardhana — meninggal tahun lalu. Resmi: serangan jantung. Tapi..."</p>
<p>Dia mengeluarkan ponselnya, membuka foto. Menunjukkan surat wasiat.</p>
<p>"Wasiatnya bilang: 'Kembalikan apa yang kita ambil. Undang mereka yang terikat. Biarkan simpul terakhir menentukan.' Aku pikir dia bicara tentang properti ini — warisan keluarga."</p>
<p>"Tapi sekarang..." Niko menatap layar dengan foto kakeknya, "...sekarang aku tidak yakin dia benar-benar mati."</p>
<p><span class="speaker reza">Reza</span> angkat bicara dari belakang. "Aku cek. Aku bisa verifikasi sertifikat kematian kalau ada signal."</p>
<p><span class="speaker kira">Kira</span>: "Nggak ada sinyal. Tapi aku bisa cari di server lokal — kalau ada data, aku temukan."</p>
<p>Speaker di galeri berbunyi lagi:</p>
<p class="journal"><em>"Waktu berjalan. Simpul pertama menunggu di Ruang Musik. Dua orang harus masuk. Yang lain menunggu. Pintu Ruang Musik akan terkunci selama sepuluh menit. Pilihlah dengan bijak siapa yang kau kirim ke dalam."</em></p>`,
  choices: [
    {
      text: "Aku dan Reza — pengalaman investigasi",
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_reza';
        Engine.modTrust('arin', 'reza', 8);
      }
    },
    {
      text: "Aku dan Juno — aku percaya instingnya",
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_juno';
        Engine.modTrust('arin', 'juno', 8);
      }
    },
    {
      text: "Kirim Niko dan Farah — mereka yang punya koneksi dengan mansion",
      next: 'ch1_music_room_others',
      effect: (s) => {
        s.flags.musicRoomTeam = 'niko_farah';
      }
    },
    {
      text: "Aku masuk sendirian",
      danger: true,
      next: 'ch1_music_room_solo',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_solo';
        s.courage.arin += 15;
        Engine.modDanger(5);
      }
    }
  ]
},

'ch1_niko_room': {
  text: `<p><span class="speaker niko">Niko</span> memperhatikan feed CCTV yang menunjukkan ruangan boneka.</p>
<p>"Itu... itu ruang kerja kakekku. Lantai tiga." Suaranya kering. "Seharusnya terkunci. Aku sendiri yang kunci."</p>
<p>"Siapa lagi yang punya akses?"</p>
<p>"Tidak ada!" Niko mengusap wajahnya. "Kunci fisik cuma ada dua — satu padaku, satu di safe deposit box notaris kakek."</p>
<p><span class="speaker farah">Farah</span> berbisik, cukup keras: "Atau orang yang mencuri kunci dari notaris."</p>
<p>Niko dan Farah bertatapan — ada sejarah di sana yang belum kau pahami.</p>
<p>Speaker berbunyi:</p>
<p class="journal"><em>"Simpul pertama menunggu di Ruang Musik. Dua orang harus masuk. Pintu terkunci sepuluh menit. Siapa yang berani?"</em></p>`,
  choices: [
    {
      text: "Aku masuk ke Ruang Musik — aku tidak bisa minta orang lain mengambil risiko",
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_reza';
        s.moralScore += 5;
      }
    },
    {
      text: "Rapat cepat — tentukan siapa yang masuk berdasarkan kemampuan",
      next: 'ch1_first_event',
      effect: (s) => {
        s.flags.strategicApproach = true;
      }
    }
  ]
},

'ch1_first_event': {
  text: `<p>Kelompok berkumpul. Ketegangan bisa diraba.</p>
<p><span class="speaker reza">Reza</span>: "Dua orang masuk ke ruangan terkunci selama sepuluh menit? Itu setup klasik. Pisahkan kelompok."</p>
<p><span class="speaker lana">Lana</span>: "Atau itu tes. Siapa yang cukup berani — atau cukup bodoh — untuk masuk."</p>
<p><span class="speaker juno">Juno</span>: "Gue masuk."</p>
<p>Semua menoleh.</p>
<p>"Gue serius. Gue nggak mau duduk di sini nunggu giliran. Mending gue yang jemput masalahnya."</p>
<p><span class="speaker dimas">Dimas</span>: "Aku bisa ikut. Kalau ada yang terluka, aku bisa bantu secara medis."</p>
<p><span class="speaker sera">Sera</span> menggeleng pelan padamu. Matanya berkata: <em>jangan biarkan Dimas masuk berdua dengan Juno.</em></p>`,
  choices: [
    {
      text: '"Aku yang ikut Juno. Kita partner lama."',
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_juno';
        Engine.modTrust('arin', 'juno', 10);
        s.keyChoices.push('partnered_juno');
      }
    },
    {
      text: '"Biarkan Juno dan Dimas masuk. Aku akan monitor dari luar."',
      next: 'ch1_music_room_others',
      condition: (s) => !s.flags.seraAlliance,
      effect: (s) => {
        s.flags.musicRoomTeam = 'juno_dimas';
      }
    },
    {
      text: '"Reza, kau yang paling berpengalaman. Kau dan aku."',
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_reza';
        Engine.modTrust('arin', 'reza', 8);
      }
    },
    {
      text: "Ikuti saran Sera — jangan biarkan Dimas masuk tanpa pengawasan",
      condition: (s) => s.flags.seraAlliance || s.flags.dismissedSera === false,
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_juno';
        Engine.modTrust('arin', 'sera', 5);
        Engine.modSuspicion('dimas', 5);
      }
    }
  ]
},

'ch1_music_room': {
  chapter: 1,
  text: (s) => {
    const partner = s.flags.musicRoomTeam === 'arin_reza' ? 'Reza' : 'Juno';
    const partnerKey = partner.toLowerCase();

    let text = `<p>Kau dan <span class="speaker ${partnerKey}">${partner}</span> melangkah masuk ke Ruang Musik. Pintu berdebam tertutup di belakang kalian. Klik kunci magnetik. Sepuluh menit dimulai.</p>`;
    text += `<p>Ruangan ini dulunya elegan — piano grand di sudut, rak-rak vinil, poster konser klasik. Tapi sekarang, ruangan ini telah diubah.</p>`;
    text += `<p>Di tengah ruangan: meja bundar dengan dua kursi. Di atas meja: dua amplop, satu botol wine, dua gelas, dan sebuah jam pasir yang sudah mulai mengalir.</p>`;
    text += `<p>Di dinding, layar menampilkan teks:</p>`;
    text += `<p class="journal"><em>"SIMPUL PERTAMA: KEBERANIAN ATAU KESETIAAN<br>Di dalam dua amplop terdapat rahasia tentang dua orang di luar ruangan ini. Rahasia yang bisa menyelamatkan — atau menghancurkan.<br>ATURAN: Baca kedua amplop. Lalu pilih — BUKA satu rahasia ke seluruh kelompok melalui intercom, atau SIMPAN keduanya.<br>Kalau kalian BUKA: orang yang rahasianya terungkap akan terluka. Tapi kelompok mendapat informasi penting.<br>Kalau kalian SIMPAN: kelompok tetap dalam gelap. Tapi jam pasir terus berjalan. Dan jika habis sebelum kalian memilih — ruangan ini punya kejutan sendiri."</em></p>`;

    text += `<p>Kau membuka amplop pertama:</p>`;

    if (s.difficulty === 1) {
      text += `<p class="journal"><em>"RAHASIA LANA MAHARANI: Novel terbarunya yang belum dipublikasi mengandung deskripsi akurat tentang pembunuhan yang terjadi di mansion ini 3 tahun lalu. Detail yang tidak pernah dipublikasikan polisi. Lana bukan hanya penulis — dia saksi. Atau pelaku."</em></p>`;
    } else if (s.difficulty === 2) {
      text += `<p class="journal"><em>"RAHASIA LANA MAHARANI: Dia dan Dimas telah berkorespondensi selama dua tahun. Dimas memberikan detail autopsi yang 'dimodifikasi' untuk novel-novel Lana. Tapi modifikasi itu bukan fiksi — itu adalah cara menyembunyikan bukti pembunuhan nyata."</em></p>`;
    } else {
      text += `<p class="journal"><em>"RAHASIA KONSPIRASI: Lana, Dimas, dan satu orang lagi di mansion ini telah bekerja sama selama tiga tahun. Lana menulis skenario. Dimas menyediakan metode. Dan orang ketiga... menyediakan lokasi dan korban. Mansion Wardhana adalah panggung mereka."</em></p>`;
    }

    text += `<p>Amplop kedua:</p>`;
    text += `<p class="journal"><em>"RAHASIA FARAH ALDRIDGE: Kakeknya tidak meninggal karena serangan jantung. Farah menemukan bukti bahwa dia dibunuh — dan dia tahu siapa pelakunya. Dia datang malam ini untuk menghancurkan bukti sebelum orang lain menemukannya."</em></p>`;

    text += `<p>Jam pasir terus mengalir. Setengah habis.</p>`;

    if (partner === 'Reza') {
      text += `<p><span class="speaker reza">Reza</span> membaca kedua amplop. Wajahnya mengeras. "Ini informasi dari dalam. Siapapun yang menulis ini punya akses ke file polisi dan data medis."</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> membaca dan menatapmu. "Bro. Ini berat. Kalau kita buka, kita literally hancurin hidup orang."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "BUKA rahasia Lana — kelompok perlu tahu tentang koneksinya dengan pembunuhan",
      danger: true,
      next: 'ch1_reveal_lana',
      effect: (s) => {
        s.flags.revealedLana = true;
        s.moralScore -= 5;
        Engine.modSuspicion('lana', 25);
        Engine.modTrust('arin', 'lana', -20);
        s.keyChoices.push('revealed_lana');
      }
    },
    {
      text: "BUKA rahasia Farah — koneksi dengan kematian kakeknya bisa jadi kunci",
      danger: true,
      next: 'ch1_reveal_farah',
      effect: (s) => {
        s.flags.revealedFarah = true;
        s.moralScore -= 5;
        Engine.modTrust('arin', 'farah', -25);
        s.keyChoices.push('revealed_farah');
      }
    },
    {
      text: "SIMPAN keduanya. Kita tidak berhak menghancurkan privasi orang.",
      next: 'ch1_keep_secrets',
      effect: (s) => {
        s.flags.keptBothSecrets = true;
        s.moralScore += 15;
        s.keyChoices.push('kept_secrets');
      }
    },
    {
      text: "Cari jalan keluar dari ruangan ini — tolak permainan",
      next: 'ch1_reject_game',
      effect: (s) => {
        s.flags.rejectedFirstGame = true;
        s.courage.arin += 10;
      }
    }
  ]
},

'ch1_reveal_lana': {
  text: (s) => {
    let text = `<p>Kau menekan tombol intercom di dinding dan membacakan rahasia Lana ke seluruh mansion.</p>`;
    text += `<p>Dari speaker, kau bisa mendengar reaksi di luar — teriakan terkejut, pertanyaan-pertanyaan yang saling tumpang tindih.</p>`;
    text += `<p>Layar berubah: <em>"Pilihan dibuat. Simpul Keberanian: terikat."</em></p>`;
    text += `<p>Pintu terbuka.</p>`;
    text += `<p>Di luar, <span class="speaker lana">Lana</span> berdiri tepat di depan pintu. Wajahnya — untuk pertama kalinya — menunjukkan emosi mentah. Bukan takut. <em>Kemarahan</em>.</p>`;
    text += `<p>"Kau memilih untuk membuka rahasiaku." Suaranya rendah, terkontrol, seperti pisau bedah. "Oke. Adil. Tapi ingat, Arin — malam ini masih panjang. Dan semua orang punya rahasia."</p>`;
    text += `<p>Dia berbalik dan berjalan pergi. <span class="speaker dimas">Dimas</span> mengikutinya tanpa kata — tapi dia melirik ke arahmu sebelum pergi. Lirikan yang kau tidak bisa terjemahkan.</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker reza">Reza</span> muncul di sampingmu. "Lana dan Dimas pergi bersama. Kalau rahasia itu benar — kita baru saja memberitahu dua orang yang berkonspirasi bahwa kita tahu tentang mereka."</p>`;
      text += `<p>"Itu bisa membuat mereka lebih berbahaya — atau lebih hati-hati."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Ikuti Lana dan Dimas — jangan biarkan mereka sendirian",
      next: 'ch1_follow_lana_dimas',
      effect: (s) => {
        Engine.modDanger(5);
        s.flags.followedLanaDimas = true;
      }
    },
    {
      text: "Kembali ke kelompok utama dan share informasi",
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.regroupedAfterReveal = true;
      }
    }
  ]
},

'ch1_reveal_farah': {
  text: `<p>Kau membacakan rahasia Farah ke intercom.</p>
<p>Pintu terbuka. <span class="speaker farah">Farah</span> sudah menangis — tapi bukan tangisan lemah. Tangisan marah.</p>
<p>"Kau tidak punya hak!" Dia maju ke arahmu. <span class="speaker niko">Niko</span> menahannya. "Kau tidak tahu apa yang keluargaku alami! Kakekku DIBUNUH dan satu-satunya orang yang berusaha mencari keadilan — aku — sekarang terekspos di depan orang-orang yang mungkin termasuk PEMBUNUHNYA!"</p>
<p>Kata-kata terakhir menggema.</p>
<p><span class="speaker reza">Reza</span> maju. "Farah. Siapa yang kau curigai membunuh kakekmu?"</p>
<p>Farah menatap berkeliling — dari Niko, ke Lana, ke Dimas, lalu kembali ke Niko.</p>
<p>"Tanyakan pada TUAN RUMAH kita," desisnya, "kenapa kakeknya dan kakekku meninggal dalam jarak enam bulan. Di tempat yang sama."</p>
<p><span class="speaker niko">Niko</span>: "Farah, aku tidak—"</p>
<p>"JANGAN bohong padaku, Niko. Aku menemukan surat-surat. Kakekmu dan kakekku punya perjanjian — dan salah satu dari mereka mengkhianati yang lain."</p>`,
  shake: true,
  choices: [
    {
      text: '"Farah, Niko — kita semua korban di sini. Berhenti saling menuduh."',
      next: 'ch1_regroup',
      effect: (s) => {
        s.moralScore += 5;
        Engine.modTrust('arin', 'farah', 5);
        Engine.modTrust('arin', 'niko', 3);
      }
    },
    {
      text: '"Niko, jawab. Apa perjanjian antara kakekmu dan kakek Farah?"',
      next: 'ch1_niko_pact',
      effect: (s) => {
        Engine.modAwareness('arin', 10);
        s.flags.askedAboutPact = true;
      }
    }
  ]
},

'ch1_niko_pact': {
  text: `<p><span class="speaker niko">Niko</span> menatap lantai. Lama.</p>
<p>"Aku baru tahu sebulan lalu. Dari dokumen-dokumen kakek."</p>
<p>"Tahun 1973, kakekku dan kakek Farah membangun mansion ini bersama. Selama konstruksi, mereka menemukan sesuatu di bawah tanah — ruangan kuno. Pra-kolonial. Dan di dalamnya..."</p>
<p>Dia menelan ludah.</p>
<p>"Di dalamnya ada artefak. Batu dengan ukiran yang mereka tidak mengerti. Kakekku percaya batu itu punya kekuatan. Kakek Farah ingin menyerahkannya ke universitas. Mereka bertengkar."</p>
<p>"Dan tujuh pekerja konstruksi yang tewas dalam 'kecelakaan'?" tanya Reza dengan suara baja.</p>
<p>Niko tidak menjawab. Jawaban ada di matanya.</p>
<p>"Artefak itu masih di mansion ini?"</p>
<p>"Di lantai tiga. Di ruang kerja kakek. Itu... itu yang ingin aku tunjukkan malam ini. Pameran ini seharusnya tentang mengungkap kebenaran keluargaku — karya seni dokumenter." Suaranya retak. "Aku tidak tahu ada orang lain yang juga punya rencana malam ini."</p>`,
  choices: [
    {
      text: '"Kita harus naik ke lantai 3. Artefak itu mungkin kunci segalanya."',
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.knowsArtifact = true;
        s.flags.wantsFloor3 = true;
        s.keyChoices.push('knows_artifact');
        Engine.modAwareness('arin', 10);
      }
    },
    {
      text: '"Niko, lantai 3 off-limits katamu. Sekarang aku tahu kenapa."',
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.knowsArtifact = true;
        Engine.modTrust('arin', 'niko', -5);
      }
    }
  ]
},

'ch1_keep_secrets': {
  text: (s) => {
    const partner = s.flags.musicRoomTeam === 'arin_reza' ? 'Reza' : 'Juno';
    const partnerKey = partner.toLowerCase();

    let text = `<p>Kau menekan tombol intercom.</p>`;
    text += `<p>"Kami tidak akan membuka rahasia siapapun. Kami menolak bermain."</p>`;
    text += `<p>Hening dari speaker. Lalu:</p>`;
    text += `<p class="journal"><em>"Pilihan yang mulia. Tapi bukan tanpa konsekuensi."</em></p>`;
    text += `<p>Jam pasir habis. Lampu di ruangan mati. Dalam kegelapan, kau mendengar suara mekanis — sesuatu bergerak di dinding. Di lantai.</p>`;

    if (partner === 'Reza') {
      text += `<p><span class="speaker reza">Reza</span> menarikmu ke sudut. "Merunduk!"</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> mendorongmu ke tanah. "Tiarap!"</p>`;
    }

    text += `<p>Semprotan — cairan dari nozzle tersembunyi di dinding. Bukan air. Cat. Merah. Menutup kalian berdua dari kepala sampai kaki.</p>`;
    text += `<p>Lampu menyala. Pintu terbuka.</p>`;
    text += `<p>Kalian keluar — berlumuran cat merah. Terlihat seperti keluar dari film horor.</p>`;
    text += `<p><span class="speaker sera">Sera</span> berlari menghampiri. "Kalian baik-baik saja?!"</p>`;
    text += `<p>"Cat," katamu, mengusap wajah. "Hanya cat."</p>`;
    text += `<p>Tapi pesan dari "Sang Penenun" sudah jelas: menolak bermain punya harga.</p>`;

    text += `<p>Layar di galeri menampilkan teks baru:</p>`;
    text += `<p class="journal"><em>"Simpul pertama: Rahmat. Keberanian menolak selalu punya harga. Tapi kesetiaan kepada prinsip... itu seni tersendiri. Countdown: 05:00:00."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Kumpulkan kelompok — kita perlu strategi untuk event selanjutnya",
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.paintedButIntact = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch1_reject_game': {
  text: (s) => {
    const partner = s.flags.musicRoomTeam === 'arin_reza' ? 'Reza' : 'Juno';

    let text = `<p>Kau melihat ke sekeliling ruangan. Piano grand. Rak vinil. Dinding kayu. Ada yang tidak beres — dinding belakang terdengar hollow saat kau ketuk.</p>`;
    text += `<p>"Panel palsu," katamu. Kau menekan, mendorong — dan panel bergeser, menampilkan lorong sempit yang gelap.</p>`;
    text += `<p>Lorong itu mengarah ke... koridor servis. Jalur pelayan dari era mansion dibangun.</p>`;
    text += `<p>Pintu di ujung lorong terbuka ke dapur belakang. Kau dan ${partner} keluar — melewati permainan sepenuhnya.</p>`;
    text += `<p>Speaker berderak: <em>"Menarik. Pemain yang menolak aturan. Sang Penenun menghargai kreativitas. Tapi ingat — keluar dari satu permainan berarti masuk ke permainan yang lain."</em></p>`;
    text += `<p>Di dapur, kau menemukan sesuatu yang tidak terlihat dari hall — sebuah papan putih besar yang ditempel di dinding, tersembunyi di balik rak. Di atasnya: diagram lengkap mansion — setiap ruangan, setiap lorong, termasuk jalur-jalur tersembunyi.</p>`;
    text += `<p>Dan di pojok kanan bawah diagram: tulisan tangan: <em>"Kontrol utama: Basement B-2. Akses melalui wine cellar."</em></p>`;

    return text;
  },
  choices: [
    {
      text: "Foto diagram ini. Ini peta yang kita butuhkan.",
      next: 'ch1_regroup',
      effect: (s) => {
        s.items.push('mansion_map');
        s.cluesFound += 2;
        Engine.modAwareness('arin', 15);
        s.flags.hasMansionMap = true;
        s.keyChoices.push('found_map');
      }
    }
  ]
},

'ch1_music_room_others': {
  text: (s) => {
    let team = s.flags.musicRoomTeam;
    let text = '';

    if (team === 'niko_farah') {
      text += `<p><span class="speaker niko">Niko</span> dan <span class="speaker farah">Farah</span> masuk ke Ruang Musik. Pintu tertutup.</p>`;
      text += `<p>Sepuluh menit yang menegangkan. Kau bisa mendengar suara-suara samar dari dalam — perdebatan.</p>`;
      text += `<p>Pintu terbuka. Niko keluar dengan wajah pucat. Farah di belakangnya, matanya merah.</p>`;
      text += `<p>"Apa yang terjadi di dalam?"</p>`;
      text += `<p>Niko: "Mereka memberi kami pilihan. Kami... kami memilih untuk tidak bicara."</p>`;
      text += `<p>Farah menatapmu. "Untuk sekarang," tambahnya. "Tapi ada hal-hal yang harus kalian semua tahu. Nanti."</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> dan <span class="speaker dimas">Dimas</span> masuk ke Ruang Musik.</p>`;
      text += `<p>Sepuluh menit. Tidak ada suara dari dalam — hening total.</p>`;
      text += `<p>Pintu terbuka. Juno keluar, ekspresinya keras seperti batu. Dimas di belakangnya, tersenyum.</p>`;
      text += `<p><span class="speaker juno">Juno</span>: "Gue perlu ngomong sama lu, Arin. Sekarang."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> berjalan santai ke arah Lana. Mereka berbisik.</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Kumpulkan semua orang dan bahas apa yang terjadi",
      next: 'ch1_regroup',
      effect: (s) => {
        if (s.flags.musicRoomTeam === 'juno_dimas') {
          s.flags.junoWantsToTalk = true;
        }
      }
    }
  ]
},

'ch1_music_room_solo': {
  text: `<p>Kau masuk sendirian. Pintu berdebam tertutup.</p>
<p>Ruangan yang sama — meja, kursi, amplop, jam pasir. Tapi karena kau sendirian, ada tambahan: sebuah layar yang menampilkan feed CCTV dari hall di mana yang lain menunggu.</p>
<p>Kau bisa melihat mereka. <span class="speaker sera">Sera</span> mondar-mandir. <span class="speaker reza">Reza</span> berjaga di pintu. <span class="speaker lana">Lana</span> berbicara dengan <span class="speaker dimas">Dimas</span> di sudut — percakapan yang intens.</p>
<p>Kau membaca kedua amplop. Rahasia Lana. Rahasia Farah.</p>
<p>Dan ada bonus — amplop ketiga, yang hanya muncul kalau masuk sendirian:</p>
<p class="journal"><em>"BONUS UNTUK YANG BERANI: Sang Penenun bukan orang luar. Sang Penenun duduk bersama kalian malam ini. Dan dia sudah mulai bergerak."</em></p>
<p>Jam pasir hampir habis.</p>`,
  shake: true,
  choices: [
    {
      text: "BUKA rahasia Lana ke intercom",
      danger: true,
      next: 'ch1_reveal_lana',
      effect: (s) => {
        s.flags.revealedLana = true;
        s.flags.hasBonusClue = true;
        Engine.modSuspicion('lana', 25);
        s.moralScore -= 5;
        s.cluesFound++;
        s.keyChoices.push('revealed_lana');
      }
    },
    {
      text: "SIMPAN semua. Kau punya info yang lebih berharga kalau disimpan.",
      next: 'ch1_keep_secrets',
      effect: (s) => {
        s.flags.keptBothSecrets = true;
        s.flags.hasBonusClue = true;
        s.moralScore += 10;
        s.cluesFound++;
        s.keyChoices.push('kept_secrets_solo');
      }
    }
  ]
},

'ch1_stay_hall': {
  text: `<p>Kau memutuskan untuk tetap di hall. Beberapa orang mengikutimu — <span class="speaker sera">Sera</span>, <span class="speaker farah">Farah</span>, dan <span class="speaker kira">Kira</span>.</p>
<p>Yang lain pergi ke Galeri Timur: Niko, Lana, Dimas, Juno, dan setelah ragu-ragu, Reza.</p>
<p><span class="speaker vira">Vira</span> tidak pergi kemana pun. Dia duduk di salah satu kursi di lingkaran, membuka amplopnya, membaca, dan menaruhnya kembali dengan ekspresi netral.</p>
<p>Kau menggunakan waktu ini untuk mempersiapkan:</p>
<p><span class="speaker kira">Kira</span> menemukan panel elektrikal tersembunyi di balik lukisan — dan mulai reverse-engineering sistem kunci.</p>
<p><span class="speaker sera">Sera</span> memetakan reaksi semua orang sejak awal — membuat profil psikologis kasar.</p>
<p><span class="speaker farah">Farah</span> mengunci dirinya di kamar mandi. Suara isakan samar merembes melalui pintu.</p>
<p>Dari arah Galeri Timur, kau mendengar teriakan — lalu keheningan. Lima menit kemudian, kelompok lain kembali. Wajah-wajah pucat.</p>
<p><span class="speaker juno">Juno</span> langsung menghampirimu. "Arin — mereka disuruh pilih siapa yang masuk ke Ruang Musik. Dan nggak ada yang mau."</p>`,
  choices: [
    {
      text: '"Aku yang masuk. Biar aku yang hadapi."',
      next: 'ch1_music_room',
      effect: (s) => {
        s.flags.musicRoomTeam = 'arin_juno';
        s.moralScore += 10;
        s.courage.arin += 10;
      }
    },
    {
      text: '"Kira, bisa kau override kunci ruangan itu supaya tidak ada yang perlu masuk?"',
      next: 'ch1_kira_override',
      effect: (s) => {
        s.flags.kiraOverride = true;
        Engine.modTrust('arin', 'kira', 8);
      }
    }
  ]
},

'ch1_kira_override': {
  text: `<p><span class="speaker kira">Kira</span> menghubungkan laptopnya ke panel elektrikal.</p>
<p>"Aku bisa bypass kunci satu ruangan — tapi itu akan trigger alert di server utama. Sang Penenun akan tahu aku hacking sistemnya."</p>
<p>"Lakukan."</p>
<p>Jari-jari Kira menari. Tiga menit ketegangan murni. Kode, terminal, progress bar yang bergerak terlalu lambat.</p>
<p>"Got it." Klik. "Ruang Musik terbuka. Dan—" matanya melebar, "—aku juga nemu sesuatu. Log server. Ada dua admin account di sistem ini. Satu milik Niko — 'ADMIN_NW'. Dan satu lagi..."</p>
<p>"Siapa?"</p>
<p>"'PENENUN'. Aktif terakhir... lima menit yang lalu."</p>
<p>Dari speaker: <em>"Kira Chen. Kau memilih jalan pintas. Sang Penenun menghargai kecerdasan — tapi menghukum ketidaksabaran. Countdown dipercepat satu jam."</em></p>
<p>Timer di layar galeri: <strong>04:00:00</strong>. Satu jam hilang.</p>`,
  shake: true,
  choices: [
    {
      text: '"Worth it. Kira, terus tracking account Penenun itu."',
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modDanger(15);
        s.flags.kiraTracking = true;
        s.cluesFound += 2;
        s.keyChoices.push('kira_hack');
      }
    },
    {
      text: '"Matikan. Jangan provokasi lagi — kita tidak tahu apa lagi yang bisa dia lakukan."',
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modDanger(8);
        s.flags.stoppedKira = true;
      }
    }
  ]
},

'ch1_explore_floor2': {
  text: `<p>Sementara semua orang fokus ke Galeri Timur, kau diam-diam naik ke lantai dua.</p>
<p>Koridor panjang, gelap kecuali lampu darurat hijau di sepanjang skirting. Enam pintu — empat kamar tamu, satu kamar mandi, dan satu ruang yang pintunya berbeda: lebih tebal, dengan papan nama kuningan: "ARSIP".</p>
<p>Kau mencoba ruang arsip. Terkunci — tapi kunci fisik, bukan elektromagnetik. Lockpick sederhana dengan hairpin.</p>
<p>Di dalam: rak-rak file dari lantai ke langit-langit. Dokumen, foto, rekaman — puluhan tahun sejarah mansion ini.</p>
<p>Kau menarik folder acak: "Acara Tahunan 2022". Di dalamnya: daftar tamu (sepuluh nama), jadwal acara, dan... foto. Polaroid. Sepuluh orang duduk di meja makan. Tersenyum.</p>
<p>Di pojok foto, tulisan tangan: "Foto terakhir." Kau membalik. Di belakang: "8 pulang. 2 tinggal."</p>
<p>Folder lain: "2021". Sepuluh nama berbeda. "7 pulang. 3 tinggal."</p>
<p>2020: "8 pulang. 2 tinggal."</p>
<p>Pola yang jelas. Setiap tahun: sepuluh masuk, beberapa "tinggal".</p>
<p>Dan di folder paling bawah rak — "2019" — kau menemukan foto yang membuatmu berhenti bernapas. Salah satu dari sepuluh tamu di foto 2019 — tersenyum, muda, penuh kehidupan — adalah <span class="speaker vira">Vira</span>.</p>
<p>Tapi Vira menghilang enam bulan lalu. Bukan tiga tahun lalu. Kecuali...</p>
<p>Kecuali dia sudah pernah diundang sebelumnya. Dan dia selamat.</p>`,
  shake: true,
  choices: [
    {
      text: "Ambil semua folder — ini bukti krusial",
      next: 'ch1_regroup',
      effect: (s) => {
        s.items.push('archive_folders');
        s.cluesFound += 3;
        Engine.modAwareness('arin', 20);
        s.flags.hasArchiveFolders = true;
        s.flags.knowsViraPastVisit = true;
        s.keyChoices.push('found_archives');
      }
    },
    {
      text: "Foto semua dan taruh kembali — jangan biarkan siapapun tahu kau menemukan ini",
      next: 'ch1_regroup',
      effect: (s) => {
        s.items.push('archive_photos');
        s.cluesFound += 2;
        Engine.modAwareness('arin', 15);
        s.flags.hasArchivePhotos = true;
        s.flags.knowsViraPastVisit = true;
      }
    }
  ]
},

'ch1_basement': {
  text: `<p>Kau dan <span class="speaker reza">Reza</span> turun ke basement. Tangga sempit, beton dingin, bau kelembaban dan mesin.</p>
<p>Basement terbagi dua: B-1 adalah wine cellar — rak-rak botol berdebu yang membentang seperti labirin kecil. B-2 ada di balik pintu baja di ujung wine cellar.</p>
<p>Reza mencoba pintu baja. Terkunci elektronik.</p>
<p>"Tapi lihat ini." Dia menunjuk ke bawah pintu. Cahaya biru berkedip dari celah. "Server di dalam sana."</p>
<p>Di wine cellar, kau menemukan meja kerja kecil yang tersembunyi di antara rak botol. Di atasnya: laptop tua, kabel-kabel, dan notes bertulisan tangan.</p>
<p>Notes itu berisi jadwal — tanggal-tanggal, nama-nama, dan kode: "SMP-1", "SMP-2"... sampai "SMP-7". Di samping setiap kode: nama dua atau tiga orang dengan tanda centang. Dan di samping tanda centang: "Terselesaikan".</p>
<p>"SMP" — Simpul.</p>
<p>Dan di bagian bawah: "SMP-8" — tanggal hari ini. Sepuluh nama. Nama kalian semua. Tiga nama yang dilingkari merah.</p>
<p>Reza dan kau membaca tiga nama itu bersamaan.</p>`,
  shake: true,
  choices: [
    {
      text: "Siapa tiga nama yang dilingkari?",
      next: 'ch1_three_names',
      effect: (s) => {
        s.cluesFound += 2;
        Engine.modAwareness('arin', 15);
        s.flags.foundTargetList = true;
      }
    }
  ]
},

'ch1_three_names': {
  text: (s) => {
    let text = `<p>Tiga nama dilingkari merah:</p>`;
    if (s.difficulty === 1) {
      text += `<p><strong>Reza Hartono. Farah Aldridge. Kira Chen.</strong></p>`;
      text += `<p><span class="speaker reza">Reza</span> menatap namanya sendiri. Wajahnya mengeras tapi tidak terkejut.</p>`;
      text += `<p>"Aku sudah curiga. Targetnya adalah orang-orang yang bisa mengungkap Sang Penenun. Aku — ex-detektif. Kira — hacker. Farah — yang punya akses ke bukti lama."</p>`;
    } else if (s.difficulty === 2) {
      text += `<p><strong>Reza Hartono. Vira Deviani. Arin Prasetya.</strong></p>`;
      text += `<p>Namamu. Namamu ada di daftar target.</p>`;
      text += `<p><span class="speaker reza">Reza</span> menatapmu. "Kita berdua di daftar. Berarti kita ancaman bagi Sang Penenun."</p>`;
      text += `<p>"Dan Vira?"</p>`;
      text += `<p>"Vira tahu terlalu banyak. Dia satu-satunya yang pernah selamat dari acara sebelumnya."</p>`;
    } else {
      text += `<p><strong>Arin Prasetya. Sera Amalina. Kira Chen.</strong></p>`;
      text += `<p>Kau, Sera, dan Kira. Tiga orang yang paling mampu mengungkap kebenaran.</p>`;
      text += `<p><span class="speaker reza">Reza</span>: "Analitis, psikolog, hacker. Mereka mengincar otak operasi kalian. Ini bukan random — ini surgical."</p>`;
    }

    text += `<p>Di bawah daftar, catatan terakhir: <em>"Simpul harus diselesaikan sebelum fajar. Jika gagal — semua simpul terputus."</em></p>`;
    text += `<p>Suara langkah di atas. Seseorang turun ke basement.</p>`;

    return text;
  },
  choices: [
    {
      text: "Sembunyi dan lihat siapa yang datang",
      next: 'ch1_basement_visitor',
      effect: (s) => {
        Engine.modAwareness('arin', 8);
        s.flags.hidInBasement = true;
      }
    },
    {
      text: "Naik dan konfrontasi — siapa yang mengikuti kalian?",
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.confrontedFollower = true;
      }
    }
  ]
},

'ch1_basement_visitor': {
  text: (s) => {
    let text = `<p>Kalian bersembunyi di balik rak wine. Langkah kaki mendekat. Pelan, hati-hati, seperti orang yang tidak ingin terdengar.</p>`;

    if (s.difficulty >= 2) {
      text += `<p>Dua pasang kaki. Dua orang.</p>`;
      text += `<p><span class="speaker lana">Lana</span> dan <span class="speaker dimas">Dimas</span> muncul dari tangga. Lana berjalan langsung ke meja kerja — dia tahu meja itu ada di sana. Dimas berjaga di tangga.</p>`;
      text += `<p>Lana membuka laptop tua itu. Jarinya mengetik password tanpa ragu — dia TAHU passwordnya.</p>`;
      text += `<p>"Data masih utuh," bisik Lana ke Dimas. "Tapi ada yang mengakses notes SMP-8. Seseorang sudah di sini sebelum kita."</p>`;
      text += `<p>Dimas: "Siapa?"</p>`;
      text += `<p>"Tidak tahu. Tapi kita harus percepat timeline. Sebelum mereka menemukan B-2."</p>`;
      text += `<p>Mereka pergi secepat datang.</p>`;
      text += `<p><span class="speaker reza">Reza</span> menatapmu dalam kegelapan. "Lana tahu password. Lana tahu layout. Lana bukan tamu — dia bagian dari ini."</p>`;
    } else {
      text += `<p><span class="speaker dimas">Dimas</span> muncul sendirian. Dia berjalan ke meja kerja, membuka laci, dan mengeluarkan sesuatu — botol kecil tanpa label, dimasukkan ke saku jas.</p>`;
      text += `<p>Dia pergi tanpa menyentuh hal lain.</p>`;
      text += `<p><span class="speaker reza">Reza</span>: "Botol tanpa label, disembunyikan di basement. Itu bukan obat OTC."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Naik kembali. Kita punya informasi vital.",
      next: 'ch1_regroup',
      effect: (s) => {
        s.cluesFound += 2;
        Engine.modAwareness('arin', 12);
        if (s.difficulty >= 2) {
          Engine.modSuspicion('lana', 20);
          Engine.modSuspicion('dimas', 15);
          s.flags.sawLanaInBasement = true;
        } else {
          Engine.modSuspicion('dimas', 15);
          s.flags.sawDimasBottle = true;
        }
        s.keyChoices.push('basement_spy');
      }
    }
  ]
},

'ch1_follow_lana_dimas': {
  text: `<p>Kau mengikuti <span class="speaker lana">Lana</span> dan <span class="speaker dimas">Dimas</span> dari jarak aman. Mereka berjalan ke sayap barat — menuju perpustakaan.</p>
<p>Di perpustakaan, mereka bicara dengan suara rendah. Kau bersembunyi di balik rak buku.</p>
<p><span class="speaker lana">Lana</span>: "Mereka tahu tentang novel. Itu bisa membahayakan timeline kita."</p>
<p><span class="speaker dimas">Dimas</span>: "Apa yang kau sarankan?"</p>
<p>"Percepat. Event kedua sudah dijadwalkan untuk jam satu. Kita butuh — kita butuh memastikan target pertama terisolasi sebelum itu."</p>
<p>"Dan kalau mereka berpencar?"</p>
<p>"Justru itu yang kita mau." Lana tersenyum. Senyum yang kau kenali dari foto penulisnya. "Kelompok yang utuh sulit dipecahkan. Tapi kelompok yang sudah saling curiga..."</p>
<p>"...akan menyingkirkan diri mereka sendiri," selesai Dimas.</p>
<p>Mereka bertukar pandang. Lalu berpisah ke arah yang berbeda.</p>
<p>Kau diam di balik rak buku. Jantungmu memompa keras. Mereka bukan tamu. Mereka operator.</p>`,
  choices: [
    {
      text: "Kembali ke kelompok — bagikan apa yang kau dengar",
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.heardLanaDimasPlan = true;
        s.cluesFound += 2;
        Engine.modSuspicion('lana', 20);
        Engine.modSuspicion('dimas', 20);
        Engine.modAwareness('arin', 15);
        s.keyChoices.push('overheard_killers');
      }
    },
    {
      text: "Ikuti Dimas — dia lebih berbahaya sendirian",
      danger: true,
      next: 'ch1_follow_dimas_solo',
      effect: (s) => {
        Engine.modDanger(8);
        s.flags.followedDimas = true;
      }
    }
  ]
},

'ch1_follow_dimas_solo': {
  text: `<p>Kau mengikuti <span class="speaker dimas">Dimas</span> ke arah dapur. Dia membuka tas medisnya di atas counter — di dalamnya bukan hanya P3K biasa. Suntikan, botol-botol kecil, scalpel.</p>
<p>Dimas mengambil satu suntikan dan mengisinya dengan cairan bening dari salah satu botol. Gerakannya presisi, tanpa ragu — ini bukan pertama kalinya.</p>
<p>Dia menyimpan suntikan di saku jasnya. Lalu menuangkan sesuatu ke dalam teko teh yang ada di counter — cairan dari botol kedua.</p>
<p>Kau melihatnya. Dia melihatmu.</p>
<p>Dimas membeku. Satu detik. Dua.</p>
<p>Lalu senyumnya kembali — senyum sopan yang sama.</p>
<p>"Arin. Aku sedang menyiapkan obat tidur herbal. Valerian root. Untuk Farah — dia panik attack." Dia menunjukkan botol berlabel "Valerian Extract".</p>
<p>"Dan suntikan?"</p>
<p>"Epinephrine. Standar P3K untuk reaksi alergi berat." Dia mengangkat bahu. "Aku mahasiswa kedokteran. Aku selalu siap."</p>
<p>Penjelasan yang sempurna. Terlalu sempurna.</p>`,
  choices: [
    {
      text: '"Jangan tuangkan apapun ke teh itu. Atau aku beritahu semua orang."',
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modSuspicion('dimas', 15);
        Engine.modTrust('arin', 'dimas', -15);
        s.flags.stoppedDimasTea = true;
        s.keyChoices.push('stopped_dimas');
      }
    },
    {
      text: "Pura-pura percaya — tapi jangan biarkan siapapun minum dari teko itu",
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modSuspicion('dimas', 10);
        s.flags.watchingDimas = true;
        s.flags.tekoContaminated = true;
      }
    }
  ]
},

'ch1_regroup': {
  chapter: 1,
  text: (s) => {
    let text = `<p>Kelompok berkumpul kembali di hall utama. Wajah-wajah tegang, mata-mata yang bergerak terlalu cepat, jarak-jarak baru yang terbentuk antara orang-orang.</p>`;
    text += `<p>Countdown di layar: <strong>${s.flags.kiraTracking ? '04:00:00' : '05:00:00'}</strong></p>`;

    if (s.flags.revealedLana) {
      text += `<p><span class="speaker lana">Lana</span> duduk di sudut terjauh, terpisah dari kelompok. <span class="speaker dimas">Dimas</span> berdiri di dekatnya seperti bodyguard.</p>`;
    }
    if (s.flags.revealedFarah) {
      text += `<p><span class="speaker farah">Farah</span> menolak bicara pada siapapun kecuali <span class="speaker niko">Niko</span>.</p>`;
    }
    if (s.flags.paintedButIntact) {
      text += `<p>Cat merah di baju dan wajahmu sudah mengering — pengingat visual bahwa menolak bermain punya harga.</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> berdiri di tengah. "Kita butuh rencana. Event berikutnya dalam—"</p>`;
    text += `<p>Speaker berderak: <em>"Event kedua dalam satu jam. Lokasi: Sayap Barat. Tema: Kepercayaan."</em></p>`;
    text += `<p><span class="speaker reza">Reza</span>: "Kita punya satu jam. Bagaimana kita menggunakannnya?"</p>`;

    if (s.flags.heardLanaDimasPlan || s.flags.sawLanaInBasement) {
      text += `<p>Kau menarik Reza dan beberapa orang terpercaya ke samping. "Ada yang harus kalian tahu tentang Lana dan Dimas."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Investigasi lantai 3 — ruang kerja kakek Niko menyimpan jawaban",
      condition: (s) => s.flags.knowsArtifact || s.flags.knowsThirdFloor || s.flags.viraWarning,
      next: 'ch2_start',
      effect: (s) => {
        s.flags.headingToFloor3 = true;
        s.keyChoices.push('investigate_floor3');
      }
    },
    {
      text: "Konfrontasi Lana dan Dimas — mereka bukan tamu biasa",
      condition: (s) => s.flags.heardLanaDimasPlan || s.flags.sawLanaInBasement || s.flags.sawDimasBottle || s.flags.revealedLana,
      danger: true,
      next: 'ch1_confront_killers',
      effect: (s) => {
        s.flags.confrontedKillers = true;
        Engine.modDanger(10);
      }
    },
    {
      text: "Cari jalan keluar alternatif — jendela lantai 2, atap, apapun",
      next: 'ch2_start',
      effect: (s) => {
        s.flags.searchingEscape = true;
        s.keyChoices.push('escape_priority');
      }
    },
    {
      text: "Siapkan kelompok untuk event kedua — kali ini kita siap",
      next: 'ch2_start',
      effect: (s) => {
        s.flags.preparedForEvent2 = true;
      }
    },
    {
      text: "Bicara dengan Vira — dia pernah selamat sebelumnya. Dia tahu caranya.",
      next: 'ch1_vira_survivor',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 5);
      }
    }
  ]
},

'ch1_confront_killers': {
  text: (s) => {
    let text = `<p>Kau berdiri. "Lana. Dimas. Kita perlu bicara."</p>`;
    text += `<p>Sepuluh pasang mata mengarah padamu.</p>`;
    text += `<p><span class="speaker lana">Lana</span> mengangkat alis. "Tentang?"</p>`;

    if (s.flags.heardLanaDimasPlan) {
      text += `<p>"Aku mendengar pembicaraan kalian di perpustakaan. 'Percepat timeline.' 'Isolasi target pertama.' Kalian bukan tamu — kalian bagian dari ini."</p>`;
      text += `<p>Lana menatapmu lama. Lalu tertawa — tawa yang dingin dan kontemporer.</p>`;
      text += `<p>"Kau salah dengar, Arin. Kami membicarakan novel — skenario untuk buku berikutnya. Aku penulis, ingat? Dimas konsultan medis-ku. Kami <em>selalu</em> brainstorm seperti itu."</p>`;
    } else if (s.flags.sawLanaInBasement) {
      text += `<p>"Aku melihatmu di basement. Kau tahu password laptop di sana. Kau tahu layout mansion. Kau bukan tamu, Lana."</p>`;
      text += `<p>Lana tidak berkedip. "Aku riset untuk novel, Arin. Aku sudah ke mansion ini tiga kali untuk research. Tentu aku tahu layoutnya."</p>`;
    }

    text += `<p><span class="speaker dimas">Dimas</span> menambahkan: "Akusasi berat tanpa bukti solid. Itu fitnah."</p>`;
    text += `<p>Mereka solid. Cerita mereka koheren. Dan tanpa bukti fisik, kau terlihat seperti orang paranoid yang menuduh tanpa dasar.</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker sera">Sera</span> angkat bicara. "Aku nggak bisa buktikan apapun. Tapi dari observasi microexpression — Lana tidak menunjukkan tanda-tanda stress dari akusasi ini. Orang yang tidak bersalah akan marah atau takut. Lana... controlled."</p>`;
      text += `<p>"Sera," kata Lana, "itu bukan bukti. Itu pendapat."</p>`;
      text += `<p>"Kau benar," kata Sera. "Tapi aku akan terus memperhatikan."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: '"Oke. Tapi mulai sekarang, Lana dan Dimas tidak boleh sendirian."',
      next: 'ch2_start',
      effect: (s) => {
        s.flags.lanaWatched = true;
        s.flags.dimasWatched = true;
        s.moralScore += 5;
      }
    },
    {
      text: '"Kelompok, mulai sekarang — nobody goes alone. Buddy system."',
      next: 'ch2_start',
      effect: (s) => {
        s.flags.buddySystem = true;
        s.moralScore += 10;
        s.keyChoices.push('buddy_system');
      }
    }
  ]
},

'ch1_vira_survivor': {
  text: `<p>Kau menemukan <span class="speaker vira">Vira</span> di jendela bay di lorong timur, menatap hutan di luar melalui teralis.</p>
<p>"Kau pernah ke sini sebelumnya. 2019. Aku menemukan fotomu di arsip."</p>
<p>Vira tidak menoleh. Refleksinya di kaca — wajah yang terlalu tenang untuk situasi ini.</p>
<p>"2019. Ya." Suaranya datar. "Aku masih muda. Masih percaya bahwa dunia pada dasarnya baik."</p>
<p>"Apa yang terjadi?"</p>
<p>"Sepuluh orang masuk. Delapan keluar." Jeda. "Dua orang yang 'tinggal' — satu ditemukan di hutan tiga bulan kemudian. Yang satu lagi..." dia menoleh padamu, "...tidak pernah ditemukan."</p>
<p>"Dan kau?"</p>
<p>"Aku selamat karena aku melakukan sesuatu yang tidak bisa kumaafkan." Matanya gelap. "Aku memilih untuk mengorbankan orang lain supaya aku bisa keluar. Dan aku hidup dengan itu setiap hari."</p>
<p>"Tapi kau kembali."</p>
<p>"Karena tahun ini targetnya termasuk orang-orang yang aku sayangi. Kau. Sera. Juno." Air matanya jatuh — satu tetes, cepat dihapus. "Aku tidak bisa membiarkan ini terulang."</p>
<p>"Vira — siapa Sang Penenun?"</p>
<p>"Aku tidak pernah melihat wajahnya. Tapi aku tahu satu hal: dia selalu ada di antara tamu. Berpura-pura menjadi salah satu dari kita. Dan dia <em>menikmati</em> menontonnya."</p>`,
  choices: [
    {
      text: '"Bantu aku, Vira. Kita akhiri siklus ini malam ini."',
      next: 'ch2_start',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 15);
        Engine.addAlliance(['arin', 'vira']);
        s.flags.viraAlliance = true;
        s.flags.viraConfessed = true;
        s.keyChoices.push('vira_alliance');
      }
    },
    {
      text: '"Kau mengorbankan orang. Bagaimana aku bisa percaya padamu?"',
      next: 'ch2_start',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', -5);
        s.flags.distrustedVira = true;
        s.flags.viraConfessed = true;
      }
    }
  ]
}

};
