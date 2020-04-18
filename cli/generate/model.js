import GenerateMigration from "./migration.js";

export default function GenerateModel(name, className, encoder, ...fields) {
  const model = `import Model from "https://deno.land/x/saur/model.js"

  export default class ${className} extends Model {
  }
  `;
  const test = `import { assert } from "https://deno.land/std/testing/asserts.ts"
  import ${className} from "../../models/${name}.js"

  Deno.test("${className}", () => {
    assert(true)
  })
  `;

  Deno.writeFileSync(`models/${name}.js`, encoder.encode(model));
  Deno.writeFileSync(`tests/models/${name}_test.js`, encoder.encode(test));
  console.log(`Created new model ${className} in models/${name}.js`);

  if (fields.length) {
    GenerateMigration(`create_${name}s`, `Create${name}s`, ...fields);
  }
}
