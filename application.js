import * as path from "https://deno.land/std/path/mod.ts";
import { Application as Oak } from "https://deno.land/x/oak/mod.ts";
import Routes from "./routes.js";
import Database from "./application/database.js";
import Cache from "./application/cache.js";
import DEFAULTS from "./application/defaults.js";

import RequestLogger from "./application/middleware/logger.js";
import RequestTimer from "./application/middleware/timing.js";

import ServeStaticFiles from "./application/initializers/serve-static-files.js";
import ForceSSL from "./application/initializers/force-ssl.js";
import EnvironmentConfig from "./application/initializers/environment-config.js";
import Assets from "./application/initializers/assets.js";
import Logging from "./application/initializers/logging.js";

import MethodOverride from "./application/middleware/method-override.js";
import CSP from "./application/middleware/content-security-policy.js";
import CORS from "./application/middleware/cors.js";
import AuthenticityToken from "./application/middleware/authenticity-token.js";
import MissingRoute from "./application/middleware/missing-route.js";

export default class Application {
  constructor(config = {}) {
    this.config = { ...DEFAULTS, ...config };
    this.oak = new Oak();
    this.routes = new Routes();
    this.use = this.oak.use.bind(this.oak);
    this.root = path.resolve(this.config.root || Deno.cwd());
    this.initializers = [];

    this.initialize(Logging);
    this.initialize(EnvironmentConfig);
    this.initialize(ServeStaticFiles);
    this.initialize(Assets);
    this.iniitalize(ForceSSL);

    this.use(RequestLogger);
    this.use(RequestTimer);
    this.use(MethodOverride);
    this.use(AuthenticityToken);
    this.use(CSP);
    this.use(CORS);
    this.use(Assets);
  }

  /**
   * Run the code given in the callback when the app initializes.
   */
  initializer(init) {
    this.initializers.push(init);
  }

  /**
   * Run all initializers for the application.
   */
  initialize() {
    this.initializers.forEach(async (init) => {
      await init(this);
    });
  }

  /**
   * Apply routing and start the application server.
   */
  async start() {
    this.log.info(`Starting server on port ${this.config.server.port}`);

    this.use(this.routes.all);
    this.use(this.routes.methods);
    this.use(MissingRoute);

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
