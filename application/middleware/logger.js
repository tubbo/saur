import reduce from "https://deno.land/x/lodash/reduce.js";

export default async function logger(ctx, next, app) {
  const { method, url } = ctx.request;
  const params = reduce(
    ctx.params || {},
    (value, key, p) => `${p}, ${key}: "${value}"`,
    "",
  );

  app.log.info(`Requesting ${method} "${url}" (Parameters: {${params}})`);

  await next();

  const time = ctx.response.headers.get("X-Response-Time");
  const status = ctx.response.status || 404;

  app.log.info(`Responded with ${status} in ${time}`);
}
