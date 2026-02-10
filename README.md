# claude-vector-memory

A Claude Code plugin that provides RAG-powered session memory with checkpoints. Automatically loads the [vector-memory-mcp](https://github.com/AerionDyseti/vector-memory-mcp) server and adds checkpoint commands, workflow skills, and session lifecycle hooks.

## Prerequisites

- [Bun](https://bun.sh/) 1.0+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## Install

Add this plugin to Claude Code:

```bash
claude plugin add /path/to/claude-vector-memory
```

Or clone and use directly:

```bash
git clone https://github.com/AerionDyseti/claude-vector-memory.git
claude --plugin-dir /path/to/claude-vector-memory
```

## What's Included

### MCP Server (auto-loaded)

The plugin automatically starts the `@aeriondyseti/vector-memory-mcp` server, providing:

| Tool | Description |
|------|-------------|
| `store_memories` | Save memories with metadata |
| `search_memories` | Semantic search with intent-based ranking |
| `get_memories` | Retrieve memories by ID |
| `update_memories` | Modify existing memories |
| `delete_memories` | Soft-delete outdated memories |
| `report_memory_usefulness` | Feedback for search quality improvement |
| `store_checkpoint` | Save session state snapshot |
| `get_checkpoint` | Restore session state |

### Commands

| Command | Description |
|---------|-------------|
| `/checkpoint:get` | Load project context from checkpoint + git + relevant memories |
| `/checkpoint:store` | Extract session memories, then store a checkpoint snapshot |

### Skills

| Skill | Triggers On |
|-------|-------------|
| **Checkpoint Workflow** | "store a checkpoint", "resume work", "where were we", session management |
| **Vector Memory Usage** | "remember this", "search memories", "what did we decide", proactive memory search |

### Hooks

| Event | Behavior |
|-------|----------|
| **SessionStart** | Suggests loading checkpoint if server is available |
| **UserPromptSubmit** | Detects `/clear` and suggests storing checkpoint first |
| **Stop** | Monitors context usage — warns at 50%, blocks at 75% |

## Workflow

The recommended session workflow:

```
1. Session starts → Accept checkpoint load suggestion
2. Work on tasks
3. Context monitor warns at 50% → Consider checkpointing
4. Complete discrete task → /checkpoint:store
5. /clear → Fresh context for next task
6. Repeat
```

## Configuration

The MCP server supports these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `VECTOR_MEMORY_DB_PATH` | `.vector-memory/memories.db` | Database location |
| `VECTOR_MEMORY_HTTP_PORT` | `3271` | HTTP server port |

## License

MIT
