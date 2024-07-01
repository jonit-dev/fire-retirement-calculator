import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`w-full max-w-8xl mx-auto p-4 shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
};

type CardHeaderProps = {
  children: React.ReactNode;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
  return (
    <div className="mb-6">
      {children}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
};

export const CardContent = ({ children }: CardContentProps) => {
  return (
    <div>
      {children}
    </div>
  );
};
