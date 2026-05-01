/* ============================================================
   SIMPUL TERAKHIR — Character Behavior Database
   Decision trees and personality profiles for all 10 characters.
   Each character has ~100+ decision nodes that drive autonomous
   behavior during the game.
   ============================================================ */

const CharDB = (() => {

  // ---- Personality Weights ----
  // Scale 0-100 for each axis
  // aggression: tendency to confront/attack
  // caution: tendency to avoid risk
  // loyalty: tendency to protect allies
  // cunning: tendency to manipulate/deceive
  // empathy: tendency to help others
  // impulsiveness: tendency to act without thinking
  // courage: base bravery

  const PERSONALITIES = {
    arin: {
      aggression: 30, caution: 40, loyalty: 75, cunning: 60,
      empathy: 65, impulsiveness: 55, courage: 70,
      archetype: 'investigator'
    },
    niko: {
      aggression: 45, caution: 70, loyalty: 30, cunning: 90,
      empathy: 20, impulsiveness: 25, courage: 60,
      archetype: 'mastermind'
    },
    sera: {
      aggression: 15, caution: 80, loyalty: 70, cunning: 75,
      empathy: 85, impulsiveness: 15, courage: 45,
      archetype: 'profiler'
    },
    juno: {
      aggression: 75, caution: 20, loyalty: 85, cunning: 30,
      empathy: 60, impulsiveness: 85, courage: 80,
      archetype: 'rebel'
    },
    vira: {
      aggression: 25, caution: 65, loyalty: 55, cunning: 70,
      empathy: 50, impulsiveness: 35, courage: 55,
      archetype: 'survivor'
    },
    reza: {
      aggression: 50, caution: 60, loyalty: 65, cunning: 55,
      empathy: 55, impulsiveness: 30, courage: 75,
      archetype: 'detective'
    },
    lana: {
      aggression: 60, caution: 75, loyalty: 10, cunning: 95,
      empathy: 15, impulsiveness: 20, courage: 65,
      archetype: 'puppeteer'
    },
    dimas: {
      aggression: 55, caution: 70, loyalty: 15, cunning: 80,
      empathy: 10, impulsiveness: 15, courage: 50,
      archetype: 'operator'
    },
    kira: {
      aggression: 20, caution: 85, loyalty: 50, cunning: 70,
      empathy: 40, impulsiveness: 40, courage: 40,
      archetype: 'hacker'
    },
    farah: {
      aggression: 15, caution: 90, loyalty: 25, cunning: 65,
      empathy: 30, impulsiveness: 10, courage: 25,
      archetype: 'heiress'
    }
  };

  // ---- Initial Goals per Character ----
  function getInitialGoals(name, isKiller) {
    if (isKiller) {
      const killerGoals = {
        lana: [
          { type: 'maintain_cover', priority: 90 },
          { type: 'eliminate', priority: 85 },
          { type: 'frame', priority: 75 },
          { type: 'divide', priority: 70 },
          { type: 'manipulate_sera', priority: 60 }
        ],
        dimas: [
          { type: 'maintain_cover', priority: 85 },
          { type: 'eliminate', priority: 90 },
          { type: 'isolate', priority: 75 },
          { type: 'sabotage', priority: 65 }
        ],
        niko: [
          { type: 'maintain_cover', priority: 95 },
          { type: 'eliminate', priority: 70 },
          { type: 'divide', priority: 80 },
          { type: 'frame', priority: 75 }
        ]
      };
      return killerGoals[name] || [
        { type: 'maintain_cover', priority: 85 },
        { type: 'eliminate', priority: 90 }
      ];
    }

    const survivorGoals = {
      arin: [
        { type: 'investigate', priority: 85 },
        { type: 'expose_killer', priority: 80 },
        { type: 'survive', priority: 75 },
        { type: 'protect', priority: 70, target: 'sera' }
      ],
      niko: [
        { type: 'survive', priority: 85 },
        { type: 'investigate', priority: 70 },
        { type: 'gather_allies', priority: 65 },
        { type: 'reconcile', priority: 50, target: 'vira' }
      ],
      sera: [
        { type: 'investigate', priority: 80 },
        { type: 'expose_killer', priority: 85 },
        { type: 'survive', priority: 75 },
        { type: 'protect', priority: 65, target: 'arin' }
      ],
      juno: [
        { type: 'survive', priority: 80 },
        { type: 'confront', priority: 75 },
        { type: 'protect', priority: 85, target: 'sera' },
        { type: 'escape', priority: 70 }
      ],
      vira: [
        { type: 'survive', priority: 90 },
        { type: 'escape', priority: 85 },
        { type: 'investigate', priority: 60 },
        { type: 'hide', priority: 70 }
      ],
      reza: [
        { type: 'investigate', priority: 85 },
        { type: 'expose_killer', priority: 80 },
        { type: 'protect', priority: 70 },
        { type: 'survive', priority: 75 }
      ],
      kira: [
        { type: 'investigate', priority: 80 },
        { type: 'survive', priority: 85 },
        { type: 'hide', priority: 60 },
        { type: 'sabotage', priority: 50 }
      ],
      farah: [
        { type: 'survive', priority: 95 },
        { type: 'hide', priority: 85 },
        { type: 'negotiate', priority: 60 },
        { type: 'escape', priority: 75 }
      ]
    };
    return survivorGoals[name] || [
      { type: 'survive', priority: 90 },
      { type: 'investigate', priority: 70 }
    ];
  }

  // ---- Decision Trees per Character ----
  // Each decision: { condition: {...}, action: {...}, weight: number }
  // Higher weight = more likely to be chosen when multiple match

  const DECISION_TREES = {

    // ========== ARIN — The Investigator ==========
    arin: [
      // Early game: investigate everything
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Arin mengamati setiap tamu dengan mata jurnalisnya — mencari cerita di balik ekspresi mereka.' }, weight: 15 },
      { condition: { chapter: 1, emotion: 'calm' }, action: { type: 'investigate', desc: 'Arin memeriksa setiap sudut ruangan, recorder menyala, mencatat detail yang orang lain lewatkan.' }, weight: 20 },
      { condition: { chapter: 1, emotion: 'wary' }, action: { type: 'investigate', desc: 'Arin menemukan catatan aneh di balik lukisan — tulisan tangan yang familiar...' }, weight: 18 },

      // Protect Sera
      { condition: { nearbyIncludes: 'sera', minDanger: 40 }, action: { type: 'guard', desc: 'Arin berdiri di dekat Sera, tanpa kata tapi jelas — dia tidak akan membiarkan siapapun menyentuhnya.' }, weight: 25 },
      { condition: { nearbyIncludes: 'sera', emotion: 'panicked' }, action: { type: 'guard', desc: '"Sera, tetap di belakangku." Arin menarik Sera ke belakangnya, tubuhnya menjadi perisai.' }, weight: 30 },

      // Investigate when alone
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'investigate', desc: 'Sendirian, Arin mengeluarkan senter kecilnya. Ada sesuatu di sini yang belum ditemukan.' }, weight: 22 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'investigate', desc: 'Arin membuka recorder: "Catatan pribadi — aku menemukan sesuatu. Kalau aku tidak kembali, cek rekaman ini."' }, weight: 20 },

      // Confront suspects
      { condition: { emotion: 'suspicious', minDeaths: 1 }, action: { type: 'confront', desc: 'Arin tidak bisa diam lagi. "Salah satu dari kalian bertanggung jawab. Dan aku akan menemukan siapa."' }, weight: 18 },

      // Share clues with Sera
      { condition: { hasClue: true, nearbyIncludes: 'sera' }, action: { type: 'share_clue', desc: 'Arin berbisik ke Sera: "Lihat ini — bukti ini menghubungkan semuanya."', target: 'sera' }, weight: 20 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Arin menunjukkan bukti ke Reza. "Kau mantan detektif. Apa pendapatmu?"', target: 'reza' }, weight: 15 },

      // High danger
      { condition: { minDanger: 70, emotion: 'panicked' }, action: { type: 'flee', desc: 'Untuk pertama kalinya, insting jurnalis kalah oleh insting bertahan hidup. Arin berlari.' }, weight: 15 },

      // Accuse when confident
      { condition: { minDeaths: 2, emotion: 'hostile' }, action: { type: 'accuse', desc: 'Arin menunjuk jari: "AKU TAHU SIAPA KAU." Matanya berkilat — ini bukan tuduhan, ini fakta.' }, weight: 25 },

      // Mid-game investigation
      { condition: { chapter: 3 }, action: { type: 'investigate', desc: 'Arin menyusun timeline di dinding — foto, catatan, benang merah menghubungkan semuanya.' }, weight: 16 },
      { condition: { chapter: 4 }, action: { type: 'investigate', desc: 'Arin menemukan pola: setiap kematian terjadi saat korban sendirian. Ini bukan acak.' }, weight: 18 },
      { condition: { chapter: 5 }, action: { type: 'confront', desc: 'Arin mengumpulkan semua bukti. Saatnya mengungkap kebenaran di depan semua orang.' }, weight: 20 },

      // Emotional moments
      { condition: { nearbyIncludes: 'sera', minDeaths: 3 }, action: { type: 'socialize', desc: 'Arin menggenggam tangan Sera. "Kalau kita tidak selamat..." — "Kita akan selamat," potong Sera.' }, weight: 12 },

      // --- NEW: Progressive investigation chain ---
      { condition: { chapter: 2, hasClue: true }, action: { type: 'confront', desc: 'Arin menunjukkan bukti ke kelompok: "Dengarkan. Ada pola di semua ini — kematian tidak acak."' }, weight: 18 },
      { condition: { chapter: 4, minDeaths: 2 }, action: { type: 'accuse', desc: 'Arin menyusun semua bukti di dinding. "Aku sudah tahu siapa. Dan aku bisa buktikan."' }, weight: 22 },

      // --- NEW: Movement & exploration decisions ---
      { condition: { isAlone: true, emotion: 'calm' }, action: { type: 'move', desc: 'Arin bergerak ke ruangan lain, mengikuti insting jurnalisnya. Ada sesuatu yang belum ditemukan.', moveTo: 'perpustakaan' }, weight: 14 },
      { condition: { minDanger: 40, emotion: 'wary' }, action: { type: 'move', desc: 'Arin merasa tidak aman di sini. Saatnya pindah ke tempat yang lebih strategis.', moveTo: 'aula_utama' }, weight: 12 },

      // --- NEW: Unique character interactions ---
      { condition: { nearbyIncludes: 'kira' }, action: { type: 'socialize', desc: '"Kira, bisa kau hack CCTV mansion ini? Aku butuh rekaman malam itu." Arin mengajak Kira berkolaborasi.' }, weight: 16 },
      { condition: { nearbyIncludes: 'reza', minDeaths: 1 }, action: { type: 'socialize', desc: '"Reza, kau pernah menangani kasus seperti ini. Apa yang kau lihat?" Arin mengandalkan pengalaman Reza.' }, weight: 14 },
      { condition: { nearbyIncludes: 'niko', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Niko, ini mansionmu. Kau tahu lebih banyak dari yang kau akui. BICARA." Arin mendesak Niko.' }, weight: 18 },
      { condition: { nearbyIncludes: 'vira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Vira, kau pernah di sini. Apa yang terjadi enam bulan lalu? Aku perlu tahu." Arin mencari jawaban dari Vira.' }, weight: 16 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: 'Arin mengambil alih. "Dengarkan. Kita butuh strategi — siapa jaga pintu, siapa investigasi, siapa pantau pergerakan."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'scout', desc: 'Arin bergerak pelan, memeriksa setiap sudut sebelum melangkah. Jurnalis yang tahu kapan harus diam.' }, weight: 16 },
      { condition: { minDeaths: 2, isAlone: false, hasClue: true }, action: { type: 'rally', desc: '"SEMUA DENGARKAN. Aku punya bukti. Kita akhiri ini malam ini." Arin mengumpulkan semua yang tersisa.' }, weight: 22 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: 'Arin menyusun rencana penyergapan. "Kita tahu dia akan lewat sini. Bersiap."' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Arin memeriksa semua jalur keluar. "Kalau semuanya gagal, kita butuh rencana pelarian."' }, weight: 14 },
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'betray', desc: 'Insting survival mengalahkan segalanya. Arin mempertimbangkan untuk meninggalkan yang lain demi keselamatannya.' }, weight: 10 },
      // Trust-kill: Arin bisa membunuh seseorang yang dia curigai sebagai killer (jika trust sangat rendah)
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 60 }, action: { type: 'trust_kill', desc: '"AKU SUDAH MUAK DENGAN KEBOHONGAN." Arin menyerang orang yang paling dia curigai — apapun konsekuensinya.' }, weight: 20 },
      { condition: { minDeaths: 3, emotion: 'panicked', minTension: 70 }, action: { type: 'trust_kill', desc: 'Paranoia mengambil alih. Arin tidak bisa mempercayai siapapun lagi. "Salah satu dari kalian pasti pembunuh."' }, weight: 18 }
    ],

    // ========== NIKO — The Mastermind (as survivor) ==========
    niko: [
      // Control narrative
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Niko berdiri di tengah ruangan, tersenyum seperti tuan rumah yang sempurna. Tapi matanya menghitung — siapa yang bisa dimanfaatkan.' }, weight: 15 },
      { condition: { emotion: 'calm' }, action: { type: 'plan', desc: 'Niko menyusun rencana. Dia selalu punya rencana B, C, dan D.' }, weight: 18 },

      // Manipulate
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'manipulate', desc: 'Niko berbisik ke satu orang, lalu ke orang lain — menanamkan keraguan tentang satu sama lain.' }, weight: 20 },
      { condition: { emotion: 'suspicious' }, action: { type: 'manipulate', desc: 'Niko membuat "pengakuan" palsu tentang seseorang — cukup meyakinkan untuk membuat kelompok terpecah.' }, weight: 22 },

      // Self-preservation
      { condition: { minDanger: 50, emotion: 'panicked' }, action: { type: 'flee', desc: 'Niko meninggalkan kelompok tanpa kata. Survival of the fittest — dan Niko selalu jadi yang paling fit.' }, weight: 20 },
      { condition: { minDanger: 70 }, action: { type: 'hide', desc: 'Niko menghilang ke ruangan yang hanya dia tahu. Keuntungan menjadi tuan rumah.' }, weight: 22 },

      // Use knowledge of mansion
      { condition: { isAlone: true, chapter: 2 }, action: { type: 'investigate', desc: 'Niko membuka panel rahasia yang hanya keluarganya tahu. Di baliknya — dokumen yang menjelaskan segalanya.' }, weight: 25 },
      { condition: { isAlone: true, chapter: 4 }, action: { type: 'investigate', desc: 'Niko mengakses CCTV lama di ruang kontrol kakeknya. Rekaman menunjukkan siapa yang bergerak malam itu.' }, weight: 20 },

      // Vira relationship
      { condition: { nearbyIncludes: 'vira', minDeaths: 1 }, action: { type: 'socialize', desc: '"Vira... maafkan aku." Untuk pertama kalinya, topeng Niko retak.' }, weight: 15 },

      // Gaslighting
      { condition: { minDeaths: 1, emotion: 'suspicious' }, action: { type: 'manipulate', desc: 'Niko meyakinkan kelompok bahwa kematian itu kecelakaan. "Jangan panik. Ini yang diinginkan dalangnya."' }, weight: 18 },

      // Accusation
      { condition: { minDeaths: 2, hasClue: true }, action: { type: 'accuse', desc: 'Niko mengeluarkan bukti yang dia simpan sejak awal. "Aku sudah tahu sejak tadi. Aku hanya menunggu konfirmasi."' }, weight: 20 },

      // Late game
      { condition: { chapter: 6 }, action: { type: 'confront', desc: 'Niko akhirnya mengungkap semua kartunya. "Cukup bermain-main. Ini yang sebenarnya terjadi."' }, weight: 22 },

      // --- NEW: Movement decisions ---
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Niko bergerak ke ruang kontrol mansion. Rumahnya, keuntungannya.', moveTo: 'basement' }, weight: 16 },
      { condition: { minDeaths: 1, emotion: 'suspicious' }, action: { type: 'move', desc: 'Niko menuju perpustakaan. Di sana ada catatan kakeknya yang belum semua orang lihat.', moveTo: 'perpustakaan' }, weight: 14 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'farah', emotion: 'calm' }, action: { type: 'socialize', desc: '"Farah, keluarga kita punya sejarah panjang. Mungkin sudah saatnya kita bicara jujur." Niko mencoba merekrut Farah.' }, weight: 16 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Lana, novelmu... terlalu akurat. Kau tahu sesuatu yang tidak kau ceritakan." Niko curiga pada Lana.' }, weight: 18 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, aku butuh kau membaca seseorang untukku. Secara profesional." Niko memanfaatkan keahlian Sera.' }, weight: 15 },

      // --- NEW: Desperation ---
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'share_clue', desc: 'Niko membuka brankas rahasia kakeknya. "Ini... ini yang disembunyikan keluargaku selama 50 tahun."' }, weight: 20 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Ini mansionku. Aku tahu setiap lorong, setiap pintu. Ikuti aku \u2014 kita amankan perimeter."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'scout', desc: 'Niko menyusuri lorong rahasia yang hanya keluarganya tahu. Tuan rumah selalu punya keuntungan.' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Niko membuka jalur pelarian melalui terowongan bawah tanah mansion. "Kakekku membangun ini untuk keadaan darurat."' }, weight: 22 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: 'Niko mengatur jebakan di koridor utama. "Rumahku, aturanku. Pembunuh akan melewati sini."' }, weight: 18 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Niko menghilang ke ruangan rahasia, meninggalkan yang lain. Survival of the fittest.' }, weight: 10 },
      // Trust-kill: Niko kalkulatif — membunuh dengan dingin jika trust habis
      { condition: { minDeaths: 2, emotion: 'suspicious', minTension: 50 }, action: { type: 'trust_kill', desc: '"Aku sudah menghitung probabilitasnya. Dan kau terlalu mencurigakan untuk dibiarkan hidup." Niko menyerang dengan presisi dingin.' }, weight: 20 },
      { condition: { minDeaths: 3, emotion: 'hostile' }, action: { type: 'trust_kill', desc: '"Mansionku. Aturanku. Dan kau bukan bagian dari solusinya." Niko mengeliminasi orang yang paling dia curigai.' }, weight: 18 }
    ],

    // ========== SERA — The Profiler ==========
    sera: [
      // Read people
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Sera duduk di sudut, kacamata di tangan, memperhatikan setiap micro-expression. Catatannya sudah terisi setengah.' }, weight: 20 },
      { condition: { emotion: 'calm' }, action: { type: 'observe', desc: 'Sera menganalisis pola perilaku kelompok. Tiga orang menunjukkan tanda kebohongan. Dua lagi menunjukkan ketakutan yang asli.' }, weight: 18 },

      // Profile suspects
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Sera menulis profil: "Subjek menunjukkan flat affect, kurangnya respons empatik, dan tendensi untuk memposisikan diri di dekat exit..."' }, weight: 22 },
      { condition: { emotion: 'suspicious' }, action: { type: 'accuse', desc: 'Sera membaca microexpression seseorang dan langsung tahu: "Kau berbohong. Pupilmu melebar 0.3 milimeter setiap kali kau bicara tentang alibi."' }, weight: 20 },

      // Protect Arin
      { condition: { nearbyIncludes: 'arin', minDanger: 40 }, action: { type: 'guard', desc: 'Sera berdiri di samping Arin. Bukan karena dia kuat — tapi karena dia tidak bisa membayangkan dunia tanpa Arin di dalamnya.' }, weight: 25 },

      // Emotional vulnerability with Arin
      { condition: { nearbyIncludes: 'arin', minDeaths: 2 }, action: { type: 'socialize', desc: 'Sera menggenggam tangan Arin di bawah meja. "Aku... aku tidak bisa menganalisis ini. Aku hanya tahu aku tidak mau kehilanganmu."' }, weight: 18 },

      // Read the room
      { condition: { isAlone: false, chapter: 3 }, action: { type: 'observe', desc: 'Sera memperhatikan dinamika kelompok berubah. Kepercayaan runtuh. Tapi satu orang — satu orang terlalu tenang.' }, weight: 20 },

      // Confront Dimas
      { condition: { nearbyIncludes: 'dimas', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Dimas, tatap mataku." Sera membaca kekosongan di balik senyum sopannya. "Aku tahu apa yang kau sembunyikan."' }, weight: 22 },

      // Share profiling with allies
      { condition: { hasClue: true, nearbyIncludes: 'arin' }, action: { type: 'share_clue', desc: 'Sera menunjukkan catatan profilingnya ke Arin: "Ini daftar tersangka berdasarkan analisis perilaku."', target: 'arin' }, weight: 20 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Sera dan Reza membandingkan catatan. "Kau punya insting polisi. Aku punya data perilaku. Gabungkan."', target: 'reza' }, weight: 15 },

      // Panic
      { condition: { minDanger: 70, emotion: 'panicked' }, action: { type: 'hide', desc: 'Sera berhenti menganalisis. Untuk pertama kalinya, dia hanya lari. Otak yang selalu berpikir akhirnya menyerah pada insting primitif.' }, weight: 18 },

      // Late game revelation
      { condition: { chapter: 5 }, action: { type: 'accuse', desc: 'Sera berdiri di depan kelompok. "Aku sudah cukup mengumpulkan data. Pembunuhnya adalah—"' }, weight: 25 },

      // --- NEW: Movement decisions ---
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Sera bergerak ke tempat yang lebih aman, mencari posisi di mana dia bisa mengamati tanpa terlihat.', moveTo: 'perpustakaan' }, weight: 14 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'juno', emotion: 'calm' }, action: { type: 'socialize', desc: '"Juno, impulsivitasmu bukan kelemahan. Itu insting survival. Tapi kau perlu fokus." Sera menenangkan Juno.' }, weight: 16 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Sera memperhatikan Lana dengan intens. "Narcissistic personality, antisocial tendency, charm yang dipelajari... profil yang sempurna untuk—" Dia terdiam.' }, weight: 20 },
      { condition: { nearbyIncludes: 'farah' }, action: { type: 'socialize', desc: '"Farah, uangmu tidak bisa membeli keselamatan di sini. Tapi informasimu bisa. Apa yang kau tahu tentang keluarga Wardhana?"' }, weight: 14 },
      { condition: { nearbyIncludes: 'kira', hasClue: true }, action: { type: 'share_clue', desc: 'Sera membagi analisis profilingnya dengan Kira. "Gabungkan ini dengan data digitalmu. Pola akan muncul."', target: 'kira' }, weight: 18 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 2, emotion: 'suspicious' }, action: { type: 'confront', desc: 'Sera tidak lagi menganalisis dari kejauhan. "Aku sudah melihat tanda-tandanya. Salah satu dari kita adalah pembunuh. Dan aku tahu siapa."' }, weight: 22 },
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'flee', desc: 'Sera kehilangan ketenangan profesionalnya. Terlalu banyak kematian. "Aku... aku tidak bisa terus menganalisis mayat."' }, weight: 18 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: 'Sera menganalisis pola pembunuhan. "Pembunuh ini predator. Kita harus berpikir seperti mangsa yang cerdas."' }, weight: 20 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'scout', desc: 'Sera mengamati semua orang di ruangan. Profilingnya mencari tanda-tanda predator — micro-expression, postur, pernapasan.' }, weight: 18 },
      { condition: { minDeaths: 2, hasClue: true, isAlone: false }, action: { type: 'rally', desc: '"Aku sudah profil semua orang. Hasilnya mengejutkan. Pembunuh ada di antara kita — dan aku tahu polanya."' }, weight: 22 },
      { condition: { minDanger: 50, isAlone: false }, action: { type: 'ambush', desc: 'Sera menyusun strategi psikologis. "Jangan lari dari predator. Buat dia merasa diburu."' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Sera melihat peluang. Mengorbankan satu orang untuk menyelamatkan dirinya dan Arin. Keputusan yang dingin.' }, weight: 10 },
      // Trust-kill: Sera membaca tanda-tanda dan bertindak jika yakin seseorang berbahaya
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 60 }, action: { type: 'trust_kill', desc: '"Profilmu konsisten dengan seorang pembunuh. Maaf — tapi aku tidak bisa mengambil risiko." Sera bertindak berdasarkan analisisnya.' }, weight: 18 }
    ],

    // ========== JUNO — The Rebel ==========
    juno: [
      // Impulsive action
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Juno mondar-mandir seperti hewan yang dikurung. "Ini bullshit. Seseorang jelaskan apa yang terjadi SEKARANG."' }, weight: 15 },
      { condition: { emotion: 'calm' }, action: { type: 'investigate', desc: 'Juno memeriksa semua jendela dan pintu. "Kalau ada jalan masuk, ada jalan keluar. Basic logic."' }, weight: 18 },

      // Confront everyone
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'confront', desc: 'Juno mendorong meja. "STOP WHISPERING. Kalau ada yang mau bilang sesuatu, bilang ke muka gue!"' }, weight: 22 },
      { condition: { emotion: 'suspicious' }, action: { type: 'confront', desc: 'Juno menarik kerah seseorang. "Gue udah muak sama muka sok innocent lo. NGOMONG."' }, weight: 25 },

      // Protect Sera
      { condition: { nearbyIncludes: 'sera', minDanger: 30 }, action: { type: 'guard', desc: 'Juno menempatkan diri di depan Sera. "Lo harus lewatin gue dulu." Posesif, protektif, absolut.' }, weight: 25 },

      // Direct action
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Juno mendobrak pintu yang terkunci. Subtlety is overrated.' }, weight: 20 },
      { condition: { emotion: 'hostile' }, action: { type: 'attack', desc: 'Juno meraih benda terdekat sebagai senjata. "Gue nggak peduli siapa lo. Lo ancam temen gue, lo mati."' }, weight: 22 },

      // Reza connection
      { condition: { nearbyIncludes: 'reza', minDeaths: 1 }, action: { type: 'socialize', desc: 'Juno duduk di samping Reza. Diam. Tapi tangannya menyentuh lengan Reza, dan untuk sesaat, kemarahan mereda.' }, weight: 15 },

      // Action over words
      { condition: { minDeaths: 2 }, action: { type: 'investigate', desc: 'Juno berhenti bicara dan mulai bertindak. Memeriksa setiap ruangan, mencari jejak. Insting jalanan lebih berguna dari debat.' }, weight: 20 },

      // Escape attempt
      { condition: { chapter: 4, emotion: 'panicked' }, action: { type: 'flee', desc: 'Juno berlari ke jendela terdekat dan mencoba memecahkannya. "KITA KELUAR SEKARANG!"' }, weight: 18 },

      // Late game
      { condition: { chapter: 6, emotion: 'hostile' }, action: { type: 'confront', desc: '"Sini lo." Juno sudah tidak takut. Yang tersisa hanya kemarahan dan tekad untuk bertahan hidup.' }, weight: 25 },

      // --- NEW: Movement ---
      { condition: { emotion: 'hostile', isAlone: true }, action: { type: 'move', desc: 'Juno bergerak agresif menyusuri mansion, mencari konfrontasi langsung.', moveTo: 'koridor_utara' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'arin', emotion: 'wary' }, action: { type: 'socialize', desc: '"Arin, lo selalu nyari bukti. Kadang bukti itu di depan mata — cuma butuh orang yang berani ngambil." Juno mendorong Arin bertindak.' }, weight: 14 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Dimas, lo terlalu tenang buat situasi kayak gini. KENAPA lo nggak takut?!" Juno menuduh Dimas.' }, weight: 20 },
      { condition: { nearbyIncludes: 'niko', minDeaths: 1 }, action: { type: 'confront', desc: '"Niko! Ini rumah lo! Lo BERTANGGUNG JAWAB atas semua yang terjadi di sini!" Juno mengamuk.' }, weight: 18 },
      { condition: { nearbyIncludes: 'vira', emotion: 'calm' }, action: { type: 'socialize', desc: '"Vira, gue respect lo. Lo selamat dari sini sekali. Ajarin gue caranya." Sisi lembut Juno yang jarang muncul.' }, weight: 12 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 3, emotion: 'hostile' }, action: { type: 'guard', desc: 'Juno mengambil posisi di depan kelompok. "Gue nggak akan diam lagi. Siapapun yang datang lewat pintu itu mati."' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'ambush', desc: 'Juno menyiapkan penyergapan. "Gue tau dia bakal lewat sini. Gue tunggu di sini. Lo siap?"' }, weight: 20 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'coordinate_defense', desc: '"STOP PANIK. Gue punya rencana. Lo jaga pintu, gue hadang dari sini. SEKARANG!" Juno memimpin pertahanan.' }, weight: 18 },
      { condition: { isAlone: true, minDanger: 50 }, action: { type: 'scout', desc: 'Juno bergerak tanpa suara — insting jalanan mengajarkan cara bergerak di kegelapan tanpa terdeteksi.' }, weight: 16 },
      { condition: { minDeaths: 2, emotion: 'hostile' }, action: { type: 'secure_exit', desc: 'Juno mencoba memecahkan jendela, mendobrak pintu — mencari jalan keluar dengan cara kasar.' }, weight: 18 },
      { condition: { minDeaths: 4, emotion: 'hostile' }, action: { type: 'betray', desc: 'Juno tidak mau mati untuk orang asing. "Sorry. Gue keluar sendiri. Selamat tinggal."' }, weight: 12 },
      // Trust-kill: Juno yang impulsif — paling mungkin membunuh karena ketidakpercayaan
      { condition: { minDeaths: 1, emotion: 'suspicious', minTension: 40 }, action: { type: 'trust_kill', desc: '"GUE UDAH TAU LO DALANGNYA!" Juno menyerang tanpa pikir panjang — impulsif dan mematikan.' }, weight: 22 },
      { condition: { minDeaths: 2, emotion: 'hostile' }, action: { type: 'trust_kill', desc: 'Juno meledak. "GUE NGGAK PERCAYA SIAPAPUN DI SINI." Tinju melayang sebelum siapapun sempat bereaksi.' }, weight: 24 },
      { condition: { minDeaths: 1, emotion: 'panicked' }, action: { type: 'trust_kill', desc: 'Ketakutan berubah jadi kemarahan. Juno menyerang orang terdekat. "LO PASTI SALAH SATUNYA!"' }, weight: 20 }
    ],

    // ========== VIRA — The Survivor ==========
    vira: [
      // Cryptic knowledge
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Vira berdiri di sudut terjauh. Matanya menyapu ruangan — bukan melihat orang, tapi melihat bangunan. Dia tahu di mana pintu rahasia tersembunyi.' }, weight: 18 },

      // Use mansion knowledge
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Vira menyentuh dinding dengan familiaritas. "Ada ruangan di balik sini. Aku pernah—" Dia berhenti. Kenangan terlalu menyakitkan.' }, weight: 20 },
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Vira membuka lorong rahasia yang hanya dia tahu. Enam bulan lalu, lorong ini menyelamatkan hidupnya.' }, weight: 22 },

      // PTSD episodes
      { condition: { minDanger: 50 }, action: { type: 'hide', desc: 'Flashback. Vira membeku — enam bulan lalu kembali dalam gelombang. Napasnya tersendat. Trauma yang tidak pernah sembuh.' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'flee', desc: 'Vira berlari ke lorong rahasia. Tubuhnya ingat jalan keluar meskipun pikirannya tidak.' }, weight: 25 },

      // Niko relationship
      { condition: { nearbyIncludes: 'niko', emotion: 'calm' }, action: { type: 'observe', desc: 'Vira menatap Niko dari kejauhan. Pria yang dulu dia cintai. Pria yang membuangnya. Dan sekarang — pria yang mungkin tahu lebih banyak dari yang dia tunjukkan.' }, weight: 15 },
      { condition: { nearbyIncludes: 'niko', minDeaths: 2 }, action: { type: 'confront', desc: '"Niko. Kau tahu mansion ini sama baiknya denganku. BERHENTI BERPURA-PURA."' }, weight: 20 },

      // Guide others
      { condition: { isAlone: false, minDeaths: 1 }, action: { type: 'socialize', desc: '"Ikut aku. Aku tahu tempat yang aman di mansion ini." Vira memimpin kelompok kecil melalui lorong tersembunyi.' }, weight: 18 },

      // Share survival knowledge
      { condition: { hasClue: true }, action: { type: 'share_clue', desc: 'Vira akhirnya bicara: "Enam bulan lalu, aku hampir mati di sini. Ini yang aku tahu tentang sang dalang..."' }, weight: 20 },

      // Late game
      { condition: { chapter: 5 }, action: { type: 'investigate', desc: 'Vira kembali ke tempat di mana dia hampir mati enam bulan lalu. Kali ini, dengan tekad berbeda.' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'move', desc: 'Vira berlari ke lorong rahasia yang hanya dia tahu. Tubuhnya mengingat jalan meskipun pikirannya chaos.', moveTo: 'lorong_rahasia' }, weight: 20 },
      { condition: { emotion: 'calm', chapter: 3 }, action: { type: 'move', desc: 'Vira memimpin kelompok kecil melalui jalan tersembunyi di dinding mansion.', moveTo: 'bunker_b3' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'arin', emotion: 'calm' }, action: { type: 'socialize', desc: '"Arin, aku percaya padamu. Kau mengingatkanku pada diriku sendiri enam bulan lalu — sebelum semuanya berubah." Vira terbuka.' }, weight: 16 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, baca aku. Aku serius. Kalau kau bisa melihat kebohongan, kau akan tahu aku tidak berbohong tentang apa yang terjadi dulu."' }, weight: 14 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Lana. Aku membaca novelmu. Bab 17 — itu bukan fiksi, kan? Kau di sini malam itu." Vira tahu lebih dari yang dia tunjukkan.' }, weight: 20 },

      // --- NEW: Desperation ---
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'share_clue', desc: 'Vira akhirnya mengungkap semua yang dia tahu tentang malam enam bulan lalu. "Dengarkan baik-baik, karena aku tidak akan mengulanginya."' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Aku tahu mansion ini. Ikuti aku ke tempat yang aman — ada ruangan yang tidak bisa ditembus."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'scout', desc: 'Vira menyusuri lorong rahasia, tubuhnya mengingat setiap belokan dari enam bulan lalu.' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Vira membuka jalur pelarian tersembunyi. "Ada jalan keluar yang tidak diketahui siapapun. Lewat sini."' }, weight: 22 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'ambush', desc: 'Vira mengatur jebakan di lorong rahasia. "Dia pasti lewat sini. Aku tahu cara berpikirnya."' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Vira menutup pintu lorong rahasia — dari dalam. "Maaf. Aku sudah pernah hampir mati. Tidak lagi."' }, weight: 12 },
      // Trust-kill: Vira yang sudah trauma — bertindak defensif jika merasa terancam
      { condition: { minDeaths: 2, emotion: 'panicked', minTension: 55 }, action: { type: 'trust_kill', desc: '"Aku sudah pernah hampir mati di sini. TIDAK LAGI." Vira menyerang orang yang paling dia curigai — insting bertahan hidup yang gelap.' }, weight: 18 }
    ],

    // ========== REZA — The Detective ==========
    reza: [
      // Professional investigation
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Reza berdiri di pinggir, tangan di saku. Dua puluh tahun insting polisi tidak pernah padam. Matanya sudah membaca tiga ancaman potensial.' }, weight: 18 },
      { condition: { emotion: 'calm' }, action: { type: 'investigate', desc: 'Reza memeriksa pintu dan jendela secara sistematis. "Standard procedure. Identifikasi exit points dulu."' }, weight: 20 },

      // Tactical assessment
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Reza mengeluarkan notepad kecilnya. "Timeline. Siapa di mana, kapan. Ini dasar investigasi."' }, weight: 22 },
      { condition: { emotion: 'suspicious' }, action: { type: 'question', desc: 'Reza menginterogasi seseorang dengan teknik polisi. "Ceritakan lagi dari awal. Pelan-pelan. Detail."' }, weight: 20 },

      // Protect the group
      { condition: { isAlone: false, minDanger: 40 }, action: { type: 'guard', desc: 'Reza memposisikan diri di pintu. "Tidak ada yang keluar atau masuk tanpa melewati aku." Veteran yang kembali ke mode operasi.' }, weight: 22 },

      // Perimeter check
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Reza melakukan sweep perimeter. Taktis. Methodis. Setiap ruangan diperiksa seperti crime scene.' }, weight: 20 },

      // Negotiate
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'socialize', desc: '"Dengar. Kita bisa saling curiga sampai pagi, atau kita bisa bekerja sama. Aku sudah lihat apa yang terjadi kalau kelompok terpecah."' }, weight: 18 },

      // Juno connection
      { condition: { nearbyIncludes: 'juno', minDeaths: 1 }, action: { type: 'socialize', desc: 'Reza dan Juno berdiri berdampingan. Yang satu tenang, yang satu berapi-api. Entah kenapa, kombinasi ini bekerja.' }, weight: 15 },

      // Confront killer
      { condition: { minDeaths: 2, hasClue: true }, action: { type: 'accuse', desc: 'Reza mengeluarkan semua bukti. "Aku sudah menyusun kasus. Pelakunya jelas." Suara detektif yang tidak pernah benar-benar pensiun.' }, weight: 25 },

      // Late game
      { condition: { chapter: 6 }, action: { type: 'guard', desc: 'Reza menjadi benteng terakhir kelompok. "Aku tidak akan kehilangan siapapun lagi malam ini."' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'move', desc: 'Reza melakukan patroli perimeter. Kebiasaan lama tidak pernah mati.', moveTo: 'koridor_utara' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'kira', hasClue: true }, action: { type: 'share_clue', desc: '"Kira, cross-reference data digitalmu dengan bukti fisik ini. Aku butuh timeline yang akurat." Reza dan Kira berkolaborasi.', target: 'kira' }, weight: 18 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'suspicious' }, action: { type: 'question', desc: '"Dimas, kau memeriksa tubuh tadi dengan terlalu... nyaman. Jelaskan padaku." Reza menginterogasi Dimas.' }, weight: 20 },
      { condition: { nearbyIncludes: 'arin', emotion: 'wary' }, action: { type: 'socialize', desc: '"Arin, kau jurnalis investigasi. Aku butuh partnerku yang dulu. Bantu aku memecahkan ini." Reza merekrut Arin.' }, weight: 14 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 3, hasClue: true }, action: { type: 'accuse', desc: 'Reza memasang wajah detektifnya. "Cukup. Aku sudah menyusun semua bukti. Pembunuhnya di antara kita — dan aku tahu siapa."' }, weight: 24 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Dengar. Aku sudah handle kasus pembunuhan berantai. Ini protokolnya — buddy system, jangan sendirian, jaga semua exit."' }, weight: 22 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'scout', desc: 'Reza melakukan sweep taktis — ruang per ruang, sudut per sudut. Dua puluh tahun kebiasaan polisi.' }, weight: 18 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: 'Reza menyiapkan penyergapan di bottleneck mansion. "Di sini. Kalau dia lewat, kita tangkap."' }, weight: 20 },
      { condition: { minDanger: 50, isAlone: false }, action: { type: 'secure_exit', desc: 'Reza mengamankan jalur evakuasi. "Standard procedure — selalu punya rencana mundur."' }, weight: 16 },
      { condition: { minDeaths: 2, isAlone: false }, action: { type: 'rally', desc: '"SEMUA BERKUMPUL. Kita buat perimeter. Tidak ada yang bergerak sendirian mulai sekarang."' }, weight: 20 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Reza mempertimbangkan opsi terburuk. Mengorbankan satu orang sebagai umpan. Keputusan yang hanya bisa diambil veteran.' }, weight: 8 },
      // Trust-kill: Reza detektif — jika bukti cukup kuat, dia "mengeksekusi" tersangka utama
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 55 }, action: { type: 'trust_kill', desc: '"Bukti cukup. Aku tidak butuh pengadilan di sini." Reza mengeksekusi keadilan sendiri — detektif yang sudah melampaui batas hukum.' }, weight: 18 },
      { condition: { minDeaths: 3, emotion: 'suspicious', minTension: 65 }, action: { type: 'trust_kill', desc: 'Reza menarik napas. Dua puluh tahun di kepolisian mengajarkan satu hal: kadang kau harus bertindak sebelum bukti lengkap. Dan malam ini... dia bertindak.' }, weight: 16 }
    ],

    // ========== LANA — The Puppeteer (as survivor, if not killer) ==========
    lana: [
      // Manipulate from shadows
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Lana tersenyum. Ini semua terlalu familiar — seperti plot dari novel terbarunya. Atau mungkin... persis seperti plot dari novel terbarunya.' }, weight: 18 },
      { condition: { emotion: 'calm' }, action: { type: 'manipulate', desc: 'Lana berbisik ke satu orang, lalu ke yang lain. Menanam keraguan seperti benih — pelan, teliti, mematikan.' }, weight: 22 },

      // Seductive manipulation
      { condition: { nearbyIncludes: 'niko' }, action: { type: 'manipulate', desc: 'Lana bersandar ke Niko. "Kau tahu, kita bisa bekerja sama... secara dekat." Matanya mengatakan satu hal, pikirannya menghitung yang lain.' }, weight: 20 },
      { condition: { nearbyIncludes: 'dimas' }, action: { type: 'socialize', desc: 'Lana dan Dimas bertukar pandang. Komunikasi tanpa kata — dua orang yang berbagi kegelapan.' }, weight: 18 },

      // Create chaos
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'manipulate', desc: 'Lana "tidak sengaja" menyebut rahasia seseorang. Kelompok meledak. Persis seperti yang dia inginkan.' }, weight: 25 },

      // Self-preservation mode
      { condition: { minDanger: 60 }, action: { type: 'hide', desc: 'Lana menghilang. Penulis yang tahu kapan harus menutup buku dan lari dari ceritanya sendiri.' }, weight: 20 },

      // Frame others
      { condition: { minDeaths: 1 }, action: { type: 'frame', desc: 'Lana menempatkan bukti palsu di tempat yang tepat. Plot twist — di novel dan di kehidupan nyata.' }, weight: 22 },

      // Provoke conflict
      { condition: { isAlone: false, minDeaths: 2 }, action: { type: 'confront', desc: '"Menarik." Lana memiringkan kepala. "Kematian selalu mengungkap sisi terburuk manusia. Sekarang, siapa yang berikutnya?"' }, weight: 20 },

      // Late game
      { condition: { chapter: 5 }, action: { type: 'manipulate', desc: 'Lana mengatur final act-nya. Setiap orang di mansion ini adalah karakter dalam novelnya — dan dia yang menulis endingnya.' }, weight: 22 },

      // --- Tactical survivor Lana ---
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'distract', desc: 'Lana membuat distraksi — menjatuhkan vas antik dengan "tidak sengaja". Semua menoleh. Persis seperti yang dia rencanakan.' }, weight: 18 },
      { condition: { minDeaths: 2, emotion: 'panicked' }, action: { type: 'coordinate_defense', desc: '"Dengarkan aku. Aku tahu cara berpikir seperti pembunuh — aku menulisnya." Lana memimpin strategi pertahanan.' }, weight: 20 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Lana menuju lorong yang sepi. Keahliannya membaca narasi membawanya ke tempat yang belum dijelajahi.', moveTo: 'lorong_rahasia' }, weight: 14 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, gabungkan profilingmu dengan intuisi naratifku. Pembunuh ini punya pola — dan aku tahu pola cerita."' }, weight: 16 },
      // Trust-kill: Lana manipulatif — membunuh sambil berpura-pura itu self-defense
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 50 }, action: { type: 'trust_kill', desc: '"Kau plot twist terburuk dalam ceritaku." Lana menyerang dengan tenang — membunuh sambil tersenyum. "Self-defense, tentu saja."' }, weight: 20 }
    ],

    // ========== DIMAS — The Operator (as survivor, if not killer) ==========
    dimas: [
      // Cold observation
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Dimas berdiri diam. Terlalu diam. Matanya menyapu ruangan dengan presisi klinis — bukan mencari teman, tapi menghitung probabilitas survival.' }, weight: 18 },
      { condition: { emotion: 'calm' }, action: { type: 'observe', desc: 'Dimas mengamati reaksi setiap orang terhadap stres. Data. Semua hanya data.' }, weight: 20 },

      // Forensic knowledge
      { condition: { minDeaths: 1 }, action: { type: 'investigate', desc: 'Dimas memeriksa tubuh dengan ketenangan yang mengganggu. "Waktu kematian, pola luka — ini bukan random. Ini presisi."' }, weight: 25 },

      // Obsession with Sera
      { condition: { nearbyIncludes: 'sera', emotion: 'calm' }, action: { type: 'observe', desc: 'Dimas memperhatikan Sera. Terlalu lama. Terlalu intens. Ada sesuatu di matanya yang bukan kekaguman — lebih dekat ke obsesi.' }, weight: 18 },
      { condition: { nearbyIncludes: 'sera', emotion: 'suspicious' }, action: { type: 'socialize', desc: '"Sera, analisismu tentang group dynamics sangat akurat. Aku kagum." Senyumnya terlalu sempurna. Terlalu dingin.' }, weight: 15 },

      // Follow Lana
      { condition: { nearbyIncludes: 'lana' }, action: { type: 'socialize', desc: 'Dimas berdiri di samping Lana. Selalu. Seperti bayangan yang setia — atau anjing yang terlatih.' }, weight: 20 },

      // Use medical knowledge
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Dimas memeriksa obat-obatan di lemari mansion. Pengetahuan farmakologisnya memberi keuntungan yang tidak dimiliki orang lain.' }, weight: 20 },

      // Unnerving calm
      { condition: { minDanger: 50 }, action: { type: 'observe', desc: 'Sementara orang lain panik, Dimas tetap tenang. Ketenangan yang bukan keberanian — tapi sesuatu yang lebih dingin.' }, weight: 18 },

      // Late game
      { condition: { chapter: 5 }, action: { type: 'investigate', desc: 'Dimas menganalisis semua kematian secara klinis. "Pola ini konsisten dengan satu profil psikologis. Aku tahu siapa dalangnya."' }, weight: 22 },

      // --- Tactical survivor Dimas ---
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'move', desc: 'Dimas bergerak dengan tenang ke lokasi strategis. Pengetahuan forensiknya mengajarkan pentingnya posisi.', moveTo: 'basement' }, weight: 14 },
      { condition: { minDeaths: 2, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: '"Reza, lihat pola lukanya. Aku tahu jenis senjata yang dipakai — dan siapa yang punya akses."', target: 'reza' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'barricade', desc: 'Dimas menutup dan mengunci pintu dengan presisi klinis. "Pintu ini tidak akan terbuka dari luar."' }, weight: 18 },
      { condition: { minDeaths: 3, hasClue: true }, action: { type: 'accuse', desc: 'Dimas berdiri tenang. "Berdasarkan analisis forensik — waktu kematian, senjata, akses — pelakunya sudah jelas."' }, weight: 22 },
      { condition: { nearbyIncludes: 'arin', hasClue: true }, action: { type: 'share_clue', desc: '"Arin, sebagai jurnalis kau perlu fakta forensik ini. Ini bukti fisik yang tak terbantahkan."', target: 'arin' }, weight: 16 },
      // Trust-kill: Dimas yang klinis — membunuh berdasarkan "analisis forensik" yang salah sasaran
      { condition: { minDeaths: 2, emotion: 'suspicious', minTension: 55 }, action: { type: 'trust_kill', desc: '"Pola luka, metode, timing — analisis forensikku menunjuk padamu." Dimas bertindak dengan presisi klinis — tapi kali ini salah sasaran.' }, weight: 18 }
    ],

    // ========== KIRA — The Hacker ==========
    kira: [
      // Digital investigation
      { condition: { chapter: 0 }, action: { type: 'investigate', desc: 'Kira mengeluarkan laptop kecilnya. "Wi-Fi mansion ini punya arsitektur aneh. Ada subnet tersembunyi yang—" Matanya melebar.' }, weight: 20 },
      { condition: { emotion: 'calm' }, action: { type: 'investigate', desc: 'Kira meng-scan jaringan internal mansion. Kamera CCTV, speaker system, door locks — semuanya terhubung ke satu server.' }, weight: 22 },

      // Hack systems
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Kira berhasil mengakses log CCTV. "Guys... ada rekaman yang dihapus. Tapi tidak ada yang benar-benar terhapus dari hard drive."' }, weight: 25 },
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Kira menemukan server room tersembunyi di basement. Di dalamnya — database dengan nama semua tamu. File dibuat enam bulan lalu.' }, weight: 22 },

      // Paranoia
      { condition: { minDanger: 40 }, action: { type: 'hide', desc: 'Kira memutus semua koneksi dan bersembunyi. "Kalau sistem mansion bisa dilacak, aku juga bisa dilacak."' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'flee', desc: 'Kira berlari ke server room — satu-satunya tempat di mana dia merasa punya kontrol.' }, weight: 18 },

      // Share digital evidence
      { condition: { hasClue: true, nearbyIncludes: 'arin' }, action: { type: 'share_clue', desc: 'Kira menunjukkan layar laptopnya ke Arin: "Lihat email ini. Seseorang merencanakan malam ini berbulan-bulan yang lalu."', target: 'arin' }, weight: 22 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Kira memperlihatkan rekaman CCTV ke Reza. "Ini bukti digital. Tidak bisa dibantah."', target: 'reza' }, weight: 18 },

      // Disable traps
      { condition: { chapter: 4 }, action: { type: 'investigate', desc: 'Kira meng-hack door lock system mansion. "Aku bisa membuka semua pintu... atau mengunci semuanya. Pilihan kita."' }, weight: 22 },

      // Late game
      { condition: { chapter: 6 }, action: { type: 'investigate', desc: 'Kira menemukan pesan terenkripsi terakhir di server. Ketika di-decrypt, isinya mengubah segalanya.' }, weight: 25 },

      // --- NEW: Movement ---
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Kira bergerak ke basement mencari server room. "Semua jawaban ada di data."', moveTo: 'basement' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'niko' }, action: { type: 'question', desc: '"Niko, siapa yang memasang Wi-Fi mesh di mansion ini? Arsitekturnya terlalu canggih untuk rumah tua." Kira curiga pada infrastruktur mansion.' }, weight: 18 },
      { condition: { nearbyIncludes: 'sera', hasClue: true }, action: { type: 'share_clue', desc: '"Sera, lihat metadata foto ini. Timestamp-nya diedit. Seseorang sengaja memalsukan alibi digital."', target: 'sera' }, weight: 20 },
      { condition: { nearbyIncludes: 'farah' }, action: { type: 'socialize', desc: '"Farah, aku hack email keluargamu. Jangan marah — tapi kakekmu transfer dana ke rekening yang sama dengan pemilik mansion ini."' }, weight: 16 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 2, hasClue: true }, action: { type: 'accuse', desc: 'Kira menunjukkan layar laptop: "Lihat log CCTV yang di-recover. Timestamp. Lokasi. Identitas. Game over untuk pembunuh."' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Aku bisa hack sistem door lock. Kita kunci semua pintu kecuali exit utama. Pembunuh terjebak."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'scout', desc: 'Kira menggunakan remote access ke CCTV untuk mengintai pergerakan di seluruh mansion dari laptopnya.' }, weight: 18 },
      { condition: { emotion: 'panicked' }, action: { type: 'secure_exit', desc: 'Kira meng-hack door lock system. "Semua pintu keluar terbuka. SEKARANG LARI!"' }, weight: 20 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'ambush', desc: 'Kira memasang trip-wire digital di koridor — alarm otomatis jika seseorang lewat.' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Kira mengunci semua pintu dari laptop — termasuk pintu yang mengurung temannya. "Maaf. Aku butuh waktu."' }, weight: 10 },
      // Trust-kill: Kira paranoid — menyerang jika data "membuktikan" seseorang berbahaya
      { condition: { minDeaths: 2, emotion: 'panicked', minTension: 60 }, action: { type: 'trust_kill', desc: '"Data tidak bohong. Log CCTV, posisi GPS, timeline — semuanya menunjuk ke kau." Kira menyerang berdasarkan bukti digitalnya.' }, weight: 16 }
    ],

    // ========== FARAH — The Heiress ==========
    farah: [
      // Self-preservation
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Farah duduk di sofa termahal, tangan mencengkeram clutch bag-nya. Setiap insting pewaris berteriak: ini bukan tempat yang aman.' }, weight: 15 },
      { condition: { emotion: 'calm' }, action: { type: 'socialize', desc: '"Aku bisa membayar helikopter untuk membawa kita keluar. Siapa yang punya sinyal?" Farah mencoba membeli jalan keluar.' }, weight: 18 },

      // Money talks (fails)
      { condition: { emotion: 'wary' }, action: { type: 'negotiate', desc: 'Farah menawarkan uang untuk informasi. "Aku akan membayar siapa saja yang memberitahuku siapa dalangnya. Berapa pun."' }, weight: 20 },
      { condition: { minDeaths: 1 }, action: { type: 'negotiate', desc: '"BERAPA YANG KAU MAU?" Farah mengeluarkan kartu kredit black card. Di dunianya, segalanya bisa dibeli. Tapi kematian menolak negosiasi.' }, weight: 18 },

      // Hide in safe room
      { condition: { emotion: 'panicked' }, action: { type: 'hide', desc: 'Farah berlari ke safe room keluarga Aldridge. Ruangan berlapisan baja yang dibangun kakeknya — satu-satunya warisan yang berguna malam ini.' }, weight: 25 },
      { condition: { minDanger: 50 }, action: { type: 'hide', desc: 'Farah mengunci diri di kamar atas. "Aku tidak keluar sampai ini selesai." Survival strategy pewaris — biarkan orang lain mengambil risiko.' }, weight: 22 },

      // Family secrets
      { condition: { isAlone: true, chapter: 3 }, action: { type: 'investigate', desc: 'Farah menemukan brankas keluarga Aldridge. Di dalamnya — surat-surat yang menghubungkan keluarganya dengan mansion ini 50 tahun lalu.' }, weight: 22 },
      { condition: { hasClue: true }, action: { type: 'observe', desc: 'Farah membaca dokumen keluarga dengan tangan gemetar. Kakeknya membiayai pembangunan mansion ini. Dan alasannya... mengerikan.' }, weight: 20 },

      // Egois tapi eventually helpful
      { condition: { minDeaths: 3 }, action: { type: 'share_clue', desc: '"Baiklah. Aku akan bicara." Farah akhirnya mengungkap rahasia keluarganya. "Kakekku tahu tentang mansion ini. Dan ini yang dia sembunyikan."' }, weight: 20 },

      // Late game
      { condition: { chapter: 6 }, action: { type: 'negotiate', desc: 'Farah membuat penawaran terakhir: "Aku tahu siapa pemilik asli mansion ini. Informasi ini berharga — tapi aku akan memberikannya gratis. Karena tidak ada gunanya kaya kalau kau mati."' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'move', desc: 'Farah berlari ke kamar atas, mencari safe room keluarga Aldridge.', moveTo: 'kamar_atas' }, weight: 18 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'niko', emotion: 'calm' }, action: { type: 'negotiate', desc: '"Niko, keluarga kita terikat oleh mansion ini. Aku punya dokumen yang membuktikannya. Ayo bekerja sama."' }, weight: 16 },
      { condition: { nearbyIncludes: 'reza', minDeaths: 1 }, action: { type: 'socialize', desc: '"Detektif Reza. Aku akan memberikan semua informasi keluargaku. Tapi jaga aku tetap hidup. Deal?" Farah bernegosiasi.' }, weight: 14 },
      { condition: { nearbyIncludes: 'kira' }, action: { type: 'socialize', desc: '"Kira, aku butuh kau menghapus sesuatu dari server mansion. Rahasia keluargaku tidak boleh bocor." Farah panik tentang reputasi.' }, weight: 16 },

      // --- NEW: Escalation & character growth ---
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'guard', desc: 'Farah meraih tongkat golf antik dari dinding. Untuk pertama kalinya dalam hidupnya, pewaris ini siap bertarung sendiri.' }, weight: 20 },
      { condition: { minDeaths: 4 }, action: { type: 'share_clue', desc: '"Aku sudah tidak peduli dengan reputasi. Kakekku mendanai pembangunan mansion ini untuk eksperimen. INI yang dia sembunyikan." Farah mengungkap segalanya.' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Dengar, keluargaku membangun safe room di mansion ini. Kita semua pindah ke sana. Sekarang."' }, weight: 20 },
      { condition: { minDanger: 50, isAlone: false }, action: { type: 'secure_exit', desc: 'Farah membuka brankas keluarga. Di dalamnya — kunci master semua pintu mansion. "Warisan yang akhirnya berguna."' }, weight: 22 },
      { condition: { emotion: 'suspicious', nearbyIncludes: 'reza' }, action: { type: 'rally', desc: '"Reza, aku punya pengaruh. Kau punya otak. Gabungkan. Kumpulkan semua orang — aku yang tanggung biayanya."' }, weight: 16 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'scout', desc: 'Farah menyusuri lorong yang dibangun kakeknya. Pewaris yang akhirnya menggunakan pengetahuan keluarganya.' }, weight: 14 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Farah masuk ke safe room dan mengunci pintu dari dalam. "Maaf. Uang tidak bisa membeli keberanian."' }, weight: 12 },
      // Trust-kill: Farah yang ketakutan — menyerang jika merasa nyawanya terancam
      { condition: { minDeaths: 3, emotion: 'panicked', minTension: 65 }, action: { type: 'trust_kill', desc: '"JANGAN MENDEKAT!" Farah meraih tongkat golf dan menyerang. Ketakutan mengubah pewaris menjadi pembunuh.' }, weight: 14 }
    ]
  };

  // ---- Killer-Specific Decision Trees ----
  // These override the survivor trees when the character IS a killer

  const KILLER_TREES = {
    lana: [
      // === FASE AWAL: Maintain cover ===
      { condition: { emotion: 'stalking', chapter: 0 }, action: { type: 'maintain_cover', desc: 'Lana memainkan perannya sempurna — novelis eksentrik yang ketakutan. Aktingnya tanpa celah.' }, weight: 20 },
      { condition: { emotion: 'stalking', isAlone: true }, action: { type: 'plan', desc: 'Lana meninjau naskahnya. Korban berikutnya sudah dipilih. Yang tersisa: timing dan metode.' }, weight: 18 },

      // === SIASAT: Memecah kelompok survivor (KUNCI STRATEGI) ===
      { condition: { emotion: 'stalking', isAlone: false, minDeaths: 0 }, action: { type: 'manipulate', desc: 'Lana menanam benih ketidakpercayaan. Berbisik tentang satu orang ke orang lain — jaring laba-laba yang tak terlihat.' }, weight: 22 },
      { condition: { emotion: 'stalking', isAlone: false, minDeaths: 1 }, action: { type: 'divide', desc: '"Kita harus berpencar untuk efisiensi." Lana memecah kelompok secara halus — domba dipisahkan dari kawanan.' }, weight: 28 },
      { condition: { isAlone: false, minDeaths: 0 }, action: { type: 'divide', desc: '"Aku dengar sesuatu di Galeri Timur. Sebagian dari kita harus cek." Lana memecah kawanan.' }, weight: 24 },
      { condition: { isAlone: false }, action: { type: 'distract', desc: 'Lana membuat drama kecil — menangis, histeria palsu — untuk mengalihkan perhatian saat rekannya bergerak.' }, weight: 20 },

      // === HUNTING: Isolasi target, jebak, posisikan diri ===
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'isolate', desc: '"Siapa yang mau cek Galeri Timur?" Lana memisahkan target dari kawanan — predator yang sabar.' }, weight: 25 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'trap', desc: 'Lana menyiapkan perangkap di koridor gelap. Penulis yang tahu persis bagaimana ceritanya harus berakhir.' }, weight: 22 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'move', desc: 'Lana berpindah ke posisi strategis — dekat target berikutnya, jauh dari saksi.' }, weight: 18 },

      // === Koordinasi dengan Dimas ===
      { condition: { nearbyIncludes: 'dimas', emotion: 'stalking' }, action: { type: 'plan', desc: 'Lana memberi instruksi ke Dimas lewat kode. "Bab selanjutnya dimulai sekarang."' }, weight: 20 },

      // === KILL: HANYA saat sendirian dengan 1 target ===
      { condition: { emotion: 'executing', isAlone: false }, action: { type: 'eliminate', desc: 'Lana bergerak dengan presisi novelis yang mengeksekusi plot twist-nya sendiri. Sempurna. Mematikan.' }, weight: 30 },

      // === COVER UP ===
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'frame', desc: 'Lana "menemukan" bukti yang menunjuk ke orang lain. "Ya Tuhan, lihat ini..." Aktris terbaik.' }, weight: 25 },
      { condition: { minDeaths: 2, isAlone: false }, action: { type: 'maintain_cover', desc: 'Lana menangis tersedu. "Aku takut..." Akting Oscar-worthy yang menyembunyikan predator di baliknya.' }, weight: 20 },

      // === TERDESAK: Berkhianat pada killer lain ===
      { condition: { minTension: 60, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: '"Dimas menjadi beban." Lana merencanakan mengekspos Dimas demi keselamatannya sendiri.', target: 'dimas' }, weight: 26 },
      { condition: { minTension: 70, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Lana meninggalkan bukti mengarah ke Niko. "Tuan rumah selalu tersangka pertama."', target: 'niko' }, weight: 24 },
      { condition: { emotion: 'executing', minTension: 80 }, action: { type: 'flee', desc: 'Topeng jatuh. Lana berjalan pergi dengan anggun. "Setiap cerita butuh villain."' }, weight: 20 },

      // === LATE GAME: Fokus isolasi dan eksekusi ===
      { condition: { chapter: 5, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Late game. Lana memecah kelompok survivor yang tersisa — isolasi sebelum eksekusi.' }, weight: 28 },
      { condition: { chapter: 5, minDeaths: 2 }, action: { type: 'eliminate', desc: 'Final act. Lana mengeksekusi rencana besarnya. Karya agung sang penulis.' }, weight: 25 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Endgame. Lana memutuskan hanya satu yang boleh selamat — Dimas hanyalah bidak.', target: 'dimas' }, weight: 28 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Endgame. Niko harus disingkirkan.', target: 'niko' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK (prioritas tinggi) ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Lana mencari dan menghancurkan petunjuk pelarian. Kalau survivor menemukan 8, semuanya tamat.' }, weight: 26 }
    ],

    dimas: [
      // === FASE AWAL: Cover ===
      { condition: { emotion: 'stalking', chapter: 0 }, action: { type: 'maintain_cover', desc: 'Dimas memainkan peran mahasiswa pendiam. Senyum sopan, mata kosong. Topeng seumur hidup.' }, weight: 20 },
      { condition: { emotion: 'stalking', isAlone: true }, action: { type: 'plan', desc: 'Dimas menyiapkan suntikan di kantong jasnya. Propofol — cepat, tenang, tanpa darah.' }, weight: 22 },

      // === SIASAT: Memisahkan survivor (KUNCI STRATEGI) ===
      { condition: { emotion: 'stalking', isAlone: false }, action: { type: 'divide', desc: '"Sebaiknya kita cek di lantai bawah juga." Dimas memecah kelompok — target harus sendirian.' }, weight: 26 },
      { condition: { isAlone: false }, action: { type: 'manipulate', desc: 'Dimas memanipulasi rasa takut survivor. "Aku rasa salah satu dari kita adalah pembunuhnya..." Curiga satu sama lain.' }, weight: 22 },
      { condition: { emotion: 'stalking', isAlone: true, chapter: 2 }, action: { type: 'move', desc: 'Dimas bergerak ke dapur. Akses ke bahan kimia — keuntungan farmakologi.', moveTo: 'dapur' }, weight: 18 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'sabotage', desc: 'Dimas memanipulasi obat di kotak P3K mansion. Pengetahuan farmakologi yang mematikan.' }, weight: 22 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'trap', desc: 'Dimas menyiapkan jebakan farmakologis di koridor gelap. Klinis.' }, weight: 20 },

      // === Koordinasi dengan Lana ===
      { condition: { nearbyIncludes: 'lana', emotion: 'stalking' }, action: { type: 'plan', desc: 'Dimas menunggu sinyal Lana. Instrumen — senjata yang menunggu tangan yang mengarahkan.' }, weight: 18 },

      // === Target Sera: Isolasi (BUKAN strike di depan orang) ===
      { condition: { nearbyIncludes: 'sera', emotion: 'hunting' }, action: { type: 'isolate', desc: '"Sera, aku perlu bicarakan sesuatu secara private." Dimas mencoba memisahkan Sera.' }, weight: 25 },

      // === KILL: HANYA saat sendirian dengan 1 target ===
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Dimas bergerak dengan presisi bedah. Tidak ada emosi. Tidak ada ragu. Hanya prosedur.' }, weight: 28 },

      // === COVER ===
      { condition: { minDeaths: 1, isAlone: false, emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Dimas memeriksa "korban" dengan ketenangan klinis. Akting pembunuh yang berpura-pura penolong.' }, weight: 22 },
      { condition: { minTension: 60 }, action: { type: 'frame', desc: 'Dimas menempatkan bukti di tas seseorang. Framing rapi — seperti operasi bedah.' }, weight: 20 },

      // === Detektif nearby: Cover ===
      { condition: { nearbyIncludes: 'reza', emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Dimas menunjukkan "ketakutan" di depan Reza. Akting untuk membuat detektif mengabaikannya.' }, weight: 20 },

      // === TERDESAK: Khianat ===
      { condition: { minTension: 60, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: 'Dimas muak diperintah. Dia meninggalkan bukti yang mengarah ke Lana.', target: 'lana' }, weight: 26 },
      { condition: { minTension: 80 }, action: { type: 'flee', desc: 'Dimas meninggalkan segalanya. Insting survival lebih kuat dari instruksi.' }, weight: 18 },

      // === LATE GAME ===
      { condition: { chapter: 5, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Late game. Dimas memecah kelompok survivor — isolasi target untuk kill.' }, weight: 28 },
      { condition: { chapter: 5, minDeaths: 2 }, action: { type: 'eliminate', desc: 'Dimas lepas dari kendali Lana. Dia membunuh bukan karena diperintah — tapi karena dia mau.' }, weight: 25 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: 'Endgame. Dimas mengkhianati Lana demi keselamatannya sendiri.', target: 'lana' }, weight: 28 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Endgame. Dimas mengkhianati Niko — hanya satu yang boleh menang.', target: 'niko' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Dimas mencari dan membakar petunjuk pelarian dengan presisi klinis.' }, weight: 24 }
    ],

    niko: [
      // === FASE AWAL: Tuan rumah yang concerned (cover) ===
      { condition: { emotion: 'stalking', chapter: 0 }, action: { type: 'maintain_cover', desc: 'Niko memainkan peran tuan rumah yang concerned. "Tenang semua." Ironi yang sempurna.' }, weight: 22 },

      // === SIASAT: Kontrol mansion, pecah kelompok (KUNCI STRATEGI) ===
      { condition: { isAlone: true, emotion: 'stalking' }, action: { type: 'plan', desc: 'Niko membuka panel rahasia dan mengakses kontrol mansion. "Rumahku. Aturanku."' }, weight: 20 },
      { condition: { emotion: 'stalking', isAlone: false }, action: { type: 'divide', desc: '"Kita harus berpencar untuk cari clue." Niko memecah kelompok — kambing menjauhi kawanan.' }, weight: 28 },
      { condition: { isAlone: false }, action: { type: 'sabotage', desc: 'Niko mematikan lampu di sayap mansion. Dalam kegelapan, kelompok terpisah — persis seperti yang dia rencanakan.' }, weight: 24 },
      { condition: { isAlone: false }, action: { type: 'distract', desc: '"ADA SUARA DI LANTAI ATAS!" Niko membuat kepanikan palsu untuk memecah kelompok.' }, weight: 22 },
      { condition: { emotion: 'stalking', chapter: 2 }, action: { type: 'move', desc: 'Niko bergerak ke panel kontrol rahasia mansion.', moveTo: 'ruang_penyimpanan' }, weight: 16 },

      // === HUNTING: Sabotase infrastruktur, isolasi ===
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'isolate', desc: '"Vira, kita perlu bicara." Niko mencoba memisahkan seseorang — lebih mudah dibunuh sendirian.' }, weight: 24 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'trap', desc: 'Niko mengaktifkan jebakan mansion yang hanya dia tahu. Tuan rumah punya keuntungan absolut.' }, weight: 20 },

      // === KILL: HANYA saat sendirian dengan 1 target ===
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Niko menunjukkan wajah aslinya. Predator yang sudah merencanakan ini bertahun-tahun.' }, weight: 28 },

      // === COVER ===
      { condition: { minDeaths: 1, isAlone: false, emotion: 'stalking' }, action: { type: 'frame', desc: 'Niko "menemukan" bukti menunjuk ke seseorang. "Aku tidak percaya... teman kita sendiri?"' }, weight: 22 },
      { condition: { minDeaths: 1, isAlone: false, emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Niko bersikap sebagai tuan rumah yang peduli. "Aku yang paling tahu mansion ini." Ironi kejam.' }, weight: 18 },

      // === TERDESAK: Khianat killer lain ===
      { condition: { minTension: 60, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: '"Lana, kau bukan bagian dari rencana ini lagi." Niko mengekspos Lana.', target: 'lana' }, weight: 26 },
      { condition: { minTension: 60, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Niko mengaktifkan CCTV yang merekam Dimas. "Hanya satu yang boleh selamat."', target: 'dimas' }, weight: 24 },
      { condition: { minTension: 70 }, action: { type: 'confront', desc: 'Niko berhenti berpura-pura. "Mansion ini milikku. Kalian tamu."' }, weight: 20 },

      // === LATE GAME ===
      { condition: { chapter: 6, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Endgame. Niko menggunakan mansion untuk memisahkan survivor — matikan listrik, kunci pintu.' }, weight: 28 },
      { condition: { chapter: 6, minDeaths: 2 }, action: { type: 'eliminate', desc: 'Endgame. Niko mengaktifkan trap terakhir mansion.' }, weight: 25 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: 'Niko mengorbankan Lana demi menjadi satu-satunya yang selamat.', target: 'lana' }, weight: 28 },
      { condition: { chapter: 6, minTension: 50, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Niko mengkhianati Dimas — mansion ini hanya untuk satu pemenang.', target: 'dimas' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Niko menggunakan pengetahuan mansionnya untuk menemukan dan menghancurkan petunjuk pelarian.' }, weight: 26 }
    ]
  };

  // ---- Get full profile for a character ----
  function getProfile(name) {
    const isKillerCheck = (gameState) => gameState && gameState.killers && gameState.killers.includes(name);
    const personality = PERSONALITIES[name];
    const decisions = DECISION_TREES[name] || [];

    return {
      name,
      personality: personality || { aggression: 30, caution: 50, loyalty: 50, cunning: 50, empathy: 50, impulsiveness: 50, courage: 50, archetype: 'unknown' },
      initialGoals: getInitialGoals(name, false),
      decisions,
      getKillerDecisions: () => KILLER_TREES[name] || [],
      getActiveDecisions: (gameState) => {
        if (isKillerCheck(gameState)) {
          return KILLER_TREES[name] || decisions;
        }
        return decisions;
      }
    };
  }

  // ---- Get decisions for a character based on game state ----
  function getDecisions(name, gameState) {
    const isK = gameState && gameState.killers && gameState.killers.includes(name);
    if (isK && KILLER_TREES[name]) return KILLER_TREES[name];
    return DECISION_TREES[name] || [];
  }

  // ---- Generate flavor text for NPC status ----
  function getStatusText(name, mind) {
    const p = PERSONALITIES[name];
    if (!p) return 'Diam.';

    const emotionTexts = {
      calm: { low: 'Tenang', mid: 'Waspada rendah', high: 'Berjaga' },
      wary: { low: 'Curiga', mid: 'Gelisah', high: 'Tegang' },
      suspicious: { low: 'Sangat curiga', mid: 'Tidak percaya siapapun', high: 'Paranoid' },
      panicked: { low: 'Takut', mid: 'Panik', high: 'Histeris' },
      hostile: { low: 'Agresif', mid: 'Berbahaya', high: 'Tidak terkendali' },
      stalking: { low: 'Mengintai', mid: 'Memburu', high: 'Bersiap menyerang' },
      hunting: { low: 'Aktif berburu', mid: 'Mendekati target', high: 'Hampir menyerang' },
      executing: { low: 'Menyerang', mid: 'Mengeksekusi', high: 'Tanpa ampun' }
    };

    const emo = emotionTexts[mind.emotion] || emotionTexts.calm;
    const level = mind.tension < 30 ? 'low' : mind.tension < 65 ? 'mid' : 'high';
    return emo[level];
  }

  // ---- Public API ----
  return {
    PERSONALITIES,
    DECISION_TREES,
    KILLER_TREES,
    getProfile,
    getDecisions,
    getInitialGoals,
    getStatusText
  };
})();
