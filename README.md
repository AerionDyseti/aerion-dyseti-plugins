# aerion-dyseti-plugins

Claude Code plugin marketplace by AerionDyseti.

## Install

```bash
/plugin marketplace add AerionDyseti/aerion-dyseti-plugins
```

Then install individual plugins:

```bash
/plugin install vector-memory@aerion-dyseti-plugins
```

## Plugins

### vector-memory

RAG-powered session memory with checkpoints for Claude Code. Automatically loads the [vector-memory-mcp](https://github.com/AerionDyseti/vector-memory-mcp) server and adds checkpoint commands, workflow skills, and session lifecycle hooks.

**Prerequisites:** [Bun](https://bun.sh/) 1.0+

#### MCP Server (auto-loaded)

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

#### Commands

| Command | Description |
|---------|-------------|
| `/checkpoint:get` | Load project context from checkpoint + git + relevant memories |
| `/checkpoint:store` | Extract session memories, then store a checkpoint snapshot |

#### Skills

| Skill | Triggers On |
|-------|-------------|
| **Checkpoint Workflow** | "store a checkpoint", "resume work", "where were we", session management |
| **Vector Memory Usage** | "remember this", "search memories", "what did we decide", proactive memory search |

#### Hooks

| Event | Behavior |
|-------|----------|
| **SessionStart** | Suggests loading checkpoint if server is available |
| **UserPromptSubmit** | Detects `/clear` and suggests storing checkpoint first |
| **Stop** | Monitors context usage — warns at 50%, blocks at 75% |

#### Workflow

```
1. Session starts → Accept checkpoint load suggestion
2. Work on tasks
3. Context monitor warns at 50% → Consider checkpointing
4. Complete discrete task → /checkpoint:store
5. /clear → Fresh context for next task
6. Repeat
```

#### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VECTOR_MEMORY_DB_PATH` | `.vector-memory/memories.db` | Database location |
| `VECTOR_MEMORY_HTTP_PORT` | `3271` | HTTP server port |

### frontend-design

Frontend design guidance, Playwright browser automation, and Playwright MCP server in one plugin. Combines three complementary tools for building and testing web interfaces.

```bash
/plugin install frontend-design@aerion-dyseti-plugins
```

#### Skills

| Skill | Triggers On |
|-------|-------------|
| **Frontend Design** | "build a landing page", "create a component", UI/UX implementation tasks |
| **Playwright** | "test my website", "take a screenshot", browser automation tasks |

#### MCP Server (auto-loaded)

The [@playwright/mcp](https://github.com/microsoft/playwright-mcp) server provides 25+ browser control tools (navigate, click, fill, snapshot, etc.) accessible directly as MCP tools.

## License

MIT
