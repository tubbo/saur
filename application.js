import * as path from "https://deno.land/std/path/mod.ts";
import { Application as Oak } from "https://deno.land/x/oak/mod.ts";
import Routes from "./routes.js";
import Database from "./application/database.js";
import Cache from "./application/cache.js";
import DEFAULTS from "./application/defaults.js";

import ServeStaticFiles from "./application/initializers/serve-static-files.js";
import ForceSSL from "./application/initializers/force-ssl.js";
import EnvironmentConfig from "./application/initializers/environment-config.js";
import Assets from "./application/initializers/assets.js";
import Logging from "./application/initializers/logging.js";
import DefaultMiddleware from "./application/initializers/default-middleware.js";

import MissingRoute from "./application/middleware/missing-route.js";

export default class Application {
  constructor(config = {}) {
    this.config = { ...DEFAULTS, ...config };
    this.oak = new Oak();
    this.routes = new Routes();
    this.use = this.oak.use.bind(this.oak);
    this.root = path.resolve(this.config.root || Deno.cwd());
    this.initializers = [];
    this.plugins = [];
    this.setup();
  }

  /**
   * Run the code given in the callback when the app initializes.
   */
  initializer(Init) {
    this.initializers.push(Initializer);
  }

  /**
   * Add routes, initializers, and configuration from a plugin.
   */
  include(plugin) {
    this.plugins.push(plugin);
  }

  /**
   * Run immediately after instantiation, this is responsible for
   * setting up the list of default initializers prior to any other
   * initializers getting loaded.
   */
  setup() {
    this.initializer(Logging);
    this.initializer(EnvironmentConfig);
    this.initializer(ServeStaticFiles);
    this.initializer(Assets);
    this.initializer(ForceSSL);
    this.initializer(DefaultMiddleware);
  }

  /**
   * Run all initializers for the application.
   */
  initialize() {
    this.log.info("Initializing Saur application");
    this.plugins.forEach((plugin) => plugin.initialize(this));
    this.initializers.forEach((init) => init(this));
  }

  template(name) {
    return new Template(path, this.root, config.template);
  }

  /**
   * Apply routing and start the application server.
   */
  async start() {
    this.log.info(
      `Starting application server on port ${this.config.server.port}`,
    );

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

    return new Adapter(this.config.db, this.log);
  }

  /**
   * Cache database connection for the application.
   */
  get cache() {
    const Adapter = Cache.adapt(this.config.cache.adapter);

    return new Adapter(this.config.cache, this.log);
  }
}
