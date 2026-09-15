import { ALERT_THRESHOLDS } from '../../core/types/constants';

export function getDocumentStatus(expiryDateStr) {
  if (!expiryDateStr) return { status: 'valid', daysRemaining: 999 };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: 'expired', daysRemaining, variant: 'danger' };
  }
  if (daysRemaining <= ALERT_THRESHOLDS.WARNING_DAYS) {
    return { status: 'expiring', daysRemaining, variant: 'warning' };
  }
  return { status: 'valid', daysRemaining, variant: 'success' };
}

export function calculateRenewalDate(currentDateStr, yearsToAdd = 10) {
  const base = currentDateStr ? new Date(currentDateStr) : new Date();
  base.setFullYear(base.getFullYear() + yearsToAdd);
  return base.toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getDocumentTypeLabel(type, t) {
  if (!type) return '';
  const key = `documents.types.${type}`;
  const translated = t(key);
  return translated !== key ? translated : type;
}
