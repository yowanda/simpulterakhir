/* ============================================================
   SIMPUL TERAKHIR — BAB 6: Konfrontasi
   Pertempuran final dimulai. Arin dan yang tersisa melawan
   sistem Sang Penenun. Siapa yang menang menentukan ending.
   ============================================================ */

const STORY_CH6 = {

'ch6_start': {
  chapter: 6,
  text: (s) => {
    let text = `<p class="narration">Countdown: <strong>00:30:00</strong>. Tiga puluh menit sebelum fajar. Tiga puluh menit yang akan menentukan apakah siklus ini berakhir — atau berlanjut.</p>`;
    text += `<p>Yang tersisa: `;
    let aliveNames = [];
    Engine.CHARACTERS.forEach(c => { if (s.alive[c]) aliveNames.push(Engine.CHAR_DISPLAY[c]); });
    text += aliveNames.join(', ') + `.</p>`;

    // Player-specific ch6 perspective
    const pc = s.playerCharacter || 'arin';
    if (pc === 'lana') {
      text += `<p class="journal"><em>Momen keputusan. Kau bisa menyelesaikan tugasmu untuk Sang Penenun — atau kau bisa membalik skenarionya. Dalang yang menulis ending yang berbeda.</em></p>`;
    } else if (pc === 'dimas') {
      text += `<p class="journal"><em>Instruksi terakhir Lana: "Kalau ada yang turun — pastikan mereka tidak kembali." Tapi tanganmu menolak memegang pisau. Sera mengubahmu tanpa menyentuhmu.</em></p>`;
    } else if (pc === 'niko') {
      text += `<p class="journal"><em>Ini mansionmu. Dosa kakekmu. Dan sekarang — satu-satunya cara menebusnya adalah turun ke bawah dan menghadapi monster yang kakekmu ciptakan.</em></p>`;
    } else if (pc === 'vira') {
      text += `<p class="journal"><em>Terakhir kali kau turun ke sana, kau hampir tidak kembali. Tapi kali ini berbeda. Kali ini kau tidak sendirian. Kali ini kau punya sesuatu untuk diperjuangkan.</em></p>`;
    }

    text += `<p>Kau sudah tahu semuanya. Ragil Pramudya — Sang Penenun — hidup di bawah mansion. Operator-operatornya bermain ganda. Sistem ini beroperasi selama setengah abad. Dan malam ini bisa jadi yang terakhir — jika kau bisa menghancurkannya.</p>`;
    text += `<p>Tiga puluh menit. Dan dalam tiga puluh menit itu, setiap orang di ruangan ini menunjukkan siapa mereka sebenarnya:</p>`;

    if (pc !== 'sera') {
      text += `<p><span class="speaker sera">Sera</span> menarikmu ke samping. "${pc === 'arin' ? 'Arin' : Engine.playerName()}, jangan turun ke sana sendirian." Matanya merah. Psikolog yang akhirnya mengakui bahwa dia tidak bisa profesional malam ini.</p>`;
    } else {
      text += `<p>Kau menarik Arin ke samping. "Jangan turun ke sana sendirian." Matamu merah — dan untuk pertama kalinya dalam kariermu, kau tidak berusaha menyembunyikannya.</p>`;
    }

    if (pc !== 'niko') {
      text += `<p><span class="speaker niko">Niko</span> berdiri. "Ini salahku. Aku yang turun." Egonya masih di sana — tapi untuk pertama kalinya, mendorongnya ke arah yang benar.</p>`;
    }
    if (pc !== 'juno') {
      text += `<p><span class="speaker juno">Juno</span> mengambil pipa besi. "Gue ikut." Ceroboh. Impulsif. Tapi berani sampai ke tulang.</p>`;
    } else {
      text += `<p>Lo ambil pipa besi dari tumpukan puing. "Gue ikut." Lo nggak peduli rencana — lo cuma tahu lo nggak bisa diam.</p>`;
    }
    if (pc !== 'farah') {
      text += `<p><span class="speaker farah">Farah</span>: "Aku akan menjaga yang di atas." Ada air mata di matanya — pertama kalinya malam ini.</p>`;
    } else {
      text += `<p>"Aku akan menjaga yang di atas," katamu. Egoisme? Tidak. Strategi. Seseorang harus memastikan pintu keluar tetap ada.</p>`;
    }
    if (pc !== 'kira') {
      text += `<p><span class="speaker kira">Kira</span> sudah menghubungkan laptopnya ke sistem. "Gue bisa shut down sistem dari sini. Kalau lo turun, gue cover dari atas."</p>`;
    } else {
      text += `<p>Lo hubungkan laptop ke sistem. "Gue bisa shut down semuanya dari sini." Jari-jarimu sudah nge-map seluruh arsitektur digital mansion. Sekarang tinggal eksekusi.</p>`;
    }

    if (s.flags.confrontedPenenun || s.flags.listenedToPenenun) {
      text += `<p>Kau sudah bertemu Ragil. Sudah melihat wajah monster di balik simpul. Sekarang pertanyaannya: bagaimana mengakhiri?</p>`;
    } else {
      text += `<p>Bukti digital dari lair B-3 ada di tanganmu. Tapi Ragil masih di bawah sana — masih mengendalikan.</p>`;
    }

    text += `<p>Tiga opsi. Tiga jalan menuju akhir.</p>`;

    return text;
  },
  choices: [
    {
      text: "Turun ke B-3 dan konfrontasi langsung Ragil — akhiri di akarnya",
      next: 'ch6_final_descent',
      effect: (s) => {
        s.flags.finalDescent = true;
        Engine.modDanger(15);
        s.courage.arin += 15;
      }
    },
    {
      text: "Bakar mansion. Hancurkan server, bukti, dan sistem. Api yang memurnikan.",
      danger: true,
      next: 'ch6_burn_mansion',
      effect: (s) => {
        s.flags.burnMansion = true;
        Engine.modDanger(25);
        s.moralScore -= 5;
      }
    },
    {
      text: "Rencana berbeda — kirim bukti digital ke luar sebelum menghancurkan apapun",
      condition: (s) => s.items.includes('digital_evidence') || s.flags.hasInsuranceDrive,
      next: 'ch6_broadcast_evidence',
      effect: (s) => {
        s.flags.broadcastPlan = true;
      }
    }
  ]
},

'ch6_final_descent': {
  text: (s) => {
    let text = `<p>Kau turun ke B-3 untuk terakhir kalinya. Di belakangmu: `;

    let companions = [];
    if (s.alive.vira) companions.push('Vira');
    if (s.alive.juno) companions.push('Juno');
    if (s.alive.sera) companions.push('Sera');
    if (s.alive.lana && !Engine.isKiller('lana')) companions.push('Lana');
    text += companions.length > 0 ? companions.join(', ') : 'tidak ada siapapun';
    text += '.</p>';

    text += `<p>B-3. Apartemen bawah tanah Ragil Pramudya. Monitor-monitor masih menyala — atau sudah diganti.</p>`;

    if (s.flags.confrontedPenenun || s.flags.listenedToPenenun) {
      text += `<p>Ragil masih di kursi rodanya. Menunggu. Seolah dia TAHU kau akan kembali.</p>`;
      text += `<p>"Arin. Kau kembali." Senyum tipis. "Aku tidak heran."</p>`;
    } else {
      text += `<p>Dan di sana — di kursi roda di tengah ruangan — pria tua. Ragil Pramudya. Sang Penenun.</p>`;
      text += `<p>"Ah. Tamu pertama yang sampai ke sini tanpa diundang." Suaranya serak tapi tajam. "Impressive."</p>`;
    }

    text += `<p>"Ini berakhir, Ragil." Suaramu lebih stabil dari yang kau rasakan.</p>`;
    text += `<p>"Ya, ini berakhir. Tapi bukan seperti yang kau bayangkan." Dia menekan tombol di kursi rodanya.</p>`;
    text += `<p>Monitor berubah. Menampilkan feed langsung: beberapa wajah. Orang-orang yang kau tidak kenal, duduk di ruangan berbeda, menonton feed dari mansion ini.</p>`;
    text += `<p>"Dewan Penenun," kata Ragil. "Aku hanya aktor. Mereka — sutradara, produser, dan penonton. Semuanya sekaligus."</p>`;
    text += `<p>"Setiap orang kaya yang bosan. Setiap dalang yang butuh hiburan. Mereka membayar untuk menonton. Dan siklus berlanjut — bukan karena aku, tapi karena ADA PASAR."</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: '"Matikan feed. Cabut koneksi. Mereka kehilangan pertunjukan, mereka kehilangan insentif."',
      next: 'ch6_cut_feed',
      effect: (s) => {
        s.flags.cutFeed = true;
        s.keyChoices.push('cut_feed');
      }
    },
    {
      text: '"Kalau mereka menonton — mereka merekam diri sendiri. Aku bisa melacak balik."',
      next: 'ch6_trace_back',
      effect: (s) => {
        s.flags.tracedBack = true;
        Engine.modAwareness('arin', 20);
        s.keyChoices.push('traced_council');
      }
    },
    {
      text: "Hancurkan semuanya — fisik. Cabut kabel, hancurkan server, tutup akses B-3 permanen.",
      next: 'ch6_destroy_lair',
      effect: (s) => {
        s.flags.destroyedLair = true;
        Engine.modDanger(10);
      }
    }
  ]
},

'ch6_cut_feed': {
  text: `<p>Kau menarik kabel. Satu per satu. Monitor mati. Ragil berteriak — suara seorang pria tua yang kehilangan satu-satunya hal yang masih dia kendalikan.</p>
<p>"JANGAN! Tanpa feed, mereka akan mengirim cleanup crew! Mereka akan MENGHILANGKAN SEGALANYA — termasuk kalian!"</p>
<p>"Biarkan mereka datang. Kita sudah punya bukti."</p>
<p>Monitor terakhir mati. Gelap. Ragil terdiam — lalu tertawa. Tawa yang mati di tengah-tengah.</p>
<p>"Kau pikir kau menang? Kau baru saja memotong satu benang. Jaring tetap utuh."</p>`,
  choices: [
    {
      text: "Bawa Ragil ke atas sebagai saksi hidup",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.capturedRagil = true;
        s.items.push('ragil_captured');
        s.keyChoices.push('captured_penenun');
      }
    },
    {
      text: "Tinggalkan dia di bawah. Kunci aksesnya. Biar dia membusuk di sini.",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.leftRagil = true;
        s.moralScore -= 5;
      }
    }
  ]
},

'ch6_trace_back': {
  text: (s) => {
    let text = `<p>"Koneksi dua arah berarti metadata dua arah." Kau duduk di workstation Ragil.</p>`;

    if (s.alive.kira) {
      text += `<p><span class="speaker kira">Kira</span> — masih hidup, masih jenius — duduk di sampingmu. "Aku bisa trace IP mereka. Berikan aku lima menit."</p>`;
      text += `<p>Lima menit yang terasa seperti seumur hidup. Kira mengetik. Ragil menonton — wajahnya berubah dari arogan menjadi... ketakutan.</p>`;
      text += `<p>"Stop. STOP. Kau tidak tahu apa yang kau lakukan—"</p>`;
      text += `<p>"IP locked. Enam lokasi. Dubai, Singapura, London, New York, Jakarta, dan..." Kira berhenti. "...gedung pemerintah?"</p>`;
    } else {
      text += `<p>Tanpa Kira, kau harus melakukannya sendiri. Terbatas. Tapi kau cukup paham teknologi untuk membaca log koneksi.</p>`;
      text += `<p>Enam IP address yang terhubung malam ini. Enam lokasi. Enam penonton yang membayar untuk menyaksikan manusia mati.</p>`;
    }

    text += `<p>Ragil: "Mereka akan membunuhmu. Mereka akan membunuh semua orang yang tahu."</p>`;
    text += `<p>"Mungkin. Tapi data ini sudah disimpan."</p>`;

    return text;
  },
  choices: [
    {
      text: "Simpan semua data. Ini senjata untuk setelah malam ini selesai.",
      next: 'ch7_start',
      effect: (s) => {
        s.items.push('council_data');
        s.cluesFound += 5;
        s.flags.hasCouncilData = true;
        s.keyChoices.push('has_council_data');
      }
    }
  ]
},

'ch6_destroy_lair': {
  text: `<p>Kau menghancurkan semuanya. Secara fisik. Server ditarik dari rak dan dihantam. Monitor diinjak. Kabel dicabut dan dipotong.</p>
<p>Ragil menangis. Bukan tangisan manipulatif — tangisan seseorang yang melihat karya hidupnya dihancurkan.</p>
<p>"Lima puluh tahun. Lima puluh tahun kerja. Kau menghancurkannya dalam lima menit."</p>
<p>"Kerja? Kau menyebutnya KERJA?" Suaramu bergetar dari amarah dan adrenalin.</p>
<p>Saat server terakhir mati, kau merasakan — sesuatu. Bukan kebebasan. Bukan kemenangan. Sesuatu yang lebih complicated. Kesadaran bahwa menghancurkan sistem tidak menghancurkan orang-orang yang membuatnya.</p>`,
  shake: true,
  choices: [
    {
      text: "Ke atas. Habiskan sisa malam ini di antara cahaya, bukan kegelapan.",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.destroyedPhysically = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch6_burn_mansion': {
  text: (s) => {
    let text = `<p>"Bakar semuanya."</p>`;
    text += `<p>Reaksi: kengerian. Dari semua orang.</p>`;
    text += `<p><span class="speaker sera">Sera</span>: "Arin, itu menghancurkan bukti—"</p>`;
    text += `<p>"Bukti untuk siapa? Polisi? Pengadilan? Sistem ini MENCAKUP mereka. Satu-satunya cara menghancurkan jaringan laba-laba adalah membakar jaringnya."</p>`;

    if (s.alive.lana) {
      text += `<p><span class="speaker lana">Lana</span>: "Aku setuju." Semua menatapnya. "Api tidak bisa dikorupsi. Api tidak bisa di-blackmail. Api adalah ending yang paling jujur."</p>`;
    }

    text += `<p>Wine cellar di basement. Puluhan botol alkohol berkadar tinggi. Kain. Korek api dari dapur.</p>`;
    text += `<p>Kau memulai dari B-2 — ruang server. Api menyala cepat di udara kering bawah tanah. Menjalar ke kabel, ke kertas, ke kayu tua.</p>`;
    text += `<p>Alarm kebakaran berbunyi — tapi tidak ada pemadam. Mansion ini di tengah hutan. Bantuan terdekat dua jam jauhnya.</p>`;
    text += `<p>Semua berlari ke atas. Api mengikuti — naik melalui ventilasi, melalui lorong-lorong yang menjadi cerobong asap.</p>`;

    return text;
  },
  blood: true,
  shake: true,
  glitch: true,
  choices: [
    {
      text: "Pastikan semua orang keluar sebelum api menyebar!",
      next: 'ch6_fire_escape',
      effect: (s) => {
        s.flags.fireEvacuation = true;
        s.moralScore += 10;
        Engine.modDanger(20);
      }
    },
    {
      text: "Turun ke B-3 dulu — pastikan Ragil tidak keluar",
      danger: true,
      next: 'ch6_ragil_fire',
      effect: (s) => {
        s.flags.wentBackForRagil = true;
        Engine.modDanger(30);
      }
    }
  ]
},

'ch6_fire_escape': {
  text: (s) => {
    let text = `<p>Api bergerak lebih cepat dari yang kau perkirakan. Dinding kayu tua menjadi bahan bakar sempurna. Asap mengisi lorong seperti air mengisi kapal tenggelam.</p>`;
    text += `<p>Kau memimpin evakuasi — pintu depan, jendela, apapun yang terbuka.</p>`;

    if (s.flags.hasMasterKey && !s.flags.usedKeyEarly) {
      text += `<p>Kunci master. Sekarang. Kau memasukkannya ke pintu utama. Memutar. Klik berat.</p>`;
      text += `<p>Pintu terbuka. Udara malam menyerbu masuk — dan menambah oksigen untuk api di belakang.</p>`;
      text += `<p>"KELUAR! SEMUA KELUAR!"</p>`;
    } else {
      text += `<p>Jendela lantai satu — yang sudah retak dari usaha Juno tadi — kali ini menyerah. Api melemahkan segel-nya. Kaca pecah.</p>`;
      text += `<p>Satu per satu, kalian memanjat keluar melalui jendela yang pecah, melalui pecahan kaca dan asap.</p>`;
    }

    text += `<p>Di luar, kalian berlari. Hutan pinus menangkap sedikit percikan api tapi hujan ringan yang mulai turun menahan penyebaran.</p>`;
    text += `<p>Dari kejauhan, mansion Wardhana terbakar. Lima puluh tahun sejarah gelap menjadi pilar api yang menerangi langit malam.</p>`;

    return text;
  },
  shake: true,
  choices: [
    {
      text: "Tonton mansion terbakar. Lalu jalan ke fajar.",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.mansionBurned = true;
        s.flags.outsideMansion = true;
        s.keyChoices.push('burned_mansion');
      }
    }
  ]
},

'ch6_ragil_fire': {
  text: `<p>Kau turun ke B-3 melawan arus asap. Paru-parumu memprotes. Matamu berair. Tapi kau turun.</p>
<p>Ragil masih di kursi rodanya. Api belum sampai di sini — tapi asap sudah. Dia batuk-batuk, lemah.</p>
<p>"Kau..." dia melihatmu melalui air mata dan asap, "...kau datang menyelamatkanku?"</p>
<p>"Bukan. Aku datang memastikan kau menghadapi konsekuensi. Bukan mati terbakar sendirian — tapi hidup dan diadili."</p>
<p>"Tidak ada pengadilan yang bisa menghukumku. Aku sudah sekarat."</p>
<p>"Tapi ada publik. Ada internet. Ada cerita. Dan aku SANGAT pandai bercerita."</p>
<p>Kau mendorong kursi rodanya ke tangga. Naik. Satu level. Dua. Tiga.</p>
<p>Api sudah di B-1 saat kalian sampai di lantai satu. Panas. Asap pekat.</p>
<p>Pintu keluar — terbuka. Seseorang sudah membukanya dari luar.</p>
<p>Kau mendorong Ragil keluar. Udara malam menghantam. Batuk yang tidak berhenti selama menit-menit yang terasa seperti jam.</p>`,
  shake: true,
  choices: [
    {
      text: "Ragil keluar hidup. Bukti hidup untuk dunia.",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.capturedRagil = true;
        s.flags.mansionBurned = true;
        s.flags.outsideMansion = true;
        s.items.push('ragil_captured');
        s.moralScore += 20;
        s.keyChoices.push('saved_penenun_from_fire');
      }
    }
  ]
},

'ch6_broadcast_evidence': {
  text: (s) => {
    let text = `<p>"Sebelum kita menghancurkan apapun — kirim bukti ke luar. Server, cloud, email, media. Semuanya."</p>`;

    if (s.alive.kira) {
      text += `<p><span class="speaker kira">Kira</span>: "Aku bisa setup broadcast darurat. Butuh koneksi internet — dan mansion ini punya."</p>`;
      text += `<p>"Tapi sinyal ke ponsel kita dipotong?"</p>`;
      text += `<p>"Sinyal SELULER dipotong. Mansion punya fiber optic — untuk streaming feed ke penonton. Aku bisa hijack koneksi itu."</p>`;
    } else {
      text += `<p>Tanpa Kira, opsi terbatas. Tapi server mansion memiliki koneksi internet untuk streaming feed ke "Dewan Penenun" — koneksi yang bisa di-hijack.</p>`;
    }

    text += `<p>Rencana: upload semua bukti ke multiple cloud services, kirim ke media besar, police tip lines, dan podcast Arin sendiri — sebelum Ragil bisa memotong koneksi.</p>`;
    text += `<p>"Kalau ini berhasil," kata Lana, "tidak ada coverup yang bisa menghapus. Terlalu banyak salinan di terlalu banyak tempat."</p>`;
    text += `<p>"Dan kalau gagal?"</p>`;
    text += `<p>"Kita masih punya rencana B. Api."</p>`;

    return text;
  },
  choices: [
    {
      text: "Eksekusi broadcast — upload semuanya",
      next: 'ch6_broadcast_execute',
      effect: (s) => {
        s.flags.broadcastExecuting = true;
        Engine.modDanger(15);
      }
    }
  ]
},

'ch6_broadcast_execute': {
  text: (s) => {
    let text = `<p>Ruang server B-2. Workstation Ragil.</p>`;

    if (s.alive.kira) {
      text += `<p>Kira mengetik dengan kecepatan yang seharusnya tidak mungkin dalam kondisi terluka dan kelelahan. Adrenalin dan purpose — campuran yang lebih kuat dari kafein manapun.</p>`;
    }

    text += `<p>Upload dimulai. Progress bar bergerak — terlalu lambat untuk kondisi ini.</p>`;
    text += `<p>10%... 25%... 40%...</p>`;
    text += `<p>Alarm baru. Ragil mendeteksi upload dari B-3.</p>`;
    text += `<p>Speaker: <em>"Upload tidak diotorisasi terdeteksi. Counter-measure aktif dalam 60 detik."</em></p>`;
    text += `<p>55%... 70%...</p>`;
    text += `<p>Counter-measure: seluruh sistem akan di-wipe. Ragil lebih rela menghancurkan bukti daripada membiarkannya keluar.</p>`;
    text += `<p>85%... 90%...</p>`;
    text += `<p>Layar berkedip. Sistem mulai shutdown sequence.</p>`;
    text += `<p>95%... 97%... 99%...</p>`;
    text += `<p>COMPLETE. Satu detik sebelum wipe.</p>`;
    text += `<p>Data sudah di cloud. Di email. Di server yang tersebar di empat benua. Tidak bisa dihapus.</p>`;

    return text;
  },
  shake: true,
  glitch: true,
  choices: [
    {
      text: "Data aman. Sekarang — menghadapi fajar.",
      next: 'ch7_start',
      effect: (s) => {
        s.flags.broadcastSuccess = true;
        s.items.push('broadcast_complete');
        s.keyChoices.push('broadcast_success');
        s.moralScore += 15;
      }
    }
  ]
}

};
