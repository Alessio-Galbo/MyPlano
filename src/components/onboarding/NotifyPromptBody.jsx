import React, { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from '../ui';
import { useI18n } from '../../core/i18n';
import { useSystemNotifications } from '../../modules/settings/useSystemNotifications';
import { describeCapability, isPeriodicSyncSupported, isInstalledApp } from '../../core/notifications';
import './DemoDataBanner.css';

// "Notify me on this phone?" with the same logic as the Settings card (permission asked on tap).
export function NotifyPromptBody({ onDone }) {
  const { t } = useI18n();
  const { toggle } = useSystemNotifications();
  // What this device will do once notifications are on (background checks only when installed).
  const [capability, setCapability] = useState('openOnly');
  useEffect(() => {
    let alive = true;
    isPeriodicSyncSupported().then((ok) => {
      if (alive) setCapability(describeCapability({ periodicActive: ok && isInstalledApp(), periodicSupported: ok }));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const enable = async () => {
    await toggle(true);
    onDone('enabled');
  };

  return (
    <section className="demo-banner notify-prompt" aria-labelledby="notify-prompt-title">
      <BellRing size={22} className="demo-banner-icon" aria-hidden="true" />
      <div className="demo-banner-text">
        <h3 id="notify-prompt-title" className="demo-banner-title">{t('common.onboarding.notifyTitle')}</h3>
        <p className="demo-banner-desc">{t(`common.systemNotifications.capability.${capability}`)}</p>
      </div>
      <div className="demo-banner-actions">
        <Button onClick={enable}>{t('common.onboarding.notifyEnable')}</Button>
        <Button variant="ghost" onClick={() => onDone('later')}>{t('common.onboarding.notifyLater')}</Button>
      </div>
    </section>
  );
}
