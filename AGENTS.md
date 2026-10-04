<!-- hub:map:start -->
# MyPlano
> Scadenze, Sinking Funds & Archivio Ricevute > *Web Application reattiva, moderna e orientata alla…
## Mappe
| Area | Mappa | Contenuto |
|---|---|---|
| `Tools/` | [Tools](docs/maps/Tools.md) | Registro Strumenti & Script di Utilità (/Tools) |
| `docs/` | [docs](docs/maps/docs.md) | 6 file, es. 00_idea_base.md, 01_funzionalita_implementate.md, 02_bilancio_e_sinking_funds.md |
| `src/` | [src](docs/maps/src.md) | 6 file in hooks/ |
| `src/components/` | [src-components](docs/maps/src-components.md) | 48 file in layout/, pwa/, ui/ |
| `src/core/` | [src-core](docs/maps/src-core.md) | 56 file in dates/, i18n/, state/, storage/, theme/ … |
| `src/modules/budget/` | [src-modules-budget](docs/maps/src-modules-budget.md) | BudgetOverview, BudgetTab, CashflowTimeline, ColdStartCard, InitialBalanceCard (+1) |
| `src/modules/budget/calculations/` | [src-modules-budget-calculations](docs/maps/src-modules-budget-calculations.md) | 9 file, es. cashflowTimeline.js, coldStartAnalysis.js, coreMetrics.js |
| `src/modules/documents/` | [src-modules-documents](docs/maps/src-modules-documents.md) | DocumentList, DocumentCard, DocumentFormModal |
| `src/modules/expenses/` | [src-modules-expenses](docs/maps/src-modules-expenses.md) | ExpenseList, ExpenseCard, YearGroupedExpenseGrid, ExpenseFormModal, ExpenseHistoryModal |
| `src/modules/profiles/` | [src-modules-profiles](docs/maps/src-modules-profiles.md) | ProfileBar, AddProfileModal, DeleteProfileModal, ProfileModalsContainer, ProfileManagement |
| `src/modules/settings/` | [src-modules-settings](docs/maps/src-modules-settings.md) | SettingsView |
| `src/styles/` | [src-styles](docs/maps/src-styles.md) | 6 file, es. fonts.css, index.css, layout.css |
| `misc` | [misc](docs/maps/misc.md) | file nella root |
## Avvio e test
- servizio `npm run dev`: porta 8104 · `npm run dev -- --port 8104`
- test: `python -m unittest` (dalla root)
## Regole
- globali: `~/.claude/CLAUDE.md` e `~/.gemini/GEMINI.md` (generate da AI-hub)
## Skill attive
- per tag: headless-chrome-cdp, pwa-service-worker-checklist, service-troubleshooting
- del progetto: myplano-pwa
## Non qui
- `.agents/`, `.claude/`, `.github/`: config dei tool AI
- `dist/`, `node_modules/`: dipendenze/generati
<!-- hub:map:end -->
