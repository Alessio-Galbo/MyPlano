import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useToastSwipe } from './useToastSwipe';

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info };

export function Toast({ toast, onDismiss }) {
  const { t } = useI18n();
  const { id, message, variant, action, duration } = toast;
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);

  useEffect(() => {
    if (!duration || paused) return undefined;
    const started = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(1000, remaining.current - (Date.now() - started));
    };
  }, [id, duration, paused, onDismiss]);

  const [swipeRef, swipeHandlers] = useToastSwipe(() => onDismiss(id), setPaused);
  const Icon = ICONS[variant] || Info;
  const handleAction = () => {
    action.onClick();
    onDismiss(id);
  };

  return (
    <div
      ref={swipeRef}
      {...swipeHandlers}
      className={`toast toast-${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon size={18} className="toast-icon" aria-hidden="true" />
      <span className="toast-message">{message}</span>
      {action && (
        <button type="button" className="toast-action" onClick={handleAction}>
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(id)}
        aria-label={t('common.toast.dismiss')}
      >
        <X size={16} />
      </button>
    </div>
  );
}
