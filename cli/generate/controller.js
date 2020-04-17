export default function GenerateController(name, className) {
  const controller = `import Controller from "https://deno.land/x/saur/controller.js"

  export default class ${className}Controller extends Controller {
  }
  `
  Deno.writeFileSync(`controllers/${name}.js`, encoder.encode(controller))
  console.log(`Created ${className} in controllers/${name}.js`)
}
