<!-- hub:map:start -->
# Mappa: src/core/notifications/
Torna al [router](../../AGENTS.md) · 10 file
- [alertDays.js](../../src/core/notifications/alertDays.js): Pure: notice window (days before a due date) of expenses. Each expense may set its own `alertDays`;
- [buildMirror.js](../../src/core/notifications/buildMirror.js): Pure: the "mirror" the Service Worker reads to notify with the app closed (public/sw-notify-core.js…
- [environment.js](../../src/core/notifications/environment.js): What this device can do with system notifications (used by the settings card and periodicSync.js).
- [index.js](../../src/core/notifications/index.js): System (OS) notifications without a server: see notifyLifecycle.js and public/sw-notify.js.
- [notifyConstants.js](../../src/core/notifications/notifyConstants.js): Names shared by the page and the Service Worker code in public/sw-notify.js (keep them in sync).
- [notifyDb.js](../../src/core/notifications/notifyDb.js): Tiny key/value IndexedDB store read by the Service Worker (public/sw-notify.js).
- [notifyLifecycle.js](../../src/core/notifications/notifyLifecycle.js): Started once by src/components/pwa/registerPwa.js: keeps the IndexedDB mirror up to date (on data s…
- [periodicSync.js](../../src/core/notifications/periodicSync.js): Periodic Background Sync (Chrome/Edge, installed app only): the browser wakes the Service Worker ab…
- [scheduleMirror.js](../../src/core/notifications/scheduleMirror.js): Writes the mirror (buildMirror.js) to IndexedDB when the data change (see notifyLifecycle.js); skip…
- [swBridge.js](../../src/core/notifications/swBridge.js): Page <-> Service Worker: ask the SW to check and notify (same code as the background check), test
<!-- hub:map:end -->
