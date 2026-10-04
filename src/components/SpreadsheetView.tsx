import React, { useState } from 'react';
import { FullReport } from '../types/report';
import { exportReportToWord } from '../utils/docxExport';
import {
  Printer,
  FileDown,
  Edit3,
  Check,
  Building2,
  FileSpreadsheet,
  Award,
  Sparkles,
} from 'lucide-react';

interface SpreadsheetViewProps {
  report: FullReport;
  onUpdateReport: (updated: FullReport) => void;
  onOpenAiGenerator?: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  report,
  onUpdateReport,
  onOpenAiGenerator,
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { identitas, pembinaan, photos } = report;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = async () => {
    try {
      setIsDownloading(true);
      await exportReportToWord(report);
    } catch (err) {
      console.error('Download Word error:', err);
      alert('Gagal mengunduh dokumen Word. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFieldChange = (
    section: 'identitas' | 'pembinaan',
    field: string,
    value: string
  ) => {
    onUpdateReport({
      ...report,
      [section]: {
        ...report[section],
        [field]: value,
      },
    });
  };

  const finalMasalah =
    pembinaan.aspekMasalah === 'Lainnya (Isi Sendiri)'
      ? pembinaan.aspekMasalahCustom || '-'
      : pembinaan.aspekMasalah;

  const strategiList = [...pembinaan.strategi];
  if (pembinaan.strategiCustom?.trim()) {
    strategiList.push(pembinaan.strategiCustom.trim());
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Format Lembar Kerja Tabel Spreadsheet Laporan
            </h2>
            <p className="text-xs text-slate-500">
              Tampilan resmi standar Pokjawas PAI Kementerian Agama RI. Teks rata kanan-kiri (justified).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsEditingInline(!isEditingInline)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition ${
              isEditingInline
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isEditingInline ? (
              <>
                <Check className="w-3.5 h-3.5" /> Selesai Mengedit
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> Edit Sel Spreadsheet
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak / Simpan PDF
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition disabled:opacity-60"
          >
            <FileDown className="w-3.5 h-3.5" />
            {isDownloading ? 'Menyiapkan Word...' : 'Unduh Format Word (.docx)'}
          </button>
        </div>
      </div>

      {/* Sheet Printable Document Container */}
      <div
        id="printable-report"
        className="bg-white rounded-xl shadow-md border border-slate-300 print:border-none print:shadow-none p-6 sm:p-10 max-w-5xl mx-auto text-slate-900 text-[13px] leading-relaxed transition-all"
      >
        {/* Kop Resmi Kementerian Agama */}
        <div className="border-b-4 border-double border-emerald-950 pb-5 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h1 className="text-base sm:text-lg font-extrabold tracking-wider text-emerald-950 uppercase">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </h1>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                {identitas.unitKerja || 'KANTOR KEMENTERIAN AGAMA / POKJAWAS PAI'}
              </h2>
            </div>
          </div>
          <div className="inline-block bg-emerald-50 text-emerald-900 font-extrabold px-6 py-1.5 rounded-md border border-emerald-200 mt-2 text-sm sm:text-base uppercase tracking-wider">
            LAPORAN PEMBINAAN PENGAWAS PAI
          </div>
          <p className="text-[11px] text-slate-600 mt-1 italic">
            Jenjang Pengawasan: <strong className="text-slate-800">{identitas.jenjangPengawasan}</strong> | Wilayah Binaan: <strong className="text-slate-800">{identitas.wilayahBinaan}</strong>
          </p>
        </div>

        {/* ===================== TABEL SPREADSHEET UTAMA ===================== */}
        <div className="overflow-x-auto border-2 border-slate-800 rounded-sm">
          <table className="w-full border-collapse text-left table-fixed">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b-2 border-slate-800 text-xs text-center uppercase">
                <th className="w-12 py-2.5 px-2 border-r border-slate-400">NO</th>
                <th className="w-1/4 sm:w-1/4 py-2.5 px-3 border-r border-slate-400">KOMPONEN</th>
                <th className="w-auto py-2.5 px-4">URAIAN / DESKRIPSI PEMBINAAN</th>
              </tr>
            </thead>

            <tbody>
              {/* BAGIAN I : IDENTITAS */}
              <tr className="bg-emerald-800 text-white font-bold border-b border-emerald-900">
                <td colSpan={3} className="py-2 px-3 text-xs sm:text-sm tracking-wide">
                  BAGIAN I : IDENTITAS
                </td>
              </tr>

              {/* 1. Nama Pengawas */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">1</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Nama Pengawas PAI
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={identitas.namaPengawas}
                        onChange={(e) => handleFieldChange('identitas', 'namaPengawas', e.target.value)}
                        placeholder="Nama Pengawas beserta Gelar"
                        className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                      />
                      <input
                        type="text"
                        value={identitas.nipPengawas}
                        onChange={(e) => handleFieldChange('identitas', 'nipPengawas', e.target.value)}
                        placeholder="NIP Pengawas"
                        className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-900">{identitas.namaPengawas}</span>
                      <span className="text-slate-600 block text-xs">NIP. {identitas.nipPengawas}</span>
                    </div>
                  )}
                </td>
              </tr>

              {/* 2. Unit Kerja */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">2</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Unit Kerja
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <input
                      type="text"
                      value={identitas.unitKerja}
                      onChange={(e) => handleFieldChange('identitas', 'unitKerja', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    identitas.unitKerja
                  )}
                </td>
              </tr>

              {/* 3. Jenjang Pengawasan */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">3</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Jenjang Pengawasan
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <input
                      type="text"
                      value={identitas.jenjangPengawasan}
                      onChange={(e) => handleFieldChange('identitas', 'jenjangPengawasan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    identitas.jenjangPengawasan
                  )}
                </td>
              </tr>

              {/* 4. Wilayah Binaan */}
              <tr className="border-b-2 border-slate-800 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">4</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Wilayah Binaan
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <input
                      type="text"
                      value={identitas.wilayahBinaan}
                      onChange={(e) => handleFieldChange('identitas', 'wilayahBinaan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    identitas.wilayahBinaan
                  )}
                </td>
              </tr>

              {/* BAGIAN II : PEMBINAAN PENGAWAS */}
              <tr className="bg-emerald-800 text-white font-bold border-b border-emerald-900">
                <td colSpan={3} className="py-2 px-3 text-xs sm:text-sm tracking-wide">
                  BAGIAN II : PEMBINAAN PENGAWAS
                </td>
              </tr>

              {/* A. Nama Kegiatan Pembinaan */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">A</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Nama Kegiatan Pembinaan
                </td>
                <td className="py-2 px-4 align-top text-justify">
                  {isEditingInline ? (
                    <textarea
                      rows={2}
                      value={pembinaan.namaKegiatan}
                      onChange={(e) => handleFieldChange('pembinaan', 'namaKegiatan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    <span className="font-semibold text-slate-900">{pembinaan.namaKegiatan}</span>
                  )}
                </td>
              </tr>

              {/* B. Aspek / Masalah */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">B</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Aspek / Masalah
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={3}
                      value={finalMasalah}
                      onChange={(e) => handleFieldChange('pembinaan', 'aspekMasalahCustom', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    finalMasalah
                  )}
                </td>
              </tr>

              {/* C. Latar Belakang */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">C</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Latar Belakang
                  <span className="block text-[11px] text-slate-500 font-normal italic mt-0.5">
                    (Maksimal 150 kata, 1 paragraf)
                  </span>
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={4}
                      value={pembinaan.latarBelakang}
                      onChange={(e) => handleFieldChange('pembinaan', 'latarBelakang', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.latarBelakang
                  )}
                </td>
              </tr>

              {/* D. Waktu dan Tempat Pelatihan */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">D</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Waktu dan Tempat Pelatihan
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <input
                      type="text"
                      value={pembinaan.waktuTempat}
                      onChange={(e) => handleFieldChange('pembinaan', 'waktuTempat', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.waktuTempat
                  )}
                </td>
              </tr>

              {/* E. Jumlah Peserta */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">E</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Jumlah Peserta
                </td>
                <td className="py-2 px-4 align-top">
                  {isEditingInline ? (
                    <input
                      type="text"
                      value={pembinaan.jumlahPeserta}
                      onChange={(e) => handleFieldChange('pembinaan', 'jumlahPeserta', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.jumlahPeserta
                  )}
                </td>
              </tr>

              {/* F. Materi Pembinaan */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">F</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Materi Pembinaan
                  <span className="block text-[11px] text-slate-500 font-normal italic mt-0.5">
                    (Maksimal 150 kata, 1 paragraf)
                  </span>
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={4}
                      value={pembinaan.materiPembinaan}
                      onChange={(e) => handleFieldChange('pembinaan', 'materiPembinaan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.materiPembinaan
                  )}
                </td>
              </tr>

              {/* G. Strategi / Metode Kerja / Teknik Supervisi */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">G</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Strategi / Metode Kerja / Teknik Supervisi
                </td>
                <td className="py-2 px-4 align-top text-justify">
                  <div className="flex flex-wrap gap-1.5">
                    {strategiList.map((strat, i) => (
                      <span
                        key={i}
                        className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {strat}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* H. Pelaksanaan Kegiatan Pembinaan (3 Bagian) */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">H</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Pelaksanaan Kegiatan Pembinaan
                  <span className="block text-[11px] text-slate-500 font-normal italic mt-0.5">
                    (1. Awal, 2. Inti, 3. Akhir)
                  </span>
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={8}
                      value={pembinaan.pelaksanaan}
                      onChange={(e) => handleFieldChange('pembinaan', 'pelaksanaan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full font-mono text-[12px]"
                    />
                  ) : (
                    <div className="space-y-3">
                      {pembinaan.pelaksanaan.split('\n\n').map((par, idx) => (
                        <p key={idx} className="whitespace-pre-line text-justify">
                          {par}
                        </p>
                      ))}
                    </div>
                  )}
                </td>
              </tr>

              {/* I. Hasil Pembinaan */}
              <tr className="border-b border-slate-300 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">I</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Hasil Pembinaan
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={3}
                      value={pembinaan.hasilPembinaan}
                      onChange={(e) => handleFieldChange('pembinaan', 'hasilPembinaan', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.hasilPembinaan
                  )}
                </td>
              </tr>

              {/* J. Penutup */}
              <tr className="border-b border-slate-800 hover:bg-slate-50">
                <td className="text-center font-bold py-2 px-2 border-r border-slate-300 align-top">J</td>
                <td className="font-semibold py-2 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Penutup
                </td>
                <td className="py-2 px-4 align-top text-justify leading-relaxed">
                  {isEditingInline ? (
                    <textarea
                      rows={3}
                      value={pembinaan.penutup}
                      onChange={(e) => handleFieldChange('pembinaan', 'penutup', e.target.value)}
                      className="p-1.5 border border-emerald-400 rounded text-xs w-full"
                    />
                  ) : (
                    pembinaan.penutup
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===================== LAMPIRAN 3 FOTO KEGIATAN ===================== */}
        <div className="mt-8 border-2 border-slate-800 rounded-sm overflow-hidden break-inside-avoid">
          <div className="bg-emerald-800 text-white font-bold py-2 px-3 text-xs sm:text-sm uppercase tracking-wide">
            LAMPIRAN : DOKUMENTASI FOTO KEGIATAN PEMBINAAN
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-t border-slate-800 bg-slate-50/50">
            {[0, 1, 2].map((idx) => {
              const photo = photos[idx];
              return (
                <div key={idx} className="p-3 flex flex-col items-center text-center">
                  <div className="font-semibold text-xs text-slate-700 mb-2">
                    Foto {idx + 1}
                  </div>
                  {photo && photo.dataUrl ? (
                    <div className="w-full aspect-[4/3] rounded border border-slate-300 overflow-hidden bg-slate-900 shadow-sm flex items-center justify-center">
                      <img
                        src={photo.dataUrl}
                        alt={`Dokumentasi ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-slate-400 text-xs italic">
                      [Foto Belum Diunggah]
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-slate-600 italic text-center leading-snug">
                    {photo?.caption || `Dokumentasi Pelaksanaan Kegiatan Bagian ${idx + 1}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== TANDA TANGAN (POJOK KIRI & POJOK KANAN BAWAH) ===================== */}
        <div className="mt-12 pt-4 break-inside-avoid">
          <div className="grid grid-cols-2 gap-8 text-center sm:text-left">
            {/* Pojok Kiri Bawah: Nama Ketua Pokjawas & NIP */}
            <div className="flex flex-col">
              <p className="text-xs text-slate-700">Mengetahui,</p>
              <p className="text-xs font-bold text-slate-900">Ketua Pokjawas PAI,</p>
              <div className="h-20 sm:h-24 flex items-end">
                {/* Spasi Tanda Tangan */}
              </div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm underline">
                {identitas.namaKetuaPokjawas || 'Dr. Hj. Siti Rohmah, M.Ag'}
              </p>
              <p className="text-xs text-slate-700">
                NIP. {identitas.nipKetuaPokjawas || '19691124 199503 2 002'}
              </p>
            </div>

            {/* Pojok Kanan Bawah: Nama Pengawas PAI & NIP */}
            <div className="flex flex-col text-right sm:text-left sm:pl-16">
              <p className="text-xs text-slate-700">
                {identitas.kotaTanggal || 'Sleman, 24 Oktober 2024'}
              </p>
              <p className="text-xs font-bold text-slate-900">Pengawas PAI Pembina,</p>
              <div className="h-20 sm:h-24 flex items-end">
                {/* Spasi Tanda Tangan */}
              </div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm underline">
                {identitas.namaPengawas || 'Drs. H. Ahmad Fauzi, M.Pd.I'}
              </p>
              <p className="text-xs text-slate-700">
                NIP. {identitas.nipPengawas || '19740615 199903 1 003'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
