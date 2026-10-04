---
name: myplano-pwa
description: PWA di MyPlano (vite-plugin-pwa/Workbox, GitHub Pages sotto /MyPlano/, avviso "Nuova versione disponibile", font self-hosted, icone) - comandi, file, scelte e verifica headless completa. Usala quando tocchi vite.config.js/vite.pwa.js, index.html, public/, src/components/pwa/, il workflow Pages, o quando chiedono "funziona offline?", "pubblica", "aggiorna le icone", "il banner di aggiornamento".
---

# MyPlano PWA

Metodo generico (strategie di cache, update flow, hosting statico): skill `pwa-service-worker-checklist`.

## Comandi
- Dev (nessun SW, base `/`): `avvia_myplano.bat` / `Tools/launch_with_qr.py` / `npx vite --port 18516`.
- Build per Pages (base `/MyPlano/`): `npx vite build` → `dist/` con `sw.js`, `workbox-*.js`, `manifest.webmanifest`.
- Build alla radice: `MYPLANO_BASE=/ npx vite build`. Preview: `npx vite preview --port 18526` → `http://localhost:18526/MyPlano/`.
- Verifica completa (≈1 min, ripristina da sola il CSS che modifica per simulare una versione nuova):
  `node .claude/skills/myplano-pwa/scripts/pwa-scenario.mjs` → `ALL OK`; screenshot in `%TEMP%/myplano-pwa-test/`.
- Modalità senza bordi (WCO desktop simulato, fullscreen telefono con notch, modale): `node .claude/skills/myplano-pwa/scripts/display-modes.mjs`.
- Due schede + chunk lazy mancante dopo un deploy: `node .claude/skills/myplano-pwa/scripts/pwa-update-tabs.mjs`.
- Icone da `public/favicon.svg` (Chrome headless): `node .claude/skills/myplano-pwa/scripts/icons.mjs`.

## Dove stanno le cose
- `vite.config.js`: `base` (build e preview `/MyPlano/` o `MYPLANO_BASE`, dev `/`). `vite.pwa.js`: manifest + Workbox.
- `index.html`: `theme-color`, apple-touch-icon, seconda entry `src/components/pwa/registerPwa.js`.
- `src/components/pwa/`: `registerPwa.js` (registrazione, controlli update), `mountUpdatePrompt.jsx` (radice React
  propria con `I18nProvider`, creata solo quando serve), `PwaUpdatePrompt.jsx/.css`, `persistStorage.js`, `chunkReload.js` (`vite:preloadError`),
  `autoUpdate.js` (aggiornamento automatico sicuro), `busyState.js` (dialog aperto / campo con fuoco), `PwaUpdatedToast.jsx`.
- Aspetto installato: `src/components/layout/DisplayModes.css` (importato da `Navbar.jsx`): safe area, modali, WCO.
- Testi: `common.pwa.*` in `src/core/i18n/locales/{it,en}/common.json`.
- Font: `src/styles/fonts.css` (@fontsource-variable Outfit + Plus Jakarta Sans, solo latin/latin-ext, nomi famiglia
  invariati). Icone: `public/pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`, `apple-touch-icon-180.png`.
- Deploy: `.github/workflows/deploy-pages.yml` (push su main → controlli `Tools/` → build → `deploy-pages`;
  `check_i18n_keys.py` esce sempre 0, il workflow cerca `ALL KEYS RESOLVE` nell'output).

## Scelte (e perché)
| Tema | Scelta | Motivo |
|---|---|---|
| SW | `vite-plugin-pwa` generateSW | app statica senza API: elenco precache e revision generati, niente bump a mano |
| Cache | precache (shell, bundle con hash, font, icone) + manifest NetworkFirst fuori precache (`integration.beforeBuildServiceWorker` in `vite.pwa.js`) | nessuna richiesta esterna, dati utente mai nel SW |
| Navigazioni | `navigateFallback: index.html` | Pages non ha fallback SPA |
| Aspetto | `display_override: [window-controls-overlay, fullscreen, standalone]`, `display: standalone`; `viewport-fit=cover`, meta apple-* | desktop senza barra del titolo, Android senza barra di stato, iOS standalone |
| Update | automatico se sicuro: entro 15 s dall'avvio senza interazioni, o app in background senza dialog/campo attivo; banner solo dopo 10 min di attesa con utente attivo; toast "Aggiornato alla nuova versione" | mai ricaricare a metà form; `skipWaiting: false` nel SW, lo decide la pagina |
| Manopole test | sessionStorage `myplano_pwa_early_ms`, `myplano_pwa_banner_after_ms` | gli scenari non aspettano 10 min |
| Form aperto | primo "Aggiorna" con `[role=dialog]` aperto → avviso "modifiche non salvate" | conferma esplicita |
| Altre schede | `controllerchange` non richiesto → banner "aggiornato in un'altra finestra — Aggiorna" | i chunk vecchi non sono più in cache |
| Chunk vecchio | `vite:preloadError` → un solo ricarico (flag `myplano_pwa_chunk_reload_at` in sessionStorage, 60 s) | dopo un deploy le schede lazy puntano a file spariti |
| Controlli | `registration.update()` a `visibilitychange` e ogni ora, solo online | sw.js scavalca la cache HTTP (max-age=600) |
| Persistenza | `storage.persist()`: Chromium a ogni avvio; Firefox una volta, solo installata (`myplano_ui_pwa_persist_asked`) | evitare il popup in scheda normale |

## Verifica prima di dire "fatto"
1. `python Tools/check_line_limits.py`, `python Tools/check_i18n_keys.py`, `npx oxlint src`, `npx vite build`.
2. `pwa-scenario.mjs` → `ALL OK` e leggi gli screenshot (`2-offline.png`, `3-banner-mobile.png`, `4-warning.png`).

## Trappole già incontrate
- La UI del banner caricata con `import()` lazy: dopo l'update fatto da un'altra scheda quel chunk non c'è più, il
  banner "ricarica" falliva e `vite:preloadError` ricaricava la pagina senza chiedere → import statico.
- Headless: `Emulation.setEmulatedMedia` con `display-mode` non fa scattare la media query e le env(titlebar-area-*)
  non esistono → lo script applica la regola WCO con valori di Windows (138×33 px); le safe area si emulano con
  `Emulation.setSafeAreaInsetsOverride`. Aprire una scheda nuova mette davvero in `hidden` le altre.
- `vite preview` gira con `command === 'serve'`: base solo per `build` → preview a `/`, bundle 404, "Manifest syntax error".
- Altri agenti che fanno `vite build` riscrivono `dist/` a metà test → lo scenario builda in una `--outDir` sua.
- `hadController` letto una volta sola: la scheda aperta alla prima installazione non vedeva mai "aggiornato altrove" → controller seguito a ogni `controllerchange`.
- `persisted: false` in headless è normale (profilo nuovo, nessun segnale d'uso).
- Rinominare il repo o passare a un dominio proprio cambia origine/scope: i dati locali restano sulla vecchia origine.
- Repo pubblico: negli script mai percorsi assoluti del PC. Importa il driver con `../../headless-chrome-cdp/scripts/cdp.mjs` e ricava la radice con `fileURLToPath(new URL("../../../../", import.meta.url))`.
- Manifest in precache = le app installate non vedono mai le modifiche (il SW vecchio dà il manifest vecchio). Successo con il passaggio a `display_override` (S25 Ultra con ancora le barre): ora è fuori precache e `pwa-scenario.mjs` lo controlla.
