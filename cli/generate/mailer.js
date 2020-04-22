import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const root = dirname(import.meta.url).replace("file://", "");

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default async function (name, className, encoder, options, ...actions) {
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const context = { name, className, methods };
  const controller = await renderFile(`${root}/templates/mailer.ejs`, context);
  const test = await renderFile(`${root}/templates/test.ejs`, context);

  await Deno.writeFile(`mailers/${name}.js`, encoder.encode(controller));
  await Deno.writeFile(`tests/mailers/${name}_test.js`, encoder.encode(test));
  console.log(`Created ${className} in controllers/${name}.js`);
}
