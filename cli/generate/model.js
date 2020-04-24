import GenerateMigration from "./migration.js";
import GenerateTest from "./test.js";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const root = dirname(import.meta.url).replace("file://", "");

export default async function (name, className, encoder, options, ...fields) {
  const context = { name, className };
  const model = await renderFile(`${root}/templates/model.ejs`, context);

  await Deno.writeFile(`models/${name}.js`, encoder.encode(model.toString()));

  console.log(`Created new model ${className} in models/${name}.js`);
  GenerateTest(`models/${name}`, className, options, encoder);

  if (fields.length) {
    const migration = `Create${name}s`;
    const table = `create_${name}s`;

    GenerateMigration(table, migration, options, encoder, ...fields);
  }
}
