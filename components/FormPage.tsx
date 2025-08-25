import React, { useState, useEffect } from 'react';
import { LessonPlanData } from '../types';
import InputGroup from './InputGroup';
import TextAreaGroup from './TextAreaGroup';

// Icon components
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IdCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm7 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V9h-1a1 1 0 110-2h1V6a1 1 0 011-1zM6 16a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm6 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Informasi Umum", "Detail Pembelajaran", "Tanda Tangan"];
    return (
        <div className="mb-12">
            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    return (
                        <li key={label} className={`flex items-center relative ${isCurrent ? 'text-sky-600' : ''} ${index < steps.length - 1 ? "flex-1 after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:inline-block after:absolute after:left-1/2 after:top-4 after:-z-10" : "flex-initial"}`}>
                             <div className="flex flex-col items-center px-2">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mb-2 transition-colors duration-300 ${isCompleted ? 'bg-sky-600 text-white' : isCurrent ? 'border-2 border-sky-600' : 'border-2 border-gray-300'}`}>
                                    {isCompleted ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : stepNumber}
                                </span>
                                <span className="text-xs sm:text-sm whitespace-nowrap">{label}</span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

const defaultFormData: Partial<LessonPlanData> = {
    schoolName: "SMAN 1 Sumberejo",
    teacherName: "Tri Joko Prabowo, S.Kom",
    teacherNip: "199612202024211010",
    subject: "Informatika",
    phaseClass: "E/X/Ganjil",
    timeAllocation: "2x45 menit",
    schoolYear: "2025/2026",
    subjectMatter: "Berfikir Komputasional",
    learningOutcomes: "peserta didik mampu menerapkan strategi algoritmik standar untuk menghasilkan beberapa solusi persoalan dengan data diskrit bervolume tidak kecil pada kehidupan sehari-hari maupun implementasinya dalam program komputer.",
    specificMaterial: "",
    learningObjectives: "",
    signatureDate: "Sumberejo, 14 Juli 2025",
    principalName: "Desi Mulyawan, S.Pd., M.Pd.",
    principalNip: "197312231998011001"
};

const LOCAL_STORAGE_KEY = 'lessonPlanFormData';

interface FormPageProps {
    onGenerate: (data: Partial<LessonPlanData>) => void;
}

const FormPage: React.FC<FormPageProps> = ({ onGenerate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<LessonPlanData>>(() => {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : defaultFormData;
        } catch (error) {
            console.error("Failed to parse form data from localStorage", error);
            return defaultFormData;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error("Failed to save form data to localStorage", error);
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(formData);
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4">
            <header className="text-center mb-8 sm:mb-12">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Generator RPP Cerdas
                </h1>
                <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                    Dibuat oleh Tri Joko Prabowo, Alat ini tidak untuk diperjual belikan
                </p>
            </header>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <Stepper currentStep={step} />
                        
                        <div style={{ display: step === 1 ? 'block' : 'none' }}>
                             <h2 className="font-display text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Informasi Umum</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup icon={<SchoolIcon />} label="Nama Sekolah" id="schoolName" value={formData.schoolName || ''} onChange={handleChange} required />
                                <InputGroup icon={<UserIcon />} label="Nama Guru" id="teacherName" value={formData.teacherName || ''} onChange={handleChange} required />
                                <InputGroup icon={<IdCardIcon />} label="NIP Guru" id="teacherNip" value={formData.teacherNip || ''} onChange={handleChange} required />
                                <InputGroup icon={<BookIcon />} label="Mata Pelajaran" id="subject" value={formData.subject || ''} onChange={handleChange} required />
                                <InputGroup icon={<BookIcon />} label="Fase/Kelas/Semester" id="phaseClass" value={formData.phaseClass || ''} onChange={handleChange} required />
                                <InputGroup icon={<ClockIcon />} label="Alokasi Waktu" id="timeAllocation" value={formData.timeAllocation || ''} onChange={handleChange} required />
                                <InputGroup icon={<CalendarIcon />} label="Tahun Pelajaran" id="schoolYear" value={formData.schoolYear || ''} onChange={handleChange} required />
                             </div>
                        </div>

                        <div style={{ display: step === 2 ? 'block' : 'none' }}>
                            <h2 className="font-display text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Detail Inti Pembelajaran</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <TextAreaGroup label="Materi Pelajaran" id="subjectMatter" value={formData.subjectMatter || ''} onChange={handleChange} placeholder="Contoh: AI, Big Data, IoT, Cybersecurity" required rows={2} />
                                <TextAreaGroup label="Capaian Pembelajaran" id="learningOutcomes" value={formData.learningOutcomes || ''} onChange={handleChange} rows={4} required placeholder="Isi capaian pembelajaran di sini..." />
                                <TextAreaGroup label="Tambahan Materi Spesifik (Opsional)" id="specificMaterial" value={formData.specificMaterial || ''} onChange={handleChange} placeholder="Contoh: Fokus pada algoritma sorting Bubble Sort dan Merge Sort, jelaskan perbedaan kompleksitasnya." rows={3} />
                                <TextAreaGroup label="Tujuan Pembelajaran (Opsional)" id="learningObjectives" value={formData.learningObjectives || ''} onChange={handleChange} placeholder="Jika kosong, AI akan membuat tujuan berdasarkan capaian pembelajaran" rows={4} />
                            </div>
                        </div>

                        <div style={{ display: step === 3 ? 'block' : 'none' }}>
                           <h2 className="font-display text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Informasi Tanda Tangan</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup icon={<CalendarIcon />} label="Lokasi & Tanggal Tanda Tangan" id="signatureDate" value={formData.signatureDate || ''} onChange={handleChange} placeholder="Contoh: Sumberejo, 14 Juli 2025" required />
                                <InputGroup icon={<UserIcon />} label="Nama Kepala Sekolah" id="principalName" value={formData.principalName || ''} onChange={handleChange} required />
                                <InputGroup icon={<IdCardIcon />} label="NIP Kepala Sekolah" id="principalNip" value={formData.principalNip || ''} onChange={handleChange} required />
                           </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="px-6 py-2 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Sebelumnya
                        </button>

                        {step < 3 && (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-8 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-sky-600 hover:bg-sky-700 transition-all transform hover:scale-105"
                            >
                                Berikutnya
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                <SparklesIcon /> Buat Modul Ajar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPage;