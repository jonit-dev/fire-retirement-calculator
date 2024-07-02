import React from 'react';

interface DropdownProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export const Dropdown: React.FC<DropdownProps> = ({ label, id, name, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-200">{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
 