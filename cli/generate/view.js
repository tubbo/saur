import GenerateTemplate from "./template.js";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";
import { ejs } from "../assets.js";

export default async function GenerateView(name, klass, encoder, options) {
  const className = `${klass}View`;
  const view = ejs(`cli/templates/view.ejs`, { name, className });
  const file = `views/${name}.js`;
  const dir = dirname(file);

  if (!existsSync(dir)) {
    await Deno.mkdir(dir);
  }

  await Deno.writeFile(file, encoder.encode(view.toString()));
  console.log(`Created ${className} in views/${name}.js`);

  GenerateTemplate(name, null, encoder, options);
}
