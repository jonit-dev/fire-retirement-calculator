import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className = '', ...props }: LabelProps) => {
  return (
    <label className={`block text-sm font-medium text-gray-500 ${className}`} {...props} />
  );
};
