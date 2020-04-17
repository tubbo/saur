import GenerateModel from "./generate/model.js";
import GenerateController from "./generate/controller.js";
import GenerateView from "./generate/view.js";
import GenerateTemplate from "./generate/template.js";

/**
 * The `saur generate` command is used to generate boilerplate code for
 * you to edit later.
 */
export default function Generate(type, name) {
  const className = pascalCase(name);
  const USAGE =
    "Usage: saur generate [model|view|controller|template|help] NAME [OPTIONS]";

  switch (type) {
    case "model":
      GenerateModel(name, className);
      break;
    case "controller":
      GenerateController(name, className);
      break;
    case "view":
      GenerateView(name, className);
      GenerateTemplate(name, className);
      break;
    case "template":
      GenerateTemplate(name, className);
      break;
    case "resource":
      GenerateModel(name, className);
      GenerateController(name, className);
    default:
      console.log("Invalid generator", type);
      console.log(USAGE);
      Deno.exit(1);
  }
}
