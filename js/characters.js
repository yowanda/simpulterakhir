/* ============================================================
   SIMPUL TERAKHIR — Profil Karakter (Reworked)
   10 karakter: 5 utama + 5 sampingan
   Post-modern horror thriller
   ============================================================ */

const CHARACTER_PROFILES = {
  arin: {
    name: 'Arin',
    fullName: 'Arin Prasetya',
    age: 24,
    role: 'Protagonis — Sang Pencari Kebenaran',
    portrait: 'img/arin.png',
    isMain: true,
    quote: '"Kebenaran tidak pernah nyaman. Tapi kebohongan selalu lebih mahal."',
    appearance: 'Rambut hitam berantakan, jaket army hijau tua penuh pin dan patch dari investigasi-investigasi sebelumnya. Mata cokelat yang tajam — mata orang yang terbiasa membaca detail kecil. Selalu membawa recorder dan notes kecil. Bekas luka tipis di pelipis kiri — kenang-kenangan dari investigasi terakhir yang hampir membunuhnya.',
    personality: 'Mantan jurnalis investigasi yang sekarang menjalankan podcast true crime "Jejak Mati". Arin punya insting yang tajam untuk mendeteksi kebohongan, tapi kebiasaan menggali kebenaran sering membuatnya menjadi target. Dia datang ke acara ini karena Niko menjanjikan akses eksklusif ke cerita yang "akan mengubah segalanya".',
    backstory: 'Setahun lalu, Arin mengungkap skandal korupsi besar yang melibatkan orang-orang berkuasa. Sumber utamanya ditemukan tewas — resmi bunuh diri, tapi Arin tidak percaya. Sejak itu, dia terobsesi mencari kebenaran di balik setiap kematian.',
    secret: 'Arin menerima email anonim tiga hari sebelum acara: "Datang ke pameran. Pembunuh sumbermu akan ada di sana." Dia tidak memberitahu siapapun.',
    relationships: {
      niko: 'Teman kuliah lama. Arin mengagumi ambisi Niko tapi curiga dengan motif tersembunyinya.',
      sera: 'Ada rasa yang tidak pernah diucapkan — chemistry yang keduanya rasakan tapi takut merusak pertemanan. Sera adalah satu-satunya orang yang membuat Arin merasa tidak perlu selalu waspada. Di malam tergelap, tangan mereka selalu saling mencari.',
      juno: 'Partner in crime. Juno sering membantu investigasi Arin dengan koneksi jalanannya. Ada loyalitas yang melampaui pertemanan biasa.',
      vira: 'Dulu sangat dekat — ada periode di mana perasaan mereka lebih dari sekadar teman. Sekarang ada jarak yang menyakitkan keduanya.',
      dimas: 'Dimas terlalu sopan, terlalu tenang — Arin merasakan ada topeng yang belum dia bisa kupas.'
    },
    emotionalRole: 'Idealis yang ceroboh — insting jurnalisnya membuatnya menerjang bahaya tanpa memikirkan hati orang-orang di sekitarnya.',
    traits: ['Analitis', 'Perseptif', 'Pemberani', 'Obsesif', 'Ceroboh dalam Perasaan'],
    weakness: 'Kebutuhan obsesifnya akan kebenaran membuatnya buta terhadap bahaya di depan mata — dan terhadap perasaan orang-orang yang mencintainya.',
    color: '#4a7c59'
  },

  niko: {
    name: 'Niko',
    fullName: 'Niko Wardhana',
    age: 26,
    role: 'Sang Dalang — Tuan Rumah dengan Agenda',
    portrait: 'img/niko.png',
    isMain: true,
    quote: '"Setiap orang punya harga. Yang membedakan hanya mata uangnya."',
    appearance: 'Tampan dengan cara yang terkalkulasi. Rambut hitam gel ke belakang, setelan semi-formal yang terlalu rapi untuk acara kasual. Jam tangan mahal yang selalu dia putar saat berpikir. Senyumnya sempurna — terlalu sempurna, seperti dilatih di depan cermin.',
    personality: 'CEO muda dari startup teknologi yang sedang naik daun. Niko adalah tipe orang yang selalu punya rencana B, C, dan D. Karismatik dan manipulatif secara halus — dia tidak memaksa orang, dia membuat mereka berpikir bahwa ide-idenya adalah ide mereka sendiri.',
    backstory: 'Cucu dari industrialis kaya yang membangun mansion ini pada tahun 70-an. Setelah kakeknya meninggal dalam keadaan misterius tahun lalu, Niko mewarisi properti dan menemukan dokumen-dokumen yang menghubungkan keluarganya dengan serangkaian kematian yang tidak pernah terselesaikan.',
    secret: 'Niko mengundang semua orang ke sini bukan untuk pameran seni — tapi untuk mengungkap siapa di antara tamu-tamunya yang terhubung dengan kematian kakeknya. Dia sudah tahu lebih banyak dari yang dia tunjukkan.',
    relationships: {
      arin: 'Teman terlama. Niko menghormati inteligensi Arin tapi menganggapnya terlalu idealis. Diam-diam iri dengan integritas Arin yang tidak bisa dia miliki.',
      sera: 'Tidak nyaman dengan kemampuan Sera membaca orang. Merasa terekspos. Pernah mencoba merayunya untuk mengalihkan perhatian — gagal total.',
      juno: 'Menganggap Juno sebagai variabel tak terduga. Ada tarikan fisik yang dia tolak karena Juno adalah tipe yang tidak bisa dia kontrol.',
      vira: 'Toxic love history. Mereka berpacaran sebelum Vira menghilang — Niko yang memutuskan karena Vira "terlalu intens". Rasa bersalah membuatnya mengundang Vira kembali.',
      lana: 'Saling memanipulasi. Lana menggodanya untuk mendapat informasi. Niko membiarkannya karena ego — merasa bisa memenangkan permainan.'
    },
    emotionalRole: 'Dalang egois — master manipulator yang menggunakan charm dan gaslighting untuk mengontrol narasi. Tapi di balik itu, ada anak kecil yang takut ditinggalkan.',
    traits: ['Karismatik', 'Kalkulatif', 'Ambisius', 'Manipulatif', 'Egois'],
    weakness: 'Kebutuhannya untuk mengontrol situasi membuatnya lambat bereaksi ketika rencana berantakan. Egonya menolak meminta tolong bahkan saat nyawanya terancam.',
    color: '#2c2c2c'
  },

  sera: {
    name: 'Sera',
    fullName: 'Sera Amalina',
    age: 23,
    role: 'Sang Pembaca — Mata yang Melihat Terlalu Banyak',
    portrait: 'img/sera.png',
    isMain: true,
    quote: '"Orang-orang bicara dengan mulut mereka. Tapi tubuh mereka berteriak."',
    appearance: 'Rambut cokelat bergelombang, kacamata bulat yang sering dia lepas saat berkonsentrasi. Cardigan oversized warna krem, selalu memegang notes kecil berisi observasi perilaku. Mata besar yang hangat tapi intimidating karena intensitasnya saat memperhatikan seseorang.',
    personality: 'Mahasiswa psikologi forensik semester akhir. Sera bisa membaca microexpression dan body language dengan akurasi yang membuat orang tidak nyaman. Kemampuannya bukan supernatural — murni ilmiah, hasil bertahun-tahun studi dan observasi. Tapi kadang hasilnya begitu akurat, orang menganggapnya cenayang.',
    backstory: 'Thesis Sera adalah tentang "Psychopathology of Undetected Killers in Social Circles" — pembunuh yang hidup normal di tengah masyarakat tanpa terdeteksi. Ironisnya, penelitiannya membawanya ke tempat yang paling berbahaya.',
    secret: 'Sera sudah mengidentifikasi pola perilaku mencurigakan pada salah satu tamu sejak malam pertama. Tapi dia tidak yakin dengan kesimpulannya — karena kalau dia benar, implikasinya terlalu mengerikan.',
    relationships: {
      arin: 'Cinta yang tidak terucapkan — perasaan terdalam yang dia sembunyikan di balik profesionalisme. Arin adalah satu-satunya orang yang membuat jantungnya berdetak tidak teratur, dan Sera BENCI tidak bisa menganalisis perasaannya sendiri.',
      niko: 'Sera bisa merasakan manipulasi Niko dan itu membuatnya jijik sekaligus fascinated. Pernah ada momen di mana Niko mencoba merayunya — Sera membaca setiap microexpression dan menolaknya dengan pembedahan verbal yang brutal.',
      juno: 'Sahabat terdekat. Sera tahu Juno menyimpan trauma besar dan diam-diam menanggung beban itu juga.',
      vira: 'Sebelum menghilang, Vira adalah subjek studi informal Sera. Sejak kembali, perilaku Vira tidak cocok dengan baseline yang Sera kenal.',
      dimas: 'Dimas tertarik padanya secara obsesif — Sera menyadarinya dan merasa tidak nyaman. Ada sesuatu yang kosong di mata Dimas saat menatapnya.'
    },
    emotionalRole: 'Negosiator emosional — bisa membaca dan meredakan konflik, tapi gagal total mengurus perasaannya sendiri. Kecerdasannya menjadi tameng dari kerentanan.',
    traits: ['Perceptif', 'Analitis', 'Empatik', 'Hati-hati', 'Romantis Terpendam'],
    weakness: 'Terlalu banyak menganalisis membuatnya lambat bertindak. Perasaannya pada Arin membuatnya bias dalam situasi kritis.',
    color: '#c4956a'
  },

  juno: {
    name: 'Juno',
    fullName: 'Juno Kirana',
    age: 24,
    role: 'Sang Pemberontak — Api di Balik Tawa',
    portrait: 'img/juno.png',
    isMain: true,
    quote: '"Aku tertawa supaya tidak menjerit. Kadang aku lupa bedanya."',
    appearance: 'Rambut hitam bob asimetris dengan highlight merah. Mata gelap ekspresif yang bisa berubah dari jenaka ke menakutkan dalam sekejap. Jaket kulit penuh pin band underground, boots combat, dan tato geometric di pergelangan tangan — masing-masing mewakili seseorang yang dia kehilangan.',
    personality: 'Street artist dan aktivis yang terkenal di scene underground. Juno punya mulut tajam dan insting jalanan yang luar biasa. Humornya gelap, referensinya niche, dan loyalitasnya absolut — sampai kau mengkhianatinya.',
    backstory: 'Juno menyaksikan temannya dibunuh dalam hate crime dua tahun lalu. Pelakunya tidak pernah tertangkap. Sejak itu, Juno menghabiskan waktu membuat seni yang mengekspos kekerasan tersembunyi di masyarakat. Salah satu muralnya menjadi viral dan membuatnya jadi target.',
    secret: 'Juno mengenali salah satu tamu dari investigasinya sendiri — seseorang yang mungkin terhubung dengan kematian temannya. Dia datang ke pameran ini bukan untuk seni, tapi untuk konfrontasi.',
    relationships: {
      arin: 'Partner in crime. Saling melengkapi — Arin punya metodologi, Juno punya insting. Juno diam-diam tahu tentang perasaan Arin ke Sera dan mendorong dari belakang.',
      niko: 'Tidak percaya pada orang kaya. Niko mewakili semua yang Juno benci tentang privilege. Tapi ada tarikan fisik yang membuat Juno marah pada dirinya sendiri.',
      sera: 'Sahabat terdekat. Sera adalah satu-satunya orang yang boleh melihat Juno menangis. Juno protektif terhadap Sera sampai level posesif.',
      vira: 'Sumber rasa bersalah terbesar. Juno tahu sesuatu tentang malam Vira menghilang yang belum dia ceritakan.',
      reza: 'Unexpected connection. Di balik perbedaan usia dan background, ada kesamaan — keduanya menyimpan kegagalan yang mendefinisikan hidup mereka. Ada rasa nyaman yang mengejutkan keduanya.'
    },
    emotionalRole: 'Pemantik konflik — api yang tidak bisa dikontrol. Emosi Juno meletup-letup dan membakar setiap ruangan. Impulsif, ceroboh, tapi keberanian itu juga yang menyelamatkan nyawa.',
    traits: ['Berani', 'Loyal', 'Impulsif', 'Dihantui Masa Lalu', 'Pemantik Konflik'],
    weakness: 'Impulsivitasnya dalam situasi emosional bisa membahayakan diri sendiri dan orang lain. Kecerobohannya pernah membunuh — dan mungkin akan lagi.',
    color: '#c44d3d'
  },

  vira: {
    name: 'Vira',
    fullName: 'Vira Deviani',
    age: 24,
    role: 'Sang Enigma — Kembali tapi Berbeda',
    portrait: 'img/vira.png',
    isMain: true,
    quote: '"Aku tidak hilang. Aku hanya... berada di tempat yang tidak bisa kalian jangkau."',
    appearance: 'Kecantikan yang membuat orang tidak bisa berpaling — dan tidak bisa sepenuhnya nyaman. Rambut hitam lurus sepinggang yang selalu sempurna. Mata dengan lingkaran hitam permanen yang entah kenapa menambah daya tariknya. Selalu berpakaian gelap. Gerakannya terlalu halus, terlalu tepat, seperti diprogram.',
    personality: 'Vira menghilang enam bulan lalu. Ditemukan di pinggir jalan, tidak ingat apa-apa. Tapi sejak kembali, ada sesuatu yang... bergeser. Vira yang dulu spontan dan berisik sekarang tenang dan penuh perhitungan. Dia berbicara dalam kalimat yang terasa seperti teka-teki. Dan kadang, di sudut mata, kau menangkap ekspresi yang bukan miliknya.',
    backstory: 'Sebelum menghilang, Vira adalah fotografer yang dikenal karena seri foto kontroversialnya "Faces of the Dead" — foto-foto lokasi pembunuhan yang diambil ulang dengan model hidup. Polisi menemukan bahwa beberapa lokasi dalam fotonya cocok dengan kasus cold case yang belum terpecahkan.',
    secret: 'Vira ingat segalanya tentang enam bulan itu. Dia tidak amnesia. Dia memilih diam karena apa yang dia alami terlalu berbahaya untuk diceritakan — dan orang yang bertanggung jawab mungkin ada di ruangan yang sama.',
    relationships: {
      arin: 'Dulu sangat dekat — ada periode abu-abu di mana mereka hampir menjadi lebih. Sekarang Vira menjaga jarak bukan karena tidak percaya, tapi karena takut Arin melihat apa yang ada di dalam dirinya sekarang.',
      niko: 'Mantan kekasih. Toxic relationship yang berakhir dengan Niko membuang Vira tepat sebelum dia menghilang. Vira masih menyimpan perasaan — dan itu membuatnya benci diri sendiri.',
      sera: 'Sadar bahwa Sera bisa membacanya. Bermain kucing-kucingan. Tapi diam-diam, Vira ingin Sera menembus dindingnya.',
      juno: 'Merasa bersalah karena membuat Juno menyimpan rahasia tentang malam itu. Juno melihat sisi Vira yang tidak dia tunjukkan ke siapapun.'
    },
    emotionalRole: 'Eksentrik misterius — perilakunya tidak terprediksi, kata-katanya seperti teka-teki, dan kehadirannya membuat semua orang gelisah. Tapi di balik eksentrisitas itu ada trauma yang belum sembuh dan cinta yang masih menyala.',
    traits: ['Misterius', 'Cerdas', 'Terfragmentasi', 'Berbahaya', 'Eksentrik'],
    weakness: 'Kebutuhannya untuk menyimpan rahasia membuatnya terisolasi. Perasaannya pada Niko adalah kelemahan yang bisa dieksploitasi.',
    color: '#4a2d5c'
  },

  reza: {
    name: 'Reza',
    fullName: 'Reza Hartono',
    age: 38,
    role: 'Sang Veteran — Hukum yang Sudah Retak',
    portrait: null,
    isMain: false,
    quote: '"Aku sudah lihat terlalu banyak mayat untuk percaya pada kebetulan."',
    appearance: 'Tubuh besar yang mulai kehilangan ketegasannya. Rambut cepak beruban di pelipis. Mata merah — terlalu sering begadang atau terlalu sering minum, mungkin keduanya. Jas lusuh, dasi longgar, dan holster kosong yang masih dia pakai karena kebiasaan.',
    personality: 'Ex-detektif homisida yang dipaksa pensiun setelah kasus yang salah. Reza disewa Niko sebagai "konsultan keamanan" untuk acara ini. Tapi insting detektifnya masih tajam — bahkan terlalu tajam untuk kenyamanan orang lain.',
    backstory: 'Reza menghabiskan 15 tahun di kepolisian. Kasus terakhirnya — serial killer yang membunuh 7 orang — berakhir dengan tersangka yang salah dipenjara. Ketika kebenaran terungkap, Reza di-scapegoat. Sekarang dia minum terlalu banyak dan mengambil pekerjaan security yang harusnya di bawah levelnya.',
    secret: 'Reza mengenali pola di undangan tamu Niko. Profil mereka cocok dengan victimology dari kasus lama yang tidak pernah dia tutup. Dia belum yakin, tapi jantungnya berdetak lebih cepat setiap kali dia melihat daftar tamu.',
    relationships: {
      arin: 'Menghormati naluri investigasi Arin. Melihat versi muda dirinya — sebelum sistem menghancurkannya.',
      niko: 'Klien. Tapi Reza tidak mempercayai siapapun yang membayarnya. Melihat Niko sebagai anak kaya yang bermain-main dengan nyawa orang.',
      lana: 'Merasa tidak nyaman di dekat Lana. Terlalu banyak detail pembunuhan dalam novel-novelnya yang terlalu akurat. Tapi ada tarikan gelap — keduanya terobsesi dengan kematian.',
      dimas: 'Suspicious. Mahasiswa kedokteran yang terlalu tenang melihat darah.',
      juno: 'Unexpected warmth. Juno mengingatkannya pada putrinya yang sudah tidak mau bicara dengannya. Di balik sarkasme Juno, Reza melihat anak yang butuh figur ayah. Dan Juno, tanpa sadar, mulai bergantung pada ketenangan Reza.'
    },
    emotionalRole: 'Negosiator — mantan detektif yang terbiasa bernegosiasi dengan kriminal. Tahu kapan harus tegas dan kapan harus mundur. Tapi alkoholismenya membuat judgmentnya tidak konsisten.',
    traits: ['Berpengalaman', 'Sinis', 'Protektif', 'Alkoholik', 'Negosiator'],
    weakness: 'Alkoholismenya mengaburkan judgmentnya di saat kritis. Rasa bersalah atas keluarga yang dia tinggalkan membuatnya reckless.',
    color: '#5a4e3c',
    initials: 'RH'
  },

  lana: {
    name: 'Lana',
    fullName: 'Lana Maharani',
    age: 30,
    role: 'Sang Narator — Penulis yang Tahu Terlalu Banyak',
    portrait: null,
    isMain: false,
    quote: '"Dalam fiksi, pembunuh selalu tertangkap. Kenyataan tidak seramah itu."',
    appearance: 'Elegan dan dingin. Rambut hitam digelung ketat, lipstik merah gelap, gaun hitam yang selalu terlihat seperti sedang menghadiri pemakaman. Kacamata rantai emas. Jari-jarinya panjang dan selalu bergerak — mengetuk, menulis di udara, seolah sedang menyusun kalimat.',
    personality: 'Penulis novel horor dan thriller paling laris di Asia Tenggara. Seri "Anatomy of Evil"-nya kontroversial karena detail pembunuhan yang terlalu realistis. Kritikus menyebutnya jenius. Polisi pernah menginterogasinya tiga kali.',
    backstory: 'Lana tumbuh di keluarga psikiater. Ibunya menangani pasien-pasien kriminal di RSJ negeri. Sejak kecil, Lana mendengar cerita-cerita yang seharusnya tidak didengar anak-anak. Novelnya bukan fiksi murni — setiap pembunuhan di bukunya terinspirasi dari kasus nyata yang dia riset secara mendalam.',
    secret: 'Novel terbarunya yang belum dipublikasi bercerita tentang pembunuhan di sebuah mansion terpencil. Plotnya terlalu mirip dengan apa yang mulai terjadi malam ini. Entah dia seorang nabi — atau dalang.',
    relationships: {
      reza: 'Pernah mewawancarai Reza untuk riset novel. Tahu tentang kasus gagalnya. Ada chemistry gelap — keduanya terobsesi dengan anatomi kejahatan.',
      farah: 'Menulis tentang keluarga Aldridge dalam salah satu novelnya. Farah tidak senang. Lana menikmati ketakutan Farah — dan menggunakannya.',
      vira: 'Tertarik pada seri foto Vira. Merasa ada kesamaan obsesi. Dalam kondisi berbeda, mereka bisa jadi sahabat — atau musuh terburuk.',
      dimas: 'Hubungan yang lebih dalam dari sekedar riset. Lana memanipulasi Dimas dengan memberikan stimulasi emosional yang dia tidak bisa dapatkan dari orang lain. Dimas adalah senjata favoritnya.',
      niko: 'Saling memanipulasi dalam tarian kekuasaan yang intim. Lana menggunakan rayuan untuk mendapatkan informasi. Niko berpikir dia yang menang — tapi Lana selalu tiga langkah di depan.'
    },
    emotionalRole: 'Dalang manipulatif — master puppeteer yang menarik benang dari balik layar. Setiap kata, setiap sentuhan, setiap senyuman adalah kalkulasi. Tapi di balik itu ada luka kehilangan kakak yang membuatnya menjadi monster ini.',
    traits: ['Brillian', 'Observan', 'Dingin', 'Ambigu', 'Dalang Manipulatif'],
    weakness: 'Melihat segalanya sebagai material cerita — termasuk kematian nyata. Terlalu percaya diri dengan manipulasinya membuatnya meremehkan orang yang bermain jujur.',
    color: '#8b0000',
    initials: 'LM'
  },

  dimas: {
    name: 'Dimas',
    fullName: 'Dimas Surya',
    age: 25,
    role: 'Sang Pemotong — Tangan Tenang di Tengah Darah',
    portrait: null,
    isMain: false,
    quote: '"Tubuh manusia itu indah. Terutama dari dalam."',
    appearance: 'Tampan dengan cara yang klinis. Rambut pendek rapi, wajah bersih, tangan yang selalu dicuci terlalu sering. Kaus polo putih bersih, celana chino — terlihat seperti model katalog. Senyumnya sopan tapi tidak pernah mencapai matanya. Selalu membawa tas medis kecil.',
    personality: 'Mahasiswa kedokteran forensik semester akhir yang sedang magang di kamar mayat. Dimas mempunyai ketenangan yang tidak wajar saat berhadapan dengan kematian. Sementara orang lain panik, Dimas mengobservasi. Menganalisis. Kadang bahkan tersenyum — senyum akademis, katanya.',
    backstory: 'Anak tunggal dari keluarga dokter bedah. Tumbuh di lingkungan steril dan emosional. Dimas tidak pernah menangis — bukan karena kuat, tapi karena ada sesuatu yang tidak terhubung di dalam dirinya. Dia datang ke pameran ini karena Lana mengundangnya sebagai "konsultan medis".',
    secret: 'Dimas memalsukan beberapa hasil autopsi saat magang. Bukan untuk uang — tapi karena seseorang memintanya. Seseorang yang membuatnya merasa, untuk pertama kalinya, sesuatu.',
    relationships: {
      lana: 'Dimanipulasi sepenuhnya. Lana adalah satu-satunya orang yang membuat Dimas "merasakan" sesuatu. Hubungan mereka toxic dan codependent — Lana memberi makna, Dimas memberi kepatuhan.',
      sera: 'Obsesi intelektual yang berkembang menjadi obsesi romantis. Dimas fascinated oleh kemampuan Sera membaca manusia — kemampuan yang dia tidak punya. Perasaannya disturbing dan one-sided.',
      kira: 'Tidak suka. Kira terlalu banyak bertanya dan terlalu pandai menggali. Dimas merasa terancam.',
      reza: 'Merasa diamati. Tahu Reza mencurigainya. Di momen tertentu, Dimas hampir menghormati naluri Reza — hampir.'
    },
    emotionalRole: 'Predator ceroboh — eksekutor yang overconfident. Ketidakmampuannya merasakan empati membuatnya efisien tapi juga careless. Membuat kesalahan karena meremehkan emosi manusia yang dia tidak pahami.',
    traits: ['Tenang', 'Metodis', 'Disosiatif', 'Ambigu', 'Obsesif'],
    weakness: 'Ketidakmampuannya merasakan empati membuatnya rentan dimanipulasi oleh Lana. Obsesinya pada Sera adalah titik buta yang bisa dieksploitasi.',
    color: '#3a6b8c',
    initials: 'DS'
  },

  kira: {
    name: 'Kira',
    fullName: 'Kira Chen',
    age: 22,
    role: 'Sang Pengawas — Mata Digital yang Tidak Tidur',
    portrait: null,
    isMain: false,
    quote: '"Privasi itu ilusi. Yang nyata cuma data."',
    appearance: 'Kecil, cepat, dan selalu terlihat seperti sedang merencanakan sesuatu. Rambut pendek biru-hitam, hoodie oversized yang menyembunyikan laptop di dalamnya. Headphone selalu menggantung di leher. Mata yang bergerak cepat, memindai, menganalisis. Jari-jari dengan nail art yang berbeda setiap minggu.',
    personality: 'Hacker dan cybersecurity specialist yang bekerja freelance. Kira hidup di dunia digital lebih dari dunia nyata. Paranoid secara profesional — dia selalu mengasumsikan bahwa seseorang sedang mengawasinya, dan biasanya dia benar.',
    backstory: 'Kira membongkar jaringan trafficking online saat masih 19 tahun. Sejak itu, dia menjadi target beberapa kelompok berbahaya. Dia datang ke pameran ini karena menemukan anomali digital: undangan acara ini dikirim dari server yang sama dengan serangkaian email ancaman yang dia tracking selama setahun.',
    secret: 'Kira sudah meretas sistem keamanan mansion sebelum datang. Dia punya akses ke CCTV, log pintu, dan file-file tersembunyi di server lokal. Apa yang dia temukan membuatnya tidak bisa tidur.',
    relationships: {
      arin: 'Respek mutual. Keduanya pencari kebenaran, hanya beda medium. Kira menganggap Arin terlalu lambat tapi mengagumi keberaniannya.',
      juno: 'Kindred spirits dan chaos partners. Keduanya pemberontak — Kira digital, Juno fisik. Saling cover dalam situasi bahaya. Ada chemistry tapi keduanya terlalu stubborn untuk mengakuinya.',
      dimas: 'Red flag BESAR. Data digital Dimas punya gaps yang terlalu bersih — orang normal tidak punya digital footprint seseptic itu.',
      farah: 'Menemukan koneksi finansial antara keluarga Farah dan kematian-kematian mencurigakan. Kira tidak suka old money. Farah mewakili segalanya yang korup di dunia.'
    },
    emotionalRole: 'Eksentrik wildcard — unpredictable, chaotic, dan brilliant. Kira adalah variabel yang tidak bisa dikontrol siapapun. Paranoidnya kadang menyelamatkan, kadang menghancurkan. Social skills-nya minus tapi observasinya tajam.',
    traits: ['Jenius', 'Paranoid', 'Resourceful', 'Antisosial', 'Eksentrik'],
    weakness: 'Ketergantungannya pada teknologi membuatnya buta terhadap ancaman analog. Kecenderungan menyebarkan informasi tanpa filter bisa memantik konflik yang tidak perlu.',
    color: '#00b4d8',
    initials: 'KC'
  },

  farah: {
    name: 'Farah',
    fullName: 'Farah Aldridge',
    age: 28,
    role: 'Sang Pewaris — Tahta yang Dibangun di Atas Tulang',
    portrait: null,
    isMain: false,
    quote: '"Keluargaku membangun kota ini. Apa yang mereka kubur di bawahnya... bukan urusanmu."',
    appearance: 'Cantik dengan cara old money — tidak mencolok tapi setiap detail terlihat mahal. Rambut auburn di-blow sempurna, makeup minimal, perhiasan antik. Blazer dan celana palazzo. Posturnya sempurna, seperti dibesarkan dengan buku di atas kepala. Tapi tangannya kadang gemetar saat dia pikir tidak ada yang melihat.',
    personality: 'Pewaris keluarga Aldridge — keluarga yang membangun mansion ini dan setengah kota di sekitarnya. Farah tumbuh dengan privilege yang luar biasa, tapi juga dengan rahasia keluarga yang semakin berat. Dia sopan, terkontrol, dan pandai menyembunyikan sesuatu di balik senyum socialite-nya.',
    backstory: 'Kakek Farah dan kakek Niko adalah partner bisnis di tahun 70-an. Pembangunan mansion ini memakan korban — tujuh pekerja tewas dalam "kecelakaan" konstruksi. Keluarga Aldridge membayar diam. Tapi ada yang tidak bisa dibeli — dan sekarang masa lalu itu mengejar.',
    secret: 'Farah menemukan buku harian kakeknya yang mendetailkan pembunuhan-pembunuhan yang disamarkan sebagai kecelakaan. Dia datang ke pameran ini untuk menghancurkan bukti sebelum orang lain menemukannya. Tapi bukti itu sudah dipindahkan.',
    relationships: {
      niko: 'Hubungan keluarga yang rumit dan intim. Tumbuh bersama, hampir seperti saudara — tapi ada momen di masa remaja yang membuat keduanya canggung. Sekarang mereka terikat oleh rahasia yang lebih gelap.',
      lana: 'Lana menulis tentang keluarganya. Farah ingin dia berhenti — dan bersedia membayar harga apapun. Ketakutan Farah adalah senjata favorit Lana.',
      kira: 'Tahu Kira bisa mengakses file-file berbahaya. Farah mencoba menyuap Kira — ditolak mentah-mentah. Sekarang Kira adalah ancaman terbesar.',
      reza: 'Ex-detektif yang dulu menyelidiki keluarganya. Ada rasa bersalah yang membuat Farah kadang ingin jujur kepada Reza — tapi ego keluarga selalu menang.',
      sera: 'Sera melihat menembus fasad Farah. Farah tidak suka dianalisis — tapi diam-diam butuh seseorang yang melihat dirinya yang asli, bukan heiress.'
    },
    emotionalRole: 'Egois dengan nurani yang tersiksa — self-preservation adalah instingnya, tapi ada kemanusiaan di bawah armor privilege. Negosiator ulung yang terbiasa membeli jalan keluar — tapi malam ini, uang tidak bisa membeli nyawa.',
    traits: ['Anggun', 'Kalkulatif', 'Tertekan', 'Desperate', 'Negosiator Egois'],
    weakness: 'Loyalitasnya pada keluarga membuatnya melindungi rahasia yang seharusnya terungkap. Egoisme-nya bisa mengorbankan orang lain demi self-preservation.',
    color: '#b8860b',
    initials: 'FA'
  }
};
