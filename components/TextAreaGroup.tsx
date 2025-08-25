import React from 'react';

interface TextAreaGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

const TextAreaGroup: React.FC<TextAreaGroupProps> = ({ label, id, value, onChange, placeholder = '', rows = 4, required = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-gray-900"
      ></textarea>
    </div>
  );
};

export default TextAreaGroup;