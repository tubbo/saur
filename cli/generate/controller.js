import GenerateView from "./view.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { __ } from "https://deno.land/x/dirname/mod.ts";
import pascalCase from "https://deno.land/x/case/pascalCase.ts";

const { __dirname } = __(import.meta);
const { cwd } = Deno;

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
    `${__dirname}/templates/controller.ejs`,
    context,
  );
  const test = await renderFile(`${__dirname}/templates/test.ejs`, context);

  await Deno.writeFile(
    `${cwd()}/controllers/${name}.js`,
    encoder.encode(controller.toString()),
  );
  await Deno.writeFile(
    `${cwd()}/tests/controllers/${name}_test.js`,
    encoder.encode(test.toString()),
  );
  console.log(`Created ${className} in controllers/${name}.js`);

  actions.forEach((action) => {
    const path = `${name}/${action}`;

    GenerateView(path, pascalCase(path), options, encoder);
  });
}
