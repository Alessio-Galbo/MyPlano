# MyPlano — Avanzamento lavori

## Ora
- [ ] Preavviso configurabile per le spese ("Avvisami N giorni prima" + predefinito in Impostazioni) — fatto, da confermare — `alertDays.js`, `ExpenseAlertFields.jsx`, `ExpenseAlertDefaultRow.jsx`

## Prossimi
- [ ] Notifiche su iPhone da verificare su un dispositivo reale (app aggiunta alla Home)

## Per il futuro
- [ ] Ricerca globale (Ctrl+K) e filtri/ordinamento documenti
- [ ] Vista calendario mensile e grafico del fondo previsto
- [ ] Snapshot di backup automatico (oggi il backup è solo manuale)

## Fatto
- [x] [approvato per l'AI] Strumento per `python Tools/check_line_limits.py` (proposta `06d7eda7`): usa AI-hub se c'è, altrimenti `Tools/line_limits_fallback.py` con le regole di `.linelimits` — prova: stessi risultati nei due modi (404 file, 0 oltre, 14 in avviso), exit 1 con un file da 101 righe, deploy GitHub verde
- [x] Confermati dall'utente il 2026-10-05 (2): icona senza bordi neri (+ skill `app-icon-generation`), card Profili tolta da Impostazioni, aggiornamento automatico dell'app installata, notifiche sul dispositivo, elementi senza profilo, preferenze e strategie tra schede, pulsante Ko-fi — commit `902021d`, `c37675a`
- [x] Confermati dall'utente il 2026-10-05: avvisi in coda (toast), percentuali della torta, profilo corrente nella nuova spesa, primo avvio e onboarding (anche domanda notifiche), eliminazione profilo con Annulla, profilo modificabile, niente scorrimento orizzontale su telefono, "Rimuovi gli esempi" — commit `902021d`, `08bced8`
- [x] [approvato per l'AI] Mappe del progetto: `hub maps apply "MyPlano" --apply` — 16 mappe in `docs/maps/`
- [x] App installata senza bordi (confermato dall'utente su S25 Ultra/Chrome dopo reinstallazione; manifest fuori precache, `890b5c5`)
- [x] Pubblicazione su GitHub Pages (repo pubblico, Source: GitHub Actions) — `.github/workflows/deploy-pages.yml`
- [x] **Date e ricorrenze**: rate nel giorno giusto (fuso orario/ora legale), fine mese, frequenze "ogni N giorni", `endDate`/`excludedDates` nel bilancio — `src/core/dates/`, `expenseInstallmentHelpers.js`, `budget/calculations/*`
- [x] **Notifiche**: rispetto di promemoria/preavviso/silenzioso, gruppo "Scaduti", id per occorrenza, stato condiviso tra campanella e Bilancio, ICS con promemoria e ricorrenze — `upcomingHelper.js`, `useNotifications.js`, `icsExportHelper.js`
- [x] **Robustezza dati**: niente perdite con salvataggi ravvicinati, dati corrotti/memoria piena gestiti, schema versionato, sincronizzazione tra schede, Error Boundary — `useAppData.js`, `safeStorage.js`, `migrations.js`
- [x] **Backup**: import validato con conferma e rollback, export completo (anche allegati), reset completo, ricevute mai sovrascritte — `exportImportService.js`, `archiveService.js`
- [x] **Interfaccia**: preferenze ricordate tra sessioni, avvisi con "Annulla", conferma eliminazione documenti, accessibilità modali/navbar — `usePersistentState.js`, `Toast*`, `Modal.jsx`
- [x] **PWA + GitHub Pages**: installabile, offline, font locali, avviso aggiornamento, deploy automatico; skill di caching aggiornata
- [x] Card e avviso "Correggi date delle rate" (rate pagate salvate col giorno prima, anche 2-3 giorni) — `installmentKeyAudit.js`, `InstallmentKeyFixCard.jsx`, `InstallmentFixBanner.jsx`
- [x] Audit finale del giro (scenario con dati della versione precedente) e correzioni: Annulla solo sul campo toccato, import davvero tutto-o-niente, notifiche nascoste stabili, ricarica dopo nuovo deploy, test nel workflow di pubblicazione
- [x] Traduzioni complete e valute/date secondo la lingua (`src/core/i18n/`, `useFormatters`); `t(key, vars)` con interpolazione
- [x] Prestazioni: schede Documenti/Spese/Impostazioni caricate a richiesta (JS iniziale 486 → 321 kB) e calcoli del Bilancio memorizzati (`useMemo`)
- [x] Scadenze nuove salvate senza `id` (non comparivano / si nascondevano tutte) — commit `5b0f896`
