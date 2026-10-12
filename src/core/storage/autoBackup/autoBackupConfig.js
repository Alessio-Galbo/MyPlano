// Configuration and cadence checks for periodic automatic snapshots.
import { diffDays, todayISO } from '../../dates/isoDate';
import { readRaw, writeRaw } from '../safeStorage';
import { UI_KEYS } from '../storageKeys';

export const SNAPSHOT_PREFIX = 'snapshot_';
export const DEFAULT_MAX_SNAPSHOTS = 7;
export const AUTO_BACKUP_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
};

export const DEFAULT_AUTO_BACKUP_PREFS = {
  enabled: true,
  frequency: AUTO_BACKUP_FREQUENCIES.DAILY,
  lastRunAt: null,
};

export function readAutoBackupPrefs() {
  const raw = readRaw(UI_KEYS.AUTO_BACKUP_PREFS);
  if (!raw) return { ...DEFAULT_AUTO_BACKUP_PREFS };
  try {
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed?.enabled === 'boolean' ? parsed.enabled : DEFAULT_AUTO_BACKUP_PREFS.enabled,
      frequency: parsed?.frequency === AUTO_BACKUP_FREQUENCIES.WEEKLY
        ? AUTO_BACKUP_FREQUENCIES.WEEKLY
        : AUTO_BACKUP_FREQUENCIES.DAILY,
      lastRunAt: typeof parsed?.lastRunAt === 'string' ? parsed.lastRunAt : null,
    };
  } catch {
    return { ...DEFAULT_AUTO_BACKUP_PREFS };
  }
}

export function saveAutoBackupPrefs(patch = {}) {
  const current = readAutoBackupPrefs();
  const next = { ...current, ...patch };
  writeRaw(UI_KEYS.AUTO_BACKUP_PREFS, JSON.stringify(next));
  return next;
}

export function shouldRunAutoBackup({ prefs, nowIso = todayISO() } = {}) {
  const p = prefs || readAutoBackupPrefs();
  if (!p.enabled) return false;
  if (!p.lastRunAt) return true;
  const lastDate = p.lastRunAt.slice(0, 10);
  const days = diffDays(lastDate, nowIso);
  if (!Number.isFinite(days)) return true;
  if (p.frequency === AUTO_BACKUP_FREQUENCIES.WEEKLY) {
    return days >= 7;
  }
  return days >= 1;
}
