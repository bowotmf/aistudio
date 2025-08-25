
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, convertInchesToTwip, ShadingType } from 'docx';
import saveAs from 'file-saver';
import { LessonPlanData } from '../types';
import { parseTextIntoList } from './textUtils';

// Helper to create a paragraph with a specific style
const createParagraph = (text: string, options: any = {}) => new Paragraph({ ...options, children: [new TextRun({ text, font: "Times New Roman", size: 24 })], style: "Normal" });

// Helper to create a paragraph with multi-line text, preserving line breaks
const createMultiLineParagraph = (text: string, options: any = {}) => {
    const lines = text.split('\n');
    return new Paragraph({
        ...options,
        children: lines.flatMap((line, index) => [
            new TextRun({ text: line, font: "Times New Roman", size: 24 }),
            ...(index < lines.length - 1 ? [new TextRun({ break: 1 })] : []),
        ]),
        style: "Normal",
        alignment: AlignmentType.LEFT,
    });
};

const createMainHeadingPara = (text: string) => new Paragraph({
    text,
    style: "Heading3",
    shading: {
        type: ShadingType.CLEAR,
        fill: "F3F4F6", // Tailwind's gray-100
    }
});

// Helper to create a section with a bold heading and a normal paragraph or a list
const createSection = (heading: string, content: string, numberingRef: string) => {
    if (!content) return [];

    const listItems = parseTextIntoList(content);
    
    const headingParagraph = new Paragraph({
        children: [new TextRun({ text: heading, bold: true, font: "Times New Roman", size: 24 })], 
        spacing: { before: 200, after: 100 },
    });

    if (listItems.length > 1) { // If it's a list
        const listParagraphs = listItems.map(item => new Paragraph({
            // By manually prepending the number, we ensure each section's list is independent
            // and exactly matches the numbering from the AI-generated text.
            text: `${item.number}. ${item.content}`,
            style: "Normal",
            alignment: AlignmentType.LEFT,
            // Manually apply indentation to simulate a list format
            indent: {
                left: convertInchesToTwip(0.5),
                hanging: convertInchesToTwip(0.25),
            },
        }));
        return [headingParagraph, ...listParagraphs];
    }

    // If it's not a list, just a paragraph
    return [headingParagraph, createMultiLineParagraph(content)];
};

const createIdentityTableRow = (label: string, value: string) => {
    return new TableRow({
        children: [
            new TableCell({
                children: [createParagraph(label)],
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: "FAFAFA" },
                 borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" } },
            }),
            new TableCell({
                children: [createParagraph(value)],
                width: { size: 70, type: WidthType.PERCENTAGE },
                 borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" }, right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" } },
            }),
        ],
    });
};

export const generateDocument = async (data: LessonPlanData): Promise<void> => {
    // Margin conversion: 1 inch = 72 points = 1440 TWIPs. 1 cm = 567 TWIPs.
    const margins = {
        top: 2 * 567, // 2cm
        right: 2 * 567, // 2cm
        bottom: 2 * 567, // 2cm
        left: 2.5 * 567, // 2.5cm
    };

    const doc = new Document({
        styles: {
            paragraphStyles: [
                { id: "Normal", name: "Normal", run: { size: 24, font: "Times New Roman", color: "000000" } }, // 12pt
                { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 32, bold: true, color: "000000" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } } },
                { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { size: 24, color: "000000", italics: true }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } } },
                { id: "Heading3", name: "Heading 3", basedOn: "Normal", run: { size: 24, bold: true }, paragraph: { spacing: { before: 300, after: 150 } } },
            ],
        },
        numbering: {
            config: [{
                reference: "default-numbering",
                levels: [{
                    level: 0,
                    format: "decimal",
                    text: "%1.",
                    alignment: AlignmentType.START,
                    style: {
                        paragraph: {
                            indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                        },
                    },
                }],
            }],
        },
        sections: [{
            properties: {
                page: {
                    margin: margins,
                }
            },
            children: [
                new Paragraph({ text: "PERENCANAAN PEMBELAJARAN", style: "Heading1" }),
                new Paragraph({ text: "(Pendekatan Pembelajaran Mendalam)", style: "Heading2" }),
                new Paragraph({ text: "" }),
                createMainHeadingPara("Identitas Umum Perencanaan"),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        createIdentityTableRow("Nama Sekolah", data.schoolName),
                        createIdentityTableRow("Nama Guru", data.teacherName),
                        createIdentityTableRow("Mapel", data.subject),
                        createIdentityTableRow("Fase/Kelas/Smt", data.phaseClass),
                        createIdentityTableRow("Alokasi Waktu", data.timeAllocation),
                        createIdentityTableRow("Tahun Pelajaran", data.schoolYear),
                    ],
                }),
                new Paragraph({ text: "" }),
                
                // Content Sections
                createMainHeadingPara("1. Identifikasi"),
                ...createSection("Peserta Didik", data.studentProfile, "default-numbering"),
                ...createSection("Materi Pelajaran", data.subjectMatter, "default-numbering"),
                ...createSection("Dimensi Profil Lulusan", data.graduateProfileDimensions.join(', '), "default-numbering"),
                new Paragraph({ text: "" }),
                
                createMainHeadingPara("2. Desain Pembelajaran"),
                ...createSection("Capaian Pembelajaran", data.learningOutcomes, "default-numbering"),
                ...createSection("Lintas Disiplin Ilmu", data.crossDiscipline, "default-numbering"),
                ...createSection("Tujuan Pembelajaran", data.learningObjectives, "default-numbering"),
                ...createSection("Topik Pembelajaran", data.learningTopic, "default-numbering"),
                ...createSection("Praktek pedagogis", data.pedagogicalPractices, "default-numbering"),
                ...createSection("Kemitraan Pembelajaran", data.learningPartnership, "default-numbering"),
                ...createSection("Lingkungan Pembelajaran", data.learningEnvironment, "default-numbering"),
                ...createSection("Pemanfaatan digital", data.digitalUtilization, "default-numbering"),
                new Paragraph({ text: "" }),

                createMainHeadingPara("3. Pengalaman Belajar"),
                createMultiLineParagraph("A. Langkah-langkah pembelajaran (Kegiatan pembelajaran berbasis mindful (berkesadaran), meaningful (bermakna), dan joyful (menyenangkan))"),
                ...createSection("Kegiatan Awal", data.initialActivities, "default-numbering"),
                ...createSection("Kegiatan Inti", data.coreActivities, "default-numbering"),
                ...createSection("Kegiatan Penutup", data.closingActivities, "default-numbering"),
                new Paragraph({ text: "" }),

                createMainHeadingPara("4. Asesmen Pembelajaran: Pembelajaran"),
                ...createSection("Asesmen Awal Pembelajaran", data.initialAssessment, "default-numbering"),
                ...createSection("Asesmen Proses Pembelajaran", data.processAssessment, "default-numbering"),
                ...createSection("Asesmen Akhir Pembelajaran", data.finalAssessment, "default-numbering"),

                new Paragraph({ text: "" }),

                createMainHeadingPara("5. Lampiran"),
                ...createSection("Lembar Kerja Peserta Didik (LKPD)", data.studentWorksheet, "default-numbering"),
                
                new Paragraph({ text: "" }), new Paragraph({ text: "" }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        createParagraph("Mengetahui,"),
                                        createParagraph("Kepala Sekolah,"),
                                        new Paragraph(""), new Paragraph(""), new Paragraph(""),
                                        new Paragraph({ children: [new TextRun({ text: data.principalName, bold: true, underline: {}, font: "Times New Roman", size: 24 })] }),
                                        createParagraph(`NIP. ${data.principalNip}`),
                                    ],
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                }),
                                new TableCell({
                                    children: [
                                        createParagraph(data.signatureDate),
                                        createParagraph("Guru,"),
                                        new Paragraph(""), new Paragraph(""), new Paragraph(""),
                                        new Paragraph({ children: [new TextRun({ text: data.teacherName, bold: true, underline: {}, font: "Times New Roman", size: 24 })] }),
                                        createParagraph(`NIP. ${data.teacherNip}`),
                                    ],
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                })
                            ]
                        })
                    ]
                })
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Perencanaan_Pembelajaran.docx");
};