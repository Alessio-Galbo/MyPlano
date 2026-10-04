import React from 'react';
import { BellRing, Send } from 'lucide-react';
import { Button, Toggle, useToast } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import { useApp } from '../../core/state';
import { showTestNotification } from '../../core/notifications';
import { useSystemNotifications } from './useSystemNotifications';
import './SystemNotificationsCard.css';

const P = 'common.systemNotifications';

// Settings card "Notifiche sul dispositivo" (system notifications on Android / iOS / desktop).
export function SystemNotificationsCard() {
  const { t } = useI18n();
  const { isGlobalMuted } = useApp();
  const { show } = useToast();
  const { active, status, toggle, capability, canTest } = useSystemNotifications();

  const sendTest = () => {
    showTestNotification(t(`${P}.testTitle`), t(`${P}.testBody`))
      .catch(() => show({ message: t(`${P}.testError`), variant: 'error' }));
  };

  return (
    <div className="settings-card" data-system-notifications={status}>
      <div className="settings-card-header">
        <BellRing size={20} className="text-muted" />
        <h3 className="settings-card-title">{t(`${P}.title`)}</h3>
      </div>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">{t(`${P}.toggleLabel`)}</span>
          <span className="settings-row-desc">{t(`${P}.toggleDesc`)}</span>
          <span className={`sysnotif-status sysnotif-status-${status}`}>{t(`${P}.status.${status}`)}</span>
        </div>
        <Toggle checked={active} onChange={toggle} disabled={status === 'unsupported'} id="system-notifications-toggle" />
      </div>

      {status === 'denied' && <p className="sysnotif-note sysnotif-warning">{t(`${P}.deniedHelp`)}</p>}
      {active && isGlobalMuted && <p className="sysnotif-note sysnotif-warning">{t(`${P}.mutedNote`)}</p>}
      <p className="sysnotif-note" data-capability={capability}>{t(`${P}.capability.${capability}`)}</p>

      {canTest && (
        <div className="sysnotif-actions">
          <Button variant="secondary" size="sm" icon={<Send size={15} />} onClick={sendTest} className="sysnotif-test-btn">
            {t(`${P}.testButton`)}
          </Button>
        </div>
      )}
    </div>
  );
}
