import React, { useMemo } from 'react';
import { UserX, ArrowRight } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useApp } from '../../core/state';
import { findOrphanItems } from '../../core/profiles';
import { scrollToOrphanItemsCard } from '../settings/OrphanItemsAnchor';
import './InstallmentFixBanner.css';

// Warning only: points the user to the Settings card where they choose the profiles.
export function OrphanItemsBanner({ expenses, documents, profiles }) {
  const { t } = useI18n();
  const { setActiveTab } = useApp();
  const count = useMemo(() => findOrphanItems(expenses, documents, profiles).length, [expenses, documents, profiles]);

  if (count === 0) return null;

  const handleReview = () => {
    setActiveTab('settings');
    requestAnimationFrame(() => scrollToOrphanItemsCard());
  };

  return (
    <div className="ifb-banner" role="status" data-testid="orphan-banner">
      <UserX size={18} className="ifb-icon" aria-hidden="true" />
      <span className="ifb-text">{t(count === 1 ? 'common.orphans.bannerOne' : 'common.orphans.banner', { n: count })}</span>
      <button type="button" className="ifb-action" onClick={handleReview}>
        {t('common.orphans.review')}
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
