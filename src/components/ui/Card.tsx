import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={clsx('p-5 border-b border-gray-200', className)}>{children}</div>;
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return <h3 className={clsx('text-lg font-medium text-gray-900', className)}>{children}</h3>;
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return <p className={clsx('text-sm text-gray-500 mt-1', className)}>{children}</p>;
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={clsx('p-5', className)}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('p-4 bg-gray-50 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};