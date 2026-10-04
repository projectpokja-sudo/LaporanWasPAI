import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
  ShadingType,
  VerticalAlign,
} from 'docx';
import { FullReport } from '../types/report';

function base64ToUint8Array(base64: string): Uint8Array | null {
  try {
    const parts = base64.split(';base64,');
    const raw = parts.length > 1 ? parts[1] : parts[0];
    const binary = atob(raw);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error('Failed to convert base64 image:', e);
    return null;
  }
}

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
  bottom: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
  left: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
  right: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
  insideVertical: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
};

const transparentBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

export async function exportReportToWord(report: FullReport): Promise<void> {
  const { identitas, pembinaan, photos } = report;

  const finalMasalah =
    pembinaan.aspekMasalah === 'Lainnya (Isi Sendiri)'
      ? pembinaan.aspekMasalahCustom || '-'
      : pembinaan.aspekMasalah;

  const strategiList = [...pembinaan.strategi];
  if (pembinaan.strategiCustom?.trim()) {
    strategiList.push(pembinaan.strategiCustom.trim());
  }

  // Row helper for spreadsheet section 1
  const createIdentityRow = (no: string, label: string, value: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: no, bold: true, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 62, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({ text: value || '-', font: 'Calibri' })],
            }),
          ],
        }),
      ],
    });
  };

  // Row helper for spreadsheet section 2
  const createPembinaanRow = (kode: string, komponen: string, isi: string | string[]) => {
    let paragraphs: Paragraph[] = [];

    if (Array.isArray(isi)) {
      paragraphs = isi.map(
        (p) =>
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100, line: 276 },
            children: [new TextRun({ text: p, font: 'Calibri' })],
          })
      );
    } else {
      // Split by double newline for structured sections like Pelaksanaan
      const splitted = (isi || '-').split('\n\n');
      paragraphs = splitted.map(
        (paragraphText) =>
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120, line: 276 },
            children: [new TextRun({ text: paragraphText, font: 'Calibri' })],
          })
      );
    }

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: kode, bold: true, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          children: [
            new Paragraph({
              children: [new TextRun({ text: komponen, bold: true, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 62, type: WidthType.PERCENTAGE },
          children: paragraphs,
        }),
      ],
    });
  };

  // Section 1 Header Row
  const headerSection1 = new TableRow({
    children: [
      new TableCell({
        columnSpan: 3,
        shading: { type: ShadingType.CLEAR, fill: '065F46' },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'BAGIAN I : IDENTITAS PENGAWAS PAI',
                bold: true,
                color: 'FFFFFF',
                font: 'Calibri',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Section 2 Header Row
  const headerSection2 = new TableRow({
    children: [
      new TableCell({
        columnSpan: 3,
        shading: { type: ShadingType.CLEAR, fill: '065F46' },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'BAGIAN II : PEMBINAAN PENGAWAS',
                bold: true,
                color: 'FFFFFF',
                font: 'Calibri',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Table Column Titles
  const columnTitlesRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'NO', bold: true, font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'KOMPONEN', bold: true, font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 62, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'URAIAN / DESKRIPSI', bold: true, font: 'Calibri' })],
          }),
        ],
      }),
    ],
  });

  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      columnTitlesRow,
      headerSection1,
      createIdentityRow('1', 'Nama Pengawas PAI', `${identitas.namaPengawas} (NIP. ${identitas.nipPengawas})`),
      createIdentityRow('2', 'Unit Kerja', identitas.unitKerja),
      createIdentityRow('3', 'Jenjang Pengawasan', identitas.jenjangPengawasan),
      createIdentityRow('4', 'Wilayah Binaan', identitas.wilayahBinaan),

      headerSection2,
      createPembinaanRow('A', 'Nama Kegiatan Pembinaan', pembinaan.namaKegiatan),
      createPembinaanRow('B', 'Aspek / Masalah', finalMasalah),
      createPembinaanRow('C', 'Latar Belakang', pembinaan.latarBelakang),
      createPembinaanRow('D', 'Waktu dan Tempat Pelatihan', pembinaan.waktuTempat),
      createPembinaanRow('E', 'Jumlah Peserta', pembinaan.jumlahPeserta),
      createPembinaanRow('F', 'Materi Pembinaan', pembinaan.materiPembinaan),
      createPembinaanRow('G', 'Strategi/Metode Kerja/Teknik Supervisi', strategiList.join(', ')),
      createPembinaanRow('H', 'Pelaksanaan Kegiatan Pembinaan', pembinaan.pelaksanaan),
      createPembinaanRow('I', 'Hasil Pembinaan', pembinaan.hasilPembinaan),
      createPembinaanRow('J', 'Penutup', pembinaan.penutup),
    ],
  });

  // Table photo attachments
  const photoCells: TableCell[] = [];
  for (let i = 0; i < 3; i++) {
    const photo = photos[i];
    const cellParagraphs: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: `Foto ${i + 1}`, bold: true, font: 'Calibri' })],
      }),
    ];

    if (photo && photo.dataUrl) {
      const bytes = base64ToUint8Array(photo.dataUrl);
      if (bytes) {
        cellParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: bytes,
                transformation: {
                  width: 175,
                  height: 125,
                },
                type: 'png',
              }),
            ],
          })
        );
      }
    } else {
      cellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 180 },
          children: [
            new TextRun({
              text: '[Dokumentasi Foto Belum Diunggah]',
              italics: true,
              color: '888888',
              font: 'Calibri',
            }),
          ],
        })
      );
    }

    cellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: photo?.caption || `Dokumentasi Pelaksanaan Kegiatan Bagian ${i + 1}`,
            italics: true,
            font: 'Calibri',
            size: 18,
          }),
        ],
      })
    );

    photoCells.push(
      new TableCell({
        width: { size: 33.33, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        children: cellParagraphs,
      })
    );
  }

  const photosTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3,
            shading: { type: ShadingType.CLEAR, fill: '065F46' },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: 'LAMPIRAN : DOKUMENTASI FOTO KEGIATAN PEMBINAAN',
                    bold: true,
                    color: 'FFFFFF',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: photoCells,
      }),
    ],
  });

  // Bottom Signatures Table (Left: Ketua Pokjawas, Right: Pengawas PAI)
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: transparentBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Mengetahui,', font: 'Calibri' })],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Ketua Pokjawas PAI,', bold: true, font: 'Calibri' })],
              }),
              new Paragraph({
                spacing: { before: 720 }, // Spasi untuk tanda tangan fisik
                children: [
                  new TextRun({
                    text: identitas.namaKetuaPokjawas || 'Dr. Hj. Siti Rohmah, M.Ag',
                    bold: true,
                    underline: {},
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `NIP. ${identitas.nipKetuaPokjawas || '19691124 199503 2 002'}`,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: identitas.kotaTanggal || 'Sleman, 24 Oktober 2024', font: 'Calibri' })],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Pengawas PAI Pembina,', bold: true, font: 'Calibri' })],
              }),
              new Paragraph({
                spacing: { before: 720 },
                children: [
                  new TextRun({
                    text: identitas.namaPengawas || 'Drs. H. Ahmad Fauzi, M.Pd.I',
                    bold: true,
                    underline: {},
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `NIP. ${identitas.nipPengawas || '19740615 199903 1 003'}`,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1100, // ~2cm
              bottom: 1100,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // Kop Surat & Header Resmi
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                bold: true,
                size: 26,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: identitas.unitKerja.toUpperCase(),
                bold: true,
                size: 22,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'LAPORAN PEMBINAAN PENGAWAS PAI',
                bold: true,
                size: 28,
                color: '065F46',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Jenjang: ${identitas.jenjangPengawasan} | Wilayah Binaan: ${identitas.wilayahBinaan}`,
                italics: true,
                size: 20,
                color: '4B5563',
                font: 'Calibri',
              }),
            ],
          }),

          // Main Table
          mainTable,

          // Spacing
          new Paragraph({ spacing: { before: 240 } }),

          // Photo Table
          photosTable,

          // Spacing before signatures
          new Paragraph({ spacing: { before: 360 } }),

          // Bottom Signatures Table
          signatureTable,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = identitas.namaPengawas.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Laporan_Pembinaan_Pengawas_PAI_${cleanName}_${new Date().toISOString().slice(0, 10)}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
