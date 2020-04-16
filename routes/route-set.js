export default class RouteSet {
  constructor(router, { controller=null, base=null }) {
    this.router = router
    this.controller = controller
    this.base = base
    this.routes = []
    this.namespaces = []
  }

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

  get(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.get(path, partial(this.perform, { controller, action }))
  }

  post(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.post(path, partial(this.perform, { controller, action }))
  }

  put(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.put(path, partial(this.perform, { controller, action }))
  }

  patch(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.patch(path, partial(this.perform, { controller, action }))
  }

  delete(path, { controller=null, action=null }) {
    action = action || path
    controller = controller || this.controller

    this.routes.push({ path, controller, action })
    this.router.delete(path, partial(this.perform, { controller, action }))
  }

  namespace(path, routes) {
    const controller = this.controller
    const base = `${this.base}/${path}`
    const set = new RouteSet(this.router, { controller, base })
    namespaces.push({ path, controller, base })

    set.draw(routes)
  }

  root(controller, action=null) {
    this.get("/", { controller, action })
  }

  resources(path, controller, nested) {
    const collectionSet = new RouteSet(this.router, { controller, base: path })
    const memberSet = new RouteSet(this.router { controller, base: `${path}/:id` })
    const collection = collectionSet.draw.bind(collectionSet)
    const member = memberSet.draw.bind(memberSet)

    this.get(path.collection, controller, "index")
    this.post(path.collection, controller, "create")
    this.get(`${path.collection}/new`, controller, "new")
    this.get(path.member, controller, "show")
    this.get(`${path.member}/edit`, controller, "edit")
    this.put(path.member, controller, "update")
    this.patch(path.member, controller, "update")
    this.delete(path.member, controller, "destroy")

    nested({ collection, member })
  }
}
