import { extname } from "https://deno.land/std/path/mod.ts";

/**
 * Run the `App.config.assets.webpack` command when an asset is
 * requested, then serve it.
 */
export default async function CompileAssets(context, next, app) {
  const ext = extname(context.request.url).replace(".", "");
  const type = app.config.assets.formats[ext];
  const root = app.root.replace("file://", "");
  const path = `${root}/public${context.request.url}`;

  if (!type) {
    await next();
    return;
  }

  app.log.info("Compiling assets...");
  try {
    const command = Deno.run({
      cwd: root,
      cmd: ["yarn", "build"],
    });
    const errors = await command.errors;

    if (errors) {
      throw new Error(errors);
    }

    await command.status();
  } catch (e) {
    app.log.error(`Compilation failed for ${path}: ${e.message}`);

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
