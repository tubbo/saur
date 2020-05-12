import { ejs } from "../assets.js";

export default async function GenerateTest(name, className, options, encoder) {
  const context = { name, className };
  const test = ejs(`cli/templates/test.ejs`, context);

  await Deno.writeFile(`tests/${name}.js`, encoder.encode(test.toString()));
  console.log(`Created test for ${className} in tests/${name}.js`);
}
