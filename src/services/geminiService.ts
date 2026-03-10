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
      timeout: 60000 // 60 seconds
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

      // If it's a rate limit (429) or a timeout, try the next token
      if (error.status === 429 || error.name === 'APITimeoutError' || error.message?.includes('timed out')) {
        console.warn(`Token ${currentClientIndex} hit ${error.name || 'error'}, switching to next token...`);
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

export async function generatePPM(prompt: string, schoolInfo: any) {
  const systemInstruction = `Pakar PAUD Kurikulum Merdeka. Buat PPM LENGKAP & UNIK.
    
    SYARAT WAJIB:
    1. Tujuan Pembelajaran: 4-5 poin berbeda.
    2. Kegiatan Inti: MINIMAL 4 kegiatan bervariasi per hari. JANGAN ada yang kosong.
    3. Rentang Hari: Sesuai "${schoolInfo.hariTanggal}".
    4. Penyambutan HARUS BERBEDA TIAP HARI dalam 'jadwalHarian': Kalimat panjang, hangat, motivatif, dan UNIK. DILARANG KERAS menggunakan kalimat yang sama untuk hari yang berbeda.
    5. 'kegiatanInti' dalam 'pengalamanBelajar' HARUS berisi minimal 4 kegiatan yang berbeda dan mendalam untuk setiap harinya. JANGAN ada hari yang kegiatannya kosong atau hanya sedikit.
    
    PENTING: Output JSON valid. 'kegiatanPenyambutan' JANGAN isi jam.
    
    Skema JSON:
    {
      "informasiUmum": { "tema": "", "subTema": "", "usia": "", "mingguSemester": "", "alokasiWaktu": "", "hariTanggal": "" },
      "asesmenAwal": { "deskripsi": "", "poinPoin": [], "instrumen": [] },
      "identifikasi": { "dimensiProfilLulusan": [] },
      "desainPembelajaran": { "tujuanPembelajaran": [], "praktikPedagogis": [], "kemitraan": { "orangTua": [], "lingkunganSekolah": [], "lingkunganPembelajaran": [] }, "pemanfaatanDigital": [] },
      "pengalamanBelajar": { 
        "penyambutan": "Deskripsi umum penyambutan", 
        "jadwalHarian": [{ "hari": "Senin", "kegiatanPenyambutan": "Deskripsi UNIK Senin", "kegiatan": "Kegiatan rutin" }], 
        "pembukaan": [], 
        "memahami": [], 
        "kegiatanInti": [{ "hari": "Senin", "kegiatan": ["Kegiatan 1", "Kegiatan 2", "Kegiatan 3", "Kegiatan 4"] }], 
        "mengaplikasi": [], 
        "merefleksi": [], 
        "penutup": "" 
      },
      "asesmenPembelajaran": ""
    }`;

  const result = await askAI(`Tema: ${prompt}. Info: ${JSON.stringify(schoolInfo)}. JSON output.`, systemInstruction, true);
  const cleaned = cleanJson(result);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", cleaned);
    throw new Error("Gagal memproses respons AI. Silakan coba lagi.");
  }
}
