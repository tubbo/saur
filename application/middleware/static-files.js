import { send } from "https://deno.land/x/oak/mod.ts";

/**
 * Serve static files from the ./public directory.
 */
export default async function StaticFiles(context) {
  const root = `${Deno.cwd()}/public`

  await send(context, context.request.path, { root, index: "index.html" })
}
