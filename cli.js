const { args } = Deno
import { parse } from "https://deno.land/std/flags/mod.ts"
import { titleCase, pascalCase } from "https://deno.land/x/case/mod.ts"

import New from "./cli/new.js"
import Generate from "./cli/generate.js"
import USAGE from "./cli/usage.js"
import { Task } from "./task.js"

const encoder = new TextEncoder()
const { _: [command, ...argv], help } = parse(args)
let name

if (help) {
  console.log(USAGE)
  Deno.exit(0)
}

switch (command) {
  case "new":
    New(...argv)
    break
  case "server":
    Deno.run({ cmd: ['bin/server'] })
    break
  case "generate":
    Generate(...argv)
    break
  case "help":
    console.log(USAGE)
    break
  default:
    try {
      const task = Task.find(command)
      task.perform(...argv)
    } catch(e) {
      console.error(e.message)
      Deno.exit(1)
      break
    }

    console.log(USAGE)
    Deno.exit(1)
    break
}
