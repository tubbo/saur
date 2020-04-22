import { dirname } from "https://deno.land/std/path/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { paramCase } from "https://deno.land/x/case/mod.ts";

const { cwd, writeFile } = Deno;
const root = dirname(import.meta.url);

export default async function (name, className, encoder) {
  const template = `${root}/templates/component.ejs`;
  const component = await renderFile(template, { name, className });
  const app = cwd();
  const source = encoder.encode(component);
  const path = `src/components/${name}`;
  const cssClass = paramCase(name);
  const css = `.${cssClass} {}`;

  await writeFile(`${app}/${path}.js`, source);
  await writeFile(`${app}/${path}.css`, css);
  console.log("Created new Component", className, "in", `${path}.js`);
}
