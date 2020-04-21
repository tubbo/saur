const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default async function New(options, name) {
  let errors;
  let command;

  try {
    // const title = titleCase(name);
    const app = await Deno.readFile("./cli/generate/templates/application.js");
    const server = await Deno.readFile("./cli/generate/templates/server.js");
    const layout = ""; //await renderFile("./cli/generate/templates/layout.ejs", {
    //title,
    //});
    const env = await Deno.readFile("./cli/generate/templates/env-config.js");

    console.log(`Creating new application '${name}'...`);

    await Deno.mkdir(name);
    await Deno.mkdir(`${name}/bin`);
    await Deno.mkdir(`${name}/controllers`);
    await Deno.mkdir(`${name}/config`);
    await Deno.mkdir(`${name}/config/environments`);
    await Deno.mkdir(`${name}/models`);
    await Deno.mkdir(`${name}/mailers`);
    await Deno.mkdir(`${name}/templates`);
    await Deno.mkdir(`${name}/templates/layouts`);
    await Deno.mkdir(`${name}/tests`);
    await Deno.mkdir(`${name}/tests/controllers`);
    await Deno.mkdir(`${name}/tests/models`);
    await Deno.mkdir(`${name}/tests/mailers`);
    await Deno.mkdir(`${name}/tests/views`);
    await Deno.mkdir(`${name}/views`);
    await Deno.mkdir(`${name}/src`);
    await Deno.writeFile(
      `${name}/index.js`,
      encoder.encode(decoder.decode(app)),
    );
    await Deno.writeFile(
      `${name}/config/server.js`,
      encoder.encode(decoder.decode(server)),
    );
    await Deno.writeFile(
      `${name}/templates/layouts/default.html.ejs`,
      encoder.encode(layout.toString()),
    );
    await Deno.writeFile(
      `${name}/config/environments/development.js`,
      encoder.encode(decoder.decode(env)),
    );
    await Deno.writeFile(
      `${name}/config/environments/test.js`,
      encoder.encode(decoder.decode(env)),
    );
    await Deno.writeFile(
      `${name}/config/environments/production.js`,
      encoder.encode(decoder.decode(env)),
    );
    console.log("Creating bin/server...");

    command = Deno.run({
      cmd: [
        "deno",
        "install",
        `--allow-read=./${name}`,
        `--allow-write=./${name}`,
        "--allow-net",
        "--dir",
        `./${name}/bin`,
        "server",
        `${name}/config/server.js`,
      ],
    });
    errors = await command.errors;

    if (!errors) {
      console.log("Installing frontend dependencies...");
      command = Deno.run({ cmd: ["yarn", "init", "-yps"], cwd: name });
      errors = await command.errors;
    }

    if (!errors) {
      command = Deno.run({
        cmd: ["yarn", "add", "webpack", "prettier", "-D", "-s"],
        cwd: name,
      });
      errors = await command.errors;
      await command.status();
    }

    if (errors) {
      throw new Error(`Error installing dependencies: ${errors}`);
    }

    console.log(`Application '${name}' has been created!`);
    Deno.exit(0);
  } catch (e) {
    console.error(`Application '${name}' failed to create:`);
    console.error(e);
    Deno.exit(1);
  }
}
