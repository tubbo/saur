import GenerateView from "./view.js";
import { ejs } from "../assets.js";
import pascalCase from "https://deno.land/x/case/pascalCase.ts";

const { cwd, writeFile } = Deno;

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default async function (name, klass, encoder, options, ...actions) {
  const className = `${klass}Controller`;
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const context = { name, className, methods };
  const controller = ejs("cli/templates/controller.ejs", context);
  const test = ejs(`cli/templates/test.ejs`, context);
  const needsView = (action) => !action.match(/(:bare)$/);
  const writeView = (action) => {
    const path = `${name}/${action}`;
    const className = pascalCase(path);

    GenerateView(path, className, options, encoder);
  };

  await writeFile(
    `${cwd()}/controllers/${name}.js`,
    encoder.encode(controller.toString()),
  );
  await writeFile(
    `${cwd()}/tests/controllers/${name}_test.js`,
    encoder.encode(test.toString()),
  );
  console.log(`Created ${className} in controllers/${name}.js`);

  actions.filter(needsView).forEach(writeView);
}
