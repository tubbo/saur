import each from "https://deno.land/x/lodash/each.js"

export default class Controller {
  constructor(context, config) {
    this.request = context.request
    this.response = context.response
    this.config = config
    this.layout = this.constructor.layout || config.layout
    this.status = 200
    this.headers = {}
  }

  /**
   * Perform the requested action in order to fulfill this request.
   */
  private perform(method) {
    const action = this[method]

    this.response.body = action(this.request.params)
    this.response.status = this.status
    each(this.headers, header, value => this.response.set(header, value))
  }

  /**
   * Render the given view's template using an instance as context.
   */
  private render(View) {
    const view = new View(this)

    return view.template.render(view)
  }

  /**
   * Redirect to an entirely new location
   */
  private redirect(Controller, action, params={}) {
    const url = this.app.routes.resolve(Controller, action, params)
    this.status = 302
    this.headers["Location"] = url

    return `You are being <a href="${url}">redirected</a>`
  }

  private head(status) {
    this.status = status
  }
}
