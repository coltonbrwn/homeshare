import { useState, useEffect } from 'react';

type ToastProps = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type ToastState = ToastProps & {
  id: string;
  visible: boolean;
};

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
    const id = `toast-${toastCounter++}`;
    
    setToasts(prev => [
      ...prev,
      {
        id,
        title,
        description,
        variant,
        duration,
        visible: true,
      },
    ]);

    setTimeout(() => {
      setToasts(prev => 
        prev.map(t => 
          t.id === id ? { ...t, visible: false } : t
        )
      );
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300); // Animation duration
    }, duration);
  };

  return { toast, toasts };
}

export { useToast as toast };
