import { extname } from "https://deno.land/std/path/mod.ts";
import AssetsCompiler from "../assets-compiler.js";

/**
 * Run the `App.config.assets.webpack` command when an asset is
 * requested, then serve it.
 */
export default async function CompileAssets(context, next, app) {
  const ext = extname(context.request.url).replace(".", "");
  const type = app.config.assets.formats[ext];

  if (!type) {
    await next();
    return;
  }

  const { status, body } = await AssetsCompiler(app, context.request.url);

  context.response.status = status;
  context.response.body = body;
  context.response.headers.set("Content-Type", type);
}
