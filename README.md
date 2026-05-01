# 🌿 Simpul Terakhir

**Text-based interactive horror story game — Bahasa Indonesia**

> *Lima sahabat. Satu cabin di hutan terkutuk. Dua puluh lima ending. Siapa yang akan selamat?*

[▶ Mainkan Sekarang](https://the-hollow-soojoloi.devinapps.com/)

---

## 📖 Sinopsis

Enam bulan lalu, **Vira** pergi camping sendirian ke Gunung Halimun. Dia menghilang selama tiga minggu. Ketika kembali, dia tersenyum seperti tidak terjadi apa-apa — tapi sesuatu telah berubah.

Sekarang, **Niko** mengajak lima sahabat lama ke cabin keluarganya di tepi hutan yang terhubung dengan Halimun. Alasannya: reuni. Tapi Niko menyimpan rahasia — warisan kakeknya, sebuah batu misterius yang berdenyut seperti jantung, dan jurnal yang menceritakan perjanjian kuno antara manusia dan hutan.

Di cabin itu, kebenaran mulai terungkap. Entitas kuno yang menjaga hutan selama lima ratus tahun menginginkan sesuatu: **lima simpul baru**. Lima ikatan yang tulus. Dan dia sudah mengambil Vira sebagai jembatan.

Setiap pilihan yang kamu buat menentukan siapa yang hidup, siapa yang mati, dan apakah simpul terakhir akan menyelamatkan — atau menghancurkan — segalanya.

---

## 🎮 Fitur

### Cerita & Gameplay
- **25 ending unik** dengan rating S / A / B / C / D / F
- **3 tingkat kesulitan** — Mudah, Normal, Sulit (mempengaruhi kematian karakter, kekuatan entitas, dan petunjuk)
- **5 karakter** dengan kepribadian dan rahasia masing-masing
- **Sistem trust** — kepercayaan antar karakter berubah berdasarkan pilihanmu
- **Sistem moral** — pilihan etis mempengaruhi ending
- **Sistem awareness** — seberapa banyak Arin mengetahui kebenaran
- **Karakter bisa mati** — keputusan berisiko tinggi punya konsekuensi nyata
- **Auto-save** — progress tersimpan otomatis di browser

### Karakter
| Karakter | Peran |
|----------|-------|
| **Arin** | Protagonis — kamu. Penjaga keseimbangan kelompok. |
| **Niko** | Pemimpin egois. Menyimpan rahasia tentang warisan kakeknya. |
| **Sera** | Sensitif dan intuitif. Tahu ada yang salah dengan Vira sejak awal. |
| **Juno** | Penyembunyi rasa bersalah. Menyaksikan Vira diambil di Halimun. |
| **Vira** | Dirasuki entitas kuno hutan. Vira asli tertidur di bawah akar pohon. |

### Visual & Atmosfer
- Ilustrasi atmosferik CSS untuk setiap jenis scene (hutan, cabin, ritual, entitas, fajar)
- Partikel ambient melayang (entity presence)
- Efek transisi chapter dan text fade-in
- Screen shake pada momen intens
- Death flash dan entity ambient glow
- Fog drift animation

---

## 🏗️ Struktur Proyek

```
simpul-terakhir/
├── index.html              # Entry point
├── css/
│   └── style.css           # Styling, animasi, CSS art
├── js/
│   ├── engine.js           # Game engine (state, rendering, effects)
│   ├── story-prolog.js     # Prolog — perjalanan ke cabin
│   ├── story-ch1.js        # Bab 1 — malam pertama
│   ├── story-ch2.js        # Bab 2 — kebenaran terungkap
│   ├── story-ch3.js        # Bab 3 & 4 — klimaks & simpul terakhir
│   └── story-endings.js    # 25 ending computation & narasi
└── README.md
```

---

## 🔧 Tech Stack

- **Pure HTML/CSS/JavaScript** — tanpa framework, tanpa build tools
- **CSS Art** — ilustrasi scene menggunakan gradient & animation (tanpa file gambar)
- **localStorage** — auto-save progress
- **100% client-side** — tidak ada backend, bisa di-host di mana saja

---

## 🚀 Cara Main

### Online
Langsung mainkan di: [https://the-hollow-soojoloi.devinapps.com/](https://the-hollow-soojoloi.devinapps.com/)

### Lokal
```bash
git clone https://github.com/yowanda/simpul-terakhir.git
cd simpul-terakhir
# Buka index.html di browser, atau gunakan live server:
python3 -m http.server 8000
# Lalu buka http://localhost:8000
```

### GitHub Pages
1. Buka **Settings** → **Pages** di repository
2. Pilih branch `main`, folder `/ (root)`
3. Save — situs akan live dalam beberapa menit

---

## 🌳 Alur Cerita (Spoiler-Free)

```
Prolog: Perjalanan ke Cabin
    ↓
Bab 1: Malam Pertama — rahasia mulai terungkap
    ↓
Bab 2: Kebenaran — konfrontasi dengan entitas & pengungkapan Niko
    ↓
Bab 3: Keputusan — ritual, pelarian, atau negosiasi?
    ↓
Bab 4: Simpul Terakhir — 25 ending berdasarkan semua pilihanmu
```

### Tier Ending
| Tier | Jumlah | Deskripsi |
|------|--------|-----------|
| S | 2 | Ending sempurna — semua selamat, simpul utuh |
| A | 4 | Ending baik — pengorbanan bermakna |
| B | 6 | Ending netral — ada yang hilang, tapi ada harapan |
| C | 6 | Ending buruk — konsekuensi berat |
| D | 5 | Ending tragis — kehilangan besar |
| F | 2 | Ending terburuk — kekalahan total |

---

## 📝 Lisensi

Proyek personal. Semua hak cipta dilindungi.

---

*Dibuat dengan cinta, ketakutan, dan secangkir kopi di malam yang terlalu sunyi.* 🌙
