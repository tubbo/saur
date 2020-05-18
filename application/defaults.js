import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import ReactDOMServer from "https://dev.jspm.io/react-dom/server";

const { readFile } = Deno;
const renderJSX = async (path, view) => {
  const exports = await import(path);
  const jsx = exports.default;

  return ReactDOMServer.renderToStaticMarkup(jsx(view));
};

export default {
  // Whether to force SSL connectivity. This just installs another
  // middleware into your stack at init time.
  forceSSL: false,

  // Deno.ListenOptions passed to the OAK server
  server: {
    port: 3000,
  },

  // Serve static files
  serveStaticFiles: true,

  log: {
    level: "INFO",
    formatter: "{datetime} [{levelName}] {msg}",
  },

  // Database configuration passed to the client, except the `adapter`
  // which is used to find the database adapter to instantiate.
  db: {
    adapter: "sqlite",
    database: "db/development.sqlite",
  },

  hosts: ["localhost"],

  contentSecurityPolicy: null,
  cors: {},

  // Cache configuration passed to the client, except the `enabled` and
  // `adapter` options which are used to bypass or instantiate the
  // cache, respectively.
  cache: {
    enabled: false,
    adapter: "memory",
    url: "redis://localhost:6379",
    http: {
      expires: 900,
      enabled: false,
    },
  },

  // Default environment to "development"
  environment: "development",

  mail: {
    smtp: {
      hostname: null,
      username: null,
      password: null,
      port: 25,
    },
    request: {
      protocol: "http",
      hostname: "localhost:3000",
    },
  },

  template: {
    // Default layout that will be passed into all controllers. This can
    // be changed on a controller-by-controller basis by setting the
    // static property `layout`.
    layout: "default",
    handlers: {
      txt: readFile,
      ejs: renderFile,
      jsx: renderJSX,
    },
  },

  assets: {
    enabled: true,
    formats: {
      js: "text/javascript",
      css: "text/css",
    },
  },

  authenticity: {
    token: "something-secret",
    ignore: [],
    hash: "sha1",
  },
};
