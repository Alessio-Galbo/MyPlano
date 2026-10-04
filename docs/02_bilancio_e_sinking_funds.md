# 02 - Bilancio Preventivo, Sinking Funds & Visione del Nucleo

Il modulo **"Bilancio & Fondo"** costituisce il cuore previsionale e analitico di **MyPlano**. È stato concepito per dare serenità finanziaria eliminando l'ansia da spese impreviste o picchi di uscite concentrate.

---

## 1. Il Metodo Sinking Funds (Accantonamento Programmato)

Invece di subire lo shock di una spesa da 600 € ogni anno o di un'assicurazione semestrale da 400 €, MyPlano calcola l'esatto onere annuo complessivo e lo ripartisce in una **quota mensile costante**.

Versando ogni mese questa quota nella riserva (il **Fondo**), il conto sarà sempre capiente al momento esatto in cui le scadenze busseranno alla porta, senza intaccare il budget ordinario o costringere a ricorrere a finanziamenti.

---

## 2. Gestione Profilo Singolo (Vista Chiara e Simmetrica)

Quando si seleziona un profilo specifico (es. *Personale* o *Famiglia*), la schermata di bilancio offre una configurazione minimale e intuitiva. Il profilo selezionato (o "Visione d'Insieme") viene ricordato alla riapertura. Quota mensile, totale annuo, cashflow e Cold Start tengono conto di spese interrotte (`endDate`, inclusiva) e rate saltate:

### Box Fondo (€)
- Mostra il saldo attuale accantonato nel fondo di riserva per quel profilo.
- Permette di modificare e salvare istantaneamente l'importo con salvataggio automatico.
- **Pulsante "Versa quota" Rapido**:
  - Mostra l'importo calcolato da accantonare questo mese (es. `Versa quota (+127,46 €)`).
  - Cliccando sul pulsante, l'importo viene accreditato istantaneamente nel fondo.
  - **Feedback Visivo Fluido**: l'icona del pulsante si trasforma con un'animazione morbida in una spunta verde smeraldo (`✓`), confermando l'accredito senza causare alcuno spostamento visivo del layout.

### Box Introito Mensile (€) & Disponibilità Residua
- Permette di inserire la propria entrata mensile netta stimata.
- **Disponibilità Residua per il Quotidiano**:
  - Collocata direttamente sotto all'introito mensile, realizzando una perfetta simmetria visiva con il pulsante del fondo.
  - Calcolata in tempo reale: $\text{Disponibilità Residua} = \text{Introito Mensile} - \text{Quota Mensile Sinking Fund}$.
  - Evidenziata con testo in gradiente violaceo/ciano e indicatore `/mese`. Indica con precisione assoluta quanto denaro è liberamente spendibile ogni mese per svago, spesa quotidiana e risparmio libero, sapendo che tutte le scadenze future sono già coperte.

### Card Scadenze Imminenti
- Posizionata sotto ai riquadri finanziari, riporta a colpo d'occhio le scadenze vicine, con un conteggio e un'etichetta per ogni voce.
- Elenca sia le **spese** sia i **documenti**, ordinati per data, con importo, profilo e badge `tra N gg`; un click apre il dettaglio (`UpcomingDetailModal`).
- **Finestra temporale**: per le spese è di 30 giorni; per i documenti è il *giorno di preavviso* impostato su ciascun documento (default 30), quindi non c'è una soglia fissa uguale per tutti. Le scadenze di **oggi** contano tra le imminenti.
- In cima, in rosso, il gruppo **Scaduti / in ritardo** (fino a 60 giorni indietro). Le rate già pagate non compaiono.
- Ogni scadenza è una voce a sé: nascondere la bolletta di ottobre non nasconde quella di novembre.
- Le voci nascoste dal *Centro Gestione Notifiche* (campanella in alto) restano nascoste anche qui. Se per una voce il *Promemoria* è spento, resta in questa card e nel centro notifiche con l'etichetta *Avviso disattivato*, ma non finisce nella campanella.
- Campanella e Bilancio mostrano sempre le stesse voci, anche con più schede aperte.

### Elementi senza profilo e primo profilo
- Se esistono spese o documenti senza profilo valido (ad esempio creati dopo un azzeramento con una versione precedente), nel Bilancio compare il banner *"N elementi senza profilo - Rivedi"*: porta alla card in Impostazioni dove scegli il profilo di ciascuno (o *Assegna tutti a...*). Nulla cambia finché non confermi.
- Senza alcun profilo il Bilancio mostra la guida *Crea il tuo primo profilo* con il pulsante *Crea profilo*.

---

## 3. Visione d'Insieme del Nucleo (Consolidato Multi-Profilo)

Quando l'utente seleziona *"Visione d'Insieme"* nella barra dei profili, MyPlano aggrega automaticamente le finanze di tutti i profili del nucleo:

### Card Totale Nucleo (`ConsolidatedTotalCard`)
Presente quando sono attivi due o più profili, riassume in una card macro:
- **Saldo Minimo Nucleo**: il punto più basso toccato dalla riserva complessiva durante l'intero ciclo annuale.
- **Quota Mensile Totale**: la somma delle quote di accantonamento richieste da tutti i profili.
- **Introito Mensile Totale**: la somma delle entrate complessive del nucleo.
- **Fondo Complessivo**: il totale aggregato della liquidità attualmente presente nei fondi.

### Versamento Collettivo delle Quote (`DepositAllConfirmModal`)
- Il pulsante *"Versa quota"* sulla card totale apre una finestra modale di sicurezza.
- La modale elenca la ripartizione esatta delle quote che verranno accreditate a ciascun profilo (es. *Personale: 120,00 €*, *Famiglia: 250,00 €*, *Veicoli: 85,00 €*).
- Con un solo click di conferma, tutti i fondi dei singoli profili vengono accreditati contemporaneamente.

### Griglia delle Card Profilo Individuali
Sotto al totale nucleo, una griglia ordinata espone le card sintetiche di ciascun profilo (*Saldo Minimo*, *Quota Mensile*, *Introito Mensile*), con pulsanti individuali di versamento rapido e colori neon coordinati.

---

## 4. Algoritmo Adattivo "Cold Start" & Quota di Sopravvivenza (Piano B)

Cosa succede se un utente inizia a usare MyPlano con un fondo iniziale basso (o pari a zero) e si ritrova una spesa consistente dopo soli due mesi? 
Con una quota ordinaria piatta andrebbe inevitabilmente in rosso. MyPlano risolve questo scenario con un **algoritmo predittivo intelligente**:

### Identificazione del Mese Critico
Il sistema simula l'andamento del saldo giorno per giorno (le spese interrotte con "interrompi da questa data" o saltate con "salta rata" non vengono più conteggiate), individua il primo mese in cui il conto andrebbe in deficit e segnala chiaramente quali spese provocano lo scoperto.

### Opzione 1: Integrazione Rapida Una Tantum
Un pulsante ben visibile nel banner di avviso permette di integrare con un click l'esatto importo mancante nel fondo (es. `+ Integra 350,00 € nel fondo`), portando istantaneamente il piano a regime.

### Opzione 2: Quota di Sopravvivenza Adattiva a Scaglioni (Piano B)
Se l'utente non dispone subito della liquidità da integrare, l'algoritmo calcola una quota mensile temporanea maggiorata a scaglioni:
- **Scaglione 1**: stabilisce la quota minima necessaria per superare il primo picco, facendo atterrare il saldo a **0,01 €** (pareggio millimetrico senza overpaying).
- **Scaglione 2**: ricalcola la quota per il picco successivo.
- **Ritorno a Regime**: superati i picchi ravvicinati, la quota torna automaticamente all'importo standard ordinario.

---

## 5. Timeline Interattiva del Cashflow

Per consentire la massima trasparenza, MyPlano offre una proiezione cronologica dettagliata:
- **Orizzonte Flessibile**: selezione dell'intervallo temporale desiderato da **1 a 120 mesi** (fino a 10 anni). Orizzonte, categoria e vista scelti vengono ricordati tra una sessione e l'altra.
- **Date esatte**: le rate cadono sempre nel giorno giusto (anche dopo il cambio ora legale); a fine mese una scadenza del 31 va al 28/02, 31/03, 30/04, e un 29/02 annuale va al 28/02; una frequenza "ogni N giorni" è davvero in giorni.
- **Tabella Mese per Mese**:
  - *Mese di riferimento* (es. ott 2026, nov 2026).
  - *Quota versata* (con badge distintivo se opera in regime di sopravvivenza).
  - *Uscite totali* con l'elenco esplicito delle singole spese in scadenza quel mese (es. *Bollo Auto (280 €)*, *Assicurazione Casa (150 €)*).
  - *Saldo stimato della riserva* a fine mese, con evidenziazione in rosso in caso di eventuale scoperto.
