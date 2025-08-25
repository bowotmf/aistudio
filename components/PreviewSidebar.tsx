import React from 'react';

const THEME_COLORS = [
  { name: 'Arang', value: '#343a40' },
  { name: 'Biru Laut', value: '#001f3f' },
  { name: 'Hijau Hutan', value: '#004d40' },
  { name: 'Ungu Tua', value: '#311b92' },
  { name: 'Merah Marun', value: '#800000' },
  { name: 'Abu Batu', value: '#2f4f4f' },
  { name: 'Biru Malam', value: '#191970' },
  { name: 'Darah Sapi', value: '#4a0404' },
  { name: 'Biru Prusia', value: '#003153' },
  { name: 'Zaitun Tua', value: '#556b2f' },
  { name: 'Nila', value: '#4b0082' },
  { name: 'Hijau Toska', value: '#008080' },
];

const ExportIcon: React.FC<{ format: string }> = ({ format }) => {
    if (format === 'docx') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>;
    if (format === 'pdf') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
    if (format === 'html') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
    return null;
}

const LoadingSpinner: React.FC = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


interface PreviewSidebarProps {
    onStartOver: () => void;
    selectedTheme: string;
    onThemeChange: (color: string) => void;
    onExport: (format: 'docx' | 'pdf' | 'html') => void;
    isExporting: string | null;
    isLoading: boolean;
}

const PreviewSidebar: React.FC<PreviewSidebarProps> = ({ onStartOver, selectedTheme, onThemeChange, onExport, isExporting, isLoading }) => {
    const exportFormats: ('docx' | 'pdf' | 'html')[] = ['docx', 'pdf', 'html'];
    return (
        <aside className="w-full md:w-64 lg:w-72 bg-white flex-shrink-0 shadow-lg md:shadow-none z-10 font-sans">
            <div className="p-6 h-full flex flex-col">
                <h1 className="text-xl font-bold text-gray-800">Modul Ajar PM</h1>
                <p className="text-sm text-gray-500 mb-6">Didukung oleh Gemini</p>

                <button
                    onClick={onStartOver}
                    disabled={isLoading}
                    className="w-full text-center px-4 py-2 mb-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Mulai Lagi
                </button>

                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pilih Warna Tema</h2>
                    <div className="grid grid-cols-6 gap-2">
                        {THEME_COLORS.map(color => (
                            <button
                                key={color.name}
                                title={color.name}
                                onClick={() => onThemeChange(color.value)}
                                disabled={isLoading}
                                className={`w-8 h-8 rounded-full focus:outline-none ring-offset-2 ring-white ${selectedTheme === color.value ? 'ring-2' : 'ring-0 hover:ring-2'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                style={{
                                    backgroundColor: color.value,
                                    '--tw-ring-color': color.value,
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opsi Ekspor</h2>
                    {exportFormats.map(format => (
                         <button
                            key={format}
                            onClick={() => onExport(format)}
                            disabled={!!isExporting || isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: (isExporting || isLoading) ? '#cbd5e1' : selectedTheme,
                                '--tw-ring-color': selectedTheme,
                            } as React.CSSProperties}
                        >
                            {isExporting === format ? <LoadingSpinner /> : <ExportIcon format={format} />}
                            {isExporting === format ? `Mengekspor...` : `Unduh sebagai ${format.toUpperCase()}`}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default PreviewSidebar;