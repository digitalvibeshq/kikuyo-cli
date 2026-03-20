# Kikuyo CLI Examples

## Basic access check

```bash
kikuyo orgs list
```

## JSON output for scripts

```bash
kikuyo projects list digitalvibes --json
```

## Working against a local server

```bash
kikuyo orgs list --base-url http://localhost:4000
```

## Create then inspect feedback

```bash
kikuyo feedback create digitalvibes kikuyo --title "Improve roadmap filtering"
kikuyo feedback list digitalvibes kikuyo --status pending
```
