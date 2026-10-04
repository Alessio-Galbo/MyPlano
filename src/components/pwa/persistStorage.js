// Archiviazione persistente: chiede al browser di non cancellare localStorage/IndexedDB sotto pressione di spazio.
// Chromium decide in silenzio (app installata, segnalibro, uso frequente): si può chiedere a ogni avvio.
// Firefox mostra un popup: lì si chiede una volta sola e solo con l'app installata (finestra standalone).
import { UI_PREFIX } from '../../core/storage/storageKeys.js';

const ASKED_KEY = `${UI_PREFIX}pwa_persist_asked`;

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isSilentBrowser = () => Boolean(navigator.userAgentData); // Chromium: nessun popup

function readAsked() {
  try { return localStorage.getItem(ASKED_KEY) === '1'; } catch { return false; }
}

function markAsked() {
  try { localStorage.setItem(ASKED_KEY, '1'); } catch { /* storage non disponibile: si riproverà */ }
}

export async function requestPersistentStorage({ force = false } = {}) {
  const storage = navigator.storage;
  if (!storage?.persist || !storage.persisted) return false;
  try {
    if (await storage.persisted()) return true;
    const silent = isSilentBrowser();
    if (!silent && (readAsked() || (!isStandalone() && !force))) return false;
    if (!silent) markAsked();
    return await storage.persist();
  } catch {
    return false;
  }
}

// Installazione dall'interno del browser: è il momento giusto per chiedere (anche dove c'è un popup).
window.addEventListener('appinstalled', () => { requestPersistentStorage({ force: true }); });
