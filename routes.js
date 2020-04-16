import { Router } from "https://deno.land/x/oak/mod.ts"
import RouteSet from "./route-set.js"
import Namespace, { ResourceNamespace } from "./namespace.js"

export default class Routes {
  constructor(app) {
    this.app = app
    this.router = new Router()
    this.set = new RouteSet(this.router)
  }

  get methods() {
    return this.router.allowedMethods()
  }

  get all() {
    return this.router.routes()
  }

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
      throw new Error("No route matches")
    }

    return keys.reduce((k, p) => p.replace(`:${k}`, params[k]), route.path)
  }

  private perform(context, Controller, action) {
    const controller = new Controller(context)

    controller.perform(action)
  }
}
