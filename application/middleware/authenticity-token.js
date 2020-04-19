import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";

/**
 * Generate and verify the authenticity token for each request.
 */
export default async function AuthenticityToken(context, next, app) {
  if (context.request.method === "GET") {
    await next();
    return;
  }

  const hash = new Hash("sha1");
  const timestamp = new Date().getTime();
  const source = `${encode(timestamp)}|${app.secret}`;
  const digest = hash.digest(source);
  app.authenticityToken = digest.hex();

  await next();

  const token =
    context.request.searchParams.authenticity_token ||
    context.request.headers.get("X-Authenticity-Token");

  if (token !== app.authenticityToken) {
    throw new Error(`Invalid authenticity token: "${token}"`);
  }
}
