/* ============================================================
   SIMPUL TERAKHIR — ENDINGS (Enhanced Complex Edition)
   30 endings total — trigger otomatis berdasarkan kondisi game.
   Rating: S (terbaik), A, B, C, D, F (terburuk)
   Sistem: condition-based, bukan chapter-locked.
   Setiap ending mengungkap layer kompleks backstory karakter.
   ============================================================ */

/* ============================================================
   ENDING REQUIREMENTS — Ditampilkan di galeri setelah 1 ending terbuka.
   Cerita tetap terkunci, hanya requirement yang terlihat.
   Setiap requirement bisa dipicu oleh brain tree system.
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
// S-RANK ENDINGS (Best outcomes — justice + survival)
// ============================================================

'ending_masterpiece': {
  chapter: 4,
  isEnding: true,
  endingNumber: 1,
  title: 'Sang Penenun Terakhir',
  rating: 'S',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #1: Sang Penenun Terakhir —</p>`;

    // === LAYER 1: The Immediate Victory ===
    text += `<p><span class="speaker arin">Arya</span> Bukti tersebar ke seluruh dunia. Ragil Pramudya ditangkap — pria tua di kursi roda yang mengakui puluhan tahun kejahatan. "Dewan Penenun" teridentifikasi satu per satu: enam individu berkuasa yang dulu merasa tak tersentuh.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Investigasi berlangsung dua tahun. Tujuh negara terlibat. Interpol. FBI. Jaksa Agung.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Hasilnya: 47 kasus kematian terungkap. 23 terpidana. Dan siklus yang telah beroperasi selama setengah abad — berakhir.</p>`;

    // === LAYER 2: The Hidden Truth Behind Everything ===
    text += `<p class="sound">— Tapi kemenangan ini menyimpan kebenaran yang lebih gelap. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Investigasi Interpol mengungkap lapisan yang tidak pernah diduga siapapun. Dewan Penenun bukan sekadar sindikat kejahatan — mereka adalah eksperimen sosial berskala generasi. Didirikan tahun 1974 oleh enam akademisi yang percaya bahwa "seleksi alam" bisa diterapkan pada masyarakat modern.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Hendarto Wardhana — kakek Niko — adalah salah satu pendiri. Bukan sebagai pengusaha kaya yang menyimpan rahasia gelap, tapi sebagai profesor sosiologi yang menulis thesis kontroversial: <em>"Mekanisme Eliminasi Alami dalam Struktur Sosial Urban."</em> Thesis itu ditolak oleh setiap universitas. Jadi Hendarto membuktikannya sendiri — dengan nyawa manusia sebagai data.</p>`;

    // === LAYER 3: Character Background Reveals ===
    text += `<p class="sound">— Dan setiap orang di mansion itu bukan kebetulan. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> File Interpol mengungkap bahwa setiap tamu dipilih berdasarkan "profil eliminasi" yang disusun bertahun-tahun. Arya bukan sekadar jurnalis yang penasaran — ibunya, Ratna Prasetya, adalah jurnalis investigasi yang menyelidiki kematian-kematian misterius yang terhubung dengan Dewan Penenun. Dia ditemukan tewas di kamar hotel di Surabaya tahun 2009. Resmi: serangan jantung. Nyata: obat bius dosis tinggi yang dimasukkan ke minumannya — oleh Dimas Pratama, yang saat itu baru berusia 19 tahun dan menjalani "magang" pertamanya sebagai operator.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera menelan ludah saat membaca file itu. Karena nama ibunya juga ada di sana. Dr. Lestari Amalina — psikolog yang dipekerjakan Dewan untuk "mengevaluasi ketahanan psikologis" para target. Ibunya bukan korban. Ibunya adalah bagian dari mesin. Ibunya mendesain profil psikologis yang menentukan siapa yang diundang — dan siapa yang tidak akan pernah kembali. Sera menghabiskan tiga malam berturut-turut menangis di kamar mandi. Bukan karena malu. Tapi karena kemampuan membaca manusia yang selama ini dia banggakan — adalah warisan dari ibu yang membaca manusia untuk membunuh mereka.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Dan Niko — pewaris mansion — akhirnya memahami mengapa kakeknya meninggalkan surat terakhir yang hanya berisi satu kalimat: "Kau tidak mewarisi rumah. Kau mewarisi hutang." Hutang itu bukan uang. Hutang itu adalah 47 nyawa yang hilang di antara dinding-dinding yang Niko anggap sebagai "rumah nenek."</p>`;

    // Player-specific S-rank epilogue with deeper backgrounds
    const pc = s.playerCharacter || 'arin';
    if (pc === 'arin') {
      text += `<p><span class="speaker arin">Arya</span> Kau tidak membuat podcast tentang malam itu. Kau menulis buku. Non-fiksi. 600 halaman. Best-seller internasional. Judul: <em>Simpul Terakhir</em>. Bab pertama dimulai dengan: "Ibuku dibunuh oleh sistem yang sama. Aku tidak tahu saat itu. Sekarang aku tahu — dan ini ceritaku menutup simpul yang dia mulai."</p>`;
      text += `<p><span class="speaker sera">Sera</span> Di acara peluncuran, Sera duduk di barisan depan. Saat kau membaca bagian tentangnya — wanita yang mewarisi kemampuan membaca jiwa dari ibu yang menggunakan kemampuan itu untuk hal tergelap — dia menangis. Tapi bukan tangis malu. Tangis pelepasan. Dan saat kau turun dari panggung, tangannya sudah menunggu. Kali ini, kau menggenggamnya. Di bawah sinar matahari. Bukan di bawah meja.</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker arin">Arya</span> Kau menulis paper psikologi — bukan tentang malam itu, tapi tentang ibumu. "Kepatuhan Moral dalam Sistem Opresif: Studi Kasus Psikolog dalam Jaringan Kriminal." 400 sitasi dalam setahun. Tapi yang lebih penting: Arya menulis buku tentang malam itu — dan bab tentangmu berjudul "Anak yang Menebus Dosa Ibunya." 40 halaman surat cinta yang tidak pernah dia kirim secara langsung — sampai kau mengetuk pintunya jam tiga pagi dan berkata: "Aku sudah baca babnya. Dan jawabanku: ya."</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker arin">Arya</span> Kau menjual mansion. Setiap batu bata, setiap memori, setiap dinding yang menyimpan jeritan. Hasilnya mendanai yayasan untuk 47 keluarga korban. Di opening ceremony yayasan, wartawan bertanya: "Apa yang kau rasakan sebagai cucu pendiri Dewan Penenun?" Kau diam lama. Lalu: "Aku merasakan apa yang seharusnya kakekku rasakan 50 tahun lalu — rasa malu yang membakar. Tapi rasa malu bisa menjadi bahan bakar untuk sesuatu yang lebih baik." Prosesnya lambat. Menyakitkan. Tapi untuk pertama kalinya dalam hidupmu, kau merasa bebas.</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker reza">Reza</span> Lo bikin instalasi seni tentang malam itu. Tapi yang bikin dunia berhenti adalah piece terakhir: rekonstruksi kamar hotel tempat teman lo — Dara — dibunuh dua tahun lalu. File Interpol mengkonfirmasi: Dara bukan korban hate crime acak. Dara adalah saksi yang hampir mengungkap koneksi Dewan Penenun di Jakarta. Pembunuhnya dipekerjakan oleh Dewan. Lo menangis di depan instalasi itu saat opening night. Reza memeluk lo dari belakang. Lo nggak bilang apa-apa. Lo nggak perlu. Karena akhirnya, lo tahu kenapa Dara mati — dan siapa yang bertanggung jawab.</p>`;
    } else if (pc === 'vira') {
      text += `<p><span class="speaker niko">Niko</span> Kau menjadi saksi kunci di pengadilan. Dua tahun bersaksi. Tapi pengungkapan terbesar datang saat kau menemukan file tentang "penculikanmu" enam bulan lalu. Kau tidak diculik secara acak. Kau dipilih karena kakak perempuanmu — Mira — pernah bekerja sebagai asisten Hendarto Wardhana. Mira menghilang tahun 2019. File Interpol mengonfirmasi: Mira menemukan arsip korban di basement mansion dan mencoba melarikan diri dengan bukti. Dia tidak berhasil. Penculikanmu adalah pesan untuk Mira — yang sudah mati saat pesan itu dikirim. Dan perlahan, dengan kebenaran itu, kau mulai memaafkan. Bukan Sang Penenun. Bukan Niko. Tapi dirimu sendiri.</p>`;
    } else if (pc === 'reza') {
      text += `<p><span class="speaker juno">Juno</span> Kau kembali ke kepolisian sebagai konsultan cold case. Dan kasus pertama yang kau buka kembali adalah kasus "bunuh diri" mentormu — Komisaris Besar Hadian — yang meninggal misterius lima tahun lalu. File Dewan mengungkap: Hadian sudah terlalu dekat dengan kebenaran. Dimas yang "menangani" dia. Kau berhenti minum di malam kau membaca file itu. Menghubungi putrimu — yang selama tiga tahun menolak menjawab teleponmu. "Papa, kenapa sekarang?" "Karena aku akhirnya tahu kenapa Opa Hadian mati. Dan aku butuh seseorang yang masih percaya pada kebenaran." Juno datang ke kantor setiap Jumat dengan kopi. Dua orang yang menemukan ketenangan di antara reruntuhan keadilan.</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker juno">Juno</span> Kau memberikan kesaksian selama enam bulan. Setiap detail. Setiap instruksi. Tapi pengakuan terbesarmu bukan tentang Dewan — tapi tentang kakakmu. Kakakmu, Arum Kusuma, adalah operator sebelummu. Dia dibunuh oleh Dewan saat mencoba keluar. Kau direkrut dengan ancaman: "Lakukan apa yang kakakmu tolak, atau keluargamu yang tersisa bayar harganya." Novel terakhirmu bukan fiksi — bukan horor — tapi memoir. Judul: <em>"Arum: Kakak yang Mati Agar Aku Hidup."</em> Best-seller. Dan untuk pertama kalinya, kau menulis sesuatu yang jujur.</p>`;
    } else if (pc === 'dimas') {
      text += `<p><span class="speaker sera">Sera</span> Kau menyerahkan diri. Di pengadilan, Sera bersaksi atas namamu. "Dia bukan monster," katanya. "Dia anak yang direkrut saat berusia 16 tahun oleh ayah tirinya — anggota Dewan nomor empat — dan dilatih untuk tidak merasakan apapun." File menunjukkan: Dimas Pratama asli meninggal dalam kecelakaan mobil saat usia 6 tahun. Kau — siapapun kau sebenarnya — adalah anak jalanan yang diadopsi dan di-program ulang. Identitasmu dicuri. Empatimu dicabut secara sistematis. Hukumanmu dikurangi. Dan di penjara, kau mulai merasakan penyesalan — bukan karena kau diajarkan, tapi karena untuk pertama kalinya, seseorang memperlakukanmu sebagai manusia.</p>`;
    } else if (pc === 'kira') {
      text += `<p><span class="speaker sera">Sera</span> Bukti digital yang lo upload menjadi fondasi kasus Interpol. Tapi discovery terbesarmu datang setelahnya: saat lo crack server terakhir Dewan, lo menemukan folder berjudul "ALPHA-K." Isinya: rekaman pengawasan hidupmu selama 8 tahun terakhir. Dewan sudah memantaumu sejak lo hack database korporasi pertamamu di usia 15. Mereka berencana merekrutmu sebagai "operator digital." Undangan ke mansion adalah "audisi." Lo bukan tamu — lo target rekrutmen. Tapi lo gagal audisi mereka. Dan itu menyelamatkan jiwamu. Lo bikin startup ethical hacking. Moto-nya: "Data nggak bohong — tapi manusia yang menggunakannya bisa."</p>`;
    } else if (pc === 'farah') {
      text += `<p><span class="speaker sera">Sera</span> Kau melepaskan warisan Aldridge. Tapi sebelum itu, kau menemukan kebenaran yang menghancurkan: ayahmu — Hendrik Aldridge — adalah investor utama Dewan Penenun selama 20 tahun. Fortune keluarga Aldridge yang membiayai sekolahmu, mobilmu, apartemenmu — semuanya dibangun di atas uang darah. Setiap sen yang kau belanjakan sepanjang hidupmu berasal dari mansion-mansion seperti Wardhana yang tersebar di tujuh negara. Kau memuntahkan makan malammu saat membaca laporan keuangan itu. Lalu kau menelepon pengacaramu: "Likuidasi semuanya. Setiap sen terakhir. Untuk kompensasi korban." Prosesnya menyakitkan — seperti melepas kulit. Tapi di ujungnya, kau menemukan sesuatu yang uang tidak bisa beli: tidur tanpa mimpi buruk.</p>`;
    }

    // === LAYER 4: Relationship Aftermath ===
    if (s.alive.niko && s.alive.vira) {
      text += `<p><span class="speaker niko">Niko</span> Niko dan Vira tidak kembali bersama — terlalu banyak luka, terlalu banyak toxic history. Tapi saat file Interpol mengungkap bahwa kakak Vira — Mira — mati di mansion yang sama, Niko berlutut di depan Vira di koridor pengadilan. Bukan meminta maaf untuk hubungan mereka. Tapi untuk dosa keluarganya. Vira tidak menjawab. Tapi di sidang terakhir, saat Niko memberikan kesaksian yang menghancurkan reputasi keluarganya sendiri, Vira ada di galeri. Dan saat mata mereka bertemu, ada sesuatu yang lebih kuat dari cinta dan lebih tahan dari rasa sakit: pengampunan yang tidak perlu diucapkan.</p>`;
    }
    if (s.alive.juno && s.alive.reza) {
      text += `<p><span class="speaker juno">Juno</span> Juno memaksa Reza ke rehabilitasi. Reza memaksa Juno ke terapi. Terapi mengungkap hal yang tidak pernah Juno ceritakan: kematian Dara bukan satu-satunya trauma. Juno kecil menyaksikan ibunya dipukuli oleh ayah yang kemudian menghilang tanpa jejak. File Dewan mengungkap: ayah Juno adalah target eliminasi tahun 2006. Bukan karena dia mengancam Dewan — tapi karena dia berhutang pada mereka dan menolak membayar. Juno menghabiskan seminggu di kamar gelap setelah membaca itu. Lalu dia keluar, membuat mural terbesarnya: sepuluh wajah di cahaya fajar. Di bawahnya: "Mereka yang selamat bukan yang terkuat — tapi yang menemukan seseorang."</p>`;
    }

    let survivors = [];
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) survivors.push(Engine.CHAR_DISPLAY[c]); });

    text += `<p class="sound">— Yang Selamat: ${survivors.join(', ')} —</p>`;
    text += `<p class="sound">— 47 kasus terungkap. 23 terpidana. 6 anggota Dewan diadili. Siklus 50 tahun — berakhir. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul terakhir bukan kematian. Simpul terakhir adalah kebenaran yang mengikat segalanya — dan keberanian untuk menatap bahwa kebenaran itu selalu ada di dalam keluarga kita sendiri."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Jurnalis yang menemukan bahwa ibunya dibunuh oleh sistem yang sama. Menulis buku 600 halaman sebagai penutup simpul yang ibunya mulai.',
    vira: 'Saksi kunci yang menemukan bahwa penculikannya terhubung dengan kematian kakaknya Mira di mansion yang sama. Akhirnya tahu kebenaran.',
    niko: 'Cucu pendiri Dewan Penenun yang memilih menghancurkan warisan keluarganya sendiri. Menjual mansion, mendanai 47 keluarga korban.',
    sera: 'Anak psikolog yang dulu bekerja untuk Dewan. Mewarisi kemampuan membaca manusia — dan memilih menggunakannya untuk menyelamatkan, bukan menghancurkan.',
    juno: 'Pemberontak yang akhirnya tahu bahwa temannya Dara dan ayahnya dibunuh oleh sistem yang sama. Seninya menjadi monumen kebenaran.',
    lana: 'Operator yang direkrut setelah kakaknya Arum dibunuh karena menolak. Memilih bersaksi dan menulis memoar jujur pertamanya.',
    reza: 'Detektif yang menemukan bahwa mentornya Komisaris Hadian dibunuh oleh Dewan. Kembali ke kepolisian dengan misi baru.',
    dimas: 'Anak jalanan yang diadopsi dan di-program ulang menjadi pembunuh sejak usia 16. Identitas aslinya bukan Dimas Pratama. Mulai merasakan empati untuk pertama kalinya.',
    kira: 'Target rekrutmen Dewan yang tanpa sadar "gagal audisi" — dan keputusan itu menyelamatkan jiwanya. Membangun platform keamanan.',
    farah: 'Pewaris yang menemukan bahwa fortune keluarganya dibangun dari uang darah Dewan selama 20 tahun. Melikuidasi segalanya untuk kompensasi korban.'
  }
},

'ending_true_detective': {
  chapter: 4,
  isEnding: true,
  endingNumber: 2,
  title: 'Detektif Sejati',
  rating: 'S',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #2: Detektif Sejati —</p>`;
    text += `<p><span class="speaker juno">Juno</span> Kau menemukan semua clue — semua delapan petunjuk pelarian yang tersebar di setiap sudut mansion. Mengungkap semua operator. Melacak Dewan Penenun. Dan membawa Ragil hidup-hidup ke tangan hukum.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Proses pengadilan memakan waktu tiga tahun. Tapi hasilnya: keadilan. Bukan keadilan sempurna — karena yang mati tidak bisa kembali — tapi keadilan yang cukup untuk memberikan closure.</p>`;

    // === Deep Reveal: The 8th Clue ===
    text += `<p class="sound">— Tapi petunjuk kedelapan — Dokumen Evakuasi dari Aula Utama — menyimpan rahasia tergelap. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Dokumen itu bukan sekadar prosedur evakuasi. Itu adalah daftar lengkap — 47 nama — setiap orang yang pernah "diundang" ke mansion selama 50 tahun. Dan di samping setiap nama: tanggal kematian, metode eliminasi, dan... nama operator yang melakukan eksekusi. Daftar itu ditulis tangan oleh Hendarto Wardhana sendiri — dengan kaligrafi yang rapi dan indah, seolah dia mencatat pesanan katering, bukan pembunuhan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Di antara 47 nama itu, Sera menemukan dua yang menghentikan jantungnya: nomor 31 — <em>Ratna Prasetya</em> — ibu Arya. Dan nomor 38 — <em>Mira Handayani</em> — kakak Vira. Keduanya ditandai dengan tinta merah: "Eliminasi terkonfirmasi. Operator: D-07." D-07 adalah kode Dimas.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Saat Arya membaca nama ibunya di daftar itu — di mansion yang sama di mana ibunya pernah berjalan, bernapas, dan akhirnya berhenti bernapas — dia tidak menangis. Dia mematikan recorder-nya. Untuk pertama kalinya dalam karirnya, ada cerita yang terlalu personal untuk dijadikan konten.</p>`;

    // === The Award Night ===
    text += `<p><span class="speaker arin">Arya</span> Arya menerima penghargaan jurnalisme investigasi tertinggi. Bukan untuk podcast — tapi untuk keberanian yang melampaui job description. Di pidatonya, dia berkata: "Penghargaan ini bukan untuk saya. Ini untuk seorang jurnalis bernama Ratna Prasetya yang mengejar cerita yang sama 15 tahun sebelum saya — dan dibunuh karena itu. Dia ibuku. Dan simpul yang dia mulai, akhirnya tertutup malam ini."</p>`;
    text += `<p><span class="speaker arin">Arya</span> Di malam penghargaan, Sera ada di sampingnya. Bukan sebagai kolega. Bukan sebagai narasumber. Sebagai orang yang membuatnya pulang. "Kau tahu," bisik Sera saat tepuk tangan mereda, "aku sudah menganalisis hubungan kita dari setiap sudut psikologis." "Dan?" "Dan kesimpulannya: ibuku menggunakan psikologi untuk membunuh. Aku menggunakan psikologi untuk mencintai. Dan aku memilih ini." Arya mencium keningnya — gesture kecil yang mengatakan lebih banyak dari 600 halaman buku.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul terakhir adalah simpul yang kau ikat sendiri — dengan keberanian yang tidak kau tahu kau punya, dengan kebenaran yang menghancurkan sebelum menyembuhkan, dan cinta yang lahir di antara abu-abu yang paling gelap."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan nama ibunya di daftar 47 korban. Menerima Pulitzer atas nama Ratna Prasetya. Akhirnya membiarkan diri dicintai.',
    sera: 'Menemukan koneksi ibunya dengan Dewan. Memilih menggunakan warisan psikologisnya untuk kebaikan — dimulai dari mencintai Arya.',
    vira: 'Menemukan nama kakaknya Mira sebagai korban nomor 38. Closure yang menyakitkan tapi membebaskan.'
  }
},

// ============================================================
// A-RANK ENDINGS (Good outcomes — mostly justice)
// ============================================================

'ending_good': {
  chapter: 4,
  isEnding: true,
  endingNumber: 3,
  title: 'Fajar yang Cukup',
  rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #3: Fajar yang Cukup —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Mansion di belakang. Fajar di depan. Bukti cukup untuk memulai investigasi — tapi tidak cukup untuk menghancurkan seluruh jaringan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Ragil meninggal dua bulan kemudian — kanker yang sudah terlalu lama ditunda. Dewan Penenun teridentifikasi sebagian. Tiga dari enam diadili. Sisanya — menghilang.</p>`;

    // === Hidden Complexity ===
    text += `<p class="sound">— Tapi siklus ini — siklus Wardhana — berakhir. Dan dalam proses itu, kebenaran-kebenaran kecil terungkap. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Investigasi parsial mengungkap satu kebenaran yang mengubah segalanya: undangan hitam yang diterima setiap orang bukan acak. Ragil mengirim undangan berdasarkan "Indeks Kerentanan" — profil psikologis yang menilai seberapa mudah seseorang dimanipulasi, seberapa besar trauma yang mereka simpan, dan seberapa kecil kemungkinan mereka dipercaya jika bersaksi. Semua orang di mansion itu dipilih karena mereka <em>sudah rusak</em> — dan karena dunia tidak akan percaya orang-orang yang sudah rusak.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya menemukan profil Indeks Kerentanannya sendiri: "Arin Prasetya — Skor: 87/100. Obsesif, menyimpan trauma kematian ibu, kecenderungan self-destructive, kredibilitas publik rendah karena teori konspirasi podcast. Ideal sebagai saksi yang tidak akan dipercaya." Membaca itu seperti membaca ulang seluruh hidupnya — dan menyadari bahwa setiap keputusan "berani" yang dia buat selama ini... persis sesuai prediksi seorang psikopat di kursi roda.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya melanjutkan podcast-nya. Episode tentang malam itu menjadi yang paling banyak didengarkan. Tapi kali ini, dia membacakan Indeks Kerentanannya sendiri on-air. "Ragil pikir aku terlalu rusak untuk dipercaya. Tapi kebenaran tidak butuh orang yang sempurna. Kebenaran butuh orang yang keras kepala." Dan kali ini — orang percaya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sera mendengarkan episode itu dari apartemennya. Menangis. Bukan karena ceritanya — tapi karena dia menemukan Indeks Kerentanannya sendiri di file yang sama: "Sera Amalina — Skor: 91/100. Anak psikolog Dewan, menyimpan guilt bawah sadar, cenderung over-analisis hingga paralysis. Ideal sebagai profiler yang terlalu takut bertindak." Sera menelepon Arya pukul tiga pagi. Tidak bicara apa-apa selama dua menit pertama. Lalu: "Kita berdua dipilih karena kita rusak. Tapi kopi besok pagi?" "Ya." "Dan setelah itu?" "Kita buktikan bahwa rusak bukan berarti kalah." Cukup. Untuk sekarang, cukup.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Tidak semua simpul bisa diurai. Tapi kau bisa memilih siapa yang menggenggam ujung benang bersamamu — bahkan jika benang itu sudah lusuh dan hampir putus."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan "Indeks Kerentanan"-nya — dipilih karena dianggap terlalu rusak untuk dipercaya. Membuktikan prediksi Ragil salah.',
    sera: 'Skor kerentanan 91/100. Anak psikolog Dewan yang dianggap terlalu paralisis untuk bertindak. Memilih bertindak — dimulai dari telepon jam 3 pagi.'
  }
},

'ending_sacrifice_hero': {
  chapter: 4,
  isEnding: true,
  endingNumber: 4,
  title: 'Pengorbanan',
  rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #4: Pengorbanan —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau turun ke B-3 terakhir kali untuk memastikan bukti terkirim. Api sudah di B-1. Asap di mana-mana.</p>`;
    text += `<p class="sound">— Upload selesai. 100%. Ke dunia. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Tapi tangga kembali sudah tertutup puing. Ventilasi menyemburkan asap. Kau terjebak.</p>`;

    // === Deep reveal: Why Arya chose to go down ===
    text += `<p><span class="speaker arin">Arya</span> Di monitor terakhir yang masih menyala, kau melihat teman-temanmu di luar. Selamat. Dan di samping monitor, kau menemukan satu file terakhir di komputer Ragil — email dari 2009 yang tidak pernah terkirim. Pengirim: <em>ratna.prasetya@mail.com</em>. Ibumu. Email itu berisi satu paragraf: "Aku tahu siapa Sang Penenun. Aku punya buktinya. Kalau sesuatu terjadi padaku, tolong pastikan Arya tidak pernah tahu tentang ini. Dia masih terlalu kecil. Tapi kalau dia sudah besar... kalau dia jadi jurnalis seperti aku... mungkin dia akan menyelesaikan apa yang aku mulai." Kau membaca email itu sambil asap mengisi paru-parumu. Dan kau tersenyum. Karena ya, Bu. Simpulmu sudah tertutup.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera berhenti. Berbalik. Berteriak namamu — suara yang tidak pernah kau dengar darinya: bukan analitis, bukan profesional, tapi mentah, hancur, dan penuh cinta yang tidak pernah sempat diucapkan. Juno menahan Sera. Sera melawan. Juno tidak melepaskan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Kau duduk di kursi roda Ragil. Ironi akhir. Jurnalis yang selalu mencari kebenaran — akhirnya menjadi bagian dari cerita. Anak yang menyelesaikan simpul ibunya.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Podcast terakhirmu merekam sendiri: suara napas yang semakin tipis, asap yang semakin pekat, dan kata-kata terakhir:</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Sera... aku baru baca email ibu. Dia tahu. Dia selalu tahu. Dan dia berharap aku menyelesaikannya. Dan aku baru sadar... aku turun ke sini bukan karena berani. Aku turun karena ini memang takdirku. Tapi satu hal yang bukan takdir — satu hal yang aku pilih sendiri — adalah perasaanku padamu. Maaf aku tidak sempat—"</em></p>`;
    text += `<p class="sound">— Rekaman berhenti. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tiga bulan kemudian, Sera menemukan email Ratna di file yang di-upload Arya. Membacanya delapan kali. Menangis setiap kali. Lalu menulis buku. Bukan paper psikologi. Buku tentang dua generasi wanita dan pria yang mengejar kebenaran yang sama — Ratna dan Arya, ibu dan anak, yang keduanya memilih kebenaran di atas segalanya. Dedikasi: <em>"Untuk A dan R. Dua simpul dalam satu benang. Sekarang milikku selamanya."</em></p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul terakhir... adalah warisan. Dari ibu ke anak. Dari cinta yang tidak terucapkan ke cinta yang tidak sempat diucapkan. Simpul yang menyakitkan — tapi yang membuat segalanya berarti."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan email terakhir ibunya di komputer Ragil sebelum meninggal. Menyelesaikan simpul dua generasi. Cinta terakhirnya: Sera.',
    sera: 'Menulis buku tentang dua generasi pencari kebenaran — Ratna dan Arya. Dedikasi untuk A dan R. Menanggung cinta dua orang yang tidak sempat menggenggam.'
  }
},

'ending_survivor_testimony': {
  chapter: 4,
  isEnding: true,
  endingNumber: 5,
  title: 'Kesaksian Terakhir',
  rating: 'A',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #5: Kesaksian Terakhir —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira membawa kalian ke pintu darurat yang hanya dia ketahui — warisan dari malam pertamanya di mansion enam bulan lalu.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Kalian keluar. Ke hutan. Ke fajar. Ke dunia yang belum tahu apa yang terjadi di dalam.</p>`;

    // === Deep reveal: Why Vira knew the exit ===
    text += `<p class="sound">— Tapi kebenaran tentang mengapa Vira tahu pintu itu jauh lebih gelap. —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Enam bulan lalu, Vira bukan sekadar "diundang" ke mansion. Dia diculik dan dijadikan "percobaan" — test run untuk malam ini. Tapi yang tidak pernah dia ceritakan: di malam penculikannya, ada satu orang lain bersamanya. Kakaknya, Mira. Mira yang menemukan pintu darurat itu. Mira yang mendorong Vira keluar. Dan Mira yang... tidak sempat ikut keluar. Vira berlari tanpa menoleh. Dan suara terakhir yang dia dengar dari dalam mansion adalah kakaknya berteriak: "Lari! Jangan pernah kembali!"</p>`;
    text += `<p><span class="speaker vira">Vira</span> Tapi Vira kembali. Malam ini. Bukan karena berani. Tapi karena hidup enam bulan dengan meninggalkan kakaknya jauh lebih menyakitkan daripada mati di mansion yang sama.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Dan malam ini, saat Vira membuka pintu yang sama untuk kalian, dia berbisik ke kegelapan di baliknya: "Kak Mira... kali ini aku tidak lari. Kali ini aku bawa mereka semua keluar."</p>`;
    text += `<p><span class="speaker vira">Vira</span> Bersama-sama, kalian memberikan kesaksian kepada media, polisi, dan komisi HAM. Vira menjadi saksi utama — bukan karena paling berani, tapi karena dia satu-satunya yang pernah ke mansion itu dua kali. Dan selamat. Dua kali.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Di pengadilan, saat jaksa bertanya mengapa dia kembali, Vira menjawab: "Karena enam bulan lalu aku meninggalkan kakakku di balik pintu itu. Dan setiap malam sejak itu, aku mendengar suaranya berteriak 'Lari!' Dan aku tidak mau mendengar suara itu lagi. Aku mau mendengar suara baru: 'Selamat. Semua selamat.'"</p>`;
    text += `<p><span class="speaker vira">Vira</span> <em>"Simpul yang paling kuat adalah simpul yang diikat oleh banyak tangan — termasuk tangan yang sudah tidak ada. Karena Mira, pintu itu tetap terbuka. Dan karena aku kembali, pintu itu akhirnya berarti sesuatu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Saksi utama. Suaranya menggema di tujuh sidang pengadilan.',
    vira: 'Kembali ke mansion tempat kakaknya Mira mati enam bulan lalu. Membuka pintu yang sama — kali ini untuk semua orang. Saksi yang datang dua kali dan selamat dua kali.',
    sera: 'Menulis profil psikologis Vira — "Courage Under Repeated Trauma" — yang menjadi referensi standar untuk konseling korban penculikan.'
  }
},

// ============================================================
// B-RANK ENDINGS (Bittersweet — survival with cost)
// ============================================================

'ending_bittersweet': {
  chapter: 4,
  isEnding: true,
  endingNumber: 6,
  title: 'Abu dan Fajar',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #6: Abu dan Fajar —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Mansion terbakar. Bukti terbakar. Ragil terbakar. Dan bersamanya — kemungkinan keadilan yang sempurna.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Kalian selamat. Tapi tanpa bukti fisik, kasus ini menjadi "cerita" — bukan fakta.</p>`;

    // === Deep reveal: Who started the fire ===
    text += `<p class="sound">— Yang tidak diketahui siapapun: api itu tidak memulai dirinya sendiri. —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Ragil memprogram sistem self-destruct mansion 30 tahun lalu — sebuah "dead man's switch" yang terhubung dengan detak jantungnya lewat monitor medis di Bunker B-3. Saat jantung Ragil berhenti — entah karena usia, kanker, atau takdir — sistem itu mengaktifkan incendiary devices yang tersembunyi di setiap dinding mansion. Hendarto Wardhana mendesainnya sebagai "polis asuransi terakhir": jika siklus terancam terekspos, hancurkan segalanya. Termasuk bukti. Termasuk saksi. Tapi kalian berhasil keluar sebelum api mengonsumsi segalanya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya mempublikasikan podcast tentang malam itu. Viral. Kontroversial. Separuh dunia percaya, separuh menganggapnya fiksi. Tapi Arya menemukan satu hal di rekaman CCTV yang sempat di-download Kai sebelum api memusnahkan server: footage tahun 2009. Seorang wanita — rambut hitam, jaket jurnalis, mata tajam yang sangat familiar — berjalan di koridor mansion yang sama. Ibunya. Ratna Prasetya pernah di sini. Pernah berjalan di koridor yang sama. Dan tidak pernah keluar.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Tapi cukup banyak yang percaya untuk memulai investigasi independen. Dan footage itu — 47 detik rekaman ibunya berjalan di mansion — menjadi bukti yang tidak bisa dibakar. Cukup banyak simpul yang terurai — pelan, tapi pasti.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang kebenaran tidak datang sebagai kilat — tapi sebagai fajar. Pelan. Sabar. Tak terbendung. Dan kadang, kebenaran itu berwajah ibumu yang berjalan di koridor gelap — 15 tahun sebelum kau berjalan di koridor yang sama."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan footage CCTV ibunya berjalan di mansion 15 tahun lalu. Podcaster kontroversial yang akhirnya punya bukti tak terbantahkan.',
    niko: 'Menemukan bahwa kakeknya mendesain dead man\'s switch untuk menghancurkan semua bukti. Warisan yang terus menghantui.'
  }
},

'ending_broken_victory': {
  chapter: 4,
  isEnding: true,
  endingNumber: 7,
  title: 'Kemenangan yang Pecah',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #7: Kemenangan yang Pecah —</p>`;
    text += `<p class="sound">— Kau menang. Ragil diadili. Bukti tersebar. Siklus berakhir. —</p>`;
    text += `<p class="sound">— Tapi kemenangan ini berasa seperti kaca pecah di mulut. Setiap fragmen mengiris. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> PTSD. Insomnia. Hubungan yang hancur. Teman-teman yang mati masih muncul di mimpi — bukan sebagai hantu, tapi sebagai pengingat bahwa kau selamat dan mereka tidak.</p>`;

    // === Deep reveal: Survivor's guilt and hidden connections ===
    text += `<p><span class="speaker sera">Sera</span> Dua tahun setelah malam itu, terapis Arya memintanya membuat daftar: "Tulis nama setiap orang yang mati malam itu dan satu hal yang kau ketahui tentang mereka." Arya menulis. Dan di setiap nama, dia menambahkan apa yang investigasi Interpol ungkap — kebenaran yang membuat setiap kematian lebih menyakitkan karena <em>mereka semua terhubung.</em></p>`;
    text += `<p><span class="speaker arin">Arya</span> Setiap orang yang mati malam itu ternyata punya koneksi ke korban sebelumnya. Seorang anak yang bapaknya hilang 1998. Seorang cucu yang neneknya "kecelakaan" 2003. Seorang keponakan yang pamannya "bunuh diri" 2007. Ragil tidak hanya mengundang orang-orang yang rentan — dia mengundang generasi kedua dari keluarga korbannya. Mansion itu bukan sekadar arena pembunuhan. Mansion itu adalah perangkap generasi — memastikan bahwa keluarga yang sudah kehilangan satu anggota... kehilangan satu lagi.</p>`;
    text += `<p class="sound">— Terapi membantu. Pelan. Tahun demi tahun. Mengetahui kebenaran itu bukan penyembuhan — tapi awal dari penyembuhan yang nyata. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sepuluh tahun kemudian, Arya berdiri di depan reruntuhan mansion Wardhana yang sudah ditumbuhi tanaman liar. Monumen kecil untuk korban berdiri di antara puing — bukan 10 nama, tapi 47. Lima dekade. Dan namanya tidak ada di sana. Tapi nama ibunya ada.</p>`;
    text += `<p class="sound">— Dia tidak menangis. Sudah tidak bisa. Tapi dia menaruh dua bunga — satu untuk mereka yang mati malam itu, satu untuk ibu yang mati 15 tahun sebelumnya di tempat yang sama — dan pergi. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kemenangan terbesar bukan mengalahkan monster. Tapi tetap manusia setelahnya — sambil menanggung pengetahuan bahwa monster itu merencanakan semuanya. Termasuk siapa yang selamat."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan bahwa semua korban malam itu adalah generasi kedua dari keluarga korban sebelumnya. Mansion adalah perangkap generasi. Masih berjuang. Masih manusia.',
    sera: 'Terapis yang menolong Arya menemukan kebenaran melalui terapi. Menanggung beban profesional terberat: menyembuhkan orang yang kau cintai.'
  }
},

'ending_lana_redemption': {
  chapter: 4,
  isEnding: true,
  endingNumber: 8,
  title: 'Penebusan Penulis',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #8: Penebusan Penulis —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Lana Kusuma — operator, penulis skenario, anti-heroine — memilih redemption arc yang tidak pernah dia tulis untuk dirinya sendiri.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Dia menghadapi Ragil sendirian. Mengalihkan perhatiannya sementara yang lain kabur. Dan saat mansion terbakar — Lana tidak keluar.</p>`;

    // === Deep reveal: Lana's true story ===
    text += `<p class="sound">— Novel terakhirnya ditemukan di tas yang ditinggalkan di luar. Dan isinya mengungkap segalanya. —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Bab pertama dimulai dengan: "Nama asli saya bukan Lana Kusuma. Nama asli saya adalah Lana Wardhana. Saya cucu perempuan Hendarto Wardhana — sepupu Niko yang tidak pernah diakui keluarga." Kebenaran itu mengubah segalanya. Lana bukan sekadar operator yang direkrut — dia adalah anak haram dari putra kedua Hendarto yang dibuang dari silsilah keluarga karena "mempermalukan nama Wardhana." Lana tumbuh di panti asuhan. Kakaknya Arum yang merawatnya — dan Arum yang diculik Dewan saat Lana berusia 14 tahun sebagai leverage.</p>`;
    text += `<p><span class="speaker lana">Lana</span> "Saya menjadi penulis karena satu-satunya kekuatan saya adalah kata-kata. Dan saya menjadi operator karena Sang Penenun memberikan pilihan: 'Lakukan apa yang kami minta, atau kakakmu mati.' Arum sudah mati saat saya menerima tawaran itu. Tapi saya baru tahu itu tujuh tahun kemudian." Novel itu bukan tentang pembunuhan. Tentang anak perempuan yang menulis cerita agar dunia tidak terasa segelap kenyataannya. Tentang penulis yang hidup di dalam fiksi karena realitas terlalu kejam.</p>`;
    text += `<p class="sound">— Best-seller posthumous. Bukan karena sensasional — tapi karena jujur. Proceeds ke yayasan kesehatan mental dan panti asuhan tempat Lana tumbuh. —</p>`;
    text += `<p><span class="speaker lana">Lana</span> <em>"Ending terbaik untuk seorang penulis bukan ending yang sempurna — tapi ending yang jujur. Dan kebenaran yang paling jujur tentang saya: saya bukan villain. Saya korban yang dipaksa menjadi villain. Dan malam ini, saya menulis ulang peran saya sendiri."</em></p>`;
    return text;
  },
  fates: {
    lana: 'Lana Wardhana — cucu haram Hendarto, sepupu Niko yang tidak diakui. Operator yang dipaksa oleh ancaman terhadap kakaknya Arum. Novel terakhirnya mengungkap segalanya. Mati dengan kebenaran.',
    niko: 'Menemukan bahwa Lana adalah sepupunya — darah Wardhana yang sama. Dosa keluarga yang lebih dalam dari yang dia bayangkan.'
  }
},

'ending_vira_closure': {
  chapter: 3,
  isEnding: true,
  endingNumber: 9,
  title: 'Lingkaran Vira',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #9: Lingkaran Vira —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira membawamu ke pintu yang hanya dia tahu. Keluar dari mansion. Ke tempat aman.</p>`;
    text += `<p class="sound">— Tapi sebelum keluar, dia berhenti. "Aku harus kembali." —</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Kenapa?"</p>`;

    // === Deep reveal: The full truth about Vira's first visit ===
    text += `<p><span class="speaker vira">Vira</span> "Karena enam bulan lalu, aku meninggalkan kakakku di balik pintu ini. Mira mendorongku keluar dan berkata 'Jangan pernah kembali.' Tapi yang tidak pernah aku ceritakan... Mira bukan sekadar kakakku. Mira adalah agen rahasia yang menyusup ke jaringan Dewan Penenun selama dua tahun. Dia berpura-pura bekerja sebagai asisten Hendarto Wardhana untuk mengumpulkan bukti dari dalam. Penculikan kami bukan acak — Mira sengaja membawa dirinya ke mansion karena arsip utama Dewan ada di Bunker B-3. Dan aku... aku hanya adik kecil bodoh yang ikut tanpa tahu apa-apa."</p>`;
    text += `<p><span class="speaker vira">Vira</span> "Mira menemukan arsipnya. USB drive dengan 47 nama korban. Tapi saat kami mencoba keluar, Ragil sudah tahu. Mira memberikan USB itu padaku dan mendorongku ke pintu darurat. 'Simpan ini. Jangan pernah kembali. Dan jangan pernah buka sampai waktunya tepat.' Aku berlari. Aku menyimpan USB itu selama enam bulan tanpa pernah membukanya. Karena membukanya berarti mengakui bahwa Mira tidak akan pernah kembali."</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira kembali. Bukan hanya untuk menyelamatkan orang. Tapi untuk menyelesaikan misi kakaknya. USB drive Mira — yang selama enam bulan tersimpan di kotak sepatu di bawah tempat tidur Vira — akhirnya di-upload malam ini. 47 nama. 50 tahun. Satu file yang mengubah segalanya.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Vira membawa keluar tiga orang lagi sebelum pintu terkunci permanen. Lingkaran tertutup. Adik yang kembali untuk menyelesaikan misi kakaknya — dengan pintu yang sama, tapi ending yang berbeda.</p>`;
    text += `<p><span class="speaker vira">Vira</span> <em>"Simpul yang paling kuat adalah yang diikat oleh orang yang pernah terputus. Mira memulai simpul ini. Aku menutupnya. Dan antara dua titik itu — di ruang antara kakak dan adik — ada keberanian yang tidak bisa diukur oleh siapapun."</em></p>`;
    return text;
  },
  fates: {
    vira: 'Mengungkap bahwa kakaknya Mira adalah agen rahasia yang menyusup ke Dewan Penenun. USB drive Mira menjadi bukti utama. Lingkaran dua kakak-beradik yang akhirnya tertutup.',
    niko: 'Menemukan bahwa asisten kakeknya — Mira — sebenarnya agen yang menyusup untuk menghancurkan Dewan dari dalam.'
  }
},

// ============================================================
// C-RANK ENDINGS (Mixed — survival but system continues)
// ============================================================

'ending_pyrrhic': {
  chapter: 4,
  isEnding: true,
  endingNumber: 10,
  title: 'Kemenangan Pyrrhic',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #10: Kemenangan Pyrrhic —</p>`;
    text += `<p><span class="speaker vira">Vira</span> Kau selamat. Beberapa temanmu selamat. Ragil mati — kanker atau api, tidak jelas mana yang lebih dulu.</p>`;
    text += `<p><span class="speaker vira">Vira</span> Tapi Dewan Penenun tidak pernah teridentifikasi. Bukti tidak cukup. Dan setahun kemudian — undangan hitam muncul lagi. Di kota berbeda. Mansion berbeda.</p>`;

    // === Deep reveal: The cycle's reach ===
    text += `<p class="sound">— Siklus berlanjut. Dan ternyata jauh lebih besar dari yang kau bayangkan. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya menyelidiki undangan baru itu. Dan menemukan jaringan yang membuat bulu kuduk berdiri: Mansion Wardhana bukan satu-satunya. Ada tujuh "arena" di seluruh Asia Tenggara — Jakarta, Kuala Lumpur, Bangkok, Manila, Ho Chi Minh, Singapura, dan Bali. Masing-masing dioperasikan oleh anggota Dewan yang berbeda. Masing-masing dengan "siklus" sendiri. Mansion Wardhana hanya satu simpul dari tujuh. Dan dengan kematian Ragil, enam simpul lainnya... mengencangkan ikatannya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya tahu. Dan tidak bisa berbuat apa-apa. Karena bukti yang dia punya — terlalu sedikit petunjuk dari mansion — tidak cukup untuk menghubungkan tujuh arena itu. Dia tahu kebenaran yang menghancurkan: kemenangannya di mansion Wardhana hanya membuat enam mansion lainnya lebih hati-hati. Lebih tersembunyi. Lebih berbahaya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang simpul terakhir bukan ending — tapi koma. Jeda sebelum kalimat berikutnya. Dan kadang, memotong satu simpul hanya membuat enam simpul lainnya lebih kuat."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan bahwa Mansion Wardhana hanya 1 dari 7 arena di Asia Tenggara. Kemenangan parsial yang membuat jaringan lain lebih waspada.'
  }
},

'ending_deal_with_devil': {
  chapter: 4,
  isEnding: true,
  endingNumber: 11,
  title: 'Perjanjian dengan Iblis',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #11: Perjanjian dengan Iblis —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Ragil menawarkan deal: lepaskan dia, dan dia membuka semua pintu. Semua orang selamat. Tidak ada kematian lagi.</p>`;
    text += `<p class="sound">— Kau menerima. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Semua keluar. Semua hidup. Ragil menghilang — bersama systemnya, bersama buktinya, bersama segalanya.</p>`;

    // === Deep reveal: Who Ragil passed the system to ===
    text += `<p class="sound">— Sebulan kemudian, Ragil mati karena kanker. Tapi yang dia wariskan jauh lebih mengerikan dari yang kau bayangkan. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ragil tidak mewariskan "Dewan Penenun" ke orang asing. Dia mewariskannya ke seseorang yang sangat dekat dengan kalian semua. Dalam wasiatnya, Ragil menulis: "Sistem ini membutuhkan seseorang yang memahami manusia lebih baik dari siapapun. Seseorang yang bisa membaca jiwa. Seseorang yang punya data tentang setiap korban potensial." Wasiat itu ditujukan ke seseorang dengan inisial "S.A." — dan Sera Amalina membaca wasiat itu dalam mimpi buruknya setiap malam. Bukan karena dia menerima — tapi karena ibunya, Dr. Lestari Amalina, yang menerima atas namanya 20 tahun sebelumnya.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera menemukan kebenaran yang menghancurkan: ibunya bukan sekadar psikolog yang bekerja untuk Dewan. Ibunya adalah kandidat pewaris berikutnya — "Penenun Generasi Ketiga." Dan kemampuan Sera membaca manusia — kemampuan yang selalu dia banggakan — adalah hasil "pelatihan" subliminal yang ibunya terapkan sejak Sera berusia 4 tahun. Sera tidak pernah memilih menjadi profiler. Dia di-program untuk itu.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau menyelamatkan nyawa malam itu. Tapi mengorbankan keadilan untuk tahun-tahun mendatang. Dan yang paling menyakitkan: deal dengan Ragil membiarkan warisan itu tersembunyi — termasuk kebenaran tentang Sera yang tidak pernah terungkap ke publik.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul yang kau ikat dengan iblis tidak pernah benar-benar terurai. Dan kadang, iblis itu sudah menanam benihnya jauh sebelum kau bertemu — di jantung orang yang paling kau percaya."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Hidup. Semua hidup. Tapi deal dengan Ragil menyembunyikan kebenaran tentang ibu Sera yang seharusnya terungkap.',
    sera: 'Tanpa mengetahuinya, ibunya adalah kandidat pewaris Dewan. Kemampuan psikologisnya adalah hasil "program" subliminal sejak usia 4 tahun. Kebenaran ini tetap tersembunyi.'
  }
},

'ending_split_group': {
  chapter: 3,
  isEnding: true,
  endingNumber: 12,
  title: 'Perpecahan Fatal',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #12: Perpecahan Fatal —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kelompok terpecah dan tidak pernah bersatu kembali. Sebagian berhasil keluar melalui jendela. Sebagian terjebak sampai fajar.</p>`;

    // === Deep reveal: Why the group split ===
    text += `<p class="sound">— Perpecahan itu bukan kebetulan. Itu dirancang. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Analisis post-trauma yang dilakukan Sera mengungkap pola yang menakutkan: perpecahan kelompok dipicu oleh "kata-kata kunci" yang ditanam Lana dalam percakapan sepanjang malam. Frasa-frasa yang secara subliminal memicu ketidakpercayaan — "Kau yakin dia bisa dipercaya?", "Bukankah aneh dia selalu tahu jalan?", "Aku cuma bilang, aku pernah lihat dia..." Lana tidak hanya membunuh secara fisik — dia membunuh kepercayaan. Dan setiap perpecahan dalam kelompok... adalah halaman dari skenario yang sudah dia tulis sebelum malam itu dimulai.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Yang keluar lebih dulu menghubungi polisi — tapi saat polisi tiba, mansion sudah bersih. Sistem self-destruct yang disiapkan Ragil menghapus semua bukti. Dan kelompok yang terpecah itu tidak pernah bersaksi bersama — karena kata-kata Lana masih beresonansi. Mereka tidak saling percaya, bahkan setelah keluar.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang perpecahan bukan kekalahan — tapi senjata terbaik seorang penulis yang menulis skenario di mana karakter-karakternya saling menghancurkan. Dan yang paling menakutkan: setelah keluar, kau masih tidak tahu mana yang nyata dan mana yang ditanam."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Selamat tapi terpecah dari kelompok. Kata-kata Lana masih beresonansi — tidak bisa mempercayai siapapun, termasuk teman.',
    lana: 'Skenarionya berhasil sempurna. Kelompok terpecah persis seperti yang dia tulis. Perpecahan sebagai senjata.'
  }
},

'ending_niko_truth': {
  chapter: 3,
  isEnding: true,
  endingNumber: 13,
  title: 'Warisan Wardhana',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #13: Warisan Wardhana —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Niko membawamu ke exit yang hanya pewaris Wardhana yang tahu. Lorong rahasia di balik perpustakaan — dibangun 50 tahun lalu sebagai escape route.</p>`;

    // === Deep reveal: Why the escape route exists ===
    text += `<p><span class="speaker niko">Niko</span> "Kakekku membangun jalan keluar ini." Niko berhenti. Menatap dinding lorong. "Tapi bukan untuk tamu. Ini dibangun untuk keluarga Wardhana. Kakekku tahu — selalu tahu — bahwa suatu hari, salah satu cucunya akan berada di sisi yang salah dari permainan ini. Dan dia menyiapkan jalan keluar... hanya untuk darah Wardhana."</p>`;
    text += `<p><span class="speaker niko">Niko</span> "Yang lebih mengerikan: di dinding lorong ini ada foto-foto. Dua puluh foto. Setiap cucu dan cicit Hendarto Wardhana — termasuk aku, termasuk Lana yang ternyata sepupuku, dan termasuk... orang ketiga yang tidak pernah aku tahu ada. Ada nama di bawah foto ketiga: 'Putra Kedua — Dimas Wardhana.' Dimas bukan Dimas Pratama. Dimas juga darah Wardhana. Tiga cucu. Tiga operator. Dan hanya aku yang tidak tahu."</p>`;
    text += `<p><span class="speaker niko">Niko</span> Kalian keluar. Niko menyerahkan diri ke polisi — tidak hanya sebagai saksi, tapi dengan foto-foto dari lorong. Bukti bahwa Dewan Penenun bukan organisasi kriminal biasa — tapi proyek keluarga yang diwariskan dari generasi ke generasi. Dan setiap operator yang dipilih Ragil... selalu darah Wardhana.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Pengadilan membebaskannya — insufficient evidence untuk membuktikan keterlibatan langsung. Tapi Niko hidup dengan beban yang jauh lebih berat dari yang dunia tahu: dia, Lana, dan Dimas — tiga cucu Hendarto — adalah tiga simpul terakhir dari rantai keluarga yang dibangun di atas darah.</p>`;
    text += `<p><span class="speaker niko">Niko</span> <em>"Warisan bukan hanya harta. Warisan adalah darah yang mengalir di pembuluh nadimu — dan pertanyaan yang tidak pernah bisa dijawab: apakah kegelapan kakekmu juga mengalir di sana?"</em></p>`;
    return text;
  },
  fates: {
    niko: 'Menemukan bahwa Dimas juga cucu Hendarto. Tiga operator — Niko, Lana, Dimas — semua darah Wardhana. Proyek keluarga selama 50 tahun.',
    lana: 'Terungkap sebagai cucu Hendarto dari jalur kedua — anak haram yang tumbuh di panti asuhan.',
    dimas: 'Nama asli: Dimas Wardhana. Cucu ketiga yang diadopsi dan di-program sejak kecil tanpa mengetahui asal usulnya.'
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
    let text = `<p class="sound">— ENDING #14: Paranoia Menang —</p>`;
    text += `<p><span class="speaker niko">Niko</span> Kepercayaan hancur total. Semua orang mencurigai semua orang. Kelompok pecah menjadi individu-individu yang mengunci diri di kamar masing-masing.</p>`;

    // === Deep reveal: Paranoia was engineered ===
    text += `<p class="sound">— Yang tidak diketahui siapapun: paranoia ini bukan spontan. Ini di-design. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Bertahun-tahun kemudian, saat Sera menganalisis malam itu dengan pikiran yang lebih jernih, dia menyadari sesuatu yang menghancurkan: setiap "kebetulan" yang memicu kecurigaan antar tamu... adalah skenario yang ditulis oleh dua orang. Lana menulis dialog — kata-kata yang ditanam untuk memecah kelompok. Tapi Ragil menulis setting-nya. Pintu-pintu yang terkunci secara selektif agar orang-orang tertentu terjebak bersama. Lampu yang mati di saat-saat kritis. Suara langkah yang direkam dan diputar ulang dari speaker tersembunyi di dinding — membuat setiap orang mengira ada seseorang mengintip di balik pintu.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Dan yang paling mengerikan: Sera menemukan catatan Ragil bertanggal 15 tahun lalu — catatan tentang eksperimen pertamanya dengan "paranoia buatan." Subjek pertamanya: sebuah keluarga kecil. Ayah, ibu, dan dua anak. Ragil mengirim surat anonim ke setiap anggota keluarga, masing-masing berisi "rahasia" tentang anggota keluarga lain. Hasilnya: perceraian dalam enam bulan, satu anak lari dari rumah, yang lainnya... bunuh diri. Keluarga itu: keluarga Kirana. Juno Kirana. Ayah Juno yang "menghilang" bukan meninggalkan keluarga — ayah Juno dimanipulasi oleh Ragil sampai kehilangan akal. Dan Juno menyimpan trauma itu selama 15 tahun tanpa tahu bahwa itu bukan kesalahan ayahnya.</p>`;

    text += `<p><span class="speaker arin">Arya</span> Sera mengetuk pintumu pukul empat pagi. "Arya, buka pintunya. Please." Kau berdiri di balik pintu. Tanganmu di handle. Tapi kau tidak membuka. Karena Ragil sudah menanam paranoia ini jauh sebelum malam itu — dalam DNA pengalaman hidupmu. Setiap orang di mansion itu sudah "terinfeksi" sebelum mereka menginjakkan kaki di sini.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Suara Sera pecah. "Arya... aku tidak mau sendirian." Dan kau mendengar langkahnya menjauh. Dan kau tahu — dengan kepastian yang menghancurkan — bahwa paranoia buatan Ragil baru saja menghancurkan sesuatu yang lebih penting dari keselamatan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Fajar datang. Tiga orang selamat. Kau dan Sera berpapasan di luar mansion. Mata bertemu mata. Dan Sera berbisik: "Kita tidak gagal karena lemah. Kita gagal karena seseorang sudah merusak fondasi kepercayaan kita jauh sebelum malam ini." Tapi pengetahuan itu tidak menyembuhkan jarak yang sudah terlalu jauh.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul terakhir adalah kepercayaan. Dan begitu terputus oleh tangan yang sudah merencanakannya selama 15 tahun — bahkan cinta yang paling nyata pun hanya menjadi bayangan dari apa yang seharusnya bisa."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Tidak membuka pintu untuk Sera. Baru menyadari bertahun-tahun kemudian bahwa paranoia itu di-design oleh Ragil — bukan berasal dari dalam dirinya.',
    sera: 'Menemukan bahwa paranoia di mansion adalah replikasi eksperimen Ragil 15 tahun lalu — eksperimen yang menghancurkan keluarga Juno.',
    juno: 'Kebenaran terpahit: ayahnya tidak meninggalkan keluarga. Ayahnya adalah korban eksperimen paranoia buatan Ragil yang pertama.'
  }
},

'ending_wrong_accusation': {
  chapter: 3,
  isEnding: true,
  endingNumber: 15,
  title: 'Tuduhan Salah',
  rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #15: Tuduhan Salah —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Kau menuduh orang yang salah. Kelompok mengunci Sera — psikolog yang sebenarnya adalah sekutu terbesarmu — dan membiarkan operator sebenarnya bergerak bebas.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Hasilnya: dua kematian lagi sebelum fajar. Dan saat kebenaran terungkap — sudah terlalu terlambat.</p>`;

    // === Deep reveal: The false accusation was engineered ===
    text += `<p class="sound">— Dan tuduhan salah itu bukan sepenuhnya kesalahanmu. Itu di-design. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Bertahun-tahun kemudian, investigasi mengungkap bahwa Lana menyiapkan skenario ini berminggu-minggu sebelum malam itu. Di laptop-nya ditemukan draft berjudul "Kambing Hitam — Versi 7." Versi 7 — artinya skenario ini sudah dipraktikkan di enam siklus sebelumnya. Setiap "bukti" yang mengarah ke orang yang kau tuduh — semuanya di-plant. Kau tidak membuat kesalahan karena bodoh. Kau membuat kesalahan karena kau memainkan peran yang sudah ditulis untukmu.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Dan yang paling menghancurkan: Sera tahu. Sera membaca kebenaran di mikro-ekspresi orang yang dituduh — "kebingungan murni, bukan rasa bersalah yang ditutupi." Dia mencoba memberitahumu. Tapi suaranya tenggelam. Karena dalam chaos, nuansa tidak punya tempat. Dan Sera — psikolog yang bisa membaca semua orang — tidak bisa membuat dirinya didengar oleh satu orang yang paling dia inginkan mendengarnya.</p>`;

    text += `<p><span class="speaker sera">Sera</span> Sera dibebaskan. Tapi dia tidak bisa menatapmu. "Kau yang seharusnya paling pintar di ruangan ini," bisiknya. Air matanya jatuh — pertama kalinya malam ini. "Dan kau memilih mudah daripada benar. Kau memilih ketakutan daripada kepercayaan. Tapi yang paling menyakitkan — kau tidak dengar aku. Aku yang sudah belajar membaca manusia selama bertahun-tahun — dan kau tidak mendengarkan satu kataku."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tangan Sera yang dulu mencari tanganmu di bawah meja — sekarang dikepalkan di sisi tubuhnya. Genggaman yang tidak akan pernah terulang.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Simpul yang diikat dengan terburu-buru selalu mengikat orang yang salah. Dan yang paling menyakitkan: seseorang sudah menulis naskahnya sebelum kau tahu kau sedang berakting. Kau bukan penjahat — kau aktor dalam drama yang penulisnya duduk di sudut dan tersenyum."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menuduh orang yang salah — tanpa tahu itu skenario Lana versi ke-7. Kehilangan Sera bukan karena takdir, tapi karena naskah orang lain.',
    sera: 'Membaca kebenaran tapi tidak didengar. Kegagalan terberat profiler: diabaikan oleh orang yang paling dia cintai.',
    lana: '"Kambing Hitam — Versi 7" berhasil. Penulis yang menjadikan kenyataan sebagai drama yang paling kejam.'
  }
},

'ending_penenun_wins': {
  chapter: 4,
  isEnding: true,
  endingNumber: 16,
  title: 'Sang Penenun Menang',
  rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #16: Sang Penenun Menang —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tiga simpul terputus. Tepat seperti yang dijanjikan. Mansion kembali normal saat fajar — pintu terbuka, lampu menyala, seolah tidak pernah terjadi apa-apa.</p>`;
    text += `<p class="sound">— Yang tersisa keluar seperti zombie. Trauma yang terlalu segar untuk ditangisi. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Polisi datang. Tidak menemukan apa-apa. "Kecelakaan selama acara privat." Kasus ditutup.</p>`;

    // === Deep reveal: Everyone was data ===
    text += `<p class="sound">— Tiga bulan kemudian, email terakhir Sang Penenun tiba. Dan isinya jauh lebih mengerikan dari ancaman. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Email itu bukan sekadar "Terima kasih atas partisipasinya." Email itu berisi attachment: profil psikologis lengkap setiap tamu, dengan catatan tangan Ragil. Profil Arya: "Subjek A-01. Indeks kerentanan: 87. <em>Catatan: sangat menyerupai profil ibu (Ratna Prasetya, Operator R-03, dieliminasi 2009 setelah percobaan desersi).</em> Potensi rekrutmen: TINGGI." Arya membaca kalimat itu tiga kali. Lalu muntah. Ibunya bukan korban Dewan. Ibunya pernah menjadi <em>operator</em> — operator yang mencoba keluar dan dibunuh karena itu.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Profil Sera bahkan lebih menghancurkan: "Subjek S-02. Anak Dr. Lestari Amalina (Psikolog Residen, masih aktif). Kemampuan profiling: di atas rata-rata, konsisten dengan pelatihan subliminal fase 2. Rekomendasi: observasi lanjutan untuk siklus ke-48." Sera menemukan bahwa ibunya — yang masih hidup, yang masih meneleponnya setiap Minggu — masih aktif bekerja untuk Dewan. Dan kemampuan membaca manusia yang selama ini Sera banggakan adalah hasil "pelatihan" yang ibunya terapkan sejak Sera berusia 4 tahun tanpa sepengetahuannya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sang Penenun tidak sekadar menang malam itu. Sang Penenun sudah menang sejak sebelum mereka semua lahir. Setiap koneksi, setiap hubungan, setiap "kebetulan" yang membawa mereka ke mansion — semuanya bagian dari desain generasi yang sudah berjalan setengah abad.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Kadang monster menang. Tapi yang paling menakutkan bukan kekalahannya — tapi penemuan bahwa monster itu selalu ada di dalam keluargamu. Dan satu-satunya hal yang bisa kau lakukan adalah mengingat — dan menolak untuk menjadi mereka."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan bahwa ibunya Ratna pernah menjadi operator Dewan sebelum dieliminasi. Arya sendiri dinilai "potensi rekrutmen tinggi."',
    sera: 'Menemukan bahwa ibunya masih aktif bekerja untuk Dewan. Kemampuan profilingnya adalah hasil "pelatihan subliminal" tanpa consent.'
  }
},

// Already defined in ch4: ending_coward_escape (D-rank, #20)
// Already defined in ch5: ending_incomplete_escape (C-rank, #19)

'ending_dimas_betrayal': {
  chapter: 3,
  isEnding: true,
  endingNumber: 17,
  title: 'Pengkhianatan Dokter',
  rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #17: Pengkhianatan Dokter —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Kau mempercayai Dimas. Membiarkannya merawat yang terluka. Memberinya akses ke supplies medis.</p>`;
    text += `<p class="sound">— Kesalahan fatal. —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Dimas menggunakan akses itu untuk memastikan "treatment" yang diberikan... tidak bekerja. Obat tidur sebagai pengganti obat nyeri. Dosage yang sedikit terlalu tinggi. Profesional sampai akhir.</p>`;

    // === Deep reveal: Dimas's true origin and programming ===
    text += `<p class="sound">— Tapi di balik presisi klinis itu, tersembunyi kebenaran yang membuat pengkhianatan ini lebih tragis dari yang terlihat. —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Dimas Pratama asli meninggal di Semarang tahun 2001. Orang yang menyuntikkan obat tidur malam ini — Operator D-07 — adalah anak jalanan tanpa nama yang ditemukan Ragil di kolong jembatan Manggarai saat berusia 8 tahun. Ragil melihat potensi: anak yang sudah tidak merasakan empati karena dipukul terlalu sering sampai otaknya memutuskan bahwa merasakan adalah kemewahan yang tidak terjangkau. Ragil mengadopsinya, memberikan identitas curian, dan membiayai sekolah kedokterannya — bukan sebagai investasi pada anak, tapi sebagai investasi pada senjata.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Setiap pelajaran anatomi adalah pelajaran tentang kelemahan manusia. Setiap rotasi di forensik adalah simulasi pembersihan jejak. Dan setiap "pujian" yang Ragil berikan — "Bagus, Dimas. Presisi sempurna." — adalah penguatan positif yang membentuk operator paling efisien dalam 50 tahun sejarah Dewan.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Kau menyadari terlalu terlambat. Tapi Sera — dalam satu tatapan terakhir sebelum Dimas menghilang — melihat sesuatu yang tidak pernah dilihat siapapun. Bukan monster. Bukan operator. Tapi anak kecil berusia 8 tahun yang masih berdiri di kolong jembatan, menunggu seseorang datang dan memberikan pilihan selain ini. Sera tidak membenci Dimas. Dan itu — ketidakhadiran kebencian dari satu-satunya orang yang berhak membenci — adalah hal pertama yang membuat tangan Dimas gemetar setelah 15 tahun presisi sempurna.</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> <em>"Simpul yang paling berbahaya adalah yang diikat oleh tangan yang kau percaya. Tapi simpul yang paling tragis adalah tangan itu sendiri — yang tidak pernah diberi pilihan untuk menjadi sesuatu selain senjata."</em></p>`;
    return text;
  },
  fates: {
    dimas: 'Anak jalanan tanpa nama, diadopsi Ragil usia 8 tahun, di-program 15 tahun menjadi operator. Presisi sempurna — sampai Sera menatapnya tanpa kebencian dan memecahkan sesuatu di dalam.',
    sera: 'Satu-satunya yang melihat anak kecil di balik operator D-07. Tatapan tanpa kebencian yang menjadi retakan pertama dalam 15 tahun pemrograman.'
  }
},

// ============================================================
// F-RANK ENDINGS (Worst outcomes)
// ============================================================

'ending_total_failure': {
  chapter: 4,
  isEnding: true,
  endingNumber: 18,
  title: 'Simpul Terputus Total',
  rating: 'F',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #18: Simpul Terputus Total —</p>`;
    text += `<p><span class="speaker dimas">Dimas</span> Semua simpul terputus. Setiap orang yang seharusnya kau lindungi — hilang. Satu per satu. Seperti lilin yang ditiup oleh angin yang sama.</p>`;

    if (pc === 'arin') {
      text += `<p><span class="speaker dimas">Dimas</span> Kau selamat. Sendirian. Seperti yang direncanakan. Saksi Selamat yang sempurna: cukup pintar untuk menggali, cukup naif untuk gagal.</p>`;
      text += `<p><span class="speaker sera">Sera</span> Sera ada di antara yang hilang. Tangan yang pernah mencari tanganmu — tangan yang kau genggam terlalu sedikit, terlalu terlambat.</p>`;
      text += `<p><span class="speaker sera">Sera</span> Podcast episode #47: "Malam di Mansion Wardhana." Di menit ke-42, kau menangis on air. Untuk satu nama: "Sera."</p>`;
    } else if (pc === 'sera') {
      text += `<p><span class="speaker arin">Arya</span> Kau selamat. Psikolog yang bisa membaca semua orang — kecuali masa depan. Arya ada di antara yang hilang. Tangan yang pernah kau genggam di bawah meja — tidak akan pernah kau genggam lagi.</p>`;
      text += `<p><span class="speaker arin">Arya</span> Kau menulis paper tentang malam itu. Tapi setiap kali sampai di bagian tentang Arya, jarimu berhenti. Ada hal-hal yang tidak bisa direduksi menjadi data.</p>`;
    } else if (pc === 'niko') {
      text += `<p><span class="speaker arin">Arya</span> Mansionmu. Dosamu. Dan sekarang — kuburanmu. Semua orang yang kau undang, hilang karena keputusanmu. Dalang yang menjadi korban dari permainan yang dia mulai sendiri.</p>`;
    } else if (pc === 'juno') {
      text += `<p><span class="speaker reza">Reza</span> Lo selamat. Lo selalu selamat — itu yang lo lakukan. Lari. Tapi kali ini, lo lari dari orang-orang yang seharusnya lo lindungi. Reza di antara yang hilang. Dan sepi yang ditinggalkannya lebih keras dari ledakan manapun.</p>`;
    } else if (pc === 'lana') {
      text += `<p><span class="speaker reza">Reza</span> Skenariomu berjalan sempurna. Semua simpul terputus. Sang Penenun puas. Tapi kau — untuk pertama kalinya — tidak puas. Kemenangan terasa seperti kekalahan. Dan karakter yang kau tulis... mereka punya wajah sekarang. Mereka punya tangan yang pernah kau sentuh.</p>`;
    } else {
      text += `<p><span class="speaker reza">Reza</span> Kau selamat. Tapi selamat bukan berarti menang. Semua orang yang pernah mengulurkan tangan — hilang. Dan kau berdiri sendirian di fajar yang seharusnya membawa harapan, tapi hanya membawa bayangan panjang.</p>`;
    }

    // === Deep reveal for total failure ===
    text += `<p class="sound">— Dan dalam kesendirian itu, kebenaran terakhir datang. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Enam bulan kemudian, sebuah paket tiba di alamat player. Tanpa pengirim. Isinya: folder berjudul "PROFIL WARISAN." Di dalamnya, silsilah keluarga setiap tamu di mansion — dan koneksi mereka ke korban-korban sebelumnya. Setiap orang yang mati malam itu ternyata adalah anak, cucu, atau keponakan dari korban Dewan yang sebelumnya. Ragil tidak hanya membunuh — dia mengumpulkan generasi kedua dari keluarga korbannya dan menempatkan mereka di tempat yang sama di mana orang tua mereka mati.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Dan di halaman terakhir folder itu: foto seorang wanita berjalan di koridor mansion — tahun 2009. Ratna Prasetya. Ibumu. Dengan catatan di sampingnya: "Operator R-03. Percobaan desersi. Dieliminasi." Ibumu bukan sekadar korban. Ibumu pernah bekerja untuk mereka — dan dibunuh saat mencoba keluar. Dan kau — anaknya — diundang untuk mengulangi siklus yang sama.</p>`;
    text += `<p class="sound">— Siklus berlanjut. Dan harganya bukan hanya sepi — tapi pengetahuan bahwa kesendirian ini di-design. —</p>`;
    text += `<p><span class="speaker reza">Reza</span> <em>"Simpul terakhir bukan kematian — tapi hidup sendirian dengan pengetahuan bahwa semua orang yang kau kehilangan... sudah ditakdirkan hilang sejak sebelum mereka lahir. Dan kau — anak dari operator yang gagal lari — adalah simpul terakhir dalam rantai yang tidak pernah kau pilih."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan bahwa ibunya pernah menjadi operator Dewan. Setiap korban malam itu adalah generasi kedua dari keluarga korban sebelumnya. Saksi Selamat dalam rantai generasi.'
  }
},

'ending_arin_death_hero': {
  chapter: 3,
  isEnding: true,
  endingNumber: 21,
  title: 'Pahlawan yang Jatuh',
  rating: 'B',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #21: Pahlawan yang Jatuh —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya turun ke B-3 sendirian. Menemukan Ragil. Memaksanya membuka semua kunci.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Tapi Ragil punya satu trik terakhir — dead man's switch. Kalau jantungnya berhenti, gas dari ventilasi mengisi seluruh basement.</p>`;
    text += `<p class="sound">— Ragil mati — usianya yang memang sudah habis. Dan gas mengisi B-3. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya tidak sempat naik. Tapi semua pintu sudah terbuka. Yang lain — selamat.</p>`;

    // === Deep reveal: Arya's last discovery ===
    text += `<p class="sound">— Di detik-detik terakhirnya, Arya menemukan satu hal lagi di komputer Ragil. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Saat gas mulai mengisi ruangan, layar komputer Ragil masih menyala. Dan di sana, folder yang baru di-unlock karena Ragil memasukkan password terakhir sebelum mati: "ARSIP OPERATOR." Arya membaca nama-nama di daftar operator selama 50 tahun. Dan di nomor 31 — dengan foto yang membuat dunianya berhenti — nama ibunya: Ratna Prasetya. Operator R-03. Status: Dieliminasi 2009. Alasan: Percobaan desersi. Ibunya bukan korban yang tidak berdosa. Ibunya pernah menjadi bagian dari mesin ini — dan dibunuh saat mencoba keluar.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Arya menangis — bukan karena gas, bukan karena kematian yang mendekat, tapi karena dia baru saja menemukan bahwa jurnalis yang selalu dia idolakan, ibu yang mati untuk kebenaran... pernah berada di sisi yang sama dengan Ragil. Dan mungkin — mungkin — keberanian Arya malam ini bukan sekadar keberanian seorang jurnalis, tapi penebusan seorang anak untuk dosa ibunya yang tidak pernah dia tahu.</p>`;

    text += `<p><span class="speaker sera">Sera</span> Di atas, Sera menjerit. Bukan jeritan analitis. Bukan profiling. Jeritan mentah seorang wanita yang kehilangan orang yang paling dia cintai sebelum sempat mengucapkannya. Juno memeluknya. Dan di bahu Juno, Sera menangis untuk dua orang: Arya yang mati di bawah, dan ibunya Dr. Lestari yang namanya juga ada di daftar operator — bukan sebagai korban, tapi sebagai psikolog residen Dewan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Podcast Arya ditemukan oleh Kira di cloud. Episode terakhir — direkam di ponselnya saat gas mengisi ruangan. Delapan menit. Di menit ke-enam: "Ibu... aku baca namamu di daftar. Aku tahu sekarang. Tapi aku tidak marah. Karena kau mencoba keluar — dan itu yang aku lakukan sekarang. Keluar. Dengan cara yang berbeda." Di menit terakhir: "Sera... kalau kau dengar ini... aku tahu tentang ibumu juga. File-nya ada di komputer Ragil. Tapi jangan biarkan itu mendefinisikanmu. Kau bukan ibumu. Seperti aku bukan ibuku. Kita lebih dari warisan dosa mereka."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera mendengarkan rekaman itu sekali. Delapan menit yang mengubah hidupnya dua kali — pertama saat mendengar pengakuan cinta, kedua saat mendengar kebenaran tentang ibunya. Dia tidak pernah mendengarkannya lagi. Tapi dia menggenggam ponselnya setiap malam selama setahun — menggantikan tangan yang tidak pernah sempat dia genggam, dan menanggung kebenaran yang tidak pernah dia minta.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Ini Arya Prasetya. Anak dari Ratna Prasetya — operator yang mencoba lari. Dan ini cerita terakhirku. Cerita tentang orang yang menemukan bahwa kebenaran terbesar bukan di luar sana — tapi di dalam darahnya sendiri. Dan memilih, di detik terakhir, untuk menjadi lebih baik dari warisan itu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan nama ibunya di daftar operator Dewan di detik-detik terakhir. Mati dengan kebenaran ganda: cinta yang tidak terucapkan dan dosa ibu yang tidak pernah dia tahu.',
    sera: 'Mendengar rekaman 8 menit terakhir Arya — pengakuan cinta DAN kebenaran tentang ibunya Dr. Lestari. Menanggung dua kehilangan dalam satu malam.'
  }
},

'ending_cycle_continues': {
  chapter: 3,
  isEnding: true,
  endingNumber: 22,
  title: 'Siklus Berlanjut',
  rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #22: Siklus Berlanjut —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau memilih kabur di chapter awal. Berlari ke hutan. Menemukan jalan keluar melalui pagar yang belum sepenuhnya terpasang.</p>`;
    text += `<p class="sound">— Polisi datang. Mansion sudah bersih saat mereka sampai. —</p>`;

    // === Deep reveal ===
    text += `<p class="sound">— Satu tahun kemudian, siklus kembali. Dan kali ini, jauh lebih personal. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kau menerima amplop hitam. Lagi. Undangan yang sama. Mansion yang berbeda — kali ini di Bali. Dan di dalam amplop itu, selain undangan, ada foto. Foto ibumu — Ratna Prasetya — berdiri di depan mansion di Jawa Tengah, tahun 2008. Satu tahun sebelum dia "meninggal karena serangan jantung." Di balik foto, tulisan tangan: "Ibumu datang. Ibumu bermain. Ibumu kalah. Sekarang giliranmu — untuk kedua kalinya."</p>`;
    text += `<p><span class="speaker arin">Arya</span> Dan di undangan itu, ada nama lain yang membuat jantungmu berhenti: <em>Sera Amalina</em>. Sera juga mendapat undangan. Dan kau tahu — dengan kepastian yang menghancurkan — bahwa lari dari mansion pertama tidak menyelamatkan siapapun. Kau hanya menunda. Dan sekarang, orang yang paling kau cintai sudah masuk dalam permainan.</p>`;
    text += `<p class="sound">— Dan kali ini — kau tidak bisa lari. Karena Sera tidak akan lari. Sera akan masuk. Dan kau harus memilih: lari lagi, atau masuk bersamanya. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul yang tidak diputuskan tidak hanya mengikat generasi berikutnya — tapi mengikat hati yang paling kau sayangi. Dan pengecut sejati bukan yang lari dari monster. Tapi yang membiarkan monster itu mengejar orang yang dia cintai."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan foto ibunya pernah bermain dan kalah di mansion lain. Sekarang Sera diundang. Siklus kedua dimulai — dan kali ini, lari bukan pilihan.',
    sera: 'Diundang ke mansion baru tanpa tahu bahwa Arya pernah di sana. Pion baru dalam permainan lama.'
  }
},

'ending_lana_double': {
  chapter: 3,
  isEnding: true,
  endingNumber: 23,
  title: 'Plot Twist Penulis',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #23: Plot Twist Penulis —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Lana — yang mengaku bermain ganda — ternyata bermain triple. Dia bukan hanya operator yang bermain ganda, tapi calon PEWARIS Sang Penenun yang bermain jadi double agent.</p>`;

    // === Deep reveal: Lana's true identity ===
    text += `<p class="sound">— Dan plot twist sesungguhnya jauh lebih dalam dari yang kau bayangkan. —</p>`;
    text += `<p><span class="speaker lana">Lana</span> Cerita tentang kakaknya Arum? Nyata. Setiap air mata, setiap tremor di suaranya saat menceritakannya — nyata. Tapi motivasinya bukan balas dendam untuk Arum. Motivasinya adalah menjadi apa yang Arum tolak menjadi: Penenun berikutnya. Karena Lana menyadari sesuatu yang tidak pernah Arum pahami — sistem ini tidak bisa dihancurkan dari luar. Hanya dari dalam. Dan cara menghancurkannya dari dalam adalah <em>menjadi</em> sistemnya, lalu menulis ulang aturannya.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Tapi plot twist tergelap bukan Lana. Ini tentang identitasnya. Lana Kusuma bukan nama aslinya. Nama aslinya: Lana Wardhana — cucu perempuan Hendarto Wardhana dari putra kedua yang tidak diakui keluarga. Lana dan Niko sepupu. Lana tumbuh di panti asuhan — sementara Niko tumbuh di mansion. Dan malam ini, dua cucu Hendarto bermain di arena yang dibangun kakek mereka — tanpa pernah tahu mereka berbagi darah yang sama.</p>`;
    text += `<p><span class="speaker lana">Lana</span> Kau menyadari semua ini saat sudah di luar mansion. Saat Lana menghilang bersama semua bukti digital. Dan siklus — bukannya berakhir — justru ter-upgrade. Penenun baru lebih muda, lebih cerdas, dan yang paling menakutkan: punya empati yang cukup untuk memahami manusia — dan menggunakan pemahaman itu sebagai senjata terbaik.</p>`;
    text += `<p><span class="speaker lana">Lana</span> <em>"Plot twist terbaik adalah yang membuat pembaca memeriksa ulang setiap halaman — dan menyadari bahwa protagonis dan antagonis selalu berbagi darah yang sama. Karena monster yang paling menakutkan bukan yang datang dari luar. Tapi yang tumbuh dari keluarga yang sama denganmu."</em></p>`;
    return text;
  },
  fates: {
    lana: 'Lana Wardhana — cucu haram Hendarto, sepupu Niko yang tidak diakui. Menjadi Penenun baru bukan untuk balas dendam, tapi untuk menulis ulang aturan dari dalam. Apakah itu penebusan atau pengulangan — hanya waktu yang tahu.',
    niko: 'Tidak pernah tahu bahwa Lana adalah sepupunya. Dua cucu Hendarto bermain di arena yang sama tanpa menyadari mereka berbagi darah dan dosa.'
  }
},

'ending_sera_profile': {
  chapter: 3,
  isEnding: true,
  endingNumber: 24,
  title: 'Profiler dan Subjek',
  rating: 'C',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #24: Profiler dan Subjek —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera berhasil memprofilkan Sang Penenun dengan akurasi yang menakutkan. Tapi profil itu sendiri menjadi senjata — Ragil menggunakan prediksi Sera untuk selalu selangkah di depan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> "Kau terlalu transparan, psikolog," kata Ragil melalui speaker. "Kau memberitahu satu sama lain kelemahanku — dan kelemahan kalian sendiri."</p>`;

    // === Deep reveal: Why Sera was so accurate ===
    text += `<p class="sound">— Tapi ada alasan mengapa profil Sera begitu akurat. Dan alasan itu menghancurkannya. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ragil menambahkan satu kalimat terakhir melalui speaker sebelum koneksi terputus: "Kau tahu kenapa profilmu begitu sempurna, Sera? Karena ibumu yang mengajarkanmu. Dr. Lestari Amalina — psikolog residen saya selama 18 tahun. Dia yang mendesain profil untuk setiap korban. Dan dia yang memastikan anaknya mewarisi kemampuan itu — tanpa sadar, tentu saja. Pelatihan subliminal sejak usia 4 tahun. Kau pikir kau belajar membaca microexpression di universitas? Kau sudah belajar sejak taman kanak-kanak, Sera. Ibumu memastikan itu."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Sera membeku. Semua yang dia banggakan — kemampuannya, karirnya, thesis-nya tentang "Undetected Killers in Social Circles" — semuanya berasal dari sumber yang paling gelap. Ibunya bukan sekadar psikolog biasa. Ibunya adalah arsitek profil korban Dewan Penenun. Dan Sera, tanpa mengetahuinya, adalah produk terbaik dari program ibunya.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Kelompok keluar dengan selamat — tapi Ragil sudah menghapus semua bukti. Dan Sera keluar dengan kebenaran yang tidak bisa dihapus: dia bukan profiler yang memilih jalannya sendiri. Dia produk dari sistem yang sama yang sedang dia lawan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> <em>"Memahami monster bukan berarti bisa mengalahkannya. Tapi yang lebih menakutkan dari memahami monster... adalah menemukan bahwa kemampuanmu memahami monster itu sendiri adalah hadiah dari monster lain — yang membesarkanmu dan memanggilmu 'Sayang' setiap pagi."</em></p>`;
    return text;
  },
  fates: {
    sera: 'Menemukan bahwa kemampuan profilingnya bukan bakat alami — tapi hasil "pelatihan subliminal" dari ibunya Dr. Lestari, psikolog residen Dewan selama 18 tahun. Berhenti dari psikologi. Mempertanyakan apakah keputusannya sendiri pernah benar-benar miliknya.'
  }
},

'ending_silent_majority': {
  chapter: 4,
  isEnding: true,
  endingNumber: 25,
  title: 'Mayoritas yang Diam',
  rating: 'F',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #25: Mayoritas yang Diam —</p>`;
    text += `<p class="sound">— Semua selamat. Secara fisik. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tapi tidak ada yang bicara. Tidak ada yang melapor. Tidak ada yang bersaksi. Egoisme menang atas keberanian. Ketakutan menang atas keadilan.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Masing-masing pulang. Masing-masing diam. Masing-masing memilih untuk melupakan — atau berpura-pura lupa.</p>`;

    // === Deep reveal: The silence was predicted ===
    text += `<p class="sound">— Dan keheningan ini bukan kebetulan. Ini adalah skenario terbaik Ragil. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Dua tahun kemudian, arsip Dewan Penenun bocor melalui whistleblower yang tidak pernah teridentifikasi. Di dalamnya: dokumen berjudul "Protokol Omega — Skenario Optimal." Isinya: "Skenario terbaik bukan membunuh semua tamu. Skenario terbaik adalah membiarkan mereka semua hidup — dan memastikan mereka memilih diam. Karena mayoritas yang diam adalah aset terbaik Dewan. Mereka menjadi bukti hidup bahwa manusia, ketika dihadapkan pada pilihan antara kenyamanan dan keadilan, akan SELALU memilih kenyamanan."</p>`;
    text += `<p><span class="speaker sera">Sera</span> Ragil merencanakan ini. Moral score rendah, trust hancur, keputusan-keputusan buruk sepanjang malam — semua mengarah ke satu kesimpulan: kelompok yang terlalu rusak secara psikologis untuk bersaksi. Terlalu malu. Terlalu takut. Dan yang paling mengerikan: terlalu bersalah — karena setiap orang tahu bahwa mereka bisa melakukan lebih, tapi memilih tidak.</p>`;

    text += `<p><span class="speaker arin">Arya</span> Arya dan Sera tidak pernah bicara lagi. Bukan karena marah — tapi karena setiap tatapan adalah cermin yang memantulkan rasa malu. Tangan yang bersentuhan di bawah meja malam itu menjadi memori yang meracuni, karena sentuhan itu terjadi pada malam yang sama di mana mereka berdua memilih diam.</p>`;
    text += `<p><span class="speaker niko">Niko</span> Niko dan Vira — toxic love yang seharusnya berakhir — justru kembali bersama. Dua orang yang terikat oleh rahasia dan rasa bersalah, bukan cinta. Niko tidak pernah tahu bahwa Lana adalah sepupunya. Dan Vira tidak pernah tahu bahwa kakaknya Mira mati di mansion yang sama.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Juno dan Reza kehilangan kontak. Dan Juno tidak pernah tahu bahwa ayahnya — yang "menghilang" 15 tahun lalu — adalah korban pertama eksperimen Ragil.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Semua kebenaran itu — tentang ibu Arya, ibu Sera, kakak Vira, ayah Juno, identitas asli Dimas, hubungan darah Lana-Niko — semuanya tersimpan di arsip yang tidak pernah mereka buka. Karena mereka memilih diam.</p>`;
    text += `<p class="sound">— Tahun depan, sepuluh amplop hitam dikirim ke sepuluh alamat baru. Dan siklus ke-48 dimulai. —</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul terakhir tidak pernah terputus. Karena tidak ada yang mencoba. Dan semua kebenaran — tentang keluarga mereka, tentang koneksi tersembunyi, tentang cinta yang hampir tumbuh — terkubur bersama keheningan yang mereka pilih. Keheningan yang Ragil prediksi. Keheningan yang membuktikan thesis-nya: manusia lebih memilih kenyamanan daripada keadilan. Selalu."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Diam. Tidak pernah tahu ibunya pernah menjadi operator Dewan. Kebenaran terkubur dalam keheningan yang dia pilih sendiri.',
    sera: 'Diam. Tidak pernah tahu ibunya masih aktif sebagai psikolog Dewan. Kemampuan profilingnya — warisan gelap — tidak pernah dipertanyakan.',
    juno: 'Diam. Tidak pernah tahu ayahnya adalah korban pertama eksperimen Ragil. Trauma tanpa closure.',
    vira: 'Diam. Tidak pernah tahu kakaknya Mira mati di mansion yang sama. Lingkaran yang tidak pernah tertutup.'
  }
},

// ============================================================
// NEW ENDINGS — Escape & Elimination Victory
// ============================================================

'ending_mansion_escape': {
  chapter: 3,
  isEnding: true,
  endingNumber: 26,
  title: 'Pelarian dari Mansion',
  rating: 'S',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #26: Pelarian dari Mansion —</p>`;
    text += `<p><span class="speaker juno">Juno</span> Semua petunjuk terkumpul. Peta rahasia, kode pintu, blueprint terowongan, frekuensi radio, kunci berkarat, jurnal pendiri, dan jalur pelarian menara — semuanya membentuk satu gambaran utuh.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Jalan keluar ada di bawah basement — terowongan yang dibangun Hendarto Wardhana 50 tahun lalu sebagai rencana darurat. Terowongan yang sengaja disembunyikan oleh Sang Penenun.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Saat pintu terowongan terbuka, mansion mengaktifkan protokol lockdown. Tapi lockdown itu bekerja dua arah — para killer terjebak di dalam, sementara protagonis berlari menuju kebebasan.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Di ujung terowongan, cahaya fajar menyambut. Udara laut. Suara ombak. Dan di belakang — mansion yang perlahan menjadi kuburan bagi mereka yang menenun jaring kematian.</p>`;

    let survivors = [];
    (typeof Engine !== 'undefined' ? Engine.CHARACTERS : []).forEach(c => { if (s.alive[c]) survivors.push(c); });

    if (survivors.length > 3) {
      text += `<p><span class="speaker juno">Juno</span> Kalian keluar bersama — ${survivors.length} orang yang saling menyelamatkan. Bukan pahlawan. Hanya manusia yang memilih untuk tidak menyerah.</p>`;
    } else {
      text += `<p class="sound">— Hanya sedikit yang selamat. Tapi kalian selamat bersama — dan itu sudah cukup. —</p>`;
    }

    // === Deep reveal: The tunnel's hidden history ===
    text += `<p class="sound">— Tapi terowongan itu menyimpan rahasia yang membuat pelarian ini lebih dari sekadar melarikan diri. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Di dinding terowongan, saat kalian berlari menuju cahaya, ada tulisan-tulisan. Puluhan tulisan. Tangan-tangan yang berbeda, tinta yang berbeda, tahun yang berbeda. "Aku keluar — M.H. 1998." "Aku selamat — D.K. 2003." Dan satu yang membuat Arya berhenti: "Aku keluar. Tapi mereka tidak membiarkan aku pergi. — R.P. 2009." R.P. — Ratna Prasetya. Ibunya. Ibunya pernah menemukan terowongan ini. Pernah keluar. Tapi Dewan menemukannya kembali.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Polisi tiba dua jam kemudian. Mansion dikepung. Terowongan — dengan semua tulisan di dindingnya — menjadi bukti utama. Setiap nama di dinding itu dilacak. Setiap "Saksi Selamat" yang pernah keluar lewat terowongan ini dicari. Dan untuk pertama kalinya dalam 50 tahun — siklus simpul benar-benar berakhir. Bukan karena satu orang memutus benang. Tapi karena semua tulisan di dinding itu akhirnya didengar.</p>`;
    text += `<p><span class="speaker juno">Juno</span> <em>"Simpul terakhir bukan tentang memutus benang — tapi menemukan jalan keluar yang dibangun oleh semua orang yang pernah lari sebelummu. Setiap tulisan di dinding terowongan itu adalah simpul harapan yang diikat oleh tangan-tangan yang tidak pernah kau kenal."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menemukan tulisan ibunya R.P. di dinding terowongan — ibunya pernah keluar tapi ditangkap kembali. Kali ini ceritanya terdengar.',
    sera: 'Membaca pola mansion dan menemukan nama-nama di terowongan — bukti bahwa orang lain pernah selamat tapi dibungkam.',
    niko: 'Pengetahuan tentang mansion kakeknya berguna untuk pelarian. Menemukan nama pamannya di dinding terowongan.',
    juno: 'Yang pertama masuk terowongan. Menemukan inisial ayahnya di dinding. Closure yang tidak terduga.',
    vira: 'Mengenali tulisan di dinding terowongan — "Mira H." — kakaknya pernah lewat sini.'
  }
},

'ending_all_killers_dead': {
  chapter: 3,
  isEnding: true,
  endingNumber: 27,
  title: 'Pembantai Pembunuh',
  rating: 'S',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    const killerCount = (s.killers || []).length;
    let text = `<p class="sound">— ENDING #27: Pembantai Pembunuh —</p>`;
    text += `<p><span class="speaker juno">Juno</span> ${killerCount} killer. Semuanya dieliminasi. Bukan oleh keberuntungan — tapi oleh keberanian, strategi, dan tekad yang tak tergoyahkan.</p>`;

    // Show how each killer fell
    (s.killers || []).forEach(k => {
      const name = { lana: 'Lana', dimas: 'Dimas', niko: 'Niko' }[k] || k;
      if (k === 'lana') {
        text += `<p><span class="speaker juno">Juno</span> <strong>${name}</strong> — Sang "Penulis" — jatuh saat skenarionya sendiri berbalik melawannya. Novelis yang akhirnya menjadi karakter di cerita orang lain.</p>`;
      } else if (k === 'dimas') {
        text += `<p><span class="speaker juno">Juno</span> <strong>${name}</strong> — Sang "Pemotong" — dikalahkan oleh empati yang tidak pernah dia miliki. Dingin dan klinis sampai akhir.</p>`;
      } else if (k === 'niko') {
        text += `<p><span class="speaker juno">Juno</span> <strong>${name}</strong> — pewaris yang mewarisi dosa — akhirnya membayar harga warisan keluarganya.</p>`;
      }
    });

    text += `<p><span class="speaker juno">Juno</span> Tanpa operator, Sang Penenun tidak berdaya. Ragil Pramudya ditemukan di Bunker B-3 — pria tua di kursi roda, tanpa bidak, tanpa skenario, tanpa kekuasaan.</p>`;
    text += `<p><span class="speaker juno">Juno</span> Mansion ini akhirnya aman. Bukan karena jalan keluar ditemukan — tapi karena ancaman di dalamnya telah dimusnahkan.</p>`;

    // === Deep reveal: What the killers' deaths revealed ===
    text += `<p class="sound">— Dan dalam kematian mereka, kebenaran tentang siapa mereka sebenarnya akhirnya terungkap. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Pemeriksaan forensik setelah malam itu mengungkap kebenaran yang mengubah segalanya. Ketiga operator — Lana, Dimas, Niko — ternyata semua darah Wardhana. Lana Kusuma adalah Lana Wardhana, cucu perempuan Hendarto dari putra kedua. Dimas Pratama bukan nama aslinya — anak jalanan yang diadopsi dan diberikan identitas cucu ketiga. Tiga cucu Hendarto, tiga operator, satu arena. Ragil membangun mesin pembunuhan dari keluarganya sendiri.</p>`;

    let survivors = [];
    (typeof Engine !== 'undefined' ? Engine.CHARACTERS : []).forEach(c => {
      if (s.alive[c] && !(s.killers || []).includes(c)) survivors.push(c);
    });

    text += `<p><span class="speaker arin">Arya</span> <strong>Yang Selamat:</strong> ${survivors.map(c => ({ arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira', reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah' }[c] || c)).join(', ')}</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Kadang satu-satunya cara mengakhiri permainan adalah menghancurkan pemainnya. Dan kadang, pemain-pemain itu ternyata saudara yang tidak pernah tahu mereka saudara — dibesarkan oleh kakek yang sama untuk saling menghancurkan."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Pemburu kebenaran yang menemukan bahwa semua killer adalah keluarga Wardhana. Podcast-nya mengungkap dinasti pembunuhan tiga generasi.',
    sera: 'Profiler yang membaca jiwa gelap — dan menemukan bahwa tiga jiwa gelap itu ternyata saudara sepupu yang tidak pernah tahu.',
    juno: 'Pemberontak yang membunuh musuhnya — dan baru tahu setelahnya bahwa musuh-musuhnya saling terhubung oleh darah.',
    vira: 'Saksi Selamat yang kembali dan mengakhiri tiga operator. Closure untuk kakaknya Mira.',
    reza: 'Detektif yang menyelesaikan kasus terbesar — dan menemukan bahwa mentornya dibunuh oleh salah satu operator yang dia eliminasi malam ini.'
  }
},

'ending_killer_betrayal_victory': {
  chapter: 3,
  isEnding: true,
  endingNumber: 28,
  title: 'Pengkhianatan Sempurna',
  rating: 'A',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    let text = `<p class="sound">— ENDING #28: Pengkhianatan Sempurna —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Killer mengkhianati killer. Dalam kegelapan mansion, aliansi gelap runtuh dari dalam.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Saat identitas satu killer terungkap, yang lain memilih untuk mengorbankan rekannya demi bertahan. Tapi pengkhianatan itu membuka celah — dan protagonis memanfaatkannya.</p>`;

    // === Deep reveal: Why they betrayed each other ===
    text += `<p class="sound">— Tapi pengkhianatan antar killer bukan sekadar survival instinct. Ada sesuatu yang lebih mendalam. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Investigasi setelah malam itu mengungkap: ketiga operator tidak pernah tahu bahwa mereka saudara. Lana tidak tahu Niko sepupunya. Dimas tidak tahu dua orang lain adalah cucu kakek angkatnya. Dan saat salah satu dari mereka terekspos — saat masker jatuh dan wajah asli terlihat — yang lain mengenali sesuatu. Bukan wajah. Tapi mata. Mata Hendarto Wardhana. Mata yang mereka lihat di cermin setiap pagi. Dan dalam detik itu — detik mengenali darah sendiri — mereka memilih hal yang paling manusiawi yang pernah dilakukan Wardhana manapun: menghancurkan warisan keluarga dari dalam.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Satu per satu, killer jatuh — bukan hanya oleh tangan protagonis, tapi oleh tangan sesama killer yang baru saja menemukan bahwa mereka saudara. Lana mengorbankan diri agar Niko terekspos. Dimas membiarkan diri dikalahkan setelah menyadari bahwa "ayah" yang mengadopsinya... adalah kakek yang sama dengan kakek Niko. Pengkhianatan mereka bukan pengkhianatan terhadap satu sama lain — tapi terhadap Ragil. Terhadap sistem. Terhadap darah Wardhana yang sudah terlalu banyak memakan anaknya sendiri.</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Simpul yang diikat oleh pengkhianatan — hanya bisa diputus oleh pengkhianatan yang lebih besar. Dan pengkhianatan terbesar seorang Wardhana... adalah memilih untuk berhenti menjadi Wardhana."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Menyaksikan tiga saudara Wardhana saling menghancurkan saat menemukan kebenaran tentang darah mereka. Keadilan dari sumber tergelap.',
    lana: 'Mengorbankan diri saat mengenali mata Hendarto di wajah Niko. Pengkhianatan terakhir: terhadap sistem yang membuat saudara saling membunuh.',
    dimas: 'Membiarkan diri dikalahkan setelah menyadari Ragil — "ayah" yang membesarkannya — adalah kakek yang membuatnya membunuh saudaranya sendiri.',
    niko: 'Terekspos oleh pengkhianatan Lana — tapi pengkhianatan itu adalah tindakan kasih sayang terakhir seorang saudara yang baru dia kenal.'
  }
},

'ending_clues_destroyed': {
  chapter: 4,
  isEnding: true,
  endingNumber: 29,
  title: 'Jejak yang Terhapus',
  rating: 'D',
  endingText: (s) => {
    let text = `<p class="sound">— ENDING #29: Jejak yang Terhapus —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Petunjuk pelarian — satu per satu — dihancurkan oleh tangan-tangan gelap. Peta dibakar. Kode dihapus. Blueprint dirobek. Kunci dibuang ke kegelapan.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Tanpa petunjuk, tidak ada jalan keluar. Mansion ini menjadi labirin tanpa pintu keluar.</p>`;

    // === Deep reveal: Who destroyed the clues and why ===
    text += `<p class="sound">— Dan tangan-tangan gelap itu bukan hanya milik killer. —</p>`;
    text += `<p><span class="speaker sera">Sera</span> Analisis forensik setelah malam itu mengungkap sesuatu yang mengerikan: tidak semua petunjuk dihancurkan oleh operator. Beberapa dihancurkan oleh... Ragil sendiri. Dari Bunker B-3, melalui sistem remote yang terhubung ke setiap ruangan mansion. Ragil tidak hanya mengontrol operator — dia mengontrol arena itu sendiri. Setiap petunjuk yang "ditemukan" sebenarnya diletakkan dengan sengaja. Dan setiap petunjuk yang "dihancurkan" juga dihancurkan dengan sengaja. Permainan ini tidak pernah bisa dimenangkan lewat pelarian — karena Ragil selalu bisa menghapus jalur keluar kapan pun dia mau.</p>`;
    text += `<p><span class="speaker sera">Sera</span> Tapi yang paling menakutkan: di antara petunjuk yang dihancurkan, ada satu yang berisi daftar nama korban 50 tahun — termasuk nama ibu Arya, kakak Vira, ayah Juno, dan mentor Reza. Ragil menghancurkan petunjuk itu bukan karena mengandung jalan keluar — tapi karena mengandung kebenaran yang terlalu berbahaya. Kebenaran yang menghubungkan semua orang di mansion itu ke korban-korban sebelumnya.</p>`;
    text += `<p class="sound">— Yang tersisa hanya dua pilihan: bunuh semua killer... atau mati tanpa pernah tahu kenapa kau diundang ke sini. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Saat semua jalan tertutup, satu-satunya arah adalah menghadapi kegelapan itu sendiri. Tapi kegelapan terdalam bukan di koridor mansion — tapi di kebenaran yang dihancurkan sebelum kau sempat membacanya."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Terjebak tanpa petunjuk. Tidak pernah tahu bahwa nama ibunya ada di petunjuk yang dihancurkan. Kebenaran yang terbakar sebelum sempat dibaca.',
    sera: 'Menganalisis pola penghancuran petunjuk dan menyadari bahwa permainan ini tidak pernah bisa dimenangkan — arena-nya didesain untuk kalah.'
  }
},

'ending_last_standing': {
  chapter: 4,
  isEnding: true,
  endingNumber: 30,
  title: 'Yang Terakhir Berdiri',
  rating: 'A',
  endingText: (s) => {
    const pc = s.playerCharacter || 'arin';
    const pcName = { arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira', reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah' }[pc] || pc;
    let text = `<p class="sound">— ENDING #30: Yang Terakhir Berdiri —</p>`;
    text += `<p><span class="speaker arin">Arya</span> ${pcName} — satu-satunya protagonis yang tersisa. Semua teman telah jatuh. Tapi semua killer juga telah dieliminasi.</p>`;
    text += `<p><span class="speaker arin">Arya</span> Kemenangan ini tidak terasa seperti kemenangan. Ini terasa seperti bertahan hidup di reruntuhan. Setiap langkah di atas abu teman-teman yang tidak sempat diselamatkan.</p>`;

    // === Deep reveal: The last one standing discovers the truth alone ===
    text += `<p class="sound">— Dan yang terakhir berdiri menanggung beban yang paling berat: pengetahuan. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> Sendirian di mansion, ${pcName} menemukan Bunker B-3 — dan semua yang tersimpan di dalamnya. Komputer Ragil. Arsip 50 tahun. 47 nama korban. Profil psikologis setiap tamu. Dan kebenaran tentang koneksi yang menghubungkan semua orang: ibu Arya adalah mantan operator. Ibu Sera masih aktif sebagai psikolog Dewan. Kakak Vira mati di mansion ini. Ayah Juno adalah korban eksperimen pertama. Lana, Dimas, dan Niko — semua cucu Hendarto. Setiap orang yang mati malam ini adalah generasi kedua dari keluarga korban sebelumnya.</p>`;
    text += `<p><span class="speaker arin">Arya</span> ${pcName} membaca semua itu sendirian. Tanpa ada teman untuk membaginya. Tanpa bahu untuk menangis. Dan beban terbesar dari menjadi yang terakhir berdiri bukan kesepian — tapi menjadi satu-satunya orang di dunia yang tahu seluruh kebenaran. Kebenaran yang terlalu besar untuk satu orang. Kebenaran yang seharusnya ditanggung bersama — oleh orang-orang yang sudah tidak ada.</p>`;
    text += `<p class="sound">— Tapi kau berdiri. Di tengah kegelapan, di antara kebenaran yang menghancurkan, kau masih berdiri. —</p>`;
    text += `<p class="sound">— Dan itu harus cukup. Karena tidak ada pilihan lain. —</p>`;
    text += `<p><span class="speaker arin">Arya</span> <em>"Yang terakhir berdiri bukan yang terkuat — tapi yang menanggung kebenaran sendirian. Dan beban itu lebih berat dari batu nisan manapun."</em></p>`;
    return text;
  },
  fates: {
    arin: 'Satu-satunya yang tersisa. Menemukan seluruh kebenaran sendirian — tentang ibunya, tentang koneksi semua orang, tentang 50 tahun pembunuhan. Menanggung beban yang seharusnya ditanggung bersama.',
    sera: 'Jika Sera yang terakhir berdiri: menemukan file ibunya di arsip Dewan. Psikolog yang menanggung kebenaran terberat — sendirian, tanpa Arya.',
    juno: 'Jika Juno yang terakhir berdiri: menemukan nama ayahnya sebagai korban pertama. Pemberontak yang akhirnya menemukan kebenaran — tapi tidak ada yang tersisa untuk dibaginya.'
  }
}

};

/* ============================================================
   ENDING CONDITION RULES — Condition-based ending selector
   Setiap rule punya: endingKey, priority (higher = checked first),
   dan condition(s, wl) yang return true jika ending layak trigger.
   s = game state, wl = win/loss result dari CharBrain.checkWinLoss
   ============================================================ */

const ENDING_CONDITIONS = [

  // ── S-RANK ──────────────────────────────────────────────────

  // #1 Sang Penenun Terakhir — semua killer mati + clue >= 5 + banyak survivor hidup + moral baik
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

  // #2 Detektif Sejati — semua killer mati + semua clue ditemukan (8/8)
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

  // #26 Pelarian dari Mansion — 5+ clue ditemukan → escape route terbuka
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

  // #27 Pembantai Pembunuh — semua killer dieliminasi lewat combat
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

  // #30 Yang Terakhir Berdiri — semua killer mati TAPI hanya 1 survivor tersisa
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

  // #3 Fajar yang Cukup — protagonis menang tapi bukti tidak lengkap
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

  // #28 Pengkhianatan Sempurna — killer saling bunuh, protagonis menang
  {
    endingKey: 'ending_killer_betrayal_victory',
    priority: 86,
    condition: (s, wl) => {
      const allKDead = (s.killers || []).every(k => !s.alive[k]);
      const killersDead = (s.killersDead || []);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      // Ada ≥2 killer dan ada yang mati karena trust-kill (betrayal)
      return allKDead && playerAlive && (s.killers || []).length >= 2 && killersDead.length >= 2;
    }
  },

  // #4 Pengorbanan — player mati tapi bukti terkirim + teman selamat
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

  // #5 Kesaksian Terakhir — Vira hidup + grup escape bersama
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

  // #8 Penebusan Penulis — Lana (killer) mati, tapi berkorban/redeem diri
  {
    endingKey: 'ending_lana_redemption',
    priority: 80,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const lanaIsKiller = (s.killers || []).includes('lana');
      return playerAlive && lanaIsKiller && !s.alive.lana && (s.moralScore || 0) >= 0;
    }
  },

  // #21 Pahlawan yang Jatuh — player (Arin) mati sebagai hero
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

  // #9 Lingkaran Vira — Vira hidup + dia menyelamatkan orang lain
  {
    endingKey: 'ending_vira_closure',
    priority: 76,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));
      return playerAlive && s.alive.vira && survivors.length >= 3 && (s.playerCharacter || 'arin') !== 'vira';
    }
  },

  // #7 Kemenangan yang Pecah — protagonis menang tapi banyak yang mati
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

  // #6 Abu dan Fajar — protagonis menang tapi bukti terbakar (destroyed clues)
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

  // #13 Warisan Wardhana — Niko hidup + menyelamatkan grup
  {
    endingKey: 'ending_niko_truth',
    priority: 65,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const nikoIsKiller = (s.killers || []).includes('niko');
      return playerAlive && s.alive.niko && !nikoIsKiller;
    }
  },

  // #23 Plot Twist Penulis — Lana selamat sebagai killer, identitas tersembunyi
  {
    endingKey: 'ending_lana_double',
    priority: 63,
    condition: (s, wl) => {
      const lanaIsKiller = (s.killers || []).includes('lana');
      const lanaRevealed = (s.killerRevealed || []).includes('lana');
      return lanaIsKiller && s.alive.lana && !lanaRevealed && wl && wl.type !== 'win';
    }
  },

  // #24 Profiler dan Subjek — Sera hidup, tapi profiling digunakan melawan mereka
  {
    endingKey: 'ending_sera_profile',
    priority: 61,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && s.alive.sera && wl && wl.reason === 'dawn_reached';
    }
  },

  // #10 Kemenangan Pyrrhic — menang tapi Penenun lolos
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

  // #11 Perjanjian dengan Iblis — semua hidup tapi keadilan gagal
  {
    endingKey: 'ending_deal_with_devil',
    priority: 58,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const survivors = Object.keys(s.alive).filter(k => s.alive[k]);
      return playerAlive && survivors.length >= 8 && (s.moralScore || 0) < -5;
    }
  },

  // #12 Perpecahan Fatal — grup pecah, sebagian selamat
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

  // #29 Jejak yang Terhapus — clue dihancurkan killer, tidak cukup bukti
  {
    endingKey: 'ending_clues_destroyed',
    priority: 50,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && wl && wl.reason === 'killer_clues_destroyed';
    }
  },

  // #14 Paranoia Menang — semua curiga semua, trust collapse
  {
    endingKey: 'ending_everyone_suspects',
    priority: 48,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const avgTrust = calcAvgTrust(s);
      return playerAlive && avgTrust < 25 && (s.deathCount || 0) >= 2;
    }
  },

  // #15 Tuduhan Salah — killer menang karena salah tuduh
  {
    endingKey: 'ending_wrong_accusation',
    priority: 46,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      const killerAlive = (s.killers || []).some(k => s.alive[k]);
      return playerAlive && killerAlive && s.alive.sera && wl && wl.reason === 'killer_victory';
    }
  },

  // #17 Pengkhianatan Dokter — Dimas (killer) menang lewat pengkhianatan
  {
    endingKey: 'ending_dimas_betrayal',
    priority: 44,
    condition: (s, wl) => {
      const dimasIsKiller = (s.killers || []).includes('dimas');
      return dimasIsKiller && s.alive.dimas && wl && (wl.reason === 'killer_victory' || wl.type === 'loss');
    }
  },

  // #16 Sang Penenun Menang — killer menang, siklus berlanjut
  {
    endingKey: 'ending_penenun_wins',
    priority: 42,
    condition: (s, wl) => {
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && wl && wl.reason === 'killer_victory';
    }
  },

  // #22 Siklus Berlanjut — escape awal tanpa menyelesaikan
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

  // #25 Mayoritas yang Diam — semua selamat tapi tidak ada yang bersaksi
  {
    endingKey: 'ending_silent_majority',
    priority: 35,
    condition: (s, wl) => {
      const survivors = Object.keys(s.alive).filter(k => s.alive[k]);
      const playerAlive = s.alive[s.playerCharacter || 'arin'];
      return playerAlive && survivors.length >= 7 && (s.moralScore || 0) < -10;
    }
  },

  // #18 Simpul Terputus Total — player sendirian, semua mati
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

// Helper: hitung rata-rata trust antar karakter hidup
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

/* ============================================================
   selectEndingFromState(state, winLossResult)
   Evaluasi kondisi game → pilih ending terbaik yang match.
   Return: { endingKey, endingData } atau null jika tidak ada match.
   ============================================================ */
function selectEndingFromState(gameState, winLossResult) {
  // Sort by priority (descending) — highest priority checked first
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

  // Fallback: pick ending based on general outcome
  return selectFallbackEnding(gameState, winLossResult);
}

function selectFallbackEnding(s, wl) {
  const playerAlive = s.alive[s.playerCharacter || 'arin'];
  const allKDead = (s.killers || []).every(k => !s.alive[k]);
  const survivors = Object.keys(s.alive).filter(k => s.alive[k] && !(s.killers || []).includes(k));

  // Player dead + others survive
  if (!playerAlive && survivors.length >= 2) {
    return { endingKey: 'ending_sacrifice_hero', endingData: STORY_ENDINGS['ending_sacrifice_hero'] };
  }
  // Player dead + most dead
  if (!playerAlive) {
    return { endingKey: 'ending_total_failure', endingData: STORY_ENDINGS['ending_total_failure'] };
  }
  // All killers dead
  if (allKDead && survivors.length >= 3) {
    return { endingKey: 'ending_all_killers_dead', endingData: STORY_ENDINGS['ending_all_killers_dead'] };
  }
  if (allKDead) {
    return { endingKey: 'ending_broken_victory', endingData: STORY_ENDINGS['ending_broken_victory'] };
  }
  // Killer wins
  if (wl && (wl.reason === 'killer_victory' || wl.reason === 'killer_clues_destroyed')) {
    return { endingKey: 'ending_penenun_wins', endingData: STORY_ENDINGS['ending_penenun_wins'] };
  }
  // Dawn reached — partial
  if (wl && wl.reason === 'dawn_reached') {
    return { endingKey: 'ending_pyrrhic', endingData: STORY_ENDINGS['ending_pyrrhic'] };
  }
  // Default
  return { endingKey: 'ending_pyrrhic', endingData: STORY_ENDINGS['ending_pyrrhic'] };
}
