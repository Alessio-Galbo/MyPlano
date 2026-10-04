// Entry PWA (caricato da index.html, separato da main.jsx): registra il Service Worker generato da
// vite-plugin-pwa, controlla gli aggiornamenti e li applica da solo quando l'utente non sta lavorando
// (autoUpdate.js); il banner "Nuova versione disponibile" resta come ripiego.
// In dev (vite) il modulo virtuale non registra nulla: il SW esiste solo nella build.
import { registerSW } from 'virtual:pwa-register';
import { requestPersistentStorage } from './persistStorage.js';
import { offerUpdate, consumeUpdatedFlag } from './autoUpdate.js';
import { mountUpdatePrompt, mountUpdatedToast } from './mountUpdatePrompt.jsx';
import './chunkReload.js';

const CHECK_EVERY_MS = 60 * 60 * 1000;
let updating = false;

// UI importata staticamente: un chunk lazy della versione vecchia non è più in cache dopo l'aggiornamento
// fatto da un'altra scheda, e proprio il banner "ricarica" non si caricherebbe.
const showBanner = (mode, onConfirm) => mountUpdatePrompt(mode, onConfirm);

const updateSW = registerSW({
  // SW nuovo installato e in attesa: skipWaiting + ricarica, da solo se sicuro, altrimenti dal banner.
  onNeedRefresh() {
    offerUpdate('update', () => {
      updating = true;
      updateSW(true);
    }, showBanner);
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

if (consumeUpdatedFlag()) mountUpdatedToast();

if ('serviceWorker' in navigator) {
  // Controller seguito a ogni cambio: una scheda aperta alla prima installazione (nessun controller, poi
  // clientsClaim) deve comunque accorgersi delle versioni successive.
  let controller = navigator.serviceWorker.controller;
  // Un'altra scheda ha attivato la versione nuova: questa gira ancora sul codice vecchio (i suoi file non sono
  // più in cache). Stessa regola: ricarico automatico solo se l'utente non sta lavorando.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const hadController = Boolean(controller);
    controller = navigator.serviceWorker.controller;
    if (hadController && !updating) offerUpdate('reload', () => window.location.reload(), showBanner);
  });
  navigator.serviceWorker.ready.then(() => requestPersistentStorage()).catch(() => {});
}
