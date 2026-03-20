import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { runCli } from "../src/app.js";

const originalFetch = globalThis.fetch;
const originalLog = console.log;
const originalError = console.error;
const originalTable = console.table;

let logs: string[];
let errors: string[];
let tables: unknown[];
let fetchCalls: Array<{ input: string; init?: RequestInit }>;
let fetchResponseBody = "";
let fetchStatus = 200;

beforeEach(() => {
  logs = [];
  errors = [];
  tables = [];
  fetchCalls = [];
  fetchResponseBody = JSON.stringify({ data: [] });
  fetchStatus = 200;

  console.log = ((value?: unknown) => {
    logs.push(value === undefined ? "" : String(value));
  }) as typeof console.log;

  console.error = ((value?: unknown) => {
    errors.push(value === undefined ? "" : String(value));
  }) as typeof console.error;

  console.table = ((value: unknown) => {
    tables.push(value);
  }) as typeof console.table;

  globalThis.fetch = (async (input, init) => {
    fetchCalls.push({ input: String(input), init });

    return new Response(fetchResponseBody, { status: fetchStatus });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  console.log = originalLog;
  console.error = originalError;
  console.table = originalTable;
});

describe("runCli", () => {
  test("renders orgs list as a table by default", async () => {
    fetchResponseBody = JSON.stringify({
      data: [
        {
          id: "org-1",
          name: "Digital Vibes",
          slug: "digitalvibes",
          inserted_at: "2026-03-20T00:00:00Z",
          updated_at: "2026-03-20T00:00:00Z",
        },
      ],
    });

    const exitCode = await runCli(["orgs", "list", "--api-key", "kky_test"]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe("https://kikuyo.app/api/v1/orgs");
    expect(tables).toHaveLength(1);
  });

  test("prints raw json for orgs get", async () => {
    fetchResponseBody = JSON.stringify({
      data: { id: "org-1", slug: "digitalvibes" },
    });

    const exitCode = await runCli([
      "orgs",
      "get",
      "digitalvibes",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes",
    );
    expect(logs[0]).toContain('"slug": "digitalvibes"');
  });

  test("prints raw json for projects list", async () => {
    fetchResponseBody = JSON.stringify({ data: [] });

    const exitCode = await runCli([
      "projects",
      "list",
      "digitalvibes",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes/projects",
    );
  });

  test("prints raw json for projects get", async () => {
    fetchResponseBody = JSON.stringify({
      data: { id: "project-1", slug: "kikuyo" },
    });

    const exitCode = await runCli([
      "projects",
      "get",
      "digitalvibes",
      "kikuyo",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes/projects/kikuyo",
    );
  });

  test("prints raw json for feedback list", async () => {
    fetchResponseBody = JSON.stringify({ data: [] });

    const exitCode = await runCli([
      "feedback",
      "list",
      "digitalvibes",
      "kikuyo",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes/projects/kikuyo/feedback",
    );
  });

  test("prints raw json for feedback get", async () => {
    fetchResponseBody = JSON.stringify({ data: { id: "feedback-1" } });

    const exitCode = await runCli([
      "feedback",
      "get",
      "feedback-1",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/feedback/feedback-1",
    );
  });

  test("posts feedback creation payloads", async () => {
    fetchResponseBody = JSON.stringify({ data: { id: "feedback-1" } });

    const exitCode = await runCli([
      "feedback",
      "create",
      "digitalvibes",
      "kikuyo",
      "--title",
      "Test request",
      "--body",
      "Created from the CLI",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes/projects/kikuyo/feedback",
    );
    expect(fetchCalls[0]?.init?.method).toBe("POST");
    expect(fetchCalls[0]?.init?.body).toBe(
      JSON.stringify({
        title: "Test request",
        body: "Created from the CLI",
      }),
    );
  });

  test("puts feedback status updates", async () => {
    fetchResponseBody = JSON.stringify({
      data: { id: "feedback-1", status: "planned" },
    });

    const exitCode = await runCli([
      "feedback",
      "update-status",
      "feedback-1",
      "--status",
      "planned",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/feedback/feedback-1/status",
    );
    expect(fetchCalls[0]?.init?.method).toBe("PUT");
    expect(fetchCalls[0]?.init?.body).toBe(
      JSON.stringify({
        status: "planned",
      }),
    );
  });

  test("adds the feedback status query filter", async () => {
    fetchResponseBody = JSON.stringify({ data: [] });

    const exitCode = await runCli([
      "feedback",
      "list",
      "digitalvibes",
      "kikuyo",
      "--status",
      "planned",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(0);
    expect(fetchCalls[0]?.input).toBe(
      "https://kikuyo.app/api/v1/orgs/digitalvibes/projects/kikuyo/feedback?status=planned",
    );
  });

  test("prints help output", async () => {
    const exitCode = await runCli(["--help"]);

    expect(exitCode).toBe(0);
    expect(logs.join("\n")).toContain("orgs list");
    expect(logs.join("\n")).toContain("feedback update-status <id>");
  });

  test("prints raw error json in json mode", async () => {
    fetchStatus = 404;
    fetchResponseBody = JSON.stringify({
      error: "not_found",
      message: "Resource not found",
    });

    const exitCode = await runCli([
      "feedback",
      "get",
      "missing",
      "--api-key",
      "kky_test",
      "--json",
    ]);

    expect(exitCode).toBe(1);
    expect(errors[0]).toContain('"error": "not_found"');
  });
});
