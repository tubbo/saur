import { renderFile } from "https://deno.land/x/dejs/mod.ts";

export default async function GenerateTest(name, className, encoder) {
  const context = { name, className };
  const test = await renderFile("./cli/generate/templates/test.ejs", context);

  await Deno.writeFile(`tests/${name}.js`, encoder.encode(test));
  console.log(`Created test for ${className} in tests/${name}.js`);
}
