const { readFile } = Deno;

/**
 * Responsible for running Webpack when an asset needs to be compiled.
 */
export default async function AssetsCompiler(app, url) {
  let status, body;
  const root = app.root.replace("file://", "");
  const path = `${root}/public${url}`;

  app.log.info("Compiling assets...");

  try {
    const command = Deno.run({
      cwd: root,
      cmd: ["yarn", "--silent", "build"],
    });
    const errors = await command.errors;

    if (errors) {
      throw new Error(errors);
    }

    await command.status();

    body = await readFile(path);
    status = 200;

    app.log.info("Compilation succeeded!");
  } catch (e) {
    status = 500;
    body = e.message;

    app.log.error(`Compilation failed for ${path}: ${e.message}`);
  }

  return { status, body };
}
