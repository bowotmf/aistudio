
import React, { useState, useEffect, useCallback } from 'react';
import { LessonPlanData } from './types';
import FormPage from './components/FormPage';
import PreviewPage from './components/PreviewPage';
import { generateLessonPlanDetails, refineSectionContent, regenerateSectionContent } from './services/aiGenerator';

const LESSON_PLAN_STORAGE_KEY = 'currentLessonPlan';
const FORM_DATA_STORAGE_KEY = 'lessonPlanFormData';

const App: React.FC = () => {
    const [lessonPlan, setLessonPlan] = useState<LessonPlanData | null>(() => {
         try {
            const savedPlan = localStorage.getItem(LESSON_PLAN_STORAGE_KEY);
            return savedPlan ? JSON.parse(savedPlan) : null;
        } catch (error) {
            console.error("Failed to parse lesson plan from localStorage", error);
            return null;
        }
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formKey, setFormKey] = useState(Date.now()); // Key to force FormPage remount

    // Persist lessonPlan to localStorage whenever it changes
    useEffect(() => {
        try {
            if (lessonPlan) {
                localStorage.setItem(LESSON_PLAN_STORAGE_KEY, JSON.stringify(lessonPlan));
            } else {
                localStorage.removeItem(LESSON_PLAN_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to save lesson plan to localStorage", error);
        }
    }, [lessonPlan]);


    const handleGenerate = async (formData: Partial<LessonPlanData>) => {
        setIsLoading(true);
        setError(null);
        setLessonPlan(null);

        try {
            const aiData = await generateLessonPlanDetails(formData);
            const finalLearningObjectives = formData.learningObjectives || aiData.learningObjectives;
            
            const finalData: LessonPlanData = {
                schoolName: formData.schoolName || "",
                teacherName: formData.teacherName || "",
                teacherNip: formData.teacherNip || "",
                subject: formData.subject || "",
                phaseClass: formData.phaseClass || "",
                timeAllocation: formData.timeAllocation || "",
                schoolYear: formData.schoolYear || "",
                subjectMatter: formData.subjectMatter || "",
                learningOutcomes: formData.learningOutcomes || "",
                specificMaterial: formData.specificMaterial || "",
                signatureDate: formData.signatureDate || "",
                principalName: formData.principalName || "",
                principalNip: formData.principalNip || "",
                ...aiData,
                learningObjectives: finalLearningObjectives,
                graduateProfileDimensions: Array.isArray(aiData.graduateProfileDimensions) ? aiData.graduateProfileDimensions : [],
            };

            setLessonPlan(finalData);

        } catch (err) {
            console.error("Failed to generate lesson plan details:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartOver = () => {
        // Explicitly clear all persisted data from localStorage for a full reset
        localStorage.removeItem(LESSON_PLAN_STORAGE_KEY);
        localStorage.removeItem(FORM_DATA_STORAGE_KEY);

        // Reset all relevant states to switch back to the form view
        setLessonPlan(null);
        setIsLoading(false);
        setError(null);
        
        // By updating the formKey, we force the FormPage component to re-mount,
        // ensuring it re-initializes its state with a clean form.
        setFormKey(Date.now());
    };
    
    const handleLessonPlanChange = useCallback((newPlan: LessonPlanData) => {
        setLessonPlan(newPlan);
    }, []);

    const view = lessonPlan || isLoading || error ? 'preview' : 'form';

    if (view === 'form') {
        return <FormPage key={formKey} onGenerate={handleGenerate} />;
    }

    return (
        <PreviewPage 
            lessonPlan={lessonPlan} 
            isLoading={isLoading}
            error={error}
            onStartOver={handleStartOver}
            onLessonPlanChange={handleLessonPlanChange}
            aiActions={{ refine: refineSectionContent, regenerate: regenerateSectionContent }}
        />
    );
};

export default App;
