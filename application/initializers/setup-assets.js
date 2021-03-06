import { existsSync } from "https://deno.land/std/fs/exists.ts";
import CompileAssets from "../middleware/compile-assets.js";
import AssetsCompiler from "../assets-compiler.js";

const { removeSync, watchFs } = Deno;

function clean(root) {
  if (existsSync(`${root}/public/main.js`)) {
    removeSync(`${root}/public/main.js`);
  }

  if (existsSync(`${root}/public/main.css`)) {
    removeSync(`${root}/public/main.css`);
  }
}

export default async function SetupAssets(app) {
  if (app.config.assets.enabled) {
    const root = app.root.replace("file://", "");
    const watcher = watchFs(`${root}/src`);

    app.use(CompileAssets);
    clean(root);
    AssetsCompiler(app, "/main.js");

    for await (const event of watcher) {
      event.paths.forEach((path) => {
        app.log.debug(`Reloading ${path}`);
      });

      clean(root);
    }
  }
}
