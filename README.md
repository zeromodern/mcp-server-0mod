# @zeromodern/mcp-server-0mod

[![npm](https://img.shields.io/npm/v/@zeromodern/mcp-server-0mod?style=flat-square)](https://www.npmjs.com/package/@zeromodern/mcp-server-0mod) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

MCP server wrapping the [0mod API Gateway](https://api.0mod.com) for any AI agent. HTTP 402 micropayments handled automatically.

## Requirements

- Node.js >= 18
- npm >= 9

## Install

```bash
npm install @zeromodern/mcp-server-0mod
```

## Setup

Configure in your MCP client:

```json
{
  "mcpServers": {
    "0mod": {
      "command": "npx",
      "args": ["-y", "@zeromodern/mcp-server-0mod"],
      "env": {
        "ZERO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Or run directly:

```bash
ZERO_API_KEY=your_api_key_here npx -y @zeromodern/mcp-server-0mod
```

## Tools

| Tool | Description |
|------|-------------|
| `stealth_dom` | Headless web page fetch from Cloudflare edge |
| `airgap_scrub` | Redact SSN, phone, email, ZIP via Workers AI |
| `rag_shrink` | Strip HTML boilerplate to clean Markdown |
| `code_denoise` | Remove comments, docstrings, sourcemaps from code |
| `domain_check` | Query RDAP registry for domain availability |
| `dex_price_summary` | Real-time DEX token price, volume, liquidity |
| `x_sentiment` | Social & market sentiment scoring |
| `image_ocr_shrink` | Vision OCR text and table extraction |
| `embed_text` | Text embedding generation |
| `embed_multilingual` | Multilingual text embedding generation |
| `summarize` | Document summarization |

## Smithery

This server is registered on [Smithery](https://smithery.ai) for one-click deployment.

## Troubleshooting

- **Server not connecting:** Verify your MCP client supports stdio transport. Check that `ZERO_API_KEY` is passed in the `env` block.
- **Authentication errors:** Ensure `ZERO_API_KEY` is set and valid. Check [api.0mod.com](https://api.0mod.com) for key status.
- **Tool not found:** Confirm your API key has access to the requested tool. Some tools require specific permissions.
- **Timeout errors:** The 402 micropayment on Base adds latency. Increase your MCP client's request timeout if needed.

## License

MIT
