# Kikuyo CLI Commands

The current command surface is:

```text
orgs list
orgs get <org>

projects list <org>
projects get <org> <project>

feedback list <org> <project> [--status <pending|planned|in_progress|completed|rejected>]
feedback get <id>
feedback create <org> <project> --title <title> [--body <body>]
feedback update-status <id> --status <pending|planned|in_progress|completed|rejected>
```

Global flags:

```text
--api-key <key>
--base-url <url>
--json
--help
--version
```
