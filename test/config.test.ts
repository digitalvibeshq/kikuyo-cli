import { afterEach, describe, expect, test } from "bun:test";

import {
  DEFAULT_BASE_URL,
  resolveApiBaseUrl,
  resolveApiKey,
} from "../src/config.js";
import { CliError } from "../src/errors.js";

const originalApiKey = process.env.KIKUYO_API_KEY;
const originalBaseUrl = process.env.KIKUYO_BASE_URL;

afterEach(() => {
  restoreEnv("KIKUYO_API_KEY", originalApiKey);
  restoreEnv("KIKUYO_BASE_URL", originalBaseUrl);
});

describe("resolveApiKey", () => {
  test("prefers the CLI flag over the environment", () => {
    process.env.KIKUYO_API_KEY = "from-env";

    expect(resolveApiKey({ apiKey: "from-flag" })).toBe("from-flag");
  });

  test("falls back to the environment", () => {
    process.env.KIKUYO_API_KEY = "from-env";

    expect(resolveApiKey({})).toBe("from-env");
  });

  test("raises a CLI error when the key is missing", () => {
    delete process.env.KIKUYO_API_KEY;

    expect(() => resolveApiKey({})).toThrow(CliError);
  });
});

describe("resolveApiBaseUrl", () => {
  test("defaults to the production API", () => {
    delete process.env.KIKUYO_BASE_URL;

    expect(resolveApiBaseUrl({})).toBe(`${DEFAULT_BASE_URL}/api/v1`);
  });

  test("accepts a fully qualified api base url", () => {
    expect(resolveApiBaseUrl({ baseUrl: "http://localhost:4000/api/v1" })).toBe(
      "http://localhost:4000/api/v1",
    );
  });

  test("appends /api/v1 to a bare origin", () => {
    expect(resolveApiBaseUrl({ baseUrl: "http://localhost:4000/" })).toBe(
      "http://localhost:4000/api/v1",
    );
  });
});

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
