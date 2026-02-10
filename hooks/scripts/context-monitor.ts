#!/usr/bin/env bun
/**
 * Stop hook for vector-memory plugin.
 *
 * Monitors context usage by checking transcript file size.
 * Warns at 50% estimated capacity, blocks at 75% to strongly
 * suggest checkpointing.
 *
 * Thresholds are based on rough token-to-byte estimates:
 * - Claude's context window ≈ 200k tokens ≈ 800KB of text
 * - Transcript includes JSON overhead, so thresholds are conservative
 */

import { statSync } from "fs";

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  reason: string;
}

// Conservative thresholds accounting for transcript JSON overhead
const WARN_THRESHOLD_KB = 350; // ~50% context usage
const CRITICAL_THRESHOLD_KB = 550; // ~75% context usage

async function main() {
  const input: HookInput = await Bun.stdin.json();

  if (!input.transcript_path) {
    // No transcript path available - approve silently
    console.log(JSON.stringify({ decision: "approve" }));
    return;
  }

  let fileSizeKB: number;
  try {
    const stats = statSync(input.transcript_path);
    fileSizeKB = stats.size / 1024;
  } catch {
    // Can't read transcript - approve silently
    console.log(JSON.stringify({ decision: "approve" }));
    return;
  }

  const usagePercent = Math.round((fileSizeKB / (CRITICAL_THRESHOLD_KB / 0.75)) * 100);

  if (fileSizeKB >= CRITICAL_THRESHOLD_KB) {
    // 75%+ - block and strongly recommend checkpoint
    const output = {
      decision: "block",
      reason: `Context usage is estimated at ~${usagePercent}%. Strongly recommend storing a checkpoint (/checkpoint:store) and clearing context (/clear) to prevent context rot and maintain memory quality. Ask the user before proceeding.`,
    };
    console.log(JSON.stringify(output));
  } else if (fileSizeKB >= WARN_THRESHOLD_KB) {
    // 50-75% - warn but approve
    const output = {
      decision: "approve",
      systemMessage: `Context usage is estimated at ~${usagePercent}%. Consider storing a checkpoint with /checkpoint:store soon to preserve session state.`,
    };
    console.log(JSON.stringify(output));
  } else {
    // Under 50% - approve silently
    console.log(JSON.stringify({ decision: "approve" }));
  }
}

main().catch(() => {
  // On error, approve silently to avoid blocking the session
  console.log(JSON.stringify({ decision: "approve" }));
  process.exit(0);
});
