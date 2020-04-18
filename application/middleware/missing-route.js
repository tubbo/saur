export default async function MissingRoute(context, next, app) {
  if (!context.response.body) {
    context.response.body = `No route matches ${context.request.url}`;
    context.response.status = 404;
  }

  pp.log.warning(`No route matches ${context.request.url}`);

  await next();
}
