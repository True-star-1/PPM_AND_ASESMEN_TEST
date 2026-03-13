import React, { useState } from 'react';
import Home from './components/Home';
import PPMGenerator from './components/PPMGenerator';
import AnekdotGenerator from './components/AnekdotGenerator';
import CeklisGenerator from './components/CeklisGenerator';
import HasilKaryaGenerator from './components/HasilKaryaGenerator';
import FotoBerseriGenerator from './components/FotoBerseriGenerator';
import AsesmenMenu from './components/AsesmenMenu';
import { PPMData } from './services/pdfService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [ppmData, setPpmData] = useState<PPMData | null>(null);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const handlePPMGenerated = (data: PPMData) => {
    setPpmData(data);
  };

  const defaultPPMData: PPMData = {
    schoolName: '',
    academicYear: '',
    principalName: '',
    teacherName: '',
    informasiUmum: {
      tema: '',
      subTema: '',
      usia: '',
      mingguSemester: '',
      alokasiWaktu: '',
      hariTanggal: ''
    },
    asesmenAwal: {
      deskripsi: '',
      poinPoin: []
    },
    desainPembelajaran: {
      tujuanPembelajaran: [],
      kegiatanPembelajaran: []
    },
    pengalamanBelajar: {
      kegiatanPembukaan: [],
      kegiatanInti: [],
      kegiatanPenutup: []
    }
  };

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={navigateTo} hasPPMData={!!ppmData} />}
      {currentPage === 'ppm' && (
        <PPMGenerator 
          onBack={() => navigateTo('home')} 
          onGenerate={handlePPMGenerated}
          initialData={ppmData}
        />
      )}
      {currentPage === 'asesmen-menu' && (
        <AsesmenMenu 
          onBack={() => navigateTo('home')}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'anekdot' && (
        <AnekdotGenerator 
          onBack={() => navigateTo('asesmen-menu')} 
          ppmData={ppmData || defaultPPMData}
        />
      )}
      {currentPage === 'ceklist' && (
        <CeklisGenerator 
          onBack={() => navigateTo('asesmen-menu')} 
          ppmData={ppmData || defaultPPMData}
        />
      )}
      {currentPage === 'hasilkarya' && (
        <HasilKaryaGenerator 
          onBack={() => navigateTo('asesmen-menu')} 
          ppmData={ppmData || defaultPPMData}
        />
      )}
      {currentPage === 'foto-berseri' && (
        <FotoBerseriGenerator 
          onBack={() => navigateTo('asesmen-menu')} 
          ppmData={ppmData || defaultPPMData}
        />
      )}
    </>
  );
}
