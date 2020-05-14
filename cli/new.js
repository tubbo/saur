import { ejs } from "./assets.js";
import Loader from "../loader.js";
import { titleCase } from "https://deno.land/x/case/mod.ts";
import { encode, decode } from "https://deno.land/std/encoding/utf8.ts";
import { readJson } from "https://deno.land/std/fs/read_json.ts";

const { mkdir, writeFile, run } = Deno;
const packages = [
  "mini-css-extract-plugin",
  "css-loader",
  "eslint-plugin-prettier",
  "eslint",
  "babel-eslint",
  "stylelint-config-recommended",
  "webpack-cli",
];

const loader = new Loader({ base: "https://deno.land/x/saur" });
const require = loader.require.bind(loader);

export default async function New(options, name) {
  let errors;
  let command;

  try {
    const title = titleCase(name);
    const app = await require(`cli/generate/templates/application.js`);
    const server = await require(`cli/generate/templates/server.js`);
    const webpack = await require(`cli/generate/templates/webpack.js`);
    const layout = await ejs(`cli/generate/templates/layout.ejs`, {
      title,
    });
    const env = await require(`cli/generate/templates/env-config.js`);
    const ui = await require(`cli/generate/templates/ui.js`);
    const css = await require(`cli/generate/templates/ui.css`);

    console.log(`Creating new application '${name}'...`);

    //throw new Error(app);

    await mkdir(name);
    await mkdir(`${name}/bin`);
    await mkdir(`${name}/controllers`);
    await mkdir(`${name}/config`);
    await mkdir(`${name}/config/environments`);
    await mkdir(`${name}/models`);
    await mkdir(`${name}/mailers`);
    await mkdir(`${name}/templates`);
    await mkdir(`${name}/templates/layouts`);
    await mkdir(`${name}/tests`);
    await mkdir(`${name}/tests/controllers`);
    await mkdir(`${name}/tests/models`);
    await mkdir(`${name}/tests/mailers`);
    await mkdir(`${name}/tests/views`);
    await mkdir(`${name}/views`);
    await mkdir(`${name}/src`);
    await writeFile(`${name}/index.js`, encode(app));
    await writeFile(`${name}/webpack.config.js`, encode(webpack));
    await writeFile(`${name}/config/server.js`, encode(server));
    await writeFile(
      `${name}/templates/layouts/default.html.ejs`,
      encode(layout.toString()),
    );
    await writeFile(
      `${name}/config/environments/development.js`,
      encode(decode(env)),
    );
    await writeFile(`${name}/config/environments/test.js`, encode(env));
    await writeFile(
      `${name}/config/environments/production.js`,
      encode(decode(env)),
    );
    await writeFile(`${name}/index.js`, encode(app));
    await writeFile(`${name}/src/index.js`, encode(ui));
    await writeFile(`${name}/src/index.css`, encode(css));

    console.log("Installing dependencies...");

    command = run({
      cmd: [
        "deno",
        "install",
        "--unstable",
        `--allow-read=./${name}`,
        `--allow-write=./${name}`,
        "--allow-net",
        "--root",
        `./${name}/bin`,
        "--name",
        "server",
        `${name}/config/server.js`,
      ],
    });
    errors = await command.errors;
    await command.status();

    if (!errors) {
      console.log("Installing frontend dependencies...");
      command = run({ cmd: ["yarn", "init", "-yps"], cwd: name });
      errors = await command.errors;
      await command.status();
    }

    if (!errors) {
      command = run({
        cmd: ["yarn", "add", "webpack", "-D", "-s", ...packages],
        cwd: name,
      });
      errors = await command.errors;
      await command.status();
    }

    if (errors) {
      throw new Error(`Error installing dependencies: ${errors}`);
    }

    const original = await readJson(`${Deno.cwd()}/${name}/package.json`);
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

    writeFile(`${name}/package.json`, encode(JSON.stringify(config, null, 2)));

    console.log(`Application '${name}' has been created!`);
    Deno.exit(0);
  } catch (e) {
    console.error(`Application '${name}' failed to create:`);
    console.error(e);
    Deno.exit(1);
  }
}
