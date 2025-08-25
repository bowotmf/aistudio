import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, value, onChange, placeholder = '', type = 'text', required = false, icon }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-gray-900 transition-shadow duration-150 ${icon ? 'pl-10' : 'px-3'} py-2.5`}
        />
      </div>
    </div>
  );
};

export default InputGroup;