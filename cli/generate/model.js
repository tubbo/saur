import GenerateMigration from "./migration.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

export default async function (name, className, encoder, ...fields) {
  const context = { name, className };
  const model = await renderFile("./cli/generate/templates/model.ejs", context);
  const test = await renderFile("./cli/generate/templates/test.ejs", context);

  Deno.writeFileSync(`models/${name}.js`, encoder.encode(model));
  Deno.writeFileSync(`tests/models/${name}_test.js`, encoder.encode(test));
  console.log(`Created new model ${className} in models/${name}.js`);

  if (fields.length) {
    GenerateMigration(`create_${name}s`, `Create${name}s`, ...fields);
  }
}
