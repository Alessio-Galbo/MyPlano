// L'utente sta lavorando? Una finestra di dialogo aperta (form di spesa/documento, impostazioni, conferme) o un
// campo con il fuoco può contenere dati non salvati: in quel caso niente ricarichi automatici.
const EDITABLE = 'input:not([type=checkbox]):not([type=radio]):not([type=button]), textarea, select, [contenteditable="true"]';

export function hasOpenDialog() {
  return Boolean(document.querySelector('[role="dialog"], [aria-modal="true"]'));
}

export function isUserBusy() {
  const active = document.activeElement;
  return hasOpenDialog() || Boolean(active && active !== document.body && active.matches?.(EDITABLE));
}
