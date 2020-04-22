import GenerateMigration from "./migration.js";
import GenerateTest from "./test.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const root = dirname(import.meta.url).replace("file://", "");

export default async function (name, className, encoder, options, ...fields) {
  const context = { name, className };
  const model = await renderFile(`${root}/templates/model.ejs`, context);

  await Deno.writeFile(`models/${name}.js`, encoder.encode(model));
  console.log(`Created new model ${className} in models/${name}.js`);
  GenerateTest(`models/${name}`, className, encoder);

  if (fields.length) {
    GenerateMigration(`create_${name}s`, `Create${name}s`, options, ...fields);
  }
}
