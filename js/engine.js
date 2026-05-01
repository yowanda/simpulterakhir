/* ============================================================
   SIMPUL TERAKHIR — Game Engine (Reworked)
   10 karakter, killer system per difficulty, post-modern horror
   ============================================================ */

const Engine = (() => {
  let lang = 'id';
  let state = {};
  let storyNodes = {};
  let currentNodeId = null;
  let brainActionCount = 0;
  let isBrainRevisit = false;
  let brainActionHistory = [];  // Track executed brain actions per node to prevent looping
  const BRAIN_MAX_PER_NODE = 2; // Max brain actions before forcing story progression
  const MAX_PLAYER_OPTIONS = 3; // Max choices shown to player per node
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
  let endingsUnlocked = JSON.parse(localStorage.getItem('simpul_endings') || '{}');

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
  const ROLE_DESCRIPTIONS = {
    arin: {
      role: 'Investigator',
      perk: 'Clue ekstra & insting jurnalis tajam',
      desc: 'Jurnalis investigasi yang mengejar kebenaran. Perspektif default — kau mencari jawaban, mengumpulkan bukti, dan mengungkap konspirasi.',
      icon: 'pencarian'
    },
    niko: {
      role: 'Tuan Rumah',
      perk: 'Akses area rahasia & pengetahuan mansion',
      desc: 'Pewaris mansion dengan dosa keluarga. Kau tahu lebih banyak tentang mansion ini dari siapapun — tapi pengetahuan itu datang dengan beban.',
      icon: 'kunci',
      warning: 'Di Hard mode, kau adalah salah satu killer.'
    },
    sera: {
      role: 'Profiler',
      perk: 'Baca emosi & deteksi kebohongan',
      desc: 'Psikolog klinis yang bisa membaca jiwa. Kau melihat apa yang orang lain sembunyikan — ketakutan, kebohongan, dan cinta yang tidak terucapkan.',
      icon: 'jiwa'
    },
    juno: {
      role: 'Pemberontak',
      perk: 'Aksi langsung & jalur pelarian',
      desc: 'Seniman jalanan dengan naluri bertarung. Kau tidak main tebak-tebakan — kau dobrak pintu, pecahkan jendela, dan hadapi masalah head-on.',
      icon: 'api'
    },
    vira: {
      role: 'Saksi Selamat',
      perk: 'Pengetahuan mansion & rute tersembunyi',
      desc: 'Kau pernah di sini sebelumnya. Kau tahu di mana Sang Penenun bersembunyi. Tapi kebenaran itu datang dengan harga — trauma yang tidak pernah sembuh.',
      icon: 'bayangan'
    },
    reza: {
      role: 'Detektif',
      perk: 'Analisis taktis & negosiasi',
      desc: 'Mantan detektif yang dipecat karena kasus ini. Kau kembali untuk menyelesaikan apa yang dulu gagal. Insting polisi tidak pernah mati.',
      icon: 'lencana'
    },
    lana: {
      role: 'Dalang',
      perk: 'Manipulasi & pengetahuan gelap',
      desc: 'Novelis horor yang bukunya terlalu akurat. Kau melihat dunia sebagai narasi — dan setiap orang sebagai karakter yang bisa dimanipulasi.',
      icon: 'pena',
      warning: 'Kau adalah operator Sang Penenun. Pengalaman bermain berbeda total.'
    },
    dimas: {
      role: 'Operator',
      perk: 'Pengetahuan forensik & ketahanan mental',
      desc: 'Mahasiswa forensik yang terlalu tenang di dekat kematian. Di bawah topeng sopan, ada kekosongan yang menakutkan.',
      icon: 'pisau',
      warning: 'Di Normal/Hard, kau adalah operator Sang Penenun.'
    },
    kira: {
      role: 'Hacker',
      perk: 'Hack sistem & akses digital',
      desc: 'Ethical hacker yang menemukan anomali digital. Kau hidup di dunia data — dan di mansion ini, data adalah senjata paling berbahaya.',
      icon: 'terminal'
    },
    farah: {
      role: 'Pewaris',
      perk: 'Pengaruh, negosiasi & rahasia keluarga',
      desc: 'Pewaris estate Aldridge. Keluargamu membiayai mansion ini 50 tahun lalu. Kau tahu rahasianya — dan rahasiamu sendiri lebih kelam.',
      icon: 'mahkota'
    }
  };

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
      alliances: [],
      npcMinds: null,
      roundCount: 0,
      playerLocation: 'aula_utama',
      npcActionLog: [],
      winLossResult: null,
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
    state.suspicion[char] = Math.max(0, Math.min(100, (state.suspicion[char] || 0) + delta));
  }

  // ---- Is this character a killer? ----
  function isKiller(name) {
    return state.killers && state.killers.includes(name);
  }

  // ---- Kill character ----
  function killChar(name) {
    state.alive[name] = false;
    state.deathCount++;
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
    const totalChance = Math.min(95, Math.max(5, baseChance + toolBonus));
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

  // ---- Text Rendering ----
  function renderText(html, container, callback) {
    if (typingTimeout) { clearTimeout(typingTimeout); typingTimeout = null; }
    const enhancedHtml = html.replace(/<span class="speaker (\w+)">/g, (match, charName) => {
      if (CHAR_DISPLAY[charName]) {
        return getPortraitHTML(charName) + `<span class="speaker ${charName}">`;
      }
      return match;
    });
    container.innerHTML = enhancedHtml;
    if (callback) callback();
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
    const isWin = result.type === 'win' || result.type === 'partial_win';
    const pc = playerChar();
    const isK = state.killers && state.killers.includes(pc);
    const ratingMap = {
      survivor_victory: 'S',
      killer_victory: 'S',
      survived_unresolved: 'B',
      total_elimination: 'A',
      killer_killed: 'D',
      survivor_killed: 'F',
      killer_exposed: 'D',
      total_massacre: 'F'
    };
    const rating = ratingMap[result.reason] || 'C';

    const endingData = {
      endingNumber: 26 + (isK ? 1 : 0),
      title: result.title,
      rating: rating,
      isEnding: true,
      endingText: `<p class="narration">${result.desc}</p>
        <p class="journal"><em>${isK ? 'Sebagai pembunuh, kau ' + (isWin ? 'berhasil menyelesaikan misimu.' : 'gagal. Mangsamu terlalu kuat.') :
        'Sebagai survivor, kau ' + (isWin ? 'mengalahkan kegelapan.' : 'jatuh ke dalam kegelapan.')}</em></p>
        <p>Ronde bertahan: ${state.roundCount}</p>
        <p>Kematian total: ${state.deathCount}</p>
        <p>Petunjuk ditemukan: ${state.cluesFound}</p>`
    };
    showDirectEnding(endingData.endingNumber, endingData);
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
      if (state.npcMinds && state.chapter >= 1 && brainActionCount < BRAIN_MAX_PER_NODE) {
        const dynamicChoices = generateDynamicChoices(state);
        dynamicChoices.forEach(c => allChoices.push(c));
      } else if (brainActionCount >= BRAIN_MAX_PER_NODE && storyChoices.length === 0) {
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
    if (state.npcMinds && state.chapter >= 1) {
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
    if (state.npcMinds && state.chapter >= 1 && !node.isEnding) {
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

    renderText(textContent, storyText, () => {
      $('story-area').scrollTop = 0;

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
      if (state.npcMinds && state.chapter >= 1 && brainActionCount < BRAIN_MAX_PER_NODE) {
        const dynamicChoices = generateDynamicChoices(state);
        dynamicChoices.forEach(c => allChoices.push(c));
      }
      renderChoices(allChoices);
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
        const accuseChance = Math.min(85, 30 + suspLvl);
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
      const invChance = 40 + (gameState.chapter * 8);
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
            Engine.notify(`Petunjuk ditemukan! (${result.chance}% chance, roll: ${result.roll})`);
          } else {
            Engine.notify(`Tidak menemukan apa-apa kali ini. (${result.chance}% chance, roll: ${result.roll})`);
          }
        },
        next: (s) => currentNodeId
      });
    }

    // --- OBSERVE nearby NPCs (one-time per NPC per node) ---
    if (nearbyNpcs.length > 0) {
      const observeTarget = nearbyNpcs.find(n => !brainActionTaken('observe_' + n));
      if (observeTarget) {
        const mind = gameState.npcMinds[observeTarget];
        choices.push({
          text: `Amati gerak-gerik ${CharBrain.charName(observeTarget)} secara diam-diam`,
          type: 'brain', category: 'observe',
          hint: mind ? `Emosi: ${mind.emotion} — mungkin bisa membaca niatnya` : 'Perhatikan perilakunya',
          risk: 10, reward: 55,
          effect: (s) => {
            recordBrainAction('observe_' + observeTarget);
            const susp = s.suspicion[observeTarget] || 0;
            const isTarget = s.killers.includes(observeTarget);
            if (isTarget && Math.random() < 0.4) {
              s.suspicion[observeTarget] = Math.min(100, susp + 10);
              Engine.notify(`Kau menangkap gelagat mencurigakan dari ${CharBrain.charName(observeTarget)}! Kecurigaan naik.`);
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
            Engine.modTrust(pc, talkTarget, 5);
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
            Engine.modTrust(pc, potential, 10);
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
        const strikeChance = witnesses === 0 ? 65 : 35;
        choices.push({
          text: `Serang ${CharBrain.charName(soloTarget)}${witnesses === 0 ? ' — tidak ada saksi...' : ' — ada risiko saksi!'}`,
          type: 'brain-killer', category: 'killer',
          danger: witnesses > 0,
          hint: witnesses === 0 ? 'Sendirian — kesempatan emas' : `${witnesses} saksi potensial — sangat berisiko!`,
          risk: witnesses === 0 ? 45 : 85,
          reward: 90,
          successChance: strikeChance,
          effect: (s) => {
            recordBrainAction('strike_' + soloTarget);
            const result = rollChance(strikeChance, pc, 'offense');
            if (result.success) {
              Engine.killChar(soloTarget);
              Engine.notify(`${CharBrain.charName(soloTarget)} dieliminasi! (${result.chance}% chance, roll: ${result.roll})`);
            } else {
              Engine.modSuspicion(pc, 20);
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

      // Manipulate/Frame (one-time per target)
      if (nearbyNpcs.length > 0) {
        const frameTarget = nearbyNpcs.find(n => !gameState.killers.includes(n) && !brainActionTaken('frame_' + n));
        if (frameTarget) {
          choices.push({
            text: `Arahkan kecurigaan ke ${CharBrain.charName(frameTarget)} — framing`,
            type: 'brain-killer', category: 'stealth',
            hint: 'Buat orang lain terlihat mencurigakan',
            risk: 35, reward: 70,
            effect: (s) => {
              recordBrainAction('frame_' + frameTarget);
              Engine.modSuspicion(frameTarget, 15);
              Engine.notify(`Kau diam-diam menanamkan bukti palsu yang mengarah ke ${CharBrain.charName(frameTarget)}.`);
            },
            next: (s) => currentNodeId
          });
        }
      }
    }

    // --- MOVE to adjacent location (always available, resets brain actions at new loc) ---
    const connections = CharBrain.LOCATION_CONNECTIONS[playerLoc] || [];
    if (connections.length > 0 && gameState.chapter >= 1) {
      const shuffled = connections.slice().sort(() => Math.random() - 0.5);
      const moveDests = shuffled.slice(0, Math.min(2, shuffled.length));
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
      return true;
    });

    if (available.length === 0 && choices.length === 0) return;

    // Limit player options to MAX_PLAYER_OPTIONS (3) — prioritize story choices, then highest reward brain choices
    let displayed = available;
    if (displayed.length > MAX_PLAYER_OPTIONS) {
      const story = displayed.filter(c => !c.type || c.type === 'story' || (!c.type?.startsWith('brain')));
      const brain = displayed.filter(c => c.type === 'brain' || c.type === 'brain-killer');
      brain.sort((a, b) => (b.reward || 0) - (a.reward || 0));
      displayed = story.slice(0, MAX_PLAYER_OPTIONS);
      const remaining = MAX_PLAYER_OPTIONS - displayed.length;
      if (remaining > 0) displayed = displayed.concat(brain.slice(0, remaining));
      displayed = displayed.slice(0, MAX_PLAYER_OPTIONS);
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
      if (state.chapter >= 1) {
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
  }

  const CHAPTERS = {
    id: ['Prolog', 'Bab 1: Pameran Maut', 'Bab 2: Darah Pertama', 'Bab 3: Pecah Belah', 'Bab 4: Perburuan', 'Bab 5: Wahyu', 'Bab 6: Konfrontasi', 'Bab 7: Simpul Terakhir'],
    en: ['Prologue', 'Chapter 1: The Death Exhibition', 'Chapter 2: First Blood', 'Chapter 3: Fractured', 'Chapter 4: The Hunt', 'Chapter 5: Revelation', 'Chapter 6: Confrontation', 'Chapter 7: The Last Knot']
  };
  function updateChapterIndicator() {
    $('chapter-indicator').textContent = (CHAPTERS[lang] || CHAPTERS.id)[state.chapter] || '';
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

    const roleOrder = ['arin', 'sera', 'niko', 'juno', 'vira', 'reza', 'kira', 'farah', 'lana', 'dimas'];

    roleOrder.forEach((name, idx) => {
      const role = ROLE_DESCRIPTIONS[name];
      const profile = typeof CHARACTER_PROFILES !== 'undefined' ? CHARACTER_PROFILES[name] : null;
      const color = CHAR_COLORS[name] || '#666';
      const displayName = CHAR_DISPLAY[name];

      const card = document.createElement('div');
      card.className = 'role-card';
      card.style.animationDelay = (idx * 0.08) + 's';
      card.style.setProperty('--role-color', color);

      const isKillerRole = KILLER_CONFIG[selectedDifficulty].killers.includes(name);
      const portraitContent = CHAR_PORTRAITS[name]
        ? `<img class="role-portrait" src="${CHAR_PORTRAITS[name]}" alt="${displayName}">`
        : `<span class="role-portrait css-avatar-role" style="background:${color}">${CHAR_INITIALS[name] || displayName.charAt(0)}</span>`;

      let warningHtml = '';
      if (isKillerRole) {
        warningHtml = `<div class="role-warning">Peran Gelap: Kau bermain sebagai antagonis</div>`;
      }

      card.innerHTML = `
        ${portraitContent}
        <div class="role-info">
          <div class="role-name" style="color:${color}">${displayName}</div>
          <div class="role-title">${role.role}</div>
          <div class="role-perk">${role.perk}</div>
          <div class="role-desc">${role.desc}</div>
          ${warningHtml}
        </div>
      `;

      card.addEventListener('click', () => {
        state = defaultState(selectedDifficulty, name);
        currentNodeId = null;
        showScreen('screen-characters');
        renderCharacterIntro();
      });

      container.appendChild(card);
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
    localStorage.setItem('simpul_endings', JSON.stringify(endingsUnlocked));
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
    localStorage.setItem('simpul_save', JSON.stringify(saveData));
  }

  function loadGame() {
    const data = JSON.parse(localStorage.getItem('simpul_save'));
    if (!data || data.version < 5) { notify('Save lama tidak kompatibel. Mulai game baru.'); return false; }
    state = data.state;
    currentNodeId = data.currentNodeId;
    lang = data.lang || 'id';
    return true;
  }

  function hasSave() {
    const d = localStorage.getItem('simpul_save');
    if (!d) return false;
    try { return JSON.parse(d).version >= 5; } catch(e) { return false; }
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
    GAME_TOOLS, ROLE_DESCRIPTIONS,
    get state() { return state; },
    get lang() { return lang; },
    CHARACTERS, MAIN_CHARACTERS, SIDE_CHARACTERS, CHAR_DISPLAY, diffMult
  };
})();
