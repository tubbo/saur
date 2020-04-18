export default function Test(name, className, encoder) {
  const test =
    `import { assert } from "https://deno.land/std/testing/asserts.ts"

  Deno.test("${className}", () => {
    assert(true)
  })
  `;

  Deno.writeFileSync(`tests/${name}.js`, encoder.encode(test));
  console.log(`Created test for ${className} in tests/${name}.js`);
}
