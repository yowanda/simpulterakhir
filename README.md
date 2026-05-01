# SIMPUL TERAKHIR

**Post-modern psychological horror/thriller interactive story — Bahasa Indonesia**

> *Sepuluh tamu. Satu mansion. Tiga simpul yang harus terputus. Siapa Sang Penenun?*

[▶ Mainkan Sekarang](https://simpul-terakhir-pmecbklb.devinapps.com/)

---

## Sinopsis

Undangan itu datang dalam amplop hitam, tanpa perangko, tanpa alamat pengirim. Sepuluh orang — masing-masing dengan alasan berbeda — tiba di **Mansion Wardhana**, estate terisolasi di tebing yang menghadap lautan.

**Niko Wardhana**, pewaris mansion, mengklaim ini adalah pameran seni imersif. Tapi saat pintu-pintu terkunci dan countdown dimulai, kebenaran terungkap: mansion ini telah menjadi arena **"simpul"** selama 50 tahun. Setiap tahun, tamu diundang. Beberapa tidak pernah kembali.

Di balik semua ini berdiri **Sang Penenun** — dalang anonim yang menenun jaringan kematian selama setengah abad. Dan malam ini, tiga simpul harus terputus sebelum fajar.

**Genre:** Post-modern psychological horror/thriller — terinspirasi *Scream*, *Knives Out*, *Saw*, dan *Black Mirror*. Bukan horor supernatural klasik, tapi mind-games, konspirasi, dan keputusan moral yang menentukan siapa yang hidup dan siapa yang mati.

---

## Fitur

### Gameplay & Cerita
- **7 chapter** dengan percabangan kompleks (Prolog + Bab 1-7)
- **27+ ending unik** dengan rating S / A / B / C / D / F
- **Ending bisa trigger di chapter manapun** — keputusan menentukan kapan cerita berakhir
- **3 tingkat kesulitan** yang mengubah jumlah killer:
  - **Mudah**: 1 killer (Lana)
  - **Normal**: 2 killers (Lana + Dimas)
  - **Sulit**: 3 killers (Lana + Dimas + Niko)
- **10 karakter** (5 main + 5 side) dengan profil mendalam dan hubungan kompleks
- **Sistem pemilihan peran (roleplay)** — mainkan sebagai salah satu dari 10 karakter:
  - Setiap karakter punya perspektif, dialog, dan inner monologue unik
  - Pilihan eksklusif berdasarkan keahlian karakter (hacking, profiling, manipulasi, dll)
  - Ending berubah sesuai perspektif karakter yang dimainkan
  - Bermain sebagai killer (Lana/Dimas) memberikan pengalaman antagonist yang berbeda total
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
- **100+ Decision Node per Karakter** — setiap karakter punya pohon keputusan unik
- **Sistem Win/Loss** — kamu bisa menang atau kalah sebagai killer maupun survivor:
  - **Survivor Win**: Selamat + identifikasi semua killer
  - **Survivor Loss**: Mati / gagal identifikasi killer
  - **Killer Win**: Eliminasi target tanpa terekspos
  - **Killer Loss**: Tertangkap / terbunuh / identitas terungkap
- **NPC Encounters** — NPC bertemu satu sama lain, membentuk aliansi, atau saling menyerang
- **NPC Action Log** — panel real-time untuk melihat apa yang dilakukan setiap NPC
- **Dynamic Choices** — pilihan baru muncul berdasarkan aksi NPC (tuduh, aliansi, serang, investigasi)
- **Tidak pakai AI live** — semua diatur oleh branching database, bukan generative AI

### Anti-Looping System (Baru!)
- **Player Action Tracking** — setiap brain action (investigasi, observasi, bicara, tuduh, dll.) hanya bisa dilakukan **1x per target per node** — tidak bisa diulang
- **Max 2 Brain Actions** per node sebelum otomatis paksa progressi cerita ("Lanjutkan cerita")
- **NPC Cooldown System** — setiap tipe aksi NPC punya cooldown 1-3 ronde, mencegah NPC mengulangi aksi yang sama berturut-turut
- **Action History** — NPC menyimpan 5 aksi terakhir; aksi yang baru dilakukan tidak akan dipilih lagi
- **Escalation Mechanism** — jika semua aksi on cooldown, NPC otomatis pindah lokasi (tidak diam/stuck)
- **Anti-Loop Fallback** — jika keputusan utama NPC terblokir cooldown, sistem mencari keputusan alternatif dari database
- **Location-Based Reset** — pindah ke lokasi baru me-reset aksi spesifik lokasi (investigasi, sembunyi)
- **160+ Decision Node** — database brain diperkaya dengan aksi movement, interaksi unik antar karakter, escalation chain, dan desperation actions

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
7. Sebagai **survivor**: kumpulkan bukti, bangun aliansi, ungkap killer, dan bertahan hidup
8. Sebagai **killer**: eliminasi target, jaga cover, framing, dan sabotase
9. Capai salah satu dari 27+ ending

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
    └── story-endings.js    # 27+ endings (S/A/B/C/D/F rating + win/loss endings)
```

---

## Lisensi

Proyek ini bersifat pribadi. Hak cipta dilindungi.
