import { translations } from '../../core/i18n';
import { UI_KEYS } from '../../core/storage/storageKeys';
import { buildIcsCalendar } from './icsCalendar';

// Translate function for the current UI language (used when the caller does not pass `t`).
function currentTranslator() {
  let lang = 'it';
  try {
    lang = localStorage.getItem(UI_KEYS.LANGUAGE) || 'it';
  } catch {
    // default language
  }
  const lookup = (root, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), root);
  return (path) => lookup(translations[lang], path) ?? lookup(translations.it, path) ?? path;
}

export function generateIcsCalendar(documents = [], expenses = [], t = currentTranslator()) {
  return buildIcsCalendar(documents, expenses, t);
}

export function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
