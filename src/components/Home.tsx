import React from 'react';
import { Sparkles, BookOpen, CheckSquare, Palette, Image, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (page: string) => void;
  hasPPMData: boolean;
}

export default function Home({ onNavigate, hasPPMData }: HomeProps) {
  const menuItems = [
    {
      id: 'ppm',
      title: 'PPM Generator',
      description: 'Buat Perencanaan Pembelajaran Mendalam otomatis dengan AI.',
      icon: <Sparkles size={32} className="text-emerald-600" />,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      textColor: 'text-emerald-900',
      active: true
    },
    {
      id: 'anekdot',
      title: 'Catatan Anekdot',
      description: 'Rekam kejadian bermakna dalam perkembangan anak.',
      icon: <BookOpen size={32} className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-blue-900',
      active: hasPPMData
    },
    {
      id: 'ceklist',
      title: 'Ceklist',
      description: 'Pantau indikator perkembangan anak secara terstruktur.',
      icon: <CheckSquare size={32} className="text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      textColor: 'text-purple-900',
      active: hasPPMData
    },
    {
      id: 'hasilkarya',
      title: 'Hasil Karya',
      description: 'Dokumentasikan dan analisis hasil karya anak.',
      icon: <Palette size={32} className="text-orange-600" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      textColor: 'text-orange-900',
      active: hasPPMData
    },
    {
      id: 'foto-berseri',
      title: 'Foto Berseri',
      description: 'Rangkaian foto kegiatan anak dengan deskripsi.',
      icon: <Image size={32} className="text-rose-600" />,
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-200',
      textColor: 'text-rose-900',
      active: hasPPMData
    }
  ];

  return (
    <div className="min-h-screen bg-sky-50 text-[#1A1A1A] font-sans p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="max-w-5xl w-full">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            Sistem Manajemen Pembelajaran
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">
            Beranda <span className="italic">Guru</span>
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto text-lg">
            Pusat alat bantu administrasi dan pembelajaran untuk guru PAUD/TK yang modern dan efisien.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => item.active && onNavigate(item.id)}
              disabled={!item.active}
              className={`text-left p-6 rounded-3xl border transition-all duration-300 group relative overflow-hidden ${
                item.active 
                  ? `${item.color} cursor-pointer shadow-lg shadow-stone-200/50 hover:shadow-xl hover:-translate-y-1` 
                  : 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed grayscale-[0.5]'
              }`}
            >
              <div className="mb-4 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${item.textColor}`}>
                {item.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {item.description}
              </p>
              
              {item.active ? (
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  Buka Menu <ArrowRight size={16} />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-200/50 px-3 py-1 rounded-full w-fit">
                  Segera Hadir
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <footer className="mt-16 text-center text-stone-400 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 Education Platform • Versi 1.0.0
        </footer>
      </div>
    </div>
  );
}
