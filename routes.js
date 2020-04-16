import { Router } from "https://deno.land/x/oak/mod.ts"
import RouteSet from "./routes/route-set.js"
import MissingRouteError from "./errors/missing-route.js"

export default class Routes {
  constructor(app) {
    this.app = app
    this.router = new Router()
    this.set = new RouteSet(this.router)
    this.draw = this.set.draw.bind(this.set)
  }

  get methods() {
    return this.router.allowedMethods()
  }

  get all() {
    return this.router.routes()
  }

  /**
   * Find the first matching route given the controller, action, and
   * parameters.
   */
  resolve(controller, action, params={}) {
    let url
    this.set.forEach
    const keys = Object.keys(params)
    const route = this.set.routes.find(route => (
      route.controller === controller &&
        route.action === action &&
        keys.filter(key => path.match(`:${key}`)).length
    ))

    if (!route) {
      throw new MissingRouteError(controller, action, params)
    }

    return keys.reduce((k, p) => p.replace(`:${k}`, params[k]), route.path)
  }

  private perform(context, Controller, action) {
    const controller = new Controller(context)

    controller.perform(action)
  }
}
