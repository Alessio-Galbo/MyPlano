# MyPlano — Avanzamento lavori

## Ora
- [ ] Pubblicazione: rendere pubblico il repo, Pages → Source: GitHub Actions, push su `main` (passi in `README.md`)

## Prossimi
- [ ] Sostituire l'icona PWA (generata da `favicon.svg`, logo Vite) con un logo MyPlano
- [ ] Toast: oggi massimo 3 visibili (valutare coda/impilamento)
- [ ] Percentuali del grafico a torta (`CategoryPieChart.jsx`) con il punto anche in italiano
- [ ] Minori dall'audit: preferenze `myplano_ui_*` e strategie del Bilancio non sincronizzate tra schede (`BudgetTab.jsx`); `hub.selectedExpense` non validato; fondi/entrate dei profili eliminati restano in storage (`useProfileState.js`); dopo "azzera" + import il profilo selezionato torna a "Tutti"; su mobile i toast coprono il fondo pagina

## Per il futuro
- [ ] Ricerca globale (Ctrl+K) e filtri/ordinamento documenti
- [ ] Vista calendario mensile e grafico del fondo previsto
- [ ] Notifiche del browser all'apertura dell'app (senza server non funzionano ad app chiusa: oggi l'alternativa è l'export `.ics`)
- [ ] Snapshot di backup automatico (oggi il backup è solo manuale)

## Fatto
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
