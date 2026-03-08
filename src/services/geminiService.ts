import OpenAI from "openai";

let clientInstance: OpenAI | null = null;

function getClient() {
  if (!clientInstance) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GitHub Token is missing. Please set GITHUB_TOKEN in your environment variables.");
    }
    clientInstance = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: token,
      dangerouslyAllowBrowser: true
    });
  }
  return clientInstance;
}

export async function askAI(prompt: string, systemInstruction: string = "You are a helpful assistant.", jsonMode: boolean = false) {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt }
    ],
    response_format: jsonMode ? { type: "json_object" } : undefined,
    temperature: 0.7,
  });

  return response.choices[0].message.content || "";
}

export async function generatePPM(prompt: string) {
  const systemInstruction = `Buatkan Perencanaan Pembelajaran Mendalam (PPM) untuk TK/PAUD. 
    Gunakan bahasa Indonesia yang formal dan edukatif. 
    Pastikan isinya lengkap dan mendalam sesuai dengan kurikulum merdeka PAUD.
    
    PENTING:
    - Pada bagian 'jadwalHarian', kolom 'kegiatanPenyambutan' JANGAN diisi dengan jam/waktu (seperti 07.30 - 08.00).
    - Isi 'kegiatanPenyambutan' dengan deskripsi singkat bagaimana guru menyambut anak (contoh: "Penyambutan dengan senyum dan sapa", "Menyambut anak dengan ceria", dll).
    
    Output HARUS dalam format JSON sesuai skema berikut:
    {
      "informasiUmum": { "tema": "", "subTema": "", "usia": "", "mingguSemester": "", "alokasiWaktu": "", "hariTanggal": "" },
      "asesmenAwal": { "deskripsi": "", "poinPoin": [], "instrumen": [] },
      "identifikasi": { "dimensiProfilLulusan": [] },
      "desainPembelajaran": { "tujuanPembelajaran": [], "praktikPedagogis": [], "kemitraan": { "orangTua": [], "lingkunganSekolah": [], "lingkunganPembelajaran": [] }, "pemanfaatanDigital": [] },
      "pengalamanBelajar": { "penyambutan": "", "jadwalHarian": [{ "hari": "", "kegiatanPenyambutan": "", "kegiatan": "" }], "pembukaan": [], "memahami": [], "kegiatanInti": [{ "hari": "", "kegiatan": [] }], "mengaplikasi": [], "merefleksi": [], "penutup": "" },
      "asesmenPembelajaran": ""
    }`;

  const result = await askAI(`Tema/topik: ${prompt}`, systemInstruction, true);
  return JSON.parse(result);
}
