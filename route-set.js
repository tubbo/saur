const Route
class RouteSet {
  constructor(router, base=null, controller=null) {
    this.router = router
    this.base = base
    this.controller = controller
  }

  get(path, Controller, action) {
    path = this.resolve(path)
    this.stack.push({ path, Controller, action })
    this.router.get(path, partial(this.perform, Controller, action))
  }

  post(path, Controller, action) {
    path = this.resolve(path)
    this.stack.push({ path, Controller, action })
    this.router.post(path, partial(this.perform, Controller, action))
  }

  put(path, Controller, action) {
    path = this.resolve(path)
    this.stack.push({ path, Controller, action })
    this.router.put(path, partial(this.perform, Controller, action))
  }

  patch(path, Controller, action) {
    path = this.resolve(path)
    this.stack.push({ path, Controller, action })
    this.router.patch(path, partial(this.perform, Controller, action))
  }

  delete(path, Controller, action) {
    path = this.resolve(path)
    this.stack.push({ path, Controller, action })
    this.router.delete(path, partial(this.perform, Controller, action))
  }

  resources(path, Controller, nested) {
    path = this.resolve(path)
    this.get(path, Controller, "index")
    this.post(path, Controller, "create")
    this.get(`${path}/:id`, Controller, "show")
    this.put(`${path}/:id`, Controller, "update")
    this.patch(`${path}/:id`, Controller, "update")
    this.delete(`${path}/:id`, Controller, "destroy")

    const collection = new RouteSet(this.router, path)
    const member = new RouteSet(this.router, `${path}/:id`)

    nested(collection, member)
  }

  namespace(path, nested) {
    const routes = new RouteSet(this.router, path)

    nested.apply(routes)
  }

}
