import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import './PwaUpdatePrompt.css';

const VISIBLE_MS = 4000;

// Conferma discreta dopo un aggiornamento automatico (o dal banner): sparisce da sola.
export function PwaUpdatedToast({ onDone }) {
  const { t } = useI18n();
  useEffect(() => {
    const timer = setTimeout(onDone, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pwa-update pwa-updated-toast" role="status" aria-live="polite" data-pwa-updated="1">
      <CheckCircle2 className="pwa-updated-icon" size={18} aria-hidden="true" />
      <p className="pwa-update-title">{t('common.pwa.updatedToast')}</p>
    </div>
  );
}
