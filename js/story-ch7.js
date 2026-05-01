/* ============================================================
   SIMPUL TERAKHIR — BAB 7: Simpul Terakhir
   Fajar menyingsing. Resolusi. Konsekuensi. Akhir.
   ============================================================ */

const STORY_CH7 = {

'ch7_start': {
  chapter: 7,
  text: (s) => {
    let text = `<p class="narration">Fajar.</p>`;
    text += `<p class="narration">Garis tipis merah di timur — seperti luka di kulit langit. Perlahan melebar, membasahi hutan pinus dengan cahaya yang terasa terlalu biasa untuk apa yang baru saja terjadi.</p>`;

    if (s.flags.outsideMansion) {
      if (s.flags.mansionBurned) {
        text += `<p>Di belakang kalian, mansion Wardhana masih berasap. Kerangka kayu hitam berdiri seperti tulang-tulang raksasa. Lima puluh tahun kengerian — direduksi menjadi abu dan puing.</p>`;
      } else {
        text += `<p>Mansion Wardhana berdiri di belakang kalian — gelap, diam, seolah tidak pernah terjadi apa-apa di dalamnya.</p>`;
      }
    } else {
      text += `<p>Dari jendela lantai satu — yang sudah pecah, yang sudah dibayar dengan darah — cahaya fajar masuk. Pertama kalinya dalam delapan jam, kau melihat sesuatu selain lampu fluorescent dan kegelapan.</p>`;
    }

    text += `<p>Yang tersisa: `;
    let survivors = [];
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) survivors.push(Engine.CHAR_DISPLAY[c]); });
    text += survivors.join(', ') + `. ${survivors.length} jiwa dari sepuluh.</p>`;

    text += `<p>Countdown: <strong>00:00:00</strong>.</p>`;
    text += `<p>Malam sudah berakhir. Tapi cerita belum.</p>`;

    // Player character dawn moment
    const pc = s.playerCharacter || 'arin';
    if (pc === 'lana') {
      text += `<p class="journal"><em>Kau berdiri di antara mereka — orang-orang yang seharusnya kau hancurkan. Tapi malam ini mengubah segalanya. Kau bukan lagi operator. Kau bukan lagi dalang. Kau hanya... manusia. Dan itu terasa lebih menakutkan dari apapun yang pernah kau tulis.</em></p>`;
    } else if (pc === 'dimas') {
      text += `<p class="journal"><em>Fajar. Kau tidak menyangka kau akan melihatnya — bukan karena bahaya, tapi karena kau sudah merencanakan untuk menghilang sebelum matahari terbit. Rencana berubah. Sera mengubahnya. Kau tidak tahu harus merasa apa tentang itu.</em></p>`;
    }

    text += `<p>Dan di cahaya fajar itu, kau melihat mereka semua — bukan sebagai tersangka, bukan sebagai korban. Tapi sebagai manusia yang rusak dan indah:</p>`;

    if (s.alive.sera) {
      if (pc === 'arin') {
        text += `<p><span class="speaker sera">Sera</span> berdiri di sampingmu. Tangannya menggenggam tanganmu — tidak sembunyi-sembunyi lagi. Di cahaya fajar, genggaman itu terlihat oleh semua orang. "Kita berhasil," bisiknya.</p>`;
      } else if (pc === 'sera') {
        text += `<p>Arin berdiri di sampingmu. Kau menggenggam tangannya — tidak sembunyi-sembunyi lagi. "Kita berhasil," bisikmu. Dan untuk pertama kalinya, kau tidak menganalisis perasaanmu. Kau hanya membiarkannya ada.</p>`;
      } else {
        text += `<p><span class="speaker sera">Sera</span> dan <span class="speaker arin">Arin</span> berdiri bergandengan tangan. Cahaya fajar menerpa mereka. Tidak ada yang berkomentar.</p>`;
      }
    }
    if (s.alive.niko && s.alive.vira) {
      if (pc === 'niko') {
        text += `<p>Vira duduk di sampingmu di tangga. Bahu kalian tidak bersentuhan — masih ada jarak. Tapi kalian duduk bersama. Dan untuk sekarang, itu cukup.</p>`;
      } else if (pc === 'vira') {
        text += `<p>Kau duduk di samping Niko di tangga. Kalian tidak bicara. Tidak perlu. Kadang penyembuhan dimulai dari sekedar berada di dekat orang yang pernah menyakitimu — dan memilih untuk tetap di sana.</p>`;
      } else {
        text += `<p><span class="speaker niko">Niko</span> dan <span class="speaker vira">Vira</span> duduk bersebelahan di tangga. Bahu tidak bersentuhan — tapi mereka bersama. Penyembuhan dimulai dari sekedar duduk bersama.</p>`;
      }
    }
    if (s.alive.juno && s.alive.reza) {
      if (pc === 'juno') {
        text += `<p>Lo merokok — rokok Reza. Dia duduk di samping lo, flask tersimpan. "Lo kayak bokap gue," lo bilang pelan. "Cuma versi yang nggak ninggalin." Reza diam lama. "Aku tidak akan pergi, Juno." Dan lo percaya.</p>`;
      } else if (pc === 'reza') {
        text += `<p>Juno merokok — rokokmu. Kau duduk di sampingnya, flask tersimpan di saku paling dalam. "Lo kayak bokap gue," katanya. "Cuma versi yang nggak ninggalin." Kau diam lama. "Aku tidak akan pergi, Juno." Dan kau sungguh-sungguh.</p>`;
      } else {
        text += `<p><span class="speaker juno">Juno</span> merokok. <span class="speaker reza">Reza</span> di sampingnya, flask tersimpan. "Lo kayak bokap gue. Cuma versi yang nggak ninggalin." Reza: "Aku tidak akan pergi."</p>`;
      }
    }
    if (s.alive.farah) {
      if (pc === 'farah') {
        text += `<p>Kau melepas jam tangan mahalmu dan meletakkannya di tanah. Semua privilege, semua negosiasi — tidak berarti di depan fajar setelah malam di mana uang tidak bisa membeli keselamatan.</p>`;
      } else {
        text += `<p><span class="speaker farah">Farah</span> melepas jam tangan mahalnya. Di fajar ini, privilege tidak berarti apa-apa.</p>`;
      }
    }
    if (s.alive.kira) {
      if (pc === 'kira') {
        text += `<p>Lo masih coding. Upload 97% — semua bukti digital ke lima server berbeda di tiga negara. Paranoia? Lo menyebutnya asuransi. Lo tersenyum untuk pertama kalinya malam ini.</p>`;
      } else {
        text += `<p><span class="speaker kira">Kira</span> tertidur dengan laptop terbuka. Di layarnya: upload 97%. Semua bukti digital tersimpan aman.</p>`;
      }
    }

    return text;
  },
  choices: [
    {
      text: "Tunggu bantuan — pasti ada yang melihat api atau mendengar sesuatu",
      condition: (s) => s.flags.mansionBurned || s.flags.outsideMansion,
      next: 'ch7_wait_rescue',
      effect: (s) => {
        s.flags.waitedForRescue = true;
      }
    },
    {
      text: "Jalan kaki ke kota terdekat — jangan menunggu",
      next: 'ch7_walk_out',
      effect: (s) => {
        s.flags.walkedOut = true;
      }
    },
    {
      text: "Sebelum pergi — satu hal terakhir yang harus diselesaikan",
      next: 'ch7_final_business',
      effect: (s) => {
        s.flags.unfinishedBusiness = true;
      }
    }
  ]
},

'ch7_wait_rescue': {
  text: (s) => {
    let text = `<p>Kalian duduk di tanah basah di tepi hutan. Menunggu.</p>`;
    text += `<p>Empat puluh menit kemudian: suara helikopter. Lalu sirene. Api mansion terlihat dari kota terdekat.</p>`;
    text += `<p>Pemadam kebakaran. Polisi. Ambulans. Dunia luar kembali — dan bersamanya, realitas.</p>`;

    if (s.flags.capturedRagil) {
      text += `<p>Ragil Pramudya diamankan oleh paramedis. Polisi menatapnya bingung — pria tua di kursi roda, mengaku bertanggung jawab atas "operasi yang sudah berjalan 50 tahun". Mereka pikir dia delusional.</p>`;
      text += `<p>Sampai kau menunjukkan bukti.</p>`;
    }

    if (s.flags.broadcastSuccess) {
      text += `<p>Dan saat polisi masih mengamankan area — internet sudah bergerak. File yang kau upload mulai ditemukan. Jurnalis. Aktivis. Netizen. Benang-benang yang Ragil tenun selama 50 tahun mulai ditarik — dari arah yang berlawanan.</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Menuju ending...",
      next: 'ch7_resolution',
      effect: (s) => {
        s.flags.rescuedRoute = true;
      }
    }
  ]
},

'ch7_walk_out': {
  text: (s) => {
    let text = `<p>Tidak menunggu. Berjalan.</p>`;
    text += `<p>Pagar kawat — kali ini, tanpa listrik dari mansion, tidak aktif. Kau menemukan celah yang bisa dipotong.</p>`;
    text += `<p>Jalan hutan. Turun tebing. Dua jam berjalan kaki dalam cahaya fajar yang makin terang.</p>`;

    text += `<p>Desa pertama. Warung kopi yang baru buka. Pemiliknya menatap kalian — berdarah, kotor, kelelahan — dengan kengerian yang wajar.</p>`;
    text += `<p>"Telepon," katamu. "Kami butuh telepon."</p>`;
    text += `<p>Kau menelepon polisi. Dan sebelum polisi datang — kau menelepon editormu.</p>`;
    text += `<p>"Aku punya cerita. Cerita terbesar yang pernah ada. Dan ini bukan podcast."</p>`;

    return text;
  },
  choices: [
    {
      text: "Menuju ending...",
      next: 'ch7_resolution',
      effect: (s) => {
        s.flags.walkoutRoute = true;
      }
    }
  ]
},

'ch7_final_business': {
  text: (s) => {
    let text = `<p>Sebelum meninggalkan mansion — atau apa yang tersisa — ada satu hal lagi.</p>`;

    if (s.alive.lana) {
      text += `<p>Kau mendekati <span class="speaker lana">Lana</span>. Wanita yang menulis skenario malam ini. Operator yang bermain ganda. Anti-heroine yang metodanya kau benci tapi motivasinya kau pahami.</p>`;
      text += `<p>"Kau bisa jadi penulis yang luar biasa, Lana. Kalau kau berhenti menggunakan orang nyata sebagai karakter."</p>`;
      text += `<p>Lana tersenyum tipis. "Karakter fiksi tidak berdarah. Itulah kenapa mereka tidak pernah cukup nyata."</p>`;
    }

    if (s.alive.vira) {
      text += `<p><span class="speaker vira">Vira</span> sudah menelepon adiknya dari ponsel cadangan yang dia sembunyikan. Adiknya aman. Tangis lega yang membuat semua orang di ruangan itu ikut menitikkan air mata.</p>`;
    }

    if (s.alive.niko && s.difficulty < 3) {
      text += `<p><span class="speaker niko">Niko</span> berdiri di depan lukisan kakeknya yang selamat dari api — atau masih tergantung di dinding. "Aku akan menjual properti ini. Donasikan hasilnya ke keluarga korban. Semua yang bisa dilacak."</p>`;
    }

    return text;
  },
  choices: [
    {
      text: "Sekarang, akhirnya — pergi dari sini",
      next: 'ch7_resolution',
      effect: (s) => {
        s.flags.closedLooseEnds = true;
        s.moralScore += 10;
      }
    }
  ]
},

'ch7_resolution': {
  chapter: 7,
  text: (s) => {
    let text = `<p class="narration">Dan begitulah malam di Mansion Wardhana berakhir.</p>`;
    text += `<p class="narration">Bukan dengan twist terakhir. Bukan dengan monster yang muncul di detik terakhir. Tapi dengan sinar matahari — biasa, sederhana, memalukan dalam normalitasnya — yang menerangi kekacauan yang ditinggalkan manusia.</p>`;

    // Calculate final score
    let score = 0;
    score += s.moralScore;
    score += s.cluesFound * 5;
    let aliveCount = 0;
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) aliveCount++; });
    score += aliveCount * 15;
    if (s.flags.broadcastSuccess) score += 30;
    if (s.flags.capturedRagil) score += 25;
    if (s.flags.hasCouncilData) score += 20;
    if (s.flags.mansionBurned) score += 10;
    s.finalScore = score;

    // Route to appropriate ending
    if (score >= 180) {
      return text + `<p>Simpul terakhir — bukan simpul kematian. Tapi simpul yang mengikat keadilan.</p>`;
    } else if (score >= 130) {
      return text + `<p>Simpul terakhir — tidak sempurna. Tapi cukup kuat untuk menahan.</p>`;
    } else if (score >= 80) {
      return text + `<p>Simpul terakhir — rapuh. Mungkin cukup. Mungkin tidak.</p>`;
    } else {
      return text + `<p>Simpul terakhir — terlalu longgar. Dan simpul yang longgar... bisa terurai.</p>`;
    }
  },
  choices: [
    {
      text: "Lihat ending...",
      next: (s) => {
        if (s.finalScore >= 180) return 'ending_masterpiece';
        if (s.finalScore >= 130) return 'ending_good';
        if (s.finalScore >= 80) return 'ending_bittersweet';
        return 'ending_pyrrhic';
      }
    }
  ]
}

};
