import { send } from "https://deno.land/x/oak/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

/**
 * Serve static files from the ./public directory.
 */
export default async function StaticFiles(context, next, app) {
  try {
    const root = `${Deno.cwd()}/public`;
    const index = "index.html";
    const path = context.request.url.pathname;
    const dir = path.match(/\/$/);
    const exists = existsSync(`${root}/${context.request.path}`);

    if (dir || !exists) {
      await next();
      return;
    }

    app.log.info(`Serving static file "${context.request.path}"`);

    await send(context, context.request.path, { root, index });
  } catch (e) {
    console.log(e);
    await next();
  }
}
