# Changelog

All notable changes to **`@zeromodern/mcp-server-0mod`** are documented in this
file.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- Versioning: [SemVer](https://semver.org/). `package.json` `version` is the
  single source of truth (see `RELEASING.md`).
- Published to npm from a GitHub Release; the release tag MUST equal
  `package.json` `version` (guarded in `.github/workflows/publish.yml`).

## [2.0.1] - 2026-10-03

### Fixed
- **Added the missing `repository` field** (`git+https://github.com/zeromodern/mcp-server-0mod.git`),
  plus `homepage` and `bugs`, to `package.json`. `npm publish --provenance`
  (used by `.github/workflows/publish.yml`) requires `repository.url` to
  resolve to the originating public repo; without it the publish fails with
  **E422 Unprocessable Entity**. The `v2.0.0` release was tagged before this
  metadata existed, so the fix ships as a **PATCH** (`v2.0.1`).

### Version
- **PATCH `2.0.0 → 2.0.1`** — metadata-only fix; no public API / tool-surface
  change (SemVer Rule 2). `repository`/`homepage`/`bugs` follow the
  `@zeromodern/eliza-plugin-0mod` convention.

## [2.0.0] - 2026-09-29

### Removed (BREAKING)
- **Retired 9 MCP tools** so the server advertises exactly the frozen **10-SKU**
  x402 catalogue. Agents that cached or hard-coded a removed tool name will no
  longer find it — this is why the bump is **MAJOR**:
  - `rag_shrink` (`/api/v1/rag-shrink`)
  - `code_denoise` (`/api/v1/code-denoise`)
  - `x_sentiment` (`/api/v1/x-sentiment`)
  - `embed_text` (`/api/v1/embed-text`)
  - `embed_multilingual` (`/api/v1/embed-multilingual`)
  - `summarize_text` (`/api/v1/summarize`)
  - `crypto_shadow_capacity` (`/api/v1/crypto/shadow-capacity`)
  - `crypto_labeled_dislocations` (`/api/v1/crypto/labeled-dislocations`)
  - `crypto_attributed_executions` (`/api/v1/crypto/attributed-executions`)
- Corresponding `endpointMap` entries removed (10 entries remain).

### Changed
- `README.md` tool table trimmed to the retained 10 tools (names unchanged).
- `examples/institutional_feed_client.ts` updated to call a retained tool
  (`crypto_dislocations`) instead of the dropped `crypto_shadow_capacity`.

### Retained tools (frozen 10)
`stealth_dom`, `airgap_scrub`, `domain_check`, `dex_price_summary`,
`image_ocr_shrink`, `crypto_coverage`, `crypto_spread_candles`,
`crypto_dislocations`, `crypto_execution_latency`, `crypto_impact_simulation`.

### Version
- **MAJOR `1.5.0 → 2.0.0`** — removing tools from a published MCP server is a
  breaking public API change (SemVer Rule 2). Retained tool **names** are
  unchanged.

## [1.5.0]
- Added 3 x402 crypto telemetry tools. (Superseded by 2.0.0.)

[2.0.0]: https://github.com/zeromodern/mcp-server-0mod/releases/tag/v2.0.0
[2.0.1]: https://github.com/zeromodern/mcp-server-0mod/releases/tag/v2.0.1
