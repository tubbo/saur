export default async function MissingRoute(context, next) {
  if (!context.response.body) {
    context.response.body = `No route matches ${context.request.url}`;
    context.response.status = 404;
  }

  App.log.warning(`No route matches ${context.request.url}`);

  await next();
}
