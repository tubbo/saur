const { args } = Deno
import { parse } from "https://deno.land/std/flags/mod.ts"
import { titleCase, pascalCase } from "https://deno.land/x/case/mod.ts"

const encoder = new TextEncoder()
const { _: [command, ...argv] } = parse(args)

switch (command) {
  case "new":
    const [name] = argv[0]
    const title = titleCase(name)
    const app = `import Application from "https://deno.land/x/saur/application.js"

    const App = new Application()

    App.routes.draw(({ root }) => {
      // root("index", HomeController)
    })

    App.start()
    `
    const layout = `<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <%- innerHTML %>
      </body>
    </html>
    `

    console.log("Creating new application", name)
    await Deno.mkdir(name)
    await Deno.mkdir(`${name}/templates`)
    await Deno.mkdir(`${name}/bin`)
    Deno.writeFileSync(`${name}/index.js`, encoder.encode(app))
    Deno.writeFileSync(`${name}/templates/layout.ejs`, encoder.encode(layout))
    console.log("Creating bin/server")
    Deno.run({ cmd: ['deno', 'install', '--allow-read', '--allow-write', '--allow-net', `${name}/bin/server`, `${name}/index.js` ] })
    break
  case "server":
    Deno.run({ cmd: ['bin/server'] })
    break
  case "generate":
    const [type, name] = argv
    const className = pascalCase(name)

    switch(type) {
      case "model":
        const model = `import Model from "https://deno.land/x/saur/model.js"

        export default class ${className} extends Model {
        }
        `
        Deno.writeFileSync(`models/${name}.js`, encoder.encode(model))
        console.log(`Created new model ${className} in models/${name}.js`)
        break
      case "controller":
        const controller = `import Controller from "https://deno.land/x/saur/controller.js"

        export default class ${className}Controller extends Controller {
        }
        `
        Deno.writeFileSync(`controllers/${name}.js`, encoder.encode(controller))
        console.log(`Created ${className} in controllers/${name}.js`)
        break
      case "view":
        const view = `import View from "https://deno.land/x/saur/view.js"

        export default class ${className}View extends View {
        }
        `
        Deno.writeFileSync(`views/${name}.js`, encoder.encode(view))
        console.log(`Created ${className} in views/${name}.js`)
        break
      case "template":
        const template = `<h1>hello world</h1>`
        Deno.writeFileSync(`layouts/${name}.ejs`, encoder.encode(template))
        console.log(`Created templates/${name}.ejs`)
        break
      default:
        console.log("Invalid generator", type)
        console.log("Usage: saur generate [model|view|controller] NAME [OPTIONS]")
        Deno.exit(1)
    }

    break
  default:
    console.log("Invalid command", command)
    console.log("Usage: soar [new|generate|server] [ARGUMENTS] [OPTIONS]")
    Deno.exit(1)
    break
}
