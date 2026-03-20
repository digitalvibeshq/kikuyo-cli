# kikuyo-cli

`kikuyo-cli` is a command-line client for the Kikuyo REST API. It installs two
identical bins:

- `kikuyo`
- `kikuyo-cli`

## Install

Install from npm:

```bash
npm install -g kikuyo-cli
```

After installation, you can use either executable:

```bash
kikuyo --help
kikuyo-cli --help
```

## Agent Installation

For Claude Desktop, add `digitalvibeshq/kikuyo-cli` as a marketplace plugin, then install the `kikuyo` plugin from that marketplace.

For Claude Code, the equivalent commands are:

```bash
claude plugins marketplace add digitalvibeshq/kikuyo-cli
claude plugins install kikuyo@digitalvibeshq-kikuyo-cli --scope user
```

For `npx skills`, run:

```bash
npx skills add digitalvibeshq/kikuyo-cli
```

## Authentication

Pass the API key per command:

```bash
kikuyo orgs list --api-key kky_your_api_key
```

Or set it once in your shell:

```bash
export KIKUYO_API_KEY=kky_your_api_key
```

You can also override the target API host:

```bash
export KIKUYO_BASE_URL=https://kikuyo.app
```

## Usage

By default the CLI talks to `https://kikuyo.app/api/v1`.

### Organizations

```bash
kikuyo orgs list
kikuyo orgs get digitalvibes
```

### Projects

```bash
kikuyo projects list digitalvibes
kikuyo projects get digitalvibes kikuyo
```

### Feedback

```bash
kikuyo feedback list digitalvibes kikuyo --status pending
kikuyo feedback get aeb1d3f6-772f-4838-9e07-770a0eac9c78
kikuyo feedback create digitalvibes kikuyo --title "Add changelog"
kikuyo feedback update-status 96a4d361-7cfd-4b2b-8061-93d0cf60da2f --status planned
```

Use `--json` to print the raw API response body:

```bash
kikuyo feedback list digitalvibes kikuyo --json
```

Override the base URL for local development:

```bash
kikuyo orgs list --base-url http://localhost:4000
```

## Command Reference

```text
orgs list
orgs get <org>

projects list <org>
projects get <org> <project>

feedback list <org> <project> [--status <status>]
feedback get <id>
feedback create <org> <project> --title <title> [--body <body>]
feedback update-status <id> --status <status>
```

`<org>` accepts an organization UUID or slug.

`<project>` accepts a project UUID or slug.

Valid feedback statuses:

- `pending`
- `planned`
- `in_progress`
- `completed`
- `rejected`

## Development

```bash
bun install
mise run build
mise run precommit
```

## Repository

- Repo: `dvcrn/kikuyo-cli`
- Author: David Mohl <git@d.sh>
