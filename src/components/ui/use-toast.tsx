"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  const toast = React.useCallback(
    (props: ToastProps) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...props, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm",
              toast.variant === "destructive" && "bg-red-50 dark:bg-red-900"
            )}
          >
            {toast.title && (
              <h3
                className={cn(
                  "font-medium",
                  toast.variant === "destructive" && "text-red-800 dark:text-red-200"
                )}
              >
                {toast.title}
              </h3>
            )}
            {toast.description && (
              <p
                className={cn(
                  "text-sm text-gray-500 dark:text-gray-400",
                  toast.variant === "destructive" && "text-red-600 dark:text-red-300"
                )}
              >
                {toast.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
} 