# 01 - Panoramica Generale delle Funzionalità di MyPlano

**MyPlano** è un'applicazione web moderna, reattiva e orientata alla privacy, progettata per la pianificazione finanziaria personale/familiare e per la gestione proattiva di tutte le scadenze amministrative, documentali e ricorrenti.

L'applicazione funziona al 100% in modalità **Local-First**: tutti i dati e gli archivi risiedono esclusivamente sul dispositivo dell'utente (o nella cartella locale del computer collegata), senza dipendere da cloud di terze parti o abbonamenti esterni.

---

## Mappa dei Moduli e Documentazione di Dettaglio

La documentazione dell'applicazione è organizzata nelle seguenti guide tematiche:

| Guida | Argomento | Contenuti Principali |
| :--- | :--- | :--- |
| [00 - Idea Base](00_idea_base.md) | Visione & Filosofia | Concetto fondante di MyPlano, superamento dello "shock da spese periodiche" e pianificazione del nucleo. |
| [01 - Panoramica Funzionalità](01_funzionalita_implementate.md) | Indice & Architettura Funzionale | Mappa generale, pilastri dell'esperienza utente, design responsive e interoperabilità. |
| [02 - Bilancio & Sinking Funds](02_bilancio_e_sinking_funds.md) | Finanze, Quote & Previsioni | Metodo Sinking Funds, Fondo & Introito, Visione d'Insieme del Nucleo, Algoritmo Cold Start e Timeline Cashflow. |
| [03 - Spese, Timeline & Database](03_spese_archivio_database.md) | Scadenziario & Archivio Ricevute | Vista multi-anno con timeline, bollette a consumo, Hub Archivio a 3 colonne, foto/webcam e tag nativi EXIF nei file. |
| [04 - Documenti, Profili & Sicurezza](04_documenti_profili_impostazioni.md) | Carte, Identità & Sovranità Dati | Monitoraggio documenti con rinnovo guidato, gestione multi-profilo modificabile, notifiche (anche sul dispositivo), primo avvio con dati di esempio, export iCalendar (.ics) con ricorrenze e promemoria, backup JSON v3 con allegati e bilinguismo. |
| [Release Notes](RELEASE_NOTES.md) | Note di Rilascio GitHub | Sintesi delle novità e changelog orientato agli utenti per i rilasci su GitHub. |

---

## I Tre Pilastri Fondamentali di MyPlano

### 1. Metodo Sinking Funds: Mai Più Shock Finanziari
Spese come assicurazioni annuali, bollo auto, conguagli condominiali o imposte non sono imprevisti: sono uscite prevedibili con scadenza certa. MyPlano le trasforma in una **quota mensile costante e sostenibile**, permettendo di accumulare in anticipo le somme necessarie e di conoscere in ogni momento la reale **disponibilità per il quotidiano**.

### 2. Archivio & Database Scadenze Navigabile a 3 Colonne
Un centro di controllo per navigare nella storia dei pagamenti e delle ricevute:
- **Albero per Anno**: calcolo del carico annuo effettivo di tutte le uscite.
- **Tabella Rate**: avanzamento dello stato (saldato / da saldare), registrazione rate extra e modifica puntuale delle date.
- **Hub Ricevute & Documenti**: caricamento file da computer o acquisizione istantanea tramite fotocamera/webcam, con archiviazione nella cartella del PC e scrittura automatica di **tag nativi Windows** per ricerche da Esplora Risorse.

### 3. Scadenzario Documentale & Carte Intelligente
Controllo costante sulla validità di carte d'identità, patenti, passaporti, carte di credito e abbonamenti, con avvisi di scadenza personalizzabili e una procedura di rinnovo trasparente a durata guidata (+1, +3, +5, +10 anni).

---

## Design & Esperienza Utente (Mobile-First)

- **Interfaccia Dark Elegante & Fluida**: palette colori neon armoniosa, componenti in glassmorphism, contrasto ottimale e animazioni discrete.
- **Navbar Dinamica per Smartphone**: su dispositivi mobili, le schede non attive si contraggono a sole icone mentre la scheda selezionata espande testo e icona, eliminando testi troncati e garantendo navigazione immediata.
- **Pulsanti di Azione Rapida Integrati**: controlli compatti nelle intestazioni su mobile (pulsante *Nuova Spesa* allineato ai comandi di vista, pulsante *Nuovo Documento* compatto con icona `+`).
- **Nessun Pop-up di Sistema Fastidioso**: ogni azione di sicurezza (cancellazione spesa, rimozione allegato o ripristino dati) è protetta da eleganti modali personalizzate con chiara indicazione delle conseguenze.
- **Bilingue Nativo (Italiano & Inglese)**: commutazione istantanea della lingua da Impostazioni; la lingua cambia anche il formato di valute e date (l'inglese usa giorno/mese ed euro). I campi data/numero nativi del browser seguono invece la lingua del browser e i dati demo restano in italiano.
- **Primo avvio & stati vuoti**: dati di esempio con invito a iniziare coi propri; senza profili o senza elementi l'app guida con pulsanti chiari.
- **Preferenze Ricordate**: scheda attiva, profilo selezionato (anche "tutti"), vista spese, filtro categoria, intervallo anni, orizzonte della timeline e le altre scelte di visualizzazione restano come le hai lasciate alla sessione successiva.
- **Avvisi con "Annulla"**: dopo ogni salvataggio compare un breve avviso (in coda, al massimo 3 insieme, 2 su telefono); dopo eliminazione (anche di un profilo), "salta rata" o "interrompi" puoi annullare.
- **Notifiche sul dispositivo**: avviso riassuntivo delle scadenze, attivabile da Impostazioni; ad app chiusa solo best effort su Chrome/Edge con app installata (dettagli nel [README](../README.md)).
- **Accessibilità**: nei modali la tastiera resta all'interno della finestra, Esc chiude solo quella in primo piano, la navbar indica la scheda attiva ai lettori di schermo.
- **Installabile e Offline (PWA)**: si installa dal browser come un'app, funziona anche senza connessione e non carica font né risorse da server esterni. Vedi il [README](../README.md).

---

## Sovranità dei Dati e Privacy Totale

- **Zero Cloud & Zero Tracciamento**: i tuoi dati finanziari, documenti e spese rimangono esclusivamente sul tuo dispositivo.
- **Esportazione & Backup Totale**: salvataggio e ripristino dell'intero archivio in formato JSON (v3), con le ricevute salvate nel browser se lo desideri; l'import mostra un riepilogo e chiede conferma prima di scrivere.
- **Sincronizzazione con Calendari Esterni**: generazione di file universali `.ics` (serie ricorrenti e promemoria inclusi) compatibili con Google Calendar, Apple Calendar, Microsoft Outlook e Thunderbird.
