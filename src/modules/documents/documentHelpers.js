import { ALERT_THRESHOLDS } from '../../core/types/constants';
import { addMonthsClamped, diffDays, todayISO } from '../../core/dates/isoDate';

export function getDocumentStatus(expiryDateStr) {
  if (!expiryDateStr) return { status: 'valid', daysRemaining: 999 };

  const daysRemaining = diffDays(todayISO(), String(expiryDateStr).slice(0, 10));
  if (Number.isNaN(daysRemaining)) return { status: 'valid', daysRemaining: 999 };

  if (daysRemaining < 0) {
    return { status: 'expired', daysRemaining, variant: 'danger' };
  }
  if (daysRemaining <= ALERT_THRESHOLDS.WARNING_DAYS) {
    return { status: 'expiring', daysRemaining, variant: 'warning' };
  }
  return { status: 'valid', daysRemaining, variant: 'success' };
}

export function calculateRenewalDate(currentDateStr, yearsToAdd = 10) {
  const base = currentDateStr ? String(currentDateStr).slice(0, 10) : todayISO();
  return addMonthsClamped(base, Number(yearsToAdd) * 12) || addMonthsClamped(todayISO(), Number(yearsToAdd) * 12);
}

// Locale-aware (follows the UI language): see core/i18n/formatters.js
export { formatDate } from '../../core/i18n/formatters';

export function getDocumentTypeLabel(type, t) {
  if (!type) return '';
  const key = `documents.types.${type}`;
  const translated = t(key);
  return translated !== key ? translated : type;
}
