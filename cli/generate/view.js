export default function View(name, className, encoder) {
  const view = `import View from "https://deno.land/x/saur/view.js"

  export default class ${className}View extends View {
  }
  `;

  Deno.writeFileSync(`views/${name}.js`, encoder.encode(view));
  console.log(`Created ${className} in views/${name}.js`);
}
