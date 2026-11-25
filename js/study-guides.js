const KPS = 'https://github.com/karanpratapsingh/system-design';
export const SOCRATIC_SKILL_URL = 'https://github.com/janestreet/agent_skills/tree/master/socratic-tutor';

// Each entry: [title, url, summary]
export const SESSION_REFS = {
  // Week 1 — Networking & RPC
  'w1-mon': [
    'System Design: IP, OSI Model & TCP/UDP',
    `${KPS}#tcp-and-udp`,
    'IPv4/IPv6 addressing and the 7-layer OSI model frame how DNS resolves names and TCP 3-way handshakes guarantee reliable ordered streams vs UDP datagrams.',
  ],
  'w1-tue': [
    'System Design: REST, GraphQL & gRPC',
    `${KPS}#rest-graphql-grpc`,
    'Compare REST resource semantics, GraphQL flexible client queries, and gRPC over HTTP/2 (binary Protobuf framing, multiplexed streams, and low-latency RPC).',
  ],
  'w1-wed': [
    'gRPC Core Concepts & TCP Timeouts',
    'https://grpc.io/docs/what-is-grpc/core-concepts/',
    'Always bound socket dial, read, and write deadlines—unbounded TCP connections leak file descriptors and stall thread/goroutine pools under packet loss.',
  ],
  'w1-thu': [
    'System Design: Proxy & Load Balancing',
    `${KPS}#load-balancing`,
    'Forward proxies shield clients while reverse proxies terminate TLS, route L4 (IP/port) or L7 (HTTP path/header) traffic, run health checks, and manage sticky state.',
  ],
  'w1-fri': [
    'System Design: DNS Caching & Resolution',
    `${KPS}#domain-name-system-dns`,
    'Stale or expired DNS caches, NXDOMAIN caching, and TCP SYN/connection-pool exhaustion can trigger cascading retries across upstream services.',
  ],
  'w1-sat': [
    'Go httputil.ReverseProxy Docs',
    'https://pkg.go.dev/net/http/httputil#ReverseProxy',
    'Build a reverse proxy with round-robin/least-connections balancing, active health checks, and explicit transport timeouts.',
  ],

  // Week 2 — Time, Ordering, Consistency
  'w2-mon': [
    'Time, Clocks, and the Ordering of Events (Lamport)',
    'https://lamport.azurewebsites.net/pubs/time-clocks.pdf',
    'Physical wall clocks drift and NTP steps backward or forward; you cannot rely on timestamps alone to determine causal order across machines.',
  ],
  'w2-tue': [
    'Patterns of Distributed Systems: Lamport Clock & Version Vector',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/lamport-clock.html',
    'Lamport clocks give a partial causal order (a -> b implies L(a) < L(b)); vector clocks track per-node counters to detect true concurrency vs causality.',
  ],
  'w2-wed': [
    'Jepsen: Consistency Models',
    'https://jepsen.io/consistency',
    'Linearizability guarantees real-time single-copy semantics; sequential preserves a global order; causal preserves cause-effect; eventual converges without writes.',
  ],
  'w2-thu': [
    'Patterns of Distributed Systems: Version Vector',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/version-vector.html',
    'Simulate clock drift across 3 nodes to observe why wall-clock Last-Write-Wins silently drops updates when logical clocks would flag a conflict.',
  ],
  'w2-fri': [
    'Jepsen: Consistency & Ordering Guarantees',
    'https://jepsen.io/consistency',
    'Out-of-order chat messages or double-spent balances happen when concurrent writes rely on unsynchronized client/server wall clocks.',
  ],
  'w2-sat': [
    'Patterns of Distributed Systems: Version Vector',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/version-vector.html',
    'Emit events across simulated nodes, propagate vector clocks on send/receive, and verify causal vs concurrent pairs automatically.',
  ],

  // Week 3 — Theory, CAP & Scalability
  'w3-mon': [
    'System Design: CAP Theorem & Availability',
    `${KPS}#cap-theorem`,
    'During a network partition (P), a distributed store chooses Consistency (reject stale/split writes) or Availability (serve every non-failing node). Measure uptime in nines.',
  ],
  'w3-tue': [
    'System Design: PACELC, Scalability & Clustering',
    `${KPS}#pacelc-theorem`,
    'PACELC extends CAP: even without partitions (Else), systems trade Latency vs Consistency. Pair this with vertical vs horizontal scaling and active-active/passive clusters.',
  ],
  'w3-wed': [
    'Patterns of Distributed Systems: Quorum',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/quorum.html',
    'When read quorum R + write quorum W > N, at least one replica overlaps, letting readers see the latest written version (assuming version checks/read repair).',
  ],
  'w3-thu': [
    'Patterns of Distributed Systems: Quorum',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/quorum.html',
    'Model N, W, R combinations, sloppy quorums, and hinted handoff to see how quorum overlap breaks under node failures or concurrent writes.',
  ],
  'w3-fri': [
    "Amazon's Dynamo Paper (2007)",
    'https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html',
    'Dynamo prioritizes always-writable AP availability with consistent hashing, sloppy quorums, and vector clocks—contrasting sharply with CP stores.',
  ],
  'w3-sat': [
    "Amazon's Dynamo Paper (2007)",
    'https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html',
    'Simulate 3 nodes with tunable R/W quorums, kill 1 node, and verify strict vs sloppy quorum read/write behavior.',
  ],

  // Week 4 — Consensus Intro
  'w4-mon': [
    'Paxos Made Simple (Leslie Lamport)',
    'https://lamport.azurewebsites.net/pubs/paxos-simple.pdf',
    'Single-decree Paxos uses prepare/promise and accept/accepted phases with proposal numbers so a majority quorum prevents conflicting values under concurrent proposers.',
  ],
  'w4-tue': [
    'Raft Consensus Visualization & Paper',
    'https://raft.github.io/',
    'Raft decomposes consensus into randomized-timeout leader election, monotonic term numbers, and log replication committed once stored on a majority.',
  ],
  'w4-wed': [
    'Raft Consensus Visualization & Paper',
    'https://raft.github.io/',
    'Implement Follower/Candidate/Leader state transitions, RequestVote RPCs, and election timeouts so split votes resolve cleanly.',
  ],
  'w4-thu': [
    'How to do Distributed Locking (Martin Kleppmann)',
    'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html',
    'GC pauses or clock jumps can outlive a lease; storage layers must validate monotonically increasing fencing tokens to prevent split-brain writes.',
  ],
  'w4-fri': [
    'Patterns of Distributed Systems: Time-Bound Lease',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/lease.html',
    'Analyze how two leaders believing they hold a lock simultaneously corrupt data unless fenced by a consensus-backed epoch/term token.',
  ],
  'w4-sat': [
    'Raft Consensus Visualization & Paper',
    'https://raft.github.io/',
    'Run a 3-node Raft election demo, kill the leader, verify a single new leader wins in the next term, and test stale-term rejection.',
  ],

  // Week 5 — Storage & Storage Engines
  'w5-mon': [
    'System Design: Storage (Block, File, Object, HDFS)',
    `${KPS}#storage`,
    'Block storage (low-latency volumes), file storage (POSIX hierarchy/NAS), and object storage (S3 immutable blobs) serve different tiers; B-Trees optimize reads while LSM Trees optimize writes.',
  ],
  'w5-tue': [
    'Patterns of Distributed Systems: Write-Ahead Log & Indexes',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/wal.html',
    'A Write-Ahead Log (WAL) makes in-memory MemTable writes durable before flushing sorted immutable SSTables; dense vs sparse indexes control lookup I/O.',
  ],
  'w5-wed': [
    'The Log-Structured Merge-Tree (LSM-Tree Paper)',
    'https://www.cs.umb.edu/~poneil/lsmtree.pdf',
    'Build a minimal MemTable + WAL + SSTable flush + Bloom filter KV store to experience sequential write throughput vs multi-file reads.',
  ],
  'w5-thu': [
    'The Log-Structured Merge-Tree (LSM-Tree Paper)',
    'https://www.cs.umb.edu/~poneil/lsmtree.pdf',
    'Size-tiered vs leveled compaction trades write amplification against read and space amplification as SSTables merge across levels.',
  ],
  'w5-fri': [
    'The Log-Structured Merge-Tree (LSM-Tree Paper)',
    'https://www.cs.umb.edu/~poneil/lsmtree.pdf',
    'When compaction falls behind heavy ingest, L0 files pile up and databases deliberately stall writes to protect read latency and disk space.',
  ],
  'w5-sat': [
    'Patterns of Distributed Systems: Write-Ahead Log',
    'https://martinfowler.com/articles/patterns-of-distributed-systems/wal.html',
    'Persist keys to disk with WAL crash recovery, SSTable compaction, and a sparse index for fast point lookups.',
  ],

  // Week 6 — Replication
  'w6-mon': [
    'System Design: Database Replication',
    `${KPS}#database-replication`,
    'Leader-follower scales reads; synchronous replication protects durability at latency cost, while async replication introduces lag and read-your-writes anomalies.',
  ],
  'w6-tue': [
    'System Design: Master-Master Replication',
    `${KPS}#database-replication`,
    'Multi-leader setups reduce multi-region write latency but require deterministic conflict resolution (LWW, CRDTs, or application merge handlers).',
  ],
  'w6-wed': [
    "Amazon's Dynamo Paper (Leaderless Replication)",
    'https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html',
    'Leaderless writes fan out to all replicas in parallel; read repair and anti-entropy Merkle trees converge divergent replicas in the background.',
  ],
  'w6-thu': [
    'System Design: Database Replication',
    `${KPS}#database-replication`,
    'Replicate writes across 3 KV nodes, terminate the leader mid-traffic, promote a follower, and observe whether any acknowledged writes were lost.',
  ],
  'w6-fri': [
    'System Design: Synchronous vs Asynchronous Replication',
    `${KPS}#database-replication`,
    'Reproduce a stale-read bug (e.g., user updates profile then reloads old data from a lagging replica) and fix it via session-pinned reads or monotonic LSNs.',
  ],
  'w6-sat': [
    'System Design: Database Replication',
    `${KPS}#database-replication`,
    'Implement a replicated KV cluster supporting replication logs, follower catch-up, and automated/scripted leader failover.',
  ],

  // Week 7 — Partitioning & Sharding
  'w7-mon': [
    'System Design: Sharding & Database Federation',
    `${KPS}#sharding`,
    'Hash partitioning spreads load evenly; range partitioning enables range scans; list/composite shard by attribute; database federation splits schemas by domain.',
  ],
  'w7-tue': [
    'System Design: Consistent Hashing',
    `${KPS}#consistent-hashing`,
    'Consistent hashing maps keys and nodes onto a ring so adding/removing a node moves only ~K/N keys; virtual nodes smooth load skew across heterogeneous hosts.',
  ],
  'w7-wed': [
    'System Design: Sharding & Rebalancing',
    `${KPS}#sharding`,
    'Avoid dynamic hash-mod rebalancing traps; use fixed virtual partitions or key splitting with rate-limited background data migration for hot partitions.',
  ],
  'w7-thu': [
    'System Design: Consistent Hashing',
    `${KPS}#consistent-hashing`,
    'Build a consistent hash ring with configurable virtual nodes and measure standard deviation of key distribution as nodes join and leave.',
  ],
  'w7-fri': [
    'System Design: Sharding (Hot Partitions)',
    `${KPS}#sharding`,
    'A celebrity entity or busy city center can saturate a single shard; mitigate with salted keys, request coalescing, or adaptive sub-sharding.',
  ],
  'w7-sat': [
    'System Design: Sharding & Consistent Hashing',
    `${KPS}#consistent-hashing`,
    'Build a multi-shard KV router with virtual nodes and online shard rebalancing without dropping in-flight lookups.',
  ],

  // Week 8 — Data Models & Transactions
  'w8-mon': [
    'System Design: ACID, BASE & Distributed Transactions',
    `${KPS}#distributed-transactions`,
    'ACID guarantees strict transactional invariants; BASE favors availability and eventual convergence. Two-Phase Commit (2PC) blocks if the coordinator crashes; 3PC adds pre-commit.',
  ],
  'w8-tue': [
    'Microservices Patterns: Saga & Transactional Outbox',
    'https://microservices.io/patterns/data/transactional-outbox.html',
    'Replace distributed locks with Sagas (local transactions + compensating actions) and the Outbox pattern (atomic DB + event write). Balance normalization vs denormalization.',
  ],
  'w8-wed': [
    'System Design: SQL vs NoSQL, Materialized Views & N+1',
    `${KPS}#sql-vs-nosql-databases`,
    'Match workloads to SQL vs NoSQL (Document, KV, Wide-column, Graph, Time-series); precompute expensive joins with materialized views and eliminate N+1 query loops.',
  ],
  'w8-thu': [
    'Microservices Patterns: Saga Pattern',
    'https://microservices.io/patterns/data/saga.html',
    'Implement an orchestrated or choreographed Saga with idempotent steps and compensating rollbacks when inventory or payment fails.',
  ],
  'w8-fri': [
    'System Design: Two-Phase Commit Problems',
    `${KPS}#distributed-transactions`,
    'Walk through what happens when a 2PC coordinator crashes right after participants vote Yes: locks stay held indefinitely until recovery.',
  ],
  'w8-sat': [
    'Microservices Patterns: Saga & Transactional Outbox',
    'https://microservices.io/patterns/data/saga.html',
    'Build an order service using an outbox table + Saga orchestrator so failed downstream payments reliably trigger stock compensation.',
  ],

  // Week 9 — Queues & Pub/Sub
  'w9-mon': [
    'System Design: Message Brokers, Queues & ESB',
    `${KPS}#message-queues`,
    'Contrast lightweight brokers with heavyweight ESBs; master visibility timeouts, Dead-Letter Queues (DLQs), FIFO groups, and per-key ordering.',
  ],
  'w9-tue': [
    'System Design: Publish-Subscribe',
    `${KPS}#publish-subscribe`,
    'Pub/Sub decouples producers from independent subscribers using topic fanout, push vs pull delivery, attribute filtering, and durable subscriptions.',
  ],
  'w9-wed': [
    'AWS SQS: Visibility Timeout Mechanics',
    'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html',
    'Build an in-memory/persistent queue where leased messages become invisible until ACK or timeout expiry, routing repeated failures to a DLQ.',
  ],
  'w9-thu': [
    'System Design: Message Queues & Backpressure',
    `${KPS}#message-queues`,
    'Track consumer lag (offset/depth + age) and apply bounded prefetch, worker concurrency limits, and producer backpressure to prevent OOM.',
  ],
  'w9-fri': [
    'System Design: Poison-pill Messages',
    `${KPS}#message-queues`,
    'A malformed payload that crashes consumers in an infinite retry loop starves healthy messages; cap receive counts and quarantine to a DLQ.',
  ],
  'w9-sat': [
    'System Design: Message Queues',
    `${KPS}#message-queues`,
    'Build a reliable queue server supporting enqueue, lease with visibility timeout, ACK/NACK, max-retries, and Dead-Letter Queue inspection.',
  ],

  // Week 10 — Streaming, Kafka & EDA
  'w10-mon': [
    'Apache Kafka Documentation: Design & Architecture',
    'https://kafka.apache.org/documentation/',
    'Kafka models streams as append-only partitioned logs stored across brokers; consumer offsets allow cheap replay without deleting read messages.',
  ],
  'w10-tue': [
    'Apache Kafka Documentation: Producers & Consumers',
    'https://kafka.apache.org/documentation/',
    'Tune acks=all + min.insync.replicas for durability; understand how consumer groups assign partitions and pause during group rebalancing.',
  ],
  'w10-wed': [
    'System Design: Event-Driven Architecture, Event Sourcing & CQRS',
    `${KPS}#event-sourcing`,
    'EDA reacts to domain events; Event Sourcing stores immutable state transitions as the source of truth; CQRS separates write models from optimized read projections.',
  ],
  'w10-thu': [
    'Apache Kafka Documentation: Quickstart & Consumers',
    'https://kafka.apache.org/documentation/',
    'Run 2 producers and 2 consumers on a multi-partition topic, verify partition assignment by key, and observe rebalance behavior when 1 consumer stops.',
  ],
  'w10-fri': [
    'Apache Kafka Documentation: Consumer Group Rebalancing',
    'https://kafka.apache.org/documentation/',
    'Long processing pauses exceed max.poll.interval.ms, kicking consumers out and triggering a stop-the-world rebalance storm; use cooperative sticky assignors.',
  ],
  'w10-sat': [
    'System Design: Event-Driven Architecture & CQRS',
    `${KPS}#command-and-query-responsibility-segregation-cqrs`,
    'Build an event pipeline publishing domain events to Kafka/a log and projecting them asynchronously into a separate CQRS read view.',
  ],

  // Week 11 — Architecture, Real-Time & Scheduling
  'w11-mon': [
    'System Design: N-tier, Monoliths & Microservices',
    `${KPS}#monoliths-and-microservices`,
    'Understand N-tier layering, why modular monoliths beat premature microservices, and when to choose batch vs streaming vs synchronous RPC.',
  ],
  'w11-tue': [
    'System Design: Long Polling, WebSockets & SSE',
    `${KPS}#long-polling-websockets-server-sent-events-sse`,
    'Long polling holds HTTP requests; SSE pushes unidirectional server streams over HTTP; WebSockets upgrade to full-duplex frames. Pair with delayed job queues.',
  ],
  'w11-wed': [
    'Google SRE Book: Handling Overload & Scheduling',
    'https://sre.google/sre-book/handling-overload/',
    'Design priority lanes, weighted fair queuing, and tenant isolation so heavy batch tenants cannot starve latency-sensitive interactive jobs.',
  ],
  'w11-thu': [
    'System Design: Message Queues (Task & Delayed Queues)',
    `${KPS}#message-queues`,
    'Build a persistent job scheduler supporting delayed execution timestamps, exponential retry backoff, and idempotent worker leases.',
  ],
  'w11-fri': [
    'AWS Builders Library: Timeouts, Retries & Jitter',
    'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    'Synchronized top-of-the-hour cron jobs create massive traffic spikes; smooth them with deterministic per-tenant jitter windows.',
  ],
  'w11-sat': [
    'System Design: Message Queues & Real-Time Updates',
    `${KPS}#long-polling-websockets-server-sent-events-sse`,
    'Build a job scheduler with priority queues, retries, and live job status streaming to clients over SSE or WebSockets.',
  ],

  // Week 12 — Coordination at Scale
  'w12-mon': [
    'System Design: Service Discovery & Service Mesh',
    `${KPS}#service-discovery`,
    'Compare client-side vs server-side service discovery, self vs third-party registration, strongly consistent registries (etcd/Consul/ZooKeeper), and sidecar service meshes.',
  ],
  'w12-tue': [
    'How to do Distributed Locking (Martin Kleppmann)',
    'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html',
    'Use consensus-backed leases with TTL keepalives and fencing tokens for correctness locks vs best-effort efficiency locks.',
  ],
  'w12-wed': [
    'etcd v3 Learning: Watch & Key-Value API',
    'https://etcd.io/docs/v3.5/learning/api/',
    'Dynamic config distribution combines versioned snapshots with long-lived Watch streams so services converge quickly without polling storms.',
  ],
  'w12-thu': [
    'etcd v3 Learning: Leases & Service Registry',
    'https://etcd.io/docs/v3.5/learning/api/',
    'Register service instances in etcd with TTL leases, maintain heartbeats, and watch prefix changes to update an in-memory endpoint list.',
  ],
  'w12-fri': [
    'System Design: Service Discovery Case Study',
    `${KPS}#service-discovery`,
    'Trace how large microservice fleets handle registry failures: local endpoint caching (fail-static) prevents a registry hiccup from taking down all RPCs.',
  ],
  'w12-sat': [
    'System Design: Service Discovery & Mesh',
    `${KPS}#service-discovery`,
    'Build a mini service discovery registry + client watcher with TTL heartbeats, health filtering, and stale-cache fallback.',
  ],

  // Week 13 — Failure Patterns
  'w13-mon': [
    'AWS Builders Library: Timeouts, Retries & Backoff with Jitter',
    'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    'Distributed calls fail partially (slow hangs are worse than fast crashes). Set explicit connect, request, and end-to-end deadline propagation.',
  ],
  'w13-tue': [
    'AWS Builders Library: Timeouts, Retries & Backoff with Jitter',
    'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    'Full jitter spreads retry waves evenly in time; never retry indefinitely across every layer of a call stack (retry amplification).',
  ],
  'w13-wed': [
    'Martin Fowler: Circuit Breaker',
    'https://martinfowler.com/bliki/CircuitBreaker.html',
    'Circuit breakers fail fast when downstream error rates spike (Closed -> Open -> Half-Open), while bulkheads isolate connection/thread pools per dependency.',
  ],
  'w13-thu': [
    'Martin Fowler: Circuit Breaker',
    'https://martinfowler.com/bliki/CircuitBreaker.html',
    'Wrap an RPC client with deadline budgets, jittered retries on transient errors only, and a sliding-window circuit breaker.',
  ],
  'w13-fri': [
    'AWS Builders Library: Retry Storm Prevention',
    'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    '3 layers of 3x retries multiply traffic by 27x during an outage! Use token-bucket retry budgets so retries never exceed ~10% of normal traffic.',
  ],
  'w13-sat': [
    'AWS Builders Library & Circuit Breaker',
    'https://martinfowler.com/bliki/CircuitBreaker.html',
    'Build a reusable resilient RPC client library with deadlines, retry budgets, jittered backoff, circuit breaker, and per-upstream bulkheads.',
  ],

  // Week 14 — Idempotency & Exactly-Once
  'w14-mon': [
    'System Design: Idempotency & Delivery Semantics',
    `${KPS}#idempotency`,
    'True exactly-once delivery across an unreliable network is impossible; you achieve effectively-once semantics via at-least-once delivery + idempotent receivers.',
  ],
  'w14-tue': [
    'AWS Builders Library: Making Retries Safe with Idempotent APIs',
    'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/',
    'Persist an idempotency key + request payload hash + response atomically inside the same DB transaction before committing side effects.',
  ],
  'w14-wed': [
    'Google Research: The Tail at Scale (Hedged Requests)',
    'https://research.google/pubs/the-tail-at-scale/',
    'Send a backup read after the p95 delay (hedged request) and cancel the slower response—only safe when the operation is strictly read-only or idempotent.',
  ],
  'w14-thu': [
    'AWS Builders Library: Making Retries Safe with Idempotent APIs',
    'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/',
    'Add Idempotency-Key header middleware handling concurrent in-flight duplicates (409/wait), payload mismatches (422), and cached replay.',
  ],
  'w14-fri': [
    'System Design: Idempotency in Payments',
    `${KPS}#idempotency`,
    'Walk through a client timeout after the payment gateway charged the card: without an idempotency key, a mobile retry double-charges the customer.',
  ],
  'w14-sat': [
    'AWS Builders Library: Idempotent Payment API',
    'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/',
    'Build a payment ledger API backed by atomic idempotency keys, state-machine guards, and safe concurrent retry handling.',
  ],

  // Week 15 — Performance & Caching
  'w15-mon': [
    'Google SRE Book: Handling Overload (Latency & Throughput)',
    'https://sre.google/sre-book/handling-overload/',
    "Little's Law (L = lambda * W) links concurrency, arrival rate, and latency: when service time rises near saturation, queue depth and latency explode.",
  ],
  'w15-tue': [
    'Google Research: The Tail at Scale',
    'https://research.google/pubs/the-tail-at-scale/',
    'At 100 fan-out RPCs with 1% p99 slowdowns, 63% of user requests experience tail latency! Mitigate with hedging, micro-batching, and tied requests.',
  ],
  'w15-wed': [
    'System Design: Caching Strategies & Eviction',
    `${KPS}#caching`,
    'Compare cache-aside, write-through, write-around, and write-back; LRU/LFU eviction; distributed caches; and singleflight coalescing to prevent stampedes.',
  ],
  'w15-thu': [
    'System Design: Caching & Tail Latency',
    `${KPS}#caching`,
    'Add a Redis/in-memory cache layer to an API and benchmark p50, p95, and p99 latencies before and after under concurrent load.',
  ],
  'w15-fri': [
    'System Design: Cache Invalidation & Stampede',
    `${KPS}#caching`,
    'When a hot key expires under 10k RPS, thousands of misses slam the database at once; prevent it with request coalescing (singleflight), jittered TTLs, or early refresh.',
  ],
  'w15-sat': [
    'System Design: Caching & Rate Limiting',
    `${KPS}#caching`,
    'Build a cached API with LRU eviction, singleflight stampede protection, and per-key latency instrumentation.',
  ],

  // Week 16 — Rate Limiting, API Gateway & Backpressure
  'w16-mon': [
    'System Design: Rate Limiting Algorithms',
    `${KPS}#rate-limiting`,
    'Token bucket allows bursts; leaky bucket smooths outflow; sliding window counter balances accuracy and memory; atomic Lua/Redis scripts prevent distributed race conditions.',
  ],
  'w16-tue': [
    'System Design: API Gateway, BFF & Load Shedding',
    `${KPS}#api-gateway`,
    'API Gateways centralize auth, routing, and Backend-for-Frontend (BFF) aggregation; under overload, shed low-priority traffic early using LIFO/priority queues.',
  ],
  'w16-wed': [
    'Google SRE Book: Handling Overload',
    'https://sre.google/sre-book/handling-overload/',
    'CPU is a lagging proxy for saturation; autoscale on queue depth, inflight concurrency, and critical-path latency while respecting cooldown windows.',
  ],
  'w16-thu': [
    'System Design: Rate Limiting in Distributed Systems',
    `${KPS}#rate-limiting`,
    'Implement token bucket and sliding-window rate limiters per user/IP with proper 429 + Retry-After headers and race-safe atomic updates.',
  ],
  'w16-fri': [
    'AWS Builders Library: Using Load Shedding to Avoid Overload',
    'https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/',
    'Without backpressure or load shedding, queues fill with expired client requests and workers burn 100% CPU doing work whose callers already timed out.',
  ],
  'w16-sat': [
    'System Design: API Gateway & Rate Limiting',
    `${KPS}#api-gateway`,
    'Build an API Gateway enforcing route matching, per-tenant token buckets, graceful load shedding, and BFF response shaping.',
  ],

  // Week 17 — Observability & Reliability
  'w17-mon': [
    'System Design: SLA, SLO, SLI & Google SRE Book',
    `${KPS}#sla-slo-sli`,
    'SLIs measure behavior (RED/USE); SLOs set internal targets and error budgets; SLAs define external contractual penalties.',
  ],
  'w17-tue': [
    'OpenTelemetry Concepts: Distributed Traces',
    'https://opentelemetry.io/docs/concepts/signals/traces/',
    'W3C traceparent headers propagate trace IDs across HTTP/RPC/queue boundaries so spans reconstruct the full distributed critical path.',
  ],
  'w17-wed': [
    'OpenTelemetry Concepts: Signals & Instrumentation',
    'https://opentelemetry.io/docs/concepts/signals/traces/',
    'Instrument a multi-service flow with OpenTelemetry spans and RED metrics (Rate, Errors, Duration) and inspect a slow request trace.',
  ],
  'w17-thu': [
    'Google SRE Workbook: Alerting on SLOs',
    'https://sre.google/workbook/alerting-on-slos/',
    'Page on fast multi-window error-budget burn rates rather than noisy raw CPU or single-minute error spikes.',
  ],
  'w17-fri': [
    'Google SRE Book: Monitoring Distributed Systems',
    'https://sre.google/sre-book/monitoring-distributed-systems/',
    'Diagnose why a silent failure (dropped queue worker or partial 200 error payload) passed naive health checks without symptom-based SLIs.',
  ],
  'w17-sat': [
    'Google SRE Book: Monitoring Distributed Systems',
    'https://sre.google/sre-book/monitoring-distributed-systems/',
    'Add Prometheus-style RED metrics, an SLO burn-rate alert rule, and trace propagation to your earlier KV store.',
  ],

  // Week 18 — Deployment, Containers & Ops
  'w18-mon': [
    'System Design: VMs vs Containers & Blue-Green Deployment',
    `${KPS}#virtual-machines-vms-and-containers`,
    'Hypervisors virtualize hardware; containers share the host OS kernel via namespaces/cgroups. Ship safely with Blue-Green, Canary, and Rolling strategies.',
  ],
  'w18-tue': [
    'Martin Fowler: Feature Toggles (Flags)',
    'https://martinfowler.com/articles/feature-toggles.html',
    'Decouple code deployment from feature release using dynamic feature flags and instant kill-switches, while keeping schema changes backward-compatible.',
  ],
  'w18-wed': [
    'System Design: Clustering (Active-Active vs Active-Passive)',
    `${KPS}#clustering`,
    'Active-passive simplifies write consistency with failover RTO; active-active serves users locally in multiple regions at the cost of cross-region replication conflicts.',
  ],
  'w18-thu': [
    'Martin Fowler: Blue-Green & Canary Analysis',
    'https://martinfowler.com/bliki/BlueGreenDeployment.html',
    'Shift 5% canary traffic to a new build, compare error/p99 SLIs against baseline, and trigger automated rollback on regression.',
  ],
  'w18-fri': [
    'Martin Fowler: Feature Toggles & Safe Rollbacks',
    'https://martinfowler.com/articles/feature-toggles.html',
    'Trace a bad deploy with a destructive forward-only DB migration; practice expand-and-contract migrations so rollbacks always stay safe.',
  ],
  'w18-sat': [
    'Martin Fowler: Blue-Green Deployment',
    'https://martinfowler.com/bliki/BlueGreenDeployment.html',
    'Containerize a distributed service and wire a CI/CD pipeline with health-gated canary promotion and instant rollback.',
  ],

  // Week 19 — Disaster Recovery
  'w19-mon': [
    'System Design: Disaster Recovery (RPO, RTO & Sites)',
    `${KPS}#disaster-recovery`,
    'RPO bounds acceptable data loss; RTO bounds recovery time. Choose among backups, cold sites, warm standby, and hot multi-region sites by budget and SLA.',
  ],
  'w19-tue': [
    'Principles of Chaos Engineering',
    'https://principlesofchaos.org/',
    'Define steady-state hypotheses, inject controlled faults (latency, packet loss, process kills) in minimal blast radius, and verify invariants hold.',
  ],
  'w19-wed': [
    'Principles of Chaos Engineering',
    'https://principlesofchaos.org/',
    'Kill a primary node and inject an asymmetric network partition on your cluster to verify split-brain protection and recovery time.',
  ],
  'w19-thu': [
    'Google SRE Book: Monitoring & Incident Runbooks',
    'https://sre.google/sre-book/monitoring-distributed-systems/',
    'Write crisp, copy-pasteable incident runbooks linking each alert symptom to blast-radius checks, safe mitigations, and verification queries.',
  ],
  'w19-fri': [
    'System Design: Disaster Recovery & AZ Outages',
    `${KPS}#disaster-recovery`,
    'Walk through an Availability Zone blackout: DNS/LB health eviction, cross-AZ capacity headroom (N+1), and avoiding cold-cache DB storms in surviving AZs.',
  ],
  'w19-sat': [
    'Principles of Chaos Engineering',
    'https://principlesofchaos.org/',
    'Build a repeatable chaos harness that injects latency, 500s, and node kills while asserting zero lost acknowledged writes.',
  ],

  // Week 20 — Security
  'w20-mon': [
    'System Design: OAuth 2.0, OIDC & Single Sign-On (SSO)',
    `${KPS}#oauth-20-and-openid-connect-oidc`,
    'OAuth 2.0 delegates authorization (scopes/tokens); OpenID Connect (OIDC) adds an identity layer (ID Token/JWT); SSO/SAML federates logins across IdPs and SPs.',
  ],
  'w20-tue': [
    'System Design: SSL, TLS & mTLS',
    `${KPS}#ssl-tls-mtls`,
    'TLS authenticates the server and encrypts transport; mutual TLS (mTLS) requires both client and server X.509 certificates for zero-trust service identity.',
  ],
  'w20-wed': [
    'OWASP Secrets Management Cheat Sheet',
    'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
    'Keep secrets out of code/env logs; use short-lived dynamic credentials, automated rotation, least-privilege IAM, and tamper-evident audit logs.',
  ],
  'w20-thu': [
    'System Design: mTLS Service Identity',
    `${KPS}#ssl-tls-mtls`,
    'Generate a local CA, issue client/server certificates, configure mTLS between two RPC services, and verify unauthenticated clients are rejected.',
  ],
  'w20-fri': [
    'OWASP Secrets Management Cheat Sheet',
    'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
    'Contain a leaked JWT/API key: short token TTLs, signing-key rotation, token revocation/blocklists, and audit trail correlation.',
  ],
  'w20-sat': [
    'System Design: mTLS & OAuth/OIDC',
    `${KPS}#ssl-tls-mtls`,
    'Build a secure multi-service demo combining edge JWT/OIDC validation with internal mTLS service-to-service verification.',
  ],

  // Week 21 — Capstone 1: URL Shortener
  'w21-mon': [
    'System Design Interviews Framework',
    `${KPS}#system-design-interviews`,
    'Follow a structured 6-step loop: requirements clarification, back-of-the-envelope capacity estimation, data model, APIs, high-level design, and bottleneck resolution.',
  ],
  'w21-tue': [
    'System Design Case Study: URL Shortener',
    `${KPS}#url-shortener`,
    'Compare hash+collision handling vs pre-generated Base62 keys from a Key Generation Service (KGS) backed by atomic DB leases.',
  ],
  'w21-wed': [
    'System Design Case Study: URL Shortener (Scaling)',
    `${KPS}#url-shortener`,
    'Size the read-heavy cache (80/20 rule, Redis LRU), hash-shard the URL mapping store, enforce TTL cleanup, and rate-limit creation by API key.',
  ],
  'w21-thu': [
    'System Design Case Study: URL Shortener (Analytics & Security)',
    `${KPS}#url-shortener`,
    'Decouple click-analytics writes onto Kafka/queues so 301/302 redirects stay sub-10ms, and guard against open-redirect abuse and enumeration.',
  ],
  'w21-fri': [
    'System Design Case Study: URL Shortener Bottlenecks',
    `${KPS}#url-shortener`,
    'Trace a KGS crash (standby replica + in-memory key batch cache) and a viral short-URL stampede (singleflight + CDN edge caching).',
  ],
  'w21-sat': [
    'System Design Case Study: URL Shortener',
    `${KPS}#url-shortener`,
    'Build an end-to-end URL Shortener with Base62/KGS key allocation, cache-aside redirects, rate limiting, and async click counting.',
  ],

  // Week 22 — Capstone 2: Distributed KV + Queue
  'w22-mon': [
    'Raft & Write-Ahead Log Architecture',
    'https://raft.github.io/',
    'Combine Weeks 4–5: design a partitioned KV engine where each shard runs Raft consensus over a WAL + MemTable + SSTable store.',
  ],
  'w22-tue': [
    'System Design: Consistent Hashing & Quorums',
    `${KPS}#consistent-hashing`,
    'Route keys across shard groups using consistent hashing with virtual nodes and tunable replication quorums for read/write availability.',
  ],
  'w22-wed': [
    'System Design: Message Queues & Kafka',
    `${KPS}#message-queues`,
    'Layer a durable queue abstraction on top of partitioned logs with visibility timeouts, consumer-group offsets, DLQs, and backpressure.',
  ],
  'w22-thu': [
    'etcd & Kafka Architecture Reference',
    'https://etcd.io/docs/v3.5/learning/api/',
    'Wire service health checks and automated failover between your sharded KV cluster and reliable queue consumers.',
  ],
  'w22-fri': [
    'Raft Consensus & Rebalance Storms',
    'https://raft.github.io/',
    'Inject a node crash mid-rebalance and verify fencing terms prevent stale shard leaders from serving split-brain writes.',
  ],
  'w22-sat': [
    'Capstone 2: Distributed KV + Queue Integration',
    `${KPS}#sharding`,
    'Assemble and load-test your sharded, replicated KV + Queue system while recording p50/p99 latency across a simulated node failure.',
  ],

  // Week 23 — Capstone 3: Notification System
  'w23-mon': [
    'System Design Interviews & Message Brokers',
    `${KPS}#message-brokers`,
    'Scope multi-channel delivery (push, SMS, email, in-app), throughput estimates, user-preference schemas, and non-blocking send APIs.',
  ],
  'w23-tue': [
    'System Design: Publish-Subscribe & Queues',
    `${KPS}#publish-subscribe`,
    'Separate critical transactional alerts from bulk marketing via priority Kafka topics/queues, template rendering workers, and preference checks.',
  ],
  'w23-wed': [
    'System Design: Long Polling, WebSockets, SSE & Idempotency',
    `${KPS}#long-polling-websockets-server-sent-events-sse`,
    'Deliver in-app alerts over WebSockets/SSE and external pushes via APNs/FCM workers with idempotent deduplication keys and DLQs.',
  ],
  'w23-thu': [
    'System Design: Rate Limiting, Circuit Breaker & SLOs',
    `${KPS}#rate-limiting`,
    'Protect downstream SMS/email providers with circuit breakers, enforce per-user anti-spam rate caps, and track delivery-latency SLIs.',
  ],
  'w23-fri': [
    'Martin Fowler: Circuit Breaker & Retry Storms',
    'https://martinfowler.com/bliki/CircuitBreaker.html',
    'Handle a third-party SMS/push provider outage cleanly: trip the breaker, spill to fallback providers or delayed retry queues, and avoid thundering retries.',
  ],
  'w23-sat': [
    'System Design: Event-Driven Notification Pipeline',
    `${KPS}#event-driven-architecture-eda`,
    'Build a multi-channel notification dispatcher with priority queues, per-user rate limits, idempotency, and Prometheus/RED metrics.',
  ],

  // Week 24 — Capstone 4: WhatsApp & Twitter
  'w24-mon': [
    'System Design Case Study: WhatsApp',
    `${KPS}#whatsapp`,
    'Design 1:1 and group messaging with stateful WebSocket gateways, user-to-gateway session routing, heartbeat presence (last seen), and read receipts.',
  ],
  'w24-tue': [
    'System Design Case Study: WhatsApp (Storage & Media)',
    `${KPS}#whatsapp`,
    'Store undelivered messages transiently for offline delivery, offload encrypted media blobs to Object Storage + CDN, and partition by chat/user ID.',
  ],
  'w24-wed': [
    'System Design Case Study: Twitter (Newsfeed)',
    `${KPS}#twitter`,
    'Solve the fan-out dilemma: push (fan-out on write) for normal users into Redis timeline caches vs pull (fan-out on read) hybrid for celebrities.',
  ],
  'w24-thu': [
    'System Design Case Study: Twitter (Search, Ranking & Cache)',
    `${KPS}#twitter`,
    'Combine inverted search indexes, timeline ranking, retweet counters, and hot-tweet Redis caching behind CDN-backed media delivery.',
  ],
  'w24-fri': [
    'System Design Case Studies: WhatsApp & Twitter Bottlenecks',
    `${KPS}#twitter`,
    'Analyze celebrity fan-out amplification and mass WebSocket reconnect storms after a gateway outage (use jittered reconnects + hybrid fan-out).',
  ],
  'w24-sat': [
    'System Design Case Studies: WhatsApp & Twitter',
    `${KPS}#whatsapp`,
    'Build a WebSocket chat + hybrid timeline prototype supporting online presence, message ordering, and Redis-backed feed fan-out.',
  ],

  // Week 25 — Geo-Scale, Netflix & Uber
  'w25-mon': [
    'System Design: Geohashing and Quadtrees',
    `${KPS}#geohashing-and-quadtrees`,
    'Geohash encodes 2D coordinates into sortable Z-order prefixes (watch boundary edges); Quadtrees adaptively split dense urban regions for fast k-NN search.',
  ],
  'w25-tue': [
    'System Design: CDN (Push vs Pull) & Geo-Partitioning',
    `${KPS}#content-delivery-network-cdn`,
    'Partition data by region for latency and residency compliance; contrast Pull CDNs (cache on first miss) vs Push CDNs (pre-warmed heavy assets).',
  ],
  'w25-wed': [
    'System Design Case Study: Netflix (Streaming & CDN)',
    `${KPS}#netflix`,
    'Transcode uploaded masters into multi-bitrate HLS/DASH chunks, store in Object Storage, serve via Open Connect/CDN edges, and enforce geo-licensing.',
  ],
  'w25-thu': [
    'System Design Case Study: Netflix (Recommendations & Scale)',
    `${KPS}#netflix`,
    'Estimate peak egress bandwidth, separate control-plane metadata microservices from data-plane CDN streaming, and design offline+online recommendation pipelines.',
  ],
  'w25-fri': [
    'System Design Case Study: Uber (Dispatch & Surge)',
    `${KPS}#uber`,
    'Ingest high-frequency driver GPS pings into sharded spatial indexes (Quadtrees/Geohash/H3), match nearby drivers atomically, and compute localized surge.',
  ],
  'w25-sat': [
    'System Design Case Studies: Netflix & Uber',
    `${KPS}#uber`,
    'Write two complete architecture docs (Netflix + Uber) covering requirements, capacity math, data model, APIs, spatial/CDN architecture, and bottlenecks.',
  ],

  // Week 26 — Mock + Review
  'w26-mon': [
    'System Design Interviews Guide',
    `${KPS}#system-design-interviews`,
    'Run a timed 45-minute mock interview end-to-end: clarify scope, compute QPS/storage, sketch components, and defend every consistency/scaling tradeoff.',
  ],
  'w26-tue': [
    'System Design: Complete Course Index',
    `${KPS}#table-of-contents`,
    'Synthesize all 6 phases (Foundations, Data, Messaging, Reliability, Ops/Security, Case Studies) into crisp 15-minute verbal mental models.',
  ],
  'w26-wed': [
    'System Design: References & Next Steps',
    `${KPS}#next-steps`,
    'Distill your personal Distributed Systems Playbook: default primitives, back-of-the-envelope cheat sheet, failure checklist, and pattern tradeoffs.',
  ],
  'w26-thu': [
    'Jepsen & System Design Comprehensive Review',
    'https://jepsen.io/consistency',
    'Test active recall across all 26 weeks with scenario questions focused on failure modes, quorum math, and architecture selection.',
  ],
  'w26-fri': [
    'System Design: Next Steps',
    `${KPS}#next-steps`,
    'Identify your weakest 2 phases from the 26-week log and map a focused next-6-month deep dive (papers, production builds, or AI/eval systems).',
  ],
};

export function buildStudyGuide(item) {
  const entry = SESSION_REFS[item.id];
  const refTitle = entry
    ? entry[0]
    : `Week ${item.week} Teach-Back — ${item.weekTitle}`;
  const refUrl = entry
    ? entry[1]
    : (SESSION_REFS[`w${item.week}-mon`]?.[1] || KPS);
  const refSummary = entry
    ? entry[2]
    : `Explain ${item.weekTitle} from first principles: core mechanism, key failure mode, and when to choose alternatives.`;

  let modeGoal = 'Diagnose my baseline first, ask one Socratic question at a time, and cover core mechanics, edge cases, and architectural tradeoffs before I summarize.';
  if (item.type === 'lab' || item.type === 'build') {
    modeGoal = 'Guide me Socratic-style to design the minimal architecture, data structures, and failure test cases first—do not write the solution code unless I ask after answering.';
  } else if (item.type === 'failure') {
    modeGoal = 'Walk me through this incident step by step: give me initial symptoms and make me diagnose root cause, blast radius, and safe mitigation one question at a time.';
  } else if (item.type === 'case' || item.type === 'capstone') {
    modeGoal = 'Coach me through this as a Socratic system design interview (requirements -> capacity math -> data model & APIs -> high-level design -> bottlenecks), probing each choice one question at a time.';
  } else if (item.type === 'review') {
    modeGoal = 'Let me teach this topic back to you from scratch, then probe every hand-wavy claim or missing edge case with targeted follow-up questions.';
  }

  const prompt = [
    `Use the socratic-tutor skill to teach me Week ${item.week} (${item.weekTitle}): ${item.text}.`,
    `If your agent supports skills, invoke /socratic-tutor first. If the skill is unavailable, act as a Socratic tutor: ask one question at a time and wait for my answer.`,
    `Core focus: ${refSummary}`,
    `Reference: ${refUrl}`,
    `Guidance: ${modeGoal}`,
  ].join('\n');

  return { refTitle, refUrl, refSummary, prompt };
}
