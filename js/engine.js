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
  let globalActionMemory = [];  // Track action TYPES globally to prevent cross-reset loops
  let locationStaleRounds = 0;  // How many consecutive brain actions without moving
  let lastPlayerLocation = null; // Track player location changes
  const BRAIN_MAX_PER_NODE = 3; // Max brain actions per node — force story progression faster
  const BRAIN_MAX_PER_NODE_KILLER = 2; // Killer gets even fewer — fast pacing
  const STALE_THRESHOLD = 2;    // Force movement after 2 stationary actions (was 3)
  const STALE_DANGER_PER_ROUND = 8; // Danger increase per stale round (was 5)
  const MAX_PLAYER_OPTIONS = 6; // Max choices shown to player per node — brain interactive first
  const MAX_PLAYER_OPTIONS_KILLER = 4; // Killer gets fewer choices — less overwhelming
  let typingTimeout = null;

  // ---- 7 Unique Tools System ----
  // Each tool can only be held by one character. Once picked up, no one else can get it.
  // Tools trigger based on events and provide support or execution abilities.
  const GAME_TOOLS = {
    pisau_dapur:    { name: 'Pisau Dapur', icon: '\uD83D\uDD2A', type: 'weapon', desc: 'Senjata jarak dekat. +40% chance kill, tapi meninggalkan bukti darah.', triggerLoc: 'dapur', offense: 40, defense: 10, evidence: true },
    kunci_master:   { name: 'Kunci Master', icon: '\uD83D\uDD11', type: 'support', desc: 'Buka semua pintu di mansion. Akses ke semua ruangan termasuk Bunker B-3.', triggerLoc: 'bunker_b3', offense: 0, defense: 20, unlocks: true },
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
    arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira',
    reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah'
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
      role: 'Penulis',
      perk: '+20% persuasi & narasi',
      desc: 'Novelis horor. Ahli merangkai kata dan situasi — mempengaruhi persepsi orang lain dengan cerita.',
      icon: 'pena'
    },
    dimas: {
      role: 'Medis',
      perk: '+15% pertolongan & analisis',
      desc: 'Mahasiswa forensik. Keahlian medis dan analitis — bisa membaca situasi dengan presisi klinis.',
      icon: 'pisau'
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
    farah: { clueSearch: 0, defense: 10, offense: 0, trust: 15, investigation: 0, flee: 0, accusation: 0, detection: 0, allianceBonus: 12 },
    // Killer abilities
    lana:  { clueSearch: 0, defense: 0, offense: 0, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, framingBonus: 20, stealthBonus: 15 },
    dimas: { clueSearch: 0, defense: 0, offense: 15, trust: 0, investigation: 0, flee: 0, accusation: 0, detection: 0, silentKill: true }
  };

  // ---- Character-Specific Action Flavor ----
  // Each character gets unique text and unique actions reflecting their personality.
  // This prevents characters from "taking over" each other's action style.
  const CHARACTER_ACTION_FLAVOR = {
    arin: {
      investigate: (loc) => `Recorder menyala — investigasi ${CharBrain.locName(loc)} dengan mata jurnalis`,
      observe: (target) => `Amati gerak-gerik ${CharBrain.charName(target)} — catat di recorder`,
      talk: (target) => `Wawancarai ${CharBrain.charName(target)} — gali informasi`,
      accuse: (target) => `Tunjukkan bukti ke ${CharBrain.charName(target)}: "Aku tahu apa yang kau lakukan."`,
      hide: (loc) => `Matikan lampu, sembunyi di ${CharBrain.locName(loc)} — recorder tetap menyala`,
      ally: (target) => `Ajak ${CharBrain.charName(target)} berkolaborasi — "Kita butuh satu sama lain"`,
      escape_clue: (loc) => `Cari petunjuk pelarian di ${CharBrain.locName(loc)} — ikuti insting jurnalis`,
      unique: [
        {
          id: 'arin_deep_investigate',
          text: (loc) => `Bongkar semua catatan — investigasi mendalam di ${CharBrain.locName(loc)}`,
          category: 'investigate',
          hint: 'Kemampuan jurnalis: temukan petunjuk tersembunyi dengan +20% bonus',
          condition: (gs, nearby) => gs.chapter >= 1,
          risk: 25, reward: 85,
          effect: (s, pc) => {
            const baseChance = 60 + getCharAbility(pc, 'clueSearch');
            const result = rollChance(baseChance, pc, 'intel');
            if (result.success) {
              s.cluesFound = (s.cluesFound || 0) + 1;
              const nearbyKillers = Object.keys(s.npcMinds || {}).filter(n =>
                s.alive[n] && s.killers.includes(n) && s.npcMinds[n].location === (s.playerLocation || 'aula_utama'));
              nearbyKillers.forEach(k => Engine.modSuspicion(k, 12));
              Engine.notify(`Investigasi mendalam berhasil! Catatan jurnalis mengungkap pola baru. (${result.chance}%, roll: ${result.roll})`);
            } else {
              Engine.notify(`Tidak ada petunjuk baru kali ini. (${result.chance}%, roll: ${result.roll})`);
            }
          }
        },
        {
          id: 'arin_protect_sera',
          text: () => `Lindungi Sera — "Tetap di belakangku."`,
          category: 'protect',
          hint: 'Lindungi Sera dari ancaman. Trust Sera meningkat.',
          condition: (gs, nearby) => nearby.includes('sera') && (gs.dangerLevel || 0) >= 30,
          risk: 35, reward: 70,
          effect: (s, pc) => {
            Engine.modTrust(pc, 'sera', 12);
            Engine.modDanger(-8);
            Engine.notify('Kau berdiri di depan Sera. Trust +12%. Bahaya turun.');
          }
        }
      ]
    },
    sera: {
      investigate: (loc) => `Profiling — analisis pola perilaku di ${CharBrain.locName(loc)}`,
      observe: (target) => `Baca micro-expression ${CharBrain.charName(target)} — profiling psikologis`,
      talk: (target) => `Analisis ${CharBrain.charName(target)} lewat percakapan — cari tanda kebohongan`,
      accuse: (target) => `"Pupilmu melebar saat kau berbohong." Tuduh ${CharBrain.charName(target)}.`,
      hide: (loc) => `Menunduk diam di ${CharBrain.locName(loc)} — otak tetap menganalisis`,
      ally: (target) => `Tawarkan profiling ke ${CharBrain.charName(target)} — "Kita bisa saling melengkapi"`,
      escape_clue: (loc) => `Prediksi lokasi petunjuk pelarian di ${CharBrain.locName(loc)} berdasarkan pola`,
      unique: [
        {
          id: 'sera_deep_profile',
          text: (loc) => `Profiling mendalam — baca semua yang ada di ${CharBrain.locName(loc)}`,
          category: 'observe',
          hint: 'Kemampuan profiler: deteksi emosi & tension NPC dengan presisi (+20%)',
          condition: (gs, nearby) => nearby.length > 0,
          risk: 10, reward: 80,
          effect: (s, pc) => {
            const nearby = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && s.npcMinds[n].location === (s.playerLocation || 'aula_utama'));
            let report = [];
            nearby.forEach(n => {
              const mind = s.npcMinds[n];
              if (!mind) return;
              const isK = s.killers.includes(n);
              const detectChance = 0.55 + (getCharAbility(pc, 'detection') / 100);
              if (isK && Math.random() < detectChance) {
                Engine.modSuspicion(n, 10);
                report.push(`${CharBrain.charName(n)}: ANOMALI terdeteksi! Suspicion +10%`);
              } else {
                report.push(`${CharBrain.charName(n)}: ${mind.emotion}, tension ${mind.tension}%`);
              }
            });
            Engine.notify('Profiling: ' + report.join(' | '));
          }
        },
        {
          id: 'sera_protect_arin',
          text: () => `Lindungi Arya — tidak bisa membayangkan kehilangannya`,
          category: 'protect',
          hint: 'Berdiri di samping Arya. Trust meningkat.',
          condition: (gs, nearby) => nearby.includes('arin') && (gs.dangerLevel || 0) >= 30,
          risk: 35, reward: 70,
          effect: (s, pc) => {
            Engine.modTrust(pc, 'arin', 12);
            Engine.modDanger(-8);
            Engine.notify('Kau berdiri di samping Arya. Trust +12%. Bahaya turun.');
          }
        }
      ]
    },
    niko: {
      investigate: (loc) => `Buka panel rahasia — gunakan pengetahuan mansion di ${CharBrain.locName(loc)}`,
      observe: (target) => `Hitung langkah ${CharBrain.charName(target)} — kalkulasi dingin`,
      talk: (target) => `Bicaralah dengan ${CharBrain.charName(target)} — setiap kata diukur`,
      accuse: (target) => `"Aku sudah tahu sejak awal." Ungkap ${CharBrain.charName(target)}.`,
      hide: (loc) => `Menghilang ke ruangan tersembunyi di ${CharBrain.locName(loc)}`,
      ally: (target) => `Rekrut ${CharBrain.charName(target)} — "Kita butuh satu sama lain. Untuk saat ini."`,
      escape_clue: (loc) => `Cari jalur rahasia mansion di ${CharBrain.locName(loc)}`,
      unique: [
        {
          id: 'niko_secret_passage',
          text: (loc) => `Gunakan jalur rahasia — keuntungan tuan rumah di ${CharBrain.locName(loc)}`,
          category: 'investigate',
          hint: 'Hanya Niko yang tahu jalan rahasia mansion. +1 lokasi ekstra.',
          condition: (gs) => true,
          risk: 10, reward: 65,
          effect: (s, pc) => {
            const allLocs = CharBrain.LOCATIONS || ['aula_utama','perpustakaan','dapur','basement','menara','taman_dalam','galeri_timur','bunker_b3'];
            const currentLoc = s.playerLocation || 'aula_utama';
            const otherLocs = allLocs.filter(l => l !== currentLoc);
            const secretLoc = otherLocs[Math.floor(Math.random() * otherLocs.length)];
            Engine.notify(`Kau menemukan jalur rahasia kakek ke ${CharBrain.locName(secretLoc)}! Bisa pindah ke sana kapanpun.`);
          }
        },
        {
          id: 'niko_manipulate',
          text: (target) => `Manipulasi informasi — sebarkan ketidakpercayaan`,
          category: 'social',
          hint: 'Sebarkan informasi setengah benar. NPC saling curiga.',
          condition: (gs, nearby) => nearby.length >= 2,
          risk: 40, reward: 75,
          effect: (s, pc) => {
            const loc = s.playerLocation || 'aula_utama';
            const nearby = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && s.npcMinds[n].location === loc && !s.killers.includes(n));
            if (nearby.length >= 2) {
              const a = nearby[0], b = nearby[1];
              const tk = CharBrain.trustKeyFor ? CharBrain.trustKeyFor(a, b) : [a,b].sort().join('_');
              if (s.trust[tk] !== undefined) s.trust[tk] = Math.max(0, s.trust[tk] - 10);
              Engine.notify(`Kau menanam benih ketidakpercayaan antara ${CharBrain.charName(a)} dan ${CharBrain.charName(b)}. Trust mereka -10%.`);
            }
          }
        }
      ]
    },
    juno: {
      investigate: (loc) => `Geledah ${CharBrain.locName(loc)} — langsung, tanpa basa-basi`,
      observe: (target) => `Perhatikan ${CharBrain.charName(target)} — insting jalanan menyala`,
      talk: (target) => `Konfrontasi langsung ${CharBrain.charName(target)} — "Jangan main-main denganku."`,
      accuse: (target) => `"AKU TAHU KAU PEMBUNUHNYA!" Juno menunjuk ${CharBrain.charName(target)}.`,
      hide: (loc) => `Barricade di ${CharBrain.locName(loc)} — pertahanan rebel-style`,
      ally: (target) => `Ajak ${CharBrain.charName(target)} bertarung bersama — "Kita lawan mereka!"`,
      escape_clue: (loc) => `Terobos setiap sudut ${CharBrain.locName(loc)} — cari petunjuk pelarian`,
      unique: [
        {
          id: 'juno_barricade',
          text: (loc) => `Barricade ${CharBrain.locName(loc)} — "TIDAK ADA yang masuk!"`,
          category: 'protect',
          hint: 'Defense +20%, flee +15%. Blokir pintu masuk.',
          condition: (gs) => (gs.dangerLevel || 0) >= 25,
          risk: 20, reward: 70,
          effect: (s, pc) => {
            s.dangerLevel = Math.max(0, s.dangerLevel - 12);
            Engine.notify('Kau memblokir semua pintu masuk. Bahaya turun -12%. Area ini aman sementara.');
          }
        },
        {
          id: 'juno_protect_sera',
          text: () => `Lindungi Sera — "Siapapun yang menyentuhnya harus melewatiku dulu!"`,
          category: 'protect',
          hint: 'Juno melindungi Sera dengan loyalitas absolut.',
          condition: (gs, nearby) => nearby.includes('sera') && (gs.dangerLevel || 0) >= 30,
          risk: 35, reward: 75,
          effect: (s, pc) => {
            Engine.modTrust(pc, 'sera', 10);
            Engine.modDanger(-10);
            Engine.notify('Kau berdiri di depan Sera. Trust +10%. Bahaya turun.');
          }
        }
      ]
    },
    vira: {
      investigate: (loc) => `Periksa ${CharBrain.locName(loc)} — ingatan dari kunjungan lalu menyala`,
      observe: (target) => `Amati ${CharBrain.charName(target)} — ada sesuatu yang familiar...`,
      talk: (target) => `Bicara dengan ${CharBrain.charName(target)} — cari tahu apa yang berubah`,
      accuse: (target) => `"Kau... aku pernah melihatmu melakukan ini." Vira menuduh ${CharBrain.charName(target)}.`,
      hide: (loc) => `Sembunyi di ${CharBrain.locName(loc)} — tempat yang sudah dikenal`,
      ally: (target) => `Minta perlindungan ${CharBrain.charName(target)} — "Aku tidak bisa sendirian lagi"`,
      escape_clue: (loc) => `Ingat sesuatu tentang ${CharBrain.locName(loc)} — petunjuk dari masa lalu`,
      unique: [
        {
          id: 'vira_memory_flash',
          text: (loc) => `Flashback — ingatan tentang ${CharBrain.locName(loc)} dari 6 bulan lalu`,
          category: 'investigate',
          hint: 'Vira pernah ke sini sebelumnya. Mulai dengan 2 lokasi clue diketahui.',
          condition: (gs) => gs.chapter >= 1,
          risk: 5, reward: 75,
          effect: (s, pc) => {
            const loc = s.playerLocation || 'aula_utama';
            const escClue = getEscapeClueAtLocation(loc);
            if (escClue && Math.random() < 0.5) {
              findEscapeClue(escClue.id);
              s.cluesFound = (s.cluesFound || 0) + 1;
              Engine.notify(`Ingatan menyala! Kau ingat petunjuk pelarian di sini: ${escClue.name}!`);
            } else {
              Engine.notify('Ingatan samar... ada sesuatu tapi belum jelas. Coba di lokasi lain.');
            }
          }
        },
        {
          id: 'vira_niko_confront',
          text: () => `Konfrontasi Niko — "Kau yang membuatku seperti ini."`,
          category: 'confront',
          hint: 'Konfrontasi emosional dengan mantan. Trust bisa naik atau turun drastis.',
          condition: (gs, nearby) => nearby.includes('niko'),
          risk: 50, reward: 80,
          effect: (s, pc) => {
            if (Math.random() < 0.6) {
              Engine.modTrust(pc, 'niko', 15);
              Engine.notify('Niko akhirnya jujur. Trust +15%. Topengnya retak.');
            } else {
              Engine.modTrust(pc, 'niko', -10);
              Engine.notify('Niko menutup diri lagi. Trust -10%. Dinding emosional.');
            }
          }
        }
      ]
    },
    reza: {
      investigate: (loc) => `Periksa TKP ${CharBrain.locName(loc)} — prosedur detektif standar`,
      observe: (target) => `Profil kriminal ${CharBrain.charName(target)} — insting detektif`,
      talk: (target) => `Interogasi ${CharBrain.charName(target)} — pertanyaan terstruktur`,
      accuse: (target) => `"Berdasarkan bukti yang ada..." Reza secara resmi menuduh ${CharBrain.charName(target)}.`,
      hide: (loc) => `Posisi defensif di ${CharBrain.locName(loc)} — siap menghadapi ancaman`,
      ally: (target) => `Bentuk tim investigasi dengan ${CharBrain.charName(target)}`,
      escape_clue: (loc) => `Periksa ${CharBrain.locName(loc)} secara forensik — cari petunjuk pelarian`,
      unique: [
        {
          id: 'reza_forensic',
          text: (loc) => `Analisis forensik ${CharBrain.locName(loc)} — prosedur profesional`,
          category: 'investigate',
          hint: 'Detektif: +15% akurasi tuduhan, +10% deteksi. Analisis profesional.',
          condition: (gs) => gs.deathCount >= 1,
          risk: 15, reward: 85,
          effect: (s, pc) => {
            const nearbyKillers = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && s.killers.includes(n) && s.npcMinds[n].location === (s.playerLocation || 'aula_utama'));
            nearbyKillers.forEach(k => Engine.modSuspicion(k, 15));
            if (nearbyKillers.length > 0) {
              Engine.notify(`Forensik menemukan bukti kuat! Suspicion killer +15%!`);
            } else {
              Engine.notify('Analisis forensik selesai. Tidak ada bukti killer di sini — area ini aman.');
            }
          }
        },
        {
          id: 'reza_interrogate',
          text: (target) => `Interogasi intensif — teknik detektif profesional`,
          category: 'confront',
          hint: 'Pertanyaan terstruktur meningkatkan akurasi deteksi.',
          condition: (gs, nearby) => nearby.length > 0 && gs.deathCount >= 1,
          risk: 30, reward: 80,
          effect: (s, pc) => {
            const loc = s.playerLocation || 'aula_utama';
            const nearby = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && s.npcMinds[n].location === loc);
            const target = nearby.find(n => (s.suspicion[n] || 0) > 20) || nearby[0];
            if (target) {
              const isK = s.killers.includes(target);
              if (isK && Math.random() < 0.5) {
                Engine.modSuspicion(target, 12);
                Engine.notify(`Interogasi ${CharBrain.charName(target)}: jawaban tidak konsisten! Suspicion +12%.`);
              } else {
                Engine.notify(`Interogasi ${CharBrain.charName(target)}: ceritanya konsisten. Belum ada bukti.`);
              }
            }
          }
        }
      ]
    },
    kira: {
      investigate: (loc) => `Scan digital ${CharBrain.locName(loc)} — cari sinyal dan data tersembunyi`,
      observe: (target) => `Monitor aktivitas digital ${CharBrain.charName(target)}`,
      talk: (target) => `Chat dengan ${CharBrain.charName(target)} — gaya hacker, to-the-point`,
      accuse: (target) => `"Data tidak berbohong." Kai menunjukkan bukti digital ke ${CharBrain.charName(target)}.`,
      hide: (loc) => `Stealth mode di ${CharBrain.locName(loc)} — off the grid`,
      ally: (target) => `Share akses dengan ${CharBrain.charName(target)} — "Aku bisa hack, kau yang tangani fisik"`,
      escape_clue: (loc) => `Hack sistem keamanan di ${CharBrain.locName(loc)} — cari data pelarian`,
      unique: [
        {
          id: 'kira_hack_cctv',
          text: (loc) => `Hack CCTV mansion — lihat siapa di mana`,
          category: 'hack',
          hint: '+25% investigasi digital. Lihat lokasi semua NPC.',
          condition: (gs) => gs.chapter >= 1,
          risk: 15, reward: 90,
          effect: (s, pc) => {
            const result = rollChance(55 + getCharAbility(pc, 'investigation'), pc, 'intel');
            if (result.success) {
              let report = 'CCTV: ';
              Object.keys(s.npcMinds || {}).forEach(n => {
                if (s.alive[n] && s.npcMinds[n]) {
                  report += `${CharBrain.charName(n)}: ${CharBrain.locName(s.npcMinds[n].location)} | `;
                }
              });
              Engine.notify(report + `(${result.chance}%, roll: ${result.roll})`);
            } else {
              Engine.notify(`Sistem keamanan terlalu kuat. Gagal hack. (${result.chance}%, roll: ${result.roll})`);
            }
          }
        },
        {
          id: 'kira_digital_trace',
          text: () => `Lacak jejak digital — siapa yang menggunakan sistem mansion`,
          category: 'investigate',
          hint: 'Temukan siapa yang mengakses panel kontrol mansion.',
          condition: (gs) => gs.deathCount >= 1,
          risk: 15, reward: 75,
          effect: (s, pc) => {
            const killers = Object.keys(s.npcMinds || {}).filter(n => s.alive[n] && s.killers.includes(n));
            if (killers.length > 0 && Math.random() < 0.45) {
              const k = killers[Math.floor(Math.random() * killers.length)];
              Engine.modSuspicion(k, 10);
              Engine.notify(`Jejak digital menunjukkan ${CharBrain.charName(k)} mengakses panel kontrol! Suspicion +10%.`);
            } else {
              Engine.notify('Tidak ada jejak digital yang mencurigakan kali ini.');
            }
          }
        }
      ]
    },
    farah: {
      investigate: (loc) => `Periksa ${CharBrain.locName(loc)} — cari sesuatu yang bisa dinegosiasikan`,
      observe: (target) => `Nilai ${CharBrain.charName(target)} — apakah bisa dipercaya untuk deal?`,
      talk: (target) => `Negosiasi dengan ${CharBrain.charName(target)} — tawarkan deal`,
      accuse: (target) => `"Uangku bisa membeli kebenaran." Farah menuduh ${CharBrain.charName(target)}.`,
      hide: (loc) => `Berlindung di ${CharBrain.locName(loc)} — uang tidak bisa membeli keselamatan di sini`,
      ally: (target) => `Beli loyalitas ${CharBrain.charName(target)} — "Aku bisa menjamin keselamatanmu"`,
      escape_clue: (loc) => `Cari petunjuk pelarian di ${CharBrain.locName(loc)} — gunakan koneksi Wardhana`,
      unique: [
        {
          id: 'farah_broker_deal',
          text: () => `Broker deal — tukar informasi untuk perlindungan`,
          category: 'negotiate',
          hint: '+15% trust gain, +10% aliansi. Negosiasi keselamatan.',
          condition: (gs, nearby) => nearby.length > 0,
          risk: 20, reward: 75,
          effect: (s, pc) => {
            const loc = s.playerLocation || 'aula_utama';
            const nearby = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && !s.killers.includes(n) && s.npcMinds[n] && s.npcMinds[n].location === loc);
            if (nearby.length > 0) {
              const target = nearby[0];
              const trustGain = 10 + getCharAbility(pc, 'trust');
              Engine.modTrust(pc, target, trustGain);
              Engine.notify(`Deal berhasil dengan ${CharBrain.charName(target)}! Trust +${trustGain}%.`);
            }
          }
        },
        {
          id: 'farah_wardhana_info',
          text: () => `Gunakan pengetahuan keluarga Wardhana — "Aku tahu sejarah mansion ini"`,
          category: 'investigate',
          hint: 'Informasi pewaris tentang sejarah mansion.',
          condition: (gs) => gs.chapter >= 1,
          risk: 10, reward: 65,
          effect: (s, pc) => {
            if (Math.random() < 0.4) {
              s.cluesFound = (s.cluesFound || 0) + 1;
              Engine.notify('Pengetahuan keluarga mengungkap rahasia mansion — petunjuk baru ditemukan!');
            } else {
              Engine.notify('Kau mengingat sejarah keluarga, tapi belum menemukan petunjuk baru.');
            }
          }
        }
      ]
    },
    // Killer-specific action flavors
    lana: {
      investigate: (loc) => `Pura-pura investigasi di ${CharBrain.locName(loc)} — aktris sempurna`,
      observe: (target) => `Pelajari ${CharBrain.charName(target)} — cari kelemahan untuk dieksploitasi`,
      talk: (target) => `Manipulasi ${CharBrain.charName(target)} lewat percakapan manis`,
      accuse: (target) => `"Ya Tuhan, aku pikir ini..." Lana menuduh ${CharBrain.charName(target)} dengan akting sempurna`,
      hide: (loc) => `Bersembunyi di ${CharBrain.locName(loc)} — novelis yang tahu kapan harus diam`,
      ally: (target) => `Dekati ${CharBrain.charName(target)} — "Aku takut... bisakah kita bersama?"`,
      escape_clue: (loc) => `Cari — lalu hancurkan — petunjuk pelarian di ${CharBrain.locName(loc)}`,
      strike: (target) => `Eksekusi ${CharBrain.charName(target)} — presisi novelis yang menulis akhir ceritanya sendiri`,
      frame: (target) => `"Ya Tuhan, lihat ini!" Arahkan bukti palsu ke ${CharBrain.charName(target)}`,
      unique: [
        {
          id: 'lana_seductive_manipulation',
          text: () => `Manipulasi seduktif — "Aku percaya padamu... tidak seperti yang lain"`,
          category: 'stealth',
          hint: 'Framing +20%, suspicion turun -15%. Pesona mematikan.',
          condition: (gs, nearby) => nearby.length > 0,
          risk: 35, reward: 85,
          effect: (s, pc) => {
            const loc = s.playerLocation || 'aula_utama';
            const nearby = Object.keys(s.npcMinds || {}).filter(n =>
              s.alive[n] && !s.killers.includes(n) && s.npcMinds[n] && s.npcMinds[n].location === loc);
            if (nearby.length > 0) {
              const target = nearby[0];
              Engine.modSuspicion(pc, -12);
              Engine.modTrust(pc, target, 8);
              Engine.notify(`Pesona Lana bekerja. ${CharBrain.charName(target)} semakin percaya. Suspicion -12%.`);
            }
          }
        },
        {
          id: 'lana_fake_cry',
          text: () => `Tangisan palsu — "Aku takut... seseorang tolong aku!"`,
          category: 'stealth',
          hint: 'Akting Oscar-worthy. Semua NPC di sekitar percaya.',
          condition: (gs) => (gs.deathCount || 0) >= 1,
          risk: 25, reward: 70,
          effect: (s, pc) => {
            Engine.modSuspicion(pc, -15);
            Engine.notify('Akting sempurna! Semua orang iba. Suspicion -15%.');
          }
        }
      ]
    },
    dimas: {
      investigate: (loc) => `Periksa ${CharBrain.locName(loc)} — diam-diam, tanpa meninggalkan jejak`,
      observe: (target) => `Pantau ${CharBrain.charName(target)} dari kejauhan — siap bertindak`,
      talk: (target) => `Bicara sopan dengan ${CharBrain.charName(target)} — topeng kesopanan sempurna`,
      accuse: (target) => `"Menurutku dia..." Dimas mengarahkan perhatian ke ${CharBrain.charName(target)}`,
      hide: (loc) => `Menghilang di ${CharBrain.locName(loc)} — seperti bayangan`,
      ally: (target) => `Dekati ${CharBrain.charName(target)} — "Aku bisa menjaga kita berdua"`,
      escape_clue: (loc) => `Cari — lalu sabotase — petunjuk pelarian di ${CharBrain.locName(loc)}`,
      strike: (target) => `Eliminasi diam-diam — ${CharBrain.charName(target)} tidak akan sempat berteriak`,
      frame: (target) => `Tanam bukti secara teknis ke ${CharBrain.charName(target)} — operasi bersih`,
      unique: [
        {
          id: 'dimas_silent_approach',
          text: () => `Pendekatan senyap — posisikan diri di dekat target tanpa terdeteksi`,
          category: 'stealth',
          hint: 'Silent kill: +15% eliminasi, tanpa bukti tertinggal.',
          condition: (gs, nearby) => nearby.length > 0,
          risk: 30, reward: 80,
          effect: (s, pc) => {
            Engine.modSuspicion(pc, -8);
            Engine.notify('Kau bergerak tanpa suara. Posisi sempurna. Suspicion -8%.');
          }
        },
        {
          id: 'dimas_infrastructure_sabotage',
          text: (loc) => `Sabotase infrastruktur ${CharBrain.locName(loc)} — matikan lampu/kunci pintu`,
          category: 'stealth',
          hint: 'Sabotase teknis untuk memisahkan kelompok.',
          condition: (gs, nearby) => nearby.length >= 2,
          risk: 35, reward: 75,
          effect: (s, pc) => {
            s.dangerLevel = Math.min(100, (s.dangerLevel || 0) + 8);
            Engine.notify('Infrastruktur disabotase. Lampu mati. Kelompok akan terpecah.');
          }
        }
      ]
    }
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
    return CHAR_DISPLAY[playerChar()] || 'Arya';
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

  // Fixed killer assignments per difficulty (Lana = Sang Penenun, always killer)
  // Easy: Lana only | Normal: Lana + Dimas | Hard: Lana + Dimas + Niko
  const KILLER_BY_DIFF = { 1: ['lana'], 2: ['lana', 'dimas'], 3: ['lana', 'dimas', 'niko'] };
  const KILLER_POOL = ['lana', 'dimas', 'niko'];

  // Get killers for this difficulty (fixed, not random)
  function getKillers(difficulty) {
    return (KILLER_BY_DIFF[difficulty] || KILLER_BY_DIFF[2]).slice();
  }

  function defaultState(difficulty, playerCharacter, playerIsKiller) {
    const diff = difficulty || 2;
    const pc = playerCharacter || 'arin';
    const killers = getKillers(diff);
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
        reza: 65, lana: 45, dimas: 35, kira: 40, farah: 35
      },
      awareness: { arin: 10, niko: 15, sera: 25, juno: 10, vira: 5 },
      trust: {
        arin_niko: 60, arin_sera: 70, arin_juno: 65, arin_vira: 45,
        arin_reza: 40, arin_lana: 35, arin_dimas: 30, arin_kira: 50, arin_farah: 40,
        niko_sera: 40, niko_juno: 45, niko_vira: 55,
        niko_reza: 50, niko_lana: 35, niko_dimas: 40, niko_kira: 30, niko_farah: 60,
        sera_juno: 70, sera_vira: 35,
        sera_reza: 45, sera_lana: 40, sera_dimas: 45, sera_kira: 50, sera_farah: 45,
        juno_vira: 30, juno_reza: 40, juno_lana: 30, juno_dimas: 25, juno_kira: 55, juno_farah: 30,
        vira_reza: 30, vira_lana: 50, vira_dimas: 35, vira_kira: 40, vira_farah: 30,
        reza_lana: 25, reza_dimas: 20, reza_kira: 45, reza_farah: 30,
        lana_dimas: 60, lana_kira: 30, lana_farah: 25,
        dimas_kira: 25, dimas_farah: 35,
        kira_farah: 30
      },
      flags: {},
      items: [],
      killers: killers.slice(),
      killerRevealed: [],
      dangerLevel: 10,
      moralScore: 0,
      keyChoices: [],
      deathCount: 0,
      cluesFound: 0,
      // Escape Clue System: survivors find clues to escape mansion
      escapeClues: [],           // Array of found escape clue IDs
      destroyedClues: [],        // Array of destroyed escape clue IDs (by killers)
      totalEscapeClues: 8,             // 8 total clues in 8-room mansion
      cluesNeededToWin: 5,             // Protagonist wins if 5 found before killers destroy them
      masterKeyFound: false,           // Kunci Room Master — 5% chance, instant escape win
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

  // ---- Difficulty multipliers ----
  // Positive effects (trust gain, danger reduction) scale UP on Easy
  // Negative effects (trust loss, danger increase) scale DOWN on Easy
  function diffMultPositive() {
    if (!state.difficulty) return 1;
    return [1.4, 1, 0.7][state.difficulty - 1] || 1;
  }
  function diffMultNegative() {
    if (!state.difficulty) return 1;
    return [0.6, 1, 1.4][state.difficulty - 1] || 1;
  }
  function diffMult() {
    if (!state.difficulty) return 1;
    return [0.8, 1, 1.2][state.difficulty - 1] || 1;
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
    const mult = delta > 0 ? diffMultPositive() : diffMultNegative();
    const adjusted = Math.round(delta * mult);
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
    const mult = delta > 0 ? diffMultNegative() : diffMultPositive();
    const adjusted = Math.round(delta * mult);
    state.dangerLevel = Math.max(0, Math.min(100, state.dangerLevel + adjusted));
  }

  // ---- Suspicion system ----
  function modSuspicion(char, delta) {
    let adjustedDelta = delta;
    const current = state.suspicion[char] || 0;

    if (delta > 0) {
      // Stealth ability: gains less suspicion when caught (Lana)
      if (char === playerChar()) {
        const stealthBonus = getCharAbility(char, 'stealthBonus');
        if (stealthBonus > 0) {
          adjustedDelta = Math.max(1, Math.round(delta * (1 - stealthBonus / 100)));
        }
      }
      // Diminishing returns: harder to push suspicion higher when already high
      if (current > 60) {
        const diminish = 1 - ((current - 60) / 200); // 60%→1.0, 80%→0.9, 100%→0.8
        adjustedDelta = Math.max(1, Math.round(adjustedDelta * diminish));
      }
      // Chapter scaling: early chapters = smaller suspicion gains (slower build-up)
      const chapter = state.chapter || 0;
      if (chapter <= 1) {
        adjustedDelta = Math.max(1, Math.round(adjustedDelta * 0.7));
      } else if (chapter === 2) {
        adjustedDelta = Math.max(1, Math.round(adjustedDelta * 0.85));
      }
    } else if (delta < 0) {
      // Suspicion reduction: slightly more effective at high levels (easier to calm down paranoia)
      if (current > 70) {
        adjustedDelta = Math.round(adjustedDelta * 1.2);
      }
    }
    state.suspicion[char] = Math.max(0, Math.min(100, current + adjustedDelta));
  }

  // Natural suspicion decay — called each round to prevent infinite stacking
  function decaySuspicion() {
    if (!state.suspicion) return;
    const witnessedKillers = [...(state.killerRevealed || []), ...(state.witnessedKillers || [])];
    Object.keys(state.suspicion).forEach(char => {
      if (!state.alive[char]) return;
      const susp = state.suspicion[char] || 0;
      if (susp <= 0) return;
      // Witnessed/revealed killers don't decay — proof is permanent
      if (witnessedKillers.includes(char)) return;
      // Decay: 2-3 points per round (slow but prevents permanent stacking)
      const decay = susp > 50 ? 3 : 2;
      state.suspicion[char] = Math.max(0, susp - decay);
    });
  }

  // ---- Pemburu Execution Mechanic ----
  // Pemburu is assigned when the first escape clue is found (random survivor).
  // Each round, if any character has suspicion >80%, the Pemburu executes them.
  // After executing, the Pemburu's identity is revealed to all survivors.
  function checkPemburuExecution() {
    const events = [];
    if (!state.pemburu || !state.alive[state.pemburu]) return events;
    if (!state.suspicion || !state.npcMinds) return events;

    const pemburu = state.pemburu;
    const charName = typeof CharBrain !== 'undefined' ? CharBrain.charName : (n) => n;

    // Threshold scales with difficulty: Easy 85%, Normal 80%, Hard 75%
    const diff = state.difficulty || 2;
    const pemburuThreshold = diff === 1 ? 85 : diff === 3 ? 75 : 80;

    let highestTarget = null;
    let highestSusp = pemburuThreshold;
    CHARACTERS.forEach(target => {
      if (!state.alive[target]) return;
      if (target === pemburu) return; // Pemburu can't execute themselves
      const susp = state.suspicion[target] || 0;
      if (susp > highestSusp) {
        // Already revealed killers are handled by HUNT mechanic
        if ((state.killerRevealed || []).includes(target)) return;
        if ((state.witnessedKillers || []).includes(target)) return;
        highestSusp = susp;
        highestTarget = target;
      }
    });

    if (!highestTarget) return events;

    const target = highestTarget;
    const susp = state.suspicion[target] || 0;
    const isTargetKiller = (state.killers || []).includes(target);

    // Execute the target
    state.alive[target] = false;
    state.deathCount++;

    if (isTargetKiller) {
      if (!state.killersDead) state.killersDead = [];
      if (!state.killersDead.includes(target)) state.killersDead.push(target);
      if (!state.killerRevealed) state.killerRevealed = [];
      if (!state.killerRevealed.includes(target)) state.killerRevealed.push(target);
    }

    // Pemburu revealed only on first execution — before that, identity is hidden
    const firstReveal = !state.pemburuRevealed;
    if (firstReveal) {
      state.pemburuRevealed = true;
      // All survivors learn pemburu identity on first execution
      if (state.npcMinds) {
        Object.values(state.npcMinds).forEach(mind => {
          if (state.alive[mind.name] && mind.name !== pemburu) {
            mind.memory.push({
              type: 'pemburu_revealed',
              pemburu: pemburu,
              target: target,
              round: state.roundCount || 0
            });
          }
        });
      }
    }

    const correctShot = isTargetKiller
      ? `Tembakan tepat! ${charName(target)} ternyata memang seorang KILLER!`
      : `SALAH SASARAN! ${charName(target)} ternyata bukan killer — seorang survivor tidak bersalah tewas!`;

    const revealMsg = firstReveal
      ? ` Identitas ${charName(pemburu)} sebagai Pemburu kini terungkap kepada semua survivor!`
      : '';

    events.push({
      type: 'pemburu_execution',
      pemburu: pemburu,
      target: target,
      wasKiller: isTargetKiller,
      firstReveal: firstReveal,
      desc: `🔫 EKSEKUSI PEMBURU! Kecurigaan terhadap ${charName(target)} mencapai ${susp}% — ${charName(pemburu)} menembak ${charName(target)}! ${correctShot}${revealMsg}`
    });

    notify(`🔫 ${charName(pemburu)} mengeksekusi ${charName(target)} (suspicion ${susp}%)! ${correctShot}${revealMsg}`);

    return events;
  }

  // ---- Is this character a killer? ----
  function isKiller(name) {
    return state.killers && state.killers.includes(name);
  }

  // ---- Escape Clue Locations ----
  // ---- Escape Clue Locations (8 rooms, 8 clues, need 5 to win) ----
  const ESCAPE_CLUE_LOCATIONS = {
    aula_utama:    { id: 'esc_dokumen_aula',   name: 'Dokumen Evakuasi',        desc: 'Dokumen prosedur evakuasi darurat mansion yang sudah lama dilupakan.' },
    perpustakaan:  { id: 'esc_peta_mansion',   name: 'Peta Rahasia Mansion',    desc: 'Peta tua yang menunjukkan jalur rahasia keluar mansion.' },
    dapur:         { id: 'esc_pintu_dapur',    name: 'Pintu Belakang Dapur',    desc: 'Kunci cadangan pintu belakang dapur yang mengarah ke halaman.' },
    basement:      { id: 'esc_kode_pintu',     name: 'Kode Pintu Darurat',      desc: 'Serangkaian angka yang tertulis di dinding — kode untuk pintu darurat.' },
    menara:        { id: 'esc_sinyal',         name: 'Frekuensi Radio Darurat', desc: 'Frekuensi radio yang bisa memanggil bantuan dari luar.' },
    taman_dalam:   { id: 'esc_pagar_taman',    name: 'Celah Pagar Taman',       desc: 'Celah di pagar taman yang cukup besar untuk lewat.' },
    galeri_timur:  { id: 'esc_panel_galeri',   name: 'Panel Rahasia Galeri',    desc: 'Panel dinding tersembunyi yang membuka lorong ke luar.' },
    bunker_b3:     { id: 'esc_blueprint',      name: 'Blueprint Terowongan',    desc: 'Cetak biru terowongan bawah tanah yang mengarah ke luar.' }
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
    if (state.difficulty === 1 && state.deathCount >= 2 && state.chapter < 2) return false;
    if (state.difficulty === 2 && state.deathCount >= 4 && state.chapter < 2) return false;
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
    const wasEmpty = state.escapeClues.length === 0;
    if (!state.escapeClues.includes(clueId)) {
      state.escapeClues.push(clueId);
    }
    // First clue found → assign a random survivor as Pemburu
    if (wasEmpty && state.escapeClues.length === 1 && !state.pemburu) {
      assignPemburu();
    }
    // Force all NPCs at this location to relocate (clue sudah diambil, tidak ada alasan tinggal)
    forceNpcRelocateFromLocation(state.playerLocation || 'aula_utama');
    // Realtime UI update
    updatePlayerStatus(state);
  }

  // Assign a random survivor as Pemburu when first clue is discovered
  function assignPemburu() {
    const aliveSurvivors = CHARACTERS.filter(c =>
      state.alive[c] && !(state.killers || []).includes(c)
    );
    if (aliveSurvivors.length < 2) return;
    const pemburu = aliveSurvivors[Math.floor(Math.random() * aliveSurvivors.length)];
    state.pemburu = pemburu;
    state.pemburuRevealed = false;
    notify(`Petunjuk pertama ditemukan! Seorang survivor diam-diam mengambil peran sebagai Pemburu... Identitasnya masih tersembunyi.`);
  }
  function destroyEscapeClue(clueId) {
    if (!state.destroyedClues) state.destroyedClues = [];
    if (!state.destroyedClues.includes(clueId)) {
      state.destroyedClues.push(clueId);
    }
    // Force all NPCs at this location to relocate (clue hancur, pindah cari yang lain)
    forceNpcRelocateFromLocation(state.playerLocation || 'aula_utama');
    // Realtime UI update
    updatePlayerStatus(state);
  }
  function canEscape() {
    if (state.masterKeyFound) return true;
    const needed = state.cluesNeededToWin || 5;
    return (state.escapeClues || []).length >= needed;
  }
  // ---- Kunci Room Master (5% chance muncul di lokasi acak) ----
  // Jika ditemukan, langsung selesai misi petunjuk pelarian
  function rollMasterKey() {
    if (state.masterKeyFound) return false;
    // Easy 6%, Normal 4%, Hard 3%
    const diff = state.difficulty || 2;
    const masterKeyChance = diff === 1 ? 0.06 : diff === 3 ? 0.03 : 0.04;
    if (Math.random() < masterKeyChance) {
      state.masterKeyFound = true;
      return true;
    }
    return false;
  }
  function triggerMansionEscape() {
    // 5+ clues found OR master key → all killers revealed and executed
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
  // Preview what rollChance will compute (for UI display)
  function previewChance(baseChance, charName, bonusType) {
    const toolBonus = getToolBonus(charName, bonusType);
    let diffBonus = 0;
    const isKiller = state.killers && state.killers.includes(charName);
    if (!isKiller && (bonusType === 'intel' || bonusType === 'defense')) {
      const diff = state.difficulty || 2;
      diffBonus = diff === 1 ? 15 : diff === 2 ? 10 : 5;
    } else if (isKiller && bonusType === 'offense') {
      const diff = state.difficulty || 2;
      diffBonus = diff === 1 ? -15 : diff === 2 ? -10 : -5;
    }
    let abilityBonus = 0;
    if (charName === playerChar()) {
      if (bonusType === 'intel') abilityBonus += getCharAbility(charName, 'clueSearch') + getCharAbility(charName, 'investigation');
      if (bonusType === 'defense') abilityBonus += getCharAbility(charName, 'defense');
      if (bonusType === 'offense') abilityBonus += getCharAbility(charName, 'offense');
    }
    return Math.min(95, Math.max(5, baseChance + toolBonus + diffBonus + abilityBonus));
  }

  function rollChance(baseChance, charName, bonusType) {
    const totalChance = previewChance(baseChance, charName, bonusType);
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
    const escTotal = state.totalEscapeClues || 8;
    const escDestroyed = (state.destroyedClues || []).length;
    const killersAlive = (state.killers || []).filter(k => state.alive[k]).length;
    const totalKillers = (state.killers || []).length;
    const witnessedCount = (state.witnessedKillers || []).filter(k => state.alive[k]).length;
    const cluesNeeded = state.cluesNeededToWin || 5;
    if (!isK) {
      const masterKeyStatus = state.masterKeyFound ? ' | 🔑 Kunci Master!' : '';
      html += `<div class="ps-escape">Petunjuk: ${escFound}/${cluesNeeded} (${escTotal} total) | Killer: ${totalKillers - killersAlive}/${totalKillers}${masterKeyStatus}`;
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

    // Team roster — show killers & survivors in sidebar
    if (state.killers && state.killers.length > 0) {
      const cn = (n) => typeof CharBrain !== 'undefined' ? CharBrain.charName(n) : n;
      const allChars = CHARACTERS || [];

      if (isPlayerKiller()) {
        // Player is killer: show full team roster
        const killerNames = state.killers.map(k => {
          const alive = state.alive[k];
          return `<span class="${alive ? 'team-alive' : 'team-dead'}">${cn(k)}${alive ? '' : ' ✝'}</span>`;
        });
        const survivorNames = allChars.filter(c => !state.killers.includes(c)).map(c => {
          const alive = state.alive[c];
          return `<span class="${alive ? 'team-alive' : 'team-dead'}">${cn(c)}${alive ? '' : ' ✝'}</span>`;
        });
        html += `<div class="ps-team">`;
        html += `<div class="ps-team-row"><span class="team-label">🔪 Killer:</span> ${killerNames.join(', ')}</div>`;
        html += `<div class="ps-team-row"><span class="team-label">🛡️ Survivor:</span> ${survivorNames.join(', ')}</div>`;
        html += `</div>`;
      } else {
        // Player is survivor: hide killer identities, only show revealed killers
        const revealed = state.killerRevealed || [];
        const revealedKillerNames = revealed.filter(k => state.killers.includes(k)).map(k => {
          const alive = state.alive[k];
          return `<span class="${alive ? 'team-alive' : 'team-dead'}">${cn(k)}${alive ? '' : ' ✝'}</span>`;
        });
        const charNames = allChars.map(c => {
          const alive = state.alive[c];
          return `<span class="${alive ? 'team-alive' : 'team-dead'}">${cn(c)}${alive ? '' : ' ✝'}</span>`;
        });
        html += `<div class="ps-team">`;
        if (revealedKillerNames.length > 0) {
          html += `<div class="ps-team-row"><span class="team-label">🔪 Killer Terungkap:</span> ${revealedKillerNames.join(', ')}</div>`;
        }
        html += `<div class="ps-team-row"><span class="team-label">👥 Karakter:</span> ${charNames.join(', ')}</div>`;
        html += `</div>`;
      }
    }

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
        if (item.isKiller && isPlayerKiller()) bubbleClass += ' chat-bubble-killer';
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

  // ---- Force NPC Relocation ----
  // When clue found/destroyed at a location, all NPCs there must move elsewhere
  function forceNpcRelocateFromLocation(loc) {
    if (!state.npcMinds || typeof CharBrain === 'undefined') return;
    const pc = state.playerCharacter || 'arin';
    Object.keys(state.npcMinds).forEach(name => {
      if (name === pc || !state.alive[name]) return;
      const mind = state.npcMinds[name];
      if (mind.location === loc) {
        const newLoc = CharBrain.pickNewLocation(mind);
        if (newLoc && newLoc !== loc) {
          mind.location = newLoc;
        }
      }
    });
  }

  // ---- Round-Based Escalation ----
  // Force game progression when too many rounds pass without advancement
  const ESCALATION_THRESHOLDS = {
    chapterAdvanceRounds: 6,  // After 6 rounds in same chapter → force advance
    maxTotalRounds: 25,       // Hard cap: game ends at 25 rounds — no infinite games
    tensionBoostPerRound: 4,  // Tension increase per round for all NPCs (was 3)
    forceStoryRound: 4        // Every 4 rounds, force a story node advancement
  };

  function checkEscalation() {
    if (!state.npcMinds) return;
    const round = state.roundCount || 0;
    const chapter = state.chapter || 0;
    if (!state.chapterStartRound) state.chapterStartRound = {};
    if (state.chapterStartRound[chapter] === undefined) {
      state.chapterStartRound[chapter] = round;
    }
    const roundsInChapter = round - state.chapterStartRound[chapter];

    // Escalate all NPC tension every round to prevent passive camping
    Object.values(state.npcMinds).forEach(mind => {
      if (state.alive[mind.name]) {
        mind.tension = Math.min(100, mind.tension + ESCALATION_THRESHOLDS.tensionBoostPerRound);
      }
    });

    // Force chapter advance if stuck too long
    if (roundsInChapter >= ESCALATION_THRESHOLDS.chapterAdvanceRounds && chapter < 5) {
      forceChapterAdvance();
    }

    // Hard cap: end game at max rounds
    if (round >= ESCALATION_THRESHOLDS.maxTotalRounds && !state.winLossResult) {
      state.winLossResult = {
        ended: true,
        type: 'partial_win',
        reason: 'dawn_reached',
        title: 'Fajar Tiba',
        desc: 'Malam terlalu panjang. Fajar akhirnya menyingsing — permainan berakhir dengan kondisi saat ini.'
      };
    }

    // Boost danger level progressively
    state.dangerLevel = Math.min(100, (state.dangerLevel || 0) + 2);
  }

  function forceChapterAdvance() {
    const current = state.chapter || 0;
    if (current >= 5) return;
    state.chapter = current + 1;
    state.chapterStartRound[state.chapter] = state.roundCount;
    updateChapterIndicator();
    const chTitle = (CHAPTERS[lang] || CHAPTERS.id)[state.chapter];
    if (chTitle) showChapterTitle(chTitle);

    // Boost all NPC emotions on chapter advance
    if (state.npcMinds) {
      Object.values(state.npcMinds).forEach(mind => {
        if (!state.alive[mind.name]) return;
        const isK = (state.killers || []).includes(mind.name);
        if (isK) {
          if (mind.emotion === 'stalking') mind.emotion = 'hunting';
          else if (mind.emotion === 'hunting') mind.emotion = 'executing';
        } else {
          mind.tension = Math.min(100, mind.tension + 15);
        }
      });
    }

    // Force scatter: all NPCs relocate on chapter advance to mix up encounters
    forceNpcScatter();
  }

  // Scatter all NPCs to different locations to create new encounters
  function forceNpcScatter() {
    if (!state.npcMinds || typeof CharBrain === 'undefined') return;
    const pc = state.playerCharacter || 'arin';
    const locations = ['aula_utama', 'perpustakaan', 'dapur', 'basement', 'menara', 'taman_dalam', 'galeri_timur', 'bunker_b3'];
    let locIdx = 0;
    Object.keys(state.npcMinds).forEach(name => {
      if (name === pc || !state.alive[name]) return;
      state.npcMinds[name].location = locations[locIdx % locations.length];
      locIdx++;
    });
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

    // Escalation check: force chapter advance, tension boost, hard cap
    checkEscalation();

    // Staleness boost: increase killer tracking when player camps
    if (locationStaleRounds >= STALE_THRESHOLD) {
      state.staleCampingRounds = (state.staleCampingRounds || 0) + 1;
    } else {
      state.staleCampingRounds = 0;
    }

    const result = CharBrain.executeRound(state);
    if (result && result.events && result.events.length > 0) {
      state.npcActionLog.push({ round: state.roundCount, events: result.events });
    }

    // Staleness warning narrative
    if (locationStaleRounds === STALE_THRESHOLD && result) {
      if (!result.events) result.events = [];
      result.events.push({
        type: 'staleness_warning',
        desc: 'Suara-suara di koridor semakin dekat... terlalu lama di sini tidak aman.'
      });
    }
    if (locationStaleRounds >= STALE_THRESHOLD + 1 && result) {
      if (!result.events) result.events = [];
      result.events.push({
        type: 'staleness_critical',
        desc: 'BAHAYA! Posisimu sudah diketahui — kau HARUS bergerak sekarang!'
      });
    }

    // Natural suspicion decay each round
    decaySuspicion();
    // Pemburu mechanic: auto-execute anyone with suspicion >80%
    const pemburuEvents = checkPemburuExecution();
    if (pemburuEvents.length > 0 && result) {
      if (!result.events) result.events = [];
      pemburuEvents.forEach(ev => result.events.push(ev));
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

    // Select narrative ending based on game conditions
    const selectedEnding = (typeof selectEndingFromState === 'function')
      ? selectEndingFromState(state, result)
      : null;

    if (selectedEnding && selectedEnding.endingData) {
      // Show full narrative ending with game summary appended
      const endingInfo = selectedEnding.endingData;
      const summaryData = buildGameSummary(result);
      showNarrativeEndingWithSummary(endingInfo, summaryData);
    } else {
      // Fallback: show generic game result screen
      const summaryData = buildGameSummary(result);
      showGameResultScreen(summaryData);
    }
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
      winDesc = 'Tim Protagonis menang! 5 petunjuk ditemukan — semua killer terungkap dan dieksekusi!';
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
      totalEscapeClues: state.totalEscapeClues || 8,
      cluesNeeded: state.cluesNeededToWin || 5,
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

  // Show narrative ending (from STORY_ENDINGS) combined with game summary stats
  function showNarrativeEndingWithSummary(endingInfo, summaryData) {
    showScreen('screen-ending');
    const endingNum = endingInfo.endingNumber || 0;
    const endingTitle = endingInfo.title ? t(endingInfo.title) : `Ending #${endingNum}`;
    const rating = endingInfo.rating || 'C';

    $('ending-number').textContent = endingNum ? `#${endingNum}` : '';
    $('ending-title').textContent = endingTitle;
    const ratingEl = $('ending-rating');
    ratingEl.textContent = rating;
    ratingEl.className = 'ending-rating rating-' + rating;

    // Narrative text from the ending
    let narrativeText = '';
    if (endingInfo.endingText) {
      narrativeText = typeof endingInfo.endingText === 'function'
        ? endingInfo.endingText(state)
        : t(endingInfo.endingText);
    }

    // Game summary stats
    let html = narrativeText;
    html += `<div class="game-result-summary">`;
    html += `<h3 class="fates-title">Ringkasan Permainan</h3>`;
    html += `<p class="result-headline">${summaryData.winDesc}</p>`;

    if (!summaryData.playerAlive) {
      html += `<p class="result-player-dead">Kau tereliminasi. Permainan dilanjutkan oleh NPC...</p>`;
    }

    html += `<div class="result-stats">`;
    html += `<div class="stat-item"><span class="stat-label">Ronde</span><span class="stat-value">${summaryData.roundCount}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Tereliminasi</span><span class="stat-value">${summaryData.deathCount}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Petunjuk</span><span class="stat-value">${summaryData.escapeClues}/${summaryData.cluesNeeded}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">Petunjuk Hancur</span><span class="stat-value">${summaryData.destroyedClues}</span></div>`;
    html += `</div>`;

    // Auto-simulation log (if player died)
    if (summaryData.autoSimLog && summaryData.autoSimLog.length > 0) {
      html += `<div class="result-autosim">`;
      html += `<h3 class="fates-title">Setelah Kau Tereliminasi...</h3>`;
      const maxShow = Math.min(summaryData.autoSimLog.length, 15);
      for (let i = 0; i < maxShow; i++) {
        html += `<p class="autosim-entry">${summaryData.autoSimLog[i]}</p>`;
      }
      if (summaryData.autoSimLog.length > maxShow) {
        html += `<p class="autosim-more">...dan ${summaryData.autoSimLog.length - maxShow} aksi lainnya</p>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    $('ending-text').innerHTML = html;

    // Character fates — combine narrative fates with game data
    const fatesEl = $('ending-fates');
    fatesEl.innerHTML = '';
    const fatesHtml = CHARACTERS.map(name => {
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
      const cls = !alive ? 'fate-dead' : wasKiller ? 'fate-corrupted' : 'fate-alive';
      const roleTag = wasKiller ? ' <span class="role-tag killer-tag">KILLER</span>' : '';
      const playerTag = name === playerChar() ? ' <span class="role-tag player-tag">KAMU</span>' : '';
      return `<div class="fate-item"><span class="fate-name ${cls}">${displayName}${roleTag}${playerTag}</span>: ${fateText}</div>`;
    }).join('');
    fatesEl.innerHTML = fatesHtml;

    // Save ending to gallery — include full narrative text and fates for re-reading
    endingsUnlocked[endingNum] = { title: endingTitle, rating, narrative: narrativeText, fates: fatesHtml };
    SecGuard.safeSetItem('simpul_endings', JSON.stringify(endingsUnlocked));

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
      // Track location staleness: reset if player actually moved
      const currentLoc = state.playerLocation || 'aula_utama';
      if (lastPlayerLocation && lastPlayerLocation !== currentLoc) {
        locationStaleRounds = 0;
        globalActionMemory = []; // Reset global memory on genuine movement
      }
      lastPlayerLocation = currentLoc;
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
      // Last-resort anti-stuck: prefer movement options over full reset
      if (allChoices.length === 0 && state.npcMinds) {
        brainActionCount = 0;
        brainActionHistory = brainActionHistory.filter(a =>
          !a.startsWith('move_') && !a.startsWith('investigate_') && !a.startsWith('hide_')
        );
        const moveOnlyChoices = generateMoveChoices(state);
        moveOnlyChoices.forEach(c => allChoices.push(c));
        if (allChoices.length === 0) {
          brainActionHistory = [];
          globalActionMemory = [];
          locationStaleRounds = 0;
          const dynamicChoices = generateDynamicChoices(state);
          dynamicChoices.forEach(c => allChoices.push(c));
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
      // Anti-stuck: if all brain actions exhausted and no story choices, force next node
      if (allChoices.length === 0) {
        const nextId = findNextStoryNode(currentNodeId);
        if (nextId) {
          allChoices.push({
            text: 'Lanjutkan cerita...', category: 'story',
            hint: 'Sudah cukup mengeksplorasi — saatnya melanjutkan',
            next: nextId
          });
        }
      }
      // Last-resort anti-stuck: only offer movement options to force progression
      if (allChoices.length === 0 && state.npcMinds) {
        brainActionCount = 0;
        // Only reset location-specific actions, keep global memory to prevent true loops
        brainActionHistory = brainActionHistory.filter(a =>
          !a.startsWith('move_') && !a.startsWith('investigate_') && !a.startsWith('hide_')
        );
        const moveOnlyChoices = generateMoveChoices(state);
        moveOnlyChoices.forEach(c => allChoices.push(c));
        // If still stuck (no moves), full reset as last resort
        if (allChoices.length === 0) {
          brainActionHistory = [];
          globalActionMemory = [];
          locationStaleRounds = 0;
          const dynamicChoices = generateDynamicChoices(state);
          dynamicChoices.forEach(c => allChoices.push(c));
        }
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
    // Track action category globally to detect cross-reset loops
    const category = actionKey.split('_')[0]; // observe, investigate, hide, talk, etc.
    if (category !== 'move') {
      globalActionMemory.push(category);
      if (globalActionMemory.length > 8) globalActionMemory.shift();
    }
    // Track player action history for NPC brain awareness
    if (!state.playerActionHistory) state.playerActionHistory = [];
    state.playerActionHistory.push(category);
    if (state.playerActionHistory.length > 10) state.playerActionHistory.shift();
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

  // ---- Generate movement-only choices (for anti-stuck fallback) ----
  function generateMoveChoices(gameState) {
    const choices = [];
    if (!gameState.npcMinds || typeof CharBrain === 'undefined') return choices;
    const pc = gameState.playerCharacter || 'arin';
    const isK = gameState.killers && gameState.killers.includes(pc);
    const playerLoc = gameState.playerLocation || 'aula_utama';
    const connections = CharBrain.LOCATION_CONNECTIONS[playerLoc] || [];
    if (connections.length === 0) return choices;
    // Pick best single destination based on strategic value
    const loc = pickBestMoveDestination(gameState, connections, pc, isK);
    if (loc && !brainActionTaken('move_' + loc)) {
      const npcsAtLoc = Object.keys(gameState.npcMinds || {}).filter(n =>
        gameState.alive[n] && gameState.npcMinds[n] && gameState.npcMinds[n].location === loc
      );
      const locNpcNames = npcsAtLoc.map(n => CharBrain.charName(n));
      const locInfo = npcsAtLoc.length > 0
        ? `${npcsAtLoc.length} orang di sana: ${locNpcNames.join(', ')}`
        : 'Kosong — aman untuk eksplorasi';
      choices.push({
        text: `Pindah ke ${CharBrain.locName(loc)} — situasi memaksa!`,
        type: 'brain', category: 'move',
        hint: `Terlalu lama di sini — harus bergerak! ${locInfo}`,
        risk: 10, reward: 50,
        effect: (s) => {
          recordBrainAction('move_' + loc);
          s.playerLocation = loc;
          locationStaleRounds = 0;
          globalActionMemory = [];
          brainActionHistory = brainActionHistory.filter(a => !a.startsWith('investigate_') && !a.startsWith('hide_'));
          Engine.notify(`Kau berpindah ke ${CharBrain.locName(loc)}.${npcsAtLoc.length > 0 ? ' Kau melihat ' + locNpcNames.join(', ') + ' di sini.' : ''}`);
        },
        next: (s) => currentNodeId
      });
    }
    // Also add story progression if available
    const nextId = findNextStoryNode(currentNodeId);
    if (nextId) {
      choices.push({
        text: 'Lanjutkan cerita — saatnya bergerak',
        type: 'brain', category: 'story',
        hint: 'Situasi memaksa — plot harus maju',
        risk: 5, reward: 50,
        next: nextId
      });
    }
    return choices;
  }

  // ---- Pick best single move destination ----
  function pickBestMoveDestination(gameState, connections, pc, isK) {
    const scored = connections.map(loc => {
      let score = 10 + Math.random() * 5; // base + small randomness
      const npcsAtLoc = Object.keys(gameState.npcMinds || {}).filter(n =>
        gameState.alive[n] && gameState.npcMinds[n] && gameState.npcMinds[n].location === loc
      );
      const hasEscClue = !isK && typeof getEscapeClueAtLocation === 'function' && getEscapeClueAtLocation(loc);
      const hasToolAtLoc = !getCharTool(pc) && Object.values(GAME_TOOLS).some(t => t.triggerLoc === loc && isToolAvailable(Object.keys(GAME_TOOLS).find(k => GAME_TOOLS[k] === t)));
      if (hasEscClue) score += 30;
      if (hasToolAtLoc) score += 20;
      if (isK) {
        // Killer wants isolated targets
        const nonKillerNpcs = npcsAtLoc.filter(n => !gameState.killers.includes(n));
        if (nonKillerNpcs.length === 1) score += 25;
        if (npcsAtLoc.length === 0) score += 10;
      } else {
        // Survivor wants allies
        if (npcsAtLoc.length > 0 && npcsAtLoc.length <= 2) score += 15;
        const killersAtLoc = npcsAtLoc.filter(n => gameState.killers.includes(n));
        if (killersAtLoc.length > 0) score -= 20;
      }
      return { loc, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.length > 0 ? scored[0].loc : null;
  }

  // ---- Check if action type was already done globally (cross-reset tracking) ----
  function isGloballyRepeated(actionCategory) {
    const count = globalActionMemory.filter(a => a === actionCategory).length;
    return count >= 2; // Same category done 2+ times = repeated
  }

  // ---- Dynamic Choices based on NPC brain state ----
  function generateDynamicChoices(gameState) {
    const choices = [];
    if (!gameState.npcMinds || typeof CharBrain === 'undefined') return choices;

    const pc = gameState.playerCharacter || 'arin';
    const isK = gameState.killers && gameState.killers.includes(pc);
    const playerLoc = gameState.playerLocation || 'aula_utama';
    const flavor = CHARACTER_ACTION_FLAVOR[pc] || CHARACTER_ACTION_FLAVOR.arin;

    // ---- Staleness: track consecutive non-movement actions ----
    locationStaleRounds++;
    const isStale = locationStaleRounds >= STALE_THRESHOLD;
    // Increase danger when staying too long in one place
    if (isStale) {
      gameState.dangerLevel = Math.min(100, (gameState.dangerLevel || 0) + STALE_DANGER_PER_ROUND);
    }

    // If player has been stationary too long, only show movement + critical actions
    if (locationStaleRounds >= STALE_THRESHOLD + 1) {
      const moveChoices = generateMoveChoices(gameState);
      if (moveChoices.length > 0) return moveChoices;
    }

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
        const conf = suspLvl > 75 ? 'Bukti sangat kuat' : suspLvl > 60 ? 'Bukti kuat' : suspLvl > 45 ? 'Bukti menengah' : 'Bukti lemah';
        const baseAccuseChance = Math.min(85, 30 + suspLvl + getCharAbility(pc, 'accusation'));
        const accuseChance = previewChance(baseAccuseChance, pc, 'offense');
        // Allies present boost confidence — lower risk
        const allyCount = nearbyNpcs.filter(n => !gameState.killers.includes(n) && gameState.npcMinds[n] && gameState.npcMinds[n].allies.includes(pc)).length;
        const allyRiskReduction = Math.min(15, allyCount * 8);
        const accuseRisk = Math.max(20, 80 - suspLvl - allyRiskReduction);
        // Reward scales gradually with suspicion
        const accuseReward = Math.min(95, 50 + Math.floor(suspLvl / 2));
        choices.push({
          text: flavor.accuse ? flavor.accuse(suspect) : `Tuduh ${CharBrain.charName(suspect)}: "Aku tahu apa yang kau lakukan."`,
          type: 'brain', category: 'accuse',
          hint: `${conf} — kecurigaan ${suspLvl}%${allyCount > 0 ? ` | ${allyCount} sekutu mendukung` : ''}`,
          risk: accuseRisk,
          reward: accuseReward,
          successChance: accuseChance,
          effect: (s) => {
            recordBrainAction('accuse_' + suspect);
            const result = rollChance(baseAccuseChance, pc, 'offense');
            if (result.success) {
              CharBrain.playerAction('accuse', suspect, s);
              const suspGain = 15 + (allyCount * 5);
              Engine.modSuspicion(suspect, suspGain);
              Engine.notify(`Tuduhan berhasil!${allyCount > 0 ? ` ${allyCount} sekutu menguatkan bukti! Suspicion +${suspGain}%` : ''} (${result.chance}% chance, roll: ${result.roll})`);
            } else {
              Engine.modSuspicion(suspect, 5);
              Engine.notify(`Tuduhanmu tidak meyakinkan. (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- VOTE to eliminate suspect (survivor only, requires 2+ NPCs at location, suspicion >= 50%) ---
    if (!isK && nearbyNpcs.length >= 2 && gameState.deathCount >= 1) {
      const voteTarget = nearbyNpcs.find(n =>
        (gameState.suspicion[n] || 0) >= 50 &&
        !brainActionTaken('vote_' + n)
      );
      if (voteTarget) {
        const suspLvl = gameState.suspicion[voteTarget] || 0;
        const isRevealed = (gameState.killerRevealed || []).includes(voteTarget);
        const isWitnessed = (gameState.witnessedKillers || []).includes(voteTarget);
        const voterCount = nearbyNpcs.filter(n => n !== voteTarget && !gameState.killers.includes(n)).length;
        const evidenceStr = isRevealed ? 'TERUNGKAP' : isWitnessed ? 'SAKSI PEMBUNUHAN' : suspLvl > 75 ? 'Bukti sangat kuat' : 'Bukti kuat';
        const voteRisk = isRevealed || isWitnessed ? 10 : Math.max(25, 60 - suspLvl);
        const voteReward = 95;
        choices.push({
          text: `🗳️ Voting: Eliminasi ${CharBrain.charName(voteTarget)} — "${CharBrain.charName(voteTarget)} adalah pembunuh!"`,
          type: 'brain', category: 'accuse',
          hint: `${evidenceStr} — ${suspLvl}% suspicion | ${voterCount} NPC akan ikut voting | Vote kamu 50% weight`,
          risk: voteRisk,
          reward: voteReward,
          successChance: 50,
          effect: (s) => {
            recordBrainAction('vote_' + voteTarget);
            CharBrain.playerAction('vote_eliminate', voteTarget, s);
            const result = CharBrain.conductVoting(voteTarget, s, pc);
            const voteDetails = Object.entries(result.votes).map(([name, v]) =>
              `${CharBrain.charName(name)}: ${v.vote === 'yes' ? '✋ SETUJU' : '✗ TOLAK'}`
            ).join(', ');

            if (result.success) {
              if (result.isActualKiller) {
                // Correct vote: killer eliminated!
                Engine.killChar(voteTarget);
                if (!s.killerRevealed.includes(voteTarget)) s.killerRevealed.push(voteTarget);
                // All NPCs at location see the elimination
                nearbyNpcs.forEach(n => {
                  if (s.npcMinds[n] && s.alive[n]) {
                    s.npcMinds[n].memory.push({ type: 'vote_elimination', target: voteTarget, round: s.roundCount });
                    s.npcMinds[n].tension = Math.max(0, s.npcMinds[n].tension - 10);
                  }
                });
                Engine.notify(`🗳️ VOTING BERHASIL! Hasil: ${result.voteYes} setuju vs ${result.voteNo} tolak. ${voteDetails}. ${CharBrain.charName(voteTarget)} TERELIMINASI di depan semua orang! Identitas killer terkonfirmasi!`);
                if (allKillersDead()) {
                  Engine.notify('🎉 SEMUA KILLER TELAH DIELIMINASI! Protagonis menang!');
                }
              } else {
                // Wrong vote: innocent eliminated — consequences
                Engine.killChar(voteTarget);
                s.dangerLevel = Math.min(100, (s.dangerLevel || 0) + 15);
                // Trust drops for all voters
                nearbyNpcs.forEach(n => {
                  if (s.npcMinds[n] && s.alive[n]) {
                    const tk = CharBrain.trustKeyFor(pc, n);
                    if (s.trust[tk] !== undefined) s.trust[tk] = Math.max(0, s.trust[tk] - 15);
                    s.npcMinds[n].tension += 20;
                  }
                });
                Engine.notify(`🗳️ VOTING BERHASIL tapi... ${CharBrain.charName(voteTarget)} BUKAN killer! ${voteDetails}. Orang tak bersalah tereliminasi! Trust semua orang turun drastis. Bahaya +15%.`);
              }
            } else {
              // Vote failed — not enough support
              Engine.modSuspicion(voteTarget, 10);
              Engine.notify(`🗳️ Voting GAGAL. Hasil: ${result.voteYes} setuju vs ${result.voteNo} tolak. ${voteDetails}. Tidak cukup dukungan untuk eliminasi. Suspicion +10%.`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- INVESTIGATE location (one-time per location per node) ---
    if (!brainActionTaken('investigate_' + playerLoc)) {
      const baseInvChance = 45 + (gameState.chapter * 8);
      const invChance = previewChance(baseInvChance, pc, 'intel');
      // Risk scales with danger level and nearby NPCs
      const invRisk = Math.min(60, (nearbyNpcs.length === 0 ? 10 : 20) + Math.floor((gameState.dangerLevel || 0) / 10));
      // Reward scales with clues found progress (more valuable early)
      const cluesFound = (gameState.escapeClues || []).length;
      const invReward = Math.min(90, 60 + ((5 - cluesFound) * 6));
      const aloneHint = nearbyNpcs.length === 0 ? 'Sendirian — lebih leluasa mencari' : `${nearbyNpcs.length} orang di sini — hati-hati`;
      const dangerHint = (gameState.dangerLevel || 0) > 40 ? ` | Bahaya ${gameState.dangerLevel}%` : '';
      choices.push({
        text: flavor.investigate ? flavor.investigate(playerLoc) : `Periksa ${CharBrain.locName(playerLoc)} — cari petunjuk tersembunyi`,
        type: 'brain', category: 'investigate',
        hint: `${aloneHint}${dangerHint}`,
        risk: invRisk,
        reward: invReward,
        successChance: invChance,
        effect: (s) => {
          recordBrainAction('investigate_' + playerLoc);
          const result = rollChance(baseInvChance, pc, 'intel');
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
              // Roll for Kunci Room Master (5% chance) during investigation
              if (rollMasterKey()) {
                Engine.notify('🔑 KUNCI ROOM MASTER DITEMUKAN saat investigasi! Misi petunjuk pelarian SELESAI!');
                return;
              }
              // Chance to also find an escape clue as bonus (30%)
              const escClue = getEscapeClueAtLocation(playerLoc);
              if (escClue && Math.random() < 0.30) {
                findEscapeClue(escClue.id);
                s.cluesFound = (s.cluesFound || 0) + 1;
                const newFound = (s.escapeClues || []).length;
                const needed = s.cluesNeededToWin || 5;
                Engine.notify(`Petunjuk ditemukan! Bonus: ${escClue.name} juga terungkap! Pelarian: ${newFound}/${needed} (${result.chance}% chance, roll: ${result.roll})`);
                if (canEscape()) {
                  Engine.notify('PETUNJUK CUKUP TERKUMPUL! Jalan keluar mansion terbuka!');
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
        const baseEscChance = 55 + (gameState.chapter * 6);
        const escChance = previewChance(baseEscChance, pc, 'intel');
        const found = (gameState.escapeClues || []).length;
        const needed = gameState.cluesNeededToWin || 5;
        const total = gameState.totalEscapeClues || 8;
        const remaining = needed - found;
        const peopleInfo = nearbyNpcs.length > 0
          ? ` | ${nearbyNpcs.length} orang di sekitar`
          : ' | Sendirian';
        // Risk scales — more risky with NPCs and high danger
        const escRisk = Math.min(50, (nearbyNpcs.length === 0 ? 5 : 20) + Math.floor((gameState.dangerLevel || 0) / 10));
        // Reward scales with urgency — more rewarding when close to completing
        const escReward = Math.min(100, 70 + (remaining <= 2 ? 25 : remaining <= 3 ? 15 : 0));
        choices.push({
          text: flavor.escape_clue ? flavor.escape_clue(playerLoc) : `Cari petunjuk pelarian di ${CharBrain.locName(playerLoc)}`,
          type: 'brain', category: 'investigate',
          hint: `Petunjuk: ${found}/${needed} dibutuhkan (${total} total)${peopleInfo} | 🔑 5% chance Kunci Room Master`,
          risk: escRisk,
          reward: escReward,
          successChance: escChance,
          effect: (s) => {
            recordBrainAction('escape_clue_' + playerLoc);
            // Roll for Kunci Room Master (5% chance) — instant win
            if (rollMasterKey()) {
              Engine.notify('🔑 KUNCI ROOM MASTER DITEMUKAN! Jalan keluar mansion langsung terbuka! Misi petunjuk pelarian SELESAI!');
              if (canEscape()) {
                Engine.notify('SEMUA KILLER TERUNGKAP — mansion terbuka!');
              }
              return;
            }
            const result = rollChance(baseEscChance, pc, 'intel');
            if (result.success) {
              findEscapeClue(escClue.id);
              s.cluesFound = (s.cluesFound || 0) + 1;
              const newFound = (s.escapeClues || []).length;
              Engine.notify(`${escClue.name} ditemukan! Petunjuk pelarian: ${newFound}/${needed} (${result.chance}% chance, roll: ${result.roll})`);
              if (canEscape()) {
                Engine.notify('PETUNJUK CUKUP TERKUMPUL! Jalan keluar mansion terbuka!');
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
        // Allies in the room boost attack chance and lower risk
        const allyCount = nearbyNpcs.filter(n => !gameState.killers.includes(n) && n !== revealedKiller && gameState.npcMinds[n] && gameState.npcMinds[n].allies.includes(pc)).length;
        const suspOnKiller = gameState.suspicion[revealedKiller] || 0;
        const baseAtkChance = 35 + Math.min(30, suspOnKiller / 3) + (allyCount * 8);
        const atkChance = previewChance(baseAtkChance, pc, 'offense');
        // Risk drops with more allies (safety in numbers)
        const atkRisk = Math.max(30, 75 - (allyCount * 12) - (suspOnKiller > 80 ? 10 : 0));
        const allyHint = allyCount > 0 ? ` | ${allyCount} sekutu siap membantu!` : ' | Kamu sendirian melawannya';
        choices.push({
          text: `Serang ${CharBrain.charName(revealedKiller)} — eliminasi killer!`,
          type: 'brain', category: 'confront',
          hint: `Habisi killer yang terungkap!${allyHint}`,
          risk: atkRisk, reward: 95,
          danger: allyCount === 0,
          successChance: Math.round(atkChance),
          effect: (s) => {
            recordBrainAction('attack_killer_' + revealedKiller);
            const result = rollChance(baseAtkChance, pc, 'offense');
            if (result.success) {
              Engine.killChar(revealedKiller);
              Engine.notify(`${CharBrain.charName(revealedKiller)} dieliminasi!${allyCount > 0 ? ` Tim ${allyCount + 1} orang berhasil!` : ''} (${result.chance}% chance, roll: ${result.roll})`);
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
        // Detection chance: base 40% + detection ability + chapter progression
        const baseObserveChance = Math.min(85, 40 + detBonus + (gameState.chapter * 4) + (canReadEmotion ? 15 : 0));
        const observeChance = previewChance(baseObserveChance, pc, 'intel');
        const emotionHint = canReadEmotion && mind
          ? `Emosi: ${mind.emotion} | Tension: ${mind.tension}% | Kecurigaan: ${Math.round(mind.suspicions[pc] || 0)}%`
          : (mind ? `Emosi: ${mind.emotion}` : 'Perhatikan perilakunya');
        // Risk low but increases slightly with danger
        const obsRisk = Math.min(25, 5 + Math.floor((gameState.dangerLevel || 0) / 15));
        // Reward higher if target has high suspicion (more info to gain)
        const targetSusp = gameState.suspicion[observeTarget] || 0;
        const obsReward = Math.min(80, 40 + Math.floor(targetSusp / 4) + (canReadEmotion ? 15 : 0));
        choices.push({
          text: flavor.observe ? flavor.observe(observeTarget) : `Amati gerak-gerik ${CharBrain.charName(observeTarget)} secara diam-diam`,
          type: 'brain', category: 'observe',
          hint: emotionHint,
          risk: obsRisk, reward: obsReward,
          successChance: observeChance,
          effect: (s) => {
            recordBrainAction('observe_' + observeTarget);
            const susp = s.suspicion[observeTarget] || 0;
            const isTarget = s.killers.includes(observeTarget);
            const detectChance = 0.4 + (detBonus / 100) + (canReadEmotion ? 0.15 : 0);
            if (isTarget && Math.random() < detectChance) {
              const suspGain = 8 + Math.floor(detBonus / 3) + (canReadEmotion ? 4 : 0);
              Engine.modSuspicion(observeTarget, suspGain);
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
        const trustAbility = getCharAbility(pc, 'trust');
        const trustGainPreview = 5 + Math.floor(trustAbility / 3);
        // Risk: talking to someone who suspects you is risky
        const theirSusp = gameState.npcMinds[talkTarget] ? (gameState.npcMinds[talkTarget].suspicions[pc] || 0) : 0;
        const talkRisk = Math.min(40, 5 + Math.floor(theirSusp / 5));
        // Reward: higher when trust is low (more to gain), or when target is a potential ally
        const isKillerTarget = gameState.killers.includes(talkTarget);
        const talkReward = Math.min(70, 30 + Math.floor((100 - trustLvl) / 4) + (trustAbility > 0 ? 10 : 0));
        const suspHint = theirSusp > 30 ? ` | Dia curiga padamu (${Math.round(theirSusp)}%)` : '';
        choices.push({
          text: flavor.talk ? flavor.talk(talkTarget) : `Bicara dengan ${CharBrain.charName(talkTarget)} — bangun hubungan`,
          type: 'brain', category: 'social',
          hint: `Kepercayaan: ${trustLvl}% → +${trustGainPreview}%${suspHint}`,
          risk: talkRisk, reward: talkReward,
          effect: (s) => {
            recordBrainAction('talk_' + talkTarget);
            const trustGain = 5 + Math.floor(getCharAbility(pc, 'trust') / 3);
            Engine.modTrust(pc, talkTarget, trustGain);
            const newTrust = s.trust[trustKey(pc, talkTarget)] || 55;
            // Talking also reduces their suspicion of you (scaled with trust ability)
            if (gameState.npcMinds[talkTarget] && theirSusp > 0) {
              const suspReduction = 4 + Math.floor(getCharAbility(pc, 'trust') / 5);
              gameState.npcMinds[talkTarget].suspicions[pc] = Math.max(0, theirSusp - suspReduction);
            }
            Engine.notify(`Hubunganmu dengan ${CharBrain.charName(talkTarget)} membaik. Trust: ${newTrust}%${theirSusp > 0 ? ' | Kecurigaan turun sedikit' : ''}`);
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
        const allianceAbility = getCharAbility(pc, 'allianceBonus');
        // Success chance based on trust + ability + danger (people ally more when scared)
        const dangerBoost = Math.floor((gameState.dangerLevel || 0) / 10);
        const allySuccessChance = Math.min(95, trustVal + allianceAbility + dangerBoost);
        // Risk scales gradually with trust (not binary)
        const allyRisk = Math.max(5, 40 - Math.floor(trustVal / 3) - Math.floor(allianceAbility / 2));
        // Reward higher when few allies (first alliance is most valuable)
        const currentAllyCount = gameState.npcMinds ? Object.values(gameState.npcMinds).filter(m => m.allies && m.allies.includes(pc)).length : 0;
        const allyReward = Math.min(90, 75 + (currentAllyCount === 0 ? 15 : 0) - (currentAllyCount * 5));
        const trustDesc = trustVal > 70 ? 'sangat percaya' : trustVal > 55 ? 'cukup percaya' : 'masih ragu';
        choices.push({
          text: flavor.ally ? flavor.ally(potential) : `Ajak ${CharBrain.charName(potential)} membentuk aliansi`,
          type: 'brain', category: 'alliance',
          hint: `Trust: ${trustVal}% (${trustDesc})${(gameState.dangerLevel || 0) > 40 ? ' | Bahaya tinggi — lebih mudah diajak' : ''}`,
          risk: allyRisk,
          reward: allyReward,
          successChance: allySuccessChance,
          effect: (s) => {
            recordBrainAction('ally_' + potential);
            if (Math.random() * 100 < allySuccessChance) {
              CharBrain.playerAction('ally', potential, s);
              const allyTrustGain = 10 + allianceAbility;
              Engine.modTrust(pc, potential, allyTrustGain);
              Engine.notify(`Aliansi terbentuk dengan ${CharBrain.charName(potential)}! Trust +${allyTrustGain}%`);
            } else {
              Engine.notify(`${CharBrain.charName(potential)} menolak ajakan aliansimu. Mungkin perlu bangun kepercayaan dulu.`);
            }
          },
          next: (s) => currentNodeId
        });
      }
    }

    // --- HIDE (one-time per location per node) ---
    if (gameState.dangerLevel > 30 && !isK && !brainActionTaken('hide_' + playerLoc)) {
      // Reward scales with danger — hiding is more valuable when danger is high
      const hideReward = Math.min(70, 15 + Math.floor(gameState.dangerLevel / 3));
      // Risk very low when alone, slightly higher with NPCs
      const hideRisk = nearbyNpcs.length === 0 ? 3 : Math.min(15, 5 + nearbyNpcs.length * 3);
      const dangerDesc = gameState.dangerLevel > 70 ? 'SANGAT BERBAHAYA!' : gameState.dangerLevel > 50 ? 'berbahaya di luar' : 'waspada';
      choices.push({
        text: flavor.hide ? flavor.hide(playerLoc) : `Sembunyi di ${CharBrain.locName(playerLoc)} — tunggu bahaya berlalu`,
        type: 'brain', category: 'hide',
        hint: `Bahaya: ${gameState.dangerLevel}% — ${dangerDesc}${nearbyNpcs.length === 0 ? ' | Sendirian — aman' : ''}`,
        risk: hideRisk, reward: hideReward,
        effect: (s) => {
          recordBrainAction('hide_' + playerLoc);
          const dangerReduction = nearbyNpcs.length === 0 ? 8 : 5;
          s.dangerLevel = Math.max(0, s.dangerLevel - dangerReduction);
          Engine.notify(`Kau bersembunyi dan menunggu. Bahaya turun -${dangerReduction}%.`);
        },
        next: (s) => currentNodeId
      });
    }

    // --- KILLER ACTIONS (one-time per target per node) ---
    if (isK) {
      const mySusp = gameState.suspicion[pc] || 0;
      const isRevealed = (gameState.killerRevealed || []).includes(pc);
      const nonKillerNearby = nearbyNpcs.filter(n => !gameState.killers.includes(n));

      // === REVEALED KILLER: Priority flee/hide/desperate actions ===
      if (isRevealed) {
        // Flee to safety (highest priority when revealed)
        if (nonKillerNearby.length >= 2 && !brainActionTaken('flee_revealed')) {
          const connections = CharBrain.LOCATION_CONNECTIONS[playerLoc] || [];
          const safeLoc = connections.find(loc => {
            const npcsAtLoc = Object.keys(gameState.npcMinds || {}).filter(n =>
              gameState.alive[n] && gameState.npcMinds[n] && gameState.npcMinds[n].location === loc && !gameState.killers.includes(n)
            );
            return npcsAtLoc.length === 0;
          });
          if (safeLoc) {
            choices.push({
              text: `KABUR ke ${CharBrain.locName(safeLoc)} — terlalu banyak survivor di sini!`,
              type: 'brain-killer', category: 'escape',
              danger: true,
              hint: `Identitasmu terungkap! ${nonKillerNearby.length} survivor di sini — kamu akan dieksekusi jika tetap di sini!`,
              risk: 15, reward: 95,
              successChance: 90,
              effect: (s) => {
                recordBrainAction('flee_revealed');
                s.playerLocation = safeLoc;
                brainActionHistory = brainActionHistory.filter(a => !a.startsWith('investigate_') && !a.startsWith('hide_'));
                Engine.notify(`Kau melarikan diri ke ${CharBrain.locName(safeLoc)}! Identitasmu sudah terungkap — bersembunyi adalah satu-satunya cara bertahan.`);
              },
              next: (s) => currentNodeId
            });
          }
        }

        // Hide when revealed and alone
        if (nonKillerNearby.length === 0 && !brainActionTaken('hide_revealed_' + playerLoc)) {
          choices.push({
            text: `Bersembunyi di ${CharBrain.locName(playerLoc)} — tunggu kesempatan`,
            type: 'brain-killer', category: 'hide',
            hint: 'Identitasmu terungkap — bersembunyi sendirian satu-satunya pilihan aman',
            risk: 5, reward: 60,
            effect: (s) => {
              recordBrainAction('hide_revealed_' + playerLoc);
              s.dangerLevel = Math.max(0, s.dangerLevel - 5);
              Engine.modSuspicion(pc, -5);
              Engine.notify('Kau bersembunyi dalam kegelapan. Suspicion turun sedikit — tapi mereka masih memburumu.');
            },
            next: (s) => currentNodeId
          });
        }

        // Last stand attack — desperate, high risk, only when alone with 1 target
        if (nonKillerNearby.length === 1 && !brainActionTaken('laststand_' + nonKillerNearby[0])) {
          const target = nonKillerNearby[0];
          const lastStandChance = 30; // Much lower chance when revealed
          choices.push({
            text: `Serangan terakhir — habisi ${CharBrain.charName(target)} sebelum mereka melapor!`,
            type: 'brain-killer', category: 'killer',
            danger: true,
            hint: `Serangan putus asa! Chance rendah (${lastStandChance}%) — gagal = kamu dieliminasi!`,
            risk: 90, reward: 85,
            successChance: lastStandChance,
            effect: (s) => {
              recordBrainAction('laststand_' + target);
              // PEMBURU PROTECTION
              if (s.pemburu && s.alive[s.pemburu]) {
                const pemburuMind = s.npcMinds && s.npcMinds[s.pemburu];
                const pemburuHere = pemburuMind && pemburuMind.location === (s.playerLocation || 'aula_utama');
                if (target === s.pemburu || pemburuHere) {
                  Engine.killChar(pc);
                  if (!s.pemburuRevealed) s.pemburuRevealed = true;
                  Engine.notify(`🔫 ${CharBrain.charName(s.pemburu)} mengungkap diri sebagai Pemburu dan menembakmu! Kau TEWAS.`);
                  return;
                }
              }
              const result = rollChance(lastStandChance, pc, 'offense');
              if (result.success) {
                Engine.killChar(target);
                Engine.notify(`${CharBrain.charName(target)} dieliminasi dalam serangan putus asa! (${result.chance}%, roll: ${result.roll})`);
              } else {
                // Failed last stand = player exposed badly
                Engine.modSuspicion(pc, 25);
                if (s.playerStatus) s.playerStatus.wounded = true;
                Engine.notify(`Serangan gagal total! ${CharBrain.charName(target)} membalas dan melaporkanmu! Suspicion +30%! (${result.chance}%, roll: ${result.roll})`);
              }
            },
            next: (s) => currentNodeId
          });
        }
      }

      // === NORMAL KILLER ACTIONS (not revealed) ===
      // Strike target
      const soloTarget = !isRevealed ? nearbyNpcs.find(n => !gameState.killers.includes(n) && !brainActionTaken('strike_' + n)) : null;
      if (soloTarget && nearbyNpcs.filter(n => !gameState.killers.includes(n)).length <= 2) {
        const witnesses = nearbyNpcs.filter(n => n !== soloTarget && !gameState.killers.includes(n)).length;
        const isSilent = hasCharAbility(pc, 'silentKill');
        let strikeChance = witnesses === 0 ? 50 : 25;
        // High suspicion reduces strike effectiveness
        if (mySusp > 40) strikeChance = Math.max(10, strikeChance - Math.floor(mySusp / 10));
        const silentLabel = isSilent ? ' (silent kill)' : '';
        choices.push({
          text: flavor.strike ? flavor.strike(soloTarget) : `Serang ${CharBrain.charName(soloTarget)}${witnesses === 0 ? ' — tidak ada saksi...' + silentLabel : ' — ada risiko saksi!'}`,
          type: 'brain-killer', category: 'killer',
          danger: witnesses > 0,
          hint: witnesses === 0 ? (isSilent ? 'Sendirian + silent kill — eliminasi tanpa bukti' : 'Sendirian — kesempatan emas') : `${witnesses} saksi potensial — sangat berisiko!`,
          risk: witnesses === 0 ? 45 : 85,
          reward: 90,
          successChance: strikeChance,
          effect: (s) => {
            recordBrainAction('strike_' + soloTarget);
            // PEMBURU PROTECTION: target is pemburu OR pemburu nearby → killer dies
            if (s.pemburu && s.alive[s.pemburu]) {
              const pemburuMind = s.npcMinds && s.npcMinds[s.pemburu];
              const pemburuHere = pemburuMind && pemburuMind.location === (s.playerLocation || 'aula_utama');
              const targetIsPemburu = soloTarget === s.pemburu;
              if (targetIsPemburu || pemburuHere) {
                Engine.killChar(pc);
                if (!s.pemburuRevealed) s.pemburuRevealed = true;
                const reason = targetIsPemburu
                  ? `Kau mencoba membunuh ${CharBrain.charName(s.pemburu)}!`
                  : `Kau mencoba membunuh ${CharBrain.charName(soloTarget)} di hadapan Pemburu!`;
                Engine.notify(`${reason} 🔫 ${CharBrain.charName(s.pemburu)} mengungkap diri sebagai Pemburu dan menembakmu! Kau TEWAS.`);
                return;
              }
            }
            const result = rollChance(strikeChance, pc, 'offense');
            if (result.success) {
              Engine.killChar(soloTarget);
              if (isSilent && witnesses === 0) {
                Engine.notify(`${CharBrain.charName(soloTarget)} dieliminasi tanpa jejak! (${result.chance}% chance, roll: ${result.roll})`);
              } else {
                Engine.notify(`${CharBrain.charName(soloTarget)} dieliminasi! (${result.chance}% chance, roll: ${result.roll})`);
              }
            } else {
              const failSusp = isSilent ? 10 : 18;
              Engine.modSuspicion(pc, failSusp);
              Engine.notify(`Serangan gagal! ${CharBrain.charName(soloTarget)} berhasil lolos. (${result.chance}% chance, roll: ${result.roll})`);
            }
          },
          next: (s) => currentNodeId
        });
      }

      // Sabotage other killer (killer vs killer self-preservation)
      // More effective when revealed — betraying another killer diverts attention
      const otherKillers = nearbyNpcs.filter(n => gameState.killers.includes(n) && n !== pc && !brainActionTaken('sabotage_killer_' + n));
      if (otherKillers.length > 0 && gameState.chapter >= 2) {
        const rivalKiller = otherKillers[0];
        const sabChance = isRevealed ? 65 : 50; // Higher chance when desperate
        const sabRisk = isRevealed ? 40 : 70; // Lower risk when already exposed
        const sabReward = isRevealed ? 95 : 85; // Higher reward — redirects heat
        const sabHint = isRevealed
          ? `Identitasmu sudah terungkap — korbankan ${CharBrain.charName(rivalKiller)} untuk mengalihkan perhatian!`
          : 'Khianati killer lain agar kau satu-satunya yang selamat';
        choices.push({
          text: `Sabotase ${CharBrain.charName(rivalKiller)} — selamatkan diri sendiri`,
          type: 'brain-killer', category: 'stealth',
          danger: !isRevealed,
          hint: sabHint,
          risk: sabRisk, reward: sabReward,
          successChance: sabChance,
          effect: (s) => {
            recordBrainAction('sabotage_killer_' + rivalKiller);
            const result = rollChance(sabChance, pc, 'offense');
            if (result.success) {
              Engine.modSuspicion(rivalKiller, 25);
              Engine.notify(`Kau berhasil membocorkan identitas ${CharBrain.charName(rivalKiller)} ke kelompok! (${result.chance}%)`);
            } else {
              Engine.modSuspicion(pc, 12);
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
      // Revealed killers CANNOT frame (everyone already knows who you are)
      if (nearbyNpcs.length > 0 && !isRevealed) {
        const frameTarget = nearbyNpcs.find(n => !gameState.killers.includes(n) && !brainActionTaken('frame_' + n));
        if (frameTarget) {
          // Frame chance degrades with suspicion — harder to frame when people already suspect you
          let frameChance = 45 + Math.floor(getCharAbility(pc, 'framingBonus') / 2);
          if (mySusp > 30) frameChance = Math.max(10, frameChance - Math.floor(mySusp / 4));
          // Risk increases with suspicion — more likely to backfire
          const frameRisk = Math.min(90, 50 + Math.floor(mySusp / 5));
          // Reward decreases with suspicion — less effective when you're already suspected
          const frameReward = Math.max(20, 70 - Math.floor(mySusp / 4));
          const suspHint = mySusp > 50 ? ` | Kecurigaan tinggi (${mySusp}%) — framing berisiko gagal!` : '';
          choices.push({
            text: flavor.frame ? flavor.frame(frameTarget) : `Arahkan kecurigaan ke ${CharBrain.charName(frameTarget)} — framing`,
            type: 'brain-killer', category: 'stealth',
            hint: `Chance: ${frameChance}% — target jadi musuh semua NPC, trust hancur. Gagal = kamu yang dicurigai!${suspHint}`,
            risk: frameRisk, reward: frameReward,
            successChance: frameChance,
            effect: (s) => {
              recordBrainAction('frame_' + frameTarget);
              const result = rollChance(frameChance, pc, 'offense');
              if (result.success) {
                const frameSusp = 20 + Math.floor(getCharAbility(pc, 'framingBonus') / 2);
                Engine.modSuspicion(frameTarget, frameSusp);
                Engine.modSuspicion(pc, -10);
                // REAL consequences: trust destroyed, enemies created, allies removed
                const affectedNames = [];
                if (s.npcMinds) {
                  Object.keys(s.npcMinds).forEach(npcName => {
                    const npc = s.npcMinds[npcName];
                    if (npc && npc.location === (s.playerLocation || 'aula_utama') && s.alive[npcName] && !s.killers.includes(npcName) && npcName !== frameTarget) {
                      // Suspicion spike on framed target
                      npc.suspicions[frameTarget] = Math.min(100, (npc.suspicions[frameTarget] || 0) + 22);
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
                Engine.modSuspicion(pc, 15);
                // Failed framing: nearby NPCs get suspicious of YOU
                if (s.npcMinds) {
                  Object.keys(s.npcMinds).forEach(npcName => {
                    const npc = s.npcMinds[npcName];
                    if (npc && npc.location === (s.playerLocation || 'aula_utama') && s.alive[npcName]) {
                      npc.suspicions[pc] = Math.min(100, (npc.suspicions[pc] || 0) + 12);
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

    // --- CHARACTER-UNIQUE ACTIONS (only available to the specific character) ---
    if (flavor.unique && Array.isArray(flavor.unique)) {
      flavor.unique.forEach(ua => {
        if (brainActionTaken('unique_' + ua.id)) return;
        const nearbyNames = nearbyNpcs;
        if (ua.condition && !ua.condition(gameState, nearbyNames)) return;
        const uText = typeof ua.text === 'function' ? ua.text(playerLoc) : ua.text;
        choices.push({
          text: uText,
          type: isK ? 'brain-killer' : 'brain',
          category: ua.category || 'investigate',
          hint: ua.hint || '',
          risk: ua.risk || 20,
          reward: ua.reward || 70,
          successChance: ua.successChance || undefined,
          effect: (s) => {
            recordBrainAction('unique_' + ua.id);
            if (ua.effect) ua.effect(s, pc);
          },
          next: (s) => currentNodeId
        });
      });
    }

    // --- MOVE to adjacent location (1 best destination only — forces strategic choice) ---
    const connections = CharBrain.LOCATION_CONNECTIONS[playerLoc] || [];
    if (connections.length > 0) {
      const bestLoc = pickBestMoveDestination(gameState, connections, pc, isK);
      if (bestLoc && !brainActionTaken('move_' + bestLoc)) {
        const npcsAtLoc = Object.keys(gameState.npcMinds || {}).filter(n =>
          gameState.alive[n] && gameState.npcMinds[n] && gameState.npcMinds[n].location === bestLoc
        );
        const locNpcNames = npcsAtLoc.map(n => typeof CharBrain !== 'undefined' ? CharBrain.charName(n) : n);
        const killerAtLoc = npcsAtLoc.some(n => gameState.killers.includes(n));
        const hasEscClue = !isK && typeof getEscapeClueAtLocation === 'function' && getEscapeClueAtLocation(bestLoc);
        const hasToolAtLoc = !getCharTool(pc) && Object.values(GAME_TOOLS).some(t => t.triggerLoc === bestLoc && isToolAvailable(Object.keys(GAME_TOOLS).find(k => GAME_TOOLS[k] === t)));
        let locInfo = npcsAtLoc.length > 0
          ? `${npcsAtLoc.length} orang di sana: ${locNpcNames.join(', ')}`
          : 'Kosong — aman untuk eksplorasi';
        if (hasEscClue) locInfo += ' | Petunjuk pelarian tersedia';
        if (hasToolAtLoc) locInfo += ' | Ada alat tersedia';
        if (isStale) locInfo += ' | ⚠️ Terlalu lama di sini!';
        const moveRisk = killerAtLoc ? Math.min(50, 30 + Math.floor((gameState.dangerLevel || 0) / 10)) : (npcsAtLoc.length > 0 ? 15 : 5);
        const moveReward = Math.min(60, 15 + (hasEscClue ? 25 : 0) + (hasToolAtLoc ? 20 : 0) + (isStale ? 20 : 0));
        choices.push({
          text: `Pindah ke ${CharBrain.locName(bestLoc)}`,
          type: 'brain', category: 'move',
          hint: locInfo,
          risk: moveRisk,
          reward: moveReward,
          effect: (s) => {
            recordBrainAction('move_' + bestLoc);
            s.playerLocation = bestLoc;
            locationStaleRounds = 0;
            globalActionMemory = [];
            brainActionHistory = brainActionHistory.filter(a => !a.startsWith('investigate_') && !a.startsWith('hide_'));
            Engine.notify(`Kau berpindah ke ${CharBrain.locName(bestLoc)}.${npcsAtLoc.length > 0 ? ' Kau melihat ' + npcsAtLoc.map(n => CharBrain.charName(n)).join(', ') + ' di sini.' : ''}`);
          },
          next: (s) => currentNodeId
        });
      }
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
    if (choice.risk !== undefined) {
      // Even explicit risk values get adjusted by role state
      let risk = choice.risk;
      const pc = playerChar();
      const isK = isPlayerKiller();
      const mySusp = state.suspicion[pc] || 0;
      const revealed = isK && (state.killerRevealed || []).includes(pc);
      const cat = detectCategory(choice);
      // Revealed killer: all offensive actions become much riskier
      if (revealed && ['killer', 'stealth', 'confront'].includes(cat)) {
        risk = Math.min(100, risk + 20);
      }
      // High suspicion: stealth/frame actions get riskier
      if (isK && mySusp > 50 && ['stealth', 'killer'].includes(cat)) {
        risk = Math.min(100, risk + Math.floor(mySusp / 10));
      }
      return Math.min(risk, 100);
    }
    const cat = detectCategory(choice);
    const baseRisk = { killer: 90, confront: 60, accuse: 55, escape: 50, investigate: 30, hack: 35, move: 20, social: 15, alliance: 10, observe: 10, protect: 40, negotiate: 25, hide: 20, stealth: 35, story: 5 };
    let risk = baseRisk[cat] || 15;
    if (choice.danger) risk = Math.max(risk, 75);
    if (state.dangerLevel > 50) risk += Math.floor(state.dangerLevel / 10);
    // Role-aware risk adjustments
    const pc = playerChar();
    const isK = isPlayerKiller();
    // Protagonist: allies nearby reduce risk for confrontation actions
    if (!isK && ['confront', 'accuse', 'attack'].includes(cat) && state.npcMinds) {
      const pcLoc = state.playerLocation || 'aula_utama';
      const alliesNearby = Object.values(state.npcMinds).filter(m =>
        m.location === pcLoc && state.alive[m.name] && m.allies && m.allies.includes(pc)
      ).length;
      if (alliesNearby > 0) risk = Math.max(10, risk - alliesNearby * 8);
    }
    if (isK) {
      const mySusp = state.suspicion[pc] || 0;
      const revealed = (state.killerRevealed || []).includes(pc);
      // Revealed killer: offensive actions extremely risky
      if (revealed && ['killer', 'stealth', 'confront'].includes(cat)) {
        risk = Math.min(100, risk + 25);
      } else if (mySusp > 50 && ['killer', 'stealth'].includes(cat)) {
        risk = Math.min(100, risk + Math.floor(mySusp / 8));
      }
      // Defensive actions (flee, hide) become lower risk for exposed killers
      if (revealed && ['hide', 'move', 'escape'].includes(cat)) {
        risk = Math.max(5, risk - 10);
      }
    }
    return Math.min(risk, 100);
  }

  function calcReward(choice) {
    if (choice.reward !== undefined) {
      let reward = choice.reward;
      const pc = playerChar();
      const isK = isPlayerKiller();
      const mySusp = state.suspicion[pc] || 0;
      const revealed = isK && (state.killerRevealed || []).includes(pc);
      const cat = detectCategory(choice);
      // Revealed killer: offensive actions less rewarding (everyone knows you)
      if (revealed && ['stealth'].includes(cat)) {
        reward = Math.max(10, reward - 25);
      }
      // High suspicion: framing less effective (people already suspicious of you)
      if (isK && mySusp > 40 && cat === 'stealth') {
        reward = Math.max(10, reward - Math.floor(mySusp / 5));
      }
      // Defensive actions more rewarding when exposed
      if (revealed && ['hide', 'move', 'escape'].includes(cat)) {
        reward = Math.min(100, reward + 20);
      }
      return reward;
    }
    const cat = detectCategory(choice);
    const baseReward = { investigate: 80, accuse: 85, hack: 75, confront: 70, alliance: 65, social: 50, observe: 55, negotiate: 60, protect: 45, killer: 90, escape: 30, move: 20, hide: 15, stealth: 40, story: 35 };
    let reward = baseReward[cat] || 35;
    const pc = playerChar();
    const isK = isPlayerKiller();
    if (isK) {
      const mySusp = state.suspicion[pc] || 0;
      const revealed = (state.killerRevealed || []).includes(pc);
      // Revealed: offensive is futile, defensive is smart
      if (revealed) {
        if (['stealth', 'killer'].includes(cat)) reward = Math.max(10, reward - 30);
        if (['hide', 'move', 'escape'].includes(cat)) reward = Math.min(100, reward + 25);
      } else if (mySusp > 40) {
        if (cat === 'stealth') reward = Math.max(15, reward - Math.floor(mySusp / 5));
      }
    }
    return reward;
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
    id: ['Prolog', 'Bab 1: Pameran Maut', 'Bab 2: Darah Pertama', 'Bab 3: Perburuan', 'Bab 4: Konfrontasi', 'Bab 5: Fajar Terakhir'],
    en: ['Prologue', 'Chapter 1: The Death Exhibition', 'Chapter 2: First Blood', 'Chapter 3: The Hunt', 'Chapter 4: Confrontation', 'Chapter 5: Bloody Dawn']
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

    const killers = getKillers(selectedDifficulty);
    const killerCount = killers.length;

    // --- SURVIVOR OPTION: Random character (exclude active killers for this difficulty) ---
    const survivorPool = CHARACTERS.filter(n => !killers.includes(n));
    const survCard = document.createElement('div');
    survCard.className = 'role-card role-card-survivor';
    survCard.style.setProperty('--role-color', '#4a7c59');
    survCard.innerHTML = `
      <span class="role-portrait css-avatar-role" style="background:#4a7c59">🛡️</span>
      <div class="role-info">
        <div class="role-name" style="color:#4a7c59">Survivor</div>
        <div class="role-title">Karakter Acak</div>
        <div class="role-perk">Kau akan mendapat salah satu karakter secara acak</div>
        <div class="role-desc">Bertahan hidup, kumpulkan petunjuk, ungkap identitas killer. Siapa pembunuhnya? Kau harus mencari tahu sendiri!</div>
        <div class="role-survivor-list">${CHARACTERS.map(n => {
          const r = ROLE_DESCRIPTIONS[n];
          return `<span class="role-survivor-chip" style="border-color:${CHAR_COLORS[n]}">${CHAR_DISPLAY[n]} — ${r ? r.perk : ''}</span>`;
        }).join('')}</div>
      </div>
    `;
    survCard.addEventListener('click', () => {
      const randomChar = survivorPool[Math.floor(Math.random() * survivorPool.length)];
      state = defaultState(selectedDifficulty, randomChar, false);
      resetChatTimestamp();
      const startClueCount = getCharAbility(randomChar, 'startClues');
      if (startClueCount > 0) {
        applyStartClues(state, startClueCount);
      }
      currentNodeId = null;
      showScreen('screen-characters');
      renderCharacterIntro();
    });
    container.appendChild(survCard);

    // --- KILLER OPTION: Random killer from killer pool ---
    const killCard = document.createElement('div');
    killCard.className = 'role-card role-card-killer';
    killCard.style.animationDelay = '0.12s';
    killCard.style.setProperty('--role-color', '#8b0000');
    killCard.innerHTML = `
      <span class="role-portrait css-avatar-role" style="background:#8b0000">🗡️</span>
      <div class="role-info">
        <div class="role-name" style="color:#e63946">Killer</div>
        <div class="role-title">Peran Gelap</div>
        <div class="role-perk">Kau akan mendapat karakter killer secara acak</div>
        <div class="role-desc">Eliminasi survivor tanpa ketahuan. ${killerCount > 1 ? `${killerCount - 1} killer lain juga akan membantumu.` : 'Kau adalah satu-satunya pembunuh.'} Hati-hati — Pemburu mengintai!</div>
        <div class="role-warning">⚠️ Peran Gelap: Kau bermain sebagai antagonis.</div>
      </div>
    `;
    killCard.addEventListener('click', () => {
      const randomKiller = killers[Math.floor(Math.random() * killers.length)];
      state = defaultState(selectedDifficulty, randomKiller, true);
      resetChatTimestamp();
      currentNodeId = null;
      showScreen('screen-characters');
      renderCharacterIntro();
    });
    container.appendChild(killCard);
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
    const unlockedCount = Object.keys(endingsUnlocked).length;
    $('gallery-title').textContent = `Galeri Ending (${unlockedCount}/30)`;
    const grid = $('gallery-grid');
    grid.innerHTML = '';
    const hasAnyUnlocked = unlockedCount > 0;
    for (let i = 1; i <= 30; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      if (endingsUnlocked[i]) {
        item.classList.add('unlocked');
        const ratingClass = endingsUnlocked[i].rating ? 'rating-' + endingsUnlocked[i].rating : '';
        item.innerHTML = `<div class="gi-number ${ratingClass}">#${i}</div><div class="gi-title">${endingsUnlocked[i].title}</div><div class="gi-tap">Tap untuk baca</div>`;
        item.style.cursor = 'pointer';
        item.addEventListener('click', (function(num) { return function() { showEndingReader(num); }; })(i));
      } else {
        let lockedHtml = `<div class="gi-number">#${i}</div><div class="gi-locked">\uD83D\uDD12</div>`;
        if (hasAnyUnlocked && typeof ENDING_REQUIREMENTS !== 'undefined' && ENDING_REQUIREMENTS[i]) {
          const req = ENDING_REQUIREMENTS[i];
          const ratingBadge = req.rating ? `<span class="gi-req-rating rating-${req.rating}">${req.rating}</span>` : '';
          lockedHtml += `<div class="gi-requirements">${ratingBadge} ${req.hint}</div>`;
        }
        item.innerHTML = lockedHtml;
      }
      grid.appendChild(item);
    }
  }

  function showEndingReader(endingNum) {
    const data = endingsUnlocked[endingNum];
    if (!data) return;
    const reader = $('screen-ending-reader');
    reader.style.display = 'flex';
    $('reader-title').textContent = `#${endingNum}: ${data.title} [${data.rating}]`;
    $('reader-content').innerHTML = data.narrative || '<p>Cerita tidak tersimpan. Buka ending ini lagi untuk menyimpan teks lengkap.</p>';
    $('reader-fates').innerHTML = data.fates || '';
    $('btn-close-reader').onclick = function() { reader.style.display = 'none'; };
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
    init, t, getTrust, modTrust, modAwareness, modDanger, modSuspicion, decaySuspicion, checkPemburuExecution,
    killChar, canDie, isKiller, aliveCount, aliveMainCount, addAlliance,
    screenShake, bloodDrip, glitch, deathFlash, showChapterTitle, notify,
    showDirectEnding, renderNode, getPortraitHTML,
    isPlayer, playerChar, playerName, isPlayerKiller, getPlayerPerspective,
    initNpcMinds, runNpcRound, checkWinLossState, updateNpcLogPanel,
    // Tool system
    pickupTool, getCharTool, getToolOwner, isToolAvailable, npcPickupTool,
    getToolBonus, rollChance, updatePlayerStatus,
    // Escape system
    getEscapeClueAtLocation, findEscapeClue, destroyEscapeClue, canEscape, rollMasterKey,
    triggerMansionEscape, allKillersDead, aliveKillerCount, aliveSurvivorCount,
    ESCAPE_CLUE_LOCATIONS,
    GAME_TOOLS, ROLE_DESCRIPTIONS,
    get state() { return state; },
    get lang() { return lang; },
    CHARACTERS, MAIN_CHARACTERS, SIDE_CHARACTERS, CHAR_DISPLAY, diffMult,
    getDifficulty: () => state.difficulty || 2
  };
})();
