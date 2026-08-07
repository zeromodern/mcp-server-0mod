import { createRequire } from "node:module";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const GATEWAY = "https://api.0mod.com/api/v1";

let cachedFetchClient: typeof fetch | null = null;

function getFetchClient(): typeof fetch {
  if (cachedFetchClient) return cachedFetchClient;
  const pkey = process.env.PAYER_PRIVATE_KEY || process.env.EVM_PRIVATE_KEY || process.env.X402_PRIVATE_KEY;
  if (!pkey) {
    cachedFetchClient = fetch;
    return fetch;
  }
  try {
    const client = new x402Client();
    const formattedKey = (pkey.startsWith("0x") ? pkey : `0x${pkey}`) as `0x${string}`;
    registerExactEvmScheme(client, { signer: privateKeyToAccount(formattedKey) });
    cachedFetchClient = wrapFetchWithPayment(fetch, client);
    return cachedFetchClient;
  } catch (err) {
    console.error("Failed to initialize x402 auto-payment client:", err);
    cachedFetchClient = fetch;
    return fetch;
  }
}

const server = new Server(
  {
    name: "@zeromodern/mcp-server-0mod",
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "stealth_dom",
        description: "Fetch web pages from Cloudflare edge bypassing simple IP blocks",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "Target URL to fetch" },
          },
          required: ["url"],
        },
      },
      {
        name: "airgap_scrub",
        description: "Redact SSN, phone, email, and ZIP codes using Workers AI",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text content containing sensitive PII" },
          },
          required: ["text"],
        },
      },
      {
        name: "rag_shrink",
        description: "Compress raw HTML to clean markdown & headings for RAG context windows",
        inputSchema: {
          type: "object",
          properties: {
            html: { type: "string", description: "Raw HTML content to parse" },
          },
          required: ["html"],
        },
      },
      {
        name: "code_denoise",
        description: "Strip comments, docstrings, whitespace, and sourcemaps from code files",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string", description: "Code content to clean" },
            language: { type: "string", description: "Programming language" },
          },
          required: ["code"],
        },
      },
      {
        name: "domain_check",
        description: "Query global RDAP registry from edge for domain availability and WHOIS status",
        inputSchema: {
          type: "object",
          properties: {
            domain: { type: "string", description: "Target domain name (e.g. example.com)" },
          },
          required: ["domain"],
        },
      },
      {
        name: "dex_price_summary",
        description: "Fetch real-time DEX price, 24h volume, liquidity, and top pair stats across chains",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Token symbol or contract address" },
          },
          required: ["query"],
        },
      },
      {
        name: "x_sentiment",
        description: "Analyze market & social sentiment for topics/tokens using Workers AI Llama 3.1",
        inputSchema: {
          type: "object",
          properties: {
            topic: { type: "string", description: "Topic, ticker, or text sample to analyze" },
          },
          required: ["topic"],
        },
      },
      {
        name: "image_ocr_shrink",
        description: "Extract clean text and table markdown from images via Workers AI Vision Llama 3.2",
        inputSchema: {
          type: "object",
          properties: {
            imageUrl: { type: "string", description: "Public image URL to parse" },
          },
          required: ["imageUrl"],
        },
      },
      {
        name: "embed_text",
        description: "Generates 768-dimensional dense vector embeddings for RAG & semantic search via BAAI BGE-Base",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              oneOf: [
                { type: "string", description: "Single text string to embed" },
                { type: "array", items: { type: "string" }, description: "Array of text strings to embed" },
              ],
            },
          },
          required: ["text"],
        },
      },
      {
        name: "embed_multilingual",
        description: "Generates 1024-dimensional dense vector embeddings for multilingual & long text via BAAI BGE-Large",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              oneOf: [
                { type: "string", description: "Single text string to embed" },
                { type: "array", items: { type: "string" }, description: "Array of text strings to embed" },
              ],
            },
          },
          required: ["text"],
        },
      },
      {
        name: "summarize_text",
        description: "Executive TL;DR text summarizer producing structured bullet points via Workers AI Llama 3.1",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Source text payload to summarize" },
            format: { type: "string", enum: ["bullets", "paragraph", "executive"], description: "Summary output format style" },
            maxLength: { type: "number", description: "Target word count limit" },
          },
          required: ["text"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const endpointMap: Record<string, string> = {
    stealth_dom: `${GATEWAY}/stealth-dom`,
    airgap_scrub: `${GATEWAY}/airgap-scrub`,
    rag_shrink: `${GATEWAY}/rag-shrink`,
    code_denoise: `${GATEWAY}/code-denoise`,
    domain_check: `${GATEWAY}/domain-check`,
    dex_price_summary: `${GATEWAY}/dex-price-summary`,
    x_sentiment: `${GATEWAY}/x-sentiment`,
    image_ocr_shrink: `${GATEWAY}/image-ocr-shrink`,
    embed_text: `${GATEWAY}/embed-text`,
    embed_multilingual: `${GATEWAY}/embed-multilingual`,
    summarize_text: `${GATEWAY}/summarize`,
  };

  const targetUrl = endpointMap[name];
  if (!targetUrl) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const fetchFn = getFetchClient();
    const response = await fetchFn(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args || {}),
    });

    if (response.status === 402) {
      let paymentInfo: any = {};
      const paymentHeader = response.headers.get("payment-required") || response.headers.get("x-payment-response");
      try {
        paymentInfo = await response.json();
      } catch {
        paymentInfo = { raw: await response.text() };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: true,
                status: 402,
                message: "HTTP 402 Payment Required — x402 payment verification required",
                paymentHeader,
                paymentRequirements: paymentInfo,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: true,
                status: response.status,
                message: `Gateway call failed with status ${response.status}`,
                details: errorText.slice(0, 500),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    const data = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: true,
              message: "Network request to gateway failed",
              details: error?.message || String(error),
            },
            null,
            2
          ),
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
