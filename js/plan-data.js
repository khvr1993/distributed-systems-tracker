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
      mon: 'IP (IPv4/IPv6, public/private), OSI model, DNS, TCP 3-way handshake, UDP',
      tue: 'REST vs GraphQL vs gRPC/Thrift — HTTP/1.1, HTTP/2, streams, multiplexing',
      wed: 'Lab: Build client/server over TCP, add timeout',
      thu: 'Proxies (forward vs reverse), Load Balancing L4 vs L7, health checks, sticky sessions',
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
    title: 'Theory, CAP & Scalability',
    days: {
      mon: 'CAP theorem formal, Availability (nines, series vs parallel, HA vs fault tolerance)',
      tue: 'PACELC, vertical vs horizontal scalability, active-active vs active-passive clustering',
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
    title: 'Storage & Storage Engines',
    days: {
      mon: 'Block vs File vs Object storage (S3), RAID, NAS, HDFS; B-Tree vs LSM Tree',
      tue: 'WAL, SSTables, database indexes (dense, sparse, secondary)',
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
      mon: 'Leader-follower (master-slave), async vs sync replication, lag',
      tue: 'Multi-leader (master-master), conflict resolution',
      wed: 'Leaderless replication (Dynamo style)',
      thu: 'Lab: Replicate KV to 3 nodes, kill leader',
      fri: 'Failure: Replication lag causing stale reads',
      sat: 'Weekend Build: Replicated KV with failover',
    },
  },
  {
    week: 7,
    title: 'Partitioning & Sharding',
    days: {
      mon: 'Sharding & partitioning strategies (hash, range, list, composite), Database Federation',
      tue: 'Consistent Hashing, virtual nodes',
      wed: 'Rebalancing, hot partitions',
      thu: 'Lab: Consistent hash ring + rebalance sim',
      fri: 'Failure: Hot shard at Uber scale',
      sat: 'Weekend Build: Sharded KV store with rebalancing',
    },
  },
  {
    week: 8,
    title: 'Data Models & Transactions',
    days: {
      mon: 'ACID & BASE, Transactions, 2PC, 3PC, drawbacks',
      tue: 'Sagas, Outbox pattern, Normalization vs Denormalization',
      wed: 'SQL vs NoSQL (Document, KV, Wide-column, Graph, Time-series), Materialized views, N+1 queries',
      thu: 'Lab: Saga with compensation',
      fri: 'Failure: 2PC blocking',
      sat: 'Weekend Build: Order service with Saga pattern',
    },
  },
  {
    week: 9,
    title: 'Queues & Pub/Sub',
    days: {
      mon: 'Message Brokers vs ESB; Queues, visibility timeout, DLQ, ordering guarantees',
      tue: 'Pub/Sub fanout, push vs pull delivery, filtering, durability',
      wed: 'Lab: Build queue with visibility timeout',
      thu: 'Backpressure, consumer lag',
      fri: 'Failure: Poison pill message',
      sat: 'Weekend Build: Reliable queue system',
    },
  },
  {
    week: 10,
    title: 'Streaming, Kafka & EDA',
    days: {
      mon: 'Topics, partitions, offsets, brokers',
      tue: 'Producer guarantees, consumer groups, rebalancing',
      wed: 'Event-Driven Architecture (EDA), Event Sourcing, CQRS, exactly-once',
      thu: 'Lab: 2 producers, 2 consumers on Kafka',
      fri: 'Failure: Kafka rebalance storm',
      sat: 'Weekend Build: Event pipeline',
    },
  },
  {
    week: 11,
    title: 'Architecture, Real-Time & Scheduling',
    days: {
      mon: 'N-tier architecture, Monoliths vs Modular Monoliths vs Microservices, Batch vs Stream',
      tue: 'Long polling, WebSockets, Server-Sent Events (SSE); work queues, cron, delayed jobs',
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
      mon: 'Service Discovery (client vs server-side, Consul/etcd/ZooKeeper), Service Mesh',
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
    title: 'Performance & Caching',
    days: {
      mon: 'Latency, throughput, Little’s Law',
      tue: 'Tail latency, p50/p99, hedging, batching',
      wed: 'Caching (write-through/around/back), eviction (LRU/LFU), distributed cache, stampede',
      thu: 'Lab: Add cache + measure p99',
      fri: 'Failure: Cache stampede',
      sat: 'Weekend Build: Cached, rate-limited API',
    },
  },
  {
    week: 16,
    title: 'Rate Limiting, API Gateway & Backpressure',
    days: {
      mon: 'Rate limiting: token/leaky bucket, fixed/sliding window, sliding log, distributed races',
      tue: 'API Gateway & BFF pattern, Backpressure, load shedding, graceful degradation',
      wed: 'Autoscaling signals',
      thu: 'Lab: Rate limiter per user/IP',
      fri: 'Failure: No backpressure cascade',
      sat: 'Weekend Build: API Gateway with limits',
    },
  },
  {
    week: 17,
    title: 'Observability & Reliability',
    days: {
      mon: 'Metrics: RED/USE, SLA/SLO/SLI, Error Budget',
      tue: 'Tracing: spans, context propagation',
      wed: 'Lab: Add OpenTelemetry to service',
      thu: 'Alerting, burn rate alerts',
      fri: 'Failure: Silent failure, no metrics',
      sat: 'Weekend Build: Dashboard + alerts for your KV store',
    },
  },
  {
    week: 18,
    title: 'Deployment, Containers & Ops',
    days: {
      mon: 'VMs & Hypervisors vs Containers; Blue-Green, Canary, Rolling',
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
      mon: 'RPO/RTO, backup, Cold/Warm/Hot site, cross-region replication',
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
      mon: 'AuthN/AuthZ, OAuth 2.0, OpenID Connect (OIDC), SSO/SAML, JWT',
      tue: 'SSL/TLS handshake, mTLS, service identity',
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
      mon: 'System design interview framework: requirements, back-of-the-envelope estimation, data model, APIs',
      tue: 'Capstone 1 — URL Shortener: Base62 encoding, Key Generation Service (KGS), DB schema',
      wed: 'Capstone 1 — URL Shortener: caching, data partitioning, DB cleanup, rate limiting',
      thu: 'Capstone 1 — URL Shortener: analytics pipeline, security, bottleneck analysis',
      fri: 'Failure: KGS single point of failure / hot short-URL cache miss',
      sat: 'Weekend Build: Working URL Shortener with KGS, cache & rate limiter',
    },
  },
  {
    week: 22,
    title: 'Capstone 2 — Distributed KV + Queue',
    days: {
      mon: 'Capstone 2 — KV Store: requirements, estimation, Raft leader election, WAL + SSTables',
      tue: 'Capstone 2 — KV Store: consistent hashing sharding, replication & read/write quorums',
      wed: 'Capstone 2 — Distributed Queue: visibility timeout, DLQ, consumer groups & backpressure',
      thu: 'Lab: Integrate sharded KV + reliable queue with health checks & failover',
      fri: 'Failure: Split-brain / rebalance storm during node failure',
      sat: 'Weekend Build: End-to-end Distributed KV + Queue demo & load test',
    },
  },
  {
    week: 23,
    title: 'Capstone 3 — Notification System',
    days: {
      mon: 'Capstone 3 — Notification System: requirements, estimation, data model, APIs',
      tue: 'Capstone 3 — Fanout, priority queues, Kafka ingestion, templates & user preferences',
      wed: 'Capstone 3 — Real-time delivery (WebSockets/SSE/APNs/FCM), retries, DLQ & idempotency',
      thu: 'Capstone 3 — Per-user/channel rate limiting, circuit breakers & observability',
      fri: 'Failure: Provider outage / notification retry storm',
      sat: 'Weekend Build: Multi-channel notification dispatcher with rate limits & metrics',
    },
  },
  {
    week: 24,
    title: 'Capstone 4 — WhatsApp & Twitter',
    days: {
      mon: 'Case Study: WhatsApp — 1:1/group chat, WebSockets, presence (last seen), read receipts',
      tue: 'Case Study: WhatsApp — message ordering, media storage/CDN, E2EE & partitioning',
      wed: 'Case Study: Twitter — data model, APIs, fan-out on write vs read (celebrity problem)',
      thu: 'Case Study: Twitter — timeline ranking, retweets, search indexing & Redis caching',
      fri: 'Failure: Celebrity tweet fan-out storm / chat reconnection thundering herd',
      sat: 'Weekend Build: Real-time chat + timeline prototype over WebSockets',
    },
  },
  {
    week: 25,
    title: 'Geo-Scale, Netflix & Uber',
    days: {
      mon: 'Geohashing and Quadtrees — spatial indexing, precision vs k-NN tradeoffs',
      tue: 'Geo-partitioning, data residency, global vs local consistency, Push vs Pull CDN',
      wed: 'Case Study: Netflix — video upload/transcoding, HLS/DASH streaming, CDN & geo-blocking',
      thu: 'Case Study: Netflix — recommendations, caching, bandwidth estimation & bottlenecks',
      fri: 'Case Study: Uber — location tracking, ride matching (Quadtrees/Geohash), dispatch & surge',
      sat: 'Weekend: Write 2 full design docs (Netflix + Uber) with estimations & bottlenecks',
    },
  },
  {
    week: 26,
    title: 'Mock + Review',
    days: {
      mon: 'Mock design interview + AI critique',
      tue: 'Teach-back all 6 phases in 2 hours',
      wed: 'Write your “Distributed Systems Playbook” — 20 pages',
      thu: 'Final quiz: 50 questions across all weeks',
      fri: 'Plan next 6 months: go deep on evals/agentic systems',
    },
  },
];

function typeFor(day, text) {
  if (/^Lab:/i.test(text)) return 'lab';
  if (/^Failure:/i.test(text)) return 'failure';
  if (/^Case(?:\s+Study)?:/i.test(text)) return 'case';
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
