<!-- hub:map:start -->
# Mappa: src/modules/settings/
Torna al [router](../../AGENTS.md) · 26 file
- [ExpenseAlertDefaultRow.jsx](../../src/modules/settings/ExpenseAlertDefaultRow.jsx): Riga impostazioni: giorni di preavviso predefiniti per le scadenze delle spese
- [InstallmentKeyFixCard.css](../../src/modules/settings/InstallmentKeyFixCard.css): Stili della card di correzione rate spostate (lista, checkbox, date)
- [InstallmentKeyFixCard.jsx](../../src/modules/settings/InstallmentKeyFixCard.jsx): Card che corregge, su conferma, le rate salvate un giorno prima dal bug fuso orario
- [OrphanItemsAnchor.js](../../src/modules/settings/OrphanItemsAnchor.js): Ancora della card elementi orfani e scroll fino a essa dopo il cambio scheda
- [OrphanItemsCard.css](../../src/modules/settings/OrphanItemsCard.css): Stili della card elementi senza profilo (assegna a tutti, lista, select)
- [OrphanItemsCard.jsx](../../src/modules/settings/OrphanItemsCard.jsx): Card che elenca spese/documenti senza profilo e li assegna su conferma
- [OrphanItemsRow.jsx](../../src/modules/settings/OrphanItemsRow.jsx): Riga di un elemento orfano con menu per scegliere il profilo di destinazione
- [ResetConfirmModal.jsx](../../src/modules/settings/ResetConfirmModal.jsx): Modale di conferma per ripristino di fabbrica o cancellazione totale dati
- [SettingsArchiveCard.jsx](../../src/modules/settings/SettingsArchiveCard.jsx): Card impostazioni per collegare o scollegare la cartella archivio su disco
- [SettingsBackupCard.css](../../src/modules/settings/SettingsBackupCard.css): Stili card backup: ultimo backup scaduto, messaggi esito, layout mobile
- [SettingsBackupCard.jsx](../../src/modules/settings/SettingsBackupCard.jsx): Card impostazioni per backup/ripristino JSON ed export calendario .ics
- [SettingsResetCard.css](../../src/modules/settings/SettingsResetCard.css): Stili della card manutenzione database e della modale di reset
- [SettingsResetCard.jsx](../../src/modules/settings/SettingsResetCard.jsx): Card manutenzione database: ripristino di fabbrica e cancellazione dati
- [SettingsSupportCard.css](../../src/modules/settings/SettingsSupportCard.css): Stili della card di supporto: icona colorata e pulsante link
- [SettingsSupportCard.jsx](../../src/modules/settings/SettingsSupportCard.jsx): Card impostazioni con link donazione Ko-fi per sostenere l'app gratuita
- [SettingsView.css](../../src/modules/settings/SettingsView.css): Stili della pagina impostazioni: contenitore, card, righe con etichetta e descrizione
- [SettingsView.jsx](../../src/modules/settings/SettingsView.jsx): Pagina impostazioni: lingua, silenzia tutto, notifiche, backup, archivio, reset, card
- [SystemNotificationsCard.css](../../src/modules/settings/SystemNotificationsCard.css): Stili card notifiche dispositivo: badge di stato, avvisi, pulsante di test
- [SystemNotificationsCard.jsx](../../src/modules/settings/SystemNotificationsCard.jsx): Card notifiche di sistema: toggle permesso, stato, avvisi e invio notifica di prova
- [backupTexts.js](../../src/modules/settings/backupTexts.js): Testi tradotti del backup: messaggi errore, ultimo backup, riepilogo import, dimensioni
- [icsCalendar.js](../../src/modules/settings/icsCalendar.js): Pure .ics builder (no i18n import, testable in node). `t` is the translate function.
- [icsExportHelper.js](../../src/modules/settings/icsExportHelper.js): Genera calendario ICS da documenti/spese con traduttore e scarica file nel browser
- [icsFormat.js](../../src/modules/settings/icsFormat.js): RFC 5545 helpers: text escaping, 75-octet line folding, DATE values, recurrence rules.
- [index.js](../../src/modules/settings/index.js): Aggregatore del modulo impostazioni: esporta SettingsView e helper export ICS
- [useBackupActions.js](../../src/modules/settings/useBackupActions.js): Hook stato e azioni backup: export JSON, scelta file, import con conferma, allegati
- [useSystemNotifications.js](../../src/modules/settings/useSystemNotifications.js): Hook notifiche dispositivo: preferenza salvata, permesso browser, sync periodico
<!-- hub:map:end -->
