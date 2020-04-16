/**
 * RouteSet defines the routing DSL used by the top-level application
 * router. It uses `Oak.Router` under the hood, but pre-fills
 * information based on the current context and whether you've selected
 * a controller. Controllers are selected by providing a `resources()`
 * route, and base paths can be selected by themselves by providing a
 * `namespace()`.
 */
export default class RouteSet {
  constructor(router, { controller=null, base=null }) {
    this.router = router
    this.controller = controller
    this.base = base
    this.routes = []
    this.namespaces = []
  }

  /**
   * Call the function provided and pass in all of the routing methods
   * contextualized to this particular set. This enables "relative"
   * routing where calling e.g. `get()` within a `namespace()`
   * will nest the path of the GET request into the namespace itself.
   */
  draw(routing) {
    const get = this.get.bind(this)
    const post = this.post.bind(this)
    const put = this.put.bind(this)
    const patch = this.patch.bind(this)
    const delete = this.delete.bind(this)
    const resources = this.resources.bind(this)
    const namespace = this.namespace.bind(this)
    const root = this.root.bind(this)

    routing({ get, post, put, patch, delete, resources, namespace })
  }

  /**
   * Route a GET request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  get(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.get(path, controller.perform(action))
  }

  /**
   * Route a POST request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */

  post(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.post(path, controller.perform(action))
  }

  /**
   * Route a PUT request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  put(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.put(path, controller.perform(action))
  }

  /**
   * Route a PATCH request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  patch(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.patch(path, controller.perform(action))
  }

  /**
   * Route a DELETE request to the given path. You can also specify a
   * `controller` and `action`, but these options will default to the
   * top-level controller (if you're in a `resources()` block) and the
   * name of the path, respectively.
   */
  delete(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.delete(path, controller.perform(action))
  }

  /**
   * Define a RouteSet that is nested within this one.
   */
  namespace(path, routes) {
    const controller = this.controller
    const base = `${this.base}/${path}`
    const set = new RouteSet(this.router, { controller, base })
    namespaces.push({ path, controller, base })

    set.draw(routes)
  }

  /**
   * Define the index route to the application. This is always a GET
   * request.
   */
  root(action, controller) {
    this.get("/", { controller, action })
  }

  /**
   * Define a RESTful resource, which contains all
   * create/read/update/destroy actions as well as new/edit pages. You
   * can optionally also pass a function in which provides two route
   * sets of nested resources for the "collection" and "member" routes.
   */
  resources(path, controller, nested) {
    this.get(path, controller, "index")
    this.post(path, controller, "create")
    this.get(`${path}/new`, controller, "new")
    this.get(`${path}/:id`, controller, "show")
    this.get(`${path}/:id/edit`, controller, "edit")
    this.put(`${path}/:id`, controller, "update")
    this.patch(`${path}/:id`, controller, "update")
    this.delete(`${path}/:id`, controller, "destroy")

    if (nested) {
      const cs = new RouteSet(this.router, { controller, base: path })
      const ms = new RouteSet(this.router, { controller, base: `${path}/:id` })
      const collection = cs.draw.bind(cs)
      const member = ms.draw.bind(ms)

      nested({ collection, member })
    }
  }
}
