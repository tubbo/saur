/**
 * `saur generate controller NAME`
 *
 * This generates a controller class and its test.
 */
export default function GenerateController(name, className) {
  const controller = `import Controller from "https://deno.land/x/saur/controller.js"

  export default class ${className}Controller extends Controller {
  }
  `
  const test = `import { assert } from "https://deno.land/std/testing/asserts.ts"
  import ${className}Controller from "../../controllers/${name}.js"

  Deno.test("${className}Controller", () => {
    assert(true)
  })
  `

  Deno.writeFileSync(`controllers/${name}.js`, encoder.encode(controller))
  Deno.writeFileSync(`tests/controllers/${name}_test.js`, encoder.encode(test))
  console.log(`Created ${className} in controllers/${name}.js`)
}
