
import React from 'react';
import { LessonPlanData } from '../types';
import EditableSection from './EditableSection';

// A simple component for displaying non-editable text content
const StaticSection: React.FC<{ title: string; content: string | string[] }> = ({ title, content }) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    const text = Array.isArray(content) ? content.join(', ') : content;
    return (
        <div className="mt-4">
            <h4 className="font-bold text-black">{title}</h4>
            <div className="mt-1 text-sm leading-relaxed text-black text-justify">
                {text.split('\n').map((line, index) => <p key={index}>{line}</p>)}
            </div>
        </div>
    );
};


interface PreviewContentProps {
    lessonPlan: LessonPlanData;
    themeColor: string;
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRefineClick: (sectionKey: string, sectionLabel: string) => void;
    onRegenerateClick: (sectionKey: string, sectionLabel: string) => void;
    activeAiSectionKey: string | null;
    lastAiActionKey: string | null;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ lessonPlan, themeColor, onContentChange, onRefineClick, onRegenerateClick, activeAiSectionKey, lastAiActionKey }) => {
    const identityData = [
        { label: "Nama Sekolah", value: lessonPlan.schoolName },
        { label: "Nama Guru", value: lessonPlan.teacherName },
        { label: "Mapel", value: lessonPlan.subject },
        { label: "Fase/Kelas/Smt", value: lessonPlan.phaseClass },
        { label: "Alokasi Waktu", value: lessonPlan.timeAllocation },
        { label: "Tahun Pelajaran", value: lessonPlan.schoolYear }
    ];

    const renderEditableSection = (label: string, key: keyof LessonPlanData) => (
         <EditableSection 
            label={label} 
            name={key} 
            value={lessonPlan[key] as string} 
            onChange={onContentChange}
            onRefineClick={() => onRefineClick(key, label)}
            onRegenerateClick={() => onRegenerateClick(key, label)}
            isProcessing={activeAiSectionKey === key}
            wasJustProcessed={lastAiActionKey === key}
        />
    );

    return (
        <div id="preview-content">
            <div className="p-8 text-center text-white" style={{ backgroundColor: themeColor }}>
                <h2 className="text-2xl font-bold">PERENCANAAN PEMBELAJARAN</h2>
                <p className="text-sm opacity-90">(Pendekatan Pembelajaran Mendalam)</p>
            </div>
            <div className="p-8 text-base text-black">
                <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">Identitas Umum Perencanaan</h3>
                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full border border-collapse border-gray-300 text-sm">
                        <tbody>
                            {identityData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="p-2 border-r border-gray-300 font-semibold bg-gray-50 w-1/4 text-black">{item.label}</td>
                                    <td className="p-2 text-black">{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">1. Identifikasi</h3>
                    {renderEditableSection("Peserta Didik", "studentProfile")}
                    <StaticSection title="Materi Pelajaran" content={lessonPlan.subjectMatter} />
                    {lessonPlan.specificMaterial && <StaticSection title="Tambahan Materi Spesifik" content={lessonPlan.specificMaterial} />}
                    <StaticSection title="Dimensi Profil Lulusan" content={lessonPlan.graduateProfileDimensions} />
                </div>
                
                <div className="mt-6">
                    <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">2. Desain Pembelajaran</h3>
                    {renderEditableSection("Capaian Pembelajaran", "learningOutcomes")}
                    {renderEditableSection("Lintas Disiplin Ilmu", "crossDiscipline")}
                    {renderEditableSection("Tujuan Pembelajaran", "learningObjectives")}
                    {renderEditableSection("Topik Pembelajaran", "learningTopic")}
                    {renderEditableSection("Praktek pedagogis", "pedagogicalPractices")}
                    {renderEditableSection("Kemitraan Pembelajaran", "learningPartnership")}
                    {renderEditableSection("Lingkungan Pembelajaran", "learningEnvironment")}
                    {renderEditableSection("Pemanfaatan digital", "digitalUtilization")}
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">3. Pengalaman Belajar</h3>
                    <p className="text-sm italic text-black mt-2">A. Langkah-langkah pembelajaran (Kegiatan pembelajaran berbasis mindful, meaningful, dan joyful)</p>
                    {renderEditableSection("Kegiatan Awal", "initialActivities")}
                    {renderEditableSection("Kegiatan Inti", "coreActivities")}
                    {renderEditableSection("Kegiatan Penutup", "closingActivities")}
                </div>
                
                <div className="mt-6">
                    <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">4. Asesmen Pembelajaran: Pembelajaran</h3>
                    {renderEditableSection("Asesmen Awal Pembelajaran", "initialAssessment")}
                    {renderEditableSection("Asesmen Proses Pembelajaran", "processAssessment")}
                    {renderEditableSection("Asesmen Akhir Pembelajaran", "finalAssessment")}
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-lg p-2 bg-gray-100 rounded-md">5. Lampiran</h3>
                    {renderEditableSection("Lembar Kerja Peserta Didik (LKPD)", "studentWorksheet")}
                </div>

                 <table className="w-full mt-16 text-sm text-center border-separate" style={{ borderSpacing: '0 1rem' }}>
                    <tbody>
                        <tr>
                            <td className="w-1/2 text-black">
                                <p>Mengetahui,</p>
                                <p>Kepala Sekolah,</p>
                                <div className="h-20"></div>
                                <p className="font-bold underline">{lessonPlan.principalName}</p>
                                <p>NIP. {lessonPlan.principalNip}</p>
                            </td>
                            <td className="w-1/2 text-black">
                                <p>{lessonPlan.signatureDate}</p>
                                <p>Guru,</p>
                                <div className="h-20"></div>
                                <p className="font-bold underline">{lessonPlan.teacherName}</p>
                                <p>NIP. {lessonPlan.teacherNip}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PreviewContent;