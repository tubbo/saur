import GenerateTemplate from "./template.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default async function (name, klass, encoder, ...actions) {
  const className = `${klass}Controller`;
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const context = { name, className, methods };
  const controller = await renderFile("./cli/generate/templates/controller.ejs", context);
  const test = await renderFile("./cli/generate/templates/test.ejs", context);

  await Deno.writeFile(`controllers/${name}.js`, encoder.encode(controller));
  await Deno.writeFile(
    `tests/controllers/${name}_test.js`,
    encoder.encode(test)
  );
  console.log(`Created ${className} in controllers/${name}.js`);

  actions.forEach((action) => GenerateTemplate(`${name}/${action}`));
}
