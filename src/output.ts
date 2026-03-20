import type {
  ApiEnvelope,
  FeedbackDetail,
  FeedbackSummary,
  Org,
  OrgDetail,
  Project,
} from "./types.js";

export function printJson(payload: ApiEnvelope<unknown>): void {
  console.log(JSON.stringify(payload, null, 2));
}

export function printOrgList(orgs: Org[]): void {
  if (orgs.length === 0) {
    console.log("No organizations found.");
    return;
  }

  console.table(
    orgs.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      updated_at: org.updated_at,
    })),
  );
}

export function printOrgDetail(org: OrgDetail): void {
  printDetail([
    ["ID", org.id],
    ["Name", org.name],
    ["Slug", org.slug],
    ["Inserted At", org.inserted_at],
    ["Updated At", org.updated_at],
  ]);

  console.log("");

  if (org.projects.length === 0) {
    console.log("Projects: none");
    return;
  }

  console.log("Projects:");
  console.table(
    org.projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description ?? "",
    })),
  );
}

export function printProjectList(projects: Project[]): void {
  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }

  console.table(
    projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description ?? "",
      updated_at: project.updated_at,
    })),
  );
}

export function printProjectDetail(project: Project): void {
  printDetail([
    ["ID", project.id],
    ["Name", project.name],
    ["Slug", project.slug],
    ["Description", project.description ?? ""],
    ["Inserted At", project.inserted_at],
    ["Updated At", project.updated_at],
  ]);
}

export function printFeedbackList(items: FeedbackSummary[]): void {
  if (items.length === 0) {
    console.log("No feedback found.");
    return;
  }

  console.table(
    items.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      vote_count: item.vote_count,
      updated_at: item.updated_at,
    })),
  );
}

export function printFeedbackDetail(item: FeedbackDetail): void {
  printDetail([
    ["ID", item.id],
    ["Title", item.title],
    ["Status", item.status],
    ["Vote Count", item.vote_count],
    ["Project ID", item.project_id],
    ["User ID", item.user_id ?? ""],
    ["Inserted At", item.inserted_at],
    ["Updated At", item.updated_at],
  ]);

  console.log("");
  console.log("Body:");
  console.log(item.body ?? "");
}

function printDetail(rows: Array<[string, string | number]>): void {
  for (const [label, value] of rows) {
    console.log(`${label}: ${value}`);
  }
}
