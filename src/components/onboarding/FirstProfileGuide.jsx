import React, { useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '../ui';
import { useI18n } from '../../core/i18n';
import { requestAddProfile } from '../../core/state/profileActions';
import { findOrphanItems } from '../../core/profiles/orphanItems';
import { DATA_KEYS } from '../../core/storage/storageKeys';
import { readJSON } from '../../core/storage/safeStorage';
import './OnboardingCards.css';

// Saved items only (a missing key means "nothing saved", never the sample data).
const savedList = (key) => readJSON(key, [], Array.isArray);

// Shown instead of a tab's content while there are no profiles: everything needs one.
// Items left without a profile (e.g. after deleting every profile) are announced, not changed.
export function FirstProfileGuide() {
  const { t } = useI18n();
  const orphans = useMemo(
    () => findOrphanItems(savedList(DATA_KEYS.EXPENSES), savedList(DATA_KEYS.DOCUMENTS), []).length,
    [],
  );
  return (
    <section className="onboarding-card first-profile-guide" aria-labelledby="first-profile-title">
      <UserPlus size={32} className="onboarding-card-icon" aria-hidden="true" />
      <h3 id="first-profile-title" className="onboarding-card-title">{t('common.onboarding.firstProfileTitle')}</h3>
      <p className="onboarding-card-desc">{t('common.onboarding.firstProfileDesc')}</p>
      {orphans > 0 && (
        <p className="onboarding-card-note" role="status">
          {t(orphans === 1 ? 'common.onboarding.firstProfileOrphansOne' : 'common.onboarding.firstProfileOrphans', { n: orphans })}
        </p>
      )}
      <Button icon={<UserPlus size={16} />} onClick={requestAddProfile} className="onboarding-card-btn">
        {t('common.onboarding.firstProfileButton')}
      </Button>
    </section>
  );
}
