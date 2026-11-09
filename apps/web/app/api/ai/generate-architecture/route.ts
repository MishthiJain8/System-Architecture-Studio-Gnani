import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import {
    AiArchitectureOutputSchema,
    technologyLibrary,
    protocolLibrary,
    type TechnologyDefinition,
} from "@architecture-studio/shared";

// ── Build the technology catalogue string for the system prompt ──
function buildTechCatalogue(techs: TechnologyDefinition[]): string {
    const grouped: Record<string, string[]> = {};
    for (const t of techs) {
        if (!grouped[t.category]) grouped[t.category] = [];
        grouped[t.category]!.push(t.id);
    }
    return Object.entries(grouped)
        .map(([cat, ids]) => `  [${cat}]: ${ids.join(", ")}`)
        .join("\n");
}

// ── Build the protocol list for the system prompt ───────────────
function buildProtocolList(): string {
    const ids = protocolLibrary.map((p) => p.id);
    return ids.join(", ");
}

// ── System prompt that makes the AI produce correct architectures ──
function buildSystemPrompt(techs: TechnologyDefinition[]): string {
    return `You are a SENIOR SYSTEMS ARCHITECT for Architecture Studio, a visual system-design tool.

Given the user's natural-language description, design a PRODUCTION-GRADE, architecturally correct system architecture.

═══════════════════════════════════════════════
AVAILABLE TECHNOLOGIES (PREFER THESE — only create new ones if the user explicitly mentions a technology not listed here):
${buildTechCatalogue(techs)}

AVAILABLE PROTOCOLS (PREFER THESE):
${buildProtocolList()}
═══════════════════════════════════════════════

ARCHITECTURAL RULES (STRICTLY ENFORCED — violating these produces broken designs):
1. Clients CANNOT connect directly to databases or caches — always route through services
2. Databases CANNOT initiate outbound requests — they only reply
3. Caches CANNOT initiate requests to clients
4. Network components (load balancers) CANNOT connect directly to databases — route through services
5. Message queues CANNOT connect directly to databases — a worker/consumer service must sit between
6. Always place load balancers or API gateways between clients and backend services
7. Every node MUST be connected — no orphan nodes

LOGIC STEP RULES (CRITICAL — this defines what each node ACTUALLY DOES):
Every node MUST have logicSteps that model its REAL-WORLD behavior. 
CRITICAL RULE: The simulation engine is BIDIRECTIONAL. If a node receives a request, it MUST have a 'reply' step to send the response back to the caller! If you omit the 'reply' step, the packet gets stuck in a routing black hole and the simulation breaks.

• Load Balancer / API Gateway:
  - forward(always) → downstream service(s)
  - reply(on-success) — pass successful responses back up to client
  - reply(on-error) — pass errors back up to client
  - MUST set routingStrategy to "load-balance"

• Application Service / Microservice / API:
  - forward(always) → downstream dependencies (cache, DB, queue)
  - reply(always) or reply(on-success) — YOU MUST PASS THE RESPONSE BACK UPSTREAM TO THE CALLER!
  - reply(on-error) — pass errors back upstream
  - MUST set routingStrategy to "broadcast" (default)

• Cache (Redis, Memcached, etc.):
  - simulate-cache with hitRate (70-95% is realistic)
  - reply(on-hit) — return cached data immediately back to caller
  - forward(on-miss) → the backing database
  - reply(on-success) — pass DB response back upstream to caller

• Database (PostgreSQL, MongoDB, etc.):
  - reply(always) — process query and RETURN DATA BACK TO CALLER! (Do not omit this!)

• Message Queue / Event Stream (Kafka, RabbitMQ, etc.):
  - forward(always) → consumer/worker service(s) for each subscriber
  - reply(on-success) — ACK back to the publisher

• CDN:
  - simulate-cache with hitRate (90-99%)
  - reply(on-hit) — serve from edge
  - forward(on-miss) → origin server
  - reply(on-success) — pass origin response back to client

• Auth Service:
  - reply(always) or reply(on-success) → return auth result to caller

• Worker / Background Service:
  - forward(always) → result destination (like a DB)
  - reply(always) → YOU MUST ACKNOWLEDGE THE QUEUE MESSAGE by replying to the caller (the queue)!

IMPORTANT: targetNodeId in logicSteps MUST reference another node's id that this node connects to via an edge in your output.

REALISTIC LATENCY & PROCESSING DELAY RULES (CRITICAL):
You MUST fill in the \`latency\` object and \`processingDelay\` for EVERY node to mathematically model its physical behavior!
• processingDelay: Base milliseconds a node spends processing before routing/replying. (e.g. API Gateway=5ms, heavy ML model=1500ms, DB=15ms, Redis=1ms).
• latency.workload: Choose "light", "normal", or "heavy". (e.g. Analytics DB is "heavy", CDN is "light").
• latency.networkHops: Number of network jumps to reach this node (e.g. CDN=1, Internal DB=0).
• latency.concurrency: Multiplier for concurrent load (default 1).
• latency.nodeOverrideMs: Absolute latency floor minimum added delay in ms.
• latency.cacheHitRate: Global cache hit rate (0-100) for cache components.

REALISTIC HARDWARE RULES (CRITICAL):
You MUST define realistic \`hardware\` (cpuCores and memoryMb) and \`bandwidthCapacity\` for every infrastructure node (do not define for boundary/client nodes).
• API Gateway / Load Balancer: 4-8 cores, 2048-4096 MB memory, 100000 Kbps bandwidth.
• Microservices / App Servers: 2-4 cores, 1024-2048 MB memory, 10000 Kbps bandwidth.
• Databases (PostgreSQL, MySQL): 8-16 cores, 8192-32768 MB memory, 50000 Kbps bandwidth.
• In-Memory Caches (Redis): 2-4 cores, 4096-16384 MB memory, 100000 Kbps bandwidth.
• Message Brokers (Kafka, RabbitMQ): 4-8 cores, 4096-8192 MB memory, 100000 Kbps bandwidth.
• AI/ML Inference: 16-32 cores, 16384-65536 MB memory, 10000 Kbps bandwidth.

WIRE / EDGE RULES:
• event = descriptive name of what travels on this wire (e.g., "HTTP GET /api/users", "order.created", "Cache Lookup user:123")
• protocol = communication protocol used (e.g., "REST", "gRPC", "Kafka", "WebSocket", "SQL", "Redis (RESP)")
• edgeStyle = "bezier" for synchronous connections, "step" for async/queue connections

NEW TECHNOLOGY FORMAT:
If you MUST use a technology not in the available list:
• id must be kebab-case (e.g., "scylladb")
• Include ALL 8 info fields with DETAILED, ACCURATE technical descriptions
• color should be the technology's brand color as hex

NEW PROTOCOL FORMAT:
If you MUST use a protocol not in the available list:
• Include ALL fields with accurate technical descriptions

OUTPUT QUALITY:
• Design for real-world production use — not toy examples
• Include proper error handling paths where appropriate (on-error conditions)
• Use realistic cache hit rates based on the use case
• Choose protocols that match real-world usage (REST for external APIs, gRPC for internal microservices, Kafka for event streaming, etc.)
• Every node must do REAL WORK — not just pass through`;
}

export async function POST(request: Request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (err) {
            // This happens when the request is aborted by the client
            return NextResponse.json({ error: "Request aborted or invalid JSON" }, { status: 400 });
        }
        const { prompt } = body;

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 },
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 },
            );
        }

        const model = process.env.AI_MODEL || "gemini-3.1-pro-preview";

        const google = createGoogleGenerativeAI({ apiKey });

        const systemPrompt = buildSystemPrompt(technologyLibrary);

        const { object } = await generateObject({
            model: google(model),
            schema: AiArchitectureOutputSchema as any,
            system: systemPrompt,
            prompt: `Design the following architecture:\n\n${prompt.trim()}`,

            maxRetries: 0,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("AI Architecture generation failed:", error);
        
        let statusCode = 500;
        let errorMessage = "Unknown error occurred";
        
        if (error?.message?.includes("Quota exceeded") || error?.message?.includes("429")) {
            statusCode = 429;
            errorMessage = "You have exceeded your Gemini API free tier quota or rate limits. Please wait a moment and try again, or use a different API key.";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: `Generation failed: ${errorMessage}` },
            { status: statusCode },
        );
    }
}
