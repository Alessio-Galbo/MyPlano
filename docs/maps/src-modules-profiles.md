<!-- hub:map:start -->
# Mappa: src/modules/profiles/
Torna al [router](../../AGENTS.md) · 17 file
- [AddProfileModal.css](../../src/modules/profiles/AddProfileModal.css): Stili dei form profilo: gruppi, righe a due colonne, input, azioni, avviso nome doppio
- [AddProfileModal.jsx](../../src/modules/profiles/AddProfileModal.jsx): Modale per creare un profilo o modificarne nome e colore, con fondo e reddito iniziali
- [DeleteProfileModal.jsx](../../src/modules/profiles/DeleteProfileModal.jsx): Modale di conferma eliminazione profilo con avviso su spese e documenti coinvolti
- [ProfileColorPicker.css](../../src/modules/profiles/ProfileColorPicker.css): Swatches of the profile colour picker (hues mirror PROFILE_HUES in profileColors.js).
- [ProfileColorPicker.jsx](../../src/modules/profiles/ProfileColorPicker.jsx): Selettore colore del profilo: automatico o una delle tonalità predefinite
- [ProfileFinanceFields.jsx](../../src/modules/profiles/ProfileFinanceFields.jsx): Campi fondo iniziale e reddito mensile mostrati solo alla creazione del profilo
- [ProfileManagementItem.jsx](../../src/modules/profiles/ProfileManagementItem.jsx): Riga profilo nella gestione: nome, fondo, totale annuo, pulsanti modifica ed elimina
- [ProfileManagementModal.css](../../src/modules/profiles/ProfileManagementModal.css): Stili della modale gestione profili: lista, voce attiva, tag, pulsanti, footer
- [ProfileManagementModal.jsx](../../src/modules/profiles/ProfileManagementModal.jsx): Modale gestione profili: elenco con totali annui, vista "tutti", aggiunta e selezione
- [ProfileModalsContainer.jsx](../../src/modules/profiles/ProfileModalsContainer.jsx): Monta le modali di creazione, modifica ed eliminazione profilo con annullamento
- [ProfileNameField.jsx](../../src/modules/profiles/ProfileNameField.jsx): Campo nome profilo con avviso non bloccante per nomi duplicati
- [index.js](../../src/modules/profiles/index.js): Aggregatore delle esportazioni del modulo profili (modali, hook, colori)
- [profileColors.js](../../src/modules/profiles/profileColors.js): Tonalità selezionabili e hook che inietta un tag style con i colori scelti dei profili
- [profileNames.js](../../src/modules/profiles/profileNames.js): Controllo nomi profilo duplicati ignorando maiuscole e spazi
- [useProfileDeleteWithUndo.js](../../src/modules/profiles/useProfileDeleteWithUndo.js): Hook che elimina un profilo con i suoi dati e offre "Annulla" in un toast
- [useProfileDialogs.js](../../src/modules/profiles/useProfileDialogs.js): Hook con lo stato aperto/chiuso delle modali profilo: aggiungi, gestisci, modifica, elimina
- [useProfileSelectionGuard.js](../../src/modules/profiles/useProfileSelectionGuard.js): Hook che mantiene valido il profilo selezionato quando la lista profili cambia
<!-- hub:map:end -->
