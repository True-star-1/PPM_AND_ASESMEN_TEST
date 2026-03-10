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

  const schoolName = (data.schoolName || 'TK BALEGONDO 1').toUpperCase();
  const academicYear = data.academicYear || '2025/2026';
  const formattedYear = academicYear.toUpperCase().includes('TAHUN PELAJARAN') 
    ? academicYear.toUpperCase() 
    : `TAHUN PELAJARAN ${academicYear.toUpperCase()}`;

  // Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PERENCANAAN PEMBELAJARAN MENDALAM', 148.5, 12, { align: 'center' });
  doc.text(schoolName, 148.5, 18, { align: 'center' });
  doc.text(formattedYear, 148.5, 24, { align: 'center' });

  let currentY = 28;

  const getDayData = (dayName: string, type: 'penyambutan' | 'kegiatan') => {
    const day = data.pengalamanBelajar.jadwalHarian.find(j => j.hari.toLowerCase().includes(dayName.toLowerCase()));
    if (type === 'penyambutan') return day?.kegiatanPenyambutan || '-';
    
    const inti = data.pengalamanBelajar.kegiatanInti.find(k => k.hari.toLowerCase().includes(dayName.toLowerCase()));
    return inti?.kegiatan.map(k => `• ${k}`).join('\n') || '-';
  };

  const tableData: any[] = [
    // INFORMASI UMUM
    [
      { content: 'INFORMASI\nUMUM', styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      {
        colSpan: 5,
        content: '\n\n\n\n\n', // Placeholder
        styles: { valign: 'middle' as const }
      },
    ],
    // ASESMEN AWAL
    [
      { content: 'ASESMEN AWAL', styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      {
        colSpan: 5,
        content: [
          data.asesmenAwal.deskripsi,
          ...data.asesmenAwal.poinPoin.map((p) => ` - ${p}`),
          '• Instrumen asesmen: ' + data.asesmenAwal.instrumen.join(', '),
        ].join('\n'),
      },
    ],
    // IDENTIFIKASI
    [
      { content: 'IDENTIFIKASI', styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      {
        colSpan: 5,
        content: [
          '• Dimensi Profil Lulusan (Profil Pelajar Pancasila Anak Usia Dini):',
          ...data.identifikasi.dimensiProfilLulusan.map((d) => ` - ${d}`),
        ].join('\n'),
      },
    ],
    // DESAIN PEMBELAJARAN
    [
      { content: 'DESAIN\nPEMBELAJARAN', styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      {
        colSpan: 5,
        content: [
          '• Tujuan Pembelajaran: ' + data.desainPembelajaran.tujuanPembelajaran.join('; '),
          '• Praktik Pedagogis: ' + data.desainPembelajaran.praktikPedagogis.join(', '),
          '• Kemitraan: ' + [...data.desainPembelajaran.kemitraan.orangTua, ...data.desainPembelajaran.kemitraan.lingkunganSekolah].join(', '),
          '• Pemanfaatan Digital: ' + data.desainPembelajaran.pemanfaatanDigital.join(', '),
        ].join('\n'),
      },
    ],
    // PENGALAMAN BELAJAR - PENYAMBUTAN
    [
      { content: 'PENGALAMAN\nBELAJAR', rowSpan: 7, styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      {
        colSpan: 5,
        content: 'Penyambutan: ' + data.pengalamanBelajar.penyambutan,
        styles: { fontStyle: 'bold' as const }
      },
    ],
    // JADWAL HARIAN HEADER
    [
      { content: 'SENIN', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [240, 240, 240] } },
      { content: 'SELASA', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [240, 240, 240] } },
      { content: 'RABU', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [240, 240, 240] } },
      { content: 'KAMIS', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [240, 240, 240] } },
      { content: 'JUMAT', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [240, 240, 240] } },
    ],
    // JADWAL HARIAN CONTENT (PENYAMBUTAN)
    [
      { content: getDayData('Senin', 'penyambutan'), styles: { halign: 'left' as const, fontSize: 9 } },
      { content: getDayData('Selasa', 'penyambutan'), styles: { halign: 'left' as const, fontSize: 9 } },
      { content: getDayData('Rabu', 'penyambutan'), styles: { halign: 'left' as const, fontSize: 9 } },
      { content: getDayData('Kamis', 'penyambutan'), styles: { halign: 'left' as const, fontSize: 9 } },
      { content: getDayData('Jumat', 'penyambutan'), styles: { halign: 'left' as const, fontSize: 9 } },
    ],
    // PEMBUKAAN & MEMAHAMI
    [
      {
        colSpan: 5,
        content: [
          '• Pembukaaan: ' + data.pengalamanBelajar.pembukaan.join(', '),
          '• Memahami: ' + data.pengalamanBelajar.memahami.join(', '),
        ].join('\n'),
      },
    ],
    // KEGIATAN INTI HEADER
    [
      { content: 'SENIN', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 220, 180] } },
      { content: 'SELASA', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 220, 180] } },
      { content: 'RABU', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 220, 180] } },
      { content: 'KAMIS', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 220, 180] } },
      { content: 'JUMAT', styles: { fontStyle: 'bold' as const, halign: 'center' as const, fillColor: [255, 220, 180] } },
    ],
    // KEGIATAN INTI CONTENT
    [
      { content: getDayData('Senin', 'kegiatan'), styles: { fontSize: 9 } },
      { content: getDayData('Selasa', 'kegiatan'), styles: { fontSize: 9 } },
      { content: getDayData('Rabu', 'kegiatan'), styles: { fontSize: 9 } },
      { content: getDayData('Kamis', 'kegiatan'), styles: { fontSize: 9 } },
      { content: getDayData('Jumat', 'kegiatan'), styles: { fontSize: 9 } },
    ],
    // MENGAPLIKASI & MEREFLEKSI & PENUTUP
    [
      {
        colSpan: 5,
        content: [
          '• Mengaplikasi: ' + data.pengalamanBelajar.mengaplikasi.join(', '),
          '• Merefleksi: ' + data.pengalamanBelajar.merefleksi.join(', '),
          '• Penutup: ' + data.pengalamanBelajar.penutup,
        ].join('\n'),
      },
    ],
    // ASESMEN PEMBELAJARAN
    [
      { content: 'ASESMEN\nPEMBELAJARAN', styles: { fontStyle: 'bold' as const, valign: 'middle' as const, halign: 'center' as const } },
      { colSpan: 5, content: data.asesmenPembelajaran },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 49 },
      2: { cellWidth: 49 },
      3: { cellWidth: 49 },
      4: { cellWidth: 49 },
      5: { cellWidth: 49 },
    },
    margin: { top: 10, bottom: 15, left: 10, right: 10 },
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
        const startY = cell.y + 4;
        const step = 4;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        labels.forEach((label, i) => {
          const y = startY + (i * step);
          doc.text(label, startX, y);
          doc.text(':', startX + 35, y);
          doc.text(values[i], startX + 37, y);
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

  // Extract "Kelompok A/B" from usia if possible, otherwise default to "Guru Kelas"
  const usiaText = data.informasiUmum.usia || '';
  let guruLabel = 'Guru Kelas';
  if (usiaText.toUpperCase().includes('KELOMPOK A')) guruLabel = 'Guru Kelas A';
  else if (usiaText.toUpperCase().includes('KELOMPOK B')) guruLabel = 'Guru Kelas B';
  else if (usiaText.toUpperCase().includes('KELAS A')) guruLabel = 'Guru Kelas A';
  else if (usiaText.toUpperCase().includes('KELAS B')) guruLabel = 'Guru Kelas B';

  doc.text(guruLabel, 230, finalY + 5, { align: 'center' });
  doc.text(data.teacherName || 'NABILA ANIN SAU\'DAH', 230, finalY + 30, { align: 'center' });

  doc.save(`PPM_${data.informasiUmum.tema.replace(/\s+/g, '_')}.pdf`);
};
