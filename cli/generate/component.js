import { ejs } from "../assets.js";
import { paramCase } from "https://deno.land/x/case/mod.ts";

const { cwd, writeFile } = Deno;

export default async function GenerateComponent(name, className, encoder) {
  const component = ejs("cli/templates/component.ejs", { name, className });
  const app = cwd();
  const source = encoder.encode(component);
  const path = `src/components/${name}`;
  const cssClass = paramCase(name);
  const css = `.${cssClass} {}`;

  await writeFile(`${app}/${path}.js`, source);
  await writeFile(`${app}/${path}.css`, css);
  console.log("Created new Component", className, "in", `${path}.js`);
}
