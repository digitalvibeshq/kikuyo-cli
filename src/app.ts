import { readFileSync } from "node:fs";

import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";

import { registerFeedbackCommands } from "./commands/feedback.js";
import { registerOrgCommands } from "./commands/orgs.js";
import { registerProjectCommands } from "./commands/projects.js";
import { CliError } from "./errors.js";

export function buildCli(args: string[]): Argv {
  let cli: Argv = yargs(args) as unknown as Argv;

  cli = cli
    .scriptName("kikuyo")
    .usage("$0 <command> [options]")
    .option("api-key", {
      describe: "Kikuyo API key. Falls back to KIKUYO_API_KEY.",
      type: "string",
    })
    .option("base-url", {
      describe:
        "Kikuyo base URL or API base URL. Defaults to https://kikuyo.app.",
      type: "string",
    })
    .option("json", {
      default: false,
      describe: "Print the raw API response body as JSON.",
      type: "boolean",
    })
    .alias("help", "h")
    .version(readPackageVersion())
    .strictCommands()
    .strictOptions()
    .recommendCommands()
    .demandCommand(1, "Use --help to view available commands.")
    .fail((message, error) => {
      if (error) {
        throw error;
      }

      throw new CliError(message ?? "The command failed.");
    })
    .help() as unknown as Argv;

  cli = registerOrgCommands(cli);
  cli = registerProjectCommands(cli);
  cli = registerFeedbackCommands(cli);

  return cli;
}

export async function runCli(
  args: string[] = hideBin(process.argv),
): Promise<number> {
  const jsonOutput = args.includes("--json");

  try {
    await buildCli(args).parseAsync();
    return 0;
  } catch (error) {
    printError(error, jsonOutput);
    return error instanceof CliError ? error.exitCode : 1;
  }
}

function printError(error: unknown, jsonOutput: boolean): void {
  if (jsonOutput && error instanceof CliError && error.details) {
    console.error(JSON.stringify(error.details, null, 2));
    return;
  }

  if (error instanceof Error) {
    console.error(error.message);
    return;
  }

  console.error(String(error));
}

function readPackageVersion(): string {
  try {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as { version?: string };

    return packageJson.version ?? "0.1.0";
  } catch {
    return "0.1.0";
  }
}
