import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Camera,
  History,
  BookOpen,
  Settings,
  Download,
  Printer,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type NavTab = 'form' | 'spreadsheet' | 'photos' | 'history' | 'guidelines' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onDownloadWord: () => void;
  onPrint: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onDownloadWord,
  onPrint,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'form' as NavTab,
      label: 'Formulir & Generator',
      desc: 'Pengisian data & AI prompt',
      icon: FileText,
      badge: 'Utama',
    },
    {
      id: 'spreadsheet' as NavTab,
      label: 'Tabel Spreadsheet',
      desc: 'Preview resmi & edit sel',
      icon: FileSpreadsheet,
      badge: 'Resmi',
    },
    {
      id: 'photos' as NavTab,
      label: 'Lampiran 3 Foto',
      desc: 'Dokumentasi visual kegiatan',
      icon: Camera,
      badge: '3 Slot',
    },
    {
      id: 'history' as NavTab,
      label: 'Riwayat Dokumen',
      desc: 'Daftar laporan tersimpan',
      icon: History,
    },
    {
      id: 'guidelines' as NavTab,
      label: 'Standar Pokjawas PAI',
      desc: 'Pedoman pengawasan Kemenag',
      icon: BookOpen,
    },
    {
      id: 'settings' as NavTab,
      label: 'Identitas Default',
      desc: 'Simpan data pengawas & NIP',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-amber-300 shadow-md shrink-0 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                Kemenag RI • Pokjawas
              </span>
              <h1 className="text-xs font-extrabold tracking-tight text-white leading-tight mt-0.5">
                GENERATOR LAPORAN PEMBINAAN PENGAWAS PAI
              </h1>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5 leading-snug">
            Asisten Cerdas Pengawasan Akademik Guru PAI dan Budi Pekerti.
          </p>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition group relative cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? 'bg-emerald-800/80 text-amber-300'
                      : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive
                            ? 'bg-emerald-900 text-amber-300'
                            : 'bg-slate-800 text-emerald-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Output Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ekspor & Cetak
          </div>

          <button
            type="button"
            onClick={onDownloadWord}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh Dokumen Word (.docx)
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak / Simpan PDF
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Format Resmi Pokjawas Kemenag</span>
          </div>
        </div>
      </aside>
    </>
  );
};
