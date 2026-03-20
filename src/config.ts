import { CliError } from "./errors.js";

export interface GlobalOptions {
  apiKey?: string;
  baseUrl?: string;
  json?: boolean;
}

export const DEFAULT_BASE_URL = "https://kikuyo.app";

export function resolveApiKey(options: GlobalOptions): string {
  const apiKey = options.apiKey ?? process.env.KIKUYO_API_KEY;

  if (apiKey) {
    return apiKey;
  }

  throw new CliError(
    "Missing API key. Pass --api-key or set KIKUYO_API_KEY in the environment.",
  );
}

export function resolveApiBaseUrl(options: GlobalOptions): string {
  const rawBaseUrl =
    options.baseUrl ?? process.env.KIKUYO_BASE_URL ?? DEFAULT_BASE_URL;
  const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (trimmedBaseUrl.endsWith("/api/v1")) {
    return trimmedBaseUrl;
  }

  return `${trimmedBaseUrl}/api/v1`;
}
