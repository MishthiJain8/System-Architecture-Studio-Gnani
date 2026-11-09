import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { AiSecurityReviewSchema } from "@architecture-studio/shared";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

const SYSTEM_PROMPT = `You are a SENIOR CYBERSECURITY AND SYSTEMS ARCHITECT.

You are conducting a Security Review of a system architecture. 
The user will provide a JSON representation of the architecture's nodes and edges (wires).
The edges define the connections and protocols between the nodes.
Each node also contains "logicSteps" that define how it routes data and handles cache hits/misses, and a "latency" configuration that defines its physical processing characteristics.

Your job is to identify:
1. Vulnerabilities (e.g., exposed databases, unauthenticated endpoints)
2. Single Points of Failure (SPOFs) (e.g., single master DB, single load balancer without redundancy)
3. Bottlenecks & Denial of Service Risks (e.g., synchronous chains of many services, nodes with severely high latency workloads that are vulnerable to DoS/Starvation, nodes with queue overflow risks)
4. Zero-day risks or common compliance issues (e.g., missing WAF, data not encrypted at rest)

Guidelines:
- Analyze the technologies being used and how they connect.
- Evaluate node 'latency' properties (workload, concurrency, networkHops). If a node has a heavy workload and low concurrency limit, it is highly susceptible to DoS or Starvation, especially if it doesn't have a queue in front of it.
- Evaluate node 'hardware' (cpuCores and memoryMb) and 'bandwidthCapacity'. If a database has 1 core, 512MB RAM, or very low bandwidth (e.g. 1000 Kbps), flag it as a severe performance bottleneck, OOM risk, and network starvation risk under load.
- Point out missing layers (like missing WAF, missing Cache, missing Auth).
- Be realistic and practical. Do not raise false alarms, but be thorough.
- Ensure 'affectedNodeIds' points strictly to the 'id' of nodes provided in the user's input.
- Give actionable remediations.
- Provide a summary and a 0-100 risk score (100 being extremely vulnerable).
`;

export async function POST(req: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not set" },
            { status: 500 },
        );
    }

    try {
        let body;
        try {
            body = await req.json();
        } catch (err) {
            return NextResponse.json({ error: "Request aborted or invalid JSON" }, { status: 400 });
        }
        const { nodes, edges } = body;

        if (!nodes || !edges) {
            return NextResponse.json(
                { error: "Missing nodes or edges in request body" },
                { status: 400 },
            );
        }

        const promptText = `Analyze the following architecture for security risks, SPOFs, and bottlenecks:\n\nNodes:\n${JSON.stringify(nodes, null, 2)}\n\nEdges:\n${JSON.stringify(edges, null, 2)}`;

        const { object } = await generateObject({
            model: google(process.env.AI_MODEL || "gemini-3.1-pro-preview"),
            schema: AiSecurityReviewSchema as any, // Cast as any to avoid TS2589
            system: SYSTEM_PROMPT,
            prompt: promptText,

            maxRetries: 0,
        });

        return NextResponse.json(object);
    } catch (error) {
        console.error("Error during security review:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            },
            { status: 500 },
        );
    }
}
