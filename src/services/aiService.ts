import { ASPEK_MASALAH_OPTIONS } from '../types/report';

export interface GenerateReportPayload {
  namaKegiatan: string;
  aspekMasalah: string;
  aspekMasalahCustom?: string;
  strategi: string[];
  strategiCustom?: string;
  jenjang: string;
  wilayahBinaan: string;
  jumlahPeserta: string;
  waktuTempat: string;
}

export interface GeneratedReportResult {
  latarBelakang: string;
  materiPembinaan: string;
  pelaksanaan: string;
  hasilPembinaan: string;
  penutup: string;
}

export async function checkAiStatus(): Promise<{ configured: boolean; model: string }> {
  try {
    const res = await fetch('/api/ai-status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err) {
    return { configured: false, model: 'gemini-3.8-flash' };
  }
}

export async function generateFullReportAi(payload: GenerateReportPayload): Promise<{
  data: GeneratedReportResult;
  source: 'gemini_ai' | 'curated_standard' | 'fallback';
  warning?: string;
}> {
  try {
    const res = await fetch('/api/generate-full-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    console.warn('AI call failed, using client-side curated fallback:', err);
    return {
      data: getLocalFallbackNarratives(payload),
      source: 'fallback',
      warning: err.message,
    };
  }
}

export async function regenerateFieldAi(
  field: string,
  currentValue: string,
  context: {
    aspekMasalah: string;
    strategi: string;
    namaKegiatan: string;
  },
  instruction?: string
): Promise<string> {
  try {
    const res = await fetch('/api/regenerate-field', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, currentValue, context, instruction }),
    });

    if (!res.ok) {
      throw new Error('Gagal meregenerasi bagian ini');
    }

    const json = await res.json();
    return json.text || currentValue;
  } catch (err) {
    console.error('Field regeneration error:', err);
    throw err;
  }
}

function getLocalFallbackNarratives(payload: GenerateReportPayload): GeneratedReportResult {
  const finalMasalah =
    payload.aspekMasalah === 'Lainnya (Isi Sendiri)'
      ? payload.aspekMasalahCustom || 'Peningkatan kompetensi guru PAI'
      : payload.aspekMasalah;
  const stratText =
    payload.strategi.length > 0
      ? payload.strategi.join(', ')
      : 'Supervisi Klinis Bermutu dan Coaching Akademik';

  return {
    latarBelakang: `Pelaksanaan pengawasan akademik di lingkungan satuan pendidikan binaan jenjang ${payload.jenjang || 'sekolah binaan'} mengindikasikan perlunya perbaikan mendalam terkait kompetensi guru. Dari hasil observasi dan analisis kebutuhan, teridentifikasi bahwa ${finalMasalah}. Kondisi ini secara langsung mempengaruhi mutu pembelajaran PAI dan pembentukan karakter akhlak mulia peserta didik. Oleh sebab itu, pembinaan terarah oleh Pengawas PAI sangat mendesak untuk membedah hambatan tersebut, menyamakan persepsi standar Kurikulum Merdeka, serta memberikan pendampingan teknis yang solutif.`,

    materiPembinaan: `Materi pembinaan difokuskan pada penguasaan konsep dan praktik langsung untuk menyelesaikan masalah ${finalMasalah}. Pokok bahasan mencakup: (1) Telaah substansi Kurikulum Merdeka rumpun Pendidikan Agama Islam dan Budi Pekerti, (2) Bedah instrumen pedagogik dan profesionalisme guru, (3) Praktik mandiri dan kolaboratif dalam menyusun perangkat/aktivitas belajar yang bermakna, serta (4) Teknik evaluasi komprehensif. Materi disampaikan secara lugas dan langsung diarahkan pada implementasi riil di satuan pendidikan binaan.`,

    pelaksanaan: `1). Kegiatan Awal:\nPengawas PAI membuka pertemuan dengan salam hormat, tadarus bersama, dan pengantar tentang target pembinaan. Dilanjutkan dengan dialog reflektif diagnostik bersama ${payload.jumlahPeserta || 'peserta'} untuk memetakan pemahaman dan kendala awal terkait fokus pembinaan.\n\n2). Kegiatan Inti:\nPembinaan dilaksanakan menggunakan metode ${stratText}. Pengawas menyajikan kerangka kerja dan contoh konkret, dilanjutkan sesi interaktif bedah dokumen/studi kasus. Pengawas mendampingi para peserta secara langsung, memberikan masukan konstruktif atas draf rancangan yang disusun peserta, serta memandu simulasi praktik solutif.\n\n3). Kegiatan Akhir:\nPengawas dan peserta merangkum intisari hasil kegiatan, menyusun Rencana Tindak Lanjut (RTL) yang jelas dan terukur untuk implementasi di kelas masing-masing, pemberian arahan motivasi pengawasan, serta ditutup dengan doa bersama.`,

    hasilPembinaan: `Sebanyak 88% Guru Pendidikan Agama Islam (GPAI) peserta pembinaan terbukti mampu memahami esensi solusi masalah serta berhasil menyusun minimal satu draf perangkat/rencana tindakan perbaikan yang sahih. Terjadi peningkatan pemahaman konseptual dan komitmen guru dalam menghadirkan pembelajaran PAI yang bermakna bagi peserta didik. Selain itu, seluruh peserta menyepakati Rencana Tindak Lanjut (RTL) sebagai bentuk pertanggungjawaban kepengawasan.`,

    penutup: `Kegiatan pembinaan pengawas PAI melalui metode ${stratText} telah berjalan dengan tertib, lancar, dan mencapai hasil yang diharapkan. Kerjasama harmonis antara Pengawas PAI dan guru binaan menjadi kunci utama peningkatan mutu pendidikan agama Islam. Disarankan kepada pihak sekolah dan MGMP/KKG PAI untuk menindaklanjuti hasil kegiatan ini secara berkesinambungan.`,
  };
}
