import React, { useState } from 'react';
import { PengawasIdentity, JENJANG_OPTIONS } from '../types/report';
import { saveDefaultIdentity } from '../utils/storage';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

interface DefaultSettingsModalProps {
  currentIdentity: PengawasIdentity;
  onSaveIdentity: (identity: PengawasIdentity) => void;
}

export const DefaultSettingsModal: React.FC<DefaultSettingsModalProps> = ({
  currentIdentity,
  onSaveIdentity,
}) => {
  const [formData, setFormData] = useState<PengawasIdentity>({ ...currentIdentity });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDefaultIdentity(formData);
    onSaveIdentity(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Pengaturan Profil Identitas Default Pengawas
          </h2>
          <p className="text-xs text-slate-500">
            Simpan data identitas tetap Anda dan Ketua Pokjawas agar otomatis terisi pada setiap laporan baru.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Pengawas PAI (beserta gelar):
            </label>
            <input
              type="text"
              value={formData.namaPengawas}
              onChange={(e) => setFormData({ ...formData, namaPengawas: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NIP Pengawas PAI:
            </label>
            <input
              type="text"
              value={formData.nipPengawas}
              onChange={(e) => setFormData({ ...formData, nipPengawas: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit Kerja:
            </label>
            <input
              type="text"
              value={formData.unitKerja}
              onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
              placeholder="Kantor Kementerian Agama Kab. ..."
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jenjang Pengawasan Utama:
            </label>
            <select
              value={formData.jenjangPengawasan}
              onChange={(e) => setFormData({ ...formData, jenjangPengawasan: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              {JENJANG_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Wilayah / Sekolah Binaan Default:
            </label>
            <input
              type="text"
              value={formData.wilayahBinaan}
              onChange={(e) => setFormData({ ...formData, wilayahBinaan: e.target.value })}
              placeholder="Contoh: Kecamatan Depok dan Mlati (12 Sekolah Binaan)"
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Ketua Pokjawas PAI:
            </label>
            <input
              type="text"
              value={formData.namaKetuaPokjawas}
              onChange={(e) => setFormData({ ...formData, namaKetuaPokjawas: e.target.value })}
              placeholder="Dr. Hj. Siti Rohmah, M.Ag"
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NIP Ketua Pokjawas PAI:
            </label>
            <input
              type="text"
              value={formData.nipKetuaPokjawas}
              onChange={(e) => setFormData({ ...formData, nipKetuaPokjawas: e.target.value })}
              placeholder="19691124 199503 2 002"
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profil Identitas Berhasil Disimpan ke Peramban!
            </span>
          ) : (
            <span className="text-xs text-slate-400">Data tersimpan di penyimpanan lokal browser.</span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> Simpan Profil Identitas
          </button>
        </div>
      </form>
    </div>
  );
};
