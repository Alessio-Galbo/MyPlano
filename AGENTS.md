<!-- hub:map:start -->
# MyPlano
> Scadenze, Sinking Funds & Archivio Ricevute > *Web Application reattiva, moderna e orientata alla privacy per la pianificazione finanziaria e la gestione delle scadenze del tuo nucleo.*
## Mappe
| Area | Mappa | Contenuto |
|---|---|---|
| `Tools/` | [Tools](docs/maps/Tools.md) | Registro Strumenti & Script di Utilità |
| `docs/` | [docs](docs/maps/docs.md) | 6 file in archivio/ |
| `src/` | [src](docs/maps/src.md) | 4 file, es. App.css, App.jsx, index.css |
| `src/components/` | [src-components](docs/maps/src-components.md) | 65 file in layout/, onboarding/, pwa/, ui/ |
| `src/core/dates/` | [src-core-dates](docs/maps/src-core-dates.md) | 4 file, es. installmentKeyAudit.js, isoDate.js, recurrence.js |
| `src/core/i18n/` | [src-core-i18n](docs/maps/src-core-i18n.md) | I18nProvider, useI18n, translations, useFormatters |
| `src/core/notifications/` | [src-core-notifications](docs/maps/src-core-notifications.md) | System (OS) notifications without a server: see notifyLifecycle.js and public/sw-notify.js |
| `src/core/profiles/` | [src-core-profiles](docs/maps/src-core-profiles.md) | hasProfile, pickInitialProfileId, findOrphanItems, orphanKey, assignOrphanItems (+3) |
| `src/core/state/` | [src-core-state](docs/maps/src-core-state.md) | AppProvider, useApp, useAppData |
| `src/core/storage/` | [src-core-storage](docs/maps/src-core-storage.md) | Punto di accesso dell'archivio locale: servizio dati, dati iniziali e backup automatico. |
| `src/core/theme/` | [src-core-theme](docs/maps/src-core-theme.md) | 3 file, es. colorHelpers.js, colors.css, dynamicThemeService.js |
| `src/hooks/` | [src-hooks](docs/maps/src-hooks.md) | 3 file, es. useAutoBackupLifecycle.js, useCarousel.js, usePersistentState.js |
| `src/modules/budget/` | [src-modules-budget](docs/maps/src-modules-budget.md) | BudgetOverview, BudgetTab, CashflowTimeline, ColdStartCard, InitialBalanceCard (+1) |
| `src/modules/budget/calculations/` | [src-modules-budget-calculations](docs/maps/src-modules-budget-calculations.md) | 9 file, es. cashflowTimeline.js, coldStartAnalysis.js, coreMetrics.js |
| `src/modules/documents/` | [src-modules-documents](docs/maps/src-modules-documents.md) | DocumentList, DocumentCard, DocumentFormModal |
| `src/modules/expenses/` | [src-modules-expenses](docs/maps/src-modules-expenses.md) | ExpenseList, ExpenseCard, YearGroupedExpenseGrid, ExpenseFormModal, ExpenseHistoryModal |
| `src/modules/profiles/` | [src-modules-profiles](docs/maps/src-modules-profiles.md) | AddProfileModal, DeleteProfileModal, ProfileModalsContainer, ProfileManagementModal, usePr |
| `src/modules/settings/` | [src-modules-settings](docs/maps/src-modules-settings.md) | Esporta la schermata Impostazioni, la scheda del backup automatico e gli helper per il cal |
| `src/shared/` | [src-shared](docs/maps/src-shared.md) | 6 file in date-format/ |
| `src/styles/` | [src-styles](docs/maps/src-styles.md) | 6 file, es. fonts.css, index.css, layout.css |
| `misc` | [misc](docs/maps/misc.md) | file nella root e cartelle piccole: public/, src/ |
## Avvio e test
- servizio `npm run dev`: porta 8104 · `npm run dev -- --port 8104`
- test: `python -m unittest` (dalla root)
## Regole
- globali: `~/.claude/CLAUDE.md` e `~/.gemini/GEMINI.md` (generate da AI-hub)
## Skill attive
- per tag: app-icon-generation, headless-chrome-cdp, modern-web-guidance, public-repo-hygiene, pwa-service-worker-checklist, service-troubleshooting, web-share-social-preview
- del progetto: myplano-pwa
## Non qui
- `.agents/`, `.claude/`, `.github/`: config dei tool AI
- `__pycache__/`, `dist/`, `node_modules/`: dipendenze/generati
<!-- hub:map:end -->
