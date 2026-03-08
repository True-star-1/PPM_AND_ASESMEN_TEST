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

function cleanJson(text: string) {
  try {
    // Remove markdown code blocks if present
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/);
    let cleaned = jsonMatch ? jsonMatch[1] : text;
    
    // If no markdown blocks, try to find the first { and last }
    if (!jsonMatch) {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
    }
    
    return cleaned.trim();
  } catch (e) {
    return text;
  }
}

export async function askAI(prompt: string, systemInstruction: string = "You are a helpful assistant.", jsonMode: boolean = false) {
  try {
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
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.status === 401) {
      throw new Error("Token GitHub tidak valid atau telah kedaluwarsa.");
    }
    if (error.status === 404) {
      throw new Error("Model tidak ditemukan atau token tidak memiliki akses ke model ini.");
    }
    throw error;
  }
}

export async function generatePPM(prompt: string) {
  const systemInstruction = `Buatkan Perencanaan Pembelajaran Mendalam (PPM) untuk TK/PAUD. 
    Gunakan bahasa Indonesia yang formal dan edukatif. 
    Pastikan isinya lengkap dan mendalam sesuai dengan kurikulum merdeka PAUD.
    
    PENTING:
    - Pada bagian 'jadwalHarian', kolom 'kegiatanPenyambutan' JANGAN diisi dengan jam/waktu (seperti 07.30 - 08.00).
    - Isi 'kegiatanPenyambutan' dengan deskripsi singkat bagaimana guru menyambut anak (contoh: "Penyambutan dengan senyum dan sapa", "Menyambut anak dengan ceria", dll).
    
    Output HARUS dalam format JSON valid.
    Skema JSON:
    {
      "informasiUmum": { "tema": "", "subTema": "", "usia": "", "mingguSemester": "", "alokasiWaktu": "", "hariTanggal": "" },
      "asesmenAwal": { "deskripsi": "", "poinPoin": [], "instrumen": [] },
      "identifikasi": { "dimensiProfilLulusan": [] },
      "desainPembelajaran": { "tujuanPembelajaran": [], "praktikPedagogis": [], "kemitraan": { "orangTua": [], "lingkunganSekolah": [], "lingkunganPembelajaran": [] }, "pemanfaatanDigital": [] },
      "pengalamanBelajar": { "penyambutan": "", "jadwalHarian": [{ "hari": "", "kegiatanPenyambutan": "", "kegiatan": "" }], "pembukaan": [], "memahami": [], "kegiatanInti": [{ "hari": "", "kegiatan": [] }], "mengaplikasi": [], "merefleksi": [], "penutup": "" },
      "asesmenPembelajaran": ""
    }`;

  const result = await askAI(`Tema/topik: ${prompt}. Berikan output dalam format JSON sesuai skema.`, systemInstruction, true);
  const cleaned = cleanJson(result);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", cleaned);
    throw new Error("Gagal memproses respons AI. Silakan coba lagi.");
  }
}
