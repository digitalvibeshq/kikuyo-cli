import { afterEach, describe, expect, test } from "bun:test";

import { KikuyoApiClient } from "../src/api-client.js";
import { CliError } from "../src/errors.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("KikuyoApiClient", () => {
  test("sends authorization and accept headers", async () => {
    let requestUrl = "";
    let requestHeaders: Headers | undefined;

    globalThis.fetch = (async (input, init) => {
      requestUrl = String(input);
      requestHeaders = init?.headers as Headers;

      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as typeof fetch;

    const client = new KikuyoApiClient({
      apiKey: "kky_test",
      baseUrl: "https://kikuyo.app/api/v1",
    });

    await client.listOrgs();

    expect(requestUrl).toBe("https://kikuyo.app/api/v1/orgs");
    expect(requestHeaders?.get("authorization")).toBe("Bearer kky_test");
    expect(requestHeaders?.get("accept")).toBe("application/json");
  });

  test("raises a cli error for validation failures", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          error: "unprocessable_entity",
          errors: {
            title: ["can't be blank"],
          },
        }),
        { status: 422 },
      )) as unknown as typeof fetch;

    const client = new KikuyoApiClient({
      apiKey: "kky_test",
      baseUrl: "https://kikuyo.app/api/v1",
    });

    try {
      await client.createFeedback("org", "project", { title: "" });
      throw new Error("Expected createFeedback to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(CliError);
      expect((error as CliError).details?.error).toBe("unprocessable_entity");
      expect((error as CliError).message).toContain("title: can't be blank");
    }
  });
});
