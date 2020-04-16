import Template from "./view/template.js"

export default class View {
  static template = null

  constructor(controller) {
    this.controller = controller
    this.template = new Template(
      this.constructor.template,
      this.controller.layout
    )
    this.url_for = App.routes.resolve.bind(App)
  }

  render(partial, context={}) {
    const template = new Template(partial)

    return template.compile(context)
  }

  cache(key, options={}, fresh) {
    return App.cache.fetch(key, fresh)
  }
}
