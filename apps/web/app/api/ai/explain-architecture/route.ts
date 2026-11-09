import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const SYSTEM_PROMPT = `You are a SENIOR SYSTEMS ARCHITECT and TECHNICAL COMMUNICATOR for Architecture Studio.
The user has designed a system architecture graph. Your job is to explain the COMPLETE PACKET LIFECYCLE in simple English, formatted as a highly detailed, visually appealing narrative.

Your explanation MUST include:
1. End-to-end flow: From the moment a packet enters the system to the final response returned to the user.
2. Logic Panel Rules: Detail what happens at EVERY single node based on its configured logic steps (e.g., conditions, cache hit/miss logic).
3. Latency, Hardware & Routing: Explain the node's configured latency model, workload intensity, hardware allocation (cpuCores, memoryMb, bandwidthCapacity), and routing strategy (broadcast vs load-balance).
4. Wires & Protocols: Name the protocol used between nodes and the event name. Explain WHY a wire uses a specific edge style (e.g. step for async, bezier for sync).
5. Success & Failure Paths: Explain why a packet might miss a cache, why it might error, why it might queue up (bottlenecks), and how the packet's shape or color in the simulation represents these states (e.g. green for success, red for error, yellow for warning/queue).

CRITICAL FORMATTING RULES:
1. Use emojis (🟢, 🔴, 🟡, ⚡, 💾, 🌐, etc.) to make the narrative pop!
2. Wrap ANY ASCII architecture diagrams in \`\`\`text ... \`\`\` code blocks so they render properly in monospace. Never leave ASCII art as plain text!
3. Use Markdown Blockquotes (\`> \`) for important callouts or latency notes.
4. Heavily use bolding (\`**\`) for Node Names, Protocols, and specific HTTP status codes.
5. Use bulleted lists (\`-\`) for step-by-step logic.
6. Use \`###\` headers for each major flow or node.

Make it read like a step-by-step story of a packet's journey.`;

export async function POST(req: Request) {
    try {
        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Request aborted or invalid JSON" }, { status: 400 });
        }
        const { nodes, edges } = body;

        if (!nodes || !edges) {
            return NextResponse.json(
                { error: "Missing nodes or edges in request body" },
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

        const google = createGoogleGenerativeAI({ apiKey });
        
        const promptText = `Analyze the following architecture and provide the detailed packet lifecycle explanation:\n\nNodes:\n${JSON.stringify(nodes, null, 2)}\n\nEdges:\n${JSON.stringify(edges, null, 2)}`;

        const { text } = await generateText({
            model: google(process.env.AI_MODEL || "gemini-3.1-pro-preview"),
            system: SYSTEM_PROMPT,
            prompt: promptText,

        });

        return NextResponse.json({ explanation: text });
    } catch (error) {
        console.error("Error during architecture explanation:", error);
        return NextResponse.json(
            { error: "Failed to generate explanation." },
            { status: 500 },
        );
    }
}
