// Entry PWA (caricato da index.html, separato da main.jsx): registra il Service Worker generato da
// vite-plugin-pwa, controlla gli aggiornamenti e mostra l'avviso "Nuova versione disponibile" solo quando serve.
// In dev (vite) il modulo virtuale non registra nulla: il SW esiste solo nella build.
import { registerSW } from 'virtual:pwa-register';
import { requestPersistentStorage } from './persistStorage.js';
import './chunkReload.js';

const CHECK_EVERY_MS = 60 * 60 * 1000;
let updating = false;

async function showPrompt(mode, onConfirm) {
  const { mountUpdatePrompt } = await import('./mountUpdatePrompt.jsx');
  mountUpdatePrompt(mode, onConfirm);
}

const updateSW = registerSW({
  // SW nuovo installato e in attesa: lo attiva solo il tocco su "Aggiorna" (skipWaiting + ricarica).
  onNeedRefresh() {
    showPrompt('update', () => {
      updating = true;
      updateSW(true);
    });
  },
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;
    // sw.js viene sempre riconvalidato dal browser (updateViaCache "imports"): basta chiedere update().
    const check = () => {
      if (navigator.onLine && registration.installing == null) registration.update().catch(() => {});
    };
    setInterval(check, CHECK_EVERY_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
  },
});

if ('serviceWorker' in navigator) {
  // Controller seguito a ogni cambio: una scheda aperta alla prima installazione (nessun controller, poi
  // clientsClaim) deve comunque accorgersi delle versioni successive.
  let controller = navigator.serviceWorker.controller;
  // Un'altra scheda ha attivato la versione nuova: questa gira ancora sul codice vecchio (i suoi file non sono
  // più in cache). Non si ricarica da sola: si chiede, così un form aperto non va perso.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const hadController = Boolean(controller);
    controller = navigator.serviceWorker.controller;
    if (hadController && !updating) showPrompt('reload', () => window.location.reload());
  });
  navigator.serviceWorker.ready.then(() => requestPersistentStorage()).catch(() => {});
}
