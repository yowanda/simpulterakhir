/* ============================================================
   SIMPUL TERAKHIR — BAB 1: Pameran Maut
   Dialog-focused rewrite. Narasi jadi percakapan.
   ============================================================ */

const STORY_CH1 = {

'ch1_start': {
  chapter: 1,
  text: (s) => {
    let text = '';

    if (s.flags.openedBasement) {
      text += `<p><span class="speaker reza">Reza</span> "Pintu basement terbuka. Generator di bawah. Aku turun duluan — kalau nggak kembali lima menit..."</p>`;
      text += `<p><span class="speaker arin">Arya</span> "Aku ikut."</p>`;
    } else {
      text += `<p class="sound">— speaker tersembunyi berderak hidup. Suara diproses, tanpa gender —</p>`;
      text += `<p class="journal"><em>"Selamat malam, para tamu. Selamat datang di Pameran Simpul Terakhir. Dalam enam jam, pintu akan terbuka. Setiap jam, sebuah 'karya seni' baru akan terungkap. Karya pertama dimulai dalam tiga menit. Silakan menuju Galeri Timur."</em></p>`;
    }

    const pc = s.playerCharacter || 'arin';
    if (pc === 'sera') {
      text += `<p class="journal"><em>Sembilan wajah, sembilan set micro-expression. Setidaknya tiga orang di sini sedang berbohong.</em></p>`;
    } else if (pc === 'lana') {
      text += `<p class="journal"><em>Sempurna. Semuanya berjalan sesuai naskah. Sekarang — bab selanjutnya: ketakutan.</em></p>`;
    } else if (pc === 'reza') {
      text += `<p class="journal"><em>Ini bukan acara seni. Ini crime scene yang belum terjadi.</em></p>`;
    } else if (pc === 'kira') {
      text += `<p class="journal"><em>Speaker pakai protokol encrypted. Dalangnya punya akses ke tech serius.</em></p>`;
    } else if (pc === 'vira') {
      text += `<p class="journal"><em>Suara itu. Diproses, tapi intonasinya sama seperti enam bulan lalu. Dia masih di sini.</em></p>`;
    } else if (pc === 'niko') {
      text += `<p class="journal"><em>Ini bukan rencanamu. Seseorang membajak acaramu.</em></p>`;
    } else if (pc === 'dimas' && s.difficulty >= 2) {
      text += `<p class="journal"><em>Lana mengangguk dari seberang ruangan. Kode: semuanya lancar.</em></p>`;
    }

    if (!Engine.isPlayer('farah')) text += `<p><span class="speaker farah">Farah</span> "Aku tidak mau ke mana-mana."</p>`;
    else text += `<p><span class="speaker farah">Farah</span> "Aku tidak akan jadi yang pertama masuk perangkap."</p>`;

    if (!Engine.isPlayer('lana')) text += `<p><span class="speaker lana">Lana</span> "Aku ingin lihat." Dia berjalan ke arah Galeri Timur.</p>`;
    else text += `<p><span class="speaker lana">Lana</span> "Aku ingin lihat." Kau berjalan ke Galeri Timur.</p>`;

    if (!Engine.isPlayer('dimas')) text += `<p><span class="speaker dimas">Dimas</span> mengikuti Lana tanpa kata.</p>`;
    else text += `<p><span class="speaker dimas">Dimas</span> "Aku ikut Lana."</p>`;

    if (!Engine.isPlayer('juno')) text += `<p><span class="speaker juno">Juno</span> "${Engine.isPlayer('arin') ? 'Arya' : Engine.playerName()}, ini trap yang obvious banget. Kita nggak harus ikut."</p>`;
    else text += `<p><span class="speaker juno">Juno</span> "Ini trap yang obvious banget."</p>`;

    if (!Engine.isPlayer('niko')) text += `<p><span class="speaker niko">Niko</span> "Atau justru di situlah jawabannya."</p>`;
    else text += `<p><span class="speaker niko">Niko</span> "Atau justru di situlah jawabannya."</p>`;

    if (!Engine.isPlayer('kira')) text += `<p><span class="speaker kira">Kai</span> "Gue nge-trace frekuensi audio dari speaker. Kalau dikendalikan remote, gue bisa trace IP-nya."</p>`;
    else text += `<p><span class="speaker kira">Kai</span> "Gue bisa trace IP speaker ini."</p>`;

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
      text = `<p><span class="speaker sera">Sera</span> "Lana — pupil tidak melebar. Contempt microexpression. Dia tidak takut. Dia <em>menikmati</em> ini."</p>`;
      text += `<p><span class="speaker sera">Sera</span> "Dimas — detak jantung normal. Tidak ada fight-or-flight. Terlalu tenang untuk mahasiswa."</p>`;
      text += `<p class="journal"><em>Dua orang yang tidak takut. Profil predator.</em></p>`;
    } else if (pc === 'kira') {
      text = `<p><span class="speaker kira">Kai</span> "Speaker system pakai ZigBee. Gue trace dalam 30 detik."</p>`;
      text += `<p><span class="speaker kira">Kai</span> "Source: device di sublevel B-2. Bawah. Dan ada 4 kamera tersembunyi di jaringan."</p>`;
      text += `<p class="journal"><em>Network map lengkap. Empat kamera. Satu controller di basement. Encrypted channel belum di-crack.</em></p>`;
    } else if (pc === 'lana') {
      text = `<p><span class="speaker lana">Lana</span> "Layar ketiga dari kiri — itu bukan bagian dari naskahku. Seseorang menambahkan konten tanpa sepengetahuanku."</p>`;
      text += `<p class="journal"><em>Sang Penenun mengubah naskahmu. Kau bukan satu-satunya dalang.</em></p>`;
    } else if (pc === 'niko') {
      text = `<p><span class="speaker niko">Niko</span> "Lukisan kakek... panel rahasia di belakangnya. Aku sudah tahu dari kecil."</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Jurnal kakek. Tulisan tangan. Dan daftar nama — sepuluh nama. Namaku ada di sana."</p>`;
      text += `<p class="journal"><em>Kakekmu merencanakan ini. Kau — cucunya — bagian dari permainan.</em></p>`;
    } else if (pc === 'vira') {
      text = `<p><span class="speaker vira">Vira</span> "Lorong servis di balik dinding timur. Aku menemukannya enam bulan lalu, saat lari."</p>`;
      text += `<p><span class="speaker vira">Vira</span> "Dari observasi ini aku bisa lihat ke Galeri Timur tanpa terlihat. Dan aku lihat Dimas mengambil syringe dari kantong. Disembunyikan di jas."</p>`;
      text += `<p class="journal"><em>Dimas membawa syringe. Bukan untuk pertolongan pertama.</em></p>`;
    } else if (pc === 'reza') {
      text = `<p><span class="speaker reza">Reza</span> "Assessment perimeter selesai. Semua jendela lantai 1 dikunci dari luar dengan baut. Pintu utama: deadbolt elektronik. Pintu belakang dapur: dilas."</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Ini bukan mansion. Ini penjara."</p>`;
      text += `<p class="journal"><em>Zero exit points kecuali pintu utama. Siapapun desainernya, dia tidak mau ada yang keluar.</em></p>`;
    } else if (pc === 'farah') {
      text = `<p><span class="speaker farah">Farah</span> "Safe room kakek. Sayap utara lantai 2. Aku tahu kodenya."</p>`;
      text += `<p><span class="speaker farah">Farah</span> "Tapi ada yang sudah pakai — selimut, botol air, dan monitor yang menampilkan feed empat kamera tersembunyi."</p>`;
      text += `<p class="journal"><em>Seseorang menggunakan safe room keluargamu sebagai pusat kontrol.</em></p>`;
    } else {
      text = `<p class="journal"><em>Clue baru ditemukan dari investigasi mansion.</em></p>`;
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
    let text = `<p class="sound">— Galeri Timur. Lorong panjang, langit-langit kaca. Layar LCD di sepanjang dinding. —</p>`;

    if (s.flags.calledJuno || s.flags.warnedJunoAboutVira) {
      text += `<p><span class="speaker juno">Juno</span> "Gue cover belakang."</p>`;
    }

    text += `<p class="sound">— tepat pukul 22:00. Layar menyala serentak. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Setiap layar menampilkan wajah kita. Foto close-up, resolusi tinggi, diambil tanpa sepengetahuan kita."</p>`;
    text += `<p class="journal"><em>"Arya Prasetya. 24. Mencari kebenaran tentang kematian sumbernya — dan menemukan lebih dari yang dia minta."</em></p>`;
    text += `<p class="journal"><em>"Niko Wardhana. 26. Mewarisi mansion ini dan rahasia di fondasinya."</em></p>`;
    text += `<p><span class="speaker farah">Farah</span> "TIDAK!" Layarnya: <em>"Farah Aldridge. 28. Melindungi rahasia keluarga — tapi tidak bisa melindungi dirinya sendiri."</em></p>`;
    text += `<p><span class="speaker arin">Arya</span> "Layar terakhir — lebih besar. Bukan wajah tamu. Pria tua, mata tajam, senyum dingin."</p>`;
    text += `<p class="journal"><em>"Sang Penenun. Arsitektur malam ini adalah mahakaryanya. Setiap simpul yang terputus adalah seni."</em></p>`;
    text += `<p><span class="speaker arin">Arya</span> "Visual berubah — rekaman CCTV live. Setiap ruangan di mansion. Dan satu feed — ruangan gelap. Meja dengan sepuluh boneka kayu."</p>`;
    text += `<p class="sound">— tangan bersarung hitam masuk frame. Mengangkat satu boneka. Mematahkannya. —</p>`;
    text += `<p class="journal"><em>"Karya pertama dimulai. Simpul pertama: Keberanian atau Kesetiaan? Pilihlah."</em></p>`;

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
  text: `<p><span class="speaker sera">Sera</span> "Pria di foto — 60-70 tahun. Contempt microexpression. Seseorang yang merasa superior."</p>
<p><span class="speaker sera">Sera</span> "Matanya... aku pernah lihat. Foto keluarga Wardhana di ruang kerja lantai dua."</p>
<p><span class="speaker niko">Niko</span> "Itu... kakekku. Kakek yang meninggal tahun lalu."</p>
<p><span class="speaker sera">Sera</span> "Niko — apakah kakekmu benar-benar meninggal?"</p>`,
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
  text: `<p><span class="speaker niko">Niko</span> "Kakekku — Hendarto Wardhana — meninggal tahun lalu. Resmi: serangan jantung. Tapi..."</p>
<p><span class="speaker niko">Niko</span> "Wasiatnya bilang: 'Kembalikan apa yang kita ambil. Undang mereka yang terikat. Biarkan simpul terakhir menentukan.' Aku pikir dia bicara soal warisan."</p>
<p><span class="speaker niko">Niko</span> "Sekarang... aku tidak yakin dia benar-benar mati."</p>
<p><span class="speaker reza">Reza</span> "Aku bisa verifikasi sertifikat kematian kalau ada sinyal."</p>
<p><span class="speaker kira">Kai</span> "Nggak ada sinyal. Tapi aku bisa cari di server lokal."</p>
<p class="journal"><em>"Waktu berjalan. Simpul pertama menunggu di Ruang Musik. Dua orang harus masuk. Pintu terkunci sepuluh menit. Pilihlah."</em></p>`,
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
  text: `<p><span class="speaker niko">Niko</span> "Itu ruang kerja kakekku. Lantai tiga. Seharusnya terkunci. Aku sendiri yang kunci."</p>
<p><span class="speaker arin">Arya</span> "Siapa lagi yang punya akses?"</p>
<p><span class="speaker niko">Niko</span> "Tidak ada! Kunci fisik cuma dua — satu padaku, satu di safe deposit box notaris."</p>
<p><span class="speaker farah">Farah</span> "Atau orang yang mencuri kunci dari notaris."</p>
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
  text: `<p><span class="speaker reza">Reza</span> "Dua orang masuk ke ruangan terkunci sepuluh menit? Setup klasik. Pisahkan kelompok."</p>
<p><span class="speaker lana">Lana</span> "Atau tes. Siapa yang cukup berani — atau bodoh — untuk masuk."</p>
<p><span class="speaker juno">Juno</span> "Gue masuk."</p>
<p><span class="speaker juno">Juno</span> "Gue serius. Nggak mau duduk nunggu giliran. Mending gue jemput masalahnya."</p>
<p><span class="speaker dimas">Dimas</span> "Aku bisa ikut. Kalau ada yang terluka, aku bantu secara medis."</p>
<p><span class="speaker sera">Sera</span> menatapmu. Matanya berkata: <em>jangan biarkan Dimas masuk berdua dengan Juno.</em></p>`,
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
      text: '"Biarkan Juno dan Dimas masuk. Aku monitor dari luar."',
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

    let text = `<p class="sound">— pintu berdebam. Klik kunci magnetik. Sepuluh menit dimulai. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Meja bundar, dua kursi. Dua amplop, botol wine, jam pasir yang sudah mengalir."</p>`;
    text += `<p class="journal"><em>"SIMPUL PERTAMA: KEBERANIAN ATAU KESETIAAN — Baca kedua amplop. Lalu pilih — BUKA satu rahasia ke kelompok melalui intercom, atau SIMPAN keduanya. BUKA: orang itu terluka, tapi kelompok dapat informasi. SIMPAN: jam pasir terus berjalan. Habis sebelum memilih — ruangan ini punya kejutan."</em></p>`;

    if (s.difficulty === 1) {
      text += `<p class="journal"><em>"RAHASIA LANA MAHARANI: Novelnya mengandung deskripsi akurat pembunuhan di mansion ini 3 tahun lalu. Detail yang polisi tidak publikasikan. Lana bukan hanya penulis — dia saksi. Atau pelaku."</em></p>`;
    } else if (s.difficulty === 2) {
      text += `<p class="journal"><em>"RAHASIA LANA MAHARANI: Dia dan Dimas berkorespondensi dua tahun. Dimas memberikan detail autopsi 'dimodifikasi' untuk novel Lana. Modifikasi itu bukan fiksi — cara menyembunyikan bukti pembunuhan."</em></p>`;
    } else {
      text += `<p class="journal"><em>"RAHASIA KONSPIRASI: Lana, Dimas, dan satu orang lagi bekerja sama tiga tahun. Lana menulis skenario. Dimas menyediakan metode. Orang ketiga menyediakan lokasi dan korban."</em></p>`;
    }

    text += `<p class="journal"><em>"RAHASIA FARAH ALDRIDGE: Kakeknya tidak meninggal karena serangan jantung. Farah menemukan bukti dia dibunuh — dan dia tahu pelakunya. Dia datang malam ini untuk menghancurkan bukti."</em></p>`;

    if (partner === 'Reza') {
      text += `<p><span class="speaker reza">Reza</span> "Ini informasi dari dalam. Siapapun yang menulis ini punya akses ke file polisi dan data medis."</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> "Bro. Ini berat. Kalau kita buka, kita literally hancurin hidup orang."</p>`;
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
    let text = `<p><span class="speaker arin">Arya</span> menekan intercom dan membacakan rahasia Lana.</p>`;
    text += `<p class="journal"><em>"Pilihan dibuat. Simpul Keberanian: terikat."</em></p>`;
    text += `<p class="sound">— pintu terbuka —</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Kau memilih untuk membuka rahasiaku. Oke. Adil. Tapi ingat, Arya — malam masih panjang. Dan semua orang punya rahasia."</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker reza">Reza</span> "Lana dan Dimas pergi bersama. Kalau rahasia itu benar — kita baru kasih tahu dua orang yang berkonspirasi bahwa kita tahu."</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Itu bisa bikin mereka lebih berbahaya — atau lebih hati-hati."</p>`;
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
  text: `<p><span class="speaker farah">Farah</span> "Kau tidak punya hak! Kakekku DIBUNUH dan satu-satunya orang yang berusaha mencari keadilan — aku — sekarang terekspos di depan orang yang mungkin PEMBUNUHNYA!"</p>
<p><span class="speaker reza">Reza</span> "Farah. Siapa yang kau curigai membunuh kakekmu?"</p>
<p><span class="speaker farah">Farah</span> "Tanyakan pada TUAN RUMAH kita. Kenapa kakeknya dan kakekku meninggal dalam jarak enam bulan. Di tempat yang sama."</p>
<p><span class="speaker niko">Niko</span> "Farah, aku tidak—"</p>
<p><span class="speaker farah">Farah</span> "JANGAN bohong. Aku menemukan surat-surat. Kakekmu dan kakekku punya perjanjian — dan salah satu mengkhianati yang lain."</p>`,
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
  text: `<p><span class="speaker niko">Niko</span> "Aku baru tahu sebulan lalu. Dari dokumen kakek."</p>
<p><span class="speaker niko">Niko</span> "1973, kakekku dan kakek Farah membangun mansion ini. Selama konstruksi, mereka menemukan ruangan kuno di bawah tanah. Pra-kolonial. Di dalamnya ada artefak — batu dengan ukiran."</p>
<p><span class="speaker niko">Niko</span> "Kakekku percaya batu itu punya kekuatan. Kakek Farah ingin serahkan ke universitas. Mereka bertengkar."</p>
<p><span class="speaker reza">Reza</span> "Dan tujuh pekerja yang tewas dalam 'kecelakaan'?"</p>
<p><span class="speaker niko">Niko</span> "Artefak itu masih di lantai tiga. Di ruang kerja kakek. Pameran ini seharusnya tentang mengungkap kebenaran keluargaku. Aku tidak tahu ada orang lain yang punya rencana malam ini."</p>`,
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

    let text = `<p><span class="speaker arin">Arya</span> "Kami tidak akan membuka rahasia siapapun. Kami menolak bermain."</p>`;
    text += `<p class="journal"><em>"Pilihan yang mulia. Tapi bukan tanpa konsekuensi."</em></p>`;
    text += `<p class="sound">— jam pasir habis. Lampu mati. Suara mekanis di dinding. —</p>`;

    if (partner === 'Reza') {
      text += `<p><span class="speaker reza">Reza</span> "Merunduk!"</p>`;
    } else {
      text += `<p><span class="speaker juno">Juno</span> "Tiarap!"</p>`;
    }

    text += `<p class="sound">— semprotan cat merah dari nozzle tersembunyi. Menutup kepala sampai kaki. —</p>`;
    text += `<p class="sound">— lampu menyala. Pintu terbuka. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> "Kalian baik-baik saja?!"</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Cat. Hanya cat."</p>`;
    text += `<p class="journal"><em>"Simpul pertama: Rahmat. Keberanian menolak selalu punya harga. Countdown: 05:00:00."</em></p>`;

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

    let text = `<p><span class="speaker arin">Arya</span> "Dinding belakang ini hollow."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Panel palsu. Lorong sempit di baliknya — koridor servis dari era mansion dibangun."</p>`;
    text += `<p><span class="speaker arin">Arya</span> "Keluar ke dapur belakang. Kita lewati permainan sepenuhnya."</p>`;
    text += `<p class="journal"><em>"Menarik. Pemain yang menolak aturan. Sang Penenun menghargai kreativitas. Tapi keluar dari satu permainan berarti masuk ke yang lain."</em></p>`;
    text += `<p><span class="speaker arin">Arya</span> "Ada diagram mansion di dinding dapur — setiap ruangan, setiap lorong, termasuk jalur tersembunyi. Dan di pojok: 'Kontrol utama: Basement B-2. Akses melalui wine cellar.'"</p>`;

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
      text += `<p class="sound">— Niko dan Farah masuk. Pintu tertutup. Sepuluh menit. —</p>`;
      text += `<p class="sound">— suara perdebatan samar dari dalam —</p>`;
      text += `<p><span class="speaker niko">Niko</span> "Kami memilih untuk tidak bicara."</p>`;
      text += `<p><span class="speaker farah">Farah</span> "Untuk sekarang. Tapi ada hal yang harus kalian tahu. Nanti."</p>`;
    } else {
      text += `<p class="sound">— Juno dan Dimas masuk. Sepuluh menit. Hening total. —</p>`;
      text += `<p><span class="speaker juno">Juno</span> "Gue perlu ngomong sama lu, Arya. Sekarang."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> berjalan ke arah Lana. Mereka berbisik.</p>`;
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
  text: `<p class="sound">— masuk sendirian. Pintu berdebam. —</p>
<p><span class="speaker arin">Arya</span> "Meja, kursi, amplop, jam pasir. Plus layar CCTV — aku bisa lihat yang lain di hall."</p>
<p><span class="speaker arin">Arya</span> "Sera mondar-mandir. Reza berjaga di pintu. Lana bicara intens dengan Dimas di sudut."</p>
<p><span class="speaker arin">Arya</span> "Dua amplop. Rahasia Lana. Rahasia Farah. Dan bonus — amplop ketiga."</p>
<p class="journal"><em>"BONUS UNTUK YANG BERANI: Sang Penenun bukan orang luar. Sang Penenun duduk bersama kalian malam ini. Dan dia sudah mulai bergerak."</em></p>`,
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
      text: "SIMPAN semua. Info lebih berharga kalau disimpan.",
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
  text: `<p><span class="speaker sera">Sera</span> "Aku tetap di sini."</p>
<p><span class="speaker farah">Farah</span> "Aku juga."</p>
<p><span class="speaker kira">Kai</span> "Gue stay. Ada panel elektrikal di balik lukisan yang mau gue reverse-engineer."</p>
<p><span class="speaker vira">Vira</span> duduk di kursi, membuka amplopnya, membaca, menaruhnya kembali.</p>
<p><span class="speaker kira">Kai</span> "Panel ketemu. Mulai reverse-engineering sistem kunci."</p>
<p><span class="speaker sera">Sera</span> "Aku sudah bikin profil psikologis kasar semua orang."</p>
<p class="sound">— dari Galeri Timur, teriakan. Lalu keheningan. —</p>
<p><span class="speaker juno">Juno</span> "Arya — mereka disuruh pilih siapa yang masuk Ruang Musik. Nggak ada yang mau."</p>`,
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
      text: '"Kai, bisa kau override kunci ruangan itu supaya tidak ada yang perlu masuk?"',
      next: 'ch1_kira_override',
      effect: (s) => {
        s.flags.kiraOverride = true;
        Engine.modTrust('arin', 'kira', 8);
      }
    }
  ]
},

'ch1_kira_override': {
  text: `<p><span class="speaker kira">Kai</span> "Aku bisa bypass kunci satu ruangan — tapi itu trigger alert di server. Sang Penenun bakal tahu aku hacking."</p>
<p><span class="speaker arin">Arya</span> "Lakukan."</p>
<p><span class="speaker kira">Kai</span> "Got it. Ruang Musik terbuka. Dan — aku juga nemu sesuatu. Log server. Dua admin account: 'ADMIN_NW' milik Niko. Dan satu lagi..."</p>
<p><span class="speaker arin">Arya</span> "Siapa?"</p>
<p><span class="speaker kira">Kai</span> "'PENENUN'. Aktif terakhir... lima menit yang lalu."</p>
<p class="journal"><em>"Kai Chen. Kau memilih jalan pintas. Sang Penenun menghargai kecerdasan — tapi menghukum ketidaksabaran. Countdown dipercepat satu jam."</em></p>
<p class="sound">— timer: 04:00:00. Satu jam hilang. —</p>`,
  shake: true,
  choices: [
    {
      text: '"Worth it. Kai, terus tracking account Penenun itu."',
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modDanger(15);
        s.flags.kiraTracking = true;
        s.cluesFound += 2;
        s.keyChoices.push('kira_hack');
      }
    },
    {
      text: '"Matikan. Jangan provokasi lagi."',
      next: 'ch1_regroup',
      effect: (s) => {
        Engine.modDanger(8);
        s.flags.stoppedKira = true;
      }
    }
  ]
},

'ch1_explore_floor2': {
  text: `<p><span class="speaker arin">Arya</span> "Lantai dua. Koridor panjang, lampu darurat hijau. Enam pintu — empat kamar tamu, kamar mandi, dan satu ruang bertuliskan 'ARSIP'."</p>
<p><span class="speaker arin">Arya</span> "Arsip terkunci — kunci fisik. Lockpick pakai hairpin."</p>
<p><span class="speaker arin">Arya</span> "Di dalam — rak file dari lantai ke langit-langit. Dokumen, foto, rekaman. Puluhan tahun sejarah mansion."</p>
<p><span class="speaker arin">Arya</span> "'Acara Tahunan 2022'. Daftar tamu sepuluh nama. Foto polaroid — sepuluh orang tersenyum. Di belakang: '8 pulang. 2 tinggal.'"</p>
<p><span class="speaker arin">Arya</span> "2021: '7 pulang. 3 tinggal.' 2020: '8 pulang. 2 tinggal.' Setiap tahun — sepuluh masuk, beberapa 'tinggal'."</p>
<p><span class="speaker arin">Arya</span> "Folder 2019... salah satu tamu di foto — itu Vira. Tapi Vira hilang enam bulan lalu, bukan tiga tahun. Kecuali dia pernah diundang sebelumnya. Dan selamat."</p>`,
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
      text: "Foto semua dan taruh kembali — jangan biarkan siapapun tahu",
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
  text: `<p><span class="speaker reza">Reza</span> "Basement terbagi dua. B-1 wine cellar. B-2 di balik pintu baja — terkunci elektronik."</p>
<p><span class="speaker reza">Reza</span> "Lihat — cahaya biru dari celah. Server di dalam sana."</p>
<p><span class="speaker arin">Arya</span> "Meja kerja tersembunyi di antara rak botol. Laptop tua, kabel, dan notes."</p>
<p><span class="speaker arin">Arya</span> "Notes berisi jadwal — tanggal, nama, kode: 'SMP-1' sampai 'SMP-7'. Di setiap kode: nama dua-tiga orang dengan centang. 'Terselesaikan.'"</p>
<p><span class="speaker reza">Reza</span> "SMP — Simpul."</p>
<p><span class="speaker arin">Arya</span> "Dan di bawah: 'SMP-8' — tanggal hari ini. Sepuluh nama. Nama kita semua. Tiga nama dilingkari merah."</p>`,
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
    let text = '';
    if (s.difficulty === 1) {
      text += `<p class="journal"><em>Tiga nama dilingkari: Reza Hartono. Farah Aldridge. Kai Chen.</em></p>`;
      text += `<p><span class="speaker reza">Reza</span> "Aku sudah curiga. Targetnya orang yang bisa mengungkap Sang Penenun. Aku — ex-detektif. Kai — hacker. Farah — akses ke bukti lama."</p>`;
    } else if (s.difficulty === 2) {
      text += `<p class="journal"><em>Tiga nama dilingkari: Reza Hartono. Vira Deviani. Arya Prasetya.</em></p>`;
      text += `<p><span class="speaker reza">Reza</span> "Kita berdua di daftar. Berarti kita ancaman bagi Sang Penenun."</p>
<p><span class="speaker arin">Arya</span> "Dan Vira?"</p>
<p><span class="speaker reza">Reza</span> "Vira tahu terlalu banyak. Satu-satunya yang pernah selamat dari acara sebelumnya."</p>`;
    } else {
      text += `<p class="journal"><em>Tiga nama dilingkari: Arya Prasetya. Sera Amalina. Kai Chen.</em></p>`;
      text += `<p><span class="speaker reza">Reza</span> "Analitis, psikolog, hacker. Mereka mengincar otak operasi. Ini bukan random — ini surgical."</p>`;
    }

    text += `<p class="journal"><em>"Simpul harus diselesaikan sebelum fajar. Jika gagal — semua simpul terputus."</em></p>`;
    text += `<p class="sound">— langkah kaki di atas. Seseorang turun. —</p>`;

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
      text: "Naik dan konfrontasi — siapa yang mengikuti?",
      next: 'ch1_regroup',
      effect: (s) => {
        s.flags.confrontedFollower = true;
      }
    }
  ]
},

'ch1_basement_visitor': {
  text: (s) => {
    let text = `<p class="sound">— bersembunyi di balik rak wine. Langkah mendekat. —</p>`;

    if (s.difficulty >= 2) {
      text += `<p class="sound">— dua pasang kaki —</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Data masih utuh. Tapi ada yang mengakses notes SMP-8. Seseorang sudah di sini sebelum kita."</p>`;
      text += `<p><span class="speaker dimas">Dimas</span> "Siapa?"</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Tidak tahu. Tapi kita harus percepat timeline. Sebelum mereka menemukan B-2."</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Lana tahu password. Tahu layout. Dia bukan tamu — dia bagian dari ini."</p>`;
    } else {
      text += `<p><span class="speaker arin">Arya</span> "Dimas. Sendirian. Membuka laci meja — mengambil botol kecil tanpa label, masuk ke saku jas."</p>`;
      text += `<p><span class="speaker reza">Reza</span> "Botol tanpa label, disembunyikan di basement. Itu bukan obat OTC."</p>`;
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
  text: `<p><span class="speaker lana">Lana</span> "Mereka tahu tentang novel. Itu bisa membahayakan timeline kita."</p>
<p><span class="speaker dimas">Dimas</span> "Apa yang kau sarankan?"</p>
<p><span class="speaker lana">Lana</span> "Percepat. Event kedua dijadwalkan jam satu. Kita harus pastikan target pertama terisolasi sebelum itu."</p>
<p><span class="speaker dimas">Dimas</span> "Kalau mereka berpencar?"</p>
<p><span class="speaker lana">Lana</span> "Justru itu yang kita mau. Kelompok utuh sulit dipecahkan. Kelompok yang sudah saling curiga..."</p>
<p><span class="speaker dimas">Dimas</span> "...akan menyingkirkan diri mereka sendiri."</p>`,
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
  text: `<p><span class="speaker arin">Arya</span> "Dimas di dapur. Tas medisnya terbuka — bukan P3K biasa. Suntikan, botol kecil, scalpel."</p>
<p><span class="speaker arin">Arya</span> "Dia mengisi suntikan dengan cairan bening. Gerakan presisi, tanpa ragu."</p>
<p><span class="speaker arin">Arya</span> "Sekarang dia menuang sesuatu ke teko teh — cairan dari botol kedua."</p>
<p><span class="speaker dimas">Dimas</span> "Arya. Aku sedang menyiapkan obat tidur herbal. Valerian root. Untuk Farah — panic attack."</p>
<p><span class="speaker arin">Arya</span> "Dan suntikan?"</p>
<p><span class="speaker dimas">Dimas</span> "Epinephrine. Standar P3K untuk reaksi alergi berat. Aku mahasiswa kedokteran. Selalu siap."</p>`,
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
    let text = `<p class="sound">— countdown: ${s.flags.kiraTracking ? '04:00:00' : '05:00:00'} —</p>`;

    if (s.flags.revealedLana) {
      text += `<p><span class="speaker lana">Lana</span> duduk di sudut terjauh. <span class="speaker dimas">Dimas</span> berdiri di dekatnya.</p>`;
    }
    if (s.flags.revealedFarah) {
      text += `<p><span class="speaker farah">Farah</span> menolak bicara kecuali pada Niko.</p>`;
    }
    if (s.flags.paintedButIntact) {
      text += `<p class="sound">— cat merah mengering di baju. Pengingat: menolak bermain punya harga. —</p>`;
    }

    text += `<p><span class="speaker niko">Niko</span> "Kita butuh rencana. Event berikutnya dalam—"</p>`;
    text += `<p class="journal"><em>"Event kedua dalam satu jam. Lokasi: Sayap Barat. Tema: Kepercayaan."</em></p>`;
    text += `<p><span class="speaker reza">Reza</span> "Kita punya satu jam. Bagaimana kita menggunakannya?"</p>`;

    if (s.flags.heardLanaDimasPlan || s.flags.sawLanaInBasement) {
      text += `<p><span class="speaker arin">Arya</span> "Ada yang harus kalian tahu tentang Lana dan Dimas."</p>`;
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
      text: "Cari jalan keluar alternatif — jendela lantai 2, menara, apapun",
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
      text: "Bicara dengan Vira — dia pernah selamat. Dia tahu caranya.",
      next: 'ch1_vira_survivor',
      effect: (s) => {
        Engine.modTrust('arin', 'vira', 5);
      }
    }
  ]
},

'ch1_confront_killers': {
  text: (s) => {
    let text = `<p><span class="speaker arin">Arya</span> "Lana. Dimas. Kita perlu bicara."</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Tentang?"</p>`;

    if (s.flags.heardLanaDimasPlan) {
      text += `<p><span class="speaker arin">Arya</span> "Aku dengar pembicaraan kalian di perpustakaan. 'Percepat timeline.' 'Isolasi target.' Kalian bukan tamu."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Kau salah dengar. Kami membicarakan novel — skenario untuk buku berikutnya. Aku penulis, ingat?"</p>`;
    } else if (s.flags.sawLanaInBasement) {
      text += `<p><span class="speaker arin">Arya</span> "Aku lihat kau di basement. Kau tahu password laptop di sana. Kau tahu layout mansion. Kau bukan tamu, Lana."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Aku riset untuk novel. Sudah ke mansion ini tiga kali. Tentu aku tahu layoutnya."</p>`;
    }

    text += `<p><span class="speaker dimas">Dimas</span> "Akusasi berat tanpa bukti solid. Itu fitnah."</p>`;

    if (s.difficulty >= 2) {
      text += `<p><span class="speaker sera">Sera</span> "Aku nggak bisa buktikan. Tapi Lana tidak menunjukkan stress dari akusasi ini. Orang tidak bersalah akan marah atau takut. Lana... controlled."</p>`;
      text += `<p><span class="speaker lana">Lana</span> "Sera, itu bukan bukti. Itu pendapat."</p>`;
      text += `<p><span class="speaker sera">Sera</span> "Kau benar. Tapi aku akan terus memperhatikan."</p>`;
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
  text: `<p><span class="speaker arin">Arya</span> "Kau pernah ke sini sebelumnya. 2019. Aku menemukan fotomu di arsip."</p>
<p><span class="speaker vira">Vira</span> "2019. Ya. Aku masih muda. Masih percaya dunia pada dasarnya baik."</p>
<p><span class="speaker arin">Arya</span> "Apa yang terjadi?"</p>
<p><span class="speaker vira">Vira</span> "Sepuluh masuk. Delapan keluar. Satu ditemukan di hutan tiga bulan kemudian. Yang satu lagi... tidak pernah ditemukan."</p>
<p><span class="speaker arin">Arya</span> "Dan kau?"</p>
<p><span class="speaker vira">Vira</span> "Aku selamat karena aku melakukan sesuatu yang tidak bisa kumaafkan. Aku mengorbankan orang lain supaya aku keluar."</p>
<p><span class="speaker arin">Arya</span> "Tapi kau kembali."</p>
<p><span class="speaker vira">Vira</span> "Karena tahun ini targetnya orang yang aku sayangi. Kau. Sera. Juno. Aku tidak bisa biarkan ini terulang."</p>
<p><span class="speaker arin">Arya</span> "Siapa Sang Penenun?"</p>
<p><span class="speaker vira">Vira</span> "Aku tidak pernah lihat wajahnya. Tapi dia selalu ada di antara tamu. Berpura-pura jadi salah satu dari kita. Dan dia <em>menikmati</em> menontonnya."</p>`,
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
