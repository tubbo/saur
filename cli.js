const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";
import { readJsonSync } from "https://deno.land/std/fs/read_json.ts";

import New from "./cli/new.js";
import Generate from "./cli/generate.js";
import Help from "./cli/help.js";
import Run from "./cli/run.js";
import Server from "./cli/server.js";
import Upgrade from "./cli/upgrade.js";
import Migrate from "./cli/migrate.js";
import Loader from "./loader.js";

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

const json = new Loader({
  base: "https://deno.land/x/saur",
  reader: readJsonSync,
});
const config = await json.require("./package.json");

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
  case "migrate":
    Migrate();
    break;
  case "help":
    Help(options, ...argv);
    break;
  default:
    Help(options);
    break;
}
