import { require, ejs } from "./assets.js";
import { titleCase } from "https://deno.land/x/case/mod.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const packages = [
  "mini-css-extract-plugin",
  "css-loader",
  "eslint-plugin-prettier",
  "eslint",
  "babel-eslint",
  "stylelint-config-recommended",
  "webpack-cli",
];

export default async function New(options, name) {
  let errors;
  let command;

  try {
    const title = titleCase(name);
    const app = require(`cli/generate/templates/application.js`);
    const server = require(`cli/generate/templates/server.js`);
    const webpack = require(`cli/generate/templates/webpack.js`);
    const layout = ejs(`cli/generate/templates/layout.ejs`, {
      title,
    });
    const env = require(`cli/generate/templates/env-config.js`);
    const ui = require(`cli/generate/templates/ui.js`);
    const css = require(`cli/generate/templates/ui.css`);

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
      `${name}/webpack.config.js`,
      encoder.encode(decoder.decode(webpack)),
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
    await Deno.writeFile(
      `${name}/index.js`,
      encoder.encode(decoder.decode(app)),
    );
    await Deno.writeFile(
      `${name}/src/index.js`,
      encoder.encode(decoder.decode(ui)),
    );
    await Deno.writeFile(
      `${name}/src/index.css`,
      encoder.encode(decoder.decode(css)),
    );

    console.log("Installing dependencies...");

    command = Deno.run({
      cmd: [
        "deno",
        "install",
        `--allow-read=./${name}`,
        `--allow-write=./${name}`,
        "--allow-net",
        "--root",
        `./${name}/bin`,
        "server",
        `${name}/config/server.js`,
      ],
    });
    errors = await command.errors;
    await command.status();

    if (!errors) {
      console.log("Installing frontend dependencies...");
      command = Deno.run({ cmd: ["yarn", "init", "-yps"], cwd: name });
      errors = await command.errors;
      await command.status();
    }

    if (!errors) {
      command = Deno.run({
        cmd: ["yarn", "add", "webpack", "-D", "-s", ...packages],
        cwd: name,
      });
      errors = await command.errors;
      await command.status();
    }

    if (errors) {
      throw new Error(`Error installing dependencies: ${errors}`);
    }

    const original = await import(`${Deno.cwd()}/${name}/package.json`);
    const config = { ...original };

    config.scripts = {
      build: "webpack",
      start: "saur server",
    };
    config.eslintConfig = {
      extends: ["eslint:recommended", "prettier"],
      parser: "babel-eslint",
      env: { browser: true },
    };
    config.stylelint = {
      extends: "stylelint-config-recommended",
    };
    const json = encoder.encode(JSON.stringify(config, null, 2));

    Deno.writeFile(`${name}/package.json`, json);

    console.log(`Application '${name}' has been created!`);
    Deno.exit(0);
  } catch (e) {
    console.error(`Application '${name}' failed to create:`);
    console.error(e);
    Deno.exit(1);
  }
}
