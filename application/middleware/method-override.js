export default function MethodOverride(context, next) {
  if (context.params._method) {
    context.request.method = context.params._method
  }

  next()
}
