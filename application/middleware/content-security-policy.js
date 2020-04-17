export default function ContentSecurityPolicy(context, next) {
  const { hosts, contentSecurityPolicy } = App.config
  const domains = hosts.length ? hosts.join(" ") : ""
  const policy = reduce(contentSecurityPolicy, (value, key, policy) => {
    `${policy}; ${key} ${value}`
  }, `default-src 'self' ${domains}`)

  context.headers.set("Content-Security-Policy", policy)
  next()
}
