# 01 - Stato del Progetto e Funzionalità Implementate

## 1. Panoramica del Progetto

**MyPlano** è una Web Application locale, reattiva e modulare (progettata per il futuro impacchettamento come eseguibile desktop ultraleggero Windows tramite Tauri e fruibile su smartphone via rete locale o hotspot Wi-Fi).

Il software risponde a due esigenze fondamentali della pianificazione personale e familiare:
1. **Scadenze Amministrative & Documentali**: impedire che tessere, documenti d'identità, patenti o contratti scadano senza accorgersene, con gestione completa di tutti i metadati e rinnovo trasparente.
2. **Pianificazione Finanziaria tramite Sinking Funds**: superare lo "shock da spese periodiche" (bolli auto, assicurazioni, conguagli, tasse annuali) calcolando una quota mensile costante di accantonamento e prevedendo i picchi di spesa per evitare disavanzi di cassa, con algoritmi adattivi intelligenti.

---

## 2. Architettura Tecnica & Vincoli di Sviluppo

Il progetto è costruito secondo rigorose direttive architetturali:
- **Tecnologie Core**: React (Vite), JavaScript moderno, Vanilla CSS con variabili per temi scuri moderni e glassmorphism.
- **Architettura Local-First & Privacy**: tutti i dati risiedono esclusivamente nel `localStorage` del browser dell'utente. Nessuna trasmissione a server esterni o cloud terzi.
- **Regola delle 100 Righe (Codice Sorgente)**: nessun file di codice sorgente (`.js`, `.jsx`, `.py`, `.css`, `.html`) può superare le 100 righe. L'architettura è interamente basata su scomposizione modulare, hook dedicati e sub-componenti atomici.
  *(Nota: i file di documentazione `.md` e i file `.json` di configurazione/i18n non sono vincolati a questo limite per garantire completezza e accuratezza).*
- **Zero Hardcoding & Internazionalizzazione Completa**: nessun testo rivolto all'utente è inserito direttamente nel codice. L'applicazione utilizza dizionari speculari in formato JSON (`src/core/i18n/locales/it/` e `src/core/i18n/locales/en/`).
- **Zero Inline Code**: nessun CSS o JS inline; stili completamente isolati in fogli `.css` dedicati per ciascun componente.
- **Formule Matematiche Deterministiche**: calcoli finanziari chiari, verificabili e coperti da test unitari automatizzati.
- **Stile Scrollbar Dark Universale**: scrollbar sottile (6px), arrotondata e semitrasparente integrata nel tema scuro per tutta la web app, eliminando barre e frecce native grigie di sistema.

---

## 3. Modulo Profili & Nucleo Familiare

Il sistema include una gestione integrata per organizzare scadenze e finanze di più persone o compartimenti:
- **Gestione Multi-Profilo**: creazione di profili personalizzati (es. *Personale*, *Famiglia*, *Genitori*, *Figli*, *Veicoli*) con attribuzione di colore neon univoco (`#7c5dfa`, `#38bdf8`, `#10b981`, `#f59e0b`, `#ec4899`).
- **Filtro Rapido Globale**: tramite la barra dei profili (`ProfileBar`) è possibile visualizzare l'aggregato completo (*"Tutti i profili"*) oppure filtrare istantaneamente documenti, spese e bilancio per un singolo profilo.
- **Isolamento o Condivisione dei Dati**: ogni documento e ogni spesa è associata a un profilo, permettendo analisi segmentate o consolidate.
- **Eliminazione Profilo con Rimozione a Cascata e Dialogo di Conferma (`DeleteProfileModal`)**:
  - Tasto cestino dedicato sul profilo attivo nella barra superiore (con blocco di sicurezza se è rimasto un solo profilo).
  - Modal di conferma che quantifica con esattezza le spese e i documenti collegati che verranno eliminati.
  - Pulizia automatica di spese, documenti e parametri di bilancio associati al profilo eliminato, con riposizionamento automatico su *"Tutti i profili"*.

---

## 4. Modulo Scadenzario Documenti & Carte

Consente di archiviare, monitorare e gestire la validità dei documenti personali, di trasporto, sanitari e bancari con metadati completi.

### Tipologie di Documento & Combobox Intelligente (`SuggestInput`)
- Supporto alle tipologie canoniche: *Carta d'Identità*, *Patente di Guida*, *Passaporto*, *Tessera Sanitaria*, *Carta di Credito/Debito*, *Abbonamento Personale*, *Altro Documento*.
- **Editbox con Suggerimenti Dropdown**:
  - Permette di digitare liberamente qualsiasi nuova tipologia personalizzata.
  - Menu a discesa con le opzioni suggerite e badge che indica quante voci nel database utilizzano già quella tipologia (es. `Carta d'Identità (2)`).

### Campi Completi del Modello Documentale
In fase di creazione e modifica il form include tutti i metadati:
1. `Titolo documento` (`title`)
2. `Tipo documento` (`type`) via `SuggestInput` con conteggio
3. `Intestatario / Profilo` (`profileId`)
4. `Numero identificativo` (`identifier`, es. *CA12345AA*)
5. `Ente emittente` (`issuer`, es. *Comune di Roma / MIT - UCO*)
6. `Data di rilascio` (`issueDate`)
7. `Data di scadenza` (`expiryDate`) con selettore rapido di durata
8. `Giorni di preavviso` (`alertDays`, default 30gg)
9. `Note opzionali` (`notes`, es. *Rinnovo da prenotare su CIE Online*)
10. `Abilita promemoria` (`enableAlert`) con interruttore `Toggle`

### Visualizzazione Card & Badge Sintetico
- **Badge Sintetico Anti-Wrapping**:
  - Formulazione compatta: `{days} gg` (es. `29 gg`, `206 gg`), `Scade oggi`, oppure `Scaduto da {days} gg`.
  - Proprietà anti-wrapping `white-space: nowrap; flex-shrink: 0;` che previene deformazioni o a capo indesiderati.
- **Visualizzazione Note nella Card (`DocumentCardMeta`)**: quando presenti, le note vengono mostrate con stile corsivo discreto direttamente nella card.

### Rinnovo Trasparente e Personalizzabile (`DocumentRenewModal`)
- Sostituito l'incremento automatico opaco con un modal interattivo:
  - Visualizza la data di scadenza attuale.
  - Offre pulsanti rapidi con durata: **`+1 anno`**, **`+3 anni`**, **`+5 anni`**, **`+10 anni`** o selettore di calendario libero.
  - Box di anteprima in verde con la **Nuova Data di Scadenza** calcolata.
  - Conferma esplicita con pulsante *"Conferma Rinnovo"*.

---

## 5. Modulo Spese Periodiche, Utenze & Contratti

Permette di pianificare qualsiasi spesa ricorrente, dalle rate fisse alle bollette a consumo variabile.

### Categorie di Spesa & Combobox Intelligente (`SuggestInput`)
- Categorie predefinite: `utilities` (Utenze), `vehicle` (Auto & Moto), `home` (Casa), `taxes` (Tributi), `subscriptions` (Abbonamenti), `health` (Salute), `other` (Altro).
- **Editbox con Suggerimenti Dropdown**:
  - Possibilità di digitare liberamente categorie custom (es. *Palestra*, *Animali*, *Assicurazione Vita*).
  - Mostra il numero di spese collegate a quella categoria (es. `Utenze (4)`).

### Cadenze e Frequenze Flessibili
- Supporto a tutte le periodicità canoniche: *Mensile*, *Bimestrale*, *Trimestrale*, *Semestrale*, *Annuale*, *Biennale*, *Una tantum*.
- **Frequenza Personalizzata (`ExpenseFrequencyField`)**:
  - Intervallo libero in **Mesi** (es. ogni 4 mesi, ogni 8 mesi).
  - Intervallo libero in **Giorni** (es. ogni 45 giorni).
  - Ricalcolo automatico della quota mensile equivalente e dell'onere annuo.

### Spese Variabili (Bollette a Consumo) & Gestione Contratti
Per le spese a importo oscillante (luce, gas, riscaldamento):
1. **Attivazione Modalità Variabile**: flag che abilita il tracciamento a consumo.
2. **Media Reale Non Falsata**: il bilancio preventivo calcola la media ponderata *esclusivamente sui pagamenti registrati sotto il contratto attivo*. Vecchie bollette o contratti con tariffe obsolete non inquinano le previsioni correnti.
3. **Storico Bollette & Registro Pagamenti (`ExpenseHistoryModal`)**: registrazione di ogni singola bolletta con importo e data.
4. **Procedura Cambio Contratto**: inserimento del nuovo fornitore con stima iniziale, archiviando il vecchio storico senza falsare la nuova media.

### Gestione Intelligente delle Scadenze Passate (`PastDateNotice`)
- Se l'utente inserisce una data antecedente a oggi, il sistema lo rileva immediatamente e propone una scelta guidata:
  - *Spesa già saldata*: avanza automaticamente la data applicando la cadenza scelta.
  - *Spesa non saldata*: segnala chiaramente che la spesa costituisce un debito scaduto immediato.

### Layout Ottimizzato delle Card Spesa (`ExpenseCard`)
- **Badge Urgenza `"DA PAGARE"` Libero da Compressione**:
  - I tag (`ExpenseTags`) sono stati estratti dall'intestazione e posizionati su una riga dedicata sotto il titolo. L'header contiene solo titolo e badge, garantendo che `"DA PAGARE"` non subisca mai wrapping o deformazioni.
- **Eliminazione Duplicati**: rimossa la riga superflua `Categoria: ...` dai metadati (è già evidenziata dal tag tematico).
- **Icone Vettoriali Lucide**: rimossi tutti gli emoji testuali in favore di icone SVG dedicate (`Lock`, `TrendingUp`, `Tag`).
- **Pillola Profilo con Colore Neon**: mostra il pallino coordinato (`.profile-color-dot`) e la classe di tonalità neon del profilo (`.tag-profile-p1`, etc.).

### Doppia Modalità di Visualizzazione
- **Vista Elenco**: griglia ordinata per data di scadenza e livello di urgenza.
- **Vista Per Categoria (`CategoryGroupedView`)**: raggruppamento delle spese in sezioni tematiche con conteggio voci e subtotali dedicati sia per la spesa annua complessiva che per l'accantonamento mensile di categoria, con supporto alle categorie personalizzate.

---

## 6. Modulo Bilancio Preventivo & Sinking Funds

Rappresenta il motore analitico e predittivo di MyPlano, pensato per eliminare l'ansia da disavanzo di cassa.

### Hub Globale Fuori dai Filtri & Parametri Dedicati per Profilo
- **Fondo & Introito Globale al Vertice**: sempre visibile ed editabile per gestire la riserva e l'entrata mensile centrale dell'intero nucleo.
- **Sottofiltro con Fondo e Introito Dedicati (`ProfileDedicatedFinanceBox`)**:
  - Interruttori `Toggle` moderni (al posto delle checkbox browser).
  - Quando non dedicato, box informativo con riferimento chiaro ed evidenziato al valore globale (risolvendo collisioni testuali).
  - Quando dedicato, input numerico con prefisso valuta `€` e pulsante di salvataggio con stato *"Salvato"*.
- **Pannello Margine Discrezionale**: calcola in tempo reale la disponibilità residua mensile per il quotidiano e il risparmio libero ($\text{Introito Mensile} - \text{Quota Accantonamento}$).

### Metriche Chiave del Bilancio (Senza Ridondanze)
1. **Quota Mensile di Regime**: importo standard da accantonare ogni mese calcolato su base annua ($\text{Spese Annuali} / 12$).
2. **Totale Spese Annuali**: sommatoria pesata di tutte le spese periodiche calcolata su base 365 giorni (con conteggio voci attive).
3. **In Scadenza (Prossimi 30gg)**: conteggio rapido delle uscite imminenti.
4. **Margine di Sicurezza Minimo (+X €)**:
   - Se il fondo iniziale è sufficiente a coprire tutte le uscite senza mai andare in rosso, il sistema analizza l'intero ciclo e identifica il **momento più arduo** (il mese in cui il saldo tocca il punto più basso in assoluto).
   - Mostra di quanto si è sopra lo zero in quel momento critico (es. *"+450,00 €"*), fornendo un indice di tranquillità e capienza.

### Analisi "Cold Start" & Tasto Integrazione Rapida
Se un utente parte da un fondo insufficiente o vicino a zero e ha spese rilevanti nei mesi immediatamente successivi:
- **Identificazione del Mese Critico**: individua il primo mese di scoperto e le spese scatenanti con corretta interpolazione del mese nel titolo (es. *nov 2026* o *gen 2027*).
- **Tasto Rapido di Integrazione Fondo (`+ Integra [X €] nel fondo`)**:
  - Posizionato in alto nel banner di avviso, consente di sommare con un click la cifra una tantum necessaria direttamente al fondo attivo, azzerando subito lo scoperto e portando il bilancio a piena copertura.

### Quota Minima di Sopravvivenza Adattiva Non Lineare a Scaglioni (`survivalPhasesHelper.js`)
- L'algoritmo non impone una quota maggiorata piatta che creerebbe accumuli ingiustificati nei mesi intermedi, ma calcola le quote minime per ciascun scaglione-ostacolo:
  - **Frangente 1**: quota minima per superare il primo picco (es. *268,27 €/mese fino a nov 2026*), atterrando a **0,01 €** in pareggio perfetto.
  - **Frangente 2**: quota ricalcolata al minimo indispensabile per il secondo picco (es. *207,35 €/mese fino a gen 2027*), atterrando a **0,01 €** senza overpaying.
  - **Frangente 3**: ritorno automatico alla quota standard a regime (es. *149,89 €/mese*).
- **Radio Dot Circolari Anti-Shift**: entrambe le card di scelta per il grafico presentano un indicatore a dimensione fissa (18x18px) che elimina qualsiasi layout shift.

### Timeline Interattiva del Cashflow (`CashflowTimeline`)
- **Orizzonte Temporale Flessibile**: selezione libera dei mesi da proiettare (da 1 a 120 mesi, fino a 10 anni).
- **Stepper Dark Mode Ergonomici**: pulsanti `-` e `+` con grafica scura coordinata.
- **Trasparenza Delle Uscite**:
  - Tabella con Mese, Quota Applicata (con badge *(Min)* nei mesi di sopravvivenza), Uscite Totali con dettaglio esplicito delle singole spese in scadenza (es. *Luce (85 €)*, *Assicurazione Auto (540 €)*) e Saldo Riserva.
  - Evidenziazione visiva e badge di scoperto per qualsiasi mese con saldo negativo.

---

## 7. Modulo Impostazioni, Backup & Calendari Esterni

Garantisce sovranità totale sui dati e interoperabilità con gli strumenti quotidiani:
- **Guida al Sinking Fund**: card informativa che illustra il principio del fondo di accantonamento, posizionata nelle impostazioni per non appesantire la dashboard operativa.
- **Esportazione Calendario iCalendar (`.ics`)**:
  - Genera un file `.ics` standard contenente tutte le scadenze di documenti e spese con flag *"Includi in calendario"*.
  - Configurazione granulare dei promemoria: avviso il giorno stesso, 1 giorno prima, 3 giorni prima o 7 giorni prima.
  - Compatibile con Google Calendar, Apple Calendar, Microsoft Outlook, Thunderbird.
- **Backup & Ripristino JSON**:
  - *Esporta Backup*: scarica un file `.json` con l'intero snapshot locale (profili, documenti, spese, storico bollette, fondi e preferenze).
  - *Ripristina Backup*: carica un file JSON con validazione automatica dei dati.
- **Reset Dati di Esempio**: possibilità di ripristinare il dataset dimostrativo.
- **Cambio Lingua**: switch immediato tra Italiano ed Inglese con salvataggio della preferenza.

---

## 8. Strumenti di Automazione e Test (`/Tools`)

Tutti gli script di supporto risiedono nella cartella `/Tools` e sono documentati in `Tools/README.md`:

| File | Descrizione |
| :--- | :--- |
| `launch_with_qr.py` | Rileva automaticamente l'IP locale della macchina (anche su hotspot mobile da smartphone), genera e stampa un QR Code ASCII su terminale per collegarsi all'app da cellulare e avvia il dev server Vite. Include gestione pulita dell'uscita con `Ctrl+C`. |
| `avvia_myplano.bat` | Script batch per Windows che imposta il path di Node.js portatile e avvia l'applicazione con un doppio click. |
| `check_line_limits.py` | Linter rigoroso che esamina tutti i file `.py`, `.js`, `.jsx`, `.css`, `.html` verificando che nessuno superi le 100 righe. |
| `test_logic.py` | Suite di test per verificare la correttezza matematica del calcolo Sinking Funds, le quote multi-fase di sopravvivenza, i moltiplicatori di frequenza e la specularità completa delle chiavi di traduzione tra `it.json` ed `en.json`. |

---

## 9. Stato Attuale e Metriche di Qualità

- **File di Codice Verificati**: **258 file** sorgente controllati.
- **Conformità Limite 100 Righe**: **100% (0 violazioni, tutti $\le$ 100 righe)**.
- **Internazionalizzazione (i18n)**: 100% delle stringhe coperte da chiavi in italiano e inglese (302 chiavi uniche).
- **Zero Inline Code**: 100% degli stili e della logica isolati in file CSS/JS dedicati.
- **Test Unitari**: tutti i test eseguiti con esito positivo (OK).
- **Stato Build**: compilazione di produzione `npm run build` completata con 0 errori.
