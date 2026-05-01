/* ============================================================
   SIMPUL TERAKHIR — BAB 9: Terakhir Berdiri
   Endgame. Semua kartu terbuka. Siapa yang bertahan?
   ============================================================ */

const STORY_CH9 = {

'ch9_start': {
  chapter: 9,
  text: (s) => {
    let text = `<p class="narration">Satu jam sebelum fajar.</p>`;
    text += `<p class="narration">Langit di timur mulai berubah — bukan terang, belum. Tapi gelap yang berbeda. Gelap yang berjanji akan pergi.</p>`;

    const aliveCount = Engine.CHARACTERS.filter(c => s.alive[c]).length;
    const killersAlive = (s.killers || []).filter(k => s.alive[k]).length;
    const escFound = (s.escapeClues || []).length;
    const destroyed = (s.destroyedClues || []).length;

    text += `<p><strong>${aliveCount}</strong> orang masih berdiri. Dari sepuluh yang datang malam ini.</p>`;

    if (killersAlive === 0) {
      text += `<p>Semua killer sudah tereliminasi. Tapi apakah itu cukup? Apakah petunjuk pelarian cukup untuk keluar sebelum mansion ini menelan kalian?</p>`;
    } else {
      text += `<p>Di antara yang hidup — masih ada ${killersAlive > 1 ? 'pembunuh-pembunuh' : 'pembunuh'} yang bersembunyi. Atau mungkin tidak lagi bersembunyi.</p>`;
    }

    if (escFound >= 7) {
      text += `<p>Satu petunjuk lagi. SATU PETUNJUK LAGI dan jalan keluar terbuka. Identitas semua killer akan terungkap. Tapi waktu tidak menunggu siapapun.</p>`;
    } else if (escFound >= 5) {
      text += `<p>${escFound} petunjuk terkumpul. ${8 - escFound} lagi untuk mengungkap semua killer. Masih ada kesempatan...</p>`;
    }

    const pc = s.playerCharacter || 'arin';
    if (pc === 'arin') {
      text += `<p class="journal"><em>Satu jam. Aku bisa merasakan fajar mendekat — seperti detak jantung yang semakin cepat. Recorder hampir penuh. Cerita hampir lengkap. Satu jam lagi... ayo.</em></p>`;
    } else if (pc === 'niko') {
      text += `<p class="journal"><em>Mansionku. Keluargaku. Dosaku. Satu jam lagi untuk memperbaiki semuanya — atau setidaknya, mencoba.</em></p>`;
    } else if (pc === 'vira') {
      text += `<p class="journal"><em>Enam bulan lalu aku nyaris mati di sini. Malam ini... aku TIDAK AKAN membiarkan mansion ini menang lagi.</em></p>`;
    }

    text += `<p class="narration">Endgame dimulai.</p>`;

    return text;
  },
  choices: [
    {
      text: "Satu jam tersisa — kerahkan segalanya",
      next: 'ch9_all_in',
      effect: (s) => {
        s.flags.ch9allIn = true;
        s.moralScore += 5;
      }
    },
    {
      text: "Cari posisi defensif — bertahan sampai fajar",
      next: 'ch9_defend',
      effect: (s) => {
        s.flags.ch9defend = true;
      }
    },
    {
      text: "Saatnya berburu — habisi semua ancaman",
      next: 'ch9_hunt',
      effect: (s) => {
        s.flags.ch9hunt = true;
        s.dangerLevel = Math.min(100, (s.dangerLevel || 0) + 15);
      }
    }
  ]
},

'ch9_all_in': {
  text: (s) => {
    let text = `<p>Semua yang tersisa — energi, keberanian, kepercayaan — dikerahkan.</p>`;
    text += `<p>Kau menyusun rencana terakhir. Siapa mencari petunjuk, siapa menjaga, siapa menyerang. Setiap orang punya peran. Setiap detik berarti.</p>`;
    text += `<p>"Kita punya satu jam. SATU JAM. Setelah itu — entah kita keluar dari sini, atau mansion ini jadi kuburan kita."</p>`;
    return text;
  },
  choices: [
    { text: "Lanjutkan...", next: 'ch9_climax' }
  ]
},

'ch9_defend': {
  text: (s) => {
    let text = `<p>Pertahanan. Barrikade. Posisi tinggi. Satu jam — itu saja yang perlu kau tahan.</p>`;
    text += `<p>Kau memilih ruangan yang paling bisa dipertahankan. Pintu dikunci. Jendela ditutup. Senjata apapun yang ada — siap di tangan.</p>`;
    text += `<p>"Tidak ada yang masuk. Tidak ada yang keluar. Kita tunggu fajar."</p>`;
    text += `<p>Tapi di mansion ini... fajar tidak pernah datang tanpa harga.</p>`;
    return text;
  },
  choices: [
    { text: "Lanjutkan...", next: 'ch9_climax' }
  ]
},

'ch9_hunt': {
  text: (s) => {
    let text = `<p>Cukup bertahan. Cukup bersembunyi. Malam ini kau yang jadi predator.</p>`;
    text += `<p>Senjata di tangan. Langkah pelan tapi pasti. Kau menyusuri koridor demi koridor, ruangan demi ruangan.</p>`;
    text += `<p>"Aku tahu kau di sini. Dan aku TIDAK akan berhenti."</p>`;
    text += `<p>Pemburu dan buruan. Di mansion ini, batasnya semakin tipis.</p>`;
    return text;
  },
  choices: [
    { text: "Lanjutkan...", next: 'ch9_climax' }
  ]
},

'ch9_climax': {
  text: (s) => {
    let text = `<p class="narration">Tiga puluh menit sebelum fajar.</p>`;
    const escFound = (s.escapeClues || []).length;
    const killersAlive = (s.killers || []).filter(k => s.alive[k]).length;

    if (escFound >= 7 && killersAlive > 0) {
      text += `<p>Petunjuk hampir cukup. Killer masih hidup. Ini akan jadi pertarungan sampai akhir.</p>`;
    } else if (killersAlive === 0) {
      text += `<p>Semua killer sudah tidak ada. Tinggal satu pertanyaan: bisakah kalian keluar dari mansion ini?</p>`;
    } else {
      text += `<p>Waktu hampir habis. Setiap detik bisa mengubah segalanya. Siapa yang akan jatuh terakhir?</p>`;
    }

    text += `<p>Di koridor mansion yang panjang, suara langkah kaki bergema. Milikmu? Atau milik orang lain?</p>`;
    text += `<p class="narration">Babak terakhir menanti.</p>`;

    return text;
  },
  choices: [
    {
      text: "Menuju babak terakhir...",
      next: 'ch10_start',
      effect: (s) => {
        s.flags.ch9completed = true;
      }
    }
  ]
}

};
