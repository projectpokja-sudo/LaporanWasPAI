import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  Save,
  Download,
  Printer,
  BookmarkCheck,
  FileCheck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { FullReport, ASPEK_MASALAH_OPTIONS } from '../types/report';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onSaveReport: () => void;
  onDownloadWord: () => void;
  onPrint: () => void;
  onLoadPreset: (presetKey: string) => void;
  aiStatus: { configured: boolean; model: string };
  isSavedJustNow: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onSaveReport,
  onDownloadWord,
  onPrint,
  onLoadPreset,
  aiStatus,
  isSavedJustNow,
}) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 print:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-800">GENERATOR LAPORAN PEMBINAAN PENGAWAS PAI</span>
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Asisten Cerdas Pengawasan Akademik Guru PAI dan Budi Pekerti
            </p>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-2.5">
          {/* AI Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{aiStatus.configured ? 'Gemini 3.8 Flash Siap' : 'Mode Pokjawas Standar'}</span>
          </div>

          {/* Preset Contoh Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Pilih Kasus Contoh</span>
              <span className="sm:hidden">Contoh</span>
            </button>

            {showPresetMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowPresetMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                    Muat Contoh Pembinaan Cepat:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('modul_ajar');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 transition"
                  >
                    <span className="font-bold block text-emerald-900">
                      1. Modul Ajar Berdiferensiasi
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Fasilitasi pemahaman mendalam vs padat materi
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('asesmen_sikap');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 transition"
                  >
                    <span className="font-bold block text-emerald-900">
                      2. Asesmen Sikap Spiritual & Sosial
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Instrumen formatif afektif autentik dan tindak lanjut
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('smart_pai');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 transition"
                  >
                    <span className="font-bold block text-emerald-900">
                      3. Platform Digital & Smart PAI
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pemanfaatan LMS & Canva untuk ekosistem PAI
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Simpan ke Riwayat */}
          <button
            type="button"
            onClick={onSaveReport}
            className={`text-xs px-3.5 py-2 rounded-lg font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              isSavedJustNow
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {isSavedJustNow ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Tersimpan</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Simpan Riwayat</span>
              </>
            )}
          </button>

          {/* Cetak Quick */}
          <button
            type="button"
            onClick={onPrint}
            title="Cetak atau Simpan PDF"
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Unduh Word Quick */}
          <button
            type="button"
            onClick={onDownloadWord}
            className="text-xs px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh Word</span>
          </button>
        </div>
      </div>
    </header>
  );
};
