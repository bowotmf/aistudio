
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LessonPlanData } from '../types';
import { parseTextIntoList } from './textUtils';

// Extend the jsPDF type to include the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Styling Constants
const FONT_FAMILY = 'Times-Roman';
const FONT_NORMAL = 'normal';
const FONT_BOLD = 'bold';
const FONT_ITALIC = 'italic';

const FONT_SIZE_LARGE_HEADER = 16;
const FONT_SIZE_SMALL_HEADER = 10;
const FONT_SIZE_MAIN_HEADING = 12;
const FONT_SIZE_SECTION_HEADING = 11;
const FONT_SIZE_BODY = 11;

const LINE_HEIGHT_MULTIPLIER = 1.5;
const SECTION_SPACING = 22; // Increased space before main sections
const ITEM_SPACING = 15; // Increased space between items
const HEADING_BOTTOM_MARGIN = 14; // Increased spacing between title and content

// Function to convert hex color to RGB array
function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
}

export const generatePdf = async (data: LessonPlanData, themeColor: string): Promise<void> => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
    });

    // A4 size: 595.28 x 841.89 points
    // Margins in points (1 cm = 28.35 pt)
    const margins = {
        top: 2 * 28.35,
        right: 2 * 28.35,
        bottom: 2 * 28.35,
        left: 2.5 * 28.35,
    };
    const pageContentWidth = doc.internal.pageSize.getWidth() - margins.left - margins.right;
    let cursorY = margins.top;

    const checkPageBreak = (heightNeeded: number) => {
        if (cursorY + heightNeeded > doc.internal.pageSize.getHeight() - margins.bottom) {
            doc.addPage();
            cursorY = margins.top;
        }
    };

    // Set Font
    doc.setFont(FONT_FAMILY, FONT_NORMAL);

    // 1. Main Header
    const headerHeight = 40;
    checkPageBreak(headerHeight);
    doc.setFillColor(...hexToRgb(themeColor));
    doc.rect(0, cursorY, doc.internal.pageSize.getWidth(), headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(FONT_SIZE_LARGE_HEADER);
    doc.setFont(FONT_FAMILY, FONT_BOLD);
    doc.text("PERENCANAAN PEMBELAJARAN", doc.internal.pageSize.getWidth() / 2, cursorY + 20, { align: 'center' });
    doc.setFontSize(FONT_SIZE_SMALL_HEADER);
    doc.setFont(FONT_FAMILY, FONT_ITALIC);
    doc.text("(Pendekatan Pembelajaran Mendalam)", doc.internal.pageSize.getWidth() / 2, cursorY + 32, { align: 'center' });
    cursorY += headerHeight + 20;

    // Reset styles
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(FONT_SIZE_BODY);
    doc.setFont(FONT_FAMILY, FONT_NORMAL);
    
    // Function to render a section
    const renderSection = (title: string, content: string | string[], isMainHeading: boolean = false) => {
        if (!content && !isMainHeading) return;

        const titleFontSize = isMainHeading ? FONT_SIZE_MAIN_HEADING : FONT_SIZE_SECTION_HEADING;
        const titleStyle = FONT_BOLD;

        cursorY += isMainHeading ? SECTION_SPACING : ITEM_SPACING;
        checkPageBreak(titleFontSize + HEADING_BOTTOM_MARGIN);
        
        doc.setFontSize(titleFontSize);
        doc.setFont(FONT_FAMILY, titleStyle);

        if (isMainHeading) {
            doc.setFillColor(243, 244, 246); // gray-100
            doc.rect(margins.left, cursorY - titleFontSize, pageContentWidth, titleFontSize + 4, 'F');
        }
        doc.text(title, margins.left, cursorY);
        cursorY += HEADING_BOTTOM_MARGIN;

        if (content) {
            doc.setFontSize(FONT_SIZE_BODY);
            doc.setFont(FONT_FAMILY, FONT_NORMAL);
            
            const text = Array.isArray(content) ? content.join(', ') : content;
            const listItems = parseTextIntoList(text);
            
            if (listItems.length > 1) { // It's a list
                listItems.forEach(item => {
                    const itemNumberText = `${item.number}.`;
                    const indent = 20;
                    const contentWidth = pageContentWidth - indent;
                    const lines = doc.splitTextToSize(item.content, contentWidth);
                    const blockHeight = lines.length * FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER;
                    
                    checkPageBreak(blockHeight + 4);
                    doc.text(itemNumberText, margins.left, cursorY);
                    doc.text(lines, margins.left + indent, cursorY, { align: 'left', lineHeightFactor: LINE_HEIGHT_MULTIPLIER, maxWidth: contentWidth });
                    cursorY += blockHeight + 4; // Add a bit of space after list item
                });
            } else { // It's a paragraph
                const lines = doc.splitTextToSize(text, pageContentWidth);
                const blockHeight = lines.length * FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER;
                checkPageBreak(blockHeight);
                doc.text(lines, margins.left, cursorY, { align: 'left', lineHeightFactor: LINE_HEIGHT_MULTIPLIER, maxWidth: pageContentWidth });
                cursorY += blockHeight;
            }
        }
    };
    
    // 2. Identity Table
    renderSection('Identitas Umum Perencanaan', '', true);
    autoTable(doc, {
        body: [
            { label: "Nama Sekolah", value: data.schoolName },
            { label: "Nama Guru", value: data.teacherName },
            { label: "Mapel", value: data.subject },
            { label: "Fase/Kelas/Smt", value: data.phaseClass },
            { label: "Alokasi Waktu", value: data.timeAllocation },
            { label: "Tahun Pelajaran", value: data.schoolYear },
        ],
        columns: [ { header: 'Label', dataKey: 'label' }, { header: 'Value', dataKey: 'value' } ],
        startY: cursorY,
        theme: 'grid',
        margin: { left: margins.left, right: margins.right },
        styles: { font: FONT_FAMILY, fontSize: FONT_SIZE_BODY, lineColor: [200, 200, 200], lineWidth: 0.5 },
        showHead: false,
        columnStyles: { 
            label: { fontStyle: FONT_BOLD, cellWidth: pageContentWidth * 0.3, fillColor: [250, 250, 250] },
            value: { cellWidth: pageContentWidth * 0.7 }
        },
        didDrawPage: (hookData) => {
            cursorY = hookData.cursor?.y || cursorY;
        }
    });
    cursorY = (doc as any).lastAutoTable.finalY || cursorY;

    // 3. Content Sections
    renderSection('1. Identifikasi', '', true);
    renderSection("Peserta Didik", data.studentProfile);
    renderSection("Materi Pelajaran", data.subjectMatter);
    renderSection("Dimensi Profil Lulusan", data.graduateProfileDimensions);

    renderSection("2. Desain Pembelajaran", "", true);
    renderSection("Capaian Pembelajaran", data.learningOutcomes);
    renderSection("Lintas Disiplin Ilmu", data.crossDiscipline);
    renderSection("Tujuan Pembelajaran", data.learningObjectives);
    renderSection("Topik Pembelajaran", data.learningTopic);
    renderSection("Praktek pedagogis", data.pedagogicalPractices);
    renderSection("Kemitraan Pembelajaran", data.learningPartnership);
    renderSection("Lingkungan Pembelajaran", data.learningEnvironment);
    renderSection("Pemanfaatan digital", data.digitalUtilization);

    renderSection("3. Pengalaman Belajar", "", true);
    checkPageBreak(20);
    cursorY += ITEM_SPACING / 2;
    doc.setFont(FONT_FAMILY, FONT_ITALIC);
    doc.setFontSize(FONT_SIZE_BODY);
    const mindfulText = "A. Langkah-langkah pembelajaran (Kegiatan pembelajaran berbasis mindful, meaningful, dan joyful)";
    const mindfulLines = doc.splitTextToSize(mindfulText, pageContentWidth);
    doc.text(mindfulLines, margins.left, cursorY, { lineHeightFactor: LINE_HEIGHT_MULTIPLIER, maxWidth: pageContentWidth });
    cursorY += mindfulLines.length * FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER;
    doc.setFont(FONT_FAMILY, FONT_NORMAL);
    
    renderSection("Kegiatan Awal", data.initialActivities);
    renderSection("Kegiatan Inti", data.coreActivities);
    renderSection("Kegiatan Penutup", data.closingActivities);

    renderSection("4. Asesmen Pembelajaran: Pembelajaran", "", true);
    renderSection("Asesmen Awal Pembelajaran", data.initialAssessment);
    renderSection("Asesmen Proses Pembelajaran", data.processAssessment);
    renderSection("Asesmen Akhir Pembelajaran", data.finalAssessment);

    renderSection("5. Lampiran", "", true);
    renderSection("Lembar Kerja Peserta Didik (LKPD)", data.studentWorksheet);
    
    // 5. Signature Block
    const signatureHeight = 120;
    checkPageBreak(signatureHeight + 40);
    cursorY += 40; // Space before signatures

    const drawSignature = (isPrincipal: boolean, x: number, y: number) => {
        const name = isPrincipal ? data.principalName : data.teacherName;
        const nip = isPrincipal ? data.principalNip : data.teacherNip;
        const title1 = isPrincipal ? 'Mengetahui,' : data.signatureDate;
        const title2 = isPrincipal ? 'Kepala Sekolah,' : 'Guru,';
        const signatureGap = 60;
        const columnWidth = pageContentWidth / 2 - 20; // Column width with some padding

        doc.setFontSize(FONT_SIZE_BODY);
        doc.setFont(FONT_FAMILY, FONT_NORMAL);
        let currentY = y;

        // Titles
        const wrappedTitle1 = doc.splitTextToSize(title1, columnWidth);
        doc.text(wrappedTitle1, x, currentY, { align: 'center', lineHeightFactor: LINE_HEIGHT_MULTIPLIER });
        currentY += wrappedTitle1.length * FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER;
        
        const wrappedTitle2 = doc.splitTextToSize(title2, columnWidth);
        doc.text(wrappedTitle2, x, currentY, { align: 'center', lineHeightFactor: LINE_HEIGHT_MULTIPLIER });
        currentY += signatureGap;

        // Name
        doc.setFont(FONT_FAMILY, FONT_BOLD);
        const wrappedName = doc.splitTextToSize(name, columnWidth);
        doc.text(wrappedName, x, currentY, { align: 'center', lineHeightFactor: LINE_HEIGHT_MULTIPLIER });
        
        const nameBlockHeight = (wrappedName.length - 1) * FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER;
        const nameBottomY = currentY + nameBlockHeight;

        // Underline
        const longestNameLine = wrappedName.reduce((a, b) => (doc.getStringUnitWidth(a) > doc.getStringUnitWidth(b) ? a : b), '');
        const nameWidth = doc.getStringUnitWidth(longestNameLine) * doc.getFontSize() / doc.internal.scaleFactor;
        doc.setLineWidth(0.5);
        doc.line(x - nameWidth / 2, nameBottomY + 2, x + nameWidth / 2, nameBottomY + 2);
        
        currentY = nameBottomY + 2 + (FONT_SIZE_BODY * LINE_HEIGHT_MULTIPLIER);
        
        // NIP
        doc.setFont(FONT_FAMILY, FONT_NORMAL);
        const nipText = `NIP. ${nip}`;
        const wrappedNip = doc.splitTextToSize(nipText, columnWidth);
        doc.text(wrappedNip, x, currentY, { align: 'center', lineHeightFactor: LINE_HEIGHT_MULTIPLIER });
    };

    const col1X = margins.left + (pageContentWidth / 4);
    const col2X = margins.left + (pageContentWidth * 3 / 4);

    drawSignature(true, col1X, cursorY);
    drawSignature(false, col2X, cursorY);

    doc.save('Perencanaan_Pembelajaran.pdf');
};