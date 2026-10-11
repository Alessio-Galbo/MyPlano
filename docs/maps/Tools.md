<!-- hub:map:start -->
# Mappa: Tools/
Torna al [router](../../AGENTS.md) · 18 file
- [README.md](../../Tools/README.md): Registro Strumenti & Script di Utilità
- [check_i18n_keys.py](../../Tools/check_i18n_keys.py): Controlla che le chiavi t() usate in src esistano nei file di lingua it ed en
- [check_line_limits.py](../../Tools/check_line_limits.py): Controllo del limite di righe per file: richiama lo strumento unico di AI-hub.
- [launch_with_qr.py](../../Tools/launch_with_qr.py): Avvia il server di sviluppo e stampa gli indirizzi per PC e smartphone, con QR del link in rete loc…
- [line_limits_fallback.py](../../Tools/line_limits_fallback.py): Controllo autonomo del limite di righe, usato da check_line_limits.py quando AI-hub non c'è
- [test_auto_backup.mjs](../../Tools/test_auto_backup.mjs): Automatic backup and snapshot tests: `node Tools/test_auto_backup.mjs`.
- [test_auto_backup_cadence.mjs](../../Tools/test_auto_backup_cadence.mjs): Cadence and preference test cases, loaded by Tools/test_auto_backup.mjs.
- [test_dates.mjs](../../Tools/test_dates.mjs): Recurrence/date tests, no dependencies: `node Tools/test_dates.mjs` (runs itself in Rome and New Yo…
- [test_dates_history.mjs](../../Tools/test_dates_history.mjs): History backfill + installment-key audit cases, run by Tools/test_dates.mjs (do not run alone).
- [test_demo_data.mjs](../../Tools/test_demo_data.mjs): Node test for the sample-data detection (src/components/onboarding/demoCompare.js).
- [test_harness.mjs](../../Tools/test_harness.mjs): Shared setup of the dependency-free Tools/test_*.mjs runners: Vite-style extensionless imports, loa…
- [test_logic.py](../../Tools/test_logic.py): Test unitari: costi annui per frequenza, deficit, strategia quote e chiavi di traduzione
- [test_notifications.mjs](../../Tools/test_notifications.mjs): Notification tests, no dependencies: `node Tools/test_notifications.mjs` (runs itself in Rome and N…
- [test_notifications_alert.mjs](../../Tools/test_notifications_alert.mjs): Per-expense notice (`alertDays`) and the global default, loaded by test_notifications.mjs (not a st…
- [test_notifications_ics.mjs](../../Tools/test_notifications_ics.mjs): .ics export cases, loaded by test_notifications.mjs (not a standalone runner).
- [test_profiles.mjs](../../Tools/test_profiles.mjs): Profile ownership tests, no dependencies: `node Tools/test_profiles.mjs`.
- [test_system_notifications.mjs](../../Tools/test_system_notifications.mjs): System notification tests, no dependencies: `node Tools/test_system_notifications.mjs`.
- [test_system_notifications_alert.mjs](../../Tools/test_system_notifications_alert.mjs): Per-expense notice (`alertDays`) in the system-notification mirror and summary, loaded by test_syst…
<!-- hub:map:end -->
