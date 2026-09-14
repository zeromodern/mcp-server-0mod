# @zeromodern/mcp-server-0mod

[![npm](https://img.shields.io/npm/v/@zeromodern/mcp-server-0mod?style=flat-square)](https://www.npmjs.com/package/@zeromodern/mcp-server-0mod) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) server wrapping the [0mod API Gateway](https://api.0mod.com) edge tools for any AI agent. HTTP 402 micropayments on Base EVM are handled automatically.

## Wallet & Network Prerequisites

0mod gateway utilities use **x402 HTTP 402 micropayments** on Base EVM:
- **Network:** Base Mainnet (`eip155:8453`)
- **Asset:** USDC on Base
- **Environment Variable:** `PAYER_PRIVATE_KEY=0x...` (or `EVM_PRIVATE_KEY` / `X402_PRIVATE_KEY`)

When `PAYER_PRIVATE_KEY` is present in the environment, tool calls transparently sign payment authorizations and execute with zero manual intervention.

## Requirements

- Node.js >= 18
- npm >= 9

## Install

```bash
npm install @zeromodern/mcp-server-0mod
```

## Setup & Configuration

### Claude Desktop (`claude_desktop_config.json`)

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "0mod": {
      "command": "npx",
      "args": ["-y", "@zeromodern/mcp-server-0mod"],
      "env": {
        "PAYER_PRIVATE_KEY": "0x_your_private_key_here"
      }
    }
  }
}
```

### OpenCode / Cursor / CLI

Run directly via `npx`:

```bash
PAYER_PRIVATE_KEY=0x_your_private_key_here npx -y @zeromodern/mcp-server-0mod
```

## Practical Real-World Example: Claude / Cursor Institutional Feed Client

Connect Claude Desktop, Cursor, or autonomous AI agents directly to institutional-grade execution telemetry without signing a $1,000/month enterprise data contract. Per-call pricing is dynamically settled via HTTP 402 on Base (see [api.0mod.com](https://api.0mod.com) for live endpoint pricing).

See [`examples/institutional_feed_client.ts`](./examples/institutional_feed_client.ts) for a full runnable script connecting via stdio and querying cross-venue latency and capacity metrics.


## Available Tools

> 💡 **Pricing**: For live per-call pricing and endpoint status across all tools, visit [api.0mod.com](https://api.0mod.com) or fetch `https://api.0mod.com/api/v1/discovery`.

| Tool Name | Description | Input Schema Example |
| :--- | :--- | :--- |
| `stealth_dom` | Headless web page fetch from Cloudflare edge | `{ "url": "https://example.com" }` |
| `airgap_scrub` | Redact SSN, phone, email, ZIP via Workers AI | `{ "text": "Call me at 555-0199" }` |
| `rag_shrink` | Strip HTML boilerplate to clean Markdown for RAG | `{ "html": "<html>...</html>" }` |
| `code_denoise` | Remove comments, docstrings, sourcemaps from code | `{ "code": "const x = 1;" }` |
| `domain_check` | Query RDAP registry for domain availability | `{ "domain": "example.com" }` |
| `dex_price_summary` | Real-time DEX token price, volume, liquidity | `{ "query": "USDC" }` |
| `x_sentiment` | Social & market sentiment scoring | `{ "topic": "crypto market" }` |
| `image_ocr_shrink` | Vision OCR text and table extraction | `{ "imageUrl": "https://..." }` |
| `embed_text` | 768-dim text embedding generation | `{ "text": "sample text" }` |
| `embed_multilingual` | 1024-dim multilingual text embedding generation | `{ "text": "sample text" }` |
| `summarize_text` | Executive TL;DR document summarization | `{ "text": "long text string" }` |
| `crypto_coverage` | Check data coverage, supported pairs, and date boundaries | `{ "pair": "AERO/USD" }` |
| `crypto_spread_candles` | Fetch cross-venue CEX-DEX spread candles (OHLC) | `{ "pair": "AERO/USD", "date": "2026-09-14" }` |
| `crypto_dislocations` | Fetch cross-venue market dislocation and spread arbitrage events | `{ "pair": "AERO/USD", "date": "2026-09-14" }` |
| `crypto_execution_latency` | Benchmark cross-venue execution speed, venue latencies, and fill rates | `{ "date": "2026-09-14" }` |
| `crypto_shadow_capacity` | Measure uncaptured arbitrage volume capacity and capital constraint metrics | `{ "date": "2026-09-14" }` |

## Ecosystem Packages

- 🤖 **MCP Server (Any AI Agent):** [`@zeromodern/mcp-server-0mod`](https://github.com/zeromodern/mcp-server-0mod)
- 🟣 **ElizaOS Plugin:** [`@zeromodern/eliza-plugin-0mod`](https://github.com/zeromodern/eliza-plugin-0mod)
- 🔵 **Coinbase AgentKit Provider:** [`@zeromodern/agentkit-provider-0mod`](https://github.com/zeromodern/agentkit-provider-0mod)
- ⚡️ **Live Gateway Service:** [api.0mod.com](https://api.0mod.com)

## Smithery

This server is registered on [Smithery](https://smithery.ai) for one-click deployment.

## Troubleshooting

- **Server not connecting:** Verify your MCP client supports stdio transport. Check that `PAYER_PRIVATE_KEY` is passed in the `env` block.
- **Authentication / Payment errors:** Ensure `PAYER_PRIVATE_KEY` is set with a valid Base EVM private key holding a USDC balance for x402 micropayments.
- **Timeout errors:** Micropayment verification on Base adds network latency. Increase your MCP client's request timeout if needed.

## License

MIT
