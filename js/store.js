import { nextMonday } from './util.js';

const SETTINGS_KEY = 'dst.settings.v1';
const PROGRESS_KEY = 'dst.progress.v1';
const SNAPSHOT_KEY = 'dst.snapshot.v1';
const LAST_BACKUP_KEY = 'dst.lastbackup.v1';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const NOTE_MAX_LENGTH = 500;

export function defaultSettings() {
  return { startDate: nextMonday(), weekdayTime: '07:30', weekendTime: '10:00' };
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function sanitizeSettings(stored) {
  const fallback = defaultSettings();
  if (!stored || typeof stored !== 'object') return fallback;
  return {
    startDate: DATE_RE.test(stored.startDate) ? stored.startDate : fallback.startDate,
    weekdayTime: TIME_RE.test(stored.weekdayTime) ? stored.weekdayTime : fallback.weekdayTime,
    weekendTime: TIME_RE.test(stored.weekendTime) ? stored.weekendTime : fallback.weekendTime,
  };
}

export function loadSettings() {
  return sanitizeSettings(readJSON(SETTINGS_KEY));
}

export function saveSettings(settings) {
  writeJSON(SETTINGS_KEY, settings);
}

export function sanitizeProgress(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const clean = {};
  for (const [id, entry] of Object.entries(raw)) {
    if (!entry || typeof entry !== 'object') continue;
    const done = entry.done === true;
    const note = typeof entry.note === 'string' ? entry.note.trim().slice(0, NOTE_MAX_LENGTH) : '';
    const confidence = Number.isInteger(entry.confidence) && entry.confidence >= 1 && entry.confidence <= 5
      ? entry.confidence
      : null;
    if (!done && !note && !confidence) continue;
    const next = {};
    if (done) {
      next.done = true;
      next.at = typeof entry.at === 'string' && !Number.isNaN(Date.parse(entry.at))
        ? entry.at
        : new Date().toISOString();
    }
    if (note) next.note = note;
    if (confidence) next.confidence = confidence;
    clean[id] = next;
  }
  return clean;
}

export function loadProgress() {
  return sanitizeProgress(readJSON(PROGRESS_KEY));
}

export function saveProgress(progress) {
  writeJSON(PROGRESS_KEY, progress);
}

export function saveSnapshot({ progress, settings, reason }) {
  return writeJSON(SNAPSHOT_KEY, {
    at: new Date().toISOString(),
    reason: typeof reason === 'string' ? reason : 'manual',
    progress,
    settings,
  });
}

export function loadSnapshot() {
  const stored = readJSON(SNAPSHOT_KEY);
  if (!stored || typeof stored !== 'object') return null;
  return {
    at: typeof stored.at === 'string' ? stored.at : null,
    reason: typeof stored.reason === 'string' ? stored.reason : 'unknown',
    progress: sanitizeProgress(stored.progress),
    settings: sanitizeSettings(stored.settings),
  };
}

export function markBackupExported() {
  writeJSON(LAST_BACKUP_KEY, { at: new Date().toISOString() });
}

export function loadLastBackup() {
  const stored = readJSON(LAST_BACKUP_KEY);
  if (!stored || typeof stored !== 'object' || typeof stored.at !== 'string') return null;
  return Number.isNaN(Date.parse(stored.at)) ? null : stored.at;
}
