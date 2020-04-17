import * as path from "https://deno.land/std/path/mod.ts";
import { Application as Oak } from "https://deno.land/x/oak/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import Routes from "./routes.js";
import Database from "./application/database.js";
import Cache from "./application/cache.js";
import DEFAULTS from "./application/defaults.js";
import RequestLogger from "./application/middleware/logger.js";
import RequestTimer from "./application/middleware/timing.js";
import StaticFiles from "./application/middleware/static-files.js";
import MethodOverride from "./application/middleware/method-override.js";
import CSP from "./application/middleware/content-security-policy.js";
import CORS from "./application/middleware/cors.js";
import AuthenticityToken from "./application/middleware/authenticity-token.js";
import ForceSSL from "./application/initializers/force-ssl.js";
import EnvironmentConfig from "./application/initializers/environment-config.js";

export default class Application {
  constructor(config = {}) {
    this.config = { ...DEFAULTS, ...config };
    this.oak = new Oak();
    this.routes = new Routes();
    this.use = this.oak.use.bind(this.oak);
    this.root = path.resolve(Deno.cwd());
    this.initializers = [];
  }

  /**
   * Run the code given in the callback when the app initializes.
   */
  initializer(init) {
    this.initializers.push(init);
  }

  initialize() {
    this.initializers.forEach((initializer) => initializer(this));
  }

  /**
   * Run all initialization code and start the app server.
   */
  async start() {
    const { log: { level, formatter } } = this.config;

    await log.setup({
      handlers: {
        default: new log.handlers.ConsoleHandler(level, { formatter }),
      },
      loggers: {
        default: {
          level: level,
          handlers: ["default"],
        },
      },
    });

    this.log = log.getLogger();
    this.initializer(ForceSSL);
    this.initializer(EnvironmentConfig);
    this.use(RequestLogger);
    this.use(RequestTimer);
    this.use(MethodOverride);
    this.use(AuthenticityToken);
    this.use(CSP);
    this.use(CORS);
    this.initialize();
    this.use(this.routes.all);
    this.use(this.routes.methods);
    if (this.config.serveStaticFiles) {
      this.use(StaticFiles);
    }
    this.use(MissingRoute);

    this.log.info(`Starting server on port ${this.config.server.port}`);

    await this.oak.listen(this.config.server);
  }

  /**
   * Database connection for the application.
   */
  get db() {
    const Adapter = Database.adapt(this.config.db.adapter);

    return new Adapter(this.config.db);
  }

  /**
   * Cache database connection for the application.
   */
  get cache() {
    const Adapter = Cache.adapt(this.config.cache.adapter);

    return new Adapter(this.config.cache);
  }
}
