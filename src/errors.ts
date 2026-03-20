import type { ApiErrorPayload } from "./types.js";

const DEFAULT_ERROR_MESSAGE = "The Kikuyo API returned an unexpected response.";

export class CliError extends Error {
  readonly exitCode: number;
  readonly details?: ApiErrorPayload;

  constructor(
    message: string,
    options?: {
      exitCode?: number;
      details?: ApiErrorPayload;
    },
  ) {
    super(message);
    this.name = "CliError";
    this.exitCode = options?.exitCode ?? 1;
    this.details = options?.details;
  }
}

export function normalizeApiErrorPayload(payload: unknown): ApiErrorPayload {
  if (!isRecord(payload) || typeof payload.error !== "string") {
    return {
      error: "unknown_error",
      message: DEFAULT_ERROR_MESSAGE,
    };
  }

  const normalized: ApiErrorPayload = { error: payload.error };

  if (typeof payload.message === "string") {
    normalized.message = payload.message;
  }

  if (isValidationErrors(payload.errors)) {
    normalized.errors = payload.errors;
  }

  if (!normalized.message && !normalized.errors) {
    normalized.message = humanizeErrorKey(payload.error);
  }

  return normalized;
}

export function formatApiError(payload: ApiErrorPayload): string {
  const lines: string[] = [];

  if (payload.message) {
    lines.push(payload.message);
  }

  if (payload.errors) {
    for (const [field, messages] of Object.entries(payload.errors)) {
      lines.push(`${field}: ${messages.join(", ")}`);
    }
  }

  if (lines.length === 0) {
    lines.push(humanizeErrorKey(payload.error));
  }

  return lines.join("\n");
}

function humanizeErrorKey(error: string): string {
  switch (error) {
    case "unauthorized":
      return "Unauthorized. Check the API key.";
    case "forbidden":
      return "Forbidden. The API key does not have access to this resource.";
    case "not_found":
      return "Resource not found.";
    case "unprocessable_entity":
      return "The request was rejected by the API.";
    default:
      return DEFAULT_ERROR_MESSAGE;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidationErrors(value: unknown): value is Record<string, string[]> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (entry) =>
      Array.isArray(entry) &&
      entry.every((message) => typeof message === "string"),
  );
}
