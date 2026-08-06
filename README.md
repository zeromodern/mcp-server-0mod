# `0mod-mcp-server`

MCP Server for **0mod API Gateway** (`api.0mod.com`) featuring 8 Cloudflare Edge micro-utilities.

## Tools Included

- `stealth_dom`: Fetch web pages from Cloudflare edge.
- `airgap_scrub`: Redact SSN, phone, email, and ZIP codes.
- `rag_shrink`: Compress raw HTML to clean markdown & headings.
- `code_denoise`: Strip comments, docstrings, and sourcemaps from code.
- `domain_check`: Query global RDAP registry for domain availability.
- `dex_price_summary`: Real-time DEX token price, volume, and liquidity.
- `x_sentiment`: Market & social sentiment scoring via Workers AI.
- `image_ocr_shrink`: Vision OCR text & table extractor via Workers AI Vision.
