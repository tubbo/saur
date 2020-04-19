export default function MethodOverride(context, next) {
  /*if (context.request.params._method) {
    context.request.method = context.request.params._method;
  }*/

  next();
}
