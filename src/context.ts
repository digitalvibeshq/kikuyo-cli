import { KikuyoApiClient } from "./api-client.js";
import {
  type GlobalOptions,
  resolveApiBaseUrl,
  resolveApiKey,
} from "./config.js";

export interface CommandContext {
  client: KikuyoApiClient;
  json: boolean;
}

export function createCommandContext(options: GlobalOptions): CommandContext {
  return {
    client: new KikuyoApiClient({
      apiKey: resolveApiKey(options),
      baseUrl: resolveApiBaseUrl(options),
    }),
    json: options.json ?? false,
  };
}
