import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input className={`mt-1 p-2 border rounded ${className}`} {...props} />
  );
};
