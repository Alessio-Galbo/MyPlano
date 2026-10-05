<!-- hub:map:start -->
# Mappa: src/core/i18n/
Torna al [router](../../AGENTS.md) · 13 file
- [formatters.js](../../src/core/i18n/formatters.js): Locale-aware formatters (Intl). Pure functions: pass `lang` explicitly, or omit it
- [i18nContext.jsx](../../src/core/i18n/i18nContext.jsx): Provider lingua it/en salvata in localStorage, funzione t() con segnaposto e fallback
- [index.js](../../src/core/i18n/index.js): Aggregatore i18n: provider, hook useI18n, traduzioni, formattatori
- [locales/en/budget.json](../../src/core/i18n/locales/en/budget.json): chiavi: title, subtitle, metrics, incomeHub, initialBalance, zeroDeficit
- [locales/en/common.json](../../src/core/i18n/locales/en/common.json): chiavi: appName, appSubtitle, loadingTab, pwa, nav, actions
- [locales/en/documents.json](../../src/core/i18n/locales/en/documents.json): chiavi: title, subtitle, addDocument, editDocument, fields, status
- [locales/en/expenses.json](../../src/core/i18n/locales/en/expenses.json): chiavi: title, subtitle, addExpense, editExpense, fields, frequencies
- [locales/it/budget.json](../../src/core/i18n/locales/it/budget.json): chiavi: title, subtitle, metrics, incomeHub, initialBalance, zeroDeficit
- [locales/it/common.json](../../src/core/i18n/locales/it/common.json): chiavi: appName, appSubtitle, loadingTab, pwa, nav, actions
- [locales/it/documents.json](../../src/core/i18n/locales/it/documents.json): chiavi: title, subtitle, addDocument, editDocument, fields, status
- [locales/it/expenses.json](../../src/core/i18n/locales/it/expenses.json): chiavi: title, subtitle, addExpense, editExpense, fields, frequencies
- [translations.js](../../src/core/i18n/translations.js): Unisce i JSON di lingua it/en per common, documenti, spese e budget
- [useFormatters.js](../../src/core/i18n/useFormatters.js): Hook con formattatori di valuta, date, mesi e percentuali legati alla lingua attiva
<!-- hub:map:end -->
