/* ============================================================
   SIMPUL TERAKHIR — 25 ENDINGS
   Computed from game state at ending_compute node.
   ============================================================ */

const STORY_ENDINGS = {

'ending_compute': {
  isEnding: false,
  text: '',
  onEnter: (s) => {
    const alive = Engine.CHARACTERS.filter(c => s.alive[c]);
    const aliveCount = alive.length;
    const totalTrust = Object.values(s.trust).reduce((a, b) => a + b, 0);
    const avgTrust = Math.round(totalTrust / Object.keys(s.trust).length);
    const ms = s.moralScore;

    let endingNum = 13;

    // S-TIER
    if (s.flags.perfectRitual && aliveCount >= 4 && s.flags.fiveGuardians) {
      endingNum = 1;
    } else if (s.flags.perfectRitual && aliveCount >= 4 && avgTrust >= 60 && ms >= 40) {
      endingNum = 2;
    }
    // A-TIER
    else if (s.flags.arinBecameGuardian && aliveCount >= 3) {
      endingNum = 3;
    } else if (s.flags.peacefulResolution && aliveCount >= 3) {
      endingNum = 4;
    } else if (s.flags.nikoSacrificed && aliveCount >= 3) {
      endingNum = 5;
    } else if (s.flags.imperfectRitual && aliveCount >= 3 && ms >= 20) {
      endingNum = 6;
    }
    // B-TIER
    else if (s.flags.viraFreed && !s.flags.perfectRitual && aliveCount >= 3) {
      endingNum = 7;
    } else if (s.flags.imperfectRitual && aliveCount >= 3) {
      endingNum = 8;
    } else if (s.flags.escaped && s.flags.returned && aliveCount >= 3) {
      endingNum = 9;
    } else if (s.flags.stoleStoneback && aliveCount >= 3) {
      endingNum = 10;
    } else if (s.flags.viraAwakened && s.flags.rescuedViraOnly) {
      endingNum = 11;
    } else if (s.flags.comfortedNiko && s.flags.forgaveJuno && aliveCount >= 4) {
      endingNum = 12;
    }
    // C-TIER
    else if (s.flags.escaped && !s.flags.returned && aliveCount >= 3) {
      endingNum = 13;
    } else if (s.flags.failedRitual && s.flags.dugForVira) {
      endingNum = 14;
    } else if (s.flags.entityBetrayed && aliveCount >= 2) {
      endingNum = 15;
    } else if (s.flags.escaped && aliveCount === 2) {
      endingNum = 16;
    } else if (s.flags.failedRitual && !s.flags.dugForVira) {
      endingNum = 17;
    } else if (s.flags.destroyedStone && aliveCount >= 2) {
      endingNum = 18;
    }
    // D-TIER
    else if (s.flags.letNikoGo && s.flags.desperateSituation) {
      endingNum = 19;
    } else if (aliveCount === 1 && s.alive.arin) {
      endingNum = 20;
    } else if (s.flags.entityBetrayed && aliveCount <= 2) {
      endingNum = 21;
    } else if (s.flags.destroyedStone && !s.alive.vira) {
      endingNum = 22;
    } else if (aliveCount <= 2 && !s.alive.arin) {
      endingNum = 23;
    }
    // F-TIER
    else if (aliveCount === 0 || (!s.alive.arin && aliveCount <= 1)) {
      endingNum = 24;
    } else {
      // Fallback based on general state
      if (aliveCount >= 4 && ms >= 0) endingNum = 12;
      else if (aliveCount >= 3) endingNum = 13;
      else if (aliveCount >= 2) endingNum = 16;
      else endingNum = 20;
    }

    const endings = {
      1: {
        title: 'Simpul Abadi',
        rating: 'S',
        endingText: `<p>Lima penjaga. Bukan tawanan — penjaga. Kalian berjalan keluar hutan saat matahari pagi menyinari wajah-wajah yang basah oleh air mata dan tersenyum.</p>
<p>Vira — Vira yang asli — berjalan di antara kalian. Bingung, lemah, tapi <em>hidup</em>. Sera menggandeng tangannya. Juno berjalan di sisi lainnya, tidak berhenti meminta maaf dengan mata.</p>
<p>Niko berjalan di depan, tapi bukan sebagai pemimpin. Sebagai pelindung. Perannya yang baru — yang dia pilih sendiri.</p>
<p>Dan kau? Kau berjalan di belakang, menatap empat sahabatmu, dan merasakan sesuatu di dadamu yang lebih dalam dari kebahagiaan: <em>kedamaian</em>.</p>
<p>Di telapak tangan kalian berlima, simbol simpul berkilau samar — pengingat bahwa kalian terikat pada sesuatu yang lebih besar. Bahwa hutan ini, dengan segala misteri dan kegelapannya, adalah bagian dari kalian sekarang.</p>
<p>Dan itu bukan kutukan. Itu <em>amanah</em>.</p>
<p class="narration">Setiap tahun, pada tanggal yang sama, lima sahabat kembali ke hutan. Mereka menaruh tangan di kulit pohon tua dan berbisik kebenaran terbaru mereka. Dan hutan bernyanyi — bukan nyanyian yang menakutkan, tapi nyanyian yang menyambut mereka pulang.</p>`,
        fates: {
          arin: 'Penjaga Simpul — hidup, terikat pada hutan, dalam damai',
          niko: 'Penjaga Simpul — menemukan tujuan yang lebih besar dari ambisi',
          sera: 'Penjaga Simpul — sensitivitasnya menjadi karunia, bukan kutukan',
          juno: 'Penjaga Simpul — menebus masa lalu dengan pengabdian',
          vira: 'Dibebaskan — kembali, utuh, dikelilingi orang-orang yang mencintainya'
        }
      },

      2: {
        title: 'Fajar Pertama',
        rating: 'S',
        endingText: `<p>Simpul sempurna terikat di jantung pohon tua. Cahaya meluap — bukan hanya hijau, tapi semua warna pelangi — dan menyentuh setiap sudut hutan.</p>
<p>Vira bangun. Bukan perlahan — <em>langsung</em>. Matanya terbuka, jernih, penuh. Dan kata pertamanya:</p>
<p>"Aku bermimpi kalian datang menyelamatkanku. Dan ternyata itu bukan mimpi."</p>
<p>Entitas — sekarang bukan lagi makhluk yang kesepian dan lapar — menjadi bagian dari hutan yang hidup. Pohon-pohon tumbuh lebih tinggi. Bunga bermekaran di tempat yang sebelumnya gersang. Burung-burung kembali.</p>
<p>Kalian berlima pulang. Utuh. Berubah. Lebih baik.</p>
<p class="narration">Bertahun-tahun kemudian, mereka masih menceritakan kisah malam itu — bukan sebagai cerita horor, tapi sebagai cerita tentang ikatan yang lebih kuat dari ketakutan. Tentang kebenaran yang menyembuhkan. Tentang keberanian memilih kembali saat semua insting berteriak untuk lari.</p>`,
        fates: {
          arin: 'Hidup — menemukan bahwa keberanian bukan tidak takut, tapi memilih bertindak meskipun takut',
          niko: 'Hidup — melepaskan kebutuhan untuk mengendalikan, menemukan kekuatan dalam kerentanan',
          sera: 'Hidup — menemukan bahwa sensitivitasnya bukan kelemahan, tapi kompas yang menyelamatkan semua',
          juno: 'Hidup — memaafkan dirinya sendiri, belajar bahwa keberanian bisa datang terlambat tapi tetap berarti',
          vira: 'Hidup — kembali utuh, membawa kebijaksanaan dari tiga minggu bermimpi di jantung hutan'
        }
      },

      3: {
        title: 'Pengorbanan Terindah',
        rating: 'A',
        endingText: `<p>Kau memilih tinggal. Hutan memelukmu — bukan dengan kekerasan, tapi dengan kelembutan yang hampir menyakitkan.</p>
<p>Yang terakhir kau dengar: suara Sera yang berteriak namamu, tangan Juno yang meraih tapi tidak sampai, mata Niko yang akhirnya menunjukkan sesuatu selain keangkuhan — rasa hormat.</p>
<p>Dan Vira, yang baru saja bangun, menatapmu dengan bingung dan duka.</p>
<p>"Siapa yang..."</p>
<p>"Itu Arin," bisik Sera. "Dia sahabat kita. Dan dia baru saja menyelamatkan kita semua."</p>
<p class="narration">Di dalam hutan, Arin tidak mati. Dia menjadi bagian dari simpul itu — penjaga, pendengar, pengingat. Kadang, saat angin bertiup dari arah pegunungan, empat sahabatnya bisa mendengar suaranya: lembut, jauh, tapi tidak pernah menghilang.</p>
<p class="narration">"Jaga satu sama lain. Selalu."</p>`,
        fates: {
          arin: 'Menjadi Penjaga Hutan — tidak mati, tapi tidak bisa kembali ke dunia manusia',
          niko: 'Hidup — berubah selamanya oleh pengorbanan Arin',
          sera: 'Hidup — mengunjungi hutan setiap bulan, berbicara pada pohon-pohon',
          juno: 'Hidup — akhirnya memaafkan dirinya, hidup untuk menghormati Arin',
          vira: 'Hidup — kembali tanpa ingatan, tapi merasakan kekosongan yang tidak bisa dijelaskan'
        }
      },

      4: {
        title: 'Jabat Tangan Terakhir',
        rating: 'A',
        endingText: `<p>Kau menjabat tangan entitas. Koneksi yang sukarela — untuk pertama kalinya dalam lima ratus tahun keberadaannya.</p>
<p>Entitas menangis. Cahaya yang menangis. Dan dalam tangisnya, hutan sembuh. Pohon-pohon tegak kembali. Tanah menutup retakannya. Vira — di suatu tempat di bawah akar — membuka mata.</p>
<p>"Terima kasih, Arin." Suaranya menghilang perlahan. "Aku bisa beristirahat sekarang."</p>
<p>Simpul baru terbentuk — bukan dari ritual, bukan dari paksaan, tapi dari tangan yang terulur tanpa pamrih.</p>
<p>Vira muncul dari tanah. Hidup. Bingung. Tapi hidup.</p>
<p class="narration">Entitas tidak mati. Dia menjadi hutan itu sendiri — bukan makhluk yang terpisah, tapi jiwa dari setiap pohon, setiap daun, setiap akar. Dan simpul yang mengikatnya bukan perjanjian yang dipaksakan, tapi kenangan: kenangan bahwa seseorang pernah mengulurkan tangan padanya.</p>`,
        fates: {
          arin: 'Hidup — membawa koneksi dengan hutan, mendengar bisikannya di mimpi',
          niko: 'Hidup — ego-nya retak tapi tidak hancur, perlahan belajar untuk membiarkan orang masuk',
          sera: 'Hidup — merasakan damai untuk pertama kalinya sejak Vira menghilang',
          juno: 'Hidup — beban bersalahnya berkurang, tapi tidak hilang sepenuhnya',
          vira: 'Hidup — kembali dengan ingatan samar tentang mimpi yang sangat panjang'
        }
      },

      5: {
        title: 'Sang Penebus',
        rating: 'A',
        endingText: `<p>Niko melangkah maju. Untuk pertama kalinya, bukan untuk memimpin — tapi untuk <em>melayani</em>.</p>
<p>"Ini salah keluargaku. Biarkan aku yang memperbaikinya."</p>
<p>Dia meletakkan tangan di pohon tua. Cahaya memeluknya. Dan perlahan — sangat perlahan — Niko berubah. Bukan menjadi monster. Menjadi sesuatu yang bercahaya. Sesuatu yang <em>hangat</em>.</p>
<p>"Jaga yang lain, Arin." Senyum terakhirnya — pertama kali jujur sepenuhnya. "Jangan jadi seperti aku. Jangan tunggu sampai terlambat untuk menjadi baik."</p>
<p>Niko menjadi cahaya. Vira bangun. Hutan bernyanyi.</p>
<p class="narration">Niko tidak mati. Dia menjadi penjaga hutan — peran yang berlawanan dengan segala egonya, tapi entah bagaimana, peran yang paling cocok untuknya. Kadang, saat empat sahabatnya duduk bersama, mereka merasakan kehadirannya: hangat, protektif, penuh kasih. Akhirnya menjadi pemimpin yang seharusnya.</p>`,
        fates: {
          arin: 'Hidup — memimpin kelompok dengan kelembutan yang Niko tidak pernah bisa',
          niko: 'Menjadi Penjaga Hutan — menemukan kedamaian dalam pengabdian',
          sera: 'Hidup — melukis potret Niko setiap tahun, menaruhnya di tepi hutan',
          juno: 'Hidup — akhirnya bebas dari rasa bersalah, menulis buku tentang pengalaman mereka',
          vira: 'Hidup — kembali utuh, tidak pernah tahu betapa banyak yang dikorbankan untuknya'
        }
      },

      6: {
        title: 'Simpul yang Retak',
        rating: 'A',
        endingText: `<p>Simpul terbentuk — tapi tidak sempurna. Ada retakan. Luka-luka yang belum sembuh sepenuhnya. Kebohongan yang belum sepenuhnya terangkat.</p>
<p>Tapi simpul itu <em>ada</em>. Nyata. Cukup kuat untuk membebaskan Vira. Cukup kuat untuk membiarkan hutan hidup.</p>
<p>Kalian pulang. Tidak utuh — tapi hidup. Bersama.</p>
<p class="narration">Persahabatan mereka tidak pernah sama. Terlalu banyak kebenaran yang terungkap, terlalu banyak luka yang terbuka. Tapi mereka tidak terputus. Retak, ya. Tapi seperti keramik Jepang yang diperbaiki dengan emas — retakannya justru menjadi bagian terindah.</p>`,
        fates: {
          arin: 'Hidup — membawa bekas simpul di telapak tangan, pengingat konstan',
          niko: 'Hidup — ego-nya terluka tapi tidak hancur, perlahan berubah',
          sera: 'Hidup — lukisan-lukisannya berubah, lebih gelap tapi lebih jujur',
          juno: 'Hidup — humor-nya kembali, tapi lebih lembut, lebih bijak',
          vira: 'Hidup — kembali dengan mimpi-mimpi tentang hutan yang perlahan memudar'
        }
      },

      7: {
        title: 'Cahaya yang Terbelah',
        rating: 'B',
        endingText: `<p>Vira bebas — ditarik keluar dari cengkeraman entitas oleh ikatan persahabatan yang tidak sempurna tapi cukup kuat.</p>
<p>Entitas, tanpa host, mengecil menjadi cahaya redup yang melayang di antara akar pohon tua. Masih hidup. Masih di sana. Tapi tidak lagi mengancam — terlalu lemah, terlalu lelah.</p>
<p>Batu masih di altar. Simpul belum diperbaiki. Tapi Vira <em>hidup</em>.</p>
<p class="narration">Mereka pergi tanpa menyelesaikan ritual. Hutan tetap terluka. Entitas tetap kesepian. Tapi Vira kembali — dan kadang, itu sudah cukup. Kadang, menyelamatkan satu orang yang kau cintai bernilai lebih dari memperbaiki seluruh dunia.</p>`,
        fates: {
          arin: 'Hidup — meninggalkan hutan dengan beban baru tapi hati yang lebih ringan',
          niko: 'Hidup — ego-nya terkoyak, tapi setidaknya jujur',
          sera: 'Hidup — akhirnya bisa tidur nyenyak, tahu Vira di sampingnya nyata',
          juno: 'Hidup — penebusan parsial, tapi setidaknya Vira hidup',
          vira: 'Hidup — lemah, trauma, tapi dikelilingi orang-orang yang tidak menyerah untuknya'
        }
      },

      8: {
        title: 'Bekas Luka Emas',
        rating: 'B',
        endingText: `<p>Ritual tidak sempurna tapi cukup. Simpul terikat dengan retakan. Hutan hidup tapi terluka. Vira bangun tapi kehilangan tiga minggu ingatannya.</p>
<p>Kalian pulang dalam diam. Tidak ada yang berbicara sampai mobil melewati batas hutan.</p>
<p>Lalu Juno tertawa. Tawa kecil, rapuh, tapi nyata. Dan satu per satu, yang lain ikut. Bukan karena ada yang lucu — tapi karena mereka masih <em>bisa</em> tertawa.</p>
<p class="narration">Bekas luka mereka tidak pernah hilang. Tapi mereka belajar bahwa bekas luka bukan tanda kelemahan — melainkan bukti bahwa mereka bertahan.</p>`,
        fates: {
          arin: 'Hidup — bekas simpul di tangan, pengingat permanen',
          niko: 'Hidup — terapi setelah pulang, perlahan membangun ulang hubungan',
          sera: 'Hidup — menjadi lebih berani, kurang takut pada intuisinya',
          juno: 'Hidup — menulis stand-up comedy tentang "camping trip dari neraka"',
          vira: 'Hidup — kehilangan 3 minggu ingatan, tapi menemukan teman yang lebih setia'
        }
      },

      9: {
        title: 'Kembali',
        rating: 'B',
        endingText: `<p>Kau memilih kembali saat yang lain ingin lari. Dan karena keputusan itu — karena satu orang yang menolak menyerah — semua mengikuti.</p>
<p>Ritual dilakukan dengan kelelahan di tulang dan keberanian di hati.</p>
<p class="narration">Kadang, keberanian bukan melakukan hal yang benar dari awal. Kadang, keberanian adalah <em>kembali</em> setelah lari. Mengakui kau salah. Mencoba lagi.</p>`,
        fates: {
          arin: 'Hidup — menemukan bahwa kembali lebih sulit dari pergi, tapi lebih bermakna',
          niko: 'Hidup — belajar mengikuti alih-alih memimpin',
          sera: 'Hidup — bangga pada dirinya untuk pertama kalinya',
          juno: 'Hidup — akhirnya berhenti lari',
          vira: 'Hidup — kembali, tidak tahu betapa dekat dia kehilangan segalanya'
        }
      },

      10: {
        title: 'Pencurian Suci',
        rating: 'B',
        endingText: `<p>Kalian mencuri batu itu kembali dari entitas yang mengamuk. Tindakan gila yang berhasil karena kalian bekerja sama — untuk pertama kalinya, benar-benar bersama.</p>
<p>Tapi tanpa ritual yang benar, batu itu hanya batu. Kekuatannya mengalir pergi. Hutan tetap terluka. Entitas tetap terjebak.</p>
<p class="narration">Mereka membawa batu itu pulang. Menyimpannya. Dan bertahun-tahun kemudian, ketika mereka lebih tua, lebih bijak, mereka kembali. Dan kali itu, mereka melakukannya dengan benar.</p>`,
        fates: {
          arin: 'Hidup — menyimpan batu sebagai pengingat janji untuk kembali',
          niko: 'Hidup — masih egois, tapi belajar bahwa kerja sama bukan kelemahan',
          sera: 'Hidup — menggambar peta hutan dari ingatan, untuk perjalanan berikutnya',
          juno: 'Hidup — berjanji untuk tidak lari lagi, apapun yang terjadi',
          vira: 'Masih terjebak — tertidur di akar pohon, menunggu mereka kembali'
        }
      },

      11: {
        title: 'Setengah Jalan',
        rating: 'B',
        endingText: `<p>Vira diselamatkan — dibangunkan tanpa entitas, tanpa ritual. Tapi hutan membayar harganya. Pohon-pohon menguning. Sungai mengering. Sesuatu yang fundamental rusak.</p>
<p>Kalian membawa Vira keluar. Hidup. Nyata. Tapi hutan di belakang kalian menangis.</p>
<p class="narration">Mereka menyelamatkan temannya tapi meninggalkan masalahnya. Seperti memadamkan api di satu ruangan sambil membiarkan rumah tetap terbakar. Cukup? Mungkin. Benar? Tidak sepenuhnya.</p>`,
        fates: {
          arin: 'Hidup — dihantui perasaan bahwa ada yang belum selesai',
          niko: 'Hidup — menyimpan rahasia tentang batu, mempertimbangkan kembali',
          sera: 'Hidup — merawat Vira yang masih lemah dan bingung',
          juno: 'Hidup — lega tapi tahu ini bukan akhir sebenarnya',
          vira: 'Hidup — trauma, bermimpi buruk setiap malam tentang akar-akar'
        }
      },

      12: {
        title: 'Benang Baru',
        rating: 'B',
        endingText: `<p>Tidak sempurna. Jauh dari sempurna. Tapi ikatan yang terbentuk malam ini — dari air mata Niko, pengakuan Juno, keteguhan Sera, keberanianmu — cukup kuat untuk menahan simpul.</p>
<p>Hutan hidup. Vira bangun. Entitas beristirahat.</p>
<p class="narration">Mereka pulang dengan lebih banyak bekas luka daripada saat berangkat. Tapi juga dengan ikatan yang lebih jujur. Dan kadang, itu trade-off yang paling berharga.</p>`,
        fates: {
          arin: 'Hidup — belajar bahwa menjadi penengah membutuhkan keberanian',
          niko: 'Hidup — menangis untuk pertama kalinya di depan teman-temannya',
          sera: 'Hidup — intuisinya terbukti benar, belajar percaya diri sendiri',
          juno: 'Hidup — jujur untuk pertama kalinya tentang Halimun',
          vira: 'Hidup — kembali ke teman-teman yang lebih jujur dari sebelumnya'
        }
      },

      13: {
        title: 'Pelarian',
        rating: 'C',
        endingText: `<p>Kalian lari. Meninggalkan hutan, cabin, pohon tua, dan Vira. Meninggalkan segalanya.</p>
<p>Mobil menyala. Ban berderit. Dan hutan — perlahan, menyakitkan — menghilang di kaca spion.</p>
<p>Tidak ada yang bicara selama dua jam perjalanan.</p>
<p class="narration">Mereka tidak pernah kembali. Persahabatan mereka perlahan layu — seperti yang dijanjikan entitas. Bukan dengan pertengkaran besar, tapi dengan jarak yang semakin lebar, panggilan telepon yang semakin jarang, alasan yang semakin banyak untuk tidak bertemu. Sampai akhirnya mereka menjadi orang asing yang pernah saling mengenal.</p>
<p class="narration">Dan Vira tetap tertidur di bawah akar pohon tua. Bermimpi tentang teman-teman yang tidak pernah datang menyelamatkannya.</p>`,
        fates: {
          arin: 'Hidup — tapi dihantui mimpi tentang hutan setiap malam',
          niko: 'Hidup — semakin egois tanpa penyeimbang, kehilangan semua teman',
          sera: 'Hidup — depresi, merasakan koneksi putus satu per satu',
          juno: 'Hidup — rasa bersalah berlipat ganda, tidak bisa memaafkan diri sendiri',
          vira: 'Terjebak selamanya — tertidur dalam mimpi yang semakin gelap'
        }
      },

      14: {
        title: 'Tangan Kosong',
        rating: 'C',
        endingText: `<p>Ritual gagal. Simpul putus. Tapi kau menolak menyerah.</p>
<p>Kau menggali tanah dengan tangan kosong. Kuku patah. Jari berdarah. Tapi kau terus menggali.</p>
<p>Dan akhirnya — akhirnya — kau menemukan Vira. Pucat. Dingin. Tapi bernapas.</p>
<p>Kau menggendongnya keluar hutan yang sekarat. Pohon-pohon tumbang di sekelilingmu. Dunia runtuh. Tapi kau keluar.</p>
<p class="narration">Vira tidak pernah sepenuhnya pulih. Bagian dirinya tertinggal di bawah akar — bagian yang bermimpi, yang berharap, yang percaya. Tapi dia hidup. Dan kadang, hidup sudah cukup.</p>`,
        fates: {
          arin: 'Hidup — tangan penuh bekas luka, hati penuh penyesalan',
          niko: 'Hidup — tapi batu yang pecah meninggalkan kekosongan di dadanya',
          sera: 'Hidup — merawat Vira yang tidak pernah sepenuhnya kembali',
          juno: 'Hidup — berhenti tertawa, tapi tidak berhenti peduli',
          vira: 'Hidup — tapi kehilangan bagian dirinya yang paling hidup'
        }
      },

      15: {
        title: 'Pengkhianatan',
        rating: 'C',
        endingText: `<p>Entitas mengkhianati kalian. Kepercayaan yang salah taruh. Batu di tangannya menjadi senjata, dan hutan menjadi penjara.</p>
<p>Kalian berlari. Meninggalkan pohon tua, altar, dan mimpi untuk menyelamatkan Vira. Berlari sampai paru-paru terbakar dan kaki tidak bisa lagi.</p>
<p class="narration">Mereka selamat — sebagian dari mereka. Tapi hutan berubah. Menjadi tempat yang salah. Tempat di mana kompas tidak bekerja, di mana GPS menunjuk ke arah yang tidak ada, di mana pendaki menghilang tanpa jejak. Dan di tengahnya, entitas duduk di atas tahta yang dibangun dari lima ratus tahun kesakitan, menunggu lima yang berikutnya.</p>`,
        fates: {
          arin: 'Hidup — trauma yang tidak bisa dijelaskan pada terapis manapun',
          niko: 'Hidup — menyalahkan diri sendiri selamanya untuk membawa mereka ke sana',
          sera: 'Hidup — mimpi buruk setiap malam, tidak bisa masuk hutan apapun',
          juno: 'Tergantung — mungkin tidak selamat dari pelarian',
          vira: 'Terjebak — dimakan perlahan oleh entitas yang lapar'
        }
      },

      16: {
        title: 'Dua yang Tersisa',
        rating: 'C',
        endingText: `<p>Hanya berdua. Dari lima yang datang, hanya dua yang keluar.</p>
<p>Kalian tidak bicara selama perjalanan pulang. Tidak bisa. Kata-kata terasa terlalu kecil untuk menanggung beban yang kalian bawa.</p>
<p class="narration">Mereka mencoba menjalani hidup normal. Pergi kerja. Makan. Tidur. Tapi setiap kali mereka berhadapan — setiap kali mata bertemu mata — yang mereka lihat bukan satu sama lain. Yang mereka lihat adalah bayangan tiga orang yang tidak ada lagi. Dan keheningan di antara mereka lebih keras dari teriakan manapun.</p>`,
        fates: {
          arin: 'Hidup — tapi hidup terasa lebih ringan tiga orang',
          niko: 'Tergantung — mungkin selamat, mungkin tidak',
          sera: 'Tergantung — mungkin selamat, mungkin tidak',
          juno: 'Tergantung — mungkin selamat, mungkin tidak',
          vira: 'Hilang — tidak pernah ditemukan'
        }
      },

      17: {
        title: 'Simpul Putus',
        rating: 'C',
        endingText: `<p>Ritual gagal. Simpul putus. Dan kau memilih pergi — meninggalkan Vira, meninggalkan hutan, meninggalkan segalanya.</p>
<p>Batu pecah di altar. Pohon tua menangis — getah mengalir seperti darah. Hutan mulai mati.</p>
<p class="narration">Mereka pulang dan tidak pernah membicarakan apa yang terjadi. Seperti perjanjian tanpa kata. Tapi setiap musim gugur, saat daun-daun jatuh, mereka merasakan sesuatu — kehilangan yang tidak bisa mereka jelaskan. Seperti tali yang putus di dalam dada. Seperti nama yang ada di ujung lidah tapi tidak pernah terucap.</p>`,
        fates: {
          arin: 'Hidup — tapi tidak pernah bisa menjelaskan kekosongan di dadanya',
          niko: 'Hidup — sukses di luar, kosong di dalam',
          sera: 'Hidup — berhenti melukis, warna-warna terasa salah',
          juno: 'Hidup — humornya kembali tapi matanya tidak pernah tertawa',
          vira: 'Hilang selamanya — terjebak dalam mimpi yang menjadi kegelapan'
        }
      },

      18: {
        title: 'Batu yang Hancur',
        rating: 'C',
        endingText: `<p>Kau menghancurkan batu itu. Simpul putus. Selamanya.</p>
<p>Ledakan cahaya. Hutan menjerit — suara yang akan kau dengar di setiap mimpi burukmu selama sisa hidupmu.</p>
<p>Dan Vira... Vira tidak pernah bangun.</p>
<p class="narration">Mereka memilih keselamatan diri sendiri di atas segalanya. Dan hutan membiarkan mereka pergi — bukan karena baik hati, tapi karena tidak ada lagi yang tersisa untuk diperjuangkan.</p>`,
        fates: {
          arin: 'Hidup — pembunuh? penyelamat? garis di antaranya terlalu tipis',
          niko: 'Hidup — kehilangan koneksi dengan sesuatu yang tidak pernah dia pahami',
          sera: 'Hidup — tidak pernah memaafkan Arin',
          juno: 'Hidup — diam-diam setuju tapi tidak pernah mengakuinya',
          vira: 'Mati — terikat pada simpul yang dihancurkan, tidak ada yang bisa menyelamatkannya'
        }
      },

      19: {
        title: 'Yang Ditinggalkan',
        rating: 'D',
        endingText: `<p>Kau membiarkan Niko pergi. Lalu Juno menyusulnya. Lalu keheningan.</p>
<p>Hutan mengambil mereka — satu per satu, seperti jari-jari menutup di sekitar mangsa.</p>
<p>Kau dan Sera yang tersisa. Dua dari lima. Tidak cukup untuk ritual. Tidak cukup untuk apa pun.</p>
<p class="narration">Mereka keluar dari hutan saat matahari terbenam. Dua orang yang dulu bagian dari lima. Dua orang yang akan menanggung beban tiga kehilangan seumur hidup. Dan pertanyaan yang tidak akan pernah terjawab: apakah semuanya bisa berbeda kalau mereka memilih untuk <em>tidak meninggalkan</em>?</p>`,
        fates: {
          arin: 'Hidup — tapi menanggung berat tiga jiwa yang ditinggalkan',
          niko: 'Hilang — ditelan hutan bersama ambisinya',
          sera: 'Hidup — satu-satunya orang lain yang tahu apa yang terjadi',
          juno: 'Hilang — pergi mencari Niko, tidak pernah kembali',
          vira: 'Terjebak — masih tertidur, tanpa harapan diselamatkan'
        }
      },

      20: {
        title: 'Terakhir Berdiri',
        rating: 'D',
        endingText: `<p>Hanya kau. Hanya Arin. Satu dari lima yang keluar dari hutan.</p>
<p>Kau berjalan sendirian ke mobil. Kunci yang ditinggalkan Niko masih di saku jaketnya — jaket yang tersangkut di akar pohon.</p>
<p>Kau mengemudi pulang. Sepanjang jalan, kau tidak menyalakan radio. Kau mendengarkan keheningan. Dan keheningan itu <em>berbicara</em> — dalam suara-suara yang kau kenal. Yang kau cintai. Yang tidak akan pernah kau dengar lagi.</p>
<p class="narration">Arin tidak pernah menceritakan apa yang terjadi. Tidak pada siapa pun. Dia memiliki banyak kenalan setelah itu, tapi tidak pernah lagi punya teman. Tidak pernah lagi membiarkan siapa pun cukup dekat untuk disebut sahabat. Karena terakhir kali dia melakukan itu, hutan mengambil mereka semua.</p>`,
        fates: {
          arin: 'Hidup — terakhir berdiri bukanlah kemenangan',
          niko: 'Hilang',
          sera: 'Hilang',
          juno: 'Hilang',
          vira: 'Hilang'
        }
      },

      21: {
        title: 'Pesta Entitas',
        rating: 'D',
        endingText: `<p>Entitas menang. Dengan Inti Simpul di tangannya, tidak ada yang bisa menghentikannya.</p>
<p>Hutan berubah menjadi sesuatu yang salah — pohon-pohon bengkok, tanah bernapas, cahaya yang datang dari sumber yang tidak ada.</p>
<p>Kalian yang tersisa berlari, tapi hutan tidak membiarkan kalian pergi dengan mudah.</p>
<p class="narration">Mereka keluar — sebagian dari mereka — tapi meninggalkan bagian diri mereka di dalam. Bagian yang bermimpi. Bagian yang percaya. Bagian yang pernah tahu artinya memiliki sahabat.</p>`,
        fates: {
          arin: 'Hidup — tapi bagian dirinya tertinggal di hutan',
          niko: 'Tergantung',
          sera: 'Tergantung',
          juno: 'Tergantung',
          vira: 'Dikonsumsi — entitas menyerap sisa-sisa keberadaannya'
        }
      },

      22: {
        title: 'Harga Penghancuran',
        rating: 'D',
        endingText: `<p>Batu hancur. Vira mati — terikat pada simpul yang kau potong sendiri. Kau membunuh sahabatmu sendiri untuk menghancurkan musuh.</p>
<p>Apakah itu benar? Kau tidak tahu. Kau tidak akan pernah tahu.</p>
<p class="narration">Mereka pulang dengan darah di tangan yang tidak bisa dicuci. Darah metaforis, tapi terasa senyata noda di baju. Setiap kali Arin menutup mata, dia melihat wajah Vira — bukan entitas, tapi Vira yang asli — dan bertanya: apakah ada jalan lain?</p>`,
        fates: {
          arin: 'Hidup — dengan beban yang tidak akan pernah terangkat',
          niko: 'Hidup — menyalahkan Arin, persahabatan mereka hancur',
          sera: 'Hidup — tidak pernah memaafkan, tidak pernah melupakan',
          juno: 'Hidup — diam, terlalu diam, untuk sisa hidupnya',
          vira: 'Mati — dibunuh oleh tangan yang seharusnya menyelamatkannya'
        }
      },

      23: {
        title: 'Tanpa Suara',
        rating: 'D',
        endingText: `<p>Mereka tidak berhasil. Sebagian besar dari mereka tidak berhasil keluar.</p>
<p>Yang tersisa berjalan pulang membawa keheningan yang akan mengikuti mereka selamanya.</p>
<p class="narration">Hutan mengambil yang dia mau dan membiarkan sisanya pergi. Bukan karena belas kasihan — tapi karena sisa itu membawa cerita. Dan cerita, bagi hutan, adalah undangan untuk yang berikutnya.</p>`,
        fates: {
          arin: 'Tergantung — mungkin di antara yang selamat, mungkin tidak',
          niko: 'Tergantung',
          sera: 'Tergantung',
          juno: 'Tergantung',
          vira: 'Hilang'
        }
      },

      24: {
        title: 'Kekosongan',
        rating: 'F',
        endingText: `<p>Tidak ada yang selamat.</p>
<p>Lima sahabat masuk ke hutan. Tidak ada yang keluar.</p>
<p>Mobil Niko ditemukan tiga bulan kemudian, tertutup daun dan lumut. Kunci masih di kontak. Tas-tas di bagasi.</p>
<p>Tim pencari menemukan cabin — kosong, berdebu, seolah tidak ada yang mengunjunginya selama bertahun-tahun.</p>
<p>Mereka tidak menemukan pohon tua.</p>
<p>Mereka tidak menemukan altar.</p>
<p>Mereka tidak menemukan apa pun.</p>
<p class="narration">Hutan menyimpan rahasianya. Seperti yang selalu dia lakukan. Dan di suatu tempat di kedalaman yang tidak bisa dijangkau manusia, lima simpul baru berdenyut — lemah, takut, tapi hidup. Menunggu lima yang berikutnya datang.</p>
<p class="narration">Karena hutan selalu menunggu.</p>
<p class="narration">Dan seseorang selalu datang.</p>`,
        fates: {
          arin: 'Hilang — diserap oleh simpul, menjadi bagian dari hutan',
          niko: 'Hilang — ambisinya menjadi akar yang menggenggam tanah',
          sera: 'Hilang — sensitivitasnya menjadi angin yang berbisik di antara daun',
          juno: 'Hilang — humornya menjadi kicau burung yang terdengar saat fajar',
          vira: 'Hilang — tidak pernah bangun, mimpinya menjadi kabut hutan'
        }
      },

      25: {
        title: 'Siklus',
        rating: 'F',
        endingText: `<p>Gelap.</p>
<p>Lalu cahaya. Cahaya pagi yang menyentuh kelopak matamu.</p>
<p>Kau duduk di mobil. Mobil Niko. Di sebelahmu, Sera menggeliat bangun. Di belakang, Juno menguap. Niko menyalakan mesin.</p>
<p>"Kita sampai," kata Niko. "Cabin keluargaku cuma dua jam jalan kaki dari sini."</p>
<p>Di luar, hutan pinus menjulang. Gelap. Dalam. Bernapas.</p>
<p>Dan Vira — Vira yang tersenyum terlalu sempurna — sudah berdiri di luar mobil, wajahnya terangkat ke pepohonan.</p>
<p>"Hutannya... rindu."</p>
<p>Kau merasakan déjà vu yang menghantam seperti ombak. Kau pernah di sini sebelumnya. Kau sudah pernah mendengar kata-kata itu. Kau sudah pernah—</p>
<p>Tapi kemudian perasaan itu menghilang. Terhapus. Seperti tulisan di pasir yang dilalui ombak.</p>
<p>Kau melangkah keluar mobil.</p>
<p class="narration">Dan siklus dimulai lagi.</p>
<p class="narration">Dari awal.</p>
<p class="narration">Seperti yang selalu terjadi.</p>
<p class="narration">Seperti yang akan selalu terjadi.</p>`,
        fates: {
          arin: 'Terjebak dalam siklus — tidak tahu, tidak ingat, terus mengulang',
          niko: 'Terjebak dalam siklus — ambisinya dimanfaatkan berulang-ulang',
          sera: 'Terjebak dalam siklus — merasakan keanehan tapi tidak pernah cukup cepat',
          juno: 'Terjebak dalam siklus — lari dari kebenaran yang sama berulang kali',
          vira: 'Jembatan abadi — digunakan berulang-ulang untuk menjebak lima yang baru'
        }
      }
    };

    const ending = endings[endingNum] || endings[13];

    Engine.showDirectEnding(endingNum, {
      title: ending.title,
      rating: ending.rating,
      endingText: ending.endingText,
      fates: ending.fates
    });
  },
  choices: []
}

};
