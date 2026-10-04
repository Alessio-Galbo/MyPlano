import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button, ConfirmModal } from '../ui';
import { useI18n } from '../../core/i18n';
import { useDemoData } from './useDemoData';
import './DemoDataBanner.css';

export function DemoDataBanner({ profiles, expenses, documents, onDataReset }) {
  const { t } = useI18n();
  const { visible, keepSamples, startFresh, isStillDemo } = useDemoData({ profiles, expenses, documents }, onDataReset);
  const [confirm, setConfirm] = useState(null); // null | 'demo' | 'mixed'

  if (!visible && !confirm) return null;

  return (
    <section className="demo-banner" aria-labelledby="demo-banner-title">
      <Sparkles size={22} className="demo-banner-icon" aria-hidden="true" />
      <div className="demo-banner-text">
        <h3 id="demo-banner-title" className="demo-banner-title">{t('common.onboarding.demoTitle')}</h3>
        <p className="demo-banner-desc">{t('common.onboarding.demoDesc')}</p>
      </div>
      <div className="demo-banner-actions">
        <Button onClick={() => setConfirm(isStillDemo() ? 'demo' : 'mixed')}>{t('common.onboarding.startFresh')}</Button>
        <Button variant="ghost" onClick={keepSamples}>{t('common.onboarding.keepSamples')}</Button>
      </div>
      <ConfirmModal
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={startFresh}
        title={t('common.onboarding.confirmTitle')}
        message={t(confirm === 'mixed' ? 'common.onboarding.confirmMixed' : 'common.onboarding.confirmMessage')}
        confirmText={t('common.onboarding.confirmButton')}
      />
    </section>
  );
}
