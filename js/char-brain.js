/* ============================================================
   SIMPUL TERAKHIR — Character Brain Engine
   Autonomous NPC behavior system with decision trees.
   Each character has their own "mind" — goals, personality,
   emotional state, and decision-making backed by branching logic.
   ============================================================ */

const CharBrain = (() => {
  // ---- Emotional States (State Machine) ----
  const EMOTIONAL_STATES = {
    calm:       { tension: 0,   nextUp: 'wary',      canAct: ['investigate', 'socialize', 'observe', 'plan', 'rest', 'scout'] },
    wary:       { tension: 20,  nextUp: 'suspicious', nextDown: 'calm',    canAct: ['investigate', 'observe', 'guard', 'question', 'plan', 'scout', 'coordinate_defense'] },
    suspicious: { tension: 40,  nextUp: 'panicked',   nextDown: 'wary',    canAct: ['investigate', 'confront', 'accuse', 'search', 'hide', 'ambush', 'rally', 'distract'] },
    panicked:   { tension: 65,  nextUp: 'hostile',    nextDown: 'suspicious', canAct: ['flee', 'hide', 'confront', 'barricade', 'plead', 'secure_exit', 'betray', 'coordinate_defense'] },
    hostile:    { tension: 85,  nextUp: null,          nextDown: 'panicked', canAct: ['attack', 'confront', 'betray', 'sabotage', 'flee', 'ambush', 'rally'] },
    // Killer-only states
    stalking:   { tension: 30,  nextUp: 'hunting',    nextDown: 'calm',    canAct: ['stalk', 'isolate', 'frame', 'manipulate', 'plan'] },
    hunting:    { tension: 60,  nextUp: 'executing',  nextDown: 'stalking', canAct: ['isolate', 'trap', 'sabotage', 'strike', 'frame'] },
    executing:  { tension: 90,  nextUp: null,          nextDown: 'hunting', canAct: ['strike', 'eliminate', 'frame', 'flee', 'coverup'] }
  };

  // ---- Goal Types ----
  const GOAL_TYPES = {
    survive:      { priority: 90, group: 'survivor' },
    escape:       { priority: 85, group: 'survivor' },
    investigate:  { priority: 70, group: 'survivor' },
    protect:      { priority: 75, group: 'survivor' },
    expose_killer:{ priority: 80, group: 'survivor' },
    gather_allies:{ priority: 60, group: 'survivor' },
    hide:         { priority: 65, group: 'survivor' },
    negotiate:    { priority: 55, group: 'survivor' },
    // Killer goals
    eliminate:    { priority: 90, group: 'killer' },
    isolate:      { priority: 75, group: 'killer' },
    frame:        { priority: 70, group: 'killer' },
    maintain_cover:{ priority: 85, group: 'killer' },
    sabotage:     { priority: 65, group: 'killer' },
    divide:       { priority: 60, group: 'killer' },
    // Tactical goals
    coordinate_defense: { priority: 75, group: 'survivor' },
    scout:        { priority: 60, group: 'survivor' },
    rally:        { priority: 70, group: 'survivor' },
    ambush:       { priority: 65, group: 'survivor' },
    secure_exit:  { priority: 72, group: 'survivor' },
    betray:       { priority: 30, group: 'emotional' },
    distract:     { priority: 55, group: 'survivor' },
    // Emotional goals
    confess:      { priority: 40, group: 'emotional' },
    reconcile:    { priority: 45, group: 'emotional' },
    confront:     { priority: 50, group: 'emotional' }
  };

  // ---- Locations in the Mansion ----
  const LOCATIONS = [
    'galeri_timur', 'galeri_barat', 'aula_utama', 'perpustakaan',
    'dapur', 'basement', 'koridor_utara', 'koridor_selatan',
    'taman_dalam', 'menara', 'bunker_b3', 'kamar_atas',
    'ruang_penyimpanan', 'atap', 'lorong_rahasia'
  ];

  const LOCATION_NAMES = {
    galeri_timur: 'Galeri Timur', galeri_barat: 'Galeri Barat',
    aula_utama: 'Aula Utama', perpustakaan: 'Perpustakaan',
    dapur: 'Dapur', basement: 'Basement',
    koridor_utara: 'Koridor Utara', koridor_selatan: 'Koridor Selatan',
    taman_dalam: 'Taman Dalam', menara: 'Menara',
    bunker_b3: 'Bunker B-3', kamar_atas: 'Kamar Atas',
    ruang_penyimpanan: 'Ruang Penyimpanan', atap: 'Atap',
    lorong_rahasia: 'Lorong Rahasia'
  };

  // Connected locations for movement
  const LOCATION_CONNECTIONS = {
    galeri_timur:     ['aula_utama', 'koridor_utara', 'lorong_rahasia'],
    galeri_barat:     ['aula_utama', 'koridor_selatan', 'taman_dalam'],
    aula_utama:       ['galeri_timur', 'galeri_barat', 'perpustakaan', 'dapur', 'koridor_utara', 'koridor_selatan'],
    perpustakaan:     ['aula_utama', 'lorong_rahasia', 'menara'],
    dapur:            ['aula_utama', 'basement', 'taman_dalam'],
    basement:         ['dapur', 'bunker_b3', 'ruang_penyimpanan'],
    koridor_utara:    ['aula_utama', 'galeri_timur', 'kamar_atas', 'menara'],
    koridor_selatan:  ['aula_utama', 'galeri_barat', 'kamar_atas', 'taman_dalam'],
    taman_dalam:      ['galeri_barat', 'dapur', 'koridor_selatan', 'atap'],
    menara:           ['perpustakaan', 'koridor_utara', 'atap'],
    bunker_b3:        ['basement'],
    kamar_atas:       ['koridor_utara', 'koridor_selatan'],
    ruang_penyimpanan:['basement', 'lorong_rahasia'],
    atap:             ['menara', 'taman_dalam'],
    lorong_rahasia:   ['galeri_timur', 'perpustakaan', 'ruang_penyimpanan']
  };

  // ---- NPC Mind State ----
  // Stored per-character in the game state
  function createMind(charName, isKiller) {
    return {
      name: charName,
      emotion: isKiller ? 'stalking' : 'calm',
      tension: 0,
      location: 'aula_utama',
      goals: [],
      memory: [],          // What this character has seen/learned
      suspicions: {},      // Who they suspect and why
      allies: [],          // Who they trust enough to work with
      enemies: [],         // Who they actively oppose
      betrayals: 0,        // Number of betrayals committed
      target: null,        // Current action target (person or location)
      lastAction: null,
      actionHistory: [],     // Track last N actions to prevent looping
      actionCooldowns: {},   // Cooldown per action type: { type: roundsRemaining }
      killerExposed: false,
      hasClue: [],         // Clues this character has found
      isHiding: false,
      isTrapped: false,
      roundsSurvived: 0,
      killCount: 0,
      timesHelped: 0
    };
  }

  // ---- Initialize all NPC minds ----
  function initMinds(gameState) {
    const minds = {};
    const allChars = ['arin', 'niko', 'sera', 'juno', 'vira', 'reza', 'lana', 'dimas', 'kira', 'farah'];
    const pc = gameState.playerCharacter || 'arin';

    allChars.forEach(name => {
      if (name === pc) return; // Player character doesn't need AI
      const isK = gameState.killers && gameState.killers.includes(name);
      minds[name] = createMind(name, isK);
    });

    // Set initial goals based on character personality
    allChars.forEach(name => {
      if (name === pc || !minds[name]) return;
      const db = typeof CharDB !== 'undefined' ? CharDB.getProfile(name) : null;
      if (db) {
        minds[name].goals = db.initialGoals.slice();
      } else {
        const isK = gameState.killers && gameState.killers.includes(name);
        minds[name].goals = isK
          ? [{ type: 'maintain_cover', priority: 85 }, { type: 'isolate', priority: 70 }, { type: 'eliminate', priority: 90 }]
          : [{ type: 'survive', priority: 90 }, { type: 'investigate', priority: 70 }];
      }
    });

    return minds;
  }

  // ---- Evaluate Emotional State Transitions ----
  function updateEmotion(mind, gameState) {
    const st = EMOTIONAL_STATES[mind.emotion];
    if (!st) return;

    // Calculate tension change
    let tensionDelta = 0;
    const dangerLevel = gameState.dangerLevel || 10;
    const deathCount = gameState.deathCount || 0;
    const isK = gameState.killers && gameState.killers.includes(mind.name);

    // Deaths increase tension for survivors
    if (!isK) {
      tensionDelta += deathCount * 12;
      tensionDelta += Math.floor(dangerLevel / 5);
      if (mind.memory.some(m => m.type === 'witnessed_death')) tensionDelta += 25;
      if (mind.memory.some(m => m.type === 'found_clue')) tensionDelta += 5;
      if (mind.allies.length > 0) tensionDelta -= mind.allies.length * 4;
      if (mind.isHiding) tensionDelta -= 10;
    } else {
      // Killers get tense when suspected or exposed
      const suspOnMe = Object.values(gameState.suspicion || {});
      const mySusp = gameState.suspicion ? gameState.suspicion[mind.name] || 0 : 0;
      if (mySusp > 50) tensionDelta += 20;
      if (mind.killerExposed) tensionDelta += 40;
      // Successful kills reduce killer tension
      tensionDelta -= mind.killCount * 10;
    }

    mind.tension = Math.max(0, Math.min(100, mind.tension + tensionDelta));

    // Transition emotional state
    if (isK) {
      if (mind.tension >= 80 && st.nextUp) mind.emotion = st.nextUp;
      else if (mind.tension <= 15 && st.nextDown) mind.emotion = st.nextDown;
    } else {
      if (mind.tension >= EMOTIONAL_STATES[st.nextUp || mind.emotion]?.tension && st.nextUp) {
        mind.emotion = st.nextUp;
      } else if (st.nextDown && mind.tension < st.tension - 10) {
        mind.emotion = st.nextDown;
      }
    }
  }

  // ---- Anti-Looping: check if action type is on cooldown ----
  function isActionOnCooldown(mind, actionType) {
    return (mind.actionCooldowns[actionType] || 0) > 0;
  }

  // ---- Anti-Looping: record action and set cooldown ----
  function recordAction(mind, action) {
    const type = action.type;
    mind.actionHistory.push(type);
    if (mind.actionHistory.length > 5) mind.actionHistory.shift(); // Keep last 5

    // Set cooldown: prevent same action type for 1-3 rounds
    const cooldownMap = {
      observe: 2, investigate: 2, socialize: 2, manipulate: 3,
      plan: 2, guard: 1, hide: 2, flee: 1, question: 2,
      maintain_cover: 3, frame: 3, stalk: 2, trap: 3, sabotage: 3,
      confront: 2, accuse: 3, barricade: 3, sabotage_killer: 3, move: 1,
      coordinate_defense: 3, scout: 2, rally: 3, ambush: 3,
      secure_exit: 3, betray: 3, distract: 3, divide: 3,
      isolate: 3, eliminate: 2, strike: 2, share_clue: 2,
      trust_kill: 4,
      destroy_clue: 3, search_escape_clue: 2, attack_killer: 2
    };
    let cd = cooldownMap[type] || 1;
    // Escalation: reduce cooldowns in chapters 8-10
    const chapter = (typeof Engine !== 'undefined' && Engine.state) ? Engine.state.chapter : 0;
    if (chapter >= 8) cd = Math.max(1, cd - 1);
    mind.actionCooldowns[type] = cd;
  }

  // ---- Anti-Looping: tick cooldowns each round ----
  function tickCooldowns(mind) {
    Object.keys(mind.actionCooldowns).forEach(type => {
      if (mind.actionCooldowns[type] > 0) mind.actionCooldowns[type]--;
    });
  }

  // ---- Anti-Looping: check if action was recently done (last 3 actions) ----
  function wasRecentlyDone(mind, actionType) {
    const recent = mind.actionHistory.slice(-3);
    return recent.includes(actionType);
  }

  // ---- Decision Making ----
  // The core of the brain: given a mind state and game state,
  // choose an action from the behavior database

  function makeDecision(mind, gameState, allMinds) {
    const db = typeof CharDB !== 'undefined' ? CharDB.getProfile(mind.name) : null;
    const isK = gameState.killers && gameState.killers.includes(mind.name);
    const st = EMOTIONAL_STATES[mind.emotion];
    if (!st) return null;

    const possibleActions = st.canAct;
    const pc = gameState.playerCharacter || 'arin';

    // Get character-specific decisions from database (with anti-loop filtering)
    // Use killer-specific tree for killers
    const activeDecisions = (isK && db && db.getActiveDecisions)
      ? db.getActiveDecisions(gameState)
      : (db ? db.decisions : null);

    if (activeDecisions && activeDecisions.length > 0) {
      const contextKey = buildContextKey(mind, gameState, allMinds);
      const decision = matchDecision(activeDecisions, contextKey, mind, gameState);
      if (decision && !isActionOnCooldown(mind, decision.type) && !wasRecentlyDone(mind, decision.type)) {
        return decision;
      }
      // If decision was blocked by cooldown, try a second match excluding that type
      if (decision) {
        const altDecision = matchDecisionExcluding(activeDecisions, contextKey, mind, gameState, decision.type);
        if (altDecision) return altDecision;
      }
    }

    // Fallback: generic decision based on emotional state and goals (with anti-loop)
    return genericDecision(mind, gameState, allMinds, possibleActions, isK);
  }

  function buildContextKey(mind, gameState, allMinds) {
    return {
      emotion: mind.emotion,
      chapter: gameState.chapter,
      dangerLevel: gameState.dangerLevel,
      deathCount: gameState.deathCount,
      aliveCount: Object.values(gameState.alive).filter(Boolean).length,
      location: mind.location,
      isAlone: !Object.values(allMinds).some(m => m !== mind && m.location === mind.location && gameState.alive[m.name]),
      hasClue: mind.hasClue.length > 0,
      isHiding: mind.isHiding,
      nearbyChars: Object.values(allMinds).filter(m => m !== mind && m.location === mind.location && gameState.alive[m.name]).map(m => m.name),
      tension: mind.tension,
      allies: mind.allies,
      enemies: mind.enemies
    };
  }

  function matchDecision(decisions, ctx, mind, gameState) {
    // decisions is an array of { condition, action, weight }
    const matches = decisions.filter(d => {
      if (d.condition.emotion && d.condition.emotion !== ctx.emotion) return false;
      if (d.condition.chapter !== undefined && d.condition.chapter !== ctx.chapter) return false;
      if (d.condition.minDanger && ctx.dangerLevel < d.condition.minDanger) return false;
      if (d.condition.maxDanger && ctx.dangerLevel > d.condition.maxDanger) return false;
      if (d.condition.isAlone !== undefined && d.condition.isAlone !== ctx.isAlone) return false;
      if (d.condition.minTension && ctx.tension < d.condition.minTension) return false;
      if (d.condition.minDeaths && ctx.deathCount < d.condition.minDeaths) return false;
      if (d.condition.hasClue !== undefined && d.condition.hasClue !== ctx.hasClue) return false;
      if (d.condition.location && d.condition.location !== ctx.location) return false;
      if (d.condition.nearbyIncludes && !ctx.nearbyChars.includes(d.condition.nearbyIncludes)) return false;
      if (d.condition.nearbyExcludes && ctx.nearbyChars.includes(d.condition.nearbyExcludes)) return false;
      return true;
    });

    if (matches.length === 0) return null;

    // Weighted random selection
    const totalWeight = matches.reduce((sum, m) => sum + (m.weight || 10), 0);
    let roll = Math.random() * totalWeight;
    for (const m of matches) {
      roll -= (m.weight || 10);
      if (roll <= 0) return m.action;
    }
    return matches[matches.length - 1].action;
  }

  // ---- Match decision excluding a specific action type (anti-loop fallback) ----
  function matchDecisionExcluding(decisions, ctx, mind, gameState, excludeType) {
    const matches = decisions.filter(d => {
      if (d.action && d.action.type === excludeType) return false;
      if (d.condition.emotion && d.condition.emotion !== ctx.emotion) return false;
      if (d.condition.chapter !== undefined && d.condition.chapter !== ctx.chapter) return false;
      if (d.condition.minDanger && ctx.dangerLevel < d.condition.minDanger) return false;
      if (d.condition.maxDanger && ctx.dangerLevel > d.condition.maxDanger) return false;
      if (d.condition.isAlone !== undefined && d.condition.isAlone !== ctx.isAlone) return false;
      if (d.condition.minTension && ctx.tension < d.condition.minTension) return false;
      if (d.condition.minDeaths && ctx.deathCount < d.condition.minDeaths) return false;
      if (d.condition.hasClue !== undefined && d.condition.hasClue !== ctx.hasClue) return false;
      if (d.condition.location && d.condition.location !== ctx.location) return false;
      if (d.condition.nearbyIncludes && !ctx.nearbyChars.includes(d.condition.nearbyIncludes)) return false;
      if (d.condition.nearbyExcludes && ctx.nearbyChars.includes(d.condition.nearbyExcludes)) return false;
      return true;
    });
    if (matches.length === 0) return null;
    const totalWeight = matches.reduce((sum, m) => sum + (m.weight || 10), 0);
    let roll = Math.random() * totalWeight;
    for (const m of matches) {
      roll -= (m.weight || 10);
      if (roll <= 0) return m.action;
    }
    return matches[matches.length - 1].action;
  }

  function genericDecision(mind, gameState, allMinds, possibleActions, isK) {
    const nearby = Object.values(allMinds).filter(m =>
      m !== mind && m.location === mind.location && gameState.alive[m.name]
    );
    const isAlone = nearby.length === 0;

    if (isK) {
      return killerFallback(mind, gameState, allMinds, nearby, isAlone);
    }
    return survivorFallback(mind, gameState, allMinds, nearby, isAlone);
  }

  function survivorFallback(mind, gameState, allMinds, nearby, isAlone) {
    const deathCount = gameState.deathCount || 0;
    const canDo = (type) => !isActionOnCooldown(mind, type) && !wasRecentlyDone(mind, type);

    const candidates = [];

    // Critical danger → tactical defense, secure exits, betray if desperate
    if (mind.tension >= 70) {
      if (!isAlone && canDo('coordinate_defense') && deathCount >= 2) {
        candidates.push({ type: 'coordinate_defense', desc: `${charName(mind.name)} mengorganisir pertahanan kelompok.`, priority: 95 });
      }
      if (canDo('secure_exit') && deathCount >= 2) {
        candidates.push({ type: 'secure_exit', desc: `${charName(mind.name)} mengamankan jalur evakuasi.`, priority: 90 });
      }
      if (nearby.some(n => mind.enemies.includes(n.name)) && canDo('flee')) {
        const flee = fleeTo(mind);
        candidates.push({ type: 'flee', desc: flee.desc, moveTo: flee.moveTo, priority: 92 });
      }
      if (isAlone && canDo('flee')) {
        const flee = fleeTo(mind);
        candidates.push({ type: 'flee', desc: flee.desc, moveTo: flee.moveTo, priority: 85 });
      }
      if (canDo('barricade') && !isAlone) {
        candidates.push({ type: 'barricade', desc: `${charName(mind.name)} memblokir pintu ${locName(mind.location)}.`, priority: 80 });
      }
      if (candidates.length === 0 && canDo('confront') && nearby.length > 0) {
        candidates.push({ type: 'confront', desc: `${charName(mind.name)} berbalik menghadapi ancaman.`, priority: 85 });
      }
      // Desperate betrayal
      if (deathCount >= 4 && canDo('betray') && !isAlone) {
        candidates.push({ type: 'betray', desc: `${charName(mind.name)} mempertimbangkan pengkhianatan demi survival.`, priority: 70 });
      }
    }

    // LOW TRUST KILL: If NPC trusts another NPC very little, may kill them out of distrust
    if (!isAlone && canDo('trust_kill') && deathCount >= 1 && mind.tension >= 50) {
      const distrusted = nearby.find(n => {
        if (gameState.killers.includes(n.name)) return false; // don't trigger trust-kill on actual killers (use attack_killer for that)
        const tk = trustKeyFor(mind.name, n.name);
        const trust = gameState.trust[tk];
        if (trust === undefined) return false;
        return trust <= 15 && mind.enemies.includes(n.name);
      });
      if (distrusted) {
        candidates.push({ type: 'trust_kill', desc: `${charName(mind.name)} tidak lagi mempercayai ${charName(distrusted.name)}. "Kau salah satunya!" — ${charName(mind.name)} menyerang!`, target: distrusted.name, priority: 93 });
      }
    }

    // Search for escape clues (survivor priority action)
    if (typeof Engine !== 'undefined' && Engine.getEscapeClueAtLocation && canDo('search_escape_clue')) {
      const escClue = Engine.getEscapeClueAtLocation(mind.location);
      if (escClue) {
        candidates.push({ type: 'search_escape_clue', desc: `${charName(mind.name)} mencari petunjuk pelarian di ${locName(mind.location)}.`, clueId: escClue.id, priority: 82 });
      }
    }

    // Hunt witnessed/exposed killer (highest priority if witnessed murder)
    if (canDo('attack_killer')) {
      // Priority 1: witnessed killers (seen killing someone)
      const witnessedKiller = nearby.find(n =>
        gameState.killers.includes(n.name) &&
        (gameState.witnessedKillers || []).includes(n.name)
      );
      if (witnessedKiller) {
        candidates.push({ type: 'attack_killer', desc: `${charName(mind.name)} memburu killer ${charName(witnessedKiller.name)} — saksi pembunuhan!`, target: witnessedKiller.name, priority: 96 });
      }
      // Priority 2: revealed/exposed killers
      if (!witnessedKiller) {
        const exposedKiller = nearby.find(n =>
          gameState.killers.includes(n.name) &&
          (gameState.killerRevealed && gameState.killerRevealed.includes(n.name))
        );
        if (exposedKiller) {
          candidates.push({ type: 'attack_killer', desc: `${charName(mind.name)} menyerang killer ${charName(exposedKiller.name)}!`, target: exposedKiller.name, priority: 90 });
        }
      }
    }

    // Move toward witnessed killer if not nearby (hunting behavior)
    if ((gameState.witnessedKillers || []).length > 0 && canDo('move') && candidates.length === 0) {
      const huntTarget = (gameState.witnessedKillers || []).find(k => gameState.alive[k]);
      if (huntTarget && gameState.npcMinds && gameState.npcMinds[huntTarget]) {
        const killerLoc = gameState.npcMinds[huntTarget].location;
        if (killerLoc !== mind.location) {
          const path = LOCATION_CONNECTIONS[mind.location] || [];
          if (path.includes(killerLoc)) {
            candidates.push({ type: 'move', desc: `${charName(mind.name)} memburu ${charName(huntTarget)} ke ${locName(killerLoc)}.`, moveTo: killerLoc, priority: 88 });
          }
        }
      }
    }

    // Mid tension → tactical: scout, ambush, investigate, question
    if (mind.tension >= 35 && candidates.length === 0) {
      if (canDo('scout') && isAlone) {
        candidates.push({ type: 'scout', desc: `${charName(mind.name)} melakukan pengintaian taktis di ${locName(mind.location)}.`, priority: 76 });
      }
      if (canDo('ambush') && deathCount >= 1 && !isAlone) {
        candidates.push({ type: 'ambush', desc: `${charName(mind.name)} menyiapkan penyergapan.`, priority: 74 });
      }
      if (canDo('rally') && !isAlone && deathCount >= 2) {
        candidates.push({ type: 'rally', desc: `${charName(mind.name)} mengumpulkan semua yang tersisa.`, priority: 78 });
      }
      if (mind.hasClue.length > 0 && nearby.length > 0 && canDo('share_clue')) {
        const ally = nearby.find(n => mind.allies.includes(n.name));
        if (ally) {
          candidates.push({ type: 'share_clue', desc: `${charName(mind.name)} membagi bukti dengan ${charName(ally.name)}.`, target: ally.name, priority: 70 });
        }
      }
      if (isAlone && canDo('investigate')) {
        candidates.push({ type: 'investigate', desc: `${charName(mind.name)} memeriksa ${locName(mind.location)}.`, priority: 65 });
      }
      const suspect = nearby.find(n => mind.suspicions[n.name] > 40);
      if (suspect && canDo('question')) {
        candidates.push({ type: 'question', desc: `${charName(mind.name)} mengonfrontasi ${charName(suspect.name)}.`, target: suspect.name, priority: 75 });
      }
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} bergerak ke ${locName(moveTo)}.`, moveTo, priority: 55 });
        }
      }
    }

    // Alliance building
    if (deathCount >= 1 && nearby.length > 0 && candidates.length === 0) {
      const potentialAlly = nearby.find(n => !gameState.killers.includes(n.name) && !mind.allies.includes(n.name) && !mind.enemies.includes(n.name));
      if (potentialAlly && canDo('socialize')) {
        candidates.push({ type: 'socialize', desc: `${charName(mind.name)} mengajak ${charName(potentialAlly.name)} bekerja sama.`, target: potentialAlly.name, priority: 60 });
      }
      const armedAlly = nearby.find(n => mind.allies.includes(n.name) && typeof Engine !== 'undefined' && Engine.getCharTool && Engine.getCharTool(n.name));
      if (armedAlly && canDo('guard')) {
        candidates.push({ type: 'guard', desc: `${charName(mind.name)} dan ${charName(armedAlly.name)} membentuk pertahanan bersama.`, priority: 72 });
      }
    }

    // Low tension → observe, socialize, move
    if (candidates.length === 0) {
      if (nearby.length > 0 && deathCount === 0 && canDo('socialize')) {
        candidates.push({ type: 'socialize', desc: `${charName(mind.name)} berbicara dengan ${charName(nearby[0].name)}.`, target: nearby[0].name, priority: 40 });
      }
      if (canDo('observe')) {
        candidates.push({ type: 'observe', desc: `${charName(mind.name)} mengamati sekitar.`, priority: 30 });
      }
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} bergerak ke ${locName(moveTo)}.`, moveTo, priority: 25 });
        }
      }
    }

    return candidates.length > 0 ? candidates[0] : { type: 'observe', desc: `${charName(mind.name)} berdiri diam, berpikir.`, priority: 10 };
  }

  function killerFallback(mind, gameState, allMinds, nearby, isAlone) {
    const mySusp = gameState.suspicion ? gameState.suspicion[mind.name] || 0 : 0;
    const canDo = (type) => !isActionOnCooldown(mind, type);
    const candidates = [];
    const deathCount = gameState.deathCount || 0;
    const isRevealed = (gameState.killerRevealed || []).includes(mind.name) ||
                       (gameState.witnessedKillers || []).includes(mind.name);
    const nonKillerNearby = nearby.filter(n => !gameState.killers.includes(n.name));

    // === HIGHEST PRIORITY: If revealed and near 2+ survivors → FLEE IMMEDIATELY (will be executed otherwise) ===
    if (isRevealed && nonKillerNearby.length >= 2) {
      const moveTo = pickNewLocation(mind);
      if (moveTo) {
        return { type: 'flee', desc: `${charName(mind.name)} yang terungkap MELARIKAN DIRI — terlalu banyak survivor di sini!`, moveTo, priority: 100 };
      }
    }

    // === REVEALED: Must hide alone or flee (will be hunted) ===
    if (isRevealed) {
      if (!isAlone && canDo('flee')) {
        const moveTo = pickNewLocation(mind);
        return { type: 'flee', desc: `${charName(mind.name)} melarikan diri — harus bersembunyi sendirian!`, moveTo: moveTo || 'lorong_rahasia', priority: 98 };
      }
      // If alone, hide and wait
      if (isAlone && canDo('hide')) {
        candidates.push({ type: 'hide', desc: `${charName(mind.name)} bersembunyi sendirian — satu-satunya cara bertahan setelah terungkap.`, priority: 95 });
      }
      // If alone, try to destroy clues while hiding
      if (isAlone && typeof Engine !== 'undefined' && Engine.getEscapeClueAtLocation && canDo('destroy_clue')) {
        const escClue = Engine.getEscapeClueAtLocation(mind.location);
        if (escClue) {
          candidates.push({ type: 'destroy_clue', desc: `${charName(mind.name)} menghancurkan ${escClue.name} sambil bersembunyi.`, clueId: escClue.id, priority: 90 });
        }
      }
      // Move to isolated location
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) candidates.push({ type: 'move', desc: `${charName(mind.name)} berpindah ke lokasi terpencil.`, moveTo, priority: 85 });
      }
      return candidates.length > 0 ? candidates[0] : { type: 'hide', desc: `${charName(mind.name)} bersembunyi dalam kegelapan.`, priority: 80 };
    }

    // === STRATEGIC: Never attack when 2+ survivors present (will die) ===
    // Killer must focus on ISOLATING targets and SEPARATING groups

    // TERDESAK: Khianati killer lain jika suspicion tinggi (chapter 3+)
    if (gameState.chapter >= 3 && mySusp > 50 && canDo('sabotage_killer')) {
      const rivalKillers = nearby.filter(n => gameState.killers.includes(n.name) && n.name !== mind.name);
      if (rivalKillers.length > 0) {
        const rival = rivalKillers[0];
        candidates.push({ type: 'sabotage_killer', desc: `${charName(mind.name)} mengorbankan ${charName(rival.name)} demi keselamatannya sendiri.`, target: rival.name, priority: 92 });
      }
    }

    // Exposed (high suspicion but not yet revealed) → cover up or flee
    if (mySusp > 60) {
      if (nearby.length > 0 && canDo('frame')) {
        candidates.push({ type: 'frame', desc: `${charName(mind.name)} mengalihkan kecurigaan ke orang lain.`, priority: 85 });
      }
      if (canDo('flee')) {
        candidates.push({ type: 'flee', desc: `${charName(mind.name)} menghilang ke bayangan.`, priority: 80 });
      }
      if (candidates.length === 0 && canDo('maintain_cover')) {
        candidates.push({ type: 'maintain_cover', desc: `${charName(mind.name)} menekan kepanikan, bersikap normal.`, priority: 70 });
      }
    }

    // === CORE STRATEGY: Divide and isolate (memisahkan survivor untuk siasat pembunuhan) ===
    if (nonKillerNearby.length >= 2 && canDo('divide')) {
      candidates.push({ type: 'divide', desc: `${charName(mind.name)} dengan licik memecah kelompok survivor. "Kita harus berpencar mencari clue — lebih efisien."`, priority: 88 });
    }
    if (nonKillerNearby.length >= 2 && canDo('isolate')) {
      const target = nonKillerNearby[Math.floor(Math.random() * nonKillerNearby.length)];
      candidates.push({ type: 'isolate', desc: `${charName(mind.name)} mencoba memisahkan ${charName(target.name)} dari kelompok.`, target: target.name, priority: 85 });
    }
    if (nonKillerNearby.length >= 2 && canDo('manipulate')) {
      candidates.push({ type: 'manipulate', desc: `${charName(mind.name)} menanam ketidakpercayaan antar survivor — memecah belah dari dalam.`, priority: 82 });
    }

    // Destroy escape clue if at a location with one (reduced priority for balance)
    if (typeof Engine !== 'undefined' && Engine.getEscapeClueAtLocation && canDo('destroy_clue')) {
      const escClue = Engine.getEscapeClueAtLocation(mind.location);
      if (escClue) {
        candidates.push({ type: 'destroy_clue', desc: `${charName(mind.name)} menghancurkan ${escClue.name} di ${locName(mind.location)}.`, clueId: escClue.id, priority: 72 });
      }
    }

    // Stalking → find isolated target, position strategically
    if (mind.emotion === 'stalking' && candidates.length === 0) {
      const isolated = Object.values(allMinds).filter(m =>
        m !== mind &&
        gameState.alive[m.name] &&
        !gameState.killers.includes(m.name) &&
        Object.values(allMinds).filter(o => o.location === m.location && o !== m && gameState.alive[o.name]).length === 0
      );
      if (isolated.length > 0 && canDo('stalk')) {
        const target = isolated[Math.floor(Math.random() * isolated.length)];
        candidates.push({ type: 'stalk', desc: `${charName(mind.name)} membuntuti ${charName(target.name)} ke ${locName(target.location)}.`, target: target.name, moveTo: target.location, priority: 80 });
      }
      if (candidates.length === 0 && canDo('plan')) {
        candidates.push({ type: 'plan', desc: `${charName(mind.name)} menyusun strategi berikutnya dalam diam.`, priority: 60 });
      }
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) candidates.push({ type: 'move', desc: `${charName(mind.name)} berpindah posisi.`, moveTo, priority: 55 });
      }
    }

    // Hunting → ONLY strike when alone with 1 target (NEVER with 2+ survivors)
    if (mind.emotion === 'hunting' && candidates.length === 0) {
      if (nonKillerNearby.length === 1 && canDo('strike')) {
        candidates.push({ type: 'strike', desc: `${charName(mind.name)} menyerang ${charName(nonKillerNearby[0].name)}!`, target: nonKillerNearby[0].name, priority: 95 });
      }
      if (isAlone && canDo('trap')) {
        candidates.push({ type: 'trap', desc: `${charName(mind.name)} menyiapkan jebakan di ${locName(mind.location)}.`, priority: 75 });
      }
      if (candidates.length === 0 && canDo('sabotage')) {
        candidates.push({ type: 'sabotage', desc: `${charName(mind.name)} menyabotase ${locName(mind.location)}.`, priority: 60 });
      }
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) candidates.push({ type: 'move', desc: `${charName(mind.name)} mencari target terisolasi.`, moveTo, priority: 50 });
      }
    }

    // Executing → ONLY kill when alone with 1 target
    if (mind.emotion === 'executing' && candidates.length === 0) {
      if (nonKillerNearby.length === 1) {
        candidates.push({ type: 'eliminate', desc: `${charName(mind.name)} mengeksekusi ${charName(nonKillerNearby[0].name)}!`, target: nonKillerNearby[0].name, priority: 100 });
      } else if (nonKillerNearby.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) candidates.push({ type: 'move', desc: `${charName(mind.name)} mencari target.`, moveTo, priority: 50 });
      } else {
        // 2+ survivors — DON'T attack, try to divide instead
        if (canDo('divide')) {
          candidates.push({ type: 'divide', desc: `${charName(mind.name)} mencoba memisahkan kelompok sebelum menyerang.`, priority: 80 });
        } else {
          const moveTo = pickNewLocation(mind);
          if (moveTo) candidates.push({ type: 'move', desc: `${charName(mind.name)} mundur ke posisi lebih strategis.`, moveTo, priority: 50 });
        }
      }
    }

    // Default: maintain cover or reposition (NEVER do protagonist tasks)
    if (candidates.length === 0) {
      if (canDo('maintain_cover')) {
        candidates.push({ type: 'maintain_cover', desc: `${charName(mind.name)} menunggu momen yang tepat.`, priority: 45 });
      } else {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} berpindah posisi.`, moveTo, priority: 40 });
        }
      }
    }

    return candidates.length > 0 ? candidates[0] : { type: 'maintain_cover', desc: `${charName(mind.name)} menunggu dengan sabar.`, priority: 30 };
  }

  // ---- Pick a new location to move to (anti-loop: avoid current location) ----
  function pickNewLocation(mind) {
    const connections = LOCATION_CONNECTIONS[mind.location] || [];
    if (connections.length === 0) return null;
    const shuffled = connections.slice().sort(() => Math.random() - 0.5);
    return shuffled[0];
  }

  function fleeTo(mind) {
    const connections = LOCATION_CONNECTIONS[mind.location] || [];
    const safeLoc = connections[Math.floor(Math.random() * connections.length)] || 'aula_utama';
    const name = charName(mind.name);
    return { desc: `${name} lari ke ${locName(safeLoc)}!`, moveTo: safeLoc };
  }

  // ---- Execute NPC Actions for a Round ----
  function executeRound(gameState) {
    if (!gameState.npcMinds) return { actions: [], events: [] };

    const minds = gameState.npcMinds;
    const actions = [];
    const events = [];
    const pc = gameState.playerCharacter || 'arin';

    // Each alive NPC makes a decision
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name]) return;
      if (name === pc) return;

      const mind = minds[name];
      mind.roundsSurvived++;

      // Tick cooldowns before making new decision
      tickCooldowns(mind);

      // Update emotional state
      updateEmotion(mind, gameState);

      // Make decision
      const decision = makeDecision(mind, gameState, minds);
      if (!decision) return;

      // Record action for anti-looping
      recordAction(mind, decision);
      mind.lastAction = decision;
      actions.push({ character: name, action: decision });

      // NPC tool pickup attempt
      if (typeof Engine !== 'undefined' && Engine.npcPickupTool) {
        const toolResult = Engine.npcPickupTool(name, mind.location);
        if (toolResult) {
          events.push({ type: 'tool_found', character: name, tool: toolResult.tool,
            desc: `${charName(name)} menemukan ${toolResult.tool.icon} ${toolResult.tool.name} di ${locName(mind.location)}!` });
        }
      }

      // Apply consequences with chance%
      const consequence = applyAction(mind, decision, gameState, minds);
      if (consequence) events.push(consequence);
    });

    // Update NPC movements (NPCs that decided to move)
    actions.forEach(a => {
      if (a.action.moveTo && minds[a.character]) {
        minds[a.character].location = a.action.moveTo;
      }
    });

    // Check for NPC encounters (two NPCs in same location)
    const locationGroups = {};
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name]) return;
      const loc = minds[name].location;
      if (!locationGroups[loc]) locationGroups[loc] = [];
      locationGroups[loc].push(name);
    });

    // Generate encounter events
    Object.entries(locationGroups).forEach(([loc, chars]) => {
      if (chars.length >= 2) {
        const encounter = resolveEncounter(chars, loc, gameState, minds);
        if (encounter) events.push(encounter);
      }
    });

    // === HUNT MECHANIC: Revealed killers are hunted by all survivors ===
    // If a revealed/witnessed killer is in the same location as 2+ survivors → EXECUTED
    // If a revealed killer is alone (hiding) → safe for now
    const revealedKillers = [...(gameState.killerRevealed || []), ...(gameState.witnessedKillers || [])];
    const uniqueRevealed = [...new Set(revealedKillers)];
    uniqueRevealed.forEach(killerName => {
      if (!gameState.alive[killerName]) return;
      const killerMind = minds[killerName];
      if (!killerMind) return;
      const loc = killerMind.location;
      const survivorsHere = Object.keys(minds).filter(n =>
        n !== killerName && gameState.alive[n] && !gameState.killers.includes(n) && minds[n].location === loc
      );
      if (survivorsHere.length >= 2) {
        // Killer caught by group — EXECUTED
        gameState.alive[killerName] = false;
        gameState.deathCount++;
        if (!gameState.killersDead) gameState.killersDead = [];
        if (!gameState.killersDead.includes(killerName)) gameState.killersDead.push(killerName);
        const hunterNames = survivorsHere.map(s => charName(s)).join(', ');
        events.push({ type: 'killer_eliminated', killer: killerName, eliminatedBy: survivorsHere,
          desc: `${charName(killerName)} yang sudah terungkap ditemukan oleh ${hunterNames}! Tim survivor mengeksekusi pembunuh — ${charName(killerName)} TERELIMINASI!` });
      }
    });

    return { actions, events };
  }

  // ---- Apply Action Consequences ----
  // Killer action filter: killers cannot perform survivor-helping actions
  const KILLER_BLOCKED_ACTIONS = ['protect', 'share_clue', 'coordinate_defense', 'rally', 'guard', 'rescue', 'secure_exit'];

  function applyAction(mind, action, gameState, allMinds) {
    const isK = gameState.killers && gameState.killers.includes(mind.name);
    if (isK && KILLER_BLOCKED_ACTIONS.includes(action.type)) {
      return null; // Killers cannot help survivors
    }

    switch (action.type) {
      case 'investigate': {
        // Chance to find clue
        const clueChance = 0.25 + (gameState.chapter * 0.05);
        if (Math.random() < clueChance) {
          const clueId = `clue_${mind.location}_${gameState.chapter}`;
          if (!mind.hasClue.includes(clueId)) {
            mind.hasClue.push(clueId);
            mind.memory.push({ type: 'found_clue', clue: clueId, round: mind.roundsSurvived });
            gameState.cluesFound = (gameState.cluesFound || 0) + 1;
            return { type: 'clue_found', character: mind.name, location: mind.location,
              desc: `${charName(mind.name)} menemukan petunjuk di ${locName(mind.location)}!` };
          }
        }
        return null;
      }

      case 'sabotage_killer': {
        // Killer vs killer: sabotage a rival killer's cover
        if (!action.target) return null;
        const rivalMind = allMinds[action.target];
        if (!rivalMind || !gameState.alive[action.target]) return null;
        const sabChance = typeof Engine !== 'undefined' ? Engine.rollChance(45, mind.name, 'offense') : { success: Math.random() < 0.45, chance: 45 };
        if (sabChance.success) {
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 25);
          rivalMind.killerExposed = true;
          if (!gameState.killerRevealed.includes(action.target)) gameState.killerRevealed.push(action.target);
          return { type: 'killer_sabotage', saboteur: mind.name, victim: action.target,
            desc: `${charName(mind.name)} diam-diam membocorkan bukti terhadap ${charName(action.target)}! Identitas killer terungkap!` };
        }
        return { type: 'sabotage_failed', saboteur: mind.name, victim: action.target,
          desc: `${charName(mind.name)} mencoba menjatuhkan ${charName(action.target)}, tapi gagal.` };
      }

      case 'strike':
      case 'eliminate': {
        if (!action.target) return null;
        const targetMind = allMinds[action.target];
        if (!targetMind || !gameState.alive[action.target]) return null;

        // RULE: Killer CANNOT kill if 2+ non-killer survivors are in the same room
        const isAttackerKiller = gameState.killers && gameState.killers.includes(mind.name);
        if (isAttackerKiller) {
          const nonKillerInRoom = Object.values(allMinds).filter(m =>
            m !== mind && m.location === mind.location && gameState.alive[m.name] && !gameState.killers.includes(m.name)
          );
          if (nonKillerInRoom.length >= 2) {
            // Killer outnumbered — survivors fight back, killer DIES
            gameState.alive[mind.name] = false;
            gameState.deathCount++;
            if (!gameState.killersDead) gameState.killersDead = [];
            if (!gameState.killersDead.includes(mind.name)) gameState.killersDead.push(mind.name);
            if (!gameState.killerRevealed.includes(mind.name)) gameState.killerRevealed.push(mind.name);
            const survivorNames = nonKillerInRoom.map(n => charName(n.name)).join(', ');
            return { type: 'killer_eliminated', killer: mind.name, eliminatedBy: nonKillerInRoom.map(n => n.name),
              desc: `${charName(mind.name)} mencoba menyerang di ruangan dengan ${survivorNames}! Tim survivor melawan — ${charName(mind.name)} TERELIMINASI!` };
          }
        }

        // Can the target defend? Tool bonus affects defense
        const defenseChance = calculateDefense(action.target, gameState, allMinds);
        if (Math.random() < defenseChance) {
          // Target survives!
          mind.memory.push({ type: 'failed_kill', target: action.target, round: mind.roundsSurvived });
          if (targetMind) {
            targetMind.memory.push({ type: 'survived_attack', attacker: mind.name, round: mind.roundsSurvived });
            targetMind.suspicions[mind.name] = 100;
            targetMind.enemies.push(mind.name);
          }
          gameState.suspicion[mind.name] = Math.min(100, (gameState.suspicion[mind.name] || 0) + 30);
          return { type: 'attack_failed', attacker: mind.name, target: action.target,
            desc: `${charName(mind.name)} menyerang ${charName(action.target)}, tapi ${charName(action.target)} berhasil bertahan!` };
        }

        // Target dies
        gameState.alive[action.target] = false;
        gameState.deathCount++;
        mind.killCount++;
        mind.memory.push({ type: 'killed', target: action.target, round: mind.roundsSurvived });

        // Witnesses — killer caught killing triggers hunt mechanic
        const witnesses = Object.values(allMinds).filter(m =>
          m !== mind && m.name !== action.target &&
          m.location === mind.location && gameState.alive[m.name]
        );
        if (witnesses.length > 0) {
          // Add to witnessedKillers for active hunting
          if (!gameState.witnessedKillers) gameState.witnessedKillers = [];
          if (!gameState.witnessedKillers.includes(mind.name)) {
            gameState.witnessedKillers.push(mind.name);
          }
          if (!gameState.killerRevealed.includes(mind.name)) {
            gameState.killerRevealed.push(mind.name);
          }
          mind.killerExposed = true;

          witnesses.forEach(w => {
            w.memory.push({ type: 'witnessed_death', victim: action.target, killer: mind.name, round: mind.roundsSurvived });
            w.suspicions[mind.name] = 100;
            w.tension += 30;
            if (!w.enemies.includes(mind.name)) w.enemies.push(mind.name);
            gameState.suspicion[mind.name] = 100;
          });

          // ALL alive survivors become hunters
          Object.values(allMinds).forEach(m => {
            if (gameState.alive[m.name] && !gameState.killers.includes(m.name)) {
              m.suspicions[mind.name] = 100;
              if (!m.enemies.includes(mind.name)) m.enemies.push(mind.name);
            }
          });

          // Killer with witnesses: if 2+ survivors present → killer DIES immediately
          const nonKillerWitnesses = witnesses.filter(w => !gameState.killers.includes(w.name));
          if (nonKillerWitnesses.length >= 2) {
            gameState.alive[mind.name] = false;
            gameState.deathCount++;
            if (!gameState.killersDead) gameState.killersDead = [];
            if (!gameState.killersDead.includes(mind.name)) gameState.killersDead.push(mind.name);
            const hunterNames = nonKillerWitnesses.map(w => charName(w.name)).join(', ');
            return { type: 'death', attacker: mind.name, victim: action.target,
              witnessed: witnesses.map(w => w.name), killerDied: true,
              desc: `${charName(mind.name)} membunuh ${charName(action.target)} di depan ${hunterNames}! Survivor melawan — ${charName(mind.name)} TERELIMINASI!` };
          }

          // Killer must flee — will be hunted
          const fleeDest = pickNewLocation(mind);
          if (fleeDest) mind.location = fleeDest;
          mind.isHiding = true;
          return { type: 'death', attacker: mind.name, victim: action.target,
            witnessed: witnesses.map(w => w.name),
            desc: `${charName(mind.name)} membunuh ${charName(action.target)}! SAKSI: ${witnesses.map(w => charName(w.name)).join(', ')} — ${charName(mind.name)} melarikan diri dan DIBURU semua survivor!` };
        }

        return { type: 'death', attacker: mind.name, victim: action.target,
          witnessed: [],
          desc: `${charName(action.target)} ditemukan tewas di ${locName(mind.location)}...` };
      }

      case 'frame': {
        // Redirect suspicion to someone else — chance-based with REAL consequences
        const aliveNonKillers = Object.keys(allMinds).filter(n =>
          gameState.alive[n] && !gameState.killers.includes(n) && n !== mind.name
        );
        if (aliveNonKillers.length > 0) {
          const framed = aliveNonKillers[Math.floor(Math.random() * aliveNonKillers.length)];
          const frameChance = 0.45 - getKillerPenalty(gameState);
          if (Math.random() < frameChance) {
            // Heavy suspicion increase on framed target
            const suspIncrease = 25 + Math.floor(Math.random() * 15);
            gameState.suspicion[framed] = Math.min(100, (gameState.suspicion[framed] || 0) + suspIncrease);
            gameState.suspicion[mind.name] = Math.max(0, (gameState.suspicion[mind.name] || 0) - 15);
            // Nearby NPCs: suspicion + trust drop + mark as enemy
            const affectedNpcs = [];
            Object.values(allMinds).forEach(m => {
              if (m.name !== mind.name && m.name !== framed && m.location === mind.location && gameState.alive[m.name]) {
                m.suspicions[framed] = Math.min(100, (m.suspicions[framed] || 0) + 25);
                // Trust between NPC and framed target drops hard
                const tk = trustKeyFor(m.name, framed);
                if (gameState.trust[tk] !== undefined) {
                  gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 20);
                }
                // If suspicion is high enough, mark as enemy → may trigger trust_kill later
                if ((m.suspicions[framed] || 0) >= 50) {
                  if (!m.enemies.includes(framed)) m.enemies.push(framed);
                  affectedNpcs.push(charName(m.name));
                }
                // Remove framed from allies
                m.allies = m.allies.filter(a => a !== framed);
              }
            });
            // Framed target also loses trust toward others (confusion/isolation)
            if (allMinds[framed]) {
              allMinds[framed].tension = Math.min(100, allMinds[framed].tension + 15);
              allMinds[framed].allies = allMinds[framed].allies.filter(a => a === mind.name || gameState.killers.includes(a));
            }
            const enemyNote = affectedNpcs.length > 0
              ? ` ${affectedNpcs.join(', ')} sekarang MEMUSUHI ${charName(framed)}!`
              : '';
            return { type: 'framed', framer: mind.name, victim: framed,
              desc: `${charName(mind.name)} berhasil mengalihkan kecurigaan! Suspicion ${charName(framed)} +${suspIncrease}%, trust hancur.${enemyNote}` };
          } else {
            // Failed: killer gets suspicion + nearby NPCs notice
            gameState.suspicion[mind.name] = Math.min(100, (gameState.suspicion[mind.name] || 0) + 15);
            Object.values(allMinds).forEach(m => {
              if (m.name !== mind.name && m.location === mind.location && gameState.alive[m.name]) {
                m.suspicions[mind.name] = Math.min(100, (m.suspicions[mind.name] || 0) + 10);
              }
            });
            return { type: 'frame_failed', framer: mind.name, victim: framed,
              desc: `${charName(mind.name)} mencoba mengalihkan kecurigaan ke ${charName(framed)}, tapi gerak-geriknya justru mencurigakan! Suspicion ${charName(mind.name)} +15%.` };
          }
        }
        return null;
      }

      case 'accuse': {
        if (!action.target) return null;
        const susp = mind.suspicions[action.target] || 0;
        const isCorrect = gameState.killers.includes(action.target);
        if (isCorrect) {
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 25);
          return { type: 'accusation', accuser: mind.name, accused: action.target, correct: true,
            desc: `${charName(mind.name)} menuduh ${charName(action.target)}: "Aku tahu apa yang kau lakukan!"` };
        } else {
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 10);
          return { type: 'accusation', accuser: mind.name, accused: action.target, correct: false,
            desc: `${charName(mind.name)} salah menuduh ${charName(action.target)}.` };
        }
      }

      case 'share_clue': {
        if (!action.target || !allMinds[action.target]) return null;
        const targetM = allMinds[action.target];
        mind.hasClue.forEach(c => {
          if (!targetM.hasClue.includes(c)) targetM.hasClue.push(c);
        });
        if (!mind.allies.includes(action.target)) mind.allies.push(action.target);
        if (!targetM.allies.includes(mind.name)) targetM.allies.push(mind.name);
        return { type: 'alliance_formed', members: [mind.name, action.target],
          desc: `${charName(mind.name)} dan ${charName(action.target)} berbagi informasi dan membentuk aliansi.` };
      }

      case 'hide': {
        mind.isHiding = true;
        const hideLocs = ['lorong_rahasia', 'ruang_penyimpanan', 'kamar_atas'];
        const safeLoc = hideLocs[Math.floor(Math.random() * hideLocs.length)];
        mind.location = safeLoc;
        return null;
      }

      case 'manipulate': {
        // Try to turn allies against each other
        const nearbyMinds = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name]
        );
        if (nearbyMinds.length >= 2) {
          const a = nearbyMinds[0];
          const b = nearbyMinds[1];
          const tk = trustKeyFor(a.name, b.name);
          if (gameState.trust[tk] !== undefined) {
            gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 15);
          }
          return { type: 'manipulation', manipulator: mind.name, targets: [a.name, b.name],
            desc: `${charName(mind.name)} berbisik ke ${charName(a.name)} tentang ${charName(b.name)}, menanamkan benih ketidakpercayaan.` };
        }
        return null;
      }

      case 'sabotage': {
        // Sabotage a location
        const sabotageable = ['dapur', 'perpustakaan', 'galeri_timur', 'basement'];
        if (sabotageable.includes(mind.location)) {
          gameState.dangerLevel = Math.min(100, (gameState.dangerLevel || 10) + 8);
          return { type: 'sabotage', saboteur: mind.name, location: mind.location,
            desc: `Sesuatu di ${locName(mind.location)} telah disabotase...` };
        }
        return null;
      }

      case 'confront': {
        if (!action.target || !allMinds[action.target]) return null;
        const target = allMinds[action.target];
        const tKey = trustKeyFor(mind.name, action.target);
        if (gameState.trust[tKey] !== undefined) {
          gameState.trust[tKey] = Math.max(0, gameState.trust[tKey] - 10);
        }
        target.tension += 10;
        return { type: 'confrontation', aggressor: mind.name, target: action.target,
          desc: `${charName(mind.name)} mengonfrontasi ${charName(action.target)} dengan keras!` };
      }

      case 'barricade': {
        mind.isHiding = true;
        return { type: 'barricade', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} memblokir semua pintu di ${locName(mind.location)}.` };
      }

      case 'guard': {
        return { type: 'guarding', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} berjaga di ${locName(mind.location)}.` };
      }

      case 'coordinate_defense': {
        // Rally nearby allies for coordinated defense
        const nearbyAllies = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name] && !gameState.killers.includes(m.name)
        );
        nearbyAllies.forEach(ally => {
          if (!mind.allies.includes(ally.name)) mind.allies.push(ally.name);
          if (!ally.allies.includes(mind.name)) ally.allies.push(mind.name);
          ally.tension = Math.max(0, ally.tension - 5);
        });
        return { type: 'coordinated_defense', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} mengorganisir pertahanan bersama di ${locName(mind.location)}.` };
      }

      case 'scout': {
        const clueChance = 0.20;
        if (Math.random() < clueChance) {
          const clueId = `scout_${mind.location}_${gameState.chapter}`;
          if (!mind.hasClue.includes(clueId)) {
            mind.hasClue.push(clueId);
            return { type: 'scout_found', character: mind.name, location: mind.location,
              desc: `${charName(mind.name)} menemukan jejak mencurigakan di ${locName(mind.location)}.` };
          }
        }
        return null;
      }

      case 'rally': {
        const nearbyForRally = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name]
        );
        nearbyForRally.forEach(m => {
          m.tension = Math.max(0, m.tension - 10);
          if (!mind.allies.includes(m.name) && !gameState.killers.includes(m.name)) mind.allies.push(m.name);
        });
        return { type: 'rally', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} mengumpulkan semua yang tersisa. "Kita akhiri ini bersama."` };
      }

      case 'ambush': {
        mind.isHiding = false;
        gameState.dangerLevel = Math.min(100, (gameState.dangerLevel || 10) + 5);
        return { type: 'ambush_set', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} menyiapkan penyergapan di ${locName(mind.location)}.` };
      }

      case 'secure_exit': {
        return { type: 'exit_secured', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} mengamankan jalur evakuasi di ${locName(mind.location)}.` };
      }

      case 'betray': {
        // Protagonist betrayal when cornered
        const nearbyVictims = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name] && mind.allies.includes(m.name)
        );
        if (nearbyVictims.length > 0) {
          const victim = nearbyVictims[0];
          mind.allies = mind.allies.filter(a => a !== victim.name);
          victim.allies = victim.allies.filter(a => a !== mind.name);
          victim.enemies.push(mind.name);
          mind.betrayals++;
          return { type: 'betrayal', betrayer: mind.name, victim: victim.name,
            desc: `${charName(mind.name)} meninggalkan ${charName(victim.name)}. Pengkhianatan di saat paling kritis.` };
        }
        return null;
      }

      case 'distract': {
        const nearbyMindsForDistract = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name]
        );
        nearbyMindsForDistract.forEach(m => {
          m.tension += 5;
        });
        return { type: 'distraction', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} membuat distraksi di ${locName(mind.location)}.` };
      }

      case 'divide': {
        // Actually scatter nearby non-killer NPCs to random locations
        const nearbyForDivide = Object.values(allMinds).filter(m =>
          m !== mind && m.location === mind.location && gameState.alive[m.name] && !gameState.killers.includes(m.name)
        );
        const scattered = [];
        nearbyForDivide.forEach(m => {
          if (Math.random() < 0.6) {
            const newLoc = pickNewLocation(m);
            if (newLoc) {
              m.location = newLoc;
              scattered.push(charName(m.name));
            }
          }
        });
        const scatterMsg = scattered.length > 0
          ? ` ${scattered.join(', ')} berpencar ke lokasi berbeda!`
          : ' Tapi tidak ada yang bergerak.';
        return { type: 'group_divided', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} memecah kelompok.${scatterMsg}` };
      }

      case 'destroy_clue': {
        if (!action.clueId || typeof Engine === 'undefined') return null;
        const destroyChance = 0.40 - getKillerPenalty(gameState);
        if (Math.random() < destroyChance) {
          Engine.destroyEscapeClue(action.clueId);
          return { type: 'clue_destroyed', character: mind.name, location: mind.location,
            desc: `${charName(mind.name)} menghancurkan petunjuk pelarian di ${locName(mind.location)}!` };
        }
        return { type: 'destroy_failed', character: mind.name, location: mind.location,
          desc: `${charName(mind.name)} mencoba menghancurkan sesuatu di ${locName(mind.location)}, tapi gagal.` };
      }

      case 'search_escape_clue': {
        if (!action.clueId || typeof Engine === 'undefined') return null;
        const searchChance = 0.45 + (gameState.chapter * 0.05) + getEscalationBonus(gameState) + getProtagonistBonus(gameState);
        if (Math.random() < searchChance) {
          Engine.findEscapeClue(action.clueId);
          gameState.cluesFound = (gameState.cluesFound || 0) + 1;
          return { type: 'escape_clue_found', character: mind.name, location: mind.location,
            desc: `${charName(mind.name)} menemukan petunjuk pelarian di ${locName(mind.location)}!` };
        }
        return null;
      }

      case 'attack_killer': {
        if (!action.target) return null;
        const targetMind = allMinds[action.target];
        if (!targetMind || !gameState.alive[action.target]) return null;
        const atkChance = 0.35 + getEscalationBonus(gameState) + getProtagonistBonus(gameState);
        if (Math.random() < atkChance) {
          gameState.alive[action.target] = false;
          gameState.deathCount++;
          if (!gameState.killersDead) gameState.killersDead = [];
          if (!gameState.killersDead.includes(action.target)) gameState.killersDead.push(action.target);
          mind.killCount = (mind.killCount || 0) + 1;
          return { type: 'killer_eliminated', attacker: mind.name, victim: action.target,
            desc: `${charName(mind.name)} berhasil mengeliminasi killer ${charName(action.target)}!` };
        }
        mind.tension += 15;
        return { type: 'attack_failed', attacker: mind.name, target: action.target,
          desc: `${charName(mind.name)} menyerang ${charName(action.target)} tapi gagal!` };
      }

      case 'trust_kill': {
        if (!action.target) return null;
        const trustTarget = allMinds[action.target];
        if (!trustTarget || !gameState.alive[action.target]) return null;
        const isKillerAttacker = gameState.killers && gameState.killers.includes(mind.name);
        const trustKillChance = 0.40 + getEscalationBonus(gameState) - (isKillerAttacker ? getKillerPenalty(gameState) : 0);
        if (Math.random() < trustKillChance) {
          gameState.alive[action.target] = false;
          gameState.deathCount++;
          mind.killCount = (mind.killCount || 0) + 1;
          // All nearby NPCs lose trust in the attacker
          Object.values(allMinds).filter(m =>
            m !== mind && m.location === mind.location && gameState.alive[m.name]
          ).forEach(witness => {
            const tk = trustKeyFor(mind.name, witness.name);
            if (gameState.trust[tk] !== undefined) {
              gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 30);
            }
            witness.tension = Math.min(100, witness.tension + 25);
          });
          return { type: 'trust_kill', attacker: mind.name, victim: action.target,
            desc: `${charName(mind.name)} menyerang ${charName(action.target)} karena ketidakpercayaan! "${charName(action.target)} pasti salah satu pembunuh!" — tapi ${charName(action.target)} bukan killer. Konflik memecah belah tim protagonis!` };
        }
        // Failed — tension rises, trust drops further
        mind.tension += 20;
        const failTk = trustKeyFor(mind.name, action.target);
        if (gameState.trust[failTk] !== undefined) {
          gameState.trust[failTk] = Math.max(0, gameState.trust[failTk] - 15);
        }
        trustTarget.tension += 20;
        if (!trustTarget.enemies.includes(mind.name)) trustTarget.enemies.push(mind.name);
        return { type: 'trust_conflict', attacker: mind.name, target: action.target,
          desc: `${charName(mind.name)} mencoba menyerang ${charName(action.target)} karena curiga! ${charName(action.target)} berhasil menghindar — tapi kepercayaan hancur!` };
      }

      case 'isolate': {
        // Try to lure one nearby non-killer away from the group
        if (action.target && allMinds[action.target] && gameState.alive[action.target]) {
          const newLoc = pickNewLocation(allMinds[action.target]);
          if (newLoc) {
            allMinds[action.target].location = newLoc;
            return { type: 'isolated', character: mind.name, target: action.target,
              desc: `${charName(mind.name)} berhasil memisahkan ${charName(action.target)} dari kelompok!` };
          }
        }
        return null;
      }

      case 'plan': {
        return null;
      }

      case 'move': {
        // Move to a new location (anti-loop: breaks repetitive actions at same loc)
        const dest = action.moveTo || pickNewLocation(mind);
        if (dest) {
          const oldLoc = mind.location;
          mind.location = dest;
          mind.isHiding = false;
          return { type: 'movement', character: mind.name, from: oldLoc, to: dest,
            desc: `${charName(mind.name)} berpindah dari ${locName(oldLoc)} ke ${locName(dest)}.` };
        }
        return null;
      }

      default:
        return null;
    }
  }

  // ---- Escalation Bonus (chapters 8-10) ----
  function getEscalationBonus(gameState) {
    const ch = gameState.chapter || 0;
    if (ch >= 10) return 0.20;  // +20% kill/search in chapter 10
    if (ch >= 9) return 0.15;   // +15% in chapter 9
    if (ch >= 8) return 0.10;   // +10% in chapter 8
    return 0;
  }

  // ---- Difficulty-Based Protagonist Advantage ----
  // Easy: +15% protagonist advantage, Normal: +10%, Hard: +5%
  // This gives protagonists a fair edge since many situations favor killers
  function getProtagonistBonus(gameState) {
    const diff = gameState.difficulty || 2;
    if (diff === 1) return 0.15;  // Easy: +15%
    if (diff === 2) return 0.10;  // Normal: +10%
    if (diff === 3) return 0.05;  // Hard: +5%
    return 0.10;
  }

  function getKillerPenalty(gameState) {
    const diff = gameState.difficulty || 2;
    if (diff === 1) return 0.15;
    if (diff === 2) return 0.10;
    if (diff === 3) return 0.05;
    return 0.10;
  }

  // ---- Defense Calculation ----
  function calculateDefense(targetName, gameState, allMinds) {
    const isTargetKiller = gameState.killers && gameState.killers.includes(targetName);
    let defense = 0.25; // Base 25% chance to survive (buffed for balance)
    // Escalation: defense decreases in later chapters (harder to survive)
    defense -= getEscalationBonus(gameState) * 0.5;
    defense = Math.max(0.03, defense);

    // Courage adds defense
    const courage = gameState.courage ? gameState.courage[targetName] || 30 : 30;
    defense += courage / 500;

    // Allies nearby add defense
    const targetMind = allMinds[targetName];
    if (targetMind) {
      const nearbyAllies = Object.values(allMinds).filter(m =>
        m.location === targetMind.location &&
        m.name !== targetName &&
        gameState.alive[m.name] &&
        targetMind.allies.includes(m.name)
      );
      defense += nearbyAllies.length * 0.15;

      const guards = Object.values(allMinds).filter(m =>
        m.location === targetMind.location &&
        m.lastAction && m.lastAction.type === 'guard' &&
        gameState.alive[m.name]
      );
      defense += guards.length * 0.25;

      if (targetMind.isHiding) defense += 0.3;
    }

    // Tool defense bonus
    if (typeof Engine !== 'undefined' && Engine.getToolBonus) {
      defense += Engine.getToolBonus(targetName, 'defense') / 100;
    }

    // Difficulty-based protagonist advantage
    if (!isTargetKiller) {
      defense += getProtagonistBonus(gameState);
    } else {
      defense -= getKillerPenalty(gameState);
    }

    return Math.min(0.85, Math.max(0.05, defense));
  }

  // ---- Encounter Resolution ----
  function resolveEncounter(charNames, location, gameState, allMinds) {
    const killers = charNames.filter(n => gameState.killers.includes(n) && gameState.alive[n]);
    const survivors = charNames.filter(n => !gameState.killers.includes(n) && gameState.alive[n]);

    // === RULE: 2+ killers vs 1 survivor → survivor 100% mati ===
    if (killers.length >= 2 && survivors.length === 1 && gameState.chapter >= 2) {
      const victim = survivors[0];
      gameState.alive[victim] = false;
      gameState.deathCount++;
      killers.forEach(k => { if (allMinds[k]) allMinds[k].killCount++; });
      const killerNames = killers.map(k => charName(k)).join(' & ');
      return { type: 'encounter_death', killer: killers[0], victim,
        location, desc: `${charName(victim)} terjebak sendirian bersama ${killerNames} di ${locName(location)}. Tidak ada kesempatan. Tidak ada harapan.` };
    }

    // === RULE: Killer membunuh dengan 2+ survivor hadir → KILLER MATI (survivor melawan) ===
    if (killers.length > 0 && survivors.length >= 2 && gameState.chapter >= 2) {
      const killer = allMinds[killers[0]];
      if (killer && (killer.emotion === 'hunting' || killer.emotion === 'executing')) {
        // Killer is outnumbered — survivors fight back and kill the killer
        gameState.alive[killers[0]] = false;
        gameState.deathCount++;
        if (!gameState.killersDead) gameState.killersDead = [];
        if (!gameState.killersDead.includes(killers[0])) gameState.killersDead.push(killers[0]);
        if (!gameState.killerRevealed.includes(killers[0])) gameState.killerRevealed.push(killers[0]);
        gameState.suspicion[killers[0]] = 100;
        // All survivors know this was a killer
        survivors.forEach(s => {
          if (allMinds[s]) {
            allMinds[s].suspicions[killers[0]] = 100;
            allMinds[s].tension = Math.min(100, allMinds[s].tension + 20);
          }
        });
        const survivorNames = survivors.map(s => charName(s)).join(', ');
        return { type: 'killer_eliminated', killer: killers[0], eliminatedBy: survivors,
          location, desc: `${charName(killers[0])} mencoba menyerang di ruangan dengan ${survivorNames}! Tim survivor melawan — ${charName(killers[0])} TERELIMINASI!` };
      }
    }

    // === RULE: 1 killer + 1 survivor alone → normal kill attempt ===
    if (killers.length > 0 && survivors.length === 1 && gameState.chapter >= 2) {
      const killer = allMinds[killers[0]];
      const victim = survivors[0];
      if (killer && (killer.emotion === 'hunting' || killer.emotion === 'executing')) {
        const defenseChance = calculateDefense(victim, gameState, allMinds);
        if (Math.random() > defenseChance) {
          gameState.alive[victim] = false;
          gameState.deathCount++;
          killer.killCount++;
          return { type: 'encounter_death', killer: killers[0], victim,
            location, desc: `${charName(victim)} bertemu ${charName(killers[0])} sendirian di ${locName(location)}... dan tidak pernah terlihat lagi.` };
        } else {
          // Victim escapes — killer exposed, will be hunted
          if (allMinds[victim]) {
            allMinds[victim].suspicions[killers[0]] = 100;
            if (!allMinds[victim].enemies.includes(killers[0])) allMinds[victim].enemies.push(killers[0]);
          }
          if (!gameState.witnessedKillers) gameState.witnessedKillers = [];
          if (!gameState.witnessedKillers.includes(killers[0])) {
            gameState.witnessedKillers.push(killers[0]);
          }
          gameState.suspicion[killers[0]] = 100;
          if (!gameState.killerRevealed.includes(killers[0])) {
            gameState.killerRevealed.push(killers[0]);
          }
          // Mark killer as hunted — all alive survivors become hunters
          Object.values(allMinds).forEach(m => {
            if (gameState.alive[m.name] && !gameState.killers.includes(m.name)) {
              m.suspicions[killers[0]] = 100;
              if (!m.enemies.includes(killers[0])) m.enemies.push(killers[0]);
            }
          });
          return { type: 'encounter_escape', attacker: killers[0], escapee: victim,
            location, desc: `${charName(victim)} nyaris mati di ${locName(location)}, tapi berhasil melarikan diri! ${charName(killers[0])} terungkap — DIBURU oleh semua survivor!` };
        }
      }
    }

    // Trust-kill encounter: two survivors with very low trust may fight
    if (killers.length === 0 && survivors.length >= 2 && gameState.deathCount >= 2) {
      for (let i = 0; i < survivors.length; i++) {
        for (let j = i + 1; j < survivors.length; j++) {
          const a = allMinds[survivors[i]];
          const b = allMinds[survivors[j]];
          if (!a || !b) continue;
          const tk = trustKeyFor(a.name, b.name);
          const trust = gameState.trust[tk];
          if (trust !== undefined && trust <= 10 && a.enemies.includes(b.name)) {
            if (Math.random() < 0.25) {
              const attacker = a.tension >= b.tension ? a : b;
              const victim = attacker === a ? b : a;
              const atkChance = 0.35;
              if (Math.random() < atkChance) {
                gameState.alive[victim.name] = false;
                gameState.deathCount++;
                attacker.killCount = (attacker.killCount || 0) + 1;
                return { type: 'trust_kill', attacker: attacker.name, victim: victim.name,
                  location, desc: `${charName(attacker.name)} menyerang ${charName(victim.name)} di ${locName(location)}! "AKU TIDAK PERCAYA KAU!" — konflik internal memecah belah tim protagonis!` };
              } else {
                attacker.tension += 15;
                victim.tension += 15;
                if (!victim.enemies.includes(attacker.name)) victim.enemies.push(attacker.name);
                return { type: 'trust_conflict', attacker: attacker.name, target: victim.name,
                  location, desc: `${charName(attacker.name)} dan ${charName(victim.name)} nyaris saling membunuh di ${locName(location)}! Ketidakpercayaan memecah belah kelompok!` };
              }
            }
          }
        }
      }
    }

    // Two survivors form alliance
    if (killers.length === 0 && survivors.length === 2 && gameState.deathCount > 0) {
      const a = allMinds[survivors[0]];
      const b = allMinds[survivors[1]];
      if (a && b && !a.allies.includes(b.name) && Math.random() < 0.3) {
        a.allies.push(b.name);
        b.allies.push(a.name);
        const tk = trustKeyFor(a.name, b.name);
        if (gameState.trust[tk] !== undefined) {
          gameState.trust[tk] = Math.min(100, gameState.trust[tk] + 10);
        }
        return { type: 'alliance', members: [a.name, b.name],
          desc: `${charName(a.name)} dan ${charName(b.name)} sepakat bekerja sama di ${locName(location)}.` };
      }
    }

    return null;
  }

  // ---- Win/Loss Condition Checking ----
  function checkWinLoss(gameState) {
    const pc = gameState.playerCharacter || 'arin';
    const isPlayerK = gameState.killers && gameState.killers.includes(pc);
    const playerAlive = gameState.alive[pc];
    const result = { ended: false, type: null, reason: null };

    const allKillersDead = gameState.killers.every(k => !gameState.alive[k]);
    const aliveNonKillers = Object.keys(gameState.alive).filter(k =>
      gameState.alive[k] && !gameState.killers.includes(k)
    );

    // Player dead → game ends, auto-simulation will determine winner
    if (!playerAlive) {
      result.ended = true;
      result.type = 'loss';
      result.reason = 'player_eliminated';
      result.title = 'Kau Tereliminasi';
      result.desc = 'Kau jatuh. Tapi permainan belum selesai — NPC melanjutkan pertarungan...';
      return result;
    }

    // All killers eliminated → protagonist wins
    if (allKillersDead) {
      result.ended = true;
      result.type = 'win';
      result.reason = 'all_killers_eliminated';
      result.title = 'Semua Killer Tereliminasi';
      result.desc = 'Semua killer telah dieliminasi! Tim protagonis menang.';
      return result;
    }

    // 8 clues found → all killers revealed & executed
    if (typeof Engine !== 'undefined' && Engine.canEscape && Engine.canEscape()) {
      result.ended = true;
      result.type = 'win';
      result.reason = 'mansion_escape';
      result.title = 'Petunjuk Terkumpul — Killer Terungkap!';
      result.desc = '8 petunjuk ditemukan! Identitas semua killer terungkap — mereka dieksekusi oleh tim protagonis!';
      return result;
    }

    // Only 1 protagonist remains → killer wins
    if (aliveNonKillers.length <= 1 && gameState.chapter >= 2) {
      result.ended = true;
      result.type = isPlayerK ? 'win' : 'loss';
      result.reason = 'killer_victory';
      result.title = 'Killer Menang';
      result.desc = aliveNonKillers.length === 0
        ? 'Tidak ada protagonis yang tersisa. Tim killer menang.'
        : `Hanya ${charName(aliveNonKillers[0])} yang tersisa. Tim killer menang.`;
      return result;
    }

    // Killer destroyed/hid enough clues that protagonist can't reach 8
    const totalClues = gameState.totalEscapeClues || 15;
    const destroyed = (gameState.destroyedClues || []).length;
    const found = (gameState.escapeClues || []).length;
    const cluesNeeded = gameState.cluesNeededToWin || 8;
    const available = totalClues - destroyed;
    if (available < cluesNeeded && found < cluesNeeded && gameState.chapter >= 3) {
      result.ended = true;
      result.type = isPlayerK ? 'win' : 'loss';
      result.reason = 'killer_clues_destroyed';
      result.title = 'Petunjuk Tidak Cukup';
      result.desc = `Killer menghancurkan terlalu banyak petunjuk. Hanya ${available} tersisa — tidak cukup untuk mengungkap identitas killer.`;
      return result;
    }

    // Dawn reached (chapter 10+) — game ends with current state
    if (gameState.chapter >= 10) {
      result.ended = true;
      result.type = allKillersDead ? 'win' : 'partial_win';
      result.reason = 'dawn_reached';
      result.title = 'Fajar Tiba';
      result.desc = 'Malam berakhir. Fajar menyingsing di atas mansion Wardhana.';
      return result;
    }

    return result;
  }

  // ---- Generate NPC Action Narrative ----
  // Creates story text for what NPCs did this round
  function generateNarrative(roundResult, gameState) {
    if (!roundResult || !roundResult.events || roundResult.events.length === 0) {
      return null;
    }

    const playerLoc = gameState.playerLocation || 'aula_utama';
    const pc = gameState.playerCharacter || 'arin';
    const minds = gameState.npcMinds || {};

    // Determine which characters are at the player's location
    const isNearPlayer = (charName) => {
      if (charName === pc) return true;
      const m = minds[charName];
      return m && m.location === playerLoc;
    };

    // Check if an event involves a character near the player
    const isLocalEvent = (event) => {
      if (event.character && isNearPlayer(event.character)) return true;
      if (event.target && isNearPlayer(event.target)) return true;
      if (event.saboteur && isNearPlayer(event.saboteur)) return true;
      if (event.victim && isNearPlayer(event.victim)) return true;
      if (event.location === playerLoc) return true;
      return false;
    };

    // Sort events by priority
    const sorted = roundResult.events.sort((a, b) => {
      const priority = { death: 0, encounter_death: 0, witnessed_murder: 0, trust_kill: 0, killer_eliminated: 0, witnessed_attack: 1, trust_conflict: 1, killer_sabotage: 1, attack_failed: 1, encounter_escape: 1, clue_destroyed: 1, escape_clue_found: 1, tool_found: 2, accusation: 2, alliance_formed: 3, alliance: 3, framed: 4, manipulation: 4, sabotage: 5, confrontation: 5, clue_found: 6 };
      return (priority[a.type] || 10) - (priority[b.type] || 10);
    });

    // ONLY show events involving characters in the SAME ROOM as the player
    const localEvents = sorted.filter(e => isLocalEvent(e));

    if (localEvents.length === 0) return null;

    let narrative = '<div class="npc-round-narrative">';

    localEvents.forEach(event => {
      let cssClass = 'npc-event';
      if (event.type === 'death' || event.type === 'encounter_death') cssClass += ' npc-event-death';
      else if (event.type === 'attack_failed' || event.type === 'encounter_escape') cssClass += ' npc-event-danger';
      else if (event.type === 'alliance_formed' || event.type === 'alliance') cssClass += ' npc-event-alliance';
      else if (event.type === 'clue_found') cssClass += ' npc-event-clue';
      else if (event.type === 'framed' || event.type === 'manipulation') cssClass += ' npc-event-manipulation';
      else if (event.type === 'killer_sabotage') cssClass += ' npc-event-death';
      else if (event.type === 'tool_found') cssClass += ' npc-event-clue';

      narrative += `<p class="${cssClass}">${event.desc}</p>`;
    });

    narrative += '</div>';
    return narrative;
  }

  // ---- Action Log for Player Review ----
  function getActionLog(gameState) {
    if (!gameState.npcMinds) return [];
    const log = [];
    Object.keys(gameState.npcMinds).forEach(name => {
      if (!gameState.alive[name]) return;
      const mind = gameState.npcMinds[name];
      log.push({
        name,
        displayName: charName(name),
        emotion: mind.emotion,
        location: locName(mind.location),
        locationKey: mind.location,
        lastAction: mind.lastAction ? mind.lastAction.desc : 'Tidak ada aksi',
        tension: mind.tension,
        allies: mind.allies.map(a => charName(a)),
        clueCount: mind.hasClue.length,
        isHiding: mind.isHiding,
        roundsSurvived: mind.roundsSurvived
      });
    });
    return log;
  }

  // ---- Player Actions that affect NPC minds ----
  function playerAction(actionType, targetName, gameState) {
    if (!gameState.npcMinds) return;
    const pc = gameState.playerCharacter || 'arin';

    switch (actionType) {
      case 'accuse': {
        const targetMind = gameState.npcMinds[targetName];
        if (targetMind) {
          targetMind.tension += 20;
          targetMind.enemies.push(pc);
          if (gameState.killers.includes(targetName)) {
            gameState.suspicion[targetName] = Math.min(100, (gameState.suspicion[targetName] || 0) + 30);
          }
        }
        break;
      }
      case 'ally': {
        const targetMind = gameState.npcMinds[targetName];
        if (targetMind) {
          if (!targetMind.allies.includes(pc)) targetMind.allies.push(pc);
          targetMind.tension -= 5;
        }
        break;
      }
      case 'intimidate': {
        const targetMind = gameState.npcMinds[targetName];
        if (targetMind) {
          targetMind.tension += 15;
          const tk = trustKeyFor(pc, targetName);
          if (gameState.trust[tk] !== undefined) {
            gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 10);
          }
        }
        break;
      }
      case 'investigate_location': {
        // Player finds clue
        const clueChance = 0.35;
        if (Math.random() < clueChance) {
          gameState.cluesFound = (gameState.cluesFound || 0) + 1;
          return { found: true, desc: 'Kau menemukan petunjuk baru!' };
        }
        return { found: false, desc: 'Tidak ada yang menarik di sini.' };
      }
      case 'killer_strike': {
        if (!gameState.killers.includes(pc)) return { success: false };
        const targetMind = gameState.npcMinds[targetName];
        if (!targetMind || !gameState.alive[targetName]) return { success: false };
        const defense = calculateDefense(targetName, gameState, gameState.npcMinds);
        if (Math.random() < defense) {
          targetMind.suspicions[pc] = 100;
          targetMind.enemies.push(pc);
          gameState.suspicion[pc] = Math.min(100, (gameState.suspicion[pc] || 0) + 35);
          return { success: false, desc: `${charName(targetName)} bertahan dari seranganmu!` };
        }
        gameState.alive[targetName] = false;
        gameState.deathCount++;
        return { success: true, desc: `${charName(targetName)} jatuh. Satu lagi bidak yang tereliminasi.` };
      }
    }
    return null;
  }

  // ---- Helpers ----
  function charName(name) {
    const display = { arin: 'Arin', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira',
      reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kira', farah: 'Farah' };
    return display[name] || name;
  }

  function locName(loc) {
    return LOCATION_NAMES[loc] || loc;
  }

  function trustKeyFor(a, b) {
    const sorted = [a, b].sort();
    return sorted[0] + '_' + sorted[1];
  }

  // ---- Public API ----
  return {
    initMinds,
    executeRound,
    checkWinLoss,
    generateNarrative,
    getActionLog,
    playerAction,
    updateEmotion,
    makeDecision,
    createMind,
    LOCATIONS,
    LOCATION_NAMES,
    LOCATION_CONNECTIONS,
    EMOTIONAL_STATES,
    GOAL_TYPES,
    charName,
    locName,
    trustKeyFor
  };
})();
