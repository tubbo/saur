import GenerateModel from "./generate/model.js";
import GenerateController from "./generate/controller.js";
import GenerateView from "./generate/view.js";
import GenerateTemplate from "./generate/template.js";
import pascalCase from "https://deno.land/x/case/pascalCase.ts";

/**
 * The `saur generate` command is used to generate boilerplate code for
 * you to edit later.
 */
export default function Generate(type, name) {
  const className = pascalCase(name);
  const USAGE =
    "Usage: saur generate [model|view|controller|template|help] NAME [OPTIONS]";
  const encoder = new TextEncoder();

  switch (type) {
    case "model":
      GenerateModel(name, className, encoder);
      break;
    case "controller":
      GenerateController(name, className, encoder);
      break;
    case "view":
      GenerateView(name, className, encoder);
      GenerateTemplate(name, className, encoder);
      break;
    case "template":
      GenerateTemplate(name, className, encoder);
      break;
    case "resource":
      GenerateModel(name, className);
      GenerateController(name, className, encoder);
      break;
    default:
      console.log("Invalid generator", type);
      console.log(USAGE);
      Deno.exit(1);
      break;
  }
}
