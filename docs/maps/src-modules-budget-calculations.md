<!-- hub:map:start -->
# Mappa: src/modules/budget/calculations/
Torna al [router](../../AGENTS.md) · 9 file
- [cashflowTimeline.js](../../src/modules/budget/calculations/cashflowTimeline.js): Genera la timeline mensile di cassa: uscite, quota applicata, riserva, strategia sopravvivenza
- [coldStartAnalysis.js](../../src/modules/budget/calculations/coldStartAnalysis.js): Analisi avvio a freddo: deficit massimo, mese peggiore, buffer richiesto e fasi di recupero
- [coreMetrics.js](../../src/modules/budget/calculations/coreMetrics.js): Costo annuo per spesa (frequenze, rate saltate, fine) e quota mensile/scadenze a 30 giorni
- [horizonTotalsHelper.js](../../src/modules/budget/calculations/horizonTotalsHelper.js): Totali delle uscite per categoria sull'orizzonte di N mesi
- [recurrenceHelper.js](../../src/modules/budget/calculations/recurrenceHelper.js): Rate non pagate di una spesa in un intervallo o mese; conteggio e verifica scadenza mensile
- [survivalPhasesHelper.js](../../src/modules/budget/calculations/survivalPhasesHelper.js): Calcola fasi adattive di sopravvivenza con quote mensili maggiorate per evitare deficit
- [timelineGroupingHelper.js](../../src/modules/budget/calculations/timelineGroupingHelper.js): Raggruppa i mesi senza spese della categoria filtrata in periodi unici nella timeline
- [upcomingHelper.js](../../src/modules/budget/calculations/upcomingHelper.js): Scadenze imminenti/scadute di spese e documenti per notifiche, con finestre di avviso
- [zeroDeficitFormula.js](../../src/modules/budget/calculations/zeroDeficitFormula.js): Calcola la quota mensile sicura per non andare mai in deficit sull'orizzonte
<!-- hub:map:end -->
