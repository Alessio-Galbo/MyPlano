// Cadence and preference test cases, loaded by Tools/test_auto_backup.mjs.
export function runCadenceTests({ eq, shouldRunAutoBackup, readAutoBackupPrefs, saveAutoBackupPrefs, snapshotMeta, constants }) {
  const { AUTO_BACKUP_FREQUENCIES, DEFAULT_AUTO_BACKUP_PREFS } = constants;

  // 1. Cadence & shouldRunAutoBackup
  eq('disabled -> never runs', shouldRunAutoBackup({
    prefs: { enabled: false, frequency: 'daily', lastRunAt: null }, nowIso: '2026-10-10',
  }), false);

  eq('enabled with no previous run -> runs', shouldRunAutoBackup({
    prefs: { enabled: true, frequency: 'daily', lastRunAt: null }, nowIso: '2026-10-10',
  }), true);

  eq('daily: run today -> do not run again', shouldRunAutoBackup({
    prefs: { enabled: true, frequency: 'daily', lastRunAt: '2026-10-10T08:00:00.000Z' }, nowIso: '2026-10-10',
  }), false);

  eq('daily: run yesterday -> run today', shouldRunAutoBackup({
    prefs: { enabled: true, frequency: 'daily', lastRunAt: '2026-10-09T08:00:00.000Z' }, nowIso: '2026-10-10',
  }), true);

  eq('weekly: run 4 days ago -> do not run', shouldRunAutoBackup({
    prefs: { enabled: true, frequency: 'weekly', lastRunAt: '2026-10-06T08:00:00.000Z' }, nowIso: '2026-10-10',
  }), false);

  eq('weekly: run 7 days ago -> run', shouldRunAutoBackup({
    prefs: { enabled: true, frequency: 'weekly', lastRunAt: '2026-10-03T08:00:00.000Z' }, nowIso: '2026-10-10',
  }), true);

  // 2. Preferences reading & saving
  eq('default prefs', readAutoBackupPrefs(), DEFAULT_AUTO_BACKUP_PREFS);
  saveAutoBackupPrefs({ frequency: AUTO_BACKUP_FREQUENCIES.WEEKLY });
  eq('updated frequency', readAutoBackupPrefs().frequency, 'weekly');
  saveAutoBackupPrefs({ lastRunAt: '2026-10-10T01:00:00.000Z' });
  eq('updated lastRunAt', readAutoBackupPrefs().lastRunAt, '2026-10-10T01:00:00.000Z');

  // 3. Metadata
  const sample = {
    createdAt: '2026-10-10T01:00:00.000Z',
    data: { myplano_profiles: [{ id: 'p1' }, { id: 'p2' }], myplano_expenses: [{ id: 'e1' }], myplano_documents: [] },
  };
  eq('meta counts', snapshotMeta(sample), { profiles: 2, expenses: 1, documents: 0, createdAt: '2026-10-10T01:00:00.000Z' });
}
