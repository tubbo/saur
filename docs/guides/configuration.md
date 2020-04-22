---
layout: page
path: /guides/configuration.html
---


# Configuration

A Saur app is configured in the **index.js** file at the root of your
application, and in the environment-specific files found in
**config/environments**. When initialized, the app will apply
its main configuration that it was instantiated with first, and move on
to environment-specific configuration to apply overrides. Initializers
that you define with `App.initialize` will be run after the
environment-specific configuration is applied.

## Settings

- **forceSSL:** Set this to `true` to redirect non-SSL requests to the
  SSL domain.
- **server:** Settings passed into Deno's `http.Server` through Oak.
  Defaults to `{ port: 3000 }`.
- **serveStaticFiles:** Whether to serve files from `./public` in the
  app root. Defaults to `true`.
- **log:** Settings for the application logger available at `App.log`
    - **log.level:** Level of logs to render. Defaults to `"INFO"`.
    - **log.formatter:** Log formatter string compatible with Deno's
      logger syntax.
- **db:** Configure the database adapter. Additional settings depend on the
  adapter you're using.
  - **db.adapter:** Adapter name. Defaults to `"postgres"`.
- **hosts:** A list of hosts that the app will respond to. Defaults to
  `["localhost"]`.
- **contentSecurityPolicy:** Settings for the `Content-Security-Policy`
  header. Defaults to only allowing connections from the local domain.
- **cors:** CORS settings for the `Allow-Access-Control-*` headers.
- **cache:** Configure the cache adapter. Additional settings depend on
  the adapter you're using.
  - **cache.enabled:** Whether to cache responses. Defaults to `false`.
  - **cache.adapter:** Adapter name. Defaults to `"memory"`.
  - **cache.http.enabled:** Whether to cache full page responses.
    Defaults to `false`.
  - **cache.http.expires:** How long before HTTP cache expires in
    seconds. Defaults to `900`, which is 15 minutes.
- **mail:** Configure email delivery
    - **mail.smtp.hostname:** SMTP server
    - **mail.smtp.username:** SMTP username
    - **mail.smtp.password:** SMTP password
    - **mail.smtp.port:** SMTP port. Defaults to `25`
    - **mail.request.protocol:** The protocol name (http or https) that
      is used when generating paths for email. Defaults to `"http"`.
    - **mail.request.hostname:** Default host for emails. Defaults to
      `"localhost"`.
- **template:** Configure template handling
    - **template.layout:** Default layout for templates. Default: `"default"`
    - **template.handlers:** Map of template handlers that the
      Template class will load, with the keys as their extensions and
      the values being the function used to render the template.
- **assets:** Asset compilation
    - **assets.enabled:** Enable per-request Webpack compilation
    - **assets.matcher:** Regex for finding  assets to load from
      Webpack. Defaults to `.js` and `.css` files only.
