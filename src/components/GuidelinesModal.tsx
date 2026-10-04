import React from 'react';
import { BookOpen, CheckCircle, Award, Shield, FileText, Lightbulb } from 'lucide-react';

export const GuidelinesModal: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Panduan Standar Penyusunan Laporan Pembinaan Pengawas PAI
          </h2>
          <p className="text-xs text-slate-500">
            Acuan regulasi Kementerian Agama RI & Standar Kelompok Kerja Pengawas PAI Nasional
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Dasar Regulasi */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <h3 className="font-bold text-emerald-950 flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-emerald-700" />
            Landasan Kebijakan & Regulasi Kepengawasan PAI
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-900">
            <li>
              <strong>PMA RI No. 2 Tahun 2012</strong> tentang Pengawas Madrasah dan Pengawas Pendidikan Agama Islam pada Sekolah.
            </li>
            <li>
              <strong>Keputusan Dirjen Pendis</strong> tentang Pedoman Pembinaan dan Pengawasan Guru PAI pada Sekolah.
            </li>
            <li>
              <strong>Pedoman Implementasi Kurikulum Merdeka (IKM)</strong> rumpun Pendidikan Agama Islam dan Budi Pekerti (Fasilitasi pemahaman mendalam, asesmen autentik, dan Profil Pelajar Rahmatan Lil 'Alamin).
            </li>
          </ul>
        </div>

        {/* Sistematika 2 Bagian Utama */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            Sistematika Laporan Format Spreadsheet
          </h3>
          <p className="text-xs text-slate-600">
            Laporan disusun dalam format tabel spreadsheet bergaris tegas dengan tulisan rata kanan-kiri (justified) serta memuat 2 bagian pokok:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-emerald-900 mb-2">Bagian I : Identitas Pengawas</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>Nama Lengkap Pengawas PAI & Gelar</li>
                <li>Nomor Induk Pegawai (NIP)</li>
                <li>Unit Kerja (Kantor Kemenag Kab/Kota / Pokjawas)</li>
                <li>Jenjang Pengawasan (TK, SD, SMP, SMA, SMK)</li>
                <li>Wilayah & Sekolah Binaan</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-emerald-900 mb-2">Bagian II : Pembinaan Pengawas</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li><strong>A-B:</strong> Nama Kegiatan & Rumusan Aspek Masalah</li>
                <li><strong>C:</strong> Latar Belakang (Maks 150 kata, 1 paragraf)</li>
                <li><strong>D-E:</strong> Waktu/Tempat & Jumlah Peserta</li>
                <li><strong>F:</strong> Materi Pembinaan (Maks 150 kata)</li>
                <li><strong>G-H:</strong> Strategi Supervisi & 3 Tahap Pelaksanaan (Awal, Inti, Akhir)</li>
                <li><strong>I-J:</strong> Hasil Pembinaan Terukur & Penutup/RTL</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6 Strategi Supervisi */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Ragam Strategi / Metode Supervisi Akademik PAI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <strong className="text-slate-900 block mb-1">1. Coaching Akademik</strong>
              <p className="text-slate-500">
                Pendampingan kemitraan non-direktif untuk menggali potensi guru dalam menemukan solusi mandiri.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <strong className="text-slate-900 block mb-1">2. Workshop / Pelatihan Klinis</strong>
              <p className="text-slate-500">
                Praktik langsung bedah instrumen/modul ajar dengan bimbingan intensif dan perbaikan seketika.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <strong className="text-slate-900 block mb-1">3. Supervisi Klinis Bermutu</strong>
              <p className="text-slate-500">
                Siklus observasi kelas terpadu: pra-observasi, observasi pembelajaran aktif, dan pasca-observasi.
              </p>
            </div>
          </div>
        </div>

        {/* Ketentuan Tanda Tangan & Lampiran */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
          <h4 className="font-bold text-slate-800">Ketentuan Tanda Tangan & Lampiran Foto</h4>
          <p className="text-slate-600">
            Sesuai tata persuratan dinas Kementerian Agama:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              <strong>Pojok Kiri Bawah:</strong> Mengetahui, Ketua Pokjawas PAI beserta NIP.
            </li>
            <li>
              <strong>Pojok Kanan Bawah:</strong> Titik mangsa (Kota, Tanggal Laporan) dan Nama Pengawas PAI Pembina beserta NIP.
            </li>
            <li>
              <strong>Lampiran Foto:</strong> Wajib memuat 3 kolom dokumentasi visual (Kegiatan Awal, Kegiatan Inti/Workshop, dan Refleksi Akhir/RTL) yang disertai caption keterangan.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
