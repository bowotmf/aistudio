
import React, { useRef, useEffect } from 'react';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm7 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V9h-1a1 1 0 110-2h1V6a1 1 0 011-1zM6 16a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm6 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
const LoadingSpinner = () => <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

interface EditableSectionProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRefineClick: () => void;
  onRegenerateClick: () => void;
  isProcessing: boolean;
  wasJustProcessed: boolean;
}

const EditableSection: React.FC<EditableSectionProps> = ({ label, name, value, onChange, onRefineClick, onRegenerateClick, isProcessing, wasJustProcessed }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  };

  const renderButtons = () => {
      if (wasJustProcessed) {
          return <SuccessIcon />;
      }
      if (isProcessing) {
          return <LoadingSpinner />;
      }
      return (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                  onClick={onRefineClick}
                  className="text-sky-600 hover:text-sky-800 disabled:opacity-50"
                  title="Sempurnakan dengan AI"
                  disabled={isProcessing}
              >
                  <SparklesIcon />
              </button>
              <button 
                  onClick={onRegenerateClick}
                  className="text-sky-600 hover:text-sky-800 disabled:opacity-50"
                  title="Buat ulang dengan AI"
                  disabled={isProcessing}
              >
                  <RefreshIcon />
              </button>
          </div>
      );
  }

  return (
    <div className="mt-4 group relative">
       <div className="flex items-center gap-2">
            <h4 className="font-bold text-black">{label}</h4>
            {renderButtons()}
       </div>
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={onChange}
        onInput={handleInput}
        rows={1}
        className="mt-1 w-full text-sm leading-relaxed bg-transparent border-none focus:ring-1 focus:ring-sky-500 focus:bg-sky-50/50 rounded-md p-2 -m-2 resize-none overflow-hidden transition-colors duration-200 text-black text-justify"
      />
    </div>
  );
};

export default EditableSection;
