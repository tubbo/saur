import { extname } from "https://deno.land/std/path/mod.ts";
import AssetsCompiler from "../assets-compiler.js";

/**
 * Run the `App.config.assets.webpack` command when an asset is
 * requested, then serve it.
 */
export default async function CompileAssets(context, next, app) {
  const { pathname } = context.request.url;
  const ext = extname(pathname).replace(".", "");
  const type = app.config.assets.formats[ext];

  if (!type) {
    await next();
    return;
  }

  const { status, body } = await AssetsCompiler(app, pathname);

  context.response.status = status;
  context.response.body = body;
  context.response.headers.set("Content-Type", type);
}
