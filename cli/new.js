import { titleCase } from "https://deno.land/x/case/mod.ts";

export default async function New() {
  const [name] = argv[0];
  const title = titleCase(name);
  const app = `import Application from "https://deno.land/x/saur/application.js"

  const App = new Application()

  App.routes.draw(({ root }) => {
    // root("index", HomeController)
  })

  App.start()
  `;
  const layout = `<!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <%- innerHTML %>
    </body>
  </html>
  `;

  console.log("Creating new application", name);
  await Deno.mkdir(name);
  await Deno.mkdir(`${name}/bin`);
  await Deno.mkdir(`${name}/controllers`);
  await Deno.mkdir(`${name}/models`);
  await Deno.mkdir(`${name}/mailers`);
  await Deno.mkdir(`${name}/templates`);
  await Deno.mkdir(`${name}/views`);
  Deno.writeFileSync(`${name}/index.js`, encoder.encode(app));
  Deno.writeFileSync(`${name}/templates/layout.ejs`, encoder.encode(layout));
  console.log("Creating bin/server");
  Deno.run(
    {
      cmd: [
        "deno",
        "install",
        "--allow-read",
        "--allow-write",
        "--allow-net",
        `${name}/bin/server`,
        `${name}/index.js`,
      ],
    },
  );
}
