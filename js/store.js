import { nextMonday } from './util.js';

const SETTINGS_KEY = 'dst.settings.v1';
const PROGRESS_KEY = 'dst.progress.v1';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

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

export function loadSettings() {
  const fallback = defaultSettings();
  const stored = readJSON(SETTINGS_KEY);
  if (!stored || typeof stored !== 'object') return fallback;
  return {
    startDate: DATE_RE.test(stored.startDate) ? stored.startDate : fallback.startDate,
    weekdayTime: TIME_RE.test(stored.weekdayTime) ? stored.weekdayTime : fallback.weekdayTime,
    weekendTime: TIME_RE.test(stored.weekendTime) ? stored.weekendTime : fallback.weekendTime,
  };
}

export function saveSettings(settings) {
  writeJSON(SETTINGS_KEY, settings);
}

export function loadProgress() {
  const stored = readJSON(PROGRESS_KEY);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  const clean = {};
  for (const [id, entry] of Object.entries(stored)) {
    if (!entry || entry.done !== true) continue;
    const at = typeof entry.at === 'string' && !Number.isNaN(Date.parse(entry.at))
      ? entry.at
      : new Date().toISOString();
    clean[id] = { done: true, at };
  }
  return clean;
}

export function saveProgress(progress) {
  writeJSON(PROGRESS_KEY, progress);
}
