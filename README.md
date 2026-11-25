# DS Tracker

A mobile-first tracker for a 26-week distributed systems study plan (180 sessions across 6 phases). No accounts, no backend, no build step — your progress stays in your browser and the app works offline.

## What's inside

- **Today** — the day's sessions, overdue catch-up list, current streak, overall progress ring.
- **Plan** — all 26 weeks grouped by phase; check off any session early or late.
- **Progress** — completion %, current/best streak, 26×7 heatmap, per-phase breakdown.
- **Schedule** — configurable start date (defaults to next Monday) plus weekday/weekend reminder times. Moving the start date never loses checkmarks.
- **Reminders** — export a calendar file with native alerts, or enable the optional ntfy push workflow.
- **Backup** — export/import progress as JSON.

The plan covers: networking (IP/OSI/DNS/TCP/UDP, REST/GraphQL/gRPC, WebSockets/SSE, proxies, load balancing), time and ordering, CAP/PACELC/availability/scalability, consensus (Paxos/Raft), storage (block/file/object, B-Tree/LSM), replication, partitioning/sharding/federation, SQL/NoSQL/normalization/transactions, queues/pub-sub/Kafka/EDA/event sourcing/CQRS, scheduling, coordination, failure patterns, idempotency, performance/caching, rate limiting/API gateway, observability, containers/deployment, disaster recovery, security (OAuth/OIDC/SSO/TLS/mTLS), geohashing/quadtrees, plus capstones and case studies (URL Shortener, Distributed KV + Queue, Notification System, WhatsApp, Twitter, Netflix, and Uber).

## Run locally

```bash
npm start
# http://localhost:4173
```

Or any static server, e.g. `python3 -m http.server 4173`.

## Use it on your phone (GitHub Pages)

1. Create a GitHub repository and push this folder.
2. Repo **Settings → Pages → Build and deployment**: source **Deploy from a branch**, branch **main**, folder **/ (root)**, save.
3. Open `https://<your-user>.github.io/<repo>/` on your phone.
4. Install it: iPhone Safari **Share → Add to Home Screen**; Android menu **Install app**.
5. Open **Progress → Schedule** and pick your start date (a Monday works best).

No build or CI is required for hosting. Everything is static.

## Daily use

- Open the app and check off today's session from **Today**, or browse **Plan** to work ahead.
- Progress saves automatically in `localStorage` on that device.
- Use **Progress → Backup** to move data between phones/browsers.
- Each session includes the daily ritual: learn 30 min, build 30 min, quiz 20 min, note 10 min. Friday adds a postmortem; Sunday is the 45-minute teach-back.

## Reminders

A static site cannot schedule OS notifications while it is closed — that requires a push server and VAPID keys, and iOS only allows web push for installed PWAs. The two reliable options below are built in.

### Option A — Calendar alerts (recommended)

1. Open **Progress → Reminders**.
2. Tap **Export remaining** (or **Export full plan**).
3. Import the downloaded `.ics` file into Apple/Google Calendar.

Every session becomes a calendar event with a **10-minute alert**, its estimated duration, the week/context, and a link back to the app. Re-export whenever you move your start date or want to top up after checking items off. Stable event IDs mean most calendar apps update existing events instead of duplicating them. Reminder times come from the Schedule settings.

### Option B — Daily push via ntfy + GitHub Actions (optional)

The repo includes [`.github/workflows/reminder.yml`](.github/workflows/reminder.yml) and [`scripts/reminder.mjs`](scripts/reminder.mjs), which push the day's sessions to your phone at a fixed time using [ntfy](https://ntfy.sh) (free, no account).

1. Install the ntfy app (iOS/Android) and subscribe to a private topic, e.g. `ds-tracker-7f3k9x`.
2. In the GitHub repo: **Settings → Secrets and variables → Actions**:
   - **Secret** `NTFY_TOPIC` = your topic.
   - **Variables**
     - `START_DATE` = plan start date, e.g. `2026-12-01` (required).
     - `APP_URL` = your Pages URL (optional, used as the tap-through link).
     - `TZ_OFFSET` = e.g. `+05:30` (required for correct "today"; defaults to UTC).
     - `NTFY_SERVER` = alternative server (optional; defaults to `https://ntfy.sh`).
3. Enable workflows on the **Actions** tab. Scheduled workflows only run on the default branch.
4. Default schedule is **02:30 UTC ≈ 08:00 IST**; edit the cron in the workflow if needed.
5. Test immediately with **Actions → Daily study reminder → Run workflow**.

Limitations: this sends the day's scheduled sessions; it can't know which items you checked because progress is stored only on your device. It is a nudge, not a sync service.

## Testing

```bash
npm test
```

Validates the session data (counts, unique IDs, phase coverage, date math) and the `.ics` generator.

## Project structure

```
index.html               app shell
css/styles.css           mobile-first UI, dark/light themes
js/plan-data.js          the 26-week plan (edit here to customize)
js/app.js                views, scheduling, streaks, check-ins, settings
js/store.js              localStorage settings/progress
js/util.js               date + download helpers
js/ics.js                calendar export
sw.js                    offline cache (PWA)
manifest.webmanifest     installable app metadata
scripts/reminder.mjs      ntfy push script
scripts/self-check.mjs    data/calendar self-check
.github/workflows/reminder.yml
```

If you edit the plan or anything cached, bump `CACHE_NAME` in `sw.js` so installed phones pick up the new version.

## Privacy

No accounts, analytics, or network calls from the app. Progress and settings live in `localStorage`; exports happen locally. The ntfy workflow is entirely optional and sends only the day's public plan text.
