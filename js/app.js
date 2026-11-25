import {
  PHASES,
  WEEKS,
  TYPES,
  DAY_ORDER,
  DAILY_MINUTES,
  RITUAL,
  getItems,
} from './plan-data.js';
import { SOCRATIC_SKILL_URL } from './study-guides.js';
import {
  loadSettings,
  saveSettings,
  loadProgress,
  saveProgress,
  loadLastBackup,
  loadSnapshot,
  markBackupExported,
  saveSnapshot,
  sanitizeProgress,
  NOTE_MAX_LENGTH,
} from './store.js';
import {
  addDays,
  daysBetween,
  downloadFile,
  escapeHTML,
  formatFull,
  formatShort,
  formatWeekday,
  localDateStr,
  parseDateStr,
  todayStr,
} from './util.js';
import { generateICS } from './ics.js';

const ALL_ITEMS = getItems();
const ITEM_BY_ID = new Map(ALL_ITEMS.map((item) => [item.id, item]));
const WEEK_ITEMS = new Map(WEEKS.map((week) => [week.week, ALL_ITEMS.filter((item) => item.week === week.week)]));
const TOTAL = ALL_ITEMS.length;
const TABS = ['today', 'plan', 'progress'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const DURATION_TEXT = {
  learn: `~${DAILY_MINUTES} min session`,
  lab: `~${DAILY_MINUTES} min lab`,
  failure: `~${DAILY_MINUTES} min failure read`,
  case: `~${DAILY_MINUTES} min case study`,
  build: `${DAILY_MINUTES} min build`,
  review: `${DAILY_MINUTES} min teach-back`,
  capstone: `~${DAILY_MINUTES} min capstone`,
};

const CHEV_HTML = '<span class="chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

const initialTab = TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today';
const state = {
  settings: loadSettings(),
  progress: loadProgress(),
  tab: initialTab,
};

const ui = {
  openWeeks: new Set(),
  openPhases: new Set(),
  openGuides: new Set(),
  overdueOpen: false,
  planSeen: false,
  importMode: 'merge',
};

const view = document.getElementById('view');
const toastEl = document.getElementById('toast');
const themeBtn = document.getElementById('theme-btn');
const importFileEl = document.getElementById('import-file');
const updateBannerEl = document.getElementById('update-banner');
const updateBtnEl = document.getElementById('update-btn');
const updateDismissEl = document.getElementById('update-dismiss');

let toastTimer = null;
let toastUndo = null;
let deferredInstallPrompt = null;
let swRegistration = null;
let refreshing = false;
let updateAvailable = false;

/* ---------- theme ---------- */

function currentTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyStoredTheme() {
  try {
    const stored = localStorage.getItem('dst.theme.v1');
    if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored;
  } catch { /* storage unavailable */ }
}

function updateThemeLabel() {
  themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

/* ---------- helpers ---------- */

function dateFor(item) {
  return addDays(state.settings.startDate, (item.week - 1) * 7 + item.dayOffset);
}

function lastPlanDate() {
  return dateFor(ALL_ITEMS[ALL_ITEMS.length - 1]);
}

function currentWeekNumber() {
  const diff = daysBetween(state.settings.startDate, todayStr());
  if (diff < 0) return 1;
  return Math.min(26, Math.floor(diff / 7) + 1);
}

function isDone(id) {
  return state.progress[id]?.done === true;
}

function doneCount(items) {
  return items.reduce((count, item) => count + (isDone(item.id) ? 1 : 0), 0);
}

function currentStreak(dateSet) {
  const today = todayStr();
  let cursor = dateSet.has(today) ? today : addDays(today, -1);
  if (!dateSet.has(cursor)) return 0;
  let streak = 0;
  while (dateSet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function longestStreak(dateSet) {
  if (!dateSet.size) return 0;
  const dates = [...dateSet].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const gap = daysBetween(dates[i - 1], dates[i]);
    if (gap === 1) {
      run += 1;
    } else if (gap > 1) {
      run = 1;
    }
    best = Math.max(best, run);
  }
  return best;
}

function getStats() {
  let done = 0;
  const activeDates = new Set();
  for (const item of ALL_ITEMS) {
    const entry = state.progress[item.id];
    if (!entry?.done) continue;
    done += 1;
    if (entry.at) {
      const parsed = new Date(entry.at);
      if (!Number.isNaN(parsed.getTime())) activeDates.add(localDateStr(parsed));
    }
  }
  const weeksDone = WEEKS.filter((week) => {
    const items = WEEK_ITEMS.get(week.week);
    return items.length > 0 && items.every((item) => isDone(item.id));
  }).length;
  return {
    done,
    total: TOTAL,
    pct: TOTAL ? Math.round((done / TOTAL) * 100) : 0,
    streak: currentStreak(activeDates),
    best: longestStreak(activeDates),
    activeDays: activeDates.size,
    weeksDone,
  };
}

/* ---------- HTML fragments ---------- */

function ringHTML(pct) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  return `<div class="ring" role="img" aria-label="${pct}% complete">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle class="ring-track" cx="32" cy="32" r="${radius}"></circle>
      <circle class="ring-value" cx="32" cy="32" r="${radius}" stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>
    </svg>
    <span class="ring-label">${pct}%</span>
  </div>`;
}

function chipHTML(type) {
  const meta = TYPES[type] || TYPES.learn;
  return `<span class="chip chip-${type}">${escapeHTML(meta.label)}</span>`;
}

function taskCard(item, options = {}) {
  const done = isDone(item.id);
  const entry = state.progress[item.id] || {};
  const confidence = entry.confidence || 0;
  const date = dateFor(item);
  const guideKey = `${options.scope || 'main'}:${item.id}`;
  const guideOpen = ui.openGuides.has(guideKey);
  const meta = options.compact
    ? DURATION_TEXT[item.type]
    : `Week ${item.week} · ${escapeHTML(item.weekTitle)} · ${DURATION_TEXT[item.type]}`;
  return `<article class="task ${done ? 'done' : ''}" data-item="${item.id}">
    <button class="check" type="button" role="checkbox" aria-checked="${done}" aria-label="${done ? 'Mark not done' : 'Mark done'}: ${escapeHTML(item.text)}" data-check="${item.id}">
      <span class="check-disc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.3 4.3L19 7.5"></path></svg></span>
    </button>
    <div class="task-body">
      <div class="task-top">
        ${chipHTML(item.type)}
        ${options.showDate ? `<span class="task-date">${formatShort(date)}</span>` : ''}
      </div>
      <p class="task-text">${escapeHTML(item.text)}</p>
      <p class="task-meta">${meta}</p>
      <details class="task-guide" data-guide="${escapeHTML(guideKey)}" ${guideOpen ? 'open' : ''}>
        <summary>
          <span>Study guide, notes &amp; AI prompt</span>
          ${CHEV_HTML}
        </summary>
        <div class="guide-body">
          <p class="guide-summary">${escapeHTML(item.refSummary)}</p>
          <a class="guide-link" href="${escapeHTML(item.refUrl)}" target="_blank" rel="noopener noreferrer">
            <span>Reference: ${escapeHTML(item.refTitle)}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <div class="guide-prompt-head">
            <span class="eyebrow" style="margin:0">socratic-tutor prompt</span>
            <button class="btn guide-copy" type="button" data-copy-prompt="${item.id}">Copy prompt</button>
          </div>
          <pre class="guide-prompt">${escapeHTML(item.prompt)}</pre>
          <a class="guide-skill-note" href="${SOCRATIC_SKILL_URL}" target="_blank" rel="noopener noreferrer">Requires socratic-tutor skill setup ↗</a>
          <div class="study-log">
            <label class="study-note-field">
              <span class="eyebrow">Note</span>
              <textarea class="study-note" data-note="${item.id}" rows="2" maxlength="${NOTE_MAX_LENGTH}" placeholder="One thing to remember…">${escapeHTML(entry.note || '')}</textarea>
            </label>
            <div class="confidence-row" role="group" aria-label="Confidence for ${escapeHTML(item.text)}">
              <span class="eyebrow">Confidence</span>
              <div class="confidence-btns">
                ${[1, 2, 3, 4, 5].map((value) => `<button type="button" class="conf-btn${confidence === value ? ' active' : ''}" data-confidence="${item.id}" data-value="${value}" aria-pressed="${confidence === value}" aria-label="${value} out of 5">${value}</button>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </article>`;
}

function ritualHTML() {
  return `<div class="ritual">${RITUAL.map((part) => `<span>${escapeHTML(part.label)} ${part.minutes} min</span>`).join('')}</div>`;
}

function socraticSetupCard() {
  return `<section class="card pad-card">
      <h3>Pre-setup: Socratic AI Tutor</h3>
      <p class="sub">Prompts on each session invoke the <code>socratic-tutor</code> skill (for Gemini, DeepSeek, GLM, or coding agents). Download it into your skills directory before starting.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="${SOCRATIC_SKILL_URL}" target="_blank" rel="noopener noreferrer">Download socratic-tutor skill ↗</a>
      </div>
      <p class="settings-note">Place the <code>socratic-tutor</code> folder in your agent skills directory (e.g. <code>~/.gemini/config/skills/</code> or <code>.agents/skills/</code>). In Command Code, type <code>/socratic-tutor</code> and paste a session prompt after it.</p>
    </section>`;
}

function weakTopics() {
  return ALL_ITEMS
    .map((item) => ({ item, entry: state.progress[item.id] || {} }))
    .filter(({ entry }) => entry.confidence >= 1 && entry.confidence <= 2)
    .sort((a, b) => a.entry.confidence - b.entry.confidence
      || a.item.week - b.item.week
      || a.item.dayOffset - b.item.dayOffset);
}

function weakTopicsHTML(showEmpty = false) {
  const weak = weakTopics();
  if (!weak.length && !showEmpty) return '';

  const list = weak.length
    ? `<ul class="weak-list">${weak.map(({ item, entry }) => `<li>
        <span class="weak-week">W${item.week}</span>
        <span class="weak-body">
          <span>${escapeHTML(item.text)}</span>
          ${entry.note ? `<span class="weak-note">${escapeHTML(entry.note)}</span>` : ''}
        </span>
        <span class="weak-score">${entry.confidence}/5</span>
      </li>`).join('')}</ul>`
    : '<p class="weak-empty">No weak topics logged yet. Rate a session 1 or 2 and it will show up here for the Sunday teach-back.</p>';

  return `<section class="card pad-card weak-card">
      <h3>Weak topics · Sunday teach-back</h3>
      <p class="sub">Low-confidence sessions to revisit before you teach the week back.</p>
      ${list}
    </section>`;
}

function backupBadgeHTML() {
  const at = loadLastBackup();
  if (!at) return '<span class="status-badge is-warn">No backup yet</span>';
  const day = localDateStr(new Date(at));
  const days = Math.max(0, daysBetween(day, todayStr()));
  const label = days === 0
    ? 'Backed up today'
    : `Last backup ${days} day${days === 1 ? '' : 's'} ago`;
  return `<span class="status-badge${days >= 7 ? ' is-warn' : ''}">${escapeHTML(label)}</span>`;
}

/* ---------- Today ---------- */

function renderToday() {
  const stats = getStats();
  const today = todayStr();
  const startDate = state.settings.startDate;
  const started = today >= startDate;
  const ended = today > lastPlanDate();
  const dated = ALL_ITEMS.map((item) => ({ item, date: dateFor(item) }));
  const todays = dated.filter((entry) => entry.date === today);
  const overdue = dated
    .filter((entry) => entry.date < today && !isDone(entry.item.id))
    .sort((a, b) => a.date.localeCompare(b.date) || a.item.dayOffset - b.item.dayOffset);
  const next = dated.find((entry) => entry.date > today && !isDone(entry.item.id));
  const isSunday = parseDateStr(today).getDay() === 0;
  const weekNumber = currentWeekNumber();
  const week = WEEKS[weekNumber - 1];
  const phase = PHASES.find((p) => p.weeks.includes(weekNumber));

  if (!started) {
    const daysUntil = daysBetween(today, startDate);
    return `<section class="hero">
        <div>
          <p class="eyebrow">${formatFull(today)}</p>
          <h2>Plan starts ${formatFull(startDate)}</h2>
          <p class="muted">${daysUntil === 0 ? 'Today' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`} · Week 1 is ${escapeHTML(WEEKS[0].title)}</p>
          <div class="hero-meta">
            <span class="pill">${stats.done}/${TOTAL} done</span>
            <span class="pill">${stats.streak}-day streak</span>
          </div>
        </div>
        ${ringHTML(stats.pct)}
      </section>
      <div class="card pad-card">
        <h3>Ready to begin?</h3>
        <p class="sub">First session: ${escapeHTML(WEEKS[0].days.mon)}</p>
        <div class="btn-row">
          <button class="btn btn-primary" type="button" data-action="start-today">Start today instead</button>
          <a class="btn btn-ghost" href="#plan">Preview the plan</a>
        </div>
      </div>
      <div class="card pad-card">
        <h3>Prep while you wait</h3>
        <p class="sub">Set up a lab repo, protect ${DAILY_MINUTES} minutes a day, and skim Week 1. Each plan week maps Monday to Sunday.</p>
        ${ritualHTML()}
      </div>
      ${socraticSetupCard()}`;
  }

  let html = `<section class="hero">
      <div>
        <p class="eyebrow">${formatFull(today)}</p>
        <h2>${ended ? 'Plan window complete' : `Week ${weekNumber} · ${escapeHTML(week.title)}`}</h2>
        <p class="muted">${ended ? 'All scheduled dates have passed' : escapeHTML(phase.name)} · ${stats.done}/${TOTAL} done</p>
        <div class="hero-meta">
          <span class="pill">${stats.streak}-day streak</span>
          <span class="pill">${stats.weeksDone}/26 weeks done</span>
        </div>
      </div>
      ${ringHTML(stats.pct)}
    </section>`;

  html += `<div class="section-label"><h3>Today’s plan</h3><span class="count">${doneCount(todays.map((entry) => entry.item))}/${todays.length}</span></div>`;

  if (!todays.length) {
    html += `<div class="card rest-card"><strong>${ended ? 'You made it to the end.' : 'Rest or catch up'}</strong>${ended
      ? 'Consolidate your notes, finish any loose ends, and write down what changed in how you think.'
      : 'Nothing is scheduled today. Use it to review notes or finish an overdue lab.'}</div>`;
  } else {
    html += todays.map((entry) => taskCard(entry.item, { scope: 'today' })).join('');
  }

  if (next) {
    html += `<div class="card next-card">
        <div>
          <span class="eyebrow">Next up</span>
          <strong>${formatWeekday(next.date)} · ${escapeHTML(next.item.text)}</strong>
        </div>
        <span class="muted">W${next.item.week}</span>
      </div>`;
  }

  if (overdue.length) {
    html += `<details class="overdue" data-overdue ${ui.overdueOpen ? 'open' : ''}>
        <summary>
          <span>Overdue</span>
          <span class="badge">${overdue.length}</span>
          ${CHEV_HTML}
        </summary>
        <div class="overdue-body">${overdue.map((entry) => taskCard(entry.item, { showDate: true, scope: 'overdue' })).join('')}</div>
      </details>`;
  }

  html += `<div class="card pad-card">
      <h3>Daily ritual</h3>
      <p class="sub">Anchor the session — the checkmark is the smallest unit of progress.</p>
      ${ritualHTML()}
    </div>`;

  if (isSunday) html += weakTopicsHTML(true);

  html += `<section class="card pad-card">
      <div class="card-head">
        <h3>Backup &amp; update progress</h3>
        ${backupBadgeHTML()}
      </div>
      <p class="sub">Export a JSON backup anytime or import one to merge new progress. Notes and confidence ratings are included.</p>
      <div class="btn-row">
        <button class="btn" type="button" data-action="export-json">Export backup</button>
        <button class="btn" type="button" data-action="import-merge">Import &amp; update</button>
      </div>
    </section>`;

  return html;
}

/* ---------- Plan ---------- */

function renderPlan() {
  const stats = getStats();
  const weekNumber = currentWeekNumber();

  let html = `<section class="page-head">
      <p class="eyebrow">All 26 weeks · 6 phases</p>
      <h2>Plan</h2>
      <div class="bar" style="margin-top:12px"><span style="width:${stats.pct}%"></span></div>
      <p class="muted" style="font-size:12.5px;margin:8px 0 0">${stats.done} of ${TOTAL} items complete · ${stats.weeksDone}/26 weeks finished</p>
    </section>
    <p class="hint">Tap a phase or week to expand. Dates are a guide, not a cage — you can check anything early or late.</p>`;

  html += PHASES.map((phase) => {
    const phaseItems = ALL_ITEMS.filter((item) => item.phaseId === phase.id);
    const done = doneCount(phaseItems);
    const pct = phaseItems.length ? Math.round((done / phaseItems.length) * 100) : 0;
    const open = ui.openPhases.has(phase.id) || (!ui.planSeen && phase.weeks.includes(weekNumber));
    const weeksHTML = WEEKS.filter((week) => phase.weeks.includes(week.week)).map((week) => {
      const list = WEEK_ITEMS.get(week.week);
      const weekDone = doneCount(list);
      const isCurrent = week.week === weekNumber;
      const weekOpen = ui.openWeeks.has(String(week.week)) || (!ui.planSeen && isCurrent);
      return `<details class="week" data-week="${week.week}" ${weekOpen ? 'open' : ''}>
          <summary>
            <div class="week-info">
              <p class="week-kicker">Week ${week.week}${isCurrent ? ' <span class="now">· Now</span>' : ''}</p>
              <h4>${escapeHTML(week.title)}</h4>
            </div>
            <span class="week-count">${weekDone}/${list.length}</span>
            ${CHEV_HTML}
          </summary>
          <div class="week-items">
            ${list.map((item) => taskCard(item, { showDate: true, compact: true, scope: 'plan' })).join('')}
          </div>
        </details>`;
    }).join('');

    return `<details class="phase" data-phase="${phase.id}" ${open ? 'open' : ''}>
        <summary>
          <div class="phase-title">
            <h3>${escapeHTML(phase.name)}</h3>
            <p>${escapeHTML(phase.goal)}</p>
          </div>
          <div class="phase-right">
            <span class="count">${done}/${phaseItems.length}</span>
            <div class="bar small"><span style="width:${pct}%"></span></div>
          </div>
          ${CHEV_HTML}
        </summary>
        <div class="phase-weeks">${weeksHTML}</div>
      </details>`;
  }).join('');

  ui.planSeen = true;
  return html;
}

/* ---------- Progress ---------- */

function renderProgress() {
  const stats = getStats();
  const today = todayStr();

  const heat = WEEKS.map((week) => {
    const byDay = new Map(WEEK_ITEMS.get(week.week).map((item) => [item.day, item]));
    const cells = DAY_ORDER.map((day) => {
      const item = byDay.get(day);
      if (!item) return '<span class="heat-cell is-empty"></span>';
      const date = dateFor(item);
      const done = isDone(item.id);
      let cls = 'heat-cell';
      if (done) cls += ' is-done';
      else if (date < today) cls += ' is-missed';
      if (date === today) cls += ' is-today';
      const label = `${formatShort(date)} · ${item.text}${done ? ' · done' : ''}`;
      return `<span class="${cls}" role="img" aria-label="${escapeHTML(label)}" title="${escapeHTML(label)}"></span>`;
    }).join('');
    return `<div class="heat-col">${cells}</div>`;
  }).join('');

  const phaseRows = PHASES.map((phase) => {
    const list = ALL_ITEMS.filter((item) => item.phaseId === phase.id);
    const done = doneCount(list);
    const pct = list.length ? Math.round((done / list.length) * 100) : 0;
    return `<div class="phase-row">
      <span class="name">${escapeHTML(phase.name)}</span>
      <div class="bar small" style="width:100%"><span style="width:${pct}%"></span></div>
      <span class="n">${done}/${list.length}</span>
    </div>`;
  }).join('');

  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  let html = `<section class="page-head">
      <p class="eyebrow">Momentum</p>
      <h2>Progress</h2>
    </section>
    <section class="hero">
      <div>
        <p class="eyebrow">Overall</p>
        <h2>${stats.done} of ${TOTAL} items</h2>
        <p class="muted">${stats.weeksDone} of 26 weeks fully complete</p>
        <div class="hero-meta">
          <span class="pill">${stats.streak}-day streak</span>
          <span class="pill">${stats.activeDays} active day${stats.activeDays === 1 ? '' : 's'}</span>
        </div>
      </div>
      ${ringHTML(stats.pct)}
    </section>
    <div class="stat-grid">
      <div class="stat"><b>${stats.streak}</b><span>Current streak</span></div>
      <div class="stat"><b>${stats.best}</b><span>Best streak</span></div>
      <div class="stat"><b>${stats.activeDays}</b><span>Active days</span></div>
    </div>
    <div class="card heat-card">
      <h3>26-week heatmap</h3>
      <p class="sub" style="margin-bottom:0">Each column is a week; each cell is a day.</p>
      <div class="heatmap">${heat}</div>
      <div class="legend">
        <span><i class="l-done"></i>Done</span>
        <span><i></i>Pending</span>
        <span><i class="l-missed"></i>Past</span>
        <span><i style="outline:1.5px solid var(--accent); outline-offset:1px"></i>Today</span>
      </div>
    </div>
    <div class="card pad-card">
      <h3>By phase</h3>
      <p class="sub">Where you are across the six phases.</p>
      ${phaseRows}
    </div>
    ${weakTopicsHTML()}
    <section class="card pad-card" id="settings">
      <h3>Schedule</h3>
      <p class="sub">Week 1 · Day 1 starts here. Moving it shifts every session; completed items stay checked.</p>
      <label class="field"><span>Start date</span><input type="date" id="start-date" value="${state.settings.startDate}"></label>
      <p class="field-note">First day: ${formatFull(state.settings.startDate)}</p>
      <div class="grid-2">
        <label class="field"><span>Weekday time</span><input type="time" id="weekday-time" value="${state.settings.weekdayTime}"></label>
        <label class="field"><span>Weekend time</span><input type="time" id="weekend-time" value="${state.settings.weekendTime}"></label>
      </div>
      <p class="field-note">Used for calendar export alerts.</p>
    </section>
    <section class="card pad-card">
      <h3>Reminders</h3>
      <p class="sub">Best option: export your schedule to your phone’s calendar with a 10-minute alert on every session.</p>
      <div class="btn-row">
        <button class="btn btn-primary" type="button" data-action="ics-remaining">Export remaining</button>
        <button class="btn" type="button" data-action="ics-all">Export full plan</button>
      </div>
      <p class="settings-note">A static app can’t schedule OS notifications while closed. Calendar alerts work everywhere. For a daily push, the repo includes an optional ntfy + GitHub Actions setup (see README).</p>
    </section>
    <section class="card pad-card">
      <div class="card-head">
        <h3>Backup &amp; update progress</h3>
        ${backupBadgeHTML()}
      </div>
      <p class="sub">Progress lives in this browser only. Export a JSON backup anytime (notes and confidence included), or import one to update (merge) or replace progress.</p>
      <div class="btn-row">
        <button class="btn btn-primary" type="button" data-action="export-json">Export backup</button>
        <button class="btn" type="button" data-action="import-merge">Import &amp; update</button>
        <button class="btn btn-ghost" type="button" data-action="import-replace">Replace from backup</button>
      </div>
    </section>
    ${socraticSetupCard()}`;

  if (!standalone) {
    html += `<section class="card pad-card">
        <h3>Keep it handy</h3>
        <p class="sub">Add DS Tracker to your home screen for a full-screen, offline app.</p>
        <p class="settings-note">iPhone: open in Safari → Share → Add to Home Screen. Android: browser menu → Install app.</p>
        ${deferredInstallPrompt ? '<div class="btn-row"><button class="btn btn-primary" type="button" data-action="install-app">Install app</button></div>' : ''}
      </section>`;
  }

  html += `<section class="card pad-card">
      <h3>Reset</h3>
      <p class="sub">Clears every checkmark. Your settings are kept.</p>
      <button class="btn btn-danger btn-block" type="button" data-action="reset-progress">Reset progress</button>
    </section>
    <p class="footer-note">Progress saves automatically on this device. ${TOTAL} sessions · ${PHASES.length} phases · ${WEEKS.length} weeks.</p>`;

  return html;
}

/* ---------- Render ---------- */

function captureOpenStates() {
  const weekEls = document.querySelectorAll('details[data-week]');
  if (weekEls.length) {
    ui.openWeeks = new Set([...weekEls].filter((el) => el.open).map((el) => el.dataset.week));
  }
  const phaseEls = document.querySelectorAll('details[data-phase]');
  if (phaseEls.length) {
    ui.openPhases = new Set([...phaseEls].filter((el) => el.open).map((el) => el.dataset.phase));
  }
  const overdueEl = document.querySelector('details[data-overdue]');
  if (overdueEl) ui.overdueOpen = overdueEl.open;
  const guideEls = document.querySelectorAll('details[data-guide]');
  if (guideEls.length) {
    for (const el of guideEls) {
      if (el.open) ui.openGuides.add(el.dataset.guide);
      else ui.openGuides.delete(el.dataset.guide);
    }
  }
}

function render(options = {}) {
  captureOpenStates();
  const scrollY = window.scrollY;

  let html = '';
  if (state.tab === 'plan') html = renderPlan();
  else if (state.tab === 'progress') html = renderProgress();
  else html = renderToday();

  view.innerHTML = html;

  document.querySelectorAll('.tab').forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.classList.toggle('active', active);
    if (active) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });

  if (state.tab === 'plan') ui.planSeen = true;
  if (options.preserveScroll) window.scrollTo(0, scrollY);
  else if (options.scrollTop) window.scrollTo(0, 0);
}

/* ---------- Toast ---------- */

function showToast(message, undo = null) {
  toastUndo = typeof undo === 'function'
    ? undo
    : (typeof undo === 'string' ? () => toggleItem(undo, { silent: true }) : null);
  toastEl.innerHTML = `<span>${escapeHTML(message)}</span>${toastUndo ? '<button type="button" data-undo>Undo</button>' : ''}`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 7000);
}

function hideToast() {
  toastEl.classList.remove('show');
  clearTimeout(toastTimer);
  toastUndo = null;
}

toastEl.addEventListener('click', (event) => {
  if (!event.target.closest('[data-undo]')) return;
  const action = toastUndo;
  hideToast();
  if (action) action();
});

/* ---------- Actions ---------- */

function toggleItem(id, options = {}) {
  const item = ITEM_BY_ID.get(id);
  if (!item) return;
  const shouldRestoreFocus = document.activeElement?.dataset?.check === id;
  const wasDone = isDone(id);
  if (wasDone) {
    const entry = { ...(state.progress[id] || {}) };
    delete entry.done;
    delete entry.at;
    if (entry.note || entry.confidence) state.progress[id] = entry;
    else delete state.progress[id];
  } else {
    state.progress[id] = { ...(state.progress[id] || {}), done: true, at: new Date().toISOString() };
  }
  saveProgress(state.progress);
  render({ preserveScroll: true });
  if (shouldRestoreFocus) {
    document.querySelector(`[data-check="${id}"]`)?.focus({ preventScroll: true });
  }

  if (options.silent) return;
  if (wasDone) {
    showToast('Unmarked');
    return;
  }
  if (navigator.vibrate) navigator.vibrate(8);
  const label = item.text.length > 44 ? `${item.text.slice(0, 44)}…` : item.text;
  showToast(`Done — ${label}`, id);
}

function setConfidence(id, value) {
  if (!ITEM_BY_ID.has(id) || !(value >= 1 && value <= 5)) return;
  const entry = { ...(state.progress[id] || {}) };
  const cleared = entry.confidence === value;
  if (cleared) delete entry.confidence;
  else entry.confidence = value;
  if (entry.done || entry.note || entry.confidence) state.progress[id] = entry;
  else delete state.progress[id];
  saveProgress(state.progress);
  render({ preserveScroll: true });
  document.querySelector(`[data-confidence="${id}"][data-value="${value}"]`)?.focus({ preventScroll: true });
  showToast(cleared ? 'Confidence cleared' : `Confidence ${value}/5 saved`);
}

function exportICS(mode) {
  const today = todayStr();
  let entries = ALL_ITEMS.map((item) => ({ item, date: dateFor(item) }));
  if (mode === 'remaining') {
    entries = entries.filter((entry) => !isDone(entry.item.id) && entry.date >= today);
  }
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.item.dayOffset - b.item.dayOffset);
  if (!entries.length) {
    showToast('Nothing left to export');
    return;
  }
  const appUrl = `${location.origin}${location.pathname.replace(/index\.html$/, '')}`;
  const ics = generateICS(entries, {
    weekdayTime: state.settings.weekdayTime,
    weekendTime: state.settings.weekendTime,
    appUrl,
  });
  downloadFile(`ds-tracker-${mode}-${today}.ics`, 'text/calendar;charset=utf-8', ics);
  showToast(`${entries.length} sessions exported to calendar`);
}

function exportBackup() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    progress: state.progress,
  };
  downloadFile(`ds-tracker-backup-${todayStr()}.json`, 'application/json', JSON.stringify(payload, null, 2));
  markBackupExported();
  render({ preserveScroll: true });
  showToast('Backup downloaded');
}

function restoreSnapshot() {
  const snapshot = loadSnapshot();
  if (!snapshot) {
    showToast('No snapshot available');
    return;
  }
  state.progress = snapshot.progress;
  state.settings = snapshot.settings;
  saveProgress(state.progress);
  saveSettings(state.settings);
  render({ preserveScroll: true });
  showToast('Previous progress restored');
}

function mergeProgressEntry(local = {}, incoming = {}) {
  const merged = { ...local };
  if (incoming.done && !merged.done) {
    merged.done = true;
    merged.at = incoming.at || new Date().toISOString();
  }
  if (!merged.note && incoming.note) merged.note = incoming.note;
  if (!merged.confidence && incoming.confidence) merged.confidence = incoming.confidence;
  return merged;
}

async function importBackup(file, mode = 'merge') {
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Invalid backup');
    }
    if (data.version !== 1) throw new Error('Unsupported backup version');
    if (!data.progress || typeof data.progress !== 'object' || Array.isArray(data.progress)) {
      throw new Error('Invalid backup');
    }

    const clean = {};
    for (const [id, entry] of Object.entries(sanitizeProgress(data.progress))) {
      if (ITEM_BY_ID.has(id)) clean[id] = entry;
    }

    if (!Object.keys(clean).length) {
      showToast('That backup has no progress to import');
      return;
    }
    const doneCount = Object.values(clean).filter((entry) => entry.done).length;

    if (mode === 'replace') {
      if (!confirm(`Import ${doneCount} completed item${doneCount === 1 ? '' : 's'}? This replaces current progress. A snapshot is saved so you can undo.`)) {
        return;
      }
      saveSnapshot({ progress: state.progress, settings: state.settings, reason: 'replace-import' });
      state.progress = clean;
    } else {
      const added = Object.keys(clean).filter((id) => clean[id].done && !isDone(id)).length;
      if (!confirm(`Merge backup (${doneCount} completed, ${added} new)? Existing checkmarks are kept.`)) {
        return;
      }
      const merged = { ...state.progress };
      for (const [id, entry] of Object.entries(clean)) {
        merged[id] = mergeProgressEntry(merged[id], entry);
      }
      state.progress = merged;
    }
    saveProgress(state.progress);

    const settings = data.settings;
    if (settings && typeof settings === 'object') {
      const next = { ...state.settings };
      if (DATE_RE.test(settings.startDate || '')) next.startDate = settings.startDate;
      if (TIME_RE.test(settings.weekdayTime || '')) next.weekdayTime = settings.weekdayTime;
      if (TIME_RE.test(settings.weekendTime || '')) next.weekendTime = settings.weekendTime;
      state.settings = next;
      saveSettings(state.settings);
    }

    render({ preserveScroll: true });
    if (mode === 'replace') {
      showToast('Backup restored', restoreSnapshot);
    } else {
      showToast('Progress updated from backup');
    }
  } catch (error) {
    showToast(error?.message === 'Unsupported backup version'
      ? 'Unsupported backup version'
      : 'Could not import that backup');
  }
}

function handleAction(action) {
  switch (action) {
    case 'start-today':
      state.settings.startDate = todayStr();
      saveSettings(state.settings);
      ui.planSeen = false;
      showToast('Starting today');
      render({ scrollTop: true });
      break;
    case 'ics-remaining':
      exportICS('remaining');
      break;
    case 'ics-all':
      exportICS('all');
      break;
    case 'export-json':
      exportBackup();
      break;
    case 'import-merge':
      ui.importMode = 'merge';
      importFileEl?.click();
      break;
    case 'import-replace':
      ui.importMode = 'replace';
      importFileEl?.click();
      break;
    case 'install-app':
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt = null;
      }
      break;
    case 'reset-progress':
      if (confirm('Reset all progress? A snapshot is saved so you can undo.')) {
        saveSnapshot({ progress: state.progress, settings: state.settings, reason: 'reset' });
        state.progress = {};
        saveProgress(state.progress);
        render({ preserveScroll: true });
        showToast('Progress reset', restoreSnapshot);
      }
      break;
    default:
      break;
  }
}

async function copyPrompt(id) {
  const item = ITEM_BY_ID.get(id);
  if (!item?.prompt) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(item.prompt);
    } else {
      throw new Error('Clipboard API unavailable');
    }
    showToast('Socratic prompt copied');
  } catch {
    const area = document.createElement('textarea');
    area.value = item.prompt;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    showToast(ok ? 'Socratic prompt copied' : 'Select and copy the prompt manually');
  }
}

/* ---------- Events ---------- */

view.addEventListener('click', (event) => {
  const check = event.target.closest('[data-check]');
  if (check) {
    toggleItem(check.dataset.check);
    return;
  }
  const confBtn = event.target.closest('[data-confidence]');
  if (confBtn) {
    setConfidence(confBtn.dataset.confidence, Number(confBtn.dataset.value));
    return;
  }
  const copyBtn = event.target.closest('[data-copy-prompt]');
  if (copyBtn) {
    copyPrompt(copyBtn.dataset.copyPrompt);
    return;
  }
  const action = event.target.closest('[data-action]');
  if (action) handleAction(action.dataset.action);
});

view.addEventListener('input', (event) => {
  const target = event.target;
  if (!target.matches?.('[data-note]')) return;
  const id = target.dataset.note;
  if (!ITEM_BY_ID.has(id)) return;
  const note = target.value.slice(0, NOTE_MAX_LENGTH);
  const entry = { ...(state.progress[id] || {}) };
  if (note.trim()) entry.note = note;
  else delete entry.note;
  if (entry.done || entry.note || entry.confidence) state.progress[id] = entry;
  else delete state.progress[id];
  saveProgress(state.progress);
});

view.addEventListener('change', (event) => {
  const target = event.target;
  if (target.id === 'start-date' && DATE_RE.test(target.value)) {
    state.settings.startDate = target.value;
    saveSettings(state.settings);
    const isMonday = parseDateStr(target.value).getDay() === 1;
    render({ preserveScroll: true });
    showToast(isMonday ? 'Schedule moved' : 'Schedule moved · Monday starts work best');
  } else if (target.id === 'weekday-time' && TIME_RE.test(target.value)) {
    state.settings.weekdayTime = target.value;
    saveSettings(state.settings);
    showToast('Weekday time saved');
  } else if (target.id === 'weekend-time' && TIME_RE.test(target.value)) {
    state.settings.weekendTime = target.value;
    saveSettings(state.settings);
    showToast('Weekend time saved');
  }
});

importFileEl?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (file) importBackup(file, ui.importMode);
  event.target.value = '';
});

window.addEventListener('hashchange', () => {
  const tab = location.hash.slice(1) || 'today';
  if (!TABS.includes(tab)) return;
  state.tab = tab;
  render({ scrollTop: true });
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (state.tab === 'progress') render({ preserveScroll: true });
});

themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('dst.theme.v1', next); } catch { /* ignore */ }
  updateThemeLabel();
});

matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', updateThemeLabel);

function showUpdateBanner() {
  updateAvailable = true;
  if (updateBannerEl) updateBannerEl.hidden = false;
}

updateBtnEl?.addEventListener('click', () => {
  const waiting = swRegistration?.waiting;
  if (waiting) {
    waiting.postMessage({ type: 'SKIP_WAITING' });
    return;
  }
  window.location.reload();
});
updateDismissEl?.addEventListener('click', () => {
  if (updateBannerEl) updateBannerEl.hidden = true;
});

/* ---------- Boot ---------- */

applyStoredTheme();
updateThemeLabel();
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateAvailable || refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        swRegistration = registration;
        if (registration.waiting && navigator.serviceWorker.controller) showUpdateBanner();
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner();
            }
          });
        });
      })
      .catch(() => { /* offline support is optional */ });
  });
}
