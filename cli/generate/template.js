import { dirname, basename } from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { __ } from "https://deno.land/x/dirname/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

const { __dirname } = __(import.meta);

export default async function GenerateTemplate(name, cn, encoder, options) {
  const format = options.f || "html";
  const language = "ejs";
  const root = `${Deno.cwd()}/templates`;
  const dir = `${root}/${dirname(name)}`;
  const file = `${root}/${name}.${format}.${language}`;
  const base = basename(name);
  const template = await renderFile(`${__dirname}/templates/template.ejs`, {
    name,
    file,
  });
  const source = encoder.encode(template.toString());

  if (!existsSync(dir)) {
    await Deno.mkdir(dir);
  }

  if (!existsSync(file)) {
    await Deno.writeFile(file, source);
  }

  console.log(
    `Created Template for "${base}" in templates/${name}.${format}.${language}`,
  );
}
