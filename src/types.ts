export const FEEDBACK_STATUSES = [
  "pending",
  "planned",
  "in_progress",
  "completed",
  "rejected",
] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export interface ApiEnvelope<T> {
  data: T;
}

export interface ApiErrorPayload {
  error: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  inserted_at: string;
  updated_at: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface OrgDetail extends Org {
  projects: ProjectSummary[];
}

export interface Project extends ProjectSummary {
  inserted_at: string;
  updated_at: string;
}

export interface FeedbackSummary {
  id: string;
  title: string;
  status: FeedbackStatus;
  vote_count: number;
  project_id: string;
  user_id: string | null;
  inserted_at: string;
  updated_at: string;
}

export interface FeedbackDetail extends FeedbackSummary {
  body: string | null;
}

export interface CreateFeedbackInput {
  title: string;
  body?: string;
}
