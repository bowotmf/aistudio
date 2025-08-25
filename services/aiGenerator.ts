
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlanData } from '../types';

// This file assumes that process.env.API_KEY is available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to sanitize AI-generated text from markdown-like formatting.
const sanitizeAIResponse = (text: string): string => {
  if (typeof text !== 'string') {
    return text;
  }

  // This regex finds list markers (e.g., "1. ", "* ") that are not at the beginning of a line
  // and inserts a newline before them. This corrects lists that are generated inline.
  // The (?<=[^\n]) is a negative lookbehind ensuring we don't add extra newlines.
  const inlineListRegex = /(?<=[^\n])\s*(?=(\d+\.\s|[\*\-]\s))/g;

  return text
    .replace(inlineListRegex, '\n') // Step 1: Fix inline lists.
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/^[\s\t]*[\*\-]\s+/gm, '') // Step 2: Remove bullet points now that they are on their own lines.
    .trim();
};

const GRADUATE_PROFILE_DIMENSIONS = [
    "Keimanan dan ketaqwaan terhadap tuhan yang Maha Esa",
    "Kewargaan",
    "Penalaran Kritis",
    "Kreatifitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi"
];

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    studentProfile: {
      type: Type.STRING,
      description: "Deskripsi singkat profil umum siswa kelas ini, termasuk pengetahuan awal mereka yang relevan dengan mata pelajaran.",
    },
    graduateProfileDimensions: {
      type: Type.ARRAY,
      description: `Pilih 3 atau 4 dimensi yang paling relevan dari daftar ini: ${GRADUATE_PROFILE_DIMENSIONS.join(', ')}.`,
      items: { type: Type.STRING }
    },
    crossDiscipline: {
      type: Type.STRING,
      description: "Sebutkan beberapa disiplin ilmu atau mata pelajaran lain yang relevan dan terkait dengan materi ini.",
    },
     learningObjectives: {
      type: Type.STRING,
      description: "Berdasarkan Capaian Pembelajaran, rumuskan beberapa Tujuan Pembelajaran yang spesifik dan terukur dalam format daftar bernomor. Pisahkan setiap tujuan dengan baris baru (\\n). Contoh: 1. Menjelaskan konsep X.\\n2. Menerapkan konsep Y.",
    },
    learningTopic: {
      type: Type.STRING,
      description: "Judul atau topik utama pembelajaran yang menarik dan singkat, berdasarkan materi pelajaran.",
    },
    pedagogicalPractices: {
      type: Type.STRING,
      description: "Sarankan model, strategi, atau metode pembelajaran yang efektif dan modern yang mendukung **pembelajaran mendalam** (contoh: Project-Based Learning, Inquiry-Based Learning, Flipped Classroom). Jika ada beberapa poin, pisahkan dengan baris baru (\\n).",
    },
    learningPartnership: {
      type: Type.STRING,
      description: "Berikan ide untuk kemitraan pembelajaran, misalnya dengan mengundang praktisi atau menggunakan sumber daya dari komunitas. Jika ada beberapa poin, pisahkan dengan baris baru (\\n).",
    },
    learningEnvironment: {
      type: Type.STRING,
      description: "Jelaskan lingkungan belajar yang ideal yang mengintegrasikan ruang fisik dan virtual untuk mendukung pembelajaran. Jika ada beberapa poin, pisahkan dengan baris baru (\\n).",
    },
    digitalUtilization: {
      type: Type.STRING,
      description: "Sebutkan pemanfaatan teknologi digital spesifik yang dapat digunakan dalam pembelajaran, seperti platform atau simulasi. Jika ada beberapa poin, pisahkan dengan baris baru (\\n).",
    },
    initialActivities: {
      type: Type.STRING,
      description: "Rancang kegiatan awal pembelajaran yang berkesan dan bermakna (apersepsi). Jika ada beberapa langkah, pisahkan dengan baris baru (\\n).",
    },
    coreActivities: {
      type: Type.STRING,
      description: "Rancang kegiatan inti yang berpusat pada siswa dan mendorong **pemahaman mendalam**, bukan hafalan. Sertakan langkah-langkah untuk eksplorasi, aplikasi konsep, dan refleksi kritis. Pisahkan setiap langkah dengan baris baru (\\n).",
    },
    closingActivities: {
      type: Type.STRING,
      description: "Rancang kegiatan penutup yang berkesadaran, seperti refleksi atau umpan balik. Jika ada beberapa langkah, pisahkan dengan baris baru (\\n).",
    },
    initialAssessment: {
      type: Type.STRING,
      description: "Sarankan bentuk asesmen awal (diagnostik) untuk mengukur **pemahaman awal dan potensi miskonsepsi** siswa sebelum pembelajaran. Jika ada beberapa metode, pisahkan dengan baris baru (\\n).",
    },
    processAssessment: {
      type: Type.STRING,
      description: "Sarankan bentuk asesmen proses (formatif) yang dilakukan selama pembelajaran untuk memantau **pemahaman dan proses berpikir siswa**. Jika ada beberapa metode, pisahkan dengan baris baru (\\n).",
    },
    finalAssessment: {
      type: Type.STRING,
      description: "Sarankan bentuk asesmen akhir (sumatif) yang mengukur **pemahaman konseptual dan kemampuan aplikasi**, bukan hanya ingatan fakta. Contoh: studi kasus, proyek, presentasi. Jika ada beberapa metode, pisahkan dengan baris baru (\\n).",
    },
    studentWorksheet: {
      type: Type.STRING,
      description: "Buat Lembar Kerja Peserta Didik (LKPD) yang berisi aktivitas, pertanyaan, atau tugas yang harus dikerjakan siswa. LKPD harus selaras dengan kegiatan inti dan asesmen. Gunakan format yang jelas seperti daftar bernomor untuk instruksi atau pertanyaan.",
    },
  },
  required: [
    "studentProfile", "graduateProfileDimensions", "crossDiscipline", "learningObjectives", "learningTopic",
    "pedagogicalPractices", "learningPartnership", "learningEnvironment", "digitalUtilization",
    "initialActivities", "coreActivities", "closingActivities", "initialAssessment",
    "processAssessment", "finalAssessment", "studentWorksheet"
  ]
};


export const generateLessonPlanDetails = async (manualData: Partial<LessonPlanData>) => {
  const prompt = `
    Anda adalah asisten ahli dalam pembuatan Rencana Pelaksanaan Pembelajaran (RPP) untuk kurikulum di Indonesia, dengan spesialisasi pada **pendekatan pembelajaran mendalam (deep learning)**.
    Berdasarkan informasi inti yang diberikan, tolong hasilkan konten untuk setiap bagian RPP.

    Fokus utama Anda adalah merancang pengalaman belajar yang mendorong pemahaman konseptual, penalaran kritis, dan aplikasi dunia nyata, bukan sekadar hafalan. Pastikan kegiatan yang Anda rancang (terutama di bagian Kegiatan Inti dan Asesmen) mencerminkan prinsip-prinsip ini.

    SANGAT PENTING: Pastikan *semua* konten yang Anda hasilkan (mulai dari profil siswa, kegiatan, hingga asesmen) saling terkait erat dan relevan secara langsung dengan **Materi Pelajaran**, **Capaian Pembelajaran**, dan **Tujuan Pembelajaran** yang diberikan. Jika "Materi Spesifik Tambahan" disediakan, pastikan itu menjadi fokus utama dari kegiatan pembelajaran dan asesmen. Konten harus profesional, modern, dan praktis untuk diterapkan di kelas.
    PENTING: Jangan gunakan format markdown. Untuk daftar, gunakan format bernomor (1., 2., dst.) dan pisahkan setiap item dengan baris baru. Jangan gunakan ** untuk tebal atau * atau - untuk daftar butir.

    Informasi Inti RPP:
    - Mata Pelajaran: ${manualData.subject}
    - Fase/Kelas: ${manualData.phaseClass}
    - Materi Pelajaran: ${manualData.subjectMatter}
    ${manualData.specificMaterial ? `- Materi Spesifik Tambahan (jadikan fokus utama): ${manualData.specificMaterial}` : ''}
    - Capaian Pembelajaran: ${manualData.learningOutcomes}
    ${manualData.learningObjectives ? `- Tujuan Pembelajaran yang sudah ada (gunakan sebagai referensi): ${manualData.learningObjectives}` : ''}
    
    Tolong hasilkan data untuk semua bidang yang diperlukan dalam skema JSON yang disediakan. Jika Tujuan Pembelajaran tidak disediakan, buatlah berdasarkan Capaian Pembelajaran.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const generatedJson = JSON.parse(response.text);

    // Sanitize all string values in the generated object
    for (const key in generatedJson) {
        if (Object.prototype.hasOwnProperty.call(generatedJson, key)) {
            const value = generatedJson[key];
            if (typeof value === 'string') {
                generatedJson[key] = sanitizeAIResponse(value);
            } else if (Array.isArray(value)) {
                // Also sanitize strings within arrays
                generatedJson[key] = value.map(item =>
                    typeof item === 'string' ? sanitizeAIResponse(item) : item
                );
            }
        }
    }
    
    return generatedJson;

  } catch (error) {
    console.error("AI content generation failed:", error);
    throw new Error("Gagal menghasilkan konten RPP dari AI.");
  }
};

export const refineSectionContent = async (sectionLabel: string, currentContent: string, userPrompt: string, fullPlan: LessonPlanData): Promise<string> => {
    const prompt = `
        Anda adalah seorang editor ahli untuk dokumen perencanaan pembelajaran yang berfokus pada **pendekatan pembelajaran mendalam (deep learning)**.
        Tugas Anda adalah menulis ulang teks dari bagian "${sectionLabel}" berdasarkan permintaan pengguna. Pastikan hasil editan Anda memperkuat prinsip pembelajaran mendalam (pemahaman konseptual, penalaran kritis) dan tetap selaras dengan konteks rencana pembelajaran secara keseluruhan.

        Konteks Rencana Pembelajaran:
        - Mata Pelajaran: ${fullPlan.subject}
        - Materi Pelajaran: ${fullPlan.subjectMatter}
        ${fullPlan.specificMaterial ? `- Fokus Materi Spesifik: ${fullPlan.specificMaterial}` : ''}
        - Tujuan Pembelajaran: ${fullPlan.learningObjectives}

        Permintaan Pengguna: "${userPrompt}"

        Teks Asli untuk Ditulis Ulang:
        ---
        ${currentContent}
        ---

        Harap berikan HANYA teks yang telah ditulis ulang untuk bagian "${sectionLabel}". Jangan menambahkan judul, pengantar, atau komentar lainnya.
        PENTING: Jangan gunakan format markdown seperti ** untuk tebal atau * atau - untuk daftar butir.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return sanitizeAIResponse(response.text.trim());
    } catch (error) {
        console.error("AI section refinement failed:", error);
        throw new Error(`Gagal menyempurnakan bagian "${sectionLabel}".`);
    }
};

export const regenerateSectionContent = async (sectionLabel: string, fullPlan: LessonPlanData): Promise<string> => {
    // Create a summarized context from the full plan, excluding the section to be regenerated.
    const contextPrompt = `
        Konteks Rencana Pembelajaran:
        - Mata Pelajaran: ${fullPlan.subject}
        - Materi Pelajaran: ${fullPlan.subjectMatter}
        ${fullPlan.specificMaterial ? `- Fokus Materi Spesifik: ${fullPlan.specificMaterial}` : ''}
        - Capaian Pembelajaran: ${fullPlan.learningOutcomes}
        - Tujuan Pembelajaran: ${fullPlan.learningObjectives}
        - Profil Siswa: ${fullPlan.studentProfile}
    `;

    const prompt = `
        Anda adalah seorang penulis ahli untuk dokumen perencanaan pembelajaran, dengan spesialisasi pada **pendekatan pembelajaran mendalam (deep learning)**.
        Tugas Anda adalah menulis ulang dari awal konten untuk bagian yang berjudul "${sectionLabel}".
        Hasilkan versi baru yang segar dan kreatif yang secara eksplisit menerapkan prinsip-prinsip pembelajaran mendalam (mendorong pemahaman konseptual, penalaran kritis, dan aplikasi nyata). Pastikan hasilnya sangat relevan dengan konteks rencana pembelajaran yang ada.

        Harap berikan HANYA teks baru untuk bagian "${sectionLabel}". Jangan menambahkan judul, pengantar, atau komentar lainnya.
        PENTING: Jangan gunakan format markdown seperti ** untuk tebal atau * atau - untuk daftar butir.

        ${contextPrompt}
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8, // Slightly higher temperature for more creative regeneration
            }
        });
        return sanitizeAIResponse(response.text.trim());
    } catch (error) {
        console.error("AI section regeneration failed:", error);
        throw new Error(`Gagal membuat ulang bagian "${sectionLabel}".`);
    }
};