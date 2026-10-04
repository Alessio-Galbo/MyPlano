import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { UI_KEYS } from '../storage/storageKeys';
import { setFormatLanguage } from './formatters';

const I18nContext = createContext(null);
const STORAGE_KEY = UI_KEYS.LANGUAGE;

function lookup(lang, keys) {
  let current = translations[lang];
  for (const key of keys) {
    if (!current || current[key] === undefined) return undefined;
    current = current[key];
  }
  return current;
}

// Replaces {name} placeholders with vars.name (unknown placeholders are left as they are).
function interpolate(text, vars) {
  if (!vars || typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? String(vars[name]) : match));
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'it' || saved === 'en' ? saved : 'it';
    } catch {
      return 'it';
    }
  });
  // Non-React formatters (formatters.js) follow the language being rendered.
  setFormatLanguage(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setFormatLanguage(lang);
      setLanguageState(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  // t(key) or t(key, { name: value }) for "{name}" placeholders. Falls back to Italian, then to the key.
  const t = (path, vars) => {
    const keys = path.split('.');
    const value = lookup(language, keys) ?? lookup('it', keys);
    return value === undefined ? path : interpolate(value, vars);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
