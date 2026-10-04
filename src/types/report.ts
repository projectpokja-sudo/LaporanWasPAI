export interface PengawasIdentity {
  namaPengawas: string;
  nipPengawas: string;
  unitKerja: string;
  jenjangPengawasan: string;
  wilayahBinaan: string;
  namaKetuaPokjawas: string;
  nipKetuaPokjawas: string;
  kotaTanggal: string;
}

export interface ActivityPhoto {
  id: string;
  dataUrl: string; // base64
  caption: string;
  fileName?: string;
}

export interface PembinaanData {
  namaKegiatan: string;
  aspekMasalah: string;
  aspekMasalahCustom?: string;
  latarBelakang: string;
  waktuTempat: string;
  jumlahPeserta: string;
  materiPembinaan: string;
  strategi: string[];
  strategiCustom?: string;
  pelaksanaan: string; // 3 bagian: 1) Kegiatan Awal, 2) Kegiatan Inti, 3) Kegiatan Akhir
  hasilPembinaan: string;
  penutup: string;
}

export interface FullReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  identitas: PengawasIdentity;
  pembinaan: PembinaanData;
  photos: ActivityPhoto[]; // exactly 3 slots
}

export const ASPEK_MASALAH_OPTIONS = [
  'Guru kesulitan merancang Modul Ajar PAI yang memfasilitasi pemahaman mendalam, Rencana Pembelajaran cenderung padat materi (tuntutan administratif) daripada kualitas pemahaman murid;',
  'Guru belum mampu menghubungkan kompetensi PAI dalam CP dengan realitas kehidupan nyata anak, sehingga tujuan pembelajaran masih terkonsentrasi pada pengetahuan dan belum berdampak nyata dalam penghatan dan pengamalan dalam kehidupan sehari-hari;',
  'Desain aktivitas belajar dalam dokumen perencanaan masih monoton (didominasi ceramah/hapalan hafalan jangka pendek), belum memetakan diferensiasi proses/produk;',
  'Proses pembelajaran di kelas masih dominan menggunakan metode ceramah (monoton) dan belum menerapkan model pembelajaran aktif berorientasi Higher Order Thinking Skills (HOTS);',
  'Guru kesulitan merumuskan instrumen asesmen formatif dan sumatif yang sahih, terutama dalam mengukur aspek sikap (afektif) spiritual dan sosial peserta didik secara objektif;',
  'Guru kesulitan membuat tindak lanjut hasil asesmen formatif dan sumatif yang sahih, untuk meningkatkan kualitas pembelajaran;',
  'Guru belum memanfaatkan platform digital (seperti Smart PAI, Canva, atau LMS) untuk mendukung ekosistem pembelajaran rumpun PAI;',
  'Guru belum mampu menghasilkan karya ilmiah (PTK) atau publikasi ilmiah sebagai bukti Pengembangan Kompetensi Berkelanjutan;',
  'Lainnya (Isi Sendiri)',
] as const;

export const STRATEGI_SUPERVISI_OPTIONS = [
  'Coaching Akademik',
  'Workshop / Pelatihan Klinis',
  'Mentoring dan Peer Coaching',
  'Supervisi Klinis Bermutu (Pendampingan)',
  'Focus Group Discussion (FGD) Kasus Riil (Problem Solving)',
  'Lokakarya (Bimtek)',
  'Lainnya (Tulis Sendiri)',
] as const;

export const JENJANG_OPTIONS = [
  'TK / PAUD',
  'Sekolah Dasar (SD)',
  'Sekolah Menengah Pertama (SMP)',
  'Sekolah Menengah Atas (SMA)',
  'Sekolah Menengah Kejuruan (SMK)',
  'Sekolah Luar Biasa (SLB)',
  'Terpadu (SD, SMP, SMA/SMK)',
] as const;

export const DEFAULT_IDENTITY: PengawasIdentity = {
  namaPengawas: 'Drs. H. Ahmad Fauzi, M.Pd.I',
  nipPengawas: '19740615 199903 1 003',
  unitKerja: 'Kantor Kementerian Agama Kab. Sleman / Pokjawas PAI',
  jenjangPengawasan: 'Sekolah Menengah Pertama (SMP)',
  wilayahBinaan: 'Kecamatan Depok & Mlati (12 Sekolah Binaan)',
  namaKetuaPokjawas: 'Dr. Hj. Siti Rohmah, M.Ag',
  nipKetuaPokjawas: '19691124 199503 2 002',
  kotaTanggal: 'Sleman, 24 Oktober 2024',
};

export const INITIAL_REPORT: FullReport = {
  id: 'draft-current',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  identitas: { ...DEFAULT_IDENTITY },
  pembinaan: {
    namaKegiatan: 'Workshop Peningkatan Mutu Perancangan Modul Ajar Berdiferensiasi dan Asesmen Autentik PAI',
    aspekMasalah: ASPEK_MASALAH_OPTIONS[0],
    aspekMasalahCustom: '',
    latarBelakang:
      'Pelaksanaan pengawasan akademik di lingkungan GPAI menunjukkan bahwa guru masih menghadapi tantangan mendasar dalam merancang Modul Ajar PAI yang memfasilitasi pemahaman mendalam. Rencana pembelajaran di lapangan cenderung berorientasi administratif dan padat materi, sehingga aspek kualitas pemahaman bermakna dan internalisasi akhlak mulia peserta didik belum tercapai secara optimal. Oleh karena itu, diperlukan pendampingan terstruktur melalui pembinaan kepengawasan agar guru mampu menyusun skenario pembelajaran yang berpusat pada murid.',
    waktuTempat: 'Kamis, 24 Oktober 2024 / Pukul 08.30 - 14.30 WIB / Aula Pertemuan SMP Negeri 1 Sleman',
    jumlahPeserta: '24 Orang Guru Pendidikan Agama Islam (GPAI)',
    materiPembinaan:
      'Materi pembinaan difokuskan pada bedah struktur Modul Ajar Kurikulum Merdeka rumpun PAI, strategi perumusan Tujuan Pembelajaran (TP) berbasis pemahaman mendalam, penyusunan skenario pembelajaran berdiferensiasi (konten, proses, dan produk), serta perancangan rubrik asesmen formatif-sumatif yang sahih dan aplikatif.',
    strategi: ['Workshop / Pelatihan Klinis', 'Coaching Akademik'],
    strategiCustom: '',
    pelaksanaan: `1). Kegiatan Awal:
Pengawas PAI membuka pertemuan dengan tadarus Al-Qur'an dan doa bersama. Pengawas menyampaikan urgensi kegiatan, target luaran, serta melakukan pemetaan diagnostik persepsi awal 24 GPAI mengenai kendala penyusunan modul ajar mendalam.

2). Kegiatan Inti:
Pengawas memaparkan materi konseptual dan menyajikan contoh modul ajar PAI ideal. Dilanjutkan dengan sesi workshop klinis di mana peserta dibagi dalam rumpun fase/jenjang untuk membedah modul ajar masing-masing. Pengawas melakukan coaching akademik secara bergiliran, memberikan umpan balik langsung pada bagian yang terlalu padat materi, dan memandu restrukturisasi aktivitas pembelajaran berbasis HOTS dan pemahaman mendalam.

3). Kegiatan Akhir:
Perwakilan GPAI mempresentasikan modul ajar hasil revisi, dilanjutkan dengan ulasan penguatan oleh Pengawas. Seluruh peserta menyepakati Rencana Tindak Lanjut (RTL) untuk mengimplementasikan modul tersebut dalam supervisi kelas berikutnya, ditutup dengan doa bersama.`,
    hasilPembinaan:
      'Sebanyak 88% (21 dari 24 GPAI) berhasil menyelesaikan draf final Modul Ajar PAI berbasis pemahaman mendalam yang siap diimplementasikan. Terjadi pergeseran paradigma mengajar dari sekadar transfer materi hafalan menuju fasilitasi pemikiran kritis murid, serta tersusunnya kesepakatan komitmen tindak lanjut supervisi klinis di sekolah masing-masing.',
    penutup:
      'Kegiatan pembinaan pengawas PAI melalui metode workshop klinis dan coaching akademik telah berjalan lancar, efektif, dan menghasilkan dampak konkret bagi guru binaan. Disarankan kepada Kepala Sekolah binaan untuk memfasilitasi penerapan modul ajar ini di kelas dan mendukung GPAI dalam komunitas belajar (MGMP PAI) secara berkelanjutan.',
  },
  photos: [
    {
      id: 'photo-1',
      dataUrl: '',
      caption: 'Pengawas PAI memberikan pengantar materi dan penguatan konsep pemahaman mendalam.',
    },
    {
      id: 'photo-2',
      dataUrl: '',
      caption: 'Sesi workshop klinis: Pengawas mendampingi dan memvalidasi modul ajar guru secara interaktif.',
    },
    {
      id: 'photo-3',
      dataUrl: '',
      caption: 'Presentasi hasil modul ajar oleh perwakilan GPAI dan kesepakatan komitmen RTL pembinaan.',
    },
  ],
};
