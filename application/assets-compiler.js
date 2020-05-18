import { existsSync } from "https://deno.land/std/fs/mod.ts";

const { readFile } = Deno;

/**
 * Responsible for running Webpack when an asset needs to be compiled.
 */
export default async function AssetsCompiler(app, url) {
  let status, body;
  const root = app.root.replace("file://", "");
  const path = `${root}/public${url}`;

  try {
    if (!existsSync(path)) {
      app.log.info("Compiling assets...");
      const command = Deno.run({
        cwd: root,
        cmd: ["yarn", "--silent", "build"],
      });
      const errors = await command.errors;

      if (errors) {
        throw new Error(errors);
      }

      await command.status();
      app.log.info("Compilation succeeded!");
    }

    body = await readFile(path);
    status = 200;
  } catch (e) {
    status = 500;
    body = e.message;

    app.log.error(`Compilation failed for ${path}: ${e.message}`);
  }

  return { status, body };
}
