<!-- hub:map:start -->
# Mappa: src/core/storage/
Torna al [router](../../AGENTS.md) · 29 file
- [archiveDirectory.js](../../src/core/storage/archiveDirectory.js): selectArchiveDirectory, getConnectedDirectoryName, disconnectArchiveDirectory, appendRootIndex
- [archiveNaming.js](../../src/core/storage/archiveNaming.js): uniqueId, receiptBlobKey, freeFileName
- [archiveService.js](../../src/core/storage/archiveService.js): saveReceiptToArchive, openReceiptFromArchive, selectArchiveDirectory, getConnectedDirectoryName, di…
- [backupAttachments.js](../../src/core/storage/backupAttachments.js): getAttachmentsSize, collectAttachments, restoreAttachments
- [backupFormat.js](../../src/core/storage/backupFormat.js): BACKUP_FORMAT, BACKUP_VERSION, APP_VERSION, readAllDataKeys, buildBackup (+2)
- [backupValidation.js](../../src/core/storage/backupValidation.js): validateBackupData, validateAttachments, countBackupOrphans
- [backupWriter.js](../../src/core/storage/backupWriter.js): restoreSnapshot, rollback, writeDataAtomically
- [expenseAlertDefault.js](../../src/core/storage/expenseAlertDefault.js): getExpenseAlertDefault, setExpenseAlertDefault, subscribeExpenseAlertDefault
- [exportImportService.js](../../src/core/storage/exportImportService.js): exportAllAppData, exportBackupJson, importAllAppData, applyParsedBackup, parseBackup (+2)
- [idMigrationHelper.js](../../src/core/storage/idMigrationHelper.js): createItemId, ensureItemIds
- [imageOptimizer.js](../../src/core/storage/imageOptimizer.js): optimizeReceiptImage
- [index.js](../../src/core/storage/index.js): storageService, INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES
- [indexedDbHelper.js](../../src/core/storage/indexedDbHelper.js): setDbItem, getDbItem, removeDbItem, getDbEntries, removeDbItemsByPrefix
- [initialData.js](../../src/core/storage/initialData.js): INITIAL_PROFILES, INITIAL_DOCUMENTS, INITIAL_EXPENSES
- [jpegExifWriter.js](../../src/core/storage/jpegExifWriter.js): injectJpegExifTags
- [migrations.js](../../src/core/storage/migrations.js): MIGRATIONS, CURRENT_SCHEMA_VERSION, getSchemaVersion, runMigrations
- [notificationStorage.js](../../src/core/storage/notificationStorage.js): getDismissedNotificationIds, setDismissedNotificationIds, subscribeDismissedNotifications, dismissN…
- [profileFinanceStorage.js](../../src/core/storage/profileFinanceStorage.js): profileFinanceStorage
- [profileMigrationHelper.js](../../src/core/storage/profileMigrationHelper.js): normalizeProfileFinances
- [safeStorage.js](../../src/core/storage/safeStorage.js): Defensive localStorage access: corrupt JSON never crashes the app (the raw
- [seedData/seedDocuments.js](../../src/core/storage/seedData/seedDocuments.js): INITIAL_DOCUMENTS
- [seedData/seedExpenses.js](../../src/core/storage/seedData/seedExpenses.js): INITIAL_EXPENSES
- [seedData/seedHomeExpenses.js](../../src/core/storage/seedData/seedHomeExpenses.js): SEED_HOME_EXPENSES
- [seedData/seedPersonalExpenses.js](../../src/core/storage/seedData/seedPersonalExpenses.js): SEED_PERSONAL_EXPENSES
- [seedData/seedProfiles.js](../../src/core/storage/seedData/seedProfiles.js): INITIAL_PROFILES
- [seedData/seedWorkExpenses.js](../../src/core/storage/seedData/seedWorkExpenses.js): SEED_WORK_EXPENSES
- [storageKeys.js](../../src/core/storage/storageKeys.js): Single registry of every localStorage key used by MyPlano.
- [storageResetService.js](../../src/core/storage/storageResetService.js): storageResetService
- [storageService.js](../../src/core/storage/storageService.js): storageService
<!-- hub:map:end -->
