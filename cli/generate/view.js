import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import GenerateTemplate from "./template.js";
import { dirname } from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { __ } from "https://deno.land/x/dirname/mod.ts";

const { __dirname } = __(import.meta);

export default async function GenerateView(name, klass, encoder, options) {
  const className = `${klass}View`;
  const view = await renderFile(`${__dirname}/templates/view.ejs`, {
    name,
    className,
  });
  const file = `views/${name}.js`;
  const dir = dirname(file);

  if (!existsSync(dir)) {
    await Deno.mkdir(dir);
  }

  await Deno.writeFile(file, encoder.encode(view.toString()));
  console.log(`Created ${className} in views/${name}.js`);

  GenerateTemplate(name, null, encoder, options);
}
