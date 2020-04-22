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
  const controller = await renderFile(
    `${root}/templates/controller.ejs`,
    context,
  );
  const test = await renderFile(`${root}/templates/test.ejs`, context);

  await writeFile(
    `${cwd()}/controllers/${name}.js`,
    encoder.encode(controller.toString()),
  );
  await writeFile(
    `${cwd()}/tests/controllers/${name}_test.js`,
    encoder.encode(test.toString()),
  );
  console.log(`Created ${className} in controllers/${name}.js`);

  actions.forEach((action) => {
    const path = `${name}/${action}`;
    const className = pascalCase(path);

    GenerateView(path, className, options, encoder);
  });
}
