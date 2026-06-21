import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="font-medium text-text-primary text-sm dark:text-gray-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 rounded-md border outline-none font-sans text-base transition-all duration-300 bg-surface text-text-primary dark:bg-gray-800 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:disabled:bg-gray-900
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-3 focus:ring-red-500/20' 
              : 'border-border focus:border-primary focus:ring-3 focus:ring-primary/10 dark:border-gray-700 dark:focus:border-primary-light dark:focus:ring-primary-light/20'
            }`}
          {...props}
        />
        {error && <span className="text-red-500 text-sm mt-0.5 dark:text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
