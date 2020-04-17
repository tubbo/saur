import Template from "./view/template.js"

export default class View {
  static template = null

  constructor(controller) {
    this.controller = controller
    this.template = new Template(
      this.constructor.template,
      this.controller.layout
    )
    this.urlFor = App.routes.resolve.bind(App)
  }

  cache(key, options={}, fresh) {
    return App.cache.fetch(key, fresh)
  }

  linkTo(text, href, options={}) {
    return `<a href="${href}">${text}</a>`
  }

  /**
   * Render the given view's template using an instance as context.
   */
  async render(View) {
    const view = new View(this)
    const result = await view.template.partial(view)

    App.log.info(`Rendering partial ${view.template.path}`)

    return result.toString()
  }
}
