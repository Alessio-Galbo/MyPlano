import { getGoldenHexColor, getCategoryColor, getProfileColor } from './dynamicThemeService';

export const PALETTE = [
  '#7c5dfa',
  '#38bdf8',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#14b8a6',
  '#6366f1',
];

export function getProfileColorIndex(profile, profilesList = []) {
  if (!profile) return 0;
  const idx = profilesList.findIndex((p) => p.id === profile.id);
  return idx !== -1 ? idx : 0;
}

export function getCategoryColorIndex(category, categoriesList = []) {
  if (!category) return 0;
  const idx = categoriesList.indexOf(category);
  return idx !== -1 ? idx : 0;
}

export function getHexColor(index) {
  return getGoldenHexColor(null, index);
}

export { getGoldenHexColor, getCategoryColor, getProfileColor };
