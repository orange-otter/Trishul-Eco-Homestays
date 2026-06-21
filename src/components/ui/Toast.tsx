import React from 'react';
import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-surface dark:bg-gray-800 text-text-primary dark:text-white shadow-lg border border-border dark:border-gray-700',
        duration: 4000,
        style: {
          borderRadius: '0.5rem',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#2C4C3B',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  dismiss: (toastId?: string) => hotToast.dismiss(toastId),
};
