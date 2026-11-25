import {
  PHASES,
  WEEKS,
  TYPES,
  DAY_ORDER,
  getItems,
} from './plan-data.js';
import { loadSettings, saveSettings, loadProgress, saveProgress } from './store.js';
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
  learn: '~90 min session',
  lab: '~90 min lab',
  failure: '~90 min failure read',
  case: '~90 min case study',
  build: '2–3 hr build',
  review: '45 min teach-back',
  capstone: '~90 min capstone',
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
  overdueOpen: false,
  planSeen: false,
};

const view = document.getElementById('view');
const toastEl = document.getElementById('toast');
const themeBtn = document.getElementById('theme-btn');

let toastTimer = null;
let deferredInstallPrompt = null;

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
  const date = dateFor(item);
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
    </div>
  </article>`;
}

function ritualHTML() {
  return `<div class="ritual"><span>Learn 30 min</span><span>Build 30 min</span><span>Quiz 20 min</span><span>Note 10 min</span></div>`;
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
        <p class="sub">Set up a lab repo, protect 90 minutes a day, and skim Week 1. Each plan week maps Monday to Sunday.</p>
        ${ritualHTML()}
      </div>`;
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
    html += todays.map((entry) => taskCard(entry.item)).join('');
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
        <div class="overdue-body">${overdue.map((entry) => taskCard(entry.item, { showDate: true })).join('')}</div>
      </details>`;
  }

  html += `<div class="card pad-card">
      <h3>Daily ritual</h3>
      <p class="sub">Anchor the session — the checkmark is the smallest unit of progress.</p>
      ${ritualHTML()}
    </div>`;

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
            ${list.map((item) => taskCard(item, { showDate: true, compact: true })).join('')}
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
      return `<span class="${cls}" title="${escapeHTML(`${formatShort(date)} · ${item.text}${done ? ' · done' : ''}`)}"></span>`;
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
      <h3>Backup</h3>
      <p class="sub">Progress lives in this browser only. Export a backup before clearing data or switching phones.</p>
      <div class="btn-row">
        <button class="btn" type="button" data-action="export-json">Export progress</button>
        <button class="btn" type="button" data-action="import-trigger">Import backup</button>
        <input type="file" id="import-file" accept=".json,application/json" hidden>
      </div>
    </section>`;

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

function showToast(message, undoId = null) {
  toastEl.innerHTML = `<span>${escapeHTML(message)}</span>${undoId ? `<button type="button" data-undo="${undoId}">Undo</button>` : ''}`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 5000);
}

function hideToast() {
  toastEl.classList.remove('show');
  clearTimeout(toastTimer);
}

toastEl.addEventListener('click', (event) => {
  const undo = event.target.closest('[data-undo]');
  if (!undo) return;
  const id = undo.dataset.undo;
  hideToast();
  toggleItem(id, { silent: true });
  showToast('Undone');
});

/* ---------- Actions ---------- */

function toggleItem(id, options = {}) {
  const item = ITEM_BY_ID.get(id);
  if (!item) return;
  const shouldRestoreFocus = document.activeElement?.dataset?.check === id;
  const wasDone = isDone(id);
  if (wasDone) delete state.progress[id];
  else state.progress[id] = { done: true, at: new Date().toISOString() };
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
  showToast('Backup downloaded');
}

async function importBackup(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data.progress !== 'object' || Array.isArray(data.progress)) {
      throw new Error('Invalid backup');
    }
    const clean = {};
    for (const [id, entry] of Object.entries(data.progress)) {
      if (!ITEM_BY_ID.has(id) || entry?.done !== true) continue;
      const at = typeof entry.at === 'string' && !Number.isNaN(Date.parse(entry.at))
        ? entry.at
        : new Date().toISOString();
      clean[id] = { done: true, at };
    }
    const count = Object.keys(clean).length;
    if (!confirm(`Import ${count} completed item${count === 1 ? '' : 's'}? This replaces current progress.`)) {
      return;
    }
    state.progress = clean;
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

    render();
    showToast('Backup imported');
  } catch {
    showToast('Could not import that backup');
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
    case 'import-trigger': {
      const input = document.getElementById('import-file');
      if (input) input.click();
      break;
    }
    case 'install-app':
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt = null;
      }
      break;
    case 'reset-progress':
      if (confirm('Reset all progress? This cannot be undone.')) {
        state.progress = {};
        saveProgress(state.progress);
        render({ preserveScroll: true });
        showToast('Progress reset');
      }
      break;
    default:
      break;
  }
}

/* ---------- Events ---------- */

view.addEventListener('click', (event) => {
  const check = event.target.closest('[data-check]');
  if (check) {
    toggleItem(check.dataset.check);
    return;
  }
  const action = event.target.closest('[data-action]');
  if (action) handleAction(action.dataset.action);
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
  } else if (target.id === 'import-file' && target.files?.[0]) {
    importBackup(target.files[0]);
    target.value = '';
  }
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

/* ---------- Boot ---------- */

applyStoredTheme();
updateThemeLabel();
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is optional */ });
  });
}
