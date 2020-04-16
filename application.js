import { cwd } from Deno
import * as path from "https://deno.land/std/path/mod.ts"
import Oak from "https://deno.land/x/oak/mod.ts"
import Routes from "./routes"
import Database from "./application/database.js"
import Cache from "./application/cache.js"
import DEFAULTS from "./application/defaults.js
import SSLRedirect from "./application/middleware/ssl.js"

export default class Application {
  constructor(config=DEFAULTS) {
    this.config = config
    this.oak = new Oak.Application()
    this.routes = new Routes()
    this.use = this.oak.use.bind(this.oak)
    this.root = path.resolve(cwd())
    this.initializers = []
  }

  /**
   * Run the code given in the callback when the app initializes.
   */
  initialize(initializer) {
    this.initializers.push(initializer)
  }

  /**
   * Run all initialization code and start the app server.
   */
  async start() {
    this.initialize(app => app.config.forceSSL && app.use(SSLRedirect))
    this.initializers.forEach(initializer => initializer(this))
    this.use(this.routes.all)
    this.use(this.routes.methods)

    await this.oak.listen(this.config.server)
  }

  /**
   * Database connection for the application.
   */
  get db() {
    const Adapter = Database.ADAPTERS[this.config.db.adapter]

    return new Adapter(this.config.db)
  }

  /**
   * Cache database connection for the application.
   */
  get cache() {
    const Adapter = Cache.ADAPTERS[this.config.cache.adapter]

    return new Adapter(this.config.cache)
  }
}
