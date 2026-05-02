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
  // ---- 8 Room Mansion Layout ----
  const LOCATIONS = [
    'aula_utama', 'perpustakaan', 'dapur', 'basement',
    'menara', 'taman_dalam', 'galeri_timur', 'bunker_b3'
  ];

  const LOCATION_NAMES = {
    aula_utama: 'Aula Utama', perpustakaan: 'Perpustakaan',
    dapur: 'Dapur', basement: 'Basement',
    menara: 'Menara', taman_dalam: 'Taman Dalam',
    galeri_timur: 'Galeri Timur', bunker_b3: 'Bunker B-3'
  };

  // Connected locations for movement (8-room compact layout)
  const LOCATION_CONNECTIONS = {
    aula_utama:    ['perpustakaan', 'dapur', 'galeri_timur', 'taman_dalam'],
    perpustakaan:  ['aula_utama', 'menara', 'bunker_b3'],
    dapur:         ['aula_utama', 'basement', 'taman_dalam'],
    basement:      ['dapur', 'bunker_b3'],
    menara:        ['perpustakaan', 'galeri_timur'],
    taman_dalam:   ['aula_utama', 'dapur', 'galeri_timur'],
    galeri_timur:  ['aula_utama', 'menara', 'taman_dalam'],
    bunker_b3:     ['basement', 'perpustakaan']
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
    // Killer-specific actions have longer cooldowns on Easy
    const cooldownMap = {
      observe: 2, investigate: 2, socialize: 2, manipulate: 3,
      plan: 2, guard: 1, hide: 2, flee: 1, question: 2,
      maintain_cover: 3, frame: 3, stalk: 3, trap: 3, sabotage: 3,
      confront: 2, accuse: 3, barricade: 3, sabotage_killer: 3, move: 1,
      coordinate_defense: 3, scout: 2, rally: 3, ambush: 3,
      secure_exit: 3, betray: 3, distract: 3, divide: 4,
      isolate: 4, eliminate: 3, strike: 3, share_clue: 2,
      trust_kill: 4, initiate_vote: 3,
      destroy_clue: 3, search_escape_clue: 2, attack_killer: 2
    };
    let cd = cooldownMap[type] || 1;
    // Killer offensive actions get +1 cooldown on Easy, -1 on Hard
    const killerActions = ['strike', 'eliminate', 'frame', 'divide', 'isolate', 'stalk', 'trap', 'destroy_clue'];
    const isK = mind.actionHistory && killerActions.includes(type);
    if (isK) {
      const diff = (typeof Engine !== 'undefined' && Engine.getDifficulty) ? Engine.getDifficulty() : 2;
      cd += diff === 1 ? 1 : diff === 3 ? -1 : 0;
      cd = Math.max(1, cd);
    }
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
    const pc = gameState.playerCharacter || 'arin';
    const playerLoc = gameState.playerLocation || 'aula_utama';
    const pcProfile = typeof CharDB !== 'undefined' ? CharDB.getProfile(pc) : null;
    const playerHistory = gameState.playerActionHistory || [];
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
      enemies: mind.enemies,
      playerNearby: mind.location === playerLoc,
      playerArchetype: pcProfile && pcProfile.personality ? pcProfile.personality.archetype : 'unknown',
      playerLastAction: playerHistory.length > 0 ? playerHistory[playerHistory.length - 1] : null,
      playerIsAlly: mind.allies.includes(pc),
      playerIsEnemy: mind.enemies.includes(pc),
      playerSusp: mind.suspicions[pc] || 0
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
      if (d.condition.playerNearby !== undefined && d.condition.playerNearby !== ctx.playerNearby) return false;
      if (d.condition.playerLastAction && d.condition.playerLastAction !== ctx.playerLastAction) return false;
      if (d.condition.playerIsAlly !== undefined && d.condition.playerIsAlly !== ctx.playerIsAlly) return false;
      if (d.condition.playerIsEnemy !== undefined && d.condition.playerIsEnemy !== ctx.playerIsEnemy) return false;
      if (d.condition.minPlayerSusp && ctx.playerSusp < d.condition.minPlayerSusp) return false;
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
      if (d.condition.playerNearby !== undefined && d.condition.playerNearby !== ctx.playerNearby) return false;
      if (d.condition.playerLastAction && d.condition.playerLastAction !== ctx.playerLastAction) return false;
      if (d.condition.playerIsAlly !== undefined && d.condition.playerIsAlly !== ctx.playerIsAlly) return false;
      if (d.condition.playerIsEnemy !== undefined && d.condition.playerIsEnemy !== ctx.playerIsEnemy) return false;
      if (d.condition.minPlayerSusp && ctx.playerSusp < d.condition.minPlayerSusp) return false;
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
    // Threshold unified at ≤12 (between old 10/15 split) — requires enemy status
    if (!isAlone && canDo('trust_kill') && deathCount >= 1 && mind.tension >= 50) {
      const distrusted = nearby.find(n => {
        if (gameState.killers.includes(n.name)) return false;
        const tk = trustKeyFor(mind.name, n.name);
        const trust = gameState.trust[tk];
        if (trust === undefined) return false;
        return trust <= 12 && mind.enemies.includes(n.name);
      });
      if (distrusted) {
        candidates.push({ type: 'trust_kill', desc: `${charName(mind.name)} tidak lagi mempercayai ${charName(distrusted.name)}. "Kau salah satunya!" — ${charName(mind.name)} menyerang!`, target: distrusted.name, priority: 93 });
      }
    }

    // Search for escape clues (survivor priority action — scales up with chapter and deaths)
    if (typeof Engine !== 'undefined' && Engine.getEscapeClueAtLocation && canDo('search_escape_clue')) {
      const escClue = Engine.getEscapeClueAtLocation(mind.location);
      if (escClue) {
        const clueBoost = Math.min(10, deathCount * 3 + (gameState.chapter || 0) * 2);
        candidates.push({ type: 'search_escape_clue', desc: `${charName(mind.name)} mencari petunjuk pelarian di ${locName(mind.location)}.`, clueId: escClue.id, priority: 85 + clueBoost });
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
      // NPC initiates voting when high suspicion and enough people nearby
      const voteSuspect = nearby.find(n =>
        (gameState.suspicion[n.name] || 0) >= 60 &&
        nearby.length >= 2
      );
      if (voteSuspect && canDo('initiate_vote') && deathCount >= 1) {
        candidates.push({
          type: 'initiate_vote',
          desc: `${charName(mind.name)} memulai voting untuk eliminasi ${charName(voteSuspect.name)}!`,
          target: voteSuspect.name,
          priority: 85
        });
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

    // Low tension → prioritize movement over passive actions
    if (candidates.length === 0) {
      // Movement first — prevent NPCs from camping (higher probability than before)
      const stationaryCount = mind.actionHistory.filter(a => a === 'observe' || a === 'socialize' || a === 'plan').length;
      const shouldMove = stationaryCount >= 1 || Math.random() < 0.7;
      if (shouldMove) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} bergerak ke ${locName(moveTo)}.`, moveTo, priority: 40 });
        }
      }
      if (candidates.length === 0 && nearby.length > 0 && deathCount === 0 && canDo('socialize')) {
        candidates.push({ type: 'socialize', desc: `${charName(mind.name)} berbicara dengan ${charName(nearby[0].name)}.`, target: nearby[0].name, priority: 35 });
      }
      if (candidates.length === 0 && canDo('observe')) {
        candidates.push({ type: 'observe', desc: `${charName(mind.name)} mengamati sekitar.`, priority: 30 });
      }
      if (candidates.length === 0) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} bergerak ke ${locName(moveTo)}.`, moveTo, priority: 25 });
        }
      }
    }

    return candidates.length > 0 ? candidates[0] : { type: 'move', desc: `${charName(mind.name)} memutuskan bergerak.`, moveTo: pickNewLocation(mind), priority: 10 };
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
        return { type: 'flee', desc: `${charName(mind.name)} melarikan diri — harus bersembunyi sendirian!`, moveTo: moveTo || 'bunker_b3', priority: 98 };
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

    // TERDESAK: Khianati killer lain jika suspicion tinggi (chapter 2+)
    if (gameState.chapter >= 2 && mySusp > 50 && canDo('sabotage_killer')) {
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

    // Destroy escape clue — priority scales up with chapter and clues found by survivors
    if (typeof Engine !== 'undefined' && Engine.getEscapeClueAtLocation && canDo('destroy_clue')) {
      const escClue = Engine.getEscapeClueAtLocation(mind.location);
      if (escClue) {
        const found = (gameState.escapeClues || []).length;
        const chapterBoost = Math.min(8, (gameState.chapter || 0) * 2);
        const urgency = found >= 3 ? 12 : found >= 2 ? 6 : 0;
        candidates.push({ type: 'destroy_clue', desc: `${charName(mind.name)} menghancurkan ${escClue.name} di ${locName(mind.location)}.`, clueId: escClue.id, priority: 72 + chapterBoost + urgency });
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

    // Default: reposition first, maintain cover only if movement on cooldown
    if (candidates.length === 0) {
      const stationaryCount = mind.actionHistory.filter(a => a === 'maintain_cover' || a === 'plan').length;
      if (stationaryCount >= 1 || Math.random() < 0.75) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          candidates.push({ type: 'move', desc: `${charName(mind.name)} berpindah posisi.`, moveTo, priority: 45 });
        }
      }
      if (candidates.length === 0 && canDo('maintain_cover')) {
        candidates.push({ type: 'maintain_cover', desc: `${charName(mind.name)} menunggu momen yang tepat.`, priority: 40 });
      }
    }

    return candidates.length > 0 ? candidates[0] : { type: 'move', desc: `${charName(mind.name)} berpindah mencari posisi baru.`, moveTo: pickNewLocation(mind), priority: 30 };
  }

  // ---- Pick a new location to move to (anti-loop: avoid current location) ----
  // BFS distance between two locations
  function bfsDistance(from, to) {
    if (from === to) return 0;
    const visited = new Set([from]);
    const queue = [[from, 0]];
    while (queue.length > 0) {
      const [loc, dist] = queue.shift();
      const neighbors = LOCATION_CONNECTIONS[loc] || [];
      for (const n of neighbors) {
        if (n === to) return dist + 1;
        if (!visited.has(n)) {
          visited.add(n);
          queue.push([n, dist + 1]);
        }
      }
    }
    return Infinity;
  }

  function pickNewLocation(mind) {
    const connections = LOCATION_CONNECTIONS[mind.location] || [];
    if (connections.length === 0) return null;
    // Avoid locations recently visited (from action history)
    const recentMoves = mind.actionHistory.filter(a => a === 'move').length;
    const lastLoc = mind.location;
    // Prefer locations the mind hasn't been to recently
    const scored = connections.map(loc => {
      let score = Math.random() * 10;
      // Avoid going back to where we just came from
      if (mind.lastAction && mind.lastAction.moveTo === lastLoc) score -= 5;
      return { loc, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].loc;
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

      // Killer pacing: hesitation chance scales with difficulty
      // Easy 30%, Normal 20%, Hard 10% — killers act faster for shorter games
      const isNpcKiller = gameState.killers && gameState.killers.includes(name);
      const diff = gameState.difficulty || 2;
      const hesitationChance = diff === 1 ? 0.30 : diff === 3 ? 0.10 : 0.20;
      if (isNpcKiller && mind.emotion !== 'executing' && Math.random() < hesitationChance) {
        return;
      }

      // Killer tracking: Easy 20%, Normal 30%, Hard 40%
      // Boost tracking when player is camping (staleCampingRounds from engine)
      const isPlayerProtagonist = !(gameState.killers && gameState.killers.includes(pc));
      const campBoost = Math.min(0.30, (gameState.staleCampingRounds || 0) * 0.10);
      const baseTrackChance = diff === 1 ? 0.20 : diff === 3 ? 0.40 : 0.30;
      const trackChance = Math.min(0.80, baseTrackChance + campBoost);
      if (isNpcKiller && isPlayerProtagonist && Math.random() < trackChance) {
        const playerLoc = gameState.playerLocation || 'aula_utama';
        const killerLoc = mind.location;
        if (killerLoc !== playerLoc) {
          // Find path toward player
          const connections = LOCATION_CONNECTIONS[killerLoc] || [];
          // Pick the connected location closest to player (simple BFS step)
          let bestMove = null;
          let bestDist = Infinity;
          connections.forEach(conn => {
            const dist = bfsDistance(conn, playerLoc);
            if (dist < bestDist) { bestDist = dist; bestMove = conn; }
          });
          if (bestMove) {
            mind.target = pc;
            const trackDecision = {
              type: 'track_player',
              desc: `${charName(name)} merasakan keberadaan ${charName(pc)} dan bergerak mendekat...`,
              moveTo: bestMove,
              target: pc,
              priority: 90
            };
            recordAction(mind, trackDecision);
            mind.lastAction = trackDecision;
            actions.push({ character: name, action: trackDecision });
            events.push({
              type: 'track_player',
              character: name,
              desc: `${charName(name)} sedang memburu ${charName(pc)}... langkah kaki terdengar mendekat.`
            });
            return; // Skip normal decision — killer is tracking player
          }
        } else {
          // Killer already at player location — escalate tension
          if (mind.emotion === 'stalking') {
            mind.emotion = 'hunting';
            mind.tension = Math.max(mind.tension, 60);
          }
          events.push({
            type: 'killer_nearby',
            character: name,
            desc: `Kamu merasakan hawa dingin... ${charName(name)} ada di dekatmu.`
          });
        }
      }

      // Track rounds at same location — force move if camping too long
      if (!mind.roundsAtLocation) mind.roundsAtLocation = 0;
      mind.roundsAtLocation++;
      const npcStaleLimit = isNpcKiller ? 2 : 3;
      if (mind.roundsAtLocation >= npcStaleLimit && !mind.lastAction?.moveTo) {
        const moveTo = pickNewLocation(mind);
        if (moveTo) {
          mind.roundsAtLocation = 0;
          const moveDecision = { type: 'move', desc: `${charName(name)} tidak bisa tinggal lebih lama — bergerak ke ${locName(moveTo)}.`, moveTo, priority: 60 };
          recordAction(mind, moveDecision);
          mind.lastAction = moveDecision;
          actions.push({ character: name, action: moveDecision });
          return;
        }
      }

      // Make decision
      const decision = makeDecision(mind, gameState, minds);
      if (!decision) return;

      // Reset location counter on movement
      if (decision.moveTo) mind.roundsAtLocation = 0;

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

    // === PROTAGONIST ALLIANCE CAMPING: When player is killer, NPC survivors band together ===
    // Alliance formation chance scales with difficulty
    const isPlayerKiller = gameState.killers && gameState.killers.includes(pc);
    if (isPlayerKiller) {
      const diff = gameState.difficulty || 2;
      const campChance = diff >= 3 ? 0.45 : diff >= 2 ? 0.40 : 0.35;
      const aliveProtagonists = Object.keys(minds).filter(n =>
        n !== pc && gameState.alive[n] && !gameState.killers.includes(n)
      );
      if (aliveProtagonists.length >= 2 && Math.random() < campChance) {
        // Pick two random protagonists to form alliance
        const shuffled = aliveProtagonists.slice().sort(() => Math.random() - 0.5);
        const a = shuffled[0], b = shuffled[1];
        const mindA = minds[a], mindB = minds[b];
        if (mindA && mindB && !mindA.allies.includes(b)) {
          mindA.allies.push(b);
          mindB.allies.push(a);
          // Move to same location if not already
          if (mindA.location !== mindB.location) {
            mindB.location = mindA.location;
          }
          events.push({
            type: 'alliance',
            character: a,
            desc: `${charName(a)} dan ${charName(b)} membentuk aliansi dan berkumpul di ${locName(mindA.location)} — saling menjaga.`
          });
        }
      }
    }

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

    // === BACKGROUND ACTIVITY: NPCs think, share info, build suspicion autonomously ===
    const bgEvents = simulateBackgroundActivity(gameState, minds, events);
    bgEvents.forEach(e => events.push(e));

    return { actions, events };
  }

  // ---- Background Activity Simulation ----
  // NPCs autonomously share suspicion, gossip, investigate, and build tension
  function simulateBackgroundActivity(gameState, minds, existingEvents) {
    const bgEvents = [];
    const pc = gameState.playerCharacter || 'arin';
    const diff = gameState.difficulty || 2;

    // Group alive NPCs by location
    const locGroups = {};
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name] || name === pc) return;
      const loc = minds[name].location;
      if (!locGroups[loc]) locGroups[loc] = [];
      locGroups[loc].push(name);
    });

    // 1. SUSPICION GOSSIP: NPCs at same location share their suspicions
    Object.entries(locGroups).forEach(([loc, chars]) => {
      if (chars.length < 2) return;
      for (let i = 0; i < chars.length; i++) {
        for (let j = i + 1; j < chars.length; j++) {
          const a = minds[chars[i]], b = minds[chars[j]];
          if (!a || !b) continue;
          // Both are survivors? Share info
          const aIsK = gameState.killers.includes(a.name);
          const bIsK = gameState.killers.includes(b.name);
          if (aIsK && bIsK) continue; // Killers don't gossip with each other about suspects

          // Share suspicions: each NPC influences the other's suspicion map
          Object.keys(a.suspicions).forEach(suspect => {
            if (a.suspicions[suspect] > 30 && suspect !== b.name) {
              const influence = Math.floor(a.suspicions[suspect] * 0.15);
              b.suspicions[suspect] = Math.min(100, (b.suspicions[suspect] || 0) + influence);
            }
          });
          Object.keys(b.suspicions).forEach(suspect => {
            if (b.suspicions[suspect] > 30 && suspect !== a.name) {
              const influence = Math.floor(b.suspicions[suspect] * 0.15);
              a.suspicions[suspect] = Math.min(100, (a.suspicions[suspect] || 0) + influence);
            }
          });

          // 35% chance of producing a gossip event narrative
          if (Math.random() < 0.35) {
            const topSuspectA = Object.entries(a.suspicions).sort((x, y) => y[1] - x[1])[0];
            const topSuspectB = Object.entries(b.suspicions).sort((x, y) => y[1] - x[1])[0];
            if (topSuspectA && topSuspectA[1] > 40) {
              bgEvents.push({
                type: 'gossip',
                character: a.name,
                desc: `${charName(a.name)} berbisik kepada ${charName(b.name)}: "Aku curiga dengan ${charName(topSuspectA[0])}..."`
              });
            } else if (topSuspectB && topSuspectB[1] > 40) {
              bgEvents.push({
                type: 'gossip',
                character: b.name,
                desc: `${charName(b.name)} berbisik kepada ${charName(a.name)}: "Perhatikan ${charName(topSuspectB[0])}, ada yang aneh..."`
              });
            }
          }
        }
      }
    });

    // 2. PASSIVE INVESTIGATION: NPC survivors passively build suspicion on killers nearby
    Object.entries(locGroups).forEach(([loc, chars]) => {
      chars.forEach(name => {
        const mind = minds[name];
        if (!mind || gameState.killers.includes(name)) return;

        // Check if a killer is at the same location
        const killersHere = chars.filter(c => gameState.killers.includes(c));
        killersHere.forEach(killerName => {
          const baseDetect = diff === 1 ? 0.12 : diff === 3 ? 0.25 : 0.18;
          // Clue holders are better at detecting
          const clueBonus = mind.hasClue.length > 0 ? 0.10 : 0;
          if (Math.random() < baseDetect + clueBonus) {
            const suspGain = 8 + Math.floor(Math.random() * 8);
            mind.suspicions[killerName] = Math.min(100, (mind.suspicions[killerName] || 0) + suspGain);
            // Also update global suspicion slightly
            gameState.suspicion[killerName] = Math.min(100, (gameState.suspicion[killerName] || 0) + Math.floor(suspGain * 0.4));

            if (mind.suspicions[killerName] > 50 && Math.random() < 0.4) {
              bgEvents.push({
                type: 'passive_detect',
                character: name,
                desc: `${charName(name)} memperhatikan gerak-gerik ${charName(killerName)} yang mencurigakan...`
              });
            }
          }
        });
      });
    });

    // 3. KILLER ALIBI BUILDING: Killers passively reduce suspicion when near non-enemies
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name] || !gameState.killers.includes(name)) return;
      const mind = minds[name];
      if (mind.killerExposed) return; // Exposed killers can't build alibis

      const nearbyNonEnemies = Object.values(minds).filter(m =>
        m.name !== name && m.location === mind.location &&
        gameState.alive[m.name] && !m.enemies.includes(name)
      );

      if (nearbyNonEnemies.length > 0 && Math.random() < 0.25) {
        const reduction = 3 + Math.floor(Math.random() * 4);
        gameState.suspicion[name] = Math.max(0, (gameState.suspicion[name] || 0) - reduction);
        // Also reduce personal suspicion for nearby NPCs
        nearbyNonEnemies.forEach(m => {
          m.suspicions[name] = Math.max(0, (m.suspicions[name] || 0) - Math.floor(reduction * 0.5));
        });

        if (Math.random() < 0.3) {
          const target = nearbyNonEnemies[Math.floor(Math.random() * nearbyNonEnemies.length)];
          bgEvents.push({
            type: 'alibi_building',
            character: name,
            desc: `${charName(name)} bercakap ramah dengan ${charName(target.name)}, membangun alibi.`
          });
        }
      }
    });

    // 4. MEMORY-BASED SUSPICION BOOST: NPCs who witnessed death spread info over rounds
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name] || name === pc) return;
      const mind = minds[name];
      const deathWitness = mind.memory.filter(m => m.type === 'witnessed_death');
      if (deathWitness.length === 0) return;

      deathWitness.forEach(witness => {
        if (!gameState.alive[witness.killer]) return;
        // Spread suspicion to all NPCs at same location
        const atSameLoc = Object.values(minds).filter(m =>
          m.name !== name && m.name !== witness.killer &&
          m.location === mind.location && gameState.alive[m.name]
        );
        atSameLoc.forEach(m => {
          if ((m.suspicions[witness.killer] || 0) < 80) {
            m.suspicions[witness.killer] = Math.min(100, (m.suspicions[witness.killer] || 0) + 15);
            if (!m.enemies.includes(witness.killer)) m.enemies.push(witness.killer);
          }
        });
        if (atSameLoc.length > 0 && Math.random() < 0.4) {
          bgEvents.push({
            type: 'witness_spread',
            character: name,
            desc: `${charName(name)} menceritakan apa yang dilihatnya: "${charName(witness.killer)} membunuh ${charName(witness.victim)}!" — semua yang mendengar jadi waspada.`
          });
        }
      });
    });

    // 5. TRUST DECAY: Trust between NPCs decays over time based on deaths and danger
    if ((gameState.deathCount || 0) >= 1) {
      const decayChance = Math.min(0.5, 0.1 + (gameState.deathCount || 0) * 0.05);
      Object.keys(minds).forEach(name => {
        if (!gameState.alive[name]) return;
        const mind = minds[name];
        if (Math.random() < decayChance) {
          // Random trust decay with someone at same location
          const nearby = Object.values(minds).filter(m =>
            m.name !== name && m.location === mind.location && gameState.alive[m.name] && !mind.allies.includes(m.name)
          );
          if (nearby.length > 0) {
            const target = nearby[Math.floor(Math.random() * nearby.length)];
            const tk = trustKeyFor(name, target.name);
            if (gameState.trust[tk] !== undefined && gameState.trust[tk] > 20) {
              gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 3);
            }
          }
        }
      });
    }

    // 6. SPONTANEOUS CONFRONTATION: High-suspicion NPC pairs may confront each other
    Object.entries(locGroups).forEach(([loc, chars]) => {
      if (chars.length < 2) return;
      chars.forEach(name => {
        const mind = minds[name];
        if (!mind || gameState.killers.includes(name)) return;

        const suspect = chars.find(c => c !== name && (mind.suspicions[c] || 0) > 55);
        if (suspect && Math.random() < 0.20) {
          const suspLvl = mind.suspicions[suspect] || 0;
          const isCorrect = gameState.killers.includes(suspect);
          if (isCorrect) {
            gameState.suspicion[suspect] = Math.min(100, (gameState.suspicion[suspect] || 0) + 8);
            bgEvents.push({
              type: 'spontaneous_confrontation',
              character: name,
              desc: `${charName(name)} mengonfrontasi ${charName(suspect)}: "Aku lihat gelagatmu — kau tidak bisa bersembunyi!" Suspicion +8%.`
            });
          } else {
            // False confrontation — reduces trust
            const tk = trustKeyFor(name, suspect);
            if (gameState.trust[tk] !== undefined) {
              gameState.trust[tk] = Math.max(0, gameState.trust[tk] - 8);
            }
            bgEvents.push({
              type: 'false_confrontation',
              character: name,
              desc: `${charName(name)} salah curiga ke ${charName(suspect)}. Hubungan mereka memburuk.`
            });
          }
        }
      });
    });

    // 7. KILLER COUNTER-PLAY: Killer NPCs actively try to redirect suspicion
    Object.keys(minds).forEach(name => {
      if (!gameState.alive[name] || !gameState.killers.includes(name)) return;
      const mind = minds[name];
      const mySusp = gameState.suspicion[name] || 0;
      if (mySusp < 30) return; // Only counter-play when they feel heat

      const nearbyNonKillers = Object.values(minds).filter(m =>
        m.name !== name && m.location === mind.location &&
        gameState.alive[m.name] && !gameState.killers.includes(m.name)
      );

      if (nearbyNonKillers.length > 0 && Math.random() < 0.20) {
        const scapegoat = nearbyNonKillers[Math.floor(Math.random() * nearbyNonKillers.length)];
        const redirectAmount = 5 + Math.floor(Math.random() * 5);
        // Subtle redirect — not as strong as a full frame
        gameState.suspicion[scapegoat.name] = Math.min(100, (gameState.suspicion[scapegoat.name] || 0) + redirectAmount);
        gameState.suspicion[name] = Math.max(0, gameState.suspicion[name] - Math.floor(redirectAmount * 0.5));
        // NPCs at same location slightly adjust their suspicions
        nearbyNonKillers.forEach(m => {
          if (m.name !== scapegoat.name) {
            m.suspicions[scapegoat.name] = Math.min(100, (m.suspicions[scapegoat.name] || 0) + Math.floor(redirectAmount * 0.3));
          }
        });

        if (Math.random() < 0.35) {
          bgEvents.push({
            type: 'subtle_redirect',
            character: name,
            desc: `${charName(name)} secara halus mengalihkan perhatian ke ${charName(scapegoat.name)}...`
          });
        }
      }
    });

    // 8. PLAYER-AWARE REACTIONS: NPCs react specifically to the player character's actions/presence
    const playerLoc = gameState.playerLocation || 'aula_utama';
    const playerHistory = gameState.playerActionHistory || [];
    const lastPlayerAction = playerHistory.length > 0 ? playerHistory[playerHistory.length - 1] : null;
    const pcPersonality = typeof CharDB !== 'undefined' ? CharDB.getProfile(pc) : null;
    const pcArchetype = pcPersonality && pcPersonality.personality ? pcPersonality.personality.archetype : 'unknown';

    // NPCs at the same location as the player react to their presence
    const npcsAtPlayerLoc = Object.keys(minds).filter(n =>
      n !== pc && gameState.alive[n] && minds[n] && minds[n].location === playerLoc
    );

    npcsAtPlayerLoc.forEach(name => {
      const mind = minds[name];
      if (!mind) return;
      const isK = gameState.killers.includes(name);
      const npcPersonality = typeof CharDB !== 'undefined' ? CharDB.getProfile(name) : null;
      const archetype = npcPersonality && npcPersonality.personality ? npcPersonality.personality.archetype : 'unknown';
      const tk = trustKeyFor(name, pc);
      const trustLevel = gameState.trust[tk] !== undefined ? gameState.trust[tk] : 50;
      const suspOnPlayer = mind.suspicions[pc] || 0;
      const isAlly = mind.allies.includes(pc);
      const isEnemy = mind.enemies.includes(pc);

      // Player just accused someone — NPCs react
      if (lastPlayerAction === 'accuse' && Math.random() < 0.4) {
        if (isAlly && trustLevel > 60) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} mengangguk setuju dengan tuduhan ${charName(pc)}. "Aku juga merasakan hal yang sama."` });
          mind.tension = Math.max(0, mind.tension - 5);
        } else if (isEnemy || trustLevel < 30) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} menolak tuduhan ${charName(pc)}: "Jangan asal tuduh! Kau sendiri yang mencurigakan!"` });
          mind.suspicions[pc] = Math.min(100, (mind.suspicions[pc] || 0) + 8);
        } else {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} tampak ragu mendengar tuduhan ${charName(pc)}, mempertimbangkan setiap kata.` });
        }
      }

      // Player just investigated — some NPCs become curious or suspicious
      if (lastPlayerAction === 'investigate' && Math.random() < 0.3) {
        if (!isK && trustLevel > 50) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} mengikuti arah pandangan ${charName(pc)}. "Kau menemukan sesuatu? Tunjukkan padaku."` });
          if (!mind.allies.includes(pc)) mind.allies.push(pc);
        } else if (isK && !mind.killerExposed) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} memperhatikan ${charName(pc)} yang sedang menginvestigasi. Matanya berkilat gelisah...` });
          mind.tension += 5;
        }
      }

      // Player moved to this location — NPCs acknowledge
      if (lastPlayerAction === 'move' && Math.random() < 0.25) {
        if (isAlly) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} menyambut ${charName(pc)} dengan anggukan lega. "Syukurlah kau datang."` });
        } else if (isK && !mind.killerExposed) {
          const killerReact = Math.random();
          if (killerReact < 0.4) {
            bgEvents.push({ type: 'player_reaction', character: name,
              desc: `${charName(name)} memasang senyum saat ${charName(pc)} datang, tapi matanya menerawang ke pintu keluar...` });
          }
        } else if (suspOnPlayer > 40) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} menegang saat ${charName(pc)} masuk. Tangannya bergerak ke sesuatu di sakunya.` });
        }
      }

      // Player talked to someone — relationship deepens
      if (lastPlayerAction === 'talk' && Math.random() < 0.3) {
        if (trustLevel > 50 && !isK) {
          const tk2 = trustKeyFor(name, pc);
          if (gameState.trust[tk2] !== undefined) gameState.trust[tk2] = Math.min(100, gameState.trust[tk2] + 3);
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} merasa lebih dekat dengan ${charName(pc)} setelah percakapan. Trust meningkat.` });
        }
      }

      // Player formed alliance — other NPCs react
      if (lastPlayerAction === 'ally' && Math.random() < 0.3) {
        if (!isAlly && !isEnemy) {
          bgEvents.push({ type: 'player_reaction', character: name,
            desc: `${charName(name)} memperhatikan ${charName(pc)} membentuk aliansi. "Aku juga butuh perlindungan..."` });
        }
      }

      // NPC's personality-specific reaction to player archetype
      if (Math.random() < 0.15) {
        if (archetype === 'rebel' && pcArchetype === 'investigator') {
          bgEvents.push({ type: 'personality_clash', character: name,
            desc: `${charName(name)} dan ${charName(pc)} punya cara berbeda. Yang satu aksi, yang lain analisis — tapi mereka saling melengkapi.` });
        } else if (archetype === 'profiler' && pcArchetype === 'investigator') {
          bgEvents.push({ type: 'personality_sync', character: name,
            desc: `${charName(name)} diam-diam menganalisis orang yang sama dengan ${charName(pc)}. Pikiran mereka sejalan.` });
        } else if (archetype === 'puppeteer' && !isK) {
          bgEvents.push({ type: 'personality_dynamic', character: name,
            desc: `${charName(name)} memperhatikan strategi ${charName(pc)} dengan mata tajam. Setiap gerakan dicatat.` });
        } else if (archetype === 'survivor' && (gameState.deathCount || 0) >= 2) {
          bgEvents.push({ type: 'personality_dynamic', character: name,
            desc: `${charName(name)} mengikuti ${charName(pc)} diam-diam. Lebih aman bersama daripada sendirian.` });
        }
      }
    });

    // 9. NPC DRAMA TOWARD PLAYER: NPCs at OTHER locations talk about the player
    const npcsElsewhere = Object.keys(minds).filter(n =>
      n !== pc && gameState.alive[n] && minds[n] && minds[n].location !== playerLoc
    );
    if (npcsElsewhere.length >= 2 && Math.random() < 0.2) {
      const gossiper = npcsElsewhere[Math.floor(Math.random() * npcsElsewhere.length)];
      const gossiperMind = minds[gossiper];
      if (gossiperMind) {
        const suspOnPc = gossiperMind.suspicions[pc] || 0;
        const isAllyPc = gossiperMind.allies.includes(pc);
        if (suspOnPc > 30) {
          bgEvents.push({ type: 'distant_gossip', character: gossiper,
            desc: `Di kejauhan, ${charName(gossiper)} membicarakan ${charName(pc)}: "Apa sebenarnya yang dilakukan ${charName(pc)}? Aku tidak yakin dia bisa dipercaya..."` });
        } else if (isAllyPc) {
          bgEvents.push({ type: 'distant_gossip', character: gossiper,
            desc: `${charName(gossiper)} menyebut ${charName(pc)} di percakapan: "Kita butuh ${charName(pc)} di sini. Dia satu-satunya yang punya rencana."` });
        }
      }
    }

    // 10. PLAYER ACTION INFLUENCE ON NPC GOALS: NPCs adjust behavior based on player's pattern
    if (playerHistory.length >= 3) {
      const recentActions = playerHistory.slice(-5);
      const investigateCount = recentActions.filter(a => a === 'investigate' || a === 'observe').length;
      const aggressiveCount = recentActions.filter(a => a === 'accuse' || a === 'attack_killer' || a === 'vote_eliminate').length;
      const socialCount = recentActions.filter(a => a === 'talk' || a === 'ally').length;

      npcsAtPlayerLoc.forEach(name => {
        const mind = minds[name];
        if (!mind || gameState.killers.includes(name)) return;

        if (investigateCount >= 3 && Math.random() < 0.3) {
          // Player is investigative — NPCs follow suit
          mind.suspicions = mind.suspicions || {};
          gameState.killers.forEach(k => {
            if (gameState.alive[k]) {
              mind.suspicions[k] = Math.min(100, (mind.suspicions[k] || 0) + 3);
            }
          });
          bgEvents.push({ type: 'player_influence', character: name,
            desc: `Terinspirasi oleh investigasi ${charName(pc)}, ${charName(name)} juga mulai memperhatikan detail mencurigakan.` });
        }

        if (aggressiveCount >= 2 && Math.random() < 0.25) {
          // Player is aggressive — NPCs get emboldened or scared
          mind.tension += 5;
          bgEvents.push({ type: 'player_influence', character: name,
            desc: `Keberanian ${charName(pc)} dalam mengonfrontasi suspect menular. ${charName(name)} juga siap bertindak.` });
        }

        if (socialCount >= 3 && Math.random() < 0.3) {
          // Player is social — trust grows faster
          const tk = trustKeyFor(name, pc);
          if (gameState.trust[tk] !== undefined) {
            gameState.trust[tk] = Math.min(100, gameState.trust[tk] + 5);
          }
          bgEvents.push({ type: 'player_influence', character: name,
            desc: `${charName(pc)} yang komunikatif membuat ${charName(name)} lebih terbuka. Kepercayaan bertumbuh.` });
        }
      });
    }

    // Limit background events to prevent spam (max 4 per round, prioritize player-relevant)
    const playerEvents = bgEvents.filter(e => e.type.startsWith('player_') || e.type.includes('personality') || e.type === 'distant_gossip');
    const otherEvents = bgEvents.filter(e => !e.type.startsWith('player_') && !e.type.includes('personality') && e.type !== 'distant_gossip');
    const prioritized = [...playerEvents.slice(0, 2), ...otherEvents.slice(0, 2)];
    return prioritized.length > 0 ? prioritized : bgEvents.slice(0, 3);
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
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 20);
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

        // === PEMBURU PROTECTION: Killer tries to kill pemburu OR kill survivor with pemburu nearby → killer DIES ===
        if (isAttackerKiller && gameState.pemburu && gameState.alive[gameState.pemburu]) {
          const pemburu = gameState.pemburu;
          const pemburuMind = allMinds[pemburu];
          const pemburuHere = pemburuMind && pemburuMind.location === mind.location;
          const targetIsPemburu = action.target === pemburu;

          if (targetIsPemburu || pemburuHere) {
            // Killer dies — pemburu protects
            gameState.alive[mind.name] = false;
            gameState.deathCount++;
            if (!gameState.killersDead) gameState.killersDead = [];
            if (!gameState.killersDead.includes(mind.name)) gameState.killersDead.push(mind.name);
            if (!gameState.killerRevealed.includes(mind.name)) gameState.killerRevealed.push(mind.name);
            // Pemburu revealed on first execution
            if (!gameState.pemburuRevealed) {
              gameState.pemburuRevealed = true;
              // All survivors learn pemburu identity
              Object.values(allMinds).forEach(m => {
                if (gameState.alive[m.name] && m.name !== pemburu) {
                  m.memory.push({ type: 'pemburu_revealed', pemburu: pemburu, round: mind.roundsSurvived });
                }
              });
            }
            const reason = targetIsPemburu
              ? `${charName(mind.name)} mencoba membunuh ${charName(pemburu)}!`
              : `${charName(mind.name)} mencoba membunuh ${charName(action.target)} di hadapan Pemburu!`;
            return { type: 'pemburu_defense', pemburu: pemburu, killer: mind.name, target: action.target,
              desc: `${reason} 🔫 ${charName(pemburu)} mengungkap diri sebagai Pemburu dan menembak ${charName(mind.name)}! ${charName(mind.name)} TEWAS. Identitas Pemburu kini diketahui semua survivor.` };
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
          gameState.suspicion[mind.name] = Math.min(100, (gameState.suspicion[mind.name] || 0) + 22);

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
        // Redirect suspicion to someone else — chance-based, scaled by difficulty
        const aliveNonKillers = Object.keys(allMinds).filter(n =>
          gameState.alive[n] && !gameState.killers.includes(n) && n !== mind.name
        );
        if (aliveNonKillers.length > 0) {
          const framed = aliveNonKillers[Math.floor(Math.random() * aliveNonKillers.length)];
          const frameChance = 0.45 - getKillerPenalty(gameState);
          if (Math.random() < frameChance) {
            // Suspicion increase capped to prevent Pemburu cascade on Easy/Normal
            const diff = gameState.difficulty || 2;
            const suspBase = diff === 1 ? 12 : diff === 3 ? 20 : 15;
            const suspRange = diff === 1 ? 6 : diff === 3 ? 12 : 8;
            const suspIncrease = suspBase + Math.floor(Math.random() * suspRange);
            gameState.suspicion[framed] = Math.min(100, (gameState.suspicion[framed] || 0) + suspIncrease);
            const selfReduction = diff === 1 ? 6 : diff === 3 ? 12 : 8;
            gameState.suspicion[mind.name] = Math.max(0, (gameState.suspicion[mind.name] || 0) - selfReduction);
            // Nearby NPCs: suspicion + trust drop (scaled by difficulty)
            const affectedNpcs = [];
            const npcSuspGain = diff === 1 ? 10 : diff === 3 ? 20 : 14;
            const trustDrop = diff === 1 ? 12 : diff === 3 ? 22 : 16;
            Object.values(allMinds).forEach(m => {
              if (m.name !== mind.name && m.name !== framed && m.location === mind.location && gameState.alive[m.name]) {
                m.suspicions[framed] = Math.min(100, (m.suspicions[framed] || 0) + npcSuspGain);
                const tk = trustKeyFor(m.name, framed);
                if (gameState.trust[tk] !== undefined) {
                  gameState.trust[tk] = Math.max(0, gameState.trust[tk] - trustDrop);
                }
                // Enemy threshold raised: harder to instantly become enemy from one frame
                if ((m.suspicions[framed] || 0) >= 60) {
                  if (!m.enemies.includes(framed)) m.enemies.push(framed);
                  affectedNpcs.push(charName(m.name));
                }
                // Framed keeps some allies on Easy — not total isolation
                if (diff >= 2) {
                  m.allies = m.allies.filter(a => a !== framed);
                }
              }
            });
            // Framed target tension increase scaled
            if (allMinds[framed]) {
              allMinds[framed].tension = Math.min(100, allMinds[framed].tension + (diff === 1 ? 8 : 15));
              if (diff >= 2) {
                allMinds[framed].allies = allMinds[framed].allies.filter(a => a === mind.name || gameState.killers.includes(a));
              }
            }
            const enemyNote = affectedNpcs.length > 0
              ? ` ${affectedNpcs.join(', ')} sekarang MEMUSUHI ${charName(framed)}!`
              : '';
            return { type: 'framed', framer: mind.name, victim: framed,
              desc: `${charName(mind.name)} berhasil mengalihkan kecurigaan! Suspicion ${charName(framed)} +${suspIncrease}%, trust hancur.${enemyNote}` };
          } else {
            // Failed: killer gets suspicion + nearby NPCs notice
            gameState.suspicion[mind.name] = Math.min(100, (gameState.suspicion[mind.name] || 0) + 12);
            Object.values(allMinds).forEach(m => {
              if (m.name !== mind.name && m.location === mind.location && gameState.alive[m.name]) {
                m.suspicions[mind.name] = Math.min(100, (m.suspicions[mind.name] || 0) + 8);
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
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 18);
          return { type: 'accusation', accuser: mind.name, accused: action.target, correct: true,
            desc: `${charName(mind.name)} menuduh ${charName(action.target)}: "Aku tahu apa yang kau lakukan!"` };
        } else {
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 8);
          return { type: 'accusation', accuser: mind.name, accused: action.target, correct: false,
            desc: `${charName(mind.name)} salah menuduh ${charName(action.target)}.` };
        }
      }

      case 'initiate_vote': {
        if (!action.target || !gameState.alive[action.target]) return null;
        const voteResult = conductVoting(action.target, gameState, mind.name);
        const voteLog = Object.entries(voteResult.votes).map(([n, v]) =>
          `${charName(n)}: ${v.vote === 'yes' ? 'SETUJU' : 'TOLAK'}`
        ).join(', ');

        if (voteResult.success) {
          if (voteResult.isActualKiller) {
            gameState.alive[action.target] = false;
            gameState.deathCount++;
            if (!gameState.killersDead) gameState.killersDead = [];
            if (!gameState.killersDead.includes(action.target)) gameState.killersDead.push(action.target);
            if (!gameState.killerRevealed.includes(action.target)) gameState.killerRevealed.push(action.target);
            Object.values(allMinds).forEach(m => {
              if (gameState.alive[m.name] && m.name !== action.target) {
                m.memory.push({ type: 'vote_elimination', target: action.target, round: mind.roundsSurvived });
                m.tension = Math.max(0, m.tension - 10);
              }
            });
            return { type: 'vote_elimination', initiator: mind.name, target: action.target,
              desc: `🗳️ ${charName(mind.name)} memulai voting! ${voteLog}. Hasil: ${voteResult.voteYes}-${voteResult.voteNo}. ${charName(action.target)} TERELIMINASI — terbukti sebagai killer!` };
          } else {
            gameState.alive[action.target] = false;
            gameState.deathCount++;
            gameState.dangerLevel = Math.min(100, (gameState.dangerLevel || 0) + 15);
            Object.values(allMinds).forEach(m => {
              if (gameState.alive[m.name]) m.tension += 20;
            });
            return { type: 'vote_innocent', initiator: mind.name, target: action.target,
              desc: `🗳️ ${charName(mind.name)} memulai voting! ${voteLog}. ${charName(action.target)} dieliminasi tapi... BUKAN killer! Semua orang panik!` };
          }
        } else {
          gameState.suspicion[action.target] = Math.min(100, (gameState.suspicion[action.target] || 0) + 10);
          return { type: 'vote_failed', initiator: mind.name, target: action.target,
            desc: `🗳️ ${charName(mind.name)} memulai voting terhadap ${charName(action.target)}! ${voteLog}. Voting gagal: ${voteResult.voteYes}-${voteResult.voteNo}.` };
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
        const hideLocs = ['bunker_b3', 'basement', 'menara'];
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
          if (trust !== undefined && trust <= 12 && a.enemies.includes(b.name)) {
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

    // Suspicion-based encounter: when NPC meets someone they highly suspect
    if (survivors.length >= 1 && charNames.length >= 2 && gameState.deathCount >= 1) {
      for (const surv of survivors) {
        const survMind = allMinds[surv];
        if (!survMind) continue;
        for (const other of charNames) {
          if (other === surv) continue;
          const suspLevel = survMind.suspicions[other] || 0;
          if (suspLevel > 60 && Math.random() < 0.3) {
            const isActualKiller = gameState.killers.includes(other);
            if (isActualKiller) {
              // Correct suspicion — tension encounter
              gameState.suspicion[other] = Math.min(100, (gameState.suspicion[other] || 0) + 5);
              survMind.tension += 10;
              return { type: 'tense_encounter', character: surv, suspect: other,
                location, desc: `${charName(surv)} dan ${charName(other)} bertatapan di ${locName(location)}. Ketegangan terasa di udara — ${charName(surv)} tidak mempercayai ${charName(other)}.` };
            } else {
              // False suspicion — awkward encounter
              return { type: 'awkward_encounter', character: surv, suspect: other,
                location, desc: `${charName(surv)} menatap ${charName(other)} dengan curiga di ${locName(location)}, tapi ${charName(other)} tampak kebingungan.` };
            }
          }
        }
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

    // 5 clues found (or master key) → all killers revealed & executed
    if (typeof Engine !== 'undefined' && Engine.canEscape && Engine.canEscape()) {
      result.ended = true;
      result.type = 'win';
      result.reason = 'mansion_escape';
      result.title = 'Petunjuk Terkumpul — Killer Terungkap!';
      result.desc = 'Petunjuk pelarian cukup terkumpul! Identitas semua killer terungkap — mereka dieksekusi oleh tim protagonis!';
      return result;
    }

    // Only 1 protagonist remains → killer wins (chapter >= 1 to allow faster resolution)
    if (aliveNonKillers.length <= 1 && gameState.chapter >= 1) {
      result.ended = true;
      result.type = isPlayerK ? 'win' : 'loss';
      result.reason = 'killer_victory';
      result.title = 'Killer Menang';
      result.desc = aliveNonKillers.length === 0
        ? 'Tidak ada protagonis yang tersisa. Tim killer menang.'
        : `Hanya ${charName(aliveNonKillers[0])} yang tersisa. Tim killer menang.`;
      return result;
    }

    // Killer destroyed/hid enough clues that protagonist can't reach 5
    const totalClues = gameState.totalEscapeClues || 8;
    const destroyed = (gameState.destroyedClues || []).length;
    const found = (gameState.escapeClues || []).length;
    const cluesNeeded = gameState.cluesNeededToWin || 5;
    const available = totalClues - destroyed;
    if (available < cluesNeeded && found < cluesNeeded && gameState.chapter >= 1) {
      result.ended = true;
      result.type = isPlayerK ? 'win' : 'loss';
      result.reason = 'killer_clues_destroyed';
      result.title = 'Petunjuk Tidak Cukup';
      result.desc = `Killer menghancurkan terlalu banyak petunjuk. Hanya ${available} tersisa — tidak cukup untuk mengungkap identitas killer.`;
      return result;
    }

    // Dawn reached (chapter 5+) — game ends with current state
    if (gameState.chapter >= 5) {
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
      // Track/nearby events always show (they're about the player)
      if (event.type === 'track_player' || event.type === 'killer_nearby') return true;
      if (event.type === 'hunter_kill') return true;
      if (event.character && isNearPlayer(event.character)) return true;
      if (event.target && isNearPlayer(event.target)) return true;
      if (event.saboteur && isNearPlayer(event.saboteur)) return true;
      if (event.victim && isNearPlayer(event.victim)) return true;
      if (event.hunter && isNearPlayer(event.hunter)) return true;
      if (event.killer && isNearPlayer(event.killer)) return true;
      if (event.location === playerLoc) return true;
      return false;
    };

    // Sort events by priority
    const sorted = roundResult.events.sort((a, b) => {
      const priority = { death: 0, encounter_death: 0, witnessed_murder: 0, trust_kill: 0, killer_eliminated: 0, hunter_kill: 0, witnessed_attack: 1, trust_conflict: 1, killer_sabotage: 1, attack_failed: 1, encounter_escape: 1, clue_destroyed: 1, escape_clue_found: 1, tool_found: 2, accusation: 2, alliance_formed: 3, alliance: 3, framed: 4, manipulation: 4, sabotage: 5, confrontation: 5, clue_found: 6, track_player: 1, killer_nearby: 1 };
      return (priority[a.type] || 10) - (priority[b.type] || 10);
    });

    // ONLY show events involving characters in the SAME ROOM as the player
    const localEvents = sorted.filter(e => isLocalEvent(e));

    if (localEvents.length === 0) return null;

    let narrative = '<div class="npc-round-narrative">';

    localEvents.forEach(event => {
      let icon = '\u26A0\uFE0F';
      if (event.type === 'death' || event.type === 'encounter_death' || event.type === 'witnessed_murder' || event.type === 'trust_kill') icon = '\uD83D\uDC80';
      else if (event.type === 'killer_eliminated') icon = '\u2694\uFE0F';
      else if (event.type === 'attack_failed' || event.type === 'encounter_escape') icon = '\uD83C\uDFC3';
      else if (event.type === 'alliance_formed' || event.type === 'alliance') icon = '\uD83E\uDD1D';
      else if (event.type === 'clue_found' || event.type === 'escape_clue_found') icon = '\uD83D\uDD0D';
      else if (event.type === 'tool_found') icon = '\uD83D\uDEE0\uFE0F';
      else if (event.type === 'framed' || event.type === 'manipulation') icon = '\uD83C\uDFAD';
      else if (event.type === 'killer_sabotage' || event.type === 'sabotage') icon = '\uD83D\uDCA3';
      else if (event.type === 'accusation') icon = '\u261D\uFE0F';
      else if (event.type === 'confrontation') icon = '\u26A1';
      else if (event.type === 'track_player') icon = '\uD83D\uDC63';
      else if (event.type === 'killer_nearby') icon = '\uD83D\uDE28';
      else if (event.type === 'hunter_kill') icon = '\uD83D\uDD2B';

      let cssClass = 'npc-event';
      if (event.type === 'death' || event.type === 'encounter_death') cssClass += ' npc-event-death';
      else if (event.type === 'hunter_kill') cssClass += ' npc-event-hunter';
      else if (event.type === 'attack_failed' || event.type === 'encounter_escape') cssClass += ' npc-event-danger';
      else if (event.type === 'alliance_formed' || event.type === 'alliance') cssClass += ' npc-event-alliance';
      else if (event.type === 'clue_found') cssClass += ' npc-event-clue';
      else if (event.type === 'framed' || event.type === 'manipulation') cssClass += ' npc-event-manipulation';
      else if (event.type === 'killer_sabotage') cssClass += ' npc-event-death';
      else if (event.type === 'tool_found') cssClass += ' npc-event-clue';
      else if (event.type === 'track_player') cssClass += ' npc-event-track';
      else if (event.type === 'killer_nearby') cssClass += ' npc-event-track';

      narrative += `<p class="${cssClass}">${icon} ${event.desc}</p>`;
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
            gameState.suspicion[targetName] = Math.min(100, (gameState.suspicion[targetName] || 0) + 22);
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
      case 'vote_eliminate': {
        // Player initiated a vote — all NPCs at location react
        const targetMindV = gameState.npcMinds[targetName];
        if (targetMindV) {
          targetMindV.tension += 30;
          targetMindV.enemies.push(pc);
        }
        // All nearby NPCs remember this voting event
        Object.keys(gameState.npcMinds).forEach(name => {
          const m = gameState.npcMinds[name];
          if (m && gameState.alive[name] && m.location === (gameState.playerLocation || 'aula_utama')) {
            m.memory.push({ type: 'vote_initiated', initiator: pc, target: targetName, round: m.roundsSurvived });
          }
        });
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
        // PEMBURU PROTECTION: target is pemburu OR pemburu nearby → killer dies
        if (gameState.pemburu && gameState.alive[gameState.pemburu]) {
          const pemburuMind = gameState.npcMinds[gameState.pemburu];
          const playerLoc = gameState.playerLocation || 'aula_utama';
          const pemburuHere = pemburuMind && pemburuMind.location === playerLoc;
          if (targetName === gameState.pemburu || pemburuHere) {
            gameState.alive[pc] = false;
            gameState.deathCount++;
            if (!gameState.pemburuRevealed) gameState.pemburuRevealed = true;
            return { success: false, pemburuKill: true,
              desc: `🔫 ${charName(gameState.pemburu)} mengungkap diri sebagai Pemburu dan menembakmu! Kau TEWAS.` };
          }
        }
        const defense = calculateDefense(targetName, gameState, gameState.npcMinds);
        if (Math.random() < defense) {
          targetMind.suspicions[pc] = 100;
          targetMind.enemies.push(pc);
          gameState.suspicion[pc] = Math.min(100, (gameState.suspicion[pc] || 0) + 25);
          return { success: false, desc: `${charName(targetName)} bertahan dari seranganmu!` };
        }
        gameState.alive[targetName] = false;
        gameState.deathCount++;
        return { success: true, desc: `${charName(targetName)} jatuh. Satu lagi bidak yang tereliminasi.` };
      }
    }
    return null;
  }

  // ---- Voting System: NPC vote logic ----
  function conductVoting(targetName, gameState, initiator) {
    if (!gameState.npcMinds) return { success: false, votes: {} };
    const pc = gameState.playerCharacter || 'arin';
    const playerLoc = gameState.playerLocation || 'aula_utama';

    // Find all alive non-killer NPCs at player location (voters)
    const voters = Object.keys(gameState.npcMinds).filter(name =>
      name !== targetName &&
      name !== pc &&
      gameState.alive[name] &&
      gameState.npcMinds[name] &&
      gameState.npcMinds[name].location === playerLoc
    );

    const votes = {};
    let voteYes = 0;
    let voteNo = 0;

    // Each NPC votes based on suspicion, trust, enemy status, and memory
    voters.forEach(name => {
      const mind = gameState.npcMinds[name];
      if (!mind) return;

      const suspOnTarget = mind.suspicions[targetName] || 0;
      const tk = trustKeyFor(name, targetName);
      const trustLevel = gameState.trust[tk] !== undefined ? gameState.trust[tk] : 50;
      const isEnemy = mind.enemies.includes(targetName);
      const hasClue = mind.hasClue.length > 0;
      const globalSusp = gameState.suspicion[targetName] || 0;
      const witnessedKiller = (gameState.witnessedKillers || []).includes(targetName);
      const revealedKiller = (gameState.killerRevealed || []).includes(targetName);

      // Calculate vote probability
      let voteChance = 25; // Base chance to vote yes
      voteChance += Math.floor(suspOnTarget / 2);  // NPC's personal suspicion
      voteChance += Math.floor(globalSusp / 4);    // Global suspicion
      if (isEnemy) voteChance += 25;
      if (witnessedKiller) voteChance += 40;
      if (revealedKiller) voteChance += 50;
      if (trustLevel < 30) voteChance += 15;
      if (trustLevel > 60) voteChance -= 15;
      if (hasClue) voteChance += 10;
      // Allies of target are less likely to vote yes
      if (mind.allies.includes(targetName)) voteChance -= 30;

      voteChance = Math.max(5, Math.min(95, voteChance));

      const votedYes = Math.random() * 100 < voteChance;
      votes[name] = { vote: votedYes ? 'yes' : 'no', confidence: voteChance };
      if (votedYes) voteYes++;
      else voteNo++;
    });

    // Player vote counts with 50% weight
    // Player always votes yes (they initiated the vote)
    const playerWeight = Math.max(1, Math.ceil((voteYes + voteNo + 1) * 0.5));
    const totalYes = voteYes + playerWeight;
    const totalNo = voteNo;
    const totalVotes = totalYes + totalNo;
    const majority = totalYes > totalNo;

    // Apply 50% chance mechanic: even with majority, there's player influence factor
    let finalResult = majority;
    if (majority) {
      // Player's vote has 50% chance to be decisive
      finalResult = Math.random() < 0.5 ? true : (totalYes > totalNo);
    }

    return {
      success: finalResult,
      votes,
      voteYes: totalYes,
      voteNo: totalNo,
      totalVotes,
      voterCount: voters.length,
      playerWeight,
      isActualKiller: gameState.killers && gameState.killers.includes(targetName)
    };
  }

  // ---- Helpers ----
  function charName(name) {
    const display = { arin: 'Arya', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira',
      reza: 'Reza', lana: 'Lana', dimas: 'Dimas', kira: 'Kai', farah: 'Farah' };
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
    conductVoting,
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
    trustKeyFor,
    pickNewLocation
  };
})();
