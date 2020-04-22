import GenerateModel from "./generate/model.js";
import GenerateController from "./generate/controller.js";
import GenerateView from "./generate/view.js";
import GenerateTemplate from "./generate/template.js";
import GenerateComponent from "./generate/component.js";
import pascalCase from "https://deno.land/x/case/pascalCase.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

const { cwd, exit } = Deno;

/**
 * The `saur generate` command is used to generate boilerplate code for
 * you to edit later.
 */
export default function Generate(options, type, name, ...args) {
  const className = pascalCase(name);
  const USAGE =
    "Usage: saur generate [model|view|controller|template|help] NAME [OPTIONS]";
  const encoder = new TextEncoder();
  const config = "config/server.js";
  const app = existsSync(`${cwd()}/${config}`);

  if (!app) {
    console.error(`Error: ${config} not found. Are you in a Saur application?`);
    exit(1);
    return;
  }

  switch (type) {
    case "model":
      GenerateModel(name, className, encoder, options, ...args);
      break;
    case "controller":
      GenerateController(name, className, encoder, options, ...args);
      break;
    case "view":
      GenerateView(name, className, encoder, options, ...args);
      GenerateTemplate(name, className, encoder, options, ...args);
      break;
    case "template":
      GenerateTemplate(name, className, encoder, options, ...args);
      break;
    case "component":
      GenerateComponent(name, className, encoder, options, ...args);
      break;
    case "resource":
      GenerateModel(name, className, encoder, options, ...args);
      GenerateController(name, className, encoder, options, ...args);
      break;
    default:
      console.log("Invalid generator", type);
      console.log(USAGE);
      exit(1);
      break;
  }
}
