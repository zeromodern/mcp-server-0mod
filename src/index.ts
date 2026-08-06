import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const GATEWAY = "https://api.0mod.com/api/v1";

const server = new Server(
  {
    name: "0mod-gateway-mcp",
    version: "1.0.0",
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
  };

  const targetUrl = endpointMap[name];
  if (!targetUrl) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  const data = await response.json();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
