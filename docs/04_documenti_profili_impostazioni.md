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
6. **Giorni di Preavviso**: soglia di allerta personalizzabile (default 30 giorni): è la finestra con cui il documento compare tra le scadenze imminenti e nelle notifiche.
7. **Note Opzionali**: visualizzate direttamente nella card in corsivo elegante (es. *Rinnovo da prenotare su CIE Online* o *Visita medica richiesta*).
8. **Interruttore Promemoria**: toggle per attivare o disattivare gli avvisi. Con il promemoria spento il documento non va nella campanella (resta nel centro notifiche con l'etichetta *Avviso disattivato*) e non viene esportato nel calendario.

L'**eliminazione di un documento** chiede sempre conferma, e dopo l'eliminazione compare un avviso con *Annulla*.

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

### Notifiche & Centro Notifiche
- La campanella nella navbar conta le scadenze imminenti (spese: 30 giorni; documenti: i giorni di preavviso del documento) e mette in rosso, in cima, il gruppo *Scaduti / in ritardo* (fino a 60 giorni indietro).
- Ogni scadenza è una notifica a sé e le rate pagate sono escluse.
- *Silenzia tutte*: il badge sparisce e la campanella appare barrata; la lista resta consultabile con un avviso.
- Il centro notifiche ricorda l'ultima scheda aperta; `Esc` chiude il menu della campanella.
- Limite: senza un server, MyPlano non può avvisarti ad app chiusa. Per avere avvisi sul telefono usa l'export `.ics` qui sotto.

### Esportazione Calendario Universale iCalendar (`.ics`)
- Genera un file `.ics` standard con le **spese** (se *Includi in calendario* non è spento) e i **documenti** (se il promemoria è attivo).
- **Serie ricorrenti**: per ogni spesa ricorrente viene scritta una sola serie (con fine, esclusioni e date aggiunte) invece di una voce per ogni rata.
- **Promemoria**: 3 giorni prima per le spese, i giorni di preavviso del documento per i documenti.
- **Compatibilità**: importabile in **Google Calendar**, **Apple Calendar**, **Microsoft Outlook**, **Thunderbird** o qualsiasi app di calendario. Nota: Google Calendar ignora i promemoria dei file importati; Apple Calendar e Outlook li rispettano.

### Backup & Ripristino JSON (formato v3)
- **Esporta Backup**: genera un file `.json` con profili, documenti, spese, storico bollette, fondi e notifiche nascoste. Non include preferenze dell'interfaccia, lingua e copie di sicurezza di dati corrotti.
- **Includi allegati**: opzione per inserire nel file anche le ricevute salvate nel browser (le ricevute nella cartella del PC non sono incluse). Il file diventa più grande.
- **Ripristina Backup**: validazione del file, poi una finestra di riepilogo (data, profili, spese, documenti, allegati) che chiede conferma. La scrittura è tutto-o-niente: se qualcosa fallisce, i dati precedenti vengono ripristinati. I backup v2 si importano ancora; le chiavi assenti nel backup tornano ai valori predefiniti; gli errori sono mostrati e lo stesso file può essere riprovato.
- **Ultimo backup**: *oggi / ieri / N giorni fa*, evidenziato se sono passati più di 30 giorni o non l'hai mai fatto.
- **Correggi date delle rate**: se in passato alcune rate pagate sono state salvate col giorno prima (vecchio difetto), in *Impostazioni* compare questa card con l'elenco e le caselle da spuntare; nulla cambia finché non confermi.

### Manutenzione & Reset Database
- **Ripristina Dati di Esempio (Demo)**: carica un set di dati dimostrativi bilanciati per esplorare le funzionalità dell'applicazione.
- **Azzera Tutto il Database**: cancella tutti i dati (anche le notifiche nascoste) e le ricevute salvate nel browser, protetto da doppia conferma esplicita. Restano preferenze, lingua e cartella del PC collegata.

### Switch Lingua Immediato (Italiano / Inglese)
- Supporto bilingue nativo completo: testi, etichette, valute e date disponibili in italiano e inglese, commutabili con un click dalle Impostazioni (l'inglese usa giorno/mese ed euro). I campi data/numero nativi del browser seguono la lingua del browser e i dati demo restano in italiano.

---

## 4. Privacy & Architettura Local-First

MyPlano adotta la filosofia **Local-First**:
- Nessun account o registrazione richiesta.
- Nessun tracciamento, analytics o telemetria.
- Nessun server cloud che legge le tue informazioni personali o le tue ricevute bancarie.
- Tutti i dati risiedono esclusivamente nel browser e nella cartella del tuo computer. Nessun font o risorsa viene caricato da server esterni (niente Google Fonts).
- I dati sono legati all'indirizzo da cui apri l'app: cambiando indirizzo o dominio ripartiresti da zero, quindi fai prima un backup.

### Integrità dei Dati
- Ogni spesa e documento ha un identificativo univoco assegnato al salvataggio: modifica, eliminazione e notifiche agiscono sempre sull'elemento giusto.
- Gli elementi salvati da versioni precedenti senza identificativo vengono corretti automaticamente al primo caricamento (`idMigrationHelper.js`), senza toccare i contenuti inseriti.
- **Nessun salvataggio perso**: con azioni rapide (doppio click, pagamenti ravvicinati) ogni modifica viene salvata, e il saldo del profilo si aggiorna senza sovrascritture.
- **Dati corrotti**: se una chiave risulta illeggibile l'app parte comunque (con la lista vuota) e conserva una copia di sicurezza (`myplano_corrupt_<chiave>_<data>`).
- **Memoria piena**: compare l'avviso *Spazio esaurito: esporta un backup*.
- **Versione dei dati**: lo schema è versionato (versione 2); le migrazioni girano una sola volta all'avvio (profili, id mancanti o duplicati).
- **Più schede aperte**: si aggiornano a vicenda.
- **Schermata di errore**: in caso di errore imprevisto compaiono *Scarica dati grezzi (JSON)* e *Ricarica*, senza alcun reset.
