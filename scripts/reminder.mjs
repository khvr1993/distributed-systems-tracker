import { DAY_LABELS, getItems } from '../js/plan-data.js';
import { addDays } from '../js/util.js';

const topic = (process.env.NTFY_TOPIC || '').trim();
const startDate = (process.env.START_DATE || '').trim();
const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').trim().replace(/\/+$/, '');
const appUrl = (process.env.APP_URL || '').trim();
const tzOffset = (process.env.TZ_OFFSET || '0').trim();

if (!topic) {
  console.log('NTFY_TOPIC is not set — skipping reminder.');
  process.exit(0);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
  console.log('START_DATE repository variable is missing or invalid — skipping reminder.');
  process.exit(0);
}

function offsetMinutes(value) {
  const match = value.match(/^([+-])(\d{2}):?(\d{2})$/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

const localNow = new Date(Date.now() + offsetMinutes(tzOffset) * 60_000);
const today = localNow.toISOString().slice(0, 10);

const due = getItems().filter(
  (item) => addDays(startDate, (item.week - 1) * 7 + item.dayOffset) === today,
);

if (!due.length) {
  console.log(`No sessions scheduled for ${today}.`);
  process.exit(0);
}

const lines = due.map((item) => `• ${DAY_LABELS[item.day]} — ${item.text}`);
const body = [`Week ${due[0].week} · ${due[0].weekTitle}`, ...lines].join('\n');

const response = await fetch(`${server}/${encodeURIComponent(topic)}`, {
  method: 'POST',
  headers: {
    Title: 'DS Tracker',
    Tags: 'books',
    Priority: 'default',
    ...(appUrl ? { Click: appUrl } : {}),
  },
  body,
});

if (!response.ok) {
  console.error(`ntfy request failed: ${response.status} ${await response.text()}`);
  process.exit(1);
}

console.log(`Sent reminder for ${today}:\n${body}`);
