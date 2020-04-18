import { titleCase } from "https://deno.land/x/case/mod.ts";

const encoder = new TextEncoder();

export default async function New(name) {
  const title = titleCase(name);
  const app = await Deno.readFile("./generate/templates/application.js");
  const server = await Deno.readFile("./generate/templates/server.js");
  const layout = await Deno.readFile("./generate/templates/layout.ejs", {
    title,
  });
  const env = await Deno.readFile("./generate/templates/env-config.js");

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
  await Deno.writeFile(`${name}/index.js`, encoder.encode(app));
  await Deno.writeFile(`${name}/config/server.js`, encoder.encode(server));
  await Deno.writeFile(`${name}/templates/layout.ejs`, encoder.encode(layout));
  await Deno.writeFile(
    `${name}/config/environments/development.js`,
    encoder.encode(env)
  );
  await Deno.writeFile(
    `${name}/config/environments/test.js`,
    encoder.encode(env)
  );
  await Deno.writeFile(
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
