import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

// show({ message, variant: 'success'|'error'|'info', action?: { label, onClick }, duration?, id? }) → id
// duration 0 = stays until dismissed.
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
