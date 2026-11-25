import assert from 'node:assert/strict';
import { PHASES, WEEKS, DAY_ORDER, getItems } from '../js/plan-data.js';
import { addDays, daysBetween } from '../js/util.js';
import { generateICS } from '../js/ics.js';

const items = getItems();

assert.equal(items.length, 160, 'expected 160 sessions');
assert.equal(new Set(items.map((item) => item.id)).size, items.length, 'session ids must be unique');
assert.equal(WEEKS.length, 26, 'expected 26 weeks');
assert.equal(PHASES.length, 6, 'expected 6 phases');

const expected = new Map();
for (let week = 1; week <= 20; week += 1) expected.set(week, 7);
for (const week of [21, 22, 23, 24]) expected.set(week, 2);
expected.set(25, 7);
expected.set(26, 5);

for (const [week, count] of expected) {
  assert.equal(items.filter((item) => item.week === week).length, count, `week ${week} should have ${count} sessions`);
}

for (const phase of PHASES) {
  assert.ok(items.some((item) => item.phaseId === phase.id), `phase ${phase.id} has sessions`);
}

assert.equal(items.filter((item) => item.day === 'sun').length, 25, 'teach-back sessions for weeks 1-25');
assert.ok(items.every((item) => DAY_ORDER.includes(item.day)), 'day keys are valid');

assert.equal(addDays('2026-11-30', 7), '2026-12-07');
assert.equal(daysBetween('2026-11-30', '2026-12-07'), 7);

const entries = items.slice(0, 3).map((item) => ({
  item,
  date: addDays('2026-11-30', (item.week - 1) * 7 + item.dayOffset),
}));
const ics = generateICS(entries, { weekdayTime: '07:30', weekendTime: '10:00', appUrl: 'https://example.com/' });

assert.ok(ics.startsWith('BEGIN:VCALENDAR'), 'calendar header');
assert.ok(ics.trimEnd().endsWith('END:VCALENDAR'), 'calendar footer');
assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 3, 'one event per session');
assert.equal((ics.match(/BEGIN:VALARM/g) || []).length, 3, 'one alarm per session');
assert.ok(ics.includes('UID:w1-mon@ds-tracker'), 'stable event uid');

console.log(`Self-check passed: ${items.length} sessions · ${WEEKS.length} weeks · ${PHASES.length} phases · ICS ok.`);
