import React, { useMemo } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useApp } from '../../core/state';
import { findShiftedInstallmentKeys } from '../../core/dates/installmentKeyAudit';
import './InstallmentFixBanner.css';

export const INSTALLMENT_FIX_ANCHOR = 'installment-fix-card';

// Waits (a few frames) for the Settings card to mount after the tab switch, then scrolls to it.
function scrollToFixCard(triesLeft = 30) {
  const el = document.getElementById(INSTALLMENT_FIX_ANCHOR);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (triesLeft > 0) requestAnimationFrame(() => scrollToFixCard(triesLeft - 1));
}

// Warning only: points the user to the review card in Settings, never fixes anything itself.
export function InstallmentFixBanner({ expenses }) {
  const { t } = useI18n();
  const { setActiveTab } = useApp();
  const count = useMemo(() => findShiftedInstallmentKeys(expenses).length, [expenses]);

  if (count === 0) return null;

  const handleReview = () => {
    setActiveTab('settings');
    requestAnimationFrame(() => scrollToFixCard());
  };

  return (
    <div className="ifb-banner" role="status">
      <AlertTriangle size={18} className="ifb-icon" aria-hidden="true" />
      <span className="ifb-text ifb-text-long">{t(count === 1 ? 'common.installmentFix.bannerOne' : 'common.installmentFix.banner', { n: count })}</span>
      <span className="ifb-text ifb-text-short">{t(count === 1 ? 'common.installmentFix.bannerShortOne' : 'common.installmentFix.bannerShort', { n: count })}</span>
      <button type="button" className="ifb-action" onClick={handleReview}>
        {t('common.installmentFix.review')}
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
