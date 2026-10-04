import { useMemo } from 'react';
import { useI18n } from './i18nContext';
import {
  formatCurrency, formatDate, formatShortDate, formatMonthName, formatMonthYear, formatDateTime, formatPercent,
  getFormatLocale,
} from './formatters';

// Formatters bound to the current UI language (re-created when the language changes).
export function useFormatters() {
  const { language } = useI18n();
  return useMemo(() => ({
    locale: getFormatLocale(language),
    formatCurrency: (n, opts) => formatCurrency(n, opts, language),
    formatDate: (iso) => formatDate(iso, language),
    formatShortDate: (iso) => formatShortDate(iso, language),
    formatMonthName: (v, style) => formatMonthName(v, style, language),
    formatMonthYear: (v, style) => formatMonthYear(v, style, language),
    formatDateTime: (v) => formatDateTime(v, language),
    formatPercent: (v, digits) => formatPercent(v, digits, language),
  }), [language]);
}
