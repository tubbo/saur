const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";

import New from "./cli/new.js";
import Generate from "./cli/generate.js";
import Help from "./cli/help.js";
import Run from "./cli/run.js";
import Server from "./cli/server.js";

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
    Server();
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
