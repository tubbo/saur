import Token from "../token.js";

/**
 * Verify the authenticity token for each request, disallowing requests
 * that don't include the correct token in either a param or the
 * header. This prevents cross-site request forgery by ensuring any
 * request which can potentially change data is coming from the current
 * host. It can be disabled on a per-request basis by setting the
 * `app.config.authenticity.ignore` array.
 */
export default async function AuthenticityToken(context, next, app) {
  if (context.request.method === "GET") {
    await next();
    return;
  }

  const date = new Date(context.request.headers.get("Date"));
  const token = new Token(date, app.config.secret);
  const param = context.request.searchParams.authenticity_token;
  const header = context.request.headers.get("X-Authenticity-Token");
  const input = param || header;

  if (token != input) {
    app.log.error(`Invalid authenticity token: "${token}"`);
    return;
  }

  await next();
}
