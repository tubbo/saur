import GenerateMigration from "./migration.js";
import GenerateTest from "./test.js";
import { ejs } from "../assets.js";

export default async function (name, className, encoder, options, ...fields) {
  const context = { name, className };
  const model = ejs(`cli/templates/model.ejs`, context);

  await Deno.writeFile(`models/${name}.js`, encoder.encode(model.toString()));

  console.log(`Created new model ${className} in models/${name}.js`);
  GenerateTest(`models/${name}`, className, options, encoder);

  if (fields.length) {
    const migration = `Create${className}s`;
    const table = `create_${name}s`;

    GenerateMigration(table, migration, options, encoder, ...fields);
  }
}
