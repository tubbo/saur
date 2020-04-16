import each from "https://deno.land/x/lodash/each.js"

export default class Controller {
  /**
   * Perform a request using an action method on this controller.
   */
  static perform(action) {
    return context => {
      const controller = new this(context)
      const handler = controller[method].bind(controller)
      const params = context.request.params

      handler(params)
    }
  }

  constructor(context, config) {
    this.request = context.request
    this.response = context.response
    this.config = config
    this.layout = this.constructor.layout || config.layout
    this.status = 200
    this.headers = {}
  }

  /**
   * Prepare the response for rendering by setting its status and
   * headers based on the information in the controller.
   */
  prepare() {
    this.response.status = this.status
    each(this.headers, (header, value) => this.response.set(header, value))
  }

  /**
   * Render the given view's template using an instance as context.
   */
  private render(View) {
    const view = new View(this)

    this.prepare()
    this.response.body = view.template.render(view)
  }

  /**
   * Redirect to an entirely new location
   */
  private redirect(action, { controller=null, params={} })
    controller = controller || this
    const url = App.routes.resolve(controller, action, params)
    this.status = 302
    this.headers["Location"] = url
    this.response.body = `You are being <a href="${url}">redirected</a>`
  }

  private head(status) {
    this.status = status
    this.prepare()
  }
}
