// Aggiornamento automatico SICURO: una versione nuova (SW in attesa, o attivata da un'altra scheda) si applica
// da sola solo quando l'utente non sta lavorando:
//   a) nei primi secondi dall'avvio, prima di qualunque interazione;
//   b) quando l'app va in background (visibilitychange → hidden) senza finestre o campi in modifica.
// Se resta in attesa a lungo con l'utente attivo compare il banner (scelta manuale, come prima).
// Dopo il ricarico, un toast discreto conferma "Aggiornato alla nuova versione".
import { isUserBusy } from './busyState.js';

const UPDATED_FLAG = 'myplano_pwa_updated';
// Manopole per i test headless (sessionStorage): altrimenti 15 s e 10 min.
const knob = (key, dflt) => {
  try { return Number(sessionStorage.getItem(key)) || dflt; } catch { return dflt; }
};
const EARLY_MS = knob('myplano_pwa_early_ms', 15000);
const BANNER_AFTER_MS = knob('myplano_pwa_banner_after_ms', 10 * 60 * 1000);

let interacted = false;
let pending = null;
let bannerTimer = null;

for (const type of ['pointerdown', 'keydown', 'click', 'input']) {
  window.addEventListener(type, () => { interacted = true; }, { capture: true, passive: true });
}

function run(apply) {
  try { sessionStorage.setItem(UPDATED_FLAG, '1'); } catch { /* il toast non comparirà, l'update sì */ }
  apply();
}

function tryApply() {
  if (!pending || isUserBusy()) return false;
  const early = !interacted && performance.now() < EARLY_MS;
  if (!early && document.visibilityState !== 'hidden') return false;
  const { apply } = pending;
  pending = null;
  clearTimeout(bannerTimer);
  run(apply);
  return true;
}

// mode "update" (SW nuovo in attesa) o "reload" (versione attivata da un'altra scheda).
export function offerUpdate(mode, apply, showBanner) {
  pending = { mode, apply };
  if (tryApply()) return;
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    if (pending) showBanner(mode, () => run(apply));
  }, BANNER_AFTER_MS);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') tryApply();
});

export function consumeUpdatedFlag() {
  try {
    const done = sessionStorage.getItem(UPDATED_FLAG) === '1';
    sessionStorage.removeItem(UPDATED_FLAG);
    return done;
  } catch {
    return false;
  }
}
