const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";

import New from "./cli/new.js";
import Generate from "./cli/generate.js";
import Help from "./cli/help.js";
import Run from "./cli/run.js";

const {
  _: [command, ...argv],
  help,
} = parse(args);

if (help) {
  Help(command);
  Deno.exit(0);
}

switch (command) {
  case "new":
    New(...argv);
    break;
  case "server":
    try {
      Deno.run({ cmd: ["bin/server"] });
    } catch (e) {
      console.error("Server script not found. Are you in a Saur app?");
      Deno.exit(1);
    }
    break;
  case "generate":
    Generate(...argv);
    break;
  case "run":
    Run(...argv);
    break;
  case "help":
    Help(...argv);
    break;
  default:
    Help();
    break;
}
