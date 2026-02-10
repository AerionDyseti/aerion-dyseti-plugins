#!/usr/bin/env bun
/**
 * SessionStart hook for vector-memory plugin.
 *
 * Fetches the latest checkpoint from the vector-memory server's HTTP API
 * and outputs it as session context, including any referenced memories.
 *
 * Based on vector-memory-mcp/hooks/session-start.ts but uses the HTTP API
 * instead of direct DB access so it works as a standalone plugin hook.
 */

const VECTOR_MEMORY_URL =
  process.env.VECTOR_MEMORY_URL ?? "http://127.0.0.1:3271";

interface CheckpointResponse {
  content: string;
  metadata: Record<string, unknown>;
  referencedMemories: Array<{ id: string; content: string }>;
  updatedAt: string;
}

async function main() {
  // Read hook input from stdin (required by hook protocol)
  await Bun.stdin.text();

  // Fetch latest checkpoint from running server
  let checkpoint: CheckpointResponse;
  try {
    const response = await fetch(`${VECTOR_MEMORY_URL}/checkpoint`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      // No checkpoint found — start fresh
      return;
    }

    if (!response.ok) {
      return;
    }

    checkpoint = await response.json();
  } catch {
    // Server not running or unreachable — no action needed.
    // The MCP server may still be starting up via stdio.
    return;
  }

  // Build output: checkpoint content + referenced memories
  let output = checkpoint.content;

  if (checkpoint.referencedMemories.length > 0) {
    const memories = checkpoint.referencedMemories
      .map((m) => `### Memory: ${m.id}\n${m.content}`)
      .join("\n\n");
    output += `\n\n## Referenced Memories\n\n${memories}`;
  }

  console.log(output);
}

main().catch(() => process.exit(0));
