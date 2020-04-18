import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";

/**
 * Generate and verify the authenticity token for each request.
 */
export default function AuthenticityToken(context, next) {
  if (context.request.method === "GET") {
    next();
    return;
  }

  const hash = new Hash("sha1");
  const timestamp = new Date().getTime();
  const source = `${encode(timestamp)}|${App.secret}`;
  const digest = hash.digest(source);
  App.authenticityToken = digest.hex();

  next();

  const token =
    context.params.authenticity_token ||
    context.request.headers.get("X-Authenticity-Token");

  if (token !== App.authenticityToken) {
    throw new Error(`Invalid authenticity token: "${token}"`);
  }
}
