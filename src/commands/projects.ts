import type { Argv, CommandModule } from "yargs";

import type { GlobalOptions } from "../config.js";
import { createCommandContext } from "../context.js";
import { CliError } from "../errors.js";
import { printJson, printProjectDetail, printProjectList } from "../output.js";

export function registerProjectCommands(yargs: Argv): Argv {
  return yargs.command(createProjectCommand());
}

function createProjectCommand(): CommandModule {
  return {
    command: "projects <command>",
    describe: "List and inspect projects",
    builder: (commandYargs) =>
      commandYargs
        .command(
          "list <org>",
          "List projects for an organization by org UUID or slug",
          (listYargs) =>
            listYargs.positional("org", {
              describe: "Organization UUID or slug",
              type: "string",
            }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const org = requireString((argv as { org?: string }).org, "org");
            const response = await context.client.listProjects(org);

            if (context.json) {
              printJson(response);
              return;
            }

            printProjectList(response.data);
          },
        )
        .command(
          "get <org> <project>",
          "Get project details by org and project UUID or slug",
          (getYargs) =>
            getYargs
              .positional("org", {
                describe: "Organization UUID or slug",
                type: "string",
              })
              .positional("project", {
                describe: "Project UUID or slug",
                type: "string",
              }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const org = requireString((argv as { org?: string }).org, "org");
            const project = requireString(
              (argv as { project?: string }).project,
              "project",
            );
            const response = await context.client.getProject(org, project);

            if (context.json) {
              printJson(response);
              return;
            }

            printProjectDetail(response.data);
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
