import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`${sizeMap[size]} border-primary/30 border-t-primary rounded-full animate-spin dark:border-primary-light/30 dark:border-t-primary-light`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
