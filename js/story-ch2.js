/* ============================================================
   SIMPUL TERAKHIR — BAB 2: Retakan
   Konflik. Kebenaran mulai terungkap. Kelompok pecah.
   ============================================================ */

const STORY_CH2 = {

'ch2_search': {
  chapter: 2,
  text: `<p>Kalian berempat keluar ke clearing di depan cabin. Bulan menerangi hutan dengan cahaya perak yang dingin.</p>
<p><span class="speaker niko">Niko</span> mengambil senter dari ranselnya. Tangannya gemetar — pertama kalinya kau melihat Niko gemetar.</p>
<p>"Kita tidak boleh berpencar."</p>
<p><span class="speaker sera">Sera</span> memeluk dirinya sendiri, air mata masih mengalir. "Aku sudah bilang. Aku <em>sudah bilang</em> dia bukan Vira—"</p>
<p><span class="speaker juno">Juno</span> memotong tajam.</p>
<p>"Sera, CUKUP. Ini bukan waktunya 'aku sudah bilang'!"</p>
<p>Sera mundur seolah ditampar. Juno langsung menyesal, tapi tidak minta maaf. Ketakutannya terlalu besar.</p>
<p>Dari kedalaman hutan, kau melihatnya — cahaya hijau redup yang berdenyut di antara pepohonan. Bergerak. Mendekati.</p>
<p>Lalu suara Vira — atau sesuatu yang memakai suaranya — bergema di antara pohon-pohon:</p>
<p class="journal"><em>"Jangan takut. Aku hanya menyiapkan sesuatu untuk kalian. Kembalilah ke dalam. Biarkan malam ini lewat."</em></p>`,
  choices: [
    {
      text: "Ikuti cahaya hijau ke dalam hutan",
      danger: true,
      next: 'ch2_follow_light',
      effect: (s) => {
        s.courage.arin += 15;
        s.flags.followedLight = true;
        Engine.modEntity(10);
      }
    },
    {
      text: "Mundur ke cabin. Kunci semua pintu.",
      next: 'ch2_barricade',
      effect: (s) => {
        s.flags.barricaded = true;
      }
    },
    {
      text: '"Niko, keluarkan batu itu. Mungkin itu yang dia mau."',
      next: 'ch2_offer_stone',
      effect: (s) => {
        s.flags.offeredStone = true;
        s.keyChoices.push('offered_stone');
      }
    }
  ]
},

'ch2_follow_light': {
  text: `<p>"Tunggu di sini," katamu pada yang lain.</p>
<p><span class="speaker sera">Sera</span> mencengkeram tanganmu. "Tidak. Aku ikut."</p>
<p><span class="speaker niko">Niko</span> mengangguk tegas. "Kita semua ikut."</p>
<p>Kalian berempat memasuki hutan, mengikuti cahaya hijau yang bergerak seperti kunang-kunang raksasa.</p>
<p>Cahaya itu membawa kalian ke clearing yang kau kenal — pohon tua berdiri di tengahnya. Tapi sekarang, di bawah cahaya bulan, pohon itu terlihat <em>berbeda</em>. Akar-akarnya telah bergerak — membuka celah yang lebih besar di tanah. Dan dari celah itu, cahaya hijau mengalir seperti air.</p>
<p>Vira — atau entitas dalam wujud Vira — berdiri di depan pohon. Tapi sekarang dia tidak menyembunyikan apapun. Wujudnya transparan di beberapa bagian. Mata bercahaya hijau. Rambut bergerak meski tidak ada angin.</p>
<p>"Kalian datang." Ada kelegaan dalam suaranya. "Bagus. Karena waktunya hampir habis."</p>
<p>Dia menunjuk ke celah di tanah. Di dalamnya, kau bisa melihat Vira — Vira yang asli — masih tertidur, tapi wajahnya sekarang mengernyit. Tidak damai lagi. Bermimpi buruk.</p>
<p>"Simpul semakin lemah. Kalau putus sebelum kalian mengembalikan apa yang dicuri... Vira dan aku — kami berdua mati."</p>`,
  choices: [
    {
      text: '"Apa yang harus kami lakukan?"',
      next: 'ch2_entity_explains',
      effect: (s) => {
        s.flags.askedEntityPlan = true;
      }
    },
    {
      text: '"Buktikan bahwa kami bisa percaya padamu."',
      next: 'ch2_entity_test',
      effect: (s) => {
        s.flags.testedEntity = true;
        s.moralScore += 5;
      }
    }
  ]
},

'ch2_entity_explains': {
  text: `<div class="scene-art scene-entity"></div>
<p>Entitas mengangguk.</p>
<p>"Batu yang diambil kakek Niko adalah <em>Inti Simpul</em> — jantung perjanjian antara hutan dan manusia. Tanpanya, simpul yang mengikat dua dunia semakin rapuh."</p>
<p>"Untuk mengembalikannya, tidak cukup hanya meletakkan batu di tempatnya. Lima jiwa yang terikat harus <em>bersama-sama</em> menaruhnya kembali. Dan mereka harus melakukannya dengan ikatan yang tulus — bukan karena takut, bukan karena terpaksa."</p>
<p>"Masalahnya..." entitas melirik ke arah Niko, "...tidak semua dari kalian datang dengan niat yang murni."</p>
<p><span class="speaker niko">Niko</span> mengeras. "Apa maksudmu?"</p>
<p>"Kau tahu persis apa maksudku, Niko. Kau tidak ke sini hanya untuk mengembalikan batu kakekmu. Kau ingin <em>menggunakannya</em>. Kau membaca jurnal kakekmu — kau tahu batu ini memberikan kekuatan pada yang memegangnya."</p>
<p>Keheningan yang menyusul terasa seperti es yang retak.</p>
<p><span class="speaker sera">Sera</span> menatap Niko. "Niko... itu benar?"</p>
<p>Niko tidak menjawab. Rahangnya terkunci.</p>`,
  choices: [
    {
      text: '"Niko, jawab. Jujur. Sekali ini saja."',
      next: 'ch2_niko_truth',
      effect: (s) => {
        s.flags.demandedNikoTruth = true;
        s.keyChoices.push('demanded_niko_truth');
      }
    },
    {
      text: "Lindungi Niko. Dia temanmu apapun motifnya.",
      next: 'ch2_defend_niko',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 10);
        s.flags.defendedNiko = true;
      }
    },
    {
      text: '"Entitas, ceritakan tentang lima jiwa pertama. Tahun 1973."',
      hint: "Kau tahu lebih dari yang mereka kira.",
      next: 'ch2_ask_1973',
      condition: (s) => s.flags.hasMedal || s.flags.asked1973 || s.flags.hasOldPhoto,
      effect: (s) => {
        Engine.modAwareness('arin', 15);
        s.flags.asked1973entity = true;
        s.keyChoices.push('asked_1973');
      }
    },
    {
      text: '"Sera, apa yang kau rasakan sekarang? Kau yang paling sensitif."',
      next: 'ch2_sera_sense',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 8);
        s.flags.askedSeraSense = true;
      }
    }
  ]
},

'ch2_ask_1973': {
  text: `<p>Entitas berhenti. Matanya yang bercahaya hijau meredup — tanda emosi yang tidak bisa disembunyikan.</p>
<p>"Kau tahu tentang 1973."</p>
<p>"Aku tahu kakek Niko datang bersama empat orang lain. Dan hanya dia yang kembali."</p>
<p>Entitas terdiam sangat lama. Pohon-pohon di sekeliling clearing berhenti bergerak.</p>
<p>"Lima tentara datang menyelidiki hutan yang 'berjalan'. Mereka menemukan altar. Menemukan Inti Simpul. Pemimpin mereka — kakek Niko — melihat kekuatan di dalam batu itu. Kekuatan untuk mengendalikan."</p>
<p>"Yang lain menolak mengambilnya. Mereka mengerti bahwa batu itu <em>milik</em> hutan. Tapi pemimpin mereka mengambilnya paksa."</p>
<p>"Dan simpul yang melindungi hutan — dan manusia di sekitarnya — mulai retak. Untuk menambalnya sementara, aku..." suaranya retak, "...aku terpaksa mengambil empat jiwa itu sebagai pengganti."</p>
<p>"Bukan membunuh. <em>Menyerap</em>. Mereka menjadi bagian dari simpul. Bagian dariku."</p>
<p>Sera menutup mulutnya. Juno mundur.</p>
<p>"Mereka tidak menderita. Mereka bermimpi. Mimpi yang indah dan tanpa akhir."</p>
<p>"Seperti Vira," bisikmu.</p>
<p>"...ya. Seperti Vira."</p>`,
  choices: [
    {
      text: '"Apakah empat tentara itu masih bisa dibebaskan?"',
      next: 'ch2_can_free_all',
      effect: (s) => {
        s.flags.askedFreeAll = true;
        s.moralScore += 10;
        s.keyChoices.push('asked_free_all');
      }
    },
    {
      text: '"Ini tidak bisa terus terjadi. Siklus ini harus berhenti."',
      next: 'ch2_pragmatic',
      effect: (s) => {
        s.flags.demandedEndCycle = true;
        s.moralScore += 15;
      }
    }
  ]
},

'ch2_can_free_all': {
  text: `<p>Entitas menatapmu dengan sesuatu yang mirip keheranan.</p>
<p>"Kau bertanya tentang mereka? Empat jiwa yang sudah terlupakan selama lima puluh tahun?"</p>
<p>"Mereka juga manusia."</p>
<p>Keheningan. Lalu, pelan-pelan, senyum. Bukan senyum Vira — senyum entitas sendiri. Tulus. Kaget. Berterima kasih.</p>
<p>"Kalau simpul dipulihkan dengan sempurna... ya. Mereka bisa dibebaskan. Semuanya. Vira. Empat jiwa lama. Semuanya."</p>
<p>"Tapi itu membutuhkan lima ikatan yang <em>murni</em>. Tidak setitik pun kebohongan. Tidak sebutir pun keraguan. Ikatan seperti itu..." entitas menatap kalian satu per satu, "...apakah mungkin dari kalian yang begitu penuh rahasia?"</p>`,
  choices: [
    {
      text: '"Kita mulai sekarang. Keluarkan semua rahasia."',
      next: 'ch2_niko_truth',
      effect: (s) => {
        s.flags.fullPurge = true;
        s.moralScore += 15;
        s.keyChoices.push('full_purge');
      }
    },
    {
      text: '"Kami butuh waktu. Sampai fajar."',
      next: 'ch2_pragmatic',
      effect: (s) => {
        s.flags.neededTime = true;
      }
    }
  ]
},

'ch2_sera_sense': {
  text: `<p>Sera menutup matanya. Tangannya menyentuh tanah. Tubuhnya bergetar.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Aku... aku bisa merasakan sesuatu. Sejak kita masuk ke hutan ini, ada suara di belakang telingaku. Seperti detak jantung yang bukan milikku."</p>
<p>Matanya terbuka. Basah.</p>
<p>"Dan sekarang — di dekat pohon ini — aku bisa <em>mendengar</em> sesuatu. Bukan kata. Tapi... perasaan. Kesepian yang begitu dalam sampai rasanya seperti tenggelam."</p>
<p>Entitas menatap Sera dengan ekspresi terkejut.</p>
<p>"Kau bisa mendengarku?" bisiknya. "Tanpa jembatan? Tanpa kontak?"</p>
<p>"Sera memiliki kepekaan yang langka," katanya padamu. "Dia bisa merasakan simpul secara langsung. Ini bisa memperkuat ritual — atau menghancurkannya, kalau dia tidak siap."</p>`,
  choices: [
    {
      text: '"Sera, apakah kau baik-baik saja? Kita bisa mundur."',
      next: 'ch2_pragmatic',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', 10);
        s.flags.seraSensitive = true;
        s.moralScore += 5;
      }
    },
    {
      text: '"Sera, bisa kau merasakan Vira? Vira yang asli?"',
      next: 'ch2_sera_feels_vira',
      effect: (s) => {
        s.flags.seraFeelsVira = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch2_sera_feels_vira': {
  text: `<p>Sera menekan kedua tangannya ke tanah lebih dalam. Tubuhnya bergetar hebat.</p>
<p>"Dia... dia ada di sana. Dalam. Seperti di dasar kolam yang sangat gelap."</p>
<p>Air mata mengalir. "Dia bermimpi. Mimpi tentang kita — tentang SMA, tentang es krim setelah ujian, tentang malam-malam di atap rumahku lihat bintang."</p>
<p>"Vira..." bisik Sera ke tanah, "Vira, aku di sini. Kami datang untukmu."</p>
<p>Dari bawah tanah — atau mungkin dari dalam simpul itu sendiri — suara lembut membalas. Samar. Rapuh. Tapi <em>nyata</em>.</p>
<p>"Se...ra...?"</p>
<p>Sera menangis. Semua orang menangis. Bahkan entitas.</p>
<p>"Dia masih mengenali suaramu," bisik entitas. "Ikatan kalian... bahkan aku tidak bisa menandingi kekuatannya."</p>`,
  choices: [
    {
      text: '"Kita selamatkan dia. Sekarang."',
      next: 'ch2_pragmatic',
      effect: (s) => {
        s.flags.viraHeard = true;
        s.moralScore += 20;
        Engine.modTrust('arin', 'sera', 15);
        s.keyChoices.push('vira_heard');
      }
    }
  ]
},

'ch2_niko_truth': {
  text: `<p>Niko mengepalkan tangannya. Rahangnya bergetar.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Ya." Suaranya pecah. "Ya, oke? Aku membaca jurnal kakek. Batu itu — Inti Simpul — memberikan kekuatan pada pemegangnya. Kemampuan untuk... <em>mengikat</em> orang. Membuat mereka percaya padamu. Mengikutimu."</p>
<p>"Kalian pikir kenapa aku selalu jadi pemimpin? Kenapa kalian selalu setuju denganku? Kakek memegangnya selama lima puluh tahun. Pengaruhnya menetes ke keluarga kami."</p>
<p>Sera mundur. Juno membatu.</p>
<p>"Aku lelah." Niko merosot ke tanah. "Aku lelah menjadi orang yang harus selalu kuat. Yang harus selalu benar. Batu itu menjanjikan bahwa aku tidak perlu takut lagi. Bahwa semua orang akan selalu—"</p>
<p>Dia berhenti. Air mata mengalir di pipinya.</p>
<p>"—akan selalu <em>tinggal</em>. Tidak akan pergi. Tidak akan meninggalkanku seperti orangtuaku."</p>
<p>Entitas menatapnya dengan sesuatu yang mirip kasihan.</p>
<p>"Keegoisanmu lahir dari ketakutan, Niko. Tapi itu tidak membuatnya kurang egois."</p>`,
  choices: [
    {
      text: "Peluk Niko. Dia butuh teman, bukan hakim.",
      next: 'ch2_comfort_niko',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', 20);
        s.moralScore += 20;
        s.flags.comfortedNiko = true;
        s.keyChoices.push('comforted_niko');
      }
    },
    {
      text: '"Kau memanipulasi kami semua. Sejak awal."',
      next: 'ch2_reject_niko',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -20);
        s.flags.rejectedNiko = true;
        s.moralScore -= 5;
        s.keyChoices.push('rejected_niko');
      }
    },
    {
      text: '"Itu menjelaskan banyak hal. Tapi sekarang kita punya masalah yang lebih besar."',
      next: 'ch2_pragmatic',
      effect: (s) => {
        s.flags.pragmaticChoice = true;
        s.keyChoices.push('pragmatic');
      }
    }
  ]
},

'ch2_comfort_niko': {
  text: `<p>Kau berlutut dan memeluknya. Niko membeku — lalu tangan-tangannya meremas jaketmu dan dia menangis. Menangis seperti anak kecil yang akhirnya diizinkan untuk tidak kuat.</p>
<p>Sera pelan-pelan duduk di sebelahnya. Menyentuh bahunya.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Aku marah padamu. Sangat marah." Air matanya mengalir. "Tapi aku juga masih peduli. Dan aku benci bahwa dua hal itu bisa ada bersamaan."</p>
<p>Juno berdiri di luar lingkaran, menggigit bibirnya. Lalu — perlahan — dia juga duduk.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Niko, kau bajingan. Tapi kau bajingan <em>kami</em>."</p>
<p>Entitas mengamati. Cahaya hijaunya berpendar lebih hangat.</p>
<p>"Ini. Ini yang aku butuhkan. Bukan batu. Bukan ritual. <em>Ini</em>. Ikatan yang tulus, bahkan setelah mengetahui yang terburuk dari satu sama lain."</p>
<p>"Tapi masih ada satu kebenaran lagi yang harus terungkap sebelum simpul bisa diikat."</p>
<p>Entitas menatap Juno.</p>
<p>"Giliran mu, Juno."</p>`,
  choices: [
    {
      text: "Tatap Juno dengan dorongan. Saatnya dia jujur.",
      next: 'ch2_juno_confession',
      effect: (s) => {
        s.flags.encouragedJuno = true;
      }
    },
    {
      text: '"Cukup. Jangan paksa siapa pun."',
      next: 'ch2_protect_juno',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 10);
        s.flags.protectedJuno = true;
      }
    }
  ]
},

'ch2_reject_niko': {
  text: `<p>Kata-katamu menghantam Niko seperti pukulan. Dia berdiri, matanya memerah.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kau pikir kau lebih baik dariku, Arin? Kau — yang selalu berdiri di tengah, tidak pernah mengambil keputusan, tidak pernah berani — kau mau menghakimiku?"</p>
<p>"Aku <em>melindungi</em> kalian! Aku yang selalu memastikan kelompok ini tidak berantakan! Dan sekarang kau—"</p>
<p><span class="speaker sera">Sera</span></p>
<p>"HENTIKAN! Kalian berdua!"</p>
<p>Tapi kerusakan sudah terjadi. Retakan yang selama ini tersembunyi di bawah permukaan akhirnya terbuka lebar.</p>
<p>Niko mundur ke arah hutan. "Kalau kalian tidak butuh aku, bagus. Aku selesaikan ini sendiri."</p>
<p>Dia berlari ke dalam kegelapan, membawa batu kakeknya.</p>
<p>Entitas menatap kalian dengan ekspresi yang mustahil dibaca.</p>
<p>"Dia akan mencoba menggunakan Inti Simpul sendirian. Dan itu... akan menghancurkannya."</p>`,
  shake: true,
  choices: [
    {
      text: "Kejar Niko. Dia masih temanmu.",
      next: 'ch2_chase_niko',
      effect: (s) => {
        s.flags.chasedNiko = true;
        s.courage.arin += 10;
        s.keyChoices.push('chased_niko');
      }
    },
    {
      text: "Biarkan dia pergi. Dia membuat pilihannya.",
      next: 'ch2_let_niko_go',
      effect: (s) => {
        s.flags.letNikoGo = true;
        s.moralScore -= 10;
        s.keyChoices.push('let_niko_go');
      }
    }
  ]
},

'ch2_pragmatic': {
  text: `<p>Niko menyeka matanya kasar dan mengangguk.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kau benar. Kita urus ini dulu."</p>
<p>Entitas mengangguk. "Untuk mengikat simpul baru, kalian harus melakukan ritual di pohon ini saat fajar. Taruh batu kembali di tempatnya. Lima tangan. Lima ikatan."</p>
<p>"Tapi ada syaratnya. Setiap orang harus mengungkapkan kebenaran yang mereka sembunyikan. Simpul tidak bisa diikat dengan kebohongan."</p>
<p>Juno memucat. Sera merapatkan jaketnya. Niko mengangguk perlahan.</p>
<p>"Kembalilah ke cabin. Istirahat. Fajar tinggal beberapa jam."</p>
<p>Saat kalian berjalan kembali, entitas berbisik — hanya untuk telingamu:</p>
<p class="journal"><em>"Arin. Ada satu lagi yang harus kau tahu. Salah satu dari teman-temanmu menyimpan kebenaran yang bisa menghancurkan segalanya. Bersiaplah."</em></p>`,
  choices: [
    {
      text: "Kembali ke cabin dan persiapkan fajar",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.preparedForDawn = true;
      }
    }
  ]
},

'ch2_defend_niko': {
  text: `<p>"Hentikan," katamu pada entitas. "Kau tidak punya hak menghakimi dia."</p>
<p>Entitas menatapmu. "Aku tidak menghakimi. Aku menyatakan fakta. Simpul membutuhkan kejujuran."</p>
<p><span class="speaker niko">Niko</span> berdiri lebih tegak, tapi matanya masih menghindari yang lain.</p>
<p>"Arin benar. Motifku tidak relevan sekarang. Yang penting — apa yang harus kita lakukan?"</p>
<p>Entitas memiringkan kepalanya.</p>
<p>"Baiklah. Tapi ingat: simpul yang diikat dengan kebohongan tidak akan bertahan. Dan simpul yang rapuh..." cahaya hijaunya berkedip, "...lebih buruk dari tidak ada simpul sama sekali."</p>`,
  choices: [
    {
      text: '"Jelaskan apa yang harus kami lakukan."',
      next: 'ch2_pragmatic',
      effect: (s) => { s.flags.askedPlan = true; }
    }
  ]
},

'ch2_sera_reveals': {
  chapter: 2,
  text: (s) => {
    let intro = `<p><span class="speaker sera">Sera</span> menarik napas dalam. Tangannya berhenti gemetar — seolah keputusan untuk akhirnya bicara memberikannya ketenangan yang aneh.</p>`;

    if (s.flags.seraPartner) {
      intro += `<p>"Arin sudah tahu sebagian. Tapi aku perlu ceritakan semuanya."</p>`;
    }

    return `${intro}
<p>"Sejak Vira kembali dari Halimun, aku tahu ada yang salah. Bukan intuisi. Bukan perasaan. Aku <em>tahu</em>."</p>
<p>"Karena malam sebelum Vira pergi ke Halimun, dia meneleponku. Pukul tiga pagi. Menangis."</p>
<p>"Dia bilang..." Sera memejamkan mata, mengingat. "Dia bilang ada sesuatu yang <em>memanggilnya</em>. Dari hutan. Sudah berminggu-minggu. Suara yang tidak bisa dia jelaskan. Dan dia tidak bisa menolak lagi."</p>
<p>"Aku mencoba menghentikannya. Mengatakan jangan pergi sendirian. Tapi Vira... Vira bilang itu bukan pilihan. Itu <em>panggilan</em>. Seperti ada tali yang menariknya."</p>
<p>"Dan ketika dia kembali — tersenyum, tenang, seolah tiga minggu di hutan tidak pernah terjadi — aku tahu orang yang kembali bukan Vira."</p>
<p>Sera menatap Niko. "Aku bilang padamu, Niko. Aku bilang ada yang salah. Dan kau bilang aku 'terlalu sensitif'. Kau bilang aku 'drama queen'."</p>
<p>Niko memucat. "Sera, aku tidak—"</p>
<p>"Kau tahu. <em>Kau tahu</em> karena kakekmu memberitahumu tentang batu itu. Dan kau tetap membawa kami ke sini."</p>
<p>Keheningan yang mengikuti bisa membekukan api.</p>`;
  },
  choices: [
    {
      text: '"Niko, apakah itu benar?"',
      next: 'ch2_niko_cornered',
      effect: (s) => {
        s.flags.nikoCornered = true;
        Engine.modTrust('arin', 'niko', -10);
        s.keyChoices.push('niko_cornered');
      }
    },
    {
      text: '"Sekarang bukan saatnya saling menyalahkan. Vira di luar sana."',
      next: 'ch2_search',
      effect: (s) => {
        s.flags.unitedDespiteTruth = true;
        s.moralScore += 10;
      }
    }
  ]
},

'ch2_niko_cornered': {
  text: `<p>Niko berdiri di sudut ruangan. Sera di depannya. Juno di samping. Kau di tengah.</p>
<p>Dan untuk pertama kalinya sejak kalian saling mengenal, Niko terlihat <em>kecil</em>. Bukan leader. Bukan otak kelompok. Hanya seseorang yang ketakutan dan tersudut.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Ya." Suaranya serak. "Ya, aku tahu. Kakek meninggalkan surat wasiat. Di dalamnya ada batu — dan instruksi untuk mengembalikannya ke hutan dekat tempat kakek membangun cabin."</p>
<p>"Tapi dia juga menulis bahwa batu itu <em>memberikan kekuatan</em> pada yang memegangnya. Dan aku..." suaranya pecah, "...aku ingin kekuatan itu, Arin. Aku membawa kalian ke sini bukan untuk mengembalikan batu. Aku membawa kalian karena menurut jurnal kakek, ritual membutuhkan lima orang."</p>
<p>"Aku mau menggunakan kalian. Teman-temanku sendiri."</p>
<p>Juno memukul dinding. "BAJINGAN!"</p>
<p>Sera menangis tanpa suara.</p>
<p>Niko jatuh berlutut. "Maafkan aku. Maafkan aku. Aku tidak tahu akan jadi seperti ini. Aku pikir—"</p>
<p>"Kau pikir apa, Niko? Kau pikir kau bisa menggunakan kami dan tidak ada konsekuensi?"</p>`,
  shake: true,
  choices: [
    {
      text: '"Kita urus Niko nanti. Sekarang, kita cari Vira."',
      next: 'ch2_search',
      effect: (s) => {
        s.flags.postponedNikoJudgment = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Pukul Niko. Dia pantas mendapatkannya.",
      next: 'ch2_search',
      effect: (s) => {
        Engine.modTrust('arin', 'niko', -20);
        s.flags.punchedNiko = true;
        s.moralScore -= 5;
        s.keyChoices.push('punched_niko');
      }
    },
    {
      text: '"Berikan batu itu padaku. Sekarang."',
      next: 'ch2_take_stone',
      effect: (s) => {
        s.flags.tookStone = true;
        s.flags.arinHasStone = true;
        s.keyChoices.push('took_stone');
      }
    }
  ]
},

'ch2_take_stone': {
  text: `<p>Niko merogoh ranselnya dengan tangan gemetar dan mengeluarkan kotak berukir. Membukanya. Batu di dalamnya berdenyut hijau — seperti jantung yang berdebar.</p>
<p>Kau mengambilnya. Berat. Hangat. Dan saat kulitmu menyentuh permukaannya, kau merasakan sesuatu — seperti tangan yang meraih dari dalam batu. Bukan mengancam. <em>Memohon</em>.</p>
<p>Bisikan: <em>"Kembalikan aku."</em></p>
<p><span class="speaker sera">Sera</span> menatap batu itu. "Arin, aku bisa merasakannya. Batu itu... <em>hidup</em>."</p>
<p>Kau memasukkan batu ke sakumu. Tanggung jawabnya sekarang ada di tanganmu.</p>
<p>Dari luar cabin, suara-suara hutan berubah. Seolah hutan tahu batu itu berpindah tangan.</p>`,
  choices: [
    {
      text: '"Keluar. Cari Vira. Batu ini aman bersamaku."',
      next: 'ch2_search',
      effect: (s) => {
        s.flags.arinProtectsStone = true;
        s.courage.arin += 10;
      }
    }
  ]
},

'ch2_barricade': {
  text: `<p>Kalian berlari ke dalam cabin dan mengunci semua pintu. Niko mendorong meja ke depan pintu utama. Juno menutup jendela.</p>
<p>Dari luar, suara-suara mulai datang. Bukan suara binatang. Suara seperti... <em>ketukan</em>. Di setiap jendela. Satu per satu.</p>
<p>Tok. Tok. Tok.</p>
<p>Lalu suara Vira, dari semua arah sekaligus:</p>
<p class="journal"><em>"Kalian tidak bisa bersembunyi dari sesuatu yang sudah ada di dalam."</em></p>
<p>Lampu senter Niko berkedip dan mati. Kegelapan total.</p>
<p>Dalam kegelapan, kau merasakan tangan seseorang menyentuh bahumu. Dingin. Jari-jari panjang.</p>
<p>Lalu cahaya — perapian menyala sendiri. Dan Vira berdiri di tengah ruangan, tidak ada pintu atau jendela yang terbuka. Tersenyum.</p>
<p>"Aku bilang. Aku sudah ada di dalam." Matanya bercahaya hijau. "Aku ada di setiap papan kayu. Setiap paku. Setiap debu. Cabin ini dibangun di atas <em>tubuhku</em>."</p>`,
  shake: true,
  choices: [
    {
      text: '"Apa maumu?"',
      next: 'ch2_entity_explains',
      effect: (s) => {
        Engine.modEntity(10);
        s.flags.entityInCabin = true;
      }
    },
    {
      text: "Lari keluar. Ke hutan. Kemana saja.",
      danger: true,
      next: 'ch2_panic_run',
      effect: (s) => {
        s.flags.panicRun = true;
        Engine.modEntity(15);
        s.keyChoices.push('panic_run');
      }
    }
  ]
},

'ch2_panic_run': {
  text: (s) => {
    let death = '';
    if (s.difficulty >= 2 && Engine.canDie()) {
      death = `<p>Juno berlari ke arah berbeda. Dalam gelap, kau mendengar teriakannya — lalu bunyi tubuh jatuh — lalu keheningan.</p>
<p class="sound">— Juno tidak menjawab lagi —</p>`;
      Engine.killChar('juno');
    } else {
      death = `<p>Juno tersandung akar dan jatuh. Sera membantunya berdiri. Mereka berlari bersama.</p>`;
    }

    return `<p>Kau menerobos pintu belakang. Yang lain mengikuti — Sera, Juno, Niko — semua berlari ke kegelapan hutan.</p>
<p>Pohon-pohon bergerak di sekelilingmu. Akar-akar menjulur dari tanah seperti tentakel. Cabang-cabang meraih rambutmu, jaketmu, kulitmu.</p>
${death}
<p>Kau berlari sampai paru-parumu terbakar. Sampai akhirnya — hutan terbuka. Clearing. Pohon tua itu. Tempat yang sama.</p>
<p>Hutan membawa kalian <em>kembali</em>. Selalu kembali ke sini.</p>
<p>Entitas berdiri di depan pohon. Senyumnya hilang. Yang tersisa adalah kelelahan yang sangat manusiawi.</p>
<p>"Kalian tidak bisa lari. Sejak kalian memasuki hutan ini, kalian sudah menjadi bagian dari simpulnya. Satu-satunya jalan keluar... adalah <em>melaluinya</em>."</p>`;
  },
  blood: true,
  shake: true,
  choices: [
    {
      text: '"Jelaskan. Sekarang. Tidak ada lagi permainan."',
      next: 'ch2_entity_explains',
      effect: (s) => {
        s.flags.demandedExplanation = true;
      }
    }
  ]
},

'ch2_offer_stone': {
  text: `<p>"Niko, batu itu — keluarkan."</p>
<p><span class="speaker niko">Niko</span> menatapmu. Terbelah antara keengganan dan ketakutan.</p>
<p>"Arin, aku tidak yakin—"</p>
<p>"Niko. <em>Sekarang.</em>"</p>
<p>Niko merogoh ranselnya dan mengeluarkan kotak berukir. Batu di dalamnya berdenyut lebih kuat sekarang — cahaya hijaunya menerangi wajah-wajah kalian.</p>
<p>Dari hutan, Vira — entitas — melangkah keluar bayangan. Matanya terpaku pada batu itu.</p>
<p>"Inti Simpul..." suaranya tercekat. Untuk pertama kalinya, terdengar rentan. "Setengah abad. Setengah abad aku kehilangan jantungku."</p>
<p>Dia mengulurkan tangan. Tangan yang transparan, berpendar hijau.</p>
<p>"Berikan. Dan aku akan membebaskan Vira-mu. Mengembalikan hutan. Memutus simpul yang mengikat kalian."</p>
<p><span class="speaker sera">Sera</span> berbisik.</p>
<p>"Bagaimana kalau itu jebakan?"</p>`,
  choices: [
    {
      text: "Berikan batu itu pada entitas",
      next: 'ch2_give_stone',
      effect: (s) => {
        s.flags.gaveStone = true;
        s.keyChoices.push('gave_stone');
      }
    },
    {
      text: '"Tidak. Kita lakukan ini bersama atau tidak sama sekali."',
      next: 'ch2_entity_explains',
      effect: (s) => {
        s.flags.demandedTogether = true;
        s.moralScore += 10;
      }
    }
  ]
},

'ch2_give_stone': {
  text: (s) => {
    if (s.difficulty >= 3) {
      return `<p>Niko menyerahkan batu itu. Entitas menerimanya — dan tersenyum. Bukan senyum Vira. Senyum yang <em>lapar</em>.</p>
<p>"Bodoh."</p>
<p>Cahaya hijau meledak. Tanah bergetar. Pohon-pohon berteriak — suara kayu yang retak dan terbanting.</p>
<p>Entitas menyerap kekuatan batu itu. Wujudnya berubah — lebih besar, lebih gelap, lebih <em>salah</em>.</p>
<p>"Kalian pikir aku menjaga Vira karena baik hati? Aku <em>memakannya</em>. Perlahan. Sedikit demi sedikit. Dan sekarang, dengan Inti Simpul kembali..."</p>
<p>Matanya menyapu kalian.</p>
<p>"...aku bisa makan empat lagi."</p>
<p class="narration">Di difficulty sulit, kepercayaan buta memiliki harga yang mengerikan.</p>`;
    }

    return `<p>Niko menyerahkan batu itu. Entitas menerimanya — dan cahaya hijau meluap lembut. Bukan ledakan. Bukan kekerasan. Seperti napas panjang setelah menahan selama berpuluh tahun.</p>
<p>"Terima kasih." Suaranya bergetar. Air mata — air mata dari cahaya — mengalir di wajah transparannya.</p>
<p>"Tapi ini belum cukup. Inti harus dikembalikan ke tempatnya. Di jantung pohon. Dan itu membutuhkan kalian — kalian berempat — bersama aku."</p>
<p>"Saat fajar. Di pohon ini. Taruh tangan kalian di kulit kayu dan biarkan ikatan kalian mengalir. Simpul baru akan terbentuk."</p>
<p>"Dan Vira-mu akan bangun."</p>`;
  },
  choices: [
    {
      text: (s) => s.difficulty >= 3 ? '"LARI!"' : '"Kami akan melakukannya."',
      next: (s) => s.difficulty >= 3 ? 'ch3_entity_attack' : 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        if (s.difficulty >= 3) {
          s.flags.entityBetrayed = true;
          s.keyChoices.push('entity_betrayed');
        } else {
          s.flags.entityTrustful = true;
        }
      }
    }
  ]
},

'ch2_wait_morning': {
  chapter: 2,
  text: `<p>Tidak ada yang tidur. Kalian duduk di ruang tamu, menempel satu sama lain seperti anak-anak yang takut gelap.</p>
<p>Sera menangis tanpa suara. Juno memegang pisau dapur dengan tangan gemetar. Niko duduk di sudut, memeluk ranselnya yang berisi kotak kakeknya.</p>
<p>Jam demi jam berlalu. Cabin berderit. Lantai berdenyut. Dari bawah, denyut itu makin kuat — seperti jantung yang berdetak semakin cepat.</p>
<p>Jam lima pagi. Cahaya pertama muncul di jendela timur.</p>
<p>Dan bersamaan dengan itu, pintu kamar Sera-Vira di lantai atas terbuka. Langkah kaki turun tangga. Vira muncul — tersenyum, rambut rapi, seolah baru bangun dari tidur yang nyenyak.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Pagi, semua! Tidur nyenyak?" Dia melihat wajah-wajah kalian. "Kenapa kalian terlihat seperti tidak tidur semalaman?"</p>
<p>Seolah tidak terjadi apa-apa. Seolah tulisan tanah di dinding tidak pernah ada. Kau memeriksa — memang sudah tidak ada. Dinding bersih.</p>`,
  choices: [
    {
      text: '"Kita perlu bicara. Semua. Sekarang."',
      next: 'ch2_morning_confrontation',
      effect: (s) => {
        s.flags.morningConfrontation = true;
        s.keyChoices.push('morning_confrontation');
      }
    },
    {
      text: "Ikuti permainannya. Amati. Tunggu momen yang tepat.",
      next: 'ch2_play_along',
      effect: (s) => {
        s.flags.playedAlong = true;
        Engine.modAwareness('arin', 10);
      }
    }
  ]
},

'ch2_morning_confrontation': {
  text: `<p>"Duduk," katamu. Suaramu lebih tegas dari yang kau harapkan. "Semua. Termasuk kamu, Vira."</p>
<p>Mereka duduk. Vira memiringkan kepalanya — gerakan khas entitas — lalu tersenyum dan duduk juga.</p>
<p>Kau berdiri di tengah mereka dan mulai bicara.</p>
<p>"Niko, ceritakan tentang kakekmu dan batu dari hutan."</p>
<p>Niko melirikmu, menghela napas, dan mulai bercerita. Tentang surat wasiat, tentang Inti Simpul, tentang mengapa dia membawa mereka ke sini.</p>
<p>"Juno. Ceritakan apa yang terjadi di Halimun."</p>
<p>Juno memucat, tapi dia mulai bicara. Tentang nyanyian. Tentang pohon. Tentang mata hitam Vira.</p>
<p>"Sera. Ceritakan apa yang kau rasakan tentang Vira."</p>
<p>Sera, sambil menangis, menjelaskan segalanya. Bau tanah. Tidak pernah tidur. Gerakan yang salah.</p>
<p>Lalu kau menatap Vira.</p>
<p>"Dan kamu. Siapa kamu sebenarnya?"</p>
<p>Keheningan panjang. Lalu entitas tersenyum — bukan senyum palsu. Senyum yang lelah.</p>
<p>"Akhirnya," bisiknya. "Akhirnya kalian bertanya."</p>`,
  choices: [
    {
      text: "Dengarkan penjelasan entitas",
      next: 'ch2_entity_explains',
      effect: (s) => {
        s.flags.fullConfrontation = true;
      }
    }
  ]
},

'ch2_play_along': {
  text: `<p>Kau tersenyum. "Tidak apa-apa. Aku cuma bermimpi buruk."</p>
<p>Vira memasak sarapan. Telur dan roti. Jarinya bergerak dengan kepastian yang terlalu sempurna — tidak pernah ragu, tidak pernah salah potong.</p>
<p>Sepanjang pagi, kau mengamatinya. Dan kau melihat detail-detail kecil yang menumpuk menjadi bukti mengerikan:</p>
<p>Dia tidak makan. Hanya pura-pura menyuap — garpu ke mulut, tapi makanan tidak berkurang.</p>
<p>Bayangannya di dinding bergerak mandiri — memiringkan kepala saat Vira menghadap lurus.</p>
<p>Dan saat dia mencuci piring, kau melihat tangannya — untuk sepersekian detik — menjadi transparan. Kau bisa melihat aliran air <em>melalui</em> jarinya.</p>
<p>Siang hari, Niko mengajak eksplorasi hutan. "Aku ingin tunjukkan sesuatu."</p>`,
  choices: [
    {
      text: "Ikut Niko ke hutan",
      next: 'ch2_niko_expedition',
      effect: (s) => {
        s.flags.nikoExpedition = true;
      }
    },
    {
      text: "Tetap di cabin dengan Sera dan Juno",
      next: 'ch2_stay_cabin',
      effect: (s) => {
        s.flags.stayedCabin = true;
      }
    }
  ]
},

'ch2_niko_expedition': {
  text: `<p>Niko membawamu dan Vira ke kedalaman hutan. Sera dan Juno tetap di cabin.</p>
<p>Setelah setengah jam berjalan, Niko berhenti di depan sebuah <em>reruntuhan</em>. Dinding-dinding batu yang ditumbuhi lumut, membentuk persegi empat. Bekas kuil kuno.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Ini tempat kakekku menemukan batu itu. Altar di tengahnya — lihat — ada cekungan yang pas untuk Inti Simpul."</p>
<p>Benar. Di tengah reruntuhan, altar batu rendah dengan cekungan bundar di atasnya. Lima lingkaran berukir di sekelilingnya.</p>
<p>Vira berjalan ke altar dengan langkah yang terlalu familiar. Seolah dia sudah ke sini ribuan kali.</p>
<p><span class="speaker vira">Vira</span></p>
<p>"Di sinilah perjanjian pertama dibuat." Suaranya berubah — lebih dalam, lebih tua. "Lima ratus tahun lalu. Lima jiwa. Satu janji."</p>
<p>Niko mengeluarkan batu dari ranselnya. Cahaya hijaunya berdenyut lebih kuat di dekat altar — seolah batu itu mengenali rumahnya.</p>
<p>"Arin," Niko berbisik, "aku bisa taruh batu ini sekarang. Tapi aku butuh keputusanmu."</p>`,
  choices: [
    {
      text: '"Tunggu. Kita butuh Sera dan Juno juga."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.waitedForAll = true;
        s.moralScore += 10;
      }
    },
    {
      text: '"Lakukan sekarang, Niko."',
      next: 'ch2_premature_ritual',
      danger: true,
      effect: (s) => {
        s.flags.prematureRitual = true;
        s.keyChoices.push('premature_ritual');
      }
    }
  ]
},

'ch2_premature_ritual': {
  text: (s) => {
    let result = `<p>Niko meletakkan batu di cekungan altar. Pas sempurna.</p>
<p>Cahaya hijau meledak ke atas — pilar cahaya yang menembus kanopi hutan. Tanah bergetar.</p>
<p>Entitas dalam wujud Vira berubah — bukan transformasi yang perlahan, tapi <em>meledak</em>. Wujudnya terurai menjadi puluhan untaian cahaya yang melilit di sekitar altar.</p>
<p>"BELUM! BELUM LENGKAP!" Suaranya menggelegar dari semua arah. "LIMA! AKU BUTUH LIMA!"</p>
<p>Hutan bereaksi. Pohon-pohon membungkuk ke arah altar. Tanah retak. Akar-akar menjulur ke arahmu dan Niko.</p>`;

    if (s.difficulty >= 2 && Engine.canDie()) {
      result += `<p>Akar melilit kaki Niko. Menariknya ke bawah. Kau meraih tangannya — jari-jari kalian bertautan — tapi kekuatannya terlalu besar.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"ARIN! JANGAN LEPAS!"</p>
<p>Tapi akar terus menarik. Tanah membuka. Dan Niko — dengan teriakan yang akan menghantuimu seumur hidup — tertelan ke dalam bumi.</p>`;
      Engine.killChar('niko');
    } else {
      result += `<p>Kau meraih tangan Niko dan menariknya menjauh dari altar. Akar-akar melilit kakinya tapi kau menarik lebih kuat — dibantu adrenalin murni — dan membebaskannya.</p>
<p>Kalian berlari. Meninggalkan batu di altar. Meninggalkan entitas yang menjerit di belakang.</p>`;
    }

    return result;
  },
  blood: true,
  shake: true,
  choices: [
    {
      text: (s) => s.alive.niko ? "Lari kembali ke cabin" : "Lari. Jangan berhenti. Jangan menoleh.",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        if (!s.alive.niko) s.flags.nikoLost = true;
      }
    }
  ]
},

'ch2_stay_cabin': {
  text: `<p>Niko dan Vira pergi ke hutan. Kau tetap di cabin bersama Sera dan Juno.</p>
<p>Tanpa Vira, udara terasa lebih ringan. Seolah tekanan yang selama ini tidak kau sadari akhirnya terangkat.</p>
<p><span class="speaker sera">Sera</span> menyeduh teh dan kalian duduk di beranda depan.</p>
<p>"Arin..." Sera memandang hutan. "Kalau yang ada di sana bukan Vira... di mana Vira yang asli?"</p>
<p><span class="speaker juno">Juno</span> yang sejak tadi diam akhirnya bicara.</p>
<p>"Aku tahu di mana." Suaranya serak. "Atau setidaknya... aku bisa menebak."</p>
<p>Juno menceritakan segalanya — Halimun, pohon tua, lubang di bawah akar, mata hitam Vira — dengan suara yang kadang terputus oleh isak.</p>
<p>Sera mendengarkan sambil menangis diam-diam. Lalu dia memegang tangan Juno.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Kau lari karena takut. Itu manusiawi, Juno. Jangan hukum dirimu terus."</p>
<p>Juno menunduk. "Tapi aku meninggalkan dia..."</p>`,
  choices: [
    {
      text: '"Kita bisa menyelamatkannya. Kalau kita bekerja sama."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        Engine.modTrust('arin', 'juno', 10);
        Engine.modTrust('arin', 'sera', 10);
        s.flags.teamPlan = true;
        s.keyChoices.push('team_plan');
      }
    },
    {
      text: '"Juno — tunjukkan kami tempat itu."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.junoGuide = true;
        Engine.modTrust('arin', 'juno', 8);
        s.keyChoices.push('juno_guide');
      }
    }
  ]
},

'ch2_force_niko': {
  chapter: 2,
  text: `<p>"NIKO." Suaramu memotong kegelapan. "Cukup. Ceritakan <em>semuanya</em>. Sekarang."</p>
<p>Sera dan Juno menatapnya. Niko berdiri di balik senter yang berkedip, wajahnya setengah tersembunyi.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Kalian mau dengar? Baik. Kakekku membangun cabin ini di atas tempat yang dia tahu <em>hidup</em>. Dia menemukan batu — Inti Simpul — dan membawanya. Batu itu memberinya kekuatan. Kekuatan untuk mempengaruhi orang. Untuk mengikat mereka."</p>
<p>"Empat teman yang bersamanya? Mereka tidak 'menghilang'. Mereka <em>diserap</em>. Oleh hutan. Oleh ritual yang gagal."</p>
<p>"Dan aku... aku membawa kalian ke sini karena aku pikir aku bisa menyelesaikan apa yang dia mulai. Mengembalikan batu. Memperbaiki segalanya."</p>
<p>"Tapi juga..." dia menelan ludah, "...karena aku ingin kekuatan itu untuk diriku sendiri."</p>
<p>Sera menamparnya. Keras. Suara tamparan itu bergema di ruangan kosong.</p>
<p><span class="speaker sera">Sera</span></p>
<p>"Kau membawa kami ke tempat di mana empat orang mati. Untuk <em>ambisi</em>mu."</p>`,
  shake: true,
  choices: [
    {
      text: '"Sera, hentikan. Kita butuh dia."',
      next: 'ch2_entity_explains',
      effect: (s) => {
        Engine.modTrust('arin', 'sera', -5);
        Engine.modTrust('arin', 'niko', 10);
        s.flags.nikoFullTruth = true;
      }
    },
    {
      text: '"Niko, kau punya satu kesempatan untuk menebus ini."',
      next: 'ch2_entity_explains',
      effect: (s) => {
        s.flags.nikoRedemption = true;
        s.keyChoices.push('niko_redemption');
      }
    }
  ]
},

'ch2_juno_confession': {
  text: `<p>Juno menunduk dalam-dalam. Tubuhnya gemetar.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Di Halimun... aku tidak hanya lari." Suaranya hampir tidak terdengar. "Sebelum aku lari... aku melihat Vira berjalan ke lubang itu. Dan dia berteriak minta tolong. Berteriak <em>namaku</em>."</p>
<p>"Dan aku berdiri di sana. Aku bisa meraih tangannya. Aku bisa menariknya kembali. Tapi aku... aku memilih untuk lari."</p>
<p>"Aku meninggalkan sahabatku sendiri untuk dimakan hutan."</p>
<p>Sera menangis. Niko menunduk. Bahkan entitas terlihat tersentuh.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Setiap malam aku bermimpi tentang tangannya yang terulur. Matanya yang memohon. Dan setiap pagi aku bangun mengetahui bahwa aku pengecut. Bahwa aku bukan teman yang baik."</p>
<p>Dia menatapmu. "Arin, apapun yang harus kulakukan untuk menebus ini... aku akan melakukannya."</p>`,
  choices: [
    {
      text: '"Kau bisa menebus itu sekarang. Bantu kami selamatkan Vira."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        Engine.modTrust('arin', 'juno', 15);
        s.flags.junoRedemption = true;
        s.moralScore += 10;
        s.keyChoices.push('juno_redemption');
      }
    },
    {
      text: '"Yang penting kau jujur sekarang. Itu sudah cukup."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        Engine.modTrust('arin', 'juno', 10);
        s.flags.junoForgiven = true;
        s.moralScore += 15;
      }
    }
  ]
},

'ch2_protect_juno': {
  text: `<p>"Cukup," katamu pada entitas. "Kau tidak berhak memaksa siapa pun mengungkapkan apa pun."</p>
<p>Entitas menatapmu lama.</p>
<p>"Simpul yang diikat dengan rahasia yang tersembunyi—"</p>
<p>"Aku tahu. Tidak akan bertahan. Tapi itu <em>pilihan</em> Juno, bukan paksaanmu."</p>
<p>Juno menatapmu. Dan dalam matanya, kau melihat sesuatu retak — bukan rusak, tapi <em>terbuka</em>. Seperti es yang mulai mencair.</p>
<p><span class="speaker juno">Juno</span></p>
<p>"Tidak, Arin. Dia benar. Aku..." dia menarik napas gemetar. "Aku harus bilang ini."</p>
<p>Dan Juno menceritakan segalanya. Bukan karena dipaksa. Tapi karena seseorang melindunginya — dan itu memberinya keberanian untuk membuka diri.</p>`,
  choices: [
    {
      text: "Dengarkan pengakuan Juno",
      next: 'ch2_juno_confession',
      effect: (s) => {
        Engine.modTrust('arin', 'juno', 15);
        s.flags.junoVoluntary = true;
      }
    }
  ]
},

'ch2_chase_niko': {
  text: `<p>Kau berlari ke hutan mengikuti Niko. Pohon-pohon tampak bergerak, tapi kau tidak berhenti.</p>
<p>"NIKO! TUNGGU!"</p>
<p>Kau menemukannya di depan reruntuhan kuil. Batu di tangannya, bercahaya hijau. Matanya liar.</p>
<p><span class="speaker niko">Niko</span></p>
<p>"Pergi, Arin. Ini urusanku."</p>
<p>"Bukan. Ini urusan kita semua. Kau tidak bisa melakukan ritual itu sendirian."</p>
<p>"KENAPA TIDAK?" Dia berteriak. Air mata mengalir. "Kenapa aku selalu butuh orang lain? Kenapa aku tidak pernah <em>cukup</em>?"</p>
<p>Di balik pertanyaan itu, kau mendengar anak kecil yang ditinggalkan orangtuanya. Anak kecil yang belajar bahwa satu-satunya cara untuk tidak ditinggalkan adalah dengan mengendalikan.</p>
<p>Batu di tangannya berdenyut — menyodorkan kekuatan. Menjanjikan bahwa dia tidak akan pernah lemah lagi.</p>`,
  choices: [
    {
      text: '"Kau cukup, Niko. Kau selalu cukup."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        Engine.modTrust('arin', 'niko', 25);
        s.flags.savedNikoSoul = true;
        s.moralScore += 20;
        s.keyChoices.push('saved_niko_soul');
      }
    },
    {
      text: "Rebut batu itu dari tangannya",
      danger: true,
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        Engine.modTrust('arin', 'niko', -15);
        s.flags.tookStoneByForce = true;
        s.flags.arinHasStone = true;
        s.keyChoices.push('took_stone_force');
      }
    }
  ]
},

'ch2_let_niko_go': {
  text: `<p>Kau membiarkan Niko pergi. Suara langkahnya menghilang ditelan hutan.</p>
<p><span class="speaker sera">Sera</span> menatapmu tidak percaya.</p>
<p>"Arin... kau biarkan dia pergi? Sendirian? Di hutan <em>ini</em>?"</p>
<p>Entitas menggeleng pelan.</p>
<p>"Keputusan yang dingin. Tapi mungkin jujur." Dia menatap ke arah Niko menghilang. "Dia membawa Inti Simpul bersamanya. Tanpa itu, ritual tidak bisa dilakukan."</p>
<p>"Kalau dia mencoba menggunakan batu itu sendirian... kekuatannya akan mengonsumsinya. Dia akan menjadi bagian dari hutan. Selamanya."</p>
<p>Juno berdiri. "Aku cari dia."</p>
<p>Sebelum kau bisa menghentikannya, Juno berlari ke hutan.</p>
<p>Dua jam berlalu. Tidak ada yang kembali.</p>
<p>Fajar mulai merekah di timur. Dan dari kedalaman hutan, kau mendengar teriakan — dua suara yang terpotong menjadi keheningan.</p>`,
  shake: true,
  choices: [
    {
      text: "Cari mereka",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        if (s.difficulty >= 2) {
          Engine.killChar('juno');
          s.flags.junoLost = true;
        }
        s.flags.nikoLost = true;
        s.flags.desperateSituation = true;
        s.keyChoices.push('desperate');
      }
    }
  ]
},

'ch2_entity_test': {
  text: `<p>"Buktikan. Lepaskan Vira sekarang sebagai tanda niat baik."</p>
<p>Entitas terdiam lama. Cahaya hijaunya berkedip.</p>
<p>"Kalau aku melepaskan Vira sekarang — tanpa Inti Simpul di tempatnya — dia akan bangun dalam kondisi bingung, takut, dan trauma. Tiga minggu di dalam akar pohon ini tidak lewat tanpa bekas."</p>
<p>"Dan aku... tanpa jembatan ke dunia kalian... aku akan kehilangan kemampuan untuk berkomunikasi. Kalian akan menghadapi ritual tanpa panduan."</p>
<p>"Tapi kalau itu yang kalian butuhkan untuk percaya..."</p>
<p>Akar pohon bergerak. Celah di tanah terbuka. Dan Vira — Vira yang asli — perlahan terangkat ke permukaan. Matanya tertutup. Napasnya dangkal.</p>
<p>Entitas mundur. Wujudnya menjadi transparan. Suaranya samar.</p>
<p>"Aku melepaskannya. Sekarang percayalah. Karena aku hampir tidak bisa—"</p>
<p>Suaranya menghilang. Entitas menjadi bayangan. Lalu tidak ada.</p>
<p>Vira — Vira asli — batuk dan membuka mata.</p>`,
  choices: [
    {
      text: "Berlutut di samping Vira. Sambut dia kembali.",
      next: 'ch3_vira_awake',
      effect: (s) => {
        s.chapter = 3;
        s.flags.viraAwakened = true;
        s.flags.entityGone = true;
        s.keyChoices.push('vira_awakened');
      }
    }
  ]
},

'ch2_negotiation': {
  text: `<p>"Kalau kami kembalikan batu itu, apa yang terjadi?"</p>
<p>Entitas menjawab dengan hati-hati.</p>
<p>"Inti Simpul kembali ke tempatnya. Hutan mendapat jantungnya kembali. Perjanjian lama diperbaharui."</p>
<p>"Vira-mu akan dibebaskan — utuh, sehat, tanpa ingatan tentang waktu yang hilang."</p>
<p>"Dan aku... aku bisa beristirahat. Tidak perlu lagi meminjam wujud orang lain. Tidak perlu lagi berpura-pura menjadi sesuatu yang bukan diriku."</p>
<p>"Tapi ada harganya." Suaranya pelan. "Simpul baru membutuhkan penjaga. Seseorang yang terikat pada hutan. Yang bisa mendengar panggilannya dan menjaga keseimbangan."</p>
<p>"Itu berarti salah satu dari kalian... harus tinggal."</p>
<p>Keheningan yang mengikuti terasa berat seperti batu nisan.</p>`,
  choices: [
    {
      text: '"Tidak ada yang tinggal. Cari cara lain."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.refusedSacrifice = true;
        s.moralScore += 10;
        s.keyChoices.push('refused_sacrifice');
      }
    },
    {
      text: '"Aku yang tinggal."',
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.arinVolunteered = true;
        s.moralScore += 30;
        s.keyChoices.push('arin_volunteered');
      }
    },
    {
      text: "Lihat teman-temanmu. Siapa yang bersedia?",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.lookedAtOthers = true;
        s.keyChoices.push('looked_at_others');
      }
    }
  ]
},

'ch2_demand_proof': {
  text: `<p>"Tunjukkan Vira dulu," katamu tegas. "Buktikan dia masih hidup."</p>
<p>Entitas mengangguk. Akar pohon membuka, dan kau melihat Vira — asli, nyata, tertidur di antara akar — untuk pertama atau kedua kalinya.</p>
<p>Sera menangis melihatnya. Juno jatuh berlutut, air mata mengalir di pipinya yang pucat.</p>
<p>"Dia hidup," bisik Juno. "Dia masih hidup."</p>
<p>Entitas menutup celah itu kembali.</p>
<p>"Sekarang kalian percaya. Ritual harus dilakukan saat fajar. Lima tangan di altar. Lima kebenaran diucapkan. Satu simpul baru."</p>
<p>"Kembalilah. Persiapkan diri kalian."</p>`,
  choices: [
    {
      text: "Kembali ke cabin dan persiapkan fajar",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.sawRealVira = true;
        s.flags.proofGiven = true;
        s.keyChoices.push('saw_proof');
      }
    }
  ]
},

'ch2_resist': {
  text: `<p>"NIKO, JANGAN!"</p>
<p>Kau menarik Niko ke belakang. Entitas mundur, matanya berkilat.</p>
<p><span class="speaker niko">Niko</span> melepaskan diri.</p>
<p>"Arin, ini bukan keputusanmu!"</p>
<p>"Ini keputusan kita SEMUA! Kau tidak bisa menyerahkan sesuatu yang mempengaruhi kita semua tanpa persetujuan kami!"</p>
<p>Entitas menyaksikan pertengkaran kalian. Senyumnya tipis — bukan senang, tapi <em>menunggu</em>.</p>
<p>Akhirnya, Niko mendorong dada mu.</p>
<p>"Kau tidak mengerti. Kau tidak pernah mengerti. Semua orang pikir mereka tahu yang terbaik, tapi aku — AKU yang membawa kalian ke sini. AKU yang bertanggung jawab."</p>
<p>Dia berbalik dan berjalan ke cabin, membanting pintu.</p>
<p>Entitas menatapmu.</p>
<p>"Kelompokmu retak, Arin. Dan simpul yang retak tidak bisa mengikat."</p>`,
  choices: [
    {
      text: "Beri Niko waktu. Bicara dengannya nanti.",
      next: 'ch3_pre_dawn',
      effect: (s) => {
        s.chapter = 3;
        s.flags.gaveNikoSpace = true;
      }
    },
    {
      text: "Susul Niko sekarang. Ini tidak bisa ditunda.",
      next: 'ch2_chase_niko',
      effect: (s) => {
        s.flags.chasedNikoImmediately = true;
      }
    }
  ]
}

};
