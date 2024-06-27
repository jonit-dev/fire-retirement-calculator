import React from 'react';
import { Input } from './Input';
import { Label } from './Label';
 

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 p-2 border rounded bg-gray-700 text-white"
      />
    </div>
  );
};

export default InputField;
