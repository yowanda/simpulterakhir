/* ============================================================
   SIMPUL TERAKHIR — Internationalization (i18n) System
   Full language swap: ID ↔ EN
   ============================================================ */

const I18N = (() => {
  let subtitlesEnabled = false;

  function isEnabled() { return subtitlesEnabled; }
  function toggle() {
    subtitlesEnabled = !subtitlesEnabled;
    const btn = document.getElementById('btn-lang-toggle');
    if (btn) btn.textContent = subtitlesEnabled ? '🇮🇩 ID' : '🇬🇧 EN';
    document.body.classList.toggle('subs-on', subtitlesEnabled);
    swapStaticText();
    return subtitlesEnabled;
  }
  function setEnabled(v) {
    subtitlesEnabled = !!v;
    const btn = document.getElementById('btn-lang-toggle');
    if (btn) btn.textContent = subtitlesEnabled ? '🇮🇩 ID' : '🇬🇧 EN';
    document.body.classList.toggle('subs-on', subtitlesEnabled);
    swapStaticText();
  }

  // Swap all static text between ID and EN
  function swapStaticText() {
    const targets = [
      '#title-subtitle', '#title-tagline',
      '#btn-new-game', '#btn-continue',
      '#btn-how-to-play', '#btn-char-profiles',
      '#btn-skip-chars', '#btn-rules-back',
      '.credits',
      '.diff-heading', '.diff-subheading',
      '.diff-label', '.diff-desc',
      '.role-select-heading', '.role-select-subheading',
      '.char-intro-heading', '.char-intro-subheading',
      '.rules-title', '.rules-intro',
      '.rules-section h3',
      '.rules-section li',
      '.rules-action-item',
      '.wa-encrypted-notice',
      '#panel-status-title',
      '#btn-play-again', '#btn-title-screen', '#btn-endings-back',
      '#btn-save', '#btn-load', '#btn-back-to-title',
    ];

    targets.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Save original HTML on first encounter
        if (!el.dataset.origHtml) el.dataset.origHtml = el.innerHTML;

        if (subtitlesEnabled) {
          // Replace with English
          const replaced = replaceHtmlContent(el.dataset.origHtml);
          if (replaced !== el.dataset.origHtml) el.innerHTML = replaced;
        } else {
          // Restore original Indonesian
          el.innerHTML = el.dataset.origHtml;
        }
      });
    });
  }

  // Replace text content in HTML string, preserving tags
  function replaceHtmlContent(html) {
    // Try full innerHTML match first (for elements with HTML content like <strong>)
    const plainFull = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (UI[plainFull]) return UI[plainFull];
    if (UI[html.trim()]) return UI[html.trim()];

    // Replace individual text segments
    let result = html;
    const allTranslations = Object.assign({}, UI, DICT, ENDING_TITLES, CHAR_PROFILES);
    // Sort by key length desc to match longer phrases first
    const sorted = Object.entries(allTranslations).sort((a, b) => b[0].length - a[0].length);
    for (const [id, en] of sorted) {
      if (result.includes(id)) {
        result = result.split(id).join(en);
      }
    }
    return result;
  }

  // ---- UI Text Translations ----
  const UI = {
    // Title Screen
    'Sepuluh Tamu. Satu Mansion. Siapa Sang Penenun?': 'Ten Guests. One Mansion. Who is the Weaver?',
    '28 ending compact • 3 pilihan fokus • 25 ronde • setiap keputusan menentukan': '28 compact endings • 3 focus choices • 25 rounds • every decision matters',
    'Permainan Baru': 'New Game',
    'Lanjutkan': 'Continue',
    'Cara Bermain': 'How to Play',
    'Karakter': 'Characters',
    'Psychological horror thriller • 6 chapter • 28 ending compact • 3 pilihan fokus • max 25 ronde': 'Psychological horror thriller • 6 chapters • 28 compact endings • 3 focus choices • max 25 rounds',

    // How to Play
    '📖 Cara Bermain': '📖 How to Play',
    'Kamu terjebak di mansion bersama 9 orang lainnya. Salah satu (atau lebih) adalah pembunuh. Selamatkan dirimu sebelum fajar. Game dibatasi <strong>25 ronde</strong> — setiap ronde kamu dapat <strong>3 pilihan fokus</strong> (killer: 2) yang langsung menentukan nasibmu.': 'You are trapped in a mansion with 9 others. One (or more) is a killer. Survive until dawn. Game is limited to <strong>25 rounds</strong> — each round you get <strong>3 focus choices</strong> (killer: 2) that directly determine your fate.',

    // Game Objectives
    '🎮 Tujuan Permainan': '🎮 Game Objectives',
    'Sebagai Survivor:': 'As Survivor:',
    'Bertahan hidup, kumpulkan petunjuk, ungkap identitas killer': 'Stay alive, collect clues, expose the killer\'s identity',
    'Sebagai Killer:': 'As Killer:',
    'Eliminasi survivor tanpa ketahuan': 'Eliminate survivors without being caught',
    'Kumpulkan <strong>5 dari 8 petunjuk</strong> untuk mengungkap semua killer sekaligus': 'Collect <strong>5 of 8 clues</strong> to expose all killers at once',
    'Atau temukan <strong>Kunci Master</strong> (5% chance muncul saat investigasi) — langsung menyelesaikan misi petunjuk!': 'Or find the <strong>Master Key</strong> (5% chance during investigation) — instantly completes the clue mission!',

    // Actions
    '🎮 Aksi': '🎮 Actions',
    'Investigasi': 'Investigate',
    'cari petunjuk': 'search for clues',
    'Pindah': 'Move',
    'pindah ruangan': 'change room',
    'Sosial': 'Social',
    'bicara, aliansi': 'talk, form alliances',
    'Konfrontasi': 'Confront',
    'hadapi suspect': 'face the suspect',
    'Tuduh': 'Accuse',
    'voting eliminasi': 'vote to eliminate',
    'Lindungi': 'Protect',
    'jaga seseorang': 'guard someone',
    'Amati': 'Observe',
    'intai sekitar': 'watch surroundings',
    'Kabur': 'Flee',
    'lari dari bahaya': 'run from danger',

    // Win/Lose
    '⚖️ Menang & Kalah': '⚖️ Win & Lose',
    'Protagonis Menang:': 'Protagonist Wins:',
    'Eliminasi semua killer / kumpulkan 5/8 petunjuk / temukan Kunci Master': 'Eliminate all killers / collect 5/8 clues / find Master Key',
    'Killer Menang:': 'Killer Wins:',
    'Eliminasi protagonis sampai tersisa 1 / hancurkan cukup petunjuk': 'Eliminate protagonists until 1 remains / destroy enough clues',
    'Fajar / Max 25 ronde:': 'Dawn / Max 25 rounds:',
    'Game berakhir dengan kondisi saat itu': 'Game ends with current conditions',
    'Auto-Simulasi:': 'Auto-Simulation:',
    'Jika kamu mati, NPC lanjutkan permainan sampai ada pemenang': 'If you die, NPCs continue the game until there is a winner',

    // Combat Rules
    '💀 Aturan Pertarungan': '💀 Combat Rules',
    'Killer hanya bisa bunuh target SENDIRIAN': 'Killer can only kill a target who is ALONE',
    'ada 2+ orang = target aman': '2+ people present = target is safe',
    '2+ survivor vs killer': '2+ survivors vs killer',
    'killer yang menyerang MATI': 'attacking killer DIES',
    'Saksi pembunuhan': 'Murder witness',
    'killer terungkap DIBURU & DIEKSEKUSI jika ditemukan 2+ survivor': 'killer exposed, HUNTED & EXECUTED if found by 2+ survivors',
    'Pemburu': 'Hunter',
    'jika killer gagal membunuh, seorang survivor jadi Pemburu dan menembak killer': 'if killer fails to kill, a survivor becomes Hunter and shoots the killer',
    'Trust-Kill': 'Trust-Kill',
    'trust sangat rendah + musuh = bisa saling menyerang': 'very low trust + enemy = can attack each other',

    // 28 Endings
    '🏆 28 Ending Dinamis': '🏆 28 Dynamic Endings',
    'Semua killer mati + banyak selamat': 'All killers dead + many survivors',
    'ending S/A-rank': 'S/A-rank ending',
    'Killer menang': 'Killer wins',
    'ending D/F-rank': 'D/F-rank ending',
    'Player mati tapi teman selamat': 'Player dies but friends survive',
    'ending pengorbanan (A/B-rank)': 'sacrifice ending (A/B-rank)',
    'Trust runtuh / petunjuk hancur': 'Trust collapses / clues destroyed',
    'ending paranoia / tanpa jalan keluar': 'paranoia ending / no way out',
    'Karakter spesifik hidup/mati': 'Specific characters alive/dead',
    'ending unik per karakter': 'unique ending per character',
    'Rating S → F. Semakin banyak survivor selamat + petunjuk lengkap + moral baik = rating lebih tinggi.': 'Rating S → F. More survivors alive + complete clues + good morals = higher rating.',

    // Tips
    '⚠️ Tips': '⚠️ Tips',
    'Jangan sendirian': 'Don\'t be alone',
    'killer hanya bisa bunuh jika kamu sendiri di ruangan': 'killer can only kill if you\'re alone in the room',
    'Jangan diam terlalu lama': 'Don\'t stay idle too long',
    '2 ronde diam = bahaya naik drastis, dipaksa pindah': '2 rounds idle = danger rises dramatically, forced to move',
    'Setelah clue ditemukan/hancur': 'After clue found/destroyed',
    'semua NPC di lokasi pindah otomatis': 'all NPCs at location move automatically',
    'Chapter auto-advance': 'Chapter auto-advance',
    'setiap 6 ronde, chapter naik. Game max 25 ronde': 'every 6 rounds, chapter advances. Game max 25 rounds',
    'NPC mandiri': 'Autonomous NPCs',
    'bergerak, aliansi, serang, kabur sendiri setiap ronde': 'move, form alliances, attack, flee on their own each round',
    'Moral & Trust': 'Moral & Trust',
    'pilihan etis + trust antar karakter menentukan ending': 'ethical choices + trust between characters determine ending',

    // Menu items
    'Simpan': 'Save',
    'Muat': 'Load',
    'Kembali ke Judul': 'Return to Title',
    '← Kembali': '← Back',
    'Main Lagi': 'Play Again',
    'Layar Judul': 'Title Screen',
    'Galeri Ending': 'Ending Gallery',

    // Difficulty
    'Pilih Tingkat Kesulitan': 'Choose Difficulty',
    'Kesulitan mempengaruhi kompleksitas cerita dan konsekuensi pilihan': 'Difficulty affects story complexity and choice consequences',
    'Mudah': 'Easy',
    '1 killer. Petunjuk lebih banyak. Lebih mudah selamat.': '1 killer. More clues. Easier to survive.',
    'Normal': 'Normal',
    '2 killers. Konspirasi lebih dalam. Siapa yang bisa dipercaya?': '2 killers. Deeper conspiracy. Who can you trust?',
    'Sulit': 'Hard',
    '3 killers. Konspirasi total. Tidak ada yang aman. Tidak ada petunjuk.': '3 killers. Total conspiracy. No one is safe. No clues.',

    // Role Selection
    'Pilih Peranmu': 'Choose Your Role',
    'Pilih peranmu — karakter dan killer ditentukan secara <strong>acak</strong>. Setiap karakter punya kemampuan pasif unik.': 'Choose your role — characters and killers are determined <strong>randomly</strong>. Each character has a unique passive ability.',

    // Character Intro
    'Kenali Mereka': 'Meet Them',
    'Sepuluh tamu mansion. Masing-masing menyimpan agenda. Klik untuk mengenal mereka lebih dekat.': 'Ten mansion guests. Each hiding an agenda. Click to know them better.',
    'Mulai Cerita': 'Start Story',

    // Panels
    'NPC Brain Log': 'NPC Brain Log',
    'Menu': 'Menu',
    'Prolog': 'Prologue',
    'Mansion Wardhana': 'Wardhana Mansion',

    // Encrypted notice
    'Pesan terenkripsi end-to-end. Tidak ada pihak luar yang bisa membaca.': 'Messages are end-to-end encrypted. No outside party can read them.',
  };

  // ---- Ending Titles ----
  const ENDING_TITLES = {
    'Sang Penenun Terakhir': 'The Last Weaver',
    'Detektif Sejati': 'True Detective',
    'Fajar yang Cukup': 'Dawn Enough',
    'Pengorbanan': 'Sacrifice',
    'Kesaksian Terakhir': 'Last Testimony',
    'Abu dan Fajar': 'Ashes and Dawn',
    'Kemenangan yang Pecah': 'Broken Victory',
    'Penebusan Penulis': 'Writer\'s Redemption',
    'Lingkaran Vira': 'Vira\'s Circle',
    'Kemenangan Pyrrhic': 'Pyrrhic Victory',
    'Perjanjian dengan Iblis': 'Deal with the Devil',
    'Perpecahan Fatal': 'Fatal Division',
    'Warisan Wardhana': 'Wardhana Legacy',
    'Paranoia Menang': 'Paranoia Wins',
    'Tuduhan Salah': 'False Accusation',
    'Sang Penenun Menang': 'The Weaver Wins',
    'Pengkhianatan Dokter': 'Doctor\'s Betrayal',
    'Simpul Terputus Total': 'Completely Severed Knot',
    'Pelarian Tanpa Akhir': 'Endless Escape',
    'Pengecut yang Hidup': 'The Coward Who Lived',
    'Pahlawan yang Jatuh': 'Fallen Hero',
    'Siklus Berlanjut': 'Cycle Continues',
    'Plot Twist Penulis': 'Writer\'s Plot Twist',
    'Profiler dan Subjek': 'Profiler and Subject',
    'Mayoritas yang Diam': 'Silent Majority',
    'Pelarian dari Mansion': 'Escape from the Mansion',
    'Pembantai Pembunuh': 'Killer Slayer',
    'Pengkhianatan Sempurna': 'Perfect Betrayal',
    'Jejak yang Terhapus': 'Erased Traces',
    'Yang Terakhir Berdiri': 'Last One Standing',
  };

  // ---- Character Profiles ----
  const CHAR_PROFILES = {
    'Protagonis — Sang Pencari Kebenaran': 'Protagonist — The Truth Seeker',
    'Sang Dalang — Tuan Rumah dengan Agenda': 'The Mastermind — Host with an Agenda',
    'Sang Profiler — Pembaca Jiwa': 'The Profiler — Soul Reader',
    'Sang Pemberontak — Api yang Tak Padam': 'The Rebel — Unquenchable Fire',
    'Sang Bayangan — Yang Kembali dari Kegelapan': 'The Shadow — Returned from Darkness',
    'Sang Detektif — Hukum yang Lelah': 'The Detective — Tired Justice',
    'Sang Penulis — Narator Kematian': 'The Writer — Death\'s Narrator',
    'Sang Operator — Pisau di Balik Senyum': 'The Operator — Blade Behind the Smile',
    'Sang Peretas — Ghost in the Machine': 'The Hacker — Ghost in the Machine',
    'Sang Pewaris — Tahta Berdarah': 'The Heiress — Bloody Throne',
    'Analitis': 'Analytical',
    'Perseptif': 'Perceptive',
    'Pemberani': 'Brave',
    'Obsesif': 'Obsessive',
    'Ceroboh dalam Perasaan': 'Careless with Feelings',
  };

  // ---- Comprehensive Dialogue Translation Dictionary ----
  // Maps Indonesian text → English translation
  // Used for subtitles in chat bubbles and choices
  const DICT = {
    // ===================== CHOICES =====================
    'Telepon Juno dulu — dia harusnya datang juga': 'Call Juno first — she should be coming too',
    'Ikuti Niko ke dalam hall utama': 'Follow Niko into the main hall',
    'Cek ponsel — simpan nomor darurat sebelum sinyal hilang total': 'Check phone — save emergency numbers before signal dies completely',
    'Ambil foto folder polisi itu dengan ponsel': 'Take a photo of that police folder with your phone',
    'Catat detail dan masuk ke mansion': 'Note the details and enter the mansion',
    'Masuk ke hall utama': 'Enter the main hall',
    'Masuk ke mansion. Waktu berjalan.': 'Enter the mansion. Time is ticking.',
    'Hampiri Sera — dia ingin bicara': 'Approach Sera — she wants to talk',
    'Dekati Vira — kau perlu penjelasan': 'Approach Vira — you need an explanation',
    'Periksa instalasi kursi dan amplop hitam di tengah hall': 'Examine the chair installation and black envelopes in the center of the hall',
    'Observasi Lana dan foto-foto kriminal — ada yang familiar': 'Observe Lana and the crime photos — something looks familiar',
    'Bergabung dengan Farah dan Dimas di bar': 'Join Farah and Dimas at the bar',
    'Simpan foto itu. Ini bukti.': 'Save that photo. This is evidence.',
    'Tunjukkan ke semua orang. Mereka harus tahu.': 'Show it to everyone. They need to know.',
    'Taruh kembali. Jangan biarkan siapapun tahu kau menemukan ini.': 'Put it back. Don\'t let anyone know you found this.',
    'Diam. Observasi siapa yang bergerak saat lampu mati.': 'Stay still. Observe who moves when the lights go out.',
    'Mundur perlahan. Instingmu berteriak.': 'Step back slowly. Your instincts are screaming.',
    'Catat pesan Vira:': 'Note Vira\'s message:',
    'Abaikan — dia memang selalu dramatis': 'Ignore — she\'s always been dramatic',
    'Ikuti acara Niko yang dimulai': 'Follow Niko\'s event starting now',
    'Baca amplop orang lain — mulai dari Niko': 'Read others\' envelopes — start with Niko',
    'Simpan kartu dan ikuti acara': 'Keep the card and join the event',
    'Kembali ke hall. Ikuti permainan — untuk sekarang.': 'Return to the hall. Play the game — for now.',
    'Ikuti acara Niko. Simpan informasi dari Lana untuk nanti.': 'Follow Niko\'s event. Save the info from Lana for later.',
    'Ikuti acara Niko — tapi dengan informasi baru ini': 'Follow Niko\'s event — but with this new information',
    'Dengarkan saja percakapan mereka tanpa banyak bertanya': 'Just listen to their conversation without asking too many questions',
    'Catat: lantai 3 off-limits. Menarik.': 'Noted: floor 3 is off-limits. Interesting.',
    'Ikuti acara Niko': 'Follow Niko\'s event',
    'Ikuti acara Niko — sekarang dengan kewaspadaan maksimum': 'Follow Niko\'s event — now with maximum alertness',
    'Periksa semua jalan keluar bersama Reza': 'Check all exits with Reza',
    'Minta Kai trace siapa yang mengontrol lampu dan kunci': 'Ask Kai to trace who controls the lights and locks',
    'Perhatikan reaksi semua orang — siapa yang TIDAK terkejut?': 'Watch everyone\'s reactions — who is NOT surprised?',
    'Bentuk rencana: kumpulkan orang-orang yang bisa dipercaya': 'Form a plan: gather people who can be trusted',
    'Konfrontasi Vira — dia tahu lebih dari yang dia tunjukkan': 'Confront Vira — she knows more than she\'s showing',
    'Prioritas: cari akses ke basement dan ruang server': 'Priority: find access to basement and server room',
    'Prioritas: investigasi identitas \'Sang Penenun\' — dalang di balik ini': 'Priority: investigate the identity of \'The Weaver\' — the mastermind behind this',
    'Pergi ke Galeri Timur — hadapi apapun yang menunggu': 'Go to East Gallery — face whatever awaits',
    'Tetap di hall — siapkan barricade dan pertahanan': 'Stay in the hall — prepare barricades and defenses',
    'Gunakan kesempatan saat semua terdistraksi untuk jelajahi lantai 2': 'Use the opportunity while everyone is distracted to explore floor 2',
    'Duduk dan mainkan. Informasi lebih berharga dari protes.': 'Sit down and play. Information is more valuable than protest.',
    'Tolak duduk. Periksa ruangan untuk jebakan terlebih dahulu.': 'Refuse to sit. Check the room for traps first.',
    'Masuk dan observasi siapa saja yang hadir': 'Enter and observe who is present',
    'Periksa mobil-mobil yang terparkir — siapa saja yang datang?': 'Check the parked cars — who has arrived?',

    // Dynamic choice texts (character-specific)
    '"Niko, kau yang kirim amplop hitam itu?"': '"Niko, did you send that black envelope?"',
    '"Menarik — micro-expression Niko menunjukkan dia menyembunyikan sesuatu."': '"Interesting — Niko\'s micro-expressions show he\'s hiding something."',
    '"Gue nggak suka basa-basi. Siapa yang ngundang kita?"': '"I don\'t like small talk. Who invited us?"',
    '"Dua puluh tahun pengalaman bilang ini jebakan. Tapi justru itu yang membuatmu masuk."': '"Twenty years of experience says this is a trap. But that\'s exactly why you walk in."',
    '"Persis seperti skenario. Waktunya masuk ke karakter."': '"Exactly as scripted. Time to get into character."',
    '"WiFi mansion ini... ada yang aneh. Lo perlu scan lebih dalam."': '"This mansion\'s WiFi... something\'s off. You need to scan deeper."',
    '"Siapa yang mengirim undangan ini sebenarnya?"': '"Who actually sent this invitation?"',
    'Masuk dan cari exit — lo selalu punya plan B': 'Enter and find exits — you always have a plan B',
    'Masuk dan scan jaringan WiFi mansion': 'Enter and scan the mansion\'s WiFi network',
    'Masuk dengan otoritas — ini properti yang dibangun keluargamu': 'Enter with authority — this property was built by your family',
    'Periksa perimeter — kebiasaan lama dari kepolisian': 'Check the perimeter — old habit from the police force',
    'Scan plat nomor dan trace database online': 'Scan license plates and trace online databases',

    // Hints
    'Langsung ke inti.': 'Get straight to the point.',
    'Gunakan keahlian profiling-mu.': 'Use your profiling expertise.',
    'Insting detektifmu berderak.': 'Your detective instincts are crackling.',
    'Kau tahu jawabannya. Tapi mereka tidak perlu tahu itu.': 'You know the answer. But they don\'t need to know that.',
    'Kumpulkan intel dulu. Reaksi bisa menunggu.': 'Gather intel first. Reactions can wait.',
    'Plat nomor dan model mobil bisa bercerita banyak.': 'License plates and car models can tell a lot.',
    'Bukti. Selalu dokumentasikan bukti.': 'Evidence. Always document evidence.',
    'Jadilah jurnalis. Jangan mundur.': 'Be a journalist. Don\'t back down.',
    'Sera tidak pernah memberi sinyal tanpa alasan.': 'Sera never signals without a reason.',
    'Enam bulan menghilang. Dan sekarang dia di sini.': 'Missing for six months. And now she\'s here.',
    'Sepuluh kursi. Sepuluh amplop. Sepuluh tamu.': 'Ten chairs. Ten envelopes. Ten guests.',
    'Informasi adalah senjata. Bahkan informasi yang menakutkan.': 'Information is a weapon. Even frightening information.',
    'Semua orang fokus ke galeri. Ini saat yang tepat untuk investigasi.': 'Everyone\'s focused on the gallery. This is the perfect time for investigation.',
    'Prioritas: escape routes.': 'Priority: escape routes.',
    'Siapa yang tidak kaget... mungkin sudah tahu.': 'Whoever isn\'t shocked... might already know.',
    'Kontrol sistem = kontrol jalan keluar.': 'Control the system = control the way out.',
    'Hentikan sumbernya, bukan gejalanya.': 'Stop the source, not the symptoms.',

    // More choices from chapters
    '"Sebelum siapapun minum — periksa gelas-gelas itu."': '"Before anyone drinks — check those glasses."',
    '"File kasus pembunuhan di pameran seni? Cerita menarik."': '"A murder case file at an art exhibition? Interesting story."',
    '"Maaf. Mobilku parkir di sebelah. Salah lihat."': '"Sorry. My car is parked next door. Wrong car."',
    '"Kita harus kerja sama. Aku punya kontak dan recording skills."': '"We need to work together. I have contacts and recording skills."',
    '"Kalau kau curiga, kenapa tetap datang?"': '"If you\'re suspicious, why did you still come?"',
    '"Vira ada di sini?! Tunggu aku di lobby."': '"Vira is here?! Wait for me in the lobby."',
    '"Juno, jangan dekati Vira sendirian. Aku serius."': '"Juno, don\'t approach Vira alone. I\'m serious."',
    '"Catatan yang bagus. Kita jaga mata terbuka — bersama."': '"Good notes. Let\'s keep our eyes open — together."',
    '"Download semua video itu. Kita butuh bukti."': '"Download all those videos. We need evidence."',
    '"Kita harus pergi dari sini. Sekarang."': '"We need to get out of here. Now."',
    '"Kau sudah baca punyamu? Soal menulis dan menginspirasi pembunuhan?"': '"Did you read yours? About writing and inspiring murder?"',
    '"Maaf. Aku hanya penasaran."': '"Sorry. I was just curious."',
    '"Niko, aku serius — apa ini bagian dari pameranmu?"': '"Niko, I\'m serious — is this part of your exhibition?"',

    // Chapter titles and narration
    'Bab 1: Pameran Maut': 'Chapter 1: The Deadly Exhibition',
    'Bab 2: Darah Pertama': 'Chapter 2: First Blood',
    'Bab 3: Simpul Kedua': 'Chapter 3: The Second Knot',
    'Bab 4: Topeng Jatuh': 'Chapter 4: Masks Fall',
    'Bab 5: Simpul Terakhir': 'Chapter 5: The Last Knot',

    // ===================== DIALOGUE =====================

    // --- Prolog ---
    'Kau diundang untuk menyaksikan kebenaran. Mansion Wardhana, Sabtu, 21:00. Datang sendirian. Jangan beritahu siapapun.': 'You are invited to witness the truth. Wardhana Mansion, Saturday, 21:00. Come alone. Tell no one.',
    'Jalan ini... gelap banget. Sinyal udah hilang dari tadi.': 'This road... so dark. Signal has been gone for a while.',
    'Semua sudah siap. Tamu-tamu mulai datang. Malam ini... kotak Pandora terbuka.': 'Everything is ready. The guests are arriving. Tonight... Pandora\'s box opens.',
    'Undangan ini aneh. Siapa yang mengundang sepuluh orang asing ke mansion terpencil? Dan kenapa aku termasuk?': 'This invitation is strange. Who invites ten strangers to a remote mansion? And why am I included?',
    'Gue hampir nggak datang. Tapi undangan itu... ada sesuatu yang bikin gue nggak bisa tidur.': 'I almost didn\'t come. But that invitation... something about it kept me up at night.',
    'Aku kembali. Bukan karena mau — tapi karena dia mengancam adikku.': 'I\'m back. Not because I want to — but because he threatened my sister.',
    'Dua puluh tahun jadi detektif. Kasus ini yang tidak pernah selesai. Sekarang undangan ini menarikku kembali.': 'Twenty years as a detective. This case was never closed. Now this invitation pulls me back.',
    'Skenario berjalan sempurna. Sepuluh karakter, satu mansion, satu malam. Dan peranku bukan sebagai tamu.': 'The scenario runs perfectly. Ten characters, one mansion, one night. And my role isn\'t as a guest.',
    'Kau tahu kebenaran: kau bekerja untuk Sang Penenun.': 'You know the truth: you work for the Weaver.',
    'Lana yang memimpin. Selalu. Malam ini ada pekerjaan. Dia menyebutnya \'seni\'.': 'Lana leads. Always. Tonight there\'s a job. She calls it \'art\'.',
    'Kau adalah operator Sang Penenun. "Pemotong."': 'You are the Weaver\'s operator. "The Cutter."',
    'QR code tersembunyi di watermark amplop. Server di Estonia, di-route melalui tiga proxy. Pengirim ini bukan amatir.': 'Hidden QR code in the envelope\'s watermark. Server in Estonia, routed through three proxies. This sender is no amateur.',
    'Mansion yang dibangun dengan uang keluarga Aldridge. Uang kakekku. Dan rahasia di bawah fondasinya...': 'A mansion built with Aldridge family money. My grandfather\'s money. And the secrets beneath its foundation...',
    'Arya! Kau datang. Aku tahu kau tidak bisa menolak misteri.': 'Arya! You came. I knew you couldn\'t resist a mystery.',
    'berdiri di tangga depan mansion, senyumnya cerah seperti iklan — terlalu cerah untuk tempat segelap ini.': 'standing on the mansion\'s front steps, his smile bright like an advertisement — too bright for a place this dark.',
    'Senang kau datang. Masuk, yang lain sudah menunggu.': 'Glad you came. Come in, the others are waiting.',

    // Prolog - Niko confrontation
    'Amplop hitam? Dramatik sekali. Tidak, aku mengirim undangan biasa lewat email. Desainnya minimalis — hitam dan emas. Kau tahu aku suka branding.': 'Black envelope? How dramatic. No, I sent regular invitations by email. Minimalist design — black and gold. You know I like branding.',
    'Ini proyek terbaruku. Kakekku meninggalkan properti ini, dan aku mengubahnya jadi ruang pameran seni imersif. Malam ini soft launch.': 'This is my latest project. My grandfather left me this property, and I\'m turning it into an immersive art exhibition space. Tonight is the soft launch.',
    'Oh — satu hal. Sinyal telepon agak buruk di sini. Tapi mansion punya Wi-Fi sendiri.': 'Oh — one thing. Phone signal is pretty bad here. But the mansion has its own Wi-Fi.',
    'Arya? Aku senang kau di sini. Serius. Malam ini... aku butuh seseorang yang bisa kupercaya.': 'Arya? I\'m glad you\'re here. Seriously. Tonight... I need someone I can trust.',

    // Prolog - Cars
    'SUV hitam mengkilap, plat Jakarta. Sedan tua hijau army dengan stiker \'Ex Serviam\'. Hatchback putih — \'My other car is a hearse\'. Dan motor Juno.': 'Shiny black SUV, Jakarta plates. Old army green sedan with an \'Ex Serviam\' sticker. White hatchback — \'My other car is a hearse\'. And Juno\'s motorcycle.',
    'Tunggu... sedan silver di ujung, hampir tersembunyi. Di dalamnya — folder manila tebal. Header polisi.': 'Wait... silver sedan at the end, almost hidden. Inside — a thick manila folder. Police header.',
    'Dari foto ini... \'kasus tidak aktif... korban ke-7... profil serupa... mansion Wardhana...\' Seseorang membawa file kasus pembunuhan ke pameran seni.': 'From this photo... \'inactive case... victim #7... similar profile... Wardhana mansion...\' Someone brought a murder case file to an art exhibition.',
    'Mencari sesuatu?': 'Looking for something?',
    'Itu mobilku. Dan itu <em>file</em>-ku.': 'That\'s my car. And that\'s my <em>file</em>.',

    // Prolog - Reza intro
    'Arya Prasetya. Podcast \'Jejak Mati\'. Episode 47 — kasus Pembunuh Jembatan. Kau hampir benar soal pelakunya.': 'Arya Prasetya. \'Trail of the Dead\' podcast. Episode 47 — the Bridge Killer case. You were almost right about the culprit.',
    'Kau mendengarkan podcast-ku?': 'You listen to my podcast?',
    'Aku mendengarkan semua orang yang bicara tentang kasus-kasusku. Reza Hartono. Dulu detektif homisida. Sekarang konsultan keamanan. Niko menyewa jasaku untuk malam ini.': 'I listen to everyone who talks about my cases. Reza Hartono. Former homicide detective. Now a security consultant. Niko hired me for tonight.',
    'Tapi kau membawa file kasus lama.': 'But you brought old case files.',
    'Pernah dengar perasaan di perut yang bilang sesuatu tidak beres? Daftar tamu malam ini... cocok dengan profil korban dari kasus yang tidak pernah kututup.': 'Ever had that gut feeling telling you something\'s wrong? Tonight\'s guest list... matches the victim profiles from a case I never closed.',
    'Kasus apa?': 'What case?',
    'Tujuh orang. Tujuh tahun. Semuanya diundang ke acara eksklusif. Semuanya menghilang. Dan semuanya punya koneksi dengan keluarga pemilik properti.': 'Seven people. Seven years. All invited to exclusive events. All disappeared. And all had connections to the property owner\'s family.',
    'Aku bisa salah. Semoga aku salah.': 'I could be wrong. I hope I\'m wrong.',
    'Karena terakhir kali aku mengabaikan perasaan ini, orang yang salah masuk penjara. Dan yang benar terus membunuh.': 'Because the last time I ignored this feeling, the wrong person went to prison. And the real one kept killing.',
    'Kita masuk. Amati. Jangan tunjukkan bahwa kau tahu apapun. Dan Arya — jangan percaya siapapun malam ini. Termasuk aku.': 'Let\'s go in. Observe. Don\'t show that you know anything. And Arya — don\'t trust anyone tonight. Including me.',

    // Prolog - Juno call
    'Arya! Lo udah di sana? Gue baru parkir. Tempat ini gila — kayak haunted mansion di film B.': 'Arya! You there already? I just parked. This place is insane — like a haunted mansion from a B-movie.',
    'Kau juga dapat amplop hitam?': 'Did you also get a black envelope?',
    'Amplop hitam? Nggak. Gue diajak Niko lewat DM. Dia bilang ada pameran seni yang \'harus gue lihat\'. Emang kenapa?': 'Black envelope? No. Niko invited me through DM. He said there\'s an art exhibition I \'had to see\'. Why?',
    'Tidak. Lupakan. Kita ketemu di dalam?': 'Nothing. Forget it. Meet inside?',
    'Bentar. Arya... lo kenal semua yang diundang?': 'Wait. Arya... do you know everyone who was invited?',
    'Belum. Kenapa?': 'Not yet. Why?',
    'Gue baru papasan sama satu cewek. Berambut hitam, gaun gelap. Dia senyum dan bilang, \'Selamat datang kembali.\' Gue belum pernah ke sini.': 'I just bumped into a girl. Black hair, dark dress. She smiled and said, \'Welcome back.\' I\'ve never been here.',
    'Dan Arya — gue kenal wajahnya. Itu Vira. Vira yang hilang enam bulan.': 'And Arya — I know that face. It\'s Vira. Vira who disappeared six months ago.',

    // Prolog - Phone check
    'Nomor darurat disimpan. Pin lokasi terkirim ke editor podcast. Screenshot peta area — done.': 'Emergency numbers saved. Location pin sent to podcast editor. Area map screenshot — done.',
    'Sial. Status \'Sending...\' tanpa centang. Sinyal udah nol.': 'Damn. Status \'Sending...\' without a checkmark. Signal is zero.',
    'Wi-Fi mansion: \'WARDHANA_GUEST\'. Kuat. Tapi semua request di-redirect ke splash screen: \'THE LAST KNOT\' dengan countdown timer.': 'Mansion WiFi: \'WARDHANA_GUEST\'. Strong. But all requests redirect to a splash screen: \'THE LAST KNOT\' with a countdown timer.',
    'Timer: 06:00:00. Enam jam. Sampai apa?': 'Timer: 06:00:00. Six hours. Until what?',

    // Prolog - Enter Hall
    'kita perlu bicara.': 'we need to talk.',
    'Gue nggak suka tempat ini, Arya. Terlalu... disetting.': 'I don\'t like this place, Arya. Too... staged.',
    'Semuanya sudah hadir! Sempurna. Sebelum kita mulai — perkenalan singkat. Malam ini akan lebih intim kalau kita semua tahu siapa yang ada di ruangan ini.': 'Everyone\'s here! Perfect. Before we begin — brief introductions. Tonight will be more intimate if we all know who\'s in the room.',

    // Prolog - Sera talk
    'Tiga hal, Arya.': 'Three things, Arya.',
    'Satu — aku menghitung sepuluh undangan tapi sebelas tempat duduk di meja makan. Untuk siapa kursi kosong itu?': 'One — I counted ten invitations but eleven seats at the dinner table. Who is the empty chair for?',
    'Dua — pria di dekat bar. Microexpression-nya tidak sinkron. Dia tersenyum tapi pupilnya tidak melebar. Itu masking. Tipe yang aku pelajari di bab psychopathology.': 'Two — the man near the bar. His micro-expressions are out of sync. He smiles but his pupils don\'t dilate. That\'s masking. The type I studied in the psychopathology chapter.',
    'Arya, aku takut. Tapi aku lebih takut kalau aku diam dan ternyata aku benar.': 'Arya, I\'m scared. But I\'m more scared if I stay silent and turn out to be right.',

    // Prolog - Kira hack
    'Udah. Aku scan jaringan ini sebelum masuk. Kebiasaan.': 'Done. I scanned this network before coming in. Habit.',
    'Router mansion terhubung ke NAS server lokal. Tapi ada satu device lain — server stream. Aktif. Streaming video ke IP eksternal.': 'The mansion\'s router is connected to a local NAS server. But there\'s another device — a stream server. Active. Streaming video to an external IP.',
    'Seseorang menyiarkan apa yang terjadi di sini? Live?': 'Someone is broadcasting what\'s happening here? Live?',
    'Dan satu hal lagi. Di NAS ada folder bertanggal mundur tujuh tahun. Setiap folder berisi video. Aku baru buka satu.': 'And one more thing. On the NAS there are folders dated back seven years. Each folder contains videos. I just opened one.',
    'Setiap tahun. Selama tujuh tahun. Ada \'acara\' di mansion ini. Dan setiap kali... ada yang tidak keluar hidup-hidup.': 'Every year. For seven years. There have been \'events\' at this mansion. And every time... someone doesn\'t come out alive.',

    // Prolog - Escape
    'Pintu depan — terkunci.': 'Front door — locked.',
    'Kunci elektromagnetik. Dikontrol dari server. Semua pintu keluar terkunci tiga menit lalu. Tepat saat tamu terakhir masuk.': 'Electromagnetic lock. Controlled from the server. All exit doors locked three minutes ago. Right when the last guest entered.',
    'Niko! Pintu terkunci!': 'Niko! The doors are locked!',
    'Aku tahu. Itu bagian dari pengalaman imersif. Santai — kunci akan terbuka otomatis saat pameran selesai. Escape room versi premium.': 'I know. It\'s part of the immersive experience. Relax — the locks will open automatically when the exhibition ends. Premium escape room.',

    // Prolog - Envelope
    'NIKO WARDHANA — Sang Pewaris. Kakekmu membangun takhta dari tulang. Apakah kau akan duduk di atasnya — atau menghancurkannya?': 'NIKO WARDHANA — The Heir. Your grandfather built his throne from bones. Will you sit on it — or destroy it?',
    'LANA MAHARANI — Sang Narator. Kau menulis tentang pembunuhan. Tapi apakah kau hanya menulis — atau juga menginspirasi?': 'LANA MAHARANI — The Narrator. You write about murder. But do you only write — or also inspire?',
    'DIMAS SURYA — Sang Pemotong. Kau memotong tubuh mati untuk ilmu. Tapi apakah kau pernah bertanya apa rasanya memotong yang masih hidup?': 'DIMAS SURYA — The Cutter. You cut dead bodies for science. But have you ever wondered what it feels like to cut the living?',
    'Membaca surat orang lain? Itu tidak sopan. Tapi bisa dimengerti — dari seorang jurnalis.': 'Reading other people\'s letters? That\'s rude. But understandable — from a journalist.',

    // Prolog - Lana
    'Menginspirasi. Kata yang kuat. Aku penulis fiksi, Arya. Kalau setiap penulis thriller dituduh menginspirasi pembunuhan, Stephen King sudah di penjara sejak 1980.': 'Inspire. Strong word. I\'m a fiction writer, Arya. If every thriller writer were accused of inspiring murder, Stephen King would have been in prison since 1980.',
    'Tapi kasus di buku ketigamu — \'Anatomi Malam\' — detail-detailnya cocok dengan kasus nyata yang polisi tidak publikasikan.': 'But the case in your third book — \'Anatomy of Night\' — the details match a real case that the police never made public.',
    'Kau sudah riset tentang aku. Bagus. Aku juga sudah riset tentang kau.': 'You\'ve researched me. Good. I\'ve also researched you.',
    'Sumber podcast episode 32-mu. Yang bunuh diri. Aku kenal dia. Dan dia tidak bunuh diri, Arya.': 'Your podcast episode 32 source. The one who committed suicide. I knew him. And he didn\'t commit suicide, Arya.',
    'Kita punya banyak yang bisa dibicarakan malam ini. Tapi nanti. Tuan rumah ingin mulai.': 'We have a lot to discuss tonight. But later. The host wants to start.',

    // Prolog - Observations
    'Niko — terkejut, tapi matanya mengkalkulasi. Ini mungkin bukan rencananya, tapi dia tidak sepenuhnya tidak siap.': 'Niko — surprised, but his eyes are calculating. This might not be his plan, but he\'s not entirely unprepared.',
    'Sera — takut, tapi juga mengamati. Satu tipe denganku.': 'Sera — scared, but also observing. Same type as me.',
    'Juno — marah. Reaksi fight. Tangannya terkepal.': 'Juno — angry. Fight response. Fists clenched.',
    'Reza — profesional. Sudah mode detektif. Tangan di pinggul — kebiasaan lama.': 'Reza — professional. Already in detective mode. Hand on hip — old habit.',
    'Farah — ketakutan murni. Tapi matanya bergerak ke lantai tiga.': 'Farah — pure fear. But her eyes keep moving to the third floor.',
    'Kai — sudah di laptop. Fokus, bukan panik.': 'Kai — already on her laptop. Focused, not panicking.',
    'Vira — <em>tidak bereaksi sama sekali</em>. Seperti cuaca yang sudah dia ramalkan.': 'Vira — <em>no reaction at all</em>. Like weather she\'d already predicted.',
    'Lana — bibirnya bergerak. Berbisik: \'Tepat waktu.\' Siapa yang tepat waktu?': 'Lana — her lips are moving. Whispering: \'Right on time.\' Who is right on time?',
    'Dimas — tenang. Memeriksa tas medisnya. Dia sudah siap untuk malam ini. Kenapa?': 'Dimas — calm. Checking his medical bag. He\'s already prepared for tonight. Why?',
    'Lana — menulis catatan. Novelis — selalu mencatat.': 'Lana — writing notes. Novelist — always taking notes.',
    'Dimas — tenang. Terlalu tenang untuk mahasiswa.': 'Dimas — calm. Too calm for a student.',

    // Prolog - Form plan
    'Kita perlu rencana. Sekarang.': 'We need a plan. Now.',
    'Simpel. Kita cari jalan keluar, hubungi polisi, dan—': 'Simple. We find a way out, call the police, and—',
    'Sinyal telepon nol. Wi-Fi dikontrol. Semua pintu keluar terkunci elektromagnetik.': 'Phone signal zero. WiFi is controlled. All exits are electromagnetically locked.',
    'Jendela?': 'Windows?',
    'Sudah cek. Lantai satu — jendela dipasangi teralis besi dekoratif. Tidak bisa dipotong tanpa alat berat.': 'Already checked. First floor — windows have decorative iron bars. Can\'t be cut without heavy tools.',
    'Aku bisa coba override sistem kunci dari server lokal. Tapi butuh akses fisik ke ruang server — kemungkinan di basement.': 'I can try to override the lock system from the local server. But I need physical access to the server room — probably in the basement.',

    // --- Chapter 1 ---
    'Selamat malam, para tamu. Selamat datang di Pameran Simpul Terakhir. Dalam enam jam, pintu akan terbuka. Setiap jam, sebuah \'karya seni\' baru akan terungkap. Karya pertama dimulai dalam tiga menit. Silakan menuju Galeri Timur.': 'Good evening, guests. Welcome to the Last Knot Exhibition. In six hours, the doors will open. Every hour, a new \'work of art\' will be revealed. The first piece begins in three minutes. Please proceed to the East Gallery.',
    'Pintu basement terbuka. Generator di bawah. Aku turun duluan — kalau nggak kembali lima menit...': 'Basement door is open. Generator is downstairs. I\'ll go down first — if I don\'t come back in five minutes...',
    'Aku ikut.': 'I\'m coming with you.',
    'Sembilan wajah, sembilan set micro-expression. Setidaknya tiga orang di sini sedang berbohong.': 'Nine faces, nine sets of micro-expressions. At least three people here are lying.',
    'Sempurna. Semuanya berjalan sesuai naskah. Sekarang — bab selanjutnya: ketakutan.': 'Perfect. Everything is going according to script. Now — next chapter: fear.',
    'Ini bukan acara seni. Ini crime scene yang belum terjadi.': 'This isn\'t an art event. This is a crime scene that hasn\'t happened yet.',
    'Speaker pakai protokol encrypted. Dalangnya punya akses ke tech serius.': 'The speaker uses encrypted protocol. The mastermind has access to serious tech.',
    'Suara itu. Diproses, tapi intonasinya sama seperti enam bulan lalu. Dia masih di sini.': 'That voice. Processed, but the intonation is the same as six months ago. He\'s still here.',
    'Ini bukan rencanamu. Seseorang membajak acaramu.': 'This isn\'t your plan. Someone hijacked your event.',
    'Lana mengangguk dari seberang ruangan. Kode: semuanya lancar.': 'Lana nods from across the room. Code: everything is going smoothly.',
    'Aku tidak mau ke mana-mana.': 'I don\'t want to go anywhere.',
    'Aku tidak akan jadi yang pertama masuk perangkap.': 'I won\'t be the first to walk into a trap.',
    'Aku ingin lihat.': 'I want to see.',
    'ini trap yang obvious banget. Kita nggak harus ikut.': 'this is an obvious trap. We don\'t have to follow.',
    'Ini trap yang obvious banget.': 'This is an obvious trap.',
    'Atau justru di situlah jawabannya.': 'Or maybe that\'s exactly where the answer lies.',
    'Gue nge-trace frekuensi audio dari speaker. Kalau dikendalikan remote, gue bisa trace IP-nya.': 'I\'m tracing the audio frequency from the speaker. If it\'s remotely controlled, I can trace its IP.',
    'Gue bisa trace IP speaker ini.': 'I can trace this speaker\'s IP.',

    // --- Chapter 2 ---
    'Satu jam berlalu. Satu jam yang terasa seperti satu tahun.': 'One hour has passed. An hour that felt like a year.',
    'Event kedua dimulai. Tema: Kepercayaan. Lokasi: Sayap Barat — Ruang Makan. Semua tamu diharapkan hadir. Ketidakhadiran akan... diperhitungkan.': 'Second event begins. Theme: Trust. Location: West Wing — Dining Room. All guests are expected to attend. Absence will be... noted.',
    'Jangan minum apapun!': 'Don\'t drink anything!',

    // --- Engine Notifications ---
    'Kau berdiri di depan Sera. Trust +12%. Bahaya turun.': 'You stand in front of Sera. Trust +12%. Danger decreased.',
    'Kau berdiri di samping Arya. Trust +12%. Bahaya turun.': 'You stand beside Arya. Trust +12%. Danger decreased.',
    'Kau berdiri di depan Sera. Trust +10%. Bahaya turun.': 'You stand in front of Sera. Trust +10%. Danger decreased.',
    'Kau memblokir semua pintu masuk. Bahaya turun -12%. Area ini aman sementara.': 'You blocked all entrances. Danger -12%. This area is temporarily safe.',
    'Ingatan samar... ada sesuatu tapi belum jelas. Coba di lokasi lain.': 'Vague memory... something but not clear. Try another location.',
    'Niko akhirnya jujur. Trust +15%. Topengnya retak.': 'Niko is finally honest. Trust +15%. His mask is cracking.',
    'Niko menutup diri lagi. Trust -10%. Dinding emosional.': 'Niko shuts down again. Trust -10%. Emotional wall.',
    'Analisis forensik selesai. Tidak ada bukti killer di sini — area ini aman.': 'Forensic analysis complete. No killer evidence here — this area is safe.',
    'Tidak ada jejak digital yang mencurigakan kali ini.': 'No suspicious digital traces this time.',
    'Pengetahuan keluarga mengungkap rahasia mansion — petunjuk baru ditemukan!': 'Family knowledge reveals mansion secrets — new clue found!',
    'Kau mengingat sejarah keluarga, tapi belum menemukan petunjuk baru.': 'You recall family history, but haven\'t found new clues.',
    'Akting sempurna! Semua orang iba. Suspicion -15%.': 'Perfect acting! Everyone feels sympathy. Suspicion -15%.',
    'Kau bergerak tanpa suara. Posisi sempurna. Suspicion -8%.': 'You move silently. Perfect position. Suspicion -8%.',
    'Infrastruktur disabotase. Lampu mati. Kelompok akan terpecah.': 'Infrastructure sabotaged. Lights out. The group will split.',
    'Petunjuk pertama ditemukan! Seorang survivor diam-diam mengambil peran sebagai Pemburu... Identitasnya masih tersembunyi.': 'First clue found! A survivor secretly takes on the role of Hunter... Identity still hidden.',

    // Tools
    'Pisau Dapur': 'Kitchen Knife',
    'Senjata jarak dekat. +40% chance kill, tapi meninggalkan bukti darah.': 'Close-range weapon. +40% kill chance, but leaves blood evidence.',
    'Kunci Master': 'Master Key',
    'Buka semua pintu di mansion. Akses ke semua ruangan termasuk Bunker B-3.': 'Opens all doors in the mansion. Access to all rooms including Bunker B-3.',
    'Suntikan Obat Bius': 'Sedative Injection',
    'Bius target tanpa suara. +50% chance eliminasi diam-diam, tanpa bukti.': 'Sedate target silently. +50% silent elimination chance, no evidence.',
    'Radio Portabel': 'Portable Radio',
    'Komunikasi jarak jauh. Bisa panggil bantuan atau koordinasi aliansi.': 'Long-range communication. Can call for help or coordinate alliances.',
    'Tali Baja': 'Steel Cable',
    'Ikat atau jebak target. +35% chance tangkap, bisa untuk barricade.': 'Tie or trap target. +35% capture chance, can be used for barricade.',
    'Obor Api': 'Fire Torch',
    'Penerangan + senjata darurat. +20% offense, +25% defense, mengintimidasi.': 'Light + emergency weapon. +20% offense, +25% defense, intimidates.',
    'Laptop Terenkripsi': 'Encrypted Laptop',
    'Akses data mansion: CCTV, log pintu, komunikasi tersembunyi. +40% investigasi.': 'Access mansion data: CCTV, door logs, hidden comms. +40% investigation.',

    // Location names (from char-brain)
    'hall_utama': 'Main Hall',
    'galeri_timur': 'East Gallery',
    'ruang_makan': 'Dining Room',
    'perpustakaan': 'Library',
    'dapur': 'Kitchen',
    'taman_dalam': 'Inner Garden',
    'basement': 'Basement',
    'menara': 'Tower',
    'lorong_rahasia': 'Secret Corridor',
    'bunker_b3': 'Bunker B-3',
    'kamar_niko': 'Niko\'s Room',
    'sayap_barat': 'West Wing',
    'lantai_3': 'Floor 3',
    'lorong_timur': 'East Corridor',
    'lorong_barat': 'West Corridor',
    'foyer': 'Foyer',

    // Character quotes
    '"Kebenaran tidak pernah nyaman. Tapi kebohongan selalu lebih mahal."': '"The truth is never comfortable. But lies are always more expensive."',
    '"Setiap orang punya harga. Yang membedakan hanya mata uangnya."': '"Everyone has a price. The only difference is the currency."',
    '"Aku tidak membaca pikiran. Aku membaca ketakutan."': '"I don\'t read minds. I read fears."',
    '"Aturan itu untuk orang yang takut. Gue bukan salah satu dari mereka."': '"Rules are for people who are afraid. I\'m not one of them."',
    '"Aku sudah pernah mati. Yang sekarang ini hanya... menunggu giliran."': '"I\'ve already died once. This is just... waiting for my turn."',

    // ===================== CHAPTER 1 CHOICES =====================
    'Turun ke basement bersama Reza — cari ruang server': 'Go down to the basement with Reza — find the server room',
    'Kembali ke kelompok dan bagikan apa yang kau temukan': 'Return to the group and share what you found',
    'Simpan informasi ini untuk dirimu sendiri — belum waktunya': 'Keep this information to yourself — not yet time',
    'Tinggalkan pertanyaan itu — fokus ke event yang dimulai': 'Drop the question — focus on the event starting',
    'Aku dan Reza — pengalaman investigasi': 'Me and Reza — investigation experience',
    'Aku dan Juno — aku percaya instingnya': 'Me and Juno — I trust her instincts',
    'Kirim Niko dan Farah — mereka yang punya koneksi dengan mansion': 'Send Niko and Farah — they have connections to the mansion',
    'Aku masuk sendirian': 'I\'ll go in alone',
    'Aku masuk ke Ruang Musik — aku tidak bisa minta orang lain mengambil risiko': 'I\'ll enter the Music Room — I can\'t ask others to take the risk',
    'Rapat cepat — tentukan siapa yang masuk berdasarkan kemampuan': 'Quick meeting — decide who enters based on ability',
    'Ikuti saran Sera — jangan biarkan Dimas masuk tanpa pengawasan': 'Follow Sera\'s advice — don\'t let Dimas enter unsupervised',
    'BUKA rahasia Lana — kelompok perlu tahu tentang koneksinya dengan pembunuhan': 'REVEAL Lana\'s secret — the group needs to know about her connection to murder',
    'BUKA rahasia Farah — koneksi dengan kematian kakeknya bisa jadi kunci': 'REVEAL Farah\'s secret — the connection to her grandfather\'s death could be the key',
    'SIMPAN keduanya. Kita tidak berhak menghancurkan privasi orang.': 'KEEP both. We have no right to destroy people\'s privacy.',
    'Cari jalan keluar dari ruangan ini — tolak permainan': 'Find a way out of this room — refuse to play the game',
    'Ikuti Lana dan Dimas — jangan biarkan mereka sendirian': 'Follow Lana and Dimas — don\'t let them be alone',
    'Kembali ke kelompok utama dan share informasi': 'Return to the main group and share information',
    'Kumpulkan kelompok — kita perlu strategi untuk event selanjutnya': 'Gather the group — we need a strategy for the next event',
    'Foto diagram ini. Ini peta yang kita butuhkan.': 'Photograph this diagram. This is the map we need.',
    'Kumpulkan semua orang dan bahas apa yang terjadi': 'Gather everyone and discuss what happened',
    'BUKA rahasia Lana ke intercom': 'REVEAL Lana\'s secret through the intercom',
    'SIMPAN semua. Info lebih berharga kalau disimpan.': 'SAVE everything. Info is more valuable when kept.',
    'Ambil semua folder — ini bukti krusial': 'Take all folders — this is crucial evidence',
    'Foto semua dan taruh kembali — jangan biarkan siapapun tahu': 'Photograph everything and put it back — don\'t let anyone know',
    'Siapa tiga nama yang dilingkari?': 'Whose three names are circled?',
    'Naik dan konfrontasi — siapa yang mengikuti?': 'Go up and confront — who is following?',
    'Naik kembali. Kita punya informasi vital.': 'Go back up. We have vital information.',
    'Kembali ke kelompok — bagikan apa yang kau dengar': 'Return to the group — share what you heard',
    'Ikuti Dimas — dia lebih berbahaya sendirian': 'Follow Dimas — he\'s more dangerous alone',
    'Pura-pura percaya — tapi jangan biarkan siapapun minum dari teko itu': 'Pretend to believe — but don\'t let anyone drink from that teapot',
    'Investigasi lantai 3 — ruang kerja kakek Niko menyimpan jawaban': 'Investigate floor 3 — Niko\'s grandfather\'s study holds the answers',
    'Konfrontasi Lana dan Dimas — mereka bukan tamu biasa': 'Confront Lana and Dimas — they\'re not ordinary guests',
    'Cari jalan keluar alternatif — jendela lantai 2, menara, apapun': 'Find alternative exit — floor 2 windows, tower, anything',
    'Siapkan kelompok untuk event kedua — kali ini kita siap': 'Prepare the group for the second event — this time we\'re ready',
    'Bicara dengan Vira — dia pernah selamat. Dia tahu caranya.': 'Talk to Vira — she survived before. She knows how.',

    // ===================== CHAPTER 2 CHOICES =====================
    'Buka cloche dan baca amplop tanpa minum': 'Open the cloche and read the envelope without drinking',
    'Setuju — Reza jaga pintu, yang lain masuk dan mainkan': 'Agreed — Reza guards the door, the rest enter and play',
    'Aku yang jaga pintu. Reza lebih berguna di dalam.': 'I\'ll guard the door. Reza is more useful inside.',
    'Ikuti Vira': 'Follow Vira',
    'Biarkan dia — tetap jaga pintu': 'Let her go — keep guarding the door',
    'Masuk dan konfrontasi Vira': 'Enter and confront Vira',
    'Mundur. Simpan informasi ini. Vira sedang dipaksa seseorang.': 'Step back. Save this information. Vira is being forced by someone.',
    'Buka cloche-mu': 'Open your cloche',
    'Baca amplopmu': 'Read your envelope',
    'Tanya Niko langsung — apakah dia merencanakan ini?': 'Ask Niko directly — did he plan this?',
    'Tanya Reza soal pemecatan — bukan untuk menyerang, tapi untuk klarifikasi': 'Ask Reza about the dismissal — not to attack, but for clarification',
    'Bagikan kartumu terbuka dan minta semua orang melakukan hal yang sama': 'Share your card openly and ask everyone to do the same',
    'Diam dan observasi reaksi semua orang': 'Stay silent and observe everyone\'s reactions',
    'Lanjutkan diskusi — dengarkan reaksi yang lain': 'Continue the discussion — listen to the others\' reactions',
    'Lanjut ke diskusi utama': 'Continue to the main discussion',
    'Lanjut ke diskusi utama — semua orang perlu bicara': 'Continue to the main discussion — everyone needs to talk',
    'Tapi beberapa informasi ini berguna. Catat semuanya.': 'But some of this information is useful. Note everything.',
    'Vira tidak ada di meja. Di mana dia?': 'Vira is not at the table. Where is she?',
    'Lanjutkan diskusi — tapi dengan kewaspadaan ekstra': 'Continue the discussion — but with extra vigilance',
    'Cari Vira — keselamatan lebih penting dari permainan': 'Find Vira — safety is more important than the game',
    'Vira bisa jaga diri. Fokus di sini.': 'Vira can take care of herself. Focus here.',
    'Sebelum event ketiga dimulai — kita harus naik ke lantai 3 SEKARANG': 'Before the third event starts — we must go to floor 3 NOW',
    'Tetap bersama. Jangan terpecah. Apapun yang terjadi.': 'Stay together. Don\'t split up. Whatever happens.',
    'Kunci Dimas — dia tersangka utama untuk keracunan': 'Lock up Dimas — he\'s the main suspect for the poisoning',
    'Jaga korban. Tempatkan orang-orang terpercaya untuk berjaga giliran.': 'Guard the victims. Place trusted people to take turns watching.',
    'Cukup menunggu. Naik ke lantai 3 — tempat jawaban berada.': 'Enough waiting. Go up to floor 3 — where the answers are.',
    'Kai yang diserang. Sang Penenun mengincar hacker kita. Kita butuh plan B.': 'Kai was attacked. The Weaver targeted our hacker. We need plan B.',
    'Jangan minum apapun!': 'Don\'t drink anything!',

    // ===================== CHAPTER 3 CHOICES =====================
    'Ikut Juno — dobrak jalan keluar adalah prioritas': 'Join Juno — breaking out is the priority',
    'Abaikan debat — langsung naik ke lantai 3 selagi semua sibuk': 'Ignore the debate — go straight to floor 3 while everyone\'s busy',
    'Setuju — bagi tim. Aku pimpin investigasi.': 'Agreed — split the team. I\'ll lead the investigation.',
    'Naik ke lantai 3 — ruang kerja kakek Niko': 'Go up to floor 3 — Niko\'s grandfather\'s study',
    'Basement dulu — server di B-2 mengontrol semua kunci': 'Basement first — the server in B-2 controls all the locks',
    'Ke basement — dobrak pintu server kalau perlu': 'To the basement — break down the server door if necessary',
    'Bagi tim — Juno terus coba jendela, aku ke lantai 3': 'Split the team — Juno keeps trying windows, I go to floor 3',
    'Masuk Ruang Kerja — pusat operasi kakek Niko': 'Enter the Study — Niko\'s grandfather\'s operations center',
    'Kamar Tidur Tua — siapa yang tidur di sini?': 'Old Bedroom — who sleeps here?',
    'Ambil semua dokumen. Ini bukti yang cukup untuk menghancurkan siklus.': 'Take all documents. This is enough evidence to destroy the cycle.',
    'Foto dokumen dan cek ruangan lain': 'Photograph the documents and check other rooms',
    'Keluar dan hadapi — cukup bersembunyi': 'Get out and face it — enough hiding',
    'Kita harus kembali ke bawah. SEKARANG. Sebelum event berikutnya.': 'We must go back down. NOW. Before the next event.',
    'Periksa ruangan': 'Check the room',
    'Turun ke bawah. Sekarang. Sebelum terlambat.': 'Go downstairs. Now. Before it\'s too late.',
    'Simpan jurnal. Kembali untuk cek ruangan lain.': 'Keep the journal. Come back to check other rooms.',
    'Foto semuanya. Hancurkan patung. Akhiri ini.': 'Photograph everything. Destroy the statue. End this.',
    'Foto tapi jangan sentuh. Ini bukti untuk polisi.': 'Photograph but don\'t touch. This is evidence for the police.',
    'LARI ke lantai satu!': 'RUN to the first floor!',
    'Ambil alih sistem — buka semua kunci!': 'Take over the system — open all locks!',
    'Jangan sentuh — bisa jadi booby-trapped. Observasi dulu.': 'Don\'t touch — could be booby-trapped. Observe first.',
    'SHUTDOWN! Matikan semuanya!': 'SHUTDOWN! Turn everything off!',
    'LARI dari basement — event darurat bisa apa saja': 'RUN from the basement — emergency event could be anything',
    'LARI ke atas — pintu keluar terbuka! Kumpulkan semua orang!': 'RUN upstairs — exit is open! Gather everyone!',
    'BROADCAST melalui speaker:': 'BROADCAST through the speakers:',
    'Lari ke atas secepat mungkin untuk menolong Juno!': 'Run upstairs as fast as possible to help Juno!',
    'KELUAR! Sekarang!': 'GET OUT! Now!',
    'Panik mulai menyebar. Kau harus mengambil kendali.': 'Panic is spreading. You must take control.',
    'Diam. Biarkan kengerian meresap. Lalu bergerak.': 'Be still. Let the horror sink in. Then move.',
    'Presentasikan semua bukti yang kau kumpulkan — saatnya transparan': 'Present all evidence you\'ve gathered — time for transparency',
    'Voting — siapa yang paling dicurigai? Demokrasi dalam kegelapan.': 'Voting — who is most suspected? Democracy in the dark.',
    'Kabur ke hutan. Lebih baik kedinginan di luar daripada mati di dalam.': 'Flee to the forest. Better to freeze outside than die inside.',
    'Tidak ada lagi rencana. Temukan Sang Penenun dan akhiri ini.': 'No more plans. Find the Weaver and end this.',
    'Lanjut ke hutan — pasti ada jalan keluar': 'Continue into the forest — there must be a way out',
    'Kembali ke mansion. Lebih baik devil you know.': 'Return to the mansion. Better the devil you know.',
    'Kembali ke mansion dengan tekad baru': 'Return to the mansion with renewed determination',

    // ===================== CHAPTER 4 CHOICES =====================
    'Cari kunci master — ini bisa jadi jalan keluar nyata': 'Find the master key — this could be the real way out',
    'Ini jebakan lain. Fokus pada menemukan Sang Penenun.': 'This is another trap. Focus on finding the Weaver.',
    'Gabungkan kedua misi — cari kunci sambil mengikuti jejak Penenun': 'Combine both missions — search for the key while following the Weaver\'s trail',
    'Abaikan kedua opsi — bangun pertahanan dan tunggu fajar': 'Ignore both options — build defenses and wait for dawn',
    'Ke hidden room di sayap timur': 'To the hidden room in the east wing',
    'Cari secara sistematis — mulai dari area yang belum dijelajahi': 'Search systematically — start from unexplored areas',
    'Ambil walkie-talkie — kita bisa mendengarkan komunikasi mereka': 'Take the walkie-talkie — we can listen to their communications',
    'Foto-foto Arya di dinding... ini personal. Periksa semuanya.': 'Photos of Arya on the wall... this is personal. Check everything.',
    'Keluar dari hidden room — SEKARANG!': 'Get out of the hidden room — NOW!',
    'Tutup panel dari dalam. Sembunyi. Dengarkan.': 'Close the panel from inside. Hide. Listen.',
    'Keluar saat aman dan kembali ke kelompok dengan bukti baru': 'Leave when safe and return to the group with new evidence',
    'Ini mengubah segalanya. Aku BUKAN korban — aku alat mereka. Waktunya mengubah narasi.': 'This changes everything. I\'m NOT a victim — I\'m their tool. Time to change the narrative.',
    'Simpan kunci. Kita keluar BERSAMA atau tidak sama sekali.': 'Keep the key. We leave TOGETHER or not at all.',
    'Langsung ke pintu keluar. Sekarang. Sebelum diambil orang lain.': 'Straight to the exit. Now. Before someone else takes it.',
    'Keluar sendirian. Kau sudah cukup menderita.': 'Leave alone. You\'ve suffered enough.',
    'Lanjut bertahan — sekarang dengan kelompok yang lebih kecil': 'Keep defending — now with a smaller group',
    'Pasang jebakan untuk Sang Penenun — biarkan dia datang kepada kita': 'Set a trap for the Weaver — let him come to us',
    'Konfrontasi langsung — kumpulkan semua orang dan paksa Penenun membuka diri': 'Direct confrontation — gather everyone and force the Weaver to reveal himself',
    'Eksekusi rencana — aku berjalan ke Galeri sebagai bait': 'Execute the plan — I walk to the Gallery as bait',
    'Tunggu reaksi. Siapa yang bergerak lebih dulu?': 'Wait for reactions. Who moves first?',
    'Tetap bertahan — tapi mulai interogasi semua orang di dalam': 'Keep defending — but start interrogating everyone inside',
    'Strategi berubah — keluar dari barricade dan cari jawaban': 'Strategy changes — leave the barricade and find answers',
    'CUKUP. Waktunya memburu balik.': 'ENOUGH. Time to hunt back.',
    'Bawa manuscript ini ke kelompok. Bukti paling kuat.': 'Bring this manuscript to the group. The strongest evidence.',
    'Konfrontasi langsung — sekarang kita tahu siapa musuh kita': 'Direct confrontation — now we know who our enemy is',
    'Periksa Juno dan kembali ke kelompok': 'Check on Juno and return to the group',

    // ===================== CHAPTER 5 CHOICES =====================
    'Presentasikan bukti secara sistematis — bangun kasus': 'Present evidence systematically — build the case',
    'Langsung konfrontasi — tunjuk tersangka dan paksa reaksi': 'Direct confrontation — point at the suspect and force a reaction',
    'Tunggu reaksi mereka — biarkan kebenaran bekerja': 'Wait for their reactions — let the truth do its work',
    'Tuntut penjelasan — kenapa?': 'Demand an explanation — why?',
    'Cek ponsel — apa yang Sang Penenun kirim?': 'Check phone — what did the Weaver send?',
    'Hadapi dia. Akhiri ini malam ini.': 'Face him. End this tonight.',
    'Ambil semua bukti digital dari monitor dan LARI ke atas': 'Grab all digital evidence from the monitor and RUN upstairs',
    'Dengarkan dia. Mungkin ada informasi yang bisa menyelamatkan nyawa.': 'Listen to him. Maybe there\'s information that could save lives.',
    'Sampai ke lantai satu tepat waktu!': 'Reach the first floor in time!',
    'Cukup melihat orang mati. Waktunya mengakhiri ini.': 'Enough watching people die. Time to end this.',
    'Semua keluar dari mansion — sekarang, apapun risikonya': 'Everyone out of the mansion — now, whatever the risk',
    'Lana benar. Kita selesaikan ini malam ini.': 'Lana is right. We finish this tonight.',
    'Nyawa lebih penting dari prinsip. KELUAR.': 'Lives are more important than principles. GET OUT.',

    // ===================== CHAPTER 6 CHOICES =====================
    'Turun ke B-3 dan konfrontasi langsung Ragil — akhiri di akarnya': 'Go down to B-3 and confront Ragil directly — end it at the root',
    'Bakar mansion. Hancurkan server, bukti, dan sistem. Api yang memurnikan.': 'Burn the mansion. Destroy the servers, evidence, and systems. Purifying fire.',
    'Rencana berbeda — kirim bukti digital ke luar sebelum menghancurkan apapun': 'Different plan — send digital evidence out before destroying anything',
    'Hancurkan semuanya — fisik. Cabut kabel, hancurkan server, tutup akses B-3 permanen.': 'Destroy everything — physically. Pull cables, smash servers, seal B-3 access permanently.',
    'Bawa Ragil ke atas sebagai saksi hidup': 'Bring Ragil upstairs as a living witness',
    'Tinggalkan dia di bawah. Kunci aksesnya. Biar dia membusuk di sini.': 'Leave him down there. Lock the access. Let him rot here.',
    'Simpan semua data. Ini senjata untuk setelah malam ini selesai.': 'Save all data. This is a weapon for after tonight is over.',
    'Ke atas. Habiskan sisa malam ini di antara cahaya, bukan kegelapan.': 'Go up. Spend the rest of tonight among light, not darkness.',
    'Pastikan semua orang keluar sebelum api menyebar!': 'Make sure everyone gets out before the fire spreads!',
    'Turun ke B-3 dulu — pastikan Ragil tidak keluar': 'Go down to B-3 first — make sure Ragil doesn\'t get out',
    'Tonton mansion terbakar. Lalu jalan ke fajar.': 'Watch the mansion burn. Then walk toward dawn.',
    'Ragil keluar hidup. Bukti hidup untuk dunia.': 'Ragil comes out alive. Living proof for the world.',
    'Eksekusi broadcast — upload semuanya': 'Execute broadcast — upload everything',
    'Data aman. Sekarang — menghadapi fajar.': 'Data is safe. Now — face the dawn.',

    // ===================== CHAPTERS 7-10 CHOICES =====================
    'Tunggu bantuan — pasti ada yang melihat api atau mendengar sesuatu': 'Wait for help — someone must have seen the fire or heard something',
    'Jalan kaki ke kota terdekat — jangan menunggu': 'Walk to the nearest town — don\'t wait',
    'Sebelum pergi — satu hal terakhir yang harus diselesaikan': 'Before leaving — one last thing to settle',
    'Menuju ending...': 'Heading to the ending...',
    'Sekarang, akhirnya — pergi dari sini': 'Now, finally — leave this place',
    'Lanjutkan ke fase berikutnya...': 'Continue to the next phase...',
    'Kumpulkan semua yang tersisa — kita butuh rencana': 'Gather everyone remaining — we need a plan',
    'Waktu berpencar — cari petunjuk sebanyak mungkin sebelum fajar': 'Time to spread out — find as many clues as possible before dawn',
    'Tidak ada yang bisa dipercaya. Aku bergerak sendiri.': 'No one can be trusted. I move alone.',
    'Lanjutkan...': 'Continue...',
    'Terus bergerak — cari petunjuk dan hadapi ancaman': 'Keep moving — find clues and face threats',
    'Satu jam tersisa — kerahkan segalanya': 'One hour left — give it everything',
    'Cari posisi defensif — bertahan sampai fajar': 'Find a defensive position — hold out until dawn',
    'Saatnya berburu — habisi semua ancaman': 'Time to hunt — eliminate all threats',
    'Menuju babak terakhir...': 'Heading to the final act...',
    'Keluar dari mansion — sekarang juga': 'Get out of the mansion — right now',
    'Tunggu pertolongan di sini': 'Wait for help here',
    'Lihat ending...': 'View ending...',

    // ===================== ENDING HINTS =====================
    'Eliminasi SEMUA killer, kumpulkan 5+ petunjuk, 4+ survivor hidup, moral positif.': 'Eliminate ALL killers, collect 5+ clues, 4+ survivors alive, positive morals.',
    'Eliminasi SEMUA killer, temukan SEMUA 8 petunjuk pelarian.': 'Eliminate ALL killers, find ALL 8 escape clues.',
    'Eliminasi SEMUA killer, kumpulkan 2-4 petunjuk, 2+ survivor hidup.': 'Eliminate ALL killers, collect 2-4 clues, 2+ survivors alive.',
    'Player mati, tapi 3+ survivor selamat dan 3+ petunjuk terkumpul.': 'Player dies, but 3+ survivors survive and 3+ clues collected.',
    'Vira hidup, 4+ survivor selamat, menang lewat pelarian atau eliminasi killer.': 'Vira alive, 4+ survivors survive, won through escape or killer elimination.',
    'SEMUA killer mati, tapi 3+ petunjuk dihancurkan, petunjuk < 5.': 'ALL killers dead, but 3+ clues destroyed, clues < 5.',
    'SEMUA killer mati, tapi 3+ kematian terjadi, survivor tersisa <= 3.': 'ALL killers dead, but 3+ deaths occurred, survivors remaining <= 3.',
    'Lana (killer) mati, moral positif. Lana memilih penebusan.': 'Lana (killer) dies, positive morals. Lana chose redemption.',
    'Vira hidup, 3+ survivor selamat, player bukan Vira.': 'Vira alive, 3+ survivors survive, player is not Vira.',
    'SEMUA killer mati, tapi petunjuk < 3. Sang Penenun lolos.': 'ALL killers dead, but clues < 3. The Weaver escapes.',
    '8+ karakter hidup, tapi moral sangat rendah (< -5).': '8+ characters alive, but morals very low (< -5).',
    '2-4 survivor selamat, game berakhir saat fajar tanpa resolusi.': '2-4 survivors survive, game ends at dawn without resolution.',
    'Niko hidup dan BUKAN killer. Pewaris yang memilih sisi benar.': 'Niko alive and NOT a killer. The heir who chose the right side.',
    'Rata-rata trust < 25, 2+ kematian terjadi. Kepercayaan runtuh total.': 'Average trust < 25, 2+ deaths occurred. Trust completely collapsed.',
    'Killer masih hidup, Sera hidup, killer menang. Salah tuduh.': 'Killer still alive, Sera alive, killer wins. False accusation.',
    'Player hidup, tapi killer menang. Siklus berlanjut.': 'Player alive, but killer wins. The cycle continues.',
    'Dimas (killer) hidup, killer menang atau player kalah.': 'Dimas (killer) alive, killer wins or player loses.',
    'Player hidup tapi sendirian, 5+ kematian. Hampir semua mati.': 'Player alive but alone, 5+ deaths. Almost everyone dead.',
    'Player memilih keluar sebelum misi selesai. Pelarian tanpa resolusi.': 'Player chose to leave before mission complete. Escape without resolution.',
    'Player melarikan diri sendirian, meninggalkan semua orang.': 'Player escapes alone, leaving everyone behind.',
    'Player (Arya) mati, tapi 2+ survivor selamat. Mati sebagai pahlawan.': 'Player (Arya) dies, but 2+ survivors survive. Died as a hero.',
    'Player hidup, petunjuk <= 1, masih chapter awal (1-3).': 'Player alive, clues <= 1, still in early chapters (1-3).',
    'Lana (killer) selamat, identitas tersembunyi, player tidak menang.': 'Lana (killer) survives, identity hidden, player doesn\'t win.',
    'Sera hidup, game berakhir saat fajar. Profiling dimanfaatkan musuh.': 'Sera alive, game ends at dawn. Profiling exploited by the enemy.',
    '7+ karakter hidup, moral sangat rendah (< -10). Semua memilih diam.': '7+ characters alive, morals very low (< -10). Everyone chose silence.',
    'Kumpulkan 5+ petunjuk atau temukan Kunci Master, player hidup, menang lewat pelarian.': 'Collect 5+ clues or find Master Key, player alive, won through escape.',
    'SEMUA killer dieliminasi lewat combat, 3+ survivor hidup.': 'ALL killers eliminated through combat, 3+ survivors alive.',
    '2+ killer, SEMUA killer mati, ada killer yang saling bunuh (betrayal).': '2+ killers, ALL killers dead, there were killers who killed each other (betrayal).',
    'Killer menghancurkan cukup petunjuk sehingga pelarian mustahil.': 'Killer destroyed enough clues making escape impossible.',
    'SEMUA killer mati, tapi hanya 1 survivor tersisa. Kemenangan sendirian.': 'ALL killers dead, but only 1 survivor remains. Victory alone.',

    // ===================== ENDING HOOKS =====================
    '"Kau akan tahu mengapa kakeknya membangun mansion ini..."': '"You will know why his grandfather built this mansion..."',
    '"Yang tersembunyi bukan hanya identitas pembunuh..."': '"What\'s hidden is not just the killer\'s identity..."',
    '"Mereka selamat. Tapi apakah keselamatan cukup ketika kebenaran masih tersembunyi?"': '"They survived. But is survival enough when the truth is still hidden?"',
    '"Cintanya memberikan apa yang logika tidak bisa..."': '"Her love gave what logic couldn\'t..."',
    '"Lonceng gereja berbunyi. Tapi tidak ada yang berdoa..."': '"The church bell rings. But no one prays..."',
    '"Kebenaran ada harga. Dan harga itu dibayar dengan darah..."': '"Truth has a price. And that price is paid in blood..."',
    '"Apakah kemenangan yang menyakiti masih disebut kemenangan?"': '"Is a victory that hurts still called a victory?"',
    '"Pena lebih tajam dari pisau — dan Lana memilih pena..."': '"The pen is sharper than the knife — and Lana chose the pen..."',
    '"Enam bulan menghilang bukan karena ditangkap — tapi karena bersembunyi..."': '"Six months missing not because she was captured — but because she was hiding..."',
    '"Kau menang. Tapi lihatlah apa yang tersisa..."': '"You won. But look at what remains..."',

    // ===================== MORE DIALOGUE =====================
    'Gue udah cukup. Gue nggak mau main detective lagi. Gue mau KELUAR.': 'I\'ve had enough. I don\'t want to play detective anymore. I want OUT.',
    'Lo semua boleh stay dan solve mystery kayak ini film Netflix. Gue mau pecahin jendela, dobrak pintu, apapun. Siapa yang ikut?': 'You all can stay and solve the mystery like some Netflix movie. I\'m gonna smash windows, break down doors, whatever. Who\'s with me?',
    'Demokrasi yang indah. Tapi pembunuh tidak tunduk pada suara mayoritas.': 'Beautiful democracy. But killers don\'t bow to majority rule.',

    // Chapter narration sounds
    'Mansion Wardhana terasa semakin kecil setiap menitnya.': 'Wardhana Mansion feels smaller with each passing minute.',
    'Mansion berubah. Bukan hanya metafora — secara literal, koridor-koridor yang tadi terbuka sekarang tertutup.': 'The mansion has changed. Not just metaphorically — literally, corridors that were open are now closed.',
    'Satu jam berlalu. Satu jam yang terasa seperti satu tahun.': 'One hour has passed. An hour that felt like a year.',

    // Misc action labels in engine
    'Risiko': 'Risk',
    'Hasil': 'Reward',
    'Peluang': 'Chance',
    'Ronde': 'Round',
    'Petunjuk': 'Clues',
    'Bahaya': 'Danger',
    'setuju': 'agree',
    'tolak': 'reject',
    'VOTING BERHASIL': 'VOTE SUCCEEDED',
    'VOTING GAGAL': 'VOTE FAILED',
    'Voting GAGAL': 'Vote FAILED',
    'SEMUA KILLER TELAH DIELIMINASI': 'ALL KILLERS HAVE BEEN ELIMINATED',
    'Protagonis menang': 'Protagonist wins',
    'ditemukan di': 'found at',
    'Kau berpindah ke': 'You moved to',
    'Kau melihat': 'You see',
    'di sini': 'here',
    'Kau mengambil': 'You picked up',
    'sekutu menguatkan bukti': 'allies strengthened the evidence',
    'Tuduhan berhasil': 'Accusation succeeded',
    'Tuduhanmu tidak meyakinkan': 'Your accusation wasn\'t convincing',
    'Orang tak bersalah tereliminasi': 'An innocent person was eliminated',
    'BUKAN killer': 'is NOT a killer',
    'terbunuh oleh': 'killed by',
    'mengeksekusi': 'executes',
  };

  // ---- Lookup function ----
  function t(text) {
    if (!text || !subtitlesEnabled) return '';
    // Strip HTML tags for lookup
    const plain = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // Try exact match first
    if (DICT[plain]) return DICT[plain];
    if (UI[plain]) return UI[plain];
    if (ENDING_TITLES[plain]) return ENDING_TITLES[plain];
    if (CHAR_PROFILES[plain]) return CHAR_PROFILES[plain];
    // Try partial match (for text with dynamic parts)
    for (const [key, val] of Object.entries(DICT)) {
      if (plain.includes(key) || key.includes(plain)) return val;
    }
    return '';
  }

  // Translate UI element
  function translateUI(el) {
    if (!el) return;
    const text = el.textContent.trim();
    const en = UI[text] || DICT[text] || CHAR_PROFILES[text];
    if (en) {
      if (!el.dataset.origText) el.dataset.origText = text;
      el.dataset.enText = en;
    }
  }

  // Get subtitle HTML for a text
  function getSubtitle(text) {
    if (!subtitlesEnabled) return '';
    const en = t(text);
    if (!en) return '';
    return `<div class="en-subtitle">${en}</div>`;
  }

  // Get English translation for choice text
  function translateChoice(text) {
    if (!subtitlesEnabled) return '';
    const en = t(text);
    if (!en) return '';
    return en;
  }

  return {
    isEnabled, toggle, setEnabled, swapStaticText,
    t, translateUI,
    UI, DICT, ENDING_TITLES, CHAR_PROFILES
  };
})();
