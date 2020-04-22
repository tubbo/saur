import GenerateView from "./view.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";
import pascalCase from "https://deno.land/x/case/pascalCase.ts";

const root = dirname(import.meta.url);
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
  const controllerPath = `${root}/templates/controller.ejs`;
  const controller = await renderFile(controllerPath, context);
  const test = await renderFile(`${root}/templates/test.ejs`, context);
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
