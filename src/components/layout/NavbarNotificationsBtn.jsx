import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { UpcomingDetailModal } from '../../modules/budget/UpcomingDetailModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { NavbarNotificationsDropdown } from './NavbarNotificationsDropdown';
import { useNotifications } from './useNotifications';
import './NavbarNotificationsBtn.css';

export function NavbarNotificationsBtn({
  expenses = [],
  documents = [],
  selectedProfileId = 'all',
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const containerRef = useRef(null);

  const { allUpcoming, activeList, count, dismissedCount, dismissItem, restoreAll } =
    useNotifications(expenses, documents, selectedProfileId);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleDismiss = (e, id) => {
    e.stopPropagation();
    dismissItem(id);
  };

  return (
    <div className="nav-notifications-container" ref={containerRef}>
      <button
        type="button"
        className={`nav-notifications-btn ${count > 0 ? 'has-alerts' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={t('common.notifications.title')}
        aria-label={t('common.notifications.title')}
      >
        <Bell size={15} />
        {count > 0 && <span className="nav-bell-badge">{count}</span>}
      </button>

      {isOpen && (
        <NavbarNotificationsDropdown
          items={activeList}
          count={count}
          onItemClick={handleItemClick}
          onDismiss={handleDismiss}
          onOpenCenter={() => {
            setIsOpen(false);
            setIsCenterOpen(true);
          }}
        />
      )}

      <UpcomingDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />

      <NotificationCenterModal
        isOpen={isCenterOpen}
        onClose={() => setIsCenterOpen(false)}
        items={allUpcoming}
        dismissedCount={dismissedCount}
        onDismiss={dismissItem}
        onRestoreAll={restoreAll}
        onViewDetails={(item) => {
          setIsCenterOpen(false);
          setActiveItem(item);
        }}
      />
    </div>
  );
}
