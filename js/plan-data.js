export const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export const DAY_OFFSET = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };

export const TYPES = {
  learn: { label: 'Learn' },
  lab: { label: 'Lab' },
  failure: { label: 'Failure' },
  case: { label: 'Case' },
  build: { label: 'Build' },
  review: { label: 'Teach-back' },
  capstone: { label: 'Capstone' },
};

export const PHASES = [
  {
    id: 'foundations',
    name: 'Foundations',
    weeks: [1, 2, 3, 4],
    goal: 'Speak the language precisely; get comfortable with networks and time.',
  },
  {
    id: 'data',
    name: 'Data Layer',
    weeks: [5, 6, 7, 8],
    goal: 'Storage engines, replication, partitioning, transactions — roughly half the field.',
  },
  {
    id: 'messaging',
    name: 'Messaging & Computation',
    weeks: [9, 10, 11, 12],
    goal: 'Queues, streaming, scheduling, and coordination at scale.',
  },
  {
    id: 'reliability',
    name: 'Reliability & Performance',
    weeks: [13, 14, 15, 16],
    goal: 'Failure handling, idempotency, tail latency, backpressure.',
  },
  {
    id: 'observability',
    name: 'Observability, Security & Ops',
    weeks: [17, 18, 19, 20],
    goal: 'Run, observe, secure, and recover distributed systems.',
  },
  {
    id: 'integration',
    name: 'Integration & System Design',
    weeks: [21, 22, 23, 24, 25, 26],
    goal: 'Capstones, Uber-scale designs, and final review.',
  },
];

export const WEEKS = [
  {
    week: 1,
    title: 'Networking & RPC',
    days: {
      mon: 'DNS, TCP 3-way handshake, UDP',
      tue: 'HTTP/1.1 vs HTTP/2 vs gRPC/Thrift — streams, multiplexing',
      wed: 'Lab: Build client/server over TCP, add timeout',
      thu: 'Load Balancing L4 vs L7, health checks, sticky sessions',
      fri: 'Failure: DNS outage / TCP cascade',
      sat: 'Weekend Build: Reverse proxy + load balancer in Go',
    },
  },
  {
    week: 2,
    title: 'Time, Ordering, Consistency',
    days: {
      mon: 'Why clocks are hard — NTP, skew',
      tue: 'Lamport timestamps, Vector clocks',
      wed: 'Linearizable vs Sequential vs Causal vs Eventual — with examples',
      thu: 'Lab: Simulate 3 nodes with skewed clocks',
      fri: 'Failure: Ordering bug in chat / payments',
      sat: 'Weekend Build: Vector clock visualizer + consistency checker',
    },
  },
  {
    week: 3,
    title: 'Theory + CAP',
    days: {
      mon: 'CAP theorem formal',
      tue: 'PACELC, availability vs consistency tradeoffs',
      wed: 'Quorums: R+W > N',
      thu: 'Lab: Quorum calculator + simulator',
      fri: 'Case: Dynamo vs CP systems',
      sat: 'Weekend Build: 3-node quorum simulator',
    },
  },
  {
    week: 4,
    title: 'Consensus Intro',
    days: {
      mon: 'Paxos intuition — why it is hard',
      tue: 'Raft: Leader election, Log replication',
      wed: 'Lab: Raft leader election (simplified)',
      thu: 'Leases, fencing tokens, split-brain',
      fri: 'Failure: Raft split-brain incident',
      sat: 'Weekend Build: Raft leader election demo (3 nodes)',
    },
  },
  {
    week: 5,
    title: 'Storage Engines',
    days: {
      mon: 'B-Tree, LSM Tree',
      tue: 'WAL, SSTables',
      wed: 'Lab: Build simple LSM KV store',
      thu: 'Compaction, write amplification',
      fri: 'Failure: LSM stall',
      sat: 'Weekend Build: Persistent KV store',
    },
  },
  {
    week: 6,
    title: 'Replication',
    days: {
      mon: 'Leader-follower, async vs sync replication, lag',
      tue: 'Multi-leader, conflict resolution',
      wed: 'Leaderless replication (Dynamo style)',
      thu: 'Lab: Replicate KV to 3 nodes, kill leader',
      fri: 'Failure: Replication lag causing stale reads',
      sat: 'Weekend Build: Replicated KV with failover',
    },
  },
  {
    week: 7,
    title: 'Partitioning',
    days: {
      mon: 'Partitioning strategies, range vs hash',
      tue: 'Consistent Hashing, virtual nodes',
      wed: 'Rebalancing, hot partitions',
      thu: 'Lab: Consistent hash ring + rebalance sim',
      fri: 'Failure: Hot shard at Uber scale',
      sat: 'Weekend Build: Sharded KV store with rebalancing',
    },
  },
  {
    week: 8,
    title: 'Transactions',
    days: {
      mon: 'ACID, 2PC, drawbacks',
      tue: 'Sagas, Outbox pattern',
      wed: 'Distributed transactions vs NoSQL',
      thu: 'Lab: Saga with compensation',
      fri: 'Failure: 2PC blocking',
      sat: 'Weekend Build: Order service with Saga pattern',
    },
  },
  {
    week: 9,
    title: 'Queues & Pub/Sub',
    days: {
      mon: 'Queues, visibility timeout, DLQ, ordering guarantees',
      tue: 'Pub/Sub fanout',
      wed: 'Lab: Build queue with visibility timeout',
      thu: 'Backpressure, consumer lag',
      fri: 'Failure: Poison pill message',
      sat: 'Weekend Build: Reliable queue system',
    },
  },
  {
    week: 10,
    title: 'Streaming / Kafka',
    days: {
      mon: 'Topics, partitions, offsets, brokers',
      tue: 'Producer guarantees, consumer groups, rebalancing',
      wed: 'Exactly-once, idempotent producer',
      thu: 'Lab: 2 producers, 2 consumers on Kafka',
      fri: 'Failure: Kafka rebalance storm',
      sat: 'Weekend Build: Event pipeline',
    },
  },
  {
    week: 11,
    title: 'Computation & Scheduling',
    days: {
      mon: 'Batch vs Stream vs RPC',
      tue: 'Work queues, cron, delayed jobs',
      wed: 'Scheduling, priorities, fairness',
      thu: 'Lab: Job scheduler with retries',
      fri: 'Failure: Thundering herd on cron',
      sat: 'Weekend Build: Job scheduler',
    },
  },
  {
    week: 12,
    title: 'Coordination at Scale',
    days: {
      mon: 'Service Discovery, Consul/etcd/ZooKeeper',
      tue: 'Distributed locks, leader election libraries',
      wed: 'Configuration distribution',
      thu: 'Lab: Use etcd for service registry',
      fri: 'Case: How Uber does service discovery',
      sat: 'Weekend Build: Mini service mesh discovery',
    },
  },
  {
    week: 13,
    title: 'Failure Patterns',
    days: {
      mon: 'Partial failure, timeouts',
      tue: 'Retries, exponential backoff + jitter',
      wed: 'Circuit breaker, bulkhead',
      thu: 'Lab: Add retry+breaker to RPC client',
      fri: 'Failure: Retry storm DDoS',
      sat: 'Weekend Build: Resilient RPC client library',
    },
  },
  {
    week: 14,
    title: 'Idempotency & Exactly-Once',
    days: {
      mon: 'At-most-once, at-least-once, exactly-once',
      tue: 'Idempotency keys, dedup store',
      wed: 'Hedged requests',
      thu: 'Lab: Make API idempotent',
      fri: 'Failure: Duplicate charge',
      sat: 'Weekend Build: Payment API with idempotency',
    },
  },
  {
    week: 15,
    title: 'Performance',
    days: {
      mon: 'Latency, throughput, Little’s Law',
      tue: 'Tail latency, p50/p99, hedging, batching',
      wed: 'Caching strategies, invalidation, stampede',
      thu: 'Lab: Add cache + measure p99',
      fri: 'Failure: Cache stampede',
      sat: 'Weekend Build: Cached, rate-limited API',
    },
  },
  {
    week: 16,
    title: 'Rate Limiting & Backpressure',
    days: {
      mon: 'Token bucket, leaky bucket, fixed window',
      tue: 'Backpressure, load shedding, graceful degradation',
      wed: 'Autoscaling signals',
      thu: 'Lab: Rate limiter per user/IP',
      fri: 'Failure: No backpressure cascade',
      sat: 'Weekend Build: API Gateway with limits',
    },
  },
  {
    week: 17,
    title: 'Observability',
    days: {
      mon: 'Metrics: RED/USE, SLO/SLI, Error Budget',
      tue: 'Tracing: spans, context propagation',
      wed: 'Lab: Add OpenTelemetry to service',
      thu: 'Alerting, burn rate alerts',
      fri: 'Failure: Silent failure, no metrics',
      sat: 'Weekend Build: Dashboard + alerts for your KV store',
    },
  },
  {
    week: 18,
    title: 'Deployment & Ops',
    days: {
      mon: 'Blue-Green, Canary, Rolling',
      tue: 'Feature Flags, Config, Rollback',
      wed: 'Multi-region, active-active vs active-passive',
      thu: 'Lab: Deploy with canary analysis',
      fri: 'Failure: Bad deploy, no rollback',
      sat: 'Weekend Build: CI/CD pipeline for distributed service',
    },
  },
  {
    week: 19,
    title: 'Disaster Recovery',
    days: {
      mon: 'RPO/RTO, backup, cross-region replication',
      tue: 'Chaos engineering, fault injection',
      wed: 'Lab: Kill nodes, partition network',
      thu: 'Runbooks',
      fri: 'Failure: AZ outage',
      sat: 'Weekend Build: Chaos test harness',
    },
  },
  {
    week: 20,
    title: 'Security',
    days: {
      mon: 'AuthN/AuthZ, OAuth, JWT',
      tue: 'mTLS, service identity',
      wed: 'Secrets management, audit logs',
      thu: 'Lab: Add mTLS to RPC',
      fri: 'Failure: Token leak',
      sat: 'Weekend Build: Secure service mesh demo',
    },
  },
  {
    week: 21,
    title: 'Capstone 1 — URL Shortener at Scale',
    days: {
      mon: 'Capstone 1 — URL Shortener at Scale: hashing, storage, caching, rate limit, analytics pipeline.',
    },
  },
  {
    week: 22,
    title: 'Capstone 2 — Distributed KV + Queue',
    days: {
      mon: 'Capstone 2 — Distributed KV + Queue: combine Weeks 5–10 — sharded, replicated, consensus for leader.',
    },
  },
  {
    week: 23,
    title: 'Capstone 3 — Notification System',
    days: {
      mon: 'Capstone 3 — Notification System: fanout, queues, streaming, retries, rate limiting, observability.',
    },
  },
  {
    week: 24,
    title: 'Capstone 4 — Chat / Feed System',
    days: {
      mon: 'Capstone 4 — Chat / Feed System: consistency, ordering, presence, scaling.',
    },
  },
  {
    week: 25,
    title: 'Uber-Scale Designs — Geo, Multi-Region',
    days: {
      mon: 'Geo-partitioning, data residency',
      tue: 'Global consistency vs local',
      wed: 'Edge caching, CDN',
      thu: 'Design drill: Uber surge pricing backend',
      fri: 'Design drill: Uber dispatch system',
      sat: 'Weekend: Write 2 design docs',
    },
  },
  {
    week: 26,
    title: 'Mock + Review',
    days: {
      mon: 'Mock design interview + AI critique',
      tue: 'Teach-back all 10 buckets in 2 hours',
      wed: 'Write your “Distributed Systems Playbook” — 20 pages',
      thu: 'Final quiz: 50 questions across all weeks',
      fri: 'Plan next 6 months: go deep on evals/agentic systems',
    },
  },
];

function typeFor(day, text) {
  if (/^Lab:/i.test(text)) return 'lab';
  if (/^Failure:/i.test(text)) return 'failure';
  if (/^Case:/i.test(text)) return 'case';
  if (/^Capstone/i.test(text)) return 'capstone';
  if (day === 'sat') return 'build';
  if (day === 'sun') return 'review';
  return 'learn';
}

export function getItems() {
  const items = [];
  for (const week of WEEKS) {
    const phase = PHASES.find((p) => p.weeks.includes(week.week));
    const days = { ...week.days };

    if (!days.sun && week.week < 26) {
      days.sun = week.week >= 21 && week.week <= 24
        ? 'Teach-back (45 min): demo your capstone and explain its design tradeoffs.'
        : `Teach-back (45 min): explain “${week.title}” like you are teaching a new grad.`;
    }

    for (const day of DAY_ORDER) {
      const entry = days[day];
      if (!entry) continue;
      const text = typeof entry === 'string' ? entry : entry.text;
      items.push({
        id: `w${week.week}-${day}`,
        week: week.week,
        weekTitle: week.title,
        phaseId: phase.id,
        phaseName: phase.name,
        day,
        dayOffset: DAY_OFFSET[day],
        type: typeFor(day, text),
        text,
      });
    }
  }
  return items;
}

export function weekItems(items, week) {
  return items.filter((item) => item.week === week);
}
