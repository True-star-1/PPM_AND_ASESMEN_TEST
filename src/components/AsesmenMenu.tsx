import React from 'react';
import { BookOpen, CheckSquare, Palette, Image, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AsesmenMenuProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function AsesmenMenu({ onBack, onNavigate }: AsesmenMenuProps) {
  const menuItems = [
    {
      id: 'anekdot',
      title: 'Catatan Anekdot',
      description: 'Rekam kejadian bermakna dalam perkembangan anak.',
      icon: <BookOpen size={32} className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      id: 'ceklist',
      title: 'Ceklist',
      description: 'Pantau indikator perkembangan anak secara terstruktur.',
      icon: <CheckSquare size={32} className="text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      textColor: 'text-purple-900',
    },
    {
      id: 'hasilkarya',
      title: 'Hasil Karya',
      description: 'Dokumentasikan dan analisis hasil karya anak.',
      icon: <Palette size={32} className="text-orange-600" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      textColor: 'text-orange-900',
    },
    {
      id: 'foto-berseri',
      title: 'Foto Berseri',
      description: 'Rangkaian foto kegiatan anak dengan deskripsi.',
      icon: <Image size={32} className="text-rose-600" />,
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-200',
      textColor: 'text-rose-900',
    }
  ];

  return (
    <div className="min-h-screen bg-sky-50 text-[#1A1A1A] font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center relative">
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 p-2 rounded-full hover:bg-stone-200 transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={24} className="text-stone-600" />
          </button>
          
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-tight">
            Menu <span className="italic text-blue-600">Asesmen</span>
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            Pilih jenis instrumen penilaian yang ingin Anda gunakan untuk mendokumentasikan perkembangan anak.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.id)}
              className={`text-left p-8 rounded-3xl border transition-all duration-300 group relative overflow-hidden bg-white shadow-lg shadow-stone-200/50 hover:shadow-xl hover:-translate-y-1 border-stone-100`}
            >
              <div className={`mb-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${item.color}`}>
                {item.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${item.textColor}`}>
                {item.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {item.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity">
                Buka Instrumen <ArrowRight size={16} />
              </div>
            </motion.button>
          ))}
        </div>

        <footer className="mt-16 text-center text-stone-400 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 Education Platform • Asesmen Terpadu
        </footer>
      </div>
    </div>
  );
}
