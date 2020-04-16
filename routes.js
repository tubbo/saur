import { Router } from "https://deno.land/x/oak/mod.ts"
import RouteSet from "./route-set.js"
import Namespace, { ResourceNamespace } from "./namespace.js"

export default class Routes {
  constructor(app) {
    this.app = app
    this.router = new Router()
  }

  get methods() {
    return this.router.allowedMethods()
  }

  get all() {
    return this.router.routes()
  }

  draw(routing) {
    routing.apply(this)
  }

  get(path, Controller, action) {
    this.stack.push({ path, Controller, action })
    this.router.get(path, partial(this.perform, Controller, action))
  }

  post(path, Controller, action) {
    this.stack.push({ path, Controller, action })
    this.router.post(path, partial(this.perform, Controller, action))
  }

  put(path, Controller, action) {
    this.stack.push({ path, Controller, action })
    this.router.put(path, partial(this.perform, Controller, action))
  }

  patch(path, Controller, action) {
    this.stack.push({ path, Controller, action })
    this.router.patch(path, partial(this.perform, Controller, action))
  }

  delete(path, Controller, action) {
    this.stack.push({ path, Controller, action })
    this.router.delete(path, partial(this.perform, Controller, action))
  }

  namespace(path, nested) {
    const ns = new Namespace(path, this.router)
    ns.draw(nested)
  }

  resources(base, Controller, nested) {
    const path = { collection: base, member: `${base}/:id` }
    const cns = new ResourceNamespace(path.collection, this.router, Controller)
    const mns = new ResourceNamespace(path.member, this.router, Controller)

    this.get(path.collection, Controller, "index")
    this.post(path.collection, Controller, "create")
    this.get(`${path.collection}/new`, Controller, "new")
    this.get(path.member, Controller, "show")
    this.get(`${path.member}/edit`, Controller, "edit")
    this.put(path.member, Controller, "update")
    this.patch(path.member, Controller, "update")
    this.delete(path.member, Controller, "destroy")

    nested(cns.draw.bind(cns), mns.draw.bind(mns))
  }

  resolve(Controller, action, params={}) {
    const keys = Object.keys(params)
    const route = this.stack.find(route => (
      route.Controller === Controller &&
        route.action === action &&
        keys.filter(key => path.match(`:${key}`)).length
    ))

    if (!route) {
      throw new Error("No route matches")
    }

    return keys.reduce((k, p) => p.replace(`:${k}`, params[k]), route.path)
  }

  root(Controller, action) {
    this.get("/", Controller, action)
  }

  namespace(path, routes) {
    routes.call(this)
  }

  private perform(context, Controller, action) {
    const controller = new Controller(context)

    controller.perform(action)
  }
}
