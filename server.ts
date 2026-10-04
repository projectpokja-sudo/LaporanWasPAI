import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Inisialisasi Google GenAI dengan environment variable GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality curated generator for reliable instant previews
function getCuratedNarratives(data: {
  namaKegiatan: string;
  aspekMasalah: string;
  strategi: string[];
  jenjang: string;
  wilayahBinaan: string;
  jumlahPeserta: string;
}) {
  const { namaKegiatan, aspekMasalah, strategi, jenjang, jumlahPeserta } = data;
  const stratText = strategi.length > 0 ? strategi.join(', ') : 'Supervisi Klinis Bermutu dan Coaching Akademik';

  return {
    latarBelakang: `Pelaksanaan pengawasan akademik di lingkungan GPAI jenjang ${jenjang || 'sekolah binaan'} menunjukkan perlunya penguatan mutu secara berkesinambungan. Berdasarkan hasil pemantauan awal, ditemukan kendala nyata di mana ${aspekMasalah}. Kondisi tersebut berdampak langsung pada efektivitas proses pembelajaran Pendidikan Agama Islam dan Budi Pekerti di kelas. Tanpa intervensi kepengawasan yang terencana, potensi murid dalam menghayati dan mengamalkan nilai-nilai ajaran Islam tidak dapat terfasilitasi secara optimal. Oleh karena itu, kegiatan pembinaan ini menjadi langkah strategis untuk membedah akar permasalahan, menyelaraskan pemahaman dengan paradigma Kurikulum Merdeka, serta memberikan pendampingan intensif agar guru binaan mampu mengatasi hambatan tersebut secara profesional dan akuntabel.`,

    materiPembinaan: `Materi pembinaan difokuskan pada penguatan pemahaman konseptual dan keterampilan aplikatif terkait penyelesaian masalah ${aspekMasalah}. Substansi bahasan mencakup: (1) Telaah regulasi dan prinsip Kurikulum Merdeka rumpun PAI dan Budi Pekerti, (2) Bedah instrumen dan best practice penguasaan kompetensi pedagogik serta profesional, (3) Simulasi penyusunan perangkat/praktik nyata yang memfasilitasi pemahaman mendalam murid, dan (4) Teknik evaluasi serta refleksi berkelanjutan berbasis karakteristik peserta didik. Pendalaman materi ini dirancang secara kontekstual guna membekali guru dengan instrumen praktis yang siap diimplementasikan langsung di satuan pendidikan masing-masing.`,

    pelaksanaan: `1). Kegiatan Awal:\nPengawas PAI membuka kegiatan dengan salam takzim, doa bersama, dan pembacaan ayat suci Al-Qur'an untuk membina suasana spiritual-akademik. Selanjutnya, pengawas menyampaikan tujuan pembinaan, target capaian, serta melakukan apersepsi dan pre-asesmen diagnostik secara dialogis guna memetakan pemahaman awal ${jumlahPeserta || 'peserta'} terhadap fokus pembinaan.\n\n2). Kegiatan Inti:\nPelaksanaan pembinaan diimplementasikan melalui pendekatan ${stratText}. Pengawas memaparkan materi kunci, menyajikan studi kasus riil yang dialami guru, dilanjutkan dengan sesi interaktif bedah dokumen dan simulasi praktik terbimbing. Setiap peserta aktif menganalisis persoalan, merumuskan solusi kolaboratif, serta menghasilkan draf perbaikan dokumen/praktik pembelajaran dengan bimbingan dan umpan balik langsung dari pengawas secara konstruktif.\n\n3). Kegiatan Akhir:\nPengawas bersama seluruh peserta merangkum intisari pembinaan dan melakukan refleksi bersama atas proses pembelajaran yang telah berlangsung. Kegiatan diakhiri dengan penyusunan Rencana Tindak Lanjut (RTL) yang memuat target implementasi di kelas masing-masing, pemberian motivasi pengabdian, penegasan komitmen mutu, serta doa penutup.`,

    hasilPembinaan: `Pelaksanaan pembinaan menunjukkan hasil yang signifikan dan terukur: Sekitar 88% Guru Pendidikan Agama Islam (GPAI) peserta pembinaan terbukti mampu memahami akar permasalahan serta berhasil merancang dokumen/perangkat pembelajaran yang sesuai dengan standar mutu Kurikulum Merdeka. Terjadi peningkatan antusiasme dan komitmen profesional guru dalam menerapkan metode pembelajaran aktif dan bermakna. Selain itu, seluruh peserta telah menyelesaikan draf perbaikan karya dan menyepakati Rencana Tindak Lanjut (RTL) terpadu sebagai bentuk akuntabilitas peningkatan mutu pembelajaran PAI di satuan pendidikan masing-masing.`,

    penutup: `Kegiatan pembinaan pengawas PAI melalui pendekatan ${stratText} telah terlaksana dengan tertib, lancar, dan mencapai indikator keberhasilan yang diharapkan. Sinergi antara Pengawas PAI dan guru binaan menjadi modal utama dalam transformasi pembelajaran agama Islam yang bermutu dan berorientasi pada karakter peserta didik. Direkomendasikan kepada Kepala Sekolah dan Koordinator KKG/MGMP untuk senantiasa memfasilitasi tindak lanjut hasil pembinaan ini dalam forum komunitas belajar di sekolah secara berkelanjutan demi keberkahan dan kemajuan pendidikan agama Islam.`,
  };
}

// Endpoint untuk cek status koneksi AI
app.get('/api/ai-status', (_req, res) => {
  res.json({
    configured: !!apiKey,
    model: 'gemini-3.8-flash',
  });
});

// Endpoint generate narasi lengkap laporan
app.post('/api/generate-full-report', async (req, res) => {
  try {
    const {
      namaKegiatan,
      aspekMasalah,
      aspekMasalahCustom,
      strategi,
      strategiCustom,
      jenjang,
      wilayahBinaan,
      jumlahPeserta,
      waktuTempat,
    } = req.body;

    const finalMasalah = aspekMasalah === 'Lainnya (Isi Sendiri)' ? (aspekMasalahCustom || 'Hambatan perencanaan dan asesmen PAI') : aspekMasalah;
    const finalStrategi = Array.isArray(strategi) ? [...strategi] : [];
    if (strategiCustom && strategiCustom.trim()) {
      finalStrategi.push(strategiCustom.trim());
    }

    // Default template curated data
    const curated = getCuratedNarratives({
      namaKegiatan: namaKegiatan || 'Pembinaan Pengawasan Akademik Guru PAI',
      aspekMasalah: finalMasalah,
      strategi: finalStrategi,
      jenjang: jenjang || 'Sekolah Dasar / Menengah',
      wilayahBinaan: wilayahBinaan || 'Wilayah Binaan Pengawas PAI',
      jumlahPeserta: jumlahPeserta || '20 Guru PAI',
    });

    if (!ai) {
      // Return high quality curated templates if AI key not configured yet
      return res.json({
        success: true,
        source: 'curated_standard',
        data: curated,
      });
    }

    const systemPrompt = `Anda adalah Asisten Pakar Pengawasan Pendidikan Agama Islam (PAI) Kementerian Agama Republik Indonesia dan Konsultan Pokjawas PAI Nasional.
Tugas Anda adalah menyusun teks narasi Laporan Pembinaan Pengawas PAI yang ilmiah, formal, berorientasi Kurikulum Merdeka, sesuai Pedoman Pengawasan PAI dan standar Kementerian Agama RI.
Bahasa yang digunakan: Bahasa Indonesia baku (EYD) yang sangat rapi, elegan, berwibawa, dan solutif.

KETENTUAN OUTPUT JSON PERSIS:
{
  "latarBelakang": "1 paragraf padat maksimal 150 kata memuat kondisi riil lapangan, kesenjangan masalah, dan urgensi pembinaan.",
  "materiPembinaan": "1 paragraf padat maksimal 150 kata memuat pokok-pokok materi/bimbingan teknis sesuai aspek masalah.",
  "pelaksanaan": "Tuliskan rinci menjadi 3 bagian format:\n1). Kegiatan Awal:\n...\n\n2). Kegiatan Inti:\n...\n\n3). Kegiatan Akhir:\n...",
  "hasilPembinaan": "Capaian terukur kualitatif dan kuantitatif (contoh: '85% GPAI mampu menerapkan... minimal satu skenario... dsb').",
  "penutup": "Simpulan efektivitas pembinaan, tindak lanjut, dan rekomendasi bagi GPAI, Kepala Sekolah, dan Pokjawas."
}`;

    const userPrompt = `Buatkan narasi Laporan Pembinaan Pengawas PAI berdasarkan data berikut:
- Nama Kegiatan Pembinaan: ${namaKegiatan || 'Pembinaan Kompetensi GPAI'}
- Jenjang Pengawasan: ${jenjang || 'SD/SMP/SMA/SMK'}
- Wilayah Binaan: ${wilayahBinaan || 'Wilayah Binaan'}
- Aspek / Masalah: ${finalMasalah}
- Waktu dan Tempat: ${waktuTempat || 'Sekolah Binaan'}
- Jumlah Peserta: ${jumlahPeserta || 'Guru PAI'}
- Strategi / Metode Supervisi yang Digunakan: ${finalStrategi.join(', ') || 'Coaching Akademik dan Supervisi Klinis Bermutu'}

Pastikan:
1. Latar Belakang maksimal 150 kata, 1 paragraf ringkas.
2. Materi Pembinaan maksimal 150 kata, 1 paragraf ringkas.
3. Pelaksanaan dibagi menjadi 3 bagian: 1). Kegiatan Awal, 2). Kegiatan Inti, 3). Kegiatan Akhir.
4. Hasil Pembinaan terukur (ada persentase & produk konkret).
5. Penutup memuat simpulan dan rekomendasi.
Output WAJIB berupa JSON yang valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const textOutput = response.text || '';
    let parsedData = curated;

    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      console.warn('Failed to parse Gemini JSON output, falling back to curated templates.');
    }

    return res.json({
      success: true,
      source: 'gemini_ai',
      data: {
        latarBelakang: parsedData.latarBelakang || curated.latarBelakang,
        materiPembinaan: parsedData.materiPembinaan || curated.materiPembinaan,
        pelaksanaan: parsedData.pelaksanaan || curated.pelaksanaan,
        hasilPembinaan: parsedData.hasilPembinaan || curated.hasilPembinaan,
        penutup: parsedData.penutup || curated.penutup,
      },
    });
  } catch (error: any) {
    console.error('Error generating with Gemini:', error);
    // If Gemini API fails, smoothly fallback to curated
    const curated = getCuratedNarratives({
      namaKegiatan: req.body?.namaKegiatan || '',
      aspekMasalah: req.body?.aspekMasalah || '',
      strategi: req.body?.strategi || [],
      jenjang: req.body?.jenjang || '',
      wilayahBinaan: req.body?.wilayahBinaan || '',
      jumlahPeserta: req.body?.jumlahPeserta || '',
    });

    return res.json({
      success: true,
      source: 'fallback',
      warning: error?.message,
      data: curated,
    });
  }
});

// Endpoint untuk perbaikan / regenerasi satu field spesifik
app.post('/api/regenerate-field', async (req, res) => {
  try {
    const { field, currentValue, context, instruction } = req.body;

    if (!ai) {
      return res.status(400).json({ error: 'Gemini API belum dikonfigurasi' });
    }

    const prompt = `Perbaiki atau generate ulang bagian "${field}" untuk Laporan Pembinaan Pengawas PAI.
Konteks Pembinaan:
- Masalah: ${context.aspekMasalah || '-'}
- Strategi: ${context.strategi || '-'}
- Kegiatan: ${context.namaKegiatan || '-'}

Nilai saat ini:
${currentValue || '(Kosong)'}

Instruksi Tambahan Pengguna:
${instruction || 'Buat lebih tajam, profesional, berbasis Kurikulum Merdeka, dan sesuai EYD bahasa Indonesia.'}

Berikan langsung teks narasinya tanpa pembungkus komentar atau format Markdown yang tidak perlu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah Pengawas PAI Senior Kemenag RI. Tuliskan teks resmi laporan pengawasan kedinasan secara terstruktur dan formal.',
        temperature: 0.7,
      },
    });

    const result = response.text?.trim() || currentValue;
    res.json({ success: true, text: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal menghasilkan teks' });
  }
});

// Static / Vite middleware
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[GENERATOR LAPORAN PEMBINAAN PENGAWAS PAI] Server berjalan di http://0.0.0.0:${port}`);
  });
}

setupServer();
