<!-- hub:map:start -->
# Mappa: src/core/state/
Torna al [router](../../AGENTS.md) · 11 file
- [AppContext.jsx](../../src/core/state/AppContext.jsx): Contesto globale: scheda attiva, profilo selezionato, silenzioso notifiche persistiti
- [index.js](../../src/core/state/index.js): Aggregatore stato: AppProvider, useApp e useAppData
- [profileActions.js](../../src/core/state/profileActions.js): Eventi globali per aprire da ovunque i dialoghi nuovo profilo e gestione profili
- [profileBundle.js](../../src/core/state/profileBundle.js): Pure helpers to take a profile and everything that belongs to it out of the
- [uiActions.js](../../src/core/state/uiActions.js): Evento per aprire il centro notifiche (con richiesta in attesa) e avviso dati cambiati
- [useAppData.js](../../src/core/state/useAppData.js): Hook dati principali: documenti, spese, saldo, entrate, profili; salva/elimina/ripristina
- [usePersistedSlice.js](../../src/core/state/usePersistedSlice.js): Hook di stato sincronizzato con lo storage: scrittura dopo il commit e ricarica
- [useProfileBundle.js](../../src/core/state/useProfileBundle.js): Elimina un profilo con spese, documenti e finanze, e ripristina lo snapshot (annulla)
- [useProfileFinance.js](../../src/core/state/useProfileFinance.js): Hook per fondi, entrate e relative configurazioni per profilo, salvati e sincronizzati
- [useProfileState.js](../../src/core/state/useProfileState.js): Hook dei profili: aggiunta, modifica, eliminazione, ripristino e saldo atomico
- [useStorageSync.js](../../src/core/state/useStorageSync.js): Ricarica i dati quando un'altra scheda modifica il localStorage di MyPlano
<!-- hub:map:end -->
