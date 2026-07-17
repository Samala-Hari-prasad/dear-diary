export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id: string;
  message: string;
  action?: ToastAction;
  duration?: number;
}

// Global state
let toastQueue: ToastOptions[] = [];
let listeners: ((toasts: ToastOptions[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((l) => l(toastQueue));
};

export const toast = (options: Omit<ToastOptions, "id"> & { id?: string }) => {
  const id = options.id || Math.random().toString(36).substring(2, 9);
  
  // If a toast with this ID already exists, replace it
  const existingIndex = toastQueue.findIndex((t) => t.id === id);
  const newToast = { ...options, id };
  
  if (existingIndex >= 0) {
    toastQueue[existingIndex] = newToast;
  } else {
    toastQueue = [...toastQueue, newToast];
  }
  
  notifyListeners();
  
  if (newToast.duration !== Infinity) {
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration || 5000);
  }
  return id;
};

export const dismissToast = (id: string) => {
  toastQueue = toastQueue.filter((t) => t.id !== id);
  notifyListeners();
};

import { useState, useEffect } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>(toastQueue);

  useEffect(() => {
    const listener = (newToasts: ToastOptions[]) => setToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts, toast, dismissToast };
}
