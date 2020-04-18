import { renderFile } from "https://deno.land/x/dejs/mod.ts";

export default async function GenerateView(name, klass, encoder) {
  const className = `${klass}View`;
  const view = await renderFile("./cli/generate/templates/view.ejs", {
    className,
  });

  await Deno.writeFile(`views/${name}.js`, encoder.encode(view));
  console.log(`Created ${className} in views/${name}.js`);
}
