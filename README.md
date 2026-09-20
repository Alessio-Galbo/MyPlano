# 🛡️ MyPlano

> **Scadenze, Sinking Funds & Archivio Ricevute**  
> *Web Application reattiva, moderna e orientata alla privacy per la pianificazione finanziaria e la gestione delle scadenze del tuo nucleo.*

---

## ✨ Cos'è MyPlano?

**MyPlano** nasce per risolvere due grandi sfide della gestione quotidiana e familiare:

1. **Mai più "Shock da Spese Periodiche"**: bolli auto, assicurazioni annuali, imposte o conguagli condominiali non sono imprevisti. MyPlano applica il **metodo Sinking Funds**, convertendo ogni uscita periodica in una quota mensile costante da accantonare, e calcolando in tempo reale la tua **disponibilità residua per il quotidiano**.
2. **Controllo Totale su Scadenze & Ricevute**: un centro di controllo unificato per non far scadere mai patenti, carte d'identità, tessere sanitarie e bollette, con un **Archivio a 3 colonne** che organizza le ricevute nella cartella del tuo computer e scrive automaticamente **tag nativi Windows** nei file per ricerche istantanee da Esplora Risorse.

---

## 🚀 Caratteristiche Principali

- 💰 **Sinking Funds Intelligenti**: quota mensile a regime, saldo minimo della riserva e algoritmo predittivo *"Piano B"* (Cold Start) per superare i mesi critici senza deficit.
- 👨‍👩‍👧‍👦 **Visione d'Insieme del Nucleo**: gestione multi-profilo (Personale, Famiglia, Veicoli) con versamento collettivo delle quote in un solo click.
- 🗄️ **Hub Database Scadenze (3 Colonne)**: naviga l'albero delle spese per anno, gestisci lo stato dei pagamenti e acquisisci ricevute con caricamento file o scatto fotografico diretto da fotocamera/webcam.
- 🏷️ **Tag Nativi nei File (EXIF)**: salvataggio ordinato sul tuo PC in `[Anno]/[Categoria]/` con metadati EXIF inseriti direttamente nelle immagini JPEG.
- 📅 **Timeline Pluriennale Dinamica**: sezioni annuali con header sticky in glassmorphism, totale di spesa dell'anno e collegamenti inter-annuali veloci.
- 🪪 **Scadenzario Documenti & Carte**: monitoraggio validità di documenti e carte bancarie, con procedura di rinnovo guidata (+1, +3, +5, +10 anni).
- 📱 **Esperienza Mobile-First**: navbar reattiva ad icone compatte per le schede inattive, controlli veloci integrati nell'header e modali a schermo intero.
- 🔒 **100% Privacy & Local-First**: zero cloud, zero tracking. Tutti i dati e i documenti rimangono esclusivamente sui tuoi dispositivi.
- 🔄 **Interoperabilità Completa**: esportazione calendari universali `.ics` (Google Calendar, Apple Calendar, Outlook), backup/ripristino JSON e bilinguismo (Italiano / Inglese).

---

## 🏃 Avvio Rapido

### Su Computer (Windows)
Fai doppio click sul file:
```bash
avvia_myplano.bat
```
L'applicazione si aprirà automaticamente nel tuo browser predefinito all'indirizzo `http://localhost:5173`.

### Su Smartphone (Rete Locale / Wi-Fi)
Per utilizzare MyPlano dal tuo smartphone tramite rete Wi-Fi o hotspot locale:
```bash
python Tools/launch_with_qr.py
```
Inquadra il **QR Code** stampato sul terminale con la fotocamera del tuo cellulare per collegarti all'istante!

---

## 📚 Documentazione di Dettaglio

Approfondisci il funzionamento di ogni modulo consultando le guide dedicate nella cartella `docs/`:

- [**00 - Idea Base & Filosofia**](docs/00_idea_base.md): la visione originaria del progetto.
- [**01 - Panoramica Funzionalità**](docs/01_funzionalita_implementate.md): indice generale dell'applicazione.
- [**02 - Bilancio, Sinking Funds & Nucleo**](docs/02_bilancio_e_sinking_funds.md): guida dettagliata alla logica finanziaria e alla visione d'insieme.
- [**03 - Spese, Timeline & Database Scadenze**](docs/03_spese_archivio_database.md): gestione spese pluriennali, archivio a 3 colonne, foto e tag EXIF.
- [**04 - Documenti, Profili & Sicurezza**](docs/04_documenti_profili_impostazioni.md): scadenzario documenti, profili familiari, backup e privacy.
- [**Note di Rilascio GitHub**](docs/RELEASE_NOTES.md): testo pronto all'uso per i rilasci ufficiali su GitHub.
