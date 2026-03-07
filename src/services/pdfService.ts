import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PPMData {
  informasiUmum: {
    tema: string;
    subTema: string;
    usia: string;
    mingguSemester: string;
    alokasiWaktu: string;
    hariTanggal: string;
  };
  asesmenAwal: {
    deskripsi: string;
    poinPoin: string[];
    instrumen: string[];
  };
  identifikasi: {
    dimensiProfilLulusan: string[];
  };
  desainPembelajaran: {
    tujuanPembelajaran: string[];
    praktikPedagogis: string[];
    kemitraan: {
      orangTua: string[];
      lingkunganSekolah: string[];
      lingkunganPembelajaran: string[];
    };
    pemanfaatanDigital: string[];
  };
  pengalamanBelajar: {
    penyambutan: string;
    jadwalHarian: { hari: string; kegiatanPenyambutan: string; kegiatan: string }[];
    pembukaan: string[];
    memahami: string[];
    kegiatanInti: { hari: string; kegiatan: string[] }[];
    mengaplikasi: string[];
    merefleksi: string[];
    penutup: string;
  };
  asesmenPembelajaran: string;
  schoolName?: string;
  academicYear?: string;
  principalName?: string;
  teacherName?: string;
}

export const generatePPMPDF = (data: PPMData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const schoolName = data.schoolName || 'TK BALEGONDO 1';
  const academicYear = data.academicYear || 'TAHUN PELAJARAN 2025/2026';

  // Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PERENCANAAN PEMBELAJARAN MENDALAM', 148.5, 15, { align: 'center' });
  doc.text(schoolName, 148.5, 22, { align: 'center' });
  doc.text(academicYear, 148.5, 29, { align: 'center' });

  let currentY = 35;

  const getDayData = (dayName: string, type: 'penyambutan' | 'kegiatan') => {
    const day = data.pengalamanBelajar.jadwalHarian.find(j => j.hari.toLowerCase().includes(dayName.toLowerCase()));
    if (type === 'penyambutan') return day?.kegiatanPenyambutan || 'Penyambutan';
    
    const inti = data.pengalamanBelajar.kegiatanInti.find(k => k.hari.toLowerCase().includes(dayName.toLowerCase()));
    return inti?.kegiatan.map(k => `• ${k}`).join('\n') || '-';
  };

  const tableData: any[] = [
    // INFORMASI UMUM
    [
      { content: 'INFORMASI\nUMUM', styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      {
        colSpan: 5,
        content: '\n\n\n\n\n', // Placeholder to ensure height
        styles: { valign: 'middle' as const }
      },
    ],
    // ASESMEN AWAL
    [
      { content: 'ASESMEN AWAL', styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      {
        colSpan: 5,
        content: [
          data.asesmenAwal.deskripsi,
          ...data.asesmenAwal.poinPoin.map((p) => `       -  ${p}`),
          '•  Instrumen asesmen:',
          ...data.asesmenAwal.instrumen.map((i) => `       -  ${i}`),
        ].join('\n'),
      },
    ],
    // IDENTIFIKASI
    [
      { content: 'IDENTIFIKASI', styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      {
        colSpan: 5,
        content: [
          '•  Dimensi Profil Lulusan (Profil Pelajar Pancasila Anak Usia Dini):',
          ...data.identifikasi.dimensiProfilLulusan.map((d) => `       -  ${d}`),
        ].join('\n'),
      },
    ],
    // DESAIN PEMBELAJARAN
    [
      { content: 'DESAIN\nPEMBELAJARAN', styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      {
        colSpan: 5,
        content: [
          '•  Tujuan Pembelajaran:',
          ...data.desainPembelajaran.tujuanPembelajaran.map((t) => `       -  ${t}`),
          '\n•  Praktik Pedagogis:',
          ...data.desainPembelajaran.praktikPedagogis.map((p) => `       -  ${p}`),
          '\n•  Kemitraan Pembelajaran:',
          '   Orang Tua:',
          ...data.desainPembelajaran.kemitraan.orangTua.map((o) => `       -  ${o}`),
          '   Lingkungan Sekolah:',
          ...data.desainPembelajaran.kemitraan.lingkunganSekolah.map((l) => `       -  ${l}`),
          '   Lingkungan Pembelajaran:',
          ...data.desainPembelajaran.kemitraan.lingkunganPembelajaran.map((lp) => `       -  ${lp}`),
          '\n•  Pemanfaatan Digital:',
          ...data.desainPembelajaran.pemanfaatanDigital.map((pd) => `       -  ${pd}`),
        ].join('\n'),
      },
    ],
    // PENGALAMAN BELAJAR - PENYAMBUTAN
    [
      { content: 'PENGALAMAN\nBELAJAR', rowSpan: 7, styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      {
        colSpan: 5,
        content: 'Penyambutan:\n' + data.pengalamanBelajar.penyambutan,
      },
    ],
    // JADWAL HARIAN HEADER
    [
      { content: 'SENIN', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [230, 230, 230] } },
      { content: 'SELASA', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [230, 230, 230] } },
      { content: 'RABU', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [230, 230, 230] } },
      { content: 'KAMIS', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [230, 230, 230] } },
      { content: 'JUMAT', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [230, 230, 230] } },
    ],
    // JADWAL HARIAN CONTENT (PENYAMBUTAN)
    [
      { content: getDayData('Senin', 'penyambutan'), styles: { halign: 'center' as const, fontStyle: 'italic' as const } },
      { content: getDayData('Selasa', 'penyambutan'), styles: { halign: 'center' as const, fontStyle: 'italic' as const } },
      { content: getDayData('Rabu', 'penyambutan'), styles: { halign: 'center' as const, fontStyle: 'italic' as const } },
      { content: getDayData('Kamis', 'penyambutan'), styles: { halign: 'center' as const, fontStyle: 'italic' as const } },
      { content: getDayData('Jumat', 'penyambutan'), styles: { halign: 'center' as const, fontStyle: 'italic' as const } },
    ],
    // PEMBUKAAN & MEMAHAMI
    [
      {
        colSpan: 5,
        content: [
          '•  Pembukaaan:',
          ...data.pengalamanBelajar.pembukaan.map((p) => `       -  ${p}`),
          '\n•  Memahami:',
          ...data.pengalamanBelajar.memahami.map((m, i) => `       ${i + 1}. ${m}`),
        ].join('\n'),
      },
    ],
    // KEGIATAN INTI HEADER
    [
      { content: 'SENIN', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 200, 150] } },
      { content: 'SELASA', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 200, 150] } },
      { content: 'RABU', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 200, 150] } },
      { content: 'KAMIS', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 200, 150] } },
      { content: 'JUMAT', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 200, 150] } },
    ],
    // KEGIATAN INTI CONTENT
    [
      { content: getDayData('Senin', 'kegiatan') },
      { content: getDayData('Selasa', 'kegiatan') },
      { content: getDayData('Rabu', 'kegiatan') },
      { content: getDayData('Kamis', 'kegiatan') },
      { content: getDayData('Jumat', 'kegiatan') },
    ],
    // MENGAPLIKASI & MEREFLEKSI & PENUTUP
    [
      {
        colSpan: 5,
        content: [
          '•  Mengaplikasi:',
          ...data.pengalamanBelajar.mengaplikasi.map((a) => `       -  ${a}`),
          '\n•  Merefleksi:',
          ...data.pengalamanBelajar.merefleksi.map((r) => `       -  ${r}`),
          '\n•  Penutup:',
          `   ${data.pengalamanBelajar.penutup}`,
        ].join('\n'),
      },
    ],
    // ASESMEN PEMBELAJARAN
    [
      { content: 'ASESMEN\nPEMBELAJARAN', styles: { fontStyle: 'bold' as const, valign: 'middle' as const } },
      { colSpan: 5, content: data.asesmenPembelajaran },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 48 },
      2: { cellWidth: 48 },
      3: { cellWidth: 48 },
      4: { cellWidth: 48 },
      5: { cellWidth: 48 },
    },
    margin: { top: 15, bottom: 20 },
    didDrawCell: (dataHook) => {
      if (dataHook.section === 'body' && dataHook.row.index === 0 && dataHook.column.index === 1) {
        const { doc, cell } = dataHook;
        const labels = [
          'Tema', 'Sub Tema', 'Usia', 'Minggu/ Semester', 'Alokasi waktu', 'Hari, Tanggal'
        ];
        const values = [
          data.informasiUmum.tema,
          data.informasiUmum.subTema,
          data.informasiUmum.usia,
          data.informasiUmum.mingguSemester,
          data.informasiUmum.alokasiWaktu,
          data.informasiUmum.hariTanggal
        ];

        const startX = cell.x + 2;
        const startY = cell.y + 3; // Initial Y offset
        const step = 3.5; // Line height spacing

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');

        labels.forEach((label, i) => {
          const y = startY + (i * step);
          doc.text(label, startX, y);
          doc.text(':', startX + 28, y);
          doc.text(values[i], startX + 30, y);
        });
      }
    },
  });

  // Signatures
  let finalY = (doc as any).lastAutoTable.finalY + 10;
  const pageHeight = doc.internal.pageSize.height;
  const requiredSpace = 40; // Space needed for signatures

  if (finalY + requiredSpace > pageHeight) {
    doc.addPage();
    finalY = 20; // Start at top of new page
  }

  doc.setFontSize(10);
  doc.text('Mengetahui', 60, finalY, { align: 'center' });
  doc.text('Kepala Sekolah', 60, finalY + 5, { align: 'center' });
  doc.text(data.principalName || 'KUNLISTYANI, S.Pd', 60, finalY + 30, { align: 'center' });

  doc.text('Guru Kelas B', 230, finalY + 5, { align: 'center' });
  doc.text(data.teacherName || 'NABILA ANIN SAU\'DAH', 230, finalY + 30, { align: 'center' });

  doc.save(`PPM_${data.informasiUmum.tema.replace(/\s+/g, '_')}.pdf`);
};
