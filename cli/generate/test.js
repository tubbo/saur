import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const root = dirname(import.meta.url).replace("file://", "");

export default async function GenerateTest(name, className, options, encoder) {
  const context = { name, className };
  const test = await renderFile(`${root}/templates/test.ejs`, context);

  await Deno.writeFile(`tests/${name}.js`, encoder.encode(test.toString()));
  console.log(`Created test for ${className} in tests/${name}.js`);
}
