/* ============================================================
   SIMPUL TERAKHIR — Game Engine
   5 sahabat, 2 egois, 25 ending, 3 difficulty
   ============================================================ */

const Engine = (() => {
  let lang = 'id';
  let state = {};
  let storyNodes = {};
  let currentNodeId = null;
  let typingTimeout = null;
  let endingsUnlocked = JSON.parse(localStorage.getItem('simpul_endings') || '{}');

  const CHARACTERS = ['arin', 'niko', 'sera', 'juno', 'vira'];
  const CHAR_DISPLAY = { arin: 'Arin', niko: 'Niko', sera: 'Sera', juno: 'Juno', vira: 'Vira' };

  function defaultState(difficulty) {
    return {
      chapter: 0,
      difficulty: difficulty || 2,
      nodeHistory: [],
      alive: { arin: true, niko: true, sera: true, juno: true, vira: true },
      corruption: { arin: 0, niko: 15, sera: 0, juno: 5, vira: 40 },
      courage: { arin: 50, niko: 70, sera: 30, juno: 45, vira: 60 },
      awareness: { arin: 10, niko: 5, sera: 25, juno: 15, vira: 0 },
      trust: {
        arin_niko: 65, arin_sera: 70, arin_juno: 60, arin_vira: 55,
        niko_sera: 45, niko_juno: 55, niko_vira: 70,
        sera_juno: 65, sera_vira: 35,
        juno_vira: 30
      },
      flags: {},
      items: [],
      entityPower: 20,
      moralScore: 0,
      keyChoices: [],
      deathCount: 0,
      secretsFound: 0
    };
  }

  // ---- Difficulty multiplier ----
  function diffMult() {
    if (!state.difficulty) return 1;
    return [0.6, 1, 1.6][state.difficulty - 1] || 1;
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
    const adjusted = Math.round(delta * (state.difficulty === 3 ? 0.6 : state.difficulty === 1 ? 1.4 : 1));
    state.awareness[char] = Math.max(0, Math.min(100, (state.awareness[char] || 0) + adjusted));
  }

  // ---- Entity power ----
  function modEntity(delta) {
    const adjusted = Math.round(delta * diffMult());
    state.entityPower = Math.max(0, Math.min(100, state.entityPower + adjusted));
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
    if (state.difficulty === 1 && state.deathCount >= 1 && state.chapter < 3) return false;
    return true;
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
    const symbol = delta > 0 ? '▲' : '▼';
    div.textContent = `${aName} & ${bName} ${symbol}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
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
  function updateEntityAmbient() {
    let el = document.querySelector('.entity-ambient');
    if (state.entityPower > 30) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'entity-ambient';
        document.body.appendChild(el);
      }
      el.style.opacity = Math.min(1, (state.entityPower - 30) / 70);
    } else if (el) {
      el.remove();
    }
  }

  // ---- Text Rendering ----
  function renderText(html, container, callback) {
    if (typingTimeout) { clearTimeout(typingTimeout); typingTimeout = null; }
    container.innerHTML = html;
    if (callback) callback();
  }

  // ---- Node Rendering ----
  function renderNode(nodeId) {
    const node = storyNodes[nodeId];
    if (!node) { console.error('Node not found:', nodeId); return; }
    currentNodeId = nodeId;
    state.nodeHistory.push(nodeId);
    if (node.onEnter) node.onEnter(state);
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
    updateEntityAmbient();

    const textContent = typeof node.text === 'function' ? node.text(state) : t(node.text);
    const storyText = $('story-text');
    const choicesContainer = $('choices-container');

    renderText(textContent, storyText, () => {
      $('story-area').scrollTop = 0;
      if (node.isEnding) {
        setTimeout(() => triggerEnding(node), 1500);
        choicesContainer.innerHTML = '';
        return;
      }
      renderChoices(node.choices || []);
    });
  }

  function renderChoices(choices) {
    const container = $('choices-container');
    container.innerHTML = '';

    const available = choices.filter(c => {
      if (c.condition && !c.condition(state)) return false;
      if (c.minDifficulty && state.difficulty < c.minDifficulty) return false;
      if (c.maxDifficulty && state.difficulty > c.maxDifficulty) return false;
      return true;
    });

    if (available.length === 0 && choices.length === 0) return;

    available.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (choice.type) btn.classList.add('choice-' + choice.type);

      let html = t(choice.text);
      if (choice.hint && state.difficulty <= 2) {
        html += `<span class="choice-hint">${t(choice.hint)}</span>`;
      }
      if (choice.danger && state.difficulty === 1) {
        html += `<span class="choice-danger">⚠ Berbahaya</span>`;
      }
      btn.innerHTML = html;

      btn.addEventListener('click', () => {
        if (choice.effect) choice.effect(state);
        if (choice.key) state.keyChoices.push(choice.key);
        const next = typeof choice.next === 'function' ? choice.next(state) : choice.next;
        if (next) renderNode(next);
      });

      btn.style.animationDelay = (i * 0.12) + 's';
      container.appendChild(btn);
    });
  }

  const CHAPTERS = {
    id: ['Prolog', 'Bab 1: Kabut Pertama', 'Bab 2: Retakan', 'Bab 3: Kebenaran', 'Bab 4: Simpul Terakhir'],
    en: ['Prologue', 'Chapter 1: First Mist', 'Chapter 2: Fractures', 'Chapter 3: The Truth', 'Chapter 4: The Last Knot']
  };
  function updateChapterIndicator() {
    $('chapter-indicator').textContent = (CHAPTERS[lang] || CHAPTERS.id)[state.chapter] || '';
  }

  function updateCharPanel() {
    const container = $('character-list');
    container.innerHTML = '';
    CHARACTERS.forEach(name => {
      const div = document.createElement('div');
      div.className = 'char-card';
      const displayName = CHAR_DISPLAY[name];
      const alive = state.alive[name];
      const corr = state.corruption[name];
      const statusClass = !alive ? 'dead' : corr > 60 ? 'corrupted' : '';
      const statusLabel = !alive ? 'Tewas' : corr > 60 ? 'Terpengaruh' : 'Hidup';

      let relHtml = '';
      CHARACTERS.forEach(other => {
        if (other === name) return;
        const tr = getTrust(name, other);
        const otherDisplay = CHAR_DISPLAY[other];
        const color = tr > 60 ? 'trust' : tr < 40 ? 'fear' : 'neutral';
        relHtml += `<div class="char-rel">${otherDisplay}: ${tr}%<div class="char-rel-bar"><div class="char-rel-fill ${color}" style="width:${tr}%"></div></div></div>`;
      });

      const awarenessBar = name === 'arin' ? `<div class="char-awareness">Kewaspadaan: ${state.awareness.arin}%<div class="char-rel-bar"><div class="char-rel-fill awareness" style="width:${state.awareness.arin}%"></div></div></div>` : '';

      div.innerHTML = `
        <div class="char-name speaker ${name}">${displayName}</div>
        <div class="char-status ${statusClass}">${statusLabel}</div>
        ${awarenessBar}
        ${alive ? relHtml : ''}
      `;
      container.appendChild(div);
    });

    // Entity power indicator
    if (state.awareness.arin > 30) {
      const entityDiv = document.createElement('div');
      entityDiv.className = 'char-card entity-card';
      entityDiv.innerHTML = `
        <div class="char-name speaker entity">??? Entitas</div>
        <div class="char-rel">Kekuatan: ${state.entityPower}%<div class="char-rel-bar"><div class="char-rel-fill entity-bar" style="width:${state.entityPower}%"></div></div></div>
      `;
      container.appendChild(entityDiv);
    }
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
      const corrupted = state.corruption[name] > 60;
      let fateText = '';
      if (endingInfo.fates && endingInfo.fates[name]) {
        fateText = t(endingInfo.fates[name]);
      } else if (!alive) {
        fateText = 'Tidak selamat';
      } else if (corrupted) {
        fateText = 'Terpengaruh entitas';
      } else {
        fateText = 'Selamat';
      }
      return { name: displayName, alive, corrupted, text: fateText };
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
      const cls = !f.alive ? 'fate-dead' : f.corrupted ? 'fate-corrupted' : 'fate-alive';
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
        item.innerHTML = `<div class="gi-number">#${i}</div><div class="gi-locked">🔒</div>`;
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
    const saveData = { state, currentNodeId, lang, version: 2 };
    localStorage.setItem('simpul_save', JSON.stringify(saveData));
    notify('Game tersimpan');
  }

  function loadGame() {
    const data = JSON.parse(localStorage.getItem('simpul_save'));
    if (!data || data.version < 2) { notify('Tidak ada save'); return false; }
    state = data.state;
    currentNodeId = data.currentNodeId;
    lang = data.lang || 'id';
    return true;
  }

  function hasSave() {
    const d = localStorage.getItem('simpul_save');
    if (!d) return false;
    try { return JSON.parse(d).version >= 2; } catch(e) { return false; }
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

    // Difficulty selection
    $('btn-new-game').addEventListener('click', () => {
      showScreen('screen-difficulty');
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = parseInt(btn.dataset.diff);
        state = defaultState(diff);
        currentNodeId = null;
        showScreen('screen-game');
        updateChapterIndicator();
        initParticles();
        renderNode('prologue_start');
      });
    });

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
    $('btn-close-menu').addEventListener('click', () => togglePanel('panel-menu'));
    $('btn-close-status').addEventListener('click', () => togglePanel('panel-status'));
    $('overlay').addEventListener('click', () => {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
      $('overlay').classList.remove('active');
    });

    $('btn-save').addEventListener('click', () => { saveGame(); togglePanel('panel-menu'); });
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
    init, t, getTrust, modTrust, modAwareness, modEntity, killChar, canDie,
    screenShake, bloodDrip, glitch, deathFlash, showChapterTitle, notify, showDirectEnding, renderNode,
    get state() { return state; },
    get lang() { return lang; },
    CHARACTERS, CHAR_DISPLAY, diffMult
  };
})();
