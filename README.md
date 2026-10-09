# @zeromodern/mcp-server-0mod

[![npm](https://img.shields.io/npm/v/@zeromodern/mcp-server-0mod?style=flat-square)](https://www.npmjs.com/package/@zeromodern/mcp-server-0mod) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) server delivering **institutional CEX-DEX crypto arbitrage and real-time execution telemetry** alongside modular edge developer utilities for any AI agent. Per-call micropayments are settled autonomously on Base USDC via HTTP 402.

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

See [`examples/institutional_feed_client.ts`](./examples/institutional_feed_client.ts) for a full runnable script connecting via stdio and querying cross-venue latency and dislocation metrics.


## Available Tools

> 💡 **Pricing**: Prices below are as listed on the gateway at release time. For live per-call pricing and endpoint status across all tools, visit [api.0mod.com](https://api.0mod.com) or fetch `https://api.0mod.com/api/v1/discovery`.

### Institutional Crypto Telemetry & Execution Analytics
| Tool Name | Description | Price / call | Input Schema Example |
| :--- | :--- | :--- | :--- |
| `crypto_dislocations` | Cross-venue market dislocation & spread arbitrage events (Coinbase vs Aerodrome) | $0.045 | `{ "pair": "AERO/USD", "date": "2026-09-14" }` |
| `crypto_execution_latency` | Benchmark cross-venue execution speed, venue latencies, and fill rates | $0.075 | `{ "date": "2026-09-14" }` |
| `crypto_impact_simulation` | Pre-trade impact simulation against live L2 book (VWAP, slippage, fill ratio) | $0.075 | `{ "pair": "AERO/USD", "side": "buy", "size_usd": 5000 }` |
| `crypto_spread_candles` | Cross-venue CEX-DEX 15m spread candles (OHLC raw & net bps) | $0.015 | `{ "pair": "AERO/USD", "date": "2026-09-14" }` |
| `crypto_coverage` | Query active coverage, supported token pairs (13+ pairs), and date boundaries | free | `{ "pair": "AERO/USD" }` |

### Modular Edge Utilities & Developer Tools
| Tool Name | Description | Price / call | Input Schema Example |
| :--- | :--- | :--- | :--- |
| `dex_price_summary` | Real-time DEX token price, volume, liquidity across chains | $0.0015 | `{ "query": "USDC" }` |
| `stealth_dom` | Headless edge web page fetch (HTML or clean Markdown) | $0.004 | `{ "url": "https://example.com" }` |
| `airgap_scrub` | Redact SSN, credit cards, phones, emails via Workers AI | $0.004 | `{ "text": "Call me at 555-0199" }` |
| `domain_check` | Query global RDAP registry for domain availability & nameservers | $0.008 | `{ "domain": "example.com" }` |
| `image_ocr_shrink` | Vision OCR text and table extraction from images | $0.008 | `{ "imageUrl": "https://..." }` |

### Crypto Telemetry — Usage Example: `crypto_impact_simulation`

#### `crypto_impact_simulation` — Pre-Trade Impact Simulation

Pre-trade impact check against the **live L2 book**: expected fill price (VWAP), slippage (bps), fillable size, and fill-probability estimates for a hypothetical order. Read-only PAPER simulation — no order is placed and no custody is touched. Provide `size_usd` **or** `size_base`.

**Request** (tool call):

```json
{
  "tool": "crypto_impact_simulation",
  "arguments": {
    "pair": "AERO/USD",
    "side": "buy",
    "size_usd": 5000
  }
}
```

**Response** (simulation fields):

```json
{
  "expected_fill_price": 1.2843,
  "slippage_bps": 11.6,
  "fillable_size_base": 3900.5,
  "fillable_size_usd": 5009.4,
  "fill_ratio": 0.98,
  "full_fill_probability": 0.94,
  "partial_fill_probability": 0.05,
  "executable": true,
  "levels_consumed": 4
}
```

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

## Release Process

Releases are cut manually by the owner via a **GitHub Release** — publishing to
npm is triggered by creating the Release, and the owner chooses the
major/minor/patch bump. See [RELEASING.md](./RELEASING.md) for the full steps.

## License

MIT
