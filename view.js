import Template from "./template.js"

export default class View {
  static template = null

  constructor(controller) {
    this.controller = controller
    this.template = new Template(
      this.constructor.template,
      this.controller.layout
    )
  }

  render(partial, context={}) {
    const template = new Template(partial)

    return template.compile(context)
  }

  cache(key, options={}, fresh) {
    return App.cache.fetch(key, fresh)
  }
}
