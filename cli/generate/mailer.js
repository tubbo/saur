import { renderFile } from "https://deno.land/x/dejs/mod.ts";

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default async function (name, className, encoder, ...actions) {
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const context = { name, className, methods };
  const controller = await renderFile(
    "./cli/generate/templates/mailer.ejs",
    context
  );
  const test = await renderFile("./cli/generate/templates/test.ejs", context);

  await Deno.writeFile(`mailers/${name}.js`, encoder.encode(controller));
  await Deno.writeFile(`tests/mailers/${name}_test.js`, encoder.encode(test));
  console.log(`Created ${className} in controllers/${name}.js`);
}
