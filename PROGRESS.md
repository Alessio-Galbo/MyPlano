# MyPlano — Avanzamento lavori

## Ora
- [ ] Icona dell'app senza bordi neri (maskable a tutto campo, apple-touch opaca) + skill generica AI-hub `app-icon-generation` — fatto, da confermare sul telefono
- [ ] Tolta la card "Profili" da Impostazioni (doppione del selettore in alto) — fatto, da confermare
- [ ] Preavviso configurabile per le spese ("Avvisami N giorni prima" + predefinito in Impostazioni) — fatto, da confermare — `alertDays.js`, `ExpenseAlertFields.jsx`, `ExpenseAlertDefaultRow.jsx`

## Da confermare (implementato, in attesa di prova)
- [ ] Aggiornamento automatico dell'app installata ("Aggiornato alla nuova versione")
- [ ] Notifiche sul dispositivo (Impostazioni → Notifiche sul dispositivo, notifica di prova, avvisi in background su Android)
- [ ] Elementi senza profilo: banner in Bilancio + card in Impostazioni + riepilogo all'import — `src/core/profiles/`, `OrphanItemsCard.jsx`
- [ ] Preferenze e strategie del Bilancio allineate tra schede aperte; selezione Hub di spesa eliminata
- [ ] Pulsante Ko-fi in Impostazioni ("Supporta MyPlano")

## Prossimi
- [ ] Notifiche su iPhone da verificare su un dispositivo reale (app aggiunta alla Home)

## Per il futuro
- [ ] Ricerca globale (Ctrl+K) e filtri/ordinamento documenti
- [ ] Vista calendario mensile e grafico del fondo previsto
- [ ] Snapshot di backup automatico (oggi il backup è solo manuale)

## Fatto
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
