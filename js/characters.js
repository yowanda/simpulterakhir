/* ============================================================
   SIMPUL TERAKHIR — Profil Karakter
   5 karakter dengan latar belakang dan kepribadian mendalam
   ============================================================ */

const CHARACTER_PROFILES = {
  arin: {
    name: 'Arin',
    fullName: 'Arin Prasetya',
    age: 22,
    role: 'Protagonis — Sang Penjaga',
    portrait: 'img/arin.png',
    quote: '"Kalau aku tidak menjaga mereka, siapa yang akan?"',
    appearance: 'Rambut hitam berantakan yang selalu terlihat seperti baru bangun tidur. Mata cokelat hangat yang memancarkan ketulusan. Selalu memakai jaket hiking hijau tua — hadiah terakhir dari almarhum ayahnya. Senyumnya kecil tapi menenangkan, seperti cahaya lilin di tengah badai.',
    personality: 'Arin adalah lem yang menyatukan kelompok ini. Di balik sikapnya yang tenang, dia memikul beban tanggung jawab yang berat. Sejak kehilangan ayahnya di usia 15 tahun, Arin berjanji untuk selalu melindungi orang-orang terdekatnya. Dia tidak pernah mengutamakan dirinya sendiri — dan itulah kelemahannya.',
    backstory: 'Anak tunggal dari keluarga sederhana. Ayahnya meninggal karena kecelakaan di hutan saat ekspedisi geologi. Sejak saat itu, Arin membenci hutan — tapi diam-diam, dia merasa terpanggil oleh hutan. Seolah ada sesuatu yang belum selesai di sana.',
    secret: 'Arin diam-diam menemukan jurnal ayahnya yang menyebut tentang "simpul" dan "perjanjian". Tapi dia terlalu takut untuk membacanya lebih lanjut.',
    relationships: {
      niko: 'Sahabat sejak SMP. Arin mengagumi kepercayaan diri Niko, tapi sering merasa cemas dengan ambisinya yang berlebihan.',
      sera: 'Ada perasaan yang tidak pernah diucapkan. Arin selalu merasa damai di dekat Sera, dan diam-diam ingin melindunginya dari segalanya.',
      juno: 'Teman yang selalu bisa diandalkan untuk tertawa. Tapi Arin tahu ada sesuatu yang Juno sembunyikan di balik leluconnya.',
      vira: 'Dulu mereka sangat dekat. Tapi sejak Vira kembali dari hutan, Arin merasa ada dinding tak terlihat di antara mereka.'
    },
    traits: ['Pelindung', 'Empatik', 'Pemberani', 'Terlalu Bertanggung Jawab'],
    weakness: 'Tidak bisa menolak permintaan orang lain, bahkan ketika itu membahayakan dirinya sendiri.',
    color: '#4a7c59'
  },

  niko: {
    name: 'Niko',
    fullName: 'Niko Wardhana',
    age: 23,
    role: 'Pemimpin Ambisius — Sang Pewaris',
    portrait: 'img/niko.png',
    quote: '"Kekuatan bukan milik yang pantas. Kekuatan milik yang berani mengambilnya."',
    appearance: 'Tampan dengan rahang tegas dan rambut hitam yang selalu tersisir rapi ke belakang. Mata gelapnya tajam dan menilai. Selalu berpakaian lebih baik dari yang lain — jaket kulit hitam mahal yang kontras dengan suasana hutan. Ada karisma alami yang membuat orang-orang mengikutinya, meski kadang secara tidak sadar.',
    personality: 'Niko adalah pemimpin alami yang tahu persis apa yang dia inginkan. Di balik senyum karismatiknya, tersembunyi kalkulasi dingin. Dia tidak jahat — tapi dia percaya bahwa tujuan membenarkan cara. Niko mencintai teman-temannya dengan caranya sendiri, tapi loyalitasnya selalu kalah dari ambisinya.',
    backstory: 'Cucu dari Kolonel Wardhana, tentara yang terlibat dalam ekspedisi militer 1973 di hutan Halimun. Kakeknya meninggal dengan meninggalkan batu aneh dan jurnal penuh tulisan yang seperti kode. Niko terobsesi membuktikan bahwa kakeknya menemukan sesuatu yang luar biasa — dan dia yakin perjalanan ini adalah kunci untuk mengungkapnya.',
    secret: 'Niko sudah tahu tentang entitas di hutan jauh sebelum mereka berangkat. Dia merencanakan perjalanan ini bukan untuk liburan, tapi untuk mengakses kekuatan yang kakeknya temukan.',
    relationships: {
      arin: 'Sahabat terlama. Niko menghormati Arin, tapi diam-diam menganggapnya terlalu lemah untuk memimpin.',
      sera: 'Tidak sepenuhnya mempercayai intuisi Sera. Merasa terancam karena Sera bisa "membaca" niat tersembunyinya.',
      juno: 'Menganggap Juno sebagai hiburan kelompok. Tidak tahu bahwa Juno punya informasi yang bisa menghancurkan rencananya.',
      vira: 'Hubungan paling rumit. Niko memanfaatkan koneksi Vira dengan entitas, tapi ada bagian dari dirinya yang benar-benar khawatir tentang kondisi Vira.'
    },
    traits: ['Karismatik', 'Kalkulatif', 'Ambisius', 'Manipulatif'],
    weakness: 'Keserakahannya terhadap kekuatan membuatnya buta terhadap konsekuensi.',
    color: '#2c2c2c'
  },

  sera: {
    name: 'Sera',
    fullName: 'Sera Amalina',
    age: 21,
    role: 'Sang Perasaan — Cahaya yang Lembut',
    portrait: 'img/sera.png',
    quote: '"Aku tidak perlu melihat untuk tahu. Aku merasakannya."',
    appearance: 'Cantik dengan cara yang membuat orang ingin melindunginya. Rambut cokelat tua bergelombang panjang yang selalu dihiasi jepit bunga kecil — kebiasaan sejak kecil. Mata cokelat besar yang bersinar dengan kepolosan dan kehangatan. Pipinya merona alami, dan senyumnya adalah jenis senyum yang membuat hari buruk terasa lebih baik. Sweater krem lembut yang selalu dia pakai memberinya aura hangat dan menenangkan.',
    personality: 'Sera adalah matahari kecil di tengah kelompok. Manis, lembut, dan selalu peduli pada perasaan orang lain. Tapi di balik kelembutannya, ada intuisi tajam yang hampir supernatural. Sera bisa merasakan emosi orang lain, mendeteksi kebohongan, dan kadang — melihat bayangan hal yang belum terjadi. Dia takut pada kemampuannya sendiri, tapi diam-diam tahu bahwa kemampuan itu adalah satu-satunya harapan kelompok.',
    backstory: 'Tumbuh di keluarga yang percaya pada hal-hal spiritual. Neneknya adalah dukun desa yang terkenal. Sejak kecil, Sera sering bermimpi tentang hal-hal yang kemudian terjadi. Dia mencoba menekan kemampuannya untuk terlihat "normal", tapi hutan Halimun membangkitkan semuanya kembali — lebih kuat dari sebelumnya.',
    secret: 'Sera mendapat telepon dari Vira seminggu sebelum perjalanan — telepon yang berisi suara tangisan dan bisikan dalam bahasa kuno. Sera tidak pernah menceritakannya ke siapapun karena takut dianggap gila.',
    relationships: {
      arin: 'Sera merasakan kehangatan dan perlindungan dari Arin yang tidak bisa dia jelaskan. Ada ikatan yang lebih dalam dari persahabatan — mungkin dari kehidupan lain.',
      niko: 'Sera tidak bisa sepenuhnya membaca Niko, dan itu membuatnya gelisah. Dia merasakan niat tersembunyi tapi tidak bisa membuktikannya.',
      juno: 'Sahabat terdekatnya. Sera tahu Juno menyimpan luka besar, dan dia selalu ada untuk mendengarkan — meski Juno jarang mau bercerita.',
      vira: 'Sera dan Vira dulu sangat dekat. Tapi sejak Vira kembali dari hutan, Sera merasakan kehadiran "sesuatu yang lain" di dalam diri Vira — dan itu membuatnya menangis di malam hari.'
    },
    traits: ['Manis', 'Intuitif', 'Empatik', 'Spiritual'],
    weakness: 'Terlalu sensitif terhadap penderitaan orang lain, membuatnya kewalahan dan rentan.',
    color: '#c4956a'
  },

  juno: {
    name: 'Juno',
    fullName: 'Juno Kirana',
    age: 22,
    role: 'Sang Topeng — Tawa yang Menyembunyikan Air Mata',
    portrait: 'img/juno.png',
    quote: '"Tertawa itu gratis. Menangis? Itu mahal — karena orang akan bertanya kenapa."',
    appearance: 'Cantik dengan gaya tomboy yang unik. Rambut hitam pendek model bob yang bergerak bebas ditiup angin. Mata gelap yang ekspresif — bisa berubah dari jenaka ke melankolis dalam sekejap. Kemeja flannel merah yang selalu dia gulung lengannya, seolah siap bekerja kapan saja. Senyumnya lebar dan menular, tapi siapa yang memperhatikan dengan seksama akan melihat bahwa senyum itu tidak pernah sampai ke matanya.',
    personality: 'Juno adalah pelawak kelompok — selalu punya lelucon, selalu punya komentar tajam. Tapi humornya adalah perisai. Di balik tawa dan candaan, Juno menyimpan rasa bersalah yang menggerogotinya dari dalam. Dia loyal sampai mati, tapi loyalitasnya berasal dari rasa bersalah, bukan keberanian.',
    backstory: 'Juno adalah saksi ketika Vira menghilang di hutan tiga minggu lalu. Dia ada di sana. Dia melihat Vira ditarik oleh sesuatu ke dalam kegelapan — dan dia membeku. Tidak berteriak. Tidak berlari menolong. Hanya berdiri dan menonton. Ketika Vira kembali tiga minggu kemudian, "berbeda", Juno tahu itu salahnya. Dan rasa bersalah itu memakan jiwanya.',
    secret: 'Juno menulis surat perpisahan sebelum perjalanan ini. Dia datang ke hutan bukan untuk liburan — tapi untuk menebus dosanya, apapun resikonya.',
    relationships: {
      arin: 'Menganggap Arin sebagai kompas moral kelompok. Diam-diam iri pada kemampuan Arin untuk selalu melakukan hal yang benar.',
      niko: 'Hubungan yang penuh dinamika. Juno tidak suka cara Niko memimpin, tapi terlalu takut untuk menentangnya secara terbuka.',
      sera: 'Sahabat terdekat. Sera adalah satu-satunya orang yang membuat Juno merasa aman untuk menjadi dirinya sendiri.',
      vira: 'Sumber rasa bersalah terbesarnya. Setiap kali menatap Vira, Juno melihat malam itu lagi — dan membeku.'
    },
    traits: ['Humoris', 'Loyal', 'Pemberontak', 'Dihantui Rasa Bersalah'],
    weakness: 'Rasa bersalahnya membuatnya mengambil keputusan impulsif dan kadang self-destructive.',
    color: '#c44d3d'
  },

  vira: {
    name: 'Vira',
    fullName: 'Vira Deviani',
    age: 22,
    role: 'Sang Bayangan — Keindahan yang Mematikan',
    portrait: 'img/vira.png',
    quote: '"Kalian pikir aku hilang. Tapi aku ditemukan."',
    appearance: 'Menakjubkan dengan cara yang membuat orang tidak bisa berpaling — dan tidak bisa sepenuhnya nyaman. Rambut hitam pekat lurus sepinggang yang bergerak seolah ada angin yang hanya dia rasakan. Mata yang dulu cokelat gelap kini memiliki kilatan hijau supernatural yang muncul di saat-saat tertentu. Gaun gelap keunguan yang elegan tapi tidak sesuai untuk perjalanan ke hutan — seolah dia berpakaian untuk acara lain. Kecantikannya menusuk, seperti pisau kristal — indah tapi berbahaya.',
    personality: 'Vira yang dulu — ceria, penuh energi, selalu tertawa — sudah tidak ada. Yang kembali dari hutan adalah seseorang yang berbicara dalam teka-teki, tersenyum pada hal yang tidak terlihat, dan kadang memandang teman-temannya seperti memandang mangsa. Tapi sesekali, di saat-saat yang tidak terduga, Vira yang asli muncul — ketakutan, memohon bantuan, sebelum ditarik kembali ke kegelapan. Apakah dia antagonis atau korban? Itu tergantung pilihanmu.',
    backstory: 'Tiga minggu lalu, Vira pergi hiking sendirian di hutan Halimun dan menghilang. Pencarian besar dilakukan tapi tidak menemukan apa-apa. Lalu suatu malam, dia muncul di depan pintu rumahnya — kotor, kurus, dengan senyum yang membuat ibunya menjerit. Entitas kuno yang tinggal di jantung hutan Halimun menemukan Vira — dan menjadikannya jembatan antara dunia mereka dan dunia manusia. Vira adalah umpan, perangkap, dan kunci sekaligus.',
    secret: 'Di lubuk terdalam kesadarannya, Vira yang asli masih berjuang. Dia sengaja mengundang teman-temannya ke hutan — bukan untuk menjebak mereka, tapi karena dia percaya merekalah satu-satunya harapan untuk membebaskannya. Sebuah taruhan terakhir yang bisa menyelamatkan semua orang, atau menghancurkan semuanya.',
    relationships: {
      arin: 'Dulu ada kedekatan yang nyaris romantis. Entitas di dalam dirinya memanfaatkan perasaan itu sebagai senjata — tapi Vira yang asli masih berharap Arin bisa mendengar jeritan diamnya.',
      niko: 'Hubungan yang paling berbahaya. Entitas tahu tentang ambisi Niko dan memanipulasinya. Niko pikir dia menggunakan Vira — padahal Vira yang menggunakannya.',
      sera: 'Takut pada Sera. Intuisi Sera adalah ancaman terbesar bagi entitas. Di saat yang sama, Vira yang asli berharap Sera bisa merasakan kehadirannya yang masih tersisa.',
      juno: 'Tahu bahwa Juno menyaksikan penculikannya. Entitas menggunakan rasa bersalah Juno sebagai alat manipulasi yang paling efektif.'
    },
    traits: ['Misterius', 'Manipulatif', 'Cantik Mematikan', 'Terpecah Dua'],
    weakness: 'Konflik internal antara Vira yang asli dan entitas yang merasukinya — ketika satu menguat, yang lain melemah.',
    color: '#2d5a27'
  }
};
