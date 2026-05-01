/* ============================================================
   SIMPUL TERAKHIR — Game Engine (Reworked)
   10 karakter, killer system per difficulty, post-modern horror
   ============================================================ */

// ---- Security Hardening Module ----
const SecGuard = (() => {
  // Anti-clickjacking: break out of iframes
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // Prevent prototype pollution via __proto__ assignment
  Object.defineProperty(Object.prototype, '__proto__', {
    get() { return Object.getPrototypeOf(this); },
    set() { /* blocked */ }
  });

  // Sanitize HTML — strip dangerous tags/attributes
  function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object\b[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<form\b[^>]*>.*?<\/form>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/javascript\s*:/gi, 'blocked:')
      .replace(/data\s*:\s*text\/html/gi, 'blocked:text/html')
      .replace(/vbscript\s*:/gi, 'blocked:');
  }

  // Safe JSON parse — validates structure, catches malicious payloads
  function safeJSONParse(str, fallback) {
    if (typeof str !== 'string' || str.length === 0) return fallback;
    if (str.length > 5 * 1024 * 1024) return fallback; // Max 5MB
    try {
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === 'object' && parsed.__proto__) {
        delete parsed.__proto__;
      }
      if (parsed && typeof parsed === 'object' && parsed.constructor && parsed.constructor !== Object && parsed.constructor !== Array) {
        return fallback;
      }
      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  // Safe localStorage wrapper
  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage write failed:', e.message);
    }
  }

  // Validate save data integrity
  function validateSaveData(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.version !== 'number') return false;
    if (!data.state || typeof data.state !== 'object') return false;
    if (typeof data.currentNodeId !== 'string') return false;
    // Check for suspicious keys that could indicate tampering
    const allowedKeys = ['version', 'state', 'currentNodeId', 'chapter', 'timestamp', 'checksum'];
    const keys = Object.keys(data);
    for (const k of keys) {
      if (!allowedKeys.includes(k) && !k.startsWith('_')) {
        // Unknown key, could be injected
      }
    }
    return true;
  }

  // Simple checksum for save data integrity
  function computeChecksum(data) {
    const str = JSON.stringify(data.state) + data.currentNodeId + data.version;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash |= 0;
    }
    return hash;
  }

  // Block devtools tampering detection
  function detectTampering() {
    // Detect if state has been modified externally
    return false; // Placeholder — log suspicious activity
  }

  // Disable right-click context menu on game area (anti-inspect)
  document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('#screen-game')) {
      e.preventDefault();
    }
  });

  // Disable common devtools shortcuts on game area
  document.addEventListener('keydown', function(e) {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
    if (e.target.closest('#screen-game')) {
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    }
  });

  return {
    sanitizeHTML,
    safeJSONParse,
    safeGetItem,
    safeSetItem,
    validateSaveData,
    computeChecksum,
    detectTampering
  };
})();

const Engine = (() => {
  let lang = 'id';
  let state = {};
  let storyNodes = {};
  let currentNodeId = null;
  let brainActionCount = 0;
  let isBrainRevisit = false;
  let brainActionHistory = [];  // Track executed brain actions per node to prevent looping
  const BRAIN_MAX_PER_NODE = 5; // Max brain actions per node for survivor
  const BRAIN_MAX_PER_NODE_KILLER = 3; // Max brain actions per node for killer — slower pacing
  const MAX_PLAYER_OPTIONS = 6; // Max choices shown to player per node — brain interactive first
  const MAX_PLAYER_OPTIONS_KILLER = 4; // Killer gets fewer choices — less overwhelming
  let typingTimeout = null;

  // ---- 7 Unique Tools System ----
  // Each tool can only be held by one character. Once picked up, no one else can get it.
  // Tools trigger based on events and provide support or execution abilities.
  const GAME_TOOLS = {
    pisau_dapur:    { name: 'Pisau Dapur', icon: '\uD83D\uDD2A', type: 'weapon', desc: 'Senjata jarak dekat. +40% chance kill, tapi meninggalkan bukti darah.', triggerLoc: 'dapur', offense: 40, defense: 10, evidence: true },
    kunci_master:   { name: 'Kunci Master', icon: '\uD83D\uDD11', type: 'support', desc: 'Buka semua pintu di mansion. Akses ke lorong rahasia dan bunker.', triggerLoc: 'ruang_penyimpanan', offense: 0, defense: 20, unlocks: true },
    suntikan:       { name: 'Suntikan Obat Bius', icon: '\uD83D\uDC89', type: 'weapon', desc: 'Bius target tanpa suara. +50% chance eliminasi diam-diam, tanpa bukti.', triggerLoc: 'basement', offense: 50, defense: 0, silent: true },
    radio_portabel: { name: 'Radio Portabel', icon: '\uD83D\uDCFB', type: 'support', desc: 'Komunikasi jarak jauh. Bisa panggil bantuan atau koordinasi aliansi.', triggerLoc: 'menara', offense: 0, defense: 30, comms: true },
    tali_baja:      { name: 'Tali Baja', icon: '\u26D3\uFE0F', type: 'weapon', desc: 'Ikat atau jebak target. +35% chance tangkap, bisa untuk barricade.', triggerLoc: 'taman_dalam', offense: 35, defense: 15, trap: true },
    obor_api:       { name: 'Obor Api', icon: '\uD83D\uDD25', type: 'dual', desc: 'Penerangan + senjata darurat. +20% offense, +25% defense, mengintimidasi.', triggerLoc: 'galeri_timur', offense: 20, defense: 25, intimidate: true },
    laptop_kira:    { name: 'Laptop Terenkripsi', icon: '\uD83D\uDCBB', type: 'support', desc: 'Akses data mansion: CCTV, log pintu, komunikasi tersembunyi. +40% investigasi.', triggerLoc: 'perpustakaan', offense: 0, defense: 15, intel: true }
  };

  // Track which tools are owned by which characters
  // state.toolOwnership = { toolId: charName } — added to defaultState
  let endingsUnlocked = SecGuard.safeJSONParse(SecGuard.safeGetItem('simpul_endings'), {});

  const MAIN_CHARACTERS = ['arin', 'niko', 'sera', 'juno', 'vira'];
  const SIDE_CHARACTERS = ['reza', 'lana', 'dimas', 'kira', 'farah'];
  const CHARACTERS = MAIN_CHARACTERS.concat(SIDE_CHARACTERS);

  const CHAR_DISPLAY = {
    arin: 'Arin', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira',
    reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kira', farah: 'Farah'
  };

  const CHAR_PORTRAITS = {
    arin: 'img/arin.png', niko: 'img/niko.png', sera: 'img/sera.png',
    juno: 'img/juno.png', vira: 'img/vira.png',
    reza: null, lana: null, dimas: null, kira: null, farah: null
  };

  const CHAR_COLORS = {
    arin: '#4a7c59', niko: '#2c2c2c', sera: '#c4956a', juno: '#c44d3d', vira: '#4a2d5c',
    reza: '#5a4e3c', lana: '#8b0000', dimas: '#3a6b8c', kira: '#00b4d8', farah: '#b8860b'
  };

  const CHAR_INITIALS = {
    reza: 'RH', lana: 'LM', dimas: 'DS', kira: 'KC', farah: 'FA'
  };

  const CHAR_TAGLINES = {
    arin: 'Protagonis — podcaster true crime, pencari kebenaran',
    niko: 'Tuan rumah — CEO muda dengan agenda tersembunyi',
    sera: 'Psikolog forensik — membaca orang seperti buku terbuka',
    juno: 'Street artist — pemberontak dengan luka tersembunyi',
    vira: 'Enigma — kembali dari menghilang, berubah total',
    reza: 'Ex-detektif — disewa sebagai keamanan, insting masih tajam',
    lana: 'Novelis horor — bukunya terlalu mirip kenyataan',
    dimas: 'Mahasiswa forensik — terlalu tenang di dekat kematian',
    kira: 'Hacker — menemukan anomali digital di undangan',
    farah: 'Pewaris — melindungi rahasia keluarga dengan nyawa'
  };

  // ---- Role Selection System ----
  // Player can only choose: Killer role (specific char) or Survivor role (random char)
  const ROLE_DESCRIPTIONS = {
    arin: {
      role: 'Investigator',
      perk: '+20% pencarian petunjuk',
      desc: 'Jurnalis investigasi. Insting tajam untuk menemukan clue tersembunyi di setiap lokasi.',
      icon: 'pencarian'
    },
    niko: {
      role: 'Tuan Rumah',
      perk: '+1 jalur gerakan ekstra',
      desc: 'Pewaris mansion. Tahu jalan rahasia — selalu punya 1 opsi gerakan tambahan ke ruangan tersembunyi.',
      icon: 'kunci'
    },
    sera: {
      role: 'Profiler',
      perk: 'Lihat emosi & kecurigaan NPC akurat',
      desc: 'Psikolog forensik. Bisa membaca level emosi dan kecurigaan NPC dengan presisi tinggi saat observasi.',
      icon: 'jiwa'
    },
    juno: {
      role: 'Pemberontak',
      perk: '+20% defense & +15% flee',
      desc: 'Street artist dengan naluri bertarung. Lebih tangguh saat diserang dan lebih cepat melarikan diri.',
      icon: 'api'
    },
    vira: {
      role: 'Saksi Selamat',
      perk: 'Mulai dengan 2 lokasi clue diketahui',
      desc: 'Pernah di mansion ini. Sudah tahu lokasi 2 petunjuk pelarian sejak awal permainan.',
      icon: 'bayangan'
    },
    reza: {
      role: 'Detektif',
      perk: '+15% akurasi tuduhan & deteksi',
      desc: 'Mantan detektif. Tuduhan lebih akurat dan bisa mendeteksi perilaku mencurigakan lebih baik.',
      icon: 'lencana'
    },
    lana: {
      role: 'Dalang',
      perk: '+20% framing & -15% terdeteksi',
      desc: 'Novelis horor. Manipulasi dan framing lebih efektif, dan lebih sulit dideteksi sebagai killer.',
      icon: 'pena',
      killerOnly: true
    },
    dimas: {
      role: 'Operator',
      perk: '+15% kill & silent elimination',
      desc: 'Mahasiswa forensik. Presisi klinis dalam eliminasi — lebih tinggi chance kill dan lebih sedikit bukti.',
      icon: 'pisau',
      killerOnly: true
    },
    kira: {
      role: 'Hacker',
      perk: '+25% investigasi digital',
      desc: 'Ethical hacker. Investigasi digital super efektif — akses CCTV, log, dan data tersembunyi.',
      icon: 'terminal'
    },
    farah: {
      role: 'Pewaris',
      perk: '+15% trust & aliansi',
      desc: 'Pewaris Aldridge. Pengaruh sosial tinggi — lebih mudah membangun kepercayaan dan membentuk aliansi.',
      icon: 'mahkota'
    }
  };

  // ---- Character Abilities (Passive Bonuses) ----
  const CHARACTER_ABILITIES = {
    // Survivor abilities
    arin:  { clueSearch: 20, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0 },
    sera:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 20, emotionRead: true },
    niko:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, extraMovement: true },
    juno:  { clueSearch: 0, defense: 20, offense: 0, trust: 0, investigation: 0, flee: 15, accusation: 0, detection: 0 },
    vira:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, startClues: 2 },
    reza:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 15, detection: 10 },
    kira:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 25, flee: 0, accusation: 0, detection: 0 },
    farah: { clueSearch: 0, defense: 0, offense: 0, trust: 15, investigation: 0, flee: 0, accusation: 0, detection: 0, allianceBonus: 10 },
    // Killer abilities
    lana:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, framingBonus: 20, stealthBonus: 15 },
    dimas: { clueSearch: 0, defense: 0, offense: 15, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, silentKill: true }
  };

  function getCharAbility(charName, abilityType) {
    const abilities = CHARACTER_ABILITIES[charName];
    if (!abilities) return 0;
    return abilities[abilityType] || 0;
  }

  function hasCharAbility(charName, abilityType) {
    const abilities = CHARACTER_ABILITIES[charName];
    if (!abilities) return false;
    return !!abilities[abilityType];
  }

  // Perspective text helpers
  function isPlayer(charName) {
    return state.playerCharacter === charName;
  }
  function playerChar() {
    return state.playerCharacter || 'arin';
  }
  function playerName() {
    return CHAR_DISPLAY[playerChar()] || 'Arin';
  }
  function isPlayerKiller() {
    return state.killers && state.killers.includes(playerChar());
  }
  function getPlayerPerspective() {
    const pc = playerChar();
    const perspectives = {
      arin: { openingThought: 'Insting jurnalismu berderak — ada cerita di sini, dan kau akan menemukannya.', strength: 'investigasi' },
      niko: { openingThought: 'Ini mansionmu. Dosa keluargamu. Dan malam ini, kau akan menghadapinya.', strength: 'pengetahuan mansion' },
      sera: { openingThought: 'Kau membaca ruangan — setiap ekspresi mikro, setiap gesture, setiap kebohongan yang tersembunyi di balik senyum.', strength: 'profiling' },
      juno: { openingThought: 'Tempat ini bikin lo gerah. Terlalu banyak orang pake topeng. Lo cuma mau satu hal: jalan keluar.', strength: 'aksi langsung' },
      vira: { openingThought: 'Kau pernah di sini. Kau ingat lorong-lorong ini. Kau ingat bau ini. Kau ingat ketakutan ini.', strength: 'pengetahuan rahasia' },
      reza: { openingThought: 'Dua puluh tahun di kepolisian mengajarimu satu hal: kalau sesuatu terasa salah, biasanya memang salah.', strength: 'taktik' },
      lana: { openingThought: 'Sempurna. Skenarionya berjalan persis seperti yang kau tulis. Sekarang, bab selanjutnya.', strength: 'manipulasi' },
      dimas: { openingThought: 'Tenang. Klinis. Observasi tanpa emosi. Seperti di ruang autopsi — hanya saja subjeknya masih hidup. Untuk sekarang.', strength: 'forensik' },
      kira: { openingThought: 'WiFi mansion ini punya 14 perangkat terhubung. Seharusnya 10 — satu per tamu. Empat sisanya... menarik.', strength: 'hacking' },
      farah: { openingThought: 'Mansion ini dibangun dengan uang keluargamu. Setiap batu bata, setiap lorong — milikmu. Dan rahasia di bawahnya juga.', strength: 'influence' }
    };
    return perspectives[pc] || perspectives.arin;
  }

  // Killer assignments per difficulty
  const KILLER_CONFIG = {
    1: { killers: ['lana'], accomplices: [] },
    2: { killers: ['lana', 'dimas'], accomplices: [] },
    3: { killers: ['lana', 'dimas', 'niko'], accomplices: [] }
  };

  function defaultState(difficulty, playerCharacter) {
    const diff = difficulty || 2;
    const pc = playerCharacter || 'arin';
    const killerConf = KILLER_CONFIG[diff] || KILLER_CONFIG[2];
    return {
      chapter: 0,
      difficulty: diff,
      playerCharacter: pc,
      nodeHistory: [],
      alive: {
        arin: true, niko: true, sera: true, juno: true, vira: true,
        reza: true, lana: true, dimas: true, kira: true, farah: true
      },
      suspicion: {
        arin: 0, niko: 0, sera: 0, juno: 0, vira: 0,
        reza: 0, lana: 0, dimas: 0, kira: 0, farah: 0
      },
      courage: {
        arin: 50, niko: 70, sera: 30, juno: 55, vira: 40,
        reza: 65, lana: 45, dimas: 35, kira: 40, farah: 25
      },
      awareness: { arin: 10, niko: 15, sera: 25, juno: 10, vira: 5 },
      trust: {
        arin_niko: 60, arin_sera: 70, arin_juno: 65, arin_vira: 45,
        arin_reza: 40, arin_lana: 35, arin_dimas: 30, arin_kira: 50, arin_farah: 30,
        niko_sera: 40, niko_juno: 45, niko_vira: 55,
        niko_reza: 50, niko_lana: 35, niko_dimas: 40, niko_kira: 30, niko_farah: 60,
        sera_juno: 70, sera_vira: 35,
        sera_reza: 45, sera_lana: 40, sera_dimas: 45, sera_kira: 50, sera_farah: 35,
        juno_vira: 30, juno_reza: 40, juno_lana: 30, juno_dimas: 25, juno_kira: 55, juno_farah: 20,
        vira_reza: 30, vira_lana: 50, vira_dimas: 35, vira_kira: 40, vira_farah: 30,
        reza_lana: 25, reza_dimas: 20, reza_kira: 45, reza_farah: 30,
        lana_dimas: 60, lana_kira: 30, lana_farah: 25,
        dimas_kira: 25, dimas_farah: 35,
        kira_farah: 30
      },
      flags: {},
      items: [],
      killers: killerConf.killers.slice(),
      killerRevealed: [],
      dangerLevel: 10,
      moralScore: 0,
      keyChoices: [],
      deathCount: 0,
      cluesFound: 0,
      // Escape Clue System: survivors find clues to escape mansion
      escapeClues: [],           // Array of found escape clue IDs
      destroyedClues: [],        // Array of destroyed escape clue IDs (by killers)
      totalEscapeClues: 15,            // 15 total clues in mansion
      cluesNeededToWin: 8,             // Protagonist wins if 8 found before killers destroy them
      alliances: [],
      npcMinds: null,
      roundCount: 0,
      playerLocation: 'aula_utama',
      npcActionLog: [],
      winLossResult: null,
      killersDead: [],            // Track killed killers specifically
      witnessedKillers: [],       // Killers whose murder was witnessed
      autoSimDone: false,         // Whether auto-simulation has run
      autoSimLog: [],             // Log of auto-simulation events
      toolOwnership: {},       // { toolId: charName } — each tool held by max 1 char
      playerStatus: {          // Realtime player condition
        detected: false,       // Killer knows player is investigating
        panicked: false,       // Player is in panic state
        wounded: false,        // Player took damage
        killThreat: null,      // Which killer is threatening player (charName or null)
        woundCount: 0,         // Number of wounds taken
        toolId: null           // Tool held by player (max 1)
      }
    };
  }

  // ---- Difficulty multiplier ----
  function diffMult() {
    if (!state.difficulty) return 1;
    return [0.6, 1, 1.5][state.difficulty - 1] || 1;
  }

  // ---- Trust helpers ----
  function trustKey(a, b) {
    const sorted = [a, b].sort();
    return sorted[0] + '_' + sorted[1];
  }
  function getTrust(a, b) { return state.trust[trustKey(a, b)] || 50; }
  function modTrust(a, b, delta) {
    const k = trustKey(a, b);
    const old = state.trust[k] || 50;
    const adjusted = Math.round(delta * diffMult());
    state.trust[k] = Math.max(0, Math.min(100, old + adjusted));
    if (Math.abs(adjusted) >= 4) showRelChange(a, b, adjusted);
  }

  // ---- Awareness helper ----
  function modAwareness(char, delta) {
    const mult = state.difficulty === 3 ? 0.5 : state.difficulty === 1 ? 1.5 : 1;
    const adjusted = Math.round(delta * mult);
    state.awareness[char] = Math.max(0, Math.min(100, (state.awareness[char] || 0) + adjusted));
  }

  // ---- Danger level (replaces entity power) ----
  function modDanger(delta) {
    const adjusted = Math.round(delta * diffMult());
    state.dangerLevel = Math.max(0, Math.min(100, state.dangerLevel + adjusted));
  }

  // ---- Suspicion system ----
  function modSuspicion(char, delta) {
    let adjustedDelta = delta;
    // Lana's stealth ability: gains less suspicion when caught
    if (delta > 0 && char === playerChar()) {
      const stealthBonus = getCharAbility(char, 'stealthBonus');
      if (stealthBonus > 0) {
        adjustedDelta = Math.max(1, Math.round(delta * (1 - stealthBonus / 100)));
      }
    }
    state.suspicion[char] = Math.max(0, Math.min(100, (state.suspicion[char] || 0) + adjustedDelta));
  }

  // ---- Is this character a killer? ----
  function isKiller(name) {
    return state.killers && state.killers.includes(name);
  }

  // ---- Escape Clue Locations ----
  const ESCAPE_CLUE_LOCATIONS = {
    perpustakaan:      { id: 'esc_peta_mansion',     name: 'Peta Rahasia Mansion',     desc: 'Peta tua yang menunjukkan jalur rahasia keluar mansion.' },
    basement:          { id: 'esc_kode_pintu',       name: 'Kode Pintu Darurat',       desc: 'Serangkaian angka yang tertulis di dinding — kode untuk pintu darurat.' },
    bunker_b3:         { id: 'esc_blueprint',        name: 'Blueprint Terowongan',     desc: 'Cetak biru terowongan bawah tanah yang mengarah ke luar.' },
    menara:            { id: 'esc_sinyal',           name: 'Frekuensi Radio Darurat',  desc: 'Frekuensi radio yang bisa memanggil bantuan dari luar.' },
    lorong_rahasia:    { id: 'esc_kunci_terowongan', name: 'Kunci Terowongan',         desc: 'Kunci berkarat yang membuka pintu terowongan pelarian.' },
    ruang_penyimpanan: { id: 'esc_jurnal_pendiri',   name: 'Jurnal Pendiri',           desc: 'Jurnal Hendarto Wardhana yang mencatat semua jalan keluar mansion.' },
    atap:              { id: 'esc_jalur_atap',       name: 'Jalur Pelarian Atap',      desc: 'Tangga darurat tersembunyi di sisi atap yang mengarah ke tebing.' },
    dapur:             { id: 'esc_pintu_dapur',      name: 'Pintu Belakang Dapur',     desc: 'Kunci cadangan pintu belakang dapur yang mengarah ke halaman.' },
    galeri_timur:      { id: 'esc_panel_galeri',     name: 'Panel Rahasia Galeri',     desc: 'Panel dinding tersembunyi yang membuka lorong ke luar.' },
    taman_dalam:       { id: 'esc_pagar_taman',      name: 'Celah Pagar Taman',        desc: 'Celah di pagar taman yang cukup besar untuk lewat.' },
    koridor_selatan:   { id: 'esc_ventilasi',        name: 'Peta Ventilasi',           desc: 'Skema ventilasi mansion — jalur keluar tersembunyi.' },
    aula_utama:        { id: 'esc_dokumen_aula',     name: 'Dokumen Evakuasi',         desc: 'Dokumen prosedur evakuasi darurat mansion yang sudah lama dilupakan.' },
    kamar_tamu:        { id: 'esc_catatan_tamu',     name: 'Catatan Tamu Lama',        desc: 'Catatan tamu sebelumnya yang berisi petunjuk jalur pelarian.' },
    ruang_musik:       { id: 'esc_partitur',         name: 'Partitur Tersembunyi',     desc: 'Partitur musik yang jika dimainkan membuka pintu rahasia.' },
    gudang:            { id: 'esc_kunci_gudang',     name: 'Kunci Gudang Luar',        desc: 'Kunci yang membuka gudang di luar mansion — akses ke jalan kabur.' }
  };

  // ---- Kill character ----
  function killChar(name) {
    state.alive[name] = false;
    state.deathCount++;
    if (state.killers && state.killers.includes(name)) {
      if (!state.killersDead) state.killersDead = [];
      if (!state.killersDead.includes(name)) state.killersDead.push(name);
    }
    bloodDrip();
    screenShake();
    deathFlash();
  }

  // ---- Check if can die (difficulty gating) ----
  function canDie() {
    if (state.difficulty === 1 && state.deathCount >= 2 && state.chapter < 3) return false;
    if (state.difficulty === 2 && state.deathCount >= 4 && state.chapter < 3) return false;
    return true;
  }

  // ---- Get alive count ----
  function aliveCount() {
    return CHARACTERS.filter(c => state.alive[c]).length;
  }
  function aliveMainCount() {
    return MAIN_CHARACTERS.filter(c => state.alive[c]).length;
  }
  function aliveKillerCount() {
    return (state.killers || []).filter(k => state.alive[k]).length;
  }
  function aliveSurvivorCount() {
    return CHARACTERS.filter(c => state.alive[c] && !(state.killers || []).includes(c)).length;
  }

  // ---- Escape Clue Helpers ----
  function getEscapeClueAtLocation(loc) {
    const clue = ESCAPE_CLUE_LOCATIONS[loc];
    if (!clue) return null;
    if (state.escapeClues && state.escapeClues.includes(clue.id)) return null;
    if (state.destroyedClues && state.destroyedClues.includes(clue.id)) return null;
    return clue;
  }
  function findEscapeClue(clueId) {
    if (!state.escapeClues) state.escapeClues = [];
    if (!state.escapeClues.includes(clueId)) {
      state.escapeClues.push(clueId);
    }
  }
  function destroyEscapeClue(clueId) {
    if (!state.destroyedClues) state.destroyedClues = [];
    if (!state.destroyedClues.includes(clueId)) {
      state.destroyedClues.push(clueId);
    }
  }
  function canEscape() {
    const needed = state.cluesNeededToWin || 8;
    return (state.escapeClues || []).length >= needed;
  }
  function triggerMansionEscape() {
    // 8+ clues found → all killers revealed and executed
    (state.killers || []).forEach(k => {
      if (!state.killerRevealed.includes(k)) state.killerRevealed.push(k);
      if (state.alive[k]) {
        state.alive[k] = false;
        state.deathCount++;
        if (!state.killersDead) state.killersDead = [];
        if (!state.killersDead.includes(k)) state.killersDead.push(k);
      }
    });
    bloodDrip();
    screenShake();
  }
  function allKillersDead() {
    return (state.killers || []).every(k => !state.alive[k]);
  }

  // ---- Alliance system ----
  function addAlliance(members) {
    state.alliances.push({ members, strength: 50 });
  }

  // ---- Tool System ----
  function isToolAvailable(toolId) {
    return !state.toolOwnership[toolId];
  }
  function getToolOwner(toolId) {
    return state.toolOwnership[toolId] || null;
  }
  function getCharTool(charName) {
    for (const [tid, owner] of Object.entries(state.toolOwnership)) {
      if (owner === charName) return tid;
    }
    return null;
  }
  function pickupTool(charName, toolId) {
    if (!isToolAvailable(toolId)) return false;
    if (getCharTool(charName)) return false; // Already has a tool
    state.toolOwnership[toolId] = charName;
    if (charName === (state.playerCharacter || 'arin')) {
      state.playerStatus.toolId = toolId;
    }
    return true;
  }
  function getToolBonus(charName, bonusType) {
    const tid = getCharTool(charName);
    if (!tid) return 0;
    const tool = GAME_TOOLS[tid];
    if (!tool) return 0;
    return tool[bonusType] || 0;
  }

  // ---- Chance % System ----
  function rollChance(baseChance, charName, bonusType) {
    const toolBonus = getToolBonus(charName, bonusType);
    // Difficulty-based protagonist advantage
    let diffBonus = 0;
    const isPlayerKiller = state.killers && state.killers.includes(charName);
    if (!isPlayerKiller && (bonusType === 'intel' || bonusType === 'defense')) {
      const diff = state.difficulty || 2;
      diffBonus = diff === 1 ? 15 : diff === 2 ? 10 : 5;
    } else if (isPlayerKiller && bonusType === 'offense') {
      const diff = state.difficulty || 2;
      diffBonus = diff === 1 ? -15 : diff === 2 ? -10 : -5;
    }
    // Character ability bonus
    let abilityBonus = 0;
    if (charName === playerChar()) {
      if (bonusType === 'intel') abilityBonus += getCharAbility(charName, 'clueSearch') + getCharAbility(charName, 'investigation');
      if (bonusType === 'defense') abilityBonus += getCharAbility(charName, 'defense');
      if (bonusType === 'offense') abilityBonus += getCharAbility(charName, 'offense');
    }
    const totalChance = Math.min(95, Math.max(5, baseChance + toolBonus + diffBonus + abilityBonus));
    const roll = Math.random() * 100;
    return { success: roll < totalChance, chance: totalChance, roll: Math.round(roll) };
  }

  // ---- Player Status Management ----
  function updatePlayerStatus(gameState) {
    if (!gameState.playerStatus) return;
    const pc = gameState.playerCharacter || 'arin';
    const ps = gameState.playerStatus;
    const playerLoc = gameState.playerLocation || 'aula_utama';

    // Check if killer is at player location
    ps.killThreat = null;
    if (gameState.npcMinds) {
      for (const k of (gameState.killers || [])) {
        if (gameState.alive[k] && gameState.npcMinds[k] && gameState.npcMinds[k].location === playerLoc) {
          const mind = gameState.npcMinds[k];
          if (mind.emotion === 'hunting' || mind.emotion === 'executing') {
            ps.killThreat = k;
            break;
          }
        }
      }
    }

    // Check detected state
    ps.detected = false;
    if (gameState.npcMinds) {
      for (const k of (gameState.killers || [])) {
        if (gameState.alive[k] && gameState.npcMinds[k]) {
          const susp = gameState.npcMinds[k].suspicions[pc] || 0;
          if (susp > 60) { ps.detected = true; break; }
        }
      }
    }

    // Panic state
    ps.panicked = (gameState.dangerLevel || 0) > 60 || ps.wounded || !!ps.killThreat;

    renderPlayerStatusBar();
  }

  function renderPlayerStatusBar() {
    const bar = $('player-status-bar');
    if (!bar) return;
    const ps = state.playerStatus;
    if (!ps) return;
    const pc = state.playerCharacter || 'arin';
    const pcName = typeof CharBrain !== 'undefined' ? CharBrain.charName(pc) : pc;
    const tid = getCharTool(pc);
    const tool = tid ? GAME_TOOLS[tid] : null;

    let html = `<div class="ps-name">${pcName}</div><div class="ps-tags">`;

    if (ps.wounded) html += `<span class="ps-tag ps-wounded">TERLUKA (${ps.woundCount}x)</span>`;
    if (ps.killThreat) {
      const threatName = typeof CharBrain !== 'undefined' ? CharBrain.charName(ps.killThreat) : ps.killThreat;
      html += `<span class="ps-tag ps-threat">ANCAMAN: ${threatName}</span>`;
    }
    if (ps.detected) html += `<span class="ps-tag ps-detected">TERDETEKSI</span>`;
    if (ps.panicked) html += `<span class="ps-tag ps-panicked">PANIK</span>`;
    if (!ps.wounded && !ps.killThreat && !ps.detected && !ps.panicked) html += `<span class="ps-tag ps-safe">AMAN</span>`;

    html += `</div>`;
    if (tool) {
      html += `<div class="ps-tool">${tool.icon} ${tool.name}</div>`;
    }
    // Escape clue progress
    const isK = state.killers && state.killers.includes(pc);
    const escFound = (state.escapeClues || []).length;
    const escTotal = state.totalEscapeClues || 6;
    const escDestroyed = (state.destroyedClues || []).length;
    const killersAlive = (state.killers || []).filter(k => state.alive[k]).length;
    const totalKillers = (state.killers || []).length;
    const witnessedCount = (state.witnessedKillers || []).filter(k => state.alive[k]).length;
    const cluesNeeded = state.cluesNeededToWin || 8;
    if (!isK) {
      html += `<div class="ps-escape">Petunjuk: ${escFound}/${cluesNeeded} (${escTotal} total) | Killer: ${totalKillers - killersAlive}/${totalKillers}`;
      if (witnessedCount > 0) html += ` | Diburu: ${witnessedCount}`;
      html += `</div>`;
    } else {
      const survivorsLeft = Object.keys(state.alive).filter(k => state.alive[k] && !(state.killers || []).includes(k)).length;
      html += `<div class="ps-escape">Target: ${survivorsLeft} tersisa | Petunjuk dihancurkan: ${escDestroyed}</div>`;
    }

    // Character location detail — like WhatsApp "last seen" / subtitle
    const playerLoc = state.playerLocation || 'aula_utama';
    const locDisplayName = typeof CharBrain !== 'undefined' ? CharBrain.locName(playerLoc) : playerLoc;
    let nearbyInfo = '';
    if (state.npcMinds) {
      const nearbyChars = Object.keys(state.npcMinds).filter(n =>
        state.alive[n] && state.npcMinds[n] && state.npcMinds[n].location === playerLoc && n !== pc
      );
      const nearbyNames = nearbyChars.map(n => typeof CharBrain !== 'undefined' ? CharBrain.charName(n) : n);
      if (nearbyNames.length > 0) {
        nearbyInfo = ` \u2014 bersama <span class="loc-nearby">${nearbyNames.join(', ')}</span>`;
      } else {
        nearbyInfo = ` \u2014 <span class="loc-nearby">sendirian</span>`;
      }
    }
    html += `<div class="ps-location"><span class="loc-icon">\uD83D\uDCCD</span>${locDisplayName}${nearbyInfo}</div>`;

    bar.innerHTML = html;
    bar.style.display = 'flex';
  }

  // ---- i18n ----
  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'function') return obj(state);
    const val = obj[lang] || obj.id || obj.en || '';
    if (typeof val === 'function') return val(state);
    return val;
  }

  const $ = id => document.getElementById(id);

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
  }

  function notify(msg) {
    const el = $('notification');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  function showRelChange(a, b, delta) {
    const div = document.createElement('div');
    div.className = 'rel-change ' + (delta > 0 ? 'positive' : 'negative');
    const aName = CHAR_DISPLAY[a] || a;
    const bName = CHAR_DISPLAY[b] || b;
    const symbol = delta > 0 ? '\u25B2' : '\u25BC';
    div.textContent = `${aName} & ${bName} ${symbol}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  // ---- CSS Avatar for side characters ----
  function getPortraitHTML(charName, cssClass) {
    const cls = cssClass || 'speaker-portrait';
    if (CHAR_PORTRAITS[charName]) {
      return `<img class="${cls}" src="${CHAR_PORTRAITS[charName]}" alt="${charName}">`;
    }
    const initials = CHAR_INITIALS[charName] || charName.charAt(0).toUpperCase();
    const color = CHAR_COLORS[charName] || '#666';
    return `<span class="${cls} css-avatar" style="background:${color}">${initials}</span>`;
  }

  // ---- Horror Effects ----
  function screenShake() {
    const el = $('screen-game');
    if (el) { el.classList.add('screen-shake'); setTimeout(() => el.classList.remove('screen-shake'), 400); }
  }
  function bloodDrip() {
    const div = document.createElement('div');
    div.className = 'blood-drip';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
  }
  function glitch() {
    const el = $('story-text');
    if (el) { el.classList.add('glitch-effect'); setTimeout(() => el.classList.remove('glitch-effect'), 600); }
  }
  function deathFlash() {
    const div = document.createElement('div');
    div.className = 'death-flash';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }
  function showChapterTitle(title) {
    const div = document.createElement('div');
    div.className = 'chapter-transition';
    div.innerHTML = '<span>' + title + '</span>';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3200);
  }
  function initParticles() {
    let container = document.querySelector('.particle-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'particle-container';
      document.body.appendChild(container);
    }
    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
      container.appendChild(p);
    }
  }
  function updateDangerAmbient() {
    let el = document.querySelector('.entity-ambient');
    if (state.dangerLevel > 30) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'entity-ambient';
        document.body.appendChild(el);
      }
      el.style.opacity = Math.min(1, (state.dangerLevel - 30) / 70);
    } else if (el) {
      el.remove();
    }
  }

  // ---- Text Rendering (Chatbox Style) ----
  function getChatAvatarHTML(charKey) {
    if (CHAR_PORTRAITS[charKey]) {
      return `<img class="chat-avatar" src="${CHAR_PORTRAITS[charKey]}" alt="${charKey}">`;
    }
    const initials = CHAR_INITIALS[charKey] || charKey.charAt(0).toUpperCase();
    const color = CHAR_COLORS[charKey] || '#666';
    return `<span class="chat-avatar css-avatar" style="background:${color}">${initials}</span>`;
  }

  const KILLER_CHARS = ['lana', 'dimas', 'niko'];

  let staggerTimers = [];
  let lastSpeaker = '';
  let pendingStaggerCallback = null;

  function clearStaggerTimers() {
    staggerTimers.forEach(t => clearTimeout(t));
    staggerTimers = [];
  }

  const NARRATION_VISIBLE_MAX = 0;
  const DIALOG_ONLY_MODE = true; // Pure dialog focus — skip all narration

  // Generate a fake in-game timestamp for chat messages
  let chatMinuteCounter = 0;
  function getChatTimestamp() {
    const baseHour = 21; // 21:00 (9 PM — story starts at night)
    const mins = chatMinuteCounter;
    chatMinuteCounter += Math.floor(Math.random() * 3) + 1;
    const h = baseHour + Math.floor(mins / 60);
    const m = mins % 60;
    return String(h % 24).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }
  function resetChatTimestamp() { chatMinuteCounter = 0; }

  function convertToChatbox(html) {
    const temp = document.createElement('div');
    temp.innerHTML = SecGuard.sanitizeHTML(html);
    const pc = playerChar();

    // First pass: build a list of typed items
    const items = [];
    Array.from(temp.childNodes).forEach(node => {
      if (node.nodeType === 3 && !node.textContent.trim()) return;

      // Skip scene-art divs entirely in chat mode
      if (node.nodeType === 1 && node.classList && node.classList.contains('scene-art')) return;

      if (node.nodeType === 1 && node.tagName !== 'P') {
        // Keep location-context, npc-round-narrative (now chat-ified), and wl-alert
        if (node.classList && node.classList.contains('wl-alert')) {
          items.push({ type: 'other', html: node.outerHTML });
        } else if (node.classList && node.classList.contains('location-context')) {
          items.push({ type: 'other', html: node.outerHTML });
        } else if (node.classList && node.classList.contains('npc-round-narrative')) {
          // Convert NPC round events into system-style chat messages
          const events = node.querySelectorAll('p');
          events.forEach(ev => {
            items.push({ type: 'system', html: ev.innerHTML || ev.textContent });
          });
        }
        return;
      }

      if (node.nodeType === 3) {
        // Skip loose text nodes entirely — fokus dialog only
        return;
      }

      if (node.nodeType === 1 && node.tagName === 'P') {
        const speakerEl = node.querySelector('.speaker');

        if (speakerEl) {
          const charClasses = Array.from(speakerEl.classList).filter(c => c !== 'speaker');
          const charKey = charClasses[0] || '';
          const charDisplayName = CHAR_DISPLAY[charKey] || speakerEl.textContent.trim();
          const msgContent = node.innerHTML
            .replace(/<img[^>]*class="speaker-portrait"[^>]*>/g, '')
            .replace(/<span class="speaker [^"]*">[^<]*<\/span>/g, '')
            .trim();

          // In DIALOG_ONLY_MODE: skip speaker-tagged narration (no quotes = narration)
          if (DIALOG_ONLY_MODE) {
            const plainMsg = msgContent.replace(/<[^>]+>/g, '').trim();
            const hasQuotes = /["\u201C\u201D"']/.test(plainMsg.charAt(0)) || /["\u201C\u201D"']/.test(plainMsg);
            const isDialogLine = hasQuotes || plainMsg.startsWith('"') || plainMsg.startsWith('\u201C');
            // If no quotes at all, it's narration — convert to brief action if short, skip if long
            if (!isDialogLine && plainMsg.length > 0) {
              if (plainMsg.length <= 120) {
                items.push({ type: 'action', charKey, charDisplayName, text: plainMsg });
              }
              // Skip long narration entirely
              return;
            }
          }

          const isPlayer = charKey === pc;
          const isKiller = KILLER_CHARS.includes(charKey);
          const isEntity = charKey === 'entity';
          items.push({ type: 'bubble', charKey, charDisplayName, msgContent, isPlayer, isKiller, isEntity });
        } else {
          const text = node.innerHTML.trim();
          if (!text) return;
          const pClasses = Array.from(node.classList);

          if (pClasses.includes('journal')) {
            items.push({ type: 'journal', html: node.outerHTML });
            return;
          }
          if (pClasses.includes('sound') || node.querySelector('.sound')) {
            items.push({ type: 'sound', html: text });
            return;
          }

          // Detect untagged dialog (starts with quote mark) — treat as player speech
          const plainText = node.textContent.trim();
          if (/^[""\u201C\u201D]/.test(plainText) || /^["']/.test(plainText)) {
            items.push({
              type: 'bubble',
              charKey: pc,
              charDisplayName: CHAR_DISPLAY[pc] || 'Kamu',
              msgContent: text,
              isPlayer: true,
              isKiller: KILLER_CHARS.includes(pc),
              isEntity: false
            });
            return;
          }

          if (DIALOG_ONLY_MODE) {
            // In dialog-only mode: only keep horror as system alerts, skip everything else
            if (pClasses.includes('horror') || text.includes('class="horror"')) {
              items.push({ type: 'system', html: text });
            }
            // All other narration is skipped
            return;
          }

          // Horror narration stays visible, everything else is hidden
          if (pClasses.includes('horror') || text.includes('class="horror"')) {
            items.push({ type: 'narration', html: text, cls: ' chat-narration-horror' });
          } else {
            const plainLen = node.textContent.trim().length;
            if (plainLen > 80) return;
            items.push({ type: 'narration', html: text, cls: '' });
          }
        }
      }
    });

    // Second pass: group consecutive narrations and collapse if > NARRATION_VISIBLE_MAX
    let chatHtml = '';
    let i = 0;
    while (i < items.length) {
      const item = items[i];

      if (item.type === 'narration') {
        // Collect consecutive narrations
        const group = [];
        while (i < items.length && items[i].type === 'narration') {
          group.push(items[i]);
          i++;
        }

        if (group.length <= NARRATION_VISIBLE_MAX) {
          group.forEach(n => {
            chatHtml += `<div class="chat-item chat-narration${n.cls}">${n.html}</div>`;
          });
        } else {
          // Show first NARRATION_VISIBLE_MAX, collapse rest
          for (let j = 0; j < NARRATION_VISIBLE_MAX; j++) {
            chatHtml += `<div class="chat-item chat-narration${group[j].cls}">${group[j].html}</div>`;
          }
          const collapseId = 'nc-' + Math.random().toString(36).substr(2, 6);
          chatHtml += `<div class="chat-item chat-narration-collapsed" id="${collapseId}">`;
          chatHtml += `<button class="narration-expand-btn" onclick="document.getElementById('${collapseId}').classList.toggle('expanded')">`;
          chatHtml += `<span class="expand-dots">···</span> <span class="expand-label">${group.length - NARRATION_VISIBLE_MAX} lagi</span>`;
          chatHtml += `</button>`;
          chatHtml += `<div class="narration-hidden-content">`;
          for (let j = NARRATION_VISIBLE_MAX; j < group.length; j++) {
            chatHtml += `<div class="chat-narration${group[j].cls}">${group[j].html}</div>`;
          }
          chatHtml += `</div></div>`;
        }
        continue;
      }

      if (item.type === 'bubble') {
        const side = item.isPlayer ? 'right' : 'left';
        let bubbleClass = `chat-item chat-bubble chat-bubble-${side}`;
        if (item.isKiller) bubbleClass += ' chat-bubble-killer';
        if (item.isEntity) bubbleClass += ' chat-bubble-entity';
        const avatar = item.charKey ? getChatAvatarHTML(item.charKey) : '';
        const ts = getChatTimestamp();
        const readReceipt = item.isPlayer ? ' <span class="chat-read-receipt">&#10003;&#10003;</span>' : '';
        chatHtml += `<div class="${bubbleClass}">`;
        chatHtml += avatar;
        chatHtml += `<div class="chat-content">`;
        chatHtml += `<div class="chat-name ${item.charKey}">${item.charDisplayName}</div>`;
        chatHtml += `<div class="chat-msg">${item.msgContent}<span class="chat-time">${ts}${readReceipt}</span></div>`;
        chatHtml += `</div></div>`;
      } else if (item.type === 'action') {
        // WhatsApp-style action message: "~Niko berdiri di tangga~"
        chatHtml += `<div class="chat-item chat-action"><span class="chat-action-text">${item.charDisplayName} ${item.text}</span></div>`;
      } else if (item.type === 'system') {
        // System/event message — centered like WhatsApp group notifications
        chatHtml += `<div class="chat-item chat-system-msg"><span class="chat-system-text">${item.html}</span></div>`;
      } else if (item.type === 'sound') {
        chatHtml += `<div class="chat-item chat-sound">${item.html}</div>`;
      } else if (item.type === 'journal') {
        chatHtml += `<div class="chat-item">${item.html}</div>`;
      } else {
        chatHtml += `<div class="chat-item">${item.html}</div>`;
      }
      i++;
    }

    return chatHtml;
  }

  function renderText(html, container, callback) {
    if (typingTimeout) { clearTimeout(typingTimeout); typingTimeout = null; }
    clearStaggerTimers();

    const chatboxHtml = convertToChatbox(html);
    container.innerHTML = chatboxHtml;

    // Staggered reveal: show items one by one with natural pacing
    const items = container.querySelectorAll('.chat-item');
    const storyArea = $('story-area');
    const DELAY_NARRATION = 180;
    const DELAY_BUBBLE = 280;
    const DELAY_OTHER = 120;
    let delay = 200; // Initial pause before first item

    items.forEach((item, i) => {
      const isBubble = item.classList.contains('chat-bubble');
      const isNarration = item.classList.contains('chat-narration');
      const isBreak = item.classList.contains('chat-scene-break');
      const increment = isBubble ? DELAY_BUBBLE : (isNarration ? DELAY_NARRATION : (isBreak ? 100 : DELAY_OTHER));
      delay += increment;

      const timer = setTimeout(() => {
        item.classList.add('chat-visible');

        // Smooth scroll to the newly visible item — keep above choices container
        if (storyArea && i > 2) {
          const choicesEl = $('choices-container');
          const choicesH = choicesEl ? choicesEl.offsetHeight : 0;
          const itemRect = item.getBoundingClientRect();
          const areaRect = storyArea.getBoundingClientRect();
          const visibleBottom = areaRect.bottom - choicesH;
          if (itemRect.bottom > visibleBottom || itemRect.top < areaRect.top) {
            const scrollTarget = item.offsetTop - storyArea.offsetTop - (storyArea.clientHeight - choicesH) / 2;
            storyArea.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
          }
        }
      }, delay);
      staggerTimers.push(timer);
    });

    // Call callback after all items are revealed
    pendingStaggerCallback = callback;
    const finalTimer = setTimeout(() => {
      if (pendingStaggerCallback) {
        pendingStaggerCallback();
        pendingStaggerCallback = null;
      }
    }, delay + 100);
    staggerTimers.push(finalTimer);
  }

  function skipStaggerAnimation() {
    clearStaggerTimers();
    const container = $('story-text');
    if (!container) return;
    container.querySelectorAll('.chat-item').forEach(item => {
      item.classList.add('chat-visible');
    });
    const choicesContainer = $('choices-container');
    if (choicesContainer) {
      choicesContainer.style.opacity = '1';
      choicesContainer.style.transform = 'translateY(0)';
    }
    if (pendingStaggerCallback) {
      pendingStaggerCallback();
      pendingStaggerCallback = null;
    }
  }

  // ---- NPC Brain Integration ----
  function initNpcMinds() {
    if (typeof CharBrain !== 'undefined') {
      state.npcMinds = CharBrain.initMinds(state);
    }
  }

  function runNpcRound() {
    if (!state.npcMinds || typeof CharBrain === 'undefined') return null;
    state.roundCount++;
    const result = CharBrain.executeRound(state);
    if (result && result.events && result.events.length > 0) {
      state.npcActionLog.push({ round: state.roundCount, events: result.events });
    }
    // Sync deaths from NPC actions to engine
    CHARACTERS.forEach(name => {
      if (!state.alive[name] && state.npcMinds[name]) {
        delete state.npcMinds[name];
      }
    });
    return result;
  }

  function checkWinLossState() {
    if (typeof CharBrain === 'undefined') return null;
    const result = CharBrain.checkWinLoss(state);
    if (result.ended) {
      state.winLossResult = result;
      return result;
    }
    return null;
  }

  function showWinLossScreen(result) {
    const pc = playerChar();
    const isK = state.killers && state.killers.includes(pc);
    const playerAlive = state.alive[pc];

    // If player died, auto-simulate the rest of the game first
    if (!playerAlive && !state.autoSimDone) {
      autoSimulateGame();
    }

    // Build dynamic result summary
    const summaryData = buildGameSummary(result);
    showGameResultScreen(summaryData);
  }

  // Auto-simulate game after player death — NPC brain runs until conclusion
  function autoSimulateGame() {
    if (!state.npcMinds || typeof CharBrain === 'undefined') {
      state.autoSimDone = true;
      return;
    }
    state.autoSimLog = [];
    const maxRounds = 30;
    let round = 0;
    while (round < maxRounds) {
      round++;
      state.roundCount++;
      const result = CharBrain.executeRound(state);
      if (result && result.events) {
        result.events.forEach(ev => {
          if (ev.desc) state.autoSimLog.push(ev.desc);
        });
        // Sync deaths
        CHARACTERS.forEach(name => {
          if (!state.alive[name] && state.npcMinds[name]) {
            delete state.npcMinds[name];
          }
        });
      }
      // Check if game is resolved
      const allKillersDead = (state.killers || []).every(k => !state.alive[k]);
      const aliveSurvivors = CHARACTERS.filter(c => state.alive[c] && !(state.killers || []).includes(c));
      if (allKillersDead || aliveSurvivors.length <= 1) break;
    }
    state.autoSimDone = true;
  }

  // Build dynamic game summary from actual game state
  function buildGameSummary(result) {
    const pc = playerChar();
    const isK = state.killers && state.killers.includes(pc);
    const playerAlive = state.alive[pc];
    const allKillersDead = (state.killers || []).every(k => !state.alive[k]);
    const aliveSurvivors = CHARACTERS.filter(c => state.alive[c] && !(state.killers || []).includes(c));
    const aliveKillers = (state.killers || []).filter(k => state.alive[k]);
    const deadChars = CHARACTERS.filter(c => !state.alive[c]);

    // Determine winner
    let winner, winDesc;
    if (allKillersDead) {
      winner = 'protagonist';
      winDesc = 'Tim Protagonis menang! Semua killer telah dieliminasi.';
    } else if (aliveSurvivors.length <= 1) {
      winner = 'killer';
      winDesc = aliveSurvivors.length === 0
        ? 'Tim Killer menang! Tidak ada protagonis yang tersisa.'
        : `Tim Killer menang! Hanya ${CharBrain.charName(aliveSurvivors[0])} yang tersisa.`;
    } else if (canEscape && canEscape()) {
      winner = 'protagonist';
      winDesc = 'Tim Protagonis menang! 8 petunjuk ditemukan — semua killer terungkap dan dieksekusi!';
    } else {
      winner = result && result.type === 'win' ? (isK ? 'killer' : 'protagonist') : 'unresolved';
      winDesc = result ? result.desc : 'Permainan berakhir tanpa pemenang yang jelas.';
    }

    // Character fates
    const charFates = CHARACTERS.map(name => {
      const display = CHAR_DISPLAY[name];
      const alive = state.alive[name];
      const wasKiller = (state.killers || []).includes(name);
      const isRevealed = (state.killerRevealed || []).includes(name);
      const isPlayer = name === pc;
      const isWitnessed = (state.witnessedKillers || []).includes(name);

      let status;
      if (!alive && wasKiller) status = 'Tereliminasi (Killer)';
      else if (!alive) status = 'Tereliminasi';
      else if (wasKiller && isRevealed) status = 'Hidup — Terungkap sebagai Killer';
      else if (wasKiller) status = 'Hidup — Identitas tersembunyi';
      else status = 'Selamat';

      return { name: display, charId: name, alive, wasKiller, isPlayer, isRevealed, isWitnessed, status };
    });

    return {
      winner,
      winDesc,
      playerAlive,
      isPlayerKiller: isK,
      roundCount: state.roundCount,
      deathCount: state.deathCount,
      escapeClues: (state.escapeClues || []).length,
      totalEscapeClues: state.totalEscapeClues || 15,
      cluesNeeded: state.cluesNeededToWin || 8,
      destroyedClues: (state.destroyedClues || []).length,
      charFates,
      deadChars,
      autoSimLog: state.autoSimLog || [],
      aliveKillerCount: aliveKillers.length,
      aliveSurvivorCount: aliveSurvivors.length
    };
  }

  // Show dynamic game result screen
  function showGameResultScreen(data) {
    showScreen('screen-ending');
    const winnerLabel = data.winner === 'protagonist' ? 'PROTAGONIS MENANG' :
                        data.winner === 'killer' ? 'KILLER MENANG' : 'TIDAK ADA PEMENANG';
    const winnerClass = data.winner === 'protagonist' ? 'winner-protagonist' :
                        data.winner === 'killer' ? 'winner-killer' : 'winner-draw';

    $('ending-number').textContent = '';
    $('ending-title').textContent = winnerLabel;
    const ratingEl = $('ending-rating');
    ratingEl.textContent = data.winner === 'protagonist' ? 'S' : data.winner === 'killer' ? 'A' : 'C';
    ratingEl.className = 'ending-rating rating-' + (data.winner === 'protagonist' ? 'S' : data.winner === 'killer' ? 'A' : 'C');

    let html = `<div class="game-result ${winnerClass}">`;
    html += `<p class="result-headline">${data.winDesc}</p>`;

    // Player status
    if (!data.playerAlive) {
      html += `<p class="result-player-dead">Kau tereliminasi. Permainan dilanjutkan oleh NPC...</p>`;
    }

    // Stats
    html += `<div class="result-stats">`;
    html += `<div class="stat-item"><span class="stat-label">Ronde</span><span class="stat-value">${data.roundCount}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Tereliminasi</span><span class="stat-value">${data.deathCount}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Petunjuk</span><span class="stat-value">${data.escapeClues}/${data.cluesNeeded}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Petunjuk Hancur</span><span class="stat-value">${data.destroyedClues}</span></div>`;
    html += `</div>`;

    // Character fates table
    html += `<div class="result-fates">`;
    html += `<h3 class="fates-title">Nasib Karakter</h3>`;
    data.charFates.forEach(f => {
      const cls = !f.alive ? 'fate-dead' : f.wasKiller ? 'fate-corrupted' : 'fate-alive';
      const roleTag = f.wasKiller ? ' <span class="role-tag killer-tag">KILLER</span>' : '';
      const playerTag = f.isPlayer ? ' <span class="role-tag player-tag">KAMU</span>' : '';
      const witnessTag = f.isWitnessed ? ' <span class="role-tag witness-tag">DISAKSI</span>' : '';
      html += `<div class="fate-item"><span class="fate-name ${cls}">${f.name}${roleTag}${playerTag}${witnessTag}</span>: ${f.status}</div>`;
    });
    html += `</div>`;

    // Auto-simulation log (if player died)
    if (data.autoSimLog && data.autoSimLog.length > 0) {
      html += `<div class="result-autosim">`;
      html += `<h3 class="fates-title">Setelah Kau Tereliminasi...</h3>`;
      const maxShow = Math.min(data.autoSimLog.length, 15);
      for (let i = 0; i < maxShow; i++) {
        html += `<p class="autosim-entry">${data.autoSimLog[i]}</p>`;
      }
      if (data.autoSimLog.length > maxShow) {
        html += `<p class="autosim-more">...dan ${data.autoSimLog.length - maxShow} aksi lainnya</p>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    $('ending-text').innerHTML = html;

    // Fates already shown in the main content
    $('ending-fates').innerHTML = '';

    updateEndingsCount();
  }

  // ---- Node Rendering ----
  function renderNode(nodeId) {
    const node = storyNodes[nodeId];
    if (!node) { console.error('Node not found:', nodeId); return; }
    const revisit = isBrainRevisit;
    isBrainRevisit = false;
    currentNodeId = nodeId;
    if (!revisit) {
      state.nodeHistory.push(nodeId);
      brainActionCount = 0;
      brainActionHistory = [];  // Reset action history on new node
    }

    // Initialize NPC minds on first story node
    if (!state.npcMinds && state.chapter >= 0 && typeof CharBrain !== 'undefined') {
      initNpcMinds();
    }

    if (!revisit && node.onEnter) node.onEnter(state);
    if (node.chapter !== undefined && node.chapter !== state.chapter) {
      state.chapter = node.chapter;
      updateChapterIndicator();
      const chTitle = (CHAPTERS[lang] || CHAPTERS.id)[state.chapter];
      if (chTitle) showChapterTitle(chTitle);
    } else if (node.chapter !== undefined) {
      state.chapter = node.chapter;
      updateChapterIndicator();
    }
    if (node.shake) screenShake();
    if (node.blood) bloodDrip();
    if (node.glitch) glitch();
    updateDangerAmbient();

    const storyText = $('story-text');
    const choicesContainer = $('choices-container');

    // On brain revisit: skip re-rendering story text, just update choices
    if (revisit) {
      choicesContainer.innerHTML = '';
      const storyChoices = (node.choices || []).slice();
      const allChoices = storyChoices.slice();
      const brainMax = isPlayerKiller() ? BRAIN_MAX_PER_NODE_KILLER : BRAIN_MAX_PER_NODE;
      if (state.npcMinds && brainActionCount < brainMax) {
        const dynamicChoices = generateDynamicChoices(state);
        dynamicChoices.forEach(c => allChoices.push(c));
      }
      if (brainActionCount >= brainMax && storyChoices.length === 0) {
        const nextId = findNextStoryNode(nodeId);
        if (nextId) {
          allChoices.push({
            text: 'Lanjutkan cerita...', category: 'story',
            hint: 'Sudah cukup mengeksplorasi — saatnya melanjutkan',
            next: nextId
          });
        }
      }
      renderChoices(allChoices);
      updateNpcLogPanel();
      return;
    }

    let textContent = typeof node.text === 'function' ? node.text(state) : t(node.text);

    // Location context: show who's with the player
    if (state.npcMinds) {
      const playerLoc = state.playerLocation || 'aula_utama';
      const locDisplayName = typeof CharBrain !== 'undefined' ? CharBrain.locName(playerLoc) : playerLoc;
      const nearbyChars = Object.keys(state.npcMinds).filter(n =>
        state.alive[n] && state.npcMinds[n] && state.npcMinds[n].location === playerLoc
      );
      const nearbyNames = nearbyChars.map(n => typeof CharBrain !== 'undefined' ? CharBrain.charName(n) : n);
      let ctxHtml = `<div class="location-context">`;
      ctxHtml += `<span class="loc-icon">\uD83D\uDCCD</span> <strong>${locDisplayName}</strong>`;
      if (nearbyNames.length > 0) {
        ctxHtml += ` — bersama: ${nearbyNames.join(', ')}`;
      } else {
        ctxHtml += ` — sendirian`;
      }
      ctxHtml += `</div>`;
      textContent = ctxHtml + textContent;
    }

    // Run NPC round and append narrative
    if (state.npcMinds && !node.isEnding) {
      const roundResult = runNpcRound();
      if (roundResult) {
        const narrative = CharBrain.generateNarrative(roundResult, state);
        if (narrative) textContent += narrative;
      }

      // Check win/loss
      const wl = checkWinLossState();
      if (wl) {
        textContent += `<div class="wl-alert ${wl.type === 'win' || wl.type === 'partial_win' ? 'wl-win' : 'wl-loss'}">
          <p class="wl-title">${wl.title}</p>
          <p>${wl.desc}</p>
        </div>`;
      }
    }

    // Hide choices until text is fully revealed
    choicesContainer.style.opacity = '0';
    choicesContainer.style.transform = 'translateY(10px)';
    choicesContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    renderText(textContent, storyText, () => {
      $('story-area').scrollTop = 0;

      // After rendering choices, adjust story-area padding so last message is above choices
      adjustStoryPadding();

      // If win/loss triggered, show ending after delay
      if (state.winLossResult) {
        setTimeout(() => showWinLossScreen(state.winLossResult), 2500);
        choicesContainer.innerHTML = '';
        return;
      }

      if (node.isEnding) {
        setTimeout(() => triggerEnding(node), 1500);
        choicesContainer.innerHTML = '';
        return;
      }

      // Story choices first, then brain choices
      const storyChoices = (node.choices || []).slice();
      const allChoices = storyChoices.slice();
      const brainMaxNorm = isPlayerKiller() ? BRAIN_MAX_PER_NODE_KILLER : BRAIN_MAX_PER_NODE;
      if (state.npcMinds && brainActionCount < brainMaxNorm) {
        const dynamicChoices = generateDynamicChoices(state);
        dynamicChoices.forEach(c => allChoices.push(c));
      }
      renderChoices(allChoices);

      // Reveal choices with smooth animation after text
      setTimeout(() => {
        choicesContainer.style.opacity = '1';
        choicesContainer.style.transform = 'translateY(0)';
      }, 150);
    });

    updateNpcLogPanel();
    updatePlayerStatus(state);
    checkToolPickup(state);
    saveGame();
  }

  // ---- Find next story node for forced progression ----
  function findNextStoryNode(fromId) {
    const node = storyNodes[fromId];
    if (!node) return null;
    // Try to get the first story choice's next
    if (node.choices && node.choices.length > 0) {
      for (const c of node.choices) {
        const n = typeof c.next === 'function' ? c.next(state) : c.next;
        if (n && n !== fromId) return n;
      }
    }
    // Try common node naming patterns
    const parts = fromId.split('_');
    const chPrefix = parts[0]; // e.g. 'ch1', 'prolog'
    // Try incrementing the last number
    const match = fromId.match(/^(.+?)(\d+)$/);
    if (match) {
      const next = match[1] + (parseInt(match[2]) + 1);
      if (storyNodes[next]) return next;
    }
    return null;
  }

  // ---- Check if a brain action was already taken ----
  function brainActionTaken(actionKey) {
    return brainActionHistory.includes(actionKey);
  }
  function recordBrainAction(actionKey) {
    brainActionHistory.push(actionKey);
  }

  // ---- Tool Pickup Events ----
  function checkToolPickup(gameState) {
    if (!gameState || gameState.chapter < 1) return;
    const pc = gameState.playerCharacter || 'arin';
    const playerLoc = gameState.playerLocation || 'aula_utama';

    // Check if any tool at this location is available and player has no tool
    if (getCharTool(pc)) return; // Already holding a tool
    for (const [tid, tool] of Object.entries(GAME_TOOLS)) {
      if (tool.triggerLoc === playerLoc && isToolAvailable(tid)) {
        // Auto-generate a tool pickup notification
        notify(`${tool.icon} ${tool.name} ditemukan di ${typeof CharBrain !== 'undefined' ? CharBrain.locName(playerLoc) : playerLoc}!`);
        break;
      }
    }
  }

  // ---- NPC Tool Pickup (called from char-brain.js executeRound) ----
  function npcPickupTool(charName, location) {
    if (getCharTool(charName)) return null; // Already has tool
    for (const [tid, tool] of Object.entries(GAME_TOOLS)) {
      if (tool.triggerLoc === location && isToolAvailable(tid)) {
        if (pickupTool(charName, tid)) {
          return { toolId: tid, tool: tool };
        }
      }
    }
    return null;
  }

  // ---- Dynamic Choices based on NPC brain state ----
  function generateDynamicChoices(gameState) {
    const choices = [];
    if (!gameState.npcMinds || typeof CharBrain === 'undefined') return choices;

    const pc = gameState.playerCharacter || 'arin';
    const isK = gameState.killers && gameState.killers.includes(pc);
    const playerLoc = gameState.playerLocation || 'aula_utama';

    // Find NPCs at player's location
    const nearbyNpcs = Object.keys(gameState.npcMinds).filter(name =>
      gameState.alive[name] && gameState.npcMinds[name].location === playerLoc
    );

    // --- TOOL PICKUP (if tool available at location and player has no tool) ---
    if (!getCharTool(pc)) {
      for (const [tid, tool] of Object.entries(GAME_TOOLS)) {
        if (tool.triggerLoc === playerLoc && isToolAvailable(tid) && !brainActionTaken('pickup_' + tid)) {
          choices.push({
            text: `${tool.icon} Ambil ${tool.name}`,
            type: 'brain', category: 'investigate',
            hint: tool.desc,
            risk: 5, reward: 80,
            successChance: 100,
            effect: (s) => {
              recordBrainAction('pickup_' + tid);
              pickupTool(pc, tid);
              Engine.notify(`Kau mengambil ${tool.icon} ${tool.name}! ${tool.desc}`);
            },
            next: (s) => currentNodeId
          });
          break; // Only show one tool pickup
        }
      }
    }

    // --- ACCUSE suspect (one-time per suspect per node) ---
    if (!isK && nearbyNpcs.length > 0 && gameState.deathCount >= 1) {
      const suspect = nearbyNpcs.find(n => (gameState.suspicion[n] || 0) > 30 && !brainActionTaken('accuse_' + n));
      if (suspect) {
        const suspLvl = gameState.suspicion[suspect] || 0;
        const conf = suspLvl > 60 ? 'Bukti kuat' : 'Bukti menengah';
        const accuseChance = Math.min(85, 30 + suspLvl + getCharAbility(pc, 'accusation'));
        choices.push({
          text: `Tuduh ${CharBrain.charName(suspect)}: "Aku tahu apa yang kau lakukan."`,
          type: 'brain', category: 'accuse',
          hint: `${conf} — kecurigaan ${suspLvl}%`,
          risk: Math.max(40, 80 - suspLvl),
          reward: suspLvl > 50 ? 90 : 60,
          successChance: accuseChance,
          effect: (s) => {
            recordBrainAction('accuse_' + suspect);
            const result = rollChance(accuseChance, pc, 'offense');
            if (result.success) {
              CharBrain.playerAction('accuse', suspect, s);
              Engine.modSuspicion(suspect, 15);
              Engine.notify(`Tuduhan berhasil! (${result.chance}% chance, roll: ${result.roll})`);
            } else {
              Engine.modSuspicion(suspect, 5);
              Engine.notify(`Tuduhanmu tidak meyakinkan. (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- INVESTIGATE location (one-time per location per node) ---
    if (!brainActionTaken('investigate_' + playerLoc)) {
      const invChance = 45 + (gameState.chapter * 8);
      choices.push({
        text: `Periksa ${CharBrain.locName(playerLoc)} — cari petunjuk tersembunyi`,
        type: 'brain', category: 'investigate',
        hint: nearbyNpcs.length === 0 ? 'Sendirian — lebih leluasa mencari' : 'Hati-hati, ada orang lain di sini',
        risk: nearbyNpcs.length === 0 ? 15 : 25,
        reward: 70,
        successChance: invChance,
        effect: (s) => {
          recordBrainAction('investigate_' + playerLoc);
          const result = rollChance(invChance, pc, 'intel');
          if (result.success) {
            CharBrain.playerAction('investigate_location', null, s);
            // Real reward: increase suspicion on actual killers and possibly find escape clue
            const isKiller = s.killers && s.killers.includes(pc);
            if (!isKiller) {
              // Boost suspicion on actual killers nearby
              nearbyNpcs.forEach(n => {
                if (s.killers.includes(n)) {
                  Engine.modSuspicion(n, 10);
                }
              });
              // Chance to also find an escape clue as bonus (30%)
              const escClue = getEscapeClueAtLocation(playerLoc);
              if (escClue && Math.random() < 0.30) {
                findEscapeClue(escClue.id);
                s.cluesFound = (s.cluesFound || 0) + 1;
                const newFound = (s.escapeClues || []).length;
                const total = s.totalEscapeClues || 15;
                Engine.notify(`Petunjuk ditemukan! Bonus: ${escClue.name} juga terungkap! Pelarian: ${newFound}/${total} (${result.chance}% chance, roll: ${result.roll})`);
                if (canEscape()) {
                  Engine.notify('SEMUA PETUNJUK TERKUMPUL! Jalan keluar mansion terbuka!');
                }
                return;
              }
            }
            Engine.notify(`Petunjuk ditemukan! (${result.chance}% chance, roll: ${result.roll})`);
          } else {
            Engine.notify(`Tidak menemukan apa-apa kali ini. (${result.chance}% chance, roll: ${result.roll})`);
          }
        },
        next: (s) => currentNodeId
      });
    }

    // --- SEARCH ESCAPE CLUE at location (survivor only, one-time per location) ---
    if (!isK && !brainActionTaken('escape_clue_' + playerLoc)) {
      const escClue = getEscapeClueAtLocation(playerLoc);
      if (escClue) {
        const escChance = 55 + (gameState.chapter * 6);
        const found = (gameState.escapeClues || []).length;
        const total = gameState.totalEscapeClues || 6;
        choices.push({
          text: `Cari petunjuk pelarian di ${CharBrain.locName(playerLoc)}`,
          type: 'brain', category: 'investigate',
          hint: `Petunjuk pelarian: ${found}/${total} — temukan semua untuk membuka jalan keluar mansion`,
          risk: nearbyNpcs.length === 0 ? 10 : 30,
          reward: 90,
          successChance: escChance,
          effect: (s) => {
            recordBrainAction('escape_clue_' + playerLoc);
            const result = rollChance(escChance, pc, 'intel');
            if (result.success) {
              findEscapeClue(escClue.id);
              s.cluesFound = (s.cluesFound || 0) + 1;
              const newFound = (s.escapeClues || []).length;
              Engine.notify(`${escClue.name} ditemukan! Petunjuk pelarian: ${newFound}/${total} (${result.chance}% chance, roll: ${result.roll})`);
              if (canEscape()) {
                Engine.notify('SEMUA PETUNJUK TERKUMPUL! Jalan keluar mansion terbuka!');
              }
            } else {
              Engine.notify(`Tidak menemukan petunjuk pelarian. (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- TRIGGER ESCAPE (survivor only, all escape clues found) ---
    if (!isK && canEscape() && !brainActionTaken('trigger_escape')) {
      choices.push({
        text: 'KABUR DARI MANSION — semua petunjuk terkumpul!',
        type: 'brain', category: 'escape',
        hint: 'Aktifkan jalur pelarian — semua killer otomatis tereliminasi!',
        risk: 5, reward: 100,
        successChance: 100,
        danger: false,
        effect: (s) => {
          recordBrainAction('trigger_escape');
          triggerMansionEscape();
          Engine.notify('Mansion terbuka! Semua killer terjebak dan tereliminasi!');
        },
        next: (s) => currentNodeId
      });
    }

    // --- ATTACK KILLER (survivor, if killer is revealed/exposed at location) ---
    if (!isK && nearbyNpcs.length > 0 && gameState.deathCount >= 1) {
      const revealedKiller = nearbyNpcs.find(n =>
        gameState.killers.includes(n) &&
        (gameState.killerRevealed.includes(n) || (gameState.suspicion[n] || 0) >= 80) &&
        !brainActionTaken('attack_killer_' + n)
      );
      if (revealedKiller) {
        const atkChance = 35 + Math.min(30, (gameState.suspicion[revealedKiller] || 0) / 3);
        choices.push({
          text: `Serang ${CharBrain.charName(revealedKiller)} — eliminasi killer!`,
          type: 'brain', category: 'confront',
          hint: `Habisi killer yang terungkap! Chance: ${Math.round(atkChance)}%`,
          risk: 75, reward: 95,
          danger: true,
          successChance: Math.round(atkChance),
          effect: (s) => {
            recordBrainAction('attack_killer_' + revealedKiller);
            const result = rollChance(atkChance, pc, 'offense');
            if (result.success) {
              Engine.killChar(revealedKiller);
              Engine.notify(`${CharBrain.charName(revealedKiller)} dieliminasi! (${result.chance}% chance, roll: ${result.roll})`);
              if (allKillersDead()) {
                Engine.notify('SEMUA KILLER TELAH DIELIMINASI! Protagonis menang!');
              }
            } else {
              Engine.modDanger(10);
              if (s.playerStatus) s.playerStatus.wounded = true;
              Engine.notify(`Serangan gagal! ${CharBrain.charName(revealedKiller)} membalas! (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- OBSERVE nearby NPCs (one-time per NPC per node) ---
    if (nearbyNpcs.length > 0) {
      const observeTarget = nearbyNpcs.find(n => !brainActionTaken('observe_' + n));
      if (observeTarget) {
        const mind = gameState.npcMinds[observeTarget];
        const detBonus = getCharAbility(pc, 'detection');
        const canReadEmotion = hasCharAbility(pc, 'emotionRead');
        const emotionHint = canReadEmotion && mind
          ? `Emosi: ${mind.emotion} | Tension: ${mind.tension}% | Kecurigaan: ${Math.round(mind.suspicions[pc] || 0)}%`
          : (mind ? `Emosi: ${mind.emotion}` : 'Perhatikan perilakunya');
        choices.push({
          text: `Amati gerak-gerik ${CharBrain.charName(observeTarget)} secara diam-diam`,
          type: 'brain', category: 'observe',
          hint: emotionHint,
          risk: 10, reward: 55,
          effect: (s) => {
            recordBrainAction('observe_' + observeTarget);
            const susp = s.suspicion[observeTarget] || 0;
            const isTarget = s.killers.includes(observeTarget);
            const detectChance = 0.4 + (detBonus / 100);
            if (isTarget && Math.random() < detectChance) {
              const suspGain = 10 + Math.floor(detBonus / 2);
              s.suspicion[observeTarget] = Math.min(100, susp + suspGain);
              Engine.notify(`Kau menangkap gelagat mencurigakan dari ${CharBrain.charName(observeTarget)}! Kecurigaan +${suspGain}%.`);
            } else if (canReadEmotion && mind) {
              Engine.notify(`${CharBrain.charName(observeTarget)}: Emosi ${mind.emotion}, Tension ${mind.tension}%.${isTarget ? ' Ada yang tidak beres...' : ''}`);
            } else {
              Engine.notify(`${CharBrain.charName(observeTarget)} tampak ${isTarget ? 'terlalu tenang...' : 'normal.'}`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- TALK to NPC (one-time per NPC per node) ---
    if (nearbyNpcs.length > 0) {
      const talkTarget = nearbyNpcs.find(n => !brainActionTaken('talk_' + n));
      if (talkTarget) {
        const trustLvl = gameState.trust[trustKey(pc, talkTarget)] || 50;
        choices.push({
          text: `Bicara dengan ${CharBrain.charName(talkTarget)} — bangun hubungan`,
          type: 'brain', category: 'social',
          hint: `Kepercayaan saat ini: ${trustLvl}%`,
          risk: 10, reward: 45,
          effect: (s) => {
            recordBrainAction('talk_' + talkTarget);
            const trustGain = 5 + Math.floor(getCharAbility(pc, 'trust') / 3);
            Engine.modTrust(pc, talkTarget, trustGain);
            const newTrust = s.trust[trustKey(pc, talkTarget)] || 55;
            Engine.notify(`Hubunganmu dengan ${CharBrain.charName(talkTarget)} membaik. Trust: ${newTrust}%`);
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- FORM ALLIANCE (one-time per target, survivor only) ---
    if (!isK && nearbyNpcs.length > 0 && gameState.deathCount >= 1) {
      const potential = nearbyNpcs.find(n =>
        !gameState.killers.includes(n) &&
        !brainActionTaken('ally_' + n) &&
        (gameState.trust[trustKey(pc, n)] || 50) > 40 &&
        (!gameState.npcMinds[n] || !gameState.npcMinds[n].allies.includes(pc))
      );
      if (potential) {
        const trustVal = gameState.trust[trustKey(pc, potential)] || 50;
        choices.push({
          text: `Ajak ${CharBrain.charName(potential)} membentuk aliansi`,
          type: 'brain', category: 'alliance',
          hint: `Trust: ${trustVal}% — ${trustVal > 60 ? 'kemungkinan besar diterima' : 'mungkin butuh persuasi'}`,
          risk: trustVal > 60 ? 10 : 30,
          reward: 75,
          effect: (s) => {
            recordBrainAction('ally_' + potential);
            CharBrain.playerAction('ally', potential, s);
            const allyTrustGain = 10 + getCharAbility(pc, 'allianceBonus');
            Engine.modTrust(pc, potential, allyTrustGain);
            Engine.notify(`Aliansi terbentuk dengan ${CharBrain.charName(potential)}!`);
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- HIDE (one-time per location per node) ---
    if (gameState.dangerLevel > 30 && !isK && !brainActionTaken('hide_' + playerLoc)) {
      choices.push({
        text: `Sembunyi di ${CharBrain.locName(playerLoc)} — tunggu bahaya berlalu`,
        type: 'brain', category: 'hide',
        hint: `Danger level: ${gameState.dangerLevel}% — ${gameState.dangerLevel > 60 ? 'sangat berbahaya di luar!' : 'waspada'}`,
        risk: 5, reward: 15,
        effect: (s) => {
          recordBrainAction('hide_' + playerLoc);
          s.dangerLevel = Math.max(0, s.dangerLevel - 5);
          Engine.notify('Kau bersembunyi dan menunggu. Tension turun sedikit.');
        },
        next: (s) => currentNodeId
      });
    }

    // --- KILLER ACTIONS (one-time per target per node) ---
    if (isK) {
      // Strike target
      const soloTarget = nearbyNpcs.find(n => !gameState.killers.includes(n) && !brainActionTaken('strike_' + n));
      if (soloTarget && nearbyNpcs.filter(n => !gameState.killers.includes(n)).length <= 2) {
        const witnesses = nearbyNpcs.filter(n => n !== soloTarget && !gameState.killers.includes(n)).length;
        const isSilent = hasCharAbility(pc, 'silentKill');
        const strikeChance = witnesses === 0 ? 50 : 25;
        const silentLabel = isSilent ? ' (silent kill)' : '';
        choices.push({
          text: `Serang ${CharBrain.charName(soloTarget)}${witnesses === 0 ? ' — tidak ada saksi...' + silentLabel : ' — ada risiko saksi!'}`,
          type: 'brain-killer', category: 'killer',
          danger: witnesses > 0,
          hint: witnesses === 0 ? (isSilent ? 'Sendirian + silent kill — eliminasi tanpa bukti' : 'Sendirian — kesempatan emas') : `${witnesses} saksi potensial — sangat berisiko!`,
          risk: witnesses === 0 ? 45 : 85,
          reward: 90,
          successChance: strikeChance,
          effect: (s) => {
            recordBrainAction('strike_' + soloTarget);
            const result = rollChance(strikeChance, pc, 'offense');
            if (result.success) {
              Engine.killChar(soloTarget);
              // Dimas's silent kill: less suspicion gain on successful kill
              if (isSilent && witnesses === 0) {
                Engine.notify(`${CharBrain.charName(soloTarget)} dieliminasi tanpa jejak! (${result.chance}% chance, roll: ${result.roll})`);
              } else {
                Engine.notify(`${CharBrain.charName(soloTarget)} dieliminasi! (${result.chance}% chance, roll: ${result.roll})`);
              }
            } else {
              const failSusp = isSilent ? 12 : 20;
              Engine.modSuspicion(pc, failSusp);
              Engine.notify(`Serangan gagal! ${CharBrain.charName(soloTarget)} berhasil lolos. (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }

      // Sabotage other killer (killer vs killer self-preservation)
      const otherKillers = nearbyNpcs.filter(n => gameState.killers.includes(n) && n !== pc && !brainActionTaken('sabotage_killer_' + n));
      if (otherKillers.length > 0 && gameState.chapter >= 3) {
        const rivalKiller = otherKillers[0];
        const sabChance = 50;
        choices.push({
          text: `Sabotase ${CharBrain.charName(rivalKiller)} — selamatkan diri sendiri`,
          type: 'brain-killer', category: 'stealth',
          danger: true,
          hint: 'Khianati killer lain agar kau satu-satunya yang selamat',
          risk: 70, reward: 85,
          successChance: sabChance,
          effect: (s) => {
            recordBrainAction('sabotage_killer_' + rivalKiller);
            const result = rollChance(sabChance, pc, 'offense');
            if (result.success) {
              Engine.modSuspicion(rivalKiller, 30);
              Engine.notify(`Kau berhasil membocorkan identitas ${CharBrain.charName(rivalKiller)} ke kelompok! (${result.chance}%)`);
            } else {
              Engine.modSuspicion(pc, 15);
              Engine.notify(`Usaha sabotasemu ketahuan oleh ${CharBrain.charName(rivalKiller)}! (${result.chance}%)`);
            }
          },
          next: (s) => currentNodeId
        });
      }

      // Sabotage (one-time per location)
      if (nearbyNpcs.length === 0 && !brainActionTaken('sabotage_' + playerLoc)) {
        choices.push({
          text: `Sabotase ${CharBrain.locName(playerLoc)} — buat perangkap`,
          type: 'brain-killer', category: 'stealth',
          hint: 'Siapkan jebakan untuk korban berikutnya',
          risk: 30, reward: 65,
          effect: (s) => {
            recordBrainAction('sabotage_' + playerLoc);
            s.dangerLevel = Math.min(100, s.dangerLevel + 5);
            Engine.notify('Kau menyiapkan perangkap dengan hati-hati. Area ini sekarang berbahaya bagi orang lain.');
          },
          next: (s) => currentNodeId
        });
      }

      // DESTROY ESCAPE CLUE (killer only, one-time per location)
      if (!brainActionTaken('destroy_clue_' + playerLoc)) {
        const escClue = getEscapeClueAtLocation(playerLoc);
        if (escClue) {
          const destroyChance = 40;
          const destroyed = (gameState.destroyedClues || []).length;
          choices.push({
            text: `Hancurkan petunjuk pelarian di ${CharBrain.locName(playerLoc)}`,
            type: 'brain-killer', category: 'stealth',
            hint: `Hancurkan ${escClue.name} agar survivor tidak bisa kabur. Dihancurkan: ${destroyed}`,
            risk: 20, reward: 85,
            successChance: destroyChance,
            effect: (s) => {
              recordBrainAction('destroy_clue_' + playerLoc);
              const result = rollChance(destroyChance, pc, 'offense');
              if (result.success) {
                destroyEscapeClue(escClue.id);
                Engine.notify(`${escClue.name} berhasil dihancurkan! Survivor kehilangan akses ke petunjuk ini. (${result.chance}% chance, roll: ${result.roll})`);
              } else {
                Engine.notify(`Gagal menghancurkan petunjuk. (${result.chance}% chance, roll: ${result.roll})`);
              }
            },
            next: (s) => currentNodeId
          });
        }
      }

      // Manipulate/Frame (one-time per target) — chance-based with REAL consequences
      if (nearbyNpcs.length > 0) {
        const frameTarget = nearbyNpcs.find(n => !gameState.killers.includes(n) && !brainActionTaken('frame_' + n));
        if (frameTarget) {
          const frameChance = 45 + Math.floor(getCharAbility(pc, 'framingBonus') / 2);
          choices.push({
            text: `Arahkan kecurigaan ke ${CharBrain.charName(frameTarget)} — framing`,
            type: 'brain-killer', category: 'stealth',
            hint: `Chance: ${frameChance}% — target jadi musuh semua NPC, trust hancur, bisa di-trust-kill. Gagal = kamu yang dicurigai!`,
            risk: 50, reward: 70,
            successChance: frameChance,
            effect: (s) => {
              recordBrainAction('frame_' + frameTarget);
              const result = rollChance(frameChance, pc, 'offense');
              if (result.success) {
                const frameSusp = 25 + Math.floor(getCharAbility(pc, 'framingBonus') / 2);
                Engine.modSuspicion(frameTarget, frameSusp);
                Engine.modSuspicion(pc, -15);
                // REAL consequences: trust destroyed, enemies created, allies removed
                const affectedNames = [];
                if (s.npcMinds) {
                  Object.keys(s.npcMinds).forEach(npcName => {
                    const npc = s.npcMinds[npcName];
                    if (npc && npc.location === (s.playerLocation || 'aula_utama') && s.alive[npcName] && !s.killers.includes(npcName) && npcName !== frameTarget) {
                      // Suspicion spike on framed target
                      npc.suspicions[frameTarget] = Math.min(100, (npc.suspicions[frameTarget] || 0) + 30);
                      // Trust between NPC and framed target drops hard
                      const tk = CharBrain.trustKeyFor ? CharBrain.trustKeyFor(npcName, frameTarget) : [npcName, frameTarget].sort().join('_');
                      if (s.trust[tk] !== undefined) s.trust[tk] = Math.max(0, s.trust[tk] - 25);
                      // Mark as enemy if suspicion high enough
                      if ((npc.suspicions[frameTarget] || 0) >= 45 && !npc.enemies.includes(frameTarget)) {
                        npc.enemies.push(frameTarget);
                        affectedNames.push(CharBrain.charName(npcName));
                      }
                      // Remove framed from allies
                      npc.allies = npc.allies.filter(a => a !== frameTarget);
                      // Raise tension → more likely to act aggressively
                      npc.tension = Math.min(100, npc.tension + 10);
                    }
                  });
                }
                // Framed target becomes isolated: loses allies, gains tension
                if (s.npcMinds && s.npcMinds[frameTarget]) {
                  s.npcMinds[frameTarget].tension = Math.min(100, s.npcMinds[frameTarget].tension + 20);
                  s.npcMinds[frameTarget].allies = [];
                }
                const enemyMsg = affectedNames.length > 0 ? ` ${affectedNames.join(', ')} sekarang MEMUSUHI ${CharBrain.charName(frameTarget)}!` : '';
                Engine.notify(`Framing berhasil! ${CharBrain.charName(frameTarget)} suspicion +${frameSusp}%, trust hancur, terisolasi.${enemyMsg} (${result.chance}%, roll: ${result.roll})`);
              } else {
                Engine.modSuspicion(pc, 20);
                // Failed framing: nearby NPCs get suspicious of YOU
                if (s.npcMinds) {
                  Object.keys(s.npcMinds).forEach(npcName => {
                    const npc = s.npcMinds[npcName];
                    if (npc && npc.location === (s.playerLocation || 'aula_utama') && s.alive[npcName]) {
                      npc.suspicions[pc] = Math.min(100, (npc.suspicions[pc] || 0) + 15);
                    }
                  });
                }
                Engine.notify(`Framing gagal! NPC curiga padamu. Suspicion kamu +20%. (${result.chance}%, roll: ${result.roll})`);
              }
            },
            next: (s) => currentNodeId
          });
        }
      }
    }

    // --- MOVE to adjacent location (always available, resets brain actions at new loc) ---
    const connections = CharBrain.LOCATION_CONNECTIONS[playerLoc] || [];
    if (connections.length > 0) {
      const shuffled = connections.slice().sort(() => Math.random() - 0.5);
      // Niko's ability: +1 extra movement option (knows secret passages)
      // Killer players get fewer movement options (slower pacing)
      const baseMove = isPlayerKiller() ? 2 : 3;
      const moveLimit = hasCharAbility(pc, 'extraMovement') ? baseMove + 1 : baseMove;
      const moveDests = shuffled.slice(0, Math.min(moveLimit, shuffled.length));
      moveDests.forEach(loc => {
        if (brainActionTaken('move_' + loc)) return; // Don't show move to same loc twice
        const npcsAtLoc = Object.keys(gameState.npcMinds || {}).filter(n =>
          gameState.alive[n] && gameState.npcMinds[n] && gameState.npcMinds[n].location === loc
        );
        const locInfo = npcsAtLoc.length > 0
          ? `${npcsAtLoc.length} orang di sana`
          : 'Kosong — aman untuk eksplorasi';
        choices.push({
          text: `Pindah ke ${CharBrain.locName(loc)}`,
          type: 'brain', category: 'move',
          hint: locInfo,
          risk: npcsAtLoc.length > 0 ? 25 : 10,
          reward: 20,
          effect: (s) => {
            recordBrainAction('move_' + loc);
            s.playerLocation = loc;
            // Moving to a new location partially resets brain actions (location-specific ones)
            brainActionHistory = brainActionHistory.filter(a => !a.startsWith('investigate_') && !a.startsWith('hide_'));
            Engine.notify(`Kau berpindah ke ${CharBrain.locName(loc)}.${npcsAtLoc.length > 0 ? ' Kau melihat ' + npcsAtLoc.map(n => CharBrain.charName(n)).join(', ') + ' di sini.' : ''}`);
          },
          next: (s) => currentNodeId
        });
      });
    }

    // If all brain actions have been used, add forced progression
    if (choices.length === 0) {
      const nextId = findNextStoryNode(currentNodeId);
      if (nextId) {
        choices.push({
          text: 'Lanjutkan cerita — saatnya bergerak',
          type: 'brain', category: 'story',
          hint: 'Semua aksi di sini sudah dilakukan',
          risk: 5, reward: 50,
          next: nextId
        });
      }
    }

    return choices;
  }

  // ---- NPC Action Log Panel ----
  function updateNpcLogPanel() {
    const container = $('npc-log-list');
    if (!container) return;
    if (!state.npcMinds || typeof CharBrain === 'undefined') {
      container.innerHTML = '<p class="npc-log-empty">Sistem NPC belum aktif.</p>';
      return;
    }

    const log = CharBrain.getActionLog(state);
    container.innerHTML = '';

    log.forEach(entry => {
      const mind = state.npcMinds[entry.name];
      if (!mind) return;
      const isK = state.killers && state.killers.includes(entry.name);
      const statusText = typeof CharDB !== 'undefined' ? CharDB.getStatusText(entry.name, mind) : entry.emotion;

      const div = document.createElement('div');
      div.className = `npc-log-entry${isK && state.killerRevealed.includes(entry.name) ? ' npc-log-killer' : ''}`;
      div.innerHTML = `
        <div class="npc-log-header">
          ${getPortraitHTML(entry.name, 'npc-log-portrait')}
          <div class="npc-log-info">
            <span class="npc-log-name speaker ${entry.name}">${entry.displayName}</span>
            <span class="npc-log-status">${statusText}</span>
          </div>
        </div>
        <div class="npc-log-location">Lokasi: ${entry.location}</div>
        <div class="npc-log-action">${entry.lastAction}</div>
        ${entry.allies.length > 0 ? `<div class="npc-log-allies">Aliansi: ${entry.allies.join(', ')}</div>` : ''}
        ${entry.clueCount > 0 ? `<div class="npc-log-clues">Petunjuk: ${entry.clueCount}</div>` : ''}
      `;
      container.appendChild(div);
    });
  }

  // ---- Action Category System ----
  const ACTION_CATEGORIES = {
    investigate:  { icon: '\uD83D\uDD0D', label: 'Investigasi', color: '#c8a96e' },
    confront:     { icon: '\u2694\uFE0F', label: 'Konfrontasi', color: '#e63946' },
    social:       { icon: '\uD83E\uDD1D', label: 'Sosial', color: '#4ecdc4' },
    move:         { icon: '\uD83D\uDEB6', label: 'Pindah', color: '#7f8c8d' },
    stealth:      { icon: '\uD83D\uDC41\uFE0F', label: 'Siluman', color: '#9b59b6' },
    protect:      { icon: '\uD83D\uDEE1\uFE0F', label: 'Lindungi', color: '#2ecc71' },
    killer:       { icon: '\uD83D\uDDE1\uFE0F', label: 'Serang', color: '#8b0000' },
    escape:       { icon: '\uD83C\uDFC3', label: 'Kabur', color: '#f39c12' },
    alliance:     { icon: '\u2B50', label: 'Aliansi', color: '#3498db' },
    accuse:       { icon: '\u261D\uFE0F', label: 'Tuduh', color: '#e74c3c' },
    hack:         { icon: '\uD83D\uDCBB', label: 'Hack', color: '#00d2ff' },
    negotiate:    { icon: '\uD83D\uDCAC', label: 'Negosiasi', color: '#f1c40f' },
    observe:      { icon: '\uD83D\uDC40', label: 'Amati', color: '#bdc3c7' },
    hide:         { icon: '\uD83E\uDD10', label: 'Sembunyi', color: '#636e72' },
    story:        { icon: '\uD83D\uDCD6', label: 'Cerita', color: '#dfe6e9' }
  };

  function detectCategory(choice) {
    if (choice.category) return choice.category;
    const t = (typeof choice.text === 'function' ? choice.text(state) : choice.text || '').toLowerCase();
    if (choice.type === 'brain-killer') return 'killer';
    if (t.includes('tuduh') || t.includes('accuse') || t.includes('[brain] tuduh')) return 'accuse';
    if (t.includes('aliansi') || t.includes('ajak')) return 'alliance';
    if (t.includes('pindah') || t.includes('pergi') || t.includes('menuju')) return 'move';
    if (t.includes('periksa') || t.includes('investigasi') || t.includes('cek') || t.includes('teliti') || t.includes('buka') || t.includes('rekam')) return 'investigate';
    if (t.includes('hadapi') || t.includes('konfrontasi') || t.includes('dorong') || t.includes('paksa')) return 'confront';
    if (t.includes('sera') || t.includes('bicara') || t.includes('hampiri') || t.includes('dekati') || t.includes('bergabung') || t.includes('tanya')) return 'social';
    if (t.includes('sembunyi') || t.includes('diam') || t.includes('menyelinap')) return 'hide';
    if (t.includes('kabur') || t.includes('lari') || t.includes('keluar') || t.includes('escape')) return 'escape';
    if (t.includes('lindungi') || t.includes('jaga') || t.includes('pertahan')) return 'protect';
    if (t.includes('hack') || t.includes('komputer') || t.includes('sistem')) return 'hack';
    if (t.includes('negosiasi') || t.includes('tawar') || t.includes('bayar')) return 'negotiate';
    if (t.includes('observasi') || t.includes('amati') || t.includes('perhatikan')) return 'observe';
    if (t.includes('serang') || t.includes('bunuh') || t.includes('strike')) return 'killer';
    if (t.includes('telepon') || t.includes('hubungi')) return 'social';
    return 'story';
  }

  function calcRisk(choice) {
    if (choice.risk !== undefined) return choice.risk;
    const cat = detectCategory(choice);
    const baseRisk = { killer: 90, confront: 60, accuse: 55, escape: 50, investigate: 30, hack: 35, move: 20, social: 15, alliance: 10, observe: 10, protect: 40, negotiate: 25, hide: 20, stealth: 35, story: 5 };
    let risk = baseRisk[cat] || 15;
    if (choice.danger) risk = Math.max(risk, 75);
    if (state.dangerLevel > 50) risk += 10;
    return Math.min(risk, 100);
  }

  function calcReward(choice) {
    if (choice.reward !== undefined) return choice.reward;
    const cat = detectCategory(choice);
    const baseReward = { investigate: 80, accuse: 85, hack: 75, confront: 70, alliance: 65, social: 50, observe: 55, negotiate: 60, protect: 45, killer: 90, escape: 30, move: 20, hide: 15, stealth: 40, story: 35 };
    return baseReward[cat] || 35;
  }

  function renderChoices(choices) {
    const container = $('choices-container');
    container.innerHTML = '';

    const available = choices.filter(c => {
      if (c.condition && !c.condition(state)) return false;
      if (c.minDifficulty && state.difficulty < c.minDifficulty) return false;
      if (c.maxDifficulty && state.difficulty > c.maxDifficulty) return false;
      const txt = typeof c.text === 'function' ? c.text(state) : c.text;
      if (txt === null || txt === undefined) return false;
      // Block protect/lindungi/guard options for killer players
      if (isPlayerKiller()) {
        const cat = detectCategory(c);
        if (cat === 'protect') return false;
        const lowerText = (txt || '').toLowerCase();
        if (lowerText.includes('lindungi') || lowerText.includes('protect') || lowerText.includes('jaga ') || lowerText.includes('pertahan')) {
          const actionType = c.category || cat;
          if (actionType === 'protect' || actionType === 'guard' || actionType === 'coordinate_defense' || actionType === 'rally' || actionType === 'secure_exit') return false;
        }
      }
      return true;
    });

    if (available.length === 0 && choices.length === 0) return;

    // Limit player options — prioritize BRAIN interactive choices, then story
    let displayed = available;
    const maxOpts = isPlayerKiller() ? MAX_PLAYER_OPTIONS_KILLER : MAX_PLAYER_OPTIONS;
    if (displayed.length > maxOpts) {
      const brain = displayed.filter(c => c.type === 'brain' || c.type === 'brain-killer');
      const story = displayed.filter(c => !c.type || c.type === 'story' || (!c.type?.startsWith('brain')));
      // Shuffle brain choices for variety each game
      for (let i = brain.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [brain[i], brain[j]] = [brain[j], brain[i]];
      }
      // Show 1 story choice max + fill rest with brain choices
      const storySlot = story.length > 0 ? 1 : 0;
      displayed = story.slice(0, storySlot).concat(brain.slice(0, maxOpts - storySlot));
      displayed = displayed.slice(0, maxOpts);
    }

    displayed.forEach((choice, i) => {
      const btn = document.createElement('button');
      const cat = detectCategory(choice);
      const catInfo = ACTION_CATEGORIES[cat] || ACTION_CATEGORIES.story;
      const risk = calcRisk(choice);
      const reward = calcReward(choice);
      const isBrain = choice.type === 'brain' || choice.type === 'brain-killer';

      btn.className = 'choice-btn choice-cat-' + cat;
      if (choice.type) btn.classList.add('choice-' + choice.type);
      if (choice.danger) btn.classList.add('choice-dangerous');
      if (isBrain) btn.classList.add('choice-interactive');

      const choiceText = typeof choice.text === 'function' ? choice.text(state) : t(choice.text);
      const cleanText = choiceText.replace(/^\[BRAIN\]\s*/, '');

      let html = `<div class="choice-inner">`;
      html += `<div class="choice-icon-wrap" style="--cat-color:${catInfo.color}">`;
      html += `<span class="choice-icon">${catInfo.icon}</span>`;
      html += `</div>`;
      html += `<div class="choice-content">`;
      html += `<div class="choice-label">${catInfo.label}</div>`;
      html += `<div class="choice-text-main">${cleanText}</div>`;

      if (choice.hint && state.difficulty <= 2) {
        const hintText = typeof choice.hint === 'function' ? choice.hint(state) : t(choice.hint);
        html += `<span class="choice-hint">${hintText}</span>`;
      }
      if (choice.successChance !== undefined) {
        const chClass = choice.successChance >= 60 ? 'chance-high' : choice.successChance >= 35 ? 'chance-mid' : 'chance-low';
        html += `<span class="choice-chance ${chClass}">Peluang: ${choice.successChance}%</span>`;
      }
      html += `</div>`;

      // Risk/Reward meter
      if (state.chapter >= 0) {
        html += `<div class="choice-meters">`;
        const riskClass = risk > 65 ? 'meter-high' : risk > 35 ? 'meter-mid' : 'meter-low';
        const rewardClass = reward > 65 ? 'meter-high' : reward > 35 ? 'meter-mid' : 'meter-low';
        html += `<div class="choice-meter"><span class="meter-label">Risiko</span><div class="meter-bar"><div class="meter-fill ${riskClass}" style="width:${risk}%"></div></div></div>`;
        html += `<div class="choice-meter"><span class="meter-label">Hasil</span><div class="meter-bar"><div class="meter-fill reward-fill ${rewardClass}" style="width:${reward}%"></div></div></div>`;
        html += `</div>`;
      }

      if (choice.danger) {
        html += `<div class="choice-danger-badge">\u26A0 BAHAYA</div>`;
      }

      html += `</div>`;
      btn.innerHTML = html;

      btn.addEventListener('click', () => {
        btn.classList.add('choice-selected');
        container.querySelectorAll('.choice-btn').forEach(b => {
          if (b !== btn) b.classList.add('choice-fading');
        });
        setTimeout(() => {
          if (choice.effect) choice.effect(state);
          if (choice.key) state.keyChoices.push(choice.key);
          const next = typeof choice.next === 'function' ? choice.next(state) : choice.next;
          if (next) {
            // If brain choice loops back to same node, mark as revisit
            if (isBrain && next === currentNodeId) {
              brainActionCount++;
              isBrainRevisit = true;
            } else {
              brainActionCount = 0;
            }
            renderNode(next);
          }
        }, 400);
      });

      btn.style.animationDelay = (i * 0.15) + 's';
      container.appendChild(btn);
    });

    // Adjust story padding so last message is visible above choices
    requestAnimationFrame(() => adjustStoryPadding());
  }

  const CHAPTERS = {
    id: ['Prolog', 'Bab 1: Pameran Maut', 'Bab 2: Darah Pertama', 'Bab 3: Pecah Belah', 'Bab 4: Perburuan', 'Bab 5: Wahyu', 'Bab 6: Konfrontasi', 'Bab 7: Simpul Terakhir', 'Bab 8: Titik Balik', 'Bab 9: Terakhir Berdiri', 'Bab 10: Fajar Berdarah'],
    en: ['Prologue', 'Chapter 1: The Death Exhibition', 'Chapter 2: First Blood', 'Chapter 3: Fractured', 'Chapter 4: The Hunt', 'Chapter 5: Revelation', 'Chapter 6: Confrontation', 'Chapter 7: The Last Knot', 'Chapter 8: Turning Point', 'Chapter 9: Last Standing', 'Chapter 10: Bloody Dawn']
  };
  function updateChapterIndicator() {
    $('chapter-indicator').textContent = (CHAPTERS[lang] || CHAPTERS.id)[state.chapter] || '';
    // Update WhatsApp group members list
    updateWaMembers();
  }

  function adjustStoryPadding() {
    const storyArea = $('story-area');
    const choicesEl = $('choices-container');
    if (!storyArea || !choicesEl) return;
    const choicesH = choicesEl.offsetHeight;
    // Ensure enough bottom padding so last message isn't hidden behind choices
    storyArea.style.paddingBottom = Math.max(choicesH + 24, 120) + 'px';
  }

  function updateWaMembers() {
    const el = $('wa-members');
    if (!el) return;
    const aliveNames = CHARACTERS.filter(c => state.alive[c]).map(c => CHAR_DISPLAY[c] || c);
    if (aliveNames.length > 0) {
      el.textContent = aliveNames.join(', ');
    } else {
      el.textContent = 'Mansion Wardhana';
    }
  }

  function updateCharPanel() {
    const container = $('character-list');
    container.innerHTML = '';
    CHARACTERS.forEach(name => {
      if (!state.alive.hasOwnProperty(name)) return;
      const div = document.createElement('div');
      div.className = 'char-card';
      const displayName = CHAR_DISPLAY[name];
      const alive = state.alive[name];
      const susp = state.suspicion[name] || 0;
      const statusClass = !alive ? 'dead' : susp > 60 ? 'corrupted' : '';
      const statusLabel = !alive ? 'Tewas' : susp > 60 ? 'Tersangka' : 'Hidup';

      let relHtml = '';
      MAIN_CHARACTERS.forEach(other => {
        if (other === name) return;
        if (!state.alive[other]) return;
        const tr = getTrust(name, other);
        const otherDisplay = CHAR_DISPLAY[other];
        const color = tr > 60 ? 'trust' : tr < 40 ? 'fear' : 'neutral';
        relHtml += `<div class="char-rel">${otherDisplay}: ${tr}%<div class="char-rel-bar"><div class="char-rel-fill ${color}" style="width:${tr}%"></div></div></div>`;
      });

      const pc = playerChar();
      const isPC = name === pc;
      const awarenessBar = name === 'arin' || isPC ? `<div class="char-awareness">Kewaspadaan: ${state.awareness[name] || state.awareness.arin || 0}%<div class="char-rel-bar"><div class="char-rel-fill awareness" style="width:${state.awareness[name] || state.awareness.arin || 0}%"></div></div></div>` : '';

      const portraitHtml = getPortraitHTML(name, 'char-portrait');
      const isMainChar = MAIN_CHARACTERS.includes(name);

      // NPC brain info
      let brainHtml = '';
      if (state.npcMinds && state.npcMinds[name] && alive) {
        const mind = state.npcMinds[name];
        const emotionLabel = typeof CharDB !== 'undefined' ? CharDB.getStatusText(name, mind) : mind.emotion;
        const locLabel = typeof CharBrain !== 'undefined' ? CharBrain.locName(mind.location) : mind.location;
        brainHtml = `
          <div class="char-brain-info">
            <div class="char-brain-emotion">Emosi: <span class="brain-${mind.emotion}">${emotionLabel}</span></div>
            <div class="char-brain-loc">Lokasi: ${locLabel}</div>
            ${mind.allies.length > 0 ? `<div class="char-brain-allies">Aliansi: ${mind.allies.map(a => CHAR_DISPLAY[a] || a).join(', ')}</div>` : ''}
            ${mind.hasClue.length > 0 ? `<div class="char-brain-clues">Petunjuk: ${mind.hasClue.length}</div>` : ''}
          </div>
        `;
      }

      div.innerHTML = `
        <div class="char-header">
          ${portraitHtml}
          <div class="char-info">
            <div class="char-name speaker ${name}">${displayName}${isPC ? ' <small class="player-tag">(KAMU)</small>' : ''}${!isMainChar && !isPC ? ' <small>(side)</small>' : ''}</div>
            <div class="char-status ${statusClass}">${statusLabel}</div>
          </div>
        </div>
        ${awarenessBar}
        ${brainHtml}
        ${alive ? relHtml : ''}
      `;
      container.appendChild(div);
    });

    // Danger level indicator
    if (state.awareness.arin > 20) {
      const dangerDiv = document.createElement('div');
      dangerDiv.className = 'char-card entity-card';
      dangerDiv.innerHTML = `
        <div class="char-name speaker entity">Tingkat Bahaya</div>
        <div class="char-rel">Ancaman: ${state.dangerLevel}%<div class="char-rel-bar"><div class="char-rel-fill entity-bar" style="width:${state.dangerLevel}%"></div></div></div>
      `;
      container.appendChild(dangerDiv);
    }
  }

  // ---- Role Selection Screen ----
  let selectedDifficulty = 2;

  function renderRoleSelect() {
    const container = $('role-grid');
    if (!container) return;
    container.innerHTML = '';

    const killerNames = KILLER_CONFIG[selectedDifficulty].killers;
    const survivorNames = CHARACTERS.filter(n => !killerNames.includes(n));

    // --- SURVIVOR OPTION: Random character ---
    const survCard = document.createElement('div');
    survCard.className = 'role-card role-card-survivor';
    survCard.style.setProperty('--role-color', '#4a7c59');
    survCard.innerHTML = `
      <span class="role-portrait css-avatar-role" style="background:#4a7c59">🛡️</span>
      <div class="role-info">
        <div class="role-name" style="color:#4a7c59">Survivor</div>
        <div class="role-title">Karakter Acak</div>
        <div class="role-perk">Kau akan mendapat salah satu dari ${survivorNames.length} protagonist secara acak</div>
        <div class="role-desc">Setiap survivor punya kemampuan pasif unik. Bertahan hidup, kumpulkan petunjuk, ungkap identitas killer.</div>
        <div class="role-survivor-list">${survivorNames.map(n => {
          const r = ROLE_DESCRIPTIONS[n];
          return `<span class="role-survivor-chip" style="border-color:${CHAR_COLORS[n]}">${CHAR_DISPLAY[n]} — ${r.perk}</span>`;
        }).join('')}</div>
      </div>
    `;
    survCard.addEventListener('click', () => {
      const randomSurvivor = survivorNames[Math.floor(Math.random() * survivorNames.length)];
      state = defaultState(selectedDifficulty, randomSurvivor);
      resetChatTimestamp();
      // Vira's ability: start with 2 known clue locations
      const startClueCount = getCharAbility(randomSurvivor, 'startClues');
      if (startClueCount > 0) {
        applyStartClues(state, startClueCount);
      }
      currentNodeId = null;
      showScreen('screen-characters');
      renderCharacterIntro();
    });
    container.appendChild(survCard);

    // --- KILLER OPTIONS: Show each available killer ---
    killerNames.forEach((name, idx) => {
      const role = ROLE_DESCRIPTIONS[name];
      const color = CHAR_COLORS[name] || '#8b0000';
      const displayName = CHAR_DISPLAY[name];

      const card = document.createElement('div');
      card.className = 'role-card role-card-killer';
      card.style.animationDelay = ((idx + 1) * 0.12) + 's';
      card.style.setProperty('--role-color', color);

      const portraitContent = CHAR_PORTRAITS[name]
        ? `<img class="role-portrait" src="${CHAR_PORTRAITS[name]}" alt="${displayName}">`
        : `<span class="role-portrait css-avatar-role" style="background:${color}">${CHAR_INITIALS[name] || displayName.charAt(0)}</span>`;

      card.innerHTML = `
        ${portraitContent}
        <div class="role-info">
          <div class="role-name" style="color:${color}">${displayName}</div>
          <div class="role-title">${role.role} — Killer</div>
          <div class="role-perk">${role.perk}</div>
          <div class="role-desc">${role.desc}</div>
          <div class="role-warning">Peran Gelap: Kau bermain sebagai antagonis</div>
        </div>
      `;

      card.addEventListener('click', () => {
        state = defaultState(selectedDifficulty, name);
        resetChatTimestamp();
        currentNodeId = null;
        showScreen('screen-characters');
        renderCharacterIntro();
      });

      container.appendChild(card);
    });
  }

  // Apply Vira's startClues ability
  function applyStartClues(gameState, count) {
    if (!gameState.escapeClueLocations) return;
    const locs = Object.keys(gameState.escapeClueLocations);
    const shuffled = locs.sort(() => Math.random() - 0.5);
    const revealed = shuffled.slice(0, Math.min(count, shuffled.length));
    if (!gameState.revealedClueLocations) gameState.revealedClueLocations = [];
    revealed.forEach(loc => {
      if (!gameState.revealedClueLocations.includes(loc)) {
        gameState.revealedClueLocations.push(loc);
      }
    });
  }

  // ---- Character Introduction Screen ----
  function renderCharacterIntro() {
    const container = $('characters-grid');
    if (!container) return;
    container.innerHTML = '';

    if (typeof CHARACTER_PROFILES === 'undefined') {
      showScreen('screen-game');
      updateChapterIndicator();
      initParticles();
      renderNode('prologue_start');
      return;
    }

    let currentFocus = -1;

    CHARACTERS.forEach((name, idx) => {
      const profile = CHARACTER_PROFILES[name];
      if (!profile) return;

      const card = document.createElement('div');
      card.className = 'char-intro-card' + (profile.isMain ? '' : ' char-side');
      card.style.animationDelay = (idx * 0.1) + 's';
      card.dataset.char = name;

      const portraitContent = profile.portrait
        ? `<img class="char-intro-portrait" src="${profile.portrait}" alt="${profile.name}" loading="lazy">`
        : `<span class="char-intro-portrait css-avatar-large" style="background:${profile.color}">${profile.initials || profile.name.charAt(0)}</span>`;

      card.innerHTML = `
        <div class="char-intro-portrait-wrap">
          ${portraitContent}
          <div class="char-intro-glow" style="background:${profile.color}"></div>
        </div>
        <div class="char-intro-name">${profile.name}</div>
        <div class="char-intro-role">${profile.role}</div>
      `;

      card.addEventListener('click', () => {
        if (currentFocus === idx) {
          closeCharDetail();
          currentFocus = -1;
          return;
        }
        currentFocus = idx;
        showCharDetail(profile);
      });

      container.appendChild(card);
    });
  }

  function showCharDetail(profile) {
    let modal = $('char-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'char-detail-modal';
      modal.className = 'char-detail-modal';
      document.body.appendChild(modal);
    }

    const traitsHtml = profile.traits.map(t => `<span class="char-trait">${t}</span>`).join('');

    let relHtml = '';
    if (profile.relationships) {
      Object.entries(profile.relationships).forEach(([key, desc]) => {
        const relProfile = CHARACTER_PROFILES[key];
        const relName = relProfile ? relProfile.name : key;
        let relPortraitHtml;
        if (relProfile && relProfile.portrait) {
          relPortraitHtml = `<img class="char-rel-portrait" src="${relProfile.portrait}" alt="${relName}">`;
        } else if (relProfile) {
          relPortraitHtml = `<span class="char-rel-portrait css-avatar" style="background:${relProfile.color}">${relProfile.initials || relName.charAt(0)}</span>`;
        } else {
          relPortraitHtml = `<span class="char-rel-portrait css-avatar">${relName.charAt(0)}</span>`;
        }
        relHtml += `
          <div class="char-rel-entry">
            ${relPortraitHtml}
            <div class="char-rel-detail">
              <strong>${relName}</strong>
              <p>${desc}</p>
            </div>
          </div>
        `;
      });
    }

    const portraitEl = profile.portrait
      ? `<img class="char-detail-portrait" src="${profile.portrait}" alt="${profile.name}">`
      : `<span class="char-detail-portrait css-avatar-xlarge" style="background:${profile.color}">${profile.initials || profile.name.charAt(0)}</span>`;

    modal.innerHTML = `
      <div class="char-detail-content" style="border-color:${profile.color}">
        <button class="char-detail-close" onclick="document.getElementById('char-detail-modal').classList.remove('active')">&times;</button>
        <div class="char-detail-header">
          ${portraitEl}
          <div class="char-detail-info">
            <h2 class="char-detail-name" style="color:${profile.color}">${profile.fullName}</h2>
            <div class="char-detail-role">${profile.role}</div>
            <div class="char-detail-age">Usia: ${profile.age} tahun</div>
            <div class="char-detail-quote">"${profile.quote.replace(/"/g, '')}"</div>
          </div>
        </div>
        <div class="char-detail-section">
          <h3>Penampilan</h3>
          <p>${profile.appearance}</p>
        </div>
        <div class="char-detail-section">
          <h3>Kepribadian</h3>
          <p>${profile.personality}</p>
        </div>
        <div class="char-detail-section">
          <h3>Latar Belakang</h3>
          <p>${profile.backstory}</p>
        </div>
        <div class="char-detail-section">
          <h3>Sifat Utama</h3>
          <div class="char-traits-list">${traitsHtml}</div>
        </div>
        <div class="char-detail-section">
          <h3>Kelemahan</h3>
          <p class="char-weakness">${profile.weakness}</p>
        </div>
        <div class="char-detail-section">
          <h3>Hubungan</h3>
          <div class="char-rel-list">${relHtml}</div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  function closeCharDetail() {
    const modal = $('char-detail-modal');
    if (modal) modal.classList.remove('active');
  }

  // ---- Endings System ----
  function triggerEnding(node) {
    if (node.onEnter) return;
    const endingNum = node.endingNumber || 1;
    showDirectEnding(endingNum, node);
  }

  function showDirectEnding(num, endingInfo) {
    const endingTitle = endingInfo.title ? t(endingInfo.title) : `Ending #${num}`;
    const endingText = endingInfo.endingText ? (typeof endingInfo.endingText === 'function' ? endingInfo.endingText(state) : t(endingInfo.endingText)) : '';
    const rating = endingInfo.rating || 'C';

    const fates = CHARACTERS.map(name => {
      const displayName = CHAR_DISPLAY[name];
      const alive = state.alive[name];
      const wasKiller = isKiller(name);
      let fateText = '';
      if (endingInfo.fates && endingInfo.fates[name]) {
        fateText = t(endingInfo.fates[name]);
      } else if (!alive) {
        fateText = wasKiller ? 'Tewas (Pembunuh)' : 'Tidak selamat';
      } else if (wasKiller && state.killerRevealed.includes(name)) {
        fateText = 'Terungkap sebagai pembunuh';
      } else if (wasKiller) {
        fateText = 'Selamat (identitas tersembunyi)';
      } else {
        fateText = 'Selamat';
      }
      return { name: displayName, alive, wasKiller, text: fateText };
    });

    const data = { number: num, title: endingTitle, rating, text: endingText, fates };
    endingsUnlocked[num] = { title: endingTitle, rating };
    SecGuard.safeSetItem('simpul_endings', JSON.stringify(endingsUnlocked));
    showEndingScreen(data);
  }

  function showEndingScreen(data) {
    showScreen('screen-ending');
    $('ending-number').textContent = `#${data.number}`;
    $('ending-title').textContent = data.title;
    const ratingEl = $('ending-rating');
    ratingEl.textContent = data.rating;
    ratingEl.className = 'ending-rating rating-' + data.rating;
    $('ending-text').innerHTML = data.text;

    const fatesEl = $('ending-fates');
    fatesEl.innerHTML = data.fates.map(f => {
      const cls = !f.alive ? 'fate-dead' : f.wasKiller ? 'fate-corrupted' : 'fate-alive';
      return `<div class="fate-item"><span class="fate-name ${cls}">${f.name}</span>: ${f.text}</div>`;
    }).join('');

    updateEndingsCount();
  }

  function showGallery() {
    showScreen('screen-gallery');
    $('gallery-title').textContent = 'Galeri Ending';
    const grid = $('gallery-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 25; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      if (endingsUnlocked[i]) {
        item.classList.add('unlocked');
        const ratingClass = endingsUnlocked[i].rating ? 'rating-' + endingsUnlocked[i].rating : '';
        item.innerHTML = `<div class="gi-number ${ratingClass}">#${i}</div><div class="gi-title">${endingsUnlocked[i].title}</div>`;
      } else {
        item.innerHTML = `<div class="gi-number">#${i}</div><div class="gi-locked">\uD83D\uDD12</div>`;
      }
      grid.appendChild(item);
    }
  }

  function updateEndingsCount() {
    const el = $('endings-count');
    if (el) el.textContent = Object.keys(endingsUnlocked).length;
  }

  // ---- Save / Load ----
  function saveGame() {
    const saveData = { state, currentNodeId, lang, version: 5 };
    saveData.checksum = SecGuard.computeChecksum(saveData);
    SecGuard.safeSetItem('simpul_save', JSON.stringify(saveData));
  }

  function loadGame() {
    const data = SecGuard.safeJSONParse(SecGuard.safeGetItem('simpul_save'), null);
    if (!data || data.version < 5) { notify('Save lama tidak kompatibel. Mulai game baru.'); return false; }
    if (!SecGuard.validateSaveData(data)) { notify('Data save tidak valid atau telah dimodifikasi.'); return false; }
    // Verify checksum integrity
    if (data.checksum !== undefined) {
      const expected = SecGuard.computeChecksum(data);
      if (data.checksum !== expected) {
        notify('⚠ Data save terdeteksi telah diubah. Save dihapus untuk keamanan.');
        SecGuard.safeSetItem('simpul_save', '');
        return false;
      }
    }
    state = data.state;
    currentNodeId = data.currentNodeId;
    lang = data.lang || 'id';
    return true;
  }

  function hasSave() {
    const d = SecGuard.safeGetItem('simpul_save');
    if (!d) return false;
    try { const p = SecGuard.safeJSONParse(d, null); return p && p.version >= 5; } catch(e) { return false; }
  }

  // ---- Panel Toggle ----
  function togglePanel(panelId) {
    const panel = $(panelId);
    const isOpen = panel.classList.contains('open');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
    $('overlay').classList.remove('active');
    if (!isOpen) {
      panel.classList.add('open');
      $('overlay').classList.add('active');
      if (panelId === 'panel-status') updateCharPanel();
    }
  }

  // ---- Init ----
  function init(nodes) {
    storyNodes = nodes;
    updateEndingsCount();

    if (hasSave()) $('btn-continue').style.display = '';

    $('btn-new-game').addEventListener('click', () => {
      showScreen('screen-difficulty');
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDifficulty = parseInt(btn.dataset.diff);
        showScreen('screen-role-select');
        renderRoleSelect();
      });
    });

    const skipCharsBtn = $('btn-skip-chars');
    if (skipCharsBtn) {
      skipCharsBtn.addEventListener('click', () => {
        showScreen('screen-game');
        updateChapterIndicator();
        initParticles();
        renderNode('prologue_start');
      });
    }

    $('btn-continue').addEventListener('click', () => {
      if (loadGame()) {
        showScreen('screen-game');
        renderNode(currentNodeId);
      }
    });

    $('btn-endings-gallery').addEventListener('click', showGallery);
    $('btn-close-gallery').addEventListener('click', () => showScreen('screen-title'));

    $('btn-how-to-play').addEventListener('click', () => showScreen('screen-how-to-play'));
    $('btn-rules-back').addEventListener('click', () => showScreen('screen-title'));

    $('btn-menu').addEventListener('click', () => togglePanel('panel-menu'));
    $('btn-status').addEventListener('click', () => togglePanel('panel-status'));
    const npcLogBtn = $('btn-npc-log');
    if (npcLogBtn) npcLogBtn.addEventListener('click', () => { togglePanel('panel-npc-log'); updateNpcLogPanel(); });
    $('btn-close-menu').addEventListener('click', () => togglePanel('panel-menu'));
    $('btn-close-status').addEventListener('click', () => togglePanel('panel-status'));
    const closeNpcLogBtn = $('btn-close-npc-log');
    if (closeNpcLogBtn) closeNpcLogBtn.addEventListener('click', () => togglePanel('panel-npc-log'));
    $('overlay').addEventListener('click', () => {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
      $('overlay').classList.remove('active');
    });

    // Click story area to skip stagger animation
    $('story-area').addEventListener('click', (e) => {
      if (e.target.closest('.choice-btn') || e.target.closest('.chat-bubble') || e.target.closest('.panel')) return;
      if (staggerTimers.length > 0) skipStaggerAnimation();
    });

    $('btn-save').addEventListener('click', () => { saveGame(); notify('Game tersimpan'); togglePanel('panel-menu'); });
    $('btn-load').addEventListener('click', () => {
      if (loadGame()) { togglePanel('panel-menu'); renderNode(currentNodeId); }
    });
    $('btn-quit').addEventListener('click', () => {
      togglePanel('panel-menu');
      showScreen('screen-title');
      if (hasSave()) $('btn-continue').style.display = '';
    });

    $('btn-play-again').addEventListener('click', () => {
      showScreen('screen-difficulty');
    });
    $('btn-title-screen').addEventListener('click', () => {
      showScreen('screen-title');
      updateEndingsCount();
      if (hasSave()) $('btn-continue').style.display = '';
    });

    showScreen('screen-title');
  }

  return {
    init, t, getTrust, modTrust, modAwareness, modDanger, modSuspicion,
    killChar, canDie, isKiller, aliveCount, aliveMainCount, addAlliance,
    screenShake, bloodDrip, glitch, deathFlash, showChapterTitle, notify,
    showDirectEnding, renderNode, getPortraitHTML,
    isPlayer, playerChar, playerName, isPlayerKiller, getPlayerPerspective,
    initNpcMinds, runNpcRound, checkWinLossState, updateNpcLogPanel,
    // Tool system
    pickupTool, getCharTool, getToolOwner, isToolAvailable, npcPickupTool,
    getToolBonus, rollChance, updatePlayerStatus,
    // Escape system
    getEscapeClueAtLocation, findEscapeClue, destroyEscapeClue, canEscape,
    triggerMansionEscape, allKillersDead, aliveKillerCount, aliveSurvivorCount,
    ESCAPE_CLUE_LOCATIONS,
    GAME_TOOLS, ROLE_DESCRIPTIONS,
    get state() { return state; },
    get lang() { return lang; },
    CHARACTERS, MAIN_CHARACTERS, SIDE_CHARACTERS, CHAR_DISPLAY, diffMult
  };
})();
