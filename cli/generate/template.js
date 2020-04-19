import { dirname, basename } from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";

export default async function GenerateTemplate(name, className, encoder) {
  const template = `<h1>hello world</h1>`;
  const root = `${Deno.cwd()}/templates`;
  const dir = `${root}/${dirname(name)}`;
  const file = `${root}/${name}.ejs`;
  const source = encoder.encode(template);
  const base = basename(name);

  if (!existsSync(dir)) {
    await Deno.mkdir(dir);
  }

  if (!existsSync(file)) {
    await Deno.writeFile(file, source);
  }

  console.log(`Created Template for "${base}" in templates/${name}.ejs`);
}
