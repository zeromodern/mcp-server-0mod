/**
 * MCP Institutional Telemetry Feed Client
 *
 * Problem:
 * Quants, analysts, and LLM coding assistants (Claude Desktop, Cursor, Copilot)
 * traditionally need proprietary API keys and $1,000/month subscriptions to access
 * institution-grade cross-venue crypto metrics.
 *
 * Solution:
 * This script demonstrates connecting to @zeromodern/mcp-server-0mod as an MCP client.
 * The AI agent can autonomously invoke crypto telemetry tools:
 *   - crypto_coverage (Free discovery)
 *   - crypto_spread_candles ($0.025 USDC)
 *   - crypto_execution_latency ($0.120 USDC)
 *   - crypto_shadow_capacity ($0.200 USDC)
 * Each tool call is automatically settled over HTTP 402 via the client's Base wallet.
 *
 * Prerequisites:
 *   npm install @modelcontextprotocol/sdk
 *   export PAYER_PRIVATE_KEY="0x..." # Base wallet private key
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runMcpInstitutionalFeed() {
  console.log("=== MCP Client: 0mod Institutional Telemetry Feed ===");
  console.log("Connecting to @zeromodern/mcp-server-0mod via stdio transport...\n");

  const transport = new StdioClientTransport({
    command: "node",
    args: ["./build/index.js"],
    env: {
      ...process.env,
    },
  });

  const client = new Client(
    {
      name: "institutional-feed-auditor",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log("✓ Connected to MCP Server successfully.");

  // 1. Discover all tools
  const tools = await client.listTools();
  const cryptoTools = tools.tools.filter(t => t.name.startsWith("crypto_"));
  console.log(`✓ Discovered ${cryptoTools.length} institutional crypto tools:`);
  cryptoTools.forEach(t => console.log(`  - ${t.name}: ${t.description}`));

  // 2. Call crypto_coverage (FREE)
  console.log("\n[Tool Call] crypto_coverage...");
  const coverageResult = await client.callTool({
    name: "crypto_coverage",
    arguments: {},
  });
  console.log("Result:", JSON.stringify(coverageResult, null, 2));

  // 3. Call crypto_execution_latency ($0.120 USDC)
  console.log("\n[Tool Call] crypto_execution_latency ($0.120 USDC)...");
  const latencyResult = await client.callTool({
    name: "crypto_execution_latency",
    arguments: {
      date: "2026-09-13",
      time: "1400",
    },
  });
  console.log("Result:", JSON.stringify(latencyResult, null, 2));

  // 4. Call crypto_shadow_capacity ($0.200 USDC)
  console.log("\n[Tool Call] crypto_shadow_capacity ($0.200 USDC)...");
  const capacityResult = await client.callTool({
    name: "crypto_shadow_capacity",
    arguments: {
      date: "2026-09-13",
      time: "1400",
    },
  });
  console.log("Result:", JSON.stringify(capacityResult, null, 2));

  await client.close();
  console.log("\n✓ MCP session closed cleanly.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMcpInstitutionalFeed().catch(console.error);
}

export { runMcpInstitutionalFeed };
