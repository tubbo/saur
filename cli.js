const { args } = Deno
import { parse } from "https://deno.land/std/flags/mod.ts"

const encoder = new TextEncoder()
const { _: [name, ...argv] } = parse(args)
const App = `import Application from "https://deno.land/x/saur/application.js"

const App = new Application()

App.routes.draw(({ root }) => {
  // root("index", HomeController)
})

App.start()
`

console.log("Creating new application", name)
await Deno.mkdir(name)
Deno.writeFileSync(`${name}/index.js`, encoder.encode(App))
console.log("Creating bin/server")
Deno.run({ cmd: ['deno', 'install', '--allow-read', '--allow-write', '--allow-net', `${name}/bin/server`, `${name}/index.js` ] })
