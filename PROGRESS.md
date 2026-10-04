# MyPlano — Avanzamento lavori

## Ora
- [ ] Aggiornamento automatico dell'app installata: da confermare al prossimo rilascio
- [ ] Fatto, da confermare sul telefono: campo Profilo nei form, elementi senza profilo da assegnare, profili modificabili con Annulla, primo avvio con dati di esempio, notifiche sul dispositivo (apertura + background), avvisi in coda, nuova icona, pulsante Ko-fi

- [ ] Fatto, da confermare sul telefono (`08bced8`): niente scorrimento orizzontale (Nuovo profilo, barra in alto, storico bollette; script `mobile-overflow.mjs`), "Rimuovi gli esempi" quando i dati di esempio sono mescolati ai tuoi, domanda sulle notifiche dopo il primo profilo

## Prossimi
- [ ] Preavviso configurabile per le notifiche delle spese (oggi 30 gg come la campanella)
- [ ] Notifiche su iPhone da verificare su un dispositivo reale (app aggiunta alla Home)
- [~] Sostituire l'icona PWA (generata da `favicon.svg`, logo Vite) con un logo MyPlano → implementato, in attesa di conferma
- [~] Toast: oggi massimo 3 visibili (valutare coda/impilamento) → implementato, in attesa di conferma
- [~] Percentuali del grafico a torta (`CategoryPieChart.jsx`) con il punto anche in italiano → implementato, in attesa di conferma
- [~] Minori dall'audit: preferenze `myplano_ui_*` e strategie del Bilancio non sincronizzate tra schede (`BudgetTab.jsx`); `hub.selectedExpense` non validato; fondi/entrate dei profili eliminati restano in storage (`useProfileState.js`); dopo "azzera" + import il profilo selezionato torna a "Tutti"; su mobile i toast coprono il fondo pagina → implementato, in attesa di conferma
- [x] [approvato per l'AI] Generare le mappe: `hub maps apply "MyPlano" --apply` — da proposta `3c8e9294` (2026-10-04) — fatto: 16 mappe in `docs/maps/`

- [~] Profili nei form: la spesa nuova non ha la scelta del profilo e va sempre nel primo (verificato); il documento parte dal primo profilo invece di quello selezionato — `ExpenseFormModal.jsx:29`, `ExpenseFormFields.jsx`, `DocumentFormModal.jsx:34` → implementato, in attesa di conferma
- [~] Profilo modificabile (oggi solo crea/elimina) e scheda "Profili" in Impostazioni — `src/modules/profiles/`, `SettingsView.jsx` → implementato, in attesa di conferma
- [~] Primo avvio: avviso "Stai vedendo dati di esempio → Inizia da zero / Tienili" e guida al primo profilo; con 0 profili blocchi + "Crea il tuo primo profilo" — `storageService.js`, `App.jsx`, `ConsolidatedProfilesGrid.jsx`, `BudgetOverview.jsx` → implementato, in attesa di conferma
- [~] Import: controllare spese/documenti con profili inesistenti — `backupValidation.js` → implementato, in attesa di conferma
- [~] Eliminazione profilo con "Annulla" o conferma col nome — `DeleteProfileModal.jsx` → implementato, in attesa di conferma
- [~] Stati vuoti con pulsante "Aggiungi", azioni dei documenti più grandi su mobile, testi più chiari ("Dati di Fabbrica"), codice morto `ProfileBar.jsx` → implementato, in attesa di conferma

## Per il futuro
- [ ] Ricerca globale (Ctrl+K) e filtri/ordinamento documenti
- [ ] Vista calendario mensile e grafico del fondo previsto
- [~] Notifiche del browser all'apertura dell'app (senza server non funzionano ad app chiusa: oggi l'alternativa è l'export `.ics`) → implementato, in attesa di conferma
- [ ] Snapshot di backup automatico (oggi il backup è solo manuale)

## Fatto
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
