export default function CORS(context, next) {
  const { cors } = App.config;

  if (!cors.length) {
    next();
    return;
  }

  const defaultResource = cors.resources.find((resource) =>
    resource.path === "*"
  );
  const matchingResource = cors.resources.find((resource) => (
    context.request.url.match(resource.path)
  ));
  const resource = matchingResource || defaultResource;

  if (!resource) {
    next();
    return;
  }

  const { origins } = cors;
  const { headers, methods } = resource;
  const origin = origins.join(" ");

  context.response.headers.set("Access-Control-Allow-Origin", origin);

  if (headers) {
    context.response.headers.set("Access-Control-Expose-Headers", headers);
  }

  if (methods) {
    context.response.headers.set("Access-Control-Allow-Methods", methods);
  }

  next();
}
