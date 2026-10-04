import React, { useState } from 'react';
import {
  FullReport,
  ASPEK_MASALAH_OPTIONS,
  STRATEGI_SUPERVISI_OPTIONS,
  JENJANG_OPTIONS,
  DEFAULT_IDENTITY,
} from '../types/report';
import { generateFullReportAi, regenerateFieldAi } from '../services/aiService';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  Building,
  Calendar,
  Users,
  Layers,
  BookOpen,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ReportFormProps {
  report: FullReport;
  onUpdateReport: (updated: FullReport) => void;
  onNavigateToSpreadsheet: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  report,
  onUpdateReport,
  onNavigateToSpreadsheet,
}) => {
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [customPromptField, setCustomPromptField] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { identitas, pembinaan } = report;

  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleIdentitasChange = (field: keyof typeof identitas, value: string) => {
    onUpdateReport({
      ...report,
      identitas: {
        ...report.identitas,
        [field]: value,
      },
    });
  };

  const handlePembinaanChange = (field: keyof typeof pembinaan, value: any) => {
    onUpdateReport({
      ...report,
      pembinaan: {
        ...report.pembinaan,
        [field]: value,
      },
    });
  };

  const handleStrategiToggle = (stratName: string) => {
    const current = [...pembinaan.strategi];
    const index = current.indexOf(stratName);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(stratName);
    }
    handlePembinaanChange('strategi', current);
  };

  const handleGenerateAllWithAi = async () => {
    setIsGeneratingAll(true);
    try {
      const result = await generateFullReportAi({
        namaKegiatan: pembinaan.namaKegiatan,
        aspekMasalah: pembinaan.aspekMasalah,
        aspekMasalahCustom: pembinaan.aspekMasalahCustom,
        strategi: pembinaan.strategi,
        strategiCustom: pembinaan.strategiCustom,
        jenjang: identitas.jenjangPengawasan,
        wilayahBinaan: identitas.wilayahBinaan,
        jumlahPeserta: pembinaan.jumlahPeserta,
        waktuTempat: pembinaan.waktuTempat,
      });

      onUpdateReport({
        ...report,
        pembinaan: {
          ...report.pembinaan,
          latarBelakang: result.data.latarBelakang,
          materiPembinaan: result.data.materiPembinaan,
          pelaksanaan: result.data.pelaksanaan,
          hasilPembinaan: result.data.hasilPembinaan,
          penutup: result.data.penutup,
        },
      });

      if (result.source === 'gemini_ai') {
        showToast('✨ Berhasil digenerate oleh Gemini AI (Model 3.8 Flash)');
      } else {
        showToast('✅ Berhasil digenerate dengan Standar Narasi Pokjawas PAI');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast('⚠️ Gagal menghubungi AI server, silakan periksa koneksi.');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleRegenerateSingleField = async (
    fieldKey: 'latarBelakang' | 'materiPembinaan' | 'pelaksanaan' | 'hasilPembinaan' | 'penutup',
    label: string
  ) => {
    setGeneratingField(fieldKey);
    try {
      const finalMasalah =
        pembinaan.aspekMasalah === 'Lainnya (Isi Sendiri)'
          ? pembinaan.aspekMasalahCustom || ''
          : pembinaan.aspekMasalah;

      const currentValue = pembinaan[fieldKey];
      const regeneratedText = await regenerateFieldAi(
        label,
        currentValue,
        {
          aspekMasalah: finalMasalah,
          strategi: pembinaan.strategi.join(', '),
          namaKegiatan: pembinaan.namaKegiatan,
        },
        customPromptField === fieldKey ? customInstruction : undefined
      );

      handlePembinaanChange(fieldKey, regeneratedText);
      setCustomPromptField(null);
      setCustomInstruction('');
      showToast(`✅ Berhasil memperbarui narasi ${label}`);
    } catch (err: any) {
      console.error('Regenerate field error:', err);
      showToast(`⚠️ Terjadi kendala saat memperbarui ${label}`);
    } finally {
      setGeneratingField(null);
    }
  };

  const applyDefaultIdentity = () => {
    onUpdateReport({
      ...report,
      identitas: { ...DEFAULT_IDENTITY },
    });
    showToast('Identitas standar berhasil dimuat!');
  };

  const latarBelakangWords = countWords(pembinaan.latarBelakang);
  const materiWords = countWords(pembinaan.materiPembinaan);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-sm">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Action Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-600 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Berbasis Standar Kemenag & Kurikulum Merdeka
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Penyusunan Cepat Laporan Pembinaan Pengawas PAI
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Lengkapi isian identitas dan pembinaan di bawah ini. Tekan tombol generate untuk
              menghasilkan narasi Latar Belakang, Materi, 3 Tahap Pelaksanaan, Hasil, dan Penutup
              secara otomatis dan terstandarisasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              type="button"
              onClick={handleGenerateAllWithAi}
              disabled={isGeneratingAll}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition transform active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isGeneratingAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                  Memproses Narasi AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-950" />
                  Generate Seluruh Narasi AI
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateToSpreadsheet}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition cursor-pointer"
            >
              Lihat Lembar Spreadsheet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================= BAGIAN 1: IDENTITAS ======================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-sm">
              1
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                BAGIAN I : IDENTITAS PENGAWAS
              </h3>
              <p className="text-xs text-slate-500">
                Informasi resmi pengawas pembina dan wilayah penugasan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={applyDefaultIdentity}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> Isi Contoh Identitas Default
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nama Pengawas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Pengawas PAI <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={identitas.namaPengawas}
              onChange={(e) => handleIdentitasChange('namaPengawas', e.target.value)}
              placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Pd.I"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            />
          </div>

          {/* NIP Pengawas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              NIP Pengawas PAI <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={identitas.nipPengawas}
              onChange={(e) => handleIdentitasChange('nipPengawas', e.target.value)}
              placeholder="Contoh: 19740615 199903 1 003"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            />
          </div>

          {/* Unit Kerja */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Unit Kerja <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={identitas.unitKerja}
              onChange={(e) => handleIdentitasChange('unitKerja', e.target.value)}
              placeholder="Contoh: Kantor Kementerian Agama Kab. Sleman / Pokjawas PAI"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            />
          </div>

          {/* Jenjang Pengawasan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenjang Pengawasan <span className="text-rose-500">*</span>
            </label>
            <select
              value={identitas.jenjangPengawasan}
              onChange={(e) => handleIdentitasChange('jenjangPengawasan', e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            >
              {JENJANG_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Wilayah Binaan */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Wilayah Binaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={identitas.wilayahBinaan}
              onChange={(e) => handleIdentitasChange('wilayahBinaan', e.target.value)}
              placeholder="Contoh: Kecamatan Depok dan Mlati (12 Sekolah Binaan)"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            />
          </div>

          {/* Tanda Tangan: Nama & NIP Ketua Pokjawas (Pojok Kiri Bawah) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ketua Pokjawas PAI (Pojok Kiri Bawah)
              </h4>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Nama Ketua Pokjawas:
              </label>
              <input
                type="text"
                value={identitas.namaKetuaPokjawas}
                onChange={(e) => handleIdentitasChange('namaKetuaPokjawas', e.target.value)}
                placeholder="Dr. Hj. Siti Rohmah, M.Ag"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                NIP Ketua Pokjawas:
              </label>
              <input
                type="text"
                value={identitas.nipKetuaPokjawas}
                onChange={(e) => handleIdentitasChange('nipKetuaPokjawas', e.target.value)}
                placeholder="19691124 199503 2 002"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Tempat & Tanggal Dokumen */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Titik Mangsa Dokumen (Pojok Kanan Bawah)
              </h4>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Kota & Tanggal Laporan:
              </label>
              <input
                type="text"
                value={identitas.kotaTanggal}
                onChange={(e) => handleIdentitasChange('kotaTanggal', e.target.value)}
                placeholder="Contoh: Sleman, 24 Oktober 2024"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 italic mt-2">
              Format ini otomatis dicetak di atas tanda tangan Pengawas PAI.
            </p>
          </div>
        </div>
      </section>

      {/* ======================= BAGIAN 2: PEMBINAAN PENGAWAS ======================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-sm">
            2
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              BAGIAN II : PEMBINAAN PENGAWAS
            </h3>
            <p className="text-xs text-slate-500">
              Substansi teknis pembinaan kepengawasan akademik
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* A. Nama Kegiatan Pembinaan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>
                A. Nama Kegiatan Pembinaan <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400">Diisi manual oleh users</span>
            </label>
            <input
              type="text"
              value={pembinaan.namaKegiatan}
              onChange={(e) => handlePembinaanChange('namaKegiatan', e.target.value)}
              placeholder="Contoh: Workshop Peningkatan Mutu Perancangan Modul Ajar Berdiferensiasi dan Asesmen Autentik PAI"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white font-medium"
            />
          </div>

          {/* B. Aspek / Masalah (Dropdown) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>
                B. Aspek / Masalah <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-emerald-700">Pilihan Dropdown Resmi</span>
            </label>
            <select
              value={pembinaan.aspekMasalah}
              onChange={(e) => handlePembinaanChange('aspekMasalah', e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            >
              {ASPEK_MASALAH_OPTIONS.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Opsi Custom jika memilih Lainnya */}
            {pembinaan.aspekMasalah === 'Lainnya (Isi Sendiri)' && (
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Tuliskan Aspek/Masalah Khusus:
                </label>
                <textarea
                  rows={2}
                  value={pembinaan.aspekMasalahCustom || ''}
                  onChange={(e) => handlePembinaanChange('aspekMasalahCustom', e.target.value)}
                  placeholder="Tuliskan rumusan aspek masalah pengawasan secara spesifik..."
                  className="w-full text-xs p-2.5 border border-amber-300 rounded-md bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* C. Latar Belakang (Generated Otomatis Sesuai Masalah, <= 150 kata) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>C. Latar Belakang</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Generated Otomatis (Maks 150 kata)
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    latarBelakangWords > 150
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {latarBelakangWords} / 150 kata
                </span>
                <button
                  type="button"
                  onClick={() => handleRegenerateSingleField('latarBelakang', 'Latar Belakang')}
                  disabled={generatingField === 'latarBelakang'}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${
                      generatingField === 'latarBelakang' ? 'animate-spin' : ''
                    }`}
                  />
                  Perbarui AI
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={pembinaan.latarBelakang}
              onChange={(e) => handlePembinaanChange('latarBelakang', e.target.value)}
              placeholder="Narasi latar belakang singkat maksimal 150 kata memuat kondisi riil lapangan dan urgensi pembinaan..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white leading-relaxed text-justify"
            />
          </div>

          {/* D & E : Waktu, Tempat, dan Jumlah Peserta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* D. Waktu dan Tempat Pelatihan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>
                  D. Waktu dan Tempat Pelatihan <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">Diisi manual</span>
              </label>
              <input
                type="text"
                value={pembinaan.waktuTempat}
                onChange={(e) => handlePembinaanChange('waktuTempat', e.target.value)}
                placeholder="Kamis, 24 Oktober 2024 / Pukul 08.30 WIB / Aula SMPN 1 Sleman"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              />
            </div>

            {/* E. Jumlah Peserta */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>
                  E. Jumlah Peserta <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">Diisi manual</span>
              </label>
              <input
                type="text"
                value={pembinaan.jumlahPeserta}
                onChange={(e) => handlePembinaanChange('jumlahPeserta', e.target.value)}
                placeholder="24 Orang Guru Pendidikan Agama Islam (GPAI)"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* F. Materi Pembinaan (Generated Otomatis, <= 150 kata) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>F. Materi Pembinaan</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Generated Otomatis (Maks 150 kata)
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    materiWords > 150
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {materiWords} / 150 kata
                </span>
                <button
                  type="button"
                  onClick={() => handleRegenerateSingleField('materiPembinaan', 'Materi Pembinaan')}
                  disabled={generatingField === 'materiPembinaan'}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${
                      generatingField === 'materiPembinaan' ? 'animate-spin' : ''
                    }`}
                  />
                  Perbarui AI
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={pembinaan.materiPembinaan}
              onChange={(e) => handlePembinaanChange('materiPembinaan', e.target.value)}
              placeholder="Narasi pokok-pokok materi pembinaan maksimal 150 kata..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white leading-relaxed text-justify"
            />
          </div>

          {/* G. Strategi / Metode Kerja / Teknik Supervisi (Multi-select) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>
                G. Strategi / Metode Kerja / Teknik Supervisi <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-emerald-700">
                Pilihan; Pengawas boleh memilih lebih dari satu
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STRATEGI_SUPERVISI_OPTIONS.map((strat, idx) => {
                const isSelected = pembinaan.strategi.includes(strat);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStrategiToggle(strat)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-700">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 fill-emerald-600 text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span>{strat}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Strategi jika dipilih */}
            {pembinaan.strategi.includes('Lainnya (Tulis Sendiri)') && (
              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuliskan Strategi / Metode Khusus:
                </label>
                <input
                  type="text"
                  value={pembinaan.strategiCustom || ''}
                  onChange={(e) => handlePembinaanChange('strategiCustom', e.target.value)}
                  placeholder="Contoh: Diskusi Terpumpun Berbasis Komunitas Belajar Sekolah"
                  className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white"
                />
              </div>
            )}
          </div>

          {/* H. Pelaksanaan Kegiatan Pembinaan (3 Bagian) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>H. Pelaksanaan Kegiatan Pembinaan</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Rinci 3 Bagian: 1) Awal, 2) Inti, 3) Akhir
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  handleRegenerateSingleField('pelaksanaan', 'Pelaksanaan Kegiatan Pembinaan')
                }
                disabled={generatingField === 'pelaksanaan'}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3 h-3 ${
                    generatingField === 'pelaksanaan' ? 'animate-spin' : ''
                  }`}
                />
                Perbarui AI
              </button>
            </div>

            <textarea
              rows={8}
              value={pembinaan.pelaksanaan}
              onChange={(e) => handlePembinaanChange('pelaksanaan', e.target.value)}
              placeholder="Tuliskan rinci menjadi 3 bagian: 1). Kegiatan Awal, 2). Kegiatan Inti, 3). Kegiatan Akhir..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white leading-relaxed font-mono text-[12px]"
            />
          </div>

          {/* I. Hasil Pembinaan */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>I. Hasil Pembinaan</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Generated Otomatis (Terukur Kualitatif & Kuantitatif)
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  handleRegenerateSingleField('hasilPembinaan', 'Hasil Pembinaan')
                }
                disabled={generatingField === 'hasilPembinaan'}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3 h-3 ${
                    generatingField === 'hasilPembinaan' ? 'animate-spin' : ''
                  }`}
                />
                Perbarui AI
              </button>
            </div>

            <textarea
              rows={3}
              value={pembinaan.hasilPembinaan}
              onChange={(e) => handlePembinaanChange('hasilPembinaan', e.target.value)}
              placeholder="Contoh: 80% GPAI mampu menerapkan pembelajaran berdiferensiasi serta merancang minimal satu skenario..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white leading-relaxed text-justify"
            />
          </div>

          {/* J. Penutup */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>J. Penutup</span>
                <span className="text-[11px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Generated Otomatis (Simpulan & Rekomendasi Pengawasan)
                </span>
              </label>

              <button
                type="button"
                onClick={() => handleRegenerateSingleField('penutup', 'Penutup')}
                disabled={generatingField === 'penutup'}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3 h-3 ${generatingField === 'penutup' ? 'animate-spin' : ''}`}
                />
                Perbarui AI
              </button>
            </div>

            <textarea
              rows={3}
              value={pembinaan.penutup}
              onChange={(e) => handlePembinaanChange('penutup', e.target.value)}
              placeholder="Simpulan pelaksanaan pembinaan dan rekomendasi tindak lanjut..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white leading-relaxed text-justify"
            />
          </div>
        </div>
      </section>

      {/* Floating Bottom Action */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur border border-slate-300 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          Data tersimpan otomatis di penyimpanan lokal browser.
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateAllWithAi}
            disabled={isGeneratingAll}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            Generate AI Ulang
          </button>
          <button
            type="button"
            onClick={onNavigateToSpreadsheet}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            Buka Lembar Spreadsheet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
