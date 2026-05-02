# SIMPUL TERAKHIR

**Post-modern psychological horror/thriller fully interactive game — Bahasa Indonesia**

> *Sepuluh tamu. Satu mansion. Tiga simpul yang harus terputus. Siapa Sang Penenun?*

[▶ Mainkan Sekarang](https://yowanda.github.io/simpulterakhir/)

### Compact Edition
- **3 pilihan fokus** per ronde — survivor & killer mendapat opsi strategis yang seimbang
- **28 ending ringkas** — narrative core tetap intact, tanpa eksposisi berlebihan
- UI optimized untuk pilihan yang lebih sedikit tapi lebih impactful

---

## Sinopsis

Undangan itu datang dalam amplop hitam, tanpa perangko, tanpa alamat pengirim. Sepuluh orang — masing-masing dengan alasan berbeda — tiba di **Mansion Wardhana**, estate terisolasi di tebing yang menghadap lautan.

**Niko Wardhana**, pewaris mansion, mengklaim ini adalah pameran seni imersif. Tapi saat pintu-pintu terkunci dan countdown dimulai, kebenaran terungkap: mansion ini telah menjadi arena **"simpul"** selama 50 tahun. Setiap tahun, tamu diundang. Beberapa tidak pernah kembali.

Di balik semua ini berdiri **Sang Penenun** — dalang anonim yang menenun jaringan kematian selama setengah abad. Dan malam ini, tiga simpul harus terputus sebelum fajar.

**Genre:** Post-modern psychological horror/thriller — terinspirasi *Scream*, *Knives Out*, *Saw*, dan *Black Mirror*. Bukan horor supernatural klasik, tapi mind-games, konspirasi, dan keputusan moral yang menentukan siapa yang hidup dan siapa yang mati.

---

## Fitur

### Gameplay & Cerita
- **6 chapter** dengan percabangan kompleks (Prolog + Bab 1-5) — auto-advance setiap 6 ronde
- **Anti-Loop System** — NPC dipaksa pindah jika terlalu lama di satu lokasi, game auto-escalate setiap ronde
- **Hard cap 25 ronde** — game pasti selesai, tidak ada infinite loop
- **Escalation System** — tension NPC naik setiap ronde, chapter auto-advance, killer lebih agresif
- **28 ending naratif** — trigger otomatis berdasarkan kondisi game (S/A/B/C/D/F rating)
- **Condition-based ending system** — ending dipilih berdasarkan state: killer hidup/mati, survivor yang selamat, clue ditemukan, moral score, trust level, dan lainnya
- **Ringkasan game otomatis** — tampilkan siapa yang tereliminasi, siapa yang menang, dan statistik permainan + cerita ending naratif
- **Auto-simulasi** — jika player mati, NPC melanjutkan permainan sampai ada pemenang
- **Force relocate** — setelah clue ditemukan/dihancurkan, semua NPC di lokasi itu pindah otomatis
- **3 tingkat kesulitan** yang mengubah jumlah killer:
  - **Mudah**: 1 killer (Lana)
  - **Normal**: 2 killers (Lana + Dimas)
  - **Sulit**: 3 killers (Lana + Dimas + Niko)
- **10 karakter** (5 main + 5 side) dengan profil mendalam dan hubungan kompleks
- **Sistem pemilihan peran** — pilih Killer (karakter spesifik) atau Survivor (karakter acak):
  - **Killer**: Pilih Lana, Dimas, atau Niko (tergantung difficulty) — pengalaman antagonist. Identitas semua killer dan survivor terlihat jelas di status bar.
  - **Survivor**: Dapat salah satu dari 7-9 protagonist secara acak. Identitas killer **tersembunyi** — nama killer tidak ditampilkan di status bar dan chat bubble killer tidak dibedakan warnanya. Killer hanya terungkap melalui mekanik in-game (investigasi, tuduhan, dll).
  - Setiap karakter punya **kemampuan pasif unik** yang seimbang:

| Karakter | Role | Kemampuan Pasif |
|----------|------|-----------------|
| Arin | Investigator | +20% pencarian petunjuk |
| Sera | Profiler | Lihat emosi & tension NPC dengan presisi |
| Niko | Tuan Rumah | +1 jalur gerakan ekstra (jalan rahasia) |
| Juno | Pemberontak | +20% defense, +15% flee |
| Vira | Saksi Selamat | Mulai dengan 2 lokasi clue diketahui |
| Reza | Detektif | +15% akurasi tuduhan, +10% deteksi |
| Kira | Hacker | +25% investigasi digital |
| Farah | Pewaris | +15% trust gain, +10% aliansi |
| Lana | Dalang (Killer) | +20% framing, -15% kecurigaan |
| Dimas | Operator (Killer) | +15% kill, silent elimination |
- **Layer emosional mendalam:**
  - **Percintaan** — Arin↔Sera (unspoken love), Niko↔Vira (toxic ex), Juno↔Reza (unexpected connection), Dimas→Sera (obsesi), Lana↔Niko (seductive manipulation)
  - **Egoisme** — self-preservation vs group survival, setiap karakter punya harga
  - **Manipulasi** — gaslighting, misdirection, psychological control (terutama Lana & Niko)
  - **Dalang** — puppet master moves, hidden agendas, karakter yang mengontrol narasi
  - **Negosiator** — Reza & Farah broker deals under life-or-death pressure
  - **Ceroboh** — fatal mistakes dari keputusan impulsif (Juno, Dimas)
  - **Eksentrik** — unpredictable wildcard behavior (Kira, Vira)
  - **Pemantik Konflik** — Juno yang meledak-ledak, Lana yang provokatif dengan dark humor
- **Sistem trust** — kepercayaan antar karakter berubah berdasarkan pilihan
- **Sistem moral** — pilihan etis mempengaruhi ending
- **Sistem awareness** — seberapa banyak Arin mengetahui kebenaran
- **Sistem danger** — level bahaya meningkat berdasarkan keputusan berisiko
- **Karakter bisa mati** — keputusan salah punya konsekuensi permanen
- **Auto-save** — progress tersimpan otomatis di browser

### NPC Brain System (Baru!)
- **Character AI Database** — setiap NPC punya "otak" sendiri dengan decision tree berbasis database
- **State Machine Emosional** — NPC berubah state: calm → wary → suspicious → panicked → hostile
- **Killer AI** — killer NPC punya state khusus: stalking → hunting → executing
- **NPC Bertindak Mandiri** — setiap ronde, NPC membuat keputusan sendiri berdasarkan:
  - Kepribadian (aggression, caution, loyalty, cunning, empathy, impulsiveness)
  - Emosi saat ini dan level tension
  - Lokasi di mansion (8 lokasi yang terhubung)
  - Siapa yang ada di dekat mereka
  - Clue yang sudah ditemukan
  - Aliansi dan musuh
- **700+ Decision Entries** — 45-65 keputusan per karakter survivor + 39-41 per killer (termasuk player-reactive branches, chapters 4-5 endgame) dengan weighted random selection + catch-all fallbacks
- **Sistem Win/Loss Dinamis** — hasil ditentukan oleh aksi NPC, bukan ending pre-scripted:
  - **Protagonis Menang**: Eliminasi semua killer ATAU kumpulkan **5 dari 8 petunjuk** → semua killer terungkap & dieksekusi ATAU temukan **Kunci Master** (5% chance muncul di lokasi acak) → misi petunjuk langsung selesai
  - **Killer Menang**: Eliminasi protagonis hingga tersisa 1 ATAU hancurkan cukup petunjuk agar protagonist tak bisa capai 5
  - **Killer Kalah**: Semua killer tereliminasi
    - **Saksi + Buru + Eksekusi**: Jika killer ketahuan membunuh (ada saksi), killer langsung DIBURU oleh SEMUA survivor. Jika ditemukan di ruangan dengan 2+ survivor → DIEKSEKUSI. Killer hanya selamat jika berhasil kabur dan sembunyi SENDIRIAN.
  - **Survivor Melawan**: Jika killer menyerang di ruangan dengan 2+ survivor → killer MATI (survivor fight back). Berlaku juga saat killer mencoba kill di room penuh.
  - **2 Killer vs 1 Survivor**: Jika 2+ killer di ruangan dengan 1 survivor → survivor 100% mati, tidak ada kesempatan
  - **Killer Strategi**: Killer TIDAK BISA bantu/lindungi survivor (hard-blocked oleh sistem). Fokus: memisahkan kelompok (divide, isolate, manipulate, distract) lalu membunuh target yang sendirian. Killer juga bisa menghancurkan petunjuk pelarian.
  - **Difficulty-Based Win Rate**: Protagonist punya advantage lebih besar per difficulty:
    - **Easy**: +15% bonus defense, search, dan attack untuk protagonist
    - **Normal**: +10% bonus
    - **Hard**: +5% bonus
  - **Auto-Simulasi**: Jika player tereliminasi, NPC brain melanjutkan sampai ada pemenang
  - **Ringkasan Akhir**: Tampilkan semua karakter — siapa hidup, siapa mati, role masing-masing
- **Trust-Kill Mechanic** — NPC bisa membunuh NPC lain karena ketidakpercayaan:
  - Jika trust antar NPC sangat rendah (≤15) dan salah satunya sudah jadi enemy, NPC bisa menyerang
  - Memecah belah tim protagonis — konflik internal berbahaya saat killer masih hidup
  - Setiap karakter punya gaya trust-kill unik (Juno impulsif, Sera analitis, Niko kalkulatif, dll)
  - Saksi trust-kill kehilangan kepercayaan ke penyerang — spiral ketidakpercayaan
- **NPC Encounters** — NPC bertemu satu sama lain, membentuk aliansi, atau saling menyerang
- **NPC Action Log** — panel real-time untuk melihat apa yang dilakukan setiap NPC
- **Dynamic Choices** — pilihan baru muncul berdasarkan aksi NPC (tuduh, aliansi, serang, investigasi)
- **Tidak pakai AI live** — semua diatur oleh branching database, bukan generative AI

### NPC Background Activity System (Autonomous Intelligence)
NPC tidak hanya bereaksi — mereka **aktif berpikir dan bertindak di background** setiap ronde, menciptakan drama dan tensi tanpa input pemain:
- **Suspicion Gossip** — NPC di lokasi yang sama saling berbagi kecurigaan. Jika NPC A curiga ke X (>30%), NPC B di sebelahnya juga jadi curiga (+15% influence). Informasi menyebar seperti jaringan gosip
- **Passive Investigation** — Survivor NPC secara pasif mendeteksi killer yang ada di lokasi sama (12-25% chance tergantung difficulty). Pemegang clue lebih jeli (+10% bonus). Suspicion naik otomatis tanpa aksi eksplisit
- **Killer Alibi Building** — Killer NPC aktif membangun alibi saat dekat NPC non-enemy: suspicion turun -3~7% dan NPC di sekitar jadi kurang curiga
- **Killer Counter-Play** — Saat suspicion killer tinggi (>30%), mereka secara halus mengalihkan kecurigaan ke scapegoat (+5~10% suspicion ke target lain)
- **Witness Memory Spread** — NPC yang menyaksikan pembunuhan akan menceritakan ke semua NPC di lokasi yang sama: suspicion target +15%, otomatis jadi enemy
- **Trust Decay** — Setelah ada kematian, trust antar NPC yang bukan ally perlahan turun. Semakin banyak kematian, semakin cepat decay
- **Spontaneous Confrontation** — NPC dengan suspicion >55% terhadap NPC lain bisa mengonfrontasi secara spontan (20% chance). Jika benar → suspicion +8%, jika salah → trust turun
- **Tense Encounters** — Ketika NPC bertemu orang yang sangat dicurigai (>60%), terjadi encounter dramatik dengan narasi ketegangan
- **Max 3 background events per ronde** — mencegah spam narasi, hanya event paling impactful yang ditampilkan

### Player-Aware Brain Tree System (Dynamic Story Connection)
NPC bukan hanya bereaksi secara generik — mereka **bereaksi spesifik terhadap karakter yang dipilih pemain** dan gaya bermain pemain:

**Player-Reactive Decision Branches:**
- Setiap karakter (10 survivor + 3 killer) punya **cabang keputusan khusus** yang trigger berdasarkan:
  - `playerNearby` — apakah pemain ada di lokasi yang sama
  - `playerLastAction` — aksi terakhir pemain (investigate, accuse, move, talk, vote, ally)
  - `playerIsAlly/playerIsEnemy` — hubungan NPC dengan pemain
  - `minPlayerSusp` — level kecurigaan NPC terhadap pemain
- **Contoh reaksi per archetype:**
  - **Arya (Investigator)**: Membantu investigasi pemain, berbagi bukti, menginterogasi jika curiga
  - **Sera (Profiler)**: Membaca body language pemain, profiling psikologis, berbagi analisis
  - **Juno (Rebel)**: Langsung mendukung/menentang tanpa pikir panjang, loyalitas absolut
  - **Niko (Mastermind)**: Manipulasi halus, berbagi info strategis ke ally, menyebarkan rumor ke enemy
  - **Vira (Survivor)**: Mengikuti pemain yang kuat, kabur dari yang dicurigai, trauma-driven reaction
  - **Reza (Detective)**: Interogasi profesional, berbagi timeline, menahan tuduhan prematur
  - **Kai (Hacker)**: Menyediakan bukti digital, cek alibi lewat log, track pergerakan
  - **Farah (Heiress)**: Menawarkan resource/akses, mengancam dengan otoritas, negosiasi
  - **Lana (Killer)**: Mengalihkan investigasi, frame pemain, redirect suspicion
  - **Dimas (Killer)**: Menanam bukti palsu, menawarkan "bantuan" forensik palsu
  - **Niko (Killer)**: Mengarahkan ke jalan buntu, mengunci koridor, memanipulasi infrastruktur

**Player Action Influence System:**
- Game melacak **10 aksi terakhir pemain** (`playerActionHistory`)
- NPC menganalisis pola bermain pemain secara real-time:
  - **Pemain investigatif** (3+ investigate/observe) → NPC ikut terinspirasi mencari bukti, suspicion killer naik
  - **Pemain agresif** (2+ accuse/attack/vote) → NPC jadi lebih berani bertindak, tension naik
  - **Pemain sosial** (3+ talk/ally) → Trust dengan NPC naik lebih cepat, aliansi terbentuk lebih mudah

**Player-Aware Background Events:**
- NPC di lokasi pemain bereaksi spesifik terhadap aksi terakhir pemain (40% chance per NPC)
- NPC di lokasi lain membicarakan pemain di background (gossip positif/negatif berdasarkan trust/suspicion)
- Killer NPC aktif menargetkan pemain — redirect suspicion, framing, manipulasi
- Personality clash/sync events — interaksi unik berdasarkan kombinasi archetype pemain dan NPC
- Event prioritas: player-relevant events diprioritaskan (max 2 player + 2 general = 4 per ronde)

**Pemain Bisa Kalah:**
- NPC survivor bisa salah curiga ke pemain → trust drop, bahkan trust-kill
- NPC killer redirect suspicion ke pemain → pemain jadi target voting
- NPC bisa memulai voting eliminasi terhadap pemain jika suspicion tinggi
- Spontaneous confrontation dari NPC → pemain harus hati-hati dengan setiap aksi

### WhatsApp-Style Chat UI (Dialog-Only Mode)
- **100% Dialog-Focused** — cerita dibangun SEPENUHNYA lewat percakapan antar karakter. Narasi panjang dihilangkan total. Plot berkembang lewat dialog, bukan novel
- **Group Chat Header** — header ala WhatsApp group chat: nama chapter sebagai nama grup, daftar member yang masih hidup di bawahnya
- **Encrypted Notice** — pesan "terenkripsi end-to-end" seperti WhatsApp asli di awal chat
- **WhatsApp Dark Mode** — tampilan gelap ala WhatsApp: background chat wallpaper, bubble hijau teal (player) dan abu-abu gelap (NPC)
- **Player di Kanan** — pesan karakter yang dimainkan muncul di sisi kanan dengan bubble hijau WhatsApp (#005c4b)
- **NPC di Kiri** — pesan NPC lain muncul di sisi kiri dengan bubble gelap (#202c33)
- **Timestamp & Read Receipt** — setiap bubble punya timestamp dan tanda centang biru (player), seperti WhatsApp asli
- **Killer Bubble** — karakter killer punya bubble dengan tint merah gelap yang menacing
- **Action Messages** — aksi singkat karakter (tanpa dialog) ditampilkan sebagai teks italic di tengah, seperti status WhatsApp
- **System Messages** — event NPC (kematian, aliansi, penemuan clue) ditampilkan sebagai notifikasi grup dengan emoji kontekstual (💀☠️🤝🔍🎭💣)
- **Location Header** — detail lokasi karakter dan siapa yang ada di sekitar ditampilkan sebagai system pill
- **Staggered Message Reveal** — pesan muncul satu per satu dengan animasi fade-in smooth
- **Auto-detect Dialog** — kalimat dialog tanpa tag speaker otomatis terdeteksi dan ditampilkan sebagai bubble player
- **Choices di Bawah** — pilihan interaktif muncul di area bawah layar (fixed), seperti input area WhatsApp
- **Click-to-Skip** — klik area cerita untuk langsung tampilkan semua teks
- **Responsive** — avatar, font, dan layout otomatis menyesuaikan di mobile

### Framing & Divide Mechanic
- **Framing** — killer bisa menanamkan bukti palsu ke target (45% chance sukses):
  - **Sukses**: Target suspicion +20-30%, trust dengan NPC lain hancur (-25), NPC tandai target sebagai MUSUH, target kehilangan semua allies, tension +20
  - **Gagal**: Suspicion KILLER naik +15%, NPC sekitar jadi curiga ke killer (+12)
  - Killer yang sudah revealed TIDAK bisa frame (semua sudah tahu)
  - Frame chance turun seiring suspicion naik (susah framing saat sudah dicurigai)
- **Divide** — killer NPC bisa memecah kelompok survivor (60% chance pindahkan survivor ke lokasi random)

### Suspicion System (Optimized)
- **Diminishing Returns** — suspicion di atas 60% lebih susah naik (contoh: +20 di level 80% jadi ~+18)
- **Chapter Scaling** — chapter 0-1: gain x0.7, chapter 2: gain x0.85 (build-up bertahap)
- **Reduction Boost** — suspicion turun lebih efektif saat level tinggi (x1.2 di atas 70%)
- **Natural Decay** — setiap round, suspicion turun -2/-3 poin otomatis (kecuali killer yang sudah terbukti — itu permanent)
- **Semua suspicion value di-rebalance** — lebih gradual, tidak ada lagi spike +30/+35 dari satu aksi

### Pemburu Mechanic (Baru!)
- **Trigger**: Saat petunjuk pelarian **pertama** ditemukan → random survivor ditunjuk sebagai **Pemburu**
- **Pemburu persistent** — satu orang yang sama sepanjang game (`state.pemburu`)
- **Identitas Tersembunyi** — role Pemburu TIDAK diketahui survivor lain sampai Pemburu melakukan eksekusi pertama
- **Auto-Eksekusi**: Jika ada karakter (killer ATAU survivor) dengan suspicion >80% → Pemburu otomatis menembak target dengan suspicion tertinggi
- **Berlaku untuk SEMUA** — killer dan survivor innocent bisa jadi korban pemburu
  - Jika target benar killer: "Tembakan tepat!"
  - Jika target innocent: "SALAH SASARAN!" — survivor tewas
- **Pemburu Terungkap** — identitas Pemburu baru terungkap kepada semua survivor saat Pemburu **pertama kali** melakukan eksekusi
- **Pemburu Proteksi** — Pemburu melindungi survivor dari serangan killer:
  - Killer menyerang survivor saat **Pemburu ada di lokasi yang sama** → killer MATI
  - Killer mencoba membunuh **Pemburu langsung** → killer MATI
  - Berlaku untuk NPC killer maupun player-as-killer
- **Strategis**: Killer harus hati-hati agar suspicion tidak >80% dan menghindari lokasi Pemburu. Survivor bisa memanfaatkan framing untuk memicu pemburu ke target yang salah

### Voting System
- **Pemain bisa memulai voting** untuk mengeliminasi suspect killer yang ada di lokasi yang sama
- **Syarat voting**: suspicion target ≥50%, minimal 2 NPC di lokasi, sudah ada kematian
- **Player vote weight 50%** — vote pemain punya bobot 50% dalam menentukan hasil
- **NPC voting berdasarkan AI** — setiap NPC mempertimbangkan: suspicion pribadi, trust, musuh/teman, bukti yang dimiliki, saksi pembunuhan
- **Hasil voting**:
  - **Benar (target = killer)**: Killer tereliminasi di depan semua NPC! Tension turun, identitas terkonfirmasi
  - **Salah (target ≠ killer)**: Orang tak bersalah tereliminasi! Trust turun drastis (-15), danger naik +15%
  - **Gagal (tidak mayoritas)**: Voting ditolak, suspicion target +10%
- **NPC juga bisa initiate voting** — NPC survivor akan memulai voting sendiri jika suspicion target ≥60% dan ada cukup orang di lokasi
- **Cooldown 3 ronde** — tidak bisa spam voting berturut-turut

### Anti-Looping & Plot Progression System
- **Player Action Tracking** — setiap brain action hanya bisa dilakukan **1x per target per node**
- **Max Brain Actions** per node — Survivor: 5 aksi, Killer: 3 aksi (pacing lebih lambat untuk killer)
- **NPC Cooldown System** — setiap tipe aksi NPC punya cooldown 1-4 ronde (killer cooldown lebih tinggi: eliminate/strike 3 ronde, divide/isolate 4 ronde)
- **NPC Killer Hesitation** — 35% chance killer NPC skip round (ragu-ragu), memperlambat momentum killer
- **Location Staleness System** — diam terlalu lama di satu lokasi meningkatkan danger level (+5% per aksi stasioner) dan memicu warning narrative. Setelah 5 aksi tanpa bergerak, hanya pilihan pindah lokasi yang tersedia
- **Killer Tracking Boost** — killer NPC semakin agresif melacak pemain yang diam di satu tempat (tracking chance +10% per ronde stasioner, max +30%)
- **1 Pilihan Lokasi** — pemain hanya ditawarkan 1 lokasi terbaik untuk pindah berdasarkan strategi (escape clue, tool, keamanan), bukan 2-3 pilihan acak. Membuat setiap keputusan pindah lebih bermakna
- **NPC Movement Priority** — NPC survivor dan killer dipaksa bergerak jika sudah melakukan 2+ aksi pasif berturut-turut, mencegah NPC camping
- **Global Action Memory** — sistem melacak jenis aksi yang dilakukan lintas reset untuk mencegah loop sejenis (observe→observe→observe)
- **Location-Based Reset** — pindah ke lokasi baru me-reset aksi spesifik lokasi dan mereset staleness counter
- **Max Opsi** — Survivor & Killer: 3 pilihan per node (compact & focused, brain interactive prioritas, 1 story max), shuffled setiap game

### 7 Alat Unik
Setiap alat hanya bisa dipegang 1 karakter. Tidak ada duplikat. Muncul saat event terpicu di lokasi tertentu.

| Alat | Lokasi | Tipe | Efek |
|------|--------|------|------|
| 🔪 Pisau Dapur | Dapur | Weapon | +40% kill, tapi tinggalkan bukti |
| 🔑 Kunci Master | Bunker B-3 | Support | Buka semua pintu, +20% defense |
| 💉 Suntikan Obat Bius | Basement | Weapon | +50% eliminasi diam-diam, tanpa bukti |
| 📻 Radio Portabel | Menara | Support | Komunikasi jarak jauh, +30% defense |
| ⛓️ Tali Baja | Taman Dalam | Weapon | +35% tangkap, bisa barricade |
| 🔥 Obor Api | Galeri Timur | Dual | +20% offense, +25% defense, intimidasi |
| 💻 Laptop Terenkripsi | Perpustakaan | Support | Akses CCTV/data mansion, +40% investigasi |

### Chance % System
- Setiap aksi punya **persentase keberhasilan** yang ditampilkan di UI
- Tool bonus meningkatkan chance (misal: Laptop +40% investigasi)
- Hasil roll ditampilkan setelah aksi: "Berhasil! (65% chance, roll: 42)"
- Chance disesuaikan per difficulty — protagonist punya advantage lebih besar di easy
- Killer mendapat penalty di difficulty lebih rendah untuk keseimbangan
- **Bar Chance Akurat** — `previewChance()` menampilkan angka sebenarnya termasuk ability + tool + difficulty bonus (bukan hanya base chance)
- **Bar Risiko/Hasil Role-Aware** — killer yang terungkap (buka kartu) mendapat opsi aksi yang sesuai:
  - Aksi ofensif (serang/frame/sabotase): risiko naik +20-25%, reward turun -30%
  - Aksi defensif (kabur/sembunyi): risiko TURUN, reward NAIK — strategi yang masuk akal
  - Aksi baru khusus revealed killer: Kabur, Bersembunyi, Serangan Terakhir
- **Bar Protagonis Dinamis** — risiko/reward berubah berdasarkan game state:
  - Sekutu nearby mengurangi risk untuk aksi konfrontasi
  - Danger level mempengaruhi risk investigasi
  - Trust mempengaruhi reward bicara/aliansi
  - Bukti yang terkumpul mempengaruhi akurasi tuduhan

### Realtime Player Status
- Status bar WhatsApp-style menampilkan kondisi karakter pemain di sub-header:
  - **AMAN** — tidak ada ancaman terdeteksi
  - **TERDETEKSI** — killer tahu pemain menginvestigasi
  - **PANIK** — danger level tinggi atau terluka
  - **TERLUKA** — pemain terkena serangan
  - **ANCAMAN** — killer sedang memburu pemain
- Tool yang dipegang ditampilkan di status bar
- **Lokasi Karakter** — detail lokasi + siapa yang ada di sekitar (bersama/sendirian) ditampilkan seperti WhatsApp subtitle
- **Info Tim** — daftar tim ditampilkan di sidebar dengan tanda hidup/mati. Jika bermain sebagai **Killer**, roster lengkap Killer & Survivor terlihat. Jika bermain sebagai **Survivor**, identitas killer disembunyikan — hanya killer yang sudah terungkap dalam game yang ditampilkan
- **Petunjuk Pelarian** — progress petunjuk ditemukan vs total
- **Killer Dieliminasi** — jumlah killer yang sudah dikalahkan
- **Diburu** — jumlah killer yang sedang diburu (disaksikan membunuh)

### Sistem Petunjuk Pelarian
- **8 Petunjuk Pelarian** tersebar di 8 ruangan mansion — kumpulkan **5 petunjuk** untuk mengungkap identitas semua killer
- **Jika 5 petunjuk terkumpul** → semua killer langsung terungkap dan dieksekusi oleh tim protagonis!
- **Kunci Master** — 5% chance muncul di lokasi acak saat investigasi. Jika ditemukan → misi petunjuk pelarian langsung selesai!
- **Killer bisa MENGHANCURKAN petunjuk** — jika sisa petunjuk < 5, killer menang karena protagonist tak bisa mengungkap identitas mereka
- **Petunjuk pertama → Pemburu aktif** — menemukan petunjuk pertama mengaktifkan mechanic Pemburu (random survivor ditunjuk)
- **8 Lokasi Petunjuk**:
  | Petunjuk | Lokasi | Deskripsi |
  |----------|--------|-----------|
  | Peta Rahasia Mansion | Perpustakaan | Peta tua jalur rahasia keluar |
  | Kode Pintu Darurat | Basement | Kode untuk pintu darurat |
  | Blueprint Terowongan | Bunker B-3 | Cetak biru terowongan bawah tanah |
  | Frekuensi Radio Darurat | Menara | Frekuensi untuk panggil bantuan |
  | Pintu Belakang Dapur | Dapur | Kunci cadangan pintu belakang |
  | Panel Rahasia Galeri | Galeri Timur | Panel dinding tersembunyi |
  | Celah Pagar Taman | Taman Dalam | Celah di pagar taman |
  | Dokumen Evakuasi | Aula Utama | Dokumen prosedur evakuasi |
- **Progress Realtime** — petunjuk ditemukan & dihancurkan selalu update di status bar secara realtime. Setiap perubahan (clue found/destroyed) langsung ter-update di UI
- **Petunjuk pertama → Pemburu aktif** — menemukan petunjuk pertama mengaktifkan mechanic Pemburu (random survivor ditunjuk)

### Killer vs Killer
- Killer bisa **menyabotase killer lain** untuk menyelamatkan diri sendiri (chapter 2+)
- Lana bisa mengekspos Dimas/Niko, Dimas bisa mengkhianati Lana, Niko bisa mengaktifkan CCTV
- Sistem chance 45% untuk sabotase antar killer — adil dan seimbang
- Killer yang terancam terekspos bisa mengorbankan killer lain — game tetap lanjut
- Membuat dinamika killer lebih menarik: tidak hanya melawan survivor

### Aliansi Kooperatif
- Survivor otomatis **membentuk aliansi** saat death count meningkat
- NPC bersenjata (punya tool) memberikan bonus pertahanan bersama
- Pertahanan terkoordinasi di lokasi yang sama
- Survivor NPC bisa menyerang killer yang terekspos

### Interactive Choice System (Compact Edition)
- **3 pilihan fokus** per ronde (survivor & killer) — compact & decisive, tidak overwhelming
- **15 kategori aksi** — setiap pilihan dikategorikan dengan ikon dan warna unik:
  - 🔍 Investigasi, ⚔️ Konfrontasi, 🤝 Sosial, 🚶 Pindah, 👁️ Siluman, 🛡️ Lindungi
  - 🗡️ Serang (killer), 🏃 Kabur, ⭐ Aliansi, ☝️ Tuduh, 💻 Hack, 💬 Negosiasi
  - 👀 Amati, 🤐 Sembunyi, 📖 Cerita
- **Indikator Risiko/Hasil** — meter visual menunjukkan tingkat risiko dan potensi reward setiap pilihan
- **Badge Bahaya** — pilihan berbahaya ditandai dengan badge "⚠ BAHAYA" yang berkedip
- **Aksi Brain yang Lebih Kaya** — pilihan dinamis berdasarkan state NPC:
  - Amati gerak-gerik NPC untuk mendeteksi killer
  - Bicara dengan NPC untuk membangun trust
  - Sembunyi saat danger level tinggi
  - Killer: sabotase lokasi, framing NPC lain
  - Info kontekstual: jumlah NPC di lokasi tujuan, level trust, kecurigaan
- **Animasi klik** — pilihan yang dipilih menyusut, pilihan lain memudar
- **Auto-detect kategori** — pilihan cerita otomatis dikategorikan berdasarkan konten teks

### Character Action Independence (Baru!)
Setiap karakter kini memiliki **aksi unik** yang mencerminkan kepribadian mereka — tidak ada lagi karakter yang "meminjam" aksi karakter lain.

- **CHARACTER_ACTION_FLAVOR System** — 10 karakter memiliki teks aksi berbeda untuk setiap tipe aksi:
  - **Arin**: Investigasi dengan recorder jurnalis, wawancara, pengungkapan bukti
  - **Sera**: Profiling psikologis, analisis micro-expression, terapi sebagai senjata
  - **Niko**: Pengetahuan mansion, lorong rahasia, manipulasi tuan rumah
  - **Juno**: Bahasa jalanan, konfrontasi fisik, insting bertahan hidup
  - **Vira**: Flashback survivor, pengetahuan mansion sebelumnya, kepanikan PTSD
  - **Reza**: Interogasi polisi, analisis TKP, otoritas detektif
  - **Kira**: Hacking digital, CCTV monitoring, exploit sistem mansion
  - **Farah**: Negosiasi bisnis, koneksi keluarga Wardhana, leverage kekayaan
  - **Lana** (Killer): Manipulasi naratif, gosip strategis, charm penulis
  - **Dimas** (Killer): Analisis forensik, deteksi kebohongan fisiologis, presisi klinis
  - **Niko** (Killer): Jebakan mansion, lorong tersembunyi, kontrol tuan rumah

- **Unique Actions per Character** — setiap karakter memiliki 2-3 aksi eksklusif yang hanya tersedia untuk karakter tersebut:
  - Arin: Deep investigation (+20% bonus), Lindungi Sera
  - Sera: Full psychological profiling, Terapi darurat
  - Niko: Activate CCTV, Buka lorong rahasia
  - Juno: Barricade dengan kekuatan, Intimidasi agresif
  - Vira: Aktivasi ingatan mansion, Whisper warnings
  - Reza: Interogasi formal, Setup crime scene reconstruction
  - Kira: Decrypt file terenkripsi, Deploy digital trap
  - Farah: Tawarkan suap, Buka brankas keluarga
  - Lana (killer): Sebarkan informasi palsu, Buat alibi sempurna
  - Dimas (killer): Analisis pola kematian, Silent approach
  - Niko (killer): Aktifkan jebakan, Lockdown area

- **Cross-Character Interactions** — 90+ interaksi unik antar karakter berdasarkan hubungan mereka:
  - Arin↔Sera: Perlindungan dan kolaborasi
  - Niko↔Vira: Konfrontasi toxic ex
  - Juno↔Reza: Mentor-mentee dinamis
  - Dimas→Sera: Obsesi satu arah
  - Lana↔semua: Manipulasi penulis
  - Setiap karakter berinteraksi unik dengan 9 karakter lainnya

- **Balanced Decision Trees** — semua karakter memiliki 39-58 decision entries:

| Karakter | Survivor Entries | Killer Entries |
|----------|-----------------|----------------|
| Arin | 58 | - |
| Niko | 49 | 34 |
| Sera | 45 | - |
| Juno | 48 | - |
| Vira | 46 | - |
| Reza | 47 | - |
| Lana | 39 | 36 |
| Dimas | 40 | 35 |
| Kira | 43 | - |
| Farah | 47 | - |

- **Anti-Stuck Guarantee** — setiap karakter memiliki:
  - Catch-all entries untuk semua emotional states (calm, wary, suspicious, panicked, hostile)
  - Ultimate fallback di `survivorFallback()` dan `killerFallback()` yang **selalu** return action
  - Cooldown-aware alternative matching — jika aksi utama on cooldown, brain otomatis cari alternatif

---

## Karakter

### 5 Karakter Utama

#### Arin Prasetya — *Investigative Journalist*
<img src="img/arin.png" width="150" alt="Arin">

> *"Setiap cerita punya kebenaran. Dan kebenaran tidak peduli apakah kau siap mendengarnya."*

Investigator default. Host podcast investigasi "Thread by Thread". Diundang ke mansion karena episodenya tentang orang hilang yang terhubung dengan keluarga Wardhana. Insting jurnalisnya adalah kekuatan terbesar — dan target terbesar Sang Penenun. *Sebagai pemain: clue ekstra dan insting jurnalis tajam.*

**Sifat:** Investigatif | Berani | Idealis | Kadang Keras Kepala

---

#### Niko Wardhana — *Pewaris Mansion*
<img src="img/niko.png" width="150" alt="Niko">

> *"Aku mewarisi lebih dari properti. Aku mewarisi dosa."*

Cucu Hendarto Wardhana, pendiri mansion. Merencanakan "pameran dokumenter" untuk mengekspos dosa keluarganya — tapi seseorang membajak acaranya. Di difficulty Hard, Niko adalah salah satu operator Sang Penenun.

**Sifat:** Conflicted | Charming | Guilt-ridden | Secretive

---

#### Sera Amalina — *Psikolog Klinis*
<img src="img/sera.png" width="150" alt="Sera">

> *"Aku tidak perlu melihat untuk tahu. Perilaku kalian sudah cukup bercerita."*

Psikolog yang bisa membaca orang seperti buku terbuka. Kemampuannya mem-profil predator membuat dia aset terbesar kelompok — dan ancaman terbesar bagi Sang Penenun.

**Sifat:** Analytical | Empathetic | Observant | Vulnerable

---

#### Juno Kirana — *Street Artist*
<img src="img/juno.png" width="150" alt="Juno">

> *"Gue nggak mau main detective. Gue mau KELUAR."*

Seniman jalanan dengan temper pendek dan loyalitas tanpa batas. Pendekatan langsung — dobrak pintu, pecahkan jendela, hadapi masalah head-on. Yang pertama bertindak saat bahaya datang.

**Sifat:** Impulsive | Brave | Loyal | Street-smart

---

#### Vira Deviani — *Saksi Selamat*
<img src="img/vira.png" width="150" alt="Vira">

> *"Aku sudah pernah di sini. Dan aku kembali bukan karena pilihan."*

"Saksi Selamat" dari siklus tahun lalu. Kembali karena Sang Penenun mengancam adiknya. Menyimpan pengetahuan kritis tentang mansion — termasuk lokasi sarang Sang Penenun di B-3.

**Sifat:** Haunted | Determined | Secretive | Protective

---

### 5 Karakter Pendukung

| Karakter | Peran | Rahasia |
|----------|-------|---------|
| **Reza Hartono** | Mantan Detektif | Dipecat karena kasus yang terhubung dengan keluarga Wardhana |
| **Lana Kusuma** | Novelis Horor | "Penulis" — operator Sang Penenun yang bermain ganda |
| **Dimas Surya** | Mahasiswa Kedokteran | "Pemotong" — operator yang menjalankan metode Penenun |
| **Kira Chen** | Ethical Hacker | Bisa hack sistem keamanan mansion |
| **Farah Aldridge** | Pewaris Estate | Keluarganya mendanai pembangunan mansion 50 tahun lalu |

---

## Struktur Cerita (6 Chapter)

| Chapter | Judul | Fokus |
|---------|-------|-------|
| Prolog | **Undangan** | Kedatangan, perkenalan 10 karakter, atmosphere setup |
| Bab 1 | **Pameran Maut** | Pameran dimulai, sistem simpul terungkap, bukti pertama |
| Bab 2 | **Darah Pertama** | Truth-or-lie game, aliansi terbentuk, kematian pertama |
| Bab 3 | **Perburuan** | Pemburu vs mangsa, kunci master, wahyu terungkap |
| Bab 4 | **Konfrontasi** | Pertempuran final, titik balik, simpul terakhir |
| Bab 5 | **Fajar Terakhir** | Endgame — siapa yang selamat, fajar berdarah |

---

## Sistem Killer

Difficulty menentukan berapa banyak killer yang tertanam di antara tamu:

- **Easy (1 killer):** Lana sebagai satu-satunya operator
- **Normal (2 killers):** Lana ("Penulis") + Dimas ("Pemotong")
- **Hard (3 killers):** Lana + Dimas + Niko (pewaris yang memberikan akses)

Antagonis utama: **Ragil Pramudya** alias **Sang Penenun** — pria tua yang hidup di bunker B-3 di bawah mansion selama 20+ tahun, mengendalikan siklus simpul.

---

## Teknologi

- **Pure HTML/CSS/JavaScript** — tanpa framework, langsung buka di browser
- **Responsive** — desktop dan mobile
- **Character portraits** untuk 5 karakter utama
- **CSS avatars** untuk 5 karakter pendukung
- **Auto-save** via localStorage
- **Efek visual:** screen shake, glitch, blood overlay, ambient audio hooks

---

## Cara Bermain

1. Buka `index.html` di browser
2. Pilih tingkat kesulitan
3. Pilih peranmu — mainkan sebagai salah satu dari 10 karakter
4. Kenali 10 karakter
5. Buat keputusan — setiap pilihan menentukan alur cerita DAN memicu aksi NPC
6. Pantau NPC Brain Log (tombol gear di kanan atas) untuk melihat apa yang dilakukan NPC
7. Sebagai **survivor**:
   - Kumpulkan **5 dari 8 petunjuk** untuk mengungkap identitas semua killer — atau temukan Kunci Master (5% chance)!
   - ATAU habisi semua killer yang menyamar
   - Bangun aliansi, investigasi, dan bertahan hidup
   - Jika kamu menyaksikan pembunuhan, killer akan DIBURU oleh tim protagonis
   - Hati-hati dengan trust rendah — NPC bisa saling membunuh karena ketidakpercayaan!
8. Sebagai **killer**:
   - Habisi protagonis sampai tersisa 1
   - ATAU hancurkan petunjuk agar tersisa < 5 (protagonist tidak bisa mengungkap identitasmu)
   - Killer bisa saling membantu atau mengkhianati jika terancam
   - Hati-hati membunuh di depan saksi — kamu akan diburu!
9. Jika kamu tereliminasi, NPC melanjutkan permainan sampai ada pemenang
10. Lihat **ringkasan akhir** — siapa yang menang, siapa tereliminasi, statistik permainan

---

## Struktur File

```
simpul-terakhir/
├── index.html              # Entry point
├── css/
│   └── style.css           # Styling + CSS avatars
├── img/
│   ├── arin.png            # Portrait karakter utama
│   ├── niko.png
│   ├── sera.png
│   ├── juno.png
│   └── vira.png
└── js/
    ├── characters.js       # 10 karakter (profil, traits, relationships)
    ├── char-brain.js       # NPC behavior engine (state machine, decision tree, actions)
    ├── char-db.js          # Character behavior database (100+ nodes per character)
    ├── engine.js           # Game engine (trust, moral, danger, killer, NPC integration)
    ├── story-prolog.js     # Prolog: Undangan
    ├── story-ch1.js        # Bab 1: Pameran Maut (chapter 1)
    ├── story-ch2.js        # Bab 2: Darah Pertama (chapter 2)
    ├── story-ch3.js        # Bab 2 lanjutan: Pecah Belah
    ├── story-ch4.js        # Bab 3: Perburuan (chapter 3)
    ├── story-ch5.js        # Bab 3 lanjutan: Wahyu
    ├── story-ch6.js        # Bab 4: Konfrontasi (chapter 4)
    ├── story-ch7.js        # Bab 4 lanjutan: Simpul Terakhir
    ├── story-ch8.js        # Bab 4 lanjutan: Titik Balik
    ├── story-ch9.js        # Bab 5: Terakhir Berdiri (chapter 5)
    ├── story-ch10.js       # Bab 5 lanjutan: Fajar Berdarah
    └── story-endings.js    # 30 story endings + condition-based ending selector
```

### Sistem Ending (28 Ending — Condition-Based)

Ending otomatis terpicu berdasarkan kondisi game saat ini — bukan terkunci di chapter. Rating S (terbaik) → F (terburuk).

#### Fitur Ending System

- **Cerita Multi-Layer**: Setiap ending memiliki 4 lapisan narasi:
  1. **Immediate Victory/Defeat** — apa yang terjadi saat game berakhir
  2. **Hidden Truth** — kebenaran tersembunyi yang terungkap berminggu/bertahun kemudian
  3. **Character Background Reveals** — backstory mendalam setiap karakter: koneksi ke Dewan Penenun, identitas asli, rahasia keluarga
  4. **Relationship Aftermath** — dampak pada hubungan antar karakter (Arin↔Sera, Niko↔Vira, dll)
- **Koneksi Karakter Tersembunyi**: Semua karakter ternyata terhubung ke korban/operator Dewan sebelumnya:
  - Ibu Arya (Ratna Prasetya) = mantan operator Dewan R-03, dieliminasi 2009
  - Ibu Sera (Dr. Lestari Amalina) = psikolog residen Dewan yang masih aktif
  - Kakak Vira (Mira) = agen undercover yang mati di mansion sebelumnya
  - Ayah Juno = korban pertama eksperimen Ragil
  - Lana = Lana Wardhana, cucu haram Hendarto (sepupu Niko)
  - Dimas = anak jalanan tanpa nama, diadopsi Ragil usia 8 tahun, di-program 15 tahun jadi operator
- **Galeri Ending dengan Requirement System**:
  - Setelah membuka 1 ending, **requirement semua ending terkunci** ditampilkan (rating + hint kondisi)
  - Cerita ending tetap **tersembunyi** sampai ending tersebut benar-benar dibuka
  - Ending yang sudah terbuka bisa **dibaca ulang** kapan saja dari galeri (tap untuk baca)
  - Progress galeri tersimpan di localStorage dan persisten antar sesi
- **Brain Tree Integration**: Semua kondisi ending dipicu secara natural oleh keputusan otonom NPC (moral score, trust, suspicion, clue discovery, combat, dll)

---

#### S-RANK (Best Outcomes)

**#1 — Sang Penenun Terakhir (S)**
- **Kondisi:** Semua killer mati + ≥5 clue + ≥4 survivor hidup + moral ≥0
- **Cerita:** Bukti tersebar ke dunia. Ragil ditangkap. Investigasi Interpol mengungkap **Dewan Penenun** — eksperimen seleksi sosial 50 tahun oleh **Hendarto Wardhana** yang mempelajari "seleksi alam dalam masyarakat urban." 47 kasus terungkap, 23 terpidana. Setiap tamu ternyata dipilih berdasarkan "Indeks Kerentanan" — profil psikologis yang menunjukkan mereka "terlalu rusak untuk dipercaya" jika bersaksi. Reveal terbesar: ibu Arya (**Ratna Prasetya**) ternyata mantan **Operator R-03** yang dieliminasi 2009 setelah percobaan desersi. Ibu Sera (**Dr. Lestari Amalina**) masih aktif sebagai psikolog residen Dewan — kemampuan profiling Sera adalah hasil "pelatihan subliminal" dari ibunya sejak usia 4 tahun. Kakak Vira (**Mira**) mati sebagai agen undercover di mansion 2 tahun lalu. Ayah Juno yang "menghilang" 15 tahun lalu adalah korban pertama eksperimen Ragil. **Lana Wardhana** = cucu haram Hendarto, sepupu Niko yang tidak diakui. **Dimas** = anak jalanan tanpa nama, diadopsi Ragil usia 8 tahun, di-program 15 tahun menjadi operator paling efisien. Dead man's switch di mansion siap self-destruct jika terekspos.

**#2 — Detektif Sejati (S)**
- **Kondisi:** Semua killer mati + semua clue (8/8) ditemukan
- **Cerita:** Semua 8 petunjuk pelarian membentuk gambaran utuh. File Ragil mengungkap **"Proyek Tenun"** — 47 siklus selama 50 tahun. Pengadilan 3 tahun menghasilkan keadilan penuh. Arya menerima penghargaan jurnalisme — tapi yang lebih penting: menemukan kebenaran tentang ibunya Ratna yang pernah menjadi operator Dewan. Sera menemukan bahwa kemampuan profilingnya bukan bakat alami tapi warisan gelap dari ibunya Dr. Lestari. Vira akhirnya mendapat closure tentang kakaknya Mira. Juno menemukan bahwa ayahnya tidak meninggalkan keluarga — tapi dieliminasi sebagai korban eksperimen pertama. DNA test mengungkap Lana, Dimas, dan Niko adalah **tiga cucu Hendarto** yang tidak pernah tahu mereka saudara.

**#26 — Pelarian dari Mansion (S)**
- **Kondisi:** ≥5 clue / master key + escape via mansion_escape
- **Cerita:** Terowongan pelarian di bawah basement dibangun 50 tahun lalu oleh Hendarto. Saat berlari menuju cahaya, di dinding terowongan ada puluhan **tulisan tangan** dari tahun-tahun berbeda — korban-korban sebelumnya yang pernah menemukan jalan keluar: "Aku keluar — M.H. 1998." "Aku selamat — D.K. 2003." Dan satu yang membuat Arya berhenti: **"Aku keluar. Tapi mereka tidak membiarkan aku pergi. — R.P. 2009."** R.P. = Ratna Prasetya, ibu Arya. Ibunya pernah keluar lewat terowongan ini — tapi Dewan menemukannya kembali. Juno menemukan inisial ayahnya di dinding. Vira mengenali tulisan kakaknya Mira. Setiap nama di dinding dilacak oleh polisi — dan untuk pertama kalinya dalam 50 tahun, siklus benar-benar berakhir.

**#27 — Pembantai Pembunuh (S)**
- **Kondisi:** Semua killer dieliminasi lewat combat + ≥3 survivor
- **Cerita:** Killer dieliminasi satu per satu. Pemeriksaan forensik setelah malam itu mengungkap kebenaran mengejutkan: ketiga operator — **Lana, Dimas, Niko** — ternyata semua **darah Wardhana**. Lana Kusuma adalah Lana Wardhana, cucu perempuan Hendarto dari putra kedua. Dimas Pratama bukan nama aslinya — anak jalanan yang diadopsi dan diberikan identitas cucu ketiga. **Tiga cucu Hendarto, tiga operator, satu arena.** Ragil membangun mesin pembunuhan dari keluarganya sendiri.

---

#### A-RANK (Good Outcomes)

**#3 — Fajar yang Cukup (A)**
- **Kondisi:** Semua killer mati + 2-4 clue + ≥2 survivor
- **Cerita:** Bukti cukup untuk memulai investigasi tapi tidak untuk menghancurkan seluruh jaringan. Ragil meninggal karena kanker — tapi meninggalkan **satu file terakhir** di server mansion: daftar lengkap 47 korban selama 50 tahun, termasuk nama Ratna Prasetya (ibu Arya) dan Dr. Lestari Amalina (ibu Sera). 3 dari 6 anggota Dewan diadili, sisanya menghilang. Siklus Wardhana berakhir — tapi arsip yang tidak lengkap menyisakan pertanyaan yang menghantui setiap survivor.

**#4 — Pengorbanan (A)**
- **Kondisi:** Player mati + ≥3 survivor selamat + ≥3 clue
- **Cerita:** Player turun ke B-3 terakhir kali. Upload 100%. Terjebak. Di ruangan yang sama, layar komputer Ragil menampilkan **"Indeks Kerentanan"** — profil setiap tamu. Dan di profil player: referensi ke anggota keluarga yang pernah menjadi korban/operator Dewan. Podcast terakhir direkam dari ruangan yang dipenuhi asap — bukan hanya pengakuan cinta ke Sera, tapi pengungkapan bahwa semua orang di mansion terhubung ke korban-korban sebelumnya. Rekaman 8 menit yang mengubah segalanya.

**#5 — Kesaksian Terakhir (A)**
- **Kondisi:** Vira hidup + ≥4 survivor + escape/eliminasi berhasil
- **Cerita:** Vira membawa grup ke pintu darurat — warisan dari malam pertamanya 6 bulan lalu. Tapi kali ini, Vira menceritakan kebenaran yang tidak pernah dia ungkap: kakaknya **Mira** tidak "menghilang" — Mira adalah agen undercover yang menyusup ke Dewan selama 2 tahun dan mati di mansion ini. Pintu darurat ini ditemukan Mira. Kesaksian mereka ke media, polisi, dan komisi HAM bukan hanya tentang malam ini — tapi tentang 50 tahun pembunuhan sistematis.

**#28 — Pengkhianatan Sempurna (A)**
- **Kondisi:** Semua killer mati + ≥2 killer + killer saling bunuh (betrayal)
- **Cerita:** Pengkhianatan antar killer bukan sekadar survival instinct. Investigasi mengungkap: ketiga operator **tidak pernah tahu mereka saudara**. Lana tidak tahu Niko sepupunya. Dimas tidak tahu dua orang lain adalah cucu kakek angkatnya. Saat masker jatuh dan wajah asli terlihat — mereka mengenali **mata Hendarto Wardhana** — mata yang mereka lihat di cermin setiap pagi. Dalam detik itu, mereka memilih menghancurkan warisan keluarga dari dalam. Lana mengorbankan diri agar Niko terekspos. Dimas membiarkan diri dikalahkan setelah menyadari "ayah" angkatnya adalah kakek yang sama dengan kakek Niko. **Pengkhianatan terbesar seorang Wardhana: memilih untuk berhenti menjadi Wardhana.**

**#30 — Yang Terakhir Berdiri (A)**
- **Kondisi:** Semua killer mati + hanya 1 survivor tersisa
- **Cerita:** Sendirian di mansion, survivor terakhir menemukan **Bunker B-3** dan semua yang tersimpan di dalamnya. Komputer Ragil. Arsip 50 tahun. 47 nama korban. Profil psikologis setiap tamu. Dan kebenaran tentang koneksi yang menghubungkan semua orang: ibu Arya mantan operator, ibu Sera psikolog Dewan, kakak Vira mati di mansion ini, ayah Juno korban eksperimen pertama, Lana-Dimas-Niko semua cucu Hendarto. **Beban terberat dari menjadi yang terakhir berdiri: menjadi satu-satunya orang di dunia yang tahu seluruh kebenaran — kebenaran yang terlalu besar untuk satu orang.**

---

#### B-RANK (Bittersweet)

**#6 — Abu dan Fajar (B)**
- **Kondisi:** Semua killer mati + ≥3 clue hancur + <5 clue ditemukan
- **Cerita:** Mansion terbakar — termasuk **dead man's switch** Ragil yang mengaktifkan self-destruct. Bukti terbakar. Ragil terbakar. Tapi dalam abu, Arya menemukan satu hal yang tidak terbakar: **medali Ratna Prasetya** — medali jurnalisme ibunya, yang seharusnya tidak ada di mansion ini. Kebenaran tentang ibunya sebagai mantan operator Dewan terungkap lewat benda kecil yang selamat dari api. Podcast Arya viral — tapi tanpa bukti fisik, "Dewan Penenun" tetap menjadi teori konspirasi.

**#7 — Kemenangan yang Pecah (B)**
- **Kondisi:** Semua killer mati + ≤3 survivor + ≥3 kematian
- **Cerita:** Menang. Ragil diadili. Siklus berakhir. Tapi kemenangan terasa seperti kaca pecah di mulut. PTSD. Insomnia. Arya menemukan file **"Indeks Kerentanan"** — profil psikologis yang menunjukkan setiap tamu dipilih karena "terlalu rusak untuk dipercaya." Teman-teman yang mati malam itu ternyata anak, cucu, atau keponakan korban Dewan sebelumnya. Kemenangan ini mengungkap bahwa bahkan kematian mereka sudah di-design — dan hidup dengan pengetahuan itu lebih berat dari kematian itu sendiri.

**#8 — Penebusan Penulis (B)**
- **Kondisi:** Lana (killer) mati + moral ≥0
- **Cerita:** Lana memilih redemption. Tapi kebenaran di balik pengorbanannya lebih kompleks: Lana bukan Lana Kusuma — dia **Lana Wardhana**, cucu perempuan Hendarto dari putra kedua yang tidak diakui. Sepupu Niko. Novel terakhirnya bukan hanya tentang kakaknya Arum — tapi tentang dua cucu Hendarto yang bermain di arena yang sama tanpa pernah tahu mereka saudara. Lana mati bukan hanya untuk menebus dosa — tapi untuk memutus rantai darah Wardhana yang sudah terlalu banyak memakan anaknya sendiri. Terbit posthumous sebagai "buku paling menghancurkan yang pernah ditulis di Indonesia."

**#9 — Lingkaran Vira (B)**
- **Kondisi:** Vira hidup + ≥3 survivor + player bukan Vira
- **Cerita:** Vira membawa grup ke pintu rahasia. Tapi sebelum keluar, dia mengaku: pintu ini ditemukan oleh **kakaknya Mira** — agen undercover yang menyusup ke Dewan selama 2 tahun. Mira mati di mansion ini. Vira kembali ke dalam — bukan karena keberanian, tapi karena kakaknya pernah keluar dan meninggalkan orang lain di dalam, dan Mira tidak pernah memaafkan dirinya untuk itu. Vira menolak mengulangi kesalahan Mira. **Saksi Selamat yang menjadi Penyelamat — untuk menebus dosa kakaknya.**

**#21 — Pahlawan yang Jatuh (B)**
- **Kondisi:** Player (Arin) mati + ≥2 survivor selamat
- **Cerita:** Arya turun ke B-3 sendirian. Dead man's switch — gas mengisi basement. Tapi di detik terakhir, layar komputer Ragil menampilkan **"ARSIP OPERATOR"** — dan di nomor 31: **Ratna Prasetya, Operator R-03, Dieliminasi 2009.** Ibunya pernah menjadi operator Dewan. Podcast terakhir 8 menit — bukan hanya pengakuan cinta ke Sera, tapi: "Ibu... aku baca namamu di daftar. Tapi aku tidak marah. Karena kau mencoba keluar — dan itu yang aku lakukan sekarang." Di menit terakhir: "Sera... aku tahu tentang ibumu juga. File-nya ada di komputer Ragil. Kau bukan ibumu. Seperti aku bukan ibuku." Sera mendengarkan rekaman itu sekali — 8 menit yang mengubah hidupnya dua kali.

---

#### C-RANK (Mixed — System Continues)

**#10 — Kemenangan Pyrrhic (C)**
- **Kondisi:** Semua killer mati + <3 clue
- **Cerita:** Selamat, tapi bukti tidak cukup untuk mengungkap Dewan. Setahun kemudian — undangan hitam muncul lagi. Dan kali ini, Arya menemukan bahwa undangan itu dikirim ke alamat ibunya dulu — Ratna Prasetya. Ibu yang dia kira korban biasa ternyata pernah menerima undangan yang sama. **Siklus berlanjut — dan sekarang Arya tahu bahwa dia bukan pemain baru. Dia pemain generasi kedua.**

**#11 — Perjanjian dengan Iblis (C)**
- **Kondisi:** ≥8 karakter hidup + moral <-5
- **Cerita:** Ragil menawarkan deal. Semua keluar. Tapi deal itu punya harga tersembunyi: Ragil memberikan **file "Indeks Kerentanan"** — profil psikologis setiap tamu yang menunjukkan koneksi mereka ke korban-korban sebelumnya. Arya menemukan ibunya di daftar operator. Sera menemukan ibunya masih aktif di Dewan. Semua kebenaran terungkap — tapi tidak ada yang bisa bertindak karena deal sudah ditandatangani. **Perjanjian dengan iblis bukan hanya mengorbankan keadilan — tapi memberikan pengetahuan yang meracuni setiap hubungan selamanya.**

**#12 — Perpecahan Fatal (C)**
- **Kondisi:** 2-4 survivor + fajar tercapai (dawn_reached)
- **Cerita:** Kelompok terpecah. Self-destruct menghapus bukti. Tapi masing-masing survivor membawa pulang **fragment kebenaran** yang berbeda — Arya tahu tentang ibunya, Sera curiga tentang ibunya, Vira ingat nama kakaknya di dinding, Juno mengenali foto ayahnya. **Tidak ada yang punya gambaran utuh. Dan tanpa satu sama lain, potongan-potongan itu tidak akan pernah membentuk kebenaran yang lengkap.**

**#13 — Warisan Wardhana (C)**
- **Kondisi:** Niko hidup (bukan killer)
- **Cerita:** Niko membawa grup ke lorong rahasia. Tapi di lorong itu, Niko menemukan **ruang arsip pribadi kakeknya Hendarto** — dan di dalamnya, surat terakhir Hendarto yang mengungkap bahwa dia membangun lorong ini sebagai "jalan keluar untuk cucu-cucuku, kalau suatu hari mereka terjebak di arena yang kubuat." Hendarto tahu bahwa anak-anaknya akan melanjutkan siklus — dan menyiapkan jalan keluar untuk generasi yang tidak bisa dia selamatkan langsung. **Niko keluar dengan warisan ganda: dosa kakek yang memulai semuanya, dan kasih kakek yang menyiapkan jalan keluarnya.**

**#19 — Pelarian Tanpa Akhir (C)**
- **Kondisi:** Trigger via story node (chapter 5) — keluar tanpa bukti
- **Cerita:** Keluar melalui jendela pecah, hutan, pagar kawat. Polisi datang — mansion kosong. Podcast Arya viral tapi dianggap "creepypasta." Tapi setahun kemudian, seorang pendengar podcast menghubungi Arya: **"Ibumu Ratna pernah menulis surat ke redaksi kami tahun 2008. Tentang organisasi bernama Dewan Penenun. Kami tidak mempublikasikannya. Saya menyesal."** Arya menyadari ibunya pernah mencoba mengungkap kebenaran — lewat jurnalisme, bukan senjata — dan gagal. Dan sekarang Arya mengulangi siklus yang sama.

**#23 — Plot Twist Penulis (C)**
- **Kondisi:** Lana (killer) hidup + identitas tersembunyi + bukan menang
- **Cerita:** Lana bermain triple — bukan hanya operator double agent, tapi calon **PEWARIS Sang Penenun**. Plot twist tergelap: **Lana Kusuma bukan nama aslinya. Nama aslinya Lana Wardhana** — cucu perempuan Hendarto dari putra kedua yang tidak diakui. Lana dan Niko sepupu. Lana tumbuh di panti asuhan sementara Niko tumbuh di mansion. Malam ini, **dua cucu Hendarto bermain di arena kakek mereka tanpa pernah tahu mereka berbagi darah**. Siklus bukan berakhir — justru ter-upgrade oleh Penenun baru yang punya empati cukup untuk memahami manusia, dan menggunakan pemahaman itu sebagai senjata.

**#24 — Profiler dan Subjek (C)**
- **Kondisi:** Sera hidup + fajar tercapai (dawn_reached)
- **Cerita:** Sera memprofilkan Sang Penenun dengan akurasi menakutkan. Tapi Ragil mengungkap alasannya: **"Ibumu yang mengajarkanmu. Dr. Lestari Amalina — psikolog residen saya selama 18 tahun. Pelatihan subliminal sejak usia 4 tahun. Kau pikir kau belajar membaca microexpression di universitas?"** Sera membeku. Semua yang dia banggakan — kemampuannya, karirnya, thesis-nya — berasal dari sumber paling gelap. Ibunya bukan psikolog biasa. **Ibunya adalah arsitek profil korban Dewan.** Dan Sera, tanpa mengetahuinya, adalah produk terbaik dari program ibunya.

---

#### D-RANK (Bad Outcomes)

**#14 — Paranoia Menang (D)**
- **Kondisi:** Trust rata-rata <25 + ≥2 kematian
- **Cerita:** Kepercayaan hancur total. Paranoia menggantikan akal sehat. Arya tidak membuka pintu saat Sera meminta tolong. Tapi kebenaran di baliknya lebih mengerikan: paranoia itu **di-design**. Ragil menggunakan **"Protokol Fragmentasi"** — memanipulasi sistem ventilasi untuk menyebarkan stimulan kimia yang meningkatkan cortisol dan menurunkan kemampuan berpikir rasional. Paranoia bukan kelemahan manusia — itu **senjata buatan** yang ditanamkan Ragil ke udara mansion. Dan setiap orang yang saling curiga malam itu... sebenarnya sedang bereaksi terhadap kimia, bukan realita.

**#15 — Tuduhan Salah (D)**
- **Kondisi:** Killer menang + Sera hidup (killer_victory)
- **Cerita:** Menuduh orang yang salah. Tapi tuduhan itu **di-design oleh Lana** berminggu-minggu sebelumnya — di laptopnya ditemukan draft berjudul **"Kambing Hitam — Versi 7."** Versi 7 artinya skenario ini sudah dipraktikkan di 6 siklus sebelumnya. Semua "bukti" yang mengarah ke orang yang dituduh di-plant. Sera tahu — dia membaca "kebingungan murni, bukan rasa bersalah" di mikro-ekspresi korban tuduhan. Tapi tidak ada yang mendengarkannya. **Kegagalan terberat profiler: diabaikan oleh orang yang paling dia cintai.**

**#16 — Sang Penenun Menang (D)**
- **Kondisi:** Killer menang secara umum (killer_victory)
- **Cerita:** Tiga simpul terputus. Tiga bulan kemudian, email terakhir Sang Penenun tiba — berisi **profil psikologis lengkap setiap tamu**. Profil Arya: "Subjek A-01. Indeks kerentanan: 87. Catatan: sangat menyerupai profil ibu (**Ratna Prasetya, Operator R-03, dieliminasi 2009**). Potensi rekrutmen: TINGGI." Ibunya bukan korban Dewan — ibunya pernah menjadi operator. Profil Sera: "Anak **Dr. Lestari Amalina** (Psikolog Residen, masih aktif). Kemampuan profiling: hasil pelatihan subliminal fase 2." Ibunya yang masih menelepon setiap Minggu — masih aktif bekerja untuk Dewan. **Sang Penenun sudah menang sejak sebelum mereka lahir.**

**#17 — Pengkhianatan Dokter (D)**
- **Kondisi:** Dimas (killer) hidup + killer menang/player kalah
- **Cerita:** Dimas menggunakan akses medis untuk sabotase. Tapi di balik presisi klinis itu: **Dimas Pratama asli meninggal di Semarang 2001.** Orang ini — **Operator D-07** — adalah anak jalanan tanpa nama yang ditemukan Ragil di kolong jembatan Manggarai usia 8 tahun. Ragil melihat potensi: anak yang sudah tidak merasakan empati. Diadopsi, diberi identitas curian, dibiayai sekolah kedokteran — bukan sebagai investasi pada anak, tapi investasi pada **senjata**. 15 tahun pelatihan. Tapi saat Sera menatapnya tanpa kebencian di detik terakhir — melihat anak kecil 8 tahun di balik operator — tangan Dimas gemetar untuk pertama kalinya dalam 15 tahun.

**#20 — Pengecut yang Hidup (D)**
- **Kondisi:** Trigger via story node (chapter 4) — kabur sendirian
- **Cerita:** Berlari ke malam sendirian. Meninggalkan semua orang. Polisi datang — terlambat. Tapi yang paling menghancurkan: setahun kemudian, Arya menemukan bahwa ibunya **Ratna** pernah melakukan hal yang sama — kabur dari mansion 2009 dan meninggalkan orang lain di dalam. Dan Ratna dieliminasi bukan karena bersaksi — tapi karena rasa bersalah membuatnya kembali. **Arya mengulangi dosa ibunya. Dan bertanya-tanya apakah rasa bersalah juga akan membuatnya kembali.**

**#22 — Siklus Berlanjut (D)**
- **Kondisi:** Escape awal (≤chapter 3) + ≤1 clue
- **Cerita:** Kabur di chapter awal lewat pagar. Setahun kemudian, amplop hitam lagi — dan di dalamnya, foto ibunya **Ratna Prasetya** berdiri di depan mansion lain tahun 2008, satu tahun sebelum "meninggal." Di balik foto: **"Ibumu datang. Ibumu bermain. Ibumu kalah. Sekarang giliranmu — untuk kedua kalinya."** Dan di undangan itu, nama lain: **Sera Amalina**. Sera juga diundang. Lari dari mansion pertama tidak menyelamatkan siapapun — hanya menunda. Dan sekarang orang yang paling dicintai sudah masuk permainan.

**#29 — Jejak yang Terhapus (D)**
- **Kondisi:** Clue dihancurkan killer → tidak cukup bukti (killer_clues_destroyed)
- **Cerita:** Petunjuk dihancurkan — tapi tidak semua oleh operator. Beberapa dihancurkan oleh **Ragil sendiri** dari Bunker B-3 melalui sistem remote. Ragil mengontrol arena — setiap petunjuk yang "ditemukan" diletakkan dengan sengaja, dan yang "dihancurkan" juga dihancurkan dengan sengaja. **Permainan ini tidak pernah bisa dimenangkan lewat pelarian.** Yang paling menakutkan: di antara petunjuk yang dihancurkan, ada satu yang berisi **daftar nama korban 50 tahun** — termasuk nama ibu Arya, kakak Vira, ayah Juno. Kebenaran yang terbakar sebelum sempat dibaca.

---

#### F-RANK (Worst Outcomes)

**#18 — Simpul Terputus Total (F)**
- **Kondisi:** Player sendirian + ≥5 kematian
- **Cerita:** Semua simpul terputus. Player selamat sendirian. Enam bulan kemudian, paket tanpa pengirim tiba — berisi folder **"PROFIL WARISAN"**: silsilah keluarga setiap tamu dan koneksi mereka ke korban-korban sebelumnya. Setiap orang yang mati malam itu ternyata adalah anak, cucu, atau keponakan dari korban Dewan sebelumnya. Ragil tidak hanya membunuh — dia **mengumpulkan generasi kedua** dari keluarga korbannya dan menempatkan mereka di tempat yang sama. Di halaman terakhir: foto **Ratna Prasetya** di koridor mansion, 2009 — "Operator R-03. Dieliminasi." Epilog berbeda per karakter yang dimainkan.

**#25 — Mayoritas yang Diam (F)**
- **Kondisi:** ≥7 karakter hidup + moral <-10
- **Cerita:** Semua selamat secara fisik. Tidak ada yang bicara. Dua tahun kemudian, arsip Dewan bocor — termasuk dokumen **"Protokol Omega — Skenario Optimal"**: "Skenario terbaik bukan membunuh semua tamu. Skenario terbaik adalah membiarkan mereka semua hidup — dan memastikan mereka memilih diam. Mayoritas yang diam adalah **aset terbaik Dewan**." Ragil merencanakan keheningan ini. Dan semua kebenaran — tentang ibu Arya, ibu Sera, kakak Vira, ayah Juno, identitas Dimas, hubungan Lana-Niko — **terkubur bersama keheningan yang mereka pilih**. Keheningan yang membuktikan thesis Ragil: manusia lebih memilih kenyamanan daripada keadilan. Selalu.

---

## Lisensi

Proyek ini bersifat pribadi. Hak cipta dilindungi. by cacapaspas.
