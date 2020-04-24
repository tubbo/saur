import each from "https://deno.land/x/lodash/each.js";

const CACHEABLE_RESPONSE_CODES = [
  200, // OK
  203, // Non-Authoritative Information
  300, // Multiple Choices
  301, // Moved Permanently
  302, // Found
  404, // Not Found
  410, // Gone
];

/**
 * Read the response from the cache if it exists, otherwise write the
 * response to the cache.
 */
export default function HTTPCaching(ctx, next, app) {
  const shouldHTTPCache =
    app.cache.httpEnabled &&
    CACHEABLE_RESPONSE_CODES.includes(ctx.response.status) &&
    ctx.response.method === "GET" &&
    ctx.response.headers.has("Cache-Control") &&
    ctx.response.headers.has("ETag");
  const hit = ({ status, headers, body }) => {
    app.log.info(`Serving "${ctx.request.url}" from cache`);
    each(headers, (v, h) => ctx.response.headers.set(h, v));
    ctx.response.status = status;
    ctx.response.body = body;
  };

  if (shouldHTTPCache) {
    app.cache.http(ctx.request.url, next, ctx, hit);
  }
}
