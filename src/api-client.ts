import {
  CliError,
  formatApiError,
  normalizeApiErrorPayload,
} from "./errors.js";
import type {
  ApiEnvelope,
  CreateFeedbackInput,
  FeedbackDetail,
  FeedbackStatus,
  FeedbackSummary,
  Org,
  OrgDetail,
  Project,
} from "./types.js";

interface KikuyoApiClientOptions {
  apiKey: string;
  baseUrl: string;
}

export class KikuyoApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: KikuyoApiClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
  }

  async listOrgs(): Promise<ApiEnvelope<Org[]>> {
    return this.request<ApiEnvelope<Org[]>>("/orgs");
  }

  async getOrg(org: string): Promise<ApiEnvelope<OrgDetail>> {
    return this.request<ApiEnvelope<OrgDetail>>(
      `/orgs/${encodeURIComponent(org)}`,
    );
  }

  async listProjects(org: string): Promise<ApiEnvelope<Project[]>> {
    return this.request<ApiEnvelope<Project[]>>(
      `/orgs/${encodeURIComponent(org)}/projects`,
    );
  }

  async getProject(
    org: string,
    project: string,
  ): Promise<ApiEnvelope<Project>> {
    return this.request<ApiEnvelope<Project>>(
      `/orgs/${encodeURIComponent(org)}/projects/${encodeURIComponent(project)}`,
    );
  }

  async listFeedback(
    org: string,
    project: string,
    status?: FeedbackStatus,
  ): Promise<ApiEnvelope<FeedbackSummary[]>> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";

    return this.request<ApiEnvelope<FeedbackSummary[]>>(
      `/orgs/${encodeURIComponent(org)}/projects/${encodeURIComponent(project)}/feedback${query}`,
    );
  }

  async getFeedback(id: string): Promise<ApiEnvelope<FeedbackDetail>> {
    return this.request<ApiEnvelope<FeedbackDetail>>(
      `/feedback/${encodeURIComponent(id)}`,
    );
  }

  async createFeedback(
    org: string,
    project: string,
    input: CreateFeedbackInput,
  ): Promise<ApiEnvelope<FeedbackDetail>> {
    return this.request<ApiEnvelope<FeedbackDetail>>(
      `/orgs/${encodeURIComponent(org)}/projects/${encodeURIComponent(project)}/feedback`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
  }

  async updateFeedbackStatus(
    id: string,
    status: FeedbackStatus,
  ): Promise<ApiEnvelope<FeedbackDetail>> {
    return this.request<ApiEnvelope<FeedbackDetail>>(
      `/feedback/${encodeURIComponent(id)}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      },
    );
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    headers.set("authorization", `Bearer ${this.apiKey}`);

    if (init.body) {
      headers.set("content-type", "application/json");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    const text = await response.text();
    const payload = safeParseJson(text);

    if (!response.ok) {
      const details = normalizeApiErrorPayload(payload);
      throw new CliError(formatApiError(details), { details });
    }

    if (payload === undefined) {
      throw new CliError("The Kikuyo API returned an empty response.");
    }

    return payload as T;
  }
}

function safeParseJson(value: string): unknown {
  if (value.trim().length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new CliError("The Kikuyo API returned invalid JSON.");
  }
}
