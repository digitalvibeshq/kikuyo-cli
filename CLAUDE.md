- Repo: dvcrn/kikuyo-cli
- Package manager: bun

## Development

- Use `bun add` and `bun add -d` for dependency changes.
- Use `mise run <task>` for build, test, lint, format, and precommit checks.
- The published package name is `kikuyo-cli`.
- The `kikuyo` and `kikuyo-cli` bins must stay identical and point to the same built entrypoint.
- Target Node 20+ for the published runtime even though Bun is used for local development and tests.

## Testing

- Use `bun test` for automated tests.
- Keep command tests focused on request construction, JSON output, and non-zero exits on API failures.
- Cover write operations with mocked HTTP tests. Do not mutate production data during manual verification.
