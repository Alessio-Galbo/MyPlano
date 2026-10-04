import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useApp } from '../../core/state';
import { UpcomingDetailModal } from '../../modules/budget/UpcomingDetailModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { NavbarNotificationsDropdown } from './NavbarNotificationsDropdown';
import { useNotifications } from './useNotifications';
import './NavbarNotificationsBtn.css';

export function NavbarNotificationsBtn({
  expenses = [], documents = [], selectedProfileId = 'all', profiles = [],
}) {
  const { t } = useI18n();
  const { isGlobalMuted } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const containerRef = useRef(null);
  const bellRef = useRef(null);

  const { allUpcoming, alertList, count, isDismissed, dismissedCount, toggleItem, dismissItem, restoreAll } =
    useNotifications(expenses, documents, selectedProfileId);
  const badgeCount = isGlobalMuted ? 0 : count;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKey = (e) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      bellRef.current?.focus();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  return (
    <div className="nav-notifications-container" ref={containerRef}>
      <button
        type="button"
        ref={bellRef}
        className={`nav-notifications-btn ${badgeCount > 0 ? 'has-alerts' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={t('common.notifications.title')}
        aria-label={t('common.notifications.title')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isGlobalMuted ? <BellOff size={15} /> : <Bell size={15} />}
        {badgeCount > 0 && <span className="nav-bell-badge">{badgeCount}</span>}
      </button>

      {isOpen && (
        <NavbarNotificationsDropdown
          items={alertList}
          profiles={profiles}
          isMuted={isGlobalMuted}
          onItemClick={handleItemClick}
          onDismiss={dismissItem}
          onOpenCenter={() => { setIsOpen(false); setIsCenterOpen(true); }}
        />
      )}

      <UpcomingDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />

      {isCenterOpen && (
        <NotificationCenterModal
          isOpen
          onClose={() => setIsCenterOpen(false)}
          items={allUpcoming}
          profiles={profiles}
          isDismissed={isDismissed}
          dismissedCount={dismissedCount}
          onToggleVisibility={toggleItem}
          onRestoreAll={restoreAll}
          onViewDetails={(item) => { setIsCenterOpen(false); setActiveItem(item); }}
        />
      )}
    </div>
  );
}
