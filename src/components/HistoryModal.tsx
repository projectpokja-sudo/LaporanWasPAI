import React from 'react';
import { FullReport } from '../types/report';
import {
  History,
  FileText,
  Trash2,
  FolderOpen,
  Calendar,
  Users,
  Building,
  Download,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { exportReportToWord } from '../utils/docxExport';

interface HistoryModalProps {
  history: FullReport[];
  onLoadReport: (report: FullReport) => void;
  onDeleteReport: (id: string) => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onLoadReport,
  onDeleteReport,
  onClose,
}) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Riwayat Dokumen Laporan Pembinaan
            </h2>
            <p className="text-xs text-slate-500">
              Daftar dokumen laporan pembinaan pengawas yang tersimpan di peramban ini.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full self-start">
          Total: {history.length} Laporan Tersimpan
        </span>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Belum Ada Riwayat Laporan</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Gunakan tombol "Simpan Riwayat" pada bilah atas atau selesaikan draf laporan Anda
            untuk menyimpannya secara permanen di riwayat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {item.identitas.jenjangPengawasan}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.updatedAt || item.createdAt)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {item.pembinaan.namaKegiatan || 'Laporan Pembinaan Pengawas PAI'}
                </h3>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    <strong>Pengawas:</strong> {item.identitas.namaPengawas}
                  </span>
                  <span>
                    <strong>Wilayah:</strong> {item.identitas.wilayahBinaan}
                  </span>
                  <span>
                    <strong>Peserta:</strong> {item.pembinaan.jumlahPeserta || '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onLoadReport(item)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" /> Buka Laporan
                </button>

                <button
                  type="button"
                  onClick={() => exportReportToWord(item)}
                  title="Unduh File Word Langsung"
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Yakin ingin menghapus dokumen laporan ini dari riwayat?')) {
                      onDeleteReport(item.id);
                    }
                  }}
                  title="Hapus Laporan"
                  className="p-2 rounded-lg bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 text-xs transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
