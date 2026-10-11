<!-- hub:map:start -->
# Mappa: src/modules/settings/
Torna al [router](../../AGENTS.md) · 34 file
- [AutoBackupConfigSection.jsx](../../src/modules/settings/AutoBackupConfigSection.jsx): Section with frequency selector and manual snapshot creation trigger.
- [AutoBackupConfirmModal.jsx](../../src/modules/settings/AutoBackupConfirmModal.jsx): Confirm modal for restoring an automatic snapshot.
- [AutoBackupSnapshotsList.jsx](../../src/modules/settings/AutoBackupSnapshotsList.jsx): Renders the list of saved automatic snapshots.
- [ExpenseAlertDefaultRow.jsx](../../src/modules/settings/ExpenseAlertDefaultRow.jsx): Riga impostazioni: giorni di preavviso predefiniti per le scadenze delle spese
- [InstallmentKeyFixCard.css](../../src/modules/settings/InstallmentKeyFixCard.css): Stili della card di correzione rate spostate (lista, checkbox, date)
- [InstallmentKeyFixCard.jsx](../../src/modules/settings/InstallmentKeyFixCard.jsx): Card che corregge, su conferma, le rate salvate un giorno prima dal bug fuso orario
- [OrphanItemsAnchor.js](../../src/modules/settings/OrphanItemsAnchor.js): Ancora della card elementi orfani e scroll fino a essa dopo il cambio scheda
- [OrphanItemsCard.css](../../src/modules/settings/OrphanItemsCard.css): Stili della card elementi senza profilo (assegna a tutti, lista, select)
- [OrphanItemsCard.jsx](../../src/modules/settings/OrphanItemsCard.jsx): Card che elenca spese/documenti senza profilo e li assegna su conferma
- [OrphanItemsRow.jsx](../../src/modules/settings/OrphanItemsRow.jsx): Riga di un elemento orfano con menu per scegliere il profilo di destinazione
- [ResetConfirmModal.jsx](../../src/modules/settings/ResetConfirmModal.jsx): Modale di conferma per ripristino di fabbrica o cancellazione totale dati
- [SettingsArchiveCard.jsx](../../src/modules/settings/SettingsArchiveCard.jsx): Card impostazioni per collegare o scollegare la cartella archivio su disco
- [SettingsAutoBackupCard.css](../../src/modules/settings/SettingsAutoBackupCard.css): Stili per la card del backup automatico e la lista degli snapshot salvati.
- [SettingsAutoBackupCard.jsx](../../src/modules/settings/SettingsAutoBackupCard.jsx): Settings card for automatic periodic backups and local snapshot recovery.
- [SettingsBackupCard.css](../../src/modules/settings/SettingsBackupCard.css): Stili card backup: ultimo backup scaduto, messaggi esito, layout mobile
- [SettingsBackupCard.jsx](../../src/modules/settings/SettingsBackupCard.jsx): Card impostazioni per backup/ripristino JSON ed export calendario .ics
- [SettingsResetCard.css](../../src/modules/settings/SettingsResetCard.css): Stili della card manutenzione database e della modale di reset
- [SettingsResetCard.jsx](../../src/modules/settings/SettingsResetCard.jsx): Card manutenzione database: ripristino di fabbrica e cancellazione dati
- [SettingsSupportCard.css](../../src/modules/settings/SettingsSupportCard.css): Stili della card di supporto: icona colorata e pulsante link
- [SettingsSupportCard.jsx](../../src/modules/settings/SettingsSupportCard.jsx): Card impostazioni con link donazione Ko-fi per sostenere l'app gratuita
- [SettingsView.css](../../src/modules/settings/SettingsView.css): Stili della pagina impostazioni: contenitore, card, righe con etichetta e descrizione
- [SettingsView.jsx](../../src/modules/settings/SettingsView.jsx): Schermata Impostazioni: lingua, notifiche, backup, archivio, ripristino e supporto.
- [SnapshotItemRow.jsx](../../src/modules/settings/SnapshotItemRow.jsx): Renders a single automatic snapshot item with restore, download, and delete actions.
- [SystemNotificationsCard.css](../../src/modules/settings/SystemNotificationsCard.css): Stili card notifiche dispositivo: badge di stato, avvisi, pulsante di test
- [SystemNotificationsCard.jsx](../../src/modules/settings/SystemNotificationsCard.jsx): Card notifiche di sistema: toggle permesso, stato, avvisi e invio notifica di prova
- [backupTexts.js](../../src/modules/settings/backupTexts.js): Testi tradotti per backup e ripristino: messaggi di esito, ultimo backup, riepilogo importazione, p…
- [icsCalendar.js](../../src/modules/settings/icsCalendar.js): Pure .ics builder (no i18n import, testable in node). `t` is the translate function.
- [icsExportHelper.js](../../src/modules/settings/icsExportHelper.js): Genera calendario ICS da documenti/spese con traduttore e scarica file nel browser
- [icsFormat.js](../../src/modules/settings/icsFormat.js): RFC 5545 helpers: text escaping, 75-octet line folding, DATE values, recurrence rules.
- [index.js](../../src/modules/settings/index.js): Esporta la schermata Impostazioni, la scheda del backup automatico e gli helper per il calendario (…
- [useAutoBackupActions.js](../../src/modules/settings/useAutoBackupActions.js): State and actions for automatic backup settings and snapshot management.
- [useAutoBackupPrefs.js](../../src/modules/settings/useAutoBackupPrefs.js): Hook to manage automatic backup user preferences.
- [useBackupActions.js](../../src/modules/settings/useBackupActions.js): Hook stato e azioni backup: export JSON, scelta file, import con conferma, allegati
- [useSystemNotifications.js](../../src/modules/settings/useSystemNotifications.js): Hook notifiche dispositivo: preferenza salvata, permesso browser, sync periodico
<!-- hub:map:end -->
