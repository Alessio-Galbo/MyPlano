import { useCallback, useEffect } from 'react';
import { announceDataChange, useOpenNotificationCenterRequest } from '../../core/state/uiActions';

// Behaviour of the navbar bell: closes the dropdown on outside click / Escape, opens the notification
// center on request (e.g. a click on a system notification) and tells the system notifications when
// the global mute changes (their Service Worker mirror must follow it right away).
export function useNavbarNotificationsBehavior({ isOpen, setIsOpen, setIsCenterOpen, containerRef, bellRef, isGlobalMuted }) {
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
  }, [isOpen, setIsOpen, containerRef, bellRef]);

  const openCenter = useCallback(() => {
    setIsOpen(false);
    setIsCenterOpen(true);
  }, [setIsOpen, setIsCenterOpen]);
  useOpenNotificationCenterRequest(openCenter);

  useEffect(() => { announceDataChange(); }, [isGlobalMuted]);
}
