/* ============================================================
   SIMPUL TERAKHIR — BAB 3: Kebenaran & BAB 4: Simpul Terakhir
   Klimaks. Ritual. Pilihan terakhir. Menuju 25 ending.
   ============================================================ */

const STORY_CH3 = {

'ch3_pre_dawn': {
  chapter: 3,
  text: (s) => {
    let situation = '<p>Fajar merambat di cakrawala timur. Langit berubah dari hitam ke ungu tua, lalu ke merah gelap — seperti memar yang perlahan menyembuh.</p>';

    const aliveCount = Engine.CHARACTERS.filter(c => s.alive[c]).length;

    if (s.flags.nikoLost && !s.alive.niko) {
      situation += `<p>Niko sudah tidak ada. Ditelan bumi di depan matamu. Tangannya yang terulur — jari-jarinya yang berteriak minta pertolongan — masih terbakar di ingatanmu.</p>`;
    }
    if (s.flags.junoLost && !s.alive.juno) {
      situation += `<p>Juno pergi mencari Niko dan tidak kembali. Teriakannya terpotong oleh keheningan hutan yang rakus.</p>`;
    }

    if (aliveCount <= 3) {
      situation += `<p>Kalian yang tersisa — ${aliveCount} dari lima — duduk di beranda cabin. Terlalu sedikit. Terlalu rapuh. Tapi masih ada.</p>`;
    } else {
      situation += `<p>Kalian berkumpul di beranda cabin. Wajah-wajah lelah, mata merah, tapi masih bersama.</p>`;
    }

    if (s.flags.arinVolunteered) {
      situation += `<p>Kau sudah membuat keputusanmu. Kau yang akan tinggal. Rasanya seperti batu yang ditaruh di dada — berat, tapi <em>pasti</em>.</p>`;
    }

    situation += `<p>Hutan menunggu. Pohon tua menunggu. Dan di suatu tempat di bawah akar-akarnya, Vira — Vira yang asli — menunggu untuk dibangunkan.</p>
<p>Saatnya memutuskan: apa yang akan kalian lakukan saat matahari terbit?</p>`;

    return situation;
  },
  choices: [
    {
      text: "Lakukan ritual. Kembalikan batu ke altar.",
      hint: "Lima tangan. Lima kebenaran. Satu simpul baru.",
      next: 'ch3_ritual_start',
      condition: (s) => {
        const aliveCount = Engine.CHARACTERS.filter(c => s.alive[c]).length;
        return aliveCount >= 3;
      },
      effect: (s) => {
        s.flags.choseRitual = true;
        s.keyChoices.push('chose_ritual');
      }
    },
    {
      text: "Tinggalkan hutan ini. Selamatkan yang masih hidup.",
      hint: "Mungkin tidak semua bisa diselamatkan.",
      next: 'ch3_escape',
      effect: (s) => {
        s.flags.choseEscape = true;
        s.keyChoices.push('chose_escape');
      }
    },
    {
      text: "Hancurkan batu itu. Putus simpul untuk selamanya.",
      hint: "Dratis. Tidak bisa dibatalkan.",
      danger: true,
      next: 'ch3_destroy_stone',
      condition: (s) => s.flags.arinHasStone || s.flags.nikoHasStone,
      effect: (s) => {
        s.flags.choseDestroy = true;
        s.keyChoices.push('chose_destroy');
      }
    },
    {
      text: "Bicara dengan entitas satu kali lagi. Cari jalan tengah.",
      next: 'ch3_final_negotiation',
      condition: (s) => !s.flags.entityBetrayed && !s.flags.entityGone,
      effect: (s) => {
        s.flags.finalNegotiation = true;
        s.keyChoices.push('final_negotiation');
      }
    }
  ]
},

'ch3_entity_attack': {
  chapter: 3,
  text: `<p>Entitas — tidak lagi berwujud Vira — mengembang menjadi sesuatu yang mengerikan. Bayangan raksasa dengan ratusan mata hijau yang berkedip di seluruh tubuhnya.</p>
<p>Hutan bergerak bersamanya. Pohon-pohon bengkok ke dalam. Tanah bergelombang. Akar menjulur seperti tentakel.</p>
<p>"LIMA RATUS TAHUN! LIMA RATUS TAHUN AKU MENUNGGU!"</p>
<p>Suaranya seperti gempa — datang dari dalam tanah, dari udara, dari dalam kepalamu.</p>
<p>"Dan kalian menyerahkan inti kekuatanku begitu saja? BODOH! Sekarang simpulnya di tanganku. Dan aku tidak butuh perjanjian. Aku butuh <em>makanan</em>."</p>
<p>Akar-akar mengejar kalian. Niko menarikmu ke samping saat akar menghantam tempat kau berdiri.</p>
<p><span class="speaker sera">Sera</span> berteriak saat akar melilit pergelangan kakinya.</p>`,
  blood: true,
  shake: true,
  choices: [
    {
      text: "Selamatkan Sera!",
      next: 'ch3_save_sera_attack',
      effect: (s) => {
        s.courage.arin += 15;
        s.flags.savedSeraAttack = true;
      }
    },
    {
      text: "Cari kelemahan entitas — dia terlalu percaya diri",
      next: 'ch3_find_weakness',
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.soughtWeakness = true;
      }
    }
  ]
},

'ch3_save_sera_attack': {
  text: (s) => {
    let result = `<p>Kau berlari ke Sera dan menarik tangannya. Akar itu kuat — seperti baja hidup — tapi kau tidak berhenti menarik.</p>`;

    if (s.flags.basementMarked) {
      result += `<p>Simbol di telapak tanganmu bercahaya — dan saat cahaya itu menyentuh akar, akar itu <em>mundur</em>. Terbakar.</p>
<p>Kau tidak mengerti bagaimana, tapi tanda itu melindungimu.</p>`;
    } else if (Engine.getTrust('arin', 'sera') >= 70) {
      result += `<p>Sera menatap matamu. Kalian terhubung — dan dalam koneksi itu, ada kekuatan. Akar itu melonggar.</p>`;
    }

    result += `<p>Sera bebas. Kalian berlari ke balik pohon besar, berlindung.</p>
<p>Entitas mengamuk — tapi ada pola dalam kemarahannya. Dia berpusat pada altar, pada batu. Dia tidak bisa terlalu jauh dari sana.</p>
<p>"Dia terikat ke altar," bisik Niko. "Kalau kita bisa mengambil batu kembali—"</p>`;

    return result;
  },
  choices: [
    {
      text: "Buat rencana: alihkan perhatian entitas, rebut batu",
      next: 'ch3_heist_plan',
      effect: (s) => {
        s.flags.heistPlan = true;
      }
    },
    {
      text: "Lari ke arah berlawanan dari altar",
      next: 'ch3_escape',
      effect: (s) => {
        s.flags.ranFromAttack = true;
      }
    }
  ]
},

'ch3_find_weakness': {
  text: `<p>Kau mengamati entitas di tengah kekacauan. Dan kau melihatnya — di antara ratusan mata hijau, ada satu yang berbeda. Bukan hijau. <em>Cokelat</em>. Mata manusia. Mata Vira.</p>
<p>Vira — Vira yang asli — masih ada <em>di dalam</em> entitas ini. Terjebak. Dan mata coklatnya... menangis.</p>
<p>"Vira masih di sana!" teriakmu. "Dia masih di dalam!"</p>
<p><span class="speaker sera">Sera</span> melihat ke arah yang kau tunjuk. Dia melihatnya juga.</p>
<p>"VIRA! VIRA, KAU DENGAR AKU?"</p>
<p>Entitas berhenti. Seluruh tubuhnya membeku. Mata-mata hijaunya berkedip tak sinkron. Dan mata cokelat itu — Vira — membuka lebih lebar.</p>
<p>Dari dalam entitas, suara lemah:</p>
<p>"S-Sera...? Arin...?"</p>
<p>Entitas menggeliat kesakitan, menjerit.</p>
<p>"DIAM! KAU MILIKKU SEKARANG!"</p>`,
  choices: [
    {
      text: "Panggil nama Vira. Terus panggil. Bantu dia melawan.",
      next: 'ch3_call_vira',
      effect: (s) => {
        s.flags.calledVira = true;
        s.moralScore += 15;
        s.keyChoices.push('called_vira');
      }
    },
    {
      text: "Ambil batu dari altar selagi entitas terganggu",
      next: 'ch3_grab_stone',
      effect: (s) => {
        s.flags.grabbedStone = true;
        s.keyChoices.push('grabbed_stone');
      }
    }
  ]
},

'ch3_call_vira': {
  text: (s) => {
    let result = `<p>"VIRA! Kau ingat kami! Kau ingat malam-malam di atap rumah Sera, lihat bintang! Kau ingat es krim setelah ujian! Kau ingat janji kita — berlima selamanya!"</p>
<p>Sera ikut berteriak. Juno — kalau masih ada — juga. Niko. Semua memanggil namanya.</p>
<p>Entitas berteriak kesakitan. Tubuhnya retak — cahaya hijau bocor dari retakan. Dan dari dalam retakan itu, cahaya lain muncul. Hangat. Kuning. Manusiawi.</p>
<p>Vira melawan dari dalam.</p>`;

    if (Engine.getTrust('arin', 'sera') >= 60 && Engine.getTrust('arin', 'juno') >= 50) {
      result += `<p>Ikatan kalian — meskipun terluka, meskipun retak — masih cukup kuat. Cukup kuat untuk menjangkaunya.</p>
<p>Entitas berteriak satu kali terakhir — lalu <em>meledak</em>. Cahaya hijau menyebar ke segala arah. Dan di tempat entitas berdiri, Vira jatuh berlutut. Vira yang asli. Menangis. Hidup.</p>`;
      s.flags.viraFreed = true;
    } else {
      result += `<p>Tapi ikatan kalian — terlalu banyak luka, terlalu banyak kebohongan — tidak cukup kuat. Vira hampir bebas, tapi entitas menariknya kembali.</p>
<p>"Hampir." Entitas tersenyum di balik rasa sakit. "Tapi kalian tidak cukup <em>tulus</em>."</p>`;
      s.flags.viraStillTrapped = true;
    }

    return result;
  },
  choices: [
    {
      text: (s) => s.flags.viraFreed ? "Peluk Vira. Dia kembali." : "Kita harus cari cara lain.",
      next: (s) => s.flags.viraFreed ? 'ch3_vira_freed_attack' : 'ch3_heist_plan',
      effect: (s) => {
        if (s.flags.viraFreed) {
          s.keyChoices.push('vira_freed_by_bonds');
        }
      }
    }
  ]
},

'ch3_vira_freed_attack': {
  text: `<p>Vira menangis di pelukanmu. Tubuhnya kurus, kulitnya pucat, tapi dia <em>nyata</em>. Hangat. Manusia.</p>
<p>"Arin... aku bermimpi. Mimpi yang sangat panjang. Dan dalam mimpi itu, aku mendengar suara kalian. Samar. Tapi tidak pernah berhenti."</p>
<p>Entitas — yang sekarang terpisah dari Vira — mengecil. Tanpa host manusia, kekuatannya menyusut. Tapi masih memegang Inti Simpul.</p>
<p>Suaranya lemah tapi berbisa.</p>
<p>"Kalian membebaskan gadis itu. Bagus untuknya. Tapi aku masih punya ini." Batu berdenyut di tangannya. "Dan tanpa simpul yang utuh, hutan ini akan mati. Dan ketika hutan mati... <em>semuanya</em> mati."</p>
<p>Pohon-pohon di sekeliling clearing mulai layu. Daun menguning dan jatuh. Tanah retak.</p>
<p>"Serahkan batu itu," katamu.</p>
<p>"Berikan aku pengganti. Seseorang yang bersedia menjadi jembatan baru."</p>`,
  choices: [
    {
      text: '"Aku bersedia."',
      next: 'ending_arin_sacrifice',
      effect: (s) => {
        s.flags.arinSacrificed = true;
        s.moralScore += 30;
        s.keyChoices.push('arin_sacrifice');
      }
    },
    {
      text: '"Tidak ada yang menjadi jembayanmu. Serahkan batu itu atau kita hancurkan bersama."',
      next: 'ch3_final_standoff',
      effect: (s) => {
        s.flags.finalStandoff = true;
        s.keyChoices.push('final_standoff');
      }
    },
    {
      text: "Lihat Niko. Dia yang memulai semua ini.",
      next: 'ch3_niko_choice',
      condition: (s) => s.alive.niko,
      effect: (s) => {
        s.flags.lookedAtNiko = true;
      }
    }
  ]
},

'ch3_ritual_start': {
  chapter: 4,
  text: (s) => {
    const alive = Engine.CHARACTERS.filter(c => s.alive[c]);
    const aliveNames = alive.map(c => Engine.CHAR_DISPLAY[c]).join(', ');

    return `<p class="narration">Bab 4: Simpul Terakhir</p>
<p>Matahari terbit merah — merah seperti darah lama yang mengering.</p>
<p>Kalian berjalan ke hutan. ${aliveNames}. ${alive.length < 5 ? 'Tidak lengkap. Tapi masih ada.' : 'Lima. Seperti yang dibutuhkan.'}</p>
<p>Pohon tua menunggu. Altar di reruntuhan kuil menunggu. Cekungan untuk Inti Simpul terbuka seperti mulut yang kehausan.</p>
<p>Entitas — dalam wujud cahaya hijau yang mengambang — menunggu di dekat altar.</p>
<p>"Kalian datang." Ada sesuatu di suaranya — harapan? ketakutan? — yang membuatmu menyadari bahwa makhluk ini, seberapapun tuanya, sedang menghadapi momen yang menentukan hidupnya.</p>
<p>"Letakkan batu di altar. Taruh tangan kalian di kulit pohon. Dan ucapkan kebenaran kalian — satu per satu."</p>
<p>"Kebenaran yang paling menyakitkan. Yang paling kalian takuti untuk diucapkan."</p>`;
  },
  choices: [
    {
      text: "Mulai ritual",
      next: 'ch3_ritual_truths',
      effect: (s) => { s.flags.ritualStarted = true; }
    }
  ]
},

'ch3_ritual_truths': {
  text: (s) => {
    let truths = `<p>Batu diletakkan di altar. Cahaya hijau meluap — lembut, hangat, menunggu.</p>
<p>Satu per satu, tangan menyentuh kulit pohon tua.</p>`;

    if (s.alive.niko) {
      truths += `<p><span class="speaker niko">Niko</span> pertama. Tangannya gemetar.</p>
<p>"Kebenaran ku... aku membawa kalian ke sini karena egois. Aku ingin kekuatan. Aku ingin mengendalikan orang karena aku takut ditinggalkan." Air mata mengalir. "Maafkan aku."</p>`;
    }
    if (s.alive.sera) {
      truths += `<p><span class="speaker sera">Sera</span> menyentuh pohon dengan kedua tangan.</p>
<p>"Kebenaranku... aku tahu ada yang salah dengan Vira sejak hari pertama dia kembali. Tapi aku diam karena aku takut sendirian. Takut tidak ada yang percaya padaku." Dia terisak. "Aku memilih kenyamananku daripada keselamatan sahabatku."</p>`;
    }
    if (s.alive.juno) {
      truths += `<p><span class="speaker juno">Juno</span> jatuh berlutut di depan pohon.</p>
<p>"Kebenaranku... aku ada di Halimun bersama Vira. Aku melihat sesuatu mengambilnya. Dan aku lari." Suaranya hancur. "Aku meninggalkan orang yang paling aku pedulikan karena aku pengecut."</p>`;
    }

    truths += `<p>Giliranmu. Pohon menunggu. Entitas menunggu. Teman-temanmu menunggu.</p>
<p>Apa kebenaranmu, Arin?</p>`;

    return truths;
  },
  choices: [
    {
      text: '"Kebenaranku... aku selalu berdiri di tengah karena aku takut memihak. Takut kehilangan siapa pun."',
      next: 'ch3_ritual_complete',
      effect: (s) => {
        s.moralScore += 15;
        s.flags.arinTruth = 'fear_of_choosing';
        s.keyChoices.push('truth_fear');
      }
    },
    {
      text: '"Kebenaranku... aku tahu ada yang salah dengan kita semua. Dan aku tetap diam karena lebih mudah."',
      next: 'ch3_ritual_complete',
      effect: (s) => {
        s.moralScore += 20;
        s.flags.arinTruth = 'complicity';
        s.keyChoices.push('truth_complicity');
      }
    },
    {
      text: '"Kebenaranku... aku peduli pada kalian lebih dari apapun di dunia ini."',
      next: 'ch3_ritual_complete',
      effect: (s) => {
        s.moralScore += 25;
        s.flags.arinTruth = 'love';
        s.keyChoices.push('truth_love');
      }
    }
  ]
},

'ch3_ritual_complete': {
  text: (s) => {
    const aliveCount = Engine.CHARACTERS.filter(c => s.alive[c]).length;
    const totalTrust = Object.values(s.trust).reduce((a, b) => a + b, 0);
    const avgTrust = Math.round(totalTrust / Object.keys(s.trust).length);

    if (aliveCount >= 4 && avgTrust >= 55 && s.moralScore >= 30) {
      s.flags.perfectRitual = true;
      return `<p>Pohon tua bercahaya. Bukan hanya hijau — semua warna. Pelangi yang mengalir di kulit kayunya, di akar-akarnya, di udara.</p>
<p>Batu di altar berdenyut terakhir kali — lalu melebur ke dalam kayu. Menjadi satu dengan pohon. Kembali ke tempatnya.</p>
<p>Tanah bergetar lembut. Akar-akar bergerak — bukan mengancam, tapi <em>memeluk</em>. Memeluk kalian semua.</p>
<p>Dan dari dalam akar itu, seseorang muncul. Vira. Vira yang asli. Matanya terbuka, bingung, basah.</p>
<p>"A-Arin...? Teman-teman...?"</p>
<p>Entitas — sekarang bukan lagi bayangan menakutkan, tapi cahaya hangat yang melayang di udara — berbicara untuk terakhir kalinya:</p>
<p>"Simpul baru sudah terikat. Lebih kuat dari yang lama. Karena yang lama dibuat dari perjanjian. Yang ini dibuat dari <em>kebenaran</em>."</p>
<p>"Kalian bebas."</p>`;
    }

    if (aliveCount >= 3 && avgTrust >= 40) {
      s.flags.imperfectRitual = true;
      return `<p>Pohon tua bercahaya — tapi tidak rata. Bagian-bagian gelap tetap gelap. Simpul yang terbentuk kuat tapi tidak sempurna.</p>
<p>Batu melebur ke altar. Vira muncul dari akar — hidup, tapi lemah. Pucat. Matanya tidak fokus.</p>
<p>Entitas berbicara: "Simpul terikat. Tapi ada retakan. Ikatan kalian kuat... tapi tidak utuh."</p>
<p>"Vira akan bangun. Tapi ingatan yang hilang — tiga minggu itu — tidak akan pernah kembali. Dan hutan ini... akan hidup, tapi tidak sepenuhnya."</p>
<p>"Ini bukan ending yang sempurna. Tapi ini nyata."</p>`;
    }

    s.flags.failedRitual = true;
    return `<p>Pohon tua menyerap cahaya batu — tapi menolaknya. Energi meluap keluar seperti darah dari luka yang terlalu dalam.</p>
<p>Tanah bergetar. Retak. Akar-akar menggelepar kesakitan.</p>
<p>Entitas menjerit.</p>
<p>"TIDAK CUKUP! Ikatan kalian terlalu lemah! Terlalu banyak kebohongan! Terlalu banyak luka yang tidak disembuhkan!"</p>
<p>Cahaya meledak. Putih menyilaukan. Kau terpental ke belakang.</p>
<p>Ketika cahaya mereda, altar retak dua. Batu pecah menjadi serpihan. Dan pohon tua...</p>
<p>Pohon tua mulai mati.</p>`;
  },
  shake: true,
  choices: [
    {
      text: (s) => {
        if (s.flags.perfectRitual) return "Peluk Vira. Pulang bersama.";
        if (s.flags.imperfectRitual) return "Bantu Vira berdiri. Saatnya pulang.";
        return "...apa yang sudah kami lakukan?";
      },
      next: (s) => {
        if (s.flags.perfectRitual) return 'ending_compute';
        if (s.flags.imperfectRitual) return 'ending_compute';
        return 'ch3_failed_ritual';
      }
    }
  ]
},

'ch3_failed_ritual': {
  text: `<p>Hutan menangis. Bukan metafora — pohon-pohon mengeluarkan getah yang mengalir seperti air mata. Tanah merintih.</p>
<p>Entitas mengecil. Cahayanya sekarat.</p>
<p>"Simpul terputus. Selamanya."</p>
<p>Kau mendengar suara dari dalam tanah — Vira, terperangkap, berteriak dalam mimpi yang berubah menjadi mimpi buruk tanpa akhir.</p>
<p>"Dia... dia tidak bisa bangun lagi." Suara entitas hanya bisikan sekarang. "Maafkan aku. Aku tidak cukup kuat."</p>
<p>Hutan mulai berubah. Warna memudar. Suara menghilang. Dunia menjadi datar, kosong, abu-abu.</p>`,
  choices: [
    {
      text: "Gali tanah. Keluarkan Vira dengan tanganmu.",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.dugForVira = true;
        s.moralScore += 10;
        s.keyChoices.push('dug_for_vira');
      }
    },
    {
      text: "Pergi. Tidak ada lagi yang bisa kau lakukan.",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.leftVira = true;
        s.moralScore -= 15;
        s.keyChoices.push('left_vira');
      }
    }
  ]
},

'ch3_escape': {
  text: (s) => {
    const alive = Engine.CHARACTERS.filter(c => s.alive[c]);

    return `<p>"Kita pergi. Sekarang."</p>
<p>Kalian berlari ke arah jalan setapak. Hutan — seolah mendengar keputusan kalian — bereaksi. Pohon-pohon bergeser, menutup jalan. Akar menjulur. Kabut naik dari tanah.</p>
<p>Tapi kalian terus berlari. ${alive.length} jiwa yang menolak permainan hutan.</p>
<p>Entitas — dari kedalaman — berbicara untuk terakhir kalinya:</p>
<p class="journal"><em>"Kalian bisa pergi. Aku tidak akan menghentikan kalian. Tapi Vira tetap di sini. Dan simpul yang mengikat persahabatan kalian... akan perlahan membusuk."</em></p>
<p>Cabang-cabang terbuka. Jalan setapak muncul. Cahaya pagi menerobos kanopi.</p>
<p>Kalian keluar dari hutan. Mobil Niko masih di sana. Kunci masih di saku Niko — atau di mana pun dia meninggalkannya.</p>
<p>Kalian meninggalkan hutan. Meninggalkan cabin. Meninggalkan Vira.</p>
<p>Udara di luar hutan terasa berbeda. Lebih tipis. Lebih dingin. Seolah kalian meninggalkan sesuatu yang fundamental di dalam sana.</p>`;
  },
  choices: [
    {
      text: "Masuk mobil dan pergi",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.escaped = true;
        s.keyChoices.push('escaped');
      }
    },
    {
      text: "Berhenti. Berbalik. Kembali ke hutan.",
      next: 'ch3_return',
      effect: (s) => {
        s.flags.returned = true;
        s.courage.arin += 20;
        s.moralScore += 20;
        s.keyChoices.push('returned');
      }
    }
  ]
},

'ch3_return': {
  text: `<p>"Tidak." Kau berhenti. "Aku tidak bisa."</p>
<p>Sera menatapmu. "Arin..."</p>
<p>"Vira masih di sana. Aku tidak bisa meninggalkannya. Kalian pergilah. Aku kembali."</p>
<p>Keheningan. Lalu — satu per satu — mereka berbalik bersamamu.</p>
<p>Sera. Pertama. Selalu pertama.</p>
<p>Juno — kalau masih ada. Dengan air mata di pipi dan tekad di mata.</p>
<p>Niko — kalau masih ada. Rahangnya kaku tapi langkahnya pasti.</p>
<p>"Kita kembali," katamu. "Bersama."</p>
<p>Hutan menyambutmu kembali. Dan kali ini, kau bisa bersumpah — pohon-pohon membuka jalan lebih lebar. Seolah hutan <em>menghargai</em> keputusan kalian.</p>`,
  choices: [
    {
      text: "Kembali ke altar",
      next: 'ch3_ritual_start',
      effect: (s) => {
        s.moralScore += 15;
        s.flags.secondChance = true;
        s.keyChoices.push('second_chance');
      }
    }
  ]
},

'ch3_destroy_stone': {
  text: `<p>Kau mengambil batu dari kotak. Cahaya hijaunya berdenyut — memohon, hampir.</p>
<p>"Arin, apa yang kau—" Niko melihat matamu dan berhenti.</p>
<p>"Kalau batu ini yang memulai semua ini — yang membuat hutan rakus, yang membuat Vira diambil — maka batu ini harus dihancurkan."</p>
<p>Kau mengangkatnya tinggi. Entitas — dari dalam hutan — berteriak.</p>
<p>"JANGAN! Kalau kau menghancurkan inti itu, simpul terputus selamanya! Hutan mati! Vira mati! AKU MATI!"</p>
<p>Sera mencengkeram lenganmu. "Arin, tunggu — kalau Vira masih terikat—"</p>
<p>Batu berdenyut di tanganmu. Hangat. Hidup. Dan dalam denyutnya, kau mendengar bisikan:</p>
<p class="journal"><em>"Tolong. Jangan."</em></p>
<p>Suara itu... suara Vira. Vira yang asli.</p>`,
  choices: [
    {
      text: "Hancurkan batu itu. Akhiri siklusnya.",
      next: 'ending_compute',
      danger: true,
      effect: (s) => {
        s.flags.destroyedStone = true;
        s.moralScore -= 20;
        if (s.difficulty >= 2) Engine.killChar('vira');
        s.keyChoices.push('destroyed_stone');
      }
    },
    {
      text: "Turunkan batu. Kau tidak bisa melakukan ini.",
      next: 'ch3_ritual_start',
      effect: (s) => {
        s.flags.sparedStone = true;
        s.moralScore += 10;
        s.keyChoices.push('spared_stone');
      }
    }
  ]
},

'ch3_final_negotiation': {
  text: `<p>Kau berjalan ke tepi clearing sendirian. Hutan menyambutmu — lebih lembut sekarang. Lebih lelah.</p>
<p>Entitas muncul. Bukan dalam wujud Vira lagi — dalam wujud aslinya. Cahaya hijau yang mengambang, tanpa bentuk pasti, tapi entah bagaimana terasa <em>tua</em> dan <em>sedih</em>.</p>
<p>"Kau datang lagi."</p>
<p>"Aku datang untuk menawarkan jalan ketiga."</p>
<p>Entitas mendengarkan.</p>
<p>"Kau butuh jembatan. Seseorang yang terikat pada hutan dan dunia manusia. Tapi kau tidak perlu <em>mengurung</em> seseorang untuk itu."</p>
<p>"Bagaimana kalau... kita semua menjadi jembatan? Bukan satu orang yang tinggal. Lima orang yang <em>mengingat</em>. Yang datang kembali. Yang menjaga."</p>
<p>Entitas terdiam lama.</p>
<p>"Lima penjaga... bukan satu tawanan." Cahayanya berkedip. "Itu... itu bisa berhasil. Tapi itu berarti kalian terikat pada hutan ini. Selamanya. Kalian akan mendengar panggilannya di mimpi. Merasakan sakit saat pohon ditebang. Menangis saat musim kering."</p>
<p>"Kalian bersedia menanggung itu?"</p>`,
  choices: [
    {
      text: '"Ya. Kami bersedia."',
      next: 'ch3_ritual_start',
      effect: (s) => {
        s.flags.fiveGuardians = true;
        s.moralScore += 25;
        s.keyChoices.push('five_guardians');
      }
    },
    {
      text: '"Aku perlu bicara dengan yang lain dulu."',
      next: 'ch3_discuss_guardians',
      effect: (s) => {
        s.flags.discussedGuardians = true;
      }
    }
  ]
},

'ch3_discuss_guardians': {
  text: (s) => {
    let reactions = `<p>Kau menceritakan tawaran entitas pada teman-temanmu.</p>`;

    if (s.alive.sera) {
      reactions += `<p><span class="speaker sera">Sera</span> mengangguk pelan. "Aku bersedia. Aku sudah bisa merasakan hutan ini sejak kita datang. Mungkin ini memang takdirku."</p>`;
    }
    if (s.alive.juno) {
      reactions += `<p><span class="speaker juno">Juno</span> menarik napas. "Kalau ini cara menebus Vira... aku ikut. Apapun harganya."</p>`;
    }
    if (s.alive.niko) {
      if (Engine.getTrust('arin', 'niko') >= 50) {
        reactions += `<p><span class="speaker niko">Niko</span> diam lama. "Aku... aku ingin ini bukan tentang kekuasaan. Untuk pertama kalinya, aku ingin ini tentang <em>melayani</em>." Dia mengangguk. "Aku ikut."</p>`;
      } else {
        reactions += `<p><span class="speaker niko">Niko</span> menggeleng. "Terikat selamanya? Itu sama saja dengan penjara. Aku tidak mau."</p>`;
        s.flags.nikoRefused = true;
      }
    }

    return reactions;
  },
  choices: [
    {
      text: "Lakukan ritual dengan yang bersedia",
      next: 'ch3_ritual_start',
      effect: (s) => {
        s.flags.fiveGuardians = !s.flags.nikoRefused;
        s.moralScore += 15;
      }
    }
  ]
},

'ch3_final_standoff': {
  text: `<p>"Tidak ada yang menjadi jembayanmu. Kami menolak."</p>
<p>Entitas menatapmu. Matanya — ratusan mata — berkedip bersamaan.</p>
<p>"Kalau tidak ada jembatan... hutan mati. Aku mati. Vira mati."</p>
<p>"Maka kita cari cara lain."</p>
<p>Kau mengulurkan tanganmu ke arah entitas. Bukan untuk menyerang. Bukan untuk merebut. Untuk <em>menawarkan</em>.</p>
<p>"Kau bilang kau kesepian. Lima ratus tahun sendirian. Aku mengerti itu. Tapi cara yang kau pilih — mengambil wujud orang lain, menculik, memaksa — itu bukan koneksi. Itu <em>kepemilikan</em>."</p>
<p>"Koneksi yang nyata membutuhkan kerelaan. Kebebasan. Pilihan."</p>
<p>Entitas menatap tanganmu yang terulur.</p>
<p>"Kau... menawarkan tangan? Kepadaku?"</p>
<p>"Ya."</p>
<p>Keheningan panjang. Lalu, perlahan — cahaya hijau bergerak maju dan menyentuh jari-jarimu. Dingin. Tapi bukan dingin yang jahat. Dingin seperti air sungai di pagi hari.</p>
<p>"Ini pertama kalinya... seseorang menyentuhku dengan sukarela."</p>`,
  choices: [
    {
      text: '"Sekarang serahkan batu itu. Dan bebaskan Vira."',
      next: 'ending_compute',
      effect: (s) => {
        s.flags.peacefulResolution = true;
        s.moralScore += 30;
        s.keyChoices.push('peaceful_resolution');
      }
    }
  ]
},

'ch3_niko_choice': {
  text: (s) => {
    if (Engine.getTrust('arin', 'niko') >= 60) {
      return `<p>Niko mengerti tatapanmu. Dan — mengejutkan semua orang — dia melangkah maju.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Aku yang mulai semua ini. Kakekku yang mengambil batu itu. Aku yang membawa kalian ke sini." Suaranya tenang — lebih tenang dari yang pernah kau dengar. "Biarkan aku yang menyelesaikannya."</p>
<p>"Aku bersedia menjadi jembatan."</p>
<p>Entitas menatapnya. "Kau yakin? Ini berarti kau terikat pada hutan ini. Selamanya."</p>
<p>Niko tersenyum. Untuk pertama kalinya, senyum yang jujur.</p>
<p>"Mungkin ini caraku berhenti egois."</p>`;
    }

    return `<p>Niko menatapmu balik. Matanya dingin.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kau ingin aku yang mengorbankan diri? Tentu saja. Selalu Niko yang harus mengambil beban, kan?"</p>
<p>"Tidak, Arin. Aku sudah memberikan cukup banyak."</p>
<p>Dia berbalik dan berjalan menjauh.</p>`;
  },
  choices: [
    {
      text: (s) => Engine.getTrust('arin', 'niko') >= 60 ? '"Niko... terima kasih."' : '"Kalau bukan Niko, maka aku."',
      next: 'ending_compute',
      effect: (s) => {
        if (Engine.getTrust('arin', 'niko') >= 60) {
          s.flags.nikoSacrificed = true;
          s.keyChoices.push('niko_sacrifice');
        } else {
          s.flags.arinSacrificed = true;
          s.moralScore += 20;
          s.keyChoices.push('arin_forced_sacrifice');
        }
      }
    }
  ]
},

'ch3_vira_awake': {
  chapter: 3,
  text: `<p>Vira membuka mata. Mata yang <em>benar</em> — cokelat hangat, bingung, takut, tapi manusiawi.</p>
<p>"Di mana..." dia batuk. Suaranya serak, seperti tidak dipakai selama berminggu-minggu. "Di mana aku?"</p>
<p>Sera berlutut di sampingnya, menangis. "Vira. Vira, kamu kembali."</p>
<p>Juno berdiri di belakang, air mata mengalir tanpa suara, tangan menutupi mulutnya.</p>
<p>"Aku... aku bermimpi. Mimpi yang sangat panjang tentang pohon dan cahaya hijau dan..." Vira melihat sekeliling. Hutan. Cabin. Wajah-wajah yang dia kenal tapi terasa jauh.</p>
<p>"Berapa lama aku pergi?"</p>
<p>"Enam bulan."</p>
<p>Vira menutup matanya. Air mata mengalir.</p>
<p>Tanpa entitas sebagai pemandu, kalian harus menyelesaikan ini sendiri. Batu masih ada. Altar masih ada. Tapi tidak ada yang tahu aturan ritualnya.</p>`,
  choices: [
    {
      text: "Coba lakukan ritual sendiri — taruh batu di altar",
      next: 'ch3_ritual_start',
      effect: (s) => {
        s.flags.blindRitual = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Bawa Vira keluar hutan. Tinggalkan sisanya.",
      next: 'ch3_escape',
      effect: (s) => {
        s.flags.rescuedViraOnly = true;
        s.flags.viraRescued = true;
      }
    }
  ]
},

'ch3_heist_plan': {
  text: `<p>Kalian bersembunyi di balik reruntuhan kuil, merencanakan.</p>
<p>"Sera dan Juno, kalian alihkan perhatiannya dari sisi timur. Aku dan Niko dari barat ke altar."</p>
<p>Entitas yang mengamuk — pohon menggelepar, tanah retak — terlalu sibuk dengan kemarahannya untuk memperhatikan taktik.</p>
<p>Sera dan Juno berlari ke timur, berteriak, menarik perhatian. Entitas berbalik — akar-akar mengejar mereka.</p>
<p>Kau dan Niko berlari ke altar. Batu ada di sana — berdenyut, menunggu.</p>
<p><span class="speaker niko">Niko</span> meraih batu itu. Dan saat kulitnya menyentuh permukaan batu, matanya berubah — untuk sesaat — hijau. Kekuatan batu memanggilnya. Menjanjikan segalanya.</p>
<p>"Niko! Jangan!"</p>
<p>Niko tersentak. Kembali ke dirinya. Tangannya gemetar tapi memegang batu erat.</p>
<p>"Aku... aku oke. Ayo."</p>`,
  choices: [
    {
      text: "Lari keluar hutan dengan batu",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.stoleStoneback = true;
        s.keyChoices.push('stole_stone_back');
      }
    },
    {
      text: "Taruh batu kembali di altar — selesaikan ritualnya sekarang",
      next: 'ch3_ritual_truths',
      effect: (s) => {
        s.flags.impromptuRitual = true;
        s.keyChoices.push('impromptu_ritual');
      }
    }
  ]
},

'ch3_grab_stone': {
  text: `<p>Saat entitas bergelut dengan Vira di dalamnya, kau berlari ke altar dan meraih batu. Tanganmu menutup di sekelilingnya — panas, berdenyut, hidup.</p>
<p>Entitas berputar ke arahmu. "TIDAK!"</p>
<p>Tapi kau sudah berlari. Batu di tanganmu. Kekuatan mengalir — menggelitik, menggoda, menjanjikan. Kau bisa merasakan mengapa Niko menginginkannya. Mengapa kakeknya tidak bisa melepaskannya.</p>
<p>Kau sampai di tepian clearing. Teman-temanmu ada di sana.</p>
<p>"AKU PUNYA BATUNYA!" teriakmu. "APA YANG HARUS KITA LAKUKAN?"</p>`,
  choices: [
    {
      text: "Hancurkan batu itu",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.destroyedStone = true;
        s.moralScore -= 10;
        s.keyChoices.push('destroyed_stone');
      }
    },
    {
      text: "Kembalikan ke altar dengan ritual yang benar",
      next: 'ch3_ritual_truths',
      effect: (s) => {
        s.flags.returnedStone = true;
        s.keyChoices.push('returned_stone');
      }
    }
  ]
},

'ending_arin_sacrifice': {
  text: `<p>"Aku bersedia." Suaramu tidak bergetar. Kau tidak tahu dari mana ketenangan ini datang.</p>
<p>Sera menangis. "Tidak. TIDAK! Arin, kamu tidak boleh—"</p>
<p>"Sera." Kau memegang tangannya. "Jaga yang lain. Jaga Vira. Jaga Juno dan Niko."</p>
<p>Juno memelukmu. Niko — bahkan Niko — menyeka matanya.</p>
<p>Entitas menyerahkan batu. Kau berjalan ke pohon tua. Meletakkan batu di cekungan akar. Dan saat kau melakukannya, akar-akar mulai memelukmu — lembut, seperti selimut.</p>
<p>"Tidak sakit," bisik entitas. "Aku berjanji."</p>
<p>Yang terakhir kau lihat: empat wajah yang kau cintai, diterangi cahaya fajar pertama. Sera menangis. Juno mencoba tersenyum. Niko mengangguk — hormat yang tulus. Dan Vira — Vira asli — membuka mata untuk pertama kalinya.</p>
<p>"Arin...?" suaranya bingung, lemah. "Arin, kenapa...?"</p>
<p>Kau tersenyum. Dan hutan memelukmu pulang.</p>`,
  choices: [
    {
      text: "...",
      next: 'ending_compute',
      effect: (s) => {
        s.flags.arinBecameGuardian = true;
        s.alive.arin = false;
        s.moralScore += 30;
        s.keyChoices.push('became_guardian');
      }
    }
  ]
}

};
