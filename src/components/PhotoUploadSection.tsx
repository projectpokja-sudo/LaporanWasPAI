import React, { useRef } from 'react';
import { ActivityPhoto } from '../types/report';
import { Upload, X, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';

interface PhotoUploadSectionProps {
  photos: ActivityPhoto[];
  onChange: (photos: ActivityPhoto[]) => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ photos, onChange }) => {
  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar dengan format JPG, JPEG, atau PNG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = [...photos];
      updated[index] = {
        ...updated[index],
        dataUrl,
        fileName: file.name,
      };
      onChange(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = {
      ...updated[index],
      dataUrl: '',
      fileName: undefined,
    };
    onChange(updated);
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = '';
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = {
      ...updated[index],
      caption,
    };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-semibold">
              📸
            </span>
            Lampiran 3 Foto Kegiatan Pembinaan
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Unggah 3 dokumentasi kegiatan pembinaan pengawas PAI (Format: JPG, JPEG, PNG). Foto akan terlampir otomatis di lembar spreadsheet dan file Word (.docx).
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full self-start">
          <Info className="w-3.5 h-3.5" />
          Maksimal 3 Foto Dokumentasi
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((idx) => {
          const photo = photos[idx] || { id: `photo-${idx + 1}`, dataUrl: '', caption: '' };
          const defaultTitles = [
            'Foto 1: Kegiatan Awal / Pembukaan',
            'Foto 2: Pendampingan / Workshop Inti',
            'Foto 3: Refleksi & Komitmen RTL',
          ];

          return (
            <div
              key={photo.id || idx}
              className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden hover:border-emerald-300 transition-colors"
            >
              {/* Card Header */}
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  {defaultTitles[idx]}
                </span>
                {photo.dataUrl ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Terunggah
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Belum Ada</span>
                )}
              </div>

              {/* Photo Area */}
              <div className="p-4 flex-1 flex flex-col">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs[idx].current = el;
                  }}
                  onChange={(e) => handleFileSelect(idx, e)}
                />

                {photo.dataUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
                    <img
                      src={photo.dataUrl}
                      alt={`Dokumentasi ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRefs[idx].current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-medium rounded-lg shadow hover:bg-slate-100 transition"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg shadow hover:bg-rose-700 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs[idx].current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition aspect-video group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200/80 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-900">
                      Klik untuk Unggah Foto
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">JPG, JPEG, PNG (Maks 5MB)</span>
                  </div>
                )}

                {/* Caption Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Keterangan Foto (Caption):
                  </label>
                  <textarea
                    rows={2}
                    value={photo.caption}
                    onChange={(e) => handleCaptionChange(idx, e.target.value)}
                    placeholder={`Contoh: Dokumentasi ${defaultTitles[idx]}`}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
