import { ejs } from "../assets.js";

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default async function (name, className, encoder, options, ...actions) {
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const context = { name, className, methods };
  const controller = ejs(`cli/templates/mailer.ejs`, context);
  const test = ejs(`cli/templates/test.ejs`, context);

  await Deno.writeFile(`mailers/${name}.js`, encoder.encode(controller));
  await Deno.writeFile(`tests/mailers/${name}_test.js`, encoder.encode(test));
  console.log(`Created ${className} in controllers/${name}.js`);
}
