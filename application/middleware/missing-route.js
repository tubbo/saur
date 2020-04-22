/**
 * This occurs when the end of the middleware stack is reached and
 * nothing has rendered a response yet.
 */
export default function MissingRoute(context, next, app) {
  const message = `No route matches "${context.request.url}"`;

  if (!context.response.body) {
    context.response.body = message;
    context.response.status = 404;
  }

  app.log.warning(message);
}
