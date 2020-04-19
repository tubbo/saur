import { extname } from "https://deno.land/std/path/mod.ts";

/**
 * Run the `App.config.assets.webpack` command when an asset is
 * requested, then serve it.
 */
export default async function CompileAssets(context, next, app) {
  const ext = extname(context.request.url);
  const type = ext === ".js" ? "text/javascript" : "text/css";
  const path = `${App.root}/public/${context.request.url}`;

  if (!app.config.assets.formats.contains(type)) {
    app.log.info(`${type} assets are not compiled, rendering static file`);
    next();
  }

  app.log.info("Compiling assets...");
  try {
    Deno.run({ cwd: app.root, cmd: ["yarn", "run", "webpack"] });
  } catch (e) {
    app.log.error("Compilation failed:", e);

    context.response.status = 500;
    context.response.body = e.message;

    return;
  }
  app.log.info("Compilation succeeded!");

  context.response.status = 200;
  context.response.body = await Deno.readFile(path);
  context.response.headers.set("Content-Type", type);

  app.log.info(`Rendered ${context.request.url} from compiled assets`);
}
