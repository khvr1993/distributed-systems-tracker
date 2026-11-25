const DURATION_BY_TYPE = {
  build: 'PT180M',
  capstone: 'PT180M',
  review: 'PT45M',
};

const TYPE_LABEL = {
  learn: 'Learn',
  lab: 'Lab',
  failure: 'Failure day',
  case: 'Case study',
  build: 'Build',
  review: 'Teach-back',
  capstone: 'Capstone',
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function icsDateTime(dateValue, timeValue) {
  const [y, m, d] = dateValue.split('-');
  const [hh, mm] = timeValue.split(':');
  return `${y}${m}${d}T${hh}${mm}00`;
}

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function foldLine(line) {
  let rest = line;
  let out = '';
  while (rest.length > 73) {
    out += `${rest.slice(0, 73)}\r\n `;
    rest = rest.slice(73);
  }
  return out + rest;
}

function utcStamp() {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

export function generateICS(entries, settings) {
  const stamp = utcStamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DS Tracker//Distributed Systems 26-week plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    foldLine('X-WR-CALNAME:DS Tracker — Distributed Systems'),
    foldLine('X-WR-CALDESC:26-week distributed systems study plan with alerts.'),
  ];

  for (const entry of entries) {
    const { item, date } = entry;
    const time = item.day === 'sat' || item.day === 'sun'
      ? settings.weekendTime
      : settings.weekdayTime;
    const label = TYPE_LABEL[item.type] || 'Session';
    const title = `DS W${item.week} · ${label}: ${item.text}`;
    const description = [
      `Week ${item.week} — ${item.weekTitle}`,
      item.text,
      `Estimated time: ${item.type === 'build' || item.type === 'capstone' ? '2–3 hours' : item.type === 'review' ? '45 minutes' : '90 minutes'}`,
      settings.appUrl ? `Open tracker: ${settings.appUrl}` : '',
    ].filter(Boolean).join('\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${item.id}@ds-tracker`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${icsDateTime(date, time)}`);
    lines.push(`DURATION:${DURATION_BY_TYPE[item.type] || 'PT90M'}`);
    lines.push(foldLine(`SUMMARY:${escapeICS(title)}`));
    lines.push(foldLine(`DESCRIPTION:${escapeICS(description)}`));
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT10M');
    lines.push('ACTION:DISPLAY');
    lines.push(foldLine(`DESCRIPTION:${escapeICS(`DS Tracker: ${item.text}`)}`));
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}
