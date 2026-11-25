import assert from 'node:assert/strict';
import { PHASES, WEEKS, DAY_ORDER, DAILY_MINUTES, RITUAL, getItems } from '../js/plan-data.js';
import { SESSION_REFS } from '../js/study-guides.js';
import { addDays, daysBetween } from '../js/util.js';
import { generateICS } from '../js/ics.js';

const items = getItems();

assert.equal(items.length, 180, 'expected 180 sessions');
assert.equal(new Set(items.map((item) => item.id)).size, items.length, 'session ids must be unique');
assert.equal(WEEKS.length, 26, 'expected 26 weeks');
assert.equal(PHASES.length, 6, 'expected 6 phases');

const expected = new Map();
for (let week = 1; week <= 25; week += 1) expected.set(week, 7);
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

assert.equal(DAILY_MINUTES, 60, 'daily budget should be 60 minutes');
assert.equal(RITUAL.reduce((sum, part) => sum + part.minutes, 0), DAILY_MINUTES, 'ritual should fit the daily budget');

const entries = items.slice(0, 3).map((item) => ({
  item,
  date: addDays('2026-11-30', (item.week - 1) * 7 + item.dayOffset),
}));
const ics = generateICS(entries, { weekdayTime: '07:30', weekendTime: '10:00', appUrl: 'https://example.com/' });

assert.ok(ics.startsWith('BEGIN:VCALENDAR'), 'calendar header');
assert.ok(ics.trimEnd().endsWith('END:VCALENDAR'), 'calendar footer');
assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 3, 'one event per session');
assert.equal((ics.match(/BEGIN:VALARM/g) || []).length, 3, 'one alarm per session');
assert.ok(ics.includes(`DURATION:PT${DAILY_MINUTES}M`), 'calendar duration matches daily budget');
assert.ok(ics.includes('UID:w1-mon@ds-tracker'), 'stable event uid');

const fullIcs = generateICS(
  items.map((item) => ({ item, date: addDays('2026-11-30', (item.week - 1) * 7 + item.dayOffset) })),
  { weekdayTime: '07:30', weekendTime: '10:00', appUrl: 'https://example.com/' },
);
const maxLineBytes = Math.max(...fullIcs.split('\r\n').map((line) => Buffer.byteLength(line, 'utf8')));
assert.ok(maxLineBytes <= 75, `ICS folded lines must be <= 75 UTF-8 bytes (got ${maxLineBytes})`);

assert.ok(items.some((item) => item.week === 24 && item.type === 'case'), 'Case Study prefix maps to case type');

const fullPlanText = items.map((item) => item.text).join('\n');
for (const topic of [
  'OSI model',
  'GraphQL',
  'Object storage',
  'Normalization',
  'Event Sourcing',
  'CQRS',
  'WebSockets',
  'Geohashing',
  'Quadtrees',
  'OIDC',
  'URL Shortener',
  'WhatsApp',
  'Twitter',
  'Netflix',
  'Uber',
]) {
  assert.ok(fullPlanText.includes(topic), `plan should include ${topic}`);
}

const itemIds = new Set(items.map((item) => item.id));
for (const refId of Object.keys(SESSION_REFS)) {
  assert.ok(itemIds.has(refId), `SESSION_REFS key ${refId} must match a plan item`);
}

for (const item of items) {
  assert.ok(item.refTitle && item.refTitle.length > 3, `${item.id} missing refTitle`);
  assert.ok(/^https:\/\//.test(item.refUrl), `${item.id} invalid refUrl: ${item.refUrl}`);
  assert.ok(item.refSummary && item.refSummary.length > 20, `${item.id} missing refSummary`);
  assert.ok(item.prompt && item.prompt.includes('socratic-tutor'), `${item.id} missing socratic-tutor prompt`);
}

console.log(`Self-check passed: ${items.length} sessions · ${WEEKS.length} weeks · ${PHASES.length} phases · study guides & ICS ok.`);
