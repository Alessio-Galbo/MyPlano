# Changelog

Tutti i cambiamenti degni di nota a questo progetto sono documentati in questo file.
Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

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
