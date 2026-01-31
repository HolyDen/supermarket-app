import { useState, useEffect } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let toastId = 0;
const toastListeners: Array<(toast: ToastMessage) => void> = [];

// Toast duration based on type
const DEFAULT_DURATIONS = {
  success: 3000,
  error: 5000,
  info: 7000, // Longer for sync messages
};

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  customDuration?: number
) => {
  const duration = customDuration || DEFAULT_DURATIONS[type];
  const toast: ToastMessage = { id: toastId++, message, type, duration };
  toastListeners.forEach(listener => listener(toast));
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration || DEFAULT_DURATIONS[toast.type]);
    };

    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg animate-slide-up ${getToastStyles(toast.type)}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}