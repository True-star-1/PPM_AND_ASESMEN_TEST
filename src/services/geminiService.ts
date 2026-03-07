import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const ppmSchema = {
  type: Type.OBJECT,
  properties: {
    informasiUmum: {
      type: Type.OBJECT,
      properties: {
        tema: { type: Type.STRING },
        subTema: { type: Type.STRING },
        usia: { type: Type.STRING },
        mingguSemester: { type: Type.STRING },
        alokasiWaktu: { type: Type.STRING },
        hariTanggal: { type: Type.STRING },
      },
      required: ["tema", "subTema", "usia", "mingguSemester", "alokasiWaktu", "hariTanggal"],
    },
    asesmenAwal: {
      type: Type.OBJECT,
      properties: {
        deskripsi: { type: Type.STRING },
        poinPoin: { type: Type.ARRAY, items: { type: Type.STRING } },
        instrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["deskripsi", "poinPoin", "instrumen"],
    },
    identifikasi: {
      type: Type.OBJECT,
      properties: {
        dimensiProfilLulusan: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["dimensiProfilLulusan"],
    },
    desainPembelajaran: {
      type: Type.OBJECT,
      properties: {
        tujuanPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
        praktikPedagogis: { type: Type.ARRAY, items: { type: Type.STRING } },
        kemitraan: {
          type: Type.OBJECT,
          properties: {
            orangTua: { type: Type.ARRAY, items: { type: Type.STRING } },
            lingkunganSekolah: { type: Type.ARRAY, items: { type: Type.STRING } },
            lingkunganPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["orangTua", "lingkunganSekolah", "lingkunganPembelajaran"],
        },
        pemanfaatanDigital: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["tujuanPembelajaran", "praktikPedagogis", "kemitraan", "pemanfaatanDigital"],
    },
    pengalamanBelajar: {
      type: Type.OBJECT,
      properties: {
        penyambutan: { type: Type.STRING },
        jadwalHarian: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hari: { type: Type.STRING },
              kegiatanPenyambutan: { type: Type.STRING },
              kegiatan: { type: Type.STRING },
            },
            required: ["hari", "kegiatanPenyambutan", "kegiatan"],
          },
        },
        pembukaan: { type: Type.ARRAY, items: { type: Type.STRING } },
        memahami: { type: Type.ARRAY, items: { type: Type.STRING } },
        kegiatanInti: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hari: { type: Type.STRING },
              kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["hari", "kegiatan"],
          },
        },
        mengaplikasi: { type: Type.ARRAY, items: { type: Type.STRING } },
        merefleksi: { type: Type.ARRAY, items: { type: Type.STRING } },
        penutup: { type: Type.STRING },
      },
      required: ["penyambutan", "jadwalHarian", "pembukaan", "memahami", "kegiatanInti", "mengaplikasi", "merefleksi", "penutup"],
    },
    asesmenPembelajaran: { type: Type.STRING },
  },
  required: ["informasiUmum", "asesmenAwal", "identifikasi", "desainPembelajaran", "pengalamanBelajar", "asesmenPembelajaran"],
};

export async function generatePPM(prompt: string) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Buatkan Perencanaan Pembelajaran Mendalam (PPM) untuk TK/PAUD dengan tema/topik: ${prompt}. 
    Gunakan bahasa Indonesia yang formal dan edukatif. 
    Pastikan isinya lengkap dan mendalam sesuai dengan kurikulum merdeka PAUD.
    
    PENTING:
    - Pada bagian 'jadwalHarian', kolom 'kegiatanPenyambutan' JANGAN diisi dengan jam/waktu (seperti 07.30 - 08.00).
    - Isi 'kegiatanPenyambutan' dengan deskripsi singkat bagaimana guru menyambut anak (contoh: "Penyambutan dengan senyum dan sapa", "Menyambut anak dengan ceria", dll).
    
    Struktur harus mengikuti skema JSON yang diberikan.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: ppmSchema,
    },
  });

  return JSON.parse(response.text || "{}");
}
