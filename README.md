# SIMPUL TERAKHIR

**Post-modern psychological horror/thriller fully interactive game — Bahasa Indonesia**

> *Sepuluh tamu. Satu mansion. Tiga simpul yang harus terputus. Siapa Sang Penenun?*

[▶ Mainkan Sekarang](https://yowanda.github.io/simpul-terakhir/)

---

## Sinopsis

Undangan itu datang dalam amplop hitam, tanpa perangko, tanpa alamat pengirim. Sepuluh orang — masing-masing dengan alasan berbeda — tiba di **Mansion Wardhana**, estate terisolasi di tebing yang menghadap lautan.

**Niko Wardhana**, pewaris mansion, mengklaim ini adalah pameran seni imersif. Tapi saat pintu-pintu terkunci dan countdown dimulai, kebenaran terungkap: mansion ini telah menjadi arena **"simpul"** selama 50 tahun. Setiap tahun, tamu diundang. Beberapa tidak pernah kembali.

Di balik semua ini berdiri **Sang Penenun** — dalang anonim yang menenun jaringan kematian selama setengah abad. Dan malam ini, tiga simpul harus terputus sebelum fajar.

**Genre:** Post-modern psychological horror/thriller — terinspirasi *Scream*, *Knives Out*, *Saw*, dan *Black Mirror*. Bukan horor supernatural klasik, tapi mind-games, konspirasi, dan keputusan moral yang menentukan siapa yang hidup dan siapa yang mati.

---

## Fitur

### Gameplay & Cerita
- **10 chapter** dengan percabangan kompleks (Prolog + Bab 1-10)
- **Escalation System (Bab 8-10)** — endgame lebih intens dengan pacing yang seimbang
- **Hasil akhir dinamis** — bukan ending pre-scripted, tapi berdasarkan hasil permainan sebenarnya
- **Ringkasan game otomatis** — tampilkan siapa yang tereliminasi, siapa yang menang, dan statistik permainan
- **Auto-simulasi** — jika player mati, NPC melanjutkan permainan sampai ada pemenang
- **3 tingkat kesulitan** yang mengubah jumlah killer:
  - **Mudah**: 1 killer (Lana)
  - **Normal**: 2 killers (Lana + Dimas)
  - **Sulit**: 3 killers (Lana + Dimas + Niko)
- **10 karakter** (5 main + 5 side) dengan profil mendalam dan hubungan kompleks
- **Sistem pemilihan peran** — pilih Killer (karakter spesifik) atau Survivor (karakter acak):
  - **Killer**: Pilih Lana, Dimas, atau Niko (tergantung difficulty) — pengalaman antagonist
  - **Survivor**: Dapat salah satu dari 7-9 protagonist secara acak
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
  - Lokasi di mansion (15 lokasi yang terhubung)
  - Siapa yang ada di dekat mereka
  - Clue yang sudah ditemukan
  - Aliansi dan musuh
- **505 Decision Entries** — 40-60+ keputusan per karakter (termasuk chapters 7-10 endgame) dengan weighted random selection + catch-all fallbacks
- **Sistem Win/Loss Dinamis** — hasil ditentukan oleh aksi NPC, bukan ending pre-scripted:
  - **Protagonis Menang**: Eliminasi semua killer ATAU kumpulkan **8 dari 15 petunjuk** → semua killer terungkap & dieksekusi
  - **Killer Menang**: Eliminasi protagonis hingga tersisa 1 ATAU hancurkan cukup petunjuk agar protagonist tak bisa capai 8
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

### Chatbox-Style UI
- **Dialog sebagai Chat Bubble** — setiap dialog karakter ditampilkan sebagai bubble chat dengan avatar
- **Player di Kanan** — pesan karakter yang dimainkan muncul di sisi kanan dengan tint hijau
- **NPC di Kiri** — pesan NPC lain muncul di sisi kiri dengan background gelap
- **Killer Bubble** — karakter killer punya bubble dengan tint merah dan glow effect menacing
- **Staggered Message Reveal** — pesan muncul satu per satu dengan animasi fade-in smooth, seperti chat asli
- **Scene Break Dividers** — pembatas visual (···) otomatis muncul di antara narasi panjang agar lebih mudah dibaca
- **Click-to-Skip** — klik area cerita untuk langsung tampilkan semua teks
- **Choices Fade-In** — pilihan muncul dengan animasi smooth setelah semua teks terlihat
- **Horror Narration Glow** — narasi horor punya efek glow berdenyut (pulsing red)
- **Hover Effects** — bubble dan avatar bereaksi saat di-hover
- **Narasi Centered** — deskripsi dan narasi non-dialog muncul di tengah dengan garis dekoratif
- **Location Context** — info lokasi tampil sebagai pill-shaped system message
- **Responsive** — avatar dan font otomatis mengecil di mobile

### Framing & Divide Mechanic
- **Framing** — killer bisa menanamkan bukti palsu ke target (45% chance sukses):
  - **Sukses**: Target suspicion +25-40%, trust dengan NPC lain hancur (-25), NPC tandai target sebagai MUSUH, target kehilangan semua allies, tension +20
  - **Gagal**: Suspicion KILLER naik +20%, NPC sekitar jadi curiga ke killer (+15)
- **Divide** — killer NPC bisa memecah kelompok survivor (60% chance pindahkan survivor ke lokasi random)

### Anti-Looping System
- **Player Action Tracking** — setiap brain action hanya bisa dilakukan **1x per target per node**
- **Max Brain Actions** per node — Survivor: 5 aksi, Killer: 3 aksi (pacing lebih lambat untuk killer)
- **NPC Cooldown System** — setiap tipe aksi NPC punya cooldown 1-4 ronde (killer cooldown lebih tinggi: eliminate/strike 3 ronde, divide/isolate 4 ronde)
- **NPC Killer Hesitation** — 35% chance killer NPC skip round (ragu-ragu), memperlambat momentum killer
- **Escalation Mechanism** — jika semua aksi on cooldown, NPC otomatis pindah lokasi
- **Location-Based Reset** — pindah ke lokasi baru me-reset aksi spesifik lokasi
- **Max Opsi** — Survivor: 6 pilihan, Killer: 4 pilihan per node (brain interactive prioritas, 1 story max), shuffled setiap game
- **Killer Movement Restriction** — Killer hanya bisa pilih 2 lokasi pindah (vs 3 untuk survivor)

### 7 Alat Unik
Setiap alat hanya bisa dipegang 1 karakter. Tidak ada duplikat. Muncul saat event terpicu di lokasi tertentu.

| Alat | Lokasi | Tipe | Efek |
|------|--------|------|------|
| 🔪 Pisau Dapur | Dapur | Weapon | +40% kill, tapi tinggalkan bukti |
| 🔑 Kunci Master | Ruang Penyimpanan | Support | Buka semua pintu, +20% defense |
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

### Realtime Player Status
- Status bar real-time menampilkan kondisi karakter pemain:
  - **AMAN** — tidak ada ancaman terdeteksi
  - **TERDETEKSI** — killer tahu pemain menginvestigasi
  - **PANIK** — danger level tinggi atau terluka
  - **TERLUKA** — pemain terkena serangan
  - **ANCAMAN** — killer sedang memburu pemain
- Tool yang dipegang ditampilkan di status bar
- **Petunjuk Pelarian** — progress petunjuk ditemukan vs total
- **Killer Dieliminasi** — jumlah killer yang sudah dikalahkan
- **Diburu** — jumlah killer yang sedang diburu (disaksikan membunuh)

### Sistem Petunjuk Pelarian
- **15 Petunjuk Pelarian** tersebar di seluruh mansion — kumpulkan **8 petunjuk** untuk mengungkap identitas semua killer
- **Jika 8 petunjuk terkumpul** → semua killer langsung terungkap dan dieksekusi oleh tim protagonis!
- **Killer bisa MENGHANCURKAN petunjuk** — jika sisa petunjuk < 8, killer menang karena protagonist tak bisa mengungkap identitas mereka
- **15 Lokasi Petunjuk**:
  | Petunjuk | Lokasi | Deskripsi |
  |----------|--------|-----------|
  | Peta Rahasia Mansion | Perpustakaan | Peta tua jalur rahasia keluar |
  | Kode Pintu Darurat | Basement | Kode untuk pintu darurat |
  | Blueprint Terowongan | Bunker B-3 | Cetak biru terowongan bawah tanah |
  | Frekuensi Radio Darurat | Menara | Frekuensi untuk panggil bantuan |
  | Kunci Terowongan | Lorong Rahasia | Kunci pintu terowongan pelarian |
  | Jurnal Pendiri | Ruang Penyimpanan | Catatan semua jalan keluar |
  | Jalur Pelarian Atap | Atap | Tangga darurat tersembunyi |
  | Pintu Belakang Dapur | Dapur | Kunci cadangan pintu belakang |
  | Panel Rahasia Galeri | Galeri Timur | Panel dinding tersembunyi |
  | Celah Pagar Taman | Taman Dalam | Celah di pagar taman |
  | Peta Ventilasi | Koridor Selatan | Skema ventilasi mansion |
  | Dokumen Evakuasi | Aula Utama | Dokumen prosedur evakuasi |
  | Catatan Tamu Lama | Kamar Tamu | Catatan tamu sebelumnya |
  | Partitur Tersembunyi | Ruang Musik | Partitur yang membuka pintu rahasia |
  | Kunci Gudang Luar | Gudang | Kunci gudang luar mansion |
- **Progress ditampilkan** di status bar real-time (x/8 dibutuhkan, y/15 total)

### Killer vs Killer
- Killer bisa **menyabotase killer lain** untuk menyelamatkan diri sendiri (chapter 3+)
- Lana bisa mengekspos Dimas/Niko, Dimas bisa mengkhianati Lana, Niko bisa mengaktifkan CCTV
- Sistem chance 45% untuk sabotase antar killer — adil dan seimbang
- Killer yang terancam terekspos bisa mengorbankan killer lain — game tetap lanjut
- Membuat dinamika killer lebih menarik: tidak hanya melawan survivor

### Aliansi Kooperatif
- Survivor otomatis **membentuk aliansi** saat death count meningkat
- NPC bersenjata (punya tool) memberikan bonus pertahanan bersama
- Pertahanan terkoordinasi di lokasi yang sama
- Survivor NPC bisa menyerang killer yang terekspos

### Interactive Choice System (Baru!)
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

## Struktur Cerita (7 Chapter)

| Chapter | Judul | Fokus |
|---------|-------|-------|
| Prolog | **Undangan** | Kedatangan, perkenalan 10 karakter, atmosphere setup |
| Bab 1 | **Pameran Maut** | Pameran dimulai, sistem simpul terungkap, bukti pertama |
| Bab 2 | **Darah Pertama** | Truth-or-lie game, racun Farah, hard drive ditemukan |
| Bab 3 | **Pecah Belah** | Kelompok terpecah, lantai 3 terungkap, kematian pertama |
| Bab 4 | **Perburuan** | Pemburu vs mangsa, kunci master, jebakan untuk Penenun |
| Bab 5 | **Wahyu** | Identitas Sang Penenun terungkap, B-3 ditemukan |
| Bab 6 | **Konfrontasi** | Pertempuran final — bakar, broadcast, atau konfrontasi |
| Bab 7 | **Simpul Terakhir** | Fajar, resolusi, dan konsekuensi dari setiap pilihan |

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
   - Kumpulkan **8 dari 15 petunjuk** untuk mengungkap identitas semua killer — mereka akan dieksekusi!
   - ATAU habisi semua killer yang menyamar
   - Bangun aliansi, investigasi, dan bertahan hidup
   - Jika kamu menyaksikan pembunuhan, killer akan DIBURU oleh tim protagonis
   - Hati-hati dengan trust rendah — NPC bisa saling membunuh karena ketidakpercayaan!
8. Sebagai **killer**:
   - Habisi protagonis sampai tersisa 1
   - ATAU hancurkan petunjuk agar tersisa < 8 (protagonist tidak bisa mengungkap identitasmu)
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
    ├── story-ch1.js        # Bab 1: Pameran Maut
    ├── story-ch2.js        # Bab 2: Darah Pertama
    ├── story-ch3.js        # Bab 3: Pecah Belah
    ├── story-ch4.js        # Bab 4: Perburuan
    ├── story-ch5.js        # Bab 5: Wahyu
    ├── story-ch6.js        # Bab 6: Konfrontasi
    ├── story-ch7.js        # Bab 7: Simpul Terakhir
    ├── story-ch8.js        # Bab 8: Titik Balik (escalation begins)
    ├── story-ch9.js        # Bab 9: Terakhir Berdiri (endgame)
    ├── story-ch10.js       # Bab 10: Fajar Berdarah (final chapter)
    └── story-endings.js    # Story endings + dynamic game result system
```

---

## Lisensi

Proyek ini bersifat pribadi. Hak cipta dilindungi.
