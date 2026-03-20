import { describe, expect, test } from "bun:test";

import { formatApiError, normalizeApiErrorPayload } from "../src/errors.js";

describe("normalizeApiErrorPayload", () => {
  test("keeps the standard error message shape", () => {
    expect(
      normalizeApiErrorPayload({
        error: "forbidden",
        message: "Access denied",
      }),
    ).toEqual({
      error: "forbidden",
      message: "Access denied",
    });
  });

  test("keeps validation errors from the live 422 shape", () => {
    const payload = normalizeApiErrorPayload({
      error: "unprocessable_entity",
      errors: {
        title: ["can't be blank"],
      },
    });

    expect(payload.errors?.title).toEqual(["can't be blank"]);
    expect(formatApiError(payload)).toContain("title: can't be blank");
  });
});
