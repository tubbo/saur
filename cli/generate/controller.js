import GenerateTemplate from "./template.js";

/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default function GenerateController(name, klass, encoder, ...actions) {
  const className = `${klass}Controller`;
  const methods = actions.map((action) => `  ${action}() {}`).join("\n");
  const controller = `import Controller from "https://deno.land/x/saur/controller.js"

  export default class ${className} extends Controller {
    ${methods}
  }
  `;
  const test = `import { assert } from "https://deno.land/std/testing/asserts.ts"
  import ${className} from "../../controllers/${name}.js"

  Deno.test("${className}", () => {
    assert(true)
  })
  `;

  Deno.writeFileSync(`controllers/${name}.js`, encoder.encode(controller));
  Deno.writeFileSync(`tests/controllers/${name}_test.js`, encoder.encode(test));
  console.log(`Created ${className} in controllers/${name}.js`);

  actions.forEach((action) => GenerateTemplate(`${name}/${action}`));
}
