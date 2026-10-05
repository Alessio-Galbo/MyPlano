<!-- hub:map:start -->
# Mappa: src/modules/documents/
Torna al [router](../../AGENTS.md) · 21 file
- [DocumentAlertFields.jsx](../../src/modules/documents/DocumentAlertFields.jsx): Campi form documento: giorni di preavviso, note e interruttore avviso
- [DocumentCard.css](../../src/modules/documents/DocumentCard.css): Stili della card documento: intestazione, righe metadati, note, hover
- [DocumentCard.jsx](../../src/modules/documents/DocumentCard.jsx): Card documento con stato scadenza, metadati, toggle avviso e conferma eliminazione
- [DocumentCardActions.css](../../src/modules/documents/DocumentCardActions.css): Stili dei pulsanti azione della card documento, dimensioni touch 44px
- [DocumentCardActions.jsx](../../src/modules/documents/DocumentCardActions.jsx): Pulsanti Rinnova, Modifica, Elimina della card documento con aria-label
- [DocumentCardMeta.jsx](../../src/modules/documents/DocumentCardMeta.jsx): Righe metadati della card: identificativo, ente, data scadenza, note
- [DocumentDetailsFields.jsx](../../src/modules/documents/DocumentDetailsFields.jsx): Campi form documento: identificativo, ente emittente, data di rilascio
- [DocumentEmptyState.jsx](../../src/modules/documents/DocumentEmptyState.jsx): Stato vuoto della lista documenti, testo diverso per tutti i profili o uno
- [DocumentFormFields.jsx](../../src/modules/documents/DocumentFormFields.jsx): Campi principali del form documento: titolo, tipo suggerito, profilo, scadenza
- [DocumentFormModal.jsx](../../src/modules/documents/DocumentFormModal.jsx): Modale di creazione/modifica documento con valori predefiniti e salvataggio
- [DocumentList.css](../../src/modules/documents/DocumentList.css): Stili della vista elenco documenti: layout, stato vuoto, header e pulsante aggiungi mobile
- [DocumentList.jsx](../../src/modules/documents/DocumentList.jsx): Vista documenti: filtro per profilo, modali di creazione/modifica/rinnovo, eliminazione
- [DocumentListBody.jsx](../../src/modules/documents/DocumentListBody.jsx): Griglia di card dei documenti, o guida primo profilo / stato vuoto se non ce ne sono
- [DocumentListHeader.jsx](../../src/modules/documents/DocumentListHeader.jsx): Intestazione della sezione documenti con titolo e pulsante Aggiungi documento
- [DocumentRenewModal.css](../../src/modules/documents/DocumentRenewModal.css): Stili del modale di rinnovo: scheda info, griglia durate preimpostate, anteprima
- [DocumentRenewModal.jsx](../../src/modules/documents/DocumentRenewModal.jsx): Modale per rinnovare un documento: durate rapide (1-10 anni) e nuova data scadenza
- [DocumentValiditySelector.css](../../src/modules/documents/DocumentValiditySelector.css): Stili dei chip di durata rapida per la validità del documento
- [DocumentValiditySelector.jsx](../../src/modules/documents/DocumentValiditySelector.jsx): Chip per impostare la scadenza a oggi + 1/3/5/10 anni nel form documento
- [documentHelpers.js](../../src/modules/documents/documentHelpers.js): Helper documenti: stato scadenza, calcolo data di rinnovo, formato data, etichetta tipo
- [index.js](../../src/modules/documents/index.js): Esporta lista, card, modale form e helper del modulo documenti
- [useDocumentDeleteWithUndo.js](../../src/modules/documents/useDocumentDeleteWithUndo.js): Hook che elimina un documento e mostra un toast con Annulla per ripristinarlo
<!-- hub:map:end -->
