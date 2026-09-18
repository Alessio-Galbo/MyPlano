import { EXPENSE_CATEGORIES } from '../types/constants';

const GOLDEN_ANGLE = 137.508;
const injectedClasses = new Set();

export function getGoldenHue(key, index = null) {
  if (typeof index === 'number' && index >= 0) {
    return Math.round((index * GOLDEN_ANGLE) % 360);
  }
  const str = String(key || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.round(Math.abs(hash * GOLDEN_ANGLE) % 360);
}

export function getCategoryHue(category) {
  const idx = EXPENSE_CATEGORIES.indexOf(category);
  return getGoldenHue(category, idx >= 0 ? idx : null);
}

export function getCategoryColor(category) {
  return `hsl(${getCategoryHue(category)}, 78%, 62%)`;
}

export function ensureCategoryClass(category) {
  if (!category) return '';
  const safe = String(category).replace(/[^a-zA-Z0-9_-]/g, '_');
  const className = `cat-dyn-${safe}`;
  injectThemeClass(className, getCategoryHue(category));
  return className;
}

export function getProfileHue(profileId, index = null) {
  return getGoldenHue(profileId, index);
}

export function getProfileColor(profileId, index = null) {
  return `hsl(${getProfileHue(profileId, index)}, 78%, 62%)`;
}

export function ensureProfileClass(profileId, index = null) {
  if (!profileId) return '';
  const safe = String(profileId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const className = `prof-dyn-${safe}`;
  injectThemeClass(className, getProfileHue(profileId, index));
  return className;
}

export function ensureThemeClass(key, index = null) {
  if (!key) return '';
  const safe = String(key).replace(/[^a-zA-Z0-9_-]/g, '_');
  const className = `color-key-${safe}`;
  injectThemeClass(className, getGoldenHue(key, index));
  return className;
}

export function getGoldenHexColor(key, index = null) {
  return `hsl(${getGoldenHue(key, index)}, 78%, 62%)`;
}

function injectThemeClass(className, hue) {
  if (typeof document === 'undefined' || injectedClasses.has(className)) return;
  const css = `
    .${className} {
      --item-color: hsl(${hue}, 78%, 62%);
      --item-bg: hsla(${hue}, 78%, 60%, 0.14);
      --item-border: hsla(${hue}, 78%, 60%, 0.38);
      --item-text: hsl(${hue}, 78%, 78%);
    }
  `;
  let styleTag = document.getElementById('myplano-dynamic-theme');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'myplano-dynamic-theme';
    document.head.appendChild(styleTag);
  }
  styleTag.appendChild(document.createTextNode(css));
  injectedClasses.add(className);
}
