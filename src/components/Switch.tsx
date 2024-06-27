import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange, label }) => {
  return (
    <div className="form-control">
      {label && <label className="label" htmlFor={id}>{label}</label>}
      <label className="cursor-pointer label" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className="toggle toggle-primary"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default Switch;
