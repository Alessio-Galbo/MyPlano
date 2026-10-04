import React from 'react';
import { useI18n } from '../../core/i18n';
import './TabLoading.css';

// Light Suspense fallback while a tab chunk is downloaded (usually a few ms).
export function TabLoading() {
  const { t } = useI18n();
  return (
    <div className="tab-loading" role="status" aria-live="polite">
      <span className="tab-loading-spinner" aria-hidden="true" />
      <span className="tab-loading-text">{t('common.loadingTab')}</span>
    </div>
  );
}
