import type { Argv, CommandModule } from "yargs";

import type { GlobalOptions } from "../config.js";
import { createCommandContext } from "../context.js";
import { CliError } from "../errors.js";
import {
  printFeedbackDetail,
  printFeedbackList,
  printJson,
} from "../output.js";
import { FEEDBACK_STATUSES, type FeedbackStatus } from "../types.js";

export function registerFeedbackCommands(yargs: Argv): Argv {
  return yargs.command(createFeedbackCommand());
}

function createFeedbackCommand(): CommandModule {
  return {
    command: "feedback <command>",
    describe: "List, create, and inspect feedback items",
    builder: (commandYargs) =>
      commandYargs
        .command(
          "list <org> <project>",
          "List feedback for a project by org and project UUID or slug",
          (listYargs) =>
            listYargs
              .positional("org", {
                describe: "Organization UUID or slug",
                type: "string",
              })
              .positional("project", {
                describe: "Project UUID or slug",
                type: "string",
              })
              .option("status", {
                choices: FEEDBACK_STATUSES,
                describe: "Filter feedback by status",
                type: "string",
              }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const org = requireString((argv as { org?: string }).org, "org");
            const project = requireString(
              (argv as { project?: string }).project,
              "project",
            );
            const response = await context.client.listFeedback(
              org,
              project,
              (argv as { status?: FeedbackStatus }).status,
            );

            if (context.json) {
              printJson(response);
              return;
            }

            printFeedbackList(response.data);
          },
        )
        .command(
          "get <id>",
          "Get feedback details by feedback UUID",
          (getYargs) =>
            getYargs.positional("id", {
              describe: "Feedback UUID",
              type: "string",
            }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const id = requireString((argv as { id?: string }).id, "id");
            const response = await context.client.getFeedback(id);

            if (context.json) {
              printJson(response);
              return;
            }

            printFeedbackDetail(response.data);
          },
        )
        .command(
          "create <org> <project>",
          "Create a feedback item for a project",
          (createYargs) =>
            createYargs
              .positional("org", {
                describe: "Organization UUID or slug",
                type: "string",
              })
              .positional("project", {
                describe: "Project UUID or slug",
                type: "string",
              })
              .option("title", {
                demandOption: true,
                describe: "Feedback title",
                type: "string",
              })
              .option("body", {
                describe: "Optional feedback body",
                type: "string",
              }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const org = requireString((argv as { org?: string }).org, "org");
            const project = requireString(
              (argv as { project?: string }).project,
              "project",
            );
            const title = requireString(
              (argv as { title?: string }).title,
              "title",
            );
            const body = (argv as { body?: string }).body;
            const response = await context.client.createFeedback(org, project, {
              title,
              body,
            });

            if (context.json) {
              printJson(response);
              return;
            }

            printFeedbackDetail(response.data);
          },
        )
        .command(
          "update-status <id>",
          "Update the status of a feedback item by UUID",
          (updateYargs) =>
            updateYargs
              .positional("id", {
                describe: "Feedback UUID",
                type: "string",
              })
              .option("status", {
                choices: FEEDBACK_STATUSES,
                demandOption: true,
                describe: "New feedback status",
                type: "string",
              }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const id = requireString((argv as { id?: string }).id, "id");
            const status = requireString(
              (argv as { status?: string }).status,
              "status",
            ) as FeedbackStatus;
            const response = await context.client.updateFeedbackStatus(
              id,
              status,
            );

            if (context.json) {
              printJson(response);
              return;
            }

            printFeedbackDetail(response.data);
          },
        )
        .demandCommand(1)
        .strictCommands(),
    handler: () => undefined,
  };
}

function requireString(value: string | undefined, name: string): string {
  if (value) {
    return value;
  }

  throw new CliError(`Missing required argument: ${name}`);
}
