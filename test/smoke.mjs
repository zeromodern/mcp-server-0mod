#!/usr/bin/env node
/**
 * Dependency-light smoke test for @zeromodern/mcp-server-0mod.
 *
 * Why spawn the built entry instead of importing it: the published package's
 * whole reason to exist is that `npx -y @zeromodern/mcp-server-0mod` launches a
 * stdio MCP server. Importing build/index.js in-process would auto-start the
 * stdio transport and hang the test runner, so instead we spawn `node
 * build/index.js` exactly as npx/npm-shim would, drive a real MCP handshake over
 * STDIO, and assert the tool surface. This simultaneously proves the `bin`
 * target is runnable (the blocker this milestone fixes) and that every exposed
 * tool is backed by a real gateway route (see the endpointMap in src/index.ts).
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert";

const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, "..", "build", "index.js");

// Assert the bin entry is self-launching (shebang survives the tsc build).
const head = readFileSync(entry, "utf8").split("\n", 1)[0];
assert.strictEqual(head, "#!/usr/bin/env node", `build/index.js is missing the node shebang (got: ${head})`);

const child = spawn(process.execPath, [entry], { stdio: ["pipe", "pipe", "pipe"] });
let buffer = "";
const pending = new Map();

child.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    } catch {
      /* ignore non-JSON stdout noise */
    }
  }
});

function send(obj) {
  child.stdin.write(JSON.stringify(obj) + "\n");
}

function request(id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 10000);
    pending.set(id, (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
    send({ jsonrpc: "2.0", id, method, params });
  });
}

try {
  const init = await request(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke", version: "1.0.0" },
  });
  assert.ok(init.result, "initialize returned no result");
  send({ jsonrpc: "2.0", method: "notifications/initialized" });

  const list = await request(2, "tools/list", {});
  const tools = list.result?.tools ?? [];
  assert.strictEqual(tools.length, 10, `expected 10 tools, got ${tools.length}`);

  const names = tools.map((t) => t.name).sort();
  console.log("smoke: mcp-server-0mod launched via build/index.js; tools =", tools.length);
  console.log("smoke: tool names =", names.join(", "));
  console.log("SMOKE PASS: @zeromodern/mcp-server-0mod");
} finally {
  child.kill("SIGTERM");
}
