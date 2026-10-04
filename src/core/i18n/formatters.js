// Locale-aware formatters (Intl). Pure functions: pass `lang` explicitly, or omit it
// to use the language the I18nProvider is currently rendering ('it' | 'en').
// English uses en-GB: the app works in EUR and day-first dates, so en-US (month-first)
// would make "04/10/2026" ambiguous next to Italian data.
import { parseISODate } from '../dates/isoDate.js';

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
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

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
  const date = iso ? toDate(iso) : null;
  if (!date) return '-';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return cached('d', getFormatLocale(lang), options, Intl.DateTimeFormat).format(date);
}

// "4 ott" / "4 Oct"
export function formatShortDate(iso, lang) {
  const date = iso ? toDate(iso) : null;
  if (!date) return '-';
  return cached('d', getFormatLocale(lang), { day: 'numeric', month: 'short' }, Intl.DateTimeFormat).format(date);
}

// Month name, capitalized: "Ottobre" / "October" (style 'long' | 'short').
export function formatMonthName(value, style = 'long', lang) {
  const date = toDate(value);
  if (!date) return '';
  return capitalize(cached('d', getFormatLocale(lang), { month: style }, Intl.DateTimeFormat).format(date));
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
  if (isNaN(date)) return '-';
  const options = { dateStyle: 'short', timeStyle: 'short' };
  return cached('d', getFormatLocale(lang), options, Intl.DateTimeFormat).format(date);
}
