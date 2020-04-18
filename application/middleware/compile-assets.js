import { extname } from "https://deno.land/std/fs/mod.ts";

/**
 * Run the `App.config.assets.webpack` command when an asset is
 * requested, then serve it.
 */
export default async function CompileAssets(context, next) {
  const ext = extname(context.request.url);
  const type = ext === ".js" ? "text/javascript" : "text/css";
  const path = `${App.root}/public/${context.request.url}`;

  if (!App.config.assets.formats.contains(type)) {
    App.log.info(`${type} assets are not compiled, rendering static file`);
    next();
  }

  App.log.info("Compiling assets...");
  try {
    Deno.run({ cwd: App.root, cmd: ["yarn", "run", "webpack"] });
  } catch (e) {
    App.log.error("Compilation failed:", e);

    context.response.status = 500;
    context.response.body = e.message;

    return;
  }
  App.log.info("Compilation succeeded!");

  context.response.status = 200;
  context.response.body = await Deno.readFile(path);
  context.response.headers.set("Content-Type", type);

  App.log.info(`Rendered ${context.request.url} from compiled assets`);
}
