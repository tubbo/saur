export default async function MethodOverride(context, next) {
  if (context.request.searchParams._method) {
    context.request._serverRequest.method =
      context.request.searchParams._method;
  }

  await next();
}
