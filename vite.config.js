import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaOptions } from './vite.pwa.js'

// Base URL: GitHub Pages serves the app under /MyPlano/ (build default); the dev server
// (avvia_myplano.bat / Tools/launch_with_qr.py) stays at /; `vite preview` uses the build base. Root build: MYPLANO_BASE=/.
// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? (process.env.MYPLANO_BASE || '/MyPlano/') : '/',
  plugins: [react(), VitePWA(pwaOptions)],
}))
