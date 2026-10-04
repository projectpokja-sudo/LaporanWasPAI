/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FullReport, ASPEK_MASALAH_OPTIONS, STRATEGI_SUPERVISI_OPTIONS } from './types/report';
import {
  loadDraftReport,
  saveDraftReport,
  getReportHistory,
  saveReportToHistory,
  deleteReportFromHistory,
  loadDefaultIdentity,
} from './utils/storage';
import { checkAiStatus } from './services/aiService';
import { exportReportToWord } from './utils/docxExport';

import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ReportForm } from './components/ReportForm';
import { SpreadsheetView } from './components/SpreadsheetView';
import { PhotoUploadSection } from './components/PhotoUploadSection';
import { HistoryModal } from './components/HistoryModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { DefaultSettingsModal } from './components/DefaultSettingsModal';

export default function App() {
  const [report, setReport] = useState<FullReport>(() => loadDraftReport());
  const [history, setHistory] = useState<FullReport[]>(() => getReportHistory());
  const [currentTab, setCurrentTab] = useState<NavTab>('form');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [aiStatus, setAiStatus] = useState({ configured: false, model: 'gemini-3.8-flash' });
  const [isSavedJustNow, setIsSavedJustNow] = useState(false);

  // Check AI connection status
  useEffect(() => {
    checkAiStatus().then((status) => {
      setAiStatus(status);
    });
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    saveDraftReport(report);
  }, [report]);

  const handleUpdateReport = (updated: FullReport) => {
    setReport(updated);
  };

  const handleSaveToHistory = () => {
    const updatedHistory = saveReportToHistory(report);
    setHistory(updatedHistory);
    setIsSavedJustNow(true);
    setTimeout(() => setIsSavedJustNow(false), 2500);
  };

  const handleDeleteFromHistory = (id: string) => {
    const updatedHistory = deleteReportFromHistory(id);
    setHistory(updatedHistory);
  };

  const handleLoadFromHistory = (selectedReport: FullReport) => {
    setReport({ ...selectedReport });
    setCurrentTab('spreadsheet');
  };

  const handleDownloadWord = async () => {
    await exportReportToWord(report);
  };

  const handlePrint = () => {
    window.print();
  };

  // Preset loader
  const handleLoadPreset = (key: string) => {
    if (key === 'modul_ajar') {
      setReport({
        ...report,
        pembinaan: {
          ...report.pembinaan,
          namaKegiatan:
            'Workshop Peningkatan Mutu Perancangan Modul Ajar Berdiferensiasi dan Asesmen Autentik PAI',
          aspekMasalah: ASPEK_MASALAH_OPTIONS[0],
          aspekMasalahCustom: '',
          latarBelakang:
            'Pelaksanaan pengawasan akademik di lingkungan GPAI menunjukkan bahwa guru masih menghadapi tantangan mendasar dalam merancang Modul Ajar PAI yang memfasilitasi pemahaman mendalam. Rencana pembelajaran di lapangan cenderung berorientasi administratif dan padat materi, sehingga aspek kualitas pemahaman bermakna dan internalisasi akhlak mulia peserta didik belum tercapai secara optimal. Oleh karena itu, diperlukan pendampingan terstruktur melalui pembinaan kepengawasan agar guru mampu menyusun skenario pembelajaran yang berpusat pada murid.',
          waktuTempat: 'Kamis, 24 Oktober 2024 / Pukul 08.30 - 14.30 WIB / Aula SMPN 1 Sleman',
          jumlahPeserta: '24 Orang Guru Pendidikan Agama Islam (GPAI)',
          materiPembinaan:
            'Materi pembinaan difokuskan pada bedah struktur Modul Ajar Kurikulum Merdeka rumpun PAI, strategi perumusan Tujuan Pembelajaran (TP) berbasis pemahaman mendalam, penyusunan skenario pembelajaran berdiferensiasi (konten, proses, dan produk), serta perancangan rubrik asesmen formatif-sumatif yang sahih dan aplikatif.',
          strategi: ['Workshop / Pelatihan Klinis', 'Coaching Akademik'],
          strategiCustom: '',
          pelaksanaan: `1). Kegiatan Awal:\nPengawas PAI membuka pertemuan dengan tadarus Al-Qur'an dan doa bersama. Pengawas menyampaikan urgensi kegiatan, target luaran, serta melakukan pemetaan diagnostik persepsi awal 24 GPAI mengenai kendala penyusunan modul ajar mendalam.\n\n2). Kegiatan Inti:\nPengawas memaparkan materi konseptual dan menyajikan contoh modul ajar PAI ideal. Dilanjutkan dengan sesi workshop klinis di mana peserta dibagi dalam rumpun fase untuk membedah modul ajar masing-masing. Pengawas melakukan coaching akademik secara bergiliran, memberikan umpan balik langsung pada bagian yang terlalu padat materi, dan memandu restrukturisasi aktivitas pembelajaran berbasis HOTS dan pemahaman mendalam.\n\n3). Kegiatan Akhir:\nPerwakilan GPAI mempresentasikan modul ajar hasil revisi, dilanjutkan dengan ulasan penguatan oleh Pengawas. Seluruh peserta menyepakati Rencana Tindak Lanjut (RTL) untuk mengimplementasikan modul tersebut dalam supervisi kelas berikutnya, ditutup dengan doa bersama.`,
          hasilPembinaan:
            'Sebanyak 88% (21 dari 24 GPAI) berhasil menyelesaikan draf final Modul Ajar PAI berbasis pemahaman mendalam yang siap diimplementasikan. Terjadi pergeseran paradigma mengajar dari sekadar transfer materi hafalan menuju fasilitasi pemikiran kritis murid, serta tersusunnya kesepakatan komitmen tindak lanjut supervisi klinis di sekolah masing-masing.',
          penutup:
            'Kegiatan pembinaan pengawas PAI melalui metode workshop klinis dan coaching akademik telah berjalan lancar, efektif, dan menghasilkan dampak konkret bagi guru binaan. Disarankan kepada Kepala Sekolah binaan untuk memfasilitasi penerapan modul ajar ini di kelas dan mendukung GPAI dalam komunitas belajar (MGMP PAI) secara berkelanjutan.',
        },
      });
      setCurrentTab('spreadsheet');
    } else if (key === 'asesmen_sikap') {
      setReport({
        ...report,
        pembinaan: {
          ...report.pembinaan,
          namaKegiatan:
            'Bimbingan Teknis Perumusan Instrumen Asesmen Sikap Spiritual & Sosial serta Analisis Tindak Lanjut GPAI',
          aspekMasalah: ASPEK_MASALAH_OPTIONS[4],
          aspekMasalahCustom: '',
          latarBelakang:
            'Hasil supervisi akademik menunjukkan sebagian besar guru PAI mengalami kendala metodologis dalam merumuskan instrumen asesmen formatif dan sumatif yang sahih, khususnya dalam mengukur aspek sikap (afektif) spiritual dan sosial peserta didik secara objektif. Penilaian sikap selama ini cenderung bersifat impresif dan administratif tanpa instrumen observasi atau rubrik perilaku yang terukur. Kondisi ini menuntut adanya pembinaan klinis dari Pengawas PAI guna melatih guru menyusun rubrik autentik penilaian akhlak peserta didik.',
          waktuTempat: 'Selasa, 12 November 2024 / Pukul 09.00 - 15.00 WIB / Ruang Laboratorium PAI SMPN 2 Depok',
          jumlahPeserta: '20 Orang Guru PAI',
          materiPembinaan:
            'Materi pembinaan mencakup: (1) Konseptualisasi asesmen afektif Kurikulum Merdeka berlandaskan Profil Pelajar Pancasila dan Rahmatan Lil Alamin, (2) Teknik penyusunan lembar observasi sikap spiritual dan jurnal harian sosial, (3) Konstruksi rubrik deskriptor perilaku bergradasi, dan (4) Model tindak lanjut hasil asesmen sikap melalui pembiasaan ibadah dan keteladanan.',
          strategi: ['Supervisi Klinis Bermutu (Pendampingan)', 'Focus Group Discussion (FGD) Kasus Riil (Problem Solving)'],
          strategiCustom: '',
          pelaksanaan: `1). Kegiatan Awal:\nPengawas PAI memandu pembacaan ayat suci Al-Qur'an dan doa pembuka. Pengawas menyajikan data hasil pemantauan ketercapaian asesmen sikap di sekolah binaan dan memantik diskusi mengenai bias objektivitas dalam penilaian nilai akhlak murid.\n\n2). Kegiatan Inti:\nPengawas membedah contoh instrumen asesmen afektif berbasis rubrik skala likert dan jurnal anekdot. Peserta kemudian berkelompok dalam FGD Kasus Riil untuk merumuskan indikator sikap pada salah satu Elemen PAI (misal Fikih Ibadah atau Akhlak Terpuji). Pengawas melakukan pendampingan klinis pada setiap meja kerja, memberikan telaah kritis atas ketepatan deskriptor sikap yang disusun guru.\n\n3). Kegiatan Akhir:\nSetiap kelompok mendemonstrasikan rubrik asesmen yang telah dirancang. Pengawas memberikan rangkuman penguatan metodologis dan bersama peserta menetapkan jadwal implementasi uji coba instrumen dalam pembelajaran di sekolah binaan masing-masing.`,
          hasilPembinaan:
            'Sekitar 90% GPAI binaan berhasil menyusun portofolio instrumen asesmen sikap spiritual dan sosial yang dilengkapi dengan rubrik deskriptor objektif. Guru memahami perbedaan asesmen perkembangan karakter dengan nilai kognitif, serta berkomitmen menggunakan instrumen baru dalam penilaian semester berjalan.',
          penutup:
            'Pembinaan supervisi klinis dan FGD ini memberikan solusi nyata atas hambatan objektivitas penilaian sikap afektif GPAI. Diharapkan Kepala Sekolah mendukung penyediaan sarana pembiasaan ibadah sebagai laboratorium nyata penilaian sikap peserta didik.',
        },
      });
      setCurrentTab('spreadsheet');
    } else if (key === 'smart_pai') {
      setReport({
        ...report,
        pembinaan: {
          ...report.pembinaan,
          namaKegiatan:
            'Pelatihan Pemanfaatan Platform Digital Smart PAI dan Canva Edukasi dalam Pembelajaran PAI Interaktif',
          aspekMasalah: ASPEK_MASALAH_OPTIONS[6],
          aspekMasalahCustom: '',
          latarBelakang:
            'Perkembangan era digital menuntut transformasi media pembelajaran Pendidikan Agama Islam agar lebih relevan dengan generasi peserta didik masa kini. Namun fakta di lapangan membuktikan guru PAI belum optimal mendayagunakan platform digital seperti Smart PAI, Canva Edukasi, maupun Learning Management System (LMS). Kondisi ini menyebabkan pembelajaran PAI terkesan konvensional dan kurang menarik minat murid. Oleh karena itu, pengawas menyelenggarakan pelatihan praktis pemanfaatan media digital guna membekali guru dengan kompetensi teknologi pembelajaran kontemporer.',
          waktuTempat: 'Rabu, 4 Desember 2024 / Pukul 08.00 - 15.30 WIB / Laboratorium Komputer Bersama Kemenag',
          jumlahPeserta: '28 Orang Guru PAI',
          materiPembinaan:
            'Materi pelatihan mencakup: (1) Eksplorasi fitur platform Smart PAI Kementerian Agama untuk penguatan ekosistem pembelajaran, (2) Desain infografis materi PAI dan lembar kerja interaktif berbasis Canva for Education, (3) Integrasi asesmen digital kuis interaktif, dan (4) Etika digital dan pemanfaatan teknologi secara syar\'i dan produktif.',
          strategi: ['Workshop / Pelatihan Klinis', 'Lokakarya (Bimtek)'],
          strategiCustom: '',
          pelaksanaan: `1). Kegiatan Awal:\nPembukaan diawali doa bersama dan penyampaian motivasi pentingnya guru PAI melek teknologi abad 21 oleh Pengawas PAI. Pengawas melakukan asesmen diagnostik singkat kecakapan digital para peserta.\n\n2). Kegiatan Inti:\nPengawas bersama narasumber teknis memandu langkah demi langkah login dan eksplorasi fitur Smart PAI serta akun Canva Pendidikan. Setiap GPAI langsung mempraktikkan pembuatan 1 media pembelajaran interaktif untuk materi PAI kelas masing-masing. Pengawas berkeliling memberikan bimbingan teknis (klinis) bagi guru yang mengalami kendala teknis.\n\n3). Kegiatan Akhir:\nPameran karya digital karya guru secara virtual di layar proyektor, dilanjutkan evaluasi ketercapaian dan pembagian link repositori karya bersama. Kegiatan ditutup dengan kesepakatan RTL untuk menerapkan media tersebut dalam kelas nyata.`,
          hasilPembinaan:
            'Sebanyak 95% peserta berhasil mengaktifkan akun Smart PAI serta memproduksi minimal satu media visual/interaktif berbasis Canva Edukasi yang siap dipakai mengajar. Motivasi guru dalam berinovasi meningkat drastis dan terbentuk jejaring berbagi media ajar digital antar-GPAI binaan.',
          penutup:
            'Pelatihan digitalisasi ini membuktikan bahwa GPAI memiliki potensi besar dalam mengadopsi teknologi pembelajaran modern. Disarankan kepada Kemenag dan Pokjawas untuk terus mendiseminasikan inovasi digital ini ke jenjang sekolah lainnya secara berkesinambungan.',
        },
      });
      setCurrentTab('spreadsheet');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar Nav */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onDownloadWord={handleDownloadWord}
        onPrint={handlePrint}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Global Header */}
        <Header
          onToggleMobileMenu={() => setIsOpenMobile(!isOpenMobile)}
          onSaveReport={handleSaveToHistory}
          onDownloadWord={handleDownloadWord}
          onPrint={handlePrint}
          onLoadPreset={handleLoadPreset}
          aiStatus={aiStatus}
          isSavedJustNow={isSavedJustNow}
        />

        {/* Dynamic View Tab */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'form' && (
            <ReportForm
              report={report}
              onUpdateReport={handleUpdateReport}
              onNavigateToSpreadsheet={() => setCurrentTab('spreadsheet')}
            />
          )}

          {currentTab === 'spreadsheet' && (
            <SpreadsheetView
              report={report}
              onUpdateReport={handleUpdateReport}
              onOpenAiGenerator={() => setCurrentTab('form')}
            />
          )}

          {currentTab === 'photos' && (
            <div className="space-y-6">
              <PhotoUploadSection
                photos={report.photos}
                onChange={(updatedPhotos) =>
                  handleUpdateReport({
                    ...report,
                    photos: updatedPhotos,
                  })
                }
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentTab('spreadsheet')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
                >
                  Lihat Hasil Lampiran di Lembar Spreadsheet →
                </button>
              </div>
            </div>
          )}

          {currentTab === 'history' && (
            <HistoryModal
              history={history}
              onLoadReport={handleLoadFromHistory}
              onDeleteReport={handleDeleteFromHistory}
              onClose={() => setCurrentTab('spreadsheet')}
            />
          )}

          {currentTab === 'guidelines' && <GuidelinesModal />}

          {currentTab === 'settings' && (
            <DefaultSettingsModal
              currentIdentity={report.identitas}
              onSaveIdentity={(newId) =>
                handleUpdateReport({
                  ...report,
                  identitas: newId,
                })
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
