export default async function logger(ctx, next) {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  const { method, url } = ctx.request
  const status = ctx.response.status || 404

  App.log.info(`${method} ${url} - ${time} [${status}]`)
}
