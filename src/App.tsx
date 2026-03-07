import React, { useState } from 'react';
import Home from './components/Home';
import PPMGenerator from './components/PPMGenerator';
import AnekdotGenerator from './components/AnekdotGenerator';
import CeklisGenerator from './components/CeklisGenerator';
import HasilKaryaGenerator from './components/HasilKaryaGenerator';
import FotoBerseriGenerator from './components/FotoBerseriGenerator';
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
      {currentPage === 'anekdot' && ppmData && (
        <AnekdotGenerator 
          onBack={() => navigateTo('home')} 
          ppmData={ppmData}
        />
      )}
      {currentPage === 'ceklist' && ppmData && (
        <CeklisGenerator 
          onBack={() => navigateTo('home')} 
          ppmData={ppmData}
        />
      )}
      {currentPage === 'hasilkarya' && ppmData && (
        <HasilKaryaGenerator 
          onBack={() => navigateTo('home')} 
          ppmData={ppmData}
        />
      )}
      {currentPage === 'foto-berseri' && ppmData && (
        <FotoBerseriGenerator 
          onBack={() => navigateTo('home')} 
          ppmData={ppmData}
        />
      )}
    </>
  );
}
