import { titleCase } from "https://deno.land/x/case/mod.ts";

const encoder = new TextEncoder();

export default async function New(name) {
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
  const env = `export default {
    // put your environment-specific configuration here
  }`;

  console.log("Creating new application", name);
  await Deno.mkdir(name);
  await Deno.mkdir(`${name}/bin`);
  await Deno.mkdir(`${name}/controllers`);
  await Deno.mkdir(`${name}/config`);
  await Deno.mkdir(`${name}/config/environments`);
  await Deno.mkdir(`${name}/models`);
  await Deno.mkdir(`${name}/mailers`);
  await Deno.mkdir(`${name}/templates`);
  await Deno.mkdir(`${name}/tests`);
  await Deno.mkdir(`${name}/tests/controllers`);
  await Deno.mkdir(`${name}/tests/models`);
  await Deno.mkdir(`${name}/tests/mailers`);
  await Deno.mkdir(`${name}/tests/views`);
  await Deno.mkdir(`${name}/views`);
  await Deno.mkdir(`${name}/src`);
  Deno.writeFileSync(`${name}/index.js`, encoder.encode(app));
  Deno.writeFileSync(`${name}/templates/layout.ejs`, encoder.encode(layout));
  Deno.writeFileSync(
    `${name}/config/environments/development.js`,
    encoder.encode(env)
  );
  Deno.writeFileSync(
    `${name}/config/environments/test.js`,
    encoder.encode(env)
  );
  Deno.writeFileSync(
    `${name}/config/environments/production.js`,
    encoder.encode(env)
  );
  console.log("Creating bin/server");
  Deno.run({
    cmd: [
      "deno",
      "install",
      "--allow-read",
      "--allow-write",
      "--allow-net",
      `${name}/bin/server`,
      `${name}/index.js`,
    ],
  });
  Deno.run({ cmd: ["yarn", "init", "-yp"] });
  Deno.run({ cmd: ["yarn", "add", "webpack", "prettier", "-D"] });
}
