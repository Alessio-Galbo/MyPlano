import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { Button } from '../ui/Button';
import { hasOpenDialog } from './busyState.js';
import './PwaUpdatePrompt.css';

// mode "update": versione nuova scaricata e in attesa; "reload": attivata da un'altra scheda.
export function PwaUpdatePrompt({ mode, onConfirm, onDismiss }) {
  const { t } = useI18n();
  const [warnUnsaved, setWarnUnsaved] = useState(false);

  const handleConfirm = () => {
    if (!warnUnsaved && hasOpenDialog()) {
      setWarnUnsaved(true);
      return;
    }
    onConfirm();
  };

  const message = mode === 'reload' ? t('common.pwa.updatedElsewhere') : t('common.pwa.updateAvailable');
  return (
    <div className="pwa-update" role="status" aria-live="polite" data-pwa-update={mode}>
      <RefreshCw className="pwa-update-icon" size={18} aria-hidden="true" />
      <div className="pwa-update-text">
        <p className="pwa-update-title">{message}</p>
        {warnUnsaved && <p className="pwa-update-warning">{t('common.pwa.unsavedWarning')}</p>}
      </div>
      <div className="pwa-update-actions">
        <Button variant="secondary" size="sm" onClick={onDismiss}>{t('common.pwa.later')}</Button>
        <Button size="sm" className="pwa-update-confirm" onClick={handleConfirm}>
          {warnUnsaved ? t('common.pwa.updateAnyway') : t('common.pwa.updateAction')}
        </Button>
      </div>
    </div>
  );
}
