const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";
import config from "./package.json";

import New from "./cli/new.js";
import Generate from "./cli/generate.js";
import Help from "./cli/help.js";
import Run from "./cli/run.js";
import Server from "./cli/server.js";
import Upgrade from "./cli/upgrade.js";

let {
  _: [command, ...argv],
  help,
  v,
  version,
  ...options
} = parse(args);
help = help || options.h || options.help;

if (help) {
  await Help(options, command, ...argv);
  Deno.exit(0);
}

if (v || version) {
  console.log(`Saur ${config.version}`);
  Deno.exit(0);
}

switch (command) {
  case "new":
    New(options, ...argv);
    break;
  case "server":
    Server(options);
    break;
  case "generate":
    Generate(options, ...argv);
    break;
  case "run":
    Run(options, ...argv);
    break;
  case "upgrade":
    Upgrade();
    break;
  case "help":
    Help(options, ...argv);
    break;
  default:
    Help(options);
    break;
}
