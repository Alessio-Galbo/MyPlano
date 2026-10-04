import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../core/i18n';
import { STORAGE_ERROR_EVENT } from '../../core/storage/safeStorage';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';
import { enqueue, selectVisible, defaultDuration } from './toastQueue';
import { useToastLimit } from './useToastLimit';
import './Toast.css';
import './ToastMobile.css';

export function ToastProvider({ children }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(({ message, variant = 'info', action, duration, id }) => {
    counter.current += 1;
    const toastId = id || `toast-${counter.current}`;
    const ms = duration ?? defaultDuration(variant, !!action);
    setToasts((prev) => enqueue(prev, { id: toastId, message, variant, action, duration: ms }));
    return toastId;
  }, []);

  useEffect(() => {
    const onStorageError = (e) => {
      const key = e.detail?.quota === false ? 'common.toast.storageError' : 'common.toast.storageFull';
      show({ id: 'storage-error', message: t(key), variant: 'error', duration: 0 });
    };
    window.addEventListener(STORAGE_ERROR_EVENT, onStorageError);
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, onStorageError);
  }, [show, t]);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);
  const limit = useToastLimit();
  const visible = useMemo(() => selectVisible(toasts, limit), [toasts, limit]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-viewport" aria-live="polite" aria-relevant="additions" aria-label={t('common.toast.region')}>
          {visible.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
