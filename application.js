import { cwd } from Deno
import * as path from "https://deno.land/std/path/mod.ts"
import Oak from "https://deno.land/x/oak/mod.ts"
import Routes from "./routes"
import Database from "./database"
import Cache from "./cache"

export default class Application {
  constructor(config={}) {
    this.config = config
    this.oak = new Oak.Application()
    this.routes = new Routes()
    this.use = this.oak.use.bind(this.oak)
    this.root = path.resolve(cwd())
  }

  get db() {
    const Adapter = Database.ADAPTERS[this.config.db.adapter]

    return new Adapter(this.config.db)
  }

  get cache() {
    const Adapter = Cache.ADAPTERS[this.config.cache.adapter]

    return new Adapter(this.config.cache)
  }

  async listen(port=3000) {
    this.use(this.routes.all)
    this.use(this.routes.methods)

    await this.oak.listen({ port })
  }
}
