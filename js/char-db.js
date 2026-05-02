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
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Arya mengamati setiap tamu dengan mata jurnalisnya — mencari cerita di balik ekspresi mereka.' }, weight: 15 },
      { condition: { chapter: 1, emotion: 'calm' }, action: { type: 'investigate', desc: 'Arya memeriksa setiap sudut ruangan, recorder menyala, mencatat detail yang orang lain lewatkan.' }, weight: 20 },
      { condition: { chapter: 1, emotion: 'wary' }, action: { type: 'investigate', desc: 'Arya menemukan catatan aneh di balik lukisan — tulisan tangan yang familiar...' }, weight: 18 },

      // Protect Sera
      { condition: { nearbyIncludes: 'sera', minDanger: 40 }, action: { type: 'guard', desc: 'Arya berdiri di dekat Sera, tanpa kata tapi jelas — dia tidak akan membiarkan siapapun menyentuhnya.' }, weight: 25 },
      { condition: { nearbyIncludes: 'sera', emotion: 'panicked' }, action: { type: 'guard', desc: '"Sera, tetap di belakangku." Arya menarik Sera ke belakangnya, tubuhnya menjadi perisai.' }, weight: 30 },

      // Investigate when alone
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'investigate', desc: 'Sendirian, Arya mengeluarkan senter kecilnya. Ada sesuatu di sini yang belum ditemukan.' }, weight: 22 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'investigate', desc: 'Arya membuka recorder: "Catatan pribadi — aku menemukan sesuatu. Kalau aku tidak kembali, cek rekaman ini."' }, weight: 20 },

      // Confront suspects
      { condition: { emotion: 'suspicious', minDeaths: 1 }, action: { type: 'confront', desc: 'Arya tidak bisa diam lagi. "Salah satu dari kalian bertanggung jawab. Dan aku akan menemukan siapa."' }, weight: 18 },

      // Share clues with Sera
      { condition: { hasClue: true, nearbyIncludes: 'sera' }, action: { type: 'share_clue', desc: 'Arya berbisik ke Sera: "Lihat ini — bukti ini menghubungkan semuanya."', target: 'sera' }, weight: 20 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Arya menunjukkan bukti ke Reza. "Kau mantan detektif. Apa pendapatmu?"', target: 'reza' }, weight: 15 },

      // High danger
      { condition: { minDanger: 70, emotion: 'panicked' }, action: { type: 'flee', desc: 'Untuk pertama kalinya, insting jurnalis kalah oleh insting bertahan hidup. Arya berlari.' }, weight: 15 },

      // Accuse when confident
      { condition: { minDeaths: 2, emotion: 'hostile' }, action: { type: 'accuse', desc: 'Arya menunjuk jari: "AKU TAHU SIAPA KAU." Matanya berkilat — ini bukan tuduhan, ini fakta.' }, weight: 25 },

      // Mid-game investigation
      { condition: { chapter: 2 }, action: { type: 'investigate', desc: 'Arya menyusun timeline di dinding — foto, catatan, benang merah menghubungkan semuanya.' }, weight: 16 },
      { condition: { chapter: 3 }, action: { type: 'investigate', desc: 'Arya menemukan pola: setiap kematian terjadi saat korban sendirian. Ini bukan acak.' }, weight: 18 },
      { condition: { chapter: 3 }, action: { type: 'confront', desc: 'Arya mengumpulkan semua bukti. Saatnya mengungkap kebenaran di depan semua orang.' }, weight: 20 },

      // Emotional moments
      { condition: { nearbyIncludes: 'sera', minDeaths: 3 }, action: { type: 'socialize', desc: 'Arya menggenggam tangan Sera. "Kalau kita tidak selamat..." — "Kita akan selamat," potong Sera.' }, weight: 12 },

      // --- NEW: Progressive investigation chain ---
      { condition: { chapter: 2, hasClue: true }, action: { type: 'confront', desc: 'Arya menunjukkan bukti ke kelompok: "Dengarkan. Ada pola di semua ini — kematian tidak acak."' }, weight: 18 },
      { condition: { chapter: 3, minDeaths: 2 }, action: { type: 'accuse', desc: 'Arya menyusun semua bukti di dinding. "Aku sudah tahu siapa. Dan aku bisa buktikan."' }, weight: 22 },

      // --- NEW: Movement & exploration decisions ---
      { condition: { isAlone: true, emotion: 'calm' }, action: { type: 'move', desc: 'Arya bergerak ke ruangan lain, mengikuti insting jurnalisnya. Ada sesuatu yang belum ditemukan.', moveTo: 'perpustakaan' }, weight: 14 },
      { condition: { minDanger: 40, emotion: 'wary' }, action: { type: 'move', desc: 'Arya merasa tidak aman di sini. Saatnya pindah ke tempat yang lebih strategis.', moveTo: 'aula_utama' }, weight: 12 },

      // --- NEW: Unique character interactions ---
      { condition: { nearbyIncludes: 'kira' }, action: { type: 'socialize', desc: '"Kai, bisa kau hack CCTV mansion ini? Aku butuh rekaman malam itu." Arya mengajak Kai berkolaborasi.' }, weight: 16 },
      { condition: { nearbyIncludes: 'reza', minDeaths: 1 }, action: { type: 'socialize', desc: '"Reza, kau pernah menangani kasus seperti ini. Apa yang kau lihat?" Arya mengandalkan pengalaman Reza.' }, weight: 14 },
      { condition: { nearbyIncludes: 'niko', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Niko, ini mansionmu. Kau tahu lebih banyak dari yang kau akui. BICARA." Arya mendesak Niko.' }, weight: 18 },
      { condition: { nearbyIncludes: 'vira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Vira, kau pernah di sini. Apa yang terjadi enam bulan lalu? Aku perlu tahu." Arya mencari jawaban dari Vira.' }, weight: 16 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: 'Arya mengambil alih. "Dengarkan. Kita butuh strategi — siapa jaga pintu, siapa investigasi, siapa pantau pergerakan."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'scout', desc: 'Arya bergerak pelan, memeriksa setiap sudut sebelum melangkah. Jurnalis yang tahu kapan harus diam.' }, weight: 16 },
      { condition: { minDeaths: 2, isAlone: false, hasClue: true }, action: { type: 'rally', desc: '"SEMUA DENGARKAN. Aku punya bukti. Kita akhiri ini malam ini." Arya mengumpulkan semua yang tersisa.' }, weight: 22 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: 'Arya menyusun rencana penyergapan. "Kita tahu dia akan lewat sini. Bersiap."' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Arya memeriksa semua jalur keluar. "Kalau semuanya gagal, kita butuh rencana pelarian."' }, weight: 14 },
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'betray', desc: 'Insting survival mengalahkan segalanya. Arya mempertimbangkan untuk meninggalkan yang lain demi keselamatannya.' }, weight: 10 },
      // Trust-kill: Arya bisa membunuh seseorang yang dia curigai sebagai killer (jika trust sangat rendah)
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 60 }, action: { type: 'trust_kill', desc: '"AKU SUDAH MUAK DENGAN KEBOHONGAN." Arya menyerang orang yang paling dia curigai — apapun konsekuensinya.' }, weight: 20 },
      { condition: { minDeaths: 3, emotion: 'panicked', minTension: 70 }, action: { type: 'trust_kill', desc: 'Paranoia mengambil alih. Arya tidak bisa mempercayai siapapun lagi. "Salah satu dari kalian pasti pembunuh."' }, weight: 18 },

      // --- Chapters 4-5: Escalation & endgame ---
      { condition: { chapter: 4, hasClue: true, isAlone: false }, action: { type: 'rally', desc: 'Arya mengumpulkan semua bukti. "Dengarkan! Aku tahu siapa dalangnya. Kita akhiri malam ini."' }, weight: 24 },
      { condition: { chapter: 4, emotion: 'suspicious', isAlone: false }, action: { type: 'coordinate_defense', desc: '"Kita sudah kehilangan terlalu banyak. Mulai sekarang, TIDAK ADA yang pergi sendirian." Arya mengambil komando.' }, weight: 22 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Waktu hampir habis. Arya mencari petunjuk pelarian dengan intensitas yang meningkat.' }, weight: 20 },
      { condition: { chapter: 4, minDeaths: 2, isAlone: false }, action: { type: 'accuse', desc: 'Arya menyusun semua timeline di dinding. "INI DIA. Semua bukti menunjuk ke satu orang."' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'hostile', hasClue: true }, action: { type: 'rally', desc: '"SEMUANYA BERKUMPUL! Aku tahu jalannya — kita keluar atau mati mencoba!"' }, weight: 24 },
      { condition: { chapter: 4, isAlone: true, minDanger: 50 }, action: { type: 'scout', desc: 'Endgame. Arya bergerak cepat, memeriksa setiap sudut terakhir mansion. Recorder masih menyala.' }, weight: 20 },
      { condition: { chapter: 5, isAlone: false, minDeaths: 3 }, action: { type: 'coordinate_defense', desc: '"Formasi terakhir. Kita keluar bersama atau tidak sama sekali." Arya memimpin evakuasi.' }, weight: 28 },
      { condition: { chapter: 5, emotion: 'panicked', hasClue: true }, action: { type: 'secure_exit', desc: 'Arya menemukan jalur keluar berkat petunjuk yang dikumpulkan. "DI SINI! JALAN KELUARNYA!"' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. Arya mengumpulkan siapa pun yang tersisa. "Ini simpul terakhir. Putuskan sekarang."' }, weight: 30 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'accuse', desc: 'Semua benang merah terhubung. Arya mengungkap SEMUANYA — nama, motif, rencana. Final confrontation.' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'juno', emotion: 'wary' }, action: { type: 'socialize', desc: '"Juno, kau punya keberanian yang aku kagumi. Tapi jangan bertindak gegabah — kita butuh strategi." Arya meredam Juno.' }, weight: 14 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Lana, novel terbarumu tentang pembunuhan di mansion. Kebetulan? Aku tidak percaya kebetulan." Arya menantang Lana.' }, weight: 16 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'wary' }, action: { type: 'socialize', desc: '"Dimas, ketenangan forensikmu berguna. Tapi kenapa kau begitu tenang? Jurnalis selalu bertanya."' }, weight: 14 },
      { condition: { nearbyIncludes: 'farah', emotion: 'calm' }, action: { type: 'socialize', desc: '"Farah, aku ingin mewawancaraimu. Sebagai pewaris Wardhana, kau pasti tahu sejarah mansion ini."' }, weight: 12 },

      // --- Player-reactive: Arya reacts to what the player is doing ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'investigate', desc: '"Aku juga melihatnya." Arya membantu investigasi pemain, memeriksa sisi lain ruangan.' }, weight: 22 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'confront', desc: '"Aku punya bukti tambahan." Arya mendukung tuduhan pemain dengan catatan dari recordernya.' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true, minDeaths: 1 }, action: { type: 'coordinate_defense', desc: 'Arya berbisik ke pemain: "Aku sudah susun timeline. Dengarkan — aku tahu siapa yang berbahaya."' }, weight: 24 },
      { condition: { playerNearby: true, playerIsAlly: true, hasClue: true }, action: { type: 'share_clue', desc: 'Arya menarik pemain ke sudut ruangan: "Lihat ini — bukti ini mengubah segalanya." Dia berbagi semua yang ditemukan.' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'confront', desc: '"Kau menyembunyikan sesuatu." Arya menatap pemain tajam. Instingnya tidak pernah salah — atau begitulah yang dia percaya.' }, weight: 20 },
      { condition: { playerNearby: true, playerLastAction: 'move', emotion: 'wary' }, action: { type: 'observe', desc: 'Arya memperhatikan pemain yang baru datang. "Dari mana kau? Apa yang kau lihat di sana?"' }, weight: 18 },
      { condition: { playerNearby: false, playerIsAlly: true, minDanger: 40 }, action: { type: 'move', desc: 'Arya harus menemui pemain. Sebagai partner investigasi, mereka lebih kuat bersama.' }, weight: 16 },
      { condition: { playerNearby: true, minPlayerSusp: 40 }, action: { type: 'question', desc: '"Aku ingin percaya padamu, tapi beberapa hal tidak masuk akal." Arya menginterogasi pemain secara halus.' }, weight: 18 },

      // --- Broad catch-all: different for every emotion so brain ALWAYS triggers ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'observe', desc: 'Arya diam-diam mencatat siapa bicara dengan siapa dan siapa yang menghindari kontak mata.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'investigate', desc: 'Arya memeriksa ruangan, mata jurnalisnya menangkap sesuatu yang tidak terlihat oleh yang lain.' }, weight: 10 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'confront', desc: '"Ceritamu tidak konsisten." Arya menantang orang yang paling mencurigakan di ruangan.' }, weight: 10 },
      { condition: { emotion: 'hostile' }, action: { type: 'accuse', desc: 'Arya sudah lelah bersabar. "Aku punya cukup bukti. Saatnya mengakhiri ini."' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'Arya meraih tangan siapapun yang terdekat dan berlari. "PERGI DARI SINI! SEKARANG!"' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Arya mematikan lampu dan bersembunyi di balik furnitur. Napasnya tertahan.' }, weight: 12 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Keuntungan sendirian — Arya bisa memeriksa tempat ini tanpa gangguan. Recorder menyala.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Arya memutuskan untuk bergerak. Diam di satu tempat terlalu lama itu berbahaya.' }, weight: 10 },
      { condition: { minDanger: 30, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Kita perlu strategi. Jangan pergi sendirian — buddy system mulai sekarang." Arya mengorganisir kelompok.' }, weight: 12 },
      { condition: { minDanger: 50, isAlone: true }, action: { type: 'hide', desc: 'Tingkat bahaya tinggi. Arya menemukan celah gelap dan menunggu sampai situasi lebih aman.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Arya mengajak bicara orang terdekat. Setiap percakapan bisa jadi petunjuk — atau perangkap.' }, weight: 8 },
      { condition: {}, action: { type: 'observe', desc: 'Arya mengamati sekitarnya. Setiap detail bisa jadi penting — atau jadi perbedaan antara hidup dan mati.' }, weight: 6 }
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
      { condition: { isAlone: true, chapter: 3 }, action: { type: 'investigate', desc: 'Niko mengakses CCTV lama di ruang kontrol kakeknya. Rekaman menunjukkan siapa yang bergerak malam itu.' }, weight: 20 },

      // Vira relationship
      { condition: { nearbyIncludes: 'vira', minDeaths: 1 }, action: { type: 'socialize', desc: '"Vira... maafkan aku." Untuk pertama kalinya, topeng Niko retak.' }, weight: 15 },

      // Gaslighting
      { condition: { minDeaths: 1, emotion: 'suspicious' }, action: { type: 'manipulate', desc: 'Niko meyakinkan kelompok bahwa kematian itu kecelakaan. "Jangan panik. Ini yang diinginkan dalangnya."' }, weight: 18 },

      // Accusation
      { condition: { minDeaths: 2, hasClue: true }, action: { type: 'accuse', desc: 'Niko mengeluarkan bukti yang dia simpan sejak awal. "Aku sudah tahu sejak tadi. Aku hanya menunggu konfirmasi."' }, weight: 20 },

      // Late game
      { condition: { chapter: 4 }, action: { type: 'confront', desc: 'Niko akhirnya mengungkap semua kartunya. "Cukup bermain-main. Ini yang sebenarnya terjadi."' }, weight: 22 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Niko menggunakan pengetahuan mansionnya untuk mencari petunjuk pelarian di tempat tersembunyi.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: false, minDeaths: 2 }, action: { type: 'coordinate_defense', desc: '"Ini mansionku. Ikuti instruksiku atau mati." Niko mengambil kendali absolut.' }, weight: 22 },
      { condition: { chapter: 4, hasClue: true, isAlone: false }, action: { type: 'share_clue', desc: 'Niko membuka semua rahasia mansion. "Dengar, aku sembunyikan ini karena takut — tapi sekarang tidak ada pilihan."' }, weight: 24 },
      { condition: { chapter: 4, emotion: 'hostile' }, action: { type: 'confront', desc: '"AKU TAHU SIAPA KAU." Niko menggunakan CCTV mansion untuk mengungkap killer.' }, weight: 26 },
      { condition: { chapter: 5, minDeaths: 3, isAlone: false }, action: { type: 'rally', desc: 'Niko mengumpulkan survivor terakhir. "Mansion ini punya jalan keluar darurat. Ikut aku — SEKARANG."' }, weight: 28 },
      { condition: { chapter: 5, emotion: 'panicked' }, action: { type: 'secure_exit', desc: 'Niko membuka bunker darurat kakeknya. Jalur pelarian terakhir.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. Niko berdiri di aula utama. "Mansion ini dimulai dengan permainanku. Berakhir dengan pilihanku."' }, weight: 30 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'secure_exit', desc: 'Niko mengaktifkan protokol darurat mansion. Semua pintu terbuka. "SEKARANG ATAU TIDAK PERNAH!"' }, weight: 28 },

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
      { condition: { isAlone: true, emotion: 'suspicious' }, action: { type: 'scout', desc: 'Niko menyusuri bunker tersembunyi yang hanya keluarganya tahu. Tuan rumah selalu punya keuntungan.' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Niko membuka jalur pelarian melalui terowongan bawah tanah mansion. "Kakekku membangun ini untuk keadaan darurat."' }, weight: 22 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: 'Niko mengatur jebakan di koridor utama. "Rumahku, aturanku. Pembunuh akan melewati sini."' }, weight: 18 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Niko menghilang ke ruangan rahasia, meninggalkan yang lain. Survival of the fittest.' }, weight: 10 },
      // Trust-kill: Niko kalkulatif — membunuh dengan dingin jika trust habis
      { condition: { minDeaths: 2, emotion: 'suspicious', minTension: 50 }, action: { type: 'trust_kill', desc: '"Aku sudah menghitung probabilitasnya. Dan kau terlalu mencurigakan untuk dibiarkan hidup." Niko menyerang dengan presisi dingin.' }, weight: 20 },
      { condition: { minDeaths: 3, emotion: 'hostile' }, action: { type: 'trust_kill', desc: '"Mansionku. Aturanku. Dan kau bukan bagian dari solusinya." Niko mengeliminasi orang yang paling dia curigai.' }, weight: 18 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'arin', emotion: 'suspicious' }, action: { type: 'manipulate', desc: '"Arya, jurnalis selalu mencari cerita. Tapi cerita apa yang kau sembunyikan dari kami?" Niko membalik pertanyaan.' }, weight: 14 },
      { condition: { nearbyIncludes: 'juno', emotion: 'wary' }, action: { type: 'socialize', desc: '"Juno, kekuatanmu berguna di sini. Tapi keberanianmu bisa jadi kelemahanmu." Niko menasihati dengan kalkulasi.' }, weight: 14 },
      { condition: { nearbyIncludes: 'reza', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Niko menatap Reza. Detektif. Orang yang paling berbahaya di sini — karena dia bisa melihat menembus topeng.' }, weight: 16 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'calm' }, action: { type: 'socialize', desc: '"Dimas, forensikmu bisa berguna. Tapi di mansion ini, sains tidak selalu menang atas kegelapan."' }, weight: 12 },
      { condition: { nearbyIncludes: 'kira', emotion: 'wary' }, action: { type: 'question', desc: '"Kai, apa yang kau temukan di server mansion? Aku tahu infrastrukturnya — tapi apa yang disembunyikannya?"' }, weight: 16 },

      // --- Player-reactive: Niko (mastermind) manipulates/helps based on player actions ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'observe', desc: 'Niko mengamati pemain dari kejauhan. "Menarik... kau mencari di tempat yang tepat. Atau yang salah."' }, weight: 22 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'manipulate', desc: '"Tuduhan yang berani." Niko tersenyum ke pemain. "Tapi apakah kau yakin, atau hanya menebak?"' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'plan', desc: 'Niko berbagi peta mansion dengan pemain. "Aku tahu setiap lorong rahasia di sini. Kita bisa memanfaatkannya."' }, weight: 24 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'manipulate', desc: 'Niko menyebarkan rumor tentang pemain ke NPC lain. Mastermind tidak pernah menyerang langsung.' }, weight: 22 },
      { condition: { playerNearby: true, minPlayerSusp: 30 }, action: { type: 'question', desc: '"Kau tahu, beberapa orang di sini mulai membicarakanmu." Niko menatap pemain dengan senyum kalkulatif.' }, weight: 18 },
      { condition: { playerNearby: false, playerIsAlly: true }, action: { type: 'move', desc: 'Niko memutuskan untuk menemui pemain. Aliansi strategis perlu dijaga — terutama dengan orang yang berguna.' }, weight: 14 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'manipulate', desc: 'Niko menyebar informasi setengah benar ke kelompok. Membuat mereka saling curiga — sementara dia mengamati.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Niko membuka panel tersembunyi di dinding. Mansion ini penuh rahasia — dan dia tahu semuanya.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'plan', desc: 'Niko diam-diam menyusun aliansi. "Kita butuh satu sama lain — untuk saat ini." Kata-kata yang diperhitungkan.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Niko bergerak melalui koridor yang hanya dia tahu. Keuntungan tuan rumah.' }, weight: 10 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'manipulate', desc: '"Menarik..." Niko melempar komentar ambigu yang membuat dua orang saling curiga.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'scout', desc: 'Niko menyusuri lorong gelap dengan percaya diri. Rumahnya, teritori-nya.' }, weight: 10 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'confront', desc: '"Cukup permainan. Aku tahu apa yang kau sembunyikan." Niko menanggalkan topeng sopannya.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Niko masuk ke ruang rahasia kakeknya. Tempat aman yang tidak ada di blueprints resmi.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'Untuk pertama kalinya, topeng Niko runtuh sepenuhnya. Dia berlari tanpa melihat ke belakang.' }, weight: 10 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Niko mengajak ngobrol dengan senyum diplomatisnya. Setiap kata diukur, setiap reaksi dicatat.' }, weight: 8 },
      { condition: {}, action: { type: 'plan', desc: 'Niko berpikir. Menimbang opsi. Menghitung langkah — selalu tiga langkah di depan yang lain.' }, weight: 6 }
    ],

    // ========== SERA — The Profiler ==========
    sera: [
      // Read people
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Sera duduk di sudut, kacamata di tangan, memperhatikan setiap micro-expression. Catatannya sudah terisi setengah.' }, weight: 20 },
      { condition: { emotion: 'calm' }, action: { type: 'observe', desc: 'Sera menganalisis pola perilaku kelompok. Tiga orang menunjukkan tanda kebohongan. Dua lagi menunjukkan ketakutan yang asli.' }, weight: 18 },

      // Profile suspects
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Sera menulis profil: "Subjek menunjukkan flat affect, kurangnya respons empatik, dan tendensi untuk memposisikan diri di dekat exit..."' }, weight: 22 },
      { condition: { emotion: 'suspicious' }, action: { type: 'accuse', desc: 'Sera membaca microexpression seseorang dan langsung tahu: "Kau berbohong. Pupilmu melebar 0.3 milimeter setiap kali kau bicara tentang alibi."' }, weight: 20 },

      // Protect Arya
      { condition: { nearbyIncludes: 'arin', minDanger: 40 }, action: { type: 'guard', desc: 'Sera berdiri di samping Arya. Bukan karena dia kuat — tapi karena dia tidak bisa membayangkan dunia tanpa Arya di dalamnya.' }, weight: 25 },

      // Emotional vulnerability with Arya
      { condition: { nearbyIncludes: 'arin', minDeaths: 2 }, action: { type: 'socialize', desc: 'Sera menggenggam tangan Arya di bawah meja. "Aku... aku tidak bisa menganalisis ini. Aku hanya tahu aku tidak mau kehilanganmu."' }, weight: 18 },

      // Read the room
      { condition: { isAlone: false, chapter: 2 }, action: { type: 'observe', desc: 'Sera memperhatikan dinamika kelompok berubah. Kepercayaan runtuh. Tapi satu orang — satu orang terlalu tenang.' }, weight: 20 },

      // Confront Dimas
      { condition: { nearbyIncludes: 'dimas', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Dimas, tatap mataku." Sera membaca kekosongan di balik senyum sopannya. "Aku tahu apa yang kau sembunyikan."' }, weight: 22 },

      // Share profiling with allies
      { condition: { hasClue: true, nearbyIncludes: 'arin' }, action: { type: 'share_clue', desc: 'Sera menunjukkan catatan profilingnya ke Arya: "Ini daftar tersangka berdasarkan analisis perilaku."', target: 'arin' }, weight: 20 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Sera dan Reza membandingkan catatan. "Kau punya insting polisi. Aku punya data perilaku. Gabungkan."', target: 'reza' }, weight: 15 },

      // Panic
      { condition: { minDanger: 70, emotion: 'panicked' }, action: { type: 'hide', desc: 'Sera berhenti menganalisis. Untuk pertama kalinya, dia hanya lari. Otak yang selalu berpikir akhirnya menyerah pada insting primitif.' }, weight: 18 },

      // Late game revelation
      { condition: { chapter: 3 }, action: { type: 'accuse', desc: 'Sera berdiri di depan kelompok. "Aku sudah cukup mengumpulkan data. Pembunuhnya adalah—"' }, weight: 25 },

      // --- NEW: Movement decisions ---
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Sera bergerak ke tempat yang lebih aman, mencari posisi di mana dia bisa mengamati tanpa terlihat.', moveTo: 'perpustakaan' }, weight: 14 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'juno', emotion: 'calm' }, action: { type: 'socialize', desc: '"Juno, impulsivitasmu bukan kelemahan. Itu insting survival. Tapi kau perlu fokus." Sera menenangkan Juno.' }, weight: 16 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Sera memperhatikan Lana dengan intens. "Narcissistic personality, antisocial tendency, charm yang dipelajari... profil yang sempurna untuk—" Dia terdiam.' }, weight: 20 },
      { condition: { nearbyIncludes: 'farah' }, action: { type: 'socialize', desc: '"Farah, uangmu tidak bisa membeli keselamatan di sini. Tapi informasimu bisa. Apa yang kau tahu tentang keluarga Wardhana?"' }, weight: 14 },
      { condition: { nearbyIncludes: 'kira', hasClue: true }, action: { type: 'share_clue', desc: 'Sera membagi analisis profilingnya dengan Kai. "Gabungkan ini dengan data digitalmu. Pola akan muncul."', target: 'kira' }, weight: 18 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 2, emotion: 'suspicious' }, action: { type: 'confront', desc: 'Sera tidak lagi menganalisis dari kejauhan. "Aku sudah melihat tanda-tandanya. Salah satu dari kita adalah pembunuh. Dan aku tahu siapa."' }, weight: 22 },
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'flee', desc: 'Sera kehilangan ketenangan profesionalnya. Terlalu banyak kematian. "Aku... aku tidak bisa terus menganalisis mayat."' }, weight: 18 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: 'Sera menganalisis pola pembunuhan. "Pembunuh ini predator. Kita harus berpikir seperti mangsa yang cerdas."' }, weight: 20 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'scout', desc: 'Sera mengamati semua orang di ruangan. Profilingnya mencari tanda-tanda predator — micro-expression, postur, pernapasan.' }, weight: 18 },
      { condition: { minDeaths: 2, hasClue: true, isAlone: false }, action: { type: 'rally', desc: '"Aku sudah profil semua orang. Hasilnya mengejutkan. Pembunuh ada di antara kita — dan aku tahu polanya."' }, weight: 22 },
      { condition: { minDanger: 50, isAlone: false }, action: { type: 'ambush', desc: 'Sera menyusun strategi psikologis. "Jangan lari dari predator. Buat dia merasa diburu."' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Sera melihat peluang. Mengorbankan satu orang untuk menyelamatkan dirinya dan Arya. Keputusan yang dingin.' }, weight: 10 },
      // Trust-kill: Sera membaca tanda-tanda dan bertindak jika yakin seseorang berbahaya
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 60 }, action: { type: 'trust_kill', desc: '"Profilmu konsisten dengan seorang pembunuh. Maaf — tapi aku tidak bisa mengambil risiko." Sera bertindak berdasarkan analisisnya.' }, weight: 18 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, isAlone: false, hasClue: true }, action: { type: 'accuse', desc: 'Sera berdiri. Profilnya lengkap. "Aku sudah analisis setiap perilaku, setiap kebohongan. INILAH pembunuhnya."' }, weight: 26 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Sera mencari petunjuk pelarian, menggunakan pola perilaku killer untuk memprediksi lokasi yang aman.' }, weight: 22 },
      { condition: { chapter: 4, nearbyIncludes: 'arin', minDeaths: 3 }, action: { type: 'coordinate_defense', desc: '"Arya, dengar. Aku sudah profil semua orang. Kita berdua yang tersisa yang bisa dipercaya."' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'hostile' }, action: { type: 'confront', desc: '"CUKUP." Sera melempar catatannya ke lantai. "Profil sudah lengkap. Pembunuh ada di ruangan ini."' }, weight: 24 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: '"Aku psikolog. Aku tahu bagaimana predator berpikir. Dan aku tahu cara menghentikannya. IKUT AKU."' }, weight: 28 },
      { condition: { chapter: 5, emotion: 'panicked', nearbyIncludes: 'arin' }, action: { type: 'guard', desc: 'Sera berdiri di depan Arya. Tidak peduli risikonya. "Aku tidak akan kehilanganmu."' }, weight: 26 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'accuse', desc: 'Final profiling. Sera mengungkap setiap kebohongan, setiap alibi palsu. "INILAH KEBENARAN MALAM INI."' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. "Aku sudah baca setiap wajah di mansion ini. Simpul terakhir ada di tangan kita."' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'niko', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Sera mengamati Niko. Micro-expression terlalu terkontrol. "Kau menyembunyikan sesuatu, Niko. Pupilmu berkhianat."' }, weight: 16 },
      { condition: { nearbyIncludes: 'vira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Vira, aku bisa melihat kau menyimpan trauma. Aku terlatih mendengarkan. Ceritakan." Sera menawarkan dukungan psikologis.' }, weight: 14 },

      // --- Player-reactive: Sera (profiler) reads the player ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'observe', desc: 'Sera mengamati cara pemain menginvestigasi. "Menarik... caramu mencari menunjukkan sesuatu tentang dirimu."' }, weight: 22 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'observe', desc: 'Sera memperhatikan reaksi semua orang saat pemain menuduh. "Bukan tuduhannya yang penting — tapi reaksi mereka."' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true, hasClue: true }, action: { type: 'share_clue', desc: '"Aku punya profil psikologis lengkap. Gabungkan dengan buktimu — kita bisa mengidentifikasi killer." Sera berbagi analisisnya.' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'observe', desc: 'Sera mencatat setiap gerakan pemain. "Pupil melebar, detak jantung meningkat... kau menyembunyikan sesuatu."' }, weight: 20 },
      { condition: { playerNearby: true, minPlayerSusp: 50 }, action: { type: 'confront', desc: '"Aku sudah membaca profilmu." Sera menatap pemain. "Dan ada ketidaksesuaian yang menggangguku."' }, weight: 22 },
      { condition: { playerNearby: false, playerIsAlly: true, minDanger: 50 }, action: { type: 'move', desc: 'Sera memutuskan mencari pemain. Profilernya butuh data langsung — dan pemain adalah satu-satunya yang bisa dipercaya.' }, weight: 16 },
      { condition: { playerNearby: true, playerLastAction: 'talk' }, action: { type: 'socialize', desc: '"Kau pandai membaca orang." Sera tersenyum ke pemain. "Kita harusnya bekerja sama dari awal."' }, weight: 18 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'observe', desc: 'Sera menganalisis dinamika kelompok — siapa memimpin, siapa mengikuti, siapa yang terlalu diam.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Sera menulis profil psikologis lengkap setiap orang. Pola mulai terbentuk.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'observe', desc: '"Bahasa tubuh kalian berubah." Sera memperhatikan pergeseran halus dalam kelompok.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Sera bergerak ke posisi yang lebih aman. Analisis butuh ketenangan.' }, weight: 10 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Sera meninjau ulang catatannya. Satu nama terus muncul di setiap pola anomali.' }, weight: 12 },
      { condition: { emotion: 'hostile' }, action: { type: 'accuse', desc: '"Cukup data. Cukup analisis. Saatnya konfrontasi langsung." Sera berdiri.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'guard', desc: 'Sera berdiri di dekat orang yang paling rentan. Insting melindungi mengalahkan ketakutan.' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Sera menghilang ke sudut tergelap. Jantungnya berdebar, tapi otaknya masih bekerja.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Sera mengajak bicara seseorang — bukan basa-basi, tapi probing pertanyaan yang terukur.' }, weight: 8 },
      { condition: {}, action: { type: 'observe', desc: 'Sera mengamati. Setiap gerakan, setiap ekspresi — data untuk profil yang akan menentukan segalanya.' }, weight: 6 }
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
      { condition: { chapter: 3, emotion: 'panicked' }, action: { type: 'flee', desc: 'Juno berlari ke jendela terdekat dan mencoba memecahkannya. "KITA KELUAR SEKARANG!"' }, weight: 18 },

      // Late game
      { condition: { chapter: 4, emotion: 'hostile' }, action: { type: 'confront', desc: '"Sini lo." Juno sudah tidak takut. Yang tersisa hanya kemarahan dan tekad untuk bertahan hidup.' }, weight: 25 },

      // --- NEW: Movement ---
      { condition: { emotion: 'hostile', isAlone: true }, action: { type: 'move', desc: 'Juno bergerak agresif menyusuri mansion, mencari konfrontasi langsung.', moveTo: 'aula_utama' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'arin', emotion: 'wary' }, action: { type: 'socialize', desc: '"Arya, lo selalu nyari bukti. Kadang bukti itu di depan mata — cuma butuh orang yang berani ngambil." Juno mendorong Arya bertindak.' }, weight: 14 },
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
      { condition: { minDeaths: 1, emotion: 'panicked' }, action: { type: 'trust_kill', desc: 'Ketakutan berubah jadi kemarahan. Juno menyerang orang terdekat. "LO PASTI SALAH SATUNYA!"' }, weight: 20 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, emotion: 'hostile', isAlone: false }, action: { type: 'ambush', desc: '"Gue balik ke sini bukan buat kabur. Gue balik buat ngebales." Juno menyiapkan jebakan.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Juno mendobrak lemari dan membongkar lantai. "Kalau ada jalan keluar, gue PASTI nemu."' }, weight: 22 },
      { condition: { chapter: 4, minDeaths: 3, isAlone: false }, action: { type: 'coordinate_defense', desc: '"DENGERIN GUE. Gue tau cara bertahan hidup. Lo semua ikutin gue atau mati sendiri-sendiri."' }, weight: 24 },
      { condition: { chapter: 4, nearbyIncludes: 'reza', emotion: 'hostile' }, action: { type: 'guard', desc: 'Juno berdiri di depan Reza. "Lo satu-satunya yang gue percaya di sini, old man. Gue jaga lo."' }, weight: 22 },
      { condition: { chapter: 5, emotion: 'hostile', isAlone: false }, action: { type: 'rally', desc: '"GUE NGGAK MAU MATI DI MANSION BANGSAT INI. SIAPA YANG MAU IKUT GUE KELUAR?!"' }, weight: 28 },
      { condition: { chapter: 5, isAlone: true, minDanger: 60 }, action: { type: 'secure_exit', desc: 'Juno menemukan ventilasi besar di basement. "Ini dia. Ini jalan keluarnya."' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. "GUE MULAI DARI JALANAN. GUE NGGAK BAKAL MATI DI SINI." Juno memimpin serangan terakhir.' }, weight: 30 },
      { condition: { chapter: 5, emotion: 'hostile' }, action: { type: 'confront', desc: 'Konfrontasi final. Juno meraih senjata apapun yang ada. "Lo dan gue. SEKARANG."' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Lana, gue tau lo pinter ngomong. Tapi gue bukan orang yang bisa lo manipulasi. JUJUR. SEKARANG."' }, weight: 16 },
      { condition: { nearbyIncludes: 'kira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Kai, lo bisa hack apapun kan? Bantu gue buka pintu mansion ini. Gue cover lo."' }, weight: 14 },
      { condition: { nearbyIncludes: 'farah', emotion: 'calm' }, action: { type: 'confront', desc: '"Farah, lo pewaris. Lo punya kunci rumah ini. Jangan bilang lo nggak bisa buka pintu keluar."' }, weight: 14 },

      // --- Player-reactive: Juno (rebel) — impulsive, loyal, direct ---
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'confront', desc: '"Lo berani nuduh? GUE LEBIH BERANI." Juno langsung mendukung pemain tanpa pikir panjang.' }, weight: 24 },
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'guard', desc: 'Juno berdiri jaga sementara pemain menginvestigasi. "Lo cari, gue jaga. Deal?"' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true, minDeaths: 1 }, action: { type: 'coordinate_defense', desc: '"Lo dan gue, kita tim. Gue nggak peduli siapa lagi — KITA yang selamat malam ini."' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'confront', desc: '"GUE NGGAK PERCAYA SAMA LO." Juno mendekat ke pemain dengan tangan mengepal. "Buktiin gue salah."' }, weight: 24 },
      { condition: { playerNearby: true, minPlayerSusp: 40 }, action: { type: 'confront', desc: '"Banyak yang curiga sama lo. Gue mau denger langsung dari mulut lo — APA YANG LO SEMBUNYIIN?"' }, weight: 22 },
      { condition: { playerNearby: false, playerIsAlly: true, minDanger: 30 }, action: { type: 'move', desc: 'Juno bergerak cepat mencari pemain. Loyalitas rebel: sekali jadi tim, nggak pernah ditinggal.' }, weight: 18 },
      { condition: { playerNearby: true, playerLastAction: 'vote' }, action: { type: 'accuse', desc: '"VOTING? GUE ALL IN!" Juno langsung ikut voting tanpa ragu. Impulsif sampai akhir.' }, weight: 22 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'investigate', desc: 'Juno memeriksa jendela dan pintu. "Kalau ada jalan keluar, gue yang pertama nemu."' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'move', desc: 'Juno jalan-jalan sendirian, gelisah. Diam di satu tempat bukan gayanya.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'confront', desc: '"Gue nggak suka cara lo ngeliatin gue." Juno menatap tajam orang terdekat.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'scout', desc: 'Juno bergerak seperti kucing — cepat, tanpa suara, mata siaga ke segala arah.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'confront', desc: '"ADA YANG MAU NGOMONG JUJUR? Karena gue bakal mulai nonjok orang." Juno mengintimidasi.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Juno memeriksa setiap laci, setiap celah. Tangan kasarnya merobek penutup furniture.' }, weight: 10 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'guard', desc: 'Juno mengambil posisi bertahan, badan bergetar karena adrenalin. "Lewat gue dulu."' }, weight: 12 },
      { condition: { emotion: 'hostile', isAlone: true }, action: { type: 'ambush', desc: 'Juno menyiapkan jebakan dari furniture berat. Siapapun yang masuk ruangan ini akan kena.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: '"LARI! SEKARANG!" Juno menarik siapapun yang terdekat dan berlari.' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Juno menyembunyikan diri di balik lemari berat. Napasnya berat, tinju terkepal.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: '"Lo oke?" Juno bertanya dengan kasar, tapi perhatiannya tulus. Street kid yang peduli.' }, weight: 8 },
      { condition: {}, action: { type: 'observe', desc: 'Juno gelisah. Matanya menyapu ruangan, mencari ancaman — atau jalan keluar.' }, weight: 6 }
    ],

    // ========== VIRA — The Survivor ==========
    vira: [
      // Cryptic knowledge
      { condition: { chapter: 0 }, action: { type: 'observe', desc: 'Vira berdiri di sudut terjauh. Matanya menyapu ruangan — bukan melihat orang, tapi melihat bangunan. Dia tahu di mana pintu rahasia tersembunyi.' }, weight: 18 },

      // Use mansion knowledge
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Vira menyentuh dinding dengan familiaritas. "Ada ruangan di balik sini. Aku pernah—" Dia berhenti. Kenangan terlalu menyakitkan.' }, weight: 20 },
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Vira membuka bunker tersembunyi yang hanya dia tahu. Enam bulan lalu, lorong ini menyelamatkan hidupnya.' }, weight: 22 },

      // PTSD episodes
      { condition: { minDanger: 50 }, action: { type: 'hide', desc: 'Flashback. Vira membeku — enam bulan lalu kembali dalam gelombang. Napasnya tersendat. Trauma yang tidak pernah sembuh.' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'flee', desc: 'Vira berlari ke bunker tersembunyi. Tubuhnya ingat jalan keluar meskipun pikirannya tidak.' }, weight: 25 },

      // Niko relationship
      { condition: { nearbyIncludes: 'niko', emotion: 'calm' }, action: { type: 'observe', desc: 'Vira menatap Niko dari kejauhan. Pria yang dulu dia cintai. Pria yang membuangnya. Dan sekarang — pria yang mungkin tahu lebih banyak dari yang dia tunjukkan.' }, weight: 15 },
      { condition: { nearbyIncludes: 'niko', minDeaths: 2 }, action: { type: 'confront', desc: '"Niko. Kau tahu mansion ini sama baiknya denganku. BERHENTI BERPURA-PURA."' }, weight: 20 },

      // Guide others
      { condition: { isAlone: false, minDeaths: 1 }, action: { type: 'socialize', desc: '"Ikut aku. Aku tahu tempat yang aman di mansion ini." Vira memimpin kelompok kecil melalui lorong tersembunyi.' }, weight: 18 },

      // Share survival knowledge
      { condition: { hasClue: true }, action: { type: 'share_clue', desc: 'Vira akhirnya bicara: "Enam bulan lalu, aku hampir mati di sini. Ini yang aku tahu tentang sang dalang..."' }, weight: 20 },

      // Late game
      { condition: { chapter: 3 }, action: { type: 'investigate', desc: 'Vira kembali ke tempat di mana dia hampir mati enam bulan lalu. Kali ini, dengan tekad berbeda.' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'move', desc: 'Vira berlari ke bunker tersembunyi yang hanya dia tahu. Tubuhnya mengingat jalan meskipun pikirannya chaos.', moveTo: 'bunker_b3' }, weight: 20 },
      { condition: { emotion: 'calm', chapter: 2 }, action: { type: 'move', desc: 'Vira memimpin kelompok kecil melalui jalan tersembunyi di dinding mansion.', moveTo: 'bunker_b3' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'arin', emotion: 'calm' }, action: { type: 'socialize', desc: '"Arya, aku percaya padamu. Kau mengingatkanku pada diriku sendiri enam bulan lalu — sebelum semuanya berubah." Vira terbuka.' }, weight: 16 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, baca aku. Aku serius. Kalau kau bisa melihat kebohongan, kau akan tahu aku tidak berbohong tentang apa yang terjadi dulu."' }, weight: 14 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Lana. Aku membaca novelmu. Bab 17 — itu bukan fiksi, kan? Kau di sini malam itu." Vira tahu lebih dari yang dia tunjukkan.' }, weight: 20 },

      // --- NEW: Desperation ---
      { condition: { minDeaths: 3, emotion: 'panicked' }, action: { type: 'share_clue', desc: 'Vira akhirnya mengungkap semua yang dia tahu tentang malam enam bulan lalu. "Dengarkan baik-baik, karena aku tidak akan mengulanginya."' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Aku tahu mansion ini. Ikuti aku ke tempat yang aman — ada ruangan yang tidak bisa ditembus."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'scout', desc: 'Vira menyusuri bunker tersembunyi, tubuhnya mengingat setiap belokan dari enam bulan lalu.' }, weight: 18 },
      { condition: { minDanger: 60, isAlone: false }, action: { type: 'secure_exit', desc: 'Vira membuka jalur pelarian tersembunyi. "Ada jalan keluar yang tidak diketahui siapapun. Lewat sini."' }, weight: 22 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'ambush', desc: 'Vira mengatur jebakan di bunker tersembunyi. "Dia pasti lewat sini. Aku tahu cara berpikirnya."' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Vira menutup pintu bunker tersembunyi — dari dalam. "Maaf. Aku sudah pernah hampir mati. Tidak lagi."' }, weight: 12 },
      // Trust-kill: Vira yang sudah trauma — bertindak defensif jika merasa terancam
      { condition: { minDeaths: 2, emotion: 'panicked', minTension: 55 }, action: { type: 'trust_kill', desc: '"Aku sudah pernah hampir mati di sini. TIDAK LAGI." Vira menyerang orang yang paling dia curigai — insting bertahan hidup yang gelap.' }, weight: 18 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Vira menyusuri bunker tersembunyi mansion, mencari petunjuk pelarian yang tersembunyi di tempat yang hanya dia tahu.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: false, hasClue: true }, action: { type: 'share_clue', desc: '"Dengarkan. Enam bulan lalu, aku menemukan ini." Vira membuka semua rahasia yang dia simpan.' }, weight: 22 },
      { condition: { chapter: 4, emotion: 'panicked', isAlone: false }, action: { type: 'coordinate_defense', desc: '"AKU TAHU MANSION INI. Ikut aku — ada bunker di bawah yang tidak diketahui siapapun."' }, weight: 24 },
      { condition: { chapter: 4, nearbyIncludes: 'niko' }, action: { type: 'confront', desc: '"Niko, aku tahu apa yang kau lakukan enam bulan lalu. SEMUA ORANG HARUS TAHU." Vira mengungkap segalanya.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'secure_exit', desc: 'Vira membuka pintu rahasia terakhir mansion. "Ini jalan keluar yang kugunakan terakhir kali."' }, weight: 28 },
      { condition: { chapter: 5, emotion: 'hostile' }, action: { type: 'rally', desc: '"AKU SUDAH SELAMAT SEKALI. AKU AKAN SELAMAT LAGI. SIAPA YANG IKUT?!" Vira memimpin evakuasi.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. Vira berdiri di depan pintu mansion. "Simpul terakhir. Kali ini, AKU yang putuskan akhirnya."' }, weight: 30 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'secure_exit', desc: 'Vira mengaktifkan jalur pelarian terakhir. "SEMUA IKUT AKU. SEKARANG!" Survivor dari masa lalu memimpin yang hidup.' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'juno', emotion: 'panicked' }, action: { type: 'socialize', desc: '"Juno, tolong... aku pernah di sini. Aku tahu apa yang akan terjadi. Kita harus pergi SEKARANG."' }, weight: 16 },
      { condition: { nearbyIncludes: 'reza', emotion: 'suspicious' }, action: { type: 'share_clue', desc: '"Reza, enam bulan lalu ada kejadian yang sama. Aku... aku satu-satunya yang selamat. Ini pola-nya."', target: 'reza' }, weight: 18 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'wary' }, action: { type: 'observe', desc: 'Vira menatap Dimas. Terlalu tenang. Terlalu terkontrol. Seperti seseorang yang sudah tahu apa yang akan terjadi.' }, weight: 14 },
      { condition: { nearbyIncludes: 'kira', emotion: 'calm' }, action: { type: 'socialize', desc: '"Kai, bisakah kau cari rekaman 6 bulan lalu? Aku perlu tahu apa yang terjadi di malam itu — yang tidak aku ingat."' }, weight: 14 },
      { condition: { nearbyIncludes: 'farah', emotion: 'wary' }, action: { type: 'socialize', desc: '"Farah, keluarga Wardhana memiliki mansion ini. Apa kau tahu kenapa kami semua diundang?"' }, weight: 12 },

      // --- Player-reactive: Vira (survivor) — trauma-driven, follows strength ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'observe', desc: '"Hati-hati..." Vira berbisik ke pemain. "Terakhir kali seseorang menyelidiki terlalu dalam... mereka tidak kembali."' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'guard', desc: 'Vira menempel di dekat pemain. Kehadiran seseorang yang kuat membuatnya merasa sedikit lebih aman.' }, weight: 22 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'flee', desc: 'Vira mundur perlahan dari pemain. Instingnya berteriak: orang ini berbahaya.' }, weight: 22 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'observe', desc: 'Vira menyaksikan pemain menuduh seseorang. Matanya yang trauma mencari tanda — apakah ini benar atau panik?' }, weight: 18 },
      { condition: { playerNearby: true, minPlayerSusp: 50, minDeaths: 2 }, action: { type: 'flee', desc: '"Tidak... tidak lagi." Vira menatap pemain dengan mata ketakutan dan berlari. Trauma mengambil alih logika.' }, weight: 24 },
      { condition: { playerNearby: false, playerIsAlly: true }, action: { type: 'move', desc: 'Vira mencari pemain dengan tangan gemetar. Sendirian di mansion ini seperti mimpi buruk yang berulang.' }, weight: 16 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'observe', desc: 'Vira duduk di sudut, memeluk lututnya. Matanya tidak pernah lepas dari pintu keluar.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Vira memeriksa lorong-lorong yang dia ingat dari terakhir kali. Beberapa sudah berubah.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'hide', desc: 'Vira menarik diri ke sudut terjauh ruangan. Pengalaman mengajarkannya untuk tidak menonjol.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Vira bergerak tanpa suara melalui lorong yang familiar. Tubuhnya ingat meskipun pikirannya menolak.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'observe', desc: 'Vira memperhatikan orang-orang dengan mata yang sudah melihat terlalu banyak kematian.' }, weight: 10 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'scout', desc: 'Vira memeriksa tanda-tanda bahaya di sepanjang lorong. Déjà vu yang mengerikan.' }, weight: 12 },
      { condition: { emotion: 'hostile' }, action: { type: 'confront', desc: '"Aku sudah melewati ini. Aku tahu bagaimana ini berakhir. Dan kau TIDAK AKAN membunuhku." Vira berapi-api.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'PTSD menguasai Vira. Dia berlari tanpa arah, dikejar bayangan dari enam bulan lalu.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Vira meringkuk di celah sempit yang gelap. Tempat yang sama di mana dia bersembunyi terakhir kali.' }, weight: 14 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Vira berbisik ke orang terdekat. "Jangan tinggalkan aku sendirian. Tolong."' }, weight: 8 },
      { condition: {}, action: { type: 'hide', desc: 'Vira mencari tempat tersembunyi. Bertahan hidup berarti tidak terlihat.' }, weight: 6 }
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
      { condition: { chapter: 4 }, action: { type: 'guard', desc: 'Reza menjadi benteng terakhir kelompok. "Aku tidak akan kehilangan siapapun lagi malam ini."' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'move', desc: 'Reza melakukan patroli perimeter. Kebiasaan lama tidak pernah mati.', moveTo: 'aula_utama' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'kira', hasClue: true }, action: { type: 'share_clue', desc: '"Kai, cross-reference data digitalmu dengan bukti fisik ini. Aku butuh timeline yang akurat." Reza dan Kai berkolaborasi.', target: 'kira' }, weight: 18 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'suspicious' }, action: { type: 'question', desc: '"Dimas, kau memeriksa tubuh tadi dengan terlalu... nyaman. Jelaskan padaku." Reza menginterogasi Dimas.' }, weight: 20 },
      { condition: { nearbyIncludes: 'arin', emotion: 'wary' }, action: { type: 'socialize', desc: '"Arya, kau jurnalis investigasi. Aku butuh partnerku yang dulu. Bantu aku memecahkan ini." Reza merekrut Arya.' }, weight: 14 },

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
      { condition: { minDeaths: 3, emotion: 'suspicious', minTension: 65 }, action: { type: 'trust_kill', desc: 'Reza menarik napas. Dua puluh tahun di kepolisian mengajarkan satu hal: kadang kau harus bertindak sebelum bukti lengkap. Dan malam ini... dia bertindak.' }, weight: 16 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, hasClue: true, isAlone: false }, action: { type: 'accuse', desc: '"Aku sudah cukup lama jadi detektif. Buktinya mengarah ke satu orang." Reza menunjuk tersangka utama.' }, weight: 26 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Reza memeriksa setiap ruangan dengan ketelitian detektif. "Pasti ada yang terlewat."' }, weight: 22 },
      { condition: { chapter: 4, isAlone: false, minDeaths: 3 }, action: { type: 'coordinate_defense', desc: '"Posisi defensif. Semua di sini. Tidak ada yang keluar sampai aku bilang aman." Reza memimpin seperti kopral.' }, weight: 26 },
      { condition: { chapter: 4, nearbyIncludes: 'juno' }, action: { type: 'guard', desc: 'Reza berdiri di samping Juno. "Nak, aku sudah lihat terlalu banyak orang mati. Kau tidak akan jadi yang berikutnya."' }, weight: 22 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: '"Dua puluh tahun di kepolisian. Aku pernah menghadapi yang lebih buruk. IKUT AKU ATAU MATI."' }, weight: 28 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'accuse', desc: 'Final verdict. Reza mengungkap semua bukti. "Kasus ditutup. Pembunuhnya adalah—"' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. Reza mengambil napas. "Ini kasus terakhirku. Dan aku AKAN menyelesaikannya."' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'niko', emotion: 'suspicious' }, action: { type: 'confront', desc: '"Niko, ini mansionmu. Kau punya akses ke semua ruangan. Dalam investigasi, itu menjadikanmu tersangka utama."' }, weight: 18 },
      { condition: { nearbyIncludes: 'sera', emotion: 'calm' }, action: { type: 'socialize', desc: '"Sera, profilingmu bisa membantu investigasi. Aku butuh analisis psikologis semua orang di sini."' }, weight: 14 },
      { condition: { nearbyIncludes: 'vira', emotion: 'wary' }, action: { type: 'question', desc: '"Vira, kau satu-satunya yang pernah di sini sebelumnya. Apa yang terjadi enam bulan lalu? Ini interogasi resmi."' }, weight: 18 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Reza menatap Lana. Penulis. Kreatif. Terlalu pintar berbohong. "Lana, dalam pengalamanku, penulis fiksi adalah pembohong terbaik."' }, weight: 16 },
      { condition: { nearbyIncludes: 'farah', emotion: 'wary' }, action: { type: 'question', desc: '"Farah, siapa yang mengundang kami semua ke sini? Sebagai pewaris, kau pasti tahu motifnya."' }, weight: 14 },

      // --- Player-reactive: Reza (detective) — methodical, professional, interrogates ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'investigate', desc: '"Teknik investigasimu boleh juga." Reza bekerja bersama pemain, memeriksa bukti dengan mata detektif.' }, weight: 24 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'question', desc: '"Tunggu. Tuduhanmu butuh bukti." Reza menahan pemain. "Aku sudah terlalu sering lihat kasus gagal karena emosi."' }, weight: 22 },
      { condition: { playerNearby: true, playerIsAlly: true, hasClue: true }, action: { type: 'share_clue', desc: 'Reza membuka buku catatannya. "Aku sudah susun timeline. Lihat — ada celah waktu yang tidak bisa dijelaskan oleh siapapun."' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'question', desc: '"Aku perlu kau menjawab beberapa pertanyaan." Reza menatap pemain dengan tatapan interogasi. "Di mana kau satu jam yang lalu?"' }, weight: 24 },
      { condition: { playerNearby: true, minPlayerSusp: 50 }, action: { type: 'confront', desc: '"Bukti menunjuk ke satu arah." Reza menunjukkan catatannya ke pemain. "Dan arah itu menuju KAU."' }, weight: 24 },
      { condition: { playerNearby: false, playerIsAlly: true, minDeaths: 1 }, action: { type: 'move', desc: 'Reza mencari pemain. Partnership investigasi terlalu berharga untuk dibuang — terutama saat kasus memanas.' }, weight: 16 },
      { condition: { playerNearby: true, playerLastAction: 'talk' }, action: { type: 'socialize', desc: '"Dalam investigasi, percakapan adalah senjata paling kuat." Reza berbagi teknik interogasinya dengan pemain.' }, weight: 18 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'investigate', desc: 'Reza memeriksa ruangan secara metodis. "Standard sweep — cek setiap sudut, setiap celah."' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Reza mengeluarkan buku catatan usangnya. Menulis timeline, menandai inkonsistensi.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'observe', desc: 'Reza memperhatikan setiap orang. Siapa yang terlalu tenang. Siapa yang terlalu gelisah.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'scout', desc: 'Reza melakukan patrol rutin. Dua puluh tahun kebiasaan polisi tidak bisa dihentikan.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'confront', desc: '"Alibimu tidak cocok dengan timeline. Jelaskan." Reza menginterogasi dengan dingin.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Reza menyusun puzzle di kepalanya. Setiap keping bukti perlahan membentuk gambar.' }, weight: 10 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'accuse', desc: '"Cukup. Aku punya cukup bukti." Reza berdiri dengan otoritas yang hanya dimiliki mantan polisi.' }, weight: 12 },
      { condition: { emotion: 'hostile', isAlone: true }, action: { type: 'ambush', desc: 'Reza menyiapkan posisi. Detektif tua tahu cara mengatur penyergapan.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'guard', desc: 'Reza menarik senjata improvisasi. "Di belakangku. SEKARANG." Insting protektif polisi.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Reza menemukan posisi defensif — punggung ke dinding, mata ke pintu. Training yang tidak pernah hilang.' }, weight: 10 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: '"Ceritakan padaku apa yang kau lihat." Reza menginterogasi dengan halus — seperti ngobrol biasa, tapi setiap jawaban dicatat.' }, weight: 8 },
      { condition: {}, action: { type: 'investigate', desc: 'Reza memeriksa sekitar. Insting detektif tidak pernah istirahat.' }, weight: 6 }
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
      { condition: { chapter: 3 }, action: { type: 'manipulate', desc: 'Lana mengatur final act-nya. Setiap orang di mansion ini adalah karakter dalam novelnya — dan dia yang menulis endingnya.' }, weight: 22 },

      // --- Tactical survivor Lana ---
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'distract', desc: 'Lana membuat distraksi — menjatuhkan vas antik dengan "tidak sengaja". Semua menoleh. Persis seperti yang dia rencanakan.' }, weight: 18 },
      { condition: { minDeaths: 2, emotion: 'panicked' }, action: { type: 'coordinate_defense', desc: '"Dengarkan aku. Aku tahu cara berpikir seperti pembunuh — aku menulisnya." Lana memimpin strategi pertahanan.' }, weight: 20 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Lana menuju lorong yang sepi. Keahliannya membaca narasi membawanya ke tempat yang belum dijelajahi.', moveTo: 'bunker_b3' }, weight: 14 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, gabungkan profilingmu dengan intuisi naratifku. Pembunuh ini punya pola — dan aku tahu pola cerita."' }, weight: 16 },
      // Trust-kill: Lana manipulatif — membunuh sambil berpura-pura itu self-defense
      { condition: { minDeaths: 2, emotion: 'hostile', minTension: 50 }, action: { type: 'trust_kill', desc: '"Kau plot twist terburuk dalam ceritaku." Lana menyerang dengan tenang — membunuh sambil tersenyum. "Self-defense, tentu saja."' }, weight: 20 },

      // --- Cross-character interactions ---
      { condition: { nearbyIncludes: 'arin', emotion: 'calm' }, action: { type: 'socialize', desc: '"Arya, kau jurnalis kan? Menarik... aku juga menulis fiksi. Bedanya, fiksiku kadang jadi kenyataan."' }, weight: 16 },
      { condition: { nearbyIncludes: 'juno', emotion: 'wary' }, action: { type: 'manipulate', desc: 'Lana mendekati Juno. "Kau kuat, Juno. Tapi kekuatan tanpa arah hanya destruksi. Biarkan aku yang mengarahkan."' }, weight: 14 },
      { condition: { nearbyIncludes: 'reza', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Lana menatap Reza. Detektif. Ancaman terbesar baginya — orang yang terlatih menemukan kebohongan.' }, weight: 16 },
      { condition: { nearbyIncludes: 'farah', emotion: 'calm' }, action: { type: 'manipulate', desc: '"Farah, sayang. Uangmu bisa membeli banyak hal — tapi tidak kebenaran. Biarkan aku yang mengungkapnya untukmu."' }, weight: 14 },
      { condition: { nearbyIncludes: 'vira' }, action: { type: 'observe', desc: 'Lana melirik Vira. Ada sesuatu tentang gadis itu — terlalu banyak rahasia untuk seseorang yang terlihat polos.' }, weight: 12 },
      { condition: { nearbyIncludes: 'kira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Kai, bisakah kau cek sesuatu untukku? Aku menemukan catatan digital yang aneh." Lana memanfaatkan keahlian orang lain.' }, weight: 14 },

      // --- Additional tactical survivor entries ---
      { condition: { chapter: 1 }, action: { type: 'investigate', desc: 'Lana memetakan timeline kematian. Sebagai penulis misteri, dia tahu bahwa urutan peristiwa selalu mengungkap pelaku.' }, weight: 16 },
      { condition: { chapter: 2 }, action: { type: 'manipulate', desc: 'Lana membentuk aliansi sementara. Dia tahu setiap aliansi punya tanggal kadaluarsa — seperti karakter dalam novelnya.' }, weight: 18 },
      { condition: { chapter: 4 }, action: { type: 'confront', desc: 'Lana mengumpulkan semua orang. "Aku tahu siapa pembunuhnya. Dengarkan — ini seperti klimaks novel misteri."' }, weight: 20 },
      { condition: { emotion: 'panicked', minDeaths: 1 }, action: { type: 'coordinate_defense', desc: '"DENGARKAN AKU! Aku menulis 12 novel thriller. Aku tahu cara survive." Lana memimpin dengan otoritas penulis.' }, weight: 16 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'confront', desc: 'Lana berdiri tegak. "Aku sudah menulis ending untukmu, pembunuh. Dan di versi aku — kau kalah."' }, weight: 14 },
      { condition: { emotion: 'suspicious', minDeaths: 1 }, action: { type: 'investigate', desc: 'Lana memeriksa alibi semua orang. Sebagai penulis, dia terbiasa mencari plot holes dalam cerita.' }, weight: 14 },
      { condition: { emotion: 'wary', minDanger: 30 }, action: { type: 'observe', desc: 'Lana mencatat di bukunya. Setiap detail bisa jadi petunjuk — atau bahan novel selanjutnya.' }, weight: 12 },
      { condition: { minDeaths: 1, emotion: 'calm' }, action: { type: 'socialize', desc: 'Lana menenangkan kelompok dengan storytelling. "Dalam setiap cerita, ada harapan. Kita akan menemukan jalan keluar."' }, weight: 14 },

      // --- Player-reactive: Lana (puppeteer as survivor) — manipulative, observant ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'manipulate', desc: '"Investigasi yang menarik." Lana tersenyum ke pemain. "Tapi kau melewatkan sesuatu — aku lihat dari angle novelisku."' }, weight: 22 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'observe', desc: 'Lana menyaksikan pemain menuduh. Matanya menulis setiap kata di kepalanya. "Plot twist yang bagus..."' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'plan', desc: '"Aku sudah menulis skenario ini di kepalaku." Lana berbagi strategi novelistiknya dengan pemain.' }, weight: 22 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'manipulate', desc: 'Lana berbisik ke NPC lain sambil melirik pemain. Puppeteer selalu punya boneka baru.' }, weight: 24 },
      { condition: { playerNearby: true, minPlayerSusp: 40 }, action: { type: 'question', desc: '"Kau karakter yang menarik." Lana mendekat. "Tapi dalam novelku, karakter sepertimu biasanya... antagonis."' }, weight: 20 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'manipulate', desc: 'Lana menyebarkan "gosip" strategis. Setiap kata dirancang untuk memecah aliansi.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Lana menulis. Bukan novel — tapi catatan tentang semua orang. Kelemahan mereka. Ketakutan mereka.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'observe', desc: 'Lana mengamati dengan senyum tipis. Setiap interaksi bisa jadi chapter berikutnya.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Lana menghilang dari kelompok. Karakter utama tidak pernah tinggal di satu tempat terlalu lama.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'manipulate', desc: '"Oh? Kau tidak tahu? Menarik." Lana menjatuhkan informasi palsu dengan timing sempurna.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'plan', desc: 'Lana menulis skenario. Plot A, B, C — setiap orang punya peran, dan dia yang memegang naskah.' }, weight: 10 },
      { condition: { emotion: 'hostile' }, action: { type: 'confront', desc: '"Plot twist, sayang. Villain sebenarnya bukan aku." Lana mengungkap kartu terakhirnya.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'Untuk pertama kalinya, Lana kehilangan kontrol naratif. Dia berlari tanpa rencana.' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Lana bersembunyi di kegelapan. Penulis horor yang akhirnya hidup di dalam novelnya sendiri.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Lana mengobrol dengan charm yang dipelajari. Setiap pertanyaan punya motif tersembunyi.' }, weight: 8 },
      { condition: {}, action: { type: 'observe', desc: 'Lana mengamati. Menyerap. Merencanakan. Seperti penulis mengamati karakternya.' }, weight: 6 }
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
      { condition: { chapter: 3 }, action: { type: 'investigate', desc: 'Dimas menganalisis semua kematian secara klinis. "Pola ini konsisten dengan satu profil psikologis. Aku tahu siapa dalangnya."' }, weight: 22 },

      // --- Tactical survivor Dimas ---
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'move', desc: 'Dimas bergerak dengan tenang ke lokasi strategis. Pengetahuan forensiknya mengajarkan pentingnya posisi.', moveTo: 'basement' }, weight: 14 },
      { condition: { minDeaths: 2, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: '"Reza, lihat pola lukanya. Aku tahu jenis senjata yang dipakai — dan siapa yang punya akses."', target: 'reza' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'barricade', desc: 'Dimas menutup dan mengunci pintu dengan presisi klinis. "Pintu ini tidak akan terbuka dari luar."' }, weight: 18 },
      { condition: { minDeaths: 3, hasClue: true }, action: { type: 'accuse', desc: 'Dimas berdiri tenang. "Berdasarkan analisis forensik — waktu kematian, senjata, akses — pelakunya sudah jelas."' }, weight: 22 },
      { condition: { nearbyIncludes: 'arin', hasClue: true }, action: { type: 'share_clue', desc: '"Arya, sebagai jurnalis kau perlu fakta forensik ini. Ini bukti fisik yang tak terbantahkan."', target: 'arin' }, weight: 16 },
      // Trust-kill: Dimas yang klinis — membunuh berdasarkan "analisis forensik" yang salah sasaran
      { condition: { minDeaths: 2, emotion: 'suspicious', minTension: 55 }, action: { type: 'trust_kill', desc: '"Pola luka, metode, timing — analisis forensikku menunjuk padamu." Dimas bertindak dengan presisi klinis — tapi kali ini salah sasaran.' }, weight: 18 },

      // --- Cross-character interactions ---
      { condition: { nearbyIncludes: 'juno', emotion: 'wary' }, action: { type: 'socialize', desc: '"Juno, kau punya insting bertahan. Aku punya pengetahuan forensik. Kita bisa menutupi kelemahan satu sama lain."' }, weight: 14 },
      { condition: { nearbyIncludes: 'arin', emotion: 'calm' }, action: { type: 'share_clue', desc: '"Arya, sebagai jurnalis kau perlu tahu — pola kematian ini bukan acak. Ada metodologi di baliknya."', target: 'arin' }, weight: 16 },
      { condition: { nearbyIncludes: 'farah' }, action: { type: 'observe', desc: 'Dimas melirik Farah. Pewaris. Privileged. Tapi juga target potensial — seseorang pasti menginginkan kekayaannya.' }, weight: 12 },
      { condition: { nearbyIncludes: 'kira', emotion: 'suspicious' }, action: { type: 'socialize', desc: '"Kai, bisakah kau cross-reference data CCTV dengan timeline forensikku? Dua perspektif lebih baik."' }, weight: 14 },
      { condition: { nearbyIncludes: 'niko', emotion: 'wary' }, action: { type: 'observe', desc: 'Dimas memperhatikan Niko. Tuan rumah tahu terlalu banyak tentang mansion ini. Pengetahuan bisa jadi senjata.' }, weight: 14 },
      { condition: { nearbyIncludes: 'vira', emotion: 'calm' }, action: { type: 'socialize', desc: '"Vira, aku perhatikan kau sangat cemas. Detak jantungmu stabil tapi pupilmu bergetar." Dimas membaca tubuh, bukan kata.' }, weight: 14 },

      // --- Additional tactical survivor entries ---
      { condition: { chapter: 1 }, action: { type: 'investigate', desc: 'Dimas memeriksa alat-alat medis yang ada. Sebagai mahasiswa forensik, dia bisa mengidentifikasi senjata dari luka.' }, weight: 16 },
      { condition: { chapter: 2, minDeaths: 1 }, action: { type: 'investigate', desc: 'Dimas melakukan autopsi mental pada korban. "Luka ini definitif — pelaku terlatih, bukan amatir."' }, weight: 18 },
      { condition: { chapter: 4 }, action: { type: 'accuse', desc: 'Dimas mempresentasikan analisis forensiknya. "Bukti fisik tidak berbohong. Pelaku — berdasarkan semua data — adalah..."' }, weight: 20 },
      { condition: { emotion: 'panicked', minDeaths: 2 }, action: { type: 'coordinate_defense', desc: 'Dimas mengambil alih dengan ketenangan klinis. "Stop panik. Aku tahu area mana yang paling aman secara taktis."' }, weight: 16 },
      { condition: { emotion: 'hostile', isAlone: false }, action: { type: 'confront', desc: 'Dimas menunjukkan bukti forensik dengan dingin. "Data ini tidak bisa dibantah. Kau. Pelakunya."' }, weight: 14 },
      { condition: { emotion: 'suspicious', minDeaths: 2 }, action: { type: 'investigate', desc: 'Dimas memeriksa pola gerakan semua orang. Waktu, lokasi, alibi — semuanya diplot di kepalanya.' }, weight: 14 },
      { condition: { emotion: 'wary', minDanger: 40 }, action: { type: 'barricade', desc: 'Dimas memblokir pintu dengan presisi teknis. "Perimeter aman. Tidak ada yang masuk tanpa sepengetahuan kita."' }, weight: 14 },
      { condition: { minDeaths: 1, emotion: 'calm' }, action: { type: 'observe', desc: 'Dimas mengamati reaksi semua orang terhadap kematian. "Psikologi berkabung versus guilt response — perbedaannya halus."' }, weight: 14 },

      // --- Player-reactive: Dimas (forensic) — clinical, analytical, reads bodies ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'investigate', desc: '"Biar aku analisis bukti itu." Dimas mengambil alih investigasi pemain dengan presisi forensik.' }, weight: 24 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'observe', desc: 'Dimas mengukur detak jantung pemain saat menuduh. "Tuduhanmu... jujur. Cortisol dan pupilmu konsisten."' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true, hasClue: true }, action: { type: 'share_clue', desc: '"Aku punya analisis forensik." Dimas membagi data ke pemain. "Pola darah, sidik jari — semuanya menunjuk ke satu orang."' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'observe', desc: 'Dimas diam-diam mengambil sampel dari pemain. Sidik jari, pola gerakan, micro-expression. Data tidak pernah bohong.' }, weight: 22 },
      { condition: { playerNearby: true, minPlayerSusp: 50 }, action: { type: 'confront', desc: '"Aku sudah analisis semua data." Dimas menatap pemain tanpa emosi. "Kau cocok dengan profil tersangka."' }, weight: 24 },
      { condition: { playerNearby: false, playerIsAlly: true }, action: { type: 'move', desc: 'Dimas butuh partner untuk analisis silang. Pemain adalah satu-satunya yang cukup logis untuk diajak berpikir.' }, weight: 14 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'observe', desc: 'Dimas mengamati setiap orang dengan detachment klinis. Data. Pola. Probabilitas.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Dimas memeriksa ruangan secara forensik. Sidik jari, DNA, pola darah — otaknya tidak pernah berhenti menganalisis.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'observe', desc: 'Dimas memperhatikan nadi seseorang dari kejauhan. Detak jantung tidak bisa bohong.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Dimas bergerak tanpa suara. Mahasiswa forensik yang terbiasa berada di dekat kematian.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'confront', desc: '"Pupilmu melebar. Cortisol tinggi. Kau berbohong." Dimas membaca fisiologi kebohongan.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Dimas memeriksa ulang bukti. Setiap detail forensik punya cerita. Dia hanya perlu mendengarkan.' }, weight: 10 },
      { condition: { emotion: 'hostile' }, action: { type: 'confront', desc: '"Aku tahu cara kerja racun, senjata, dan strangulasi. Jangan uji kesabaranku." Dimas mengancam dengan tenang.' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'hide', desc: 'Bahkan dalam panik, Dimas bergerak dengan efisiensi. Menemukan tempat aman. Mengamankan perimeter.' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Dimas menemukan posisi defensif yang optimal secara taktis. Selalu kalkutatif, bahkan dalam ketakutan.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Dimas berbicara dengan nada datar. "Status lukamu?" Perhatian yang terasa seperti autopsi — tapi tulus.' }, weight: 8 },
      { condition: {}, action: { type: 'observe', desc: 'Dimas berdiri diam. Mengamati. Menganalisis. Ketenangan yang membuat orang lain tidak nyaman.' }, weight: 6 }
    ],

    // ========== KIRA — The Hacker ==========
    kira: [
      // Digital investigation
      { condition: { chapter: 0 }, action: { type: 'investigate', desc: 'Kai mengeluarkan laptop kecilnya. "Wi-Fi mansion ini punya arsitektur aneh. Ada subnet tersembunyi yang—" Matanya melebar.' }, weight: 20 },
      { condition: { emotion: 'calm' }, action: { type: 'investigate', desc: 'Kai meng-scan jaringan internal mansion. Kamera CCTV, speaker system, door locks — semuanya terhubung ke satu server.' }, weight: 22 },

      // Hack systems
      { condition: { emotion: 'wary' }, action: { type: 'investigate', desc: 'Kai berhasil mengakses log CCTV. "Guys... ada rekaman yang dihapus. Tapi tidak ada yang benar-benar terhapus dari hard drive."' }, weight: 25 },
      { condition: { isAlone: true }, action: { type: 'investigate', desc: 'Kai menemukan server room tersembunyi di basement. Di dalamnya — database dengan nama semua tamu. File dibuat enam bulan lalu.' }, weight: 22 },

      // Paranoia
      { condition: { minDanger: 40 }, action: { type: 'hide', desc: 'Kai memutus semua koneksi dan bersembunyi. "Kalau sistem mansion bisa dilacak, aku juga bisa dilacak."' }, weight: 20 },
      { condition: { emotion: 'panicked' }, action: { type: 'flee', desc: 'Kai berlari ke server room — satu-satunya tempat di mana dia merasa punya kontrol.' }, weight: 18 },

      // Share digital evidence
      { condition: { hasClue: true, nearbyIncludes: 'arin' }, action: { type: 'share_clue', desc: 'Kai menunjukkan layar laptopnya ke Arya: "Lihat email ini. Seseorang merencanakan malam ini berbulan-bulan yang lalu."', target: 'arin' }, weight: 22 },
      { condition: { hasClue: true, nearbyIncludes: 'reza' }, action: { type: 'share_clue', desc: 'Kai memperlihatkan rekaman CCTV ke Reza. "Ini bukti digital. Tidak bisa dibantah."', target: 'reza' }, weight: 18 },

      // Disable traps
      { condition: { chapter: 3 }, action: { type: 'investigate', desc: 'Kai meng-hack door lock system mansion. "Aku bisa membuka semua pintu... atau mengunci semuanya. Pilihan kita."' }, weight: 22 },

      // Late game
      { condition: { chapter: 4 }, action: { type: 'investigate', desc: 'Kai menemukan pesan terenkripsi terakhir di server. Ketika di-decrypt, isinya mengubah segalanya.' }, weight: 25 },

      // --- NEW: Movement ---
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'move', desc: 'Kai bergerak ke basement mencari server room. "Semua jawaban ada di data."', moveTo: 'basement' }, weight: 16 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'niko' }, action: { type: 'question', desc: '"Niko, siapa yang memasang Wi-Fi mesh di mansion ini? Arsitekturnya terlalu canggih untuk rumah tua." Kai curiga pada infrastruktur mansion.' }, weight: 18 },
      { condition: { nearbyIncludes: 'sera', hasClue: true }, action: { type: 'share_clue', desc: '"Sera, lihat metadata foto ini. Timestamp-nya diedit. Seseorang sengaja memalsukan alibi digital."', target: 'sera' }, weight: 20 },
      { condition: { nearbyIncludes: 'farah' }, action: { type: 'socialize', desc: '"Farah, aku hack email keluargamu. Jangan marah — tapi kakekmu transfer dana ke rekening yang sama dengan pemilik mansion ini."' }, weight: 16 },

      // --- NEW: Escalation ---
      { condition: { minDeaths: 2, hasClue: true }, action: { type: 'accuse', desc: 'Kai menunjukkan layar laptop: "Lihat log CCTV yang di-recover. Timestamp. Lokasi. Identitas. Game over untuk pembunuh."' }, weight: 22 },

      // --- Tactical protagonist actions ---
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Aku bisa hack sistem door lock. Kita kunci semua pintu kecuali exit utama. Pembunuh terjebak."' }, weight: 20 },
      { condition: { isAlone: true, emotion: 'wary' }, action: { type: 'scout', desc: 'Kai menggunakan remote access ke CCTV untuk mengintai pergerakan di seluruh mansion dari laptopnya.' }, weight: 18 },
      { condition: { emotion: 'panicked' }, action: { type: 'secure_exit', desc: 'Kai meng-hack door lock system. "Semua pintu keluar terbuka. SEKARANG LARI!"' }, weight: 20 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'ambush', desc: 'Kai memasang trip-wire digital di koridor — alarm otomatis jika seseorang lewat.' }, weight: 16 },
      { condition: { minDeaths: 4, emotion: 'panicked' }, action: { type: 'betray', desc: 'Kai mengunci semua pintu dari laptop — termasuk pintu yang mengurung temannya. "Maaf. Aku butuh waktu."' }, weight: 10 },
      // Trust-kill: Kai paranoid — menyerang jika data "membuktikan" seseorang berbahaya
      { condition: { minDeaths: 2, emotion: 'panicked', minTension: 60 }, action: { type: 'trust_kill', desc: '"Data tidak bohong. Log CCTV, posisi GPS, timeline — semuanya menunjuk ke kau." Kai menyerang berdasarkan bukti digitalnya.' }, weight: 16 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Kai meng-crack file terenkripsi terakhir mansion. Di dalamnya — peta jalan keluar.' }, weight: 24 },
      { condition: { chapter: 4, hasClue: true, isAlone: false }, action: { type: 'share_clue', desc: '"Aku berhasil decrypt SEMUA file mansion. Dengarkan — ini blueprint jalan keluarnya."' }, weight: 22 },
      { condition: { chapter: 4, isAlone: false }, action: { type: 'coordinate_defense', desc: '"Aku bisa kunci semua door lock dari laptop. Kita bikin safe zone di sini. TIDAK ADA yang bisa masuk."' }, weight: 24 },
      { condition: { chapter: 4, emotion: 'hostile', hasClue: true }, action: { type: 'accuse', desc: '"Log CCTV, door access, GPS tracking — SEMUANYA menunjuk ke satu orang." Kai mengungkap data.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: '"Aku punya akses ke seluruh sistem mansion. Aku bisa buka SEMUA pintu sekaligus. READY?!"' }, weight: 28 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'secure_exit', desc: 'Kai meng-hack door lock terakhir. "SEMUA PINTU TERBUKA. INI KESEMPATAN TERAKHIR!"' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. "Aku sudah crack semuanya. Simpul terakhir ada di server ini."' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'juno', emotion: 'wary' }, action: { type: 'socialize', desc: '"Juno, gue bisa unlock semua pintu dari sini. Lo cover gue dari ancaman fisik. Deal?"' }, weight: 14 },
      { condition: { nearbyIncludes: 'vira', emotion: 'calm' }, action: { type: 'socialize', desc: '"Vira, enam bulan lalu apa ada sistem keamanan yang sama? Aku perlu tau arsitektur lamanya."' }, weight: 14 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Kai cek log Lana. "Menarik... kau browsing blueprint mansion tiga bulan sebelum pesta ini."' }, weight: 16 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'wary' }, action: { type: 'observe', desc: 'Kai menatap Dimas. "Digital footprint-mu terlalu bersih. Orang normal meninggalkan jejak. Kau tidak."' }, weight: 16 },

      // --- Player-reactive: Kira/Kai (hacker) — tech-savvy, helpful with data ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'investigate', desc: '"Tunggu, aku punya data buat itu." Kai membuka laptop dan menunjukkan log CCTV ke pemain.' }, weight: 24 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'investigate', desc: '"Mau bukti digital?" Kai langsung cek alibi target yang dituduh pemain lewat door access log.' }, weight: 22 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'share_clue', desc: '"Aku nemu sesuatu." Kai menunjukkan layar laptop ke pemain. "Log ini harusnya udah dihapus — tapi aku recover."' }, weight: 26 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'observe', desc: 'Kai diam-diam trace aktivitas digital pemain. "Menarik... kau akses ruangan yang nggak seharusnya kau akses."' }, weight: 22 },
      { condition: { playerNearby: true, minPlayerSusp: 40 }, action: { type: 'confront', desc: '"Aku track pergerakan semua orang lewat WiFi." Kai menunjuk pemain. "Dan pattern-mu... anomali."' }, weight: 22 },
      { condition: { playerNearby: false, playerIsAlly: true, minDanger: 40 }, action: { type: 'move', desc: 'Kai butuh protection saat hacking. Pemain paling reliable buat jaga punggungnya.' }, weight: 16 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'investigate', desc: 'Kai scan jaringan WiFi. "Hm, ada device baru yang terkoneksi... siapa yang bawa phone ke sini?"' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Kai deep-dive ke server mansion. Log file, database, hidden directories — semuanya terbuka.' }, weight: 14 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'observe', desc: 'Kai memonitor feed CCTV dari laptopnya. "Ada yang bergerak di koridor barat."' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'investigate', desc: 'Kai meng-crack enkripsi file terkunci. Setiap password punya pattern — dan dia ahlinya.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'confront', desc: '"Lo punya dua HP. Yang satu burner phone. Mau jelasin?" Kai menunjukkan bukti digital.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Kai trace komunikasi keluar mansion. Seseorang mengirim pesan — dan dia tahu ke mana.' }, weight: 12 },
      { condition: { emotion: 'hostile' }, action: { type: 'accuse', desc: '"Check this out." Kai membuka log yang di-recover. "Timestamp, lokasi, siapa yang masuk ruangan apa. Game over."' }, weight: 12 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'Kai menutup laptop dan lari. "SERVER DOWN. SISTEM OFFLINE. KITA HARUS PERGI!"' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Kai bersembunyi dengan laptop masih terbuka. Bahkan dalam panik, dia tetap monitoring.' }, weight: 12 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: '"Bro, phone lo bisa dipake hotspot? Aku perlu koneksi ke luar." Kai selalu mikirin tech solution.' }, weight: 8 },
      { condition: {}, action: { type: 'investigate', desc: 'Kai nge-type di laptop. Mencari backdoor, exploit, apa saja yang bisa kasih keuntungan digital.' }, weight: 6 }
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
      { condition: { minDanger: 50 }, action: { type: 'hide', desc: 'Farah mengunci diri di perpustakaan atas. "Aku tidak keluar sampai ini selesai." Survival strategy pewaris — biarkan orang lain mengambil risiko.' }, weight: 22 },

      // Family secrets
      { condition: { isAlone: true, chapter: 2 }, action: { type: 'investigate', desc: 'Farah menemukan brankas keluarga Aldridge. Di dalamnya — surat-surat yang menghubungkan keluarganya dengan mansion ini 50 tahun lalu.' }, weight: 22 },
      { condition: { hasClue: true }, action: { type: 'observe', desc: 'Farah membaca dokumen keluarga dengan tangan gemetar. Kakeknya membiayai pembangunan mansion ini. Dan alasannya... mengerikan.' }, weight: 20 },

      // Egois tapi eventually helpful
      { condition: { minDeaths: 3 }, action: { type: 'share_clue', desc: '"Baiklah. Aku akan bicara." Farah akhirnya mengungkap rahasia keluarganya. "Kakekku tahu tentang mansion ini. Dan ini yang dia sembunyikan."' }, weight: 20 },

      // Late game
      { condition: { chapter: 4 }, action: { type: 'negotiate', desc: 'Farah membuat penawaran terakhir: "Aku tahu siapa pemilik asli mansion ini. Informasi ini berharga — tapi aku akan memberikannya gratis. Karena tidak ada gunanya kaya kalau kau mati."' }, weight: 22 },

      // --- NEW: Movement ---
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'move', desc: 'Farah berlari ke perpustakaan atas, mencari safe room keluarga Aldridge.', moveTo: 'perpustakaan' }, weight: 18 },

      // --- NEW: Unique interactions ---
      { condition: { nearbyIncludes: 'niko', emotion: 'calm' }, action: { type: 'negotiate', desc: '"Niko, keluarga kita terikat oleh mansion ini. Aku punya dokumen yang membuktikannya. Ayo bekerja sama."' }, weight: 16 },
      { condition: { nearbyIncludes: 'reza', minDeaths: 1 }, action: { type: 'socialize', desc: '"Detektif Reza. Aku akan memberikan semua informasi keluargaku. Tapi jaga aku tetap hidup. Deal?" Farah bernegosiasi.' }, weight: 14 },
      { condition: { nearbyIncludes: 'kira' }, action: { type: 'socialize', desc: '"Kai, aku butuh kau menghapus sesuatu dari server mansion. Rahasia keluargaku tidak boleh bocor." Farah panik tentang reputasi.' }, weight: 16 },

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
      { condition: { minDeaths: 3, emotion: 'panicked', minTension: 65 }, action: { type: 'trust_kill', desc: '"JANGAN MENDEKAT!" Farah meraih tongkat golf dan menyerang. Ketakutan mengubah pewaris menjadi pembunuh.' }, weight: 14 },

      // --- Chapters 4-5: Escalation ---
      { condition: { chapter: 4, hasClue: true, isAlone: false }, action: { type: 'share_clue', desc: '"Dengar, keluargaku mendanai ini semua. AKU TAHU rahasia mansion ini." Farah membuka segalanya.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'search_escape_clue', desc: 'Farah mencari di brankas keluarga. "Pasti ada kunci atau peta yang ditinggalkan kakek."' }, weight: 22 },
      { condition: { chapter: 4, isAlone: false, minDeaths: 3 }, action: { type: 'coordinate_defense', desc: '"Keluargaku punya safe room di mansion ini. SEMUA pindah ke sana. SEKARANG." Farah memimpin evakuasi.' }, weight: 24 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: '"AKU TIDAK PEDULI LAGI TENTANG UANG. AKU TIDAK PEDULI TENTANG REPUTASI. AKU MAU HIDUP."' }, weight: 28 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'secure_exit', desc: 'Farah membuka kunci master warisan keluarga. "SEMUA PINTU TERBUKA. PERGI SEKARANG!"' }, weight: 26 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'rally', desc: 'Bab terakhir. Farah melepas cincin keluarganya. "Aku pewaris. Dan ini warisanku — menyelamatkan kalian semua."' }, weight: 30 },
      { condition: { chapter: 5, hasClue: true }, action: { type: 'secure_exit', desc: 'Farah mengaktifkan protokol evakuasi keluarga. "Kakek membangun ini untuk keadaan darurat. INI keadaan darurat."' }, weight: 28 },

      // --- Cross-character interactions (missing) ---
      { condition: { nearbyIncludes: 'arin', emotion: 'calm' }, action: { type: 'socialize', desc: '"Arya, sebagai jurnalis kau bisa mempublikasikan ini. Tapi aku minta — lindungi nama keluargaku. Deal?"' }, weight: 14 },
      { condition: { nearbyIncludes: 'sera', emotion: 'wary' }, action: { type: 'socialize', desc: '"Sera, aku butuh seseorang yang bisa membaca orang. Profiling-mu bisa menyelamatkan kita. Apa yang kau butuhkan?"' }, weight: 14 },
      { condition: { nearbyIncludes: 'juno', emotion: 'panicked' }, action: { type: 'socialize', desc: '"Juno, kau pejuang. Aku punya akses ke safe room keluarga. Kau jaga kami, aku buka pintunya."' }, weight: 16 },
      { condition: { nearbyIncludes: 'vira', emotion: 'wary' }, action: { type: 'socialize', desc: '"Vira, kau pernah di sini. Kau dan aku — kita punya koneksi ke mansion ini yang tidak dimiliki orang lain."' }, weight: 14 },
      { condition: { nearbyIncludes: 'lana', emotion: 'suspicious' }, action: { type: 'observe', desc: 'Farah menatap Lana. Penulis yang terlalu tahu. "Lana, novelmu... itu bukan fiksi, kan?"' }, weight: 16 },
      { condition: { nearbyIncludes: 'dimas', emotion: 'calm' }, action: { type: 'observe', desc: 'Farah memperhatikan Dimas. "Forensik. Menarik. Tapi kenapa mahasiswa forensik ada di pesta keluarga Wardhana?"' }, weight: 14 },

      // --- Player-reactive: Farah (heiress) — uses resources/influence based on player ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'share_clue', desc: '"Kau menyelidiki tempat yang tepat." Farah membuka brankas tersembunyi untuk pemain. "Ini milik keluargaku — gunakan."' }, weight: 24 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'socialize', desc: '"Tuduhan yang berani." Farah menatap pemain. "Aku bisa menjamin keamananmu kalau kau benar. Tapi kalau salah..."' }, weight: 20 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'coordinate_defense', desc: '"Aku punya akses ke safe room dan brankas keluarga." Farah menawarkan resource ke pemain. "Aliansi kita saling menguntungkan."' }, weight: 24 },
      { condition: { playerNearby: true, playerIsEnemy: true }, action: { type: 'manipulate', desc: 'Farah berbisik ke NPC lain: "Pemain itu tidak bisa dipercaya. Aku akan pastikan mereka tidak dapat dukungan."' }, weight: 22 },
      { condition: { playerNearby: true, minPlayerSusp: 50 }, action: { type: 'confront', desc: '"Aku pewaris Wardhana. Aku bisa membuatmu dikeluarkan dari mansion ini." Farah mengancam pemain dengan otoritasnya.' }, weight: 22 },
      { condition: { playerNearby: false, playerIsAlly: true }, action: { type: 'move', desc: 'Farah mencari pemain. Sendirian dia hanya pewaris kaya — bersama pemain, dia punya proteksi.' }, weight: 14 },

      // --- Broad catch-all ---
      { condition: { emotion: 'calm', isAlone: false }, action: { type: 'socialize', desc: '"Aku bisa membayar siapapun untuk membantu." Farah menggunakan satu-satunya senjata yang dia tahu — uang.' }, weight: 10 },
      { condition: { emotion: 'calm', isAlone: true }, action: { type: 'investigate', desc: 'Farah memeriksa dokumen keluarga yang tersebar di meja. Rahasia Wardhana-Aldridge tertulis di sini.' }, weight: 12 },
      { condition: { emotion: 'wary', isAlone: false }, action: { type: 'socialize', desc: '"Kita butuh strategi. Aku punya koneksi — kalau kita bisa keluar." Farah mencoba bernegosiasi.' }, weight: 10 },
      { condition: { emotion: 'wary', isAlone: true }, action: { type: 'hide', desc: 'Farah mencari tempat aman. Privilege mengajarkannya untuk selalu punya safe room.' }, weight: 12 },
      { condition: { emotion: 'suspicious', isAlone: false }, action: { type: 'observe', desc: 'Farah memperhatikan orang-orang. Bisnis mengajarkan cara membaca lawan — siapa yang bisa dipercaya, siapa yang tidak.' }, weight: 10 },
      { condition: { emotion: 'suspicious', isAlone: true }, action: { type: 'investigate', desc: 'Farah membuka brankas tersembunyi. Setiap keluarga kaya punya rahasia — dan dia tahu di mana menyimpannya.' }, weight: 12 },
      { condition: { emotion: 'hostile' }, action: { type: 'confront', desc: '"Aku TIDAK akan mati di sini. Kau tahu siapa aku." Farah menggunakan otoritasnya yang terakhir.' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: false }, action: { type: 'flee', desc: 'Farah meraih tangan siapapun. "BAYAR BERAPAPUN — BAWA AKU KELUAR!"' }, weight: 10 },
      { condition: { emotion: 'panicked', isAlone: true }, action: { type: 'hide', desc: 'Farah menangis di sudut. Semua uang di dunia tidak bisa membeli keselamatan di sini.' }, weight: 14 },
      { condition: { isAlone: false }, action: { type: 'socialize', desc: 'Farah menawarkan "kontrak" — perlindungan sebagai imbalan informasi. Bisnis bahkan di ambang kematian.' }, weight: 8 },
      { condition: {}, action: { type: 'hide', desc: 'Farah mencari tempat teraman yang bisa ditemukan. Bertahan hidup dengan privilege terakhirnya.' }, weight: 6 }
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

      // === KILL: HANYA saat hanya ada 1 target non-killer (isolasi) ===
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Lana bergerak dengan presisi novelis yang mengeksekusi plot twist-nya sendiri. Sempurna. Mematikan.' }, weight: 30 },

      // === COVER UP ===
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'frame', desc: 'Lana "menemukan" bukti yang menunjuk ke orang lain. "Ya Tuhan, lihat ini..." Aktris terbaik.' }, weight: 25 },
      { condition: { minDeaths: 2, isAlone: false }, action: { type: 'maintain_cover', desc: 'Lana menangis tersedu. "Aku takut..." Akting Oscar-worthy yang menyembunyikan predator di baliknya.' }, weight: 20 },

      // === TERDESAK: Berkhianat pada killer lain ===
      { condition: { minTension: 60, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: '"Dimas menjadi beban." Lana merencanakan mengekspos Dimas demi keselamatannya sendiri.', target: 'dimas' }, weight: 26 },
      { condition: { minTension: 70, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Lana meninggalkan bukti mengarah ke Niko. "Tuan rumah selalu tersangka pertama."', target: 'niko' }, weight: 24 },
      { condition: { emotion: 'executing', minTension: 80 }, action: { type: 'flee', desc: 'Topeng jatuh. Lana berjalan pergi dengan anggun. "Setiap cerita butuh villain."' }, weight: 20 },

      // === LATE GAME: Fokus isolasi dan eksekusi ===
      { condition: { chapter: 3, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Late game. Lana memecah kelompok survivor yang tersisa — isolasi sebelum eksekusi.' }, weight: 28 },
      { condition: { chapter: 3, minDeaths: 2, isAlone: false }, action: { type: 'isolate', desc: 'Late game. Lana memisahkan survivor terakhir dari kelompok — eksekusi butuh kesendirian.' }, weight: 25 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Endgame. Lana memutuskan hanya satu yang boleh selamat — Dimas hanyalah bidak.', target: 'dimas' }, weight: 28 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Endgame. Niko harus disingkirkan.', target: 'niko' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK (prioritas tinggi) ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Lana mencari dan menghancurkan petunjuk pelarian. Kalau survivor menemukan 5, semuanya tamat.' }, weight: 26 },

      // === SIASAT LANJUTAN: Cari target terisolasi ===
      { condition: { emotion: 'stalking', isAlone: true }, action: { type: 'move', desc: 'Lana membuntuti survivor yang sendirian — predator sabar yang menunggu momen sempurna.' }, weight: 20 },
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'manipulate', desc: '"Aku dengar suara aneh di sayap timur." Lana membuat alasan agar survivor berpencar.' }, weight: 22 },
      { condition: { minDeaths: 1, isAlone: false }, action: { type: 'distract', desc: 'Lana berpura-pura menemukan sesuatu penting. "LIHAT INI!" — mengalihkan perhatian dari rekan killernya.' }, weight: 20 },

      // === Chapters 4-5: Late-game killer escalation ===
      { condition: { chapter: 4, isAlone: false, minDeaths: 2 }, action: { type: 'divide', desc: 'Chapter 7. Lana menggunakan semua kartu dramanya. "ADA YANG DI BALIK DINDING INI!" — pisahkan survivor.' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'hunting', isAlone: true }, action: { type: 'destroy_clue', desc: 'Lana memprioritaskan penghancuran petunjuk. Kalau survivor menemukan 5, novelnya berakhir.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: false }, action: { type: 'frame', desc: 'Chapter 8. Lana menangis histeris. "DIA YANG MEMBUNUH MEREKA SEMUA!" — frame survivor terkuat.' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Endgame. Lana berhenti berpura-pura. Penulisnya menutup buku — dengan darah.' }, weight: 28 },
      { condition: { chapter: 5, minTension: 70 }, action: { type: 'sabotage', desc: 'Lana menyabotase jalur pelarian. Kalau dia tidak bisa menang, tidak ada yang boleh kabur.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: true }, action: { type: 'destroy_clue', desc: 'Desperate. Lana menghancurkan semua petunjuk yang bisa dia temukan sebelum terlambat.' }, weight: 24 },
      { condition: { chapter: 5, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Bab terakhir. "Setiap cerita butuh ending. Dan aku yang menulis milikmu." Lana menyerang.' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'divide', desc: 'Final chapter. Lana membuat kepanikan terakhir — ledakan emosi yang memecah kelompok.' }, weight: 28 },

      // --- Player-reactive (killer): Lana targets/manipulates the player ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'distract', desc: '"Oh! Aku juga menemukan sesuatu!" Lana mengalihkan pemain dari bukti yang sebenarnya.' }, weight: 26 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'frame', desc: 'Lana menangis saat pemain menuduh seseorang. "Kau yakin itu benar? Karena aku lihat orang lain..." — redirect suspicion.' }, weight: 24 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'manipulate', desc: '"Aku percaya padamu." Lana merangkul pemain — menjaganya tetap dekat, dan tetap tidak curiga.' }, weight: 24 },
      { condition: { playerNearby: true, minPlayerSusp: 40 }, action: { type: 'frame', desc: 'Lana diam-diam menyebarkan rumor tentang pemain ke survivor lain. Redirect perhatian.' }, weight: 22 },
      { condition: { playerNearby: false, emotion: 'hunting' }, action: { type: 'move', desc: 'Lana mencari pemain. Target utama harus diawasi — atau disingkirkan.' }, weight: 20 },

      // --- Broad catch-all killer ---
      { condition: { emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Lana tersenyum dan bersosialisasi. Serigala di antara domba.' }, weight: 8 },
      { condition: { emotion: 'hunting' }, action: { type: 'move', desc: 'Lana mencari posisi strategis — dekat target, jauh dari saksi.' }, weight: 8 },
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Saatnya. Lana bergerak — dalang yang mengeksekusi bab terakhir novelnya.' }, weight: 10 },
      { condition: {}, action: { type: 'observe', desc: 'Lana mengamati. Setiap orang adalah karakter dalam ceritanya — dan dia yang menulis endingnya.' }, weight: 5 }
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

      // === KILL: HANYA saat hanya ada 1 target non-killer (isolasi) ===
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
      { condition: { chapter: 3, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Late game. Dimas memecah kelompok survivor — isolasi target untuk kill.' }, weight: 28 },
      { condition: { chapter: 3, minDeaths: 2, isAlone: false }, action: { type: 'isolate', desc: 'Late game. Dimas mencari target yang bisa dipisahkan — harus sendirian untuk eksekusi.' }, weight: 25 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: 'Endgame. Dimas mengkhianati Lana demi keselamatannya sendiri.', target: 'lana' }, weight: 28 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'niko' }, action: { type: 'sabotage_killer', desc: 'Endgame. Dimas mengkhianati Niko — hanya satu yang boleh menang.', target: 'niko' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Dimas mencari dan membakar petunjuk pelarian dengan presisi klinis.' }, weight: 24 },

      // === SIASAT LANJUTAN: Pisahkan kelompok, cari target sendirian ===
      { condition: { emotion: 'stalking', isAlone: true }, action: { type: 'move', desc: 'Dimas bergerak diam-diam mencari survivor yang terpisah dari kelompok.' }, weight: 18 },
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'distract', desc: 'Dimas berpura-pura mendengar sesuatu. "Ada suara dari basement..." — mengalihkan perhatian kelompok.' }, weight: 20 },
      { condition: { isAlone: false, minDeaths: 1 }, action: { type: 'manipulate', desc: 'Dimas memanfaatkan rasa takut. "Siapa yang terakhir bersama korban? Kita perlu interogasi terpisah."' }, weight: 22 },

      // === Chapters 4-5: Late-game killer escalation ===
      { condition: { chapter: 4, isAlone: false, minDeaths: 2 }, action: { type: 'divide', desc: 'Chapter 7. Dimas memanipulasi rasa takut. "Pembunuh masih di antara kita. Kita perlu berpencar untuk mencari."' }, weight: 26 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'destroy_clue', desc: 'Dimas menghancurkan petunjuk pelarian dengan efisiensi klinis — tanpa emosi, hanya prosedur.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: false }, action: { type: 'frame', desc: 'Chapter 8. Dimas menempatkan bukti palsu dengan presisi bedah. "Lihat apa yang kutemukan di tasnya..."' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'executing', isAlone: true }, action: { type: 'trap', desc: 'Endgame. Dimas menyiapkan jebakan farmakologis terakhir di koridor.' }, weight: 24 },
      { condition: { chapter: 5, minTension: 70 }, action: { type: 'sabotage', desc: 'Dimas meracuni persediaan air. Pengetahuan farmakologi yang digunakan untuk hal terburuk.' }, weight: 26 },
      { condition: { chapter: 5, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Dimas bergerak. Tanpa ragu. Tanpa emosi. Prosedur terakhir.' }, weight: 28 },
      { condition: { chapter: 5, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Bab terakhir. Dimas menunjukkan wajah aslinya. "Aku bukan mahasiswa. Aku instrumen."' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'divide', desc: 'Final. Dimas membuat kepanikan terakhir — sabotase sistem mansion untuk memecah kelompok.' }, weight: 28 },

      // --- Player-reactive (killer): Dimas uses forensic knowledge to deceive player ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'manipulate', desc: '"Aku bisa bantu analisis." Dimas menawarkan bantuan forensik — untuk mengacaukan investigasi pemain dari dalam.' }, weight: 26 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'maintain_cover', desc: 'Dimas dengan tenang menunjukkan "bukti forensik" yang mengarah ke orang lain. "Data tidak bohong — tapi aku yang kontrol datanya."' }, weight: 24 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'maintain_cover', desc: 'Dimas tersenyum ke pemain. Partner forensik yang sempurna — dan predator yang sabar.' }, weight: 22 },
      { condition: { playerNearby: true, minPlayerSusp: 30 }, action: { type: 'frame', desc: 'Dimas menanam "bukti forensik" yang mengarah ke pemain. Sidik jari yang ditempatkan dengan hati-hati.' }, weight: 24 },
      { condition: { playerNearby: false, emotion: 'hunting' }, action: { type: 'move', desc: 'Dimas mencari pemain. Target yang paling berbahaya harus diawasi — atau dinetralkan.' }, weight: 20 },

      // --- Broad catch-all killer ---
      { condition: { emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Dimas berdiri diam, mengamati. Ketenangan klinis yang menyembunyikan predator.' }, weight: 8 },
      { condition: { emotion: 'hunting' }, action: { type: 'move', desc: 'Dimas bergerak tanpa suara. Mencari target yang terpisah dari kelompok.' }, weight: 8 },
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Dimas bertindak dengan presisi bedah. Tidak ada emosi. Hanya prosedur.' }, weight: 10 },
      { condition: {}, action: { type: 'observe', desc: 'Dimas mengamati. Menghitung. Menunggu momen yang tepat.' }, weight: 5 }
    ],

    niko: [
      // === FASE AWAL: Tuan rumah yang concerned (cover) ===
      { condition: { emotion: 'stalking', chapter: 0 }, action: { type: 'maintain_cover', desc: 'Niko memainkan peran tuan rumah yang concerned. "Tenang semua." Ironi yang sempurna.' }, weight: 22 },

      // === SIASAT: Kontrol mansion, pecah kelompok (KUNCI STRATEGI) ===
      { condition: { isAlone: true, emotion: 'stalking' }, action: { type: 'plan', desc: 'Niko membuka panel rahasia dan mengakses kontrol mansion. "Rumahku. Aturanku."' }, weight: 20 },
      { condition: { emotion: 'stalking', isAlone: false }, action: { type: 'divide', desc: '"Kita harus berpencar untuk cari clue." Niko memecah kelompok — kambing menjauhi kawanan.' }, weight: 28 },
      { condition: { isAlone: false }, action: { type: 'sabotage', desc: 'Niko mematikan lampu di sayap mansion. Dalam kegelapan, kelompok terpisah — persis seperti yang dia rencanakan.' }, weight: 24 },
      { condition: { isAlone: false }, action: { type: 'distract', desc: '"ADA SUARA DI LANTAI ATAS!" Niko membuat kepanikan palsu untuk memecah kelompok.' }, weight: 22 },
      { condition: { emotion: 'stalking', chapter: 2 }, action: { type: 'move', desc: 'Niko bergerak ke panel kontrol rahasia mansion.', moveTo: 'basement' }, weight: 16 },

      // === HUNTING: Sabotase infrastruktur, isolasi ===
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'isolate', desc: '"Vira, kita perlu bicara." Niko mencoba memisahkan seseorang — lebih mudah dibunuh sendirian.' }, weight: 24 },
      { condition: { emotion: 'hunting', isAlone: true }, action: { type: 'trap', desc: 'Niko mengaktifkan jebakan mansion yang hanya dia tahu. Tuan rumah punya keuntungan absolut.' }, weight: 20 },

      // === KILL: HANYA saat hanya ada 1 target non-killer (isolasi) ===
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Niko menunjukkan wajah aslinya. Predator yang sudah merencanakan ini bertahun-tahun.' }, weight: 28 },

      // === COVER ===
      { condition: { minDeaths: 1, isAlone: false, emotion: 'stalking' }, action: { type: 'frame', desc: 'Niko "menemukan" bukti menunjuk ke seseorang. "Aku tidak percaya... teman kita sendiri?"' }, weight: 22 },
      { condition: { minDeaths: 1, isAlone: false, emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Niko bersikap sebagai tuan rumah yang peduli. "Aku yang paling tahu mansion ini." Ironi kejam.' }, weight: 18 },

      // === TERDESAK: Khianat killer lain ===
      { condition: { minTension: 60, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: '"Lana, kau bukan bagian dari rencana ini lagi." Niko mengekspos Lana.', target: 'lana' }, weight: 26 },
      { condition: { minTension: 60, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Niko mengaktifkan CCTV yang merekam Dimas. "Hanya satu yang boleh selamat."', target: 'dimas' }, weight: 24 },
      { condition: { minTension: 70 }, action: { type: 'confront', desc: 'Niko berhenti berpura-pura. "Mansion ini milikku. Kalian tamu."' }, weight: 20 },

      // === LATE GAME ===
      { condition: { chapter: 4, minDeaths: 2, isAlone: false }, action: { type: 'divide', desc: 'Endgame. Niko menggunakan mansion untuk memisahkan survivor — matikan listrik, kunci pintu.' }, weight: 28 },
      { condition: { chapter: 4, minDeaths: 2, isAlone: false }, action: { type: 'sabotage', desc: 'Endgame. Niko mematikan listrik sayap barat mansion — dalam kegelapan, kelompok terpisah.' }, weight: 25 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'lana' }, action: { type: 'sabotage_killer', desc: 'Niko mengorbankan Lana demi menjadi satu-satunya yang selamat.', target: 'lana' }, weight: 28 },
      { condition: { chapter: 4, minTension: 50, nearbyIncludes: 'dimas' }, action: { type: 'sabotage_killer', desc: 'Niko mengkhianati Dimas — mansion ini hanya untuk satu pemenang.', target: 'dimas' }, weight: 28 },

      // === PENGHILANGAN PETUNJUK ===
      { condition: { isAlone: true }, action: { type: 'destroy_clue', desc: 'Niko menggunakan pengetahuan mansionnya untuk menemukan dan menghancurkan petunjuk pelarian.' }, weight: 26 },

      // === SIASAT LANJUTAN: Kontrol infrastruktur mansion ===
      { condition: { emotion: 'stalking', isAlone: true }, action: { type: 'sabotage', desc: 'Niko mematikan lampu di koridor — dalam kegelapan, kelompok terpisah.' }, weight: 20 },
      { condition: { emotion: 'hunting', isAlone: false }, action: { type: 'distract', desc: '"ADA YANG MENCURIGAKAN DI SAYAP UTARA!" Niko mengarahkan kelompok ke arah berbeda.' }, weight: 22 },
      { condition: { isAlone: false, minDeaths: 1 }, action: { type: 'manipulate', desc: 'Niko menggunakan otoritas tuan rumah. "Aku sarankan kita berpencar — aku tahu mansion ini." Jebakan sempurna.' }, weight: 24 },

      // === Chapters 4-5: Late-game killer escalation ===
      { condition: { chapter: 4, isAlone: false }, action: { type: 'sabotage', desc: 'Chapter 7. Niko mengaktifkan sistem keamanan mansion — mengunci sayap-sayap tertentu, memisahkan survivor.' }, weight: 26 },
      { condition: { chapter: 4, isAlone: true }, action: { type: 'destroy_clue', desc: 'Niko menggunakan pengetahuan mansionnya untuk menemukan dan menghancurkan petunjuk pelarian.' }, weight: 24 },
      { condition: { chapter: 4, isAlone: false }, action: { type: 'frame', desc: 'Chapter 8. "AKU LIHAT DIA MEMBUNUH KORBAN!" Niko berpura-pura panik dan menuduh survivor.' }, weight: 26 },
      { condition: { chapter: 4, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Niko menghentikan semua akting. "Mansion ini MILIKKU. Dan kalian semua tamu yang tak diundang."' }, weight: 28 },
      { condition: { chapter: 5, minTension: 70 }, action: { type: 'sabotage', desc: 'Niko mematikan semua listrik mansion. Dalam kegelapan absolut — tuan rumah memiliki keuntungan.' }, weight: 26 },
      { condition: { chapter: 5, isAlone: true }, action: { type: 'trap', desc: 'Niko mengaktifkan jebakan-jebakan tersembunyi mansion — warisan keluarganya yang mematikan.' }, weight: 24 },
      { condition: { chapter: 5, emotion: 'executing' }, action: { type: 'eliminate', desc: 'Bab terakhir. Niko berdiri di aula utama. "Selamat datang di endgame. Mansion ini kuburan kalian."' }, weight: 30 },
      { condition: { chapter: 5, isAlone: false }, action: { type: 'sabotage', desc: 'Final. Niko mengunci semua pintu mansion dari panel kontrol. "Tidak ada yang keluar."' }, weight: 28 },

      // --- Player-reactive (killer): Niko uses mansion knowledge against the player ---
      { condition: { playerNearby: true, playerLastAction: 'investigate' }, action: { type: 'manipulate', desc: '"Biar kutunjukkan tempat yang lebih menarik." Niko mengarahkan pemain ke jalan buntu — tuan rumah yang berbahaya.' }, weight: 26 },
      { condition: { playerNearby: true, playerLastAction: 'accuse' }, action: { type: 'manipulate', desc: '"Tuduhan yang menarik." Niko tersenyum. "Tapi sebagai tuan rumah, aku punya perspektif yang berbeda..." — redirect.' }, weight: 24 },
      { condition: { playerNearby: true, playerIsAlly: true }, action: { type: 'maintain_cover', desc: '"Kita satu tim." Niko menawarkan akses ke ruangan rahasia — menjebak pemain dalam aliansi palsu.' }, weight: 24 },
      { condition: { playerNearby: true, minPlayerSusp: 30 }, action: { type: 'frame', desc: 'Niko "menemukan" bukti di dekat pemain. "Hmm, ini menarik..." Tuan rumah yang menyiapkan perangkap.' }, weight: 24 },
      { condition: { playerNearby: false, emotion: 'hunting' }, action: { type: 'sabotage', desc: 'Niko mengunci koridor menuju pemain. Mansion ini senjatanya — dan pemain adalah target utama.' }, weight: 22 },

      // --- Broad catch-all killer ---
      { condition: { emotion: 'stalking' }, action: { type: 'maintain_cover', desc: 'Niko tersenyum. Tuan rumah yang sempurna. Tidak ada yang curiga.' }, weight: 8 },
      { condition: { emotion: 'hunting' }, action: { type: 'sabotage', desc: 'Niko memanipulasi infrastruktur mansion — lampu, pintu, alarm. Rumahnya, senjatanya.' }, weight: 8 },
      { condition: { emotion: 'executing' }, action: { type: 'eliminate', desc: 'Niko menunjukkan wajah aslinya. Predator yang merencanakan ini sejak awal.' }, weight: 10 },
      { condition: {}, action: { type: 'plan', desc: 'Niko berpikir. Menghitung. Mansion ini adalah papan caturnya — dan dia rajanya.' }, weight: 5 }
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
