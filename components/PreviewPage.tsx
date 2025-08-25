
import React, { useState, useCallback, useEffect } from 'react';
import { LessonPlanData } from '../types';
import PreviewSidebar from './PreviewSidebar';
import PreviewContent from './PreviewContent';
import { generateDocument } from '../services/docxGenerator';
import { generateHtml } from '../services/htmlGenerator';
import { generatePdf } from '../services/pdfGenerator';
import PreviewLoadingSkeleton from './PreviewLoadingSkeleton';
import RefineModal from './RefineModal';

interface PreviewPageProps {
    lessonPlan: LessonPlanData | null;
    isLoading: boolean;
    error: string | null;
    onStartOver: () => void;
    onLessonPlanChange: (newPlan: LessonPlanData) => void;
    aiActions: {
        refine: (sectionLabel: string, currentContent: string, userPrompt: string, fullPlan: LessonPlanData) => Promise<string>;
        regenerate: (sectionLabel: string, fullPlan: LessonPlanData) => Promise<string>;
    }
}

const PreviewPage: React.FC<PreviewPageProps> = ({ lessonPlan, isLoading, error, onStartOver, onLessonPlanChange, aiActions }) => {
    const [themeColor, setThemeColor] = useState<string>('#343a40'); // Default: Arang (Dark Grey)
    const [isExporting, setIsExporting] = useState<string | null>(null); // 'docx', 'pdf', 'html'
    const [exportError, setExportError] = useState<string | null>(null);

    // --- AI Interaction State ---
    const [refineModal, setRefineModal] = useState({ isOpen: false, sectionKey: '', sectionLabel: '' });
    const [activeAiSectionKey, setActiveAiSectionKey] = useState<string | null>(null);
    const [lastAiActionKey, setLastAiActionKey] = useState<string | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    useEffect(() => {
        let timer: number;
        if (lastAiActionKey) {
            timer = window.setTimeout(() => {
                setLastAiActionKey(null);
            }, 2000); // Show success for 2 seconds
        }
        return () => clearTimeout(timer);
    }, [lastAiActionKey]);
    
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (lessonPlan) {
            onLessonPlanChange({ ...lessonPlan, [name]: value });
        }
    }, [lessonPlan, onLessonPlanChange]);

    const handleExport = useCallback(async (format: 'docx' | 'pdf' | 'html') => {
        if (!lessonPlan) return;
        setIsExporting(format);
        setExportError(null);
        try {
            switch (format) {
                case 'docx':
                    await generateDocument(lessonPlan);
                    break;
                case 'pdf':
                    await generatePdf(lessonPlan, themeColor);
                    break;
                case 'html':
                    generateHtml('preview-content', themeColor);
                    break;
            }
        } catch (err) {
            console.error(`Failed to export as ${format}:`, err);
            setExportError(`Gagal mengekspor sebagai ${format.toUpperCase()}. Silakan coba lagi.`);
        } finally {
            setIsExporting(null);
        }
    }, [lessonPlan, themeColor]);
    
    const handleOpenRefineModal = (sectionKey: string, sectionLabel: string) => {
        setRefineModal({ isOpen: true, sectionKey, sectionLabel });
    };
    
    const handleRefineContent = async (prompt: string) => {
        if (!lessonPlan || !refineModal.sectionKey) return;
        
        const key = refineModal.sectionKey as keyof LessonPlanData;
        const currentContent = lessonPlan[key] as string;

        setActiveAiSectionKey(key);
        setAiError(null);
        
        try {
            const newContent = await aiActions.refine(refineModal.sectionLabel, currentContent, prompt, lessonPlan);
            onLessonPlanChange({ ...lessonPlan, [key]: newContent });
            setLastAiActionKey(key);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : `Gagal menyempurnakan bagian ini.`);
        } finally {
            setActiveAiSectionKey(null);
        }
    };
    
    const handleRegenerateContent = async (sectionKey: string, sectionLabel: string) => {
        if (!lessonPlan) return;
        
        const key = sectionKey as keyof LessonPlanData;
        setActiveAiSectionKey(key);
        setAiError(null);

        try {
            const newContent = await aiActions.regenerate(sectionLabel, lessonPlan);
            onLessonPlanChange({ ...lessonPlan, [key]: newContent });
            setLastAiActionKey(key);
        } catch(err) {
            setAiError(err instanceof Error ? err.message : `Gagal membuat ulang bagian ini.`);
        } finally {
            setActiveAiSectionKey(null);
        }
    };

    const effectiveIsLoading = isLoading || (!lessonPlan && !error);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <PreviewSidebar
                onStartOver={onStartOver}
                selectedTheme={themeColor}
                onThemeChange={setThemeColor}
                onExport={handleExport}
                isExporting={isExporting}
                isLoading={effectiveIsLoading}
            />
            <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                {exportError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow-md" role="alert">
                        <p className="font-bold">Kesalahan Ekspor</p>
                        <p>{exportError}</p>
                    </div>
                )}
                 {aiError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow-md" role="alert">
                        <p className="font-bold">Kesalahan AI</p>
                        <p>{aiError}</p>
                    </div>
                )}
                <div id="preview-content-wrapper" className="bg-white shadow-2xl rounded-lg overflow-hidden">
                    {effectiveIsLoading && <PreviewLoadingSkeleton themeColor={themeColor} />}
                    {!effectiveIsLoading && lessonPlan && (
                        <PreviewContent 
                            lessonPlan={lessonPlan} 
                            themeColor={themeColor} 
                            onContentChange={handleContentChange}
                            onRefineClick={handleOpenRefineModal}
                            onRegenerateClick={handleRegenerateContent}
                            activeAiSectionKey={activeAiSectionKey}
                            lastAiActionKey={lastAiActionKey}
                        />
                    )}
                    {!effectiveIsLoading && error && (
                         <div className="p-8 text-center">
                             <h2 className="text-xl font-bold text-red-600">Gagal Membuat Modul Ajar</h2>
                             <p className="mt-2 text-gray-600">Terjadi kesalahan saat berkomunikasi dengan AI.</p>
                             <p className="mt-1 text-sm text-gray-500 font-mono bg-red-50 p-2 rounded">{error}</p>
                             <button
                                 onClick={onStartOver}
                                 className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                             >
                                 Coba Lagi
                             </button>
                         </div>
                    )}
                </div>
            </main>
            <RefineModal 
                isOpen={refineModal.isOpen}
                onClose={() => setRefineModal(prev => ({ ...prev, isOpen: false }))}
                onSubmit={handleRefineContent}
                sectionLabel={refineModal.sectionLabel}
                isLoading={!!activeAiSectionKey}
            />
        </div>
    );
};

export default PreviewPage;
