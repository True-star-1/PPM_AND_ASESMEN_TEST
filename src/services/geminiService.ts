import OpenAI from "openai";

let clientInstances: OpenAI[] = [];
let currentClientIndex = 0;

function getClients() {
  if (clientInstances.length === 0) {
    const tokensString = process.env.GITHUB_TOKENS || "";
    const tokens = tokensString.split(',').map(t => t.trim()).filter(t => t !== "");
    
    if (tokens.length === 0) {
      throw new Error("GitHub Tokens are missing. Please set GITHUB_TOKENS in your environment variables and REFRESH the page.");
    }

    clientInstances = tokens.map(token => new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: token,
      dangerouslyAllowBrowser: true,
      timeout: 30000 // 30 seconds
    }));
  }
  return clientInstances;
}

function getNextClient() {
  const clients = getClients();
  const client = clients[currentClientIndex];
  currentClientIndex = (currentClientIndex + 1) % clients.length;
  return client;
}

export function cleanJson(text: string) {
  try {
    // Remove markdown code blocks if present
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/);
    let cleaned = jsonMatch ? jsonMatch[1] : text;
    
    // If no markdown blocks, try to find the first { or [ and last } or ]
    if (!jsonMatch) {
      const firstBrace = Math.min(
        cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'),
        cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('[')
      );
      const lastBrace = Math.max(
        cleaned.lastIndexOf('}'),
        cleaned.lastIndexOf(']')
      );
      
      if (firstBrace !== Infinity && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
    }
    
    return cleaned.trim();
  } catch (e) {
    return text;
  }
}

export async function askAI(prompt: string, systemInstruction: string = "You are a helpful assistant.", jsonMode: boolean = false) {
  const clients = getClients();
  let lastError: any = null;

  // Try each client at least once if we hit rate limits
  for (let i = 0; i < clients.length; i++) {
    try {
      const client = getNextClient();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        response_format: jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "";
    } catch (error: any) {
      lastError = error;
      console.error(`AI Error with token ${currentClientIndex}:`, error);

      // If it's a rate limit (429), try the next token
      if (error.status === 429) {
        console.warn("Rate limit hit, switching to next token...");
        continue; 
      }

      // For other errors (401, 403, etc.), throw immediately as they likely affect specific tokens
      if (error.status === 401) {
        throw new Error("Salah satu Token GitHub tidak valid atau telah kedaluwarsa. Silakan periksa pengaturan GITHUB_TOKENS.");
      }
      if (error.status === 403) {
        throw new Error("Akses ditolak untuk salah satu token. Pastikan token memiliki izin yang benar.");
      }
      
      throw new Error(error.message || "Terjadi kesalahan pada layanan AI.");
    }
  }

  // If we've exhausted all tokens and still have an error
  if (lastError && lastError.status === 429) {
    throw new Error("Batas penggunaan (Rate Limit) tercapai pada SEMUA kunci GitHub Anda. Silakan tunggu 1-2 menit sebelum mencoba lagi.");
  }
  
  throw new Error("Gagal menghubungi layanan AI setelah mencoba semua kunci.");
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
