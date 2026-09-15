# 00 - Idea Base e Punto di Partenza del Progetto

## 1. Il Problema Reale

La gestione delle scadenze e delle finanze personali soffre abitualmente di due grandi criticità:

1. **Dispersione dei Documenti e delle Carte**:
   - Documenti d'identità, patenti, tessere sanitarie e carte bancarie scadono a distanza di anni.
   - Ci si accorge che un documento è scaduto spesso al momento del bisogno, con disagi e corse contro il tempo.

2. **L'Illusione della Liquidità e lo "Shock da Spese Periodiche"**:
   - Molte spese gravose non hanno cadenza mensile, ma cadono una o due volte l'anno (es. Assicurazione auto, bollo auto, manutenzioni, tasse/F24).
   - Se queste spese non vengono pianificate, quando arrivano consumano l'intero stipendio di quel mese.

---

## 2. La Visione di MyPlano

**MyPlano** unifica in un solo cruscotto personale tre dimensioni fondamentali:
- **Scadenzario Documenti & Carte**: per non restare mai con documenti scaduti.
- **Scadenzario Pagamenti**: per tracciare bollette, tributi e canoni.
- **Bilancio Sinking Funds**: per calcolare la quota mensile esatta e prevenire i buchi di cassa.

---

## 3. Il Principio Finanziario: Il Sinking Fund & il "Cold Start"

Il nucleo matematico di MyPlano si basa sulla tecnica del **Sinking Fund**:

1. **Quota Mensile di Regime**:
   $$\text{Quota Mensile} = \frac{\sum \text{Spese Periodiche Annuali}}{12}$$

2. **Il Problema della Partenza da Zero (Cold Start Deficit)**:
   - Se un utente inizia oggi con **0 €** di risparmi dedicati e tra 2 mesi ha una spesa imminente di **1.000 €** (avendo accumulato solo 200 € a 100 €/mese), si troverà in **scoperto di 800 €**.
   - MyPlano calcola preventivamente:
     - **Picco Massimo di Scoperto**: il punto di massimo disavanzo previsto nei 12 mesi.
     - **Cuscinetto di Avvio Consigliato**: l'iniezione iniziale una-tantum per andare subito a regime senza mai andare in negativo.
     - **Quota di Rincorsa**: l'alternativa per chi non ha il cuscinetto iniziale, calcolando la quota maggiorata da versare nei primi mesi prima del picco.

---

## 4. Principi Guida & Vincoli Iniziali

- **100% Privacy & Local-First**: nessun dato personale o finanziario inviato al cloud.
- **Nessuna AI su Dati Sensibili**: calcoli matematici deterministici e trasparenti.
- **Nucleo Familiare Multi-Profilo**: gestione a compartimenti singoli o consolidata.
- **Controllo Totale Notifiche**: toggle granulari per non generare ansia.
- **Leggerezza e Portabilità**: zero bloatware, esecuzione locale su PC e mobile via hotspot.
