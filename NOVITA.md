# Novità — MyPlano

Cosa è cambiato, in parole semplici (più recente in alto). Dettagli tecnici: [CHANGELOG.md](CHANGELOG.md).

## In arrivo

### Bilancio e scadenze
- Scegli **quanti giorni prima** essere avvisato di una spesa (e un preavviso predefinito nelle Impostazioni).
- Le **rate cadono nel giorno giusto** anche con l'ora legale e a fine mese; «ogni N giorni» funziona davvero in giorni.
- **«Correggi date delle rate»**: una card ti propone di sistemare le rate pagate salvate col giorno prima; decidi tu.
- Nel calendario `.ics` ogni spesa ricorrente è una serie con i suoi promemoria.

### Notifiche
- **Notifiche sul telefono** da attivare nelle Impostazioni; campanella con le scadenze imminenti, gruppo rosso «Scaduti», «Silenzia tutte».

### Profili e primo avvio
- Primo avvio guidato: banner dei dati di esempio con «Inizia con i miei dati», schermate vuote che spiegano cosa fare.
- **Profili modificabili** (nome e colore) ed **eliminazione con «Annulla»**; ogni spesa ha il suo profilo.

### App e telefono
- **Si installa** come app, funziona **offline**, si aggiorna da sola; su telefono niente scorrimento orizzontale.
- **Nuova icona**, interfaccia in italiano e inglese con date e valute della lingua scelta, app più veloce all'avvio.

### Dati e backup
- **Backup con le ricevute**, import «tutto o niente» con conferma; i dati non si perdono più con salvataggi ravvicinati o due schede aperte.
- Avvisi con **«Annulla»** e preferenze ricordate tra una sessione e l'altra.

## 1.0.0 — prima versione (note di rilascio GitHub)

Siamo felici di annunciare la prima versione ufficiale di **MyPlano**, la web application locale, reattiva e orientata alla privacy per la pianificazione finanziaria personale e la gestione proattiva di tutte le scadenze e ricevute del tuo nucleo!

---

### 🌟 Highlights Principali

- **Metodo Sinking Funds**: trasforma le spese annuali o periodiche gravose (assicurazioni, bolli auto, imposte, conguagli) in una quota mensile costante. Addio allo shock delle spese impreviste!
- **Disponibilità Residua in Tempo Reale**: scopri con esattezza quanto denaro puoi spendere liberamente ogni mese per il quotidiano, con la certezza matematica che tutte le scadenze future sono già coperte.
- **Hub Archivio & Database Scadenze a 3 Colonne**: naviga la cronistoria dei pagamenti, cambia lo stato delle rate con un click, allega ricevute dal PC o scatta foto con la fotocamera/webcam con anteprima a pieno schermo.
- **Tag Nativi nei File (EXIF Windows)**: MyPlano scrive i metadati delle ricevute direttamente all'interno delle immagini JPEG, rendendole ricercabili e raggruppabili nativamente in Esplora Risorse di Windows.
- **Timeline Pluriennale Interattiva**: pianifica spese su più anni con sezioni temporali dedicate, totali per anno e collegamenti rapidi inter-annuali.
- **Scadenzario Documenti & Carte**: monitora tessere, patenti, passaporti e carte bancarie con rinnovo guidato rapido (+1, +3, +5, +10 anni).
- **Visione d'Insieme del Nucleo**: unisci i profili familiari in un'unica schermata consolidata ed effettua il versamento collettivo delle quote con un click.
- **Esperienza Mobile-First**: navbar reattiva intelligente a icone compatte, pulsanti minimal nell'header e layout fluido a tutto schermo per smartphone.
- **100% Privacy & Local-First**: zero registrazione, zero cloud, zero tracciamento. I tuoi dati e le tue ricevute rimangono esclusivamente sui tuoi dispositivi.

---

### 📋 Novità per Modulo

#### 💰 Bilancio Preventivo & Sinking Funds
- **Fondo e Introito Minimali**: gestione simmetrica del fondo di riserva e dell'entrata mensile per singolo profilo.
- **Pulsante "Versa quota" con Zero Spostamento**: feedback visivo a spunta verde smeraldo animata che accredita istantaneamente la quota calcolata nella riserva.
- **Visione d'Insieme Consolidata**: card macro del nucleo con saldo minimo comune, quota complessiva e modale di versamento collettivo trasparente con ripartizione per profilo.
- **Algoritmo Adattivo "Piano B" / Cold Start**: se parti con un fondo basso, l'algoritmo calcola una quota di sopravvivenza a scaglioni che pareggia i picchi di spesa a 0,01 € senza overpaying, con tasto di integrazione rapida nel fondo.
- **Cashflow Timeline**: tabella di proiezione interattiva da 1 a 120 mesi con dettaglio delle spese in scadenza.

#### 📅 Spese Periodiche, Contratti & Timeline
- **Pianificazione Pluriennale**: selettore anni (2026, 2027, 2028, ... o "Tutti") con sezioni timeline animate, header sticky con totale annuo e conteggio scadenze.
- **Doppia Vista**: Elenco cronologico e Raggruppamento per Categoria con quote annuali reali.
- **Assistente Scadenza Rapida (`+1 ciclo / ✨`)**: compila automaticamente la prossima scadenza in base alla frequenza impostata (mensile, trimestrale, annuale o personalizzata).
- **Gestione Contratti & Bollette a Consumo**: storico letture con media ponderata isolata al fornitore corrente, e procedura cambio contratto.

#### 🗄️ Hub Archivio & Database Scadenze (3 Colonne)
- **Colonna 1 (Albero Anni & Spese)**: carico annuo effettivo calcolato sulle rate reali (es. semestrali sommate per intero), ordinamento per data/alfabetico e filtro nascondi anni passati.
- **Colonna 2 (Rate & Pagamenti)**: commutazione rapida stato pagamento (Saldato / Da saldare) tramite icone intuitive, correzione date delle rate e inserimento rate extra fuori ciclo.
- **Colonna 3 (Ricevute & Allegati)**: box gemelli "Carica file" (PDF, JPG, PNG) e "Scatta foto" (acquisizione fotocamera/webcam), visualizzatore a schermo intero con zoom, download locale ed eliminazione protetta con conferma.
- **Integrazione Cartella PC & Tag Nativi**: organizzazione automatica in `[Anno]/[Categoria]/` e scrittura dei tag EXIF nei file JPEG per ricerche immediate da Windows.

#### 🪪 Scadenzario Documenti & Carte
- Monitoraggio scadenze di documenti d'identità, patenti, tessere sanitarie, passaporti e carte di pagamento.
- Suggeritore intelligente delle tipologie con contatore di utilizzo in tempo reale.
- Badge giorni sintetico anti-wrapping (`26 gg`, `Scade oggi`, `Scaduto da X gg`).
- Rinnovo guidato rapido a durata predefinita (+1, +3, +5, +10 anni) o data libera.

#### 👥 Gestione Profili & Nucleo
- Supporto multi-profilo (Personale, Famiglia, Veicoli, ecc.) con colori neon coordinati.
- Filtro rapido globale dalla barra superiore per isolare o aggregare i dati.
- Eliminazione sicura con calcolo a cascata di spese e documenti associati.

#### ⚙️ Interoperabilità, Backup & Sicurezza
- **Esportazione iCalendar (`.ics`)**: genera calendari sincronizzabili con Google Calendar, Apple Calendar, Outlook e Thunderbird con preavvisi configurabili (giorno stesso, 1, 3, 7 giorni prima).
- **Backup & Ripristino JSON**: esportazione e importazione istantanea dell'intero archivio con validazione dei dati.
- **Manutenzione Database**: opzione per ricaricare i dati demo di esempio o azzerare completamente il database per ripartire da zero.
- **Supporto Bilingue Nativo**: switch immediato tra Italiano ed Inglese dalle Impostazioni.

---

### 🚀 Guida Rapida all'Avvio

1. **Avvio su Computer**: fai doppio click sul file `avvia_myplano.bat` per avviare l'applicazione nel browser predefinito.
2. **Accesso da Smartphone (Rete Wi-Fi Locale)**: esegui `python Tools/launch_with_qr.py` per scansionare il QR Code dal tuo smartphone e usare MyPlano su rete locale o hotspot.
3. **Collega una Cartella PC**: vai su *Impostazioni* $\rightarrow$ *Archivio Locale Ricevute* e seleziona la cartella in cui desideri archiviare ricevute e foto.
