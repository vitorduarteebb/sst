'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-800',
    iconClassName: 'text-green-600',
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-800',
    iconClassName: 'text-red-600',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    iconClassName: 'text-yellow-600',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
    iconClassName: 'text-blue-600',
  },
};

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguarda a animação terminar
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
      <Card className={`border ${config.className} shadow-lg`}>
        <CardContent className="p-4 flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${config.iconClassName}`} />
          <span className="font-medium">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para gerenciar múltiplos toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
  }>>([]);

  const showToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
  };
};
