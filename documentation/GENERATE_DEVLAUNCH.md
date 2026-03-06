# Task: Generate `.devlaunch` from project analysis

Read `.devlaunch.example` in the project root for format reference. Analyse the project. Write a valid `.devlaunch` file in the same directory. Do not modify `.devlaunch.example`.

## Analysis targets

Search these sources to discover long-running dev processes and their ports:

```json
{
  "scripts_sources": [
    "package.json → scripts (root)",
    "*/package.json → scripts (subdirs: client, frontend, server, api, web, worker)",
    "turbo.json | nx.json | pnpm-workspace.yaml (monorepo orchestration)"
  ],
  "port_sources_priority": [
    ".env, .env.local, .env.development → PORT, VITE_PORT, API_PORT variables",
    "scripts in package.json → CLI flags: --port NNNN",
    "config files → vite.config.*, next.config.*, webpack.config.* → port property",
    "source code → .listen(PORT, app.listen(, server.listen( → trace the value to a literal or env var"
  ]
}
```

## Inclusion criteria

Include only: long-running dev servers (processes kept alive during development).
Exclude: build scripts, test runners, linters, one-shot commands.
If a single script wraps multiple processes via `concurrently`/`npm-run-all`, split into separate sections when individual ports are determinable.

## Per-process extraction

For each process found, extract:

```json
{
  "section_name": "lowercase alphanumeric, hyphens, underscores",
  "cmd": "exact shell command, prefer dev/watch mode script",
  "port": "integer, required",
  "cwd": "relative path from repo root, omit if repo root"
}
```

App display name: use root `package.json` `"name"` field, fallback to directory basename.

## Output format

Write to `.devlaunch` (not `.devlaunch.example`). Raw config only, no markdown fences or prose.

```
# <app-name>: <brief description of processes>
name = <app-display-name>

[<section-name>]
cmd  = <command>
port = <port>
cwd  = <subdir>
```

`cmd` and `port` required per section. `cwd` only when command runs from a subdirectory.

## Worked example

Input: root `package.json` has script `"server": "tsx watch src/server.ts"` (port 3005), `client/package.json` has `"dev": "vite"` (port 5173).

Output `.devlaunch`:
```
# my-app: API server + Vite frontend
name = my-app

[server]
cmd  = npm run server
port = 3005

[client]
cmd  = npm run dev
port = 5173
cwd  = client
```
