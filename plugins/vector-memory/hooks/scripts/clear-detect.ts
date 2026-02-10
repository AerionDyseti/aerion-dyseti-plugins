#!/usr/bin/env bun
/**
 * UserPromptSubmit hook for vector-memory plugin.
 *
 * Detects when the user is about to clear context and suggests
 * storing a checkpoint first.
 */

interface HookInput {
  session_id: string;
  user_prompt: string;
  cwd: string;
}

async function main() {
  const input: HookInput = await Bun.stdin.json();
  const prompt = input.user_prompt?.trim().toLowerCase() ?? "";

  // Detect /clear command
  if (prompt === "/clear" || prompt.startsWith("/clear ")) {
    const output = {
      systemMessage:
        "The user is about to clear context. Before clearing, suggest storing a checkpoint with /checkpoint:store to preserve the current session state. Ask the user: 'Would you like me to store a checkpoint before clearing context?'",
    };

    console.log(JSON.stringify(output));
  }
}

main().catch(() => process.exit(0));
