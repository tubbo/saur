import reduce from "https://deno.land/x/lodash/reduce.js";

export default async function ContentSecurityPolicy(context, next, app) {
  const { hosts, contentSecurityPolicy } = app.config;

  if (contentSecurityPolicy) {
    const domains = hosts.length ? hosts.join(" ") : "";
    const policy = reduce(
      contentSecurityPolicy,
      (value, key, policy) => {
        `${policy}; ${key} ${value}`;
      },
      `default-src 'self' ${domains}`,
    );

    context.response.headers.set("Content-Security-Policy", policy);
  }

  await next();
}
