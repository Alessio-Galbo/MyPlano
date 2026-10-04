# 04 - Scadenzario Documenti, Profili & Sicurezza dei Dati

Questo modulo illustra la gestione dei documenti d'identità e carte, l'organizzazione multi-profilo del nucleo e gli strumenti di sovranità, backup e interoperabilità di **MyPlano**.

---

## 1. Scadenzario Documenti & Carte

Consente di archiviare, monitorare e gestire la validità dei documenti personali, di trasporto, sanitari e bancari con metadati completi.

### Tipologie di Documento Supportate
- *Carta d'Identità Elettronica (CIE)*
- *Patente di Guida*
- *Passaporto*
- *Tessera Sanitaria / TEAM*
- *Carte di Pagamento (Credito, Debito, Prepagate)*
- *Abbonamenti Trasporti o Personali*
- *Qualsiasi tipologia personalizzata* tramite il selettore intelligente con autocompletamento e contatore di utilizzo (es. `Carta d'Identità (2)`).

### Metadati Completi del Documento
Per ogni documento è possibile registrare:
1. **Titolo & Tipologia**: identificazione chiara della tessera o certificato.
2. **Intestatario / Profilo**: associazione al membro del nucleo corrispondente.
3. **Numero Identificativo**: codice alfanumerico (es. *CA12345AA* o numero patente).
4. **Ente Emittente**: comune, prefettura, motorizzazione, banca o ente di rilascio.
5. **Data di Rilascio & Data di Scadenza**: con selettore rapido di durata.
6. **Giorni di Preavviso**: soglia di allerta personalizzabile (default 30 giorni).
7. **Note Opzionali**: visualizzate direttamente nella card in corsivo elegante (es. *Rinnovo da prenotare su CIE Online* o *Visita medica richiesta*).
8. **Interruttore Promemoria**: toggle per attivare o disattivare gli avvisi.

### Badge di Stato & Anti-Wrapping
Ogni card mostra un badge sintetico a colori vivaci con calcolo dei giorni rimanenti:
- `26 gg`: conto alla rovescia compatto.
- `Scade oggi`: evidenziazione massima.
- `Scaduto da {X} gg`: segnalazione in rosso del documento scaduto.
- *Layout protetto*: il badge ha proprietà anti-deformazione per non andare mai a capo anche su schermi stretti.

### Procedura Guidata di Rinnovo (`DocumentRenewModal`)
Rinnovare un documento richiede pochi secondi:
- Cliccando sull'icona di rinnovo si apre una finestra guidata che mostra la data di scadenza attuale.
- Pulsanti di incremento rapido della durata: **`+1 anno`**, **`+3 anni`**, **`+5 anni`**, **`+10 anni`** oppure selettore di calendario libero.
- Box verde di anteprima con la **Nuova Data di Scadenza Calcolata**.
- Conferma con un click: la data viene aggiornata e i giorni di preavviso ricalcolati automaticamente.

---

## 2. Modulo Profili & Nucleo Familiare

MyPlano consente di organizzare le finanze e le scadenze dell'intero nucleo familiare o di suddividere comparti distinti:

### Creazione e Personalizzazione Profili
- Creazione di profili dedicati (es. *Personale*, *Famiglia*, *Genitori*, *Veicoli*, *Attività*).
- Assegnazione automatica di colori neon coordinati (`#7c5dfa`, `#38bdf8`, `#10b981`, `#f59e0b`, `#ec4899`).
- Fondo iniziale dedicato e introito mensile configurabili individualmente per ciascun profilo.

### Navigazione & Filtro Rapido Globale
- La barra superiore (`ProfileBar`) consente di filtrare istantaneamente l'intera applicazione per un singolo profilo oppure di consultare la *"Visione d'Insieme"* aggregata.
- Se l'applicazione contiene un solo profilo, i selettori di aggregazione si nascondono automaticamente per mantenere l'interfaccia pulita e minimale.

### Eliminazione Sicura del Profilo con Analisi a Cascata
- Tasto di rimozione dedicato con blocco di sicurezza (non è possibile eliminare l'ultimo profilo rimasto).
- Finestra modale di conferma che quantifica con precisione quante spese e quanti documenti collegati verranno eliminati insieme al profilo, per evitare cancellazioni involontarie.

---

## 3. Impostazioni, Backup & Calendari Esterni

Garantisce piena interoperabilità con gli strumenti di produttività quotidiani e sovranità totale sui dati:

### Esportazione Calendario Universale iCalendar (`.ics`)
- Genera un file `.ics` standard contenente tutte le scadenze di documenti e spese per le quali è attivo il flag *"Includi in calendario"*.
- **Configurazione Granulare degli Avvisi**: promemoria impostabile per il giorno stesso dell'evento, oppure con 1, 3 o 7 giorni di anticipo.
- **Compatibilità Totale**: importabile con un click in **Google Calendar**, **Apple Calendar**, **Microsoft Outlook**, **Thunderbird** o qualsiasi app di calendario per smartphone.

### Backup & Ripristino JSON Istantaneo
- **Esporta Backup**: genera un file `.json` completo con l'intero snapshot locale (profili, documenti, spese, storico bollette, fondi e preferenze).
- **Ripristina Backup**: permette di ricaricare il file JSON su qualsiasi altro computer o browser, con validazione automatica dello schema per garantire l'integrità dei dati.

### Manutenzione & Reset Database
- **Ripristina Dati di Esempio (Demo)**: carica un set di dati dimostrativi bilanciati per esplorare le funzionalità dell'applicazione.
- **Azzera Tutto il Database**: cancella ogni traccia per iniziare con un'installazione pulita da zero, protetto da doppia conferma esplicita.

### Switch Lingua Immediato (Italiano / Inglese)
- Supporto bilingue nativo completo: testi, etichette, formati numerici e descrizioni disponibili in italiano e inglese, commutabili con un click dalle Impostazioni.

---

## 4. Privacy & Architettura Local-First

MyPlano adotta la filosofia **Local-First**:
- Nessun account o registrazione richiesta.
- Nessun tracciamento, analytics o telemetria.
- Nessun server cloud che legge le tue informazioni personali o le tue ricevute bancarie.
- Tutti i dati risiedono esclusivamente nel browser e nella cartella del tuo computer.

### Integrità dei Dati
- Ogni spesa e documento ha un identificativo univoco assegnato al salvataggio: modifica, eliminazione e notifiche agiscono sempre sull'elemento giusto.
- Gli elementi salvati da versioni precedenti senza identificativo vengono corretti automaticamente al primo caricamento (`idMigrationHelper.js`), senza toccare i contenuti inseriti.
