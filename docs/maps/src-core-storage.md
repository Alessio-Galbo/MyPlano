<!-- hub:map:start -->
# Mappa: src/core/storage/
Torna al [router](../../AGENTS.md) · 29 file
- [archiveDirectory.js](../../src/core/storage/archiveDirectory.js): Sceglie, collega e scollega la cartella archivio del PC e aggiorna l'indice JSON
- [archiveNaming.js](../../src/core/storage/archiveNaming.js): ID univoci, chiave IndexedDB delle ricevute e nomi file senza sovrascritture
- [archiveService.js](../../src/core/storage/archiveService.js): Salva le ricevute in una cartella anno/categoria o in IndexedDB, poi le riapre
- [backupAttachments.js](../../src/core/storage/backupAttachments.js): Ricevute IndexedDB in base64 per il backup: dimensione, raccolta, ripristino sicuro
- [backupFormat.js](../../src/core/storage/backupFormat.js): Formato backup v3: lettura chiavi dati, costruzione, parsing e conversione legacy
- [backupValidation.js](../../src/core/storage/backupValidation.js): Valida dati e allegati del backup e conta spese/documenti senza profilo
- [backupWriter.js](../../src/core/storage/backupWriter.js): Scrittura atomica delle chiavi dati con rollback allo snapshot se fallisce
- [expenseAlertDefault.js](../../src/core/storage/expenseAlertDefault.js): Giorni di preavviso predefiniti per le spese: lettura, salvataggio, iscrizioni
- [exportImportService.js](../../src/core/storage/exportImportService.js): Esporta e importa backup con allegati, rollback e migrazioni dopo l'import
- [idMigrationHelper.js](../../src/core/storage/idMigrationHelper.js): Crea ID unici, corregge ID mancanti o duplicati e ripulisce notifiche rotte
- [imageOptimizer.js](../../src/core/storage/imageOptimizer.js): Ridimensiona le immagini delle ricevute e le comprime in JPEG con un canvas
- [index.js](../../src/core/storage/index.js): Aggregatore: esporta storageService e i dati iniziali (profili, documenti, spese)
- [indexedDbHelper.js](../../src/core/storage/indexedDbHelper.js): Helper IndexedDB: leggi/scrivi/elimina chiavi e voci per prefisso (es. ricevute blob_)
- [initialData.js](../../src/core/storage/initialData.js): Aggregatore dei dati demo iniziali: profili, documenti e spese da seedData
- [jpegExifWriter.js](../../src/core/storage/jpegExifWriter.js): Inserisce tag XPKeywords EXIF (APP1) in un buffer JPEG
- [migrations.js](../../src/core/storage/migrations.js): Migrazioni idempotenti dello schema dati: normalizza profili, assegna id, versione
- [notificationStorage.js](../../src/core/storage/notificationStorage.js): Store condiviso delle notifiche nascoste in localStorage, sincronizzato tra viste e tab
- [profileFinanceStorage.js](../../src/core/storage/profileFinanceStorage.js): Lettura/scrittura di fondi, entrate e loro configurazioni per profilo in localStorage
- [profileMigrationHelper.js](../../src/core/storage/profileMigrationHelper.js): Normalizza saldo iniziale ed entrata mensile dei profili da dati legacy, arrotondati
- [safeStorage.js](../../src/core/storage/safeStorage.js): Defensive localStorage access: corrupt JSON never crashes the app (the raw
- [seedData/seedDocuments.js](../../src/core/storage/seedData/seedDocuments.js): Documenti demo (carta identità, patente, tessera sanitaria, albo) con scadenze
- [seedData/seedExpenses.js](../../src/core/storage/seedData/seedExpenses.js): Unisce le spese demo personali, casa e lavoro in INITIAL_EXPENSES
- [seedData/seedHomeExpenses.js](../../src/core/storage/seedData/seedHomeExpenses.js): Spese demo del profilo Casa & Famiglia (TARI, caldaia, condominio, utenze)
- [seedData/seedPersonalExpenses.js](../../src/core/storage/seedData/seedPersonalExpenses.js): Spese demo del profilo Personale (RC auto, bollo, revisione, palestra, polizza)
- [seedData/seedProfiles.js](../../src/core/storage/seedData/seedProfiles.js): Tre profili demo con colore, saldo iniziale ed entrata mensile
- [seedData/seedWorkExpenses.js](../../src/core/storage/seedData/seedWorkExpenses.js): Spese demo del profilo Studio/Lavoro (RC professionale, albo, software, commercialista)
- [storageKeys.js](../../src/core/storage/storageKeys.js): Single registry of every localStorage key used by MyPlano.
- [storageResetService.js](../../src/core/storage/storageResetService.js): Svuota tutti i dati o ripristina i demo di fabbrica, eliminando anche le ricevute
- [storageService.js](../../src/core/storage/storageService.js): API dati: profili, documenti, spese, saldi, redditi, strategie budget, export/import/reset
<!-- hub:map:end -->
