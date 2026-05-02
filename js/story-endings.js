/* ============================================================
   SIMPUL TERAKHIR — ENDINGS (Compact Edition)
   30 endings total — trigger otomatis berdasarkan kondisi game.
   Rating: S (terbaik), A, B, C, D, F (terburuk)
   Sistem: condition-based, bukan chapter-locked.
   ============================================================ */

const ENDING_REQUIREMENTS = {
  1:  { rating: 'S', title: 'Sang Penenun Terakhir', hint: 'Eliminasi SEMUA killer, kumpulkan 5+ petunjuk, 4+ survivor hidup, moral positif.', hook: '"Kau akan tahu mengapa kakeknya membangun mansion ini. Dan mengapa ibumu pernah masuk."' },
  2:  { rating: 'S', title: 'Detektif Sejati', hint: 'Eliminasi SEMUA killer, temukan SEMUA 8 petunjuk pelarian.', hook: '"47 siklus. 50 tahun. Tiga cucu yang tidak pernah tahu mereka saudara."' },
  3:  { rating: 'A', title: 'Fajar yang Cukup', hint: 'Eliminasi SEMUA killer, kumpulkan 2-4 petunjuk, 2+ survivor hidup.', hook: '"Satu file terakhir di server mansion menyimpan 47 nama. Dua di antaranya... sangat familiar."' },
  4:  { rating: 'A', title: 'Pengorbanan', hint: 'Player mati, tapi 3+ survivor selamat dan 3+ petunjuk terkumpul.', hook: '"Di detik terakhir, layar komputer Ragil menampilkan sesuatu yang mengubah segalanya."' },
  5:  { rating: 'A', title: 'Kesaksian Terakhir', hint: 'Vira hidup, 4+ survivor selamat, menang lewat pelarian atau eliminasi killer.', hook: '"Vira menyimpan satu rahasia tentang kakaknya. Rahasia yang menjelaskan mengapa pintu itu ada."' },
  6:  { rating: 'B', title: 'Abu dan Fajar', hint: 'SEMUA killer mati, tapi 3+ petunjuk dihancurkan, petunjuk < 5.', hook: '"Satu benda kecil selamat dari api. Benda yang seharusnya tidak ada di mansion ini."' },
  7:  { rating: 'B', title: 'Kemenangan yang Pecah', hint: 'SEMUA killer mati, tapi 3+ kematian terjadi, survivor tersisa <= 3.', hook: '"Mereka yang mati malam itu ternyata bukan korban pertama dari keluarga mereka."' },
  8:  { rating: 'B', title: 'Penebusan Penulis', hint: 'Lana (killer) mati, moral positif. Lana memilih penebusan.', hook: '"Nama aslinya bukan Kusuma. Dan orang yang dia bunuh malam ini... sepupunya sendiri."' },
  9:  { rating: 'B', title: 'Lingkaran Vira', hint: 'Vira hidup, 3+ survivor selamat, player bukan Vira.', hook: '"Kakaknya pernah keluar lewat pintu yang sama. Tapi kakaknya membuat satu kesalahan."' },
  10: { rating: 'C', title: 'Kemenangan Pyrrhic', hint: 'SEMUA killer mati, tapi petunjuk < 3. Sang Penenun lolos.', hook: '"Setahun kemudian, undangan hitam muncul di alamat yang sangat kau kenal."' },
  11: { rating: 'C', title: 'Perjanjian dengan Iblis', hint: '8+ karakter hidup, tapi moral sangat rendah (< -5).', hook: '"Ragil memberikan satu file sebagai hadiah perpisahan. File yang meracuni setiap hubungan."' },
  12: { rating: 'C', title: 'Perpecahan Fatal', hint: '2-4 survivor selamat, game berakhir saat fajar tanpa resolusi.', hook: '"Masing-masing membawa pulang satu fragment kebenaran. Tanpa satu sama lain, tidak ada gambaran utuh."' },
  13: { rating: 'C', title: 'Warisan Wardhana', hint: 'Niko hidup dan BUKAN killer. Pewaris yang memilih sisi benar.', hook: '"Di lorong rahasia kakeknya, Niko menemukan surat terakhir yang mengubah segalanya."' },
  14: { rating: 'D', title: 'Paranoia Menang', hint: 'Rata-rata trust < 25, 2+ kematian terjadi. Kepercayaan runtuh total.', hook: '"Paranoia itu bukan kelemahan manusia. Itu senjata buatan — ditanamkan ke udara mansion."' },
  15: { rating: 'D', title: 'Tuduhan Salah', hint: 'Killer masih hidup, Sera hidup, killer menang. Salah tuduh.', hook: '"Di laptop-nya ditemukan draft berjudul \'Kambing Hitam — Versi 7.\' Ini bukan kebetulan."' },
  16: { rating: 'D', title: 'Sang Penenun Menang', hint: 'Player hidup, tapi killer menang. Siklus berlanjut.', hook: '"Email terakhir Sang Penenun berisi profil psikologis setiap tamu. Termasuk nama ibumu."' },
  17: { rating: 'D', title: 'Pengkhianatan Dokter', hint: 'Dimas (killer) hidup, killer menang atau player kalah.', hook: '"Dimas Pratama asli meninggal tahun 2001. Orang ini... tidak punya nama sejak lahir."' },
  18: { rating: 'F', title: 'Simpul Terputus Total', hint: 'Player hidup tapi sendirian, 5+ kematian. Hampir semua mati.', hook: '"Enam bulan kemudian, paket tanpa pengirim tiba. Di dalamnya: silsilah keluarga setiap korban."' },
  19: { rating: 'C', title: 'Pelarian Tanpa Akhir', hint: 'Player memilih keluar sebelum misi selesai. Pelarian tanpa resolusi.', hook: '"Kau keluar dari mansion. Tapi mansion tidak pernah keluar dari kepalamu."' },
  20: { rating: 'D', title: 'Pengecut yang Hidup', hint: 'Player melarikan diri sendirian, meninggalkan semua orang.', hook: '"Setahun kemudian kau melihat berita: mansion terbakar. Tidak ada korban yang pernah ditemukan."' },
  21: { rating: 'B', title: 'Pahlawan yang Jatuh', hint: 'Player (Arya) mati, tapi 2+ survivor selamat. Mati sebagai pahlawan.', hook: '"Di arsip operator nomor 31: nama ibumu. Podcast terakhir 8 menit mengubah segalanya."' },
  22: { rating: 'D', title: 'Siklus Berlanjut', hint: 'Player hidup, petunjuk <= 1, masih chapter awal (1-3).', hook: '"Di amplop hitam berikutnya: foto ibumu di mansion lain, satu tahun sebelum dia \'meninggal.\'"' },
  23: { rating: 'C', title: 'Plot Twist Penulis', hint: 'Lana (killer) selamat, identitas tersembunyi, player tidak menang.', hook: '"Dua cucu Hendarto bermain di arena kakek mereka tanpa pernah tahu mereka berbagi darah."' },
  24: { rating: 'C', title: 'Profiler dan Subjek', hint: 'Sera hidup, game berakhir saat fajar. Profiling dimanfaatkan musuh.', hook: '"Kemampuan profiling Sera bukan bakat alami. Ibunya mengajarkannya sejak usia 4 tahun. Untuk tujuan yang sangat gelap."' },
  25: { rating: 'F', title: 'Mayoritas yang Diam', hint: '7+ karakter hidup, moral sangat rendah (< -10). Semua memilih diam.', hook: '"Dokumen bocor: \'Skenario terbaik bukan membunuh semua tamu. Skenario terbaik adalah keheningan.\'"' },
  26: { rating: 'S', title: 'Pelarian dari Mansion', hint: 'Kumpulkan 5+ petunjuk atau temukan Kunci Master, player hidup, menang lewat pelarian.', hook: '"Di dinding terowongan ada puluhan tulisan tangan. Satu di antaranya... dari ibumu."' },
  27: { rating: 'S', title: 'Pembantai Pembunuh', hint: 'SEMUA killer dieliminasi lewat combat, 3+ survivor hidup.', hook: '"Forensik mengungkap ketiga operator ternyata berbagi satu hal: darah Wardhana."' },
  28: { rating: 'A', title: 'Pengkhianatan Sempurna', hint: '2+ killer, SEMUA killer mati, ada killer yang saling bunuh (betrayal).', hook: '"Saat masker jatuh, mereka mengenali mata yang sama — mata yang mereka lihat di cermin setiap pagi."' },
  29: { rating: 'D', title: 'Jejak yang Terhapus', hint: 'Killer menghancurkan cukup petunjuk sehingga pelarian mustahil.', hook: '"Di antara petunjuk yang terbakar: daftar 47 nama selama 50 tahun. Termasuk tiga yang sangat kau kenal."' },
  30: { rating: 'A', title: 'Yang Terakhir Berdiri', hint: 'SEMUA killer mati, tapi hanya 1 survivor tersisa. Kemenangan sendirian.', hook: '"Beban terberat: menjadi satu-satunya orang di dunia yang tahu seluruh kebenaran."' }
};

const STORY_ENDINGS = {

// ============================================================
// S-RANK ENDINGS
// ============================================================

'ending_masterpiece': {
  chapter: 4, isEnding: true, endingNumber: 1,
  title: 'Sang Penenun Terakhir', rating: 'S',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #1: Sang Penenun Terakhir —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Ragil Pramudya ditangkap. "Dewan Penenun" teridentifikasi: enam individu berkuasa yang mengoperasikan siklus kematian selama 50 tahun. 47 kasus terungkap. 23 terpidana.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Dewan bukan sindikat biasa — eksperimen sosial berskala generasi. Hendarto Wardhana, kakek Niko, salah satu pendiri. Setiap tamu dipilih berdasarkan "profil eliminasi." Bukan kebetulan — semuanya direncanakan.</p>`;

    const pc = s.playerCharacter || 'arin';
    if (pc === 'arin') {
      text += `<p><span class="speaker arin">Arya</span> Ibumu — Ratna Prasetya — jurnalis yang menyelidiki Dewan, dieliminasi 2009 oleh Dimas. Kau menulis buku: <em>Simpul Terakhir</em>. Simpul yang ibumu mulai, akhirnya tertutup.</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker sera">Sera</span> Ibumu, Dr. Lestari, ternyata psikolog Dewan — mendesain profil korban. Kemampuan membaca manusiamu adalah warisan gelap itu. Kau menulis paper: "Kepatuhan Moral dalam Sistem Opresif." Arya menulis buku, dan babmu berjudul "Anak yang Menebus Dosa Ibunya."</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker niko">Niko</span> Kau menjual mansion. Hasilnya mendanai yayasan untuk 47 keluarga korban. "Kau tidak mewarisi rumah. Kau mewarisi hutang." Hutang 47 nyawa.</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker juno">Juno</span> Instalasi senimu mengungkap kebenaran: temanmu Dara dibunuh karena hampir mengekspos Dewan. Reza memelukmu saat opening night. Akhirnya kau tahu kenapa Dara mati.</p>`;
    } else if (pc === 'vira') {
      text += `<p><span class="speaker vira">Vira</span> Kakakmu Mira — agen yang menyusup ke Dewan — mati di mansion ini. Penculikanmu adalah pesan untuk Mira yang sudah tiada. Dua tahun bersaksi. Akhirnya, kau memaafkan dirimu sendiri.</p>`;
    } else if (pc === 'reza') {
      text += `<p><span class="speaker reza">Reza</span> Mentormu Komisaris Hadian dibunuh Dimas karena terlalu dekat dengan kebenaran. Kau berhenti minum malam itu. Menghubungi putrimu yang tiga tahun menolak teleponmu.</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker lana">Lana</span> Kakakmu Arum dibunuh Dewan saat menolak menjadi operator. Kau direkrut dengan ancaman. Memoirmu — <em>"Arum: Kakak yang Mati Agar Aku Hidup"</em> — best-seller. Tulisan jujur pertamamu.</p>`;
    } else if (pc === 'dimas') {
      text += `<p><span class="speaker dimas">Dimas</span> Dimas Pratama asli meninggal tahun 2001. Kau anak jalanan yang diadopsi dan di-program ulang jadi pembunuh sejak usia 16. Di penjara, untuk pertama kalinya, seseorang memperlakukanmu sebagai manusia.</p>`;
    } else if (pc === 'kira') {
      text += `<p><span class="speaker kira">Kai</span> Dewan memantaumu sejak hack pertamamu di usia 15. Undangan mansion adalah "audisi" rekrutmen. Lo gagal audisi mereka — dan itu menyelamatkan jiwamu. Startup ethical hacking: "Data nggak bohong."</p>`;
    } else if (pc === 'farah') {
      text += `<p><span class="speaker farah">Farah</span> Ayahmu — Hendrik Aldridge — investor utama Dewan selama 20 tahun. Fortune keluargamu dibangun di atas uang darah. Kau melikuidasi segalanya untuk kompensasi korban.</p>`;
    }

    if (s.alive.niko && s.alive.vira) {
      text += `<p><span class="speaker niko">Niko</span> Niko berlutut di depan Vira di koridor pengadilan — bukan untuk hubungan mereka, tapi untuk dosa keluarganya. Pengampunan yang tidak perlu diucapkan.</p>`;
    }
    if (s.alive.juno && s.alive.reza) {
      text += `<p><span class="speaker juno">Juno</span> Juno memaksa Reza ke rehabilitasi. Reza memaksa Juno ke terapi. Dua orang yang menemukan ketenangan di antara reruntuhan.</p>`;
    }

    let survivors = [];
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) survivors.push(Engine.CHAR_DISPLAY[c]); });

    text += `<p class="sound">— Yang Selamat: ${survivors.join(', ')} —</p>`;
    text += `<p class="sound">— 47 kasus terungkap. 23 terpidana. Siklus 50 tahun — berakhir. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul terakhir adalah kebenaran yang selalu ada di dalam keluarga kita sendiri."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan ibunya dibunuh oleh sistem yang sama. Menulis buku sebagai penutup simpul.',
    vira: 'Saksi kunci. Penculikannya terhubung kematian kakaknya Mira.',
    niko: 'Cucu pendiri Dewan. Menghancurkan warisan keluarganya sendiri.',
    sera: 'Anak psikolog Dewan. Memilih menggunakan kemampuannya untuk menyelamatkan.',
    juno: 'Teman dan ayahnya dibunuh sistem yang sama. Seninya jadi monumen kebenaran.',
    lana: 'Operator yang dipaksa setelah kakaknya dibunuh. Menulis memoar jujur pertama.',
    reza: 'Mentornya dibunuh Dewan. Kembali ke kepolisian dengan misi baru.',
    dimas: 'Anak jalanan yang di-program jadi pembunuh. Mulai merasakan empati.',
    kira: 'Target rekrutmen yang gagal audisi — keputusan itu menyelamatkannya.',
    farah: 'Fortune keluarganya dari uang darah Dewan. Melikuidasi semuanya.'
  }
},

'ending_true_detective': {
  chapter: 4, isEnding: true, endingNumber: 2,
  title: 'Detektif Sejati', rating: 'S',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #2: Detektif Sejati —</p>`;
    text += `<p><span class="speaker juno">Juno</span> Semua delapan petunjuk ditemukan. Semua operator terungkap. Ragil dibawa hidup-hidup ke pengadilan. Tiga tahun proses hukum — hasilnya: keadilan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Petunjuk kedelapan — Dokumen Evakuasi — berisi daftar 47 nama korban selama 50 tahun, ditulis tangan oleh Hendarto sendiri. Di samping setiap nama: tanggal kematian dan kode operator. Nomor 31: <em>Ratna Prasetya</em> — ibu Arya. Nomor 38: <em>Mira Handayani</em> — kakak Vira. Operator: D-07 — Dimas.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya menerima penghargaan jurnalisme investigasi tertinggi. Pidatonya: "Ini untuk Ratna Prasetya yang mengejar cerita yang sama 15 tahun lalu — dan dibunuh karena itu. Dia ibuku."</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul terakhir adalah simpul yang kau ikat sendiri — dengan keberanian dan cinta yang lahir di antara kegelapan."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan nama ibunya di daftar 47 korban. Menerima penghargaan atas nama Ratna Prasetya.',
    sera: 'Menemukan koneksi ibunya dengan Dewan. Memilih kebaikan.',
    vira: 'Nama kakaknya Mira sebagai korban nomor 38. Closure yang membebaskan.'
  }
},

// ============================================================
// A-RANK ENDINGS
// ============================================================

'ending_good': {
  chapter: 4, isEnding: true, endingNumber: 3,
  title: 'Fajar yang Cukup', rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #3: Fajar yang Cukup —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Mansion di belakang. Fajar di depan. Bukti cukup untuk memulai investigasi — tapi tidak cukup menghancurkan seluruh jaringan. Ragil meninggal dua bulan kemudian. Tiga dari enam Dewan diadili. Sisanya menghilang.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ragil mengirim undangan berdasarkan "Indeks Kerentanan" — profil psikologis yang menilai seberapa mudah seseorang dimanipulasi. Semua orang di mansion dipilih karena mereka <em>sudah rusak</em>.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Profil Arya: "Skor 87/100. Ideal sebagai saksi yang tidak akan dipercaya." Sera: "Skor 91/100. Terlalu takut bertindak." Tapi mereka membuktikan prediksi Ragil salah.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Tidak semua simpul bisa diurai. Tapi kau bisa memilih siapa yang menggenggam ujung benang bersamamu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Dipilih karena dianggap terlalu rusak untuk dipercaya. Membuktikan prediksi Ragil salah.',
    sera: 'Skor kerentanan 91/100. Memilih bertindak — dimulai dari telepon jam 3 pagi.'
  }
},

'ending_sacrifice_hero': {
  chapter: 4, isEnding: true, endingNumber: 4,
  title: 'Pengorbanan', rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #4: Pengorbanan —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau turun ke B-3 terakhir kali. Upload bukti — 100%. Tapi tangga kembali tertutup puing. Kau terjebak.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Di monitor terakhir: email 2009 dari ibumu — <em>ratna.prasetya@mail.com</em>: "Kalau dia jadi jurnalis seperti aku... mungkin dia akan menyelesaikan apa yang aku mulai." Kau tersenyum. Simpulnya tertutup.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera berteriak namamu — suara mentah, bukan analitis. Cinta yang tidak sempat diucapkan. Podcast terakhirmu merekam sendiri: "Sera... aku baru baca email ibu. Dan satu hal yang aku pilih sendiri — perasaanku padamu. Maaf aku tidak sempat—"</p>`;
    text += `<p class="sound">— Rekaman berhenti. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul terakhir adalah warisan — dari ibu ke anak, dari cinta yang tidak terucapkan ke cinta yang tidak sempat diucapkan."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan email ibunya sebelum meninggal. Menyelesaikan simpul dua generasi.',
    sera: 'Menanggung cinta yang tidak sempat diucapkan. Menulis buku tentang Ratna dan Arya.'
  }
},

'ending_survivor_testimony': {
  chapter: 4, isEnding: true, endingNumber: 5,
  title: 'Kesaksian Terakhir', rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #5: Kesaksian Terakhir —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira membawa kalian ke pintu darurat yang hanya dia ketahui. Enam bulan lalu, kakaknya Mira mendorongnya keluar pintu ini: "Lari! Jangan pernah kembali!"</p>`;
    text += `<p><span class="speaker vira">Vira</span> Tapi Vira kembali. Bukan karena berani — tapi karena hidup meninggalkan kakaknya lebih menyakitkan dari mati. "Kak Mira... kali ini aku bawa mereka semua keluar."</p>`;
    text += `<p><span class="speaker vira">Vira</span> Di pengadilan, jaksa bertanya mengapa dia kembali. "Karena aku meninggalkan kakakku di balik pintu itu. Dan aku tidak mau mendengar suaranya berteriak 'Lari!' lagi."</p>`;
    text += `<p><span class="speaker vira">Vira</span> <em>"Simpul terkuat diikat oleh banyak tangan — termasuk tangan yang sudah tidak ada."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Saksi utama. Suaranya menggema di tujuh sidang.',
    vira: 'Kembali ke mansion tempat kakaknya mati. Membuka pintu yang sama untuk semua orang.',
    sera: 'Menulis profil Vira — referensi standar konseling korban penculikan.'
  }
},

// ============================================================
// B-RANK ENDINGS
// ============================================================

'ending_bittersweet': {
  chapter: 4, isEnding: true, endingNumber: 6,
  title: 'Abu dan Fajar', rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #6: Abu dan Fajar —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Mansion terbakar. Bukti terbakar. Ragil terbakar. Kemungkinan keadilan sempurna — lenyap.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Api bukan kebetulan — "dead man's switch" Ragil, terhubung detak jantungnya. Saat jantungnya berhenti, mansion membakar dirinya sendiri. Polis asuransi terakhir Hendarto.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Satu hal selamat: footage CCTV 2009 yang di-download Kai. Seorang wanita berjalan di koridor mansion — ibunya, Ratna Prasetya. 47 detik rekaman yang tidak bisa dibakar.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang kebenaran datang sebagai fajar — pelan, sabar, tak terbendung."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan footage ibunya di mansion 15 tahun lalu. Bukti tak terbantahkan.',
    niko: 'Kakeknya mendesain dead man\'s switch untuk menghancurkan semua bukti.'
  }
},

'ending_broken_victory': {
  chapter: 4, isEnding: true, endingNumber: 7,
  title: 'Kemenangan yang Pecah', rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #7: Kemenangan yang Pecah —</p>`;
    text += `<p class="sound">— Kau menang. Ragil diadili. Siklus berakhir. Tapi kemenangan ini berasa seperti kaca pecah di mulut. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> PTSD. Insomnia. Teman-teman yang mati masih muncul di mimpi. Investigasi mengungkap: setiap korban malam itu adalah generasi kedua dari keluarga korban sebelumnya. Mansion bukan arena pembunuhan — perangkap generasi.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sepuluh tahun kemudian, monumen 47 nama berdiri di reruntuhan mansion. Nama ibunya ada di sana. Dua bunga — satu untuk yang mati malam itu, satu untuk ibu.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kemenangan terbesar bukan mengalahkan monster. Tapi tetap manusia setelahnya."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Semua korban adalah generasi kedua keluarga korban sebelumnya. Masih berjuang. Masih manusia.',
    sera: 'Terapis Arya. Menanggung beban menyembuhkan orang yang kau cintai.'
  }
},

'ending_lana_redemption': {
  chapter: 4, isEnding: true, endingNumber: 8,
  title: 'Penebusan Penulis', rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #8: Penebusan Penulis —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Lana menghadapi Ragil sendirian. Mengalihkan perhatian sementara yang lain kabur. Mansion terbakar — Lana tidak keluar.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Novel terakhirnya ditemukan di tas di luar. Bab pertama: "Nama asli saya Lana Wardhana. Sepupu Niko yang tidak diakui keluarga." Dia bukan operator yang direkrut — dia cucu haram Hendarto. Kakaknya Arum dibunuh Dewan. Lana direkrut dengan ancaman.</p>`;
    text += `<p class="sound">— Best-seller posthumous. Proceeds ke panti asuhan tempat Lana tumbuh. —</p>`;
    text += `<p><span class="speaker lana">Lana</span> <em>"Ending terbaik untuk penulis bukan yang sempurna — tapi yang jujur. Saya bukan villain. Saya korban yang menulis ulang perannya sendiri."</em></p>`;
    return text;
  },
  fates: {
    lana: 'Cucu haram Hendarto, sepupu Niko. Novel terakhirnya mengungkap segalanya. Mati dengan kebenaran.',
    niko: 'Menemukan Lana sepupunya — darah Wardhana yang sama.'
  }
},

'ending_vira_closure': {
  chapter: 3, isEnding: true, endingNumber: 9,
  title: 'Lingkaran Vira', rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #9: Lingkaran Vira —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira membawamu ke pintu keluar. Lalu berhenti. "Aku harus kembali."</p>`;
    text += `<p><span class="speaker vira">Vira</span> Kakaknya Mira bukan sekadar kakak — agen rahasia yang menyusup ke Dewan selama dua tahun. USB drive berisi 47 nama korban. Mira memberikannya sebelum didorong keluar: "Simpan ini. Jangan pernah kembali." Enam bulan USB itu tersimpan di kotak sepatu tanpa pernah dibuka.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Malam ini, USB itu akhirnya di-upload. 47 nama. 50 tahun. Lingkaran tertutup. Adik yang menyelesaikan misi kakaknya.</p>`;
    text += `<p><span class="speaker vira">Vira</span> <em>"Simpul terkuat diikat oleh orang yang pernah terputus. Mira memulai. Aku menutupnya."</em></p>`;
    return text;
  },
  fates: {
    vira: 'Kakaknya Mira agen rahasia Dewan. USB drive Mira jadi bukti utama. Lingkaran dua kakak-beradik tertutup.',
    niko: 'Asisten kakeknya — Mira — sebenarnya agen yang menyusup Dewan dari dalam.'
  }
},

// ============================================================
// C-RANK ENDINGS
// ============================================================

'ending_pyrrhic': {
  chapter: 4, isEnding: true, endingNumber: 10,
  title: 'Kemenangan Pyrrhic', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #10: Kemenangan Pyrrhic —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Selamat. Ragil mati. Tapi Dewan tidak teridentifikasi. Setahun kemudian — undangan hitam muncul lagi.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Mansion Wardhana bukan satu-satunya — ada tujuh "arena" di Asia Tenggara. Kematian Ragil hanya membuat enam lainnya lebih hati-hati. Memotong satu simpul membuat enam lainnya lebih kuat.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang simpul terakhir bukan ending — tapi koma. Jeda sebelum kalimat berikutnya."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Mansion Wardhana hanya 1 dari 7 arena. Kemenangan parsial yang membuat jaringan lebih waspada.'
  }
},

'ending_deal_with_devil': {
  chapter: 4, isEnding: true, endingNumber: 11,
  title: 'Perjanjian dengan Iblis', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #11: Perjanjian dengan Iblis —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Ragil menawarkan deal: lepaskan dia, semua pintu terbuka. Kau menerima. Semua keluar. Ragil menghilang.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sebulan kemudian Ragil mati. Wasiatnya mewariskan Dewan ke "S.A." — bukan Sera, tapi ibunya Dr. Lestari yang menerima 20 tahun lalu. Kemampuan Sera membaca manusia adalah hasil pelatihan subliminal sejak usia 4 tahun. Dia tidak pernah memilih jadi profiler — dia di-program untuk itu.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul yang diikat dengan iblis tidak pernah terurai. Dan iblis itu sudah menanam benihnya jauh sebelum kau bertemu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Deal dengan Ragil menyembunyikan kebenaran tentang ibu Sera.',
    sera: 'Ibunya kandidat pewaris Dewan. Kemampuannya hasil program subliminal sejak usia 4 tahun.'
  }
},

'ending_split_group': {
  chapter: 3, isEnding: true, endingNumber: 12,
  title: 'Perpecahan Fatal', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #12: Perpecahan Fatal —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kelompok terpecah, tidak pernah bersatu. Sebagian keluar lewat jendela. Sebagian terjebak sampai fajar.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Perpecahan bukan kebetulan — Lana menanam "kata-kata kunci" sepanjang malam yang memicu ketidakpercayaan. Setiap perpecahan adalah halaman dari skenario yang sudah ditulis sebelum malam dimulai.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Perpecahan adalah senjata terbaik penulis yang menulis skenario di mana karakternya saling menghancurkan."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Terpecah dari kelompok. Kata-kata Lana masih beresonansi.',
    lana: 'Skenarionya berhasil. Perpecahan sebagai senjata.'
  }
},

'ending_niko_truth': {
  chapter: 3, isEnding: true, endingNumber: 13,
  title: 'Warisan Wardhana', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #13: Warisan Wardhana —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Niko membawamu ke lorong rahasia di balik perpustakaan — dibangun 50 tahun lalu. "Kakekku membangun ini untuk keluarga Wardhana. Bukan untuk tamu."</p>`;
    text += `<p><span class="speaker niko">Niko</span> Di dinding lorong: 20 foto cucu dan cicit Hendarto. Termasuk Niko, Lana yang ternyata sepupu, dan nama ketiga: "Dimas Wardhana." Tiga cucu. Tiga operator. Ragil membangun mesin pembunuhan dari keluarganya sendiri.</p>`;
    text += `<p><span class="speaker niko">Niko</span> <em>"Warisan bukan hanya harta. Warisan adalah pertanyaan: apakah kegelapan kakekmu juga mengalir di pembuluh nadimu?"</em></p>`;
    return text;
  },
  fates: {
    niko: 'Tiga operator — Niko, Lana, Dimas — semua darah Wardhana. Proyek keluarga 50 tahun.',
    lana: 'Cucu Hendarto dari jalur kedua — anak haram yang tumbuh di panti asuhan.',
    dimas: 'Nama asli: Dimas Wardhana. Cucu ketiga yang diadopsi tanpa tahu asal usulnya.'
  }
},

// ============================================================
// D-RANK ENDINGS
// ============================================================

'ending_everyone_suspects': {
  chapter: 3, isEnding: true, endingNumber: 14,
  title: 'Paranoia Menang', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #14: Paranoia Menang —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Kepercayaan hancur total. Semua mencurigai semua. Mengunci diri di kamar masing-masing.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Paranoia ini di-design. Ragil merekayasa: pintu terkunci selektif, lampu mati di saat kritis, suara langkah dari speaker tersembunyi. 15 tahun lalu, eksperimen pertamanya: keluarga Kirana — keluarga Juno. Ayah Juno bukan meninggalkan keluarga — dimanipulasi Ragil sampai kehilangan akal.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera mengetuk pintumu pukul empat pagi. Kau tidak membuka. Paranoia Ragil sudah menanam jaraknya.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul terakhir adalah kepercayaan. Begitu terputus — bahkan cinta pun hanya jadi bayangan."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Tidak membuka pintu untuk Sera. Paranoia di-design Ragil.',
    sera: 'Paranoia mansion adalah replikasi eksperimen 15 tahun lalu — yang menghancurkan keluarga Juno.',
    juno: 'Ayahnya korban eksperimen paranoia pertama Ragil.'
  }
},

'ending_wrong_accusation': {
  chapter: 3, isEnding: true, endingNumber: 15,
  title: 'Tuduhan Salah', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #15: Tuduhan Salah —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Kau menuduh orang yang salah. Sera — sekutu terbesarmu — dikunci. Operator sebenarnya bergerak bebas. Dua kematian lagi.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Di laptop Lana: "Kambing Hitam — Versi 7." Semua "bukti" di-plant. Kau memainkan peran yang sudah ditulis untukmu. Sera membaca kebenaran di mikro-ekspresi — "kebingungan murni, bukan rasa bersalah" — tapi suaranya tenggelam.</p>`;
    text += `<p><span class="speaker sera">Sera</span> "Kau memilih mudah daripada benar. Kau tidak dengar aku." Tangan yang dulu mencari tanganmu — sekarang dikepalkan. Genggaman yang tidak akan terulang.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul yang diikat terburu-buru selalu mengikat orang yang salah."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menuduh orang salah — skenario Lana versi ke-7. Kehilangan Sera.',
    sera: 'Membaca kebenaran tapi tidak didengar. Diabaikan orang yang paling dia cintai.',
    lana: '"Kambing Hitam — Versi 7" berhasil sempurna.'
  }
},

'ending_penenun_wins': {
  chapter: 4, isEnding: true, endingNumber: 16,
  title: 'Sang Penenun Menang', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #16: Sang Penenun Menang —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tiga simpul terputus. Mansion kembali normal saat fajar. Polisi tidak menemukan apa-apa. Kasus ditutup.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Email terakhir Ragil berisi profil psikologis setiap tamu. Profil Arya: ibunya Ratna pernah jadi <em>operator</em> — dibunuh saat mencoba keluar. Profil Sera: ibunya masih aktif sebagai psikolog Dewan. Kemampuan Sera adalah hasil pelatihan subliminal sejak usia 4 tahun.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sang Penenun sudah menang sejak sebelum mereka lahir. Setiap koneksi — bagian dari desain generasi.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Monster menang. Tapi yang paling menakutkan — monster itu selalu ada di dalam keluargamu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Ibunya Ratna pernah jadi operator Dewan. Arya dinilai "potensi rekrutmen tinggi."',
    sera: 'Ibunya masih aktif di Dewan. Kemampuan profilingnya hasil pelatihan subliminal.'
  }
},

'ending_dimas_betrayal': {
  chapter: 3, isEnding: true, endingNumber: 17,
  title: 'Pengkhianatan Dokter', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #17: Pengkhianatan Dokter —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Kau mempercayai Dimas. Memberinya akses ke supplies medis. Obat tidur sebagai pengganti obat nyeri. Dosage sedikit terlalu tinggi. Profesional sampai akhir.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Dimas Pratama asli meninggal 2001. Orang ini — anak jalanan tanpa nama, ditemukan Ragil di kolong jembatan usia 8 tahun. Diadopsi, diberi identitas curian, dibiayai sekolah kedokteran. Bukan investasi pada anak — investasi pada senjata.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Sera — dalam tatapan terakhir — tidak melihat monster. Tapi anak 8 tahun di kolong jembatan. Tatapan tanpa kebencian itu memecahkan sesuatu di dalam Dimas setelah 15 tahun presisi sempurna.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> <em>"Simpul paling tragis adalah tangan yang tidak pernah diberi pilihan untuk menjadi sesuatu selain senjata."</em></p>`;
    return text;
  },
  fates: {
    dimas: 'Anak jalanan tanpa nama, di-program 15 tahun jadi operator. Sera menatapnya tanpa kebencian.',
    sera: 'Melihat anak kecil di balik operator D-07. Tatapannya jadi retakan pertama.'
  }
},

// ============================================================
// F-RANK ENDINGS
// ============================================================

'ending_total_failure': {
  chapter: 4, isEnding: true, endingNumber: 18,
  title: 'Simpul Terputus Total', rating: 'F',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #18: Simpul Terputus Total —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Semua simpul terputus. Setiap orang yang seharusnya kau lindungi — hilang.</p>`;

    if (pc === 'arin') {
      text += `<p><span class="speaker sera">Sera</span> Sera ada di antara yang hilang. Podcast episode #47: di menit ke-42, kau menangis on air. Untuk satu nama: "Sera."</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker arin">Arya</span> Arya ada di antara yang hilang. Paper tentang malam itu — setiap kali sampai bagian Arya, jarimu berhenti.</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker niko">Niko</span> Mansionmu. Dosamu. Semua orang yang kau undang, hilang karena keputusanmu.</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker juno">Juno</span> Lo selamat. Reza di antara yang hilang. Sepi yang ditinggalkannya lebih keras dari ledakan manapun.</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker lana">Lana</span> Skenariomu berjalan sempurna. Tapi karakter yang kau tulis punya wajah sekarang. Kemenangan terasa seperti kekalahan.</p>`;
    } else {
      text += `<p><span class="speaker arin">Arya</span> Kau selamat. Tapi selamat bukan berarti menang. Semua yang pernah mengulurkan tangan — hilang.</p>`;
    }

    text += `<p><span class="speaker arin">Arya</span> Enam bulan kemudian: folder "PROFIL WARISAN." Setiap korban malam itu — generasi kedua keluarga korban sebelumnya. Ibumu: "Operator R-03. Dieliminasi 2009." Siklus yang tidak pernah kau pilih.</p>`;
    text += `<p><span class="speaker reza">Reza</span> <em>"Simpul terakhir bukan kematian — tapi hidup sendirian dengan pengetahuan bahwa semua yang kau kehilangan sudah ditakdirkan hilang."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Ibunya pernah jadi operator Dewan. Setiap korban generasi kedua. Saksi Selamat dalam rantai generasi.'
  }
},

'ending_arin_death_hero': {
  chapter: 3, isEnding: true, endingNumber: 21,
  title: 'Pahlawan yang Jatuh', rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #21: Pahlawan yang Jatuh —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya turun ke B-3 sendirian. Memaksa Ragil membuka semua kunci. Dead man's switch — gas mengisi basement. Semua pintu terbuka. Yang lain selamat. Arya tidak.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Di layar komputer Ragil: "ARSIP OPERATOR." Nomor 31 — Ratna Prasetya, ibunya. Operator yang mencoba keluar dan dibunuh. Nama Dr. Lestari — ibu Sera — juga ada. Bukan korban. Psikolog residen Dewan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Podcast terakhir, 8 menit: "Sera... aku tahu tentang ibumu juga. Jangan biarkan itu mendefinisikanmu. Kau bukan ibumu. Seperti aku bukan ibuku."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera mendengarkan rekaman itu sekali. Menggenggam ponselnya setiap malam selama setahun — menggantikan tangan yang tidak pernah sempat digenggam.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Anak dari operator yang mencoba lari. Cerita terakhir tentang memilih menjadi lebih baik dari warisan itu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan nama ibunya di daftar operator detik-detik terakhir. Mati dengan kebenaran ganda.',
    sera: 'Rekaman 8 menit terakhir Arya — pengakuan cinta dan kebenaran tentang ibunya.'
  }
},

'ending_cycle_continues': {
  chapter: 3, isEnding: true, endingNumber: 22,
  title: 'Siklus Berlanjut', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #22: Siklus Berlanjut —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau kabur di chapter awal. Berlari ke hutan. Polisi datang — mansion sudah bersih.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Setahun kemudian: amplop hitam lagi. Mansion berbeda — Bali. Di dalamnya, foto ibumu di mansion Jawa Tengah 2008. Tulisan di balik: "Ibumu datang. Ibumu kalah. Sekarang giliranmu — kedua kalinya."</p>`;
    text += `<p><span class="speaker arin">Arya</span> Nama lain di undangan: <em>Sera Amalina</em>. Sera tidak akan lari. Dan kau harus memilih: lari lagi, atau masuk bersamanya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Pengecut sejati bukan yang lari dari monster. Tapi yang membiarkan monster mengejar orang yang dia cintai."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Foto ibunya bermain dan kalah di mansion lain. Sera diundang. Siklus kedua dimulai.',
    sera: 'Diundang ke mansion baru. Pion baru dalam permainan lama.'
  }
},

'ending_lana_double': {
  chapter: 3, isEnding: true, endingNumber: 23,
  title: 'Plot Twist Penulis', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #23: Plot Twist Penulis —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Lana bermain triple — bukan double agent, tapi calon pewaris Sang Penenun. Motivasinya: menghancurkan sistem dari dalam dengan <em>menjadi</em> sistemnya.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Nama asli: Lana Wardhana — cucu Hendarto dari putra kedua yang tidak diakui. Lana dan Niko sepupu. Dua cucu bermain di arena kakek mereka tanpa tahu mereka berbagi darah.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Siklus ter-upgrade. Penenun baru lebih muda, lebih cerdas — punya empati yang cukup untuk memahami manusia dan menggunakannya sebagai senjata.</p>`;
    text += `<p><span class="speaker lana">Lana</span> <em>"Plot twist terbaik: protagonis dan antagonis selalu berbagi darah yang sama."</em></p>`;
    return text;
  },
  fates: {
    lana: 'Cucu haram Hendarto. Penenun baru — penebusan atau pengulangan, hanya waktu yang tahu.',
    niko: 'Tidak tahu Lana sepupunya. Dua cucu di arena yang sama.'
  }
},

'ending_sera_profile': {
  chapter: 3, isEnding: true, endingNumber: 24,
  title: 'Profiler dan Subjek', rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #24: Profiler dan Subjek —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera memprofilkan Sang Penenun dengan akurasi menakutkan. Tapi Ragil menggunakan prediksi Sera untuk selalu selangkah di depan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ragil melalui speaker: "Ibumu — Dr. Lestari — psikolog residen saya 18 tahun. Pelatihan subliminal sejak usia 4 tahun. Kau sudah belajar membaca microexpression sejak TK, Sera."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Semuanya — kemampuannya, karirnya, thesis-nya — berasal dari sumber paling gelap. Dia bukan profiler yang memilih jalannya. Dia produk dari sistem yang dia lawan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Yang lebih menakutkan dari memahami monster — menemukan bahwa kemampuanmu adalah hadiah dari monster yang memanggilmu 'Sayang' setiap pagi."</em></p>`;
    return text;
  },
  fates: {
    sera: 'Kemampuan profilingnya hasil pelatihan subliminal ibunya, psikolog Dewan 18 tahun. Berhenti dari psikologi.'
  }
},

'ending_silent_majority': {
  chapter: 4, isEnding: true, endingNumber: 25,
  title: 'Mayoritas yang Diam', rating: 'F',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #25: Mayoritas yang Diam —</p>`;
    text += `<p class="sound">— Semua selamat. Secara fisik. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tidak ada yang bicara. Tidak ada yang melapor. Egoisme menang atas keberanian.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Arsip bocor dua tahun kemudian. Dokumen "Protokol Omega": "Skenario terbaik bukan membunuh semua tamu. Skenario terbaik: mereka memilih diam." Ragil merencanakan ini. Moral rendah, trust hancur — kelompok terlalu rusak untuk bersaksi.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya dan Sera tidak pernah bicara lagi — setiap tatapan cermin rasa malu. Semua kebenaran — ibu Arya, ibu Sera, kakak Vira, ayah Juno — tersimpan di arsip yang tidak pernah dibuka.</p>`;
    text += `<p class="sound">— Sepuluh amplop hitam baru dikirim. Siklus ke-48 dimulai. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul tidak pernah terputus. Karena tidak ada yang mencoba. Ragil membuktikan thesis-nya: manusia memilih kenyamanan. Selalu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Diam. Tidak tahu ibunya operator Dewan. Kebenaran terkubur.',
    sera: 'Diam. Tidak tahu ibunya masih aktif di Dewan.',
    juno: 'Diam. Tidak tahu ayahnya korban pertama Ragil.',
    vira: 'Diam. Tidak tahu kakaknya mati di mansion yang sama.'
  }
},

// ============================================================
// NEW ENDINGS — Escape & Elimination Victory
// ============================================================

'ending_mansion_escape': {
  chapter: 3, isEnding: true, endingNumber: 26,
  title: 'Pelarian dari Mansion', rating: 'S',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #26: Pelarian dari Mansion —</p>`;
    text += `<p><span class="speaker juno">Juno</span> Semua petunjuk membentuk satu gambaran: terowongan di bawah basement — dibangun Hendarto 50 tahun lalu. Mansion mengaktifkan lockdown, tapi killer terjebak di dalam. Protagonis berlari menuju cahaya fajar.</p>`;

    let survivors = [];
    (typeof Engine !== 'undefined' ? Engine.CHARACTERS : []).forEach(c => { if (s.alive[c]) survivors.push(c); });

    if (survivors.length > 3) {
      text += `<p><span class="speaker juno">Juno</span> ${survivors.length} orang keluar bersama. Bukan pahlawan — manusia yang memilih tidak menyerah.</p>`;
    } else {
      text += `<p class="sound">— Hanya sedikit yang selamat. Tapi bersama — dan itu cukup. —</p>`;
    }

    text += `<p><span class="speaker arin">Arya</span> Di dinding terowongan: puluhan tulisan tangan dari tahun berbeda. "Aku keluar — M.H. 1998." Dan satu yang membuat Arya berhenti: "Aku keluar. Tapi mereka tidak membiarkan aku pergi. — R.P. 2009." R.P. — Ratna Prasetya. Ibunya.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Setiap tulisan di dinding dilacak. Untuk pertama kalinya dalam 50 tahun — siklus berakhir. Bukan karena satu orang, tapi karena semua tulisan akhirnya didengar.</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul terakhir bukan memutus benang — tapi menemukan jalan yang dibangun semua orang yang pernah lari sebelummu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Tulisan ibunya R.P. di dinding terowongan — pernah keluar tapi ditangkap kembali.',
    sera: 'Membaca nama-nama di terowongan — bukti orang lain pernah selamat tapi dibungkam.',
    niko: 'Mansion kakeknya berguna untuk pelarian. Nama pamannya di dinding terowongan.',
    juno: 'Pertama masuk terowongan. Inisial ayahnya di dinding. Closure tak terduga.',
    vira: '"Mira H." — kakaknya pernah lewat sini.'
  }
},

'ending_all_killers_dead': {
  chapter: 3, isEnding: true, endingNumber: 27,
  title: 'Pembantai Pembunuh', rating: 'S',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    const killerCount = (s.killers || []).length;
    let text = `<p class="sound">— ENDING #27: Pembantai Pembunuh —</p>`;
    text += `<p><span class="speaker juno">Juno</span> ${killerCount} killer. Semuanya dieliminasi. Keberanian, strategi, tekad.</p>`;

    (s.killers || []).forEach(k => {
      if (k === 'lana') {
        text += `<p><span class="speaker juno">Juno</span> <strong>Lana</strong> — skenarionya berbalik melawannya.</p>`;
      } else if (k === 'dimas') {
        text += `<p><span class="speaker juno">Juno</span> <strong>Dimas</strong> — dingin dan klinis sampai akhir.</p>`;
      } else if (k === 'niko') {
        text += `<p><span class="speaker juno">Juno</span> <strong>Niko</strong> — membayar harga warisan keluarganya.</p>`;
      }
    });

    text += `<p><span class="speaker juno">Juno</span> Ragil ditemukan di B-3 — tanpa bidak, tanpa kekuasaan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Forensik mengungkap: Lana, Dimas, Niko — semua darah Wardhana. Tiga cucu Hendarto, tiga operator. Ragil membangun mesin pembunuhan dari keluarganya.</p>`;

    let survivorsList = [];
    (typeof Engine !== 'undefined' ? Engine.CHARACTERS : []).forEach(c => {
      if (s.alive[c] && !(s.killers || []).includes(c)) survivorsList.push(c);
    });

    text += `<p><span class="speaker arin">Arya</span> <strong>Yang Selamat:</strong> ${survivorsList.map(c => ({ arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira', reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah' }[c] || c)).join(', ')}</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Satu-satunya cara mengakhiri permainan — menghancurkan pemainnya. Pemain yang ternyata saudara yang tidak pernah tahu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Podcast mengungkap dinasti pembunuhan tiga generasi.',
    sera: 'Tiga jiwa gelap ternyata saudara sepupu.',
    juno: 'Membunuh musuh yang saling terhubung oleh darah.',
    vira: 'Mengakhiri tiga operator. Closure untuk kakaknya Mira.',
    reza: 'Mentornya dibunuh operator yang dia eliminasi malam ini.'
  }
},

'ending_killer_betrayal_victory': {
  chapter: 3, isEnding: true, endingNumber: 28,
  title: 'Pengkhianatan Sempurna', rating: 'A',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #28: Pengkhianatan Sempurna —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Killer mengkhianati killer. Aliansi gelap runtuh dari dalam. Pengkhianatan membuka celah — protagonis memanfaatkannya.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ketiga operator tidak pernah tahu mereka saudara. Saat masker jatuh — mereka mengenali mata Hendarto Wardhana. Mata yang mereka lihat di cermin setiap pagi. Dalam detik itu, mereka memilih menghancurkan warisan keluarga dari dalam.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Lana mengorbankan diri agar Niko terekspos. Dimas membiarkan diri dikalahkan setelah menyadari "ayah" angkatnya adalah kakek Niko. Pengkhianatan terhadap Ragil. Terhadap darah Wardhana yang sudah terlalu banyak memakan anaknya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Pengkhianatan terbesar seorang Wardhana — memilih berhenti menjadi Wardhana."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menyaksikan tiga saudara Wardhana saling menghancurkan saat menemukan kebenaran.',
    lana: 'Pengkhianatan terakhir: terhadap sistem yang membuat saudara saling membunuh.',
    dimas: 'Membiarkan diri dikalahkan setelah menyadari Ragil kakek yang membuatnya membunuh saudaranya.',
    niko: 'Terekspos oleh pengkhianatan Lana — kasih sayang terakhir saudara yang baru dikenal.'
  }
},

'ending_clues_destroyed': {
  chapter: 4, isEnding: true, endingNumber: 29,
  title: 'Jejak yang Terhapus', rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #29: Jejak yang Terhapus —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Petunjuk pelarian dihancurkan satu per satu. Peta dibakar. Kode dihapus. Kunci dibuang. Mansion jadi labirin tanpa pintu keluar.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tidak semua dihancurkan killer — Ragil dari B-3 mengontrol arena lewat remote. Permainan tidak pernah bisa dimenangkan lewat pelarian. Di antara petunjuk yang hancur: daftar 47 nama — termasuk ibu Arya, kakak Vira, ayah Juno, mentor Reza.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kegelapan terdalam bukan di koridor mansion — tapi di kebenaran yang dihancurkan sebelum kau sempat membacanya."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Nama ibunya ada di petunjuk yang dihancurkan. Kebenaran terbakar.',
    sera: 'Permainan didesain untuk kalah — arena dikontrol sepenuhnya.'
  }
},

'ending_last_standing': {
  chapter: 4, isEnding: true, endingNumber: 30,
  title: 'Yang Terakhir Berdiri', rating: 'A',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    const pcName = { arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira', reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah' }[pc] || pc;
    let text = `<p class="sound">— ENDING #30: Yang Terakhir Berdiri —</p>`;
    text += `<p><span class="speaker arin">Arya</span> ${pcName} — satu-satunya protagonis tersisa. Semua teman jatuh. Semua killer dieliminasi. Kemenangan yang terasa seperti reruntuhan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sendirian di B-3: arsip 50 tahun, 47 nama, koneksi yang menghubungkan semua orang. Ibu Arya mantan operator. Ibu Sera psikolog Dewan. Kakak Vira mati di sini. Lana, Dimas, Niko — semua cucu Hendarto. Kebenaran terlalu besar untuk satu orang.</p>`;
    text += `<p class="sound">— Tapi kau berdiri. Di tengah kegelapan — kau masih berdiri. Dan itu harus cukup. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Yang terakhir berdiri bukan yang terkuat — tapi yang menanggung kebenaran sendirian."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan seluruh kebenaran sendirian. Menanggung beban yang seharusnya ditanggung bersama.',
    sera: 'Jika terakhir berdiri: menemukan file ibunya di arsip Dewan. Sendirian tanpa Arya.',
    juno: 'Jika terakhir berdiri: nama ayahnya sebagai korban pertama. Tidak ada yang tersisa untuk dibaginya.'
  }
}

};

/* ============================================================
   ENDING CONDITION RULES — Condition-based ending selector
   ============================================================ */

const ENDING_CONDITIONS = [

  // ── S-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_masterpiece',
    priority: 100,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const clues = (s.escapeClues || []).length;
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return allKDead && clues >= 5 && survivors.length >= 4 && playerAlive && (s.moralScore || 0) >= 0;
    }
  },

  {
    endingKey: 'ending_true_detective',
    priority: 98,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const clues = (s.escapeClues || []).length;
      const total = s.totalEscapeClues || 8;
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return allKDead && clues >= total && playerAlive;
    }
  },

  {
    endingKey: 'ending_mansion_escape',
    priority: 95,
    condition: (s, wl) => {
      const clues = (s.escapeClues || []).length;
      const needed = s.cluesNeededToWin || 5;
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return (clues >= needed || s.masterKeyFound) && playerAlive && wl && wl.reason === 'mansion_escape';
    }
  },

  {
    endingKey: 'ending_all_killers_dead',
    priority: 93,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return allKDead && playerAlive && survivors.length >= 3 && wl && wl.reason === 'all_killers_eliminated';
    }
  },

  // ── A-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_last_standing',
    priority: 90,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return allKDead && playerAlive && survivors.length === 1;
    }
  },

  {
    endingKey: 'ending_good',
    priority: 88,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const clues = (s.escapeClues || []).length;
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return allKDead && playerAlive && clues >= 2 && clues < 5 && survivors.length >= 2;
    }
  },

  {
    endingKey: 'ending_killer_betrayal_victory',
    priority: 86,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const killersDead = (s.killersDead || []);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return allKDead && playerAlive && (s.killers || []).length >= 2 && killersDead.length >= 2;
    }
  },

  {
    endingKey: 'ending_sacrifice_hero',
    priority: 85,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      const clues = (s.escapeClues || []).length;
      return !playerAlive && survivors.length >= 3 && clues >= 3;
    }
  },

  {
    endingKey: 'ending_survivor_testimony',
    priority: 83,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return playerAlive && s.alive.vira && survivors.length >= 4 && wl && (wl.reason === 'mansion_escape' || wl.reason === 'all_killers_eliminated');
    }
  },

  // ── B-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_lana_redemption',
    priority: 80,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const lanaIsKiller = (s.killers || []).includes('lana');
      return playerAlive && lanaIsKiller && !s.alive.lana && (s.moralScore || 0) >= 0;
    }
  },

  {
    endingKey: 'ending_arin_death_hero',
    priority: 78,
    condition: (s, wl) => {
      const pc = s.playerCharacter || 'arin';
      const playerAlive = s.alive[pc];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return !playerAlive && pc === 'arin' && survivors.length >= 2;
    }
  },

  {
    endingKey: 'ending_vira_closure',
    priority: 76,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return playerAlive && s.alive.vira && survivors.length >= 3 && (s.playerCharacter || 'arin') !== 'vira';
    }
  },

  {
    endingKey: 'ending_broken_victory',
    priority: 74,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return allKDead && playerAlive && survivors.length <= 3 && (s.deathCount || 0) >= 3;
    }
  },

  {
    endingKey: 'ending_bittersweet',
    priority: 72,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const destroyed = (s.destroyedClues || []).length;
      const clues = (s.escapeClues || []).length;
      return allKDead && playerAlive && destroyed >= 3 && clues < 5;
    }
  },

  // ── C-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_niko_truth',
    priority: 65,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const nikoIsKiller = (s.killers || []).includes('niko');
      return playerAlive && s.alive.niko && !nikoIsKiller;
    }
  },

  {
    endingKey: 'ending_lana_double',
    priority: 63,
    condition: (s, wl) => {
      const lanaIsKiller = (s.killers || []).includes('lana');
      const lanaRevealed = (s.killerRevealed || []).includes('lana');
      return lanaIsKiller && s.alive.lana && !lanaRevealed && wl && wl.type !== 'win';
    }
  },

  {
    endingKey: 'ending_sera_profile',
    priority: 61,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && s.alive.sera && wl && wl.reason === 'dawn_reached';
    }
  },

  {
    endingKey: 'ending_pyrrhic',
    priority: 60,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const clues = (s.escapeClues || []).length;
      return playerAlive && allKDead && clues < 3;
    }
  },

  {
    endingKey: 'ending_deal_with_devil',
    priority: 58,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k]);
      return playerAlive && survivors.length >= 8 && (s.moralScore || 0) < -5;
    }
  },

  {
    endingKey: 'ending_split_group',
    priority: 55,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return playerAlive && survivors.length >= 2 && survivors.length <= 4 && wl && wl.reason === 'dawn_reached';
    }
  },

  // ── D-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_clues_destroyed',
    priority: 50,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && wl && wl.reason === 'killer_clues_destroyed';
    }
  },

  {
    endingKey: 'ending_everyone_suspects',
    priority: 48,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const avgTrust = calcAvgTrust(s);
      return playerAlive && avgTrust < 25 && (s.deathCount || 0) >= 2;
    }
  },

  {
    endingKey: 'ending_wrong_accusation',
    priority: 46,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const killerAlive = (s.killers || []).some(k => s.alive[k]);
      return playerAlive && killerAlive && s.alive.sera && wl && wl.reason === 'killer_victory';
    }
  },

  {
    endingKey: 'ending_dimas_betrayal',
    priority: 44,
    condition: (s, wl) => {
      const dimasIsKiller = (s.killers || []).includes('dimas');
      return dimasIsKiller && s.alive.dimas && wl && (wl.reason === 'killer_victory' || wl.type === 'loss');
    }
  },

  {
    endingKey: 'ending_penenun_wins',
    priority: 42,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && wl && wl.reason === 'killer_victory';
    }
  },

  {
    endingKey: 'ending_cycle_continues',
    priority: 40,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const clues = (s.escapeClues || []).length;
      return playerAlive && clues <= 1 && (s.chapter || 1) <= 3;
    }
  },

  // ── F-RANK ──────────────────────────────────────────────────

  {
    endingKey: 'ending_silent_majority',
    priority: 35,
    condition: (s, wl) => {
      const survivors = Object.keys(s.alive).filter(k => s.alive[k]);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && survivors.length >= 7 && (s.moralScore || 0) < -10;
    }
  },

  {
    endingKey: 'ending_total_failure',
    priority: 30,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return playerAlive && survivors.length <= 1 && (s.deathCount || 0) >= 5;
    }
  },

];

function calcAvgTrust(s) {
  if (!s.trust) return 50;
  const keys = Object.keys(s.trust);
  if (keys.length === 0) return 50;
  let sum = 0, count = 0;
  keys.forEach(k => {
    const parts = k.split('_');
    if (parts.length === 2 && s.alive[parts[0]] && s.alive[parts[1]]) {
      sum += s.trust[k];
      count++;
    }
  });
  return count > 0 ? sum / count : 50;
}

function selectEndingFromState(gameState, winLossResult) {
  const sorted = ENDING_CONDITIONS.slice().sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    try {
      if (rule.condition(gameState, winLossResult)) {
        const endingData = STORY_ENDINGS[rule.endingKey];
        if (endingData) {
          return { endingKey: rule.endingKey, endingData: endingData };
        }
      }
    } catch (e) {
      // skip broken conditions
    }
  }

  return selectFallbackEnding(gameState, winLossResult);
}

function selectFallbackEnding(s, wl) {
  const playerAlive = s.alive[s.playerCharacter || 'arin'];
  const allKDead = (s.killers || []).every(k => !s.alive[k]);
  const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));

  if (!playerAlive && survivors.length >= 2) {
    return { endingKey: 'ending_sacrifice_hero', endingData: STORY_ENDINGS['ending_sacrifice_hero'] };
  }
  if (!playerAlive) {
    return { endingKey: 'ending_total_failure', endingData: STORY_ENDINGS['ending_total_failure'] };
  }
  if (allKDead && survivors.length >= 3) {
    return { endingKey: 'ending_all_killers_dead', endingData: STORY_ENDINGS['ending_all_killers_dead'] };
  }
  if (allKDead) {
    return { endingKey: 'ending_broken_victory', endingData: STORY_ENDINGS['ending_broken_victory'] };
  }
  if (wl && (wl.reason === 'killer_victory' || wl.reason === 'killer_clues_destroyed')) {
    return { endingKey: 'ending_penenun_wins', endingData: STORY_ENDINGS['ending_penenun_wins'] };
  }
  if (wl && wl.reason === 'dawn_reached') {
    return { endingKey: 'ending_pyrrhic', endingData: STORY_ENDINGS['ending_pyrrhic'] };
  }
  return { endingKey: 'ending_pyrrhic', endingData: STORY_ENDINGS['ending_pyrrhic'] };
}
