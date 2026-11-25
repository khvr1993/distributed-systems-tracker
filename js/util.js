const DAY_MS = 86_400_000;

export function parseDateStr(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function dateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayStr() {
  return dateStr(new Date());
}

export function addDays(value, days) {
  const d = parseDateStr(value);
  d.setDate(d.getDate() + days);
  return dateStr(d);
}

export function daysBetween(start, end) {
  return Math.round((parseDateStr(end) - parseDateStr(start)) / DAY_MS);
}

export function localDateStr(date) {
  return dateStr(date);
}

export function nextMonday() {
  const d = new Date();
  const add = (8 - d.getDay()) % 7;
  d.setDate(d.getDate() + add);
  return dateStr(d);
}

const fullFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
const shortFmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' });

export function formatFull(value) {
  return fullFmt.format(parseDateStr(value));
}

export function formatShort(value) {
  return shortFmt.format(parseDateStr(value));
}

export function formatWeekday(value) {
  return weekdayFmt.format(parseDateStr(value));
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function downloadFile(name, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
