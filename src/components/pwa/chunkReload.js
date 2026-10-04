// Chunk di una versione vecchia non più scaricabile (dopo un deploy le schede lazy di lazyTabs.js puntano a file
// che non esistono più, né in rete né nella precache): Vite emette "vite:preloadError". Si ricarica UNA volta
// per avere la versione nuova; se il problema si ripete entro un minuto si lascia passare l'errore
// (ErrorBoundary) invece di ricaricare all'infinito. Succede aprendo una scheda: non c'è un form a metà.
const FLAG = 'myplano_pwa_chunk_reload_at';
const RETRY_AFTER_MS = 60 * 1000;

function lastReload() {
  try { return Number(sessionStorage.getItem(FLAG)) || 0; } catch { return Date.now(); }
}

window.addEventListener('vite:preloadError', (event) => {
  if (Date.now() - lastReload() < RETRY_AFTER_MS) return;
  try { sessionStorage.setItem(FLAG, String(Date.now())); } catch { return; }
  event.preventDefault();
  window.location.reload();
});
