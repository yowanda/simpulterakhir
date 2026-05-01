/* ============================================================
   SIMPUL TERAKHIR — BAB 8: Titik Balik
   Eskalasi. Kepercayaan runtuh. Senjata terangkat.
   ============================================================ */

const STORY_CH8 = {

'ch8_start': {
  chapter: 8,
  text: (s) => {
    let text = `<p class="narration">Dua jam sebelum fajar.</p>`;
    text += `<p class="narration">Udara mansion berubah. Lebih dingin. Lebih berat. Seperti ada sesuatu yang tak terlihat menekan dinding-dinding ini — memaksa mereka menyempit.</p>`;

    const aliveCount = Engine.CHARACTERS.filter(c => s.alive[c]).length;
    const killersAlive = (s.killers || []).filter(k => s.alive[k]).length;
    const escFound = (s.escapeClues || []).length;

    if (aliveCount <= 5) {
      text += `<p>Setengah dari kalian sudah tidak ada. Mansion yang tadinya terasa besar kini menyempit — setiap ruangan terasa seperti kuburan yang belum ditutup.</p>`;
    } else {
      text += `<p>Mansion Wardhana masih menyimpan terlalu banyak nyawa. Dan terlalu banyak rahasia.</p>`;
    }

    if (escFound >= 4) {
      text += `<p>Petunjuk pelarian mulai membentuk pola. Setiap petunjuk yang ditemukan membuat gambaran semakin jelas — ada jalan keluar. Tapi apakah cukup cepat?</p>`;
    }

    if (killersAlive > 0) {
      text += `<p>Di suatu tempat di mansion ini, ${killersAlive > 1 ? 'mereka' : 'seseorang'} masih berburu. Tapi sekarang, bukan hanya killer yang berbahaya — ketidakpercayaan bisa membunuh secepat pisau.</p>`;
    }

    const pc = s.playerCharacter || 'arin';
    if (pc === 'arin') {
      text += `<p class="journal"><em>Dua jam lagi. Dua jam lagi sampai fajar. Aku sudah menemukan banyak hal malam ini — tapi belum cukup. Recorder masih berputar. Cerita belum selesai. Dan aku tidak akan mati sebelum menulisnya.</em></p>`;
    } else if (pc === 'juno') {
      text += `<p class="journal"><em>Gue masih di sini. Masih hidup. Masih marah. Dan gue nggak akan berhenti sampai semua pembunuh di mansion ini bayar.</em></p>`;
    } else if (pc === 'sera') {
      text += `<p class="journal"><em>Pola perilaku kelompok bergeser. Paranoia mengambil alih rasionalitas. Profilingku menunjukkan satu hal: kita semua berpotensi menjadi pembunuh malam ini.</em></p>`;
    } else if (pc === 'reza') {
      text += `<p class="journal"><em>Dua puluh tahun di kepolisian mengajarkanku: jam-jam terakhir sebelum fajar adalah yang paling berbahaya. Orang-orang melakukan hal bodoh saat mereka kelelahan dan ketakutan.</em></p>`;
    }

    text += `<p class="narration">Eskalasi dimulai.</p>`;

    return text;
  },
  choices: [
    {
      text: "Kumpulkan semua yang tersisa — kita butuh rencana",
      next: 'ch8_regroup',
      effect: (s) => {
        s.flags.ch8regrouped = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Waktu berpencar — cari petunjuk sebanyak mungkin sebelum fajar",
      next: 'ch8_scatter',
      effect: (s) => {
        s.flags.ch8scattered = true;
        s.dangerLevel = Math.min(100, (s.dangerLevel || 0) + 15);
      }
    },
    {
      text: "Tidak ada yang bisa dipercaya. Aku bergerak sendiri.",
      next: 'ch8_lone_wolf',
      effect: (s) => {
        s.flags.ch8loner = true;
        s.dangerLevel = Math.min(100, (s.dangerLevel || 0) + 20);
      }
    }
  ]
},

'ch8_regroup': {
  text: (s) => {
    let text = `<p>Kau mengumpulkan siapa saja yang masih bisa dipercaya. Tidak banyak.</p>`;
    const allies = Engine.CHARACTERS.filter(c => s.alive[c] && c !== (s.playerCharacter || 'arin') && !(s.killers || []).includes(c));
    if (allies.length >= 3) {
      text += `<p>${allies.length} orang berdiri di hadapanmu. Wajah-wajah lelah, mata merah, tapi masih hidup. Masih berjuang.</p>`;
      text += `<p>"Kita tahu ada pembunuh di antara kita. Kita tahu ada petunjuk yang belum ditemukan. Dan kita tahu fajar adalah deadline-nya."</p>`;
    } else {
      text += `<p>Terlalu sedikit yang tersisa. Tapi kadang, yang sedikit sudah cukup.</p>`;
    }
    text += `<p>Rencana dibuat. Waktu berjalan. Setiap detik berarti.</p>`;
    return text;
  },
  choices: [
    {
      text: "Lanjutkan...",
      next: 'ch8_midpoint'
    }
  ]
},

'ch8_scatter': {
  text: (s) => {
    let text = `<p>Kelompok pecah. Berpencar ke seluruh penjuru mansion.</p>`;
    text += `<p>Efisien? Ya. Berbahaya? Sangat. Setiap orang yang sendirian adalah target potensial — bagi killer DAN bagi paranoia teman sendiri.</p>`;
    text += `<p>Tapi kalau mau menang, kadang harus mengambil risiko.</p>`;
    return text;
  },
  choices: [
    {
      text: "Lanjutkan...",
      next: 'ch8_midpoint'
    }
  ]
},

'ch8_lone_wolf': {
  text: (s) => {
    let text = `<p>Sendirian. Di mansion ini, itu bisa berarti kematian. Atau bisa berarti kebebasan.</p>`;
    text += `<p>Tanpa siapapun yang perlu kau lindungi — atau curigai — kau bisa bergerak lebih cepat. Mencari lebih banyak. Menyerang lebih keras.</p>`;
    text += `<p>Tapi tanpa siapapun yang menjaga punggungmu... satu kesalahan bisa jadi yang terakhir.</p>`;
    return text;
  },
  choices: [
    {
      text: "Lanjutkan...",
      next: 'ch8_midpoint'
    }
  ]
},

'ch8_midpoint': {
  text: (s) => {
    let text = `<p class="narration">Satu setengah jam sebelum fajar.</p>`;
    const escFound = (s.escapeClues || []).length;
    const destroyed = (s.destroyedClues || []).length;

    if (escFound >= 6) {
      text += `<p>Petunjuk demi petunjuk terkumpul. Pola sudah jelas — jalan keluar ada. Tinggal beberapa langkah lagi...</p>`;
    } else if (destroyed >= 5) {
      text += `<p>Terlalu banyak petunjuk yang dihancurkan. Waktu berjalan, dan peluang mengecil. Harus ada cara lain...</p>`;
    } else {
      text += `<p>Permainan berlanjut. Kedua sisi masih berjuang. Dan mansion ini menyaksikan semuanya.</p>`;
    }

    text += `<p>Di kejauhan, suara pecahan kaca. Seseorang berteriak. Atau mungkin hanya angin yang bermain dengan jendela yang sudah rusak.</p>`;
    text += `<p>Tidak ada yang aman. Tidak ada yang pasti. Kecuali satu hal: malam ini akan berakhir. Pertanyaannya — siapa yang masih berdiri saat fajar tiba?</p>`;

    return text;
  },
  choices: [
    {
      text: "Terus bergerak — cari petunjuk dan hadapi ancaman",
      next: 'ch9_start',
      effect: (s) => {
        s.flags.ch8completed = true;
      }
    }
  ]
}

};
