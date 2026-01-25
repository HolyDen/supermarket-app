import { useState, useEffect } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const toastListeners: Array<(toast: ToastMessage) => void> = [];

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast: ToastMessage = { id: toastId++, message, type };
  toastListeners.forEach(listener => listener(toast));
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
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
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg animate-slide-down ${getToastStyles(toast.type)}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
