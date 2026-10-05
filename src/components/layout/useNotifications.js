import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { getUpcomingDeadlines } from '../../modules/budget/budgetCalculations';
import { todayISO } from '../../core/dates/isoDate';
import {
  getDismissedNotificationIds,
  subscribeDismissedNotifications,
  setDismissedNotificationIds,
  dismissNotificationId,
  restoreNotificationId,
  restoreAllDismissedNotifications,
} from '../../core/storage/notificationStorage';
import { getExpenseAlertDefault, subscribeExpenseAlertDefault } from '../../core/storage/expenseAlertDefault';
import { isItemDismissed, pruneDismissedIds } from './notificationDismissal';

// allUpcoming: every deadline (overdue + upcoming), for the notification center.
// activeList:  not hidden by the user (Budget "upcoming deadlines" card).
// alertList:   not hidden AND with the alert enabled (navbar bell); count = its length.
export function useNotifications(expenses = [], documents = [], selectedProfileId = 'all') {
  const dismissedIds = useSyncExternalStore(
    subscribeDismissedNotifications, getDismissedNotificationIds, getDismissedNotificationIds,
  );
  const expenseAlertDays = useSyncExternalStore(
    subscribeExpenseAlertDefault, getExpenseAlertDefault, getExpenseAlertDefault,
  );
  const today = todayISO();

  const allUpcoming = useMemo(
    () => getUpcomingDeadlines(expenses, documents, selectedProfileId, today, { expenseAlertDays }),
    [expenses, documents, selectedProfileId, today, expenseAlertDays],
  );

  const { activeList, alertList, isDismissed, dismissedCount } = useMemo(() => {
    const set = new Set(dismissedIds);
    const check = (item) => isItemDismissed(item, set);
    const active = allUpcoming.filter((item) => !check(item));
    return {
      activeList: active,
      alertList: active.filter((item) => item.alertEnabled),
      isDismissed: check,
      dismissedCount: allUpcoming.length - active.length,
    };
  }, [allUpcoming, dismissedIds]);

  // Technical cleanup only (ids of deleted items / old dates, legacy ids -> per occurrence).
  useEffect(() => {
    const current = getDismissedNotificationIds();
    const cleaned = pruneDismissedIds(current, expenses, documents, today);
    if (cleaned !== current) setDismissedNotificationIds(cleaned);
  }, [expenses, documents, today]);

  const dismissItem = useCallback((item) => dismissNotificationId(item.id), []);

  const toggleItem = useCallback((item) => {
    if (isDismissed(item)) restoreNotificationId(item.id, ...(item.isNext ? [item.legacyId] : []));
    else dismissNotificationId(item.id);
  }, [isDismissed]);

  const restoreAll = useCallback(() => restoreAllDismissedNotifications(), []);

  return {
    allUpcoming,
    activeList,
    alertList,
    count: alertList.length,
    isDismissed,
    dismissedCount,
    dismissItem,
    toggleItem,
    restoreAll,
  };
}
