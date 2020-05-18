export default async function MethodOverride(context, next, app) {
  await next();
}
