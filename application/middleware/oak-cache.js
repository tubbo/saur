import each from "https://deno.land/x/lodash/each.js"

/**
 * Read the response from the cache if it exists, otherwise write the
 * response to the cache.
 */
export default function OakCache(ctx, next) {
  const shouldHTTPCache = App.cache.httpEnabled &&
                            ctx.response.method === "GET" &&
                            ctx.response.headers.has("Cache-Control") &&
                            ctx.response.headers.has("ETag") &&

  if (shouldHTTPCache) {
    App.cache.http(ctx.request.url, next, ctx, ({ status, headers, body }) => {
      each(headers, (v, h) =>  ctx.response.headers.set(h, v));
      ctx.response.status = status
      ctx.response.body = body
    })
  }
}
