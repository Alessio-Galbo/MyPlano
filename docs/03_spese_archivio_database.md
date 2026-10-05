# 03 - Spese Periodiche, Timeline & Database Scadenze

Il modulo **"Spese & Scadenze"** consente di censire, monitorare e archiviare qualsiasi tipologia di costo ricorrente o periodico, unendo la precisione di uno scadenzario alla comodità di un archivio digitale delle ricevute sul proprio computer.

---

## 1. Censimento Spese & Frequenze Flessibili

Ogni voce di spesa viene registrata con estrema flessibilità:
- **Periodicità Canoniche**: *Mensile*, *Bimestrale*, *Trimestrale*, *Semestrale*, *Annuale*, *Biennale*, *Una tantum*.
- **Periodicità Personalizzate**:
  - Intervallo libero in **Mesi** (es. ogni 5 mesi).
  - Intervallo libero in **Giorni** (es. ogni 45 giorni): è davvero in giorni anche in timeline e quota mensile.
- **Date Sempre Esatte**: le rate cadono nel giorno giusto (nessun slittamento col fuso orario o l'ora legale); le scadenze di fine mese seguono il mese (31/01 mensile → 28/02, 31/03, 30/04; 29/02 annuale → 28/02).
- **Interrompi da questa data & Salta rata**: *interrompi* chiude la spesa da una data in poi (inclusiva), *salta rata* esclude una sola occorrenza. Entrambi riducono quota mensile, totale annuo, cashflow e Cold Start e offrono "Annulla" nell'avviso.
- **Profilo**: campo obbligatorio. Parte dal profilo selezionato in alto (il primo se sei in *Visione d'Insieme*); in modifica puoi spostare la spesa su un altro profilo. Senza profili il form non salva e propone *Crea profilo*.
- **Assistente Scadenza Rapida (`+1 ciclo / ✨`)**:
  - Sia in creazione che in modifica spesa, un pulsante assistente calcola istantaneamente e compila la data della scadenza successiva in base alla frequenza scelta, senza dover consultare manualmente il calendario.
- **Rilevamento Intelligente Scadenze Pregresse**:
  - Se si inserisce una data nel passato, l'applicazione chiede se la spesa è già stata saldata (avanzando automaticamente la scadenza) o se costituisce un debito scaduto da segnalare con badge urgente `"DA PAGARE"`.

### Stati vuoti
- Senza profili: *Crea il tuo primo profilo*, con *Nuova spesa* disabilitato e la spiegazione del perché.
- Lista vuota: pulsante *Aggiungi la prima spesa*, con testi diversi per *Tutti* e per un profilo; se le spese esistono ma i filtri le nascondono, un avviso lo segnala.

---

## 2. Pianificazione Pluriennale & Timeline Interattiva

MyPlano non si limita all'anno in corso, ma permette di pianificare su orizzonti pluriennali:

### Selettore Anni Rapido
Una barra dedicata permette di passare istantaneamente tra l'anno corrente, gli anni futuri, un intervallo personalizzato o la modalità panoramica **"Tutti"**.

### Griglia Annuale con Timeline Visiva (`YearGroupedExpenseGrid`)
Quando si visualizzano più anni:
- Le spese sono organizzate in **sezioni annuali dedicate**.
- Ciascuna sezione ha un **header sticky con effetto glassmorphism** che rimane visibile durante lo scorrimento, riportando il **totale delle uscite previste per l'anno** e il conteggio delle scadenze (es. `Totale anno: 3.450,00 € • 8 scadenze`).
- Una **linea temporale continua con nodi luminosi** collega visivamente le scadenze tra un anno e l'altro.
- Un pulsante rapido *"Vai al {anno} →"* permette di saltare fluidamente da un anno all'altro con scorrimento animato.

### Doppia Modalità di Visualizzazione
1. **Vista Elenco**: ordina tutte le scadenze cronologicamente per data e urgenza.
2. **Vista Per Categoria**: raggruppa le spese per area tematica (*Utenze*, *Veicoli*, *Casa*, *Tasse*, *Salute*, *Abbonamenti*, *Altro* o categorie custom). Calcola la quota annua reale delle spese uniche (non moltiplicata per il numero di anni) e il subtotale del periodo selezionato.

---

## 3. Spese Variabili (Bollette a Consumo) & Gestione Contratti

Per utenze a importo oscillante (luce, gas, riscaldamento, telefonia a consumo):
- **Attivazione Modalità Variabile**: abilita il monitoraggio dei pagamenti effettivi.
- **Media Reale Non Falsata**: il bilancio calcola la stima dell'accantonamento basandosi *esclusivamente sui pagamenti registrati sotto il contratto attualmente attivo*.
- **Procedura Cambio Contratto**: quando si cambia fornitore, si inserisce la tariffa del nuovo gestore archiviando lo storico precedente, preservando la memoria senza inquinare le stime future.

---

## 4. Hub Archivio & Database Scadenze (Struttura a 3 Colonne)

Cliccando sul pulsante archivio di una spesa si apre un centro di controllo a schermo intero organizzato su tre colonne interattive:

```
┌─────────────────────────┬───────────────────────────┬─────────────────────────┐
│       COLONNA 1         │         COLONNA 2         │        COLONNA 3        │
│  Albero Anni & Spese    │ Rate & Pagamenti Registrati│ Ricevute & Allegati Rata│
│                         │                           │                         │
│ • Raggruppamento anni   │ • Elenco singole rate     │ • [☁️ Carica file]       │
│ • Totale effettivo anno │ • Toggle Stato (Saldato)  │ • [📷 Scatta foto]       │
│ • Ordinamento Data/A-Z  │ • Modifica data scadenza  │ • Galleria allegati     │
│ • Filtro [👁️] anni pass. │ • [ + Spesa extra ]       │ • Zoom a pieno schermo  │
│                         │ • Filtro [👁️] pagamenti p. │ • Download e rimozione  │
└─────────────────────────┴───────────────────────────┴─────────────────────────┘
```

### Colonna 1: Albero Anni & Spese
- **Raggruppamento per Anno**: elenca le spese previste per ciascun anno.
- **Totale Effettivo Ricalcolato**: calcola la spesa reale dell'anno sommando tutte le rate effettive (es. una polizza semestrale da 160 € a rata mostra correttamente **320,00 €** per l'anno 2026).
- **Controlli di Ordinamento & Visibilità**: ordinamento per data o alfabetico, e pulsante minimal con icona occhio (`Eye` / `EyeOff`) per nascondere gli anni precedenti all'anno corrente.

### Colonna 2: Rate & Pagamenti Registrati
- **Elenco Dettagliato delle Rate**: mostra data, importo e stato di ciascuna rata passata o programmata. Lo storico parte dalla data di inizio; se manca, dalla rata registrata più vecchia; se mancano anche le rate, dalla prossima scadenza (nessuna rata viene inventata).
- **Avanzamento Stato Immediato**: un clic sull'icona della riga commuta istantaneamente lo stato tra *Da saldare* (icona orologio) e *Saldato* (icona spunta verde) senza ricaricare la pagina o spostare elementi.
- **Modifica Puntuale della Scadenza**: permette di correggere la data di una specifica rata (es. slittamento concordato) con opzione di aggiornare o preservare la catena delle scadenze future.
- **Registrazione Rate Extra**: pulsante compatto `[ + Spesa extra ]` per inserire pagamenti straordinari o integrazioni fuori ciclo.
- **Filtro Pagamenti Passati**: icona occhio per nascondere le rate anteriori alla data odierna.

### Colonna 3: Ricevute & Allegati della Rata
- **Box Gemelli di Acquisizione**:
  - **`[ ☁️ Carica file ]`**: per sfogliare e allegare documenti dal computer o smartphone (PDF, JPG, PNG).
  - **`[ 📷 Scatta foto ]`**: attiva direttamente la fotocamera del dispositivo o la webcam del computer per fotografare al volo la ricevuta cartacea o lo scontrino.
- **Galleria Ricevute**: visualizzazione delle anteprime collegate alla specifica rata selezionata.
- **Anteprima a Schermo Intero & Zoom**: visualizzatore integrato con controlli di ingrandimento/riduzione.
- **Download & Eliminazione Protetta**: salvataggio locale della ricevuta o eliminazione sicura con modale di conferma per prevenire cancellazioni accidentali.
- **Ricevute mai sovrascritte**: ogni ricevuta ha una chiave univoca; nella cartella del PC un nome già presente diventa `nome (2).ext`.
- **Preferenze ricordate**: la spesa selezionata e gli anni aperti nell'Hub si ritrovano alla riapertura.

---

## 5. Salvataggio su Cartella PC & Tag Nativi Windows (EXIF)

MyPlano non intrappola i tuoi file all'interno dell'applicazione:

### Cartella PC Dedicata (File System Access API)
Dalle Impostazioni è possibile collegare una qualsiasi cartella del computer. L'applicazione organizzerà automaticamente i file in una gerarchia chiara e ordinata:
```
Cartella_Scelta/
├── 2026/
│   ├── vehicle/
│   │   └── 2026 10 15 - Assicurazione RC Auto.jpg
│   └── utilities/
│       └── 2026 11 04 - Bolletta Luce Enel.pdf
└── myplano_archive_index.json
```

### Tag Nativi Windows nei File (EXIF APP1)
Quando si acquisisce o si salva una ricevuta in formato JPEG, MyPlano **scrive direttamente i metadati all'interno del file immagine** (nel tag standard `XPKeywords` / EXIF):
- I tag (es. `2026; vehicle; Assicurazione RC Auto; MyPlano`) sono visibili nativamente in Windows facendo click con il tasto destro sul file $\rightarrow$ *Proprietà* $\rightarrow$ *Dettagli* $\rightarrow$ *Tag*.
- È possibile cercare, filtrare o raggruppare le ricevute per tag direttamente da **Esplora Risorse di Windows**, anche a browser chiuso.

### Massima Sicurezza & Fallback Locale
Se non viene collegata una cartella del PC, i file vengono conservati nel database protetto locale del browser (IndexedDB). Queste ricevute possono essere incluse nel backup (opzione *Includi allegati*); quelle nella cartella del PC no, perché sono già file tuoi.

## Preavviso della Spesa

- Nel form della spesa, accanto a *Abilita avviso*, il campo **Avvisami N giorni prima** decide quando la spesa entra nella campanella, nella card *Scadenze imminenti* e nelle notifiche sul telefono.
- Le spese nuove partono dal **preavviso predefinito** impostabile in *Impostazioni* (30 giorni se non lo cambi); le spese che non hanno un valore proprio seguono sempre il predefinito.
- Nel calendario esportato (`.ics`) il promemoria resta 3 giorni prima, salvo un preavviso impostato sulla singola spesa.
