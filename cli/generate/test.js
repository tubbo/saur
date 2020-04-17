export default function Test(name, className) {
  const test = `import { assert } from "https://deno.land/std/testing/asserts.ts"

  Deno.test("${className}", () => {
    assert(true)
  })
  `

  Deno.writeFileSync(`tests/${name}.js`, encoder.encode(view))
  console.log(`Created test for ${className} in tests/${name}.js`)
}
