// PWA (vite-plugin-pwa + Workbox generateSW). Scelte e motivi: docs in AI-hub skill pwa-service-worker-checklist.
// - Precache di tutta la build (shell HTML, asset con hash, font, icone) TRANNE il manifest: se fosse in precache
//   il SW vecchio continuerebbe a dare al browser il manifest vecchio e un'app installata non vedrebbe mai le
//   modifiche (display, icone, nome). Il manifest va in rete prima, cache solo offline (NetworkFirst).
//   I dati utente restano in localStorage/IndexedDB/File System Access, mai nel SW.
// - registerType "prompt": il SW nuovo resta in attesa finché l'utente non tocca "Aggiorna" (niente reload a metà form).
// - Percorsi relativi (scope/start_url "./"): funzionano sia con base /MyPlano/ (GitHub Pages) sia con base /.
const THEME = '#0b0f19'

export const pwaOptions = {
  registerType: 'prompt',
  injectRegister: false,
  manifest: {
    id: './',
    name: 'MyPlano — Scadenze & Bilancio',
    short_name: 'MyPlano',
    description: 'Scadenzario personale e bilancio di accantonamento, tutto sul tuo dispositivo.',
    lang: 'it',
    start_url: './',
    scope: './',
    // Senza bordi: Chrome/Edge desktop → window-controls-overlay (niente barra del titolo), Android →
    // fullscreen (niente barra di stato), iOS e browser che non conoscono display_override → standalone.
    display_override: ['window-controls-overlay', 'fullscreen', 'standalone'],
    display: 'standalone',
    background_color: THEME,
    theme_color: THEME,
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
    // SPA: ogni navigazione dentro lo scope riceve index.html dalla precache (anche offline).
    navigateFallback: 'index.html',
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: false,
    runtimeCaching: [{
      urlPattern: ({ url }) => url.pathname.endsWith('.webmanifest'),
      handler: 'NetworkFirst',
      options: { cacheName: 'myplano-manifest', networkTimeoutSeconds: 4 },
    }],
  },
  // Il plugin aggiunge sempre il manifest alla precache (additionalManifestEntries): lo si toglie qui.
  integration: {
    beforeBuildServiceWorker(options) {
      const entries = options.workbox.additionalManifestEntries || []
      options.workbox.additionalManifestEntries = entries.filter((e) => !String(e.url ?? e).endsWith('.webmanifest'))
    },
  },
  includeManifestIcons: false, // le icone sono già nel glob: niente voci doppie in precache
  devOptions: { enabled: false },
}
