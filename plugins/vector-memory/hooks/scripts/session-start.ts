#!/usr/bin/env bun
/**
 * SessionStart hook for vector-memory plugin.
 *
 * Checks if the vector-memory server is running and suggests
 * loading the checkpoint if one is available.
 */

const VECTOR_MEMORY_URL =
  process.env.VECTOR_MEMORY_URL ?? "http://127.0.0.1:3271";

async function main() {
  // Read hook input from stdin
  const input = await Bun.stdin.text();

  // Check if server is running
  try {
    const response = await fetch(`${VECTOR_MEMORY_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return;
    }

    // Server is running - suggest checkpoint load
    const output = {
      systemMessage:
        "Vector memory server is available. Ask the user if they would like to load their project checkpoint with /checkpoint:get. If they decline, proceed normally.",
    };

    console.log(JSON.stringify(output));
  } catch {
    // Server not running - no action needed.
    // The MCP server may still be starting up via stdio.
    return;
  }
}

main().catch(() => process.exit(0));
