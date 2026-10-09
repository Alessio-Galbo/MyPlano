// Locale-aware formatters (Intl). Pure functions: pass `lang` explicitly, or omit it
// to use the language the I18nProvider is currently rendering ('it' | 'en').
// English uses en-GB: the app works in EUR and day-first dates, so en-US (month-first)
// would make "04/10/2026" ambiguous next to Italian data.
import { parseISODate } from '../dates/isoDate.js';
import { formatDate as formatWith } from '../../shared/date-format/index.js';

export const LOCALES = { it: 'it-IT', en: 'en-GB' };
let currentLanguage = 'it';
const cache = new Map();

export function setFormatLanguage(lang) {
  if (LOCALES[lang]) currentLanguage = lang;
}

export function getFormatLocale(lang = currentLanguage) {
  return LOCALES[lang] || LOCALES.it;
}

function cached(kind, locale, options, Ctor) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  if (!cache.has(key)) cache.set(key, new Ctor(locale, options));
  return cache.get(key);
}

const toDate = (value) => (value instanceof Date ? value : parseISODate(String(value || '')));

// formatCurrency(12.5) -> "12,50 €" (it) / "€12.50" (en). opts.maximumFractionDigits: 0 for round values.
export function formatCurrency(amount, opts = {}, lang) {
  const { maximumFractionDigits = 2 } = opts;
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  };
  return cached('n', getFormatLocale(lang), options, Intl.NumberFormat).format(Number(amount || 0));
}

// 'YYYY-MM-DD' -> "04/10/2026" (it and en-GB are both day-first). Empty -> '-'.
export function formatDate(iso, lang) {
  return formatWith(iso ? toDate(iso) : null, { locale: getFormatLocale(lang), preset: 'numeric', fallback: '-' });
}

// "4 ott" / "4 Oct"
export function formatShortDate(iso, lang) {
  return formatWith(iso ? toDate(iso) : null, { locale: getFormatLocale(lang), preset: 'dayMonth', fallback: '-' });
}

// Month name, capitalized: "Ottobre" / "October" (style 'long' | 'short').
export function formatMonthName(value, style = 'long', lang) {
  return formatWith(toDate(value), { locale: getFormatLocale(lang), intl: { month: style }, capitalize: true });
}

// "Ottobre 2026" / "October 2026"
export function formatMonthYear(value, style = 'long', lang) {
  const date = toDate(value);
  if (!date) return '';
  return `${formatMonthName(date, style, lang)} ${date.getFullYear()}`;
}

// Timestamp (ISO with time or Date) -> local date + time.
export function formatDateTime(value, lang) {
  const date = value instanceof Date ? value : new Date(value);
  return formatWith(date, { locale: getFormatLocale(lang), preset: 'short', fallback: '-' });
}

// formatPercent(12.5) -> "12,5%" (it) / "12.5%" (en). Input is already a percentage (0-100).
export function formatPercent(value, digits = 1, lang) {
  const options = { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits };
  return cached('n', getFormatLocale(lang), options, Intl.NumberFormat).format(Number(value || 0) / 100);
}
