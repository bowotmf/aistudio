import React, { useState } from 'react';

const LoadingSpinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface RefineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    sectionLabel: string;
    isLoading: boolean;
}

const RefineModal: React.FC<RefineModalProps> = ({ isOpen, onClose, onSubmit, sectionLabel, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    if (!isOpen) {
        return null;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(prompt);
        onClose();
        setPrompt('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Sempurnakan Bagian Ini</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Berikan instruksi untuk AI agar menulis ulang bagian <span className="font-semibold">"{sectionLabel}"</span>.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="px-6 pb-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Contoh: Buat lebih singkat dan interaktif, tambahkan contoh nyata..."
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={!prompt || isLoading}
                            className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed"
                        >
                             {isLoading && <LoadingSpinner />}
                             Sempurnakan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RefineModal;