import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button, ConfirmModal } from '../ui';
import { useI18n } from '../../core/i18n';
import './DemoDataBanner.css';

const P = 'common.onboarding';
const CONFIRM_TEXT = { demo: 'confirmMessage', mixed: 'confirmMixed', remove: 'confirmRemoveMessage' };

// demo = useDemoData(...) result, owned by OnboardingArea.
export function DemoDataBanner({ demo }) {
  const { t } = useI18n();
  const { mode, leftovers, keepSamples, startFresh, removeSamples, isStillDemo } = demo;
  const [confirm, setConfirm] = useState(null); // null | 'demo' | 'mixed' | 'remove'

  if (!mode && !confirm) return null;
  const isMixed = mode === 'mixed';
  const isRemove = confirm === 'remove';
  const counts = {
    n: leftovers?.total || 0, profiles: leftovers?.profileIds.length || 0,
    expenses: leftovers?.expenseIds.length || 0, documents: leftovers?.documentIds.length || 0,
  };
  const onMain = () => setConfirm(isMixed ? 'remove' : (isStillDemo() ? 'demo' : 'mixed'));

  return (
    <section className="demo-banner" aria-labelledby="demo-banner-title">
      <Sparkles size={22} className="demo-banner-icon" aria-hidden="true" />
      <div className="demo-banner-text">
        <h3 id="demo-banner-title" className="demo-banner-title">{t(`${P}.${isMixed ? 'mixedTitle' : 'demoTitle'}`)}</h3>
        <p className="demo-banner-desc">{t(`${P}.${isMixed ? 'mixedDesc' : 'demoDesc'}`, counts)}</p>
      </div>
      <div className="demo-banner-actions">
        <Button onClick={onMain}>{t(`${P}.${isMixed ? 'removeSamples' : 'startFresh'}`)}</Button>
        <Button variant="ghost" onClick={keepSamples}>{t(`${P}.keepSamples`)}</Button>
      </div>
      <ConfirmModal
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={isRemove ? removeSamples : startFresh}
        title={t(`${P}.${isRemove ? 'confirmRemoveTitle' : 'confirmTitle'}`)}
        message={confirm ? t(`${P}.${CONFIRM_TEXT[confirm]}`, counts) : ''}
        confirmText={t(`${P}.${isRemove ? 'confirmRemoveButton' : 'confirmButton'}`)}
      />
    </section>
  );
}
