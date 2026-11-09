export type TechnologyCategory =
    | 'client'
    | 'network'
    | 'service'
    | 'data'
    | 'messaging'
    | 'cache'
    | 'storage'
    | 'compute'
    | 'observability'
    | 'security'
    | 'boundary';

export type LatencyWorkload = 'light' | 'normal' | 'heavy';

export interface LatencyProfile {
    id: string;
    label: string;
    baseMs: number;
    p95Ms: number;
    networkHopMs: number;
    cacheHitMs: number;
    cacheMissMs: number;
    readMs: number;
    writeMs: number;
    asyncMs: number;
}

export interface TechnologyDefinition {
    id: string;
    label: string;
    category: TechnologyCategory;
    color: string;
    description: string;
    latencyProfileId?: string;
}

export const latencyProfiles: Record<string, LatencyProfile> = {
    client: {
        id: 'client',
        label: 'Client',
        baseMs: 8,
        p95Ms: 40,
        networkHopMs: 35,
        cacheHitMs: 2,
        cacheMissMs: 4,
        readMs: 0,
        writeMs: 0,
        asyncMs: 0,
    },
    network: {
        id: 'network',
        label: 'Network',
        baseMs: 4,
        p95Ms: 20,
        networkHopMs: 12,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 0,
        writeMs: 0,
        asyncMs: 0,
    },
    service: {
        id: 'service',
        label: 'Application service',
        baseMs: 35,
        p95Ms: 180,
        networkHopMs: 8,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 12,
        writeMs: 18,
        asyncMs: 0,
    },
    data: {
        id: 'data',
        label: 'Database',
        baseMs: 24,
        p95Ms: 220,
        networkHopMs: 10,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 45,
        writeMs: 70,
        asyncMs: 0,
    },
    cache: {
        id: 'cache',
        label: 'Cache',
        baseMs: 2,
        p95Ms: 12,
        networkHopMs: 4,
        cacheHitMs: 2,
        cacheMissMs: 8,
        readMs: 0,
        writeMs: 4,
        asyncMs: 0,
    },
    messaging: {
        id: 'messaging',
        label: 'Message broker',
        baseMs: 12,
        p95Ms: 90,
        networkHopMs: 8,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 0,
        writeMs: 0,
        asyncMs: 35,
    },
    storage: {
        id: 'storage',
        label: 'Object or block storage',
        baseMs: 45,
        p95Ms: 450,
        networkHopMs: 15,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 85,
        writeMs: 120,
        asyncMs: 0,
    },
    compute: {
        id: 'compute',
        label: 'Compute',
        baseMs: 25,
        p95Ms: 160,
        networkHopMs: 6,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 10,
        writeMs: 15,
        asyncMs: 0,
    },
    security: {
        id: 'security',
        label: 'Security service',
        baseMs: 20,
        p95Ms: 120,
        networkHopMs: 10,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 0,
        writeMs: 0,
        asyncMs: 0,
    },
    observability: {
        id: 'observability',
        label: 'Observability',
        baseMs: 3,
        p95Ms: 20,
        networkHopMs: 5,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 0,
        writeMs: 0,
        asyncMs: 0,
    },
    default: {
        id: 'default',
        label: 'Component',
        baseMs: 20,
        p95Ms: 120,
        networkHopMs: 10,
        cacheHitMs: 0,
        cacheMissMs: 0,
        readMs: 10,
        writeMs: 15,
        asyncMs: 0,
    },
};

const technologyProfileOverrides: Record<string, Partial<LatencyProfile>> = {
    redis: {
        baseMs: 1,
        p95Ms: 8,
        networkHopMs: 2,
        cacheHitMs: 1,
        cacheMissMs: 5,
        writeMs: 2,
    },
    memcached: {
        baseMs: 1,
        p95Ms: 6,
        networkHopMs: 2,
        cacheHitMs: 1,
        cacheMissMs: 4,
        writeMs: 2,
    },
    postgresql: { baseMs: 18, p95Ms: 180, readMs: 35, writeMs: 65 },
    mongodb: { baseMs: 20, p95Ms: 210, readMs: 40, writeMs: 75 },
    dynamodb: {
        baseMs: 8,
        p95Ms: 80,
        networkHopMs: 8,
        readMs: 12,
        writeMs: 20,
    },
    kafka: { baseMs: 8, p95Ms: 70, asyncMs: 25 },
    rabbitmq: { baseMs: 10, p95Ms: 80, asyncMs: 30 },
    'object-storage': { baseMs: 55, p95Ms: 500, readMs: 100, writeMs: 140 },
    'llm-provider': {
        baseMs: 400,
        p95Ms: 2500,
        networkHopMs: 35,
        readMs: 0,
        writeMs: 0,
    },
    'serverless-function': { baseMs: 80, p95Ms: 500, networkHopMs: 15 },
    'edge-function': { baseMs: 12, p95Ms: 80, networkHopMs: 4 },
    'workflow-engine': { baseMs: 25, p95Ms: 180, asyncMs: 40 },
    'wasm-runtime': { baseMs: 8, p95Ms: 45, networkHopMs: 3 },
    planetscale: { baseMs: 18, p95Ms: 180, readMs: 35, writeMs: 65 },
    turso: { baseMs: 10, p95Ms: 110, networkHopMs: 8, readMs: 18, writeMs: 30 },
    pinecone: { baseMs: 35, p95Ms: 300, networkHopMs: 20, readMs: 70 },
    weaviate: { baseMs: 30, p95Ms: 280, networkHopMs: 15, readMs: 60 },
    redpanda: { baseMs: 7, p95Ms: 60, asyncMs: 22 },
    temporal: { baseMs: 20, p95Ms: 160, asyncMs: 35 },
    keydb: {
        baseMs: 1,
        p95Ms: 7,
        networkHopMs: 2,
        cacheHitMs: 1,
        cacheMissMs: 5,
        writeMs: 2,
    },
    'cloudflare-kv': {
        baseMs: 5,
        p95Ms: 50,
        networkHopMs: 3,
        cacheHitMs: 4,
        cacheMissMs: 12,
    },
    'archive-storage': {
        baseMs: 250,
        p95Ms: 3000,
        networkHopMs: 20,
        readMs: 500,
        writeMs: 300,
    },
    jaeger: { baseMs: 8, p95Ms: 60, networkHopMs: 5 },
    'api-management': { baseMs: 12, p95Ms: 80, networkHopMs: 6 },
    'service-discovery': { baseMs: 4, p95Ms: 30, networkHopMs: 3 },
    'global-accelerator': { baseMs: 8, p95Ms: 40, networkHopMs: 3 },
    'cloud-network': { baseMs: 5, p95Ms: 35, networkHopMs: 4 },
    'nextjs-app': { baseMs: 35, p95Ms: 220, networkHopMs: 8 },
    'spring-boot-service': { baseMs: 45, p95Ms: 250, networkHopMs: 8 },
    'container-service': { baseMs: 30, p95Ms: 180, networkHopMs: 6 },
    'api-rate-limiter': { baseMs: 4, p95Ms: 30, networkHopMs: 3 },
    yugabytedb: { baseMs: 25, p95Ms: 240, readMs: 50, writeMs: 85 },
    tidb: { baseMs: 22, p95Ms: 220, readMs: 45, writeMs: 75 },
    neon: { baseMs: 22, p95Ms: 240, networkHopMs: 12, readMs: 45, writeMs: 75 },
    duckdb: { baseMs: 5, p95Ms: 80, readMs: 20, writeMs: 30 },
    qdrant: { baseMs: 25, p95Ms: 220, readMs: 55 },
    milvus: { baseMs: 35, p95Ms: 350, readMs: 90 },
    'supabase-storage': { baseMs: 50, p95Ms: 450, readMs: 90, writeMs: 120 },
    'azure-service-bus': { baseMs: 18, p95Ms: 130, asyncMs: 45 },
    mosquitto: { baseMs: 4, p95Ms: 35, asyncMs: 12 },
    redisson: { baseMs: 3, p95Ms: 25, asyncMs: 10 },
    dragonfly: {
        baseMs: 1,
        p95Ms: 7,
        networkHopMs: 2,
        cacheHitMs: 1,
        cacheMissMs: 5,
        writeMs: 2,
    },
    valkey: {
        baseMs: 1,
        p95Ms: 8,
        networkHopMs: 2,
        cacheHitMs: 1,
        cacheMissMs: 5,
        writeMs: 2,
    },
    'google-cloud-storage': {
        baseMs: 55,
        p95Ms: 500,
        readMs: 100,
        writeMs: 140,
    },
    'azure-blob': { baseMs: 55, p95Ms: 500, readMs: 100, writeMs: 140 },
    minio: { baseMs: 30, p95Ms: 280, networkHopMs: 8, readMs: 65, writeMs: 90 },
    ceph: {
        baseMs: 40,
        p95Ms: 400,
        networkHopMs: 12,
        readMs: 80,
        writeMs: 110,
    },
    'grafana-loki': { baseMs: 12, p95Ms: 90, networkHopMs: 5 },
    'grafana-tempo': { baseMs: 12, p95Ms: 90, networkHopMs: 5 },
    opensearch: { baseMs: 30, p95Ms: 250, readMs: 60, writeMs: 80 },
    'fluent-bit': { baseMs: 3, p95Ms: 25, networkHopMs: 4 },
    'ory-hydra': { baseMs: 25, p95Ms: 180, networkHopMs: 8 },
    zitadel: { baseMs: 25, p95Ms: 180, networkHopMs: 8 },
    'spiffe-spire': { baseMs: 15, p95Ms: 100, networkHopMs: 6 },
};

export function resolveLatencyProfile(
    technology: TechnologyDefinition,
): LatencyProfile {
    const base =
        latencyProfiles[technology.category] ?? latencyProfiles.default!;
    const override =
        technologyProfileOverrides[
            technology.latencyProfileId ?? technology.id
        ];
    return {
        id: technology.latencyProfileId ?? technology.id,
        label: override?.label ?? base.label,
        baseMs: override?.baseMs ?? base.baseMs,
        p95Ms: override?.p95Ms ?? base.p95Ms,
        networkHopMs: override?.networkHopMs ?? base.networkHopMs,
        cacheHitMs: override?.cacheHitMs ?? base.cacheHitMs,
        cacheMissMs: override?.cacheMissMs ?? base.cacheMissMs,
        readMs: override?.readMs ?? base.readMs,
        writeMs: override?.writeMs ?? base.writeMs,
        asyncMs: override?.asyncMs ?? base.asyncMs,
    };
}

// ── Runtime Technology Registry ───────────────────────────────
// The library is mutable so AI-discovered technologies can be
// registered at runtime and appear in the palette immediately.

export let technologyLibrary: TechnologyDefinition[] = [
    // ?? Client ??
    {
        id: 'web-client',
        label: 'Web Client',
        category: 'client',
        color: '#ffde59',
        description: 'Browser or SPA (React, Vue, Angular)',
    },
    {
        id: 'mobile-app',
        label: 'Mobile App',
        category: 'client',
        color: '#ffde59',
        description: 'iOS / Android native application',
    },
    {
        id: 'desktop-app',
        label: 'Desktop App',
        category: 'client',
        color: '#ffde59',
        description: 'Electron / Tauri / Native desktop client',
    },
    {
        id: 'iot-device',
        label: 'IoT Device',
        category: 'client',
        color: '#ffde59',
        description: 'Sensor, edge device, or embedded system',
    },
    {
        id: 'cli-tool',
        label: 'CLI Tool',
        category: 'client',
        color: '#ffde59',
        description: 'Terminal-based client interface',
    },
    {
        id: 'smart-tv',
        label: 'Smart TV',
        category: 'client',
        color: '#ffde59',
        description: 'Roku, tvOS, Android TV application',
    },
    {
        id: 'wearable',
        label: 'Wearable',
        category: 'client',
        color: '#ffde59',
        description: 'Smartwatch or fitness tracker',
    },
    {
        id: 'kiosk',
        label: 'Kiosk',
        category: 'client',
        color: '#ffde59',
        description: 'Public terminal or POS system',
    },
    {
        id: 'third-party',
        label: '3rd Party API',
        category: 'client',
        color: '#ffde59',
        description: 'External service webhook or caller',
    },
    {
        id: 'b2b-partner',
        label: 'B2B Partner',
        category: 'client',
        color: '#ffde59',
        description: 'Enterprise integration partner',
    },

    // ?? Network / Infrastructure ??
    {
        id: 'load-balancer',
        label: 'Load Balancer',
        category: 'network',
        color: '#5de2e7',
        description: 'AWS ALB, NGINX, HAProxy',
    },
    {
        id: 'api-gateway',
        label: 'API Gateway',
        category: 'network',
        color: '#5de2e7',
        description: 'Kong, AWS API Gateway, Apigee',
    },
    {
        id: 'reverse-proxy',
        label: 'Reverse Proxy',
        category: 'network',
        color: '#5de2e7',
        description: 'Nginx / Envoy / Traefik traffic proxy',
    },
    {
        id: 'cdn',
        label: 'CDN',
        category: 'network',
        color: '#5de2e7',
        description: 'Cloudflare, Fastly, CloudFront',
    },
    {
        id: 'dns-server',
        label: 'DNS Server',
        category: 'network',
        color: '#5de2e7',
        description: 'Route53, Cloudflare DNS, BIND',
    },
    {
        id: 'firewall',
        label: 'WAF / Firewall',
        category: 'network',
        color: '#5de2e7',
        description: 'Network-level traffic filter / WAF',
    },
    {
        id: 'service-mesh',
        label: 'Service Mesh',
        category: 'network',
        color: '#5de2e7',
        description: 'Istio / Linkerd sidecar proxy mesh',
    },
    {
        id: 'vpn-gateway',
        label: 'VPN Gateway',
        category: 'network',
        color: '#5de2e7',
        description: 'Secure internal network access (Tailscale/OpenVPN)',
    },
    {
        id: 'vpc',
        label: 'VPC',
        category: 'network',
        color: '#5de2e7',
        description: 'Virtual Private Cloud network boundary',
    },
    {
        id: 'nat-gateway',
        label: 'NAT Gateway',
        category: 'network',
        color: '#5de2e7',
        description: 'Outbound internet access for private subnets',
    },
    {
        id: 'router-switch',
        label: 'Router/Switch',
        category: 'network',
        color: '#5de2e7',
        description: 'Physical or virtual network routing',
    },
    {
        id: 'api-management',
        label: 'API Management',
        category: 'network',
        color: '#5de2e7',
        description:
            'Managed API lifecycle, policy, quota, and developer portal',
    },
    {
        id: 'service-discovery',
        label: 'Service Discovery',
        category: 'network',
        color: '#5de2e7',
        description: 'Registry for locating healthy service instances',
    },
    {
        id: 'global-accelerator',
        label: 'Global Accelerator',
        category: 'network',
        color: '#5de2e7',
        description: 'Anycast traffic acceleration across regions',
    },
    {
        id: 'cloud-network',
        label: 'Cloud Network',
        category: 'network',
        color: '#5de2e7',
        description: 'Cloud routing, peering, and private connectivity layer',
    },

    // ?? Services / Compute ??
    {
        id: 'api-service',
        label: 'REST API',
        category: 'service',
        color: '#ff4fa3',
        description: 'Node.js, Spring Boot, Go, Python API',
    },
    {
        id: 'microservice',
        label: 'Microservice',
        category: 'service',
        color: '#ff4fa3',
        description: 'Single-responsibility bounded-context service',
    },
    {
        id: 'grpc-service',
        label: 'gRPC Service',
        category: 'service',
        color: '#ff4fa3',
        description: 'High-performance protobuf RPC service',
    },
    {
        id: 'graphql-server',
        label: 'GraphQL Server',
        category: 'service',
        color: '#ff4fa3',
        description: 'Apollo / Hasura / AppSync',
    },
    {
        id: 'websocket-server',
        label: 'WebSocket Server',
        category: 'service',
        color: '#ff4fa3',
        description: 'Socket.io, SignalR persistent connection',
    },
    {
        id: 'serverless-function',
        label: 'Serverless Func',
        category: 'service',
        color: '#ff4fa3',
        description: 'AWS Lambda / Cloud Function',
    },
    {
        id: 'worker-service',
        label: 'Worker Service',
        category: 'service',
        color: '#ff4fa3',
        description: 'Celery, Sidekiq background job processor',
    },
    {
        id: 'cron-scheduler',
        label: 'Cron Scheduler',
        category: 'service',
        color: '#ff4fa3',
        description: 'Time-based job scheduler',
    },
    {
        id: 'bff',
        label: 'BFF',
        category: 'service',
        color: '#ff4fa3',
        description: 'Backend-for-Frontend aggregation layer',
    },
    {
        id: 'edge-function',
        label: 'Edge Function',
        category: 'service',
        color: '#ff4fa3',
        description: 'Low-latency code running close to users at the edge',
    },
    {
        id: 'workflow-engine',
        label: 'Workflow Engine',
        category: 'service',
        color: '#ff4fa3',
        description: 'Durable orchestration for long-running workflows',
    },
    {
        id: 'wasm-runtime',
        label: 'Wasm Runtime',
        category: 'compute',
        color: '#ff4fa3',
        description: 'Portable WebAssembly runtime for sandboxed compute',
    },
    {
        id: 'auth-service',
        label: 'Auth Service',
        category: 'service',
        color: '#ff4fa3',
        description: 'Authentication and authorization service',
    },
    {
        id: 'notification-service',
        label: 'Notification Svc',
        category: 'service',
        color: '#ff4fa3',
        description: 'Email / SMS / push notification dispatcher',
    },
    {
        id: 'search-service',
        label: 'Search Service',
        category: 'service',
        color: '#ff4fa3',
        description: 'Elasticsearch / Meilisearch backend',
    },
    {
        id: 'ml-inference',
        label: 'ML Inference',
        category: 'service',
        color: '#ff4fa3',
        description: 'TensorFlow Serving, PyTorch inference endpoint',
    },
    {
        id: 'llm-provider',
        label: 'LLM Model',
        category: 'service',
        color: '#ff4fa3',
        description: 'OpenAI, Anthropic, Llama, HuggingFace',
    },
    {
        id: 'payment-gateway',
        label: 'Payment Gateway',
        category: 'service',
        color: '#ff4fa3',
        description: 'Stripe, PayPal integration layer',
    },
    {
        id: 'video-transcoder',
        label: 'Video Transcoder',
        category: 'service',
        color: '#ff4fa3',
        description: 'FFmpeg, AWS MediaConvert service',
    },
    {
        id: 'docker-container',
        label: 'Docker Container',
        category: 'service',
        color: '#ff4fa3',
        description: 'Standalone containerized process',
    },
    {
        id: 'k8s-pod',
        label: 'Kubernetes Pod',
        category: 'service',
        color: '#ff4fa3',
        description: 'K8s managed deployment unit',
    },
    {
        id: 'batch-processor',
        label: 'Batch Processor',
        category: 'service',
        color: '#ff4fa3',
        description: 'Spark, Hadoop, AWS Glue batch job',
    },
    {
        id: 'nextjs-app',
        label: 'Next.js App',
        category: 'service',
        color: '#ff4fa3',
        description: 'Full-stack React application with server rendering',
    },
    {
        id: 'spring-boot-service',
        label: 'Spring Boot',
        category: 'service',
        color: '#ff4fa3',
        description: 'JVM service for enterprise APIs and workloads',
    },
    {
        id: 'container-service',
        label: 'Container Service',
        category: 'compute',
        color: '#ff4fa3',
        description: 'Managed container deployment and scheduling platform',
    },
    {
        id: 'api-rate-limiter',
        label: 'Rate Limiter',
        category: 'service',
        color: '#ff4fa3',
        description: 'Protects services with quotas and request throttling',
    },

    // ??? Data Stores ???
    {
        id: 'postgresql',
        label: 'PostgreSQL',
        category: 'data',
        color: '#a18cff',
        description: 'Relational database (ACID, JSONB)',
    },
    {
        id: 'mysql',
        label: 'MySQL / MariaDB',
        category: 'data',
        color: '#a18cff',
        description: 'Popular open-source relational database',
    },
    {
        id: 'sql-server',
        label: 'SQL Server',
        category: 'data',
        color: '#a18cff',
        description: 'Microsoft relational database',
    },
    {
        id: 'oracle-db',
        label: 'Oracle DB',
        category: 'data',
        color: '#a18cff',
        description: 'Enterprise relational database',
    },
    {
        id: 'mongodb',
        label: 'MongoDB',
        category: 'data',
        color: '#a18cff',
        description: 'Document-oriented NoSQL database',
    },
    {
        id: 'dynamodb',
        label: 'DynamoDB',
        category: 'data',
        color: '#a18cff',
        description: 'AWS managed key-value / document store',
    },
    {
        id: 'cassandra',
        label: 'Cassandra',
        category: 'data',
        color: '#a18cff',
        description: 'Wide-column distributed database',
    },
    {
        id: 'elasticsearch',
        label: 'Elasticsearch',
        category: 'data',
        color: '#a18cff',
        description: 'Full-text search and analytics engine',
    },
    {
        id: 'neo4j',
        label: 'Neo4j',
        category: 'data',
        color: '#a18cff',
        description: 'Graph database (Cypher queries)',
    },
    {
        id: 'clickhouse',
        label: 'ClickHouse',
        category: 'data',
        color: '#a18cff',
        description: 'Columnar OLAP analytics database',
    },
    {
        id: 'sqlite',
        label: 'SQLite',
        category: 'data',
        color: '#a18cff',
        description: 'Embedded file-based relational database',
    },
    {
        id: 'redis-db',
        label: 'Redis DB',
        category: 'data',
        color: '#a18cff',
        description: 'Redis used as primary database',
    },
    {
        id: 'cockroachdb',
        label: 'CockroachDB',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed SQL database',
    },
    {
        id: 'timescaledb',
        label: 'TimescaleDB',
        category: 'data',
        color: '#a18cff',
        description: 'Time-series database built on Postgres',
    },
    {
        id: 'influxdb',
        label: 'InfluxDB',
        category: 'data',
        color: '#a18cff',
        description: 'Time-series database',
    },
    {
        id: 'snowflake',
        label: 'Snowflake',
        category: 'data',
        color: '#a18cff',
        description: 'Cloud data warehouse',
    },
    {
        id: 'bigquery',
        label: 'BigQuery',
        category: 'data',
        color: '#a18cff',
        description: 'Google Cloud data warehouse',
    },
    {
        id: 'redshift',
        label: 'Redshift',
        category: 'data',
        color: '#a18cff',
        description: 'AWS data warehouse',
    },
    {
        id: 'cosmosdb',
        label: 'Cosmos DB',
        category: 'data',
        color: '#a18cff',
        description: 'Azure multi-model database',
    },
    {
        id: 'firebase',
        label: 'Firebase',
        category: 'data',
        color: '#a18cff',
        description: 'Realtime Database / Firestore',
    },
    {
        id: 'supabase',
        label: 'Supabase',
        category: 'data',
        color: '#a18cff',
        description: 'Open source Firebase alternative',
    },
    {
        id: 'couchbase',
        label: 'Couchbase',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed NoSQL document database',
    },
    {
        id: 'planetscale',
        label: 'PlanetScale',
        category: 'data',
        color: '#a18cff',
        description: 'Managed MySQL-compatible serverless database',
    },
    {
        id: 'turso',
        label: 'Turso',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed SQLite database for edge applications',
    },
    {
        id: 'pinecone',
        label: 'Pinecone',
        category: 'data',
        color: '#a18cff',
        description: 'Managed vector database for semantic search',
    },
    {
        id: 'weaviate',
        label: 'Weaviate',
        category: 'data',
        color: '#a18cff',
        description: 'Open-source vector database with hybrid search',
    },
    {
        id: 'yugabytedb',
        label: 'YugabyteDB',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed PostgreSQL-compatible SQL database',
    },
    {
        id: 'tidb',
        label: 'TiDB',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed MySQL-compatible SQL database',
    },
    {
        id: 'neon',
        label: 'Neon',
        category: 'data',
        color: '#a18cff',
        description: 'Serverless PostgreSQL with separated compute and storage',
    },
    {
        id: 'duckdb',
        label: 'DuckDB',
        category: 'data',
        color: '#a18cff',
        description:
            'Embedded analytical SQL database for local and batch workloads',
    },
    {
        id: 'qdrant',
        label: 'Qdrant',
        category: 'data',
        color: '#a18cff',
        description: 'Vector similarity search engine with filtering',
    },
    {
        id: 'milvus',
        label: 'Milvus',
        category: 'data',
        color: '#a18cff',
        description: 'Distributed vector database for AI workloads',
    },
    {
        id: 'supabase-storage',
        label: 'Supabase Storage',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Object storage integrated with Supabase applications',
    },

    // ?? Messaging / Event Streaming ??
    {
        id: 'event-queue',
        label: 'Event Queue',
        category: 'messaging',
        color: '#ffad66',
        description: 'Generic asynchronous message queue',
    },
    {
        id: 'kafka',
        label: 'Kafka',
        category: 'messaging',
        color: '#ffad66',
        description: 'Distributed event streaming platform',
    },
    {
        id: 'rabbitmq',
        label: 'RabbitMQ',
        category: 'messaging',
        color: '#ffad66',
        description: 'AMQP message broker with routing',
    },
    {
        id: 'nats',
        label: 'NATS',
        category: 'messaging',
        color: '#ffad66',
        description: 'Lightweight cloud-native messaging',
    },
    {
        id: 'sqs',
        label: 'AWS SQS',
        category: 'messaging',
        color: '#ffad66',
        description: 'Managed message queue service',
    },
    {
        id: 'sns',
        label: 'AWS SNS',
        category: 'messaging',
        color: '#ffad66',
        description: 'Managed pub/sub notification service',
    },
    {
        id: 'pubsub',
        label: 'GCP Pub/Sub',
        category: 'messaging',
        color: '#ffad66',
        description: 'Google Cloud publish-subscribe system',
    },
    {
        id: 'redis-streams',
        label: 'Redis Streams',
        category: 'messaging',
        color: '#ffad66',
        description: 'Append-only log with consumer groups',
    },
    {
        id: 'kinesis',
        label: 'Kinesis',
        category: 'messaging',
        color: '#ffad66',
        description: 'AWS real-time data streaming',
    },
    {
        id: 'eventbridge',
        label: 'EventBridge',
        category: 'messaging',
        color: '#ffad66',
        description: 'Serverless event bus',
    },
    {
        id: 'activemq',
        label: 'ActiveMQ',
        category: 'messaging',
        color: '#ffad66',
        description: 'Multi-protocol messaging server',
    },
    {
        id: 'pulsar',
        label: 'Apache Pulsar',
        category: 'messaging',
        color: '#ffad66',
        description: 'Cloud-native distributed messaging',
    },
    {
        id: 'zeromq',
        label: 'ZeroMQ',
        category: 'messaging',
        color: '#ffad66',
        description: 'High-performance async messaging library',
    },
    {
        id: 'redpanda',
        label: 'Redpanda',
        category: 'messaging',
        color: '#ffad66',
        description: 'Kafka-compatible streaming platform',
    },
    {
        id: 'temporal',
        label: 'Temporal',
        category: 'messaging',
        color: '#ffad66',
        description: 'Durable workflow and activity orchestration',
    },
    {
        id: 'azure-service-bus',
        label: 'Azure Service Bus',
        category: 'messaging',
        color: '#ffad66',
        description: 'Managed enterprise queues and topics',
    },
    {
        id: 'mosquitto',
        label: 'Mosquitto MQTT',
        category: 'messaging',
        color: '#ffad66',
        description: 'Lightweight MQTT broker for IoT messaging',
    },
    {
        id: 'redisson',
        label: 'Redis Pub/Sub',
        category: 'messaging',
        color: '#ffad66',
        description: 'Low-latency publish-subscribe messaging',
    },

    // ? Cache ?
    {
        id: 'redis',
        label: 'Redis Cache',
        category: 'cache',
        color: '#9cf57a',
        description: 'In-memory key-value cache',
    },
    {
        id: 'memcached',
        label: 'Memcached',
        category: 'cache',
        color: '#9cf57a',
        description: 'Distributed memory caching system',
    },
    {
        id: 'cdn-cache',
        label: 'CDN Cache',
        category: 'cache',
        color: '#9cf57a',
        description: 'Edge-layer HTTP response cache',
    },
    {
        id: 'varnish',
        label: 'Varnish',
        category: 'cache',
        color: '#9cf57a',
        description: 'HTTP accelerator and reverse proxy cache',
    },
    {
        id: 'hazelcast',
        label: 'Hazelcast',
        category: 'cache',
        color: '#9cf57a',
        description: 'In-memory data grid',
    },
    {
        id: 'keydb',
        label: 'KeyDB',
        category: 'cache',
        color: '#9cf57a',
        description: 'Multithreaded Redis-compatible in-memory database',
    },
    {
        id: 'cloudflare-kv',
        label: 'Cloudflare KV',
        category: 'cache',
        color: '#9cf57a',
        description: 'Globally distributed edge key-value storage',
    },
    {
        id: 'dragonfly',
        label: 'Dragonfly',
        category: 'cache',
        color: '#9cf57a',
        description: 'High-performance Redis and Memcached-compatible cache',
    },
    {
        id: 'valkey',
        label: 'Valkey',
        category: 'cache',
        color: '#9cf57a',
        description: 'Open-source Redis-compatible in-memory data store',
    },

    // ?? Storage ??
    {
        id: 'object-storage',
        label: 'S3 / Blob',
        category: 'storage',
        color: '#ff6b6b',
        description: 'AWS S3 / GCS / Azure Blob object storage',
    },
    {
        id: 'block-storage',
        label: 'EBS / Block',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Block-level storage volume',
    },
    {
        id: 'file-storage',
        label: 'EFS / NFS',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Network file system storage',
    },
    {
        id: 'nas-san',
        label: 'NAS / SAN',
        category: 'storage',
        color: '#ff6b6b',
        description: 'On-premise network attached storage',
    },
    {
        id: 'hdfs',
        label: 'HDFS',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Hadoop distributed file system',
    },
    {
        id: 'archive-storage',
        label: 'Archive Storage',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Cold tier for long-term, infrequently accessed data',
    },
    {
        id: 'google-cloud-storage',
        label: 'Google Cloud Storage',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Google Cloud object storage service',
    },
    {
        id: 'azure-blob',
        label: 'Azure Blob Storage',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Azure object storage for unstructured data',
    },
    {
        id: 'minio',
        label: 'MinIO',
        category: 'storage',
        color: '#ff6b6b',
        description: 'S3-compatible object storage for private infrastructure',
    },
    {
        id: 'ceph',
        label: 'Ceph',
        category: 'storage',
        color: '#ff6b6b',
        description: 'Distributed object, block, and file storage platform',
    },

    // ?? Observability ??
    {
        id: 'datadog',
        label: 'Datadog',
        category: 'observability',
        color: '#d91570',
        description: 'Monitoring and security platform',
    },
    {
        id: 'new-relic',
        label: 'New Relic',
        category: 'observability',
        color: '#d91570',
        description: 'Full-stack observability',
    },
    {
        id: 'grafana',
        label: 'Grafana',
        category: 'observability',
        color: '#d91570',
        description: 'Metrics visualization dashboard',
    },
    {
        id: 'prometheus',
        label: 'Prometheus',
        category: 'observability',
        color: '#d91570',
        description: 'Metrics scraping and alerting',
    },
    {
        id: 'kibana',
        label: 'Kibana',
        category: 'observability',
        color: '#d91570',
        description: 'Elasticsearch data visualization',
    },
    {
        id: 'splunk',
        label: 'Splunk',
        category: 'observability',
        color: '#d91570',
        description: 'Log management and analysis',
    },
    {
        id: 'opentelemetry',
        label: 'OpenTelemetry',
        category: 'observability',
        color: '#d91570',
        description: 'Standardized tracing and metrics',
    },
    {
        id: 'jaeger',
        label: 'Jaeger',
        category: 'observability',
        color: '#d91570',
        description: 'Distributed tracing backend and UI',
    },
    {
        id: 'grafana-loki',
        label: 'Grafana Loki',
        category: 'observability',
        color: '#d91570',
        description: 'Log aggregation system optimized for labels',
    },
    {
        id: 'grafana-tempo',
        label: 'Grafana Tempo',
        category: 'observability',
        color: '#d91570',
        description: 'Distributed tracing backend for OpenTelemetry',
    },
    {
        id: 'opensearch',
        label: 'OpenSearch',
        category: 'observability',
        color: '#d91570',
        description: 'Open-source search, logs, and analytics platform',
    },
    {
        id: 'fluent-bit',
        label: 'Fluent Bit',
        category: 'observability',
        color: '#d91570',
        description: 'Lightweight telemetry and log forwarding agent',
    },

    // ?? Security ??
    {
        id: 'iam',
        label: 'IAM',
        category: 'security',
        color: '#000000',
        description: 'Identity and Access Management',
    },
    {
        id: 'active-directory',
        label: 'Active Directory',
        category: 'security',
        color: '#000000',
        description: 'Microsoft directory service',
    },
    {
        id: 'keycloak',
        label: 'Keycloak',
        category: 'security',
        color: '#000000',
        description: 'Open-source IAM and SSO',
    },
    {
        id: 'auth0',
        label: 'Auth0 / Cognito',
        category: 'security',
        color: '#000000',
        description: 'Managed identity provider',
    },
    {
        id: 'hashicorp-vault',
        label: 'Vault',
        category: 'security',
        color: '#000000',
        description: 'Secret and encryption management',
    },
    {
        id: 'ory-hydra',
        label: 'ORY Hydra',
        category: 'security',
        color: '#000000',
        description: 'OAuth 2.0 and OpenID Connect server',
    },
    {
        id: 'zitadel',
        label: 'ZITADEL',
        category: 'security',
        color: '#000000',
        description: 'Cloud-native identity and access management platform',
    },
    {
        id: 'spiffe-spire',
        label: 'SPIFFE / SPIRE',
        category: 'security',
        color: '#000000',
        description: 'Workload identity and service-to-service authentication',
    },

    // 🔲 Boundaries 🔲
    {
        id: 'boundary-vpc',
        label: 'VPC',
        category: 'boundary',
        color: '#161616',
        description: 'Virtual Private Cloud boundary',
    },
    {
        id: 'boundary-public',
        label: 'Public Subnet',
        category: 'boundary',
        color: '#9cf57a',
        description: 'Internet-facing public subnet',
    },
    {
        id: 'boundary-private',
        label: 'Private Subnet',
        category: 'boundary',
        color: '#ff6b6b',
        description: 'Isolated internal private subnet',
    },
    {
        id: 'boundary-k8s',
        label: 'K8s Cluster',
        category: 'boundary',
        color: '#5de2e7',
        description: 'Kubernetes cluster boundary',
    },
    {
        id: 'boundary-region',
        label: 'AWS Region',
        category: 'boundary',
        color: '#ffad66',
        description: 'Cloud provider region boundary',
    },
    {
        id: 'boundary-az',
        label: 'Avail. Zone',
        category: 'boundary',
        color: '#a18cff',
        description: 'Availability zone boundary',
    },
    {
    "id": "react",
    "label": "React",
    "category": "client",
    "color": "#61DAFB",
    "description": "A popular open-source JavaScript library for building declarative, component-based user interfaces."
},
    {
    "id": "aws-api-gateway",
    "label": "AWS API Gateway",
    "category": "boundary",
    "color": "#FF4F8B",
    "description": "A fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale."
},
    {
    "id": "nodejs",
    "label": "Node.js",
    "category": "compute",
    "color": "#339933",
    "description": "An open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine."
},
    {
    "id": "custom-media-server",
    "label": "Custom Media Server",
    "category": "service",
    "color": "#7209B7",
    "description": "A tailored streaming server optimized for low-latency media ingest, processing, and distribution."
},
    {
    "id": "aws-s3",
    "label": "AWS S3",
    "category": "storage",
    "color": "#E05243",
    "description": "A highly scalable, durable, and secure object storage service."
},
    {
    "id": "aws-cloudfront",
    "label": "AWS CloudFront",
    "category": "network",
    "color": "#FF9900",
    "description": "A fast, highly secure, and programmable Content Delivery Network (CDN)."
},
    {
    "id": "websocket",
    "label": "WebSocket (Web API / Library)",
    "category": "network",
    "color": "#010101",
    "description": "A technology providing full-duplex communication channels over a single TCP connection."
},
    {
    "id": "obs-studio",
    "label": "OBS Studio",
    "category": "client",
    "color": "#302c34",
    "description": "Free and open-source software for video recording and live streaming."
},
    {
    "id": "nginx",
    "label": "Nginx",
    "category": "boundary",
    "color": "#009639",
    "description": "High-performance HTTP server, reverse proxy, and load balancer."
},
    {
    "id": "nginx-rtmp",
    "label": "NGINX RTMP Module",
    "category": "network",
    "color": "#009539",
    "description": "An extension for Nginx providing media streaming capabilities via RTMP, HLS, and MPEG-DASH."
},
    {
    "id": "aws-elemental-mediaconvert",
    "label": "AWS Elemental MediaConvert",
    "category": "service",
    "color": "#FF9900",
    "description": "File-based video transcoding service with broadcast-grade features."
},
    {
    "id": "go",
    "label": "Go",
    "category": "compute",
    "color": "#00ADD8",
    "description": "Statically typed, compiled programming language designed for concurrent cloud-native software."
},

    {
    "id": "react-native",
    "label": "React Native",
    "category": "client",
    "color": "#61DAFB",
    "description": "An open-source UI framework for developing cross-platform native mobile applications."
},
    {
    "id": "cloudflare",
    "label": "Cloudflare",
    "category": "boundary",
    "color": "#F38020",
    "description": "A global cloud-based security, performance, and edge network delivery platform."
},
    {
    "id": "envoy",
    "label": "Envoy Proxy",
    "category": "network",
    "color": "#1175B9",
    "description": "A high-performance L7 proxy and communication bus designed for large microservice architectures."
},
    {
    "id": "spring-boot",
    "label": "Spring Boot",
    "category": "service",
    "color": "#6DB33F",
    "description": "A popular Java framework used to rapidly create stand-alone, production-grade microservices."
},
    {
    "id": "cpp",
    "label": "C++",
    "category": "compute",
    "color": "#00599C",
    "description": "A high-performance, general-purpose programming language emphasizing speed and precise resource management."
},
    {
    "id": "postgres",
    "label": "PostgreSQL",
    "category": "storage",
    "color": "#336791",
    "description": "A powerful, highly-extensible open-source object-relational database system."
},
    {
    "id": "apigateway",
    "label": "API Gateway",
    "category": "boundary",
    "color": "#FF6F00",
    "description": "An API gateway is an entry point for all clients, acting as a reverse proxy to route requests, composition, and protocol translation."
},
    {
    "id": "python",
    "label": "Python",
    "category": "compute",
    "color": "#3776AB",
    "description": "Python is an interpreted, high-level, general-purpose programming language known for its readability and extensive ecosystem."
},
    {
    "id": "triton-inference-server",
    "label": "Triton Inference Server",
    "category": "service",
    "color": "#76B900",
    "description": "An open-source inference serving software that standardizes model deployment and maximizes GPU utilization."
},
    {
    "id": "stockfish",
    "label": "Stockfish Engine",
    "category": "compute",
    "color": "#E3A857",
    "description": "High-performance chess engine for calculations and game analysis."
},
    {
    "id": "scylladb",
    "label": "ScyllaDB",
    "category": "data",
    "color": "#6C8EBF",
    "description": "C++ powered ultra-high performance Cassandra-compatible NoSQL database."
},
];

// ── Registry helpers for AI-discovered technologies ───────────

/** Register a new technology at runtime so it appears in the palette. */
export function registerTechnology(tech: TechnologyDefinition): void {
    if (!technologyLibrary.some((t) => t.id === tech.id)) {
        technologyLibrary = [...technologyLibrary, tech];
    }
}

/** Remove a dynamically registered technology. */
export function unregisterTechnology(id: string): void {
    technologyLibrary = technologyLibrary.filter((t) => t.id !== id);
}

/** Return the current technology library (including runtime additions). */
export function getTechnologyLibrary(): TechnologyDefinition[] {
    return technologyLibrary;
}