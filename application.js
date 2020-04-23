import * as path from "https://deno.land/std/path/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import { Application as Oak } from "https://denopkg.com/Soremwar/oak@v0.41/mod.ts";
import Routes from "./routes.js";
import Database from "./application/database.js";
import Cache from "./application/cache.js";
import DEFAULTS from "./application/defaults.js";
import Token from "./application/token.js";

import EnvironmentConfig from "./application/initializers/environment-config.js";
import DefaultMiddleware from "./application/initializers/default-middleware.js";
import SetupAssets from "./application/initializers/setup-assets.js";

import MissingRoute from "./application/middleware/missing-route.js";

export default class Application {
  constructor(config = {}) {
    this.config = { ...DEFAULTS, ...config };
    this.oak = new Oak();
    this.routes = new Routes(this);
    this.root = path.dirname(this.config.root || Deno.cwd());
    this.initializers = [];
    this.plugins = [];
    this.setup();
  }

  /**
   * Run the code given in the callback when the app initializes.
   */
  initializer(Initializer) {
    this.initializers.push(Initializer);
  }

  /**
   * Add routes, initializers, and configuration from a plugin.
   */
  include(plugin) {
    this.plugins.push(plugin);
  }

  /**
   * Append an application middleware function to the Oak stack.
   * Application middleware functions apply an additional argument, the
   * current instance of the application.
   */
  use(middleware) {
    const appified = (context, next) => middleware(context, next, this);

    this.oak.use(appified);
  }

  /**
   * Run immediately after instantiation, this is responsible for
   * setting up the list of default initializers prior to any other
   * initializers getting loaded.
   */
  setup() {
    this.initializer(EnvironmentConfig);
    this.initializer(DefaultMiddleware);
    this.initializer(SetupAssets);
  }

  /**
   * Run all initializers for the application.
   */
  async initialize() {
    this.log = await this._setupLogging();

    this.log.info("Initializing Saur application");
    this.plugins.forEach((plugin) => plugin.initialize(this));
    this.initializers.forEach(async (init) => {
      await init(this);
    });
  }

  deliver(Mailer, action, ...options) {
    return Mailer.deliver(this, action, ...options);
  }

  /**
   * Apply routing and start the application server.
   */
  async start() {
    this.oak.use(this.routes.all);
    this.oak.use(this.routes.methods);
    this.use(MissingRoute);

    this.log.info(
      `Starting application server on port ${this.config.server.port}`,
    );
    await this.oak.listen(this.config.server);
  }

  /**
   * Authenticity token for the current time and secret key base.
   */
  get authenticityToken() {
    return new Token(new Date(), this.config.authenticity);
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

  async _setupLogging() {
    const {
      log: { level, formatter },
    } = this.config;

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

    return log.getLogger();
  }
}
