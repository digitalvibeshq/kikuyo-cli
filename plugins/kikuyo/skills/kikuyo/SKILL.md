---
name: kikuyo
description: Operate the Kikuyo CLI for organizations, projects, and feedback through the Kikuyo REST API. Use when requests mention the `kikuyo` or `kikuyo-cli` commands, or the npm package `kikuyo-cli`, especially for command construction, auth setup, status filtering, and script-friendly JSON output.
---

# Kikuyo

## Overview

Use this skill to run the Kikuyo CLI safely and produce exact commands for the
current public API surface.

Prefer read-only commands first when verifying identifiers or access.
Use JSON output when the result will be piped to other tools or parsed by code.

Read `references/commands.md` for the supported command surface.
Read `references/examples.md` for concrete examples.

## Runbook

1. Confirm installation state.
2. Confirm authentication source.
3. Verify access with a read-only command such as `orgs list`.
4. Resolve org and project identifiers before write operations.
5. Prefer `--json` for automation.
6. Before `feedback create` or `feedback update-status`, confirm the target org,
   project, or feedback item with a read command.

## Installation And Auth

Install from npm:

```bash
npm install -g kikuyo-cli
```

Both binaries are equivalent:

```bash
kikuyo --help
kikuyo-cli --help
```

Use environment variables by default:

```bash
export KIKUYO_API_KEY="kky_your_api_key"
export KIKUYO_BASE_URL="https://kikuyo.app"
```

Per-command auth is also supported:

```bash
kikuyo orgs list --api-key kky_your_api_key
```

## Common Tasks

Use these as canonical examples:

```bash
# list organizations
kikuyo orgs list

# get an organization by slug or UUID
kikuyo orgs get digitalvibes

# list projects in an organization
kikuyo projects list digitalvibes

# get a project by slug or UUID
kikuyo projects get digitalvibes kikuyo

# list all feedback for a project
kikuyo feedback list digitalvibes kikuyo

# filter feedback by status
kikuyo feedback list digitalvibes kikuyo --status planned

# get full feedback detail
kikuyo feedback get <feedback-id>

# create feedback
kikuyo feedback create digitalvibes kikuyo --title "Add changelog" --body "Optional details"

# update feedback status
kikuyo feedback update-status <feedback-id> --status completed
```

## Identifier Rules

- `<org>` accepts an organization UUID or slug.
- `<project>` accepts a project UUID or slug.
- `<id>` for `feedback get` and `feedback update-status` is the feedback UUID.

## Output Strategy

Use default human-readable output for interactive use.
Use `--json` for automation and downstream parsing.

```bash
kikuyo feedback list digitalvibes kikuyo --json
```

## Safety Checks

Before write operations:

1. Confirm the org is accessible with `kikuyo orgs get <org>`.
2. Confirm the project is accessible with `kikuyo projects get <org> <project>`.
3. Confirm the feedback item exists with `kikuyo feedback get <id>`.
4. Validate statuses against the supported set.

Supported statuses:

- `pending`
- `planned`
- `in_progress`
- `completed`
- `rejected`

## Notes

- The CLI defaults to `https://kikuyo.app/api/v1`.
- `--base-url` may be either the bare origin or a full `/api/v1` base URL.
- `kikuyo` and `kikuyo-cli` are identical and map to the same implementation.
