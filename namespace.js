export default class Namespace {
  constructor(base, router) {
    this.base = base
    this.router = router
  }

  get(path, Controller, action) {
    this.router.get(this.expand(path), Controller, action)
  }

  post(path, Controller, action) {
    this.router.post(this.expand(path), Controller, action)
  }

  patch(path, Controller, action) {
    this.router.patch(this.expand(path), Controller, action)
  }

  put(path, Controller, action) {
    this.router.put(this.expand(path), Controller, action)
  }

  delete(path, Controller, action) {
    this.router.delete(this.expand(path), Controller, action)
  }

  resources(base, Controller, nested) {
    const path = {
      collection: this.expand(base),
      member: this.expand(`${base}/:id`)
    }
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

  namespace(path, nested) {
    const ns = new Namespace(this.expand(path), this.router)
    ns.draw(nested)
  }

  draw(routing) {
    routing.apply(this)
  }

  private expand(path) {
    return `${this.base}/${path}`
  }
}

export class ResourceNamespace extends Namespace {
  constructor(base, router, controller) {
    super(base, router)
    this.controller = controller
  }

  get(path, action=null) {
    action = action || path
    this.router.get(this.expand(path), this.controller, action)
  }

  post(path, action=null) {
    action = action || path
    this.router.post(this.expand(path), this.controller, action)
  }

  put(path, action=null) {
    action = action || path
    this.router.put(this.expand(path), this.controller, action)
  }

  patch(path, action=null) {
    action = action || path
    this.router.patch(this.expand(path), this.controller, action)
  }

  delete(path, action=null) {
    action = action || path
    this.router.delete(this.expand(path), this.controller, action)
  }
}
