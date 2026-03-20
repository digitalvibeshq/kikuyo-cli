import type { Argv, CommandModule } from "yargs";

import type { GlobalOptions } from "../config.js";
import { createCommandContext } from "../context.js";
import { CliError } from "../errors.js";
import { printJson, printOrgDetail, printOrgList } from "../output.js";

export function registerOrgCommands(yargs: Argv): Argv {
  return yargs.command(createOrgCommand());
}

function createOrgCommand(): CommandModule {
  return {
    command: "orgs <command>",
    describe: "List and inspect organizations",
    builder: (commandYargs) =>
      commandYargs
        .command(
          "list",
          "List organizations available to the API key",
          (listYargs) => listYargs,
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const response = await context.client.listOrgs();

            if (context.json) {
              printJson(response);
              return;
            }

            printOrgList(response.data);
          },
        )
        .command(
          "get <org>",
          "Get organization details by UUID or slug",
          (getYargs) =>
            getYargs.positional("org", {
              describe: "Organization UUID or slug",
              type: "string",
            }),
          async (argv) => {
            const context = createCommandContext(argv as GlobalOptions);
            const org = requireString((argv as { org?: string }).org, "org");
            const response = await context.client.getOrg(org);

            if (context.json) {
              printJson(response);
              return;
            }

            printOrgDetail(response.data);
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
