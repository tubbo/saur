export default function ContentSecurityPolicy(context, next, app) {
  const { hosts, contentSecurityPolicy } = app.config;
  const domains = hosts.length ? hosts.join(" ") : "";
  const policy = reduce(contentSecurityPolicy, (value, key, policy) => {
    `${policy}; ${key} ${value}`;
  }, `default-src 'self' ${domains}`);

  context.headers.set("Content-Security-Policy", policy);
  next();
}
