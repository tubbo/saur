// import { send } from "https://deno.land/x/oak/mod.ts";

/**
 * Serve static files from the ./public directory.
 */
export default async function StaticFiles(context, next) {
  // const root = `${Deno.cwd()}/public`;

  next();
}
