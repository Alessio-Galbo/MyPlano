<!-- hub:map:start -->
# Mappa: src/modules/expenses/
Torna al [router](../../AGENTS.md) · 95 file
- [YearGroupedExpenseGrid.css](../../src/modules/expenses/YearGroupedExpenseGrid.css): Stili della griglia spese per anno: timeline, intestazione sticky, badge anno
- [YearGroupedExpenseGrid.jsx](../../src/modules/expenses/YearGroupedExpenseGrid.jsx): Griglia di card spese raggruppate per anno con conteggio rate e totale annuo
- [expenseExpansionHelper.js](../../src/modules/expenses/expenseExpansionHelper.js): Espande le spese ricorrenti in rate per anno secondo il filtro (singolo/intervallo)
- [expenseHelpers.js](../../src/modules/expenses/expenseHelpers.js): Utility spese: prossima scadenza, urgenza, etichetta categoria, badge stato
- [expenseHistoryHelpers.js](../../src/modules/expenses/expenseHistoryHelpers.js): Calcolo di tutte le date rata di una spesa e dettagli (importo, stato, allegati)
- [expenseInstallmentHelpers.js](../../src/modules/expenses/expenseInstallmentHelpers.js): Stato rate (pagata/da pagare), toggle pagamento, date rate nell'anno e prossima scadenza
- [expensePaymentFundHelper.js](../../src/modules/expenses/expensePaymentFundHelper.js): Registra o annulla il pagamento di una rata con eventuale scalo e rimborso dal fondo
- [expenseTreeBuilder.js](../../src/modules/expenses/expenseTreeBuilder.js): Costruisce l'albero anni→spese del Database Hub con ricerca, ordinamenti e filtro anni
- [expenseYearAmountHelper.js](../../src/modules/expenses/expenseYearAmountHelper.js): Calcola l'importo totale di una spesa in un anno sommando le sue rate
- [index.js](../../src/modules/expenses/index.js): Aggregatore del modulo spese: esporta componenti lista, card, modali e helper
- [pastDateHelpers.js](../../src/modules/expenses/pastDateHelpers.js): Verifica date passate, somma mesi con clamp e trova la prossima ricorrenza futura
- [useDatabaseHubPreferences.js](../../src/modules/expenses/useDatabaseHubPreferences.js): Hook preferenze Database Hub salvate in localStorage: ordinamenti e nascondi passati
- [useExpenseDatabaseTree.js](../../src/modules/expenses/useExpenseDatabaseTree.js): Hook albero spese per anno: selezione e anni espansi persistenti, ricerca, mappa date
- [useExpenseDeleteHandler.js](../../src/modules/expenses/useExpenseDeleteHandler.js): Hook eliminazione spese: salta rata, termina serie, elimina, con toast e Annulla
- [useExpenseFilterData.js](../../src/modules/expenses/useExpenseFilterData.js): Hook filtri lista spese: per profilo, espansione nel range anni, categorie e conteggi
- [useExpenseHistoryModalState.js](../../src/modules/expenses/useExpenseHistoryModalState.js): Stato modale storico spesa: rata attiva, step mobile, conferme eliminazione allegati
- [useExpenseListState.js](../../src/modules/expenses/useExpenseListState.js): Stato lista spese: modali, vista persistente, categoria per profilo, range anni
- [useExpensePaymentHandler.js](../../src/modules/expenses/useExpensePaymentHandler.js): Hook pagamento rate: toggle pagato, conferma con scalo dal fondo e rimborso
- [useFixedExpenseHistory.js](../../src/modules/expenses/useFixedExpenseHistory.js): Hook storico spesa fissa: date rate ordinate, stato, allegati, cambio data, extra
- [variableExpenseHelpers.js](../../src/modules/expenses/variableExpenseHelpers.js): Spese variabili: pagamenti del contratto attivo, media, previsione a trend, importo
<!-- hub:map:end -->
