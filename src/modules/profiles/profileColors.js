import { useEffect } from 'react';

// Colours a user can pick for a profile (hue in degrees). null = automatic colour.
export const PROFILE_HUES = [0, 28, 48, 140, 175, 205, 235, 270, 300, 330];

const STYLE_ID = 'myplano-profile-colors';
const classFor = (id) => `prof-dyn-${String(id).replace(/[^a-zA-Z0-9_-]/g, '_')}`;

const ruleFor = (id, hue) => {
  const cls = classFor(id);
  // Doubled class: wins over the automatic colour injected by dynamicThemeService.
  return `.${cls}.${cls} {
  --item-color: hsl(${hue}, 78%, 62%);
  --item-bg: hsla(${hue}, 78%, 60%, 0.14);
  --item-border: hsla(${hue}, 78%, 60%, 0.38);
  --item-text: hsl(${hue}, 78%, 78%);
}`;
};

export const hasCustomHue = (profile) => Number.isFinite(profile?.hue);

// Keeps one <style> tag with the colours chosen by the user, so every place that
// uses ensureProfileClass (navbar, cards, tags…) shows the chosen colour.
export function useProfileColorStyles(profiles) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let tag = document.getElementById(STYLE_ID);
    if (!tag) {
      tag = document.createElement('style');
      tag.id = STYLE_ID;
      document.head.appendChild(tag);
    }
    const css = (profiles || []).filter(hasCustomHue).map((p) => ruleFor(p.id, p.hue)).join('\n');
    tag.textContent = css;
  }, [profiles]);
}
