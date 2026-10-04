# Changelog

Tutti i cambiamenti degni di nota a questo progetto sono documentati in questo file.
Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [Non rilasciato]

### Aggiunto
- **Notifiche & Scadenze**: campanella nella navbar con conteggio delle scadenze imminenti (spese: 30 giorni; documenti: i giorni di preavviso di ciascun documento), menu rapido e *Centro Gestione Notifiche* per nascondere/mostrare le singole voci o ripristinarle tutte; pallino colore del profilo su ogni voce.
- **Scadenze Imminenti**: card nel Bilancio con elenco dettagliato (importo, data, giorni mancanti, profilo), modale di dettaglio, versione consolidata per la vista d'insieme del nucleo e carosello KPI scorrevole su mobile.
- **Installabile e offline (PWA)**: si installa dal browser, funziona senza connessione, usa font locali (nessuna richiesta esterna) e avvisa con "Nuova versione disponibile - Più tardi / Aggiorna". Indirizzo previsto: `https://alessio-galbo.github.io/MyPlano/`; chiede al browser l'archiviazione persistente.
- **App installata senza bordi e con aggiornamento automatico**: barra del titolo integrata nella navbar su PC, schermo intero su Android, barra di stato trasparente su iPhone; la nuova versione si installa da sola quando l'app non è in uso (avviso solo se si sta lavorando).
- **Notifiche**: gruppo rosso "Scaduti / in ritardo" in cima, una notifica per ogni scadenza (nascondere la bolletta di ottobre non nasconde novembre), "Silenzia tutte" con campanella barrata, tab del centro notifiche ricordata.
- **Export `.ics`**: una serie ricorrente per spesa (con fine, esclusioni e date aggiunte) e promemoria (3 giorni per le spese, giorni di preavviso per i documenti).
- **Backup v3 con allegati**: opzione "Includi allegati" per le ricevute salvate nel browser, riepilogo con conferma prima dell'import, scrittura tutto-o-niente con ripristino se fallisce, "Ultimo backup: oggi/ieri/N giorni fa".
- **Correggi date delle rate**: card in Impostazioni che propone, con caselle da spuntare, di correggere le rate pagate salvate col giorno prima; nulla è automatico.
- **Preferenze ricordate**: scheda, profilo (anche "tutti"), vista spese, filtro categoria, intervallo anni, timeline, Hub Archivio e "includi allegati".
- **Avvisi con "Annulla"** dopo salvataggio, eliminazione, "salta rata" e "interrompi"; conferma prima di eliminare un documento.
- **Accessibilità**: focus nei modali, Esc chiude solo il modale in primo piano, navbar con scheda attiva indicata.
- **Schermata di errore** con "Scarica dati grezzi (JSON)" e "Ricarica", senza reset.

### Modificato
- **Lingua**: valute e date seguono la lingua scelta (l'inglese usa giorno/mese ed euro); tradotti i testi rimasti in italiano (tabella bollette, durata documenti, etichette accessibili, placeholder).
- **Scadenze imminenti**: i documenti usano i propri giorni di preavviso (non più 30 fissi); la scadenza di oggi conta; con "Promemoria" spento la voce resta nella card e nel centro notifiche con "Avviso disattivato" ma non nella campanella.
- **Prestazioni**: JS iniziale da 486 a 321 kB (gzip 140 → 96 kB), CSS da 100 a 63 kB (Documenti, Spese e Impostazioni si caricano quando servono); salvataggio dell'introito da ~110 a ~10 ms con 300 spese.
- **Interrompi / salta rata**: "interrompi da questa data" (inclusiva) e "salta rata" ora riducono quota mensile, totale annuo, cashflow e Cold Start.
- **Reset**: cancella anche le notifiche nascoste e le ricevute nel browser; conserva preferenze, lingua e cartella PC collegata.
- Il backup non include più preferenze dell'interfaccia, lingua e copie di sicurezza; i backup v2 si importano ancora.
- Schema dati versionato (versione 2) con migrazioni eseguite una sola volta all'avvio.

### Corretto
- **Rate nel giorno sbagliato**: con il fuso italiano le rate non annuali uscivano il giorno prima e dopo l'ora legale slittavano ancora (15 → 14 → 13).
- **Fine mese**: 31/01 mensile ora dà 28/02, 31/03, 30/04 (prima 03/03 e slittamento permanente); 29/02 annuale → 28/02.
- **"Ogni N giorni"** ora è davvero in giorni anche in timeline e quota mensile.
- **Storico rate**: parte da data di inizio, altrimenti dalla rata registrata più vecchia, altrimenti dalla prossima scadenza (nessuna rata inventata).
- **Salvataggi persi** con azioni rapide (doppio click, pagamenti ravvicinati); saldo del profilo aggiornato in modo atomico.
- **Dati corrotti o memoria piena**: l'app parte comunque con copia di sicurezza (`myplano_corrupt_<chiave>_<data>`) e avvisa "Spazio esaurito: esporta un backup".
- **Due schede aperte** ora si aggiornano a vicenda; campanella e Bilancio sempre allineati.
- **Ricevute sovrascritte**: ora ogni ricevuta ha una chiave univoca (nella cartella PC "nome (2).ext").
- **Scadenze aggiunte che non comparivano**: spese e documenti nuovi venivano salvati senza `id`. Tutti condividevano l'id di notifica `exp-undefined`/`doc-undefined` (nasconderne uno li nascondeva tutti), generavano chiavi React duplicate, e modifica/eliminazione agivano sull'elemento sbagliato (duplicati o cancellazioni multiple). Ora ogni nuovo elemento riceve un id univoco (`useAppData`).
- **Migrazione automatica dei dati esistenti**: al caricamento, gli elementi salvati senza `id` ne ricevono uno e gli id di notifica non validi vengono tolti dalla lista dei nascosti (`core/storage/idMigrationHelper.js`). Titoli, date, importi e categorie restano invariati.
- **Annulla** ripristina solo la modifica fatta (rata saltata o spesa interrotta) senza cancellare i pagamenti registrati nel frattempo.
- **Import** davvero tutto-o-niente anche per le ricevute e con memoria piena; se il ripristino fallisce si può scaricare la copia dei dati precedenti. Avviso per i backup di versione precedente.
- **Notifiche nascoste** che ricomparivano dopo "Annulla" o per documenti già scaduti.
- **Dopo un nuovo rilascio** l'app si ricarica da sola una volta se una scheda non è più disponibile; l'avviso "Nuova versione" compare anche alla prima installazione.
- **Strumenti**: `check_i18n_keys.py` ora fallisce se mancano chiavi; il rilascio su GitHub Pages esegue prima tutti i controlli e i test.

---

## [0.1.0] - 2026-09-16 (Initial Release / Primo Commit)

### Aggiunto
- **Architettura Fondamentale & Filosofia Local-First**:
  - Single Page Application reattiva sviluppata con React, Vite e Vanilla CSS.
  - Salvataggio locale e deterministico su `localStorage` (Privacy by Design).
  - Regola architetturale delle 100 righe per file di codice sorgente (137 file modulari).
  - Internazionalizzazione completa (Italiano / Inglese) a zero hardcoding.
  - Stile scrollbar dark universale (sottile, arrotondata e semitrasparente).
- **Modulo Documenti & Carte**:
  - Tracciamento validità di carte d'identità, patenti, passaporti, tessere sanitarie e carte di pagamento.
  - Modello documentale completo: numero identificativo, ente emittente, data rilascio, data scadenza, note, preavviso, toggle promemoria.
  - Editbox con suggerimenti e conteggio utilizzi in tempo reale (`SuggestInput`).
  - Selettore rapido di durata (+1, +3, +5, +10 anni).
  - Modal di rinnovo trasparente e personalizzabile (`DocumentRenewModal`).
  - Badge giorni sintetico (`{days} gg`, `Scade oggi`, `Scaduto da {days} gg`) con blocco del wrapping.
- **Modulo Spese Periodiche, Utenze & Contratti**:
  - Registrazione spese ricorrenti con frequenze canoniche e personalizzate in mesi/giorni.
  - Gestione spese variabili (bollette a consumo) con storico pagamenti e media isolata sul solo contratto attivo.
  - Editbox con suggerimenti e conteggio utilizzi per categorie (`SuggestInput`).
  - Layout ottimizzato per le card spesa: tag su riga autonoma, badge `DA PAGARE` privo di compressione, icone vettoriali Lucide senza emoji, eliminazione categoria duplicata.
  - Riconoscimento intelligente scadenze passate (`PastDateNotice`) con avanzamento automatico.
  - Doppia visualizzazione: Elenco cronologico e Raggruppamento per Categoria con subtotali dedicati.
- **Modulo Bilancio Preventivo & Sinking Funds**:
  - Calcolo deterministico della quota mensile a regime e totale spese annuo.
  - Hub globale (fondo e introito centrali) e sottofiltro per profilo con parametri dedicati gestiti via switch `Toggle`.
  - Margine di sicurezza minimo sopra lo zero nel momento più critico dell'anno.
  - Analisi Cold Start con tasto rapido di integrazione (`+ Integra nel fondo`).
  - Algoritmo Quota di Sopravvivenza Adattiva Non Lineare a Scaglioni (`survivalPhasesHelper`), con pareggio perfetto a $0,01 €$ ad ogni picco.
  - Timeline interattiva del cashflow con orizzonte flessibile (1-120 mesi) e stepper dark mode.
- **Modulo Profili & Nucleo Familiare**:
  - Gestione multi-profilo con filtraggio rapido globale.
  - Tag profilo con colori neon coordinati alla barra superiore.
  - Eliminazione profilo con pulizia a cascata e modal di conferma (`DeleteProfileModal`).
- **Modulo Impostazioni & Strumenti**:
  - Guida teorica al Sinking Fund nelle impostazioni.
  - Esportazione calendario universale iCalendar (`.ics`).
  - Backup e ripristino dati in formato JSON e reset dataset demo.
  - Suite `/Tools`: script di avvio con QR Code da terminale (`launch_with_qr.py`), linter limite righe (`check_line_limits.py`) e test matematici (`test_logic.py`).
